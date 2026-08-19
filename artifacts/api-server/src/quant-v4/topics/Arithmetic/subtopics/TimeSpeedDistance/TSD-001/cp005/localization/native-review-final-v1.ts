import { TSD_CP005_NATIVE_REVIEW_CANDIDATE_V1, type TsdCp005NativeReviewRowV1 } from "./native-review-candidate-v1";
import { localizeCp005Choice, type TsdCp005NativeLanguage } from "./native-primitives-v1";

export const TSD_CP005_NATIVE_FINAL_REVIEW_STATUS = "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW_V1_FINAL" as const;

const DEVANAGARI = /[\u0900-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;
const PLACEHOLDER = /\{[^}]+\}/u;
const LATIN_WORD = /[A-Za-z]{2,}/gu;
const ALLOWED_LATIN = new Set(["km", "PQ", "PM", "tA", "tB"]);
const MATH_ONLY = /^[\d\s.,:;()+\-−–×/=A-Za-z]+$/u;

function polishNotation(text: string): string {
  return text
    .replaceAll("3P–Q", "3(P–Q)")
    .replaceAll("2P–Q", "2(P–Q)")
    .replaceAll("3P-Q", "3(P–Q)")
    .replaceAll("2P-Q", "2(P–Q)");
}

function polishStem(text: string, language: TsdCp005NativeLanguage): string {
  let out = polishNotation(text);
  if (language === "pa") {
    out = out
      .replaceAll(" में ", " ਵਿੱਚ ")
      .replaceAll(" में।", " ਵਿੱਚ।")
      .replaceAll(" में,", " ਵਿੱਚ,")
      .replaceAll(" में?", " ਵਿੱਚ?");
  }
  return out.replace(/\s{2,}/g, " ").trim();
}

function nativeInline(text: string, language: TsdCp005NativeLanguage): string {
  return polishNotation(localizeCp005Choice(text, language));
}

function renderNativeStep(english: string, language: TsdCp005NativeLanguage): string {
  const hi = language === "hi";
  let match: RegExpMatchArray | null;

  match = english.match(/^Use minutes: tA = (.+), tB = (.+); so tB:tA = (.+)\.$/u);
  if (match) return hi
    ? `मिनटों में: tA = ${match[1]}, tB = ${match[2]}; इसलिए tB:tA = ${match[3]}।`
    : `ਮਿੰਟਾਂ ਵਿੱਚ: tA = ${match[1]}, tB = ${match[2]}; ਇਸ ਲਈ tB:tA = ${match[3]}।`;

  match = english.match(/^Taking the square root gives A:B = (.+)\.$/u);
  if (match) return hi ? `वर्गमूल लेने पर A:B = ${match[1]} मिलता है।` : `ਵਰਗਮੂਲ ਲੈਣ ਤੇ A:B = ${match[1]} ਮਿਲਦਾ ਹੈ।`;

  match = english.match(/^(From the post-meeting times,|Post-meeting times give) A:B = (.+)\.$/u);
  if (match) return hi ? `मुलाकात के बाद के समयों से A:B = ${match[2]} मिलता है।` : `ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਦੇ ਸਮਿਆਂ ਤੋਂ A:B = ${match[2]} ਮਿਲਦਾ ਹੈ।`;

  match = english.match(/^([AB]) has (.+) left, so time = (.+)\.$/u);
  if (match) return hi
    ? `${match[1]} के लिए ${nativeInline(match[2]!, language)} दूरी शेष है, इसलिए समय = ${nativeInline(match[3]!, language)}।`
    : `${match[1]} ਲਈ ${nativeInline(match[2]!, language)} ਦੂਰੀ ਬਾਕੀ ਹੈ, ਇਸ ਲਈ ਸਮਾਂ = ${nativeInline(match[3]!, language)}।`;

  match = english.match(/^B's speed = (.+); meeting point from P = (.+)\.$/u);
  if (match) return hi
    ? `B की गति = ${nativeInline(match[1]!, language)}; P से मिलने का बिंदु = ${nativeInline(match[2]!, language)}।`
    : `B ਦੀ ਰਫ਼ਤਾਰ = ${nativeInline(match[1]!, language)}; P ਤੋਂ ਮਿਲਣ ਦਾ ਬਿੰਦੂ = ${nativeInline(match[2]!, language)}।`;

  match = english.match(/^Using PQ = (.+), we get A = (.+) and B = (.+)\.$/u);
  if (match) return hi
    ? `PQ = ${nativeInline(match[1]!, language)} रखने पर A = ${nativeInline(match[2]!, language)} और B = ${nativeInline(match[3]!, language)} मिलता है।`
    : `PQ = ${nativeInline(match[1]!, language)} ਰੱਖਣ ਤੇ A = ${nativeInline(match[2]!, language)} ਅਤੇ B = ${nativeInline(match[3]!, language)} ਮਿਲਦਾ ਹੈ।`;

  match = english.match(/^tB:tA gives A:B = (.+), so B's speed = (.+)\.$/u);
  if (match) return hi
    ? `tB:tA से A:B = ${match[1]} मिलता है, इसलिए B की गति = ${nativeInline(match[2]!, language)}।`
    : `tB:tA ਤੋਂ A:B = ${match[1]} ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ B ਦੀ ਰਫ਼ਤਾਰ = ${nativeInline(match[2]!, language)}।`;

  match = english.match(/^So PM = (.+)\.$/u);
  if (match) return hi ? `इसलिए PM = ${nativeInline(match[1]!, language)}।` : `ਇਸ ਲਈ PM = ${nativeInline(match[1]!, language)}।`;

  match = english.match(/^Combined speed = (.+); combined path = (.+)\.$/u);
  if (match) return hi
    ? `संयुक्त गति = ${nativeInline(match[1]!, language)}; कुल चली दूरी = ${nativeInline(match[2]!, language)}।`
    : `ਕੁੱਲ ਰਫ਼ਤਾਰ = ${nativeInline(match[1]!, language)}; ਕੁੱਲ ਤੈਅ ਦੂਰੀ = ${nativeInline(match[2]!, language)}।`;

  match = english.match(/^Combined speed = (.+); time gap = (.+)\.$/u);
  if (match) return hi
    ? `संयुक्त गति = ${nativeInline(match[1]!, language)}; समय-अंतर = ${nativeInline(match[2]!, language)}।`
    : `ਕੁੱਲ ਰਫ਼ਤਾਰ = ${nativeInline(match[1]!, language)}; ਸਮਾਂ-ਅੰਤਰ = ${nativeInline(match[2]!, language)}।`;

  match = english.match(/^Combined speed = (.+)\.$/u);
  if (match) return hi ? `संयुक्त गति = ${nativeInline(match[1]!, language)}।` : `ਕੁੱਲ ਰਫ਼ਤਾਰ = ${nativeInline(match[1]!, language)}।`;

  match = english.match(/^(\d+)(?:st|nd|rd|th) meeting time = (.+)\.$/u);
  if (match) return hi
    ? `${match[1]}वीं मुलाकात का समय = ${nativeInline(match[2]!, language)}।`
    : `${match[1]}ਵੀਂ ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ = ${nativeInline(match[2]!, language)}।`;

  match = english.match(/^(\d+)(?:st|nd|rd|th) meeting is at (.+), (within .+|beyond the limit)\.$/u);
  if (match) {
    const tail = match[3]!.startsWith("within ")
      ? (hi ? `${nativeInline(match[3]!.slice(7), language)} की समय सीमा के भीतर` : `${nativeInline(match[3]!.slice(7), language)} ਦੀ ਸਮਾਂ ਸੀਮਾ ਅੰਦਰ`)
      : (hi ? "समय सीमा से बाहर" : "ਸਮਾਂ ਸੀਮਾ ਤੋਂ ਬਾਹਰ");
    return hi
      ? `${match[1]}वीं मुलाकात ${nativeInline(match[2]!, language)} पर है, जो ${tail} है।`
      : `${match[1]}ਵੀਂ ਮੁਲਾਕਾਤ ${nativeInline(match[2]!, language)} ਉੱਤੇ ਹੈ, ਜੋ ${tail} ਹੈ।`;
  }

  match = english.match(/^For the (\d+)(?:st|nd|rd|th) meeting, combined distance = (.+)\.$/u);
  if (match) return hi
    ? `${match[1]}वीं मुलाकात के लिए संयुक्त दूरी = ${nativeInline(match[2]!, language)}।`
    : `${match[1]}ਵੀਂ ਮੁਲਾਕਾਤ ਲਈ ਕੁੱਲ ਦੂਰੀ = ${nativeInline(match[2]!, language)}।`;

  match = english.match(/^A travels (.+); after reflection the point is (.+) from P\.$/u);
  if (match) return hi
    ? `A कुल ${nativeInline(match[1]!, language)} चलता है; वापसी को ध्यान में रखने पर बिंदु P से ${nativeInline(match[2]!, language)} पर है।`
    : `A ਕੁੱਲ ${nativeInline(match[1]!, language)} ਚਲਦਾ ਹੈ; ਵਾਪਸੀ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖਣ ਤੇ ਬਿੰਦੂ P ਤੋਂ ${nativeInline(match[2]!, language)} ਉੱਤੇ ਹੈ।`;

  match = english.match(/^Meeting point from P = (.+)\.$/u);
  if (match) return hi ? `P से मिलने का बिंदु = ${nativeInline(match[1]!, language)}।` : `P ਤੋਂ ਮਿਲਣ ਦਾ ਬਿੰਦੂ = ${nativeInline(match[1]!, language)}।`;

  match = english.match(/^Gap = (.+)\.$/u);
  if (match) return hi ? `मुलाकातों का अंतर = ${nativeInline(match[1]!, language)}।` : `ਮੁਲਾਕਾਤਾਂ ਦਾ ਅੰਤਰ = ${nativeInline(match[1]!, language)}।`;

  match = english.match(/^Return-meeting time = (.+)\.$/u);
  if (match) return hi ? `वापसी-मुलाकात का समय = ${nativeInline(match[1]!, language)}।` : `ਵਾਪਸੀ-ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ = ${nativeInline(match[1]!, language)}।`;

  match = english.match(/^A's distance = (.+)\.$/u);
  if (match) return hi ? `A की चली दूरी = ${nativeInline(match[1]!, language)}।` : `A ਦੀ ਤੈਅ ਦੂਰੀ = ${nativeInline(match[1]!, language)}।`;

  match = english.match(/^Meeting time = (.+)\.$/u);
  if (match) return hi ? `मुलाकात का समय = ${nativeInline(match[1]!, language)}।` : `ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ = ${nativeInline(match[1]!, language)}।`;

  match = english.match(/^Missed distance = (.+)\.$/u);
  if (match) return hi ? `ठहराव के कारण कम चली दूरी = ${nativeInline(match[1]!, language)}।` : `ਠਹਿਰਾਅ ਕਾਰਨ ਘੱਟ ਤੈਅ ਦੂਰੀ = ${nativeInline(match[1]!, language)}।`;

  match = english.match(/^Rest time = (.+)\.$/u);
  if (match) return hi ? `ठहराव का समय = ${nativeInline(match[1]!, language)}।` : `ਠਹਿਰਾਅ ਦਾ ਸਮਾਂ = ${nativeInline(match[1]!, language)}।`;

  match = english.match(/^Time = (.+)\.$/u);
  if (match) return hi ? `समय = ${nativeInline(match[1]!, language)}।` : `ਸਮਾਂ = ${nativeInline(match[1]!, language)}।`;

  match = english.match(/^PQ = (.+)\.$/u);
  if (match) return `PQ = ${nativeInline(match[1]!, language)}।`;

  throw new Error(`CP005 final native step renderer missing: ${english}`);
}

function strictNativeText(text: string, language: TsdCp005NativeLanguage, label: string): void {
  if (!text.trim()) throw new Error(`${label}: empty native text`);
  if (PLACEHOLDER.test(text)) throw new Error(`${label}: unresolved placeholder remains`);
  const unexpected = (text.match(LATIN_WORD) ?? []).filter((token) => !ALLOWED_LATIN.has(token));
  if (unexpected.length) throw new Error(`${label}: unexpected English/Latin words: ${[...new Set(unexpected)].join(", ")}`);
  const hasNative = language === "hi" ? DEVANAGARI.test(text) : GURMUKHI.test(text);
  if (!hasNative && !MATH_ONLY.test(text)) throw new Error(`${label}: native script missing from prose`);
  if (language === "hi" && GURMUKHI.test(text)) throw new Error(`${label}: Hindi contains Gurmukhi`);
  if (language === "pa" && DEVANAGARI.test(text)) throw new Error(`${label}: Punjabi contains Devanagari`);
}

function finalize(row: TsdCp005NativeReviewRowV1): TsdCp005NativeReviewRowV1 {
  const language = row.presentation.language;
  const stem = polishStem(row.presentation.stem, language);
  const options = Object.freeze(row.presentation.options.map((option) => polishNotation(option)));
  const answerText = polishNotation(row.presentation.answerText);
  const explanation = Object.freeze({
    method: polishNotation(row.presentation.explanation.method),
    steps: Object.freeze(row.source.explanation.steps.map((step) => renderNativeStep(step, language))),
    shortcut: polishNotation(row.presentation.explanation.shortcut),
    finalAnswer: polishNotation(row.presentation.explanation.finalAnswer),
  });

  strictNativeText(stem, language, `${row.source.permanentQlId}/${language}/stem`);
  options.forEach((option, index) => strictNativeText(option, language, `${row.source.permanentQlId}/${language}/option-${index + 1}`));
  strictNativeText(answerText, language, `${row.source.permanentQlId}/${language}/answer`);
  strictNativeText(explanation.method, language, `${row.source.permanentQlId}/${language}/method`);
  explanation.steps.forEach((step, index) => strictNativeText(step, language, `${row.source.permanentQlId}/${language}/step-${index + 1}`));
  strictNativeText(explanation.shortcut, language, `${row.source.permanentQlId}/${language}/shortcut`);
  strictNativeText(explanation.finalAnswer, language, `${row.source.permanentQlId}/${language}/final-answer`);

  return Object.freeze({
    ...row,
    presentation: Object.freeze({
      ...row.presentation,
      stem,
      options,
      answerText,
      explanation,
    }),
  });
}

export function generateCp005NativeFinalReviewV1(): readonly TsdCp005NativeReviewRowV1[] {
  return Object.freeze(TSD_CP005_NATIVE_REVIEW_CANDIDATE_V1.map(finalize));
}

export const TSD_CP005_NATIVE_FINAL_REVIEW_V1 = generateCp005NativeFinalReviewV1();
