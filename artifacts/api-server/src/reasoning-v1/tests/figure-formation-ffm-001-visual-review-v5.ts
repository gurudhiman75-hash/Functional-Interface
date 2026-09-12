import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { generateFigureFormationReviewQuestionV5 } from "../foundation/spatial/figure-formation-review-runtime-v5";

const qlIds = ["SPA-QL-051", "SPA-QL-052", "SPA-QL-053"] as const;
const seeds = ["visual-A", "visual-B", "visual-C", "visual-D", "visual-E", "visual-F"] as const;

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

const cards: string[] = [];
const manifest: unknown[] = [];
let svgCount = 0;
for (const qlId of qlIds) {
  for (const seed of seeds) {
    const generationSeed = `FFM-V5:${qlId}:${seed}`;
    const question = generateFigureFormationReviewQuestionV5({ qlId, seed: generationSeed, language: "en" }) as any;
    const stimulus = question.stimulusSvgs.map((svg: string) => `<div class="stimulus">${svg}</div>`).join("");
    const options = question.optionSvgs.map((svg: string, index: number) => `
      <div class="option ${index === question.correctIndex ? "correct" : ""}">
        <div class="label">${String.fromCharCode(65 + index)}${index === question.correctIndex ? " ✓" : ""}</div>${svg}
      </div>`).join("");
    const steps = (question.explanation.steps ?? [question.explanation.observation, question.explanation.rule, question.explanation.application, question.explanation.check])
      .map((step: string) => `<li>${escapeHtml(step)}</li>`).join("");
    svgCount += question.stimulusSvgs.length + question.optionSvgs.length + 1;
    cards.push(`<article class="card">
      <header><strong>${qlId}</strong><span>${escapeHtml(seed)}</span></header>
      <p class="stem">${escapeHtml(question.stem)}</p>
      ${stimulus}
      <div class="options">${options}</div>
      <section class="explanation">
        <h3>How the pieces actually connect</h3>
        <div class="solution-visual">${question.explanationIllustrationSvg}</div>
        <ol>${steps}</ol>
        <p class="answer-check"><strong>Why ${question.answer}:</strong> ${escapeHtml(question.explanation.check)}</p>
      </section>
    </article>`);
    manifest.push({
      qlId,
      seed,
      generationSeed,
      questionId: question.questionId,
      correctIndex: question.correctIndex,
      answer: question.answer,
      contentFingerprint: question.contentFingerprint,
      geometryFingerprint: question.geometryFingerprint,
      assemblyPathIllustration: question.renderer.reviewAssemblyPathIllustration,
      assemblySeamVisible: question.renderer.reviewAssemblySeamVisible,
      learnerContentFrozen: question.review.learnerContentFrozen,
    });
  }
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>FFM-001 Visual Review V5</title><style>
*{box-sizing:border-box}body{margin:0;background:#f3f4f6;color:#111827;font-family:Arial,sans-serif}main{max-width:1540px;margin:0 auto;padding:22px}.hero{background:white;border:1px solid #d1d5db;border-radius:10px;padding:16px 18px;margin-bottom:20px}.hero h1{margin:0 0 8px;font-size:24px}.hero p{margin:5px 0;color:#4b5563;line-height:1.5}.warning{font-weight:700;color:#111827}.grid{display:grid;grid-template-columns:1fr;gap:20px}.card{background:white;border:1px solid #cbd5e1;border-radius:10px;padding:17px;overflow:hidden}header{display:flex;justify-content:space-between;border-bottom:1px solid #e5e7eb;padding-bottom:9px}.stem{font-size:15px;line-height:1.5}.stimulus{display:flex;justify-content:center;align-items:center;min-height:150px;margin:8px 0 16px;overflow:auto;padding:4px}svg{height:auto;max-width:100%}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.option{position:relative;border:1px solid #cbd5e1;border-radius:8px;padding:25px 8px 10px;min-height:145px;display:flex;align-items:center;justify-content:center;background:white;overflow:auto}.option.correct{outline:2px solid #6b7280}.label{position:absolute;top:6px;left:8px;font-size:12px;font-weight:700}.explanation{margin-top:16px;border-top:1px solid #d1d5db;padding-top:14px}.explanation h3{font-size:15px;margin:0 0 9px}.solution-visual{display:flex;justify-content:center;overflow:auto;background:#fff;border:1px solid #e5e7eb;border-radius:7px;padding:8px}.solution-visual svg{min-width:850px}.explanation ol{margin:12px 0 8px;padding-left:22px}.explanation li{font-size:13px;line-height:1.5;margin:5px 0}.answer-check{font-size:13px;line-height:1.5;margin:8px 0 0;background:#f9fafb;border-left:3px solid #9ca3af;padding:8px 10px}@media(max-width:900px){main{padding:12px}.options{grid-template-columns:repeat(2,minmax(0,1fr))}.card{padding:13px}}@media(max-width:600px){.options{grid-template-columns:1fr}}
</style></head><body><main><section class="hero"><h1>FFM-001 Figure Formation — Visual Review V5</h1><p class="warning">V4 rejected: its illustration identified the correct pieces but did not show how those pieces actually connect.</p><p>V5 shows three stages for every solution: the pieces as presented, the required turned orientations, and the exact final placement. The dashed internal line is the joining seam. All geometry remains review-only; downstream learner delivery stays locked pending approval.</p></section><div class="grid">${cards.join("\n")}</div></main></body></html>`;

const outDir = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "spa-ffm-001-visual-review-v5.html"), html, "utf8");
writeFileSync(resolve(outDir, "spa-ffm-001-visual-review-v5.json"), `${JSON.stringify({ cards: manifest, cardCount: manifest.length, svgCount }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ status: "PASS_FFM_001_VISUAL_REVIEW_V5_PACK_GENERATED", cardCount: manifest.length, svgCount }, null, 2));
