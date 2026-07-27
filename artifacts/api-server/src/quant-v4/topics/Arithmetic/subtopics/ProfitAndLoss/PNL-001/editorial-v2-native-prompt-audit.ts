import assert from "node:assert/strict";
import { buildAllNormalizedMultilingualEditorialLibraries } from "./foundation";

const libraries = buildAllNormalizedMultilingualEditorialLibraries();
const HindiFragments = new Set([
  "ज्ञात कीजिए।",
  "बताइए।",
  "चुनिए।",
  "निर्धारित कीजिए।",
  "तय कीजिए।",
  "सही उत्तर चुनिए।",
]);
const PunjabiFragments = new Set([
  "ਪਤਾ ਕਰੋ।",
  "ਦੱਸੋ।",
  "ਚੁਣੋ।",
  "ਨਿਰਧਾਰਤ ਕਰੋ।",
  "ਸਹੀ ਉੱਤਰ ਚੁਣੋ।",
]);

const failures: string[] = [];
for (const library of libraries) {
  for (const [qlId, entry] of Object.entries(library.entries)) {
    const prompt = entry.stem.prompt.trim();
    const fragments = library.language === "hi" ? HindiFragments : PunjabiFragments;
    const wordCount = prompt.split(/\s+/u).filter(Boolean).length;
    if (fragments.has(prompt)) failures.push(`${qlId}:${library.language}:fragment:${prompt}`);
    if (wordCount < 3) failures.push(`${qlId}:${library.language}:too-short:${prompt}`);
    if (!/[।?]$/u.test(prompt)) failures.push(`${qlId}:${library.language}:punctuation:${prompt}`);
    if (/^(लाभ प्रतिशत|हानि प्रतिशत|हुई हानि|प्राप्त लाभ|ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ|ਹਾਨੀ ਪ੍ਰਤੀਸ਼ਤ)\s*$/u.test(prompt)) {
      failures.push(`${qlId}:${library.language}:incomplete-noun-phrase:${prompt}`);
    }
  }
}

assert.deepEqual(failures, [], `Native prompt-quality failures:\n${failures.join("\n")}`);
console.log(JSON.stringify({
  ok: true,
  promptsChecked: libraries.reduce((total, library) => total + library.entryCount, 0),
  failures,
}, null, 2));
