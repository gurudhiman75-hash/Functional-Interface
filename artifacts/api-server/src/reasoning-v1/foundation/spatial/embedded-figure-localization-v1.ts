import {
  generateEmbeddedFigurePermanentEnglishQuestionV1,
  type EmbeddedFigurePermanentEnglishQuestionV1,
} from "./embedded-figure-permanent-english-runtime-v1";
import { EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1 } from "./embedded-figure-english-freeze-v1";
import type { EmbeddedDistractorKindV1 } from "./embedded-figure-production-generator-v1";

export type EmbeddedFigureLocalizedLanguageV1 = "hi" | "pa";
export type EmbeddedFigureLocalizedLocaleV1 = "hi-IN" | "pa-IN";

export type EmbeddedFigureLocalizedQuestionV1 = Readonly<
  Omit<EmbeddedFigurePermanentEnglishQuestionV1, "language" | "locale" | "permanentQlTitle" | "stem" | "explanation"> & {
    language: EmbeddedFigureLocalizedLanguageV1;
    locale: EmbeddedFigureLocalizedLocaleV1;
    permanentQlTitle: string;
    stem: string;
    explanation: Readonly<{
      observation: string;
      rule: string;
      application: string;
      check: string;
    }>;
    localization: Readonly<{
      authorityId: "EMB-001-HI-PA-LOCALIZATION-V1";
      englishFreezeAuthorityId: typeof EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.authorityId;
      sourceEnglishContentFingerprint: string;
      sourceEnglishGeometryFingerprint: string;
      reviewOnly: true;
      frozen: false;
      activationBlockedUntilEnglishFreezeCiGreen: true;
    }>;
  }
>;

export const EMBEDDED_FIGURE_LOCALIZATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "EMB-001-HI-PA-LOCALIZATION-V1" as const,
  chapterCode: "EMB-001" as const,
  proposalId: "EMB-PROP-01" as const,
  permanentQlId: "SPA-QL-041" as const,
  englishFreezeAuthorityId: EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  supportedLanguages: ["hi", "pa"] as const,
  supportedLocales: ["hi-IN", "pa-IN"] as const,
  localizationStyle: "SIMPLE_STUDENT_FIRST_SEMANTIC_QUESTION_SPECIFIC_WORDING" as const,
  status: "DRAFT_REVIEW_ONLY_PENDING_ENGLISH_FREEZE_CI_INFRASTRUCTURE" as const,
  activationPrerequisite: "EMB_001_ENGLISH_FREEZE_V1_CI_GREEN" as const,
  diagramsInvariant: true,
  targetGraphInvariant: true,
  optionGraphsInvariant: true,
  optionOrderInvariant: true,
  answerInvariant: true,
  permanentQlIdInvariant: true,
  proposalIdInvariant: true,
  chapterCodeInvariant: true,
  equivalencePolicyInvariant: true,
  motifIdentityInvariant: true,
  difficultyInvariant: true,
  geometryFingerprintInvariant: true,
  canonicalContentFingerprintInvariant: true,
  stemVariantInvariant: true,
  questionStudioRegistered: false,
  questionBankWritable: false,
  testEligible: false,
  automaticPublication: false,
} as const);

const HI_QL_TITLE = "बिना घुमाए छिपी हुई आकृति पहचानना";
const PA_QL_TITLE = "ਬਿਨਾਂ ਘੁਮਾਏ ਲੁਕੀ ਹੋਈ ਆਕ੍ਰਿਤੀ ਪਛਾਣਨਾ";

const HI_STEMS = Object.freeze([
  "उस विकल्प को चुनिए जिसमें दी गई प्रश्न-आकृति बिना घुमाए छिपी हुई है।",
  "किस विकल्प में प्रश्न-आकृति बिना घुमाए एक भाग के रूप में मौजूद है?",
  "उस विकल्प को पहचानिए जिसमें दी गई आकृति उसी दिशा में छिपी हुई है।",
  "आकृति का आकार अलग हो सकता है। किस विकल्प में इसकी पूरी रचना बिना घुमाए मौजूद है?",
  "उस विकल्प को चुनिए जिसमें दी गई आकृति की सभी आवश्यक रेखाएँ और जोड़ उसी दिशा में मौजूद हैं।",
  "किस विकल्प में दी गई आकृति एक भाग के रूप में ठीक उसी तरह छिपी है? आकृति को घुमाना नहीं है।",
  "दी गई आकृति को विकल्पों में रेखा-दर-रेखा मिलाइए। कौन सा विकल्प इसकी पूरी रचना और दिशा बनाए रखता है?",
  "उस विकल्प को चुनिए जिसमें प्रश्न-आकृति ठीक दिखाई गई दिशा में मौजूद है। अतिरिक्त रेखाएँ हो सकती हैं, पर आकृति को घुमाना नहीं है।",
] as const);

const PA_STEMS = Object.freeze([
  "ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਦਿੱਤੀ ਪ੍ਰਸ਼ਨ-ਆਕ੍ਰਿਤੀ ਬਿਨਾਂ ਘੁਮਾਏ ਲੁਕੀ ਹੋਈ ਹੈ।",
  "ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ਪ੍ਰਸ਼ਨ-ਆਕ੍ਰਿਤੀ ਬਿਨਾਂ ਘੁਮਾਏ ਇੱਕ ਹਿੱਸੇ ਵਜੋਂ ਮੌਜੂਦ ਹੈ?",
  "ਉਹ ਵਿਕਲਪ ਲੱਭੋ ਜਿਸ ਵਿੱਚ ਦਿੱਤੀ ਆਕ੍ਰਿਤੀ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਲੁਕੀ ਹੋਈ ਹੈ।",
  "ਆਕ੍ਰਿਤੀ ਦਾ ਆਕਾਰ ਵੱਖਰਾ ਹੋ ਸਕਦਾ ਹੈ। ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ਇਸਦੀ ਪੂਰੀ ਬਣਤਰ ਬਿਨਾਂ ਘੁਮਾਏ ਮੌਜੂਦ ਹੈ?",
  "ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਦਿੱਤੀ ਆਕ੍ਰਿਤੀ ਦੀਆਂ ਸਾਰੀਆਂ ਲੋੜੀਂਦੀਆਂ ਰੇਖਾਵਾਂ ਅਤੇ ਜੋੜ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਮੌਜੂਦ ਹਨ।",
  "ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ਦਿੱਤੀ ਆਕ੍ਰਿਤੀ ਇੱਕ ਹਿੱਸੇ ਵਜੋਂ ਬਿਲਕੁਲ ਉਸੇ ਤਰ੍ਹਾਂ ਲੁਕੀ ਹੋਈ ਹੈ? ਆਕ੍ਰਿਤੀ ਨੂੰ ਘੁਮਾਉਣਾ ਨਹੀਂ ਹੈ।",
  "ਦਿੱਤੀ ਆਕ੍ਰਿਤੀ ਨੂੰ ਵਿਕਲਪਾਂ ਵਿੱਚ ਰੇਖਾ-ਦਰ-ਰੇਖਾ ਮਿਲਾਓ। ਕਿਹੜਾ ਵਿਕਲਪ ਇਸਦੀ ਪੂਰੀ ਬਣਤਰ ਅਤੇ ਦਿਸ਼ਾ ਕਾਇਮ ਰੱਖਦਾ ਹੈ?",
  "ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਪ੍ਰਸ਼ਨ-ਆਕ੍ਰਿਤੀ ਬਿਲਕੁਲ ਦਿੱਤੀ ਹੋਈ ਦਿਸ਼ਾ ਵਿੱਚ ਮੌਜੂਦ ਹੈ। ਵਾਧੂ ਰੇਖਾਵਾਂ ਹੋ ਸਕਦੀਆਂ ਹਨ, ਪਰ ਆਕ੍ਰਿਤੀ ਨੂੰ ਘੁਮਾਉਣਾ ਨਹੀਂ ਹੈ।",
] as const);

function highestDegree(question: EmbeddedFigurePermanentEnglishQuestionV1): number {
  const degree = new Map(question.targetGraph.vertices.map((vertex) => [vertex.id, 0]));
  for (const edge of question.targetGraph.edges) {
    degree.set(edge.a, (degree.get(edge.a) ?? 0) + 1);
    degree.set(edge.b, (degree.get(edge.b) ?? 0) + 1);
  }
  return Math.max(...degree.values());
}

function hiTrap(kind: EmbeddedDistractorKindV1): string {
  if (kind === "ROTATION_TRAP") return "आकृति घुमाई गई है";
  if (kind === "REFLECTION_TRAP") return "आकृति दर्पण-प्रतिबिंब की तरह उलटी है";
  if (kind === "MISSING_EDGE") return "एक आवश्यक रेखाखंड गायब है";
  if (kind === "WRONG_INCIDENCE") return "एक रेखा गलत बिंदु से जुड़ी है";
  return "आकृति असमान रूप से खींची या सिकुड़ी हुई है";
}

function paTrap(kind: EmbeddedDistractorKindV1): string {
  if (kind === "ROTATION_TRAP") return "ਆਕ੍ਰਿਤੀ ਘੁਮਾਈ ਹੋਈ ਹੈ";
  if (kind === "REFLECTION_TRAP") return "ਆਕ੍ਰਿਤੀ ਸ਼ੀਸ਼ੇ ਦੇ ਪਰਛਾਵੇਂ ਵਾਂਗ ਉਲਟੀ ਹੈ";
  if (kind === "MISSING_EDGE") return "ਇੱਕ ਲੋੜੀਂਦਾ ਰੇਖਾ-ਖੰਡ ਗਾਇਬ ਹੈ";
  if (kind === "WRONG_INCIDENCE") return "ਇੱਕ ਰੇਖਾ ਗਲਤ ਬਿੰਦੂ ਨਾਲ ਜੁੜੀ ਹੈ";
  return "ਆਕ੍ਰਿਤੀ ਨੂੰ ਅਸਮਾਨ ਤਰੀਕੇ ਨਾਲ ਖਿੱਚਿਆ ਜਾਂ ਸੁਕੋੜਿਆ ਗਿਆ ਹੈ";
}

function hiExplanation(question: EmbeddedFigurePermanentEnglishQuestionV1) {
  const degree = highestDegree(question);
  const edgeCount = question.targetGraph.edges.length;
  const observation = degree >= 3
    ? `पहले उस मुख्य जोड़ को पहचानें जहाँ ${degree} रेखाखंड मिलते हैं। वहाँ से आकृति के सभी ${edgeCount} आवश्यक रेखाखंडों को क्रम से मिलाएँ।`
    : `पहले आकृति के खास मोड़ को पहचानें। वहाँ से सभी ${edgeCount} आवश्यक रेखाखंडों को क्रम से मिलाएँ।`;
  const traps = question.distractorKindsByIndex.filter((kind): kind is EmbeddedDistractorKindV1 => kind !== "CORRECT").map(hiTrap);
  return Object.freeze({
    observation,
    rule: "पूरी प्रश्न-आकृति उसी दिशा में मिलनी चाहिए। उसका आकार बदल सकता है और विकल्प में अतिरिक्त रेखाएँ हो सकती हैं, लेकिन कोई आवश्यक रेखाखंड या जोड़ बदलना नहीं चाहिए।",
    application: `विकल्प ${question.answer} में सभी आवश्यक रेखाएँ और जोड़ सही अनुपात में उसी दिशा में मिलते हैं। बाकी विकल्पों में ${traps.join(", ")}।`,
    check: `आकृति को रेखा-दर-रेखा मिलाने पर केवल एक पूरा और सही मेल मिलता है: विकल्प ${question.answer}।`,
  });
}

function paExplanation(question: EmbeddedFigurePermanentEnglishQuestionV1) {
  const degree = highestDegree(question);
  const edgeCount = question.targetGraph.edges.length;
  const observation = degree >= 3
    ? `ਪਹਿਲਾਂ ਉਸ ਮੁੱਖ ਜੋੜ ਨੂੰ ਪਛਾਣੋ ਜਿੱਥੇ ${degree} ਰੇਖਾ-ਖੰਡ ਮਿਲਦੇ ਹਨ। ਉੱਥੋਂ ਆਕ੍ਰਿਤੀ ਦੇ ਸਾਰੇ ${edgeCount} ਲੋੜੀਂਦੇ ਰੇਖਾ-ਖੰਡ ਕ੍ਰਮਵਾਰ ਮਿਲਾਓ।`
    : `ਪਹਿਲਾਂ ਆਕ੍ਰਿਤੀ ਦੇ ਖਾਸ ਮੋੜ ਨੂੰ ਪਛਾਣੋ। ਉੱਥੋਂ ਸਾਰੇ ${edgeCount} ਲੋੜੀਂਦੇ ਰੇਖਾ-ਖੰਡ ਕ੍ਰਮਵਾਰ ਮਿਲਾਓ।`;
  const traps = question.distractorKindsByIndex.filter((kind): kind is EmbeddedDistractorKindV1 => kind !== "CORRECT").map(paTrap);
  return Object.freeze({
    observation,
    rule: "ਪੂਰੀ ਪ੍ਰਸ਼ਨ-ਆਕ੍ਰਿਤੀ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਮਿਲਣੀ ਚਾਹੀਦੀ ਹੈ। ਇਸਦਾ ਆਕਾਰ ਬਦਲ ਸਕਦਾ ਹੈ ਅਤੇ ਵਿਕਲਪ ਵਿੱਚ ਵਾਧੂ ਰੇਖਾਵਾਂ ਹੋ ਸਕਦੀਆਂ ਹਨ, ਪਰ ਕੋਈ ਲੋੜੀਂਦਾ ਰੇਖਾ-ਖੰਡ ਜਾਂ ਜੋੜ ਨਹੀਂ ਬਦਲਣਾ ਚਾਹੀਦਾ।",
    application: `ਵਿਕਲਪ ${question.answer} ਵਿੱਚ ਸਾਰੀਆਂ ਲੋੜੀਂਦੀਆਂ ਰੇਖਾਵਾਂ ਅਤੇ ਜੋੜ ਠੀਕ ਅਨੁਪਾਤ ਵਿੱਚ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਮਿਲਦੇ ਹਨ। ਬਾਕੀ ਵਿਕਲਪਾਂ ਵਿੱਚ ${traps.join(", ")}।`,
    check: `ਆਕ੍ਰਿਤੀ ਨੂੰ ਰੇਖਾ-ਦਰ-ਰੇਖਾ ਮਿਲਾਉਣ ਤੇ ਸਿਰਫ਼ ਇੱਕ ਪੂਰਾ ਅਤੇ ਸਹੀ ਮੇਲ ਮਿਲਦਾ ਹੈ: ਵਿਕਲਪ ${question.answer}।`,
  });
}

export function localizeEmbeddedFigureQuestionV1(
  source: EmbeddedFigurePermanentEnglishQuestionV1,
  language: EmbeddedFigureLocalizedLanguageV1,
): EmbeddedFigureLocalizedQuestionV1 {
  if (source.permanentQlId !== "SPA-QL-041" || source.chapterCode !== "EMB-001" || source.proposalId !== "EMB-PROP-01") {
    throw new Error(`EMB localization received an out-of-scope source question: ${source.seed}.`);
  }
  if (source.language !== "en" || source.locale !== "en-IN") {
    throw new Error(`EMB localization source must be frozen English: ${source.seed}.`);
  }
  if (source.equivalencePolicy !== "FIXED_ORIENTATION") {
    throw new Error(`EMB localization source policy changed: ${source.seed}.`);
  }
  const hindi = language === "hi";
  const stem = (hindi ? HI_STEMS : PA_STEMS)[source.stemVariant];
  if (!stem) throw new Error(`EMB localization has no stem for variant ${source.stemVariant}.`);
  return Object.freeze({
    ...source,
    permanentQlTitle: hindi ? HI_QL_TITLE : PA_QL_TITLE,
    language,
    locale: hindi ? "hi-IN" : "pa-IN",
    stem,
    explanation: hindi ? hiExplanation(source) : paExplanation(source),
    localization: Object.freeze({
      authorityId: EMBEDDED_FIGURE_LOCALIZATION_AUTHORITY_V1.authorityId,
      englishFreezeAuthorityId: EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      sourceEnglishContentFingerprint: source.contentFingerprint,
      sourceEnglishGeometryFingerprint: source.geometryFingerprint,
      reviewOnly: true,
      frozen: false,
      activationBlockedUntilEnglishFreezeCiGreen: true,
    }),
  });
}

export function generateEmbeddedFigureLocalizedQuestionV1(seed: string, language: EmbeddedFigureLocalizedLanguageV1): EmbeddedFigureLocalizedQuestionV1 {
  return localizeEmbeddedFigureQuestionV1(generateEmbeddedFigurePermanentEnglishQuestionV1(seed), language);
}

export function generateEmbeddedFigureLocalizedPairV1(seed: string): Readonly<{
  en: EmbeddedFigurePermanentEnglishQuestionV1;
  hi: EmbeddedFigureLocalizedQuestionV1;
  pa: EmbeddedFigureLocalizedQuestionV1;
}> {
  const en = generateEmbeddedFigurePermanentEnglishQuestionV1(seed);
  return Object.freeze({
    en,
    hi: localizeEmbeddedFigureQuestionV1(en, "hi"),
    pa: localizeEmbeddedFigureQuestionV1(en, "pa"),
  });
}
