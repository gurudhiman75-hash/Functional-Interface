import {
  generatePfcTpfPermanentEnglishCorpusV3,
  type PfcTpfPermanentEnglishQuestionV3,
} from "./paper-folding-permanent-english-runtime-v3";
import { PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2 } from "./paper-folding-english-freeze-v2";
import type { PfcTpfPermanentQlIdV4 } from "./spatial-permanent-ql-allocation-v4";

export const PFC_TPF_LOCALIZATION_AUTHORITY_V2 = Object.freeze({
  authorityId: "PFC-TPF-HI-PA-LOCALIZATION-V2" as const,
  editorialRevision: "V2.1" as const,
  supersedesArtifactId: 9475626624,
  englishFreezeAuthorityId: PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
  permanentQlRange: "SPA-QL-035..SPA-QL-040" as const,
  sourceEnglishArchetypeCount: 84,
  supportedLanguages: ["hi", "pa"] as const,
  localizedQuestionCount: 168,
  localizationStyle: "SIMPLE_STUDENT_FIRST_HUMAN_WORDING_EDITORIALLY_REMEDIATED" as const,
  diagramsInvariant: true,
  optionOrderInvariant: true,
  answerInvariant: true,
  permanentIdsInvariant: true,
  canonicalIdsInvariant: true,
  qlIdsInvariant: true,
  provenanceInvariant: true,
  representationInvariant: true,
  canonicalContentFingerprintInvariant: true,
  status: "HINDI_PUNJABI_LOCALIZATION_V2_1_HUMAN_REVIEW_REQUIRED" as const,
  questionStudioRegistered: false,
  automaticPublication: false,
} as const);

export type PfcTpfLocalizedLanguageV2 = "hi" | "pa";
export type PfcTpfLocalizedLocaleV2 = "hi-IN" | "pa-IN";

export type PfcTpfLocalizedQuestionV2 = Omit<
  PfcTpfPermanentEnglishQuestionV3,
  "language" | "locale" | "permanentQlTitle" | "stem" | "explanation"
> & {
  language: PfcTpfLocalizedLanguageV2;
  locale: PfcTpfLocalizedLocaleV2;
  permanentQlTitle: string;
  stem: string;
  explanation: string;
  localization: {
    authorityId: typeof PFC_TPF_LOCALIZATION_AUTHORITY_V2.authorityId;
    englishFreezeAuthorityId: typeof PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2.authorityId;
    sourceEnglishContentFingerprint: string;
    reviewOnly: true;
    frozen: false;
  };
};

const HI_QL_TITLES: Record<PfcTpfPermanentQlIdV4, string> = {
  "SPA-QL-035": "सीधे और बार-बार मोड़े कागज़ को खोलना",
  "SPA-QL-036": "कई दिशाओं और कई चरणों में मोड़े कागज़ को खोलना",
  "SPA-QL-037": "तिरछे और कोने से मोड़े कागज़ को खोलना",
  "SPA-QL-038": "कई कट और कट की स्थिति वाला कागज़ खोलना",
  "SPA-QL-039": "खुले कागज़ से सही मोड़ और पंच पहचानना",
  "SPA-QL-040": "पारदर्शी कागज़ मोड़ने पर बनी संयुक्त आकृति",
};

const PA_QL_TITLES: Record<PfcTpfPermanentQlIdV4, string> = {
  "SPA-QL-035": "ਸਿੱਧੇ ਅਤੇ ਵਾਰ-ਵਾਰ ਮੋੜੇ ਕਾਗਜ਼ ਨੂੰ ਖੋਲ੍ਹਣਾ",
  "SPA-QL-036": "ਕਈ ਦਿਸ਼ਾਵਾਂ ਅਤੇ ਕਈ ਪੜਾਵਾਂ ਵਿੱਚ ਮੋੜੇ ਕਾਗਜ਼ ਨੂੰ ਖੋਲ੍ਹਣਾ",
  "SPA-QL-037": "ਤਿਰਛੇ ਅਤੇ ਕੋਨੇ ਤੋਂ ਮੋੜੇ ਕਾਗਜ਼ ਨੂੰ ਖੋਲ੍ਹਣਾ",
  "SPA-QL-038": "ਕਈ ਕੱਟਾਂ ਅਤੇ ਕੱਟ ਦੀ ਥਾਂ ਵਾਲਾ ਕਾਗਜ਼ ਖੋਲ੍ਹਣਾ",
  "SPA-QL-039": "ਖੁੱਲ੍ਹੇ ਕਾਗਜ਼ ਤੋਂ ਸਹੀ ਮੋੜ ਅਤੇ ਪੰਚ ਪਛਾਣਨਾ",
  "SPA-QL-040": "ਪਾਰਦਰਸ਼ੀ ਕਾਗਜ਼ ਮੋੜਨ ਨਾਲ ਬਣੀ ਮਿਲੀ ਹੋਈ ਆਕ੍ਰਿਤੀ",
};

function hiPaper(representation: string): string {
  const value = representation.toUpperCase();
  if (value.includes("HEXAGON")) return "षट्भुजाकार कागज़";
  if (value.includes("TRIANGLE")) return "त्रिकोणाकार कागज़";
  if (value.includes("PENTAGON")) return "पंचभुजाकार कागज़";
  if (value.includes("OCTAGON")) return "अष्टभुजाकार कागज़";
  if (value.includes("CIRCLE")) return "गोल कागज़";
  if (value.includes("RECT")) return "आयताकार कागज़";
  if (value.includes("SKEWED") || value.includes("CONVEX")) return "उत्तल बहुभुजाकार कागज़";
  if (value.includes("SQUARE")) return "चौकोर कागज़";
  return "दिखाए गए आकार वाला कागज़";
}

function paPaper(representation: string): string {
  const value = representation.toUpperCase();
  if (value.includes("HEXAGON")) return "ਛੇ-ਭੁਜੀ ਕਾਗਜ਼";
  if (value.includes("TRIANGLE")) return "ਤਿਕੋਣੀ ਕਾਗਜ਼";
  if (value.includes("PENTAGON")) return "ਪੰਜ-ਭੁਜੀ ਕਾਗਜ਼";
  if (value.includes("OCTAGON")) return "ਅੱਠ-ਭੁਜੀ ਕਾਗਜ਼";
  if (value.includes("CIRCLE")) return "ਗੋਲ ਕਾਗਜ਼";
  if (value.includes("RECT")) return "ਆਇਤਾਕਾਰ ਕਾਗਜ਼";
  if (value.includes("SKEWED") || value.includes("CONVEX")) return "ਉੱਤਲ ਬਹੁਭੁਜੀ ਕਾਗਜ਼";
  if (value.includes("SQUARE")) return "ਚੌਰਸ ਕਾਗਜ਼";
  return "ਦਿਖਾਏ ਆਕਾਰ ਵਾਲੇ ਕਾਗਜ਼";
}

function foldCount(question: PfcTpfPermanentEnglishQuestionV3): number {
  return new Set(question.stimulusSvg.match(/Fold\s+[1-9]/g) ?? []).size;
}

function isNovel(question: PfcTpfPermanentEnglishQuestionV3): boolean {
  return question.provenance === "CONTROLLED_NOVEL";
}

function hiStem(question: PfcTpfPermanentEnglishQuestionV3): string {
  if (question.permanentQlId === "SPA-QL-039") {
    return "पूरी तरह खुले कागज़ की आकृति दी गई है। किस विकल्प की मोड़ और पंच प्रक्रिया से यही आकृति बन सकती है?";
  }
  if (question.permanentQlId === "SPA-QL-040") {
    return "पारदर्शी कागज़ को दिखाए अनुसार मोड़ा गया है। मोड़ने के बाद बनी संयुक्त आकृति किस विकल्प में सही दिखाई गई है?";
  }
  return `${hiPaper(question.representation)} को दिखाए अनुसार मोड़कर काटा या छेदा गया है। कागज़ को पूरी तरह खोलने पर कौन सा विकल्प सही आकृति दिखाता है?`;
}

function paStem(question: PfcTpfPermanentEnglishQuestionV3): string {
  if (question.permanentQlId === "SPA-QL-039") {
    return "ਪੂਰੀ ਤਰ੍ਹਾਂ ਖੁੱਲ੍ਹੇ ਕਾਗਜ਼ ਦੀ ਆਕ੍ਰਿਤੀ ਦਿੱਤੀ ਗਈ ਹੈ। ਕਿਸ ਵਿਕਲਪ ਦੀ ਮੋੜ ਅਤੇ ਪੰਚ ਪ੍ਰਕਿਰਿਆ ਨਾਲ ਇਹੀ ਆਕ੍ਰਿਤੀ ਬਣ ਸਕਦੀ ਹੈ?";
  }
  if (question.permanentQlId === "SPA-QL-040") {
    return "ਪਾਰਦਰਸ਼ੀ ਕਾਗਜ਼ ਨੂੰ ਦਿਖਾਏ ਅਨੁਸਾਰ ਮੋੜਿਆ ਗਿਆ ਹੈ। ਮੋੜਨ ਤੋਂ ਬਾਅਦ ਬਣੀ ਮਿਲੀ ਹੋਈ ਆਕ੍ਰਿਤੀ ਕਿਸ ਵਿਕਲਪ ਵਿੱਚ ਸਹੀ ਦਿਖਾਈ ਗਈ ਹੈ?";
  }
  return `${paPaper(question.representation)} ਨੂੰ ਦਿਖਾਏ ਅਨੁਸਾਰ ਮੋੜ ਕੇ ਕੱਟਿਆ ਜਾਂ ਛੇਦਿਆ ਗਿਆ ਹੈ। ਕਾਗਜ਼ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਖੋਲ੍ਹਣ ਤੇ ਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਆਕ੍ਰਿਤੀ ਦਿਖਾਉਂਦਾ ਹੈ?`;
}

function hiNovelNote(question: PfcTpfPermanentEnglishQuestionV3): string {
  return isNovel(question)
    ? " कागज़ का आकार अलग है, लेकिन हर मोड़ को उसी वास्तविक मोड़ रेखा के अनुसार खोलना है।"
    : "";
}

function paNovelNote(question: PfcTpfPermanentEnglishQuestionV3): string {
  return isNovel(question)
    ? " ਕਾਗਜ਼ ਦਾ ਆਕਾਰ ਵੱਖਰਾ ਹੈ, ਪਰ ਹਰ ਮੋੜ ਨੂੰ ਉਸ ਦੀ ਅਸਲ ਮੋੜ ਰੇਖਾ ਅਨੁਸਾਰ ਹੀ ਖੋਲ੍ਹਣਾ ਹੈ।"
    : "";
}

function hiExplanation(question: PfcTpfPermanentEnglishQuestionV3): string {
  const answer = question.correctOptionId;
  const folds = foldCount(question);
  switch (question.permanentQlId) {
    case "SPA-QL-035":
      return folds > 1
        ? `${hiPaper(question.representation)} में ${folds} मोड़ दिखाए गए हैं। पहले आखिरी मोड़ खोलें, फिर उससे पहले वाला। हर बार कट या छेद केवल संबंधित मोड़ रेखा के दूसरी ओर समान दूरी पर बनता है।${hiNovelNote(question)} पूरी तरह खोलने पर विकल्प ${answer} मिलता है।`
        : `${hiPaper(question.representation)} को एक बार मोड़ा गया है। कागज़ खोलते समय कट या छेद मोड़ रेखा के दूसरी ओर समान दूरी पर दिखाई देगा।${hiNovelNote(question)} इसलिए सही खुली आकृति विकल्प ${answer} है।`;
    case "SPA-QL-036":
      return `यह बहु-मोड़ प्रश्न है। मोड़ उसी क्रम के उलट खोलें जिसमें वे लगाए गए थे—सबसे आखिरी मोड़ पहले। हर चरण में केवल उस मोड़ से जुड़ी परतों पर निशान की नई प्रतिलिपि बनती है।${hiNovelNote(question)} सभी चरण पूरे करने पर विकल्प ${answer} सही है।`;
    case "SPA-QL-037":
      return `यहाँ मुख्य मोड़ तिरछा या कोने पर है। इसलिए निशान को पूरे कागज़ की सीधी आधी प्रतिलिपि की तरह नहीं, वास्तविक तिरछी मोड़ रेखा के पार समान दूरी पर रखना होगा।${hiNovelNote(question)} इससे विकल्प ${answer} वाली आकृति बनती है।`;
    case "SPA-QL-038":
      return `कटों को अलग-अलग ट्रैक करें। जो कट folded packet के अंदर है वह खुलने पर अंदर ही छेद बनाता है; जो कट वास्तव में किनारे को छूता है वही किनारे से जुड़ा notch बनता है। सभी कटों की सही प्रतिलिपियाँ जोड़ने पर विकल्प ${answer} मिलता है।`;
    case "SPA-QL-039":
      return `दिए गए खुले परिणाम से पीछे की ओर जाँच करें। हर विकल्प की मोड़-पंच प्रक्रिया को मानसिक रूप से पूरा खोलें और देखें कि निशानों की संख्या, दिशा और दूरी लक्ष्य आकृति से पूरी तरह मिलती है या नहीं। केवल विकल्प ${answer} सभी निशान सही बनाता है।`;
    case "SPA-QL-040":
      return `यह पारदर्शी कागज़ है, इसलिए मोड़ने से नया छेद या कट नहीं बनता। मोड़े गए हिस्से पर पहले से बनी रेखाएँ और आकृतियाँ मोड़ रेखा के पार जाकर दूसरी आकृतियों पर चढ़ती हैं। दोनों हिस्सों का सही superposition विकल्प ${answer} में है।`;
  }
}

function paExplanation(question: PfcTpfPermanentEnglishQuestionV3): string {
  const answer = question.correctOptionId;
  const folds = foldCount(question);
  switch (question.permanentQlId) {
    case "SPA-QL-035":
      return folds > 1
        ? `${paPaper(question.representation)} ਵਿੱਚ ${folds} ਮੋੜ ਦਿਖਾਏ ਗਏ ਹਨ। ਪਹਿਲਾਂ ਸਭ ਤੋਂ ਆਖਰੀ ਮੋੜ ਖੋਲ੍ਹੋ, ਫਿਰ ਉਸ ਤੋਂ ਪਹਿਲਾਂ ਵਾਲਾ। ਹਰ ਵਾਰ ਕੱਟ ਜਾਂ ਛੇਦ ਸੰਬੰਧਤ ਮੋੜ ਰੇਖਾ ਦੇ ਦੂਜੇ ਪਾਸੇ ਉੱਨੀ ਹੀ ਦੂਰੀ ਤੇ ਬਣਦਾ ਹੈ।${paNovelNote(question)} ਪੂਰੀ ਤਰ੍ਹਾਂ ਖੋਲ੍ਹਣ ਤੇ ਵਿਕਲਪ ${answer} ਮਿਲਦਾ ਹੈ।`
        : `${paPaper(question.representation)} ਨੂੰ ਇੱਕ ਵਾਰ ਮੋੜਿਆ ਗਿਆ ਹੈ। ਕਾਗਜ਼ ਖੋਲ੍ਹਣ ਤੇ ਕੱਟ ਜਾਂ ਛੇਦ ਮੋੜ ਰੇਖਾ ਦੇ ਦੂਜੇ ਪਾਸੇ ਉੱਨੀ ਹੀ ਦੂਰੀ ਤੇ ਦਿਖਾਈ ਦੇਵੇਗਾ।${paNovelNote(question)} ਇਸ ਲਈ ਸਹੀ ਖੁੱਲ੍ਹੀ ਆਕ੍ਰਿਤੀ ਵਿਕਲਪ ${answer} ਹੈ।`;
    case "SPA-QL-036":
      return `ਇਹ ਕਈ ਮੋੜਾਂ ਵਾਲਾ ਪ੍ਰਸ਼ਨ ਹੈ। ਮੋੜ ਉਸੇ ਕ੍ਰਮ ਦੇ ਉਲਟ ਖੋਲ੍ਹੋ ਜਿਸ ਵਿੱਚ ਉਹ ਲਗਾਏ ਗਏ ਸਨ—ਸਭ ਤੋਂ ਆਖਰੀ ਮੋੜ ਪਹਿਲਾਂ। ਹਰ ਪੜਾਅ ਵਿੱਚ ਨਿਸ਼ਾਨ ਦੀ ਨਵੀਂ ਕਾਪੀ ਸਿਰਫ਼ ਉਸ ਮੋੜ ਨਾਲ ਜੁੜੀਆਂ ਪਰਤਾਂ ਉੱਤੇ ਬਣਦੀ ਹੈ।${paNovelNote(question)} ਸਾਰੇ ਪੜਾਅ ਪੂਰੇ ਕਰਨ ਤੇ ਵਿਕਲਪ ${answer} ਸਹੀ ਹੈ।`;
    case "SPA-QL-037":
      return `ਇੱਥੇ ਮੁੱਖ ਮੋੜ ਤਿਰਛਾ ਜਾਂ ਕੋਨੇ ਤੇ ਹੈ। ਇਸ ਲਈ ਨਿਸ਼ਾਨ ਨੂੰ ਪੂਰੇ ਕਾਗਜ਼ ਦੀ ਸਿੱਧੀ ਅੱਧੀ ਨਕਲ ਵਾਂਗ ਨਾ ਰੱਖੋ; ਉਸ ਨੂੰ ਅਸਲ ਤਿਰਛੀ ਮੋੜ ਰੇਖਾ ਦੇ ਪਾਰ ਉੱਨੀ ਹੀ ਦੂਰੀ ਤੇ ਰੱਖਣਾ ਹੈ।${paNovelNote(question)} ਇਸ ਨਾਲ ਵਿਕਲਪ ${answer} ਵਾਲੀ ਆਕ੍ਰਿਤੀ ਬਣਦੀ ਹੈ।`;
    case "SPA-QL-038":
      return `ਹਰ ਕੱਟ ਨੂੰ ਵੱਖਰੇ ਤੌਰ ਤੇ ਟ੍ਰੈਕ ਕਰੋ। ਜੋ ਕੱਟ folded packet ਦੇ ਅੰਦਰ ਹੈ, ਉਹ ਖੋਲ੍ਹਣ ਤੇ ਅੰਦਰਲਾ ਛੇਦ ਹੀ ਬਣਦਾ ਹੈ; ਜੋ ਕੱਟ ਅਸਲ ਵਿੱਚ ਕਿਨਾਰੇ ਨੂੰ ਛੂਹਦਾ ਹੈ, ਉਹੀ ਕਿਨਾਰੇ ਨਾਲ ਜੁੜਿਆ notch ਬਣਦਾ ਹੈ। ਸਾਰੇ ਕੱਟਾਂ ਦੀਆਂ ਸਹੀ ਕਾਪੀਆਂ ਜੋੜਨ ਤੇ ਵਿਕਲਪ ${answer} ਮਿਲਦਾ ਹੈ।`;
    case "SPA-QL-039":
      return `ਦਿੱਤੀ ਖੁੱਲ੍ਹੀ ਆਕ੍ਰਿਤੀ ਤੋਂ ਪਿੱਛੇ ਵੱਲ ਜਾਂਚ ਕਰੋ। ਹਰ ਵਿਕਲਪ ਦੀ ਮੋੜ-ਪੰਚ ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਮਨ ਵਿੱਚ ਪੂਰਾ ਖੋਲ੍ਹੋ ਅਤੇ ਵੇਖੋ ਕਿ ਨਿਸ਼ਾਨਾਂ ਦੀ ਗਿਣਤੀ, ਦਿਸ਼ਾ ਅਤੇ ਦੂਰੀ ਲਕਸ਼ ਆਕ੍ਰਿਤੀ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਮਿਲਦੀ ਹੈ ਜਾਂ ਨਹੀਂ। ਸਿਰਫ਼ ਵਿਕਲਪ ${answer} ਸਾਰੇ ਨਿਸ਼ਾਨ ਸਹੀ ਬਣਾਉਂਦਾ ਹੈ।`;
    case "SPA-QL-040":
      return `ਇਹ ਪਾਰਦਰਸ਼ੀ ਕਾਗਜ਼ ਹੈ, ਇਸ ਲਈ ਮੋੜਨ ਨਾਲ ਕੋਈ ਨਵਾਂ ਛੇਦ ਜਾਂ ਕੱਟ ਨਹੀਂ ਬਣਦਾ। ਮੋੜੇ ਹਿੱਸੇ ਉੱਤੇ ਪਹਿਲਾਂ ਤੋਂ ਬਣੀਆਂ ਰੇਖਾਵਾਂ ਅਤੇ ਆਕ੍ਰਿਤੀਆਂ ਮੋੜ ਰੇਖਾ ਪਾਰ ਕਰਕੇ ਦੂਜੀਆਂ ਆਕ੍ਰਿਤੀਆਂ ਉੱਤੇ ਆ ਜਾਂਦੀਆਂ ਹਨ। ਦੋਵੇਂ ਹਿੱਸਿਆਂ ਦਾ ਸਹੀ superposition ਵਿਕਲਪ ${answer} ਵਿੱਚ ਹੈ।`;
  }
}

function localizeQuestion(
  question: PfcTpfPermanentEnglishQuestionV3,
  language: PfcTpfLocalizedLanguageV2,
): PfcTpfLocalizedQuestionV2 {
  const hindi = language === "hi";
  return {
    ...question,
    language,
    locale: hindi ? "hi-IN" : "pa-IN",
    permanentQlTitle: hindi ? HI_QL_TITLES[question.permanentQlId] : PA_QL_TITLES[question.permanentQlId],
    stem: hindi ? hiStem(question) : paStem(question),
    explanation: hindi ? hiExplanation(question) : paExplanation(question),
    localization: {
      authorityId: PFC_TPF_LOCALIZATION_AUTHORITY_V2.authorityId,
      englishFreezeAuthorityId: PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
      sourceEnglishContentFingerprint: question.contentFingerprint,
      reviewOnly: true,
      frozen: false,
    },
  };
}

export function generatePfcTpfLocalizedCorpusV2(language: PfcTpfLocalizedLanguageV2): PfcTpfLocalizedQuestionV2[] {
  if (!PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2.governance.hindiPunjabiGenerationAllowed) {
    throw new Error("English freeze does not authorize PFC/TPF localization.");
  }
  return generatePfcTpfPermanentEnglishCorpusV3().map((question) => localizeQuestion(question, language));
}

export function generatePfcTpfBilingualLocalizationCorpusV2(): PfcTpfLocalizedQuestionV2[] {
  return [
    ...generatePfcTpfLocalizedCorpusV2("hi"),
    ...generatePfcTpfLocalizedCorpusV2("pa"),
  ];
}

function esc(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function renderPfcTpfLocalizationReviewHtmlV2(): string {
  const english = generatePfcTpfPermanentEnglishCorpusV3();
  const hindi = generatePfcTpfLocalizedCorpusV2("hi");
  const punjabi = generatePfcTpfLocalizedCorpusV2("pa");
  const cards = english.map((question, index) => {
    const hi = hindi[index];
    const pa = punjabi[index];
    return `<article class="q"><div class="meta">${question.permanentQuestionId} · ${question.permanentQlId} · ${esc(question.representation)} · ${question.provenance}</div><h2>${esc(question.permanentQlTitle)}</h2><p><strong>English:</strong> ${esc(question.stem)}</p><div class="stimulus">${question.stimulusSvg}</div><div class="options">${question.options.map((option) => `<div class="option"><strong>${option.optionId}</strong>${option.svg}</div>`).join("")}</div><div class="lang"><h3>हिन्दी</h3><p><strong>प्रश्न:</strong> ${esc(hi.stem)}</p><p><strong>उत्तर:</strong> ${hi.correctOptionId}</p><p><strong>समझ:</strong> ${esc(hi.explanation)}</p></div><div class="lang"><h3>ਪੰਜਾਬੀ</h3><p><strong>ਪ੍ਰਸ਼ਨ:</strong> ${esc(pa.stem)}</p><p><strong>ਉੱਤਰ:</strong> ${pa.correctOptionId}</p><p><strong>ਸਮਝ:</strong> ${esc(pa.explanation)}</p></div></article>`;
  }).join("\n");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PFC TPF Hindi Punjabi Localization Review V2.1</title><style>*{box-sizing:border-box}body{margin:0;background:#fff;color:#111;font-family:Arial,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;line-height:1.45}.wrap{max-width:1180px;margin:auto;padding:20px}.intro,.q{border:1px solid #ddd;border-radius:12px;padding:18px;margin-bottom:18px;background:#fff}.meta{font-size:12px;color:#555}.q h2{font-size:18px}.stimulus{overflow:auto;margin:10px 0}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.option{border:1px solid #ddd;border-radius:8px;padding:8px;text-align:center;overflow:hidden}.option svg{max-width:100%;height:auto}.lang{border-top:1px solid #e5e5e5;margin-top:14px;padding-top:10px}.lang h3{margin:0 0 6px}@media(max-width:760px){.options{grid-template-columns:repeat(2,minmax(0,1fr))}.wrap{padding:10px}}@media(max-width:430px){.options{grid-template-columns:1fr}}</style></head><body><main class="wrap"><section class="intro"><h1>PFC / TPF Hindi + Punjabi Localization Review V2.1</h1><p>84 frozen English archetypes reviewed in Hindi and Punjabi. V2.1 fixes case agreement and reduces repetitive learner explanations while keeping diagrams, options, answers, IDs, QLs and canonical fingerprints immutable.</p></section>${cards}</main></body></html>`;
}
