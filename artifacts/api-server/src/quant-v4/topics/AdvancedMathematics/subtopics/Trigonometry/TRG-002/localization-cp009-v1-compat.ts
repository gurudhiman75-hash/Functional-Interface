import { createHash } from "node:crypto";

import { exactToNumber } from "../foundation/exact";
import { generateFrozenTrg002Production96Question } from "./production-frozen-96-runtime";
import {
  TRG_002_CP009_LOCALIZATION_QL_IDS,
  TRG_002_CP009_LOCALIZATION_VERSION,
  localizeFrozenTrg002Cp009Question,
  trg002Cp009CanonicalSemanticFingerprint,
  type Trg002Cp009LocalizedLocale,
} from "./localization-cp009-v1";

type AnyQuestion = Record<string, any>;

function stableJson(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current);
}

function sha256(value: unknown) {
  return createHash("sha256").update(typeof value === "string" ? value : stableJson(value), "utf8").digest("hex");
}

function point(state: AnyQuestion, id: string) {
  const found = state.points.find((item: AnyQuestion) => item.id === id);
  if (!found) throw new Error(`TRG-002 CP009 compat: missing point ${id}.`);
  return found;
}

function normalizedRequestedProjection(canonicalQuestion: AnyQuestion) {
  if (canonicalQuestion.lockedFamily === "COMPARATIVE_TWO_OBJECT_CONTROLLED") return canonicalQuestion.canonicalSpatialState;
  const state = canonicalQuestion.canonicalSpatialState as AnyQuestion;
  if (!Array.isArray(state.observations) || state.observations.length < 2) return state;

  const observations = state.observations.map((observation: AnyQuestion) => {
    const eye = point(state, observation.eyePointId);
    const target = point(state, observation.targetPointId);
    return { observation, distance: Math.abs(exactToNumber(eye.x) - exactToNumber(target.x)) };
  }).sort((a: AnyQuestion, b: AnyQuestion) => a.distance - b.distance);

  const near = observations[0]?.observation;
  const far = observations[observations.length - 1]?.observation;
  if (!near || !far) return state;

  const mode = String(canonicalQuestion.solveMode);
  let requested = state.requested;
  if (mode.includes("NearDistance")) {
    requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: near.observation?.targetPointId ?? near.targetPointId, toPointId: near.eyePointId };
  } else if (mode.includes("FarDistance") || mode.includes("OriginalDistance") || mode.includes("FinalDistance") || mode.includes("recoverOriginalDistance")) {
    requested = { kind: "HORIZONTAL_DISTANCE", fromPointId: far.observation?.targetPointId ?? far.targetPointId, toPointId: far.eyePointId };
  } else if (mode.includes("Movement") && state.movements?.[0]) {
    requested = { kind: "MOVEMENT_DISTANCE", movementId: state.movements[0].id };
  } else if (mode.includes("Height") && state.verticalObjects?.[0]) {
    requested = { kind: "OBJECT_HEIGHT", objectId: state.verticalObjects[0].id };
  }

  return requested === state.requested ? state : { ...state, requested };
}

/**
 * CP009's earliest proof projections sometimes kept a generic requested field
 * even when the frozen solveMode already identifies a near/far/original target.
 * The solveMode is frozen semantic authority for the learner request. We use a
 * temporary requested projection only to select the correct localized wording,
 * then restore the exact canonical state and fingerprint before returning.
 */
export function localizeFrozenTrg002Cp009QuestionCompat(
  canonicalQuestion: AnyQuestion,
  locale: Trg002Cp009LocalizedLocale,
) {
  const canonicalSemanticFingerprint = trg002Cp009CanonicalSemanticFingerprint(canonicalQuestion);
  const normalizedState = normalizedRequestedProjection(canonicalQuestion);
  const renderProjection = normalizedState === canonicalQuestion.canonicalSpatialState
    ? canonicalQuestion
    : { ...canonicalQuestion, canonicalSpatialState: normalizedState };
  const rendered: AnyQuestion = localizeFrozenTrg002Cp009Question(renderProjection, locale);
  const localizationFingerprint = sha256({
    version: TRG_002_CP009_LOCALIZATION_VERSION,
    locale,
    qlId: canonicalQuestion.qlId,
    seed: canonicalQuestion.seed,
    canonicalSemanticFingerprint,
    stem: rendered.stem,
    explanation: rendered.explanation,
  });

  return {
    ...rendered,
    canonicalSpatialState: canonicalQuestion.canonicalSpatialState,
    localizationProof: {
      ...rendered.localizationProof,
      canonicalSemanticFingerprint,
      localizationFingerprint,
      renderingRequestedProjectionNormalized: normalizedState !== canonicalQuestion.canonicalSpatialState,
      frozenCanonicalSpatialStatePreserved: true,
    },
  };
}

export function generateLocalizedTrg002Cp009QuestionCompat(
  qlId: string,
  seed: string,
  locale: Trg002Cp009LocalizedLocale,
) {
  if (!TRG_002_CP009_LOCALIZATION_QL_IDS.includes(qlId)) throw new Error(`${qlId}: outside TRG-CP-009 localization scope.`);
  return localizeFrozenTrg002Cp009QuestionCompat(
    generateFrozenTrg002Production96Question(qlId, seed) as AnyQuestion,
    locale,
  );
}
