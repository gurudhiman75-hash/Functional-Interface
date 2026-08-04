import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateSapCp002ExamReadinessV2ReviewRecords } from "./review-export";

const outputPath = resolve(process.argv[2] ?? "dist/SAP-CP-002-300-QUESTIONS-AND-EXPLANATIONS-REVIEW-V2.md");
const records = generateSapCp002ExamReadinessV2ReviewRecords();
const optionLabels = ["A", "B", "C", "D"] as const;
const difficultyCounts = Object.fromEntries(
  ["EASY", "MEDIUM", "HARD"].map((difficulty) => [
    difficulty,
    records.filter((record) => record.difficulty === difficulty).length,
  ]),
);
const qlIds = [...new Set(records.map((record) => record.permanentQlId))];
const lines: string[] = [
  "# SAP-CP-002 — 300 Questions and Explanations Review Pack V2",
  "",
  "**Package:** `SAP-001`  ",
  "**Checkpoint:** `SAP-CP-002`  ",
  "**Coverage:** `SAP-QL-017` through `SAP-QL-033`  ",
  "**Review version:** `SAP_CP002_EXAM_READINESS_V2`  ",
  "**Human review status:** `PENDING`  ",
  "**Publication state:** `INACTIVE`  ",
  "",
  "## Remediation basis",
  "",
  "This corpus supersedes the first 300-question review export. It retains permanent QL identities and exact rational authorities while remodeling the student-facing layer under the SAP-CP-002 critical exam-readiness audit.",
  "",
  "The V2 export includes answer-type-specific explanations, feature-derived difficulty, corrected missing-component metadata, form-aware reduced-fraction validation, remodeled comparison and diagnosis items, complete product reduction, sum-and-difference identity use, duplicate-payload rejection and explicit human-review gates.",
  "",
  "## Corpus summary",
  "",
  "| Measure | Count |",
  "|---|---:|",
  `| Total questions | ${records.length} |`,
  `| Easy | ${difficultyCounts.EASY} |`,
  `| Medium | ${difficultyCounts.MEDIUM} |`,
  `| Hard | ${difficultyCounts.HARD} |`,
  `| Permanent QLs | ${qlIds.length} |`,
  `| Auto-validation failures | ${records.filter((record) => !record.validation.ok).length} |`,
  "",
  "## QL distribution",
  "",
  "| QL | Solve-mode label | Questions |",
  "|---|---|---:|",
];

for (const qlId of qlIds) {
  const qlRecords = records.filter((record) => record.permanentQlId === qlId);
  lines.push(`| \`${qlId}\` | ${qlRecords[0]!.solveModeLabel} | ${qlRecords.length} |`);
}

lines.push(
  "",
  "## Reviewer protocol",
  "",
  "Mark every review dimension as `APPROVED`, `REVISE` or `REJECT`. A record must not move beyond `HUMAN_REVIEW_PENDING` until all dimensions have a final decision and every requested correction is regenerated under the same review version.",
  "",
);

for (const qlId of qlIds) {
  const qlRecords = records.filter((record) => record.permanentQlId === qlId);
  lines.push(`# ${qlId} — ${qlRecords[0]!.solveModeLabel}`, "");
  for (const record of qlRecords) {
    lines.push(
      `## ${record.questionId}`,
      "",
      "| Field | Value |",
      "|---|---|",
      `| QL | \`${record.permanentQlId}\` |`,
      `| Solve mode | ${record.solveModeLabel} |`,
      `| Solve subtype | \`${record.solveModeSubtype}\` |`,
      `| Task direction | \`${record.taskDirection}\` |`,
      `| Difficulty | \`${record.difficulty}\` |`,
      `| Structural difficulty score | ${record.difficultyScore} |`,
      `| Seed | \`${record.seed}\` |`,
      `| Auto-validation | \`${record.validation.ok ? "PASS" : "FAIL"}\` |`,
      `| Human review | \`${record.humanReviewStatus}\` |`,
      "",
      "### Question",
      "",
      record.stem,
      "",
      "### Options",
      "",
    );
    record.options.forEach((option, index) => {
      lines.push(`${optionLabels[index]}. ${option.value}`);
    });
    lines.push(
      "",
      "### Answer",
      "",
      `**Correct option:** ${optionLabels[record.correctIndex]}  `,
      `**Correct answer:** ${record.correctAnswer}`,
      "",
      "### Explanation",
      "",
      `**Method:** \`${record.explanation.methodId}\``,
      "",
      record.explanation.coreConcept,
      "",
      record.explanation.givenDataAndStrategy,
      "",
    );
    record.explanation.stepByStep.forEach((step, index) => lines.push(`${index + 1}. ${step}`));
    lines.push(
      "",
      `**Exam-speed method:** ${record.explanation.examSpeedMethod}`,
      "",
      record.explanation.finalAnswer,
      "",
      "### Distractor analysis",
      "",
    );
    record.options.forEach((option, index) => {
      lines.push(
        `- **Option ${optionLabels[index]} — ${option.value}**  `,
        `  **Route:** \`${option.misconceptionId ?? "CORRECT"}\`  `,
        `  **Numerically equivalent to correct:** \`${option.numericEquivalenceToCorrect}\`  `,
        `  **Satisfies complete stem condition:** \`${option.satisfiesRequiredForm}\`  `,
        `  ${option.analysis}`,
      );
    });
    lines.push(
      "",
      "### Automated review evidence",
      "",
      `- Explanation word count: ${record.validation.explanationWordCount}`,
      `- Numeric-equivalent option count: ${record.validation.numericEquivalentOptionCount}`,
      `- Full-condition correct option count: ${record.validation.fullConditionCorrectOptionCount}`,
      `- Payload fingerprint: \`${record.payloadFingerprint}\``,
      "",
      "### Human review",
      "",
      "| Review dimension | Decision | Reviewer note |",
      "|---|---|---|",
      "| Mathematical accuracy | `PENDING` |  |",
      "| Exam-like stem | `PENDING` |  |",
      "| Difficulty accuracy | `PENDING` |  |",
      "| Option realism | `PENDING` |  |",
      "| Explanation clarity and efficiency | `PENDING` |  |",
      "| Distractor reproducibility | `PENDING` |  |",
      "| Authority and metadata correctness | `PENDING` |  |",
      "| Final disposition | `PENDING` |  |",
      "",
      "---",
      "",
    );
  }
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(JSON.stringify({
  status: "WROTE_SAP_CP002_EXAM_READINESS_V2_REVIEW",
  outputPath,
  questionCount: records.length,
  difficultyCounts,
  humanReviewStatus: "PENDING",
}, null, 2));
