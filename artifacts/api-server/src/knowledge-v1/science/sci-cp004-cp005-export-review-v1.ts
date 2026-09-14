import fs from "node:fs";
import path from "node:path";
import { SCI_CP004_REVIEW_BATCH_V1, SCI_CP004_QL_NAMES_V1, auditSciCp004ReviewBatchV1 } from "./gravitation-pressure/sci-cp004-review-v1";
import { SCI_CP005_REVIEW_BATCH_V1, SCI_CP005_QL_NAMES_V1, auditSciCp005ReviewBatchV1 } from "./heat-temperature/sci-cp005-review-v1";

const a4=auditSciCp004ReviewBatchV1();
const a5=auditSciCp005ReviewBatchV1();
if(!a4.valid||!a5.valid)throw new Error(`SCI export blocked: ${[...a4.issues,...a5.issues].join(" | ")}`);
const outDir=path.resolve(process.cwd(),"dist/science-review/SCI-CP004-CP005-V1");
fs.mkdirSync(outDir,{recursive:true});
const letters=["A","B","C","D"];
function section(title:string,cpId:string,qlNames:Record<number,string>,questions:readonly any[]){const lines:string[]=[`# ${cpId} — ${title}`,"","Status: **REVIEW-ONLY CANDIDATE V1**",""];let last="";for(const q of questions){if(q.qlId!==last){last=q.qlId;const n=Number(q.qlId.slice(-3));lines.push(`## ${q.qlId} — ${qlNames[n]}`,"");}lines.push(`### ${q.questionId} · ${q.difficulty}`,"",q.stem,"");q.options.forEach((o:string,i:number)=>lines.push(`${letters[i]}. ${o}`));lines.push("",`**Answer:** ${letters[q.correctIndex]}. ${q.canonicalAnswer}`,"",`**Explanation:** ${q.explanation}`,"");}return lines.join("\n");}
const md=["# General Science — SCI-CP-004 + SCI-CP-005 — Review Batch V1","","- Total questions: **120**","- Each CP: **60 questions**","- Each CP: **Easy 18 / Medium 30 / Hard 12**","- Each CP: **A15 / B15 / C15 / D15**","- Review-only; no runtime promotion.","","---","",section("Gravitation, Pressure & Fluids","SCI-CP-004",SCI_CP004_QL_NAMES_V1,SCI_CP004_REVIEW_BATCH_V1),"","---","",section("Heat & Temperature","SCI-CP-005",SCI_CP005_QL_NAMES_V1,SCI_CP005_REVIEW_BATCH_V1)].join("\n");
fs.writeFileSync(path.join(outDir,"SCI-CP004-CP005-REVIEW-V1.md"),md);
fs.writeFileSync(path.join(outDir,"SCI-CP004-CP005-REVIEW-V1.json"),JSON.stringify({cp004:SCI_CP004_REVIEW_BATCH_V1,cp005:SCI_CP005_REVIEW_BATCH_V1},null,2));
console.log(outDir);
