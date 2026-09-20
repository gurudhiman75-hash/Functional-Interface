import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { eng004Cp001PoolV2, type Eng004Difficulty, type Eng004RelationType } from "./eng-004-cp001-lexicon-v1";
import { generateEng004Cp001QuestionV2 } from "./eng-004-cp001-v1";

const OUTPUT=resolve(process.cwd(),"dist/english-v1/ENG-004-CP001-REVIEW-V2.md");
const LABELS=["A","B","C","D"] as const;
const DIFFICULTIES=["easy","medium","hard"] as const;
const title=(v:string)=>v.slice(0,1).toUpperCase()+v.slice(1);
const lines:string[]=[
  "# ENG-004-CP001 — Core Synonyms & Antonyms — Review V2",
  "",
  "Status: `HUMAN_REVIEW_PENDING__500_ENTRY_EXPANDED_BANK__REVIEW_ONLY`",
  "",
  "Bank size: 500 headword-senses.",
  "",
  "Review size: 60 questions — 20 Easy / 20 Medium / 20 Hard.",
  "",
  "---",""
];
let number=1;
for(const difficulty of DIFFICULTIES){
  lines.push(`## ${title(difficulty)}`,"");
  const pool=eng004Cp001PoolV2(difficulty as Eng004Difficulty);
  const step=Math.max(1,Math.floor(pool.length/20));
  for(let i=0;i<20;i+=1){
    const entry=pool[Math.min(i*step,pool.length-1)]!;
    const available:Eng004RelationType[]=[];
    if(entry.synonyms.length)available.push("synonym");
    if(entry.antonyms.length)available.push("antonym");
    const relationType=available[i%available.length]!;
    const seed=`eng004-cp001-review-v2:${difficulty}:${entry.id}:${relationType}`;
    const q=generateEng004Cp001QuestionV2({difficulty:difficulty as Eng004Difficulty,entryId:entry.id,relationType,seed});
    lines.push(`### Q${String(number).padStart(2,"0")}`,"",q.stem,"");
    if(q.context)lines.push(q.context,"");
    q.options.forEach((option,index)=>lines.push(`${LABELS[index]}. ${option}`));
    lines.push("",`**Answer:** ${LABELS[q.correctOptionIndex]}. ${q.options[q.correctOptionIndex]}`,"");
    lines.push(`**Explanation:** ${q.explanation}`,"");
    lines.push(`**Relation:** ${q.metadata.relationType}  `);
    lines.push(`**Word:** ${q.metadata.word}  `);
    lines.push(`**Entry:** ${q.metadata.entryId}  `);
    lines.push(`**Sense:** ${q.metadata.senseRank}/${q.metadata.senseCount}  `);
    lines.push(`**WordNet synset:** ${q.metadata.sourceSynsetOffset}  `);
    lines.push(`**Seed:** \`${seed}\``,"","---","");
    number+=1;
  }
}
lines.push(
  "## Review checklist","",
  "- Stem reads like a normal competitive-exam vocabulary question.",
  "- Context is supplied when the headword is materially polysemous and a source example is available.",
  "- Exactly one displayed option is defensible for the tested sense.",
  "- Distractors match the part of speech and are not known direct WordNet synonyms/antonyms of the headword.",
  "- Easy / Medium / Hard separation feels realistic.",
  "- Explanations identify the tested sense in simple language.",
  "- No archaic/technical relation has slipped into the answer choices.",
  "",
  "Approval is required before Question Studio registration.",""
);
await mkdir(dirname(OUTPUT),{recursive:true});
await writeFile(OUTPUT,`${lines.join("\n")}\n`,"utf8");
console.log(OUTPUT);
