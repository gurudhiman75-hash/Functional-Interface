import { formatExactPlain } from "../foundation/exact";
import {
  TRG_002_RUNTIME_PROOF_IDS,
  generateTrg002RuntimeProofQuestion,
  type Trg002ProofQlId,
  type Trg002ProofQuestion,
} from "./runtime-proof";

function point(question: Trg002ProofQuestion, id: string) {
  const found = question.canonicalSpatialState.points.find((item) => item.id === id);
  if (!found) throw new Error(`${question.qlId}: missing canonical point ${id}.`);
  return found;
}

function normalizeCanonicalRequestedTarget(question: Trg002ProofQuestion): Trg002ProofQuestion {
  if (question.qlId !== "TRG-002-QL-036") return question;
  return {
    ...question,
    canonicalSpatialState: {
      ...question.canonicalSpatialState,
      requested: { kind: "OBJECT_HEIGHT" as const, objectId: "wall-1" },
    },
  };
}

function remediateMoveFartherLeak(question: Trg002ProofQuestion): Trg002ProofQuestion {
  if (question.qlId !== "TRG-002-QL-061") return question;
  const movement = question.canonicalSpatialState.movements[0];
  if (!movement) throw new Error("TRG-002-QL-061: canonical movement is missing.");
  const nearDistance = point(question, "near-ground").x;
  const moved = formatExactPlain(movement.distance);
  const near = formatExactPlain(nearDistance);
  return {
    ...question,
    stem: `An observer sees the top of a tower at an elevation of 60°. After moving ${moved} m straight away from the tower, the angle becomes 30°. Find the height of the tower.`,
    explanation: {
      ...question.explanation,
      keyRule: "Use both observations: after moving farther, horizontal distance increases while the same tower height is unchanged.",
      steps: [
        { title: "Step 1", body: `Let the original distance be x m. After moving away, the distance is x+${moved} m.` },
        { title: "Step 2", body: `Equate the two height expressions: x tan60°=(x+${moved})tan30°. This gives x=${near} m.` },
        { title: "Answer", body: `Now h=x tan60°, so the tower height is ${question.answer}.` },
      ],
      shortcut: "Do not solve from only one observation; the original distance is not supplied in the reviewed stem.",
      traps: ["Treating the distance moved as the original distance makes the second observation redundant and gives the wrong model."],
    },
  };
}

export function generateReviewedTrg002RuntimeProofQuestion(qlId: Trg002ProofQlId, seed: string) {
  return remediateMoveFartherLeak(
    normalizeCanonicalRequestedTarget(generateTrg002RuntimeProofQuestion(qlId, seed)),
  );
}

export function generateAllReviewedTrg002RuntimeProofQuestions(seed: string) {
  return TRG_002_RUNTIME_PROOF_IDS.map((qlId) => generateReviewedTrg002RuntimeProofQuestion(qlId, seed));
}
