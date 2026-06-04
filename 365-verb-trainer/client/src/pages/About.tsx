import { useState } from "react";
import { useLang } from "../context/LangContext";
import { api } from "../api/client";

const BOOK_PDF_URL =
  "https://www.flf.vu.lt/dokumentai/Mokslas/Elektroniniai_istekliai/Projektas_Lietuva_cia_ir_ten/2015_365_lietuvi%C5%B3_kalbos_veiksma%C5%BEod%C5%BEiai_rus%C5%B3_kalba.pdf";

function StarRating({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  label: (n: number) => string;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  return (
    <div className="star-rating" role="group">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star-btn${active >= n ? " filled" : ""}`}
          aria-label={label(n)}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function About() {
  const { lang, t } = useLang();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    setStatus("submitting");
    try {
      await api.feedback.submit({ rating, comment: comment.trim() || undefined, lang });
      setStatus("success");
      setRating(0);
      setComment("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="about-page">
      <h1 className="about-title">{t.about_title}</h1>

      <div className="about-card">
        <p className="about-desc">{t.about_app_desc}</p>
      </div>

      <div className="about-card">
        <h2 className="about-section-title">{t.about_book_title}</h2>
        <div className="about-book">
          <div className="about-book-num">365</div>
          <div className="about-book-meta">
            <div className="about-book-authors">{t.about_book_authors}</div>
            <div className="about-book-pub">{t.about_book_pub}</div>
            <a
              className="about-book-link"
              href={BOOK_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.about_book_link} ↗
            </a>
          </div>
        </div>
      </div>

      <div className="about-card">
        <h2 className="about-section-title">{t.about_thanks_title}</h2>
        <p className="about-desc">{t.about_thanks_text}</p>
      </div>

      {/* Authors */}
      <div className="about-card">
        <h2 className="about-section-title">{t.about_authors_title}</h2>
        <p className="about-desc about-authors-text">{t.about_authors_text}</p>
      </div>

      {/* Feedback form */}
      <div className="about-card">
        <h2 className="about-section-title">{t.about_feedback_title}</h2>
        {status === "success" ? (
          <p className="feedback-success">{t.about_feedback_success}</p>
        ) : (
          <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="feedback-rating-row">
              <span className="feedback-rating-label">{t.about_feedback_rating}</span>
              <StarRating value={rating} onChange={setRating} label={t.about_feedback_star} />
            </div>
            <textarea
              className="feedback-textarea"
              placeholder={t.about_feedback_comment}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={1000}
            />
            {status === "error" && (
              <p className="feedback-error">{t.about_feedback_error}</p>
            )}
            <button
              className="btn-primary feedback-submit"
              type="submit"
              disabled={!rating || status === "submitting"}
            >
              {status === "submitting" ? t.about_feedback_submitting : t.about_feedback_submit}
            </button>
          </form>
        )}
      </div>

      <div className="about-card about-card-footer">
        <p className="about-noncommercial">{t.about_noncommercial}</p>
        <p className="about-copyright">{t.about_copyright}</p>
      </div>
    </div>
  );
}
