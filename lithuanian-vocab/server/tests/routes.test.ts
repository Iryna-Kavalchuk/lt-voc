import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/index.js";

const app = createApp();

// ---------------------------------------------------------------------------
// GET /health
// ---------------------------------------------------------------------------
describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

// ---------------------------------------------------------------------------
// GET /api/dictionaries
// ---------------------------------------------------------------------------
describe("GET /api/dictionaries", () => {
  it("returns a list of dictionaries", async () => {
    const res = await request(app).get("/api/dictionaries");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.dictionaries)).toBe(true);
    expect(res.body.dictionaries.length).toBeGreaterThan(0);
    const first = res.body.dictionaries[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("name");
  });

  it("includes a1-sekmes dictionary", async () => {
    const res = await request(app).get("/api/dictionaries");
    const ids = res.body.dictionaries.map((d: { id: string }) => d.id);
    expect(ids).toContain("a1-sekmes");
  });
});

// ---------------------------------------------------------------------------
// GET /api/words
// ---------------------------------------------------------------------------
describe("GET /api/words", () => {
  it("returns all entries", async () => {
    const res = await request(app).get("/api/words");
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.entries).toHaveLength(res.body.count);
  });

  it("filters by category", async () => {
    const res = await request(app).get("/api/words?category=animals");
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(5);
    res.body.entries.forEach((e: { category: string }) => {
      expect(e.category).toBe("animals");
    });
  });

  it("filters by level", async () => {
    const res = await request(app).get("/api/words?level=A1");
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    res.body.entries.forEach((e: { level: string }) => {
      expect(e.level).toBe("A1");
    });
  });

  it("filters by dictionary", async () => {
    const res = await request(app).get("/api/words?dictionary=a1-sekmes");
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
  });

  it("returns 400 for unknown dictionary", async () => {
    const res = await request(app).get("/api/words?dictionary=nonexistent");
    expect(res.status).toBe(400);
  });

  it("returns empty list for unknown category", async () => {
    const res = await request(app).get("/api/words?category=martians");
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.entries).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// GET /api/words/:id
// ---------------------------------------------------------------------------
describe("GET /api/words/:id", () => {
  it("returns the correct entry", async () => {
    const res = await request(app).get("/api/words/lt_animals_001");
    expect(res.status).toBe(200);
    expect(res.body.word).toBe("katė");
    expect(res.body.translations.en).toBe("cat");
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app).get("/api/words/lt_nope_999");
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});

// ---------------------------------------------------------------------------
// GET /api/categories
// ---------------------------------------------------------------------------
describe("GET /api/categories", () => {
  it("returns a sorted list of categories", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.length).toBeGreaterThan(0);
    // should be sorted
    const cats: string[] = res.body.categories;
    expect(cats).toEqual([...cats].sort());
  });
});

// ---------------------------------------------------------------------------
// GET /api/levels
// ---------------------------------------------------------------------------
describe("GET /api/levels", () => {
  it("returns available CEFR levels in order", async () => {
    const res = await request(app).get("/api/levels");
    expect(res.status).toBe(200);
    expect(res.body.levels).toContain("A1");
  });
});

// ---------------------------------------------------------------------------
// GET /api/quiz
// ---------------------------------------------------------------------------
describe("GET /api/quiz", () => {
  it("returns a well-formed question (default lang=en)", async () => {
    const res = await request(app).get("/api/quiz");
    expect(res.status).toBe(200);
    const q = res.body;
    expect(q).toHaveProperty("entryId");
    expect(q).toHaveProperty("word");
    expect(q).toHaveProperty("lang", "en");
    expect(q).toHaveProperty("choices");
    expect(q.choices).toHaveLength(4);
    expect(q).toHaveProperty("correctIndex");
    expect(q.correctIndex).toBeGreaterThanOrEqual(0);
    expect(q.correctIndex).toBeLessThan(4);
  });

  it("returns a question in Russian when lang=ru", async () => {
    const res = await request(app).get("/api/quiz?lang=ru");
    expect(res.status).toBe(200);
    expect(res.body.lang).toBe("ru");
  });

  it("filters by category", async () => {
    for (let i = 0; i < 5; i++) {
      const res = await request(app).get("/api/quiz?category=colors");
      expect(res.status).toBe(200);
      expect(res.body.word).toBeTruthy();
      // All returned words must be from the colors category
      const wordRes = await request(app).get(`/api/words?category=colors`);
      const colorWords = wordRes.body.entries.map((e: { word: string }) => e.word);
      expect(colorWords).toContain(res.body.word);
    }
  });

  it("returns 400 for an invalid lang", async () => {
    const res = await request(app).get("/api/quiz?lang=fr");
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it("returns 400 for an unknown category", async () => {
    const res = await request(app).get("/api/quiz?category=klingon");
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// POST /api/quiz/check
// ---------------------------------------------------------------------------
describe("POST /api/quiz/check", () => {
  it("returns correct: true for the right index", async () => {
    // First get a question
    const qRes = await request(app).get("/api/quiz");
    const question = qRes.body;

    const res = await request(app)
      .post("/api/quiz/check")
      .send({ question, submittedIndex: question.correctIndex });

    expect(res.status).toBe(200);
    expect(res.body.correct).toBe(true);
    expect(res.body.correctAnswer).toBeTruthy();
  });

  it("returns correct: false for a wrong index", async () => {
    const qRes = await request(app).get("/api/quiz");
    const question = qRes.body;
    const wrongIndex = question.correctIndex === 0 ? 1 : 0;

    const res = await request(app)
      .post("/api/quiz/check")
      .send({ question, submittedIndex: wrongIndex });

    expect(res.status).toBe(200);
    expect(res.body.correct).toBe(false);
    expect(res.body.correctAnswer).toBe(
      question.choices[question.correctIndex]
    );
  });

  it("returns 400 when body is missing question", async () => {
    const res = await request(app)
      .post("/api/quiz/check")
      .send({ submittedIndex: 0 });
    expect(res.status).toBe(400);
  });

  it("returns 400 when submittedIndex is missing", async () => {
    const qRes = await request(app).get("/api/quiz");
    const res = await request(app)
      .post("/api/quiz/check")
      .send({ question: qRes.body });
    expect(res.status).toBe(400);
  });

  it("returns 400 for an out-of-range index", async () => {
    const qRes = await request(app).get("/api/quiz");
    const res = await request(app)
      .post("/api/quiz/check")
      .send({ question: qRes.body, submittedIndex: 99 });
    expect(res.status).toBe(400);
  });
});
