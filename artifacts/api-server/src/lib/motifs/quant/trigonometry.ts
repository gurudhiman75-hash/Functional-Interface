import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

const motifIds = [
  "trig-ratio-sides",
  "trig-ratio-solve",
  "trig-reciprocal-id",
  "trig-pythagorean-sum",
  "trig-val-eval",
  "trig-val-power",
  "trig-val-eqn",
  "trig-comp-shift",
  "trig-comp-series-prod",
  "trig-comp-series-sum",
  "trig-hd-elevation",
  "trig-hd-two-point",
  "trig-hd-depression",
  "trig-hd-shadow",
  "trig-hd-broken-tree",
  "trig-alg-sec-tan-link",
  "trig-alg-csc-cot-link",
  "trig-id-double-angle",
  "trig-max-min",
  "trig-quad-sign",
  "trig-reduction-large",
  "trig-ratio-cot-sec",
  "trig-expression-simplify",
  "trig-angle-comparison",
  "trig-hd-ladder",
  "trig-hd-opposite-points",
  "trig-area-triangle",
  "trig-product-to-identity",
  "trig-equation-standard",
  "trig-domain-range",
] as const;

export const trigonometryScopeMap = {
  chapter: "Trigonometry",
  stateModel:
    "angle_ratio_identity_application_model",
  coreDomains: [
    "Basic trigonometric ratios",
    "Standard angle values",
    "Complementary angles",
    "Heights and distances",
    "Algebraic identities",
    "Quadrants and reductions",
  ],
  invariants: [
    "all functions use MathJax commands such as \\sin and \\tan",
    "heights and distances use tangent as the primary state relation",
    "standard angle values remain exact fractions or surds",
    "answers prefer surd form over decimals",
  ],
};

export const trigonometryDistractorRegistry = [
  "Ratio_Definition_Flip",
  "Reciprocal_Mixup",
  "Pythagorean_Sign_Error",
  "Angle_Value_Inversion",
  "HD_Shadow_Ratio_Error",
  "Complementary_Function_Swap",
  "Sec_Tan_Linear_Assumption",
  "Max_Min_Arithmetic_Sum",
  "Quadrant_Sign_Neglect",
  "Double_Angle_Linear",
  "Degree_Radian_Confusion",
  "HD_Distance_Sum_Error",
  "Tangent_90_Zero",
  "Sqrt_Omission_Max",
  "Series_Boundary_Error",
  "Cosecant_Cot_Sign",
  "Evaluation_Order_Error",
  "HD_Observer_Height",
  "Identity_Cross_Product",
  "Rationalization_Slip",
] as const;

export const trigonometryMotifs: QuantMotif[] =
  motifIds.map((id) => {
    const isApplication =
      id.includes("hd-");
    const isAdvanced =
      id.includes("max-min") ||
      id.includes("double") ||
      id.includes("series") ||
      id.includes("quad") ||
      id.includes("reduction");
    const isIdentity =
      id.includes("id") ||
      id.includes("alg") ||
      id.includes("pythagorean");

    return defineQuantMotif({
      id,
      topicCluster: "trigonometry",
      archetype: isApplication
        ? "height-distance-state"
        : isIdentity
          ? "trig-identity-transform"
          : "standard-angle-evaluation",
      reasoningCategories: [
        isApplication
          ? "heights-and-distances"
          : isIdentity
            ? "identity-application"
            : "ratio-evaluation",
        isAdvanced
          ? "multi-stage-angle-reasoning"
          : "direct-angle-reasoning",
      ],
      preferredOperations: [
        isApplication
          ? "tangent relation"
          : "standard value lookup",
        isIdentity
          ? "identity substitution"
          : "ratio substitution",
      ],
      compatibleTopics: [
        "trigonometry",
        "trig",
        "heights and distances",
      ],
      compatiblePatternTypes: [
        "formula",
        "logic",
      ],
      requiredVariables: [
        "angle",
        "height",
        "distance",
      ],
      supportedReasoningTypes: [
        "direct",
        "conditional",
        "multi-step",
        "inferential",
        "symbolic",
        "visual",
      ],
      requiredReasoningCapabilities: [
        "arithmetic",
        "conditional",
        "multi-step",
      ],
      supportedDifficultyBands:
        isAdvanced
          ? ["Hard"]
          : isApplication || isIdentity
            ? ["Medium", "Hard"]
            : ["Easy", "Medium", "Hard"],
      commonDistractors:
        trigonometryDistractorRegistry,
      inferenceStyle: isAdvanced
        ? "hidden"
        : isApplication || isIdentity
          ? "conditional"
          : "direct",
      reasoningDepthRange: isAdvanced
        ? [3, 5]
        : isApplication || isIdentity
          ? [2, 4]
          : [1, 3],
      generationStrategy: [
        "topology-first trigonometric scenario generation",
        "prefer exact standard-angle values and surd answers",
      ],
      parameterRanges: {
        angles:
          "Prefer 30, 45, 60, and controlled quadrant reductions.",
        distances:
          "Choose multiples that keep height answers in clean surd form.",
      },
      distractorStrategies:
        trigonometryDistractorRegistry,
      difficultyTuning: {
        easy: [
          "direct ratio or standard angle evaluation",
        ],
        medium: [
          "single identity or single heights-and-distances relation",
        ],
        hard: [
          "multi-point observation, quadrant reduction, sec-tan link, or max-min expression",
        ],
      },
      validationRules: [
        "Render every trigonometric function with MathJax commands.",
        "Use ^\\circ for degree measures.",
        "Prefer exact fractions and surds over decimals.",
      ],
      diversityTags: [
        "standard-angle",
        "right-triangle",
        "height-distance",
        "identity-transform",
        "quadrant-reduction",
      ],
    });
  });

