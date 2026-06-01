import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { VerbEntry } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, "data/verb-examples-enriched.json");

let _cache: VerbEntry[] | null = null;

/** Load all 365 verb entries (cached after first load). */
export function getAllVerbs(): VerbEntry[] {
  if (_cache) return _cache;
  const raw = readFileSync(DATA_FILE, "utf-8");
  _cache = JSON.parse(raw) as VerbEntry[];
  return _cache;
}

/** Get a single verb by its numeric id (1–365). */
export function getVerbById(id: number): VerbEntry | undefined {
  return getAllVerbs().find((v) => v.id === id);
}

/**
 * Overwrite one verb entry in the cache and persist the full JSON file.
 * Returns the updated entry, or null if the id was not found.
 */
export function saveVerb(updated: VerbEntry): VerbEntry | null {
  const verbs = getAllVerbs();
  const idx = verbs.findIndex((v) => v.id === updated.id);
  if (idx === -1) return null;
  verbs[idx] = updated;
  writeFileSync(DATA_FILE, JSON.stringify(verbs, null, 2), "utf-8");
  return updated;
}

/** Reset the in-memory cache — for tests. */
export function _resetCache(): void {
  _cache = null;
}
