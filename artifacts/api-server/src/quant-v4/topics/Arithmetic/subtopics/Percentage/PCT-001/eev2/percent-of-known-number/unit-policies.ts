import type { EntityRealismPolicy } from "./entity-policies";
import { formatNumberForPresentation } from "./number-formatting";

export interface RealisticValueDisplay {
  display: string;
  math: string;
  numericDisplay: number;
  approximate: boolean;
}

export function presentRealisticValue(
  value: number,
  policy: EntityRealismPolicy,
): RealisticValueDisplay {
  const mustRoundCount =
    policy.integerPresentation && !Number.isInteger(value);
  const formatted = formatNumberForPresentation(
    mustRoundCount ? Math.round(value) : value,
  );
  const numericDisplay = formatted.numericValue;
  const approximate =
    mustRoundCount || formatted.approximate;
  const prefix = approximate ? "about " : "";
  const mathPrefix = approximate ? "\\approx " : "";
  const displayedNumber = formatted.grouped;

  if (policy.entityKind === "MONEY") {
    return {
      display: `${prefix}₹${displayedNumber}`,
      math: `${mathPrefix}\\text{₹}${displayedNumber}`,
      numericDisplay,
      approximate,
    };
  }

  if (policy.entityKind === "ABSTRACT") {
    return {
      display: `${prefix}${displayedNumber}`,
      math: `${mathPrefix}${displayedNumber}`,
      numericDisplay,
      approximate,
    };
  }

  const label =
    Math.abs(numericDisplay) === 1
      ? policy.singularLabel
      : policy.pluralLabel;
  return {
    display: `${prefix}${displayedNumber} ${label}`,
    math: `${mathPrefix}${displayedNumber}\\text{ ${label}}`,
    numericDisplay,
    approximate,
  };
}
