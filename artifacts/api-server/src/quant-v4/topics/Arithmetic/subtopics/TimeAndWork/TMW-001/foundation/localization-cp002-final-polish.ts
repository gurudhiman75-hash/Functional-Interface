import type { TmwCp002SolveMode } from "./cp002-types";
import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";

function copy(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

const destructiveModes: readonly TmwCp002SolveMode[] = [
  "findNetTimeWithDestructiveAgent",
  "findDestructiveTimeFromPositiveAndNetTimes",
  "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes",
];

function naturalize(value: string, language: TmwLocalizedLanguage): string {
  if (language === "hi") {
    return value
      .replaceAll("रिवर्क", "दोबारा काम")
      .replaceAll("रीवर्क", "दोबारा काम")
      .replaceAll("दोबारा काम काम घटाता है", "दोबारा करने के लिए वापस गया काम कुल प्रगति घटाता है")
      .replaceAll("दोबारा काम दर", "दोबारा काम की दर")
      .replaceAll("परिमाण-अंतर", "अंतर")
      .replaceAll("परिमाण", "मान");
  }
  return value
    .replaceAll("ਰੀਵਰਕ", "ਮੁੜ ਕੰਮ")
    .replaceAll("ਮੁੜ ਕੰਮ ਕੰਮ ਘਟਾਉਂਦਾ ਹੈ", "ਮੁੜ ਕਰਨ ਲਈ ਵਾਪਸ ਗਿਆ ਕੰਮ ਕੁੱਲ ਤਰੱਕੀ ਘਟਾਉਂਦਾ ਹੈ")
    .replaceAll("ਮੁੜ ਕੰਮ ਦਰ", "ਮੁੜ ਕੰਮ ਦੀ ਦਰ");
}

export function finalizeTmwCp002LocalizedQuestion(
  question: TmwLocalizedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion {
  const mode = question.solveMode as TmwCp002SolveMode;
  let title = naturalize(question.explanation.shortcut.title, language);
  let shortcutSteps = question.explanation.shortcut.steps.map((line) => naturalize(line, language));
  let trapExplanation = naturalize(question.explanation.commonTrap.explanation, language);
  let conclusion = naturalize(question.explanation.conclusion, language);

  if (destructiveModes.includes(mode)) {
    title = copy(language, "10-सेकंड वापस जाने वाली दर", "10-ਸਕਿੰਟ ਵਾਪਸ ਜਾਣ ਵਾਲੀ ਦਰ");
    shortcutSteps = [copy(
      language,
      "काम पूरा करने वाली दरें जोड़ें, वापस जाने वाली दर घटाएँ और शुद्ध दर का उलटा लें।",
      "ਕੰਮ ਪੂਰਾ ਕਰਨ ਵਾਲੀਆਂ ਦਰਾਂ ਜੋੜੋ, ਵਾਪਸ ਜਾਣ ਵਾਲੀ ਦਰ ਘਟਾਓ ਅਤੇ ਸ਼ੁੱਧ ਦਰ ਦਾ ਉਲਟ ਲਵੋ।",
    )];
  }

  if (mode === "findMissingRateFromSignedNetRate") {
    title = "10-सेकंड +/− दर";
    if (language === "pa") title = "10-ਸਕਿੰਟ +/− ਦਰ";
    shortcutSteps = [copy(
      language,
      "+ और − चिह्न सही रखकर अज्ञात दर को शुद्ध दर के संबंध से अलग करें।",
      "+ ਅਤੇ − ਚਿੰਨ੍ਹ ਸਹੀ ਰੱਖ ਕੇ ਅਣਜਾਣ ਦਰ ਨੂੰ ਸ਼ੁੱਧ ਦਰ ਦੇ ਸੰਬੰਧ ਤੋਂ ਅਲੱਗ ਕਰੋ।",
    )];
  }

  return {
    ...question,
    explanation: {
      ...question.explanation,
      shortcut: {
        title,
        steps: shortcutSteps,
      },
      commonTrap: {
        ...question.explanation.commonTrap,
        explanation: trapExplanation,
      },
      conclusion,
    },
  };
}
