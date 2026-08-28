import assert from "node:assert/strict";
import { NUM_CP014_PERMANENT_QL_IDS } from "../permanent-allocation.ts";
import { generateNumCp014LocalizedV2 } from "./runtime-v2.ts";

const DEVANAGARI_LETTER = /[\u0904-\u0939\u0950-\u0961\u0971-\u097F]/u;
const GURMUKHI_LETTER = /[\u0A05-\u0A39\u0A59-\u0A5E]/u;
const ENGLISH_INSTRUCTION = /\b(?:Find|integer|divisible|perfect|remainder|answer|candidate|condition|solution|greatest|least|validity|prime|square|cube|HCF)\b/iu;

function visibleText(q: ReturnType<typeof generateNumCp014LocalizedV2>) {
  return [
    q.stem,
    ...q.explanation.fullDerivation,
    ...q.explanation.examShortcut,
    ...(q.representationPayload ?? []),
  ].join("\n");
}
function countMatches(text: string, regex: RegExp) {
  const flags = regex.flags.includes("g") ? regex.flags : `${regex.flags}g`;
  return [...text.matchAll(new RegExp(regex.source, flags))].length;
}

let samples = 0;
const sourceCoverage: Record<string, Set<string>> = { hi: new Set(), pa: new Set() };
for (const language of ["hi", "pa"] as const) {
  for (const qlId of NUM_CP014_PERMANENT_QL_IDS) {
    for (let seed = 1; seed <= 35; seed += 1) {
      const q = generateNumCp014LocalizedV2(qlId, seed, language);
      const text = visibleText(q);
      samples += 1;
      sourceCoverage[language]!.add(q.sourcePrototypeId);

      assert.ok(q.stem.length >= 35, `${qlId}/${seed}/${language}: localized stem too thin`);
      assert.ok(q.explanation.fullDerivation.length >= 5, `${qlId}/${seed}/${language}: derivation too thin`);
      assert.ok(q.explanation.examShortcut.length >= 2, `${qlId}/${seed}/${language}: shortcut too thin`);
      assert.ok(!ENGLISH_INSTRUCTION.test(text), `${qlId}/${seed}/${language}: English instructional leakage: ${text}`);
      assert.ok(!text.includes("(HCF)"), `${qlId}/${seed}/${language}: Latin HCF label leaked`);

      if (language === "hi") {
        assert.ok(countMatches(text, DEVANAGARI_LETTER) >= 45, `${qlId}/${seed}: Hindi native-script density too low`);
        assert.ok(!GURMUKHI_LETTER.test(text), `${qlId}/${seed}: Gurmukhi leaked into Hindi`);
        assert.ok(/(?:ज्ञात कीजिए|बताइए|लिखिए)/u.test(q.stem), `${qlId}/${seed}: Hindi question directive missing`);
        assert.ok(q.explanation.fullDerivation.at(-1)?.includes("सही उत्तर"), `${qlId}/${seed}: Hindi conclusion missing`);
        assert.ok(q.explanation.examShortcut[0]?.includes("तेज़ विधि"), `${qlId}/${seed}: Hindi shortcut label missing`);
      } else {
        assert.ok(countMatches(text, GURMUKHI_LETTER) >= 45, `${qlId}/${seed}: Punjabi native-script density too low`);
        assert.ok(!DEVANAGARI_LETTER.test(text), `${qlId}/${seed}: Devanagari letters leaked into Punjabi`);
        assert.ok(/(?:ਪਤਾ ਕਰੋ|ਦੱਸੋ|ਲਿਖੋ)/u.test(q.stem), `${qlId}/${seed}: Punjabi question directive missing`);
        assert.ok(q.explanation.fullDerivation.at(-1)?.includes("ਸਹੀ ਉੱਤਰ"), `${qlId}/${seed}: Punjabi conclusion missing`);
        assert.ok(q.explanation.examShortcut[0]?.includes("ਤੇਜ਼ ਤਰੀਕਾ"), `${qlId}/${seed}: Punjabi shortcut label missing`);
      }
    }
  }
}

assert.equal(sourceCoverage.hi.size, 20, "Hindi human-quality corpus does not cover all 20 prototypes");
assert.equal(sourceCoverage.pa.size, 20, "Punjabi human-quality corpus does not cover all 20 prototypes");

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_LOCALIZATION_HUMAN_QUALITY",
  samples,
  hindiPrototypeCoverage: sourceCoverage.hi.size,
  punjabiPrototypeCoverage: sourceCoverage.pa.size,
  nativeScriptDensityChecked: true,
  crossScriptLeakageRejected: true,
  englishInstructionLeakageRejected: true,
  fullDerivationAndShortcutChecked: true,
}, null, 2));
