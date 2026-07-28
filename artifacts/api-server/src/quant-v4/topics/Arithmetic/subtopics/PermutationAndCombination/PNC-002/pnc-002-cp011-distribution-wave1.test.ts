import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  auditCp011DistributionWave1Coverage,
  getCp011DistributionWave1Entries,
  runPnc002Cp011DistributionWave1Pipeline,
} from "./foundation/cp011-distribution-wave1-runtime";
import {
  bellNumberExact,
  countDistinctExactOccupanciesExact,
  countDistinctSpecifiedBoxExactExact,
  countDistinctSpecifiedBoxExactOthersNonEmptyExact,
  countDistinctToAtMostIdenticalBoxesExact,
  countDistinctToIdenticalBoxesExact,
  countDistinctToLabelledBoxesAtLeastOneEmptyExact,
  countDistinctToLabelledBoxesExactlyKNonEmptyExact,
  countDistinctToLabelledBoxesExact,
  countDistinctToLabelledBoxesNonEmptyExact,
} from "./foundation/cp011-discovery-distribution";

function failedChecks(validation: { checks: { name: string; passed: boolean; message: string }[] }): string {
  return validation.checks.filter((item) => !item.passed).map((item) => `${item.name}: ${item.message}`).join(" | ");
}

const entries = getCp011DistributionWave1Entries();
const checkpointIds = Array.from({ length: 10 }, (_, index) => `PNC-QL-${String(index + 219).padStart(3, "0")}`);
assert.equal(entries.length, 10);
assert.deepEqual(entries.map((entry) => entry.qlId), checkpointIds);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, 10);
assert.deepEqual(
  Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length])),
  { Easy: 1, Medium: 5, Hard: 4 },
);
assert.equal(new Set(entries.map((entry) => entry.solveMode)).size, 10);

assert.equal(countDistinctToLabelledBoxesExact(4, 3), 81n);
assert.equal(countDistinctToLabelledBoxesNonEmptyExact(5, 3), 150n);
assert.equal(countDistinctToLabelledBoxesExactlyKNonEmptyExact(5, 4, 2), 180n);
assert.equal(countDistinctToLabelledBoxesAtLeastOneEmptyExact(5, 3), 93n);
assert.equal(countDistinctExactOccupanciesExact([2, 1, 1]), 12n);
assert.equal(countDistinctSpecifiedBoxExactExact(5, 3, 2), 80n);
assert.equal(countDistinctSpecifiedBoxExactOthersNonEmptyExact(5, 3, 2), 60n);
assert.equal(countDistinctToIdenticalBoxesExact(5, 3), 25n);
assert.equal(countDistinctToAtMostIdenticalBoxesExact(5, 3), 41n);
assert.equal(bellNumberExact(5), 52n);

for (const qlId of checkpointIds) {
  const generated = runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: qlId, seed: `cp011-distribution-contract:${qlId}` });
  assert.equal(generated.canonicalProblemId, "PNC-CP-011");
  assert.equal(generated.taskKind, "groupingDistribution");
  assert.equal(generated.independentVerification.answer, generated.solver.numericAnswer, `${qlId} independent verifier`);
  assert.equal(generated.validation.valid, true, `${qlId}: ${failedChecks(generated.validation)}`);
  assert.equal(generated.publiclyPublishable, false);
}

const answerPositions = new Set<number>();
const renderedStems = new Set<string>();
let generatedCases = 0;
for (const entry of entries) {
  for (let seedIndex = 0; seedIndex < 12; seedIndex += 1) {
    const seed = `pnc-002-cp011-distribution-wave1-proof:${entry.qlId}:${seedIndex}`;
    const first = runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: entry.qlId, seed });
    const second = runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: entry.qlId, seed });
    assert.deepEqual(second.parameters, first.parameters, `${entry.qlId} parameter determinism`);
    assert.equal(second.stem, first.stem, `${entry.qlId} stem determinism`);
    assert.deepEqual(second.options, first.options, `${entry.qlId} option determinism`);
    assert.deepEqual(second.explanation, first.explanation, `${entry.qlId} explanation determinism`);
    assert.equal(first.validation.valid, true, `${entry.qlId}: ${failedChecks(first.validation)}`);
    assert.equal(first.independentVerification.answer, first.solver.numericAnswer);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4);
    assert.equal(first.options[first.correctIndex], first.answer);
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.traceability.formulaRendering, "LATEX_MATHJAX");
    answerPositions.add(first.correctIndex);
    renderedStems.add(first.stem);
    generatedCases += 1;
  }
}
assert.equal(generatedCases, 120);
assert.deepEqual([...answerPositions].sort(), [0, 1, 2, 3]);
assert.ok(renderedStems.size >= 35, `Expected at least 35 rendered stems, received ${renderedStems.size}`);
assert.throws(() => runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: "PNC-QL-219", language: "hi", seed: "unsupported-hi" }), /not implemented/);
assert.throws(() => runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: "PNC-QL-219", language: "pa", seed: "unsupported-pa" }), /not implemented/);

const explanationSignatures = new Set<string>();
for (const entry of entries) {
  const generated = runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: entry.qlId, seed: `cp011-distribution-explanation:${entry.qlId}` });
  const signature = generated.explanation.lines.join(" ").toLowerCase().replace(/\d+/g, "{number}").replace(/\s+/g, " ").trim();
  assert.equal(explanationSignatures.has(signature), false, `Duplicate explanation narrative at ${entry.qlId}`);
  explanationSignatures.add(signature);
}

const audit = auditCp011DistributionWave1Coverage();
assert.equal(audit.passed, true, JSON.stringify(audit, null, 2));

const reviewDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-002-cp011-distribution-wave1-review");
mkdirSync(reviewDirectory, { recursive: true });
const reviewRows = entries.map((entry) => {
  const generated = runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-002-cp011-distribution-wave1-review:${entry.qlId}` });
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
  checkpoint: "DISTRIBUTION_WAVE_1_DISTINCT_OBJECTS",
  activeQlCount: entries.length,
  activeSolveModeCount: new Set(entries.map((entry) => entry.solveMode)).size,
  generatedCases,
  generatedTwicePerCase: true,
  distinctRenderedStems: renderedStems.size,
  answerPositions: [...answerPositions].sort(),
  reviewRows: reviewRows.length,
  audit,
  status: "PASS",
}, null, 2));
