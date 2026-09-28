import{mkdir,writeFile}from"node:fs/promises";
import{dirname,resolve}from"node:path";
import{ENG009_CP001_PASSAGES_V1}from"./eng-009-cp001-authorities-v1";
import{generateEng009Cp001QuestionV1,renderEng009Cp001Passage}from"./eng-009-cp001-v1";
const OUT=resolve(process.cwd(),"dist/english-v1/ENG-009-CP001-REVIEW-V1.md"),L=["A","B","C","D"];
const lines:string[]=["# ENG-009 CP001 — SSC Standard Cloze — Review V1","","Status: `HUMAN_REVIEW_PENDING__REVIEW_ONLY`","","Scope: 10 original passages × 5 blanks = 50 governed authorities.","","---",""];
let n=0;
for(const p of ENG009_CP001_PASSAGES_V1){
 lines.push(`## ${p.id} — ${p.title}`,"",renderEng009Cp001Passage(p.template),"");
 for(const b of p.blanks){
  n++;const q=generateEng009Cp001QuestionV1({seed:`review:${b.id}`,blankId:b.id});
  lines.push(`### Q${String(n).padStart(2,"0")} — Blank ${b.blankNo} — ${b.kind.toUpperCase()} — ${b.difficulty.toUpperCase()}`,"",q.prompt,"",...q.options.map((o,i)=>`${L[i]}. ${o}`),"",`**Answer:** ${L[q.correctOptionIndex]}. ${q.options[q.correctOptionIndex]}`,"",`**Explanation:** ${q.explanation}`,"",`**Context clue:** ${q.metadata.clue}`,"","---","");
 }
}
if(n!==50)throw new Error(`Expected 50 review questions, got ${n}`);
lines.push("## Review checklist","","- Passage reads naturally as one coherent SSC-style cloze set.","- Blanks are not five unrelated standalone filler questions.","- Exactly one option is clearly best in context.","- Distractors remain plausible and grammatically credible.","- Grammar, vocabulary, collocation and contextual fit are all represented.","- Explanations are simple and point to the relevant clue.","");
await mkdir(dirname(OUT),{recursive:true});await writeFile(OUT,lines.join("\n")+"\n","utf8");console.log(OUT);