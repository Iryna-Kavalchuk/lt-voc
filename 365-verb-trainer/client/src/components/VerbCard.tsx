import type { VerbEntry, TenseName, ConjugationRow } from "../api/client";

const TENSES: { key: TenseName; label: string }[] = [
  { key: "present",           label: "Present" },
  { key: "past",              label: "Past" },
  { key: "subjunctive",       label: "Subjunctive" },
  { key: "frequentative_past",label: "Freq. Past" },
  { key: "future",            label: "Future" },
  { key: "imperative",        label: "Imperative" },
];

const PERSONS: { key: keyof ConjugationRow; label: string }[] = [
  { key: "as",               label: "aš" },
  { key: "tu",               label: "tu" },
  { key: "jis_ji_jie_jos",   label: "jis/ji/jie/jos" },
  { key: "mes",              label: "mes" },
  { key: "jus",              label: "jūs" },
];

const NON_CONJ_LABELS: Record<string, string> = {
  "1": "Present active participle",
  "2": "Past active participle",
  "3": "Freq. past active participle",
  "4": "Future active participle",
  "5": "Present passive participle",
  "6": "Past passive participle",
  "7": "Present adverbial participle",
  "8": "Present gerund",
  "9": "Past gerund",
};

interface Props {
  verb: VerbEntry;
  compact?: boolean;
}

export default function VerbCard({ verb, compact = false }: Props) {
  return (
    <div className={`verb-card ${compact ? "verb-card-compact" : ""}`}>
      {/* Header: infinitive + forms + translation */}
      <div className="vc-header">
        <div className="vc-infinitive-row">
          <span className="vc-infinitive">{verb.infinitive}</span>
          <span className="vc-forms">{verb.forms.join(", ")}</span>
        </div>
        <div className="vc-translation">{verb.translation}</div>
      </div>

      {!compact && (
        <>
          {/* Conjugation table */}
          <div className="vc-section">
            <div className="vc-section-title">Conjugation</div>
            <div className="conj-table-wrap">
              <table className="conj-table">
                <thead>
                  <tr>
                    <th></th>
                    {TENSES.map((t) => (
                      <th key={t.key}>{t.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERSONS.map((p) => {
                    const hasAnyForm = TENSES.some(
                      (t) => verb.conjugation[t.key]?.[p.key]
                    );
                    if (!hasAnyForm) return null;
                    return (
                      <tr key={p.key}>
                        <td className="conj-person">{p.label}</td>
                        {TENSES.map((t) => (
                          <td key={t.key} className="conj-form">
                            {verb.conjugation[t.key]?.[p.key] ?? "—"}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Non-conjugated forms */}
          <div className="vc-section">
            <div className="vc-section-title">Non-conjugated forms</div>
            <div className="noncj-grid">
              {Object.entries(verb.non_conjugated_forms).map(([num, form]) => (
                <div key={num} className="noncj-row">
                  <span className="noncj-num">{num}.</span>
                  <span className="noncj-label">{NON_CONJ_LABELS[num] ?? `Form ${num}`}:</span>
                  <span className="noncj-form">{form}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Usage examples */}
          {verb.examples.length > 0 && (
            <div className="vc-section">
              <div className="vc-section-title">Examples</div>
              <div className="examples-list">
                {verb.examples.map((ex, i) => (
                  <div key={i} className="example-item">
                    {ex.hint && <span className="example-hint">{ex.hint}</span>}
                    <div className="example-lt">{ex.lt}</div>
                    <div className="example-ru">{ex.ru}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
