import {
  type Rat,
  add,
  divide,
  equalRat,
  formatRat,
  multiply,
  parseRat,
  rat,
  subtract,
} from "../SAP-CP-002/exam-readiness-v3/exact";

export type { Rat };
export { add, divide, equalRat, formatRat, multiply, rat, subtract };

function abs(value: bigint): bigint {
  return value < 0n ? -value : value;
}

export function pow10(exponent: number): bigint {
  if (!Number.isInteger(exponent) || exponent < 0 || exponent > 18) {
    throw new Error(`Unsupported decimal exponent ${exponent}.`);
  }
  return 10n ** BigInt(exponent);
}

export function parseTerminatingDecimal(text: string): Rat | null {
  const normalized = text.trim().replace(/[−–—]/g, "-");
  const match = normalized.match(/^(-?)(\d+)(?:\.(\d+))?$/);
  if (!match) return null;
  const sign = match[1] === "-" ? -1n : 1n;
  const whole = match[2]!;
  const fractional = match[3] ?? "";
  const digits = BigInt(`${whole}${fractional}`);
  return rat(sign * digits, pow10(fractional.length));
}

export function parsePercentLiteral(text: string): Rat | null {
  const normalized = text.trim();
  if (!normalized.endsWith("%")) return null;
  const numeric = parseTerminatingDecimal(normalized.slice(0, -1));
  return numeric ? divide(numeric, rat(100n)) : null;
}

export function parseRecurringDecimal(text: string): Rat | null {
  const normalized = text.trim().replace(/[−–—]/g, "-");
  const match = normalized.match(/^(-?)(\d+)\.(\d*)\((\d+)\)$/);
  if (!match) return null;
  const sign = match[1] === "-" ? -1n : 1n;
  const whole = BigInt(match[2]!);
  const nonRepeating = match[3] ?? "";
  const repeating = match[4]!;
  const m = nonRepeating.length;
  const n = repeating.length;
  const prefixDigits = `${match[2]!}${nonRepeating}`;
  const allDigits = `${prefixDigits}${repeating}`;
  const prefix = BigInt(prefixDigits);
  const all = BigInt(allDigits);
  const numerator = all - prefix;
  const denominator = pow10(m) * (pow10(n) - 1n);
  return rat(sign * numerator, denominator);
}

export function parseNumericLiteral(text: string): Rat | null {
  const clean = text.trim();
  return parsePercentLiteral(clean)
    ?? parseRecurringDecimal(clean)
    ?? (clean.includes(".") ? parseTerminatingDecimal(clean) : null)
    ?? parseRat(clean);
}

export function isTerminating(value: Rat): boolean {
  let denominator = value.d;
  while (denominator % 2n === 0n) denominator /= 2n;
  while (denominator % 5n === 0n) denominator /= 5n;
  return denominator === 1n;
}

export function formatTerminatingDecimal(value: Rat): string {
  let denominator = value.d;
  let twos = 0;
  let fives = 0;
  while (denominator % 2n === 0n) {
    denominator /= 2n;
    twos += 1;
  }
  while (denominator % 5n === 0n) {
    denominator /= 5n;
    fives += 1;
  }
  if (denominator !== 1n) {
    throw new Error(`${formatRat(value)} does not have a terminating decimal representation.`);
  }
  const places = Math.max(twos, fives);
  const twoScale = 2n ** BigInt(places - twos);
  const fiveScale = 5n ** BigInt(places - fives);
  const scaled = value.n * twoScale * fiveScale;
  if (places === 0) return scaled.toString().replace("-", "−");
  const sign = scaled < 0n ? "−" : "";
  const digits = abs(scaled).toString().padStart(places + 1, "0");
  const whole = digits.slice(0, -places);
  let fractional = digits.slice(-places).replace(/0+$/, "");
  if (!fractional) return `${sign}${whole}`;
  return `${sign}${whole}.${fractional}`;
}

export function formatPercentLiteral(value: Rat): string {
  return `${formatTerminatingDecimal(multiply(value, rat(100n)))}%`;
}

export function canonicalRat(value: Rat): string {
  return formatRat(value).replace(/−/g, "-");
}

export function compareRat(left: Rat, right: Rat): -1 | 0 | 1 {
  const difference = left.n * right.d - right.n * left.d;
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
}

export function independentAdd(left: Rat, right: Rat): Rat {
  return rat(left.n * right.d + right.n * left.d, left.d * right.d);
}

export function independentSubtract(left: Rat, right: Rat): Rat {
  return rat(left.n * right.d - right.n * left.d, left.d * right.d);
}

export function independentMultiply(left: Rat, right: Rat): Rat {
  return rat(left.n * right.n, left.d * right.d);
}

export function independentDivide(left: Rat, right: Rat): Rat {
  if (right.n === 0n) throw new Error("Division by zero is not allowed.");
  return rat(left.n * right.d, left.d * right.n);
}

export function decimalPlaces(text: string): number {
  const clean = text.replace(/[−–—]/g, "-").replace(/%$/, "");
  return clean.includes(".") ? clean.split(".")[1]!.length : 0;
}

export function normalizeStudentMath(text: string): string {
  return text
    .replace(/[–—-](?=\d)/g, "−")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.?])/g, "$1")
    .trim();
}

export function normalizePayload(text: string): string {
  return text
    .replace(/[−–—]/g, "-")
    .replace(/\s+/g, "")
    .toLowerCase();
}

export function ensureSentence(text: string): string {
  const clean = normalizeStudentMath(text);
  return /[.!?:]$/.test(clean) ? clean : `${clean}.`;
}

export function hash32(text: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function sameDisplayedValue(left: string, right: string): boolean {
  const a = parseNumericLiteral(left);
  const b = parseNumericLiteral(right);
  return Boolean(a && b && equalRat(a, b));
}
