import type { ClsCp001QlId } from "./cp001-permanent-contracts";
import { generateClsCp001Question } from "./cp001-multilingual-runtime";
import type { ClsCp001Locale } from "./localization/cp001-language-pack";

function naturalizeLearnerLine(line: string, locale: ClsCp001Locale): string {
  if (locale === "hi-IN") {
    return line
      .replaceAll("दूध पिलाने वाले जानवर", "स्तनधारी")
      .replaceAll("दूध पिलाने वाला जानवर है", "एक स्तनधारी है");
  }
  if (locale === "pa-IN") {
    return line
      .replaceAll("ਦੁੱਧ ਪਿਲਾਉਣ ਵਾਲੇ ਜਾਨਵਰ", "ਥਣਧਾਰੀ")
      .replaceAll("ਦੁੱਧ ਪਿਲਾਉਣ ਵਾਲਾ ਜਾਨਵਰ ਹੈ", "ਇੱਕ ਥਣਧਾਰੀ ਹੈ");
  }
  return line;
}

export function toClsCp001LearnerReviewV2<
  T extends ReturnType<typeof generateClsCp001Question>,
>(question: T) {
  const locale = question.metadata.locale as ClsCp001Locale;
  return {
    ...question,
    explanation: {
      coreRule: question.explanation.coreRule.map((line) => naturalizeLearnerLine(line, locale)),
      optionChecks: question.explanation.optionChecks.map((line) => naturalizeLearnerLine(line, locale)),
      examSpeedShortcut: [] as readonly string[],
      commonTraps: [] as readonly string[],
    },
    metadata: {
      ...question.metadata,
      learnerReviewVersion: "cls-cp001-learner-review-v2" as const,
      learnerEditorialVersion: "compact-explanation-natural-language-v2" as const,
    },
  };
}

export function generateClsCp001LearnerReviewV2(
  qlId: ClsCp001QlId,
  locale: ClsCp001Locale = "en-IN",
  seed = 0,
) {
  return toClsCp001LearnerReviewV2(generateClsCp001Question(qlId, locale, seed));
}
