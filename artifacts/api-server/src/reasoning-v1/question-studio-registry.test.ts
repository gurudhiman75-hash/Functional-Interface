import assert from "node:assert/strict";

import {
  getReasoningV1GenerationBlock,
  listQuestionStudioPackagesWithReasoning,
  listReasoningV1QuestionStudioPackages,
  resolveReasoningV1QuestionStudioPackage,
} from "./question-studio-registry";

const packages = listReasoningV1QuestionStudioPackages();
assert.equal(packages.length, 1, "Only the audited RNK package should be registered");

const rnk = packages[0]!;
assert.equal(rnk.packageId, "RNK-001");
assert.deepEqual(rnk.cpIds, ["RNK-CP-004"]);
assert.deepEqual(rnk.supportedLanguages, ["en"]);
assert.equal(rnk.enabled, false);
assert.equal(rnk.runtimeMode, "DISCOVERY_ONLY");
assert.equal(rnk.generationAllowed, false);
assert.equal(rnk.persistenceAllowed, false);
assert.equal(rnk.approvalAllowed, false);
assert.equal(rnk.questionBankStatus, "NOT_STORED");
assert.equal(rnk.testEligibility, "INELIGIBLE");
assert.equal(rnk.publiclyPublishable, false);
assert.equal(rnk.localizationStatus, "NOT_STARTED");
assert.equal(
  rnk.screenReaderValidation,
  "PENDING_MANUAL_ASSISTIVE_TECHNOLOGY_EXECUTION",
);
assert.deepEqual(rnk.permanentQlRange, {
  first: "RNK-QL-027",
  last: "RNK-QL-035",
  count: 9,
});
assert.equal(rnk.permanentQuestionCount, 1728);
assert.equal(
  rnk.projectionSha256,
  "39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f",
);

assert.equal(
  resolveReasoningV1QuestionStudioPackage({ packageId: "RNK-001" }),
  rnk,
);
assert.equal(
  resolveReasoningV1QuestionStudioPackage({ patternId: "RNK-001:RNK-CP-004" }),
  rnk,
);
assert.equal(
  resolveReasoningV1QuestionStudioPackage({
    topic: "Reasoning",
    subtopic: "Ranking & Order",
  }),
  rnk,
);
assert.equal(
  resolveReasoningV1QuestionStudioPackage({ topic: "Ranking and Order" }),
  rnk,
);
assert.equal(
  resolveReasoningV1QuestionStudioPackage({
    packageId: "PNL-001",
    topic: "Arithmetic",
    subtopic: "Profit and Loss",
  }),
  undefined,
);

const combined = listQuestionStudioPackagesWithReasoning([
  { packageId: "PNL-001", enabled: true },
]);
assert.equal(combined.length, 2);
assert.equal(combined[0]?.packageId, "PNL-001");
assert.equal(combined[1]?.packageId, "RNK-001");

for (const selection of [
  { packageId: "RNK-001" },
  { patternId: "RNK-001" },
  { topic: "Reasoning", subtopic: "Ranking and Order" },
]) {
  const block = getReasoningV1GenerationBlock(selection);
  assert.ok(block, "RNK selection must be blocked before generation");
  assert.equal(block.statusCode, 409);
  assert.equal(block.body.code, "REASONING_PACKAGE_DISCOVERY_ONLY");
  assert.equal(block.body.packageId, "RNK-001");
  assert.equal(block.body.generationAllowed, false);
  assert.equal(block.body.persistenceAllowed, false);
  assert.equal(block.body.questionBankStatus, "NOT_STORED");
  assert.equal(block.body.testEligibility, "INELIGIBLE");
  assert.equal(block.body.publiclyPublishable, false);
}

assert.equal(
  getReasoningV1GenerationBlock({ packageId: "RAP-001" }),
  undefined,
);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      packageId: rnk.packageId,
      mode: rnk.runtimeMode,
      generationAllowed: rnk.generationAllowed,
      persistenceAllowed: rnk.persistenceAllowed,
      questionBankStatus: rnk.questionBankStatus,
      testEligibility: rnk.testEligibility,
      publiclyPublishable: rnk.publiclyPublishable,
      projectionSha256: rnk.projectionSha256,
    },
    null,
    2,
  ),
);
