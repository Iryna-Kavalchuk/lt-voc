import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { router } from "./routes.js";
import { initDb } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(express.json());

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // All verb trainer routes under /api
  app.use("/api", router);

  // Serve audio files
  const audioDir = path.resolve(__dirname, "./data/audio");
  app.use("/audio", express.static(audioDir));

  // Serve the React frontend in production
  const clientDist = path.resolve(__dirname, "../../client/dist");
  app.use(express.static(clientDist));
  // SPA fallback
  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });

  return app;
}

// Only start the server when run directly (not imported in tests)
const isMain =
  process.argv[1] === new URL(import.meta.url).pathname ||
  process.argv[1]?.replace(/\\/g, "/").endsWith("src/index.ts") ||
  process.env.START_SERVER === "1";

if (isMain) {
  const PORT = Number(process.env.PORT) || 3001;
  const app = createApp();

  // Start listening immediately — DB is optional
  app.listen(PORT, () => {
    console.log(`365 Verb Trainer server listening on http://localhost:${PORT}`);
  });

  // Attempt DB init in the background; warn but don't crash if unavailable
  initDb()
    .then(() => {
      console.log("Database connected — spaced repetition and stats enabled.");
    })
    .catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`Database unavailable (${msg}) — running without persistence.`);
    });
}
