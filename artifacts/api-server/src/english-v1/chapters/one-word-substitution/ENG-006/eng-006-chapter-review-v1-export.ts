import{mkdir,writeFile}from"node:fs/promises";import{dirname,resolve}from"node:path";
import{eng006Cp001PoolV1,type Eng006Difficulty}from"./CP001/eng-006-cp001-lexicon-v1";import{generateEng006Cp001QuestionV1}from"./CP001/eng-006-cp001-v1";
import{eng006Cp002PoolV1,type Eng006Cp002Difficulty}from"./CP002/eng-006-cp002-lexicon-v1";import{generateEng006Cp002QuestionV1}from"./CP002/eng-006-cp002-v1";
import{eng006Cp003PoolV1,type Eng006Cp003Difficulty}from"./CP003/eng-006-cp003-lexicon-v1";import{generateEng006Cp003QuestionV1}from"./CP003/eng-006-cp003-v1";
import{eng006Cp004PoolV1,type Eng006Cp004Difficulty}from"./CP004/eng-006-cp004-lexicon-v1";import{generateEng006Cp004QuestionV1}from"./CP004/eng-006-cp004-v1";
import{eng006Cp005PoolV1,type Eng006Cp005Difficulty}from"./CP005/eng-006-cp005-lexicon-v1";import{generateEng006Cp005QuestionV1}from"./CP005/eng-006-cp005-v1";
import{eng006Cp006PoolV1,type Eng006Cp006Difficulty}from"./CP006/eng-006-cp006-lexicon-v1";import{generateEng006Cp006QuestionV1}from"./CP006/eng-006-cp006-v1";
const OUT=resolve(process.cwd(),"dist/english-v1/ENG-006-CHAPTER-REVIEW-V2.md"),L=["A","B","C","D"]as const,D=["easy","medium","hard"]as const;
const lines:string[]=["# ENG-006 — One-word Substitution — Full Chapter Review V2","","Status: `HUMAN_EDITORIAL_REVIEW_PENDING__REVIEW_ONLY`","","Total bank: **1,400 unique substitutions**.","","Review sample: **180 questions — 30 from each checkpoint, balanced across Easy / Medium / Hard**.","","---",""];
const specs=[
 {cp:"CP001",pool:(d:string)=>eng006Cp001PoolV1(d as Eng006Difficulty),gen:(x:any)=>generateEng006Cp001QuestionV1(x)},
 {cp:"CP002",pool:(d:string)=>eng006Cp002PoolV1(d as Eng006Cp002Difficulty),gen:(x:any)=>generateEng006Cp002QuestionV1(x)},
 {cp:"CP003",pool:(d:string)=>eng006Cp003PoolV1(d as Eng006Cp003Difficulty),gen:(x:any)=>generateEng006Cp003QuestionV1(x)},
 {cp:"CP004",pool:(d:string)=>eng006Cp004PoolV1(d as Eng006Cp004Difficulty),gen:(x:any)=>generateEng006Cp004QuestionV1(x)},
 {cp:"CP005",pool:(d:string)=>eng006Cp005PoolV1(d as Eng006Cp005Difficulty),gen:(x:any)=>generateEng006Cp005QuestionV1(x)},
 {cp:"CP006",pool:(d:string)=>eng006Cp006PoolV1(d as Eng006Cp006Difficulty),gen:(x:any)=>generateEng006Cp006QuestionV1(x)},
]as const;let n=1;
for(const spec of specs){lines.push(`# ${spec.cp}`,"");for(const d of D){lines.push(`## ${d[0]!.toUpperCase()+d.slice(1)}`,"");const p=spec.pool(d);for(let i=0;i<10;i++){const e:any=p[Math.floor(i*p.length/10)]!,seed=`eng006-chapter-review-v2:${spec.cp}:${d}:${e.id}`,q:any=spec.gen({seed,difficulty:d,entryId:e.id});lines.push(`### Q${String(n++).padStart(3,"0")}`,"",q.stem,"");q.options.forEach((o:string,j:number)=>lines.push(`${L[j]}. ${o}`));lines.push("",`**Answer:** ${L[q.correctOptionIndex]}. ${q.options[q.correctOptionIndex]}`,"",`**Explanation:** ${q.explanation}`,"",`**Domain:** ${q.metadata.category}  `,`**Entry:** ${q.metadata.entryId}  `,"","---","");}}}
lines.push("## Chapter review checklist","","- Definitions are precise and exam-standard.","- Exactly one option is correct.","- Distractors are plausible and from the same semantic family.","- CP005/CP006 add genuine breadth rather than morphological padding.","- Advanced entries are useful rather than needlessly obscure.","- Easy/Medium/Hard calibration feels meaningful.","- Explanations are simple and direct.","");
await mkdir(dirname(OUT),{recursive:true});await writeFile(OUT,lines.join("\n")+"\n","utf8");console.log(OUT);
