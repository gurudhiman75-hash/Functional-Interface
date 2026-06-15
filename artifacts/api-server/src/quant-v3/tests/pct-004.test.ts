import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  getPct004ActiveCpIds,
  getPct004ExplanationLibrary,
  selectPct004StemsByCp,
  PCT_004_PIPELINES,
  runPct004Pipeline,
} from "../topics/Percentage/subtopics/PercentageWordProblems/PCT-004";
import type { Pct004QuestionPackage } from "../topics/Percentage/subtopics/PercentageWordProblems/PCT-004";

const fixtures = [
  runPct004Pipeline("CP01", { questionLanguageId: "QL-001", seed: "fixture-cp01" }),
  runPct004Pipeline("CP02", { questionLanguageId: "QL-041", seed: "fixture-cp02" }),
  runPct004Pipeline("CP03", { questionLanguageId: "QL-081", seed: "fixture-cp03" }),
  runPct004Pipeline("CP04", { questionLanguageId: "QL-121", seed: "fixture-cp04" }),
  runPct004Pipeline("CP05", { questionLanguageId: "QL-151", seed: "fixture-cp05" }),
];

for (const output of fixtures) {
  assert.equal(output.validation.valid, true, failedChecks(output));
  assert.ok(output.reasoningGraph.nodes.some((node) => node.id === "answer"));
  assert.ok(output.explanation.lines.length > 0);
  assert.ok(output.answerLatex.length > 0);
}

for (const [cpId, pipeline] of Object.entries(PCT_004_PIPELINES)) {
  const output = pipeline({ seed: `smoke:${cpId}` });
  assert.equal(output.canonicalProblemId, cpId);
  assert.equal(output.validation.valid, true, failedChecks(output));
  assert.ok(output.rendered.question.length > 0);
  assert.ok(output.answer.length > 0);
}

const coverageRows = generatePct004FullCoverageBatch(1000, "pct-004-human-review");
assert.equal(coverageRows.length, 1000);
assertBalancedCoverage(coverageRows);

const preFreezeAudit = buildAudit(coverageRows, "PCT-004 Pre-Freeze Coverage Audit");
const maturityRows = generatePct004FullCoverageBatch(1000, "pct-004-maturity");
const maturityAudit = buildAudit(maturityRows, "PCT-004 Maturity Audit");

for (const [cpId, report] of Object.entries(maturityAudit.reports)) {
  assert.equal(report.questionCount, report.expectedCount, cpId);
  assert.equal(report.generationFailures, 0, cpId);
  assert.equal(report.validationFailures, 0, cpId);
  assert.equal(report.traceabilityFailures, 0, cpId);
  assert.equal(report.mathJaxFailures, 0, cpId);
  assert.equal(report.unusedQuestionLanguageIds.length, 0, cpId);
  assert.equal(report.unusedExplanationIds.length, 0, cpId);
}

const outputDir = join(
  process.cwd(),
  "artifacts/api-server/src/quant-v3/topics/Percentage/subtopics/PercentageWordProblems/PCT-004",
);
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "pct-004-human-review.csv"), toCsv(coverageRows));
writeFileSync(join(outputDir, "pct-004-pre-freeze-coverage-audit.md"), toAuditMarkdown(preFreezeAudit));
writeFileSync(join(outputDir, "pct-004-maturity-audit.md"), toAuditMarkdown(maturityAudit));

console.log("PCT-004 runtime implementation passed.");
console.log("Final verdict: READY FOR HUMAN FREEZE REVIEW");

function failedChecks(output: Pct004QuestionPackage): string {
  return output.validation.checks
    .filter((check) => !check.passed)
    .map((check) => `${check.name}: ${check.message}`)
    .join("\n");
}

function assertBalancedCoverage(rows: Pct004QuestionPackage[]): void {
  const counts = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.canonicalProblemId] = (acc[row.canonicalProblemId] ?? 0) + 1;
    return acc;
  }, {});
  for (const cpId of getPct004ActiveCpIds()) {
    assert.ok((counts[cpId] ?? 0) > 0, `${cpId} received no rows`);
  }
}

function generatePct004FullCoverageBatch(totalCount: number, seed: string): Pct004QuestionPackage[] {
  const cps = getPct004ActiveCpIds();
  const rows: Pct004QuestionPackage[] = [];
  const basePerCp = Math.floor(totalCount / cps.length);
  const remainder = totalCount % cps.length;

  for (const [cpIndex, cpId] of cps.entries()) {
    const targetCount = basePerCp + (cpIndex < remainder ? 1 : 0);
    const stems = selectPct004StemsByCp(cpId);
    for (let stemIndex = 0; stemIndex < targetCount; stemIndex += 1) {
      const stem = stems[stemIndex % stems.length]!;
      rows.push(
        runPct004Pipeline(cpId, {
          seed: `${seed}:${cpId}:${stem.id}:${stemIndex}`,
          questionLanguageId: stem.id,
        }),
      );
    }
  }

  return rows;
}

function buildAudit(rows: Pct004QuestionPackage[], title: string) {
  const explanationLibrary = getPct004ExplanationLibrary();
  const byCp = Object.fromEntries(
    getPct004ActiveCpIds().map((cpId) => [
      cpId,
      rows.filter((row) => row.canonicalProblemId === cpId),
    ]),
  );
  const reports = Object.fromEntries(
    getPct004ActiveCpIds().map((cpId) => {
      const cpRows = byCp[cpId]!;
      const questionCount = cpRows.length;
      const report = {
        questionCount,
        expectedCount: questionCount,
        generationFailures: cpRows.filter((row) => !row.answer).length,
        validationFailures: cpRows.filter((row) => !row.validation.valid).length,
        traceabilityFailures: cpRows.filter((row) => row.rendered.question !== row.parameters.stemItem.stem).length,
        mathJaxFailures: cpRows.filter((row) => !balanced(row.answerLatex) || !balanced(row.rendered.question) || !balanced(row.explanation.text)).length,
        unusedQuestionLanguageIds: uniqueIds(
          cpRows.map((row) => row.questionLanguageId),
          selectPct004StemsByCp(cpId).map((item) => item.id),
        ),
        unusedExplanationIds: uniqueIds(
          cpRows.map((row) => row.explanationId),
          explanationLibrary.families
            .filter((family) => family.appliesTo.includes(cpId))
            .flatMap((family) => family.entries.map((entry) => entry.id)),
        ),
        coverageBucketDistribution: countBy(cpRows.map((row) => row.parameters.coverageCategory)),
        difficultyDistribution: countBy(cpRows.map((row) => row.difficulty)),
      };
      return [cpId, report];
    }),
  );
  return { title, reports };
}

function toCsv(rows: Pct004QuestionPackage[]): string {
  const header = ["CP", "difficulty", "QL ID", "ES ID", "parameters", "answer", "reasoning trace"];
  const body = rows.map((row) =>
    [
      row.canonicalProblemId,
      row.difficulty,
      row.questionLanguageId,
      row.explanationId,
      JSON.stringify(row.parameters),
      row.answer,
      row.reasoningGraph.nodes.map((node) => node.id).join(" > "),
    ].map(csvEscape).join(","),
  );
  return `${header.join(",")}\n${body.join("\n")}\n`;
}

function toAuditMarkdown(audit: ReturnType<typeof buildAudit>): string {
  const lines = [`# ${audit.title}`, ""];
  for (const [cpId, report] of Object.entries(audit.reports)) {
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

function csvEscape(value: string): string {
  return `"${String(value).replaceAll("\r\n", "\\n").replaceAll("\n", "\\n").replaceAll('"', '""')}"`;
}

function balanced(value: string): boolean {
  return (value.match(/\\\(/g)?.length ?? 0) === (value.match(/\\\)/g)?.length ?? 0);
}

function countBy(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function uniqueIds(actual: string[], expected: string[]): string[] {
  const used = new Set(actual);
  return expected.filter((value) => !used.has(value));
}
