import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { generateNsRem002AuditBatch } from "../src/quant-v3/topics/NumberSystem/subtopics/Remainders/archetypes/NS-REM-002/coverage-auditor";
import { getNsRem002ActiveCanonicalProblemIds } from "../src/quant-v3/topics/NumberSystem/subtopics/Remainders/archetypes/NS-REM-002/library";
import type { NsRem002AuditReport, NsRem002CanonicalProblemId, NsRem002QuestionPackage } from "../src/quant-v3/topics/NumberSystem/subtopics/Remainders/archetypes/NS-REM-002/types";

const exportRoot = join(process.cwd(), "exports", "ns-rem-002-review-2026-06-05");
mkdirSync(exportRoot, { recursive: true });

const activeCpIds = getNsRem002ActiveCanonicalProblemIds();

const humanReviewOutputs = activeCpIds.flatMap((canonicalProblemId) => {
  const { outputs } = generateNsRem002AuditBatch({
    canonicalProblemId,
    count: 500,
    seed: "NS-REM-002-HUMAN-REVIEW-500",
  });
  writeFileSync(join(exportRoot, `${canonicalProblemId.toLowerCase()}-human-review-500.csv`), toHumanReviewCsv(outputs));
  return outputs;
});

writeFileSync(join(exportRoot, "ns-rem-002-human-review-500-per-cp.csv"), toHumanReviewCsv(humanReviewOutputs));

const coverageReports: Record<NsRem002CanonicalProblemId, NsRem002AuditReport> = {} as Record<NsRem002CanonicalProblemId, NsRem002AuditReport>;
for (const canonicalProblemId of activeCpIds) {
  coverageReports[canonicalProblemId] = generateNsRem002AuditBatch({
    canonicalProblemId,
    count: 1000,
    seed: "NS-REM-002-COVERAGE-AUDIT-1000",
  }).report;
}

writeFileSync(join(exportRoot, "ns-rem-002-coverage-audit-1000-per-cp.json"), `${JSON.stringify(coverageReports, null, 2)}\n`);
writeFileSync(join(exportRoot, "ns-rem-002-coverage-audit-1000-per-cp.md"), toCoverageMarkdown(coverageReports));
writeFileSync(
  join(exportRoot, "manifest.json"),
  `${JSON.stringify(
    {
      archetypeId: "NS-REM-002",
      generatedAt: new Date().toISOString(),
      humanReview: {
        countPerCp: 500,
        totalQuestions: humanReviewOutputs.length,
        files: [
          "ns-rem-002-human-review-500-per-cp.csv",
          ...activeCpIds.map((canonicalProblemId) => `${canonicalProblemId.toLowerCase()}-human-review-500.csv`),
        ],
      },
      coverageAudit: {
        countPerCp: 1000,
        files: ["ns-rem-002-coverage-audit-1000-per-cp.json", "ns-rem-002-coverage-audit-1000-per-cp.md"],
      },
    },
    null,
    2,
  )}\n`,
);

console.log(`NS-REM-002 export pack written to ${exportRoot}`);
console.log(`Human review questions: ${humanReviewOutputs.length}`);
console.log(`Coverage audit CPs: ${Object.keys(coverageReports).length}`);

function toHumanReviewCsv(outputs: readonly NsRem002QuestionPackage[]) {
  const header = [
    "Question ID",
    "Canonical Problem",
    "Difficulty",
    "Topology",
    "Question Language ID",
    "Explanation Style ID",
    "Question",
    "Answer",
    "Explanation",
    "Divisor",
    "Remainder",
    "Quotient",
    "Dividend",
    "Lower Bound",
    "Upper Bound",
  ];

  const rows = outputs.map((item) => [
    item.questionId,
    item.canonicalProblemId,
    item.difficultyBand,
    item.topology,
    item.questionLanguageId,
    item.explanationStyleId,
    item.stem,
    String(item.answer),
    item.explanation.lines.join("\n"),
    value(item.parameters.divisor ?? item.solver.divisor),
    value(item.parameters.remainder ?? item.solver.remainder),
    value(item.parameters.quotient ?? item.solver.quotient),
    value(item.parameters.dividend ?? item.solver.dividend),
    value(item.parameters.lowerBound ?? item.solver.lowerBound),
    value(item.parameters.upperBound ?? item.solver.upperBound),
  ]);

  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

function toCoverageMarkdown(reports: Record<NsRem002CanonicalProblemId, NsRem002AuditReport>) {
  const lines = ["# NS-REM-002 Coverage Audit", "", "Count per CP: 1000", ""];
  for (const [canonicalProblemId, report] of Object.entries(reports)) {
    lines.push(`## ${canonicalProblemId}`, "");
    lines.push(`Question Count: ${report.questionCount}`);
    lines.push(`Generation Failures: ${report.generationFailures}`);
    lines.push(`Validation Failures: ${report.validationFailures}`);
    lines.push(`Traceability Failures: ${report.traceabilityFailures}`);
    lines.push("");
    appendDistribution(lines, "Difficulty Distribution", report.difficultyDistribution);
    appendDistribution(lines, "Divisor Distribution", report.divisorDistribution);
    appendDistribution(lines, "Question Language Distribution", report.questionLanguageDistribution);
    appendDistribution(lines, "Explanation Distribution", report.explanationDistribution);
    appendDistribution(lines, "Topology Distribution", report.topologyDistribution);
  }
  return lines.join("\n") + "\n";
}

function appendDistribution(lines: string[], title: string, distribution: Record<string, number>) {
  lines.push(`### ${title}`);
  for (const [key, count] of Object.entries(distribution).sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))) {
    lines.push(`- ${key}: ${count}`);
  }
  lines.push("");
}

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function value(input: number | undefined) {
  return typeof input === "number" ? String(input) : "";
}
