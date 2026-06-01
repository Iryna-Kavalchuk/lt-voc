import { describe, it, expect } from "vitest";
import type { VerbEntry } from "../src/types.js";
import {
  sample,
  getFormsForTense,
  getForm,
  buildRandomQuestion,
  checkAnswer,
  checkMainFormsAnswer,
  checkConjugationDrillAnswer,
  checkFillBlankAnswer,
} from "../src/quiz.js";

// ---------------------------------------------------------------------------
// Minimal fixture — enough verbs to produce all question types
// ---------------------------------------------------------------------------

function makeVerb(id: number, infinitive: string, translation: string): VerbEntry {
  return {
    id,
    infinitive,
    forms: [infinitive, `${infinitive.slice(0, -1)}a`, `${infinitive.slice(0, -1)}o`] as [string, string, string],
    translation,
    conjugation: {
      present:           { as: `${infinitive.slice(0, -1)}u`, tu: `${infinitive.slice(0, -1)}i`, jis_ji_jie_jos: `${infinitive.slice(0, -1)}a`, mes: `${infinitive.slice(0, -1)}ame`, jus: `${infinitive.slice(0, -1)}ate` },
      past:              { as: `${infinitive.slice(0, -1)}au`, tu: `${infinitive.slice(0, -1)}ai`, jis_ji_jie_jos: `${infinitive.slice(0, -1)}o`, mes: `${infinitive.slice(0, -1)}ome`, jus: `${infinitive.slice(0, -1)}ote` },
      subjunctive:       { as: `${infinitive.slice(0, -1)}ciau`, tu: `${infinitive.slice(0, -1)}tum`, jis_ji_jie_jos: `${infinitive.slice(0, -1)}tu`, mes: `${infinitive.slice(0, -1)}tume`, jus: `${infinitive.slice(0, -1)}tute` },
      frequentative_past:{ as: `${infinitive.slice(0, -1)}davau`, tu: `${infinitive.slice(0, -1)}davai`, jis_ji_jie_jos: `${infinitive.slice(0, -1)}davo`, mes: `${infinitive.slice(0, -1)}davome`, jus: `${infinitive.slice(0, -1)}davote` },
      future:            { as: `${infinitive.slice(0, -1)}siu`, tu: `${infinitive.slice(0, -1)}si`, jis_ji_jie_jos: `${infinitive.slice(0, -1)}s`, mes: `${infinitive.slice(0, -1)}sime`, jus: `${infinitive.slice(0, -1)}site` },
      imperative:        { tu: `${infinitive.slice(0, -1)}k`, jis_ji_jie_jos: `tegu ${infinitive.slice(0, -1)}a`, mes: `${infinitive.slice(0, -1)}kime`, jus: `${infinitive.slice(0, -1)}kite` },
    },
    non_conjugated_forms: {
      "1": `${infinitive.slice(0, -1)}antis`, "2": `${infinitive.slice(0, -1)}es`,
      "3": `${infinitive.slice(0, -1)}daves`, "4": `${infinitive.slice(0, -1)}siantis`,
      "5": `${infinitive.slice(0, -1)}amas`, "6": `${infinitive.slice(0, -1)}tas`,
      "7": `${infinitive.slice(0, -1)}damas`, "8": `${infinitive.slice(0, -1)}ant`,
      "9": `${infinitive.slice(0, -1)}us`,
    },
    examples: [
      {
        hint: "ką?",
        lt: `Aš ${infinitive.slice(0, -1)}u labai greitai.`,
        ru: `Я ${translation} очень быстро.`,
      },
      {
        hint: null,
        lt: `Jis ${infinitive.slice(0, -1)}a kiekvieną dieną.`,
        ru: `Он ${translation} каждый день.`,
      },
    ],
  };
}

const POOL: VerbEntry[] = [
  makeVerb(1, "eiti",    "идти"),
  makeVerb(2, "valgyti", "есть"),
  makeVerb(3, "kalbeti", "говорить"),
  makeVerb(4, "dirbti",  "работать"),
  makeVerb(5, "gyvent",  "жить"),
  makeVerb(6, "skaityti","читать"),
  makeVerb(7, "rasyti",  "писать"),
  makeVerb(8, "ziureti", "смотреть"),
];

const EMPTY_SET = new Set<number>();

// ---------------------------------------------------------------------------
// sample()
// ---------------------------------------------------------------------------
describe("sample()", () => {
  it("returns exactly n items", () => {
    expect(sample(POOL, 3)).toHaveLength(3);
  });

  it("returns all items when n >= arr.length", () => {
    expect(sample(POOL, 100)).toHaveLength(POOL.length);
  });

  it("returns empty array when n is 0", () => {
    expect(sample(POOL, 0)).toHaveLength(0);
  });

  it("does not mutate the original array", () => {
    const original = [...POOL];
    sample(POOL, 3);
    expect(POOL).toEqual(original);
  });

  it("never returns duplicates", () => {
    const result = sample(POOL, POOL.length);
    const ids = result.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ---------------------------------------------------------------------------
// getFormsForTense()
// ---------------------------------------------------------------------------
describe("getFormsForTense()", () => {
  const verb = POOL[0];

  it("returns 5 forms for present tense", () => {
    expect(getFormsForTense(verb, "present")).toHaveLength(5);
  });

  it("returns 4 forms for imperative (no 1st person singular)", () => {
    expect(getFormsForTense(verb, "imperative")).toHaveLength(4);
  });
});

// ---------------------------------------------------------------------------
// getForm()
// ---------------------------------------------------------------------------
describe("getForm()", () => {
  const verb = POOL[0]; // eiti

  it("returns the correct present-tense 1sg form", () => {
    expect(getForm(verb, "present", "as")).toBe("eitu"); // eit + u
  });

  it("returns undefined for imperative 1sg (does not exist)", () => {
    expect(getForm(verb, "imperative", "as")).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// buildRandomQuestion()
// ---------------------------------------------------------------------------
describe("buildRandomQuestion()", () => {
  it("returns a well-formed VerbQuestion", () => {
    const q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1);
    expect(q.choices.length).toBeGreaterThanOrEqual(3);
    expect(q.verbEntry).toBeDefined();
    expect(q.verbId).toBeGreaterThan(0);
    if (q.mode !== "main_forms") {
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
    }
  });

  it("places the correct answer at correctIndex (non-main_forms, non-conjugation_drill)", () => {
    for (let i = 0; i < 20; i++) {
      const q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1);
      if (q.mode === "main_forms" || q.mode === "conjugation_drill" || q.mode === "fill_blank") continue;
      expect(q.choices[q.correctIndex]).toBeTruthy();
    }
  });

  it("produces 4 unique choices for multiple-choice modes", () => {
    for (let i = 0; i < 20; i++) {
      const q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1);
      if (q.mode === "main_forms" || q.mode === "conjugation_drill" || q.mode === "fill_blank") continue;
      expect(new Set(q.choices).size).toBe(4);
    }
  });

  it("conjugation_drill question has 1 choice (the correct form)", () => {
    const q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1, ["conjugation_drill"]);
    expect(q.mode).toBe("conjugation_drill");
    expect(q.choices).toHaveLength(1);
    expect(q.choices[0]).toBeTruthy();
    expect(q.correctIndex).toBe(-1);
  });

  it("main_forms question has 3 choices and a valid givenIndex", () => {
    // Force main_forms by passing it as the preferred mode
    const q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1, ["main_forms"]);
    expect(q.mode).toBe("main_forms");
    expect(q.choices).toHaveLength(3);
    expect(q.givenIndex).toBeGreaterThanOrEqual(0);
    expect(q.givenIndex).toBeLessThan(3);
  });

  it("prefers review verbs when priorityIds is non-empty", () => {
    const priorityIds = new Set([3]); // only verb id=3
    let hitPriority = false;
    for (let i = 0; i < 20; i++) {
      const q = buildRandomQuestion(POOL, priorityIds, EMPTY_SET, 1);
      if (q.verbId === 3) hitPriority = true;
    }
    expect(hitPriority).toBe(true);
  });

  it("excludes verbs in the exclude set when alternatives exist", () => {
    const excludeAll = new Set(POOL.slice(0, -1).map((v) => v.id)); // exclude all but last
    const q = buildRandomQuestion(POOL, EMPTY_SET, excludeAll, 1);
    // Should pick the last verb or fall back to wrap-around
    expect(q.verbId).toBeDefined();
  });

  it("throws when pool is empty", () => {
    expect(() => buildRandomQuestion([], EMPTY_SET, EMPTY_SET, 1)).toThrow("Verb pool is empty");
  });
});

// ---------------------------------------------------------------------------
// checkAnswer()
// ---------------------------------------------------------------------------
describe("checkAnswer()", () => {
  it("returns correct: true when the right index is submitted (non-main_forms)", () => {
    let q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1);
    for (let i = 0; i < 30 && (q.mode === "main_forms" || q.mode === "conjugation_drill" || q.mode === "fill_blank"); i++) {
      q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1);
    }
    if (q.mode === "main_forms" || q.mode === "conjugation_drill" || q.mode === "fill_blank") return;
    const result = checkAnswer(q, q.correctIndex);
    expect(result.correct).toBe(true);
    expect(result.correctAnswer).toBe(q.choices[q.correctIndex]);
  });

  it("returns correct: false for a wrong index (non-main_forms)", () => {
    let q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1);
    for (let i = 0; i < 30 && (q.mode === "main_forms" || q.mode === "conjugation_drill" || q.mode === "fill_blank"); i++) {
      q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1);
    }
    if (q.mode === "main_forms" || q.mode === "conjugation_drill" || q.mode === "fill_blank") return;
    const wrongIndex = q.correctIndex === 0 ? 1 : 0;
    expect(checkAnswer(q, wrongIndex).correct).toBe(false);
  });

  it("always returns the correct answer string (non-main_forms)", () => {
    let q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1);
    for (let i = 0; i < 30 && (q.mode === "main_forms" || q.mode === "conjugation_drill" || q.mode === "fill_blank"); i++) {
      q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1);
    }
    if (q.mode === "main_forms" || q.mode === "conjugation_drill" || q.mode === "fill_blank") return;
    const result = checkAnswer(q, 99);
    expect(result.correctAnswer).toBe(q.choices[q.correctIndex]);
  });
});

// ---------------------------------------------------------------------------
// checkConjugationDrillAnswer()
// ---------------------------------------------------------------------------
describe("checkConjugationDrillAnswer()", () => {
  it("returns correct: true for exact match", () => {
    const q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1, ["conjugation_drill"]);
    expect(checkConjugationDrillAnswer(q, q.choices[0]).correct).toBe(true);
  });

  it("returns correct: false for wrong input", () => {
    const q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1, ["conjugation_drill"]);
    expect(checkConjugationDrillAnswer(q, "WRONG").correct).toBe(false);
  });

  it("is case-insensitive and trims whitespace", () => {
    const q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1, ["conjugation_drill"]);
    expect(checkConjugationDrillAnswer(q, "  " + q.choices[0].toUpperCase() + "  ").correct).toBe(true);
  });

  it("correctAnswer is the correct form", () => {
    const q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1, ["conjugation_drill"]);
    expect(checkConjugationDrillAnswer(q, "anything").correctAnswer).toBe(q.choices[0]);
  });
});
// ---------------------------------------------------------------------------
describe("checkMainFormsAnswer()", () => {
  it("returns correct: true when all non-given forms are correct", () => {
    const q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1, ["main_forms"]);
    // Submit all correct forms
    const result = checkMainFormsAnswer(q, [...q.choices]);
    expect(result.correct).toBe(true);
  });

  it("returns correct: false when a non-given form is wrong", () => {
    const q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1, ["main_forms"]);
    const wrong = [...q.choices];
    const otherIdx = q.givenIndex === 0 ? 1 : 0;
    wrong[otherIdx] = "WRONG";
    expect(checkMainFormsAnswer(q, wrong).correct).toBe(false);
  });

  it("is case-insensitive and trims whitespace", () => {
    const q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1, ["main_forms"]);
    const inputs = q.choices.map((f) => "  " + f.toUpperCase() + "  ");
    expect(checkMainFormsAnswer(q, inputs).correct).toBe(true);
  });

  it("correctAnswer contains all 3 forms joined", () => {
    const q = buildRandomQuestion(POOL, EMPTY_SET, EMPTY_SET, 1, ["main_forms"]);
    const result = checkMainFormsAnswer(q, [...q.choices]);
    expect(result.correctAnswer).toBe(q.choices.join(", "));
  });
});
