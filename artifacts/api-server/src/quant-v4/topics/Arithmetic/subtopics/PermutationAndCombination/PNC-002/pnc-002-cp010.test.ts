import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { auditPnc002Cp010Coverage } from "./foundation/coverage-auditor-cp010";
import { getPnc002QuestionEntries } from "./foundation/library";
import { runPnc002Pipeline } from "./foundation/pipeline";
import {
  countCircularAlternationExact,
  countCircularAtLeastOnePairTogetherExact,
  countCircularBlockWithExternalPairApartExact,
  countCircularMultipleBlocksTogetherExact,
  countCircularNeitherPairTogetherExact,
  countCircularNoTwoCategoryAdjacentExact,
  countCircularSpecifiedBlockApartExact,
  countCircularSpecifiedBlockTogetherExact,
  countCircularTwoBlocksNotAdjacentExact,
  countClockwiseAdjacentPairExact,
  countClockwiseAtLeastGapExact,
  countClockwiseAtMostGapExact,
  countClockwiseExactGapExact,
  countDihedralDistinctOrnamentsExact,
  countDihedralPairTogetherExact,
  countOppositePairExact,
  countPersonBetweenTwoNeighborsExact,
  countPrescribedClockwiseOrderExact,
  countRotationOnlyOrnamentsExact,
  countRoundTableDistinctExact,
} from "./foundation/solver-cp010";
import {
  countCircularDistinctNeighborSetsExact,
  countCircularExactlyOnePairTogetherExact,
  countCircularSelectionDihedralExact,
  countCircularSelectionRotationOnlyExact,
} from "./foundation/solver-cp010-saturation";
import type { Pnc002QuestionPackage, Pnc002ValidationResult } from "./foundation/types";

function failedChecks(validation: Pnc002ValidationResult): string {
  return validation.checks
    .filter((item) => !item.passed)
    .map((item) => `${item.name}: ${item.message}`)
    .join(" | ");
}
function numericOptions(pkg: Pnc002QuestionPackage): Set<number> {
  return new Set(pkg.options.map(Number));
}

const entries = getPnc002QuestionEntries().filter((entry) => entry.cpId === "PNC-CP-010");
const checkpointIds = Array.from({ length: 32 }, (_, index) => `PNC-QL-${String(index + 177).padStart(3, "0")}`);
assert.equal(entries.length, 32);
assert.deepEqual(entries.map((entry) => entry.qlId), checkpointIds);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, 32);
const difficultyCounts = Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length]));
assert.deepEqual(difficultyCounts, { Easy: 3, Medium: 15, Hard: 14 });
const solveModeCounts = Object.fromEntries([...new Set(entries.map((entry) => entry.solveMode))].map((solveMode) => [solveMode, entries.filter((entry) => entry.solveMode === solveMode).length]));
assert.equal(Object.keys(solveModeCounts).length, 25);

assert.equal(countRoundTableDistinctExact(6), 120);
assert.equal(countCircularSpecifiedBlockTogetherExact(7, 3), 144);
assert.equal(countCircularSpecifiedBlockApartExact(7, 2), 480);
assert.equal(countCircularMultipleBlocksTogetherExact(8, [2, 2]), 480);
assert.equal(countCircularMultipleBlocksTogetherExact(8, [2, 3]), 288);
assert.equal(countCircularBlockWithExternalPairApartExact(8, 2), 960);
assert.equal(countCircularTwoBlocksNotAdjacentExact(8, [2, 2]), 288);
assert.equal(countCircularAtLeastOnePairTogetherExact(8), 2400);
assert.equal(countCircularNeitherPairTogetherExact(8), 2640);
assert.equal(countCircularExactlyOnePairTogetherExact(8), 1920);
assert.equal(countPersonBetweenTwoNeighborsExact(7), 48);
assert.equal(countOppositePairExact(8), 720);
assert.equal(countClockwiseAdjacentPairExact(7), 120);
assert.equal(countClockwiseExactGapExact(7, 2), 120);
assert.equal(countClockwiseAtLeastGapExact(8, 2), 3600);
assert.equal(countClockwiseAtMostGapExact(8, 2), 2160);
assert.equal(countPrescribedClockwiseOrderExact(8, 4), 840);
assert.equal(countCircularAlternationExact(4), 144);
assert.equal(countCircularNoTwoCategoryAdjacentExact(5, 3), 1440);
assert.equal(countRotationOnlyOrnamentsExact(7), 720);
assert.equal(countDihedralDistinctOrnamentsExact(7), 360);
assert.equal(countDihedralPairTogetherExact(7), 120);
assert.equal(countCircularSelectionRotationOnlyExact(6, 4), 90);
assert.equal(countCircularSelectionDihedralExact(6, 4), 45);
assert.equal(countCircularDistinctNeighborSetsExact(6), 60);

for (const qlId of checkpointIds) {
  const sample = runPnc002Pipeline({ questionLanguageId: qlId, seed: `cp010-contract:${qlId}` });
  assert.equal(sample.canonicalProblemId, "PNC-CP-010");
  assert.equal(sample.taskKind, "circularArrangement");
  assert.equal(sample.independentVerification.answer, sample.solver.numericAnswer, `${qlId} independent verifier`);
  assert.equal(sample.validation.valid, true, `${qlId}: ${failedChecks(sample.validation)}`);
}
assert.equal(runPnc002Pipeline({ questionLanguageId: "PNC-QL-199", seed: "cp010-round-inverse" }).solver.evidence.recoveredParameter, "circularObjects");
assert.equal(runPnc002Pipeline({ questionLanguageId: "PNC-QL-200", seed: "cp010-pair-inverse" }).solver.evidence.recoveredParameter, "circularObjects");
assert.equal(runPnc002Pipeline({ questionLanguageId: "PNC-QL-201", seed: "cp010-rotation-contract" }).solver.evidence.reflectionSymmetryDivisor, 1);
assert.equal(runPnc002Pipeline({ questionLanguageId: "PNC-QL-202", seed: "cp010-reflection-contract" }).solver.evidence.reflectionSymmetryDivisor, 2);
assert.equal(runPnc002Pipeline({ questionLanguageId: "PNC-QL-204", seed: "cp010-block-apart-saturation" }).solver.evidence.operation, "CIRCULAR_BLOCK_APART");
assert.equal(runPnc002Pipeline({ questionLanguageId: "PNC-QL-205", seed: "cp010-exclusive-pair-saturation" }).solver.evidence.operation, "CIRCULAR_EXACTLY_ONE_PAIR");

const rotationSelection = runPnc002Pipeline({ questionLanguageId: "PNC-QL-206", seed: "cp010-selection-rotation" });
assert.equal(rotationSelection.solver.evidence.operation, "CIRCULAR_SELECTION_ROTATION_ONLY");
const rotationSelectionOptions = numericOptions(rotationSelection);
const rotationSelectedCount = rotationSelection.solver.evidence.selectedObjectCount ?? 0;
const rotationChooseOnly = rotationSelection.solver.evidence.selectionCount ?? 0;
assert.equal(rotationSelectionOptions.has(rotationSelection.solver.numericAnswer * rotationSelectedCount), true, "QL-206 must include the linear nPr trap");
assert.equal(rotationSelectionOptions.has(rotationChooseOnly), true, "QL-206 must include the choose-only trap");

const dihedralSelection = runPnc002Pipeline({ questionLanguageId: "PNC-QL-207", seed: "cp010-selection-dihedral" });
assert.equal(dihedralSelection.solver.evidence.operation, "CIRCULAR_SELECTION_DIHEDRAL");
const dihedralSelectionOptions = numericOptions(dihedralSelection);
const dihedralSelectedCount = dihedralSelection.solver.evidence.selectedObjectCount ?? 0;
assert.equal(dihedralSelectionOptions.has(dihedralSelection.solver.numericAnswer * 2), true, "QL-207 must include the rotation-only trap");
assert.equal(dihedralSelectionOptions.has(dihedralSelection.solver.numericAnswer * 2 * dihedralSelectedCount), true, "QL-207 must include the linear nPr trap");
assert.equal(dihedralSelectionOptions.has(dihedralSelection.solver.numericAnswer * dihedralSelectedCount), true, "QL-207 must include the reflection-only linear trap");

const neighborSets = runPnc002Pipeline({ questionLanguageId: "PNC-QL-208", seed: "cp010-neighbor-sets" });
assert.equal(neighborSets.solver.evidence.operation, "CIRCULAR_DISTINCT_NEIGHBOR_SETS");
const neighborSetOptions = numericOptions(neighborSets);
const neighborTotal = neighborSets.solver.evidence.totalObjects;
assert.equal(neighborSetOptions.has(factorialExact(neighborTotal - 1)), true, "QL-208 must include ordinary circular seating");
assert.equal(neighborSetOptions.has(Math.floor(factorialExact(neighborTotal) / 2)), true, "QL-208 must include linear division by two");
assert.equal(neighborSetOptions.has(factorialExact(neighborTotal)), true, "QL-208 must include unrestricted linear seating");

let generatedCases = 0;
for (const entry of entries) {
  for (let seedIndex = 0; seedIndex < 8; seedIndex += 1) {
    const seed = `pnc-002-cp010-proof:${entry.qlId}:${seedIndex}`;
    const first = runPnc002Pipeline({ questionLanguageId: entry.qlId, seed });
    const second = runPnc002Pipeline({ questionLanguageId: entry.qlId, seed });
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
    generatedCases += 1;
  }
}
assert.equal(generatedCases, 256);
assert.throws(() => runPnc002Pipeline({ questionLanguageId: "PNC-QL-177", language: "hi", seed: "unsupported-hi" }), /not implemented/);
assert.throws(() => runPnc002Pipeline({ questionLanguageId: "PNC-QL-177", language: "pa", seed: "unsupported-pa" }), /not implemented/);
const audit = auditPnc002Cp010Coverage();
assert.equal(audit.passed, true, JSON.stringify(audit, null, 2));

const reviewDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-002-cp010-review");
mkdirSync(reviewDirectory, { recursive: true });
const reviewRows = entries.map((entry) => {
  const generated = runPnc002Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-002-cp010-review:${entry.qlId}` });
  return { qlId: entry.qlId, cpId: entry.cpId, difficulty: entry.difficulty, solveMode: entry.solveMode, stem: generated.stem, options: generated.options, correctIndex: generated.correctIndex, answer: generated.answer, equation: generated.solver.equation, mathJax: generated.solver.mathJax, explanation: generated.explanation.lines, validation: generated.validation.valid, mathematicalFingerprint: generated.mathematicalFingerprint };
});
writeFileSync(resolve(reviewDirectory, "pnc-002-cp010-question-explanation-review.json"), `${JSON.stringify(reviewRows, null, 2)}\n`, "utf8");
function csvCell(value: unknown): string { const text = String(value ?? "").replace(/\r?\n/g, "\\n"); return `"${text.replace(/"/g, '""')}"`; }
const columns = ["qlId", "cpId", "difficulty", "solveMode", "stem", "options", "correctIndex", "answer", "equation", "mathJax", "explanation", "validation", "mathematicalFingerprint"] as const;
const csvRows = [columns.map(csvCell).join(","), ...reviewRows.map((row) => columns.map((column) => csvCell(Array.isArray(row[column]) ? row[column].join("\n") : row[column])).join(","))];
writeFileSync(resolve(reviewDirectory, "pnc-002-cp010-question-explanation-review.csv"), `${csvRows.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ packageId: "PNC-002", canonicalProblemId: "PNC-CP-010", activeQlCount: entries.length, activeSolveModeCount: Object.keys(solveModeCounts).length, generatedCases, generatedTwicePerCase: true, reviewRows: reviewRows.length, audit, status: "PASS" }, null, 2));
