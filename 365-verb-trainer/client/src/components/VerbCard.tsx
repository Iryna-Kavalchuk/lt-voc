import type { VerbEntry, TenseName, ConjugationRow } from "../api/client";
import { useLang } from "../context/LangContext";

const TENSES: { key: TenseName; labelKey: keyof ReturnType<typeof useLang>["t"] }[] = [
  { key: "present",            labelKey: "tense_present" },
  { key: "past",               labelKey: "tense_past" },
  { key: "subjunctive",        labelKey: "tense_subjunctive" },
  { key: "frequentative_past", labelKey: "tense_frequentative_past" },
  { key: "future",             labelKey: "tense_future" },
  { key: "imperative",         labelKey: "tense_imperative" },
];

const PERSONS: { key: keyof ConjugationRow; label: string }[] = [
  { key: "as",               label: "aš" },
  { key: "tu",               label: "tu" },
  { key: "jis_ji_jie_jos",   label: "jis/ji/jie/jos" },
  { key: "mes",              label: "mes" },
  { key: "jus",              label: "jūs" },
];

const NONCJ_KEYS = ["noncj_1","noncj_2","noncj_3","noncj_4","noncj_5","noncj_6","noncj_7","noncj_8","noncj_9"] as const;

interface Props {
  verb: VerbEntry;
  compact?: boolean;
}

export default function VerbCard({ verb, compact = false }: Props) {
  const { t } = useLang();

  return (
    <div className={`verb-card ${compact ? "verb-card-compact" : ""}`}>
      {/* Header */}
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
            <div className="vc-section-title">{t.vc_conjugation}</div>
            <div className="conj-table-wrap">
              <table className="conj-table">
                <thead>
                  <tr>
                    <th></th>
                    {TENSES.map((ten) => (
                      <th key={ten.key}>{String(t[ten.labelKey])}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERSONS.map((p) => {
                    const hasAnyForm = TENSES.some(
                      (ten) => verb.conjugation[ten.key]?.[p.key]
                    );
                    if (!hasAnyForm) return null;
                    return (
                      <tr key={p.key}>
                        <td className="conj-person">{p.label}</td>
                        {TENSES.map((ten) => (
                          <td key={ten.key} className="conj-form">
                            {verb.conjugation[ten.key]?.[p.key] ?? "—"}
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
            <div className="vc-section-title">{t.vc_nonconjugated}</div>
            <div className="noncj-grid">
              {Object.entries(verb.non_conjugated_forms).map(([num, form]) => {
                const key = `noncj_${num}` as typeof NONCJ_KEYS[number];
                const label = t[key] ?? `Form ${num}`;
                return (
                  <div key={num} className="noncj-row">
                    <span className="noncj-num">{num}.</span>
                    <span className="noncj-label">{String(label)}:</span>
                    <span className="noncj-form">{form}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Usage examples */}
          {verb.examples.length > 0 && (
            <div className="vc-section">
              <div className="vc-section-title">{t.vc_examples}</div>
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
