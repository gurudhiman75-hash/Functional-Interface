import { TRG_002_RUNTIME_PROOF_IDS } from "./runtime-proof";
import { TRG_002_MVP_48_IDS, type Trg002Mvp48Id } from "./mvp-48-registry";
import { generateTrg002Mvp48Question } from "./mvp-runtime-48";
import { resolveMvpDiagramLabels } from "./mvp-diagram-label-core";
import { TRG_002_MVP_ADDED_LABEL_PLANS } from "./mvp-diagram-label-plans";

const proofIds = new Set<string>(TRG_002_RUNTIME_PROOF_IDS);

function normalizeStemForEditorial(qlId: Trg002Mvp48Id, question: any) {
  if (qlId === "TRG-002-QL-092") {
    const stem = question.stem.replace(
      /^A (.+?) m tower stands on one river bank\. From its top, (?:the point directly opposite|a point directly opposite the tower) on the other bank is seen at (.+?)° depression\. Find the river width\.$/,
      "A tower $1 m high stands at the edge of a river bank. From its top, the angle of depression of a point directly opposite on the other bank is $2°. What is the width of the river?",
    );
    return { ...question, stem };
  }

  if (qlId === "TRG-002-QL-024") {
    const stem = question.stem.replace(
      /^A building is (.+?) m high\. Its top is observed at an angle of elevation of (.+?)°\. Find the sloping distance from the observer to the top\.$/,
      "From a point on level ground, the angle of elevation of the top of a building $1 m high is $2°. What is the distance from the observer to the top of the building?",
    );
    return { ...question, stem };
  }

  return question;
}

export function generateLabelledTrg002Mvp48Question(qlId: Trg002Mvp48Id, seed: string) {
  const generated: any = generateTrg002Mvp48Question(qlId, seed);
  const question: any = normalizeStemForEditorial(qlId, generated);
  if (proofIds.has(qlId)) return question;
  const evidence = resolveMvpDiagramLabels(question, TRG_002_MVP_ADDED_LABEL_PLANS);
  const hasRequestedLabel = question.target === "ANGLE" || evidence.annotations.some((item) => item.role === "TARGET_SOLVED" && item.source.kind === "ANSWER" && item.label.includes(question.answer));
  const checks = [
    ...question.validation.checks,
    { name: "MVP_LABELS_VALID", passed: evidence.validation.valid, message: "Canonical diagram labels are valid." },
    { name: "MVP_REQUESTED_LABEL", passed: hasRequestedLabel, message: "Requested length is labelled from the exact answer." },
  ];
  return {
    ...question,
    solutionAnnotations: evidence.annotations,
    verification: { ...question.verification, solutionAnnotations: evidence.validation },
    validation: { valid: checks.every((check) => check.passed), checks },
  };
}

export function generateAllLabelledTrg002Mvp48Questions(seed: string) {
  return TRG_002_MVP_48_IDS.map((qlId) => generateLabelledTrg002Mvp48Question(qlId, seed));
}
