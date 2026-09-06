import fs from "node:fs";
import path from "node:path";
import {
  COM003_HINDI_LOCALIZATION_V2_WAVE2_V2,
  COM003_LOCALIZATION_V2_WAVE2_AUTHORITY_V2,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE2_V2,
} from "./com003-localization-v2-wave2-v2";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";

const QLS=["COM-003-QL-005","COM-003-QL-006","COM-003-QL-007","COM-003-QL-008","COM-003-QL-009"];
const EN=COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter(q=>QLS.includes(q.qlId));
const esc=(v:unknown)=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
const opts=(a:readonly string[])=>`<ol>${a.map(v=>`<li>${esc(v)}</li>`).join("")}</ol>`;

export function buildCom003LocalizationV2Wave2Candidate2Review(){
 const cards=EN.map((e,i)=>{
  const h=COM003_HINDI_LOCALIZATION_V2_WAVE2_V2[i]!,p=COM003_PUNJABI_LOCALIZATION_V2_WAVE2_V2[i]!;
  return `<article><div class="meta"><b>${esc(e.qlId)}</b><span>${esc(e.examSurfaceFamily)}</span><span>${esc(e.surfaceMode)}</span><span>${esc(e.targetFactId)}</span></div><div class="grid">
  <section><h3>English</h3><p class="stem">${esc(e.stem)}</p>${opts(e.options)}<p><b>Answer:</b> ${esc(e.canonicalAnswer)}</p><p class="ex">${esc(e.explanation)}</p></section>
  <section><h3>Hindi · Candidate 2</h3><p class="stem">${esc(h.stem)}</p>${opts(h.options)}<p><b>उत्तर:</b> ${esc(h.canonicalAnswer)}</p><p class="ex">${esc(h.explanation)}</p></section>
  <section><h3>Punjabi · Candidate 2</h3><p class="stem">${esc(p.stem)}</p>${opts(p.options)}<p><b>ਉੱਤਰ:</b> ${esc(p.canonicalAnswer)}</p><p class="ex">${esc(p.explanation)}</p></section>
  </div></article>`;
 }).join("");
 return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>COM-003 Localization V2 Wave 2 Candidate 2</title><style>
 body{margin:0;background:#f3f5f7;color:#172033;font-family:Inter,Arial,sans-serif}.wrap{max-width:1480px;margin:auto;padding:22px}.hero,article{background:white;border:1px solid #dfe4ea;border-radius:13px;padding:18px;margin:12px 0}.stats,.meta{display:flex;gap:7px;flex-wrap:wrap}.stats span,.meta span,.meta b{background:#eef2f6;border-radius:7px;padding:6px 8px}.lock{background:#fff4df;padding:11px;border-radius:8px;margin-top:12px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}section{border:1px solid #e5e9ee;border-radius:9px;padding:13px}.stem{font-weight:700;line-height:1.55}.ex{border-top:1px solid #edf0f3;padding-top:9px;line-height:1.55}li{line-height:1.5}@media(max-width:950px){.grid{grid-template-columns:1fr}}</style></head><body><main class="wrap"><header class="hero"><h1>COM-003 — Localization V2 Wave 2 · Candidate 2</h1><p>Human language-polish pass over the green Wave 2 candidate. Semantics, options, answers and provenance remain unchanged.</p><div class="stats"><span>60 English questions</span><span>60 Hindi questions</span><span>60 Punjabi questions</span><span>120 localized outputs</span><span>QL-005..009</span></div><div class="lock"><b>REVIEW ONLY:</b> localization is not frozen. Question Studio runtime, Question Bank, tests, mocks and publication remain locked.</div><p><b>Authority:</b> ${esc(COM003_LOCALIZATION_V2_WAVE2_AUTHORITY_V2.authorityId)}</p></header>${cards}</main></body></html>`;
}
export function writeCom003LocalizationV2Wave2Candidate2Review(outputDir=path.resolve("dist/com003-localization-v2-wave2-v2-review")){fs.mkdirSync(outputDir,{recursive:true});const f=path.join(outputDir,"COM-003-Localization-V2-Wave2-Candidate2-Review.html");fs.writeFileSync(f,buildCom003LocalizationV2Wave2Candidate2Review(),"utf8");return f;}
if(process.argv[1]?.includes("com003-localization-v2-wave2-v2-review-file")) console.log("[COM003-W2-C2-REVIEW]",writeCom003LocalizationV2Wave2Candidate2Review());