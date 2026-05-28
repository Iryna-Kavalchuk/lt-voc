// Typed API client — all requests go through the Vite proxy to localhost:3000

export type SupportedLanguage = "en" | "ru";
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type PartOfSpeech =
  | "noun" | "verb" | "adjective" | "adverb" | "pronoun"
  | "numeral" | "preposition" | "conjunction" | "interjection" | "phrase";

export interface DictionaryEntry {
  id: string;
  word: string;
  translations: Record<SupportedLanguage, string>;
  pos: PartOfSpeech;
  gender?: "masculine" | "feminine" | "neuter";
  category: string;
  level: CEFRLevel;
  source?: string;
  tags?: string[];
}

export interface QuizQuestion {
  entryId: string;
  word: string;
  lang: SupportedLanguage;
  choices: string[];
  correctIndex: number;
}

export interface AnswerResult {
  correct: boolean;
  correctAnswer: string;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const b = await res.json().catch(() => ({}));
    throw new Error((b as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface DictionaryInfo {
  id: string;
  name: string;
}

export interface StatsResult {
  id: number;
  percentile: number;
  totalResults: number;
}

export const api = {
  dictionaries(): Promise<{ dictionaries: DictionaryInfo[] }> {
    return get("/api/dictionaries");
  },

  words: {
    list(params?: { category?: string; level?: string; dictionary?: string }): Promise<{ count: number; entries: DictionaryEntry[] }> {
      const qs = new URLSearchParams();
      if (params?.category) qs.set("category", params.category);
      if (params?.level) qs.set("level", params.level);
      if (params?.dictionary) qs.set("dictionary", params.dictionary);
      const q = qs.toString();
      return get(`/api/words${q ? `?${q}` : ""}`);
    },
    get(id: string): Promise<DictionaryEntry> {
      return get(`/api/words/${encodeURIComponent(id)}`);
    },
  },

  categories(dictionary?: string): Promise<{ categories: string[] }> {
    const qs = dictionary ? `?dictionary=${encodeURIComponent(dictionary)}` : "";
    return get(`/api/categories${qs}`);
  },

  levels(dictionary?: string): Promise<{ levels: CEFRLevel[] }> {
    const qs = dictionary ? `?dictionary=${encodeURIComponent(dictionary)}` : "";
    return get(`/api/levels${qs}`);
  },

  quiz: {
    question(params?: { lang?: SupportedLanguage; category?: string; dictionary?: string }): Promise<QuizQuestion> {
      const qs = new URLSearchParams();
      if (params?.lang) qs.set("lang", params.lang);
      if (params?.category) qs.set("category", params.category);
      if (params?.dictionary) qs.set("dictionary", params.dictionary);
      const q = qs.toString();
      return get(`/api/quiz${q ? `?${q}` : ""}`);
    },
    check(question: QuizQuestion, submittedIndex: number): Promise<AnswerResult> {
      return post("/api/quiz/check", { question, submittedIndex });
    },
  },

  stats: {
    submit(payload: {
      sessionId: string;
      dictionary: string;
      lang: SupportedLanguage;
      score: number;
      total: number;
      durationS: number;
    }): Promise<StatsResult> {
      return post("/api/stats", payload);
    },
  },
};
