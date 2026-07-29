import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { CLS_CP002_PROTOTYPES } from "./relation-registry";
import { generateClsCp002Prototype } from "./runtime";

const outputDir = path.resolve(process.cwd(), "dist/reasoning-v1/cls-001/cp002-review");

const rows = CLS_CP002_PROTOTYPES.flatMap((prototype, prototypeIndex) =>
  ([4, 5] as const).flatMap((optionCount, optionCountIndex) =>
    Array.from({ length: 12 }, (_, sampleIndex) => {
      const seed = prototypeIndex * 10_000 + optionCountIndex * 1_000 + sampleIndex * 19;
      return generateClsCp002Prototype(prototype.prototypeId, seed, optionCount);
    }),
  ),
);

const markdown = [
  "# CLS-CP-002 Semantic Relationship-Pair Discovery Review",
  "",
  `Questions: ${rows.length}`,
  `Temporary prototypes: ${CLS_CP002_PROTOTYPES.length}`,
  "Permanent QLs: 0",
  "Locale: en-IN",
  "Question Studio: disabled",
  "Question Bank: disabled",
  "Test/publication eligibility: disabled",
  "",
  ...rows.flatMap((question, index) => [
    `## ${index + 1}. ${question.prototypeId} · ${question.difficulty}`,
    "",
    `**Question:** ${question.stem}`,
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
    `- Intended relation: ${question.intendedRelationLabel}`,
    `- Source control: ${question.prototypeId}`,
    `- Generation profile: ${question.generationProfile}`,
    `- Odd-pair kind: ${question.metadata.oddPairKind}`,
    `- Option count: ${question.options.length}`,
    `- Ambiguity result: ${question.ambiguityAudit.result}`,
    `- Difficulty score: ${question.difficultyFeatures.score}`,
    `- Difficulty features: \`${JSON.stringify(question.difficultyFeatures)}\``,
    `- Source facts: ${question.metadata.sourceRelationFactIds.join(", ")}`,
    "",
    "</details>",
    "",
    "---",
    "",
  ]),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "cls-cp002-semantic-pair-discovery-review.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDir, "cls-cp002-semantic-pair-discovery-review.md"),
  `${markdown}\n`,
  "utf8",
);

console.log("CLS-CP-002 semantic pair discovery review written.", {
  outputDir,
  questions: rows.length,
  prototypes: CLS_CP002_PROTOTYPES.length,
  optionCounts: Object.fromEntries(
    [4, 5].map((count) => [count, rows.filter((question) => question.options.length === count).length]),
  ),
  difficulties: Object.fromEntries(
    ["EASY", "MEDIUM", "HARD"].map((difficulty) => [
      difficulty,
      rows.filter((question) => question.difficulty === difficulty).length,
    ]),
  ),
});
