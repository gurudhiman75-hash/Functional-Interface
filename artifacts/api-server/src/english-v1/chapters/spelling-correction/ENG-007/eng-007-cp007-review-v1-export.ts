import{mkdir,writeFile}from"node:fs/promises";
import{dirname,resolve}from"node:path";
import{ENG007_CP007_ENTRIES_V1}from"./CP007/eng-007-cp007-lexicon-v1";
import{generateEng007CP007QuestionV1}from"./CP007/eng-007-cp007-v1";
const OUT=resolve(process.cwd(),"dist/english-v1/ENG-007-CP007-REVIEW-V1.md");
const LABELS=["A","B","C","D"];
const lines:string[]=[
"# ENG-007 CP007 — Final PYQ Residual Closure — Review V1","",
"Status: `HUMAN_REVIEW_PENDING__REVIEW_ONLY`","",
"CP007 contains **53 residual exam-attested spellings**: 21 Easy / 25 Medium / 7 Hard.","",
"This review contains **every CP007 entry exactly once**.","","---",""
];
let number=1;
for(const difficulty of["easy","medium","hard"]as const){
  lines.push(`# ${difficulty[0]!.toUpperCase()+difficulty.slice(1)}`,"");
  const pool=ENG007_CP007_ENTRIES_V1.filter(x=>x.difficulty===difficulty);
  for(let i=0;i<pool.length;i++){
    const entry=pool[i]!;
    const mode=(number%2===1?"correct-spelling":"misspelt-word")as const;
    const q=generateEng007CP007QuestionV1({seed:`eng007-cp007-review:${entry.id}:${mode}`,difficulty,entryId:entry.id,mode});
    lines.push(`### Q${String(number++).padStart(3,"0")}`,"",q.stem,"");
    q.options.forEach((option,index)=>lines.push(`${LABELS[index]}. ${option}`));
    lines.push("",`**Answer:** ${LABELS[q.correctOptionIndex]}. ${q.options[q.correctOptionIndex]}`,"",
      `**Explanation:** ${q.explanation}`,"",
      `**Mode:** ${q.metadata.mode}  `,
      `**Source:** ${q.metadata.sourceRef}  `,
      `**Trap:** ${q.metadata.trap}  `,
      `**Entry:** ${q.metadata.entryId}`,"","---","");
  }
}
lines.push("## Review checklist","",
"- All 53 entries are present exactly once.",
"- Correct-spelling questions contain exactly one correct spelling and three misspelt options.",
"- Incorrect-spelling questions contain exactly one misspelt keyed answer.",
"- Misspellings look like realistic exam errors.",
"- Difficulty feels appropriate for SSC/Banking-style spelling questions.",
"- No accepted UK/US spelling variant is treated as an error.","");
await mkdir(dirname(OUT),{recursive:true});
await writeFile(OUT,lines.join("\n")+"\n","utf8");
console.log(OUT);
