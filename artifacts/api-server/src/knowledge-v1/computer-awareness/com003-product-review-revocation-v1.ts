import { COM003_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com003-english-freeze-v1";
import { COM003_EXAM_REALNESS_AUDIT_V1 } from "./com003-exam-realness-audit-v1";

export const COM003_PRODUCT_REVIEW_REVOCATION_V1 = Object.freeze({
  authorityId: "COM-003-PRODUCT-REVIEW-REVOCATION-V1" as const,
  chapterCode: "COM-003" as const,
  decisionDate: "2026-09-02" as const,
  decision: "REJECTED_STEMS_NOT_EXAM_LEVEL" as const,
  reason: "The learner-facing English stems in the V4 frozen corpus do not meet SSC, Banking and Punjab-state competitive-exam wording standards." as const,
  revokedAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  revokedGeneratorVersion: COM003_ENGLISH_FREEZE_AUTHORITY_V1.sourceGeneratorVersion,
  revokedDownstreamScope: Object.freeze([
    "V4 English product freeze",
    "localization authorization derived from V4",
    "V4-derived Hindi/Punjabi localization as current chapter authority",
    "V4-derived Question Studio review corpus as an approval candidate",
    "any future difficulty, bank, test or publication authority derived from V4",
  ] as const),
  remediationCandidate: Object.freeze({
    generatorVersion: "COM003_ENGLISH_REVIEW_CORPUS_V6" as const,
    questionCount: COM003_EXAM_REALNESS_AUDIT_V1.questionCount,
    qlCount: COM003_EXAM_REALNESS_AUDIT_V1.qlCount,
    technicalStatus: COM003_EXAM_REALNESS_AUDIT_V1.status,
    productReviewStatus: "AWAITING_USER_REVIEW" as const,
  }),
  effectiveGovernance: Object.freeze({
    englishFrozen: false,
    englishContentMutationAllowed: true,
    hindiPunjabiLocalizationAuthorized: false,
    localizationFrozen: false,
    questionStudioReplacementAuthorized: false,
    questionBankWritesAuthorized: false,
    testEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    userProductApprovalRequired: true,
  }),
  nextGate: "COM003_V6_ENGLISH_EXAM_REALNESS_PRODUCT_REVIEW" as const,
});

export function assertCom003CurrentProductAuthorityV1() {
  if (COM003_PRODUCT_REVIEW_REVOCATION_V1.decision !== "REJECTED_STEMS_NOT_EXAM_LEVEL") {
    throw new Error("COM-003 V4 product rejection must remain explicit until a new English corpus is approved.");
  }
  if (COM003_PRODUCT_REVIEW_REVOCATION_V1.effectiveGovernance.englishFrozen) {
    throw new Error("COM-003 English cannot remain effectively frozen after V4 product rejection.");
  }
  if (COM003_PRODUCT_REVIEW_REVOCATION_V1.effectiveGovernance.hindiPunjabiLocalizationAuthorized) {
    throw new Error("COM-003 localization cannot proceed from the rejected V4 English product authority.");
  }
  if (COM003_PRODUCT_REVIEW_REVOCATION_V1.effectiveGovernance.questionStudioReplacementAuthorized) {
    throw new Error("COM-003 V6 cannot replace Question Studio before product approval.");
  }
  if (COM003_EXAM_REALNESS_AUDIT_V1.status !== "EXAM_REALNESS_REVIEW_CANDIDATE") {
    throw new Error(`COM-003 V6 must clear technical exam-realness checks before product review; got ${COM003_EXAM_REALNESS_AUDIT_V1.status}.`);
  }
  return true;
}
