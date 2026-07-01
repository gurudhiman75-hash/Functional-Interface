export const INDIAN_GROUPING_THRESHOLD = 1_000;

export function groupIndianInteger(digits: string): string {
  if (!/^\d+$/.test(digits)) {
    throw new Error(`Indian grouping requires integer digits: ${digits}`);
  }
  if (digits.length <= 3) return digits;
  const lastThree = digits.slice(-3);
  const leading = digits.slice(0, -3);
  const groups: string[] = [];
  let cursor = leading.length;
  while (cursor > 0) {
    const start = Math.max(0, cursor - 2);
    groups.unshift(leading.slice(start, cursor));
    cursor = start;
  }
  return `${groups.join(",")},${lastThree}`;
}

export function applyIndianGrouping(value: string): string {
  const match = value.match(/^(-?)(\d+)(\.\d+)?$/);
  if (!match) throw new Error(`Unsupported numeric presentation: ${value}`);
  const [, sign, integer, decimal = ""] = match;
  if (Number(integer) < INDIAN_GROUPING_THRESHOLD) {
    return `${sign}${integer}${decimal}`;
  }
  return `${sign}${groupIndianInteger(integer!)}${decimal}`;
}

