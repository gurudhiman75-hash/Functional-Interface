import assert from "node:assert/strict";

import {
  NUM_CP013_ALLOCATION_STATUS,
  NUM_CP013_PERMANENT_ALLOCATION,
  NUM_CP013_PERMANENT_QL_IDS,
} from "./permanent-allocation.ts";
import { generateNumCp013Permanent } from "./permanent-runtime.ts";
import { generateNumCp013Localized } from "./localization/runtime.ts";
import { NUM_CP013_DISCOVERY_PROTOTYPE_IDS } from "./wave04/merge-split-proposal.ts";
import {
  generateQuestion,
  listQuestionStudioPackages,
} from "../../../../../../../question-studio/shared-generation-engine-cp013.ts";

assert.equal(NUM_CP013_DISCOVERY_PROTOTYPE_IDS.length, 22, "CP013 discovery source count drift");
assert.equal(NUM_CP013_PERMANENT_ALLOCATION.length, 11, "CP013 authority count drift");
assert.deepEqual(NUM_CP013_PERMANENT_QL_IDS, Array.from({ length: 11 }, (_, index) => `NUM-QL-${237 + index}`));
assert.equal(NUM_CP013_ALLOCATION_STATUS.nextAvailableQl, "NUM-QL-248");

let frozenPackages = 0;
for (const qlId of NUM_CP013_PERMANENT_QL_IDS) {
  const en = generateNumCp013Permanent(qlId, 37);
  assert.equal(en.permanentQlId, qlId);
  assert.equal(en.canonicalAnswer, en.verifierAnswer);
  assert.equal(en.options[en.correctIndex]?.value, en.canonicalAnswer);
  assert.equal(en.lifecycle.questionStudioDiscoverable, false);
  assert.equal(en.lifecycle.questionBankWritable, false);
  assert.equal(en.lifecycle.testEligible, false);
  assert.equal(en.lifecycle.mockTestEligible, false);
  assert.equal(en.lifecycle.publiclyPublishable, false);
  assert.equal(en.lifecycle.automaticStudentPublication, false);
  frozenPackages += 1;

  for (const language of ["hi", "pa"] as const) {
    const localized = generateNumCp013Localized(qlId, 37, language);
    assert.equal(localized.permanentQlId, qlId);
    assert.equal(localized.hiddenState, en.hiddenState, `${qlId}/${language}: hidden-state reference changed`);
    assert.deepEqual(localized.hiddenState, en.hiddenState, `${qlId}/${language}: hidden-state parity drift`);
    assert.equal(localized.mathematicalFingerprint, en.mathematicalFingerprint);
    assert.equal(localized.options[localized.correctIndex]?.value, localized.canonicalAnswer);
    assert.equal(localized.lifecycle.questionBankWritable, false);
    assert.equal(localized.lifecycle.testEligible, false);
    assert.equal(localized.lifecycle.mockTestEligible, false);
    assert.equal(localized.lifecycle.publiclyPublishable, false);
    frozenPackages += 1;
  }
}
assert.equal(frozenPackages, 33);

const num002 = listQuestionStudioPackages().find((pkg: any) => String(pkg.packageId) === "NUM-002") as any;
assert.ok(num002, "NUM-002 aggregate capability missing");
assert.equal(num002.permanentQlCount, 82);
assert.equal(num002.permanentQlIds.length, 82);
assert.equal(new Set(num002.permanentQlIds).size, 82);
assert.equal(num002.permanentQlIds[0], "NUM-QL-166");
assert.equal(num002.permanentQlIds.at(-1), "NUM-QL-247");
assert.ok(num002.cpIds.includes("NUM-CP-008"));
assert.ok(num002.cpIds.includes("NUM-CP-012"));
assert.ok(num002.cpIds.includes("NUM-CP-013"));
assert.equal(num002.releaseId, "NUM-002-QS-CP008-CP013-MULTILINGUAL-FROZEN-V1");
assert.equal(num002.questionBankWritable, false);
assert.equal(num002.testEligible, false);
assert.equal(num002.mockTestEligible, false);
assert.equal(num002.publiclyPublishable, false);
assert.equal(num002.automaticStudentPublication, false);

for (const language of ["en", "hi", "pa"] as const) {
  const studio = await generateQuestion({
    canonicalProblemId: "NUM-CP-013",
    language,
    seed: `cp013-cumulative:${language}`,
    count: 22,
  });
  assert.equal(studio.questions.length, 22);
  assert.ok(studio.questions.every((q: any) => q.canonicalProblemId === "NUM-CP-013"));
  assert.ok(studio.questions.every((q: any) => q.questionStudioDiscoverable === true));
  assert.ok(studio.questions.every((q: any) => q.questionBankWritable === false));
  assert.ok(studio.questions.every((q: any) => q.testEligible === false));
  assert.ok(studio.questions.every((q: any) => q.mockTestEligible === false));
  assert.ok(studio.questions.every((q: any) => q.publiclyPublishable === false));
  assert.ok(studio.questions.every((q: any) => q.automaticStudentPublication === false));
  assert.ok(new Set(studio.questions.map((q: any) => q.qlId)).size >= 10, `${language}: cumulative QL breadth too narrow`);
}

const packageOnly = await generateQuestion({ packageId: "NUM-002", language: "en", seed: "cp013-cumulative-fallback", count: 1 });
assert.notEqual(packageOnly.questions[0]?.canonicalProblemId, "NUM-CP-013", "CP013 stole package-only NUM-002 fallback");

console.log(JSON.stringify({
  status: "PASS_NUM_CP013_CUMULATIVE_LANDING",
  discoveryPrototypes: 22,
  permanentAuthorities: 11,
  permanentRange: "NUM-QL-237..NUM-QL-247",
  nextAvailableQl: "NUM-QL-248",
  aggregateNum002QlCount: 82,
  aggregateNum002Range: "NUM-QL-166..NUM-QL-247",
  languages: ["en", "hi", "pa"],
  packageOnlyFallbackPreserved: true,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
}, null, 2));
