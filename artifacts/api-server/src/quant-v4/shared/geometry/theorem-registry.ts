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
  "RIGHT_TRIANGLE_HYPOTENUSE_MEDIAN",
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
  "CENTROID_DIVIDES_MEDIAN_2_TO_1",
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
  ["SSS_SIMILARITY", "SIMILARITY"], ["SAS_SIMILARITY", "SIMILARITY"], ["AA_", "SIMILARITY"],
  ["SSS_CONGRUENCE", "CONGRUENCE"], ["SAS_CONGRUENCE", "CONGRUENCE"], ["ASA_", "CONGRUENCE"],
  ["RHS_", "CONGRUENCE"], ["CPCT", "CONGRUENCE"], ["BASIC_", "SIMILARITY"],
  ["BPT_", "SIMILARITY"], ["PARALLELOGRAM", "QUADRILATERALS"], ["RECTANGLE", "QUADRILATERALS"],
  ["RHOMBUS", "QUADRILATERALS"], ["SQUARE_", "QUADRILATERALS"], ["TRAPEZIUM", "QUADRILATERALS"],
  ["POLYGON_", "POLYGONS"], ["REGULAR_", "POLYGONS"], ["EQUAL_CHORD", "CIRCLES"],
  ["PERPENDICULAR_FROM_CENTRE", "CIRCLES"], ["CENTRAL_", "CIRCLES"], ["SAME_SEGMENT", "CIRCLES"],
  ["ANGLE_IN_SEMICIRCLE", "CIRCLES"], ["CYCLIC_", "CIRCLES"], ["RADIUS_PERPENDICULAR_TANGENT", "TANGENTS"],
  ["TANGENTS_FROM_EXTERNAL_POINT_EQUAL", "TANGENTS"], ["TANGENT_CHORD_ANGLE", "TANGENTS"],
  ["INTERSECTING_CHORD_PRODUCT", "POWER_OF_POINT"], ["SECANT_SECANT_POWER", "POWER_OF_POINT"],
  ["TANGENT_SECANT_POWER", "POWER_OF_POINT"], ["RIGHT_TRIANGLE_", "RIGHT_TRIANGLE"], ["PYTHAGORAS", "RIGHT_TRIANGLE"],
  ["CENTROID_", "TRIANGLE_CENTRES"], ["ANGLE_BISECTOR", "TRIANGLE_CENTRES"], ["MIDPOINT_", "TRIANGLE_CENTRES"],
  ["TRIANGLE_", "TRIANGLES"], ["ISOSCELES_", "TRIANGLES"],
  ["CORRESPONDING_", "LINES"], ["ALTERNATE_", "LINES"], ["CO_INTERIOR_", "LINES"],
  ["LINEAR_", "LINES"], ["VERTICAL_", "LINES"], ["ANGLE_AROUND_", "LINES"],
];

function humanize(id: string): string {
  const names: Partial<Record<TheoremId, string>> = {
    GIVEN_ANGLE: "the stated angle measure",
    LINEAR_PAIR_SUM: "angles in a linear pair add to 180°",
    VERTICAL_OPPOSITE_ANGLES: "vertically opposite angles are equal",
    ANGLE_AROUND_POINT: "angles around a point add to 360°",
    CORRESPONDING_ANGLES_PARALLEL: "corresponding angles are equal when the lines are parallel",
    ALTERNATE_INTERIOR_ANGLES: "alternate interior angles are equal when the lines are parallel",
    CO_INTERIOR_SUPPLEMENTARY: "co-interior angles add to 180° when the lines are parallel",
    TRIANGLE_ANGLE_SUM: "the interior angles of a triangle add to 180°",
    TRIANGLE_EXTERIOR_ANGLE: "an exterior angle equals the sum of the two remote interior angles",
    ISOSCELES_BASE_ANGLES: "the base angles of an isosceles triangle are equal",
    ISOSCELES_CONVERSE: "equal angles in a triangle stand opposite equal sides",
    TRIANGLE_INEQUALITY: "the third side is greater than the difference and less than the sum of the other two sides",
    PYTHAGORAS: "in a right triangle the square of the hypotenuse equals the sum of the squares of the legs",
    PYTHAGORAS_CONVERSE: "if the square of the longest side equals the sum of the squares of the other two sides, the triangle is right-angled",
    RIGHT_TRIANGLE_HYPOTENUSE_MEDIAN: "the median from the right angle to the hypotenuse equals half the hypotenuse",
    SSS_CONGRUENCE: "three matching side lengths establish triangle congruence",
    SAS_CONGRUENCE: "two matching sides and their included angle establish triangle congruence",
    ASA_AAS_CONGRUENCE: "two matching angles with a matching side establish triangle congruence",
    RHS_CONGRUENCE: "right triangles are congruent when a hypotenuse and one corresponding side are equal",
    CPCT: "corresponding parts of congruent triangles are equal",
    AA_SIMILARITY: "two matching angles establish triangle similarity",
    SAS_SIMILARITY: "proportional corresponding sides with the included angle equal establish similarity",
    SSS_SIMILARITY: "three proportional corresponding sides establish similarity",
    BASIC_PROPORTIONALITY_THEOREM: "a line parallel to one side of a triangle divides the other two sides proportionally",
    BPT_CONVERSE: "proportional division of two sides gives a line parallel to the third side",
    CENTROID_DIVIDES_MEDIAN_2_TO_1: "the centroid divides each median in the ratio 2:1 from the vertex",
    ANGLE_BISECTOR_THEOREM: "an internal angle bisector divides the opposite side in the ratio of the adjacent sides",
    MIDPOINT_THEOREM: "the segment joining two side midpoints is parallel to the third side and half its length",
    MIDPOINT_CONVERSE: "a line through a side midpoint parallel to another side bisects the third side",
    PARALLELOGRAM_OPPOSITE_SIDES: "opposite sides of a parallelogram are equal and parallel",
    PARALLELOGRAM_OPPOSITE_ANGLES: "opposite angles of a parallelogram are equal",
    PARALLELOGRAM_DIAGONALS_BISECT: "the diagonals of a parallelogram bisect each other",
    RECTANGLE_DIAGONALS_EQUAL: "the diagonals of a rectangle are equal",
    RHOMBUS_DIAGONALS_PERPENDICULAR: "the diagonals of a rhombus are perpendicular bisectors of each other",
    SQUARE_COMBINED_PROPERTIES: "a square has the combined rectangle and rhombus properties",
    TRAPEZIUM_PARALLEL_RELATIONS: "a trapezium has exactly one pair of opposite sides parallel in this convention",
    POLYGON_INTERIOR_SUM: "the interior-angle sum of an n-sided polygon is (n−2)×180°",
    POLYGON_EXTERIOR_SUM: "one exterior angle at each vertex of a convex polygon adds to 360°",
    REGULAR_POLYGON_ANGLE: "all corresponding angles of a regular polygon are equal",
    POLYGON_DIAGONAL_COUNT: "an n-sided polygon has n(n−3)/2 diagonals",
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
