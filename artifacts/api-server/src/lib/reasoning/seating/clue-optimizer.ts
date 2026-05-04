import type {
  DifficultyLabel,
} from "../../core/generator-engine";
import type {
  SeatingArrangementType,
  SeatingClue,
  SeatingOrientationType,
} from "../seating-engine";
import type {
  CandidateClue,
} from "./clue-generator";
import {
  buildClueGraphAnalysis,
  getClueReasoningWeight,
} from "./clue-graph";
import {
  getRepeatedStructureWarnings,
  getStructuralDiversityScore,
  recordStructuralSignature,
} from "./diversity-engine";
import {
  detectRedundantClues,
} from "./redundancy-detector";
import {
  evaluateClueSet,
} from "./uniqueness-validator";

export type OptimizedClueResult = {
  clues: SeatingClue[];
  clueGraphDensity: number;
  clueInteractionRatio: number;
  redundancyScore: number;
  structuralDiversityScore: number;
  clueTypeDistribution: Record<
    string,
    number
  >;
  repeatedStructureWarnings: string[];
};

function rotateCandidates(
  candidates: CandidateClue[],
  offset: number,
) {
  if (candidates.length === 0) {
    return candidates;
  }

  const pivot =
    offset % candidates.length;
  return [
    ...candidates.slice(pivot),
    ...candidates.slice(0, pivot),
  ];
}

function clueSignature(
  clue: SeatingClue,
) {
  return JSON.stringify(clue);
}

function hasExcessiveOrderedAdjacency(
  clues: SeatingClue[],
  nextClue: SeatingClue,
) {
  if (
    nextClue.type !== "adjacent" ||
    !nextClue.ordered
  ) {
    return false;
  }

  const orderedAdjacencyCount =
    clues.filter(
      (clue) =>
        clue.type === "adjacent" &&
        clue.ordered,
    ).length;

  return orderedAdjacencyCount >= 2;
}

function scoreSubset(
  clues: SeatingClue[],
  arrangementType: SeatingArrangementType,
  orientationType: SeatingOrientationType,
  solverComplexity: number,
) {
  const graph =
    buildClueGraphAnalysis(
      clues,
      arrangementType,
      orientationType,
    );
  const reasoningWeight = clues.reduce(
    (sum, clue) =>
      sum +
      getClueReasoningWeight(clue),
    0,
  );
  const sparsityScore =
    1 - graph.density;
  const interactionBonus =
    graph.interactionRatio * 4;
  const serializationPenalty =
    graph.adjacencySerializationScore *
    5;
  const diversityScore =
    getStructuralDiversityScore(
      graph.topologySignature,
    ) * 4;

  return {
    graph,
    score:
      reasoningWeight +
      interactionBonus +
      sparsityScore * 2 +
      diversityScore -
      serializationPenalty +
      Math.min(
        solverComplexity / 12,
        2,
      ),
  };
}

export function optimizeClueSubset(
  input: {
    candidates: CandidateClue[];
    minClues: number;
    maxClues: number;
    difficulty: DifficultyLabel;
    arrangementType: SeatingArrangementType;
    orientationType: SeatingOrientationType;
    prompt: any;
    evaluate: (
      clues: SeatingClue[],
    ) => ReturnType<typeof evaluateClueSet>;
  },
) : OptimizedClueResult {
  let best:
    | {
        clues: SeatingClue[];
        subsetScore: number;
        solverComplexity: number;
      }
    | undefined;

  const attemptCount = Math.min(
    48,
    Math.max(
      12,
      input.candidates.length * 2,
    ),
  );

  for (
    let attempt = 0;
    attempt < attemptCount;
    attempt++
  ) {
    const orderedCandidates =
      rotateCandidates(
        input.candidates,
        attempt,
      );
    const selected: SeatingClue[] = [];
    const seen = new Set<string>();

    for (const candidate of orderedCandidates) {
      const signature =
        clueSignature(candidate.clue);

      if (seen.has(signature)) {
        continue;
      }

      if (
        hasExcessiveOrderedAdjacency(
          selected,
          candidate.clue,
        )
      ) {
        continue;
      }

      const trial = [
        ...selected,
        candidate.clue,
      ];
      const evaluation =
        input.evaluate(trial);
      const graph =
        buildClueGraphAnalysis(
          trial,
          input.arrangementType,
          input.orientationType,
        );

      const shouldAdd =
        selected.length < input.minClues ||
        evaluation.solutionCount === 1 ||
        graph.interactionRatio >=
          0.45 ||
        candidate.score >= 2.5;

      if (
        shouldAdd &&
        !graph.repeatedAdjacencySerialization
      ) {
        selected.push(candidate.clue);
        seen.add(signature);
      }

      if (
        selected.length >=
        input.maxClues
      ) {
        break;
      }
    }

    const evaluation =
      input.evaluate(selected);

    if (
      selected.length <
        input.minClues ||
      !evaluation.uniquelySolvable
    ) {
      continue;
    }

    const reduced =
      detectRedundantClues(
        selected,
        (candidate) =>
          input.evaluate(candidate)
            .uniquelySolvable,
      );
    const minimized =
      reduced.minimizedClues;
    const minimizedEvaluation =
      input.evaluate(minimized);

    if (
      !minimizedEvaluation.uniquelySolvable
    ) {
      continue;
    }

    const scored = scoreSubset(
      minimized,
      input.arrangementType,
      input.orientationType,
      minimizedEvaluation.solverComplexity,
    );

    if (
      scored.graph.repeatedAdjacencySerialization
    ) {
      continue;
    }

    if (
      !best ||
      scored.score > best.subsetScore
    ) {
      best = {
        clues: minimized,
        subsetScore: scored.score,
        solverComplexity:
          minimizedEvaluation.solverComplexity,
      };
    }
  }

  const fallbackClues = best?.clues ??
    input.candidates
      .slice(0, input.minClues)
      .map((candidate) => candidate.clue);
  const redundancy =
    detectRedundantClues(
      fallbackClues,
      (candidate) =>
        input.evaluate(candidate)
          .uniquelySolvable,
    );
  const finalClues =
    redundancy.minimizedClues;
  const finalScore = scoreSubset(
    finalClues,
    input.arrangementType,
    input.orientationType,
    best?.solverComplexity ?? 0,
  );
  const structuralDiversityScore =
    getStructuralDiversityScore(
      finalScore.graph.topologySignature,
    );
  const repeatedStructureWarnings =
    getRepeatedStructureWarnings(
      finalScore.graph.topologySignature,
      finalScore.graph.repeatedAdjacencySerialization,
    );

  recordStructuralSignature(
    finalScore.graph.topologySignature,
  );

  return {
    clues: finalClues,
    clueGraphDensity:
      finalScore.graph.density,
    clueInteractionRatio:
      finalScore.graph.interactionRatio,
    redundancyScore:
      redundancy.redundancyScore,
    structuralDiversityScore,
    clueTypeDistribution:
      finalScore.graph
        .clueTypeDistribution,
    repeatedStructureWarnings,
  };
}
