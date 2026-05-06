import type {
  DifficultyLabel,
  DIPattern,
  ExamProfileId,
  Pattern,
} from "./core/generator-engine";
import { ALL_PATTERNS } from "./patterns";

export type QuestionPatternDomain =
  | "reasoning"
  | "quant"
  | "english"
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
  sbi: "sbi",
  ssc: "ssc",
  cat: "cat",
  rrb: "rrb",
};

export const MOTIF_REGISTRY: Motif[] = [
  {
    canonicalName: "sparse-anchor",
    aliases: [
      "seating-sparse-anchor",
      "sparse_anchor",
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
    ],
    domain: "reasoning",
    topic: "seating-arrangement",
    tags: ["orientation", "left-right"],
  },
  {
    canonicalName: "circular-opposite",
    aliases: ["circular_opposite_chain"],
    domain: "reasoning",
    topic: "seating-arrangement",
    tags: ["circular", "opposite"],
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
    canonicalName: "weighted-average-confusion",
    domain: "quant",
    topic: "averages",
    distractorHints: [
      "Use simple average as a trap option.",
    ],
  },
  {
    canonicalName: "efficiency-substitution",
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "simple-combined-work",
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "delayed-join",
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "alternating-operation",
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "positive-negative-competition",
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "worker-equivalence",
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "resource-consumption",
    domain: "quant",
    topic: "time-work",
  },
  {
    canonicalName: "inverse-work-trap",
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
    canonicalName: "profit-discount-trap",
    aliases: ["discount-profit-link"],
    domain: "quant",
    topic: "profit-loss",
    distractorHints: [
      "Confuse profit amount with profit percentage.",
    ],
  },
  {
    canonicalName: "interest-period-trap",
    aliases: [
      "compounding-trap",
      "interest-difference-backsolve",
    ],
    domain: "quant",
    topic: "simple-interest",
  },
  {
    canonicalName: "mixture-weighted-average",
    aliases: [
      "weighted-mixture-shift",
      "replacement-alligation",
    ],
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
  {
    canonicalName: "boats-relative-speed",
    aliases: ["relative-speed-meet"],
    domain: "quant",
    topic: "boats-streams",
  },
  {
    canonicalName: "arithmetic-order-trap",
    domain: "quant",
    topic: "simplification",
  },
  {
    canonicalName: "divisibility-remainder",
    domain: "quant",
    topic: "number-system",
  },
  {
    canonicalName: "geometry-area-base",
    domain: "quant",
    topic: "geometry-basics",
  },
  {
    canonicalName: "mensuration-dimension-shift",
    aliases: [
      "dimension-scale-effect",
      "composite-shape-breakdown",
    ],
    domain: "quant",
    topic: "mensuration",
  },
  {
    canonicalName: "probability-favourable-total",
    domain: "quant",
    topic: "probability",
  },
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
    ],
    domain: "reasoning",
    topic: "direction-sense",
  },
  {
    canonicalName: "family-relation-chain",
    aliases: [
      "generation_gap_reasoning",
      "indirect_relation_deduction",
    ],
    domain: "reasoning",
    topic: "blood-relation",
  },
  {
    canonicalName: "symbolic-comparison-chain",
    aliases: [
      "compound_inequality_linking",
      "indirect_conclusion_validation",
    ],
    domain: "reasoning",
    topic: "inequality",
  },
  {
    canonicalName: "alphabet-transform",
    aliases: [
      "direct_alphabet_shift",
      "multi_stage_word_transform",
    ],
    domain: "reasoning",
    topic: "coding-decoding",
  },
  {
    canonicalName: "rank-offset",
    aliases: ["ordering-dual-rank-offset"],
    domain: "reasoning",
    topic: "ordering-ranking",
  },
  {
    canonicalName: "venn-conclusion-filter",
    aliases: ["venn-overlap-filter"],
    domain: "reasoning",
    topic: "syllogism",
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
        "Floor-based arrangement puzzle. Registry-ready, generator disabled until floor topology is implemented.",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "sparse-anchor",
        "indirect-elimination",
      ],
      examStyles: ["banking"],
      enabled: false,
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
        "reverse-percentage",
        "hidden-base-shift",
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
        "simple-combined-work",
        "delayed-join",
        "alternating-operation",
        "positive-negative-competition",
        "worker-equivalence",
        "resource-consumption",
        "efficiency-substitution",
        "inverse-work-trap",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "speed-distance",
      domain: "quant",
      topic: "speed-time-distance",
      label: "Speed, Time & Distance",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "relative-speed-meet",
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
        "Average, total, count, and weighted mean starter questions.",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "weighted-average-confusion",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "profit-loss",
      domain: "quant",
      topic: "profit-loss",
      label: "Profit & Loss",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "profit-discount-trap",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "simple-interest",
      domain: "quant",
      topic: "simple-interest",
      label: "Simple Interest",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "interest-period-trap",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "compound-interest",
      domain: "quant",
      topic: "compound-interest",
      label: "Compound Interest",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "interest-period-trap",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "mixture-alligation",
      domain: "quant",
      topic: "mixture-alligation",
      label: "Mixture & Alligation",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
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
        "boats-relative-speed",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "simplification",
      domain: "quant",
      topic: "simplification",
      label: "Simplification",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "arithmetic-order-trap",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "number-system",
      domain: "quant",
      topic: "number-system",
      label: "Number System",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "divisibility-remainder",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "algebra-basics",
      domain: "quant",
      topic: "algebra-basics",
      label: "Algebra Basics",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "equation-balance-shift",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "geometry-basics",
      domain: "quant",
      topic: "geometry-basics",
      label: "Geometry Basics",
      supportedDifficulties: [
        "easy",
        "medium",
      ],
      compatibleMotifs: [
        "geometry-area-base",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "mensuration",
      domain: "quant",
      topic: "mensuration",
      label: "Mensuration",
      supportedDifficulties: [
        "easy",
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "mensuration-dimension-shift",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "probability",
      domain: "quant",
      topic: "probability",
      label: "Probability",
      supportedDifficulties: [
        "medium",
        "hard",
      ],
      compatibleMotifs: [
        "probability-favourable-total",
      ],
      examStyles: ["ssc", "banking"],
      enabled: true,
    },
    {
      id: "permutation-combination",
      domain: "quant",
      topic: "permutation-combination",
      label: "Permutation & Combination",
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
        "direction-turn-chain",
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
        "family-relation-chain",
      ],
      examStyles: ["ssc", "banking"],
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
        "symbolic-comparison-chain",
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
        "alphabet-transform",
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
        "venn-conclusion-filter",
      ],
      examStyles: ["banking"],
      enabled: false,
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
        "subject-verb-mismatch",
        "tense-confusion",
      ],
      examStyles: ["ssc", "banking"],
      enabled: false,
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
      ],
      examStyles: ["ssc", "banking"],
      enabled: false,
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
      enabled: false,
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
      enabled: false,
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
      enabled: false,
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
      enabled: false,
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
  return QUESTION_PATTERN_REGISTRY.filter(
    (pattern) =>
      includeDisabled ||
      pattern.enabled !== false,
  );
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
): DIPattern {
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
  const base = {
    type: "formula" as const,
    section: "Quant",
    topic: questionPattern.label,
    subtopic: questionPattern.topic,
    difficulty,
    generationDomain: "quant" as const,
    supportedQuestionTypes: [
      "formula" as const,
    ],
    supportedMotifs: resolveMotifIds(
      questionPattern.compatibleMotifs,
    ),
  };

  switch (questionPattern.id) {
    case "averages":
      return {
        ...base,
        id: `registry-averages-${difficulty.toLowerCase()}`,
        templateVariants: [
          "The average of {count} numbers is {average}. What is their total?",
        ],
        variables: {
          count: { min: 4, max: 12 },
          average: { min: 15, max: 95 },
        },
        formula: "count * average",
      };
    case "profit-loss":
      return {
        ...base,
        id: `registry-profit-loss-${difficulty.toLowerCase()}`,
        templateVariants: [
          "An article is bought for Rs. {cost} and sold at a profit of {profit}%. What is the profit amount?",
        ],
        variables: {
          cost: { min: 120, max: 1500 },
          profit: { min: 5, max: 35 },
        },
        formula: "cost * profit / 100",
      };
    case "simple-interest":
      return {
        ...base,
        id: `registry-simple-interest-${difficulty.toLowerCase()}`,
        templateVariants: [
          "Find the simple interest on Rs. {principal} at {rate}% per annum for {time} years.",
        ],
        variables: {
          principal: { min: 500, max: 8000 },
          rate: { min: 4, max: 18 },
          time: { min: 1, max: 5 },
        },
        formula:
          "principal * rate * time / 100",
      };
    case "compound-interest":
      return {
        ...base,
        id: `registry-compound-interest-${difficulty.toLowerCase()}`,
        templateVariants: [
          "Find the compound interest on Rs. {principal} at {rate}% per annum for 2 years, compounded annually.",
        ],
        variables: {
          principal: { min: 500, max: 8000 },
          rate: { min: 4, max: 18 },
        },
        formula:
          "principal * ((100 + rate) * (100 + rate) - 10000) / 10000",
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
        templateVariants: [
          "{q1} litres of a {p1}% solution is mixed with {q2} litres of a {p2}% solution. What is the percentage strength of the mixture?",
        ],
        variables: {
          q1: { min: 5, max: 40 },
          q2: { min: 5, max: 40 },
          p1: { min: 10, max: 80 },
          p2: { min: 10, max: 80 },
        },
        formula:
          "(q1 * p1 + q2 * p2) / (q1 + q2)",
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
        templateVariants: [
          "A boat travels {distance} km downstream. If its speed in still water is {speed} km/h and stream speed is {stream} km/h, find the time taken.",
        ],
        variables: {
          distance: { min: 20, max: 180 },
          speed: { min: 12, max: 45 },
          stream: { min: 2, max: 12 },
        },
        formula: "distance / (speed + stream)",
      };
    case "simplification":
      return {
        ...base,
        id: `registry-simplification-${difficulty.toLowerCase()}`,
        templateVariants: [
          "Simplify: {a} + {b} x {c} - {d}.",
        ],
        variables: {
          a: { min: 10, max: 120 },
          b: { min: 3, max: 25 },
          c: { min: 4, max: 20 },
          d: { min: 5, max: 90 },
        },
        formula: "a + b * c - d",
      };
    case "number-system":
      return {
        ...base,
        id: `registry-number-system-${difficulty.toLowerCase()}`,
        templateVariants: [
          "What is the remainder when {number} is divided by {divisor}?",
        ],
        variables: {
          number: { min: 100, max: 9999 },
          divisor: { min: 3, max: 19 },
        },
        formula: "number % divisor",
      };
    case "algebra-basics":
      return {
        ...base,
        id: `registry-algebra-basics-${difficulty.toLowerCase()}`,
        templateVariants: [
          "If {a}x + {b} = {c}, find x.",
        ],
        variables: {
          a: { min: 2, max: 12 },
          b: { min: 5, max: 80 },
          c: { min: 90, max: 240 },
        },
        formula: "(c - b) / a",
      };
    case "geometry-basics":
      return {
        ...base,
        id: `registry-geometry-basics-${difficulty.toLowerCase()}`,
        templateVariants: [
          "Find the area of a triangle with base {base} cm and height {height} cm.",
        ],
        variables: {
          base: { min: 6, max: 60 },
          height: { min: 5, max: 50 },
        },
        formula: "base * height / 2",
      };
    case "mensuration":
      return {
        ...base,
        id: `registry-mensuration-${difficulty.toLowerCase()}`,
        templateVariants: [
          "Find the area of a rectangle with length {length} cm and breadth {breadth} cm.",
        ],
        variables: {
          length: { min: 8, max: 90 },
          breadth: { min: 5, max: 60 },
        },
        formula: "length * breadth",
      };
    case "probability":
      return {
        ...base,
        id: `registry-probability-${difficulty.toLowerCase()}`,
        templateVariants: [
          "A bag has {favourable} favourable items out of {total} total items. What is the probability of selecting a favourable item?",
        ],
        variables: {
          favourable: { min: 2, max: 20 },
          total: { min: 21, max: 60 },
        },
        formula: "favourable / total",
      };
    case "permutation-combination":
      return {
        ...base,
        id: `registry-permutation-combination-${difficulty.toLowerCase()}`,
        templateVariants: [
          "In how many ways can 2 people be selected from {n} people?",
        ],
        variables: {
          n: { min: 5, max: 40 },
        },
        formula: "n * (n - 1) / 2",
      };
    case "time-work":
      return {
        ...base,
        id: `registry-time-work-${difficulty.toLowerCase()}`,
        templateVariants: [
          "A can complete a work in {a} days and B can complete it in {b} days. In how many days can they complete it together?",
        ],
        variables: {
          a: { min: 6, max: 24 },
          b: { min: 8, max: 30 },
        },
        formula: "a * b / (a + b)",
      };
    case "speed-distance":
      return {
        ...base,
        id: `registry-speed-distance-${difficulty.toLowerCase()}`,
        templateVariants: [
          "A vehicle covers {distance} km at a speed of {speed} km/h. How many hours does it take?",
        ],
        variables: {
          distance: {
            min: 60,
            max: 360,
          },
          speed: { min: 20, max: 90 },
        },
        formula:
          "distance / speed",
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

  if (
    questionPattern.topic !==
    "seating-arrangement"
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
      "Read the seating arrangement carefully.",
    ],
    variables: {},
    participantCount,
    inferenceDepth,
  };

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

function buildDIPatternForQuestion(
  questionPattern: QuestionPattern,
  difficulty: DifficultyLabel,
): Pattern {
  const visualType =
    questionPattern.id === "pie-chart"
      ? "pie"
      : questionPattern.id === "bar-graph"
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
