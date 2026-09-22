import fs from "node:fs";
import path from "node:path";
import {GEO_SOI_001_CP011_REVIEW_BATCH_V1,auditGeoSoi001Cp011ReviewBatchV1} from "./geo-soi-001-cp011-review-batch-v1";
const audit=auditGeoSoi001Cp011ReviewBatchV1();if(!audit.valid)throw new Error(audit.issues.join(" | "));
const outDir=path.resolve(process.cwd(),"dist/geography-review/GEO-SOI-001-CP011-V1");fs.mkdirSync(outDir,{recursive:true});
const letters=["A","B","C","D"];const lines=["# GEO-SOI-001 CP011 — Soil Erosion & Conservation — Review Batch V1","","Questions: "+audit.questionCount,"Difficulty: Easy "+audit.difficultyCounts.Easy+" / Medium "+audit.difficultyCounts.Medium+" / Hard "+audit.difficultyCounts.Hard,""];
GEO_SOI_001_CP011_REVIEW_BATCH_V1.forEach((q,i)=>{lines.push("## "+(i+1)+". "+q.stem,"",...q.options.map((o,j)=>letters[j]+". "+o),"","**Answer:** "+letters[q.correctIndex]+". "+q.canonicalAnswer,"","**Explanation:** "+q.explanation,"","**Difficulty:** "+q.difficulty,"**QL:** "+q.qlId+" — "+q.qlName,"");});
const name="GEO-SOI-001-CP011-REVIEW-BATCH-V1";fs.writeFileSync(path.join(outDir,name+".md"),lines.join("\n"));fs.writeFileSync(path.join(outDir,name+".json"),JSON.stringify({audit,questions:GEO_SOI_001_CP011_REVIEW_BATCH_V1},null,2));
