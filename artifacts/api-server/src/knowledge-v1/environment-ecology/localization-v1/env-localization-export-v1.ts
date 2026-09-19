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
import { generateEnvCp012LocalizedReviewV1 } from "./env-cp012-localization-v1";
import { generateEnvCp013LocalizedReviewV1 } from "./env-cp013-localization-v1";
import { generateEnvCp014LocalizedReviewV1 } from "./env-cp014-localization-v1";
import { generateEnvCp015LocalizedReviewV1 } from "./env-cp015-localization-v1";
import { generateEnvCp016LocalizedReviewV1 } from "./env-cp016-localization-v1";
import { generateEnvCp017LocalizedReviewV1 } from "./env-cp017-localization-v1";
import { generateEnvCp018LocalizedReviewV1 } from "./env-cp018-localization-v1";
import { generateEnvCp019LocalizedReviewV1 } from "./env-cp019-localization-v1";
import { generateEnvCp020LocalizedReviewV1 } from "./env-cp020-localization-v1";
import type { EnvLocaleV1, EnvLocalizedQuestionV1 } from "./env-localization-types-v1";

const labels:Record<EnvLocaleV1,string>={en:"English",hi:"Hindi",pa:"Punjabi"};
const locales:EnvLocaleV1[]=["en","hi","pa"];
const targetDir=path.resolve("dist/environment-review/ENV-MULTILINGUAL-V1");
fs.mkdirSync(targetDir,{recursive:true});

type Cp="ENV-CP-001"|"ENV-CP-002"|"ENV-CP-003"|"ENV-CP-004"|"ENV-CP-005"|"ENV-CP-006"|"ENV-CP-007"|"ENV-CP-008"|"ENV-CP-009"|"ENV-CP-010"|"ENV-CP-011"|"ENV-CP-012"|"ENV-CP-013"|"ENV-CP-014"|"ENV-CP-015"|"ENV-CP-016"|"ENV-CP-017"|"ENV-CP-018"|"ENV-CP-019"|"ENV-CP-020";
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
  "ENV-CP-012":generateEnvCp012LocalizedReviewV1,
  "ENV-CP-013":generateEnvCp013LocalizedReviewV1,
  "ENV-CP-014":generateEnvCp014LocalizedReviewV1,
  "ENV-CP-015":generateEnvCp015LocalizedReviewV1,
  "ENV-CP-016":generateEnvCp016LocalizedReviewV1,
  "ENV-CP-017":generateEnvCp017LocalizedReviewV1,
  "ENV-CP-018":generateEnvCp018LocalizedReviewV1,
  "ENV-CP-019":generateEnvCp019LocalizedReviewV1,
  "ENV-CP-020":generateEnvCp020LocalizedReviewV1,
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
for(let i=1;i<=20;i++){
 const n=String(i).padStart(3,"0");
 materialize(`ENV-CP-${n}` as Cp,`CP${n}`,`ENV-MULTILINGUAL-V1-CP${n}-REVIEW.md`);
}
