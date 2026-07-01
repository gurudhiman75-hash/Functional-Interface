import type { EntityRealismPolicy } from "./entity-policies";

export interface AnswerRealismInput {
  targetRate: string;
  targetDisplay: string;
  policy: EntityRealismPolicy;
  variant: number;
}

export function realizeContextualAnswer(input: AnswerRealismInput): string {
  const { targetRate, targetDisplay, policy } = input;
  const variant = input.variant % 4;

  if (policy.entityKind === "ABSTRACT") {
    return [
      `So ${targetRate}% of the number is ${targetDisplay}.`,
      `This means the required value is ${targetDisplay}.`,
      `The value represented by ${targetRate}% is ${targetDisplay}.`,
      `So the answer is ${targetDisplay}.`,
    ][variant]!;
  }

  if (policy.entityKind === "MONEY") {
    return [
      `So the amount corresponding to ${targetRate}% of the ${policy.contextLabel} is ${targetDisplay}.`,
      `This means ${targetRate}% of the ${policy.contextLabel} comes to ${targetDisplay}.`,
      `Therefore, ${targetRate}% of the ${policy.contextLabel} is ${targetDisplay}.`,
      `The amount represented by ${targetRate}% of the ${policy.contextLabel} is ${targetDisplay}.`,
    ][variant]!;
  }

  return [
    `So ${targetRate}% of the ${policy.contextLabel} is ${targetDisplay}.`,
    `This means the required ${policy.contextLabel} count is ${targetDisplay}.`,
    `Therefore, ${targetRate}% of the ${policy.contextLabel} represents ${targetDisplay}.`,
    `So the share of the ${policy.contextLabel} represented by ${targetRate}% is ${targetDisplay}.`,
  ][variant]!;
}
