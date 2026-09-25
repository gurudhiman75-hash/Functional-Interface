import{mkdir,writeFile}from"node:fs/promises";
import{dirname,resolve}from"node:path";
import{ENG007_CP005_ENTRIES_V1}from"./CP005/eng-007-cp005-lexicon-v1";
import{generateEng007CP005QuestionV1}from"./CP005/eng-007-cp005-v1";

const OUT=resolve(process.cwd(),"dist/english-v1/ENG-007-CP005-REVIEW-V1.md");
const LABELS=["A","B","C","D"],DIFFICULTIES=["easy","medium","hard"]as const;
const lines:string[]=[
"# ENG-007 CP005 — Gap-Audit Expansion — Review V1","",
"Status: `HUMAN_REVIEW_PENDING__REVIEW_ONLY`","",
"CP005 contains **265 audit-selected spellings**: 26 Easy / 181 Medium / 58 Hard.","",
"These are coverage-gap additions, not a quota. Each retained word has at least two independent spelling-risk features.","",
"Review sample: **60 questions — 20 per difficulty**.","","---",""
];
let number=1;
for(const difficulty of DIFFICULTIES){
  lines.push(`# ${difficulty[0]!.toUpperCase()+difficulty.slice(1)}`,"");
  const pool=ENG007_CP005_ENTRIES_V1.filter(x=>x.difficulty===difficulty);
  for(let i=0;i<20;i++){
    const entry=pool[Math.floor(i*pool.length/20)]!;
    const mode=i%2===0?"correct-spelling":"misspelt-word" as const;
    const q=generateEng007CP005QuestionV1({seed:`eng007-cp005-review:${difficulty}:${i}:${entry.id}`,difficulty,entryId:entry.id,mode});
    lines.push(`### Q${String(number++).padStart(3,"0")}`,"",q.stem,"");
    q.options.forEach((option,index)=>lines.push(`${LABELS[index]}. ${option}`));
    lines.push("",`**Answer:** ${LABELS[q.correctOptionIndex]}. ${q.options[q.correctOptionIndex]}`,"",
      `**Explanation:** ${q.explanation}`,"",
      `**Mode:** ${q.metadata.mode}  `,
      `**Domain:** ${q.metadata.domain}  `,
      `**Trap:** ${q.metadata.trap}  `,
      `**Entry:** ${q.metadata.entryId}`,"","---","");
  }
}
lines.push("## Review checklist","",
"- Correct-spelling questions contain exactly one correct spelling and three misspelt options.",
"- Incorrect-spelling questions contain exactly one misspelt keyed answer.",
"- Misspellings look plausible rather than like random keyboard noise.",
"- Difficulty feels realistic.",
"- Every word adds genuine spelling value rather than merely difficult vocabulary.",
"- No accepted alternative spelling is being treated as an error.","");
await mkdir(dirname(OUT),{recursive:true});
await writeFile(OUT,lines.join("\n")+"\n","utf8");
console.log(OUT);
