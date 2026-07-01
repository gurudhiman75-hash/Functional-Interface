import type { EEV2DetailMode } from "../../../../../../../common/eev2/contracts";
import type {
  PercentOfKnownNumberRealismModel,
  PercentOfKnownNumberRealismValues,
} from "./context-realism";
import type { PedagogicalIntent } from "./pedagogical-intent";
import type { PercentOfKnownNumberRoleKind } from "./planner";

export interface IntentRenderedRole {
  sentence: string;
  suppressMath: boolean;
}

function divisionSentence(
  detailMode: EEV2DetailMode,
  values: PercentOfKnownNumberRealismValues,
  model: PercentOfKnownNumberRealismModel,
): string {
  const knownRate = String(values.knownUnitCount);
  if (detailMode === "short") {
    return (
      `Because ${knownRate}% of ${model.contextObject} has ${knownRate} equal 1% parts, ` +
      `divide ${model.known.display} by ${knownRate}.`
    );
  }
  if (detailMode === "standard") {
    return (
      `Because ${knownRate}% of ${model.contextObject} has ${knownRate} equal 1% parts, ` +
      `divide ${model.known.display} by ${knownRate}.`
    );
  }
  return (
    `Because ${knownRate}% has ${knownRate} equal parts, dividing ${model.known.display} ` +
    `by ${knownRate} gives 1% of ${model.contextObject}.`
  );
}

function multiplicationSentence(
  detailMode: EEV2DetailMode,
  values: PercentOfKnownNumberRealismValues,
  model: PercentOfKnownNumberRealismModel,
): string {
  const targetRate = String(values.targetUnitCount);
  if (detailMode === "short") {
    return (
      `Use the 1% value ${targetRate} times to get ${targetRate}% of ${model.contextObject}.`
    );
  }
  if (detailMode === "standard") {
    return (
      `Because 1% is known, multiply its value by ${targetRate} to get ${targetRate}% of ${model.contextObject}.`
    );
  }
  return (
    `Since 1% is one part, multiply its value by ${targetRate} ` +
    `to get ${targetRate}% of ${model.contextObject}.`
  );
}

function equalRateSentence(
  roleKind: PercentOfKnownNumberRoleKind,
  values: PercentOfKnownNumberRealismValues,
  model: PercentOfKnownNumberRealismModel,
): IntentRenderedRole | undefined {
  const rate = String(values.knownUnitCount);
  const variant =
    Math.abs(
      Math.trunc(
        values.knownUnitCount * 31 +
          values.knownQuantity * 17 +
          values.targetUnitCount * 13,
      ),
    ) % 4;
  switch (roleKind) {
    case "RELATIONSHIP_CONTEXT":
      return {
        sentence: [
          `The required percentage is the same ${rate}% already given for ${model.contextObject}.`,
          `The question asks for the same ${rate}% that is already known.`,
          `Here, the given and required percentages are both ${rate}%.`,
          `We do not need a new percentage because ${rate}% is already provided.`,
        ][variant]!,
        suppressMath: true,
      };
    case "KNOWN_UNIT_MAPPING":
      return {
        sentence: `${rate}% of ${model.contextObject} is ${model.known.display}.`,
        suppressMath: true,
      };
    case "SINGLE_UNIT_DERIVATION":
      return {
        sentence: [
          "There is no need to find 1% because the requested percentage is already known.",
          "Finding 1% would add an unnecessary step here.",
          "We can skip the 1% step because both percentages are equal.",
          "A one-percent calculation is unnecessary in this case.",
        ][variant]!,
        suppressMath: true,
      };
    case "TARGET_UNIT_IDENTIFICATION":
      return {
        sentence: `The question asks for that same ${rate}% of ${model.contextObject}.`,
        suppressMath: true,
      };
    case "TARGET_SCALE_DERIVATION":
      return {
        sentence: [
          "No multiplication or scaling is needed.",
          "The value does not need to be scaled.",
          "There is no change from the given percentage.",
          "No further calculation is required.",
        ][variant]!,
        suppressMath: true,
      };
    case "ANSWER_INTERPRETATION":
      return {
        sentence: `So ${rate}% of ${model.contextObject} remains ${model.target.display}.`,
        suppressMath: true,
      };
    case "VERIFICATION":
      return {
        sentence: "The requested percentage and the given percentage are identical.",
        suppressMath: true,
      };
  }
}

export function renderPedagogicalIntent(input: {
  detailMode: EEV2DetailMode;
  roleKind: PercentOfKnownNumberRoleKind;
  values: PercentOfKnownNumberRealismValues;
  model: PercentOfKnownNumberRealismModel;
  intent: PedagogicalIntent;
  fallbackSentence: string;
}): IntentRenderedRole {
  if (input.intent.conciseEqualRate) {
    return (
      equalRateSentence(input.roleKind, input.values, input.model) ?? {
        sentence: input.fallbackSentence,
        suppressMath: false,
      }
    );
  }

  if (input.roleKind === "SINGLE_UNIT_DERIVATION") {
    return {
      sentence: divisionSentence(input.detailMode, input.values, input.model),
      suppressMath: false,
    };
  }
  if (input.roleKind === "TARGET_SCALE_DERIVATION") {
    return {
      sentence: multiplicationSentence(
        input.detailMode,
        input.values,
        input.model,
      ),
      suppressMath: false,
    };
  }
  return {
    sentence: input.fallbackSentence,
    suppressMath: false,
  };
}
