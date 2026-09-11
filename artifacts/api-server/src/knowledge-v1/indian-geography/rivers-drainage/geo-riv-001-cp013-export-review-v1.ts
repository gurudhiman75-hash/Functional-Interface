import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { GEO_RIV_001_CP013_REVIEW_BATCH_V1, auditGeoRiv001Cp013ReviewBatchV1 } from "./geo-riv-001-cp013-review-batch-v1";

const out=resolve("dist/geography-review/GEO-RIV-001-CP013-V1");
await mkdir(out,{recursive:true});
const audit=auditGeoRiv001Cp013ReviewBatchV1();
if(!audit.valid)throw new Error(audit.issues.join("\n"));
const qs=GEO_RIV_001_CP013_REVIEW_BATCH_V1;
const md=["# GEO-RIV-001 CP013 — River Comparisons & Classification — Review Batch V1","",`Questions: ${qs.length}`,`Answer positions: A ${audit.positions[0]} · B ${audit.positions[1]} · C ${audit.positions[2]} · D ${audit.positions[3]}`,`Difficulty: ${Object.entries(audit.difficulty).map(([k,v])=>`${k} ${v}`).join(" · ")}`,"","Status: REVIEW-ONLY — not runtime registered.","",...qs.flatMap((q,i)=>[`## ${i+1}. ${q.qlId} — ${q.qlName} [${q.difficulty}]`,"",q.stem,"",...q.options.map((o,j)=>`${String.fromCharCode(65+j)}. ${o}`),"",`**Answer:** ${String.fromCharCode(65+q.correctIndex)}. ${q.canonicalAnswer}`,"",`**Explanation:** ${q.explanation}`,"",`**Sources:** ${q.sourceIds.join(", ")}`,""])].join("\n");
const html=`<!doctype html><html><head><meta charset="utf-8"><title>CP013 Review</title><style>body{font-family:system-ui;max-width:900px;margin:40px auto;line-height:1.5;padding:0 20px}pre{white-space:pre-wrap}</style></head><body><pre>${md.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}</pre></body></html>`;
await writeFile(resolve(out,"GEO-RIV-001-CP013-REVIEW-BATCH-V1.md"),md);
await writeFile(resolve(out,"GEO-RIV-001-CP013-REVIEW-BATCH-V1.json"),JSON.stringify({audit,questions:qs},null,2));
await writeFile(resolve(out,"GEO-RIV-001-CP013-REVIEW-BATCH-V1.html"),html);
console.log(JSON.stringify({out,audit},null,2));
