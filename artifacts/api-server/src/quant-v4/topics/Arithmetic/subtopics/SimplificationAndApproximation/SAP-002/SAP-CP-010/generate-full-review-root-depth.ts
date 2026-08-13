import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateSapCp010RootDepthReviewRecords } from "./full-review-root-depth-v2";

const records = generateSapCp010RootDepthReviewRecords();
const outDir = resolve(process.cwd(), "artifacts/api-server/dist/quant-v4/sap-cp010-root-depth-review");
mkdirSync(outDir, { recursive: true });
const summary = { checkpointId:"SAP-CP-010", reviewVersion:"CP010-EXAM-STANDARD-V6-ROOT-DEPTH-LATEX", questionCount:records.length, identities:17, candidateQlRange:"SAP-QL-166..182", answerPositions:[0,1,2,3].map((p)=>records.filter((r)=>r.correctIndex===p).length), lifecycle:"INACTIVE_HUMAN_REVIEW_CANDIDATE" };
const lines:string[]=["# SAP-CP-010 — 300-Question Human Review — V6 Root Depth + LaTeX","",`Questions: **${records.length}**  `,`A/B/C/D: **${summary.answerPositions.join(" / ")}**`,"","> Provisional and inactive. Root states are stratified across their intervals and radicals are explicitly scoped.",""];
for(const r of records){
  lines.push(`## ${r.questionId} — ${r.proposedPermanentQlId}`,"",`**Difficulty:** ${r.difficulty}`,"",r.stem,"");
  r.options.forEach((o,i)=>lines.push(`${String.fromCharCode(65+i)}. ${o.value}`));
  lines.push("",`**Correct:** ${String.fromCharCode(65+r.correctIndex)} — ${r.canonicalAnswer}`,"",`**Idea:** ${r.explanation.coreConcept}`,"","**Working:**");
  r.explanation.steps.forEach((s,i)=>lines.push(`${i+1}. ${s}`));
  lines.push("",`**Final:** ${r.explanation.finalAnswer}`,"");
}
const markdown=lines.join("\n");
function esc(s:string){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function renderMath(s:string):string{
  let x=esc(s).replace(/\\\(\s*/g,"").replace(/\s*\\\)/g,"");
  x=x.replace(/\\sqrt\[(\d+)\]\{(\d+)\}/g,'<span class="root"><sup>$1</sup><span class="radical">√</span><span class="radicand">$2</span></span>');
  x=x.replace(/\\sqrt\{(\d+)\}/g,'<span class="root"><span class="radical">√</span><span class="radicand">$1</span></span>');
  x=x.replace(/\\times/g,"×").replace(/\\div/g,"÷").replace(/\\text\{([^}]*)\}/g,"$1");
  x=x.replace(/(\d+)\^\{(\d+)\}/g,"$1<sup>$2</sup>");
  return x;
}
const htmlLines=lines.map((line)=>`<div>${renderMath(line)}</div>`).join("\n");
const html=`<!doctype html><html><head><meta charset="utf-8"><title>SAP CP010 Root Depth Review</title><style>body{font-family:Arial,sans-serif;max-width:1050px;margin:24px auto;padding:0 20px;line-height:1.55}.root{display:inline-flex;align-items:flex-start;vertical-align:middle}.root sup{font-size:.55em;margin-right:-.1em}.radical{font-size:1.3em;line-height:.9}.radicand{border-top:1.5px solid currentColor;padding:0 .08em;line-height:1.05}</style></head><body>${htmlLines}</body></html>`;
writeFileSync(resolve(outDir,"SAP-CP-010-300-ROOT-DEPTH-REVIEW.md"),markdown,"utf8");
writeFileSync(resolve(outDir,"SAP-CP-010-300-ROOT-DEPTH-REVIEW.html"),html,"utf8");
writeFileSync(resolve(outDir,"SAP-CP-010-300-ROOT-DEPTH-REVIEW.json"),JSON.stringify({summary,records},null,2),"utf8");
writeFileSync(resolve(outDir,"summary.json"),JSON.stringify(summary,null,2),"utf8");
console.log(JSON.stringify(summary));
