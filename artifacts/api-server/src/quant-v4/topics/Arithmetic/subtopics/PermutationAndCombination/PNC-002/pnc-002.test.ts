import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { auditPnc002Coverage } from "./foundation/coverage-auditor";
import { getPnc002QuestionEntries } from "./foundation/library";
import { runPnc002Pipeline } from "./foundation/pipeline";
import {
  countBlockWithExternalPairApartExact,
  countBlockWithOutsiderNotAdjacentExact,
  countMultipleBlocksTogetherExact,
  countNotAllSpecifiedBlocksTogetherExact,
  countOneBlockTogetherOtherNotTogetherExact,
  countSingleBlockNotTogetherExact,
  countSingleBlockTogetherExact,
  countTwoBlocksTogetherNotAdjacentExact,
} from "./foundation/solver";

const entries = getPnc002QuestionEntries().filter((entry) => entry.cpId === "PNC-CP-007");
const checkpointIds = Array.from({ length: 18 }, (_, index) => `PNC-QL-${String(index + 107).padStart(3, "0")}`);
assert.equal(entries.length, 18);
assert.deepEqual(entries.map((entry) => entry.qlId), checkpointIds);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, 18);
const difficultyCounts = Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length]));
assert.deepEqual(difficultyCounts, { Easy: 1, Medium: 8, Hard: 9 });
const solveModeCounts = Object.fromEntries([...new Set(entries.map((entry) => entry.solveMode))].map((solveMode) => [solveMode, entries.filter((entry) => entry.solveMode === solveMode).length]));
assert.deepEqual(solveModeCounts, {
  countSingleBlockTogether: 2,
  countSingleBlockNotTogether: 2,
  countMultipleBlocksTogether: 4,
  countBlockWithExternalPairApart: 1,
  recoverBlockRestrictionParameter: 4,
  countTwoBlocksTogetherNotAdjacent: 2,
  countBlockWithOutsiderNotAdjacent: 1,
  countOneBlockTogetherOtherNotTogether: 1,
  countNotAllSpecifiedBlocksTogether: 1,
});
assert.equal(countSingleBlockTogetherExact(7, 2), 1440);
assert.equal(countSingleBlockNotTogetherExact(7, 2), 3600);
assert.equal(countMultipleBlocksTogetherExact(8, [2, 3]), 1440);
assert.equal(countBlockWithExternalPairApartExact(8, 3), 2880);
assert.equal(countTwoBlocksTogetherNotAdjacentExact(7, [2, 2]), 288);
assert.equal(countTwoBlocksTogetherNotAdjacentExact(8, [2, 3]), 864);
assert.equal(countBlockWithOutsiderNotAdjacentExact(8, 3), 2880);
assert.equal(countOneBlockTogetherOtherNotTogetherExact(8, [2, 3]), 8640);
assert.equal(countNotAllSpecifiedBlocksTogetherExact(7, [2, 2]), 4560);
for (const qlId of ["PNC-QL-116", "PNC-QL-117", "PNC-QL-118", "PNC-QL-124"]) {
  const inverse = runPnc002Pipeline({ questionLanguageId: qlId, seed: `inverse-proof:${qlId}` });
  assert.equal(inverse.solver.evidence.operation, "BLOCK_INVERSE");
  assert.equal(inverse.independentVerification.answer, inverse.solver.numericAnswer);
  assert.equal(inverse.validation.valid, true);
}
let generatedCases = 0;
for (const entry of entries) {
  for (let seedIndex = 0; seedIndex < 12; seedIndex += 1) {
    const seed = `pnc-002-cp007-proof:${entry.qlId}:${seedIndex}`;
    const first = runPnc002Pipeline({ questionLanguageId: entry.qlId, seed });
    const second = runPnc002Pipeline({ questionLanguageId: entry.qlId, seed });
    assert.deepEqual(second.parameters, first.parameters);
    assert.equal(second.stem, first.stem);
    assert.deepEqual(second.options, first.options);
    assert.deepEqual(second.explanation, first.explanation);
    assert.equal(first.validation.valid, true, `${entry.qlId}: ${first.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",")}`);
    assert.equal(first.independentVerification.answer, first.solver.numericAnswer);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4);
    assert.equal(first.options[first.correctIndex], first.answer);
    assert.equal(first.publiclyPublishable, false);
    generatedCases += 1;
  }
}
assert.throws(() => runPnc002Pipeline({ questionLanguageId: "PNC-QL-107", language: "hi", seed: "unsupported-hi" }), /not implemented/);
assert.throws(() => runPnc002Pipeline({ questionLanguageId: "PNC-QL-107", language: "pa", seed: "unsupported-pa" }), /not implemented/);
const audit = auditPnc002Coverage();
assert.equal(audit.passed, true, JSON.stringify(audit, null, 2));
const reviewDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-002-cp007-review");
mkdirSync(reviewDirectory, { recursive: true });
const reviewRows = entries.map((entry) => {
  const generated = runPnc002Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-002-review:${entry.qlId}` });
  return { qlId: entry.qlId, cpId: entry.cpId, difficulty: entry.difficulty, solveMode: entry.solveMode, stem: generated.stem, options: generated.options, correctIndex: generated.correctIndex, answer: generated.answer, equation: generated.solver.equation, mathJax: generated.solver.mathJax, explanation: generated.explanation.lines, validation: generated.validation.valid, mathematicalFingerprint: generated.mathematicalFingerprint };
});
writeFileSync(resolve(reviewDirectory, "pnc-002-cp007-question-explanation-review.json"), `${JSON.stringify(reviewRows, null, 2)}\n`, "utf8");
function csvCell(value: unknown): string { const text = String(value ?? "").replace(/\r?\n/g, "\\n"); return `"${text.replace(/"/g, '""')}"`; }
const columns = ["qlId", "cpId", "difficulty", "solveMode", "stem", "options", "correctIndex", "answer", "equation", "mathJax", "explanation", "validation", "mathematicalFingerprint"] as const;
const csvRows = [columns.map(csvCell).join(","), ...reviewRows.map((row) => columns.map((column) => csvCell(Array.isArray(row[column]) ? row[column].join("\n") : row[column])).join(","))];
writeFileSync(resolve(reviewDirectory, "pnc-002-cp007-question-explanation-review.csv"), `${csvRows.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ packageId: "PNC-002", canonicalProblemId: "PNC-CP-007", activeQlCount: entries.length, activeSolveModeCount: Object.keys(solveModeCounts).length, generatedCases, generatedTwicePerCase: true, reviewRows: reviewRows.length, audit, status: "PASS" }, null, 2));
