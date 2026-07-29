import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MAL_CP001_ENGLISH_RELEASE,
  MAL_CP001_ENGLISH_REVIEW_APPROVAL,
} from "./foundation/cp001-release";
import { buildMalCp001ReleaseReviewModel } from "./foundation/cp001-release-review-model";

const model = buildMalCp001ReleaseReviewModel();
const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const jsonPath = resolve(
  outputDirectory,
  "mal-001-cp001-english-release-review.json",
);
writeFileSync(
  jsonPath,
  `${JSON.stringify({ release: MAL_CP001_ENGLISH_RELEASE, approval: MAL_CP001_ENGLISH_REVIEW_APPROVAL, review: model }, null, 2)}\n`,
  "utf8",
);

const lines: string[] = [
  "# MAL-CP-001 English Release Review",
  "",
  `Status: **${model.status}**`,
  "",
  "```text",
  `release ID: ${model.releaseId}`,
  `permanent QL range: ${model.permanentQlRange}`,
  `permanent QLs: ${model.permanentQlCount}`,
  `approved review questions: ${model.reviewQuestionCount}`,
  `review method: ${model.reviewMethod}`,
  "maturity: FROZEN",
  "active QLs: 11",
  "publicly publishable: true",
  "Question Studio discoverable: true",
  "Question Bank writable: true",
  "test eligible: true",
  "languages: English only",
  "```",
  "",
  `Review note: ${model.reviewNote}`,
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
    `- Release review: **${group.reviewStatus}**`,
    "",
  );

  for (const row of group.questions) {
    const question = row.question;
    lines.push(
      `### ${row.reviewKey}`,
      "",
      `- Selected prototype: \`${row.selectedPrototypeId}\``,
      `- Review status: **${row.reviewStatus}**`,
      `- Review method: \`${row.reviewMethod}\``,
      `- Release ID: \`${question.traceability.releaseId}\``,
      "",
      `**Question:** ${question.stem}`,
      "",
      `**Options:** ${question.options
        .map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`)
        .join(" | ")}`,
      "",
      `**Correct answer:** ${question.answer}`,
      "",
      `#### ${question.explanation.sectionTitles.coreConcept}`,
      "",
      question.explanation.coreConcept,
      "",
      `**Formula:** ${question.explanation.formula}`,
      "",
      `#### ${question.explanation.sectionTitles.steps}`,
      "",
      ...question.explanation.steps,
      "",
      `**Quick check:** ${question.explanation.verification}`,
      "",
      `**Final answer:** ${question.explanation.conclusion}`,
      "",
      `#### ${question.explanation.sectionTitles.shortcut}`,
      "",
      question.explanation.examShortcut,
      "",
      `#### ${question.explanation.sectionTitles.trap}`,
      "",
      question.explanation.commonTrap.replace(/^Common trap:\s*/u, ""),
      "",
    );
  }
}

const markdownPath = resolve(
  outputDirectory,
  "mal-001-cp001-english-release-review.md",
);
writeFileSync(markdownPath, `${lines.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "EXPORTED_MAL_CP001_ENGLISH_RELEASE_REVIEW",
      jsonPath,
      markdownPath,
      releaseId: model.releaseId,
      permanentQlCount: model.permanentQlCount,
      reviewQuestionCount: model.reviewQuestionCount,
      reviewStatus: model.reviewStatus,
      publiclyPublishable: model.publiclyPublishable,
      questionStudioDiscoverable: model.questionStudioDiscoverable,
      questionBankWritable: model.questionBankWritable,
      testEligible: model.testEligible,
    },
    null,
    2,
  ),
);
