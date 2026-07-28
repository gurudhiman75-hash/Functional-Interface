import assert from "node:assert/strict";

import {
  listPnlCp004DynamicQlIds,
  runPnlCp004DynamicPipeline,
} from "./cp004-dynamic-runtime";

const qlIds = listPnlCp004DynamicQlIds();
assert.equal(qlIds.length, 26, "CP-004 must expose all 26 frozen QLs.");
assert.deepEqual(
  qlIds,
  Array.from(
    { length: 26 },
    (_, index) => `PNL-QL-${String(index + 95).padStart(3, "0")}`,
  ),
);

const seeds = Array.from(
  { length: 24 },
  (_, index) => `cp004-proof-seed-${index + 1}`,
);
const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
let generatedCount = 0;
let profitStemCount = 0;
let lossStemCount = 0;

for (const qlId of qlIds) {
  const stems = new Set<string>();
  const answers = new Set<string>();

  for (const seed of seeds) {
    const pkg = runPnlCp004DynamicPipeline({
      questionLanguageId: qlId,
      language: "en",
      seed,
    });
    generatedCount += 1;
    difficultyCounts[pkg.difficultyBand] += 1;
    stems.add(pkg.stem);
    answers.add(pkg.answer);
    if (/profit/i.test(pkg.stem)) profitStemCount += 1;
    if (/loss/i.test(pkg.stem)) lossStemCount += 1;

    assert.equal(pkg.archetypeId, "PNL-001");
    assert.equal(pkg.canonicalProblemId, "PNL-CP-004");
    assert.equal(pkg.questionLanguageId, qlId);
    assert.equal(pkg.language, "en");
    assert.equal(pkg.parameters.runtimeMode, "DYNAMIC_CANDIDATE");
    assert.equal(pkg.parameters.reviewStatus, "UNREVIEWED_DYNAMIC_CANDIDATE");
    assert.equal(pkg.parameters.questionBankStatus, "NOT_STORED");
    assert.equal(pkg.parameters.testEligibility, "INELIGIBLE");
    assert.equal(pkg.parameters.publiclyPublishable, false);
    assert.equal(pkg.traceability.generationMode, "DYNAMIC_CANDIDATE");
    assert.equal(pkg.traceability.questionBankStatus, "NOT_STORED");
    assert.equal(pkg.traceability.testEligibility, "INELIGIBLE");
    assert.equal(pkg.traceability.publiclyPublishable, false);
    assert.equal(pkg.validation.valid, true);
    assert.equal(pkg.options.length, 4);
    assert.equal(new Set(pkg.options).size, 4);
    assert.equal(pkg.options[pkg.correctIndex], pkg.answer);
    assert.equal(
      pkg.traceability.misconceptionLabels.filter(
        (label) => label !== "CORRECT",
      ).length,
      3,
    );
    assert.ok(pkg.stem.length > 30, `${qlId}: stem is unexpectedly short.`);
    assert.ok(
      pkg.explanation.lines.length >= 4,
      `${qlId}: explanation is unexpectedly short.`,
    );

    const prose = `${pkg.stem}\n${pkg.explanation.lines.join("\n")}`
      .replace(/\\\[[\s\S]*?\\\]/g, "")
      .replace(/\\\([\s\S]*?\\\)/g, "");
    assert.doesNotMatch(
      prose,
      /\{[a-z][A-Za-z0-9_]*\}/,
      `${qlId}: unresolved prose placeholder.`,
    );

    const replay = runPnlCp004DynamicPipeline({
      questionLanguageId: qlId,
      language: "en",
      seed,
    });
    assert.equal(replay.stem, pkg.stem, `${qlId}: same seed must reproduce stem.`);
    assert.equal(
      replay.answer,
      pkg.answer,
      `${qlId}: same seed must reproduce answer.`,
    );
    assert.deepEqual(
      replay.options,
      pkg.options,
      `${qlId}: same seed must reproduce option order.`,
    );
  }

  assert.ok(stems.size >= 2, `${qlId}: seed sweep did not vary the stem.`);
  if (qlId !== "PNL-QL-117") {
    assert.ok(answers.size >= 2, `${qlId}: seed sweep did not vary the answer.`);
  }
}

assert.ok(profitStemCount > 0, "The seed sweep must include profit stages.");
assert.ok(lossStemCount > 0, "The seed sweep must include loss stages.");

const table = runPnlCp004DynamicPipeline({
  questionLanguageId: "PNL-QL-115",
  seed: "cp004-table-proof",
});
assert.match(table.stem, /\| Transfer \| Profit\/Loss rate \|/);

const caselet = runPnlCp004DynamicPipeline({
  questionLanguageId: "PNL-QL-116",
  seed: "cp004-caselet-proof",
});
assert.match(caselet.stem, /Distribution caselet/);

const statements = runPnlCp004DynamicPipeline({
  questionLanguageId: "PNL-QL-117",
  seed: "cp004-statement-proof",
});
assert.match(statements.stem, /1\. The overall result/);
assert.equal(statements.answer, "Statement 2 only");

const algebraic = runPnlCp004DynamicPipeline({
  questionLanguageId: "PNL-QL-118",
  seed: "cp004-algebraic-proof",
});
assert.match(algebraic.stem, /P_f=P_0/);

const dataSufficiency = runPnlCp004DynamicPipeline({
  questionLanguageId: "PNL-QL-119",
  seed: "cp004-data-sufficiency-proof",
});
assert.match(dataSufficiency.stem, /Statement 1:/);
assert.match(dataSufficiency.stem, /Statement 2:/);

const feeCaselet = runPnlCp004DynamicPipeline({
  questionLanguageId: "PNL-QL-120",
  seed: "cp004-fee-caselet-proof",
});
assert.match(feeCaselet.stem, /Agent-assisted resale/);

for (const difficulty of ["Medium", "Hard"] as const) {
  const pkg = runPnlCp004DynamicPipeline({
    difficultyBand: difficulty,
    seed: `cp004-${difficulty.toLowerCase()}-selection`,
  });
  assert.equal(pkg.difficultyBand, difficulty);
}

assert.throws(
  () => runPnlCp004DynamicPipeline({ language: "hi" as never }),
  /supports English only/,
);
assert.throws(
  () =>
    runPnlCp004DynamicPipeline({
      questionLanguageId: "PNL-QL-999",
    }),
  /Unknown CP-004 question-language ID/,
);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      canonicalProblemId: "PNL-CP-004",
      qlCount: qlIds.length,
      seedsPerQl: seeds.length,
      generatedPackages: generatedCount,
      difficultyCounts,
      runtimeMode: "DYNAMIC_CANDIDATE",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
    null,
    2,
  ),
);
