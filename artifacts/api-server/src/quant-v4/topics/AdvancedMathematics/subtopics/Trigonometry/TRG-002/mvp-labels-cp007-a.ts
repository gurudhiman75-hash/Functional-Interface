import type { MvpLabelPlanMap } from "./mvp-diagram-label-core";

export const TRG_002_MVP_LABELS_CP007_A = {
  "TRG-002-QL-002": [
    { id: "given-horizontal", role: "GIVEN", fromPointId: "object-base", toPointId: "observer-ground", source: { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "observer-ground" }, placement: "BELOW", symbol: "d" },
    { id: "target-height", role: "TARGET_SOLVED", fromPointId: "object-base", toPointId: "object-top", source: { kind: "ANSWER" }, placement: "RIGHT", symbol: "h" },
  ],
  "TRG-002-QL-005": [
    { id: "given-horizontal", role: "GIVEN", fromPointId: "object-base", toPointId: "observer-ground", source: { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "observer-ground" }, placement: "BELOW", symbol: "d" },
    { id: "target-height", role: "TARGET_SOLVED", fromPointId: "object-base", toPointId: "object-top", source: { kind: "ANSWER" }, placement: "RIGHT", symbol: "h" },
  ],
  "TRG-002-QL-009": [
    { id: "given-height", role: "GIVEN", fromPointId: "object-base", toPointId: "object-top", source: { kind: "OBJECT_HEIGHT", objectId: "object-1" }, placement: "RIGHT", symbol: "h" },
    { id: "target-horizontal", role: "TARGET_SOLVED", fromPointId: "object-base", toPointId: "observer-ground", source: { kind: "ANSWER" }, placement: "BELOW", symbol: "d" },
  ],
  "TRG-002-QL-014": [
    { id: "given-height", role: "GIVEN", fromPointId: "object-base", toPointId: "object-top", source: { kind: "OBJECT_HEIGHT", objectId: "object-1" }, placement: "RIGHT", symbol: "h" },
    { id: "given-horizontal", role: "GIVEN", fromPointId: "object-base", toPointId: "observer-ground", source: { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "observer-ground" }, placement: "BELOW", symbol: "d" },
  ],
} as const satisfies MvpLabelPlanMap;
