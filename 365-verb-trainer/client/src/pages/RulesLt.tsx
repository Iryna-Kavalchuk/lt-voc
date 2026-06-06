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
  {
    id: "lt-nonconjugated", label: "Neasmenuojamosios formos", refKey: "nonconjugated",
    sub: [
      { id: "lt-participles-pres-act",    label: "Veikiamosios rūšies esamojo laiko dalyviai" },
      { id: "lt-participles-past-act",    label: "Veikiamosios rūšies būtojo kartinio laiko dalyviai" },
      { id: "lt-participles-pastfreq-act",label: "Veikiamosios rūšies būtojo dažninio laiko dalyviai" },
      { id: "lt-participles-fut-act",     label: "Veikiamosios rūšies būsimojo laiko dalyviai" },
      { id: "lt-participles-pres-pass",   label: "Neveikiamosios rūšies esamojo laiko dalyviai" },
      { id: "lt-participles-past-pass",   label: "Neveikiamosios rūšies būtojo laiko dalyviai" },
      { id: "lt-half-participles",        label: "Pusdalyviai" },
      { id: "lt-gerunds",                 label: "Padalyviai" },
    ],
  },
  {
    id: "lt-compound-tenses", label: "Sudėtiniai laikai", refKey: "compoundTenses",
    sub: [
      { id: "lt-compound-active",         label: "Su veikiamosios rūšies dalyviais" },
      { id: "lt-compound-passive-pres",   label: "Su esamojo laiko neveikiamosios rūšies dalyviu" },
      { id: "lt-compound-passive-past",   label: "Su būtojo laiko neveikiamosios rūšies dalyviu" },
      { id: "lt-compound-conditional",    label: "Sudėtinė tariamoji nuosaka" },
    ],
  },
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
    indicative:    useRef<CollapsibleSectionHandle>(null),
    imperative:    useRef<CollapsibleSectionHandle>(null),
    conditional:   useRef<CollapsibleSectionHandle>(null),
    nonconjugated: useRef<CollapsibleSectionHandle>(null),
    compoundTenses:useRef<CollapsibleSectionHandle>(null),
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

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 4 — Neasmenuojamosios formos                               */}
      {/* ------------------------------------------------------------------ */}
      <CollapsibleSection id="lt-nonconjugated" ref={refs.nonconjugated} title="Neasmenuojamosios veiksmažodžių formos">

        {/* ---- Veikiamosios rūšies esamojo laiko dalyviai -------------------- */}
        <div id="lt-participles-pres-act" className="rules-tense">
          <h2 className="rules-tense-title">Veikiamosios rūšies esamojo laiko dalyviai</h2>
          <p>
            Padaromi iš tiesioginės nuosakos esamojo laiko 3&nbsp;asmens.
            Vyriškosios giminės formos padaromos taip:
          </p>
          <div className="rules-formula-group">
            <div className="rules-formula">kalb<span className="rules-stem-cut">\</span>a + –ąs / –antis = <strong>kalbąs / kalbantis</strong></div>
            <div className="rules-formula">myl<span className="rules-stem-cut">\</span>i + –įs / –intis = <strong>mylįs / mylintis</strong></div>
            <div className="rules-formula">sak<span className="rules-stem-cut">\</span>o + –ąs / –antis = <strong>sakąs / sakantis</strong></div>
          </div>
          <div className="rules-note">
            <strong>Daugiskaita:</strong> –ą / –antys, –į / –intys — pvz., kalbą / kalbantys, mylį / mylintys.<br />
            <strong>Mot. g. vienaskaita:</strong> –anti, –inti — pvz., kalbanti, mylinti.<br />
            <strong>Mot. g. daugiskaita:</strong> –ančios, –inčios — pvz., kalbančios, mylinčios.
          </div>
          <p>Sangrąžinės formos dažniausiai padaromos su priešdėliu <strong>be–</strong>:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">be– + mokosi + –antis = <strong>besimokantis</strong></div>
            <div className="rules-formula">be– + mokosi + –anti = <strong>besimokanti</strong></div>
          </div>
          <p className="rules-pattern-note">
            Šios formos pasako, koks yra žmogus ar kita gyva būtybė, reiškinys, daiktas ir pan., pvz.:
          </p>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Dainuojanti moteris patiko visiems.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Žmonės žiūrėjo į besileidžiančią saulę.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Ant stalo gulinti knyga yra mokytojo.</span></div>
          </div>
        </div>

        {/* ---- Veikiamosios rūšies būtojo kartinio laiko dalyviai ------------ */}
        <div id="lt-participles-past-act" className="rules-tense">
          <h2 className="rules-tense-title">Veikiamosios rūšies būtojo kartinio laiko dalyviai</h2>
          <p>Padaromi iš tiesioginės nuosakos būtojo kartinio laiko 3&nbsp;asmens. Vyriškosios giminės vienaskaitos formos:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">kalbėj<span className="rules-stem-cut">\</span>o + –ęs = <strong>kalbėjęs</strong></div>
            <div className="rules-formula">sak<span className="rules-stem-cut">\</span>ė + –ęs = <strong>sakęs</strong></div>
          </div>
          <div className="rules-note">
            <strong>Daugiskaita:</strong> –ę — pvz., kalbėję, sakę.<br />
            <strong>Mot. g. vienaskaita:</strong> –usi, –iusi — pvz., kalbėjusi, sakiusi.<br />
            <strong>Mot. g. daugiskaita:</strong> –usios, –iusios — pvz., kalbėjusios, sakiusios.
          </div>
          <p>Sangrąžinės formos:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">mok<span className="rules-stem-cut">\</span>ėsi + –ęs = <strong>mokęsis</strong></div>
            <div className="rules-formula">mok<span className="rules-stem-cut">\</span>ėsi + –ius = <strong>mokiusis</strong></div>
          </div>
          <p className="rules-pattern-note">Šios formos pasako:</p>
          <ul className="rules-list">
            <li>koks žmogus ar kita gyva būtybė, reiškinys, daiktas ir pan. yra:</li>
          </ul>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Aš esu ištroškęs.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Mano brolis jau vedęs.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Tėvas yra išvažiavęs į kaimą.</span></div>
          </div>
          <ul className="rules-list">
            <li>ką žmogus ar kita gyva būtybė padarė prieš pagrindinį veiksmą:</li>
          </ul>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Parėjęs namo brolis skaitė knygą.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Nukritęs nuo stalo kamuoliukas pariedėjo po spinta.</span></div>
          </div>
          <ul className="rules-list">
            <li>ką žmogus ar kita gyva būtybė galbūt darė praeityje:</li>
          </ul>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Jis sako perskaitęs filosofijos istoriją.</span></div>
          </div>
        </div>

        {/* ---- Veikiamosios rūšies būtojo dažninio laiko dalyviai ------------ */}
        <div id="lt-participles-pastfreq-act" className="rules-tense">
          <h2 className="rules-tense-title">Veikiamosios rūšies būtojo dažninio laiko dalyviai</h2>
          <p>Padaromi iš bendraties. Vienaskaitos formos:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">kalbė<span className="rules-stem-cut">\</span>ti + –davęs = <strong>kalbėdavęs</strong></div>
            <div className="rules-formula">kalbė<span className="rules-stem-cut">\</span>ti + –davusi = <strong>kalbėdavusi</strong></div>
          </div>
          <div className="rules-note">
            <strong>Daugiskaita vyr. g.:</strong> –ę — pvz., kalbėdavę.<br />
            <strong>Daugiskaita mot. g.:</strong> –usios — pvz., kalbėdavusios.
          </div>
          <p>Sangrąžinės formos:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">mokydav<span className="rules-stem-cut">\</span>osi + –ęs = <strong>mokydavęsis</strong></div>
            <div className="rules-formula">mokydav<span className="rules-stem-cut">\</span>osi + –usi = <strong>mokydavusis</strong></div>
          </div>
          <p className="rules-pattern-note">Šios formos pasako, ką galbūt žmogus darė praeityje daug kartų:</p>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Jis sako mėgdavęs kiekvieną vakarą eiti pasivaikščioti.</span></div>
          </div>
        </div>

        {/* ---- Veikiamosios rūšies būsimojo laiko dalyviai ------------------- */}
        <div id="lt-participles-fut-act" className="rules-tense">
          <h2 className="rules-tense-title">Veikiamosios rūšies būsimojo laiko dalyviai</h2>
          <p>Padaromi iš bendraties. Vienaskaitos formos:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">kalbė<span className="rules-stem-cut">\</span>ti + –siąs / –siantis = <strong>kalbėsiąs / kalbėsiantis</strong></div>
            <div className="rules-formula">kalbė<span className="rules-stem-cut">\</span>ti + –sianti = <strong>kalbėsianti</strong></div>
          </div>
          <div className="rules-note">
            <strong>Daugiskaita vyr. g.:</strong> –sią / –siantys — pvz., kalbėsią / kalbėsiantys.<br />
            <strong>Daugiskaita mot. g.:</strong> –siančios — pvz., kalbėsiančios.
          </div>
          <p className="rules-pattern-note">Šios formos pasako, ką galbūt darys žmogus ateityje:</p>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Jis sako važiuosiąs į Rusiją.</span></div>
          </div>
        </div>

        {/* ---- Neveikiamosios rūšies esamojo laiko dalyviai ------------------ */}
        <div id="lt-participles-pres-pass" className="rules-tense">
          <h2 className="rules-tense-title">Neveikiamosios rūšies esamojo laiko dalyviai</h2>
          <p>Padaromi iš tiesioginės nuosakos 3&nbsp;asmens formų. Vyriškosios giminės formos:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">stat<span className="rules-stem-cut">\</span>o + –mas = <strong>statomas</strong></div>
          </div>
          <div className="rules-note">
            <strong>Mot. g.:</strong> –ma — pvz., statoma.<br />
            <strong>Daugiskaita vyr. g.:</strong> –mi — pvz., statomi.<br />
            <strong>Daugiskaita mot. g.:</strong> –mos — pvz., statomos.
          </div>
          <p>Taip pat yra daromos negimininės formos:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">stato + –ma = <strong>statoma</strong></div>
          </div>
          <div className="rules-note">
            Negimininė forma sutampa su moteriškosios giminės vardininko linksniu, bet kirčiuojama
            kaip vyriškosios giminės forma ir nelinksniuojama.
          </div>
          <p className="rules-pattern-note">Šios formos pasako, kas su daiktu, žmogumi ir pan. vyksta dabar:</p>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Šis namas jau statomas.</span></div>
          </div>
        </div>

        {/* ---- Neveikiamosios rūšies būtojo laiko dalyviai ------------------- */}
        <div id="lt-participles-past-pass" className="rules-tense">
          <h2 className="rules-tense-title">Neveikiamosios rūšies būtojo laiko dalyviai</h2>
          <p>Padaromi iš bendraties. Vyriškosios giminės formos:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">staty<span className="rules-stem-cut">\</span>ti + –tas = <strong>statytas</strong></div>
          </div>
          <div className="rules-note">
            <strong>Mot. g.:</strong> –ta — pvz., statyta.<br />
            <strong>Daugiskaita vyr. g.:</strong> –ti — pvz., statyti.<br />
            <strong>Daugiskaita mot. g.:</strong> –tos — pvz., statytos.
          </div>
          <p>Sangrąžinės formos:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">staty<span className="rules-stem-cut">\</span>tis + –tas + –is = <strong>statytasis</strong></div>
            <div className="rules-formula">staty<span className="rules-stem-cut">\</span>tis + –ta + –si = <strong>statytasi</strong></div>
          </div>
          <p>Negimininės formos:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">rašy<span className="rules-stem-cut">\</span>ti + –ta = <strong>rašyta</strong></div>
          </div>
          <div className="rules-note">
            Negimininė forma sutampa su moteriškosios giminės vardininko linksniu, bet nelinksniuojama
            ir kirčiuojama kaip vyriškosios giminės forma.
          </div>
          <p className="rules-pattern-note">Šios formos pasako, kas su daiktu, žmogumi ir pan. buvo padaryta seniau:</p>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Vilniaus universitetas įkurtas 1579 metais.</span></div>
          </div>
          <div className="rules-note">Dalyviai linksniuojami kaip būdvardžiai.</div>
        </div>

        {/* ---- Pusdalyviai --------------------------------------------------- */}
        <div id="lt-half-participles" className="rules-tense">
          <h2 className="rules-tense-title">Pusdalyviai</h2>
          <p>Padaromi iš bendraties. Vyriškosios giminės pusdalyviai:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">ei<span className="rules-stem-cut">\</span>ti + –damas = <strong>eidamas</strong></div>
            <div className="rules-formula">rašy<span className="rules-stem-cut">\</span>ti + –damas = <strong>rašydamas</strong></div>
          </div>
          <div className="rules-note">
            <strong>Mot. g.:</strong> –dama — pvz., eidama, rašydama.<br />
            <strong>Daugiskaita vyr. g.:</strong> –dami — pvz., eidami, rašydami.<br />
            <strong>Daugiskaita mot. g.:</strong> –damos — pvz., eidamos, rašydamos.
          </div>
          <p>Sangrąžinės formos:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">praus<span className="rules-stem-cut">\</span>tis + –damas = <strong>prausdamasis</strong></div>
            <div className="rules-formula">praus<span className="rules-stem-cut">\</span>tis + –dama = <strong>prausdamasi</strong></div>
          </div>
          <div className="rules-note">
            <strong>Daugiskaita vyr. g.:</strong> –damiesi — pvz., prausdamiesi.<br />
            <strong>Daugiskaita mot. g.:</strong> –damosi — pvz., prausdamosi.
          </div>
          <p className="rules-pattern-note">
            Pusdalyviais pasakomas to paties veikėjo kitas, ne toks svarbus veiksmas,
            atliekamas tuo pačiu metu kaip ir pagrindinis veiksmas:
          </p>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Brolis, eidamas iš darbo namo, sutiko savo seną pažįstamą.</span></div>
          </div>
        </div>

        {/* ---- Padalyviai ---------------------------------------------------- */}
        <div id="lt-gerunds" className="rules-tense">
          <h2 className="rules-tense-title">Padalyviai</h2>

          <h3 className="rules-sub-title">Esamojo laiko padalyviai</h3>
          <p>Padaromi iš tiesioginės nuosakos esamojo laiko 3&nbsp;asmens:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">kalb<span className="rules-stem-cut">\</span>a + –ant = <strong>kalbant</strong></div>
            <div className="rules-formula">verč<span className="rules-stem-cut">\</span>ia + –iant = <strong>verčiant</strong></div>
            <div className="rules-formula">sak<span className="rules-stem-cut">\</span>o + –ant = <strong>sakant</strong></div>
            <div className="rules-formula">myl<span className="rules-stem-cut">\</span>i + –int = <strong>mylint</strong></div>
          </div>
          <p>Sangrąžinės formos:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">stat<span className="rules-stem-cut">\</span>osi + –ant = <strong>statantis</strong></div>
            <div className="rules-formula">tik<span className="rules-stem-cut">\</span>isi + –int = <strong>tikintis</strong></div>
          </div>
          <p className="rules-pattern-note">
            Esamojo laiko padalyviais reiškiamas kito veikėjo tuo pačiu metu atliekamas veiksmas.
            Su padalyviais veikėjas pasakomas naudininko linksniu:
          </p>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Tėvams žiūrint televizorių, vaikai žaidė savo kambaryje.</span></div>
          </div>

          <h3 className="rules-sub-title">Būtojo laiko padalyviai</h3>
          <p>Padaromi iš tiesioginės nuosakos būtojo kartinio laiko 3&nbsp;asmens:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">kalbėj<span className="rules-stem-cut">\</span>o + –us = <strong>kalbėjus</strong></div>
            <div className="rules-formula">vert<span className="rules-stem-cut">\</span>ė + –us = <strong>vertus</strong></div>
            <div className="rules-formula">raš<span className="rules-stem-cut">\</span>ė + –ius = <strong>rašius</strong></div>
          </div>
          <p>Sangrąžinės formos:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">stat<span className="rules-stem-cut">\</span>ėsi + –ius = <strong>stačiusis</strong></div>
            <div className="rules-formula">džiaug<span className="rules-stem-cut">\</span>ėsi + –us = <strong>džiaugusis</strong></div>
          </div>
          <p className="rules-pattern-note">
            Šios formos reiškia kito veikėjo ankstesnį veiksmą.
            Su padalyviais veikėjas pasakomas naudininko linksniu:
          </p>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Tėvui parėjus namo, visa šeima sėdo valgyti vakarienės.</span></div>
          </div>
        </div>

      </CollapsibleSection>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 5 — Sudėtiniai laikai                                       */}
      {/* ------------------------------------------------------------------ */}
      <CollapsibleSection id="lt-compound-tenses" ref={refs.compoundTenses} title="Sudėtiniai laikai">

        {/* ---- Su veikiamosios rūšies dalyviais ------------------------------ */}
        <div id="lt-compound-active" className="rules-tense">
          <h2 className="rules-tense-title">Sudėtiniai laikai su veikiamosios rūšies dalyviais</h2>

          <h3 className="rules-sub-title">Sudėtiniai atliktiniai laikai</h3>
          <p>
            Šie laikai reiškia iš ankstesnio veiksmo kilusią rezultatinę būseną, trunkančią
            tam tikru momentu:
          </p>
          <div className="rules-note">
            <strong>Esamasis:</strong> <em>yra buvęs, yra buvusi</em><br />
            <strong>Būtasis kartinis:</strong> <em>buvo skaitęs, buvo skaičiusi</em><br />
            <strong>Būtasis dažninis:</strong> <em>būdavo pagalvojęs, būdavo pagalvojusi</em><br />
            <strong>Būsimasis:</strong> <em>bus pasiruošęs, bus pasiruošusi</em>
          </div>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Ar tu esi buvęs Nidoje?</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Jis jau buvo buvęs parodoje, bet nuėjo dar kartą.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Kai nuvažiuodavau pas močiutę, ji visada būdavo iškepusi pyragą.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Kai tu grįši namo, aš jau būsiu išviręs vakarienę.</span></div>
          </div>

          <h3 className="rules-sub-title">Sudėtinis pradėtinis laikas</h3>
          <p>
            Šis laikas reiškia veiksmą, prasidėjusį anksčiau ir dar tebetrunkantį prasidedant
            kitam veiksmui, taip pat pradėtą ar sumanytą, bet neįvykdytą praeities veiksmą.
            Sudaromas iš pagalbinio veiksmažodžio <strong>būti</strong> būtojo kartinio laiko
            formos ir esamojo laiko veikiamosios rūšies dalyvio:
          </p>
          <div className="rules-note">
            <strong>Vyr. g.:</strong> <em>buvau beeinąs / beeinantis, buvome beeiną / beeinantys</em><br />
            <strong>Mot. g.:</strong> <em>buvau beeinanti, buvome beeinančios</em>
          </div>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Jau buvau besiunčiantis tau žinutę, bet tu man parašei.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Jau buvau beskambinanti tau, bet tu man paskambinai.</span></div>
          </div>
        </div>

        {/* ---- Su esamojo laiko neveikiamosios rūšies dalyviu ---------------- */}
        <div id="lt-compound-passive-pres" className="rules-tense">
          <h2 className="rules-tense-title">Sudėtiniai laikai su esamojo laiko neveikiamosios rūšies dalyviu</h2>
          <p>
            Sudaromi iš pagalbinio veiksmažodžio <strong>būti</strong> reikiamos laiko formos
            ir esamojo laiko neveikiamosios rūšies dalyvio:
          </p>
          <div className="rules-note">
            <strong>Esamasis:</strong> <em>esu mylimas / mylima</em><br />
            <strong>Būtasis kartinis:</strong> <em>buvo gerbiamas / gerbiama</em><br />
            <strong>Būtasis dažninis:</strong> <em>būdavau laukiamas / laukiama</em><br />
            <strong>Būsimasis:</strong> <em>būsi laukiamas / laukiama</em>
          </div>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Tu esi mokinių mėgstama mokytoja.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Jis buvo gerbiamas bendradarbių.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Mes abi būdavome labai laukiamos tėvų.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Čia bus statomas namas.</span></div>
          </div>
        </div>

        {/* ---- Su būtojo laiko neveikiamosios rūšies dalyviu ----------------- */}
        <div id="lt-compound-passive-past" className="rules-tense">
          <h2 className="rules-tense-title">Sudėtiniai laikai su būtojo laiko neveikiamosios rūšies dalyviu</h2>
          <p>
            Sudaromi iš pagalbinio veiksmažodžio <strong>būti</strong> reikiamos laiko formos
            ir būtojo laiko neveikiamosios rūšies dalyvio:
          </p>
          <div className="rules-note">
            <strong>Esamasis:</strong> <em>esu mylėtas / mylėta</em><br />
            <strong>Būtasis kartinis:</strong> <em>buvo pakviestas / pakviesta</em><br />
            <strong>Būtasis dažninis:</strong> <em>būdavai įvertintas / įvertinta</em><br />
            <strong>Būsimasis:</strong> <em>bus paklaustas / paklausta</em>
          </div>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Vaikai yra išmokyti mandagiai elgtis.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Vaikai buvo išmokyti gražiai elgtis.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Ant stalelio visada būdavo padėtas naujausias laikraštis.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Vaikai bus išmokyti mandagiai elgtis.</span></div>
          </div>
        </div>

        {/* ---- Sudėtinė tariamoji nuosaka ------------------------------------ */}
        <div id="lt-compound-conditional" className="rules-tense">
          <h2 className="rules-tense-title">Sudėtinė tariamoji nuosaka</h2>
          <p>
            Formos padaromos iš veiksmažodžio <strong>būti</strong> tariamosios nuosakos formų
            ir veikiamosios rūšies būtojo laiko dalyvių. Šios formos vartojamos tada, kai reikia
            pasakyti nerealią sąlygą:
          </p>
          <div className="rules-note">
            <strong>Vyr. g.:</strong> <em>būčiau žinojęs, būtume žinoję</em><br />
            <strong>Mot. g.:</strong> <em>būtum žinojusi, būtumėte žinojusios</em>
          </div>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Jei būtų buvęs geras oras, būtume važiavę į ekskursiją.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Jei būčiau buvusi jaunesnė, būčiau šokusi visą vakarą.</span></div>
          </div>
        </div>

      </CollapsibleSection>

    </div>
  );
}
