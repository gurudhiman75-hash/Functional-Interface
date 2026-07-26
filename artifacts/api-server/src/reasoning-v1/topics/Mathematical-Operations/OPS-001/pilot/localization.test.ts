import assert from "node:assert/strict";
import {
  OPS_REPRESENTATIVE_PILOT_IDS,
  generateOpsRepresentativePilot,
} from "./representative-pilots";
import { localizeOpsPilotQuestion } from "./localization";

const forbiddenEnglishInstruction = /\b(?:Which|If|Given|select|evaluate|Interchange|operator|operators|digits|numbers|must|correct|true)\b/i;
let localizedCount = 0;
let maxStemLength = 0;

for (const candidateId of OPS_REPRESENTATIVE_PILOT_IDS) {
  for (let seed = 0; seed < 50; seed += 1) {
    const english = generateOpsRepresentativePilot(candidateId, seed);
    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const localized = localizeOpsPilotQuestion(english, locale);
      const repeated = localizeOpsPilotQuestion(english, locale);
      assert.deepEqual(localized, repeated);
      assert.equal(localized.locale, locale);
      assert.equal(localized.candidateId, english.candidateId);
      assert.equal(localized.checkpointId, english.checkpointId);
      assert.equal(localized.seed, english.seed);
      assert.equal(localized.answer, english.answer);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.deepEqual(localized.options, english.options);
      assert.deepEqual(localized.proof, english.proof);
      assert.deepEqual(localized.metadata, english.metadata);
      assert.deepEqual(
        localized.explanation.steps.map((step) => step.expression),
        english.explanation.steps.map((step) => step.expression),
      );
      assert.ok(locale === "hi-IN" ? /[\u0900-\u097F]/.test(localized.stem) : /[\u0A00-\u0A7F]/.test(localized.stem));
      assert.ok(locale === "hi-IN" ? /[\u0900-\u097F]/.test(localized.explanation.ruleStatement) : /[\u0A00-\u0A7F]/.test(localized.explanation.ruleStatement));
      assert.ok(!forbiddenEnglishInstruction.test(localized.stem), `${candidateId} ${locale}: ${localized.stem}`);
      assert.ok(localized.stem.length <= 260, `${candidateId} ${locale} stem too long: ${localized.stem.length}`);
      assert.ok(localized.options.every((option) => option.value.length <= 90));
      maxStemLength = Math.max(maxStemLength, localized.stem.length);
      localizedCount += 1;
    }
  }
}

const wholeNumberQuestion = generateOpsRepresentativePilot("OPS-CAND-020", 0);
const digitQuestion = generateOpsRepresentativePilot("OPS-CAND-023", 0);
assert.match(localizeOpsPilotQuestion(wholeNumberQuestion, "hi-IN").stem, /पूरी संख्याओं/);
assert.match(localizeOpsPilotQuestion(wholeNumberQuestion, "pa-IN").stem, /ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ/);
assert.match(localizeOpsPilotQuestion(digitQuestion, "hi-IN").stem, /अंकों/);
assert.match(localizeOpsPilotQuestion(digitQuestion, "pa-IN").stem, /ਅੰਕ/);
assert.match(localizeOpsPilotQuestion(generateOpsRepresentativePilot("OPS-CAND-014", 0), "hi-IN").stem, /आपस में बदल/);
assert.match(localizeOpsPilotQuestion(generateOpsRepresentativePilot("OPS-CAND-014", 0), "pa-IN").stem, /ਆਪਸ ਵਿੱਚ ਬਦਲ/);

console.log("OPS-001 Hindi/Punjabi pilot localization test passed.", {
  localizedCount,
  maxStemLength,
  locales: 2,
});
