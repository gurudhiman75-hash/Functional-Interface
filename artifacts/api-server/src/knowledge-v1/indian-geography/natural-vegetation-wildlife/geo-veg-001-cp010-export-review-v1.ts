import fs from "node:fs";
import path from "node:path";
import { GEO_VEG_001_CP010_REVIEW_BATCH_V1, auditGeoVeg001Cp010ReviewBatchV1 } from "./geo-veg-001-cp010-review-batch-v1";
const audit=auditGeoVeg001Cp010ReviewBatchV1(); if(!audit.valid) throw new Error(audit.issues.join(" | "));
const outDir=path.resolve(process.cwd(),"dist/geography-review/GEO-VEG-001-CP010-V1");fs.mkdirSync(outDir,{recursive:true});
const letters=["A","B","C","D"];const lines=["# GEO-VEG-001 CP010 — Biodiversity & Conservation Concepts — Review Batch V1","",`Questions: ${audit.questionCount}`,`Difficulty: Easy ${audit.difficultyCounts.Easy} / Medium ${audit.difficultyCounts.Medium} / Hard ${audit.difficultyCounts.Hard}`,""];
GEO_VEG_001_CP010_REVIEW_BATCH_V1.forEach((q,i)=>{lines.push("## "+(i+1)+". "+q.stem,"",...q.options.map((o,j)=>letters[j]+". "+o),"","**Answer:** "+letters[q.correctIndex]+". "+q.canonicalAnswer,"","**Explanation:** "+q.explanation,"","**Difficulty:** "+q.difficulty,"**QL:** "+q.qlId+" — "+q.qlName,"");});
const file=path.join(outDir,"GEO-VEG-001-CP010-REVIEW-BATCH-V1.md");fs.writeFileSync(file,lines.join("\n"));console.log(file);
