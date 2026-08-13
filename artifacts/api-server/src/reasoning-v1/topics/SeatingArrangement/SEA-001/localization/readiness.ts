import { canonicalDigest } from "../canonical.ts";
import { SEA001_ENGLISH_FREEZE, SEA001_PERMANENT_INACTIVE_LIFECYCLE } from "../permanent/freeze.ts";
import { SEA001_PERMANENT_QL_REGISTRY } from "../permanent/registry.ts";
import type { AuditCaselet } from "../saturation/corpus.ts";

export type Sea001TranslatedLocale = "hi-IN" | "pa-IN";

export const SEA001_TRANSLATION_TARGET_LOCALES = Object.freeze([
  "hi-IN",
  "pa-IN",
] as const satisfies readonly Sea001TranslatedLocale[]);

export const SEA001_LOCALIZATION_AUTHORITY = "SEA001_HI_PA_LOCALISATION_REVIEW_CANDIDATE" as const;
export const SEA001_LOCALIZATION_HUMAN_REVIEW_BLOCKER = "HINDI_PUNJABI_HUMAN_REVIEW_PENDING" as const;

export const SEA001_SPATIAL_GLOSSARY = Object.freeze([
  { concept: "LEFT", en: "left", hi: "बायाँ / बाईं ओर", pa: "ਖੱਬਾ / ਖੱਬੇ ਪਾਸੇ" },
  { concept: "RIGHT", en: "right", hi: "दायाँ / दाईं ओर", pa: "ਸੱਜਾ / ਸੱਜੇ ਪਾਸੇ" },
  { concept: "IMMEDIATELY", en: "immediately", hi: "ठीक", pa: "ਤੁਰੰਤ / ਬਿਲਕੁਲ" },
  { concept: "CLOCKWISE", en: "clockwise", hi: "घड़ी की दिशा में", pa: "ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ" },
  { concept: "ANTICLOCKWISE", en: "anticlockwise", hi: "घड़ी की विपरीत दिशा में", pa: "ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ" },
  { concept: "ADJACENT", en: "adjacent / neighbour", hi: "पास-पास / पड़ोसी", pa: "ਨਾਲ-ਨਾਲ / ਗੁਆਂਢੀ" },
  { concept: "NOT_ADJACENT", en: "not adjacent", hi: "पास-पास नहीं", pa: "ਨਾਲ-ਨਾਲ ਨਹੀਂ" },
  { concept: "BETWEEN", en: "between", hi: "बीच में", pa: "ਵਿਚਕਾਰ" },
  { concept: "FACING", en: "facing", hi: "मुख करके", pa: "ਮੂੰਹ ਕਰਕੇ" },
  { concept: "CENTRE", en: "centre", hi: "केंद्र", pa: "ਕੇਂਦਰ" },
  { concept: "OUTWARD", en: "outward", hi: "बाहर की ओर", pa: "ਬਾਹਰ ਵੱਲ" },
  { concept: "OPPOSITE", en: "opposite", hi: "ठीक सामने", pa: "ਬਿਲਕੁਲ ਸਾਹਮਣੇ" },
  { concept: "EXTREME_END", en: "extreme end", hi: "अंतिम छोर", pa: "ਆਖਰੀ ਸਿਰਾ" },
  { concept: "MIDDLE", en: "middle", hi: "बीच की सीट", pa: "ਵਿਚਕਾਰਲੀ ਸੀਟ" },
  { concept: "SAME_FACING", en: "same direction", hi: "एक ही दिशा", pa: "ਇੱਕੋ ਦਿਸ਼ਾ" },
  { concept: "OPPOSITE_FACING", en: "opposite directions", hi: "विपरीत दिशाएँ", pa: "ਉਲਟ ਦਿਸ਼ਾਵਾਂ" },
  { concept: "CONDITIONAL_IF", en: "if", hi: "यदि", pa: "ਜੇ" },
  { concept: "CONDITIONAL_OTHERWISE", en: "otherwise", hi: "अन्यथा", pa: "ਨਹੀਂ ਤਾਂ" },
] as const);

export const SEA001_LOCALIZATION_PROTECTED_FIELDS = Object.freeze([
  "caseletId",
  "checkpointId",
  "blueprintAuthorityId",
  "seed",
  "clueSetFingerprint",
  "solutionPolicy",
  "solutionClassCount",
  "solutionStateClassCount",
  "queryFactFingerprints",
  "queryContractId",
  "answerType",
  "answerDeterminingFactFingerprint",
  "answerIndex",
  "answer",
  "option.semanticFingerprint",
  "option.isCorrect",
  "option.misconceptionId",
  "permanentQlId",
] as const);

export const SEA001_LOCALIZATION_READINESS = Object.freeze({
  status: "READY_FOR_TRANSLATION" as const,
  canonicalLocale: "en-IN" as const,
  targetLocales: SEA001_TRANSLATION_TARGET_LOCALES,
  localizationAuthority: SEA001_LOCALIZATION_AUTHORITY,
  semanticParityPolicy: "CANONICAL_PROJECTION_MUST_MATCH" as const,
  learnerTextPolicy: "TRANSLATE_AFTER_ENGLISH_FREEZE" as const,
  humanLanguageReviewRequired: true as const,
  humanReviewStatus: "PENDING" as const,
  activeEditorialBlockers: [SEA001_LOCALIZATION_HUMAN_REVIEW_BLOCKER] as const,
  productDeliveryUnlocked: false as const,
  productionStagingApproved: false as const,
  englishFreezeFingerprint: SEA001_ENGLISH_FREEZE.approvedReviewFingerprint,
  permanentQlCount: SEA001_PERMANENT_QL_REGISTRY.length,
  glossaryFingerprint: canonicalDigest(SEA001_SPATIAL_GLOSSARY),
  protectedFieldFingerprint: canonicalDigest(SEA001_LOCALIZATION_PROTECTED_FIELDS),
});

export function sea001CanonicalParityProjection(caselet: AuditCaselet) {
  return {
    caseletId: caselet.caseletId,
    checkpointId: caselet.checkpointId,
    blueprintAuthorityId: caselet.blueprintAuthorityId,
    seed: caselet.seed,
    clueSetFingerprint: caselet.clueSetFingerprint ?? null,
    solutionPolicy: caselet.solutionPolicy ?? null,
    solutionClassCount: caselet.solutionClassCount ?? null,
    solutionStateClassCount: caselet.solutionStateClassCount ?? null,
    solverOracleAgreement: caselet.solverOracleAgreement,
    queryFactFingerprints: caselet.queryFactFingerprints,
    checkpointSkillCoverage: caselet.checkpointSkillCoverage,
    crossQuestionLeakagePassed: caselet.crossQuestionLeakagePassed,
    children: caselet.children.map((child) => ({
      questionOrder: child.questionOrder,
      queryContractId: child.queryContractId,
      answerType: child.answerType,
      answerDeterminingFactFingerprint: child.answerDeterminingFactFingerprint,
      answerIndex: child.answerIndex,
      answer: child.answer,
      optionSemantics: child.options.map((option) => ({
        semanticFingerprint: option.semanticFingerprint,
        isCorrect: option.isCorrect,
        misconceptionId: option.misconceptionId ?? null,
        recomputation: option.recomputation,
      })),
    })),
  };
}

export function sea001CanonicalParityFingerprint(caselet: AuditCaselet): string {
  return canonicalDigest(sea001CanonicalParityProjection(caselet));
}

export function assertSea001LocalizationFoundationStillBlocked(): void {
  if (SEA001_LOCALIZATION_READINESS.humanReviewStatus !== "PENDING") {
    throw new Error("SEA-001 Hindi/Punjabi human language review must remain pending at localization-foundation stage.");
  }
  if (SEA001_LOCALIZATION_READINESS.productDeliveryUnlocked || SEA001_LOCALIZATION_READINESS.productionStagingApproved) {
    throw new Error("SEA-001 localization foundation cannot unlock product delivery or production staging.");
  }
  if (SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered
    || SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable
    || SEA001_PERMANENT_INACTIVE_LIFECYCLE.testEligible
    || SEA001_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable) {
    throw new Error("SEA-001 localization foundation must not bypass downstream activation gates.");
  }
}
