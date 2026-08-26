import {
  generatePfcTpfStudioQuestionV1,
  type PfcTpfStudioExplanationV1,
  type PfcTpfStudioLanguageV1,
  type PfcTpfStudioQlIdV1,
  type PfcTpfStudioQuestionV1,
} from "./paper-folding-question-studio-seeded-runtime-v1";

export const PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1 = Object.freeze({
  authorityId: "PFC-TPF-QUESTION-STUDIO-EDITORIAL-V1" as const,
  sourceRuntimeAuthorityId: "PFC-TPF-QUESTION-STUDIO-SEEDED-RUNTIME-V1" as const,
  purpose: "ADD_NATURAL_STEM_AND_EXPLANATION_VARIETY_WITHOUT_CHANGING_GEOMETRY_OR_ANSWERS" as const,
  supportedLanguages: ["en", "hi", "pa"] as const,
  permanentQlRange: "SPA-QL-035..SPA-QL-040" as const,
  stemVariantsPerFamily: 4,
  explanationPhraseVariants: 3,
  invariants: {
    stimulusGeometry: true,
    optionGeometry: true,
    optionOrder: true,
    correctIndex: true,
    answer: true,
    contentFingerprint: true,
    canonicalAnchorId: true,
    provenance: true,
    representation: true,
    lifecycle: true,
  },
  status: "EDITORIAL_REVIEW_CANDIDATE" as const,
  registrationAllowed: false,
} as const);

export type PfcTpfStudioEditorialQuestionV1 = PfcTpfStudioQuestionV1 & {
  editorial: {
    authorityId: typeof PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1.authorityId;
    stemVariant: number;
    observationVariant: number;
    applicationVariant: number;
    checkVariant: number;
    editorialFingerprint: string;
  };
};

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shortHash(value: string): string {
  return hash32(value).toString(16).padStart(8, "0");
}

function variant(seed: string, key: string, count: number): number {
  return hash32(`${seed}:${key}`) % count;
}

const SHAPE_TEXT = {
  en: {
    SQUARE: "square",
    RECTANGLE: "rectangular",
    TRIANGLE: "triangular",
    REGULAR_HEXAGON: "hexagonal",
    REGULAR_PENTAGON: "pentagonal",
    REGULAR_OCTAGON: "octagonal",
  },
  hi: {
    SQUARE: "वर्गाकार",
    RECTANGLE: "आयताकार",
    TRIANGLE: "त्रिकोणीय",
    REGULAR_HEXAGON: "षट्भुजाकार",
    REGULAR_PENTAGON: "पंचभुजाकार",
    REGULAR_OCTAGON: "अष्टभुजाकार",
  },
  pa: {
    SQUARE: "ਵਰਗਾਕਾਰ",
    RECTANGLE: "ਆਇਤਾਕਾਰ",
    TRIANGLE: "ਤਿਕੋਣੀ",
    REGULAR_HEXAGON: "ਛੇ-ਭੁਜੀ",
    REGULAR_PENTAGON: "ਪੰਜ-ਭੁਜੀ",
    REGULAR_OCTAGON: "ਅੱਠ-ਭੁਜੀ",
  },
} as const;

function shapeText(representation: string, language: PfcTpfStudioLanguageV1): string {
  return (SHAPE_TEXT[language] as Record<string, string>)[representation] ?? (language === "en" ? "paper" : language === "hi" ? "कागज़" : "ਕਾਗਜ਼");
}

function forwardStem(question: PfcTpfStudioQuestionV1, stemVariant: number): string {
  const shape = shapeText(question.representation, question.language);
  const multiple = question.qlId === "SPA-QL-038";
  if (question.language === "hi") {
    const action = multiple ? "एक से अधिक कट/छेद" : "कट/छेद";
    return [
      `${shape} कागज़ को दिखाए अनुसार मोड़कर ${action} किया गया है। कागज़ को पूरा खोलने पर कौन-सी आकृति बनेगी?`,
      `मोड़ने के क्रम और ${action} की जगह को ध्यान से देखें। ${shape} कागज़ पूरी तरह खोलने पर किस विकल्प जैसा दिखेगा?`,
      `${shape} कागज़ को चरणों में मोड़कर अंतिम मुड़े भाग पर ${action} किया गया है। सही खुली हुई आकृति चुनिए।`,
      `दिखाए गए मोड़ और ${action} करने के बाद कागज़ को पूरा खोलें। सही पैटर्न किस विकल्प में है?`,
    ][stemVariant]!;
  }
  if (question.language === "pa") {
    const action = multiple ? "ਇੱਕ ਤੋਂ ਵੱਧ ਕੱਟ/ਛੇਦ" : "ਕੱਟ/ਛੇਦ";
    return [
      `${shape} ਕਾਗਜ਼ ਨੂੰ ਦਿਖਾਏ ਅਨੁਸਾਰ ਮੋੜ ਕੇ ${action} ਕੀਤਾ ਗਿਆ ਹੈ। ਪੂਰੀ ਤਰ੍ਹਾਂ ਖੋਲ੍ਹਣ ਤੇ ਕਿਹੜੀ ਆਕ੍ਰਿਤੀ ਬਣੇਗੀ?`,
      `ਮੋੜਾਂ ਦੇ ਕ੍ਰਮ ਅਤੇ ${action} ਦੀ ਥਾਂ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖੋ। ${shape} ਕਾਗਜ਼ ਪੂਰਾ ਖੋਲ੍ਹਣ ਤੇ ਕਿਹੜੇ ਵਿਕਲਪ ਵਰਗਾ ਦਿਖੇਗਾ?`,
      `${shape} ਕਾਗਜ਼ ਨੂੰ ਕਦਮਾਂ ਵਿੱਚ ਮੋੜ ਕੇ ਆਖਰੀ ਮੋੜੇ ਹਿੱਸੇ ਉੱਤੇ ${action} ਕੀਤਾ ਗਿਆ ਹੈ। ਸਹੀ ਖੁੱਲ੍ਹੀ ਆਕ੍ਰਿਤੀ ਚੁਣੋ।`,
      `ਦਿਖਾਏ ਮੋੜ ਅਤੇ ${action} ਕਰਨ ਤੋਂ ਬਾਅਦ ਕਾਗਜ਼ ਪੂਰਾ ਖੋਲ੍ਹੋ। ਸਹੀ ਨਮੂਨਾ ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ਹੈ?`,
    ][stemVariant]!;
  }
  const action = multiple ? "cuts or punches are made" : "a cut or punch is made";
  return [
    `The ${shape} sheet is folded as shown and ${action}. Which option shows the sheet after it is opened completely?`,
    `Study the folding sequence and the position of the ${multiple ? "cuts or punches" : "cut or punch"} on the ${shape} paper. What pattern appears when the paper is fully unfolded?`,
    `The ${shape} paper is folded step by step and ${action} on the final folded form. Choose the correct unfolded pattern.`,
    `After carrying out the shown folds and ${multiple ? "cuts or punches" : "cut or punch"} on this ${shape} sheet, which option represents the completely opened paper?`,
  ][stemVariant]!;
}

function reverseStem(language: PfcTpfStudioLanguageV1, stemVariant: number): string {
  if (language === "hi") return [
    "खुले हुए कागज़ का पैटर्न दिया है। किस विकल्प की मोड़ और पंच प्रक्रिया से यही पैटर्न बनेगा?",
    "लक्ष्य आकृति में बने छेदों को देखें। कौन-सा मोड़-पंच क्रम कागज़ खोलने पर ठीक यही आकृति देगा?",
    "कागज़ को खोलने पर मिलने वाली आकृति सामने है। सही मोड़ और पंच प्रक्रिया वाला विकल्प चुनिए।",
    "किस विकल्प में कागज़ को इस तरह मोड़कर पंच किया गया है कि खोलने पर दी गई आकृति ही बने?",
  ][stemVariant]!;
  if (language === "pa") return [
    "ਖੁੱਲ੍ਹੇ ਕਾਗਜ਼ ਦਾ ਨਮੂਨਾ ਦਿੱਤਾ ਹੈ। ਕਿਹੜੇ ਵਿਕਲਪ ਦੀ ਮੋੜ ਅਤੇ ਪੰਚ ਪ੍ਰਕਿਰਿਆ ਨਾਲ ਇਹੀ ਨਮੂਨਾ ਬਣੇਗਾ?",
    "ਲਕਸ਼ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਬਣੇ ਛੇਦਾਂ ਨੂੰ ਵੇਖੋ। ਕਿਹੜਾ ਮੋੜ-ਪੰਚ ਕ੍ਰਮ ਕਾਗਜ਼ ਖੋਲ੍ਹਣ ਤੇ ਬਿਲਕੁਲ ਇਹੀ ਆਕ੍ਰਿਤੀ ਦੇਵੇਗਾ?",
    "ਕਾਗਜ਼ ਖੋਲ੍ਹਣ ਤੋਂ ਬਾਅਦ ਮਿਲਣ ਵਾਲੀ ਆਕ੍ਰਿਤੀ ਸਾਹਮਣੇ ਹੈ। ਸਹੀ ਮੋੜ ਅਤੇ ਪੰਚ ਪ੍ਰਕਿਰਿਆ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।",
    "ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ਕਾਗਜ਼ ਨੂੰ ਇਸ ਤਰ੍ਹਾਂ ਮੋੜ ਕੇ ਪੰਚ ਕੀਤਾ ਗਿਆ ਹੈ ਕਿ ਖੋਲ੍ਹਣ ਤੇ ਦਿੱਤੀ ਆਕ੍ਰਿਤੀ ਹੀ ਬਣੇ?",
  ][stemVariant]!;
  return [
    "The unfolded paper pattern is shown. Which option gives the fold-and-punch process that produces exactly this pattern?",
    "Use the holes in the target pattern to work backwards. Which folding-and-punching sequence would create this exact result after unfolding?",
    "The final unfolded pattern is given. Choose the option whose folds and punch reproduce it exactly.",
    "Which candidate process folds and punches the sheet so that opening it produces the pattern shown?",
  ][stemVariant]!;
}

function transparentStem(language: PfcTpfStudioLanguageV1, stemVariant: number): string {
  if (language === "hi") return [
    "पारदर्शी कागज़ को दिखाए अनुसार मोड़ा गया है। मोड़ने के बाद दोनों परतों की सही संयुक्त आकृति कौन-सी होगी?",
    "पारदर्शी शीट पर बनी आकृतियों को देखें और बताए गए मोड़ को लगाएँ। सही मिला हुआ पैटर्न किस विकल्प में है?",
    "दिखाई गई पारदर्शी शीट को मोड़ रेखा पर मोड़ें। मोड़े हुए हिस्से और स्थिर हिस्से की आकृतियाँ मिलकर कौन-सा विकल्प बनाएँगी?",
    "मोड़ने पर पारदर्शी कागज़ की दोनों परतें एक साथ दिखाई देंगी। सही सुपरइम्पोज़्ड आकृति चुनिए।",
  ][stemVariant]!;
  if (language === "pa") return [
    "ਪਾਰਦਰਸ਼ੀ ਕਾਗਜ਼ ਨੂੰ ਦਿਖਾਏ ਅਨੁਸਾਰ ਮੋੜਿਆ ਗਿਆ ਹੈ। ਮੋੜਨ ਤੋਂ ਬਾਅਦ ਦੋਵੇਂ ਪਰਤਾਂ ਦੀ ਸਹੀ ਮਿਲੀ ਹੋਈ ਆਕ੍ਰਿਤੀ ਕਿਹੜੀ ਹੋਵੇਗੀ?",
    "ਪਾਰਦਰਸ਼ੀ ਸ਼ੀਟ ਉੱਤੇ ਬਣੀਆਂ ਆਕ੍ਰਿਤੀਆਂ ਵੇਖੋ ਅਤੇ ਦਿੱਤਾ ਮੋੜ ਲਗਾਓ। ਸਹੀ ਮਿਲਿਆ ਹੋਇਆ ਨਮੂਨਾ ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ਹੈ?",
    "ਦਿਖਾਈ ਪਾਰਦਰਸ਼ੀ ਸ਼ੀਟ ਨੂੰ ਮੋੜ ਰੇਖਾ ਉੱਤੇ ਮੋੜੋ। ਮੋੜੇ ਅਤੇ ਅਡੋਲ ਹਿੱਸੇ ਦੀਆਂ ਆਕ੍ਰਿਤੀਆਂ ਮਿਲ ਕੇ ਕਿਹੜਾ ਵਿਕਲਪ ਬਣਾਉਣਗੀਆਂ?",
    "ਮੋੜਨ ਤੇ ਪਾਰਦਰਸ਼ੀ ਕਾਗਜ਼ ਦੀਆਂ ਦੋਵੇਂ ਪਰਤਾਂ ਇਕੱਠੀਆਂ ਦਿਖਣਗੀਆਂ। ਸਹੀ ਮਿਲੀ ਹੋਈ ਆਕ੍ਰਿਤੀ ਚੁਣੋ।",
  ][stemVariant]!;
  return [
    "The transparent sheet is folded as shown. Which option shows the correct combined pattern from the two visible layers?",
    "Study the line art on the transparent sheet and apply the indicated fold. Which option shows the resulting superimposed pattern?",
    "Fold the transparent sheet on the shown line. Which option correctly combines the moving-side pattern with the stationary-side pattern?",
    "Both layers remain visible after the transparent sheet is folded. Choose the option that shows their correct overlap.",
  ][stemVariant]!;
}

function forwardRule(qlId: PfcTpfStudioQlIdV1, language: PfcTpfStudioLanguageV1): string {
  const rules = {
    en: {
      "SPA-QL-035": "Undo the folds in reverse order. Each opening mirrors every existing mark across that fold line at the same distance.",
      "SPA-QL-036": "Open the last fold first, then keep reflecting the marks across each successive fold axis until the sheet is flat.",
      "SPA-QL-037": "For a diagonal or corner fold, reflect each mark across the sloping fold line while keeping its perpendicular distance unchanged.",
      "SPA-QL-038": "Treat each cut separately. Interior cuts reflect through the folds, while a cut touching the folded boundary must unfold as a boundary notch.",
    },
    hi: {
      "SPA-QL-035": "मोड़ों को उल्टे क्रम में खोलें। हर बार खोलने पर पहले से बने हर निशान का उतनी ही दूरी पर प्रतिबिंब बनता है।",
      "SPA-QL-036": "सबसे आखिरी मोड़ पहले खोलें, फिर हर अगली मोड़ रेखा के पार निशानों को प्रतिबिंबित करते जाएँ जब तक कागज़ पूरा न खुल जाए।",
      "SPA-QL-037": "तिरछे या कोने वाले मोड़ में हर निशान को तिरछी मोड़ रेखा के पार उतनी ही लंबवत दूरी पर रखें।",
      "SPA-QL-038": "हर कट को अलग-अलग खोलें। अंदर का कट मोड़ों के साथ प्रतिबिंबित होता है, जबकि किनारे को छूता कट खुलने पर किनारे की कटाई बनता है।",
    },
    pa: {
      "SPA-QL-035": "ਮੋੜਾਂ ਨੂੰ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ ਖੋਲ੍ਹੋ। ਹਰ ਵਾਰ ਖੋਲ੍ਹਣ ਤੇ ਪਹਿਲਾਂ ਬਣੇ ਹਰ ਨਿਸ਼ਾਨ ਦਾ ਮੋੜ ਰੇਖਾ ਪਾਰ ਉਤਨੀ ਹੀ ਦੂਰੀ ਤੇ ਪਰਛਾਂਵ ਬਣਦੀ ਹੈ।",
      "SPA-QL-036": "ਸਭ ਤੋਂ ਆਖਰੀ ਮੋੜ ਪਹਿਲਾਂ ਖੋਲ੍ਹੋ, ਫਿਰ ਹਰ ਅਗਲੀ ਮੋੜ ਰੇਖਾ ਪਾਰ ਨਿਸ਼ਾਨਾਂ ਨੂੰ ਪਰਛਾਂਵ ਵਾਂਗ ਲਿਜਾਂਦੇ ਜਾਓ ਜਦ ਤੱਕ ਕਾਗਜ਼ ਪੂਰਾ ਨਾ ਖੁੱਲ੍ਹੇ।",
      "SPA-QL-037": "ਤਿਰਛੇ ਜਾਂ ਕੋਨੇ ਵਾਲੇ ਮੋੜ ਵਿੱਚ ਹਰ ਨਿਸ਼ਾਨ ਨੂੰ ਤਿਰਛੀ ਮੋੜ ਰੇਖਾ ਪਾਰ ਉਤਨੀ ਹੀ ਲੰਬ ਦੂਰੀ ਤੇ ਰੱਖੋ।",
      "SPA-QL-038": "ਹਰ ਕੱਟ ਨੂੰ ਵੱਖ-ਵੱਖ ਖੋਲ੍ਹੋ। ਅੰਦਰਲਾ ਕੱਟ ਮੋੜਾਂ ਨਾਲ ਪਰਛਾਂਵ ਬਣਾਉਂਦਾ ਹੈ, ਜਦਕਿ ਮੋੜੇ ਕਿਨਾਰੇ ਨੂੰ ਛੂਹਦਾ ਕੱਟ ਖੁੱਲ੍ਹਣ ਤੇ ਕਿਨਾਰੇ ਦੀ ਕੱਟ ਬਣਦਾ ਹੈ।",
    },
  } as const;
  return (rules[language] as Record<string, string>)[qlId]!;
}

function forwardExplanation(question: PfcTpfStudioQuestionV1, observationVariant: number, applicationVariant: number, checkVariant: number): PfcTpfStudioExplanationV1 {
  const answer = question.answer;
  if (question.language === "hi") return {
    observation: [
      "पहले मोड़ों का क्रम देखें, फिर अंतिम मुड़े हुए भाग पर कट/छेद की सही जगह नोट करें।",
      "मुख्य संकेत हैं—मोड़ रेखाएँ, मोड़ने का क्रम और मुड़े कागज़ पर कट/छेद की स्थिति।",
      "कागज़ खोलने से पहले यह समझें कि कट/छेद अंतिम मुड़ी हुई कितनी परतों से गुजरता है और वह मोड़ रेखाओं के किस तरफ है।",
    ][observationVariant]!,
    rule: forwardRule(question.qlId, "hi"),
    application: [
      `मोड़ों को एक-एक करके खोलने पर निशान ठीक विकल्प ${answer} वाली जगहों पर पहुँचते हैं।`,
      `दिखाई गई मोड़ रेखाओं के पार निशानों का सही प्रतिबिंब बनाने पर विकल्प ${answer} का पैटर्न मिलता है।`,
      `सभी मोड़ उल्टे क्रम में खोलने पर अंतिम आकृति विकल्प ${answer} से मेल खाती है।`,
    ][applicationVariant]!,
    check: [
      `बाकी विकल्पों में निशानों की संख्या, सममिति या किनारे की स्थिति में गलती है।`,
      `केवल विकल्प ${answer} में निशानों की संख्या और उनकी सही प्रतिबिंबित जगह दोनों ठीक हैं।`,
      `विकल्प ${answer} ही सभी मोड़ रेखाओं और कट/छेद की जगह के साथ पूरी तरह संगत है।`,
    ][checkVariant]!,
  };
  if (question.language === "pa") return {
    observation: [
      "ਪਹਿਲਾਂ ਮੋੜਾਂ ਦਾ ਕ੍ਰਮ ਵੇਖੋ, ਫਿਰ ਆਖਰੀ ਮੋੜੇ ਹਿੱਸੇ ਉੱਤੇ ਕੱਟ/ਛੇਦ ਦੀ ਸਹੀ ਥਾਂ ਨੋਟ ਕਰੋ।",
      "ਮੁੱਖ ਸੰਕੇਤ ਹਨ—ਮੋੜ ਰੇਖਾਵਾਂ, ਮੋੜਨ ਦਾ ਕ੍ਰਮ ਅਤੇ ਮੋੜੇ ਕਾਗਜ਼ ਉੱਤੇ ਕੱਟ/ਛੇਦ ਦੀ ਥਾਂ।",
      "ਕਾਗਜ਼ ਖੋਲ੍ਹਣ ਤੋਂ ਪਹਿਲਾਂ ਵੇਖੋ ਕਿ ਕੱਟ/ਛੇਦ ਆਖਰੀ ਮੋੜੀਆਂ ਕਿੰਨੀਆਂ ਪਰਤਾਂ ਵਿੱਚੋਂ ਲੰਘਦਾ ਹੈ ਅਤੇ ਮੋੜ ਰੇਖਾਵਾਂ ਦੇ ਕਿਹੜੇ ਪਾਸੇ ਹੈ।",
    ][observationVariant]!,
    rule: forwardRule(question.qlId, "pa"),
    application: [
      `ਮੋੜ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਖੋਲ੍ਹਣ ਤੇ ਨਿਸ਼ਾਨ ਬਿਲਕੁਲ ਵਿਕਲਪ ${answer} ਵਾਲੀਆਂ ਥਾਵਾਂ ਤੇ ਪਹੁੰਚਦੇ ਹਨ।`,
      `ਦਿੱਤੀਆਂ ਮੋੜ ਰੇਖਾਵਾਂ ਪਾਰ ਨਿਸ਼ਾਨਾਂ ਦੀ ਸਹੀ ਪਰਛਾਂਵ ਬਣਾਉਣ ਤੇ ਵਿਕਲਪ ${answer} ਦਾ ਨਮੂਨਾ ਮਿਲਦਾ ਹੈ।`,
      `ਸਾਰੇ ਮੋੜ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ ਖੋਲ੍ਹਣ ਤੇ ਆਖਰੀ ਆਕ੍ਰਿਤੀ ਵਿਕਲਪ ${answer} ਨਾਲ ਮਿਲਦੀ ਹੈ।`,
    ][applicationVariant]!,
    check: [
      "ਬਾਕੀ ਵਿਕਲਪਾਂ ਵਿੱਚ ਨਿਸ਼ਾਨਾਂ ਦੀ ਗਿਣਤੀ, ਸਮਮਿਤੀ ਜਾਂ ਕਿਨਾਰੇ ਦੀ ਥਾਂ ਵਿੱਚ ਗਲਤੀ ਹੈ।",
      `ਸਿਰਫ਼ ਵਿਕਲਪ ${answer} ਵਿੱਚ ਨਿਸ਼ਾਨਾਂ ਦੀ ਗਿਣਤੀ ਅਤੇ ਉਹਨਾਂ ਦੀ ਸਹੀ ਪਰਛਾਂਵ ਵਾਲੀ ਥਾਂ ਦੋਵੇਂ ਠੀਕ ਹਨ।`,
      `ਵਿਕਲਪ ${answer} ਹੀ ਸਾਰੀਆਂ ਮੋੜ ਰੇਖਾਵਾਂ ਅਤੇ ਕੱਟ/ਛੇਦ ਦੀ ਥਾਂ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੇਲ ਖਾਂਦਾ ਹੈ।`,
    ][checkVariant]!,
  };
  return {
    observation: [
      "Read the folds in order, then note the exact position of the cut or punch on the final folded packet.",
      "The key clues are the fold lines, their order, and where the cut or punch lies on the folded paper.",
      "Before unfolding, identify which folded layers the cut or punch passes through and where it sits relative to the fold lines.",
    ][observationVariant]!,
    rule: forwardRule(question.qlId, "en"),
    application: [
      `Opening the folds one by one places the marks exactly as shown in option ${answer}.`,
      `Reflecting the marks through the shown fold lines produces the pattern in option ${answer}.`,
      `After every fold is reversed, the final mark pattern matches option ${answer}.`,
    ][applicationVariant]!,
    check: [
      "The other options have an incorrect mark count, symmetry, or boundary placement.",
      `Only option ${answer} preserves both the number of marks and their correct mirrored positions.`,
      `Option ${answer} is the only choice consistent with every fold line and cut or punch position.`,
    ][checkVariant]!,
  };
}

function reverseExplanation(question: PfcTpfStudioQuestionV1, observationVariant: number, applicationVariant: number, checkVariant: number): PfcTpfStudioExplanationV1 {
  const answer = question.answer;
  if (question.language === "hi") return {
    observation: ["खुले हुए लक्ष्य पैटर्न में छेदों की संख्या और सममिति देखें।", "पहले लक्ष्य आकृति में कौन-कौन से छेद एक-दूसरे के प्रतिबिंब हैं, यह पहचानें।", "लक्ष्य पैटर्न से पता लगाएँ कि पंच कितनी परतों पर और किन मोड़ रेखाओं के कारण दोहराया होगा। "][observationVariant]!,
    rule: "हर विकल्प की प्रक्रिया को आगे की दिशा में जाँचें—मोड़ लगाएँ, पंच करें और कागज़ पूरा खोलें।",
    application: [`केवल विकल्प ${answer} की प्रक्रिया सभी लक्ष्य छेद सही जगह बनाती है।`, `विकल्प ${answer} को आगे हल करने पर वही संख्या और वही सममिति मिलती है जो लक्ष्य में है।`, `मोड़ और पंच को विकल्प ${answer} के अनुसार करने पर लक्ष्य पैटर्न ठीक-ठीक बनता है।`][applicationVariant]!,
    check: [`बाकी प्रक्रियाएँ कोई छेद कम, अधिक या गलत जगह बनाती हैं।`, `विकल्प ${answer} में न कोई लक्ष्य छेद छूटता है और न कोई अतिरिक्त छेद बनता है।`, `सिर्फ विकल्प ${answer} लक्ष्य की गिनती, सममिति और स्थान तीनों से मेल खाता है।`][checkVariant]!,
  };
  if (question.language === "pa") return {
    observation: ["ਖੁੱਲ੍ਹੇ ਲਕਸ਼ ਨਮੂਨੇ ਵਿੱਚ ਛੇਦਾਂ ਦੀ ਗਿਣਤੀ ਅਤੇ ਸਮਮਿਤੀ ਵੇਖੋ।", "ਪਹਿਲਾਂ ਪਛਾਣੋ ਕਿ ਲਕਸ਼ ਆਕ੍ਰਿਤੀ ਦੇ ਕਿਹੜੇ ਛੇਦ ਇੱਕ-ਦੂਜੇ ਦੀ ਪਰਛਾਂਵ ਹਨ।", "ਲਕਸ਼ ਨਮੂਨੇ ਤੋਂ ਸਮਝੋ ਕਿ ਪੰਚ ਕਿੰਨੀਆਂ ਪਰਤਾਂ ਤੇ ਅਤੇ ਕਿਹੜੀਆਂ ਮੋੜ ਰੇਖਾਵਾਂ ਕਰਕੇ ਦੁਹਰਾਇਆ ਹੋਵੇਗਾ।"][observationVariant]!,
    rule: "ਹਰ ਵਿਕਲਪ ਦੀ ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਅੱਗੇ ਵੱਲ ਜਾਂਚੋ—ਮੋੜ ਲਗਾਓ, ਪੰਚ ਕਰੋ ਅਤੇ ਕਾਗਜ਼ ਪੂਰਾ ਖੋਲ੍ਹੋ।",
    application: [`ਸਿਰਫ਼ ਵਿਕਲਪ ${answer} ਦੀ ਪ੍ਰਕਿਰਿਆ ਸਾਰੇ ਲਕਸ਼ ਛੇਦ ਸਹੀ ਥਾਂ ਬਣਾਉਂਦੀ ਹੈ।`, `ਵਿਕਲਪ ${answer} ਨੂੰ ਅੱਗੇ ਹੱਲ ਕਰਨ ਤੇ ਉਹੀ ਗਿਣਤੀ ਅਤੇ ਸਮਮਿਤੀ ਮਿਲਦੀ ਹੈ ਜੋ ਲਕਸ਼ ਵਿੱਚ ਹੈ।`, `ਵਿਕਲਪ ${answer} ਅਨੁਸਾਰ ਮੋੜ ਅਤੇ ਪੰਚ ਕਰਨ ਤੇ ਲਕਸ਼ ਨਮੂਨਾ ਬਿਲਕੁਲ ਬਣਦਾ ਹੈ।`][applicationVariant]!,
    check: ["ਬਾਕੀ ਪ੍ਰਕਿਰਿਆਵਾਂ ਕੋਈ ਛੇਦ ਘੱਟ, ਵੱਧ ਜਾਂ ਗਲਤ ਥਾਂ ਬਣਾਉਂਦੀਆਂ ਹਨ।", `ਵਿਕਲਪ ${answer} ਵਿੱਚ ਨਾ ਕੋਈ ਲਕਸ਼ ਛੇਦ ਰਹਿ ਜਾਂਦਾ ਹੈ ਅਤੇ ਨਾ ਕੋਈ ਵਾਧੂ ਛੇਦ ਬਣਦਾ ਹੈ।`, `ਸਿਰਫ਼ ਵਿਕਲਪ ${answer} ਲਕਸ਼ ਦੀ ਗਿਣਤੀ, ਸਮਮਿਤੀ ਅਤੇ ਥਾਂ ਤਿੰਨਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`][checkVariant]!,
  };
  return {
    observation: ["Use the number and symmetry of the holes in the unfolded target as evidence.", "First identify which target holes form mirror pairs across possible fold lines.", "Read the target pattern backwards: its repeated holes reveal how many layers were punched and across which folds they were copied."][observationVariant]!,
    rule: "Test each candidate forward: apply its folds, make the punch, and unfold the sheet completely.",
    application: [`Only option ${answer} reproduces every target hole at the correct position.`, `Solving option ${answer} forward gives the same hole count and symmetry as the target.`, `Applying the folds and punch in option ${answer} recreates the target pattern exactly.`][applicationVariant]!,
    check: ["Every other process creates at least one missing, extra, or misplaced hole.", `Option ${answer} leaves no target hole missing and creates no extra hole.`, `Only option ${answer} matches the target count, symmetry, and positions together.`][checkVariant]!,
  };
}

function transparentExplanation(question: PfcTpfStudioQuestionV1, observationVariant: number, applicationVariant: number, checkVariant: number): PfcTpfStudioExplanationV1 {
  const answer = question.answer;
  if (question.language === "hi") return {
    observation: ["पारदर्शी कागज़ में दोनों परतों की पहले से बनी रेखाएँ और आकृतियाँ दिखाई देती रहती हैं।", "मोड़ने के बाद स्थिर हिस्से की आकृति अपनी जगह रहती है, जबकि मोड़े हिस्से की आकृति दूसरी तरफ दिखाई देती है।", "सही उत्तर पाने के लिए दोनों दिखाई देने वाली परतों को एक ही फ्रेम में मिलाना है।"][observationVariant]!,
    rule: "सिर्फ मोड़े जाने वाले हिस्से की आकृति को मोड़ रेखा के पार उतनी ही दूरी पर प्रतिबिंबित करें; स्थिर हिस्से को न हिलाएँ।",
    application: [`दोनों परतों की सही आकृतियाँ मिलाने पर विकल्प ${answer} बनता है।`, `मोड़ वाले हिस्से को प्रतिबिंबित करके स्थिर हिस्से पर रखने से पैटर्न विकल्प ${answer} से मिलता है।`, `चलते और स्थिर हिस्से की रेखाओं को साथ देखने पर संयुक्त आकृति विकल्प ${answer} है।`][applicationVariant]!,
    check: [`बाकी विकल्पों में कोई मूल रेखा गायब है, गलत तरफ गई है या अतिरिक्त आकृति जुड़ गई है।`, `केवल विकल्प ${answer} में दोनों परतों के सभी मूल तत्व सही जगह दिखाई देते हैं।`, `विकल्प ${answer} में न कोई आकृति गायब है और न कोई ऐसी आकृति है जो मोड़ से बन ही नहीं सकती।`][checkVariant]!,
  };
  if (question.language === "pa") return {
    observation: ["ਪਾਰਦਰਸ਼ੀ ਕਾਗਜ਼ ਵਿੱਚ ਦੋਵੇਂ ਪਰਤਾਂ ਦੀਆਂ ਪਹਿਲਾਂ ਬਣੀਆਂ ਰੇਖਾਵਾਂ ਅਤੇ ਆਕ੍ਰਿਤੀਆਂ ਦਿਖਦੀਆਂ ਰਹਿੰਦੀਆਂ ਹਨ।", "ਮੋੜਨ ਤੋਂ ਬਾਅਦ ਅਡੋਲ ਹਿੱਸੇ ਦੀ ਆਕ੍ਰਿਤੀ ਆਪਣੀ ਥਾਂ ਰਹਿੰਦੀ ਹੈ, ਜਦਕਿ ਮੋੜੇ ਹਿੱਸੇ ਦੀ ਆਕ੍ਰਿਤੀ ਦੂਜੇ ਪਾਸੇ ਦਿਖਦੀ ਹੈ।", "ਸਹੀ ਉੱਤਰ ਲਈ ਦੋਵੇਂ ਦਿਖਣ ਵਾਲੀਆਂ ਪਰਤਾਂ ਨੂੰ ਇੱਕੋ ਫਰੇਮ ਵਿੱਚ ਜੋੜਨਾ ਹੈ।"][observationVariant]!,
    rule: "ਸਿਰਫ਼ ਮੋੜੇ ਜਾਣ ਵਾਲੇ ਹਿੱਸੇ ਦੀ ਆਕ੍ਰਿਤੀ ਨੂੰ ਮੋੜ ਰੇਖਾ ਪਾਰ ਉਤਨੀ ਹੀ ਦੂਰੀ ਤੇ ਪਰਛਾਂਵ ਵਾਂਗ ਲਿਜਾਓ; ਅਡੋਲ ਹਿੱਸੇ ਨੂੰ ਨਾ ਹਿਲਾਓ।",
    application: [`ਦੋਵੇਂ ਪਰਤਾਂ ਦੀਆਂ ਸਹੀ ਆਕ੍ਰਿਤੀਆਂ ਜੋੜਨ ਤੇ ਵਿਕਲਪ ${answer} ਬਣਦਾ ਹੈ।`, `ਮੋੜੇ ਹਿੱਸੇ ਦੀ ਪਰਛਾਂਵ ਅਡੋਲ ਹਿੱਸੇ ਉੱਤੇ ਰੱਖਣ ਨਾਲ ਨਮੂਨਾ ਵਿਕਲਪ ${answer} ਨਾਲ ਮਿਲਦਾ ਹੈ।`, `ਚਲਦੇ ਅਤੇ ਅਡੋਲ ਹਿੱਸੇ ਦੀਆਂ ਰੇਖਾਵਾਂ ਇਕੱਠੀਆਂ ਵੇਖਣ ਤੇ ਮਿਲੀ ਹੋਈ ਆਕ੍ਰਿਤੀ ਵਿਕਲਪ ${answer} ਹੈ।`][applicationVariant]!,
    check: ["ਬਾਕੀ ਵਿਕਲਪਾਂ ਵਿੱਚ ਕੋਈ ਮੂਲ ਰੇਖਾ ਗਾਇਬ ਹੈ, ਗਲਤ ਪਾਸੇ ਗਈ ਹੈ ਜਾਂ ਵਾਧੂ ਆਕ੍ਰਿਤੀ ਜੋੜੀ ਗਈ ਹੈ।", `ਸਿਰਫ਼ ਵਿਕਲਪ ${answer} ਵਿੱਚ ਦੋਵੇਂ ਪਰਤਾਂ ਦੇ ਸਾਰੇ ਮੂਲ ਤੱਤ ਸਹੀ ਥਾਂ ਦਿਖਦੇ ਹਨ।`, `ਵਿਕਲਪ ${answer} ਵਿੱਚ ਨਾ ਕੋਈ ਆਕ੍ਰਿਤੀ ਗਾਇਬ ਹੈ ਅਤੇ ਨਾ ਕੋਈ ਐਸੀ ਆਕ੍ਰਿਤੀ ਹੈ ਜੋ ਮੋੜ ਨਾਲ ਬਣ ਹੀ ਨਹੀਂ ਸਕਦੀ।`][checkVariant]!,
  };
  return {
    observation: ["On transparent paper, the original line art on both layers remains visible after folding.", "After the fold, the stationary-side art stays fixed while the moving-side art appears on the opposite side of the fold line.", "The result is found by combining the two visible layers in the same final frame."][observationVariant]!,
    rule: "Reflect only the moving-side pattern across the fold line by the same perpendicular distance; leave the stationary-side pattern where it is.",
    application: [`Combining the two correctly placed layers gives option ${answer}.`, `Reflecting the moving-side art onto the stationary side produces the pattern in option ${answer}.`, `Viewing the moving and stationary line art together gives the superimposed figure in option ${answer}.`][applicationVariant]!,
    check: ["Every other option has an original element missing, reflected to the wrong side, or adds an element that the fold cannot create.", `Only option ${answer} keeps every original element from both layers in the correct position.`, `Option ${answer} has neither a missing element nor an extra element that cannot result from the fold.`][checkVariant]!,
  };
}

export function applyPfcTpfStudioEditorialV1(question: PfcTpfStudioQuestionV1): PfcTpfStudioEditorialQuestionV1 {
  const editorialSeed = `${question.generationSeed}:${question.qlId}`;
  const stemVariant = variant(editorialSeed, "stem", 4);
  const observationVariant = variant(editorialSeed, "observation", 3);
  const applicationVariant = variant(editorialSeed, "application", 3);
  const checkVariant = variant(editorialSeed, "check", 3);
  const stem = question.qlId === "SPA-QL-039"
    ? reverseStem(question.language, stemVariant)
    : question.qlId === "SPA-QL-040"
      ? transparentStem(question.language, stemVariant)
      : forwardStem(question, stemVariant);
  const explanation = question.qlId === "SPA-QL-039"
    ? reverseExplanation(question, observationVariant, applicationVariant, checkVariant)
    : question.qlId === "SPA-QL-040"
      ? transparentExplanation(question, observationVariant, applicationVariant, checkVariant)
      : forwardExplanation(question, observationVariant, applicationVariant, checkVariant);
  const editorialFingerprint = `pfc-tpf-ed-${shortHash(JSON.stringify({ stem, explanation }))}`;
  return {
    ...question,
    stem,
    explanation,
    editorial: {
      authorityId: PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1.authorityId,
      stemVariant,
      observationVariant,
      applicationVariant,
      checkVariant,
      editorialFingerprint,
    },
  };
}

export function generatePfcTpfStudioEditorialQuestionV1(input: { qlId: PfcTpfStudioQlIdV1; seed: string; language?: PfcTpfStudioLanguageV1 }): PfcTpfStudioEditorialQuestionV1 {
  return applyPfcTpfStudioEditorialV1(generatePfcTpfStudioQuestionV1(input));
}
