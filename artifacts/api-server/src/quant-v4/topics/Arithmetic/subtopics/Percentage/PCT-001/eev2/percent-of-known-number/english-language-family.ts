import type { EEV2DetailMode } from "../../../../../../../common/eev2/contracts";
import type { PercentOfKnownNumberRoleKind } from "./planner";

export const PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_VERSION =
  "1.0.0" as const;

export interface EnglishRoleAsset {
  sentenceTemplate: string;
  mathTemplate?: string;
}

export type PercentOfKnownNumberEnglishAssets = Readonly<
  Record<
    EEV2DetailMode,
    Readonly<Record<PercentOfKnownNumberRoleKind, EnglishRoleAsset>>
  >
>;

export const PERCENT_OF_KNOWN_NUMBER_ENGLISH_ASSETS: PercentOfKnownNumberEnglishAssets =
  {
    short: {
      RELATIONSHIP_CONTEXT: {
        sentenceTemplate:
          "{{knownUnitCount}}% corresponds to {{knownQuantity}}.",
      },
      KNOWN_UNIT_MAPPING: {
        sentenceTemplate:
          "The known quantity belongs to {{knownUnitCount}} percentage points.",
      },
      SINGLE_UNIT_DERIVATION: {
        sentenceTemplate: "Find the value of 1%.",
        mathTemplate:
          "1\\% = {{knownQuantity}} \\div {{knownUnitCount}} = {{singleUnitValue}}",
      },
      TARGET_UNIT_IDENTIFICATION: {
        sentenceTemplate: "We need {{targetUnitCount}}%.",
      },
      TARGET_SCALE_DERIVATION: {
        sentenceTemplate: "Scale the value of 1% to {{targetUnitCount}}%.",
        mathTemplate:
          "{{targetUnitCount}}\\% = {{singleUnitValue}} \\times {{targetUnitCount}} = {{targetQuantity}}",
      },
      ANSWER_INTERPRETATION: {
        sentenceTemplate: "So, {{answerInterpretation}}.",
      },
      VERIFICATION: {
        sentenceTemplate: "Check the known percentage.",
        mathTemplate:
          "{{singleUnitValue}} \\times {{knownUnitCount}} = {{knownQuantity}}",
      },
    },
    standard: {
      RELATIONSHIP_CONTEXT: {
        sentenceTemplate:
          "{{knownUnitCount}}% of the number corresponds to {{knownQuantity}}.",
      },
      KNOWN_UNIT_MAPPING: {
        sentenceTemplate:
          "{{knownUnitCount}} percentage points have a value of {{knownQuantity}}.",
      },
      SINGLE_UNIT_DERIVATION: {
        sentenceTemplate:
          "Divide by {{knownUnitCount}} to find the value of 1%.",
        mathTemplate:
          "1\\% = {{knownQuantity}} \\div {{knownUnitCount}} = {{singleUnitValue}}",
      },
      TARGET_UNIT_IDENTIFICATION: {
        sentenceTemplate:
          "The question asks for {{targetUnitCount}}% of the same number.",
      },
      TARGET_SCALE_DERIVATION: {
        sentenceTemplate:
          "Multiply the value of 1% by {{targetUnitCount}}.",
        mathTemplate:
          "{{targetUnitCount}}\\% = {{singleUnitValue}} \\times {{targetUnitCount}} = {{targetQuantity}}",
      },
      ANSWER_INTERPRETATION: {
        sentenceTemplate: "So, {{answerInterpretation}}.",
      },
      VERIFICATION: {
        sentenceTemplate:
          "Multiplying the value of 1% by {{knownUnitCount}} returns the known quantity.",
        mathTemplate:
          "{{singleUnitValue}} \\times {{knownUnitCount}} = {{knownQuantity}}",
      },
    },
    detailed: {
      RELATIONSHIP_CONTEXT: {
        sentenceTemplate:
          "{{knownUnitCount}}% of the number corresponds to {{knownQuantity}}.",
      },
      KNOWN_UNIT_MAPPING: {
        sentenceTemplate:
          "The value {{knownQuantity}} is shared equally across {{knownUnitCount}} percentage points.",
      },
      SINGLE_UNIT_DERIVATION: {
        sentenceTemplate:
          "Divide the known quantity by {{knownUnitCount}} because this gives the value of one percentage point.",
        mathTemplate:
          "1\\% = {{knownQuantity}} \\div {{knownUnitCount}} = {{singleUnitValue}}",
      },
      TARGET_UNIT_IDENTIFICATION: {
        sentenceTemplate:
          "The required quantity corresponds to {{targetUnitCount}} percentage points.",
      },
      TARGET_SCALE_DERIVATION: {
        sentenceTemplate:
          "Multiply the one-percent value by {{targetUnitCount}} to obtain the required quantity.",
        mathTemplate:
          "{{targetUnitCount}}\\% = {{singleUnitValue}} \\times {{targetUnitCount}} = {{targetQuantity}}",
      },
      ANSWER_INTERPRETATION: {
        sentenceTemplate: "So, {{answerInterpretation}}.",
      },
      VERIFICATION: {
        sentenceTemplate:
          "The one-percent value reproduces the given quantity when it is scaled back to {{knownUnitCount}}%.",
        mathTemplate:
          "{{singleUnitValue}} \\times {{knownUnitCount}} = {{knownQuantity}}",
      },
    },
  };
