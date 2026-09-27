import fs from "node:fs";
import path from "node:path";
import { GEO_MIN_001_CP011_REVIEW_BATCH_V1, auditGeoMin001Cp011ReviewBatchV1 } from "./geo-min-001-cp011-review-batch-v1";
const a=auditGeoMin001Cp011ReviewBatchV1(); if(!a.valid) throw new Error(a.issues.join(" | "));
const out=path.resolve(process.cwd(),"dist/geography-review/GEO-MIN-001-CP011-V1");
fs.mkdirSync(out,{recursive:true});
const L=["A","B","C","D"];
const lines=["# GEO-MIN-001 CP011 — Integrated Resource Maps — Review Batch V1","",
"Questions: "+a.questionCount,"Permanent QLs: "+a.permanentQlCount,""];
GEO_MIN_001_CP011_REVIEW_BATCH_V1.forEach((q,i)=>lines.push("## "+(i+1)+". "+q.stem,"",...q.options.map((o,j)=>L[j]+". "+o),"","**Answer:** "+L[q.correctIndex]+". "+q.canonicalAnswer,"","**Explanation:** "+q.explanation,"","**Difficulty:** "+q.difficulty,"**QL:** "+q.qlId+" — "+q.qlName,""));
fs.writeFileSync(path.join(out,"GEO-MIN-001-CP011-REVIEW-BATCH-V1.md"),lines.join("\n"));
