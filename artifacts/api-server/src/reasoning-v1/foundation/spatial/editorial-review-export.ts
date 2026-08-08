import { buildSpatialStemPresentationScene } from "./presentation-axis";
import type { SpatialTransformProofQuestion } from "./proof-types";
import { renderSpatialSceneToSvg } from "./svg-renderer";

export interface SpatialEditorialReviewRow {
  reviewId: string;
  chapterCode: string;
  prototypeId: string;
  seed: string;
  stimulusKind: string;
  requestedTransform: string;
  instructionKey: string;
  correctOptionNumber: number;
  optionLabels: string[];
  learnerExplanation: SpatialTransformProofQuestion["learnerExplanation"];
  reviewMetadata: SpatialTransformProofQuestion["reviewMetadata"];
  presentationAxis: "RIGHT_VERTICAL" | "BELOW_HORIZONTAL";
  recommendedOptionPixels: number;
  sourceSvg: string;
  optionSvgs: string[];
}

export interface SpatialEditorialReviewExport {
  schemaVersion: "1.1";
  familyCode: "SPA-001";
  generatedFrom: "DETERMINISTIC_PROOF_CORPUS";
  questionCount: number;
  rows: SpatialEditorialReviewRow[];
}

export function buildSpatialEditorialReviewExport(
  questions: readonly SpatialTransformProofQuestion[],
): SpatialEditorialReviewExport {
  const rows = questions.map((question, index) => {
    const presentation = buildSpatialStemPresentationScene(question);
    const isClock = question.stimulusKind === "ANALOG_CLOCK";
    return {
      reviewId: `SPA-W03-REVIEW-${String(index + 1).padStart(3, "0")}`,
      chapterCode: question.chapterCode,
      prototypeId: question.prototypeId,
      seed: question.seed,
      stimulusKind: question.stimulusKind ?? "SEEDED_GEOMETRIC_COMPOSITION",
      requestedTransform: question.requestedTransform,
      instructionKey: question.instructionKey,
      correctOptionNumber: question.correctOptionIndex + 1,
      optionLabels: question.options.map((option) => option.label),
      learnerExplanation: question.learnerExplanation,
      reviewMetadata: question.reviewMetadata,
      presentationAxis:
        question.requestedTransform === "REFLECT_VERTICAL"
          ? ("RIGHT_VERTICAL" as const)
          : ("BELOW_HORIZONTAL" as const),
      recommendedOptionPixels: isClock ? 190 : 150,
      sourceSvg: renderSpatialSceneToSvg(presentation, {
        ariaLabel: `${question.chapterCode} source ${index + 1}`,
      }),
      optionSvgs: question.options.map((option, optionIndex) =>
        renderSpatialSceneToSvg(option.scene, {
          ariaLabel: `${question.chapterCode} question ${index + 1} option ${
            optionIndex + 1
          }`,
        }),
      ),
    };
  });

  return {
    schemaVersion: "1.1",
    familyCode: "SPA-001",
    generatedFrom: "DETERMINISTIC_PROOF_CORPUS",
    questionCount: rows.length,
    rows,
  };
}
