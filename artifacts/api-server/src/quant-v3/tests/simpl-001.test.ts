import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  generateSimpl001BalancedBatch,
  generateSimpl001FullCoverageAudit,
  getSimpl001ActiveCanonicalProblemIds,
  runSimpl001Cp001Pipeline,
  runSimpl001Cp002Pipeline,
  runSimpl001Cp003Pipeline,
  runSimpl001Cp004Pipeline,
  runSimpl001Cp005Pipeline,
  runSimpl001Cp006Pipeline,
  runSimpl001Cp007Pipeline,
  SIMPL_001_PIPELINES,
} from "../topics/SimplificationAndApproximation/SIMPL-001";
import type {
  Simpl001AuditReport,
  Simpl001QuestionPackage,
} from "../topics/SimplificationAndApproximation/SIMPL-001";

const fixtures = [
  runSimpl001Cp001Pipeline({ questionLanguageId: "QL-001", seed: "fixture-cp001" }),
  runSimpl001Cp002Pipeline({ questionLanguageId: "QL-026", seed: "fixture-cp002" }),
  runSimpl001Cp003Pipeline({ questionLanguageId: "QL-051", seed: "fixture-cp003" }),
  runSimpl001Cp004Pipeline({ questionLanguageId: "QL-071", seed: "fixture-cp004" }),
  runSimpl001Cp005Pipeline({ questionLanguageId: "QL-096", seed: "fixture-cp005" }),
  runSimpl001Cp006Pipeline({ questionLanguageId: "QL-126", seed: "fixture-cp006" }),
  runSimpl001Cp007Pipeline({ questionLanguageId: "QL-151", seed: "fixture-cp007" }),
];

for (const output of fixtures) {
  assert.equal(output.validation.valid, true, failedChecks(output));
  assert.ok(output.reasoningGraph.nodes.some((node) => node.id === "answer"));
  assert.ok(output.explanation.lines.length > 0);
  assert.ok(output.answerLatex.length > 0);
}

for (const [cpId, pipeline] of Object.entries(SIMPL_001_PIPELINES)) {
  const output = pipeline({ seed: `smoke:${cpId}` });
  assert.equal(output.canonicalProblemId, cpId);
  assert.equal(output.validation.valid, true, failedChecks(output));
  assert.ok(output.stem.length > 0);
  assert.ok(output.answer.length > 0);
}

const reviewRows = generateSimpl001BalancedBatch(4000, "simpl-001-human-review");
assert.equal(reviewRows.length, 4000);
assertBalancedCoverage(reviewRows);

const preFreezeAudit = generateSimpl001FullCoverageAudit({
  countPerCp: 500,
  seed: "simpl-001-pre-freeze",
});
const maturityAudit = generateSimpl001FullCoverageAudit({
  countPerCp: 1000,
  seed: "simpl-001-maturity",
});

for (const [cpId, report] of Object.entries(maturityAudit)) {
  assert.equal(report.questionCount, 1000, cpId);
  assert.equal(report.generationFailures, 0, cpId);
  assert.equal(report.validationFailures, 0, cpId);
  assert.equal(report.traceabilityFailures, 0, cpId);
  assert.equal(report.mathJaxFailures, 0, cpId);
  assert.equal(
    report.unusedQuestionLanguageIds.length,
    0,
    `${cpId}: ${report.unusedQuestionLanguageIds.join(", ")}`,
  );
  assert.equal(report.unusedExplanationIds.length, 0, cpId);
}

const outputDir = join(
  process.cwd(),
  "artifacts/api-server/src/quant-v3/topics/SimplificationAndApproximation/SIMPL-001",
);
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "simpl-001-human-review.csv"), toCsv(reviewRows));
writeFileSync(
  join(outputDir, "simpl-001-pre-freeze-coverage-audit.md"),
  toAuditMarkdown("SIMPL-001 Pre-Freeze Coverage Audit", preFreezeAudit),
);
writeFileSync(
  join(outputDir, "simpl-001-maturity-audit.md"),
  toAuditMarkdown("SIMPL-001 Maturity Audit", maturityAudit),
);

console.log("SIMPL-001 runtime implementation passed.");
console.log("Final verdict: READY FOR HUMAN FREEZE REVIEW");

function failedChecks(output: Simpl001QuestionPackage): string {
  return output.validation.checks
    .filter((check) => !check.passed)
    .map((check) => `${check.name}: ${check.message}`)
    .join("\n");
}

function assertBalancedCoverage(rows: Simpl001QuestionPackage[]): void {
  const counts = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.canonicalProblemId] = (acc[row.canonicalProblemId] ?? 0) + 1;
    return acc;
  }, {});
  for (const cpId of getSimpl001ActiveCanonicalProblemIds()) {
    assert.ok((counts[cpId] ?? 0) >= 571, `${cpId} review coverage too low`);
  }
}

function toCsv(rows: Simpl001QuestionPackage[]): string {
  const header = [
    "question",
    "answer",
    "difficulty",
    "questionLanguageId",
    "explanationId",
    "canonicalProblemId",
    "reasoningTrace",
  ];
  const body = rows.map((row) =>
    [
      row.stem,
      row.answer,
      row.difficulty,
      row.questionLanguageId,
      row.explanationId,
      row.canonicalProblemId,
      row.reasoningTrace,
    ]
      .map(csvEscape)
      .join(","),
  );
  return `${header.join(",")}\n${body.join("\n")}\n`;
}

function csvEscape(value: string): string {
  return `"${String(value)
    .replaceAll("\r\n", "\\n")
    .replaceAll("\n", "\\n")
    .replaceAll('"', '""')}"`;
}

function toAuditMarkdown(
  title: string,
  audit: Record<string, Simpl001AuditReport>,
): string {
  const totals = Object.values(audit).reduce(
    (acc, report) => {
      acc.generationFailures += report.generationFailures;
      acc.validationFailures += report.validationFailures;
      acc.traceabilityFailures += report.traceabilityFailures;
      acc.mathJaxFailures += report.mathJaxFailures;
      acc.unusedQl += report.unusedQuestionLanguageIds.length;
      acc.unusedEs += report.unusedExplanationIds.length;
      return acc;
    },
    {
      generationFailures: 0,
      validationFailures: 0,
      traceabilityFailures: 0,
      mathJaxFailures: 0,
      unusedQl: 0,
      unusedEs: 0,
    },
  );
  const lines = [
    `# ${title}`,
    "",
    "## Verdict",
    "",
    totals.generationFailures === 0 &&
    totals.validationFailures === 0 &&
    totals.traceabilityFailures === 0 &&
    totals.mathJaxFailures === 0 &&
    totals.unusedQl === 0 &&
    totals.unusedEs === 0
      ? "READY FOR HUMAN FREEZE REVIEW"
      : "NOT READY",
    "",
    "## Failure Summary",
    "",
    `- generation failures: ${totals.generationFailures}`,
    `- validation failures: ${totals.validationFailures}`,
    `- traceability failures: ${totals.traceabilityFailures}`,
    `- MathJax failures: ${totals.mathJaxFailures}`,
    `- unused QL IDs: ${totals.unusedQl}`,
    `- unused ES IDs: ${totals.unusedEs}`,
    "",
  ];
  for (const [cpId, report] of Object.entries(audit)) {
    lines.push(`## ${cpId}`, "");
    for (const [key, value] of Object.entries(report)) {
      lines.push(`### ${key}`);
      lines.push("");
      lines.push("```json");
      lines.push(JSON.stringify(value, null, 2));
      lines.push("```");
      lines.push("");
    }
  }
  return lines.join("\n");
}
