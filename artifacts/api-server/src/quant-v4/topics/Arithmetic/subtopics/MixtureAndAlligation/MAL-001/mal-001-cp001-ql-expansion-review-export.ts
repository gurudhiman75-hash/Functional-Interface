import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  buildMalCp001QlExpansionReviewModel,
} from "./foundation/cp001-ql-expansion-review-model";

function jsonReplacer(_key: string, value: unknown): unknown {
  return typeof value === "bigint" ? value.toString() : value;
}

const model = buildMalCp001QlExpansionReviewModel();
const outputDirectory = path.resolve("dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const jsonPath = path.join(
  outputDirectory,
  "mal-001-cp001-ql-expansion-review.json",
);
writeFileSync(jsonPath, JSON.stringify(model, jsonReplacer, 2));

const markdown: string[] = [
  "# MAL-CP-001 Provisional QL-Expansion Review",
  "",
  "> Count-bearing expansion frontier only. QL-template and solve-mode counts remain provisional; row review is PENDING and no permanent MAL-QL IDs exist.",
  "",
  `**Provisional solve modes:** ${model.provisionalSolveModeCount}`,
  "",
  `**Provisional QL-template families:** ${model.provisionalQlTemplateCount}`,
  "",
  `**Approved executable prototypes represented:** ${model.approvedPrototypeCount}`,
  "",
  `**Review questions:** ${model.questionCount}`,
  "",
  `**Human review status:** ${model.humanReviewStatus}`,
  "",
];

for (const templateGroup of model.templateGroups) {
  const template = templateGroup.template;
  markdown.push(`# ${template.qlTemplateId}`);
  markdown.push("");
  markdown.push(`**Solve mode:** ${template.solveModeId}`);
  markdown.push("");
  markdown.push(`**Candidate contract:** ${template.freezeCandidateId}`);
  markdown.push("");
  markdown.push(`**Task direction:** ${template.taskDirection}`);
  markdown.push("");
  markdown.push(`**Answer semantic:** ${template.answerSemantic}`);
  markdown.push("");
  markdown.push(`**Evidence topology:** ${template.evidenceTopology}`);
  markdown.push("");
  markdown.push(`**Question-language contract:** ${template.questionLanguageContract}`);
  markdown.push("");
  markdown.push(`**Validator contract:** ${template.validatorContract}`);
  markdown.push("");
  markdown.push(`**Misconception strategy:** ${template.misconceptionStrategy}`);
  markdown.push("");
  markdown.push(`**Explanation strategy:** ${template.explanationStrategy}`);
  markdown.push("");
  markdown.push(`**Split dimensions:** ${template.splitDimensions.join(", ")}`);
  markdown.push("");
  markdown.push(`**Merge/split rationale:** ${template.mergeOrSplitRationale}`);
  markdown.push("");
  markdown.push(`**Human review status:** ${templateGroup.humanReviewStatus}`);
  markdown.push("");

  for (const prototypeGroup of templateGroup.prototypeGroups) {
    markdown.push(`## ${prototypeGroup.prototypeId}`);
    markdown.push("");
    for (const row of prototypeGroup.questions) {
      const question = row.question;
      markdown.push(`### ${row.reviewKey}`);
      markdown.push("");
      markdown.push(`**Review status:** ${row.humanReviewStatus}`);
      markdown.push("");
      markdown.push(`**Difficulty:** ${question.difficulty}`);
      markdown.push("");
      markdown.push(question.stem);
      markdown.push("");
      question.options.forEach((option, index) => {
        const marker = index === question.correctIndex ? " **✓**" : "";
        markdown.push(`${String.fromCharCode(65 + index)}. ${option}${marker}`);
      });
      markdown.push("");
      markdown.push(`**Opening:** ${question.explanation.opening}`);
      markdown.push("");
      markdown.push(`**Formula:** ${question.explanation.formula}`);
      markdown.push("");
      question.explanation.steps.forEach((step, index) => {
        markdown.push(`${index + 1}. ${step}`);
      });
      markdown.push("");
      markdown.push(`**Verification:** ${question.explanation.verification}`);
      markdown.push("");
      markdown.push(`**Conclusion:** ${question.explanation.conclusion}`);
      markdown.push("");
      markdown.push(`**${question.explanation.commonTrap}**`);
      markdown.push("");
      markdown.push("---");
      markdown.push("");
    }
  }
}

const markdownPath = path.join(
  outputDirectory,
  "mal-001-cp001-ql-expansion-review.md",
);
writeFileSync(markdownPath, markdown.join("\n"));

console.log(JSON.stringify({
  status: "PASS_PROVISIONAL_QL_EXPANSION_REVIEW_EXPORT_PENDING_HUMAN_REVIEW",
  provisionalSolveModeCount: model.provisionalSolveModeCount,
  provisionalQlTemplateCount: model.provisionalQlTemplateCount,
  approvedPrototypeCount: model.approvedPrototypeCount,
  questionCount: model.questionCount,
  humanReviewStatus: model.humanReviewStatus,
  permanentQlCount: model.permanentQlCount,
  jsonPath,
  markdownPath,
}, null, 2));
