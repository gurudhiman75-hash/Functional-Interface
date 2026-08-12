import {
  generateNumCp001Wave01Package as generateBasePackage,
  generateNumCp001Wave01Sweep as generateBaseSweep,
  NUM_CP001_WAVE01_PROTOTYPE_IDS,
} from "./runtime";
import type {
  NumCp001Option,
  NumCp001Wave01Package,
  NumCp001Wave01PrototypeId,
} from "./types";

export { NUM_CP001_WAVE01_PROTOTYPE_IDS } from "./runtime";

const LEARNER_TRAP_TEXT: Record<string, string> = {
  ORDER_REVERSED: "ascending and descending order were interchanged",
  NEGATIVE_ORDER_REVERSED: "the negative numbers were put in the wrong signed order",
  MISPLACED_NEGATIVE_VALUE: "a negative value was placed after a positive value",
  POSITIVE_ORDER_SWAP: "the final positive values were put in the wrong order",
  EVEN_PLUS_EVEN_RULE_CONFUSED: "the sum of two even integers was incorrectly treated as odd",
  ODD_PAIR_SUM_DIFFERENCE_RULE_CONFUSED: "the sum or difference of two odd integers was incorrectly treated as odd",
  EVEN_FACTOR_PRODUCT_RULE_IGNORED: "the even factor in the product was ignored",
  EVEN_POWER_RULE_IGNORED: "a power with an even integer base was incorrectly treated as odd",
};

function parseOrderedList(value: string): number[] {
  return value.split("<").map((part) => Number(part.trim()));
}

function sameNumbers(first: readonly number[], second: readonly number[]): boolean {
  if (first.length !== second.length) return false;
  const a = [...first].sort((x, y) => x - y);
  const b = [...second].sort((x, y) => x - y);
  return a.every((value, index) => value === b[index]);
}

function orderingMisconception(optionValue: string, pkg: NumCp001Wave01Package): string {
  const correct = parseOrderedList(pkg.canonicalAnswer);
  const candidate = parseOrderedList(optionValue);
  if (!sameNumbers(correct, candidate)) return "ORDER_REVERSED";
  if (candidate.every((value, index) => value === [...correct].reverse()[index])) return "ORDER_REVERSED";

  const tier = Number(pkg.hiddenState.tier);
  if (tier === 0 && candidate[0]! >= 0) return "MISPLACED_NEGATIVE_VALUE";

  const firstMismatch = candidate.findIndex((value, index) => value !== correct[index]);
  if (firstMismatch >= 0 && correct[firstMismatch]! < 0) return "NEGATIVE_ORDER_REVERSED";
  return "POSITIVE_ORDER_SWAP";
}

function parityExpressionMisconception(expression: string): string {
  const powerMatch = expression.match(/^(-?\d+)([²³])$/);
  if (powerMatch) {
    const base = Number(powerMatch[1]);
    if (base % 2 === 0) return "EVEN_POWER_RULE_IGNORED";
  }

  if (expression.includes(" × ")) {
    const [left, right] = expression.split(" × ").map(Number);
    if (left! % 2 === 0 || right! % 2 === 0) return "EVEN_FACTOR_PRODUCT_RULE_IGNORED";
  }

  if (expression.includes(" + ")) {
    const [left, right] = expression.split(" + ").map(Number);
    if (left! % 2 === 0 && right! % 2 === 0) return "EVEN_PLUS_EVEN_RULE_CONFUSED";
    if (Math.abs(left!) % 2 === 1 && Math.abs(right!) % 2 === 1) return "ODD_PAIR_SUM_DIFFERENCE_RULE_CONFUSED";
  }

  if (expression.includes(" - ")) {
    const [left, right] = expression.split(" - ").map(Number);
    if (Math.abs(left!) % 2 === 1 && Math.abs(right!) % 2 === 1) return "ODD_PAIR_SUM_DIFFERENCE_RULE_CONFUSED";
  }

  throw new Error(`No misconception mapping for even-valued parity distractor: ${expression}`);
}

function learnerTrapLine(option: NumCp001Option): string {
  const id = option.misconceptionId;
  if (!id) throw new Error(`Missing misconception ID for option ${option.value}`);
  const text = LEARNER_TRAP_TEXT[id];
  if (!text) throw new Error(`Missing learner trap text for authority-owned misconception ${id}`);
  return `Choosing “${option.value}” usually means ${text}.`;
}

function editorializeOrdering(pkg: NumCp001Wave01Package): NumCp001Wave01Package {
  const options = pkg.options.map((option) => option.isCorrect
    ? option
    : { ...option, misconceptionId: orderingMisconception(option.value, pkg) });
  return {
    ...pkg,
    options,
    explanation: {
      ...pkg.explanation,
      commonTraps: options.filter((option) => !option.isCorrect).map(learnerTrapLine),
    },
  };
}

function editorializeDistance(pkg: NumCp001Wave01Package): NumCp001Wave01Package {
  const crossesZero = Boolean(pkg.hiddenState.crossesZero);
  const first = Number(pkg.hiddenState.first);
  const second = Number(pkg.hiddenState.second);
  const speedMethod = crossesZero
    ? `The points are on opposite sides of zero, so add their distances from zero: ${Math.abs(first)} + ${Math.abs(second)}.`
    : "The points are on the same side of zero, so take the positive difference between their coordinates.";
  return {
    ...pkg,
    explanation: {
      ...pkg.explanation,
      examSpeedMethod: [speedMethod],
    },
  };
}

function editorializeParityExpressions(pkg: NumCp001Wave01Package): NumCp001Wave01Package {
  const options = pkg.options.map((option) => option.isCorrect
    ? option
    : { ...option, misconceptionId: parityExpressionMisconception(option.value) });
  return {
    ...pkg,
    options,
    explanation: {
      ...pkg.explanation,
      commonTraps: options.filter((option) => !option.isCorrect).map(learnerTrapLine),
    },
  };
}

function editorialize(pkg: NumCp001Wave01Package): NumCp001Wave01Package {
  switch (pkg.temporaryPrototypeId) {
    case "NUM-CP001-PROT-003": return editorializeOrdering(pkg);
    case "NUM-CP001-PROT-004": return editorializeDistance(pkg);
    case "NUM-CP001-PROT-006": return editorializeParityExpressions(pkg);
    default: return pkg;
  }
}

export function generateNumCp001Wave01Package(
  prototypeId: NumCp001Wave01PrototypeId,
  seed: number,
): NumCp001Wave01Package {
  return editorialize(generateBasePackage(prototypeId, seed));
}

export function generateNumCp001Wave01Sweep(seedsPerPrototype: number): NumCp001Wave01Package[] {
  return generateBaseSweep(seedsPerPrototype).map(editorialize);
}