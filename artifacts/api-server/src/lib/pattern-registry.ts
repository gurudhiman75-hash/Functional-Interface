import type {
  DifficultyLabel,
  DIPattern,
  ExamProfileId,
  Pattern,
} from "./core/generator-engine";
import { percentageMotifIds } from "./motifs/percentage";
import { ALL_PATTERNS } from "./patterns";
import { isQuantV2PercentageEnabled } from "./quant-v2/percentage-admin-adapter";

export type QuestionPatternDomain =
  | "reasoning"
  | "quant"
  | "english"
  | "punjabi"
  | "knowledge"
  | "computer"
  | "di";

export type QuestionPatternDifficulty =
  | "easy"
  | "medium"
  | "hard";

export interface QuestionPattern {
  id: string;
  domain: QuestionPatternDomain;
  topic: string;
  label: string;
  description?: string;
  supportedDifficulties: QuestionPatternDifficulty[];
  compatibleMotifs: string[];
  examStyles?: string[];
  enabled?: boolean;
}

export interface Motif {
  canonicalName: string;
  aliases?: string[];
  domain: QuestionPatternDomain;
  topic: string;
  tags?: string[];
  generationHints?: string[];
  distractorHints?: string[];
  difficultyHints?: string[];
}

export interface MotifIntakeCandidate {
  proposedName: string;
  mappedCanonicalName?: string;
  duplicateOf?: string;
  confidence: number;
  distractorPatterns: string[];
  difficultyDrivers: string[];
  reviewStatus: "pending" | "approved" | "rejected";
}

export type PatternGenerationRequest = {
  domain?: QuestionPatternDomain;
  topic?: string;
  pattern?: string;
  patternId?: string;
  difficulty?: QuestionPatternDifficulty | DifficultyLabel;
  examStyle?: string;
};

const difficultyMap: Record<
  QuestionPatternDifficulty,
  DifficultyLabel
> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const examProfileMap: Record<
  string,
  ExamProfileId
> = {
  banking: "ibps",
  bank: "ibps",
  ibps: "ibps",
  po: "ibps",
  clerk: "ibps",
  "ibps-po": "ibps",
  "ibps-clerk": "ibps",
  "ibps-so": "ibps",
  sbi: "sbi",
  "sbi-po": "sbi",
  "sbi-clerk": "sbi",
  ssc: "ssc",
  cgl: "ssc",
  chsl: "ssc",
  mts: "ssc",
  gd: "ssc",
  cpo: "ssc",
  je: "ssc",
  stenographer: "ssc",
  cat: "cat",
  rrb: "rrb",
  ntpc: "rrb",
  groupd: "rrb",
  "group-d": "rrb",
  alp: "rrb",
  "rrb-ntpc": "rrb",
  punjab: "punjab_state",
  punjabstate: "punjab_state",
  punjab_state: "punjab_state",
  pseb: "punjab_state",
  ppsc: "punjab_state",
  psssb: "punjab_state",
  patwari: "punjab_state",
  cooperative: "punjab_state",
  punjabpsc: "punjab_state",
  punjab_state: "punjab_state",
};

const ENGINE_PATTERN_CODING_MOTIF_IDS = [
  "shift-fixed",
  "shift-incremental",
  "shift-alternating",
  "shift-vowel-consonant",
  "map-opposite",
  "map-cross",
  "map-rank-math",
] as const;

const ENGINE_PATTERN_SERIES_MOTIF_IDS = [
  "math-power",
  "math-difference-layer",
  "math-interleaved",
] as const;

const ENGINE_PATTERN_ANALOGY_MOTIF_IDS = [
  "shift-fixed",
  "shift-incremental",
  "shift-alternating",
  "map-opposite",
  "map-cross",
  "map-rank-math",
] as const;

const ENGINE_PATTERN_CLASSIFICATION_MOTIF_IDS = [
  "map-rank-math",
  "math-power",
  "math-interleaved",
] as const;

const ENGINE_RELATIONAL_NARRATIVE_MOTIF_IDS = [
  "rel-pointing",
  "rel-chain",
  "rel-missing",
  "direct_family_relation",
  "generation_gap_reasoning",
  "gender_based_inference",
  "conditional_family_inference",
  "circular_relation_chain",
  "indirect_relation_deduction",
] as const;

const ENGINE_RELATIONAL_CODED_MOTIF_IDS = [
  "rel-coded-id",
  "rel-coded-eval",
] as const;

const ENGINE_RELATIONAL_PUZZLE_MOTIF_IDS = [
  "rel-puzzle-matrix",
] as const;

const ENGINE_SPATIAL_DIRECTION_MOTIF_IDS = [
  "spa-dir-pythagoras",
  "spa-dir-shadow",
  "spa-dir-degrees",
  "straight_path_distance",
  "simple_turn_tracking",
  "shortest_distance_inference",
  "orientation_shift_chain",
  "conditional_movement_reasoning",
  "coordinate_inference_chain",
] as const;

const ENGINE_SPATIAL_DICE_CUBE_MOTIF_IDS = [
  "spa-dice-logic",
  "spa-cube-painting",
  "spa-cube-folding",
] as const;

const ENGINE_SPATIAL_REFLECTION_MOTIF_IDS = [
  "spa-img-mirror",
  "spa-img-water",
] as const;

const ENGINE_SPATIAL_FOLDING_MOTIF_IDS = [
  "spa-paper-fold",
] as const;

const ENGINE_BOOLEAN_INEQUALITY_MOTIF_IDS = [
  "ded-ineq-chain",
  "ded-ineq-coded",
  "ded-ineq-either",
  "direct_inequality_reading",
  "single_chain_deduction",
  "compound_inequality_linking",
  "indirect_conclusion_validation",
  "uncertain_branch_comparison",
  "nested_symbolic_reasoning",
] as const;

const ENGINE_BOOLEAN_SYLLOGISM_MOTIF_IDS = [
  "ded-syl-definite",
  "ded-syl-possibility",
  "ded-syl-negative",
] as const;

const ENGINE_BOOLEAN_VENN_MOTIF_IDS = [
  "ded-venn-ident",
  "ded-venn-math",
] as const;

const ENGINE_TEMPORAL_CALENDAR_MOTIF_IDS = [
  "tem-cal-day-find",
  "tem-cal-ref-shift",
  "tem-cal-repetition",
] as const;

const ENGINE_TEMPORAL_CLOCK_MOTIF_IDS = [
  "tem-clk-angle",
  "tem-clk-overlap",
  "tem-clk-faulty",
] as const;

const ENGINE_CRITICAL_ASSUMPTION_MOTIF_IDS = [
  "cri-inf-assumption",
] as const;

const ENGINE_CRITICAL_CONCLUSION_MOTIF_IDS = [
  "cri-inf-conclusion",
] as const;

const ENGINE_CRITICAL_ACTION_MOTIF_IDS = [
  "cri-inf-action",
] as const;

const ENGINE_CRITICAL_CAUSE_MOTIF_IDS = [
  "cri-inf-cause",
] as const;

const ENGINE_CRITICAL_ARGUMENT_MOTIF_IDS = [
  "cri-inf-argument",
] as const;

const ENGINE_ABSTRACT_SERIES_MOTIF_IDS = [
  "abs-series",
] as const;

const ENGINE_ABSTRACT_PAPER_MOTIF_IDS = [
  "abs-paper-cutting",
] as const;

const ENGINE_ABSTRACT_EMBEDDED_MOTIF_IDS = [
  "abs-embedded",
] as const;

const TSD_MOTIF_IDS = [
  "tsd-basic-dst",
  "tsd-ratio-fixed-d",
  "tsd-ratio-fixed-t",
  "tsd-fractional-speed",
  "tsd-late-early-shift",
  "tsd-avg-equal-dist",
  "tsd-avg-equal-time",
  "tsd-avg-harmonic-3",
  "tsd-avg-weighted",
  "tsd-rel-opp-dir",
  "tsd-rel-same-dir",
  "tsd-delayed-start",
  "tsd-post-crossing",
  "tsd-stoppage-time",
  "tsd-train-pole",
  "tsd-train-platform",
  "tsd-train-moving-man",
  "tsd-train-crossing",
  "tsd-train-window-man",
  "tsd-boat-basic",
  "tsd-boat-inverse",
  "tsd-boat-round-trip",
  "tsd-boat-ratio",
  "tsd-medium-wind",
  "tsd-race-dist-beats",
  "tsd-race-time-beats",
  "tsd-race-start",
  "tsd-race-dead-heat",
  "tsd-circ-first-meet",
  "tsd-circ-start-meet",
  "tsd-circ-distinct-points",
  "tsd-circ-relative-lap",
  "tsd-esc-with-flow",
  "tsd-esc-stationary",
  "tsd-faulty-speedometer",
] as const;

const TSD_BOAT_MOTIF_IDS = [
  "tsd-boat-basic",
  "tsd-boat-inverse",
  "tsd-boat-round-trip",
  "tsd-boat-ratio",
  "tsd-medium-wind",
] as const;

const TSD_TRAIN_MOTIF_IDS = [
  "tsd-train-pole",
  "tsd-train-platform",
  "tsd-train-moving-man",
  "tsd-train-crossing",
  "tsd-train-window-man",
] as const;

const TSD_RACE_MOTIF_IDS = [
  "tsd-race-dist-beats",
  "tsd-race-time-beats",
  "tsd-race-start",
  "tsd-race-dead-heat",
] as const;

const TSD_CIRCULAR_MOTIF_IDS = [
  "tsd-circ-first-meet",
  "tsd-circ-start-meet",
  "tsd-circ-distinct-points",
  "tsd-circ-relative-lap",
] as const;

const AVERAGE_CHANGE_MOTIF_IDS = [
  "avg-change-inclusion",
  "avg-change-exclusion",
  "avg-change-replacement",
  "avg-correction-misread",
  "avg-change-double-inclusion",
  "avg-change-join-leave",
  "avg-change-months",
] as const;

const AVERAGE_SEQUENCE_MOTIF_IDS = [
  "avg-seq-consecutive",
  "avg-seq-shift",
  "avg-seq-ap",
  "avg-seq-even",
  "avg-seq-odd",
  "avg-seq-variable",
] as const;

const AVERAGE_WEIGHTED_MOTIF_IDS = [
  "avg-weight-combine",
  "avg-weight-missing-n",
  "avg-weight-missing-a",
  "avg-weight-three-group",
  "avg-weight-salary",
  "avg-weight-production",
  "avg-weight-ratio-balance",
] as const;

const AVERAGE_APPLICATION_MOTIF_IDS = [
  "avg-app-cricket-batting",
  "avg-app-cricket-bowling",
  "avg-app-age-family",
  "avg-app-temp-weekly",
  "avg-app-score-target",
  "avg-app-expenditure",
  "avg-app-zero-score",
] as const;

const AVERAGE_ALGEBRAIC_MOTIF_IDS = [
  "avg-alg-deviation",
  "avg-alg-max-min",
  "avg-alg-variable",
  "avg-alg-overlap-boundary",
  "avg-alg-first-last-overlap",
  "avg-alg-insufficient-data",
  "avg-alg-fraction-result",
  "avg-alg-deviation-missing",
] as const;

const AVERAGE_BALANCE_MOTIF_IDS = [
  ...AVERAGE_CHANGE_MOTIF_IDS,
  ...AVERAGE_SEQUENCE_MOTIF_IDS,
  ...AVERAGE_WEIGHTED_MOTIF_IDS,
  ...AVERAGE_APPLICATION_MOTIF_IDS,
  ...AVERAGE_ALGEBRAIC_MOTIF_IDS,
] as const;

const NUMERIC_PROPERTY_CLASSIFICATION_MOTIF_IDS = [
  "num-class-id",
  "num-class-prime-check",
  "num-class-integers",
  "num-class-rational-irrational",
  "num-class-smallest",
] as const;

const NUMERIC_PROPERTY_DIVISIBILITY_MOTIF_IDS = [
  "num-div-basic",
  "num-div-combined",
  "num-div-unknown",
  "num-div-11-unknown",
  "num-div-missing-number",
] as const;

const NUMERIC_PROPERTY_REMAINDER_MOTIF_IDS = [
  "num-rem-basic",
  "num-rem-power",
  "num-rem-successive",
  "num-rem-negative",
  "num-rem-fermat",
  "num-rem-chinese-basic",
] as const;

const NUMERIC_PROPERTY_FACTOR_MOTIF_IDS = [
  "num-fact-count",
  "num-fact-sum",
  "num-fact-trailing-zeros",
  "num-fact-highest-power",
  "num-fact-proper",
  "num-factorial-divisibility",
] as const;

const NUMERIC_PROPERTY_UNIT_DIGIT_MOTIF_IDS = [
  "num-unit-digit",
  "num-unit-series",
  "num-last-two-digits",
  "num-unit-product",
  "num-unit-zero-power",
] as const;

const NUMERIC_PROPERTY_SURD_INDEX_MOTIF_IDS = [
  "num-surd-compare",
  "num-simpl-vbodmas",
  "num-simpl-recurring",
  "num-recurring-pure",
  "num-index-laws",
  "num-surd-simplify",
  "num-perfect-square-check",
  "num-perfect-cube-check",
  "num-hcf-lcm-relation",
  "num-lcm-multiples",
  "num-base-conversion",
  "num-digit-count",
  "num-divisibility-range-count",
] as const;

const NUMERIC_PROPERTY_MOTIF_IDS = [
  ...NUMERIC_PROPERTY_CLASSIFICATION_MOTIF_IDS,
  ...NUMERIC_PROPERTY_DIVISIBILITY_MOTIF_IDS,
  ...NUMERIC_PROPERTY_REMAINDER_MOTIF_IDS,
  ...NUMERIC_PROPERTY_FACTOR_MOTIF_IDS,
  ...NUMERIC_PROPERTY_UNIT_DIGIT_MOTIF_IDS,
  ...NUMERIC_PROPERTY_SURD_INDEX_MOTIF_IDS,
] as const;

const SIMPLIFICATION_VBODMAS_MOTIF_IDS = [
  "sim-vbodmas-basic",
  "sim-vbodmas-bracket",
  "sim-vbodmas-of",
  "sim-vbodmas-vinculum",
  "sim-vbodmas-mixed-fraction",
  "sim-unit-conversion",
  "sim-percent-of-chain",
] as const;

const SIMPLIFICATION_ROOT_MOTIF_IDS = [
  "sim-root-square",
  "sim-root-cube",
  "sim-root-approx",
  "sim-root-decimal",
  "sim-root-surd-add",
  "sim-root-rationalize",
  "sim-root-cube-decimal",
] as const;

const SIMPLIFICATION_FRACTION_DECIMAL_MOTIF_IDS = [
  "sim-frac-nested",
  "sim-frac-compare",
  "sim-dec-recurring",
  "sim-dec-mixed-recurring",
  "sim-frac-complex",
  "sim-frac-illegal-cancel",
  "sim-frac-ascending",
  "sim-dec-fraction-blend",
] as const;

const SIMPLIFICATION_ALGEBRAIC_MOTIF_IDS = [
  "sim-alg-ident",
  "sim-alg-cube-id",
  "sim-alg-square-near",
  "sim-alg-product-near",
  "sim-alg-ratio-cancel",
  "sim-alg-surd-conjugate",
] as const;

const SIMPLIFICATION_INDEX_MOTIF_IDS = [
  "sim-index-basic",
  "sim-index-comparison",
  "sim-index-zero",
  "sim-index-negative-base",
  "sim-index-fractional",
  "sim-index-illegal-merge",
  "sim-index-power-tower-small",
] as const;

const SIMPLIFICATION_MOTIF_IDS = [
  ...SIMPLIFICATION_VBODMAS_MOTIF_IDS,
  ...SIMPLIFICATION_ROOT_MOTIF_IDS,
  ...SIMPLIFICATION_FRACTION_DECIMAL_MOTIF_IDS,
  ...SIMPLIFICATION_ALGEBRAIC_MOTIF_IDS,
  ...SIMPLIFICATION_INDEX_MOTIF_IDS,
] as const;

const MENSURATION_MOTIF_IDS = [
  "men-tri-ratio",
  "men-rect-path-in",
  "men-rect-path-out",
  "men-rhom-diag",
  "men-trap-parallel",
  "men-circ-revolution",
  "men-circ-sector",
  "men-poly-diag",
  "men-poly-angle",
  "men-boundary-bend",
  "men-cube-diagonal",
  "men-cuboid-surface-shift",
  "men-prism-base",
  "men-cyl-csa-ratio",
  "men-cone-canvas",
  "men-sph-hem-tsa",
  "men-cone-sphere-recast",
  "men-cyl-wire",
  "men-frustum-vol",
  "men-hollow-cyl",
  "men-inscribed-max",
  "men-ice-cream",
  "men-pyramid-slant",
  "men-scale-area",
  "men-scale-vol",
  "men-max-perimeter",
] as const;

const GEOMETRY_MOTIF_IDS = [
  "geo-ang-parallel",
  "geo-ang-bisector",
  "geo-ang-complement",
  "geo-ang-polygon",
  "geo-tri-inequality",
  "geo-tri-orthocenter",
  "geo-tri-circumcenter",
  "geo-tri-incenter",
  "geo-tri-centroid",
  "geo-tri-med-length",
  "geo-tri-area-ratio",
  "geo-tri-exterior-angle",
  "geo-tri-isosceles-base",
  "geo-sim-basic",
  "geo-sim-area",
  "geo-cong-proof",
  "geo-tri-thales",
  "geo-right-pythagoras",
  "geo-right-altitude",
  "geo-right-30-60-90",
  "geo-right-45-45-90",
  "geo-circ-chord-dist",
  "geo-circ-intersect-chord",
  "geo-circ-tangent-secant",
  "geo-circ-cyclic-quad",
  "geo-circ-alternate-segment",
  "geo-circ-direct-common",
  "geo-circ-trans-common",
  "geo-circ-angle-center",
  "geo-circ-semicircle",
  "geo-quad-parallelogram",
  "geo-quad-rhombus-diag",
  "geo-quad-trapezium-mid",
  "geo-poly-interior",
  "geo-poly-diagonal",
  "geo-quad-kite",
  "geo-coord-dist",
  "geo-coord-section",
  "geo-coord-slope",
  "geo-coord-area",
  "geo-coord-circle",
  "geo-coord-midpoint",
] as const;

const GEOMETRY_LINES_ANGLES_MOTIF_IDS = [
  "geo-ang-parallel",
  "geo-ang-bisector",
  "geo-ang-complement",
  "geo-ang-polygon",
] as const;

const GEOMETRY_TRIANGLE_MOTIF_IDS = [
  "geo-tri-inequality",
  "geo-tri-orthocenter",
  "geo-tri-circumcenter",
  "geo-tri-incenter",
  "geo-tri-centroid",
  "geo-tri-med-length",
  "geo-tri-area-ratio",
  "geo-tri-exterior-angle",
  "geo-tri-isosceles-base",
  "geo-right-pythagoras",
  "geo-right-altitude",
  "geo-right-30-60-90",
  "geo-right-45-45-90",
] as const;

const GEOMETRY_SIMILARITY_MOTIF_IDS = [
  "geo-sim-basic",
  "geo-sim-area",
  "geo-cong-proof",
  "geo-tri-thales",
] as const;

const GEOMETRY_CIRCLE_MOTIF_IDS = [
  "geo-circ-chord-dist",
  "geo-circ-intersect-chord",
  "geo-circ-tangent-secant",
  "geo-circ-cyclic-quad",
  "geo-circ-alternate-segment",
  "geo-circ-direct-common",
  "geo-circ-trans-common",
  "geo-circ-angle-center",
  "geo-circ-semicircle",
] as const;

const GEOMETRY_COORDINATE_MOTIF_IDS = [
  "geo-coord-dist",
  "geo-coord-section",
  "geo-coord-slope",
  "geo-coord-area",
  "geo-coord-circle",
  "geo-coord-midpoint",
] as const;

const ALGEBRA_MOTIF_IDS = [
  "alg-id-basic",
  "alg-id-cubic",
  "alg-id-triple",
  "alg-id-cond-sum",
  "alg-id-cond-diff",
  "alg-simplify-cyclic",
  "alg-factor-remainder",
  "alg-poly-factor",
  "alg-lin-simult",
  "alg-lin-consistency",
  "alg-lin-word-problem",
  "alg-lin-parameter",
  "alg-quad-roots",
  "alg-quad-nature",
  "alg-quad-coeff-rel",
  "alg-quad-construct",
  "alg-quad-common-root",
  "alg-newton-sums",
  "alg-quad-complete-square",
  "alg-quad-param-root",
  "alg-ineq-linear",
  "alg-ineq-quad",
  "alg-mod-eqn",
  "alg-mod-ineq",
  "alg-ineq-rational",
  "alg-mod-nested",
  "alg-func-domain",
  "alg-func-range",
  "alg-func-composite",
  "alg-func-even-odd",
  "alg-func-inverse",
  "alg-func-value-param",
  "alg-log-basic",
  "alg-log-base-change",
  "alg-log-eqn",
  "alg-log-domain",
  "alg-log-exponent",
  "alg-exp-eqn",
  "alg-max-min-quad",
  "alg-am-gm-opt",
  "alg-max-product-fixed-sum",
  "alg-min-sum-recip",
  "alg-sequence-ap",
  "alg-sequence-gp",
  "alg-binomial-middle",
] as const;

const ALGEBRA_IDENTITY_MOTIF_IDS = [
  "alg-id-basic",
  "alg-id-cubic",
  "alg-id-triple",
  "alg-id-cond-sum",
  "alg-id-cond-diff",
  "alg-simplify-cyclic",
  "alg-factor-remainder",
  "alg-poly-factor",
] as const;

const ALGEBRA_LINEAR_MOTIF_IDS = [
  "alg-lin-simult",
  "alg-lin-consistency",
  "alg-lin-word-problem",
  "alg-lin-parameter",
] as const;

const ALGEBRA_QUADRATIC_MOTIF_IDS = [
  "alg-quad-roots",
  "alg-quad-nature",
  "alg-quad-coeff-rel",
  "alg-quad-construct",
  "alg-quad-common-root",
  "alg-newton-sums",
  "alg-quad-complete-square",
  "alg-quad-param-root",
] as const;

const ALGEBRA_INEQUALITY_MOTIF_IDS = [
  "alg-ineq-linear",
  "alg-ineq-quad",
  "alg-mod-eqn",
  "alg-mod-ineq",
  "alg-ineq-rational",
  "alg-mod-nested",
] as const;

const ALGEBRA_FUNCTION_MOTIF_IDS = [
  "alg-func-domain",
  "alg-func-range",
  "alg-func-composite",
  "alg-func-even-odd",
  "alg-func-inverse",
  "alg-func-value-param",
] as const;

const ALGEBRA_LOG_MOTIF_IDS = [
  "alg-log-basic",
  "alg-log-base-change",
  "alg-log-eqn",
  "alg-log-domain",
  "alg-log-exponent",
  "alg-exp-eqn",
] as const;

const ALGEBRA_OPTIMIZATION_MOTIF_IDS = [
  "alg-max-min-quad",
  "alg-am-gm-opt",
  "alg-max-product-fixed-sum",
  "alg-min-sum-recip",
] as const;

const EQUATION_MOTIF_IDS = [
  "eqn-lin-single",
  "eqn-lin-simultaneous",
  "eqn-lin-consistency",
  "eqn-lin-integer-only",
  "eqn-lin-parameter",
  "eqn-lin-fractional",
  "eqn-quad-factor",
  "eqn-quad-formula",
  "eqn-quad-nature",
  "eqn-quad-vieta",
  "eqn-quad-construct",
  "eqn-quad-symmetric",
  "eqn-quad-common-root",
  "eqn-quad-equal-roots-param",
  "eqn-quad-sign-roots",
  "eqn-poly-cubic",
  "eqn-special-reciprocal",
  "eqn-special-reducible",
  "eqn-special-radical",
  "eqn-special-fractional",
  "eqn-mod-single",
  "eqn-mod-double",
  "eqn-mod-nested",
  "eqn-mod-interval-count",
  "eqn-word-age",
  "eqn-word-digits",
  "eqn-word-fixed-variable",
  "eqn-word-geometry",
  "eqn-word-mixture-count",
  "eqn-word-motion-linear",
  "eqn-word-work-rate",
  "eqn-word-break-even",
  "eqn-root-ap",
  "eqn-root-gp",
  "eqn-param-common-solution",
] as const;

const EQUATION_LINEAR_MOTIF_IDS = [
  "eqn-lin-single",
  "eqn-lin-simultaneous",
] as const;

const EQUATION_QUADRATIC_MOTIF_IDS = [
  "eqn-quad-factor",
  "eqn-quad-formula",
  "eqn-quad-vieta",
  "eqn-quad-symmetric",
] as const;

const EQUATION_SPECIAL_MOTIF_IDS = [
  "eqn-poly-cubic",
  "eqn-special-reciprocal",
  "eqn-special-reducible",
  "eqn-special-radical",
  "eqn-special-fractional",
  "eqn-root-ap",
  "eqn-root-gp",
] as const;

const EQUATION_MODULUS_MOTIF_IDS = [
  "eqn-mod-single",
  "eqn-mod-double",
  "eqn-mod-nested",
  "eqn-mod-interval-count",
] as const;

const EQUATION_WORD_MOTIF_IDS = [
  "eqn-word-age",
  "eqn-word-digits",
  "eqn-word-fixed-variable",
  "eqn-word-geometry",
  "eqn-word-mixture-count",
  "eqn-word-motion-linear",
  "eqn-word-work-rate",
  "eqn-word-break-even",
] as const;

const PROGRESSION_MOTIF_IDS = [
  "prog-ap-term",
  "prog-ap-sum",
  "prog-ap-middle",
  "prog-ap-property",
  "prog-ap-series-id",
  "prog-ap-arithmetic-mean",
  "prog-ap-partial-sum",
  "prog-gp-term",
  "prog-gp-sum",
  "prog-gp-infinite",
  "prog-gp-property",
  "prog-gp-rebound",
  "prog-gp-fractional-ratio",
  "prog-gp-log-growth",
  "prog-hp-basic",
  "prog-mean-relation",
  "prog-hp-average-speed",
  "prog-mean-insert-geometric",
  "prog-spec-natural",
  "prog-spec-squares",
  "prog-spec-cubes",
  "prog-spec-telescopic",
  "prog-spec-agp",
  "prog-spec-sigma-linear",
  "prog-spec-odd-sum",
  "prog-spec-even-sum",
  "prog-alg-log-link",
  "prog-alg-roots",
  "prog-alg-n-split",
  "prog-alg-find-n-from-sum",
  "prog-alg-common-diff-from-sum",
  "prog-alg-common-ratio-from-terms",
  "prog-recursive-linear",
  "prog-recursive-geometric",
  "prog-series-mixed-difference",
] as const;

const PROGRESSION_AP_MOTIF_IDS = [
  "prog-ap-term",
  "prog-ap-sum",
  "prog-ap-middle",
  "prog-ap-property",
  "prog-ap-series-id",
  "prog-ap-arithmetic-mean",
  "prog-ap-partial-sum",
  "prog-recursive-linear",
] as const;

const PROGRESSION_GP_MOTIF_IDS = [
  "prog-gp-term",
  "prog-gp-sum",
  "prog-gp-infinite",
  "prog-gp-property",
  "prog-gp-rebound",
  "prog-gp-fractional-ratio",
  "prog-gp-log-growth",
  "prog-recursive-geometric",
] as const;

const PROGRESSION_HP_MEAN_MOTIF_IDS = [
  "prog-hp-basic",
  "prog-mean-relation",
  "prog-hp-average-speed",
  "prog-mean-insert-geometric",
] as const;

const PROGRESSION_SPECIAL_SERIES_MOTIF_IDS = [
  "prog-spec-natural",
  "prog-spec-squares",
  "prog-spec-cubes",
  "prog-spec-telescopic",
  "prog-spec-agp",
  "prog-spec-sigma-linear",
  "prog-spec-odd-sum",
  "prog-spec-even-sum",
  "prog-series-mixed-difference",
] as const;

const PROGRESSION_ALGEBRAIC_MOTIF_IDS = [
  "prog-alg-log-link",
  "prog-alg-roots",
  "prog-alg-n-split",
  "prog-alg-find-n-from-sum",
  "prog-alg-common-diff-from-sum",
  "prog-alg-common-ratio-from-terms",
] as const;

const PROBABILITY_MOTIF_IDS = [
  "prob-sample-coins",
  "prob-sample-dice-sum",
  "prob-sample-cards",
  "prob-sample-balls-bag",
  "prob-sample-number-grid",
  "prob-event-independent",
  "prob-event-complement",
  "prob-event-mutually-exclusive",
  "prob-event-overlap",
  "prob-event-atmost",
  "prob-draw-sequential-with",
  "prob-draw-sequential-without",
  "prob-draw-simultaneous",
  "prob-draw-atleast-one",
  "prob-conditional-basic",
  "prob-bayes-theorem",
  "prob-binomial-distribution",
  "prob-geometric-chance",
  "prob-conditional-card",
  "prob-venn-2-set",
  "prob-venn-3-set",
  "prob-odds-conversion",
  "prob-venn-none",
  "prob-reliability-parallel",
  "prob-quality-defective",
] as const;

const PROBABILITY_SAMPLE_SPACE_MOTIF_IDS = [
  "prob-sample-coins",
  "prob-sample-dice-sum",
  "prob-sample-cards",
  "prob-sample-balls-bag",
  "prob-sample-number-grid",
] as const;

const PROBABILITY_EVENT_MOTIF_IDS = [
  "prob-event-independent",
  "prob-event-complement",
  "prob-event-mutually-exclusive",
  "prob-event-overlap",
  "prob-event-atmost",
  "prob-reliability-parallel",
] as const;

const PROBABILITY_DRAWING_MOTIF_IDS = [
  "prob-draw-sequential-with",
  "prob-draw-sequential-without",
  "prob-draw-simultaneous",
  "prob-draw-atleast-one",
  "prob-quality-defective",
] as const;

const PROBABILITY_CONDITIONAL_MOTIF_IDS = [
  "prob-conditional-basic",
  "prob-bayes-theorem",
  "prob-binomial-distribution",
  "prob-geometric-chance",
  "prob-conditional-card",
] as const;

const PROBABILITY_VENN_ODDS_MOTIF_IDS = [
  "prob-venn-2-set",
  "prob-venn-3-set",
  "prob-odds-conversion",
  "prob-venn-none",
] as const;

const FUNCTION_MOTIF_IDS = [
  "func-def-id",
  "func-domain-basic",
  "func-range-basic",
  "func-eval-direct",
  "func-eval-piecewise",
  "func-map-many-one",
  "func-type-injectivity",
  "func-type-surjectivity",
  "func-type-parity",
  "func-type-periodic",
  "func-type-bounded",
  "func-op-algebra",
  "func-comp-basic",
  "func-comp-iterative",
  "func-inverse-find",
  "func-inverse-property",
  "func-comp-domain",
  "func-spec-modulus",
  "func-spec-gif",
  "func-spec-fractional",
  "func-spec-exp-log",
  "func-spec-signum",
  "func-eqn-additive",
  "func-eqn-multiplicative",
  "func-eqn-power",
  "func-eqn-recursive",
  "func-graph-shift",
  "func-graph-reflect",
  "func-graph-intersect",
  "func-graph-scale",
  "func-domain-root",
  "func-domain-log",
  "func-range-quadratic",
  "func-inverse-existence",
  "func-piecewise-continuity",
] as const;

const FUNCTION_DOMAIN_RANGE_MOTIF_IDS = [
  "func-domain-basic",
  "func-range-basic",
  "func-domain-root",
  "func-domain-log",
  "func-range-quadratic",
  "func-piecewise-continuity",
] as const;

const FUNCTION_TYPE_MOTIF_IDS = [
  "func-def-id",
  "func-map-many-one",
  "func-type-injectivity",
  "func-type-surjectivity",
  "func-type-parity",
  "func-type-periodic",
  "func-type-bounded",
  "func-inverse-existence",
] as const;

const FUNCTION_COMPOSITION_INVERSE_MOTIF_IDS = [
  "func-op-algebra",
  "func-comp-basic",
  "func-comp-iterative",
  "func-inverse-find",
  "func-inverse-property",
  "func-comp-domain",
] as const;

const FUNCTION_SPECIAL_MOTIF_IDS = [
  "func-spec-modulus",
  "func-spec-gif",
  "func-spec-fractional",
  "func-spec-exp-log",
  "func-spec-signum",
] as const;

const FUNCTION_FUNCTIONAL_EQUATION_MOTIF_IDS = [
  "func-eqn-additive",
  "func-eqn-multiplicative",
  "func-eqn-power",
  "func-eqn-recursive",
] as const;

const FUNCTION_GRAPH_MOTIF_IDS = [
  "func-graph-shift",
  "func-graph-reflect",
  "func-graph-intersect",
  "func-graph-scale",
] as const;

const COORDINATE_GEOMETRY_MOTIF_IDS = [
  "coord-dist-basic",
  "coord-midpoint",
  "coord-section-internal",
  "coord-section-external",
  "coord-centroid-tri",
  "coord-slope-find",
  "coord-line-eqn-point-slope",
  "coord-line-eqn-two-point",
  "coord-line-intercept-form",
  "coord-rel-parallel",
  "coord-rel-perp",
  "coord-line-intersection",
  "coord-slope-angle",
  "coord-line-general-slope",
  "coord-line-axis-intercepts",
  "coord-area-tri",
  "coord-collinear-check",
  "coord-quad-id",
  "coord-area-quad",
  "coord-dist-point-line",
  "coord-dist-parallel-lines",
  "coord-reflect-axis",
  "coord-reflect-line",
  "coord-translation-point",
  "coord-circ-eqn-center",
  "coord-circ-general-to-center",
  "coord-circ-tangent",
  "coord-circle-diameter",
  "coord-circle-point-position",
  "coord-circle-line-intersection-count",
  "coord-locus-distance-origin",
  "coord-locus-equidistant-two-points",
  "coord-concurrency-lines",
  "coord-orthocenter-right",
  "coord-median-length",
] as const;

const COORDINATE_POINT_MOTIF_IDS = [
  "coord-dist-basic",
  "coord-midpoint",
  "coord-section-internal",
  "coord-section-external",
  "coord-centroid-tri",
] as const;

const COORDINATE_LINE_MOTIF_IDS = [
  "coord-slope-find",
  "coord-line-eqn-point-slope",
  "coord-line-eqn-two-point",
  "coord-line-intercept-form",
  "coord-rel-parallel",
  "coord-rel-perp",
  "coord-line-intersection",
  "coord-slope-angle",
  "coord-line-general-slope",
  "coord-line-axis-intercepts",
] as const;

const COORDINATE_AREA_PROPERTY_MOTIF_IDS = [
  "coord-area-tri",
  "coord-collinear-check",
  "coord-quad-id",
  "coord-area-quad",
] as const;

const COORDINATE_DISTANCE_REFLECTION_MOTIF_IDS = [
  "coord-dist-point-line",
  "coord-dist-parallel-lines",
  "coord-reflect-axis",
  "coord-reflect-line",
  "coord-translation-point",
] as const;

const COORDINATE_CIRCLE_MOTIF_IDS = [
  "coord-circ-eqn-center",
  "coord-circ-general-to-center",
  "coord-circ-tangent",
  "coord-circle-diameter",
  "coord-circle-point-position",
  "coord-circle-line-intersection-count",
] as const;

const COORDINATE_LOCUS_ADVANCED_MOTIF_IDS = [
  "coord-locus-distance-origin",
  "coord-locus-equidistant-two-points",
  "coord-concurrency-lines",
  "coord-orthocenter-right",
  "coord-median-length",
] as const;

const SET_THEORY_MOTIF_IDS = [
  "set-def-id",
  "set-subsets-count",
  "set-power-set",
  "set-membership",
  "set-empty-cardinality",
  "set-op-union",
  "set-op-intersection",
  "set-op-difference",
  "set-op-complement",
  "set-op-sym-diff",
  "set-op-disjoint-union",
  "set-venn-2-basic",
  "set-venn-2-only",
  "set-venn-2-max-min",
  "set-venn-2-neither",
  "set-venn-2-percent",
  "set-venn-3-basic",
  "set-venn-3-exactly-k",
  "set-venn-3-at-least",
  "set-venn-3-none",
  "set-venn-3-only-one",
  "set-venn-3-region-fill",
  "set-alg-de-morgan",
  "set-alg-distributive",
  "set-cartesian-prod",
  "set-cartesian-list",
  "set-cardinality-identity",
  "set-sym-diff-cardinality",
  "set-relation-reflexive",
  "set-relation-symmetric",
  "set-relation-transitive",
  "set-relation-equivalence",
  "set-partition-count",
  "set-interval-union",
  "set-interval-intersection",
] as const;

const SET_THEORY_DEFINITION_MOTIF_IDS = [
  "set-def-id",
  "set-subsets-count",
  "set-power-set",
  "set-membership",
  "set-empty-cardinality",
] as const;

const SET_THEORY_OPERATION_MOTIF_IDS = [
  "set-op-union",
  "set-op-intersection",
  "set-op-difference",
  "set-op-complement",
  "set-op-sym-diff",
  "set-op-disjoint-union",
  "set-interval-union",
  "set-interval-intersection",
] as const;

const SET_THEORY_VENN_2_MOTIF_IDS = [
  "set-venn-2-basic",
  "set-venn-2-only",
  "set-venn-2-max-min",
  "set-venn-2-neither",
  "set-venn-2-percent",
] as const;

const SET_THEORY_VENN_3_MOTIF_IDS = [
  "set-venn-3-basic",
  "set-venn-3-exactly-k",
  "set-venn-3-at-least",
  "set-venn-3-none",
  "set-venn-3-only-one",
  "set-venn-3-region-fill",
] as const;

const SET_THEORY_ALGEBRA_CARTESIAN_MOTIF_IDS = [
  "set-alg-de-morgan",
  "set-alg-distributive",
  "set-cartesian-prod",
  "set-cartesian-list",
  "set-cardinality-identity",
  "set-sym-diff-cardinality",
] as const;

const SET_THEORY_RELATION_MOTIF_IDS = [
  "set-relation-reflexive",
  "set-relation-symmetric",
  "set-relation-transitive",
  "set-relation-equivalence",
  "set-partition-count",
] as const;

const PC_MOTIF_IDS = [
  "pc-fpc-mul",
  "pc-fpc-add",
  "pc-digit-formation",
  "pc-digit-zero",
  "pc-perm-distinct",
  "pc-perm-identical",
  "pc-perm-together",
  "pc-perm-never-together",
  "pc-perm-relative",
  "pc-circ-table",
  "pc-circ-necklace",
  "pc-circ-constrained",
  "pc-comb-basic",
  "pc-comb-committee",
  "pc-handshake",
  "pc-geom-lines",
  "pc-geom-triangles",
  "pc-geom-diagonals",
  "pc-rank-word",
  "pc-dist-distinct",
  "pc-dist-identical",
  "pc-dearrangement",
  "pc-grid-path",
  "pc-password-repeat",
  "pc-word-vowels-together",
  "pc-selection-atleast",
  "pc-selection-atmost",
  "pc-distribution-positive",
  "pc-circular-alternate",
  "pc-binomial-coefficient",
  "pc-path-restricted",
  "pc-arrange-books-grouped",
] as const;

const PC_FUNDAMENTAL_MOTIF_IDS = [
  "pc-fpc-mul",
  "pc-fpc-add",
  "pc-digit-formation",
  "pc-digit-zero",
] as const;

const PC_PERMUTATION_MOTIF_IDS = [
  "pc-perm-distinct",
  "pc-perm-identical",
  "pc-perm-together",
  "pc-perm-never-together",
  "pc-perm-relative",
] as const;

const PC_COMBINATION_MOTIF_IDS = [
  "pc-comb-basic",
  "pc-comb-committee",
  "pc-handshake",
  "pc-selection-atleast",
  "pc-selection-atmost",
] as const;

const PC_CIRCULAR_MOTIF_IDS = [
  "pc-circ-table",
  "pc-circ-necklace",
  "pc-circ-constrained",
  "pc-circular-alternate",
] as const;

const PC_GEOMETRY_COUNTING_MOTIF_IDS = [
  "pc-geom-lines",
  "pc-geom-triangles",
  "pc-geom-diagonals",
] as const;

const PC_ADVANCED_MOTIF_IDS = [
  "pc-rank-word",
  "pc-dist-distinct",
  "pc-dist-identical",
  "pc-dearrangement",
  "pc-grid-path",
  "pc-distribution-positive",
  "pc-binomial-coefficient",
  "pc-path-restricted",
] as const;

const TRIG_MOTIF_IDS = [
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

const TRIG_RATIO_MOTIF_IDS = [
  "trig-ratio-sides",
  "trig-ratio-solve",
  "trig-reciprocal-id",
  "trig-pythagorean-sum",
] as const;

const TRIG_STANDARD_VALUE_MOTIF_IDS = [
  "trig-val-eval",
  "trig-val-power",
  "trig-val-eqn",
  "trig-equation-standard",
] as const;

const TRIG_COMPLEMENTARY_MOTIF_IDS = [
  "trig-comp-shift",
  "trig-comp-series-prod",
  "trig-comp-series-sum",
] as const;

const TRIG_HD_MOTIF_IDS = [
  "trig-hd-elevation",
  "trig-hd-two-point",
  "trig-hd-depression",
  "trig-hd-shadow",
  "trig-hd-broken-tree",
  "trig-hd-ladder",
  "trig-hd-opposite-points",
] as const;

const TRIG_IDENTITY_MOTIF_IDS = [
  "trig-alg-sec-tan-link",
  "trig-alg-csc-cot-link",
  "trig-id-double-angle",
  "trig-max-min",
  "trig-expression-simplify",
] as const;

const TRIG_QUADRANT_MOTIF_IDS = [
  "trig-quad-sign",
  "trig-reduction-large",
] as const;

const MENSURATION_2D_MOTIF_IDS = [
  "men-tri-ratio",
  "men-rect-path-in",
  "men-rect-path-out",
  "men-rhom-diag",
  "men-trap-parallel",
  "men-circ-revolution",
  "men-circ-sector",
  "men-poly-diag",
  "men-poly-angle",
  "men-boundary-bend",
] as const;

const MENSURATION_3D_MOTIF_IDS = [
  "men-cube-diagonal",
  "men-prism-base",
  "men-cyl-csa-ratio",
  "men-cone-canvas",
  "men-sph-hem-tsa",
  "men-cone-sphere-recast",
  "men-cyl-wire",
  "men-frustum-vol",
  "men-hollow-cyl",
  "men-inscribed-max",
  "men-ice-cream",
  "men-pyramid-slant",
] as const;

const MENSURATION_RECASTING_MOTIF_IDS = [
  "men-boundary-bend",
  "men-cone-sphere-recast",
  "men-cyl-wire",
  "men-inscribed-max",
] as const;

const MENSURATION_SCALING_MOTIF_IDS = [
  "men-cuboid-surface-shift",
  "men-scale-area",
  "men-scale-vol",
  "men-max-perimeter",
] as const;

export const MOTIF_REGISTRY: Motif[] = [
  {
    canonicalName: "sparse-anchor",
    aliases: [
      "seating-sparse-anchor",
      "sparse_anchor",
      "ssc_simple_row",
    ],
    domain: "reasoning",
    topic: "seating-arrangement",
    tags: ["seating", "anchor"],
    generationHints: [
      "Use fewer direct fixed positions.",
    ],
    difficultyHints: [
      "Best for medium and hard seating.",
    ],
  },
  {
    canonicalName: "indirect-elimination",
    aliases: [
      "seating-indirect-elimination",
      "double_row_elimination",
      "banking_parallel_row",
    ],
    domain: "reasoning",
    topic: "seating-arrangement",
    tags: ["elimination", "constraint"],
  },
  {
    canonicalName: "orientation-flip",
    aliases: [
      "seating-orientation-inversion",
      "alternate_facing_deduction",
      "row_facing_inference",
      "banking_alternate_row",
    ],
    domain: "reasoning",
    topic: "seating-arrangement",
    tags: ["orientation", "left-right"],
  },
  {
    canonicalName: "circular-opposite",
    aliases: [
      "circular_opposite_chain",
      "ssc_circular_basic",
    ],
    domain: "reasoning",
    topic: "seating-arrangement",
    tags: ["circular", "opposite"],
  },
  {
    canonicalName: "con-floor-fixed",
    aliases: ["floor-fixed", "fixed-floor"],
    domain: "reasoning",
    topic: "engine-constraint",
    tags: ["vertical", "slot", "floor"],
  },
  {
    canonicalName: "con-floor-gap",
    aliases: ["floor-gap", "vertical-gap"],
    domain: "reasoning",
    topic: "engine-constraint",
    tags: ["vertical", "gap"],
  },
  {
    canonicalName: "con-floor-parity",
    aliases: ["floor-parity", "even-odd-floor"],
    domain: "reasoning",
    topic: "engine-constraint",
    tags: ["vertical", "parity"],
  },
  {
    canonicalName: "con-box-stack",
    aliases: ["box-stack", "stack-immediate"],
    domain: "reasoning",
    topic: "engine-constraint",
    tags: ["vertical", "stack"],
  },
  {
    canonicalName: "con-sched-sequence",
    aliases: ["schedule-sequence", "fixed-day"],
    domain: "reasoning",
    topic: "engine-constraint",
    tags: ["temporal", "schedule"],
  },
  {
    canonicalName: "con-sched-relative",
    aliases: ["schedule-relative", "day-offset"],
    domain: "reasoning",
    topic: "engine-constraint",
    tags: ["temporal", "relative"],
  },
  {
    canonicalName: "con-sched-weekend",
    aliases: ["weekend-exclusion"],
    domain: "reasoning",
    topic: "engine-constraint",
    tags: ["temporal", "pruning"],
  },
  {
    canonicalName: "con-mapping-triad",
    aliases: ["triad-mapping", "person-slot-attribute"],
    domain: "reasoning",
    topic: "engine-constraint",
    tags: ["mapping", "attribute"],
  },
  {
    canonicalName: "con-mapping-negative",
    aliases: ["negative-mapping", "attribute-exclusion"],
    domain: "reasoning",
    topic: "engine-constraint",
    tags: ["mapping", "negative"],
  },
  {
    canonicalName: "reverse-percentage",
    aliases: [
      "reverse_percentage_inference",
      "reverse-percentage-bridge",
    ],
    domain: "quant",
    topic: "percentage",
  },
  {
    canonicalName: "hidden-base-shift",
    aliases: ["hidden_base_percentage"],
    domain: "quant",
    topic: "percentage",
  },
  {
    canonicalName:
      "basic-mean-construction",
    aliases: ["sum-recovery"],
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName:
      "incremental-join-leave",
    aliases: [
      "age-average-shift",
      "multi-stage-average-update",
    ],
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName:
      "replacement-shift-net",
    aliases: [
      "replacement-average-shift",
    ],
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName:
      "overlap-boundary-logic",
    aliases: [
      "overlap-average-reconstruction",
    ],
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName:
      "correction-misread-data",
    aliases: [
      "correction-delta-adjustment",
    ],
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName:
      "symmetry-consecutive",
    aliases: [
      "consecutive-middle-term",
    ],
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName:
      "weighted-composite-avg",
    aliases: [
      "group-weighted-average",
      "weighted-average-confusion",
      "average-speed-harmonic",
    ],
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName:
      "cricket-performance",
    aliases: [
      "score-target-reconstruction",
    ],
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName: "weighted-average-confusion",
    domain: "quant",
    topic: "averages",
    distractorHints: [
      "Use simple average as a trap option.",
    ],
  },
  {
    canonicalName: "sum-recovery",
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName:
      "replacement-average-shift",
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName:
      "overlap-average-reconstruction",
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName:
      "correction-delta-adjustment",
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName:
      "group-weighted-average",
    aliases: [
      "weighted-average-confusion",
    ],
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName:
      "consecutive-middle-term",
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName:
      "age-average-shift",
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName:
      "score-target-reconstruction",
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName:
      "average-speed-harmonic",
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName:
      "multi-stage-average-update",
    domain: "quant",
    topic: "averages",
  },
  {
    canonicalName: "tw-basic-2-sum",
    aliases: [
      "basic-unit-rate",
      "simple-combined-work",
    ],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-basic-3-sum",
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-component-extract",
    aliases: ["inverse-work-trap"],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-eff-integer",
    aliases: [
      "efficiency-numerical",
      "worker-equivalence",
      "efficiency-substitution",
    ],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-eff-pct-boost",
    aliases: ["efficiency-percentage"],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-eff-pct-reduce",
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-comparison-hidden",
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-stage-join-start",
    aliases: [
      "stage-join-delayed",
      "delayed-join",
    ],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-stage-leave-start",
    aliases: ["stage-leave-start"],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-stage-deadline-exit",
    aliases: ["stage-leave-end"],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-stage-asymmetric-3",
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-stage-handoff",
    aliases: [
      "work-partial-target",
      "work-variable-rate",
    ],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-stage-staggered-join",
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-cycle-alternate-2",
    aliases: [
      "cyclic-simple",
      "alternating-operation",
    ],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-cycle-alternate-3",
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-cycle-assist-single",
    aliases: ["cyclic-assisted"],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-cycle-assist-group",
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-cycle-helper-toggle",
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-group-mdh-standard",
    aliases: [
      "chain-rule-mdh",
      "resource-consumption",
    ],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-group-equivalence-or",
    aliases: ["group-bridge-or"],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-group-system-and",
    aliases: ["group-bridge-and"],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-contractor-pressure",
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-wage-efficiency",
    aliases: ["wage-efficiency"],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-wage-work-done",
    aliases: ["wage-days-worked"],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-pipe-fill-leak",
    aliases: [
      "pipe-filling-leak",
      "positive-negative-competition",
    ],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-pipe-clock-sync",
    aliases: [
      "pipe-sequential",
      "pipe-capacity-volume",
    ],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-pipe-threshold",
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "tw-regressive-climb",
    aliases: ["negative-work-destroy"],
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "subject-verb-mismatch",
    aliases: ["subject_verb_ambiguity"],
    domain: "english",
    topic: "error-spotting",
  },
  {
    canonicalName: "tense-confusion",
    domain: "english",
    topic: "error-spotting",
  },
  {
    canonicalName: "percentage-heavy-calculations",
    domain: "di",
    topic: "table-di",
  },
  {
    canonicalName: "approximation-friendly-datasets",
    domain: "di",
    topic: "bar-graph",
  },
  {
    canonicalName: "di-growth-rate",
    aliases: ["growth-rate-di"],
    domain: "di",
    topic: "data-interpretation",
  },
  {
    canonicalName: "di-contribution",
    aliases: ["category-share-di"],
    domain: "di",
    topic: "data-interpretation",
  },
  {
    canonicalName: "di-projection",
    aliases: ["trend-projection-di"],
    domain: "di",
    topic: "data-interpretation",
  },
  {
    canonicalName: "di-avg-subset",
    aliases: ["subset-average-di"],
    domain: "di",
    topic: "data-interpretation",
  },
  {
    canonicalName: "profit-discount-trap",
    domain: "quant",
    topic: "profit-loss",
    distractorHints: [
      "Confuse profit amount with profit percentage.",
    ],
  },
  {
    canonicalName:
      "base-percentage-transformation",
    aliases: ["profit-discount-trap"],
    domain: "quant",
    topic: "profit-loss",
  },
  {
    canonicalName:
      "multiplicative-percentage-chaining",
    aliases: [
      "successive-discount-margin",
    ],
    domain: "quant",
    topic: "profit-loss",
  },
  {
    canonicalName:
      "hidden-base-tracking",
    aliases: ["discount-profit-link"],
    domain: "quant",
    topic: "profit-loss",
  },
  {
    canonicalName:
      "quantity-manipulation-profit",
    domain: "quant",
    topic: "profit-loss",
  },
  {
    canonicalName:
      "markup-discount-compression",
    domain: "quant",
    topic: "profit-loss",
  },
  {
    canonicalName:
      "equivalent-change-reduction",
    domain: "quant",
    topic: "profit-loss",
  },
  {
    canonicalName:
      "ratio-based-profit-reconstruction",
    domain: "quant",
    topic: "profit-loss",
  },
  {
    canonicalName:
      "multi-state-transaction-flow",
    domain: "quant",
    topic: "profit-loss",
  },
  {
    canonicalName:
      "si-basic-amount",
    aliases: [
      "linear-interest-accumulation",
    ],
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "si-find-principal",
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "si-multiple-times",
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "si-rate-shift",
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "si-split-investment",
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "si-equal-interest",
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "si-equal-amount",
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "ci-basic-calc",
    aliases: [
      "multiplicative-growth",
      "compounding-trap",
    ],
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "ci-varying-rate",
    aliases: [
      "equivalent-multiplier-compression",
    ],
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName:
      "ci-compounding-period",
    aliases: [
      "effective-period-transformation",
      "interest-period-trap",
    ],
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "ci-fractional-time",
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "ci-multiple-times",
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName:
      "ci-population-growth",
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "delta-2-year",
    aliases: [
      "interest-on-interest-detection",
    ],
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "delta-3-year",
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "delta-reverse",
    aliases: [
      "interest-difference-backsolve",
    ],
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "ci-from-si",
    aliases: [
      "comparative-interest-systems",
    ],
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "si-installment",
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "ci-installment",
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "ci-loan-repayment",
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "ci-continuous",
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName:
      "ci-growth-regression",
    aliases: ["compound-decay"],
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName:
      "si-changing-principal",
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName:
      "ci-effective-annual-rate",
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName:
      "transaction-arbitrage",
    domain: "quant",
    topic: "si-ci",
  },
  {
    canonicalName: "mixture-weighted-average",
    aliases: [
      "weighted-mixture-shift",
    ],
    domain: "quant",
    topic: "mixture-alligation",
  },
  {
    canonicalName:
      "weighted-contribution",
    aliases: [
      "mixture-weighted-average",
      "weighted-mixture-shift",
    ],
    domain: "quant",
    topic: "mixture-alligation",
  },
  {
    canonicalName:
      "inverse-distance-balancing",
    domain: "quant",
    topic: "mixture-alligation",
  },
  {
    canonicalName:
      "composition-state-tracking",
    aliases: [
      "replacement-alligation",
    ],
    domain: "quant",
    topic: "mixture-alligation",
  },
  {
    canonicalName:
      "concentration-decay",
    domain: "quant",
    topic: "mixture-alligation",
  },
  {
    canonicalName:
      "ratio-reconstruction",
    domain: "quant",
    topic: "mixture-alligation",
  },
  {
    canonicalName:
      "cost-profit-blend",
    domain: "quant",
    topic: "mixture-alligation",
  },
  {
    canonicalName:
      "multi-phase-purity-transition",
    domain: "quant",
    topic: "mixture-alligation",
  },
  {
    canonicalName: "age-shift-equation",
    aliases: ["equation-balance-shift"],
    domain: "quant",
    topic: "ages",
  },
  {
    canonicalName: "pipes-efficiency-rate",
    aliases: ["inverse-work-trap"],
    domain: "quant",
    topic: "pipes-cisterns",
  },
  ...TSD_MOTIF_IDS.map((canonicalName) => ({
    canonicalName,
    aliases:
      canonicalName ===
      "tsd-rel-same-dir"
        ? ["relative-speed-meet"]
        : canonicalName ===
            "tsd-train-platform"
          ? ["train-platform-offset"]
          : canonicalName ===
              "tsd-boat-basic"
            ? ["boats-relative-speed"]
            : undefined,
    domain: "quant" as const,
    topic:
      canonicalName.startsWith("tsd-boat") ||
      canonicalName === "tsd-medium-wind"
        ? "boats-streams"
        : "speed-time-distance",
  })),
  ...AVERAGE_BALANCE_MOTIF_IDS.map((canonicalName) => ({
    canonicalName,
    aliases:
      canonicalName === "avg-change-replacement"
        ? ["replacement-shift-net"]
        : canonicalName === "avg-weight-combine"
          ? ["weighted-composite-avg"]
          : canonicalName ===
              "avg-alg-overlap-boundary"
            ? ["overlap-boundary-logic"]
            : canonicalName ===
                "avg-correction-misread"
              ? ["correction-misread-data"]
              : canonicalName ===
                  "avg-app-cricket-batting"
                ? ["cricket-performance"]
                : undefined,
    domain: "quant" as const,
    topic: "averages",
  })),
  ...NUMERIC_PROPERTY_MOTIF_IDS.map((canonicalName) => ({
    canonicalName,
    aliases:
      canonicalName === "num-div-unknown"
        ? ["unknown-digit-divisibility"]
        : canonicalName === "num-rem-successive"
          ? ["successive-remainder-backcalculation"]
          : canonicalName ===
              "num-fact-trailing-zeros"
            ? ["factorial-trailing-zero-count"]
            : canonicalName === "num-simpl-recurring"
              ? ["mixed-recurring-decimal"]
              : canonicalName === "num-surd-compare"
                ? ["surd-comparison-common-power"]
                : undefined,
    domain: "quant" as const,
    topic: "number-system",
  })),
  ...SIMPLIFICATION_MOTIF_IDS.map((canonicalName) => ({
    canonicalName,
    aliases:
      canonicalName === "sim-frac-nested"
        ? ["continued-fraction-simplification"]
        : canonicalName === "sim-dec-recurring"
          ? ["recurring-decimal-simplification"]
          : canonicalName === "sim-index-comparison"
            ? ["index-power-comparison"]
            : canonicalName === "sim-root-rationalize"
              ? ["surd-rationalization"]
              : canonicalName === "sim-vbodmas-of"
                ? ["of-before-division"]
                : undefined,
    domain: "quant" as const,
    topic: "simplification",
  })),
  {
    canonicalName: "arithmetic-order-trap",
    aliases: ["bodmas-sequencing"],
    domain: "quant",
    topic: "simplification",
  },
  {
    canonicalName:
      "divisibility-filter",
    domain: "quant",
    topic: "number-system",
  },
  {
    canonicalName:
      "divisibility-remainder",
    domain: "quant",
    topic: "number-system",
  },
  {
    canonicalName:
      "unit-digit-cycle",
    domain: "quant",
    topic: "number-system",
  },
  {
    canonicalName:
      "remainder-reduction",
    domain: "quant",
    topic: "number-system",
  },
  {
    canonicalName:
      "factorial-trailing-zero",
    domain: "quant",
    topic: "number-system",
  },
  {
    canonicalName:
      "recurring-decimal-reconstruction",
    domain: "quant",
    topic: "number-system",
  },
  {
    canonicalName:
      "divisor-count-prime-exponents",
    domain: "quant",
    topic: "number-system",
  },
  {
    canonicalName:
      "perfect-power-balance",
    domain: "quant",
    topic: "number-system",
  },
  {
    canonicalName:
      "fraction-cancellation-chain",
    domain: "quant",
    topic: "fundamentals",
  },
  {
    canonicalName:
      "decimal-fraction-normalization",
    domain: "quant",
    topic: "fundamentals",
  },
  {
    canonicalName:
      "hcf-lcm-reconstruction",
    domain: "quant",
    topic: "fundamentals",
  },
  {
    canonicalName:
      "surd-factor-extraction",
    domain: "quant",
    topic: "fundamentals",
  },
  {
    canonicalName:
      "index-law-compression",
    domain: "quant",
    topic: "fundamentals",
  },
  {
    canonicalName: "geometry-area-base",
    domain: "quant",
    topic: "geometry-basics",
  },
  {
    canonicalName:
      "bridge-unification-nested",
    aliases: [
      "ratio-normalization-switch",
    ],
    domain: "quant",
    topic: "ratio-proportion",
  },
  {
    canonicalName:
      "transform-mapping-coins",
    domain: "quant",
    topic: "ratio-proportion",
  },
  {
    canonicalName:
      "invariant-difference-ages",
    aliases: ["age-ratio-state-shift"],
    domain: "quant",
    topic: "ratio-proportion",
  },
  {
    canonicalName:
      "mixture-replacement-recursive",
    domain: "quant",
    topic: "ratio-proportion",
  },
  {
    canonicalName:
      "distribution-constraint-adjusted",
    aliases: [
      "weighted-ratio-distribution",
    ],
    domain: "quant",
    topic: "ratio-proportion",
  },
  {
    canonicalName:
      "income-expenditure-cross-balance",
    aliases: [
      "partnership-ratio-switch",
    ],
    domain: "quant",
    topic: "ratio-proportion",
  },
  {
    canonicalName:
      "variation-power-broken-object",
    aliases: [
      "variation-dependency-switch",
    ],
    domain: "quant",
    topic: "ratio-proportion",
  },
  ...MENSURATION_MOTIF_IDS.map((canonicalName) => ({
    canonicalName,
    aliases:
      canonicalName === "men-scale-area"
        ? [
            "mensuration-dimension-shift",
            "dimension-scale-effect",
          ]
        : canonicalName ===
            "men-ice-cream"
          ? ["composite-shape-breakdown"]
          : undefined,
    domain: "quant" as const,
    topic: "mensuration",
  })),
  ...GEOMETRY_MOTIF_IDS.map((canonicalName) => ({
    canonicalName,
    aliases:
      canonicalName === "geo-right-pythagoras"
        ? [
            "pythagorean-triple",
            "right-triangle-hypotenuse",
          ]
        : canonicalName === "geo-sim-basic"
          ? ["similar-triangle-side-ratio"]
          : canonicalName === "geo-circ-tangent-secant"
            ? ["circle-tangent-secant-product"]
            : canonicalName === "geo-coord-dist"
              ? ["coordinate-distance-formula"]
              : undefined,
    domain: "quant" as const,
    topic: "geometry",
  })),
  ...ALGEBRA_MOTIF_IDS.map((canonicalName) => ({
    canonicalName,
    aliases:
      canonicalName === "alg-id-basic"
        ? ["algebra-square-identity"]
        : canonicalName === "alg-quad-roots"
          ? ["quadratic-root-factorization"]
          : canonicalName === "alg-log-basic"
            ? ["logarithm-basic-rules"]
            : canonicalName === "alg-max-min-quad"
              ? ["quadratic-vertex-optimization"]
              : undefined,
    domain: "quant" as const,
    topic: "algebra",
  })),
  ...EQUATION_MOTIF_IDS.map((canonicalName) => ({
    canonicalName,
    aliases:
      canonicalName === "eqn-lin-single"
        ? ["single-variable-linear-equation"]
        : canonicalName === "eqn-lin-simultaneous"
          ? ["simultaneous-linear-equations"]
          : canonicalName === "eqn-quad-factor"
            ? ["quadratic-factorization-equation"]
            : canonicalName === "eqn-quad-vieta"
              ? ["vieta-root-relation"]
              : canonicalName === "eqn-mod-single"
                ? ["absolute-value-equation"]
                : undefined,
    domain: "quant" as const,
    topic: "equations",
  })),
  ...PROGRESSION_MOTIF_IDS.map((canonicalName) => ({
    canonicalName,
    aliases:
      canonicalName === "prog-ap-term"
        ? ["ap-nth-term"]
        : canonicalName === "prog-gp-term"
          ? ["gp-nth-term"]
          : canonicalName === "prog-spec-telescopic"
            ? ["telescopic-series"]
            : canonicalName === "prog-mean-relation"
              ? ["am-gm-hm-relation"]
              : undefined,
    domain: "quant" as const,
    topic: "progressions",
  })),
  ...PROBABILITY_MOTIF_IDS.map((canonicalName) => ({
    canonicalName,
    aliases:
      canonicalName === "prob-sample-balls-bag"
        ? [
            "probability-favourable-total",
            "favorable-over-total",
          ]
        : canonicalName === "prob-draw-simultaneous"
          ? ["probability-ncr-draw"]
          : canonicalName === "prob-event-complement"
            ? ["at-least-one-complement"]
            : canonicalName === "prob-bayes-theorem"
              ? ["posterior-probability"]
              : undefined,
    domain: "quant" as const,
    topic: "probability",
  })),
  ...FUNCTION_MOTIF_IDS.map((canonicalName) => ({
    canonicalName,
    aliases:
      canonicalName === "func-domain-basic"
        ? ["function-domain-exclusion"]
        : canonicalName === "func-comp-basic"
          ? ["function-composition-basic"]
          : canonicalName === "func-inverse-find"
            ? ["inverse-function-value"]
            : canonicalName === "func-spec-gif"
              ? ["greatest-integer-function"]
              : canonicalName === "func-graph-shift"
                ? ["function-graph-transformation"]
                : undefined,
    domain: "quant" as const,
    topic: "functions",
  })),
  ...COORDINATE_GEOMETRY_MOTIF_IDS.map((canonicalName) => ({
    canonicalName,
    aliases:
      canonicalName === "coord-dist-basic"
        ? ["cartesian-distance-formula"]
        : canonicalName ===
            "coord-section-internal"
          ? ["internal-section-formula"]
          : canonicalName ===
              "coord-dist-point-line"
            ? ["point-line-distance"]
            : canonicalName ===
                "coord-circ-general-to-center"
              ? ["circle-general-form-center"]
              : canonicalName ===
                  "coord-locus-equidistant-two-points"
                ? ["perpendicular-bisector-locus"]
                : undefined,
    domain: "quant" as const,
    topic: "coordinate-geometry",
  })),
  ...SET_THEORY_MOTIF_IDS.map((canonicalName) => ({
    canonicalName,
    aliases:
      canonicalName === "set-venn-2-basic"
        ? ["two-set-inclusion-exclusion"]
        : canonicalName ===
            "set-venn-3-exactly-k"
          ? ["exactly-two-venn-regions"]
          : canonicalName ===
              "set-alg-de-morgan"
            ? ["de-morgan-set-law"]
            : canonicalName ===
                "set-cartesian-prod"
              ? ["cartesian-product-cardinality"]
              : canonicalName ===
                  "set-subsets-count"
                ? ["subset-counting"]
                : undefined,
    domain: "quant" as const,
    topic: "set-theory",
  })),
  ...PC_MOTIF_IDS.map((canonicalName) => ({
    canonicalName,
    aliases:
      canonicalName === "pc-comb-basic"
        ? ["basic-combination-selection"]
        : canonicalName === "pc-perm-distinct"
          ? ["basic-permutation-arrangement"]
          : canonicalName === "pc-handshake"
            ? ["counting-unordered-pairs"]
            : canonicalName === "pc-grid-path"
              ? ["shortest-grid-path-counting"]
              : undefined,
    domain: "quant" as const,
    topic: "permutation-combination",
  })),
  ...TRIG_MOTIF_IDS.map((canonicalName) => ({
    canonicalName,
    aliases:
      canonicalName === "trig-ratio-sides"
        ? ["soh-cah-toa-ratio"]
        : canonicalName === "trig-hd-elevation"
          ? ["angle-elevation-height"]
          : canonicalName === "trig-val-eval"
            ? ["standard-angle-evaluation"]
            : canonicalName === "trig-max-min"
              ? ["trig-expression-maximum"]
              : undefined,
    domain: "quant" as const,
    topic: "trigonometry",
  })),
  {
    canonicalName: "counting-pair-selection",
    domain: "quant",
    topic: "permutation-combination",
  },
  {
    canonicalName: "direction-turn-chain",
    aliases: [
      "simple_turn_tracking",
      "orientation_shift_chain",
      "spa-dir-pythagoras",
      "spa-dir-degrees",
    ],
    domain: "reasoning",
    topic: "direction-sense",
  },
  {
    canonicalName: "spa-dir-shadow",
    aliases: [
      "shadow-direction",
    ],
    domain: "reasoning",
    topic: "engine-spatial",
  },
  {
    canonicalName: "spa-dice-logic",
    aliases: [
      "dice-opposite-face",
      "cube-dice-logic",
    ],
    domain: "reasoning",
    topic: "engine-spatial",
  },
  {
    canonicalName: "spa-cube-painting",
    aliases: [
      "painted-cube-counting",
    ],
    domain: "reasoning",
    topic: "engine-spatial",
  },
  {
    canonicalName: "spa-cube-folding",
    aliases: [
      "cube-net-folding",
    ],
    domain: "reasoning",
    topic: "engine-spatial",
  },
  {
    canonicalName: "spa-img-mirror",
    aliases: [
      "mirror-image",
      "vertical-reflection",
    ],
    domain: "reasoning",
    topic: "engine-spatial",
  },
  {
    canonicalName: "spa-img-water",
    aliases: [
      "water-image",
      "horizontal-reflection",
    ],
    domain: "reasoning",
    topic: "engine-spatial",
  },
  {
    canonicalName: "spa-paper-fold",
    aliases: [
      "paper-folding",
      "paper-cutting",
    ],
    domain: "reasoning",
    topic: "engine-spatial",
  },
  {
    canonicalName: "family-relation-chain",
    aliases: [
      "generation_gap_reasoning",
      "indirect_relation_deduction",
      "rel-chain",
      "rel-pointing",
    ],
    domain: "reasoning",
    topic: "blood-relation",
  },
  {
    canonicalName: "rel-coded-id",
    aliases: [
      "coded-relation-construction",
      "operator-kinship-code",
    ],
    domain: "reasoning",
    topic: "engine-relational",
  },
  {
    canonicalName: "rel-coded-eval",
    aliases: [
      "coded-relation-evaluation",
      "symbolic-family-expression",
    ],
    domain: "reasoning",
    topic: "engine-relational",
  },
  {
    canonicalName: "rel-missing",
    aliases: [
      "partial-family-tree-count",
    ],
    domain: "reasoning",
    topic: "engine-relational",
  },
  {
    canonicalName: "rel-puzzle-matrix",
    aliases: [
      "family-tree-puzzle",
      "kinship-attribute-matrix",
    ],
    domain: "reasoning",
    topic: "engine-relational",
  },
  {
    canonicalName: "symbolic-comparison-chain",
    aliases: [
      "compound_inequality_linking",
      "indirect_conclusion_validation",
      "ded-ineq-chain",
    ],
    domain: "reasoning",
    topic: "inequality",
  },
  {
    canonicalName: "ded-ineq-coded",
    aliases: [
      "coded-inequality",
      "banking-coded-inequality",
    ],
    domain: "reasoning",
    topic: "engine-boolean",
  },
  {
    canonicalName: "ded-ineq-either",
    aliases: [
      "either-or-inequality",
      "equality-split",
    ],
    domain: "reasoning",
    topic: "engine-boolean",
  },
  {
    canonicalName: "shift-fixed",
    aliases: [
      "alphabet-transform",
      "direct_alphabet_shift",
    ],
    domain: "reasoning",
    topic: "coding-decoding",
  },
  {
    canonicalName: "shift-incremental",
    aliases: [
      "inference_based_decoding",
      "incremental-alphabet-shift",
    ],
    domain: "reasoning",
    topic: "engine-pattern",
  },
  {
    canonicalName: "shift-alternating",
    aliases: [
      "alternating-alphabet-shift",
    ],
    domain: "reasoning",
    topic: "engine-pattern",
  },
  {
    canonicalName: "shift-vowel-consonant",
    aliases: [
      "conditional_letter_mapping",
      "vowel-consonant-shift",
    ],
    domain: "reasoning",
    topic: "engine-pattern",
  },
  {
    canonicalName: "map-opposite",
    aliases: [
      "reverse_alphabet_mapping",
      "opposite-alphabet-map",
    ],
    domain: "reasoning",
    topic: "engine-pattern",
  },
  {
    canonicalName: "map-cross",
    aliases: [
      "multi_stage_word_transform",
      "cross-position-map",
    ],
    domain: "reasoning",
    topic: "engine-pattern",
  },
  {
    canonicalName: "map-rank-math",
    aliases: [
      "symbolic_position_encoding",
      "rank-sum",
    ],
    domain: "reasoning",
    topic: "engine-pattern",
  },
  {
    canonicalName: "math-power",
    aliases: [
      "power-pattern-series",
    ],
    domain: "reasoning",
    topic: "engine-pattern",
  },
  {
    canonicalName: "math-difference-layer",
    aliases: [
      "second-difference-series",
    ],
    domain: "reasoning",
    topic: "engine-pattern",
  },
  {
    canonicalName: "math-interleaved",
    aliases: [
      "interleaved-series",
    ],
    domain: "reasoning",
    topic: "engine-pattern",
  },
  {
    canonicalName: "rank-offset",
    aliases: ["ordering-dual-rank-offset"],
    domain: "reasoning",
    topic: "ordering-ranking",
  },
  {
    canonicalName: "ded-syl-definite",
    aliases: [
      "venn-conclusion-filter",
      "venn-overlap-filter",
      "definite-syllogism",
    ],
    domain: "reasoning",
    topic: "syllogism",
  },
  {
    canonicalName: "ded-syl-possibility",
    aliases: [
      "possibility-syllogism",
    ],
    domain: "reasoning",
    topic: "engine-boolean",
  },
  {
    canonicalName: "ded-syl-negative",
    aliases: [
      "only-few-syllogism",
      "negative-syllogism",
    ],
    domain: "reasoning",
    topic: "engine-boolean",
  },
  {
    canonicalName: "ded-venn-ident",
    aliases: [
      "logical-venn-identification",
    ],
    domain: "reasoning",
    topic: "engine-boolean",
  },
  {
    canonicalName: "ded-venn-math",
    aliases: [
      "logical-venn-math",
      "venn-cardinality",
    ],
    domain: "reasoning",
    topic: "engine-boolean",
  },
  {
    canonicalName: "tem-cal-day-find",
    aliases: [
      "calendar-day-find",
      "absolute-date-weekday",
    ],
    domain: "reasoning",
    topic: "engine-temporal",
  },
  {
    canonicalName: "tem-cal-ref-shift",
    aliases: [
      "calendar-reference-shift",
      "day-shift",
    ],
    domain: "reasoning",
    topic: "engine-temporal",
  },
  {
    canonicalName: "tem-cal-repetition",
    aliases: [
      "same-calendar-year",
      "calendar-repetition",
    ],
    domain: "reasoning",
    topic: "engine-temporal",
  },
  {
    canonicalName: "tem-clk-angle",
    aliases: [
      "clock-angle",
      "angle-between-hands",
    ],
    domain: "reasoning",
    topic: "engine-temporal",
  },
  {
    canonicalName: "tem-clk-overlap",
    aliases: [
      "clock-overlap",
      "coincident-hands",
    ],
    domain: "reasoning",
    topic: "engine-temporal",
  },
  {
    canonicalName: "tem-clk-faulty",
    aliases: [
      "faulty-clock",
      "gaining-clock",
      "losing-clock",
    ],
    domain: "reasoning",
    topic: "engine-temporal",
  },
  {
    canonicalName: "cri-inf-assumption",
    aliases: [
      "statement-assumption",
      "implicit-assumption",
    ],
    domain: "reasoning",
    topic: "engine-critical",
  },
  {
    canonicalName: "cri-inf-conclusion",
    aliases: [
      "statement-conclusion",
      "definite-conclusion",
    ],
    domain: "reasoning",
    topic: "engine-critical",
  },
  {
    canonicalName: "cri-inf-action",
    aliases: [
      "course-of-action",
      "pragmatic-action",
    ],
    domain: "reasoning",
    topic: "engine-critical",
  },
  {
    canonicalName: "cri-inf-cause",
    aliases: [
      "cause-effect",
      "causal-inference",
    ],
    domain: "reasoning",
    topic: "engine-critical",
  },
  {
    canonicalName: "cri-inf-argument",
    aliases: [
      "strong-weak-argument",
      "argument-strength",
    ],
    domain: "reasoning",
    topic: "engine-critical",
  },
  {
    canonicalName: "abs-series",
    aliases: [
      "figure-series",
      "non-verbal-series",
      "matrix-transposition",
    ],
    domain: "reasoning",
    topic: "engine-abstract",
  },
  {
    canonicalName: "abs-paper-cutting",
    aliases: [
      "paper-cutting",
      "paper-folding-cutting",
    ],
    domain: "reasoning",
    topic: "engine-abstract",
  },
  {
    canonicalName: "abs-embedded",
    aliases: [
      "embedded-figure",
      "hidden-figure",
    ],
    domain: "reasoning",
    topic: "engine-abstract",
  },
  {
    canonicalName: "line-trend-comparison",
    domain: "di",
    topic: "line-graph",
  },
  {
    canonicalName: "mixed-di-cross-series",
    aliases: ["cross_series_comparison"],
    domain: "di",
    topic: "mixed-di",
  },
];

export const QUESTION_PATTERN_REGISTRY: QuestionPattern[] =
  [
    {
      id: "linear-seating",
      domain: "reasoning",
      topic: "seating-arrangement",
      label: "Linear Seating",
      description:
        "Straight-line seating with left/right and neighbour clues.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "sparse-anchor",
        "indirect-elimination",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "circular-seating",
      domain: "reasoning",
      topic: "seating-arrangement",
      label: "Circular Seating",
      description:
        "Circular or table seating with centre/outward orientation.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "circular-opposite",
        "sparse-anchor",
        "indirect-elimination",
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "parallel-row",
      domain: "reasoning",
      topic: "seating-arrangement",
      label: "Parallel Row",
      description:
        "Two-row seating with opposite-facing and orientation clues.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "sparse-anchor",
        "indirect-elimination",
        "orientation-flip",
      ],
      examStyles: ["banking", "cat"],
      enabled: true,
    },
    {
      id: "floor-puzzle",
      domain: "reasoning",
      topic: "puzzles",
      label: "Floor Puzzle",
      description:
        "Vertical Entity-to-Slot floor puzzle with fixed floor, gap, and parity constraints.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "con-floor-fixed",
        "con-floor-gap",
        "con-floor-parity",
      ],
      examStyles: ["banking"],
      enabled: true,
    },
    {
      id: "box-stack-puzzle",
      domain: "reasoning",
      topic: "puzzles",
      label: "Box Stack",
      description:
        "Vertical stack puzzle using above/below and immediate-neighbour constraints.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "con-box-stack",
        "con-floor-gap",
      ],
      examStyles: ["banking"],
      enabled: true,
    },
    {
      id: "scheduling-puzzle",
      domain: "reasoning",
      topic: "puzzles",
      label: "Scheduling Puzzle",
      description:
        "Temporal slot puzzle mapping events to weekdays with relative and excluded-day clues.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "con-sched-sequence",
        "con-sched-relative",
        "con-sched-weekend",
      ],
      examStyles: ["banking", "cat"],
      enabled: true,
    },
    {
      id: "constraint-mapping-triad",
      domain: "reasoning",
      topic: "puzzles",
      label: "Multi-Variable Mapping",
      description:
        "Triad mapping puzzle joining entity, slot, and attribute constraints.",
      supportedDifficulties: [
        "hard",
      ],
      compatibleMotifs: [
        "con-mapping-triad",
        "con-mapping-negative",
      ],
      examStyles: ["banking", "cat"],
      enabled: true,
    },
    {
      id: "percentage",
      domain: "quant",
      topic: "percentage",
      label: "Percentage",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...percentageMotifIds,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "ratio-proportion",
      domain: "quant",
      topic: "ratio-proportion",
      label: "Ratio & Proportion",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "ratio-normalization-switch",
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "time-work",
      domain: "quant",
      topic: "time-work",
      label: "Time & Work",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "tw-basic-2-sum",
        "tw-basic-3-sum",
        "tw-component-extract",
        "tw-eff-integer",
        "tw-eff-pct-boost",
        "tw-eff-pct-reduce",
        "tw-comparison-hidden",
        "tw-stage-join-start",
        "tw-stage-leave-start",
        "tw-stage-deadline-exit",
        "tw-stage-asymmetric-3",
        "tw-stage-handoff",
        "tw-stage-staggered-join",
        "tw-cycle-alternate-2",
        "tw-cycle-alternate-3",
        "tw-cycle-assist-single",
        "tw-cycle-assist-group",
        "tw-cycle-helper-toggle",
        "tw-group-mdh-standard",
        "tw-group-equivalence-or",
        "tw-group-system-and",
        "tw-contractor-pressure",
        "tw-wage-efficiency",
        "tw-wage-work-done",
        "tw-pipe-fill-leak",
        "tw-pipe-clock-sync",
        "tw-pipe-threshold",
        "tw-regressive-climb",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "time-work-phases",
      domain: "quant",
      topic: "time-work",
      label: "Time & Work: Phases",
      description:
        "Join, leave, delayed start, and variable-rate phase-transition problems.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "tw-stage-join-start",
        "tw-stage-leave-start",
        "tw-stage-deadline-exit",
        "tw-stage-asymmetric-3",
        "tw-stage-handoff",
        "tw-stage-staggered-join",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "time-work-efficiency",
      domain: "quant",
      topic: "time-work",
      label: "Time & Work: Efficiency",
      description:
        "Efficiency comparison, bridge-equivalence, and contribution-based wage questions.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "tw-eff-integer",
        "tw-eff-pct-boost",
        "tw-eff-pct-reduce",
        "tw-comparison-hidden",
        "tw-group-equivalence-or",
        "tw-group-system-and",
        "tw-wage-efficiency",
        "tw-wage-work-done",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "time-work-pipes",
      domain: "quant",
      topic: "time-work",
      label: "Time & Work: Pipes & Cisterns",
      description:
        "Pipe filling, leaks, staggered opening, and capacity-volume problems.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "tw-pipe-fill-leak",
        "tw-pipe-clock-sync",
        "tw-pipe-threshold",
        "tw-regressive-climb",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "speed-distance",
      domain: "quant",
      topic: "speed-time-distance",
      label: "Speed, Time & Distance",
      description:
        "Topology-driven TSD questions covering DST, average speed, relative motion, trains, boats, races, circular tracks, and escalators.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...TSD_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "speed-distance-trains",
      domain: "quant",
      topic: "speed-time-distance",
      label: "TSD: Trains",
      description:
        "Train crossing questions using effective distance and relative speed.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...TSD_TRAIN_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "speed-distance-races",
      domain: "quant",
      topic: "speed-time-distance",
      label: "TSD: Races",
      description:
        "Race beat-distance, beat-time, head-start, and dead-heat questions.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...TSD_RACE_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "speed-distance-circular",
      domain: "quant",
      topic: "speed-time-distance",
      label: "TSD: Circular Tracks",
      description:
        "Circular-track meeting, lapping, and starting-point recurrence questions.",
      supportedDifficulties: [
        "hard",
      ],
      compatibleMotifs: [
        ...TSD_CIRCULAR_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "speed-distance-boats",
      domain: "quant",
      topic: "speed-time-distance",
      label: "TSD: Boats & Wind",
      description:
        "Moving-medium questions for streams, wind, upstream/downstream, and round trips.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...TSD_BOAT_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "averages",
      domain: "quant",
      topic: "averages",
      label: "Averages",
      description:
        "SSC-style averages covering sum recovery, overlap reconstruction, correction adjustment, replacement, weighted groups, consecutive numbers, ages, score reconstruction, and average-speed connections.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...AVERAGE_BALANCE_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "averages-replacement",
      domain: "quant",
      topic: "averages",
      label: "Averages: Replacement",
      description:
        "Average increase-decrease and replacement delta propagation questions.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...AVERAGE_CHANGE_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "averages-weighted",
      domain: "quant",
      topic: "averages",
      label: "Averages: Weighted Groups",
      description:
        "Combined-group and weighted contribution average questions.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...AVERAGE_WEIGHTED_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "averages-consecutive",
      domain: "quant",
      topic: "averages",
      label: "Averages: Consecutive Numbers",
      description:
        "Middle-term compression for consecutive integer averages.",
      supportedDifficulties: [
        "easy",
        "medium",
      ],
      compatibleMotifs: [
        ...AVERAGE_SEQUENCE_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "averages-age-score",
      domain: "quant",
      topic: "averages",
      label: "Averages: Ages & Scores",
      description:
        "Age-shift and target-score average reconstruction questions.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...AVERAGE_APPLICATION_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "averages-corrections-overlaps",
      domain: "quant",
      topic: "averages",
      label: "Averages: Corrections & Overlaps",
      description:
        "Wrong-entry correction, overlapping-average, and hidden-total reconstruction questions.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "avg-correction-misread",
        "avg-app-temp-weekly",
        "avg-alg-overlap-boundary",
        "avg-alg-first-last-overlap",
        "avg-alg-deviation",
        "avg-alg-deviation-missing",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "averages-algebraic",
      domain: "quant",
      topic: "averages",
      label: "Averages: Algebraic Balance",
      description:
        "Deviation method, maximum/minimum integer constraints, overlap reconstruction, insufficiency checks, and fractional averages.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...AVERAGE_ALGEBRAIC_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "profit-loss",
      domain: "quant",
      topic: "profit-loss",
      label: "Profit & Loss",
      description:
        "SSC-style profit, loss, discount, markup, dishonest dealer, and multi-stage trade questions.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "base-percentage-transformation",
        "multiplicative-percentage-chaining",
        "hidden-base-tracking",
        "quantity-manipulation-profit",
        "markup-discount-compression",
        "equivalent-change-reduction",
        "ratio-based-profit-reconstruction",
        "multi-state-transaction-flow",
        "profit-discount-trap",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "profit-loss-discount",
      domain: "quant",
      topic: "profit-loss",
      label: "Profit & Loss: Discount & Markup",
      description:
        "Marked price, discount, markup, and selling price interaction questions.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "hidden-base-tracking",
        "markup-discount-compression",
        "multiplicative-percentage-chaining",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "profit-loss-dishonest-dealer",
      domain: "quant",
      topic: "profit-loss",
      label: "Profit & Loss: Dishonest Dealer",
      description:
        "False-weight and quantity-cheating profit questions.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "quantity-manipulation-profit",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "profit-loss-equivalent-change",
      domain: "quant",
      topic: "profit-loss",
      label: "Profit & Loss: Equivalent Change",
      description:
        "Successive increase-decrease and equivalent percentage effect questions.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "multiplicative-percentage-chaining",
        "equivalent-change-reduction",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "simple-compound-interest",
      domain: "quant",
      topic: "si-ci",
      label:
        "Simple & Compound Interest",
      description:
        "SSC-style simple interest, compound interest, SI-CI comparison, depreciation, and fractional compounding questions.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "si-basic-amount",
        "si-find-principal",
        "si-multiple-times",
        "si-rate-shift",
        "si-split-investment",
        "si-equal-interest",
        "si-equal-amount",
        "ci-basic-calc",
        "ci-varying-rate",
        "ci-compounding-period",
        "ci-fractional-time",
        "ci-multiple-times",
        "ci-population-growth",
        "delta-2-year",
        "delta-3-year",
        "delta-reverse",
        "ci-from-si",
        "si-installment",
        "ci-installment",
        "ci-loan-repayment",
        "ci-continuous",
        "ci-growth-regression",
        "si-changing-principal",
        "ci-effective-annual-rate",
        "transaction-arbitrage",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "simple-interest",
      domain: "quant",
      topic: "si-ci",
      label: "Simple Interest",
      description:
        "Direct simple interest, amount, and reverse principal reconstruction questions.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "si-basic-amount",
        "si-find-principal",
        "si-multiple-times",
        "si-rate-shift",
        "si-split-investment",
        "si-equal-interest",
        "si-equal-amount",
        "si-changing-principal",
        "si-installment",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "compound-interest",
      domain: "quant",
      topic: "si-ci",
      label: "Compound Interest",
      description:
        "Compound amount, SI-CI difference, and annual compounding questions.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "ci-basic-calc",
        "ci-varying-rate",
        "ci-compounding-period",
        "ci-fractional-time",
        "ci-multiple-times",
        "ci-population-growth",
        "ci-effective-annual-rate",
        "ci-continuous",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "interest-si-vs-ci",
      domain: "quant",
      topic: "si-ci",
      label: "Interest: SI vs CI",
      description:
        "Difference between simple and compound interest and comparative growth-model questions.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "delta-2-year",
        "delta-3-year",
        "delta-reverse",
        "ci-from-si",
        "transaction-arbitrage",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "interest-fractional-compounding",
      domain: "quant",
      topic: "si-ci",
      label:
        "Interest: Half-Yearly & Quarterly",
      description:
        "Half-yearly and quarterly compounding questions with rate-period transformation.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "ci-compounding-period",
        "ci-fractional-time",
        "ci-effective-annual-rate",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "interest-growth-decay",
      domain: "quant",
      topic: "si-ci",
      label:
        "Interest: Growth & Depreciation",
      description:
        "Compound growth, depreciation, and stage-wise multiplier compression questions.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "ci-population-growth",
        "ci-growth-regression",
        "ci-varying-rate",
        "transaction-arbitrage",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "mixture-alligation",
      domain: "quant",
      topic: "mixture-alligation",
      label: "Mixture & Alligation",
      description:
        "SSC-style mixture questions covering weighted blending, alligation, purity tracking, replacement, and repeated dilution.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "weighted-contribution",
        "inverse-distance-balancing",
        "composition-state-tracking",
        "concentration-decay",
        "ratio-reconstruction",
        "cost-profit-blend",
        "multi-phase-purity-transition",
        "mixture-weighted-average",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "mixture-alligation-alligation",
      domain: "quant",
      topic: "mixture-alligation",
      label: "Mixture & Alligation: Alligation",
      description:
        "Cross-difference alligation and ratio reconstruction questions.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "inverse-distance-balancing",
        "ratio-reconstruction",
        "cost-profit-blend",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "mixture-alligation-replacement",
      domain: "quant",
      topic: "mixture-alligation",
      label: "Mixture & Alligation: Replacement",
      description:
        "Single and repeated replacement with purity tracking.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "composition-state-tracking",
        "concentration-decay",
        "multi-phase-purity-transition",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "mixture-alligation-weighted",
      domain: "quant",
      topic: "mixture-alligation",
      label: "Mixture & Alligation: Weighted Blends",
      description:
        "Weighted contribution and mean-value mixture questions.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "weighted-contribution",
        "mixture-weighted-average",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "partnership",
      domain: "quant",
      topic: "partnership",
      label: "Partnership",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "ratio-normalization-switch",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "ages",
      domain: "quant",
      topic: "ages",
      label: "Ages",
      supportedDifficulties: [
        "easy",
        "medium",
      ],
      compatibleMotifs: [
        "age-shift-equation",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "pipes-cisterns",
      domain: "quant",
      topic: "pipes-cisterns",
      label: "Pipes & Cisterns",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "pipes-efficiency-rate",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "boats-streams",
      domain: "quant",
      topic: "boats-streams",
      label: "Boats & Streams",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...TSD_BOAT_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "fundamentals",
      domain: "quant",
      topic: "fundamentals",
      label: "Fundamentals",
      description:
        "Core SSC arithmetic covering simplification, fractions, decimals, HCF/LCM, divisibility, surds, indices, and unit-digit reasoning.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "bodmas-sequencing",
        "fraction-cancellation-chain",
        "decimal-fraction-normalization",
        "hcf-lcm-reconstruction",
        "surd-factor-extraction",
        "index-law-compression",
        "divisibility-filter",
        "unit-digit-cycle",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "fundamentals-fractions",
      domain: "quant",
      topic: "fundamentals",
      label: "Fundamentals: Fractions",
      description:
        "Fraction arithmetic, cancellation, and decimal-fraction normalization.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "fraction-cancellation-chain",
        "decimal-fraction-normalization",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "fundamentals-hcf-lcm",
      domain: "quant",
      topic: "fundamentals",
      label: "Fundamentals: HCF & LCM",
      description:
        "Reverse construction and identity-based HCF-LCM questions.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "hcf-lcm-reconstruction",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "fundamentals-surds-indices",
      domain: "quant",
      topic: "fundamentals",
      label: "Fundamentals: Surds & Indices",
      description:
        "Surd simplification and index-law compression questions.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "surd-factor-extraction",
        "index-law-compression",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "fundamentals-divisibility",
      domain: "quant",
      topic: "fundamentals",
      label: "Fundamentals: Divisibility & Unit Digit",
      description:
        "Shortcut-based divisibility and cyclic unit-digit questions.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "divisibility-filter",
        "unit-digit-cycle",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "simplification",
      domain: "quant",
      topic: "simplification",
      label: "Simplification",
      description:
        "Arithmetic processing questions covering VBODMAS, nested fractions, roots, recurring decimals, identities, and index laws.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...SIMPLIFICATION_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "simplification-vbodmas",
      domain: "quant",
      topic: "simplification",
      label: "Simplification: VBODMAS",
      description:
        "Operator hierarchy, brackets, vinculum, mixed fractions, units, and the Of operator.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...SIMPLIFICATION_VBODMAS_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "simplification-roots-surds",
      domain: "quant",
      topic: "simplification",
      label: "Simplification: Roots & Surds",
      description:
        "Square roots, cube roots, decimal roots, approximate roots, like surds, and rationalization.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...SIMPLIFICATION_ROOT_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "simplification-fractions-decimals",
      domain: "quant",
      topic: "simplification",
      label: "Simplification: Fractions & Decimals",
      description:
        "Nested fractions, comparison, recurring decimals, complex fractions, and decimal-fraction blends.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...SIMPLIFICATION_FRACTION_DECIMAL_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "simplification-identities",
      domain: "quant",
      topic: "simplification",
      label: "Simplification: Identities",
      description:
        "Difference of squares, cube identities, near-base products, and structural cancellation.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...SIMPLIFICATION_ALGEBRAIC_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "simplification-indices",
      domain: "quant",
      topic: "simplification",
      label: "Simplification: Indices",
      description:
        "Index laws, power comparison, zero powers, fractional exponents, and base-compatibility traps.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...SIMPLIFICATION_INDEX_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "number-system",
      domain: "quant",
      topic: "number-system",
      label: "Number System",
      description:
        "SSC-style number system questions covering divisibility, remainders, unit digits, factorials, recurring decimals, divisor counting, and perfect powers.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...NUMERIC_PROPERTY_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "number-system-divisibility",
      domain: "quant",
      topic: "number-system",
      label: "Number System: Divisibility & Remainders",
      description:
        "Divisibility filters, modular reduction, and remainder-based questions.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...NUMERIC_PROPERTY_DIVISIBILITY_MOTIF_IDS,
        ...NUMERIC_PROPERTY_REMAINDER_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "number-system-unit-digit",
      domain: "quant",
      topic: "number-system",
      label: "Number System: Unit Digit",
      description:
        "Cycle-based unit-digit questions.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...NUMERIC_PROPERTY_UNIT_DIGIT_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "number-system-factorials",
      domain: "quant",
      topic: "number-system",
      label: "Number System: Factorials",
      description:
        "Trailing zero and factorial divisibility questions.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...NUMERIC_PROPERTY_FACTOR_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "number-system-recurring-decimals",
      domain: "quant",
      topic: "number-system",
      label: "Number System: Recurring Decimals",
      description:
        "Recurring decimal reconstruction into fractions.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "num-simpl-recurring",
        "num-recurring-pure",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "number-system-perfect-powers",
      domain: "quant",
      topic: "number-system",
      label: "Number System: Perfect Powers",
      description:
        "Divisor count, perfect square, and perfect cube balance questions.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "num-perfect-square-check",
        "num-perfect-cube-check",
        "num-hcf-lcm-relation",
        "num-lcm-multiples",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "number-system-classification",
      domain: "quant",
      topic: "number-system",
      label: "Number System: Classification",
      description:
        "Prime, composite, rational, irrational, real-number classification, and integer-series properties.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...NUMERIC_PROPERTY_CLASSIFICATION_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "number-system-remainders",
      domain: "quant",
      topic: "number-system",
      label: "Number System: Remainders",
      description:
        "Modular arithmetic, power remainders, negative remainders, Fermat-style cycles, and successive remainder reconstruction.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...NUMERIC_PROPERTY_REMAINDER_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "number-system-factors",
      domain: "quant",
      topic: "number-system",
      label: "Number System: Factors & Multiples",
      description:
        "Factor counts, sum of factors, proper factors, HCF-LCM relations, and factorial divisibility.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...NUMERIC_PROPERTY_FACTOR_MOTIF_IDS,
        "num-hcf-lcm-relation",
        "num-lcm-multiples",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "number-system-surds-indices",
      domain: "quant",
      topic: "number-system",
      label: "Number System: Surds & Indices",
      description:
        "Surd comparison, surd simplification, index laws, recurring decimals, VBODMAS, base conversion, and digit-count logic.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...NUMERIC_PROPERTY_SURD_INDEX_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "algebra-basics",
      domain: "quant",
      topic: "algebra",
      label: "Algebra Basics",
      description:
        "MathJax-rendered algebra questions covering identities, equations, quadratics, functions, logarithms, and optimization.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ALGEBRA_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "algebra",
      domain: "quant",
      topic: "algebra",
      label: "Algebra",
      description:
        "Full symbolic algebra generation with strict MathJax for variables, equations, identities, operators, roots, and logarithms.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ALGEBRA_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "algebra-identities",
      domain: "quant",
      topic: "algebra",
      label: "Algebra: Identities",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ALGEBRA_IDENTITY_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "algebra-linear",
      domain: "quant",
      topic: "algebra",
      label: "Algebra: Linear Equations",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ALGEBRA_LINEAR_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "algebra-quadratic",
      domain: "quant",
      topic: "algebra",
      label: "Algebra: Quadratics",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ALGEBRA_QUADRATIC_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "algebra-inequalities-modulus",
      domain: "quant",
      topic: "algebra",
      label: "Algebra: Inequalities & Modulus",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ALGEBRA_INEQUALITY_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "algebra-functions",
      domain: "quant",
      topic: "algebra",
      label: "Algebra: Functions",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ALGEBRA_FUNCTION_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "algebra-logs",
      domain: "quant",
      topic: "algebra",
      label: "Algebra: Logarithms",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ALGEBRA_LOG_MOTIF_IDS,
      ],
      examStyles: ["cat"],
      enabled: true,
    },
    {
      id: "algebra-optimization",
      domain: "quant",
      topic: "algebra",
      label: "Algebra: Maxima & Minima",
      supportedDifficulties: [
        "hard",
      ],
      compatibleMotifs: [
        ...ALGEBRA_OPTIMIZATION_MOTIF_IDS,
      ],
      examStyles: ["cat"],
      enabled: true,
    },
    {
      id: "equations",
      domain: "quant",
      topic: "equations",
      label: "Equations",
      description:
        "MathJax-rendered equation questions covering linear equations, simultaneous systems, quadratics, Vieta relations, modulus equations, and word-equation framing.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...EQUATION_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "equations-linear",
      domain: "quant",
      topic: "equations",
      label: "Equations: Linear Systems",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...EQUATION_LINEAR_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "equations-quadratic",
      domain: "quant",
      topic: "equations",
      label: "Equations: Quadratics",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...EQUATION_QUADRATIC_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "equations-special",
      domain: "quant",
      topic: "equations",
      label: "Equations: Special Forms",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...EQUATION_SPECIAL_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "equations-modulus",
      domain: "quant",
      topic: "equations",
      label: "Equations: Modulus",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...EQUATION_MODULUS_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "equations-word-problems",
      domain: "quant",
      topic: "equations",
      label: "Equations: Word Problems",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...EQUATION_WORD_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "progressions",
      domain: "quant",
      topic: "progressions",
      label: "Progressions",
      description:
        "MathJax-rendered progression questions covering AP, GP, HP, means, summations, telescopic series, and algebraic sequence relations.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...PROGRESSION_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "progressions-ap",
      domain: "quant",
      topic: "progressions",
      label: "Progressions: AP",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...PROGRESSION_AP_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "progressions-gp",
      domain: "quant",
      topic: "progressions",
      label: "Progressions: GP",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...PROGRESSION_GP_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "progressions-hp-means",
      domain: "quant",
      topic: "progressions",
      label: "Progressions: HP & Means",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...PROGRESSION_HP_MEAN_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "progressions-special-series",
      domain: "quant",
      topic: "progressions",
      label: "Progressions: Special Series",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...PROGRESSION_SPECIAL_SERIES_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "progressions-algebraic",
      domain: "quant",
      topic: "progressions",
      label: "Progressions: Algebraic Relations",
      supportedDifficulties: [
        "hard",
      ],
      compatibleMotifs: [
        ...PROGRESSION_ALGEBRAIC_MOTIF_IDS,
      ],
      examStyles: ["cat"],
      enabled: true,
    },
    {
      id: "permutation-combination",
      domain: "quant",
      topic: "permutation-combination",
      label: "Permutations & Combinations",
      description:
        "Constraint-based counting questions covering ordered arrangements, unordered selections, circular permutations, digit formation, geometric counting, distributions, ranks, and grid paths.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...PC_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "pc-fundamentals",
      domain: "quant",
      topic: "permutation-combination",
      label: "P&C: Fundamental Counting",
      supportedDifficulties: [
        "easy",
        "medium",
      ],
      compatibleMotifs: [
        ...PC_FUNDAMENTAL_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "pc-permutations",
      domain: "quant",
      topic: "permutation-combination",
      label: "P&C: Permutations",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...PC_PERMUTATION_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "pc-combinations",
      domain: "quant",
      topic: "permutation-combination",
      label: "P&C: Combinations",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...PC_COMBINATION_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "pc-circular",
      domain: "quant",
      topic: "permutation-combination",
      label: "P&C: Circular Permutations",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...PC_CIRCULAR_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "pc-geometry-counting",
      domain: "quant",
      topic: "permutation-combination",
      label: "P&C: Geometric Counting",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...PC_GEOMETRY_COUNTING_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "pc-advanced-counting",
      domain: "quant",
      topic: "permutation-combination",
      label: "P&C: Advanced Counting",
      supportedDifficulties: [
        "hard",
      ],
      compatibleMotifs: [
        ...PC_ADVANCED_MOTIF_IDS,
      ],
      examStyles: ["cat"],
      enabled: true,
    },
    {
      id: "trigonometry",
      domain: "quant",
      topic: "trigonometry",
      label: "Trigonometry",
      description:
        "MathJax-rendered trigonometry questions covering ratios, standard angles, complementary identities, heights and distances, algebraic trig identities, and quadrant reductions.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...TRIG_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "trig-ratios",
      domain: "quant",
      topic: "trigonometry",
      label: "Trig: Ratios & Identities",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...TRIG_RATIO_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "trig-standard-values",
      domain: "quant",
      topic: "trigonometry",
      label: "Trig: Standard Values",
      supportedDifficulties: [
        "easy",
        "medium",
      ],
      compatibleMotifs: [
        ...TRIG_STANDARD_VALUE_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "trig-complementary",
      domain: "quant",
      topic: "trigonometry",
      label: "Trig: Complementary Angles",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...TRIG_COMPLEMENTARY_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "trig-heights-distances",
      domain: "quant",
      topic: "trigonometry",
      label: "Trig: Heights & Distances",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...TRIG_HD_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "trig-identities",
      domain: "quant",
      topic: "trigonometry",
      label: "Trig: Algebraic Identities",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...TRIG_IDENTITY_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "trig-quadrants-reduction",
      domain: "quant",
      topic: "trigonometry",
      label: "Trig: Quadrants & Reduction",
      supportedDifficulties: [
        "hard",
      ],
      compatibleMotifs: [
        ...TRIG_QUADRANT_MOTIF_IDS,
      ],
      examStyles: ["cat"],
      enabled: true,
    },
    {
      id: "geometry-basics",
      domain: "quant",
      topic: "geometry",
      label: "Geometry Basics",
      description:
        "MathJax-rendered geometry questions covering lines, angles, triangles, circles, quadrilaterals, and coordinates.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...GEOMETRY_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "geometry",
      domain: "quant",
      topic: "geometry",
      label: "Geometry",
      description:
        "Full theorem-map geometry generation with strict MathJax notation for angles, segments, parallel lines, triangles, congruency, similarity, circles, and coordinates.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...GEOMETRY_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "geometry-lines-angles",
      domain: "quant",
      topic: "geometry",
      label: "Geometry: Lines & Angles",
      supportedDifficulties: [
        "easy",
        "medium",
      ],
      compatibleMotifs: [
        ...GEOMETRY_LINES_ANGLES_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "geometry-triangles",
      domain: "quant",
      topic: "geometry",
      label: "Geometry: Triangles",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...GEOMETRY_TRIANGLE_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "geometry-similarity",
      domain: "quant",
      topic: "geometry",
      label: "Geometry: Similarity & Congruency",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...GEOMETRY_SIMILARITY_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "geometry-right-triangles",
      domain: "quant",
      topic: "geometry",
      label: "Geometry: Right Triangles",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "geo-right-pythagoras",
        "geo-right-altitude",
        "geo-right-30-60-90",
        "geo-right-45-45-90",
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "geometry-circles",
      domain: "quant",
      topic: "geometry",
      label: "Geometry: Circles",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...GEOMETRY_CIRCLE_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "geometry-coordinate",
      domain: "quant",
      topic: "geometry",
      label: "Geometry: Coordinate Geometry",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...GEOMETRY_COORDINATE_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "mensuration",
      domain: "quant",
      topic: "mensuration",
      label: "Mensuration",
      description:
        "MathJax-rendered mensuration questions covering 2D shapes, 3D solids, recasting, paths, hollow objects, and scaling effects.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...MENSURATION_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "mensuration-2d",
      domain: "quant",
      topic: "mensuration",
      label: "Mensuration: 2D Shapes",
      description:
        "Triangles, quadrilaterals, paths, circles, sectors, polygons, and wire-boundary questions.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...MENSURATION_2D_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "mensuration-3d",
      domain: "quant",
      topic: "mensuration",
      label: "Mensuration: 3D Solids",
      description:
        "Cubes, prisms, cylinders, cones, spheres, hemispheres, frustums, hollow pipes, and combined solids.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...MENSURATION_3D_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "mensuration-recasting",
      domain: "quant",
      topic: "mensuration",
      label: "Mensuration: Recasting",
      description:
        "Volume or perimeter invariant transformations such as melting, wire bending, and drawing wires.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...MENSURATION_RECASTING_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "mensuration-scaling",
      domain: "quant",
      topic: "mensuration",
      label: "Mensuration: Scaling",
      description:
        "Area, volume, dimension percentage shifts, and fixed-boundary optimization.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...MENSURATION_SCALING_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "probability",
      domain: "quant",
      topic: "probability",
      label: "Probability",
      description:
        "Set-based probability generation using sample-space and favorable-event counts, replacement logic, conditional probability, Venn events, odds, and PC-solver-backed combinations.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...PROBABILITY_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "probability-sample-spaces",
      domain: "quant",
      topic: "probability",
      label: "Probability: Sample Spaces",
      supportedDifficulties: [
        "easy",
        "medium",
      ],
      compatibleMotifs: [
        ...PROBABILITY_SAMPLE_SPACE_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "probability-events",
      domain: "quant",
      topic: "probability",
      label: "Probability: Event Logic",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...PROBABILITY_EVENT_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "probability-drawing",
      domain: "quant",
      topic: "probability",
      label: "Probability: Drawing",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...PROBABILITY_DRAWING_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "probability-conditional",
      domain: "quant",
      topic: "probability",
      label: "Probability: Conditional",
      supportedDifficulties: [
        "hard",
      ],
      compatibleMotifs: [
        ...PROBABILITY_CONDITIONAL_MOTIF_IDS,
      ],
      examStyles: ["cat", "banking"],
      enabled: true,
    },
    {
      id: "probability-venn-odds",
      domain: "quant",
      topic: "probability",
      label: "Probability: Venn & Odds",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...PROBABILITY_VENN_ODDS_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "functions",
      domain: "quant",
      topic: "functions",
      label: "Functions",
      description:
        "MathJax-rendered function questions covering mappings, domain/range, composition, inverses, special functions, functional equations, and graph transformations.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...FUNCTION_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "functions-domain-range",
      domain: "quant",
      topic: "functions",
      label: "Functions: Domain & Range",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...FUNCTION_DOMAIN_RANGE_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "functions-types",
      domain: "quant",
      topic: "functions",
      label: "Functions: Types",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...FUNCTION_TYPE_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "functions-composition-inverse",
      domain: "quant",
      topic: "functions",
      label: "Functions: Composition & Inverse",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...FUNCTION_COMPOSITION_INVERSE_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "functions-special",
      domain: "quant",
      topic: "functions",
      label: "Functions: Special Functions",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...FUNCTION_SPECIAL_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "functions-functional-equations",
      domain: "quant",
      topic: "functions",
      label: "Functions: Functional Equations",
      supportedDifficulties: [
        "hard",
      ],
      compatibleMotifs: [
        ...FUNCTION_FUNCTIONAL_EQUATION_MOTIF_IDS,
      ],
      examStyles: ["cat"],
      enabled: true,
    },
    {
      id: "functions-graphs",
      domain: "quant",
      topic: "functions",
      label: "Functions: Graphs",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...FUNCTION_GRAPH_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "coordinate-geometry",
      domain: "quant",
      topic: "coordinate-geometry",
      label: "Coordinate Geometry",
      description:
        "Spatial Cartesian generation using ordered pairs, lines, slopes, distances, reflections, circles, loci, and algebraic constraints with strict MathJax rendering.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...COORDINATE_GEOMETRY_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "coordinate-points",
      domain: "quant",
      topic: "coordinate-geometry",
      label: "Coordinate Geometry: Points",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...COORDINATE_POINT_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "coordinate-lines",
      domain: "quant",
      topic: "coordinate-geometry",
      label: "Coordinate Geometry: Lines & Slopes",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...COORDINATE_LINE_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "coordinate-areas-properties",
      domain: "quant",
      topic: "coordinate-geometry",
      label: "Coordinate Geometry: Areas & Properties",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...COORDINATE_AREA_PROPERTY_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "coordinate-distance-reflection",
      domain: "quant",
      topic: "coordinate-geometry",
      label: "Coordinate Geometry: Distance & Reflection",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...COORDINATE_DISTANCE_REFLECTION_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "coordinate-circles",
      domain: "quant",
      topic: "coordinate-geometry",
      label: "Coordinate Geometry: Circles",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...COORDINATE_CIRCLE_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "coordinate-locus-advanced",
      domain: "quant",
      topic: "coordinate-geometry",
      label: "Coordinate Geometry: Locus & Advanced",
      supportedDifficulties: [
        "hard",
      ],
      compatibleMotifs: [
        ...COORDINATE_LOCUS_ADVANCED_MOTIF_IDS,
      ],
      examStyles: ["cat"],
      enabled: true,
    },
    {
      id: "set-theory",
      domain: "quant",
      topic: "set-theory",
      label: "Set Theory",
      description:
        "Categorical reasoning generation using membership constraints, set operations, Venn regions, subset counts, Cartesian products, and relation properties with strict MathJax rendering.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...SET_THEORY_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "set-theory-definitions",
      domain: "quant",
      topic: "set-theory",
      label: "Set Theory: Definitions",
      supportedDifficulties: [
        "easy",
        "medium",
      ],
      compatibleMotifs: [
        ...SET_THEORY_DEFINITION_MOTIF_IDS,
      ],
      examStyles: ["ssc"],
      enabled: true,
    },
    {
      id: "set-theory-operations",
      domain: "quant",
      topic: "set-theory",
      label: "Set Theory: Operations",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...SET_THEORY_OPERATION_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "set-theory-venn-2",
      domain: "quant",
      topic: "set-theory",
      label: "Set Theory: 2-Set Venn",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...SET_THEORY_VENN_2_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "set-theory-venn-3",
      domain: "quant",
      topic: "set-theory",
      label: "Set Theory: 3-Set Venn",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...SET_THEORY_VENN_3_MOTIF_IDS,
      ],
      examStyles: ["banking", "cat"],
      enabled: true,
    },
    {
      id: "set-theory-algebra-cartesian",
      domain: "quant",
      topic: "set-theory",
      label: "Set Theory: Algebra & Cartesian Product",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...SET_THEORY_ALGEBRA_CARTESIAN_MOTIF_IDS,
      ],
      examStyles: ["ssc", "cat"],
      enabled: true,
    },
    {
      id: "set-theory-relations",
      domain: "quant",
      topic: "set-theory",
      label: "Set Theory: Relations",
      supportedDifficulties: [
        "hard",
      ],
      compatibleMotifs: [
        ...SET_THEORY_RELATION_MOTIF_IDS,
      ],
      examStyles: ["cat"],
      enabled: true,
    },
    {
      id: "permutation-combination-pair-selection",
      domain: "quant",
      topic: "permutation-combination",
      label: "P&C: Pair Selection",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "counting-pair-selection",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "direction-sense",
      domain: "reasoning",
      topic: "direction-sense",
      label: "Direction Sense",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_SPATIAL_DIRECTION_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "cubes-dice",
      domain: "reasoning",
      topic: "engine-spatial",
      label: "Cubes & Dice",
      description:
        "3D visualization questions using dice opposites, cube painting, and cube-net folding logic.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_SPATIAL_DICE_CUBE_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "mirror-water-images",
      domain: "reasoning",
      topic: "engine-spatial",
      label: "Mirror & Water Images",
      description:
        "Reflection-based spatial reasoning using vertical and horizontal symmetry.",
      supportedDifficulties: [
        "easy",
        "medium",
      ],
      compatibleMotifs: [
        ...ENGINE_SPATIAL_REFLECTION_MOTIF_IDS,
      ],
      examStyles: ["ssc", "rrb"],
      enabled: true,
    },
    {
      id: "paper-folding",
      domain: "reasoning",
      topic: "engine-spatial",
      label: "Paper Folding/Cutting",
      description:
        "Successive-symmetry folding and hole-punch reasoning.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_SPATIAL_FOLDING_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "blood-relation",
      domain: "reasoning",
      topic: "blood-relation",
      label: "Blood Relation",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_RELATIONAL_NARRATIVE_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "coded-relations",
      domain: "reasoning",
      topic: "engine-relational",
      label: "Coded Relations",
      description:
        "Symbolic kinship problems where operators such as $+$, $-$, $\\times$, and $/$ represent family edges.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_RELATIONAL_CODED_MOTIF_IDS,
      ],
      examStyles: ["banking", "ssc"],
      enabled: true,
    },
    {
      id: "family-tree-puzzles",
      domain: "reasoning",
      topic: "engine-relational",
      label: "Family Tree Puzzles",
      description:
        "Multi-generational kinship puzzles with node attributes such as professions or ages.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_RELATIONAL_PUZZLE_MOTIF_IDS,
      ],
      examStyles: ["banking", "cat"],
      enabled: true,
    },
    {
      id: "inequality",
      domain: "reasoning",
      topic: "inequality",
      label: "Inequality",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_BOOLEAN_INEQUALITY_MOTIF_IDS,
      ],
      examStyles: ["banking"],
      enabled: true,
    },
    {
      id: "coding-decoding",
      domain: "reasoning",
      topic: "coding-decoding",
      label: "Coding-Decoding",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_PATTERN_CODING_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "calendars",
      domain: "reasoning",
      topic: "engine-temporal",
      label: "Calendars",
      description:
        "Odd-day calendar reasoning with Gregorian leap-year and repetition-cycle validation.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_TEMPORAL_CALENDAR_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "clocks",
      domain: "reasoning",
      topic: "engine-temporal",
      label: "Clocks",
      description:
        "Clock-angle, overlap, and faulty-clock questions using relative angular velocity.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_TEMPORAL_CLOCK_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "statement-assumption",
      domain: "reasoning",
      topic: "engine-critical",
      label: "Statement-Assumption",
      description:
        "Semantic necessity questions using the premise-bridge-inference structure and negation test.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_CRITICAL_ASSUMPTION_MOTIF_IDS,
      ],
      examStyles: ["banking", "cat"],
      enabled: true,
    },
    {
      id: "statement-conclusion",
      domain: "reasoning",
      topic: "engine-critical",
      label: "Statement-Conclusion",
      description:
        "Conclusion validity questions with strict scope and outside-knowledge checks.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_CRITICAL_CONCLUSION_MOTIF_IDS,
      ],
      examStyles: ["banking", "cat"],
      enabled: true,
    },
    {
      id: "course-of-action",
      domain: "reasoning",
      topic: "engine-critical",
      label: "Course of Action",
      description:
        "Pragmatic action selection using effectiveness, relevance, and non-extreme checks.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_CRITICAL_ACTION_MOTIF_IDS,
      ],
      examStyles: ["banking", "cat"],
      enabled: true,
    },
    {
      id: "cause-effect",
      domain: "reasoning",
      topic: "engine-critical",
      label: "Cause & Effect",
      description:
        "Directional cause-effect reasoning with correlation traps.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_CRITICAL_CAUSE_MOTIF_IDS,
      ],
      examStyles: ["banking", "cat"],
      enabled: true,
    },
    {
      id: "strong-weak-arguments",
      domain: "reasoning",
      topic: "engine-critical",
      label: "Strong/Weak Arguments",
      description:
        "Argument-strength evaluation using tone, relevance, and scope constraints.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_CRITICAL_ARGUMENT_MOTIF_IDS,
      ],
      examStyles: ["banking", "cat"],
      enabled: true,
    },
    {
      id: "abstract-series",
      domain: "reasoning",
      topic: "engine-abstract",
      label: "Abstract Figure Series",
      description:
        "Non-verbal SVG figure series using rotation, movement, and symmetry transformations.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_ABSTRACT_SERIES_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "abstract-paper-cutting",
      domain: "reasoning",
      topic: "engine-abstract",
      label: "Paper Cutting",
      description:
        "Fold-and-punch symmetry questions with unfolded SVG option states.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_ABSTRACT_PAPER_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "embedded-figures",
      domain: "reasoning",
      topic: "engine-abstract",
      label: "Embedded Figures",
      description:
        "Hidden-figure recognition by filtering distractor lines and matching orientation.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_ABSTRACT_EMBEDDED_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "number-series",
      domain: "reasoning",
      topic: "engine-pattern",
      label: "Number Series",
      description:
        "Transformation-rule number series with ambiguity validation before realization.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_PATTERN_SERIES_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "letter-series",
      domain: "reasoning",
      topic: "engine-pattern",
      label: "Letter Series",
      description:
        "Alphabetic series generated through fixed, incremental, alternating, and conditional transformation rules.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_PATTERN_CODING_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "analogy",
      domain: "reasoning",
      topic: "engine-pattern",
      label: "Analogy",
      description:
        "Word, letter, and number analogies using the shared input-rule-output skeleton.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_PATTERN_ANALOGY_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "odd-one-out",
      domain: "reasoning",
      topic: "engine-pattern",
      label: "Odd One Out / Classification",
      description:
        "Classification questions based on shared structural properties rather than surface wording.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_PATTERN_CLASSIFICATION_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "ordering-ranking",
      domain: "reasoning",
      topic: "ordering-ranking",
      label: "Ordering & Ranking",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "rank-offset",
      ],
      examStyles: ["ssc", "banking"],
      enabled: false,
    },
    {
      id: "syllogism",
      domain: "reasoning",
      topic: "syllogism",
      label: "Syllogism",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_BOOLEAN_SYLLOGISM_MOTIF_IDS,
      ],
      examStyles: ["banking"],
      enabled: true,
    },
    {
      id: "logical-venn",
      domain: "reasoning",
      topic: "engine-boolean",
      label: "Logical Venn Diagrams",
      description:
        "Euler/Venn diagram identification and cardinality reasoning using set boundaries.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_BOOLEAN_VENN_MOTIF_IDS,
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "boolean-deductions",
      domain: "reasoning",
      topic: "engine-boolean",
      label: "Boolean Deductions",
      description:
        "Mixed deductive reasoning across inequalities, syllogisms, and set-overlap logic.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        ...ENGINE_BOOLEAN_INEQUALITY_MOTIF_IDS,
        ...ENGINE_BOOLEAN_SYLLOGISM_MOTIF_IDS,
        ...ENGINE_BOOLEAN_VENN_MOTIF_IDS,
      ],
      examStyles: ["banking", "cat"],
      enabled: true,
    },
    {
      id: "box-puzzle",
      domain: "reasoning",
      topic: "puzzles",
      label: "Box Puzzle",
      description:
        "Box arrangement puzzle. Registry-ready, generator disabled until box topology is implemented.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "case-split-puzzle",
        "indirect-elimination",
      ],
      examStyles: ["banking"],
      enabled: false,
    },
    {
      id: "error-spotting",
      domain: "english",
      topic: "error-spotting",
      label: "Error Spotting",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "subject_verb_ambiguity",
        "tense-confusion",
        "article-misuse",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "sentence-improvement",
      domain: "english",
      topic: "sentence-improvement",
      label: "Sentence Improvement",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "tense-confusion",
        "modifier_attachment_trap",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "fillers",
      domain: "english",
      topic: "fillers",
      label: "Fillers",
      supportedDifficulties: [
        "easy",
        "medium",
      ],
      compatibleMotifs: [
        "contextual-antonym-trap",
      ],
      examStyles: ["banking"],
      enabled: true,
    },
    {
      id: "active-passive",
      domain: "english",
      topic: "active-passive",
      label: "Active/Passive Voice",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "object-focus-transform",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "narration",
      domain: "english",
      topic: "narration",
      label: "Narration",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "reported-speech-shift",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "para-jumbles",
      domain: "english",
      topic: "para-jumbles",
      label: "Para Jumbles",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "logical-sequencing-anchor",
      ],
      examStyles: ["banking"],
      enabled: true,
    },
    {
      id: "root-words",
      domain: "english",
      topic: "root-words",
      label: "Root Words",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "root-context-mapping",
      ],
      examStyles: ["ssc", "cat", "banking"],
      enabled: true,
    },
    {
      id: "synonyms-antonyms",
      domain: "english",
      topic: "vocabulary",
      label: "Synonyms / Antonyms",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "contextual-antonym-trap",
      ],
      examStyles: ["ssc", "banking", "cat"],
      enabled: true,
    },
    {
      id: "idioms",
      domain: "english",
      topic: "idioms",
      label: "Idioms and Phrases",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "idiom-context-fit",
      ],
      examStyles: ["ssc", "rrb", "banking"],
      enabled: true,
    },
    {
      id: "reading-comprehension",
      domain: "english",
      topic: "reading-comprehension",
      label: "Reading Comprehension",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "rc-tone-main-idea",
      ],
      examStyles: ["ssc", "cat", "banking"],
      enabled: true,
    },
    {
      id: "punjabi-vyakaran-ling",
      domain: "punjabi",
      topic: "vyakaran",
      label: "Punjabi Vyakaran - Ling Badlo",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "pbi-gram-ling",
      ],
      examStyles: ["punjab", "psssb", "ppsc", "rrb"],
      enabled: true,
    },
    {
      id: "punjabi-vyakaran-vachan",
      domain: "punjabi",
      topic: "vyakaran",
      label: "Punjabi Vyakaran - Vachan Badlo",
      supportedDifficulties: [
        "easy",
        "medium",
      ],
      compatibleMotifs: [
        "pbi-gram-vachan",
      ],
      examStyles: ["punjab", "psssb", "ppsc", "rrb"],
      enabled: true,
    },
    {
      id: "punjabi-vak-shuddhi",
      domain: "punjabi",
      topic: "vyakaran",
      label: "Punjabi Vak Shuddhi",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "pbi-gram-shuddhi",
      ],
      examStyles: ["punjab", "psssb", "ppsc"],
      enabled: true,
    },
    {
      id: "punjabi-shabad-jor",
      domain: "punjabi",
      topic: "shabad-jor",
      label: "Punjabi Shabad-Jor",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "pbi-voc-jor",
      ],
      examStyles: ["punjab", "psssb", "ppsc", "rrb"],
      enabled: true,
    },
    {
      id: "punjabi-vocabulary",
      domain: "punjabi",
      topic: "vocabulary",
      label: "Punjabi Samanarthak / One Word",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "pbi-voc-saman",
        "pbi-voc-oneword",
        "pbi-voc-agattar",
      ],
      examStyles: ["punjab", "psssb", "ppsc"],
      enabled: true,
    },
    {
      id: "punjabi-muhavre-akhaan",
      domain: "punjabi",
      topic: "muhavre-akhaan",
      label: "Punjabi Muhavre and Akhaan",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "pbi-idiom-muhavre",
        "pbi-idiom-akhaan",
      ],
      examStyles: ["punjab", "psssb", "ppsc", "rrb"],
      enabled: true,
    },
    {
      id: "punjabi-translation-admin",
      domain: "punjabi",
      topic: "translation",
      label: "English-Punjabi Administrative Translation",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "pbi-trans-admin",
      ],
      examStyles: ["punjab", "psssb", "ppsc"],
      enabled: true,
    },
    {
      id: "gk-polity",
      domain: "knowledge",
      topic: "polity",
      label: "GK: Polity",
      description:
        "Articles, schedules, parts, amendments, and constitutional emergency provisions.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "gk-pol-direct",
      ],
      examStyles: ["ssc", "punjab", "psssb", "ppsc"],
      enabled: true,
    },
    {
      id: "gk-history",
      domain: "knowledge",
      topic: "history",
      label: "GK: History",
      description:
        "Dynasties, battles, freedom struggle dates, founders, and previous-year style fact pairs.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "gk-his-direct",
      ],
      examStyles: ["ssc", "punjab", "psssb", "ppsc"],
      enabled: true,
    },
    {
      id: "gk-geography",
      domain: "knowledge",
      topic: "geography",
      label: "GK: Geography",
      description:
        "Rivers, tributaries, passes, soils, borders, and Punjab geography facts.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "gk-geo-direct",
      ],
      examStyles: ["ssc", "punjab", "psssb", "ppsc"],
      enabled: true,
    },
    {
      id: "gk-science",
      domain: "knowledge",
      topic: "science",
      label: "GK: General Science",
      description:
        "Vitamins, chemical names, SI units, human body, and standard science facts.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "gk-sci-direct",
      ],
      examStyles: ["ssc", "punjab", "psssb", "ppsc"],
      enabled: true,
    },
    {
      id: "gk-economics",
      domain: "knowledge",
      topic: "economics",
      label: "GK: Economics",
      description:
        "RBI functions, plans, repo rate, fiscal deficit, budget and banking terms.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "gk-eco-direct",
      ],
      examStyles: ["ssc", "banking", "punjab"],
      enabled: true,
    },
    {
      id: "gk-environment",
      domain: "knowledge",
      topic: "environment",
      label: "GK: Environment",
      description:
        "Climate protocols, pollution, biodiversity hotspots, parks, and sanctuaries.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "gk-env-direct",
      ],
      examStyles: ["ssc", "punjab", "psssb"],
      enabled: true,
    },
    {
      id: "gk-static-parks",
      domain: "knowledge",
      topic: "static-parks",
      label: "GK: Parks and Sanctuaries",
      description:
        "National parks, wildlife sanctuaries, bird sanctuaries, and park-state matching.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "gk-static-parks",
      ],
      examStyles: ["ssc", "punjab", "psssb"],
      enabled: true,
    },
    {
      id: "gk-static-power",
      domain: "knowledge",
      topic: "static-power",
      label: "GK: Power Plants and Projects",
      description:
        "Thermal, nuclear, hydroelectric, and Punjab power project facts.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "gk-static-power",
      ],
      examStyles: ["ssc", "punjab", "psssb"],
      enabled: true,
    },
    {
      id: "gk-static-punjab",
      domain: "knowledge",
      topic: "punjab-gk",
      label: "Punjab GK",
      description:
        "Sikh history, Punjab culture, geography, freedom struggle, wetlands, and state-specific static facts.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "gk-static-punjab",
      ],
      examStyles: ["punjab", "psssb", "ppsc"],
      enabled: true,
    },
    {
      id: "computer-hardware",
      domain: "computer",
      topic: "hardware",
      label: "Computer: Hardware",
      description:
        "Input/output devices, CPU components, memory hierarchy, RAM, ROM, and cache.",
      supportedDifficulties: [
        "easy",
        "medium",
      ],
      compatibleMotifs: [
        "comp-hardware",
      ],
      examStyles: ["ssc", "punjab", "psssb"],
      enabled: true,
    },
    {
      id: "computer-software",
      domain: "computer",
      topic: "software",
      label: "Computer: Software and MS Office",
      description:
        "Operating systems, MS Word, Excel, PowerPoint shortcuts, and formulas.",
      supportedDifficulties: [
        "easy",
        "medium",
      ],
      compatibleMotifs: [
        "comp-software",
      ],
      examStyles: ["ssc", "punjab", "psssb"],
      enabled: true,
    },
    {
      id: "computer-internet",
      domain: "computer",
      topic: "internet-networking",
      label: "Computer: Internet and Networking",
      description:
        "OSI layers, hub, switch, router, HTTP, FTP, web, and networking protocols.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "comp-internet",
      ],
      examStyles: ["ssc", "punjab", "psssb"],
      enabled: true,
    },
    {
      id: "computer-security",
      domain: "computer",
      topic: "security",
      label: "Computer: Security",
      description:
        "Malware, trojans, worms, firewalls, antivirus, and cyber-safety concepts.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "comp-security",
      ],
      examStyles: ["ssc", "punjab", "psssb"],
      enabled: true,
    },
    {
      id: "pie-chart",
      domain: "di",
      topic: "pie-chart",
      label: "Pie Chart DI",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "percentage-heavy-calculations",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "bar-graph",
      domain: "di",
      topic: "bar-graph",
      label: "Bar Graph DI",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "approximation-friendly-datasets",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "grouped-bar-di",
      domain: "di",
      topic: "grouped-bar-di",
      label: "Grouped Bar DI",
      description:
        "Multi-series bar DI comparing categories across years with growth, contribution, projection, and subset-average asks.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "di-growth-rate",
        "di-contribution",
        "di-projection",
        "di-avg-subset",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "stacked-bar-di",
      domain: "di",
      topic: "stacked-bar-di",
      label: "Stacked Bar DI",
      description:
        "Part-to-whole bar DI where each interval contains stacked components.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "di-contribution",
        "di-growth-rate",
        "di-projection",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "table-di",
      domain: "di",
      topic: "table-di",
      label: "Table DI",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "percentage-heavy-calculations",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "dual-pie-di",
      domain: "di",
      topic: "dual-pie-di",
      label: "Dual Pie Chart DI",
      description:
        "Distribution comparison across two years or groups using normalized shares.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "di-contribution",
        "di-growth-rate",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "line-graph",
      domain: "di",
      topic: "line-graph",
      label: "Line Graph DI",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "line-trend-comparison",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "caselet-di",
      domain: "di",
      topic: "caselet-di",
      label: "Caselet DI",
      description:
        "Narrative data interpretation without a chart, using a persistent dataset behind the passage.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "di-growth-rate",
        "di-contribution",
        "di-projection",
        "di-avg-subset",
      ],
      examStyles: ["banking", "cat"],
      enabled: true,
    },
    {
      id: "mixed-di",
      domain: "di",
      topic: "mixed-di",
      label: "Mixed DI",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "mixed-di-cross-series",
        "percentage-heavy-calculations",
      ],
      examStyles: ["banking"],
      enabled: false,
    },
  ];

function normalizeKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
}

export function normalizePatternDifficulty(
  difficulty:
    | QuestionPatternDifficulty
    | DifficultyLabel
    | undefined,
): DifficultyLabel {
  if (!difficulty) {
    return "Medium";
  }

  const normalized = normalizeKey(
    difficulty,
  ) as QuestionPatternDifficulty;

  return (
    difficultyMap[normalized] ??
    (difficulty as DifficultyLabel)
  );
}

export function normalizeExamStyle(
  examStyle?: string,
): ExamProfileId | undefined {
  if (!examStyle) {
    return undefined;
  }

  return examProfileMap[
    normalizeKey(examStyle)
  ];
}

export function resolveCanonicalMotif(
  value: string,
): Motif | undefined {
  const key = normalizeKey(value);

  return MOTIF_REGISTRY.find(
    (motif) =>
      normalizeKey(
        motif.canonicalName,
      ) === key ||
      (motif.aliases ?? []).some(
        (alias) =>
          normalizeKey(alias) === key,
      ),
  );
}

export function resolveMotifIds(
  motifNames: string[],
) {
  const ids = new Set<string>();

  for (const motifName of motifNames) {
    const motif =
      resolveCanonicalMotif(
        motifName,
      );

    if (!motif) {
      ids.add(motifName);
      continue;
    }

    ids.add(motif.canonicalName);
    for (const alias of motif.aliases ?? []) {
      ids.add(alias);
    }
  }

  return [...ids];
}

export function listQuestionPatterns(
  includeDisabled = true,
) {
  const byId = new Map<
    string,
    QuestionPattern
  >();

  for (const pattern of QUESTION_PATTERN_REGISTRY) {
    if (
      !includeDisabled &&
      pattern.enabled === false
    ) {
      continue;
    }

    if (!byId.has(pattern.id)) {
      byId.set(pattern.id, pattern);
    }
  }

  return [...byId.values()];
}

export function findQuestionPattern(
  request: PatternGenerationRequest,
) {
  const requestedPattern =
    request.pattern ??
    request.patternId;

  if (!requestedPattern) {
    return undefined;
  }

  const patternKey =
    normalizeKey(requestedPattern);
  const topicKey = request.topic
    ? normalizeKey(request.topic)
    : undefined;

  return QUESTION_PATTERN_REGISTRY.find(
    (pattern) => {
      if (
        normalizeKey(pattern.id) !==
        patternKey
      ) {
        return false;
      }

      if (
        request.domain &&
        pattern.domain !== request.domain
      ) {
        return false;
      }

      return (
        !topicKey ||
        normalizeKey(pattern.topic) ===
          topicKey
      );
    },
  );
}

function buildDIPattern(
  visualType: DIPattern["visualType"],
  topology?: DIPattern["topology"],
): DIPattern {
  if (
    topology === "grouped-bar" ||
    topology === "stacked-bar" ||
    topology === "dual-pie-chart" ||
    topology === "caselet"
  ) {
    return {
      title:
        topology === "caselet"
          ? "Revenue caselet for four companies"
          : topology === "dual-pie-chart"
            ? "Market distribution across two years"
            : "Company revenue by year",
      columns: [
        "Year",
        "Company A",
        "Company B",
        "Company C",
      ],
      rowCount: 5,
      categories: [
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
      ],
      visualType,
      topology,
      series: [
        {
          column: "Company A",
          type:
            visualType === "line"
              ? "line"
              : "bar",
          label: "Company A",
        },
        {
          column: "Company B",
          type:
            visualType === "line"
              ? "line"
              : "bar",
          label: "Company B",
        },
        {
          column: "Company C",
          type:
            visualType === "line"
              ? "line"
              : "bar",
          label: "Company C",
        },
      ],
      valueRanges: {
        "Company A": {
          min: 120,
          max: 320,
        },
        "Company B": {
          min: 100,
          max: 300,
        },
        "Company C": {
          min: 80,
          max: 260,
        },
      },
    };
  }

  const title =
    visualType === "pie"
      ? "Distribution of candidates"
      : visualType === "bar"
        ? "Department-wise performance"
        : "Sales data by region";

  return {
    title,
    columns: ["Group", "Value"],
    rowCount: 5,
    categories: [
      "A",
      "B",
      "C",
      "D",
      "E",
    ],
    visualType,
    topology:
      topology ??
      (visualType === "pie"
        ? "pie-chart"
        : visualType === "line"
          ? "line-graph"
          : visualType === "bar"
            ? "grouped-bar"
            : "table"),
    valueRanges: {
      Value: {
        min: 80,
        max: 280,
      },
    },
  };
}

function buildQuantPattern(
  questionPattern: QuestionPattern,
  difficulty: DifficultyLabel,
): Pattern {
  const isPercentagePattern =
    questionPattern.id === "percentage" ||
    /percent|percentage/i.test(
      `${questionPattern.topic} ${questionPattern.label}`,
    );
  const generationDomain: Pattern["generationDomain"] =
    isPercentagePattern &&
    isQuantV2PercentageEnabled()
      ? "quant-v2-percentage"
      : "quant";
  const base = {
    type: "formula" as const,
    section: "Quant",
    topic: questionPattern.label,
    subtopic: questionPattern.topic,
    difficulty,
    generationDomain,
    supportedQuestionTypes: [
      "formula" as const,
    ],
    supportedMotifs: resolveMotifIds(
      questionPattern.compatibleMotifs,
    ),
  };

  switch (questionPattern.id) {
    case "averages":
    case "averages-algebraic":
      return {
        ...base,
        id: `registry-${questionPattern.id}-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "direct",
          "conditional",
          "comparative",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the MathJax-rendered average balance question using $\\text{Sum}=\\text{Average}\\times\\text{Count}$.",
        ],
        variables: {},
        formula: "0",
      };
    case "averages-replacement":
      return {
        ...base,
        id: `registry-averages-replacement-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the MathJax-rendered replacement or inclusion average question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "averages-weighted":
      return {
        ...base,
        id: `registry-averages-weighted-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "comparative",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the MathJax-rendered weighted average question using $A=\\frac{\\sum n_iA_i}{\\sum n_i}$.",
        ],
        variables: {},
        formula: "0",
      };
    case "averages-consecutive":
      return {
        ...base,
        id: `registry-averages-consecutive-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "direct",
          "inferential",
        ],
        templateVariants: [
          "Solve the MathJax-rendered consecutive-number average question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "averages-age-score":
      return {
        ...base,
        id: `registry-averages-age-score-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the MathJax-rendered application average question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "averages-corrections-overlaps":
      return {
        ...base,
        id: `registry-averages-corrections-overlaps-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "conditional",
          "comparative",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the MathJax-rendered correction, overlap, or deviation average question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "profit-loss":
      return {
        ...base,
        id: `registry-profit-loss-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "direct",
          "conditional",
          "comparative",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the profit, loss, or discount question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "profit-loss-discount":
      return {
        ...base,
        id: `registry-profit-loss-discount-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "conditional",
          "comparative",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the discount or markup question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "profit-loss-dishonest-dealer":
      return {
        ...base,
        id: `registry-profit-loss-dishonest-dealer-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the dishonest dealer question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "profit-loss-equivalent-change":
      return {
        ...base,
        id: `registry-profit-loss-equivalent-change-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the equivalent percentage change question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "simple-compound-interest":
      return {
        ...base,
        id: `registry-simple-compound-interest-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "direct",
          "conditional",
          "comparative",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the simple and compound interest question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "simple-interest":
      return {
        ...base,
        id: `registry-simple-interest-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "direct",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the simple interest question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "compound-interest":
      return {
        ...base,
        id: `registry-compound-interest-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "conditional",
          "comparative",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the compound interest question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "interest-si-vs-ci":
      return {
        ...base,
        id: `registry-interest-si-vs-ci-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "comparative",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the SI vs CI comparison question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "interest-fractional-compounding":
      return {
        ...base,
        id: `registry-interest-fractional-compounding-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the fractional compounding question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "interest-growth-decay":
      return {
        ...base,
        id: `registry-interest-growth-decay-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "conditional",
          "comparative",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the growth or depreciation question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "ratio-proportion":
      return {
        ...base,
        id: `registry-ratio-proportion-${difficulty.toLowerCase()}`,
        templateVariants: [
          "A total of {total} is divided in the ratio {a}:{b}. What is the first share?",
        ],
        variables: {
          total: { min: 120, max: 900 },
          a: { min: 2, max: 9 },
          b: { min: 2, max: 9 },
        },
        formula:
          "total * a / (a + b)",
      };
    case "mixture-alligation":
      return {
        ...base,
        id: `registry-mixture-alligation-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "direct",
          "conditional",
          "comparative",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the mixture and alligation question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "mixture-alligation-alligation":
      return {
        ...base,
        id: `registry-mixture-alligation-alligation-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "comparative",
          "conditional",
          "inferential",
        ],
        templateVariants: [
          "Solve the alligation question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "mixture-alligation-replacement":
      return {
        ...base,
        id: `registry-mixture-alligation-replacement-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the replacement-based mixture question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "mixture-alligation-weighted":
      return {
        ...base,
        id: `registry-mixture-alligation-weighted-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "comparative",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the weighted blending question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "partnership":
      return {
        ...base,
        id: `registry-partnership-${difficulty.toLowerCase()}`,
        templateVariants: [
          "A invests Rs. {investment1} for {months1} months and B invests Rs. {investment2} for {months2} months. If total profit is Rs. {profit}, what is A's share?",
        ],
        variables: {
          investment1: {
            min: 1000,
            max: 12000,
          },
          investment2: {
            min: 1000,
            max: 12000,
          },
          months1: { min: 3, max: 12 },
          months2: { min: 3, max: 12 },
          profit: { min: 1000, max: 15000 },
        },
        formula:
          "profit * investment1 * months1 / (investment1 * months1 + investment2 * months2)",
      };
    case "ages":
      return {
        ...base,
        id: `registry-ages-${difficulty.toLowerCase()}`,
        templateVariants: [
          "A person's present age is {present} years. What will be the age after {years} years?",
        ],
        variables: {
          present: { min: 12, max: 60 },
          years: { min: 2, max: 15 },
        },
        formula: "present + years",
      };
    case "pipes-cisterns":
      return {
        ...base,
        id: `registry-pipes-cisterns-${difficulty.toLowerCase()}`,
        templateVariants: [
          "Pipe A can fill a tank in {a} hours and Pipe B can fill it in {b} hours. In how many hours can both fill it together?",
        ],
        variables: {
          a: { min: 4, max: 24 },
          b: { min: 6, max: 30 },
        },
        formula: "a * b / (a + b)",
      };
    case "boats-streams":
      return {
        ...base,
        id: `registry-boats-streams-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "comparative",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the boats and streams question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "fundamentals":
      return {
        ...base,
        id: `registry-fundamentals-${difficulty.toLowerCase()}`,
        templateVariants: [
          "Simplify: ({a}/{b} + {c}/{d}) x {e}.",
        ],
        variables: {
          a: { min: 2, max: 18 },
          b: { min: 2, max: 12 },
          c: { min: 2, max: 18 },
          d: { min: 2, max: 12 },
          e: { min: 2, max: 9 },
        },
        formula:
          "((a / b) + (c / d)) * e",
      };
    case "fundamentals-fractions":
      return {
        ...base,
        id: `registry-fundamentals-fractions-${difficulty.toLowerCase()}`,
        templateVariants: [
          "Find the value of ( {a}/{b} + {c}/{d} ) x {e}.",
        ],
        variables: {
          a: { min: 2, max: 18 },
          b: { min: 2, max: 12 },
          c: { min: 2, max: 18 },
          d: { min: 2, max: 12 },
          e: { min: 2, max: 9 },
        },
        formula:
          "((a / b) + (c / d)) * e",
      };
    case "fundamentals-hcf-lcm":
      return {
        ...base,
        id: `registry-fundamentals-hcf-lcm-${difficulty.toLowerCase()}`,
        templateVariants: [
          "The HCF of two numbers is {hcf} and their LCM is {lcm}. If one number is {known}, find the other number.",
        ],
        variables: {
          hcf: { min: 6, max: 24 },
          lcm: {
            min: 72,
            max: 1260,
          },
          known: {
            min: 18,
            max: 180,
          },
        },
        formula:
          "hcf * lcm / known",
      };
    case "fundamentals-surds-indices":
      return {
        ...base,
        id: `registry-fundamentals-surds-indices-${difficulty.toLowerCase()}`,
        templateVariants: [
          "Find the value of {base}^{m} x {base}^{n} / {base}^{p}.",
        ],
        variables: {
          base: { min: 2, max: 9 },
          m: { min: 2, max: 7 },
          n: { min: 3, max: 8 },
          p: { min: 2, max: 5 },
        },
        formula:
          "base ** (m + n - p)",
      };
    case "fundamentals-divisibility":
      return {
        ...base,
        id: `registry-fundamentals-divisibility-${difficulty.toLowerCase()}`,
        templateVariants: [
          "Find the unit digit of {base}^{exponent}.",
        ],
        variables: {
          base: { min: 7, max: 9 },
          exponent: {
            min: 21,
            max: 117,
          },
        },
        formula: "1",
      };
    case "simplification":
    case "simplification-vbodmas":
    case "simplification-roots-surds":
    case "simplification-fractions-decimals":
    case "simplification-identities":
    case "simplification-indices":
      return {
        ...base,
        id: `registry-${questionPattern.id}-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "direct",
          "comparative",
          "multi-step",
          "symbolic",
        ],
        templateVariants: [
          "Simplify the MathJax-rendered expression and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "number-system":
    case "number-system-classification":
    case "number-system-remainders":
    case "number-system-factors":
    case "number-system-surds-indices":
      return {
        ...base,
        id: `registry-${questionPattern.id}-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "direct",
          "conditional",
          "comparative",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the MathJax-rendered number system question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "number-system-divisibility":
      return {
        ...base,
        id: `registry-number-system-divisibility-${difficulty.toLowerCase()}`,
        templateVariants: [
          "What least number should be added to {number} so that it becomes divisible by {divisor}?",
        ],
        variables: {
          number: {
            min: 100,
            max: 999,
          },
          divisor: { min: 7, max: 11 },
        },
        formula:
          "divisor - (number % divisor)",
      };
    case "number-system-unit-digit":
      return {
        ...base,
        id: `registry-number-system-unit-digit-${difficulty.toLowerCase()}`,
        templateVariants: [
          "Find the unit digit of {base}^{exponent}.",
        ],
        variables: {
          base: { min: 7, max: 9 },
          exponent: {
            min: 21,
            max: 117,
          },
        },
        formula: "1",
      };
    case "number-system-factorials":
      return {
        ...base,
        id: `registry-number-system-factorials-${difficulty.toLowerCase()}`,
        templateVariants: [
          "How many trailing zeros are there in {n}! ?",
        ],
        variables: {
          n: {
            min: 25,
            max: 125,
          },
        },
        formula:
          "Math.floor(n / 5) + Math.floor(n / 25) + Math.floor(n / 125)",
      };
    case "number-system-recurring-decimals":
      return {
        ...base,
        id: `registry-number-system-recurring-decimals-${difficulty.toLowerCase()}`,
        templateVariants: [
          "0.272727... is written as p/q in lowest terms. Find p + q.",
        ],
        variables: {},
        formula: "14",
      };
    case "number-system-perfect-powers":
      return {
        ...base,
        id: `registry-number-system-perfect-powers-${difficulty.toLowerCase()}`,
        templateVariants: [
          "What least number should be multiplied by {number} to make it a perfect square?",
        ],
        variables: {
          number: {
            min: 72,
            max: 540,
          },
        },
        formula: "2",
      };
    case "algebra-basics":
    case "algebra":
    case "algebra-identities":
    case "algebra-linear":
    case "algebra-quadratic":
    case "algebra-inequalities-modulus":
    case "algebra-functions":
    case "algebra-logs":
    case "algebra-optimization":
    case "equations":
    case "equations-linear":
    case "equations-quadratic":
    case "equations-special":
    case "equations-modulus":
    case "equations-word-problems":
    case "progressions":
    case "progressions-ap":
    case "progressions-gp":
    case "progressions-hp-means":
    case "progressions-special-series":
    case "progressions-algebraic":
    case "functions":
    case "functions-domain-range":
    case "functions-types":
    case "functions-composition-inverse":
    case "functions-special":
    case "functions-functional-equations":
    case "functions-graphs":
    case "coordinate-geometry":
    case "coordinate-points":
    case "coordinate-lines":
    case "coordinate-areas-properties":
    case "coordinate-distance-reflection":
    case "coordinate-circles":
    case "coordinate-locus-advanced":
    case "set-theory":
    case "set-theory-definitions":
    case "set-theory-operations":
    case "set-theory-venn-2":
    case "set-theory-venn-3":
    case "set-theory-algebra-cartesian":
    case "set-theory-relations":
    case "permutation-combination":
    case "pc-fundamentals":
    case "pc-permutations":
    case "pc-combinations":
    case "pc-circular":
    case "pc-geometry-counting":
    case "pc-advanced-counting":
    case "trigonometry":
    case "trig-ratios":
    case "trig-standard-values":
    case "trig-complementary":
    case "trig-heights-distances":
    case "trig-identities":
    case "trig-quadrants-reduction":
      return {
        ...base,
        id: `registry-${questionPattern.id}-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "direct",
          "comparative",
          "conditional",
          "multi-step",
          "inferential",
          "symbolic",
        ],
        templateVariants: [
          questionPattern.topic ===
          "permutation-combination"
            ? "Solve the MathJax-rendered counting question and find the number of ways."
            : questionPattern.topic ===
                "trigonometry"
              ? "Solve the MathJax-rendered trigonometry question and find the required exact value."
              : questionPattern.topic ===
                  "equations"
                ? "Solve the MathJax-rendered equation question and find the required solution."
                : questionPattern.topic ===
                    "progressions"
                  ? "Solve the MathJax-rendered progression question and find the required value."
                  : questionPattern.topic ===
                      "functions"
                    ? "Solve the MathJax-rendered function question and find the required value."
                    : questionPattern.topic ===
                        "coordinate-geometry"
                      ? "Solve the MathJax-rendered coordinate geometry question and find the required value."
                      : questionPattern.topic ===
                          "set-theory"
                        ? "Solve the MathJax-rendered set theory question and find the required value."
                : "Solve the MathJax-rendered algebra question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "geometry-basics":
    case "geometry":
    case "geometry-lines-angles":
    case "geometry-triangles":
    case "geometry-similarity":
    case "geometry-right-triangles":
    case "geometry-circles":
    case "geometry-coordinate":
      return {
        ...base,
        id: `registry-${questionPattern.id}-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "direct",
          "comparative",
          "conditional",
          "multi-step",
          "inferential",
          "visual",
        ],
        templateVariants: [
          "Solve the MathJax-rendered geometry question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "mensuration":
      return {
        ...base,
        id: `registry-mensuration-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "direct",
          "comparative",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the MathJax-rendered mensuration question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "mensuration-2d":
      return {
        ...base,
        id: `registry-mensuration-2d-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "comparative",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the 2D mensuration question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "mensuration-3d":
      return {
        ...base,
        id: `registry-mensuration-3d-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "comparative",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the 3D mensuration question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "mensuration-recasting":
      return {
        ...base,
        id: `registry-mensuration-recasting-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the recasting or reshaping mensuration question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "mensuration-scaling":
      return {
        ...base,
        id: `registry-mensuration-scaling-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "comparative",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the scaling-based mensuration question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "probability":
    case "probability-sample-spaces":
    case "probability-events":
    case "probability-drawing":
    case "probability-conditional":
    case "probability-venn-odds":
      return {
        ...base,
        id: `registry-${questionPattern.id}-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "direct",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the MathJax-rendered probability question and find the required probability.",
        ],
        variables: {},
        formula: "0",
      };
    case "time-work":
      return {
        ...base,
        id: `registry-time-work-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "direct",
          "conditional",
          "comparative",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the time and work question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "time-work-phases":
      return {
        ...base,
        id: `registry-time-work-phases-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the phase-based time and work question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "time-work-efficiency":
      return {
        ...base,
        id: `registry-time-work-efficiency-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "comparative",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the efficiency-based time and work question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "time-work-pipes":
      return {
        ...base,
        id: `registry-time-work-pipes-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the pipes and cisterns question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "speed-distance":
      return {
        ...base,
        id: `registry-speed-distance-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "direct",
          "comparative",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the time, speed and distance question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "speed-distance-trains":
      return {
        ...base,
        id: `registry-speed-distance-trains-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "comparative",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the train-based speed and distance question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "speed-distance-races":
      return {
        ...base,
        id: `registry-speed-distance-races-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "comparative",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the race-based speed and distance question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "speed-distance-circular":
      return {
        ...base,
        id: `registry-speed-distance-circular-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "comparative",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the circular-track speed and distance question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "speed-distance-boats":
      return {
        ...base,
        id: `registry-speed-distance-boats-${difficulty.toLowerCase()}`,
        reasoningCapabilities: [
          "arithmetic",
          "comparative",
          "conditional",
          "multi-step",
          "inferential",
        ],
        templateVariants: [
          "Solve the moving-medium speed and distance question and find the required value.",
        ],
        variables: {},
        formula: "0",
      };
    case "percentage":
    default:
      return {
        ...base,
        id: `registry-percentage-${difficulty.toLowerCase()}`,
        templateVariants: [
          "What is {rate}% of {base}?",
        ],
        variables: {
          base: { min: 80, max: 900 },
          rate: { min: 5, max: 75 },
        },
        formula:
          "base * rate / 100",
      };
  }
}

function buildReasoningPattern(
  questionPattern: QuestionPattern,
  difficulty: DifficultyLabel,
): Pattern {
  const supportedMotifs =
    resolveMotifIds(
      questionPattern.compatibleMotifs,
    );
  const inferenceDepth =
    difficulty === "Hard"
      ? 6
      : difficulty === "Medium"
        ? 4
        : 2;
  const participantCount =
    difficulty === "Hard" ? 6 : 5;
  const isConstraintPattern = [
    "floor-puzzle",
    "box-stack-puzzle",
    "scheduling-puzzle",
    "constraint-mapping-triad",
    "ordering-ranking",
  ].includes(questionPattern.id);

  if (
    questionPattern.topic !==
    "seating-arrangement" &&
    !isConstraintPattern
  ) {
    return {
      id: `registry-${questionPattern.id}-${difficulty.toLowerCase()}`,
      type: "logic",
      section: "Reasoning",
      topic: questionPattern.label,
      subtopic: questionPattern.topic,
      difficulty,
      generationDomain: "reasoning",
      supportedQuestionTypes: [
        "logic",
      ],
      supportedMotifs,
      templateVariants: [
        "Read the reasoning question carefully and choose the correct answer.",
      ],
      variables: {},
    };
  }

  const base = {
    type: "logic" as const,
    section: "Reasoning",
    topic: "Seating Arrangement",
    difficulty,
    generationDomain:
      "seating-arrangement" as const,
    supportedQuestionTypes: [
      "logic" as const,
    ],
    supportedMotifs,
    templateVariants: [
      "Read the constraint arrangement carefully.",
    ],
    variables: {},
    participantCount,
    inferenceDepth,
  };

  if (isConstraintPattern) {
    const arrangementType =
      questionPattern.id ===
        "floor-puzzle"
        ? "floor"
        : questionPattern.id ===
            "box-stack-puzzle"
          ? "box-stack"
          : questionPattern.id ===
              "scheduling-puzzle"
            ? "scheduling"
            : questionPattern.id ===
                "constraint-mapping-triad"
              ? "mapping"
              : "ranking";

    return {
      ...base,
      id: `registry-${questionPattern.id}-${difficulty.toLowerCase()}`,
      topic: "Constraint Puzzles",
      subtopic: questionPattern.label,
      arrangementType,
      arrangementTypes: [
        arrangementType,
      ],
      orientationTypes: ["north"],
      participantCount:
        questionPattern.id ===
        "scheduling-puzzle"
          ? 5
          : participantCount,
      clueTypes: [
        "slot-fixed",
        "slot-gap",
        "slot-parity",
        "slot-immediate",
        "slot-not",
        "attribute",
      ],
    };
  }

  if (questionPattern.id === "parallel-row") {
    return {
      ...base,
      id: `registry-parallel-row-${difficulty.toLowerCase()}`,
      subtopic: "Parallel Row Seating",
      arrangementTypes: [
        "parallel-row",
        "double-row",
      ],
      orientationTypes: [
        "north",
        "south",
        "alternate",
        "mixed",
      ],
      clueTypes: [
        "neighbor",
        "left-right",
        "distance",
        "between",
        "not-adjacent",
        "facing",
        "opposite",
      ],
    };
  }

  if (
    questionPattern.id ===
    "circular-seating"
  ) {
    return {
      ...base,
      id: `registry-circular-seating-${difficulty.toLowerCase()}`,
      subtopic: "Circular Seating",
      arrangementTypes: [
        "circular",
      ],
      orientationTypes: [
        "center",
        "outward",
        "alternate",
        "mixed",
      ],
      clueTypes: [
        "neighbor",
        "left-right",
        "distance",
        "opposite",
        "not-opposite",
        "between",
      ],
    };
  }

  return {
    ...base,
    id: `registry-linear-seating-${difficulty.toLowerCase()}`,
    subtopic: "Linear Seating",
    arrangementType: "linear",
    orientationTypes: [
      "north",
      "south",
      "alternate",
      "mixed",
    ],
    clueTypes: [
      "left-right",
      "neighbor",
      "distance",
      "not-adjacent",
      "between",
    ],
  };
}

function buildEnglishPattern(
  questionPattern: QuestionPattern,
  difficulty: DifficultyLabel,
): Pattern {
  const topic =
    questionPattern.topic;
  const isCATLogic =
    topic === "para-jumbles" ||
    topic ===
      "reading-comprehension";
  const isVocabulary =
    topic === "vocabulary" ||
    topic === "root-words" ||
    topic === "idioms" ||
    topic === "fillers";
  const profileHint =
    isCATLogic
      ? "Logical Discourse Engine"
      : isVocabulary
        ? "Lexical Semantic Engine"
        : "Structural Grammar Engine";

  return {
    id: `registry-${questionPattern.id}-${difficulty.toLowerCase()}`,
    type: "logic",
    section: "English",
    topic: questionPattern.label,
    subtopic: questionPattern.topic,
    difficulty,
    generationDomain: "english",
    supportedQuestionTypes: [
      "logic",
    ],
    supportedMotifs: resolveMotifIds(
      questionPattern.compatibleMotifs,
    ),
    reasoningCapabilities: [
      "conditional",
      "inferential",
      "multi-step",
    ],
    templateVariants: [
      `${profileHint}: solve using rule-violation and context mapping.`,
    ],
    explanationTemplate:
      `${profileHint}: ruleApplied must be shown.`,
    variables: {},
    validationRules: [
      "one best answer",
      "ruleApplied required",
      "avoid random sentence generation",
    ],
  };
}

function buildPunjabiPattern(
  questionPattern: QuestionPattern,
  difficulty: DifficultyLabel,
): Pattern {
  const isAdvanced =
    difficulty === "Hard";

  return {
    id: `registry-${questionPattern.id}-${difficulty.toLowerCase()}`,
    type: "logic",
    section: "Punjabi",
    topic: questionPattern.label,
    subtopic: questionPattern.topic,
    difficulty,
    generationDomain: "punjabi",
    supportedQuestionTypes: [
      "logic",
    ],
    supportedMotifs: resolveMotifIds(
      questionPattern.compatibleMotifs,
    ),
    reasoningCapabilities: [
      "conditional",
      "inferential",
      "multi-step",
    ],
    templateVariants: [
      isAdvanced
        ? "Paper-B Punjabi engine: apply Duggal-standard Gurmukhi semantic logic."
        : "Paper-A Punjabi engine: apply PSEB Standard 10th-level vyakaran rules.",
    ],
    explanationTemplate:
      "Engine_Punjabi: bilingual explanation with ruleApplied is required.",
    variables: {},
    validationRules: [
      "Gurmukhi text required",
      "Duggal Guard orthography check",
      "one best answer",
      "avoid colloquial/regional slang",
    ],
  };
}

function buildKnowledgePattern(
  questionPattern: QuestionPattern,
  difficulty: DifficultyLabel,
): Pattern {
  const isComputer =
    questionPattern.domain === "computer";
  const section = isComputer
    ? "Computer Awareness"
    : "General Knowledge";
  const anchor = isComputer
    ? "Arihant Computer Awareness"
    : questionPattern.topic.includes(
        "punjab",
      )
      ? "Sadda Punjab"
      : "Lucent GK / Ghatna Chakra";

  return {
    id: `registry-${questionPattern.id}-${difficulty.toLowerCase()}`,
    type: "logic",
    section,
    topic: questionPattern.label,
    subtopic: questionPattern.topic,
    difficulty,
    generationDomain:
      questionPattern.domain,
    supportedQuestionTypes: [
      "logic",
    ],
    supportedMotifs: resolveMotifIds(
      questionPattern.compatibleMotifs,
    ),
    reasoningCapabilities: [
      "direct",
      "conditional",
      "inferential",
    ],
    templateVariants: [
      `${anchor}: generate from Entity-Attribute-Set facts with category-close distractors.`,
    ],
    explanationTemplate:
      "KnowledgeRetrievalEngine: show EAS mapping and Did You Know note.",
    variables: {},
    validationRules: [
      "one best answer",
      "factSnapshot required",
      "wrong options must be category-close",
    ],
  };
}

function buildDIPatternForQuestion(
  questionPattern: QuestionPattern,
  difficulty: DifficultyLabel,
): Pattern {
  const topology =
    questionPattern.id === "grouped-bar-di"
      ? "grouped-bar"
      : questionPattern.id ===
          "stacked-bar-di"
        ? "stacked-bar"
        : questionPattern.id ===
            "dual-pie-di"
          ? "dual-pie-chart"
          : questionPattern.id ===
              "caselet-di"
            ? "caselet"
            : undefined;
  const visualType =
    questionPattern.id === "pie-chart" ||
    questionPattern.id === "dual-pie-di"
      ? "pie"
      : questionPattern.id === "bar-graph" ||
          questionPattern.id ===
            "grouped-bar-di" ||
          questionPattern.id ===
            "stacked-bar-di"
        ? "bar"
      : questionPattern.id ===
            "line-graph"
          ? "line"
          : "table";

  return {
    id: `registry-${questionPattern.id}-${difficulty.toLowerCase()}`,
    type: "di",
    section: "DI",
    topic: questionPattern.label,
    subtopic: questionPattern.topic,
    difficulty,
    generationDomain: "di",
    supportedQuestionTypes: ["di"],
    supportedMotifs: resolveMotifIds(
      questionPattern.compatibleMotifs,
    ),
    templateVariants: [
      "Study the data carefully and answer the questions.",
    ],
    variables: {},
    diPattern: buildDIPattern(
      visualType,
      topology,
    ),
  };
}

export function resolveQuestionPatternToPattern(
  request: PatternGenerationRequest,
): Pattern | undefined {
  if (
    request.patternId &&
    !request.pattern
  ) {
    const registeredPattern =
      (ALL_PATTERNS as Pattern[]).find(
        (pattern) =>
          pattern.id ===
          request.patternId,
      );

    if (registeredPattern) {
      return registeredPattern;
    }
  }

  const questionPattern =
    findQuestionPattern(request);

  if (!questionPattern) {
    return undefined;
  }

  if (questionPattern.enabled === false) {
    return undefined;
  }

  const difficulty =
    normalizePatternDifficulty(
      request.difficulty,
    );
  const friendlyDifficulty =
    difficulty.toLowerCase() as QuestionPatternDifficulty;

  if (
    !questionPattern.supportedDifficulties.includes(
      friendlyDifficulty,
    )
  ) {
    return undefined;
  }

  if (
    questionPattern.domain ===
    "reasoning"
  ) {
    return buildReasoningPattern(
      questionPattern,
      difficulty,
    );
  }

  if (
    questionPattern.domain === "di"
  ) {
    return buildDIPatternForQuestion(
      questionPattern,
      difficulty,
    );
  }

  if (
    questionPattern.domain ===
    "quant"
  ) {
    return buildQuantPattern(
      questionPattern,
      difficulty,
    );
  }

  if (
    questionPattern.domain ===
    "english"
  ) {
    return buildEnglishPattern(
      questionPattern,
      difficulty,
    );
  }

  if (
    questionPattern.domain ===
    "punjabi"
  ) {
    return buildPunjabiPattern(
      questionPattern,
      difficulty,
    );
  }

  if (
    questionPattern.domain ===
      "knowledge" ||
    questionPattern.domain ===
      "computer"
  ) {
    return buildKnowledgePattern(
      questionPattern,
      difficulty,
    );
  }

  return undefined;
}

export function proposeMotifIntake(
  input: {
    candidates: string[];
    distractorPatterns?: string[];
    difficultyDrivers?: string[];
  },
): MotifIntakeCandidate[] {
  return input.candidates.map(
    (candidate) => {
      const motif =
        resolveCanonicalMotif(
          candidate,
        );

      return {
        proposedName: candidate,
        mappedCanonicalName:
          motif?.canonicalName,
        duplicateOf:
          motif?.canonicalName,
        confidence: motif ? 0.9 : 0.4,
        distractorPatterns:
          input.distractorPatterns ?? [],
        difficultyDrivers:
          input.difficultyDrivers ?? [],
        reviewStatus: "pending",
      };
    },
  );
}
