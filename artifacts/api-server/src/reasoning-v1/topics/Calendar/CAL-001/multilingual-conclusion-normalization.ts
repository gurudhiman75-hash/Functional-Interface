import type { CalendarQuestionPackage } from "./types.ts";

export function normalizeCalendarMultilingualConclusion(
  pkg: CalendarQuestionPackage,
): CalendarQuestionPackage {
  if (pkg.locale === "en-IN") return pkg;
  const answer = pkg.options[pkg.answerIndex]?.display;
  if (!answer) throw new Error(`${pkg.prototypeAuthority}: localized answer display is missing.`);

  if (pkg.outputType === "CLASSIFICATION") {
    return {
      ...pkg,
      explanation: {
        ...pkg.explanation,
        conclusion: pkg.locale === "hi-IN"
          ? `अतः सही विकल्प है: ${answer}।`
          : `ਇਸ ਲਈ ਸਹੀ ਵਿਕਲਪ ਹੈ: ${answer}।`,
      },
    };
  }

  if (pkg.outputType === "WEEKDAY_SET") {
    return {
      ...pkg,
      explanation: {
        ...pkg.explanation,
        conclusion: pkg.locale === "hi-IN"
          ? `अतः सही उत्तर ${answer} हैं।`
          : `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹਨ।`,
      },
    };
  }

  return pkg;
}
