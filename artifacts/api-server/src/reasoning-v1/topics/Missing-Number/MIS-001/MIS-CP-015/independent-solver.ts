
import type {
  MisCp015MissingPosition,
  MisCp015RuleId,
} from './rule-definitions';

export interface MisCp015Group {
  readonly inputs: readonly number[];
  readonly result: number;
}

export function independentlyEvaluateMisCp015Rule(
  ruleId: MisCp015RuleId,
  inputs: readonly number[],
): number | null {
  if (ruleId === 'PAIR_PRODUCT_PLUS_FIRST') {
    if (inputs.length !== 2) return null;
    return inputs[0]! * inputs[1]! + inputs[0]!;
  }
  if (inputs.length !== 3) return null;
  const product = inputs[0]! * inputs[1]! * inputs[2]!;
  return ruleId === 'THREE_INPUT_PRODUCT_PLUS_ONE' ? product + 1 : product - 1;
}

export function independentlyVerifyMisCp015Group(
  ruleId: MisCp015RuleId,
  group: MisCp015Group,
): boolean {
  return independentlyEvaluateMisCp015Rule(ruleId, group.inputs) === group.result;
}

export function independentlySolveMisCp015Missing(
  ruleId: MisCp015RuleId,
  visibleInputs: readonly (number | null)[],
  result: number | null,
  missingPosition: MisCp015MissingPosition,
  minInput = 2,
  maxInput = 25,
): readonly number[] {
  if (missingPosition === 'RESULT') {
    if (visibleInputs.some((value) => value == null)) return [];
    const solved = independentlyEvaluateMisCp015Rule(ruleId, visibleInputs as number[]);
    return solved == null ? [] : [solved];
  }
  if (result == null) return [];

  const index =
    missingPosition === 'FIRST_INPUT' ? 0 :
    missingPosition === 'SECOND_INPUT' ? 1 : 2;

  const solutions: number[] = [];
  for (let candidate = minInput; candidate <= maxInput; candidate += 1) {
    const inputs = [...visibleInputs];
    inputs[index] = candidate;
    if (inputs.some((value) => value == null)) continue;
    if (independentlyEvaluateMisCp015Rule(ruleId, inputs as number[]) === result) {
      solutions.push(candidate);
    }
  }
  return solutions;
}
