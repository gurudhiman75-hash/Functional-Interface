import assert from "node:assert/strict";
import { MEN_CP_009_FROZEN_QLS_V2 } from "../coverage-v2/registry";
import { buildMenCp009V3StudentReviewBatch } from "../coverage-v2/student-review-batch-v3";
import { buildMenCp009StudentView } from "../coverage-v2/student-view-v3";
import { generateMenCp009QuestionV2 } from "../coverage-v2/runtime";
import { generateMenCp009ApprovedEnglishView } from "./english";
import {
  MEN_CP_009_APPROVED_ENGLISH_RELEASE_ID,
  MEN_CP_009_APPROVAL_PROVENANCE,
} from "./types";

const reviewed = buildMenCp009V3StudentReviewBatch();
assert.equal(reviewed.rows.length, 110);
assert.equal(reviewed.uniqueLearnerStems, 110);
assert.equal(Object.keys(reviewed.semanticReviewCountByQl).length, 28);

let reviewedApproved = 0;
for (const row of reviewed.rows) {
  const candidate = buildMenCp009StudentView(row);
  const approved = generateMenCp009ApprovedEnglishView(row.permanentQlId, row.seed);
  const {
    releaseId,
    editorialStatus,
    reviewStatus,
    approvalProvenance,
    approvalRecord,
    approvalValidation,
    active,
    questionStudioDiscoverable,
    questionBankStatus,
    questionBankWritable,
    testEligibility,
    testEligible,
    publiclyPublishable,
    ...approvedCandidateFields
  } = approved;

  assert.deepEqual(
    approvedCandidateFields,
    candidate,
    `${row.permanentQlId} ${row.seed}: approval must preserve the exact reviewed V3 learner view.`,
  );
  assert.equal(releaseId, MEN_CP_009_APPROVED_ENGLISH_RELEASE_ID);
  assert.equal(editorialStatus, "APPROVED");
  assert.equal(reviewStatus, "APPROVED_EDITORIAL_ENGLISH");
  assert.equal(approvalProvenance, MEN_CP_009_APPROVAL_PROVENANCE);
  assert.equal(approvalRecord.reviewedQuestionCount, 110);
  assert.equal(approvalRecord.permanentQlCount, 28);
  assert.equal(approvalRecord.permanentQlRange, "MEN-002-QL-096..MEN-002-QL-123");
  assert.equal(approvalValidation.valid, true);
  assert.equal(active, false);
  assert.equal(questionStudioDiscoverable, false);
  assert.equal(questionBankStatus, "NOT_STORED");
  assert.equal(questionBankWritable, false);
  assert.equal(testEligibility, "INELIGIBLE");
  assert.equal(testEligible, false);
  assert.equal(publiclyPublishable, false);
  assert.equal(approved.showDiagram, false);
  assert.equal(approved.sourceValidationPassed, true);
  assert.equal(approved.sourceVerificationPassed, true);
  reviewedApproved += 1;
}

let regressionPackages = 0;
for (const definition of MEN_CP_009_FROZEN_QLS_V2) {
  const positions = new Set<number>();
  for (let index = 0; index < 40; index += 1) {
    const seed = `men-cp009-approved-v3:${definition.qlId}:${index}`;
    const first = generateMenCp009ApprovedEnglishView(definition.qlId, seed);
    const second = generateMenCp009ApprovedEnglishView(definition.qlId, seed);
    assert.deepEqual(first, second, `${definition.qlId}: approved view must be deterministic.`);

    const raw = generateMenCp009QuestionV2(definition.qlId, seed);
    const candidate = buildMenCp009StudentView(raw);
    const {
      releaseId: _releaseId,
      editorialStatus: _editorialStatus,
      reviewStatus: _reviewStatus,
      approvalProvenance: _approvalProvenance,
      approvalRecord: _approvalRecord,
      approvalValidation: _approvalValidation,
      active: _active,
      questionStudioDiscoverable: _questionStudioDiscoverable,
      questionBankStatus: _questionBankStatus,
      questionBankWritable: _questionBankWritable,
      testEligibility: _testEligibility,
      testEligible: _testEligible,
      publiclyPublishable: _publiclyPublishable,
      ...approvedCandidateFields
    } = first;
    assert.deepEqual(approvedCandidateFields, candidate);
    assert.equal(first.approvalValidation.valid, true);
    assert.equal(first.sourceValidationPassed, true);
    assert.equal(first.sourceVerificationPassed, true);
    assert.equal(first.showDiagram, false);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => option.display)).size, 4);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.ok(first.explanationLines.length >= 2 && first.explanationLines.length <= 4);
    assert.ok(first.explanationLines.at(-1)?.startsWith("Answer:"));
    assert.ok(
      !/(Choose the correct option|Select the correct answer|Calculate carefully|Determine the required value|Find the requested measure|Leave the answer in terms)/i.test(first.stem),
      `${definition.qlId}: approved stem must retain the reviewed no-filler contract.`,
    );
    assert.ok(
      !/(\\pi|\\frac|\\text|\\times|\\sqrt|\$)/.test(
        [first.stem, ...first.options.map((option) => option.display), ...first.explanationLines].join(" "),
      ),
      `${definition.qlId}: approved learner text must remain plain/readable maths.`,
    );

    positions.add(first.correctIndex);
    regressionPackages += 1;
  }
  assert.deepEqual([...positions].sort(), [0, 1, 2, 3], `${definition.qlId}: all answer positions must remain reachable.`);
}

assert.equal(reviewedApproved, 110);
assert.equal(regressionPackages, 28 * 40);
assert.throws(
  () => generateMenCp009ApprovedEnglishView("MEN-002-QL-999", "unknown"),
  /Unknown MEN-CP-009/,
);

console.log(
  `MEN-CP-009 English V3 approval passed: ${reviewedApproved} explicitly reviewed semantic questions preserved exactly, ` +
    `${regressionPackages} deterministic regression packages across 28 permanent QLs, and all product delivery locks remain closed.`,
);
