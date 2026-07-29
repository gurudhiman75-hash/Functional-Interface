export function positiveMod(value: bigint, modulus: bigint): bigint {
  if (modulus <= 0n) throw new Error("Modulus must be positive");
  const residue = value % modulus;
  return residue >= 0n ? residue : residue + modulus;
}

export function isDivisible(value: bigint, divisor: bigint): boolean {
  if (divisor === 0n) throw new Error("Divisor cannot be zero");
  return value % divisor === 0n;
}

export function numeralToBigInt(numeral: string): bigint {
  if (!/^\d+$/.test(numeral)) throw new Error(`Invalid decimal numeral: ${numeral}`);
  return BigInt(numeral);
}

export function fillSingleDigit(template: string, digit: number): string {
  if (!Number.isInteger(digit) || digit < 0 || digit > 9) throw new Error(`Invalid digit: ${digit}`);
  return template.replace("X", String(digit));
}

export function fillTwoDigits(template: string, first: number, second: number): string {
  if (![first, second].every((digit) => Number.isInteger(digit) && digit >= 0 && digit <= 9)) {
    throw new Error(`Invalid digit pair: ${first}, ${second}`);
  }
  return template.replace("X", String(first)).replace("Y", String(second));
}

export function validSingleDigits(template: string, divisor: bigint): number[] {
  const results: number[] = [];
  for (let digit = 0; digit <= 9; digit += 1) {
    const numeral = fillSingleDigit(template, digit);
    if (numeral.startsWith("0")) continue;
    if (isDivisible(numeralToBigInt(numeral), divisor)) results.push(digit);
  }
  return results;
}

export function validTwoDigitPairs(
  template: string,
  divisors: readonly bigint[],
  requiredDigitSum?: number,
): Array<[number, number]> {
  const results: Array<[number, number]> = [];
  for (let first = 0; first <= 9; first += 1) {
    for (let second = 0; second <= 9; second += 1) {
      if (requiredDigitSum !== undefined && first + second !== requiredDigitSum) continue;
      const numeral = fillTwoDigits(template, first, second);
      if (numeral.startsWith("0")) continue;
      const value = numeralToBigInt(numeral);
      if (divisors.every((divisor) => isDivisible(value, divisor))) results.push([first, second]);
    }
  }
  return results;
}

export function repeatBlock(block: string, repeats: number): bigint {
  if (!/^\d+$/.test(block) || block.startsWith("0")) throw new Error(`Invalid block: ${block}`);
  if (!Number.isInteger(repeats) || repeats < 2) throw new Error(`Invalid repeat count: ${repeats}`);
  return BigInt(block.repeat(repeats));
}

export function powerOfTen(exponent: number): bigint {
  if (!Number.isInteger(exponent) || exponent < 0) throw new Error(`Invalid exponent: ${exponent}`);
  return 10n ** BigInt(exponent);
}

export function leastMultipleAtOrAbove(lowerBound: bigint, divisor: bigint): bigint {
  if (lowerBound < 0n || divisor <= 0n) throw new Error("Expected a non-negative bound and positive divisor");
  const remainder = positiveMod(lowerBound, divisor);
  return remainder === 0n ? lowerBound : lowerBound + divisor - remainder;
}
