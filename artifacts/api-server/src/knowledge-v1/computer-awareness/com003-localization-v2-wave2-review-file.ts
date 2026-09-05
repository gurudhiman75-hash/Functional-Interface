import fs from "node:fs";
import path from "node:path";
import {
  COM003_HINDI_LOCALIZATION_V2_WAVE2,
  COM003_LOCALIZATION_V2_WAVE2_AUTHORITY,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE2,
} from "./com003-localization-v2-wave2";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";

const QL_IDS = ["COM-003-QL-005","COM-003-QL-006","COM-003-QL-007","COM-003-QL-008","COM-003-QL-009"];
const ENGLISH = COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter((q) => QL_IDS.includes(q.qlId));
function esc(value: unknown) { return String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
function options(values: readonly string[]) { return `<ol class="options">${values.map((value) => `<li>${esc(value)}</li>`).join("")}</ol>`; }

export function buildCom003LocalizationV2Wave2ReviewFile() {
  const cards = ENGLISH.map((english,index) => {
    const hi=COM003_HINDI_LOCALIZATION_V2_WAVE2[index]!, pa=COM003_PUNJABI_LOCALIZATION_V2_WAVE2[index]!;
    return `<article class="question"><div class="meta"><b>${esc(english.qlId)}</b><span>${esc(english.examSurfaceFamily)}</span><span>${esc(english.surfaceMode)}</span><span>${esc(english.targetFactId)}</span></div><div class="grid">
      <section><h3>English source</h3><p class="stem">${esc(english.stem)}</p>${options(english.options)}<p class="answer"><b>Answer:</b> ${esc(english.canonicalAnswer)}</p><p class="explanation">${esc(english.explanation)}</p></section>
      <section><h3>Hindi</h3><p class="stem">${esc(hi.stem)}</p>${options(hi.options)}<p class="answer"><b>उत्तर:</b> ${esc(hi.canonicalAnswer)}</p><p class="explanation">${esc(hi.explanation)}</p></section>
      <section><h3>Punjabi</h3><p class="stem">${esc(pa.stem)}</p>${options(pa.options)}<p class="answer"><b>ਉੱਤਰ:</b> ${esc(pa.canonicalAnswer)}</p><p class="explanation">${esc(pa.explanation)}</p></section>
    </div></article>`;
  }).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>COM-003 Localization V2 Wave 2 Review</title><style>
  :root{font-family:Inter,Arial,sans-serif;color:#172033;background:#f3f5f7}body{margin:0}.wrap{max-width:1480px;margin:auto;padding:24px 18px 60px}.hero,.question{background:#fff;border:1px solid #dde3ea;border-radius:14px;padding:18px;margin:14px 0}.stats{display:flex;gap:8px;flex-wrap:wrap}.pill{background:#eef2f6;border-radius:999px;padding:8px 11px;font-weight:700}.lock{background:#fff5e8;border-radius:9px;padding:12px;margin-top:12px}.meta{display:flex;gap:8px;flex-wrap:wrap;font-size:12px;color:#526070;margin-bottom:12px}.meta span,.meta b{background:#f1f4f7;border-radius:6px;padding:5px 7px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}section{border:1px solid #e5e9ee;border-radius:10px;padding:14px;min-width:0}h1{margin:0 0 8px}h3{margin:0 0 10px}.stem{font-weight:700;line-height:1.55}.options{line-height:1.55;padding-left:24px}.answer{margin-top:14px}.explanation{line-height:1.55;color:#3e4b5e;border-top:1px solid #edf0f3;padding-top:10px}@media(max-width:950px){.grid{grid-template-columns:1fr}}</style></head><body><main class="wrap"><header class="hero"><h1>COM-003 — Localization V2 Wave 2 Review</h1><p>V16.2 / English Freeze V2 learner-facing localization candidate for QL-005 through QL-009.</p><div class="stats"><span class="pill">60 English questions</span><span class="pill">60 Hindi questions</span><span class="pill">60 Punjabi questions</span><span class="pill">120 localized outputs</span><span class="pill">5 QLs</span></div><div class="lock"><b>Governance:</b> REVIEW ONLY. Localization is not frozen; Question Studio runtime, Question Bank writes, tests, mocks and publication remain unauthorized.</div><p><b>Authority:</b> ${esc(COM003_LOCALIZATION_V2_WAVE2_AUTHORITY.authorityId)}</p></header>${cards}</main></body></html>`;
}
export function writeCom003LocalizationV2Wave2ReviewFile(outputDir=path.resolve("dist/com003-localization-v2-wave2-review")) { fs.mkdirSync(outputDir,{recursive:true}); const file=path.join(outputDir,"COM-003-Localization-V2-Wave2-Review.html"); fs.writeFileSync(file,buildCom003LocalizationV2Wave2ReviewFile(),"utf8"); return file; }
if(process.argv[1]?.includes("com003-localization-v2-wave2-review-file")) console.log("[COM003-LOCALIZATION-V2-WAVE2-REVIEW]",writeCom003LocalizationV2Wave2ReviewFile());