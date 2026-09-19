import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { eng004Cp001PoolV1, type Eng004Difficulty, type Eng004RelationType } from "./eng-004-cp001-lexicon-v1";
import { generateEng004Cp001QuestionV1 } from "./eng-004-cp001-v1";

const OUTPUT=resolve(process.cwd(),"dist/english-v1/ENG-004-CP001-REVIEW-V1.md");
const LABELS=["A","B","C","D"] as const;
const DIFFICULTIES=["easy","medium","hard"] as const;
const title=(v:string)=>v.slice(0,1).toUpperCase()+v.slice(1);

const lines:string[]=[
  "# ENG-004-CP001 — Core Synonyms & Antonyms — Review V1",
  "",
  "Status: `HUMAN_REVIEW_PENDING__REVIEW_ONLY__NO_QUESTION_STUDIO_REGISTRATION`",
  "",
  "Question family: Direct Synonym / Antonym",
  "",
  "Review size: 30 questions — 10 Easy / 10 Medium / 10 Hard.",
  "",
  "---",
  "",
];

let number=1;
for(const difficulty of DIFFICULTIES){
  lines.push(`## ${title(difficulty)}`,"");
  const pool=eng004Cp001PoolV1(difficulty as Eng004Difficulty).slice(0,10);
  for(let i=0;i<pool.length;i+=1){
    const entry=pool[i]!;
    const relationType:Eng004RelationType=i%2===0?"synonym":"antonym";
    const seed=`eng004-cp001-review-v1:${difficulty}:${entry.id}:${relationType}`;
    const q=generateEng004Cp001QuestionV1({difficulty:difficulty as Eng004Difficulty,entryId:entry.id,relationType,seed});
    lines.push(`### Q${String(number).padStart(2,"0")}`,"",q.stem,"");
    q.options.forEach((option,index)=>lines.push(`${LABELS[index]}. ${option}`));
    lines.push("",`**Answer:** ${LABELS[q.correctOptionIndex]}. ${q.options[q.correctOptionIndex]}`,"");
    lines.push(`**Explanation:** ${q.explanation}`,"");
    lines.push(`**Relation:** ${q.metadata.relationType}  `);
    lines.push(`**Word:** ${q.metadata.word}  `);
    lines.push(`**Entry:** ${q.metadata.entryId}  `);
    lines.push(`**Seed:** \`${seed}\``,"","---","");
    number+=1;
  }
}

lines.push(
  "## Review checklist","",
  "- Stems read like normal SSC/Banking vocabulary questions.",
  "- Exactly one option is defensible.",
  "- Distractors match the target part of speech and remain plausible.",
  "- Easy / Medium / Hard separation comes from vocabulary familiarity, not broken wording.",
  "- Explanations give the target meaning and a natural usage example.",
  "- Synonym and antonym surfaces are both represented at every difficulty.",
  "",
  "Approval is required before Question Studio registration or chapter promotion.",""
);

await mkdir(dirname(OUTPUT),{recursive:true});
await writeFile(OUTPUT,`${lines.join("\n")}\n`,"utf8");
console.log(OUTPUT);
