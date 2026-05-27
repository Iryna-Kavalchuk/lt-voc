import { readdirSync, readFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  DictionaryEntry,
  CEFRLevel,
} from "../../shared/types/dictionary.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../../data/dictionary");

// ---------------------------------------------------------------------------
// Dictionary metadata
// ---------------------------------------------------------------------------
export interface DictionaryMeta {
  id: string;       // filename without .json, e.g. "a1-sekmes"
  name: string;     // human-readable label derived from filename, e.g. "A1 Sekmes"
  file: string;     // full path to the JSON file
}

function fileToName(filename: string): string {
  // "a1-sekmes.json" → "A1 Sekmes"
  return basename(filename, ".json")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getDictionaries(): DictionaryMeta[] {
  return readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json") && f !== "schema.json")
    .sort()
    .map((f) => ({
      id: basename(f, ".json"),
      name: fileToName(f),
      file: join(DATA_DIR, f),
    }));
}

// ---------------------------------------------------------------------------
// Per-dictionary entry cache
// ---------------------------------------------------------------------------
const _cache = new Map<string, DictionaryEntry[]>();

function loadDictionary(id: string): DictionaryEntry[] {
  if (_cache.has(id)) return _cache.get(id)!;

  const dicts = getDictionaries();
  const meta = dicts.find((d) => d.id === id);
  if (!meta) throw new Error(`Dictionary not found: ${id}`);

  const raw = readFileSync(meta.file, "utf-8");
  const entries = JSON.parse(raw) as DictionaryEntry[];
  _cache.set(id, entries);
  return entries;
}

/** Load all entries from all dictionaries (merged). */
export function getAllEntries(dictionaryId?: string): DictionaryEntry[] {
  if (dictionaryId) return loadDictionary(dictionaryId);

  // Merge all dictionaries
  const allId = "__all__";
  if (_cache.has(allId)) return _cache.get(allId)!;

  const all: DictionaryEntry[] = [];
  for (const dict of getDictionaries()) {
    all.push(...loadDictionary(dict.id));
  }
  _cache.set(allId, all);
  return all;
}

export function getEntriesByLevel(level: CEFRLevel, dictionaryId?: string): DictionaryEntry[] {
  return getAllEntries(dictionaryId).filter((e) => e.level === level);
}

export function getEntriesByCategory(category: string, dictionaryId?: string): DictionaryEntry[] {
  return getAllEntries(dictionaryId).filter((e) => e.category === category);
}

export function getEntryById(id: string, dictionaryId?: string): DictionaryEntry | undefined {
  return getAllEntries(dictionaryId).find((e) => e.id === id);
}

export function getCategories(dictionaryId?: string): string[] {
  return [...new Set(getAllEntries(dictionaryId).map((e) => e.category))].sort();
}

export function getLevels(dictionaryId?: string): CEFRLevel[] {
  const order: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const present = new Set(getAllEntries(dictionaryId).map((e) => e.level));
  return order.filter((l) => present.has(l));
}

/** Reset the in-memory cache — useful in tests. */
export function _resetCache(): void {
  _cache.clear();
}
