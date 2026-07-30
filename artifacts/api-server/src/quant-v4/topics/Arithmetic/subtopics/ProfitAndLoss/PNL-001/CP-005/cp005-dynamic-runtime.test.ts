import assert from "node:assert/strict";

import {
  listPnlCp005DynamicQlIds,
  runPnlCp005DynamicPipeline,
} from "./cp005-dynamic-runtime";

const qlIds = listPnlCp005DynamicQlIds();
assert.equal(qlIds.length, 29, "CP-005 must expose all 29 frozen QLs.");
assert.deepEqual(
  qlIds,
  Array.from(
    { length: 29 },
    (_, index) => `PNL-QL-${String(index + 121).padStart(3, "0")}`,
  ),
);

const seeds = Array.from(
  { length: 24 },
  (_, index) => `cp005-proof-seed-${index + 1}`,
);
const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
let generatedCount = 0;
let profitStemCount = 0;
let lossStemCount = 0;
const schemeWinners = new Set<string>();
const generatedWorkingQlMap = new Map<string, Set<string>>();

for (const qlId of qlIds) {
  const stems = new Set<string>();
  const answers = new Set<string>();

  for (const seed of seeds) {
    const pkg = runPnlCp005DynamicPipeline({
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
    if (qlId === "PNL-QL-142" || qlId === "PNL-QL-145") {
      schemeWinners.add(pkg.answer.split(" by ")[0]!);
    }

    assert.equal(pkg.archetypeId, "PNL-001");
    assert.equal(pkg.canonicalProblemId, "PNL-CP-005");
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

    const explanation = pkg.explanation.lines.join("\n\n");
    assert.match(
      explanation,
      /\*\*Generated-value check:\*\*/,
      `${qlId}: generated-value working is missing.`,
    );
    assert.doesNotMatch(
      explanation,
      /\*\*Working with these values:\*\*/,
      `${qlId}: legacy generic working tail is still present.`,
    );
    const generatedWorking = explanation.match(
      /\*\*Generated-value check:\*\*\s*([\s\S]*?)(?:\n\n\*\*Final answer:|$)/,
    );
    assert.ok(
      generatedWorking?.[1],
      `${qlId}: generated working could not be isolated.`,
    );
    const fingerprint = generatedWorking[1]
      .toLowerCase()
      .replace(/₹\s*[\d,.]+(?:\.\d+)?/g, "₹#")
      .replace(/\b\d+(?:\.\d+)?%/g, "#%")
      .replace(/\b\d+(?:\.\d+)?\b/g, "#")
      .replace(/\s+/g, " ")
      .trim();
    const fingerprintQls =
      generatedWorkingQlMap.get(fingerprint) ?? new Set<string>();
    fingerprintQls.add(qlId);
    generatedWorkingQlMap.set(fingerprint, fingerprintQls);

    const prose = `${pkg.stem}\n${pkg.explanation.lines.join("\n")}`
      .replace(/\\\[[\s\S]*?\\\]/g, "")
      .replace(/\\\([\s\S]*?\\\)/g, "");
    assert.doesNotMatch(
      prose,
      /\{[a-z][A-Za-z0-9_]*\}/,
      `${qlId}: unresolved prose placeholder.`,
    );

    if (qlId === "PNL-QL-127" || qlId === "PNL-QL-146") {
      assert.match(
        pkg.answer,
        /profit/i,
        `${qlId}: must remain a profit question.`,
      );
    }
    if (qlId === "PNL-QL-143") {
      assert.equal(
        pkg.parameters.variables.actualDirection,
        "profit",
        "PNL-QL-143 must remain a false-count profit question.",
      );
    }
    if (qlId === "PNL-QL-141") {
      assert.match(
        pkg.answer,
        /^₹\d+(?:\.\d{1,2})?$/,
        "PNL-QL-141 must remain exact to the paise.",
      );
    }

    const replay = runPnlCp005DynamicPipeline({
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
  if (qlId !== "PNL-QL-147") {
    assert.ok(
      answers.size >= 2,
      `${qlId}: seed sweep did not vary the answer.`,
    );
  }
}

for (const [fingerprint, fingerprintQls] of generatedWorkingQlMap) {
  assert.ok(
    fingerprintQls.size <= 2,
    `Generated working is shared by ${fingerprintQls.size} QLs: ${[...fingerprintQls].join(", ")} — ${fingerprint}`,
  );
}

assert.ok(profitStemCount > 0, "The seed sweep must include profit cases.");
assert.ok(lossStemCount > 0, "The seed sweep must include loss cases.");
assert.ok(schemeWinners.has("Scheme A"), "Scheme A must win some comparisons.");
assert.ok(schemeWinners.has("Scheme B"), "Scheme B must win some comparisons.");

const falseCount = runPnlCp005DynamicPipeline({
  questionLanguageId: "PNL-QL-143",
  seed: "cp005-false-count-proof",
});
assert.match(falseCount.stem, /items|carton/i);

const falseMetre = runPnlCp005DynamicPipeline({
  questionLanguageId: "PNL-QL-144",
  seed: "cp005-false-metre-proof",
});
assert.match(falseMetre.stem, /cm|metre/i);

const table = runPnlCp005DynamicPipeline({
  questionLanguageId: "PNL-QL-145",
  seed: "cp005-table-proof",
});
assert.match(
  table.stem,
  /\| Scheme \| Price condition \| Quantity condition \|/,
);

const caselet = runPnlCp005DynamicPipeline({
  questionLanguageId: "PNL-QL-146",
  seed: "cp005-caselet-proof",
});
assert.match(caselet.stem, /Retail pricing caselet/);

const statements = runPnlCp005DynamicPipeline({
  questionLanguageId: "PNL-QL-147",
  seed: "cp005-statement-proof",
});
assert.match(statements.stem, /1\. The percentage shortage/);
assert.equal(statements.answer, "Statement 2 only");

const dataSufficiency = runPnlCp005DynamicPipeline({
  questionLanguageId: "PNL-QL-148",
  seed: "cp005-data-sufficiency-proof",
});
assert.match(dataSufficiency.stem, /Statement 1:/);
assert.match(dataSufficiency.stem, /Statement 2:/);

const algebraic = runPnlCp005DynamicPipeline({
  questionLanguageId: "PNL-QL-149",
  seed: "cp005-algebraic-proof",
});
assert.match(algebraic.stem, /S\/C_d|frac\{S\}/);

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const pkg = runPnlCp005DynamicPipeline({
    difficultyBand: difficulty,
    seed: `cp005-${difficulty.toLowerCase()}-selection`,
  });
  assert.equal(pkg.difficultyBand, difficulty);
}

assert.throws(
  () => runPnlCp005DynamicPipeline({ language: "hi" as never }),
  /supports English only/,
);
assert.throws(
  () =>
    runPnlCp005DynamicPipeline({
      questionLanguageId: "PNL-QL-999",
    }),
  /Unknown CP-005 question-language ID/,
);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      canonicalProblemId: "PNL-CP-005",
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
