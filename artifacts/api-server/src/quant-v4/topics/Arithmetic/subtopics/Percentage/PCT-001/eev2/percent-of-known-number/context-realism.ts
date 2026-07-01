import type { EEV2DetailMode } from "../../../../../../../common/eev2/contracts";
import { realizeContextualAnswer } from "./answer-realism";
import {
  resolveEntityPolicy,
  type EntityRealismPolicy,
} from "./entity-policies";
import type { PercentOfKnownNumberRoleKind } from "./planner";
import {
  presentRealisticValue,
  type RealisticValueDisplay,
} from "./unit-policies";
import {
  preserveScenarioLabel,
  requireRealisticScenario,
} from "./scenario-realism";
import { requireRealisticMoneyScale } from "./money-realism";
import { requireValidEntityConstraints } from "./entity-constraints";

export const PERCENT_OF_KNOWN_NUMBER_REALISM_VERSION = "1.0.0" as const;

export interface PercentOfKnownNumberRealismContext {
  contextLabel?: string;
  semanticUnit: string;
}

export interface PercentOfKnownNumberRealismValues {
  knownUnitCount: number;
  knownQuantity: number;
  targetUnitCount: number;
  singleUnitValue: number;
  targetQuantity: number;
}

export interface PercentOfKnownNumberRealismModel {
  policy: EntityRealismPolicy;
  known: RealisticValueDisplay;
  single: RealisticValueDisplay;
  target: RealisticValueDisplay;
  targetMath: RealisticValueDisplay;
  contextObject: string;
  sharedContext: string;
}

function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function buildPercentOfKnownNumberRealismModel(
  context: PercentOfKnownNumberRealismContext,
  values: PercentOfKnownNumberRealismValues,
): PercentOfKnownNumberRealismModel {
  const scenarioPolicy = requireRealisticScenario({
    contextLabel: context.contextLabel,
    semanticUnit: context.semanticUnit,
    knownRate: values.knownUnitCount,
    targetRate: values.targetUnitCount,
  });
  const entityPolicy = resolveEntityPolicy(
    context.semanticUnit,
    scenarioPolicy.normalizedLabel,
  );
  const policy = preserveScenarioLabel(entityPolicy, scenarioPolicy);
  if (policy.entityKind === "MONEY") {
    requireRealisticMoneyScale({
      contextLabel: policy.contextLabel,
      knownRate: values.knownUnitCount,
      knownAmount: values.knownQuantity,
      targetRate: values.targetUnitCount,
      targetAmount: values.targetQuantity,
    });
  }
  requireValidEntityConstraints({
    contextLabel: policy.contextLabel,
    semanticUnit: context.semanticUnit,
    knownRate: values.knownUnitCount,
    targetRate: values.targetUnitCount,
    targetQuantity: values.targetQuantity,
  });
  const contextObject =
    policy.entityKind === "ABSTRACT"
      ? "the number"
      : `the ${policy.contextLabel}`;
  const arithmeticPolicy = {
    ...policy,
    integerPresentation: false,
    allowDecimals: true,
  };
  return {
    policy,
    known: presentRealisticValue(values.knownQuantity, policy),
    single: presentRealisticValue(values.singleUnitValue, arithmeticPolicy),
    target: presentRealisticValue(values.targetQuantity, policy),
    targetMath: presentRealisticValue(values.targetQuantity, arithmeticPolicy),
    contextObject,
    sharedContext:
      policy.entityKind === "ABSTRACT"
        ? "the same number"
        : contextObject,
  };
}

export function realizeContextualRoleSentence(input: {
  traceId: string;
  detailMode: EEV2DetailMode;
  roleKind: PercentOfKnownNumberRoleKind;
  values: PercentOfKnownNumberRealismValues;
  model: PercentOfKnownNumberRealismModel;
}): string {
  const { values, model, roleKind } = input;
  const variant =
    stableHash(
      [
        input.traceId,
        input.detailMode,
        roleKind,
        model.policy.contextLabel,
        values.knownUnitCount,
        values.knownQuantity,
        values.targetUnitCount,
      ].join("|"),
    ) % 8;
  const knownRate = String(values.knownUnitCount);
  const targetRate = String(values.targetUnitCount);
  const context = model.contextObject;

  switch (roleKind) {
    case "RELATIONSHIP_CONTEXT":
      return [
        `We are working with two percentages of ${context}.`,
        `We are comparing two percentages of ${context}.`,
        `We know one percentage of ${context} and need another.`,
        `We need to move from one percentage of ${context} to another.`,
        `We can use the known percentage of ${context} to find the required one.`,
        `We are finding a new percentage of ${context}.`,
        `We can see that both percentage values belong to ${context}.`,
        `We will first connect the known percentage of ${context} with the required percentage.`,
      ][variant]!;
    case "KNOWN_UNIT_MAPPING":
      return [
        `${knownRate}% of ${context} equals ${model.known.display}.`,
        `Here, ${model.known.display} represents ${knownRate}% of ${context}.`,
        `The question gives ${knownRate}% of ${context} as ${model.known.display}.`,
        `We know that ${knownRate}% of ${context} is ${model.known.display}.`,
        `The given information is ${knownRate}% of ${context} = ${model.known.display}.`,
        `${model.known.display} is the value of ${knownRate}% of ${context}.`,
        `In this question, ${knownRate}% of ${context} stands for ${model.known.display}.`,
        `Start with the given relation: ${knownRate}% of ${context} is ${model.known.display}.`,
      ][variant]!;
    case "SINGLE_UNIT_DERIVATION":
      return [
        `To find 1% of ${context}, divide ${model.known.display} by ${knownRate}.`,
        `First divide ${model.known.display} by ${knownRate} to find 1% of ${context}.`,
        `One percent of ${context} is found by sharing ${model.known.display} across ${knownRate} equal percentage parts.`,
        `Since ${knownRate}% is known, divide by ${knownRate} to get 1% of ${context}.`,
        `Find 1% of ${context} by dividing the known value by ${knownRate}.`,
        `The value of 1% comes from ${model.known.display} divided by ${knownRate}.`,
        `Each 1% part is found by splitting ${model.known.display} into ${knownRate} equal parts.`,
        `Begin with 1% of ${context}: divide ${model.known.display} by ${knownRate}.`,
      ][variant]!;
    case "TARGET_UNIT_IDENTIFICATION":
      return [
        `Now we need ${targetRate}% of ${context}.`,
        `The question asks for ${targetRate}% of ${context}.`,
        `Next, use the 1% value to find ${targetRate}% of ${context}.`,
        `The required share is ${targetRate}% of ${context}.`,
        `Our target is ${targetRate}% of ${context}.`,
        `We can now move from 1% to ${targetRate}% of ${context}.`,
        `The percentage we still need is ${targetRate}%.`,
        `Now turn the 1% value into ${targetRate}% of ${context}.`,
      ][variant]!;
    case "TARGET_SCALE_DERIVATION":
      return [
        `Multiply the 1% value of ${context}, ${model.single.display}, by ${targetRate}.`,
        `For ${targetRate}% of ${context}, use its 1% value ${targetRate} times.`,
        `Now multiply the 1% value of ${context}, ${model.single.display}, by ${targetRate}.`,
        `${targetRate}% of ${context} is ${targetRate} times its 1% value.`,
        `Scale the 1% value of ${context} up by ${targetRate}.`,
        `Take ${targetRate} times the value of 1% of ${context}.`,
        `Use ${model.single.display} for each of the ${targetRate} percentage parts.`,
        `From 1% to ${targetRate}%, multiply ${model.single.display} by ${targetRate}.`,
      ][variant]!;
    case "ANSWER_INTERPRETATION":
      return realizeContextualAnswer({
        targetRate,
        targetDisplay: model.target.display,
        policy: model.policy,
        variant,
      });
    case "VERIFICATION":
      return [
        `As a check, the 1% value used ${knownRate} times gives ${model.known.display}.`,
        `Check: multiplying the 1% value by ${knownRate} returns ${model.known.display}.`,
        `The given relation is recovered when the 1% value is multiplied by ${knownRate}.`,
        `A quick check gives the original ${knownRate}% value, ${model.known.display}.`,
        `To verify it, use the 1% value ${knownRate} times and get ${model.known.display}.`,
        `The check agrees with the question: ${knownRate}% gives ${model.known.display}.`,
        `Going back to ${knownRate}% reproduces the given ${model.known.display}.`,
        `This is consistent because ${knownRate} copies of the 1% value make ${model.known.display}.`,
      ][variant]!;
  }
}
