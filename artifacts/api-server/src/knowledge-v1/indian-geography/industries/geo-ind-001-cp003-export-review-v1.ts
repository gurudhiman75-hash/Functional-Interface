import fs from "node:fs";
import path from "node:path";
import { GEO_IND_001_CP003_REVIEW_BATCH_V1, auditGeoInd001Cp003ReviewBatchV1 } from "./geo-ind-001-cp003-review-batch-v1";
const a=auditGeoInd001Cp003ReviewBatchV1(); if(!a.valid) throw new Error(a.issues.join(" | "));
const out=path.resolve(process.cwd(),"dist/geography-review/GEO-IND-001-CP003-V1");
fs.mkdirSync(out,{recursive:true});
const L=["A","B","C","D"];
const lines=["# GEO-IND-001 CP003 — Cotton, Jute & Textile Geography — Review Batch V1","",
"Questions: "+a.questionCount,"Permanent semantic QLs: "+a.permanentQlCount,""];
GEO_IND_001_CP003_REVIEW_BATCH_V1.forEach((q,i)=>lines.push("## "+(i+1)+". "+q.stem,"",...q.options.map((o,j)=>L[j]+". "+o),"","**Answer:** "+L[q.correctIndex]+". "+q.canonicalAnswer,"","**Explanation:** "+q.explanation,"","**Difficulty:** "+q.difficulty,"**QL:** "+q.qlId+" — "+q.qlName,""));
fs.writeFileSync(path.join(out,"GEO-IND-001-CP003-REVIEW-BATCH-V1.md"),lines.join("\n"));
