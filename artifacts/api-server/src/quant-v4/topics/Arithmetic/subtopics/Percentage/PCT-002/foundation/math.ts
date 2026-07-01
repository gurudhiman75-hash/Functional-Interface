export function roundTo(value: number, places = 2): number {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatNumber(value: number): string {
  const rounded = roundTo(value, 2);
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded).replace(/\.?0+$/, "");
}

export function formatPercent(value: number): string {
  return `${formatNumber(value)}%`;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b !== 0) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a || 1;
}

export function formatRatio(left: number, right: number): string {
  const divisor = gcd(left, right);
  return `${left / divisor}:${right / divisor}`;
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

export function wrapAnswer(answerType: string, value: string) {
  if (answerType === "PERCENT") {
    return `$$${value.replace("%", "\\%")}$$`;
  }
  if (answerType === "RATIO") {
    return `$$${value.replace(":", " : ")}$$`;
  }
  return `$$${value}$$`;
}
