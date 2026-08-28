import {
  buildPnc002Cp010LocalizedPresentation as buildReviewedPresentation,
  PNC_002_CP010_LOCALIZATION_CANDIDATE,
} from "./localization-cp010-reviewed";
import type { PncStudentSourcePackage } from "./student-presentation";
import type {
  PncLocalizedStudentPresentation,
  PncStudentLocale,
} from "./localization-types";

export { PNC_002_CP010_LOCALIZATION_CANDIDATE };

function mathTokens(value: string): string[] {
  return [
    ...value.matchAll(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g),
  ].map((match) => match[0]!);
}

function formulaPhrase(values: readonly string[], locale: PncStudentLocale): string {
  if (!values.length) return "";
  return locale === "hi-IN"
    ? ` यहाँ ${values.join(" तथा ")} प्राप्त होता है।`
    : ` ਇੱਥੇ ${values.join(" ਅਤੇ ")} ਮਿਲਦਾ ਹੈ।`;
}

function stripStepPrefix(line: string): string {
  return line.replace(/^\d+\.\s+\*\*[^*]+:\*\*\s*/, "");
}

function stepLabel(locale: PncStudentLocale, index: number, total: number): string {
  if (locale === "hi-IN") {
    if (index === 0) return "शर्त समझें";
    if (index === 1) return "योजना बनाएँ";
    if (index === total - 1) return "उत्तर जाँचें";
    return `गणना चरण ${index - 1}`;
  }
  if (index === 0) return "ਸ਼ਰਤ ਸਮਝੋ";
  if (index === 1) return "ਯੋਜਨਾ ਬਣਾਓ";
  if (index === total - 1) return "ਉੱਤਰ ਜਾਂਚੋ";
  return `ਹਿਸਾਬ ਦਾ ਪੜਾਅ ${index - 1}`;
}

function rebuildStepLine(
  line: string,
  locale: PncStudentLocale,
  index: number,
  total: number,
  answerLabel: string,
): string {
  const label = stepLabel(locale, index, total);
  if (index <= 1) {
    return `${index + 1}. **${label}:** ${stripStepPrefix(line)}`;
  }
  const formula = formulaPhrase(mathTokens(line), locale);
  if (index === total - 1) {
    const text = locale === "hi-IN"
      ? `सभी चरणों की गणना मिलाने पर सही उत्तर ${answerLabel} है।`
      : `ਸਾਰੇ ਪੜਾਵਾਂ ਦਾ ਹਿਸਾਬ ਮਿਲਾਉਣ ਉੱਤੇ ਸਹੀ ਉੱਤਰ ${answerLabel} ਹੈ।`;
    return `${index + 1}. **${label}:** ${text}${formula}`;
  }
  const text = locale === "hi-IN"
    ? "इस चरण की आवश्यक गणना पूरी कीजिए।"
    : "ਇਸ ਪੜਾਅ ਦਾ ਲੋੜੀਂਦਾ ਹਿਸਾਬ ਪੂਰਾ ਕਰੋ।";
  return `${index + 1}. **${label}:** ${text}${formula}`;
}

export function buildPnc002Cp010LocalizedPresentation(
  source: PncStudentSourcePackage,
  locale: PncStudentLocale,
): PncLocalizedStudentPresentation {
  const reviewed = buildReviewedPresentation(source, locale);
  return {
    ...reviewed,
    explanationSections: reviewed.explanationSections.map((section) => {
      if (section.kind !== "stepByStep") return section;
      const total = section.lines.length;
      return {
        ...section,
        lines: section.lines.map((line, index) => rebuildStepLine(
          line,
          locale,
          index,
          total,
          reviewed.answerLabel,
        )),
      };
    }),
  };
}
