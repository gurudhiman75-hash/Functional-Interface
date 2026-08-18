import { type IntCp006QlId } from "./cp006-si-ci-relations-runtime-v4-final";
import {
  INT_CP006_ENGLISH_FREEZE_ID,
  generateIntCp006EnglishFrozenQuestion,
} from "./cp006-si-ci-relations-v1-frozen";
import {
  INT_CP006_ENGLISH_EXPLANATION_AMENDMENT,
  generateIntCp006EnglishExplanationReviewQuestion,
} from "./cp006-english-explanation-amendment-v1";
import { INT_CP006_EXPANDED_EXPLANATION_VERSION } from "./cp006-expanded-explanation-v4";

export const INT_CP006_ENGLISH_EXPLANATION_FREEZE_ID = "INT-CP-006-EN-EXPL-v1-frozen" as const;
export const INT_CP006_ENGLISH_EXPLANATION_FREEZE_APPROVAL = Object.freeze({
  authority: "PRODUCT_OWNER_APPROVED_CP006_EXPLANATIONS_V4_V7_2026_08_18" as const,
  approvedExplanationVersion: INT_CP006_EXPANDED_EXPLANATION_VERSION,
  approvedAmendment: INT_CP006_ENGLISH_EXPLANATION_AMENDMENT,
  preservedQuestionFreezeId: INT_CP006_ENGLISH_FREEZE_ID,
  approvedReviewHead: "89e08716bbdab9266c9b8df636c473b5c9d18fc1" as const,
  reviewWorkflowRun: 32111996290 as const,
  reviewArtifactId: 9315240963 as const,
  reviewArtifactDigest: "sha256:8890f824d29806172b404624cb060e90a0fca1e6b15438c3761c876d18eee8d2" as const,
  questionStudioActivationAuthorized: false as const,
});

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  }
  return Object.freeze(value);
}

export function generateIntCp006EnglishExplanationFrozenQuestion(qlId: IntCp006QlId, seed: string) {
  const originalFrozen = generateIntCp006EnglishFrozenQuestion(qlId, seed, "en-IN");
  const source = generateIntCp006EnglishExplanationReviewQuestion(qlId, seed);

  if (source.freezeId !== originalFrozen.freezeId || source.freezeId !== INT_CP006_ENGLISH_FREEZE_ID) {
    throw new Error(`${qlId}/${seed}: original English question freeze identity drift`);
  }
  if (
    source.enabled
    || source.stagingStatus !== "NOT_STAGED"
    || source.registrationStatus !== "NOT_REGISTERED"
    || source.questionStudioDiscoverable
    || source.questionBankStatus !== "NOT_STORED"
    || source.testEligibility !== "INELIGIBLE"
    || source.publiclyPublishable
  ) throw new Error(`${qlId}/${seed}: CP006 English explanation source delivery boundary is open`);

  return deepFreeze({
    ...source,
    explanationFreezeId: INT_CP006_ENGLISH_EXPLANATION_FREEZE_ID,
    explanationFreezeApproval: INT_CP006_ENGLISH_EXPLANATION_FREEZE_APPROVAL,
    editorialStatus: "ENGLISH_EXPLANATION_AMENDMENT_FROZEN" as const,
    approvalStatus: "APPROVED_ENGLISH_EXPLANATION_FROZEN" as const,
    allocationStatus: "INACTIVE_ENGLISH_EXPLANATION_FROZEN" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: true as const,
  });
}
