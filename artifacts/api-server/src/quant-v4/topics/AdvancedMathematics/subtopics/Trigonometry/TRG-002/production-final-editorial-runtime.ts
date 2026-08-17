import { TRG_002_PRODUCTION_EXPANSION_48_IDS } from "./production-96-registry";
import { generateTrg002Production96Question } from "./production-runtime-96";

export type Trg002ProductionExpansion48Id = (typeof TRG_002_PRODUCTION_EXPANSION_48_IDS)[number];

function remodelExpansionStem(qlId: string, stem: string) {
  switch (qlId) {
    case "TRG-002-QL-003":
      return stem.replace(
        /^From a point (.+?) m from the foot of a tower, the angle of elevation of its top is 30°\. Find the exact height of the tower\.$/,
        "The angle of elevation of the top of a tower from a point on level ground $1 m from its foot is 30°. What is the exact height of the tower?",
      );
    case "TRG-002-QL-004":
      return stem.replace(
        /^An observation point is (.+?) m from a vertical chimney\. If the angle of elevation of its top is 60°, find the chimney's exact height\.$/,
        "From a point on level ground $1 m from the foot of a vertical chimney, the angle of elevation of its top is 60°. What is the exact height of the chimney?",
      );
    case "TRG-002-QL-016":
      return stem.replace(
        /^From the top of a (.+?) m building, the top of a pole (.+?) m away is seen at a depression of 30°\. Find the height of the pole\.$/,
        "From the top of a $1 m high building, the angle of depression of the top of a vertical pole is 30°. If the horizontal distance between the building and the pole is $2 m, what is the height of the pole?",
      );
    case "TRG-002-QL-017":
      return stem.replace(
        /^From the top of a (.+?) m building, the top of a shorter tower (.+?) m away is seen at a depression of 60°\. Find the shorter tower's height\.$/,
        "From the top of a $1 m high building, the angle of depression of the top of a shorter tower is 60°. If the horizontal distance between the two structures is $2 m, what is the height of the shorter tower?",
      );
    case "TRG-002-QL-050":
      return stem.replace(
        /^Two points on the same side of a tower are (.+?) m apart\. The angles of elevation are 30° at the farther point and 45° at the nearer point\. Find the height of the tower\.$/,
        "Two points lie on the same side of a tower and on the same straight line with its foot. They are $1 m apart. The angles of elevation of the top are 30° from the farther point and 45° from the nearer point. What is the height of the tower?",
      );
    case "TRG-002-QL-051":
      return stem.replace(
        /^Two observation points on the same side of a tower are (.+?) m apart\. Their elevation angles are 45° at the nearer point and 30° at the farther point\. Find the farther point's distance from the tower\.$/,
        "Two points lie on the same side of a tower and on the same straight line with its foot. They are $1 m apart. The angles of elevation of the top are 45° from the nearer point and 30° from the farther point. What is the distance of the farther point from the foot of the tower?",
      );
    case "TRG-002-QL-053":
      return stem.replace(
        /^Two points on the same side of a tower are (.+?) m apart\. The top is seen at 45° from the farther point and 60° from the nearer point\. Find the tower's exact height\.$/,
        "Two points lie on the same side of a tower and on the same straight line with its foot. They are $1 m apart. The angles of elevation of the top are 45° from the farther point and 60° from the nearer point. What is the exact height of the tower?",
      );
    case "TRG-002-QL-054":
      return stem.replace(
        /^Two observation points on the same side of a tower are (.+?) m apart\. The angles of elevation are 45° at the farther point and 60° at the nearer point\. Find the nearer point's distance from the tower\.$/,
        "Two points lie on the same side of a tower and on the same straight line with its foot. They are $1 m apart. The angles of elevation of the top are 45° from the farther point and 60° from the nearer point. What is the distance of the nearer point from the foot of the tower?",
      );
    case "TRG-002-QL-072":
      return stem.replace(
        /^Two equal-height towers of height (.+?) m stand on the same side of an observation point\. Their tops are seen at 45° and 30°, with the 30° tower farther away\. Find the distance between their feet\.$/,
        "Two towers, each $1 m high, stand on the same side of an observation point, and the point and both tower feet are collinear. Their tops are seen at angles of elevation of 45° and 30°, with the 30° tower farther away. What is the distance between the feet of the towers?",
      );
    case "TRG-002-QL-084":
      return stem.replace(
        /^From the roof of a (.+?) m building, the top of another building (.+?) m away is seen at an elevation of 30°\. Find the height of the second building\.$/,
        "From the roof of a $1 m high building, the angle of elevation of the top of another building is 30°. If the horizontal distance between the buildings is $2 m, what is the height of the second building?",
      );
    case "TRG-002-QL-085":
      return stem.replace(
        /^From the roof of a (.+?) m building, the top of a shorter building (.+?) m away is seen at a depression of 60°\. Find the shorter building's height\.$/,
        "From the roof of a $1 m high building, the angle of depression of the top of a shorter building is 60°. If the horizontal distance between the buildings is $2 m, what is the height of the shorter building?",
      );
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

function polishExpansionPresentation(question: any) {
  return {
    ...question,
    stem: polishExactPresentation(remodelExpansionStem(question.qlId, question.stem)),
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

export function generateFinalEditorialTrg002ProductionExpansionQuestion(qlId: Trg002ProductionExpansion48Id, seed: string) {
  if (!TRG_002_PRODUCTION_EXPANSION_48_IDS.includes(qlId)) {
    throw new Error(`Unknown TRG-002 Phase-8 expansion QL ${qlId}.`);
  }
  const question: any = generateTrg002Production96Question(qlId, seed);
  return polishExpansionPresentation({
    ...question,
    reviewStatus: "AI_REVIEWED" as const,
    aiEditorialStatus: "PASS" as const,
    humanReviewStatus: "PENDING" as const,
    finalEditorialReview: {
      status: "PASS" as const,
      reviewedAt: "2026-08-17",
      scope: "TRG-002_PHASE8_EXPANSION_48" as const,
      runtimeSpecVisualInspection: "NOT_ASSERTED_PER_INSTANCE" as const,
      representativeRuntimeVisualEvidence: "EDITORIAL_REVIEW_ARTIFACT_TEXT_PLUS_DIAGRAM_METADATA" as const,
      representativeVisualReviewScope: "ONE_DESIGNATED_RUNTIME_INSTANCE_PER_EXPANSION_QL" as const,
      appUiRenderedInspection: "PENDING" as const,
      renderedVisualInspection: "PENDING" as const,
      humanReviewSubstituted: false,
    },
  });
}

export function generateAllFinalEditorialTrg002ProductionExpansionQuestions(seedPrefix = "trg002-production-editorial") {
  return TRG_002_PRODUCTION_EXPANSION_48_IDS.map((qlId, index) =>
    generateFinalEditorialTrg002ProductionExpansionQuestion(
      qlId,
      `${seedPrefix}-${String(index + 1).padStart(2, "0")}`,
    ),
  );
}
