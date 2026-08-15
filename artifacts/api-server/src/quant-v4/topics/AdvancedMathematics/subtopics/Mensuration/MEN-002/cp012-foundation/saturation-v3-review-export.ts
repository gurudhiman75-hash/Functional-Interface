import fs from "node:fs";
import path from "node:path";
import { MEN_CP_012_SATURATION_V3_DEFINITIONS } from "./saturation-v3";
import { auditMenCp012SaturationV3Review, buildMenCp012SaturationV3Review } from "./saturation-v3-review";

const review=buildMenCp012SaturationV3Review();
const audit=auditMenCp012SaturationV3Review();
const outputDir=path.resolve(process.cwd(),"dist/quant-v4");
fs.mkdirSync(outputDir,{recursive:true});

const records=review.map((q)=>{
  const definition=MEN_CP_012_SATURATION_V3_DEFINITIONS.find((row)=>row.id===q.id)!;
  return {
    id:q.id,cluster:q.cluster,disposition:q.disposition,evidence:q.evidence,reasoning:definition.reasoning,
    seed:q.seed,constructionSeed:q.constructionSeed,stem:q.stem,options:q.options,answer:q.answer,
    explanation:q.explanation,approximation:q.approximation,verification:q.verification,
  };
});
const evidence={
  authority:"MEN-CP012-SATURATION-WAVE-03-REVIEW-V1",
  status:"SOURCE_BACKED_SATURATION__MERGE_SPLIT_PENDING__NO_PERMANENT_QLS__PRODUCT_LOCKED",
  audit,definitions:MEN_CP_012_SATURATION_V3_DEFINITIONS,records,
};
fs.writeFileSync(path.join(outputDir,"men-cp012-saturation-wave03.json"),JSON.stringify(evidence,null,2));

const md=[
  "# MEN-CP-012 Saturation Wave 03 — Source-backed review","",
  `- Candidates: ${MEN_CP_012_SATURATION_V3_DEFINITIONS.length}`,
  `- Review records: ${audit.reviewRecordCount}`,
  `- Unique stems: ${audit.uniqueStemCount}`,
  `- Correct positions: A=${audit.correctPositions.A}, B=${audit.correctPositions.B}, C=${audit.correctPositions.C}, D=${audit.correctPositions.D}`,
  `- Approximation records: ${audit.approximationRecordCount}`,
  "- Permanent QLs: 0","- Product activation: locked","",
  ...records.flatMap((record,index)=>[
    `## ${index+1}. ${record.id}`,"",
    `**Evidence:** ${record.evidence}`,
    `**Cluster:** ${record.cluster}`,
    `**Provisional disposition:** ${record.disposition}`,
    `**Reasoning:** ${record.reasoning}`,"",
    record.stem,"",
    ...record.options.map((o)=>`- ${o.label}. ${o.display}${o.isCorrect?" **✓**":""}`),"",
    `**Answer:** ${record.answer}`,"",
    ...record.explanation.steps.map((s)=>`- **${s.title}:** ${s.body}`),"",
    `**Traps:** ${record.explanation.traps.join(" | ")}`,"",
  ]),
].join("\n");
fs.writeFileSync(path.join(outputDir,"men-cp012-saturation-wave03.md"),md);
console.log(JSON.stringify({outputDir,audit},null,2));
