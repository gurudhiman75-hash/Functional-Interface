import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  NS_EXP_001_MATHJAX_KEYS,
  NS_EXP_001_PIPELINES,
  generateNsExp001Batch,
  generateNsExp001FullCoverageAudit,
  getNsExp001ActiveCanonicalProblemIds,
  runNsExp001Cp01Pipeline,
  runNsExp001Cp02Pipeline,
  runNsExp001Cp03Pipeline,
  runNsExp001Cp04Pipeline,
  runNsExp001Cp05Pipeline,
  runNsExp001Cp06Pipeline,
  runNsExp001Cp07Pipeline,
  runNsExp001Cp09Pipeline,
  validateNsExp001Libraries,
} from "../topics/NumberSystem/subtopics/IndicesAndExponents/NS-EXP-001";

const libraries = validateNsExp001Libraries();
assert.equal(libraries.valid, true, libraries.failures.join("\n"));

const fixtures = [
  runNsExp001Cp01Pipeline({ questionLanguageId: "QL-001", seed: "fixture-cp01" }),
  runNsExp001Cp02Pipeline({ questionLanguageId: "QL-021", seed: "fixture-cp02" }),
  runNsExp001Cp03Pipeline({ questionLanguageId: "QL-041", seed: "fixture-cp03" }),
  runNsExp001Cp04Pipeline({ questionLanguageId: "QL-071", seed: "fixture-cp04" }),
  runNsExp001Cp05Pipeline({ questionLanguageId: "QL-086", seed: "fixture-cp05" }),
  runNsExp001Cp06Pipeline({ questionLanguageId: "QL-101", seed: "fixture-cp06" }),
  runNsExp001Cp07Pipeline({ questionLanguageId: "QL-131", seed: "fixture-cp07" }),
  runNsExp001Cp09Pipeline({ questionLanguageId: "QL-166", seed: "fixture-cp09" }),
];

for (const output of fixtures) {
  assert.equal(output.validation.valid, true, output.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n"));
  assert.ok(output.reasoningGraph.nodes.some((node) => node.id === "extractAnswer"));
  assert.ok(NS_EXP_001_MATHJAX_KEYS.some((key) => output[key].length > 0), output.canonicalProblemId);
}

for (const [cpId, pipeline] of Object.entries(NS_EXP_001_PIPELINES)) {
  const output = pipeline({ seed: `smoke:${cpId}` });
  assert.equal(output.canonicalProblemId, cpId);
  assert.equal(output.validation.valid, true, output.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n"));
  assert.ok(output.stem.length > 0);
  assert.ok(output.explanation.lines.length > 0);
  assert.ok(NS_EXP_001_MATHJAX_KEYS.some((key) => output[key].length > 0), cpId);
}

const reviewRows = getNsExp001ActiveCanonicalProblemIds().flatMap((cpId) => generateNsExp001Batch(cpId, 500, "ns-exp-001-human-review"));
assert.equal(reviewRows.length, 4000);

const preFreezeAudit = generateNsExp001FullCoverageAudit({ countPerCp: 500, seed: "ns-exp-001-pre-freeze" });
const maturityAudit = generateNsExp001FullCoverageAudit({ countPerCp: 1000, seed: "ns-exp-001-maturity" });

for (const [cpId, report] of Object.entries(maturityAudit)) {
  assert.equal(report.questionCount, 1000, cpId);
  assert.equal(report.generationFailures, 0, cpId);
  assert.equal(report.validationFailures, 0, cpId);
  assert.equal(report.traceabilityFailures, 0, cpId);
  assert.equal(report.mathJaxFailures, 0, cpId);
  assert.equal(report.unusedQuestionLanguageIds.length, 0, `${cpId}: ${report.unusedQuestionLanguageIds.join(", ")}`);
  assert.equal(report.unusedExplanationIds.length, 0, cpId);
}

const outputDir = join(process.cwd(), "artifacts/api-server/src/quant-v3/topics/NumberSystem/subtopics/IndicesAndExponents/NS-EXP-001");
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "ns-exp-001-human-review.csv"), toCsv(reviewRows));
writeFileSync(join(outputDir, "ns-exp-001-pre-freeze-coverage-audit.md"), toAuditMarkdown("NS-EXP-001 Pre-Freeze Coverage Audit", preFreezeAudit));
writeFileSync(join(outputDir, "ns-exp-001-maturity-audit.md"), toAuditMarkdown("NS-EXP-001 Maturity Audit", maturityAudit));

console.log("NS-EXP-001 CP01 through CP09 implementation passed.");

function toCsv(rows: typeof reviewRows) {
  const header = ["question", "answer", "difficulty", "questionLanguageId", "explanationId", "canonicalProblemId"];
  const body = rows.map((row) => [row.stem, row.answer, row.difficultyBand, row.questionLanguageId, row.explanationId, row.canonicalProblemId].map(csvEscape).join(","));
  return `${header.join(",")}\n${body.join("\n")}\n`;
}

function csvEscape(value: string) {
  return `"${String(value).replaceAll("\r\n", "\\n").replaceAll("\n", "\\n").replaceAll('"', '""')}"`;
}

function toAuditMarkdown(title: string, audit: ReturnType<typeof generateNsExp001FullCoverageAudit>) {
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
