// ---------------------------------------------------------------------------
// Supported translation languages
// Add new language codes here as the app expands.
// ---------------------------------------------------------------------------
export type SupportedLanguage = "en" | "ru";

// ---------------------------------------------------------------------------
// Parts of speech
// ---------------------------------------------------------------------------
export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "pronoun"
  | "numeral"
  | "preposition"
  | "conjunction"
  | "interjection"
  | "phrase";

// ---------------------------------------------------------------------------
// Grammatical gender (optional, relevant for nouns)
// ---------------------------------------------------------------------------
export type Gender = "masculine" | "feminine" | "neuter";

// ---------------------------------------------------------------------------
// CEFR difficulty levels
// ---------------------------------------------------------------------------
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

// ---------------------------------------------------------------------------
// Core dictionary entry — matches data/dictionary/*.json
// ---------------------------------------------------------------------------
export interface DictionaryEntry {
  /** Unique identifier, pattern: lt_<category>_<number> */
  id: string;

  /** The Lithuanian word or phrase */
  word: string;

  /** Translations keyed by language code */
  translations: Record<SupportedLanguage, string>;

  /** Grammatical part of speech — used for distractor matching */
  pos: PartOfSpeech;

  /** Grammatical gender (nouns only, optional) */
  gender?: Gender;

  /**
   * Semantic category / topic.
   * Used for distractor matching and topic-based test filters.
   * Examples: "animals", "food", "family", "colors", "travel"
   */
  category: string;

  /** CEFR difficulty level */
  level: CEFRLevel;

  /** Optional: source textbook or wordlist */
  source?: string;

  /** Optional: extra tags, e.g. "formal", "colloquial", "archaic" */
  tags?: string[];
}

// ---------------------------------------------------------------------------
// User language preference — stored in user profile / localStorage
// ---------------------------------------------------------------------------
export interface UserLanguagePreference {
  /** The language in which translations are shown to this user */
  translationLanguage: SupportedLanguage;
}
