import { useState } from "react";
import { api, type VerbEntry, type VerbExample } from "../api/client";

interface FortuneResult {
  verb: VerbEntry;
  example: VerbExample;
}

type Status = "idle" | "loading" | "ready" | "error";

export default function Fortune() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [error, setError] = useState("");

  async function draw() {
    setStatus("loading");
    setError("");
    try {
      const { verbs } = await api.verbs.list();
      // Keep only verbs that have examples
      const withExamples = verbs.filter((v) => v.examples.length > 0);
      const verb = withExamples[Math.floor(Math.random() * withExamples.length)];
      const example = verb.examples[Math.floor(Math.random() * verb.examples.length)];
      setResult({ verb, example });
      setStatus("ready");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setStatus("error");
    }
  }

  return (
    <div className="fortune-page">
      <h1 className="fortune-title">Fortune</h1>
      <p className="fortune-subtitle">Draw a random Lithuanian sentence from the 365 verbs book</p>

      <button className="fortune-btn btn-primary" onClick={draw} disabled={status === "loading"}>
        {status === "loading" ? "Drawing…" : status === "ready" ? "Draw again" : "Draw"}
      </button>

      {status === "error" && <p className="status-msg error">{error}</p>}

      {status === "ready" && result && (
        <div className="fortune-card">
          <div className="fortune-verb">
            <span className="fortune-verb-infinitive">{result.verb.infinitive}</span>
            <span className="fortune-verb-translation">{result.verb.translation}</span>
          </div>
          <div className="fortune-example">
            {result.example.hint && (
              <span className="example-hint">{result.example.hint}</span>
            )}
            <p className="fortune-lt">{result.example.lt}</p>
            <p className="fortune-ru">{result.example.ru}</p>
          </div>
        </div>
      )}
    </div>
  );
}
