import{mkdir,writeFile}from"node:fs/promises";
import{dirname,resolve}from"node:path";
import{eng007Cp001PoolV1}from"./eng-007-cp001-lexicon-v1";
import{generateEng007Cp001QuestionV1,type Eng007Cp001Mode}from"./eng-007-cp001-v1";

const OUT=resolve(process.cwd(),"dist/english-v1/ENG-007-CP001-REVIEW-V1.md"),L=["A","B","C","D"],D=["easy","medium","hard"]as const;
const lines:string[]=["# ENG-007-CP001 — Core High-frequency Spelling — Review V1","","Status: `HUMAN_REVIEW_PENDING__REVIEW_ONLY`","","Bank size: **240 spellings — 80 Easy / 80 Medium / 80 Hard**.","","Review: **60 questions — 20 per difficulty, balanced across both exam directions**.","","---",""];let n=1;
for(const d of D){
  lines.push(`## ${d[0]!.toUpperCase()+d.slice(1)}`,"");
  const pool=eng007Cp001PoolV1(d);
  for(let i=0;i<20;i++){
    const e=pool[Math.floor(i*pool.length/20)]!,m:Eng007Cp001Mode=i%2===0?"correct-spelling":"misspelt-word",seed=`eng007-cp001-review:${d}:${m}:${e.id}`;
    const q=generateEng007Cp001QuestionV1({seed,difficulty:d,mode:m,entryId:e.id});
    lines.push(`### Q${String(n++).padStart(2,"0")}`,"",q.stem,"");
    q.options.forEach((o,j)=>lines.push(`${L[j]}. ${o}`));
    lines.push("",`**Answer:** ${L[q.correctOptionIndex]}. ${q.options[q.correctOptionIndex]}`,"",`**Explanation:** ${q.explanation}`,"",`**Mode:** ${q.metadata.mode}  `,`**Trap:** ${q.metadata.trap}  `,`**Entry:** ${q.metadata.entryId}`,"","---","");
  }
}
lines.push("## Review checklist","","- All four options look like genuine exam choices.","- No accepted British/American variant is falsely marked wrong.","- Misspellings are plausible but unambiguous.","- Easy / Medium / Hard calibration feels realistic.","- Explanations are short and useful.","");
await mkdir(dirname(OUT),{recursive:true});await writeFile(OUT,lines.join("\n")+"\n","utf8");console.log(OUT);
