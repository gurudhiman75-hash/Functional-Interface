import { factorialExact, productExact, subtractExact } from "./math";
import { getPnc002VariableRanges } from "./library";
import type { Pnc002IndependentVerification, Pnc002Parameters, Pnc002SolverEvidence, Pnc002SolverResult } from "./types";

function numberValue(parameters: Pnc002Parameters, key: string): number {
  const value = parameters.values[key];
  if (typeof value !== "number") throw new Error(`PNC-002 value ${key} is not numeric`);
  return value;
}
function numberArrayValue(parameters: Pnc002Parameters, key: string): number[] {
  const value = parameters.values[key];
  if (!Array.isArray(value) || !value.every((item) => Number.isInteger(item))) throw new Error(`PNC-002 value ${key} is not an integer array`);
  return [...value];
}

export function countSingleBlockTogetherExact(totalObjects: number, blockSize: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (!Number.isInteger(totalObjects) || !Number.isInteger(blockSize) || blockSize < 2 || blockSize > totalObjects) throw new Error("Invalid single-block state");
  return productExact([factorialExact(totalObjects - blockSize + 1, ceiling), factorialExact(blockSize, ceiling)], ceiling);
}
export function countSingleBlockNotTogetherExact(totalObjects: number, blockSize: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return subtractExact(factorialExact(totalObjects, ceiling), countSingleBlockTogetherExact(totalObjects, blockSize, ceiling));
}
export function countMultipleBlocksTogetherExact(totalObjects: number, blockSizes: number[], ceiling = Number.MAX_SAFE_INTEGER): number {
  if (!blockSizes.length || blockSizes.some((size) => !Number.isInteger(size) || size < 2)) throw new Error("Multiple-block sizes must be at least two");
  const groupedObjectCount = blockSizes.reduce((sum, size) => sum + size, 0);
  if (groupedObjectCount > totalObjects) throw new Error("Block sizes exceed total objects");
  const unitCount = totalObjects - groupedObjectCount + blockSizes.length;
  return productExact([factorialExact(unitCount, ceiling), ...blockSizes.map((size) => factorialExact(size, ceiling))], ceiling);
}
export function countBlockWithExternalPairApartExact(totalObjects: number, blockSize: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (blockSize + 2 > totalObjects) throw new Error("Required block and external pair must be disjoint");
  const unitCount = totalObjects - blockSize + 1;
  const allUnitArrangements = factorialExact(unitCount, ceiling);
  const adjacentExternalPairCount = productExact([2, factorialExact(unitCount - 1, ceiling)], ceiling);
  return productExact([subtractExact(allUnitArrangements, adjacentExternalPairCount), factorialExact(blockSize, ceiling)], ceiling);
}
function countNonAdjacentUnitPairExact(unitCount: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (!Number.isInteger(unitCount) || unitCount < 3) throw new Error("Non-adjacent unit-pair counting requires at least three units");
  return subtractExact(factorialExact(unitCount, ceiling), productExact([2, factorialExact(unitCount - 1, ceiling)], ceiling));
}
export function countTwoBlocksTogetherNotAdjacentExact(totalObjects: number, blockSizes: number[], ceiling = Number.MAX_SAFE_INTEGER): number {
  if (blockSizes.length !== 2) throw new Error("Separated-block mode requires exactly two blocks");
  const groupedObjectCount = blockSizes[0]! + blockSizes[1]!;
  if (groupedObjectCount >= totalObjects) throw new Error("Separated formed blocks require at least one outside object");
  const unitCount = totalObjects - groupedObjectCount + 2;
  return productExact([countNonAdjacentUnitPairExact(unitCount, ceiling), ...blockSizes.map((size) => factorialExact(size, ceiling))], ceiling);
}
export function countBlockWithOutsiderNotAdjacentExact(totalObjects: number, blockSize: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (blockSize + 1 >= totalObjects) throw new Error("Block and named outsider require at least one additional outside object");
  const unitCount = totalObjects - blockSize + 1;
  return productExact([countNonAdjacentUnitPairExact(unitCount, ceiling), factorialExact(blockSize, ceiling)], ceiling);
}
export function countOneBlockTogetherOtherNotTogetherExact(totalObjects: number, blockSizes: number[], ceiling = Number.MAX_SAFE_INTEGER): number {
  if (blockSizes.length !== 2) throw new Error("Mixed block/broken-group mode requires two disjoint groups");
  if (blockSizes[0]! + blockSizes[1]! > totalObjects) throw new Error("Mixed groups exceed total objects");
  return subtractExact(
    countSingleBlockTogetherExact(totalObjects, blockSizes[0]!, ceiling),
    countMultipleBlocksTogetherExact(totalObjects, blockSizes, ceiling),
  );
}
export function countNotAllSpecifiedBlocksTogetherExact(totalObjects: number, blockSizes: number[], ceiling = Number.MAX_SAFE_INTEGER): number {
  if (blockSizes.length < 2) throw new Error("Multiple-block complement requires at least two groups");
  return subtractExact(factorialExact(totalObjects, ceiling), countMultipleBlocksTogetherExact(totalObjects, blockSizes, ceiling));
}

function directEvidence(totalObjects: number, blockSizes: number[]): Omit<Pnc002SolverEvidence, "operation"> {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const groupedObjectCount = blockSizes.reduce((sum, size) => sum + size, 0);
  const blockCount = blockSizes.length;
  const unitCount = totalObjects - groupedObjectCount + blockCount;
  const internalArrangementCounts = blockSizes.map((size) => factorialExact(size, ceiling));
  return {
    totalObjects, blockSizes, groupedObjectCount, blockCount, unitCount,
    externalArrangementCount: factorialExact(unitCount, ceiling),
    internalArrangementCounts,
    internalArrangementMultiplier: productExact(internalArrangementCounts, ceiling),
  };
}
function makeResult(answer: number, equation: string, mathJax: string, evidence: Pnc002SolverEvidence): Pnc002SolverResult {
  return { exactAnswer: String(answer), answer: String(answer), numericAnswer: answer, equation, mathJax, evidence };
}

function solveTogether(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const blockSize = numberValue(parameters, "blockSize");
  const base = directEvidence(totalObjects, [blockSize]);
  const answer = countSingleBlockTogetherExact(totalObjects, blockSize, ceiling);
  return makeResult(answer, `${base.unitCount}! × ${blockSize}! = ${answer}`, `${base.unitCount}! \\times ${blockSize}! = ${answer}`, { operation: "SINGLE_BLOCK_TOGETHER", ...base });
}
function solveNotTogether(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const blockSize = numberValue(parameters, "blockSize");
  const base = directEvidence(totalObjects, [blockSize]);
  const unrestrictedCount = factorialExact(totalObjects, ceiling);
  const forbiddenTogetherCount = countSingleBlockTogetherExact(totalObjects, blockSize, ceiling);
  const answer = subtractExact(unrestrictedCount, forbiddenTogetherCount);
  return makeResult(answer, `${totalObjects}! - (${base.unitCount}! × ${blockSize}!) = ${answer}`, `${totalObjects}! - \\left(${base.unitCount}! \\times ${blockSize}!\\right) = ${answer}`, { operation: "SINGLE_BLOCK_COMPLEMENT", ...base, unrestrictedCount, forbiddenTogetherCount });
}
function solveMultipleBlocks(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const blockSizes = numberArrayValue(parameters, "blockSizes");
  const base = directEvidence(totalObjects, blockSizes);
  const answer = countMultipleBlocksTogetherExact(totalObjects, blockSizes, ceiling);
  const internalPlain = blockSizes.map((size) => `${size}!`).join(" × ");
  const internalTex = blockSizes.map((size) => `${size}!`).join(" \\times ");
  return makeResult(answer, `${base.unitCount}! × ${internalPlain} = ${answer}`, `${base.unitCount}! \\times ${internalTex} = ${answer}`, { operation: "MULTIPLE_BLOCKS", ...base });
}
function solveBlockWithExternalPairApart(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const blockSize = numberValue(parameters, "blockSize");
  const base = directEvidence(totalObjects, [blockSize]);
  const adjacentExternalPairCount = productExact([2, factorialExact(base.unitCount - 1, ceiling)], ceiling);
  const validUnitArrangementCount = subtractExact(base.externalArrangementCount, adjacentExternalPairCount);
  const answer = productExact([validUnitArrangementCount, base.internalArrangementMultiplier], ceiling);
  return makeResult(answer, `(${base.unitCount}! - 2 × ${base.unitCount - 1}!) × ${blockSize}! = ${answer}`, `\\left(${base.unitCount}! - 2 \\times ${base.unitCount - 1}!\\right) \\times ${blockSize}! = ${answer}`, { operation: "BLOCK_WITH_EXTERNAL_PAIR_APART", ...base, validUnitArrangementCount, adjacentExternalPairCount });
}
function solveTwoBlocksNotAdjacent(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const blockSizes = numberArrayValue(parameters, "blockSizes");
  const base = directEvidence(totalObjects, blockSizes);
  const forbiddenAdjacentUnitCount = productExact([2, factorialExact(base.unitCount - 1, ceiling)], ceiling);
  const validUnitArrangementCount = subtractExact(base.externalArrangementCount, forbiddenAdjacentUnitCount);
  const answer = productExact([validUnitArrangementCount, base.internalArrangementMultiplier], ceiling);
  const internalPlain = blockSizes.map((size) => `${size}!`).join(" × ");
  const internalTex = blockSizes.map((size) => `${size}!`).join(" \\times ");
  return makeResult(answer, `(${base.unitCount}! - 2 × ${base.unitCount - 1}!) × ${internalPlain} = ${answer}`, `\\left(${base.unitCount}! - 2 \\times ${base.unitCount - 1}!\\right) \\times ${internalTex} = ${answer}`, { operation: "TWO_BLOCKS_TOGETHER_NOT_ADJACENT", ...base, validUnitArrangementCount, forbiddenAdjacentUnitCount });
}
function solveBlockWithOutsiderNotAdjacent(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const blockSize = numberValue(parameters, "blockSize");
  const base = directEvidence(totalObjects, [blockSize]);
  const forbiddenAdjacentUnitCount = productExact([2, factorialExact(base.unitCount - 1, ceiling)], ceiling);
  const validUnitArrangementCount = subtractExact(base.externalArrangementCount, forbiddenAdjacentUnitCount);
  const answer = productExact([validUnitArrangementCount, base.internalArrangementMultiplier], ceiling);
  return makeResult(answer, `(${base.unitCount}! - 2 × ${base.unitCount - 1}!) × ${blockSize}! = ${answer}`, `\\left(${base.unitCount}! - 2 \\times ${base.unitCount - 1}!\\right) \\times ${blockSize}! = ${answer}`, { operation: "BLOCK_WITH_OUTSIDER_NOT_ADJACENT", ...base, validUnitArrangementCount, forbiddenAdjacentUnitCount });
}
function solveOneBlockOtherBroken(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const blockSizes = numberArrayValue(parameters, "blockSizes");
  const [primarySize, otherSize] = blockSizes;
  if (primarySize === undefined || otherSize === undefined) throw new Error("Mixed block state is incomplete");
  const base = directEvidence(totalObjects, blockSizes);
  const primaryUnitCount = totalObjects - primarySize + 1;
  const primaryExternalArrangementCount = factorialExact(primaryUnitCount, ceiling);
  const primaryInternalArrangementMultiplier = factorialExact(primarySize, ceiling);
  const primaryRestrictionCount = productExact([primaryExternalArrangementCount, primaryInternalArrangementMultiplier], ceiling);
  const allSpecifiedBlocksTogetherCount = countMultipleBlocksTogetherExact(totalObjects, blockSizes, ceiling);
  const answer = subtractExact(primaryRestrictionCount, allSpecifiedBlocksTogetherCount);
  return makeResult(answer, `${primaryUnitCount}! × ${primarySize}! - (${base.unitCount}! × ${primarySize}! × ${otherSize}!) = ${answer}`, `${primaryUnitCount}! \\times ${primarySize}! - \\left(${base.unitCount}! \\times ${primarySize}! \\times ${otherSize}!\\right) = ${answer}`, { operation: "ONE_BLOCK_TOGETHER_OTHER_BROKEN", ...base, primaryUnitCount, primaryExternalArrangementCount, primaryInternalArrangementMultiplier, primaryRestrictionCount, allSpecifiedBlocksTogetherCount });
}
function solveNotAllBlocksTogether(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const blockSizes = numberArrayValue(parameters, "blockSizes");
  const base = directEvidence(totalObjects, blockSizes);
  const unrestrictedCount = factorialExact(totalObjects, ceiling);
  const allSpecifiedBlocksTogetherCount = countMultipleBlocksTogetherExact(totalObjects, blockSizes, ceiling);
  const answer = subtractExact(unrestrictedCount, allSpecifiedBlocksTogetherCount);
  const internalPlain = blockSizes.map((size) => `${size}!`).join(" × ");
  const internalTex = blockSizes.map((size) => `${size}!`).join(" \\times ");
  return makeResult(answer, `${totalObjects}! - (${base.unitCount}! × ${internalPlain}) = ${answer}`, `${totalObjects}! - \\left(${base.unitCount}! \\times ${internalTex}\\right) = ${answer}`, { operation: "NOT_ALL_BLOCKS_TOGETHER", ...base, unrestrictedCount, allSpecifiedBlocksTogetherCount });
}
function solveInverse(parameters: Pnc002Parameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const target = numberValue(parameters, "target");
  const searchMinimum = numberValue(parameters, "searchMinimum");
  const searchMaximum = numberValue(parameters, "searchMaximum");
  const matches: number[] = [];
  if (parameters.scenarioFamily === "recoverNPairTogether" || parameters.scenarioFamily === "recoverNPairApart") {
    for (let candidate = searchMinimum; candidate <= searchMaximum; candidate += 1) {
      const count = parameters.scenarioFamily === "recoverNPairTogether" ? countSingleBlockTogetherExact(candidate, 2, ceiling) : countSingleBlockNotTogetherExact(candidate, 2, ceiling);
      if (count === target) matches.push(candidate);
    }
    if (matches.length !== 1) throw new Error(`PNC-002 inverse n search found ${matches.length} matches`);
    const answer = matches[0]!;
    const together = countSingleBlockTogetherExact(answer, 2, ceiling);
    const unrestricted = factorialExact(answer, ceiling);
    const isTogether = parameters.scenarioFamily === "recoverNPairTogether";
    const equation = isTogether ? `${answer - 1}! × 2! = ${target}, so n = ${answer}` : `${answer}! - (${answer - 1}! × 2!) = ${target}, so n = ${answer}`;
    const mathJax = isTogether ? `${answer - 1}! \\times 2! = ${target},\\quad n = ${answer}` : `${answer}! - \\left(${answer - 1}! \\times 2!\\right) = ${target},\\quad n = ${answer}`;
    return makeResult(answer, equation, mathJax, { operation: "BLOCK_INVERSE", ...directEvidence(answer, [2]), target, recoveredParameter: "n", searchMinimum, searchMaximum, unrestrictedCount: unrestricted, forbiddenTogetherCount: together });
  }
  if (parameters.scenarioFamily === "recoverBlockSizeTogether") {
    const totalObjects = numberValue(parameters, "totalObjects");
    for (let candidate = searchMinimum; candidate <= searchMaximum; candidate += 1) if (countSingleBlockTogetherExact(totalObjects, candidate, ceiling) === target) matches.push(candidate);
    if (matches.length !== 1) throw new Error(`PNC-002 inverse block-size search found ${matches.length} matches`);
    const answer = matches[0]!;
    const base = directEvidence(totalObjects, [answer]);
    return makeResult(answer, `${base.unitCount}! × ${answer}! = ${target}, so k = ${answer}`, `${base.unitCount}! \\times ${answer}! = ${target},\\quad k = ${answer}`, { operation: "BLOCK_INVERSE", ...base, target, recoveredParameter: "blockSize", searchMinimum, searchMaximum });
  }
  if (parameters.scenarioFamily === "recoverNSeparatedPairBlocks") {
    for (let candidate = searchMinimum; candidate <= searchMaximum; candidate += 1) if (countTwoBlocksTogetherNotAdjacentExact(candidate, [2, 2], ceiling) === target) matches.push(candidate);
    if (matches.length !== 1) throw new Error(`PNC-002 inverse separated-block search found ${matches.length} matches`);
    const answer = matches[0]!;
    const base = directEvidence(answer, [2, 2]);
    const forbiddenAdjacentUnitCount = productExact([2, factorialExact(base.unitCount - 1, ceiling)], ceiling);
    const validUnitArrangementCount = subtractExact(base.externalArrangementCount, forbiddenAdjacentUnitCount);
    return makeResult(answer, `(${base.unitCount}! - 2 × ${base.unitCount - 1}!) × 2! × 2! = ${target}, so n = ${answer}`, `\\left(${base.unitCount}! - 2 \\times ${base.unitCount - 1}!\\right) \\times 2! \\times 2! = ${target},\\quad n = ${answer}`, { operation: "BLOCK_INVERSE", ...base, target, recoveredParameter: "n", searchMinimum, searchMaximum, validUnitArrangementCount, forbiddenAdjacentUnitCount });
  }
  throw new Error(`Unsupported PNC-002 inverse scenario ${parameters.scenarioFamily}`);
}

export function solvePnc002(parameters: Pnc002Parameters): Pnc002SolverResult {
  switch (parameters.solveMode) {
    case "countSingleBlockTogether": return solveTogether(parameters);
    case "countSingleBlockNotTogether": return solveNotTogether(parameters);
    case "countMultipleBlocksTogether": return solveMultipleBlocks(parameters);
    case "countBlockWithExternalPairApart": return solveBlockWithExternalPairApart(parameters);
    case "countTwoBlocksTogetherNotAdjacent": return solveTwoBlocksNotAdjacent(parameters);
    case "countBlockWithOutsiderNotAdjacent": return solveBlockWithOutsiderNotAdjacent(parameters);
    case "countOneBlockTogetherOtherNotTogether": return solveOneBlockOtherBroken(parameters);
    case "countNotAllSpecifiedBlocksTogether": return solveNotAllBlocksTogether(parameters);
    case "recoverBlockRestrictionParameter": return solveInverse(parameters);
  }
}

function specifiedBlocks(blockSizes: number[]): number[][] {
  let cursor = 0;
  return blockSizes.map((size) => { const block = Array.from({ length: size }, (_, index) => cursor + index); cursor += size; return block; });
}
function blockBounds(permutation: number[], block: number[]): { minimum: number; maximum: number } {
  const positions = block.map((item) => permutation.indexOf(item));
  return { minimum: Math.min(...positions), maximum: Math.max(...positions) };
}
function blockIsConsecutive(permutation: number[], block: number[]): boolean {
  const bounds = blockBounds(permutation, block);
  return bounds.maximum - bounds.minimum === block.length - 1;
}
function blocksAreAdjacent(permutation: number[], first: number[], second: number[]): boolean {
  const firstBounds = blockBounds(permutation, first);
  const secondBounds = blockBounds(permutation, second);
  return firstBounds.maximum + 1 === secondBounds.minimum || secondBounds.maximum + 1 === firstBounds.minimum;
}
function outsiderIsAdjacentToBlock(permutation: number[], block: number[], outsider: number): boolean {
  const bounds = blockBounds(permutation, block);
  const outsiderPosition = permutation.indexOf(outsider);
  return outsiderPosition === bounds.minimum - 1 || outsiderPosition === bounds.maximum + 1;
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
function enumerateDirect(parameters: Pnc002Parameters): number {
  const totalObjects = numberValue(parameters, "totalObjects");
  if (parameters.solveMode === "countSingleBlockTogether" || parameters.solveMode === "countSingleBlockNotTogether") {
    const block = specifiedBlocks([numberValue(parameters, "blockSize")])[0]!;
    return countByPermutationEnumeration(totalObjects, (permutation) => {
      const together = blockIsConsecutive(permutation, block);
      return parameters.solveMode === "countSingleBlockTogether" ? together : !together;
    });
  }
  if (parameters.solveMode === "countMultipleBlocksTogether") {
    const blocks = specifiedBlocks(numberArrayValue(parameters, "blockSizes"));
    return countByPermutationEnumeration(totalObjects, (permutation) => blocks.every((block) => blockIsConsecutive(permutation, block)));
  }
  if (parameters.solveMode === "countBlockWithExternalPairApart") {
    const blockSize = numberValue(parameters, "blockSize");
    const block = specifiedBlocks([blockSize])[0]!;
    return countByPermutationEnumeration(totalObjects, (permutation) => blockIsConsecutive(permutation, block) && Math.abs(permutation.indexOf(blockSize) - permutation.indexOf(blockSize + 1)) !== 1);
  }
  if (parameters.solveMode === "countTwoBlocksTogetherNotAdjacent") {
    const blocks = specifiedBlocks(numberArrayValue(parameters, "blockSizes"));
    return countByPermutationEnumeration(totalObjects, (permutation) => blocks.every((block) => blockIsConsecutive(permutation, block)) && !blocksAreAdjacent(permutation, blocks[0]!, blocks[1]!));
  }
  if (parameters.solveMode === "countBlockWithOutsiderNotAdjacent") {
    const blockSize = numberValue(parameters, "blockSize");
    const block = specifiedBlocks([blockSize])[0]!;
    return countByPermutationEnumeration(totalObjects, (permutation) => blockIsConsecutive(permutation, block) && !outsiderIsAdjacentToBlock(permutation, block, blockSize));
  }
  if (parameters.solveMode === "countOneBlockTogetherOtherNotTogether") {
    const blocks = specifiedBlocks(numberArrayValue(parameters, "blockSizes"));
    return countByPermutationEnumeration(totalObjects, (permutation) => blockIsConsecutive(permutation, blocks[0]!) && !blockIsConsecutive(permutation, blocks[1]!));
  }
  if (parameters.solveMode === "countNotAllSpecifiedBlocksTogether") {
    const blocks = specifiedBlocks(numberArrayValue(parameters, "blockSizes"));
    return countByPermutationEnumeration(totalObjects, (permutation) => !blocks.every((block) => blockIsConsecutive(permutation, block)));
  }
  throw new Error("Direct enumeration called for inverse PNC-002 mode");
}

export function verifyPnc002Independently(parameters: Pnc002Parameters): Pnc002IndependentVerification {
  if (parameters.solveMode !== "recoverBlockRestrictionParameter") return { supported: true, answer: enumerateDirect(parameters), method: "Exhaustive enumeration of distinct linear permutations with block and adjacency predicates" };
  const target = numberValue(parameters, "target");
  const searchMinimum = numberValue(parameters, "searchMinimum");
  const searchMaximum = numberValue(parameters, "searchMaximum");
  const matches: number[] = [];
  if (parameters.scenarioFamily === "recoverNPairTogether" || parameters.scenarioFamily === "recoverNPairApart") {
    for (let candidate = searchMinimum; candidate <= searchMaximum; candidate += 1) {
      const directParameters: Pnc002Parameters = { ...parameters, solveMode: parameters.scenarioFamily === "recoverNPairTogether" ? "countSingleBlockTogether" : "countSingleBlockNotTogether", values: { ...parameters.values, totalObjects: candidate, blockSize: 2 } };
      if (enumerateDirect(directParameters) === target) matches.push(candidate);
    }
  } else if (parameters.scenarioFamily === "recoverBlockSizeTogether") {
    const totalObjects = numberValue(parameters, "totalObjects");
    for (let candidate = searchMinimum; candidate <= searchMaximum; candidate += 1) {
      const directParameters: Pnc002Parameters = { ...parameters, solveMode: "countSingleBlockTogether", values: { ...parameters.values, totalObjects, blockSize: candidate } };
      if (enumerateDirect(directParameters) === target) matches.push(candidate);
    }
  } else if (parameters.scenarioFamily === "recoverNSeparatedPairBlocks") {
    for (let candidate = searchMinimum; candidate <= searchMaximum; candidate += 1) {
      const directParameters: Pnc002Parameters = { ...parameters, solveMode: "countTwoBlocksTogetherNotAdjacent", values: { ...parameters.values, totalObjects: candidate, blockSizes: [2, 2] } };
      if (enumerateDirect(directParameters) === target) matches.push(candidate);
    }
  }
  return { supported: matches.length === 1, answer: matches[0] ?? -1, method: "Bounded search using exhaustive permutation enumeration for every candidate parameter" };
}
