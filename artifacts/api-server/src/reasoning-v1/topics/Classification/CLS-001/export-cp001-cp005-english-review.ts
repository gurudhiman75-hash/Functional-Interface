import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateClsCp001EnglishQuestion } from "./CLS-CP-001/cp001-runtime";
import { generateClsCp002EnglishQuestion } from "./CLS-CP-002/cp002-permanent-runtime";
import { generateClsCp003EnglishQuestion } from "./CLS-CP-003/cp003-english-runtime";
import { generateClsCp004EnglishQuestion } from "./CLS-CP-004/cp004-english-runtime";
import { generateClsCp005EnglishQuestion } from "./CLS-CP-005/cp005-english-runtime";

const outputDir = path.resolve(
  process.cwd(),
  "dist/reasoning-v1/cls-001/cp001-cp005-english-review",
);

const rows = [
  ...(["CLS-QL-001", "CLS-QL-002", "CLS-QL-003"] as const).flatMap((qlId, qlIndex) =>
    Array.from({ length: 16 }, (_, index) =>
      generateClsCp001EnglishQuestion(qlId, 10_000 + qlIndex * 1_000 + index * 17),
    ),
  ),
  ...Array.from({ length: 20 }, (_, seed) =>
    generateClsCp002EnglishQuestion("CLS-QL-004", seed),
  ),
  ...Array.from({ length: 24 }, (_, seed) =>
    generateClsCp003EnglishQuestion("CLS-QL-005", seed),
  ),
  ...Array.from({ length: 16 }, (_, seed) =>
    generateClsCp003EnglishQuestion("CLS-QL-006", seed),
  ),
  ...Array.from({ length: 40 }, (_, seed) =>
    generateClsCp004EnglishQuestion("CLS-QL-007", seed),
  ),
  ...Array.from({ length: 70 }, (_, seed) =>
    generateClsCp005EnglishQuestion("CLS-QL-008", seed),
  ),
  ...Array.from({ length: 120 }, (_, seed) =>
    generateClsCp005EnglishQuestion("CLS-QL-009", seed),
  ),
];

function stringField(value: unknown): string {
  return typeof value === "string" ? value : "—";
}

function stringArray(value: unknown): readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
    ? value
    : [];
}

function recordValue(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? value as Record<string, unknown>
    : {};
}

function metadataValue(question: (typeof rows)[number], key: string): string {
  return stringField(recordValue(question.metadata)[key]);
}

function propertyValue(question: (typeof rows)[number], key: string): string {
  return stringField(recordValue(question)[key]);
}

function explanationBlocks(question: (typeof rows)[number]) {
  const explanation = recordValue(question.explanation);
  const core = stringArray(explanation.coreConcept).length > 0
    ? stringArray(explanation.coreConcept)
    : stringArray(explanation.coreRule);
  const steps = stringArray(explanation.stepByStep).length > 0
    ? stringArray(explanation.stepByStep)
    : stringArray(explanation.optionChecks);
  const shortcut = stringArray(explanation.examSpeedShortcut);
  const trap = stringArray(explanation.commonTrapWarning).length > 0
    ? stringArray(explanation.commonTrapWarning)
    : stringArray(explanation.commonTraps);
  if (core.length === 0 || steps.length === 0 || shortcut.length === 0 || trap.length === 0) {
    throw new Error(`${question.qlId}/${question.seed} has an incomplete learner explanation`);
  }
  return { core, steps, shortcut, trap };
}

function ambiguityResult(question: (typeof rows)[number]): string {
  const record = recordValue(question);
  const expanded = recordValue(record.expandedAmbiguityAudit);
  if (typeof expanded.result === "string") return expanded.result;
  const standard = recordValue(record.ambiguityAudit);
  return stringField(standard.result);
}

function difficultyFeatures(question: (typeof rows)[number]): string {
  const value = recordValue(question).difficultyFeatures;
  return value === undefined ? "—" : JSON.stringify(value);
}

const qlCounts = Object.fromEntries(
  [...new Set(rows.map((question) => question.qlId))]
    .sort()
    .map((qlId) => [qlId, rows.filter((question) => question.qlId === qlId).length]),
);

const checkpointCounts = Object.fromEntries(
  [...new Set(rows.map((question) => question.checkpointId))]
    .sort()
    .map((checkpointId) => [
      checkpointId,
      rows.filter((question) => question.checkpointId === checkpointId).length,
    ]),
);

const markdown = [
  "# CLS-001 English Question Review — CP-001 to CP-005",
  "",
  `Questions: ${rows.length}`,
  `Permanent QLs: ${Object.keys(qlCounts).length}`,
  `Checkpoints: ${Object.keys(checkpointCounts).join(", ")}`,
  "Locale: en-IN",
  "Question Studio: disabled",
  "Question Bank: disabled",
  "Test/publication eligibility: disabled",
  "",
  "## Inventory",
  "",
  "| QL | Questions |",
  "|---|---:|",
  ...Object.entries(qlCounts).map(([qlId, count]) => `| ${qlId} | ${count} |`),
  "",
  "| Checkpoint | Questions |",
  "|---|---:|",
  ...Object.entries(checkpointCounts).map(
    ([checkpointId, count]) => `| ${checkpointId} | ${count} |`,
  ),
  "",
  ...rows.flatMap((question, index) => {
    const explanation = explanationBlocks(question);
    return [
      `## ${index + 1}. ${question.qlId} · ${question.checkpointId} · ${question.difficulty}`,
      "",
      `**Question:** ${question.stem}`,
      "",
      "**Options:**",
      "",
      ...question.options.map(
        (option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`,
      ),
      "",
      `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
      "",
      "### 📌 Core Concept",
      "",
      explanation.core.join(" "),
      "",
      "### 📝 Step-by-Step Solution",
      "",
      ...explanation.steps.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
      "",
      "### ⚡ Exam Speed Shortcut",
      "",
      explanation.shortcut.join(" "),
      "",
      "### ⚠️ Common Trap",
      "",
      explanation.trap.join(" "),
      "",
      "<details>",
      "<summary>Reviewer metadata</summary>",
      "",
      `- Seed: ${question.seed}`,
      `- Source prototype: ${metadataValue(question, "sourcePrototypeId")}`,
      `- Solve contract: ${metadataValue(question, "solveContractId")}`,
      `- Runtime: ${metadataValue(question, "runtimeVersion")}`,
      `- Option count: ${question.options.length}`,
      `- Intended class/relation/rule: ${propertyValue(question, "intendedClassId") !== "—" ? propertyValue(question, "intendedClassId") : propertyValue(question, "intendedRelationId") !== "—" ? propertyValue(question, "intendedRelationId") : propertyValue(question, "intendedRuleId")}`,
      `- Ambiguity result: ${ambiguityResult(question)}`,
      `- Difficulty features: \`${difficultyFeatures(question)}\``,
      "",
      "</details>",
      "",
      "---",
      "",
    ];
  }),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "cls-001-cp001-cp005-english-review.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDir, "cls-001-cp001-cp005-english-review.md"),
  `${markdown}\n`,
  "utf8",
);

console.log("CLS-001 CP-001 to CP-005 English review written.", {
  outputDir,
  questions: rows.length,
  qlCounts,
  checkpointCounts,
  optionCounts: [...new Set(rows.map((question) => question.options.length))].sort(),
  difficulties: [...new Set(rows.map((question) => question.difficulty))].sort(),
});
