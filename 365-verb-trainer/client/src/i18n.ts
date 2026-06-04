// ---------------------------------------------------------------------------
// i18n — simple key/value translations + useLanguage hook
// ---------------------------------------------------------------------------

export type Lang = "en" | "ru";

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
  return v === "ru" ? "ru" : "en";
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
