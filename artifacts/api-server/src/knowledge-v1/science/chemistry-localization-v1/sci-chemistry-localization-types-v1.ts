export const SCI_CHEMISTRY_LOCALIZATION_V1 = "SCI-CHEMISTRY-LOCALIZATION-V1" as const;

export type ChemistryLocaleV1 = "en" | "hi" | "pa";

export type ChemistryLocalizationMetaV1 = Readonly<{
  version: typeof SCI_CHEMISTRY_LOCALIZATION_V1;
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

export type ChemistryLocalizedQuestionV1 = Readonly<{
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
  locale: ChemistryLocaleV1;
  localizationV1: ChemistryLocalizationMetaV1;
}>;

export type ChemistryLocalizedSurfaceV1 = Readonly<{
  stem: string;
  options: readonly [string, string, string, string];
  explanation: string;
}>;
