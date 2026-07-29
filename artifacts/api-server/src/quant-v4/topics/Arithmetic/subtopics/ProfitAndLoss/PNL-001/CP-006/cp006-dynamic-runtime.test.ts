import assert from "node:assert/strict";

import {
  listPnlCp006DynamicQlIds,
  runPnlCp006DynamicPipeline,
} from "./cp006-dynamic-runtime";

const qlIds = listPnlCp006DynamicQlIds();
assert.equal(qlIds.length, 37, "CP-006 must expose all 37 frozen QLs.");
assert.deepEqual(
  qlIds,
  Array.from(
    { length: 37 },
    (_, index) => `PNL-QL-${String(index + 150).padStart(3, "0")}`,
  ),
);

const seeds = Array.from(
  { length: 24 },
  (_, index) => `cp006-proof-seed-${index + 1}`,
);
const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
let generatedCount = 0;
let profitAnswerCount = 0;
let lossAnswerCount = 0;

for (const qlId of qlIds) {
  const stems = new Set<string>();
  const answers = new Set<string>();

  for (const seed of seeds) {
    const pkg = runPnlCp006DynamicPipeline({
      questionLanguageId: qlId,
      language: "en",
      seed,
    });
    generatedCount += 1;
    difficultyCounts[pkg.difficultyBand] += 1;
    stems.add(pkg.stem);
    answers.add(pkg.answer);
    if (/profit/i.test(pkg.answer)) profitAnswerCount += 1;
    if (/loss/i.test(pkg.answer)) lossAnswerCount += 1;

    assert.equal(pkg.archetypeId, "PNL-001");
    assert.equal(pkg.canonicalProblemId, "PNL-CP-006");
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

    if (
      qlId === "PNL-QL-156" ||
      qlId === "PNL-QL-157" ||
      qlId === "PNL-QL-160" ||
      qlId === "PNL-QL-168" ||
      qlId === "PNL-QL-169" ||
      qlId === "PNL-QL-172" ||
      qlId === "PNL-QL-181" ||
      qlId === "PNL-QL-182"
    ) {
      assert.match(
        pkg.answer,
        /^₹\d+(?:\.\d{1,2})?$/,
        `${qlId}: unit or inverse money must remain exact to the paise.`,
      );
    }
    if (
      qlId === "PNL-QL-158" ||
      qlId === "PNL-QL-159" ||
      qlId === "PNL-QL-175" ||
      qlId === "PNL-QL-183"
    ) {
      assert.match(
        pkg.answer,
        /^\d+ (?:units|bundles)$/,
        `${qlId}: required quantity must be a positive whole number.`,
      );
    }

    const replay = runPnlCp006DynamicPipeline({
      questionLanguageId: qlId,
      language: "en",
      seed,
    });
    assert.equal(
      replay.stem,
      pkg.stem,
      `${qlId}: same seed must reproduce stem.`,
    );
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
  if (qlId !== "PNL-QL-184") {
    assert.ok(
      answers.size >= 2,
      `${qlId}: seed sweep did not vary the answer.`,
    );
  }
}

assert.ok(profitAnswerCount > 0, "The seed sweep must include profit answers.");
assert.ok(lossAnswerCount > 0, "The seed sweep must include loss answers.");

const manufacturingTable = runPnlCp006DynamicPipeline({
  questionLanguageId: "PNL-QL-182",
  seed: "cp006-manufacturing-table-proof",
});
assert.match(
  manufacturingTable.stem,
  /\| Cost component \| Amount or rate \| Calculation base \|/,
);

const productMixCaselet = runPnlCp006DynamicPipeline({
  questionLanguageId: "PNL-QL-183",
  seed: "cp006-product-mix-caselet-proof",
});
assert.match(productMixCaselet.stem, /Product-mix planning caselet/);
assert.match(productMixCaselet.stem, /Product A/);
assert.match(productMixCaselet.stem, /Product B/);

const statements = runPnlCp006DynamicPipeline({
  questionLanguageId: "PNL-QL-184",
  seed: "cp006-statement-proof",
});
assert.match(statements.stem, /1\. The same percentage profit/);
assert.equal(statements.answer, "Statement 2 only");

const algebraic = runPnlCp006DynamicPipeline({
  questionLanguageId: "PNL-QL-185",
  seed: "cp006-algebraic-proof",
});
assert.match(algebraic.stem, /E=C\+F\+rB/);

const dataSufficiency = runPnlCp006DynamicPipeline({
  questionLanguageId: "PNL-QL-186",
  seed: "cp006-data-sufficiency-proof",
});
assert.match(dataSufficiency.stem, /Statement 1:/);
assert.match(dataSufficiency.stem, /Statement 2:/);

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const pkg = runPnlCp006DynamicPipeline({
    difficultyBand: difficulty,
    seed: `cp006-${difficulty.toLowerCase()}-selection`,
  });
  assert.equal(pkg.difficultyBand, difficulty);
}

assert.throws(
  () => runPnlCp006DynamicPipeline({ language: "hi" as never }),
  /supports English only/,
);
assert.throws(
  () =>
    runPnlCp006DynamicPipeline({
      questionLanguageId: "PNL-QL-999",
    }),
  /Unknown CP-006 question-language ID/,
);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      canonicalProblemId: "PNL-CP-006",
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
