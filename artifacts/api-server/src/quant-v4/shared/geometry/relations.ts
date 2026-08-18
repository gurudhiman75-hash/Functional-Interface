export type GeometryRelationKind =
  | "COLLINEAR"
  | "PARALLEL"
  | "PERPENDICULAR"
  | "EQUAL_LENGTH"
  | "EQUAL_ANGLE"
  | "MIDPOINT"
  | "BISECTS_ANGLE"
  | "BISECTS_SEGMENT"
  | "TANGENT"
  | "SECANT"
  | "ON_CIRCLE"
  | "CENTRE_OF"
  | "DIAMETER"
  | "RADIUS"
  | "CHORD"
  | "CYCLIC"
  | "CONGRUENT"
  | "SIMILAR";

export interface GeometryRelation {
  readonly kind: GeometryRelationKind;
  readonly subjects: readonly string[];
  readonly evidence?: string;
}

export function relation(
  kind: GeometryRelationKind,
  subjects: readonly string[],
  evidence?: string,
): GeometryRelation {
  if (subjects.length === 0) throw new Error(`Relation ${kind} requires at least one subject`);
  return Object.freeze({
    kind,
    subjects: Object.freeze([...subjects]),
    ...(evidence ? { evidence } : {}),
  });
}
