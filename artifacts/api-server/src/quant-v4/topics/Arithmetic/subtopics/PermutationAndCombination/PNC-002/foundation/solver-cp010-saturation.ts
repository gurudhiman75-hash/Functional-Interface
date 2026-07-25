import { combinationExact, divideExact, factorialExact, productExact, subtractExact } from "./math";
import { getPnc002VariableRanges } from "./library";
import type {
  Pnc002AnyParameters,
  Pnc002IndependentVerification,
  Pnc002SolverEvidence,
  Pnc002SolverResult,
} from "./types";

const SATURATION_QL_IDS = new Set(["PNC-QL-204", "PNC-QL-205", "PNC-QL-206", "PNC-QL-207", "PNC-QL-208"]);

export function isPnc002Cp010SaturationQlId(qlId: string): boolean {
  return SATURATION_QL_IDS.has(qlId);
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
export function countCircularSelectionRotationOnlyExact(
  totalObjects: number,
  selectedObjects: number,
  ceiling = Number.MAX_SAFE_INTEGER,
): number {
  if (selectedObjects < 3 || selectedObjects >= totalObjects) throw new Error("Circular subset size must satisfy 3 <= r < n");
  return productExact([
    combinationExact(totalObjects, selectedObjects, ceiling),
    factorialExact(selectedObjects - 1, ceiling),
  ], ceiling);
}
export function countCircularSelectionDihedralExact(
  totalObjects: number,
  selectedObjects: number,
  ceiling = Number.MAX_SAFE_INTEGER,
): number {
  return divideExact(countCircularSelectionRotationOnlyExact(totalObjects, selectedObjects, ceiling), 2);
}
export function countCircularDistinctNeighborSetsExact(
  totalObjects: number,
  ceiling = Number.MAX_SAFE_INTEGER,
): number {
  if (totalObjects < 3) throw new Error("Distinct neighbour-set counting requires at least three people");
  return divideExact(roundTable(totalObjects, ceiling), 2);
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
function selectionEvidence(
  totalObjects: number,
  selectedObjects: number,
  operation: Pnc002SolverEvidence["operation"],
  reflectionSymmetryDivisor: 1 | 2,
  ceiling: number,
): Pnc002SolverEvidence {
  const selectionCount = combinationExact(totalObjects, selectedObjects, ceiling);
  const selectedCircularArrangementCount = factorialExact(selectedObjects - 1, ceiling);
  return {
    operation,
    totalObjects,
    blockSizes: [],
    groupedObjectCount: 0,
    blockCount: 0,
    unitCount: selectedObjects,
    circularUnitCount: selectedObjects,
    externalArrangementCount: productExact([selectionCount, selectedCircularArrangementCount], ceiling),
    internalArrangementCounts: [],
    internalArrangementMultiplier: 1,
    rotationalSymmetryDivisor: selectedObjects,
    reflectionSymmetryDivisor,
    selectedObjectCount: selectedObjects,
    selectionCount,
    selectedCircularArrangementCount,
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
  if (parameters.questionLanguageId === "PNC-QL-205") {
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
  if (parameters.questionLanguageId === "PNC-QL-206" || parameters.questionLanguageId === "PNC-QL-207") {
    const selectedObjects = numberValue(parameters, "selectedObjects");
    const selectionCount = combinationExact(totalObjects, selectedObjects, ceiling);
    const circularOrders = factorialExact(selectedObjects - 1, ceiling);
    if (parameters.questionLanguageId === "PNC-QL-206") {
      const answer = countCircularSelectionRotationOnlyExact(totalObjects, selectedObjects, ceiling);
      return result(
        answer,
        `${selectionCount} × (${selectedObjects} - 1)! = ${answer}`,
        `\\binom{${totalObjects}}{${selectedObjects}} \\times (${selectedObjects} - 1)! = ${answer}`,
        selectionEvidence(totalObjects, selectedObjects, "CIRCULAR_SELECTION_ROTATION_ONLY", 1, ceiling),
      );
    }
    const answer = countCircularSelectionDihedralExact(totalObjects, selectedObjects, ceiling);
    return result(
      answer,
      `${selectionCount} × (${selectedObjects} - 1)! ÷ 2 = ${answer}`,
      `\\frac{\\binom{${totalObjects}}{${selectedObjects}} \\times (${selectedObjects} - 1)!}{2} = ${answer}`,
      {
        ...selectionEvidence(totalObjects, selectedObjects, "CIRCULAR_SELECTION_DIHEDRAL", 2, ceiling),
        externalArrangementCount: divideExact(productExact([selectionCount, circularOrders], ceiling), 2),
      },
    );
  }
  const unrestricted = roundTable(totalObjects, ceiling);
  const answer = countCircularDistinctNeighborSetsExact(totalObjects, ceiling);
  return result(answer, `${unrestricted} ÷ 2 = ${answer}`, `\\frac{(${totalObjects} - 1)!}{2} = ${answer}`, {
    ...evidenceBase(totalObjects, "CIRCULAR_DISTINCT_NEIGHBOR_SETS"),
    reflectionSymmetryDivisor: 2,
    externalArrangementCount: answer,
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
function enumerateSubsets(totalObjects: number, selectedObjects: number): number[][] {
  const subsets: number[][] = [];
  const current: number[] = [];
  const visit = (next: number): void => {
    if (current.length === selectedObjects) {
      subsets.push([...current]);
      return;
    }
    const needed = selectedObjects - current.length;
    for (let value = next; value <= totalObjects - needed; value += 1) {
      current.push(value);
      visit(value + 1);
      current.pop();
    }
  };
  visit(0);
  return subsets;
}
function countSelectedCircularCycles(totalObjects: number, selectedObjects: number, identifyReflection: boolean): number {
  const representatives = new Set<string>();
  let count = 0;
  for (const subset of enumerateSubsets(totalObjects, selectedObjects)) {
    const anchor = subset[0];
    const remaining = subset.slice(1);
    const order = Array.from({ length: selectedObjects }, () => -1);
    const used = Array.from({ length: remaining.length }, () => false);
    order[0] = anchor;
    const visit = (position: number): void => {
      if (position === selectedObjects) {
        if (!identifyReflection) {
          count += 1;
          return;
        }
        const forward = order.join("-");
        const reverse = [anchor, ...order.slice(1).reverse()].join("-");
        representatives.add(forward < reverse ? forward : reverse);
        return;
      }
      for (let index = 0; index < remaining.length; index += 1) {
        if (used[index]) continue;
        used[index] = true;
        order[position] = remaining[index];
        visit(position + 1);
        used[index] = false;
      }
    };
    visit(1);
  }
  return identifyReflection ? representatives.size : count;
}

export function verifyPnc002Cp010SaturationIndependently(
  parameters: Pnc002AnyParameters,
): Pnc002IndependentVerification {
  const totalObjects = numberValue(parameters, "totalObjects");
  if (parameters.questionLanguageId === "PNC-QL-206" || parameters.questionLanguageId === "PNC-QL-207") {
    const selectedObjects = numberValue(parameters, "selectedObjects");
    const identifyReflection = parameters.questionLanguageId === "PNC-QL-207";
    return {
      supported: true,
      answer: countSelectedCircularCycles(totalObjects, selectedObjects, identifyReflection),
      method: identifyReflection
        ? "Exhaustive subset selection and canonical rotation-plus-reflection cycle enumeration"
        : "Exhaustive subset selection and reference-fixed rotation-only cycle enumeration",
    };
  }
  if (parameters.questionLanguageId === "PNC-QL-208") {
    return {
      supported: true,
      answer: countSelectedCircularCycles(totalObjects, totalObjects, true),
      method: "Exhaustive reference-fixed seating enumeration with reversed cycles merged by identical neighbour sets",
    };
  }
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
