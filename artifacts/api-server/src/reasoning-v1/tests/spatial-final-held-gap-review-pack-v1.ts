import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  generateSpatialFinalHeldGapReviewQuestionV1,
  type SpatialFinalHeldGapLanguageV1,
  type SpatialFinalHeldGapQlIdV1,
} from "../foundation/spatial/spatial-final-held-gap-review-runtime-v1";

const qls = ["SPA-QL-048", "SPA-QL-049", "SPA-QL-050"] as const satisfies readonly SpatialFinalHeldGapQlIdV1[];
const languages = ["en", "hi", "pa"] as const satisfies readonly SpatialFinalHeldGapLanguageV1[];
const rows = qls.flatMap((qlId) => languages.flatMap((language) =>
  Array.from({ length: 4 }, (_, index) => generateSpatialFinalHeldGapReviewQuestionV1({
    qlId,
    language,
    seed: `spa-final-held-gap-review:${qlId}:${index}`,
  })),
));

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderOptions(question: (typeof rows)[number]): string {
  if (question.version === "SPA-FINAL-HELD-GAP-NUMERIC-QUESTION-V1") {
    return `<div class="numeric-options">${question.options.map((value, index) => `<div class="num-option ${index === question.correctIndex ? "correct" : ""}"><b>${String.fromCharCode(65 + index)}.</b> ${value}</div>`).join("")}</div>`;
  }
  return `<div class="image-options">${question.optionSvgs.map((svg, index) => `<div class="img-option ${index === question.correctIndex ? "correct" : ""}"><div class="label">${String.fromCharCode(65 + index)}</div>${svg}</div>`).join("")}</div>`;
}

const cards = rows.map((question) => `
<section class="card">
  <div class="meta"><strong>${question.qlId}</strong> · ${question.language.toUpperCase()} · ${question.difficultyBand} · answer ${String.fromCharCode(65 + question.correctIndex)}</div>
  <div class="stem">${escapeHtml(question.stem)}</div>
  <div class="stimulus">${question.stimulusSvgs[0]}</div>
  ${renderOptions(question)}
  <div class="solution"><b>Rule</b><div>${escapeHtml(question.explanation.rule)}</div><b>Working</b>${question.explanation.working.map((line) => `<div>${escapeHtml(line)}</div>`).join("")}<b>Answer</b><div>${escapeHtml(question.explanation.answerLine)}</div></div>
  <div class="facts">${escapeHtml(JSON.stringify(question.solveFacts))}</div>
</section>`).join("\n");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Examtree Spatial Final Held-Gap Review V1</title>
<style>
body{font-family:Arial,Helvetica,sans-serif;background:#f4f4f5;color:#111827;margin:0;padding:24px}.wrap{max-width:1180px;margin:auto}.intro,.card{background:#fff;border:1px solid #d4d4d8;border-radius:10px}.intro{padding:20px;margin-bottom:20px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:18px}.card{padding:16px;overflow:hidden}.meta{font-size:12px;color:#52525b;margin-bottom:10px}.stem{font-size:16px;font-weight:600;line-height:1.45}.stimulus{display:flex;justify-content:center;align-items:center;min-height:190px;margin:10px 0}.stimulus svg{max-width:260px;width:100%;height:auto}.numeric-options{display:grid;grid-template-columns:1fr 1fr;gap:8px}.num-option,.img-option{border:1px solid #d4d4d8;border-radius:8px;padding:9px;background:white}.correct{border:2px solid #111827}.image-options{display:grid;grid-template-columns:1fr 1fr;gap:8px}.img-option svg{width:100%;height:auto;max-height:170px}.label{font-weight:700;margin-bottom:4px}.solution{font-size:13px;line-height:1.45;border-top:1px solid #e4e4e7;margin-top:12px;padding-top:10px}.solution b{display:block;margin-top:6px}.facts{font-size:10px;color:#71717a;margin-top:10px;overflow-wrap:anywhere}@media(max-width:520px){body{padding:10px}.grid{grid-template-columns:1fr}.image-options{grid-template-columns:1fr 1fr}.stimulus svg{max-width:240px}}
</style></head><body><div class="wrap"><div class="intro"><h1>Spatial final held-gap review — V1</h1><p>36 deterministic review surfaces: SPA-QL-048 straight-line counting, SPA-QL-049 circle/semicircle counting, SPA-QL-050 embedded figure with rotation allowed; EN/HI/PA. White background, 1.35px exam strokes. Review-only: no persistence, Question Bank, Test Builder, mock or learner release.</p></div><div class="grid">${cards}</div></div></body></html>`;

const outDir = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "spa-final-held-gap-review-v1.html"), html);
writeFileSync(resolve(outDir, "spa-final-held-gap-review-v1.json"), JSON.stringify(rows, null, 2));
console.log(JSON.stringify({ status: "PASS_SPA_FINAL_HELD_GAP_REVIEW_PACK_V1", rows: rows.length, qls, languages }));
