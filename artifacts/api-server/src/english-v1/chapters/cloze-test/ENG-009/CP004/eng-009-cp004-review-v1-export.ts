import{mkdir,writeFile}from"node:fs/promises";
import{dirname,resolve}from"node:path";
import{ENG009_CP004_PASSAGES_V1}from"./eng-009-cp004-authorities-v1";
import{generateEng009Cp004QuestionV1,renderEng009Cp004Passage}from"./eng-009-cp004-v1";
const OUT=resolve(process.cwd(),"dist/english-v1/ENG-009-CP004-FULL-REVIEW-V1.md"),L=["A","B","C","D"];
const lines:string[]=["# ENG-009 CP004 — Banking Mains Cloze — Full Review V1","","Status: `HUMAN_REVIEW_PENDING__REVIEW_ONLY`","","Scope: 10 original passages × 6 blanks = 60 governed authorities.","","---",""];
let n=0;
for(const p of ENG009_CP004_PASSAGES_V1){
 lines.push(`## ${p.id} — ${p.title}`,"",renderEng009Cp004Passage(p.template),"");
 for(const b of p.blanks){
  n++;const q=generateEng009Cp004QuestionV1({seed:`review:${b.id}`,blankId:b.id});
  lines.push(`### Q${String(n).padStart(2,"0")} — Blank ${b.blankNo} — ${b.kind.toUpperCase()} — ${b.difficulty.toUpperCase()}`,"",q.prompt,"",...q.options.map((o,i)=>`${L[i]}. ${o}`),"",`**Answer:** ${L[q.correctOptionIndex]}. ${q.options[q.correctOptionIndex]}`,"",`**Explanation:** ${q.explanation}`,"",`**Context clue:** ${q.metadata.clue}`,"","---","");
 }
}
if(n!==60)throw new Error(`Expected 60 review questions, got ${n}`);
await mkdir(dirname(OUT),{recursive:true});await writeFile(OUT,lines.join("\n")+"\n","utf8");console.log(OUT);