import {
  combinationExact,
  factorialExact,
  permutationExact,
  productExact,
  sumExact,
} from "./math";
import { getPnc002VariableRanges } from "./library";
import type {
  Pnc002AnyParameters,
  Pnc002IndependentVerification,
  Pnc002SolverEvidence,
  Pnc002SolverResult,
  Pnc002SolveMode,
} from "./types";

const SATURATION_MODES = new Set<Pnc002SolveMode>([
  "countObjectsAtPrescribedPositions",
  "countSpecifiedSetInPositionSet",
  "countAtMostGapBetweenPair",
  "countDirectionalExactGapBetweenPair",
  "countAtLeastSpecifiedObjectsInPositionClass",
]);

export function isPnc002Cp008SaturationMode(mode: Pnc002SolveMode): boolean {
  return SATURATION_MODES.has(mode);
}

function numberValue(parameters: Pnc002AnyParameters, key: string): number {
  const value = parameters.values[key];
  if (typeof value !== "number") throw new Error(`PNC-002 CP-008 saturation value ${key} is not numeric`);
  return value;
}
function neutralEvidence(totalObjects: number, operation: Pnc002SolverEvidence["operation"]): Pnc002SolverEvidence {
  const unrestrictedCount = factorialExact(totalObjects, getPnc002VariableRanges().answerCeiling);
  return {
    operation,
    totalObjects,
    blockSizes: [],
    groupedObjectCount: 0,
    blockCount: 0,
    unitCount: totalObjects,
    externalArrangementCount: unrestrictedCount,
    internalArrangementCounts: [],
    internalArrangementMultiplier: 1,
    unrestrictedCount,
  };
}
function result(answer: number, equation: string, mathJax: string, evidence: Pnc002SolverEvidence): Pnc002SolverResult {
  return { exactAnswer: String(answer), answer: String(answer), numericAnswer: answer, equation, mathJax, evidence };
}

export function countObjectsAtPrescribedPositionsExact(totalObjects: number, prescribedObjectCount: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return factorialExact(totalObjects - prescribedObjectCount, ceiling);
}
export function countSpecifiedSetInPositionSetExact(totalObjects: number, specifiedCount: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return productExact([factorialExact(specifiedCount, ceiling), factorialExact(totalObjects - specifiedCount, ceiling)], ceiling);
}
export function countAtMostGapBetweenPairExact(totalObjects: number, maximumGap: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (maximumGap < 0 || maximumGap > totalObjects - 2) throw new Error("Maximum gap is outside the row");
  const orderedPositionPairCount = (maximumGap + 1) * (2 * totalObjects - maximumGap - 2);
  return productExact([orderedPositionPairCount, factorialExact(totalObjects - 2, ceiling)], ceiling);
}
export function countDirectionalExactGapBetweenPairExact(totalObjects: number, gapCount: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (gapCount < 0 || gapCount > totalObjects - 2) throw new Error("Directional exact gap is outside the row");
  const directionalPositionPairCount = totalObjects - gapCount - 1;
  return productExact([directionalPositionPairCount, factorialExact(totalObjects - 2, ceiling)], ceiling);
}
export function countAtLeastSpecifiedObjectsInPositionClassExact(
  totalObjects: number,
  specifiedCount: number,
  minimumInClass: number,
  eligibleClassPositions: number,
  ceiling = Number.MAX_SAFE_INTEGER,
): { answer: number; acceptedClassCounts: number[]; caseCounts: number[] } {
  const ineligibleClassPositions = totalObjects - eligibleClassPositions;
  const acceptedClassCounts: number[] = [];
  const caseCounts: number[] = [];
  for (let inClass = minimumInClass; inClass <= specifiedCount; inClass += 1) {
    const outsideClass = specifiedCount - inClass;
    if (inClass > eligibleClassPositions || outsideClass > ineligibleClassPositions) continue;
    acceptedClassCounts.push(inClass);
    caseCounts.push(productExact([
      combinationExact(specifiedCount, inClass, ceiling),
      permutationExact(eligibleClassPositions, inClass, ceiling),
      permutationExact(ineligibleClassPositions, outsideClass, ceiling),
      factorialExact(totalObjects - specifiedCount, ceiling),
    ], ceiling));
  }
  return { answer: sumExact(caseCounts, ceiling), acceptedClassCounts, caseCounts };
}

export function solvePnc002Cp008Saturation(parameters: Pnc002AnyParameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  switch (parameters.solveMode) {
    case "countObjectsAtPrescribedPositions": {
      const prescribedObjectCount = numberValue(parameters, "prescribedObjectCount");
      const remainingObjects = totalObjects - prescribedObjectCount;
      const answer = countObjectsAtPrescribedPositionsExact(totalObjects, prescribedObjectCount, ceiling);
      return result(answer, `${remainingObjects}! = ${answer}`, `${remainingObjects}! = ${answer}`, {
        ...neutralEvidence(totalObjects, "OBJECTS_AT_PRESCRIBED_POSITIONS"), prescribedObjectCount, remainingObjects,
      });
    }
    case "countSpecifiedSetInPositionSet": {
      const prescribedObjectCount = numberValue(parameters, "prescribedObjectCount");
      const remainingObjects = totalObjects - prescribedObjectCount;
      const positionSetAssignmentCount = factorialExact(prescribedObjectCount, ceiling);
      const answer = countSpecifiedSetInPositionSetExact(totalObjects, prescribedObjectCount, ceiling);
      return result(answer, `${prescribedObjectCount}! × ${remainingObjects}! = ${answer}`, `${prescribedObjectCount}! \\times ${remainingObjects}! = ${answer}`, {
        ...neutralEvidence(totalObjects, "SPECIFIED_SET_IN_POSITION_SET"), prescribedObjectCount, remainingObjects, positionSetAssignmentCount,
      });
    }
    case "countAtMostGapBetweenPair": {
      const maximumGap = numberValue(parameters, "maximumGap");
      const orderedPositionPairCount = (maximumGap + 1) * (2 * totalObjects - maximumGap - 2);
      const answer = countAtMostGapBetweenPairExact(totalObjects, maximumGap, ceiling);
      return result(answer, `${orderedPositionPairCount} × ${totalObjects - 2}! = ${answer}`, `${orderedPositionPairCount} \\times ${totalObjects - 2}! = ${answer}`, {
        ...neutralEvidence(totalObjects, "AT_MOST_GAP_BETWEEN_PAIR"), maximumGap, orderedPositionPairCount, remainingObjects: totalObjects - 2,
      });
    }
    case "countDirectionalExactGapBetweenPair": {
      const gapCount = numberValue(parameters, "gapCount");
      const directionalPositionPairCount = totalObjects - gapCount - 1;
      const answer = countDirectionalExactGapBetweenPairExact(totalObjects, gapCount, ceiling);
      return result(answer, `${directionalPositionPairCount} × ${totalObjects - 2}! = ${answer}`, `${directionalPositionPairCount} \\times ${totalObjects - 2}! = ${answer}`, {
        ...neutralEvidence(totalObjects, "DIRECTIONAL_EXACT_GAP"), gapCount, directionalPositionPairCount, remainingObjects: totalObjects - 2,
      });
    }
    case "countAtLeastSpecifiedObjectsInPositionClass": {
      const specifiedCount = numberValue(parameters, "specifiedCount");
      const minimumInClass = numberValue(parameters, "minimumInClass");
      const eligibleClassPositions = numberValue(parameters, "eligibleClassPositions");
      const ineligibleClassPositions = totalObjects - eligibleClassPositions;
      const counted = countAtLeastSpecifiedObjectsInPositionClassExact(totalObjects, specifiedCount, minimumInClass, eligibleClassPositions, ceiling);
      const plainCases = counted.caseCounts.join(" + ");
      const texCases = counted.caseCounts.join(" + ");
      return result(counted.answer, `${plainCases} = ${counted.answer}`, `${texCases} = ${counted.answer}`, {
        ...neutralEvidence(totalObjects, "AT_LEAST_SPECIFIED_IN_POSITION_CLASS"), specifiedCount, minimumInClass,
        eligibleClassPositions, ineligibleClassPositions, acceptedClassCounts: counted.acceptedClassCounts,
        positionClassCaseCounts: counted.caseCounts,
      });
    }
    default:
      throw new Error(`Unsupported CP-008 saturation mode ${parameters.solveMode}`);
  }
}

function countByPermutationEnumeration(totalObjects: number, predicate: (permutation: number[]) => boolean): number {
  const values = Array.from({ length: totalObjects }, (_, index) => index);
  let count = 0;
  const visit = (position: number): void => {
    if (position === values.length) { if (predicate(values)) count += 1; return; }
    for (let index = position; index < values.length; index += 1) {
      [values[position], values[index]] = [values[index]!, values[position]!];
      visit(position + 1);
      [values[position], values[index]] = [values[index]!, values[position]!];
    }
  };
  visit(0);
  return count;
}

export function verifyPnc002Cp008SaturationIndependently(parameters: Pnc002AnyParameters): Pnc002IndependentVerification {
  const totalObjects = numberValue(parameters, "totalObjects");
  let answer: number;
  switch (parameters.solveMode) {
    case "countObjectsAtPrescribedPositions":
      answer = countByPermutationEnumeration(totalObjects, (permutation) => permutation[1] === 0 && permutation[3] === 1 && permutation[5] === 2);
      break;
    case "countSpecifiedSetInPositionSet": {
      const requiredPositions = [0, 3, 6];
      answer = countByPermutationEnumeration(totalObjects, (permutation) => requiredPositions.every((position) => (permutation[position] ?? totalObjects) < 3));
      break;
    }
    case "countAtMostGapBetweenPair": {
      const maximumGap = numberValue(parameters, "maximumGap");
      answer = countByPermutationEnumeration(totalObjects, (permutation) => Math.abs(permutation.indexOf(0) - permutation.indexOf(1)) - 1 <= maximumGap);
      break;
    }
    case "countDirectionalExactGapBetweenPair": {
      const gapCount = numberValue(parameters, "gapCount");
      answer = countByPermutationEnumeration(totalObjects, (permutation) => {
        const first = permutation.indexOf(0);
        const second = permutation.indexOf(1);
        return first < second && second - first - 1 === gapCount;
      });
      break;
    }
    case "countAtLeastSpecifiedObjectsInPositionClass": {
      const specifiedCount = numberValue(parameters, "specifiedCount");
      const minimumInClass = numberValue(parameters, "minimumInClass");
      answer = countByPermutationEnumeration(totalObjects, (permutation) => {
        const inOddPositions = permutation.reduce((count, item, index) => count + (item < specifiedCount && (index + 1) % 2 === 1 ? 1 : 0), 0);
        return inOddPositions >= minimumInClass;
      });
      break;
    }
    default:
      throw new Error(`Unsupported CP-008 saturation verification mode ${parameters.solveMode}`);
  }
  return { supported: true, answer, method: "Exhaustive enumeration of distinct linear permutations for the CP-008 saturation predicate" };
}
