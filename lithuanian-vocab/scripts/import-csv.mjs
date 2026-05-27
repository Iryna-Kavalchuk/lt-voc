/**
 * import-csv.mjs
 * Parses dictA1.csv and merges new entries into data/dictionary/a1.json.
 * Usage: node scripts/import-csv.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const CSV_PATH = join(ROOT, "dictA1.csv");
const JSON_PATH = join(ROOT, "data/dictionary/a1.json");
const SOURCE = "Sekmes";
const LEVEL = "A1";

// ---------------------------------------------------------------------------
// Category heuristics — map keywords in the Lithuanian word / English gloss
// to a semantic category. Order matters: first match wins.
// ---------------------------------------------------------------------------
const CATEGORY_RULES = [
  // Food & drink
  { en: /\b(vinegar|cucumber|oil|tea|mustard|honey|sugar|garlic|salt|butter|cheese|milk|water|bread|meat|egg|sour cream|juice|jam|porridge|soup|salad|sauce|pancake|crepe|pie|pastry|doughnut|roll|sausage|sandwich|ice cream|chocolate|candy|sweet|berry|berries|raspberry|strawberry|apple|pear|grape|cherry|currant|fruit|vegetable|potato|carrot|onion|cabbage|pumpkin|tomato|beetroot|courgette|aubergine|bean|pea|dill|parsley|mint|pepper|spice|caraway|horseradish|rice|curd|fish|beef|pork|chicken|turkey|ham|drink|kvass|gira|grilled|baked|boiled|smoked|salty|sweet|sour|spicy|delicious|hungry|full|taste|breakfast|lunch|dinner|supper|canteen|bakery|restaurant|waiter|waitress|bill|receipt|dish|menu|refuel|pour|cook|fry|boil|eat|drink)\b/i, category: "food" },
  // Colors
  { en: /\b(red|blue|green|white|black|yellow|orange|purple|pink|brown|grey|gray|golden|silver|light blue|multicolour|colorful|colourful|blond|dark|light|solid.colou?red)\b/i, category: "colors" },
  // Family
  { en: /\b(mother|father|brother|sister|son|daughter|grandfather|grandmother|uncle|aunt|nephew|niece|cousin|husband|wife|man|woman|boy|girl|child|parent|relative|family|married|divorced|deceased|young man|young woman)\b/i, category: "family" },
  // Animals
  { en: /\b(cat|dog|horse|bird|fish|cow|pig|sheep|rabbit|mouse|rat|bear|wolf|fox|deer|duck|chicken|rooster)\b/i, category: "animals" },
  // Body
  { en: /\b(eye|ear|nose|mouth|tooth|head|hand|arm|leg|foot|finger|back|stomach|throat|heart|blood|body|face|skin|hair)\b/i, category: "body" },
  // Health / medical
  { en: /\b(doctor|physician|nurse|hospital|pharmacy|medicine|medication|prescription|illness|disease|patient|symptom|cough|fever|pain|hurt|ache|nausea|diarrhea|blood pressure|vaccin|recover|get better|ward|drops|spray)\b/i, category: "health" },
  // Clothes
  { en: /\b(clothes|clothing|shirt|blouse|dress|skirt|trousers|shorts|jacket|coat|sweater|jumper|sock|shoe|boot|sandal|sneaker|pump|glove|hat|cap|scarf|belt|pocket|sleeve|button|zipper|ring|earring|chain|necklace|bracelet|wallet|handbag|backpack|swimsuit|swimming trunk|trunks|waistcoat|wear|fashion|style|size|tailor|laundry|iron|dryer|leather|cotton|woollen|linen|silk|womenswear|menswear|childrenswear|old.fashioned|colourful)\b/i, category: "clothes" },
  // Transport
  { en: /\b(car|bus|train|tram|bicycle|scooter|plane|fly|drive|ride|transport|station|stop|get on|get off|arrive|leave|depart|tire|brake|steering|fuel|petrol|gas|speed|park|road|track|direction|left|right|straight|turn|navigate)\b/i, category: "transport" },
  // Home / housing
  { en: /\b(house|home|flat|apartment|room|bedroom|kitchen|bathroom|living room|corridor|ceiling|floor|wall|window|door|staircase|furniture|bed|chair|table|sofa|armchair|shelf|wardrobe|closet|mirror|lamp|rug|carpet|cellar|yard|courtyard|tap|pipe|stove|oven|kettle|fridge|dishwasher|washing machine|vacuum|tidy|clean|repair|dust|rubbish|litter|lock|unlock|open|close|key|gate)\b/i, category: "home" },
  // Education
  { en: /\b(school|university|student|teacher|lecturer|pupil|learn|study|lesson|class|course|book|textbook|notebook|exercise book|pencil|pen|eraser|paper|page|task|exercise|grade|mark|write|read|repeat|understand|know)\b/i, category: "education" },
  // Shopping
  { en: /\b(shop|store|market|buy|sell|price|cost|discount|sale|receipt|bill|pay|money|wallet|bag|bookstore|pharmacy|bakery|hairdresser|seller|salesman|saleswoman)\b/i, category: "shopping" },
  // Places / city
  { en: /\b(town|city|village|capital|square|street|bridge|church|castle|lake|sea|river|forest|mountain|station|hotel|hospital|post office|airport|park|museum|gallery|library|cafe|restaurant|bank|pharmacy|market|shop)\b/i, category: "places" },
  // Time
  { en: /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december|day|week|month|year|morning|evening|night|today|tomorrow|yesterday|hour|minute|always|never|often|sometimes|seldom|usually|everyday|then|right away|immediately|fast|slow)\b/i, category: "time" },
  // Emotions / personality
  { en: /\b(happy|sad|cheerful|angry|afraid|love|like|hate|feel|joy|happiness|sad|kind|friendly|nice|dear|beloved|interesting|boring|tired|busy|calm|noisy|fun|enjoy|wish|miss)\b/i, category: "emotions" },
  // Movement / verbs of motion
  { en: /\b(go|walk|run|jog|swim|ski|travel|arrive|leave|come|return|stand|sit|lie|get on|get off|fly|drive|ride|move|turn|stop)\b/i, category: "movement" },
  // Communication
  { en: /\b(speak|talk|say|tell|ask|answer|call|invite|write|read|listen|watch|understand|repeat|sign|send|inform|show|give|take|pass|bring|pick up|forget|remember|greet|congratulate)\b/i, category: "communication" },
  // Sports & leisure
  { en: /\b(sport|play|game|music|sing|dance|chess|draughts|fish|mushroom|holiday|vacation|rest|leisure|party|celebrate|travel|trip|journey)\b/i, category: "leisure" },
  // Work / profession
  { en: /\b(work|job|employee|employer|boss|profession|career|salary|office|meeting|task|builder|driver|singer|businessman|hairdresser|seller|waiter|doctor|teacher|lecturer|nurse|tailor|repair|handyman)\b/i, category: "work" },
];

// POS detection heuristics
function detectPOS(word, en) {
  // Lithuanian infinitives typically end in -ti or -yti and EN often contains comma-separated forms
  if (/ti,/.test(word) || /\bti$/.test(word.split(",")[0].trim())) return "verb";
  // EN starts with "be " or "have " or ends in common verb patterns
  if (/^(be|have|do|make|go|come|get|take|give|put|use|see|know|want|like|love|feel|work|live|sit|stand|lie|walk|run|swim|fly|drive|ride|speak|talk|say|tell|ask|write|read|listen|watch|understand|think|eat|drink|buy|sell|pay|clean|wash|cook|fry|boil|open|close|lock|unlock|send|call|invite|sing|dance|play|travel|study|learn|teach|repeat|show|pass|bring|pick|forget|remember|greet|wish|turn|stop|start|begin|finish|find|look|wear|dress|put on|take off|iron|vacuum|repair|fix|tidy|sign|print|reserve|rent|refuel|pour|taste|celebrate|ski|jog|fish|laugh|cry|hurry|wait|meet|visit)/i.test(en)) return "verb";
  // Adjectives — EN single word ending in common adjective suffixes
  if (/\b(ful|less|ous|ive|ish|al|ic|ed|ing|ant|ent|able|ible|ary|ory|ory|ly)\b/.test(en) && !/\s/.test(en)) {
    // be careful — adverbs also end in -ly
    if (/ly$/.test(en)) return "adverb";
    return "adjective";
  }
  // Adverbs: single short words like "here, there, far, near, today, always..."
  const adverbs = new Set(["here","there","far","near","today","tomorrow","yesterday","always","never","often","sometimes","seldom","usually","everyday","fast","slowly","together","usually","then","straight","right","left","more","very","much","always","never","often","sometimes","seldom","usually","everyday","today","tomorrow","yesterday","morning","evening","night","soon","still","already","not","also","too","again","just","now","here","there","away","back","up","down","well","badly","fine","good","bad","yes","no","maybe","perhaps","maybe","perhaps","certainly","probably","quickly","slowly","early","late","once","twice","again"]);
  if (adverbs.has(en.toLowerCase().split(",")[0].trim())) return "adverb";
  // Conjunctions
  const conjunctions = new Set(["and","but","or","because","although","if","when","while","that","so","yet","nor","a","и","но"]);
  if (conjunctions.has(en.toLowerCase().trim())) return "conjunction";
  // Prepositions
  const prepositions = new Set(["on","under","in","at","for","from","to","of","by","with","about","into","onto","until","before","after","during","over","between","near","beside","since","except for"]);
  if (prepositions.has(en.toLowerCase().trim())) return "preposition";
  // Default: noun
  return "noun";
}

function detectGender(word, pos) {
  if (pos !== "noun") return undefined;
  const base = word.split(",")[0].trim();
  // Feminine endings: -ė, -a, -tis/-tė (some), -ė
  if (/ė$/.test(base) || (/a$/.test(base) && !/ia$/.test(base))) return "feminine";
  if (/as$|is$|us$|ys$|uo$|s$/.test(base)) return "masculine";
  return undefined;
}

function detectCategory(en) {
  const text = en.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.en.test(text)) return rule.category;
  }
  return "general";
}

// Clean up Lithuanian word: strip inflection hints like ", -a" or "(io)"
function cleanWord(raw) {
  // Remove leading BOM
  raw = raw.replace(/^\uFEFF/, "");
  // Take the base form before comma
  return raw.split(",")[0].trim().replace(/^"/, "").replace(/"$/, "");
}

// Clean English: take first meaning if multiple separated by comma
function cleanEn(raw) {
  return raw.trim().replace(/^"/, "").replace(/"$/, "");
}

function cleanRu(raw) {
  return raw.trim().replace(/^"/, "").replace(/"$/, "");
}

// ---------------------------------------------------------------------------
// Parse CSV (simple — fields may be quoted)
// ---------------------------------------------------------------------------
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const rows = [];
  for (const line of lines) {
    const fields = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuote = !inQuote;
      } else if (ch === "," && !inQuote) {
        fields.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    fields.push(cur);
    rows.push(fields);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const csvText = readFileSync(CSV_PATH, "utf-8");
const rows = parseCSV(csvText);

// Skip header row
const dataRows = rows.slice(1);

// Load existing entries to detect duplicates and find max IDs per category
const existing = JSON.parse(readFileSync(JSON_PATH, "utf-8"));
const existingWords = new Set(existing.map((e) => e.word.toLowerCase()));

// Track max ID per category (across existing)
const maxIds = {};
for (const e of existing) {
  const cat = e.category;
  const num = parseInt(e.id.split("_").pop(), 10);
  if (!maxIds[cat] || num > maxIds[cat]) maxIds[cat] = num;
}

const newEntries = [];
const skipped = [];

for (const row of dataRows) {
  if (row.length < 3) continue;
  const rawWord = row[0];
  const rawEn = row[1];
  const rawRu = row[2];

  if (!rawWord || !rawEn || !rawRu) continue;

  const word = cleanWord(rawWord);
  const en = cleanEn(rawEn);
  const ru = cleanRu(rawRu);

  if (!word || !en || !ru) continue;

  // Skip duplicates
  if (existingWords.has(word.toLowerCase())) {
    skipped.push(word);
    continue;
  }

  const pos = detectPOS(rawWord, en);
  const gender = detectGender(word, pos);
  const category = detectCategory(en);

  // Assign ID
  maxIds[category] = (maxIds[category] || 0) + 1;
  const id = `lt_${category}_${String(maxIds[category]).padStart(3, "0")}`;

  const entry = {
    id,
    word,
    translations: { en, ru },
    pos,
    ...(gender ? { gender } : {}),
    category,
    level: LEVEL,
    source: SOURCE,
  };

  newEntries.push(entry);
  existingWords.add(word.toLowerCase());
}

// Merge and write
const merged = [...existing, ...newEntries];
writeFileSync(JSON_PATH, JSON.stringify(merged, null, 2), "utf-8");

console.log(`Done!`);
console.log(`  Added:   ${newEntries.length} new entries`);
console.log(`  Skipped: ${skipped.length} duplicates (${skipped.slice(0, 10).join(", ")}${skipped.length > 10 ? "..." : ""})`);
console.log(`  Total:   ${merged.length} entries in a1.json`);
