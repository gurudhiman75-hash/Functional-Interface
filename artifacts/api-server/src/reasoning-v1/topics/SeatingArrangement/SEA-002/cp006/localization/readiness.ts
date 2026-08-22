import { canonicalDigest } from "../../../SEA-001/canonical.ts";
import { buildCp006EnglishReviewCorpus, cp006EnglishReviewFingerprint } from "../cp006-review-corpus.ts";
import { SEA002_CP006_ENGLISH_FREEZE, SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE } from "../permanent/freeze.ts";
import { SEA002_CP006_BLUEPRINT_TO_PERMANENT_QL, SEA002_CP006_PERMANENT_QL_REGISTRY } from "../permanent/registry.ts";
import type { Sea002Cp006Caselet } from "../types.ts";

export type Sea002Cp006TranslatedLocale = "hi-IN" | "pa-IN";

export const SEA002_CP006_TRANSLATION_TARGET_LOCALES = Object.freeze([
  "hi-IN",
  "pa-IN",
] as const satisfies readonly Sea002Cp006TranslatedLocale[]);

export const SEA002_CP006_LOCALIZATION_AUTHORITY = "SEA002_CP006_HI_PA_EXPLANATION_PARITY_REVIEW_CANDIDATE" as const;
export const SEA002_CP006_LOCALIZATION_HUMAN_REVIEW_BLOCKER = "CP006_HINDI_PUNJABI_HUMAN_REVIEW_PENDING" as const;

export const SEA002_CP006_SPATIAL_GLOSSARY = Object.freeze([
  { concept: "POSITION", en: "position", hi: "स्थान / स्थिति", pa: "ਸਥਾਨ / ਸਥਿਤੀ" },
  { concept: "UPPER_ROW", en: "upper row", hi: "ऊपरी पंक्ति", pa: "ਉੱਪਰਲੀ ਕਤਾਰ" },
  { concept: "LOWER_ROW", en: "lower row", hi: "निचली पंक्ति", pa: "ਹੇਠਲੀ ਕਤਾਰ" },
  { concept: "NORTH", en: "north", hi: "उत्तर", pa: "ਉੱਤਰ" },
  { concept: "SOUTH", en: "south", hi: "दक्षिण", pa: "ਦੱਖਣ" },
  { concept: "LEFT", en: "left", hi: "बाईं ओर", pa: "ਖੱਬੇ ਪਾਸੇ" },
  { concept: "RIGHT", en: "right", hi: "दाईं ओर", pa: "ਸੱਜੇ ਪਾਸੇ" },
  { concept: "SAME_ROW", en: "same row", hi: "एक ही पंक्ति", pa: "ਇੱਕੋ ਕਤਾਰ" },
  { concept: "DIFFERENT_ROW", en: "different rows", hi: "अलग-अलग पंक्तियाँ", pa: "ਵੱਖ-ਵੱਖ ਕਤਾਰਾਂ" },
  { concept: "OPPOSITE", en: "faces each other / opposite", hi: "एक-दूसरे के ठीक सामने", pa: "ਇੱਕ-ਦੂਜੇ ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ" },
  { concept: "DIAGONAL", en: "diagonally opposite", hi: "तिरछे सामने", pa: "ਤਿਰਛੇ ਸਾਹਮਣੇ" },
  { concept: "ADJACENT", en: "adjacent / immediate neighbour", hi: "पास-पास / निकटतम पड़ोसी", pa: "ਨਾਲ-ਨਾਲ / ਤੁਰੰਤ ਗੁਆਂਢੀ" },
  { concept: "NOT_ADJACENT", en: "not adjacent", hi: "पास-पास नहीं", pa: "ਨਾਲ-ਨਾਲ ਨਹੀਂ" },
  { concept: "BETWEEN", en: "between", hi: "बीच में", pa: "ਵਿਚਕਾਰ" },
  { concept: "END_POSITION", en: "end position", hi: "छोर का स्थान", pa: "ਸਿਰੇ ਵਾਲਾ ਸਥਾਨ" },
  { concept: "FROM_EITHER_END", en: "from either end", hi: "किसी भी छोर से", pa: "ਕਿਸੇ ਵੀ ਸਿਰੇ ਤੋਂ" },
  { concept: "PERSON_FACING", en: "person facing", hi: "जिस व्यक्ति के सामने", pa: "ਜਿਸ ਵਿਅਕਤੀ ਦੇ ਸਾਹਮਣੇ" },
  { concept: "CASE_ACCEPT", en: "case fits", hi: "स्थिति सही बैठती है", pa: "ਸਥਿਤੀ ਠੀਕ ਬੈਠਦੀ ਹੈ" },
  { concept: "CASE_REJECT", en: "case does not fit", hi: "स्थिति सही नहीं बैठती", pa: "ਸਥਿਤੀ ਠੀਕ ਨਹੀਂ ਬੈਠਦੀ" },
] as const);

export const SEA002_CP006_LOCALIZATION_PROTECTED_FIELDS = Object.freeze([
  "caseletId","packageId","checkpointId","blueprintAuthorityId","seed","people","state","clues","solutionCount","solverOracleAgreement","checkpointSkillCoverage","structuralFingerprint","queryContractId","answerType","answerDeterminingFactFingerprint","answerIndex","answer","option.value","option.isCorrect","option.misconceptionId","permanentQlId",
] as const);

export const SEA002_CP006_LOCALIZATION_READINESS = Object.freeze({
  status: "READY_FOR_TRANSLATION" as const,
  canonicalLocale: "en-IN" as const,
  targetLocales: SEA002_CP006_TRANSLATION_TARGET_LOCALES,
  localizationAuthority: SEA002_CP006_LOCALIZATION_AUTHORITY,
  semanticParityPolicy: "CANONICAL_PROJECTION_MUST_MATCH" as const,
  explanationParityPolicy: "FOLLOW_EXACT_APPROVED_ENGLISH_TEACHING_PATH" as const,
  learnerTerminologyPolicy: "POSITION_NOT_COLUMN" as const,
  learnerTextPolicy: "TRANSLATE_ONLY_AFTER_ENGLISH_FREEZE" as const,
  humanLanguageReviewRequired: true as const,
  humanReviewStatus: "PENDING" as const,
  activeEditorialBlockers: [SEA002_CP006_LOCALIZATION_HUMAN_REVIEW_BLOCKER] as const,
  productDeliveryUnlocked: false as const,
  productionStagingApproved: false as const,
  englishFreezeActive: SEA002_CP006_ENGLISH_FREEZE.freezeActive,
  englishFreezeFingerprint: SEA002_CP006_ENGLISH_FREEZE.approvedReviewFingerprint,
  permanentQlCount: SEA002_CP006_PERMANENT_QL_REGISTRY.length,
  glossaryFingerprint: canonicalDigest(SEA002_CP006_SPATIAL_GLOSSARY),
  protectedFieldFingerprint: canonicalDigest(SEA002_CP006_LOCALIZATION_PROTECTED_FIELDS),
});

export function cp006CanonicalParityProjection(caselet: Sea002Cp006Caselet) {
  return {
    caseletId: caselet.caseletId,
    packageId: caselet.packageId,
    checkpointId: caselet.checkpointId,
    blueprintAuthorityId: caselet.blueprintAuthorityId,
    permanentQlId: SEA002_CP006_BLUEPRINT_TO_PERMANENT_QL[caselet.blueprintAuthorityId],
    seed: caselet.seed,
    people: caselet.people,
    state: caselet.state,
    clues: caselet.clues,
    solutionCount: caselet.solutionCount,
    solverOracleAgreement: caselet.solverOracleAgreement,
    checkpointSkillCoverage: caselet.checkpointSkillCoverage,
    structuralFingerprint: caselet.structuralFingerprint,
    children: caselet.children.map((child) => ({
      questionOrder: child.questionOrder,
      queryContractId: child.queryContractId,
      answerType: child.answerType,
      answerDeterminingFactFingerprint: child.answerDeterminingFactFingerprint,
      answerIndex: child.answerIndex,
      answer: child.answer,
      options: child.options.map((option) => ({ value: option.value, isCorrect: option.isCorrect, misconceptionId: option.misconceptionId ?? null })),
    })),
  };
}

export function cp006CanonicalParityFingerprint(caselet: Sea002Cp006Caselet): string {
  return canonicalDigest(cp006CanonicalParityProjection(caselet));
}

export function assertCp006LocalizationFoundationStillBlocked(): void {
  if (SEA002_CP006_LOCALIZATION_READINESS.status !== "READY_FOR_TRANSLATION") {
    throw new Error("SEA-002 CP006 localization readiness unexpectedly changed.");
  }
  if (!SEA002_CP006_LOCALIZATION_READINESS.englishFreezeActive) {
    throw new Error("SEA-002 CP006 localization cannot proceed without the corrected frozen English authority.");
  }
  if (SEA002_CP006_LOCALIZATION_READINESS.humanReviewStatus !== "PENDING") {
    throw new Error("SEA-002 CP006 Hindi/Punjabi human review must remain pending at candidate stage.");
  }
  if (SEA002_CP006_LOCALIZATION_READINESS.productDeliveryUnlocked || SEA002_CP006_LOCALIZATION_READINESS.productionStagingApproved) {
    throw new Error("SEA-002 CP006 localization readiness cannot unlock product delivery or staging.");
  }
  if (SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.localizationFrozen
    || SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered
    || SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable
    || SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.mockTestEligible
    || SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.productionStaging
    || SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable) {
    throw new Error("SEA-002 CP006 localization candidate must not bypass downstream activation gates.");
  }
}

export function assertCp006LocalizationBindsToApprovedEnglish(): void {
  const corpus = buildCp006EnglishReviewCorpus();
  const current = cp006EnglishReviewFingerprint(corpus);
  if (current !== SEA002_CP006_LOCALIZATION_READINESS.englishFreezeFingerprint) {
    throw new Error(`SEA-002 CP006 localization source drift: frozen=${SEA002_CP006_LOCALIZATION_READINESS.englishFreezeFingerprint}, current=${current}`);
  }
  if (!SEA002_CP006_LOCALIZATION_READINESS.englishFreezeActive) {
    throw new Error("SEA-002 CP006 localization is blocked: corrected English freeze is inactive.");
  }
}
