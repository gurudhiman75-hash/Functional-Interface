import type {
  DifficultyMetrics,
  Scenario,
  ValidationReport,
} from "./domain-adapters";
import type {
  ExtractedPatternIntelligence,
} from "./pattern-extractors";
import type {
  StructuralSignature,
} from "./structural-signatures";

export type QualityThresholds = {
  requireValidationPass: boolean;
  minRealismScore: number;
  minDifficultyConfidence: number;
  maxDirectClueRatio: number;
  minStructuralDiversityScore: number;
  maxRepeatedStructureWarnings: number;
  minDistractorComplexity: number;
  minDistractorTypeCount: number;
  maxGenericDistractorRatio: number;
};

export type QualityAssessment = {
  approved: boolean;
  rejectionReasons: string[];
  qualityMetrics: Record<string, number>;
};

export type QualityAssessmentInput = {
  validationReport?: ValidationReport;
  realismScore?: number;
  structuralDiversityScore?: number;
  repeatedStructureWarnings?: string[];
  directClueRatio?: number;
  difficultyAssessment?: DifficultyMetrics;
  extractedPatternIntelligence?: ExtractedPatternIntelligence;
  proceduralScenario?: Scenario;
  structuralSignature?: StructuralSignature;
};

export const DEFAULT_QUALITY_THRESHOLDS: QualityThresholds =
  {
    requireValidationPass: true,
    minRealismScore: 5.5,
    minDifficultyConfidence: 5.5,
    maxDirectClueRatio: 0.44,
    minStructuralDiversityScore: 0.32,
    maxRepeatedStructureWarnings: 0,
    minDistractorComplexity: 1.5,
    minDistractorTypeCount: 2,
    maxGenericDistractorRatio: 0.7,
  };

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    max,
    Math.max(min, value),
  );
}

function round(
  value: number,
  digits = 2,
) {
  return Number(value.toFixed(digits));
}

function getDifficultyConfidence(
  difficultyAssessment?: DifficultyMetrics,
  proceduralScenario?: Scenario,
) {
  if (!difficultyAssessment) {
    return 0;
  }

  let score = 0;

  if (
    typeof difficultyAssessment
      .difficultyScore === "number"
  ) {
    score += 2;
  }

  if (difficultyAssessment.difficultyLabel) {
    score += 1;
  }

  if (
    typeof difficultyAssessment
      .inferenceDepth === "number" &&
    difficultyAssessment.inferenceDepth > 0
  ) {
    score += 1.5;
  }

  if (
    typeof difficultyAssessment
      .solvingTimeEstimate ===
      "number" &&
    difficultyAssessment.solvingTimeEstimate >
      0
  ) {
    score += 1.5;
  }

  if (
    Object.keys(
      difficultyAssessment.metrics ?? {},
    ).length >= 3
  ) {
    score += 2;
  }

  if (
    proceduralScenario?.difficulty?.metrics &&
    Object.keys(
      proceduralScenario.difficulty.metrics,
    ).length >= 3
  ) {
    score += 1;
  }

  if (
    typeof proceduralScenario?.difficulty
      ?.score === "number" &&
    typeof difficultyAssessment
      .difficultyScore === "number"
  ) {
    const difference = Math.abs(
      proceduralScenario.difficulty.score -
        difficultyAssessment.difficultyScore,
    );
    score += Math.max(
      0,
      2 - difference / 2,
    );
  }

  return round(clamp(score, 0, 10));
}

function getDistractorMetrics(
  extractedPatternIntelligence?: ExtractedPatternIntelligence,
  difficultyAssessment?: DifficultyMetrics,
) {
  const distractors =
    extractedPatternIntelligence?.distractors ??
    [];
  const totalDistractors =
    distractors.reduce(
      (sum, distractor) =>
        sum + distractor.frequency,
      0,
    );
  const genericDistractors =
    distractors.reduce(
      (sum, distractor) =>
        sum +
        (distractor.type ===
          "generic-distractor"
          ? distractor.frequency
          : 0),
      0,
    );
  const genericDistractorRatio =
    totalDistractors > 0
      ? genericDistractors /
        totalDistractors
      : 1;
  const distractorTypeCount =
    distractors.length;
  const distractorComplexity =
    extractedPatternIntelligence
      ?.difficulty
      .distractorComplexity ??
    difficultyAssessment
      ?.distractorComplexity ??
    0;

  return {
    distractorComplexity: round(
      distractorComplexity,
    ),
    distractorTypeCount,
    genericDistractorRatio: round(
      genericDistractorRatio,
    ),
  };
}

export function assessProceduralQuality(
  input: QualityAssessmentInput,
  overrides?: Partial<QualityThresholds>,
): QualityAssessment {
  const thresholds = {
    ...DEFAULT_QUALITY_THRESHOLDS,
    ...overrides,
  };
  const rejectionReasons: string[] = [];
  const realismScore =
    input.realismScore ?? 0;
  const structuralDiversityScore =
    input.structuralDiversityScore ??
    1;
  const repeatedStructureWarnings =
    input.repeatedStructureWarnings ??
    [];
  const directClueRatio =
    input.directClueRatio ?? 0;
  const difficultyConfidence =
    getDifficultyConfidence(
      input.difficultyAssessment,
      input.proceduralScenario,
    );
  const {
    distractorComplexity,
    distractorTypeCount,
    genericDistractorRatio,
  } = getDistractorMetrics(
    input.extractedPatternIntelligence,
    input.difficultyAssessment,
  );

  if (
    thresholds.requireValidationPass &&
    input.validationReport &&
    !input.validationReport.passed
  ) {
    rejectionReasons.push(
      "failed-validation",
    );
  }

  if (
    realismScore <
    thresholds.minRealismScore
  ) {
    rejectionReasons.push(
      "low-realism-score",
    );
  }

  if (
    structuralDiversityScore <
      thresholds.minStructuralDiversityScore ||
    repeatedStructureWarnings.length >
      thresholds.maxRepeatedStructureWarnings
  ) {
    rejectionReasons.push(
      "repetitive-structure",
    );
  }

  if (
    difficultyConfidence <
    thresholds.minDifficultyConfidence
  ) {
    rejectionReasons.push(
      "low-difficulty-confidence",
    );
  }

  if (
    directClueRatio >
    thresholds.maxDirectClueRatio
  ) {
    rejectionReasons.push(
      "excessive-direct-clues",
    );
  }

  if (
    distractorComplexity <
      thresholds.minDistractorComplexity ||
    distractorTypeCount <
      thresholds.minDistractorTypeCount ||
    genericDistractorRatio >
      thresholds.maxGenericDistractorRatio
  ) {
    rejectionReasons.push(
      "weak-distractors",
    );
  }

  return {
    approved:
      rejectionReasons.length === 0,
    rejectionReasons,
    qualityMetrics: {
      realismScore: round(realismScore),
      validationPassed:
        input.validationReport?.passed ===
        false
          ? 0
          : 1,
      structuralDiversityScore: round(
        structuralDiversityScore,
      ),
      repeatedStructureWarnings:
        repeatedStructureWarnings.length,
      directClueRatio: round(
        directClueRatio,
      ),
      difficultyConfidence,
      distractorComplexity,
      distractorTypeCount,
      genericDistractorRatio,
      hasStructuralSignature:
        input.structuralSignature ? 1 : 0,
    },
  };
}
