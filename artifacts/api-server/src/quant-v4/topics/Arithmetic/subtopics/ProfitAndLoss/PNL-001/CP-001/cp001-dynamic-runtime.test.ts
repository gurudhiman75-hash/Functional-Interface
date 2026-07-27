import assert from "node:assert/strict";

import {
  listPnlCp001DynamicQlIds,
  runPnlCp001DynamicPipeline,
} from "./cp001-dynamic-runtime";

const qlIds = listPnlCp001DynamicQlIds();
const expectedQlIds = Array.from(
  { length: 36 },
  (_, index) => `PNL-QL-${String(index + 1).padStart(3, "0")}`,
);
const fixedAnswerQlIds = new Set(["PNL-QL-035"]);
const unresolvedProsePlaceholder = /\{[a-z][A-Za-z0-9_]*\}/;

assert.deepEqual(qlIds, expectedQlIds, "CP-001 must expose the frozen 36-QL range.");

const seedsPerQl = 24;
let generatedCount = 0;
const difficultyCounts = new Map<string, number>();

for (const qlId of qlIds) {
  const stems = new Set<string>();
  const answers = new Set<string>();

  for (let seedIndex = 0; seedIndex < seedsPerQl; seedIndex += 1) {
    const seed = `cp001-proof-${seedIndex}`;
    const input = {
      questionLanguageId: qlId,
      language: "en" as const,
      seed,
    };
    const first = runPnlCp001DynamicPipeline(input);
    const second = runPnlCp001DynamicPipeline(input);

    assert.deepEqual(second, first, `${qlId}/${seed}: regeneration must be deterministic.`);
    assert.equal(first.archetypeId, "PNL-001");
    assert.equal(first.canonicalProblemId, "PNL-CP-001");
    assert.equal(first.questionLanguageId, qlId);
    assert.equal(first.language, "en");
    assert.equal(first.parameters.runtimeMode, "DYNAMIC_CANDIDATE");
    assert.equal(first.parameters.reviewStatus, "UNREVIEWED_DYNAMIC_CANDIDATE");
    assert.equal(first.parameters.questionBankStatus, "NOT_STORED");
    assert.equal(first.parameters.testEligibility, "INELIGIBLE");
    assert.equal(first.parameters.publiclyPublishable, false);
    assert.equal(first.traceability.generationMode, "DYNAMIC_CANDIDATE");
    assert.equal(first.solver.evidence.independentVerifier, "PASS");
    assert.equal(first.validation.valid, true);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4, `${qlId}/${seed}: options must be unique.`);
    assert.ok(first.correctIndex >= 0 && first.correctIndex < 4);
    assert.equal(first.options[first.correctIndex], first.answer);
    assert.ok(first.stem.trim().length > 20, `${qlId}/${seed}: stem is unexpectedly short.`);
    assert.ok(first.explanation.lines.length >= 2, `${qlId}/${seed}: explanation is incomplete.`);
    assert.doesNotMatch(first.stem, unresolvedProsePlaceholder);
    assert.doesNotMatch(first.explanation.lines.join("\n"), unresolvedProsePlaceholder);

    stems.add(first.stem);
    answers.add(first.answer);
    difficultyCounts.set(
      first.difficultyBand,
      (difficultyCounts.get(first.difficultyBand) ?? 0) + 1,
    );
    generatedCount += 1;
  }

  assert.ok(stems.size >= 2, `${qlId}: seed sweep did not vary the rendered stem.`);
  if (!fixedAnswerQlIds.has(qlId)) {
    assert.ok(answers.size >= 2, `${qlId}: seed sweep did not vary the answer.`);
  } else {
    assert.deepEqual([...answers], ["No profit, no loss"]);
  }
}

for (const difficultyBand of ["Easy", "Medium", "Hard"] as const) {
  for (let seedIndex = 0; seedIndex < 12; seedIndex += 1) {
    const generated = runPnlCp001DynamicPipeline({
      difficultyBand,
      seed: `difficulty-${difficultyBand}-${seedIndex}`,
    });
    assert.equal(generated.difficultyBand, difficultyBand);
  }
}

assert.throws(
  () => runPnlCp001DynamicPipeline({ questionLanguageId: "PNL-QL-999" }),
  /Unknown CP-001 question-language ID/,
);
assert.throws(
  () => runPnlCp001DynamicPipeline({ language: "hi" as never }),
  /supports English only/,
);

console.log(
  JSON.stringify(
    {
      ok: true,
      cpId: "PNL-CP-001",
      qlCount: qlIds.length,
      seedsPerQl,
      generatedCount,
      difficultyCounts: Object.fromEntries(difficultyCounts),
      runtimeMode: "DYNAMIC_CANDIDATE",
      publicationSafety: {
        questionBankStatus: "NOT_STORED",
        testEligibility: "INELIGIBLE",
        publiclyPublishable: false,
      },
    },
    null,
    2,
  ),
);
