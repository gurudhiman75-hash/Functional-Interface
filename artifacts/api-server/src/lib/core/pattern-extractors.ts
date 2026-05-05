import {
  UNIVERSAL_MOTIFS,
  type UniversalMotif,
} from "../motifs";
import type {
  Scenario,
} from "./domain-adapters";
import type {
  DISet,
  FormulaQuestion,
  GeneratedQuestion,
} from "./generator-engine";

type ExtractorQuestion =
  | FormulaQuestion
  | DISet
  | GeneratedQuestion;

export type PatternExtractionContext = {
  scenario: Scenario;
  question?: ExtractorQuestion;
};

export type ExtractedStructure = {
  domain: string;
  subtype: string;
  entityCount: number;
  constraintCount: number;
  structureTokens: string[];
  topology?: string;
  metadata?: Record<string, unknown>;
};

export type ExtractedDifficulty = {
  cognitiveLoad: number;
  inferenceDepth: number;
  calculationComplexity: number;
  distractorComplexity: number;
  ambiguityScore: number;
  solvingTimeEstimate: number;
  difficultyBand?: string;
  metadata?: Record<string, unknown>;
};

export type ExtractedDistractor = {
  type: string;
  label: string;
  trapType?: string;
  frequency: number;
  metadata?: Record<string, unknown>;
};

export type ExtractedMotifSignal = {
  motifId: string;
  domain: string;
  archetype: string;
  confidence: number;
  metadata?: Record<string, unknown>;
};

export type ExtractedPatternIntelligence = {
  domain: string;
  structure: ExtractedStructure;
  difficulty: ExtractedDifficulty;
  distractors: ExtractedDistractor[];
  motifs: ExtractedMotifSignal[];
};

export interface PatternExtractor {
  domain: string;
  extractStructure(
    context: PatternExtractionContext,
  ): ExtractedStructure;
  extractDifficulty(
    context: PatternExtractionContext,
  ): ExtractedDifficulty;
  extractDistractors(
    context: PatternExtractionContext,
  ): ExtractedDistractor[];
  extractMotifs(
    context: PatternExtractionContext,
  ): ExtractedMotifSignal[];
}

function getPrimaryQuestion(
  question?: ExtractorQuestion,
) {
  if (!question) {
    return undefined;
  }

  return "questionType" in question &&
    question.questionType === "di"
    ? question.questions[0]
    : question;
}

function countBy<T extends string>(
  values: T[],
) {
  return values.reduce(
    (accumulator, value) => {
      accumulator[value] =
        (accumulator[value] ?? 0) + 1;
      return accumulator;
    },
    {} as Record<string, number>,
  );
}

function buildDistractorSummary(
  context: PatternExtractionContext,
) {
  const primaryQuestion =
    getPrimaryQuestion(
      context.question,
    );
  const distractorValues = (
    primaryQuestion?.optionMetadata ?? []
  )
    .filter((option) => !option.isCorrect)
    .map(
      (option) =>
        option.distractorType ??
        option.reasoningTrap ??
        "generic-distractor",
    );
  const frequencies =
    countBy(distractorValues);

  return Object.entries(frequencies).map(
    ([label, frequency]) => ({
      type: label,
      label,
      trapType: label,
      frequency,
    }),
  );
}

function buildMotifSummary(
  context: PatternExtractionContext,
  fallbackArchetype: string,
) {
  const primaryQuestion =
    getPrimaryQuestion(
      context.question,
    );
  const selectedMotifId =
    primaryQuestion?.debugMetadata
      ?.selectedMotif;
  const matchedMotif =
    UNIVERSAL_MOTIFS.find(
      (motif) => motif.id === selectedMotifId,
    );

  if (matchedMotif) {
    return [
      {
        motifId: matchedMotif.id,
        domain: matchedMotif.domain,
        archetype: String(
          matchedMotif.archetype,
        ),
        confidence: 0.95,
        metadata: {
          generated:
            "selectedMotif",
        },
      },
    ] satisfies ExtractedMotifSignal[];
  }

  return [
    {
      motifId: `${context.scenario.domain}:${context.scenario.subtype}`,
      domain: context.scenario.domain,
      archetype: fallbackArchetype,
      confidence: 0.45,
      metadata: {
        inferred: true,
      },
    },
  ];
}

const reasoningExtractor: PatternExtractor = {
  domain: "reasoning",
  extractStructure(context) {
    const tokens = [
      `subtype:${context.scenario.subtype}`,
      `entities:${context.scenario.entities.length}`,
      `constraints:${context.scenario.constraints.length}`,
      ...context.scenario.constraints.map(
        (constraint) =>
          `constraint:${constraint.type}`,
      ),
    ];

    return {
      domain: "reasoning",
      subtype:
        context.scenario.subtype,
      entityCount:
        context.scenario.entities.length,
      constraintCount:
        context.scenario.constraints.length,
      structureTokens: tokens,
      topology:
        String(
          context.scenario.metadata
            ?.arrangementType ??
            context.scenario.subtype,
        ),
      metadata: {
        orientationType:
          context.scenario.metadata
            ?.orientationType,
      },
    };
  },
  extractDifficulty(context) {
    return {
      cognitiveLoad:
        context.scenario.difficulty
          .metrics.cognitiveLoadBase ??
        0,
      inferenceDepth:
        context.scenario.difficulty
          .inferenceDepth ?? 0,
      calculationComplexity: 0,
      distractorComplexity:
        context.scenario.difficulty
          .metrics.distractorCount ??
        0,
      ambiguityScore:
        context.scenario.difficulty
          .metrics.ambiguityScoreBase ??
        0,
      solvingTimeEstimate:
        context.scenario.difficulty
          .metrics.estimatedSolveTime ??
        0,
      difficultyBand:
        context.scenario.difficulty.label,
      metadata: {
        arrangementType:
          context.scenario.metadata
            ?.arrangementType,
      },
    };
  },
  extractDistractors(context) {
    return buildDistractorSummary(
      context,
    );
  },
  extractMotifs(context) {
    const archetype =
      context.scenario.constraints.some(
        (constraint) =>
          constraint.expression
            ?.toLowerCase()
            .includes("not "),
      )
        ? "elimination-chain"
        : "relative-placement";

    return buildMotifSummary(
      context,
      archetype,
    );
  },
};

const quantExtractor: PatternExtractor = {
  domain: "quant",
  extractStructure(context) {
    const variableNames =
      context.scenario.entities.map(
        (entity) => entity.label,
      );

    return {
      domain: "quant",
      subtype:
        context.scenario.subtype,
      entityCount:
        context.scenario.entities.length,
      constraintCount:
        context.scenario.constraints.length,
      structureTokens: [
        `variables:${variableNames.join(",")}`,
        ...context.scenario.constraints.map(
          (constraint) =>
            `constraint:${constraint.type}`,
        ),
      ],
      topology: "formula-network",
      metadata: {
        formula:
          context.scenario.constraints[0]
            ?.expression,
      },
    };
  },
  extractDifficulty(context) {
    return {
      cognitiveLoad:
        context.scenario.difficulty
          .metrics.cognitiveLoadBase ??
        0,
      inferenceDepth:
        context.scenario.difficulty
          .inferenceDepth ?? 0,
      calculationComplexity:
        context.scenario.difficulty
          .metrics.calculationComplexity ??
        0,
      distractorComplexity:
        context.scenario.difficulty
          .metrics.distractorCount ??
        0,
      ambiguityScore:
        context.scenario.difficulty
          .metrics.ambiguityScoreBase ??
        0,
      solvingTimeEstimate:
        context.scenario.difficulty
          .metrics.estimatedSolveTime ??
        0,
      difficultyBand:
        context.scenario.difficulty.label,
    };
  },
  extractDistractors(context) {
    return buildDistractorSummary(
      context,
    );
  },
  extractMotifs(context) {
    return buildMotifSummary(
      context,
      "ratio-trap",
    );
  },
};

const englishExtractor: PatternExtractor = {
  domain: "english",
  extractStructure(context) {
    return {
      domain: "english",
      subtype:
        context.scenario.subtype,
      entityCount:
        context.scenario.entities.length,
      constraintCount:
        context.scenario.constraints.length,
      structureTokens: [
        ...context.scenario.entities.map(
          (entity) =>
            `token:${entity.label.toLowerCase()}`,
        ),
        ...context.scenario.constraints.map(
          (constraint) =>
            `rule:${constraint.type}`,
        ),
      ],
      topology: "syntax-graph",
    };
  },
  extractDifficulty(context) {
    return {
      cognitiveLoad:
        context.scenario.difficulty
          .metrics.cognitiveLoadBase ??
        0,
      inferenceDepth:
        context.scenario.difficulty
          .inferenceDepth ?? 0,
      calculationComplexity: 0,
      distractorComplexity:
        context.scenario.difficulty
          .metrics.distractorCount ??
        0,
      ambiguityScore:
        context.scenario.difficulty
          .metrics.ambiguityScoreBase ??
        0,
      solvingTimeEstimate:
        context.scenario.difficulty
          .metrics.estimatedSolveTime ??
        0,
      difficultyBand:
        context.scenario.difficulty.label,
    };
  },
  extractDistractors(context) {
    return buildDistractorSummary(
      context,
    );
  },
  extractMotifs(context) {
    return buildMotifSummary(
      context,
      "grammar-ambiguity",
    );
  },
};

const diExtractor: PatternExtractor = {
  domain: "di",
  extractStructure(context) {
    const rowCount =
      context.scenario.entities.filter(
        (entity) =>
          entity.type === "di-row",
      ).length;
    const columnCount =
      context.scenario.entities.filter(
        (entity) =>
          entity.type === "di-column",
      ).length;

    return {
      domain: "di",
      subtype:
        context.scenario.subtype,
      entityCount:
        context.scenario.entities.length,
      constraintCount:
        context.scenario.constraints.length,
      structureTokens: [
        `rows:${rowCount}`,
        `columns:${columnCount}`,
        ...context.scenario.constraints.map(
          (constraint) =>
            `constraint:${constraint.type}`,
        ),
      ],
      topology: "visual-grid",
      metadata: {
        rowCount,
        columnCount,
      },
    };
  },
  extractDifficulty(context) {
    return {
      cognitiveLoad:
        context.scenario.difficulty
          .metrics.cognitiveLoadBase ??
        0,
      inferenceDepth:
        context.scenario.difficulty
          .inferenceDepth ?? 0,
      calculationComplexity:
        context.scenario.difficulty
          .metrics.calculationComplexity ??
        0,
      distractorComplexity:
        context.scenario.difficulty
          .metrics.distractorCount ??
        0,
      ambiguityScore:
        context.scenario.difficulty
          .metrics.ambiguityScoreBase ??
        0,
      solvingTimeEstimate:
        context.scenario.difficulty
          .metrics.estimatedSolveTime ??
        0,
      difficultyBand:
        context.scenario.difficulty.label,
    };
  },
  extractDistractors(context) {
    return buildDistractorSummary(
      context,
    );
  },
  extractMotifs(context) {
    return buildMotifSummary(
      context,
      "data-interpretation",
    );
  },
};

export const PATTERN_EXTRACTORS: Record<
  string,
  PatternExtractor
> = {
  reasoning: reasoningExtractor,
  "seating-arrangement":
    reasoningExtractor,
  quant: quantExtractor,
  english: englishExtractor,
  di: diExtractor,
};

export function resolvePatternExtractor(
  domain: string,
) {
  return (
    PATTERN_EXTRACTORS[domain] ??
    quantExtractor
  );
}

export function extractPatternIntelligence(
  context: PatternExtractionContext,
) : ExtractedPatternIntelligence {
  const extractor =
    resolvePatternExtractor(
      context.scenario.domain,
    );

  return {
    domain: extractor.domain,
    structure:
      extractor.extractStructure(context),
    difficulty:
      extractor.extractDifficulty(
        context,
      ),
    distractors:
      extractor.extractDistractors(
        context,
      ),
    motifs:
      extractor.extractMotifs(context),
  };
}
