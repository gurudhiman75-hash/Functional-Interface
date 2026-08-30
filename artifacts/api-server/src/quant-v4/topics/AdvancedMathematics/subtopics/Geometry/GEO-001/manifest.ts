import { GEOMETRY_LIFECYCLE } from "../lifecycle";

export const GEO_001_MANIFEST = Object.freeze({
  packageId: "GEO-001" as const,
  learnerChapter: "Geometry" as const,
  runtimeTitle: "Lines, Triangles, Quadrilaterals & Polygons" as const,
  checkpoints: Object.freeze([
    "GEO-CP-001", "GEO-CP-002", "GEO-CP-003", "GEO-CP-004", "GEO-CP-005",
    "GEO-CP-006", "GEO-CP-007", "GEO-CP-008", "GEO-CP-009",
  ] as const),
  permanentQlIds: Object.freeze([] as string[]),
  frozenSolveModes: Object.freeze([] as string[]),
  runtimeEnabled: false,
  lifecycle: GEOMETRY_LIFECYCLE,
});
