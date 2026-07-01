import type { EEV2DetailMode } from "../../../../../../../common/eev2/contracts";
import type { PercentOfKnownNumberRoleKind } from "./planner";

export const PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION =
  "2.0.0" as const;

export interface EnglishV2RoleAsset {
  sentenceTemplates: readonly string[];
  mathTemplate?: string;
}

export type PercentOfKnownNumberEnglishV2Assets = Readonly<
  Record<
    EEV2DetailMode,
    Readonly<Record<PercentOfKnownNumberRoleKind, EnglishV2RoleAsset>>
  >
>;

const SINGLE_UNIT_MATH =
  "1\\% = {{knownQuantityMath}} \\div {{knownUnitCount}} = {{singleUnitValueMath}}";
const TARGET_MATH =
  "{{targetUnitCount}}\\% = {{singleUnitValueMath}} \\times {{targetUnitCount}} = {{targetQuantityMath}}";
const VERIFICATION_MATH =
  "{{singleUnitValueMath}} \\times {{knownUnitCount}} = {{knownQuantityMath}}";

export const PERCENT_OF_KNOWN_NUMBER_ENGLISH_V2_ASSETS:
  PercentOfKnownNumberEnglishV2Assets = {
    short: {
      RELATIONSHIP_CONTEXT: {
        sentenceTemplates: [
          "Both percentages refer to {{sharedContext}}.",
          "We are working with percentages of {{sharedContext}}.",
          "The two percentages are based on {{sharedContext}}.",
        ],
      },
      KNOWN_UNIT_MAPPING: {
        sentenceTemplates: [
          "{{knownUnitCount}}% of {{contextObject}} equals {{knownQuantityDisplay}}.",
          "Here, {{knownUnitCount}}% means {{knownQuantityDisplay}}.",
          "We know that {{knownUnitCount}}% is {{knownQuantityDisplay}}.",
        ],
      },
      SINGLE_UNIT_DERIVATION: {
        sentenceTemplates: [
          "For 1%, divide {{knownQuantityDisplay}} by {{knownUnitCount}}.",
          "Divide {{knownQuantityDisplay}} by {{knownUnitCount}} to get 1%.",
          "First find 1% by dividing by {{knownUnitCount}}.",
        ],
        mathTemplate: SINGLE_UNIT_MATH,
      },
      TARGET_UNIT_IDENTIFICATION: {
        sentenceTemplates: [
          "We need {{targetUnitCount}}% of {{contextObject}}.",
          "Now find {{targetUnitCount}}% of {{contextObject}}.",
          "The required share is {{targetUnitCount}}% of {{contextObject}}.",
        ],
      },
      TARGET_SCALE_DERIVATION: {
        sentenceTemplates: [
          "Multiply {{singleUnitValueDisplay}} by {{targetUnitCount}}.",
          "For {{targetUnitCount}}%, take {{targetUnitCount}} lots of {{singleUnitValueDisplay}}.",
          "Use the 1% value {{targetUnitCount}} times.",
        ],
        mathTemplate: TARGET_MATH,
      },
      ANSWER_INTERPRETATION: {
        sentenceTemplates: [
          "So, {{targetUnitCount}}% is {{targetQuantityDisplay}}.",
          "The required value is {{targetQuantityDisplay}}.",
          "That gives {{targetQuantityDisplay}}.",
        ],
      },
      VERIFICATION: {
        sentenceTemplates: ["Check it against the given percentage."],
        mathTemplate: VERIFICATION_MATH,
      },
    },
    standard: {
      RELATIONSHIP_CONTEXT: {
        sentenceTemplates: [
          "Both percentages refer to {{sharedContext}}.",
          "The question compares two percentages of {{sharedContext}}.",
          "We are finding another percentage of {{sharedContext}}.",
        ],
      },
      KNOWN_UNIT_MAPPING: {
        sentenceTemplates: [
          "{{knownUnitCount}}% of {{contextObject}} equals {{knownQuantityDisplay}}.",
          "The question tells us that {{knownUnitCount}}% is {{knownQuantityDisplay}}.",
          "Here, {{knownUnitCount}}% represents {{knownQuantityDisplay}}.",
        ],
      },
      SINGLE_UNIT_DERIVATION: {
        sentenceTemplates: [
          "To find 1%, divide {{knownQuantityDisplay}} by {{knownUnitCount}}.",
          "Divide by {{knownUnitCount}} to find the value of 1%.",
          "First work out 1% by dividing {{knownQuantityDisplay}} by {{knownUnitCount}}.",
        ],
        mathTemplate: SINGLE_UNIT_MATH,
      },
      TARGET_UNIT_IDENTIFICATION: {
        sentenceTemplates: [
          "We need {{targetUnitCount}}% of {{contextObject}}.",
          "The question asks for {{targetUnitCount}}% of {{contextObject}}.",
          "Now use the 1% value to find {{targetUnitCount}}% of {{contextObject}}.",
        ],
      },
      TARGET_SCALE_DERIVATION: {
        sentenceTemplates: [
          "Multiply {{singleUnitValueDisplay}} by {{targetUnitCount}}.",
          "Take {{targetUnitCount}} times the value of 1%.",
          "Use the 1% value {{targetUnitCount}} times.",
        ],
        mathTemplate: TARGET_MATH,
      },
      ANSWER_INTERPRETATION: {
        sentenceTemplates: [
          "So, {{targetUnitCount}}% of {{contextObject}} equals {{targetQuantityDisplay}}.",
          "Therefore, the required amount is {{targetQuantityDisplay}}.",
          "This gives a final value of {{targetQuantityDisplay}}.",
        ],
      },
      VERIFICATION: {
        sentenceTemplates: [
          "Multiplying the 1% value by {{knownUnitCount}} gives the original {{knownQuantityDisplay}}.",
        ],
        mathTemplate: VERIFICATION_MATH,
      },
    },
    detailed: {
      RELATIONSHIP_CONTEXT: {
        sentenceTemplates: [
          "Both percentages refer to {{sharedContext}}.",
          "The question compares two percentages of {{sharedContext}}.",
          "We are finding another percentage of {{sharedContext}}.",
        ],
      },
      KNOWN_UNIT_MAPPING: {
        sentenceTemplates: [
          "{{knownUnitCount}}% of {{contextObject}} equals {{knownQuantityDisplay}}.",
          "The question tells us that {{knownUnitCount}}% is {{knownQuantityDisplay}}.",
          "Here, {{knownUnitCount}}% represents {{knownQuantityDisplay}}.",
        ],
      },
      SINGLE_UNIT_DERIVATION: {
        sentenceTemplates: [
          "Divide {{knownQuantityDisplay}} by {{knownUnitCount}} because this gives the value of 1%.",
          "To find 1%, share {{knownQuantityDisplay}} equally across {{knownUnitCount}} percent.",
          "First divide by {{knownUnitCount}} to see what 1% is worth.",
        ],
        mathTemplate: SINGLE_UNIT_MATH,
      },
      TARGET_UNIT_IDENTIFICATION: {
        sentenceTemplates: [
          "We need {{targetUnitCount}}% of {{contextObject}}.",
          "The required share is {{targetUnitCount}}% of {{contextObject}}.",
          "Now use the 1% value to find {{targetUnitCount}}% of {{contextObject}}.",
        ],
      },
      TARGET_SCALE_DERIVATION: {
        sentenceTemplates: [
          "Multiply {{singleUnitValueDisplay}} by {{targetUnitCount}}.",
          "Take {{targetUnitCount}} times the value of 1%.",
          "Use the 1% value {{targetUnitCount}} times.",
        ],
        mathTemplate: TARGET_MATH,
      },
      ANSWER_INTERPRETATION: {
        sentenceTemplates: [
          "So, {{targetUnitCount}}% of {{contextObject}} equals {{targetQuantityDisplay}}.",
          "Therefore, the required amount is {{targetQuantityDisplay}}.",
          "This gives a final value of {{targetQuantityDisplay}}.",
        ],
      },
      VERIFICATION: {
        sentenceTemplates: [
          "As a check, multiplying the 1% value by {{knownUnitCount}} gives {{knownQuantityDisplay}}.",
          "Check the result by rebuilding the given {{knownUnitCount}}%.",
          "The 1% value returns to {{knownQuantityDisplay}} when used {{knownUnitCount}} times.",
        ],
        mathTemplate: VERIFICATION_MATH,
      },
    },
  };
