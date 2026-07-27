import type { ApprovedOpsQuestion } from "./approved-teaching-entry";
import {
  localizeApprovedOpsQuestion as localizeBase,
  type ApprovedOpsLocale,
  type LocalizedApprovedOpsQuestion,
} from "./approved-localization";

export type { ApprovedOpsLocale, LocalizedApprovedOpsQuestion };

function placeholderLabel(label: string): string {
  if (label === "Read the value") return "Identify complete tokens";
  if (label.endsWith(": Read the value")) return label.replace(/Read the value$/u, "Identify complete tokens");
  return label;
}

function placeholderText(source: string): string {
  if (/^Only .+ makes the equation true\.$/u.test(source)) return "The transformed equation is true.";
  if (source === "Only this pair produces a valid true equation without a leading zero.") return "The transformed equation is true.";
  if (source === "Only complete number tokens are exchanged; digits inside other numbers are unchanged.") return "Digits inside other numbers remain unchanged.";
  if (/^C must be > because .+$/u.test(source)) return "Use this one mapping for every option.";
  if (/^Using A = \+ and B = = gives .+$/u.test(source)) return "Use this one mapping for every option.";
  return source;
}

function localizedValueLabel(label: string, locale: ApprovedOpsLocale): string {
  const base = locale === "hi-IN" ? "मान पढ़ें" : "ਮੁੱਲ ਪੜ੍ਹੋ";
  if (label === "Read the value") return base;
  if (label.startsWith("Left side:")) return locale === "hi-IN" ? `बायाँ पक्ष: ${base}` : `ਖੱਬਾ ਪਾਸਾ: ${base}`;
  if (label.startsWith("Right side:")) return locale === "hi-IN" ? `दायाँ पक्ष: ${base}` : `ਸੱਜਾ ਪਾਸਾ: ${base}`;
  return base;
}

function restoreText(original: string, translated: string, locale: ApprovedOpsLocale): string {
  const unique = original.match(/^Only (.+) makes the equation true\.$/u);
  if (unique) {
    if (unique[1] === "this pair") return locale === "hi-IN"
      ? "केवल यही युग्म समीकरण को सही बनाता है।"
      : "ਕੇਵਲ ਇਹੀ ਜੋੜਾ ਸਮੀਕਰਨ ਨੂੰ ਸਹੀ ਬਣਾਉਂਦਾ ਹੈ।";
    return locale === "hi-IN"
      ? `केवल ${unique[1]} समीकरण को सही बनाता है।`
      : `ਕੇਵਲ ${unique[1]} ਸਮੀਕਰਨ ਨੂੰ ਸਹੀ ਬਣਾਉਂਦਾ ਹੈ।`;
  }
  if (original === "Only this pair produces a valid true equation without a leading zero.") return locale === "hi-IN"
    ? "केवल यही अंक-युग्म बिना आरंभिक शून्य बनाए सही समीकरण देता है।"
    : "ਕੇਵਲ ਇਹੀ ਅੰਕ-ਜੋੜਾ ਸ਼ੁਰੂਆਤੀ ਸਿਫ਼ਰ ਬਣਾਏ ਬਿਨਾਂ ਸਹੀ ਸਮੀਕਰਨ ਦਿੰਦਾ ਹੈ।";
  if (original === "Only complete number tokens are exchanged; digits inside other numbers are unchanged.") return locale === "hi-IN"
    ? "केवल पूरी संख्याएँ आपस में बदली जाती हैं; दूसरी संख्याओं के भीतर के अंक नहीं बदलते।"
    : "ਕੇਵਲ ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲੀਆਂ ਜਾਂਦੀਆਂ ਹਨ; ਹੋਰ ਸੰਖਿਆਵਾਂ ਦੇ ਅੰਦਰਲੇ ਅੰਕ ਨਹੀਂ ਬਦਲਦੇ।";
  if (/^C must be > because .+$/u.test(original)) return locale === "hi-IN"
    ? "C का अर्थ > होना चाहिए, क्योंकि 7 > 4 सही है; = रखने पर कथन गलत होगा और + कोई तुलना-कथन नहीं बनाएगा।"
    : "C ਦਾ ਅਰਥ > ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, ਕਿਉਂਕਿ 7 > 4 ਸਹੀ ਹੈ; = ਰੱਖਣ ਉੱਤੇ ਕਥਨ ਗਲਤ ਹੋਵੇਗਾ ਅਤੇ + ਕੋਈ ਤੁਲਨਾ-ਕਥਨ ਨਹੀਂ ਬਣਾਏਗਾ।";
  const mixed = original.match(/^Using A = \+ and B = = gives (.+), which is true; reversing them gives (.+), which is false\.$/u);
  if (mixed) return locale === "hi-IN"
    ? `A = + और B = = रखने पर ${mixed[1]} मिलता है, जो सही है; अर्थ उलटने पर ${mixed[2]} मिलता है, जो गलत है।`
    : `A = + ਅਤੇ B = = ਰੱਖਣ ਉੱਤੇ ${mixed[1]} ਮਿਲਦਾ ਹੈ, ਜੋ ਸਹੀ ਹੈ; ਅਰਥ ਉਲਟਣ ਉੱਤੇ ${mixed[2]} ਮਿਲਦਾ ਹੈ, ਜੋ ਗਲਤ ਹੈ।`;
  return translated;
}

function localizeOptionValue(value: string, locale: ApprovedOpsLocale): string {
  const dictionary = locale === "hi-IN"
    ? {
      "Only one pair is required": "केवल एक चिह्न-युग्म आवश्यक है",
      "no number swap": "पूरी संख्याओं का बदलाव नहीं",
      "no operator swap": "चिह्नों का बदलाव नहीं",
      "no digit interchange": "अंकों का बदलाव नहीं",
      "no operator interchange": "चिह्नों का बदलाव नहीं",
    }
    : {
      "Only one pair is required": "ਕੇਵਲ ਇੱਕ ਚਿੰਨ੍ਹ-ਜੋੜਾ ਲੋੜੀਂਦਾ ਹੈ",
      "no number swap": "ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਦਾ ਬਦਲਾਅ ਨਹੀਂ",
      "no operator swap": "ਚਿੰਨ੍ਹਾਂ ਦਾ ਬਦਲਾਅ ਨਹੀਂ",
      "no digit interchange": "ਅੰਕਾਂ ਦਾ ਬਦਲਾਅ ਨਹੀਂ",
      "no operator interchange": "ਚਿੰਨ੍ਹਾਂ ਦਾ ਬਦਲਾਅ ਨਹੀਂ",
    };

  let localized = value;
  for (const [english, replacement] of Object.entries(dictionary)) {
    localized = localized.replaceAll(english, replacement);
  }
  return localized;
}

export function localizeApprovedOpsQuestion(
  question: ApprovedOpsQuestion,
  locale: ApprovedOpsLocale,
): LocalizedApprovedOpsQuestion {
  const originalSteps = question.explanation.steps.map((step) => ({ ...step }));
  const patched: ApprovedOpsQuestion = {
    ...question,
    explanation: {
      ...question.explanation,
      steps: question.explanation.steps.map((step) => ({
        label: placeholderLabel(step.label),
        expression: placeholderText(step.expression),
        result: placeholderText(step.result),
      })),
    },
  };
  const localized = localizeBase(patched, locale);
  return {
    ...localized,
    options: localized.options.map((option) => ({
      ...option,
      value: localizeOptionValue(option.value, locale),
    })),
    explanation: {
      ...localized.explanation,
      steps: localized.explanation.steps.map((step, index) => {
        const original = originalSteps[index];
        const label = original.label === "Read the value" || original.label.endsWith(": Read the value")
          ? localizedValueLabel(original.label, locale)
          : step.label;
        return {
          ...step,
          label,
          expression: restoreText(original.expression, step.expression, locale),
          result: restoreText(original.result, step.result, locale),
        };
      }),
    },
  };
}
