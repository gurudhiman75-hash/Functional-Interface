import fs from "node:fs";
import path from "node:path";
import { generateEnvCp001LocalizedReviewV1 } from "./env-cp001-localization-v1";
import { generateEnvCp002LocalizedReviewV1 } from "./env-cp002-localization-v1";
import { generateEnvCp003LocalizedReviewV1 } from "./env-cp003-localization-v1";
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
function materialize(cp:"ENV-CP-001"|"ENV-CP-002"|"ENV-CP-003", title:string, filename:string){
 const out=[`# Environment Multilingual V1 — ${title} Review`,"","Review-only candidate. Frozen English remains semantic authority. Hindi and Punjabi preserve CP, QL, difficulty, source provenance, option order and correct-index parity.",""];
 for(const locale of locales){
   out.push(`## ${labels[locale]}`,"");
   const qs=cp==="ENV-CP-001"
     ? generateEnvCp001LocalizedReviewV1(locale)
     : cp==="ENV-CP-002"
       ? generateEnvCp002LocalizedReviewV1(locale)
       : generateEnvCp003LocalizedReviewV1(locale);
   qs.forEach((q,i)=>out.push(...render(q,i)));
 }
 const target=path.join(targetDir,filename);
 fs.writeFileSync(target,out.join("\n"));
 console.log(target);
}
materialize("ENV-CP-001","CP001","ENV-MULTILINGUAL-V1-CP001-REVIEW.md");
materialize("ENV-CP-002","CP002","ENV-MULTILINGUAL-V1-CP002-REVIEW.md");
materialize("ENV-CP-003","CP003","ENV-MULTILINGUAL-V1-CP003-REVIEW.md");
