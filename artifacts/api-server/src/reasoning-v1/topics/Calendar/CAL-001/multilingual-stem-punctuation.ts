import type { CalendarQuestionPackage } from "./types.ts";

export function finalizeCalendarMultilingualStemPunctuation(
  pkg: CalendarQuestionPackage,
): CalendarQuestionPackage {
  if (pkg.locale === "en-IN") return pkg;
  const stem = `${pkg.stem.trim().replace(/[?.।]+$/u, "")}?`;
  return stem === pkg.stem ? pkg : { ...pkg, stem };
}
