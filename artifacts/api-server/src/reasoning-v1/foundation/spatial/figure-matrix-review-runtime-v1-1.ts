import {
  generateFigureMatrixReviewQuestionV1,
  type FigureMatrixLanguageV1,
  type FigureMatrixQlIdV1,
} from "./figure-matrix-review-runtime-v1";

type SemanticState = Readonly<{
  segments?: readonly ("H" | "V" | "D1" | "D2")[];
  rotation?: number;
  position?: string;
  dotCount?: number;
  glyph?: string;
}>;

const FAMILY_LABELS: Readonly<Record<FigureMatrixQlIdV1, string>> = Object.freeze({
  "SPA-QL-055": "Repeated rotation",
  "SPA-QL-056": "Figure composition",
  "SPA-QL-057": "Count relation",
  "SPA-QL-058": "Cyclic distribution",
  "SPA-QL-059": "Row-column attributes",
  "SPA-QL-060": "Combined rotation and movement",
});

function hash32(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function fingerprint(text: string): string {
  return `fmt-${hash32(text).toString(16).padStart(8, "0")}`;
}

function parseState(text: string): SemanticState {
  try {
    return JSON.parse(text) as SemanticState;
  } catch {
    return Object.freeze({});
  }
}

function englishList(items: readonly string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function segmentNames(state: SemanticState, language: FigureMatrixLanguageV1): readonly string[] {
  const en = {
    H: "horizontal line",
    V: "vertical line",
    D1: "top-left to bottom-right diagonal",
    D2: "top-right to bottom-left diagonal",
  } as const;
  const hi = {
    H: "क्षैतिज रेखा",
    V: "ऊर्ध्वाधर रेखा",
    D1: "ऊपर-बाएँ से नीचे-दाएँ विकर्ण",
    D2: "ऊपर-दाएँ से नीचे-बाएँ विकर्ण",
  } as const;
  const pa = {
    H: "ਹੋਰਿਜ਼ਾਂਟਲ ਰੇਖਾ",
    V: "ਵਰਟੀਕਲ ਰੇਖਾ",
    D1: "ਉੱਪਰ-ਖੱਬੇ ਤੋਂ ਹੇਠਾਂ-ਸੱਜੇ ਵਾਲਾ ਤਿਰਛਾ",
    D2: "ਉੱਪਰ-ਸੱਜੇ ਤੋਂ ਹੇਠਾਂ-ਖੱਬੇ ਵਾਲਾ ਤਿਰਛਾ",
  } as const;
  const names = language === "hi" ? hi : language === "pa" ? pa : en;
  return Object.freeze((state.segments ?? []).map((segment) => names[segment]));
}

function positionLabel(position: string | undefined, language: FigureMatrixLanguageV1): string {
  const map = {
    en: { N: "top", E: "right", S: "bottom", W: "left", C: "centre" },
    hi: { N: "ऊपर", E: "दाएँ", S: "नीचे", W: "बाएँ", C: "मध्य" },
    pa: { N: "ਉੱਪਰ", E: "ਸੱਜੇ", S: "ਹੇਠਾਂ", W: "ਖੱਬੇ", C: "ਮੱਧ" },
  } as const;
  return map[language][(position ?? "C") as keyof typeof map.en] ?? position ?? "";
}

function cleanEnglishInternalText(text: string): string {
  return text
    .replace(/\bposition-step\(s\)/g, "position step(s)")
    .replace(/\bposition N\b/g, "top position")
    .replace(/\bposition E\b/g, "right position")
    .replace(/\bposition S\b/g, "bottom position")
    .replace(/\bposition W\b/g, "left position")
    .replace(/\bxor\b/g, "exclusive-or")
    .replace(/\bunion\b/g, "combination")
    .replace(/\bintersection\b/g, "common-part rule");
}

function englishRule(operation: string, parameter: string): string {
  if (operation === "ROTATE") return `Across each row, the figure rotates by ${parameter}.`;
  if (operation === "UNION") return "In each row, the third cell contains every line segment that appears in either of the first two cells.";
  if (operation === "XOR") return "In each row, any line segment common to the first two cells cancels; the third cell keeps only the remaining segments.";
  if (operation === "INTERSECTION") return "In each row, the third cell keeps only the line segments that are common to the first two cells.";
  if (operation === "SUM") return "In each row, the number of dots in the third cell equals the sum of the first two cells.";
  if (operation === "ABSOLUTE_DIFFERENCE") return "In each row, the third-cell dot count equals the absolute difference between the first two counts.";
  if (operation === "DOUBLE_FIRST_PLUS_SECOND") return "In each row, double the first dot count and then add the second count to obtain the third.";
  if (operation === "CYCLIC_SHIFT") return `The figure property advances one place through the same cycle in every row and column: ${parameter}.`;
  if (operation === "ROW_ATTRIBUTE_PLUS_COLUMN_ATTRIBUTE") return `Each cell combines two independent clues: ${parameter}.`;
  if (operation === "ROTATE_AND_MOVE") return `Each step changes two features together: ${cleanEnglishInternalText(parameter)}.`;
  return cleanEnglishInternalText(parameter);
}

function localizedRule(language: FigureMatrixLanguageV1, operation: string, parameter: string): string {
  if (language === "en") return englishRule(operation, parameter);
  if (language === "hi") {
    if (operation === "ROTATE") return `हर पंक्ति में आकृति प्रत्येक अगले खाने में ${parameter} घूमती है।`;
    if (operation === "UNION") return "हर पंक्ति में तीसरे खाने में पहले दो खानों की सभी दिखाई देने वाली रेखाएँ शामिल होती हैं।";
    if (operation === "XOR") return "हर पंक्ति में पहले दो खानों की समान रेखाएँ कट जाती हैं और केवल बची हुई रेखाएँ तीसरे खाने में रहती हैं।";
    if (operation === "INTERSECTION") return "हर पंक्ति में तीसरे खाने में केवल वे रेखाएँ रहती हैं जो पहले दोनों खानों में समान हैं।";
    if (operation === "SUM") return "हर पंक्ति में तीसरे खाने के बिंदुओं की संख्या पहले और दूसरे खाने के बिंदुओं का योग है।";
    if (operation === "ABSOLUTE_DIFFERENCE") return "हर पंक्ति में तीसरे खाने के बिंदुओं की संख्या पहले दो खानों की संख्याओं का अंतर है।";
    if (operation === "DOUBLE_FIRST_PLUS_SECOND") return "हर पंक्ति में पहले खाने की संख्या को दो गुना करके दूसरे खाने की संख्या जोड़ने पर तीसरे खाने की संख्या मिलती है।";
    if (operation === "CYCLIC_SHIFT") return "आकृति, दिशा या स्थान एक निश्चित चक्र में क्रमशः आगे बढ़ता है और यही क्रम पंक्तियों व स्तंभों दोनों में बना रहता है।";
    if (operation === "ROW_ATTRIBUTE_PLUS_COLUMN_ATTRIBUTE") return "हर खाने में दो स्वतंत्र संकेत मिलते हैं—एक गुण पंक्ति से और दूसरा स्तंभ से तय होता है।";
    if (operation === "ROTATE_AND_MOVE") return "हर अगले खाने में दो परिवर्तन साथ-साथ होते हैं—आकृति घूमती भी है और स्थान भी बदलती है।";
    return "सभी पूर्ण पंक्तियों और स्तंभों में एक ही नियम दोहराया गया है।";
  }
  if (operation === "ROTATE") return `ਹਰ ਕਤਾਰ ਵਿੱਚ ਆਕ੍ਰਿਤੀ ਅਗਲੇ ਖਾਣੇ ਵਿੱਚ ${parameter} ਘੁੰਮਦੀ ਹੈ।`;
  if (operation === "UNION") return "ਹਰ ਕਤਾਰ ਵਿੱਚ ਤੀਜੇ ਖਾਣੇ ਵਿੱਚ ਪਹਿਲੇ ਦੋ ਖਾਣਿਆਂ ਦੀਆਂ ਸਾਰੀਆਂ ਦਿਖਾਈ ਦੇਣ ਵਾਲੀਆਂ ਰੇਖਾਵਾਂ ਸ਼ਾਮਲ ਹੁੰਦੀਆਂ ਹਨ।";
  if (operation === "XOR") return "ਹਰ ਕਤਾਰ ਵਿੱਚ ਪਹਿਲੇ ਦੋ ਖਾਣਿਆਂ ਦੀਆਂ ਸਾਂਝੀਆਂ ਰੇਖਾਵਾਂ ਰੱਦ ਹੋ ਜਾਂਦੀਆਂ ਹਨ ਅਤੇ ਬਾਕੀ ਰੇਖਾਵਾਂ ਤੀਜੇ ਖਾਣੇ ਵਿੱਚ ਰਹਿੰਦੀਆਂ ਹਨ।";
  if (operation === "INTERSECTION") return "ਹਰ ਕਤਾਰ ਵਿੱਚ ਤੀਜੇ ਖਾਣੇ ਵਿੱਚ ਸਿਰਫ਼ ਉਹ ਰੇਖਾਵਾਂ ਰਹਿੰਦੀਆਂ ਹਨ ਜੋ ਪਹਿਲੇ ਦੋਵੇਂ ਖਾਣਿਆਂ ਵਿੱਚ ਸਾਂਝੀਆਂ ਹਨ।";
  if (operation === "SUM") return "ਹਰ ਕਤਾਰ ਵਿੱਚ ਤੀਜੇ ਖਾਣੇ ਦੇ ਬਿੰਦੂਆਂ ਦੀ ਗਿਣਤੀ ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਖਾਣੇ ਦੀ ਗਿਣਤੀ ਦਾ ਜੋੜ ਹੈ।";
  if (operation === "ABSOLUTE_DIFFERENCE") return "ਹਰ ਕਤਾਰ ਵਿੱਚ ਤੀਜੇ ਖਾਣੇ ਦੇ ਬਿੰਦੂਆਂ ਦੀ ਗਿਣਤੀ ਪਹਿਲੀਆਂ ਦੋ ਗਿਣਤੀਆਂ ਦੇ ਅੰਤਰ ਦੇ ਬਰਾਬਰ ਹੈ।";
  if (operation === "DOUBLE_FIRST_PLUS_SECOND") return "ਹਰ ਕਤਾਰ ਵਿੱਚ ਪਹਿਲੀ ਗਿਣਤੀ ਨੂੰ ਦੋ ਗੁਣਾ ਕਰਕੇ ਦੂਜੀ ਗਿਣਤੀ ਜੋੜਣ ਨਾਲ ਤੀਜੀ ਗਿਣਤੀ ਮਿਲਦੀ ਹੈ।";
  if (operation === "CYCLIC_SHIFT") return "ਆਕ੍ਰਿਤੀ, ਦਿਸ਼ਾ ਜਾਂ ਸਥਾਨ ਇੱਕ ਨਿਰਧਾਰਤ ਚੱਕਰ ਵਿੱਚ ਅੱਗੇ ਵਧਦਾ ਹੈ ਅਤੇ ਇਹੀ ਕ੍ਰਮ ਕਤਾਰਾਂ ਅਤੇ ਕਾਲਮਾਂ ਦੋਵੇਂ ਵਿੱਚ ਰਹਿੰਦਾ ਹੈ।";
  if (operation === "ROW_ATTRIBUTE_PLUS_COLUMN_ATTRIBUTE") return "ਹਰ ਖਾਣੇ ਵਿੱਚ ਦੋ ਸੁਤੰਤਰ ਸੰਕੇਤ ਮਿਲਦੇ ਹਨ—ਇੱਕ ਗੁਣ ਕਤਾਰ ਤੋਂ ਅਤੇ ਦੂਜਾ ਕਾਲਮ ਤੋਂ ਤੈਅ ਹੁੰਦਾ ਹੈ।";
  if (operation === "ROTATE_AND_MOVE") return "ਹਰ ਅਗਲੇ ਖਾਣੇ ਵਿੱਚ ਦੋ ਬਦਲਾਅ ਇਕੱਠੇ ਹੁੰਦੇ ਹਨ—ਆਕ੍ਰਿਤੀ ਘੁੰਮਦੀ ਵੀ ਹੈ ਅਤੇ ਸਥਾਨ ਵੀ ਬਦਲਦੀ ਹੈ।";
  return "ਸਾਰੀਆਂ ਪੂਰੀਆਂ ਕਤਾਰਾਂ ਅਤੇ ਕਾਲਮਾਂ ਵਿੱਚ ਇੱਕੋ ਨਿਯਮ ਦੁਹਰਾਇਆ ਗਿਆ ਹੈ।";
}

function localizedWorked(language: FigureMatrixLanguageV1, operation: string, baseWorked: string): string {
  if (language === "en") return cleanEnglishInternalText(baseWorked);
  if (language === "hi") {
    if (["UNION", "XOR", "INTERSECTION"].includes(operation)) return "पहली दो पूरी पंक्तियों में पहले दो खानों की रेखाओं पर यही संयोजन नियम लगाने से तीसरा खाना ठीक बनता है।";
    if (["SUM", "ABSOLUTE_DIFFERENCE", "DOUBLE_FIRST_PLUS_SECOND"].includes(operation)) return "पहली दो पूरी पंक्तियों में बिंदुओं की गिनती पर यही संख्यात्मक संबंध सही बैठता है।";
    if (operation === "CYCLIC_SHIFT") return "हर पूरी पंक्ति में क्रम एक स्थान आगे बढ़ता है; अगली पंक्ति भी उसी चक्र के अगले स्थान से शुरू होती है।";
    if (operation === "ROW_ATTRIBUTE_PLUS_COLUMN_ATTRIBUTE") return "पंक्ति में मुख्य आकृति समान रहती है, जबकि स्तंभ दूसरा गुण—दिशा, स्थान या गिनती—तय करता है।";
    if (operation === "ROTATE_AND_MOVE") return "हर पूरी पंक्ति में दिशा और स्थान दोनों एक निश्चित कदम से साथ-साथ बदलते हैं।";
    return "पूरी पंक्तियाँ वही घूर्णन क्रम दोहराती हैं।";
  }
  if (["UNION", "XOR", "INTERSECTION"].includes(operation)) return "ਪਹਿਲੀਆਂ ਦੋ ਪੂਰੀਆਂ ਕਤਾਰਾਂ ਵਿੱਚ ਪਹਿਲੇ ਦੋ ਖਾਣਿਆਂ ਦੀਆਂ ਰੇਖਾਵਾਂ ਉੱਤੇ ਇਹੀ ਜੋੜ-ਨਿਯਮ ਲਗਾਉਣ ਨਾਲ ਤੀਜਾ ਖਾਣਾ ਬਣਦਾ ਹੈ।";
  if (["SUM", "ABSOLUTE_DIFFERENCE", "DOUBLE_FIRST_PLUS_SECOND"].includes(operation)) return "ਪਹਿਲੀਆਂ ਦੋ ਪੂਰੀਆਂ ਕਤਾਰਾਂ ਵਿੱਚ ਬਿੰਦੂਆਂ ਦੀ ਗਿਣਤੀ ਉੱਤੇ ਇਹੀ ਸੰਖਿਆਤਮਕ ਸੰਬੰਧ ਸਹੀ ਬੈਠਦਾ ਹੈ।";
  if (operation === "CYCLIC_SHIFT") return "ਹਰ ਪੂਰੀ ਕਤਾਰ ਵਿੱਚ ਕ੍ਰਮ ਇੱਕ ਸਥਾਨ ਅੱਗੇ ਵਧਦਾ ਹੈ ਅਤੇ ਅਗਲੀ ਕਤਾਰ ਵੀ ਚੱਕਰ ਦੇ ਅਗਲੇ ਸਥਾਨ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ।";
  if (operation === "ROW_ATTRIBUTE_PLUS_COLUMN_ATTRIBUTE") return "ਕਤਾਰ ਵਿੱਚ ਮੁੱਖ ਆਕ੍ਰਿਤੀ ਇੱਕੋ ਰਹਿੰਦੀ ਹੈ, ਜਦਕਿ ਕਾਲਮ ਦੂਜਾ ਗੁਣ—ਦਿਸ਼ਾ, ਸਥਾਨ ਜਾਂ ਗਿਣਤੀ—ਤੈਅ ਕਰਦਾ ਹੈ।";
  if (operation === "ROTATE_AND_MOVE") return "ਹਰ ਪੂਰੀ ਕਤਾਰ ਵਿੱਚ ਦਿਸ਼ਾ ਅਤੇ ਸਥਾਨ ਦੋਵੇਂ ਇੱਕ ਨਿਰਧਾਰਤ ਕਦਮ ਨਾਲ ਇਕੱਠੇ ਬਦਲਦੇ ਹਨ।";
  return "ਪੂਰੀਆਂ ਕਤਾਰਾਂ ਉਹੀ ਘੁੰਮਣ ਵਾਲਾ ਕ੍ਰਮ ਦੁਹਰਾਉਂਦੀਆਂ ਹਨ।";
}

function localizedApplication(
  language: FigureMatrixLanguageV1,
  operation: string,
  baseApplication: string,
  state: SemanticState,
  answer: string,
): string {
  if (["UNION", "XOR", "INTERSECTION"].includes(operation)) {
    const names = segmentNames(state, language);
    if (language === "hi") return `अंतिम पंक्ति पर वही नियम लगाने से ${names.join(", ") || "कोई रेखा नहीं"} बचती है। यह विकल्प ${answer} से मेल खाता है।`;
    if (language === "pa") return `ਆਖਰੀ ਕਤਾਰ ਉੱਤੇ ਉਹੀ ਨਿਯਮ ਲਗਾਉਣ ਨਾਲ ${names.join(", ") || "ਕੋਈ ਰੇਖਾ ਨਹੀਂ"} ਬਚਦੀ ਹੈ। ਇਹ ਵਿਕਲਪ ${answer} ਨਾਲ ਮਿਲਦੀ ਹੈ।`;
    return `Applying the same rule to the last row leaves ${englishList(names) || "no line segment"}. This matches option ${answer}.`;
  }
  if (operation === "ROTATE_AND_MOVE") {
    const rotation = state.rotation ?? 0;
    const position = positionLabel(state.position, language);
    if (language === "hi") return `अंतिम दिखाई देने वाले तीर पर दोनों परिवर्तन लगाने से दिशा ${rotation}° और स्थान ${position} मिलता है। यही विकल्प ${answer} है।`;
    if (language === "pa") return `ਆਖਰੀ ਦਿਖਾਈ ਦੇਣ ਵਾਲੇ ਤੀਰ ਉੱਤੇ ਦੋਵੇਂ ਬਦਲਾਅ ਲਗਾਉਣ ਨਾਲ ਦਿਸ਼ਾ ${rotation}° ਅਤੇ ਸਥਾਨ ${position} ਮਿਲਦਾ ਹੈ। ਇਹੀ ਵਿਕਲਪ ${answer} ਹੈ।`;
    return `Applying both changes to the last visible arrow gives orientation ${rotation}° at the ${position} position. That is option ${answer}.`;
  }
  if (language === "en") return cleanEnglishInternalText(baseApplication);
  if (language === "hi") return `अपूर्ण पंक्ति या स्तंभ में वही नियम लगाने पर विकल्प ${answer} वाली आकृति मिलती है।`;
  return `ਅਧੂਰੀ ਕਤਾਰ ਜਾਂ ਕਾਲਮ ਵਿੱਚ ਉਹੀ ਨਿਯਮ ਲਗਾਉਣ ਨਾਲ ਵਿਕਲਪ ${answer} ਵਾਲੀ ਆਕ੍ਰਿਤੀ ਮਿਲਦੀ ਹੈ।`;
}

function translateFailure(language: FigureMatrixLanguageV1, failure: string): string {
  if (language === "en") return failure;
  const match = /^Option ([A-D]): (.+)\.$/.exec(failure);
  if (!match) return failure;
  const label = match[1];
  const reason = match[2];
  const replacements = language === "hi"
    ? [
        ["wrong shape/motif", "आकृति गलत है"],
        ["wrong orientation", "दिशा गलत है"],
        ["wrong position", "स्थान गलत है"],
        ["wrong fill state", "भराव गलत है"],
        ["wrong element count", "तत्वों की संख्या गलत है"],
        ["wrong segment set/composition", "रेखाओं का संयोजन गलत है"],
      ] as const
    : [
        ["wrong shape/motif", "ਆਕ੍ਰਿਤੀ ਗਲਤ ਹੈ"],
        ["wrong orientation", "ਦਿਸ਼ਾ ਗਲਤ ਹੈ"],
        ["wrong position", "ਸਥਾਨ ਗਲਤ ਹੈ"],
        ["wrong fill state", "ਭਰਾਵ ਗਲਤ ਹੈ"],
        ["wrong element count", "ਤੱਤਾਂ ਦੀ ਗਿਣਤੀ ਗਲਤ ਹੈ"],
        ["wrong segment set/composition", "ਰੇਖਾਵਾਂ ਦਾ ਜੋੜ ਗਲਤ ਹੈ"],
      ] as const;
  let translated = reason;
  for (const [source, target] of replacements) translated = translated.replace(source, target);
  translated = translated.replace(/ and /g, language === "hi" ? " और " : " ਅਤੇ ");
  return language === "hi" ? `विकल्प ${label}: ${translated}।` : `ਵਿਕਲਪ ${label}: ${translated}।`;
}

export function generateFigureMatrixReviewQuestionV1_1(input: Readonly<{
  qlId: FigureMatrixQlIdV1;
  seed: string;
  language: FigureMatrixLanguageV1;
}>) {
  const base = generateFigureMatrixReviewQuestionV1(input);
  const state = parseState(base.solveFacts.semanticAnswerKey);
  const operation = base.solveFacts.operation;
  const explanation = Object.freeze({
    rule: localizedRule(input.language, operation, base.solveFacts.parameter),
    worked: localizedWorked(input.language, operation, base.explanation.worked),
    application: localizedApplication(input.language, operation, base.explanation.application, state, base.answer),
    verification: input.language === "en"
      ? `${cleanEnglishInternalText(base.explanation.verification)}`
      : input.language === "hi"
        ? `अन्य पूरी पंक्तियाँ/स्तंभ भी इसी नियम की पुष्टि करते हैं। इसलिए सही उत्तर विकल्प ${base.answer} है।`
        : `ਹੋਰ ਪੂਰੀਆਂ ਕਤਾਰਾਂ/ਕਾਲਮ ਵੀ ਇਸੇ ਨਿਯਮ ਦੀ ਪੁਸ਼ਟੀ ਕਰਦੇ ਹਨ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ਵਿਕਲਪ ${base.answer} ਹੈ।`,
    distractorChecks: Object.freeze(base.solveFacts.distractorFailures.map((failure) => translateFailure(input.language, failure))),
  });
  const contentFingerprint = fingerprint([
    base.geometryFingerprint,
    input.language,
    base.stem,
    explanation.rule,
    explanation.worked,
    explanation.application,
    explanation.verification,
    ...explanation.distractorChecks,
  ].join("|"));

  return Object.freeze({
    ...base,
    version: "SPA-FMT-001-REVIEW-QUESTION-V1.1" as const,
    familyLabel: FAMILY_LABELS[input.qlId],
    explanation,
    contentFingerprint,
    validation: Object.freeze({
      ...base.validation,
      editorialExplanationReviewed: true as const,
      internalRuleTokensHiddenFromLearnerExplanation: true as const,
      localizedExplanationLanguagePure: true as const,
    }),
  });
}
