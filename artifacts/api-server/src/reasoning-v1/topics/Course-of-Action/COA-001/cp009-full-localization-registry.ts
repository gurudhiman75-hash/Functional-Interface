import { COA_CP009_LOCALIZED_CP001 } from "./cp009-localized-cp001.ts";
import { COA_CP009_LOCALIZED_CP002 } from "./cp009-localized-cp002.ts";
import { COA_CP009_LOCALIZED_CP003 } from "./cp009-localized-cp003.ts";
import { COA_CP009_LOCALIZED_CP004 } from "./cp009-localized-cp004.ts";
import { COA_CP009_LOCALIZED_CP006 } from "./cp009-localized-cp006.ts";
import { COA_CP009_LOCALIZED_CP007 } from "./cp009-localized-cp007.ts";
import {
  COA_CP009_LOCALIZED_EITHER_PROFILES,
  COA_CP009_LOCALIZED_THREE_ACTION_PROFILES,
} from "./cp009-localized-profiles.ts";
import {
  COA_CP009_CALIBRATION,
  type CoaCp009EitherCalibration,
  type CoaCp009ThreeActionCalibration,
  type CoaCp009TwoActionCalibration,
} from "./cp009-localization-calibration.ts";
import type {
  CoaCp009FullLocale,
  CoaCp009LocalizedEitherText,
  CoaCp009LocalizedScenarioText,
  CoaCp009LocalizedThreeActionText,
} from "./cp009-localization-types.ts";

const APPROVED_CALIBRATION_ORDINARY_IDS = new Set([
  "COA-SC-001", "COA-SC-005", "COA-SC-007", "COA-SC-011",
  "COA-SC-013", "COA-SC-017", "COA-SC-022", "COA-SC-023",
]);

function fromCalibrationTwo(entry: CoaCp009TwoActionCalibration): CoaCp009LocalizedScenarioText {
  return Object.freeze({
    semanticAuthorityId: entry.semanticAuthorityId,
    locale: entry.locale,
    statement: entry.statement,
    actions: entry.actions,
  });
}

function fromCalibrationEither(entry: CoaCp009EitherCalibration): CoaCp009LocalizedEitherText {
  return Object.freeze({
    semanticAuthorityId: entry.semanticAuthorityId,
    locale: entry.locale,
    statement: entry.statement,
    actions: entry.actions,
    pairReason: entry.pairReason,
  });
}

function fromCalibrationThree(entry: CoaCp009ThreeActionCalibration): CoaCp009LocalizedThreeActionText {
  return Object.freeze({
    semanticAuthorityId: entry.semanticAuthorityId,
    locale: entry.locale,
    statement: entry.statement,
    actions: entry.actions,
  });
}

const BATCH_ORDINARY = Object.freeze([
  ...COA_CP009_LOCALIZED_CP001,
  ...COA_CP009_LOCALIZED_CP002,
  ...COA_CP009_LOCALIZED_CP003,
  ...COA_CP009_LOCALIZED_CP004,
  ...COA_CP009_LOCALIZED_CP006,
  ...COA_CP009_LOCALIZED_CP007,
]);

const APPROVED_CALIBRATION_TWO = COA_CP009_CALIBRATION
  .filter((entry): entry is CoaCp009TwoActionCalibration => entry.kind === "TWO_ACTION")
  .map(fromCalibrationTwo);

const APPROVED_CALIBRATION_EITHER = COA_CP009_CALIBRATION
  .filter((entry): entry is CoaCp009EitherCalibration => entry.kind === "EITHER")
  .map(fromCalibrationEither);

const APPROVED_CALIBRATION_THREE = COA_CP009_CALIBRATION
  .filter((entry): entry is CoaCp009ThreeActionCalibration => entry.kind === "THREE_ACTION")
  .map(fromCalibrationThree);

export const COA_CP009_FULL_LOCALIZED_ORDINARY: readonly CoaCp009LocalizedScenarioText[] = Object.freeze([
  ...BATCH_ORDINARY.filter((entry) => !APPROVED_CALIBRATION_ORDINARY_IDS.has(entry.semanticAuthorityId)),
  ...APPROVED_CALIBRATION_TWO,
]);

export const COA_CP009_FULL_LOCALIZED_EITHER: readonly CoaCp009LocalizedEitherText[] = Object.freeze([
  ...COA_CP009_LOCALIZED_EITHER_PROFILES.filter((entry) => entry.semanticAuthorityId !== "COA-EITHER-002"),
  ...APPROVED_CALIBRATION_EITHER,
]);

export const COA_CP009_FULL_LOCALIZED_THREE_ACTION: readonly CoaCp009LocalizedThreeActionText[] = Object.freeze([
  ...COA_CP009_LOCALIZED_THREE_ACTION_PROFILES.filter((entry) => entry.semanticAuthorityId !== "COA-3A-003"),
  ...APPROVED_CALIBRATION_THREE,
]);

export function getCoaCp009LocalizedOrdinary(
  semanticAuthorityId: string,
  locale: CoaCp009FullLocale,
): CoaCp009LocalizedScenarioText {
  const found = COA_CP009_FULL_LOCALIZED_ORDINARY.find(
    (entry) => entry.semanticAuthorityId === semanticAuthorityId && entry.locale === locale,
  );
  if (!found) throw new Error(`CP009 missing ordinary localization for ${semanticAuthorityId}/${locale}`);
  return found;
}

export function getCoaCp009LocalizedEither(
  semanticAuthorityId: string,
  locale: CoaCp009FullLocale,
): CoaCp009LocalizedEitherText {
  const found = COA_CP009_FULL_LOCALIZED_EITHER.find(
    (entry) => entry.semanticAuthorityId === semanticAuthorityId && entry.locale === locale,
  );
  if (!found) throw new Error(`CP009 missing Either localization for ${semanticAuthorityId}/${locale}`);
  return found;
}

export function getCoaCp009LocalizedThreeAction(
  semanticAuthorityId: string,
  locale: CoaCp009FullLocale,
): CoaCp009LocalizedThreeActionText {
  const found = COA_CP009_FULL_LOCALIZED_THREE_ACTION.find(
    (entry) => entry.semanticAuthorityId === semanticAuthorityId && entry.locale === locale,
  );
  if (!found) throw new Error(`CP009 missing three-action localization for ${semanticAuthorityId}/${locale}`);
  return found;
}

export const COA_CP009_FULL_LOCALIZATION_COUNTS = Object.freeze({
  ordinarySemanticAuthorities: 120,
  ordinaryLocalizedSurfaces: 240,
  eitherSemanticAuthorities: 4,
  eitherLocalizedSurfaces: 8,
  threeActionSemanticAuthorities: 6,
  threeActionLocalizedSurfaces: 12,
  totalSemanticAuthorities: 130,
  totalLocalizedSurfaces: 260,
});
