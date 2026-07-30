import assert from "node:assert/strict";

import {
  listPnlCp003DynamicQlIds,
  runPnlCp003DynamicPipeline,
} from "./cp003-dynamic-runtime";

const qlIds = listPnlCp003DynamicQlIds();
assert.equal(qlIds.length, 24, "CP-003 must expose all 24 frozen QLs.");
assert.deepEqual(
  qlIds,
  Array.from(
    { length: 24 },
    (_, index) => `PNL-QL-${String(index + 71).padStart(3, "0")}`,
  ),
);

const seeds = Array.from(
  { length: 24 },
  (_, index) => `cp003-proof-seed-${index + 1}`,
);
const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
let generatedCount = 0;
let profitAnswerCount = 0;
let lossAnswerCount = 0;
const generatedWorkingQlMap = new Map<string, Set<string>>();

for (const qlId of qlIds) {
  const stems = new Set<string>();
  const answers = new Set<string>();

  for (const seed of seeds) {
    const pkg = runPnlCp003DynamicPipeline({
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
    assert.equal(pkg.canonicalProblemId, "PNL-CP-003");
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

    if (
      qlId === "PNL-QL-075" ||
      qlId === "PNL-QL-080" ||
      qlId === "PNL-QL-082" ||
      qlId === "PNL-QL-094"
    ) {
      assert.match(
        pkg.answer,
        /^₹\d+(?:\.\d{1,2})?$/,
        `${qlId}: per-unit money must remain exact to the paise.`,
      );
    }
    if (qlId === "PNL-QL-079") {
      assert.match(
        pkg.answer,
        /^\d+$/,
        "Unknown inventory quantity must be a whole number.",
      );
    }

    const replay = runPnlCp003DynamicPipeline({
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
  if (qlId !== "PNL-QL-090") {
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

assert.ok(profitAnswerCount > 0, "The seed sweep must include profit answers.");
assert.ok(lossAnswerCount > 0, "The seed sweep must include loss answers.");

const lotsTable = runPnlCp003DynamicPipeline({
  questionLanguageId: "PNL-QL-071",
  seed: "cp003-lots-table-proof",
});
assert.match(
  lotsTable.stem,
  /\| Group \| Quantity or cost \| Selling condition \|/,
);

const partialTable = runPnlCp003DynamicPipeline({
  questionLanguageId: "PNL-QL-074",
  seed: "cp003-partial-table-proof",
});
assert.match(partialTable.stem, /Sold group/);

const inventoryTable = runPnlCp003DynamicPipeline({
  questionLanguageId: "PNL-QL-088",
  seed: "cp003-inventory-table-proof",
});
assert.match(
  inventoryTable.stem,
  /\| Group \| Quantity and unit cost \| Selling condition \|/,
);

const caselet = runPnlCp003DynamicPipeline({
  questionLanguageId: "PNL-QL-089",
  seed: "cp003-caselet-proof",
});
assert.match(caselet.stem, /Warehouse inventory caselet/);

const statements = runPnlCp003DynamicPipeline({
  questionLanguageId: "PNL-QL-090",
  seed: "cp003-statement-proof",
});
assert.match(statements.stem, /1\. The equal profit and loss rates/);
assert.equal(statements.answer, "Statement 2 only");

const algebraic = runPnlCp003DynamicPipeline({
  questionLanguageId: "PNL-QL-091",
  seed: "cp003-algebraic-proof",
});
assert.match(algebraic.stem, /Group data/);

const dataSufficiency = runPnlCp003DynamicPipeline({
  questionLanguageId: "PNL-QL-092",
  seed: "cp003-data-sufficiency-proof",
});
assert.match(dataSufficiency.stem, /Statement 1:/);
assert.match(dataSufficiency.stem, /Statement 2:/);

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const pkg = runPnlCp003DynamicPipeline({
    difficultyBand: difficulty,
    seed: `cp003-${difficulty.toLowerCase()}-selection`,
  });
  assert.equal(pkg.difficultyBand, difficulty);
}

assert.throws(
  () => runPnlCp003DynamicPipeline({ language: "hi" as never }),
  /supports English only/,
);
assert.throws(
  () =>
    runPnlCp003DynamicPipeline({
      questionLanguageId: "PNL-QL-999",
    }),
  /Unknown CP-003 question-language ID/,
);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      canonicalProblemId: "PNL-CP-003",
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
