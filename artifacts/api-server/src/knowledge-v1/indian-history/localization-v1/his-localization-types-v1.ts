import type { KnowledgeV1Difficulty } from "../../types";

export type HisLocaleV1 = "en" | "hi" | "pa";

export type HisLocalizedQuestionV1 = {
  questionId: string;
  chapterId: "HIS-001";
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
  locale: HisLocaleV1;
  localizationV1: {
    version: "HIS-LOCALIZATION-V1";
    englishQuestionId: string;
    englishFreeze: "HIS-001-ENGLISH-FREEZE-V1" | "HIS-001-ENGLISH-FREEZE-V2" | "HIS-001-ENGLISH-FREEZE-V3" | "HIS-001-ENGLISH-FREEZE-V4" | "HIS-001-ENGLISH-FREEZE-V5";
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

export type HisNativeOverlayV1 = {
  stem: string;
  optionsByEnglish: Readonly<Record<string, string>>;
  explanation: string;
};

export type HisLocalePairOverlayV1 = {
  hi: HisNativeOverlayV1;
  pa: HisNativeOverlayV1;
};

export const HIS_LOCALIZATION_V1 = "HIS-LOCALIZATION-V1" as const;
export const HIS_ENGLISH_FREEZE_V1 = "HIS-001-ENGLISH-FREEZE-V1" as const;
export const HIS_ENGLISH_FREEZE_V2 = "HIS-001-ENGLISH-FREEZE-V2" as const;
export const HIS_ENGLISH_FREEZE_V3 = "HIS-001-ENGLISH-FREEZE-V3" as const;

export const HIS_ENGLISH_FREEZE_V4 = "HIS-001-ENGLISH-FREEZE-V4" as const;\nexport const HIS_ENGLISH_FREEZE_V5 = "HIS-001-ENGLISH-FREEZE-V5" as const;
