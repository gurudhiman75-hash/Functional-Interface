export const DIRECTIONS = [
  "NORTH",
  "NORTH_EAST",
  "EAST",
  "SOUTH_EAST",
  "SOUTH",
  "SOUTH_WEST",
  "WEST",
  "NORTH_WEST",
] as const;

export type Direction = (typeof DIRECTIONS)[number];
export type CardinalDirection = "NORTH" | "EAST" | "SOUTH" | "WEST";
export type DirectionOrCoincidence = Direction | "SAME_POSITION";

export interface Coordinate {
  readonly x: number;
  readonly y: number;
}

export type RelativeMovementHeading = "FORWARD" | "BACKWARD" | "LEFT" | "RIGHT";

export type MovementHeading =
  | { readonly kind: "ABSOLUTE"; readonly direction: Direction }
  | { readonly kind: "RELATIVE"; readonly relation: RelativeMovementHeading };

export interface MoveOperation {
  readonly kind: "MOVE";
  readonly heading: MovementHeading;
  readonly distance: number;
  readonly facingAfterMove: "UNCHANGED" | "MOVEMENT_DIRECTION";
}

export interface TurnOperation {
  readonly kind: "TURN";
  readonly sense: "CLOCKWISE" | "ANTICLOCKWISE";
  readonly degrees: number;
}

export type PathOperation = MoveOperation | TurnOperation;

export interface PathState {
  readonly position: Coordinate;
  readonly facing: Direction;
  readonly totalDistance: number;
}

export interface PathTraceStep {
  readonly operationIndex: number;
  readonly operation: PathOperation;
  readonly before: PathState;
  readonly movementDirection?: Direction;
  readonly after: PathState;
}

export interface SolvedPath {
  readonly initial: PathState;
  readonly final: PathState;
  readonly trace: readonly PathTraceStep[];
}

export interface PositionRelation {
  readonly fromEntity: string;
  readonly toEntity: string;
  readonly vector: Coordinate;
}

export interface SolvedEntityPositions {
  readonly coordinates: Readonly<Record<string, Coordinate>>;
  readonly connected: boolean;
  readonly contradictions: readonly string[];
}

export interface DistanceResult {
  readonly dx: number;
  readonly dy: number;
  readonly squaredDistance: number;
  readonly distance: number;
  readonly exactInteger: number | null;
}

export interface DirectionOption<T = unknown> {
  readonly value: T;
  readonly errorLabel: string | null;
}

export interface OptionValidationResult {
  readonly valid: boolean;
  readonly satisfyingOptionIndexes: readonly number[];
  readonly errors: readonly string[];
}

/**
 * QLs and solver labels are intentionally open identifiers.
 * They are allocated only when an implementation need is demonstrated.
 * Once allocated and merged, a QL ID remains permanent.
 */
export interface DirectionQuestionLogicContract {
  readonly qlId: string;
  readonly checkpointId: string;
  readonly ruleId: string;
  readonly solveMode?: string;
  readonly solverCapabilities: readonly string[];
  readonly presentationMode: string;
  readonly answerType: string;
  readonly renderer: string;
  readonly localeMode: "TRANSLATABLE" | "LANGUAGE_ADAPTED" | "LANGUAGE_SPECIFIC";
  readonly status: "DRAFT" | "IMPLEMENTED" | "REVIEWED" | "FROZEN";
}
