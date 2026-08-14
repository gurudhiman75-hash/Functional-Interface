import "./spatial-proposed-ql-human-review-pack-v1.test";
import { readFileSync, writeFileSync } from "node:fs";

function esc(value:string):string{return value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");}
const jsonPath="dist/reasoning-v1/spatial/spa-proposed-ql-human-review-pack-v1.json";
const htmlPath="dist/reasoning-v1/spatial/spa-proposed-ql-human-review-pack-v1.html";
const review:any=JSON.parse(readFileSync(jsonPath,"utf8"));
function learnerText(value:string):string{
  return value
    .replace(/\bOption 1\b/g,"Option A")
    .replace(/\bOption 2\b/g,"Option B")
    .replace(/\bOption 3\b/g,"Option C")
    .replace(/\bOption 4\b/g,"Option D")
    .replace(/The broad visible-feature audit found no 3-to-1 feature pointing to a different option\.?/g,"The other three figures all satisfy the stated rule, so there is no second natural odd-one-out.");
}
for(const pql of review.pqls){
  for(const q of pql.questions){
    for(const key of ["observation","rule","application","check"]){q.learnerExplanation[key]=learnerText(q.learnerExplanation[key]);}
  }
}
function strip(svgs:string[],prefix:string){return `<div class="strip">${svgs.map((svg,i)=>`<div class="figure"><div class="cap">${prefix} ${i+1}</div>${svg}</div>`).join("")}</div>`;}
const sections=review.pqls.map((pql:any)=>`<section class="pql"><h2>${esc(pql.proposalId)} — ${esc(pql.name)}</h2><div class="qlmeta">${esc(pql.chapterCode)} · 4 final learner-review questions</div>${pql.questions.map((q:any,i:number)=>`<article class="card"><h3>${i+1}. ${esc(q.sampleMode)}</h3><p><strong>Stem:</strong> ${esc(q.stemText)}</p>${q.stimulusSvgs.length?`<h4>Stimulus</h4>${strip(q.stimulusSvgs,"Figure")}`:""}<h4>Options</h4>${strip(q.optionSvgs,"Option")}<p class="answer"><strong>Answer:</strong> ${esc(q.correctOption)}</p><div class="ex"><p><strong>Observe:</strong> ${esc(q.learnerExplanation.observation)}</p><p><strong>Rule:</strong> ${esc(q.learnerExplanation.rule)}</p><p><strong>Apply:</strong> ${esc(q.learnerExplanation.application)}</p><p><strong>Check:</strong> ${esc(q.learnerExplanation.check)}</p></div></article>`).join("")}</section>`).join("");
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ExamTree Spatial Final 30-PQL Human Review</title><style>body{font-family:Arial,sans-serif;background:#f3f4f6;color:#171717;margin:0}main{max-width:1220px;margin:auto;padding:24px}.summary,.pql{background:#fff;border:1px solid #ddd;border-radius:12px;padding:18px;margin-bottom:22px}.summary .pending{font-weight:700}.qlmeta{color:#666;font-size:13px;margin-bottom:12px}.card{border-top:1px solid #e5e7eb;padding:16px 0}.strip{display:flex;flex-wrap:wrap;gap:12px}.figure{width:128px;border:1px solid #ddd;border-radius:8px;padding:6px;text-align:center;background:#fff}.figure svg{width:100%;height:auto;display:block}.cap{font-size:11px;color:#666}.ex{background:#fafafa;border-left:3px solid #aaa;padding:8px 12px}.ex p{margin:6px 0}.answer{font-size:14px}@media(max-width:520px){main{padding:9px}.summary,.pql{padding:11px}.figure{width:104px}.ex{font-size:13px}}</style></head><body><main><div class="summary"><h1>ExamTree Spatial — Final 30-PQL Human Review V1</h1><p><strong>30 active proposed QLs · 120 questions · 4 per QL.</strong></p><p>Machine coverage and scale are complete. FCL geometric form/closure uses ordinary exam definitions; MIR/WAT strings have a separate balanced Latin/digit scale proof. Held WAT-clock and FCL identity-set patterns are excluded.</p><p class="pending">Human English/mobile approval is still pending. Permanent QLs remain 0.</p></div>${sections}</main></body></html>`;
writeFileSync(jsonPath,JSON.stringify(review,null,2));
writeFileSync(htmlPath,html);
const serialized=JSON.stringify(review);
if(/\bOption [1-4]\b/.test(serialized)) throw new Error("Numeric option language remains in final human review.");
if(/broad visible-feature audit/i.test(serialized)) throw new Error("Reviewer-language leaked into final learner explanations.");
console.log(JSON.stringify({status:"PASS_SPA_FND_001_PROPOSED_QL_HUMAN_REVIEW_EDITORIAL_CLEANUP_V1",numericOptionLanguageRemoved:true,reviewerJargonRemoved:true},null,2));
