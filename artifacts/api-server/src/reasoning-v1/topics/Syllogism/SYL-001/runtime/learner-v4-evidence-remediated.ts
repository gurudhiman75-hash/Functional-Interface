import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import {
  applyDuplicateClustersV4,
  buildEvidenceRowV4 as buildBaseEvidenceRowV4,
  legacyLocalizationDefectsV4,
  type SylLearnerEvidenceRowV4,
} from "./learner-v4-evidence";

export { applyDuplicateClustersV4, legacyLocalizationDefectsV4 };
export type { SylLearnerEvidenceRowV4 };

export function buildEvidenceRowV4(
  question: GeneratedSylQuestionV4,
  baseline: GeneratedSylQuestionV4,
): SylLearnerEvidenceRowV4 {
  const row = buildBaseEvidenceRowV4(question, baseline);
  const present = new Set(row.presentProofElements);
  const v4 = question.learnerPresentationV4;
  const witnessIds = v4.administratorProof.diagramSpecification.v3.witnessIds;
  const hasStructuredWitness = witnessIds.length > 0
    || v4.administratorProof.existencePolicy.dependentAnswer
    || v4.administratorProof.reasonCodes.includes("FORCED_WITNESS_TRANSFER");

  if (row.proofMode === "WITNESS_TRANSFER" && hasStructuredWitness) {
    present.add("EXISTENTIAL_WITNESS");
    present.add("TRANSFER_OR_EXCLUSION");
  }

  if (row.proofMode === "POSSIBLE_NOT_DEFINITE") {
    const trueModel = v4.administratorProof.proofModel
      ?? v4.administratorProof.diagramSpecification.v3.model;
    const falseModel = v4.administratorProof.counterModel
      ?? v4.administratorProof.alternateModel
      ?? v4.administratorProof.diagramSpecification.v3.alternateModel;
    if (trueModel) present.add("TRUE_CASE");
    if (falseModel) present.add("FALSE_CASE");
  }

  if (row.proofMode === "DUAL_MODEL") {
    const trueModel = v4.administratorProof.proofModel
      ?? v4.administratorProof.diagramSpecification.v3.model;
    const falseModel = v4.administratorProof.counterModel
      ?? v4.administratorProof.alternateModel
      ?? v4.administratorProof.diagramSpecification.v3.alternateModel;
    if (trueModel) present.add("TRUE_MODEL");
    if (falseModel) present.add("FALSE_MODEL");
  }

  const missing = row.requiredProofElements.filter((element) => !present.has(element));
  return {
    ...row,
    presentProofElements: [...present],
    proofElementCoverage: missing.length === 0 ? "PASS" : "FAIL",
  };
}
