import { Router } from "express";
import type { Request, Response } from "express";
import { getAllVerbs, getVerbById, saveVerb } from "./data.js";
import { buildRandomQuestion, checkAnswer, checkMainFormsAnswer, checkConjugationDrillAnswer, checkFillBlankAnswer } from "./quiz.js";
import type { VerbQuestion, QuestionMode } from "./types.js";
import { saveResult, recordAnswer, getDueVerbIds, getAdminStats, earnPoint, losePoint, getProgress } from "./stats.js";
import { pool, dbAvailable } from "./db.js";

export const router = Router();

// ---------------------------------------------------------------------------
// GET /verbs
// Returns all verb entries (for the VerbList page)
// Query params:
//   search?: string  — filter by infinitive or translation (case-insensitive)
// ---------------------------------------------------------------------------
router.get("/verbs", (req: Request, res: Response) => {
  const search = (req.query.search as string | undefined)?.toLowerCase();
  let verbs = getAllVerbs();
  if (search) {
    verbs = verbs.filter(
      (v) =>
        v.infinitive.toLowerCase().includes(search) ||
        v.translation.toLowerCase().includes(search)
    );
  }
  res.json({ count: verbs.length, verbs });
});

// ---------------------------------------------------------------------------
// GET /verbs/:id
// ---------------------------------------------------------------------------
router.get("/verbs/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "id must be an integer" });
    return;
  }
  const verb = getVerbById(id);
  if (!verb) {
    res.status(404).json({ error: `Verb not found: ${id}` });
    return;
  }
  res.json(verb);
});

// ---------------------------------------------------------------------------
// GET /quiz/question
// Returns one VerbQuestion.
// Query params:
//   userId:       string  — anonymous UUID for spaced repetition
//   exclude?:     string  — comma-separated verbIds already shown this session
//   questionNumber: number — 1-based question counter
// ---------------------------------------------------------------------------
router.get("/quiz/question", async (req: Request, res: Response) => {
  const { userId, exclude, questionNumber, modes } = req.query as Record<string, string | undefined>;

  if (!userId) {
    res.status(400).json({ error: "userId is required" });
    return;
  }

  const qNum = parseInt(questionNumber ?? "1", 10);
  const excludeIds = exclude
    ? new Set(exclude.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n)))
    : new Set<number>();

  // Optional mode filter: comma-separated list of QuestionMode values
  const ALL_MODES: QuestionMode[] = [
    "verb_translation", "conjugation_drill", "main_forms", "fill_blank", "fill_blank_hint",
  ];
  const preferredModes: QuestionMode[] | undefined = modes
    ? (modes.split(",").map((m) => m.trim()).filter((m): m is QuestionMode => ALL_MODES.includes(m as QuestionMode)))
    : undefined;

  if (preferredModes !== undefined && preferredModes.length === 0) {
    res.status(400).json({ error: "No valid modes specified" });
    return;
  }

  try {
    const pool = getAllVerbs();
    let priorityIds = new Set<number>();
    try {
      priorityIds = await getDueVerbIds(userId);
    } catch {
      // non-fatal
    }

    const question = buildRandomQuestion(pool, priorityIds, excludeIds, qNum, preferredModes);
    res.json(question);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

// ---------------------------------------------------------------------------
// POST /quiz/check
// Body: { question: VerbQuestion; submittedIndex: number; userId: string }
// For main_forms mode also accepts: { submittedForms: string[] }
// ---------------------------------------------------------------------------
router.post("/quiz/check", async (req: Request, res: Response) => {
  const { question, submittedIndex, userId, submittedForms, submittedText } = req.body as {
    question: VerbQuestion;
    submittedIndex: number;
    userId: string;
    submittedForms?: string[];
    submittedText?: string;
  };

  if (!question || !userId) {
    res.status(400).json({ error: "question and userId are required" });
    return;
  }

  let result;
  if (question.mode === "main_forms") {
    if (!submittedForms || submittedForms.length !== 3) {
      res.status(400).json({ error: "submittedForms (array of 3) is required for main_forms" });
      return;
    }
    result = checkMainFormsAnswer(question, submittedForms);
  } else if (question.mode === "conjugation_drill") {
    if (submittedText === undefined) {
      res.status(400).json({ error: "submittedText is required for conjugation_drill" });
      return;
    }
    result = checkConjugationDrillAnswer(question, submittedText);
  } else if (question.mode === "fill_blank" || question.mode === "fill_blank_hint") {
    if (submittedText === undefined) {
      res.status(400).json({ error: "submittedText is required for fill_blank" });
      return;
    }
    result = checkFillBlankAnswer(question, submittedText);
  } else {
    if (submittedIndex === undefined) {
      res.status(400).json({ error: "submittedIndex is required" });
      return;
    }
    if (
      typeof submittedIndex !== "number" ||
      submittedIndex < 0 ||
      submittedIndex >= question.choices.length
    ) {
      res.status(400).json({ error: `submittedIndex must be 0–${question.choices.length - 1}` });
      return;
    }
    result = checkAnswer(question, submittedIndex);
  }

  // Record spaced repetition progress (best-effort)
  try {
    await recordAnswer(userId, question.verbId, result.correct);
  } catch {
    // non-fatal
  }

  // Record point earned/lost (best-effort)
  try {
    if (result.correct) {
      result.pointEarned = await earnPoint(userId, question.verbId, question.mode);
    } else {
      result.pointLost = await losePoint(userId, question.verbId, question.mode);
    }
  } catch {
    // non-fatal
  }

  res.json(result);
});

// ---------------------------------------------------------------------------
// POST /stats
// Body: { sessionId, score, total, durationS }
// ---------------------------------------------------------------------------
router.post("/stats", async (req: Request, res: Response) => {
  const { sessionId, score, total, durationS } = req.body as {
    sessionId: string;
    score: number;
    total: number;
    durationS: number;
  };

  if (!sessionId || score == null || !total || durationS == null) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const result = await saveResult({ sessionId, score, total, durationS });
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// ---------------------------------------------------------------------------
// PUT /verbs/:id
// Overwrite a single verb entry in the JSON data file.
// Header: x-admin-password  (required)
// Body: full VerbEntry object
// ---------------------------------------------------------------------------
router.put("/verbs/:id", (req: Request, res: Response) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(503).json({ error: "Editor access not configured (set ADMIN_PASSWORD)" });
    return;
  }
  if (req.headers["x-admin-password"] !== adminPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "id must be an integer" });
    return;
  }

  const verb = req.body;
  if (!verb || verb.id !== id) {
    res.status(400).json({ error: "Body must be a VerbEntry with matching id" });
    return;
  }

  const result = saveVerb(verb);
  if (!result) {
    res.status(404).json({ error: `Verb not found: ${id}` });
    return;
  }
  res.json(result);
});

// ---------------------------------------------------------------------------
// GET /admin/ping
// Lightweight password check — no DB required
// ---------------------------------------------------------------------------
router.get("/admin/ping", (req: Request, res: Response) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(503).json({ error: "Admin access not configured" });
    return;
  }
  if (req.headers["x-admin-password"] !== adminPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// GET /admin/stats
// Header: x-admin-password
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

// ---------------------------------------------------------------------------
// GET /quiz/modes
// Returns supported question modes (for client reference)
// ---------------------------------------------------------------------------
router.get("/quiz/modes", (_req: Request, res: Response) => {
  const modes: QuestionMode[] = [
    "verb_translation",
    "conjugation_drill",
    "main_forms",
    "fill_blank",
    "fill_blank_hint",
  ];
  res.json({ modes });
});

// ---------------------------------------------------------------------------
// GET /progress
// Query params: userId (required)
// Returns earned points grouped by verb for the progress page.
// ---------------------------------------------------------------------------
router.get("/progress", async (req: Request, res: Response) => {
  const { userId } = req.query as Record<string, string | undefined>;
  if (!userId) {
    res.status(400).json({ error: "userId is required" });
    return;
  }
  try {
    const data = await getProgress(userId);
    res.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// ---------------------------------------------------------------------------
// POST /feedback
// Body: { rating: 1–5, comment?: string, lang?: "en"|"ru" }
// Public — no auth required
// ---------------------------------------------------------------------------
router.post("/feedback", async (req: Request, res: Response) => {
  const { rating, comment, lang } = req.body as {
    rating?: number;
    comment?: string;
    lang?: string;
  };

  if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
    res.status(400).json({ error: "rating must be an integer 1–5" });
    return;
  }

  if (!dbAvailable) {
    res.status(503).json({ error: "Database not available" });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO verb_feedback (rating, comment, lang)
       VALUES ($1, $2, $3)
       RETURNING id, rating, comment, lang, created_at`,
      [rating, comment?.trim() || null, lang ?? "en"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// ---------------------------------------------------------------------------
// GET /admin/feedback
// Header: x-admin-password
// Returns all feedback entries, newest first.
// ---------------------------------------------------------------------------
router.get("/admin/feedback", async (req: Request, res: Response) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(503).json({ error: "Admin access not configured" });
    return;
  }
  if (req.headers["x-admin-password"] !== adminPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!dbAvailable) {
    res.status(503).json({ error: "Database not available" });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT id, rating, comment, lang, created_at
       FROM verb_feedback
       ORDER BY created_at DESC
       LIMIT 200`
    );
    const avgResult = await pool.query(
      `SELECT ROUND(AVG(rating)::numeric, 2)::float AS avg_rating, COUNT(*)::int AS total
       FROM verb_feedback`
    );
    res.json({ entries: result.rows, ...avgResult.rows[0] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
