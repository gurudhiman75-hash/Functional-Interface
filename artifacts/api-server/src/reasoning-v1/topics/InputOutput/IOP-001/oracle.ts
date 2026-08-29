import { ruleFingerprint, tokenStateFingerprint } from "./engine.ts";
import type { IopMachineRule, IopMachineStep, IopMachineTrace, IopPhaseRule, IopToken } from "./types.ts";

function oracleCompare(a: IopToken, b: IopToken, phase: IopPhaseRule): number {
  let raw: number;
  if (phase.selectionKey === "NUMERIC_VALUE") raw = Number(a.visibleValue) - Number(b.visibleValue);
  else raw = a.visibleValue.toLocaleLowerCase("en-IN").localeCompare(b.visibleValue.toLocaleLowerCase("en-IN"));
  if (raw === 0) raw = a.originalPosition - b.originalPosition;
  return phase.direction === "ASC" ? raw : -raw;
}

function oraclePick(state: readonly IopToken[], fixed: ReadonlySet<string>, phase: IopPhaseRule): IopToken | undefined {
  const pool = state.filter((token) => token.kind === phase.eligibleKind && !fixed.has(token.id));
  let chosen: IopToken | undefined;
  for (const token of pool) {
    if (!chosen || oracleCompare(token, chosen, phase) < 0) chosen = token;
  }
  return chosen;
}

function move(state: readonly IopToken[], tokenId: string, leftCount: number, rightCount: number, phase: IopPhaseRule): readonly IopToken[] {
  const token = state.find((candidate) => candidate.id === tokenId);
  if (!token) throw new Error(`Oracle lost token ${tokenId}`);
  const rest = state.filter((candidate) => candidate.id !== tokenId);
  const index = phase.placement === "LEFT_FIXED" ? leftCount : rest.length - rightCount;
  return [...rest.slice(0, index), token, ...rest.slice(index)];
}

function nextIndexes(rule: IopMachineRule, state: readonly IopToken[], fixed: ReadonlySet<string>, cursor: number): readonly number[] {
  if (rule.schedule === "SINGLE_PHASE") return oraclePick(state, fixed, rule.phases[0]!) ? [0] : [];
  if (rule.schedule === "SIMULTANEOUS_PHASES") {
    return rule.phases.map((phase, index) => (oraclePick(state, fixed, phase) ? index : -1)).filter((index) => index >= 0);
  }
  if (rule.schedule === "BLOCKED_PHASES") {
    for (let index = cursor; index < rule.phases.length; index += 1) if (oraclePick(state, fixed, rule.phases[index]!)) return [index];
    return [];
  }
  for (let offset = 0; offset < rule.phases.length; offset += 1) {
    const index = (cursor + offset) % rule.phases.length;
    if (oraclePick(state, fixed, rule.phases[index]!)) return [index];
  }
  return [];
}

export function reconstructTraceOracle(rule: IopMachineRule, input: readonly IopToken[]): IopMachineTrace {
  let state: readonly IopToken[] = [...input];
  const fixed = new Set<string>();
  let leftCount = 0;
  let rightCount = 0;
  let cursor = 0;
  const steps: IopMachineStep[] = [];
  let guard = 0;

  while (fixed.size < input.length - 1) {
    guard += 1;
    if (guard > input.length * 8) throw new Error(`Oracle failed to terminate ${rule.id}`);
    const indexes = nextIndexes(rule, state, fixed, cursor);
    if (indexes.length === 0) break;
    const before = tokenStateFingerprint(state);
    const actions: IopMachineStep["actions"][number][] = [];

    for (const index of indexes) {
      if (fixed.size >= input.length - 1) break;
      const phase = rule.phases[index]!;
      const picked = oraclePick(state, fixed, phase);
      if (!picked) continue;
      const fromIndex = state.findIndex((token) => token.id === picked.id);
      const next = move(state, picked.id, leftCount, rightCount, phase);
      const toIndex = next.findIndex((token) => token.id === picked.id);
      state = next;
      fixed.add(picked.id);
      if (phase.placement === "LEFT_FIXED") leftCount += 1;
      else rightCount += 1;
      actions.push({ phaseId: phase.id, tokenId: picked.id, tokenValue: picked.visibleValue, fromIndex, toIndex, placement: phase.placement });
    }

    if (rule.schedule === "ALTERNATING_PHASES") {
      const used = indexes[0];
      if (used !== undefined) cursor = (used + 1) % rule.phases.length;
    } else if (rule.schedule === "BLOCKED_PHASES") {
      const used = indexes[0];
      if (used !== undefined) cursor = oraclePick(state, fixed, rule.phases[used]!) ? used : Math.min(used + 1, rule.phases.length - 1);
    }

    const after = tokenStateFingerprint(state);
    if (after !== before) steps.push({ stepNumber: steps.length + 1, tokens: [...state], actions, stateFingerprint: after });
  }

  return {
    input: [...input],
    steps,
    final: [...state],
    finalFingerprint: tokenStateFingerprint(state),
    ruleFingerprint: ruleFingerprint(rule),
  };
}

export function assertOracleParity(actual: IopMachineTrace, oracle: IopMachineTrace): void {
  const actualStates = [tokenStateFingerprint(actual.input), ...actual.steps.map((step) => step.stateFingerprint)];
  const oracleStates = [tokenStateFingerprint(oracle.input), ...oracle.steps.map((step) => step.stateFingerprint)];
  if (actual.ruleFingerprint !== oracle.ruleFingerprint) throw new Error("Rule fingerprint mismatch between executor and oracle");
  if (actualStates.length !== oracleStates.length) throw new Error(`Trace length mismatch ${actualStates.length} != ${oracleStates.length}`);
  for (let index = 0; index < actualStates.length; index += 1) {
    if (actualStates[index] !== oracleStates[index]) throw new Error(`Trace mismatch at state ${index}`);
  }
}
