import assert from "node:assert/strict";

import { listReasoningV1QuestionStudioPackages } from "../../../question-studio-registry";

const packages = listReasoningV1QuestionStudioPackages();
const ranking = packages.find((pkg) => pkg.packageId === "RNK-001");

assert.ok(ranking, "RNK-001 must remain registered in discovery-only mode");
assert.deepEqual(
  ranking.cpIds,
  ["RNK-CP-004"],
  "Rejected CP-005 shared-set work must not enter the Question Studio registry",
);
assert.deepEqual(ranking.permanentQlRange, {
  first: "RNK-QL-027",
  last: "RNK-QL-035",
  count: 9,
});
assert.equal(ranking.permanentQuestionCount, 1728);
assert.equal(
  ranking.projectionSha256,
  "39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f",
);
assert.equal(ranking.generationAllowed, false);
assert.equal(ranking.persistenceAllowed, false);
assert.equal(ranking.questionBankStatus, "NOT_STORED");
assert.equal(ranking.testEligibility, "INELIGIBLE");
assert.equal(ranking.publiclyPublishable, false);

const rejectedOwnership = Object.freeze({
  checkpointId: "RNK-CP-005",
  rejectedFamily: "PRESENTATION_LED_SHARED_RANKING_SETS",
  allocatedQlCount: 0,
  registeredInQuestionStudio: false,
});

const nextDiscovery = Object.freeze({
  checkpointId: "RNK-CP-005",
  ownership: "PARTIAL_ORDER_AND_RANKING_UNCERTAINTY",
  nextAvailableQl: "RNK-QL-036",
  allocatedQlCount: 0,
});

assert.equal(rejectedOwnership.allocatedQlCount, 0);
assert.equal(rejectedOwnership.registeredInQuestionStudio, false);
assert.equal(nextDiscovery.nextAvailableQl, "RNK-QL-036");
assert.equal(nextDiscovery.allocatedQlCount, 0);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      frozenRange: "RNK-QL-001..035",
      registeredCheckpointIds: ranking.cpIds,
      rejectedOwnership,
      nextDiscovery,
      lifecycle: {
        generationAllowed: ranking.generationAllowed,
        persistenceAllowed: ranking.persistenceAllowed,
        questionBankStatus: ranking.questionBankStatus,
        testEligibility: ranking.testEligibility,
        publiclyPublishable: ranking.publiclyPublishable,
      },
    },
    null,
    2,
  ),
);
