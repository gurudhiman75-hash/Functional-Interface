import {
  createSeededRandom,
  factorialExact,
  productExact,
  shuffleSeeded,
} from "./math";
import type { Pnc002Parameters, Pnc002SolverResult } from "./types";

function uniquePositive(values: number[], correct: number): number[] {
  return [...new Set(values.filter((value) => Number.isInteger(value) && value > 0 && value !== correct))];
}

export function buildPnc002Options(
  parameters: Pnc002Parameters,
  solver: Pnc002SolverResult,
): { options: string[]; correctIndex: number } {
  const correct = solver.numericAnswer;
  const evidence = solver.evidence;
  let distractors: number[] = [];

  switch (parameters.solveMode) {
    case "countSingleBlockTogether": {
      const wrongUnitCount = Math.max(1, evidence.unitCount - 1);
      distractors = uniquePositive([
        factorialExact(evidence.totalObjects),
        evidence.externalArrangementCount,
        productExact([factorialExact(wrongUnitCount), evidence.internalArrangementMultiplier]),
        productExact([evidence.externalArrangementCount, Math.max(1, evidence.blockSizes[0] ?? 1)]),
      ], correct);
      break;
    }
    case "countSingleBlockNotTogether": {
      distractors = uniquePositive([
        evidence.unrestrictedCount ?? 0,
        evidence.forbiddenTogetherCount ?? 0,
        (evidence.unrestrictedCount ?? 0) - evidence.externalArrangementCount,
        evidence.externalArrangementCount,
      ], correct);
      break;
    }
    case "countMultipleBlocksTogether": {
      const firstInternalOnly = evidence.internalArrangementCounts[0] ?? 1;
      distractors = uniquePositive([
        factorialExact(evidence.totalObjects),
        evidence.externalArrangementCount,
        productExact([evidence.externalArrangementCount, firstInternalOnly]),
        evidence.externalArrangementCount + evidence.internalArrangementMultiplier,
      ], correct);
      break;
    }
    case "countBlockWithExternalPairApart": {
      const ignoringApart = productExact([
        evidence.externalArrangementCount,
        evidence.internalArrangementMultiplier,
      ]);
      const invalidOnly = productExact([
        evidence.adjacentExternalPairCount ?? 0,
        evidence.internalArrangementMultiplier,
      ]);
      distractors = uniquePositive([
        ignoringApart,
        invalidOnly,
        evidence.validUnitArrangementCount ?? 0,
        factorialExact(evidence.totalObjects),
      ], correct);
      break;
    }
    case "recoverBlockRestrictionParameter": {
      if (evidence.recoveredParameter === "n") {
        distractors = uniquePositive([5, 6, 7, 8], correct);
      } else {
        distractors = uniquePositive([1, 2, 3, 4], correct);
      }
      break;
    }
  }

  for (let offset = 1; distractors.length < 3; offset += 1) {
    for (const candidate of [correct - offset, correct + offset]) {
      if (candidate > 0 && candidate !== correct && !distractors.includes(candidate)) distractors.push(candidate);
      if (distractors.length >= 3) break;
    }
  }

  const numericOptions = shuffleSeeded(
    [correct, ...distractors.slice(0, 3)],
    createSeededRandom(`${parameters.seed}:${parameters.questionLanguageId}:options`),
  );
  return {
    options: numericOptions.map(String),
    correctIndex: numericOptions.indexOf(correct),
  };
}
