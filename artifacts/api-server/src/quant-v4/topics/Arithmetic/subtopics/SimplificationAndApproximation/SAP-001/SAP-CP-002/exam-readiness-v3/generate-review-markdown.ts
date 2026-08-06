import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateSapCp002ExamReadinessV3ReviewRecords } from "./review-export";

const outputPath = resolve(process.argv[2] ?? "dist/SAP-CP-002-300-QUESTIONS-AND-EXPLANATIONS-REVIEW-V3.md");
const records = generateSapCp002ExamReadinessV3ReviewRecords();
const optionLabels = ["A", "B", "C", "D"] as const;
const difficultyCounts = Object.fromEntries(["EASY", "MEDIUM", "HARD"].map((difficulty) => [
  difficulty,
  records.filter((record) => record.difficulty === difficulty).length,
]));
const qlIds = [...new Set(records.map((record) => record.permanentQlId))];

function labelsForQl(qlId: (typeof qlIds)[number]): string {
  return [...new Set(records.filter((record) => record.permanentQlId === qlId).map((record) => record.solveModeLabel))].join(" / ");
}

const lines: string[] = [
  "# SAP-CP-002 — 300 Questions and Explanations Review Pack V3",
  "",
  "**Package:** `SAP-001`  ",
  "**Checkpoint:** `SAP-CP-002`  ",
  "**Coverage:** `SAP-QL-017` through `SAP-QL-033`  ",
  "**Review version:** `SAP_CP002_EXAM_READINESS_V3`  ",
  "**Human review status:** `PENDING`  ",
  "**Publication state:** `INACTIVE`  ",
  "",
  "## Remediation authority",
  "",
  "This corpus applies the original SAP-CP-002 critical review and its V2 follow-up audit. It preserves the exact rational solver and permanent QLs while correcting answer-key cycles, hidden-operand explanation provenance, unreproducible distractors, incomplete cancellation, QL-020 subtype collisions, semantic duplicate detection and difficulty instability.",
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
  `| Unique canonical payloads | ${new Set(records.map((record) => record.canonicalPayloadKey)).size} |`,
  `| Unique generation identities | ${new Set(records.map((record) => record.generationIdentity)).size} |`,
  `| Auto-validation failures | ${records.filter((record) => !record.validation.ok).length} |`,
  "",
  "## QL distribution",
  "",
  "| QL | Solve-mode label | Questions |",
  "|---|---|---:|",
];

for (const qlId of qlIds) {
  lines.push(`| \`${qlId}\` | ${labelsForQl(qlId)} | ${records.filter((record) => record.permanentQlId === qlId).length} |`);
}

lines.push("", "## Reviewer protocol", "", "Every record remains `PENDING`. Mark each dimension as `APPROVED`, `REVISE` or `REJECT`. Automated validation is not publication approval.", "");

for (const qlId of qlIds) {
  lines.push(`# ${qlId} — ${labelsForQl(qlId)}`, "");
  for (const record of records.filter((item) => item.permanentQlId === qlId)) {
    lines.push(
      `## ${record.questionId}`,
      "",
      "| Field | Value |",
      "|---|---|",
      `| QL | \`${record.permanentQlId}\` |`,
      `| Prototype | \`${record.temporaryPrototypeId}\` |`,
      `| Solve mode | ${record.solveModeLabel} |`,
      `| Solve subtype | \`${record.solveModeSubtype}\` |`,
      `| Task direction | \`${record.taskDirection}\` |`,
      `| Difficulty | \`${record.difficulty}\` |`,
      `| Semantic difficulty score | ${record.difficultyScore} |`,
      `| Seed | \`${record.seed}\` |`,
      `| Generation identity | \`${record.generationIdentity}\` |`,
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
    record.options.forEach((option, index) => lines.push(`${optionLabels[index]}. ${option.value}`));
    lines.push(
      "",
      "### Answer",
      "",
      `**Correct option:** ${optionLabels[record.correctIndex]}  `,
      `**Correct answer:** ${record.correctAnswer}  `,
      `**Answer meaning:** ${record.answerSemanticValue}`,
      "",
      "### Explanation",
      "",
      `**Method:** \`${record.explanation.methodId}\`  `,
      `**Provenance:** \`${record.explanation.provenanceStatus}\`  `,
      `**Visible operands:** ${record.explanation.visibleOperandSet.length ? record.explanation.visibleOperandSet.join(", ") : "Not applicable"}`,
      "",
      record.explanation.coreConcept,
      "",
      record.explanation.givenDataAndStrategy,
      "",
    );
    record.explanation.stepByStep.forEach((step, index) => lines.push(`${index + 1}. ${step}`));
    lines.push("", `**Exam-speed method:** ${record.explanation.examSpeedMethod}`, "", record.explanation.finalAnswer, "", "### Distractor analysis", "");
    record.options.forEach((option, index) => {
      lines.push(
        `- **Option ${optionLabels[index]} — ${option.value}**  `,
        `  **Route:** \`${option.misconceptionId ?? "CORRECT"}\`  `,
        `  **Route operands:** ${option.routeOperands.length ? option.routeOperands.join(", ") : "Not applicable"}  `,
        `  **Reproducible from visible question:** \`${option.reproducibleFromVisibleStem}\`  `,
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
      `- Option-order safety: ${record.validation.optionOrderSafe}`,
      `- Visible-operand provenance: ${record.validation.visibleOperandProvenancePassed}`,
      `- Distractor reproducibility: ${record.validation.distractorReproducibilityPassed}`,
      `- Generation identity: ${record.validation.generationIdentityPassed}`,
      `- Canonical identity: ${record.validation.canonicalIdentityPassed}`,
      `- Canonical payload: \`${record.canonicalPayloadKey}\``,
      `- Payload fingerprint: \`${record.payloadFingerprint}\``,
      "",
      "### Human review",
      "",
      "| Review dimension | Decision | Reviewer note |",
      "|---|---|---|",
      "| Mathematical accuracy | `PENDING` |  |",
      "| Visible-operand solution provenance | `PENDING` |  |",
      "| Distractor reproducibility | `PENDING` |  |",
      "| Exam-like stem | `PENDING` |  |",
      "| Difficulty accuracy | `PENDING` |  |",
      "| Option realism and homogeneity | `PENDING` |  |",
      "| Explanation clarity and efficiency | `PENDING` |  |",
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
  status: "WROTE_SAP_CP002_EXAM_READINESS_V3_REVIEW",
  outputPath,
  questionCount: records.length,
  difficultyCounts,
  uniqueCanonicalPayloads: new Set(records.map((record) => record.canonicalPayloadKey)).size,
  humanReviewStatus: "PENDING",
}, null, 2));
