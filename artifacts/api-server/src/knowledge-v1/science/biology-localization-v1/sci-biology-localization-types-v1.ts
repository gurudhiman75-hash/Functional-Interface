export const SCI_BIOLOGY_LOCALIZATION_V1 = "SCI-BIOLOGY-LOCALIZATION-V1" as const;

export type BiologyLocaleV1 = "en" | "hi" | "pa";

export type BiologyLocalizationMetaV1 = Readonly<{
  version: typeof SCI_BIOLOGY_LOCALIZATION_V1;
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

export type BiologyLocalizedQuestionV1 = Readonly<{
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
  locale: BiologyLocaleV1;
  localizationV1: BiologyLocalizationMetaV1;
}>;

export type BiologyNativeSpecV1 = readonly [
  stem: string,
  answer: string,
  distractors: readonly [string,string,string],
  explanation: string,
];
