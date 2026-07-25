import {
  combinationExact,
  productExact,
  subtractExact,
  sumExact,
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
  if (typeof value !== "number") throw new Error(`PNC-002 CP-009 value ${key} is not numeric`);
  return value;
}
function choose(n: number, r: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) return 0;
  return combinationExact(n, r, ceiling);
}
function binomialPlain(n: number, r: number): string { return `${n}C${r}`; }
function binomialTex(n: number, r: number): string { return `\\binom{${n}}{${r}}`; }
function selectionEvidence(totalObjects: number, committeeSize: number): Pnc002SolverEvidence {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const unrestrictedCount = choose(totalObjects, committeeSize, ceiling);
  return {
    operation: "COMPULSORY_MEMBERS",
    totalObjects,
    blockSizes: [],
    groupedObjectCount: 0,
    blockCount: 0,
    unitCount: totalObjects,
    externalArrangementCount: unrestrictedCount,
    internalArrangementCounts: [],
    internalArrangementMultiplier: 1,
    committeeSize,
    unrestrictedCount,
  };
}
function result(answer: number, equation: string, mathJax: string, evidence: Pnc002SolverEvidence): Pnc002SolverResult {
  return { exactAnswer: String(answer), answer: String(answer), numericAnswer: answer, equation, mathJax, evidence };
}

export function countWithCompulsoryMembersExact(totalObjects: number, committeeSize: number, compulsoryCount: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return choose(totalObjects - compulsoryCount, committeeSize - compulsoryCount, ceiling);
}
export function countWithExcludedMembersExact(totalObjects: number, committeeSize: number, excludedCount: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return choose(totalObjects - excludedCount, committeeSize, ceiling);
}
export function countWithCompulsoryAndExcludedMembersExact(totalObjects: number, committeeSize: number, compulsoryCount: number, excludedCount: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return choose(totalObjects - compulsoryCount - excludedCount, committeeSize - compulsoryCount, ceiling);
}
export function countExactlyFromTwoCategoriesExact(categoryA: number, categoryB: number, committeeSize: number, requiredFromA: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return productExact([
    choose(categoryA, requiredFromA, ceiling),
    choose(categoryB, committeeSize - requiredFromA, ceiling),
  ], ceiling);
}
export function countAtLeastFromTwoCategoriesExact(categoryA: number, categoryB: number, committeeSize: number, minimumFromA: number, ceiling = Number.MAX_SAFE_INTEGER): { answer: number; acceptedCounts: number[]; caseCounts: number[] } {
  const lower = Math.max(minimumFromA, committeeSize - categoryB, 0);
  const upper = Math.min(categoryA, committeeSize);
  const acceptedCounts: number[] = [];
  const caseCounts: number[] = [];
  for (let selectedA = lower; selectedA <= upper; selectedA += 1) {
    acceptedCounts.push(selectedA);
    caseCounts.push(countExactlyFromTwoCategoriesExact(categoryA, categoryB, committeeSize, selectedA, ceiling));
  }
  return { answer: sumExact(caseCounts, ceiling), acceptedCounts, caseCounts };
}
export function countAtMostFromTwoCategoriesExact(categoryA: number, categoryB: number, committeeSize: number, maximumFromA: number, ceiling = Number.MAX_SAFE_INTEGER): { answer: number; acceptedCounts: number[]; caseCounts: number[] } {
  const lower = Math.max(0, committeeSize - categoryB);
  const upper = Math.min(maximumFromA, categoryA, committeeSize);
  const acceptedCounts: number[] = [];
  const caseCounts: number[] = [];
  for (let selectedA = lower; selectedA <= upper; selectedA += 1) {
    acceptedCounts.push(selectedA);
    caseCounts.push(countExactlyFromTwoCategoriesExact(categoryA, categoryB, committeeSize, selectedA, ceiling));
  }
  return { answer: sumExact(caseCounts, ceiling), acceptedCounts, caseCounts };
}
export function countAtLeastOneFromCategoryExact(categoryA: number, categoryB: number, committeeSize: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return subtractExact(choose(categoryA + categoryB, committeeSize, ceiling), choose(categoryB, committeeSize, ceiling));
}
export function countAtLeastOneFromEachOfTwoCategoriesExact(categoryA: number, categoryB: number, committeeSize: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  const total = choose(categoryA + categoryB, committeeSize, ceiling);
  return subtractExact(subtractExact(total, choose(categoryA, committeeSize, ceiling)), choose(categoryB, committeeSize, ceiling));
}
export function countExactThreeCategoryDistributionExact(categorySizes: number[], requiredCounts: number[], ceiling = Number.MAX_SAFE_INTEGER): number {
  if (categorySizes.length !== 3 || requiredCounts.length !== 3) throw new Error("Three-category exact mode requires three categories");
  return productExact(categorySizes.map((size, index) => choose(size, requiredCounts[index] ?? -1, ceiling)), ceiling);
}
export function countAtLeastOneFromEachOfThreeCategoriesExact(categorySizes: number[], committeeSize: number, ceiling = Number.MAX_SAFE_INTEGER): { answer: number; caseCounts: number[]; distributionCount: number } {
  if (categorySizes.length !== 3) throw new Error("Three-category at-least mode requires three categories");
  const [categoryA, categoryB, categoryC] = categorySizes;
  if (categoryA === undefined || categoryB === undefined || categoryC === undefined) throw new Error("Three-category state is incomplete");
  const caseCounts: number[] = [];
  let distributionCount = 0;
  for (let selectedA = 1; selectedA <= Math.min(categoryA, committeeSize - 2); selectedA += 1) {
    for (let selectedB = 1; selectedB <= Math.min(categoryB, committeeSize - selectedA - 1); selectedB += 1) {
      const selectedC = committeeSize - selectedA - selectedB;
      if (selectedC < 1 || selectedC > categoryC) continue;
      caseCounts.push(productExact([
        choose(categoryA, selectedA, ceiling),
        choose(categoryB, selectedB, ceiling),
        choose(categoryC, selectedC, ceiling),
      ], ceiling));
      distributionCount += 1;
    }
  }
  return { answer: sumExact(caseCounts, ceiling), caseCounts, distributionCount };
}
export function countExactlyTSpecifiedMembersExact(totalObjects: number, committeeSize: number, specifiedCount: number, requiredSpecified: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return productExact([
    choose(specifiedCount, requiredSpecified, ceiling),
    choose(totalObjects - specifiedCount, committeeSize - requiredSpecified, ceiling),
  ], ceiling);
}
export function countAtLeastOneSpecifiedMemberExact(totalObjects: number, committeeSize: number, specifiedCount: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return subtractExact(choose(totalObjects, committeeSize, ceiling), choose(totalObjects - specifiedCount, committeeSize, ceiling));
}
export function countNotAllSpecifiedMembersTogetherExact(totalObjects: number, committeeSize: number, specifiedCount: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return subtractExact(choose(totalObjects, committeeSize, ceiling), choose(totalObjects - specifiedCount, committeeSize - specifiedCount, ceiling));
}
export function countAllOrNoneSpecifiedMembersExact(totalObjects: number, committeeSize: number, specifiedCount: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return sumExact([
    choose(totalObjects - specifiedCount, committeeSize - specifiedCount, ceiling),
    choose(totalObjects - specifiedCount, committeeSize, ceiling),
  ], ceiling);
}
export function countImplicationBetweenSpecifiedMembersExact(totalObjects: number, committeeSize: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  const total = choose(totalObjects, committeeSize, ceiling);
  const forbiddenBWithoutA = choose(totalObjects - 2, committeeSize - 1, ceiling);
  return subtractExact(total, forbiddenBWithoutA);
}
export function countAtMostTSpecifiedMembersExact(totalObjects: number, committeeSize: number, specifiedCount: number, maximumSpecified: number, ceiling = Number.MAX_SAFE_INTEGER): { answer: number; acceptedCounts: number[]; caseCounts: number[] } {
  const lower = Math.max(0, committeeSize - (totalObjects - specifiedCount));
  const upper = Math.min(maximumSpecified, specifiedCount, committeeSize);
  const acceptedCounts: number[] = [];
  const caseCounts: number[] = [];
  for (let selected = lower; selected <= upper; selected += 1) {
    acceptedCounts.push(selected);
    caseCounts.push(countExactlyTSpecifiedMembersExact(totalObjects, committeeSize, specifiedCount, selected, ceiling));
  }
  return { answer: sumExact(caseCounts, ceiling), acceptedCounts, caseCounts };
}
export function countNamedCompulsoryWithCategoryQuotaExact(categoryA: number, categoryB: number, committeeSize: number, requiredFromA: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return productExact([
    choose(categoryA - 1, requiredFromA - 1, ceiling),
    choose(categoryB, committeeSize - requiredFromA, ceiling),
  ], ceiling);
}
export function countNamedExcludedWithCategoryQuotaExact(categoryA: number, categoryB: number, committeeSize: number, requiredFromA: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  return productExact([
    choose(categoryA - 1, requiredFromA, ceiling),
    choose(categoryB, committeeSize - requiredFromA, ceiling),
  ], ceiling);
}

function solveDirect(parameters: Pnc002AnyParameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const committeeSize = numberValue(parameters, "committeeSize");
  const base = selectionEvidence(totalObjects, committeeSize);
  switch (parameters.solveMode) {
    case "countWithCompulsoryMembers": {
      const compulsoryCount = numberValue(parameters, "compulsoryCount");
      const remainingEligibleCount = totalObjects - compulsoryCount;
      const remainingSelectionCount = committeeSize - compulsoryCount;
      const answer = countWithCompulsoryMembersExact(totalObjects, committeeSize, compulsoryCount, ceiling);
      return result(answer, `${binomialPlain(remainingEligibleCount, remainingSelectionCount)} = ${answer}`, `${binomialTex(remainingEligibleCount, remainingSelectionCount)} = ${answer}`, { ...base, operation: "COMPULSORY_MEMBERS", compulsoryCount, remainingEligibleCount, remainingSelectionCount });
    }
    case "countWithExcludedMembers": {
      const excludedCount = numberValue(parameters, "excludedCount");
      const remainingEligibleCount = totalObjects - excludedCount;
      const answer = countWithExcludedMembersExact(totalObjects, committeeSize, excludedCount, ceiling);
      return result(answer, `${binomialPlain(remainingEligibleCount, committeeSize)} = ${answer}`, `${binomialTex(remainingEligibleCount, committeeSize)} = ${answer}`, { ...base, operation: "EXCLUDED_MEMBERS", excludedCount, remainingEligibleCount, remainingSelectionCount: committeeSize });
    }
    case "countWithCompulsoryAndExcludedMembers": {
      const compulsoryCount = numberValue(parameters, "compulsoryCount");
      const excludedCount = numberValue(parameters, "excludedCount");
      const remainingEligibleCount = totalObjects - compulsoryCount - excludedCount;
      const remainingSelectionCount = committeeSize - compulsoryCount;
      const answer = countWithCompulsoryAndExcludedMembersExact(totalObjects, committeeSize, compulsoryCount, excludedCount, ceiling);
      return result(answer, `${binomialPlain(remainingEligibleCount, remainingSelectionCount)} = ${answer}`, `${binomialTex(remainingEligibleCount, remainingSelectionCount)} = ${answer}`, { ...base, operation: "COMPULSORY_AND_EXCLUDED", compulsoryCount, excludedCount, remainingEligibleCount, remainingSelectionCount });
    }
    case "countExactlyFromTwoCategories": {
      const categoryA = numberValue(parameters, "categoryA");
      const categoryB = numberValue(parameters, "categoryB");
      const requiredFromA = numberValue(parameters, "requiredFromA");
      const requiredFromB = committeeSize - requiredFromA;
      const answer = countExactlyFromTwoCategoriesExact(categoryA, categoryB, committeeSize, requiredFromA, ceiling);
      return result(answer, `${binomialPlain(categoryA, requiredFromA)} × ${binomialPlain(categoryB, requiredFromB)} = ${answer}`, `${binomialTex(categoryA, requiredFromA)} \\times ${binomialTex(categoryB, requiredFromB)} = ${answer}`, { ...base, operation: "EXACT_TWO_CATEGORY_QUOTA", categorySizes: [categoryA, categoryB], requiredCategoryCounts: [requiredFromA, requiredFromB], requiredFromA, requiredFromB });
    }
    case "countAtLeastFromTwoCategories": {
      const categoryA = numberValue(parameters, "categoryA");
      const categoryB = numberValue(parameters, "categoryB");
      const minimumFromA = numberValue(parameters, "minimumFromA");
      const counted = countAtLeastFromTwoCategoriesExact(categoryA, categoryB, committeeSize, minimumFromA, ceiling);
      const plain = counted.caseCounts.join(" + ");
      return result(counted.answer, `${plain} = ${counted.answer}`, `${counted.caseCounts.join(" + ")} = ${counted.answer}`, { ...base, operation: "AT_LEAST_TWO_CATEGORY_QUOTA", categorySizes: [categoryA, categoryB], minimumFromA, acceptedSelectionCounts: counted.acceptedCounts, selectionCaseCounts: counted.caseCounts });
    }
    case "countAtMostFromTwoCategories": {
      const categoryA = numberValue(parameters, "categoryA");
      const categoryB = numberValue(parameters, "categoryB");
      const maximumFromA = numberValue(parameters, "maximumFromA");
      const counted = countAtMostFromTwoCategoriesExact(categoryA, categoryB, committeeSize, maximumFromA, ceiling);
      return result(counted.answer, `${counted.caseCounts.join(" + ")} = ${counted.answer}`, `${counted.caseCounts.join(" + ")} = ${counted.answer}`, { ...base, operation: "AT_MOST_TWO_CATEGORY_QUOTA", categorySizes: [categoryA, categoryB], maximumFromA, acceptedSelectionCounts: counted.acceptedCounts, selectionCaseCounts: counted.caseCounts });
    }
    case "countAtLeastOneFromCategory": {
      const categoryA = numberValue(parameters, "categoryA");
      const categoryB = numberValue(parameters, "categoryB");
      const forbiddenCount = choose(categoryB, committeeSize, ceiling);
      const answer = countAtLeastOneFromCategoryExact(categoryA, categoryB, committeeSize, ceiling);
      return result(answer, `${binomialPlain(totalObjects, committeeSize)} - ${binomialPlain(categoryB, committeeSize)} = ${answer}`, `${binomialTex(totalObjects, committeeSize)} - ${binomialTex(categoryB, committeeSize)} = ${answer}`, { ...base, operation: "AT_LEAST_ONE_CATEGORY", categorySizes: [categoryA, categoryB], forbiddenCount });
    }
    case "countAtLeastOneFromEachOfTwoCategories": {
      const categoryA = numberValue(parameters, "categoryA");
      const categoryB = numberValue(parameters, "categoryB");
      const answer = countAtLeastOneFromEachOfTwoCategoriesExact(categoryA, categoryB, committeeSize, ceiling);
      return result(answer, `${binomialPlain(totalObjects, committeeSize)} - ${binomialPlain(categoryA, committeeSize)} - ${binomialPlain(categoryB, committeeSize)} = ${answer}`, `${binomialTex(totalObjects, committeeSize)} - ${binomialTex(categoryA, committeeSize)} - ${binomialTex(categoryB, committeeSize)} = ${answer}`, { ...base, operation: "AT_LEAST_ONE_EACH_TWO_CATEGORIES", categorySizes: [categoryA, categoryB], forbiddenCount: choose(categoryA, committeeSize, ceiling) + choose(categoryB, committeeSize, ceiling) });
    }
    case "countExactThreeCategoryDistribution": {
      const categorySizes = [numberValue(parameters, "categoryA"), numberValue(parameters, "categoryB"), numberValue(parameters, "categoryC")];
      const requiredCounts = [numberValue(parameters, "requiredA"), numberValue(parameters, "requiredB"), numberValue(parameters, "requiredC")];
      const answer = countExactThreeCategoryDistributionExact(categorySizes, requiredCounts, ceiling);
      const plainFactors = categorySizes.map((size, index) => binomialPlain(size, requiredCounts[index] ?? 0));
      const texFactors = categorySizes.map((size, index) => binomialTex(size, requiredCounts[index] ?? 0));
      return result(answer, `${plainFactors.join(" × ")} = ${answer}`, `${texFactors.join(" \\times ")} = ${answer}`, { ...base, operation: "EXACT_THREE_CATEGORY_DISTRIBUTION", categorySizes, requiredCategoryCounts: requiredCounts });
    }
    case "countAtLeastOneFromEachOfThreeCategories": {
      const categorySizes = [numberValue(parameters, "categoryA"), numberValue(parameters, "categoryB"), numberValue(parameters, "categoryC")];
      const counted = countAtLeastOneFromEachOfThreeCategoriesExact(categorySizes, committeeSize, ceiling);
      return result(counted.answer, `${counted.caseCounts.join(" + ")} = ${counted.answer}`, `${counted.caseCounts.join(" + ")} = ${counted.answer}`, { ...base, operation: "AT_LEAST_ONE_EACH_THREE_CATEGORIES", categorySizes, selectionCaseCounts: counted.caseCounts, acceptedSelectionCounts: [counted.distributionCount] });
    }
    case "countExactlyTSpecifiedMembers": {
      const specifiedCount = numberValue(parameters, "specifiedCount");
      const requiredSpecified = numberValue(parameters, "requiredSpecified");
      const remainingEligibleCount = totalObjects - specifiedCount;
      const remainingSelectionCount = committeeSize - requiredSpecified;
      const answer = countExactlyTSpecifiedMembersExact(totalObjects, committeeSize, specifiedCount, requiredSpecified, ceiling);
      return result(answer, `${binomialPlain(specifiedCount, requiredSpecified)} × ${binomialPlain(remainingEligibleCount, remainingSelectionCount)} = ${answer}`, `${binomialTex(specifiedCount, requiredSpecified)} \\times ${binomialTex(remainingEligibleCount, remainingSelectionCount)} = ${answer}`, { ...base, operation: "EXACT_SPECIFIED_MEMBERS", specifiedCount, requiredSpecified, remainingEligibleCount, remainingSelectionCount });
    }
    case "countAtLeastOneSpecifiedMember": {
      const specifiedCount = numberValue(parameters, "specifiedCount");
      const remainingEligibleCount = totalObjects - specifiedCount;
      const forbiddenCount = choose(remainingEligibleCount, committeeSize, ceiling);
      const answer = countAtLeastOneSpecifiedMemberExact(totalObjects, committeeSize, specifiedCount, ceiling);
      return result(answer, `${binomialPlain(totalObjects, committeeSize)} - ${binomialPlain(remainingEligibleCount, committeeSize)} = ${answer}`, `${binomialTex(totalObjects, committeeSize)} - ${binomialTex(remainingEligibleCount, committeeSize)} = ${answer}`, { ...base, operation: "AT_LEAST_ONE_SPECIFIED_MEMBER", specifiedCount, remainingEligibleCount, forbiddenCount });
    }
    case "countNotAllSpecifiedMembersTogether": {
      const specifiedCount = numberValue(parameters, "specifiedCount");
      const forbiddenCount = choose(totalObjects - specifiedCount, committeeSize - specifiedCount, ceiling);
      const answer = countNotAllSpecifiedMembersTogetherExact(totalObjects, committeeSize, specifiedCount, ceiling);
      return result(answer, `${binomialPlain(totalObjects, committeeSize)} - ${binomialPlain(totalObjects - specifiedCount, committeeSize - specifiedCount)} = ${answer}`, `${binomialTex(totalObjects, committeeSize)} - ${binomialTex(totalObjects - specifiedCount, committeeSize - specifiedCount)} = ${answer}`, { ...base, operation: "NOT_ALL_SPECIFIED_TOGETHER", specifiedCount, forbiddenCount });
    }
    case "countAllOrNoneSpecifiedMembers": {
      const specifiedCount = numberValue(parameters, "specifiedCount");
      const allCount = choose(totalObjects - specifiedCount, committeeSize - specifiedCount, ceiling);
      const noneCount = choose(totalObjects - specifiedCount, committeeSize, ceiling);
      const answer = countAllOrNoneSpecifiedMembersExact(totalObjects, committeeSize, specifiedCount, ceiling);
      return result(answer, `${allCount} + ${noneCount} = ${answer}`, `${allCount} + ${noneCount} = ${answer}`, { ...base, operation: "ALL_OR_NONE_SPECIFIED", specifiedCount, selectionCaseCounts: [allCount, noneCount] });
    }
    case "countImplicationBetweenSpecifiedMembers": {
      const forbiddenCount = choose(totalObjects - 2, committeeSize - 1, ceiling);
      const answer = countImplicationBetweenSpecifiedMembersExact(totalObjects, committeeSize, ceiling);
      return result(answer, `${binomialPlain(totalObjects, committeeSize)} - ${binomialPlain(totalObjects - 2, committeeSize - 1)} = ${answer}`, `${binomialTex(totalObjects, committeeSize)} - ${binomialTex(totalObjects - 2, committeeSize - 1)} = ${answer}`, { ...base, operation: "MEMBER_IMPLICATION", specifiedCount: 2, forbiddenCount });
    }
    case "countAtMostTSpecifiedMembers": {
      const specifiedCount = numberValue(parameters, "specifiedCount");
      const maximumSpecified = numberValue(parameters, "maximumSpecified");
      const counted = countAtMostTSpecifiedMembersExact(totalObjects, committeeSize, specifiedCount, maximumSpecified, ceiling);
      return result(counted.answer, `${counted.caseCounts.join(" + ")} = ${counted.answer}`, `${counted.caseCounts.join(" + ")} = ${counted.answer}`, { ...base, operation: "AT_MOST_SPECIFIED_MEMBERS", specifiedCount, maximumSpecified, acceptedSelectionCounts: counted.acceptedCounts, selectionCaseCounts: counted.caseCounts });
    }
    case "countNamedCompulsoryWithCategoryQuota": {
      const categoryA = numberValue(parameters, "categoryA");
      const categoryB = numberValue(parameters, "categoryB");
      const requiredFromA = numberValue(parameters, "requiredFromA");
      const requiredFromB = committeeSize - requiredFromA;
      const remainingCategoryASelection = requiredFromA - 1;
      const answer = countNamedCompulsoryWithCategoryQuotaExact(categoryA, categoryB, committeeSize, requiredFromA, ceiling);
      return result(answer, `${binomialPlain(categoryA - 1, remainingCategoryASelection)} × ${binomialPlain(categoryB, requiredFromB)} = ${answer}`, `${binomialTex(categoryA - 1, remainingCategoryASelection)} \\times ${binomialTex(categoryB, requiredFromB)} = ${answer}`, { ...base, operation: "NAMED_COMPULSORY_CATEGORY_QUOTA", categorySizes: [categoryA, categoryB], requiredFromA, requiredFromB, compulsoryCount: 1, remainingCategoryASelection });
    }
    case "countNamedExcludedWithCategoryQuota": {
      const categoryA = numberValue(parameters, "categoryA");
      const categoryB = numberValue(parameters, "categoryB");
      const requiredFromA = numberValue(parameters, "requiredFromA");
      const requiredFromB = committeeSize - requiredFromA;
      const answer = countNamedExcludedWithCategoryQuotaExact(categoryA, categoryB, committeeSize, requiredFromA, ceiling);
      return result(answer, `${binomialPlain(categoryA - 1, requiredFromA)} × ${binomialPlain(categoryB, requiredFromB)} = ${answer}`, `${binomialTex(categoryA - 1, requiredFromA)} \\times ${binomialTex(categoryB, requiredFromB)} = ${answer}`, { ...base, operation: "NAMED_EXCLUDED_CATEGORY_QUOTA", categorySizes: [categoryA, categoryB], requiredFromA, requiredFromB, excludedCount: 1 });
    }
    default:
      throw new Error(`CP-009 direct solver received ${parameters.solveMode}`);
  }
}

function solveInverse(parameters: Pnc002AnyParameters): Pnc002SolverResult {
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const committeeSize = numberValue(parameters, "committeeSize");
  const target = numberValue(parameters, "target");
  const searchMinimum = numberValue(parameters, "searchMinimum");
  const searchMaximum = numberValue(parameters, "searchMaximum");
  const matches: number[] = [];
  if (parameters.scenarioFamily === "recoverConditionalTotalObjects") {
    for (let candidate = searchMinimum; candidate <= searchMaximum; candidate += 1) {
      if (countWithCompulsoryMembersExact(candidate, committeeSize, 1, ceiling) === target) matches.push(candidate);
    }
    if (matches.length !== 1) throw new Error(`CP-009 total-object inverse found ${matches.length} matches`);
    const answer = matches[0] ?? 0;
    const n = answer - 1;
    const r = committeeSize - 1;
    return result(answer, `${binomialPlain(n, r)} = ${target}`, `${binomialTex(n, r)} = ${target}`, { ...selectionEvidence(answer, committeeSize), operation: "CONDITIONAL_SELECTION_INVERSE", compulsoryCount: 1, target, searchMinimum, searchMaximum, recoveredParameter: "totalObjects" });
  }
  if (parameters.scenarioFamily === "recoverConditionalCategorySize") {
    const categoryB = numberValue(parameters, "categoryB");
    const requiredFromA = numberValue(parameters, "requiredFromA");
    for (let candidate = searchMinimum; candidate <= searchMaximum; candidate += 1) {
      if (countExactlyFromTwoCategoriesExact(candidate, categoryB, committeeSize, requiredFromA, ceiling) === target) matches.push(candidate);
    }
    if (matches.length !== 1) throw new Error(`CP-009 category-size inverse found ${matches.length} matches`);
    const answer = matches[0] ?? 0;
    const requiredFromB = committeeSize - requiredFromA;
    return result(answer, `${binomialPlain(answer, requiredFromA)} × ${binomialPlain(categoryB, requiredFromB)} = ${target}`, `${binomialTex(answer, requiredFromA)} \\times ${binomialTex(categoryB, requiredFromB)} = ${target}`, { ...selectionEvidence(answer + categoryB, committeeSize), operation: "CONDITIONAL_SELECTION_INVERSE", categorySizes: [answer, categoryB], requiredFromA, requiredFromB, target, searchMinimum, searchMaximum, recoveredParameter: "categorySize" });
  }
  throw new Error(`Unsupported CP-009 inverse scenario ${parameters.scenarioFamily}`);
}

export function solvePnc002Cp009(parameters: Pnc002AnyParameters): Pnc002SolverResult {
  if (parameters.canonicalProblemId !== "PNC-CP-009") throw new Error(`CP-009 solver received ${parameters.canonicalProblemId}`);
  return parameters.solveMode === "recoverConditionalSelectionParameter" ? solveInverse(parameters) : solveDirect(parameters);
}

function countSubsets(totalObjects: number, committeeSize: number, predicate: (selected: boolean[]) => boolean): number {
  const selected = Array.from({ length: totalObjects }, () => false);
  let count = 0;
  const visit = (next: number, chosen: number): void => {
    if (chosen === committeeSize) {
      if (predicate(selected)) count += 1;
      return;
    }
    if (next >= totalObjects || chosen + (totalObjects - next) < committeeSize) return;
    selected[next] = true;
    visit(next + 1, chosen + 1);
    selected[next] = false;
    visit(next + 1, chosen);
  };
  visit(0, 0);
  return count;
}
function selectedInRange(selected: boolean[], start: number, length: number): number {
  let count = 0;
  for (let index = start; index < start + length; index += 1) if (selected[index]) count += 1;
  return count;
}
function enumerateDirect(parameters: Pnc002AnyParameters): number {
  const totalObjects = numberValue(parameters, "totalObjects");
  const committeeSize = numberValue(parameters, "committeeSize");
  return countSubsets(totalObjects, committeeSize, (selected) => {
    switch (parameters.solveMode) {
      case "countWithCompulsoryMembers": {
        const count = numberValue(parameters, "compulsoryCount");
        return Array.from({ length: count }, (_, index) => selected[index] === true).every(Boolean);
      }
      case "countWithExcludedMembers": {
        const count = numberValue(parameters, "excludedCount");
        return Array.from({ length: count }, (_, index) => selected[index] === false).every(Boolean);
      }
      case "countWithCompulsoryAndExcludedMembers": {
        const compulsoryCount = numberValue(parameters, "compulsoryCount");
        const excludedCount = numberValue(parameters, "excludedCount");
        const compulsoryValid = Array.from({ length: compulsoryCount }, (_, index) => selected[index] === true).every(Boolean);
        const excludedValid = Array.from({ length: excludedCount }, (_, index) => selected[compulsoryCount + index] === false).every(Boolean);
        return compulsoryValid && excludedValid;
      }
      case "countExactlyFromTwoCategories":
      case "countAtLeastFromTwoCategories":
      case "countAtMostFromTwoCategories":
      case "countAtLeastOneFromCategory":
      case "countAtLeastOneFromEachOfTwoCategories": {
        const categoryA = numberValue(parameters, "categoryA");
        const selectedA = selectedInRange(selected, 0, categoryA);
        if (parameters.solveMode === "countExactlyFromTwoCategories") return selectedA === numberValue(parameters, "requiredFromA");
        if (parameters.solveMode === "countAtLeastFromTwoCategories") return selectedA >= numberValue(parameters, "minimumFromA");
        if (parameters.solveMode === "countAtMostFromTwoCategories") return selectedA <= numberValue(parameters, "maximumFromA");
        if (parameters.solveMode === "countAtLeastOneFromCategory") return selectedA >= 1;
        return selectedA >= 1 && selectedA <= committeeSize - 1;
      }
      case "countExactThreeCategoryDistribution":
      case "countAtLeastOneFromEachOfThreeCategories": {
        const categoryA = numberValue(parameters, "categoryA");
        const categoryB = numberValue(parameters, "categoryB");
        const categoryC = numberValue(parameters, "categoryC");
        const selectedA = selectedInRange(selected, 0, categoryA);
        const selectedB = selectedInRange(selected, categoryA, categoryB);
        const selectedC = selectedInRange(selected, categoryA + categoryB, categoryC);
        if (parameters.solveMode === "countExactThreeCategoryDistribution") {
          return selectedA === numberValue(parameters, "requiredA")
            && selectedB === numberValue(parameters, "requiredB")
            && selectedC === numberValue(parameters, "requiredC");
        }
        return selectedA >= 1 && selectedB >= 1 && selectedC >= 1;
      }
      case "countExactlyTSpecifiedMembers":
        return selectedInRange(selected, 0, numberValue(parameters, "specifiedCount")) === numberValue(parameters, "requiredSpecified");
      case "countAtLeastOneSpecifiedMember":
        return selectedInRange(selected, 0, numberValue(parameters, "specifiedCount")) >= 1;
      case "countNotAllSpecifiedMembersTogether":
        return selectedInRange(selected, 0, numberValue(parameters, "specifiedCount")) < numberValue(parameters, "specifiedCount");
      case "countAllOrNoneSpecifiedMembers": {
        const specifiedCount = numberValue(parameters, "specifiedCount");
        const selectedSpecified = selectedInRange(selected, 0, specifiedCount);
        return selectedSpecified === 0 || selectedSpecified === specifiedCount;
      }
      case "countImplicationBetweenSpecifiedMembers":
        return !selected[1] || Boolean(selected[0]);
      case "countAtMostTSpecifiedMembers":
        return selectedInRange(selected, 0, numberValue(parameters, "specifiedCount")) <= numberValue(parameters, "maximumSpecified");
      case "countNamedCompulsoryWithCategoryQuota": {
        const categoryA = numberValue(parameters, "categoryA");
        return Boolean(selected[0]) && selectedInRange(selected, 0, categoryA) === numberValue(parameters, "requiredFromA");
      }
      case "countNamedExcludedWithCategoryQuota": {
        const categoryA = numberValue(parameters, "categoryA");
        return !selected[0] && selectedInRange(selected, 0, categoryA) === numberValue(parameters, "requiredFromA");
      }
      default:
        throw new Error(`CP-009 enumerator received ${parameters.solveMode}`);
    }
  });
}

export function verifyPnc002Cp009Independently(parameters: Pnc002AnyParameters): Pnc002IndependentVerification {
  if (parameters.solveMode !== "recoverConditionalSelectionParameter") {
    return { supported: true, answer: enumerateDirect(parameters), method: "Exhaustive enumeration of fixed-size subsets with named-member and category predicates" };
  }
  const target = numberValue(parameters, "target");
  const searchMinimum = numberValue(parameters, "searchMinimum");
  const searchMaximum = numberValue(parameters, "searchMaximum");
  const committeeSize = numberValue(parameters, "committeeSize");
  const matches: number[] = [];
  if (parameters.scenarioFamily === "recoverConditionalTotalObjects") {
    for (let candidate = searchMinimum; candidate <= searchMaximum; candidate += 1) {
      const count = countSubsets(candidate, committeeSize, (selected) => Boolean(selected[0]));
      if (count === target) matches.push(candidate);
    }
  } else if (parameters.scenarioFamily === "recoverConditionalCategorySize") {
    const categoryB = numberValue(parameters, "categoryB");
    const requiredFromA = numberValue(parameters, "requiredFromA");
    for (let candidate = searchMinimum; candidate <= searchMaximum; candidate += 1) {
      const count = countSubsets(candidate + categoryB, committeeSize, (selected) => selectedInRange(selected, 0, candidate) === requiredFromA);
      if (count === target) matches.push(candidate);
    }
  } else {
    throw new Error(`Unsupported CP-009 inverse verification ${parameters.scenarioFamily}`);
  }
  if (matches.length !== 1) throw new Error(`CP-009 independent inverse found ${matches.length} matches`);
  return { supported: true, answer: matches[0] ?? 0, method: "Bounded subset enumeration with unique conditional-count recovery" };
}
