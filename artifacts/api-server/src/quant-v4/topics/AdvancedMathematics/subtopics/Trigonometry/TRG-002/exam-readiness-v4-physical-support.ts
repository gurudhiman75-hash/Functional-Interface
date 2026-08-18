import {
  buildTrg002DiagramEvidence,
  validateTrg002DiagramEvidence,
  validateTrg002DiagramSpec,
  verifyTrg002SpatialState,
  type Trg002SpatialState,
} from "./spatial";

const V4_ROOFTOP_SUPPORT_MIGRATION_IDS = new Set([
  "TRG-002-QL-016",
  "TRG-002-QL-017",
  "TRG-002-QL-019",
  "TRG-002-QL-022",
]);

export const TRG_002_V4_ROOFTOP_SURFACE_IDS = [
  "TRG-002-QL-015",
  "TRG-002-QL-016",
  "TRG-002-QL-017",
  "TRG-002-QL-018",
  "TRG-002-QL-019",
  "TRG-002-QL-020",
  "TRG-002-QL-022",
] as const;

export function hasTrg002V4PhysicalObserverSupport(state: Trg002SpatialState) {
  return state.observers.every((observer) =>
    state.verticalObjects.some((object) =>
      object.basePointId === observer.groundPointId
      && object.topPointId === observer.eyePointId,
    ),
  );
}

function withObserverSupport(state: Trg002SpatialState): Trg002SpatialState {
  const verticalObjects = [...state.verticalObjects];
  for (const observer of state.observers) {
    const alreadySupported = verticalObjects.some((object) =>
      object.basePointId === observer.groundPointId
      && object.topPointId === observer.eyePointId,
    );
    if (alreadySupported) continue;
    verticalObjects.push({
      id: `v4-support-${observer.id}`,
      kind: "BUILDING",
      basePointId: observer.groundPointId,
      topPointId: observer.eyePointId,
      height: observer.eyeHeight,
    });
  }
  return {
    ...state,
    scenario: verticalObjects.length > 1 ? "TWO_BUILDINGS" : "BUILDING",
    verticalObjects,
    metadata: {
      ...state.metadata,
      notes: [
        ...(state.metadata.notes ?? []),
        "V4: elevated observer is physically supported by the building shown in the learner scenario.",
      ],
    },
  };
}

export function applyTrg002V4PhysicalSupportMigration(question: any) {
  const qlId = String(question.qlId);
  const originalState = question.canonicalSpatialState as Trg002SpatialState;
  const shouldMigrate = V4_ROOFTOP_SUPPORT_MIGRATION_IDS.has(qlId);
  const state = shouldMigrate && !hasTrg002V4PhysicalObserverSupport(originalState)
    ? withObserverSupport(originalState)
    : originalState;

  const supported = hasTrg002V4PhysicalObserverSupport(state);
  if (state === originalState) {
    return { question, migrated: false, supported } as const;
  }

  const spatial = verifyTrg002SpatialState(state);
  const diagramEvidence = buildTrg002DiagramEvidence(qlId, state);
  if (!diagramEvidence.solutionDiagram) throw new Error(`${qlId}: V4 physical-support migration lost required solution diagram.`);
  const diagram = validateTrg002DiagramSpec(diagramEvidence.solutionDiagram);
  const diagramPolicy = validateTrg002DiagramEvidence(state, diagramEvidence);
  if (!spatial.valid || !diagram.valid || !diagramPolicy.valid) {
    throw new Error(`${qlId}: V4 physical-support migration failed canonical spatial/diagram validation.`);
  }

  const checks = (question.validation?.checks ?? []).map((check: any) => {
    if (check.name === "SPATIAL_VERIFIED") return { ...check, passed: spatial.valid, message: "V4 physically supported canonical spatial state verified." };
    if (check.name === "SOLUTION_DIAGRAM_VERIFIED") return { ...check, passed: diagram.valid && diagramPolicy.valid, message: "V4 physically supported solution diagram verified." };
    return check;
  });
  const validation = { valid: checks.every((check: any) => check.passed), checks };
  if (!validation.valid) throw new Error(`${qlId}: V4 physical-support migration inherited a failed validation check.`);

  return {
    question: {
      ...question,
      canonicalSpatialState: state,
      solutionDiagram: diagramEvidence.solutionDiagram,
      diagramEvidence,
      verification: {
        ...question.verification,
        spatial,
        diagram,
        diagramPolicy,
      },
      validation,
    },
    migrated: true,
    supported,
  } as const;
}
