import { generateSetAnalogy, type GeneratedSetAnalogy, type SetLayout } from "./generator";

export type SetLocale = "hi-IN" | "pa-IN";

const RULE_TEXT: Record<SetLocale, Record<string, (context: { k?: number; ratio?: number }) => string>> = {
  "hi-IN": {
    SET_SUM: () => "तीसरी संख्या पहली दो संख्याओं का योग है",
    SET_ABS_DIFFERENCE: () => "तीसरी संख्या पहली दो संख्याओं का धनात्मक अंतर है",
    SET_PRODUCT: () => "तीसरी संख्या पहली दो संख्याओं का गुणनफल है",
    SET_PRODUCT_ADJUST: (c) => `पहली दो संख्याओं को गुणा करके ${c.k} जोड़ते हैं`,
    SET_SQUARE_SUM: () => "तीसरी संख्या पहली दो संख्याओं के वर्गों का योग है",
    SET_SQUARE_DIFFERENCE: () => "तीसरी संख्या पहली दो संख्याओं के वर्गों का धनात्मक अंतर है",
    SET_PRODUCT_PLUS_FIRST: () => "पहली दो संख्याओं को गुणा करके पहली संख्या जोड़ते हैं",
    SET_PRODUCT_PLUS_SECOND: () => "पहली दो संख्याओं को गुणा करके दूसरी संख्या जोड़ते हैं",
    SET_PRODUCT_MINUS_FIRST: () => "पहली दो संख्याओं को गुणा करके पहली संख्या घटाते हैं",
    SET_PRODUCT_MINUS_SECOND: () => "पहली दो संख्याओं को गुणा करके दूसरी संख्या घटाते हैं",
    SET_AVERAGE: () => "तीसरी संख्या पहली दो संख्याओं का औसत है",
    SET_SUM_MULTIPLIER: (c) => `पहली दो संख्याओं का योग करके ${c.k} से गुणा करते हैं`,
    SET_DIFF_MULTIPLIER: (c) => `पहली दो संख्याओं का धनात्मक अंतर लेकर ${c.k} से गुणा करते हैं`,
    SET_CONSECUTIVE_CONSTRUCTION: () => "तीनों संख्याएँ क्रमागत हैं",
    SET_MATCHING_TRIPLES: () => "पहली दो संख्याओं के गुणनफल और योग को जोड़ते हैं",
    SET_CORRESPONDING_MISSING_MEMBER: () => "तीसरी संख्या पहली संख्या और दूसरी संख्या की दुगुनी के योग के बराबर है",
  },
  "pa-IN": {
    SET_SUM: () => "ਤੀਜੀ ਸੰਖਿਆ ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਦਾ ਜੋੜ ਹੈ",
    SET_ABS_DIFFERENCE: () => "ਤੀਜੀ ਸੰਖਿਆ ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਦਾ ਧਨਾਤਮਕ ਅੰਤਰ ਹੈ",
    SET_PRODUCT: () => "ਤੀਜੀ ਸੰਖਿਆ ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਦਾ ਗੁਣਨਫਲ ਹੈ",
    SET_PRODUCT_ADJUST: (c) => `ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ${c.k} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ`,
    SET_SQUARE_SUM: () => "ਤੀਜੀ ਸੰਖਿਆ ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਦੇ ਵਰਗਾਂ ਦਾ ਜੋੜ ਹੈ",
    SET_SQUARE_DIFFERENCE: () => "ਤੀਜੀ ਸੰਖਿਆ ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਦੇ ਵਰਗਾਂ ਦਾ ਧਨਾਤਮਕ ਅੰਤਰ ਹੈ",
    SET_PRODUCT_PLUS_FIRST: () => "ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਪਹਿਲੀ ਸੰਖਿਆ ਜੋੜੀ ਜਾਂਦੀ ਹੈ",
    SET_PRODUCT_PLUS_SECOND: () => "ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਦੂਜੀ ਸੰਖਿਆ ਜੋੜੀ ਜਾਂਦੀ ਹੈ",
    SET_PRODUCT_MINUS_FIRST: () => "ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਪਹਿਲੀ ਸੰਖਿਆ ਘਟਾਈ ਜਾਂਦੀ ਹੈ",
    SET_PRODUCT_MINUS_SECOND: () => "ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਦੂਜੀ ਸੰਖਿਆ ਘਟਾਈ ਜਾਂਦੀ ਹੈ",
    SET_AVERAGE: () => "ਤੀਜੀ ਸੰਖਿਆ ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਦੀ ਔਸਤ ਹੈ",
    SET_SUM_MULTIPLIER: (c) => `ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਦਾ ਜੋੜ ਕਰਕੇ ${c.k} ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ`,
    SET_DIFF_MULTIPLIER: (c) => `ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਦਾ ਧਨਾਤਮਕ ਅੰਤਰ ਲੈ ਕੇ ${c.k} ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ`,
    SET_CONSECUTIVE_CONSTRUCTION: () => "ਤਿੰਨੋਂ ਸੰਖਿਆਵਾਂ ਲਗਾਤਾਰ ਹਨ",
    SET_MATCHING_TRIPLES: () => "ਪਹਿਲੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਦੇ ਗੁਣਨਫਲ ਅਤੇ ਜੋੜ ਨੂੰ ਆਪਸ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ",
    SET_CORRESPONDING_MISSING_MEMBER: () => "ਤੀਜੀ ਸੰਖਿਆ ਪਹਿਲੀ ਸੰਖਿਆ ਅਤੇ ਦੂਜੀ ਸੰਖਿਆ ਦੀ ਦੁੱਗਣੀ ਦੇ ਜੋੜ ਦੇ ਬਰਾਬਰ ਹੈ",
  },
};

function translateStem(stem: string, layout: SetLayout, locale: SetLocale, selection: boolean): string {
  const hi = locale === "hi-IN";
  if (selection) {
    const prefix = hi ? "उस संख्या-समूह को चुनिए जो इसी नियम का पालन करता है:" : "ਉਹ ਸੰਖਿਆ-ਸਮੂਹ ਚੁਣੋ ਜੋ ਇਸੇ ਨਿਯਮ ਦੀ ਪਾਲਣਾ ਕਰਦਾ ਹੈ:";
    const marker = stem.match(/(\([^\n]+\)|\[[^\n]+\]|\|[^\n]+\||\d+\s*→\s*\d+\s*→\s*\d+)/)?.[0];
    return `${prefix} ${marker ?? stem}`;
  }
  if (layout === "TWO_ROW_TABLE") {
    return stem.replace("Complete the second row using the same rule.", hi ? "उसी नियम का प्रयोग करके दूसरी पंक्ति पूरी कीजिए।" : "ਉਸੇ ਨਿਯਮ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਦੂਜੀ ਕਤਾਰ ਪੂਰੀ ਕਰੋ।");
  }
  if (layout === "VERTICAL_GRID") {
    return stem.replace("Find the missing number in the second column.", hi ? "दूसरे स्तंभ में लुप्त संख्या ज्ञात कीजिए।" : "ਦੂਜੇ ਕਾਲਮ ਵਿੱਚ ਗੁੰਮ ਸੰਖਿਆ ਲੱਭੋ।");
  }
  if (layout === "BOXED_SETS") {
    return stem.replace("The two boxes follow the same rule:", hi ? "दोनों बॉक्स एक ही नियम का पालन करते हैं:" : "ਦੋਵੇਂ ਖਾਨੇ ਇੱਕੋ ਨਿਯਮ ਦੀ ਪਾਲਣਾ ਕਰਦੇ ਹਨ:");
  }
  return stem;
}

export interface LocalizedSetAnalogy extends GeneratedSetAnalogy {
  locale: SetLocale;
}

export function generateLocalizedSetAnalogy(qlId: string, locale: SetLocale, seed = 0): LocalizedSetAnalogy {
  const base = generateSetAnalogy(qlId, seed);
  const hi = locale === "hi-IN";
  const ruleText = RULE_TEXT[locale][base.ruleId];
  if (!ruleText) throw new Error(`Missing ${locale} rule text for ${base.ruleId}`);
  const selection = base.presentationMode === "EQUIVALENT_SET_SELECTION";
  return {
    ...base,
    locale,
    stem: translateStem(base.stem, base.layout, locale, selection),
    explanation: {
      ruleStatement: `${hi ? "संबंध का नियम है" : "ਸੰਬੰਧ ਦਾ ਨਿਯਮ ਹੈ"}: ${ruleText(base.context)}।`,
      sourceDemonstration: base.explanation.sourceDemonstration,
      targetApplication: base.explanation.targetApplication,
      conclusion: selection
        ? (hi
          ? `अतः (${base.target.first}, ${base.target.second}, ${base.target.third}) उसी नियम का पालन करता है।`
          : `ਇਸ ਲਈ (${base.target.first}, ${base.target.second}, ${base.target.third}) ਉਸੇ ਨਿਯਮ ਦੀ ਪਾਲਣਾ ਕਰਦਾ ਹੈ।`)
        : (hi
          ? `अतः ${base.target.third} लुप्त संख्या है।`
          : `ਇਸ ਲਈ ${base.target.third} ਗੁੰਮ ਸੰਖਿਆ ਹੈ।`),
      closestTrapRejection: selection
        ? (hi
          ? "अन्य समूहों में संख्याएँ उचित लगती हैं, लेकिन वे दिखाए गए संबंध को बनाए नहीं रखते।"
          : "ਹੋਰ ਸਮੂਹਾਂ ਦੀਆਂ ਸੰਖਿਆਵਾਂ ਠੀਕ ਲੱਗਦੀਆਂ ਹਨ, ਪਰ ਉਹ ਦਿਖਾਏ ਗਏ ਸੰਬੰਧ ਨੂੰ ਕਾਇਮ ਨਹੀਂ ਰੱਖਦੀਆਂ।")
        : (hi
          ? "अन्य विकल्प आकर्षक वैकल्पिक गणनाओं से मिलते हैं, लेकिन दोनों समूहों में दिखाए गए नियम से नहीं।"
          : "ਹੋਰ ਵਿਕਲਪ ਆਕਰਸ਼ਕ ਵੱਖਰੀਆਂ ਗਣਨਾਵਾਂ ਤੋਂ ਮਿਲਦੇ ਹਨ, ਪਰ ਦੋਵੇਂ ਸਮੂਹਾਂ ਵਿੱਚ ਦਿਖਾਏ ਨਿਯਮ ਤੋਂ ਨਹੀਂ।"),
    },
  };
}
