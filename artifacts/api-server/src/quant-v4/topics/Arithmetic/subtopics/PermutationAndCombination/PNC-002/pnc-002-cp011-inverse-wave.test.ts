import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  auditCp011InverseCoverage,
  getCp011InverseEntries,
  runPnc002Cp011InversePipeline,
} from "./foundation/cp011-inverse-wave-runtime";
import { countUnlabelledPrescribedGroupsExact } from "./foundation/cp011-discovery-core";
import {
  countDistinctToLabelledBoxesExact,
  countIdenticalToLabelledBoxesExact,
} from "./foundation/cp011-discovery-distribution";

function failedChecks(validation: { checks: { name: string; passed: boolean; message: string }[] }): string {
  return validation.checks.filter((item) => !item.passed).map((item) => `${item.name}: ${item.message}`).join(" | ");
}

const entries = getCp011InverseEntries();
assert.deepEqual(entries.map((entry) => entry.qlId), ["PNC-QL-239", "PNC-QL-240", "PNC-QL-241"]);
assert.equal(entries.length, 3);
assert.equal(new Set(entries.map((entry) => entry.solveMode)).size, 3);
assert.deepEqual(
  Object.fromEntries(["Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length])),
  { Medium: 1, Hard: 2 },
);

assert.equal(countUnlabelledPrescribedGroupsExact([2, 2]), 3n);
assert.equal(countUnlabelledPrescribedGroupsExact([3, 3]), 10n);
assert.equal(countUnlabelledPrescribedGroupsExact([4, 4]), 35n);
assert.equal(countUnlabelledPrescribedGroupsExact([5, 5]), 126n);
assert.equal(countDistinctToLabelledBoxesExact(4, 3), 81n);
assert.equal(countIdenticalToLabelledBoxesExact(6, 3), 28n);

for (const entry of entries) {
  const generated = runPnc002Cp011InversePipeline({ questionLanguageId: entry.qlId, seed: `cp011-inverse-contract:${entry.qlId}` });
  assert.equal(generated.canonicalProblemId, "PNC-CP-011");
  assert.equal(generated.taskKind, "groupingDistribution");
  assert.equal(generated.validation.valid, true, `${entry.qlId}: ${failedChecks(generated.validation)}`);
  assert.equal(generated.independentVerification.answer, generated.solver.numericAnswer);
  assert.equal(generated.solver.evidence.candidateCounts.join(","), generated.independentVerification.candidateCounts.join(","));
  assert.equal(generated.publiclyPublishable, false);
}

const answerPositions = new Set<number>();
const renderedStems = new Set<string>();
let generatedCases = 0;
for (const entry of entries) {
  for (let seedIndex = 0; seedIndex < 24; seedIndex += 1) {
    const seed = `pnc-002-cp011-inverse-proof:${entry.qlId}:${seedIndex}`;
    const first = runPnc002Cp011InversePipeline({ questionLanguageId: entry.qlId, seed });
    const second = runPnc002Cp011InversePipeline({ questionLanguageId: entry.qlId, seed });
    assert.deepEqual(second.parameters, first.parameters, `${entry.qlId} parameter determinism`);
    assert.equal(second.stem, first.stem, `${entry.qlId} stem determinism`);
    assert.deepEqual(second.options, first.options, `${entry.qlId} option determinism`);
    assert.deepEqual(second.explanation, first.explanation, `${entry.qlId} explanation determinism`);
    assert.equal(first.validation.valid, true, `${entry.qlId}: ${failedChecks(first.validation)}`);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4);
    assert.equal(first.options[first.correctIndex], first.answer);
    assert.equal(first.independentVerification.answer, first.solver.numericAnswer);
    assert.equal(first.solver.evidence.candidateCounts.filter((count) => count === first.solver.evidence.target).length, 1);
    assert.equal(/[\u0000-\u001F\u007F]/.test(first.solver.mathJax), false);
    answerPositions.add(first.correctIndex);
    renderedStems.add(first.stem);
    generatedCases += 1;
  }
}
assert.equal(generatedCases, 72);
assert.deepEqual([...answerPositions].sort(), [0, 1, 2, 3]);
assert.ok(renderedStems.size >= 9, `Expected at least 9 rendered inverse stems, received ${renderedStems.size}`);

assert.throws(() => runPnc002Cp011InversePipeline({ questionLanguageId: "PNC-QL-239", language: "hi", seed: "unsupported-hi" }), /not implemented/);
assert.throws(() => runPnc002Cp011InversePipeline({ questionLanguageId: "PNC-QL-239", language: "pa", seed: "unsupported-pa" }), /not implemented/);

const explanationSignatures = new Set<string>();
for (const entry of entries) {
  const generated = runPnc002Cp011InversePipeline({ questionLanguageId: entry.qlId, seed: `cp011-inverse-explanation:${entry.qlId}` });
  const signature = generated.explanation.lines.join(" ").toLowerCase().replace(/\d+/g, "{number}").replace(/\s+/g, " ").trim();
  assert.equal(explanationSignatures.has(signature), false, `Duplicate inverse explanation narrative at ${entry.qlId}`);
  explanationSignatures.add(signature);
}

const audit = auditCp011InverseCoverage();
assert.equal(audit.passed, true, JSON.stringify(audit, null, 2));

const reviewDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-002-cp011-inverse-review");
mkdirSync(reviewDirectory, { recursive: true });
const reviewRows = entries.map((entry) => {
  const generated = runPnc002Cp011InversePipeline({ questionLanguageId: entry.qlId, seed: `pnc-002-cp011-inverse-review:${entry.qlId}` });
  return {
    qlId: entry.qlId,
    cpId: generated.canonicalProblemId,
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    stem: generated.stem,
    options: generated.options,
    correctIndex: generated.correctIndex,
    answer: generated.answer,
    target: generated.solver.evidence.target,
    candidateValues: generated.solver.evidence.candidateValues,
    candidateCounts: generated.solver.evidence.candidateCounts,
    equation: generated.solver.equation,
    mathJax: generated.solver.mathJax,
    explanation: generated.explanation.lines,
    independentVerification: generated.independentVerification,
    validation: generated.validation.valid,
    mathematicalFingerprint: generated.mathematicalFingerprint,
  };
});
writeFileSync(resolve(reviewDirectory, "pnc-002-cp011-inverse-question-explanation-review.json"), `${JSON.stringify(reviewRows, null, 2)}\n`, "utf8");
function csvCell(value: unknown): string { const text = String(value ?? "").replace(/\r?\n/g, "\\n"); return `"${text.replace(/"/g, '""')}"`; }
const columns = ["qlId", "cpId", "difficulty", "solveMode", "stem", "options", "correctIndex", "answer", "target", "candidateValues", "candidateCounts", "equation", "mathJax", "explanation", "independentVerification", "validation", "mathematicalFingerprint"] as const;
const csvRows = [
  columns.map(csvCell).join(","),
  ...reviewRows.map((row) => columns.map((column) => csvCell(Array.isArray(row[column]) ? row[column].join("\n") : typeof row[column] === "object" ? JSON.stringify(row[column]) : row[column])).join(",")),
];
writeFileSync(resolve(reviewDirectory, "pnc-002-cp011-inverse-question-explanation-review.csv"), `${csvRows.join("\n")}\n`, "utf8");
console.log(JSON.stringify({
  packageId: "PNC-002",
  canonicalProblemId: "PNC-CP-011",
  checkpoint: "BOUNDED_INVERSE_WAVE",
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
