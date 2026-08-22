import {
  generatePfcTpfPermanentEnglishCorpusV3,
  type PfcTpfPermanentEnglishQuestionV3,
} from "./paper-folding-permanent-english-runtime-v3";
import { PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2 } from "./paper-folding-english-freeze-v2";
import type { PfcTpfPermanentQlIdV4 } from "./spatial-permanent-ql-allocation-v4";

export const PFC_TPF_LOCALIZATION_AUTHORITY_V2 = Object.freeze({
  authorityId: "PFC-TPF-HI-PA-LOCALIZATION-V2" as const,
  englishFreezeAuthorityId: PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
  permanentQlRange: "SPA-QL-035..SPA-QL-040" as const,
  sourceEnglishArchetypeCount: 84,
  supportedLanguages: ["hi", "pa"] as const,
  localizedQuestionCount: 168,
  localizationStyle: "SIMPLE_STUDENT_FIRST_HUMAN_WORDING" as const,
  diagramsInvariant: true,
  optionOrderInvariant: true,
  answerInvariant: true,
  permanentIdsInvariant: true,
  canonicalIdsInvariant: true,
  qlIdsInvariant: true,
  provenanceInvariant: true,
  representationInvariant: true,
  canonicalContentFingerprintInvariant: true,
  status: "HINDI_PUNJABI_LOCALIZATION_V2_HUMAN_REVIEW_REQUIRED" as const,
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

function hiShape(representation: string): string {
  const value = representation.toUpperCase();
  if (value.includes("HEXAGON")) return "षट्भुजाकार";
  if (value.includes("TRIANGLE")) return "त्रिकोणाकार";
  if (value.includes("PENTAGON")) return "पंचभुजाकार";
  if (value.includes("OCTAGON")) return "अष्टभुजाकार";
  if (value.includes("CIRCLE")) return "गोल";
  if (value.includes("RECT")) return "आयताकार";
  if (value.includes("SKEWED") || value.includes("CONVEX")) return "उत्तल बहुभुजाकार";
  return "दिखाए गए आकार का";
}

function paShape(representation: string): string {
  const value = representation.toUpperCase();
  if (value.includes("HEXAGON")) return "ਛੇ-ਭੁਜੀ";
  if (value.includes("TRIANGLE")) return "ਤਿਕੋਣੀ";
  if (value.includes("PENTAGON")) return "ਪੰਜ-ਭੁਜੀ";
  if (value.includes("OCTAGON")) return "ਅੱਠ-ਭੁਜੀ";
  if (value.includes("CIRCLE")) return "ਗੋਲ";
  if (value.includes("RECT")) return "ਆਇਤਾਕਾਰ";
  if (value.includes("SKEWED") || value.includes("CONVEX")) return "ਉੱਤਲ ਬਹੁਭੁਜੀ";
  return "ਦਿਖਾਏ ਆਕਾਰ ਵਾਲਾ";
}

function hiStem(question: PfcTpfPermanentEnglishQuestionV3): string {
  if (question.permanentQlId === "SPA-QL-039") {
    return "खुले हुए कागज़ की आकृति दी गई है। किस विकल्प में वह सही मोड़ और पंच प्रक्रिया है जिससे यही आकृति बनेगी?";
  }
  if (question.permanentQlId === "SPA-QL-040") {
    return "पारदर्शी कागज़ को दिखाए अनुसार मोड़ा गया है। मोड़ने के बाद दिखाई देने वाली संयुक्त आकृति किस विकल्प में सही है?";
  }
  const shape = hiShape(question.representation);
  return `${shape} कागज़ को दिखाए अनुसार मोड़कर काटा या छेदा गया है। कागज़ को पूरी तरह खोलने पर कौन सा विकल्प सही आकृति दिखाता है?`;
}

function paStem(question: PfcTpfPermanentEnglishQuestionV3): string {
  if (question.permanentQlId === "SPA-QL-039") {
    return "ਖੁੱਲ੍ਹੇ ਕਾਗਜ਼ ਦੀ ਆਕ੍ਰਿਤੀ ਦਿੱਤੀ ਗਈ ਹੈ। ਕਿਸ ਵਿਕਲਪ ਵਿੱਚ ਉਹ ਸਹੀ ਮੋੜ ਅਤੇ ਪੰਚ ਦੀ ਪ੍ਰਕਿਰਿਆ ਹੈ ਜਿਸ ਨਾਲ ਇਹੀ ਆਕ੍ਰਿਤੀ ਬਣੇਗੀ?";
  }
  if (question.permanentQlId === "SPA-QL-040") {
    return "ਪਾਰਦਰਸ਼ੀ ਕਾਗਜ਼ ਨੂੰ ਦਿਖਾਏ ਅਨੁਸਾਰ ਮੋੜਿਆ ਗਿਆ ਹੈ। ਮੋੜਨ ਤੋਂ ਬਾਅਦ ਦਿਖਣ ਵਾਲੀ ਮਿਲੀ ਹੋਈ ਆਕ੍ਰਿਤੀ ਕਿਸ ਵਿਕਲਪ ਵਿੱਚ ਸਹੀ ਹੈ?";
  }
  const shape = paShape(question.representation);
  return `${shape} ਕਾਗਜ਼ ਨੂੰ ਦਿਖਾਏ ਅਨੁਸਾਰ ਮੋੜ ਕੇ ਕੱਟਿਆ ਜਾਂ ਛੇਦਿਆ ਗਿਆ ਹੈ। ਕਾਗਜ਼ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਖੋਲ੍ਹਣ ਤੇ ਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਆਕ੍ਰਿਤੀ ਦਿਖਾਉਂਦਾ ਹੈ?`;
}

function hiExplanation(question: PfcTpfPermanentEnglishQuestionV3): string {
  const answer = question.correctOptionId;
  const shape = hiShape(question.representation);
  switch (question.permanentQlId) {
    case "SPA-QL-035":
      return `${shape} कागज़ को एक-एक करके उलटी दिशा में खोलें। हर मोड़ खुलने पर कट या छेद मोड़ रेखा के दूसरी तरफ उसी दूरी पर दोहरता है। सभी बने निशानों को साथ रखने पर विकल्प ${answer} वाली आकृति मिलती है।`;
    case "SPA-QL-036":
      return `इस प्रश्न में एक से अधिक मोड़ हैं। सबसे आखिरी मोड़ पहले खोलें और फिर उससे पहले वाला मोड़ खोलते जाएँ। हर चरण में केवल उस मोड़ से प्रभावित परतों पर निशान दोहरता है। पूरी प्रक्रिया के बाद विकल्प ${answer} सही है।`;
    case "SPA-QL-037":
      return `यहाँ मोड़ तिरछा या कोने पर है, इसलिए पूरे कागज़ को सीधी आधी-आधी प्रतिलिपि मानना सही नहीं होगा। कट को वास्तविक तिरछी मोड़ रेखा के दूसरी तरफ समान दूरी पर रखें। सही खुली आकृति विकल्प ${answer} में है।`;
    case "SPA-QL-038":
      return `हर कट को अलग-अलग खोलकर देखें। अंदर का छेद अंदर ही रहता है, जबकि किनारे को छूने वाला कट खुलने पर संबंधित किनारे से जुड़ा रहता है। सभी कटों की सही स्थिति जोड़ने पर विकल्प ${answer} मिलता है।`;
    case "SPA-QL-039":
      return `खुली हुई आकृति से पीछे की ओर चलें। हर संभावित मोड़ और पंच को खोलकर देखें कि उससे दिए गए सभी निशान बनते हैं या नहीं। केवल विकल्प ${answer} की प्रक्रिया पूरी लक्ष्य आकृति बनाती है।`;
    case "SPA-QL-040":
      return `यह पारदर्शी कागज़ है, इसलिए कोई नया छेद नहीं बनता। मोड़े गए हिस्से की बनी हुई रेखाएँ और आकृतियाँ मोड़ रेखा के पार जाकर दूसरी बनी हुई आकृतियों पर चढ़ती हैं। सही संयुक्त आकृति विकल्प ${answer} में है।`;
  }
}

function paExplanation(question: PfcTpfPermanentEnglishQuestionV3): string {
  const answer = question.correctOptionId;
  const shape = paShape(question.representation);
  switch (question.permanentQlId) {
    case "SPA-QL-035":
      return `${shape} ਕਾਗਜ਼ ਨੂੰ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਖੋਲ੍ਹੋ। ਹਰ ਮੋੜ ਖੁੱਲ੍ਹਣ ਤੇ ਕੱਟ ਜਾਂ ਛੇਦ ਮੋੜ ਦੀ ਰੇਖਾ ਦੇ ਦੂਜੇ ਪਾਸੇ ਉੱਨੀ ਹੀ ਦੂਰੀ ਤੇ ਦੁਹਰਾਇਆ ਜਾਂਦਾ ਹੈ। ਸਾਰੇ ਨਿਸ਼ਾਨ ਇਕੱਠੇ ਕਰਨ ਤੇ ਵਿਕਲਪ ${answer} ਵਾਲੀ ਆਕ੍ਰਿਤੀ ਮਿਲਦੀ ਹੈ।`;
    case "SPA-QL-036":
      return `ਇਸ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਇੱਕ ਤੋਂ ਵੱਧ ਮੋੜ ਹਨ। ਸਭ ਤੋਂ ਆਖਰੀ ਮੋੜ ਪਹਿਲਾਂ ਖੋਲ੍ਹੋ ਅਤੇ ਫਿਰ ਉਸ ਤੋਂ ਪਹਿਲਾਂ ਵਾਲੇ ਮੋੜ ਖੋਲ੍ਹਦੇ ਜਾਓ। ਹਰ ਪੜਾਅ ਵਿੱਚ ਨਿਸ਼ਾਨ ਸਿਰਫ਼ ਉਸ ਮੋੜ ਨਾਲ ਪ੍ਰਭਾਵਿਤ ਪਰਤਾਂ ਤੇ ਦੁਹਰਦਾ ਹੈ। ਪੂਰੀ ਪ੍ਰਕਿਰਿਆ ਤੋਂ ਬਾਅਦ ਵਿਕਲਪ ${answer} ਸਹੀ ਹੈ।`;
    case "SPA-QL-037":
      return `ਇੱਥੇ ਮੋੜ ਤਿਰਛਾ ਜਾਂ ਕੋਨੇ ਤੇ ਹੈ, ਇਸ ਲਈ ਪੂਰੇ ਕਾਗਜ਼ ਨੂੰ ਸਿੱਧੀ ਅੱਧੀ-ਅੱਧੀ ਨਕਲ ਮੰਨਣਾ ਠੀਕ ਨਹੀਂ। ਕੱਟ ਨੂੰ ਅਸਲ ਤਿਰਛੀ ਮੋੜ ਰੇਖਾ ਦੇ ਦੂਜੇ ਪਾਸੇ ਉੱਨੀ ਹੀ ਦੂਰੀ ਤੇ ਰੱਖੋ। ਸਹੀ ਖੁੱਲ੍ਹੀ ਆਕ੍ਰਿਤੀ ਵਿਕਲਪ ${answer} ਵਿੱਚ ਹੈ।`;
    case "SPA-QL-038":
      return `ਹਰ ਕੱਟ ਨੂੰ ਵੱਖ-ਵੱਖ ਖੋਲ੍ਹ ਕੇ ਦੇਖੋ। ਅੰਦਰਲਾ ਛੇਦ ਅੰਦਰ ਹੀ ਰਹਿੰਦਾ ਹੈ, ਜਦਕਿ ਕਿਨਾਰੇ ਨੂੰ ਛੂਹਣ ਵਾਲਾ ਕੱਟ ਖੁੱਲ੍ਹਣ ਤੇ ਸੰਬੰਧਤ ਕਿਨਾਰੇ ਨਾਲ ਜੁੜਿਆ ਰਹਿੰਦਾ ਹੈ। ਸਾਰੇ ਕੱਟਾਂ ਦੀ ਸਹੀ ਥਾਂ ਜੋੜਨ ਤੇ ਵਿਕਲਪ ${answer} ਮਿਲਦਾ ਹੈ।`;
    case "SPA-QL-039":
      return `ਖੁੱਲ੍ਹੀ ਆਕ੍ਰਿਤੀ ਤੋਂ ਪਿੱਛੇ ਵੱਲ ਸੋਚੋ। ਹਰ ਸੰਭਵ ਮੋੜ ਅਤੇ ਪੰਚ ਨੂੰ ਖੋਲ੍ਹ ਕੇ ਵੇਖੋ ਕਿ ਉਸ ਨਾਲ ਦਿੱਤੇ ਸਾਰੇ ਨਿਸ਼ਾਨ ਬਣਦੇ ਹਨ ਜਾਂ ਨਹੀਂ। ਸਿਰਫ਼ ਵਿਕਲਪ ${answer} ਦੀ ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਲਕਸ਼ ਆਕ੍ਰਿਤੀ ਬਣਾਉਂਦੀ ਹੈ।`;
    case "SPA-QL-040":
      return `ਇਹ ਪਾਰਦਰਸ਼ੀ ਕਾਗਜ਼ ਹੈ, ਇਸ ਲਈ ਕੋਈ ਨਵਾਂ ਛੇਦ ਨਹੀਂ ਬਣਦਾ। ਮੋੜੇ ਹਿੱਸੇ ਦੀਆਂ ਮੌਜੂਦਾ ਰੇਖਾਵਾਂ ਅਤੇ ਆਕ੍ਰਿਤੀਆਂ ਮੋੜ ਰੇਖਾ ਪਾਰ ਜਾ ਕੇ ਦੂਜੀਆਂ ਮੌਜੂਦਾ ਆਕ੍ਰਿਤੀਆਂ ਉੱਤੇ ਆ ਜਾਂਦੀਆਂ ਹਨ। ਸਹੀ ਮਿਲੀ ਹੋਈ ਆਕ੍ਰਿਤੀ ਵਿਕਲਪ ${answer} ਵਿੱਚ ਹੈ।`;
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
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PFC TPF Hindi Punjabi Localization Review V2</title><style>*{box-sizing:border-box}body{margin:0;background:#fff;color:#111;font-family:Arial,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;line-height:1.45}.wrap{max-width:1180px;margin:auto;padding:20px}.intro,.q{border:1px solid #ddd;border-radius:12px;padding:18px;margin-bottom:18px;background:#fff}.meta{font-size:12px;color:#555}.q h2{font-size:18px}.stimulus{overflow:auto;margin:10px 0}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.option{border:1px solid #ddd;border-radius:8px;padding:8px;text-align:center;overflow:hidden}.option svg{max-width:100%;height:auto}.lang{border-top:1px solid #e5e5e5;margin-top:14px;padding-top:10px}.lang h3{margin:0 0 6px}@media(max-width:760px){.options{grid-template-columns:repeat(2,minmax(0,1fr))}.wrap{padding:10px}}@media(max-width:430px){.options{grid-template-columns:1fr}}</style></head><body><main class="wrap"><section class="intro"><h1>PFC / TPF Hindi + Punjabi Localization Review V2</h1><p>84 frozen English archetypes, reviewed in Hindi and Punjabi. Diagrams, options, answer keys, permanent IDs and canonical fingerprints are immutable.</p></section>${cards}</main></body></html>`;
}
