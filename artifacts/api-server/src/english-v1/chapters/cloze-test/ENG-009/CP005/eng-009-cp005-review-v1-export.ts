import{mkdir,writeFile}from"node:fs/promises";
import{dirname,resolve}from"node:path";
import{ENG009_CP005_PASSAGES_V1}from"./eng-009-cp005-authorities-v1";
import{generateEng009Cp005QuestionV1,renderEng009Cp005Passage}from"./eng-009-cp005-v1";
const OUT=resolve(process.cwd(),"dist/english-v1/ENG-009-CP005-FULL-REVIEW-V2.md"),L=["A","B","C","D"];
const lines:string[]=["# ENG-009 CP005 — Mixed / New-pattern Cloze — Full Review V2","","Status: `HUMAN_REVIEW_REQUIRED__CAN_FIT_SINGLE_ANSWER_REMEDIATION__REVIEW_ONLY`","","Scope: 18 original passages × 6 blanks = 108 governed authorities.","","Review focus: can-fit questions now use one all-valid word group versus three groups containing the governed rejected word; cannot-fit and phrasal-word authorities remain unchanged.","","---",""];
let n=0;
for(const p of ENG009_CP005_PASSAGES_V1){
 lines.push(`## ${p.id} — ${p.title}`,"",renderEng009Cp005Passage(p.template),"");
 for(const b of p.blanks){
  n++;const q=generateEng009Cp005QuestionV1({seed:`review:${b.id}`,blankId:b.id});
  lines.push(`### Q${String(n).padStart(2,"0")} — Blank ${b.blankNo} — ${b.mode.toUpperCase()} — ${b.difficulty.toUpperCase()}`,"",q.prompt,"",...q.options.map((o,i)=>`${L[i]}. ${o}`),"",`**Answer:** ${L[q.correctOptionIndex]}. ${q.options[q.correctOptionIndex]}`,"",`**Explanation:** ${q.explanation}`,"",`**Context clue:** ${q.metadata.clue}`,"","---","");
 }
}
if(n!==108)throw new Error(`Expected 108 review questions, got ${n}`);
await mkdir(dirname(OUT),{recursive:true});await writeFile(OUT,lines.join("\n")+"\n","utf8");console.log(OUT);