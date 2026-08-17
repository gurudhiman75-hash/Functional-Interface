import fs from "node:fs";
import path from "node:path";
import { MEN_CP_012_DISCOVERY_V2_DEFINITIONS } from "./discovery-v2";
import { auditMenCp012DiscoveryV2Review, buildMenCp012DiscoveryV2Review } from "./discovery-v2-review";

const review = buildMenCp012DiscoveryV2Review();
const audit = auditMenCp012DiscoveryV2Review();
const outputDir = path.resolve(process.cwd(), "dist/quant-v4");
fs.mkdirSync(outputDir, { recursive: true });

const records = review.map((question) => {
  const definition = MEN_CP_012_DISCOVERY_V2_DEFINITIONS.find((row) => row.id === question.id)!;
  return {
    id: question.id,
    clusterHint: question.clusterHint,
    disposition: question.disposition,
    dispositionReason: definition.reason,
    seed: question.seed,
    stem: question.stem,
    options: question.options,
    answer: question.answer,
    explanation: question.explanation,
    verification: question.verification,
  };
});

const evidence = {
  authority: "MEN-CP012-DISCOVERY-WAVE-02-REVIEW-V1",
  status: "EXECUTABLE_DISCOVERY__MERGE_SPLIT_OPEN__NO_PERMANENT_QLS__PRODUCT_LOCKED",
  audit,
  definitions: MEN_CP_012_DISCOVERY_V2_DEFINITIONS,
  records,
};

fs.writeFileSync(path.join(outputDir, "men-cp012-discovery-wave02.json"), JSON.stringify(evidence, null, 2));

const md = [
  "# MEN-CP-012 Discovery Wave 02 Review",
  "",
  `- Candidates: ${MEN_CP_012_DISCOVERY_V2_DEFINITIONS.length}`,
  `- Review records: ${review.length}`,
  `- Unique stems: ${audit.uniqueStemCount}`,
  `- Answer positions: A=${audit.correctPositions.A}, B=${audit.correctPositions.B}, C=${audit.correctPositions.C}, D=${audit.correctPositions.D}`,
  `- Product locked: ${audit.productLocked}`,
  "",
  ...records.flatMap((record, index) => [
    `## ${index + 1}. ${record.id}`,
    "",
    `**Cluster hint:** ${record.clusterHint}`,
    `**Provisional disposition:** ${record.disposition}`,
    `**Why:** ${record.dispositionReason}`,
    "",
    record.stem,
    "",
    ...record.options.map((option) => `- ${option.label}. ${option.display}${option.isCorrect ? " **✓**" : ""}`),
    "",
    `**Answer:** ${record.answer}`,
    "",
    ...record.explanation.steps.map((step) => `- **${step.title}:** ${step.body}`),
    "",
    `**Traps:** ${record.explanation.traps.join(" | ")}`,
    "",
  ]),
].join("\n");

fs.writeFileSync(path.join(outputDir, "men-cp012-discovery-wave02.md"), md);
console.log(JSON.stringify({ outputDir, audit }, null, 2));
