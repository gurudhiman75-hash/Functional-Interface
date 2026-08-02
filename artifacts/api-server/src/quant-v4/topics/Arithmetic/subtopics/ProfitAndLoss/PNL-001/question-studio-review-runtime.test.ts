import assert from "node:assert/strict";
import {
  PNL_001_CP_IDS,
  PNL_001_LANGUAGES,
  getPnl001ActiveCanonicalProblemIds,
  listPnl001CanonicalReviewEntries,
  runPnl001ReviewPipeline,
} from "./question-studio-review-runtime";

const entries = listPnl001CanonicalReviewEntries();
assert.equal(entries.length, 186);
assert.deepEqual(getPnl001ActiveCanonicalProblemIds(), [...PNL_001_CP_IDS]);
assert.deepEqual(PNL_001_LANGUAGES, ["en", "hi", "pa"]);

const expectedCounts = new Map([
  ["PNL-CP-001", 36],
  ["PNL-CP-002", 34],
  ["PNL-CP-003", 24],
  ["PNL-CP-004", 26],
  ["PNL-CP-005", 29],
  ["PNL-CP-006", 37],
]);
for (const cpId of PNL_001_CP_IDS) {
  assert.equal(
    entries.filter((entry) => entry.cpId === cpId).length,
    expectedCounts.get(cpId),
  );
}

assert.deepEqual(
  entries.map((entry) => entry.qlId),
  Array.from(
    { length: 186 },
    (_, index) => `PNL-QL-${String(index + 1).padStart(3, "0")}`,
  ),
);
assert.equal(new Set(entries.map((entry) => entry.stem)).size, 186);

const unresolvedProsePlaceholders = (value: string) => {
  const proseOnly = value
    .replace(/\\\[[\s\S]*?\\\]/g, "")
    .replace(/\\\([\s\S]*?\\\)/g, "");
  return [...proseOnly.matchAll(/\{([a-z][A-Za-z0-9_]*)\}/g)];
};
const syntheticOpening =
  /^(?:consider this|during this|the following (?:commercial )?(?:situation|record|information)|use the following information|the records show)/i;

let packageCount = 0;
let nativePackageCount = 0;
let nativeMathJaxPackageCount = 0;
for (const entry of entries) {
  assert.equal(entry.options.length, 4, `${entry.qlId}: option count`);
  assert.equal(
    new Set(entry.options).size,
    4,
    `${entry.qlId}: duplicate option`,
  );
  assert.equal(
    entry.options[entry.correctIndex],
    entry.answer,
    `${entry.qlId}: answer key`,
  );
  assert.ok(entry.stem.trim().length >= 20, `${entry.qlId}: empty/short stem`);
  assert.ok(
    entry.explanation.trim().length >= 80,
    `${entry.qlId}: shallow explanation`,
  );
  assert.equal(
    unresolvedProsePlaceholders(entry.stem).length,
    0,
    `${entry.qlId}: unresolved canonical prose placeholder`,
  );
  assert.equal(
    syntheticOpening.test(entry.stem.trim()),
    false,
    `${entry.qlId}: synthetic opening`,
  );
  assert.equal(entry.safety.reviewStatus, "APPROVED_EDITORIAL_CANONICAL");
  assert.equal(entry.safety.questionBankStatus, "NOT_STORED");
  assert.equal(entry.safety.testEligibility, "INELIGIBLE");
  assert.equal(entry.safety.publiclyPublishable, false);

  for (const language of PNL_001_LANGUAGES) {
    const pkg = runPnl001ReviewPipeline(entry.cpId, {
      language,
      questionLanguageId: entry.qlId,
      seed: `proof:${entry.qlId}:${language}`,
    });
    packageCount += 1;
    assert.equal(pkg.questionLanguageId, entry.qlId);
    assert.equal(pkg.language, language);
    assert.equal(pkg.parameters.language, language);
    assert.equal(pkg.traceability.language, language);
    assert.equal(pkg.options.length, 4);
    assert.equal(new Set(pkg.options).size, 4);
    assert.equal(pkg.options[pkg.correctIndex], pkg.answer);
    assert.equal(pkg.validation.valid, true);
    assert.equal(pkg.traceability.generationMode, "CANONICAL_REVIEW");
    assert.equal(pkg.traceability.questionBankStatus, "WRITABLE");
    assert.equal(pkg.traceability.testEligibility, "ELIGIBLE");
    assert.equal(pkg.traceability.publiclyPublishable, true);
    assert.equal(
      unresolvedProsePlaceholders(
        `${pkg.stem}\n${pkg.explanation.lines.join("\n")}`,
      ).length,
      0,
      `${entry.qlId}:${language}: unresolved package prose placeholder`,
    );

    if (language === "en") {
      assert.equal(pkg.questionId, `${entry.qlId}:canonical-review`);
      assert.equal(pkg.explanationId, `${entry.qlId}-EXPLANATION-V2`);
      assert.equal(pkg.stem, entry.stem);
      assert.equal(pkg.answer, entry.answer);
      assert.deepEqual(pkg.options, entry.options);
      assert.equal(pkg.correctIndex, entry.correctIndex);
      assert.equal(pkg.explanation.lines.join("\n\n"), entry.explanation);
    } else {
      nativePackageCount += 1;
      const script =
        language === "hi" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
      assert.ok(
        script.test(pkg.stem),
        `${entry.qlId}:${language}: native stem`,
      );
      assert.ok(
        script.test(pkg.explanation.lines.join("\n")),
        `${entry.qlId}:${language}: native explanation`,
      );
      assert.equal(
        pkg.questionId,
        `${entry.qlId}:canonical-review:${language}`,
      );
      if (/\\\[|\\\(/u.test(pkg.explanation.lines.join("\n"))) {
        nativeMathJaxPackageCount += 1;
      }
    }
  }
}

for (const cpId of PNL_001_CP_IDS) {
  for (const language of PNL_001_LANGUAGES) {
    const first = runPnl001ReviewPipeline(cpId, {
      language,
      seed: `deterministic-seed:${language}`,
    });
    const second = runPnl001ReviewPipeline(cpId, {
      language,
      seed: `deterministic-seed:${language}`,
    });
    assert.equal(first.questionLanguageId, second.questionLanguageId);
    assert.equal(first.stem, second.stem);
    assert.equal(first.answer, second.answer);

    for (const difficultyBand of ["Easy", "Medium", "Hard"] as const) {
      const eligible = entries.some(
        (entry) => entry.cpId === cpId && entry.difficulty === difficultyBand,
      );
      if (!eligible) continue;
      const pkg = runPnl001ReviewPipeline(cpId, {
        difficultyBand,
        language,
        seed: `${cpId}:${difficultyBand}:${language}`,
      });
      assert.equal(pkg.difficultyBand, difficultyBand);
    }
  }
}

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
      languages: PNL_001_LANGUAGES,
      qlCount: entries.length,
      packageCount,
      nativePackageCount,
      nativeMathJaxPackageCount,
      cpCounts: Object.fromEntries(
        PNL_001_CP_IDS.map((cpId) => [
          cpId,
          entries.filter((entry) => entry.cpId === cpId).length,
        ]),
      ),
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: true,
    },
    null,
    2,
  ),
);
