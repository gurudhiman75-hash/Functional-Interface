import { subtractExact } from "../foundation/exact";
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
  "TRG-002-QL-021",
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

export const TRG_002_V4_BRIDGE_SURFACE_IDS = ["TRG-002-QL-021"] as const;

export function hasTrg002V4PhysicalObserverSupport(state: Trg002SpatialState) {
  return state.observers.every((observer) =>
    state.verticalObjects.some((object) =>
      object.basePointId === observer.groundPointId
      && object.topPointId === observer.eyePointId,
    ),
  );
}

function withObserverSupport(state: Trg002SpatialState, qlId: string): Trg002SpatialState {
  const verticalObjects = [...state.verticalObjects];
  for (const observer of state.observers) {
    const alreadySupported = verticalObjects.some((object) =>
      object.basePointId === observer.groundPointId
      && object.topPointId === observer.eyePointId,
    );
    if (alreadySupported) continue;
    verticalObjects.push({
      id: qlId === "TRG-002-QL-021" ? `v4-bridge-support-${observer.id}` : `v4-support-${observer.id}`,
      kind: "BUILDING",
      basePointId: observer.groundPointId,
      topPointId: observer.eyePointId,
      height: observer.eyeHeight,
    });
  }

  const points = [...state.points];
  if (qlId === "TRG-002-QL-021" && !points.some((point) => point.id === "v4-bridge-deck-end")) {
    const observer = state.observers[0];
    if (!observer) throw new Error(`${qlId}: bridge migration requires an observer.`);
    const ground = state.points.find((point) => point.id === observer.groundPointId);
    const eye = state.points.find((point) => point.id === observer.eyePointId);
    const requested = state.requested.kind === "HORIZONTAL_DISTANCE" ? state.requested : null;
    const targetGround = requested ? state.points.find((point) => point.id === requested.toPointId) : undefined;
    if (!ground || !eye || !targetGround) throw new Error(`${qlId}: bridge migration cannot resolve deck geometry.`);
    const run = subtractExact(targetGround.x, ground.x);
    points.push({ id: "v4-bridge-deck-end", x: subtractExact(ground.x, run), y: eye.y, role: "AUXILIARY", label: "D" });
  }

  return {
    ...state,
    scenario: verticalObjects.length > 1 ? "TWO_BUILDINGS" : "BUILDING",
    points,
    verticalObjects,
    metadata: {
      ...state.metadata,
      notes: [
        ...(state.metadata.notes ?? []),
        qlId === "TRG-002-QL-021"
          ? "V4: observer stands at the edge of a pedestrian overbridge; a vertical bridge support and horizontal deck segment anchor the elevated observation physically."
          : "V4: elevated observer is physically supported by the building shown in the learner scenario.",
      ],
    },
  };
}

export function applyTrg002V4PhysicalSupportMigration(question: any) {
  const qlId = String(question.qlId);
  const originalState = question.canonicalSpatialState as Trg002SpatialState;
  const shouldMigrate = V4_ROOFTOP_SUPPORT_MIGRATION_IDS.has(qlId);
  const state = shouldMigrate && !hasTrg002V4PhysicalObserverSupport(originalState)
    ? withObserverSupport(originalState, qlId)
    : originalState;

  const supported = hasTrg002V4PhysicalObserverSupport(state);
  if (state === originalState) {
    return { question, migrated: false, supported } as const;
  }

  const spatial = verifyTrg002SpatialState(state);
  let diagramEvidence = buildTrg002DiagramEvidence(qlId, state);
  if (!diagramEvidence.solutionDiagram) throw new Error(`${qlId}: V4 physical-support migration lost required solution diagram.`);

  if (qlId === "TRG-002-QL-021") {
    const deck = state.points.find((point) => point.id === "v4-bridge-deck-end");
    const observer = state.observers[0];
    if (!deck || !observer) throw new Error(`${qlId}: bridge deck evidence cannot resolve its endpoints.`);
    diagramEvidence = {
      ...diagramEvidence,
      solutionDiagram: {
        ...diagramEvidence.solutionDiagram,
        segments: [
          ...diagramEvidence.solutionDiagram.segments,
          { id: "v4-bridge-deck", fromPointId: deck.id, toPointId: observer.eyePointId, kind: "AUXILIARY" },
        ],
      },
    };
  }

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
