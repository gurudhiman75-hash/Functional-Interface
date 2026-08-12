import {
  TRG_002_RUNTIME_PROOF_IDS,
  type Trg002ProofQlId,
} from "./runtime-proof";
import { generateExamReadyTrg002RuntimeProofQuestion } from "./runtime-proof-exam-ready";
import { verifyTrg002CanonicalRequestedTarget } from "./canonical-target-verifier";
import {
  buildTrg002DiagramEvidence,
  validateTrg002DiagramEvidence,
} from "./spatial";

export function generateSolutionDiagramTrg002RuntimeProofQuestion(qlId: Trg002ProofQlId, seed: string) {
  const question = generateExamReadyTrg002RuntimeProofQuestion(qlId, seed);
  const canonicalTargetVerification = verifyTrg002CanonicalRequestedTarget(question);
  if (!canonicalTargetVerification.valid) {
    throw new Error(`${qlId}: canonical requested target does not match the exact answer.`);
  }

  const diagramEvidence = buildTrg002DiagramEvidence(qlId, question.canonicalSpatialState);
  const diagramPolicyVerification = validateTrg002DiagramEvidence(question.canonicalSpatialState, diagramEvidence);
  if (!diagramPolicyVerification.valid || !diagramEvidence.solutionDiagram) {
    throw new Error(`${qlId}: required solution-diagram policy failed.`);
  }

  const checks = [
    ...question.validation.checks,
    {
      name: "CANONICAL_REQUESTED_TARGET_MATCH",
      passed: canonicalTargetVerification.valid,
      message: "Canonical requested target reconstructs the same quantity as the exact answer.",
    },
    {
      name: "SOLUTION_DIAGRAM_REQUIRED",
      passed: diagramEvidence.policy.solutionDiagramPolicy === "REQUIRED" && Boolean(diagramEvidence.solutionDiagram),
      message: "TRG-002 proof question carries its required solution diagram.",
    },
    {
      name: "SOLUTION_DIAGRAM_STATE_BOUND",
      passed: diagramPolicyVerification.valid,
      message: "Solution diagram is validated against the same canonical spatial state as the question.",
    },
    {
      name: "NO_AUTOMATIC_STEM_DIAGRAM",
      passed: diagramEvidence.stemDiagram === undefined,
      message: "Stem diagram remains an explicit optional editorial choice rather than an automatic hint.",
    },
    {
      name: "SOLUTION_DISCLOSURE_STAGE",
      passed: diagramEvidence.disclosure.solutionStage === "AFTER_ATTEMPT",
      message: "Required solution diagram is disclosed with the explanation after the attempt.",
    },
  ];

  return {
    ...question,
    diagram: diagramEvidence.solutionDiagram,
    solutionDiagram: diagramEvidence.solutionDiagram,
    stemDiagram: undefined,
    diagramEvidence,
    verification: {
      ...question.verification,
      canonicalTarget: canonicalTargetVerification,
      diagramPolicy: diagramPolicyVerification,
    },
    validation: {
      valid: checks.every((check) => check.passed),
      checks,
    },
  };
}

export function generateAllSolutionDiagramTrg002RuntimeProofQuestions(seed: string) {
  return TRG_002_RUNTIME_PROOF_IDS.map((qlId) => generateSolutionDiagramTrg002RuntimeProofQuestion(qlId, seed));
}
