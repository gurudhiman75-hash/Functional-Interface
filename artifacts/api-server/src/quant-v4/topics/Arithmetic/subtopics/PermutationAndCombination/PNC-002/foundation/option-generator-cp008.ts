import {
  combinationExact,
  createSeededRandom,
  factorialExact,
  productExact,
  shuffleSeeded,
} from "./math";
import type { Pnc002Parameters, Pnc002SolverResult } from "./types";

function uniquePositive(values: number[], correct: number): number[] {
  return [...new Set(values.filter((value) => Number.isInteger(value) && value > 0 && value !== correct))];
}

export function buildPnc002Cp008Options(
  parameters: Pnc002Parameters,
  solver: Pnc002SolverResult,
): { options: string[]; correctIndex: number } {
  const correct = solver.numericAnswer;
  const e = solver.evidence;
  let distractors: number[] = [];

  switch (parameters.solveMode) {
    case "countObjectAtExactPosition":
      distractors = uniquePositive([factorialExact(e.totalObjects), factorialExact(e.totalObjects - 2), e.totalObjects * factorialExact(e.totalObjects - 1)], correct);
      break;
    case "countObjectAtEitherEnd":
      distractors = uniquePositive([factorialExact(e.totalObjects - 1), factorialExact(e.totalObjects), 2 * factorialExact(e.totalObjects - 2)], correct);
      break;
    case "countSpecifiedObjectsAtBothEnds":
      distractors = uniquePositive([factorialExact(e.totalObjects - 2), 2 * factorialExact(e.totalObjects - 1), factorialExact(e.totalObjects)], correct);
      break;
    case "countObjectExcludedFromEnds":
      distractors = uniquePositive([factorialExact(e.totalObjects), 2 * factorialExact(e.totalObjects - 1), factorialExact(e.totalObjects - 1)], correct);
      break;
    case "countPrescribedRelativeOrder": {
      const chainLength = e.chainLengths?.[0] ?? 2;
      distractors = uniquePositive([
        factorialExact(e.totalObjects),
        Math.floor(factorialExact(e.totalObjects) / chainLength),
        Math.floor(factorialExact(e.totalObjects) / factorialExact(Math.max(1, chainLength - 1))),
      ], correct);
      break;
    }
    case "countIndependentRelativeOrderChains":
      distractors = uniquePositive([factorialExact(e.totalObjects), Math.floor(factorialExact(e.totalObjects) / 2), Math.floor(factorialExact(e.totalObjects) / 24)], correct);
      break;
    case "countStrictAlternation": {
      const base = productExact([factorialExact(e.largeCount ?? 0), factorialExact(e.smallCount ?? 0)]);
      distractors = uniquePositive([base, 2 * base, factorialExact(e.totalObjects), (e.largeCount ?? 0) * (e.smallCount ?? 0) * base], correct);
      break;
    }
    case "countNoTwoCategoryMembersAdjacent": {
      const large = e.largeCount ?? 0;
      const small = e.smallCount ?? 0;
      const gaps = e.gapSlotCount ?? large + 1;
      distractors = uniquePositive([
        factorialExact(e.totalObjects),
        productExact([factorialExact(large), combinationExact(gaps, small)]),
        productExact([factorialExact(large), factorialExact(small)]),
        productExact([combinationExact(gaps, small), factorialExact(small)]),
      ], correct);
      break;
    }
    case "countExactGapBetweenPair": {
      const remaining = factorialExact(e.totalObjects - 2);
      const gap = e.gapCount ?? 0;
      distractors = uniquePositive([
        (e.totalObjects - gap - 1) * remaining,
        2 * (e.totalObjects - gap) * remaining,
        factorialExact(e.totalObjects),
        e.orderedPositionPairCount ?? 0,
      ], correct);
      break;
    }
    case "countAtLeastGapBetweenPair": {
      const remaining = factorialExact(e.totalObjects - 2);
      const minimum = e.minimumGap ?? 0;
      const exactMinimum = 2 * (e.totalObjects - minimum - 1) * remaining;
      distractors = uniquePositive([exactMinimum, factorialExact(e.totalObjects), e.orderedPositionPairCount ?? 0, (e.totalObjects - minimum - 1) * remaining], correct);
      break;
    }
    case "countSpecifiedObjectsInPositionClass": {
      const selected = e.selectedSpecifiedCount ?? 1;
      const eligible = e.eligibleAssignmentCount ?? 1;
      const ineligible = e.ineligibleAssignmentCount ?? 1;
      const ordinary = e.ordinaryArrangementCount ?? 1;
      distractors = uniquePositive([
        factorialExact(e.totalObjects),
        productExact([eligible, ineligible, ordinary]),
        productExact([selected, ordinary]),
        productExact([selected, eligible, ordinary]),
      ], correct);
      break;
    }
    case "recoverPositionGapParameter":
      distractors = uniquePositive([1, 2, 3, 4], correct);
      break;
    default:
      throw new Error(`CP-008 option generator received ${parameters.solveMode}`);
  }

  for (let offset = 1; distractors.length < 3; offset += 1) {
    for (const candidate of [correct - offset, correct + offset]) {
      if (candidate > 0 && candidate !== correct && !distractors.includes(candidate)) distractors.push(candidate);
      if (distractors.length >= 3) break;
    }
  }
  const numericOptions = shuffleSeeded([correct, ...distractors.slice(0, 3)], createSeededRandom(`${parameters.seed}:${parameters.questionLanguageId}:cp008-options`));
  return { options: numericOptions.map(String), correctIndex: numericOptions.indexOf(correct) };
}
