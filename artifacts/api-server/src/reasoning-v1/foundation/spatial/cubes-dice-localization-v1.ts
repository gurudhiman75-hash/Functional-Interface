import { CND_001_ENGLISH_FREEZE_AUTHORITY_V1 } from "./cubes-dice-english-freeze-v1";
import {
  generateCubesDicePermanentEnglishQuestionV1,
  type CubesDicePermanentEnglishQuestionV1,
} from "./cubes-dice-permanent-english-runtime-v1";
import type { CubesDiceCp004TaskKindV1 } from "./cubes-dice-cp004-distractors-allocation-v1";

export type CubesDiceLocalizedLanguageV1 = "hi" | "pa";
export type CubesDiceLocalizedLocaleV1 = "hi-IN" | "pa-IN";

export type CubesDiceLocalizedQuestionV1 = Readonly<
  Omit<CubesDicePermanentEnglishQuestionV1, "language" | "locale" | "permanentQlTitle" | "stem" | "explanation"> & {
    language: CubesDiceLocalizedLanguageV1;
    locale: CubesDiceLocalizedLocaleV1;
    permanentQlTitle: string;
    stem: string;
    explanation: Readonly<{
      whatIsGiven: string;
      howToReason: string;
      conclusion: string;
    }>;
    localization: Readonly<{
      authorityId: "CND-001-HI-PA-LOCALIZATION-V1";
      englishFreezeAuthorityId: typeof CND_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId;
      sourceEnglishSeed: string;
      sourceEnglishStemVariantId: string;
      reviewOnly: true;
      frozen: false;
    }>;
  }
>;

export const CND_001_LOCALIZATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-HI-PA-LOCALIZATION-V1" as const,
  chapterCode: "CND-001" as const,
  permanentQlIds: ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045"] as const,
  englishFreezeAuthorityId: CND_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  supportedLanguages: ["hi", "pa"] as const,
  supportedLocales: ["hi-IN", "pa-IN"] as const,
  localizationStyle: "NATURAL_EXAM_LANGUAGE_QUESTION_SPECIFIC_NOT_LITERAL" as const,
  localizedFieldsOnly: CND_001_ENGLISH_FREEZE_AUTHORITY_V1.localizationContract.localizedFieldsOnly,
  status: "REVIEW_ONLY_LOCALIZATION_CANDIDATE" as const,
  invariants: Object.freeze({
    permanentQlId: true,
    chapterCode: true,
    taskKind: true,
    candidateId: true,
    difficulty: true,
    scene: true,
    solverEvidence: true,
    stimulusSvgs: true,
    renderer: true,
    options: true,
    correctIndex: true,
    answer: true,
    distractorEvidence: true,
    stemVariantId: true,
  }),
  governance: Object.freeze({
    reviewOnly: true,
    localizationFrozen: false,
    questionStudioRegistrationAuthorized: false,
    persistenceAllowed: false,
    questionBankWritesAuthorized: false,
    testEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    generatedItemManualApprovalRequired: true,
  }),
  nextGate: "CND_001_HINDI_PUNJABI_LOCALIZATION_FREEZE_V1" as const,
});

if (!CND_001_ENGLISH_FREEZE_AUTHORITY_V1.governance.englishFrozen) {
  throw new Error("CND localization requires frozen English runtime.");
}
if (!CND_001_ENGLISH_FREEZE_AUTHORITY_V1.governance.hindiPunjabiGenerationAllowed) {
  throw new Error("CND English freeze does not authorize Hindi/Punjabi generation.");
}

const TITLES = Object.freeze({
  hi: Object.freeze({
    "SPA-QL-043": "घुमाव के आधार पर पासे के फलकों का संबंध ज्ञात करना",
    "SPA-QL-044": "घन के जाल को मोड़कर फलकों का संबंध ज्ञात करना",
    "SPA-QL-045": "रंगे हुए घन में छोटे घनों की गिनती करना",
  }),
  pa: Object.freeze({
    "SPA-QL-043": "ਘੁੰਮਾਅ ਦੇ ਆਧਾਰ ਤੇ ਪਾਸੇ ਦੇ ਫਲਕਾਂ ਦਾ ਸੰਬੰਧ ਪਤਾ ਕਰਨਾ",
    "SPA-QL-044": "ਘਣ ਦੇ ਜਾਲ ਨੂੰ ਮੋੜ ਕੇ ਫਲਕਾਂ ਦਾ ਸੰਬੰਧ ਪਤਾ ਕਰਨਾ",
    "SPA-QL-045": "ਰੰਗੇ ਹੋਏ ਘਣ ਵਿੱਚ ਛੋਟੇ ਘਣਾਂ ਦੀ ਗਿਣਤੀ ਕਰਨਾ",
  }),
});

function variantIndex(stemVariantId: string): number {
  const match = stemVariantId.match(/-(\d+)$/);
  if (!match) throw new Error(`CND localization cannot resolve stem variant ${stemVariantId}.`);
  const index = Number(match[1]) - 1;
  if (!Number.isInteger(index) || index < 0 || index > 5) throw new Error(`CND localization stem variant out of range: ${stemVariantId}.`);
  return index;
}

function oppositeTarget(stem: string): string {
  const match = stem.match(/opposite(?:\s+to)?\s+([A-Z0-9]+)(?:\?|\.|\s|$)/i);
  if (!match?.[1]) throw new Error(`CND localization cannot resolve opposite-face target from: ${stem}`);
  return match[1];
}

function paintedFaceCount(stem: string): number {
  const match = stem.match(/exactly\s+(\d+)\s+(?:painted\s+)?faces?/i);
  if (!match?.[1]) throw new Error(`CND localization cannot resolve painted-face count from: ${stem}`);
  return Number(match[1]);
}

function diceLocalized(source: CubesDicePermanentEnglishQuestionV1, language: CubesDiceLocalizedLanguageV1) {
  const target = oppositeTarget(source.stem);
  const index = variantIndex(source.stemVariantId);
  const observations = source.scene.observations as readonly { top: string; front: string; right: string }[];
  if (!observations?.[0] || !observations?.[1]) throw new Error(`${source.seed}: dice observations missing.`);

  if (language === "hi") {
    const stems = [
      `एक ही पासे की दो स्थितियाँ दी गई हैं। ${target} के विपरीत कौन-सा फलक होगा?`,
      `एक ही पासा दो अलग स्थितियों में दिखाया गया है। ${target} के विपरीत फलक पहचानिए।`,
      `पासे के दोनों दृश्यों को देखकर ${target} के विपरीत फलक ज्ञात कीजिए।`,
      `एक पासे की दो स्थितियाँ दी गई हैं। ${target} के सामने वाले फलक पर क्या है?`,
      `पासे की दोनों स्थितियों की तुलना कीजिए। ${target} के विपरीत कौन-सा फलक है?`,
      `एक ही पासे के दोनों दृश्यों का उपयोग करके ${target} के विपरीत फलक ज्ञात कीजिए।`,
    ] as const;
    return Object.freeze({
      stem: stems[index]!,
      explanation: Object.freeze({
        whatIsGiven: `एक ही पासा दो स्थितियों में दिखाया गया है। पहली स्थिति में ऊपर-सामने-दायाँ फलक क्रमशः ${observations[0].top}, ${observations[0].front}, ${observations[0].right} हैं और दूसरी में ${observations[1].top}, ${observations[1].front}, ${observations[1].right} हैं।`,
        howToReason: `दोनों स्थितियों को साथ मिलाकर देखें और केवल वही व्यवस्था मानें जो उसी घन को घुमाने से बन सकती है। प्रतिबिंबित व्यवस्था मान्य नहीं है। इससे ${target} के विपरीत फलक निश्चित हो जाता है।`,
        conclusion: `इसलिए ${target} के विपरीत फलक ${source.answer} है।`,
      }),
    });
  }

  const stems = [
    `ਇੱਕੋ ਪਾਸੇ ਦੀਆਂ ਦੋ ਸਥਿਤੀਆਂ ਦਿੱਤੀਆਂ ਹਨ। ${target} ਦੇ ਉਲਟ ਕਿਹੜਾ ਫਲਕ ਹੋਵੇਗਾ?`,
    `ਇੱਕੋ ਪਾਸਾ ਦੋ ਵੱਖ-ਵੱਖ ਸਥਿਤੀਆਂ ਵਿੱਚ ਦਿਖਾਇਆ ਗਿਆ ਹੈ। ${target} ਦੇ ਉਲਟ ਫਲਕ ਦੀ ਪਛਾਣ ਕਰੋ।`,
    `ਪਾਸੇ ਦੇ ਦੋਵੇਂ ਦ੍ਰਿਸ਼ ਵੇਖ ਕੇ ${target} ਦੇ ਉਲਟ ਫਲਕ ਪਤਾ ਕਰੋ।`,
    `ਇੱਕ ਪਾਸੇ ਦੀਆਂ ਦੋ ਸਥਿਤੀਆਂ ਦਿੱਤੀਆਂ ਹਨ। ${target} ਦੇ ਸਾਹਮਣੇ ਵਾਲੇ ਫਲਕ ਉੱਤੇ ਕੀ ਹੈ?`,
    `ਪਾਸੇ ਦੀਆਂ ਦੋਵੇਂ ਸਥਿਤੀਆਂ ਦੀ ਤੁਲਨਾ ਕਰੋ। ${target} ਦੇ ਉਲਟ ਕਿਹੜਾ ਫਲਕ ਹੈ?`,
    `ਇੱਕੋ ਪਾਸੇ ਦੇ ਦੋਵੇਂ ਦ੍ਰਿਸ਼ ਵਰਤ ਕੇ ${target} ਦੇ ਉਲਟ ਫਲਕ ਪਤਾ ਕਰੋ।`,
  ] as const;
  return Object.freeze({
    stem: stems[index]!,
    explanation: Object.freeze({
      whatIsGiven: `ਇੱਕੋ ਪਾਸਾ ਦੋ ਸਥਿਤੀਆਂ ਵਿੱਚ ਦਿਖਾਇਆ ਗਿਆ ਹੈ। ਪਹਿਲੀ ਸਥਿਤੀ ਵਿੱਚ ਉੱਪਰ-ਸਾਹਮਣੇ-ਸੱਜਾ ਫਲਕ ਕ੍ਰਮਵਾਰ ${observations[0].top}, ${observations[0].front}, ${observations[0].right} ਹਨ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ${observations[1].top}, ${observations[1].front}, ${observations[1].right} ਹਨ।`,
      howToReason: `ਦੋਵੇਂ ਸਥਿਤੀਆਂ ਨੂੰ ਇਕੱਠੇ ਵੇਖੋ ਅਤੇ ਸਿਰਫ਼ ਉਹੀ ਬਣਤਰ ਮੰਨੋ ਜੋ ਉਸੇ ਘਣ ਨੂੰ ਘੁਮਾਉਣ ਨਾਲ ਬਣ ਸਕਦੀ ਹੈ। ਆਇਨੇ ਵਾਲੀ ਉਲਟੀ ਬਣਤਰ ਮਨਜ਼ੂਰ ਨਹੀਂ ਹੈ। ਇਸ ਨਾਲ ${target} ਦੇ ਉਲਟ ਫਲਕ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦਾ ਹੈ।`,
      conclusion: `ਇਸ ਲਈ ${target} ਦੇ ਉਲਟ ਫਲਕ ${source.answer} ਹੈ।`,
    }),
  });
}

function netLocalized(source: CubesDicePermanentEnglishQuestionV1, language: CubesDiceLocalizedLanguageV1) {
  const target = oppositeTarget(source.stem);
  const index = variantIndex(source.stemVariantId);
  if (language === "hi") {
    const stems = [
      `दिए गए जाल को मोड़कर घन बनाया जाता है। ${target} के विपरीत कौन-सा फलक होगा?`,
      `दिए गए जाल से घन बनाने पर ${target} के विपरीत फलक पहचानिए।`,
      `इस जाल को मोड़कर घन बनाने पर ${target} के विपरीत कौन-सा अंकित फलक आएगा?`,
      `जाल को किनारों से मोड़ने की कल्पना कीजिए। ${target} के विपरीत कौन-सा फलक होगा?`,
      `दिए गए जाल से घन बनने पर ${target} के ठीक विपरीत कौन-सा फलक होगा?`,
      `चित्र एक खुले घन का जाल है। मोड़ने के बाद ${target} के विपरीत फलक का चिन्ह ज्ञात कीजिए।`,
    ] as const;
    return Object.freeze({
      stem: stems[index]!,
      explanation: Object.freeze({
        whatIsGiven: `छह अंकित वर्ग मिलकर एक सही घन-जाल बनाते हैं। ${target} के विपरीत फलक ज्ञात करना है।`,
        howToReason: `साझे किनारों के साथ जुड़े वर्गों को 90° मोड़कर घन की कल्पना करें। ${source.answer} वाला वर्ग मोड़ने पर ${target} वाले वर्ग की ठीक विपरीत दिशा में आता है।`,
        conclusion: `अतः ${target} के विपरीत फलक ${source.answer} है।`,
      }),
    });
  }
  const stems = [
    `ਦਿੱਤੇ ਜਾਲ ਨੂੰ ਮੋੜ ਕੇ ਘਣ ਬਣਾਇਆ ਜਾਂਦਾ ਹੈ। ${target} ਦੇ ਉਲਟ ਕਿਹੜਾ ਫਲਕ ਹੋਵੇਗਾ?`,
    `ਦਿੱਤੇ ਜਾਲ ਤੋਂ ਘਣ ਬਣਾਉਣ ਤੇ ${target} ਦੇ ਉਲਟ ਫਲਕ ਦੀ ਪਛਾਣ ਕਰੋ।`,
    `ਇਸ ਜਾਲ ਨੂੰ ਮੋੜ ਕੇ ਘਣ ਬਣਾਉਣ ਤੇ ${target} ਦੇ ਉਲਟ ਕਿਹੜਾ ਨਿਸ਼ਾਨ ਲੱਗਿਆ ਫਲਕ ਆਵੇਗਾ?`,
    `ਜਾਲ ਨੂੰ ਕਿਨਾਰਿਆਂ ਤੋਂ ਮੋੜਨ ਦੀ ਕਲਪਨਾ ਕਰੋ। ${target} ਦੇ ਉਲਟ ਕਿਹੜਾ ਫਲਕ ਹੋਵੇਗਾ?`,
    `ਦਿੱਤੇ ਜਾਲ ਤੋਂ ਘਣ ਬਣਨ ਤੇ ${target} ਦੇ ਬਿਲਕੁਲ ਉਲਟ ਕਿਹੜਾ ਫਲਕ ਹੋਵੇਗਾ?`,
    `ਚਿੱਤਰ ਇੱਕ ਖੁੱਲ੍ਹੇ ਘਣ ਦਾ ਜਾਲ ਹੈ। ਮੋੜਨ ਤੋਂ ਬਾਅਦ ${target} ਦੇ ਉਲਟ ਫਲਕ ਦਾ ਨਿਸ਼ਾਨ ਪਤਾ ਕਰੋ।`,
  ] as const;
  return Object.freeze({
    stem: stems[index]!,
    explanation: Object.freeze({
      whatIsGiven: `ਛੇ ਨਿਸ਼ਾਨ ਲੱਗੇ ਵਰਗ ਮਿਲ ਕੇ ਇੱਕ ਸਹੀ ਘਣ-ਜਾਲ ਬਣਾਉਂਦੇ ਹਨ। ${target} ਦੇ ਉਲਟ ਫਲਕ ਪਤਾ ਕਰਨਾ ਹੈ।`,
      howToReason: `ਸਾਂਝੇ ਕਿਨਾਰਿਆਂ ਨਾਲ ਜੁੜੇ ਵਰਗਾਂ ਨੂੰ 90° ਮੋੜ ਕੇ ਘਣ ਦੀ ਕਲਪਨਾ ਕਰੋ। ${source.answer} ਵਾਲਾ ਵਰਗ ਮੋੜਨ ਤੇ ${target} ਵਾਲੇ ਵਰਗ ਦੀ ਬਿਲਕੁਲ ਉਲਟ ਦਿਸ਼ਾ ਵਿੱਚ ਆ ਜਾਂਦਾ ਹੈ।`,
      conclusion: `ਇਸ ਲਈ ${target} ਦੇ ਉਲਟ ਫਲਕ ${source.answer} ਹੈ।`,
    }),
  });
}

function paintedCategoryHi(faceCount: number): string {
  if (faceCount === 3) return "कोनों पर स्थित छोटे घन";
  if (faceCount === 2) return "कोनों को छोड़कर किनारों पर स्थित छोटे घन";
  if (faceCount === 1) return "किसी फलक के अंदर, किनारों से दूर स्थित छोटे घन";
  return "पूरी तरह अंदर स्थित छोटे घन";
}
function paintedCategoryPa(faceCount: number): string {
  if (faceCount === 3) return "ਕੋਨਿਆਂ ਤੇ ਪਏ ਛੋਟੇ ਘਣ";
  if (faceCount === 2) return "ਕੋਨਿਆਂ ਤੋਂ ਇਲਾਵਾ ਕਿਨਾਰਿਆਂ ਤੇ ਪਏ ਛੋਟੇ ਘਣ";
  if (faceCount === 1) return "ਕਿਸੇ ਫਲਕ ਦੇ ਅੰਦਰ, ਕਿਨਾਰਿਆਂ ਤੋਂ ਦੂਰ ਪਏ ਛੋਟੇ ਘਣ";
  return "ਪੂਰੀ ਤਰ੍ਹਾਂ ਅੰਦਰਲੇ ਛੋਟੇ ਘਣ";
}
function paintedFormula(n: number, faceCount: number): string {
  if (faceCount === 3) return "8";
  if (faceCount === 2) return `12 × (${n} − 2) = ${12 * (n - 2)}`;
  if (faceCount === 1) return `6 × (${n} − 2)² = ${6 * (n - 2) ** 2}`;
  return `(${n} − 2)³ = ${(n - 2) ** 3}`;
}

function paintedLocalized(source: CubesDicePermanentEnglishQuestionV1, language: CubesDiceLocalizedLanguageV1) {
  const n = Number(source.scene.subdivisionsPerEdge);
  const faceCount = paintedFaceCount(source.stem);
  const total = n ** 3;
  const index = variantIndex(source.stemVariantId);
  const formula = paintedFormula(n, faceCount);
  if (language === "hi") {
    const stems = [
      `एक घन की सभी छह बाहरी सतहों पर रंग किया गया है और उसे ${total} बराबर छोटे घनों में काटा गया है। कितने छोटे घनों की ठीक ${faceCount} सतह${faceCount === 1 ? "" : "ें"} रंगी हुई हैं?`,
      `घन की सभी सतहों पर रंग करके उसे ${total} समान छोटे घनों में बाँटा गया है। ठीक ${faceCount} रंगी हुई सतह वाले छोटे घनों की संख्या ज्ञात कीजिए।`,
      `एक रंगे हुए घन की प्रत्येक भुजा को ${n} बराबर भागों में बाँटा गया है। ठीक ${faceCount} रंगी हुई सतह वाले कितने छोटे घन बनेंगे?`,
      `घन की सभी बाहरी सतहें रंगी हुई हैं। उसे ${n} × ${n} × ${n} बराबर छोटे घनों में बाँटा गया है। ठीक ${faceCount} रंगी हुई सतह वाले छोटे घनों की संख्या कितनी है?`,
      `सभी सतहों पर रंग किया हुआ एक घन ${total} छोटे घनों में काटा गया है। ठीक ${faceCount} रंगी हुई सतह वाले घनों की गिनती कीजिए।`,
      `सभी छह सतहों पर रंग करने के बाद घन की हर भुजा को ${n} बराबर भागों में काटा गया है। कितने छोटे घनों पर ठीक ${faceCount} सतह रंगी हुई है?`,
    ] as const;
    return Object.freeze({
      stem: stems[index]!,
      explanation: Object.freeze({
        whatIsGiven: `हर भुजा पर ${n} बराबर भाग हैं, इसलिए कुल ${total} छोटे घन हैं और मूल घन की सभी छह बाहरी सतहें रंगी हुई हैं।`,
        howToReason: `ठीक ${faceCount} रंगी हुई सतह वाले छोटे घन ${paintedCategoryHi(faceCount)} होते हैं। उनकी संख्या ${formula} होती है।`,
        conclusion: `अतः ऐसे छोटे घनों की संख्या ${source.answer} है।`,
      }),
    });
  }
  const stems = [
    `ਇੱਕ ਘਣ ਦੀਆਂ ਸਾਰੀਆਂ ਛੇ ਬਾਹਰੀ ਸਤਹਾਂ ਰੰਗੀਆਂ ਹਨ ਅਤੇ ਉਸ ਨੂੰ ${total} ਬਰਾਬਰ ਛੋਟੇ ਘਣਾਂ ਵਿੱਚ ਕੱਟਿਆ ਗਿਆ ਹੈ। ਕਿੰਨੇ ਛੋਟੇ ਘਣਾਂ ਦੀਆਂ ਠੀਕ ${faceCount} ਸਤਹਾਂ ਰੰਗੀਆਂ ਹਨ?`,
    `ਘਣ ਦੀਆਂ ਸਾਰੀਆਂ ਸਤਹਾਂ ਰੰਗ ਕੇ ਉਸ ਨੂੰ ${total} ਇਕੋ ਜਿਹੇ ਛੋਟੇ ਘਣਾਂ ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ ਹੈ। ਠੀਕ ${faceCount} ਰੰਗੀਆਂ ਸਤਹਾਂ ਵਾਲੇ ਛੋਟੇ ਘਣਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`,
    `ਇੱਕ ਰੰਗੇ ਹੋਏ ਘਣ ਦੀ ਹਰ ਭੁਜਾ ਨੂੰ ${n} ਬਰਾਬਰ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ ਹੈ। ਠੀਕ ${faceCount} ਰੰਗੀਆਂ ਸਤਹਾਂ ਵਾਲੇ ਕਿੰਨੇ ਛੋਟੇ ਘਣ ਬਣਣਗੇ?`,
    `ਘਣ ਦੀਆਂ ਸਾਰੀਆਂ ਬਾਹਰੀ ਸਤਹਾਂ ਰੰਗੀਆਂ ਹਨ। ਉਸ ਨੂੰ ${n} × ${n} × ${n} ਬਰਾਬਰ ਛੋਟੇ ਘਣਾਂ ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ ਹੈ। ਠੀਕ ${faceCount} ਰੰਗੀਆਂ ਸਤਹਾਂ ਵਾਲੇ ਛੋਟੇ ਘਣ ਕਿੰਨੇ ਹਨ?`,
    `ਸਾਰੀਆਂ ਸਤਹਾਂ ਰੰਗਿਆ ਇੱਕ ਘਣ ${total} ਛੋਟੇ ਘਣਾਂ ਵਿੱਚ ਕੱਟਿਆ ਗਿਆ ਹੈ। ਠੀਕ ${faceCount} ਰੰਗੀਆਂ ਸਤਹਾਂ ਵਾਲੇ ਘਣ ਗਿਣੋ।`,
    `ਸਾਰੀਆਂ ਛੇ ਸਤਹਾਂ ਰੰਗਣ ਤੋਂ ਬਾਅਦ ਘਣ ਦੀ ਹਰ ਭੁਜਾ ਨੂੰ ${n} ਬਰਾਬਰ ਹਿੱਸਿਆਂ ਵਿੱਚ ਕੱਟਿਆ ਗਿਆ ਹੈ। ਕਿੰਨੇ ਛੋਟੇ ਘਣਾਂ ਦੀਆਂ ਠੀਕ ${faceCount} ਸਤਹਾਂ ਰੰਗੀਆਂ ਹਨ?`,
  ] as const;
  return Object.freeze({
    stem: stems[index]!,
    explanation: Object.freeze({
      whatIsGiven: `ਹਰ ਭੁਜਾ ਤੇ ${n} ਬਰਾਬਰ ਹਿੱਸੇ ਹਨ, ਇਸ ਲਈ ਕੁੱਲ ${total} ਛੋਟੇ ਘਣ ਹਨ ਅਤੇ ਮੂਲ ਘਣ ਦੀਆਂ ਸਾਰੀਆਂ ਛੇ ਬਾਹਰੀ ਸਤਹਾਂ ਰੰਗੀਆਂ ਹਨ।`,
      howToReason: `ਠੀਕ ${faceCount} ਰੰਗੀਆਂ ਸਤਹਾਂ ਵਾਲੇ ਛੋਟੇ ਘਣ ${paintedCategoryPa(faceCount)} ਹੁੰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਗਿਣਤੀ ${formula} ਹੁੰਦੀ ਹੈ।`,
      conclusion: `ਇਸ ਲਈ ਅਜਿਹੇ ਛੋਟੇ ਘਣਾਂ ਦੀ ਗਿਣਤੀ ${source.answer} ਹੈ।`,
    }),
  });
}

function localizedSurface(source: CubesDicePermanentEnglishQuestionV1, language: CubesDiceLocalizedLanguageV1) {
  if (source.taskKind === "DICE_OPPOSITE_FROM_TWO_VIEWS") return diceLocalized(source, language);
  if (source.taskKind === "CUBE_NET_OPPOSITE_FACE") return netLocalized(source, language);
  if (source.taskKind === "PAINTED_CUBE_EXACT_FACE_COUNT") return paintedLocalized(source, language);
  throw new Error(`CND localization received unallocated task ${source.taskKind}.`);
}

export function localizeCubesDicePermanentQuestionV1(input: Readonly<{
  seed: string;
  taskKind: CubesDiceCp004TaskKindV1;
  language: CubesDiceLocalizedLanguageV1;
}>): CubesDiceLocalizedQuestionV1 {
  const source = generateCubesDicePermanentEnglishQuestionV1({ seed: input.seed, taskKind: input.taskKind });
  const surface = localizedSurface(source, input.language);
  const locale: CubesDiceLocalizedLocaleV1 = input.language === "hi" ? "hi-IN" : "pa-IN";
  return Object.freeze({
    ...source,
    language: input.language,
    locale,
    permanentQlTitle: TITLES[input.language][source.permanentQlId],
    stem: surface.stem,
    explanation: surface.explanation,
    localization: Object.freeze({
      authorityId: CND_001_LOCALIZATION_AUTHORITY_V1.authorityId,
      englishFreezeAuthorityId: CND_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      sourceEnglishSeed: source.seed,
      sourceEnglishStemVariantId: source.stemVariantId,
      reviewOnly: true,
      frozen: false,
    }),
  });
}
