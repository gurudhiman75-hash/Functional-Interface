import type { KnowledgeV1Difficulty } from "../../types";

export type EcoLocaleV1 = "en" | "hi" | "pa";

export type EcoLocalizedQuestionV1 = {
  questionId: string;
  chapterId: "ECO-001";
  cpId: "ECO-CP-001" | "ECO-CP-002" | "ECO-CP-003" | "ECO-CP-004" | "ECO-CP-005" | "ECO-CP-006" | "ECO-CP-007" | "ECO-CP-008" | "ECO-CP-009" | "ECO-CP-010" | "ECO-CP-011" | "ECO-CP-012" | "ECO-CP-013" | "ECO-CP-014" | "ECO-CP-015" | "ECO-CP-016";
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
  locale: EcoLocaleV1;
  localizationV1: {
    version: "ECO-LOCALIZATION-V1";
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

export const ECO_LOCALIZATION_V1 = "ECO-LOCALIZATION-V1" as const;
