import type {
  VerbEntry,
  VerbQuestion,
  QuestionMode,
  TenseName,
  AnswerResult,
  ConjugationRow,
} from "./types.js";
import { TENSE_LABEL, PERSON_LABEL } from "./types.js";

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/** Pick n random elements from arr without replacement (Fisher-Yates). */
export function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

/** Shuffle an array in place and return it. */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Build 4 choices (correct + 3 distractors) shuffled, return {choices, correctIndex}. */
function buildChoices(correct: string, distractors: string[]): { choices: string[]; correctIndex: number } {
  const choices = shuffle([correct, ...distractors.slice(0, 3)]);
  return { choices, correctIndex: choices.indexOf(correct) };
}

/** Get all conjugated forms for a given tense, filtering out undefined/empty values. */
export function getFormsForTense(verb: VerbEntry, tense: TenseName): string[] {
  const row: ConjugationRow = verb.conjugation[tense];
  return Object.values(row).filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

/** Get the conjugated form for a specific person in a tense. Returns undefined if not present. */
export function getForm(verb: VerbEntry, tense: TenseName, person: string): string | undefined {
  const row = verb.conjugation[tense] as Record<string, string | undefined>;
  return row[person];
}

// ---------------------------------------------------------------------------
// Drillable tenses (frequentative_past excluded per requirements)
// ---------------------------------------------------------------------------
const DRILLABLE_TENSES: TenseName[] = ["present", "past", "subjunctive", "future", "imperative"];

// Persons that exist in each tense
const TENSE_PERSONS: Record<TenseName, string[]> = {
  present:   ["as", "tu", "jis_ji_jie_jos", "mes", "jus"],
  past:      ["as", "tu", "jis_ji_jie_jos", "mes", "jus"],
  subjunctive: ["as", "tu", "jis_ji_jie_jos", "mes", "jus"],
  future:    ["as", "tu", "jis_ji_jie_jos", "mes", "jus"],
  imperative: ["tu", "jis_ji_jie_jos", "mes", "jus"],
};

// ---------------------------------------------------------------------------
// Question builders — one per mode
// ---------------------------------------------------------------------------

/**
 * MODE 1: verb_translation
 * Prompt: Lithuanian infinitive (with stress marks)
 * Correct: Russian translation
 * Distractors: Russian translations from other verbs
 */
function buildVerbTranslationQuestion(
  verb: VerbEntry,
  pool: VerbEntry[],
  questionNumber: number
): VerbQuestion {
  const correct = verb.translation;
  const distractors = sample(
    pool.filter((v) => v.id !== verb.id && v.translation !== correct).map((v) => v.translation),
    3
  );
  const { choices, correctIndex } = buildChoices(correct, distractors);
  return {
    questionNumber,
    mode: "verb_translation",
    verbId: verb.id,
    prompt: verb.forms.join(", "),
    choices,
    correctIndex,
    verbEntry: verb,
  };
}

/**
 * MODE 2: conjugation_drill
 * Prompt: verb infinitive — tense label, person label
 * The user types the correct conjugated form (no multiple choice).
 * choices = [correct] (single entry so the client can show it on reveal)
 * correctIndex = -1 (unused — answer checked by checkConjugationDrillAnswer)
 */
function buildConjugationDrillQuestion(
  verb: VerbEntry,
  _pool: VerbEntry[],
  questionNumber: number
): VerbQuestion | null {
  const availableTenses = DRILLABLE_TENSES.filter(
    (t) => getFormsForTense(verb, t).length > 0
  );
  if (availableTenses.length === 0) return null;

  const tense = sample(availableTenses, 1)[0];
  const persons = TENSE_PERSONS[tense];

  const availablePersons = persons.filter((p) => getForm(verb, tense, p) !== undefined);
  if (availablePersons.length === 0) return null;

  const person = sample(availablePersons, 1)[0];
  const correct = getForm(verb, tense, person);
  if (!correct) return null;

  const prompt = `${verb.forms.join(", ")} — ${TENSE_LABEL[tense]}, ${PERSON_LABEL[person] ?? person}`;

  return {
    questionNumber,
    mode: "conjugation_drill",
    verbId: verb.id,
    prompt,
    choices: [correct],   // single entry; used by client to show correct answer on reveal
    correctIndex: -1,     // unused
    verbEntry: verb,
    tense,
    person,
  };
}

/**
 * MODE 5: main_forms
 * Shows one of the 3 main forms pre-filled; the user must type the other two.
 * choices = the 3 forms in their canonical order [infinitive, present-3sg, past-3sg]
 * correctIndex = -1 (unused — answer checking is done by comparing all 3 inputs)
 * givenIndex = which slot (0–2) is shown as the hint
 */
function buildMainFormsQuestion(
  verb: VerbEntry,
  _pool: VerbEntry[],
  questionNumber: number
): VerbQuestion {
  const givenIndex = Math.floor(Math.random() * 3);
  return {
    questionNumber,
    mode: "main_forms",
    verbId: verb.id,
    prompt: verb.translation,
    choices: [...verb.forms],   // [form0, form1, form2]
    correctIndex: -1,           // not used for this mode
    verbEntry: verb,
    givenIndex,
  };
}

/** Mask a single form: first letter + stars for remaining visible characters.
 *  Diacritical combining marks are stripped before counting so stress marks
 *  don't inflate the star count.
 *  e.g. "eĩti" → "e***", "abejója" → "a******"
 */
function maskForm(form: string): string {
  if (form.length === 0) return "";
  const stripped = form.normalize("NFD").replace(/[\u0300-\u036F]/g, "");
  return stripped[0] + "*".repeat(stripped.length - 1);
}

/** Build a hint string showing all 3 main forms masked.
 *  e.g. ["abejóti","abejója","abejójo"] → "a****** / a****** / a******"
 */
function buildFormsHint(forms: [string, string, string]): string {
  return forms.map(maskForm).join(", ");
}

/**
 * MODE 6: fill_blank
 * Shows the Russian translation as prompt; the Lithuanian sentence with blank
 * is stored in sentenceLt for display context.
 * The user types the missing verb form.
 * hint = 3 main forms masked (e.g. "a****** / a****** / a******")
 * choices = [correctForm]  (single entry; used to reveal the answer)
 * correctIndex = -1 (unused)
 */
function buildFillBlankQuestion(
  verb: VerbEntry,
  _pool: VerbEntry[],
  questionNumber: number
): VerbQuestion | null {
  if (verb.examples.length === 0) return null;

  const hint = buildFormsHint(verb.forms);

  // Build map of all conjugated forms → tense+person.
  // Some cells contain multiple variants separated by " / " or ", " (e.g. būti's
  // present: "esu, būnu"). Split these so each individual form is tried.
  const allForms = new Map<string, { tense: TenseName; person: string }>();
  for (const tense of DRILLABLE_TENSES) {
    for (const person of TENSE_PERSONS[tense]) {
      const f = getForm(verb, tense, person);
      if (!f) continue;
      // Split on " / " or ", " to handle multi-variant cells
      const variants = f.split(/\s*[\/,]\s*/).map((s) => s.trim()).filter(Boolean);
      for (const variant of variants) {
        // Strip diacritics/stress marks before storing; skip if nothing remains
        // (some data cells are bare combining marks like "̃" with no base character)
        const key = variant.normalize("NFD").replace(/[\u0300-\u036F]/g, "").toLowerCase().trim();
        if (key) allForms.set(key, { tense, person });
      }
    }
  }
  // Also include the infinitive as a form (strip stress marks for matching)
  const infNorm = verb.infinitive.normalize("NFD").replace(/[\u0300-\u036F]/g, "").toLowerCase();

  // Try each example until we find one that contains a conjugated form
  const shuffledExamples = shuffle([...verb.examples]);
  for (const example of shuffledExamples) {
    for (const [form, { tense, person }] of allForms) {
      const formNorm = form.normalize("NFD").replace(/[\u0300-\u036F]/g, "");

      // Work entirely in NFC space so indices into sentNfc are safe to use
      // for slicing back into the same string.
      const sentNfc = example.lt.normalize("NFC");
      const sentStripped = sentNfc.normalize("NFD").replace(/[\u0300-\u036F]/g, "");

      // Word-boundary match on the diacritic-stripped sentence
      const wordBoundary = new RegExp(
        `(?<![a-ząčęėįšųūžĄČĘĖĮŠŲŪŽ])${formNorm}(?![a-ząčęėįšųūžĄČĘĖĮŠŲŪŽ])`,
        "i"
      );
      const strippedMatch = wordBoundary.exec(sentStripped);
      if (!strippedMatch) continue;

      // The stripped string and sentNfc have the same character count (NFC
      // has no combining characters to split), so the index is valid for
      // slicing sentNfc directly.
      const start = strippedMatch.index;
      const end = start + strippedMatch[0].length;

      const blankedSentence = sentNfc.slice(0, start) + "___" + sentNfc.slice(end);
      // Correct answer: the original-stress form from the NFC sentence
      const correctForm = sentNfc.slice(start, end);

      return {
        questionNumber,
        mode: "fill_blank",
        verbId: verb.id,
        prompt: example.ru,
        choices: [correctForm],
        correctIndex: -1,
        verbEntry: verb,
        tense,
        person,
        sentenceLt: blankedSentence,
        sentenceRu: example.ru,
        hint,
      };
    }
  }

  // Fallback: use infinitive as the form, but only when it appears as a
  // standalone word (not as a substring inside a prefixed verb like perdaryti).
  const infWordBoundary = new RegExp(
    `(?<![a-ząčęėįšųūžĄČĘĖĮŠŲŪŽ])${infNorm}(?![a-ząčęėįšųūžĄČĘĖĮŠŲŪŽ])`,
    "i"
  );
  const infExample = shuffledExamples.find((e) => {
    const norm = e.lt.normalize("NFC").normalize("NFD").replace(/[\u0300-\u036F]/g, "");
    return infWordBoundary.test(norm);
  });
  if (!infExample) return null;

  const sentNfc = infExample.lt.normalize("NFC");
  const sentStripped = sentNfc.normalize("NFD").replace(/[\u0300-\u036F]/g, "");
  const infMatch = infWordBoundary.exec(sentStripped);
  if (!infMatch) return null;

  const infIdx = infMatch.index;
  const blanked = sentNfc.slice(0, infIdx) + "___" + sentNfc.slice(infIdx + infNorm.length);
  const correctForm = sentNfc.slice(infIdx, infIdx + infNorm.length);

  return {
    questionNumber,
    mode: "fill_blank",
    verbId: verb.id,
    prompt: infExample.ru,
    choices: [correctForm],
    correctIndex: -1,
    verbEntry: verb,
    sentenceLt: blanked,
    sentenceRu: infExample.ru,
    hint,
  };
}

/**
 * MODE 7: fill_blank_hint
 * Identical to fill_blank but the hint shows all 3 main forms unmasked,
 * making it an easier variant (the verb's infinitive / present / past are visible).
 */
function buildFillBlankHintQuestion(
  verb: VerbEntry,
  pool: VerbEntry[],
  questionNumber: number
): VerbQuestion | null {
  const q = buildFillBlankQuestion(verb, pool, questionNumber);
  if (!q) return null;
  return {
    ...q,
    mode: "fill_blank_hint",
    hint: verb.forms.join(", "),   // plain, no masking
  };
}

// ---------------------------------------------------------------------------
// Main question generator
// ---------------------------------------------------------------------------

const ALL_MODES: QuestionMode[] = [
  "verb_translation",
  "conjugation_drill",
  "main_forms",
  "fill_blank",
  "fill_blank_hint",
];

/**
 * Pick a verb (spaced-repetition aware) and build one random question.
 *
 * @param pool          - all verb entries (or a pre-filtered subset)
 * @param priorityIds   - verb IDs due for review (weighted higher)
 * @param excludeIds    - verb IDs already shown this session
 * @param questionNumber - 1-based counter for this session
 * @param preferredModes - restrict to these modes (default: all)
 */
export function buildRandomQuestion(
  pool: VerbEntry[],
  priorityIds: Set<number>,
  excludeIds: Set<number>,
  questionNumber: number,
  preferredModes?: QuestionMode[]
): VerbQuestion {
  if (pool.length === 0) throw new Error("Verb pool is empty");

  // Verb selection: prefer review verbs, then unseen, then any
  let candidates = pool.filter((v) => !excludeIds.has(v.id));
  if (candidates.length === 0) candidates = pool; // full wrap-around

  const reviewCandidates = candidates.filter((v) => priorityIds.has(v.id));
  const verbPool = reviewCandidates.length > 0 ? reviewCandidates : candidates;
  const verb = verbPool[Math.floor(Math.random() * verbPool.length)];

  // Mode selection
  const modes = preferredModes ?? ALL_MODES;
  const shuffledModes = shuffle([...modes]);

  // Try each mode in shuffled order; first success wins
  for (const mode of shuffledModes) {
    let q: VerbQuestion | null = null;
    switch (mode) {
      case "verb_translation":
        q = buildVerbTranslationQuestion(verb, pool, questionNumber);
        break;
      case "conjugation_drill":
        q = buildConjugationDrillQuestion(verb, pool, questionNumber);
        break;
      case "main_forms":
        q = buildMainFormsQuestion(verb, pool, questionNumber);
        break;
      case "fill_blank":
        q = buildFillBlankQuestion(verb, pool, questionNumber);
        break;
      case "fill_blank_hint":
        q = buildFillBlankHintQuestion(verb, pool, questionNumber);
        break;
    }
    if (q) return q;
  }

  // Ultimate fallback: verb_translation always works
  return buildVerbTranslationQuestion(verb, pool, questionNumber);
}

/**
 * Check whether a submitted answer index is correct.
 * For main_forms mode, submittedIndex is unused; the client sends the full
 * inputs array via the question body — correctness is checked there instead.
 * pointEarned/pointLost are always false here — routes.ts fills them after DB ops.
 */
export function checkAnswer(question: VerbQuestion, submittedIndex: number): AnswerResult {
  if (question.mode === "main_forms") {
    return { correct: false, correctAnswer: question.choices.join(", "), pointEarned: false, pointLost: false };
  }
  return {
    correct: submittedIndex === question.correctIndex,
    correctAnswer: question.choices[question.correctIndex],
    pointEarned: false,
    pointLost: false,
  };
}

/**
 * Check a main_forms answer where the user typed values for all 3 slots.
 * submittedForms: array of 3 strings (index matches verb.forms order).
 * givenIndex: the slot that was pre-filled — always treated as correct.
 */
export function checkMainFormsAnswer(
  question: VerbQuestion,
  submittedForms: string[]
): AnswerResult {
  const normalize = (s: string) =>
    s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036F]/g, "");

  const wrong: number[] = [];
  question.choices.forEach((correct, i) => {
    if (i === question.givenIndex) return; // pre-filled, skip
    if (normalize(submittedForms[i] ?? "") !== normalize(correct)) {
      wrong.push(i);
    }
  });

  return {
    correct: wrong.length === 0,
    correctAnswer: question.choices.join(", "),
    pointEarned: false,
    pointLost: false,
  };
}

/**
 * Check a fill_blank answer where the user typed the missing form.
 * Case-insensitive, diacritic-insensitive, trimmed.
 */
export function checkFillBlankAnswer(
  question: VerbQuestion,
  submittedText: string
): AnswerResult {
  const normalize = (s: string) =>
    s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036F]/g, "");
  const correct = question.choices[0];
  return {
    correct: normalize(submittedText) === normalize(correct),
    correctAnswer: correct,
    pointEarned: false,
    pointLost: false,
  };
}

/**
 * Check a conjugation_drill answer where the user typed the form.
 * Case-insensitive, diacritic-insensitive, trimmed.
 * Accepts any variant when the correct answer contains multiple forms
 * separated by " / " (e.g. subjunctive mes: "abejótume / abejótumėme").
 */
export function checkConjugationDrillAnswer(
  question: VerbQuestion,
  submittedText: string
): AnswerResult {
  const normalize = (s: string) =>
    s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036F]/g, "");
  const correct = question.choices[0]; // single entry holds the correct form (may contain " / ")
  const variants = correct.split(/\s*\/\s*/).map((v) => v.trim()).filter(Boolean);
  const submittedNorm = normalize(submittedText);
  return {
    correct: variants.some((v) => normalize(v) === submittedNorm),
    correctAnswer: correct,
    pointEarned: false,
    pointLost: false,
  };
}
