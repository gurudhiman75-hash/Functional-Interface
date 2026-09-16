import fs from "node:fs";
import path from "node:path";
import { GEO_CLI_001_CP005_REVIEW_BATCH_V1, auditGeoCli001Cp005ReviewBatchV1 } from "./geo-cli-001-cp005-review-batch-v1";

const audit=auditGeoCli001Cp005ReviewBatchV1();
if(!audit.valid) throw new Error(`GEO-CLI-001 CP005 V1 export blocked: ${audit.issues.join(" | ")}`);
const outDir=path.resolve(process.cwd(),"dist/geography-review/GEO-CLI-001-CP005-V1");
fs.mkdirSync(outDir,{recursive:true});
const letters=["A","B","C","D"];
const lines:string[]=[
  "# GEO-CLI-001 CP005 — Advancing Southwest Monsoon — Review Batch V1","",
  `Question count: ${audit.questionCount}`,
  `Difficulty: Easy ${audit.difficultyCounts.Easy} / Medium ${audit.difficultyCounts.Medium} / Hard ${audit.difficultyCounts.Hard}`,
  `Answer positions: A${audit.answerPositions[0]} / B${audit.answerPositions[1]} / C${audit.answerPositions[2]} / D${audit.answerPositions[3]}`,""
];
GEO_CLI_001_CP005_REVIEW_BATCH_V1.forEach((q,index)=>{
  lines.push(`## ${index+1}. ${q.stem}`,"",...q.options.map((o,i)=>`${letters[i]}. ${o}`),"",`**Answer:** ${letters[q.correctIndex]}. ${q.canonicalAnswer}`,"",`**Explanation:** ${q.explanation}`,"",`**Difficulty:** ${q.difficulty}`,`**QL:** ${q.qlId} — ${q.qlName}`,"");
});
const baseName="GEO-CLI-001-CP005-REVIEW-BATCH-V1";
fs.writeFileSync(path.join(outDir,`${baseName}.md`),lines.join("\n"));
fs.writeFileSync(path.join(outDir,`${baseName}.json`),JSON.stringify({audit,questions:GEO_CLI_001_CP005_REVIEW_BATCH_V1},null,2));
console.log(JSON.stringify(audit));
