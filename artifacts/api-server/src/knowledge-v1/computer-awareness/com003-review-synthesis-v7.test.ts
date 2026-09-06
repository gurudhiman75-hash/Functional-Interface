import { strict as assert } from "node:assert";

import { COM003_EXAM_REALNESS_AUDIT_V2 } from "./com003-exam-realness-audit-v2";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V7, buildCom003EnglishReviewCorpusV7 } from "./com003-review-synthesis-v7";

assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V7.length, 228);
assert.equal(new Set(COM003_ENGLISH_REVIEW_CORPUS_V7.map((q) => q.qlId)).size, 19);

for (const ql of COM003_PERMANENT_QLS) {
  const questions = COM003_ENGLISH_REVIEW_CORPUS_V7.filter((q) => q.qlId === ql.qlId);
  assert.equal(questions.length, 12);
  assert.deepEqual(
    Object.fromEntries([...new Set(questions.map((q) => q.examSurfaceFamily))].sort().map((family) => [family, questions.filter((q) => q.examSurfaceFamily === family).length])),
    {
      CONTRAST_DISCRIMINATION: 3,
      DIRECT_RECALL: 3,
      EXAMPLE_RECOGNITION: 3,
      FUNCTIONAL_APPLICATION: 3,
    },
    `${ql.qlId} must expose all four exam surface families`,
  );
  assert.equal(new Set(questions.map((q) => q.stem.trim().toLowerCase())).size, 12, `${ql.qlId} stems must be fully unique`);
}

for (const q of COM003_ENGLISH_REVIEW_CORPUS_V7) {
  assert.equal(q.options.length, 4);
  assert.equal(new Set(q.options.map((option) => option.trim().toLowerCase())).size, 4);
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer);
  assert.equal(q.reviewOnly, true);
  assert.equal(q.runtimeRegistered, false);
  assert.equal(q.stemAuthority, "COM003_V7_EXAM_SURFACE_FAMILY_AUTHORITY");
}

assert.deepEqual(
  buildCom003EnglishReviewCorpusV7({ perQl: 12, seedPrefix: "v7-replay" }),
  buildCom003EnglishReviewCorpusV7({ perQl: 12, seedPrefix: "v7-replay" }),
);

assert.equal(COM003_EXAM_REALNESS_AUDIT_V2.valid, true, JSON.stringify(COM003_EXAM_REALNESS_AUDIT_V2.blockers, null, 2));

console.log("[COM003-ENGLISH-REVIEW-SYNTHESIS-V7]", {
  questionCount: 228,
  qlCount: 19,
  familiesPerQl: 4,
  questionsPerFamilyPerQl: 3,
  technicalStatus: COM003_EXAM_REALNESS_AUDIT_V2.status,
  blockerCount: COM003_EXAM_REALNESS_AUDIT_V2.blockerCount,
  advisoryCount: COM003_EXAM_REALNESS_AUDIT_V2.advisoryCount,
  productReviewStatus: "AWAITING_USER_REVIEW",
});
