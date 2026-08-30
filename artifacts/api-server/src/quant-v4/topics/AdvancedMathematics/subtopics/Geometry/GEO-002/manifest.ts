import { GEOMETRY_LIFECYCLE } from "../lifecycle";

export const GEO_002_MANIFEST = Object.freeze({
  packageId: "GEO-002" as const,
  learnerChapter: "Geometry" as const,
  runtimeTitle: "Circle Geometry & Euclidean Synthesis" as const,
  checkpoints: Object.freeze([
    "GEO-CP-010", "GEO-CP-011", "GEO-CP-012", "GEO-CP-013", "GEO-CP-014",
  ] as const),
  permanentQlIds: Object.freeze([] as string[]),
  frozenSolveModes: Object.freeze([] as string[]),
  runtimeEnabled: false,
  lifecycle: GEOMETRY_LIFECYCLE,
});
