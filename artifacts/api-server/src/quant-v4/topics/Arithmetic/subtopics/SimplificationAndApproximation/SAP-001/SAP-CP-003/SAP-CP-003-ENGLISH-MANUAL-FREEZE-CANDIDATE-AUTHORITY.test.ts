import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  SAP_PERMANENT_QL_BY_ID,
  SAP_PERMANENT_QL_REGISTRY_STATE,
} from "../../SAP-PERMANENT-QL-REGISTRY";
import { generateSapCp003Sweep } from "./editorial-runtime";
import { SAP_CP003_ENGLISH_MANUAL_FREEZE } from "./english-freeze/candidate";
import {
  SAP_CP003_PERMANENT_QL_IDS,
  SAP_CP003_PERMANENT_STATE,
  SAP_CP003_PROTOTYPE_TO_PERMANENT_QL,
  generateSapCp003PermanentSweep,
} from "./permanent-runtime/runtime";
import { generateSapCp003ReviewRecords } from "./review-export";

const BANNED_STUDENT_FACING_TERMS = /\b(?:AST|RPN|canonical payload|canonical evaluator|generation identity|prototype id|runtime seed|fingerprint)\b/i;

function sha256(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function generatedSurface(pkg: ReturnType<typeof generateSapCp003Sweep>[number]): unknown {
  return {
    prototypeId: pkg.prototypeId,
    seed: pkg.seed,
    difficulty: pkg.difficulty,
    difficultyScore: pkg.difficultyScore,
    taskDirection: pkg.taskDirection,
    answerSemantic: pkg.answerSemantic,
    stem: pkg.stem,
    canonicalAnswer: pkg.canonicalAnswer,
    options: pkg.options.map((option) => ({
      value: option.value,
      isCorrect: option.isCorrect,
      misconceptionId: option.misconceptionId,
      analysis: option.analysis,
    })),
    correctIndex: pkg.correctIndex,
    explanation: pkg.explanation,
  };
}

function reviewSurface(record: ReturnType<typeof generateSapCp003ReviewRecords>[number]): unknown {
  return {
    questionId: record.questionId,
    prototypeId: record.prototypeId,
    difficulty: record.difficulty,
    stem: record.stem,
    options: record.options.map((option) => ({
      value: option.value,
      isCorrect: option.isCorrect,
      misconceptionId: option.misconceptionId,
      analysis: option.analysis,
    })),
    correctIndex: record.correctIndex,
    correctAnswer: record.correctAnswer,
  };
}

const generated = generateSapCp003Sweep(100);
const permanent = generateSapCp003PermanentSweep(100);
const review = generateSapCp003ReviewRecords();

assert.equal(generated.length, SAP_CP003_ENGLISH_MANUAL_FREEZE.expectedGeneratedPackageCount);
assert.equal(permanent.length, SAP_CP003_ENGLISH_MANUAL_FREEZE.expectedGeneratedPackageCount);
assert.equal(review.length, SAP_CP003_ENGLISH_MANUAL_FREEZE.expectedReviewQuestionCount);
assert.equal(new Set(generated.map((pkg) => pkg.generationIdentity)).size, generated.length);
assert.equal(new Set(review.map((record) => record.canonicalPayloadKey)).size, review.length);
assert.equal(SAP_CP003_PERMANENT_QL_IDS.length, 19);

for (const pkg of generated) {
  assert.equal(pkg.validation.ok, true, `${pkg.prototypeId}/${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.ok(pkg.explanation.coreConcept.length >= 35);
  assert.ok(pkg.explanation.steps.length >= 1);
  assert.ok(pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer));
  assert.ok(pkg.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.misconceptionId) && option.analysis.length >= 25));

  const studentFacing = [
    pkg.stem,
    pkg.explanation.coreConcept,
    ...pkg.explanation.steps,
    pkg.explanation.finalAnswer,
    ...pkg.options.map((option) => `${option.value} ${option.analysis}`),
  ].join("\n");
  assert.doesNotMatch(studentFacing, BANNED_STUDENT_FACING_TERMS);

  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);
}

for (const pkg of permanent) {
  assert.equal(pkg.permanentQlId, SAP_CP003_PROTOTYPE_TO_PERMANENT_QL[pkg.prototypeId]);
  assert.equal(pkg.approvalStatus, "ENGLISH_MANUAL_FREEZE_APPROVED");
  assert.equal(pkg.lifecycle.contentStatus, "ENGLISH_MANUAL_FREEZE_APPROVED");
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);
}

for (const qlId of SAP_CP003_PERMANENT_QL_IDS) {
  const entry = SAP_PERMANENT_QL_BY_ID[qlId];
  assert.equal(entry.checkpointId, "SAP-CP-003");
  assert.equal(entry.englishStatus, "ENGLISH_MANUAL_FREEZE_APPROVED");
  assert.equal(entry.active, false);
  assert.equal(entry.questionStudioDiscoverable, false);
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.publiclyPublishable, false);
}

assert.equal(SAP_CP003_PERMANENT_STATE.permanentQlRange, "SAP-QL-034..SAP-QL-052");
assert.equal(SAP_CP003_PERMANENT_STATE.nextAvailableQlId, "SAP-QL-053");
assert.equal(SAP_CP003_PERMANENT_STATE.questionAndAnswerReview, "APPROVED_EDITORIAL_REMEDIATION_V3");
assert.equal(SAP_CP003_PERMANENT_STATE.fullEditorialReview, "FULL_300_QUESTION_HUMAN_APPROVED");
assert.equal(SAP_CP003_PERMANENT_STATE.editorialApproval, "PRODUCT_OWNER_APPROVED_CP003_EDITORIAL_V3_2026_08_08");
assert.equal(SAP_CP003_PERMANENT_STATE.freezeApproval, "PRODUCT_OWNER_APPROVED_CP003_ENGLISH_FREEZE_2026_08_08");
assert.equal(SAP_CP003_PERMANENT_STATE.englishExplanationFreeze, "ENGLISH_MANUAL_FREEZE_APPROVED");
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.cp003Range, "SAP-QL-034..SAP-QL-052");
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.nextAvailableId, "SAP-QL-053");

assert.equal(SAP_CP003_ENGLISH_MANUAL_FREEZE.sourceApprovedHead, "c68b77444d5d0b3d8dd958cb1c27ba6c254168c2");
assert.equal(SAP_CP003_ENGLISH_MANUAL_FREEZE.sourceMergeCommit, "da079875c2b55decce3d702eeef388196606fde8");
assert.equal(SAP_CP003_ENGLISH_MANUAL_FREEZE.status, "ENGLISH_MANUAL_FREEZE_APPROVED");
assert.equal(SAP_CP003_ENGLISH_MANUAL_FREEZE.approvalBoundary, "FROZEN_BY_EXPLICIT_PRODUCT_OWNER_APPROVAL");
assert.equal(SAP_CP003_ENGLISH_MANUAL_FREEZE.freezeApproval, "PRODUCT_OWNER_APPROVED_CP003_ENGLISH_FREEZE_2026_08_08");
assert.equal(SAP_CP003_ENGLISH_MANUAL_FREEZE.active, false);
assert.equal(SAP_CP003_ENGLISH_MANUAL_FREEZE.questionStudioDiscoverable, false);
assert.equal(SAP_CP003_ENGLISH_MANUAL_FREEZE.questionBankWritable, false);
assert.equal(SAP_CP003_ENGLISH_MANUAL_FREEZE.testEligible, false);
assert.equal(SAP_CP003_ENGLISH_MANUAL_FREEZE.publiclyPublishable, false);

const generatedSurfaceDigest = sha256(generated.map(generatedSurface));
const reviewSurfaceDigest = sha256(review.map(reviewSurface));
assert.equal(generatedSurfaceDigest, SAP_CP003_ENGLISH_MANUAL_FREEZE.expectedGeneratedSurfaceDigest);
assert.equal(reviewSurfaceDigest, SAP_CP003_ENGLISH_MANUAL_FREEZE.expectedReviewSurfaceDigest);

console.log(JSON.stringify({
  status: "PASS_SAP_CP003_ENGLISH_MANUAL_FREEZE_AUTHORITY",
  freezeStatus: SAP_CP003_ENGLISH_MANUAL_FREEZE.status,
  freezeApproval: SAP_CP003_ENGLISH_MANUAL_FREEZE.freezeApproval,
  sourceApprovedHead: SAP_CP003_ENGLISH_MANUAL_FREEZE.sourceApprovedHead,
  sourceMergeCommit: SAP_CP003_ENGLISH_MANUAL_FREEZE.sourceMergeCommit,
  generatedPackages: generated.length,
  permanentPackages: permanent.length,
  reviewQuestions: review.length,
  permanentQlRange: SAP_CP003_PERMANENT_STATE.permanentQlRange,
  nextAvailableQlId: SAP_CP003_PERMANENT_STATE.nextAvailableQlId,
  generatedSurfaceDigest,
  reviewSurfaceDigest,
  lifecycle: "INACTIVE_ENGLISH_FROZEN",
}, null, 2));
