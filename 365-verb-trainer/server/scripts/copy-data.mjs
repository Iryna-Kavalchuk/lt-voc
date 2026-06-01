/**
 * Cross-platform post-build script: copies data files into dist/.
 * Replaces the shell glob `cp src/data/audio/*.mp3 dist/data/audio/`
 * which is fragile on Windows and can fail on Linux with too many args.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const srcData = path.join(root, "src", "data");
const dstData = path.join(root, "dist", "data");
const dstAudio = path.join(dstData, "audio");

fs.mkdirSync(dstAudio, { recursive: true });

// Copy verb JSON
fs.copyFileSync(
  path.join(srcData, "verb-examples-enriched.json"),
  path.join(dstData, "verb-examples-enriched.json")
);
console.log("Copied verb-examples-enriched.json");

// Copy all MP3s
const mp3s = fs.readdirSync(path.join(srcData, "audio")).filter(f => f.endsWith(".mp3"));
for (const f of mp3s) {
  fs.copyFileSync(path.join(srcData, "audio", f), path.join(dstAudio, f));
}
console.log(`Copied ${mp3s.length} MP3 files to dist/data/audio/`);
