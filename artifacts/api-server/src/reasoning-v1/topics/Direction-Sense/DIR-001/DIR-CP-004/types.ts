import type { Coordinate, Direction, PositionRelation } from "../foundation/types";

export interface RelativeRelation extends PositionRelation {
  readonly referenceEntity: string;
  readonly subjectEntity: string;
  readonly direction: Direction;
  readonly distance: number;
}

export interface RelativeDiagramPointGroup {
  readonly coordinate: Coordinate;
  readonly entities: readonly string[];
}

export interface RelativePositionDiagramSpec {
  readonly kind: "RELATIVE_POSITION_DIAGRAM";
  readonly title: string;
  readonly pointGroups: readonly RelativeDiagramPointGroup[];
  readonly relationCount: number;
  readonly svg: string;
}

export interface RelativeDiagramOptions {
  readonly queryPair?: { readonly subject: string; readonly reference: string; readonly shortestDistanceLabel?: string };
  readonly collinearEntities?: readonly [string, string, string];
}
