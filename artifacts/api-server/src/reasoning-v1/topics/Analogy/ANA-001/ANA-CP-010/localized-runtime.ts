import { generateAnaCp010, type GeneratedAnaCp010, type GeneratedAnaCp010Numeric, type GeneratedAnaCp010Set } from "./runtime";
import { generateAnaCp010Semantic, type GeneratedAnaCp010Semantic } from "./semantic-runtime";

export type AnaCp010Locale = "en-IN" | "hi-IN" | "pa-IN";
export type GeneratedLocalizedAnaCp010 = GeneratedAnaCp010 | GeneratedAnaCp010Semantic;

const RULE_LABELS: Readonly<Record<string, Readonly<Record<AnaCp010Locale, string>>>> = {
  NUM_HIGHER_FIXED_POWER: {
    "en-IN": "raise the number to the same higher power",
    "hi-IN": "संख्या की वही उच्च घात लें",
    "pa-IN": "ਗਿਣਤੀ ਦੀ ਉਹੀ ਉੱਚੀ ਘਾਤ ਲਓ",
  },
  NUM_EXACT_SQUARE_ROOT: {
    "en-IN": "take the exact square root",
    "hi-IN": "सटीक वर्गमूल लें",
    "pa-IN": "ਸਹੀ ਵਰਗਮੂਲ ਲਓ",
  },
  NUM_CUBE_ROOT_ADJUST: {
    "en-IN": "take the exact cube root and apply the same adjustment",
    "hi-IN": "सटीक घनमूल लेकर वही छोटा परिवर्तन करें",
    "pa-IN": "ਸਹੀ ਘਣਮੂਲ ਲੈ ਕੇ ਉਹੀ ਛੋਟਾ ਬਦਲਾਅ ਕਰੋ",
  },
  NUM_CUBE_SUBTRACT: {
    "en-IN": "cube the number and subtract the same constant",
    "hi-IN": "संख्या का घन करके वही निश्चित संख्या घटाएँ",
    "pa-IN": "ਗਿਣਤੀ ਦਾ ਘਣ ਕਰਕੇ ਉਹੀ ਨਿਸ਼ਚਿਤ ਗਿਣਤੀ ਘਟਾਓ",
  },
  NUM_DIGIT_QUOTIENT: {
    "en-IN": "divide the tens digit by the units digit",
    "hi-IN": "दहाई के अंक को इकाई के अंक से भाग दें",
    "pa-IN": "ਦਹਾਈ ਦੇ ਅੰਕ ਨੂੰ ਇਕਾਈ ਦੇ ਅੰਕ ਨਾਲ ਭਾਗ ਦਿਓ",
  },
  NUM_THREE_DIGIT_SUM: {
    "en-IN": "add all three digits",
    "hi-IN": "तीनों अंकों को जोड़ें",
    "pa-IN": "ਤਿੰਨਾਂ ਅੰਕਾਂ ਨੂੰ ਜੋੜੋ",
  },
  NUM_THREE_DIGIT_PRODUCT: {
    "en-IN": "multiply all three digits",
    "hi-IN": "तीनों अंकों का गुणा करें",
    "pa-IN": "ਤਿੰਨਾਂ ਅੰਕਾਂ ਦਾ ਗੁਣਾ ਕਰੋ",
  },
};

function numericStem(generated: GeneratedAnaCp010Numeric, locale: AnaCp010Locale): string {
  const relation = `${generated.source.input} : ${generated.source.output}`;
  if (generated.presentationMode === "MISSING_FOURTH_TERM") {
    if (locale === "hi-IN") return `वही संबंध रखते हुए प्रश्नवाचक चिन्ह (?) के स्थान पर आने वाली संख्या चुनें।\n${relation} :: ${generated.target.input} : ?`;
    if (locale === "pa-IN") return `ਉਹ ਗਿਣਤੀ ਚੁਣੋ ਜੋ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ (?) ਦੀ ਥਾਂ ਆਵੇ ਤਾਂ ਕਿ ਉਹੀ ਸੰਬੰਧ ਬਣਿਆ ਰਹੇ।\n${relation} :: ${generated.target.input} : ?`;
    return generated.stem;
  }
  if (locale === "hi-IN") return `उस विकल्प को चुनें जिसमें संख्याओं का संबंध ${relation} जैसा ही है।`;
  if (locale === "pa-IN") return `ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਗਿਣਤੀਆਂ ਦਾ ਸੰਬੰਧ ${relation} ਵਰਗਾ ਹੀ ਹੈ।`;
  return generated.stem;
}

function numericExplanation(generated: GeneratedAnaCp010Numeric, locale: AnaCp010Locale): readonly string[] {
  if (locale === "en-IN") return generated.explanation;
  const label = RULE_LABELS[generated.ruleId][locale];
  const sourceCalc = generated.explanation[1].replace(/^Given pair:\s*/i, "");
  const targetCalc = generated.explanation[2].replace(/^Apply it to the target:\s*/i, "");
  const answer = generated.presentationMode === "MISSING_FOURTH_TERM"
    ? String(generated.target.output)
    : `${generated.target.input} : ${generated.target.output}`;
  if (locale === "hi-IN") {
    return [
      `नियम: ${label}।`,
      `दिया गया युग्म: ${sourceCalc}`,
      `यही नियम लक्ष्य पर लगाएँ: ${targetCalc}`,
      `इसलिए सही उत्तर ${answer} है।`,
    ];
  }
  return [
    `ਨਿਯਮ: ${label}।`,
    `ਦਿੱਤਾ ਜੋੜਾ: ${sourceCalc}`,
    `ਇਹੀ ਨਿਯਮ ਅਗਲੇ ਉੱਤੇ ਲਗਾਓ: ${targetCalc}`,
    `ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${answer} ਹੈ।`,
  ];
}

function setStem(generated: GeneratedAnaCp010Set, locale: AnaCp010Locale): string {
  const source = `(${generated.source.join(", ")})`;
  if (locale === "hi-IN") return `उस समुच्चय को चुनें जिसमें संख्याएँ ${source} की संख्याओं की तरह संबंधित हैं।`;
  if (locale === "pa-IN") return `ਉਹ ਸਮੂਹ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਗਿਣਤੀਆਂ ਦਾ ਸੰਬੰਧ ${source} ਦੀਆਂ ਗਿਣਤੀਆਂ ਵਰਗਾ ਹੈ।`;
  return generated.stem;
}

function setExplanation(generated: GeneratedAnaCp010Set, locale: AnaCp010Locale): readonly string[] {
  if (locale === "en-IN") return generated.explanation;
  const correct = generated.options[generated.correctIndex].value;
  if (generated.ruleId === "SET_ALL_PRIME") {
    if (locale === "hi-IN") return [
      `दिए गए समुच्चय की तीनों संख्याएँ अभाज्य हैं।`,
      `केवल (${correct.join(", ")}) में भी तीनों संख्याएँ अभाज्य हैं।`,
      `बाकी हर विकल्प में कम-से-कम एक भाज्य संख्या है।`,
    ];
    return [
      `ਦਿੱਤੇ ਸਮੂਹ ਦੀਆਂ ਤਿੰਨਾਂ ਗਿਣਤੀਆਂ ਅਭਾਜ ਹਨ।`,
      `ਸਿਰਫ਼ (${correct.join(", ")}) ਵਿੱਚ ਵੀ ਤਿੰਨਾਂ ਗਿਣਤੀਆਂ ਅਭਾਜ ਹਨ।`,
      `ਬਾਕੀ ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸੰਯੁਕਤ ਗਿਣਤੀ ਹੈ।`,
    ];
  }
  const ratio = generated.source[1] / generated.source[0];
  if (locale === "hi-IN") return [
    `${generated.source[0]} × ${ratio} = ${generated.source[1]} और ${generated.source[1]} × ${ratio} = ${generated.source[2]}।`,
    `सही विकल्प में भी दोनों चरणों पर × ${ratio} ही लगता है।`,
    `बाकी विकल्प दोनों चरणों में एक ही गुणक नहीं रखते।`,
  ];
  return [
    `${generated.source[0]} × ${ratio} = ${generated.source[1]} ਅਤੇ ${generated.source[1]} × ${ratio} = ${generated.source[2]}।`,
    `ਸਹੀ ਵਿਕਲਪ ਵਿੱਚ ਵੀ ਦੋਵੇਂ ਕਦਮਾਂ ਤੇ × ${ratio} ਹੀ ਲੱਗਦਾ ਹੈ।`,
    `ਬਾਕੀ ਵਿਕਲਪ ਦੋਵੇਂ ਕਦਮਾਂ ਵਿੱਚ ਇੱਕੋ ਗੁਣਕ ਨਹੀਂ ਰੱਖਦੇ।`,
  ];
}

export function generateLocalizedAnaCp010(
  qlId: string,
  seed = 0,
  locale: AnaCp010Locale = "en-IN",
): GeneratedLocalizedAnaCp010 {
  if (qlId === "ANA-QL-267" || qlId === "ANA-QL-268") {
    return generateAnaCp010Semantic(qlId, seed, locale);
  }
  const generated = generateAnaCp010(qlId, seed);
  if (locale === "en-IN") return generated;
  if (generated.kind === "NUMERIC") {
    return { ...generated, stem: numericStem(generated, locale), explanation: numericExplanation(generated, locale) };
  }
  return { ...generated, stem: setStem(generated, locale), explanation: setExplanation(generated, locale) };
}
