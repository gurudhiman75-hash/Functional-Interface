import type { CalendarQuestionPackage } from "./types.ts";

function requireYear(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`CAL-001 final English stem simplification: missing ${label}.`);
  }
  return value;
}

export function finalizeCalendarEnglishStemSimplification(
  pkg: CalendarQuestionPackage,
): CalendarQuestionPackage {
  if (pkg.locale !== "en-IN") return pkg;

  if (pkg.prototypeAuthority === "CAL-PQL-025") {
    const year = requireYear(pkg.facts.year, "year");
    return {
      ...pkg,
      stem: `How many odd days are there from year 1 through year ${year} in the Gregorian calendar?`,
    };
  }

  if (pkg.prototypeAuthority === "CAL-PQL-032") {
    const firstYear = requireYear(pkg.facts.year, "first year");
    const secondYear = requireYear(pkg.facts.secondYear, "second year");
    return {
      ...pkg,
      stem: `Which option correctly explains whether ${firstYear} and ${secondYear} have the same calendar?`,
    };
  }

  return pkg;
}
