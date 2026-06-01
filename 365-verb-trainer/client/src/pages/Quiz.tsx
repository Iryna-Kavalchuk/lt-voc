import { useState, useCallback, useRef } from "react";
import { api, type VerbQuestion, type StatsResult, type VerbEntry, type TenseName, type QuestionMode } from "../api/client";
import VerbCard from "../components/VerbCard";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type QuizPhase =
  | { phase: "setup" }
  | { phase: "loading" }
  | { phase: "error"; message: string }
  | { phase: "question"; question: VerbQuestion; selected: number | null }
  | { phase: "answered"; question: VerbQuestion; selected: number; correct: boolean; correctAnswer: string; pointEarned: boolean; pointLost: boolean };

interface SessionStats {
  total: number;
  correct: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const QUIZ_SIZES = [10, 25, 50] as const;
type QuizSize = typeof QUIZ_SIZES[number];

const TENSE_LABEL: Record<TenseName, string> = {
  present: "Present",
  past: "Past",
  subjunctive: "Subjunctive / Conditional",
  future: "Future",
  imperative: "Imperative",
};

const PERSON_LABEL: Record<string, string> = {
  as: "aš (I)",
  tu: "tu (you)",
  jis_ji_jie_jos: "jis / ji / jie / jos",
  mes: "mes (we)",
  jus: "jūs (you pl.)",
};

const MODE_LABEL: Record<QuestionMode, string> = {
  verb_translation:  "Verb translation",
  conjugation_drill: "Conjugation drill",
  main_forms:        "Main forms",
  fill_blank:        "Fill in the blank",
  fill_blank_hint:   "Fill in the blank (with hint)",
};

const FORM_LABEL = ["Infinitive", "Present (3rd)", "Past (3rd)"];

const ALL_MODES: QuestionMode[] = [
  "verb_translation",
  "conjugation_drill",
  "main_forms",
  "fill_blank",
  "fill_blank_hint",
];

// ---------------------------------------------------------------------------
// Session ID helpers
// ---------------------------------------------------------------------------

function getUserId(): string {
  const key = "verb_trainer_user_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function getSessionId(): string {
  return crypto.randomUUID();
}

// ---------------------------------------------------------------------------
// Main forms input component
// ---------------------------------------------------------------------------

interface MainFormsInputProps {
  question: VerbQuestion;
  answered: boolean;
  inputs: string[];
  onInputChange: (idx: number, value: string) => void;
  onSubmit: () => void;
}

function MainFormsInput({ question, answered, inputs, onInputChange, onSubmit }: MainFormsInputProps) {
  const givenIndex = question.givenIndex ?? 0;
  const correctForms = question.choices;

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !answered) onSubmit();
  };

  return (
    <div className="main-forms-grid">
      {[0, 1, 2].map((i) => {
        const isGiven = i === givenIndex;
        const normalize = (s: string) =>
          s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036F]/g, "");
        let inputCls = "main-forms-input";
        if (answered && !isGiven) {
          inputCls += normalize(inputs[i]) === normalize(correctForms[i]) ? " mf-correct" : " mf-wrong";
        }
        const isCorrect = answered && !isGiven && normalize(inputs[i]) === normalize(correctForms[i]);
        return (
          <div key={i} className="main-forms-row">
            <span className="main-forms-label">{FORM_LABEL[i]}</span>
            <input
              className={inputCls}
              type="text"
              value={inputs[i]}
              readOnly={isGiven || answered}
              placeholder={isGiven ? "" : "type here…"}
              onChange={(e) => onInputChange(i, e.target.value)}
              onKeyDown={handleKey}
              autoFocus={!isGiven && i === (givenIndex === 0 ? 1 : 0)}
            />
            {answered && !isGiven && !isCorrect && (
              <span className="mf-hint">{correctForms[i]}</span>
            )}
          </div>
        );
      })}
      {!answered && (
        <button className="btn-primary mf-submit-btn" onClick={onSubmit}>
          Check
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Verb detail review panel
// ---------------------------------------------------------------------------

function ReviewPanel({ verb }: { verb: VerbEntry }) {
  return (
    <div className="review-panel">
      <h3 className="review-title">Verb review</h3>
      <VerbCard verb={verb} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Quiz component
// ---------------------------------------------------------------------------

export default function Quiz() {
  const [quizSize, setQuizSize] = useState<QuizSize>(25);
  const [selectedModes, setSelectedModes] = useState<QuestionMode[]>([...ALL_MODES]);
  const [state, setState] = useState<QuizPhase>({ phase: "setup" });
  const [stats, setStats] = useState<SessionStats>({ total: 0, correct: 0 });
  const [finished, setFinished] = useState(false);
  const [statsResult, setStatsResult] = useState<StatsResult | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [mainFormsInputs, setMainFormsInputs] = useState<string[]>(["", "", ""]);
  const [conjDrillInput, setConjDrillInput] = useState("");
  const [fillBlankInput, setFillBlankInput] = useState("");

  const startTimeRef = useRef<number>(Date.now());
  const shownVerbIdsRef = useRef<number[]>([]);
  const sessionIdRef = useRef<string>(getSessionId());
  const modesRef = useRef<QuestionMode[]>(selectedModes);
  modesRef.current = selectedModes;
  const userId = getUserId();

  const loadQuestion = useCallback((questionNumber: number, modes: QuestionMode[]) => {
    setState({ phase: "loading" });
    api.quiz
      .question({
        userId,
        exclude: shownVerbIdsRef.current,
        questionNumber,
        modes: modes.length === ALL_MODES.length ? undefined : modes,
      })
      .then((q) => {
        if (!shownVerbIdsRef.current.includes(q.verbId)) {
          shownVerbIdsRef.current = [...shownVerbIdsRef.current, q.verbId];
        }
        if (q.mode === "main_forms" && q.givenIndex !== undefined) {
          const pre = ["", "", ""];
          pre[q.givenIndex] = q.choices[q.givenIndex];
          setMainFormsInputs(pre);
        } else {
          setMainFormsInputs(["", "", ""]);
        }
        setConjDrillInput("");
        setFillBlankInput("");
        setState({ phase: "question", question: q, selected: null });
        setShowReview(false);
      })
      .catch((e: Error) => setState({ phase: "error", message: e.message }));
  }, [userId]);

  const startSession = useCallback(() => {
    shownVerbIdsRef.current = [];
    sessionIdRef.current = getSessionId();
    setStats({ total: 0, correct: 0 });
    setFinished(false);
    setStatsResult(null);
    setShowReview(false);
    startTimeRef.current = Date.now();
    loadQuestion(1, modesRef.current);
  }, [loadQuestion]);

  const finishQuestion = async (correct: boolean, correctAnswer: string, selectedIdx: number, pointEarned = false, pointLost = false) => {
    const newStats = {
      total: stats.total + 1,
      correct: stats.correct + (correct ? 1 : 0),
    };
    setStats(newStats);
    setShowReview(true);

    if (state.phase !== "question") return;
    setState({
      phase: "answered",
      question: state.question,
      selected: selectedIdx,
      correct,
      correctAnswer,
      pointEarned,
      pointLost,
    });

    if (newStats.total >= quizSize) {
      setFinished(true);
      const durationS = Math.round((Date.now() - startTimeRef.current) / 1000);
      api.stats.submit({
        sessionId: sessionIdRef.current,
        score: newStats.correct,
        total: newStats.total,
        durationS,
      })
        .then(setStatsResult)
        .catch(() => {});
    }
  };

  const handleSelect = async (idx: number) => {
    if (state.phase !== "question" || state.selected !== null) return;
    setState({ ...state, selected: idx });
    const result = await api.quiz.check(state.question, idx, userId).catch(() => null);
    if (!result) return;
    await finishQuestion(result.correct, result.correctAnswer, idx, result.pointEarned, result.pointLost);
  };

  const handleMainFormsSubmit = async () => {
    if (state.phase !== "question") return;
    const result = await api.quiz
      .check(state.question, -1, userId, mainFormsInputs)
      .catch(() => null);
    if (!result) return;
    await finishQuestion(result.correct, result.correctAnswer, -1, result.pointEarned, result.pointLost);
  };

  const handleConjDrillSubmit = async () => {
    if (state.phase !== "question" || !conjDrillInput.trim()) return;
    const result = await api.quiz
      .check(state.question, -1, userId, undefined, conjDrillInput)
      .catch(() => null);
    if (!result) return;
    await finishQuestion(result.correct, result.correctAnswer, -1, result.pointEarned, result.pointLost);
  };

  const handleFillBlankSubmit = async () => {
    if (state.phase !== "question" || !fillBlankInput.trim()) return;
    const result = await api.quiz
      .check(state.question, -1, userId, undefined, fillBlankInput)
      .catch(() => null);
    if (!result) return;
    await finishQuestion(result.correct, result.correctAnswer, -1, result.pointEarned, result.pointLost);
  };

  const handleNext = () => {
    if (state.phase !== "answered") return;
    loadQuestion(stats.total + 1, modesRef.current);
  };

  const toggleMode = (mode: QuestionMode) => {
    setSelectedModes((prev) => {
      if (prev.includes(mode)) {
        // Don't allow deselecting the last mode
        if (prev.length === 1) return prev;
        return prev.filter((m) => m !== mode);
      }
      return [...prev, mode];
    });
  };

  const isAllSelected = selectedModes.length === ALL_MODES.length;

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : null;

  // ── Setup screen ────────────────────────────────────────────────────────────
  if (state.phase === "setup") {
    return (
      <div className="quiz-page">
        <div className="quiz-setup">
          <h2 className="setup-title">Start a training session</h2>

          {/* Mode picker */}
          <div className="setup-section">
            <span className="setup-label">Question types:</span>
            <div className="mode-picker">
              <button
                className={`mode-btn ${isAllSelected ? "active" : ""}`}
                onClick={() => setSelectedModes([...ALL_MODES])}
              >
                Mixed
              </button>
              {ALL_MODES.map((m) => (
                <button
                  key={m}
                  className={`mode-btn ${!isAllSelected && selectedModes.includes(m) ? "active" : ""}`}
                  onClick={() => {
                    if (isAllSelected) {
                      // Switch from mixed to single-mode selection
                      setSelectedModes([m]);
                    } else {
                      toggleMode(m);
                    }
                  }}
                >
                  {MODE_LABEL[m]}
                </button>
              ))}
            </div>
          </div>

          {/* Quiz size */}
          <div className="setup-section">
            <span className="setup-label">Questions per session:</span>
            <div className="setup-size-row">
              {QUIZ_SIZES.map((n) => (
                <button
                  key={n}
                  className={`size-btn ${quizSize === n ? "active" : ""}`}
                  onClick={() => setQuizSize(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-primary" onClick={startSession}>
            Start ({quizSize} questions)
          </button>
        </div>
      </div>
    );
  }

  // ── Score bar (shown during active quiz) ────────────────────────────────────
  const currentQ = Math.min(stats.total + (state.phase === "question" ? 1 : 0), quizSize);

  return (
    <div className="quiz-page">
      {!finished && (
        <div className="score-bar">
          <span>Question: <strong>{currentQ}/{quizSize}</strong></span>
          <span>Score: <strong>{stats.correct}/{stats.total}</strong></span>
          {accuracy !== null && <span className="accuracy">{accuracy}%</span>}
          <button className="btn-ghost" onClick={() => setState({ phase: "setup" })}>
            Restart
          </button>
        </div>
      )}

      {/* ── Finished screen ── */}
      {finished && (
        <div className="quiz-card quiz-results">
          <h2 className="results-title">Session complete!</h2>
          <p className="results-score">{stats.correct} / {quizSize}</p>
          <p className="results-accuracy">{accuracy}% accuracy</p>
          {statsResult && statsResult.totalResults > 1 && (
            <div className="percentile-banner">
              Better than <strong>{statsResult.percentile}%</strong> of all sessions
              {statsResult.totalResults >= 10 && (
                <span className="percentile-count"> ({statsResult.totalResults} total)</span>
              )}
            </div>
          )}
          <button className="btn-primary" onClick={() => setState({ phase: "setup" })}>
            New session
          </button>
        </div>
      )}

      {/* ── Loading ── */}
      {!finished && state.phase === "loading" && (
        <div className="quiz-card">
          <p className="status-msg">Loading question…</p>
        </div>
      )}

      {/* ── Error ── */}
      {!finished && state.phase === "error" && (
        <div className="quiz-card">
          <p className="status-msg error">{state.message}</p>
          <button className="btn-primary" onClick={() => loadQuestion(stats.total + 1, modesRef.current)}>
            Try again
          </button>
        </div>
      )}

      {/* ── Question / Answered ── */}
      {!finished && (state.phase === "question" || state.phase === "answered") && (
        <>
          <div className="quiz-card">
            <span className="mode-badge">{MODE_LABEL[state.question.mode]}</span>

            {/* Extra context labels for conjugation drill */}
            {state.question.mode === "conjugation_drill" && state.question.tense && state.question.person && (
              <div className="drill-context">
                <span className="drill-tense">{TENSE_LABEL[state.question.tense]}</span>
                <span className="drill-person">{PERSON_LABEL[state.question.person] ?? state.question.person}</span>
              </div>
            )}

            {/* fill_blank / fill_blank_hint: hint shown above the Russian sentence */}
            {(state.question.mode === "fill_blank" || state.question.mode === "fill_blank_hint") && state.question.hint && (
              <div className="fill-blank-hint-wrap">
                <span className="fill-blank-hint">{state.question.hint}</span>
              </div>
            )}

            {/* Prompt */}
            <div className={`quiz-prompt-wrap ${state.question.mode === "fill_blank" || state.question.mode === "fill_blank_hint" ? "fill-blank-prompt" : ""}`}>
              {state.question.mode === "verb_translation" ? (
                <div className="fill-blank-hint-wrap">
                  <span className="fill-blank-hint">{state.question.prompt}</span>
                </div>
              ) : state.question.mode === "main_forms" ? (
                <h2 className="quiz-translation-prompt">{state.question.prompt}</h2>
              ) : state.question.mode === "conjugation_drill" ? (
                <div className="fill-blank-hint-wrap">
                  <span className="fill-blank-hint">{state.question.prompt.split(" — ")[0]}</span>
                </div>
              ) : state.question.mode === "fill_blank" || state.question.mode === "fill_blank_hint" ? (
                /* fill_blank / fill_blank_hint: show the RU sentence as the main prompt */
                <p className="quiz-sentence">{state.question.prompt}</p>
              ) : (
                <p className="quiz-sentence">{state.question.prompt}</p>
              )}
            </div>

            {/* fill_blank / fill_blank_hint: LT sentence with blank */}
            {(state.question.mode === "fill_blank" || state.question.mode === "fill_blank_hint") && (
              <div className="fill-blank-context">
                <p className="fill-blank-lt">{state.question.sentenceLt}</p>
              </div>
            )}

            <p className="quiz-instruction">
              {state.question.mode === "verb_translation" && "Pick the Russian translation"}
              {state.question.mode === "conjugation_drill" && "Type the correct conjugated form"}
              {state.question.mode === "main_forms" && "Type the 3 main forms"}
              {(state.question.mode === "fill_blank" || state.question.mode === "fill_blank_hint") && "Type the missing verb form"}
            </p>

            {/* Main forms: 3 text inputs */}
            {state.question.mode === "main_forms" ? (
              <MainFormsInput
                question={state.question}
                answered={state.phase === "answered"}
                inputs={mainFormsInputs}
                onInputChange={(i, v) =>
                  setMainFormsInputs((prev) => { const n = [...prev]; n[i] = v; return n; })
                }
                onSubmit={handleMainFormsSubmit}
              />
            ) : state.question.mode === "conjugation_drill" ? (
              /* Conjugation drill: single text input */
              <div className="conj-drill-input-wrap">
                <input
                  className={`conj-drill-input ${
                    state.phase === "answered"
                      ? state.correct ? "mf-correct" : "mf-wrong"
                      : ""
                  }`}
                  type="text"
                  value={conjDrillInput}
                  readOnly={state.phase === "answered"}
                  placeholder="type the form…"
                  autoFocus
                  onChange={(e) => setConjDrillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleConjDrillSubmit(); }}
                />
                {state.phase === "answered" && !state.correct && (
                  <span className="mf-hint">{state.correctAnswer}</span>
                )}
                {state.phase === "question" && (
                  <button
                    className="btn-primary mf-submit-btn"
                    onClick={handleConjDrillSubmit}
                    disabled={!conjDrillInput.trim()}
                  >
                    Check
                  </button>
                )}
              </div>
            ) : state.question.mode === "fill_blank" || state.question.mode === "fill_blank_hint" ? (
              /* Fill in the blank (with or without full hint): single text input */
              <div className="conj-drill-input-wrap">
                <input
                  className={`conj-drill-input ${
                    state.phase === "answered"
                      ? state.correct ? "mf-correct" : "mf-wrong"
                      : ""
                  }`}
                  type="text"
                  value={fillBlankInput}
                  readOnly={state.phase === "answered"}
                  placeholder="type the missing form…"
                  autoFocus
                  onChange={(e) => setFillBlankInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleFillBlankSubmit(); }}
                />
                {state.phase === "answered" && !state.correct && (
                  <span className="mf-hint">{state.correctAnswer}</span>
                )}
                {state.phase === "question" && (
                  <button
                    className="btn-primary mf-submit-btn"
                    onClick={handleFillBlankSubmit}
                    disabled={!fillBlankInput.trim()}
                  >
                    Check
                  </button>
                )}
              </div>
            ) : (
              <div className="choices">
                {state.question.choices.map((choice, idx) => {
                  let cls = "choice-btn";
                  if (state.phase === "answered") {
                    if (idx === state.question.correctIndex) cls += " correct";
                    else if (idx === state.selected) cls += " wrong";
                  } else if (state.phase === "question" && state.selected === idx) {
                    cls += " selected";
                  }
                  return (
                    <button
                      key={idx}
                      className={cls}
                      onClick={() => handleSelect(idx)}
                      disabled={state.phase === "answered"}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
            )}

            {state.phase === "answered" && (
              <div className={`feedback ${state.correct ? "feedback-correct" : "feedback-wrong"}`}>
                {state.correct
                  ? "Correct!"
                  : state.question.mode === "main_forms"
                    ? "Not quite — see the correct forms above"
                    : state.question.mode === "conjugation_drill" || state.question.mode === "fill_blank" || state.question.mode === "fill_blank_hint"
                      ? "Not quite — see the correct form above"
                      : `Wrong — the answer is "${state.correctAnswer}"`}
                {state.pointEarned && (
                  <span className="point-notice point-earned">+ 1 point earned</span>
                )}
                {state.pointLost && (
                  <span className="point-notice point-lost">− 1 point lost</span>
                )}
                <button
                  className="btn-ghost review-toggle"
                  onClick={() => setShowReview((v) => !v)}
                >
                  {showReview ? "Hide verb details" : "Show verb details"}
                </button>
                {!finished && (
                  <button className="btn-primary next-btn" onClick={handleNext}>
                    Next question →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Verb review card shown after answering */}
          {state.phase === "answered" && showReview && (
            <ReviewPanel verb={state.question.verbEntry} />
          )}
        </>
      )}
    </div>
  );
}
