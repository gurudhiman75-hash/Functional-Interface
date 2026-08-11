import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateIntCp001Prototype } from "./foundation/cp001-pipeline";
import { INT_CP001_PROTOTYPE_IDS } from "./foundation/types";

function serialise(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

const reviewItems = INT_CP001_PROTOTYPE_IDS.flatMap((prototypeId) =>
  ["review-a", "review-b", "review-c"].map((seed) => generateIntCp001Prototype(prototypeId, seed)),
);

for (const item of reviewItems) {
  if (!item.validation.ok) {
    throw new Error(`${item.prototypeId}/${item.seed}: ${item.validation.errors.join(" | ")}`);
  }
}

const outputDirectory = path.join(process.cwd(), "dist", "quant-v4");
await mkdir(outputDirectory, { recursive: true });

const jsonPath = path.join(outputDirectory, "int-001-cp001-prototype-review.json");
const markdownPath = path.join(outputDirectory, "int-001-cp001-prototype-review.md");

await writeFile(
  jsonPath,
  serialise({
    generatedAt: new Date().toISOString(),
    chapterId: "INT-001",
    cpId: "INT-CP-001",
    status: "REVIEW_ONLY_NON_QL_PROTOTYPES",
    permanentQlCount: 0,
    prototypeCount: INT_CP001_PROTOTYPE_IDS.length,
    sampleCount: reviewItems.length,
    items: reviewItems,
  }),
  "utf8",
);

const markdown: string[] = [
  "# INT-001 / CP-001 English Prototype Review Pack",
  "",
  "Status: **review-only, non-QL, unpublished**",
  "",
  `Prototype contracts: **${INT_CP001_PROTOTYPE_IDS.length}**`,
  `Samples: **${reviewItems.length}**`,
  "Permanent QLs: **0**",
  "",
  "---",
  "",
];

for (const [index, item] of reviewItems.entries()) {
  markdown.push(
    `## ${index + 1}. ${item.prototypeId} — ${item.seed}`,
    "",
    `- Difficulty: **${item.difficulty}**`,
    `- Direction: **${item.taskDirection}**`,
    `- Answer semantic: **${item.answerSemantic}**`,
    `- Context: **${item.parameters.context.scenarioId}**`,
    `- Correct option: **${item.correctIndex + 1}**`,
    `- Lifecycle: **${item.reviewStatus} / ${item.questionBankStatus} / ${item.testEligibility}**`,
    "",
    `> ${item.stem}`,
    "",
    ...item.options.map((option, optionIndex) =>
      `${optionIndex + 1}. ${option}${optionIndex === item.correctIndex ? "  **← correct**" : ""}`
    ),
    "",
    "### Difficulty evidence",
    "",
    ...item.difficultyEvidence.map((evidence) => `- ${evidence}`),
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
    ...item.optionAudit.map((option, optionIndex) =>
      `- ${optionIndex + 1}: ${option.text} — \`${option.misconceptionId}\``
    ),
    "",
    "### Independent proof",
    "",
    `- Validation: **${item.validation.ok ? "PASS" : "FAIL"}**`,
    `- Matching inverse candidates: ${item.validation.matchingCandidates?.join(", ") || "direct verification"}`,
    `- Mathematical fingerprint: \`${item.mathematicalFingerprint}\``,
    "",
    "---",
    "",
  );
}

await writeFile(markdownPath, markdown.join("\n"), "utf8");

console.log(JSON.stringify({
  status: "PASS",
  jsonPath,
  markdownPath,
  sampleCount: reviewItems.length,
  permanentQlCount: 0,
}, null, 2));
