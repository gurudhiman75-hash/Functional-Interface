import { amount, div, factor, mul, pow, rat, sub, type IntCp003QlId, type Rational } from "./cp003-exam-model";
import { decimal, fractionLatex, indianInteger, resolve, tableMarkdown } from "./cp003-exam-support";
import { generateIntCp003FinalLocalizedQuestionV2 } from "./cp003-localized-final-runtime-v2";
import type { IntCp003LocalizedLocale, IntCp003LocalizedQuestion } from "./cp003-localization-types";

export const INT_CP003_HI_PA_FINAL_RUNTIME_V3 = "INT-CP-003-HI-PA-FINAL-RUNTIME-v3" as const;

function localized(locale: IntCp003LocalizedLocale, hindi: string, punjabi: string): string {
  return locale === "hi-IN" ? hindi : punjabi;
}

function math(body: string): string {
  return `\\(${body}\\)`;
}

function rateLatex(value: Rational): string {
  const known = new Map<string, string>([
    ["25/3", "8\\frac{1}{3}"],
    ["50/3", "16\\frac{2}{3}"],
    ["100/3", "33\\frac{1}{3}"],
    ["100/7", "14\\frac{2}{7}"],
  ]);
  const exact = known.get(`${value.numerator}/${value.denominator}`);
  if (exact) return `${exact}\\%`;
  if (value.denominator === 1n) return `${value.numerator}\\%`;
  const scaled = value.numerator * 100n;
  if (scaled % value.denominator === 0n) return `${decimal(value, 2)}\\%`;
  return `\\frac{${value.numerator}}{${value.denominator}}\\%`;
}

function moneyText(value: Rational): string {
  const scaledNumerator = value.numerator * 100n;
  if (scaledNumerator % value.denominator !== 0n) throw new Error(`CP003 V3 money is not exact to paise: ${value.numerator}/${value.denominator}`);
  const scaled = scaledNumerator / value.denominator;
  const negative = scaled < 0n;
  const absolute = negative ? -scaled : scaled;
  const whole = absolute / 100n;
  const paise = absolute % 100n;
  const sign = negative ? "-" : "";
  return paise === 0n ? `₹${sign}${indianInteger(whole)}` : `₹${sign}${indianInteger(whole)}.${paise.toString().padStart(2, "0")}`;
}

function moneyNumberLatex(value: Rational): string {
  return moneyText(value).replace(/^₹/u, "").replace(/,/gu, "{,}");
}

function leadForQl(qlId: IntCp003QlId, locale: IntCp003LocalizedLocale): string {
  const hi: Record<IntCp003QlId, string> = {
    "INT-QL-053": "निवेश के मूलधन, वार्षिक दर और अवधि का विवरण नीचे दिया गया है।",
    "INT-QL-054": "मूलधन, वार्षिक दर और अवधि का विवरण नीचे दिया गया है।",
    "INT-QL-055": "अंतिम राशि, वार्षिक दर और अवधि का विवरण नीचे दिया गया है।",
    "INT-QL-056": "दिए गए चक्रवृद्धि ब्याज, वार्षिक दर और अवधि का विवरण नीचे दिया गया है।",
    "INT-QL-057": "मूल राशि, अंतिम राशि और अवधि का विवरण नीचे दिया गया है।",
    "INT-QL-058": "मूल राशि, अंतिम राशि और वार्षिक दर का विवरण नीचे दिया गया है।",
    "INT-QL-059": "मूलधन, दर और मांगे गए वर्ष के ब्याज का विवरण नीचे दिया गया है।",
    "INT-QL-060": "दिए गए वर्ष के ब्याज, दर और वर्ष संख्या का विवरण नीचे दिया गया है।",
    "INT-QL-061": "मूलधन और दिए गए वर्ष के ब्याज का विवरण नीचे दिया गया है।",
    "INT-QL-062": "बाद वाली शेष राशि और वार्षिक दर का विवरण नीचे दिया गया है।",
    "INT-QL-063": "एक वर्ष की शुरुआती और अंतिम शेष राशि नीचे दी गई है।",
    "INT-QL-064": "लगातार दो वर्षांत राशियों का विवरण नीचे दिया गया है।",
    "INT-QL-065": "निवेश और दो अलग अवधियों का विवरण नीचे दिया गया है।",
    "INT-QL-066": "दो अलग वर्षों के ब्याज और वार्षिक दर का विवरण नीचे दिया गया है।",
  };
  const pa: Record<IntCp003QlId, string> = {
    "INT-QL-053": "ਨਿਵੇਸ਼ ਦੇ ਮੂਲਧਨ, ਸਾਲਾਨਾ ਦਰ ਅਤੇ ਮਿਆਦ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    "INT-QL-054": "ਮੂਲਧਨ, ਸਾਲਾਨਾ ਦਰ ਅਤੇ ਮਿਆਦ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    "INT-QL-055": "ਅੰਤਿਮ ਰਕਮ, ਸਾਲਾਨਾ ਦਰ ਅਤੇ ਮਿਆਦ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    "INT-QL-056": "ਦਿੱਤੇ ਮਿਸ਼ਰਤ ਵਿਆਜ, ਸਾਲਾਨਾ ਦਰ ਅਤੇ ਮਿਆਦ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    "INT-QL-057": "ਮੂਲ ਰਕਮ, ਅੰਤਿਮ ਰਕਮ ਅਤੇ ਮਿਆਦ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    "INT-QL-058": "ਮੂਲ ਰਕਮ, ਅੰਤਿਮ ਰਕਮ ਅਤੇ ਸਾਲਾਨਾ ਦਰ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    "INT-QL-059": "ਮੂਲਧਨ, ਦਰ ਅਤੇ ਮੰਗੇ ਗਏ ਸਾਲ ਦੇ ਵਿਆਜ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    "INT-QL-060": "ਦਿੱਤੇ ਸਾਲ ਦੇ ਵਿਆਜ, ਦਰ ਅਤੇ ਸਾਲ ਦੀ ਗਿਣਤੀ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    "INT-QL-061": "ਮੂਲਧਨ ਅਤੇ ਦਿੱਤੇ ਸਾਲ ਦੇ ਵਿਆਜ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    "INT-QL-062": "ਬਾਅਦ ਵਾਲੀ ਬਕਾਇਆ ਰਕਮ ਅਤੇ ਸਾਲਾਨਾ ਦਰ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    "INT-QL-063": "ਇੱਕ ਸਾਲ ਦੀ ਸ਼ੁਰੂਆਤੀ ਅਤੇ ਅੰਤਿਮ ਬਕਾਇਆ ਰਕਮ ਹੇਠਾਂ ਦਿੱਤੀ ਗਈ ਹੈ।",
    "INT-QL-064": "ਲਗਾਤਾਰ ਦੋ ਸਾਲ-ਅੰਤ ਰਕਮਾਂ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    "INT-QL-065": "ਨਿਵੇਸ਼ ਅਤੇ ਦੋ ਵੱਖ-ਵੱਖ ਮਿਆਦਾਂ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    "INT-QL-066": "ਦੋ ਵੱਖ-ਵੱਖ ਸਾਲਾਂ ਦੇ ਵਿਆਜ ਅਤੇ ਸਾਲਾਨਾ ਦਰ ਦਾ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
  };
  return locale === "hi-IN" ? hi[qlId] : pa[qlId];
}

function polishPresentation(question: IntCp003LocalizedQuestion) {
  const locale = question.locale;
  const base = question.presentation;
  if (base.representation === "STANDARD_PROSE") {
    let prompt = base.prompt;
    if (question.qlId === "INT-QL-053") {
      prompt = locale === "hi-IN"
        ? prompt.replace(/\d+ वर्ष बाद कुल राशि कितनी होगी\?/u, "अवधि पूरी होने पर कुल राशि कितनी होगी?")
        : prompt.replace(/\d+ ਸਾਲ ਬਾਅਦ ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ ਕੁੱਲ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ\?/u, "ਮਿਆਦ ਪੂਰੀ ਹੋਣ 'ਤੇ ਕੁੱਲ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?");
    }
    return Object.freeze({ ...base, prompt, markdown: prompt });
  }
  const leadText = leadForQl(question.qlId, locale);
  const markdown = base.table
    ? [leadText, "", tableMarkdown(base.table), "", base.prompt].join("\n")
    : base.prompt;
  return Object.freeze({ ...base, leadText, markdown });
}

function cleanFeedback(text: string): string {
  return text.replace(/चक्रवृद्धि-ब्याज/gu, "चक्रवृद्धि ब्याज").replace(/ਮਿਸ਼ਰਤ-ਵਿਆਜ/gu, "ਮਿਸ਼ਰਤ ਵਿਆਜ");
}

function polishExplanation(question: IntCp003LocalizedQuestion) {
  const locale = question.locale;
  const r = resolve(question.mathematicalState);
  const f = factor(r.ratePercent);
  const steps = [...question.explanation.steps];

  if (steps.length > 1 && /वृद्धि-गुणक:|ਵਾਧਾ-ਗੁਣਕ:/u.test(steps[1]!)) {
    steps[1] = localized(locale,
      `दिए गए ${math(rateLatex(r.ratePercent))} पर वार्षिक वृद्धि-गुणक ${math(`1+\\frac{r}{100}=${fractionLatex(f)}`)} है।`,
      `ਦਿੱਤੀ ${math(rateLatex(r.ratePercent))} ਦਰ ਉੱਤੇ ਸਾਲਾਨਾ ਵਾਧਾ-ਗੁਣਕ ${math(`1+\\frac{r}{100}=${fractionLatex(f)}`)} ਹੈ।`);
  }

  if (question.qlId === "INT-QL-057") {
    const ratio = div(r.amount, r.principal);
    steps[2] = localized(locale,
      `दिए गए वर्षों में सही वार्षिक गुणक ${math(fractionLatex(f))} है और ${math(`\\left(${fractionLatex(f)}\\right)^{${r.years}}=${fractionLatex(ratio)}`)}।`,
      `ਦਿੱਤੇ ਸਾਲਾਂ ਵਿੱਚ ਸਹੀ ਸਾਲਾਨਾ ਗੁਣਕ ${math(fractionLatex(f))} ਹੈ ਅਤੇ ${math(`\\left(${fractionLatex(f)}\\right)^{${r.years}}=${fractionLatex(ratio)}`)}।`);
  }

  if (question.qlId === "INT-QL-059") {
    const opening = amount(r.principal, r.ratePercent, r.targetYear - 1);
    const increment = sub(f, rat(1));
    steps[3] = localized(locale,
      `उस वर्ष का ब्याज ${math(`${moneyNumberLatex(opening)}\\times\\left(${fractionLatex(f)}-1\\right)=${moneyNumberLatex(r.nthYearInterest)}`)} है।`,
      `ਉਸ ਸਾਲ ਦਾ ਵਿਆਜ ${math(`${moneyNumberLatex(opening)}\\times\\left(${fractionLatex(f)}-1\\right)=${moneyNumberLatex(r.nthYearInterest)}`)} ਹੈ।`);
    void increment;
  }

  if (question.qlId === "INT-QL-060") {
    const divisor = mul(pow(f, r.targetYear - 1), sub(f, rat(1)));
    steps[2] = localized(locale,
      `दिए गए वर्ष का प्रति-रुपया ब्याज-गुणक ${math(`\\left(${fractionLatex(f)}\\right)^{${r.targetYear - 1}}\\left(${fractionLatex(f)}-1\\right)=${fractionLatex(divisor)}`)} है।`,
      `ਦਿੱਤੇ ਸਾਲ ਦਾ ਪ੍ਰਤੀ-ਰੁਪਇਆ ਵਿਆਜ-ਗੁਣਕ ${math(`\\left(${fractionLatex(f)}\\right)^{${r.targetYear - 1}}\\left(${fractionLatex(f)}-1\\right)=${fractionLatex(divisor)}`)} ਹੈ।`);
  }

  if (question.qlId === "INT-QL-061") {
    const opening = amount(r.principal, r.ratePercent, r.targetYear - 1);
    steps[2] = localized(locale,
      `फिर ${math(`${moneyNumberLatex(opening)}\\times\\left(${fractionLatex(f)}-1\\right)=${moneyNumberLatex(r.nthYearInterest)}`)}, जो दिए गए ब्याज से मेल खाता है।`,
      `ਫਿਰ ${math(`${moneyNumberLatex(opening)}\\times\\left(${fractionLatex(f)}-1\\right)=${moneyNumberLatex(r.nthYearInterest)}`)}, ਜੋ ਦਿੱਤੇ ਵਿਆਜ ਨਾਲ ਮਿਲਦਾ ਹੈ।`);
  }

  if (question.qlId === "INT-QL-066") {
    const gap = r.laterYear - r.earlierYear;
    steps[2] = gap === 1
      ? localized(locale,
          `दोनों वर्षों के बीच 1 वार्षिक वृद्धि-चरण है, इसलिए ${math(`I_b=${moneyNumberLatex(r.earlierInterest)}\\left(${fractionLatex(f)}\\right)=${moneyNumberLatex(r.laterInterest)}`)}।`,
          `ਦੋਵੇਂ ਸਾਲਾਂ ਵਿਚਕਾਰ 1 ਸਾਲਾਨਾ ਵਾਧੇ ਦਾ ਕਦਮ ਹੈ, ਇਸ ਲਈ ${math(`I_b=${moneyNumberLatex(r.earlierInterest)}\\left(${fractionLatex(f)}\\right)=${moneyNumberLatex(r.laterInterest)}`)}।`)
      : localized(locale,
          `दोनों वर्षों के बीच ${gap} वार्षिक वृद्धि-चरण हैं, इसलिए ${math(`I_b=${moneyNumberLatex(r.earlierInterest)}\\left(${fractionLatex(f)}\\right)^{${gap}}=${moneyNumberLatex(r.laterInterest)}`)}।`,
          `ਦੋਵੇਂ ਸਾਲਾਂ ਵਿਚਕਾਰ ${gap} ਸਾਲਾਨਾ ਵਾਧੇ ਦੇ ਕਦਮ ਹਨ, ਇਸ ਲਈ ${math(`I_b=${moneyNumberLatex(r.earlierInterest)}\\left(${fractionLatex(f)}\\right)^{${gap}}=${moneyNumberLatex(r.laterInterest)}`)}।`);
  }

  let keyIdea = question.explanation.keyIdea;
  if (question.qlId === "INT-QL-065") {
    keyIdea = localized(locale,
      "दो अवधियों की राशियों का अंतर निकालने के लिए दोनों अवधियों की कुल राशियां बनाकर घटाएं।",
      "ਦੋ ਮਿਆਦਾਂ ਦੀਆਂ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਕੱਢਣ ਲਈ ਦੋਵੇਂ ਮਿਆਦਾਂ ਦੀਆਂ ਕੁੱਲ ਰਕਮਾਂ ਬਣਾਕੇ ਘਟਾਓ।");
  }

  const polishedSteps = Object.freeze(steps);
  return Object.freeze({
    ...question.explanation,
    keyIdea,
    steps: polishedSteps,
    ...(question.explanation.commonMistake ? { commonMistake: cleanFeedback(question.explanation.commonMistake) } : {}),
    depths: Object.freeze({
      exam: Object.freeze({ ...question.explanation.depths.exam, steps: Object.freeze([polishedSteps[0]!, ...polishedSteps.slice(Math.max(1, polishedSteps.length - 2))]) }),
      student: Object.freeze({ ...question.explanation.depths.student, steps: polishedSteps }),
      foundation: Object.freeze({ ...question.explanation.depths.foundation, steps: polishedSteps }),
    }),
  });
}

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

export function generateIntCp003FinalLocalizedQuestionV3(
  qlId: IntCp003QlId,
  seed: string,
  locale: IntCp003LocalizedLocale,
): IntCp003LocalizedQuestion {
  const base = generateIntCp003FinalLocalizedQuestionV2(qlId, seed, locale);
  const presentation = polishPresentation(base);
  const explanation = polishExplanation(base);
  const options = Object.freeze(base.options.map((option) => Object.freeze({
    ...option,
    calculation: cleanFeedback(option.calculation),
    studentFeedback: cleanFeedback(option.studentFeedback),
  })));
  return deepFreeze({ ...base, presentation, explanation, options, correctAnswer: options[base.correctIndex]!.text });
}
