import { useEffect, useState, useCallback } from "react";
import { api, type QuizQuestion, type SupportedLanguage } from "../api/client";

type QuizState =
  | { phase: "loading" }
  | { phase: "error"; message: string }
  | { phase: "question"; question: QuizQuestion; selected: number | null; result: null }
  | { phase: "answered"; question: QuizQuestion; selected: number; correct: boolean; correctAnswer: string };

const QUIZ_SIZE = 25;

interface SessionStats {
  total: number;
  correct: number;
}

interface Props {
  lang: SupportedLanguage;
  category?: string;
  dictionary?: string;
}

export default function Quiz({ lang, category, dictionary }: Props) {
  const [state, setState] = useState<QuizState>({ phase: "loading" });
  const [stats, setStats] = useState<SessionStats>({ total: 0, correct: 0 });
  const [finished, setFinished] = useState(false);

  const loadQuestion = useCallback(() => {
    setState({ phase: "loading" });
    api.quiz
      .question({ lang, category: category || undefined, dictionary: dictionary || undefined })
      .then((q) => setState({ phase: "question", question: q, selected: null, result: null }))
      .catch((e: Error) => setState({ phase: "error", message: e.message }));
  }, [lang, category, dictionary]);

  const startNewSession = useCallback(() => {
    setStats({ total: 0, correct: 0 });
    setFinished(false);
    loadQuestion();
  }, [loadQuestion]);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  const handleSelect = async (idx: number) => {
    if (state.phase !== "question" || state.selected !== null) return;

    setState({ ...state, selected: idx });

    const result = await api.quiz.check(state.question, idx).catch(() => null);
    if (!result) return;

    const newStats = {
      total: stats.total + 1,
      correct: stats.correct + (result.correct ? 1 : 0),
    };
    setStats(newStats);

    if (newStats.total >= QUIZ_SIZE) {
      setState({
        phase: "answered",
        question: state.question,
        selected: idx,
        correct: result.correct,
        correctAnswer: result.correctAnswer,
      });
      setFinished(true);
      return;
    }

    setState({
      phase: "answered",
      question: state.question,
      selected: idx,
      correct: result.correct,
      correctAnswer: result.correctAnswer,
    });
  };

  const accuracy =
    stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : null;

  return (
    <div className="quiz-page">
      {/* Score bar */}
      <div className="score-bar">
        <span>Question: <strong>{Math.min(stats.total + (state.phase === "question" ? 1 : 0), QUIZ_SIZE)}/{QUIZ_SIZE}</strong></span>
        <span>Score: <strong>{stats.correct}/{stats.total}</strong></span>
        {accuracy !== null && <span className="accuracy">{accuracy}% accuracy</span>}
        <button className="btn-ghost" onClick={startNewSession}>
          Restart
        </button>
      </div>

      {/* Final results screen */}
      {finished && (
        <div className="quiz-card quiz-results">
          <h2 className="results-title">Quiz complete!</h2>
          <p className="results-score">{stats.correct} / {QUIZ_SIZE} correct</p>
          <p className="results-accuracy">{accuracy}% accuracy</p>
          <button className="btn-primary" onClick={startNewSession}>
            Play again
          </button>
        </div>
      )}

      {!finished && state.phase === "loading" && (
        <div className="quiz-card">
          <p className="status-msg">Loading question…</p>
        </div>
      )}

      {!finished && state.phase === "error" && (
        <div className="quiz-card">
          <p className="status-msg error">{state.message}</p>
          <button className="btn-primary" onClick={loadQuestion}>Try again</button>
        </div>
      )}

      {!finished && (state.phase === "question" || state.phase === "answered") && (
        <div className="quiz-card">
          <p className="quiz-prompt">What does this mean?</p>
          <h2 className="quiz-word">{state.question.word}</h2>
          <p className="quiz-lang-hint">Translate to {state.question.lang === "en" ? "English" : "Russian"}</p>

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

          {state.phase === "answered" && (
            <div className={`feedback ${state.correct ? "feedback-correct" : "feedback-wrong"}`}>
              {state.correct ? "Correct!" : `Wrong — the answer is "${state.correctAnswer}"`}
              <button className="btn-primary next-btn" onClick={loadQuestion}>
                Next question →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
