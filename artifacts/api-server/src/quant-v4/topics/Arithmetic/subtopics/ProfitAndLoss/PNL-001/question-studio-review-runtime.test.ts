import assert from "node:assert/strict";
import {
  PNL_001_CP_IDS,
  getPnl001ActiveCanonicalProblemIds,
  listPnl001CanonicalReviewEntries,
  runPnl001ReviewPipeline,
} from "./question-studio-review-runtime";

const entries = listPnl001CanonicalReviewEntries();
assert.equal(entries.length, 186);
assert.deepEqual(getPnl001ActiveCanonicalProblemIds(), [...PNL_001_CP_IDS]);

const expectedCounts = new Map([
  ["PNL-CP-001", 36],
  ["PNL-CP-002", 34],
  ["PNL-CP-003", 24],
  ["PNL-CP-004", 26],
  ["PNL-CP-005", 29],
  ["PNL-CP-006", 37],
]);
for (const cpId of PNL_001_CP_IDS) {
  assert.equal(entries.filter((entry) => entry.cpId === cpId).length, expectedCounts.get(cpId));
}

assert.deepEqual(
  entries.map((entry) => entry.qlId),
  Array.from({ length: 186 }, (_, index) => `PNL-QL-${String(index + 1).padStart(3, "0")}`),
);
assert.equal(new Set(entries.map((entry) => entry.stem)).size, 186);

const unresolvedProsePlaceholder = /\{[A-Za-z][A-Za-z0-9_]*\}/;
const syntheticOpening =
  /^(?:consider this|during this|the following (?:commercial )?(?:situation|record|information)|use the following information|the records show)/i;

for (const entry of entries) {
  assert.equal(entry.options.length, 4, `${entry.qlId}: option count`);
  assert.equal(new Set(entry.options).size, 4, `${entry.qlId}: duplicate option`);
  assert.equal(entry.options[entry.correctIndex], entry.answer, `${entry.qlId}: answer key`);
  assert.ok(entry.stem.trim().length >= 20, `${entry.qlId}: empty/short stem`);
  assert.ok(entry.explanation.trim().length >= 80, `${entry.qlId}: shallow explanation`);
  const proseStem = entry.stem.replace(/\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/g, "");
  assert.equal(unresolvedProsePlaceholder.test(proseStem), false, `${entry.qlId}: unresolved prose placeholder`);
  assert.equal(syntheticOpening.test(entry.stem.trim()), false, `${entry.qlId}: synthetic opening`);
  assert.equal(entry.safety.reviewStatus, "APPROVED_EDITORIAL_CANONICAL");
  assert.equal(entry.safety.questionBankStatus, "NOT_STORED");
  assert.equal(entry.safety.testEligibility, "INELIGIBLE");
  assert.equal(entry.safety.publiclyPublishable, false);

  const pkg = runPnl001ReviewPipeline(entry.cpId, {
    questionLanguageId: entry.qlId,
    seed: `proof:${entry.qlId}`,
  });
  assert.equal(pkg.questionLanguageId, entry.qlId);
  assert.equal(pkg.answer, entry.answer);
  assert.deepEqual(pkg.options, entry.options);
  assert.equal(pkg.correctIndex, entry.correctIndex);
  assert.equal(pkg.validation.valid, true);
  assert.equal(pkg.traceability.generationMode, "CANONICAL_REVIEW");
  assert.equal(pkg.traceability.questionBankStatus, "NOT_STORED");
  assert.equal(pkg.traceability.testEligibility, "INELIGIBLE");
  assert.equal(pkg.traceability.publiclyPublishable, false);
}

for (const cpId of PNL_001_CP_IDS) {
  const first = runPnl001ReviewPipeline(cpId, { seed: "deterministic-seed" });
  const second = runPnl001ReviewPipeline(cpId, { seed: "deterministic-seed" });
  assert.equal(first.questionLanguageId, second.questionLanguageId);
  assert.equal(first.stem, second.stem);

  for (const difficultyBand of ["Easy", "Medium", "Hard"] as const) {
    const eligible = entries.some(
      (entry) => entry.cpId === cpId && entry.difficulty === difficultyBand,
    );
    if (!eligible) continue;
    const pkg = runPnl001ReviewPipeline(cpId, {
      difficultyBand,
      seed: `${cpId}:${difficultyBand}`,
    });
    assert.equal(pkg.difficultyBand, difficultyBand);
  }
}

assert.throws(
  () => runPnl001ReviewPipeline("PNL-CP-001", { language: "hi" as never }),
  /English only/,
);
assert.throws(
  () =>
    runPnl001ReviewPipeline("PNL-CP-001", {
      questionLanguageId: "PNL-QL-095",
    }),
  /belongs to PNL-CP-004/,
);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      runtimeMode: "CANONICAL_REVIEW",
      qlCount: entries.length,
      cpCounts: Object.fromEntries(
        PNL_001_CP_IDS.map((cpId) => [
          cpId,
          entries.filter((entry) => entry.cpId === cpId).length,
        ]),
      ),
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
    null,
    2,
  ),
);
