import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { INT_CP001_EDITORIAL_RELEASE_ID, INT_CP001_EDITORIAL_STANDARD } from "./cp001-editorial-release";
import { INT_CP001_FINAL_QL_IDS } from "./cp001-final-registry";
import { generateIntCp001FinalEditorialV3Question } from "./cp001-final-editorial-runtime-v3";

function serialise(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

const items = INT_CP001_FINAL_QL_IDS.flatMap((qlId) =>
  ["review-a", "review-b", "review-c"].map((seed) => generateIntCp001FinalEditorialV3Question(qlId, seed)),
);
for (const item of items) {
  if (!item.validation.ok) throw new Error(`${item.qlId}/${item.seed}: ${item.validation.errors.join(" | ")}`);
  if (item.releaseId !== INT_CP001_EDITORIAL_RELEASE_ID) throw new Error(`${item.qlId}/${item.seed}: editorial release ID mismatch.`);
}

const outputDirectory = path.join(process.cwd(), "dist", "quant-v4");
await mkdir(outputDirectory, { recursive: true });
const jsonPath = path.join(outputDirectory, "int-001-cp001-final-review.json");
const markdownPath = path.join(outputDirectory, "int-001-cp001-final-review.md");

await writeFile(jsonPath, serialise({
  generatedAt: new Date().toISOString(),
  packageId: "INT-001",
  cpId: "INT-CP-001",
  releaseId: INT_CP001_EDITORIAL_RELEASE_ID,
  editorialStandard: INT_CP001_EDITORIAL_STANDARD,
  status: "FROZEN_ENGLISH_CONTRACT_REVIEW_ONLY",
  finalQlCount: INT_CP001_FINAL_QL_IDS.length,
  sampleCount: items.length,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  items,
}), "utf8");

const markdown: string[] = [
  "# INT-001 / CP-001 Final English Review Pack — Four-Tier Gold V3",
  "",
  `Release: **${INT_CP001_EDITORIAL_RELEASE_ID}**`,
  "",
  "Status: **frozen English solve contracts; editorial-v3 review-only and unpublished**",
  "",
  `Permanent QLs: **${INT_CP001_FINAL_QL_IDS.length}**`,
  `Samples: **${items.length}**`,
  "",
  "Every explanation follows: 📌 Core Concept & Formula → 📝 Step-by-Step Solution → ⚡ Exam Speed Shortcut → ⚠️ Common Traps & Distractor Analysis.",
  "",
  "V3 adds uniform inline MathJax for fractions and variables plus light exam-realistic context for generic textbook stems.",
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
    `> **Question:** ${item.stem}`,
    "",
    ...item.options.map((option, optionIndex) => `${optionIndex + 1}. ${option}${optionIndex === item.correctIndex ? "  **← correct**" : ""}`),
    "",
    `### ${item.explanation.coreConcept.heading}`,
    "",
    item.explanation.coreConcept.narrative,
    "",
    item.explanation.coreConcept.displayMath,
    "",
    `### ${item.explanation.stepByStep.heading}`,
    "",
    ...item.explanation.stepByStep.steps.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
    "",
    `**Verification:** ${item.explanation.stepByStep.verification}`,
    "",
    `**Answer:** ${item.explanation.stepByStep.conclusion}`,
    "",
    `### ${item.explanation.examShortcut.heading}`,
    "",
    item.explanation.examShortcut.narrative,
    "",
    item.explanation.examShortcut.displayMath,
    "",
    `### ${item.explanation.trapAnalysis.heading}`,
    "",
    ...item.explanation.trapAnalysis.items.map((trap) =>
      `- **Option ${trap.optionNumber} (${trap.optionText}) [${trap.misconceptionId}]:** ${trap.explanation}`
    ),
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
  releaseId: INT_CP001_EDITORIAL_RELEASE_ID,
  editorialStandard: INT_CP001_EDITORIAL_STANDARD,
  finalQlCount: INT_CP001_FINAL_QL_IDS.length,
  sampleCount: items.length,
  jsonPath,
  markdownPath,
  publiclyPublishable: false,
}, null, 2));
