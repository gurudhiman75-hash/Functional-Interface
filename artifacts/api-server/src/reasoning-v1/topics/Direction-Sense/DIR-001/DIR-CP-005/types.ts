import type { Coordinate, Direction } from "../foundation/types";

export interface MoverStep {
  readonly direction: "NORTH" | "EAST" | "SOUTH" | "WEST";
  readonly distance: number;
}

export interface MoverPath {
  readonly name: string;
  readonly startLabel: string;
  readonly start: Coordinate;
  readonly steps: readonly MoverStep[];
  readonly points: readonly Coordinate[];
  readonly endpoint: Coordinate;
}

export interface MultiMoverDiagramOptions {
  readonly queryPair?: { readonly subject: string; readonly reference: string; readonly distanceLabel?: string };
  readonly referencePoint?: { readonly label: string; readonly coordinate: Coordinate };
  readonly highlightedMovers?: readonly string[];
  readonly extremumDirection?: Direction;
}

export interface MultiMoverDiagramSpec {
  readonly kind: "MULTI_MOVER_DIAGRAM";
  readonly title: string;
  readonly moverCount: number;
  readonly svg: string;
}
