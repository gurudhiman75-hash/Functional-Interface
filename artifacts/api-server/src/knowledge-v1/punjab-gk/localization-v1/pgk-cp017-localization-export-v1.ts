import fs from "node:fs";
import path from "node:path";
import { generatePgkCp017LocalizedReviewV1 } from "./pgk-cp017-localization-v1";
import type { PgkLocaleV1 } from "./pgk-localization-types-v1";
const ls:PgkLocaleV1[]=["en","hi","pa"],L={en:"English",hi:"Hindi",pa:"Punjabi"} as const,c=Object.fromEntries(ls.map(l=>[l,generatePgkCp017LocalizedReviewV1(l)])) as Record<PgkLocaleV1,ReturnType<typeof generatePgkCp017LocalizedReviewV1>>,a:string[]=["# PGK-001 CP017 — Multilingual Review V1","","Status: REVIEW-READY / AWAITING HUMAN APPROVAL","Scope: 42 questions × English/Hindi/Punjabi = 126 review surfaces",""];
for(let i=0;i<42;i++){const e=c.en[i]!;a.push(`## ${e.questionId} · ${e.qlId} · ${e.difficulty}`,"");for(const l of ls){const q=c[l][i]!;a.push(`### ${L[l]}`,`**Question:** ${q.stem.replace(/\n/g,"<br>")}`,"");q.options.forEach((o,j)=>a.push(`${j+1}. ${o}${j===q.correctIndex?" ✅":""}`));a.push("",`**Explanation:** ${q.explanation}`,"");}}
const d=path.resolve(process.cwd(),"dist/pgk-review/PGK-MULTILINGUAL-V1");fs.mkdirSync(d,{recursive:true});const p=path.join(d,"PGK-MULTILINGUAL-V1-CP017-REVIEW.md");fs.writeFileSync(p,a.join("\n")+"\n");console.log(p);
