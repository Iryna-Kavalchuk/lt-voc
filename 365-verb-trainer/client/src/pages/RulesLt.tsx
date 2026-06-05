// Rules page — grammar rules from "365 Lithuanian Verbs" book
// Content is in Lithuanian (rules_lt.txt)

import { useRef } from "react";
import CollapsibleSection, { type CollapsibleSectionHandle } from "../components/CollapsibleSection";

const LT_SECTIONS = [
  {
    id: "lt-indicative", label: "Tiesioginė nuosaka", refKey: "indicative",
    sub: [
      { id: "lt-present",    label: "Esamasis laikas" },
      { id: "lt-past-simple", label: "Būtasis kartinis laikas" },
      { id: "lt-past-freq",  label: "Būtasis dažninis laikas" },
      { id: "lt-future",     label: "Būsimasis laikas" },
    ],
  },
  { id: "lt-imperative",  label: "Liepiamoji nuosaka", refKey: "imperative",  sub: [] },
  { id: "lt-conditional", label: "Tariamoji nuosaka",  refKey: "conditional", sub: [] },
];

function scrollToSection(
  id: string,
  ref: React.RefObject<CollapsibleSectionHandle | null>
) {
  ref.current?.expand();
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}

function scrollToSubsection(
  subId: string,
  parentRef: React.RefObject<CollapsibleSectionHandle | null>
) {
  parentRef.current?.expand();
  setTimeout(() => {
    const el = document.getElementById(subId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}

export default function RulesLt() {
  const refs = {
    indicative:  useRef<CollapsibleSectionHandle>(null),
    imperative:  useRef<CollapsibleSectionHandle>(null),
    conditional: useRef<CollapsibleSectionHandle>(null),
  };

  return (
    <div className="rules-page">

      {/* Table of contents */}
      <nav className="rules-toc">
        <div className="rules-toc-title">Turinys</div>
        <ol className="rules-toc-list">
          {LT_SECTIONS.map((s) => {
            const ref = refs[s.refKey as keyof typeof refs];
            return (
              <li key={s.id}>
                <button
                  className="rules-toc-link"
                  onClick={() => scrollToSection(s.id, ref)}
                >
                  {s.label}
                </button>
                {s.sub.length > 0 && (
                  <ol className="rules-toc-sublist">
                    {s.sub.map((sub) => (
                      <li key={sub.id}>
                        <button
                          className="rules-toc-link rules-toc-link--sub"
                          onClick={() => scrollToSubsection(sub.id, ref)}
                        >
                          {sub.label}
                        </button>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1 — Tiesioginė nuosaka                                     */}
      {/* ------------------------------------------------------------------ */}
      <CollapsibleSection id="lt-indicative" ref={refs.indicative} title="Tiesioginė nuosaka">

        <div className="rules-intro-card">
          <p>
            Pagrindinės veiksmažodžio formos yra bendratis, esamojo ir būtojo kartinio
            laiko 3&nbsp;asmuo. Kitos formos yra padaromos iš šių. Todėl mokantis reikėtų
            įsidėmėti visas tris pagrindines veiksmažodžių formas.
          </p>
          <p>
            Veiksmažodžių tiesioginė nuosaka turi 4&nbsp;vientisinius laikus.
          </p>
        </div>

        {/* ---- 1.1 Esamasis laikas --------------------------------------- */}
        <div id="lt-present" className="rules-tense">
          <h2 className="rules-tense-title">1. Esamasis laikas</h2>

          <p className="rules-tense-desc">Esamasis laikas gali reikšti:</p>
          <ul className="rules-list">
            <li>kalbamuoju momentu vykstantį veiksmą:
              <span className="rules-example"> Aš rašau laišką.</span>
            </li>
            <li>nuolat vykstantį ar pasikartojantį veiksmą:
              <span className="rules-example"> Ši vaistinė dirba naktimis.</span>
            </li>
            <li>veiksmą, kuris greitai įvyks:
              <span className="rules-example"> Rytoj važiuoju prie ežero.</span>
            </li>
          </ul>

          <h3 className="rules-sub-title">Asmenavimas</h3>
          <p className="rules-pattern-note">
            Veiksmažodžiai asmenuojami skirtingai pagal 3&nbsp;asmens formos galūnę:
          </p>

          <div className="rules-tables-row">
            <div className="rules-table-block">
              <div className="rules-table-label">3&nbsp;a. baigiasi <strong>–a</strong> arba <strong>–ia</strong></div>
              <table className="rules-conj-table">
                <tbody>
                  <tr><td className="rules-person">aš</td><td>kalbu</td><td>klausiu</td></tr>
                  <tr><td className="rules-person">tu</td><td>kalbi</td><td>klausi</td></tr>
                  <tr><td className="rules-person">jis, ji</td><td>kalba</td><td>klausia</td></tr>
                  <tr><td className="rules-person">mes</td><td>kalbame</td><td>klausiame</td></tr>
                  <tr><td className="rules-person">jūs</td><td>kalbate</td><td>klausiate</td></tr>
                  <tr><td className="rules-person">jie, jos</td><td>kalba</td><td>klausia</td></tr>
                </tbody>
              </table>
            </div>

            <div className="rules-table-block">
              <div className="rules-table-label">3&nbsp;a. baigiasi <strong>–i</strong></div>
              <table className="rules-conj-table">
                <tbody>
                  <tr><td className="rules-person">aš</td><td>galiu</td></tr>
                  <tr><td className="rules-person">tu</td><td>gali</td></tr>
                  <tr><td className="rules-person">jis, ji</td><td>gali</td></tr>
                  <tr><td className="rules-person">mes</td><td>galime</td></tr>
                  <tr><td className="rules-person">jūs</td><td>galite</td></tr>
                  <tr><td className="rules-person">jie, jos</td><td>gali</td></tr>
                </tbody>
              </table>
            </div>

            <div className="rules-table-block">
              <div className="rules-table-label">3&nbsp;a. baigiasi <strong>–o</strong></div>
              <table className="rules-conj-table">
                <tbody>
                  <tr><td className="rules-person">aš</td><td>rašau</td></tr>
                  <tr><td className="rules-person">tu</td><td>rašai</td></tr>
                  <tr><td className="rules-person">jis, ji</td><td>rašo</td></tr>
                  <tr><td className="rules-person">mes</td><td>rašome</td></tr>
                  <tr><td className="rules-person">jūs</td><td>rašote</td></tr>
                  <tr><td className="rules-person">jie, jos</td><td>rašo</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Reflexive */}
          <h3 className="rules-sub-title">Sangrąžiniai veiksmažodžiai</h3>
          <p className="rules-pattern-note">
            Sangrąžinių veiksmažodžių esamojo laiko formos priklauso nuo 3&nbsp;asmens
            formos galūnės prieš sangrąžos dalelę <strong>–si</strong>:
          </p>

          <div className="rules-tables-row">
            <div className="rules-table-block">
              <div className="rules-table-label">3&nbsp;a. (prieš –si) baigiasi <strong>–a</strong> arba <strong>–ia</strong></div>
              <table className="rules-conj-table">
                <tbody>
                  <tr><td className="rules-person">aš</td><td>perkuosi</td><td>džiaugiuosi</td></tr>
                  <tr><td className="rules-person">tu</td><td>perkiesi</td><td>džiaugiesi</td></tr>
                  <tr><td className="rules-person">jis, ji</td><td>perkasi</td><td>džiaugiasi</td></tr>
                  <tr><td className="rules-person">mes</td><td>perkamės</td><td>džiaugiamės</td></tr>
                  <tr><td className="rules-person">jūs</td><td>perkatės</td><td>džiaugiatės</td></tr>
                  <tr><td className="rules-person">jie, jos</td><td>perkasi</td><td>džiaugiasi</td></tr>
                </tbody>
              </table>
            </div>

            <div className="rules-table-block">
              <div className="rules-table-label">3&nbsp;a. (prieš –si) baigiasi <strong>–i</strong></div>
              <table className="rules-conj-table">
                <tbody>
                  <tr><td className="rules-person">aš</td><td>tikiuosi</td></tr>
                  <tr><td className="rules-person">tu</td><td>tikiesi</td></tr>
                  <tr><td className="rules-person">jis, ji</td><td>tikisi</td></tr>
                  <tr><td className="rules-person">mes</td><td>tikimės</td></tr>
                  <tr><td className="rules-person">jūs</td><td>tikitės</td></tr>
                  <tr><td className="rules-person">jie, jos</td><td>tikisi</td></tr>
                </tbody>
              </table>
            </div>

            <div className="rules-table-block">
              <div className="rules-table-label">3&nbsp;a. (prieš –si) baigiasi <strong>–o</strong></div>
              <table className="rules-conj-table">
                <tbody>
                  <tr><td className="rules-person">aš</td><td>rašausi</td></tr>
                  <tr><td className="rules-person">tu</td><td>rašaisi</td></tr>
                  <tr><td className="rules-person">jis, ji</td><td>rašosi</td></tr>
                  <tr><td className="rules-person">mes</td><td>rašomės</td></tr>
                  <tr><td className="rules-person">jūs</td><td>rašotės</td></tr>
                  <tr><td className="rules-person">jie, jos</td><td>rašosi</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ---- 1.2 Būtasis kartinis laikas -------------------------------- */}
        <div id="lt-past-simple" className="rules-tense">
          <h2 className="rules-tense-title">2. Būtasis kartinis laikas</h2>

          <p className="rules-tense-desc">Būtasis kartinis laikas gali reikšti:</p>
          <ul className="rules-list">
            <li>vienkartinį praeities veiksmą:
              <span className="rules-example"> Vakar buvau kine.</span>
            </li>
            <li>pasikartojantį praeities veiksmą:
              <span className="rules-example"> Kiekvieną vasarą mes važiavome prie jūros.</span>
            </li>
          </ul>

          <h3 className="rules-sub-title">Asmenavimas</h3>

          <div className="rules-tables-row">
            <div className="rules-table-block">
              <div className="rules-table-label">3&nbsp;a. baigiasi <strong>–o</strong></div>
              <table className="rules-conj-table">
                <tbody>
                  <tr><td className="rules-person">aš</td><td>kalbėjau</td></tr>
                  <tr><td className="rules-person">tu</td><td>kalbėjai</td></tr>
                  <tr><td className="rules-person">jis, ji</td><td>kalbėjo</td></tr>
                  <tr><td className="rules-person">mes</td><td>kalbėjome</td></tr>
                  <tr><td className="rules-person">jūs</td><td>kalbėjote</td></tr>
                  <tr><td className="rules-person">jie, jos</td><td>kalbėjo</td></tr>
                </tbody>
              </table>
            </div>

            <div className="rules-table-block">
              <div className="rules-table-label">3&nbsp;a. baigiasi <strong>–ė</strong></div>
              <table className="rules-conj-table">
                <tbody>
                  <tr><td className="rules-person">aš</td><td>rašiau</td></tr>
                  <tr><td className="rules-person">tu</td><td>rašei</td></tr>
                  <tr><td className="rules-person">jis, ji</td><td>rašė</td></tr>
                  <tr><td className="rules-person">mes</td><td>rašėme</td></tr>
                  <tr><td className="rules-person">jūs</td><td>rašėte</td></tr>
                  <tr><td className="rules-person">jie, jos</td><td>rašė</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Reflexive */}
          <h3 className="rules-sub-title">Sangrąžiniai veiksmažodžiai</h3>

          <div className="rules-tables-row">
            <div className="rules-table-block">
              <div className="rules-table-label">3&nbsp;a. (prieš –si) baigiasi <strong>–o</strong></div>
              <table className="rules-conj-table">
                <tbody>
                  <tr><td className="rules-person">aš</td><td>kalbėjausi</td></tr>
                  <tr><td className="rules-person">tu</td><td>kalbėjaisi</td></tr>
                  <tr><td className="rules-person">jis, ji</td><td>kalbėjosi</td></tr>
                  <tr><td className="rules-person">mes</td><td>kalbėjomės</td></tr>
                  <tr><td className="rules-person">jūs</td><td>kalbėjotės</td></tr>
                  <tr><td className="rules-person">jie, jos</td><td>kalbėjosi</td></tr>
                </tbody>
              </table>
            </div>

            <div className="rules-table-block">
              <div className="rules-table-label">3&nbsp;a. (prieš –si) baigiasi <strong>–ė</strong></div>
              <table className="rules-conj-table">
                <tbody>
                  <tr><td className="rules-person">aš</td><td>rašiausi</td></tr>
                  <tr><td className="rules-person">tu</td><td>rašeisi</td></tr>
                  <tr><td className="rules-person">jis, ji</td><td>rašėsi</td></tr>
                  <tr><td className="rules-person">mes</td><td>rašėmės</td></tr>
                  <tr><td className="rules-person">jūs</td><td>rašėtės</td></tr>
                  <tr><td className="rules-person">jie, jos</td><td>rašėsi</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ---- 1.3 Būtasis dažninis laikas -------------------------------- */}
        <div id="lt-past-freq" className="rules-tense">
          <h2 className="rules-tense-title">3. Būtasis dažninis laikas</h2>

          <p className="rules-tense-desc">
            Būtasis dažninis laikas reiškia įprastinį ir pasikartojantį praeities veiksmą:
          </p>
          <blockquote className="rules-quote">
            Vaikystėje labai mėgdavau žaisti lauke.
          </blockquote>

          <p>
            Šis laikas padaromas iš bendraties su priesaga <strong>–dav–</strong>:
          </p>

          <div className="rules-formula-group">
            <div className="rules-formula">kalbė<span className="rules-stem-cut">\</span>ti + –dav– + –o = <strong>kalbėdavo</strong></div>
            <div className="rules-formula">klaus<span className="rules-stem-cut">\</span>ti + –dav– + –o = <strong>klausdavo</strong></div>
            <div className="rules-formula">rašy<span className="rules-stem-cut">\</span>ti + –dav– + –o = <strong>rašydavo</strong></div>
          </div>

          <h3 className="rules-sub-title">Asmenavimas</h3>
          <p className="rules-pattern-note">
            Visų veiksmažodžių būtojo dažninio laiko asmenų formos padaromos vienodai:
          </p>

          <div className="rules-tables-row">
            <div className="rules-table-block">
              <table className="rules-conj-table">
                <tbody>
                  <tr><td className="rules-person">aš</td><td>rašydavau</td></tr>
                  <tr><td className="rules-person">tu</td><td>rašydavai</td></tr>
                  <tr><td className="rules-person">jis, ji</td><td>rašydavo</td></tr>
                  <tr><td className="rules-person">mes</td><td>rašydavome</td></tr>
                  <tr><td className="rules-person">jūs</td><td>rašydavote</td></tr>
                  <tr><td className="rules-person">jie, jos</td><td>rašydavo</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Reflexive */}
          <h3 className="rules-sub-title">Sangrąžiniai veiksmažodžiai</h3>
          <p className="rules-pattern-note">
            Visų sangrąžinių veiksmažodžių būtojo dažninio laiko asmenų formos padaromos
            taip pat vienodai:
          </p>

          <div className="rules-tables-row">
            <div className="rules-table-block">
              <table className="rules-conj-table">
                <tbody>
                  <tr><td className="rules-person">aš</td><td>mokydavausi</td></tr>
                  <tr><td className="rules-person">tu</td><td>mokydavaisi</td></tr>
                  <tr><td className="rules-person">jis, ji</td><td>mokydavosi</td></tr>
                  <tr><td className="rules-person">mes</td><td>mokydavomės</td></tr>
                  <tr><td className="rules-person">jūs</td><td>mokydavotės</td></tr>
                  <tr><td className="rules-person">jie, jos</td><td>mokydavosi</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ---- 1.4 Būsimasis laikas --------------------------------------- */}
        <div id="lt-future" className="rules-tense">
          <h2 className="rules-tense-title">4. Būsimasis laikas</h2>

          <p className="rules-tense-desc">
            Būsimasis laikas reiškia ateityje vyksiantį veiksmą:
          </p>
          <blockquote className="rules-quote">
            Rytoj eisiu į svečius.
          </blockquote>

          <p>
            Šis laikas padaromas iš bendraties su priesaga <strong>–s</strong>:
          </p>

          <div className="rules-formula-group">
            <div className="rules-formula">kalbė<span className="rules-stem-cut">\</span>ti + –s = <strong>kalbės</strong></div>
            <div className="rules-formula">klaus<span className="rules-stem-cut">\</span>ti + –s = <strong>klaus</strong></div>
            <div className="rules-formula">vež<span className="rules-stem-cut">\</span>ti + –s = <strong>veš</strong></div>
            <div className="rules-formula">neš<span className="rules-stem-cut">\</span>ti + –s = <strong>neš</strong></div>
            <div className="rules-formula">zyz<span className="rules-stem-cut">\</span>ti + –s = <strong>zys</strong></div>
            <div className="rules-formula">rašy<span className="rules-stem-cut">\</span>ti + –s = <strong>rašys</strong></div>
            <div className="rules-formula">ly<span className="rules-stem-cut">\</span>ti + –s = <strong>lis</strong></div>
          </div>

          <div className="rules-note">
            <strong>Atkreipkite dėmesį:</strong> nors veiksmažodžio bendraties kamienas gali
            baigtis raidėmis <strong>–s–</strong>, <strong>–š–</strong>, <strong>–z–</strong>{" "}
            ar <strong>–ž–</strong>, būsimojo laiko formų kamiene bus tik <strong>–s</strong>{" "}
            ar <strong>–š</strong>:
            <div className="rules-formula-group rules-formula-group--compact">
              <div className="rules-formula">klausti → <strong>klaus</strong></div>
              <div className="rules-formula">nešti → <strong>neš</strong></div>
              <div className="rules-formula">zyzti → <strong>zys</strong></div>
              <div className="rules-formula">vežti → <strong>veš</strong></div>
            </div>
          </div>

          <h3 className="rules-sub-title">Asmenavimas</h3>
          <p className="rules-pattern-note">
            Visų veiksmažodžių būsimojo laiko asmenų formos padaromos vienodai:
          </p>

          <div className="rules-tables-row">
            <div className="rules-table-block">
              <table className="rules-conj-table">
                <tbody>
                  <tr><td className="rules-person">aš</td><td>rašysiu</td></tr>
                  <tr><td className="rules-person">tu</td><td>rašysi</td></tr>
                  <tr><td className="rules-person">jis, ji</td><td>rašys</td></tr>
                  <tr><td className="rules-person">mes</td><td>rašysime</td></tr>
                  <tr><td className="rules-person">jūs</td><td>rašysite</td></tr>
                  <tr><td className="rules-person">jie, jos</td><td>rašys</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Reflexive */}
          <h3 className="rules-sub-title">Sangrąžiniai veiksmažodžiai</h3>
          <p className="rules-pattern-note">
            Visų sangrąžinių veiksmažodžių būsimojo laiko asmenų formos padaromos taip pat
            vienodai:
          </p>

          <div className="rules-tables-row">
            <div className="rules-table-block">
              <table className="rules-conj-table">
                <tbody>
                  <tr><td className="rules-person">aš</td><td>mokysiuosi</td></tr>
                  <tr><td className="rules-person">tu</td><td>mokysiesi</td></tr>
                  <tr><td className="rules-person">jis, ji</td><td>mokysis</td></tr>
                  <tr><td className="rules-person">mes</td><td>mokysimės</td></tr>
                  <tr><td className="rules-person">jūs</td><td>mokysitės</td></tr>
                  <tr><td className="rules-person">jie, jos</td><td>mokysis</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 2 — Liepiamoji nuosaka                                     */}
      {/* ------------------------------------------------------------------ */}
      <CollapsibleSection id="lt-imperative" ref={refs.imperative} title="Liepiamoji nuosaka">

        <p>
          Šia nuosaka reiškiama kalbančiojo asmens valia: liepimas, raginimas, įsakymas
          ir pan.:
        </p>
        <blockquote className="rules-quote">
          Kalbėkite lėčiau!
        </blockquote>

        <p>
          1 ir 2 asmens formos padaromos iš bendraties su priesaga <strong>–k</strong>:
        </p>

        <div className="rules-formula-group">
          <div className="rules-formula">kalbė<span className="rules-stem-cut">\</span>ti + –k = <strong>kalbėk</strong></div>
        </div>

        <h3 className="rules-sub-title">Asmenavimas</h3>
        <p className="rules-pattern-note">
          Visų veiksmažodžių liepiamosios nuosakos asmenų formos padaromos vienodai:
        </p>

        <div className="rules-tables-row">
          <div className="rules-table-block">
            <table className="rules-conj-table">
              <tbody>
                <tr><td className="rules-person">aš</td><td className="rules-empty">—</td></tr>
                <tr><td className="rules-person">tu</td><td>kalbėk</td></tr>
                <tr><td className="rules-person">jis, ji</td><td>tegu kalba</td></tr>
                <tr><td className="rules-person">mes</td><td>kalbėkime</td></tr>
                <tr><td className="rules-person">jūs</td><td>kalbėkite</td></tr>
                <tr><td className="rules-person">jie, jos</td><td>tegu kalba</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="rules-note">
          Liepiamosios nuosakos 3&nbsp;asmens forma sutampa su tiesioginės nuosakos esamojo
          laiko 3&nbsp;asmens forma, be to, pridedama dalelytė <strong>tegu</strong>.
        </div>

        {/* Reflexive */}
        <h3 className="rules-sub-title">Sangrąžiniai veiksmažodžiai</h3>
        <p className="rules-pattern-note">
          Visų sangrąžinių veiksmažodžių liepiamosios nuosakos formos padaromos vienodai:
        </p>

        <div className="rules-tables-row">
          <div className="rules-table-block">
            <table className="rules-conj-table">
              <tbody>
                <tr><td className="rules-person">aš</td><td className="rules-empty">—</td></tr>
                <tr><td className="rules-person">tu</td><td>mokykis</td></tr>
                <tr><td className="rules-person">jis, ji</td><td>tegu mokosi</td></tr>
                <tr><td className="rules-person">mes</td><td>mokykimės</td></tr>
                <tr><td className="rules-person">jūs</td><td>mokykitės</td></tr>
                <tr><td className="rules-person">jie, jos</td><td>tegu mokosi</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </CollapsibleSection>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 3 — Tariamoji nuosaka                                      */}
      {/* ------------------------------------------------------------------ */}
      <CollapsibleSection id="lt-conditional" ref={refs.conditional} title="Tariamoji nuosaka">

        <p>
          Ši nuosaka reiškia veiksmus, kurie galėtų įvykti arba kurie yra pageidaujami:
        </p>
        <blockquote className="rules-quote">
          Jis norėtų čia pabūti ilgiau.
        </blockquote>

        <p>
          Formos padaromos iš bendraties su priesaga <strong>–t–</strong>, kuri prieš
          galūnę <strong>–iau</strong> virsta <strong>–č–</strong>.
        </p>

        <h3 className="rules-sub-title">Asmenavimas</h3>

        <div className="rules-tables-row">
          <div className="rules-table-block">
            <table className="rules-conj-table">
              <tbody>
                <tr><td className="rules-person">aš</td><td>kalbėčiau</td></tr>
                <tr><td className="rules-person">tu</td><td>kalbėtum</td></tr>
                <tr><td className="rules-person">jis, ji</td><td>kalbėtų</td></tr>
                <tr><td className="rules-person">mes</td><td>kalbėtume / kalbėtumėme</td></tr>
                <tr><td className="rules-person">jūs</td><td>kalbėtute / kalbėtumėte</td></tr>
                <tr><td className="rules-person">jie, jos</td><td>kalbėtų</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="rules-note">
          Daugiskaitos 1 ir 2 asmens formos gali būti ilgesnės arba trumpesnės.
        </div>

        {/* Reflexive */}
        <h3 className="rules-sub-title">Sangrąžiniai veiksmažodžiai</h3>
        <p className="rules-pattern-note">
          Visų sangrąžinių veiksmažodžių tariamosios nuosakos formos padaromos vienodai:
        </p>

        <div className="rules-tables-row">
          <div className="rules-table-block">
            <table className="rules-conj-table">
              <tbody>
                <tr><td className="rules-person">aš</td><td>mokyčiausi</td></tr>
                <tr><td className="rules-person">tu</td><td>mokytumeisi</td></tr>
                <tr><td className="rules-person">jis, ji</td><td>mokytųsi</td></tr>
                <tr><td className="rules-person">mes</td><td>mokytumės / mokytumėmės</td></tr>
                <tr><td className="rules-person">jūs</td><td>mokytutės / mokytumėtės</td></tr>
                <tr><td className="rules-person">jie, jos</td><td>mokytųsi</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </CollapsibleSection>

    </div>
  );
}
