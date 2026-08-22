import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-effective";

const outputDir = process.env.TSD_CP007_REVIEW_OUTPUT_DIR ?? "/tmp/tsd-cp007-english-review";
mkdirSync(outputDir, { recursive: true });

const lines: string[] = [
  "# TSD-CP-007 Effective English Authoring Review Pack",
  "",
  "Status: **REVIEW_CANDIDATE — NOT FROZEN**",
  "",
  "This is the semantically aligned review surface. It includes the approved CP007 authority boundary and editorial corrections, while Question Studio and learner publication remain disabled.",
  "",
];

for (const ql of TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY) {
  lines.push(`## ${ql.qlId} — ${ql.authorityKey}`, "");
  lines.push(`**Learner contract:** ${ql.learnerContract}`, "");
  lines.push(`**Object / scene pool:** ${ql.objectPool.join(", ")}`, "");
  for (const family of ql.stemFamilies) {
    lines.push(`### ${family.familyId} · ${family.difficulty} · ${family.representation}`, "");
    lines.push(`**Scene:** ${family.scene}`, "");
    lines.push(`**Stem frame:** ${family.stem}`, "");
    lines.push(`**Explanation guide:** ${family.explanationGuide}`, "");
  }
}

const markdownPath = join(outputDir, "TSD-CP007-EFFECTIVE-ENGLISH-AUTHORING-REVIEW.md");
const jsonPath = join(outputDir, "TSD-CP007-EFFECTIVE-ENGLISH-AUTHORING-REVIEW.json");
writeFileSync(markdownPath, `${lines.join("\n")}\n`, "utf8");
writeFileSync(jsonPath, `${JSON.stringify(TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS",
  checkpoint: "TSD-CP-007",
  englishStatus: "REVIEW_CANDIDATE",
  qls: TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY.length,
  stemFamilies: TSD_CP007_EFFECTIVE_ENGLISH_AUTHORING_REGISTRY.reduce((sum, ql) => sum + ql.stemFamilies.length, 0),
  semanticCorrectionsApplied: ["91-D", "94-E"],
  markdownPath,
  jsonPath,
  questionStudioEnabled: false,
}, null, 2));
