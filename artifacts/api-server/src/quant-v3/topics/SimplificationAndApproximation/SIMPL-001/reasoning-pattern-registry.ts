import type { ReasoningPatternRegistryEntry } from "./types";

export const REASONING_PATTERN_REGISTRY = [
  {
    patternId: "RP-001",
    packageId: "SIMPL-001",
    title: "BODMAS Operation Ordering",
    supportedCpIds: ["CP-001", "CP-004", "CP-005"],
    steps: [
      "captureExpression",
      "resolveBrackets",
      "applyDivisionAndMultiplication",
      "applyAdditionAndSubtraction",
      "extractAnswer",
    ],
  },
  {
    patternId: "RP-002",
    packageId: "SIMPL-001",
    title: "Fraction Normalization And Reduction",
    supportedCpIds: ["CP-002", "CP-004"],
    steps: [
      "captureFractionExpression",
      "normalizeFractions",
      "applyFractionOperations",
      "reduceResult",
      "extractAnswer",
    ],
  },
  {
    patternId: "RP-003",
    packageId: "SIMPL-001",
    title: "Decimal Place-Value Arithmetic",
    supportedCpIds: ["CP-003", "CP-004"],
    steps: [
      "captureDecimalExpression",
      "preservePlaceValue",
      "applyDecimalOperations",
      "extractAnswer",
    ],
  },
  {
    patternId: "RP-004",
    packageId: "SIMPL-001",
    title: "Mixed Rational Normalization",
    supportedCpIds: ["CP-004"],
    steps: [
      "captureMixedExpression",
      "convertToCommonForm",
      "applyOperations",
      "simplifyResult",
      "extractAnswer",
    ],
  },
  {
    patternId: "RP-005",
    packageId: "SIMPL-001",
    title: "Root And Power Evaluation",
    supportedCpIds: ["CP-005"],
    steps: [
      "captureRootPowerExpression",
      "evaluateRoots",
      "evaluatePowers",
      "applyOperations",
      "extractAnswer",
    ],
  },
  {
    patternId: "RP-006",
    packageId: "SIMPL-001",
    title: "Approximation By Rounding",
    supportedCpIds: ["CP-006"],
    steps: [
      "captureExpression",
      "roundValues",
      "computeEstimate",
      "extractAnswer",
    ],
  },
  {
    patternId: "RP-007",
    packageId: "SIMPL-001",
    title: "Nearest Option Selection",
    supportedCpIds: ["CP-007"],
    steps: [
      "captureExpressionAndOptions",
      "computeOrEstimateValue",
      "compareOptionDistances",
      "selectNearestOption",
      "extractAnswer",
    ],
  },
] as const satisfies ReasoningPatternRegistryEntry[];
