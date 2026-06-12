import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  NS_FRACDEC_001_MATHJAX_KEYS,
  NS_FRACDEC_001_PIPELINES,
  decimalToFraction,
  fractionToDecimal,
  fractionToString,
  generateNsFracdec001Batch,
  generateNsFracdec001FullCoverageAudit,
  getNsFracdec001ActiveCanonicalProblemIds,
  recurringDecimalToFraction,
  runNsFracdec001Cp001Pipeline,
  runNsFracdec001Cp002Pipeline,
  runNsFracdec001Cp003Pipeline,
  runNsFracdec001Cp004Pipeline,
  runNsFracdec001Cp005Pipeline,
  runNsFracdec001Cp006Pipeline,
  runNsFracdec001Cp007Pipeline,
  runNsFracdec001Cp008Pipeline,
  runNsFracdec001Cp009Pipeline,
  validateNsFracdec001Libraries,
} from "../topics/NumberSystem/subtopics/Fractions Decimals Rational Numbers/archetypes/NS-FRACDEC-001";

const libraries = validateNsFracdec001Libraries();
assert.equal(libraries.valid, true, libraries.failures.join("\n"));

assert.equal(fractionToString({ numerator: 36, denominator: 48 }), "3/4");
assert.equal(fractionToDecimal({ numerator: 1, denominator: 8 }), "0.125");
assert.equal(fractionToString(decimalToFraction("0.25")), "1/4");
assert.equal(fractionToString(recurringDecimalToFraction("0.(3)")), "1/3");

const cp001 = runNsFracdec001Cp001Pipeline({ questionLanguageId: "QL-001", numerator: 36, denominator: 48, seed: "fixture-cp001" });
assert.equal(cp001.answer, "3/4");
assert.ok(cp001.reasoningGraph.nodes.some((node) => node.id === "findHcf"));

const cp002 = runNsFracdec001Cp002Pipeline({ questionLanguageId: "QL-0011".replace("QL-0011", "QL-011"), improper: { numerator: 17, denominator: 5 }, seed: "fixture-cp002" });
assert.equal(cp002.answer, "3 2/5");
assert.ok(cp002.reasoningGraph.nodes.some((node) => node.id === "performConversion"));

const cp003 = runNsFracdec001Cp003Pipeline({ questionLanguageId: "QL-021", operands: [{ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 }], operation: "addition", seed: "fixture-cp003" });
assert.equal(cp003.answer, "5/6");
assert.ok(cp003.reasoningGraph.nodes.some((node) => node.id === "applyOperations"));

const cp004 = runNsFracdec001Cp004Pipeline({ questionLanguageId: "QL-051", rationalValues: [{ numerator: 1, denominator: 2 }, { numerator: 3, denominator: 4 }], seed: "fixture-cp004" });
assert.equal(cp004.answer, "3/4");
assert.ok(cp004.reasoningGraph.nodes.some((node) => node.id === "compareValues"));

const cp005 = runNsFracdec001Cp005Pipeline({ questionLanguageId: "QL-086", fractions: [{ numerator: 1, denominator: 4 }], seed: "fixture-cp005" });
assert.equal(cp005.answer, "0.25");
assert.ok(cp005.reasoningGraph.nodes.some((node) => node.id === "detectRepetition"));

const cp006 = runNsFracdec001Cp006Pipeline({ questionLanguageId: "QL-101", decimal: "0.125", seed: "fixture-cp006" });
assert.equal(cp006.answer, "1/8");
assert.ok(cp006.reasoningGraph.nodes.some((node) => node.id === "convertUsingPlaceValue"));

const cp007 = runNsFracdec001Cp007Pipeline({ questionLanguageId: "QL-116", recurringDecimal: "0.(6)", seed: "fixture-cp007" });
assert.equal(cp007.answer, "2/3");
assert.ok(cp007.reasoningGraph.nodes.some((node) => node.id === "eliminateRecurringPart"));

const cp008 = runNsFracdec001Cp008Pipeline({ questionLanguageId: "QL-131", fractions: [{ numerator: 3, denominator: 8 }], seed: "fixture-cp008" });
assert.equal(cp008.answer, "terminating decimal");
assert.ok(cp008.reasoningGraph.nodes.some((node) => node.id === "classifyDecimal"));

const cp009 = runNsFracdec001Cp009Pipeline({ questionLanguageId: "QL-146", targetType: "HCF", fractions: [{ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 }], seed: "fixture-cp009" });
assert.equal(cp009.answer, "1/6");
assert.ok(cp009.reasoningGraph.nodes.some((node) => node.id === "applyFractionHcfLcmRule"));

for (const [cpId, pipeline] of Object.entries(NS_FRACDEC_001_PIPELINES)) {
  const output = pipeline({ seed: `smoke:${cpId}` });
  assert.equal(output.canonicalProblemId, cpId);
  assert.equal(output.validation.valid, true, output.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("\n"));
  assert.equal(output.stem.includes("{"), false);
  assert.equal(output.explanation.lines.join("\n").includes("{answer}"), false);
  assert.ok(NS_FRACDEC_001_MATHJAX_KEYS.some((key) => output[key].length > 0), cpId);
}

const reviewRows = getNsFracdec001ActiveCanonicalProblemIds().flatMap((cpId) => generateNsFracdec001Batch(cpId, 500, "ns-fracdec-001-human-review"));
assert.equal(reviewRows.length, 4500);

const preFreezeAudit = generateNsFracdec001FullCoverageAudit({ countPerCp: 500, seed: "ns-fracdec-001-pre-freeze" });
const maturityAudit = generateNsFracdec001FullCoverageAudit({ countPerCp: 1000, seed: "ns-fracdec-001-maturity" });

for (const [cpId, report] of Object.entries(maturityAudit)) {
  assert.equal(report.questionCount, 1000, cpId);
  assert.equal(report.generationFailures, 0, cpId);
  assert.equal(report.validationFailures, 0, cpId);
  assert.equal(report.traceabilityFailures, 0, cpId);
  assert.equal(report.mathJaxFailures, 0, cpId);
  assert.equal(report.unusedQuestionLanguageIds.length, 0, `${cpId}: ${report.unusedQuestionLanguageIds.join(", ")}`);
  assert.equal(report.unusedExplanationIds.length, 0, cpId);
}

const outputDir = join(process.cwd(), "artifacts/api-server/src/quant-v3/topics/NumberSystem/subtopics/Fractions Decimals Rational Numbers/archetypes/NS-FRACDEC-001");
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "ns-fracdec-001-human-review.csv"), toCsv(reviewRows));
writeFileSync(join(outputDir, "ns-fracdec-001-pre-freeze-coverage-audit.md"), toAuditMarkdown("NS-FRACDEC-001 Pre-Freeze Coverage Audit", preFreezeAudit));
writeFileSync(join(outputDir, "ns-fracdec-001-maturity-audit.md"), toAuditMarkdown("NS-FRACDEC-001 Maturity Audit", maturityAudit));

console.log("NS-FRACDEC-001 CP-001 through CP-009 implementation passed.");

function toCsv(rows: typeof reviewRows) {
  const header = ["question", "answer", "difficulty", "questionLanguageId", "explanationId", "canonicalProblemId"];
  const body = rows.map((row) => [row.stem, row.answer, row.difficultyBand, row.questionLanguageId, row.explanationId, row.canonicalProblemId].map(csvEscape).join(","));
  return `${header.join(",")}\n${body.join("\n")}\n`;
}

function csvEscape(value: string) {
  return `"${String(value).replaceAll("\r\n", "\\n").replaceAll("\n", "\\n").replaceAll('"', '""')}"`;
}

function toAuditMarkdown(title: string, audit: ReturnType<typeof generateNsFracdec001FullCoverageAudit>) {
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
