import assert from "node:assert/strict";
import { NUM_CP014_PERMANENT_ALLOCATION } from "../permanent-allocation.ts";
import { generateNumCp014Permanent } from "../permanent-runtime.ts";
import { generateNumCp014LocalizedV2 } from "./runtime-v2.ts";

const languageSourceCoverage: Record<string, Set<string>> = { hi: new Set(), pa: new Set() };
let packages = 0;
let parityChecks = 0;

for (const language of ["hi", "pa"] as const) {
  for (const allocation of NUM_CP014_PERMANENT_ALLOCATION) {
    const limit = Math.max(120, allocation.sourcePrototypes.length * 40);
    for (let seed = 1; seed <= limit; seed += 1) {
      const en = generateNumCp014Permanent(allocation.qlId, seed);
      const q = generateNumCp014LocalizedV2(allocation.qlId, seed, language);
      packages += 1;

      assert.equal(q.packageId, en.packageId);
      assert.equal(q.checkpointId, en.checkpointId);
      assert.equal(q.authorityId, en.authorityId);
      assert.equal(q.permanentQlId, en.permanentQlId);
      assert.equal(q.seed, en.seed);
      assert.equal(q.sourceSeed, en.sourceSeed);
      assert.equal(q.sourcePrototypeId, en.sourcePrototypeId);
      assert.equal(q.mathematicalFingerprint, en.mathematicalFingerprint);
      assert.deepEqual(q.hiddenState, en.hiddenState);
      assert.deepEqual(q.componentEngines, en.componentEngines);
      assert.deepEqual(q.ablation, en.ablation);
      assert.equal(q.correctIndex, en.correctIndex);
      assert.equal(q.options.length, 4);
      assert.equal(q.options.filter((option) => option.isCorrect).length, 1);
      assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
      assert.equal(q.verifierAnswer, q.canonicalAnswer);
      assert.deepEqual(q.options.map((option) => option.misconceptionId), en.options.map((option) => option.misconceptionId));
      assert.deepEqual(q.options.map((option) => option.isCorrect), en.options.map((option) => option.isCorrect));
      assert.equal(q.explanation.standard, "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1");
      assert.ok(q.explanation.fullDerivation.length >= 5);
      assert.ok(q.explanation.examShortcut.length >= 2);
      assert.equal(q.explanation.finalAnswer, q.canonicalAnswer);
      assert.equal(q.lifecycle.reviewStatus, "MULTILINGUAL_FROZEN");
      assert.equal(q.lifecycle.questionStudioDiscoverable, false);
      assert.equal(q.lifecycle.questionBankWritable, false);
      assert.equal(q.lifecycle.testEligible, false);
      assert.equal(q.lifecycle.mockTestEligible, false);
      assert.equal(q.lifecycle.publiclyPublishable, false);
      assert.equal(q.lifecycle.automaticStudentPublication, false);

      languageSourceCoverage[language]!.add(q.sourcePrototypeId);
      parityChecks += 1;
    }
  }
}

for (const language of ["hi", "pa"] as const) {
  assert.equal(languageSourceCoverage[language]!.size, 20, `${language}: localization did not reach all 20 source prototypes`);
}

for (let seed = 1; seed <= 80; seed += 1) {
  const hi = generateNumCp014LocalizedV2("NUM-QL-251", seed, "hi");
  const pa = generateNumCp014LocalizedV2("NUM-QL-251", seed, "pa");
  assert.ok(["कोई हल नहीं", "एक हल"].includes(hi.canonicalAnswer), `Hindi solution-class token not localized: ${hi.canonicalAnswer}`);
  assert.ok(["ਕੋਈ ਹੱਲ ਨਹੀਂ", "ਇੱਕ ਹੱਲ"].includes(pa.canonicalAnswer), `Punjabi solution-class token not localized: ${pa.canonicalAnswer}`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_LOCALIZATION_PARITY",
  packages,
  parityChecks,
  hindiSourceCoverage: languageSourceCoverage.hi.size,
  punjabiSourceCoverage: languageSourceCoverage.pa.size,
  mathematicalStatePreserved: true,
  answerBindingPreserved: true,
  downstreamGatesLocked: true,
}, null, 2));
