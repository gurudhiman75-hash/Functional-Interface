import {
  type FigureMatrixLanguageV2,
  type FigureMatrixQlIdV2,
} from "./figure-matrix-review-runtime-v2";
import { generateFigureMatrixReviewQuestionV2_2 } from "./figure-matrix-review-runtime-v2-2";

type SegmentCode = "H" | "V" | "D1" | "D2";
type ParsedOptionState = Readonly<{
  segments: readonly SegmentCode[];
  dotCount: number | null;
  glyph: string | null;
  rotation: number | null;
  position: string | null;
  fillPattern: string | null;
}>;

type ReviewQuestionV22 = ReturnType<typeof generateFigureMatrixReviewQuestionV2_2>;

const SEGMENT_ORDER: readonly SegmentCode[] = ["H", "V", "D1", "D2"];

function hash32(text: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function fingerprint(text: string): string {
  return `fmt23-${hash32(text).toString(16).padStart(8, "0")}`;
}

function parseOptionState(key: string): ParsedOptionState {
  if (!key.startsWith("{")) {
    const segments = key.split("+").filter((value): value is SegmentCode => SEGMENT_ORDER.includes(value as SegmentCode));
    return Object.freeze({ segments: Object.freeze(segments), dotCount: null, glyph: null, rotation: null, position: null, fillPattern: null });
  }
  try {
    const value = JSON.parse(key) as Record<string, unknown>;
    const segments = Array.isArray(value.segments)
      ? value.segments.filter((entry): entry is SegmentCode => typeof entry === "string" && SEGMENT_ORDER.includes(entry as SegmentCode))
      : [];
    return Object.freeze({
      segments: Object.freeze(segments),
      dotCount: typeof value.dotCount === "number" ? value.dotCount : null,
      glyph: typeof value.glyph === "string" ? value.glyph : null,
      rotation: typeof value.rotation === "number" ? value.rotation : null,
      position: typeof value.position === "string" ? value.position : null,
      fillPattern: typeof value.fillPattern === "string" ? value.fillPattern : null,
    });
  } catch {
    return Object.freeze({ segments: Object.freeze([]), dotCount: null, glyph: null, rotation: null, position: null, fillPattern: null });
  }
}

function localizedList(items: readonly string[], language: FigureMatrixLanguageV2): string {
  if (items.length === 0) return language === "en" ? "no lines" : language === "hi" ? "कोई रेखा नहीं" : "ਕੋਈ ਰੇਖਾ ਨਹੀਂ";
  if (items.length === 1) return items[0];
  const conjunction = language === "en" ? " and " : language === "hi" ? " और " : " ਅਤੇ ";
  return `${items.slice(0, -1).join(", ")}${conjunction}${items.at(-1)}`;
}

function segmentName(segment: SegmentCode, language: FigureMatrixLanguageV2): string {
  const names = {
    en: {
      H: "horizontal line",
      V: "vertical line",
      D1: "diagonal from upper-left to lower-right",
      D2: "diagonal from upper-right to lower-left",
    },
    hi: {
      H: "क्षैतिज रेखा",
      V: "ऊर्ध्वाधर रेखा",
      D1: "ऊपर-बाएँ से नीचे-दाएँ विकर्ण",
      D2: "ऊपर-दाएँ से नीचे-बाएँ विकर्ण",
    },
    pa: {
      H: "ਹੋਰਿਜ਼ਾਂਟਲ ਰੇਖਾ",
      V: "ਵਰਟੀਕਲ ਰੇਖਾ",
      D1: "ਉੱਪਰ-ਖੱਬੇ ਤੋਂ ਹੇਠਾਂ-ਸੱਜੇ ਤਿਰਛੀ ਰੇਖਾ",
      D2: "ਉੱਪਰ-ਸੱਜੇ ਤੋਂ ਹੇਠਾਂ-ਖੱਬੇ ਤਿਰਛੀ ਰੇਖਾ",
    },
  } as const;
  return names[language][segment];
}

function describeSegments(segments: readonly SegmentCode[], language: FigureMatrixLanguageV2): string {
  return localizedList(
    SEGMENT_ORDER.filter((segment) => segments.includes(segment)).map((segment) => segmentName(segment, language)),
    language,
  );
}

function exactLineDistractor(
  optionLabel: string,
  candidateKey: string,
  correctKey: string,
  language: FigureMatrixLanguageV2,
): string {
  const candidate = parseOptionState(candidateKey).segments;
  const correct = parseOptionState(correctKey).segments;
  const missing = correct.filter((segment) => !candidate.includes(segment));
  const extra = candidate.filter((segment) => !correct.includes(segment));

  if (language === "hi") {
    if (missing.length && extra.length) return `विकल्प ${optionLabel} में ${describeSegments(missing, language)} नहीं है और ${describeSegments(extra, language)} अतिरिक्त है।`;
    if (missing.length) return `विकल्प ${optionLabel} में आवश्यक ${describeSegments(missing, language)} नहीं है।`;
    if (extra.length) return `विकल्प ${optionLabel} में ${describeSegments(extra, language)} अतिरिक्त है।`;
    return `विकल्प ${optionLabel} आवश्यक रेखा-परिणाम से मेल नहीं खाता।`;
  }
  if (language === "pa") {
    if (missing.length && extra.length) return `ਵਿਕਲਪ ${optionLabel} ਵਿੱਚ ${describeSegments(missing, language)} ਨਹੀਂ ਹੈ ਅਤੇ ${describeSegments(extra, language)} ਵਾਧੂ ਹੈ।`;
    if (missing.length) return `ਵਿਕਲਪ ${optionLabel} ਵਿੱਚ ਲੋੜੀਂਦੀ ${describeSegments(missing, language)} ਨਹੀਂ ਹੈ।`;
    if (extra.length) return `ਵਿਕਲਪ ${optionLabel} ਵਿੱਚ ${describeSegments(extra, language)} ਵਾਧੂ ਹੈ।`;
    return `ਵਿਕਲਪ ${optionLabel} ਲੋੜੀਂਦੇ ਰੇਖਾ-ਨਤੀਜੇ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ।`;
  }
  if (missing.length && extra.length) return `Option ${optionLabel} omits the ${describeSegments(missing, language)} and adds the ${describeSegments(extra, language)}.`;
  if (missing.length) return `Option ${optionLabel} omits the required ${describeSegments(missing, language)}.`;
  if (extra.length) return `Option ${optionLabel} keeps an extra ${describeSegments(extra, language)} that should not remain.`;
  return `Option ${optionLabel} does not match the required line result.`;
}

function compositionExplanation(question: ReviewQuestionV22, language: FigureMatrixLanguageV2) {
  const sourceVariant = question.solveFacts.sourceVariant;
  const target = describeSegments(parseOptionState(question.solveFacts.semanticAnswerKey).segments, language);
  const distractorChecks = question.solveFacts.semanticOptionKeys.map((candidateKey, index) => {
    if (index === question.correctIndex) return null;
    return exactLineDistractor(question.optionLabels[index], candidateKey, question.solveFacts.semanticAnswerKey, language);
  }).filter((value): value is string => value !== null);

  const copy = {
    UNION_OR_SUPERIMPOSITION: {
      en: [
        "In each row, the third cell is the superimposition of the first two: keep every line that appears in either cell, drawing a common line only once.",
        "Row 1 combines the horizontal and vertical lines with the vertical line and one diagonal; the result keeps the horizontal, vertical and that diagonal. Row 2 confirms the same union rule.",
        `Superimposing the two line sets in row 3 requires the ${target}. Therefore the answer is option ${question.answer}.`,
        "Every distinct line from either input must remain; a shared line is not duplicated or cancelled.",
      ],
      hi: [
        "हर पंक्ति में पहले दो खानों की सभी रेखाएँ तीसरे खाने में मिलती हैं; जो रेखा दोनों में समान है, उसे केवल एक बार रखा जाता है।",
        "पहली पंक्ति में क्षैतिज+ऊर्ध्वाधर रेखाओं को ऊर्ध्वाधर+एक विकर्ण के साथ मिलाने पर क्षैतिज, ऊर्ध्वाधर और वही विकर्ण मिलता है। दूसरी पंक्ति भी इसी जोड़ को दोहराती है।",
        `तीसरी पंक्ति के दोनों रेखा-समूहों को मिलाने पर ${target} चाहिए। इसलिए उत्तर विकल्प ${question.answer} है।`,
        "सही परिणाम में दोनों खानों की हर अलग रेखा रहती है और साझा रेखा दोहरी नहीं बनती।",
      ],
      pa: [
        "ਹਰ ਕਤਾਰ ਵਿੱਚ ਪਹਿਲੇ ਦੋ ਖਾਣਿਆਂ ਦੀਆਂ ਸਾਰੀਆਂ ਰੇਖਾਵਾਂ ਤੀਜੇ ਖਾਣੇ ਵਿੱਚ ਮਿਲਦੀਆਂ ਹਨ; ਦੋਵਾਂ ਵਿੱਚ ਸਾਂਝੀ ਰੇਖਾ ਸਿਰਫ਼ ਇੱਕ ਵਾਰ ਰਹਿੰਦੀ ਹੈ।",
        "ਪਹਿਲੀ ਕਤਾਰ ਵਿੱਚ ਹੋਰਿਜ਼ਾਂਟਲ+ਵਰਟੀਕਲ ਰੇਖਾਵਾਂ ਨੂੰ ਵਰਟੀਕਲ+ਇੱਕ ਤਿਰਛੀ ਰੇਖਾ ਨਾਲ ਮਿਲਾਉਣ ਤੇ ਹੋਰਿਜ਼ਾਂਟਲ, ਵਰਟੀਕਲ ਅਤੇ ਉਹ ਤਿਰਛੀ ਰੇਖਾ ਮਿਲਦੀ ਹੈ। ਦੂਜੀ ਕਤਾਰ ਵੀ ਇਹੀ ਜੋੜ ਦਿਖਾਉਂਦੀ ਹੈ।",
        `ਤੀਜੀ ਕਤਾਰ ਦੇ ਦੋਵੇਂ ਰੇਖਾ-ਸਮੂਹ ਮਿਲਾਉਣ ਤੇ ${target} ਚਾਹੀਦੀਆਂ ਹਨ। ਇਸ ਲਈ ਉੱਤਰ ਵਿਕਲਪ ${question.answer} ਹੈ।`,
        "ਸਹੀ ਨਤੀਜੇ ਵਿੱਚ ਦੋਵੇਂ ਖਾਣਿਆਂ ਦੀ ਹਰ ਵੱਖਰੀ ਰੇਖਾ ਰਹਿੰਦੀ ਹੈ ਅਤੇ ਸਾਂਝੀ ਰੇਖਾ ਦੋ ਵਾਰ ਨਹੀਂ ਬਣਦੀ।",
      ],
    },
    INTERSECTION_OR_COMMON_PARTS: {
      en: [
        "In each row, the third cell keeps only the lines common to both of the first two cells.",
        "In row 1, the only common line is the vertical line. In row 2, the horizontal line and the diagonal from upper-right to lower-left are common, so only those two remain.",
        `The common lines in row 3 are the ${target}. Therefore the answer is option ${question.answer}.`,
        "Any line present in only one of the first two cells must disappear from the result.",
      ],
      hi: [
        "हर पंक्ति के तीसरे खाने में केवल वे रेखाएँ रहती हैं जो पहले और दूसरे दोनों खानों में समान रूप से मौजूद हैं।",
        "पहली पंक्ति में दोनों खानों की साझा रेखा केवल ऊर्ध्वाधर है। दूसरी पंक्ति में क्षैतिज रेखा और ऊपर-दाएँ से नीचे-बाएँ विकर्ण दोनों साझा हैं; तीसरा खाना केवल इन्हें रखता है।",
        `तीसरी पंक्ति में दोनों खानों की साझा रेखाएँ ${target} हैं। इसलिए उत्तर विकल्प ${question.answer} है।`,
        "जो रेखा केवल एक खाने में दिखाई देती है, वह तीसरे खाने में नहीं आ सकती।",
      ],
      pa: [
        "ਹਰ ਕਤਾਰ ਦੇ ਤੀਜੇ ਖਾਣੇ ਵਿੱਚ ਸਿਰਫ਼ ਉਹ ਰੇਖਾਵਾਂ ਰਹਿੰਦੀਆਂ ਹਨ ਜੋ ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਦੋਵੇਂ ਖਾਣਿਆਂ ਵਿੱਚ ਸਾਂਝੀਆਂ ਹਨ।",
        "ਪਹਿਲੀ ਕਤਾਰ ਵਿੱਚ ਦੋਵਾਂ ਖਾਣਿਆਂ ਦੀ ਸਾਂਝੀ ਰੇਖਾ ਸਿਰਫ਼ ਵਰਟੀਕਲ ਹੈ। ਦੂਜੀ ਕਤਾਰ ਵਿੱਚ ਹੋਰਿਜ਼ਾਂਟਲ ਅਤੇ ਉੱਪਰ-ਸੱਜੇ ਤੋਂ ਹੇਠਾਂ-ਖੱਬੇ ਤਿਰਛੀ ਰੇਖਾ ਸਾਂਝੀਆਂ ਹਨ; ਤੀਜਾ ਖਾਣਾ ਸਿਰਫ਼ ਇਹਨਾਂ ਨੂੰ ਰੱਖਦਾ ਹੈ।",
        `ਤੀਜੀ ਕਤਾਰ ਵਿੱਚ ਦੋਵਾਂ ਖਾਣਿਆਂ ਦੀਆਂ ਸਾਂਝੀਆਂ ਰੇਖਾਵਾਂ ${target} ਹਨ। ਇਸ ਲਈ ਉੱਤਰ ਵਿਕਲਪ ${question.answer} ਹੈ।`,
        "ਜੋ ਰੇਖਾ ਸਿਰਫ਼ ਇੱਕ ਖਾਣੇ ਵਿੱਚ ਹੈ, ਉਹ ਤੀਜੇ ਖਾਣੇ ਵਿੱਚ ਨਹੀਂ ਆ ਸਕਦੀ।",
      ],
    },
    SYMMETRIC_DIFFERENCE_OR_CANCELLATION: {
      en: [
        "In each row, a line present in both first cells cancels; lines present in only one of them remain in the third cell.",
        "Row 1 cancels the shared vertical line, leaving the horizontal line and one diagonal. Row 2 cancels its shared diagonal, leaving the other diagonal and the horizontal line.",
        `In row 3, cancel the shared vertical line; the required result is the ${target}. Therefore the answer is option ${question.answer}.`,
        "A common line must not survive, and a non-common line must not be lost.",
      ],
      hi: [
        "हर पंक्ति में जो रेखा दोनों खानों में समान है वह रद्द हो जाती है; जो रेखा केवल एक खाने में है वही तीसरे खाने में रहती है।",
        "पहली पंक्ति में साझा ऊर्ध्वाधर रेखा रद्द होकर क्षैतिज और एक विकर्ण बचते हैं। दूसरी पंक्ति में साझा विकर्ण रद्द होकर दूसरी विकर्ण और क्षैतिज रेखा बचती है।",
        `तीसरी पंक्ति में साझा ऊर्ध्वाधर रेखा रद्द करने के बाद ${target} बचती हैं। इसलिए उत्तर विकल्प ${question.answer} है।`,
        "साझा रेखा बची रहना या किसी गैर-साझा रेखा का गायब होना इस नियम को तोड़ता है।",
      ],
      pa: [
        "ਹਰ ਕਤਾਰ ਵਿੱਚ ਦੋਵੇਂ ਖਾਣਿਆਂ ਦੀ ਸਾਂਝੀ ਰੇਖਾ ਰੱਦ ਹੋ ਜਾਂਦੀ ਹੈ; ਜੋ ਰੇਖਾ ਸਿਰਫ਼ ਇੱਕ ਖਾਣੇ ਵਿੱਚ ਹੈ ਉਹ ਤੀਜੇ ਖਾਣੇ ਵਿੱਚ ਰਹਿੰਦੀ ਹੈ।",
        "ਪਹਿਲੀ ਕਤਾਰ ਵਿੱਚ ਸਾਂਝੀ ਵਰਟੀਕਲ ਰੇਖਾ ਰੱਦ ਹੋ ਕੇ ਹੋਰਿਜ਼ਾਂਟਲ ਅਤੇ ਇੱਕ ਤਿਰਛੀ ਰੇਖਾ ਬਚਦੀਆਂ ਹਨ। ਦੂਜੀ ਕਤਾਰ ਵਿੱਚ ਸਾਂਝੀ ਤਿਰਛੀ ਰੇਖਾ ਰੱਦ ਹੋ ਕੇ ਦੂਜੀ ਤਿਰਛੀ ਅਤੇ ਹੋਰਿਜ਼ਾਂਟਲ ਰੇਖਾ ਬਚਦੀ ਹੈ।",
        `ਤੀਜੀ ਕਤਾਰ ਵਿੱਚ ਸਾਂਝੀ ਵਰਟੀਕਲ ਰੇਖਾ ਰੱਦ ਕਰਨ ਤੋਂ ਬਾਅਦ ${target} ਬਚਦੀਆਂ ਹਨ। ਇਸ ਲਈ ਉੱਤਰ ਵਿਕਲਪ ${question.answer} ਹੈ।`,
        "ਸਾਂਝੀ ਰੇਖਾ ਦਾ ਬਚਣਾ ਜਾਂ ਕਿਸੇ ਗੈਰ-ਸਾਂਝੀ ਰੇਖਾ ਦਾ ਗਾਇਬ ਹੋਣਾ ਨਿਯਮ ਨੂੰ ਤੋੜਦਾ ਹੈ।",
      ],
    },
    DIRECTIONAL_SUBTRACTION_OR_DIFFERENCE: {
      en: [
        "In each row, subtract the lines shown in the second cell from the first cell; the third cell contains only what remains from the first.",
        "Row 1 removes the vertical line from the first cell, leaving the horizontal line and one diagonal. Row 2 removes its shared diagonal, leaving the horizontal line and the other diagonal.",
        `In row 3, remove the vertical line and one diagonal shown in the second cell; the required remainder is the ${target}. Therefore the answer is option ${question.answer}.`,
        "This is directional subtraction: the first cell is the starting set, and only lines named by the second cell are removed from it.",
      ],
      hi: [
        "हर पंक्ति में दूसरे खाने में दिखाई देने वाली रेखाएँ पहले खाने से हटाई जाती हैं; तीसरे खाने में केवल पहले खाने की बची हुई रेखाएँ रहती हैं।",
        "पहली पंक्ति में ऊर्ध्वाधर रेखा हटाने पर क्षैतिज और एक विकर्ण बचते हैं। दूसरी पंक्ति में साझा विकर्ण हटाने पर क्षैतिज और दूसरा विकर्ण बचते हैं।",
        `तीसरी पंक्ति में दूसरे खाने की ऊर्ध्वाधर और एक विकर्ण रेखा को पहले खाने से हटाने पर ${target} बचती हैं। इसलिए उत्तर विकल्प ${question.answer} है।`,
        "यह दिशा-संवेदी घटाव है: पहला खाना आधार है और दूसरे खाने की रेखाएँ उसी से हटती हैं।",
      ],
      pa: [
        "ਹਰ ਕਤਾਰ ਵਿੱਚ ਦੂਜੇ ਖਾਣੇ ਦੀਆਂ ਰੇਖਾਵਾਂ ਪਹਿਲੇ ਖਾਣੇ ਵਿੱਚੋਂ ਹਟਾਈਆਂ ਜਾਂਦੀਆਂ ਹਨ; ਤੀਜੇ ਖਾਣੇ ਵਿੱਚ ਪਹਿਲੇ ਖਾਣੇ ਦੀਆਂ ਬਚੀਆਂ ਰੇਖਾਵਾਂ ਰਹਿੰਦੀਆਂ ਹਨ।",
        "ਪਹਿਲੀ ਕਤਾਰ ਵਿੱਚ ਵਰਟੀਕਲ ਰੇਖਾ ਹਟਾਉਣ ਤੇ ਹੋਰਿਜ਼ਾਂਟਲ ਅਤੇ ਇੱਕ ਤਿਰਛੀ ਰੇਖਾ ਬਚਦੀਆਂ ਹਨ। ਦੂਜੀ ਕਤਾਰ ਵਿੱਚ ਸਾਂਝੀ ਤਿਰਛੀ ਰੇਖਾ ਹਟਾਉਣ ਤੇ ਹੋਰਿਜ਼ਾਂਟਲ ਅਤੇ ਦੂਜੀ ਤਿਰਛੀ ਰੇਖਾ ਬਚਦੀਆਂ ਹਨ।",
        `ਤੀਜੀ ਕਤਾਰ ਵਿੱਚ ਦੂਜੇ ਖਾਣੇ ਦੀ ਵਰਟੀਕਲ ਅਤੇ ਇੱਕ ਤਿਰਛੀ ਰੇਖਾ ਪਹਿਲੇ ਖਾਣੇ ਵਿੱਚੋਂ ਹਟਾਉਣ ਤੇ ${target} ਬਚਦੀਆਂ ਹਨ। ਇਸ ਲਈ ਉੱਤਰ ਵਿਕਲਪ ${question.answer} ਹੈ।`,
        "ਇਹ ਦਿਸ਼ਾ-ਸੰਵੇਦੀ ਘਟਾਉ ਹੈ: ਪਹਿਲਾ ਖਾਣਾ ਆਧਾਰ ਹੈ ਅਤੇ ਦੂਜੇ ਖਾਣੇ ਦੀਆਂ ਰੇਖਾਵਾਂ ਉਸੇ ਵਿੱਚੋਂ ਹਟਦੀਆਂ ਹਨ।",
      ],
    },
  } as const;

  const selected = copy[sourceVariant as keyof typeof copy] ?? copy.UNION_OR_SUPERIMPOSITION;
  const [rule, worked, application, verification] = selected[language];
  return Object.freeze({ rule, worked, application, verification, distractorChecks: Object.freeze(distractorChecks) });
}

function countExplanation(question: ReviewQuestionV22, language: FigureMatrixLanguageV2) {
  const sourceVariant = question.solveFacts.sourceVariant;
  const target = parseOptionState(question.solveFacts.semanticAnswerKey).dotCount ?? 0;
  const candidateCounts = question.solveFacts.semanticOptionKeys.map((key) => parseOptionState(key).dotCount);
  const distractorChecks = candidateCounts.map((count, index) => {
    if (index === question.correctIndex) return null;
    if (language === "hi") return `विकल्प ${question.optionLabels[index]} में ${count ?? "गलत संख्या में"} बिंदु हैं, जबकि नियम से ${target} बिंदु चाहिए।`;
    if (language === "pa") return `ਵਿਕਲਪ ${question.optionLabels[index]} ਵਿੱਚ ${count ?? "ਗਲਤ ਗਿਣਤੀ ਵਿੱਚ"} ਬਿੰਦੂ ਹਨ, ਜਦਕਿ ਨਿਯਮ ਅਨੁਸਾਰ ${target} ਬਿੰਦੂ ਚਾਹੀਦੇ ਹਨ।`;
    return `Option ${question.optionLabels[index]} has ${count ?? "the wrong number of"} dots; the rule requires ${target}.`;
  }).filter((value): value is string => value !== null);

  const equations: Record<string, readonly [string, string, string]> = {
    SUM_ACROSS_CELLS: ["1 + 2 = 3", "2 + 3 = 5", "3 + 4 = 7"],
    ABSOLUTE_DIFFERENCE: ["|2 − 5| = 3", "|1 − 4| = 3", "|3 − 7| = 4"],
    DOUBLE_FIRST_PLUS_SECOND: ["2 × 1 + 1 = 3", "2 × 1 + 2 = 4", "2 × 2 + 1 = 5"],
    ADD_CONSTANT: ["1 → 3 → 5", "2 → 4 → 6", "3 → 5 → 7"],
    MULTIPLY_CONSTANT: ["1 → 2 → 4", "2 → 4 → 8", "1 → 2 → 4"],
    BALANCED_COUNT_RELATION: ["1 + 2 + 6 = 9", "2 + 3 + 4 = 9", "3 + 1 + 5 = 9"],
  };
  const rules = {
    en: {
      SUM_ACROSS_CELLS: "third count = first + second",
      ABSOLUTE_DIFFERENCE: "third count = absolute difference of the first two",
      DOUBLE_FIRST_PLUS_SECOND: "third count = twice the first + the second",
      ADD_CONSTANT: "add 2 dots at each step",
      MULTIPLY_CONSTANT: "double the number of dots at each step",
      BALANCED_COUNT_RELATION: "the three counts in each row total 9",
    },
    hi: {
      SUM_ACROSS_CELLS: "तीसरे खाने की संख्या = पहले + दूसरे खाने की संख्या",
      ABSOLUTE_DIFFERENCE: "तीसरे खाने की संख्या = पहले दो खानों की संख्याओं का निरपेक्ष अंतर",
      DOUBLE_FIRST_PLUS_SECOND: "तीसरे खाने की संख्या = पहले की दोगुनी + दूसरी",
      ADD_CONSTANT: "हर अगले खाने में 2 बिंदु जोड़ें",
      MULTIPLY_CONSTANT: "हर अगले खाने में बिंदुओं की संख्या दोगुनी करें",
      BALANCED_COUNT_RELATION: "हर पंक्ति के तीनों खानों के बिंदुओं का योग 9 है",
    },
    pa: {
      SUM_ACROSS_CELLS: "ਤੀਜੇ ਖਾਣੇ ਦੀ ਗਿਣਤੀ = ਪਹਿਲੇ + ਦੂਜੇ ਖਾਣੇ ਦੀ ਗਿਣਤੀ",
      ABSOLUTE_DIFFERENCE: "ਤੀਜੇ ਖਾਣੇ ਦੀ ਗਿਣਤੀ = ਪਹਿਲੇ ਦੋ ਖਾਣਿਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਨਿਰਪੇਖ ਅੰਤਰ",
      DOUBLE_FIRST_PLUS_SECOND: "ਤੀਜੇ ਖਾਣੇ ਦੀ ਗਿਣਤੀ = ਪਹਿਲੇ ਦੀ ਦੁੱਗਣੀ + ਦੂਜੀ",
      ADD_CONSTANT: "ਹਰ ਅਗਲੇ ਖਾਣੇ ਵਿੱਚ 2 ਬਿੰਦੂ ਜੋੜੋ",
      MULTIPLY_CONSTANT: "ਹਰ ਅਗਲੇ ਖਾਣੇ ਵਿੱਚ ਬਿੰਦੂਆਂ ਦੀ ਗਿਣਤੀ ਦੁੱਗਣੀ ਕਰੋ",
      BALANCED_COUNT_RELATION: "ਹਰ ਕਤਾਰ ਦੇ ਤਿੰਨਾਂ ਖਾਣਿਆਂ ਦੇ ਬਿੰਦੂਆਂ ਦਾ ਜੋੜ 9 ਹੈ",
    },
  } as const;
  const evidence = equations[sourceVariant] ?? equations.SUM_ACROSS_CELLS;
  const localizedRule = rules[language][sourceVariant as keyof typeof rules.en] ?? rules[language].SUM_ACROSS_CELLS;

  if (language === "hi") return Object.freeze({
    rule: `हर खाने के बिंदु गिनें। दोहराया गया नियम है: ${localizedRule}।`,
    worked: `पहली दो पूरी पंक्तियाँ इसे संख्यात्मक रूप से सिद्ध करती हैं: ${evidence[0]} और ${evidence[1]}।`,
    application: `तीसरी पंक्ति में ${evidence[2]}, इसलिए रिक्त खाने में ${target} बिंदु होने चाहिए। अतः उत्तर विकल्प ${question.answer} है।`,
    verification: "उत्तर विकल्प देखने से पहले ही पूरी पंक्तियों के नियम से आवश्यक संख्या निश्चित हो जाती है।",
    distractorChecks: Object.freeze(distractorChecks),
  });
  if (language === "pa") return Object.freeze({
    rule: `ਹਰ ਖਾਣੇ ਦੇ ਬਿੰਦੂ ਗਿਣੋ। ਦੁਹਰਾਇਆ ਗਿਆ ਨਿਯਮ ਹੈ: ${localizedRule}।`,
    worked: `ਪਹਿਲੀਆਂ ਦੋ ਪੂਰੀਆਂ ਕਤਾਰਾਂ ਇਸ ਨੂੰ ਅੰਕਾਂ ਨਾਲ ਸਾਬਤ ਕਰਦੀਆਂ ਹਨ: ${evidence[0]} ਅਤੇ ${evidence[1]}।`,
    application: `ਤੀਜੀ ਕਤਾਰ ਵਿੱਚ ${evidence[2]}, ਇਸ ਲਈ ਖਾਲੀ ਖਾਣੇ ਵਿੱਚ ${target} ਬਿੰਦੂ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ। ਇਸ ਲਈ ਉੱਤਰ ਵਿਕਲਪ ${question.answer} ਹੈ।`,
    verification: "ਉੱਤਰ ਵਿਕਲਪ ਵੇਖਣ ਤੋਂ ਪਹਿਲਾਂ ਹੀ ਪੂਰੀਆਂ ਕਤਾਰਾਂ ਦੇ ਨਿਯਮ ਨਾਲ ਲੋੜੀਂਦੀ ਗਿਣਤੀ ਨਿਰਧਾਰਤ ਹੋ ਜਾਂਦੀ ਹੈ।",
    distractorChecks: Object.freeze(distractorChecks),
  });
  return Object.freeze({
    rule: `Count the dots in each cell. The repeated rule is: ${localizedRule}.`,
    worked: `The first two completed rows verify it numerically: ${evidence[0]} and ${evidence[1]}.`,
    application: `For row 3, ${evidence[2]}, so the missing cell must contain ${target} dots. Therefore the answer is option ${question.answer}.`,
    verification: "The required count is fixed by the completed rows before the answer figures are compared.",
    distractorChecks: Object.freeze(distractorChecks),
  });
}

function cycleStateLabel(
  sourceVariant: string,
  state: ParsedOptionState,
  language: FigureMatrixLanguageV2,
): string {
  const glyphs = {
    en: { CIRCLE: "circle", SQUARE: "square", TRIANGLE: "triangle", DIAMOND: "diamond", ARROW: "arrow" },
    hi: { CIRCLE: "वृत्त", SQUARE: "वर्ग", TRIANGLE: "त्रिभुज", DIAMOND: "समचतुर्भुज", ARROW: "तीर" },
    pa: { CIRCLE: "ਵ੍ਰਿੱਤ", SQUARE: "ਵਰਗ", TRIANGLE: "ਤਿਕੋਣ", DIAMOND: "ਹੀਰਾ ਆਕ੍ਰਿਤੀ", ARROW: "ਤੀਰ" },
  } as const;
  const positions = {
    en: { N: "top position", E: "right position", S: "bottom position", W: "left position", C: "centre position" },
    hi: { N: "ऊपरी स्थान", E: "दायाँ स्थान", S: "निचला स्थान", W: "बायाँ स्थान", C: "मध्य स्थान" },
    pa: { N: "ਉੱਪਰਲਾ ਸਥਾਨ", E: "ਸੱਜਾ ਸਥਾਨ", S: "ਹੇਠਲਾ ਸਥਾਨ", W: "ਖੱਬਾ ਸਥਾਨ", C: "ਮੱਧ ਸਥਾਨ" },
  } as const;
  const fills = {
    en: { HOLLOW: "hollow state", SHADED: "shaded state", SOLID: "solid state" },
    hi: { HOLLOW: "खाली भराव", SHADED: "छायांकित भराव", SOLID: "ठोस भराव" },
    pa: { HOLLOW: "ਖਾਲੀ ਭਰਾਵ", SHADED: "ਛਾਇਆਦਾਰ ਭਰਾਵ", SOLID: "ਠੋਸ ਭਰਾਵ" },
  } as const;

  if (sourceVariant === "MOTIF_PERMUTATION") {
    return glyphs[language][(state.glyph ?? "CIRCLE") as keyof typeof glyphs.en] ?? glyphs[language].CIRCLE;
  }
  if (sourceVariant === "POSITION_CYCLE_4X4") {
    return positions[language][(state.position ?? "C") as keyof typeof positions.en] ?? positions[language].C;
  }
  if (sourceVariant === "ORIENTATION_CYCLE") return `${state.rotation ?? 0}°`;
  return fills[language][(state.fillPattern ?? "HOLLOW") as keyof typeof fills.en] ?? fills[language].HOLLOW;
}

function cycleExplanation(question: ReviewQuestionV22, language: FigureMatrixLanguageV2) {
  const sourceVariant = question.solveFacts.sourceVariant;
  const state = parseOptionState(question.solveFacts.semanticAnswerKey);
  const target = cycleStateLabel(sourceVariant, state, language);
  const cycles = {
    en: {
      MOTIF_PERMUTATION: "circle → square → triangle → circle",
      POSITION_CYCLE_4X4: "top → right → bottom → left → top",
      ORIENTATION_CYCLE: "0° → 120° → 240° → 0°",
      FILL_STATE_CYCLE: "hollow → shaded → solid → hollow",
    },
    hi: {
      MOTIF_PERMUTATION: "वृत्त → वर्ग → त्रिभुज → वृत्त",
      POSITION_CYCLE_4X4: "ऊपर → दाएँ → नीचे → बाएँ → ऊपर",
      ORIENTATION_CYCLE: "0° → 120° → 240° → 0°",
      FILL_STATE_CYCLE: "खाली → छायांकित → ठोस → खाली",
    },
    pa: {
      MOTIF_PERMUTATION: "ਵ੍ਰਿੱਤ → ਵਰਗ → ਤਿਕੋਣ → ਵ੍ਰਿੱਤ",
      POSITION_CYCLE_4X4: "ਉੱਪਰ → ਸੱਜੇ → ਹੇਠਾਂ → ਖੱਬੇ → ਉੱਪਰ",
      ORIENTATION_CYCLE: "0° → 120° → 240° → 0°",
      FILL_STATE_CYCLE: "ਖਾਲੀ → ਛਾਇਆਦਾਰ → ਠੋਸ → ਖਾਲੀ",
    },
  } as const;
  const cycle = cycles[language][sourceVariant as keyof typeof cycles.en] ?? "";

  if (language === "hi") return Object.freeze({
    ...question.explanation,
    rule: `पंक्तियों और स्तंभों दोनों में यही चक्र दोहरता है: ${cycle}।`,
    worked: "एक पूरी पंक्ति और एक पूरा स्तंभ दोनों एक-एक कदम आगे बढ़ते हैं; इसलिए दोनों दिशाएँ उसी चक्र की स्वतंत्र जाँच देती हैं।",
    application: `दोनों दिशाओं से चक्र आगे बढ़ाने पर रिक्त खाने में ${target} मिलता है, जो विकल्प ${question.answer} से मेल खाता है।`,
  });
  if (language === "pa") return Object.freeze({
    ...question.explanation,
    rule: `ਕਤਾਰਾਂ ਅਤੇ ਕਾਲਮਾਂ ਦੋਵਾਂ ਵਿੱਚ ਇਹੀ ਚੱਕਰ ਦੁਹਰਾਇਆ ਜਾਂਦਾ ਹੈ: ${cycle}।`,
    worked: "ਇੱਕ ਪੂਰੀ ਕਤਾਰ ਅਤੇ ਇੱਕ ਪੂਰਾ ਕਾਲਮ ਦੋਵੇਂ ਇੱਕ-ਇੱਕ ਕਦਮ ਅੱਗੇ ਵਧਦੇ ਹਨ; ਇਸ ਲਈ ਦੋਵੇਂ ਦਿਸ਼ਾਵਾਂ ਉਸੇ ਚੱਕਰ ਦੀ ਸੁਤੰਤਰ ਜਾਂਚ ਦਿੰਦੀਆਂ ਹਨ।",
    application: `ਦੋਵੇਂ ਦਿਸ਼ਾਵਾਂ ਤੋਂ ਚੱਕਰ ਅੱਗੇ ਵਧਾਉਣ ਤੇ ਖਾਲੀ ਖਾਣੇ ਵਿੱਚ ${target} ਮਿਲਦਾ ਹੈ, ਜੋ ਵਿਕਲਪ ${question.answer} ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`,
  });
  return Object.freeze({
    ...question.explanation,
    rule: `The same cyclic sequence is used across rows and down columns: ${cycle}.`,
    worked: "A completed row and a completed column each advance by one step, so the row and column are independent checks of the same cycle.",
    application: `Continuing the cycle from both directions gives the ${target} in the missing cell, matching option ${question.answer}.`,
  });
}

export function generateFigureMatrixReviewQuestionV2_3(input: Readonly<{
  qlId: FigureMatrixQlIdV2;
  seed: string;
  language: FigureMatrixLanguageV2;
}>) {
  const question = generateFigureMatrixReviewQuestionV2_2(input);
  const explanation = input.qlId === "SPA-QL-056"
    ? compositionExplanation(question, input.language)
    : input.qlId === "SPA-QL-057"
      ? countExplanation(question, input.language)
      : input.qlId === "SPA-QL-058"
        ? cycleExplanation(question, input.language)
        : question.explanation;

  const contentFingerprint = fingerprint([
    question.geometryFingerprint,
    input.language,
    question.stem,
    explanation.rule,
    explanation.worked,
    explanation.application,
    explanation.verification,
    ...explanation.distractorChecks,
  ].join("|"));

  return Object.freeze({
    ...question,
    version: "SPA-FMT-001-REVIEW-QUESTION-V2.3" as const,
    explanation,
    contentFingerprint,
    validation: Object.freeze({
      ...question.validation,
      sourceVariantWorkedEvidenceExplicit: true as const,
      exactDistractorDeltaExplainedForCompositionAndCount: true as const,
      cyclicSequenceSpelledOutForLearner: true as const,
    }),
  });
}
