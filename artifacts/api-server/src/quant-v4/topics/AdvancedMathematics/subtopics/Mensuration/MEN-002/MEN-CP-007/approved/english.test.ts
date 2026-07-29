import assert from "node:assert/strict";
import { MEN_CP_007_FROZEN_QLS } from "../final-freeze/registry";
import { generateMenCp007ApprovedEnglishQuestion } from "./english";
import { generateMenCp007PermanentQuestion } from "../permanent/runtime";

let generated = 0;
const reachedDifficulties = new Set<string>();
const reachedPrototypes = new Set<string>();

for (const definition of MEN_CP_007_FROZEN_QLS) {
  const positions = new Set<number>();
  for (let index = 0; index < 80; index += 1) {
    const seed = `men-cp007-approved-english:${definition.qlId}:${index}`;
    const first = generateMenCp007ApprovedEnglishQuestion(definition.qlId, seed);
    const second = generateMenCp007ApprovedEnglishQuestion(definition.qlId, seed);
    assert.deepEqual(first, second, `${definition.qlId} approved English release must regenerate deterministically.`);

    const candidate = generateMenCp007PermanentQuestion(definition.qlId, seed, "en");
    const { releaseId, approvalProvenance, approvalValidation, editorialStatus, reviewStatus, ...approvedContent } = first;
    const { editorialStatus: _candidateEditorial, reviewStatus: _candidateReview, ...candidateContent } = candidate;
    assert.deepEqual(approvedContent, candidateContent, `${definition.qlId} approval must preserve the complete candidate package.`);

    const failures = first.approvalValidation.checks
      .filter((check) => !check.passed)
      .map((check) => `${check.name}: ${check.message}`)
      .join("; ");
    assert.equal(first.approvalValidation.valid, true, `${definition.qlId} ${seed}: ${failures}`);
    assert.equal(first.releaseId, "MEN-CP007-EN-v1-APPROVED");
    assert.equal(first.editorialStatus, "APPROVED");
    assert.equal(first.reviewStatus, "APPROVED_EDITORIAL_ENGLISH");
    assert.equal(first.approvalProvenance, "GROUPED_MANUAL_AND_EXECUTABLE_AUDIT_UNDER_PRODUCT_OWNER_DIRECTIVE");
    assert.equal(first.validation.valid, true);
    assert.equal(first.sourceValidation.valid, true);
    assert.equal(first.verification.valid, true);
    assert.equal(first.active, false);
    assert.equal(first.questionStudioDiscoverable, false);
    assert.equal(first.questionBankStatus, "NOT_STORED");
    assert.equal(first.questionBankWritable, false);
    assert.equal(first.testEligibility, "INELIGIBLE");
    assert.equal(first.testEligible, false);
    assert.equal(first.publiclyPublishable, false);

    positions.add(first.correctIndex);
    reachedDifficulties.add(first.difficulty);
    reachedPrototypes.add(first.sourcePrototypeId);
    generated += 1;
  }
  assert.deepEqual([...positions].sort(), [0, 1, 2, 3], `${definition.qlId} must reach every answer position after approval.`);
}

assert.equal(generated, 43 * 80);
assert.deepEqual([...reachedDifficulties].sort(), ["Easy", "Hard", "Medium"]);
assert.equal(reachedPrototypes.size, 63);
assert.throws(
  () => generateMenCp007ApprovedEnglishQuestion("MEN-002-QL-999", "unknown"),
  /Unknown MEN-CP-007 permanent QL/,
);

console.log(
  `MEN-CP-007 approved English release passed for ${generated} deterministic packages across 43 QLs and 63 prototype ancestries. ` +
  "Approval changes only release/review metadata; all product and publication surfaces remain disabled.",
);
