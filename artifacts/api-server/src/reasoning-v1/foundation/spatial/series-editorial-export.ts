import { buildSpatialSeriesProofCorpus } from "./proofs/spa-fnd-001-fsr-001-corpus";
import { renderSpatialSceneToSvg } from "./svg-renderer";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function buildSpatialSeriesEditorialReviewExport() {
  const questions = buildSpatialSeriesProofCorpus();
  return {
    schemaVersion: "1.0",
    familyCode: "SPA-001",
    chapterCode: "FSR-001",
    questionCount: questions.length,
    answerSequence: questions.map((question) =>
      String.fromCharCode(65 + question.correctOptionIndex),
    ),
    ruleIds: questions.map((question) => question.ruleId),
    questions: questions.map((question) => ({
      prototypeId: question.prototypeId,
      ruleId: question.ruleId,
      presentationProfile: question.presentationProfile,
      correctOptionIndex: question.correctOptionIndex,
      sequenceSvgs: question.seriesScenes.map((scene) =>
        renderSpatialSceneToSvg(scene, {
          ariaLabel: `${question.prototypeId} series frame`,
        }),
      ),
      options: question.options.map((option, index) => ({
        label: String.fromCharCode(65 + index),
        appliedRuleId: option.appliedRuleId,
        isCorrect: index === question.correctOptionIndex,
        svg: renderSpatialSceneToSvg(option.scene, {
          ariaLabel: `${question.prototypeId} option ${index + 1}`,
        }),
      })),
      solverEvidence: question.solverEvidence,
      learnerExplanation: question.learnerExplanation,
      lifecycle: question.lifecycle,
    })),
  };
}

export function buildSpatialSeriesEditorialReviewHtml(
  review: ReturnType<typeof buildSpatialSeriesEditorialReviewExport>,
): string {
  const cards = review.questions
    .map(
      (question, questionIndex) => `
    <article class="question">
      <h2>Q${questionIndex + 1} · ${escapeHtml(question.ruleId)}</h2>
      <div class="sequence">
        ${question.sequenceSvgs
          .map(
            (svg, index) =>
              `<div class="frame"><span>${index + 1}</span>${svg}</div>`,
          )
          .join('<div class="arrow">→</div>')}
        <div class="arrow">→</div><div class="missing">?</div>
      </div>
      <div class="options">
        ${question.options
          .map(
            (option) => `
          <div class="option ${option.isCorrect ? "correct" : ""}">
            <strong>${option.label}</strong>${option.svg}
          </div>`,
          )
          .join("")}
      </div>
      <div class="explanation">
        <p><strong>Observation:</strong> ${escapeHtml(question.learnerExplanation.observation)}</p>
        <p><strong>Rule:</strong> ${escapeHtml(question.learnerExplanation.rule)}</p>
        <p><strong>Apply:</strong> ${escapeHtml(question.learnerExplanation.application)}</p>
        <p><strong>Check:</strong> ${escapeHtml(question.learnerExplanation.check)}</p>
      </div>
    </article>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FSR-001 Figure Series Editorial Review</title>
<style>
body{font-family:Arial,sans-serif;margin:24px;color:#111;background:#fff}header,.question{max-width:1180px;margin:0 auto 24px}.summary{padding:12px;border:1px solid #bbb;border-radius:8px}.question{border:1px solid #ccc;border-radius:10px;padding:16px}.sequence,.options{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.frame,.option,.missing{border:1px solid #ccc;border-radius:8px;padding:6px;background:#fff}.frame svg,.option svg{width:120px;height:120px}.frame span{font-size:11px;color:#555}.arrow{font-size:22px}.missing{width:110px;height:110px;display:flex;align-items:center;justify-content:center;font-size:34px}.options{margin-top:14px}.option{display:grid;grid-template-columns:20px 1fr;align-items:center}.option.correct{outline:2px solid #111}.explanation{font-size:13px;line-height:1.35;margin-top:12px}.explanation p{margin:5px 0}@media(max-width:520px){body{margin:10px}.question{padding:10px}.frame svg,.option svg{width:75px;height:75px}.missing{width:65px;height:65px}.arrow{font-size:16px}.sequence,.options{gap:5px}.option{grid-template-columns:16px 1fr}}
</style></head><body>
<header><h1>FSR-001 Figure Series Proof</h1><div class="summary"><strong>Questions:</strong> ${review.questionCount} · <strong>Answer sequence:</strong> ${review.answerSequence.join(" ")}<br><strong>Rules:</strong> ${review.ruleIds.map(escapeHtml).join(", ")}</div></header>
<main>${cards}</main></body></html>`;
}
