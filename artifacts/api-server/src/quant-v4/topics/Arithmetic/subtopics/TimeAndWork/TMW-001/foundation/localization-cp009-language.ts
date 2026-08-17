import { compare, equals, formatRational, multiply, rational, reciprocal } from "./rational";
import { required } from "./cp001-helpers";
import { tmwCp009NetRate } from "./cp009-engine";
import type { Rational } from "./types";
import type {
  TmwCp009Boundary,
  TmwCp009FlowUnit,
  TmwCp009GeneratedQuestion,
  TmwCp009Option,
  TmwCp009Parameters,
  TmwCp009Pipe,
} from "./cp009-types";
import type { TmwLocalizedLanguage } from "./localization-types";

type Pair = { hi: string; pa: string };
const ZERO = rational(0);
const ONE = rational(1);

const copy: Record<string, Pair> = {
  "a municipal housing complex": { hi: "नगर आवास परिसर", pa: "ਨਗਰ ਰਿਹਾਇਸ਼ੀ ਕੰਪਲੈਕਸ" },
  "a government school": { hi: "सरकारी विद्यालय", pa: "ਸਰਕਾਰੀ ਸਕੂਲ" },
  "a district hospital": { hi: "जिला अस्पताल", pa: "ਜ਼ਿਲ੍ਹਾ ਹਸਪਤਾਲ" },
  "a dairy processing plant": { hi: "डेयरी प्रसंस्करण संयंत्र", pa: "ਡੇਅਰੀ ਪ੍ਰੋਸੈਸਿੰਗ ਪਲਾਂਟ" },
  "an irrigation facility": { hi: "सिंचाई केंद्र", pa: "ਸਿੰਚਾਈ ਕੇਂਦਰ" },
  "overhead water tank": { hi: "ऊपरी जल टंकी", pa: "ਉੱਪਰਲੀ ਪਾਣੀ ਟੈਂਕੀ" },
  "storage tank": { hi: "भंडारण टंकी", pa: "ਭੰਡਾਰਨ ਟੈਂਕੀ" },
  "supply tank": { hi: "आपूर्ति टंकी", pa: "ਸਪਲਾਈ ਟੈਂਕੀ" },
  "clean-water reservoir": { hi: "स्वच्छ-जल जलाशय", pa: "ਸਾਫ਼-ਪਾਣੀ ਜਲਾਸ਼ਯ" },
  "field-storage tank": { hi: "खेत भंडारण टंकी", pa: "ਖੇਤ ਭੰਡਾਰਨ ਟੈਂਕੀ" },
  water: { hi: "पानी", pa: "ਪਾਣੀ" },
};

export function cp009Copy(value: string, language: TmwLocalizedLanguage): string {
  return copy[value]?.[language] ?? value;
}

export function cp009Number(value: Rational): string {
  return formatRational(value);
}

function mixedTimeLatex(value: Rational): string {
  const sign = value.numerator < 0 ? "-" : "";
  const absolute = Math.abs(value.numerator);
  const whole = Math.trunc(absolute / value.denominator);
  const remainder = absolute % value.denominator;
  if (whole === 0) return `${sign}\\frac{${absolute}}{${value.denominator}}`;
  if (remainder === 0) return `${sign}${whole}`;
  return `${sign}${whole}\\frac{${remainder}}{${value.denominator}}`;
}

export function cp009Time(value: Rational, language: TmwLocalizedLanguage): string {
  if (value.denominator === 1) {
    if (language === "hi") return `${value.numerator} ${value.numerator === 1 ? "घंटा" : "घंटे"}`;
    return `${value.numerator} ${value.numerator === 1 ? "ਘੰਟਾ" : "ਘੰਟੇ"}`;
  }
  return `\\(${mixedTimeLatex(value)}\\;\\text{${language === "hi" ? "घंटे" : "ਘੰਟੇ"}}\\)`;
}

export function cp009Boundary(boundary: TmwCp009Boundary, language: TmwLocalizedLanguage): string {
  if (boundary === "FULL") return language === "hi" ? "पूरी तरह भर" : "ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰ";
  return language === "hi" ? "पूरी तरह खाली" : "ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਾਲੀ";
}

export function cp009FlowUnit(unit: TmwCp009FlowUnit, language: TmwLocalizedLanguage): string {
  if (unit === "LITRES_PER_MINUTE") return language === "hi" ? "लीटर प्रति मिनट" : "ਲੀਟਰ ਪ੍ਰਤੀ ਮਿੰਟ";
  return language === "hi" ? "लीटर प्रति घंटा" : "ਲੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ";
}

export function cp009PipeKind(pipe: TmwCp009Pipe, language: TmwLocalizedLanguage): string {
  switch (pipe.kind) {
    case "INLET": return language === "hi" ? "भरने वाली पाइप" : "ਭਰਨ ਵਾਲੀ ਪਾਈਪ";
    case "OUTLET": return language === "hi" ? "निकासी पाइप" : "ਨਿਕਾਸੀ ਪਾਈਪ";
    case "LEAK": return language === "hi" ? "रिसाव" : "ਰਿਸਾਅ";
  }
}

export function cp009PipeLabel(pipe: TmwCp009Pipe, language: TmwLocalizedLanguage): string {
  const suffix = pipe.label.match(/[A-Z]$/)?.[0] ?? "";
  return suffix ? `${cp009PipeKind(pipe, language)} ${suffix}` : cp009PipeKind(pipe, language);
}

export function cp009PipeList(
  parameters: TmwCp009Parameters,
  language: TmwLocalizedLanguage,
  excludedIndex?: number,
): string {
  return parameters.pipes
    .map((pipe, index) => index === excludedIndex ? null : `${cp009PipeLabel(pipe, language)} अकेले ${cp009Time(pipe.soloTime, language)} में टंकी ${pipe.kind === "INLET" ? "भरती" : "खाली करती"} है`)
    .filter((value): value is string => value !== null)
    .map((value) => language === "hi" ? value : value
      .replace(/अकेले/g, "ਇਕੱਲੀ")
      .replace(/में टंकी भरती है/g, "ਵਿੱਚ ਟੈਂਕੀ ਭਰਦੀ ਹੈ")
      .replace(/में टंकी खाली करती है/g, "ਵਿੱਚ ਟੈਂਕੀ ਖਾਲੀ ਕਰਦੀ ਹੈ"))
    .join(language === "hi" ? "; " : "; ");
}

function indianInteger(value: Rational): string {
  if (value.denominator !== 1) return cp009Number(value);
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value.numerator);
}

export function parseTmwCp009AnswerKey(key: string): Rational[] {
  return key.split("|").map((part) => {
    const [numerator, denominator] = part.split("/").map(Number);
    if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) {
      throw new Error(`Invalid CP-009 answer key: ${key}`);
    }
    return rational(numerator, denominator);
  });
}

export function cp009Direction(code: Rational, language: TmwLocalizedLanguage): string {
  if (code.numerator === 2) return language === "hi" ? "दिशा निर्धारित नहीं की जा सकती" : "ਦਿਸ਼ਾ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ";
  if (code.numerator > 0) return language === "hi" ? "टंकी भरती है" : "ਟੈਂਕੀ ਭਰਦੀ ਹੈ";
  if (code.numerator < 0) return language === "hi" ? "टंकी खाली होती है" : "ਟੈਂਕੀ ਖਾਲੀ ਹੁੰਦੀ ਹੈ";
  return language === "hi" ? "पानी का स्तर अपरिवर्तित रहता है" : "ਪਾਣੀ ਦਾ ਪੱਧਰ ਅਪਰਿਵਰਤਿਤ ਰਹਿੰਦਾ ਹੈ";
}

export function cp009LocalizedAnswerText(
  source: TmwCp009GeneratedQuestion,
  values: Rational[],
  language: TmwLocalizedLanguage,
): string {
  const first = values[0];
  switch (source.solution.answerType) {
    case "TIME":
      return cp009Time(first, language);
    case "FRACTION": {
      const rising = compare(tmwCp009NetRate(source.parameters.pipes), ZERO) >= 0;
      return language === "hi"
        ? `टंकी का ${cp009Number(first)} भाग ${rising ? "भरा" : "खाली हुआ"}`
        : `ਟੈਂਕੀ ਦਾ ${cp009Number(first)} ਹਿੱਸਾ ${rising ? "ਭਰਿਆ" : "ਖਾਲੀ ਹੋਇਆ"}`;
    }
    case "COUNT":
      return language === "hi"
        ? `${cp009Number(first)} समान भरने वाली पाइपें`
        : `${cp009Number(first)} ਇੱਕੋ ਜਿਹੀਆਂ ਭਰਨ ਵਾਲੀਆਂ ਪਾਈਪਾਂ`;
    case "CAPACITY":
      return `${indianInteger(first)} ${language === "hi" ? "लीटर" : "ਲੀਟਰ"}`;
    case "FLOW_RATE":
      return `${indianInteger(first)} ${cp009FlowUnit(required(source.parameters.targetFlowUnit ?? source.parameters.sourceFlowUnit, "flowUnit"), language)}`;
    case "LEVEL":
      if (equals(first, ONE)) return language === "hi" ? "पूरी तरह भरी" : "ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰੀ";
      return language === "hi" ? `${cp009Number(first)} भरी` : `${cp009Number(first)} ਭਰੀ`;
    case "RATIO":
      return values.map((value) => String(Math.abs(value.numerator))).join(":");
    case "PERCENT":
      return `${cp009Number(first)}%`;
    case "DIRECTION":
      return cp009Direction(first, language);
    case "DECISION": {
      const event = first.numerator === 1;
      const boundary = values[2].numerator > 0 ? "FULL" : "EMPTY";
      if (event) {
        return language === "hi"
          ? `हाँ — टंकी ${cp009Time(values[1], language)} में ${cp009Boundary(boundary, language)} जाएगी`
          : `ਹਾਂ — ਟੈਂਕੀ ${cp009Time(values[1], language)} ਵਿੱਚ ${cp009Boundary(boundary, language)} ਜਾਵੇਗੀ`;
      }
      const window = required(source.parameters.decisionWindow, "decisionWindow");
      return language === "hi"
        ? `नहीं — टंकी ${cp009Time(window, language)} के भीतर ${cp009Boundary(boundary, language)} नहीं जाएगी`
        : `ਨਹੀਂ — ਟੈਂਕੀ ${cp009Time(window, language)} ਦੇ ਅੰਦਰ ${cp009Boundary(boundary, language)} ਨਹੀਂ ਜਾਵੇਗੀ`;
    }
  }
}

export function cp009LocalizedOptionText(
  source: TmwCp009GeneratedQuestion,
  option: TmwCp009Option,
  language: TmwLocalizedLanguage,
): string {
  if (option.misconceptionId === "CORRECT") {
    return cp009LocalizedAnswerText(source, source.solution.answerValues, language);
  }
  if (source.solution.answerType === "DIRECTION") {
    return cp009Direction(parseTmwCp009AnswerKey(option.key)[0], language);
  }
  if (source.solution.answerType !== "DECISION") {
    return cp009LocalizedAnswerText(source, parseTmwCp009AnswerKey(option.key), language);
  }

  const p = source.parameters;
  const event = source.solution.answerValues[0].numerator === 1;
  const eventTime = source.solution.answerValues[1];
  const boundary: TmwCp009Boundary = source.solution.answerValues[2].numerator > 0 ? "FULL" : "EMPTY";
  const opposite: TmwCp009Boundary = boundary === "FULL" ? "EMPTY" : "FULL";
  const window = required(p.decisionWindow, "decisionWindow");
  if (event) {
    switch (option.misconceptionId) {
      case "BOUNDARY_TIME_NOT_CHECKED":
        return language === "hi"
          ? `नहीं — टंकी ${cp009Time(window, language)} के भीतर ${cp009Boundary(boundary, language)} नहीं जाएगी`
          : `ਨਹੀਂ — ਟੈਂਕੀ ${cp009Time(window, language)} ਦੇ ਅੰਦਰ ${cp009Boundary(boundary, language)} ਨਹੀਂ ਜਾਵੇਗੀ`;
      case "DIRECTION_FROM_PIPE_COUNT":
        return language === "hi"
          ? `हाँ — टंकी ${cp009Time(window, language)} में ${cp009Boundary(boundary, language)} जाएगी`
          : `ਹਾਂ — ਟੈਂਕੀ ${cp009Time(window, language)} ਵਿੱਚ ${cp009Boundary(boundary, language)} ਜਾਵੇਗੀ`;
      default:
        return language === "hi"
          ? `हाँ — टंकी ${cp009Time(eventTime, language)} में ${cp009Boundary(opposite, language)} जाएगी`
          : `ਹਾਂ — ਟੈਂਕੀ ${cp009Time(eventTime, language)} ਵਿੱਚ ${cp009Boundary(opposite, language)} ਜਾਵੇਗੀ`;
    }
  }
  switch (option.misconceptionId) {
    case "BOUNDARY_TIME_NOT_CHECKED":
      return language === "hi"
        ? `हाँ — टंकी ${cp009Time(eventTime, language)} में ${cp009Boundary(boundary, language)} जाएगी`
        : `ਹਾਂ — ਟੈਂਕੀ ${cp009Time(eventTime, language)} ਵਿੱਚ ${cp009Boundary(boundary, language)} ਜਾਵੇਗੀ`;
    case "DIRECTION_FROM_PIPE_COUNT":
      return language === "hi"
        ? `हाँ — टंकी ${cp009Time(eventTime, language)} में ${cp009Boundary(opposite, language)} जाएगी`
        : `ਹਾਂ — ਟੈਂਕੀ ${cp009Time(eventTime, language)} ਵਿੱਚ ${cp009Boundary(opposite, language)} ਜਾਵੇਗੀ`;
    default:
      return language === "hi"
        ? `${cp009Time(window, language)} तक पानी का स्तर अपरिवर्तित रहेगा`
        : `${cp009Time(window, language)} ਤੱਕ ਪਾਣੀ ਦਾ ਪੱਧਰ ਅਪਰਿਵਰਤਿਤ ਰਹੇਗਾ`;
  }
}

export function cp009NetDirection(parameters: TmwCp009Parameters, language: TmwLocalizedLanguage): string {
  const net = tmwCp009NetRate(parameters.pipes);
  return cp009Direction(compare(net, ZERO) > 0 ? rational(1) : compare(net, ZERO) < 0 ? rational(-1) : ZERO, language);
}

export function cp009FullTankTime(pipe: TmwCp009Pipe): Rational {
  return reciprocal(multiply(reciprocal(pipe.soloTime), rational(1)));
}
