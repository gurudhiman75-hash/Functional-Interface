import{mkdir,writeFile}from"node:fs/promises";import{dirname,resolve}from"node:path";
import{eng005Cp001PoolV1,type Eng005Difficulty,type Eng005Mode}from"./CP001/eng-005-cp001-lexicon-v1";import{generateEng005Cp001QuestionV1}from"./CP001/eng-005-cp001-v1";
import{eng005Cp002PoolV1,type Eng005Cp002Difficulty,type Eng005Cp002Mode}from"./CP002/eng-005-cp002-lexicon-v1";import{generateEng005Cp002QuestionV1}from"./CP002/eng-005-cp002-v1";
import{eng005Cp003PoolV1,type Eng005Cp003Difficulty,type Eng005Cp003Mode}from"./CP003/eng-005-cp003-lexicon-v1";import{generateEng005Cp003QuestionV1}from"./CP003/eng-005-cp003-v1";
import{eng005Cp004PoolV1,type Eng005Cp004Difficulty,type Eng005Cp004Mode}from"./CP004/eng-005-cp004-lexicon-v1";import{generateEng005Cp004QuestionV1}from"./CP004/eng-005-cp004-v1";
const OUT=resolve(process.cwd(),"dist/english-v1/ENG-005-CHAPTER-REVIEW-V1.md"),L=["A","B","C","D"]as const,D=["easy","medium","hard"]as const;
const lines:string[]=["# ENG-005 — Idioms & Phrases — Full Chapter Review V1","","Status: `HUMAN_EDITORIAL_REVIEW_PENDING__REVIEW_ONLY`","","Total bank: **840 unique expressions**.","","Review sample: **120 questions — 30 from each checkpoint, balanced across Easy / Medium / Hard**.","","---",""];
const specs=[
 {cp:"CP001",pool:(d:string)=>eng005Cp001PoolV1(d as Eng005Difficulty),gen:(x:any)=>generateEng005Cp001QuestionV1(x)},
 {cp:"CP002",pool:(d:string)=>eng005Cp002PoolV1(d as Eng005Cp002Difficulty),gen:(x:any)=>generateEng005Cp002QuestionV1(x)},
 {cp:"CP003",pool:(d:string)=>eng005Cp003PoolV1(d as Eng005Cp003Difficulty),gen:(x:any)=>generateEng005Cp003QuestionV1(x)},
 {cp:"CP004",pool:(d:string)=>eng005Cp004PoolV1(d as Eng005Cp004Difficulty),gen:(x:any)=>generateEng005Cp004QuestionV1(x)},
]as const;let n=1;
for(const spec of specs){lines.push(`# ${spec.cp}`,"");for(const d of D){lines.push(`## ${d[0]!.toUpperCase()+d.slice(1)}`,"");const p=spec.pool(d);for(let i=0;i<10;i++){const e:any=p[Math.floor(i*p.length/10)]!,mode=(i%2===0?"idiom-to-meaning":"meaning-to-idiom"),seed=`eng005-chapter-review:${spec.cp}:${d}:${e.id}:${mode}`,q:any=spec.gen({seed,difficulty:d,entryId:e.id,mode});lines.push(`### Q${String(n++).padStart(3,"0")}`,"",q.stem,"");q.options.forEach((o:string,j:number)=>lines.push(`${L[j]}. ${o}`));lines.push("",`**Answer:** ${L[q.correctOptionIndex]}. ${q.options[q.correctOptionIndex]}`,"",`**Explanation:** ${q.explanation}`,"",`**Domain:** ${q.metadata.category}  `,`**Mode:** ${q.metadata.mode}  `,`**Entry:** ${q.metadata.entryId}  `,"","---","");}}}
lines.push("## Chapter review checklist","","- Meanings are accurate and natural.","- Expressions are genuine SSC/Banking/State-exam level material.","- Distractors are plausible but not alternate correct answers.","- Easy/Medium/Hard distinctions feel meaningful.","- Classical/advanced expressions are useful rather than dictionary-obscure.","- Explanations remain simple.","- CP004 direct/reverse questions are approved separately from its stored context templates.","");
await mkdir(dirname(OUT),{recursive:true});await writeFile(OUT,lines.join("\n")+"\n","utf8");console.log(OUT);
