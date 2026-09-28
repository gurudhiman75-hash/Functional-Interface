
export interface MisCp017Group {
  readonly first: number;
  readonly second: number;
  readonly result: number;
}

function digitProduct(number: number): number {
  const tens = Math.floor(number / 10);
  const units = number % 10;
  return tens * units;
}

export function independentlyEvaluateMisCp017Rule(
  first: number,
  second: number,
): number | null {
  if (!Number.isInteger(first) || !Number.isInteger(second)) return null;
  if (first < 10 || first > 99 || first % 2 !== 0 || first % 10 === 0) return null;
  const value = second - first / 2 + digitProduct(first);
  return Number.isInteger(value) && value > 0 && value <= 999 ? value : null;
}

export function independentlyVerifyMisCp017Group(group: MisCp017Group): boolean {
  return independentlyEvaluateMisCp017Rule(group.first, group.second) === group.result;
}
