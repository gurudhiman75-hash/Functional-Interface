import { canonicalDigest } from "../../../SEA-001/canonical.ts";
import {
  SEA002_CP007_AUTHORITY_TO_PERMANENT_QL,
  SEA002_CP007_PERMANENT_QL_REGISTRY,
} from "../permanent/registry.ts";
import type { Sea002Cp007ProductionCaselet } from "../production-caselet-v1.ts";

export type Sea002Cp007TranslatedLocale = "hi-IN" | "pa-IN";

export const SEA002_CP007_TRANSLATION_TARGET_LOCALES = Object.freeze([
  "hi-IN",
  "pa-IN",
] as const satisfies readonly Sea002Cp007TranslatedLocale[]);

export const SEA002_CP007_LOCALIZATION_AUTHORITY = "SEA002_CP007_MIXED_FACING_HI_PA_PARITY_V1" as const;
export const SEA002_CP007_LOCALIZATION_REVIEW_BLOCKER = "CP007_HINDI_PUNJABI_REVIEW_PENDING" as const;

export const SEA002_CP007_GLOSSARY = Object.freeze([
  { concept: "POSITION", en: "position", hi: "स्थान / स्थिति", pa: "ਸਥਾਨ / ਸਥਿਤੀ" },
  { concept: "UPPER_ROW", en: "upper row", hi: "ऊपरी पंक्ति", pa: "ਉੱਪਰਲੀ ਕਤਾਰ" },
  { concept: "LOWER_ROW", en: "lower row", hi: "निचली पंक्ति", pa: "ਹੇਠਲੀ ਕਤਾਰ" },
  { concept: "NORTH", en: "north", hi: "उत्तर", pa: "ਉੱਤਰ" },
  { concept: "SOUTH", en: "south", hi: "दक्षिण", pa: "ਦੱਖਣ" },
  { concept: "LEFT", en: "left", hi: "बाईं ओर", pa: "ਖੱਬੇ ਪਾਸੇ" },
  { concept: "RIGHT", en: "right", hi: "दाईं ओर", pa: "ਸੱਜੇ ਪਾਸੇ" },
  { concept: "SAME_DIRECTION", en: "same direction", hi: "एक ही दिशा", pa: "ਇੱਕੋ ਦਿਸ਼ਾ" },
  { concept: "OPPOSITE_DIRECTION", en: "opposite directions", hi: "विपरीत दिशाएँ", pa: "ਉਲਟ ਦਿਸ਼ਾਵਾਂ" },
  { concept: "SAME_ROW", en: "same row", hi: "एक ही पंक्ति", pa: "ਇੱਕੋ ਕਤਾਰ" },
  { concept: "OPPOSITE_SEAT", en: "sits opposite", hi: "ठीक सामने बैठता/बैठती है", pa: "ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ" },
  { concept: "DIAGONAL", en: "diagonally", hi: "तिरछे", pa: "ਤਿਰਛੇ" },
  { concept: "IMMEDIATE", en: "immediately", hi: "तुरंत", pa: "ਤੁਰੰਤ" },
  { concept: "FACING", en: "faces", hi: "मुख करके बैठा/बैठी है", pa: "ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ" },
  { concept: "INFER", en: "infer / determine", hi: "निर्धारित करें", pa: "ਨਿਰਧਾਰਤ ਕਰੋ" },
] as const);

export const SEA002_CP007_LOCALIZATION_PROTECTED_FIELDS = Object.freeze([
  "caseletId",
  "seed",
  "width",
  "authorityKey",
  "participants",
  "rowGroups",
  "rowMembershipMode",
  "clues",
  "correctIndex",
  "mathematicalFingerprint",
  "lifecycle",
  "permanentQlId",
] as const);

export const SEA002_CP007_LOCALIZATION_READINESS = Object.freeze({
  status: "FOUNDATION_OPEN" as const,
  canonicalLocale: "en-IN" as const,
  targetLocales: SEA002_CP007_TRANSLATION_TARGET_LOCALES,
  localizationAuthority: SEA002_CP007_LOCALIZATION_AUTHORITY,
  semanticParityPolicy: "STRUCTURAL_PROJECTION_MUST_MATCH" as const,
  explanationParityPolicy: "FOLLOW_ENGLISH_VISUAL_DEDUCTION_PATH" as const,
  learnerTerminologyPolicy: "POSITION_NOT_COLUMN" as const,
  facingPolicy: "STATE_EVERY_DERIVED_FACING_BEFORE_USING_LEFT_RIGHT" as const,
  queryRealnessPolicy: "AUTH01_AND_AUTH04_QUERIES_MUST_REMAIN_INFERRED" as const,
  humanLanguageReviewRequired: true as const,
  humanReviewStatus: "PENDING" as const,
  activeEditorialBlockers: Object.freeze([SEA002_CP007_LOCALIZATION_REVIEW_BLOCKER] as const),
  productDeliveryUnlocked: false as const,
  questionStudioRegistered: false as const,
  questionBankWritable: false as const,
  productionStagingApproved: false as const,
  permanentQlCount: SEA002_CP007_PERMANENT_QL_REGISTRY.length,
  glossaryFingerprint: canonicalDigest(SEA002_CP007_GLOSSARY),
  protectedFieldFingerprint: canonicalDigest(SEA002_CP007_LOCALIZATION_PROTECTED_FIELDS),
});

export function cp007CanonicalParityProjection(caselet: Sea002Cp007ProductionCaselet) {
  return {
    caseletId: caselet.caseletId,
    seed: caselet.seed,
    width: caselet.width,
    authorityKey: caselet.authorityKey,
    permanentQlId: SEA002_CP007_AUTHORITY_TO_PERMANENT_QL[caselet.authorityKey],
    participants: caselet.participants,
    rowGroups: caselet.rowGroups,
    rowMembershipMode: caselet.rowMembershipMode,
    clues: caselet.clues,
    correctIndex: caselet.correctIndex,
    mathematicalFingerprint: caselet.mathematicalFingerprint,
    lifecycle: caselet.lifecycle,
  };
}

export function cp007CanonicalParityFingerprint(caselet: Sea002Cp007ProductionCaselet): string {
  return canonicalDigest(cp007CanonicalParityProjection(caselet));
}

export function assertCp007LocalizationFoundationOpen(): void {
  if (SEA002_CP007_LOCALIZATION_READINESS.status !== "FOUNDATION_OPEN") {
    throw new Error("SEA-002 CP007 localization foundation is not open.");
  }
  if (SEA002_CP007_LOCALIZATION_READINESS.humanReviewStatus !== "PENDING") {
    throw new Error("SEA-002 CP007 localization must not claim approval before Hindi/Punjabi review.");
  }
  if (!SEA002_CP007_LOCALIZATION_READINESS.activeEditorialBlockers.includes(SEA002_CP007_LOCALIZATION_REVIEW_BLOCKER)) {
    throw new Error("SEA-002 CP007 localization review blocker disappeared prematurely.");
  }
  if (SEA002_CP007_LOCALIZATION_READINESS.productDeliveryUnlocked
    || SEA002_CP007_LOCALIZATION_READINESS.questionStudioRegistered
    || SEA002_CP007_LOCALIZATION_READINESS.questionBankWritable
    || SEA002_CP007_LOCALIZATION_READINESS.productionStagingApproved) {
    throw new Error("SEA-002 CP007 localization readiness must not unlock downstream product delivery.");
  }
  if (SEA002_CP007_PERMANENT_QL_REGISTRY.some((entry) =>
    entry.active
    || entry.questionStudioDiscoverable
    || entry.questionBankWritable
    || entry.testEligible
    || entry.mockTestEligible
    || entry.productionStaging
    || entry.publiclyPublishable
    || entry.automaticStudentPublication)) {
    throw new Error("SEA-002 CP007 permanent QLs must remain product-inactive during localization.");
  }
}
