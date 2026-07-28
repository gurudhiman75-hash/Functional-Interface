import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { INT_CP001_FINAL_QL_IDS, INT_CP001_RELEASE_ID } from "./cp001-final-registry";
import { generateIntCp001FinalQuestion } from "./cp001-final-runtime";

function serialise(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

const items = INT_CP001_FINAL_QL_IDS.flatMap((qlId) =>
  ["review-a", "review-b", "review-c"].map((seed) => generateIntCp001FinalQuestion(qlId, seed)),
);
for (const item of items) {
  if (!item.validation.ok) throw new Error(`${item.qlId}/${item.seed}: ${item.validation.errors.join(" | ")}`);
}

const outputDirectory = path.join(process.cwd(), "dist", "quant-v4");
await mkdir(outputDirectory, { recursive: true });
const jsonPath = path.join(outputDirectory, "int-001-cp001-final-review.json");
const markdownPath = path.join(outputDirectory, "int-001-cp001-final-review.md");

await writeFile(jsonPath, serialise({
  generatedAt: new Date().toISOString(),
  packageId: "INT-001",
  cpId: "INT-CP-001",
  releaseId: INT_CP001_RELEASE_ID,
  status: "FROZEN_ENGLISH_CONTRACT_REVIEW_ONLY",
  finalQlCount: INT_CP001_FINAL_QL_IDS.length,
  sampleCount: items.length,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  items,
}), "utf8");

const markdown: string[] = [
  "# INT-001 / CP-001 Final English Review Pack",
  "",
  `Release: **${INT_CP001_RELEASE_ID}**`,
  "",
  "Status: **frozen English solve contracts; review-only and unpublished**",
  "",
  `Permanent QLs: **${INT_CP001_FINAL_QL_IDS.length}**`,
  `Samples: **${items.length}**`,
  "",
  "---",
  "",
];

for (const [index, item] of items.entries()) {
  markdown.push(
    `## ${index + 1}. ${item.qlId} — ${item.solveContract}`,
    "",
    `- Seed: **${item.seed}**`,
    `- Difficulty: **${item.difficulty}**`,
    `- Topology: **${item.topology}**`,
    `- Answer semantic: **${item.answerSemantic}**`,
    `- Representation: **${item.internalProvenance.representation ?? "DEFAULT"}**`,
    `- Source kind: **${item.internalProvenance.sourceKind}**`,
    `- Correct option: **${item.correctIndex + 1}**`,
    "",
    `> ${item.stem}`,
    "",
    ...item.options.map((option, optionIndex) => `${optionIndex + 1}. ${option}${optionIndex === item.correctIndex ? "  **← correct**" : ""}`),
    "",
    "### Explanation",
    "",
    `**What to notice:** ${item.explanation.notice}`,
    "",
    `**Relation:** ${item.explanation.relation}`,
    "",
    ...item.explanation.steps.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
    "",
    `**Verification:** ${item.explanation.verification}`,
    "",
    `**Conclusion:** ${item.explanation.conclusion}`,
    "",
    `**Common trap:** ${item.explanation.commonTrap}`,
    "",
    "### Option audit",
    "",
    ...item.optionAudit.map((option, optionIndex) => `- ${optionIndex + 1}: ${option.text} — \`${option.misconceptionId}\``),
    "",
    `Validation: **${item.validation.ok ? "PASS" : "FAIL"}**`,
    "",
    "---",
    "",
  );
}

await writeFile(markdownPath, markdown.join("\n"), "utf8");
console.log(JSON.stringify({
  status: "PASS",
  releaseId: INT_CP001_RELEASE_ID,
  finalQlCount: INT_CP001_FINAL_QL_IDS.length,
  sampleCount: items.length,
  jsonPath,
  markdownPath,
  publiclyPublishable: false,
}, null, 2));
