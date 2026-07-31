import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { CLS_CP004_PROTOTYPES } from "./number-domain";
import { generateClsCp004Prototype } from "./runtime";

const outputDir = path.resolve(process.cwd(), "dist/reasoning-v1/cls-001/cp004-review");
const rows = CLS_CP004_PROTOTYPES.flatMap((prototype) =>
  ([4, 5] as const).flatMap((optionCount) =>
    Array.from({ length: 6 }, (_, seed) =>
      generateClsCp004Prototype(prototype.prototypeId, seed, optionCount),
    ),
  ),
);

const markdown = [
  "# CLS-CP-004 Number-Property Discovery Review",
  "",
  `Questions: ${rows.length}`,
  `Temporary prototypes: ${CLS_CP004_PROTOTYPES.length}`,
  "Permanent QLs: 0",
  "Locale: en-IN discovery only",
  "Domain: positive integers 2 to 999",
  "Arbitrary polynomial fitting: prohibited",
  "Source saturation: open; uploaded-book search must be retried",
  "Question Studio: disabled",
  "Question Bank: disabled",
  "Test/publication eligibility: disabled",
  "",
  ...rows.flatMap((question, index) => [
    `## ${index + 1}. ${question.prototypeId} · ${question.difficulty} · ${question.options.length} options`,
    "",
    `**Question:** ${question.stem}`,
    "",
    "**Options:**",
    "",
    ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`),
    "",
    `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
    "",
    "### 📌 Core Concept",
    "",
    question.explanation.coreConcept.join(" "),
    "",
    "### 📝 Step-by-Step Solution",
    "",
    ...question.explanation.stepByStep.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
    "",
    "### ⚡ Exam Speed Shortcut",
    "",
    question.explanation.examSpeedShortcut.join(" "),
    "",
    "### ⚠️ Common Trap",
    "",
    question.explanation.commonTrapWarning.join(" "),
    "",
    "<details>",
    "<summary>Reviewer metadata</summary>",
    "",
    `- Seed: ${question.seed}`,
    `- Generation profile: ${question.generationProfile}`,
    `- Intended rule: ${question.intendedRuleId}`,
    `- Intended value: ${question.intendedRuleValue}`,
    `- Numbers: ${question.numbers.join(", ")}`,
    `- Audit: ${question.ambiguityAudit.result}`,
    `- Candidate rule count: ${question.ambiguityAudit.candidateSupports.length}`,
    `- Candidate supports: \`${JSON.stringify(question.ambiguityAudit.candidateSupports)}\``,
    `- Difficulty features: \`${JSON.stringify(question.difficultyFeatures)}\``,
    `- Permanent QL: ${question.lifecycle.permanentQlId}`,
    `- Source saturation: ${question.metadata.sourceSaturationStatus}`,
    "",
    "</details>",
    "",
    "---",
    "",
  ]),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "cls-cp004-number-property-discovery-review.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDir, "cls-cp004-number-property-discovery-review.md"),
  `${markdown}\n`,
  "utf8",
);

console.log("CLS-CP-004 discovery review written.", {
  outputDir,
  questions: rows.length,
  prototypes: new Set(rows.map((question) => question.prototypeId)).size,
  rules: new Set(rows.map((question) => question.intendedRuleId)).size,
  optionCounts: [...new Set(rows.map((question) => question.options.length))].sort(),
  difficulties: [...new Set(rows.map((question) => question.difficulty))].sort(),
  permanentQlCount: 0,
});