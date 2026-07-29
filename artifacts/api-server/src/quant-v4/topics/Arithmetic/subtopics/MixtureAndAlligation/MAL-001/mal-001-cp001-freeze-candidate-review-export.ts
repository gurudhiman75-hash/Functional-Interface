import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  buildMalCp001FreezeReviewModel,
} from "./foundation/cp001-freeze-review-model";

function jsonReplacer(_key: string, value: unknown): unknown {
  return typeof value === "bigint" ? value.toString() : value;
}

const model = buildMalCp001FreezeReviewModel();
const outputDirectory = path.resolve("dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const jsonPath = path.join(
  outputDirectory,
  "mal-001-cp001-freeze-candidate-review.json",
);
writeFileSync(jsonPath, JSON.stringify(model, jsonReplacer, 2));

const markdown: string[] = [
  "# MAL-CP-001 Freeze-Candidate English Review Matrix",
  "",
  "> Product-review material only. Human review remains PENDING. No permanent QL IDs, Question Studio exposure, test eligibility or publication.",
  "",
  `**Freeze candidates:** ${model.candidateCount}`,
  "",
  `**Executable prototype identities:** ${model.prototypeCount}`,
  "",
  `**Review questions:** ${model.questionCount}`,
  "",
  `**Human review status:** ${model.humanReviewStatus}`,
  "",
];

for (const candidateGroup of model.candidateGroups) {
  markdown.push(`# ${candidateGroup.freezeCandidateId}`);
  markdown.push("");
  markdown.push(`**Human review status:** ${candidateGroup.humanReviewStatus}`);
  markdown.push("");
  markdown.push(`**Source readiness:** ${candidateGroup.sourceReadiness}`);
  markdown.push("");
  markdown.push(`**Source conclusion:** ${candidateGroup.sourceConclusion}`);
  markdown.push("");
  markdown.push(`**Source fixtures:** ${candidateGroup.sourceFixtureCount}`);
  markdown.push("");
  markdown.push(`**Evidence strengths:** ${candidateGroup.evidenceStrengths.join(", ")}`);
  markdown.push("");
  markdown.push(`**Representation coverage:** ${candidateGroup.representationCoverage.join(", ")}`);
  markdown.push("");

  for (const prototypeGroup of candidateGroup.prototypeGroups) {
    markdown.push(`## ${prototypeGroup.prototypeId} — ${prototypeGroup.disposition}`);
    markdown.push("");
    markdown.push(`**Classification rationale:** ${prototypeGroup.classificationRationale}`);
    markdown.push("");

    for (const row of prototypeGroup.questions) {
      const question = row.question;
      markdown.push(`### ${row.reviewKey}`);
      markdown.push("");
      markdown.push(`**Review status:** ${row.humanReviewStatus}`);
      markdown.push("");
      markdown.push(`**Difficulty:** ${question.difficulty}`);
      markdown.push("");
      markdown.push(`**Answer semantic:** ${question.answerSemantic}`);
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
  "mal-001-cp001-freeze-candidate-review.md",
);
writeFileSync(markdownPath, markdown.join("\n"));

console.log(JSON.stringify({
  status: "PASS_FREEZE_CANDIDATE_REVIEW_EXPORT_PENDING_HUMAN_REVIEW",
  candidateCount: model.candidateCount,
  prototypeCount: model.prototypeCount,
  questionCount: model.questionCount,
  humanReviewStatus: model.humanReviewStatus,
  permanentQlCount: model.permanentQlCount,
  jsonPath,
  markdownPath,
}, null, 2));
