export const GEOMETRY_THEOREM_IDS = Object.freeze([
  "GIVEN_ANGLE",
  "LINEAR_PAIR_SUM",
  "VERTICAL_OPPOSITE_ANGLES",
  "ANGLE_AROUND_POINT",
  "CORRESPONDING_ANGLES_PARALLEL",
  "ALTERNATE_INTERIOR_ANGLES",
  "CO_INTERIOR_SUPPLEMENTARY",
  "TRIANGLE_ANGLE_SUM",
  "TRIANGLE_EXTERIOR_ANGLE",
  "ISOSCELES_BASE_ANGLES",
  "ISOSCELES_CONVERSE",
  "TRIANGLE_INEQUALITY",
  "PYTHAGORAS",
  "PYTHAGORAS_CONVERSE",
  "SSS_CONGRUENCE",
  "SAS_CONGRUENCE",
  "ASA_AAS_CONGRUENCE",
  "RHS_CONGRUENCE",
  "CPCT",
  "AA_SIMILARITY",
  "SAS_SIMILARITY",
  "SSS_SIMILARITY",
  "BASIC_PROPORTIONALITY_THEOREM",
  "BPT_CONVERSE",
  "ANGLE_BISECTOR_THEOREM",
  "MIDPOINT_THEOREM",
  "MIDPOINT_CONVERSE",
  "PARALLELOGRAM_OPPOSITE_SIDES",
  "PARALLELOGRAM_OPPOSITE_ANGLES",
  "PARALLELOGRAM_DIAGONALS_BISECT",
  "RECTANGLE_DIAGONALS_EQUAL",
  "RHOMBUS_DIAGONALS_PERPENDICULAR",
  "SQUARE_COMBINED_PROPERTIES",
  "TRAPEZIUM_PARALLEL_RELATIONS",
  "POLYGON_INTERIOR_SUM",
  "POLYGON_EXTERIOR_SUM",
  "REGULAR_POLYGON_ANGLE",
  "POLYGON_DIAGONAL_COUNT",
  "EQUAL_CHORD_EQUAL_ARC",
  "EQUAL_CHORD_EQUAL_CENTRE_DISTANCE",
  "PERPENDICULAR_FROM_CENTRE_BISECTS_CHORD",
  "CENTRAL_ANGLE_DOUBLE_INSCRIBED",
  "SAME_SEGMENT_ANGLE",
  "ANGLE_IN_SEMICIRCLE",
  "CYCLIC_OPPOSITE_SUPPLEMENTARY",
  "CYCLIC_EXTERIOR_EQUALS_INTERIOR_OPPOSITE",
  "RADIUS_PERPENDICULAR_TANGENT",
  "TANGENTS_FROM_EXTERNAL_POINT_EQUAL",
  "TANGENT_CHORD_ANGLE",
  "INTERSECTING_CHORD_PRODUCT",
  "SECANT_SECANT_POWER",
  "TANGENT_SECANT_POWER",
] as const);

export type TheoremId = typeof GEOMETRY_THEOREM_IDS[number];

export type TheoremFamily =
  | "GENERIC"
  | "LINES"
  | "TRIANGLES"
  | "CONGRUENCE"
  | "SIMILARITY"
  | "TRIANGLE_CENTRES"
  | "RIGHT_TRIANGLE"
  | "QUADRILATERALS"
  | "POLYGONS"
  | "CIRCLES"
  | "TANGENTS"
  | "POWER_OF_POINT";

export interface TheoremDefinition {
  readonly id: TheoremId;
  readonly learnerName: string;
  readonly family: TheoremFamily;
  readonly phase0Executable: boolean;
}

const FAMILY_BY_PREFIX: readonly [string, TheoremFamily][] = [
  ["SSS_", "CONGRUENCE"], ["SAS_CONGRUENCE", "CONGRUENCE"], ["ASA_", "CONGRUENCE"],
  ["RHS_", "CONGRUENCE"], ["CPCT", "CONGRUENCE"], ["AA_", "SIMILARITY"],
  ["SAS_SIMILARITY", "SIMILARITY"], ["SSS_SIMILARITY", "SIMILARITY"], ["BASIC_", "SIMILARITY"],
  ["BPT_", "SIMILARITY"], ["PARALLELOGRAM", "QUADRILATERALS"], ["RECTANGLE", "QUADRILATERALS"],
  ["RHOMBUS", "QUADRILATERALS"], ["SQUARE_", "QUADRILATERALS"], ["TRAPEZIUM", "QUADRILATERALS"],
  ["POLYGON_", "POLYGONS"], ["REGULAR_", "POLYGONS"], ["EQUAL_CHORD", "CIRCLES"],
  ["PERPENDICULAR_FROM_CENTRE", "CIRCLES"], ["CENTRAL_", "CIRCLES"], ["SAME_SEGMENT", "CIRCLES"],
  ["ANGLE_IN_SEMICIRCLE", "CIRCLES"], ["CYCLIC_", "CIRCLES"], ["RADIUS_PERPENDICULAR_TANGENT", "TANGENTS"],
  ["TANGENTS_FROM_EXTERNAL_POINT_EQUAL", "TANGENTS"], ["TANGENT_CHORD_ANGLE", "TANGENTS"],
  ["INTERSECTING_CHORD_PRODUCT", "POWER_OF_POINT"], ["SECANT_SECANT_POWER", "POWER_OF_POINT"],
  ["TANGENT_SECANT_POWER", "POWER_OF_POINT"], ["PYTHAGORAS", "RIGHT_TRIANGLE"],
  ["ANGLE_BISECTOR", "TRIANGLE_CENTRES"], ["MIDPOINT_", "TRIANGLE_CENTRES"],
  ["TRIANGLE_", "TRIANGLES"], ["ISOSCELES_", "TRIANGLES"],
  ["CORRESPONDING_", "LINES"], ["ALTERNATE_", "LINES"], ["CO_INTERIOR_", "LINES"],
  ["LINEAR_", "LINES"], ["VERTICAL_", "LINES"], ["ANGLE_AROUND_", "LINES"],
];

function humanize(id: string): string {
  const names: Partial<Record<TheoremId, string>> = {
    GIVEN_ANGLE: "given angle",
    LINEAR_PAIR_SUM: "angles in a linear pair add to 180°",
    VERTICAL_OPPOSITE_ANGLES: "vertically opposite angles are equal",
    ANGLE_AROUND_POINT: "angles around a point add to 360°",
    CORRESPONDING_ANGLES_PARALLEL: "corresponding angles are equal when lines are parallel",
    ALTERNATE_INTERIOR_ANGLES: "alternate interior angles are equal when lines are parallel",
    CO_INTERIOR_SUPPLEMENTARY: "co-interior angles add to 180° when lines are parallel",
    TRIANGLE_ANGLE_SUM: "angles in a triangle add to 180°",
  };
  return names[id as TheoremId] ?? id.toLowerCase().replaceAll("_", " ");
}

function inferFamily(id: TheoremId): TheoremFamily {
  if (id === "GIVEN_ANGLE") return "GENERIC";
  for (const [prefix, family] of FAMILY_BY_PREFIX) {
    if (id.startsWith(prefix)) return family;
  }
  return "GENERIC";
}

const registry = new Map<TheoremId, TheoremDefinition>();

for (const id of GEOMETRY_THEOREM_IDS) {
  registry.set(id, Object.freeze({
    id,
    learnerName: humanize(id),
    family: inferFamily(id),
    phase0Executable: [
      "GIVEN_ANGLE",
      "LINEAR_PAIR_SUM",
      "VERTICAL_OPPOSITE_ANGLES",
      "ANGLE_AROUND_POINT",
      "CORRESPONDING_ANGLES_PARALLEL",
      "ALTERNATE_INTERIOR_ANGLES",
      "CO_INTERIOR_SUPPLEMENTARY",
      "TRIANGLE_ANGLE_SUM",
    ].includes(id),
  }));
}

export function getTheoremDefinition(id: TheoremId): TheoremDefinition {
  const definition = registry.get(id);
  if (!definition) throw new Error(`Unknown Geometry theorem: ${id}`);
  return definition;
}

export function listTheorems(): readonly TheoremDefinition[] {
  return Object.freeze([...registry.values()]);
}
