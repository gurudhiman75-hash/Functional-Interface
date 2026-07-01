import {
  QUANT_V4_EDUCATION_CONTRACT_VERSION,
  type QuantV4EducationReferenceSet,
  type QuantV4EducationTraceability,
} from "./contracts";

const REFERENCE_KEYS = [
  "strategyIds",
  "shortcutIds",
  "trapIds",
  "realismIds",
  "terminologyIds",
  "pedagogyRuleIds",
] as const;

function stringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const normalized = value
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);
  return normalized.length ? [...new Set(normalized)] : undefined;
}

function readSource(input: unknown): Record<string, unknown> {
  if (typeof input !== "object" || input === null) return {};
  const record = input as Record<string, unknown>;
  const nested = record.education;
  if (typeof nested === "object" && nested !== null) {
    return { ...record, ...(nested as Record<string, unknown>) };
  }
  return record;
}

export function normalizeQuantV4EducationReferences(input: unknown): QuantV4EducationReferenceSet {
  const source = readSource(input);
  const references: Record<string, readonly string[] | undefined> = {};
  for (const key of REFERENCE_KEYS) {
    references[key] = stringArray(source[key]);
  }
  return references as QuantV4EducationReferenceSet;
}

export function buildQuantV4EducationTraceability(input: unknown): QuantV4EducationTraceability | undefined {
  const references = normalizeQuantV4EducationReferences(input);
  const hasAnyReference = REFERENCE_KEYS.some((key) => (references[key]?.length ?? 0) > 0);
  if (!hasAnyReference) return undefined;
  return {
    educationContractVersion: QUANT_V4_EDUCATION_CONTRACT_VERSION,
    references,
  };
}

export function mergeQuantV4EducationTraceability<T extends Record<string, unknown>>(
  traceability: T,
  educationInput: unknown,
): T & { educationTraceability?: QuantV4EducationTraceability } {
  const educationTraceability = buildQuantV4EducationTraceability(educationInput);
  if (!educationTraceability) return traceability;
  return {
    ...traceability,
    educationTraceability,
  };
}
