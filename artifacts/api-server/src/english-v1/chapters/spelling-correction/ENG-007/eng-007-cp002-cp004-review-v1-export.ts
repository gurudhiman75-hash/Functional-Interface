import{mkdir,writeFile}from"node:fs/promises";
import{dirname,resolve}from"node:path";
import{ENG007_CP002_ENTRIES_V1}from"./CP002/eng-007-cp002-lexicon-v1";
import{generateEng007CP002QuestionV1}from"./CP002/eng-007-cp002-v1";
import{ENG007_CP003_ENTRIES_V1}from"./CP003/eng-007-cp003-lexicon-v1";
import{generateEng007CP003QuestionV1}from"./CP003/eng-007-cp003-v1";
import{ENG007_CP004_ENTRIES_V1}from"./CP004/eng-007-cp004-lexicon-v1";
import{generateEng007CP004QuestionV1}from"./CP004/eng-007-cp004-v1";

const OUT=resolve(process.cwd(),"dist/english-v1/ENG-007-CP002-CP004-REVIEW-V1.md");
const LABELS=["A","B","C","D"],DIFFICULTIES=["easy","medium","hard"]as const;
const cps=[
 {id:"CP002",title:"Structural Spelling Traps",entries:ENG007_CP002_ENTRIES_V1,generate:generateEng007CP002QuestionV1},
 {id:"CP003",title:"Academic, Administrative & Legal Spelling",entries:ENG007_CP003_ENTRIES_V1,generate:generateEng007CP003QuestionV1},
 {id:"CP004",title:"Scientific, Medical & Technical Spelling",entries:ENG007_CP004_ENTRIES_V1,generate:generateEng007CP004QuestionV1},
]as const;
const lines:string[]=[
 "# ENG-007 CP002-CP004 — Spelling Correction — Combined Review V1","",
 "Status: `HUMAN_REVIEW_PENDING__REVIEW_ONLY`","",
 "New breadth: **780 spellings**. Combined ENG-007 breadth after CP004: **1,020 unique spellings**.","",
 "Review size: **180 questions — 60 per checkpoint, 20 per difficulty**.","","---",""
];
let number=1;
for(const cp of cps){
 lines.push(`# ${cp.id} — ${cp.title}`,"");
 for(const difficulty of DIFFICULTIES){
  lines.push(`## ${difficulty[0]!.toUpperCase()+difficulty.slice(1)}`,"");
  const pool=cp.entries.filter(x=>x.difficulty===difficulty);
  for(let i=0;i<20;i++){
   const entry=pool[Math.floor(i*pool.length/20)]!;
   const mode=i%2===0?"correct-spelling":"misspelt-word" as const;
   const q=cp.generate({seed:`eng007-review:${cp.id}:${difficulty}:${i}:${entry.id}`,difficulty,entryId:entry.id,mode});
   lines.push(`### Q${String(number++).padStart(3,"0")}`,"",q.stem,"");
   q.options.forEach((option,index)=>lines.push(`${LABELS[index]}. ${option}`));
   lines.push(
    "",`**Answer:** ${LABELS[q.correctOptionIndex]}. ${q.options[q.correctOptionIndex]}`,
    "",`**Explanation:** ${q.explanation}`,
    "",`**Mode:** ${q.metadata.mode}  `,`**Domain:** ${q.metadata.domain}  `,`**Trap:** ${q.metadata.trap}  `,`**Entry:** ${q.metadata.entryId}`,
    "","---",""
   );
  }
 }
}
lines.push("## Review checklist","","- Correct-spelling questions contain exactly one correctly spelt option and three misspelt options.","- Incorrect-spelling questions may mix correct and incorrect forms, with exactly one keyed misspelling.","- Options look like genuine competitive-exam spelling choices.","- No valid regional or alternative spelling is marked wrong.","- Misspellings are plausible rather than random letter noise.","- Difficulty calibration is realistic.","- Technical or formal subject knowledge is not required.","- Explanations are brief and useful.","");
await mkdir(dirname(OUT),{recursive:true});
await writeFile(OUT,lines.join("\n")+"\n","utf8");
console.log(OUT);
