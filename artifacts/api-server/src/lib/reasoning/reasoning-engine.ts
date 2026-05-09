import type {
  OptionMetadata,
  QuantTopicCluster,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import type {
  ReasoningOperation,
  ReasoningStep,
} from "../shared";

export type ReasoningEngineFamily =
  | "Engine_Pattern"
  | "Engine_Relational"
  | "Engine_Constraint"
  | "Engine_Spatial"
  | "Engine_Abstract"
  | "Engine_Temporal"
  | "Engine_Boolean"
  | "Engine_Critical";

export type ReasoningStyleAnchor =
  | "RS_AGGARWAL_POSITIONAL"
  | "ARUN_SHARMA_TIERED_CONSTRAINTS"
  | "MK_PANDEY_FORMAL_LOGIC"
  | "CYCLIC_ACCUMULATOR"
  | "COORDINATE_SYMMETRY"
  | "MATRIX_SYMMETRY"
  | "DAG_KINSHIP"
  | "SEMANTIC_SCOPE";

export type ReasoningSelfSolveResult = {
  solutionCount: number;
  uniqueAnswer: boolean;
  issues: string[];
};

export type ReasoningAuditInput = {
  topicCluster: QuantTopicCluster;
  motif: QuantMotif;
  text: string;
  options: string[];
  correct: number;
  reasoningSteps: ReasoningStep[];
  optionMetadata?: OptionMetadata[];
};

export type DeductionArrayItem = {
  step: number;
  operation: ReasoningOperation;
  statement: string;
  mathjax: string;
};

export type ReasoningScenario = {
  engineFamily: ReasoningEngineFamily;
  styleAnchor: ReasoningStyleAnchor;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  inferenceTrace: {
    solutionCount: number;
    uniqueAnswer: boolean;
    issues: string[];
    steps: string[];
    deductionArray: DeductionArrayItem[];
    logicSymbols: string[];
  };
};

export type ReasoningAuditResult =
  ReasoningSelfSolveResult & {
    engineFamily: ReasoningEngineFamily;
    styleAnchor: ReasoningStyleAnchor;
    deductionArray: DeductionArrayItem[];
  logicSymbols: string[];
};

export type ReasoningEngineRegistryEntry = {
  engineFamily: ReasoningEngineFamily;
  topics: string[];
  motifPrefixes: string[];
  description: string;
};

export const REASONING_ENGINE_REGISTRY: ReasoningEngineRegistryEntry[] =
  [
    {
      engineFamily: "Engine_Pattern",
      topics: [
        "coding-decoding",
        "coding",
        "series",
        "number-series",
        "letter-series",
        "analogy",
      ],
      motifPrefixes: [
        "shift-",
        "map-",
        "math-",
      ],
      description:
        "State-shift transformations for coding, series, and analogy.",
    },
    {
      engineFamily:
        "Engine_Relational",
      topics: [
        "blood-relations",
        "blood-relation",
        "coded-relations",
        "family-tree-puzzles",
      ],
      motifPrefixes: ["rel-"],
      description:
        "Directed acyclic kinship graph reasoning.",
    },
    {
      engineFamily:
        "Engine_Constraint",
      topics: [
        "seating-arrangement",
        "seating",
        "puzzles",
        "ranking",
        "ordering-ranking",
      ],
      motifPrefixes: [],
      description:
        "Backtracking constraint solving for arrangements and puzzle grids.",
    },
    {
      engineFamily: "Engine_Spatial",
      topics: [
        "direction-sense",
        "directions",
        "cubes-dice",
        "dice",
        "mirrors",
        "mirror-water-images",
        "paper-folding",
      ],
      motifPrefixes: ["spa-"],
      description:
        "Coordinate and symmetry reasoning for paths, dice, cubes, and images.",
    },
    {
      engineFamily: "Engine_Abstract",
      topics: [
        "abstract-reasoning",
        "engine-abstract",
        "figure-series",
        "non-verbal-series",
        "paper-cutting",
        "paper-folding-cutting",
        "embedded-figure",
        "embedded-figures",
      ],
      motifPrefixes: ["abs-"],
      description:
        "Matrix transposition and symmetry reasoning for non-verbal SVG figure tasks.",
    },
    {
      engineFamily: "Engine_Temporal",
      topics: [
        "temporal-reasoning",
        "clocks",
        "calendars",
      ],
      motifPrefixes: ["tem-"],
      description:
        "Cyclic modular arithmetic for calendar and clock logic.",
    },
    {
      engineFamily: "Engine_Boolean",
      topics: [
        "inequality",
        "inequalities",
        "syllogism",
        "syllogisms",
        "logical-venn",
        "boolean-deductions",
      ],
      motifPrefixes: ["ded-"],
      description:
        "Set inclusion, Venn, and formal definite/possible deduction.",
    },
    {
      engineFamily: "Engine_Critical",
      topics: [
        "critical-inference",
        "statement-assumption",
        "statement-conclusion",
        "course-of-action",
        "cause-effect",
        "strong-weak-arguments",
        "assumption",
        "conclusion",
      ],
      motifPrefixes: ["cri-"],
      description:
        "Premise-bridge-inference reasoning with scope and tone validation.",
    },
  ];

const ENGINE_STYLE_MAP: Record<
  ReasoningEngineFamily,
  ReasoningStyleAnchor
> = {
  Engine_Pattern:
    "RS_AGGARWAL_POSITIONAL",
  Engine_Relational: "DAG_KINSHIP",
  Engine_Constraint:
    "ARUN_SHARMA_TIERED_CONSTRAINTS",
  Engine_Spatial:
    "COORDINATE_SYMMETRY",
  Engine_Abstract: "MATRIX_SYMMETRY",
  Engine_Temporal:
    "CYCLIC_ACCUMULATOR",
  Engine_Boolean:
    "MK_PANDEY_FORMAL_LOGIC",
  Engine_Critical: "SEMANTIC_SCOPE",
};

export class ReasoningEngine {
  static registry() {
    return REASONING_ENGINE_REGISTRY;
  }

  static resolveEngineForTopic(
    topic: string,
    motifId?: string,
  ) {
    const normalized =
      topic.toLowerCase().trim();
    const motifMatch =
      motifId &&
      REASONING_ENGINE_REGISTRY.find(
        (entry) =>
          entry.motifPrefixes.some(
            (prefix) =>
              motifId.startsWith(prefix),
          ),
      );

    if (motifMatch) {
      return motifMatch.engineFamily;
    }

    return (
      REASONING_ENGINE_REGISTRY.find(
        (entry) =>
          entry.topics.some(
            (registeredTopic) =>
              normalized ===
                registeredTopic ||
              normalized.includes(
                registeredTopic,
              ),
          ),
      )?.engineFamily ??
      "Engine_Pattern"
    );
  }

  static classify(
    topicCluster: QuantTopicCluster,
    motifId?: string,
  ): ReasoningEngineFamily {
    const registryMatch =
      ReasoningEngine.resolveEngineForTopic(
        topicCluster,
        motifId,
      );

    if (registryMatch) {
      return registryMatch;
    }

    if (
      topicCluster === "coding-decoding" ||
      motifId?.startsWith("shift-") ||
      motifId?.startsWith("map-") ||
      motifId?.startsWith("math-")
    ) {
      return "Engine_Pattern";
    }

    if (
      topicCluster ===
      "blood-relations"
    ) {
      return "Engine_Relational";
    }

    if (
      topicCluster ===
        "seating-arrangement" ||
      topicCluster === "puzzles"
    ) {
      return "Engine_Constraint";
    }

    if (
      topicCluster ===
      "direction-sense"
    ) {
      return "Engine_Spatial";
    }

    if (
      topicCluster ===
        "abstract-reasoning" ||
      motifId?.startsWith("abs-")
    ) {
      return "Engine_Abstract";
    }

    if (
      topicCluster ===
      "temporal-reasoning"
    ) {
      return "Engine_Temporal";
    }

    if (
      topicCluster === "inequality" ||
      topicCluster === "syllogism"
    ) {
      return "Engine_Boolean";
    }

    if (
      topicCluster ===
      "critical-inference"
    ) {
      return "Engine_Critical";
    }

    return "Engine_Pattern";
  }

  static getStyleAnchor(
    engineFamily: ReasoningEngineFamily,
  ) {
    return ENGINE_STYLE_MAP[
      engineFamily
    ];
  }

  static selfSolve(
    input: Pick<
      ReasoningAuditInput,
      "options" | "correct"
    >,
  ): ReasoningSelfSolveResult {
    const issues: string[] = [];
    const correctValue =
      input.options[input.correct];
    const occurrenceCount =
      correctValue === undefined
        ? 0
        : input.options.filter(
            (option) =>
              option === correctValue,
          ).length;

    if (correctValue === undefined) {
      issues.push(
        "Correct option index is outside the options array.",
      );
    }

    if (
      new Set(input.options).size !==
      input.options.length
    ) {
      issues.push(
        "Options are not unique, so the self-solver cannot guarantee one answer.",
      );
    }

    return {
      solutionCount: occurrenceCount,
      uniqueAnswer:
        occurrenceCount === 1 &&
        issues.length === 0,
      issues,
    };
  }

  static buildDeductionArray(
    steps: ReasoningStep[],
    engineFamily: ReasoningEngineFamily,
  ): DeductionArrayItem[] {
    return steps.map(
      (step, index) => ({
        step: index + 1,
        operation: step.operation,
        statement: step.detail,
        mathjax:
          ReasoningEngine.renderDeductionMath(
            step.detail,
            engineFamily,
            index,
          ),
      }),
    );
  }

  static audit(
    input: ReasoningAuditInput,
  ): ReasoningAuditResult {
    const engineFamily =
      ReasoningEngine.classify(
        input.topicCluster,
        input.motif.id,
      );
    const selfSolve =
      ReasoningEngine.selfSolve(input);

    return {
      ...selfSolve,
      engineFamily,
      styleAnchor:
        ReasoningEngine.getStyleAnchor(
          engineFamily,
        ),
      deductionArray:
        ReasoningEngine.buildDeductionArray(
          input.reasoningSteps,
          engineFamily,
        ),
      logicSymbols:
        ReasoningEngine.logicSymbolsFor(
          engineFamily,
        ),
    };
  }

  private static logicSymbolsFor(
    engineFamily: ReasoningEngineFamily,
  ) {
    switch (engineFamily) {
      case "Engine_Boolean":
        return [
          "$\\Rightarrow$",
          "$\\therefore$",
          "$\\cap$",
          "$\\subseteq$",
        ];
      case "Engine_Temporal":
        return [
          "$\\bmod\\ 7$",
          "$5.5^{\\circ}/\\text{min}$",
        ];
      case "Engine_Spatial":
        return [
          "$P_{new}=P_{old}+[d\\cos\\theta,d\\sin\\theta]$",
        ];
      case "Engine_Abstract":
        return [
          "$F_{n+1}=T(F_n)$",
          "$R_{90^{\\circ}}$",
          "$\\text{mirror}_{x,y}$",
        ];
      case "Engine_Relational":
        return [
          "$PARENT\\_OF$",
          "$SPOUSE\\_OF$",
          "$\\therefore$",
        ];
      case "Engine_Constraint":
        return [
          "$SolutionCount=1$",
          "$\\therefore$",
        ];
      case "Engine_Critical":
        return [
          "$P+B\\Rightarrow I$",
          "$\\therefore$",
        ];
      case "Engine_Pattern":
      default:
        return [
          "$I\\xrightarrow{R}O$",
          "$\\therefore$",
        ];
    }
  }

  private static renderDeductionMath(
    statement: string,
    engineFamily: ReasoningEngineFamily,
    index: number,
  ) {
    const escaped =
      statement.replace(/\$/g, "");

    switch (engineFamily) {
      case "Engine_Boolean":
        return `$S_${index + 1}\\Rightarrow ${escaped}\\ \\therefore\\ \\text{test conclusion}$`;
      case "Engine_Temporal":
        return `$T_${index + 1}: ${escaped}\\ \\bmod\\ \\text{cycle}$`;
      case "Engine_Spatial":
        return `$P_${index + 1}: ${escaped}$`;
      case "Engine_Abstract":
        return `$F_${index + 1}\\xrightarrow{T}F_${index + 2}: ${escaped}$`;
      case "Engine_Relational":
        return `$G_${index + 1}: ${escaped}\\ \\therefore\\ \\text{relation}$`;
      case "Engine_Constraint":
        return `$C_${index + 1}: ${escaped}\\Rightarrow SolutionCount=1$`;
      case "Engine_Critical":
        return `$P+B\\Rightarrow I_${index + 1}: ${escaped}$`;
      case "Engine_Pattern":
      default:
        return `$I_${index + 1}\\xrightarrow{R}O_${index + 1}: ${escaped}$`;
    }
  }
}

export const ReasoningGeneratorRegistry = {
  engines: REASONING_ENGINE_REGISTRY,
  resolveEngineForTopic:
    ReasoningEngine.resolveEngineForTopic,
  classify: ReasoningEngine.classify,
};
