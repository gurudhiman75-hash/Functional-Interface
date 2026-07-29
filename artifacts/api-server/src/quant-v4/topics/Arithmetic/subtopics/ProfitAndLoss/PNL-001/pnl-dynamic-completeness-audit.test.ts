import assert from "node:assert/strict";

import {
  listPnlCp001DynamicQlIds,
  runPnlCp001DynamicPipeline,
} from "./CP-001/cp001-dynamic-runtime";
import {
  listPnlCp002DynamicQlIds,
  runPnlCp002DynamicPipeline,
} from "./CP-002/cp002-dynamic-runtime";
import {
  listPnlCp003DynamicQlIds,
  runPnlCp003DynamicPipeline,
} from "./CP-003/cp003-dynamic-runtime";
import {
  listPnlCp004DynamicQlIds,
  runPnlCp004DynamicPipeline,
} from "./CP-004/cp004-dynamic-runtime";
import {
  listPnlCp005DynamicQlIds,
  runPnlCp005DynamicPipeline,
} from "./CP-005/cp005-dynamic-runtime";
import {
  listPnlCp006DynamicQlIds,
  runPnlCp006DynamicPipeline,
} from "./CP-006/cp006-dynamic-runtime";

type AuditInput = Readonly<{
  questionLanguageId?: string;
  language?: "en";
  seed?: string;
}>;

type AuditPackage = Readonly<{
  archetypeId: string;
  canonicalProblemId: string;
  questionId: string;
  questionLanguageId: string;
  language: string;
  difficultyBand: "Easy" | "Medium" | "Hard";
  stem: string;
  answer: string;
  options: readonly string[];
  correctIndex: number;
  parameters: Readonly<{
    runtimeMode: string;
    reviewStatus: string;
    questionBankStatus: string;
    testEligibility: string;
    publiclyPublishable: boolean;
  }>;
  explanation: Readonly<{ lines: readonly string[] }>;
  traceability: Readonly<{
    generationMode: string;
    reviewStatus: string;
    questionBankStatus: string;
    testEligibility: string;
    publiclyPublishable: boolean;
    representation?: string;
  }>;
  validation: Readonly<{ valid: boolean }>;
}>;

type AuditRuntime = Readonly<{
  cpId: string;
  start: number;
  end: number;
  listQlIds: () => readonly string[];
  run: (input: AuditInput) => AuditPackage;
}>;

const runtimes: readonly AuditRuntime[] = [
  {
    cpId: "PNL-CP-001",
    start: 1,
    end: 36,
    listQlIds: listPnlCp001DynamicQlIds,
    run: runPnlCp001DynamicPipeline as (input: AuditInput) => AuditPackage,
  },
  {
    cpId: "PNL-CP-002",
    start: 37,
    end: 70,
    listQlIds: listPnlCp002DynamicQlIds,
    run: runPnlCp002DynamicPipeline as (input: AuditInput) => AuditPackage,
  },
  {
    cpId: "PNL-CP-003",
    start: 71,
    end: 94,
    listQlIds: listPnlCp003DynamicQlIds,
    run: runPnlCp003DynamicPipeline as (input: AuditInput) => AuditPackage,
  },
  {
    cpId: "PNL-CP-004",
    start: 95,
    end: 120,
    listQlIds: listPnlCp004DynamicQlIds,
    run: runPnlCp004DynamicPipeline as (input: AuditInput) => AuditPackage,
  },
  {
    cpId: "PNL-CP-005",
    start: 121,
    end: 149,
    listQlIds: listPnlCp005DynamicQlIds,
    run: runPnlCp005DynamicPipeline as (input: AuditInput) => AuditPackage,
  },
  {
    cpId: "PNL-CP-006",
    start: 150,
    end: 186,
    listQlIds: listPnlCp006DynamicQlIds,
    run: runPnlCp006DynamicPipeline as (input: AuditInput) => AuditPackage,
  },
];

function qlId(number: number): string {
  return `PNL-QL-${String(number).padStart(3, "0")}`;
}

function stablePackage(pkg: AuditPackage): string {
  return JSON.stringify({
    questionId: pkg.questionId,
    questionLanguageId: pkg.questionLanguageId,
    difficultyBand: pkg.difficultyBand,
    stem: pkg.stem,
    answer: pkg.answer,
    options: pkg.options,
    correctIndex: pkg.correctIndex,
    parameters: pkg.parameters,
    traceability: pkg.traceability,
    validation: pkg.validation,
  });
}

function hasUnresolvedProsePlaceholder(value: string): boolean {
  const proseOnly = value
    .replace(/\\\[[\s\S]*?\\\]/g, "")
    .replace(/\\\([\s\S]*?\\\)/g, "");
  return /\{[a-z][A-Za-z0-9_]*\}/.test(proseOnly);
}

assert.equal(runtimes.length, 6, "PNL-001 must expose exactly six CP runtimes.");

const expectedAllQlIds = Array.from({ length: 186 }, (_, index) => qlId(index + 1));
const ownerByQl = new Map<string, string>();
const allQlIds: string[] = [];

for (const runtime of runtimes) {
  const expected = Array.from(
    { length: runtime.end - runtime.start + 1 },
    (_, index) => qlId(runtime.start + index),
  );
  const actual = [...runtime.listQlIds()];
  assert.deepEqual(
    actual,
    expected,
    `${runtime.cpId}: dynamic QL ownership is not contiguous or complete.`,
  );
  for (const id of actual) {
    assert.equal(
      ownerByQl.has(id),
      false,
      `${id}: owned by both ${ownerByQl.get(id)} and ${runtime.cpId}.`,
    );
    ownerByQl.set(id, runtime.cpId);
    allQlIds.push(id);
  }
}

assert.deepEqual(allQlIds, expectedAllQlIds, "PNL-001 dynamic ownership has a gap or ordering defect.");
assert.equal(new Set(allQlIds).size, 186, "PNL-001 dynamic ownership contains duplicates.");

const seeds = Array.from(
  { length: 24 },
  (_, index) => `pnl-completeness-seed-${index + 1}`,
);
const cpQlCounts: Record<string, number> = {};
const cpPackageCounts: Record<string, number> = {};
const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
const representations = new Set<string>();
const questionIds = new Set<string>();
let generatedPackages = 0;

for (const runtime of runtimes) {
  const ids = runtime.listQlIds();
  cpQlCounts[runtime.cpId] = ids.length;
  cpPackageCounts[runtime.cpId] = 0;

  assert.throws(
    () => runtime.run({ language: "hi" as never }),
    /English only|supports English only/i,
    `${runtime.cpId}: unsupported Hindi requests must fail explicitly.`,
  );
  assert.throws(
    () => runtime.run({ language: "pa" as never }),
    /English only|supports English only/i,
    `${runtime.cpId}: unsupported Punjabi requests must fail explicitly.`,
  );

  for (const id of ids) {
    const stems = new Set<string>();

    for (const seed of seeds) {
      const pkg = runtime.run({
        questionLanguageId: id,
        language: "en",
        seed,
      });

      generatedPackages += 1;
      cpPackageCounts[runtime.cpId] += 1;
      difficultyCounts[pkg.difficultyBand] += 1;
      stems.add(pkg.stem);
      if (pkg.traceability.representation) {
        representations.add(pkg.traceability.representation);
      }

      assert.equal(pkg.archetypeId, "PNL-001");
      assert.equal(pkg.canonicalProblemId, runtime.cpId);
      assert.equal(pkg.questionLanguageId, id);
      assert.equal(pkg.language, "en");
      assert.equal(pkg.parameters.runtimeMode, "DYNAMIC_CANDIDATE");
      assert.equal(pkg.parameters.reviewStatus, "UNREVIEWED_DYNAMIC_CANDIDATE");
      assert.equal(pkg.parameters.questionBankStatus, "NOT_STORED");
      assert.equal(pkg.parameters.testEligibility, "INELIGIBLE");
      assert.equal(pkg.parameters.publiclyPublishable, false);
      assert.equal(pkg.traceability.generationMode, "DYNAMIC_CANDIDATE");
      assert.equal(pkg.traceability.reviewStatus, "UNREVIEWED_DYNAMIC_CANDIDATE");
      assert.equal(pkg.traceability.questionBankStatus, "NOT_STORED");
      assert.equal(pkg.traceability.testEligibility, "INELIGIBLE");
      assert.equal(pkg.traceability.publiclyPublishable, false);
      assert.equal(pkg.validation.valid, true);
      assert.equal(pkg.options.length, 4);
      assert.equal(new Set(pkg.options).size, 4);
      assert.equal(pkg.options[pkg.correctIndex], pkg.answer);
      assert.ok(pkg.stem.length > 25, `${id}: generated stem is unexpectedly short.`);
      assert.ok(
        pkg.explanation.lines.length >= 3,
        `${id}: generated explanation is unexpectedly short.`,
      );
      assert.equal(
        hasUnresolvedProsePlaceholder(
          `${pkg.stem}\n${pkg.explanation.lines.join("\n")}`,
        ),
        false,
        `${id}: unresolved dynamic prose placeholder.`,
      );
      assert.equal(
        questionIds.has(pkg.questionId),
        false,
        `${pkg.questionId}: duplicate generated question ID.`,
      );
      questionIds.add(pkg.questionId);

      if (seed === seeds[0]) {
        const replay = runtime.run({
          questionLanguageId: id,
          language: "en",
          seed,
        });
        assert.equal(
          stablePackage(replay),
          stablePackage(pkg),
          `${id}: deterministic replay failed.`,
        );
      }
    }

    assert.ok(stems.size >= 2, `${id}: 24-seed sweep did not vary the generated stem.`);
  }
}

assert.equal(generatedPackages, 4464, "PNL-001 audit did not generate all 4,464 packages.");
assert.equal(questionIds.size, 4464, "PNL-001 generated question IDs are not globally unique.");
assert.deepEqual(cpQlCounts, {
  "PNL-CP-001": 36,
  "PNL-CP-002": 34,
  "PNL-CP-003": 24,
  "PNL-CP-004": 26,
  "PNL-CP-005": 29,
  "PNL-CP-006": 37,
});
assert.deepEqual(cpPackageCounts, {
  "PNL-CP-001": 864,
  "PNL-CP-002": 816,
  "PNL-CP-003": 576,
  "PNL-CP-004": 624,
  "PNL-CP-005": 696,
  "PNL-CP-006": 888,
});

for (const representation of [
  "TABLE",
  "CASELET",
  "STATEMENT",
  "ALGEBRAIC",
  "DATA_SUFFICIENCY",
]) {
  assert.ok(
    representations.has(representation),
    `PNL-001 aggregate runtime is missing ${representation} coverage.`,
  );
}

console.log(
  JSON.stringify(
    {
      status: "PASS",
      archetypeId: "PNL-001",
      cpCount: runtimes.length,
      qlCount: allQlIds.length,
      seedsPerQl: seeds.length,
      generatedPackages,
      cpQlCounts,
      cpPackageCounts,
      difficultyCounts,
      representations: [...representations].sort(),
      runtimeMode: "DYNAMIC_CANDIDATE",
      reviewStatus: "UNREVIEWED_DYNAMIC_CANDIDATE",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      questionStudioWiringChanged: false,
    },
    null,
    2,
  ),
);
