import type {
  DistractorType,
  ExamProfileId,
  ExamRealismMetadata,
  OptionMetadata,
  QuantArchetype,
  QuantReasoningCategory,
} from "./generator-engine";
import { pickRandomItem } from "../shared";

type ExamProfileConfig = {
  wordingStyle: ExamRealismMetadata["wordingStyle"];
  archetypeWeights: Partial<
    Record<QuantReasoningCategory, number>
  >;
  distractorWeights: Partial<
    Record<DistractorType, number>
  >;
  reasoningWeights: {
    speedBias: number;
    trapBias: number;
    inferenceBias: number;
  };
};

const EXAM_PROFILE_CONFIGS: Record<
  ExamProfileId,
  ExamProfileConfig
> = {
  custom: {
    wordingStyle: "balanced",
    archetypeWeights: {},
    distractorWeights: {},
    reasoningWeights: {
      speedBias: 1,
      trapBias: 1,
      inferenceBias: 1,
    },
  },
  ssc: {
    wordingStyle: "concise",
    archetypeWeights: {
      "one-step-arithmetic": 1.35,
      "simple-percentage": 1.25,
      "comparison-chain": 1.15,
      "nested-operations": 0.8,
    },
    distractorWeights: {
      arithmeticSlip: 1.4,
      percentageTrap: 1.2,
      prematureRounding: 1.2,
    },
    reasoningWeights: {
      speedBias: 1.3,
      trapBias: 1,
      inferenceBias: 0.8,
    },
  },
  ibps: {
    wordingStyle: "balanced",
    archetypeWeights: {
      "comparison-chain": 1.3,
      "ratio-conversion": 1.25,
      "conditional-ratio-logic": 1.2,
    },
    distractorWeights: {
      wrongIntermediateValue: 1.3,
      wrongDenominator: 1.2,
      comparisonTrap: 1.2,
    },
    reasoningWeights: {
      speedBias: 1,
      trapBias: 1.25,
      inferenceBias: 1,
    },
  },
  cat: {
    wordingStyle: "inference-heavy",
    archetypeWeights: {
      "hidden-base-inference": 1.35,
      "chained-percentage-ratio": 1.35,
      "comparative-conditional-inference": 1.4,
      "nested-operations": 1.35,
    },
    distractorWeights: {
      wrongIntermediateValue: 1.35,
      cumulativeMistake: 1.25,
      ratioInversion: 1.15,
    },
    reasoningWeights: {
      speedBias: 0.85,
      trapBias: 1.1,
      inferenceBias: 1.4,
    },
  },
  sbi: {
    wordingStyle: "balanced",
    archetypeWeights: {
      "successive-percentage": 1.2,
      "ratio-conversion": 1.2,
      "conditional-ratio-logic": 1.15,
    },
    distractorWeights: {
      percentageTrap: 1.25,
      wrongIntermediateValue: 1.2,
      wrongDenominator: 1.15,
    },
    reasoningWeights: {
      speedBias: 1,
      trapBias: 1.15,
      inferenceBias: 1.05,
    },
  },
  rrb: {
    wordingStyle: "concise",
    archetypeWeights: {
      "direct-substitution": 1.2,
      "simple-ratio": 1.2,
      "one-step-arithmetic": 1.15,
    },
    distractorWeights: {
      arithmeticSlip: 1.25,
      prematureRounding: 1.15,
    },
    reasoningWeights: {
      speedBias: 1.2,
      trapBias: 0.95,
      inferenceBias: 0.85,
    },
  },
};

export function buildPrompt(
  variants: string[],
  replacements: Record<
    string,
    string | number
  >,
) {
  let prompt = pickRandomItem(
    variants,
  );

  for (const [key, value] of Object.entries(
    replacements,
  )) {
    prompt = prompt.replaceAll(
      `{${key}}`,
      String(value),
    );
  }

  return prompt;
}

export function getExamProfileConfig(
  examProfile: ExamProfileId = "custom",
) {
  return (
    EXAM_PROFILE_CONFIGS[examProfile] ??
    EXAM_PROFILE_CONFIGS.custom
  );
}

export function buildExamRealismMetadata(
  examProfile: ExamProfileId,
  archetype: QuantArchetype,
  optionMetadata: OptionMetadata[] | undefined,
): ExamRealismMetadata {
  const profileConfig =
    getExamProfileConfig(
      examProfile,
    );
  const distractorSummary = (
    optionMetadata ?? []
  )
    .filter(
      (option) =>
        !option.isCorrect &&
        option.distractorType,
    )
    .map(
      (option) =>
        option.distractorType!,
    );

  return {
    examProfile,
    wordingStyle:
      profileConfig.wordingStyle,
    archetypeId: archetype.id,
    archetypeCategory:
      archetype.category,
    reasoningTraps: [
      ...new Set(
        (optionMetadata ?? [])
          .filter(
            (option) =>
              !option.isCorrect &&
              option.reasoningTrap,
          )
          .map(
            (option) =>
              option.reasoningTrap!,
          ),
      ),
    ],
    weightingSummary: [
      `Archetype weight ${(
        profileConfig
          .archetypeWeights[
          archetype.category
          ] ?? 1
      ).toFixed(2)}`,
      `Trap bias ${profileConfig.reasoningWeights.trapBias.toFixed(
        2,
      )}`,
      `Inference bias ${profileConfig.reasoningWeights.inferenceBias.toFixed(
        2,
      )}`,
      distractorSummary.length
        ? `Distractor mix ${distractorSummary.join(
            ", ",
          )}`
        : "Distractor mix standard",
    ],
  };
}
