export type QuantV4AnswerKind =
  | "integer"
  | "decimal"
  | "percentage"
  | "fraction"
  | "ratio"
  | "currency"
  | "unit"
  | "symbolic";

export type QuantV4RoundingMode = "exact" | "rounded" | "approximate";

export interface QuantV4BaseAnswer {
  kind: QuantV4AnswerKind;
  rendered?: string;
  display?: string;
  precision?: number;
  rounding?: QuantV4RoundingMode;
  metadata?: Record<string, unknown>;
}

export interface QuantV4NumericAnswer extends QuantV4BaseAnswer {
  kind: "integer" | "decimal" | "percentage";
  value: number;
}

export interface QuantV4FractionAnswer extends QuantV4BaseAnswer {
  kind: "fraction";
  numerator: number;
  denominator: number;
}

export interface QuantV4RatioAnswer extends QuantV4BaseAnswer {
  kind: "ratio";
  terms: readonly number[];
}

export interface QuantV4CurrencyAnswer extends QuantV4BaseAnswer {
  kind: "currency";
  value: number;
  currency: string;
}

export interface QuantV4UnitAnswer extends QuantV4BaseAnswer {
  kind: "unit";
  value: number;
  unit: string;
}

export interface QuantV4SymbolicAnswer extends QuantV4BaseAnswer {
  kind: "symbolic";
  value: string;
}

export type QuantV4CanonicalAnswer =
  | QuantV4NumericAnswer
  | QuantV4FractionAnswer
  | QuantV4RatioAnswer
  | QuantV4CurrencyAnswer
  | QuantV4UnitAnswer
  | QuantV4SymbolicAnswer;

export type QuantV4AnswerLike =
  | QuantV4CanonicalAnswer
  | string
  | number
  | null
  | undefined;

const CURRENCY_SYMBOLS = new Set(["₹", "$", "€", "£", "¥"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCanonicalAnswer(value: unknown): value is QuantV4CanonicalAnswer {
  return isRecord(value) && typeof value.kind === "string";
}

function cleanNumber(value: string) {
  return Number(value.replace(/,/g, ""));
}

function trimMathDisplay(value: string) {
  const trimmed = value.trim();
  if (/^\$\$[\s\S]*\$\$$/.test(trimmed)) {
    return trimmed.slice(2, -2).trim();
  }
  if (/^\\\([\s\S]*\\\)$/.test(trimmed)) {
    return trimmed.slice(2, -2).trim();
  }
  return trimmed;
}

function containsMathJax(value: string) {
  return /\$\$|\\\(|\\\)|\\frac|\\text|\\dfrac|\\begin|\\end/.test(value);
}

function inferPrecision(value: string) {
  const decimal = value.match(/\.(\d+)/);
  return decimal ? decimal[1]!.length : 0;
}

function buildDisplay(answer: QuantV4CanonicalAnswer): string {
  if (answer.display) return answer.display;
  switch (answer.kind) {
    case "integer":
    case "decimal":
      return formatNumber(answer.value, answer.precision);
    case "percentage":
      return `${formatNumber(answer.value, answer.precision)}%`;
    case "fraction":
      return `${answer.numerator}/${answer.denominator}`;
    case "ratio":
      return answer.terms.join(":");
    case "currency":
      return `${answer.currency}${formatNumber(answer.value, answer.precision)}`;
    case "unit":
      return `${formatNumber(answer.value, answer.precision)} ${answer.unit}`.trim();
    case "symbolic":
      return answer.value;
  }
}

export function formatNumber(value: number, precision?: number) {
  if (!Number.isFinite(value)) return String(value);
  if (precision !== undefined) {
    return value.toFixed(Math.max(0, precision)).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
  }
  return Number.isInteger(value) ? String(value) : value.toFixed(4).replace(/\.?0+$/, "");
}

export function renderQuantV4Answer(answer: QuantV4AnswerLike): string {
  const canonical = normalizeQuantV4Answer(answer);
  return canonical.rendered ?? buildDisplay(canonical);
}

export function normalizeQuantV4Answer(answer: QuantV4AnswerLike): QuantV4CanonicalAnswer {
  if (isCanonicalAnswer(answer)) {
    const canonical = answer as QuantV4CanonicalAnswer;
    return {
      ...canonical,
      display: canonical.display ?? buildDisplay(canonical),
    } as QuantV4CanonicalAnswer;
  }

  if (typeof answer === "number" && Number.isFinite(answer)) {
    return {
      kind: Number.isInteger(answer) ? "integer" : "decimal",
      value: answer,
      precision: Number.isInteger(answer) ? 0 : undefined,
      display: formatNumber(answer),
      rounding: "exact",
    };
  }

  const raw = String(answer ?? "").trim();
  const displayText = trimMathDisplay(raw);

  if (!raw) {
    return { kind: "symbolic", value: "", display: "", rounding: "exact" };
  }

  // A display wrapper does not change the mathematical answer. Parse simple
  // values after removing it so $$5 : 8$$ and 5:8 have one identity.
  const parseable = displayText;
  if (containsMathJax(parseable)) {
    return {
      kind: "symbolic",
      value: parseable,
      rendered: raw,
      display: parseable,
      rounding: "exact",
    };
  }

  const ratio = parseable.match(/^(-?\d+(?:\.\d+)?)\s*:\s*(-?\d+(?:\.\d+)?)(?:\s*:\s*(-?\d+(?:\.\d+)?))?(?:\s*:\s*(-?\d+(?:\.\d+)?))?$/);
  if (ratio) {
    return {
      kind: "ratio",
      terms: [ratio[1], ratio[2], ratio[3], ratio[4]].filter(Boolean).map((term) => cleanNumber(term!)),
      display: parseable.replace(/\s+/g, ""),
      rounding: "exact",
    };
  }

  const fraction = parseable.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
  if (fraction) {
    return {
      kind: "fraction",
      numerator: cleanNumber(fraction[1]!),
      denominator: cleanNumber(fraction[2]!),
      display: `${fraction[1]}/${fraction[2]}`,
      rounding: "exact",
    };
  }

  const percent = parseable.match(/^(-?[\d,]+(?:\.\d+)?)\s*%$/);
  if (percent) {
    const value = cleanNumber(percent[1]!);
    return {
      kind: "percentage",
      value,
      precision: inferPrecision(percent[1]!),
      display: `${formatNumber(value, inferPrecision(percent[1]!))}%`,
      rounding: "exact",
    };
  }

  const currencyPrefix = parseable.match(/^([^\d\s.-])\s*(-?[\d,]+(?:\.\d+)?)$/);
  if (currencyPrefix && CURRENCY_SYMBOLS.has(currencyPrefix[1]!)) {
    const value = cleanNumber(currencyPrefix[2]!);
    return {
      kind: "currency",
      value,
      currency: currencyPrefix[1]!,
      precision: inferPrecision(currencyPrefix[2]!),
      display: `${currencyPrefix[1]}${formatNumber(value, inferPrecision(currencyPrefix[2]!))}`,
      rounding: "exact",
    };
  }

  const unit = raw.match(/^(-?[\d,]+(?:\.\d+)?)\s+([A-Za-z][A-Za-z0-9/%²³_.-]*(?:\s+[A-Za-z][A-Za-z0-9/%²³_.-]*)*)$/);
  if (unit) {
    const value = cleanNumber(unit[1]!);
    return {
      kind: "unit",
      value,
      unit: unit[2]!,
      precision: inferPrecision(unit[1]!),
      display: `${formatNumber(value, inferPrecision(unit[1]!))} ${unit[2]}`,
      rounding: "exact",
    };
  }

  const numeric = parseable.match(/^-?[\d,]+(?:\.\d+)?$/);
  if (numeric) {
    const value = cleanNumber(parseable);
    return {
      kind: Number.isInteger(value) ? "integer" : "decimal",
      value,
      precision: inferPrecision(parseable),
      display: formatNumber(value, inferPrecision(parseable)),
      rounding: "exact",
    };
  }

  return {
    kind: "symbolic",
    value: parseable,
    display: parseable,
    rounding: "exact",
  };
}

export function getComparableAnswerKey(answer: QuantV4AnswerLike): string {
  const canonical = normalizeQuantV4Answer(answer);
  switch (canonical.kind) {
    case "integer":
    case "decimal":
    case "percentage":
      return `${canonical.kind}:${formatNumber(canonical.value, canonical.precision)}`;
    case "currency":
      return `${canonical.kind}:${canonical.currency}:${formatNumber(canonical.value, canonical.precision)}`;
    case "unit":
      return `${canonical.kind}:${formatNumber(canonical.value, canonical.precision)}:${canonical.unit.toLowerCase()}`;
    case "fraction":
      return `${canonical.kind}:${canonical.numerator}/${canonical.denominator}`;
    case "ratio":
      return `${canonical.kind}:${canonical.terms.join(":")}`;
    case "symbolic":
      return `${canonical.kind}:${canonical.display ?? canonical.value}`;
  }
}

export function quantV4AnswersEqual(left: QuantV4AnswerLike, right: QuantV4AnswerLike) {
  return getComparableAnswerKey(left) === getComparableAnswerKey(right);
}
