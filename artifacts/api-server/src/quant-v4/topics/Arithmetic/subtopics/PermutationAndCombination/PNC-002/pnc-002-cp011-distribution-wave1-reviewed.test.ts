import "./pnc-002-cp011-distribution-wave1.test";
import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  auditCp011DistributionWave1Coverage,
  getCp011DistributionWave1Entries,
  runPnc002Cp011DistributionWave1Pipeline,
} from "./foundation/cp011-distribution-wave1-reviewed-runtime";

function failedChecks(validation: { checks: { name: string; passed: boolean; message: string }[] }): string {
  return validation.checks.filter((item) => !item.passed).map((item) => `${item.name}: ${item.message}`).join(" | ");
}

const entries = getCp011DistributionWave1Entries();
let reviewedCases = 0;
for (const entry of entries) {
  for (let seedIndex = 0; seedIndex < 4; seedIndex += 1) {
    const generated = runPnc002Cp011DistributionWave1Pipeline({
      questionLanguageId: entry.qlId,
      seed: `pnc-002-cp011-distribution-wave1-reviewed-proof:${entry.qlId}:${seedIndex}`,
    });
    const visible = [generated.stem, ...generated.options, ...generated.explanation.lines, generated.solver.mathJax];
    assert.equal(generated.validation.valid, true, `${entry.qlId}: ${failedChecks(generated.validation)}`);
    assert.equal(visible.every((value) => !/[\u0000-\u001F\u007F]/.test(value)), true, `${entry.qlId} control-character review`);
    assert.equal(/(^|[^\\])sum_/.test(generated.solver.mathJax), false, `${entry.qlId} collapsed sum command`);
    assert.equal(/!,/.test(generated.solver.mathJax), false, `${entry.qlId} collapsed TeX spacing`);
    reviewedCases += 1;
  }
}
assert.equal(reviewedCases, 40);

const commandSamples = Object.fromEntries(entries.map((entry) => [
  entry.qlId,
  runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: entry.qlId, seed: `cp011-distribution-wave1-command:${entry.qlId}` }).solver.mathJax,
]));
for (const qlId of ["PNC-QL-221", "PNC-QL-224", "PNC-QL-225"]) assert.equal(commandSamples[qlId]!.includes(String.raw`\binom`), true, `${qlId} binomial TeX`);
assert.equal(commandSamples["PNC-QL-223"]!.includes(String.raw`\frac`), true, "PNC-QL-223 fraction TeX");
for (const qlId of ["PNC-QL-227", "PNC-QL-228"]) assert.equal(commandSamples[qlId]!.includes(String.raw`\sum`), true, `${qlId} summation TeX`);
for (const qlId of ["PNC-QL-220", "PNC-QL-221", "PNC-QL-222", "PNC-QL-225"]) assert.equal(commandSamples[qlId]!.includes(String.raw`\,S`), true, `${qlId} Stirling spacing TeX`);

const audit = auditCp011DistributionWave1Coverage();
assert.equal(audit.passed, true, JSON.stringify(audit, null, 2));

const reviewDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-002-cp011-distribution-wave1-review");
mkdirSync(reviewDirectory, { recursive: true });
const reviewRows = entries.map((entry) => {
  const generated = runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-002-cp011-distribution-wave1-reviewed-review:${entry.qlId}` });
  return {
    qlId: entry.qlId,
    cpId: generated.canonicalProblemId,
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    stem: generated.stem,
    options: generated.options,
    correctIndex: generated.correctIndex,
    answer: generated.answer,
    equation: generated.solver.equation,
    mathJax: generated.solver.mathJax,
    evidence: generated.solver.evidence,
    explanation: generated.explanation.lines,
    independentVerification: generated.independentVerification,
    validation: generated.validation.valid,
    mathematicalFingerprint: generated.mathematicalFingerprint,
  };
});
writeFileSync(resolve(reviewDirectory, "pnc-002-cp011-distribution-wave1-question-explanation-review.json"), `${JSON.stringify(reviewRows, null, 2)}\n`, "utf8");
function csvCell(value: unknown): string { const text = String(value ?? "").replace(/\r?\n/g, "\\n"); return `"${text.replace(/"/g, '""')}"`; }
const columns = ["qlId", "cpId", "difficulty", "solveMode", "stem", "options", "correctIndex", "answer", "equation", "mathJax", "evidence", "explanation", "independentVerification", "validation", "mathematicalFingerprint"] as const;
const csvRows = [
  columns.map(csvCell).join(","),
  ...reviewRows.map((row) => columns.map((column) => csvCell(Array.isArray(row[column]) ? row[column].join("\n") : typeof row[column] === "object" ? JSON.stringify(row[column]) : row[column])).join(",")),
];
writeFileSync(resolve(reviewDirectory, "pnc-002-cp011-distribution-wave1-question-explanation-review.csv"), `${csvRows.join("\n")}\n`, "utf8");
console.log(JSON.stringify({
  packageId: "PNC-002",
  canonicalProblemId: "PNC-CP-011",
  checkpoint: "DISTRIBUTION_WAVE_1_REVIEWED_TEX",
  reviewedCases,
  commandContracts: Object.keys(commandSamples).length,
  reviewRows: reviewRows.length,
  audit,
  status: "PASS",
}, null, 2));
