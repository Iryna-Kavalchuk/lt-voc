/**
 * fix-pos-ru.mjs
 * Uses Russian translation endings to correct POS assignments.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const JSON_PATH = join(__dirname, "../data/dictionary/a1.json");

const entries = JSON.parse(readFileSync(JSON_PATH, "utf-8"));

// Russian verb infinitives end in -ть, -ться, -чь, -тись
function isRuVerb(ru) {
  const first = ru.split(",")[0].trim().toLowerCase();
  return /[тч]ь(ся|сь)?$/.test(first);
}

// Russian nouns — don't end in verb suffixes, adjective suffixes, or adverb suffixes
// Masculine: consonant, -й; Feminine: -а, -я, -ь; Neuter: -о, -е, -ие, -ье
function isRuNoun(ru) {
  const first = ru.split(",")[0].trim().toLowerCase();
  if (isRuVerb(first)) return false;
  // adverbs: -о (but not neuter nouns), -е, -и, specific words
  // adjectives end in -ый/-ой/-ий/-ая/-яя/-ое/-ее
  if (/[ыоие]й$|ой$|ий$|ая$|яя$|ое$|ее$/.test(first)) return false;
  // looks like a noun
  return /[а-яё]$/.test(first);
}

// Russian adjectives end in -ый, -ой, -ий, -ая, -яя, -ое, -ее, -ен, -на
function isRuAdj(ru) {
  const first = ru.split(",")[0].trim().toLowerCase();
  return /([ыо]й|ий|ая|яя|ое|ее|[её]н|[её]нный|ный|ной|ний)$/.test(first);
}

// Russian adverbs — many end in -о, -е, or are fixed forms
const RU_ADVERBS = new Set([
  "близко","далеко","здесь","там","тут","сюда","туда","когда","тогда","сейчас",
  "потом","сразу","немедленно","часто","редко","иногда","всегда","никогда",
  "обычно","ежедневно","завтра","вчера","сегодня","хорошо","плохо","очень",
  "больше","вместе","дома","прямо","направо","налево","справа","слева",
  "быстро","медленно","рано","поздно","снова","ещё","уже","тоже","также",
  "сначала","потом","наверх","вниз","вперёд","назад","около","рядом",
  "немного","немножко","чуть-чуть","слишком","довольно","почти","совсем",
]);

function isRuAdverb(ru) {
  const first = ru.split(",")[0].trim().toLowerCase();
  return RU_ADVERBS.has(first);
}

// Detect POS from Russian translation
function detectPosFromRu(ru, currentPos) {
  if (isRuVerb(ru)) return "verb";
  if (isRuAdverb(ru)) return "adverb";
  if (isRuAdj(ru)) return "adjective";
  if (isRuNoun(ru)) return "noun";
  return null; // can't determine — keep current
}

let fixed = 0;
const changes = [];

for (const e of entries) {
  // Skip words from original Core1000 data (already correct)
  if (e.source === "Core1000") continue;

  const detected = detectPosFromRu(e.translations.ru, e.pos);
  if (detected && detected !== e.pos) {
    changes.push(`${e.word}: ${e.pos} → ${detected} (ru: ${e.translations.ru})`);
    e.pos = detected;
    // Fix gender consistency
    if (detected !== "noun" && e.gender) delete e.gender;
    fixed++;
  }
}

writeFileSync(JSON_PATH, JSON.stringify(entries, null, 2), "utf-8");
console.log(`Fixed ${fixed} POS entries.\n`);
changes.slice(0, 30).forEach(c => console.log(" ", c));
if (changes.length > 30) console.log(`  ... and ${changes.length - 30} more`);

// POS distribution
const counts = {};
for (const e of entries) counts[e.pos] = (counts[e.pos] || 0) + 1;
console.log("\nPOS distribution:");
for (const [pos, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${pos.padEnd(15)} ${n}`);
}
