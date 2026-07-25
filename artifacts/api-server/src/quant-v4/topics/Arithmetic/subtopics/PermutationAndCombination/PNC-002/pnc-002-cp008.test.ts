import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { auditPnc002Cp008Coverage } from "./foundation/coverage-auditor-cp008";
import { getPnc002QuestionEntries } from "./foundation/library";
import { runPnc002Pipeline } from "./foundation/pipeline";
import {
  countAtLeastGapBetweenPairExact,
  countExactGapBetweenPairExact,
  countIndependentRelativeOrderChainsExact,
  countNoTwoCategoryMembersAdjacentExact,
  countObjectAtEitherEndExact,
  countObjectAtExactPositionExact,
  countObjectExcludedFromEndsExact,
  countPrescribedRelativeOrderExact,
  countSpecifiedObjectsAtBothEndsExact,
  countSpecifiedObjectsInPositionClassExact,
  countStrictAlternationExact,
} from "./foundation/solver-cp008";
import {
  countAtLeastSpecifiedObjectsInPositionClassExact,
  countAtMostGapBetweenPairExact,
  countDirectionalExactGapBetweenPairExact,
  countObjectsAtPrescribedPositionsExact,
  countSpecifiedSetInPositionSetExact,
} from "./foundation/solver-cp008-saturation";

const entries = getPnc002QuestionEntries().filter((entry) => entry.cpId === "PNC-CP-008");
const checkpointIds = Array.from({ length: 23 }, (_, index) => `PNC-QL-${String(index + 125).padStart(3, "0")}`);
assert.equal(entries.length, 23);
assert.deepEqual(entries.map((entry) => entry.qlId), checkpointIds);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, 23);
const difficultyCounts = Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length]));
assert.deepEqual(difficultyCounts, { Easy: 4, Medium: 11, Hard: 8 });
const solveModeCounts = Object.fromEntries([...new Set(entries.map((entry) => entry.solveMode))].map((solveMode) => [solveMode, entries.filter((entry) => entry.solveMode === solveMode).length]));
assert.deepEqual(solveModeCounts, {
  countObjectAtExactPosition: 1,
  countObjectAtEitherEnd: 1,
  countSpecifiedObjectsAtBothEnds: 1,
  countObjectExcludedFromEnds: 1,
  countPrescribedRelativeOrder: 3,
  countIndependentRelativeOrderChains: 1,
  countStrictAlternation: 3,
  countNoTwoCategoryMembersAdjacent: 2,
  countExactGapBetweenPair: 1,
  countAtLeastGapBetweenPair: 1,
  countSpecifiedObjectsInPositionClass: 2,
  recoverPositionGapParameter: 1,
  countObjectsAtPrescribedPositions: 1,
  countSpecifiedSetInPositionSet: 1,
  countAtMostGapBetweenPair: 1,
  countDirectionalExactGapBetweenPair: 1,
  countAtLeastSpecifiedObjectsInPositionClass: 1,
});
assert.equal(countObjectAtExactPositionExact(7), 720);
assert.equal(countObjectAtEitherEndExact(7), 1440);
assert.equal(countSpecifiedObjectsAtBothEndsExact(7), 240);
assert.equal(countObjectExcludedFromEndsExact(7), 3600);
assert.equal(countPrescribedRelativeOrderExact(7, 3), 840);
assert.equal(countIndependentRelativeOrderChainsExact(7, [2, 2]), 1260);
assert.equal(countStrictAlternationExact(3, 3, 2), 72);
assert.equal(countStrictAlternationExact(4, 3, 1), 144);
assert.equal(countNoTwoCategoryMembersAdjacentExact(4, 3), 1440);
assert.equal(countExactGapBetweenPairExact(8, 2), 7200);
assert.equal(countAtLeastGapBetweenPairExact(8, 2), 21600);
assert.equal(countSpecifiedObjectsInPositionClassExact(8, 3, 3, 4), 2880);
assert.equal(countSpecifiedObjectsInPositionClassExact(8, 4, 2, 4), 20736);
assert.equal(countObjectsAtPrescribedPositionsExact(8, 3), 120);
assert.equal(countSpecifiedSetInPositionSetExact(8, 3), 720);
assert.equal(countAtMostGapBetweenPairExact(8, 2), 25920);
assert.equal(countDirectionalExactGapBetweenPairExact(8, 2), 3600);
assert.deepEqual(countAtLeastSpecifiedObjectsInPositionClassExact(8, 4, 2, 4), {
  answer: 30528,
  acceptedClassCounts: [2, 3, 4],
  caseCounts: [20736, 9216, 576],
});

for (const qlId of checkpointIds) {
  const sample = runPnc002Pipeline({ questionLanguageId: qlId, seed: `cp008-contract:${qlId}` });
  assert.equal(sample.canonicalProblemId, "PNC-CP-008");
  assert.equal(sample.taskKind, "linearPositionGapRestriction");
  assert.equal(sample.independentVerification.answer, sample.solver.numericAnswer);
  assert.equal(sample.validation.valid, true, `${qlId}: ${sample.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",")}`);
}
const inverse = runPnc002Pipeline({ questionLanguageId: "PNC-QL-142", seed: "cp008-inverse-proof" });
assert.equal(inverse.solver.evidence.operation, "POSITION_GAP_INVERSE");
assert.equal(inverse.solver.evidence.recoveredParameter, "gap");

const prescribedPositions = runPnc002Pipeline({ questionLanguageId: "PNC-QL-143", seed: "cp008-prescribed-positions-proof" });
assert.equal(prescribedPositions.solver.evidence.operation, "OBJECTS_AT_PRESCRIBED_POSITIONS");
assert.equal(prescribedPositions.solver.evidence.prescribedObjectCount, 3);
const positionSet = runPnc002Pipeline({ questionLanguageId: "PNC-QL-144", seed: "cp008-position-set-proof" });
assert.equal(positionSet.solver.evidence.operation, "SPECIFIED_SET_IN_POSITION_SET");
assert.equal(positionSet.solver.evidence.positionSetAssignmentCount, 6);
const atMostGap = runPnc002Pipeline({ questionLanguageId: "PNC-QL-145", seed: "cp008-at-most-gap-proof" });
assert.equal(atMostGap.solver.evidence.operation, "AT_MOST_GAP_BETWEEN_PAIR");
const directionalGap = runPnc002Pipeline({ questionLanguageId: "PNC-QL-146", seed: "cp008-directional-gap-proof" });
assert.equal(directionalGap.solver.evidence.operation, "DIRECTIONAL_EXACT_GAP");
const atLeastPositionClass = runPnc002Pipeline({ questionLanguageId: "PNC-QL-147", seed: "cp008-at-least-position-class-proof" });
assert.equal(atLeastPositionClass.solver.evidence.operation, "AT_LEAST_SPECIFIED_IN_POSITION_CLASS");
assert.ok((atLeastPositionClass.solver.evidence.acceptedClassCounts?.length ?? 0) >= 1);

let generatedCases = 0;
for (const entry of entries) {
  for (let seedIndex = 0; seedIndex < 12; seedIndex += 1) {
    const seed = `pnc-002-cp008-proof:${entry.qlId}:${seedIndex}`;
    const first = runPnc002Pipeline({ questionLanguageId: entry.qlId, seed });
    const second = runPnc002Pipeline({ questionLanguageId: entry.qlId, seed });
    assert.deepEqual(second.parameters, first.parameters, `${entry.qlId} parameter determinism`);
    assert.equal(second.stem, first.stem, `${entry.qlId} stem determinism`);
    assert.deepEqual(second.options, first.options, `${entry.qlId} option determinism`);
    assert.deepEqual(second.explanation, first.explanation, `${entry.qlId} explanation determinism`);
    assert.equal(first.validation.valid, true, `${entry.qlId}: ${first.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",")}`);
    assert.equal(first.independentVerification.answer, first.solver.numericAnswer);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4);
    assert.equal(first.options[first.correctIndex], first.answer);
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.traceability.formulaRendering, "LATEX_MATHJAX");
    generatedCases += 1;
  }
}
assert.equal(generatedCases, 276);
assert.throws(() => runPnc002Pipeline({ questionLanguageId: "PNC-QL-125", language: "hi", seed: "unsupported-hi" }), /not implemented/);
assert.throws(() => runPnc002Pipeline({ questionLanguageId: "PNC-QL-125", language: "pa", seed: "unsupported-pa" }), /not implemented/);
const audit = auditPnc002Cp008Coverage();
assert.equal(audit.passed, true, JSON.stringify(audit, null, 2));

const reviewDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-002-cp008-review");
mkdirSync(reviewDirectory, { recursive: true });
const reviewRows = entries.map((entry) => {
  const generated = runPnc002Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-002-cp008-review:${entry.qlId}` });
  return { qlId: entry.qlId, cpId: entry.cpId, difficulty: entry.difficulty, solveMode: entry.solveMode, stem: generated.stem, options: generated.options, correctIndex: generated.correctIndex, answer: generated.answer, equation: generated.solver.equation, mathJax: generated.solver.mathJax, explanation: generated.explanation.lines, validation: generated.validation.valid, mathematicalFingerprint: generated.mathematicalFingerprint };
});
writeFileSync(resolve(reviewDirectory, "pnc-002-cp008-question-explanation-review.json"), `${JSON.stringify(reviewRows, null, 2)}\n`, "utf8");
function csvCell(value: unknown): string { const text = String(value ?? "").replace(/\r?\n/g, "\\n"); return `"${text.replace(/"/g, '""')}"`; }
const columns = ["qlId", "cpId", "difficulty", "solveMode", "stem", "options", "correctIndex", "answer", "equation", "mathJax", "explanation", "validation", "mathematicalFingerprint"] as const;
const csvRows = [columns.map(csvCell).join(","), ...reviewRows.map((row) => columns.map((column) => csvCell(Array.isArray(row[column]) ? row[column].join("\n") : row[column])).join(","))];
writeFileSync(resolve(reviewDirectory, "pnc-002-cp008-question-explanation-review.csv"), `${csvRows.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ packageId: "PNC-002", canonicalProblemId: "PNC-CP-008", activeQlCount: entries.length, activeSolveModeCount: Object.keys(solveModeCounts).length, generatedCases, generatedTwicePerCase: true, reviewRows: reviewRows.length, audit, status: "PASS" }, null, 2));
