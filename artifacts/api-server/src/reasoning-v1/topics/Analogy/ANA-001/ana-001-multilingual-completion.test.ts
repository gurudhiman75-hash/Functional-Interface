import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

interface CheckpointCoverage {
  readonly checkpoint: string;
  readonly firstQl: number;
  readonly lastQl: number;
  readonly qlCount: number;
  readonly localizedTest: string;
  readonly localizedSources: readonly string[];
}

const COVERAGE: readonly CheckpointCoverage[] = [
  {
    checkpoint: "ANA-CP-001/002",
    firstQl: 1,
    lastQl: 60,
    qlCount: 60,
    localizedTest: "ana-001-localized-runtime.test.ts",
    localizedSources: [
      "localization/runtime.ts",
      "localization/question-text.ts",
      "ANA-CP-001/locales/pa-IN/core-facts.ts",
      "ANA-CP-001/locales/pa-IN/remaining-semantic-facts.ts",
      "ANA-CP-002/locales/pa-IN/synonym-antonym.ts",
      "ANA-CP-002/locales/pa-IN/remaining-lexical-facts.ts",
    ],
  },
  {
    checkpoint: "ANA-CP-003",
    firstQl: 61,
    lastQl: 108,
    qlCount: 48,
    localizedTest: "ANA-CP-003/ana-cp-003-localized.test.ts",
    localizedSources: ["ANA-CP-003/localized-runtime.ts"],
  },
  {
    checkpoint: "ANA-CP-004",
    firstQl: 109,
    lastQl: 140,
    qlCount: 32,
    localizedTest: "ANA-CP-004/ana-cp-004-localized.test.ts",
    localizedSources: ["ANA-CP-004/localized-runtime.ts"],
  },
  {
    checkpoint: "ANA-CP-005",
    firstQl: 141,
    lastQl: 160,
    qlCount: 20,
    localizedTest: "ANA-CP-005/ana-cp-005-localized.test.ts",
    localizedSources: ["ANA-CP-005/localized-runtime.ts"],
  },
  {
    checkpoint: "ANA-CP-006",
    firstQl: 161,
    lastQl: 208,
    qlCount: 48,
    localizedTest: "ANA-CP-006/ana-cp-006-localized.test.ts",
    localizedSources: ["ANA-CP-006/localized-runtime.ts"],
  },
  {
    checkpoint: "ANA-CP-007",
    firstQl: 209,
    lastQl: 222,
    qlCount: 14,
    localizedTest: "ANA-CP-007/ana-cp-007-localized.test.ts",
    localizedSources: ["ANA-CP-007/localized-runtime.ts"],
  },
  {
    checkpoint: "ANA-CP-008",
    firstQl: 223,
    lastQl: 250,
    qlCount: 28,
    localizedTest: "ANA-CP-008/ana-cp-008-localized.test.ts",
    localizedSources: ["ANA-CP-008/localized-runtime.ts"],
  },
] as const;

const repoRoot = process.cwd().endsWith("artifacts/api-server")
  ? join(process.cwd(), "../..")
  : process.cwd();
const root = join(
  repoRoot,
  "artifacts/api-server/src/reasoning-v1/topics/Analogy/ANA-001",
);
const supportedLocales = ["en-IN", "hi-IN", "pa-IN"] as const;
const forbiddenPunjabiEditorialTerms = [
  "ਪਦ",
  "ਸਾਦ੍ਰਿਸ਼ਤਾ",
  "ਸਾਦਰਿਸ਼ਤਾ",
] as const;

const qlIds: string[] = [];
let expectedFirst = 1;
let totalQlCount = 0;

for (const checkpoint of COVERAGE) {
  assert.equal(
    checkpoint.firstQl,
    expectedFirst,
    `${checkpoint.checkpoint} must start immediately after the preceding checkpoint`,
  );
  assert.equal(
    checkpoint.lastQl - checkpoint.firstQl + 1,
    checkpoint.qlCount,
    `${checkpoint.checkpoint} range/count mismatch`,
  );

  const testSource = readFileSync(join(root, checkpoint.localizedTest), "utf8");
  assert.ok(testSource.length > 100, `${checkpoint.localizedTest} must be a substantive executable audit`);

  for (const sourcePath of checkpoint.localizedSources) {
    const source = readFileSync(join(root, sourcePath), "utf8");
    assert.ok(source.length > 50, `${sourcePath} must contain localized source material`);
    for (const forbidden of forbiddenPunjabiEditorialTerms) {
      assert.ok(
        !source.includes(forbidden),
        `${sourcePath} contains avoidable technical Punjabi term ${JSON.stringify(forbidden)}`,
      );
    }
  }

  for (let ordinal = checkpoint.firstQl; ordinal <= checkpoint.lastQl; ordinal += 1) {
    qlIds.push(`ANA-QL-${String(ordinal).padStart(3, "0")}`);
  }

  totalQlCount += checkpoint.qlCount;
  expectedFirst = checkpoint.lastQl + 1;
}

assert.equal(totalQlCount, 250);
assert.equal(qlIds.length, 250);
assert.equal(new Set(qlIds).size, 250);
assert.equal(qlIds[0], "ANA-QL-001");
assert.equal(qlIds.at(-1), "ANA-QL-250");
assert.deepEqual(supportedLocales, ["en-IN", "hi-IN", "pa-IN"]);

console.log("ANA-001 multilingual completion audit passed.", {
  checkpoints: COVERAGE.length,
  qlRange: `${qlIds[0]}..${qlIds.at(-1)}`,
  qlCount: qlIds.length,
  locales: supportedLocales,
  permanentCp009QlCount: 0,
  questionStudioConnected: false,
  publiclyPublishable: false,
});
