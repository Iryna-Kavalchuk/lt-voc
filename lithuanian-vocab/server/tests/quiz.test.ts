import { describe, it, expect, vi } from "vitest";
import type { DictionaryEntry } from "../../shared/types/dictionary.js";
import {
  sample,
  generateDistractors,
  buildQuestion,
  randomQuestion,
  checkAnswer,
} from "../src/quiz.js";

// ---------------------------------------------------------------------------
// Minimal fixture data (avoids hitting the real file system in unit tests)
// ---------------------------------------------------------------------------
const ENTRIES: DictionaryEntry[] = [
  {
    id: "lt_animals_001",
    word: "katė",
    translations: { en: "cat", ru: "кошка" },
    pos: "noun",
    gender: "feminine",
    category: "animals",
    level: "A1",
  },
  {
    id: "lt_animals_002",
    word: "šuo",
    translations: { en: "dog", ru: "собака" },
    pos: "noun",
    gender: "masculine",
    category: "animals",
    level: "A1",
  },
  {
    id: "lt_animals_003",
    word: "arklys",
    translations: { en: "horse", ru: "лошадь" },
    pos: "noun",
    gender: "masculine",
    category: "animals",
    level: "A1",
  },
  {
    id: "lt_family_001",
    word: "mama",
    translations: { en: "mother", ru: "мама" },
    pos: "noun",
    gender: "feminine",
    category: "family",
    level: "A1",
  },
  {
    id: "lt_colors_001",
    word: "raudonas",
    translations: { en: "red", ru: "красный" },
    pos: "adjective",
    category: "colors",
    level: "A1",
  },
  {
    id: "lt_colors_002",
    word: "mėlynas",
    translations: { en: "blue", ru: "синий" },
    pos: "adjective",
    category: "colors",
    level: "A1",
  },
  {
    id: "lt_colors_003",
    word: "žalias",
    translations: { en: "green", ru: "зелёный" },
    pos: "adjective",
    category: "colors",
    level: "A1",
  },
  {
    id: "lt_verbs_001",
    word: "eiti",
    translations: { en: "to go", ru: "идти" },
    pos: "verb",
    category: "movement",
    level: "A1",
  },
];

// ---------------------------------------------------------------------------
// sample()
// ---------------------------------------------------------------------------
describe("sample()", () => {
  it("returns exactly n items", () => {
    expect(sample(ENTRIES, 3)).toHaveLength(3);
  });

  it("returns all items when n >= arr.length", () => {
    expect(sample(ENTRIES, 100)).toHaveLength(ENTRIES.length);
  });

  it("returns an empty array when n is 0", () => {
    expect(sample(ENTRIES, 0)).toHaveLength(0);
  });

  it("does not mutate the original array", () => {
    const original = [...ENTRIES];
    sample(ENTRIES, 3);
    expect(ENTRIES).toEqual(original);
  });

  it("never returns duplicate items", () => {
    const result = sample(ENTRIES, ENTRIES.length);
    const ids = result.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ---------------------------------------------------------------------------
// generateDistractors()
// ---------------------------------------------------------------------------
describe("generateDistractors()", () => {
  const target = ENTRIES.find((e) => e.id === "lt_animals_001")!;

  it("returns exactly 3 distractors", () => {
    expect(generateDistractors(target, "en", ENTRIES)).toHaveLength(3);
  });

  it("does not include the correct answer", () => {
    const distractors = generateDistractors(target, "en", ENTRIES);
    expect(distractors).not.toContain("cat");
  });

  it("does not include duplicates", () => {
    const distractors = generateDistractors(target, "en", ENTRIES);
    expect(new Set(distractors).size).toBe(distractors.length);
  });

  it("works for Russian translations", () => {
    const distractors = generateDistractors(target, "ru", ENTRIES);
    expect(distractors).not.toContain("кошка");
    expect(distractors).toHaveLength(3);
  });

  it("handles a very small pool gracefully (fewer than 3 candidates)", () => {
    const tiny = ENTRIES.slice(0, 2); // only target + 1 other
    const distractors = generateDistractors(tiny[0], "en", tiny);
    expect(distractors.length).toBeLessThanOrEqual(3);
    expect(distractors).not.toContain(tiny[0].translations.en);
  });
});

// ---------------------------------------------------------------------------
// buildQuestion()
// ---------------------------------------------------------------------------
describe("buildQuestion()", () => {
  it("returns a well-formed QuizQuestion", () => {
    const q = buildQuestion("lt_animals_001", "en", ENTRIES);
    expect(q.entryId).toBe("lt_animals_001");
    expect(q.word).toBe("katė");
    expect(q.lang).toBe("en");
    expect(q.choices).toHaveLength(4);
    expect(q.correctIndex).toBeGreaterThanOrEqual(0);
    expect(q.correctIndex).toBeLessThan(4);
  });

  it("places the correct answer at correctIndex", () => {
    const q = buildQuestion("lt_animals_001", "en", ENTRIES);
    expect(q.choices[q.correctIndex]).toBe("cat");
  });

  it("defaults lang to 'en'", () => {
    const q = buildQuestion("lt_animals_001", undefined, ENTRIES);
    expect(q.lang).toBe("en");
  });

  it("throws when the entryId does not exist", () => {
    expect(() => buildQuestion("lt_nope_999", "en", ENTRIES)).toThrow(
      "Entry not found: lt_nope_999"
    );
  });

  it("produces 4 unique choices", () => {
    const q = buildQuestion("lt_animals_001", "en", ENTRIES);
    expect(new Set(q.choices).size).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// randomQuestion()
// ---------------------------------------------------------------------------
describe("randomQuestion()", () => {
  it("returns a valid question from the pool", () => {
    const q = randomQuestion("en", undefined, ENTRIES);
    expect(q.choices).toHaveLength(4);
    expect(q.correctIndex).toBeGreaterThanOrEqual(0);
  });

  it("restricts to the given category", () => {
    // Run several times to be statistically confident
    for (let i = 0; i < 10; i++) {
      const q = randomQuestion("en", "colors", ENTRIES);
      const colorWords = ENTRIES.filter((e) => e.category === "colors").map(
        (e) => e.word
      );
      expect(colorWords).toContain(q.word);
    }
  });

  it("throws when the category has no entries", () => {
    expect(() => randomQuestion("en", "nonexistent", ENTRIES)).toThrow(
      "No entries found for category: nonexistent"
    );
  });

  it("throws when the pool is empty", () => {
    expect(() => randomQuestion("en", undefined, [])).toThrow(
      "Dictionary is empty"
    );
  });
});

// ---------------------------------------------------------------------------
// checkAnswer()
// ---------------------------------------------------------------------------
describe("checkAnswer()", () => {
  const q = buildQuestion("lt_animals_001", "en", ENTRIES);

  it("returns correct: true when the right index is submitted", () => {
    const result = checkAnswer(q, q.correctIndex);
    expect(result.correct).toBe(true);
    expect(result.correctAnswer).toBe("cat");
  });

  it("returns correct: false for a wrong index", () => {
    const wrongIndex = q.correctIndex === 0 ? 1 : 0;
    const result = checkAnswer(q, wrongIndex);
    expect(result.correct).toBe(false);
  });

  it("always returns the correct answer string", () => {
    const result = checkAnswer(q, 99); // intentionally out of range
    expect(result.correctAnswer).toBe("cat");
  });
});
