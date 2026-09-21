import fs from "node:fs";
import path from "node:path";
import { HIS_CP017_REVIEW_BATCH_V1,auditHisCp017ReviewBatchV1 } from "./his-cp017-review-v1";
const audit=auditHisCp017ReviewBatchV1();
if(!audit.valid)throw new Error(`HIS-CP-017 export blocked: ${audit.issues.join(" | ")}`);
const outDir=path.resolve(process.cwd(),"dist/history-review/HIS-001-CP017-V1");
fs.mkdirSync(outDir,{recursive:true});
const letters=["A","B","C","D"];
const lines:string[]=[
"# HIS-CP-017 — Ancient Coverage Gaps: Chalcolithic Cultures & Rise of Magadha — Review Batch V1","",
`**Questions:** ${audit.questionCount}  `,
`**Canonical facts used:** ${audit.requiredFactCount} / ${audit.canonicalFactCount}  `,
`**Difficulty:** Easy ${audit.difficultyCounts.Easy} · Medium ${audit.difficultyCounts.Medium} · Hard ${audit.difficultyCounts.Hard}  `,
`**Answer positions:** A ${audit.answerPositions[0]} · B ${audit.answerPositions[1]} · C ${audit.answerPositions[2]} · D ${audit.answerPositions[3]}`,
"","> Review-only checkpoint. Not registered for Question Studio runtime or Question Bank persistence.","","---",""
];
HIS_CP017_REVIEW_BATCH_V1.forEach((q,index)=>{
  lines.push(
    `## ${index+1}. ${q.stem}`,"",
    ...q.options.map((o,i)=>`${letters[i]}. ${o}`),"",
    `**Answer:** ${letters[q.correctIndex]}. ${q.canonicalAnswer}`,"",
    `**Explanation:** ${q.explanation}`,"",
    `**Difficulty:** ${q.difficulty}`,"",
    `**QL:** ${q.qlId} — ${q.qlName}`,"",
    `**Source facts:** ${q.sourceFactIds.join(", ")}`,"",
    `**Sources:** ${q.sourceIds.join(", ")}`,"","---",""
  );
});
const baseName="HIS-001-CP017-REVIEW-BATCH-V1";
fs.writeFileSync(path.join(outDir,`${baseName}.md`),lines.join("\n"));
fs.writeFileSync(path.join(outDir,`${baseName}.json`),JSON.stringify({audit,questions:HIS_CP017_REVIEW_BATCH_V1},null,2));
console.log(JSON.stringify(audit));
