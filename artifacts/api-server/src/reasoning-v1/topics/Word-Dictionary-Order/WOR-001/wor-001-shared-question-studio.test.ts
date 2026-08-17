import assert from "node:assert/strict";

import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../question-studio-review-registry";
import { buildWor001QuestionStudioPayload } from "./question-studio-payload";

const packages = listReasoningV1QuestionStudioReviewPackages();
assert.ok(packages.some((entry) => entry.packageId === "WOR-001"), "WOR-001 is missing from the shared Reasoning V1 Question Studio registry.");

const enabled = listEnabledReasoningV1QuestionStudioPackages();
assert.ok(enabled.some((entry) => entry.packageId === "WOR-001"), "WOR-001 is not discoverable as a registered Question Studio review package.");

const preview = previewReasoningV1QuestionStudioReview({
  packageId: "WOR-001",
  language: "en",
  prototypeId: "WOR-PROT-020",
  difficulty: "Easy",
  count: 1,
  seed: "shared-registry-contract",
});

assert.equal(preview.questions.length, 1);
const question = preview.questions[0]!;
assert.equal(question.packageId, "WOR-001");
assert.equal(question.chapterId, "WOR-001");
assert.equal(question.prototypeId, "WOR-PROT-020");
assert.equal(question.lifecycleStatus, "REVIEW_ONLY");
assert.equal(question.questionStudioVisible, true);
assert.equal(question.validation.valid, true);

const payload = buildWor001QuestionStudioPayload(question);
assert.equal(payload.canonicalProblemId, question.prototypeId, "Canonical problem identity must stay at prototype level until permanent QLs are allocated.");
assert.equal(payload.checkpointId, question.checkpointId);
assert.equal(payload.revisionPolicy, "SOURCE_GENERATOR_ONLY");
assert.equal(payload.questionBankStatus, "NOT_STORED");
assert.equal(payload.questionBankWritable, false);
assert.equal(payload.testEligibility, "INELIGIBLE");
assert.equal(payload.testEligible, false);
assert.equal(payload.mockTestEligible, false);
assert.equal(payload.publiclyPublishable, false);
assert.equal(payload.automaticStudentPublication, false);
assert.equal(payload.permanentQlId, null);

assert.throws(
  () => persistReasoningV1QuestionStudioReview({
    packageId: "WOR-001",
    language: "en",
    prototypeId: "WOR-PROT-020",
    difficulty: "Easy",
    count: 1,
    seed: "shared-registry-contract",
  }),
  /authenticated shared Question Studio review-run route/,
  "Shared registry must not bypass the RBAC\/audit-aware WOR persistence route.",
);

console.log("WOR-001 shared Question Studio registry contract passed.", {
  packageCount: packages.length,
  enabledPackageCount: enabled.length,
  prototypeId: question.prototypeId,
  canonicalProblemId: payload.canonicalProblemId,
});
