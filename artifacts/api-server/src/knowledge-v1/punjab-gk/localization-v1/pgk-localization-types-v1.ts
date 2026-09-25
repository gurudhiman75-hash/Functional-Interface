import type { KnowledgeV1Difficulty } from "../../types";

export type PgkLocaleV1 = "en" | "hi" | "pa";

export type PgkNativeOverlayV1 = Readonly<{
  stem: string;
  options: readonly [string, string, string, string];
  explanation: string;
}>;

export type PgkLocalizedQuestionV1 = {
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  factIds: string[];
  sourceIds: string[];
  sourceFactIds: string[];
  reviewOnly: true;
  runtimeRegistered: false;
  locale: PgkLocaleV1;
  localizationV1: {
    version: "PGK-LOCALIZATION-V1";
    englishQuestionId: string;
    englishCertification: "PGK-001-FINAL-FACTUAL-CERTIFICATION-V1";
    semanticInvariant: true;
    cpInvariant: true;
    qlInvariant: true;
    difficultyInvariant: true;
    factInvariant: true;
    sourceInvariant: true;
    optionOrderInvariant: true;
    correctIndexInvariant: true;
    reviewOnly: true;
  };
};

export const PGK_LOCALIZATION_V1 = "PGK-LOCALIZATION-V1" as const;
export const PGK_ENGLISH_CERTIFICATION_V1 = "PGK-001-FINAL-FACTUAL-CERTIFICATION-V1" as const;
