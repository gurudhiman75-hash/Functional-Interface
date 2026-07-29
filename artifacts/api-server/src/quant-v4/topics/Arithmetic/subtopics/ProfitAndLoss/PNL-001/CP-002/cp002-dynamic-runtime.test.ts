import assert from "node:assert/strict";

import {
  listPnlCp002DynamicQlIds,
  runPnlCp002DynamicPipeline,
} from "./cp002-dynamic-runtime";

const qlIds = listPnlCp002DynamicQlIds();
assert.equal(qlIds.length, 34, "CP-002 must expose all 34 frozen QLs.");
assert.deepEqual(
  qlIds,
  Array.from(
    { length: 34 },
    (_, index) => `PNL-QL-${String(index + 37).padStart(3, "0")}`,
  ),
);

const seeds = Array.from(
  { length: 24 },
  (_, index) => `cp002-proof-seed-${index + 1}`,
);
const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
let generatedCount = 0;

for (const qlId of qlIds) {
  const stems = new Set<string>();
  const answers = new Set<string>();

  for (const seed of seeds) {
    const pkg = runPnlCp002DynamicPipeline({
      questionLanguageId: qlId,
      language: "en",
      seed,
    });
    generatedCount += 1;
    difficultyCounts[pkg.difficultyBand] += 1;
    stems.add(pkg.stem);
    answers.add(pkg.answer);

    assert.equal(pkg.archetypeId, "PNL-001");
    assert.equal(pkg.canonicalProblemId, "PNL-CP-002");
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

    const replay = runPnlCp002DynamicPipeline({
      questionLanguageId: qlId,
      language: "en",
      seed,
    });
    assert.equal(
      replay.stem,
      pkg.stem,
      `${qlId}: same seed must reproduce the stem.`,
    );
    assert.equal(
      replay.answer,
      pkg.answer,
      `${qlId}: same seed must reproduce the answer.`,
    );
    assert.deepEqual(
      replay.options,
      pkg.options,
      `${qlId}: same seed must reproduce option order.`,
    );
  }

  assert.ok(
    stems.size >= 2,
    `${qlId}: seed sweep did not vary the generated stem.`,
  );
  if (!["PNL-QL-067", "PNL-QL-070"].includes(qlId)) {
    assert.ok(
      answers.size >= 2,
      `${qlId}: seed sweep did not vary the generated answer.`,
    );
  }
}

const ql070 = runPnlCp002DynamicPipeline({
  questionLanguageId: "PNL-QL-070",
  language: "en",
  seed: "pnl-ql070-data-sufficiency-regression",
});
const ql070Marker = ql070.stem.match(/Statement\s+(?:I|1)\b/i);
assert.ok(
  ql070Marker?.index,
  "QL-070 must separate Statement I from the lead.",
);
const ql070Lead = ql070.stem.slice(0, ql070Marker.index);
assert.doesNotMatch(
  ql070Lead,
  /₹\s*[\d,]+|\b\d+(?:\.\d+)?%/,
  "QL-070 lead must not reveal cost, marked price, or target rate.",
);
assert.match(ql070.stem, /Statement\s+(?:I|1)[\s\S]*cost price/i);
assert.match(ql070.stem, /Statement\s+(?:II|2)[\s\S]*marked price/i);
assert.equal(ql070.answer, "Both statements together are required");

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const pkg = runPnlCp002DynamicPipeline({
    difficultyBand: difficulty,
    seed: `cp002-${difficulty.toLowerCase()}-selection`,
  });
  assert.equal(pkg.difficultyBand, difficulty);
}

await assert.rejects(
  async () => runPnlCp002DynamicPipeline({ language: "hi" as never }),
  /supports English only/,
);
assert.throws(
  () => runPnlCp002DynamicPipeline({ questionLanguageId: "PNL-QL-999" }),
  /Unknown CP-002 question-language ID/,
);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      canonicalProblemId: "PNL-CP-002",
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
