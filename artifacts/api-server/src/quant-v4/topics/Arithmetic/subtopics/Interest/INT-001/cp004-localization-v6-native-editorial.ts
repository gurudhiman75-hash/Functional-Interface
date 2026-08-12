import { moneyText, percentText } from "./cp004-frequency-options";
import type { Cp004Frequency } from "./cp004-frequency-math";
import {
  generateIntCp004V6LocalizedQuestion,
} from "./cp004-localization-v6-runtime";
import type {
  IntCp004V6Locale,
  IntCp004V6LocalizedQuestion,
} from "./cp004-localization-v6-types";

export const INT_CP004_HI_PA_V6_NATIVE_EDITORIAL_VERSION = "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v2" as const;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return Object.freeze(value);
}

function isHindi(locale: IntCp004V6Locale): boolean {
  return locale === "hi-IN";
}

function hasTable(text: string): boolean {
  return /^\|.+\|$/mu.test(text) && /^\|\s*[-:]+/mu.test(text);
}

function naturalMonths(locale: IntCp004V6Locale, raw: string): string {
  const months = Number(raw);
  if (!Number.isInteger(months) || months < 12) {
    return isHindi(locale) ? `${raw} महीने` : `${raw} ਮਹੀਨੇ`;
  }
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  const yearsPart = isHindi(locale) ? `${years} वर्ष` : `${years} ਸਾਲ`;
  if (remaining === 0) return yearsPart;
  const monthsPart = isHindi(locale) ? `${remaining} महीने` : `${remaining} ਮਹੀਨੇ`;
  return isHindi(locale) ? `${yearsPart} और ${monthsPart}` : `${yearsPart} ਅਤੇ ${monthsPart}`;
}

function polishDurationText(locale: IntCp004V6Locale, text: string): string {
  if (isHindi(locale)) {
    return text.replace(/\b(\d+) महीने\b/gu, (_match, count: string) => naturalMonths(locale, count));
  }
  return text.replace(/\b(\d+) ਮਹੀਨੇ\b/gu, (_match, count: string) => naturalMonths(locale, count));
}

function polishHindi(text: string): string {
  return polishDurationText("hi-IN", text)
    .replace(/^एक प्रश्न में,\s*/u, "")
    .replace(/^मान लीजिए,\s*/u, "")
    .replace(/पहले 1 वर्ष\b/gu, "पहले वर्ष")
    .replace(/अगले 1 वर्ष\b/gu, "अगले वर्ष")
    .replace(/पहले (\d+) वर्ष वार्षिक चक्रवृद्धि ब्याज लगता है/gu, (_m, n: string) => Number(n) === 1
      ? "पहले वर्ष ब्याज सालाना जोड़ा जाता है"
      : `पहले ${n} वर्षों तक ब्याज सालाना जोड़ा जाता है`)
    .replace(/पहले (\d+) वर्ष वार्षिक चक्रवृद्धि ब्याज और/gu, (_m, n: string) => Number(n) === 1
      ? "पहले वर्ष ब्याज सालाना जोड़ा जाता है और"
      : `पहले ${n} वर्षों तक ब्याज सालाना जोड़ा जाता है और`)
    .replace(/पहले (\d+) वर्ष ब्याज वार्षिक रूप से जोड़ा जाता है/gu, (_m, n: string) => Number(n) === 1
      ? "पहले वर्ष ब्याज सालाना जोड़ा जाता है"
      : `पहले ${n} वर्षों तक ब्याज सालाना जोड़ा जाता है`)
    .replace(/पहले (\d+) वर्ष ब्याज हर वर्ष जोड़ा जाता है/gu, (_m, n: string) => Number(n) === 1
      ? "पहले वर्ष ब्याज जोड़ा जाता है"
      : `पहले ${n} वर्षों तक ब्याज हर वर्ष जोड़ा जाता है`)
    .replace(/अगले (\d+) वर्ष हर/gu, (_m, n: string) => Number(n) === 1 ? "अगले वर्ष हर" : `अगले ${n} वर्षों तक हर`)
    .replace(/अंतिम (\d+) महीने में/gu, "अंतिम $1 महीनों के लिए")
    .replace(/अंतिम 1 महीनों/gu, "अंतिम 1 महीने")
    .replace(/कुल अवधि/gu, "कुल समय");
}

function polishPunjabi(text: string): string {
  return polishDurationText("pa-IN", text)
    .replace(/^ਇੱਕ ਪ੍ਰਸ਼ਨ ਵਿੱਚ,\s*/u, "")
    .replace(/^ਮੰਨ ਲਓ,\s*/u, "")
    .replace(/ਪਹਿਲੇ 1 ਸਾਲ\b/gu, "ਪਹਿਲੇ ਸਾਲ")
    .replace(/ਅਗਲੇ 1 ਸਾਲ\b/gu, "ਅਗਲੇ ਸਾਲ")
    .replace(/ਪਹਿਲੇ (\d+) ਸਾਲ ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਲੱਗਦਾ ਹੈ/gu, (_m, n: string) => Number(n) === 1
      ? "ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਸਾਲਾਨਾ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ"
      : `ਪਹਿਲੇ ${n} ਸਾਲਾਂ ਤੱਕ ਵਿਆਜ ਸਾਲਾਨਾ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ`)
    .replace(/ਪਹਿਲੇ (\d+) ਸਾਲ ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਅਤੇ/gu, (_m, n: string) => Number(n) === 1
      ? "ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਸਾਲਾਨਾ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ"
      : `ਪਹਿਲੇ ${n} ਸਾਲਾਂ ਤੱਕ ਵਿਆਜ ਸਾਲਾਨਾ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ`)
    .replace(/ਪਹਿਲੇ (\d+) ਸਾਲ ਵਿਆਜ ਸਾਲਾਨਾ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ/gu, (_m, n: string) => Number(n) === 1
      ? "ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਸਾਲਾਨਾ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ"
      : `ਪਹਿਲੇ ${n} ਸਾਲਾਂ ਤੱਕ ਵਿਆਜ ਸਾਲਾਨਾ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ`)
    .replace(/ਪਹਿਲੇ (\d+) ਸਾਲ ਵਿਆਜ ਹਰ ਸਾਲ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ/gu, (_m, n: string) => Number(n) === 1
      ? "ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ"
      : `ਪਹਿਲੇ ${n} ਸਾਲਾਂ ਤੱਕ ਵਿਆਜ ਹਰ ਸਾਲ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ`)
    .replace(/ਅਗਲੇ (\d+) ਸਾਲ ਹਰ/gu, (_m, n: string) => Number(n) === 1 ? "ਅਗਲੇ ਸਾਲ ਹਰ" : `ਅਗਲੇ ${n} ਸਾਲਾਂ ਤੱਕ ਹਰ`)
    .replace(/ਕੁੱਲ ਮਿਆਦ/gu, "ਕੁੱਲ ਸਮਾਂ");
}

function polish(locale: IntCp004V6Locale, text: string): string {
  return isHindi(locale) ? polishHindi(text) : polishPunjabi(text);
}

function periodicPhrase(locale: IntCp004V6Locale, frequency: Cp004Frequency): string {
  if (isHindi(locale)) {
    if (frequency === 1) return "हर वर्ष";
    if (frequency === 2) return "हर छह महीने";
    if (frequency === 4) return "हर तीन महीने";
    return "हर महीने";
  }
  if (frequency === 1) return "ਹਰ ਸਾਲ";
  if (frequency === 2) return "ਹਰ ਛੇ ਮਹੀਨੇ";
  if (frequency === 4) return "ਹਰ ਤਿੰਨ ਮਹੀਨੇ";
  return "ਹਰ ਮਹੀਨੇ";
}

function naturalDuration(locale: IntCp004V6Locale, periods: number, frequency: Cp004Frequency): string {
  const totalMonths = periods * (12 / frequency);
  return naturalMonths(locale, String(totalMonths));
}

function directPeriodRateStem(question: IntCp004V6LocalizedQuestion): string | null {
  if (hasTable(question.stem)) return null;
  const s = question.mathematicalState;
  const locale = question.locale;
  const every = periodicPhrase(locale, s.frequency);
  const duration = naturalDuration(locale, s.periods, s.frequency);
  if (question.qlId === "INT-QL-073") {
    return isHindi(locale)
      ? `${moneyText(s.principal)} पर ${every} की ब्याज दर ${percentText(s.periodicRatePercent)} है। कुल समय ${duration} है। अंतिम राशि ज्ञात कीजिए।`
      : `${moneyText(s.principal)} ਉੱਤੇ ${every} ਦੀ ਵਿਆਜ ਦਰ ${percentText(s.periodicRatePercent)} ਹੈ। ਕੁੱਲ ਸਮਾਂ ${duration} ਹੈ। ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਕਰੋ।`;
  }
  if (question.qlId === "INT-QL-074") {
    return isHindi(locale)
      ? `${moneyText(s.principal)} पर ${every} ${percentText(s.periodicRatePercent)} ब्याज जुड़ता है। कुल समय ${duration} है। चक्रवृद्धि ब्याज ज्ञात कीजिए।`
      : `${moneyText(s.principal)} ਉੱਤੇ ${every} ${percentText(s.periodicRatePercent)} ਵਿਆਜ ਜੁੜਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ${duration} ਹੈ। ਮਿਸ਼ਰਤ ਵਿਆਜ ਪਤਾ ਕਰੋ।`;
  }
  return null;
}

function ql083Prompt(question: IntCp004V6LocalizedQuestion): string {
  const months = question.mathematicalState.tailMonths;
  return isHindi(question.locale)
    ? `अंतिम ${months} महीनों से पहले कितने वर्षों तक ब्याज सालाना जोड़ा गया था?`
    : `ਆਖਰੀ ${months} ਮਹੀਨਿਆਂ ਤੋਂ ਪਹਿਲਾਂ ਕਿੰਨੇ ਸਾਲਾਂ ਤੱਕ ਵਿਆਜ ਸਾਲਾਨਾ ਜੋੜਿਆ ਗਿਆ ਸੀ?`;
}

function polishStem(question: IntCp004V6LocalizedQuestion): string {
  const direct = directPeriodRateStem(question);
  let text = direct ?? polish(question.locale, question.stem);
  if (question.qlId === "INT-QL-083") {
    const oldPrompt = isHindi(question.locale) ? "समय ज्ञात कीजिए।" : "ਸਮਾਂ ਪਤਾ ਕਰੋ।";
    text = text.replace(oldPrompt, ql083Prompt(question));
  }
  return text;
}

function polishOptionText(question: IntCp004V6LocalizedQuestion, text: string): string {
  return polishDurationText(question.locale, text);
}

function polishExplanation(question: IntCp004V6LocalizedQuestion) {
  const locale = question.locale;
  const steps = question.explanation.steps.map((step, index) => {
    let text = polish(locale, step);
    if (question.qlId === "INT-QL-072" && index === 0) {
      text = isHindi(locale)
        ? "सूत्र: A/P = (1 + r/100)^n।"
        : "ਸੂਤਰ: A/P = (1 + r/100)^n।";
    }
    return text;
  });
  const whatAsked = question.qlId === "INT-QL-083"
    ? isHindi(locale)
      ? `हमें अंतिम ${question.mathematicalState.tailMonths} महीनों से पहले पूरे हुए वर्षों की संख्या ज्ञात करनी है।`
      : `ਆਓ ਆਖਰੀ ${question.mathematicalState.tailMonths} ਮਹੀਨਿਆਂ ਤੋਂ ਪਹਿਲਾਂ ਪੂਰੇ ਹੋਏ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੀਏ।`
    : polish(locale, question.explanation.whatAsked);
  return Object.freeze({
    ...question.explanation,
    whatAsked,
    steps: Object.freeze(steps),
    finalAnswer: polishOptionText(question, polish(locale, question.explanation.finalAnswer)),
    commonMistake: polish(locale, question.explanation.commonMistake),
  });
}

export function editorializeIntCp004V6LocalizedQuestion(
  question: IntCp004V6LocalizedQuestion,
): IntCp004V6LocalizedQuestion {
  const options = Object.freeze(question.options.map((option) => Object.freeze({
    ...option,
    text: polishOptionText(question, option.text),
  })));
  const correctAnswer = options[question.correctIndex]?.text;
  if (!correctAnswer) throw new Error(`${question.qlId}/${question.seed}/${question.locale}: editorial correct answer missing.`);
  const explanation = polishExplanation(question);
  return deepFreeze({
    ...question,
    stem: polishStem(question),
    options,
    correctAnswer,
    explanation: Object.freeze({
      ...explanation,
      finalAnswer: isHindi(question.locale) ? `उत्तर: ${correctAnswer}।` : `ਉੱਤਰ: ${correctAnswer}।`,
    }),
  });
}

export function generateIntCp004V6NativeEditorialQuestion(
  qlId: IntCp004V6LocalizedQuestion["qlId"],
  seed: string,
  locale: IntCp004V6Locale,
): IntCp004V6LocalizedQuestion {
  return editorializeIntCp004V6LocalizedQuestion(generateIntCp004V6LocalizedQuestion(qlId, seed, locale));
}
