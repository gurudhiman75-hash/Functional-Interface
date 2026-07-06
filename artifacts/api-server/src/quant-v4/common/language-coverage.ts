import { getQuantV4EntityResolver } from "./entity-context-map";
import type { EntityReference } from "./entity-types";

type QuantV4Language = "en" | "hi" | "pa";
type QuantV4NonEnglishLanguage = Exclude<QuantV4Language, "en">;
type EntityBackedVariables = Record<string, number | string | EntityReference>;

type LocalizedQuestionLanguageRegistry = Record<
  string,
  Partial<Record<QuantV4NonEnglishLanguage, readonly string[]>>
>;

const LOCALIZED_QUESTION_LANGUAGE_REGISTRY: LocalizedQuestionLanguageRegistry = {
  "PCT-001": {
    hi: [
      ...[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900].flatMap(
        (offset) => [1, 2, 3, 4, 9].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`),
      ),
      ...[0, 100, 200, 300, 400].flatMap((offset) =>
        [5, 6, 7, 8].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`),
      ),
      ...[0, 100, 200, 300, 400].flatMap((offset) =>
        [10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`),
      ),
      ...[0, 100, 200, 300, 400].flatMap((offset) =>
        [20, 21, 22, 23, 24, 25, 26, 27].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`),
      ),
      ...[0, 100, 200, 300, 400].flatMap((offset) =>
        [28, 29, 30, 31, 32, 33, 34, 35].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`),
      ),
      ...[0, 100, 200, 300, 400].flatMap((offset) =>
        [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`),
      ),
      ...[0, 100, 200, 300, 400].flatMap((offset) =>
        [48, 49, 50, 51, 52, 53, 54, 55].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`),
      ),
    ],
    pa: [
      ...[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900].flatMap(
        (offset) => [1, 2, 3, 4, 9].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`),
      ),
      ...[0, 100, 200, 300, 400].flatMap((offset) =>
        [5, 6, 7, 8].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`),
      ),
      ...[0, 100, 200, 300, 400].flatMap((offset) =>
        [10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`),
      ),
      ...[0, 100, 200, 300, 400].flatMap((offset) =>
        [20, 21, 22, 23, 24, 25, 26, 27].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`),
      ),
      ...[0, 100, 200, 300, 400].flatMap((offset) =>
        [28, 29, 30, 31, 32, 33, 34, 35].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`),
      ),
      ...[0, 100, 200, 300, 400].flatMap((offset) =>
        [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`),
      ),
      ...[0, 100, 200, 300, 400].flatMap((offset) =>
        [48, 49, 50, 51, 52, 53, 54, 55].map((suffix) => `PCT-QL-${String(offset + suffix).padStart(3, "0")}`),
      ),
    ],
  },
  "PCT-002": {
    hi: Array.from({ length: 150 }, (_, index) =>
      `PCT-QL-${String(index + 1).padStart(3, "0")}`,
    ),
    pa: Array.from({ length: 150 }, (_, index) =>
      `PCT-QL-${String(index + 1).padStart(3, "0")}`,
    ),
  },
  "PCT-003": {
    hi: Array.from({ length: 150 }, (_, index) =>
      `PCT-QL-${String(index + 1).padStart(3, "0")}`,
    ),
    pa: Array.from({ length: 150 }, (_, index) =>
      `PCT-QL-${String(index + 1).padStart(3, "0")}`,
    ),
  },
  "PCT-004": {
    hi: Array.from({ length: 150 }, (_, index) =>
      `PCT-QL-${String(index + 1).padStart(3, "0")}`,
    ),
    pa: Array.from({ length: 150 }, (_, index) =>
      `PCT-QL-${String(index + 1).padStart(3, "0")}`,
    ),
  },
  "PCT-005": {
    hi: Array.from({ length: 150 }, (_, index) =>
      `PCT-QL-${String(index + 1).padStart(3, "0")}`,
    ),
    pa: Array.from({ length: 150 }, (_, index) =>
      `PCT-QL-${String(index + 1).padStart(3, "0")}`,
    ),
  },
  "PCT-006": {
    hi: Array.from({ length: 500 }, (_, index) =>
      `PCT-QL-${String(index + 1).padStart(3, "0")}`,
    ),
    pa: Array.from({ length: 500 }, (_, index) =>
      `PCT-QL-${String(index + 1).padStart(3, "0")}`,
    ),
  },
  "PCT-007": {
    hi: Array.from({ length: 500 }, (_, index) =>
      `PCT-QL-${String(index + 1).padStart(3, "0")}`,
    ),
    pa: Array.from({ length: 500 }, (_, index) =>
      `PCT-QL-${String(index + 1).padStart(3, "0")}`,
    ),
  },
  "RAP-001": {
    hi: [
      "RAP-QL-001",
      "RAP-QL-101",
      "RAP-QL-201",
      "RAP-QL-301",
      "RAP-QL-401",
      "RAP-QL-002",
      "RAP-QL-102",
      "RAP-QL-202",
      "RAP-QL-302",
      "RAP-QL-402",
      "RAP-QL-502",
      "RAP-QL-602",
      "RAP-QL-702",
      "RAP-QL-802",
      "RAP-QL-902",
      "RAP-QL-1002",
      "RAP-QL-1102",
      "RAP-QL-1202",
      "RAP-QL-1302",
      "RAP-QL-1402",
      "RAP-QL-1502",
      "RAP-QL-1602",
      "RAP-QL-1702",
      "RAP-QL-1802",
      "RAP-QL-1902",
      "RAP-QL-003",
      "RAP-QL-103",
      "RAP-QL-203",
      "RAP-QL-303",
      "RAP-QL-403",
      "RAP-QL-004",
      "RAP-QL-104",
      "RAP-QL-204",
      "RAP-QL-304",
      "RAP-QL-404",
      "RAP-QL-006",
      "RAP-QL-106",
      "RAP-QL-206",
      "RAP-QL-306",
      "RAP-QL-406",
      "RAP-QL-008",
      "RAP-QL-108",
      "RAP-QL-208",
      "RAP-QL-308",
      "RAP-QL-408",
      "RAP-QL-009",
      "RAP-QL-109",
      "RAP-QL-209",
      "RAP-QL-309",
      "RAP-QL-409",
      "RAP-QL-011",
      "RAP-QL-111",
      "RAP-QL-211",
      "RAP-QL-311",
      "RAP-QL-411",
      "RAP-QL-012",
      "RAP-QL-112",
      "RAP-QL-212",
      "RAP-QL-312",
      "RAP-QL-412",
      "RAP-QL-013",
      "RAP-QL-113",
      "RAP-QL-213",
      "RAP-QL-313",
      "RAP-QL-413",
      "RAP-QL-014",
      "RAP-QL-114",
      "RAP-QL-214",
      "RAP-QL-314",
      "RAP-QL-414",
      "RAP-QL-015",
      "RAP-QL-115",
      "RAP-QL-215",
      "RAP-QL-315",
      "RAP-QL-415",
      "RAP-QL-016",
      "RAP-QL-116",
      "RAP-QL-216",
      "RAP-QL-316",
      "RAP-QL-416",
      "RAP-QL-017",
      "RAP-QL-018",
      "RAP-QL-019",
      "RAP-QL-020",
      "RAP-QL-021",
      "RAP-QL-022",
      "RAP-QL-023",
      "RAP-QL-024",
      "RAP-QL-026",
      "RAP-QL-027",
      "RAP-QL-028",
      "RAP-QL-029",
      "RAP-QL-030",
      "RAP-QL-032",
    ],
    pa: [
      "RAP-QL-001",
      "RAP-QL-101",
      "RAP-QL-201",
      "RAP-QL-301",
      "RAP-QL-401",
      "RAP-QL-002",
      "RAP-QL-102",
      "RAP-QL-202",
      "RAP-QL-302",
      "RAP-QL-402",
      "RAP-QL-502",
      "RAP-QL-602",
      "RAP-QL-702",
      "RAP-QL-802",
      "RAP-QL-902",
      "RAP-QL-1002",
      "RAP-QL-1102",
      "RAP-QL-1202",
      "RAP-QL-1302",
      "RAP-QL-1402",
      "RAP-QL-1502",
      "RAP-QL-1602",
      "RAP-QL-1702",
      "RAP-QL-1802",
      "RAP-QL-1902",
      "RAP-QL-003",
      "RAP-QL-103",
      "RAP-QL-203",
      "RAP-QL-303",
      "RAP-QL-403",
      "RAP-QL-004",
      "RAP-QL-104",
      "RAP-QL-204",
      "RAP-QL-304",
      "RAP-QL-404",
      "RAP-QL-006",
      "RAP-QL-106",
      "RAP-QL-206",
      "RAP-QL-306",
      "RAP-QL-406",
      "RAP-QL-008",
      "RAP-QL-108",
      "RAP-QL-208",
      "RAP-QL-308",
      "RAP-QL-408",
      "RAP-QL-009",
      "RAP-QL-109",
      "RAP-QL-209",
      "RAP-QL-309",
      "RAP-QL-409",
      "RAP-QL-011",
      "RAP-QL-111",
      "RAP-QL-211",
      "RAP-QL-311",
      "RAP-QL-411",
      "RAP-QL-012",
      "RAP-QL-112",
      "RAP-QL-212",
      "RAP-QL-312",
      "RAP-QL-412",
      "RAP-QL-013",
      "RAP-QL-113",
      "RAP-QL-213",
      "RAP-QL-313",
      "RAP-QL-413",
      "RAP-QL-014",
      "RAP-QL-114",
      "RAP-QL-214",
      "RAP-QL-314",
      "RAP-QL-414",
      "RAP-QL-015",
      "RAP-QL-115",
      "RAP-QL-215",
      "RAP-QL-315",
      "RAP-QL-415",
      "RAP-QL-016",
      "RAP-QL-116",
      "RAP-QL-216",
      "RAP-QL-316",
      "RAP-QL-416",
      "RAP-QL-017",
      "RAP-QL-018",
      "RAP-QL-019",
      "RAP-QL-020",
      "RAP-QL-021",
      "RAP-QL-022",
      "RAP-QL-023",
      "RAP-QL-024",
      "RAP-QL-026",
      "RAP-QL-027",
      "RAP-QL-028",
      "RAP-QL-029",
      "RAP-QL-030",
      "RAP-QL-032",
    ],
  },
};

function isEntityReference(value: unknown): value is EntityReference {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    "categoryId" in value &&
    "entityId" in value
  );
}

function getLocalizedQuestionLanguageIdSet(
  packageId: string,
  language: QuantV4NonEnglishLanguage,
) {
  return new Set(LOCALIZED_QUESTION_LANGUAGE_REGISTRY[packageId]?.[language] ?? []);
}

export function isQlLocalized(
  packageId: string,
  qlId: string,
  language: QuantV4Language,
) {
  if (language === "en") return true;
  return getLocalizedQuestionLanguageIdSet(packageId, language).has(qlId);
}

export function getLocalizedQuestionLanguageIds(
  packageId: string,
  language: QuantV4Language,
  englishIds: readonly string[],
) {
  if (language === "en") return [...englishIds];
  const localizedSet = getLocalizedQuestionLanguageIdSet(packageId, language);
  return englishIds.filter((qlId) => localizedSet.has(qlId));
}

export function getLocalizedQuestionLanguageRegistry(packageId: string) {
  return LOCALIZED_QUESTION_LANGUAGE_REGISTRY[packageId] ?? {};
}

export function resolveEntityLabels<TVariables extends EntityBackedVariables>(
  variables: TVariables,
  language: QuantV4Language,
  labelFields: readonly (keyof TVariables & string)[],
  normalizeEnglishLabel?: (resolvedValue: string, field: keyof TVariables & string) => string,
): TVariables {
  const resolved = { ...variables };
  const resolver = getQuantV4EntityResolver();

  for (const field of labelFields) {
    const value = resolved[field];
    if (!isEntityReference(value)) continue;

    const resolvedValue = resolver.resolveEntity(value.categoryId, value.entityId, language);
    resolved[field] =
      language === "en" && normalizeEnglishLabel
        ? normalizeEnglishLabel(resolvedValue, field)
        : resolvedValue;
  }

  return resolved;
}
