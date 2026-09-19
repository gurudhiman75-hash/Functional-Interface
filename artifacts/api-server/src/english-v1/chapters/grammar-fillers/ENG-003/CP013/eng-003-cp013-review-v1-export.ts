import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { EnglishDifficulty } from "../../../../core/types";
import { cp013ScenePoolV1 } from "../../../error-spotting/ENG-001/CP013/eng-001-cp013-v1";
import { generateEng003Cp013QuestionV1 } from "./eng-003-cp013-v1";

const OUTPUT=resolve(process.cwd(),"dist/english-v1/ENG-003-CP013-REVIEW-V1.md");
const LABELS=["A","B","C","D"] as const;
const DIFFICULTIES=["easy","medium","hard"] as const;
const title=(value:string)=>value.slice(0,1).toUpperCase()+value.slice(1);

function reviewScenes(difficulty:EnglishDifficulty){
  const pool=[...cp013ScenePoolV1(difficulty)];
  const selected:typeof pool=[];
  const ids=new Set<string>();
  const rules=new Set<string>();
  for(const scene of pool){
    if(rules.has(scene.ruleId)) continue;
    selected.push(scene); ids.add(scene.id); rules.add(scene.ruleId);
  }
  for(const scene of pool){
    if(selected.length>=10) break;
    if(ids.has(scene.id)) continue;
    selected.push(scene); ids.add(scene.id);
  }
  if(selected.length!==10) throw new Error(`ENG-003 CP013 needs 10 ${difficulty} review scenes`);
  return selected;
}

const lines:string[]=[
"# ENG-003-CP013 — Common Usage / Idiomatic Grammar Fillers — Review V1",
"",
"Status: `HUMAN_REVIEW_PENDING__REVIEW_ONLY__NO_PRODUCTION_PROMOTION`",
"",
"Question family: Fill in the Blank / Grammar Filler",
"",
"Review size: 30 questions — 10 Easy / 10 Medium / 10 Hard.",
"",
"---",
"",
];

let number=1;
const represented=new Set<string>();
for(const difficulty of DIFFICULTIES){
  lines.push(`## ${title(difficulty)}`,"");
  for(const scene of reviewScenes(difficulty)){
    const seed=`eng003-cp013-review-v1:${difficulty}:${scene.id}`;
    const q=generateEng003Cp013QuestionV1({difficulty,ruleId:scene.ruleId,sceneId:scene.id,seed});
    represented.add(q.metadata.ruleId);
    lines.push(`### Q${String(number).padStart(2,"0")}`,"",q.stem,"",q.sentence,"");
    q.options.forEach((option,index)=>lines.push(`${LABELS[index]}. ${option}`));
    lines.push("",`**Answer:** ${LABELS[q.correctOptionIndex]}. ${q.options[q.correctOptionIndex]}`,"");
    lines.push(`**Explanation:** ${q.explanation}`,"");
    lines.push(`**Rule:** ${q.metadata.ruleId}  `);
    lines.push(`**Semantic domain:** ${q.metadata.semanticDomain}  `);
    lines.push(`**Scene:** ${q.metadata.sceneId}  `);
    lines.push(`**Seed:** \`${seed}\``,"","---","");
    number+=1;
  }
}
if(represented.size!==9) throw new Error(`Review covers ${represented.size}/9 usage rules`);

lines.push(
"## Review checklist","",
"- Stem reads like a normal competitive-exam filler instruction.",
"- The blank focuses on the fixed preposition or connector being tested.",
"- Exactly one option is defensible under the checkpoint's exam convention.",
"- All 9 usage rule families are represented.",
"- 'different to' and 'different than' are not used as error distractors.",
"- Explanations use simple language: answer, rule, sentence application, corrected sentence.",
"- Easy / Medium / Hard separation feels genuine.",
"- No `No improvement` / sentence-improvement wording leaks into ENG-003.",
"","Approval is required before Question Studio registration or merge.","",
);

await mkdir(dirname(OUTPUT),{recursive:true});
await writeFile(OUTPUT,`${lines.join("\n")}\n`,"utf8");
console.log(OUTPUT);
