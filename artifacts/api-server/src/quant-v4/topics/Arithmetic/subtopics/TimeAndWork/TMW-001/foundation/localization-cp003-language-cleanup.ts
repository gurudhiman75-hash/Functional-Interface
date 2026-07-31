import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";

function clean(value: string, language: TmwLocalizedLanguage): string {
  if (language === "hi") {
    return value
      .replaceAll("आउटपुट", "उत्पादन")
      .replaceAll("रेफरेंस उत्पादन", "संदर्भ उत्पादन");
  }
  return value;
}

export function cleanTmwCp003LocalizedLanguage(
  question: TmwLocalizedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion {
  return {
    ...question,
    stem: clean(question.stem, language),
    explanation: {
      ...question.explanation,
      opening: clean(question.explanation.opening, language),
      shortcut: {
        title: clean(question.explanation.shortcut.title, language),
        steps: question.explanation.shortcut.steps.map((line) => clean(line, language)),
      },
      commonTrap: {
        ...question.explanation.commonTrap,
        explanation: clean(question.explanation.commonTrap.explanation, language),
      },
      conclusion: clean(question.explanation.conclusion, language),
    },
  };
}
