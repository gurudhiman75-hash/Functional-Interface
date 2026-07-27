import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  auditCp012Coverage,
  boundedIdenticalExact,
  derangementExact,
  distinctCapacityExact,
  getCp012Entries,
  gridPathExact,
  runPnc002Cp012Pipeline,
  twoColourEveryBoxNonEmptyExact,
} from "./foundation/cp012-mixed-runtime-reviewed";

function failedChecks(validation: { checks: { name: string; passed: boolean; message: string }[] }): string {
  return validation.checks.filter((item) => !item.passed).map((item) => `${item.name}: ${item.message}`).join(" | ");
}

const entries = getCp012Entries();
const expectedIds = Array.from({ length: 28 }, (_, index) => `PNC-QL-${String(index + 242).padStart(3, "0")}`);
assert.equal(entries.length, 28);
assert.deepEqual(entries.map((entry) => entry.qlId), expectedIds);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, 28);
assert.equal(new Set(entries.map((entry) => entry.solveMode)).size, 28);
assert.deepEqual(
  Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length])),
  { Easy: 2, Medium: 12, Hard: 14 },
);

assert.equal(derangementExact(5), 44n);
assert.equal(gridPathExact(4, 3), 35n);
assert.equal(boundedIdenticalExact(6, [2, 3, 4]), 9n);
assert.equal(distinctCapacityExact(5, [2, 2, 3]), 130n);
assert.equal(twoColourEveryBoxNonEmptyExact(3, 3, 3), 55n);

for (const qlId of expectedIds) {
  const generated = runPnc002Cp012Pipeline({ questionLanguageId: qlId, seed: `cp012-contract:${qlId}` });
  assert.equal(generated.canonicalProblemId, "PNC-CP-012");
  assert.equal(generated.taskKind, "mixedAdvancedCounting");
  assert.equal(generated.independentVerification.answer, generated.solver.numericAnswer, `${qlId} independent verifier`);
  assert.equal(generated.validation.valid, true, `${qlId}: ${failedChecks(generated.validation)}`);
  assert.equal(generated.publiclyPublishable, false);
  assert.equal(generated.traceability.formulaRendering, "LATEX_MATHJAX");
}

const answerPositions = new Set<number>();
const renderedStems = new Set<string>();
const mathematicalFingerprints = new Set<string>();
let generatedCases = 0;
for (const entry of entries) {
  for (let seedIndex = 0; seedIndex < 8; seedIndex += 1) {
    const seed = `pnc-002-cp012-proof:${entry.qlId}:${seedIndex}`;
    const first = runPnc002Cp012Pipeline({ questionLanguageId: entry.qlId, seed });
    const second = runPnc002Cp012Pipeline({ questionLanguageId: entry.qlId, seed });
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
    assert.equal(/[\u0000-\u001F\u007F]/.test(first.solver.mathJax), false);
    answerPositions.add(first.correctIndex);
    renderedStems.add(first.stem);
    mathematicalFingerprints.add(first.mathematicalFingerprint);
    generatedCases += 1;
  }
}
assert.equal(generatedCases, 224);
assert.deepEqual([...answerPositions].sort(), [0, 1, 2, 3]);
assert.ok(renderedStems.size >= 70, `Expected at least 70 rendered stems, received ${renderedStems.size}`);
assert.ok(mathematicalFingerprints.size >= 70, `Expected at least 70 mathematical fingerprints, received ${mathematicalFingerprints.size}`);

let reviewedTexCases = 0;
for (const entry of entries) {
  for (let seedIndex = 0; seedIndex < 3; seedIndex += 1) {
    const generated = runPnc002Cp012Pipeline({ questionLanguageId: entry.qlId, seed: `cp012-tex:${entry.qlId}:${seedIndex}` });
    assert.equal(generated.validation.checks.find((item) => item.name === "reviewed-tex-command")?.passed, true);
    assert.equal(generated.validation.checks.find((item) => item.name === "reviewed-visible-control-characters")?.passed, true);
    assert.equal(generated.explanation.lines.some((line) => line.includes(`\\(${generated.solver.mathJax}\\)`)), true);
    reviewedTexCases += 1;
  }
}
assert.equal(reviewedTexCases, 84);

assert.throws(() => runPnc002Cp012Pipeline({ questionLanguageId: "PNC-QL-242", language: "hi", seed: "unsupported-hi" }), /not implemented/);
assert.throws(() => runPnc002Cp012Pipeline({ questionLanguageId: "PNC-QL-242", language: "pa", seed: "unsupported-pa" }), /not implemented/);

const explanationSignatures = new Set<string>();
for (const entry of entries) {
  const generated = runPnc002Cp012Pipeline({ questionLanguageId: entry.qlId, seed: `cp012-explanation:${entry.qlId}` });
  const signature = generated.explanation.lines.join(" ").toLowerCase().replace(/\d+/g, "{number}").replace(/\s+/g, " ").trim();
  assert.equal(explanationSignatures.has(signature), false, `Duplicate explanation narrative at ${entry.qlId}`);
  explanationSignatures.add(signature);
}

const familyCoverage = {
  conditionalRoles: entries.filter((entry) => entry.qlId >= "PNC-QL-242" && entry.qlId <= "PNC-QL-246").length,
  selectionArrangement: entries.filter((entry) => entry.qlId >= "PNC-QL-247" && entry.qlId <= "PNC-QL-252").length,
  derangements: entries.filter((entry) => entry.qlId >= "PNC-QL-253" && entry.qlId <= "PNC-QL-257").length,
  gridPaths: entries.filter((entry) => entry.qlId >= "PNC-QL-258" && entry.qlId <= "PNC-QL-261").length,
  mixedGroupingDistribution: entries.filter((entry) => entry.qlId >= "PNC-QL-262" && entry.qlId <= "PNC-QL-269").length,
};
assert.deepEqual(familyCoverage, { conditionalRoles: 5, selectionArrangement: 6, derangements: 5, gridPaths: 4, mixedGroupingDistribution: 8 });

const audit = auditCp012Coverage();
assert.equal(audit.passed, true, JSON.stringify(audit, null, 2));

const reviewDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-002-cp012-review");
mkdirSync(reviewDirectory, { recursive: true });
const reviewRows = entries.map((entry) => {
  const generated = runPnc002Cp012Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-002-cp012-review:${entry.qlId}` });
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
writeFileSync(resolve(reviewDirectory, "pnc-002-cp012-question-explanation-review.json"), `${JSON.stringify(reviewRows, null, 2)}\n`, "utf8");
function csvCell(value: unknown): string { const text = String(value ?? "").replace(/\r?\n/g, "\\n"); return `"${text.replace(/"/g, '""')}"`; }
const columns = ["qlId", "cpId", "difficulty", "solveMode", "stem", "options", "correctIndex", "answer", "equation", "mathJax", "explanation", "independentVerification", "validation", "mathematicalFingerprint"] as const;
const csvRows = [
  columns.map(csvCell).join(","),
  ...reviewRows.map((row) => columns.map((column) => csvCell(Array.isArray(row[column]) ? row[column].join("\n") : typeof row[column] === "object" ? JSON.stringify(row[column]) : row[column])).join(",")),
];
writeFileSync(resolve(reviewDirectory, "pnc-002-cp012-question-explanation-review.csv"), `${csvRows.join("\n")}\n`, "utf8");
writeFileSync(resolve(reviewDirectory, "pnc-002-cp012-readiness.json"), `${JSON.stringify({
  canonicalProblemId: "PNC-CP-012",
  verdict: "SATURATED_FOR_CURRENT_ENGLISH_OWNERSHIP",
  qlRange: ["PNC-QL-242", "PNC-QL-269"],
  activeQlCount: entries.length,
  activeSolveModeCount: new Set(entries.map((entry) => entry.solveMode)).size,
  difficulty: { Easy: 2, Medium: 12, Hard: 14 },
  generatedCases,
  generatedTwicePerCase: true,
  reviewedTexCases,
  distinctRenderedStems: renderedStems.size,
  answerPositions: [...answerPositions].sort(),
  familyCoverage,
  reviewRows: reviewRows.length,
  audit,
  publiclyPublishable: false,
  status: "PASS",
}, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  packageId: "PNC-002",
  canonicalProblemId: "PNC-CP-012",
  checkpoint: "FINAL_MIXED_ADVANCED_RUNTIME_PROOF",
  activeQlCount: entries.length,
  activeSolveModeCount: new Set(entries.map((entry) => entry.solveMode)).size,
  generatedCases,
  generatedTwicePerCase: true,
  reviewedTexCases,
  distinctRenderedStems: renderedStems.size,
  answerPositions: [...answerPositions].sort(),
  familyCoverage,
  reviewRows: reviewRows.length,
  audit,
  status: "PASS",
}, null, 2));
