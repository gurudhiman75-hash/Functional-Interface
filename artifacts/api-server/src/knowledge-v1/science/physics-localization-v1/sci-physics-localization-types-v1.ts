import type { PhysicsExhaustiveQuestionV2 } from "../physics-exhaustive-v2/sci-physics-exhaustive-generator-v2";

export type PhysicsLocaleV1 = "en" | "hi" | "pa";

export type PhysicsLocalizedAnchorSurfaceV1 = {
  stem: string;
  answer: string;
  distractors: readonly [string, string, string];
  trueStatement: string;
  falseStatement: string;
  explanation: string;
};

export type PhysicsLocalizedQuestionV1 = PhysicsExhaustiveQuestionV2 & {
  locale: PhysicsLocaleV1;
  localizationV1: {
    version: "SCI-PHYSICS-LOCALIZATION-V1";
    englishQuestionId: string;
    semanticInvariant: true;
    cpInvariant: true;
    sourceInvariant: true;
    optionOrderInvariant: true;
    correctIndexInvariant: true;
    reviewOnly: true;
  };
};

export const SCI_PHYSICS_LOCALIZATION_V1 = "SCI-PHYSICS-LOCALIZATION-V1" as const;
