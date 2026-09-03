import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { generateFigureFormationReviewQuestionV3 } from "../foundation/spatial/figure-formation-review-runtime-v3";

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
    const generationSeed = `FFM-V3:${qlId}:${seed}`;
    const question = generateFigureFormationReviewQuestionV3({ qlId, seed: generationSeed, language: "en" }) as any;
    const stimulus = question.stimulusSvgs.map((svg: string) => `<div class="stimulus">${svg}</div>`).join("");
    const options = question.optionSvgs.map((svg: string, index: number) => `
      <div class="option ${index === question.correctIndex ? "correct" : ""}">
        <div class="label">${String.fromCharCode(65 + index)}${index === question.correctIndex ? " ✓" : ""}</div>${svg}
      </div>`).join("");
    svgCount += question.stimulusSvgs.length + question.optionSvgs.length;
    cards.push(`<article class="card"><header><strong>${qlId}</strong><span>${escapeHtml(seed)}</span></header><p class="stem">${escapeHtml(question.stem)}</p>${stimulus}<div class="options">${options}</div><details><summary>Reviewer explanation</summary><p>${escapeHtml(question.explanation.observation)} ${escapeHtml(question.explanation.rule)} ${escapeHtml(question.explanation.application)} ${escapeHtml(question.explanation.check)}</p></details></article>`);
    manifest.push({
      qlId,
      seed,
      generationSeed,
      questionId: question.questionId,
      correctIndex: question.correctIndex,
      contentFingerprint: question.contentFingerprint,
      geometryFingerprint: question.geometryFingerprint,
      mode: question.mode,
      pieceCount: question.solveFacts?.placements?.length ?? null,
      targetKind: question.solveFacts?.targetKind ?? "GENERAL_ASSEMBLY",
      reviewAuthorityId: question.review.authorityId,
    });
  }
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>FFM-001 Visual Review V3</title><style>
*{box-sizing:border-box}body{margin:0;background:#f4f5f7;color:#111827;font-family:Arial,sans-serif}main{max-width:1440px;margin:0 auto;padding:24px}h1{margin:0 0 6px;font-size:24px}.sub{margin:0 0 22px;color:#4b5563;line-height:1.45}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(430px,1fr));gap:18px}.card{background:white;border:1px solid #d1d5db;border-radius:10px;padding:16px}header{display:flex;justify-content:space-between;border-bottom:1px solid #e5e7eb;padding-bottom:9px}.stem{font-size:15px;line-height:1.45;min-height:44px}.stimulus{display:flex;justify-content:center;align-items:center;min-height:150px;margin:8px 0 16px}svg{max-width:100%;height:auto}.options{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.option{position:relative;border:1px solid #d1d5db;border-radius:8px;padding:23px 8px 8px;min-height:122px;display:flex;align-items:center;justify-content:center;background:white}.option.correct{outline:2px solid #6b7280}.label{position:absolute;top:6px;left:8px;font-size:12px;font-weight:700}details{margin-top:12px;border-top:1px solid #e5e7eb;padding-top:9px}summary{cursor:pointer;font-size:12px;font-weight:700;color:#4b5563}details p{font-size:12px;line-height:1.45;color:#374151}
</style></head><body><main><h1>FFM-001 Figure Formation — Visual Review V3</h1><p class="sub">18 deterministic English reviewer surfaces · SPA-QL-051..053 · two/three-piece forward formation · square/triangle construction · thin 1.35px exam strokes · answer highlight is reviewer-only · no Question Studio or downstream activation in this candidate.</p><div class="grid">${cards.join("\n")}</div></main></body></html>`;

const outDir = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "spa-ffm-001-visual-review-v3.html"), html, "utf8");
writeFileSync(resolve(outDir, "spa-ffm-001-visual-review-v3.json"), `${JSON.stringify({ cards: manifest, cardCount: manifest.length, svgCount }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ status: "PASS_FFM_001_VISUAL_REVIEW_V3_PACK_GENERATED", cardCount: manifest.length, svgCount }, null, 2));
