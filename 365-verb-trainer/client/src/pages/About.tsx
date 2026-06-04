import { useLang } from "../context/LangContext";

const BOOK_PDF_URL =
  "https://www.flf.vu.lt/dokumentai/Mokslas/Elektroniniai_istekliai/Projektas_Lietuva_cia_ir_ten/2015_365_lietuvi%C5%B3_kalbos_veiksma%C5%BEod%C5%BEiai_rus%C5%B3_kalba.pdf";

export default function About() {
  const { t } = useLang();

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

      <div className="about-card about-card-footer">
        <p className="about-noncommercial">{t.about_noncommercial}</p>
        <p className="about-copyright">{t.about_copyright}</p>
      </div>
    </div>
  );
}
