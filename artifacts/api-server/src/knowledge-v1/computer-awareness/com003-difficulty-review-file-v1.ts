import fs from "node:fs";
import path from "node:path";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";
import {
  COM003_DIFFICULTY_AUTHORITY_VERSION_V1,
  COM003_HARD_DIFFICULTY_STATUS_V1,
  classifyCom003DifficultyV1,
} from "./com003-difficulty-authority-v1";

const esc=(v:unknown)=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");

export function buildCom003DifficultyReviewHtmlV1(){
 const decisions=COM003_ENGLISH_REVIEW_CORPUS_V16_2.map(q=>({q,d:classifyCom003DifficultyV1(q)}));
 const easy=decisions.filter(x=>x.d.difficulty==="Easy").length;
 const medium=decisions.filter(x=>x.d.difficulty==="Medium").length;
 const hard=decisions.filter(x=>x.d.difficulty==="Hard").length;
 const sections=COM003_PERMANENT_QLS.map(ql=>{
  const rows=decisions.filter(x=>x.q.qlId===ql.qlId);
  const e=rows.filter(x=>x.d.difficulty==="Easy").length;
  const m=rows.filter(x=>x.d.difficulty==="Medium").length;
  return `<section><div class="qh"><div><div class="id">${esc(ql.qlId)}</div><h2>${esc(ql.title)}</h2></div><b>Easy ${e} · Medium ${m} · Hard 0</b></div>${rows.map((x,i)=>`<article><div class="meta"><span>Q${i+1}</span><span class="diff ${x.d.difficulty.toLowerCase()}">${esc(x.d.difficulty)}</span><span>${esc(x.q.examSurfaceFamily)}</span><span>${esc(x.q.surfaceMode)}</span></div><div class="stem">${esc(x.q.stem)}</div><div class="why"><b>${esc(x.d.topology)}</b> — ${esc(x.d.rationale)}</div></article>`).join("")}</section>`;
 }).join("");
 return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>COM-003 Difficulty Authority V1 Review</title><style>:root{font-family:Inter,Arial,sans-serif;color:#172033;background:#f4f6f8}body{margin:0}.wrap{max-width:1000px;margin:auto;padding:24px 18px 60px}.hero,article{background:#fff;border:1px solid #dfe4ea;border-radius:13px}.hero{padding:22px}.hero h1{margin:0 0 6px}.stats{display:flex;gap:9px;flex-wrap:wrap;margin-top:14px}.stat{background:#eef3f8;border-radius:9px;padding:8px 11px;font-weight:800}.warn{margin-top:13px;padding:11px;background:#fff1f2;border-radius:8px}.rule{margin-top:10px;padding:11px;background:#eef6ff;border-radius:8px}.qh{display:flex;justify-content:space-between;align-items:end;gap:12px;margin:28px 0 10px}.qh h2{margin:2px 0}.id{font-size:12px;font-weight:800;color:#617187}article{padding:15px;margin:9px 0;break-inside:avoid}.meta{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}.meta span{font-size:11px;padding:4px 7px;border-radius:999px;background:#f0f3f6}.diff{font-weight:900}.easy{background:#edf8ef!important}.medium{background:#fff5df!important}.hard{background:#fff0f0!important}.stem{font-size:15px;font-weight:750;line-height:1.45}.why{margin-top:8px;padding:9px 10px;border-radius:6px;background:#f7f8fa;line-height:1.4}@media print{body{background:#fff}.wrap{max-width:none;padding:0}}</style></head><body><main class="wrap"><header class="hero"><h1>COM-003 — Difficulty Authority Review</h1><p>${esc(COM003_DIFFICULTY_AUTHORITY_VERSION_V1)} · V16.2 frozen learner surface</p><div class="stats"><div class="stat">228 questions</div><div class="stat">Easy ${easy}</div><div class="stat">Medium ${medium}</div><div class="stat">Hard ${hard}</div><div class="stat">REVIEW_ONLY</div></div><div class="warn"><b>Hard routing:</b> not authorized. ${esc(COM003_HARD_DIFFICULTY_STATUS_V1.reason)}</div><div class="rule"><b>Review rule:</b> difficulty is assigned from cognitive topology, not from a quota. Direct recall / simple single-fact application is Easy; example recognition, contrast, notation/layout interpretation, relative/absolute references, version-scoped Excel shortcuts and close PowerPoint timing/scope distinctions are Medium.</div></header>${sections}</main></body></html>`;
}

export function writeCom003DifficultyReviewFileV1(outputDir=path.resolve("dist/com003-difficulty-review")){
 fs.mkdirSync(outputDir,{recursive:true});
 const p=path.join(outputDir,"COM-003-Office-Productivity-Difficulty-Authority-V1.html");
 fs.writeFileSync(p,buildCom003DifficultyReviewHtmlV1(),"utf8");
 return p;
}

if(process.argv[1]?.includes("com003-difficulty-review-file-v1")){
 const p=writeCom003DifficultyReviewFileV1();
 console.log(`[COM003-DIFFICULTY-REVIEW-V1] ${p}`);
}
