import Ajv from "ajv";
import addFormats from "ajv-formats";
import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, "../data/dictionary");

// ── Load schema ──────────────────────────────────────────────────────────────
const schema = JSON.parse(
  readFileSync(resolve(dataDir, "schema.json"), "utf8")
);

// ── Set up AJV ───────────────────────────────────────────────────────────────
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);

// ── Collect all dictionary files (exclude schema.json) ───────────────────────
const dictFiles = readdirSync(dataDir).filter(
  (f) => f.endsWith(".json") && f !== "schema.json"
);

if (dictFiles.length === 0) {
  console.error("No dictionary files found in", dataDir);
  process.exit(1);
}

// ── Validation state ─────────────────────────────────────────────────────────
let totalWords = 0;
let totalErrors = 0;
const seenIds = new Map(); // id -> filename

// ── Checks beyond JSON Schema ─────────────────────────────────────────────────
function extraChecks(entry, filename, index) {
  const issues = [];

  // 1. ID uniqueness across all files
  if (seenIds.has(entry.id)) {
    issues.push(
      `Duplicate id "${entry.id}" — also found in ${seenIds.get(entry.id)}`
    );
  } else {
    seenIds.set(entry.id, filename);
  }

  // 2. ID pattern: lt_<something>
  if (!/^lt_[a-z0-9_]+$/.test(entry.id)) {
    issues.push(`id "${entry.id}" does not match pattern lt_[a-z0-9_]+`);
  }

  // 3. Translations must not be empty strings
  for (const [lang, value] of Object.entries(entry.translations ?? {})) {
    if (typeof value === "string" && value.trim() === "") {
      issues.push(`translations.${lang} is an empty string`);
    }
  }

  // 4. Word must not be empty
  if (typeof entry.word === "string" && entry.word.trim() === "") {
    issues.push(`word is an empty string`);
  }

  // 5. gender should only appear on nouns
  if (entry.gender && entry.pos !== "noun") {
    issues.push(
      `gender "${entry.gender}" is set but pos is "${entry.pos}" (gender is only meaningful for nouns)`
    );
  }

  return issues;
}

// ── Run validation ────────────────────────────────────────────────────────────
console.log("Dictionary validation\n" + "=".repeat(50));

for (const filename of dictFiles) {
  const filePath = resolve(dataDir, filename);
  let entries;

  try {
    entries = JSON.parse(readFileSync(filePath, "utf8"));
  } catch (e) {
    console.error(`\n[FAIL] ${filename}: invalid JSON — ${e.message}`);
    totalErrors++;
    continue;
  }

  if (!Array.isArray(entries)) {
    console.error(`\n[FAIL] ${filename}: root element must be a JSON array`);
    totalErrors++;
    continue;
  }

  let fileErrors = 0;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const label = entry.id ?? `index ${i}`;
    const errors = [];

    // Schema validation
    const valid = validate(entry);
    if (!valid) {
      for (const err of validate.errors) {
        errors.push(`${err.instancePath || "(root)"} ${err.message}`);
      }
    }

    // Extra business-logic checks
    errors.push(...extraChecks(entry, filename, i));

    if (errors.length > 0) {
      if (fileErrors === 0) console.log(`\n[FAIL] ${filename}`);
      console.log(`  Entry "${label}":`);
      for (const e of errors) console.log(`    - ${e}`);
      fileErrors += errors.length;
      totalErrors += errors.length;
    }
  }

  totalWords += entries.length;

  if (fileErrors === 0) {
    console.log(`[PASS] ${filename} — ${entries.length} entries`);
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log("\n" + "=".repeat(50));
console.log(`Files checked : ${dictFiles.length}`);
console.log(`Total words   : ${totalWords}`);
console.log(`Total errors  : ${totalErrors}`);
console.log("=".repeat(50));

if (totalErrors > 0) {
  console.error("\nValidation FAILED.");
  process.exit(1);
} else {
  console.log("\nAll entries are valid.");
  process.exit(0);
}
