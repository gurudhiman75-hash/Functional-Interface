import type { Trg002Mvp48Id } from "./mvp-48-registry";
import { generateLabelledTrg002Mvp48Question } from "./mvp-runtime-48-labelled";

const FRESH_EDITORIAL_IDS = new Set<string>([
  "TRG-002-QL-002","TRG-002-QL-005","TRG-002-QL-009","TRG-002-QL-014","TRG-002-QL-018","TRG-002-QL-020","TRG-002-QL-024",
  "TRG-002-QL-028","TRG-002-QL-032","TRG-002-QL-035","TRG-002-QL-038","TRG-002-QL-041","TRG-002-QL-043","TRG-002-QL-048",
  "TRG-002-QL-052","TRG-002-QL-055","TRG-002-QL-058","TRG-002-QL-064","TRG-002-QL-067","TRG-002-QL-069","TRG-002-QL-071",
  "TRG-002-QL-076","TRG-002-QL-081","TRG-002-QL-086","TRG-002-QL-091","TRG-002-QL-094","TRG-002-QL-095","TRG-002-QL-096",
]);

function polishStem(qlId: string, stem: string) {
  switch (qlId) {
    case "TRG-002-QL-005":
      return stem.replace("the angle of elevation is", "the angle of elevation of its top is");
    case "TRG-002-QL-009":
      return stem.replace(" and its top is seen at 45°. Find", ". From a point on level ground, the angle of elevation of its top is 45°. Find");
    case "TRG-002-QL-014":
      return stem.replace("Find the angle of elevation.", "Find the angle of elevation of the top.");
    case "TRG-002-QL-018":
      return stem.replace(/the top of a pole (.+?) m away is seen at a depression of 45°/, "the top of a pole is seen at an angle of depression of 45°. The horizontal distance between the building and the pole is $1 m");
    case "TRG-002-QL-020":
      return stem.replace("seen at 45° depression", "seen at an angle of depression of 45°");
    case "TRG-002-QL-035":
      return stem.replace("the sun's elevation", "the angle of elevation of the sun").replace("Later the elevation becomes", "Later, this angle becomes");
    case "TRG-002-QL-048":
      return stem.replace("makes a 45° angle with it", "makes an angle of 45° with the ground");
    case "TRG-002-QL-095":
      return stem.replace("From a point ", "From a point on level ground ").replace(" m from a building", " m from the foot of a building");
    default:
      return stem;
  }
}

function polishExactPresentation(text: string) {
  return text
    .replace(/-(\d+) \+ (\d+)√3/g, (_match, rational: string, surd: string) =>
      rational === surd ? `${rational}(√3−1)` : `${surd}√3−${rational}`,
    )
    .replace(/\b(\d+)\/2 m\b/g, (_match, numerator: string) => {
      const value = Number(numerator) / 2;
      return `${Number.isInteger(value) ? value : value.toFixed(1)} m`;
    })
    .replace(/(\d+√3)=\1 m/g, "$1 m");
}

function polishStudentPresentation(question: any) {
  return {
    ...question,
    answer: polishExactPresentation(question.answer),
    options: question.options.map((option: any) => ({ ...option, display: polishExactPresentation(option.display) })),
    explanation: {
      ...question.explanation,
      keyRule: polishExactPresentation(question.explanation.keyRule),
      shortcut: polishExactPresentation(question.explanation.shortcut),
      traps: question.explanation.traps.map((trap: string) => polishExactPresentation(trap)),
      steps: question.explanation.steps.map((step: any) => ({ ...step, body: polishExactPresentation(step.body) })),
    },
  };
}

export function generateFinalEditorialTrg002Mvp48Question(qlId: Trg002Mvp48Id, seed: string) {
  const question: any = generateLabelledTrg002Mvp48Question(qlId, seed);
  return polishStudentPresentation({
    ...question,
    stem: polishStem(qlId, question.stem),
    reviewStatus: "AI_REVIEWED" as const,
    aiEditorialStatus: "PASS" as const,
    humanReviewStatus: "PENDING" as const,
    finalEditorialReview: {
      status: "PASS" as const,
      reviewedAt: "2026-08-14",
      scope: FRESH_EDITORIAL_IDS.has(qlId) ? "TRG-002_MVP_28_ADDITIONS_FRESH" as const : "TRG-002_PROOF_20_CARRIED" as const,
      runtimeSpecVisualInspection: "NOT_ASSERTED_PER_INSTANCE" as const,
      representativeRuntimeVisualEvidence: "EXTERNAL_REVIEW_ARTIFACT" as const,
      representativeVisualReviewScope: "ONE_DESIGNATED_REVIEW_INSTANCE_PER_QL" as const,
      appUiRenderedInspection: "PENDING" as const,
      renderedVisualInspection: "PENDING" as const,
      humanReviewSubstituted: false,
    },
  });
}
