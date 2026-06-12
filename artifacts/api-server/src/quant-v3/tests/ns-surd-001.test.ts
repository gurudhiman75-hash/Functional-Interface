import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  generateNsSurd001Batch,
  generateNsSurd001FullBatch,
  generateNsSurd001FullCoverageAudit,
  getNsSurd001ActiveCanonicalProblemIds,
  NS_SURD_001_PIPELINES,
  runNsSurd001Cp01Pipeline,
  runNsSurd001Cp02Pipeline,
  runNsSurd001Cp03Pipeline,
  runNsSurd001Cp04Pipeline,
  runNsSurd001Cp05Pipeline,
  runNsSurd001Cp06Pipeline,
  runNsSurd001Cp07Pipeline,
  runNsSurd001Cp08Pipeline,
} from "../topics/NumberSystem/subtopics/SurdsAndRationalization/NS-SURD-001";
import type { NsSurd001QuestionPackage } from "../topics/NumberSystem/subtopics/SurdsAndRationalization/NS-SURD-001";

const fixtures = [
  runNsSurd001Cp01Pipeline({ questionLanguageId: "QL-001", seed: "fixture-cp01" }),
  runNsSurd001Cp02Pipeline({ questionLanguageId: "QL-021", seed: "fixture-cp02" }),
  runNsSurd001Cp03Pipeline({ questionLanguageId: "QL-041", seed: "fixture-cp03" }),
  runNsSurd001Cp04Pipeline({ questionLanguageId: "QL-061", seed: "fixture-cp04" }),
  runNsSurd001Cp05Pipeline({ questionLanguageId: "QL-086", seed: "fixture-cp05" }),
  runNsSurd001Cp06Pipeline({ questionLanguageId: "QL-121", seed: "fixture-cp06" }),
  runNsSurd001Cp07Pipeline({ questionLanguageId: "QL-136", seed: "fixture-cp07" }),
  runNsSurd001Cp08Pipeline({ questionLanguageId: "QL-156", seed: "fixture-cp08" }),
];

for (const output of fixtures) {
  assert.equal(output.validation.valid, true, failedChecks(output));
  assert.ok(output.reasoningGraph.nodes.some((node) => node.id === "answer"));
  assert.ok(output.explanation.lines.length > 0);
  assert.ok(output.answerLatex.length > 0);
}

for (const [cpId, pipeline] of Object.entries(NS_SURD_001_PIPELINES)) {
  const output = pipeline({ seed: `smoke:${cpId}` });
  assert.equal(output.canonicalProblemId, cpId);
  assert.equal(output.validation.valid, true, failedChecks(output));
  assert.ok(output.stem.length > 0);
  assert.ok(output.answer.length > 0);
}

const reviewRows = getNsSurd001ActiveCanonicalProblemIds().flatMap((cpId) =>
  generateNsSurd001Batch(cpId, 500, "ns-surd-001-human-review"),
);
assert.equal(reviewRows.length, 4000);

const preFreezeAudit = generateNsSurd001FullCoverageAudit({
  countPerCp: 500,
  seed: "ns-surd-001-pre-freeze",
});
const maturityAudit = generateNsSurd001FullCoverageAudit({
  countPerCp: 1000,
  seed: "ns-surd-001-maturity",
});
const maturityRows = generateNsSurd001FullBatch(1000, "ns-surd-001-maturity");
assert.equal(maturityRows.length, 8000);

for (const [cpId, report] of Object.entries(maturityAudit)) {
  assert.equal(report.questionCount, 1000, cpId);
  assert.equal(report.generationFailures, 0, cpId);
  assert.equal(report.validationFailures, 0, cpId);
  assert.equal(report.traceabilityFailures, 0, cpId);
  assert.equal(report.mathJaxFailures, 0, cpId);
  assert.equal(report.unusedQuestionLanguageIds.length, 0, `${cpId}: ${report.unusedQuestionLanguageIds.join(", ")}`);
  assert.equal(report.unusedExplanationIds.length, 0, cpId);
}

const outputDir = join(process.cwd(), "artifacts/api-server/src/quant-v3/topics/NumberSystem/subtopics/SurdsAndRationalization/NS-SURD-001");
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "ns-surd-001-human-review.csv"), toCsv(reviewRows));
writeFileSync(join(outputDir, "ns-surd-001-pre-freeze-coverage-audit.md"), toAuditMarkdown("NS-SURD-001 Pre-Freeze Coverage Audit", preFreezeAudit));
writeFileSync(join(outputDir, "ns-surd-001-maturity-audit.md"), toAuditMarkdown("NS-SURD-001 Maturity Audit", maturityAudit));

console.log("NS-SURD-001 final runtime implementation passed.");

function failedChecks(output: NsSurd001QuestionPackage) {
  return output.validation.checks
    .filter((check) => !check.passed)
    .map((check) => `${check.name}: ${check.message}`)
    .join("\n");
}

function toCsv(rows: NsSurd001QuestionPackage[]) {
  const header = ["question", "answer", "difficulty", "questionLanguageId", "explanationId", "canonicalProblemId", "reasoningTrace"];
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

function csvEscape(value: string) {
  return `"${String(value).replaceAll("\r\n", "\\n").replaceAll("\n", "\\n").replaceAll('"', '""')}"`;
}

function toAuditMarkdown(title: string, audit: ReturnType<typeof generateNsSurd001FullCoverageAudit>) {
  const lines = [`# ${title}`, ""];
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
