import type { SpatialAnalogyProofQuestion } from "./analogy-types";
import { renderSpatialSceneToSvg } from "./svg-renderer";

export interface SpatialAnalogyEditorialReviewRow {
  reviewId: string;
  seed: string;
  prototypeId: string;
  ruleId: string;
  ruleComplexity: string;
  correctOptionNumber: number;
  optionLabels: string[];
  optionRuleIds: string[];
  learnerExplanation: SpatialAnalogyProofQuestion["learnerExplanation"];
  reviewMetadata: SpatialAnalogyProofQuestion["reviewMetadata"];
  aSvg: string;
  bSvg: string;
  cSvg: string;
  optionSvgs: string[];
}

export interface SpatialAnalogyEditorialReviewExport {
  schemaVersion: "1.0";
  familyCode: "SPA-001";
  chapterCode: "FAN-001";
  generatedFrom: "DETERMINISTIC_PROOF_CORPUS";
  questionCount: number;
  rows: SpatialAnalogyEditorialReviewRow[];
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

export function buildSpatialAnalogyEditorialReviewExport(questions: readonly SpatialAnalogyProofQuestion[]): SpatialAnalogyEditorialReviewExport {
  return {
    schemaVersion: "1.0",
    familyCode: "SPA-001",
    chapterCode: "FAN-001",
    generatedFrom: "DETERMINISTIC_PROOF_CORPUS",
    questionCount: questions.length,
    rows: questions.map((question, index) => ({
      reviewId: `FAN-W01-REVIEW-${String(index + 1).padStart(3, "0")}`,
      seed: question.seed,
      prototypeId: question.prototypeId,
      ruleId: question.ruleId,
      ruleComplexity: question.reviewMetadata.ruleComplexity,
      correctOptionNumber: question.correctOptionIndex + 1,
      optionLabels: question.options.map((option) => option.label),
      optionRuleIds: question.options.map((option) => option.appliedRuleId),
      learnerExplanation: question.learnerExplanation,
      reviewMetadata: question.reviewMetadata,
      aSvg: renderSpatialSceneToSvg(question.aScene, { ariaLabel: `Question ${index + 1} figure A` }),
      bSvg: renderSpatialSceneToSvg(question.bScene, { ariaLabel: `Question ${index + 1} figure B` }),
      cSvg: renderSpatialSceneToSvg(question.cScene, { ariaLabel: `Question ${index + 1} figure C` }),
      optionSvgs: question.options.map((option, optionIndex) => renderSpatialSceneToSvg(option.scene, { ariaLabel: `Question ${index + 1} option ${optionIndex + 1}` })),
    })),
  };
}

export function buildSpatialAnalogyEditorialReviewHtml(review: SpatialAnalogyEditorialReviewExport): string {
  const questions = review.rows.map((row, index) => {
    const options = row.optionSvgs.map((svg, optionIndex) => `
      <div class="option"><div class="option-label">${String.fromCharCode(65 + optionIndex)}</div>${svg}</div>`).join("");
    return `
      <article class="question">
        <header><h2>Question ${index + 1}</h2><span>${escapeHtml(row.ruleId)}</span></header>
        <p class="instruction">Choose the figure that completes A : B :: C : ?</p>
        <div class="analogy">
          <div class="figure"><b>A</b>${row.aSvg}</div><div class="relation">:</div>
          <div class="figure"><b>B</b>${row.bSvg}</div><div class="relation">::</div>
          <div class="figure"><b>C</b>${row.cSvg}</div><div class="relation">:</div><div class="unknown">?</div>
        </div>
        <div class="options">${options}</div>
        <details>
          <summary>Answer and explanation</summary>
          <p><strong>Answer:</strong> ${String.fromCharCode(65 + row.correctOptionNumber - 1)}</p>
          <p><strong>Observation:</strong> ${escapeHtml(row.learnerExplanation.observation)}</p>
          <p><strong>Rule:</strong> ${escapeHtml(row.learnerExplanation.rule)}</p>
          <p><strong>Application:</strong> ${escapeHtml(row.learnerExplanation.application)}</p>
          <p><strong>Check:</strong> ${escapeHtml(row.learnerExplanation.check)}</p>
          <p class="diagnostic"><strong>Geometry:</strong> ${escapeHtml(row.reviewMetadata.geometricTransformCheck)} · <strong>Visual delta:</strong> ${escapeHtml(row.reviewMetadata.visualDeltaCheck)} · <strong>Visible roles:</strong> ${escapeHtml(row.reviewMetadata.visibleRoleCheck)}</p>
          <p class="diagnostic"><strong>Changed visual roles:</strong> ${row.reviewMetadata.changedVisualRoles.map(escapeHtml).join(" · ")}</p>
          <p class="diagnostic"><strong>Option rules:</strong> ${row.optionRuleIds.map(escapeHtml).join(" · ")}</p>
        </details>
      </article>`;
  }).join("\n");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>FAN-001 Figure Analogy Proof Review</title>
<style>
:root{font-family:Inter,system-ui,sans-serif;color:#171717;background:#f4f4f5}body{margin:0;padding:24px}main{max-width:1180px;margin:0 auto}.summary,.question{background:white;border:1px solid #d4d4d8;border-radius:14px;padding:20px;margin-bottom:20px}header{display:flex;justify-content:space-between;gap:12px;align-items:baseline}h1,h2{margin:0}.instruction{margin:10px 0 16px}.analogy{display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto .5fr;gap:10px;align-items:center}.figure{min-width:0;text-align:center}.figure svg{width:180px;max-width:100%;height:auto}.figure b{display:block;margin-bottom:4px}.relation,.unknown{font-size:28px;font-weight:700;text-align:center}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:18px}.option{position:relative;border:1px solid #d4d4d8;border-radius:10px;padding:10px;text-align:center}.option svg{width:180px;max-width:100%;height:auto}.option-label{position:absolute;left:8px;top:6px;font-weight:700}details{margin-top:16px;border-top:1px solid #e4e4e7;padding-top:12px}summary{cursor:pointer;font-weight:700}.diagnostic{color:#52525b;font-size:13px}@media(max-width:760px){body{padding:12px}.analogy{grid-template-columns:1fr auto 1fr}.analogy>:nth-child(4),.analogy>:nth-child(6){display:none}.analogy>:nth-child(5){grid-column:1}.analogy>:nth-child(7){grid-column:3}.options{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style></head><body><main><section class="summary"><h1>FAN-001 Figure Analogy Visual-Remediation Review</h1><p>${review.questionCount} deterministic questions. Complete rotations and reflections are matrix-validated; answers are hidden inside each question.</p></section>${questions}</main></body></html>\n`;
}
