import assert from "node:assert/strict";

import {
  buildRnkCp006PinnedProductionCandidate,
  RNK_CP006_PINNED_PRODUCTION_CANDIDATE_PROJECTION_SHA256,
  RNK_CP006_PINNED_PRODUCTION_CANDIDATE_VERSION,
} from "./cp006-production-candidate-pinned-v1";
import {
  rnkCp006ProductionCandidateProjectionSha256,
  RNK_CP006_PRODUCTION_CANDIDATE_VERSION,
} from "./cp006-production-candidate-v1";

const questions = buildRnkCp006PinnedProductionCandidate();

assert.equal(questions.length, 576);
assert.equal(RNK_CP006_PINNED_PRODUCTION_CANDIDATE_VERSION, "RNK_CP006_PRODUCTION_CANDIDATE_PINNED_V1");
assert.ok(questions.every((question) => question.candidateVersion === RNK_CP006_PRODUCTION_CANDIDATE_VERSION));
assert.ok(questions.every((question) => question.candidateProfile.projectionDigestPinned === true));
assert.ok(questions.every((question) => question.candidateProfile.permanentQlId === null));
assert.ok(questions.every((question) => question.candidateProfile.finalOwnershipApproved === false));
assert.ok(questions.every((question) => question.candidateProfile.englishFreezeApproved === false));
assert.ok(questions.every((question) => question.lifecycle.permanentQlAllocated === false));
assert.ok(questions.every((question) => question.lifecycle.questionStudio === "DISABLED"));
assert.ok(questions.every((question) => question.lifecycle.persistence === "DISABLED"));
assert.ok(questions.every((question) => question.lifecycle.questionBank === "NOT_STORED"));
assert.ok(questions.every((question) => question.lifecycle.testEligibility === "INELIGIBLE"));
assert.ok(questions.every((question) => question.lifecycle.publiclyPublishable === false));

const projectionSha256 = rnkCp006ProductionCandidateProjectionSha256(questions);
assert.equal(
  projectionSha256,
  RNK_CP006_PINNED_PRODUCTION_CANDIDATE_PROJECTION_SHA256,
  "CP006 pinned candidate projection drifted",
);

console.log(JSON.stringify({
  status: "PASS",
  pinnedVersion: RNK_CP006_PINNED_PRODUCTION_CANDIDATE_VERSION,
  questionsChecked: questions.length,
  projectionSha256,
  expectedProjectionSha256: RNK_CP006_PINNED_PRODUCTION_CANDIDATE_PROJECTION_SHA256,
  projectionPinned: true,
  permanentQlAllocated: false,
  englishFreezeApproved: false,
  nextAvailableQl: "RNK-QL-039",
}, null, 2));
