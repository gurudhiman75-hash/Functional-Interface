import assert from "node:assert/strict";

import { listReasoningV1QuestionStudioReviewPackages } from "../../../question-studio-review-registry";
import { RNK_CP001_LOCALIZATION_REVIEW_V4_VERSION } from "./RNK-CP-001/cp001-localization-review-v4";
import { RNK_CP002_LOCALIZATION_REVIEW_V2_VERSION } from "./RNK-CP-002/cp002-localization-review-v2";
import { RNK_CP003_LOCALIZATION_REVIEW_V4_VERSION } from "./RNK-CP-003/cp003-localization-review-v4";
import { RNK_CP004_LOCALIZATION_REVIEW_V6_VERSION } from "./RNK-CP-004/cp004-localization-review-v6";
import { RNK_CP005_LOCALIZATION_REVIEW_V3_VERSION } from "./RNK-CP-005/cp005-localization-review-v3";
import { RNK_CP006_LOCALIZATION_REVIEW_V1_VERSION } from "./RNK-CP-006/cp006-localization-review-v1";
import { RNK_CP007_LOCALIZATION_REVIEW_VERSION } from "./RNK-CP-007/cp007-localization-review-v1";
import {
  RNK_CP008_NEXT_AVAILABLE_QL,
  RNK_CP008_PERMANENT_QLS_ALLOCATED,
} from "./RNK-CP-008/cp008-adapter-caselet-closure-v1";
import { RNK_001_CURRENT_MAIN_DEEP_AUDIT_V1 as audit } from "./rnk-001-current-main-deep-audit-v1";

assert.equal(audit.status, "DEEP_AUDIT_TECHNICALLY_COMPLETE__MULTILINGUAL_REVIEW_GATE");
assert.equal(audit.permanentQlCount, 42);
assert.equal(audit.permanentQlRange, "RNK-QL-001..042");
assert.equal(audit.nextAvailableQl, "RNK-QL-043");
assert.equal(audit.ql043Allocated, false);
assert.equal(RNK_CP008_PERMANENT_QLS_ALLOCATED, 0);
assert.equal(RNK_CP008_NEXT_AVAILABLE_QL, "RNK-QL-043");

assert.equal(RNK_CP001_LOCALIZATION_REVIEW_V4_VERSION, audit.localizationReviewAuthorities.cp001);
assert.equal(RNK_CP002_LOCALIZATION_REVIEW_V2_VERSION, audit.localizationReviewAuthorities.cp002);
assert.equal(RNK_CP003_LOCALIZATION_REVIEW_V4_VERSION, audit.localizationReviewAuthorities.cp003);
assert.equal(RNK_CP004_LOCALIZATION_REVIEW_V6_VERSION, audit.localizationReviewAuthorities.cp004);
assert.equal(RNK_CP005_LOCALIZATION_REVIEW_V3_VERSION, audit.localizationReviewAuthorities.cp005);
assert.equal(RNK_CP006_LOCALIZATION_REVIEW_V1_VERSION, audit.localizationReviewAuthorities.cp006);
assert.equal(RNK_CP007_LOCALIZATION_REVIEW_VERSION, audit.localizationReviewAuthorities.cp007);

for (const [dimension, status] of Object.entries(audit.auditDimensions)) {
  assert.match(String(status), /^PASS/u, dimension);
}

const packages = listReasoningV1QuestionStudioReviewPackages();
assert.equal(
  packages.some((entry) => String((entry as { packageId?: unknown }).packageId ?? "").toUpperCase() === "RNK-001"),
  false,
  "RNK-001 must remain outside the live review registry until its dedicated activation gate opens.",
);

assert.equal(audit.lifecycle.englishContentFrozen, true);
assert.equal(audit.lifecycle.multilingualFreezeGranted, false);
assert.equal(audit.lifecycle.humanLanguageReviewRequired, true);
assert.equal(audit.lifecycle.directQuestionStudioPackageRegistered, false);
assert.equal(audit.lifecycle.persistenceEnabled, false);
assert.equal(audit.lifecycle.questionBankStatus, "NOT_STORED");
assert.equal(audit.lifecycle.questionBankWritable, false);
assert.equal(audit.lifecycle.testEligible, false);
assert.equal(audit.lifecycle.mockTestEligible, false);
assert.equal(audit.lifecycle.publiclyPublishable, false);
assert.equal(audit.lifecycle.productionReleaseAuthorized, false);

assert.equal(audit.currentAuditDecision.reopenEnglishSemanticDiscovery, false);
assert.equal(audit.currentAuditDecision.allocateQl043, false);
assert.equal(audit.currentAuditDecision.activateQuestionStudio, false);
assert.equal(audit.currentAuditDecision.activateProductDelivery, false);

console.log(JSON.stringify({
  verdict: "PASS_RNK_001_CURRENT_MAIN_DEEP_AUDIT",
  permanentQlRange: audit.permanentQlRange,
  ql043Allocated: audit.ql043Allocated,
  localization: "CP001..CP007 HI/PA REVIEW CANDIDATES",
  questionStudio: "LOCKED_NOT_REGISTERED",
  delivery: "LOCKED",
}, null, 2));
