import type { CardinalDirection, Coordinate, Direction } from "../foundation/types";

export const CODE_SYMBOLS = ["@", "#", "%", "&"] as const;
export type CodeSymbol = (typeof CODE_SYMBOLS)[number];
export type DirectionCodeMap = Readonly<Record<CodeSymbol, CardinalDirection>>;

export interface CodedRelation {
  readonly subject: string;
  readonly symbol: CodeSymbol;
  readonly reference: string;
}

export interface CodedMovementStep {
  readonly symbol: CodeSymbol;
  readonly distance: number;
}

export interface CodeRecoveryEvidence {
  readonly symbols: readonly CodeSymbol[];
  readonly resultDirection: Direction;
  readonly displayEntities: readonly string[];
}

export type CodedDirectionAnswer =
  | { readonly kind: "DIRECTION"; readonly direction: Direction }
  | { readonly kind: "ENTITY"; readonly entity: string }
  | { readonly kind: "CODE_SYMBOL"; readonly symbol: CodeSymbol }
  | { readonly kind: "CODED_STATEMENT"; readonly statement: string }
  | { readonly kind: "CONCLUSION"; readonly statement: string };

export interface CodedDirectionOption {
  readonly value: CodedDirectionAnswer;
  readonly label: string;
  readonly errorLabel: string | null;
}

export interface CodedDirectionDiagramSpec {
  readonly kind: "CODED_RELATION_DIAGRAM" | "CODED_MOVEMENT_DIAGRAM" | "CODE_MAP_DIAGRAM";
  readonly title: string;
  readonly svg: string;
}

export interface CodedDirectionExplanation {
  readonly given: string;
  readonly decodeLines: readonly string[];
  readonly workingLines: readonly string[];
  readonly resultLine: string;
  readonly conclusion: string;
  readonly diagram: CodedDirectionDiagramSpec;
}

export interface GeneratedCodedDirectionQuestion {
  readonly qlId: string;
  readonly checkpointId: "DIR-CP-006";
  readonly ruleId: string;
  readonly seed: number;
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly stem: string;
  readonly structuredPrompt: Readonly<Record<string, unknown>>;
  readonly options: readonly CodedDirectionOption[];
  readonly correctIndex: number;
  readonly correctAnswer: CodedDirectionAnswer;
  readonly explanation: CodedDirectionExplanation;
  readonly metadata: {
    readonly answerDemand: string;
    readonly activeCodeCount: 4;
    readonly relationCount: number;
    readonly solverVerified: true;
    readonly solveMode: null;
    readonly mappingRecoveredUniquely: boolean;
  };
}

export interface SolvedCodedGraph {
  readonly coordinates: Readonly<Record<string, Coordinate>>;
  readonly connected: boolean;
  readonly contradictions: readonly string[];
}
