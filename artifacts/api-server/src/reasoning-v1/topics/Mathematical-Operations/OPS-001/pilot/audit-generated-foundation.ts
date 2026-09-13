import { arithmeticTrace, relationTrace } from "./approved-teaching-helpers";
import type { OpsPilotOption } from "./representative-pilots";

export const AUDIT_OPERATOR_PAIRS = [
  ["+", "−"],
  ["+", "×"],
  ["+", "÷"],
  ["−", "×"],
  ["−", "÷"],
  ["×", "÷"],
] as const;

export type AuditOperatorPair = (typeof AUDIT_OPERATOR_PAIRS)[number];

export const AUDIT_DOUBLE_PAIRINGS: readonly (readonly [AuditOperatorPair, AuditOperatorPair])[] = [
  [["+", "−"], ["×", "÷"]],
  [["+", "×"], ["−", "÷"]],
  [["+", "÷"], ["−", "×"]],
] as const;

export function auditRotate<T>(values: readonly T[], offset: number): T[] {
  const normalized = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(normalized), ...values.slice(0, normalized)];
}

export function auditMix(seed: number, salt: number): number {
  let value = (seed ^ Math.imul(salt + 1, 0x9e3779b1)) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x85ebca6b) >>> 0;
  value ^= value >>> 13;
  value = Math.imul(value, 0xc2b2ae35) >>> 0;
  value ^= value >>> 16;
  return value >>> 0;
}

export function auditInt(seed: number, salt: number, minimum: number, maximum: number): number {
  return minimum + (auditMix(seed, salt) % (maximum - minimum + 1));
}

export function auditIntegerAnswer(expression: string): string | null {
  try {
    const value = arithmeticTrace(expression).value;
    if (!/^-?\d+$/u.test(value)) return null;
    const numeric = Number(value);
    if (!Number.isSafeInteger(numeric) || Math.abs(numeric) > 10000) return null;
    return value;
  } catch {
    return null;
  }
}

export function auditRelationTrue(statement: string): boolean {
  try {
    return relationTrace(statement).truth;
  } catch {
    return false;
  }
}

export function auditPairText(pair: AuditOperatorPair): string {
  return `${pair[0]} ↔ ${pair[1]}`;
}

export function auditDistinctOptions(
  answer: string,
  candidates: readonly { readonly value: string | null; readonly errorLabel: string }[],
  seed: number,
): readonly OpsPilotOption[] | null {
  const wrong: OpsPilotOption[] = [];
  for (const candidate of candidates) {
    if (candidate.value == null || candidate.value === answer) continue;
    if (wrong.some((entry) => entry.value === candidate.value)) continue;
    wrong.push({ value: candidate.value, errorLabel: candidate.errorLabel });
    if (wrong.length === 3) break;
  }
  if (wrong.length !== 3) return null;
  return auditRotate([{ value: answer, errorLabel: null }, ...wrong], seed);
}

export function auditReplaceTokens(source: string, mapping: readonly (readonly [string, string])[]): string {
  const placeholders = mapping.map((_, index) => `__OPS_${index}__`);
  let transformed = source;
  mapping.forEach(([from], index) => {
    transformed = transformed.split(from).join(placeholders[index]!);
  });
  mapping.forEach(([, to], index) => {
    transformed = transformed.split(placeholders[index]!).join(to);
  });
  return transformed;
}

export function auditMappingKey(mapping: readonly (readonly [string, string])[]): string {
  return mapping.map(([display, meaning]) => `${display} means ${meaning}`).join(", ");
}

export function auditGeneratedMetadata(
  seed: number,
  sourceSeed: number,
  extra: Record<string, string | number | boolean> = {},
) {
  return {
    teachingExplanationVersion: "V3_APPROVED",
    teachingTraceVerified: true,
    requestedSeed: seed,
    sourceSeed,
    generatedAuditState: true,
    ...extra,
  } as const;
}
