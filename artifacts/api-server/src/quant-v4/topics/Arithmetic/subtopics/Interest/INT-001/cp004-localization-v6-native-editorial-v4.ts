import { generateIntCp004V6NativeEditorialV3Question } from "./cp004-localization-v6-native-editorial-v3";
import type { IntCp004V6Locale, IntCp004V6LocalizedQuestion } from "./cp004-localization-v6-types";

// Historical only. V4 used dollar-delimited MathJax and did not guarantee that every
// worked equation was enclosed in Examtree's \(...\) / \[...\] math wrappers.
// V5 is the current presentation-remediation candidate and must be used for review.
export const INT_CP004_HI_PA_V6_NATIVE_EDITORIAL_V4 = "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v4" as const;
export const INT_CP004_HI_PA_V6_NATIVE_EDITORIAL_V4_STATUS = "SUPERSEDED_BY_V5_MATH_WRAPPER_REMEDIATION" as const;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

const PREFERRED_PUNJABI_CI = "ਮਿਸ਼ਰਤ ਵਿਆਜ";

function preferredCompoundTerm(locale: IntCp004V6Locale, text: string): string {
  if (locale !== "pa-IN") return text;
  return text.replace(/ਚੱਕਰਵੱਧੀ ਵਿਆਜ/gu, PREFERRED_PUNJABI_CI);
}

function mathNumber(raw: string): string {
  return raw.replace(/,/gu, "{,}");
}

function convertMathExpression(raw: string): string {
  let value = raw.trim().replace(/[।.]$/u, "");
  value = value.replace(/₹/gu, "");
  value = value.replace(/(\d[\d,]*(?:\.\d+)?)%/gu, (_m, number: string) => `${mathNumber(number)}\\%`);
  value = value.replace(/(\d[\d,]*(?:\.\d+)?)/gu, (_m, number: string) => mathNumber(number));
  value = value.replace(/×/gu, "\\times ").replace(/÷/gu, "\\div ").replace(/−/gu, "-");
  value = value.replace(/\(([^()]+)\)\^([A-Za-z0-9]+)/gu, "($1)^{$2}");
  value = value.replace(/\^([A-Za-z0-9]+)/gu, "^{$1}");
  value = value.replace(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/gu, "\\frac{$1}{$2}");
  value = value.replace(/\s+/gu, " ").trim();
  return value;
}

function formulaStep(qlId: IntCp004V6LocalizedQuestion["qlId"], locale: IntCp004V6Locale): string {
  const hi = "सूत्र:";
  const pa = "ਸੂਤਰ:";
  const prefix = locale === "hi-IN" ? hi : pa;
  if (["INT-QL-067", "INT-QL-073"].includes(qlId)) return `${prefix} $A=P\\left(1+\\frac{r}{100}\\right)^n$।`;
  if (["INT-QL-068", "INT-QL-074"].includes(qlId)) return `${prefix} $A=P\\left(1+\\frac{r}{100}\\right)^n$ ${locale === "hi-IN" ? "और" : "ਅਤੇ"} $CI=A-P$।`;
  if (qlId === "INT-QL-069") return `${prefix} $P=\\dfrac{A}{\\left(1+\\frac{r}{100}\\right)^n}$।`;
  if (qlId === "INT-QL-070") return `${prefix} $CI=P\\left[\\left(1+\\frac{r}{100}\\right)^n-1\\right]$।`;
  if (qlId === "INT-QL-071") return `${prefix} $\\dfrac{A}{P}=\\left(1+\\frac{r}{100}\\right)^n$ ${locale === "hi-IN" ? "और" : "ਅਤੇ ਸਾਲਾਨਾ ਦਰ"} $R=mr$।`;
  if (qlId === "INT-QL-072") return `${prefix} $\\dfrac{A}{P}=\\left(1+\\frac{r}{100}\\right)^n$।`;
  if (qlId === "INT-QL-075") return locale === "hi-IN"
    ? `${prefix} प्रत्येक योजना के लिए $A=P\\left(1+\\dfrac{R}{100m}\\right)^{mt}$; फिर दोनों राशियों का अंतर लें।`
    : `${prefix} ਹਰ ਯੋਜਨਾ ਲਈ $A=P\\left(1+\\dfrac{R}{100m}\\right)^{mt}$; ਫਿਰ ਦੋਵੇਂ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।`;
  if (qlId === "INT-QL-076") return locale === "hi-IN"
    ? `${prefix} प्रभावी वार्षिक दर $E=\\left[\\left(1+\\dfrac{R}{100m}\\right)^m-1\\right]\\times100$।`
    : `${prefix} ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ $E=\\left[\\left(1+\\dfrac{R}{100m}\\right)^m-1\\right]\\times100$।`;
  if (qlId === "INT-QL-077") return `${prefix} $1+\\dfrac{E}{100}=\\left(1+\\dfrac{R}{100m}\\right)^m$।`;
  if (qlId === "INT-QL-078") return locale === "hi-IN"
    ? `${prefix} $A=P\\left(1+\\dfrac{R}{100m}\\right)^{mt}$; सही $m$ वही है जिससे दी गई राशि मिलती है।`
    : `${prefix} $A=P\\left(1+\\dfrac{R}{100m}\\right)^{mt}$; ਸਹੀ $m$ ਉਹੀ ਹੈ ਜਿਸ ਨਾਲ ਦਿੱਤੀ ਰਕਮ ਮਿਲਦੀ ਹੈ।`;
  if (["INT-QL-079", "INT-QL-080", "INT-QL-082", "INT-QL-083"].includes(qlId)) return `${prefix} $A=P\\left(1+\\frac{R}{100}\\right)^y\\left(1+\\frac{Rx}{100\\times12}\\right)$।`;
  if (qlId === "INT-QL-081") return `${prefix} $P=\\dfrac{A}{\\left(1+\\frac{R}{100}\\right)^y\\left(1+\\frac{Rx}{100\\times12}\\right)}$।`;
  return `${prefix} $A=P\\left(1+\\dfrac{R}{100m_1}\\right)^{m_1t_1}\\left(1+\\dfrac{R}{100m_2}\\right)^{m_2t_2}$।`;
}

function fullerStem(qlId: IntCp004V6LocalizedQuestion["qlId"], locale: IntCp004V6Locale, original: string): string {
  let stem = preferredCompoundTerm(locale, original);
  const directEnding = locale === "hi-IN" ? /\s*(?:ज्ञात कीजिए|निकालिए)[।?]?$/u : /\s*(?:ਪਤਾ ਕਰੋ|ਕੱਢੋ)[।?]?$/u;
  if (!directEnding.test(stem)) return stem;
  stem = stem.replace(directEnding, "").trim().replace(/[।.]$/u, "");
  if (qlId === "INT-QL-067" || qlId === "INT-QL-068") {
    return locale === "hi-IN" ? `${stem}। अवधि पूरी होने पर ${qlId === "INT-QL-067" ? "कुल राशि कितनी होगी" : "चक्रवृद्धि ब्याज कितना होगा"}?` : `${stem}। ਮਿਆਦ ਪੂਰੀ ਹੋਣ 'ਤੇ ${qlId === "INT-QL-067" ? "ਕੁੱਲ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ" : `${PREFERRED_PUNJABI_CI} ਕਿੰਨਾ ਹੋਵੇਗਾ`}?`;
  }
  const ask = locale === "hi-IN" ? "इन शर्तों के आधार पर सही मान क्या होगा?" : "ਇਨ੍ਹਾਂ ਸ਼ਰਤਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ਸਹੀ ਮੁੱਲ ਕੀ ਹੋਵੇਗਾ?";
  return `${stem}। ${ask}`;
}

function latexifyWorkedStep(locale: IntCp004V6Locale, original: string): string {
  let step = preferredCompoundTerm(locale, original);
  const rateLine = step.match(locale === "hi-IN" ? /^(हर अवधि की दर)\s*=\s*(.+)$/u : /^(ਹਰ ਮਿਆਦ ਦੀ ਦਰ)\s*=\s*(.+)$/u);
  if (rateLine) return `${rateLine[1]}: $${convertMathExpression(rateLine[2])}$।`;
  const mixedMath = step.match(/^(.+[=×÷^].*?);\s*(\$[^$]+\$)[।.]?$/u);
  if (mixedMath) return `$${convertMathExpression(mixedMath[1])}$; ${mixedMath[2]}।`;
  const colonIndex = step.indexOf(":");
  if (colonIndex >= 0) {
    const prefix = step.slice(0, colonIndex + 1);
    const rhs = step.slice(colonIndex + 1).trim();
    if (/[=×÷^]/u.test(rhs) && !rhs.includes("$")) return `${prefix} $${convertMathExpression(rhs)}$।`;
  }
  if (/^(?:A|P|E|A₁|A₂|\[|₹?\d[\d,.]*\s*÷)/u.test(step) && /[=×÷^]/u.test(step) && !step.includes("$")) return `$${convertMathExpression(step)}$।`;
  if (!step.includes("$")) {
    step = step.replace(/\b([nmyx]) = ([0-9.]+)/gu, (_m, variable: string, value: string) => `$${variable}=${value}$`);
    step = step.replace(/\b([nmyx])=([0-9.]+)/gu, (_m, variable: string, value: string) => `$${variable}=${value}$`);
  }
  return step;
}

export function generateIntCp004V6NativeEditorialV4Question(
  qlId: IntCp004V6LocalizedQuestion["qlId"],
  seed: string,
  locale: IntCp004V6Locale,
): IntCp004V6LocalizedQuestion {
  const question = generateIntCp004V6NativeEditorialV3Question(qlId, seed, locale);
  const options = Object.freeze(question.options.map((option) => Object.freeze({ ...option, text: preferredCompoundTerm(locale, option.text) })));
  const correctAnswer = options[question.correctIndex]?.text;
  if (!correctAnswer) throw new Error(`${qlId}/${seed}/${locale}: V4 correct answer missing.`);
  const steps = question.explanation.steps.map((step, index) => index === 0 ? formulaStep(qlId, locale) : latexifyWorkedStep(locale, step));
  const explanation = Object.freeze({ ...question.explanation, whatAsked: preferredCompoundTerm(locale, question.explanation.whatAsked), steps: Object.freeze(steps), finalAnswer: locale === "hi-IN" ? `उत्तर: ${correctAnswer}।` : `ਉੱਤਰ: ${correctAnswer}।`, commonMistake: preferredCompoundTerm(locale, question.explanation.commonMistake) });
  return deepFreeze({ ...question, stem: fullerStem(qlId, locale, question.stem), options, correctAnswer, explanation });
}
