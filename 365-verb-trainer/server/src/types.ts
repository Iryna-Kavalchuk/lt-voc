// ---------------------------------------------------------------------------
// Domain types for the 365 Verb Trainer
// ---------------------------------------------------------------------------

/** One conjugated-form row in the conjugation table */
export interface ConjugationRow {
  as?: string;               // 1st person singular
  tu?: string;               // 2nd person singular
  jis_ji_jie_jos?: string;  // 3rd person (all numbers/genders)
  mes?: string;              // 1st person plural
  jus?: string;              // 2nd person plural
}

/** Full conjugation table: tense name → person → form */
export interface Conjugation {
  present: ConjugationRow;
  past: ConjugationRow;
  subjunctive: ConjugationRow;
  frequentative_past: ConjugationRow;
  future: ConjugationRow;
  imperative: ConjugationRow;
}

/** A single usage example with optional case hint */
export interface VerbExample {
  hint: string | null;
  lt: string;   // Lithuanian sentence
  ru: string;   // Russian translation
}

/** One entry from verb-examples-enriched.json */
export interface VerbEntry {
  id: number;
  infinitive: string;
  forms: [string, string, string];   // [infinitive, present-3sg, past-3sg]
  translation: string;               // Russian translation of the infinitive
  conjugation: Conjugation;
  non_conjugated_forms: Record<string, string>; // "1"–"9"
  examples: VerbExample[];
}

// ---------------------------------------------------------------------------
// Quiz question types
// ---------------------------------------------------------------------------

export type QuestionMode =
  | "verb_translation"    // LT infinitive → pick RU translation
  | "conjugation_drill"   // verb + tense + person → type conjugated form
  | "main_forms"          // given one main form → type the other two
  | "fill_blank"          // sentence with blank → type missing form (masked hint)
  | "fill_blank_hint";    // same as fill_blank but hint shows all 3 forms unmasked

export type TenseName = "present" | "past" | "subjunctive" | "future" | "imperative";

export const TENSE_LABEL: Record<TenseName, string> = {
  present: "Present",
  past: "Past",
  subjunctive: "Subjunctive / Conditional",
  future: "Future",
  imperative: "Imperative",
};

export const PERSON_LABEL: Record<string, string> = {
  as: "aš (I)",
  tu: "tu (you)",
  jis_ji_jie_jos: "jis / ji / jie / jos (he / she / they)",
  mes: "mes (we)",
  jus: "jūs (you pl.)",
};

/** A fully self-contained multiple-choice question */
export interface VerbQuestion {
  /** Sequential question number within the session (1-based) */
  questionNumber: number;
  /** Question type — drives how the client renders the prompt */
  mode: QuestionMode;
  /** ID of the verb being tested */
  verbId: number;
  /** Human-readable prompt text */
  prompt: string;
  /** Four choices (strings), pre-shuffled */
  choices: string[];
  /** Index of the correct answer within choices */
  correctIndex: number;
  /** The full verb entry — sent so the client can show the review card */
  verbEntry: VerbEntry;
  // Mode-specific extra context
  tense?: TenseName;
  person?: string;
  sentenceLt?: string;  // for fill_blank: the full sentence (with blank) in LT
  sentenceRu?: string;  // for fill_blank: the RU translation of the sentence
  givenIndex?: number;  // for main_forms: which of the 3 forms is pre-filled (0–2)
  hint?: string;        // for fill_blank/fill_blank_hint: masked or plain 3 main forms
}

/** Result of checking a submitted answer */
export interface AnswerResult {
  correct: boolean;
  correctAnswer: string;
  pointEarned: boolean;   // true if this answer earned a new point for (verb, mode)
  pointLost: boolean;     // true if this wrong answer lost a previously earned point
}

// ---------------------------------------------------------------------------
// Spaced repetition
// ---------------------------------------------------------------------------

export interface VerbProgress {
  userId: string;
  verbId: number;
  correctCount: number;
  wrongCount: number;
  intervalDays: number;
  nextReviewAt: Date;
}
