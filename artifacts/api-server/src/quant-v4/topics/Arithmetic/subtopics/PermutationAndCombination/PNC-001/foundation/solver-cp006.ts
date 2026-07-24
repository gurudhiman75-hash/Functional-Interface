import { combinationExact, factorialExact, permutationExact, productExact } from "./math";
import { getPnc001VariableRanges } from "./library";
import type { Pnc001Cp006SolveMode, Pnc001IndependentVerification, Pnc001Parameters, Pnc001SolverResult } from "./types";

function readInteger(parameters: Pnc001Parameters, key: string): number {
  const value = parameters.values[key];
  if (typeof value !== "number" || !Number.isInteger(value)) throw new Error(`Missing integer PNC-CP-006 value: ${key}`);
  return value;
}
function roleCountFor(parameters: Pnc001Parameters): number {
  if (parameters.scenarioFamily === "committeeChair") return 1;
  if (parameters.scenarioFamily === "teamCaptainVice") return 2;
  if (parameters.scenarioFamily === "committeeThreeOffices") return 3;
  return readInteger(parameters, "roleCount");
}
function mixedCount(totalObjects: number, selectedObjects: number, roleCount: number, ceiling: number): { selectionCount: number; roleAssignmentCount: number; answer: number } {
  const selectionCount = combinationExact(totalObjects, selectedObjects, ceiling);
  const roleAssignmentCount = permutationExact(selectedObjects, roleCount, ceiling);
  return { selectionCount, roleAssignmentCount, answer: productExact([selectionCount, roleAssignmentCount], ceiling) };
}
function result(answer: number, equation: string, mathJax: string, evidence: Pnc001SolverResult["evidence"]): Pnc001SolverResult {
  return { exactAnswer: String(answer), answer: String(answer), numericAnswer: answer, equation, mathJax, evidence };
}
function enumerateMixedOutcomes(totalObjects: number, selectedObjects: number, roleCount: number): number {
  let count = 0;
  const selected: number[] = [];
  const choose = (start: number): void => {
    if (selected.length === selectedObjects) {
      const used = new Set<number>();
      const assign = (slot: number): void => {
        if (slot === roleCount) { count += 1; return; }
        for (const member of selected) {
          if (used.has(member)) continue;
          used.add(member); assign(slot + 1); used.delete(member);
        }
      };
      assign(0); return;
    }
    for (let member = start; member < totalObjects; member += 1) {
      selected.push(member); choose(member + 1); selected.pop();
    }
  };
  choose(0); return count;
}

export function solvePnc001Cp006(parameters: Pnc001Parameters): Pnc001SolverResult {
  const ranges = getPnc001VariableRanges();
  const ceiling = ranges.answerCeiling;
  const mode = parameters.solveMode as unknown as Pnc001Cp006SolveMode;
  switch (mode) {
    case "selectThenAssignDistinctRoles": {
      const totalObjects = readInteger(parameters, "totalObjects");
      const selectedObjects = readInteger(parameters, "selectedObjects");
      const roleCount = roleCountFor(parameters);
      const counts = mixedCount(totalObjects, selectedObjects, roleCount, ceiling);
      return result(counts.answer,
        `${totalObjects}C${selectedObjects} × ${selectedObjects}P${roleCount} = ${counts.selectionCount} × ${counts.roleAssignmentCount} = ${counts.answer}`,
        `{}^{${totalObjects}}C_{${selectedObjects}} \\times {}^{${selectedObjects}}P_{${roleCount}} = ${counts.answer}`,
        { operation: "MIXED_SELECT_ASSIGN", mixedTotalObjects: totalObjects, mixedSelectedObjects: selectedObjects, mixedRoleCount: roleCount, mixedSelectionCount: counts.selectionCount, mixedRoleAssignmentCount: counts.roleAssignmentCount, totalCount: counts.answer });
    }
    case "selectThenArrangeAllSelected": {
      const totalObjects = readInteger(parameters, "totalObjects");
      const selectedObjects = readInteger(parameters, "selectedObjects");
      const selectionCount = combinationExact(totalObjects, selectedObjects, ceiling);
      const roleAssignmentCount = factorialExact(selectedObjects, ceiling);
      const answer = productExact([selectionCount, roleAssignmentCount], ceiling);
      const equivalent = permutationExact(totalObjects, selectedObjects, ceiling);
      return result(answer,
        `${totalObjects}C${selectedObjects} × ${selectedObjects}! = ${selectionCount} × ${roleAssignmentCount} = ${answer} = ${totalObjects}P${selectedObjects}`,
        `{}^{${totalObjects}}C_{${selectedObjects}} \\times ${selectedObjects}! = {}^{${totalObjects}}P_{${selectedObjects}} = ${answer}`,
        { operation: "MIXED_SELECT_ARRANGE_ALL", mixedTotalObjects: totalObjects, mixedSelectedObjects: selectedObjects, mixedRoleCount: selectedObjects, mixedSelectionCount: selectionCount, mixedRoleAssignmentCount: roleAssignmentCount, mixedEquivalentPermutationCount: equivalent, totalCount: answer });
    }
    case "findRoleAssignmentMultiplier": {
      const selectedObjects = readInteger(parameters, "selectedObjects");
      const roleCount = readInteger(parameters, "roleCount");
      const answer = permutationExact(selectedObjects, roleCount, ceiling);
      return result(answer,
        `${selectedObjects}P${roleCount} = ${answer}`,
        `{}^{${selectedObjects}}P_{${roleCount}} = ${answer}`,
        { operation: "MIXED_ROLE_MULTIPLIER", mixedSelectedObjects: selectedObjects, mixedRoleCount: roleCount, mixedRoleAssignmentCount: answer, totalCount: answer });
    }
    case "recoverSelectionRoleParameter": {
      const target = readInteger(parameters, "target");
      let totalObjects: number;
      let selectedObjects: number;
      let roleCount: number;
      let minimum: number;
      let maximum: number;
      let recovered: "n" | "selected" | "roles";
      const matches: number[] = [];
      if (parameters.scenarioFamily === "recoverMixedTotalObjects") {
        selectedObjects = readInteger(parameters, "selectedObjects"); roleCount = readInteger(parameters, "roleCount");
        minimum = readInteger(parameters, "minimumTotalObjects"); maximum = readInteger(parameters, "maximumTotalObjects"); recovered = "n";
        for (let candidate = minimum; candidate <= maximum; candidate += 1) if (mixedCount(candidate, selectedObjects, roleCount, ceiling).answer === target) matches.push(candidate);
        if (matches.length !== 1) throw new Error(`Expected one CP-006 total-object match for ${target}; found ${matches.length}`);
        totalObjects = matches[0]!;
      } else if (parameters.scenarioFamily === "recoverMixedSelectedObjects") {
        totalObjects = readInteger(parameters, "totalObjects"); roleCount = readInteger(parameters, "roleCount");
        minimum = readInteger(parameters, "minimumSelectedObjects"); maximum = readInteger(parameters, "maximumSelectedObjects"); recovered = "selected";
        for (let candidate = minimum; candidate <= maximum; candidate += 1) if (mixedCount(totalObjects, candidate, roleCount, ceiling).answer === target) matches.push(candidate);
        if (matches.length !== 1) throw new Error(`Expected one CP-006 selected-object match for ${target}; found ${matches.length}`);
        selectedObjects = matches[0]!;
      } else {
        totalObjects = readInteger(parameters, "totalObjects"); selectedObjects = readInteger(parameters, "selectedObjects");
        minimum = 1; maximum = readInteger(parameters, "maximumRoleCount"); recovered = "roles";
        for (let candidate = minimum; candidate <= maximum; candidate += 1) if (mixedCount(totalObjects, selectedObjects, candidate, ceiling).answer === target) matches.push(candidate);
        if (matches.length !== 1) throw new Error(`Expected one CP-006 role-count match for ${target}; found ${matches.length}`);
        roleCount = matches[0]!;
      }
      const counts = mixedCount(totalObjects!, selectedObjects!, roleCount!, ceiling);
      const answer = recovered === "n" ? totalObjects! : recovered === "selected" ? selectedObjects! : roleCount!;
      return result(answer,
        `${totalObjects}C${selectedObjects} × ${selectedObjects}P${roleCount} = ${counts.selectionCount} × ${counts.roleAssignmentCount} = ${target}`,
        `{}^{${totalObjects}}C_{${selectedObjects}} \\times {}^{${selectedObjects}}P_{${roleCount}} = ${target}`,
        { operation: "MIXED_INVERSE", mixedTotalObjects: totalObjects!, mixedSelectedObjects: selectedObjects!, mixedRoleCount: roleCount!, mixedSelectionCount: counts.selectionCount, mixedRoleAssignmentCount: counts.roleAssignmentCount, mixedTarget: target, recoveredMixedParameter: recovered, mixedSearchMinimum: minimum!, mixedSearchMaximum: maximum!, totalCount: answer });
    }
  }
}

export function verifyPnc001Cp006Independently(parameters: Pnc001Parameters): Pnc001IndependentVerification {
  const mode = parameters.solveMode as unknown as Pnc001Cp006SolveMode;
  if (mode === "selectThenAssignDistinctRoles") {
    const n = readInteger(parameters, "totalObjects"), s = readInteger(parameters, "selectedObjects"), k = roleCountFor(parameters);
    return { supported: true, answer: enumerateMixedOutcomes(n, s, k), method: "Recursive subset enumeration followed by ordered role assignment" };
  }
  if (mode === "selectThenArrangeAllSelected") {
    const n = readInteger(parameters, "totalObjects"), s = readInteger(parameters, "selectedObjects");
    return { supported: true, answer: enumerateMixedOutcomes(n, s, s), method: "Recursive subset enumeration followed by full ordering" };
  }
  if (mode === "findRoleAssignmentMultiplier") {
    const s = readInteger(parameters, "selectedObjects"), k = readInteger(parameters, "roleCount");
    return { supported: true, answer: enumerateMixedOutcomes(s, s, k), method: "Ordered role enumeration inside one fixed selected group" };
  }
  const target = readInteger(parameters, "target");
  const matches: number[] = [];
  if (parameters.scenarioFamily === "recoverMixedTotalObjects") {
    const s = readInteger(parameters, "selectedObjects"), k = readInteger(parameters, "roleCount");
    for (let n = readInteger(parameters, "minimumTotalObjects"); n <= readInteger(parameters, "maximumTotalObjects"); n += 1) if (enumerateMixedOutcomes(n, s, k) === target) matches.push(n);
  } else if (parameters.scenarioFamily === "recoverMixedSelectedObjects") {
    const n = readInteger(parameters, "totalObjects"), k = readInteger(parameters, "roleCount");
    for (let s = readInteger(parameters, "minimumSelectedObjects"); s <= readInteger(parameters, "maximumSelectedObjects"); s += 1) if (enumerateMixedOutcomes(n, s, k) === target) matches.push(s);
  } else {
    const n = readInteger(parameters, "totalObjects"), s = readInteger(parameters, "selectedObjects");
    for (let k = 1; k <= readInteger(parameters, "maximumRoleCount"); k += 1) if (enumerateMixedOutcomes(n, s, k) === target) matches.push(k);
  }
  return { supported: matches.length === 1, answer: matches[0] ?? -1, method: "Bounded recursive mixed-count search" };
}
