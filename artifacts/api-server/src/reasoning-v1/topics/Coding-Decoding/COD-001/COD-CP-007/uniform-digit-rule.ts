import type { DecimalDigit, UniformDigitEvidence } from "./uniform-digit-types";

const DIGIT_PATTERN = /^\d+$/u;

export function assertDigitSequence(value: string, label = "digit sequence"): void {
  if (!DIGIT_PATTERN.test(value)) throw new Error(`${label} must contain only decimal digits`);
}

export function decimalDigits(value: string): DecimalDigit[] {
  assertDigitSequence(value);
  return [...value] as DecimalDigit[];
}

export function translateDigit(digit: DecimalDigit, shift: number): DecimalDigit {
  if (!Number.isInteger(shift)) throw new Error(`Shift must be an integer, received ${shift}`);
  const value = (Number(digit) + shift + 100) % 10;
  return String(value) as DecimalDigit;
}

export function translateDigitSequence(source: string, shift: number): string {
  return decimalDigits(source).map((digit) => translateDigit(digit, shift)).join("");
}

export function inverseTranslateDigitSequence(code: string, shift: number): string {
  return translateDigitSequence(code, -shift);
}

export function digitTranslationTrace(source: string, shift: number): string[] {
  return decimalDigits(source).map((digit) => `${digit}→${translateDigit(digit, shift)}`);
}

export function wrapCount(source: string, shift: number): number {
  return decimalDigits(source).filter((digit) => Number(digit) + shift >= 10 || Number(digit) + shift < 0).length;
}

export function hasRepeatedDigit(value: string): boolean {
  return new Set(value).size < value.length;
}

export function inferUniformShiftSurvivors(evidence: readonly UniformDigitEvidence[]): number[] {
  if (evidence.length === 0) return [];
  return Array.from({ length: 10 }, (_, shift) => shift).filter((shift) => evidence.every(({ source, code }) => {
    if (source.length !== code.length) return false;
    try {
      return translateDigitSequence(source, shift) === code;
    } catch {
      return false;
    }
  }));
}

export function inferReversedUniformShiftSurvivors(evidence: readonly UniformDigitEvidence[]): number[] {
  if (evidence.length === 0) return [];
  return Array.from({ length: 10 }, (_, shift) => shift).filter((shift) => evidence.every(({ source, code }) => {
    if (source.length !== code.length) return false;
    try {
      return translateDigitSequence([...source].reverse().join(""), shift) === code;
    } catch {
      return false;
    }
  }));
}

export function inferWholeNumberDelta(evidence: readonly UniformDigitEvidence[]): bigint | null {
  if (evidence.length === 0) return null;
  if (evidence.some(({ source, code }) => source.startsWith("0") || code.startsWith("0"))) return null;
  const deltas = evidence.map(({ source, code }) => BigInt(code) - BigInt(source));
  return deltas.every((delta) => delta === deltas[0]) ? deltas[0]! : null;
}

export function inferArbitraryDigitMap(evidence: readonly UniformDigitEvidence[]): Readonly<Record<string, string>> | null {
  const mapping: Record<string, string> = {};
  const inverse: Record<string, string> = {};
  for (const { source, code } of evidence) {
    if (source.length !== code.length) return null;
    assertDigitSequence(source, "source");
    assertDigitSequence(code, "code");
    for (let index = 0; index < source.length; index += 1) {
      const sourceDigit = source[index]!;
      const codeDigit = code[index]!;
      if (mapping[sourceDigit] !== undefined && mapping[sourceDigit] !== codeDigit) return null;
      if (inverse[codeDigit] !== undefined && inverse[codeDigit] !== sourceDigit) return null;
      mapping[sourceDigit] = codeDigit;
      inverse[codeDigit] = sourceDigit;
    }
  }
  return mapping;
}
