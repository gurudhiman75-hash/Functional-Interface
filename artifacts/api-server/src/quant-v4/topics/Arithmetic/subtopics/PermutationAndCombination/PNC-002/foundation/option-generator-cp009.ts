import {
  combinationExact,
  createSeededRandom,
  shuffleSeeded,
} from "./math";
import type { Pnc002AnyParameters, Pnc002SolverResult } from "./types";

function numberValue(parameters: Pnc002AnyParameters, key: string): number {
  const value = parameters.values[key];
  return typeof value === "number" ? value : 0;
}
function choose(n: number, r: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) return 0;
  return combinationExact(n, r);
}
function uniquePositive(values: number[], correct: number): number[] {
  return [...new Set(values.filter((value) => Number.isInteger(value) && value > 0 && value !== correct))];
}

export function buildPnc002Cp009Options(
  parameters: Pnc002AnyParameters,
  solver: Pnc002SolverResult,
): { options: string[]; correctIndex: number } {
  const correct = solver.numericAnswer;
  const e = solver.evidence;
  const totalObjects = e.totalObjects;
  const committeeSize = e.committeeSize ?? numberValue(parameters, "committeeSize");
  const unrestricted = choose(totalObjects, committeeSize);
  let distractors: number[];

  switch (parameters.solveMode) {
    case "countWithCompulsoryMembers": {
      const compulsory = e.compulsoryCount ?? 1;
      distractors = uniquePositive([
        unrestricted,
        choose(totalObjects - compulsory, committeeSize),
        choose(totalObjects, committeeSize - compulsory),
        choose(totalObjects - 1, committeeSize),
      ], correct);
      break;
    }
    case "countWithExcludedMembers": {
      const excluded = e.excludedCount ?? 1;
      distractors = uniquePositive([
        unrestricted,
        choose(totalObjects - excluded, committeeSize - excluded),
        choose(totalObjects - excluded, committeeSize - 1),
        choose(totalObjects, committeeSize - excluded),
      ], correct);
      break;
    }
    case "countWithCompulsoryAndExcludedMembers":
      distractors = uniquePositive([
        unrestricted,
        choose(totalObjects - 2, committeeSize),
        choose(totalObjects - 1, committeeSize - 1),
        choose(totalObjects - 1, committeeSize),
      ], correct);
      break;
    case "countExactlyFromTwoCategories":
    case "countNamedCompulsoryWithCategoryQuota":
    case "countNamedExcludedWithCategoryQuota": {
      const [categoryA = 0, categoryB = 0] = e.categorySizes ?? [];
      const requiredFromA = e.requiredFromA ?? numberValue(parameters, "requiredFromA");
      const requiredFromB = committeeSize - requiredFromA;
      distractors = uniquePositive([
        choose(categoryA, requiredFromA),
        choose(categoryB, requiredFromB),
        choose(categoryA, requiredFromA) + choose(categoryB, requiredFromB),
        unrestricted,
      ], correct);
      break;
    }
    case "countAtLeastFromTwoCategories":
    case "countAtMostFromTwoCategories":
    case "countAtMostTSpecifiedMembers":
    case "countAtLeastOneFromEachOfThreeCategories": {
      const cases = e.selectionCaseCounts ?? [];
      distractors = uniquePositive([
        cases[0] ?? 0,
        cases.at(-1) ?? 0,
        unrestricted,
        (e.acceptedSelectionCounts ?? []).reduce((sum, value) => sum + value, 0),
      ], correct);
      break;
    }
    case "countAtLeastOneFromCategory":
    case "countAtLeastOneSpecifiedMember":
    case "countNotAllSpecifiedMembersTogether":
    case "countImplicationBetweenSpecifiedMembers":
      distractors = uniquePositive([
        unrestricted,
        e.forbiddenCount ?? 0,
        unrestricted + (e.forbiddenCount ?? 0),
        Math.max(1, unrestricted - 2 * (e.forbiddenCount ?? 0)),
      ], correct);
      break;
    case "countAtLeastOneFromEachOfTwoCategories": {
      const [categoryA = 0, categoryB = 0] = e.categorySizes ?? [];
      distractors = uniquePositive([
        unrestricted,
        choose(categoryA, committeeSize) + choose(categoryB, committeeSize),
        unrestricted - choose(categoryA, committeeSize),
        unrestricted - choose(categoryB, committeeSize),
      ], correct);
      break;
    }
    case "countExactThreeCategoryDistribution": {
      const sizes = e.categorySizes ?? [];
      const required = e.requiredCategoryCounts ?? [];
      const factors = sizes.map((size, index) => choose(size, required[index] ?? 0));
      distractors = uniquePositive([
        factors.reduce((sum, value) => sum + value, 0),
        (factors[0] ?? 1) * (factors[1] ?? 1),
        (factors[1] ?? 1) * (factors[2] ?? 1),
        unrestricted,
      ], correct);
      break;
    }
    case "countExactlyTSpecifiedMembers": {
      const specified = e.specifiedCount ?? numberValue(parameters, "specifiedCount");
      const required = e.requiredSpecified ?? numberValue(parameters, "requiredSpecified");
      const ordinary = totalObjects - specified;
      distractors = uniquePositive([
        choose(specified, required),
        choose(ordinary, committeeSize - required),
        choose(specified, required) + choose(ordinary, committeeSize - required),
        unrestricted,
      ], correct);
      break;
    }
    case "countAllOrNoneSpecifiedMembers": {
      const cases = e.selectionCaseCounts ?? [];
      distractors = uniquePositive([
        cases[0] ?? 0,
        cases[1] ?? 0,
        unrestricted,
        Math.abs((cases[0] ?? 0) - (cases[1] ?? 0)),
      ], correct);
      break;
    }
    case "recoverConditionalSelectionParameter":
      distractors = uniquePositive([
        correct - 2,
        correct - 1,
        correct + 1,
        correct + 2,
      ], correct);
      break;
    default:
      distractors = uniquePositive([
        unrestricted,
        e.forbiddenCount ?? 0,
        (e.selectionCaseCounts ?? [])[0] ?? 0,
        correct + 1,
      ], correct);
  }

  for (let offset = 1; distractors.length < 3; offset += 1) {
    for (const candidate of [correct - offset, correct + offset]) {
      if (candidate > 0 && candidate !== correct && !distractors.includes(candidate)) distractors.push(candidate);
      if (distractors.length >= 3) break;
    }
  }

  const numericOptions = shuffleSeeded(
    [correct, ...distractors.slice(0, 3)],
    createSeededRandom(`${parameters.seed}:${parameters.questionLanguageId}:cp009-options`),
  );
  return { options: numericOptions.map(String), correctIndex: numericOptions.indexOf(correct) };
}
