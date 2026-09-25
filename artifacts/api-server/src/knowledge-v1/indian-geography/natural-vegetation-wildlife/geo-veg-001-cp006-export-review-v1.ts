import fs from "node:fs";
import path from "node:path";
import { GEO_VEG_001_CP006_REVIEW_BATCH_V1, auditGeoVeg001Cp006ReviewBatchV1 } from "./geo-veg-001-cp006-review-batch-v1";
const audit=auditGeoVeg001Cp006ReviewBatchV1(); if(!audit.valid) throw new Error(audit.issues.join(" | "));
const outDir=path.resolve(process.cwd(),"dist/geography-review/GEO-VEG-001-CP006-V1");fs.mkdirSync(outDir,{recursive:true});
const letters=["A","B","C","D"];const lines=["# GEO-VEG-001 CP006 — Mangrove / Tidal / Littoral & Swamp Vegetation — Review Batch V1","",`Questions: ${audit.questionCount}`,`Difficulty: Easy ${audit.difficultyCounts.Easy} / Medium ${audit.difficultyCounts.Medium} / Hard ${audit.difficultyCounts.Hard}`,""];
GEO_VEG_001_CP006_REVIEW_BATCH_V1.forEach((q,i)=>{lines.push("## "+(i+1)+". "+q.stem,"",...q.options.map((o,j)=>letters[j]+". "+o),"","**Answer:** "+letters[q.correctIndex]+". "+q.canonicalAnswer,"","**Explanation:** "+q.explanation,"","**Difficulty:** "+q.difficulty,"**QL:** "+q.qlId+" — "+q.qlName,"");});
const file=path.join(outDir,"GEO-VEG-001-CP006-REVIEW-BATCH-V1.md");fs.writeFileSync(file,lines.join("\n"));console.log(file);
