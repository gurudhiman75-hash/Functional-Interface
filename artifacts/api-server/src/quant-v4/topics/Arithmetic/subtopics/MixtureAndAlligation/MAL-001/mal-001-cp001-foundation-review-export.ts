import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildMalCp001FoundationReviewModel } from "./foundation/cp001-foundation-review-model";
import {
  MAL_CP001_FOUNDATION_SOURCE_DISPOSITIONS,
  MAL_CP001_FOUNDATION_FREEZE_METADATA,
} from "./foundation/cp001-foundation-freeze-ledger";

const model = buildMalCp001FoundationReviewModel();
const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const jsonPath = resolve(outputDirectory, "mal-001-cp001-foundation-review.json");
writeFileSync(
  jsonPath,
  `${JSON.stringify({
    freezeMetadata: MAL_CP001_FOUNDATION_FREEZE_METADATA,
    sourceDispositions: MAL_CP001_FOUNDATION_SOURCE_DISPOSITIONS,
    review: model,
  }, null, 2)}\n`,
  "utf8",
);

const lines: string[] = [
  "# MAL-CP-001 Frozen Foundation English Review",
  "",
  `Status: **${model.status}**`,
  "",
  "```text",
  `frozen solve modes: ${model.solveModeCount}`,
  `frozen QL-template families: ${model.qlTemplateCount}`,
  `approved prototypes: ${model.approvedPrototypeCount}`,
  `reviewed English questions: ${model.questionCount}`,
  `permanent MAL-QL IDs: ${model.permanentQlCount}`,
  "publicly publishable: false",
  "Question Studio discoverable: false",
  "```",
  "",
  "## Deferred source directions",
  "",
  ...MAL_CP001_FOUNDATION_SOURCE_DISPOSITIONS.map(
    (entry) => `- \`${entry.gapId}\` — **${entry.decision}**: ${entry.rationale}`,
  ),
  "",
];

for (const templateGroup of model.templateGroups) {
  const template = templateGroup.template;
  lines.push(
    `## ${template.qlTemplateId}`,
    "",
    `- Solve mode: \`${template.solveModeId}\``,
    `- Task direction: \`${template.taskDirection}\``,
    `- Answer semantic: \`${template.answerSemantic}\``,
    `- Review: **${templateGroup.editorialReviewStatus}**`,
    `- Evidence: ${template.evidenceTopology}`,
    `- Language contract: ${template.questionLanguageContract}`,
    "",
  );

  for (const prototypeGroup of templateGroup.prototypeGroups) {
    lines.push(`### ${prototypeGroup.prototypeId}`, "");
    for (const row of prototypeGroup.questions) {
      const question: any = row.question;
      lines.push(
        `#### ${row.reviewKey}`,
        "",
        `**Status:** ${row.editorialReviewStatus}`,
        "",
        `**Question:** ${question.stem}`,
        "",
        `**Options:** ${question.options.map((option: string, index: number) => `${index + 1}. ${option}`).join(" | ")}`,
        "",
        `**Correct answer:** ${question.options[question.correctIndex]}`,
        "",
        `**Opening:** ${question.explanation.opening}`,
        "",
        `**Formula:** ${question.explanation.formula}`,
        "",
        ...question.explanation.steps.map((step: string, index: number) => `${index + 1}. ${step}`),
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
}

const markdownPath = resolve(outputDirectory, "mal-001-cp001-foundation-review.md");
writeFileSync(markdownPath, `${lines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "EXPORTED_CP001_FROZEN_FOUNDATION_REVIEW",
  jsonPath,
  markdownPath,
  solveModeCount: model.solveModeCount,
  qlTemplateCount: model.qlTemplateCount,
  questionCount: model.questionCount,
  permanentQlCount: model.permanentQlCount,
  publiclyPublishable: model.publiclyPublishable,
  questionStudioDiscoverable: model.questionStudioDiscoverable,
}, null, 2));
