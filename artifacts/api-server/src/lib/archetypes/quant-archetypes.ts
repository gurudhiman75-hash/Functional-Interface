import type {
  DifficultyLabel,
  GeneratorOptions,
  Pattern,
  QuantArchetype,
  QuantTopicCluster,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  getRequestedDifficultyLabel,
  getTargetDifficultyScore,
} from "../quant";
import {
  createReasoningStep,
  pickWeightedItem,
} from "../shared";

export const FORMULA_QUANT_ARCHETYPES: QuantArchetype[] =
  [
    {
      id: "easy-direct-substitution",
      difficulty: "Easy",
      category:
        "direct-substitution",
      topicClusters: [
        "percentage",
        "ratio-proportion",
        "profit-loss",
        "averages",
        "si-ci",
        "general-quant",
      ],
      operationChain: [
        "transform",
      ],
      wordingVariants: [
        "{baseText}",
        "Find the required value: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Substitute the given values directly into the required relation.",
        ),
      ],
    },
    {
      id: "easy-one-step-arithmetic",
      difficulty: "Medium",
      category:
        "one-step-arithmetic",
      topicClusters: [
        "profit-loss",
        "averages",
        "general-quant",
      ],
      operationChain: [
        "transform",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Compute the answer directly from the given data: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Form the needed arithmetic expression.",
        ),
        createReasoningStep(
          "compare",
          "Evaluate the final one-step result.",
        ),
      ],
    },
    {
      id: "easy-simple-percentage",
      difficulty: "Easy",
      category:
        "simple-percentage",
      topicClusters: [
        "percentage",
        "profit-loss",
      ],
      operationChain: [
        "percentage",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "percentage",
          "Convert the given information into a direct percentage calculation.",
        ),
      ],
    },
    {
      id: "easy-simple-ratio",
      difficulty: "Easy",
      category: "simple-ratio",
      topicClusters: [
        "ratio-proportion",
      ],
      operationChain: [
        "ratio",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "ratio",
          "Apply the direct ratio or proportion relation.",
        ),
      ],
    },
    {
      id: "medium-successive-percentage",
      difficulty: "Medium",
      category:
        "successive-percentage",
      topicClusters: [
        "percentage",
        "profit-loss",
        "si-ci",
      ],
      operationChain: [
        "percentage",
        "transform",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        " {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "percentage",
          "Convert each percentage condition into its numeric effect.",
        ),
        createReasoningStep(
          "transform",
          "Carry the transformed value forward to the next step.",
        ),
        createReasoningStep(
          "compare",
          "Evaluate the resulting quantity.",
        ),
      ],
    },
    {
      id: "medium-average-transformation",
      difficulty: "Medium",
      category:
        "average-transformation",
      topicClusters: [
        "averages",
      ],
      operationChain: [
        "aggregate",
        "average",
        "transform",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "aggregate",
          "Express the total from the average information.",
        ),
        createReasoningStep(
          "average",
          "Adjust the average relation using the given change.",
        ),
        createReasoningStep(
          "transform",
          "Solve the updated equation.",
        ),
      ],
    },
    {
      id: "medium-comparison-chain",
      difficulty: "Medium",
      category:
        "comparison-chain",
      topicClusters: [
        "ratio-proportion",
        "profit-loss",
        "general-quant",
      ],
      operationChain: [
        "compare",
        "transform",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "compare",
          "Identify the primary comparison stated in the question.",
        ),
        createReasoningStep(
          "transform",
          "Translate that comparison into a solvable equation.",
        ),
        createReasoningStep(
          "compare",
          "Evaluate the final required relation.",
        ),
      ],
    },
    {
      id: "medium-ratio-conversion",
      difficulty: "Medium",
      category:
        "ratio-conversion",
      topicClusters: [
        "ratio-proportion",
        "percentage",
      ],
      operationChain: [
        "ratio",
        "transform",
        "percentage",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "ratio",
          "Normalize the ratio into comparable units.",
        ),
        createReasoningStep(
          "transform",
          "Translate the normalized ratio into actual values.",
        ),
        createReasoningStep(
          "percentage",
          "Convert the transformed value into the asked form.",
        ),
      ],
    },
    {
      id: "medium-multi-step-arithmetic",
      difficulty: "Medium",
      category:
        "multi-step-arithmetic",
      topicClusters: [
        "profit-loss",
        "averages",
        "si-ci",
        "general-quant",
      ],
      operationChain: [
        "transform",
        "aggregate",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        ": {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Rewrite the givens into usable intermediate quantities.",
        ),
        createReasoningStep(
          "aggregate",
          "Combine the intermediate values.",
        ),
        createReasoningStep(
          "compare",
          "Extract the asked result from the combined quantity.",
        ),
      ],
    },
    {
      id: "hard-reverse-percentage",
      difficulty: "Hard",
      category:
        "reverse-percentage",
      topicClusters: [
        "percentage",
        "profit-loss",
        "si-ci",
      ],
      operationChain: [
        "reverse",
        "percentage",
        "infer",
      ],
      wordingVariants: [
        "{baseText}",
        ": {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "reverse",
          "Start from the final percentage condition and reverse the change.",
        ),
        createReasoningStep(
          "percentage",
          "Translate the reversed state into a percentage equation.",
        ),
        createReasoningStep(
          "infer",
          "Infer the original hidden value.",
        ),
      ],
    },
    {
      id: "hard-hidden-base-inference",
      difficulty: "Hard",
      category:
        "hidden-base-inference",
      topicClusters: [
        "percentage",
        "profit-loss",
        "averages",
        "si-ci",
      ],
      operationChain: [
        "infer",
        "transform",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "infer",
          "Identify the concealed base or principal quantity.",
        ),
        createReasoningStep(
          "transform",
          "Express the hidden base using the given relationships.",
        ),
        createReasoningStep(
          "compare",
          "Resolve the asked comparison or value.",
        ),
      ],
    },
    {
      id: "hard-conditional-ratio-logic",
      difficulty: "Hard",
      category:
        "conditional-ratio-logic",
      topicClusters: [
        "ratio-proportion",
        "profit-loss",
      ],
      operationChain: [
        "ratio",
        "conditional-selection",
        "infer",
      ],
      wordingVariants: [
        "{baseText}",
        ": {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "ratio",
          "Normalize the base ratio condition.",
        ),
        createReasoningStep(
          "conditional-selection",
          "Apply the condition that changes or filters the ratio relation.",
        ),
        createReasoningStep(
          "infer",
          "Infer the final hidden quantity from the conditioned ratio.",
        ),
      ],
    },
    {
      id: "hard-chained-percentage-ratio",
      difficulty: "Hard",
      category:
        "chained-percentage-ratio",
      topicClusters: [
        "percentage",
        "ratio-proportion",
        "profit-loss",
      ],
      operationChain: [
        "ratio",
        "percentage",
        "transform",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        ": {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "ratio",
          "Express the quantities in ratio form.",
        ),
        createReasoningStep(
          "percentage",
          "Convert the ratio relation into percentage movement.",
        ),
        createReasoningStep(
          "transform",
          "Carry the transformed result into the next relation.",
        ),
        createReasoningStep(
          "compare",
          "Evaluate the final target value or comparison.",
        ),
      ],
    },
    {
      id: "hard-comparative-conditional-inference",
      difficulty: "Hard",
      category:
        "comparative-conditional-inference",
      topicClusters: [
        "averages",
        "profit-loss",
        "si-ci",
        "general-quant",
      ],
      operationChain: [
        "compare",
        "filter",
        "infer",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        ": {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "compare",
          "Identify the initial comparison relation.",
        ),
        createReasoningStep(
          "filter",
          "Apply the condition that narrows the valid case.",
        ),
        createReasoningStep(
          "infer",
          "Infer the intermediate hidden quantity.",
        ),
        createReasoningStep(
          "compare",
          "Use that inferred result in the final comparison.",
        ),
      ],
    },
    {
      id: "hard-nested-operations",
      difficulty: "Hard",
      category:
        "nested-operations",
      topicClusters: [
        "percentage",
        "ratio-proportion",
        "profit-loss",
        "averages",
        "si-ci",
        "general-quant",
      ],
      operationChain: [
        "transform",
        "aggregate",
        "reverse",
        "infer",
      ],
      wordingVariants: [
        "{baseText}",
        ": {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Transform the given quantities into intermediate values.",
        ),
        createReasoningStep(
          "aggregate",
          "Combine the intermediate states into a usable relation.",
        ),
        createReasoningStep(
          "reverse",
          "Reverse the final condition to uncover the missing state.",
        ),
        createReasoningStep(
          "infer",
          "Infer the requested answer from the nested chain.",
        ),
      ],
    },
  ];

type ArchetypeSelectionDependencies = {
  getExamProfileConfig: (
    examProfile?: string,
  ) => {
    archetypeWeights: Record<
      string,
      number | undefined
    >;
  };
  validateArchetypeCompatibility: (
    pattern: Pattern,
    archetype: QuantArchetype,
    motif: QuantMotif | null | undefined,
    topicCluster: QuantTopicCluster,
  ) => {
    valid: boolean;
  };
  classifyDifficultyLabel: (
    difficultyScore: number,
  ) => DifficultyLabel;
};

// Archetype selection owns weighting and fallback sequencing only.
// The engine still owns orchestration, validation wiring, and final realization.
export function createFallbackArchetype(
  difficulty: DifficultyLabel,
  topicCluster: QuantTopicCluster,
): QuantArchetype {
  return {
    id: "fallback-direct-realizer",
    difficulty,
    category: "direct-substitution",
    topicClusters: [
      topicCluster,
      "general-quant",
    ],
    operationChain: ["transform"],
    requiredOperations: ["transform"],
    reasoningDepthRange: [1, 2],
    wordingVariants: ["{baseText}"],
    buildReasoningSteps: () => [
      {
        operation: "transform",
        detail:
          "Use the validated pattern relation directly.",
      },
    ],
  };
}

export function getQuantArchetypeCandidates(
  archetypes: QuantArchetype[],
  topicCluster: QuantTopicCluster,
  difficulty: DifficultyLabel,
) {
  return archetypes.filter(
    (archetype) =>
      archetype.difficulty ===
        difficulty &&
      archetype.topicClusters.includes(
        topicCluster,
      ),
  );
}

export function selectQuantArchetype(
  archetypes: QuantArchetype[],
  pattern: Pattern,
  options: GeneratorOptions | undefined,
  topicCluster: QuantTopicCluster,
  motif: QuantMotif | null | undefined,
  deps: ArchetypeSelectionDependencies,
) {
  const profileConfig =
    deps.getExamProfileConfig(
      options?.examProfile,
    );
  const requestedDifficulty =
    getRequestedDifficultyLabel(
      pattern,
      options,
      deps.classifyDifficultyLabel,
    );
  const targetDifficultyScore =
    getTargetDifficultyScore(
      pattern,
      options,
    );
  const preferredCandidates =
    getQuantArchetypeCandidates(
      archetypes,
      topicCluster,
      requestedDifficulty,
    ).filter((archetype) =>
      deps.validateArchetypeCompatibility(
        pattern,
        archetype,
        motif,
        topicCluster,
      ).valid,
    );

  const desiredOperationSpan =
    requestedDifficulty === "Easy"
      ? 1
      : requestedDifficulty ===
          "Medium"
        ? targetDifficultyScore >= 5.5
          ? 3
          : 2
        : 4;
  const desiredReasoningDepth =
    requestedDifficulty === "Easy"
      ? 1
      : requestedDifficulty ===
          "Medium"
        ? 2.5
        : 4;

  if (preferredCandidates.length) {
    return pickWeightedItem(
      preferredCandidates,
      (archetype) => {
        let weight =
          profileConfig
            .archetypeWeights[
            archetype.category
          ] ?? 1;

        if (motif) {
          const preferredOverlap =
            archetype.operationChain.filter(
              (operation) =>
                motif.preferredOperations.includes(
                  operation,
                ),
            ).length;

          if (preferredOverlap) {
            weight *=
              1 +
              preferredOverlap * 0.3;
          }

          const [minDepth, maxDepth] =
            motif.reasoningDepthRange;
          const stepCount =
            archetype.operationChain
              .length;

          if (
            stepCount >= minDepth &&
            stepCount <= maxDepth
          ) {
            weight *= 1.25;
          } else {
            weight *= 0.8;
          }
        }

        const operationDistance =
          Math.abs(
            archetype.operationChain
              .length -
              desiredOperationSpan,
          );
        weight *= Math.max(
          0.35,
          1.4 -
            operationDistance * 0.35,
        );

        const prototypeDepth =
          archetype.buildReasoningSteps({
            pattern,
            baseText: "",
            values: {},
            correctAnswer: 0,
            topicCluster,
          }).length;
        const depthDistance =
          Math.abs(
            prototypeDepth -
              desiredReasoningDepth,
          );
        weight *= Math.max(
          0.4,
          1.35 - depthDistance * 0.2,
        );

        if (
          requestedDifficulty ===
            "Easy" &&
          archetype.operationChain
            .length > 1
        ) {
          weight *= 0.35;
        }

        return weight;
      },
    );
  }

  const fallbackCandidates =
    getQuantArchetypeCandidates(
      archetypes,
      "general-quant",
      requestedDifficulty,
    ).filter((archetype) =>
      deps.validateArchetypeCompatibility(
        pattern,
        archetype,
        motif,
        topicCluster,
      ).valid,
    );

  if (fallbackCandidates.length) {
    return pickWeightedItem(
      fallbackCandidates,
      (archetype) =>
        profileConfig.archetypeWeights[
          archetype.category
        ] ?? 1,
    );
  }

  return createFallbackArchetype(
    requestedDifficulty,
    topicCluster,
  );
}
