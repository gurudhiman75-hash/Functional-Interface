import type {
  CompatiblePatternType,
  MotifDifficultyBand,
  MotifReasoningType,
  QuantMotif,
} from "../../motifs/types";
import type {
  DifficultyLabel,
  Pattern,
  QuantArchetype,
  QuantTopicCluster,
} from "../../core/generator-engine";
import {
  CompatibilityIssue,
  CompatibilityResult,
} from "../validation";
import {
  countMatches,
  extractTemplatePlaceholders,
  hasAnyToken,
} from "../text";

type PatternReasoningCapability =
  | MotifReasoningType
  | "arithmetic";

export function getPatternRequiredVariables(
  pattern: Pattern,
) {
  const patternVariables =
    pattern.variables ?? {};
  const templateVariants =
    pattern.templateVariants ?? [];
  const formulaVariables =
    pattern.formula
      ? [
          ...new Set(
            Array.from(
              pattern.formula.matchAll(
                /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g,
              ),
            )
              .map((match) => match[0]!)
              .filter(
                (token) =>
                  ![
                    "Math",
                    "return",
                    "true",
                    "false",
                  ].includes(token) &&
                  !/^\d/.test(token),
              ),
          ),
        ]
      : [];

  return [
    ...new Set([
      ...(pattern.requiredVariables ?? []),
      ...Object.keys(
        patternVariables,
      ),
      ...extractTemplatePlaceholders(
        pattern.explanationTemplate,
      ),
      ...formulaVariables,
      ...templateVariants.flatMap(
        (template) =>
          extractTemplatePlaceholders(
            template,
          ),
      ),
    ]),
  ];
}

export function getPatternReasoningCapabilities(
  pattern: Pattern,
  topicCluster: QuantTopicCluster,
): PatternReasoningCapability[] {
  if (
    pattern.reasoningCapabilities?.length
  ) {
    return pattern.reasoningCapabilities;
  }

  const capabilities =
    new Set<PatternReasoningCapability>();
  const combinedText = `${pattern.topic} ${pattern.subtopic} ${pattern.formula ?? ""}`.toLowerCase();

  if (pattern.type === "di") {
    capabilities.add("visual");
  }

  if (pattern.type === "logic") {
    capabilities.add("symbolic");
  }

  if (pattern.formula) {
    capabilities.add("arithmetic");
  }

  if (
    hasAnyToken(combinedText, [
      "if",
      "when",
      "condition",
      "unless",
    ])
  ) {
    capabilities.add("conditional");
  }

  if (
    hasAnyToken(combinedText, [
      "compare",
      "difference",
      "greater",
      "less",
      "highest",
      "lowest",
    ])
  ) {
    capabilities.add("comparative");
  }

  if (
    hasAnyToken(combinedText, [
      "ratio",
      "inequality",
      "coding",
      "decoding",
      "direction",
      "relation",
    ])
  ) {
    capabilities.add("symbolic");
  }

  if (
    countMatches(
      pattern.formula ?? "",
      /[+\-*/%]/g,
    ) >= 2
  ) {
    capabilities.add("multi-step");
    capabilities.add("inferential");
  } else {
    capabilities.add("direct");
  }

  if (
    topicCluster === "coding-decoding" ||
    topicCluster === "blood-relations" ||
    topicCluster === "direction-sense" ||
    topicCluster === "inequality" ||
    topicCluster === "seating-arrangement"
  ) {
    capabilities.add("inferential");
    capabilities.add("symbolic");
  }

  return [...capabilities];
}

export function getMotifCompatibleTopics(
  motif: QuantMotif,
) {
  return motif.compatibleTopics?.length
    ? motif.compatibleTopics
    : [motif.topicCluster];
}

export function getMotifCompatiblePatternTypes(
  motif: QuantMotif,
) {
  if (
    motif.compatiblePatternTypes?.length
  ) {
    return motif.compatiblePatternTypes;
  }

  return [
    motif.topicCluster ===
      "coding-decoding" ||
    motif.topicCluster ===
      "blood-relations" ||
    motif.topicCluster ===
      "inequality" ||
    motif.topicCluster ===
      "direction-sense"
      || motif.topicCluster ===
      "seating-arrangement"
      ? "logic"
      : "formula",
  ] satisfies CompatiblePatternType[];
}

export function getMotifRequiredVariables(
  motif: QuantMotif,
) {
  return motif.requiredVariables ?? [];
}

export function getMotifSupportedReasoningTypes(
  motif: QuantMotif,
) {
  if (
    motif.supportedReasoningTypes?.length
  ) {
    return motif.supportedReasoningTypes;
  }

  const supported =
    new Set<MotifReasoningType>();
  supported.add(
    motif.inferenceStyle === "direct"
      ? "direct"
      : motif.inferenceStyle ===
          "conditional"
        ? "conditional"
        : "inferential",
  );

  if (
    motif.reasoningDepthRange[1] >= 3
  ) {
    supported.add("multi-step");
  }

  if (
    motif.preferredOperations.includes(
      "compare",
    )
  ) {
    supported.add("comparative");
  }

  if (
    motif.topicCluster ===
      "coding-decoding" ||
    motif.topicCluster ===
      "inequality" ||
    motif.topicCluster ===
      "blood-relations" ||
    motif.topicCluster ===
      "direction-sense"
    || motif.topicCluster ===
      "seating-arrangement"
  ) {
    supported.add("symbolic");
    supported.add("inferential");
  }

  return [...supported];
}

export function getMotifSupportedDifficultyBands(
  motif: QuantMotif,
) {
  if (
    motif.supportedDifficultyBands?.length
  ) {
    return motif.supportedDifficultyBands;
  }

  const [minDepth, maxDepth] =
    motif.reasoningDepthRange;
  const bands: MotifDifficultyBand[] = [];

  if (minDepth <= 2) {
    bands.push("Easy");
  }
  if (
    minDepth <= 4 &&
    maxDepth >= 2
  ) {
    bands.push("Medium");
  }
  if (maxDepth >= 3) {
    bands.push("Hard");
  }

  return bands.length
    ? bands
    : ["Medium"];
}

export function validatePatternCompatibility(
  pattern: Pattern,
  topicCluster: QuantTopicCluster,
  motif?: QuantMotif | null,
  difficulty?: DifficultyLabel,
) {
  const issues: CompatibilityIssue[] = [];

  if (
    pattern.supportedQuestionTypes?.length &&
    !pattern.supportedQuestionTypes.includes(
      pattern.type,
    )
  ) {
    issues.push({
      reason:
        "Pattern type is not included in its supported question types.",
    });
  }

  if (
    motif &&
    pattern.supportedMotifs?.length &&
    !pattern.supportedMotifs.includes(
      motif.id,
    )
  ) {
    issues.push({
      reason:
        "Pattern does not support the selected motif.",
    });
  }

  const reasoningCapabilities =
    getPatternReasoningCapabilities(
      pattern,
      topicCluster,
    );

  if (motif) {
    const compatibleTopics =
      getMotifCompatibleTopics(motif).map(
        (topic) => topic.toLowerCase(),
      );
    const patternTopics = [
      topicCluster,
      pattern.topic.toLowerCase(),
      pattern.subtopic.toLowerCase(),
    ];

    if (
      !patternTopics.some((topic) =>
        compatibleTopics.includes(
          topic,
        ),
      )
    ) {
      issues.push({
        reason:
          "Motif is not compatible with the pattern topic.",
      });
    }

    const requiredVariables =
      getMotifRequiredVariables(motif);
    const availableVariables =
      getPatternRequiredVariables(pattern);

    if (
      requiredVariables.some(
        (key) =>
          !availableVariables.includes(
            key,
          ),
      )
    ) {
      issues.push({
        reason:
          "Pattern is missing variables required by the motif.",
      });
    }

    if (
      !getMotifCompatiblePatternTypes(
        motif,
      ).includes(pattern.type)
    ) {
      issues.push({
        reason:
          "Motif does not support the pattern question type.",
      });
    }

    const supportedReasoning =
      getMotifSupportedReasoningTypes(
        motif,
      );
    const hasReasoningOverlap =
      supportedReasoning.some((type) =>
        reasoningCapabilities.includes(
          type,
        ),
      );

    if (!hasReasoningOverlap) {
      issues.push({
        reason:
          "Pattern and motif reasoning capabilities do not overlap.",
      });
    }

    const requiredCapabilities =
      motif.requiredReasoningCapabilities ??
      [];

    if (
      requiredCapabilities.some(
        (capability) =>
          !reasoningCapabilities.includes(
            capability,
          ),
      )
    ) {
      issues.push({
        reason:
          "Pattern is missing reasoning capabilities required by the motif.",
      });
    }

    if (
      difficulty &&
      !getMotifSupportedDifficultyBands(
        motif,
      ).includes(difficulty)
    ) {
      issues.push({
        reason:
          "Motif does not support the requested difficulty band.",
      });
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  } satisfies CompatibilityResult;
}

export const validateMotifCompatibility =
  validatePatternCompatibility;

export function validateArchetypeCompatibility(
  pattern: Pattern,
  archetype: QuantArchetype,
  motif: QuantMotif | null | undefined,
  topicCluster: QuantTopicCluster,
) {
  const issues: CompatibilityIssue[] = [];
  const supportedMotifs =
    archetype.supportedMotifs;
  const requiredOperations =
    archetype.requiredOperations ??
    archetype.operationChain;
  const reasoningDepthRange =
    archetype.reasoningDepthRange ?? [
      Math.max(
        1,
        archetype.operationChain.length - 1,
      ),
      Math.max(
        1,
        archetype.operationChain.length + 1,
      ),
    ];

  if (
    !archetype.topicClusters.includes(
      topicCluster,
    ) &&
    !archetype.topicClusters.includes(
      "general-quant",
    )
  ) {
    issues.push({
      reason:
        "Archetype does not support the requested topic cluster.",
    });
  }

  if (
    motif &&
    supportedMotifs?.length &&
    !supportedMotifs.includes(motif.id)
  ) {
    issues.push({
      reason:
        "Archetype does not support the selected motif.",
    });
  }

  if (
    motif &&
    requiredOperations.some(
      (operation) =>
        !motif.preferredOperations.includes(
          operation,
        ) &&
        !archetype.operationChain.includes(
          operation,
        ),
    )
  ) {
    issues.push({
      reason:
        "Archetype requires operations not aligned with the motif.",
    });
  }

  const patternCapabilities =
    getPatternReasoningCapabilities(
      pattern,
      topicCluster,
    );

  if (
    requiredOperations.includes(
      "filter",
    ) &&
    !patternCapabilities.includes(
      "conditional",
    )
  ) {
    issues.push({
      reason:
        "Pattern cannot support conditional archetype operations.",
    });
  }

  if (
    motif &&
    (archetype.operationChain.length <
      reasoningDepthRange[0] ||
      archetype.operationChain.length >
        reasoningDepthRange[1])
  ) {
    issues.push({
      reason:
        "Archetype reasoning depth is outside its configured range.",
    });
  }

  return {
    valid: issues.length === 0,
    issues,
  } satisfies CompatibilityResult;
}
