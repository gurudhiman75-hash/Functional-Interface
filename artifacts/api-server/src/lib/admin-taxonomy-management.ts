export const TAXONOMY_NODE_TYPES = [
  "subject",
  "section",
  "topic",
  "subtopic",
  "chapter",
  "canonical_problem",
  "skill",
] as const;

export type TaxonomyNodeType = (typeof TAXONOMY_NODE_TYPES)[number];

export type TaxonomyExamMappingInput = {
  examVersionId: string;
  displayNameOverride: string | null;
  targetCoverage: number | null;
  sortOrder: number;
  isActive: boolean;
};

export type TaxonomyNodeInput = {
  code: string;
  nodeType: TaxonomyNodeType;
  name: string;
  description: string | null;
  isActive: boolean;
  parentIds: string[];
  examMappings: TaxonomyExamMappingInput[];
  reason: string;
};

export class TaxonomyManagementError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 400,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "TaxonomyManagementError";
  }
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function uniqueStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(asString).filter(Boolean))];
}

export function normalizeTaxonomyCode(value: unknown): string {
  return asString(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

export function normalizeTaxonomyNodeType(value: unknown): TaxonomyNodeType {
  const normalized = asString(value).toLowerCase();
  if (!TAXONOMY_NODE_TYPES.includes(normalized as TaxonomyNodeType)) {
    throw new TaxonomyManagementError(
      "INVALID_TAXONOMY_NODE_TYPE",
      `Taxonomy type must be one of: ${TAXONOMY_NODE_TYPES.join(", ")}.`,
    );
  }
  return normalized as TaxonomyNodeType;
}

function normalizeOptionalText(value: unknown, maxLength: number): string | null {
  const normalized = asString(value);
  if (!normalized) return null;
  if (normalized.length > maxLength) {
    throw new TaxonomyManagementError(
      "TAXONOMY_TEXT_TOO_LONG",
      `Taxonomy text cannot exceed ${maxLength} characters.`,
    );
  }
  return normalized;
}

function normalizeInteger(
  value: unknown,
  options: { minimum: number; maximum: number; nullable?: boolean },
): number | null {
  if ((value === null || value === undefined || value === "") && options.nullable) return null;
  const numeric = Number(value);
  if (!Number.isInteger(numeric) || numeric < options.minimum || numeric > options.maximum) {
    throw new TaxonomyManagementError(
      "INVALID_TAXONOMY_NUMBER",
      `Value must be an integer from ${options.minimum} to ${options.maximum}.`,
    );
  }
  return numeric;
}

export function normalizeTaxonomyMappings(value: unknown): TaxonomyExamMappingInput[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.map((raw, index) => {
    const record = raw && typeof raw === "object" && !Array.isArray(raw)
      ? raw as Record<string, unknown>
      : {};
    const examVersionId = asString(record.examVersionId);
    if (!examVersionId) {
      throw new TaxonomyManagementError(
        "EXAM_VERSION_REQUIRED",
        `Exam mapping ${index + 1} requires an exam version.`,
      );
    }
    if (seen.has(examVersionId)) {
      throw new TaxonomyManagementError(
        "DUPLICATE_EXAM_MAPPING",
        "Each exam version may be mapped only once per taxonomy node.",
      );
    }
    seen.add(examVersionId);
    return {
      examVersionId,
      displayNameOverride: normalizeOptionalText(record.displayNameOverride, 160),
      targetCoverage: normalizeInteger(record.targetCoverage, {
        minimum: 0,
        maximum: 100000,
        nullable: true,
      }),
      sortOrder: normalizeInteger(record.sortOrder ?? index, {
        minimum: 0,
        maximum: 100000,
      }) ?? index,
      isActive: record.isActive !== false,
    };
  });
}

export function normalizeTaxonomyNodeInput(value: unknown): TaxonomyNodeInput {
  const record = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  const code = normalizeTaxonomyCode(record.code);
  const name = asString(record.name);
  const reason = asString(record.reason);

  if (!/^[A-Z][A-Z0-9_]{2,95}$/.test(code)) {
    throw new TaxonomyManagementError(
      "INVALID_TAXONOMY_CODE",
      "Code must start with a letter and contain 3–96 uppercase letters, numbers or underscores.",
    );
  }
  if (name.length < 2 || name.length > 160) {
    throw new TaxonomyManagementError(
      "INVALID_TAXONOMY_NAME",
      "Name must contain 2–160 characters.",
    );
  }
  if (reason.length < 4 || reason.length > 500) {
    throw new TaxonomyManagementError(
      "TAXONOMY_REASON_REQUIRED",
      "An audit reason of 4–500 characters is required.",
    );
  }

  return {
    code,
    nodeType: normalizeTaxonomyNodeType(record.nodeType),
    name,
    description: normalizeOptionalText(record.description, 2000),
    isActive: record.isActive !== false,
    parentIds: uniqueStrings(record.parentIds),
    examMappings: normalizeTaxonomyMappings(record.examMappings),
    reason,
  };
}

export function coveragePercent(actual: number, target: number | null): number | null {
  if (target === null || target <= 0) return null;
  return Math.min(999, Math.round((actual / target) * 100));
}
