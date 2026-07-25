import {
  combinationExact,
  divideExact,
  factorialExact,
  productExact,
  subtractExact,
} from "./math";
import { getPnc002VariableRanges } from "./library";
import type {
  Pnc002AnyParameters,
  Pnc002IndependentVerification,
  Pnc002SolverEvidence,
  Pnc002SolverResult,
} from "./types";

function numberValue(parameters: Pnc002AnyParameters, key: string): number {
  const value = parameters.values[key];
  if (typeof value !== "number") throw new Error(`PNC-002 CP-010 value ${key} is not numeric`);
  return value;
}
function numberArrayValue(parameters: Pnc002AnyParameters, key: string): number[] {
  const value = parameters.values[key];
  if (!Array.isArray(value) || !value.every(Number.isInteger)) throw new Error(`PNC-002 CP-010 value ${key} is not an integer array`);
  return [...value];
}
function result(answer: number, equation: string, mathJax: string, evidence: Pnc002SolverEvidence): Pnc002SolverResult {
  return { exactAnswer: String(answer), answer: String(answer), numericAnswer: answer, equation, mathJax, evidence };
}
function circularEvidence(totalObjects: number, operation: Pnc002SolverEvidence["operation"]): Pnc002SolverEvidence {
  const unrestrictedCount = countRoundTableDistinctExact(totalObjects, getPnc002VariableRanges().answerCeiling);
  return {
    operation,
    totalObjects,
    blockSizes: [],
    groupedObjectCount: 0,
    blockCount: 0,
    unitCount: totalObjects,
    circularUnitCount: totalObjects,
    externalArrangementCount: unrestrictedCount,
    internalArrangementCounts: [],
    internalArrangementMultiplier: 1,
    unrestrictedCount,
    rotationalSymmetryDivisor: totalObjects,
  };
}

export function countRoundTableDistinctExact(totalObjects: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (totalObjects < 2) throw new Error("Round-table counting requires at least two objects");
  return factorialExact(totalObjects - 1, ceiling);
}
export function countCircularSpecifiedBlockTogetherExact(totalObjects: number, blockSize: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (blockSize < 2 || blockSize >= totalObjects) throw new Error("Circular block size must be between 2 and n - 1");
  return productExact([factorialExact(totalObjects - blockSize, ceiling), factorialExact(blockSize, ceiling)], ceiling);
}
export function countCircularSpecifiedBlockApartExact(totalObjects: number, blockSize: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return subtractExact(countRoundTableDistinctExact(totalObjects, ceiling), countCircularSpecifiedBlockTogetherExact(totalObjects, blockSize, ceiling));
}
export function countCircularMultipleBlocksTogetherExact(totalObjects: number, blockSizes: number[], ceiling = Number.MAX_SAFE_INTEGER): number {
  const groupedObjectCount = blockSizes.reduce((sum, value) => sum + value, 0);
  const unitCount = totalObjects - groupedObjectCount + blockSizes.length;
  if (blockSizes.length < 2 || blockSizes.some((size) => size < 2) || unitCount < 2) throw new Error("Invalid circular block system");
  return productExact([
    factorialExact(unitCount - 1, ceiling),
    ...blockSizes.map((size) => factorialExact(size, ceiling)),
  ], ceiling);
}
export function countCircularBlockWithExternalPairApartExact(totalObjects: number, blockSize: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  const primary = countCircularSpecifiedBlockTogetherExact(totalObjects, blockSize, ceiling);
  const both = countCircularMultipleBlocksTogetherExact(totalObjects, [blockSize, 2], ceiling);
  return subtractExact(primary, both);
}
export function countCircularTwoBlocksNotAdjacentExact(totalObjects: number, blockSizes: number[], ceiling = Number.MAX_SAFE_INTEGER): number {
  const groupedObjectCount = blockSizes.reduce((sum, value) => sum + value, 0);
  const unitCount = totalObjects - groupedObjectCount + blockSizes.length;
  const internal = productExact(blockSizes.map((size) => factorialExact(size, ceiling)), ceiling);
  const allUnits = factorialExact(unitCount - 1, ceiling);
  const adjacentUnits = productExact([2, factorialExact(unitCount - 2, ceiling)], ceiling);
  return productExact([subtractExact(allUnits, adjacentUnits), internal], ceiling);
}
export function countCircularAtLeastOnePairTogetherExact(totalObjects: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  const one = countCircularSpecifiedBlockTogetherExact(totalObjects, 2, ceiling);
  const both = countCircularMultipleBlocksTogetherExact(totalObjects, [2, 2], ceiling);
  return subtractExact(productExact([2, one], ceiling), both);
}
export function countCircularNeitherPairTogetherExact(totalObjects: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  const total = countRoundTableDistinctExact(totalObjects, ceiling);
  const one = countCircularSpecifiedBlockTogetherExact(totalObjects, 2, ceiling);
  const both = countCircularMultipleBlocksTogetherExact(totalObjects, [2, 2], ceiling);
  return total - 2 * one + both;
}
export function countPersonBetweenTwoNeighborsExact(totalObjects: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return productExact([2, factorialExact(totalObjects - 3, ceiling)], ceiling);
}
export function countOppositePairExact(totalObjects: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (totalObjects % 2 !== 0) throw new Error("Opposite seats require an even circular size");
  return factorialExact(totalObjects - 2, ceiling);
}
export function countClockwiseAdjacentPairExact(totalObjects: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return factorialExact(totalObjects - 2, ceiling);
}
export function countClockwiseExactGapExact(totalObjects: number, gapCount: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (gapCount < 0 || gapCount > totalObjects - 2) throw new Error("Clockwise gap is outside the circular domain");
  return factorialExact(totalObjects - 2, ceiling);
}
export function countClockwiseAtLeastGapExact(totalObjects: number, minimumGap: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (minimumGap < 0 || minimumGap > totalObjects - 2) throw new Error("Minimum clockwise gap is outside the circular domain");
  return productExact([totalObjects - 1 - minimumGap, factorialExact(totalObjects - 2, ceiling)], ceiling);
}
export function countClockwiseAtMostGapExact(totalObjects: number, maximumGap: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (maximumGap < 0 || maximumGap > totalObjects - 2) throw new Error("Maximum clockwise gap is outside the circular domain");
  return productExact([maximumGap + 1, factorialExact(totalObjects - 2, ceiling)], ceiling);
}
export function countPrescribedClockwiseOrderExact(totalObjects: number, orderLength: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (orderLength < 2 || orderLength > totalObjects) throw new Error("Clockwise order length is outside the circular domain");
  return divideExact(factorialExact(totalObjects - 1, ceiling), factorialExact(orderLength - 1, ceiling));
}
export function countCircularAlternationExact(categorySize: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (categorySize < 2) throw new Error("Circular alternation needs at least two members per category");
  return productExact([factorialExact(categorySize - 1, ceiling), factorialExact(categorySize, ceiling)], ceiling);
}
export function countCircularNoTwoCategoryAdjacentExact(largeCount: number, smallCount: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (largeCount < 2 || smallCount < 1 || smallCount > largeCount) throw new Error("Circular gap placement requires 1 <= smallCount <= largeCount");
  return productExact([
    factorialExact(largeCount - 1, ceiling),
    combinationExact(largeCount, smallCount, ceiling),
    factorialExact(smallCount, ceiling),
  ], ceiling);
}
export function countRotationOnlyOrnamentsExact(totalObjects: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return factorialExact(totalObjects - 1, ceiling);
}
export function countDihedralDistinctOrnamentsExact(totalObjects: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (totalObjects < 3) throw new Error("Reflection-equivalent ornament counting requires at least three distinct objects");
  return divideExact(factorialExact(totalObjects - 1, ceiling), 2);
}
export function countDihedralPairTogetherExact(totalObjects: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (totalObjects < 4) throw new Error("Dihedral adjacent-pair counting requires at least four distinct objects");
  return factorialExact(totalObjects - 2, ceiling);
}

function inverseSearch(target: number, minimum: number, maximum: number, counter: (n: number) => number): number {
  const matches: number[] = [];
  for (let candidate = minimum; candidate <= maximum; candidate += 1) if (counter(candidate) === target) matches.push(candidate);
  if (matches.length !== 1) throw new Error(`Circular inverse expected one solution, found ${matches.length}`);
  return matches[0];
}

export function solvePnc002Cp010(parameters: Pnc002AnyParameters): Pnc002SolverResult {
  if (parameters.canonicalProblemId !== "PNC-CP-010") throw new Error(`CP-010 solver received ${parameters.canonicalProblemId}`);
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const base = (operation: Pnc002SolverEvidence["operation"]) => circularEvidence(totalObjects, operation);

  switch (parameters.solveMode) {
    case "countRoundTableDistinct": {
      const answer = countRoundTableDistinctExact(totalObjects, ceiling);
      return result(answer, `(${totalObjects} - 1)! = ${answer}`, `(${totalObjects} - 1)! = ${answer}`, {
        ...base("ROUND_TABLE_DISTINCT"), remainingObjects: totalObjects - 1,
      });
    }
    case "countCircularSpecifiedBlockTogether": {
      const blockSize = numberValue(parameters, "blockSize");
      const answer = countCircularSpecifiedBlockTogetherExact(totalObjects, blockSize, ceiling);
      const unitCount = totalObjects - blockSize + 1;
      return result(answer, `(${unitCount} - 1)! × ${blockSize}! = ${answer}`, `(${unitCount} - 1)! \\times ${blockSize}! = ${answer}`, {
        ...base("CIRCULAR_BLOCK_TOGETHER"), blockSizes: [blockSize], groupedObjectCount: blockSize, blockCount: 1,
        unitCount, circularUnitCount: unitCount, externalArrangementCount: factorialExact(unitCount - 1, ceiling),
        internalArrangementCounts: [factorialExact(blockSize, ceiling)], internalArrangementMultiplier: factorialExact(blockSize, ceiling),
      });
    }
    case "countCircularSpecifiedBlockApart": {
      const blockSize = numberValue(parameters, "blockSize");
      const together = countCircularSpecifiedBlockTogetherExact(totalObjects, blockSize, ceiling);
      const unrestricted = countRoundTableDistinctExact(totalObjects, ceiling);
      const answer = subtractExact(unrestricted, together);
      return result(answer, `${unrestricted} - ${together} = ${answer}`, `${unrestricted} - ${together} = ${answer}`, {
        ...base("CIRCULAR_BLOCK_APART"), blockSizes: [blockSize], groupedObjectCount: blockSize, blockCount: 1,
        forbiddenTogetherCount: together,
      });
    }
    case "countCircularMultipleBlocksTogether": {
      const blockSizes = numberArrayValue(parameters, "blockSizes");
      const answer = countCircularMultipleBlocksTogetherExact(totalObjects, blockSizes, ceiling);
      const groupedObjectCount = blockSizes.reduce((sum, value) => sum + value, 0);
      const unitCount = totalObjects - groupedObjectCount + blockSizes.length;
      const internalCounts = blockSizes.map((size) => factorialExact(size, ceiling));
      return result(answer, `(${unitCount} - 1)! × ${internalCounts.join(" × ")} = ${answer}`, `(${unitCount} - 1)! \\times ${internalCounts.join(" \\times ")} = ${answer}`, {
        ...base("CIRCULAR_MULTIPLE_BLOCKS"), blockSizes, groupedObjectCount, blockCount: blockSizes.length, unitCount,
        circularUnitCount: unitCount, externalArrangementCount: factorialExact(unitCount - 1, ceiling),
        internalArrangementCounts: internalCounts, internalArrangementMultiplier: productExact(internalCounts, ceiling),
      });
    }
    case "countCircularBlockWithExternalPairApart": {
      const blockSize = 2;
      const primary = countCircularSpecifiedBlockTogetherExact(totalObjects, blockSize, ceiling);
      const both = countCircularMultipleBlocksTogetherExact(totalObjects, [blockSize, 2], ceiling);
      const answer = subtractExact(primary, both);
      return result(answer, `${primary} - ${both} = ${answer}`, `${primary} - ${both} = ${answer}`, {
        ...base("CIRCULAR_BLOCK_WITH_EXTERNAL_PAIR_APART"), blockSizes: [2, 2], groupedObjectCount: 4, blockCount: 2,
        primaryRestrictionCount: primary, forbiddenTogetherCount: both,
      });
    }
    case "countCircularTwoBlocksNotAdjacent": {
      const blockSizes = [2, 2];
      const answer = countCircularTwoBlocksNotAdjacentExact(totalObjects, blockSizes, ceiling);
      const unitCount = totalObjects - 2;
      const allUnits = factorialExact(unitCount - 1, ceiling);
      const adjacentUnits = productExact([2, factorialExact(unitCount - 2, ceiling)], ceiling);
      return result(answer, `(${allUnits} - ${adjacentUnits}) × 4 = ${answer}`, `(${allUnits} - ${adjacentUnits}) \\times 4 = ${answer}`, {
        ...base("CIRCULAR_TWO_BLOCKS_NOT_ADJACENT"), blockSizes, groupedObjectCount: 4, blockCount: 2, unitCount,
        circularUnitCount: unitCount, validUnitArrangementCount: subtractExact(allUnits, adjacentUnits),
        forbiddenAdjacentUnitCount: adjacentUnits, internalArrangementCounts: [2, 2], internalArrangementMultiplier: 4,
      });
    }
    case "countCircularAtLeastOnePairTogether": {
      const one = countCircularSpecifiedBlockTogetherExact(totalObjects, 2, ceiling);
      const both = countCircularMultipleBlocksTogetherExact(totalObjects, [2, 2], ceiling);
      const answer = countCircularAtLeastOnePairTogetherExact(totalObjects, ceiling);
      return result(answer, `2 × ${one} - ${both} = ${answer}`, `2 \\times ${one} - ${both} = ${answer}`, {
        ...base("CIRCULAR_AT_LEAST_ONE_PAIR"), blockSizes: [2, 2], blockCount: 2, primaryRestrictionCount: one,
        allSpecifiedBlocksTogetherCount: both,
      });
    }
    case "countCircularNeitherPairTogether": {
      const total = countRoundTableDistinctExact(totalObjects, ceiling);
      const one = countCircularSpecifiedBlockTogetherExact(totalObjects, 2, ceiling);
      const both = countCircularMultipleBlocksTogetherExact(totalObjects, [2, 2], ceiling);
      const answer = countCircularNeitherPairTogetherExact(totalObjects, ceiling);
      return result(answer, `${total} - 2 × ${one} + ${both} = ${answer}`, `${total} - 2 \\times ${one} + ${both} = ${answer}`, {
        ...base("CIRCULAR_NEITHER_PAIR"), blockSizes: [2, 2], blockCount: 2, primaryRestrictionCount: one,
        allSpecifiedBlocksTogetherCount: both,
      });
    }
    case "countPersonBetweenTwoNeighbors": {
      const answer = countPersonBetweenTwoNeighborsExact(totalObjects, ceiling);
      return result(answer, `2 × (${totalObjects} - 3)! = ${answer}`, `2 \\times (${totalObjects} - 3)! = ${answer}`, {
        ...base("CIRCULAR_PERSON_BETWEEN_NEIGHBORS"), adjacentOrientationCount: 2, remainingObjects: totalObjects - 3,
      });
    }
    case "countOppositePair": {
      const answer = countOppositePairExact(totalObjects, ceiling);
      return result(answer, `(${totalObjects} - 2)! = ${answer}`, `(${totalObjects} - 2)! = ${answer}`, {
        ...base("CIRCULAR_OPPOSITE_PAIR"), oppositeSeatOffset: totalObjects / 2, remainingObjects: totalObjects - 2,
      });
    }
    case "countClockwiseAdjacentPair": {
      const answer = countClockwiseAdjacentPairExact(totalObjects, ceiling);
      return result(answer, `(${totalObjects} - 2)! = ${answer}`, `(${totalObjects} - 2)! = ${answer}`, {
        ...base("CLOCKWISE_ADJACENT_PAIR"), clockwiseGap: 0, clockwisePositionChoices: 1, remainingObjects: totalObjects - 2,
      });
    }
    case "countClockwiseExactGap": {
      const gapCount = numberValue(parameters, "gapCount");
      const answer = countClockwiseExactGapExact(totalObjects, gapCount, ceiling);
      return result(answer, `1 × (${totalObjects} - 2)! = ${answer}`, `1 \\times (${totalObjects} - 2)! = ${answer}`, {
        ...base("CLOCKWISE_EXACT_GAP"), clockwiseGap: gapCount, clockwisePositionChoices: 1, remainingObjects: totalObjects - 2,
      });
    }
    case "countClockwiseAtLeastGap": {
      const minimumGap = numberValue(parameters, "minimumGap");
      const positionChoices = totalObjects - 1 - minimumGap;
      const answer = countClockwiseAtLeastGapExact(totalObjects, minimumGap, ceiling);
      return result(answer, `${positionChoices} × (${totalObjects} - 2)! = ${answer}`, `${positionChoices} \\times (${totalObjects} - 2)! = ${answer}`, {
        ...base("CLOCKWISE_AT_LEAST_GAP"), minimumClockwiseGap: minimumGap, clockwisePositionChoices: positionChoices,
        remainingObjects: totalObjects - 2,
      });
    }
    case "countClockwiseAtMostGap": {
      const maximumGap = numberValue(parameters, "maximumGap");
      const positionChoices = maximumGap + 1;
      const answer = countClockwiseAtMostGapExact(totalObjects, maximumGap, ceiling);
      return result(answer, `${positionChoices} × (${totalObjects} - 2)! = ${answer}`, `${positionChoices} \\times (${totalObjects} - 2)! = ${answer}`, {
        ...base("CLOCKWISE_AT_MOST_GAP"), maximumClockwiseGap: maximumGap, clockwisePositionChoices: positionChoices,
        remainingObjects: totalObjects - 2,
      });
    }
    case "countPrescribedClockwiseOrder": {
      const orderLength = numberValue(parameters, "orderLength");
      const divisor = factorialExact(orderLength - 1, ceiling);
      const answer = countPrescribedClockwiseOrderExact(totalObjects, orderLength, ceiling);
      return result(answer, `(${totalObjects} - 1)! ÷ (${orderLength} - 1)! = ${answer}`, `(${totalObjects} - 1)! \\div (${orderLength} - 1)! = ${answer}`, {
        ...base("PRESCRIBED_CLOCKWISE_ORDER"), clockwiseOrderLength: orderLength, clockwiseOrderDivisor: divisor,
      });
    }
    case "countCircularAlternation": {
      const categorySize = numberValue(parameters, "categorySize");
      const answer = countCircularAlternationExact(categorySize, ceiling);
      return result(answer, `(${categorySize} - 1)! × ${categorySize}! = ${answer}`, `(${categorySize} - 1)! \\times ${categorySize}! = ${answer}`, {
        ...base("CIRCULAR_ALTERNATION"), categorySizes: [categorySize, categorySize], largeCount: categorySize, smallCount: categorySize,
        gapSlotCount: categorySize,
      });
    }
    case "countCircularNoTwoCategoryAdjacent": {
      const largeCount = numberValue(parameters, "largeCount");
      const smallCount = numberValue(parameters, "smallCount");
      const answer = countCircularNoTwoCategoryAdjacentExact(largeCount, smallCount, ceiling);
      return result(answer, `(${largeCount} - 1)! × C(${largeCount}, ${smallCount}) × ${smallCount}! = ${answer}`, `(${largeCount} - 1)! \\times {}^{${largeCount}}C_{${smallCount}} \\times ${smallCount}! = ${answer}`, {
        ...base("CIRCULAR_NO_TWO_CATEGORY_ADJACENT"), categorySizes: [largeCount, smallCount], largeCount, smallCount,
        gapSlotCount: largeCount, chosenGapCount: smallCount, specifiedCount: numberValue(parameters, "smallCount"),
      });
    }
    case "recoverCircularParameter": {
      const target = numberValue(parameters, "target");
      const minimum = numberValue(parameters, "searchMinimum");
      const maximum = numberValue(parameters, "searchMaximum");
      const pairMode = parameters.questionLanguageId === "PNC-QL-200";
      const answer = inverseSearch(target, minimum, maximum, (candidate) => pairMode
        ? countCircularSpecifiedBlockTogetherExact(candidate, 2, ceiling)
        : countRoundTableDistinctExact(candidate, ceiling));
      return result(answer, pairMode ? `2 × (${answer} - 2)! = ${target}` : `(${answer} - 1)! = ${target}`, pairMode ? `2 \\times (${answer} - 2)! = ${target}` : `(${answer} - 1)! = ${target}`, {
        ...base("CIRCULAR_INVERSE"), target, recoveredParameter: "circularObjects", searchMinimum: minimum, searchMaximum: maximum,
        blockSizes: pairMode ? [2] : [],
      });
    }
    case "countRotationOnlyOrnaments": {
      const answer = countRotationOnlyOrnamentsExact(totalObjects, ceiling);
      return result(answer, `(${totalObjects} - 1)! = ${answer}`, `(${totalObjects} - 1)! = ${answer}`, {
        ...base("ROTATION_ONLY_ORNAMENTS"), rotationalSymmetryDivisor: totalObjects, reflectionSymmetryDivisor: 1,
      });
    }
    case "countDihedralDistinctOrnaments": {
      const answer = countDihedralDistinctOrnamentsExact(totalObjects, ceiling);
      return result(answer, `(${totalObjects} - 1)! ÷ 2 = ${answer}`, `(${totalObjects} - 1)! \\div 2 = ${answer}`, {
        ...base("DIHEDRAL_DISTINCT_ORNAMENTS"), rotationalSymmetryDivisor: totalObjects, reflectionSymmetryDivisor: 2,
      });
    }
    case "countDihedralPairTogether": {
      const answer = countDihedralPairTogetherExact(totalObjects, ceiling);
      return result(answer, `2 × (${totalObjects} - 2)! ÷ 2 = ${answer}`, `2 \\times (${totalObjects} - 2)! \\div 2 = ${answer}`, {
        ...base("DIHEDRAL_PAIR_TOGETHER"), blockSizes: [2], groupedObjectCount: 2, blockCount: 1,
        rotationalSymmetryDivisor: totalObjects, reflectionSymmetryDivisor: 2,
      });
    }
    default:
      throw new Error(`Unsupported PNC-002 CP-010 solve mode: ${parameters.solveMode}`);
  }
}

function countAnchoredCircular(totalObjects: number, predicate: (arrangement: number[]) => boolean): number {
  const arrangement = Array.from({ length: totalObjects }, () => -1);
  const used = Array.from({ length: totalObjects }, () => false);
  arrangement[0] = 0;
  used[0] = true;
  let count = 0;
  const visit = (position: number): void => {
    if (position === totalObjects) {
      if (predicate(arrangement)) count += 1;
      return;
    }
    for (let person = 1; person < totalObjects; person += 1) {
      if (used[person]) continue;
      used[person] = true;
      arrangement[position] = person;
      visit(position + 1);
      used[person] = false;
    }
  };
  visit(1);
  return count;
}
function positions(arrangement: number[]): number[] {
  const result = Array.from({ length: arrangement.length }, () => -1);
  arrangement.forEach((person, position) => { result[person] = position; });
  return result;
}
function adjacent(pos: number[], first: number, second: number): boolean {
  const n = pos.length;
  const distance = Math.abs(pos[first] - pos[second]);
  return distance === 1 || distance === n - 1;
}
function blockConsecutive(pos: number[], members: number[]): boolean {
  let internalEdges = 0;
  for (let index = 0; index < members.length; index += 1) {
    for (let other = index + 1; other < members.length; other += 1) {
      if (adjacent(pos, members[index], members[other])) internalEdges += 1;
    }
  }
  return internalEdges === members.length - 1;
}
function lexicographicallyCanonicalUnderReflection(arrangement: number[]): boolean {
  const reflected = [arrangement[0], ...arrangement.slice(1).reverse()];
  for (let index = 0; index < arrangement.length; index += 1) {
    if (arrangement[index] < reflected[index]) return true;
    if (arrangement[index] > reflected[index]) return false;
  }
  return true;
}

export function verifyPnc002Cp010Independently(parameters: Pnc002AnyParameters): Pnc002IndependentVerification {
  if (parameters.canonicalProblemId !== "PNC-CP-010") throw new Error(`CP-010 verifier received ${parameters.canonicalProblemId}`);
  const totalObjects = numberValue(parameters, "totalObjects");
  const mode = parameters.solveMode;
  if (mode === "recoverCircularParameter") {
    const target = numberValue(parameters, "target");
    const minimum = numberValue(parameters, "searchMinimum");
    const maximum = numberValue(parameters, "searchMaximum");
    const pairMode = parameters.questionLanguageId === "PNC-QL-200";
    const matches: number[] = [];
    for (let candidate = minimum; candidate <= maximum; candidate += 1) {
      const counted = countAnchoredCircular(candidate, (arrangement) => !pairMode || adjacent(positions(arrangement), 0, 1));
      if (counted === target) matches.push(candidate);
    }
    return { supported: true, answer: matches.length === 1 ? matches[0] : -1, method: "Bounded exhaustive circular enumeration for inverse recovery" };
  }

  const answer = countAnchoredCircular(totalObjects, (arrangement) => {
    const pos = positions(arrangement);
    switch (mode) {
      case "countRoundTableDistinct":
      case "countRotationOnlyOrnaments":
        return true;
      case "countCircularSpecifiedBlockTogether": {
        const blockSize = numberValue(parameters, "blockSize");
        return blockConsecutive(pos, Array.from({ length: blockSize }, (_, index) => index));
      }
      case "countCircularSpecifiedBlockApart": {
        const blockSize = numberValue(parameters, "blockSize");
        return !blockConsecutive(pos, Array.from({ length: blockSize }, (_, index) => index));
      }
      case "countCircularMultipleBlocksTogether": {
        const blockSizes = numberArrayValue(parameters, "blockSizes");
        const first = Array.from({ length: blockSizes[0] }, (_, index) => index);
        const second = Array.from({ length: blockSizes[1] }, (_, index) => blockSizes[0] + index);
        return blockConsecutive(pos, first) && blockConsecutive(pos, second);
      }
      case "countCircularBlockWithExternalPairApart":
        return adjacent(pos, 0, 1) && !adjacent(pos, 2, 3);
      case "countCircularTwoBlocksNotAdjacent": {
        if (!adjacent(pos, 0, 1) || !adjacent(pos, 2, 3)) return false;
        return ![0, 1].some((first) => [2, 3].some((second) => adjacent(pos, first, second)));
      }
      case "countCircularAtLeastOnePairTogether":
        return adjacent(pos, 0, 1) || adjacent(pos, 2, 3);
      case "countCircularNeitherPairTogether":
        return !adjacent(pos, 0, 1) && !adjacent(pos, 2, 3);
      case "countPersonBetweenTwoNeighbors":
        return adjacent(pos, 0, 1) && adjacent(pos, 0, 2);
      case "countOppositePair":
        return Math.abs(pos[0] - pos[1]) === totalObjects / 2;
      case "countClockwiseAdjacentPair":
        return (pos[0] - pos[1] + totalObjects) % totalObjects === 1;
      case "countClockwiseExactGap":
        return pos[1] - 1 === numberValue(parameters, "gapCount");
      case "countClockwiseAtLeastGap":
        return pos[1] - 1 >= numberValue(parameters, "minimumGap");
      case "countClockwiseAtMostGap":
        return pos[1] - 1 <= numberValue(parameters, "maximumGap");
      case "countPrescribedClockwiseOrder": {
        const orderLength = numberValue(parameters, "orderLength");
        for (let person = 2; person < orderLength; person += 1) if (pos[person - 1] >= pos[person]) return false;
        return true;
      }
      case "countCircularAlternation": {
        const categorySize = numberValue(parameters, "categorySize");
        for (let index = 0; index < totalObjects; index += 1) {
          const currentA = arrangement[index] < categorySize;
          const nextA = arrangement[(index + 1) % totalObjects] < categorySize;
          if (currentA === nextA) return false;
        }
        return true;
      }
      case "countCircularNoTwoCategoryAdjacent": {
        const smallCount = numberValue(parameters, "smallCount");
        const smallStart = totalObjects - smallCount;
        for (let index = 0; index < totalObjects; index += 1) {
          if (arrangement[index] >= smallStart && arrangement[(index + 1) % totalObjects] >= smallStart) return false;
        }
        return true;
      }
      case "countDihedralDistinctOrnaments":
        return lexicographicallyCanonicalUnderReflection(arrangement);
      case "countDihedralPairTogether":
        return adjacent(pos, 0, 1) && lexicographicallyCanonicalUnderReflection(arrangement);
      default:
        return false;
    }
  });
  return { supported: true, answer, method: "Exhaustive distinct circular permutations with one reference fixed; reflection modes use canonical mirror representatives" };
}
