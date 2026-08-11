import { SPATIAL_FAN_PRIMITIVE_POOL_V2 } from "./primitive-chapter-pools-v2";
import { getSpatialPrimitiveV2 } from "./primitive-library-v2";
import { spatialSceneSemanticFingerprint } from "./normalize";
import { generateSpatialSeriesProofQuestion } from "./series-proof-generator";
import { spatialSeriesPresentationForRule } from "./series-rule-authority";
import type {
  SpatialSeriesCardinal,
  SpatialSeriesFrameState,
  SpatialSeriesProofDefinition,
  SpatialSeriesProofQuestion,
  SpatialSeriesRuleId,
} from "./series-types";
import { SPATIAL_FSR_SYNTHESIS_RULE_IDS_V1 } from "./production-synthesis-v1";
import { validateSpatialScene } from "./validator";

export interface SpatialFsrSafeStateCatalogEntryV2 {
  ruleId: SpatialSeriesRuleId;
  initialState: SpatialSeriesFrameState;
  contentFingerprint: string;
}

export interface SpatialFsrBuiltContentV2 {
  payload: SpatialSeriesProofQuestion;
  contentFingerprint: string;
  deliveryFingerprint: string;
}

const CARDINALS: readonly SpatialSeriesCardinal[] = ["TOP", "RIGHT", "BOTTOM", "LEFT"] as const;

const FSR_DISTRACTORS_V2: Record<SpatialSeriesRuleId, readonly [SpatialSeriesRuleId, SpatialSeriesRuleId, SpatialSeriesRuleId]> = {
  ROTATE_90_CW: ["ROTATE_90_CCW", "ROTATE_180", "NO_CHANGE"],
  ROTATE_90_CCW: ["ROTATE_90_CW", "ROTATE_180", "NO_CHANGE"],
  ROTATE_180: ["ROTATE_90_CW", "ROTATE_90_CCW", "NO_CHANGE"],
  MOVE_MARKER_CW: ["MOVE_MARKER_CCW", "MOVE_MARKER_180", "NO_CHANGE"],
  MOVE_MARKER_CCW: ["MOVE_MARKER_CW", "MOVE_MARKER_180", "NO_CHANGE"],
  MOVE_MARKER_180: ["MOVE_MARKER_CW", "MOVE_MARKER_CCW", "NO_CHANGE"],
  MOVE_DOTS_CW: ["MOVE_DOTS_CCW", "MOVE_DOTS_180", "NO_CHANGE"],
  MOVE_DOTS_CCW: ["MOVE_DOTS_CW", "MOVE_DOTS_180", "NO_CHANGE"],
  MOVE_DOTS_180: ["MOVE_DOTS_CW", "MOVE_DOTS_CCW", "NO_CHANGE"],
  INCREASE_DOTS: ["DECREASE_DOTS", "MOVE_DOTS_CW", "NO_CHANGE"],
  DECREASE_DOTS: ["INCREASE_DOTS", "MOVE_DOTS_CCW", "NO_CHANGE"],
  ROTATE_90_CW_MOVE_MARKER_CCW: ["ROTATE_90_CW", "MOVE_MARKER_CCW", "ROTATE_90_CCW"],
  ROTATE_90_CCW_MOVE_DOTS_CW: ["ROTATE_90_CCW", "MOVE_DOTS_CW", "ROTATE_90_CW"],
  NO_CHANGE: ["ROTATE_90_CW", "MOVE_MARKER_CW", "MOVE_DOTS_CW"],
};

export const SPATIAL_FSR_PERIOD_FOUR_PRIMITIVES_V2 = SPATIAL_FAN_PRIMITIVE_POOL_V2.filter(
  (primitiveId) => getSpatialPrimitiveV2(primitiveId).rotationPeriodQuarterTurns === 4,
);

function validateCorrectSlot(index: number): asserts index is 0 | 1 | 2 | 3 {
  if (!Number.isInteger(index) || index < 0 || index > 3) {
    throw new Error(`FSR V2 correct option index '${index}' must be in 0..3.`);
  }
}

export function buildSpatialFsrContentFromStateV2(input: {
  ruleId: SpatialSeriesRuleId;
  initialState: SpatialSeriesFrameState;
  correctOptionIndex: number;
  prototypeId: string;
}): SpatialFsrBuiltContentV2 {
  validateCorrectSlot(input.correctOptionIndex);
  if (!SPATIAL_FSR_SYNTHESIS_RULE_IDS_V1.includes(input.ruleId)) {
    throw new Error(`Unsupported FSR V2 rule '${input.ruleId}'.`);
  }
  const definition: SpatialSeriesProofDefinition = {
    prototypeId: input.prototypeId,
    ruleId: input.ruleId as SpatialSeriesProofDefinition["ruleId"],
    initialState: { ...input.initialState },
    presentationProfile: spatialSeriesPresentationForRule(input.ruleId),
    distractorRuleIds: [...FSR_DISTRACTORS_V2[input.ruleId]],
    desiredCorrectOptionIndex: input.correctOptionIndex,
  };
  const payload = generateSpatialSeriesProofQuestion(definition);
  const allScenes = [...payload.seriesScenes, ...payload.options.map((option) => option.scene)];
  if (!allScenes.every((scene) => validateSpatialScene(scene).ok)) {
    throw new Error(`${input.prototypeId}: FSR V2 scene validation failed.`);
  }
  const seriesFingerprints = payload.seriesScenes.map(spatialSceneSemanticFingerprint);
  const optionFingerprints = payload.options.map((option) => option.sceneFingerprint);
  if (new Set(optionFingerprints).size !== 4) {
    throw new Error(`${input.prototypeId}: FSR V2 option scenes are not unique.`);
  }
  const contentFingerprint = [
    "FSR-001",
    input.ruleId,
    seriesFingerprints.join("||"),
    [...optionFingerprints].sort().join("||"),
  ].join("::");
  const deliveryFingerprint = [
    contentFingerprint,
    String(input.correctOptionIndex),
    optionFingerprints.join("||"),
  ].join("::DELIVERY::");
  return { payload, contentFingerprint, deliveryFingerprint };
}

function enumerateInitialStates(ruleId: SpatialSeriesRuleId): SpatialSeriesFrameState[] {
  const states: SpatialSeriesFrameState[] = [];
  const dotCounts = ruleId === "INCREASE_DOTS" ? [1] as const : [1, 2, 3, 4] as const;
  for (const primitiveId of SPATIAL_FSR_PERIOD_FOUR_PRIMITIVES_V2) {
    for (const rotationQuarterTurns of [0, 1, 2, 3] as const) {
      for (const markerPosition of CARDINALS) {
        for (const dotAnchor of CARDINALS) {
          for (const dotCount of dotCounts) {
            states.push({ primitiveId, rotationQuarterTurns, markerPosition, dotAnchor, dotCount });
          }
        }
      }
    }
  }
  return states;
}

const cache = new Map<SpatialSeriesRuleId, readonly SpatialFsrSafeStateCatalogEntryV2[]>();

export function buildSpatialFsrSafeStateCatalogV2(
  ruleId: SpatialSeriesRuleId,
): readonly SpatialFsrSafeStateCatalogEntryV2[] {
  const cached = cache.get(ruleId);
  if (cached) return cached;
  if (!SPATIAL_FSR_SYNTHESIS_RULE_IDS_V1.includes(ruleId)) {
    throw new Error(`Unsupported FSR V2 catalog rule '${ruleId}'.`);
  }

  const seen = new Set<string>();
  const safe: SpatialFsrSafeStateCatalogEntryV2[] = [];
  let index = 0;
  for (const initialState of enumerateInitialStates(ruleId)) {
    index += 1;
    try {
      const built = buildSpatialFsrContentFromStateV2({
        ruleId,
        initialState,
        correctOptionIndex: 0,
        prototypeId: `FSR-CATALOG-V2-${ruleId}-${index}`,
      });
      if (seen.has(built.contentFingerprint)) continue;
      seen.add(built.contentFingerprint);
      safe.push({ ruleId, initialState: { ...initialState }, contentFingerprint: built.contentFingerprint });
    } catch {
      // A rejected state is intentionally absent from the safe catalog.
    }
  }
  const frozen = Object.freeze(safe.map((entry) => Object.freeze({
    ...entry,
    initialState: Object.freeze({ ...entry.initialState }),
  }) as SpatialFsrSafeStateCatalogEntryV2));
  cache.set(ruleId, frozen);
  return frozen;
}

export function spatialFsrSafeStateCapacityV2(): Record<string, number> {
  return Object.fromEntries(
    SPATIAL_FSR_SYNTHESIS_RULE_IDS_V1.map((ruleId) => [ruleId, buildSpatialFsrSafeStateCatalogV2(ruleId).length]),
  );
}

export function spatialFsrSafeStateTotalCapacityV2(): number {
  return Object.values(spatialFsrSafeStateCapacityV2()).reduce((sum, value) => sum + value, 0);
}
