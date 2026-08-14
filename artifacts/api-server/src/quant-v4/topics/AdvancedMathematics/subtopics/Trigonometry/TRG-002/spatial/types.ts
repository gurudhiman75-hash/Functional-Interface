import type { AngleMeasure, ExactTrigNumber } from "../../foundation/types";

export const TRG_002_DIAGRAM_STRATEGIES = [
  "SINGLE_ELEVATION",
  "SINGLE_DEPRESSION",
  "SHADOW",
  "LADDER",
  "BROKEN_TREE",
  "GUY_WIRE",
  "TWO_OBSERVATIONS_SAME_SIDE",
  "OBSERVER_MOVES_CLOSER",
  "OBSERVER_MOVES_FARTHER",
  "OPPOSITE_SIDE_OBSERVATIONS",
  "OBSERVER_HEIGHT",
  "BUILDING_TO_BUILDING",
  "ELEVATION_AND_DEPRESSION",
  "RIVER_WIDTH",
] as const;

export type Trg002DiagramStrategy = (typeof TRG_002_DIAGRAM_STRATEGIES)[number];

export type Trg002Scenario =
  | "TOWER"
  | "BUILDING"
  | "POLE"
  | "FLAGPOLE"
  | "TREE"
  | "CHIMNEY"
  | "MAST"
  | "WALL"
  | "LADDER"
  | "GUY_WIRE"
  | "SHADOW"
  | "BROKEN_OBJECT"
  | "RIVER_BANK"
  | "TWO_BUILDINGS"
  | "ABSTRACT_OBSERVATION";

export type SpatialPointRole =
  | "GROUND"
  | "OBJECT_BASE"
  | "OBJECT_TOP"
  | "OBSERVER_GROUND"
  | "OBSERVER_EYE"
  | "SHADOW_TIP"
  | "LADDER_CONTACT"
  | "ANCHOR"
  | "BREAK_POINT"
  | "TOUCH_POINT"
  | "AUXILIARY";

export interface Trg002SpatialPoint {
  id: string;
  x: ExactTrigNumber;
  y: ExactTrigNumber;
  role: SpatialPointRole;
  label?: string;
}

export interface Trg002VerticalObject {
  id: string;
  kind: "TOWER" | "BUILDING" | "POLE" | "FLAGPOLE" | "TREE" | "CHIMNEY" | "MAST" | "WALL";
  basePointId: string;
  topPointId: string;
  height: ExactTrigNumber;
}

export interface Trg002Observer {
  id: string;
  groundPointId: string;
  eyePointId: string;
  eyeHeight: ExactTrigNumber;
}

export interface Trg002Observation {
  id: string;
  observerId: string;
  eyePointId: string;
  targetPointId: string;
  classification: "ELEVATION" | "DEPRESSION";
  angle: AngleMeasure;
  horizontalReference: "EYE_LEVEL";
}

export interface Trg002Movement {
  id: string;
  observerId: string;
  fromGroundPointId: string;
  toGroundPointId: string;
  referenceObjectId: string;
  direction: "CLOSER" | "FARTHER";
  distance: ExactTrigNumber;
}

export type Trg002RequestedTarget =
  | { kind: "OBJECT_HEIGHT"; objectId: string }
  | { kind: "HORIZONTAL_DISTANCE"; fromPointId: string; toPointId: string }
  | { kind: "ANGLE"; observationId: string }
  | { kind: "MOVEMENT_DISTANCE"; movementId: string }
  | { kind: "SIGHT_LINE_LENGTH"; fromPointId: string; toPointId: string }
  | { kind: "EYE_HEIGHT"; observerId: string }
  | { kind: "SHADOW_LENGTH"; objectId: string; shadowTipPointId: string };

export interface Trg002SpatialState {
  packageId: "TRG-002";
  scenario: Trg002Scenario;
  groundY: ExactTrigNumber;
  points: Trg002SpatialPoint[];
  verticalObjects: Trg002VerticalObject[];
  observers: Trg002Observer[];
  observations: Trg002Observation[];
  movements: Trg002Movement[];
  requested: Trg002RequestedTarget;
  diagramStrategy: Trg002DiagramStrategy;
  metadata: {
    units: "m" | "ft" | "units";
    sameSide?: boolean;
    oppositeSide?: boolean;
    observerOrder?: string[];
    notes?: string[];
    measurements?: Record<string, ExactTrigNumber>;
  };
}

export interface Trg002SpatialVerificationCheck {
  name: string;
  passed: boolean;
  message: string;
  delta?: number;
}

export interface Trg002SpatialVerification {
  valid: boolean;
  checks: Trg002SpatialVerificationCheck[];
}

export interface Trg002DiagramPoint {
  id: string;
  x: number;
  y: number;
  label?: string;
  role: SpatialPointRole;
}

export interface Trg002DiagramSegment {
  id: string;
  fromPointId: string;
  toPointId: string;
  kind: "GROUND" | "VERTICAL_OBJECT" | "SIGHT_LINE" | "EYE_LEVEL" | "LADDER" | "WIRE" | "SHADOW" | "MOVEMENT" | "AUXILIARY";
}

export interface Trg002DiagramAngleMarker {
  id: string;
  vertexPointId: string;
  rayPointId: string;
  referenceDirection: "LEFT" | "RIGHT";
  classification: "ELEVATION" | "DEPRESSION";
  label: string;
}

export interface Trg002DiagramSpec {
  strategy: Trg002DiagramStrategy;
  width: 1000;
  height: 600;
  padding: 60;
  points: Trg002DiagramPoint[];
  segments: Trg002DiagramSegment[];
  angles: Trg002DiagramAngleMarker[];
  labels: Array<{ id: string; pointId: string; text: string }>;
}
