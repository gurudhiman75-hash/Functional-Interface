import { exactKey } from "../../foundation/exact";
import { toDegrees } from "../../foundation/angle";
import { trg002DiagramPolicyForQl, type TrigDiagramPolicy } from "../../diagram-policy";
import { buildTrg002DiagramSpec, validateTrg002DiagramSpec } from "./diagram";
import type { Trg002DiagramSpec, Trg002SpatialState } from "./types";

export type Trg002DiagramDisclosureStage = "STEM" | "SOLUTION";

export interface Trg002DiagramEvidence {
  qlId: string;
  policy: TrigDiagramPolicy;
  sourceStateFingerprint: string;
  solutionDiagram?: Trg002DiagramSpec;
  stemDiagram?: Trg002DiagramSpec;
  disclosure: {
    solutionStage: "AFTER_ATTEMPT";
    stemStage: "QUESTION";
    stemNumericPointLabelsAllowed: false;
  };
}

function angleKey(angle: any) {
  const degrees = toDegrees(angle);
  return `${degrees.numerator}/${degrees.denominator}`;
}

function stableStatePayload(state: Trg002SpatialState) {
  return {
    packageId: state.packageId,
    scenario: state.scenario,
    groundY: exactKey(state.groundY),
    points: [...state.points]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((point) => [point.id, exactKey(point.x), exactKey(point.y), point.role, point.label ?? ""]),
    verticalObjects: [...state.verticalObjects]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((object) => [object.id, object.kind, object.basePointId, object.topPointId, exactKey(object.height)]),
    observers: [...state.observers]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((observer) => [observer.id, observer.groundPointId, observer.eyePointId, exactKey(observer.eyeHeight)]),
    observations: [...state.observations]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((observation) => [
        observation.id,
        observation.observerId,
        observation.eyePointId,
        observation.targetPointId,
        observation.classification,
        angleKey(observation.angle),
        observation.horizontalReference,
      ]),
    movements: [...state.movements]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((movement) => [
        movement.id,
        movement.observerId,
        movement.fromGroundPointId,
        movement.toGroundPointId,
        movement.referenceObjectId,
        movement.direction,
        exactKey(movement.distance),
      ]),
    requested: state.requested,
    diagramStrategy: state.diagramStrategy,
    metadata: {
      units: state.metadata.units,
      sameSide: state.metadata.sameSide ?? null,
      oppositeSide: state.metadata.oppositeSide ?? null,
      observerOrder: state.metadata.observerOrder ?? [],
      notes: state.metadata.notes ?? [],
    },
  };
}

function fnv1a(text: string) {
  let value = 2166136261;
  for (const character of text) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return (value >>> 0).toString(16).padStart(8, "0");
}

export function trg002SpatialStateFingerprint(state: Trg002SpatialState) {
  return `TRG002:${fnv1a(JSON.stringify(stableStatePayload(state)))}`;
}

function stemDiagramHasUnsafePointLabels(spec: Trg002DiagramSpec) {
  return spec.labels.some((label) => /\d|√|π|\/|=/.test(label.text));
}

function stemDiagramDisclosesRequestedAngle(state: Trg002SpatialState, spec: Trg002DiagramSpec) {
  if (state.requested.kind !== "ANGLE") return false;
  return spec.angles.some((angle) => angle.id === `angle-${state.requested.observationId}` && angle.label.trim().length > 0);
}

export function buildTrg002DiagramEvidence(
  qlId: string,
  state: Trg002SpatialState,
  options: { includeStemDiagram?: boolean } = {},
): Trg002DiagramEvidence {
  const policy = trg002DiagramPolicyForQl(qlId);
  if (options.includeStemDiagram && policy.stemDiagramPolicy === "NONE") {
    throw new Error(`${qlId}: stem diagram is forbidden by policy.`);
  }

  const solutionDiagram = policy.solutionDiagramPolicy === "NONE"
    ? undefined
    : buildTrg002DiagramSpec(state);
  const stemDiagram = options.includeStemDiagram
    ? buildTrg002DiagramSpec(state)
    : undefined;

  return {
    qlId,
    policy,
    sourceStateFingerprint: trg002SpatialStateFingerprint(state),
    ...(solutionDiagram ? { solutionDiagram } : {}),
    ...(stemDiagram ? { stemDiagram } : {}),
    disclosure: {
      solutionStage: "AFTER_ATTEMPT",
      stemStage: "QUESTION",
      stemNumericPointLabelsAllowed: false,
    },
  };
}

export function validateTrg002DiagramEvidence(state: Trg002SpatialState, evidence: Trg002DiagramEvidence) {
  const expectedFingerprint = trg002SpatialStateFingerprint(state);
  const solutionValidation = evidence.solutionDiagram
    ? validateTrg002DiagramSpec(evidence.solutionDiagram)
    : null;
  const stemValidation = evidence.stemDiagram
    ? validateTrg002DiagramSpec(evidence.stemDiagram)
    : null;

  const checks = [
    {
      name: "CANONICAL_STATE_BINDING",
      passed: evidence.sourceStateFingerprint === expectedFingerprint,
      message: "Diagram evidence is bound to the same canonical spatial state as the solver and explanation.",
    },
    {
      name: "SOLUTION_POLICY",
      passed: evidence.policy.solutionDiagramPolicy !== "REQUIRED" || Boolean(evidence.solutionDiagram),
      message: "A required solution diagram is present.",
    },
    {
      name: "SOLUTION_DIAGRAM_VALID",
      passed: !solutionValidation || solutionValidation.valid,
      message: "The solution diagram projection is internally valid.",
    },
    {
      name: "SOLUTION_STRATEGY_MATCH",
      passed: !evidence.solutionDiagram || evidence.solutionDiagram.strategy === state.diagramStrategy,
      message: "The solution diagram uses the canonical state's locked strategy.",
    },
    {
      name: "STEM_POLICY",
      passed: !evidence.stemDiagram || evidence.policy.stemDiagramPolicy !== "NONE",
      message: "A stem diagram is emitted only when the QL policy permits it.",
    },
    {
      name: "STEM_DIAGRAM_VALID",
      passed: !stemValidation || stemValidation.valid,
      message: "Any optional stem diagram is internally valid.",
    },
    {
      name: "STEM_STRATEGY_MATCH",
      passed: !evidence.stemDiagram || evidence.stemDiagram.strategy === state.diagramStrategy,
      message: "Any optional stem diagram uses the same canonical strategy.",
    },
    {
      name: "STEM_NO_NUMERIC_POINT_LABEL_LEAK",
      passed: !evidence.stemDiagram || !stemDiagramHasUnsafePointLabels(evidence.stemDiagram),
      message: "Optional stem diagrams may use symbolic point labels but must not leak numeric solution labels.",
    },
    {
      name: "STEM_NO_REQUESTED_ANGLE_LEAK",
      passed: !evidence.stemDiagram || !stemDiagramDisclosesRequestedAngle(state, evidence.stemDiagram),
      message: "An optional stem diagram must not print an angle when that angle is the requested answer.",
    },
    {
      name: "SOLUTION_AFTER_ATTEMPT",
      passed: evidence.disclosure.solutionStage === "AFTER_ATTEMPT",
      message: "The pedagogical solution figure is disclosed with the explanation, not as an automatic stem hint.",
    },
  ];

  return { valid: checks.every((check) => check.passed), checks };
}
