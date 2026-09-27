
import type { MisCp019RuleContext, MisCp019RuleId } from './rule-definitions';

export interface MisCp019Group {
  readonly inputs: readonly number[];
  readonly result: number;
}

export function independentlyEvaluateMisCp019Rule(
  ruleId: MisCp019RuleId,
  inputs: readonly number[],
  context: MisCp019RuleContext,
): number | null {
  let value: number;

  if (ruleId === 'FOUR_INPUT_SUM_TIMES_CONSTANT') {
    if (inputs.length !== 4 || context.k == null) return null;
    value = inputs.reduce((sum, item) => sum + item, 0) * context.k;
  } else {
    if (inputs.length !== 2) return null;
    const [first, second] = inputs;

    if (ruleId === 'INCREMENT_FIRST_TIMES_HALF_INCREMENTED_SECOND') {
      if ((second! + 1) % 2 !== 0) return null;
      value = (first! + 1) * ((second! + 1) / 2);
    } else if (ruleId === 'FIRST_MINUS_CONSTANT_TIMES_SECOND') {
      if (context.k == null) return null;
      value = (first! - context.k) * second!;
    } else if (ruleId === 'FIRST_CUBE_MINUS_SECOND_SQUARE') {
      value = first! ** 3 - second! ** 2;
    } else {
      if (context.k == null) return null;
      value = (first! + second!) * context.k + second!;
    }
  }

  return Number.isInteger(value) && value > 0 && value <= 999 ? value : null;
}

export function independentlyVerifyMisCp019Group(
  ruleId: MisCp019RuleId,
  group: MisCp019Group,
  context: MisCp019RuleContext,
): boolean {
  return independentlyEvaluateMisCp019Rule(ruleId, group.inputs, context) === group.result;
}
