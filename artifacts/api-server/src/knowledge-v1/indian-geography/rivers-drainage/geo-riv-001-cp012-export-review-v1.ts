import fs from "node:fs";
import path from "node:path";
import { GEO_RIV_001_CP012_AUTHORITY_V1 } from "./geo-riv-001-cp012-facts";
import { GEO_RIV_001_CP012_REVIEW_BATCH_V1, auditGeoRiv001Cp012ReviewBatchV1 } from "./geo-riv-001-cp012-review-batch-v1";

const outDir=path.resolve(process.cwd(),"dist/geography-review/GEO-RIV-001-CP012-V1");
fs.mkdirSync(outDir,{recursive:true});
const audit=auditGeoRiv001Cp012ReviewBatchV1();
if(!audit.valid) throw new Error(audit.issues.join(", "));
const letters=["A","B","C","D"];
const lines:string[]=["# GEO-RIV-001 CP012 — Important Cities/Places on Rivers — Review Batch V1","","**Lifecycle:** Review-only. No freeze or Question Studio registration until explicit human approval.  ","**Relation rule:** `city_on_river` means a stable, source-backed conventional city–river association; it is not inferred from basin membership.  ","**Learner-facing river naming:** Proper river names use the `River + name` form.  ",`**Cities:** ${GEO_RIV_001_CP012_AUTHORITY_V1.cityCount}  `,`**Canonical relations:** ${GEO_RIV_001_CP012_AUTHORITY_V1.relationCount}  `,`**Questions:** ${audit.questionCount}  `,`**Difficulty:** Easy ${audit.difficultyCounts.Easy} · Medium ${audit.difficultyCounts.Medium} · Hard ${audit.difficultyCounts.Hard}  `,`**Answer positions:** A ${audit.answerPositions[0]} · B ${audit.answerPositions[1]} · C ${audit.answerPositions[2]} · D ${audit.answerPositions[3]}  `,""];
let current="";
GEO_RIV_001_CP012_REVIEW_BATCH_V1.forEach((q,index)=>{if(q.qlId!==current){current=q.qlId;lines.push(`## ${q.qlId} — ${q.qlName}`,"");}lines.push(`### ${index+1}. ${q.stem}`,"");q.options.forEach((o,i)=>lines.push(`${letters[i]}. ${o}`));lines.push("",`**Answer:** ${letters[q.correctIndex]}. ${q.canonicalAnswer}`,"",`**Explanation:** ${q.explanation}`,"",`**Difficulty:** ${q.difficulty}`,"",`**Source facts:** ${q.sourceFactIds.join(", ")}`,"","---","");});
const markdown=lines.join("\n");
fs.writeFileSync(path.join(outDir,"GEO-RIV-001-CP012-REVIEW-BATCH-V1.md"),markdown);
fs.writeFileSync(path.join(outDir,"GEO-RIV-001-CP012-REVIEW-BATCH-V1.json"),JSON.stringify({authority:GEO_RIV_001_CP012_AUTHORITY_V1,audit,questions:GEO_RIV_001_CP012_REVIEW_BATCH_V1},null,2));
const escaped=markdown.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
fs.writeFileSync(path.join(outDir,"GEO-RIV-001-CP012-REVIEW-BATCH-V1.html"),`<!doctype html><html><head><meta charset="utf-8"><title>CP012 Review V1</title></head><body><pre>${escaped}</pre></body></html>`);
console.log(JSON.stringify(audit));
