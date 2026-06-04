# AI Bootcamp — Project Context

This repo contains two Lithuanian language learning apps sharing a PostgreSQL database on Render.

---

# Project 1: 365 Verb Trainer (`365-verb-trainer/`)

## What this is
A web app for Russian speakers learning Lithuanian verbs. Based on the book
"365 Lithuanian Verbs" (2015), which lists 365 high-frequency Lithuanian verbs
with Russian translations, full conjugation tables, non-conjugated forms, and
usage examples in both languages.

The app lets users drill these verbs through 5 quiz modes with spaced repetition
to prioritize weaker verbs. Each verb has:
- **3 main forms**: infinitive, 3rd person present, 3rd person past
  (e.g. `abejoti, abejoja, abejojo` — "to doubt")
- **Full conjugation**: 6 tenses × 5 persons (aš, tu, jis/ji/jie/jos, mes, jūs)
  - Present, Past, Frequentative past, Future, Subjunctive, Imperative
- **9 non-conjugated forms**: active/passive participles, half-participles, adverbial participles
- **Russian translation** (e.g. `сомневаться`)
- **4–6 usage examples** with Lithuanian sentence + Russian translation + optional
  grammatical hint (e.g. `kuo?`, `dėl ko?`)
- **Audio**: MP3 of the 3 main forms spoken by gTTS (Lithuanian TTS)

Full-stack: React + TypeScript frontend, Express + TypeScript backend, PostgreSQL.

## Repo
- GitHub: https://github.com/Iryna-Kavalchuk/lt-verb.git
- Remote name: `lt-verb` (NOT `origin` — origin points to a different repo lt-voc, always push to `lt-verb`)
- Branch: `master`
- Push command: `git push lt-verb master`

## Deployment
- Platform: Render.com
- Service name: `lt-verb`
- URL: https://lt-verb.onrender.com
- Every push to `lt-verb` remote triggers auto-redeploy
- Free plan: spins down after 15 min inactivity, ~30s cold start

## Project structure
```
ai-bootcamp/
├── generate_audio.py              # Regenerates MP3s from verb data (run from repo root)
├── 365-verb-trainer/
│   ├── client/                    # React + Vite frontend (port 5174 in dev)
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── Quiz.tsx       # Main quiz page (all 5 modes)
│   │   │   │   ├── VerbList.tsx   # Verb browser with 🔊 audio button
│   │   │   │   ├── Progress.tsx   # Spaced repetition point tracker
│   │   │   │   ├── Fortune.tsx    # Random verb+example draw
│   │   │   │   ├── About.tsx      # Book credits & acknowledgements
│   │   │   │   ├── Admin.tsx      # Password-protected stats (URL: /admin)
│   │   │   │   └── VerbEditor.tsx # Password-protected verb data editor (URL: /edit)
│   │   │   ├── components/VerbCard.tsx
│   │   │   ├── context/LangContext.tsx
│   │   │   ├── i18n.ts            # EN/RU/LT translations
│   │   │   ├── App.tsx            # Shell, nav, hamburger menu
│   │   │   └── App.css            # Single global stylesheet (~1570 lines)
│   │   ├── public/
│   │   │   ├── book-cover.jpg     # Book cover image (used in header + About page)
│   │   │   └── favicon.png        # Favicon (cropped book cover)
│   │   └── vite.config.ts         # Proxies /api, /health, /audio to localhost:3001
│   └── server/                    # Express backend (port 3001 in dev)
│       ├── src/
│       │   ├── index.ts           # App factory, static serving
│       │   ├── routes.ts          # API endpoints
│       │   ├── quiz.ts            # Quiz logic, 5 modes
│       │   ├── stats.ts           # Spaced repetition, points
│       │   ├── db.ts              # PostgreSQL schema
│       │   └── data/
│       │       ├── verb-examples-enriched.json  # 365 verb entries
│       │       └── audio/                        # 365 MP3s (1.mp3–365.mp3)
│       └── scripts/
│           └── copy-data.mjs      # Post-build: copies JSON + MP3s to dist/data/
├── 365-verb/                      # Source data (PDF, raw JSON, parse scripts)
└── landing-page/, lithuanian-vocab/, roi-calculator/  # Other projects, ignore
```

## Dev workflow
```bash
# Backend
cd 365-verb-trainer/server && npm run dev   # tsx src/index.ts on port 3001

# Frontend
cd 365-verb-trainer/client && npm run dev   # vite on port 5174

# Build (production)
cd 365-verb-trainer/server && npm run build  # tsc + copies data via scripts/copy-data.mjs
cd 365-verb-trainer/client && npm run build  # note: 3 pre-existing TS errors in VerbCard/VerbEditor, non-blocking (vite ignores them)
```

## Navigation / UI
- Routing is state-based (`useState<Page>`) — no React Router
- Pages: `quiz | verbs | progress | fortune | about`
- Admin/editor at URL paths `/admin` and `/edit` (no nav, password-gated)
- **Hamburger menu** at ≤540px: desktop nav hidden, `☰` button shown in header top-right
  - Dropdown opens below header, closes on nav item tap or outside click
  - Animates to `×` when open
- Language toggle (EN / RU / LT) in header top-right, persisted to `localStorage`
- **Header**: book cover thumbnail (32px) + title (`365 VERBS` / `365 ГЛАГОЛОВ` / `365 VEIKSMAŽODŽIAI`)
- **Favicon**: cropped book cover PNG (`public/favicon.png`)
- Theme: warm burgundy `#7a3535` header, cream `#f5f0e8` background, crimson `#c0272d` accents

## Audio system
- 365 MP3 files in `server/src/data/audio/<id>.mp3`
- Each file speaks the verb's 3 main forms in Lithuanian
- Generated by `generate_audio.py` using gTTS (`lang="lt"`)
- Served by Express at `/audio/<id>.mp3` via `express.static`
- Played by 🔊 button in VerbList.tsx and VerbCard.tsx using `new Audio('/audio/<id>.mp3')`

### Known audio issues (already fixed)
1. **Combining diacritics**: 252 verbs had Unicode combining marks (U+0307, U+0300)
   in their forms data. gTTS silently drops them, producing partial audio.
   Fix: `strip_combining()` in `generate_audio.py` strips `unicodedata.category == "Mn"` chars before TTS.
2. **Wrong audio dir path**: `index.ts` had `"../data/audio"` → fixed to `"./data/audio"`
   (relative to `__dirname` which is `server/dist/` in prod, `server/src/` in dev)
3. **Build script**: original used shell glob `cp src/data/audio/*.mp3` which failed on Render.
   Replaced with `scripts/copy-data.mjs` (cross-platform Node.js fs.copyFileSync loop).
4. **Vite dev proxy**: `/audio` was not proxied to Express in dev. Added to `vite.config.ts`.

### Regenerating audio
Run from repo root (`ai-bootcamp/`):
```bash
python generate_audio.py
```
- Skips files already >= 5000 bytes
- To force-regenerate specific files: delete them first, then run the script
- To force-regenerate all verbs with combining chars in source data:
  ```python
  # delete affected files first
  python -c "
  import json, unicodedata, os
  data = json.load(open('365-verb-trainer/server/src/data/verb-examples-enriched.json', encoding='utf-8'))
  for v in data:
      if any(unicodedata.category(c)=='Mn' for f in v['forms'] for c in f):
          p = f'365-verb-trainer/server/src/data/audio/{v[\"id\"]}.mp3'
          if os.path.exists(p): os.remove(p)
  "
  python generate_audio.py
  ```

## User feedback
- Star rating (1–5) + optional comment form on the About page
- Submitted via `POST /api/feedback` (public, no auth)
- Stored in `verb_feedback` table: `id`, `rating` (1–5), `comment` (nullable), `lang`, `created_at`
- Visible in Admin page under "Feedback" section (newest first, with avg rating)

## About page
- Book credits card with cover image (authors, publisher, PDF link)
- "Made by" card — anonymous group description (IT relocants from Belarus learning Lithuanian)
- Star-rating feedback form (interactive hover, success/error states, EN/RU/LT strings)
- Non-commercial notice + copyright footer

## Admin page (`/admin`)
- Password-gated (same `ADMIN_PASSWORD` env var)
- **Sessions** section: 4 stat cards — Today / This week / This month / Total (no histogram, no accuracy)
- **Users** section: table of all users with total points + last active timestamp, sorted by points desc
  - Query uses subqueries (not a direct JOIN) to avoid row-multiplication between `verb_points` and `verb_progress`
- **Feedback** section: list of all submitted feedback entries with star display, lang badge, date, comment

## Quiz results screen
- Shows score, accuracy percentage, "New session" button
- Percentile banner ("better than X%") removed — not meaningful with small user base
- Last question feedback is shown before results — "See results →" button leads to summary screen

## Quiz modes

1. `verb_translation` — pick Russian translation from 4 choices
2. `conjugation_drill` — type a conjugated form (tense + person)
3. `main_forms` — given 1 of 3 main forms, type the other 2
4. `fill_blank` — Lithuanian sentence with a word blanked out; hint shows masked forms (`a*****, a*****, a*****`)
5. `fill_blank_hint` — same but hint shows all 3 main forms unmasked

### Answer checking (typed modes)
- Server strips diacritics/stress marks before comparing — `buti` accepted for `būti`
- **Stress marks ignored**: combining acute (U+0301) and tilde (U+0303) are stripped before the imprecise check — omitting them does NOT trigger yellow. Only real Lithuanian letters (ą č ę ė į š ų ū ž) trigger it.
- **Imprecise (yellow) state**: if the answer is correct content-wise but missing Lithuanian
  letters (e.g. `buti` instead of `būti`), the input turns yellow and shows the proper spelling
  as a soft reminder. Points awarded normally. Applies to all 3 typed modes.
- **Multi-variant cells**: subjunctive `mes`/`jus` cells contain two forms separated by ` / `
  (e.g. `abejótume / abejótumėme`) in 357/365 verbs. Either variant is accepted as correct.

### fill_blank question generation (`server/src/quiz.ts:buildFillBlankQuestion`)
Key rules enforced to produce clean questions:
- Uses word-boundary negative-lookahead/lookbehind regex (`(?<![LT_CHARS])form(?![LT_CHARS])`)
  to prevent matching a verb form inside a prefixed word (e.g. `daro` inside `atidaro`)
- Conjugation cells with multiple variants separated by `,` or `/` (e.g. `būti`'s `"esu, būnu"`)
  are split so each variant is tried individually
- Empty/whitespace-only conjugation cells are skipped (prevents empty-regex matching everywhere)
- Infinitive fallback also uses word-boundary regex (not plain `indexOf`)
- 363/365 verbs produce valid questions; `būti` and `dalyvauti` were formerly broken edge cases,
  now fixed

## Database (PostgreSQL)
- Tables: `verb_quiz_results`, `verb_progress`, `verb_points`, `verb_feedback`
- Optional — server starts without it, spaced repetition disabled
- Shared with lithuanian-vocab project on Render

## Environment variables (server)
```
PORT=3001          # 10000 on Render
DATABASE_URL=...   # PostgreSQL connection string
ADMIN_PASSWORD=... # For /admin and /edit pages
NODE_ENV=production
```

## Render build command
```
cd 365-verb-trainer/client && npm install --include=dev && ./node_modules/.bin/vite build && cd ../server && npm install --include=dev && npm run build
```
Start command: `node 365-verb-trainer/server/dist/index.js`

---

# Project 2: Lithuanian Vocab (`lithuanian-vocab/`)

## What this is
A vocabulary flashcard and quiz app for English and Russian speakers learning Lithuanian.
1,880 words across 3 dictionaries (A1–B1 levels), multiple-choice quiz with 4 options,
session scoring with percentile ranking. No spaced repetition (unlike lt-verb).

Dictionaries:
- `a1-sekmes.json` — 688 A1 words (source: "Sėkmės" / Core1000 wordlist)
- `a1-langas.json` — 827 A1 words (source: "Langas" textbook)
- `b1-verbs.json`  — 365 B1 verbs (imported from the same "365 verbs" book as lt-verb)

Each entry has: Lithuanian word, English + Russian translations, POS, gender (nouns),
semantic category, CEFR level, source.

## Repo
- GitHub: https://github.com/Iryna-Kavalchuk/lt-voc.git
- Remote name: `origin`
- Branch: `master`
- Push command: `git push origin master`

## Deployment
- Platform: Render.com
- URL: (check Render dashboard — no URL recorded yet)
- Shares the same PostgreSQL instance as lt-verb

## Project structure
```
lithuanian-vocab/
├── data/dictionary/
│   ├── schema.json          # AJV JSON Schema for all entries
│   ├── a1-sekmes.json       # 688 A1 entries
│   ├── a1-langas.json       # 827 A1 entries
│   └── b1-verbs.json        # 365 B1 verb entries
├── scripts/                 # Data import + validation scripts (Node.js ESM)
│   ├── validate-dictionary.mjs
│   ├── import-csv.mjs
│   ├── import-langas.mjs
│   ├── import-365-verbs.mjs
│   ├── reclassify.mjs
│   ├── fix-pos.mjs
│   └── fix-pos-ru.mjs
├── shared/types/
│   └── dictionary.ts        # Canonical TypeScript types shared across client/server
├── client/                  # React + Vite frontend (port 5173 in dev)
│   └── src/pages/
│       ├── Quiz.tsx          # 25-question multiple-choice quiz
│       ├── WordList.tsx      # Browsable/filterable word browser
│       └── Admin.tsx         # Password-protected stats dashboard
└── server/                  # Express backend (port 3000 in dev)
    └── src/
        ├── index.ts          # App factory, serves React in prod
        ├── routes.ts         # API endpoints
        ├── quiz.ts           # Question generation, smart distractor selection
        ├── stats.ts          # DB persistence, percentile calculation
        └── db.ts             # PostgreSQL schema (single table: quiz_results)
```

## Dev workflow
```bash
cd lithuanian-vocab/server && npm run dev   # tsx src/index.ts on port 3000
cd lithuanian-vocab/client && npm run dev   # vite on port 5173
```

## Quiz logic
- 4 options: 1 correct + 3 distractors
- Distractor priority: same category + same POS → same POS → same category → random
- `exclude` param prevents repeating words within a session
- Language toggle: `lang=en` or `lang=ru`

## Database (PostgreSQL)
- Single table: `quiz_results` (session_id, dictionary, lang, score, total, duration_s)
- Shared with lt-verb on Render
- Optional — server starts without it

## Environment variables (server)
```
PORT=3000          # 10000 on Render
DATABASE_URL=...   # PostgreSQL connection string
ADMIN_PASSWORD=... # For /admin page (via x-admin-password header)
NODE_ENV=production
```

## Known data issues
- Category naming inconsistencies: `"adjective"` vs `"adjectives"`, `"color"` vs `"colors"` etc.
- `b1-verbs.json` uses `category: "verb"` for all 365 entries (not semantic topics)
- `lng_*` IDs in `a1-langas.json` fail the validate script's extra ID-pattern check (bug in validator)
- No spaced repetition — progress is not tracked per word
