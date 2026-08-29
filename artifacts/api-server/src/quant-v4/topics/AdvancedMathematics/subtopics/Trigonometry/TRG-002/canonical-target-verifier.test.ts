import { TRG_002_RUNTIME_PROOF_IDS } from "./runtime-proof";
import { generateExamReadyTrg002RuntimeProofQuestion } from "./runtime-proof-exam-ready";
import { verifyTrg002CanonicalRequestedTarget } from "./canonical-target-verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seeds = Array.from({ length: 12 }, (_, index) => `trg002-canonical-target-${String(index + 1).padStart(2, "0")}`);
let cases = 0;
for (const qlId of TRG_002_RUNTIME_PROOF_IDS) {
  for (const seed of seeds) {
    const question = generateExamReadyTrg002RuntimeProofQuestion(qlId, seed);
    const verification = verifyTrg002CanonicalRequestedTarget(question);
    assert(verification.valid, `${qlId} requested ${verification.requestedKind} but reconstructed ${verification.requested} instead of answer ${verification.answer} for ${seed}.`);

    if (qlId === "TRG-002-QL-036") {
      assert(question.canonicalSpatialState.requested.kind === "OBJECT_HEIGHT", "QL-036 must request wall height, not ladder length.");
      if (question.canonicalSpatialState.requested.kind === "OBJECT_HEIGHT") {
        assert(question.canonicalSpatialState.requested.objectId === "wall-1", "QL-036 must bind its height target to wall-1.");
      }
    }
    cases += 1;
  }
}

console.log(`TRG-002 canonical requested-target gate target: ${cases} cases across all 20 proof QLs.`);
