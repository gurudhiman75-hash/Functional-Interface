import {
  TRG_002_RUNTIME_PROOF_IDS,
} from "./runtime-proof";
import {
  generateAllSolutionDiagramTrg002RuntimeProofQuestions,
  generateSolutionDiagramTrg002RuntimeProofQuestion,
} from "./runtime-proof-solution-diagram";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const canonicalSeeds = Array.from({ length: 12 }, (_, index) => `trg002-solution-diagram-${String(index + 1).padStart(2, "0")}`);
let canonicalCases = 0;

for (const qlId of TRG_002_RUNTIME_PROOF_IDS) {
  for (const seed of canonicalSeeds) {
    const question = generateSolutionDiagramTrg002RuntimeProofQuestion(qlId, seed);
    assert(question.validation.valid, `${qlId} solution-diagram candidate failed validation for ${seed}.`);
    assert(question.solutionDiagram, `${qlId} must contain a required solution diagram.`);
    assert(question.diagram === question.solutionDiagram, `${qlId} compatibility diagram alias must reference the solution diagram.`);
    assert(question.stemDiagram === undefined, `${qlId} must not automatically expose a stem diagram.`);
    assert(question.diagramEvidence.policy.solutionDiagramPolicy === "REQUIRED", `${qlId} must retain REQUIRED solution policy.`);
    assert(question.diagramEvidence.policy.stemDiagramPolicy === "OPTIONAL", `${qlId} must keep stem diagram optional.`);
    assert(question.diagramEvidence.policy.purpose === "SPATIAL_MODEL", `${qlId} must use SPATIAL_MODEL purpose.`);
    assert(question.diagramEvidence.disclosure.solutionStage === "AFTER_ATTEMPT", `${qlId} solution figure must be explanation-stage.`);
    assert(question.verification.canonicalTarget.valid, `${qlId} canonical requested target does not match exact answer.`);
    assert(question.verification.diagramPolicy.valid, `${qlId} solution-diagram state binding failed.`);
    assert(question.verification.solutionAnnotations.valid, `${qlId} solution annotations failed validation.`);
    assert(question.solutionAnnotations.length >= 1, `${qlId} must expose at least one exact solution annotation.`);
    assert(question.solutionDiagram.strategy === question.canonicalSpatialState.diagramStrategy, `${qlId} diagram strategy drifted from canonical state.`);
    assert(question.solutionAnnotations.every((item) => !/NaN|undefined|Infinity/.test(item.label)), `${qlId} has a non-finite/unresolved solution annotation.`);
    assert(!question.publiclyPublishable && !question.questionStudioDiscoverable && question.testEligibility === "INELIGIBLE", `${qlId} activation lock changed.`);
    canonicalCases += 1;
  }
}

const sweepSeeds = Array.from({ length: 50 }, (_, index) => `trg002-solution-diagram-sweep-${String(index + 1).padStart(2, "0")}`);
let sweepCases = 0;
for (const seed of sweepSeeds) {
  const questions = generateAllSolutionDiagramTrg002RuntimeProofQuestions(seed);
  assert(questions.length === 20, `${seed} did not generate all 20 proof QLs.`);
  for (const question of questions) {
    assert(question.validation.valid, `${question.qlId} failed solution-diagram sweep validation for ${seed}.`);
    assert(question.solutionDiagram && question.verification.diagramPolicy.valid, `${question.qlId} lost required solution diagram evidence for ${seed}.`);
    assert(question.verification.canonicalTarget.valid, `${question.qlId} lost canonical requested-target integrity for ${seed}.`);
    assert(question.verification.solutionAnnotations.valid && question.solutionAnnotations.length >= 1, `${question.qlId} lost exact solution annotations for ${seed}.`);
    assert(question.stemDiagram === undefined, `${question.qlId} unexpectedly produced a stem diagram for ${seed}.`);
    sweepCases += 1;
  }
}

console.log(`TRG-002 solution-diagram proof gate target: ${canonicalCases} canonical cases and ${sweepCases} sweep cases with required diagrams, canonical targets and exact annotations.`);
