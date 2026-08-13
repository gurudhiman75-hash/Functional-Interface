import { generateIntCp004V6NativeEditorialV3Question } from "./cp004-localization-v6-native-editorial-v3";
import type { IntCp004V6Locale, IntCp004V6LocalizedQuestion } from "./cp004-localization-v6-types";

export const INT_CP004_HI_PA_V6_NATIVE_EDITORIAL_V4 = "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v4" as const;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function preferredCompoundTerm(locale: IntCp004V6Locale, text: string): string {
  return locale === "pa-IN" ? text.replace(/ਚੱਕਰਵੱਧੀ ਵਿਆਜ/gu, "ਮਿਸ਼ਰਤ ਵਿਆਜ") : text;
}

function fullerStem(
  qlId: IntCp004V6LocalizedQuestion["qlId"],
  locale: IntCp004V6Locale,
  original: string,
): string {
  let stem = preferredCompoundTerm(locale, original);

  if (qlId === "INT-QL-067") {
    if (locale === "hi-IN") {
      const match = stem.match(/^(₹\S+) को ([\d.]+)% वार्षिक दर पर रखा गया है और ब्याज (.+?) मूलधन में जुड़ता है। अवधि (.+?) है। अंतिम राशि ज्ञात कीजिए।$/u);
      if (match) return `एक व्यक्ति ने ${match[1]} को ${match[2]}% वार्षिक दर पर निवेश किया। ब्याज ${match[3]} मूलधन में जोड़ा जाता है और निवेश की अवधि ${match[4]} है। अवधि पूरी होने पर कुल राशि कितनी होगी?`;
    } else {
      const match = stem.match(/^(₹\S+) ਨੂੰ ([\d.]+)% ਸਾਲਾਨਾ ਦਰ ਉੱਤੇ ਰੱਖਿਆ ਗਿਆ ਹੈ ਅਤੇ ਵਿਆਜ (.+?) ਮੂਲਧਨ ਵਿੱਚ ਜੁੜਦਾ ਹੈ। ਮਿਆਦ (.+?) ਹੈ। ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਕਰੋ।$/u);
      if (match) return `ਇੱਕ ਵਿਅਕਤੀ ਨੇ ${match[1]} ਨੂੰ ${match[2]}% ਸਾਲਾਨਾ ਦਰ 'ਤੇ ਨਿਵੇਸ਼ ਕੀਤਾ। ਵਿਆਜ ${match[3]} ਮੂਲਧਨ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਨਿਵੇਸ਼ ਦੀ ਮਿਆਦ ${match[4]} ਹੈ। ਮਿਆਦ ਪੂਰੀ ਹੋਣ 'ਤੇ ਕੁੱਲ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?`;
    }
  }

  if (qlId === "INT-QL-068") {
    if (locale === "hi-IN") {
      const match = stem.match(/^(₹\S+) पर ([\d.]+)% वार्षिक दर से (.+?) तक ब्याज (.+?) जोड़ा जाता है। चक्रवृद्धि ब्याज ज्ञात कीजिए।$/u);
      if (match) return `एक व्यक्ति ने ${match[1]} की राशि को ${match[2]}% वार्षिक दर पर ${match[3]} के लिए निवेश किया। ब्याज ${match[4]} मूलधन में जोड़ा जाता है। अवधि पूरी होने तक अर्जित चक्रवृद्धि ब्याज कितना होगा?`;
    } else {
      const match = stem.match(/^(₹\S+) ਉੱਤੇ ([\d.]+)% ਸਾਲਾਨਾ ਦਰ ਨਾਲ (.+?) ਲਈ ਵਿਆਜ (.+?) ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਮਿਸ਼ਰਤ ਵਿਆਜ ਪਤਾ ਕਰੋ।$/u);
      if (match) return `ਇੱਕ ਵਿਅਕਤੀ ਨੇ ${match[1]} ਦੀ ਰਕਮ ${match[2]}% ਸਾਲਾਨਾ ਦਰ 'ਤੇ ${match[3]} ਲਈ ਨਿਵੇਸ਼ ਕੀਤੀ। ਵਿਆਜ ${match[4]} ਮੂਲਧਨ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਮਿਆਦ ਪੂਰੀ ਹੋਣ ਤੱਕ ਮਿਲਣ ਵਾਲਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
    }
  }

  if (locale === "hi-IN") {
    const replacements: readonly [RegExp, string][] = [
      [/मूलधन ज्ञात कीजिए।$/u, "दी गई जानकारी के आधार पर प्रारंभिक मूलधन कितना था?"],
      [/वार्षिक ब्याज दर ज्ञात कीजिए।$/u, "दी गई जानकारी के आधार पर वार्षिक ब्याज दर कितनी थी?"],
      [/समय ज्ञात कीजिए।$/u, "दी गई जानकारी के आधार पर निवेश की कुल अवधि कितनी थी?"],
      [/दोनों योजनाओं की अंतिम राशियों का अंतर ज्ञात कीजिए।$/u, "अवधि पूरी होने पर दोनों योजनाओं की राशियों में कितना अंतर होगा?"],
      [/प्रभावी वार्षिक ब्याज दर ज्ञात कीजिए।$/u, "इन शर्तों के अंतर्गत प्रभावी वार्षिक ब्याज दर कितनी बनेगी?"],
      [/ब्याज जोड़ने का सही अंतराल ज्ञात कीजिए।$/u, "दी गई अंतिम राशि से मेल खाने के लिए ब्याज जोड़ने का सही अंतराल कौन-सा है?"],
    ];
    for (const [pattern, replacement] of replacements) stem = stem.replace(pattern, replacement);
    if (["INT-QL-073", "INT-QL-079", "INT-QL-084"].includes(qlId)) {
      stem = stem.replace(/अंतिम राशि ज्ञात कीजिए।$/u, "दिए गए नियमों के अनुसार अवधि के अंत में कुल राशि कितनी होगी?");
    }
    if (["INT-QL-074", "INT-QL-080", "INT-QL-085"].includes(qlId)) {
      stem = stem.replace(/चक्रवृद्धि ब्याज ज्ञात कीजिए।$/u, "दिए गए नियमों के अनुसार कुल चक्रवृद्धि ब्याज कितना होगा?");
    }
  } else {
    const replacements: readonly [RegExp, string][] = [
      [/ਮੂਲਧਨ ਪਤਾ ਕਰੋ।$/u, "ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਅਧਾਰ 'ਤੇ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਕਿੰਨਾ ਸੀ?"],
      [/ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਕਰੋ।$/u, "ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਅਧਾਰ 'ਤੇ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਕਿੰਨੀ ਸੀ?"],
      [/ਸਮਾਂ ਪਤਾ ਕਰੋ।$/u, "ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਅਧਾਰ 'ਤੇ ਨਿਵੇਸ਼ ਦੀ ਕੁੱਲ ਮਿਆਦ ਕਿੰਨੀ ਸੀ?"],
      [/ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਦੀਆਂ ਅੰਤਿਮ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।$/u, "ਮਿਆਦ ਪੂਰੀ ਹੋਣ 'ਤੇ ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਦੀਆਂ ਰਕਮਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ?"],
      [/ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਕਰੋ।$/u, "ਇਨ੍ਹਾਂ ਸ਼ਰਤਾਂ ਹੇਠ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਕਿੰਨੀ ਬਣੇਗੀ?"],
      [/ਵਿਆਜ ਜੋੜਨ ਦਾ ਸਹੀ ਅੰਤਰਾਲ ਪਤਾ ਕਰੋ।$/u, "ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਨਾਲ ਮੇਲ ਖਾਣ ਲਈ ਵਿਆਜ ਜੋੜਨ ਦਾ ਸਹੀ ਅੰਤਰਾਲ ਕਿਹੜਾ ਹੈ?"],
    ];
    for (const [pattern, replacement] of replacements) stem = stem.replace(pattern, replacement);
    if (["INT-QL-073", "INT-QL-079", "INT-QL-084"].includes(qlId)) {
      stem = stem.replace(/ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਕਰੋ।$/u, "ਦਿੱਤੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ ਕੁੱਲ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?");
    }
    if (["INT-QL-074", "INT-QL-080", "INT-QL-085"].includes(qlId)) {
      stem = stem.replace(/ਮਿਸ਼ਰਤ ਵਿਆਜ ਪਤਾ ਕਰੋ।$/u, "ਦਿੱਤੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਕੁੱਲ ਮਿਸ਼ਰਤ ਵਿਆਜ ਕਿੰਨਾ ਹੋਵੇਗਾ?");
    }
  }
  return stem;
}

function formulaStep(qlId: IntCp004V6LocalizedQuestion["qlId"], locale: IntCp004V6Locale): string {
  const prefix = locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
  const and = locale === "hi-IN" ? "और" : "ਅਤੇ";
  switch (qlId) {
    case "INT-QL-067":
    case "INT-QL-073":
      return String.raw`${prefix} $A=P\left(1+\frac{r}{100}\right)^n$।`;
    case "INT-QL-068":
    case "INT-QL-074":
      return String.raw`${prefix} $A=P\left(1+\frac{r}{100}\right)^n$ ${and} $CI=A-P$।`;
    case "INT-QL-069":
      return String.raw`${prefix} $P=\dfrac{A}{\left(1+\frac{r}{100}\right)^n}$।`;
    case "INT-QL-070":
      return String.raw`${prefix} $CI=P\left[\left(1+\frac{r}{100}\right)^n-1\right]$।`;
    case "INT-QL-071":
      return locale === "hi-IN"
        ? String.raw`${prefix} $\dfrac{A}{P}=\left(1+\frac{r}{100}\right)^n$ और $R=mr$।`
        : String.raw`${prefix} $\dfrac{A}{P}=\left(1+\frac{r}{100}\right)^n$ ਅਤੇ ਸਾਲਾਨਾ ਦਰ $R=mr$।`;
    case "INT-QL-072":
      return String.raw`${prefix} $\dfrac{A}{P}=\left(1+\frac{r}{100}\right)^n$।`;
    case "INT-QL-075":
      return locale === "hi-IN"
        ? String.raw`${prefix} प्रत्येक योजना के लिए $A=P\left(1+\dfrac{R}{100m}\right)^{mt}$; फिर दोनों राशियों का अंतर लें।`
        : String.raw`${prefix} ਹਰ ਯੋਜਨਾ ਲਈ $A=P\left(1+\dfrac{R}{100m}\right)^{mt}$; ਫਿਰ ਦੋਵੇਂ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।`;
    case "INT-QL-076":
      return locale === "hi-IN"
        ? String.raw`${prefix} प्रभावी वार्षिक दर $E=\left[\left(1+\dfrac{R}{100m}\right)^m-1\right]\times100$।`
        : String.raw`${prefix} ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ $E=\left[\left(1+\dfrac{R}{100m}\right)^m-1\right]\times100$।`;
    case "INT-QL-077":
      return String.raw`${prefix} $1+\dfrac{E}{100}=\left(1+\dfrac{R}{100m}\right)^m$।`;
    case "INT-QL-078":
      return locale === "hi-IN"
        ? String.raw`${prefix} $A=P\left(1+\dfrac{R}{100m}\right)^{mt}$; सही $m$ वही है जिससे दी गई राशि मिलती है।`
        : String.raw`${prefix} $A=P\left(1+\dfrac{R}{100m}\right)^{mt}$; ਸਹੀ $m$ ਉਹੀ ਹੈ ਜਿਸ ਨਾਲ ਦਿੱਤੀ ਰਕਮ ਮਿਲਦੀ ਹੈ।`;
    case "INT-QL-079":
    case "INT-QL-080":
    case "INT-QL-082":
    case "INT-QL-083":
      return String.raw`${prefix} $A=P\left(1+\frac{R}{100}\right)^y\left(1+\frac{Rx}{100\times12}\right)$।`;
    case "INT-QL-081":
      return String.raw`${prefix} $P=\dfrac{A}{\left(1+\frac{R}{100}\right)^y\left(1+\frac{Rx}{100\times12}\right)}$।`;
    case "INT-QL-084":
    case "INT-QL-085":
      return String.raw`${prefix} $A=P\left(1+\dfrac{R}{100m_1}\right)^{m_1t_1}\left(1+\dfrac{R}{100m_2}\right)^{m_2t_2}$।`;
  }
}

function mathNumber(raw: string): string {
  return raw.replace(/,/gu, "{,}");
}

function convertMathExpression(raw: string): string {
  let value = raw.trim().replace(/[।.]$/u, "");
  value = value.replace(/₹/gu, "");
  value = value.replace(/([0-9][0-9,]*(?:\.\d+)?)%/gu, (_m, n: string) => `${mathNumber(n)}\\%`);
  value = value.replace(/([0-9][0-9,]*(?:\.\d+)?)/gu, (n) => mathNumber(n));
  value = value.replace(/([0-9.{} ,]+)\/100/gu, (_m, n: string) => `\\frac{${n.trim()}}{100}`);
  value = value.replace(/([0-9.{} ,]+)\/\(100×([0-9.{} ,]+)\)/gu, (_m, a: string, b: string) => `\\frac{${a.trim()}}{100\\times ${b.trim()}}`);
  value = value.replace(/×/gu, String.raw`\times `).replace(/÷/gu, String.raw`\div `).replace(/−/gu, "-");
  value = value.replace(/\^\(([^)]+)\)/gu, "^{$1}");
  value = value.replace(/\^([0-9]+)/gu, "^{$1}");
  value = value.replace(/A₁/gu, "A_1").replace(/A₂/gu, "A_2").replace(/m₁/gu, "m_1").replace(/m₂/gu, "m_2");
  return value.replace(/\s+/gu, " ").trim();
}

function latexifyWorkedStep(locale: IntCp004V6Locale, original: string): string {
  let step = preferredCompoundTerm(locale, original);

  const colonIndex = step.indexOf(":");
  if (colonIndex >= 0) {
    const prefix = step.slice(0, colonIndex + 1);
    const rhs = step.slice(colonIndex + 1).trim();
    if (/[=×÷^]/u.test(rhs) && !rhs.includes("$")) {
      return `${prefix} $${convertMathExpression(rhs)}$।`;
    }
  }

  if (/^(?:A|P|E|A₁|A₂|\[|\d[\d,.]*\s*÷)/u.test(step) && /[=×÷^]/u.test(step) && !step.includes("$")) {
    return `$${convertMathExpression(step)}$।`;
  }

  step = step.replace(/\b([nmyx]) = ([0-9.]+)/gu, (_m, variable: string, value: string) => `$${variable}=${value}$`);
  step = step.replace(/\b([nmyx])=([0-9.]+)/gu, (_m, variable: string, value: string) => `$${variable}=${value}$`);
  return step;
}

export function generateIntCp004V6NativeEditorialV4Question(
  qlId: IntCp004V6LocalizedQuestion["qlId"],
  seed: string,
  locale: IntCp004V6Locale,
): IntCp004V6LocalizedQuestion {
  const question = generateIntCp004V6NativeEditorialV3Question(qlId, seed, locale);
  const options = Object.freeze(question.options.map((option) => Object.freeze({
    ...option,
    text: preferredCompoundTerm(locale, option.text),
  })));
  const correctAnswer = options[question.correctIndex]?.text;
  if (!correctAnswer) throw new Error(`${qlId}/${seed}/${locale}: V4 correct answer missing.`);

  const steps = question.explanation.steps.map((step, index) => index === 0
    ? formulaStep(qlId, locale)
    : latexifyWorkedStep(locale, step));

  const explanation = Object.freeze({
    ...question.explanation,
    whatAsked: preferredCompoundTerm(locale, question.explanation.whatAsked),
    steps: Object.freeze(steps),
    finalAnswer: locale === "hi-IN" ? `उत्तर: ${correctAnswer}।` : `ਉੱਤਰ: ${correctAnswer}।`,
    commonMistake: preferredCompoundTerm(locale, question.explanation.commonMistake),
  });

  return deepFreeze({
    ...question,
    stem: fullerStem(qlId, locale, question.stem),
    options,
    correctAnswer,
    explanation,
  });
}
