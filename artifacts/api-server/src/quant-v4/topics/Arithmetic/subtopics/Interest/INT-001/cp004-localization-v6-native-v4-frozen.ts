import { generateIntCp004V6NativeEditorialV4Question } from "./cp004-localization-v6-native-editorial-v4";
import type { IntCp004V6Locale, IntCp004V6LocalizedQuestion } from "./cp004-localization-v6-types";

export const INT_CP004_HI_PA_V6_V4_FREEZE_ID = "INT-CP-004-HI-PA-V6-v4-frozen" as const;

export const INT_CP004_HI_PA_V6_V4_APPROVAL = Object.freeze({
  approvalAuthority: "EXPLICIT_PRODUCT_OWNER_APPROVAL_2026_08_13" as const,
  approvalDate: "2026-08-13" as const,
  approvedContentHead: "38ad6fdd7cde2c155c2121fb554f9fa3d11016af" as const,
  approvedEditorialVersion: "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v4" as const,
  canonicalEnglishFreezeId: "INT-CP-004-EN-v2-frozen" as const,
  approvedWorkflowRunId: 31716094213 as const,
  approvedArtifactId: 9187335552 as const,
  approvedArtifactDigest: "sha256:a383c700b0cafa2ca63ccccaf56665913d55d1eb36e40fdd9e2b92f823b85934" as const,
  qlRange: "INT-QL-067..INT-QL-085" as const,
  qlCount: 19 as const,
  locales: Object.freeze(["hi-IN", "pa-IN"] as const),
  PunjabiCompoundInterest: "ਮਿਸ਼ਰਤ ਵਿਆਜ" as const,
  mathematics: "MATHJAX_LATEX" as const,
  stemStyle: "SLIGHTLY_WORDIER_EXAM_STYLE" as const,
});

export interface IntCp004HiPaV6V4FrozenLifecycle {
  readonly permanentQlId: IntCp004V6LocalizedQuestion["qlId"];
  readonly maturity: "MULTILINGUAL_FROZEN";
  readonly reviewStatus: "APPROVED_MULTILINGUAL_FROZEN";
  readonly enabled: false;
  readonly stagingStatus: "NOT_STAGED";
  readonly registrationStatus: "NOT_REGISTERED";
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

export type IntCp004HiPaV6V4FrozenQuestion = Omit<
  IntCp004V6LocalizedQuestion,
  "editorialStatus" | "approvalStatus" | "allocationStatus" | "lifecycle"
> & {
  readonly freezeId: typeof INT_CP004_HI_PA_V6_V4_FREEZE_ID;
  readonly editorialStatus: "MULTILINGUAL_FROZEN";
  readonly approvalStatus: "APPROVED_MULTILINGUAL_FROZEN";
  readonly allocationStatus: "INACTIVE_MULTILINGUAL_FROZEN";
  readonly permanentIdentityFrozen: true;
  readonly learnerContentFrozen: true;
  readonly approval: typeof INT_CP004_HI_PA_V6_V4_APPROVAL;
  readonly lifecycle: IntCp004HiPaV6V4FrozenLifecycle;
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return Object.freeze(value);
}

function assertApprovedSource(question: IntCp004V6LocalizedQuestion, locale: IntCp004V6Locale): void {
  if (
    question.editorialStatus !== "MULTILINGUAL_LOCALISATION_REVIEW"
    || question.approvalStatus !== "LOCALIZED_REVIEW_REQUIRED"
    || question.allocationStatus !== "INACTIVE_LOCALISATION_REVIEW"
  ) throw new Error(`${question.qlId}/${question.seed}/${locale}: approved V4 source lifecycle changed.`);

  if (
    question.enabled
    || question.stagingStatus !== "NOT_STAGED"
    || question.registrationStatus !== "NOT_REGISTERED"
    || question.questionStudioDiscoverable
    || question.questionBankStatus !== "NOT_STORED"
    || question.testEligibility !== "INELIGIBLE"
    || question.publiclyPublishable
  ) throw new Error(`${question.qlId}/${question.seed}/${locale}: approved V4 source delivery boundary is open.`);

  const learnerText = [
    question.stem,
    ...question.options.map((option) => option.text),
    question.explanation.whatAsked,
    ...question.explanation.steps,
    question.explanation.commonMistake,
  ].join("\n");
  if (locale === "pa-IN" && /ਚੱਕਰਵੱਧੀ ਵਿਆਜ/u.test(learnerText)) {
    throw new Error(`${question.qlId}/${question.seed}/${locale}: rejected Punjabi term in approved V4 source.`);
  }
  const formulaPrefix = locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
  if (!question.explanation.steps[0]?.startsWith(formulaPrefix) || !/\$[^$]+\\(?:frac|dfrac|left)/u.test(question.explanation.steps[0])) {
    throw new Error(`${question.qlId}/${question.seed}/${locale}: approved V4 source lost LaTeX formula-first standard.`);
  }
}

export function generateIntCp004HiPaV6V4FrozenQuestion(
  qlId: IntCp004V6LocalizedQuestion["qlId"],
  seed: string,
  locale: IntCp004V6Locale,
): IntCp004HiPaV6V4FrozenQuestion {
  const source = generateIntCp004V6NativeEditorialV4Question(qlId, seed, locale);
  assertApprovedSource(source, locale);

  const lifecycle: IntCp004HiPaV6V4FrozenLifecycle = {
    permanentQlId: qlId,
    maturity: "MULTILINGUAL_FROZEN",
    reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  };

  return deepFreeze({
    ...source,
    freezeId: INT_CP004_HI_PA_V6_V4_FREEZE_ID,
    editorialStatus: "MULTILINGUAL_FROZEN",
    approvalStatus: "APPROVED_MULTILINGUAL_FROZEN",
    allocationStatus: "INACTIVE_MULTILINGUAL_FROZEN",
    permanentIdentityFrozen: true,
    learnerContentFrozen: true,
    approval: INT_CP004_HI_PA_V6_V4_APPROVAL,
    lifecycle,
  });
}
