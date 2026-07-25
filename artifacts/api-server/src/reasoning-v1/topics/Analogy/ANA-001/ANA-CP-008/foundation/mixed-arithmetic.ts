import {
  letterFromPosition,
  letterPosition,
  shiftLetter,
} from "../../foundation/alphabet";

export type PositionAggregate = "SUM" | "PRODUCT";
export type WholeNumberOperation = "ADD" | "SUBTRACT";
export type NumericPowerTransform = "CUBE" | "PERFECT_SQUARE_TO_CUBE";

const withinPilotBounds = (value: number): boolean =>
  Number.isSafeInteger(value) && Math.abs(value) <= 9999;

export function ordinaryPositions(letters: string): readonly number[] {
  const normalized = letters.trim().toUpperCase();
  if (!/^[A-Z]+$/.test(normalized)) throw new Error(`Invalid letters for position arithmetic: ${letters}`);
  return [...normalized].map(letterPosition);
}

export function aggregateOrdinaryPositions(letters: string, aggregate: PositionAggregate): number {
  const positions = ordinaryPositions(letters);
  const result = aggregate === "SUM"
    ? positions.reduce((sum, value) => sum + value, 0)
    : positions.reduce((product, value) => product * value, 1);
  if (!withinPilotBounds(result) || result < 1) throw new Error(`Unsafe mixed position aggregate: ${result}`);
  return result;
}

export function ordinaryLetterPositionPower(letter: string, exponent: 2 | 3): number | null {
  const normalized = letter.trim().toUpperCase();
  if (!/^[A-Z]$/.test(normalized)) return null;
  const result = letterPosition(normalized) ** exponent;
  return withinPilotBounds(result) ? result : null;
}

export function aggregateToLetterWithoutWrap(letters: string, aggregate: PositionAggregate): string | null {
  const value = aggregateOrdinaryPositions(letters, aggregate);
  return value >= 1 && value <= 26 ? letterFromPosition(value) : null;
}

export function applyWholeNumberOperation(
  input: number,
  operation: WholeNumberOperation,
  amount: number,
): number | null {
  if (!withinPilotBounds(input)) return null;
  if (!Number.isSafeInteger(amount) || amount < 1 || amount > 100) return null;
  const output = operation === "ADD" ? input + amount : input - amount;
  return withinPilotBounds(output) ? output : null;
}

export function applyExactRationalMultiplier(
  input: number,
  numerator: number,
  denominator: number,
): number | null {
  if (!withinPilotBounds(input)) return null;
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator)) return null;
  if (numerator === 0 || denominator <= 0 || Math.abs(numerator) > 20 || denominator > 20) return null;
  const product = input * numerator;
  if (!Number.isSafeInteger(product) || product % denominator !== 0) return null;
  const output = product / denominator;
  return withinPilotBounds(output) ? output : null;
}

export function applyNumericPowerTransform(
  input: number,
  transform: NumericPowerTransform,
): number | null {
  if (!Number.isSafeInteger(input) || input < 1 || input > 9999) return null;
  if (transform === "CUBE") {
    const output = input ** 3;
    return withinPilotBounds(output) ? output : null;
  }
  const root = Math.sqrt(input);
  if (!Number.isInteger(root)) return null;
  const output = input * root;
  return withinPilotBounds(output) ? output : null;
}

export function applyLetterShift(letter: string, shift: number): string | null {
  const normalized = letter.trim().toUpperCase();
  if (!/^[A-Z]$/.test(normalized)) return null;
  if (!Number.isSafeInteger(shift) || shift === 0 || Math.abs(shift) > 12) return null;
  return shiftLetter(normalized, shift);
}

export function applyUniformLetterGroupShift(letters: string, shift: number): string | null {
  const normalized = letters.trim().toUpperCase();
  if (!/^[A-Z]{2,6}$/.test(normalized)) return null;
  if (!Number.isSafeInteger(shift) || shift === 0 || Math.abs(shift) > 12) return null;
  return [...normalized].map((letter) => shiftLetter(letter, shift)).join("");
}

export function applyLetterShiftVector(letters: string, shifts: readonly number[]): string | null {
  const normalized = letters.trim().toUpperCase();
  if (!/^[A-Z]{2,6}$/.test(normalized) || normalized.length !== shifts.length) return null;
  if (shifts.some((shift) => !Number.isSafeInteger(shift) || shift === 0 || Math.abs(shift) > 12)) return null;
  return [...normalized].map((letter, index) => shiftLetter(letter, shifts[index])).join("");
}

export function decimalDigitSum(number: number): number | null {
  if (!Number.isSafeInteger(number) || number < 1 || number > 9999) return null;
  return [...String(number)].reduce((sum, digit) => sum + Number(digit), 0);
}

export function squaredDigitSumLetter(number: number): string | null {
  const digitSum = decimalDigitSum(number);
  if (digitSum === null) return null;
  const position = digitSum * digitSum;
  return position >= 1 && position <= 26 ? letterFromPosition(position) : null;
}

export function positionCalculationTrace(letters: string): string {
  return [...letters.trim().toUpperCase()].map((letter) => `${letter}=${letterPosition(letter)}`).join(", ");
}
