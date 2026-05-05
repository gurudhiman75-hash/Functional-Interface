import type {
  DifficultyMetrics,
} from "./domain-adapters";
import type {
  GeneratedQuestion,
} from "./generator-engine";

export type DifficultyConfidence = {
  predictedDifficulty:
    | "Easy"
    | "Medium"
    | "Hard";
  confidence: number;
  explanation: string;
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

function classifyDifficulty(
  score: number,
): DifficultyConfidence["predictedDifficulty"] {
  if (score <= 2.5) {
    return "Easy";
  }

  if (score <= 5.5) {
    return "Medium";
  }

  return "Hard";
}

function getPrimaryQuestion(
  question: GeneratedQuestion,
) {
  return "questionType" in question &&
    question.questionType === "di"
    ? question.questions[0]
    : question;
}

export function buildDifficultyConfidence(
  question: GeneratedQuestion,
  difficultyMetrics: DifficultyMetrics,
): DifficultyConfidence {
  const primaryQuestion =
    getPrimaryQuestion(question);
  const intendedScore =
    difficultyMetrics.difficultyScore ??
    primaryQuestion?.difficultyScore ??
    0;
  const intendedDifficulty =
    difficultyMetrics.difficultyLabel ??
    primaryQuestion?.difficultyLabel ??
    classifyDifficulty(intendedScore);
  const domainContributions =
    difficultyMetrics.domainContributions ??
    {};
  const solvingComplexity =
    difficultyMetrics.cognitiveLoad;
  const eliminationDepth =
    domainContributions[
      "eliminationDepth"
    ] ?? 0;
  const branchingComplexity =
    domainContributions[
      "branchingComplexity"
    ] ?? 0;
  const branchingFactor =
    primaryQuestion?.debugMetadata
      ?.branchingFactor ?? 0;
  const distractorQuality =
    difficultyMetrics
      .distractorComplexity;
  const solverTraceLength =
    primaryQuestion?.debugMetadata
      ?.solverTraceExport?.text
      ?.length ??
    primaryQuestion?.debugMetadata
      ?.solverTrace?.length ??
    0;
  const humanSolverSimulation =
    difficultyMetrics.inferenceDepth *
      0.42 +
    eliminationDepth * 0.28 +
    branchingComplexity * 2.1 +
    branchingFactor * 3.2 +
    distractorQuality * 0.38 +
    solverTraceLength * 0.12 +
    difficultyMetrics
      .calculationComplexity *
      0.3 +
    difficultyMetrics.ambiguityScore *
      0.18;
  const predictedScore = round(
    clamp(
      humanSolverSimulation,
      0,
      10,
    ),
  );
  const predictedDifficulty =
    classifyDifficulty(predictedScore);
  const scoreGap = Math.abs(
    predictedScore - intendedScore,
  );
  const labelMatch =
    predictedDifficulty ===
    intendedDifficulty
      ? 1
      : 0;
  const traceSupport = clamp(
    solverTraceLength / 10,
    0,
    1,
  );
  const signalCoverage =
    [
      solvingComplexity > 0,
      difficultyMetrics.inferenceDepth > 0,
      distractorQuality > 0,
      eliminationDepth > 0,
      branchingComplexity > 0,
      solverTraceLength > 0,
    ].filter(Boolean).length / 6;
  const confidence = round(
    clamp(
      9 -
        scoreGap * 1.45 +
        labelMatch * 1.1 +
        traceSupport * 0.9 +
        signalCoverage * 1.2,
      0,
      10,
    ),
  );

  return {
    predictedDifficulty,
    confidence,
    explanation: [
      `Intended difficulty ${intendedDifficulty} (${round(intendedScore, 1)}), predicted ${predictedDifficulty} (${round(predictedScore, 1)}).`,
      `Signals used: solving complexity ${round(solvingComplexity, 1)}, elimination depth ${round(eliminationDepth, 1)}, branching ${round(branchingComplexity, 2)}, distractor quality ${round(distractorQuality, 1)}.`,
      `Human-solver simulation combined inference depth ${round(difficultyMetrics.inferenceDepth, 1)} with solver trace support ${solverTraceLength} and branching factor ${round(branchingFactor, 2)}.`,
    ].join(" "),
  };
}
