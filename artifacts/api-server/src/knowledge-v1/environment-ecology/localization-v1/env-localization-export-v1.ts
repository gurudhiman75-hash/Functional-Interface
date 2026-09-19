import fs from "node:fs";
import path from "node:path";
import { generateEnvCp001LocalizedReviewV1 } from "./env-cp001-localization-v1";
import { generateEnvCp002LocalizedReviewV1 } from "./env-cp002-localization-v1";
import { generateEnvCp003LocalizedReviewV1 } from "./env-cp003-localization-v1";
import { generateEnvCp004LocalizedReviewV1 } from "./env-cp004-localization-v1";
import { generateEnvCp005LocalizedReviewV1 } from "./env-cp005-localization-v1";
import { generateEnvCp006LocalizedReviewV1 } from "./env-cp006-localization-v1";
import { generateEnvCp007LocalizedReviewV1 } from "./env-cp007-localization-v1";
import { generateEnvCp008LocalizedReviewV1 } from "./env-cp008-localization-v1";
import { generateEnvCp009LocalizedReviewV1 } from "./env-cp009-localization-v1";
import { generateEnvCp010LocalizedReviewV1 } from "./env-cp010-localization-v1";
import { generateEnvCp011LocalizedReviewV1 } from "./env-cp011-localization-v1";
import type { EnvLocaleV1, EnvLocalizedQuestionV1 } from "./env-localization-types-v1";

const labels:Record<EnvLocaleV1,string>={en:"English",hi:"Hindi",pa:"Punjabi"};
const locales:EnvLocaleV1[]=["en","hi","pa"];
const targetDir=path.resolve("dist/environment-review/ENV-MULTILINGUAL-V1");
fs.mkdirSync(targetDir,{recursive:true});

type Cp="ENV-CP-001"|"ENV-CP-002"|"ENV-CP-003"|"ENV-CP-004"|"ENV-CP-005"|"ENV-CP-006"|"ENV-CP-007"|"ENV-CP-008"|"ENV-CP-009"|"ENV-CP-010"|"ENV-CP-011";
const generators:Record<Cp,(locale:EnvLocaleV1)=>EnvLocalizedQuestionV1[]>={
  "ENV-CP-001":generateEnvCp001LocalizedReviewV1,
  "ENV-CP-002":generateEnvCp002LocalizedReviewV1,
  "ENV-CP-003":generateEnvCp003LocalizedReviewV1,
  "ENV-CP-004":generateEnvCp004LocalizedReviewV1,
  "ENV-CP-005":generateEnvCp005LocalizedReviewV1,
  "ENV-CP-006":generateEnvCp006LocalizedReviewV1,
  "ENV-CP-007":generateEnvCp007LocalizedReviewV1,
  "ENV-CP-008":generateEnvCp008LocalizedReviewV1,
  "ENV-CP-009":generateEnvCp009LocalizedReviewV1,
  "ENV-CP-010":generateEnvCp010LocalizedReviewV1,
  "ENV-CP-011":generateEnvCp011LocalizedReviewV1,
};

function render(q:EnvLocalizedQuestionV1,index:number){
 const out=[`**${index+1}. ${q.stem}**`];
 q.options.forEach((o,i)=>out.push(`${String.fromCharCode(65+i)}. ${o}`));
 out.push(`**Answer:** ${String.fromCharCode(65+q.correctIndex)} — ${q.canonicalAnswer}`);
 out.push(`**Explanation:** ${q.explanation}`,"");
 return out;
}
function materialize(cp:Cp,title:string,filename:string){
 const out=[`# Environment Multilingual V1 — ${title} Review`,"","Review-only candidate. Frozen English remains semantic authority. Hindi and Punjabi preserve CP, QL, difficulty, source provenance, option order and correct-index parity.",""];
 for(const locale of locales){
   out.push(`## ${labels[locale]}`,"");
   generators[cp](locale).forEach((q,i)=>out.push(...render(q,i)));
 }
 const target=path.join(targetDir,filename);
 fs.writeFileSync(target,out.join("\n"));
 console.log(target);
}
for(let i=1;i<=11;i++){
 const n=String(i).padStart(3,"0");
 materialize(`ENV-CP-${n}` as Cp,`CP${n}`,`ENV-MULTILINGUAL-V1-CP${n}-REVIEW.md`);
}
