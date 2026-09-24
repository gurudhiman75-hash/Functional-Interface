export const SCI_GENERAL_SCIENCE_LOCALIZATION_V1 = "SCI-GENERAL-SCIENCE-LOCALIZATION-V1" as const;

export type GeneralScienceLocaleV1 = "en" | "hi" | "pa";

export type GeneralScienceLocalizationMetaV1 = Readonly<{
  version: typeof SCI_GENERAL_SCIENCE_LOCALIZATION_V1;
  englishQuestionId: string;
  semanticInvariant: true;
  cpInvariant: true;
  qlInvariant: true;
  difficultyInvariant: true;
  sourceInvariant: true;
  optionOrderInvariant: true;
  correctIndexInvariant: true;
  reviewOnly: true;
}>;

export type GeneralScienceLocalizedQuestionV1 = Readonly<{
  questionId: string;
  chapterId: "SCI-001";
  cpId: string;
  qlId: string;
  qlName: string;
  difficulty: "Easy" | "Medium" | "Hard";
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
  locale: GeneralScienceLocaleV1;
  localizationV1: GeneralScienceLocalizationMetaV1;
}>;

export type GeneralScienceNativeSpecV1 = readonly [
  stem: string,
  answer: string,
  distractors: readonly [string,string,string],
  explanation: string
];
