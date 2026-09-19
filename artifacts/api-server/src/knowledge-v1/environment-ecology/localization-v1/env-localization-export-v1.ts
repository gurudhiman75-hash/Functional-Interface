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
import type { EnvLocaleV1, EnvLocalizedQuestionV1 } from "./env-localization-types-v1";

const labels: Record<EnvLocaleV1,string>={en:"English",hi:"Hindi",pa:"Punjabi"};
const locales: EnvLocaleV1[]=["en","hi","pa"];
const targetDir=path.resolve("dist/environment-review/ENV-MULTILINGUAL-V1");
fs.mkdirSync(targetDir,{recursive:true});

function render(q:EnvLocalizedQuestionV1,index:number){
 const out=[`**${index+1}. ${q.stem}**`];
 q.options.forEach((o,i)=>out.push(`${String.fromCharCode(65+i)}. ${o}`));
 out.push(`**Answer:** ${String.fromCharCode(65+q.correctIndex)} — ${q.canonicalAnswer}`);
 out.push(`**Explanation:** ${q.explanation}`,"");
 return out;
}
function materialize(cp:"ENV-CP-001"|"ENV-CP-002"|"ENV-CP-003"|"ENV-CP-004"|"ENV-CP-005"|"ENV-CP-006"|"ENV-CP-007"|"ENV-CP-008", title:string, filename:string){
 const out=[`# Environment Multilingual V1 — ${title} Review`,"","Review-only candidate. Frozen English remains semantic authority. Hindi and Punjabi preserve CP, QL, difficulty, source provenance, option order and correct-index parity.",""];
 for(const locale of locales){
   out.push(`## ${labels[locale]}`,"");
   const qs=cp==="ENV-CP-001"
     ? generateEnvCp001LocalizedReviewV1(locale)
     : cp==="ENV-CP-002"
       ? generateEnvCp002LocalizedReviewV1(locale)
       : cp==="ENV-CP-003"
         ? generateEnvCp003LocalizedReviewV1(locale)
         : cp==="ENV-CP-004"
           ? generateEnvCp004LocalizedReviewV1(locale)
           : cp==="ENV-CP-005"
             ? generateEnvCp005LocalizedReviewV1(locale)
             : cp==="ENV-CP-006"
               ? generateEnvCp006LocalizedReviewV1(locale)
               : cp==="ENV-CP-007"
                 ? generateEnvCp007LocalizedReviewV1(locale)
                 : generateEnvCp008LocalizedReviewV1(locale);
   qs.forEach((q,i)=>out.push(...render(q,i)));
 }
 const target=path.join(targetDir,filename);
 fs.writeFileSync(target,out.join("\n"));
 console.log(target);
}
materialize("ENV-CP-001","CP001","ENV-MULTILINGUAL-V1-CP001-REVIEW.md");
materialize("ENV-CP-002","CP002","ENV-MULTILINGUAL-V1-CP002-REVIEW.md");
materialize("ENV-CP-003","CP003","ENV-MULTILINGUAL-V1-CP003-REVIEW.md");
materialize("ENV-CP-004","CP004","ENV-MULTILINGUAL-V1-CP004-REVIEW.md");
materialize("ENV-CP-005","CP005","ENV-MULTILINGUAL-V1-CP005-REVIEW.md");
materialize("ENV-CP-006","CP006","ENV-MULTILINGUAL-V1-CP006-REVIEW.md");
materialize("ENV-CP-007","CP007","ENV-MULTILINGUAL-V1-CP007-REVIEW.md");
materialize("ENV-CP-008","CP008","ENV-MULTILINGUAL-V1-CP008-REVIEW.md");
