import { TRG_002_RUNTIME_PROOF_IDS } from "./runtime-proof";
import { generateExamReadyTrg002RuntimeProofQuestion } from "./runtime-proof-exam-ready";
import {
  TRG_002_PROOF_SOLUTION_ANNOTATION_PLANS,
  buildTrg002SolutionAnnotations,
} from "./solution-diagram-annotations";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(Object.keys(TRG_002_PROOF_SOLUTION_ANNOTATION_PLANS).length === 20, "Solution annotation authority must define all 20 proof QLs.");
for (const qlId of TRG_002_RUNTIME_PROOF_IDS) {
  assert(Array.isArray(TRG_002_PROOF_SOLUTION_ANNOTATION_PLANS[qlId]), `${qlId} is missing an annotation plan.`);
  assert(TRG_002_PROOF_SOLUTION_ANNOTATION_PLANS[qlId].length >= 1, `${qlId} annotation plan must not be empty.`);
}

const seeds = Array.from({ length: 12 }, (_, index) => `trg002-annotations-${String(index + 1).padStart(2, "0")}`);
let cases = 0;
for (const qlId of TRG_002_RUNTIME_PROOF_IDS) {
  for (const seed of seeds) {
    const question = generateExamReadyTrg002RuntimeProofQuestion(qlId, seed);
    const evidence = buildTrg002SolutionAnnotations(question);
    assert(evidence.validation.valid, `${qlId} annotation evidence failed validation for ${seed}.`);
    assert(evidence.annotations.length >= 1, `${qlId} should emit at least one solution annotation.`);
    assert(new Set(evidence.annotations.map((item) => item.id)).size === evidence.annotations.length, `${qlId} annotation IDs are not unique.`);
    assert(evidence.annotations.every((item) => item.label.trim().length > 0), `${qlId} has an empty annotation label.`);
    assert(evidence.annotations.every((item) => !/NaN|undefined|Infinity/.test(item.label)), `${qlId} has a non-finite/unresolved annotation label.`);

    const solvedTargets = evidence.annotations.filter((item) => item.role === "TARGET_SOLVED");
    if (qlId === "TRG-002-QL-012") {
      assert(solvedTargets.length === 0, "QL-012 solved angle should remain on the canonical angle marker, not a numeric length annotation.");
    } else {
      assert(solvedTargets.length >= 1, `${qlId} length-target solution should expose its solved target on the solution diagram.`);
      assert(solvedTargets.every((item) => item.source.kind === "ANSWER"), `${qlId} solved targets must come from the exact answer authority.`);
      assert(solvedTargets.some((item) => item.label.includes(question.answer)), `${qlId} solved target annotation must contain the exact rendered answer.`);
    }

    if (qlId === "TRG-002-QL-036") {
      const target = solvedTargets.find((item) => item.id === "target-wall-height");
      assert(target, "QL-036 must annotate the solved wall height.");
      assert(target.fromPointId === "wall-base" && target.toPointId === "wall-contact", "QL-036 solved-height annotation must lie on the wall vertical.");
    }

    if (qlId === "TRG-002-QL-073") {
      const eye = evidence.annotations.find((item) => item.role === "EYE_HEIGHT");
      assert(eye?.label.includes("1.5 m"), "QL-073 solution diagram must expose the canonical 1.5 m eye height.");
    }

    cases += 1;
  }
}

console.log(`TRG-002 solution annotation gate target: ${cases} exact annotation cases across all 20 proof QLs.`);
