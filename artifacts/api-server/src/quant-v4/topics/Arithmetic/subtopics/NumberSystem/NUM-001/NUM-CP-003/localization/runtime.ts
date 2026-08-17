import type { NumCp003RetainedHiddenState } from "../retained/runtime-types";
import type { NumCp003PermanentQlId } from "../permanent/allocation";
import {
  runNumCp003EditorialV2FinalForQl,
  type NumCp003EditorialV2Question,
} from "../permanent/editorial-v2-final";
import type {
  NumCp003LocalizedQuestion,
  NumCp003TranslatedLanguage,
  NumCp003TranslatedLocale,
} from "./types";

const COMPOSITE_PARTS: Readonly<Record<number, readonly [number, number]>> = Object.freeze({
  6: [2, 3],
  12: [3, 4],
  15: [3, 5],
  18: [2, 9],
  24: [3, 8],
  36: [4, 9],
  45: [5, 9],
  72: [8, 9],
  99: [9, 11],
});

function math(value: string | number | bigint): string {
  return `\\(${String(value)}\\)`;
}

function formatInteger(value: bigint | number): string {
  return typeof value === "bigint"
    ? value.toLocaleString("en-IN")
    : Math.trunc(value).toLocaleString("en-IN");
}

function setMath(values: readonly number[]): string {
  return math(`\\{${values.join(", ")}\\}`);
}

function pairSetMath(pairs: ReadonlyArray<readonly [number, number]>): string {
  if (pairs.length === 0) return math("\\varnothing");
  return math(`\\{${pairs.map(([x, y]) => `(${x}, ${y})`).join(", ")}\\}`);
}

function fillSingleDigit(template: string, digit: number): string {
  return template.replaceAll("X", String(digit));
}

function fillPair(template: string, x: number, y: number): string {
  return template.replaceAll("X", String(x)).replaceAll("Y", String(y));
}

function fillLinked(pattern: string, a: number, b: number): string {
  return pattern.replaceAll("A", String(a)).replaceAll("B", String(b));
}

function localeFor(language: NumCp003TranslatedLanguage): NumCp003TranslatedLocale {
  return language === "hi" ? "hi-IN" : "pa-IN";
}

function primitiveParts(divisor: number): readonly number[] {
  return COMPOSITE_PARTS[divisor] ?? [divisor];
}

function primitiveRuleClause(divisor: number, language: NumCp003TranslatedLanguage): string {
  if (language === "hi") {
    switch (divisor) {
      case 2: return "उसका अंतिम अंक सम होना चाहिए";
      case 3: return "उसके अंकों का योग 3 से विभाज्य होना चाहिए";
      case 4: return "उसके अंतिम दो अंकों से बनी संख्या 4 से विभाज्य होनी चाहिए";
      case 5: return "उसका अंतिम अंक 0 या 5 होना चाहिए";
      case 8: return "उसके अंतिम तीन अंकों से बनी संख्या 8 से विभाज्य होनी चाहिए";
      case 9: return "उसके अंकों का योग 9 से विभाज्य होना चाहिए";
      case 10: return "उसका अंतिम अंक 0 होना चाहिए";
      case 11: return "वैकल्पिक स्थानों के अंकों के दोनों योगों का अंतर 0 या 11 का गुणज होना चाहिए";
      case 25: return "उसके अंतिम दो अंक 00, 25, 50 या 75 में से होने चाहिए";
      default: return `भाग देने पर शेष ${math(0)} आना चाहिए`;
    }
  }
  switch (divisor) {
    case 2: return "ਉਸਦਾ ਆਖਰੀ ਅੰਕ ਸਮ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ";
    case 3: return "ਉਸਦੇ ਅੰਕਾਂ ਦਾ ਜੋੜ 3 ਨਾਲ ਭਾਗਯੋਗ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ";
    case 4: return "ਉਸਦੇ ਆਖਰੀ ਦੋ ਅੰਕਾਂ ਨਾਲ ਬਣੀ ਸੰਖਿਆ 4 ਨਾਲ ਭਾਗਯੋਗ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ";
    case 5: return "ਉਸਦਾ ਆਖਰੀ ਅੰਕ 0 ਜਾਂ 5 ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ";
    case 8: return "ਉਸਦੇ ਆਖਰੀ ਤਿੰਨ ਅੰਕਾਂ ਨਾਲ ਬਣੀ ਸੰਖਿਆ 8 ਨਾਲ ਭਾਗਯੋਗ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ";
    case 9: return "ਉਸਦੇ ਅੰਕਾਂ ਦਾ ਜੋੜ 9 ਨਾਲ ਭਾਗਯੋਗ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ";
    case 10: return "ਉਸਦਾ ਆਖਰੀ ਅੰਕ 0 ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ";
    case 11: return "ਇੱਕ ਛੱਡ ਕੇ ਅੰਕਾਂ ਦੇ ਦੋ ਜੋੜਾਂ ਦਾ ਅੰਤਰ 0 ਜਾਂ 11 ਦਾ ਗੁਣਜ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ";
    case 25: return "ਉਸਦੇ ਆਖਰੀ ਦੋ ਅੰਕ 00, 25, 50 ਜਾਂ 75 ਵਿੱਚੋਂ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ";
    default: return `ਭਾਗ ਦੇਣ ਉੱਤੇ ਬਾਕੀ ${math(0)} ਆਉਣਾ ਚਾਹੀਦਾ ਹੈ`;
  }
}

function ruleLine(divisorValue: bigint | number, language: NumCp003TranslatedLanguage): string {
  const divisor = Number(divisorValue);
  const parts = COMPOSITE_PARTS[divisor];
  if (language === "hi") {
    if (!parts) {
      return `किसी संख्या के ${math(divisor)} से पूर्णतः विभाज्य होने के लिए ${primitiveRuleClause(divisor, language)}।`;
    }
    return `किसी संख्या के ${math(divisor)} से पूर्णतः विभाज्य होने के लिए उसका ${math(parts[0])} और ${math(parts[1])}, दोनों से विभाज्य होना जरूरी है। ${math(parts[0])} के लिए ${primitiveRuleClause(parts[0], language)}; ${math(parts[1])} के लिए ${primitiveRuleClause(parts[1], language)}।`;
  }
  if (!parts) {
    return `ਕਿਸੇ ਸੰਖਿਆ ਦੇ ${math(divisor)} ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗਯੋਗ ਹੋਣ ਲਈ ${primitiveRuleClause(divisor, language)}।`;
  }
  return `ਕਿਸੇ ਸੰਖਿਆ ਦੇ ${math(divisor)} ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗਯੋਗ ਹੋਣ ਲਈ ਉਸਦਾ ${math(parts[0])} ਅਤੇ ${math(parts[1])}, ਦੋਵਾਂ ਨਾਲ ਭਾਗਯੋਗ ਹੋਣਾ ਜ਼ਰੂਰੀ ਹੈ। ${math(parts[0])} ਲਈ ${primitiveRuleClause(parts[0], language)}; ${math(parts[1])} ਲਈ ${primitiveRuleClause(parts[1], language)}।`;
}

function digitSumOfNumber(number: bigint): { expression: string; total: number } {
  const digits = [...number.toString()];
  return {
    expression: digits.join(" + "),
    total: digits.reduce((sum, digit) => sum + Number(digit), 0),
  };
}

function alternateSumsOfNumber(number: bigint): readonly [number, number] {
  let first = 0;
  let second = 0;
  [...number.toString()].forEach((digit, index) => {
    if (index % 2 === 0) first += Number(digit);
    else second += Number(digit);
  });
  return [first, second] as const;
}

function primitiveNumberEvidence(
  number: bigint,
  divisor: number,
  language: NumCp003TranslatedLanguage,
): string {
  const digits = number.toString();
  const last = Number(digits.at(-1));
  const suffix2Text = digits.slice(-2).padStart(2, "0");
  const suffix2 = Number(suffix2Text);
  const suffix3Text = digits.slice(-3);
  const suffix3 = Number(suffix3Text);

  if (language === "hi") {
    switch (divisor) {
      case 2:
        return `अंतिम अंक ${math(last)} है, जो ${last % 2 === 0 ? "सम" : "विषम"} है`;
      case 3:
      case 9: {
        const sum = digitSumOfNumber(number);
        const q = Math.floor(sum.total / divisor);
        return `अंकों का योग ${math(`${sum.expression} = ${sum.total}`)} है; ${sum.total % divisor === 0 ? math(`${sum.total} \\div ${divisor} = ${q}`) + " पूर्ण है" : `${math(sum.total)} ${math(divisor)} से विभाज्य नहीं है`}`;
      }
      case 4:
        return `अंतिम दो अंक ${math(suffix2Text)} हैं; ${suffix2 % 4 === 0 ? `${math(`${suffix2} \\div 4 = ${suffix2 / 4}`)} पूर्ण है` : `${math(suffix2)} ${math(4)} से विभाज्य नहीं है`}`;
      case 5:
        return `अंतिम अंक ${math(last)} है, जो ${last === 0 || last === 5 ? "0 या 5 में से है" : "न तो 0 है और न 5"}`;
      case 8:
        return `अंतिम तीन अंक ${math(suffix3Text)} हैं; ${suffix3 % 8 === 0 ? `${math(`${suffix3} \\div 8 = ${suffix3 / 8}`)} पूर्ण है` : `${math(suffix3)} ${math(8)} से विभाज्य नहीं है`}`;
      case 10:
        return `अंतिम अंक ${math(last)} है, जो ${last === 0 ? "0 है" : "0 नहीं है"}`;
      case 11: {
        const [first, second] = alternateSumsOfNumber(number);
        const difference = Math.abs(first - second);
        return `वैकल्पिक स्थानों के अंकों के योग ${math(first)} और ${math(second)} हैं; उनका अंतर ${math(difference)} है, जो ${difference % 11 === 0 ? "0 या 11 का गुणज है" : "0 या 11 का गुणज नहीं है"}`;
      }
      case 25:
        return `अंतिम दो अंक ${math(suffix2Text)} हैं, जो ${suffix2 % 25 === 0 ? "25 का गुणज बनाते हैं" : "25 का गुणज नहीं बनाते"}`;
      default: {
        const d = BigInt(divisor);
        const quotient = number / d;
        const remainder = number % d;
        return remainder === 0n
          ? `${math(`${formatInteger(number)} \\div ${divisor} = ${formatInteger(quotient)}`)} पूर्ण है`
          : `${math(`${formatInteger(number)} = ${divisor} \\times ${formatInteger(quotient)} + ${remainder}`)}, इसलिए शेष ${math(remainder)} है`;
      }
    }
  }

  switch (divisor) {
    case 2:
      return `ਆਖਰੀ ਅੰਕ ${math(last)} ਹੈ, ਜੋ ${last % 2 === 0 ? "ਸਮ" : "ਵਿਸਮ"} ਹੈ`;
    case 3:
    case 9: {
      const sum = digitSumOfNumber(number);
      const q = Math.floor(sum.total / divisor);
      return `ਅੰਕਾਂ ਦਾ ਜੋੜ ${math(`${sum.expression} = ${sum.total}`)} ਹੈ; ${sum.total % divisor === 0 ? math(`${sum.total} \\div ${divisor} = ${q}`) + " ਪੂਰਾ ਹੈ" : `${math(sum.total)} ${math(divisor)} ਨਾਲ ਭਾਗਯੋਗ ਨਹੀਂ ਹੈ`}`;
    }
    case 4:
      return `ਆਖਰੀ ਦੋ ਅੰਕ ${math(suffix2Text)} ਹਨ; ${suffix2 % 4 === 0 ? `${math(`${suffix2} \\div 4 = ${suffix2 / 4}`)} ਪੂਰਾ ਹੈ` : `${math(suffix2)} ${math(4)} ਨਾਲ ਭਾਗਯੋਗ ਨਹੀਂ ਹੈ`}`;
    case 5:
      return `ਆਖਰੀ ਅੰਕ ${math(last)} ਹੈ, ਜੋ ${last === 0 || last === 5 ? "0 ਜਾਂ 5 ਵਿੱਚੋਂ ਹੈ" : "ਨਾ 0 ਹੈ ਅਤੇ ਨਾ 5"}`;
    case 8:
      return `ਆਖਰੀ ਤਿੰਨ ਅੰਕ ${math(suffix3Text)} ਹਨ; ${suffix3 % 8 === 0 ? `${math(`${suffix3} \\div 8 = ${suffix3 / 8}`)} ਪੂਰਾ ਹੈ` : `${math(suffix3)} ${math(8)} ਨਾਲ ਭਾਗਯੋਗ ਨਹੀਂ ਹੈ`}`;
    case 10:
      return `ਆਖਰੀ ਅੰਕ ${math(last)} ਹੈ, ਜੋ ${last === 0 ? "0 ਹੈ" : "0 ਨਹੀਂ ਹੈ"}`;
    case 11: {
      const [first, second] = alternateSumsOfNumber(number);
      const difference = Math.abs(first - second);
      return `ਇੱਕ ਛੱਡ ਕੇ ਅੰਕਾਂ ਦੇ ਜੋੜ ${math(first)} ਅਤੇ ${math(second)} ਹਨ; ਉਨ੍ਹਾਂ ਦਾ ਅੰਤਰ ${math(difference)} ਹੈ, ਜੋ ${difference % 11 === 0 ? "0 ਜਾਂ 11 ਦਾ ਗੁਣਜ ਹੈ" : "0 ਜਾਂ 11 ਦਾ ਗੁਣਜ ਨਹੀਂ ਹੈ"}`;
    }
    case 25:
      return `ਆਖਰੀ ਦੋ ਅੰਕ ${math(suffix2Text)} ਹਨ, ਜੋ ${suffix2 % 25 === 0 ? "25 ਦਾ ਗੁਣਜ ਬਣਾਉਂਦੇ ਹਨ" : "25 ਦਾ ਗੁਣਜ ਨਹੀਂ ਬਣਾਉਂਦੇ"}`;
    default: {
      const d = BigInt(divisor);
      const quotient = number / d;
      const remainder = number % d;
      return remainder === 0n
        ? `${math(`${formatInteger(number)} \\div ${divisor} = ${formatInteger(quotient)}`)} ਪੂਰਾ ਹੈ`
        : `${math(`${formatInteger(number)} = ${divisor} \\times ${formatInteger(quotient)} + ${remainder}`)}, ਇਸ ਲਈ ਬਾਕੀ ${math(remainder)} ਹੈ`;
    }
  }
}

function applicationLine(
  number: bigint,
  divisorValue: bigint | number,
  language: NumCp003TranslatedLanguage,
): string {
  const divisor = Number(divisorValue);
  const parts = primitiveParts(divisor);
  const evidence = parts.map((part) => primitiveNumberEvidence(number, part, language));
  const joined = evidence.join(language === "hi" ? "; साथ ही, " : "; ਨਾਲ ਹੀ, ");
  const divisible = number % BigInt(divisor) === 0n;
  if (language === "hi") {
    return `अब ${math(formatInteger(number))} पर नियम लगाएँ: ${joined}। इसलिए यह संख्या ${math(divisor)} से ${divisible ? "पूर्णतः विभाज्य है" : "पूर्णतः विभाज्य नहीं है"}।`;
  }
  return `ਹੁਣ ${math(formatInteger(number))} ਉੱਤੇ ਨਿਯਮ ਲਗਾਓ: ${joined}। ਇਸ ਲਈ ਇਹ ਸੰਖਿਆ ${math(divisor)} ਨਾਲ ${divisible ? "ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗਯੋਗ ਹੈ" : "ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗਯੋਗ ਨਹੀਂ ਹੈ"}।`;
}

interface TemplateDigitSum {
  expanded: string;
  simplified: string;
  fixed: number;
  xCount: number;
  yCount: number;
}

function templateDigitSum(template: string): TemplateDigitSum {
  let fixed = 0;
  let xCount = 0;
  let yCount = 0;
  const expanded: string[] = [];
  for (const character of template) {
    if (character === "X") {
      xCount += 1;
      expanded.push("X");
    } else if (character === "Y") {
      yCount += 1;
      expanded.push("Y");
    } else if (/\d/u.test(character)) {
      fixed += Number(character);
      expanded.push(character);
    }
  }
  const simplified: string[] = [];
  if (fixed !== 0) simplified.push(String(fixed));
  if (xCount === 1) simplified.push("X");
  else if (xCount > 1) simplified.push(`${xCount}X`);
  if (yCount === 1) simplified.push("Y");
  else if (yCount > 1) simplified.push(`${yCount}Y`);
  return { expanded: expanded.join(" + "), simplified: simplified.join(" + ") || "0", fixed, xCount, yCount };
}

function templateAlternateSums(template: string): readonly [string, string] {
  const first: string[] = [];
  const second: string[] = [];
  [...template].forEach((character, index) => {
    (index % 2 === 0 ? first : second).push(character);
  });
  return [first.join(" + "), second.join(" + ")] as const;
}

function primitiveTemplateEvidence(
  template: string,
  divisor: number,
  language: NumCp003TranslatedLanguage,
): string {
  const last = template.at(-1) ?? "";
  const suffix2 = template.slice(-2);
  const suffix3 = template.slice(-3);
  const hi = language === "hi";

  switch (divisor) {
    case 2:
      if (/^\d$/u.test(last)) {
        return hi
          ? `अंतिम अंक ${math(last)} तय है और वह ${Number(last) % 2 === 0 ? "सम है, इसलिए यह शर्त पूरी है" : "विषम है, इसलिए यह शर्त पूरी नहीं हो सकती"}`
          : `ਆਖਰੀ ਅੰਕ ${math(last)} ਤੈਅ ਹੈ ਅਤੇ ਉਹ ${Number(last) % 2 === 0 ? "ਸਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸ਼ਰਤ ਪੂਰੀ ਹੈ" : "ਵਿਸਮ ਹੈ, ਇਸ ਲਈ ਇਹ ਸ਼ਰਤ ਪੂਰੀ ਨਹੀਂ ਹੋ ਸਕਦੀ"}`;
      }
      return hi ? `अंतिम अंक ${math(last)} है, इसलिए ${math(last)} सम होना चाहिए` : `ਆਖਰੀ ਅੰਕ ${math(last)} ਹੈ, ਇਸ ਲਈ ${math(last)} ਸਮ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ`;
    case 3:
    case 9: {
      const sum = templateDigitSum(template);
      return hi
        ? `अंकों का योग ${math(`${sum.expanded} = ${sum.simplified}`)} है, इसलिए ${math(sum.simplified)} ${math(divisor)} से विभाज्य होना चाहिए`
        : `ਅੰਕਾਂ ਦਾ ਜੋੜ ${math(`${sum.expanded} = ${sum.simplified}`)} ਹੈ, ਇਸ ਲਈ ${math(sum.simplified)} ${math(divisor)} ਨਾਲ ਭਾਗਯੋਗ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ`;
    }
    case 4:
      if (/^\d{2}$/u.test(suffix2)) {
        return hi
          ? `अंतिम दो अंक ${math(suffix2)} तय हैं और ${math(suffix2)} ${math(4)} से ${Number(suffix2) % 4 === 0 ? "विभाज्य है" : "विभाज्य नहीं है"}`
          : `ਆਖਰੀ ਦੋ ਅੰਕ ${math(suffix2)} ਤੈਅ ਹਨ ਅਤੇ ${math(suffix2)} ${math(4)} ਨਾਲ ${Number(suffix2) % 4 === 0 ? "ਭਾਗਯੋਗ ਹੈ" : "ਭਾਗਯੋਗ ਨਹੀਂ ਹੈ"}`;
      }
      return hi ? `अंतिम दो अंक ${math(suffix2)} हैं, इसलिए ${math(suffix2)} ${math(4)} से विभाज्य होना चाहिए` : `ਆਖਰੀ ਦੋ ਅੰਕ ${math(suffix2)} ਹਨ, ਇਸ ਲਈ ${math(suffix2)} ${math(4)} ਨਾਲ ਭਾਗਯੋਗ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ`;
    case 5:
      if (/^\d$/u.test(last)) {
        return hi ? `अंतिम अंक ${math(last)} तय है और वह ${last === "0" || last === "5" ? "इस नियम को पूरा करता है" : "इस नियम को पूरा नहीं करता"}` : `ਆਖਰੀ ਅੰਕ ${math(last)} ਤੈਅ ਹੈ ਅਤੇ ਉਹ ${last === "0" || last === "5" ? "ਇਸ ਨਿਯਮ ਨੂੰ ਪੂਰਾ ਕਰਦਾ ਹੈ" : "ਇਸ ਨਿਯਮ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ"}`;
      }
      return hi ? `अंतिम अंक ${math(last)} है, इसलिए ${math(last)} को ${math(0)} या ${math(5)} होना चाहिए` : `ਆਖਰੀ ਅੰਕ ${math(last)} ਹੈ, ਇਸ ਲਈ ${math(last)} ਨੂੰ ${math(0)} ਜਾਂ ${math(5)} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ`;
    case 8:
      if (/^\d{3}$/u.test(suffix3)) {
        return hi ? `अंतिम तीन अंक ${math(suffix3)} तय हैं और वे ${math(8)} से ${Number(suffix3) % 8 === 0 ? "विभाज्य हैं" : "विभाज्य नहीं हैं"}` : `ਆਖਰੀ ਤਿੰਨ ਅੰਕ ${math(suffix3)} ਤੈਅ ਹਨ ਅਤੇ ਉਹ ${math(8)} ਨਾਲ ${Number(suffix3) % 8 === 0 ? "ਭਾਗਯੋਗ ਹਨ" : "ਭਾਗਯੋਗ ਨਹੀਂ ਹਨ"}`;
      }
      return hi ? `अंतिम तीन अंक ${math(suffix3)} हैं, इसलिए ${math(suffix3)} ${math(8)} से विभाज्य होना चाहिए` : `ਆਖਰੀ ਤਿੰਨ ਅੰਕ ${math(suffix3)} ਹਨ, ਇਸ ਲਈ ${math(suffix3)} ${math(8)} ਨਾਲ ਭਾਗਯੋਗ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ`;
    case 10:
      return hi ? `अंतिम अंक ${math(last)} है, इसलिए वह ${math(0)} होना चाहिए` : `ਆਖਰੀ ਅੰਕ ${math(last)} ਹੈ, ਇਸ ਲਈ ਉਹ ${math(0)} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ`;
    case 11: {
      const [first, second] = templateAlternateSums(template);
      return hi
        ? `वैकल्पिक स्थानों के अंकों के योग ${math(first)} और ${math(second)} हैं; उनका अंतर ${math(0)} या ${math(11)} का गुणज होना चाहिए`
        : `ਇੱਕ ਛੱਡ ਕੇ ਅੰਕਾਂ ਦੇ ਜੋੜ ${math(first)} ਅਤੇ ${math(second)} ਹਨ; ਉਨ੍ਹਾਂ ਦਾ ਅੰਤਰ ${math(0)} ਜਾਂ ${math(11)} ਦਾ ਗੁਣਜ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ`;
    }
    case 25:
      return hi ? `अंतिम दो अंक ${math(suffix2)} हैं; उन्हें ${math("00,25,50,75")} में से होना चाहिए` : `ਆਖਰੀ ਦੋ ਅੰਕ ${math(suffix2)} ਹਨ; ਉਹ ${math("00,25,50,75")} ਵਿੱਚੋਂ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ`;
    default:
      return hi ? `अंक भरने के बाद बनी संख्या को ${math(divisor)} से भाग देने पर शेष ${math(0)} आना चाहिए` : `ਅੰਕ ਭਰਨ ਤੋਂ ਬਾਅਦ ਬਣੀ ਸੰਖਿਆ ਨੂੰ ${math(divisor)} ਨਾਲ ਭਾਗ ਦੇਣ ਉੱਤੇ ਬਾਕੀ ${math(0)} ਆਉਣਾ ਚਾਹੀਦਾ ਹੈ`;
  }
}

function templateTeachingLine(
  template: string,
  divisorValue: bigint | number,
  language: NumCp003TranslatedLanguage,
): string {
  const divisor = Number(divisorValue);
  const parts = primitiveParts(divisor);
  const evidence = parts.map((part) => primitiveTemplateEvidence(template, part, language));
  const joiner = language === "hi" ? "; साथ ही, " : "; ਨਾਲ ਹੀ, ";
  const here = language === "hi" ? "यहाँ" : "ਇੱਥੇ";
  return `${ruleLine(divisor, language)} ${here}, ${evidence.join(joiner)}।`;
}

function parseFirstInteger(value: string): bigint {
  const match = value.replaceAll(",", "").match(/-?\d+/u);
  if (!match) throw new Error(`Unable to parse numeric answer: ${value}`);
  return BigInt(match[0]);
}

function localizedDivisorList(values: readonly bigint[], language: NumCp003TranslatedLanguage): string {
  const rendered = values.map((value) => math(value));
  if (rendered.length <= 1) return rendered[0] ?? "";
  if (language === "hi") return `${rendered.slice(0, -1).join(", ")} और ${rendered.at(-1)}`;
  return `${rendered.slice(0, -1).join(", ")} ਅਤੇ ${rendered.at(-1)}`;
}

function translateStatement(statement: string, language: NumCp003TranslatedLanguage): string {
  let match = statement.match(/^The completed number ([0-9X]+) is divisible by (\d+)\.$/u);
  if (match) {
    return language === "hi"
      ? `पूरी संख्या ${math(match[1])}, ${math(match[2])} से विभाज्य है।`
      : `ਪੂਰੀ ਸੰਖਿਆ ${math(match[1])}, ${math(match[2])} ਨਾਲ ਭਾਗਯੋਗ ਹੈ।`;
  }
  match = statement.match(/^X is an even digit\.$/u);
  if (match) return language === "hi" ? `${math("X")} एक सम अंक है।` : `${math("X")} ਇੱਕ ਸਮ ਅੰਕ ਹੈ।`;
  if (/^X is an odd digit\.$/u.test(statement)) return language === "hi" ? `${math("X")} एक विषम अंक है।` : `${math("X")} ਇੱਕ ਵਿਸਮ ਅੰਕ ਹੈ।`;
  if (/^X is a prime digit\.$/u.test(statement)) return language === "hi" ? `${math("X")} एक अभाज्य अंक है।` : `${math("X")} ਇੱਕ ਅਭਾਜ ਅੰਕ ਹੈ।`;
  if (/^X is a perfect-square digit\.$/u.test(statement)) return language === "hi" ? `${math("X")} एक पूर्ण-वर्ग अंक है।` : `${math("X")} ਇੱਕ ਪੂਰਨ-ਵਰਗ ਅੰਕ ਹੈ।`;
  if (/^X is an even prime digit\.$/u.test(statement)) return language === "hi" ? `${math("X")} एक सम अभाज्य अंक है।` : `${math("X")} ਇੱਕ ਸਮ ਅਭਾਜ ਅੰਕ ਹੈ।`;
  match = statement.match(/^X is a prime digit greater than (\d+)\.$/u);
  if (match) return language === "hi" ? `${math("X")} ${math(match[1])} से बड़ा अभाज्य अंक है।` : `${math("X")} ${math(match[1])} ਤੋਂ ਵੱਡਾ ਅਭਾਜ ਅੰਕ ਹੈ।`;
  if (/^X is a non-zero digit divisible by 5\.$/u.test(statement)) return language === "hi" ? `${math("X")} शून्य के अलावा 5 से विभाज्य अंक है।` : `${math("X")} ਸਿਫ਼ਰ ਤੋਂ ਇਲਾਵਾ 5 ਨਾਲ ਭਾਗਯੋਗ ਅੰਕ ਹੈ।`;
  match = statement.match(/^X is a perfect-square digit greater than (\d+)\.$/u);
  if (match) return language === "hi" ? `${math("X")} ${math(match[1])} से बड़ा पूर्ण-वर्ग अंक है।` : `${math("X")} ${math(match[1])} ਤੋਂ ਵੱਡਾ ਪੂਰਨ-ਵਰਗ ਅੰਕ ਹੈ।`;
  match = statement.match(/^X is greater than (\d+)\.$/u);
  if (match) return language === "hi" ? `${math("X")} ${math(match[1])} से बड़ा है।` : `${math("X")} ${math(match[1])} ਤੋਂ ਵੱਡਾ ਹੈ।`;
  match = statement.match(/^X is less than (\d+)\.$/u);
  if (match) return language === "hi" ? `${math("X")} ${math(match[1])} से छोटा है।` : `${math("X")} ${math(match[1])} ਤੋਂ ਛੋਟਾ ਹੈ।`;
  match = statement.match(/^X is a digit divisible by (\d+)\.$/u);
  if (match) return language === "hi" ? `${math("X")} ${math(match[1])} से विभाज्य अंक है।` : `${math("X")} ${math(match[1])} ਨਾਲ ਭਾਗਯੋਗ ਅੰਕ ਹੈ।`;
  match = statement.match(/^X is one of the digits (.+)\.$/u);
  if (match) return language === "hi" ? `${math("X")} ${match[1]} में से एक अंक है।` : `${math("X")} ${match[1]} ਵਿੱਚੋਂ ਇੱਕ ਅੰਕ ਹੈ।`;
  return statement;
}

const DS_OPTIONS_HI: Readonly<Record<string, string>> = Object.freeze({
  "Statement I alone is sufficient, but Statement II alone is not sufficient.": "केवल कथन I पर्याप्त है, लेकिन केवल कथन II पर्याप्त नहीं है।",
  "Statement II alone is sufficient, but Statement I alone is not sufficient.": "केवल कथन II पर्याप्त है, लेकिन केवल कथन I पर्याप्त नहीं है।",
  "Each statement alone is sufficient.": "प्रत्येक कथन अकेले पर्याप्त है।",
  "Both statements together are sufficient, but neither alone is sufficient.": "दोनों कथन मिलकर पर्याप्त हैं, लेकिन कोई भी अकेले पर्याप्त नहीं है।",
  "Even both statements together are not sufficient.": "दोनों कथन मिलकर भी पर्याप्त नहीं हैं।",
});

const DS_OPTIONS_PA: Readonly<Record<string, string>> = Object.freeze({
  "Statement I alone is sufficient, but Statement II alone is not sufficient.": "ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ, ਪਰ ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।",
  "Statement II alone is sufficient, but Statement I alone is not sufficient.": "ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ, ਪਰ ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।",
  "Each statement alone is sufficient.": "ਹਰ ਕਥਨ ਆਪਣੇ ਆਪ ਵਿੱਚ ਕਾਫ਼ੀ ਹੈ।",
  "Both statements together are sufficient, but neither alone is sufficient.": "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਕਾਫ਼ੀ ਹਨ, ਪਰ ਕੋਈ ਵੀ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।",
  "Even both statements together are not sufficient.": "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ।",
});

function translateClaim(value: string, language: NumCp003TranslatedLanguage): string | null {
  const match = value.match(/^(\d+) is (not )?divisible by (\d+)\.$/u);
  if (!match) return null;
  const [, number, notWord, divisor] = match;
  if (language === "hi") {
    return `${math(number)} ${math(divisor)} से ${notWord ? "विभाज्य नहीं है" : "विभाज्य है"}।`;
  }
  return `${math(number)} ${math(divisor)} ਨਾਲ ${notWord ? "ਭਾਗਯੋਗ ਨਹੀਂ ਹੈ" : "ਭਾਗਯੋਗ ਹੈ"}।`;
}

function translateOption(value: string, language: NumCp003TranslatedLanguage): string {
  const ds = (language === "hi" ? DS_OPTIONS_HI : DS_OPTIONS_PA)[value];
  if (ds) return ds;
  const pairClass: Readonly<Record<string, readonly [string, string]>> = {
    "No solution": ["कोई हल नहीं", "ਕੋਈ ਹੱਲ ਨਹੀਂ"],
    "Exactly one solution": ["ठीक एक हल", "ਠੀਕ ਇੱਕ ਹੱਲ"],
    "More than one solution": ["एक से अधिक हल", "ਇੱਕ ਤੋਂ ਵੱਧ ਹੱਲ"],
    "All possible pairs work": ["सभी संभव युग्म सही हैं", "ਸਾਰੇ ਸੰਭਵ ਜੋੜੇ ਸਹੀ ਹਨ"],
  };
  const pair = pairClass[value];
  if (pair) return language === "hi" ? pair[0] : pair[1];
  return translateClaim(value, language) ?? value;
}

function buildStem(source: NumCp003EditorialV2Question, language: NumCp003TranslatedLanguage): string {
  const state = source.hiddenState;
  const hi = language === "hi";
  const ql = source.permanentQlId;

  switch (state.kind) {
    case "DIRECT_DIVISIBILITY":
      return state.requestedPolarity === "DIVISIBLE"
        ? (hi ? `निम्नलिखित में से कौन-सी संख्या ${math(formatInteger(state.number))} को बिना शेष के विभाजित करती है?` : `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਸੰਖਿਆ ${math(formatInteger(state.number))} ਨੂੰ ਬਿਨਾਂ ਬਾਕੀ ਦੇ ਭਾਗ ਕਰਦੀ ਹੈ?`)
        : (hi ? `निम्नलिखित में से कौन-सी संख्या ${math(formatInteger(state.number))} को पूर्णतः विभाजित नहीं करती है?` : `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਸੰਖਿਆ ${math(formatInteger(state.number))} ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗ ਨਹੀਂ ਕਰਦੀ?`);

    case "SINGLE_DIGIT_CANDIDATE_SET": {
      const divisors = localizedDivisorList(state.divisors, language);
      if (ql === "NUM-QL-002") return hi ? `${math(state.template)} में ${math("X")} के स्थान पर कौन-सा अंक रखने पर संख्या ${divisors} से पूर्णतः विभाज्य होगी?` : `${math(state.template)} ਵਿੱਚ ${math("X")} ਦੀ ਥਾਂ ਕਿਹੜਾ ਅੰਕ ਰੱਖਣ ਨਾਲ ਸੰਖਿਆ ${divisors} ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗਯੋਗ ਹੋਵੇਗੀ?`;
      if (ql === "NUM-QL-003") {
        const largest = state.extremumDirection === "LARGEST" || state.extremumDirection === "GREATEST";
        return hi ? `${math(state.template)} को ${divisors} से विभाज्य बनाने वाला ${math("X")} का ${largest ? "सबसे बड़ा" : "सबसे छोटा"} अंक कौन-सा है?` : `${math(state.template)} ਨੂੰ ${divisors} ਨਾਲ ਭਾਗਯੋਗ ਬਣਾਉਣ ਵਾਲਾ ${math("X")} ਦਾ ${largest ? "ਸਭ ਤੋਂ ਵੱਡਾ" : "ਸਭ ਤੋਂ ਛੋਟਾ"} ਅੰਕ ਕਿਹੜਾ ਹੈ?`;
      }
      if (ql === "NUM-QL-004") return hi ? `${math(state.template)} में ${math("X")} के स्थान पर कितने अंक रखे जा सकते हैं ताकि संख्या ${divisors} से विभाज्य हो?` : `${math(state.template)} ਵਿੱਚ ${math("X")} ਦੀ ਥਾਂ ਕਿੰਨੇ ਅੰਕ ਰੱਖੇ ਜਾ ਸਕਦੇ ਹਨ ਤਾਂ ਜੋ ਸੰਖਿਆ ${divisors} ਨਾਲ ਭਾਗਯੋਗ ਹੋਵੇ?`;
      if (ql === "NUM-QL-005") return hi ? `${math(state.template)} में ${math("X")} के स्थान पर रखे जा सकने वाले सभी अंकों का योग क्या है, ताकि संख्या ${divisors} से विभाज्य हो?` : `${math(state.template)} ਵਿੱਚ ${math("X")} ਦੀ ਥਾਂ ਰੱਖੇ ਜਾ ਸਕਣ ਵਾਲੇ ਸਾਰੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ਕੀ ਹੈ, ਤਾਂ ਜੋ ਸੰਖਿਆ ${divisors} ਨਾਲ ਭਾਗਯੋਗ ਹੋਵੇ?`;
      if (ql === "NUM-QL-006") return hi ? `कौन-सा समुच्चय उन सभी अंकों को दिखाता है जो ${math(state.template)} में ${math("X")} के स्थान पर रखने से संख्या ${divisors} से विभाज्य बनाते हैं?` : `ਕਿਹੜਾ ਸਮੂਹ ਉਹ ਸਾਰੇ ਅੰਕ ਦਿਖਾਉਂਦਾ ਹੈ ਜੋ ${math(state.template)} ਵਿੱਚ ${math("X")} ਦੀ ਥਾਂ ਰੱਖਣ ਨਾਲ ਸੰਖਿਆ ${divisors} ਨਾਲ ਭਾਗਯੋਗ ਬਣਾਉਂਦੇ ਹਨ?`;
      const greatest = state.extremumDirection === "GREATEST" || state.extremumDirection === "LARGEST";
      return hi ? `${math(state.template)} में ${math("X")} को बदलकर बनने वाली ${divisors} से विभाज्य ${greatest ? "सबसे बड़ी" : "सबसे छोटी"} संख्या क्या है?` : `${math(state.template)} ਵਿੱਚ ${math("X")} ਨੂੰ ਬਦਲ ਕੇ ਬਣਨ ਵਾਲੀ ${divisors} ਨਾਲ ਭਾਗਯੋਗ ${greatest ? "ਸਭ ਤੋਂ ਵੱਡੀ" : "ਸਭ ਤੋਂ ਛੋਟੀ"} ਸੰਖਿਆ ਕੀ ਹੈ?`;
    }

    case "ORDERED_PAIR_CANDIDATE_SET": {
      const divisors = localizedDivisorList(state.divisors, language);
      const relation = state.relation?.kind === "DIGIT_SUM" ? (hi ? ` और ${math(`X+Y=${state.relation.value}`)}` : ` ਅਤੇ ${math(`X+Y=${state.relation.value}`)}`) : "";
      if (ql === "NUM-QL-008") return hi ? `कौन-सा क्रमित युग्म ${math("(X,Y)")} ${math(state.template)} को ${divisors} से विभाज्य बनाता है${relation}?` : `ਕਿਹੜਾ ਕ੍ਰਮਬੱਧ ਜੋੜਾ ${math("(X,Y)")} ${math(state.template)} ਨੂੰ ${divisors} ਨਾਲ ਭਾਗਯੋਗ ਬਣਾਉਂਦਾ ਹੈ${relation}?`;
      if (ql === "NUM-QL-009") return hi ? `कितने क्रमित युग्म ${math("(X,Y)")} ${math(state.template)} को ${divisors} से विभाज्य बनाते हैं${relation}?` : `ਕਿੰਨੇ ਕ੍ਰਮਬੱਧ ਜੋੜੇ ${math("(X,Y)")} ${math(state.template)} ਨੂੰ ${divisors} ਨਾਲ ਭਾਗਯੋਗ ਬਣਾਉਂਦੇ ਹਨ${relation}?`;
      if (ql === "NUM-QL-010") return hi ? `कौन-सा समुच्चय उन सभी क्रमित युग्मों ${math("(X,Y)")} को दिखाता है जो ${math(state.template)} को ${divisors} से विभाज्य बनाते हैं${relation}?` : `ਕਿਹੜਾ ਸਮੂਹ ਉਹ ਸਾਰੇ ਕ੍ਰਮਬੱਧ ਜੋੜੇ ${math("(X,Y)")} ਦਿਖਾਉਂਦਾ ਹੈ ਜੋ ${math(state.template)} ਨੂੰ ${divisors} ਨਾਲ ਭਾਗਯੋਗ ਬਣਾਉਂਦੇ ਹਨ${relation}?`;
      return hi ? `कौन-सा कथन सही बताता है कि ${math(state.template)} को ${divisors} से विभाज्य बनाने वाले क्रमित युग्म ${math("(X,Y)")} कितने हैं${relation}?` : `ਕਿਹੜਾ ਕਥਨ ਠੀਕ ਦੱਸਦਾ ਹੈ ਕਿ ${math(state.template)} ਨੂੰ ${divisors} ਨਾਲ ਭਾਗਯੋਗ ਬਣਾਉਣ ਵਾਲੇ ਕ੍ਰਮਬੱਧ ਜੋੜੇ ${math("(X,Y)")} ਕਿੰਨੇ ਹਨ${relation}?`;
    }

    case "DIGIT_BOUND_MULTIPLE":
      return hi
        ? `${math(state.divisor)} से पूर्णतः विभाज्य ${state.direction === "GREATEST" ? "सबसे बड़ी" : "सबसे छोटी"} ${state.digits}-अंकीय संख्या क्या है?`
        : `${math(state.divisor)} ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗਯੋਗ ${state.direction === "GREATEST" ? "ਸਭ ਤੋਂ ਵੱਡੀ" : "ਸਭ ਤੋਂ ਛੋਟੀ"} ${state.digits}-ਅੰਕੀ ਸੰਖਿਆ ਕੀ ਹੈ?`;

    case "ONE_DIVISOR_RANGE":
      return hi
        ? `${math(formatInteger(state.lower))} से ${math(formatInteger(state.upper))} तक, दोनों सिरों सहित, कितने पूर्णांक ${math(state.divisor)} से विभाज्य हैं?`
        : `${math(formatInteger(state.lower))} ਤੋਂ ${math(formatInteger(state.upper))} ਤੱਕ, ਦੋਵੇਂ ਸਿਰਿਆਂ ਸਮੇਤ, ਕਿੰਨੇ ਪੂਰਨ ਅੰਕ ${math(state.divisor)} ਨਾਲ ਭਾਗਯੋਗ ਹਨ?`;

    case "IMPLICIT_REPEATED_NUMERAL":
      return hi
        ? `ब्लॉक ${math(state.block)} को ${state.repeats} बार लगातार लिखकर एक संख्या बनाई गई है। निम्नलिखित में से कौन-सी संख्या उसे पूर्णतः विभाजित करती है?`
        : `ਬਲਾਕ ${math(state.block)} ਨੂੰ ${state.repeats} ਵਾਰ ਲਗਾਤਾਰ ਲਿਖ ਕੇ ਇੱਕ ਸੰਖਿਆ ਬਣਾਈ ਗਈ ਹੈ। ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਸੰਖਿਆ ਉਸਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗ ਕਰਦੀ ਹੈ?`;

    case "LINKED_ARITHMETIC_DIVISIBILITY":
      return hi
        ? `${math(`${state.sourcePattern}+${formatInteger(state.addend)}=${state.resultPattern}`)} में ${math("A")} और ${math("B")} अंक हैं। यदि ${math(state.resultPattern)} ${math(state.divisor)} से विभाज्य है, तो ${math("A")} का ${state.direction === "LARGEST" ? "सबसे बड़ा" : "सबसे छोटा"} संभव मान क्या है?`
        : `${math(`${state.sourcePattern}+${formatInteger(state.addend)}=${state.resultPattern}`)} ਵਿੱਚ ${math("A")} ਅਤੇ ${math("B")} ਅੰਕ ਹਨ। ਜੇ ${math(state.resultPattern)} ${math(state.divisor)} ਨਾਲ ਭਾਗਯੋਗ ਹੈ, ਤਾਂ ${math("A")} ਦਾ ${state.direction === "LARGEST" ? "ਸਭ ਤੋਂ ਵੱਡਾ" : "ਸਭ ਤੋਂ ਛੋਟਾ"} ਸੰਭਵ ਮੁੱਲ ਕੀ ਹੈ?`;

    case "DATA_SUFFICIENCY":
      return hi
        ? `क्या ${math(state.template)} में गायब अंक ${math("X")} को निश्चित रूप से पाया जा सकता है?\nकथन I: ${translateStatement(state.statementI, language)}\nकथन II: ${translateStatement(state.statementII, language)}\nसही डेटा-पर्याप्तता निष्कर्ष चुनिए।`
        : `ਕੀ ${math(state.template)} ਵਿੱਚ ਗੁੰਮ ਅੰਕ ${math("X")} ਨੂੰ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਲੱਭਿਆ ਜਾ ਸਕਦਾ ਹੈ?\nਕਥਨ I: ${translateStatement(state.statementI, language)}\nਕਥਨ II: ${translateStatement(state.statementII, language)}\nਸਹੀ ਡਾਟਾ-ਪਰਯਾਪਤਾ ਨਤੀਜਾ ਚੁਣੋ।`;

    case "CLAIM_VALIDATION":
      return hi
        ? `निम्नलिखित में से कौन-सा विभाज्यता कथन ${state.requestedPolarity === "INCORRECT" ? "गलत" : "सही"} है?`
        : `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਭਾਗਯੋਗਤਾ ਕਥਨ ${state.requestedPolarity === "INCORRECT" ? "ਗਲਤ" : "ਸਹੀ"} ਹੈ?`;
  }
}

function buildConcept(source: NumCp003EditorialV2Question, language: NumCp003TranslatedLanguage): string {
  const state = source.hiddenState;
  const hi = language === "hi";
  switch (state.kind) {
    case "DIRECT_DIVISIBILITY":
      return hi ? "यह प्रश्न सही विभाज्यता नियम लगाकर यह पहचानने की जाँच करता है कि कौन-सा विकल्प संख्या को पूर्णतः विभाजित करता है या नहीं करता।" : "ਇਹ ਪ੍ਰਸ਼ਨ ਸਹੀ ਭਾਗਯੋਗਤਾ ਨਿਯਮ ਲਗਾ ਕੇ ਇਹ ਪਛਾਣਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ ਕਿ ਕਿਹੜਾ ਵਿਕਲਪ ਸੰਖਿਆ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗ ਕਰਦਾ ਹੈ ਜਾਂ ਨਹੀਂ ਕਰਦਾ।";
    case "SINGLE_DIGIT_CANDIDATE_SET": {
      const task = source.permanentQlId === "NUM-QL-002" ? (hi ? "एक सही गायब अंक" : "ਇੱਕ ਸਹੀ ਗੁੰਮ ਅੰਕ")
        : source.permanentQlId === "NUM-QL-003" ? (hi ? "सबसे छोटा या बड़ा सही अंक" : "ਸਭ ਤੋਂ ਛੋਟਾ ਜਾਂ ਵੱਡਾ ਸਹੀ ਅੰਕ")
          : source.permanentQlId === "NUM-QL-004" ? (hi ? "सही अंकों की संख्या" : "ਸਹੀ ਅੰਕਾਂ ਦੀ ਗਿਣਤੀ")
            : source.permanentQlId === "NUM-QL-005" ? (hi ? "सही अंकों का योग" : "ਸਹੀ ਅੰਕਾਂ ਦਾ ਜੋੜ")
              : source.permanentQlId === "NUM-QL-006" ? (hi ? "सभी सही अंकों का समुच्चय" : "ਸਾਰੇ ਸਹੀ ਅੰਕਾਂ ਦਾ ਸਮੂਹ")
                : (hi ? "सही पूरी संख्या का सबसे छोटा या बड़ा मान" : "ਸਹੀ ਪੂਰੀ ਸੰਖਿਆ ਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਜਾਂ ਵੱਡਾ ਮੁੱਲ");
      return hi ? `यह प्रश्न ${math(state.template)} में ${task} निकालने के लिए दी गई सभी विभाज्यता शर्तें लगाने की जाँच करता है।` : `ਇਹ ਪ੍ਰਸ਼ਨ ${math(state.template)} ਵਿੱਚ ${task} ਕੱਢਣ ਲਈ ਦਿੱਤੀਆਂ ਸਾਰੀਆਂ ਭਾਗਯੋਗਤਾ ਸ਼ਰਤਾਂ ਲਗਾਉਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।`;
    }
    case "ORDERED_PAIR_CANDIDATE_SET":
      return hi ? `यह प्रश्न ${math(state.template)} में क्रमित युग्म ${math("(X,Y)")} पर सभी विभाज्यता और अतिरिक्त शर्तें एक साथ लगाने की जाँच करता है।` : `ਇਹ ਪ੍ਰਸ਼ਨ ${math(state.template)} ਵਿੱਚ ਕ੍ਰਮਬੱਧ ਜੋੜੇ ${math("(X,Y)")} ਉੱਤੇ ਸਾਰੀਆਂ ਭਾਗਯੋਗਤਾ ਅਤੇ ਵਾਧੂ ਸ਼ਰਤਾਂ ਇਕੱਠਿਆਂ ਲਗਾਉਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।`;
    case "DIGIT_BOUND_MULTIPLE":
      return hi ? `यह प्रश्न सीमा से शुरू करके ${math(state.divisor)} का आवश्यक ${state.direction === "GREATEST" ? "सबसे बड़ा" : "सबसे छोटा"} ${state.digits}-अंकीय गुणज निकालने की जाँच करता है।` : `ਇਹ ਪ੍ਰਸ਼ਨ ਸੀਮਾ ਤੋਂ ਸ਼ੁਰੂ ਕਰਕੇ ${math(state.divisor)} ਦਾ ਲੋੜੀਂਦਾ ${state.direction === "GREATEST" ? "ਸਭ ਤੋਂ ਵੱਡਾ" : "ਸਭ ਤੋਂ ਛੋਟਾ"} ${state.digits}-ਅੰਕੀ ਗੁਣਜ ਕੱਢਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।`;
    case "ONE_DIVISOR_RANGE":
      return hi ? `यह प्रश्न दिए गए बंद अंतराल में ${math(state.divisor)} के सभी गुणजों की सही गिनती करने की जाँच करता है।` : `ਇਹ ਪ੍ਰਸ਼ਨ ਦਿੱਤੇ ਬੰਦ ਅੰਤਰਾਲ ਵਿੱਚ ${math(state.divisor)} ਦੇ ਸਾਰੇ ਗੁਣਜਾਂ ਦੀ ਸਹੀ ਗਿਣਤੀ ਕਰਨ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।`;
    case "IMPLICIT_REPEATED_NUMERAL":
      return hi ? "यह प्रश्न दोहराए गए ब्लॉक से वास्तविक संख्या बनाकर उस पर सही विभाज्यता नियम लगाने की जाँच करता है।" : "ਇਹ ਪ੍ਰਸ਼ਨ ਦੁਹਰਾਏ ਬਲਾਕ ਤੋਂ ਅਸਲ ਸੰਖਿਆ ਬਣਾ ਕੇ ਉਸ ਉੱਤੇ ਸਹੀ ਭਾਗਯੋਗਤਾ ਨਿਯਮ ਲਗਾਉਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।";
    case "LINKED_ARITHMETIC_DIVISIBILITY":
      return hi ? "यह प्रश्न पहले अंक-आधारित जोड़ पूरा करने, फिर बनी संख्या पर विभाज्यता नियम लगाने और आवश्यक चरम मान चुनने की जाँच करता है।" : "ਇਹ ਪ੍ਰਸ਼ਨ ਪਹਿਲਾਂ ਅੰਕ-ਆਧਾਰਿਤ ਜੋੜ ਪੂਰਾ ਕਰਨ, ਫਿਰ ਬਣੀ ਸੰਖਿਆ ਉੱਤੇ ਭਾਗਯੋਗਤਾ ਨਿਯਮ ਲਗਾਉਣ ਅਤੇ ਲੋੜੀਂਦਾ ਚਰਮ ਮੁੱਲ ਚੁਣਨ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।";
    case "DATA_SUFFICIENCY":
      return hi ? `यह प्रश्न यह जाँचता है कि ${math("X")} का मान तय करने के लिए प्रत्येक कथन अकेले ठीक एक संभव अंक छोड़ता है या नहीं।` : `ਇਹ ਪ੍ਰਸ਼ਨ ਜਾਂਚਦਾ ਹੈ ਕਿ ${math("X")} ਦਾ ਮੁੱਲ ਤੈਅ ਕਰਨ ਲਈ ਹਰ ਕਥਨ ਇਕੱਲਾ ਠੀਕ ਇੱਕ ਸੰਭਵ ਅੰਕ ਛੱਡਦਾ ਹੈ ਜਾਂ ਨਹੀਂ।`;
    case "CLAIM_VALIDATION":
      return hi ? "यह प्रश्न दिए गए विभाज्यता कथन को उसके सही नियम से जाँचकर सही या गलत ठहराने की क्षमता जाँचता है।" : "ਇਹ ਪ੍ਰਸ਼ਨ ਦਿੱਤੇ ਭਾਗਯੋਗਤਾ ਕਥਨ ਨੂੰ ਉਸਦੇ ਸਹੀ ਨਿਯਮ ਨਾਲ ਜਾਂਚ ਕੇ ਸਹੀ ਜਾਂ ਗਲਤ ਠਹਿਰਾਉਣ ਦੀ ਸਮਰੱਥਾ ਜਾਂਚਦਾ ਹੈ।";
  }
}

function singleOutcome(
  state: Extract<NumCp003RetainedHiddenState, { kind: "SINGLE_DIGIT_CANDIDATE_SET" }>,
  language: NumCp003TranslatedLanguage,
): string {
  const hi = language === "hi";
  const valid = state.validDigits;
  const validSet = setMath(valid);
  const allowed = setMath(state.domain);
  const base = hi ? `संभव अंकों ${allowed} को जाँचने पर सही अंक ${validSet} मिलते हैं।` : `ਸੰਭਵ ਅੰਕਾਂ ${allowed} ਨੂੰ ਜਾਂਚਣ ਉੱਤੇ ਸਹੀ ਅੰਕ ${validSet} ਮਿਲਦੇ ਹਨ।`;

  switch (state.projection) {
    case "UNIQUE_VALID_DIGIT": {
      const digit = valid[0]!;
      const completed = BigInt(fillSingleDigit(state.template, digit));
      const checks = state.divisors.map((d) => `${math(`${formatInteger(completed)} \\div ${formatInteger(d)} = ${formatInteger(completed / d)}`)}`).join(hi ? " और " : " ਅਤੇ ");
      return hi ? `${base} इसलिए केवल ${math(`X=${digit}`)} सही है। रखने पर संख्या ${math(formatInteger(completed))} बनती है; ${checks} पूर्ण हैं।` : `${base} ਇਸ ਲਈ ਕੇਵਲ ${math(`X=${digit}`)} ਸਹੀ ਹੈ। ਰੱਖਣ ਉੱਤੇ ਸੰਖਿਆ ${math(formatInteger(completed))} ਬਣਦੀ ਹੈ; ${checks} ਪੂਰੇ ਹਨ।`;
    }
    case "EXTREMUM_VALID_DIGIT": {
      const largest = state.extremumDirection === "LARGEST" || state.extremumDirection === "GREATEST";
      const answer = largest ? valid.at(-1) : valid[0];
      return hi ? `${base} इसलिए ${largest ? "सबसे बड़ा" : "सबसे छोटा"} सही अंक ${math(`X=${answer}`)} है।` : `${base} ਇਸ ਲਈ ${largest ? "ਸਭ ਤੋਂ ਵੱਡਾ" : "ਸਭ ਤੋਂ ਛੋਟਾ"} ਸਹੀ ਅੰਕ ${math(`X=${answer}`)} ਹੈ।`;
    }
    case "VALID_DIGIT_COUNT":
      return hi ? `${base} इसलिए सही अंकों की संख्या ${math(valid.length)} है।` : `${base} ਇਸ ਲਈ ਸਹੀ ਅੰਕਾਂ ਦੀ ਗਿਣਤੀ ${math(valid.length)} ਹੈ।`;
    case "VALID_DIGIT_SUM": {
      const total = valid.reduce((sum, d) => sum + d, 0);
      return hi ? `${base} उनका योग ${math(`${valid.join("+")}=${total}`)} है।` : `${base} ਉਨ੍ਹਾਂ ਦਾ ਜੋੜ ${math(`${valid.join("+")}=${total}`)} ਹੈ।`;
    }
    case "COMPLETE_VALID_DIGIT_SET":
      return hi ? `${base} यही पूरा सही समुच्चय है।` : `${base} ਇਹੀ ਪੂਰਾ ਸਹੀ ਸਮੂਹ ਹੈ।`;
    case "EXTREMUM_COMPLETED_NUMBER": {
      const completed = valid.map((d) => BigInt(fillSingleDigit(state.template, d)));
      const greatest = state.extremumDirection === "GREATEST" || state.extremumDirection === "LARGEST";
      const answer = greatest ? completed.at(-1)! : completed[0]!;
      return hi ? `${base} इनसे बनी ${greatest ? "सबसे बड़ी" : "सबसे छोटी"} संख्या ${math(formatInteger(answer))} है।` : `${base} ਇਨ੍ਹਾਂ ਨਾਲ ਬਣੀ ${greatest ? "ਸਭ ਤੋਂ ਵੱਡੀ" : "ਸਭ ਤੋਂ ਛੋਟੀ"} ਸੰਖਿਆ ${math(formatInteger(answer))} ਹੈ।`;
    }
    default:
      return base;
  }
}

function pairRelationLine(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ORDERED_PAIR_CANDIDATE_SET" }>,
  language: NumCp003TranslatedLanguage,
): string | null {
  if (state.relation?.kind !== "DIGIT_SUM") return null;
  return language === "hi"
    ? `साथ ही प्रश्न में ${math(`X+Y=${state.relation.value}`)} दिया है; यह शर्त भी उसी समय पूरी होनी चाहिए।`
    : `ਨਾਲ ਹੀ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ${math(`X+Y=${state.relation.value}`)} ਦਿੱਤਾ ਹੈ; ਇਹ ਸ਼ਰਤ ਵੀ ਉਸੇ ਸਮੇਂ ਪੂਰੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।`;
}

function pairOutcome(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ORDERED_PAIR_CANDIDATE_SET" }>,
  language: NumCp003TranslatedLanguage,
): string {
  const hi = language === "hi";
  const valid = state.validPairs;
  const validSet = pairSetMath(valid);
  if (state.projection === "UNIQUE_VALID_ORDERED_PAIR") {
    const [x, y] = valid[0]!;
    const completed = BigInt(fillPair(state.template, x, y));
    const checks = state.divisors.map((d) => math(`${formatInteger(completed)} \\div ${formatInteger(d)} = ${formatInteger(completed / d)}`)).join(hi ? " और " : " ਅਤੇ ");
    const relation = state.relation ? (hi ? ` और ${math(`${x}+${y}=${state.relation.value}`)}` : ` ਅਤੇ ${math(`${x}+${y}=${state.relation.value}`)}`) : "";
    return hi ? `सभी शर्तें जाँचने पर केवल ${math(`(X,Y)=(${x},${y})`)} मिलता है। इससे ${math(formatInteger(completed))} बनता है; ${checks} पूर्ण हैं${relation}।` : `ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਜਾਂਚਣ ਉੱਤੇ ਕੇਵਲ ${math(`(X,Y)=(${x},${y})`)} ਮਿਲਦਾ ਹੈ। ਇਸ ਨਾਲ ${math(formatInteger(completed))} ਬਣਦਾ ਹੈ; ${checks} ਪੂਰੇ ਹਨ${relation}।`;
  }
  if (state.projection === "VALID_ORDERED_PAIR_COUNT") return hi ? `सभी क्रमित अंक-युग्म जाँचने पर ${validSet} सही मिलते हैं। इसलिए सही युग्मों की संख्या ${math(valid.length)} है।` : `ਸਾਰੇ ਕ੍ਰਮਬੱਧ ਅੰਕ-ਜੋੜੇ ਜਾਂਚਣ ਉੱਤੇ ${validSet} ਸਹੀ ਮਿਲਦੇ ਹਨ। ਇਸ ਲਈ ਸਹੀ ਜੋੜਿਆਂ ਦੀ ਗਿਣਤੀ ${math(valid.length)} ਹੈ।`;
  if (state.projection === "COMPLETE_VALID_ORDERED_PAIR_SET") return hi ? `सभी क्रमित अंक-युग्म जाँचने पर पूरा सही समुच्चय ${validSet} मिलता है।` : `ਸਾਰੇ ਕ੍ਰਮਬੱਧ ਅੰਕ-ਜੋੜੇ ਜਾਂਚਣ ਉੱਤੇ ਪੂਰਾ ਸਹੀ ਸਮੂਹ ${validSet} ਮਿਲਦਾ ਹੈ।`;
  if (valid.length === 0 && state.relation?.kind === "DIGIT_SUM") {
    const form = templateDigitSum(state.template);
    const primitives = [...new Set(state.divisors.flatMap((d) => primitiveParts(Number(d))))];
    const digitDivisor = primitives.find((d) => d === 3 || d === 9);
    if (digitDivisor && form.xCount === 1 && form.yCount === 1) {
      const total = form.fixed + state.relation.value;
      if (total % digitDivisor !== 0) {
        return hi ? `${math(`X+Y=${state.relation.value}`)} रखने पर अंकों का योग ${math(`${form.fixed}+${state.relation.value}=${total}`)} बनता है। ${math(total)} ${math(digitDivisor)} से विभाज्य नहीं है, इसलिए कोई युग्म संभव नहीं है।` : `${math(`X+Y=${state.relation.value}`)} ਰੱਖਣ ਉੱਤੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ${math(`${form.fixed}+${state.relation.value}=${total}`)} ਬਣਦਾ ਹੈ। ${math(total)} ${math(digitDivisor)} ਨਾਲ ਭਾਗਯੋਗ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਕੋਈ ਜੋੜਾ ਸੰਭਵ ਨਹੀਂ ਹੈ।`;
      }
    }
  }
  if (valid.length === 0) return hi ? "सभी शर्तें एक साथ जाँचने पर कोई क्रमित युग्म नहीं मिलता, इसलिए कोई हल नहीं है।" : "ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਇਕੱਠਿਆਂ ਜਾਂਚਣ ਉੱਤੇ ਕੋਈ ਕ੍ਰਮਬੱਧ ਜੋੜਾ ਨਹੀਂ ਮਿਲਦਾ, ਇਸ ਲਈ ਕੋਈ ਹੱਲ ਨਹੀਂ ਹੈ।";
  if (valid.length === 1) return hi ? `सभी शर्तें जाँचने पर केवल ${validSet} मिलता है, इसलिए ठीक एक हल है।` : `ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਜਾਂਚਣ ਉੱਤੇ ਕੇਵਲ ${validSet} ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ ਠੀਕ ਇੱਕ ਹੱਲ ਹੈ।`;
  return hi ? `सभी शर्तें जाँचने पर ${validSet} मिलते हैं, इसलिए एक से अधिक हल हैं।` : `ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਜਾਂਚਣ ਉੱਤੇ ${validSet} ਮਿਲਦੇ ਹਨ, ਇਸ ਲਈ ਇੱਕ ਤੋਂ ਵੱਧ ਹੱਲ ਹਨ।`;
}

function statementCandidateLine(
  statement: string,
  template: string,
  candidates: readonly number[],
  label: "I" | "II",
  language: NumCp003TranslatedLanguage,
): string {
  const hi = language === "hi";
  const match = statement.match(/^The completed number [0-9X]+ is divisible by (\d+)\.$/u);
  const translated = translateStatement(statement, language);
  if (match) {
    const divisor = Number(match[1]);
    return `${ruleLine(divisor, language)} ${hi ? `कथन ${label} में ${translated} इसे लगाने पर ${math("X")} के संभव मान ${setMath(candidates)} बचते हैं।` : `ਕਥਨ ${label} ਵਿੱਚ ${translated} ਇਸਨੂੰ ਲਗਾਉਣ ਉੱਤੇ ${math("X")} ਦੇ ਸੰਭਵ ਮੁੱਲ ${setMath(candidates)} ਬਚਦੇ ਹਨ।`}`;
  }
  return hi ? `कथन ${label}: ${translated} इससे ${math("X")} के संभव मान ${setMath(candidates)} बचते हैं।` : `ਕਥਨ ${label}: ${translated} ਇਸ ਨਾਲ ${math("X")} ਦੇ ਸੰਭਵ ਮੁੱਲ ${setMath(candidates)} ਬਚਦੇ ਹਨ।`;
}

function dsConclusion(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DATA_SUFFICIENCY" }>,
  language: NumCp003TranslatedLanguage,
): string {
  const hi = language === "hi";
  const together = setMath(state.candidatesTogether);
  switch (state.sufficiencyClass) {
    case "I_ALONE": return hi ? "कथन I अकेले एक ही मान देता है; इसलिए केवल कथन I पर्याप्त है।" : "ਕਥਨ I ਇਕੱਲਾ ਇੱਕ ਹੀ ਮੁੱਲ ਦਿੰਦਾ ਹੈ; ਇਸ ਲਈ ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ।";
    case "II_ALONE": return hi ? "कथन II अकेले एक ही मान देता है; इसलिए केवल कथन II पर्याप्त है।" : "ਕਥਨ II ਇਕੱਲਾ ਇੱਕ ਹੀ ਮੁੱਲ ਦਿੰਦਾ ਹੈ; ਇਸ ਲਈ ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ।";
    case "EACH_ALONE": return hi ? "दोनों कथन अलग-अलग एक ही मान देते हैं; इसलिए प्रत्येक कथन अकेले पर्याप्त है।" : "ਦੋਵੇਂ ਕਥਨ ਵੱਖ-ਵੱਖ ਇੱਕ ਹੀ ਮੁੱਲ ਦਿੰਦੇ ਹਨ; ਇਸ ਲਈ ਹਰ ਕਥਨ ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।";
    case "BOTH_TOGETHER": return hi ? `अलग-अलग एक से अधिक मान बचते हैं, लेकिन दोनों को मिलाने पर ${together} बचता है। इसलिए दोनों कथन साथ में पर्याप्त हैं।` : `ਵੱਖ-ਵੱਖ ਇੱਕ ਤੋਂ ਵੱਧ ਮੁੱਲ ਬਚਦੇ ਹਨ, ਪਰ ਦੋਵੇਂ ਮਿਲਾਉਣ ਉੱਤੇ ${together} ਬਚਦਾ ਹੈ। ਇਸ ਲਈ ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਕਾਫ਼ੀ ਹਨ।`;
    case "INSUFFICIENT": return hi ? `दोनों कथन मिलाने पर भी ${together} में एक से अधिक मान बचते हैं; इसलिए जानकारी पर्याप्त नहीं है।` : `ਦੋਵੇਂ ਕਥਨ ਮਿਲਾਉਣ ਉੱਤੇ ਵੀ ${together} ਵਿੱਚ ਇੱਕ ਤੋਂ ਵੱਧ ਮੁੱਲ ਬਚਦੇ ਹਨ; ਇਸ ਲਈ ਜਾਣਕਾਰੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।`;
  }
}

function selectedClaim(
  source: NumCp003EditorialV2Question,
  state: Extract<NumCp003RetainedHiddenState, { kind: "CLAIM_VALIDATION" }>,
) {
  const answer = source.answer.replaceAll(",", "");
  const match = answer.match(/^(\d+) is (not )?divisible by (\d+)\.$/u);
  if (!match) return state.claims[0]!;
  const number = BigInt(match[1]);
  const divisor = BigInt(match[3]);
  const expectsDivisible = !match[2];
  return state.claims.find((claim) => claim.number === number && claim.divisor === divisor && claim.isTrue === expectsDivisible) ?? state.claims.find((claim) => claim.number === number && claim.divisor === divisor) ?? state.claims[0]!;
}

function buildSolution(
  source: NumCp003EditorialV2Question,
  language: NumCp003TranslatedLanguage,
): readonly string[] {
  const state = source.hiddenState;
  const hi = language === "hi";

  switch (state.kind) {
    case "DIRECT_DIVISIBILITY": {
      const divisor = parseFirstInteger(source.answer);
      return Object.freeze([ruleLine(divisor, language), applicationLine(state.number, divisor, language)]);
    }
    case "SINGLE_DIGIT_CANDIDATE_SET": {
      const lines = state.divisors.slice(0, 3).map((d) => templateTeachingLine(state.template, d, language));
      lines.push(singleOutcome(state, language));
      return Object.freeze(lines.slice(0, 4));
    }
    case "ORDERED_PAIR_CANDIDATE_SET": {
      const lines = state.divisors.slice(0, 2).map((d) => templateTeachingLine(state.template, d, language));
      const relation = pairRelationLine(state, language);
      if (relation) lines.push(relation);
      lines.push(pairOutcome(state, language));
      return Object.freeze(lines.slice(0, 4));
    }
    case "DIGIT_BOUND_MULTIPLE": {
      if (state.direction === "GREATEST") {
        const remainder = state.upperBoundary % state.divisor;
        return Object.freeze([
          hi ? `सबसे बड़ी ${state.digits}-अंकीय संख्या ${math(formatInteger(state.upperBoundary))} से शुरू करें। उसे ${math(state.divisor)} से भाग देकर शेष निकालें।` : `ਸਭ ਤੋਂ ਵੱਡੀ ${state.digits}-ਅੰਕੀ ਸੰਖਿਆ ${math(formatInteger(state.upperBoundary))} ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ। ਉਸਨੂੰ ${math(state.divisor)} ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਬਾਕੀ ਕੱਢੋ।`,
          hi ? `${math(`${formatInteger(state.upperBoundary)} = ${formatInteger(state.divisor)} \\times ${formatInteger(state.upperBoundary / state.divisor)} + ${formatInteger(remainder)}`)}। इसलिए शेष ${math(remainder)} है।` : `${math(`${formatInteger(state.upperBoundary)} = ${formatInteger(state.divisor)} \\times ${formatInteger(state.upperBoundary / state.divisor)} + ${formatInteger(remainder)}`)}। ਇਸ ਲਈ ਬਾਕੀ ${math(remainder)} ਹੈ।`,
          hi ? `${math(`${formatInteger(state.upperBoundary)}-${formatInteger(remainder)}=${formatInteger(state.answer)}`)}। यही सबसे बड़ी आवश्यक संख्या है।` : `${math(`${formatInteger(state.upperBoundary)}-${formatInteger(remainder)}=${formatInteger(state.answer)}`)}। ਇਹੀ ਸਭ ਤੋਂ ਵੱਡੀ ਲੋੜੀਂਦੀ ਸੰਖਿਆ ਹੈ।`,
        ]);
      }
      const remainder = state.lowerBoundary % state.divisor;
      const add = remainder === 0n ? 0n : state.divisor - remainder;
      return Object.freeze([
        hi ? `सबसे छोटी ${state.digits}-अंकीय संख्या ${math(formatInteger(state.lowerBoundary))} से शुरू करें। उसे ${math(state.divisor)} से भाग देकर शेष निकालें।` : `ਸਭ ਤੋਂ ਛੋਟੀ ${state.digits}-ਅੰਕੀ ਸੰਖਿਆ ${math(formatInteger(state.lowerBoundary))} ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ। ਉਸਨੂੰ ${math(state.divisor)} ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਬਾਕੀ ਕੱਢੋ।`,
        hi ? `अगले गुणज तक पहुँचने के लिए ${math(add)} जोड़ना होगा।` : `ਅਗਲੇ ਗੁਣਜ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ${math(add)} ਜੋੜਨਾ ਪਵੇਗਾ।`,
        hi ? `${math(`${formatInteger(state.lowerBoundary)}+${formatInteger(add)}=${formatInteger(state.answer)}`)}। यही सबसे छोटी आवश्यक संख्या है।` : `${math(`${formatInteger(state.lowerBoundary)}+${formatInteger(add)}=${formatInteger(state.answer)}`)}। ਇਹੀ ਸਭ ਤੋਂ ਛੋਟੀ ਲੋੜੀਂਦੀ ਸੰਖਿਆ ਹੈ।`,
      ]);
    }
    case "ONE_DIVISOR_RANGE": {
      const beforeLower = state.lower - 1n;
      const upperCount = state.upper / state.divisor;
      const lowerCount = beforeLower / state.divisor;
      return Object.freeze([
        hi ? `बंद अंतराल में गुणज गिनने के लिए ऊपरी सीमा तक के गुणजों में से निचली सीमा से पहले के गुणज घटाएँ।` : `ਬੰਦ ਅੰਤਰਾਲ ਵਿੱਚ ਗੁਣਜ ਗਿਣਨ ਲਈ ਉੱਪਰੀ ਸੀਮਾ ਤੱਕ ਦੇ ਗੁਣਜਾਂ ਵਿੱਚੋਂ ਹੇਠਲੀ ਸੀਮਾ ਤੋਂ ਪਹਿਲਾਂ ਦੇ ਗੁਣਜ ਘਟਾਓ।`,
        hi ? `ऊपरी सीमा तक: ${math(`\\left\\lfloor ${formatInteger(state.upper)}/${formatInteger(state.divisor)} \\right\\rfloor=${formatInteger(upperCount)}`)}।` : `ਉੱਪਰੀ ਸੀਮਾ ਤੱਕ: ${math(`\\left\\lfloor ${formatInteger(state.upper)}/${formatInteger(state.divisor)} \\right\\rfloor=${formatInteger(upperCount)}`)}।`,
        hi ? `निचली सीमा से पहले: ${math(`\\left\\lfloor ${formatInteger(beforeLower)}/${formatInteger(state.divisor)} \\right\\rfloor=${formatInteger(lowerCount)}`)}।` : `ਹੇਠਲੀ ਸੀਮਾ ਤੋਂ ਪਹਿਲਾਂ: ${math(`\\left\\lfloor ${formatInteger(beforeLower)}/${formatInteger(state.divisor)} \\right\\rfloor=${formatInteger(lowerCount)}`)}।`,
        hi ? `${math(`${formatInteger(upperCount)}-${formatInteger(lowerCount)}=${formatInteger(state.count)}`)}। इसलिए कुल ${math(state.count)} पूर्णांक हैं।` : `${math(`${formatInteger(upperCount)}-${formatInteger(lowerCount)}=${formatInteger(state.count)}`)}। ਇਸ ਲਈ ਕੁੱਲ ${math(state.count)} ਪੂਰਨ ਅੰਕ ਹਨ।`,
      ]);
    }
    case "IMPLICIT_REPEATED_NUMERAL": {
      const divisor = parseFirstInteger(source.answer);
      return Object.freeze([
        hi ? `${math(state.block)} को ${state.repeats} बार लगातार लिखने पर संख्या ${math(formatInteger(state.number))} बनती है।` : `${math(state.block)} ਨੂੰ ${state.repeats} ਵਾਰ ਲਗਾਤਾਰ ਲਿਖਣ ਉੱਤੇ ਸੰਖਿਆ ${math(formatInteger(state.number))} ਬਣਦੀ ਹੈ।`,
        ruleLine(divisor, language),
        applicationLine(state.number, divisor, language),
      ]);
    }
    case "LINKED_ARITHMETIC_DIVISIBILITY": {
      const selected = state.validPairs.find(([a]) => a === state.answerDigit)!;
      const [a, b] = selected;
      const sourceNumber = BigInt(fillLinked(state.sourcePattern, a, b));
      const resultNumber = BigInt(fillLinked(state.resultPattern, a, b));
      const validA = [...new Set(state.validPairs.map(([value]) => value))].sort((x, y) => x - y);
      return Object.freeze([
        hi ? `पहले जोड़ पूरा करें। जोड़ से संभव ${math("(A,B)")} युग्म ${pairSetMath(state.arithmeticPairs)} मिलते हैं।` : `ਪਹਿਲਾਂ ਜੋੜ ਪੂਰਾ ਕਰੋ। ਜੋੜ ਤੋਂ ਸੰਭਵ ${math("(A,B)")} ਜੋੜੇ ${pairSetMath(state.arithmeticPairs)} ਮਿਲਦੇ ਹਨ।`,
        ruleLine(state.divisor, language),
        hi ? `${math(`A=${a},B=${b}`)} पर ${math(`${formatInteger(sourceNumber)}+${formatInteger(state.addend)}=${formatInteger(resultNumber)}`)}। ${applicationLine(resultNumber, state.divisor, language)}` : `${math(`A=${a},B=${b}`)} ਉੱਤੇ ${math(`${formatInteger(sourceNumber)}+${formatInteger(state.addend)}=${formatInteger(resultNumber)}`)}। ${applicationLine(resultNumber, state.divisor, language)}`,
        hi ? `दोनों शर्तों से सही ${math("A")} मान ${setMath(validA)} हैं। इसलिए ${state.direction === "LARGEST" ? "सबसे बड़ा" : "सबसे छोटा"} मान ${math(`A=${state.answerDigit}`)} है।` : `ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਤੋਂ ਸਹੀ ${math("A")} ਮੁੱਲ ${setMath(validA)} ਹਨ। ਇਸ ਲਈ ${state.direction === "LARGEST" ? "ਸਭ ਤੋਂ ਵੱਡਾ" : "ਸਭ ਤੋਂ ਛੋਟਾ"} ਮੁੱਲ ${math(`A=${state.answerDigit}`)} ਹੈ।`,
      ]);
    }
    case "DATA_SUFFICIENCY":
      return Object.freeze([
        hi ? `डेटा पर्याप्तता में कोई कथन तभी पर्याप्त है जब वह ${math("X")} का ठीक एक संभव मान छोड़े।` : `ਡਾਟਾ-ਪਰਯਾਪਤਾ ਵਿੱਚ ਕੋਈ ਕਥਨ ਤਦ ਹੀ ਕਾਫ਼ੀ ਹੈ ਜਦੋਂ ਉਹ ${math("X")} ਦਾ ਠੀਕ ਇੱਕ ਸੰਭਵ ਮੁੱਲ ਛੱਡੇ।`,
        statementCandidateLine(state.statementI, state.template, state.candidatesI, "I", language),
        statementCandidateLine(state.statementII, state.template, state.candidatesII, "II", language),
        dsConclusion(state, language),
      ]);
    case "CLAIM_VALIDATION": {
      const claim = selectedClaim(source, state);
      const statedTrue = claim.isTrue;
      return Object.freeze([
        ruleLine(claim.divisor, language),
        applicationLine(claim.number, claim.divisor, language),
        hi ? `इसलिए दिया गया कथन वास्तव में ${statedTrue ? "सही" : "गलत"} है; प्रश्न में माँगा गया विकल्प यही है।` : `ਇਸ ਲਈ ਦਿੱਤਾ ਕਥਨ ਅਸਲ ਵਿੱਚ ${statedTrue ? "ਸਹੀ" : "ਗਲਤ"} ਹੈ; ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਮੰਗਿਆ ਵਿਕਲਪ ਇਹੀ ਹੈ।`,
      ]);
    }
  }
}

export function runNumCp003LocalizedForQl(
  questionLanguageId: NumCp003PermanentQlId,
  seed: string,
  language: NumCp003TranslatedLanguage,
): NumCp003LocalizedQuestion {
  const canonical = runNumCp003EditorialV2FinalForQl(questionLanguageId, seed);
  const options = Object.freeze(canonical.options.map((option) => translateOption(option, language)));
  const answer = options[canonical.correctIndex];
  if (!answer) throw new Error(`${questionLanguageId}/${seed}/${language}: localized answer missing`);

  return Object.freeze({
    ...canonical,
    locale: localeFor(language),
    language,
    stem: buildStem(canonical, language),
    options,
    answer,
    canonicalAnswer: answer,
    explanation: Object.freeze({
      concept: buildConcept(canonical, language),
      solution: buildSolution(canonical, language),
      finalAnswer: answer,
    }),
    reviewStatus: "MULTILINGUAL_CONTROLLED_REVIEW",
    maturity: "MULTILINGUAL_EDITORIAL_REVIEW",
    allocationStatus: "MULTILINGUAL_CONTROLLED_REVIEW",
    traceability: Object.freeze({ ...canonical.traceability, language }),
    localization: Object.freeze({
      localizationVersion: "num-cp003-hi-pa-rule-first-v1",
      canonicalLocale: "en-IN",
      canonicalLanguage: "en",
      canonicalQuestionId: canonical.questionId,
      canonicalAnswer: canonical.answer,
      locale: localeFor(language),
      language,
      mathematicalStatePreserved: true,
      optionOrderPreserved: true,
      correctIndexPreserved: true,
      misconceptionMappingPreserved: true,
      ruleFirstTeachingPreserved: true,
      lifecycleLocked: true,
    }),
  });
}
