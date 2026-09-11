import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { auditGeoRiv001Cp014ReviewBatchV1, GEO_RIV_001_CP014_REVIEW_BATCH_V1 } from "./geo-riv-001-cp014-review-batch-v1";

const audit=auditGeoRiv001Cp014ReviewBatchV1();
if(!audit.valid) throw new Error(`Cannot export invalid CP014 batch: ${audit.issues.join(" | ")}`);
const outDir=join(process.cwd(),"dist/geography-review/GEO-RIV-001-CP014-V1");mkdirSync(outDir,{recursive:true});
const letters=["A","B","C","D"];
const md=["# GEO-RIV-001-CP014 — Multi-fact / Statement / Match Tasks","",`Questions: ${GEO_RIV_001_CP014_REVIEW_BATCH_V1.length}`,`Answer positions: A ${audit.positions[0]} · B ${audit.positions[1]} · C ${audit.positions[2]} · D ${audit.positions[3]}`,`Difficulty: ${Object.entries(audit.difficulty).map(([k,v])=>`${k} ${v}`).join(" · ")}`,"","Review-only. Not registered for runtime or Question Bank publication.",""];
for(const [i,q] of GEO_RIV_001_CP014_REVIEW_BATCH_V1.entries()){md.push(`## ${i+1}. ${q.qlId} — ${q.qlName}`,"",q.stem,"",...q.options.map((o,j)=>`${letters[j]}. ${o}`),"",`**Answer:** ${letters[q.correctIndex]}. ${q.canonicalAnswer}`,"",`**Explanation:** ${q.explanation}`,"",`**Difficulty:** ${q.difficulty}`,`**Sources:** ${q.sourceIds.join(", ")}`,"");}
writeFileSync(join(outDir,"GEO-RIV-001-CP014-REVIEW-BATCH-V1.md"),md.join("\n"));
writeFileSync(join(outDir,"GEO-RIV-001-CP014-REVIEW-BATCH-V1.json"),JSON.stringify({audit,questions:GEO_RIV_001_CP014_REVIEW_BATCH_V1},null,2));
const html=`<!doctype html><meta charset="utf-8"><title>CP014 Review</title><body><pre>${md.join("\n").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}</pre></body>`;writeFileSync(join(outDir,"GEO-RIV-001-CP014-REVIEW-BATCH-V1.html"),html);
console.log(outDir);
