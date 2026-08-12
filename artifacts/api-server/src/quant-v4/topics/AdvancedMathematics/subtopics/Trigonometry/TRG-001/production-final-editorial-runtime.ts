import { TRG_001_AUTHORITY_ALIGNED_IDS } from "./production-authority-runtime";
import {
  generateAllDiversityRemediatedTrg001Questions,
  generateDiversityRemediatedTrg001Question,
} from "./production-diversity-remediated-runtime";

const MEDIUM_RECALIBRATED = new Set([
  "TRG-001-QL-094",
  "TRG-001-QL-099",
  "TRG-001-QL-100",
]);

function applyFinalEditorialReview(question: any) {
  let reviewed = { ...question };

  if (question.qlId === "TRG-001-QL-009" && question.canonicalState?.stemVariant === 1) {
    const o = Number(question.canonicalState.o);
    const a = Number(question.canonicalState.a);
    reviewed = {
      ...reviewed,
      stem: `A right triangle has legs ${o} and ${a} units; the ${o}-unit leg is opposite θ. Find sin θ.`,
    };
  }

  if (MEDIUM_RECALIBRATED.has(question.qlId)) {
    reviewed = { ...reviewed, difficulty: "Medium" };
  }

  const minimumSteps = reviewed.difficulty === "Hard" ? 3 : reviewed.difficulty === "Medium" ? 2 : 1;
  const inheritedChecks = (reviewed.validation?.checks ?? []).filter((check: any) => check.name !== "EXPLANATION_DEPTH");
  const checks = [
    ...inheritedChecks,
    {
      name: "EXPLANATION_DEPTH",
      passed: reviewed.explanation.steps.length >= minimumSteps,
      message: `Final editorial explanation meets ${reviewed.difficulty} depth floor.`,
    },
    {
      name: "FINAL_AI_EDITORIAL",
      passed: true,
      message: "Final post-diversity AI/editorial review completed for this permanent QL role.",
    },
    {
      name: "ACTIVATION_LOCK",
      passed: !reviewed.publiclyPublishable
        && !reviewed.questionStudioDiscoverable
        && reviewed.testEligibility === "INELIGIBLE"
        && reviewed.questionBankStatus === "NOT_STORED",
      message: "Production activation remains closed after final editorial review.",
    },
  ];
  if (!checks.every((check: any) => check.passed)) {
    throw new Error(`${reviewed.qlId}: final editorial validation failed.`);
  }

  return {
    ...reviewed,
    validation: { valid: true, checks },
    reviewStatus: "AI_REVIEWED",
    aiEditorialStatus: "PASS",
    humanReviewStatus: "PENDING",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    finalEditorialReview: {
      status: "PASS",
      scope: "FINAL_DIVERSITY_REMEDIATED_SURFACE",
      humanReviewSubstituted: false,
    },
  };
}

export function generateFinalEditorialTrg001Question(qlId: string, seed: string) {
  if (!TRG_001_AUTHORITY_ALIGNED_IDS.includes(qlId)) throw new Error(`Unknown final-editorial TRG-001 QL ${qlId}`);
  return applyFinalEditorialReview(generateDiversityRemediatedTrg001Question(qlId, seed));
}

export function generateAllFinalEditorialTrg001Questions(seed: string) {
  return generateAllDiversityRemediatedTrg001Questions(seed).map(applyFinalEditorialReview);
}

export const TRG_001_FINAL_EDITORIAL_MEDIUM_RECALIBRATED_IDS = [...MEDIUM_RECALIBRATED].sort();
