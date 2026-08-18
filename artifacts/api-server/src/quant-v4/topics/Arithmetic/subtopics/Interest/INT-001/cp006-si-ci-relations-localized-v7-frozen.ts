import { type IntCp006QlId } from "./cp006-si-ci-relations-runtime-v4-final";
import {
  INT_CP006_LOCALIZED_EXPLANATION_VERSION,
  generateIntCp006LocalizedExplanationReviewQuestion,
  type IntCp006LocalizedLocale,
} from "./cp006-si-ci-relations-localized-v7";
import { INT_CP006_EXPANDED_EXPLANATION_VERSION } from "./cp006-expanded-explanation-v4";

export const INT_CP006_LOCALIZED_V7_FREEZE_ID = "INT-CP-006-HI-PA-v7-frozen" as const;
export const INT_CP006_LOCALIZED_V7_FREEZE_APPROVAL = Object.freeze({
  authority: "PRODUCT_OWNER_APPROVED_CP006_EXPLANATIONS_V4_V7_2026_08_18" as const,
  approvedExplanationVersion: INT_CP006_EXPANDED_EXPLANATION_VERSION,
  approvedLocalizedVersion: INT_CP006_LOCALIZED_EXPLANATION_VERSION,
  learnerQls: Object.freeze([
    "INT-QL-096", "INT-QL-097", "INT-QL-098", "INT-QL-099", "INT-QL-100", "INT-QL-101", "INT-QL-102",
    "INT-QL-103", "INT-QL-104", "INT-QL-105", "INT-QL-106", "INT-QL-107", "INT-QL-108",
  ] as const),
  locales: Object.freeze(["hi-IN", "pa-IN"] as const),
  approvedReviewHead: "89e08716bbdab9266c9b8df636c473b5c9d18fc1" as const,
  reviewWorkflowRun: 32111996290 as const,
  reviewArtifactId: 9315240963 as const,
  reviewArtifactDigest: "sha256:8890f824d29806172b404624cb060e90a0fca1e6b15438c3761c876d18eee8d2" as const,
  punjabiCompoundInterestTerm: "ਮਿਸ਼ਰਤ ਵਿਆਜ" as const,
  deprecatedPunjabiCompoundInterestTerm: "ਚੱਕਰਵੱਧੀ" as const,
  questionStudioActivationAuthorized: false as const,
});

export type IntCp006LocalizedV7FreezeLocale = IntCp006LocalizedLocale;

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

function learnerText(question: any): string {
  return [
    question.presentation?.markdown,
    question.presentation?.stem,
    question.explanation?.keyIdea,
    ...(question.explanation?.steps ?? []),
    question.explanation?.commonMistake,
    question.explanation?.finalAnswer,
  ].filter(Boolean).join(" ");
}

export function generateIntCp006LocalizedV7FrozenQuestion(
  qlId: IntCp006QlId,
  seed: string,
  locale: IntCp006LocalizedV7FreezeLocale,
) {
  const source = generateIntCp006LocalizedExplanationReviewQuestion(qlId, seed, locale);
  if (
    source.enabled
    || source.stagingStatus !== "NOT_STAGED"
    || source.registrationStatus !== "NOT_REGISTERED"
    || source.questionStudioDiscoverable
    || source.questionBankStatus !== "NOT_STORED"
    || source.testEligibility !== "INELIGIBLE"
    || source.publiclyPublishable
  ) throw new Error(`${qlId}/${seed}/${locale}: CP006 localized V7 source delivery boundary is open`);

  if (locale === "pa-IN" && learnerText(source).includes("ਚੱਕਰਵੱਧੀ")) {
    throw new Error(`${qlId}/${seed}/${locale}: deprecated Punjabi compound-interest terminology survived approved V7`);
  }

  return deepFreeze({
    ...source,
    freezeId: INT_CP006_LOCALIZED_V7_FREEZE_ID,
    freezeApproval: INT_CP006_LOCALIZED_V7_FREEZE_APPROVAL,
    editorialStatus: "MULTILINGUAL_EXPLANATION_FROZEN" as const,
    approvalStatus: "APPROVED_MULTILINGUAL_EXPLANATION_FROZEN" as const,
    allocationStatus: "INACTIVE_MULTILINGUAL_EXPLANATION_FROZEN" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: true as const,
  });
}
