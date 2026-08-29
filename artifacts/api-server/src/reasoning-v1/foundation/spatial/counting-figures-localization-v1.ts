import {
  generateCountingFiguresPermanentEnglishQuestionV1,
  type CountingFiguresPermanentEnglishQuestionV1,
} from "./counting-figures-permanent-english-runtime-v1";
import { FCT_001_ENGLISH_FREEZE_AUTHORITY_V1 } from "./counting-figures-english-freeze-v1";
import type {
  CountingFigureDistractorKindV1,
  CountingFigureTargetShapeV1,
} from "./counting-figures-production-generator-v1";

export type CountingFiguresLocalizedLanguageV1 = "hi" | "pa";
export type CountingFiguresLocalizedLocaleV1 = "hi-IN" | "pa-IN";

export type CountingFiguresLocalizedQuestionV1 = Readonly<
  Omit<CountingFiguresPermanentEnglishQuestionV1, "language" | "locale" | "permanentQlTitle" | "stem" | "explanation"> & {
    language: CountingFiguresLocalizedLanguageV1;
    locale: CountingFiguresLocalizedLocaleV1;
    permanentQlTitle: string;
    stem: string;
    explanation: Readonly<{
      observation: string;
      rule: string;
      application: string;
      check: string;
    }>;
    localization: Readonly<{
      authorityId: "FCT-001-HI-PA-LOCALIZATION-V1";
      englishFreezeAuthorityId: typeof FCT_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId;
      sourceEnglishContentFingerprint: string;
      sourceEnglishGeometryFingerprint: string;
      reviewOnly: true;
      frozen: false;
    }>;
  }
>;

export const FCT_001_LOCALIZATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "FCT-001-HI-PA-LOCALIZATION-V1" as const,
  chapterCode: "FCT-001" as const,
  candidateId: "FCT-CAND-A-CLOSED-POLYGON-ENUMERATION" as const,
  permanentQlId: "SPA-QL-042" as const,
  englishFreezeAuthorityId: FCT_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  supportedLanguages: ["hi", "pa"] as const,
  supportedLocales: ["hi-IN", "pa-IN"] as const,
  localizationStyle: "SIMPLE_STUDENT_FIRST_SEMANTIC_QUESTION_SPECIFIC_WORDING" as const,
  status: "REVIEW_ONLY_LOCALIZATION_CANDIDATE" as const,
  graphInvariant: true,
  diagramInvariant: true,
  targetShapeInvariant: true,
  optionOrderInvariant: true,
  optionValuesInvariant: true,
  correctCountInvariant: true,
  constructionExpectedCountInvariant: true,
  correctIndexInvariant: true,
  distractorEvidenceInvariant: true,
  permanentQlIdInvariant: true,
  candidateIdInvariant: true,
  chapterCodeInvariant: true,
  motifIdentityInvariant: true,
  structuralVariantInvariant: true,
  difficultyInvariant: true,
  geometryFingerprintInvariant: true,
  structuralFingerprintInvariant: true,
  canonicalContentFingerprintInvariant: true,
  stemVariantInvariant: true,
  questionStudioRegistered: false,
  persistenceAllowed: false,
  questionBankWritable: false,
  testEligible: false,
  automaticPublication: false,
} as const);

if (!FCT_001_ENGLISH_FREEZE_AUTHORITY_V1.governance.englishFrozen) {
  throw new Error("FCT-001 localization requires the English runtime to be frozen.");
}
if (!FCT_001_ENGLISH_FREEZE_AUTHORITY_V1.governance.hindiPunjabiGenerationAllowed) {
  throw new Error("FCT-001 English freeze does not authorize Hindi/Punjabi generation.");
}

const HI_QL_TITLE = "बंद आकृतियों की व्यवस्थित गिनती";
const PA_QL_TITLE = "ਬੰਦ ਆਕ੍ਰਿਤੀਆਂ ਦੀ ਵਿਵਸਥਿਤ ਗਿਣਤੀ";

type LocalNouns = Readonly<{
  count: string;
  plural: string;
}>;

const HI_NOUNS: Readonly<Record<CountingFigureTargetShapeV1, LocalNouns>> = Object.freeze({
  TRIANGLE: { count: "त्रिभुज", plural: "त्रिभुजों" },
  SQUARE: { count: "वर्ग", plural: "वर्गों" },
  RECTANGLE: { count: "आयत", plural: "आयतों" },
  QUADRILATERAL: { count: "चतुर्भुज", plural: "चतुर्भुजों" },
});

const PA_NOUNS: Readonly<Record<CountingFigureTargetShapeV1, LocalNouns>> = Object.freeze({
  TRIANGLE: { count: "ਤਿਕੋਣ", plural: "ਤਿਕੋਣਾਂ" },
  SQUARE: { count: "ਵਰਗ", plural: "ਵਰਗਾਂ" },
  RECTANGLE: { count: "ਆਇਤ", plural: "ਆਇਤਾਂ" },
  QUADRILATERAL: { count: "ਚਤੁਰਭੁਜ", plural: "ਚਤੁਰਭੁਜਾਂ" },
});

function hiStem(targetShape: CountingFigureTargetShapeV1, variant: number): string {
  const noun = HI_NOUNS[targetShape];
  const stems = [
    `दी गई आकृति में कुल कितने ${noun.count} हैं?`,
    `आकृति में मौजूद ${noun.plural} की कुल संख्या गिनिए।`,
    `पूरी आकृति में बने ${noun.plural} की संख्या ज्ञात कीजिए।`,
    `इस आकृति में कितने अलग-अलग ${noun.count} बनाए जा सकते हैं?`,
    `छोटे भागों से बने बड़े ${noun.plural} को भी शामिल करके कुल संख्या गिनिए।`,
    `चित्र में ${noun.plural} की कुल संख्या कितनी है?`,
    `आकृति को ध्यान से देखिए। इसमें कुल कितने ${noun.count} हैं?`,
    `आकृति में मौजूद ${noun.plural} की सही कुल संख्या चुनिए।`,
  ] as const;
  return stems[variant] ?? stems[0];
}

function paStem(targetShape: CountingFigureTargetShapeV1, variant: number): string {
  const noun = PA_NOUNS[targetShape];
  const stems = [
    `ਦਿੱਤੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ${noun.count} ਹਨ?`,
    `ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਮੌਜੂਦ ${noun.plural} ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਕਰੋ।`,
    `ਪੂਰੀ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਬਣੇ ${noun.plural} ਦੀ ਗਿਣਤੀ ਲੱਭੋ।`,
    `ਇਸ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਕਿੰਨੇ ਵੱਖ-ਵੱਖ ${noun.count} ਬਣਦੇ ਹਨ?`,
    `ਛੋਟੇ ਹਿੱਸਿਆਂ ਤੋਂ ਬਣੇ ਵੱਡੇ ${noun.plural} ਨੂੰ ਵੀ ਸ਼ਾਮਲ ਕਰਕੇ ਕੁੱਲ ਗਿਣਤੀ ਕਰੋ।`,
    `ਚਿੱਤਰ ਵਿੱਚ ${noun.plural} ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`,
    `ਆਕ੍ਰਿਤੀ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖੋ। ਇਸ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ${noun.count} ਹਨ?`,
    `ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਮੌਜੂਦ ${noun.plural} ਦੀ ਸਹੀ ਕੁੱਲ ਗਿਣਤੀ ਚੁਣੋ।`,
  ] as const;
  return stems[variant] ?? stems[0];
}

function groupBreakdown(source: CountingFiguresPermanentEnglishQuestionV1): string {
  const match = source.explanation.application.match(/contain (.+?) figures\./i);
  if (match?.[1]) return match[1];
  return String(source.correctCount);
}

function hiDistractor(kind: CountingFigureDistractorKindV1): string {
  if (kind === "SMALLEST_ONLY") return "केवल सबसे छोटी आकृतियाँ गिनी गई हैं";
  if (kind === "OMIT_LARGEST") return "सबसे बड़ा संयुक्त आकार छूट गया है";
  if (kind === "MISS_COMPOSITE_CLASS") return "कुछ संयुक्त आकारों का पूरा वर्ग छूट गया है";
  if (kind === "DOUBLE_COUNT_LARGEST") return "सबसे बड़े आकार को दो बार गिना गया है";
  return "गिनती सही उत्तर के बहुत पास है, लेकिन एक आकृति कम या अधिक गिनी गई है";
}

function paDistractor(kind: CountingFigureDistractorKindV1): string {
  if (kind === "SMALLEST_ONLY") return "ਸਿਰਫ਼ ਸਭ ਤੋਂ ਛੋਟੀਆਂ ਆਕ੍ਰਿਤੀਆਂ ਗਿਣੀਆਂ ਗਈਆਂ ਹਨ";
  if (kind === "OMIT_LARGEST") return "ਸਭ ਤੋਂ ਵੱਡੀ ਮਿਲੀ-ਜੁਲੀ ਆਕ੍ਰਿਤੀ ਛੱਡ ਦਿੱਤੀ ਗਈ ਹੈ";
  if (kind === "MISS_COMPOSITE_CLASS") return "ਕੁਝ ਮਿਲੀਆਂ-ਜੁਲੀਆਂ ਆਕ੍ਰਿਤੀਆਂ ਦਾ ਪੂਰਾ ਵਰਗ ਗਿਣਤੀ ਵਿੱਚ ਰਹਿ ਗਿਆ ਹੈ";
  if (kind === "DOUBLE_COUNT_LARGEST") return "ਸਭ ਤੋਂ ਵੱਡੀ ਆਕ੍ਰਿਤੀ ਨੂੰ ਦੋ ਵਾਰ ਗਿਣਿਆ ਗਿਆ ਹੈ";
  return "ਗਿਣਤੀ ਸਹੀ ਉੱਤਰ ਦੇ ਨੇੜੇ ਹੈ, ਪਰ ਇੱਕ ਆਕ੍ਰਿਤੀ ਘੱਟ ਜਾਂ ਵੱਧ ਗਿਣੀ ਗਈ ਹੈ";
}

function nearestDistractor(source: CountingFiguresPermanentEnglishQuestionV1) {
  return source.optionEvidence
    .filter((entry): entry is typeof source.optionEvidence[number] & { kind: CountingFigureDistractorKindV1 } => entry.kind !== "CORRECT")
    .toSorted((a, b) => Math.abs(a.value - source.correctCount) - Math.abs(b.value - source.correctCount))[0];
}

function hiExplanation(source: CountingFiguresPermanentEnglishQuestionV1) {
  const noun = HI_NOUNS[source.targetShape];
  const breakdown = groupBreakdown(source);
  const nearest = nearestDistractor(source);
  return Object.freeze({
    observation: `केवल सबसे छोटी दिखाई देने वाली आकृतियों पर न रुकें। ${noun.plural} को छोटे से बड़े आकार या फैलाव के क्रम में देखना है।`,
    rule: `हर अलग बंद ${noun.count} को केवल एक बार गिनें। पहले छोटे ${noun.count} गिनें, फिर उनसे मिलकर बनने वाले बड़े ${noun.count} जोड़ें।`,
    application: `आकार/फैलाव के अनुसार समूहों की गिनती ${breakdown} है। इन्हें जोड़ने पर कुल ${source.correctCount} ${noun.count} मिलते हैं।`,
    check: nearest
      ? `नज़दीकी विकल्प ${nearest.value} में गलती यह है कि ${hiDistractor(nearest.kind)}। पूरी जाँच के बाद सही कुल संख्या ${source.correctCount} है।`
      : `हर आकार को दोबारा जाँचने पर कुल ${source.correctCount} ${noun.count} मिलते हैं।`,
  });
}

function paExplanation(source: CountingFiguresPermanentEnglishQuestionV1) {
  const noun = PA_NOUNS[source.targetShape];
  const breakdown = groupBreakdown(source);
  const nearest = nearestDistractor(source);
  return Object.freeze({
    observation: `ਸਿਰਫ਼ ਸਭ ਤੋਂ ਛੋਟੀਆਂ ਦਿਖਾਈ ਦੇਣ ਵਾਲੀਆਂ ਆਕ੍ਰਿਤੀਆਂ 'ਤੇ ਨਾ ਰੁਕੋ। ${noun.plural} ਨੂੰ ਛੋਟੇ ਤੋਂ ਵੱਡੇ ਆਕਾਰ ਜਾਂ ਫੈਲਾਅ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਵੇਖਣਾ ਹੈ।`,
    rule: `ਹਰ ਵੱਖਰੇ ਬੰਦ ${noun.count} ਨੂੰ ਸਿਰਫ਼ ਇੱਕ ਵਾਰ ਗਿਣੋ। ਪਹਿਲਾਂ ਛੋਟੇ ${noun.count} ਗਿਣੋ, ਫਿਰ ਉਨ੍ਹਾਂ ਤੋਂ ਮਿਲ ਕੇ ਬਣਦੇ ਵੱਡੇ ${noun.count} ਜੋੜੋ।`,
    application: `ਆਕਾਰ/ਫੈਲਾਅ ਅਨੁਸਾਰ ਸਮੂਹਾਂ ਦੀ ਗਿਣਤੀ ${breakdown} ਹੈ। ਇਨ੍ਹਾਂ ਨੂੰ ਜੋੜਨ 'ਤੇ ਕੁੱਲ ${source.correctCount} ${noun.count} ਮਿਲਦੇ ਹਨ।`,
    check: nearest
      ? `ਨੇੜਲੇ ਵਿਕਲਪ ${nearest.value} ਵਿੱਚ ਗਲਤੀ ਇਹ ਹੈ ਕਿ ${paDistractor(nearest.kind)}। ਪੂਰੀ ਜਾਂਚ ਤੋਂ ਬਾਅਦ ਸਹੀ ਕੁੱਲ ਗਿਣਤੀ ${source.correctCount} ਹੈ।`
      : `ਹਰ ਆਕਾਰ ਨੂੰ ਦੁਬਾਰਾ ਜਾਂਚਣ 'ਤੇ ਕੁੱਲ ${source.correctCount} ${noun.count} ਮਿਲਦੇ ਹਨ।`,
  });
}

export function localizeCountingFiguresPermanentQuestionV1(input: Readonly<{
  seed: string;
  language: CountingFiguresLocalizedLanguageV1;
  targetShape?: CountingFigureTargetShapeV1;
}>): CountingFiguresLocalizedQuestionV1 {
  const source = generateCountingFiguresPermanentEnglishQuestionV1({
    seed: input.seed,
    targetShape: input.targetShape,
  });
  const isHindi = input.language === "hi";
  return Object.freeze({
    ...source,
    permanentQlTitle: isHindi ? HI_QL_TITLE : PA_QL_TITLE,
    stem: isHindi ? hiStem(source.targetShape, source.stemVariant) : paStem(source.targetShape, source.stemVariant),
    explanation: isHindi ? hiExplanation(source) : paExplanation(source),
    language: input.language,
    locale: isHindi ? "hi-IN" : "pa-IN",
    localization: Object.freeze({
      authorityId: FCT_001_LOCALIZATION_AUTHORITY_V1.authorityId,
      englishFreezeAuthorityId: FCT_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      sourceEnglishContentFingerprint: source.contentFingerprint,
      sourceEnglishGeometryFingerprint: source.geometryFingerprint,
      reviewOnly: true,
      frozen: false,
    }),
  });
}
