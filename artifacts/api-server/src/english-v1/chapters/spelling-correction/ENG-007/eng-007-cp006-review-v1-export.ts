import{mkdir,writeFile}from"node:fs/promises";
import{dirname,resolve}from"node:path";
import{ENG007_CP006_ENTRIES_V1}from"./CP006/eng-007-cp006-lexicon-v1";
import{generateEng007CP006QuestionV1}from"./CP006/eng-007-cp006-v1";
const OUT=resolve(process.cwd(),"dist/english-v1/ENG-007-CP006-REVIEW-V1.md");
const LABELS=["A","B","C","D"],DIFFICULTIES=["easy","medium","hard"]as const;
const lines:string[]=[
"# ENG-007 CP006 — PYQ Spelling Gap Closure — Review V1","",
"Status: `HUMAN_REVIEW_PENDING__REVIEW_ONLY`","",
"CP006 contains **107 exam-attested gap spellings**: 37 Easy / 54 Medium / 16 Hard.","",
"These are residual PYQ gaps found after CP005; the count is not a quota.","",
"Review sample: **60 questions — 20 per difficulty**.","","---",""
];
let number=1;
for(const difficulty of DIFFICULTIES){
  lines.push(`# ${difficulty[0]!.toUpperCase()+difficulty.slice(1)}`,"");
  const pool=ENG007_CP006_ENTRIES_V1.filter(x=>x.difficulty===difficulty);
  for(let i=0;i<20;i++){
    const entry=pool[Math.floor(i*pool.length/20)]!;
    const mode=i%2===0?"correct-spelling":"misspelt-word" as const;
    const q=generateEng007CP006QuestionV1({seed:`eng007-cp006-review:${difficulty}:${i}:${entry.id}`,difficulty,entryId:entry.id,mode});
    lines.push(`### Q${String(number++).padStart(3,"0")}`,"",q.stem,"");
    q.options.forEach((option,index)=>lines.push(`${LABELS[index]}. ${option}`));
    lines.push("",`**Answer:** ${LABELS[q.correctOptionIndex]}. ${q.options[q.correctOptionIndex]}`,"",
      `**Explanation:** ${q.explanation}`,"",
      `**Mode:** ${q.metadata.mode}  `,
      `**Trap:** ${q.metadata.trap}  `,
      `**Entry:** ${q.metadata.entryId}`,"","---","");
  }
}
lines.push("## Review checklist","",
"- Correct-spelling questions contain exactly one correct spelling and three misspelt options.",
"- Incorrect-spelling questions contain exactly one misspelt keyed answer.",
"- Misspellings look like realistic exam errors.",
"- Difficulty feels appropriate for SSC/Banking-style spelling questions.",
"- No accepted British/American alternative is treated as an error.","");
await mkdir(dirname(OUT),{recursive:true});
await writeFile(OUT,lines.join("\n")+"\n","utf8");
console.log(OUT);
