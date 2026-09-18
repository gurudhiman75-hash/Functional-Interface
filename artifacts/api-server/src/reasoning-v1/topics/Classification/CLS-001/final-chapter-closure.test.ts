import assert from "node:assert/strict";

import { CLS001_ENGLISH_EDITORIAL_APPROVAL } from "./english-editorial-approval";
import {
  CLS001_FINAL_CHAPTER_CLOSURE,
  buildCls001FinalClosureAudit,
} from "./final-chapter-closure";
import {
  CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE,
} from "./question-studio-review";

const closure = CLS001_FINAL_CHAPTER_CLOSURE;
const audit = buildCls001FinalClosureAudit();

assert.equal(closure.chapterId, "CLS-001");
assert.equal(closure.productCode, "REAS-CLS");
assert.equal(closure.status, "CONTENT_REVIEW_CLOSED");
assert.equal(closure.checkpointCount, 8);
assert.equal(closure.checkpoints.length, 8);

const expectedQls = Array.from(
  { length: 13 },
  (_, index) => `CLS-QL-${String(index + 1).padStart(3, "0")}`,
);

assert.deepEqual(audit.qlIds, expectedQls);
assert.deepEqual(
  audit.qlIds,
  Object.keys(CLS001_ENGLISH_EDITORIAL_APPROVAL.qlQuestionCounts),
);
assert.equal(closure.permanentQlRange.first, "CLS-QL-001");
assert.equal(closure.permanentQlRange.last, "CLS-QL-013");
assert.equal(closure.permanentQlRange.count, 13);

const checkpointIds = closure.checkpoints.map(
  (checkpoint) => checkpoint.checkpointId,
);
assert.equal(new Set(checkpointIds).size, 8);
assert.deepEqual(
  checkpointIds,
  Array.from(
    { length: 8 },
    (_, index) => `CLS-CP-${String(index + 1).padStart(3, "0")}`,
  ),
);

const cp008 = closure.checkpoints.at(-1);
assert.equal(cp008?.checkpointId, "CLS-CP-008");
assert.deepEqual(cp008?.qlIds, []);
assert.equal(audit.cp008.permanentQlCount, 0);
assert.deepEqual(audit.cp008.permanentQlIds, []);
assert.equal(audit.cp008.newRuntimeGeneratorCount, 0);

assert.equal(
  closure.checkpoints[2].nativeAuthority,
  "MULTILINGUAL_REVIEW_FROZEN",
);
assert.equal(
  closure.checkpoints[3].nativeAuthority,
  "MULTILINGUAL_REVIEW_FROZEN",
);
assert.equal(
  closure.checkpoints[4].nativeAuthority,
  "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
);
assert.equal(
  closure.checkpoints[5].nativeAuthority,
  "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
);
assert.equal(
  closure.checkpoints[6].nativeAuthority,
  "MULTILINGUAL_REVIEW_FROZEN",
);

assert.equal(
  closure.lifecycle.sourceRuntimeQuestionStudioDiscoverable,
  false,
);
assert.equal(
  closure.lifecycle.questionStudioReviewIntegrationAuthorized,
  true,
);
assert.equal(closure.lifecycle.questionStudioReviewOnly, true);
assert.equal(closure.lifecycle.questionBankWritable, false);
assert.equal(closure.lifecycle.mockTestEligible, false);
assert.equal(closure.lifecycle.testEligible, false);
assert.equal(closure.lifecycle.studentDeliveryAuthorized, false);
assert.equal(closure.lifecycle.publiclyPublishable, false);
assert.equal(closure.lifecycle.automaticPromotionAuthorized, false);

assert.equal(
  CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount,
  13,
);
assert.equal(
  CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioVisible,
  true,
);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(
  CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable,
  false,
);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(
  CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible,
  false,
);
assert.equal(
  CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable,
  false,
);

assert.equal(audit.cp008.questionStudioDiscoverable, false);
assert.equal(audit.cp008.questionBankWritable, false);
assert.equal(audit.cp008.testEligible, false);
assert.equal(audit.cp008.publiclyPublishable, false);
assert.ok(closure.reopenOnlyFor.length >= 7);

console.log("CLS-001 final chapter closure guard passed.", {
  permanentQls: audit.qlIds.length,
  checkpoints: audit.checkpointCount,
  cp008NewQls: audit.cp008.permanentQlCount,
  questionStudioReviewOnly:
    closure.lifecycle.questionStudioReviewOnly,
  deliveryLocked: !closure.lifecycle.studentDeliveryAuthorized,
});
