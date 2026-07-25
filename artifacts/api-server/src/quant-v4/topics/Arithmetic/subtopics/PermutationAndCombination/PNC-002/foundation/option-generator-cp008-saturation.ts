import {
  createSeededRandom,
  factorialExact,
  productExact,
  shuffleSeeded,
} from "./math";
import type { Pnc002AnyParameters, Pnc002SolverResult } from "./types";

function uniquePositive(values: number[], correct: number): number[] {
  return [...new Set(values.filter((value) => Number.isInteger(value) && value > 0 && value !== correct))];
}

export function buildPnc002Cp008SaturationOptions(
  parameters: Pnc002AnyParameters,
  solver: Pnc002SolverResult,
): { options: string[]; correctIndex: number } {
  const correct = solver.numericAnswer;
  const e = solver.evidence;
  const remainingFactorial = factorialExact(e.remainingObjects ?? Math.max(0, e.totalObjects - 2));
  let distractors: number[];

  switch (parameters.solveMode) {
    case "countObjectsAtPrescribedPositions": {
      const fixed = e.prescribedObjectCount ?? 3;
      distractors = uniquePositive([
        factorialExact(e.totalObjects),
        factorialExact(e.totalObjects - fixed + 1),
        productExact([factorialExact(fixed), factorialExact(e.totalObjects - fixed)]),
        fixed * factorialExact(e.totalObjects - fixed),
      ], correct);
      break;
    }
    case "countSpecifiedSetInPositionSet": {
      const fixed = e.prescribedObjectCount ?? 3;
      distractors = uniquePositive([
        factorialExact(e.totalObjects - fixed),
        factorialExact(e.totalObjects),
        fixed * factorialExact(e.totalObjects - fixed),
        productExact([e.totalObjects, e.totalObjects - 1, e.totalObjects - 2]),
      ], correct);
      break;
    }
    case "countAtMostGapBetweenPair": {
      const maximumGap = e.maximumGap ?? 0;
      const exactMaximum = 2 * (e.totalObjects - maximumGap - 1) * remainingFactorial;
      const atLeastMaximum = (e.totalObjects - maximumGap - 1) * (e.totalObjects - maximumGap) * remainingFactorial;
      distractors = uniquePositive([
        exactMaximum,
        atLeastMaximum,
        factorialExact(e.totalObjects),
        e.orderedPositionPairCount ?? 0,
      ], correct);
      break;
    }
    case "countDirectionalExactGapBetweenPair": {
      const gapCount = e.gapCount ?? 0;
      distractors = uniquePositive([
        2 * (e.directionalPositionPairCount ?? 0) * remainingFactorial,
        (e.totalObjects - gapCount) * remainingFactorial,
        factorialExact(e.totalObjects),
        e.directionalPositionPairCount ?? 0,
      ], correct);
      break;
    }
    case "countAtLeastSpecifiedObjectsInPositionClass": {
      const caseCounts = e.positionClassCaseCounts ?? [];
      const exactMinimumCase = caseCounts[0] ?? 0;
      const assignmentsWithoutSelection = productExact([
        Math.max(1, e.eligibleClassPositions ?? 1),
        Math.max(1, e.ineligibleClassPositions ?? 1),
        Math.max(1, e.ordinaryArrangementCount ?? 1),
      ]);
      distractors = uniquePositive([
        exactMinimumCase,
        factorialExact(e.totalObjects),
        assignmentsWithoutSelection,
        caseCounts.at(-1) ?? 0,
      ], correct);
      break;
    }
    default:
      throw new Error(`CP-008 saturation option generator received ${parameters.solveMode}`);
  }

  for (let offset = 1; distractors.length < 3; offset += 1) {
    for (const candidate of [correct - offset, correct + offset]) {
      if (candidate > 0 && candidate !== correct && !distractors.includes(candidate)) distractors.push(candidate);
      if (distractors.length >= 3) break;
    }
  }

  const numericOptions = shuffleSeeded(
    [correct, ...distractors.slice(0, 3)],
    createSeededRandom(`${parameters.seed}:${parameters.questionLanguageId}:cp008-saturation-options`),
  );
  return { options: numericOptions.map(String), correctIndex: numericOptions.indexOf(correct) };
}
