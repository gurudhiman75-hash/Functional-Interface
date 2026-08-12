import { degree } from "../../foundation/angle";
import { exactInteger } from "../../foundation/exact";
import {
  TRG_001_DIAGRAM_POLICY_COUNTS,
  TRG_002_DIAGRAM_POLICY_COUNTS,
  trg001DiagramPolicyForQl,
  trg002DiagramPolicyForQl,
} from "../../diagram-policy";
import {
  buildLadderState,
  buildOppositeSideState,
  buildSameSideMovingState,
  buildSingleElevationState,
  buildTrg002DiagramEvidence,
  trg002SpatialStateFingerprint,
  validateTrg002DiagramEvidence,
} from "./index";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function ql(packageId: "TRG-001" | "TRG-002", n: number) {
  return `${packageId}-QL-${String(n).padStart(3, "0")}`;
}

const trg001Counts = { REQUIRED: 0, OPTIONAL: 0, NONE: 0 };
for (let n = 1; n <= 144; n += 1) {
  trg001Counts[trg001DiagramPolicyForQl(ql("TRG-001", n)).solutionDiagramPolicy] += 1;
}
assert(trg001Counts.REQUIRED === TRG_001_DIAGRAM_POLICY_COUNTS.solutionRequired, "TRG-001 required solution-diagram count drifted.");
assert(trg001Counts.OPTIONAL === TRG_001_DIAGRAM_POLICY_COUNTS.solutionOptional, "TRG-001 optional solution-diagram count drifted.");
assert(trg001Counts.NONE === TRG_001_DIAGRAM_POLICY_COUNTS.solutionNone, "TRG-001 no-diagram count drifted.");
assert(trg001Counts.REQUIRED === 24 && trg001Counts.OPTIONAL === 10 && trg001Counts.NONE === 110, "TRG-001 solution-diagram policy must remain selective.");

const trg002Counts = { REQUIRED: 0, OPTIONAL: 0, NONE: 0 };
for (let n = 1; n <= 96; n += 1) {
  const policy = trg002DiagramPolicyForQl(ql("TRG-002", n));
  trg002Counts[policy.solutionDiagramPolicy] += 1;
  assert(policy.stemDiagramPolicy === "OPTIONAL", `${ql("TRG-002", n)} must not force a stem diagram.`);
  assert(policy.purpose === "SPATIAL_MODEL", `${ql("TRG-002", n)} must retain the spatial-model diagram purpose.`);
}
assert(trg002Counts.REQUIRED === TRG_002_DIAGRAM_POLICY_COUNTS.solutionRequired, "TRG-002 required solution-diagram count drifted.");
assert(trg002Counts.OPTIONAL === 0 && trg002Counts.NONE === 0, "TRG-002 solution diagrams are required by default for all 96 permanent spatial QLs.");

const scenes = [
  {
    qlId: "TRG-002-QL-001",
    state: buildSingleElevationState({ horizontal: exactInteger(20), angle: degree(45), units: "m" }),
  },
  {
    qlId: "TRG-002-QL-049",
    state: buildSameSideMovingState({ farAngle: degree(30), nearAngle: degree(60), movementTowardObject: exactInteger(20), units: "m" }),
  },
  {
    qlId: "TRG-002-QL-078",
    state: buildOppositeSideState({ leftAngle: degree(45), rightAngle: degree(45), observerSeparation: exactInteger(20), units: "m" }),
  },
  {
    qlId: "TRG-002-QL-036",
    state: buildLadderState({ ladderLength: exactInteger(10), angleAtGround: degree(30), units: "m" }),
  },
];

for (const { qlId, state } of scenes) {
  const first = buildTrg002DiagramEvidence(qlId, state);
  const second = buildTrg002DiagramEvidence(qlId, state);
  assert(first.solutionDiagram, `${qlId} must produce a solution diagram.`);
  assert(!first.stemDiagram, `${qlId} must not automatically reveal a stem diagram.`);
  assert(first.disclosure.solutionStage === "AFTER_ATTEMPT", `${qlId} solution diagram must be explanation-stage evidence.`);
  assert(first.sourceStateFingerprint === second.sourceStateFingerprint, `${qlId} state fingerprint must be deterministic.`);
  assert(first.sourceStateFingerprint === trg002SpatialStateFingerprint(state), `${qlId} evidence fingerprint must match canonical spatial state.`);
  assert(validateTrg002DiagramEvidence(state, first).valid, `${qlId} solution diagram evidence must validate.`);

  const withStem = buildTrg002DiagramEvidence(qlId, state, { includeStemDiagram: true });
  assert(withStem.stemDiagram, `${qlId} optional stem diagram should be buildable when explicitly requested.`);
  assert(validateTrg002DiagramEvidence(state, withStem).valid, `${qlId} safe optional stem diagram must validate.`);
}

const original = buildSingleElevationState({ horizontal: exactInteger(20), angle: degree(45), units: "m" });
const evidence = buildTrg002DiagramEvidence("TRG-002-QL-001", original);
const tampered = {
  ...original,
  points: original.points.map((point) => point.id === "observer-ground"
    ? { ...point, x: exactInteger(99) }
    : point),
};
const tamperedValidation = validateTrg002DiagramEvidence(tampered, evidence);
assert(!tamperedValidation.valid, "Diagram evidence must fail when reused against a different canonical spatial state.");
assert(tamperedValidation.checks.some((check) => check.name === "CANONICAL_STATE_BINDING" && !check.passed), "Canonical-state fingerprint tamper must be diagnosed explicitly.");

const numericStemLabelState = {
  ...original,
  points: original.points.map((point) => point.id === "object-top"
    ? { ...point, label: "20 m" }
    : point),
};
const numericStemEvidence = buildTrg002DiagramEvidence("TRG-002-QL-001", numericStemLabelState, { includeStemDiagram: true });
const numericStemValidation = validateTrg002DiagramEvidence(numericStemLabelState, numericStemEvidence);
assert(!numericStemValidation.valid, "A stem diagram carrying a numeric point-label leak must fail policy validation.");
assert(numericStemValidation.checks.some((check) => check.name === "STEM_NO_NUMERIC_POINT_LABEL_LEAK" && !check.passed), "Stem answer-leak failure must be diagnosed explicitly.");

const angleTargetState = {
  ...original,
  requested: { kind: "ANGLE" as const, observationId: "obs-1" },
};
const solutionOnlyAngleEvidence = buildTrg002DiagramEvidence("TRG-002-QL-012", angleTargetState);
assert(validateTrg002DiagramEvidence(angleTargetState, solutionOnlyAngleEvidence).valid, "An angle-target solution diagram must remain valid after the attempt.");
const leakingAngleStemEvidence = buildTrg002DiagramEvidence("TRG-002-QL-012", angleTargetState, { includeStemDiagram: true });
const leakingAngleStemValidation = validateTrg002DiagramEvidence(angleTargetState, leakingAngleStemEvidence);
assert(!leakingAngleStemValidation.valid, "A stem diagram must fail when it prints the angle that the learner is asked to find.");
assert(leakingAngleStemValidation.checks.some((check) => check.name === "STEM_NO_REQUESTED_ANGLE_LEAK" && !check.passed), "Requested-angle leakage must be diagnosed explicitly.");

console.log("Trigonometry solution-diagram architecture locked: TRG-001 selective policy, TRG-002 96/96 required solution diagrams, canonical-state binding, optional stem separation, numeric-label protection and requested-angle leak protection.");
