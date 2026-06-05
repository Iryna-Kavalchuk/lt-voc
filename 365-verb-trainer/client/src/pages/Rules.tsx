// Rules page — grammar rules from "365 Lithuanian Verbs" book
// Dispatches to the Lithuanian version when lang === "lt",
// otherwise shows the Russian version (the book's primary target language).

import { useContext } from "react";
import { LangContext } from "../context/LangContext";
import RulesLt from "./RulesLt";
import CollapsibleSection from "../components/CollapsibleSection";

export default function Rules() {
  const { lang } = useContext(LangContext);
  if (lang === "lt") return <RulesLt />;

  // Russian / English — content is in Russian (source language of the book)
  return <RulesContent />;
}

function RulesContent() {
  return (
    <div className="rules-page">

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1 — Изъявительное наклонение                               */}
      {/* ------------------------------------------------------------------ */}
      <CollapsibleSection title="Изъявительное наклонение">

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
        <div className="rules-tense">
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
        <div className="rules-tense">
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
        <div className="rules-tense">
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
        <div className="rules-tense">
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
      <CollapsibleSection title="Повелительное наклонение">

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
      <CollapsibleSection title="Условное наклонение">

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

    </div>
  );
}
