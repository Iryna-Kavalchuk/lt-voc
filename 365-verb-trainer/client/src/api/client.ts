// Typed API client — all requests proxied via Vite to localhost:3001

// ---------------------------------------------------------------------------
// Domain types (mirror server/src/types.ts)
// ---------------------------------------------------------------------------

export interface ConjugationRow {
  as?: string;
  tu?: string;
  jis_ji_jie_jos?: string;
  mes?: string;
  jus?: string;
}

export interface Conjugation {
  present: ConjugationRow;
  past: ConjugationRow;
  subjunctive: ConjugationRow;
  frequentative_past: ConjugationRow;
  future: ConjugationRow;
  imperative: ConjugationRow;
}

export interface VerbExample {
  hint: string | null;
  lt: string;
  ru: string;
  needs_review?: boolean;
}

export interface VerbEntry {
  id: number;
  infinitive: string;
  forms: [string, string, string];
  translation: string;
  conjugation: Conjugation;
  non_conjugated_forms: Record<string, string>;
  examples: VerbExample[];
}

export type QuestionMode =
  | "verb_translation"
  | "conjugation_drill"
  | "main_forms"
  | "fill_blank"
  | "fill_blank_hint";

export type TenseName = "present" | "past" | "subjunctive" | "future" | "imperative";

export interface VerbQuestion {
  questionNumber: number;
  mode: QuestionMode;
  verbId: number;
  prompt: string;
  choices: string[];
  correctIndex: number;
  verbEntry: VerbEntry;
  tense?: TenseName;
  person?: string;
  sentenceLt?: string;
  sentenceRu?: string;
  givenIndex?: number;
  hint?: string;        // fill_blank: first letter of infinitive + stars
}

export interface AnswerResult {
  correct: boolean;
  correctAnswer: string;
  pointEarned: boolean;
  pointLost: boolean;
}

export interface StatsResult {
  id: number;
  percentile: number;
  totalResults: number;
}

export interface VerbPointsRow {
  verbId: number;
  modes: string[];
}

export interface ProgressData {
  totalPoints: number;
  maxPoints: number;
  byVerb: VerbPointsRow[];
}

export interface PeriodCounts {
  today: number;
  week: number;
  month: number;
  total: number;
}

export interface AccuracyStats {
  avg: number;
  min: number;
  max: number;
}

export interface HistogramBucket {
  label: string;
  count: number;
}

export interface AdminStats {
  counts: PeriodCounts;
  accuracy: AccuracyStats;
  histogram: HistogramBucket[];
}

export interface FeedbackEntry {
  id: number;
  rating: number;
  comment: string | null;
  lang: string;
  created_at: string;
}

export interface AdminFeedback {
  entries: FeedbackEntry[];
  avg_rating: number | null;
  total: number;
}

export interface UserStat {
  userId: string;
  points: number;
  lastActivity: string;
}

export interface AdminUsers {
  users: UserStat[];
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// API methods
// ---------------------------------------------------------------------------

export const api = {
  verbs: {
    list(search?: string): Promise<{ count: number; verbs: VerbEntry[] }> {
      const qs = search ? `?search=${encodeURIComponent(search)}` : "";
      return get(`/api/verbs${qs}`);
    },
    get(id: number): Promise<VerbEntry> {
      return get(`/api/verbs/${id}`);
    },
    update(verb: VerbEntry, password: string): Promise<VerbEntry> {
      return fetch(`/api/verbs/${verb.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify(verb),
      }).then(async (res) => {
        if (!res.ok) {
          const b = await res.json().catch(() => ({}));
          throw new Error((b as { error?: string }).error ?? `HTTP ${res.status}`);
        }
        return res.json() as Promise<VerbEntry>;
      });
    },
  },

  quiz: {
    question(params: {
      userId: string;
      exclude?: number[];
      questionNumber?: number;
      modes?: QuestionMode[];
    }): Promise<VerbQuestion> {
      const qs = new URLSearchParams();
      qs.set("userId", params.userId);
      if (params.exclude && params.exclude.length > 0) {
        qs.set("exclude", params.exclude.join(","));
      }
      if (params.questionNumber !== undefined) {
        qs.set("questionNumber", String(params.questionNumber));
      }
      if (params.modes && params.modes.length > 0) {
        qs.set("modes", params.modes.join(","));
      }
      return get(`/api/quiz/question?${qs.toString()}`);
    },

    check(question: VerbQuestion, submittedIndex: number, userId: string, submittedForms?: string[], submittedText?: string): Promise<AnswerResult> {
      return post("/api/quiz/check", { question, submittedIndex, userId, submittedForms, submittedText });
    },
  },

  stats: {
    submit(payload: {
      sessionId: string;
      score: number;
      total: number;
      durationS: number;
    }): Promise<StatsResult> {
      return post("/api/stats", payload);
    },
  },

  progress: {
    get(userId: string): Promise<ProgressData> {
      return get(`/api/progress?userId=${encodeURIComponent(userId)}`);
    },
  },

  admin: {
    ping(password: string): Promise<void> {
      return fetch("/api/admin/ping", {
        headers: { "x-admin-password": password },
      }).then(async (res) => {
        if (!res.ok) {
          const b = await res.json().catch(() => ({}));
          throw new Error((b as { error?: string }).error ?? `HTTP ${res.status}`);
        }
      });
    },
    stats(password: string): Promise<AdminStats> {
      return fetch("/api/admin/stats", {
        headers: { "x-admin-password": password },
      }).then(async (res) => {
        if (!res.ok) {
          const b = await res.json().catch(() => ({}));
          throw new Error((b as { error?: string }).error ?? `HTTP ${res.status}`);
        }
        return res.json() as Promise<AdminStats>;
      });
    },
    feedback(password: string): Promise<AdminFeedback> {
      return fetch("/api/admin/feedback", {
        headers: { "x-admin-password": password },
      }).then(async (res) => {
        if (!res.ok) {
          const b = await res.json().catch(() => ({}));
          throw new Error((b as { error?: string }).error ?? `HTTP ${res.status}`);
        }
        return res.json() as Promise<AdminFeedback>;
      });
    },
    users(password: string): Promise<AdminUsers> {
      return fetch("/api/admin/users", {
        headers: { "x-admin-password": password },
      }).then(async (res) => {
        if (!res.ok) {
          const b = await res.json().catch(() => ({}));
          throw new Error((b as { error?: string }).error ?? `HTTP ${res.status}`);
        }
        return res.json() as Promise<AdminUsers>;
      });
    },
  },

  feedback: {
    submit(payload: { rating: number; comment?: string; lang: string }): Promise<FeedbackEntry> {
      return post("/api/feedback", payload);
    },
  },
};
