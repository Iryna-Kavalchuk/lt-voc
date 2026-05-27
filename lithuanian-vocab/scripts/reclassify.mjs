/**
 * reclassify.mjs
 * Manually reclassifies words stuck in "general" into proper categories.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const JSON_PATH = join(__dirname, "../data/dictionary/a1.json");

// word -> correct category
const REMAP = {
  // food
  "avietės": "food", "blynai": "food", "blynelis": "food", "braškės": "food",
  "būti": "general", // keep as general - it's a basic verb
  "daryti": "communication", "daržovės": "food", "dešrelės": "food",
  "gabaliukas; gabalėlis": "food", "kiaušinienė": "food", "pupelės": "food",
  "riešutai": "food", "riebus": "food", "saldumynai": "food", "serbentai": "food",
  "šakotis": "food", "šviežias": "food", "vynuogės": "food", "vyšnios": "food",
  "žirniai": "food",

  // family / people
  "anūkas": "family", "draugas": "family", "giminės": "family", "kaimynas": "family",
  "mokinys": "family", "ponas": "family", "ponia": "family", "tėtis": "family",
  "tėvai": "family", "svečias": "family", "žmogus": "family", "vaikinas": "family",
  "mergina": "family",

  // adjectives / descriptions
  "aukštas": "adjectives", "didelis": "adjectives", "gražus": "adjectives",
  "jaunas": "adjectives", "jaunesnis": "adjectives", "jauniausias": "adjectives",
  "karštas": "adjectives", "mažas": "adjectives", "puikus": "adjectives",
  "šaltas": "adjectives", "šiltas": "adjectives", "švelnus": "adjectives",
  "vidurinis": "adjectives", "vyresnis": "adjectives", "vyriausias": "adjectives",
  "žemas": "adjectives", "brangus": "adjectives", "ilgas": "adjectives",
  "jaukus": "adjectives", "kitas": "adjectives", "laisvas": "adjectives",
  "madingas": "adjectives", "minkštas": "adjectives", "mokamas": "adjectives",
  "naujas": "adjectives", "nemokamas": "adjectives", "nešvarus": "adjectives",
  "normalus": "adjectives", "patogus": "adjectives", "pigus": "adjectives",
  "platus": "adjectives", "senas": "adjectives", "senamadiškas": "adjectives",
  "siauras": "adjectives", "sveikas": "adjectives", "trumpas": "adjectives",
  "tvarkingas": "adjectives", "užimtas": "adjectives", "vasarinis": "adjectives",
  "žieminis": "adjectives", "gerbiamas": "adjectives", "draudžiama": "adjectives",
  "galima": "adjectives",

  // adverbs
  "arti": "adverbs", "blogai": "adverbs", "čia": "adverbs", "gerai": "adverbs",
  "kartu": "adverbs", "labai": "adverbs", "labiau": "adverbs", "toli": "adverbs",
  "truputį": "adverbs", "kaip": "adverbs", "iki": "adverbs", "nuo": "adverbs",
  "per": "adverbs", "prieš": "adverbs", "ant": "adverbs", "apie": "adverbs",
  "už": "adverbs", "tiesiai": "adverbs",

  // pronouns / determiners
  "šie": "pronouns", "šis": "pronouns", "tas": "pronouns", "tie": "pronouns",
  "ne": "pronouns", "taip": "pronouns", "o": "pronouns", "ir": "pronouns",
  "bet": "pronouns",

  // body / health
  "amžius": "body", "akiniai": "body", "auskarai": "body",
  "pilvas": "body", "skėtis": "general",

  // clothes
  "avalynė": "clothes", "basutės": "clothes", "batai": "clothes",
  "bateliai": "clothes", "kojinės": "clothes", "pirštinės": "clothes",
  "sportbačiai": "clothes", "šukos": "clothes",
  "apsiauti": "clothes", "pasisiūti": "clothes", "pasimatuoti": "clothes",
  "patrumpinti": "clothes", "palenkti": "clothes",

  // home
  "bendrabutis": "home", "daiktai": "home", "dėmė": "home",
  "dušas": "home", "eilė": "home", "indai": "home", "įsiūti": "home",
  "išplauti": "home", "laiptinė": "home", "patalynė": "home",
  "purvas": "home", "rakteliai": "home", "salė": "home",
  "stabdžiai": "transport", "tepalai": "transport", "padangos": "transport",
  "valykla": "home", "valymas": "home", "valytuvai": "transport",
  "vartai": "home", "nuplauti": "home", "nuvalyti": "home",
  "skalbti": "home", "išjungti": "home", "įjungti": "home",

  // transport
  "tvarkaraštis": "transport",

  // education / work
  "dailė": "education", "darbovietė": "work", "klausimas": "education",
  "mokestis": "work", "mokyti": "education", "parašas": "work",
  "uzrašyti": "work", "užrašyti": "work",

  // health
  "pasiskiepyti": "health", "peršalti": "health", "pykinti": "health",
  "sirgti": "health", "sveikata": "health", "vemti": "health",

  // communication / social
  "atvirukas": "communication", "dovana": "communication",
  "gimtadienis": "communication", "kalba": "communication",
  "paskolinti": "communication", "pavardė": "communication",
  "vardas": "communication",

  // shopping
  "išsinuomoti": "shopping", "nuomoti": "shopping", "papildyti": "shopping",
  "paėmimas": "shopping", "pakeisti": "shopping", "rezervuoti": "shopping",
  "išspausdinti": "work",

  // leisure / culture
  "eglė": "leisure", "Kalėdos": "leisure", "Kūčios": "leisure",
  "Velykos": "leisure", "grybauti": "leisure", "žvakė": "leisure",
  "žvakutė": "leisure", "paveikslas": "leisure", "sėkmė": "leisure",
  "kalnai": "places",

  // time / seasons
  "pavasaris": "time", "ruduo": "time", "vasara": "time", "žiema": "time",
  "para": "time", "savaitgalis": "time",

  // movement / actions
  "baigti": "movement", "gauti": "communication", "gyventi": "movement",
  "ieškoti": "communication", "įdėti": "movement", "miegoti": "movement",
  "norėti": "emotions", "padaryti": "movement", "palaukti": "movement",
  "pradėti": "movement", "prasidėti": "movement", "reikėti": "emotions",
  "skubėti": "movement", "susitikti": "communication", "turėti": "movement",
  "vėluoti": "movement", "trūkti": "movement",

  // general leftovers
  "pusė": "general", "šimtas": "general", "tūkstantis": "general",
  "arti": "adverbs", "blogai": "adverbs", "half": "general",
  "tikti": "clothes", "vieta": "places", "laisvalaikis": "leisure",
  "svečias": "family", "uzimtas": "adjectives",
};

const entries = JSON.parse(readFileSync(JSON_PATH, "utf-8"));
let changed = 0;

for (const e of entries) {
  const newCat = REMAP[e.word];
  if (newCat && e.category !== newCat) {
    e.category = newCat;
    changed++;
  }
}

writeFileSync(JSON_PATH, JSON.stringify(entries, null, 2), "utf-8");
console.log(`Reclassified ${changed} entries.`);
