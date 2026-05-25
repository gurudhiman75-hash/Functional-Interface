export type MigratedQuantV2Domain =
  | "quant-v2-percentage"
  | "quant-v2-profit-loss"
  | "quant-v2-interest";

export type MigratedQuantPatternLike = {
  id?: string;
  name?: string;
  label?: string;
  topic?: string;
  subtopic?: string;
  type?: string;
  generationDomain?: string;
};

export const LEGACY_MIGRATED_QUANT_ERROR =
  "Legacy quant generation is disabled for Percentage, Profit/Loss, and Interest. Use Quant V2.";

const PERCENTAGE_ALIASES = new Set([
  "percentage",
  "percentages",
  "percent",
]);

const PROFIT_LOSS_ALIASES = new Set([
  "profit loss",
  "profit loss discount",
  "profit loss and discount",
]);

const INTEREST_ALIASES = new Set([
  "interest",
  "simple interest",
  "compound interest",
  "si ci",
  "si and ci",
  "simple and compound interest",
  "ब्याज",
  "साधारण ब्याज",
  "चक्रवृद्धि ब्याज",
]);

export function normalizeMigratedQuantAlias(value: unknown) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/&/gu, " and ")
    .replace(/,/gu, " ")
    .replace(/[_-]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

export function resolveMigratedQuantV2DomainFromAlias(
  value: unknown,
): MigratedQuantV2Domain | undefined {
  const normalized =
    normalizeMigratedQuantAlias(value);

  if (PERCENTAGE_ALIASES.has(normalized)) {
    return "quant-v2-percentage";
  }

  if (PROFIT_LOSS_ALIASES.has(normalized)) {
    return "quant-v2-profit-loss";
  }

  if (INTEREST_ALIASES.has(normalized)) {
    return "quant-v2-interest";
  }

  return undefined;
}

export function resolveMigratedQuantV2Domain(
  pattern: MigratedQuantPatternLike,
): MigratedQuantV2Domain | undefined {
  if (
    pattern.generationDomain ===
      "quant-v2-percentage" ||
    pattern.generationDomain ===
      "quant-v2-profit-loss" ||
    pattern.generationDomain ===
      "quant-v2-interest"
  ) {
    return pattern.generationDomain;
  }

  const fields = [
    pattern.topic,
    pattern.subtopic,
    pattern.type,
    pattern.id,
    pattern.name,
    pattern.label,
  ];

  for (const field of fields) {
    const domain =
      resolveMigratedQuantV2DomainFromAlias(field);
    if (domain) {
      return domain;
    }
  }

  return undefined;
}

export function assertLegacyQuantNotMigrated(
  pattern: MigratedQuantPatternLike,
) {
  if (resolveMigratedQuantV2Domain(pattern)) {
    throw new Error(LEGACY_MIGRATED_QUANT_ERROR);
  }
}
