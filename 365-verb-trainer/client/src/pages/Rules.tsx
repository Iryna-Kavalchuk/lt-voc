// Rules page — grammar rules from "365 Lithuanian Verbs" book
// Dispatches to the Lithuanian version when lang === "lt",
// otherwise shows the Russian version (the book's primary target language).

import { useContext, useRef } from "react";
import { LangContext } from "../context/LangContext";
import RulesLt from "./RulesLt";
import CollapsibleSection, { type CollapsibleSectionHandle } from "../components/CollapsibleSection";

export default function Rules() {
  const { lang } = useContext(LangContext);
  if (lang === "lt") return <RulesLt />;

  // Russian / English — content is in Russian (source language of the book)
  return <RulesContent />;
}

const RU_SECTIONS = [
  {
    id: "ru-indicative", label: "Изъявительное наклонение", refKey: "indicative",
    sub: [
      { id: "ru-present",    label: "Настоящее время" },
      { id: "ru-past-simple", label: "Прошедшее однократное" },
      { id: "ru-past-freq",  label: "Прошедшее многократное" },
      { id: "ru-future",     label: "Будущее время" },
    ],
  },
  { id: "ru-imperative",    label: "Повелительное наклонение",    refKey: "imperative",    sub: [] },
  { id: "ru-conditional",   label: "Условное наклонение",         refKey: "conditional",   sub: [] },
  {
    id: "ru-nonconjugated", label: "Неспрягаемые формы глагола",  refKey: "nonconjugated",
    sub: [
      { id: "ru-participles",          label: "Причастия" },
      { id: "ru-compound-tenses",      label: "Сложные формы времени" },
      { id: "ru-compound-conditional", label: "Сложное условное наклонение" },
      { id: "ru-half-participles",     label: "Полупричастия" },
      { id: "ru-gerunds",              label: "Деепричастия" },
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

function RulesContent() {
  const refs = {
    indicative:    useRef<CollapsibleSectionHandle>(null),
    imperative:    useRef<CollapsibleSectionHandle>(null),
    conditional:   useRef<CollapsibleSectionHandle>(null),
    nonconjugated: useRef<CollapsibleSectionHandle>(null),
  };

  return (
    <div className="rules-page">

      {/* Table of contents */}
      <nav className="rules-toc">
        <div className="rules-toc-title">Содержание</div>
        <ol className="rules-toc-list">
          {RU_SECTIONS.map((s) => {
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
      {/* SECTION 1 — Изъявительное наклонение                               */}
      {/* ------------------------------------------------------------------ */}
      <CollapsibleSection id="ru-indicative" ref={refs.indicative} title="Изъявительное наклонение">

        <div className="rules-intro-card">
          <p>
            Основными формами глагола в литовском языке являются:
          </p>
          <ul>
            <li>неопределённая форма;</li>
            <li>3&nbsp;лицо настоящего времени;</li>
            <li>3&nbsp;лицо прошедшего однократного времени.</li>
          </ul>
          <p>
            Все остальные формы производны от основных. Поэтому в процессе изучения
            следует обратить особое внимание на все три основные формы глагола.
          </p>
          <p>
            Глаголы в изъявительном наклонении изменяются по четырём простым временам
            (в отличие от русского языка, где мы знакомы с тремя простыми временами).
          </p>
        </div>

        {/* ---- 1.1 Настоящее время ---------------------------------------- */}
        <div id="ru-present" className="rules-tense">
          <h2 className="rules-tense-title">1. Настоящее время</h2>

          <p className="rules-tense-desc">Настоящее время обозначает:</p>
          <ul className="rules-list">
            <li>действие, которое происходит в момент речи:
              <span className="rules-example"> Aš rašau laišką. <em>(Я пишу письмо.)</em></span>
            </li>
            <li>действие постоянное, непрерывное:
              <span className="rules-example"> Ši vaistinė dirba naktimis. <em>(Эта аптека работает по ночам.)</em></span>
            </li>
            <li>действие, которое произойдёт в скором времени:
              <span className="rules-example"> Rytoj važiuoju prie ežero. <em>(Завтра еду к озеру.)</em></span>
            </li>
          </ul>

          <h3 className="rules-sub-title">Спряжение</h3>

          <p className="rules-pattern-note">
            Глаголы спрягаются по-разному в зависимости от окончания 3&nbsp;лица:
          </p>

          <div className="rules-tables-row">
            <div className="rules-table-block">
              <div className="rules-table-label">3&nbsp;л. оканч. на <strong>–а</strong> или <strong>–ia</strong></div>
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
              <div className="rules-table-label">3&nbsp;л. оканч. на <strong>–i</strong></div>
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
              <div className="rules-table-label">3&nbsp;л. оканч. на <strong>–o</strong></div>
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
          <h3 className="rules-sub-title">Возвратные глаголы</h3>
          <p className="rules-pattern-note">
            Формы настоящего времени возвратных глаголов образуются в зависимости от
            окончания 3&nbsp;лица перед возвратной частицей <strong>–si</strong>:
          </p>

          <div className="rules-tables-row">
            <div className="rules-table-block">
              <div className="rules-table-label">3&nbsp;л. (перед –si) оканч. на <strong>–а</strong> или <strong>–ia</strong></div>
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
              <div className="rules-table-label">3&nbsp;л. (перед –si) оканч. на <strong>–i</strong></div>
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
              <div className="rules-table-label">3&nbsp;л. (перед –si) оканч. на <strong>–o</strong></div>
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

        {/* ---- 1.2 Прошедшее однократное ---------------------------------- */}
        <div id="ru-past-simple" className="rules-tense">
          <h2 className="rules-tense-title">2. Прошедшее однократное время</h2>

          <p className="rules-tense-desc">Прошедшее однократное время обозначает:</p>
          <ul className="rules-list">
            <li>однократное действие, совершившееся в прошлом:
              <span className="rules-example"> Vakar buvau kine. <em>(Вчера я был / была в кино.)</em></span>
            </li>
            <li>повторяющееся в прошлом действие:
              <span className="rules-example"> Kiekvieną vasarą mes važiavome prie jūros. <em>(Каждое лето мы ездили к морю.)</em></span>
            </li>
          </ul>

          <h3 className="rules-sub-title">Спряжение</h3>

          <div className="rules-tables-row">
            <div className="rules-table-block">
              <div className="rules-table-label">3&nbsp;л. оканч. на <strong>–o</strong></div>
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
              <div className="rules-table-label">3&nbsp;л. оканч. на <strong>–ė</strong></div>
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
          <h3 className="rules-sub-title">Возвратные глаголы</h3>

          <div className="rules-tables-row">
            <div className="rules-table-block">
              <div className="rules-table-label">3&nbsp;л. (перед –si) оканч. на <strong>–o</strong></div>
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
              <div className="rules-table-label">3&nbsp;л. (перед –si) оканч. на <strong>–ė</strong></div>
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

        {/* ---- 1.3 Прошедшее многократное --------------------------------- */}
        <div id="ru-past-freq" className="rules-tense">
          <h2 className="rules-tense-title">3. Прошедшее многократное время</h2>

          <p className="rules-tense-desc">
            Прошедшее многократное время обозначает обычное и повторяющееся в прошлом
            действие:
          </p>
          <blockquote className="rules-quote">
            Vaikystėje labai mėgdavau žaisti lauke.
            <br />
            <em>(В детстве я очень любил / любила играть на улице.)</em>
          </blockquote>

          <p>
            Это время образуется от неопределённой формы глагола при помощи суффикса{" "}
            <strong>–dav–</strong>:
          </p>

          <div className="rules-formula-group">
            <div className="rules-formula">kalbė<span className="rules-stem-cut">\</span>ti + –dav– + –o = <strong>kalbėdavo</strong></div>
            <div className="rules-formula">klaus<span className="rules-stem-cut">\</span>ti + –dav– + –o = <strong>klausdavo</strong></div>
            <div className="rules-formula">rašy<span className="rules-stem-cut">\</span>ti + –dav– + –o = <strong>rašydavo</strong></div>
          </div>

          <h3 className="rules-sub-title">Спряжение</h3>
          <p className="rules-pattern-note">
            Личные формы всех глаголов прошедшего многократного времени образуются одинаково:
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
          <h3 className="rules-sub-title">Возвратные глаголы</h3>
          <p className="rules-pattern-note">
            Личные формы всех возвратных глаголов прошедшего многократного времени тоже
            образуются одинаково:
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

        {/* ---- 1.4 Будущее время ------------------------------------------ */}
        <div id="ru-future" className="rules-tense">
          <h2 className="rules-tense-title">4. Будущее время</h2>

          <p className="rules-tense-desc">
            Будущее время обозначает действие, которое произойдёт в будущем:
          </p>
          <blockquote className="rules-quote">
            Rytoj eisiu į svečius. <em>(Завтра пойду в гости.)</em>
          </blockquote>

          <p>
            Это время образуется от неопределённой формы глагола при помощи суффикса{" "}
            <strong>–s</strong>:
          </p>

          <div className="rules-formula-group">
            <div className="rules-formula">kalbė<span className="rules-stem-cut">\</span>ti + –s = <strong>kalbės</strong></div>
            <div className="rules-formula">klaus<span className="rules-stem-cut">\</span>ti + –s = <strong>klaus</strong></div>
            <div className="rules-formula">ves<span className="rules-stem-cut">\</span>ti + –s = <strong>ves</strong></div>
            <div className="rules-formula">neš<span className="rules-stem-cut">\</span>ti + –s = <strong>neš</strong></div>
            <div className="rules-formula">zyz<span className="rules-stem-cut">\</span>ti + –s = <strong>zys</strong></div>
            <div className="rules-formula">rašy<span className="rules-stem-cut">\</span>ti + –s = <strong>rašys</strong></div>
            <div className="rules-formula">ly<span className="rules-stem-cut">\</span>ti + –s = <strong>lis</strong></div>
          </div>

          <div className="rules-note">
            <strong>Обратите внимание:</strong> если основа неопределённой формы перед{" "}
            <strong>–ti</strong> оканчивается на <strong>–s–</strong>, <strong>–š–</strong>,{" "}
            <strong>–z–</strong> или <strong>–ž–</strong>, в основе будущего времени остаётся
            только одна из них:
            <div className="rules-formula-group rules-formula-group--compact">
              <div className="rules-formula">klausti → <strong>klaus</strong></div>
              <div className="rules-formula">nešti → <strong>neš</strong></div>
              <div className="rules-formula">zyzti → <strong>zys</strong></div>
              <div className="rules-formula">vežti → <strong>veš</strong></div>
            </div>
          </div>

          <h3 className="rules-sub-title">Спряжение</h3>
          <p className="rules-pattern-note">
            Личные формы всех глаголов будущего времени образуются одинаково:
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
          <h3 className="rules-sub-title">Возвратные глаголы</h3>
          <p className="rules-pattern-note">
            Личные формы всех возвратных глаголов будущего времени также образуются одинаково:
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
      {/* SECTION 2 — Повелительное наклонение                               */}
      {/* ------------------------------------------------------------------ */}
      <CollapsibleSection id="ru-imperative" ref={refs.imperative} title="Повелительное наклонение">

        <p>
          Повелительное наклонение выражает волю говорящего в виде побуждения к действию,
          требования, приказания и т.&nbsp;п.:
        </p>
        <blockquote className="rules-quote">
          Kalbėkite lėčiau! <em>(Говорите помедленнее!)</em>
        </blockquote>

        <p>
          Формы первого и второго лица повелительного наклонения образуются от неопределённой
          формы глагола при помощи суффикса <strong>–k</strong>:
        </p>

        <div className="rules-formula-group">
          <div className="rules-formula">kalbė<span className="rules-stem-cut">\</span>ti + –k = <strong>kalbėk</strong></div>
        </div>

        <h3 className="rules-sub-title">Спряжение</h3>
        <p className="rules-pattern-note">
          Личные формы всех глаголов в повелительном наклонении образуются одинаково:
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
          Форма 3-го лица повелительного наклонения совпадает с формой 3-го лица настоящего
          времени изъявительного наклонения, но к ней прибавляется частица{" "}
          <strong>tegu</strong> или <strong>te</strong>.
        </div>

        {/* Reflexive */}
        <h3 className="rules-sub-title">Возвратные глаголы</h3>
        <p className="rules-pattern-note">
          Формы всех возвратных глаголов в повелительном наклонении образуются одинаково:
        </p>

        <div className="rules-tables-row">
          <div className="rules-table-block">
            <table className="rules-conj-table">
              <tbody>
                <tr><td className="rules-person">aš</td><td className="rules-empty">—</td></tr>
                <tr><td className="rules-person">tu</td><td>mokykis</td></tr>
                <tr><td className="rules-person">jis, ji</td><td>tegu mokosi, tesimoko</td></tr>
                <tr><td className="rules-person">mes</td><td>mokykimės</td></tr>
                <tr><td className="rules-person">jūs</td><td>mokykitės</td></tr>
                <tr><td className="rules-person">jie, jos</td><td>tegu mokosi, tesimoko</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </CollapsibleSection>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 3 — Условное наклонение                                    */}
      {/* ------------------------------------------------------------------ */}
      <CollapsibleSection id="ru-conditional" ref={refs.conditional} title="Условное наклонение">

        <p>
          Условное наклонение обозначает действия, которые возможны или желаемы:
        </p>
        <blockquote className="rules-quote">
          Jis norėtų čia pabūti ilgiau. <em>(Он хотел бы побыть здесь подольше.)</em>
        </blockquote>

        <p>
          Формы этого наклонения образуются от неопределённой формы глагола при помощи
          суффикса <strong>–t–</strong>, который перед окончанием <strong>–iau</strong>{" "}
          превращается в <strong>–č–</strong>.
        </p>

        <h3 className="rules-sub-title">Спряжение</h3>

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
          Формы 1-го и 2-го лица множественного числа могут быть полными или краткими.
        </div>

        {/* Reflexive */}
        <h3 className="rules-sub-title">Возвратные глаголы</h3>
        <p className="rules-pattern-note">
          Формы условного наклонения от всех возвратных глаголов образуются одинаково:
        </p>

        <div className="rules-tables-row">
          <div className="rules-table-block">
            <table className="rules-conj-table">
              <tbody>
                <tr><td className="rules-person">aš</td><td>mokyčiausi</td></tr>
                <tr><td className="rules-person">tu</td><td>mokytumeisi</td></tr>
                <tr><td className="rules-person">jis, ji</td><td>mokytųsi</td></tr>
                <tr><td className="rules-person">mes</td><td>mokytumėmės</td></tr>
                <tr><td className="rules-person">jūs</td><td>mokytumėtės</td></tr>
                <tr><td className="rules-person">jie, jos</td><td>mokytųsi</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </CollapsibleSection>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 4 — Неспрягаемые формы глагола                             */}
      {/* ------------------------------------------------------------------ */}
      <CollapsibleSection id="ru-nonconjugated" ref={refs.nonconjugated} title="Неспрягаемые формы глагола">

        {/* ---- Причастия -------------------------------------------------- */}
        <div id="ru-participles" className="rules-tense">
          <h2 className="rules-tense-title">Причастия</h2>

          {/* Действительные — настоящее время */}
          <h3 className="rules-sub-title">Действительные причастия настоящего времени</h3>
          <p>
            Образуются от 3&nbsp;лица настоящего времени изъявительного наклонения.
            Формы мужского рода:
          </p>
          <div className="rules-formula-group">
            <div className="rules-formula">kalb<span className="rules-stem-cut">\</span>a + –ąs / –antis = <strong>kalbąs / kalbantis</strong></div>
            <div className="rules-formula">myl<span className="rules-stem-cut">\</span>i + –įs / –intis = <strong>mylįs / mylintis</strong></div>
            <div className="rules-formula">sak<span className="rules-stem-cut">\</span>o + –ąs / –antis = <strong>sakąs / sakantis</strong></div>
          </div>
          <div className="rules-note">
            <strong>Мн. ч.:</strong> –ą / –antys, –į / –intys — например: <em>kalbą / kalbantys, mylį / mylintys</em>.<br />
            <strong>Ж. р. ед. ч.:</strong> –anti, –inti — например: <em>kalbanti, mylinti</em>.<br />
            <strong>Ж. р. мн. ч.:</strong> –ančios, –inčios — например: <em>kalbančios, mylinčios</em>.
          </div>
          <p>Возвратные формы образуются при помощи приставки <strong>be–</strong>:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">be– + mokosi + –antis = <strong>besimokantis</strong></div>
            <div className="rules-formula">be– + mokosi + –anti = <strong>besimokanti</strong></div>
          </div>
          <p className="rules-pattern-note">Эти формы указывают на то, каков человек, предмет, явление и т.&nbsp;п.:</p>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Dainuojanti moteris patiko visiems.</span><span className="rules-ex-ru">Поющая женщина понравилась всем.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Žmonės žiūrėjo į besileidžiančią saulę.</span><span className="rules-ex-ru">Люди смотрели на закат солнца.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Ant stalo gulinti knyga yra mokytojo.</span><span className="rules-ex-ru">Лежащая на столе книга принадлежит учителю.</span></div>
          </div>

          {/* Действительные — прошедшее однократное */}
          <h3 className="rules-sub-title">Действительные причастия прошедшего однократного времени</h3>
          <p>Образуются от 3&nbsp;лица прошедшего времени:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">kalbėj<span className="rules-stem-cut">\</span>o + –ęs = <strong>kalbėjęs</strong></div>
            <div className="rules-formula">sak<span className="rules-stem-cut">\</span>ė + –ęs = <strong>sakęs</strong></div>
          </div>
          <div className="rules-note">
            <strong>Мн. ч.:</strong> –ę — например: <em>kalbėję, sakę</em>.<br />
            <strong>Ж. р. ед. ч.:</strong> –usi, –iusi — например: <em>kalbėjusi, sakiusi</em>.<br />
            <strong>Ж. р. мн. ч.:</strong> –usios, –iusios — например: <em>kalbėjusios, sakiusios</em>.
          </div>
          <p>Возвратные формы:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">mok<span className="rules-stem-cut">\</span>ėsi + –ęs = <strong>mokęsis</strong></div>
            <div className="rules-formula">mok<span className="rules-stem-cut">\</span>ėsi + –ius = <strong>mokiusis</strong></div>
          </div>
          <p className="rules-pattern-note">Формы выражают:</p>
          <ul className="rules-list">
            <li>каков человек, предмет, явление:</li>
          </ul>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Aš esu išalkęs.</span><span className="rules-ex-ru">Я голоден.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Mano brolis jau vedęs.</span><span className="rules-ex-ru">Мой брат уже женат.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Tėvas yra išvažiavęs į kaimą.</span><span className="rules-ex-ru">Отец в отъезде. Он в деревне.</span></div>
          </div>
          <ul className="rules-list">
            <li>дополнительное действие:</li>
          </ul>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Parėjęs namo brolis skaitė knygą.</span><span className="rules-ex-ru">Придя домой, брат читал книгу.</span></div>
          </div>
          <ul className="rules-list">
            <li>действие, которое, возможно, выполнялось в прошлом:</li>
          </ul>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Jis sako perskaitęs filosofijos istoriją.</span><span className="rules-ex-ru">Он говорит, что прочитал историю философии.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Jeigu būčiau žinojęs, kad lis, būčiau pasiėmęs skėtį.</span><span className="rules-ex-ru">Если бы я знал, что будет дождь, то взял бы зонтик.</span></div>
          </div>

          {/* Действительные — прошедшее многократное */}
          <h3 className="rules-sub-title">Действительные причастия прошедшего многократного времени</h3>
          <p>Образуются от неопределённой формы глагола:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">kalbė<span className="rules-stem-cut">\</span>ti + –davęs = <strong>kalbėdavęs</strong></div>
            <div className="rules-formula">kalbė<span className="rules-stem-cut">\</span>ti + –davusi = <strong>kalbėdavusi</strong></div>
          </div>
          <div className="rules-note">
            <strong>Мн. ч. м. р.:</strong> –ę — например: <em>kalbėdavę</em>.<br />
            <strong>Мн. ч. ж. р.:</strong> –usios — например: <em>kalbėdavusios</em>.
          </div>
          <p>Возвратные формы:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">mokydav<span className="rules-stem-cut">\</span>osi + –ęs = <strong>mokydavęsis</strong></div>
            <div className="rules-formula">mokydav<span className="rules-stem-cut">\</span>osi + –usi = <strong>mokydavusis</strong></div>
          </div>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Jis sako mėgdavęs kiekvieną vakarą eiti pasivaikščioti.</span><span className="rules-ex-ru">Он говорит, что ему нравилось выходить на прогулку каждый вечер.</span></div>
          </div>

          {/* Действительные — будущее время */}
          <h3 className="rules-sub-title">Действительные причастия будущего времени</h3>
          <p>Образуются от неопределённой формы глагола. Формы мужского рода:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">kalbė<span className="rules-stem-cut">\</span>ti + –siąs / –siantis = <strong>kalbėsiąs / kalbėsiantis</strong></div>
          </div>
          <div className="rules-note">
            <strong>Мн. ч.:</strong> –sią / –siantys — например: <em>kalbėsią / kalbėsiantys</em>.<br />
            <strong>Ж. р. ед. ч.:</strong> –sianti — например: <em>kalbėsianti</em>.
          </div>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Jis sako važiuosiąs į Rusiją.</span><span className="rules-ex-ru">Он говорит, что намерен поехать в Россию.</span></div>
          </div>

          {/* Страдательные — настоящее время */}
          <h3 className="rules-sub-title">Страдательные причастия настоящего времени</h3>
          <p>Образуются от 3&nbsp;лица настоящего времени. Суффикс <strong>–mas</strong> (м.&nbsp;р.) / <strong>–ma</strong> (ж.&nbsp;р.):</p>
          <div className="rules-formula-group">
            <div className="rules-formula">stat<span className="rules-stem-cut">\</span>o + –mas = <strong>statomas</strong></div>
          </div>
          <div className="rules-note">
            <strong>Мн. ч. м. р.:</strong> –mi — например: <em>statomi</em>.<br />
            <strong>Мн. ч. ж. р.:</strong> –mos — например: <em>statomos</em>.
          </div>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Šis namas jau statomas.</span><span className="rules-ex-ru">Этот дом уже строится.</span></div>
          </div>

          {/* Страдательные — прошедшее время */}
          <h3 className="rules-sub-title">Страдательные причастия прошедшего времени</h3>
          <p>Образуются от неопределённой формы. Суффикс <strong>–tas</strong> (м.&nbsp;р.) / <strong>–ta</strong> (ж.&nbsp;р.):</p>
          <div className="rules-formula-group">
            <div className="rules-formula">staty<span className="rules-stem-cut">\</span>ti + –tas = <strong>statytas</strong></div>
          </div>
          <div className="rules-note">
            <strong>Мн. ч. м. р.:</strong> –ti — например: <em>statyti</em>.<br />
            <strong>Мн. ч. ж. р.:</strong> –tos — например: <em>statytos</em>.
          </div>
          <p>Возвратные и безличные формы:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">staty<span className="rules-stem-cut">\</span>tis + –tas = <strong>statytasis</strong></div>
            <div className="rules-formula">rašy<span className="rules-stem-cut">\</span>ti + –ta = <strong>rašyta</strong> <em>(безличная)</em></div>
          </div>
          <div className="rules-note">
            Безличная форма совпадает с формой именительного падежа женского рода, но не склоняется.
          </div>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Vilniaus universitetas įkurtas 1579 metais.</span><span className="rules-ex-ru">Вильнюсский университет был основан в 1579 году.</span></div>
          </div>

          <div className="rules-note">
            Причастия склоняются так же, как имена прилагательные.
          </div>
        </div>

        {/* ---- Сложные формы времени ------------------------------------- */}
        <div id="ru-compound-tenses" className="rules-tense">
          <h2 className="rules-tense-title">Сложные формы времени</h2>

          <h3 className="rules-sub-title">С действительными причастиями</h3>
          <p>
            Сложные формы времени образуются от действительных и страдательных причастий
            настоящего и прошедшего однократного времени при помощи личных форм
            вспомогательного глагола <strong>быть</strong>.
          </p>

          <p className="rules-pattern-note">Сложное совершенное время обозначает результативное состояние, возникшее от ранее совершённого действия:</p>
          <div className="rules-note">
            <strong>Настоящее:</strong> <em>yra buvęs, yra buvusi</em><br />
            <strong>Прошедшее однократное:</strong> <em>buvo skaitęs, buvo skaičiusi</em><br />
            <strong>Прошедшее многократное:</strong> <em>būdavo pagalvojęs, būdavo pagalvojusi</em><br />
            <strong>Будущее:</strong> <em>bus pasiruošęs, bus pasiruošusi</em>
          </div>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Ar tu esi buvęs Nidoje?</span><span className="rules-ex-ru">Был ли ты в Ниде?</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Jis jau buvo buvęs parodoje, bet nuėjo dar kartą.</span><span className="rules-ex-ru">Он уже был на выставке, но пошёл ещё раз.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Kai nuvažiuodavau pas močiutę, ji visada būdavo iškepusi pyragą.</span><span className="rules-ex-ru">Когда я приезжал к бабушке, у неё всегда был испечён пирог.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Kai tu grįši namo, aš jau būsiu išviręs vakarienę.</span><span className="rules-ex-ru">Когда ты вернёшься домой, мной уже будет приготовлен ужин.</span></div>
          </div>

          <p className="rules-pattern-note">Сложное несовершенное время обозначает действие, начатое ранее и ещё продолжающееся в момент другого действия:</p>
          <div className="rules-note">
            <strong>Образование (м. р.):</strong> <em>buvau beeinąs / beeinantis</em><br />
            <strong>Образование (ж. р.):</strong> <em>buvau beeinanti</em>
          </div>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Jau buvau besiunčiąs tau žinutę, bet tu man parašei.</span><span className="rules-ex-ru">Я уже было высылал тебе сообщение, но ты мне написал.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Jau buvau beskambinanti tau, bet tu man paskambinai.</span><span className="rules-ex-ru">Я уже было звонила тебе, но ты мне позвонил.</span></div>
          </div>

          <h3 className="rules-sub-title">Со страдательными причастиями настоящего времени</h3>
          <p>
            Образуются при помощи личных форм глагола <strong>быть</strong> + страдательное причастие настоящего времени.
          </p>
          <div className="rules-note">
            <strong>Настоящее:</strong> <em>esu mylimas / mylima</em><br />
            <strong>Прошедшее однократное:</strong> <em>buvo gerbiamas / gerbiama</em><br />
            <strong>Прошедшее многократное:</strong> <em>būdavau laukiamas / laukiama</em><br />
            <strong>Будущее:</strong> <em>būsi laukiamas / laukiama</em>
          </div>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Tu esi mokinių mėgstama mokytoja.</span><span className="rules-ex-ru">Ты любима учениками учительница.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Jis buvo gerbiamas bendraklasių.</span><span className="rules-ex-ru">Он был уважаем одноклассниками.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Čia bus statomas namas.</span><span className="rules-ex-ru">Здесь будет строиться дом.</span></div>
          </div>

          <h3 className="rules-sub-title">Со страдательными причастиями прошедшего времени</h3>
          <p>
            Образуются при помощи личных форм глагола <strong>быть</strong> + страдательное причастие прошедшего времени.
          </p>
          <div className="rules-note">
            <strong>Настоящее:</strong> <em>esu mylėtas / mylėta</em><br />
            <strong>Прошедшее однократное:</strong> <em>buvo pakviestas / pakviesta</em><br />
            <strong>Прошедшее многократное:</strong> <em>būdavai įvertintas / įvertinta</em><br />
            <strong>Будущее:</strong> <em>bus paklaustas / paklausta</em>
          </div>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Vaikai yra išmokyti mandagiai elgtis.</span><span className="rules-ex-ru">Дети научены вести себя вежливо.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Ant stalelio visada būdavo padėtas naujausias laikraštis.</span><span className="rules-ex-ru">На столик всегда бывала положена новейшая газета.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Vaikai bus išmokyti mandagiai elgtis.</span><span className="rules-ex-ru">Дети будут научены вести себя вежливо.</span></div>
          </div>
        </div>

        {/* ---- Сложное условное наклонение ------------------------------- */}
        <div id="ru-compound-conditional" className="rules-tense">
          <h2 className="rules-tense-title">Сложное условное наклонение</h2>
          <p>
            Образуется при помощи личных форм глагола <strong>быть</strong> в условном наклонении
            и действительных причастий прошедшего однократного времени. Употребляется для
            выражения нереального условия.
          </p>
          <div className="rules-note">
            <strong>М. р.:</strong> <em>būčiau žinojęs, būtume žinoję</em><br />
            <strong>Ж. р.:</strong> <em>būtum žinojusi, būtumėte žinojusios</em>
          </div>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Jeigu būtų buvęs geras oras, būtume važiavę į ekskursiją.</span><span className="rules-ex-ru">Если бы была хорошая погода, мы поехали бы на экскурсию.</span></div>
            <div className="rules-example-row"><span className="rules-ex-lt">Jei būčiau buvusi jaunesnė, būčiau šokusi visą vakarą.</span><span className="rules-ex-ru">Если бы я была помоложе, то танцевала бы весь вечер.</span></div>
          </div>
        </div>

        {/* ---- Полупричастия --------------------------------------------- */}
        <div id="ru-half-participles" className="rules-tense">
          <h2 className="rules-tense-title">Полупричастия</h2>
          <p>
            Полупричастия (<em>pusdalyvis</em>) образуются от основы неопределённой формы
            при помощи окончания <strong>–damas</strong> (м.&nbsp;р.) / <strong>–dama</strong> (ж.&nbsp;р.):
          </p>
          <div className="rules-formula-group">
            <div className="rules-formula">ei<span className="rules-stem-cut">\</span>ti + –damas = <strong>eidamas</strong></div>
            <div className="rules-formula">rašy<span className="rules-stem-cut">\</span>ti + –damas = <strong>rašydamas</strong></div>
          </div>
          <div className="rules-note">
            <strong>Мн. ч. м. р.:</strong> –dami — например: <em>eidami, rašydami</em>.<br />
            <strong>Мн. ч. ж. р.:</strong> –damos — например: <em>eidamos, rašydamos</em>.
          </div>
          <p>Возвратные формы:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">praus<span className="rules-stem-cut">\</span>tis + –damas = <strong>prausdamasis</strong></div>
            <div className="rules-formula">praus<span className="rules-stem-cut">\</span>tis + –dama = <strong>prausdamasi</strong></div>
          </div>
          <p className="rules-pattern-note">
            Полупричастия обозначают не основное, а сопутствующее действие, выполняемое
            тем же лицом одновременно с основным:
          </p>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Brolis, eidamas iš darbo namo, sutiko savo seną pažįstamą.</span><span className="rules-ex-ru">Брат, идя с работы домой, встретил своего старого знакомого.</span></div>
          </div>
        </div>

        {/* ---- Деепричастия ---------------------------------------------- */}
        <div id="ru-gerunds" className="rules-tense">
          <h2 className="rules-tense-title">Деепричастия</h2>

          <h3 className="rules-sub-title">Деепричастия настоящего времени</h3>
          <p>
            Образуются от основы глагола в форме настоящего времени при помощи суффиксов
            <strong> –ant</strong> и <strong>–int</strong>:
          </p>
          <div className="rules-formula-group">
            <div className="rules-formula">kalb<span className="rules-stem-cut">\</span>a + –ant = <strong>kalbant</strong></div>
            <div className="rules-formula">verč<span className="rules-stem-cut">\</span>ia + –iant = <strong>verčiant</strong></div>
            <div className="rules-formula">sak<span className="rules-stem-cut">\</span>o + –ant = <strong>sakant</strong></div>
            <div className="rules-formula">myl<span className="rules-stem-cut">\</span>i + –int = <strong>mylint</strong></div>
          </div>
          <p>Возвратные формы:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">stat<span className="rules-stem-cut">\</span>osi + –ant = <strong>statantis</strong></div>
            <div className="rules-formula">tik<span className="rules-stem-cut">\</span>isi + –int = <strong>tikintis</strong></div>
          </div>
          <div className="rules-note">
            В отличие от русского, в литовском языке действие деепричастия всегда относится
            к лицу, совершающему побочное, второстепенное действие. Это лицо стоит в
            дательном падеже.
          </div>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Tėvams žiūrint televizorių, vaikai žaidė savo kambaryje.</span><span className="rules-ex-ru">В то время как родители смотрели телевизор, дети играли в своей комнате.</span></div>
          </div>

          <h3 className="rules-sub-title">Деепричастия прошедшего времени</h3>
          <p>
            Образуются от основы глагола прошедшего однократного времени при помощи
            суффикса <strong>–(i)us</strong>:
          </p>
          <div className="rules-formula-group">
            <div className="rules-formula">kalbėj<span className="rules-stem-cut">\</span>o + –us = <strong>kalbėjus</strong></div>
            <div className="rules-formula">vert<span className="rules-stem-cut">\</span>ė + –us = <strong>vertus</strong></div>
            <div className="rules-formula">raš<span className="rules-stem-cut">\</span>ė + –ius = <strong>rašius</strong></div>
          </div>
          <p>Возвратные формы:</p>
          <div className="rules-formula-group">
            <div className="rules-formula">stat<span className="rules-stem-cut">\</span>ėsi + –ius = <strong>stačiusis</strong></div>
            <div className="rules-formula">džiaug<span className="rules-stem-cut">\</span>ėsi + –us = <strong>džiaugusis</strong></div>
          </div>
          <p className="rules-pattern-note">
            Деепричастия прошедшего времени указывают на дополнительное действие,
            предшествовавшее основному. Зависимые слова ставятся в дательном падеже:
          </p>
          <div className="rules-examples-list">
            <div className="rules-example-row"><span className="rules-ex-lt">Tėvui parėjus namo, visa šeima sėdo valgyti vakarienės.</span><span className="rules-ex-ru">После того как отец вернулся домой, вся семья села ужинать.</span></div>
          </div>
        </div>

      </CollapsibleSection>

    </div>
  );
}
