import assert from "node:assert/strict";
import {
  SAP_CP003_PERMANENT_QL_IDS,
  SAP_CP003_PROTOTYPE_TO_PERMANENT_QL,
  generateSapCp003PermanentPackage,
} from "./permanent-runtime/runtime";
import { SAP_CP003_PROTOTYPE_IDS } from "./types";
import { generateSapCp003ExplanationReviewExport } from "./english-freeze/review-export";
import {
  SAP_CP003_EXPLANATION_REVIEW_STATE,
  generateSapCp003EnglishExplanationSweep,
} from "./english-freeze/runtime";

assert.equal(SAP_CP003_PROTOTYPE_IDS.length, 19);
assert.equal(SAP_CP003_PERMANENT_QL_IDS.length, 19);
assert.equal(Object.keys(SAP_CP003_PROTOTYPE_TO_PERMANENT_QL).length, 19);
assert.equal(SAP_CP003_EXPLANATION_REVIEW_STATE.permanentQlRange, "SAP-QL-034..SAP-QL-052");
assert.equal(SAP_CP003_EXPLANATION_REVIEW_STATE.questionsAndAnswers, "APPROVED");
assert.equal(SAP_CP003_EXPLANATION_REVIEW_STATE.explanationReview, "PENDING_HUMAN_APPROVAL");

for (let index = 0; index < SAP_CP003_PERMANENT_QL_IDS.length; index += 1) {
  assert.equal(SAP_CP003_PERMANENT_QL_IDS[index], `SAP-QL-${String(index + 34).padStart(3, "0")}`);
}

const candidates = generateSapCp003EnglishExplanationSweep(100);
assert.equal(candidates.length, 1_900);

const qlCounts = new Map<string, number>();
const fingerprintsByQl = new Map<string, Set<string>>();
const concepts = new Set<string>();
let inverseCount = 0;
let comparisonCount = 0;
let selectionCount = 0;
let diagnosisCount = 0;

for (const candidate of candidates) {
  const base = generateSapCp003PermanentPackage(candidate.prototypeId, candidate.seed);
  const expectedQl = SAP_CP003_PROTOTYPE_TO_PERMANENT_QL[candidate.prototypeId];

  assert.equal(candidate.permanentQlId, expectedQl);
  assert.equal(candidate.explanationReviewStatus, "CANDIDATE_READY_FOR_HUMAN_REVIEW");
  assert.equal(candidate.explanationValidation.ok, true, `${candidate.prototypeId}/${candidate.seed}: ${candidate.explanationValidation.errors.join(" | ")}`);
  assert.equal(candidate.stem, base.stem);
  assert.equal(candidate.canonicalAnswer, base.canonicalAnswer);
  assert.equal(candidate.verifierAnswer, base.verifierAnswer);
  assert.equal(candidate.correctIndex, base.correctIndex);
  assert.deepEqual(candidate.options, base.options);
  assert.equal(candidate.explanation.stepByStep.length, base.explanation.steps.length);
  assert.equal(candidate.explanation.commonTraps.length, 3);
  assert.equal(new Set(candidate.explanation.commonTraps).size, 3);
  assert.ok(candidate.explanation.finalAnswer.includes(candidate.canonicalAnswer));
  assert.ok(!/generic fallback|one-size-fits-all/i.test(JSON.stringify(candidate.explanation)));
  assert.equal(candidate.lifecycle.contentStatus, "QUESTIONS_AND_ANSWERS_APPROVED_EXPLANATION_REVIEW_PENDING");
  assert.equal(candidate.lifecycle.active, false);
  assert.equal(candidate.lifecycle.questionStudioDiscoverable, false);
  assert.equal(candidate.lifecycle.questionBankWritable, false);
  assert.equal(candidate.lifecycle.testEligible, false);
  assert.equal(candidate.lifecycle.publiclyPublishable, false);

  qlCounts.set(expectedQl, (qlCounts.get(expectedQl) ?? 0) + 1);
  const fingerprints = fingerprintsByQl.get(expectedQl) ?? new Set<string>();
  fingerprints.add(candidate.explanationFingerprint);
  fingerprintsByQl.set(expectedQl, fingerprints);
  concepts.add(candidate.explanation.coreConcept);

  if (candidate.taskDirection === "INVERSE") inverseCount += 1;
  if (candidate.taskDirection === "COMPARISON") comparisonCount += 1;
  if (candidate.taskDirection === "SELECTION") selectionCount += 1;
  if (candidate.taskDirection === "DIAGNOSIS") diagnosisCount += 1;
}

for (const ql of SAP_CP003_PERMANENT_QL_IDS) {
  assert.equal(qlCounts.get(ql), 100, `${ql} must contribute exactly 100 explanation candidates.`);
  assert.ok((fingerprintsByQl.get(ql)?.size ?? 0) >= 30, `${ql} lacks explanation-level mathematical diversity.`);
}
assert.equal(concepts.size, 19);
assert.equal(inverseCount, 200);
assert.equal(comparisonCount, 100);
assert.equal(selectionCount, 100);
assert.equal(diagnosisCount, 100);

const review = generateSapCp003ExplanationReviewExport();
assert.equal(review.length, 57);
assert.equal(new Set(review.map((item) => item.permanentQlId)).size, 19);
assert.equal(new Set(review.map((item) => item.explanationFingerprint)).size, 57);
for (const ql of SAP_CP003_PERMANENT_QL_IDS) {
  assert.equal(review.filter((item) => item.permanentQlId === ql).length, 3);
}

assert.equal(SAP_CP003_EXPLANATION_REVIEW_STATE.active, false);
assert.equal(SAP_CP003_EXPLANATION_REVIEW_STATE.questionStudioDiscoverable, false);
assert.equal(SAP_CP003_EXPLANATION_REVIEW_STATE.questionBankWritable, false);
assert.equal(SAP_CP003_EXPLANATION_REVIEW_STATE.testEligible, false);
assert.equal(SAP_CP003_EXPLANATION_REVIEW_STATE.publiclyPublishable, false);

console.log(JSON.stringify({
  status: "PASS_SAP_CP003_EXPLANATION_REVIEW_AUTHORITY",
  permanentQlRange: SAP_CP003_EXPLANATION_REVIEW_STATE.permanentQlRange,
  permanentQlCount: SAP_CP003_PERMANENT_QL_IDS.length,
  candidatesTested: candidates.length,
  reviewRecords: review.length,
  uniqueReviewExplanations: new Set(review.map((item) => item.explanationFingerprint)).size,
  inverseCandidates: inverseCount,
  comparisonCandidates: comparisonCount,
  selectionCandidates: selectionCount,
  diagnosisCandidates: diagnosisCount,
  explanationReview: SAP_CP003_EXPLANATION_REVIEW_STATE.explanationReview,
  lifecycle: "INACTIVE",
}, null, 2));
