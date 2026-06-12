import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  NS_CLASS_001_PIPELINES,
  generateNsClass001Batch,
  generateNsClass001FullCoverageAudit,
  getNsClass001ActiveCanonicalProblemIds,
  runNsClass001Cp01Pipeline,
  runNsClass001Cp02Pipeline,
  runNsClass001Cp03Pipeline,
  runNsClass001Cp04Pipeline,
  runNsClass001Cp05Pipeline,
  runNsClass001Cp06Pipeline,
  validateNsClass001Libraries,
} from "../topics/NumberSystem/subtopics/Number Classification And Properties/NS-CLASS-001";

const libraries = validateNsClass001Libraries();
assert.equal(libraries.valid, true, libraries.failures.join("\n"));

const fixtures = [
  runNsClass001Cp01Pipeline({ questionLanguageId: "QL-001", seed: "fixture-cp01" }),
  runNsClass001Cp02Pipeline({ questionLanguageId: "QL-021", seed: "fixture-cp02" }),
  runNsClass001Cp03Pipeline({ questionLanguageId: "QL-041", seed: "fixture-cp03" }),
  runNsClass001Cp04Pipeline({ questionLanguageId: "QL-066", seed: "fixture-cp04" }),
  runNsClass001Cp05Pipeline({ questionLanguageId: "QL-091", seed: "fixture-cp05" }),
  runNsClass001Cp06Pipeline({ questionLanguageId: "QL-116", seed: "fixture-cp06" }),
];

for (const output of fixtures) {
  assert.equal(output.validation.valid, true, output.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n"));
  assert.ok(output.reasoningGraph.nodes.length >= 4);
  assert.ok(output.propertyWorkingLatex.length > 0);
}

for (const [cpId, pipeline] of Object.entries(NS_CLASS_001_PIPELINES)) {
  const output = pipeline({ seed: `smoke:${cpId}` });
  assert.equal(output.canonicalProblemId, cpId);
  assert.equal(output.validation.valid, true, output.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n"));
  assert.ok(output.stem.length > 0);
  assert.ok(output.explanation.lines.length > 0);
  assert.ok(output.propertyWorkingLatex.length > 0);
}

const reviewRows = getNsClass001ActiveCanonicalProblemIds().flatMap((cpId) => generateNsClass001Batch(cpId, 500, "ns-class-001-human-review"));
assert.equal(reviewRows.length, 3000);

const preFreezeAudit = generateNsClass001FullCoverageAudit({ countPerCp: 500, seed: "ns-class-001-pre-freeze" });
const maturityAudit = generateNsClass001FullCoverageAudit({ countPerCp: 1000, seed: "ns-class-001-maturity" });

for (const [cpId, report] of Object.entries(maturityAudit)) {
  assert.equal(report.questionCount, 1000, cpId);
  assert.equal(report.generationFailures, 0, cpId);
  assert.equal(report.validationFailures, 0, cpId);
  assert.equal(report.traceabilityFailures, 0, cpId);
  assert.equal(report.mathJaxFailures, 0, cpId);
  assert.equal(report.unusedQuestionLanguageIds.length, 0, `${cpId}: ${report.unusedQuestionLanguageIds.join(", ")}`);
  assert.equal(report.unusedExplanationIds.length, 0, cpId);
  assert.ok(Object.keys(report.coverageBucketDistribution).length > 0, cpId);
}

const outputDir = join(process.cwd(), "artifacts/api-server/src/quant-v3/topics/NumberSystem/subtopics/Number Classification And Properties/NS-CLASS-001");
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "ns-class-001-human-review.csv"), toCsv(reviewRows));
writeFileSync(join(outputDir, "ns-class-001-pre-freeze-coverage-audit.md"), toAuditMarkdown("NS-CLASS-001 Pre-Freeze Coverage Audit", preFreezeAudit));
writeFileSync(join(outputDir, "ns-class-001-maturity-audit.md"), toAuditMarkdown("NS-CLASS-001 Maturity Audit", maturityAudit));

console.log("NS-CLASS-001 CP01 through CP06 implementation passed.");

function toCsv(rows: typeof reviewRows) {
  const header = ["CP", "difficulty", "QL ID", "ES ID", "parameters", "answer", "reasoning trace"];
  const body = rows.map((row) =>
    [
      row.canonicalProblemId,
      row.difficultyBand,
      row.questionLanguageId,
      row.explanationId,
      JSON.stringify(row.parameters),
      row.answer,
      row.reasoningGraph.nodes.map((node) => node.id).join(" > "),
    ].map(csvEscape).join(","),
  );
  return `${header.join(",")}\n${body.join("\n")}\n`;
}

function csvEscape(value: string) {
  return `"${String(value).replaceAll("\r\n", "\\n").replaceAll("\n", "\\n").replaceAll('"', '""')}"`;
}

function toAuditMarkdown(title: string, audit: ReturnType<typeof generateNsClass001FullCoverageAudit>) {
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
