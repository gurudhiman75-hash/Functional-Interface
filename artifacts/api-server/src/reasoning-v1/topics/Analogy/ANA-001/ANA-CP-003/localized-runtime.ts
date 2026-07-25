import { generateNumericAnalogy, type GeneratedNumericAnalogy } from "./generator";

type NumericLocale = "hi-IN" | "pa-IN";

const LABELS: Record<NumericLocale, Record<string, string>> = {
  "hi-IN": {
    NUM_ADD_K: "एक निश्चित संख्या जोड़ना", NUM_SUBTRACT_K: "एक निश्चित संख्या घटाना", NUM_MULTIPLY_K: "एक निश्चित संख्या से गुणा करना", NUM_DIVIDE_K: "एक निश्चित संख्या से भाग देना",
    NUM_MULTIPLY_ADD: "पहले गुणा करना, फिर जोड़ना", NUM_MULTIPLY_SUBTRACT: "पहले गुणा करना, फिर घटाना", NUM_DIVIDE_ADD: "पहले भाग देना, फिर जोड़ना", NUM_DIVIDE_SUBTRACT: "पहले भाग देना, फिर घटाना",
    NUM_SQUARE: "संख्या का वर्ग करना", NUM_SQUARE_ADD: "वर्ग करके निश्चित संख्या जोड़ना", NUM_SQUARE_SUBTRACT: "वर्ग करके निश्चित संख्या घटाना", NUM_CUBE: "संख्या का घन करना", NUM_CUBE_ADD: "घन करके निश्चित संख्या जोड़ना",
    NUM_DOUBLE_SQUARE: "संख्या को दोगुना करके उसका वर्ग करना", NUM_HALF_SQUARE: "संख्या को आधा करके उसका वर्ग करना", NUM_TIMES_SUCCESSOR: "संख्या को उसकी अगली संख्या से गुणा करना", NUM_TIMES_PREDECESSOR: "संख्या को उसकी पिछली संख्या से गुणा करना",
    DIGIT_SUM: "अंकों का योग करना", DIGIT_PRODUCT: "अंकों का गुणनफल निकालना", DIGIT_ABS_DIFF: "अंकों का निरपेक्ष अंतर निकालना", DIGIT_SUM_SQUARES: "अंकों के वर्गों का योग करना",
    DIGIT_PRODUCT_PLUS_SUM: "अंकों के गुणनफल और योग को जोड़ना", DIGIT_REVERSE: "अंकों का क्रम उलटना", DIGIT_POSITIONAL: "अंकों को गुणा करके दहाई का अंक जोड़ना",
  },
  "pa-IN": {
    NUM_ADD_K: "ਇੱਕ ਨਿਸ਼ਚਿਤ ਸੰਖਿਆ ਜੋੜਨੀ", NUM_SUBTRACT_K: "ਇੱਕ ਨਿਸ਼ਚਿਤ ਸੰਖਿਆ ਘਟਾਉਣੀ", NUM_MULTIPLY_K: "ਇੱਕ ਨਿਸ਼ਚਿਤ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰਨਾ", NUM_DIVIDE_K: "ਇੱਕ ਨਿਸ਼ਚਿਤ ਸੰਖਿਆ ਨਾਲ ਭਾਗ ਦੇਣਾ",
    NUM_MULTIPLY_ADD: "ਪਹਿਲਾਂ ਗੁਣਾ ਕਰਨਾ, ਫਿਰ ਜੋੜਨਾ", NUM_MULTIPLY_SUBTRACT: "ਪਹਿਲਾਂ ਗੁਣਾ ਕਰਨਾ, ਫਿਰ ਘਟਾਉਣਾ", NUM_DIVIDE_ADD: "ਪਹਿਲਾਂ ਭਾਗ ਦੇਣਾ, ਫਿਰ ਜੋੜਨਾ", NUM_DIVIDE_SUBTRACT: "ਪਹਿਲਾਂ ਭਾਗ ਦੇਣਾ, ਫਿਰ ਘਟਾਉਣਾ",
    NUM_SQUARE: "ਸੰਖਿਆ ਦਾ ਵਰਗ ਕਰਨਾ", NUM_SQUARE_ADD: "ਵਰਗ ਕਰਕੇ ਨਿਸ਼ਚਿਤ ਸੰਖਿਆ ਜੋੜਨੀ", NUM_SQUARE_SUBTRACT: "ਵਰਗ ਕਰਕੇ ਨਿਸ਼ਚਿਤ ਸੰਖਿਆ ਘਟਾਉਣੀ", NUM_CUBE: "ਸੰਖਿਆ ਦਾ ਘਣ ਕਰਨਾ", NUM_CUBE_ADD: "ਘਣ ਕਰਕੇ ਨਿਸ਼ਚਿਤ ਸੰਖਿਆ ਜੋੜਨੀ",
    NUM_DOUBLE_SQUARE: "ਸੰਖਿਆ ਨੂੰ ਦੁੱਗਣਾ ਕਰਕੇ ਉਸਦਾ ਵਰਗ ਕਰਨਾ", NUM_HALF_SQUARE: "ਸੰਖਿਆ ਨੂੰ ਅੱਧਾ ਕਰਕੇ ਉਸਦਾ ਵਰਗ ਕਰਨਾ", NUM_TIMES_SUCCESSOR: "ਸੰਖਿਆ ਨੂੰ ਉਸ ਤੋਂ ਅਗਲੀ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰਨਾ", NUM_TIMES_PREDECESSOR: "ਸੰਖਿਆ ਨੂੰ ਉਸ ਤੋਂ ਪਿਛਲੀ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰਨਾ",
    DIGIT_SUM: "ਅੰਕਾਂ ਦਾ ਜੋੜ ਕਰਨਾ", DIGIT_PRODUCT: "ਅੰਕਾਂ ਦਾ ਗੁਣਨਫਲ ਕੱਢਣਾ", DIGIT_ABS_DIFF: "ਅੰਕਾਂ ਦਾ ਨਿਰਪੇਖ ਅੰਤਰ ਕੱਢਣਾ", DIGIT_SUM_SQUARES: "ਅੰਕਾਂ ਦੇ ਵਰਗਾਂ ਦਾ ਜੋੜ ਕਰਨਾ",
    DIGIT_PRODUCT_PLUS_SUM: "ਅੰਕਾਂ ਦੇ ਗੁਣਨਫਲ ਅਤੇ ਜੋੜ ਨੂੰ ਜੋੜਨਾ", DIGIT_REVERSE: "ਅੰਕਾਂ ਦਾ ਕ੍ਰਮ ਉਲਟਣਾ", DIGIT_POSITIONAL: "ਅੰਕਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਦਹਾਈ ਵਾਲਾ ਅੰਕ ਜੋੜਨਾ",
  },
};

function localizedStep(g: GeneratedNumericAnalogy, input: number, output: number, locale: NumericLocale): string {
  if (g.ruleId !== "DIGIT_REVERSE") {
    const english = input === g.sourceA ? g.explanation.sourceDemonstration : g.explanation.targetApplication;
    return english;
  }
  return locale === "hi-IN"
    ? `${input} के अंकों का क्रम उलटने पर ${output} प्राप्त होता है।`
    : `${input} ਦੇ ਅੰਕਾਂ ਦਾ ਕ੍ਰਮ ਉਲਟਣ ਤੇ ${output} ਮਿਲਦਾ ਹੈ।`;
}

export interface GeneratedLocalizedNumericAnalogy extends Omit<GeneratedNumericAnalogy, "stem" | "explanation"> {
  locale: NumericLocale;
  stem: string;
  explanation: GeneratedNumericAnalogy["explanation"];
}

export function generateLocalizedNumericAnalogy(qlId: string, locale: NumericLocale, seed = 0): GeneratedLocalizedNumericAnalogy {
  const g = generateNumericAnalogy(qlId, seed);
  const pairMode = g.presentationMode === "EQUIVALENT_PAIR_SELECTION";
  const stem = pairMode
    ? locale === "hi-IN"
      ? `उस युग्म का चयन कीजिए जो ${g.sourceA} : ${g.sourceB} के समान संबंध का अनुसरण करता है।`
      : `ਉਹ ਜੋੜਾ ਚੁਣੋ ਜੋ ${g.sourceA} : ${g.sourceB} ਵਾਲੇ ਹੀ ਸੰਬੰਧ ਦੀ ਪਾਲਣਾ ਕਰਦਾ ਹੈ।`
    : `${g.sourceA} : ${g.sourceB} :: ${g.targetA} : ?`;
  return {
    ...g,
    locale,
    stem,
    explanation: {
      ruleStatement: locale === "hi-IN" ? `संबंध है: ${LABELS[locale][g.ruleId]}।` : `ਸੰਬੰਧ ਹੈ: ${LABELS[locale][g.ruleId]}।`,
      sourceDemonstration: localizedStep(g, g.sourceA, g.sourceB, locale),
      targetApplication: localizedStep(g, g.targetA, g.targetB, locale),
      conclusion: pairMode
        ? locale === "hi-IN" ? `अतः ${g.targetA} : ${g.targetB} उसी नियम का अनुसरण करता है।` : `ਇਸ ਲਈ ${g.targetA} : ${g.targetB} ਉਸੇ ਨਿਯਮ ਦੀ ਪਾਲਣਾ ਕਰਦਾ ਹੈ।`
        : locale === "hi-IN" ? `अतः सही उत्तर ${g.targetB} है।` : `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${g.targetB} ਹੈ।`,
      closestTrapRejection: pairMode
        ? locale === "hi-IN" ? "अन्य युग्मों में मान्य संख्याएँ हैं, पर वे वही संख्यात्मक नियम नहीं निभाते।" : "ਹੋਰ ਜੋੜਿਆਂ ਵਿੱਚ ਠੀਕ ਸੰਖਿਆਵਾਂ ਹਨ, ਪਰ ਉਹ ਉਹੀ ਸੰਖਿਆਤਮਕ ਨਿਯਮ ਨਹੀਂ ਨਿਭਾਉਂਦੇ।"
        : locale === "hi-IN" ? "अन्य मान उत्तर के निकट हैं, पर वे बताए गए नियम से प्राप्त नहीं होते।" : "ਹੋਰ ਮੁੱਲ ਉੱਤਰ ਦੇ ਨੇੜੇ ਹਨ, ਪਰ ਉਹ ਦਿੱਤੇ ਨਿਯਮ ਨਾਲ ਪ੍ਰਾਪਤ ਨਹੀਂ ਹੁੰਦੇ।",
    },
  };
}
