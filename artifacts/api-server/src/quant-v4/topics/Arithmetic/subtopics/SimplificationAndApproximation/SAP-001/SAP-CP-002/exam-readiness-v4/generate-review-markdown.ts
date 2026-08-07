import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateSapCp002ExamReadinessV4ReviewRecords } from "./review-export";

const outputPath = resolve(process.argv[2] ?? "dist/SAP-CP-002-300-QUESTIONS-AND-EXPLANATIONS-REVIEW-V4.md");
const records = generateSapCp002ExamReadinessV4ReviewRecords();
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
  "# SAP-CP-002 — 300 Questions and Explanations Review Pack V4",
  "",
  "**Package:** `SAP-001`  ",
  "**Checkpoint:** `SAP-CP-002`  ",
  "**Coverage:** `SAP-QL-017` through `SAP-QL-033`  ",
  "**Review version:** `SAP_CP002_EXAM_READINESS_V4`  ",
  "**Human review status:** `PENDING`  ",
  "**Publication state:** `INACTIVE`  ",
  "",
  "## V4 remediation authority",
  "",
  "This corpus applies the critical human review of the V3 300-question pack. It preserves the exact solver, permanent QLs and canonical ancestry while replacing generic fallback explanations, completing complex-fraction and reciprocal working, executing continued fractions and inverse equations, normalizing mathematical symbols, strengthening distractors, enforcing QL-032 form traps and constraining local answer runs.",
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
  `| Generic fallback explanations | ${records.filter((record) => /SAFE_FALLBACK/i.test(record.explanation.methodId)).length} |`,
  "",
  "## QL distribution",
  "",
  "| QL | Solve-mode label | Questions |",
  "|---|---|---:|",
];

for (const qlId of qlIds) {
  lines.push(`| \`${qlId}\` | ${labelsForQl(qlId)} | ${records.filter((record) => record.permanentQlId === qlId).length} |`);
}

lines.push("", "## Reviewer protocol", "", "Every record remains `PENDING`. Automated validation establishes a review candidate only; it does not authorize freeze, activation or publication.", "");

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
    lines.push(
      "",
      `**Final working value:** ${record.explanation.finalWorkingValue}  `,
      `**Substitution verified:** ${record.explanation.substitutionVerified}  `,
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
      `- No fallback explanation: ${record.validation.noFallbackPassed}`,
      `- Final working matches answer: ${record.validation.finalWorkingMatchesAnswer}`,
      `- Surface syntax: ${record.validation.surfaceSyntaxPassed}`,
      `- Symbol normalization: ${record.validation.symbolNormalizationPassed}`,
      `- Explanation completeness: ${record.validation.explanationCompletenessPassed}`,
      `- QL-032 form trap: ${record.validation.ql032FormTrapPassed}`,
      `- Option-order safety: ${record.validation.optionOrderSafe}`,
      `- Visible-operand provenance: ${record.validation.visibleOperandProvenancePassed}`,
      `- Distractor reproducibility: ${record.validation.distractorReproducibilityPassed}`,
      `- Canonical payload: \`${record.canonicalPayloadKey}\``,
      `- Payload fingerprint: \`${record.payloadFingerprint}\``,
      "",
      "### Human review",
      "",
      "| Review dimension | Decision | Reviewer note |",
      "|---|---|---|",
      "| Mathematical accuracy | `PENDING` |  |",
      "| Fully executed visible working | `PENDING` |  |",
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
  status: "WROTE_SAP_CP002_EXAM_READINESS_V4_REVIEW",
  outputPath,
  questionCount: records.length,
  difficultyCounts,
  uniqueCanonicalPayloads: new Set(records.map((record) => record.canonicalPayloadKey)).size,
  genericFallbacks: records.filter((record) => /SAFE_FALLBACK/i.test(record.explanation.methodId)).length,
  humanReviewStatus: "PENDING",
}, null, 2));
