import{mkdir,writeFile}from"node:fs/promises";import{dirname,resolve}from"node:path";
import{eng004Cp001PoolV2}from"./CP001/eng-004-cp001-lexicon-v1";import{generateEng004Cp001QuestionV2}from"./CP001/eng-004-cp001-v1";
import{eng004Cp002PoolV1}from"./CP002/eng-004-cp002-lexicon-v1";import{generateEng004Cp002QuestionV1}from"./CP002/eng-004-cp002-v1";
import{eng004Cp003PoolV1}from"./CP003/eng-004-cp003-lexicon-v1";import{generateEng004Cp003QuestionV1}from"./CP003/eng-004-cp003-v1";
import{eng004Cp004PoolV1}from"./CP004/eng-004-cp004-lexicon-v1";import{generateEng004Cp004QuestionV1}from"./CP004/eng-004-cp004-v1";
import{eng004Cp005PoolV1}from"./CP005/eng-004-cp005-lexicon-v1";import{generateEng004Cp005QuestionV1}from"./CP005/eng-004-cp005-v1";

const OUT=resolve(process.cwd(),"dist/english-v1/ENG-004-CHAPTER-REVIEW-V1.md"),LABELS=["A","B","C","D"]as const;
const DIFFS=["easy","medium","hard"]as const;
const configs=[
 {cp:"CP001",label:"Core high-frequency vocabulary",pool:(d:any)=>eng004Cp001PoolV2(d),gen:(x:any)=>generateEng004Cp001QuestionV2(x)},
 {cp:"CP002",label:"Standard competitive vocabulary",pool:(d:any)=>eng004Cp002PoolV1(d),gen:(x:any)=>generateEng004Cp002QuestionV1(x)},
 {cp:"CP003",label:"Advanced competitive vocabulary",pool:(d:any)=>eng004Cp003PoolV1(d),gen:(x:any)=>generateEng004Cp003QuestionV1(x)},
 {cp:"CP004",label:"Context-sensitive alternate senses",pool:(d:any)=>eng004Cp004PoolV1(d),gen:(x:any)=>generateEng004Cp004QuestionV1(x)},
 {cp:"CP005",label:"Confusable & near-meaning sets",pool:(d:any)=>eng004Cp005PoolV1(d),gen:(x:any)=>generateEng004Cp005QuestionV1(x)}
]as const;
const lines:string[]=["# ENG-004 — Synonyms & Antonyms — Chapter Review V1","","Status: `HUMAN_EDITORIAL_REVIEW_PENDING__REVIEW_ONLY`","","Coverage: **2,100 unique headwords / 2,400 headword-senses**.","","Stored relations: **5,524 synonym links / 985 antonym links**.","","Review sample: **100 questions — 20 from each CP**.","","---",""];
let number=1;
for(const cfg of configs){
 lines.push(`## ${cfg.cp} — ${cfg.label}`,"");
 const perDiff={easy:7,medium:7,hard:6}as const;
 for(const difficulty of DIFFS){
  const pool=cfg.pool(difficulty),count=perDiff[difficulty];
  for(let i=0;i<count;i++){
   const index=Math.min(pool.length-1,Math.floor((i+0.5)*pool.length/count)),entry:any=pool[index],modes:string[]=[];
   if(entry.synonyms.length)modes.push("synonym");if(entry.antonyms.length)modes.push("antonym");
   const relationType=modes[(i+number)%modes.length]!,seed=`eng004-chapter-review-v1:${cfg.cp}:${difficulty}:${entry.id}:${relationType}`;
   const q:any=cfg.gen({seed,difficulty,entryId:entry.id,relationType});
   lines.push(`### Q${String(number).padStart(3,"0")} — ${difficulty[0].toUpperCase()+difficulty.slice(1)}`,"",q.stem,"");
   if(q.context)lines.push(q.context,"");
   q.options.forEach((o:string,j:number)=>lines.push(`${LABELS[j]}. ${o}`));
   lines.push("",`**Answer:** ${LABELS[q.correctOptionIndex]}. ${q.options[q.correctOptionIndex]}`,"",`**Explanation:** ${q.explanation}`,"",`**CP:** ${cfg.cp}  `,`**Relation:** ${q.metadata.relationType}  `,`**Word:** ${q.metadata.word}  `,`**Seed:** \`${seed}\``,"","---","");
   number++;
  }
 }
}
lines.push("## Chapter review checklist","","- Stems read like normal competitive-exam English.","- Correct relation is defensible for the tested sense.","- Context resolves polysemy where needed.","- Distractors are plausible but not second correct answers.","- Difficulty separation is credible.","- Explanations are simple and useful.","- No technical/dictionary-noise vocabulary has slipped through.","","Approval of this artifact may authorize the next review-only Question Studio integration step; it does not authorize learner/public/production promotion.","");
await mkdir(dirname(OUT),{recursive:true});await writeFile(OUT,lines.join("\n")+"\n","utf8");console.log(OUT);
