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
  "PCT-002": {
    hi: Array.from({ length: 150 }, (_, index) =>
      `PCT-QL-${String(index + 1).padStart(3, "0")}`,
    ),
    pa: Array.from({ length: 150 }, (_, index) =>
      `PCT-QL-${String(index + 1).padStart(3, "0")}`,
    ),
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
