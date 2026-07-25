import {
  combinationExact,
  divideExact,
  factorialExact,
  permutationExact,
  productExact,
  subtractExact,
} from "./math";
import { getPnc002VariableRanges } from "./library";
import type {
  Pnc002IndependentVerification,
  Pnc002Parameters,
  Pnc002SolverEvidence,
  Pnc002SolverResult,
} from "./types";

function numberValue(parameters: Pnc002Parameters, key: string): number {
  const value = parameters.values[key];
  if (typeof value !== "number") throw new Error(`PNC-002 CP-008 value ${key} is not numeric`);
  return value;
}
function numberArrayValue(parameters: Pnc002Parameters, key: string): number[] {
  const value = parameters.values[key];
  if (!Array.isArray(value) || !value.every(Number.isInteger)) throw new Error(`PNC-002 CP-008 value ${key} is not an integer array`);
  return [...value];
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

export function countObjectAtExactPositionExact(totalObjects: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return factorialExact(totalObjects - 1, ceiling);
}
export function countObjectAtEitherEndExact(totalObjects: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return productExact([2, factorialExact(totalObjects - 1, ceiling)], ceiling);
}
export function countSpecifiedObjectsAtBothEndsExact(totalObjects: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return productExact([2, factorialExact(totalObjects - 2, ceiling)], ceiling);
}
export function countObjectExcludedFromEndsExact(totalObjects: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return productExact([totalObjects - 2, factorialExact(totalObjects - 1, ceiling)], ceiling);
}
export function countPrescribedRelativeOrderExact(totalObjects: number, chainLength: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return divideExact(factorialExact(totalObjects, ceiling), factorialExact(chainLength, ceiling));
}
export function countIndependentRelativeOrderChainsExact(totalObjects: number, chainLengths: number[], ceiling = Number.MAX_SAFE_INTEGER): number {
  const divisor = productExact(chainLengths.map((length) => factorialExact(length, ceiling)), ceiling);
  return divideExact(factorialExact(totalObjects, ceiling), divisor);
}
export function countStrictAlternationExact(largeCount: number, smallCount: number, orientationCount: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (Math.abs(largeCount - smallCount) > 1) throw new Error("Strict alternation requires category counts differing by at most one");
  return productExact([orientationCount, factorialExact(largeCount, ceiling), factorialExact(smallCount, ceiling)], ceiling);
}
export function countNoTwoCategoryMembersAdjacentExact(largeCount: number, smallCount: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (smallCount > largeCount + 1) throw new Error("Too many separated objects for the available gaps");
  return productExact([
    factorialExact(largeCount, ceiling),
    combinationExact(largeCount + 1, smallCount, ceiling),
    factorialExact(smallCount, ceiling),
  ], ceiling);
}
export function countExactGapBetweenPairExact(totalObjects: number, gapCount: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (gapCount < 0 || gapCount > totalObjects - 2) throw new Error("Exact gap is outside the linear position domain");
  const orderedPositionPairCount = 2 * (totalObjects - gapCount - 1);
  return productExact([orderedPositionPairCount, factorialExact(totalObjects - 2, ceiling)], ceiling);
}
export function countAtLeastGapBetweenPairExact(totalObjects: number, minimumGap: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (minimumGap < 0 || minimumGap > totalObjects - 2) throw new Error("Minimum gap is outside the linear position domain");
  const orderedPositionPairCount = (totalObjects - minimumGap - 1) * (totalObjects - minimumGap);
  return productExact([orderedPositionPairCount, factorialExact(totalObjects - 2, ceiling)], ceiling);
}
export function countSpecifiedObjectsInPositionClassExact(
  totalObjects: number,
  specifiedCount: number,
  requiredInClass: number,
  eligibleClassPositions: number,
  ceiling = Number.MAX_SAFE_INTEGER,
): number {
  const ineligibleClassPositions = totalObjects - eligibleClassPositions;
  const requiredOutside = specifiedCount - requiredInClass;
  if (requiredInClass > eligibleClassPositions || requiredOutside > ineligibleClassPositions) throw new Error("Position-class requirement exceeds available positions");
  return productExact([
    combinationExact(specifiedCount, requiredInClass, ceiling),
    permutationExact(eligibleClassPositions, requiredInClass, ceiling),
    permutationExact(ineligibleClassPositions, requiredOutside, ceiling),
    factorialExact(totalObjects - specifiedCount, ceiling),
  ], ceiling);
}

function solveExactPosition(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const fixedPosition = numberValue(parameters, "fixedPosition");
  const answer = countObjectAtExactPositionExact(totalObjects, ceiling);
  return result(answer, `${totalObjects - 1}! = ${answer}`, `${totalObjects - 1}! = ${answer}`, {
    ...neutralEvidence(totalObjects, "OBJECT_AT_EXACT_POSITION"), fixedPosition, remainingObjects: totalObjects - 1,
  });
}
function solveEitherEnd(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const answer = countObjectAtEitherEndExact(totalObjects, ceiling);
  return result(answer, `2 × ${totalObjects - 1}! = ${answer}`, `2 \\times ${totalObjects - 1}! = ${answer}`, {
    ...neutralEvidence(totalObjects, "OBJECT_AT_EITHER_END"), allowedPositionCount: 2, remainingObjects: totalObjects - 1, endAssignmentCount: 2,
  });
}
function solveBothEnds(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const answer = countSpecifiedObjectsAtBothEndsExact(totalObjects, ceiling);
  return result(answer, `2! × ${totalObjects - 2}! = ${answer}`, `2! \\times ${totalObjects - 2}! = ${answer}`, {
    ...neutralEvidence(totalObjects, "SPECIFIED_OBJECTS_AT_BOTH_ENDS"), remainingObjects: totalObjects - 2, endAssignmentCount: 2,
  });
}
function solveExcludedEnds(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const answer = countObjectExcludedFromEndsExact(totalObjects, ceiling);
  return result(answer, `(${totalObjects} - 2) × ${totalObjects - 1}! = ${answer}`, `\\left(${totalObjects} - 2\\right) \\times ${totalObjects - 1}! = ${answer}`, {
    ...neutralEvidence(totalObjects, "OBJECT_EXCLUDED_FROM_ENDS"), allowedPositionCount: totalObjects - 2, remainingObjects: totalObjects - 1,
  });
}
function solveRelativeOrder(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const chainLength = numberValue(parameters, "chainLength");
  const relativeOrderDivisor = factorialExact(chainLength, ceiling);
  const answer = countPrescribedRelativeOrderExact(totalObjects, chainLength, ceiling);
  return result(answer, `${totalObjects}! ÷ ${chainLength}! = ${answer}`, `\\frac{${totalObjects}!}{${chainLength}!} = ${answer}`, {
    ...neutralEvidence(totalObjects, "PRESCRIBED_RELATIVE_ORDER"), chainLengths: [chainLength], relativeOrderDivisor,
  });
}
function solveIndependentChains(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const chainLengths = numberArrayValue(parameters, "chainLengths");
  const relativeOrderDivisor = productExact(chainLengths.map((length) => factorialExact(length, ceiling)), ceiling);
  const answer = countIndependentRelativeOrderChainsExact(totalObjects, chainLengths, ceiling);
  const plain = chainLengths.map((length) => `${length}!`).join(" × ");
  const tex = chainLengths.map((length) => `${length}!`).join(" \\times ");
  return result(answer, `${totalObjects}! ÷ (${plain}) = ${answer}`, `\\frac{${totalObjects}!}{${tex}} = ${answer}`, {
    ...neutralEvidence(totalObjects, "INDEPENDENT_RELATIVE_ORDER_CHAINS"), chainLengths, relativeOrderDivisor,
  });
}
function solveAlternation(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const largeCount = numberValue(parameters, "largeCount");
  const smallCount = numberValue(parameters, "smallCount");
  const orientationCount = numberValue(parameters, "orientationCount");
  const totalObjects = largeCount + smallCount;
  const answer = countStrictAlternationExact(largeCount, smallCount, orientationCount, ceiling);
  return result(answer, `${orientationCount} × ${largeCount}! × ${smallCount}! = ${answer}`, `${orientationCount} \\times ${largeCount}! \\times ${smallCount}! = ${answer}`, {
    ...neutralEvidence(totalObjects, "STRICT_ALTERNATION"), largeCount, smallCount, orientationCount,
  });
}
function solveNoAdjacency(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const largeCount = numberValue(parameters, "largeCount");
  const smallCount = numberValue(parameters, "smallCount");
  const totalObjects = largeCount + smallCount;
  const gapSlotCount = largeCount + 1;
  const chosenGapCount = combinationExact(gapSlotCount, smallCount, ceiling);
  const answer = countNoTwoCategoryMembersAdjacentExact(largeCount, smallCount, ceiling);
  return result(answer, `${largeCount}! × ${gapSlotCount}C${smallCount} × ${smallCount}! = ${answer}`, `${largeCount}! \\times \\binom{${gapSlotCount}}{${smallCount}} \\times ${smallCount}! = ${answer}`, {
    ...neutralEvidence(totalObjects, "NO_TWO_CATEGORY_MEMBERS_ADJACENT"), largeCount, smallCount, gapSlotCount, chosenGapCount,
  });
}
function solveExactGap(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const gapCount = numberValue(parameters, "gapCount");
  const orderedPositionPairCount = 2 * (totalObjects - gapCount - 1);
  const answer = countExactGapBetweenPairExact(totalObjects, gapCount, ceiling);
  return result(answer, `${orderedPositionPairCount} × ${totalObjects - 2}! = ${answer}`, `${orderedPositionPairCount} \\times ${totalObjects - 2}! = ${answer}`, {
    ...neutralEvidence(totalObjects, "EXACT_GAP_BETWEEN_PAIR"), gapCount, orderedPositionPairCount, remainingObjects: totalObjects - 2,
  });
}
function solveAtLeastGap(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const minimumGap = numberValue(parameters, "minimumGap");
  const orderedPositionPairCount = (totalObjects - minimumGap - 1) * (totalObjects - minimumGap);
  const answer = countAtLeastGapBetweenPairExact(totalObjects, minimumGap, ceiling);
  return result(answer, `${orderedPositionPairCount} × ${totalObjects - 2}! = ${answer}`, `${orderedPositionPairCount} \\times ${totalObjects - 2}! = ${answer}`, {
    ...neutralEvidence(totalObjects, "AT_LEAST_GAP_BETWEEN_PAIR"), minimumGap, orderedPositionPairCount, remainingObjects: totalObjects - 2,
  });
}
function solvePositionClass(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const specifiedCount = numberValue(parameters, "specifiedCount");
  const requiredInClass = numberValue(parameters, "requiredInClass");
  const eligibleClassPositions = numberValue(parameters, "eligibleClassPositions");
  const ineligibleClassPositions = totalObjects - eligibleClassPositions;
  const selectedSpecifiedCount = combinationExact(specifiedCount, requiredInClass, ceiling);
  const eligibleAssignmentCount = permutationExact(eligibleClassPositions, requiredInClass, ceiling);
  const ineligibleAssignmentCount = permutationExact(ineligibleClassPositions, specifiedCount - requiredInClass, ceiling);
  const ordinaryArrangementCount = factorialExact(totalObjects - specifiedCount, ceiling);
  const answer = countSpecifiedObjectsInPositionClassExact(totalObjects, specifiedCount, requiredInClass, eligibleClassPositions, ceiling);
  return result(
    answer,
    `${specifiedCount}C${requiredInClass} × ${eligibleClassPositions}P${requiredInClass} × ${ineligibleClassPositions}P${specifiedCount - requiredInClass} × ${totalObjects - specifiedCount}! = ${answer}`,
    `\\binom{${specifiedCount}}{${requiredInClass}} \\times {}^{${eligibleClassPositions}}P_{${requiredInClass}} \\times {}^{${ineligibleClassPositions}}P_{${specifiedCount - requiredInClass}} \\times ${totalObjects - specifiedCount}! = ${answer}`,
    { ...neutralEvidence(totalObjects, "SPECIFIED_OBJECTS_IN_POSITION_CLASS"), specifiedCount, requiredInClass, eligibleClassPositions, ineligibleClassPositions, selectedSpecifiedCount, eligibleAssignmentCount, ineligibleAssignmentCount, ordinaryArrangementCount },
  );
}
function solveInverseGap(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const target = numberValue(parameters, "target");
  const searchMinimum = numberValue(parameters, "searchMinimum");
  const searchMaximum = numberValue(parameters, "searchMaximum");
  const matches: number[] = [];
  for (let candidate = searchMinimum; candidate <= searchMaximum; candidate += 1) {
    if (countExactGapBetweenPairExact(totalObjects, candidate, ceiling) === target) matches.push(candidate);
  }
  if (matches.length !== 1) throw new Error(`CP-008 inverse gap search found ${matches.length} matches`);
  const answer = matches[0]!;
  const orderedPositionPairCount = 2 * (totalObjects - answer - 1);
  return result(answer, `${orderedPositionPairCount} × ${totalObjects - 2}! = ${target}, so d = ${answer}`, `${orderedPositionPairCount} \\times ${totalObjects - 2}! = ${target},\\quad d = ${answer}`, {
    ...neutralEvidence(totalObjects, "POSITION_GAP_INVERSE"), gapCount: answer, orderedPositionPairCount, target, recoveredParameter: "gap", searchMinimum, searchMaximum,
  });
}

export function solvePnc002Cp008(parameters: Pnc002Parameters): Pnc002SolverResult {
  if (parameters.canonicalProblemId !== "PNC-CP-008") throw new Error("CP-008 solver received another canonical problem");
  switch (parameters.solveMode) {
    case "countObjectAtExactPosition": return solveExactPosition(parameters);
    case "countObjectAtEitherEnd": return solveEitherEnd(parameters);
    case "countSpecifiedObjectsAtBothEnds": return solveBothEnds(parameters);
    case "countObjectExcludedFromEnds": return solveExcludedEnds(parameters);
    case "countPrescribedRelativeOrder": return solveRelativeOrder(parameters);
    case "countIndependentRelativeOrderChains": return solveIndependentChains(parameters);
    case "countStrictAlternation": return solveAlternation(parameters);
    case "countNoTwoCategoryMembersAdjacent": return solveNoAdjacency(parameters);
    case "countExactGapBetweenPair": return solveExactGap(parameters);
    case "countAtLeastGapBetweenPair": return solveAtLeastGap(parameters);
    case "countSpecifiedObjectsInPositionClass": return solvePositionClass(parameters);
    case "recoverPositionGapParameter": return solveInverseGap(parameters);
    default: throw new Error(`Unsupported CP-008 solve mode ${parameters.solveMode}`);
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
function positionsIncrease(permutation: number[], items: number[]): boolean {
  return items.every((item, index) => index === 0 || permutation.indexOf(items[index - 1]!) < permutation.indexOf(item));
}
function enumerateDirect(parameters: Pnc002Parameters): number {
  const totalObjects = numberValue(parameters, "totalObjects");
  switch (parameters.solveMode) {
    case "countObjectAtExactPosition": {
      const fixedPosition = numberValue(parameters, "fixedPosition") - 1;
      return countByPermutationEnumeration(totalObjects, (permutation) => permutation[fixedPosition] === 0);
    }
    case "countObjectAtEitherEnd":
      return countByPermutationEnumeration(totalObjects, (permutation) => permutation[0] === 0 || permutation[totalObjects - 1] === 0);
    case "countSpecifiedObjectsAtBothEnds":
      return countByPermutationEnumeration(totalObjects, (permutation) => new Set([permutation[0], permutation[totalObjects - 1]]).has(0) && new Set([permutation[0], permutation[totalObjects - 1]]).has(1));
    case "countObjectExcludedFromEnds":
      return countByPermutationEnumeration(totalObjects, (permutation) => permutation[0] !== 0 && permutation[totalObjects - 1] !== 0);
    case "countPrescribedRelativeOrder": {
      const chainLength = numberValue(parameters, "chainLength");
      const chain = Array.from({ length: chainLength }, (_, index) => index);
      return countByPermutationEnumeration(totalObjects, (permutation) => positionsIncrease(permutation, chain));
    }
    case "countIndependentRelativeOrderChains":
      return countByPermutationEnumeration(totalObjects, (permutation) => positionsIncrease(permutation, [0, 1]) && positionsIncrease(permutation, [2, 3]));
    case "countStrictAlternation": {
      const largeCount = numberValue(parameters, "largeCount");
      const fixedLargeStart = parameters.scenarioFamily === "equalCategoriesAlternateFixedStart";
      return countByPermutationEnumeration(totalObjects, (permutation) => {
        const category = (item: number) => item < largeCount ? 0 : 1;
        if (fixedLargeStart && category(permutation[0]!) !== 0) return false;
        return permutation.every((item, index) => index === 0 || category(item) !== category(permutation[index - 1]!));
      });
    }
    case "countNoTwoCategoryMembersAdjacent": {
      const largeCount = numberValue(parameters, "largeCount");
      return countByPermutationEnumeration(totalObjects, (permutation) => permutation.every((item, index) => index === 0 || !(item >= largeCount && permutation[index - 1]! >= largeCount)));
    }
    case "countExactGapBetweenPair": {
      const gapCount = numberValue(parameters, "gapCount");
      return countByPermutationEnumeration(totalObjects, (permutation) => Math.abs(permutation.indexOf(0) - permutation.indexOf(1)) - 1 === gapCount);
    }
    case "countAtLeastGapBetweenPair": {
      const minimumGap = numberValue(parameters, "minimumGap");
      return countByPermutationEnumeration(totalObjects, (permutation) => Math.abs(permutation.indexOf(0) - permutation.indexOf(1)) - 1 >= minimumGap);
    }
    case "countSpecifiedObjectsInPositionClass": {
      const specifiedCount = numberValue(parameters, "specifiedCount");
      const requiredInClass = numberValue(parameters, "requiredInClass");
      const oddNumbered = parameters.scenarioFamily === "exactSpecifiedInOddPositions";
      return countByPermutationEnumeration(totalObjects, (permutation) => {
        const inClass = permutation.reduce((count, item, index) => {
          const positionIsClass = oddNumbered ? (index + 1) % 2 === 1 : (index + 1) % 2 === 0;
          return count + (item < specifiedCount && positionIsClass ? 1 : 0);
        }, 0);
        return inClass === requiredInClass;
      });
    }
    default: throw new Error(`Direct CP-008 enumeration does not support ${parameters.solveMode}`);
  }
}

export function verifyPnc002Cp008Independently(parameters: Pnc002Parameters): Pnc002IndependentVerification {
  if (parameters.solveMode !== "recoverPositionGapParameter") {
    return { supported: true, answer: enumerateDirect(parameters), method: "Exhaustive enumeration of distinct linear permutations with position, order, alternation and gap predicates" };
  }
  const target = numberValue(parameters, "target");
  const searchMinimum = numberValue(parameters, "searchMinimum");
  const searchMaximum = numberValue(parameters, "searchMaximum");
  const matches: number[] = [];
  for (let candidate = searchMinimum; candidate <= searchMaximum; candidate += 1) {
    const direct: Pnc002Parameters = { ...parameters, solveMode: "countExactGapBetweenPair", values: { ...parameters.values, gapCount: candidate } };
    if (enumerateDirect(direct) === target) matches.push(candidate);
  }
  return { supported: matches.length === 1, answer: matches[0] ?? -1, method: "Bounded gap search using exhaustive permutation enumeration for each candidate" };
}
