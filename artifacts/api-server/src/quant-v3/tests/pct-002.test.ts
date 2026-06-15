
import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  generatePct002Batch,
  generatePct002FullBatch,
  generatePct002FullCoverageAudit,
  getPct002ActiveCpIds,
  PCT_002_PIPELINES,
} from "../topics/Percentage/subtopics/PercentageChange/PCT-002";
import type { Pct002QuestionPackage } from "../topics/Percentage/subtopics/PercentageChange/PCT-002";

for (const [cpId, pipeline] of Object.entries(PCT_002_PIPELINES)) {
  const output = pipeline({ seed: `smoke:${cpId}` });
  assert.equal(output.canonicalProblemId, cpId);
  assert.equal(output.validation.valid, true, failedChecks(output));
  assert.ok(output.answer.length > 0);
  assert.ok(output.reasoningGraph.nodes.length > 0);
  assert.ok(output.rendered.question.length > 0);
  assert.ok(output.rendered.explanation.length > 0);
}

const reviewRows = generatePct002FullBatch(
  Math.floor(4000 / getPct002ActiveCpIds().length),
  "pct-002-human-review",
);

const preFreezeAudit = generatePct002FullCoverageAudit({
  countPerCp: 500,
  seed: "pct-002-pre-freeze",
});
const maturityAudit = generatePct002FullCoverageAudit({
  countPerCp: 1000,
  seed: "pct-002-maturity",
});

for (const [cpId, report] of Object.entries(maturityAudit)) {
  assert.equal(report.questionCount, 1000, cpId);
  assert.equal(report.generationFailures, 0, cpId);
  assert.equal(report.validationFailures, 0, cpId);
  assert.equal(report.traceabilityFailures, 0, cpId);
  assert.equal(report.mathJaxFailures, 0, cpId);
  assert.equal(report.unusedQuestionLanguageIds.length, 0, cpId);
  assert.equal(report.unusedExplanationIds.length, 0, cpId);
  assert.equal(report.unusedCoverageCategories.length, 0, cpId);
}

const outputDir = join(
  process.cwd(),
  "artifacts/api-server/src/quant-v3/topics/Percentage/subtopics/PercentageChange/PCT-002",
);
mkdirSync(outputDir, { recursive: true });
writeFileSync(
  join(outputDir, "pct-002-human-review.csv"),
  toCsv(reviewRows),
);
writeFileSync(
  join(outputDir, "pct-002-pre-freeze-coverage-audit.md"),
  toAuditMarkdown("PCT-002 Pre-Freeze Coverage Audit", preFreezeAudit),
);
writeFileSync(
  join(outputDir, "pct-002-maturity-audit.md"),
  toAuditMarkdown("PCT-002 Maturity Audit", maturityAudit),
);

console.log("PCT-002 Phase C-B final runtime execution passed.");

function failedChecks(output: Pct002QuestionPackage): string {
  return output.validation.checks
    .filter((check) => !check.passed)
    .map((check) => `${check.name}: ${check.message}`)
    .join("\n");
}

function toCsv(rows: Pct002QuestionPackage[]): string {
  const header = [
    "canonicalProblemId",
    "questionLanguageId",
    "explanationId",
    "parameters",
    "answer",
    "renderedQuestion",
    "renderedExplanation",
  ];
  const body = rows.map((row) =>
    [
      row.canonicalProblemId,
      row.questionLanguageId,
      row.explanationId,
      JSON.stringify(row.parameters),
      row.answer,
      row.rendered.question,
      row.rendered.explanation,
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
  audit: ReturnType<typeof generatePct002FullCoverageAudit>,
): string {
  const lines = [`# ${title}`, ""];
  for (const [cpId, report] of Object.entries(audit)) {
    lines.push(`## ${cpId}`, "");
    for (const [key, value] of Object.entries(report)) {
      lines.push(`### ${key}`, "", "```json");
      lines.push(JSON.stringify(value, null, 2));
      lines.push("```", "");
    }
  }
  return lines.join("\n");
}
