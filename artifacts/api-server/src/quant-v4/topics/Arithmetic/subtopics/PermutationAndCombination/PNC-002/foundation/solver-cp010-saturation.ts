import { factorialExact, productExact, subtractExact } from "./math";
import { getPnc002VariableRanges } from "./library";
import type {
  Pnc002AnyParameters,
  Pnc002IndependentVerification,
  Pnc002SolverEvidence,
  Pnc002SolverResult,
} from "./types";

export function isPnc002Cp010SaturationQlId(qlId: string): boolean {
  return qlId === "PNC-QL-204" || qlId === "PNC-QL-205";
}

function numberValue(parameters: Pnc002AnyParameters, key: string): number {
  const value = parameters.values[key];
  if (typeof value !== "number") throw new Error(`PNC-002 CP-010 saturation value ${key} is not numeric`);
  return value;
}

function roundTable(totalObjects: number, ceiling: number): number {
  return factorialExact(totalObjects - 1, ceiling);
}
function circularBlockTogether(totalObjects: number, blockSize: number, ceiling: number): number {
  return productExact([factorialExact(totalObjects - blockSize, ceiling), factorialExact(blockSize, ceiling)], ceiling);
}
function twoPairsTogether(totalObjects: number, ceiling: number): number {
  return productExact([factorialExact(totalObjects - 3, ceiling), 4], ceiling);
}
export function countCircularExactlyOnePairTogetherExact(
  totalObjects: number,
  ceiling = Number.MAX_SAFE_INTEGER,
): number {
  const onePair = circularBlockTogether(totalObjects, 2, ceiling);
  const bothPairs = twoPairsTogether(totalObjects, ceiling);
  return productExact([2, subtractExact(onePair, bothPairs)], ceiling);
}

function evidenceBase(totalObjects: number, operation: Pnc002SolverEvidence["operation"]): Pnc002SolverEvidence {
  const unrestrictedCount = roundTable(totalObjects, getPnc002VariableRanges().answerCeiling);
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
function result(answer: number, equation: string, mathJax: string, evidence: Pnc002SolverEvidence): Pnc002SolverResult {
  return { exactAnswer: String(answer), answer: String(answer), numericAnswer: answer, equation, mathJax, evidence };
}

export function solvePnc002Cp010Saturation(parameters: Pnc002AnyParameters): Pnc002SolverResult {
  if (!isPnc002Cp010SaturationQlId(parameters.questionLanguageId)) {
    throw new Error(`CP-010 saturation solver received ${parameters.questionLanguageId}`);
  }
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  if (parameters.questionLanguageId === "PNC-QL-204") {
    const blockSize = numberValue(parameters, "blockSize");
    const unrestricted = roundTable(totalObjects, ceiling);
    const together = circularBlockTogether(totalObjects, blockSize, ceiling);
    const answer = subtractExact(unrestricted, together);
    return result(answer, `${unrestricted} - ${together} = ${answer}`, `${unrestricted} - ${together} = ${answer}`, {
      ...evidenceBase(totalObjects, "CIRCULAR_BLOCK_APART"),
      blockSizes: [blockSize],
      groupedObjectCount: blockSize,
      blockCount: 1,
      forbiddenTogetherCount: together,
    });
  }

  const onePair = circularBlockTogether(totalObjects, 2, ceiling);
  const bothPairs = twoPairsTogether(totalObjects, ceiling);
  const oneExclusiveCase = subtractExact(onePair, bothPairs);
  const answer = productExact([2, oneExclusiveCase], ceiling);
  return result(answer, `2 × (${onePair} - ${bothPairs}) = ${answer}`, `2 \\times \\left(${onePair} - ${bothPairs}\\right) = ${answer}`, {
    ...evidenceBase(totalObjects, "CIRCULAR_EXACTLY_ONE_PAIR"),
    blockSizes: [2, 2],
    groupedObjectCount: 4,
    blockCount: 2,
    primaryRestrictionCount: onePair,
    allSpecifiedBlocksTogetherCount: bothPairs,
  });
}

function positions(arrangement: number[]): number[] {
  const result = Array.from({ length: arrangement.length }, () => -1);
  arrangement.forEach((person, position) => { result[person] = position; });
  return result;
}
function adjacent(pos: number[], first: number, second: number): boolean {
  const distance = Math.abs(pos[first] - pos[second]);
  return distance === 1 || distance === pos.length - 1;
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
function countAnchored(totalObjects: number, predicate: (arrangement: number[]) => boolean): number {
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

export function verifyPnc002Cp010SaturationIndependently(
  parameters: Pnc002AnyParameters,
): Pnc002IndependentVerification {
  const totalObjects = numberValue(parameters, "totalObjects");
  const answer = countAnchored(totalObjects, (arrangement) => {
    const pos = positions(arrangement);
    if (parameters.questionLanguageId === "PNC-QL-204") {
      const blockSize = numberValue(parameters, "blockSize");
      return !blockConsecutive(pos, Array.from({ length: blockSize }, (_, index) => index));
    }
    return adjacent(pos, 0, 1) !== adjacent(pos, 2, 3);
  });
  return {
    supported: true,
    answer,
    method: "Exhaustive rotation-normalized circular enumeration with direct block and exclusive-pair predicates",
  };
}
