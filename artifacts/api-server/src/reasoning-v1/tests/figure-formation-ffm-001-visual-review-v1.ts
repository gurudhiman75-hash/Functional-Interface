import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { generateFigureFormationQuestionStudioV2 } from "../foundation/spatial/figure-formation-question-studio-v2";

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
    const question = generateFigureFormationQuestionStudioV2({ qlId, seed: `FFM-VISUAL:${qlId}:${seed}`, language: "en" }) as any;
    const stimulus = (question.stimulusSvgs ?? []).map((svg: string) => `<div class="stimulus">${svg}</div>`).join("");
    const options = (question.optionSvgs ?? []).map((svg: string, index: number) => `
      <div class="option ${index === question.correctIndex ? "correct" : ""}">
        <div class="label">${String.fromCharCode(65 + index)}${index === question.correctIndex ? " ✓" : ""}</div>${svg}
      </div>`).join("");
    svgCount += (question.stimulusSvgs?.length ?? 0) + (question.optionSvgs?.length ?? 0);
    cards.push(`<article class="card"><header><strong>${qlId}</strong><span>${escapeHtml(seed)}</span></header><p>${escapeHtml(question.stem)}</p>${stimulus}<div class="options">${options}</div></article>`);
    manifest.push({ qlId, seed, questionId: question.questionId, correctIndex: question.correctIndex, contentFingerprint: question.contentFingerprint, mode: question.mode, targetKind: question.solveFacts?.targetKind ?? "GENERAL_ASSEMBLY" });
  }
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>FFM-001 Visual Review V1</title><style>
*{box-sizing:border-box}body{margin:0;background:#f5f6f8;color:#111827;font-family:Arial,sans-serif}main{max-width:1440px;margin:0 auto;padding:24px}h1{margin:0 0 6px;font-size:24px}.sub{margin:0 0 24px;color:#4b5563}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(430px,1fr));gap:18px}.card{background:white;border:1px solid #d1d5db;border-radius:10px;padding:16px;box-shadow:0 1px 2px rgba(0,0,0,.04)}header{display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #e5e7eb;padding-bottom:10px;margin-bottom:12px}p{font-size:15px;line-height:1.45;margin:8px 0 12px}.stimulus{display:flex;justify-content:center;min-height:150px;align-items:center;margin:8px 0 16px}svg{max-width:100%;height:auto}.options{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.option{position:relative;border:1px solid #d1d5db;border-radius:8px;padding:22px 8px 8px;min-height:118px;display:flex;align-items:center;justify-content:center;background:#fff}.option.correct{outline:2px solid #6b7280}.label{position:absolute;top:6px;left:8px;font-size:12px;font-weight:700}
</style></head><body><main><h1>FFM-001 Figure Formation — Visual Review V1</h1><p class="sub">18 deterministic English surfaces · square/triangle target construction included · answer highlighted for reviewer only</p><div class="grid">${cards.join("\n")}</div></main></body></html>`;
const outDir = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "spa-ffm-001-visual-review-v1.html"), html, "utf8");
writeFileSync(resolve(outDir, "spa-ffm-001-visual-review-v1.json"), `${JSON.stringify({ cards: manifest, cardCount: manifest.length, svgCount }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ status: "PASS_FFM_001_VISUAL_PACK_GENERATED", cardCount: manifest.length, svgCount }, null, 2));
