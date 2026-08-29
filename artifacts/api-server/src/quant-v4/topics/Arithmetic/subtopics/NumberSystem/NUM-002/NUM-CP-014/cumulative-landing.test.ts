import assert from "node:assert/strict";
import { NUM_CP013_PERMANENT_QL_IDS } from "../NUM-CP-013/permanent-allocation.ts";
import { NUM_CP014_ALLOCATION_STATUS, NUM_CP014_PERMANENT_QL_IDS } from "./permanent-allocation.ts";
import { generateNumCp014Permanent } from "./permanent-runtime.ts";
import { generateNumCp014LocalizedV2 } from "./localization/runtime-v2.ts";
import { isNumCp014QuestionStudioRequest, listNumCp014QuestionStudioPackages } from "./question-studio-integration.ts";
import { listQuestionStudioPackages } from "../../../../../../../question-studio/shared-generation-engine-cp014.ts";

assert.equal(NUM_CP013_PERMANENT_QL_IDS.at(-1), "NUM-QL-247");
assert.deepEqual(NUM_CP014_PERMANENT_QL_IDS, ["NUM-QL-248", "NUM-QL-249", "NUM-QL-250", "NUM-QL-251", "NUM-QL-252", "NUM-QL-253"]);
assert.equal(NUM_CP014_ALLOCATION_STATUS.nextAvailableQl, "NUM-QL-254");
assert.equal(NUM_CP014_ALLOCATION_STATUS.certifiedCumulativeRun, 33144489296);
assert.equal(isNumCp014QuestionStudioRequest({ packageId: "NUM-002" }), false);
assert.equal(isNumCp014QuestionStudioRequest({ questionLanguageId: "NUM-QL-254" }), false);

let generated = 0;
const sourceCoverage = new Set<string>();
for (const qlId of NUM_CP014_PERMANENT_QL_IDS) {
  for (let seed = 1; seed <= 60; seed += 1) {
    const en = generateNumCp014Permanent(qlId, seed);
    sourceCoverage.add(en.sourcePrototypeId);
    assert.equal(en.options[en.correctIndex]?.value, en.canonicalAnswer);
    assert.equal(en.verifierAnswer, en.canonicalAnswer);
    assert.equal(en.explanation.standard, "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1");
    assert.equal(en.lifecycle.questionBankWritable, false);
    assert.equal(en.lifecycle.testEligible, false);
    assert.equal(en.lifecycle.mockTestEligible, false);
    assert.equal(en.lifecycle.publiclyPublishable, false);
    assert.equal(en.lifecycle.automaticStudentPublication, false);
    for (const language of ["hi", "pa"] as const) {
      const localized = generateNumCp014LocalizedV2(qlId, seed, language);
      assert.equal(localized.sourcePrototypeId, en.sourcePrototypeId);
      assert.equal(localized.sourceSeed, en.sourceSeed);
      assert.equal(localized.mathematicalFingerprint, en.mathematicalFingerprint);
      assert.deepEqual(localized.hiddenState, en.hiddenState);
      assert.equal(localized.options[localized.correctIndex]?.value, localized.canonicalAnswer);
      assert.equal(localized.verifierAnswer, localized.canonicalAnswer);
      assert.equal(localized.lifecycle.questionBankWritable, false);
      assert.equal(localized.lifecycle.testEligible, false);
      generated += 1;
    }
    generated += 1;
  }
}
assert.equal(sourceCoverage.size, 20, "Cumulative landing lost one or more CP014 source prototypes");

const cp014Capability = listNumCp014QuestionStudioPackages()[0]!;
assert.equal(cp014Capability.permanentQlCount, 6);
assert.equal(cp014Capability.permanentQlIds.at(-1), "NUM-QL-253");
const num002 = listQuestionStudioPackages().find((pkg: any) => String(pkg.packageId) === "NUM-002") as any;
assert.ok(num002);
assert.equal(num002.permanentQlCount, 88);
assert.equal(num002.permanentQlIds[0], "NUM-QL-166");
assert.equal(num002.permanentQlIds.at(-1), "NUM-QL-253");
assert.equal(new Set(num002.permanentQlIds).size, 88);
assert.ok(num002.cpIds.includes("NUM-CP-014"));
assert.equal(num002.questionBankWritable, false);
assert.equal(num002.testEligible, false);
assert.equal(num002.mockTestEligible, false);
assert.equal(num002.publiclyPublishable, false);
assert.equal(num002.automaticStudentPublication, false);

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_CUMULATIVE_LANDING",
  permanentRange: "NUM-QL-248..NUM-QL-253",
  nextFreeQl: "NUM-QL-254",
  sourcePrototypeCoverage: sourceCoverage.size,
  generatedEnglishHindiPunjabiPackages: generated,
  sharedNum002PermanentQlCount: num002.permanentQlCount,
  packageOnlyFallbackPreserved: true,
  ql254Unclaimed: true,
  downstreamGatesLocked: true,
}, null, 2));
