import type {
  IopActionTrace,
  IopMachineRule,
  IopMachineStep,
  IopMachineTrace,
  IopPhaseRule,
  IopToken,
} from "./types.ts";

export function tokenStateFingerprint(tokens: readonly IopToken[]): string {
  return tokens.map((token) => `${token.id}:${token.visibleValue}`).join("|");
}

export function ruleFingerprint(rule: IopMachineRule): string {
  const phaseFingerprints = rule.phases.map((phase) =>
    [phase.eligibleKind, phase.selectionKey, phase.direction, phase.placement].join(":"),
  );
  if (rule.schedule === "SIMULTANEOUS_PHASES") phaseFingerprints.sort();
  return [rule.schedule, ...phaseFingerprints].join("|");
}

function numericValue(token: IopToken): number {
  const value = Number(token.visibleValue);
  if (!Number.isFinite(value)) throw new Error(`Invalid numeric token ${token.visibleValue}`);
  return value;
}

function compareTokens(first: IopToken, second: IopToken, phase: IopPhaseRule): number {
  if (first.kind !== phase.eligibleKind || second.kind !== phase.eligibleKind) {
    throw new Error(`Phase ${phase.id} received an ineligible token kind`);
  }
  let comparison = 0;
  if (phase.selectionKey === "NUMERIC_VALUE") comparison = numericValue(first) - numericValue(second);
  else comparison = first.visibleValue.localeCompare(second.visibleValue, "en", { sensitivity: "base" });
  if (comparison === 0) comparison = first.id.localeCompare(second.id);
  return phase.direction === "ASC" ? comparison : -comparison;
}

function selectToken(tokens: readonly IopToken[], fixed: ReadonlySet<string>, phase: IopPhaseRule): IopToken | undefined {
  return tokens
    .filter((token) => !fixed.has(token.id) && token.kind === phase.eligibleKind)
    .sort((a, b) => compareTokens(a, b, phase))[0];
}

function applicablePhaseIndexes(
  rule: IopMachineRule,
  tokens: readonly IopToken[],
  fixed: ReadonlySet<string>,
  phaseCursor: number,
): readonly number[] {
  if (rule.schedule === "SINGLE_PHASE") return selectToken(tokens, fixed, rule.phases[0]!) ? [0] : [];

  if (rule.schedule === "SIMULTANEOUS_PHASES") {
    return rule.phases.flatMap((phase, index) => (selectToken(tokens, fixed, phase) ? [index] : []));
  }

  if (rule.schedule === "BLOCKED_PHASES") {
    for (let offset = 0; offset < rule.phases.length; offset += 1) {
      const index = Math.min(phaseCursor + offset, rule.phases.length - 1);
      if (selectToken(tokens, fixed, rule.phases[index]!)) return [index];
    }
    return [];
  }

  for (let offset = 0; offset < rule.phases.length; offset += 1) {
    const index = (phaseCursor + offset) % rule.phases.length;
    if (selectToken(tokens, fixed, rule.phases[index]!)) return [index];
  }
  return [];
}

function moveSelected(
  mutable: IopToken[],
  selected: IopToken,
  phase: IopPhaseRule,
  leftFixedCount: number,
  rightFixedCount: number,
): { readonly trace: IopActionTrace; readonly left: number; readonly right: number } {
  const fromIndex = mutable.findIndex((token) => token.id === selected.id);
  if (fromIndex < 0) throw new Error(`Selected token ${selected.id} disappeared`);
  mutable.splice(fromIndex, 1);

  let toIndex: number;
  let left = leftFixedCount;
  let right = rightFixedCount;
  if (phase.placement === "LEFT_FIXED") {
    toIndex = leftFixedCount;
    mutable.splice(toIndex, 0, selected);
    left += 1;
  } else {
    toIndex = mutable.length - rightFixedCount;
    mutable.splice(toIndex, 0, selected);
    right += 1;
  }

  return {
    trace: {
      phaseId: phase.id,
      tokenId: selected.id,
      tokenValue: selected.visibleValue,
      fromIndex,
      toIndex,
      placement: phase.placement,
    },
    left,
    right,
  };
}

export function executeMachine(rule: IopMachineRule, input: readonly IopToken[]): IopMachineTrace {
  if (input.length < 4) throw new Error("IOP discovery machines require at least four tokens");
  if (rule.phases.length === 0) throw new Error("Machine rule requires at least one phase");

  const mutable = [...input];
  const fixed = new Set<string>();
  const steps: IopMachineStep[] = [];
  let leftFixedCount = 0;
  let rightFixedCount = 0;
  let phaseCursor = 0;
  let safety = 0;

  while (fixed.size < input.length) {
    safety += 1;
    if (safety > input.length * 8) throw new Error(`Machine ${rule.id} failed to terminate`);

    const remaining = input.length - fixed.size;
    if (remaining <= 1) break;

    const phaseIndexes = applicablePhaseIndexes(rule, mutable, fixed, phaseCursor);
    if (phaseIndexes.length === 0) break;

    const before = tokenStateFingerprint(mutable);
    const actions: IopActionTrace[] = [];

    for (const phaseIndex of phaseIndexes) {
      if (input.length - fixed.size <= 1) break;
      const phase = rule.phases[phaseIndex]!;
      const selected = selectToken(mutable, fixed, phase);
      if (!selected) continue;
      const movement = moveSelected(mutable, selected, phase, leftFixedCount, rightFixedCount);
      leftFixedCount = movement.left;
      rightFixedCount = movement.right;
      fixed.add(selected.id);
      actions.push(movement.trace);
    }

    if (rule.schedule === "ALTERNATING_PHASES") {
      const used = phaseIndexes[0];
      if (used !== undefined) phaseCursor = (used + 1) % rule.phases.length;
    } else if (rule.schedule === "BLOCKED_PHASES") {
      const used = phaseIndexes[0];
      if (used !== undefined && !selectToken(mutable, fixed, rule.phases[used]!)) phaseCursor = Math.min(used + 1, rule.phases.length - 1);
      else if (used !== undefined) phaseCursor = used;
    }

    const after = tokenStateFingerprint(mutable);
    if (after !== before) {
      steps.push({
        stepNumber: steps.length + 1,
        tokens: [...mutable],
        actions,
        stateFingerprint: after,
      });
    }
  }

  const allFingerprints = [tokenStateFingerprint(input), ...steps.map((step) => step.stateFingerprint)];
  if (new Set(allFingerprints).size !== allFingerprints.length) throw new Error(`Machine ${rule.id} emitted a duplicate visible state`);

  const final = steps.length > 0 ? steps[steps.length - 1]!.tokens : [...input];
  return {
    input: [...input],
    steps,
    final,
    finalFingerprint: tokenStateFingerprint(final),
    ruleFingerprint: ruleFingerprint(rule),
  };
}

export function renderTokenRow(tokens: readonly IopToken[]): string {
  return tokens.map((token) => token.visibleValue).join("  ");
}

export function renderTrace(trace: IopMachineTrace): string {
  const rows = [`Input: ${renderTokenRow(trace.input)}`];
  for (const step of trace.steps) rows.push(`Step ${step.stepNumber}: ${renderTokenRow(step.tokens)}`);
  return rows.join("\n");
}
