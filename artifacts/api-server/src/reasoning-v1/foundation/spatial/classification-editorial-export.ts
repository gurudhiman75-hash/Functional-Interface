import type {
  SpatialClassificationProofQuestion,
} from "./classification-types";
import {
  renderSpatialSceneToSvg,
} from "./svg-renderer";

export interface SpatialClassificationEditorialReviewRow {
  reviewId: string;
  seed: string;
  prototypeId: string;
  propertyId: string;
  propertyDescription: string;
  correctOptionNumber: number;
  propertyVector: boolean[];
  learnerExplanation: SpatialClassificationProofQuestion["learnerExplanation"];
  reviewMetadata: SpatialClassificationProofQuestion["reviewMetadata"];
  optionSvgs: string[];
}

export interface SpatialClassificationEditorialReviewExport {
  schemaVersion: "1.2";
  familyCode: "SPA-001";
  chapterCode: "FCL-001";
  generatedFrom: "DETERMINISTIC_PROOF_CORPUS";
  questionCount: number;
  rows: SpatialClassificationEditorialReviewRow[];
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function presentationDescription(
  profile: SpatialClassificationProofQuestion["presentationProfile"],
): string {
  const visible = [
    "outer/inner shapes",
    profile.showMarker ? "marker" : null,
    profile.showDirection ? "arrow" : null,
    profile.showShading ? "shading" : null,
    profile.showSegments ? "count dots" : null,
  ].filter((value): value is string => value !== null);
  return visible.join(", ");
}

export function buildSpatialClassificationEditorialReviewExport(
  questions: readonly SpatialClassificationProofQuestion[],
): SpatialClassificationEditorialReviewExport {
  return {
    schemaVersion: "1.2",
    familyCode: "SPA-001",
    chapterCode: "FCL-001",
    generatedFrom: "DETERMINISTIC_PROOF_CORPUS",
    questionCount: questions.length,
    rows: questions.map((question, index) => ({
      reviewId: `FCL-W01-REVIEW-${String(index + 1).padStart(3, "0")}`,
      seed: question.seed,
      prototypeId: question.prototypeId,
      propertyId: question.propertyId,
      propertyDescription: question.reviewMetadata.propertyDescription,
      correctOptionNumber: question.correctOptionIndex + 1,
      propertyVector: question.reviewMetadata.propertyVector,
      learnerExplanation: question.learnerExplanation,
      reviewMetadata: question.reviewMetadata,
      optionSvgs: question.options.map((option, optionIndex) =>
        renderSpatialSceneToSvg(option.scene, {
          ariaLabel: `Question ${index + 1} option ${optionIndex + 1}`,
        }),
      ),
    })),
  };
}

export function buildSpatialClassificationEditorialReviewHtml(
  review: SpatialClassificationEditorialReviewExport,
): string {
  const questions = review.rows
    .map((row, index) => {
      const options = row.optionSvgs
        .map(
          (svg, optionIndex) => `
            <div class="option">
              <div class="option-label">${String.fromCharCode(65 + optionIndex)}</div>
              ${svg}
            </div>`,
        )
        .join("");
      const nuisanceSummary = row.reviewMetadata.nuisanceFeatureDistributions
        .filter((item) => item.threeToOne)
        .map((item) => `${item.featureId}${item.intendedEquivalent ? " (intended)" : ""}`)
        .join(" · ");

      return `
        <article class="question">
          <header>
            <h2>Question ${index + 1}</h2>
            <span>${escapeHtml(row.propertyId)}</span>
          </header>
          <p class="instruction">Select the figure that is different from the other three.</p>
          <div class="options">${options}</div>
          <details>
            <summary>Answer, explanation and ambiguity diagnostics</summary>
            <p><strong>Answer:</strong> ${String.fromCharCode(65 + row.correctOptionNumber - 1)}</p>
            <p><strong>Observation:</strong> ${escapeHtml(row.learnerExplanation.observation)}</p>
            <p><strong>Rule:</strong> ${escapeHtml(row.learnerExplanation.rule)}</p>
            <p><strong>Option-by-option check:</strong> ${escapeHtml(row.learnerExplanation.application)}</p>
            <p><strong>Conclusion:</strong> ${escapeHtml(row.learnerExplanation.check)}</p>
            <p class="diagnostic"><strong>Visible controls:</strong> ${escapeHtml(presentationDescription(row.reviewMetadata.presentationProfile))}</p>
            <p class="diagnostic"><strong>Property vector:</strong> ${row.propertyVector.map((value) => value ? "PASS" : "ODD").join(" · ")}</p>
            <p class="diagnostic"><strong>Approved authority:</strong> ${row.reviewMetadata.uniqueWithinApprovedPropertyAuthorityCheck} · <strong>Visible-feature audit:</strong> ${row.reviewMetadata.nuisanceFeatureAuditCheck} (${row.reviewMetadata.auditedNuisanceFeatureCount} descriptors) · <strong>Scene integrity:</strong> ${row.reviewMetadata.sceneIntegrityCheck}</p>
            <p class="diagnostic"><strong>Allowed 3-to-1 descriptor:</strong> ${escapeHtml(nuisanceSummary || "none")}</p>
          </details>
        </article>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FCL-001 Figure Classification Presentation-Remediation Review</title>
  <style>
    :root { font-family: Inter, system-ui, sans-serif; color: #171717; background: #f4f4f5; }
    body { margin: 0; padding: 24px; }
    main { max-width: 1100px; margin: 0 auto; }
    .summary, .question { background: white; border: 1px solid #d4d4d8; border-radius: 14px; padding: 20px; margin-bottom: 20px; }
    header { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; }
    h1, h2 { margin: 0; }
    .instruction { margin: 10px 0 16px; }
    .options { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
    .option { position: relative; border: 1px solid #d4d4d8; border-radius: 10px; padding: 12px; text-align: center; min-width: 0; }
    .option svg { width: 180px; max-width: 100%; height: auto; }
    .option-label { position: absolute; left: 8px; top: 6px; font-weight: 700; }
    details { margin-top: 16px; border-top: 1px solid #e4e4e7; padding-top: 12px; }
    summary { cursor: pointer; font-weight: 700; }
    .diagnostic { color: #52525b; font-size: 13px; }
    @media (max-width: 760px) {
      body { padding: 12px; }
      .options { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
  </style>
</head>
<body>
  <main>
    <section class="summary">
      <h1>FCL-001 Figure Classification Presentation-Remediation Review</h1>
      <p>${review.questionCount} deterministic odd-figure questions. Each item exposes only rule-relevant controls, uses detached dots for counts and audits all visible nuisance descriptors.</p>
    </section>
    ${questions}
  </main>
</body>
</html>
`;
}
