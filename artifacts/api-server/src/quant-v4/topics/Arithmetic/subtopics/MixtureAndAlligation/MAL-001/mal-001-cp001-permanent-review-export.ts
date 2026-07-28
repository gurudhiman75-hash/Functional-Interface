import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MAL_CP001_PERMANENT_ALLOCATION,
} from "./foundation/cp001-permanent-allocation";
import {
  buildMalCp001PermanentReviewModel,
} from "./foundation/cp001-permanent-review-model";

const model = buildMalCp001PermanentReviewModel();
const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const payload = {
  allocation: MAL_CP001_PERMANENT_ALLOCATION,
  review: model,
};

const jsonPath = resolve(
  outputDirectory,
  "mal-001-cp001-permanent-allocation-review.json",
);
writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const lines: string[] = [
  "# MAL-CP-001 Permanent Allocation Review",
  "",
  `Status: **${model.status}**`,
  "",
  "```text",
  `permanent QL range: ${model.permanentQlRange}`,
  `permanent QLs: ${model.permanentQlCount}`,
  `review questions: ${model.reviewQuestionCount}`,
  "maturity: IMPLEMENTATION_PROOF",
  "active QLs: 0",
  "publicly publishable: false",
  "Question Studio discoverable: false",
  "Question Bank writable: false",
  "test eligible: false",
  "```",
  "",
];

for (const group of model.groups) {
  const allocation = group.allocation;
  lines.push(
    `## ${allocation.qlId} — ${allocation.qlTemplateId}`,
    "",
    `- Solve mode: \`${allocation.solveModeId}\``,
    `- Task direction: \`${allocation.taskDirection}\``,
    `- Answer semantic: \`${allocation.answerSemantic}\``,
    `- Difficulty: **${allocation.difficulty}**`,
    `- Allocated prototypes: ${allocation.prototypeIds.map((id) => `\`${id}\``).join(", ")}`,
    `- Product review: **${group.reviewStatus}**`,
    "",
  );

  for (const row of group.questions) {
    const question = row.question;
    lines.push(
      `### ${row.reviewKey}`,
      "",
      `- Selected prototype: \`${row.selectedPrototypeId}\``,
      `- Review status: **${row.reviewStatus}**`,
      "",
      `**Question:** ${question.stem}`,
      "",
      `**Options:** ${question.options
        .map((option, index) => `${index + 1}. ${option}`)
        .join(" | ")}`,
      "",
      `**Correct answer:** ${question.options[question.correctIndex]}`,
      "",
      `**Opening:** ${question.explanation.opening}`,
      "",
      `**Formula:** ${question.explanation.formula}`,
      "",
      ...question.explanation.steps.map(
        (step, index) => `${index + 1}. ${step}`,
      ),
      "",
      `**Verification:** ${question.explanation.verification}`,
      "",
      `**Conclusion:** ${question.explanation.conclusion}`,
      "",
      `**Common trap:** ${question.explanation.commonTrap.replace(/^Common trap:\s*/u, "")}`,
      "",
    );
  }
}

const markdownPath = resolve(
  outputDirectory,
  "mal-001-cp001-permanent-allocation-review.md",
);
writeFileSync(markdownPath, `${lines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "EXPORTED_CP001_PERMANENT_ALLOCATION_REVIEW",
  jsonPath,
  markdownPath,
  permanentQlRange: model.permanentQlRange,
  permanentQlCount: model.permanentQlCount,
  reviewQuestionCount: model.reviewQuestionCount,
  reviewStatus: model.reviewStatus,
  publiclyPublishable: model.publiclyPublishable,
  questionStudioDiscoverable: model.questionStudioDiscoverable,
  questionBankWritable: model.questionBankWritable,
  testEligible: model.testEligible,
}, null, 2));
