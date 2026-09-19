import type { KnowledgeV1Difficulty } from "../../types";

export type PolLocaleV1 = "en" | "hi" | "pa";

export type PolLocalizedQuestionV1 = {
  questionId: string;
  chapterId: "POL-001";
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
  locale: PolLocaleV1;
  localizationV1: {
    version: "POL-LOCALIZATION-V1";
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

export const POL_LOCALIZATION_V1 = "POL-LOCALIZATION-V1" as const;
