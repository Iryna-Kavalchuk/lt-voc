/**
 * fix-pos.mjs
 * Fixes wrong POS assignments introduced by the import heuristic.
 * Uses English translation patterns to determine correct POS.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const JSON_PATH = join(__dirname, "../data/dictionary/a1.json");

const entries = JSON.parse(readFileSync(JSON_PATH, "utf-8"));

// Known verb infinitive patterns in English
const VERB_PATTERNS = [
  /^(be|have|do|make|go|come|get|take|give|put|use|see|know|want|like|love|feel|work|live|sit|stand|lie|walk|run|swim|fly|drive|speak|talk|say|tell|ask|write|read|listen|watch|understand|think|eat|drink|buy|sell|pay|clean|wash|cook|fry|boil|open|close|lock|unlock|send|call|invite|sing|dance|play|travel|study|learn|teach|repeat|show|pass|bring|pick|forget|remember|greet|wish|lend|change|taste|refuel|pour|hem|shorten|sew|switch|carry|vomit|nauseate|cough|recover|vaccinate|hurry|rush|wait|meet|visit|wear|dress|start|begin|finish|find|look|turn|stop|arrive|leave|return|sleep|sit|stand|lie|rest|jog|ski|fish|pick|gather|reserve|rent|iron|vacuum|celebrate|congratulate|tidy|sign|print|reserve|rent|repair|fix|register|inform|lend|borrow|refuel|pour|hem|shorten|sew|unlock|carry|vomit|cough|recover|hurry|rush|invite|wish|lend|change|taste)\b/i,
  /^(to |go |do |be |have |make |get |take |give |put |come |see |know |want |like |love |feel |work |live |sit |stand |lie |walk |run |swim |fly |drive |speak |talk |say |tell |ask |write |read |listen |watch |understand |think |eat |drink |buy |sell |pay |clean |wash |cook |fry |boil |open |close |lock |send |call |sing |dance |play |travel |study |learn |teach |show |bring |forget |remember |greet |wish |lend |change |taste |sleep |rest |jog |ski |fish |repair |fix |tidy )/i,
];

// Known adjective patterns
const ADJ_PATTERNS = [
  /^(big|small|large|little|good|bad|new|old|young|hot|cold|warm|cool|fast|slow|long|short|tall|high|low|wide|narrow|fat|thin|rich|poor|happy|sad|angry|beautiful|ugly|clean|dirty|fresh|stale|sweet|sour|salty|spicy|soft|hard|heavy|light|dark|bright|expensive|cheap|free|busy|tired|healthy|sick|strong|weak|full|empty|open|closed|right|wrong|easy|difficult|interesting|boring|friendly|kind|nice|dear|beloved|mild|comfortable|fashionable|modern|cosy|available|occupied|paid|normal|colourful|wooden|cotton|woollen|leather|silver|golden|multicolour|solid|old.fashioned|tight|worn|smoked|boiled|fried|baked|grilled|raw|divorced|married|deceased|honourable|noisy|tidy|quick|slow|careful|loud|quiet)\b/i,
  /.*(ful|less|ous|ive|ish|al|ic|ant|ent|able|ible|ary|ory)$/ ,
];

// Known adverb patterns
const ADV_PATTERNS = [
  /^(here|there|far|near|today|tomorrow|yesterday|always|never|often|sometimes|seldom|usually|everyday|fast|slowly|together|then|straight|more|very|much|not|also|too|again|just|now|away|back|up|down|well|badly|fine|good|bad|yes|no|maybe|certainly|probably|quickly|early|late|once|twice|a little|a bit|right away|immediately|soon|still|already|on the right|on the left|to the right|to the left|how|about|from|since|before|after|during|for|under|on|in|at|until|except for)\b/i,
];

// Known conjunction/pronoun patterns
const CONJ_SET = new Set(["and", "but", "or", "a", "и", "но", "yes", "no", "not to be"]);
const PRON_SET = new Set(["this", "that", "these", "those"]);

function detectPOS(en) {
  const t = en.toLowerCase().trim();

  if (CONJ_SET.has(t)) return "conjunction";
  if (PRON_SET.has(t)) return "pronoun";

  // Prepositions
  if (/^(on|under|in|at|for|from|to|of|by|with|about|into|onto|until|before|after|during|over|between|near|beside|since|except for|from, since)$/.test(t)) return "preposition";

  // Adverbs
  for (const p of ADV_PATTERNS) if (p.test(t)) return "adverb";

  // Verbs — check if the base English translation looks like a verb infinitive
  for (const p of VERB_PATTERNS) if (p.test(t)) return "verb";

  // Adjectives
  for (const p of ADJ_PATTERNS) if (p.test(t)) return "adjective";

  // Default: noun
  return "noun";
}

function detectGender(word, pos) {
  if (pos !== "noun") return undefined;
  const base = word.split(",")[0].trim();
  if (/ė$/.test(base) || (/a$/.test(base) && !/ia$/.test(base))) return "feminine";
  if (/as$|is$|us$|ys$|uo$/.test(base)) return "masculine";
  return undefined;
}

// Manual overrides for tricky cases
const MANUAL_POS = {
  "būti": "verb", "nebūti": "verb", "eiti": "verb", "kalbėti": "verb",
  "valgyti": "verb", "gerti": "verb", "mylėti": "verb", "daryti": "verb",
  "mėgti": "verb", "norėti": "verb", "turėti": "verb", "gyventi": "verb",
  "dirbti": "verb", "mokytis": "verb", "studijuoti": "verb", "važiuoti": "verb",
  "apsipirkti": "verb", "atvažiuoti": "verb", "dovanoti": "verb",
  "grybauti": "verb", "ieškoti": "verb", "įjungti": "verb", "išjungti": "verb",
  "išplauti": "verb", "išsinuomoti": "verb", "išspausdinti": "verb",
  "nuomoti": "verb", "nuplauti": "verb", "nuvalyti": "verb",
  "padaryti": "verb", "pakeisti": "verb", "palaukti": "verb",
  "papildyti": "verb", "pasiskiepyti": "verb", "paskolinti": "verb",
  "pasimatuoti": "verb", "pasisiūti": "verb", "patikti": "verb",
  "pradėti": "verb", "prasidėti": "verb", "reikėti": "verb",
  "rezervuoti": "verb", "skalbti": "verb", "sportuoti": "verb",
  "suprasti": "verb", "susitikti": "verb", "tikti": "verb",
  "trūkti": "verb", "vėluoti": "verb", "baigti": "verb",
  "gauti": "verb", "skubėti": "verb", "miegoti": "verb",
  "sveikinti": "verb", "sirgti": "verb", "vemti": "verb",
  "pykinti": "verb", "peršalti": "verb",
  // Nouns wrongly marked as verb
  "bendrabutis": "noun", "burokėlis": "noun", "jautiena": "noun",
  "padavėjas": "noun", "pardavėjas": "noun", "pupelės": "noun",
  "spurga": "noun", "uogos": "noun", "virtas": "adjective",
  "auksinis": "adjective", "dainininkas": "noun", "darbovietė": "noun",
  "diržas": "noun", "durys": "noun", "dušas": "noun",
  // Adjectives
  "gražus": "adjective", "įdomus": "adjective", "malonus": "adjective",
  "linksmas": "adjective", "liūdnas": "adjective", "draugiškas": "adjective",
  "jaunas": "adjective", "jaunesnis": "adjective", "jauniausias": "adjective",
  "senas": "adjective", "aukštas": "adjective", "žemas": "adjective",
  "didelis": "adjective", "mažas": "adjective", "karštas": "adjective",
  "šaltas": "adjective", "šiltas": "adjective", "švelnus": "adjective",
  "puikus": "adjective", "brangus": "adjective", "pigus": "adjective",
  "naujas": "adjective", "riebus": "adjective", "šviežias": "adjective",
  "skanus": "adjective", "saldus": "adjective", "rūgštus": "adjective",
  "sūrus": "adjective", "aštrus": "adjective", "sotus": "adjective",
  "keptas": "adjective", "rūkytas": "adjective", "virtas": "adjective",
  "ilgas": "adjective", "trumpas": "adjective", "platus": "adjective",
  "siauras": "adjective", "minkštas": "adjective", "patogus": "adjective",
  "jaukus": "adjective", "madingas": "adjective", "naujas": "adjective",
  "nemokamas": "adjective", "mokamas": "adjective", "nešvarus": "adjective",
  "normalus": "adjective", "laisvas": "adjective", "kitas": "adjective",
  "vidurinis": "adjective", "vyresnis": "adjective", "vyriausias": "adjective",
  "senamadiškas": "adjective", "tvarkingas": "adjective", "vasarinis": "adjective",
  "žieminis": "adjective", "medinis": "adjective", "medvilninis": "adjective",
  "vilnonis": "adjective", "odinis": "adjective", "sidabrinis": "adjective",
  "auksinis": "adjective", "spalvingas": "adjective", "vienspalvis": "adjective",
  "margas": "adjective", "šviesus": "adjective", "tamsus": "adjective",
  "rudas": "adjective", "rausvas": "adjective", "oranžinis": "adjective",
  "violetinis": "adjective", "žydras": "adjective", "geltonas": "adjective",
  "sveikas": "adjective", "pavargęs": "adjective", "užimtas": "adjective",
  "laimingas": "adjective", "mielas": "adjective", "mylimas": "adjective",
  "gerbiamas": "adjective", "greitas": "adjective", "lėtas": "adjective",
  "triukšmingas": "adjective", "ramus": "adjective", "draudžiama": "adjective",
  "galima": "adjective",
  // Adverbs
  "blogai": "adverb", "gerai": "adverb", "čia": "adverb", "arti": "adverb",
  "toli": "adverb", "kartu": "adverb", "labai": "adverb", "labiau": "adverb",
  "truputį": "adverb", "kaip": "adverb", "tiesiai": "adverb",
  // Conjunctions
  "ir": "conjunction", "bet": "conjunction", "o": "conjunction",
  "ne": "conjunction", "taip": "conjunction",
  // Prepositions
  "ant": "preposition", "apie": "preposition", "iki": "preposition",
  "nuo": "preposition", "per": "preposition", "prieš": "preposition",
  "už": "preposition", "išskyrus ką?": "preposition", "po": "preposition",
  // Pronouns
  "šis": "pronoun", "ši": "pronoun", "šie": "pronoun", "šios": "pronoun",
  "tas": "pronoun", "ta": "pronoun", "tie": "pronoun", "tos": "pronoun",
};

let fixed = 0;
let genderFixed = 0;

for (const e of entries) {
  const correctPOS = MANUAL_POS[e.word] ?? detectPOS(e.translations.en);
  if (e.pos !== correctPOS) {
    e.pos = correctPOS;
    fixed++;
  }
  // Fix gender: remove from non-nouns, add to nouns if missing
  if (e.pos !== "noun" && e.gender) {
    delete e.gender;
    genderFixed++;
  } else if (e.pos === "noun" && !e.gender) {
    const g = detectGender(e.word, "noun");
    if (g) { e.gender = g; genderFixed++; }
  }
}

writeFileSync(JSON_PATH, JSON.stringify(entries, null, 2), "utf-8");
console.log(`Fixed POS: ${fixed}, Fixed gender: ${genderFixed}`);

// Summary
const counts = {};
for (const e of entries) counts[e.pos] = (counts[e.pos] || 0) + 1;
console.log("\nPOS distribution:");
for (const [pos, n] of Object.entries(counts).sort((a,b) => b[1]-a[1])) {
  console.log(`  ${pos.padEnd(15)} ${n}`);
}
