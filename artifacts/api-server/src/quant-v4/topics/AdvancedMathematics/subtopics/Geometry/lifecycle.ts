export const GEOMETRY_LIFECYCLE = Object.freeze({
  stage: "DISCOVERY" as const,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

export function assertGeometryLifecycleLocked(): true {
  if (GEOMETRY_LIFECYCLE.questionStudioDiscoverable) throw new Error("Geometry Question Studio gate opened during discovery");
  if (GEOMETRY_LIFECYCLE.questionBankWritable) throw new Error("Geometry Question Bank gate opened during discovery");
  if (GEOMETRY_LIFECYCLE.testEligible) throw new Error("Geometry test gate opened during discovery");
  if (GEOMETRY_LIFECYCLE.publiclyPublishable) throw new Error("Geometry publication gate opened during discovery");
  return true;
}
