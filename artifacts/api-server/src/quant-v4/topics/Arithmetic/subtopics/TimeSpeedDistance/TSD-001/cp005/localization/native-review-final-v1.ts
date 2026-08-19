import { TSD_CP005_NATIVE_REVIEW_CANDIDATE_V1, type TsdCp005NativeReviewRowV1 } from "./native-review-candidate-v1";
import { localizeCp005Choice, type TsdCp005NativeLanguage } from "./native-primitives-v1";

export const TSD_CP005_NATIVE_FINAL_REVIEW_STATUS = "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW_V1_FINAL" as const;

// Exclude U+0964/U+0965 danda punctuation: Punjabi legitimately uses the shared danda.
const DEVANAGARI = /[\u0900-\u0963\u0966-\u097F]/u;
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
  let m: RegExpMatchArray | null;

  m = english.match(/^Use minutes: tA = (.+), tB = (.+); so tB:tA = (.+)\.$/u);
  if (m) return hi
    ? `मिनटों में: tA = ${m[1]}, tB = ${m[2]}; इसलिए tB:tA = ${m[3]}।`
    : `ਮਿੰਟਾਂ ਵਿੱਚ: tA = ${m[1]}, tB = ${m[2]}; ਇਸ ਲਈ tB:tA = ${m[3]}।`;

  m = english.match(/^Taking the square root gives A:B = (.+)\.$/u);
  if (m) return hi ? `वर्गमूल लेने पर A:B = ${m[1]} मिलता है।` : `ਵਰਗਮੂਲ ਲੈਣ ਤੇ A:B = ${m[1]} ਮਿਲਦਾ ਹੈ।`;

  m = english.match(/^(?:From the post-meeting times,|Post-meeting times give) A:B = (.+)\.$/u);
  if (m) return hi ? `मुलाकात के बाद के समयों से A:B = ${m[1]} मिलता है।` : `ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਦੇ ਸਮਿਆਂ ਤੋਂ A:B = ${m[1]} ਮਿਲਦਾ ਹੈ।`;

  m = english.match(/^([AB]) has (.+) left, so time = (.+)\.$/u);
  if (m) return hi
    ? `${m[1]} के लिए ${nativeInline(m[2]!, language)} दूरी शेष है, इसलिए समय = ${nativeInline(m[3]!, language)}।`
    : `${m[1]} ਲਈ ${nativeInline(m[2]!, language)} ਦੂਰੀ ਬਾਕੀ ਹੈ, ਇਸ ਲਈ ਸਮਾਂ = ${nativeInline(m[3]!, language)}।`;

  m = english.match(/^B's speed = (.+); meeting point from P = (.+)\.$/u);
  if (m) return hi
    ? `B की गति = ${nativeInline(m[1]!, language)}; P से मिलने का बिंदु = ${nativeInline(m[2]!, language)}।`
    : `B ਦੀ ਰਫ਼ਤਾਰ = ${nativeInline(m[1]!, language)}; P ਤੋਂ ਮਿਲਣ ਦਾ ਬਿੰਦੂ = ${nativeInline(m[2]!, language)}।`;

  m = english.match(/^Using PQ = (.+), we get A = (.+) and B = (.+)\.$/u);
  if (m) return hi
    ? `PQ = ${nativeInline(m[1]!, language)} रखने पर A = ${nativeInline(m[2]!, language)} और B = ${nativeInline(m[3]!, language)} मिलता है।`
    : `PQ = ${nativeInline(m[1]!, language)} ਰੱਖਣ ਤੇ A = ${nativeInline(m[2]!, language)} ਅਤੇ B = ${nativeInline(m[3]!, language)} ਮਿਲਦਾ ਹੈ।`;

  m = english.match(/^tB:tA gives A:B = (.+), so B's speed = (.+)\.$/u);
  if (m) return hi
    ? `tB:tA से A:B = ${m[1]} मिलता है, इसलिए B की गति = ${nativeInline(m[2]!, language)}।`
    : `tB:tA ਤੋਂ A:B = ${m[1]} ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ B ਦੀ ਰਫ਼ਤਾਰ = ${nativeInline(m[2]!, language)}।`;

  m = english.match(/^So PM = (.+)\.$/u);
  if (m) return hi ? `इसलिए PM = ${nativeInline(m[1]!, language)}।` : `ਇਸ ਲਈ PM = ${nativeInline(m[1]!, language)}।`;

  m = english.match(/^Combined speed = (.+); combined path = (.+)\.$/u);
  if (m) return hi
    ? `संयुक्त गति = ${nativeInline(m[1]!, language)}; कुल चली दूरी = ${nativeInline(m[2]!, language)}।`
    : `ਕੁੱਲ ਰਫ਼ਤਾਰ = ${nativeInline(m[1]!, language)}; ਕੁੱਲ ਤੈਅ ਦੂਰੀ = ${nativeInline(m[2]!, language)}।`;

  m = english.match(/^Combined speed = (.+); time gap = (.+)\.$/u);
  if (m) return hi
    ? `संयुक्त गति = ${nativeInline(m[1]!, language)}; समय-अंतर = ${nativeInline(m[2]!, language)}।`
    : `ਕੁੱਲ ਰਫ਼ਤਾਰ = ${nativeInline(m[1]!, language)}; ਸਮਾਂ-ਅੰਤਰ = ${nativeInline(m[2]!, language)}।`;

  m = english.match(/^Combined speed = (.+)\.$/u);
  if (m) return hi ? `संयुक्त गति = ${nativeInline(m[1]!, language)}।` : `ਕੁੱਲ ਰਫ਼ਤਾਰ = ${nativeInline(m[1]!, language)}।`;

  m = english.match(/^(\d+)(?:st|nd|rd|th) meeting time = (.+)\.$/u);
  if (m) return hi
    ? `${m[1]}वीं मुलाकात का समय = ${nativeInline(m[2]!, language)}।`
    : `${m[1]}ਵੀਂ ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ = ${nativeInline(m[2]!, language)}।`;

  m = english.match(/^(\d+)(?:st|nd|rd|th) meeting is at (.+), (within .+|beyond the limit)\.$/u);
  if (m) {
    const tail = m[3]!.startsWith("within ")
      ? (hi ? `${nativeInline(m[3]!.slice(7), language)} की समय सीमा के भीतर` : `${nativeInline(m[3]!.slice(7), language)} ਦੀ ਸਮਾਂ ਸੀਮਾ ਅੰਦਰ`)
      : (hi ? "समय सीमा से बाहर" : "ਸਮਾਂ ਸੀਮਾ ਤੋਂ ਬਾਹਰ");
    return hi
      ? `${m[1]}वीं मुलाकात ${nativeInline(m[2]!, language)} पर है, जो ${tail} है।`
      : `${m[1]}ਵੀਂ ਮੁਲਾਕਾਤ ${nativeInline(m[2]!, language)} ਉੱਤੇ ਹੈ, ਜੋ ${tail} ਹੈ।`;
  }

  m = english.match(/^For the (\d+)(?:st|nd|rd|th) meeting, combined distance = (.+)\.$/u);
  if (m) return hi
    ? `${m[1]}वीं मुलाकात के लिए संयुक्त दूरी = ${nativeInline(m[2]!, language)}।`
    : `${m[1]}ਵੀਂ ਮੁਲਾਕਾਤ ਲਈ ਕੁੱਲ ਦੂਰੀ = ${nativeInline(m[2]!, language)}।`;

  m = english.match(/^A travels (.+); after reflection the point is (.+) from P\.$/u);
  if (m) return hi
    ? `A कुल ${nativeInline(m[1]!, language)} चलता है; वापसी को ध्यान में रखने पर बिंदु P से ${nativeInline(m[2]!, language)} पर है।`
    : `A ਕੁੱਲ ${nativeInline(m[1]!, language)} ਚਲਦਾ ਹੈ; ਵਾਪਸੀ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖਣ ਤੇ ਬਿੰਦੂ P ਤੋਂ ${nativeInline(m[2]!, language)} ਉੱਤੇ ਹੈ।`;

  m = english.match(/^Meeting point from P = (.+)\.$/u);
  if (m) return hi ? `P से मिलने का बिंदु = ${nativeInline(m[1]!, language)}।` : `P ਤੋਂ ਮਿਲਣ ਦਾ ਬਿੰਦੂ = ${nativeInline(m[1]!, language)}।`;

  m = english.match(/^Gap = (.+)\.$/u);
  if (m) return hi ? `मुलाकातों का अंतर = ${nativeInline(m[1]!, language)}।` : `ਮੁਲਾਕਾਤਾਂ ਦਾ ਅੰਤਰ = ${nativeInline(m[1]!, language)}।`;

  m = english.match(/^Return-meeting time = (.+)\.$/u);
  if (m) return hi ? `वापसी-मुलाकात का समय = ${nativeInline(m[1]!, language)}।` : `ਵਾਪਸੀ-ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ = ${nativeInline(m[1]!, language)}।`;

  m = english.match(/^A's distance = (.+)\.$/u);
  if (m) return hi ? `A की चली दूरी = ${nativeInline(m[1]!, language)}।` : `A ਦੀ ਤੈਅ ਦੂਰੀ = ${nativeInline(m[1]!, language)}।`;

  m = english.match(/^Meeting time = (.+)\.$/u);
  if (m) return hi ? `मुलाकात का समय = ${nativeInline(m[1]!, language)}।` : `ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ = ${nativeInline(m[1]!, language)}।`;

  m = english.match(/^Missed distance = (.+)\.$/u);
  if (m) return hi ? `ठहराव के कारण कम चली दूरी = ${nativeInline(m[1]!, language)}।` : `ਠਹਿਰਾਅ ਕਾਰਨ ਘੱਟ ਤੈਅ ਦੂਰੀ = ${nativeInline(m[1]!, language)}।`;

  m = english.match(/^Rest time = (.+)\.$/u);
  if (m) return hi ? `ठहराव का समय = ${nativeInline(m[1]!, language)}।` : `ਠਹਿਰਾਅ ਦਾ ਸਮਾਂ = ${nativeInline(m[1]!, language)}।`;

  m = english.match(/^Time = (.+)\.$/u);
  if (m) return hi ? `समय = ${nativeInline(m[1]!, language)}।` : `ਸਮਾਂ = ${nativeInline(m[1]!, language)}।`;

  m = english.match(/^PQ = (.+)\.$/u);
  if (m) return `PQ = ${nativeInline(m[1]!, language)}।`;

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
    presentation: Object.freeze({ ...row.presentation, stem, options, answerText, explanation }),
  });
}

export function generateCp005NativeFinalReviewV1(): readonly TsdCp005NativeReviewRowV1[] {
  return Object.freeze(TSD_CP005_NATIVE_REVIEW_CANDIDATE_V1.map(finalize));
}

export const TSD_CP005_NATIVE_FINAL_REVIEW_V1 = generateCp005NativeFinalReviewV1();
