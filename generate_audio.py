"""
generate_audio.py
Generates one MP3 per verb (ID 1–365) speaking its 3 main forms.
Output: 365-verb-trainer/server/src/data/audio/<id>.mp3
Uses a thread pool for parallel downloads.
"""
import json
import os
import unicodedata
from gtts import gTTS
from concurrent.futures import ThreadPoolExecutor, as_completed


def strip_combining(text):
    """Remove Unicode combining diacritical marks (e.g. U+0307, U+0300)
    that gTTS cannot handle, while keeping precomposed Lithuanian letters."""
    return "".join(ch for ch in text if unicodedata.category(ch) != "Mn")

DATA_FILE = os.path.join(os.path.dirname(__file__), "365-verb-trainer", "server", "src", "data", "verb-examples-enriched.json")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "365-verb-trainer", "server", "src", "data", "audio")

os.makedirs(OUTPUT_DIR, exist_ok=True)

with open(DATA_FILE, encoding="utf-8") as f:
    verbs = json.load(f)

MIN_SIZE = 5000  # bytes — files at 2304 are empty gTTS errors; legitimate short forms can be ~6KB

def generate(verb):
    verb_id = verb["id"]
    forms = verb["forms"]
    text = strip_combining(", ".join(forms))
    out_path = os.path.join(OUTPUT_DIR, f"{verb_id}.mp3")
    if os.path.exists(out_path) and os.path.getsize(out_path) >= MIN_SIZE:
        return verb_id, "skipped"
    if os.path.exists(out_path):
        os.remove(out_path)
    try:
        tts = gTTS(text=text, lang="lt", slow=False)
        tts.save(out_path)
        return verb_id, "ok"
    except Exception as e:
        return verb_id, f"ERROR: {e}"

total = len(verbs)
done = 0
with ThreadPoolExecutor(max_workers=8) as executor:
    futures = {executor.submit(generate, v): v for v in verbs}
    for future in as_completed(futures):
        verb_id, status = future.result()
        done += 1
        print(f"[{done}/{total}] #{verb_id} {status}")

print("Done.")
