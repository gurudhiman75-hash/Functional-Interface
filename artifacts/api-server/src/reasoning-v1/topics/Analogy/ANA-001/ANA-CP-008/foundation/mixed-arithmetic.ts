import {
  letterFromPosition,
  letterPosition,
  shiftLetter,
} from "../../foundation/alphabet";

export type PositionAggregate = "SUM" | "PRODUCT";
export type WholeNumberOperation = "ADD" | "SUBTRACT";

export function ordinaryPositions(letters: string): readonly number[] {
  const normalized = letters.trim().toUpperCase();
  if (!/^[A-Z]+$/.test(normalized)) {
    throw new Error(`Invalid letters for position arithmetic: ${letters}`);
  }
  return [...normalized].map(letterPosition);
}

export function aggregateOrdinaryPositions(
  letters: string,
  aggregate: PositionAggregate,
): number {
  const positions = ordinaryPositions(letters);
  const result = aggregate === "SUM"
    ? positions.reduce((sum, value) => sum + value, 0)
    : positions.reduce((product, value) => product * value, 1);
  if (!Number.isSafeInteger(result) || result < 1 || result > 9999) {
    throw new Error(`Unsafe mixed position aggregate: ${result}`);
  }
  return result;
}

export function aggregateToLetterWithoutWrap(
  letters: string,
  aggregate: PositionAggregate,
): string | null {
  const value = aggregateOrdinaryPositions(letters, aggregate);
  return value >= 1 && value <= 26 ? letterFromPosition(value) : null;
}

export function applyWholeNumberOperation(
  input: number,
  operation: WholeNumberOperation,
  amount: number,
): number | null {
  if (!Number.isSafeInteger(input) || input < 1 || input > 9999) return null;
  if (!Number.isSafeInteger(amount) || amount < 1 || amount > 100) return null;
  const output = operation === "ADD" ? input + amount : input - amount;
  return Number.isSafeInteger(output) && output >= 1 && output <= 9999 ? output : null;
}

export function applyLetterShift(letter: string, shift: number): string | null {
  const normalized = letter.trim().toUpperCase();
  if (!/^[A-Z]$/.test(normalized)) return null;
  if (!Number.isSafeInteger(shift) || shift === 0 || Math.abs(shift) > 12) return null;
  return shiftLetter(normalized, shift);
}

export function positionCalculationTrace(letters: string): string {
  return [...letters.trim().toUpperCase()]
    .map((letter) => `${letter}=${letterPosition(letter)}`)
    .join(", ");
}
