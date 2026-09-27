import fs from "node:fs";
import path from "node:path";
import { GEO_MIN_001_CP007_REVIEW_BATCH_V1, auditGeoMin001Cp007ReviewBatchV1 } from "./geo-min-001-cp007-review-batch-v1";
const a=auditGeoMin001Cp007ReviewBatchV1(); if(!a.valid) throw new Error(a.issues.join(" | "));
const outDir=path.resolve(process.cwd(),"dist/geography-review/GEO-MIN-001-CP007-V1");
fs.mkdirSync(outDir,{recursive:true});
const letters=["A","B","C","D"];
const lines=["# GEO-MIN-001 CP007 — Petroleum & Natural Gas — Review Batch V1","",
"Questions: "+a.questionCount,"Permanent QLs: "+a.permanentQlCount,
"Difficulty: Easy "+a.difficultyCounts.Easy+" / Medium "+a.difficultyCounts.Medium+" / Hard "+a.difficultyCounts.Hard,""];
GEO_MIN_001_CP007_REVIEW_BATCH_V1.forEach((q,i)=>lines.push("## "+(i+1)+". "+q.stem,"",...q.options.map((o,j)=>letters[j]+". "+o),"","**Answer:** "+letters[q.correctIndex]+". "+q.canonicalAnswer,"","**Explanation:** "+q.explanation,"","**Difficulty:** "+q.difficulty,"**QL:** "+q.qlId+" — "+q.qlName,""));
fs.writeFileSync(path.join(outDir,"GEO-MIN-001-CP007-REVIEW-BATCH-V1.md"),lines.join("\n"));
