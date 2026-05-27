import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { router } from "./routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(express.json());

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // All vocabulary / quiz routes under /api
  app.use("/api", router);

  // Serve the React frontend in production
  const clientDist = path.resolve(__dirname, "../../../client/dist");
  app.use(express.static(clientDist));
  // SPA fallback — return index.html for any non-API route
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });

  return app;
}

// Only start the server when this file is run directly (not imported in tests)
const isMain =
  process.argv[1] === new URL(import.meta.url).pathname ||
  process.argv[1]?.replace(/\\/g, "/").endsWith("src/index.ts") ||
  process.env.START_SERVER === "1";

if (isMain) {
  const PORT = Number(process.env.PORT) || 3000;
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Lithuanian Vocab server listening on http://localhost:${PORT}`);
  });
}
