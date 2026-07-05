import type { Pct006AnswerType, Pct006ComparisonDirection, Pct006Language } from "./types";

export function roundTo(value: number, places = 4): number {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatNumber(value: number, places = 2): string {
  const rounded = roundTo(value, places);
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded).replace(/\.?0+$/, "");
}

export function formatPercent(value: number): string {
  return `${formatNumber(value)}%`;
}

export function wrapAnswer(answerType: Pct006AnswerType, raw: string): string {
  if (answerType === "PERCENT") return `$$${raw.replace("%", "\\%")}$$`;
  if (answerType === "RATIO") return `$$${raw.replace(":", " : ")}$$`;
  if (answerType === "ABSOLUTE" && /^-?\d+(?:\.\d+)?$/.test(raw)) return `$$${raw}$$`;
  return raw;
}

export function stableHash(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function stableBucket(seed: string, size: number): number {
  if (size <= 0) return 0;
  return stableHash(seed) % size;
}

export function mathJaxBlock(expression: string) {
  return `\\[\\Rightarrow ${expression}\\]`;
}

export function percentMultiplier(kind: "more" | "less", rate: number) {
  return kind === "more" ? (100 + rate) / 100 : (100 - rate) / 100;
}

export function selectedBasePercent(difference: number, base: number) {
  return roundTo((difference / base) * 100, 4);
}

export function reverseBasePercent(kind: "more" | "less", rate: number) {
  const denominator = kind === "more" ? 100 + rate : 100 - rate;
  return roundTo((rate / denominator) * 100, 4);
}

export function relativeChangePercent(oldRate: number, newRate: number) {
  return roundTo(((newRate - oldRate) / oldRate) * 100, 4);
}

export function differenceAsText(value: number, prefix = "", unitLabel = "") {
  const numberPart = `${prefix}${formatNumber(value)}`.trim();
  return unitLabel ? `${numberPart} ${unitLabel}`.trim() : numberPart;
}

export function comparisonText(
  left: string,
  right: string,
  direction: Pct006ComparisonDirection,
  magnitude: string,
  basis: "absolute" | "percent",
  language: Pct006Language = "en",
) {
  if (language === "hi") {
    if (direction === "equal") return `${left} और ${right} बराबर हैं।`;
    if (basis === "percent") {
      return direction === "more"
        ? `${left}, ${right} से ${magnitude} अधिक है।`
        : `${left}, ${right} से ${magnitude} कम है।`;
    }
    return direction === "more"
      ? `${left}, ${magnitude} से अधिक है।`
      : `${right}, ${magnitude} से अधिक है।`;
  }
  if (language === "pa") {
    if (direction === "equal") return `${left} ਅਤੇ ${right} ਬਰਾਬਰ ਹਨ।`;
    if (basis === "percent") {
      return direction === "more"
        ? `${left}, ${right} ਨਾਲੋਂ ${magnitude} ਵੱਧ ਹੈ।`
        : `${left}, ${right} ਨਾਲੋਂ ${magnitude} ਘੱਟ ਹੈ।`;
    }
    return direction === "more"
      ? `${left}, ${magnitude} ਨਾਲ ਵੱਧ ਹੈ।`
      : `${right}, ${magnitude} ਨਾਲ ਵੱਧ ਹੈ।`;
  }
  if (direction === "equal") return `${left} and ${right} are equal.`;
  if (basis === "percent") {
    return direction === "more"
      ? `${left} is ${magnitude} more than ${right}.`
      : `${left} is ${magnitude} less than ${right}.`;
  }
  return direction === "more"
    ? `${left} is greater by ${magnitude}.`
    : `${right} is greater by ${magnitude}.`;
}
