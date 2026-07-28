import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { auditCp011GroupingCoverage } from "./foundation/coverage-auditor-cp011-grouping";
import {
  getCp011GroupingEntries,
  runPnc002Cp011GroupingPipeline,
} from "./foundation/cp011-grouping-runtime";
import {
  countLabelledPrescribedGroupsExact,
  countSpecifiedPairDifferentLabelledEqualGroupsExact,
  countSpecifiedPairDifferentUnlabelledEqualGroupsExact,
  countSpecifiedPairSameLabelledEqualGroupsExact,
  countSpecifiedPairSameUnlabelledEqualGroupsExact,
  countUnlabelledPrescribedGroupsExact,
  countUnnamedEqualGroupsExact,
  countUnnamedPairsExact,
} from "./foundation/cp011-discovery-core";

function failedChecks(validation: { checks: { name: string; passed: boolean; message: string }[] }): string {
  return validation.checks.filter((item) => !item.passed).map((item) => `${item.name}: ${item.message}`).join(" | ");
}

const entries = getCp011GroupingEntries();
const checkpointIds = Array.from({ length: 10 }, (_, index) => `PNC-QL-${String(index + 209).padStart(3, "0")}`);
assert.equal(entries.length, 10);
assert.deepEqual(entries.map((entry) => entry.qlId), checkpointIds);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, 10);
assert.deepEqual(
  Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length])),
  { Easy: 1, Medium: 6, Hard: 3 },
);
assert.equal(new Set(entries.map((entry) => entry.solveMode)).size, 7);

assert.equal(countLabelledPrescribedGroupsExact([2, 3]), 10n);
assert.equal(countLabelledPrescribedGroupsExact([2, 2, 2]), 90n);
assert.equal(countUnlabelledPrescribedGroupsExact([1, 2, 3]), 60n);
assert.equal(countUnnamedEqualGroupsExact(2, 3), 15n);
assert.equal(countUnlabelledPrescribedGroupsExact([2, 2, 3, 3]), 6300n);
assert.equal(countUnnamedPairsExact(4), 105n);
assert.equal(countSpecifiedPairSameLabelledEqualGroupsExact(8, 2), 30n);
assert.equal(countSpecifiedPairDifferentLabelledEqualGroupsExact(8, 2), 40n);
assert.equal(countSpecifiedPairSameUnlabelledEqualGroupsExact(8, 2), 15n);
assert.equal(countSpecifiedPairDifferentUnlabelledEqualGroupsExact(8, 2), 20n);

for (const qlId of checkpointIds) {
  const generated = runPnc002Cp011GroupingPipeline({ questionLanguageId: qlId, seed: `cp011-contract:${qlId}` });
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
    const seed = `pnc-002-cp011-grouping-proof:${entry.qlId}:${seedIndex}`;
    const first = runPnc002Cp011GroupingPipeline({ questionLanguageId: entry.qlId, seed });
    const second = runPnc002Cp011GroupingPipeline({ questionLanguageId: entry.qlId, seed });
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
assert.ok(renderedStems.size >= 30, `Expected at least 30 rendered stems, received ${renderedStems.size}`);
assert.throws(() => runPnc002Cp011GroupingPipeline({ questionLanguageId: "PNC-QL-209", language: "hi", seed: "unsupported-hi" }), /not implemented/);
assert.throws(() => runPnc002Cp011GroupingPipeline({ questionLanguageId: "PNC-QL-209", language: "pa", seed: "unsupported-pa" }), /not implemented/);

const explanationSignatures = new Set<string>();
for (const entry of entries) {
  const generated = runPnc002Cp011GroupingPipeline({ questionLanguageId: entry.qlId, seed: `cp011-explanation:${entry.qlId}` });
  const signature = generated.explanation.lines.join(" ").toLowerCase().replace(/\d+/g, "{number}").replace(/\s+/g, " ").trim();
  assert.equal(explanationSignatures.has(signature), false, `Duplicate explanation narrative at ${entry.qlId}`);
  explanationSignatures.add(signature);
}

const audit = auditCp011GroupingCoverage();
assert.equal(audit.passed, true, JSON.stringify(audit, null, 2));

const reviewDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-002-cp011-grouping-review");
mkdirSync(reviewDirectory, { recursive: true });
const reviewRows = entries.map((entry) => {
  const generated = runPnc002Cp011GroupingPipeline({ questionLanguageId: entry.qlId, seed: `pnc-002-cp011-grouping-review:${entry.qlId}` });
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
    explanation: generated.explanation.lines,
    independentVerification: generated.independentVerification,
    validation: generated.validation.valid,
    mathematicalFingerprint: generated.mathematicalFingerprint,
  };
});
writeFileSync(resolve(reviewDirectory, "pnc-002-cp011-grouping-question-explanation-review.json"), `${JSON.stringify(reviewRows, null, 2)}\n`, "utf8");
function csvCell(value: unknown): string { const text = String(value ?? "").replace(/\r?\n/g, "\\n"); return `"${text.replace(/"/g, '""')}"`; }
const columns = ["qlId", "cpId", "difficulty", "solveMode", "stem", "options", "correctIndex", "answer", "equation", "mathJax", "explanation", "independentVerification", "validation", "mathematicalFingerprint"] as const;
const csvRows = [
  columns.map(csvCell).join(","),
  ...reviewRows.map((row) => columns.map((column) => csvCell(Array.isArray(row[column]) ? row[column].join("\n") : typeof row[column] === "object" ? JSON.stringify(row[column]) : row[column])).join(",")),
];
writeFileSync(resolve(reviewDirectory, "pnc-002-cp011-grouping-question-explanation-review.csv"), `${csvRows.join("\n")}\n`, "utf8");
console.log(JSON.stringify({
  packageId: "PNC-002",
  canonicalProblemId: "PNC-CP-011",
  checkpoint: "GROUPING_WAVE_1",
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
