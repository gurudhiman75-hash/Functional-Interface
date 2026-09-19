import type { Coordinate, Direction, PositionRelation } from "../foundation/types";

export type AdvancedTurn = "LEFT" | "RIGHT" | "ABOUT" | "NO_TURN";
export type RelativePathOperation =
  | { readonly kind: "MOVE"; readonly distance: number }
  | { readonly kind: "TURN"; readonly turn: Exclude<AdvancedTurn, "NO_TURN"> };

export type AdvancedAnswer =
  | { readonly kind: "DIRECTION"; readonly direction: Direction }
  | { readonly kind: "TURN"; readonly turn: AdvancedTurn }
  | { readonly kind: "STATEMENT"; readonly statementIndex: number }
  | { readonly kind: "DISTANCE"; readonly distance: number }
  | { readonly kind: "DIRECTION_DISTANCE"; readonly direction: Direction; readonly distance: number };

export interface AdvancedOption {
  readonly value: AdvancedAnswer;
  readonly label: string;
  readonly errorLabel: string | null;
}

export interface AdvancedDiagram {
  readonly kind: "RELATION_GRAPH" | "GRAPH_AND_PATH" | "DIAGRAM_TEXT_HYBRID";
  readonly title: string;
  readonly svg: string;
}

export interface AdvancedExplanation {
  readonly given: string;
  readonly steps: readonly string[];
  readonly resultLine: string;
  readonly conclusion: string;
  readonly diagram?: AdvancedDiagram;
}

export interface MissingGraphRelationScenario {
  readonly kind: "MISSING_GRAPH_RELATION";
  readonly entities: readonly [string, string, string, string];
  readonly visibleRelations: readonly PositionRelation[];
  readonly missingFrom: string;
  readonly missingTo: string;
  readonly missingDistance: number;
  readonly answerDirection: Direction;
}

export interface ContradictionScenario {
  readonly kind: "CONTRADICTION";
  readonly anchorRelations: readonly PositionRelation[];
  readonly relations: readonly PositionRelation[];
  readonly statementLabels: readonly string[];
  readonly inconsistentIndex: number;
}

export interface MissingMovementScenario {
  readonly kind: "MISSING_MOVEMENT";
  readonly subject: string;
  readonly place: string;
  readonly start: Coordinate;
  readonly legs: readonly { readonly direction: Direction | "UNKNOWN"; readonly distance: number }[];
  readonly unknownIndex: number;
  readonly target: Coordinate;
  readonly answerDirection: Direction;
}

export interface MissingTurnScenario {
  readonly kind: "MISSING_TURN";
  readonly subject: string;
  readonly place: string;
  readonly initialFacing: Direction;
  readonly firstDistance: number;
  readonly secondDistance: number;
  readonly knownTurn: Exclude<AdvancedTurn, "NO_TURN">;
  readonly thirdDistance: number;
  readonly target: Coordinate;
  readonly answerTurn: AdvancedTurn;
}

export interface InitialFacingScenario {
  readonly kind: "INITIAL_FACING_FROM_ENDPOINT";
  readonly subject: string;
  readonly place: string;
  readonly operations: readonly RelativePathOperation[];
  readonly target: Coordinate;
  readonly answerFacing: Direction;
}

export interface MixedGraphMovementScenario {
  readonly kind: "GRAPH_AND_MOVEMENT";
  readonly relations: readonly PositionRelation[];
  readonly startEntity: string;
  readonly referenceEntity: string;
  readonly movements: readonly { readonly direction: Direction; readonly distance: number }[];
  readonly endpoint: Coordinate;
  readonly answerDirection: Direction;
  readonly answerDistance: number;
}

export interface CaseletScenario {
  readonly kind: "SHARED_PATH_CASELET";
  readonly subject: string;
  readonly place: string;
  readonly checkpoint: string;
  readonly caseletId: string;
  readonly initialFacing: Direction;
  readonly operations: readonly RelativePathOperation[];
  readonly endpoint: Coordinate;
  readonly finalFacing: Direction;
  readonly answerDirection: Direction;
  readonly answerDistance: number;
}

export interface HybridScenario {
  readonly kind: "DIAGRAM_TEXT_HYBRID";
  readonly diagramRelations: readonly PositionRelation[];
  readonly textRelation: PositionRelation;
  readonly queryFrom: string;
  readonly queryTo: string;
  readonly answerDirection: Direction;
}

export type AdvancedScenario =
  | MissingGraphRelationScenario
  | ContradictionScenario
  | MissingMovementScenario
  | MissingTurnScenario
  | InitialFacingScenario
  | MixedGraphMovementScenario
  | CaseletScenario
  | HybridScenario;

export interface GeneratedAdvancedQuestion {
  readonly qlId: string;
  readonly checkpointId: "DIR-CP-008";
  readonly ruleId: string;
  readonly seed: number;
  readonly difficulty: "MEDIUM" | "HARD";
  readonly stem: string;
  readonly structuredPrompt: AdvancedScenario;
  readonly questionDiagram?: AdvancedDiagram;
  readonly options: readonly AdvancedOption[];
  readonly correctIndex: number;
  readonly correctAnswer: AdvancedAnswer;
  readonly explanation: AdvancedExplanation;
  readonly metadata: {
    readonly answerDemand: string;
    readonly solverVerified: true;
    readonly caseletId: string | null;
    readonly solveMode: null;
  };
}
