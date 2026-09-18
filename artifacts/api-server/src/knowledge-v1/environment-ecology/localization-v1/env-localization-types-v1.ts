import type { KnowledgeV1Difficulty } from "../../types";

export type EnvLocaleV1 = "en" | "hi" | "pa";

export type EnvLocalizedQuestionV1 = {
  questionId: string;
  chapterId: "ENV-001";
  cpId: string;
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  reviewOnly: true;
  runtimeRegistered: false;
  locale: EnvLocaleV1;
  localizationV1: {
    version: "ENV-LOCALIZATION-V1";
    englishQuestionId: string;
    semanticInvariant: true;
    cpInvariant: true;
    qlInvariant: true;
    difficultyInvariant: true;
    sourceInvariant: true;
    optionOrderInvariant: true;
    correctIndexInvariant: true;
    reviewOnly: true;
  };
};

export const ENV_LOCALIZATION_V1 = "ENV-LOCALIZATION-V1" as const;
