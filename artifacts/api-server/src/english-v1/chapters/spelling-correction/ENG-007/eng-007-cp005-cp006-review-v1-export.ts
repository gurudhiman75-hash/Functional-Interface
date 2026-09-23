import{mkdir,writeFile}from"node:fs/promises";
import{dirname,resolve}from"node:path";
import{ENG007_CP005_ENTRIES_V1}from"./CP005/eng-007-cp005-lexicon-v1";
import{generateEng007CP005QuestionV1}from"./CP005/eng-007-cp005-v1";
import{ENG007_CP006_ENTRIES_V1}from"./CP006/eng-007-cp006-lexicon-v1";
import{generateEng007CP006QuestionV1}from"./CP006/eng-007-cp006-v1";

const OUT=resolve(process.cwd(),"dist/english-v1/ENG-007-CP005-CP006-REVIEW-V1.md");
const LABELS=["A","B","C","D"],DIFFICULTIES=["easy","medium","hard"]as const;
const cps=[
  {id:"CP005",title:"Advanced & Confusable Competitive Vocabulary",entries:ENG007_CP005_ENTRIES_V1,generate:generateEng007CP005QuestionV1},
  {id:"CP006",title:"Long-tail & High-confusion Spelling",entries:ENG007_CP006_ENTRIES_V1,generate:generateEng007CP006QuestionV1},
]as const;
const lines:string[]=[
"# ENG-007 CP005-CP006 — Spelling Correction — Final Review V1","",
"Status: `HUMAN_REVIEW_PENDING__REVIEW_ONLY`","",
"New breadth: **480 spellings**. Full ENG-007 breadth: **1,500 unique spellings**.","",
"Review size: **120 questions — 60 per checkpoint, 20 per difficulty**.","","---",""
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
      const q=cp.generate({seed:`eng007-final-review:${cp.id}:${difficulty}:${i}:${entry.id}`,difficulty,entryId:entry.id,mode});
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
lines.push("## Review checklist","","- Stems remain exam-grade and concise.","- Correct-spelling mode uses close spelling variants wherever possible.","- Misspelt-word mode uses one error among correct spellings.","- Explanations are correction-only.","- No accepted regional variant is deliberately marked wrong.","- Hard difficulty reflects spelling confusion, not word length alone.","");
await mkdir(dirname(OUT),{recursive:true});
await writeFile(OUT,lines.join("\n")+"\n","utf8");
console.log(OUT);
