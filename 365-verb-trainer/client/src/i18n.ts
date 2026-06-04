// ---------------------------------------------------------------------------
// i18n — simple key/value translations + useLanguage hook
// ---------------------------------------------------------------------------

export type Lang = "en" | "ru" | "lt";

export const translations = {
  en: {
    // Nav
    nav_train:    "Train",
    nav_verblist: "Verb List",
    nav_progress: "Progress",
    nav_fortune:  "Fortune",
    app_title:    "365 Verb Trainer",

    // Quiz setup
    setup_title:       "Start a training session",
    setup_modes_label: "Question types:",
    setup_size_label:  "Questions per session:",
    setup_start:       (n: number) => `Start (${n} questions)`,
    mode_mixed:        "Mixed",
    mode_verb_translation:  "Verb translation",
    mode_conjugation_drill: "Conjugation drill",
    mode_main_forms:        "Main forms",
    mode_fill_blank:        "Fill in the blank",
    mode_fill_blank_hint:   "Fill in the blank (with hint)",

    // Quiz score bar
    scorebar_question: "Question",
    scorebar_score:    "Score",
    scorebar_restart:  "Restart",

    // Quiz instructions
    instr_verb_translation:  "Pick the Russian translation",
    instr_conjugation_drill: "Type the correct conjugated form",
    instr_main_forms:        "Type the 3 main forms",
    instr_fill_blank:        "Type the missing verb form",

    // Quiz feedback
    feedback_correct:        "Correct!",
    feedback_imprecise:      (ans: string) => `✓ Right — use Lithuanian spelling: ${ans}`,
    feedback_wrong_choice:   (ans: string) => `Wrong — the answer is "${ans}"`,
    feedback_wrong_forms:    "Not quite — see the correct forms above",
    feedback_wrong_form:     "Not quite — see the correct form above",
    feedback_point_earned:   "+ 1 point earned",
    feedback_point_lost:     "− 1 point lost",
    show_verb_details:       "Show verb details",
    hide_verb_details:       "Hide verb details",
    next_question:           "Next question →",

    // Quiz results
    results_complete:  "Session complete!",
    results_accuracy:  (pct: number) => `${pct}% accuracy`,
    results_better:    "Better than",
    results_sessions:  (n: number) => `(${n} total)`,
    results_new:       "New session",
    results_see:       "See results →",
    review_title:      "Verb review",

    // Main forms labels
    form_infinitive:    "Infinitive",
    form_present_3rd:   "Present (3rd)",
    form_past_3rd:      "Past (3rd)",
    btn_check:          "Check",

    // Tense labels
    tense_present:           "Present",
    tense_past:              "Past",
    tense_subjunctive:       "Subjunctive / Conditional",
    tense_frequentative_past:"Freq. Past",
    tense_future:            "Future",
    tense_imperative:        "Imperative",

    // VerbCard sections
    vc_conjugation:       "Conjugation",
    vc_nonconjugated:     "Non-conjugated forms",
    vc_examples:          "Examples",

    // Non-conjugated form names
    noncj_1: "Present active participle",
    noncj_2: "Past active participle",
    noncj_3: "Freq. past active participle",
    noncj_4: "Future active participle",
    noncj_5: "Present passive participle",
    noncj_6: "Past passive participle",
    noncj_7: "Present adverbial participle",
    noncj_8: "Present gerund",
    noncj_9: "Past gerund",

    // Verb list
    verblist_search:  "Search by infinitive or translation…",
    verblist_all:     "All",
    verblist_count:   (n: number) => `${n} verbs`,
    verblist_loading: "Loading verbs…",

    // Progress
    progress_points:         (n: number) => `${n} point${n !== 1 ? "s" : ""}`,
    progress_verbs:          (n: number) => `(${n} verbs)`,
    progress_not_started:    (n: number) => `(${n} verbs not yet started)`,
    progress_loading:        "Loading…",

    // Fortune
    fortune_title:    "Fortune",
    fortune_subtitle: "Draw a random Lithuanian sentence from the 365 verbs book",
    fortune_draw:     "Draw",
    fortune_again:    "Draw again",
    fortune_drawing:  "Drawing…",

    // About
    nav_about:           "About",
    about_title:         "About this app",
    about_app_desc:      "This app is based on the book «365 Lithuanian Verbs» (2015), designed for Russian speakers learning Lithuanian. It covers 365 high-frequency verbs with full conjugation tables, non-conjugated forms, and usage examples.",
    about_book_title:    "Source book",
    about_book_authors:  "Virginija Stumbrienė, Loreta Vilkienė, Henrika Prosniakova",
    about_book_pub:      "Vilnius University, 2015",
    about_book_link:     "Read the book (PDF)",
    about_thanks_title:  "Acknowledgements",
    about_thanks_text:   "All verb data, conjugation tables, and usage examples are taken directly from this book. We are grateful to the authors for creating such a thorough and accessible learning resource.",
    about_noncommercial: "This app is a free educational tool and is not used for any commercial purpose.",
    about_copyright:     "© Virginija Stumbrienė, © Loreta Vilkienė, © Henrika Prosniakova, © Vilnius University, 2015",

    // Authors
    about_authors_title:  "Made by",
    about_authors_text:   "IT professionals from Belarus who relocated to Lithuania, are learning the language themselves, and want to help others do the same.",

    // Feedback form
    about_feedback_title:       "Leave feedback",
    about_feedback_rating:      "Your rating:",
    about_feedback_comment:     "Comment (optional)",
    about_feedback_submit:      "Send feedback",
    about_feedback_submitting:  "Sending…",
    about_feedback_success:     "Thank you for your feedback!",
    about_feedback_error:       "Could not send feedback. Please try again.",
    about_feedback_star:        (n: number) => `${n} star${n !== 1 ? "s" : ""}`,
  },

  ru: {
    // Nav
    nav_train:    "Тренировка",
    nav_verblist: "Глаголы",
    nav_progress: "Прогресс",
    nav_fortune:  "Фортуна",
    app_title:    "365 глаголов",

    // Quiz setup
    setup_title:       "Начать тренировку",
    setup_modes_label: "Типы вопросов:",
    setup_size_label:  "Вопросов за сессию:",
    setup_start:       (n: number) => `Начать (${n} вопросов)`,
    mode_mixed:        "Микс",
    mode_verb_translation:  "Перевод глагола",
    mode_conjugation_drill: "Спряжение",
    mode_main_forms:        "Основные формы",
    mode_fill_blank:        "Заполнить пропуск",
    mode_fill_blank_hint:   "Заполнить пропуск (с подсказкой)",

    // Quiz score bar
    scorebar_question: "Вопрос",
    scorebar_score:    "Счёт",
    scorebar_restart:  "Начать заново",

    // Quiz instructions
    instr_verb_translation:  "Выберите перевод на русский",
    instr_conjugation_drill: "Введите правильную форму глагола",
    instr_main_forms:        "Введите 3 основные формы",
    instr_fill_blank:        "Введите пропущенную форму глагола",

    // Quiz feedback
    feedback_correct:        "Правильно!",
    feedback_imprecise:      (ans: string) => `✓ Верно — литовское написание: ${ans}`,
    feedback_wrong_choice:   (ans: string) => `Неверно — правильный ответ: «${ans}»`,
    feedback_wrong_forms:    "Не совсем — см. правильные формы выше",
    feedback_wrong_form:     "Не совсем — см. правильную форму выше",
    feedback_point_earned:   "+ 1 очко получено",
    feedback_point_lost:     "− 1 очко потеряно",
    show_verb_details:       "Показать глагол",
    hide_verb_details:       "Скрыть глагол",
    next_question:           "Следующий вопрос →",

    // Quiz results
    results_complete:  "Сессия завершена!",
    results_accuracy:  (pct: number) => `${pct}% точность`,
    results_better:    "Лучше, чем",
    results_sessions:  (n: number) => `(всего ${n})`,
    results_new:       "Новая сессия",
    results_see:       "Итоги →",
    review_title:      "Разбор глагола",

    // Main forms labels
    form_infinitive:    "Инфинитив",
    form_present_3rd:   "Наст. (3 л.)",
    form_past_3rd:      "Прош. (3 л.)",
    btn_check:          "Проверить",

    // Tense labels
    tense_present:           "Настоящее",
    tense_past:              "Прошедшее",
    tense_subjunctive:       "Сослагат.",
    tense_frequentative_past:"Многокр. прош.",
    tense_future:            "Будущее",
    tense_imperative:        "Повелит.",

    // VerbCard sections
    vc_conjugation:       "Спряжение",
    vc_nonconjugated:     "Неспрягаемые формы",
    vc_examples:          "Примеры",

    // Non-conjugated form names
    noncj_1: "Прич. наст. вр. действ.",
    noncj_2: "Прич. прош. вр. действ.",
    noncj_3: "Прич. многокр. прош. действ.",
    noncj_4: "Прич. буд. вр. действ.",
    noncj_5: "Прич. наст. вр. страд.",
    noncj_6: "Прич. прош. вр. страд.",
    noncj_7: "Дееприч. наст. вр.",
    noncj_8: "Отглаг. сущ. наст. вр.",
    noncj_9: "Отглаг. сущ. прош. вр.",

    // Verb list
    verblist_search:  "Поиск по инфинитиву или переводу…",
    verblist_all:     "Все",
    verblist_count:   (n: number) => `${n} глаголов`,
    verblist_loading: "Загрузка глаголов…",

    // Progress
    progress_points:         (n: number) => `${n} ${n === 1 ? "очко" : n < 5 ? "очка" : "очков"}`,
    progress_verbs:          (n: number) => `(${n} ${n === 1 ? "глагол" : n < 5 ? "глагола" : "глаголов"})`,
    progress_not_started:    (n: number) => `(${n} ${n === 1 ? "глагол" : n < 5 ? "глагола" : "глаголов"} ещё не начато)`,
    progress_loading:        "Загрузка…",

    // Fortune
    fortune_title:    "Фортуна",
    fortune_subtitle: "Вытяните случайное литовское предложение из книги «365 глаголов»",
    fortune_draw:     "Вытянуть",
    fortune_again:    "Ещё раз",
    fortune_drawing:  "Загрузка…",

    // About
    nav_about:           "О приложении",
    about_title:         "О приложении",
    about_app_desc:      "Приложение создано на основе книги «365 глаголов литовского языка» (2015), предназначенной для русскоязычных, изучающих литовский язык. В нём собраны 365 наиболее употребительных глаголов с полными таблицами спряжения, неспрягаемыми формами и примерами употребления.",
    about_book_title:    "Источник",
    about_book_authors:  "Виргиния Стумбриене, Лорета Вилкиене, Генрика Проснякова",
    about_book_pub:      "Вильнюсский университет, 2015",
    about_book_link:     "Читать книгу (PDF)",
    about_thanks_title:  "Благодарности",
    about_thanks_text:   "Все данные о глаголах, таблицы спряжения и примеры использования взяты непосредственно из этой книги. Мы благодарны авторам за создание столь подробного и доступного учебного пособия.",
    about_noncommercial: "Приложение является бесплатным образовательным инструментом и не используется в коммерческих целях.",
    about_copyright:     "© Виргиния Стумбриене, © Лорета Вилкиене, © Генрика Проснякова, © Вильнюсский университет, 2015",

    // Authors
    about_authors_title:  "Создано",
    about_authors_text:   "IT-специалистами из Беларуси, переехавшими в Литву, которые сами изучают язык и хотят помочь другим.",

    // Feedback form
    about_feedback_title:       "Оставить отзыв",
    about_feedback_rating:      "Ваша оценка:",
    about_feedback_comment:     "Комментарий (необязательно)",
    about_feedback_submit:      "Отправить",
    about_feedback_submitting:  "Отправка…",
    about_feedback_success:     "Спасибо за отзыв!",
    about_feedback_error:       "Не удалось отправить. Попробуйте ещё раз.",
    about_feedback_star:        (n: number) => `${n} ${n === 1 ? "звезда" : n < 5 ? "звезды" : "звёзд"}`,
  },

  lt: {
    // Nav
    nav_train:    "Treniruotis",
    nav_verblist: "Veiksmažodžiai",
    nav_progress: "Pažanga",
    nav_fortune:  "Sėkmė",
    app_title:    "365 veiksmažodžiai",

    // Quiz setup
    setup_title:       "Pradėti treniruotę",
    setup_modes_label: "Klausimų tipai:",
    setup_size_label:  "Klausimų per sesiją:",
    setup_start:       (n: number) => `Pradėti (${n} klausimai)`,
    mode_mixed:        "Mišrus",
    mode_verb_translation:  "Veiksmažodžio vertimas",
    mode_conjugation_drill: "Asmenavimas",
    mode_main_forms:        "Pagrindinės formos",
    mode_fill_blank:        "Užpildyti tarpą",
    mode_fill_blank_hint:   "Užpildyti tarpą (su užuomina)",

    // Quiz score bar
    scorebar_question: "Klausimas",
    scorebar_score:    "Rezultatas",
    scorebar_restart:  "Pradėti iš naujo",

    // Quiz instructions
    instr_verb_translation:  "Pasirinkite vertimą į rusų kalbą",
    instr_conjugation_drill: "Įveskite teisingą veiksmažodžio formą",
    instr_main_forms:        "Įveskite 3 pagrindines formas",
    instr_fill_blank:        "Įveskite trūkstamą veiksmažodžio formą",

    // Quiz feedback
    feedback_correct:        "Teisingai!",
    feedback_imprecise:      (ans: string) => `✓ Teisingai — naudokite lietuvišką rašybą: ${ans}`,
    feedback_wrong_choice:   (ans: string) => `Neteisingai — atsakymas yra „${ans}"`,
    feedback_wrong_forms:    "Beveik — žr. teisingas formas aukščiau",
    feedback_wrong_form:     "Beveik — žr. teisingą formą aukščiau",
    feedback_point_earned:   "+ 1 taškas gautas",
    feedback_point_lost:     "− 1 taškas prarastas",
    show_verb_details:       "Rodyti veiksmažodį",
    hide_verb_details:       "Slėpti veiksmažodį",
    next_question:           "Kitas klausimas →",

    // Quiz results
    results_complete:  "Sesija baigta!",
    results_accuracy:  (pct: number) => `${pct}% tikslumas`,
    results_better:    "Geriau nei",
    results_sessions:  (n: number) => `(iš viso ${n})`,
    results_new:       "Nauja sesija",
    results_see:       "Rezultatai →",
    review_title:      "Veiksmažodžio apžvalga",

    // Main forms labels
    form_infinitive:    "Bendratinis",
    form_present_3rd:   "Esamasis (3 a.)",
    form_past_3rd:      "Būtasis (3 a.)",
    btn_check:          "Tikrinti",

    // Tense labels
    tense_present:           "Esamasis",
    tense_past:              "Būtasis",
    tense_subjunctive:       "Tariamoji nuosaka",
    tense_frequentative_past:"Būtasis dažninis",
    tense_future:            "Būsimasis",
    tense_imperative:        "Liepiamoji nuosaka",

    // VerbCard sections
    vc_conjugation:       "Asmenavimas",
    vc_nonconjugated:     "Neasmenuojamos formos",
    vc_examples:          "Pavyzdžiai",

    // Non-conjugated form names
    noncj_1: "Esamojo laiko veikiamoji dalyvė",
    noncj_2: "Būtojo laiko veikiamoji dalyvė",
    noncj_3: "Būtojo dažninio laiko veikiamoji dalyvė",
    noncj_4: "Būsimojo laiko veikiamoji dalyvė",
    noncj_5: "Esamojo laiko neveikiamoji dalyvė",
    noncj_6: "Būtojo laiko neveikiamoji dalyvė",
    noncj_7: "Esamojo laiko padalyvis",
    noncj_8: "Esamojo laiko pusdalyvis",
    noncj_9: "Būtojo laiko pusdalyvis",

    // Verb list
    verblist_search:  "Ieškoti pagal bendraties formą ar vertimą…",
    verblist_all:     "Visi",
    verblist_count:   (n: number) => `${n} veiksmažodžiai`,
    verblist_loading: "Kraunama…",

    // Progress
    progress_points:         (n: number) => `${n} ${n === 1 ? "taškas" : "taškai"}`,
    progress_verbs:          (n: number) => `(${n} veiksmažodžiai)`,
    progress_not_started:    (n: number) => `(${n} veiksmažodžiai dar nepradėti)`,
    progress_loading:        "Kraunama…",

    // Fortune
    fortune_title:    "Sėkmė",
    fortune_subtitle: 'Ištraukite atsitiktinį lietuvišką sakinį iš knygos „365 veiksmažodžiai"',
    fortune_draw:     "Traukti",
    fortune_again:    "Traukti dar kartą",
    fortune_drawing:  "Kraunama…",

    // About
    nav_about:           "Apie",
    about_title:         "Apie šią programą",
    about_app_desc:      'Ši programa sukurta remiantis knyga „365 lietuvių kalbos veiksmažodžiai" (2015), skirta rusakalbiams, besimokantiems lietuvių kalbos. Joje pateikiami 365 dažniausiai vartojami veiksmažodžiai su pilnomis asmenavimo lentelėmis, neasmenuojamomis formomis ir vartojimo pavyzdžiais.',
    about_book_title:    "Šaltinis",
    about_book_authors:  "Virginija Stumbrienė, Loreta Vilkienė, Henrika Prosniakova",
    about_book_pub:      "Vilniaus universitetas, 2015",
    about_book_link:     "Skaityti knygą (PDF)",
    about_thanks_title:  "Padėka",
    about_thanks_text:   "Visi duomenys apie veiksmažodžius, asmenavimo lentelės ir vartojimo pavyzdžiai paimti tiesiai iš šios knygos. Dėkojame autoriams už šį išsamų ir prieinamą mokymosi šaltinį.",
    about_noncommercial: "Ši programa yra nemokama edukacinė priemonė ir nenaudojama komerciniais tikslais.",
    about_copyright:     "© Virginija Stumbrienė, © Loreta Vilkienė, © Henrika Prosniakova, © Vilniaus universitetas, 2015",

    // Authors
    about_authors_title:  "Sukūrė",
    about_authors_text:   "IT specialistai iš Baltarusijos, persikėlę į Lietuvą, patys besimokantys kalbos ir norintys padėti kitiems.",

    // Feedback form
    about_feedback_title:       "Palikti atsiliepimą",
    about_feedback_rating:      "Jūsų įvertinimas:",
    about_feedback_comment:     "Komentaras (neprivaloma)",
    about_feedback_submit:      "Siųsti atsiliepimą",
    about_feedback_submitting:  "Siunčiama…",
    about_feedback_success:     "Ačiū už atsiliepimą!",
    about_feedback_error:       "Nepavyko išsiųsti. Bandykite dar kartą.",
    about_feedback_star:        (n: number) => `${n} ${n === 1 ? "žvaigždutė" : "žvaigždutės"}`,
  },
} as const;

export type Translations = typeof translations.en;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

import { useState, useCallback } from "react";

const STORAGE_KEY = "verb_trainer_lang";

function getSavedLang(): Lang {
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === "ru" || v === "lt") return v;
  return "en";
}

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>(getSavedLang);

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem(STORAGE_KEY, l);
    setLangState(l);
  }, []);

  const t = translations[lang] as Translations;

  return { lang, setLang, t };
}
