import { Router } from "express";
import type { Request, Response } from "express";
import type { SupportedLanguage } from "./types.js";
import {
  getAllEntries,
  getEntryById,
  getCategories,
  getLevels,
  getDictionaries,
} from "./data.js";
import { randomQuestion, checkAnswer } from "./quiz.js";
import type { QuizQuestion } from "./quiz.js";
import { saveResult, getAdminStats } from "./stats.js";

export const router = Router();

// ---------------------------------------------------------------------------
// GET /dictionaries
// Returns list of available dictionaries
// ---------------------------------------------------------------------------
router.get("/dictionaries", (_req: Request, res: Response) => {
  const dicts = getDictionaries().map(({ id, name }) => ({ id, name }));
  res.json({ dictionaries: dicts });
});

// ---------------------------------------------------------------------------
// GET /words
// Query params:
//   category?:   string
//   level?:      A1 | A2 | B1 | B2 | C1 | C2
//   dictionary?: string  (dictionary id, e.g. "a1-sekmes")
// ---------------------------------------------------------------------------
router.get("/words", (req: Request, res: Response) => {
  const { category, level, dictionary } = req.query as Record<string, string | undefined>;

  try {
    let entries = getAllEntries(dictionary);
    if (category) entries = entries.filter((e) => e.category === category);
    if (level) entries = entries.filter((e) => e.level === level);
    res.json({ count: entries.length, entries });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

// ---------------------------------------------------------------------------
// GET /words/:id
// ---------------------------------------------------------------------------
router.get("/words/:id", (req: Request, res: Response) => {
  const { dictionary } = req.query as Record<string, string | undefined>;
  const entry = getEntryById(req.params.id as string, dictionary);
  if (!entry) {
    res.status(404).json({ error: `Entry not found: ${req.params.id}` });
    return;
  }
  res.json(entry);
});

// ---------------------------------------------------------------------------
// GET /categories
// Query params:
//   dictionary?: string
// ---------------------------------------------------------------------------
router.get("/categories", (req: Request, res: Response) => {
  const { dictionary } = req.query as Record<string, string | undefined>;
  try {
    res.json({ categories: getCategories(dictionary) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

// ---------------------------------------------------------------------------
// GET /levels
// Query params:
//   dictionary?: string
// ---------------------------------------------------------------------------
router.get("/levels", (req: Request, res: Response) => {
  const { dictionary } = req.query as Record<string, string | undefined>;
  try {
    res.json({ levels: getLevels(dictionary) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

// ---------------------------------------------------------------------------
// GET /quiz
// Query params:
//   lang?:        en | ru          (default: en)
//   category?:    string
//   dictionary?:  string
// ---------------------------------------------------------------------------
router.get("/quiz", (req: Request, res: Response) => {
  const lang = (req.query.lang ?? "en") as SupportedLanguage;
  const category = req.query.category as string | undefined;
  const dictionary = req.query.dictionary as string | undefined;
  const excludeParam = req.query.exclude as string | undefined;

  if (lang !== "en" && lang !== "ru") {
    res.status(400).json({ error: 'lang must be "en" or "ru"' });
    return;
  }

  // Parse comma-separated exclude list into a Set
  const exclude = excludeParam
    ? new Set(excludeParam.split(",").map((s) => s.trim()).filter(Boolean))
    : undefined;

  try {
    const pool = getAllEntries(dictionary);
    const question = randomQuestion(lang, category, pool, exclude);
    res.json(question);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

// ---------------------------------------------------------------------------
// POST /quiz/check
// Body: { question: QuizQuestion; submittedIndex: number }
// ---------------------------------------------------------------------------
router.post("/quiz/check", (req: Request, res: Response) => {
  const { question, submittedIndex } = req.body as {
    question: QuizQuestion;
    submittedIndex: number;
  };

  if (!question || submittedIndex === undefined) {
    res.status(400).json({ error: "question and submittedIndex are required" });
    return;
  }

  if (
    typeof submittedIndex !== "number" ||
    submittedIndex < 0 ||
    submittedIndex >= question.choices.length
  ) {
    res.status(400).json({
      error: `submittedIndex must be 0–${question.choices.length - 1}`,
    });
    return;
  }

  const result = checkAnswer(question, submittedIndex);
  res.json(result);
});

// ---------------------------------------------------------------------------
// POST /stats
// Body: { sessionId, dictionary, lang, score, total, durationS }
// Saves the result and returns percentile ranking
// ---------------------------------------------------------------------------
router.post("/stats", async (req: Request, res: Response) => {
  const { sessionId, dictionary, lang, score, total, durationS } = req.body as {
    sessionId: string;
    dictionary: string;
    lang: string;
    score: number;
    total: number;
    durationS: number;
  };

  if (!sessionId || !dictionary || !lang || score == null || !total || durationS == null) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const result = await saveResult({ sessionId, dictionary, lang, score, total, durationS });
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// ---------------------------------------------------------------------------
// GET /admin/stats
// Header: x-admin-password: <ADMIN_PASSWORD env var>
// ---------------------------------------------------------------------------
router.get("/admin/stats", async (req: Request, res: Response) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(503).json({ error: "Admin access not configured" });
    return;
  }
  if (req.headers["x-admin-password"] !== adminPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
