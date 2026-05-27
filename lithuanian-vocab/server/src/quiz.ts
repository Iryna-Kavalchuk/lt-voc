import type { DictionaryEntry, SupportedLanguage } from "./types.js";
import { getAllEntries } from "./data.js";

/** A single multiple-choice question presented to the learner. */
export interface QuizQuestion {
  /** The entry being tested */
  entryId: string;
  /** The Lithuanian word to translate */
  word: string;
  /** The language the learner is translating into */
  lang: SupportedLanguage;
  /** Four choices (one correct, three distractors), pre-shuffled */
  choices: string[];
  /** Index of the correct answer within `choices` */
  correctIndex: number;
}

/** Result of checking a submitted answer. */
export interface AnswerResult {
  correct: boolean;
  correctAnswer: string;
}

/**
 * Pick `n` random elements from `arr` without replacement.
 * Exposed for testing.
 */
export function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

/**
 * Generate distractors for a quiz question.
 *
 * Strategy (in priority order):
 * 1. Same category + same POS  — most challenging, topically related
 * 2. Same POS, different category — same word type
 * 3. Same category, different POS — topically related
 * 4. Any other entry            — fallback
 *
 * Always returns exactly 3 unique translations different from the correct one.
 */
export function generateDistractors(
  target: DictionaryEntry,
  lang: SupportedLanguage,
  pool: DictionaryEntry[]
): string[] {
  const correctTranslation = target.translations[lang];

  const candidates = pool.filter(
    (e) =>
      e.id !== target.id &&
      e.translations[lang] !== correctTranslation
  );

  // Priority 1: same category + same POS
  const sameCatSamePos = candidates.filter(
    (e) => e.category === target.category && e.pos === target.pos
  );

  // Priority 2: same POS, different category
  const samePosOtherCat = candidates.filter(
    (e) => e.pos === target.pos && e.category !== target.category
  );

  // Priority 3: same category, different POS
  const sameCatOtherPos = candidates.filter(
    (e) => e.category === target.category && e.pos !== target.pos
  );

  // Fill 3 slots tier by tier — exhaust each tier before moving to the next
  const picked: DictionaryEntry[] = [];
  const usedIds = new Set<string>();

  for (const tier of [sameCatSamePos, samePosOtherCat, sameCatOtherPos, candidates]) {
    if (picked.length >= 3) break;
    const available = tier.filter((e) => !usedIds.has(e.id));
    const need = 3 - picked.length;
    const fromTier = sample(available, Math.min(need, available.length));
    for (const e of fromTier) {
      usedIds.add(e.id);
      picked.push(e);
    }
  }

  return picked.map((e) => e.translations[lang]);
}

/**
 * Build a multiple-choice question for the given entry.
 *
 * @param entryId - ID of the word to test
 * @param lang    - translation language (default: "en")
 * @param pool    - entries to draw distractors from (default: all entries)
 */
export function buildQuestion(
  entryId: string,
  lang: SupportedLanguage = "en",
  pool?: DictionaryEntry[]
): QuizQuestion {
  const entries = pool ?? getAllEntries();
  const target = entries.find((e) => e.id === entryId);
  if (!target) throw new Error(`Entry not found: ${entryId}`);

  const correctAnswer = target.translations[lang];
  const distractors = generateDistractors(target, lang, entries);

  // Combine correct answer + distractors and shuffle
  const choices = [correctAnswer, ...distractors];
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

  return {
    entryId: target.id,
    word: target.word,
    lang,
    choices,
    correctIndex: choices.indexOf(correctAnswer),
  };
}

/**
 * Pick a random entry from the pool and build a question from it.
 *
 * @param lang       - translation language
 * @param category   - optional category filter
 * @param pool       - override the full entry pool (useful in tests)
 */
export function randomQuestion(
  lang: SupportedLanguage = "en",
  category?: string,
  pool?: DictionaryEntry[]
): QuizQuestion {
  const entries = pool ?? getAllEntries();
  const filtered = category
    ? entries.filter((e) => e.category === category)
    : entries;

  if (filtered.length === 0) {
    throw new Error(
      category
        ? `No entries found for category: ${category}`
        : "Dictionary is empty"
    );
  }

  const target = filtered[Math.floor(Math.random() * filtered.length)];
  return buildQuestion(target.id, lang, entries);
}

/**
 * Check whether a submitted answer index is correct.
 */
export function checkAnswer(
  question: QuizQuestion,
  submittedIndex: number
): AnswerResult {
  return {
    correct: submittedIndex === question.correctIndex,
    correctAnswer: question.choices[question.correctIndex],
  };
}
