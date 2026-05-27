/**
 * import-langas.mjs
 * Converts A1_langas_zodinas.csv into data/dictionary/a1-langas.json
 * The CSV already has category and partOfSpeech columns — much cleaner than dictA1.csv.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const CSV_PATH = join(ROOT, "A1_langas_zodinas.csv");
const JSON_PATH = join(ROOT, "data/dictionary/a1-langas.json");
const SOURCE = "Langas";
const LEVEL = "A1";

// Valid POS values per shared types
const VALID_POS = new Set([
  "noun", "verb", "adjective", "adverb", "pronoun",
  "numeral", "preposition", "conjunction", "interjection", "phrase",
]);

// Normalize POS — map any CSV variants to valid values
function normalizePOS(raw) {
  const p = raw.trim().toLowerCase();
  if (VALID_POS.has(p)) return p;
  if (p === "particle") return "conjunction";
  if (p === "exclamation") return "interjection";
  return "noun"; // fallback
}

// Normalize category — clean up whitespace/newlines
function normalizeCategory(raw) {
  return raw.trim().replace(/\s+/g, " ").toLowerCase();
}

// Simple CSV parser — handles quoted fields
function parseCSV(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(Boolean);
  return lines.map((line) => {
    const fields = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === "," && !inQuote) { fields.push(cur); cur = ""; }
      else { cur += ch; }
    }
    fields.push(cur);
    return fields.map((f) => f.trim().replace(/^\uFEFF/, ""));
  });
}

// Detect gender from Lithuanian word ending
function detectGender(word) {
  const base = word.split(",")[0].trim();
  if (/ė$/.test(base) || (/a$/.test(base) && !/ia$/.test(base))) return "feminine";
  if (/as$|is$|us$|ys$|uo$/.test(base)) return "masculine";
  return undefined;
}

// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------
const csvText = readFileSync(CSV_PATH, "utf-8");
const rows = parseCSV(csvText);

// Row 0 is header: lt, en, ru, category, partOfSpeech
const dataRows = rows.slice(1);

// Track max ID per category
const maxIds = {};

const entries = [];
const skipped = [];

for (const row of dataRows) {
  if (row.length < 5) continue;

  const word = row[0].replace(/^\uFEFF/, "").trim();
  const en   = row[1].trim();
  const ru   = row[2].trim();
  const category = normalizeCategory(row[3]);
  const pos  = normalizePOS(row[4]);

  if (!word || !en || !ru || !category) { skipped.push(row[0]); continue; }

  // Assign ID — prefix with "lng" to avoid collisions with other dictionaries
  maxIds[category] = (maxIds[category] || 0) + 1;
  const id = `lng_${category}_${String(maxIds[category]).padStart(3, "0")}`;

  const entry = {
    id,
    word,
    translations: { en, ru },
    pos,
    ...(pos === "noun" ? { gender: detectGender(word) } : {}),
    category,
    level: LEVEL,
    source: SOURCE,
  };

  // Remove gender key if undefined
  if (entry.gender === undefined) delete entry.gender;

  entries.push(entry);
}

writeFileSync(JSON_PATH, JSON.stringify(entries, null, 2), "utf-8");
console.log(`Done!`);
console.log(`  Written: ${entries.length} entries to a1-langas.json`);
console.log(`  Skipped: ${skipped.length}`);

// Category summary
const cats = {};
for (const e of entries) cats[e.category] = (cats[e.category] || 0) + 1;
console.log("\nCategories:");
for (const [c, n] of Object.entries(cats).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${c.padEnd(20)} ${n}`);
}
