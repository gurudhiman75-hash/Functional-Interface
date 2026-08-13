import { degree } from "../foundation/angle";
import {
  exactKey,
  exactToNumber,
  formatExactPlain,
  subtractExact,
} from "../foundation/exact";
import {
  buildTrg002DiagramSpec,
  validateTrg002DiagramSpec,
  verifyTrg002SpatialState,
  type Trg002SpatialState,
} from "./spatial";
import {
  TRG_002_RUNTIME_PROOF_IDS,
  type Trg002ProofQlId,
  type Trg002ProofQuestion,
} from "./runtime-proof";
import { generateExamReadyTrg002RuntimeProofQuestion } from "./runtime-proof-exam-ready";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function object(state: Trg002SpatialState, id: string) {
  const found = state.verticalObjects.find((item) => item.id === id);
  if (!found) throw new Error(`Missing canonical object ${id}.`);
  return found;
}

function ql015NaturalDepression(question: Trg002ProofQuestion): Trg002ProofQuestion {
  if (question.qlId !== "TRG-002-QL-015") return question;
  assert(question.exactAnswer.kind === "NUMBER", "QL-015 must have a numeric length answer.");

  const observerHeight = object(question.canonicalSpatialState, "observer-building").height;
  const targetHeight = object(question.canonicalSpatialState, "target-object").height;
  const verticalDrop = subtractExact(observerHeight, targetHeight);
  const run = verticalDrop;

  const state: Trg002SpatialState = {
    ...question.canonicalSpatialState,
    points: question.canonicalSpatialState.points.map((item) => {
      if (item.id === "target-base" || item.id === "target-top") return { ...item, x: run };
      return item;
    }),
    observations: question.canonicalSpatialState.observations.map((observation) => ({
      ...observation,
      angle: degree(45),
    })),
  };

  const spatial = verifyTrg002SpatialState(state);
  const diagram = buildTrg002DiagramSpec(state);
  const diagramVerification = validateTrg002DiagramSpec(diagram);
  const reconstructed = exactToNumber(object(state, "target-object").height);
  const expected = exactToNumber(question.exactAnswer.value);
  const delta = Math.abs(reconstructed - expected);

  const stem = `From the top of a ${formatExactPlain(observerHeight)} m building, the top of a vertical pole ${formatExactPlain(run)} m away is seen at an angle of depression of 45°. Find the height of the pole.`;
  const explanation = {
    keyRule: "At 45°, the vertical drop from the observer's horizontal level equals the horizontal distance.",
    steps: [
      { title: "Step 1", body: `Let the vertical drop from the building top to the pole top be d. Since tan45°=d/${formatExactPlain(run)}=1, d=${formatExactPlain(run)} m.` },
      { title: "Step 2", body: `The pole top is ${formatExactPlain(verticalDrop)} m below the ${formatExactPlain(observerHeight)} m observation level.` },
      { title: "Answer", body: `Pole height=${formatExactPlain(observerHeight)}−${formatExactPlain(verticalDrop)}=${question.answer}.` },
    ],
    shortcut: "For 45° depression, horizontal distance equals the vertical drop; subtract that drop from the observer height.",
    traps: ["The horizontal distance gives the drop below eye level at 45°; it is not itself the pole height."],
  };

  const verification = {
    ...question.verification,
    spatial,
    diagram: diagramVerification,
    answer: {
      valid: Number.isFinite(reconstructed) && delta <= 1e-9,
      method: "CANONICAL_REQUEST_RECONSTRUCTION",
      reconstructed,
      expected,
      delta,
    },
  };

  const checks = question.validation.checks.map((check) => {
    if (check.name === "SPATIAL_VERIFIED") return { ...check, passed: spatial.valid };
    if (check.name === "DIAGRAM_VERIFIED") return { ...check, passed: diagramVerification.valid };
    if (check.name === "ANSWER_VERIFIED") return { ...check, passed: verification.answer.valid };
    return check;
  });

  const result: Trg002ProofQuestion = {
    ...question,
    stem,
    explanation,
    canonicalSpatialState: state,
    diagram,
    verification,
    validation: { valid: checks.every((check) => check.passed), checks },
  };

  assert(result.validation.valid, "QL-015 final remediation invalidated the question.");
  assert(spatial.valid && diagramVerification.valid && verification.answer.valid, "QL-015 final remediation failed canonical verification.");
  assert(!stem.includes("√"), "QL-015 final stem must use natural integer measurements.");
  assert(exactKey(object(state, "target-object").height) === exactKey(question.exactAnswer.value), "QL-015 final state changed the exact answer.");
  return result;
}

function finalEditorialPolish(question: Trg002ProofQuestion): Trg002ProofQuestion {
  if (question.qlId === "TRG-002-QL-049") {
    return {
      ...question,
      stem: question.stem.replace("Two points A and B on the same side of a tower are", "Two observation points on the same side of a tower are"),
    };
  }

  if (question.qlId === "TRG-002-QL-083") {
    return {
      ...question,
      stem: question.stem.replace("a second building", "another building"),
    };
  }

  return question;
}

export function generateFinalRemediatedTrg002RuntimeProofQuestion(qlId: Trg002ProofQlId, seed: string) {
  const question = ql015NaturalDepression(generateExamReadyTrg002RuntimeProofQuestion(qlId, seed));
  return finalEditorialPolish(question);
}

export function generateAllFinalRemediatedTrg002RuntimeProofQuestions(seed: string) {
  return TRG_002_RUNTIME_PROOF_IDS.map((qlId) => generateFinalRemediatedTrg002RuntimeProofQuestion(qlId, seed));
}
