import assert from "node:assert/strict";
import {
  buildQuotientZeroEdgeCase,
  generateNumCp007Wave04Package,
  NUM_CP007_WAVE04_PROTOTYPE_IDS,
  verifyNumCp007Wave04Package,
  verifyQuotientZeroEdgeCase,
} from "./runtime.ts";

const positions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<string>>();
const fingerprints = new Map<string, Set<string>>();
const representations = new Map<string, Set<string>>();
let generatedPackages = 0;
let deterministicReplayChecks = 0;
let verifierChecks = 0;
let lifecycleViolations = 0;
let quotientZeroEdgeChecks = 0;
let nonZeroExtremumChecks = 0;
let uniqueSameRemainderBoundChecks = 0;

for (const prototypeId of NUM_CP007_WAVE04_PROTOTYPE_IDS) {
  positions.set(prototypeId, new Set());
  difficulties.set(prototypeId, new Set());
  fingerprints.set(prototypeId, new Set());
  representations.set(prototypeId, new Set());

  for (let seed = 1; seed <= 120; seed++) {
    const pkg = generateNumCp007Wave04Package(prototypeId, seed);
    const replay = generateNumCp007Wave04Package(prototypeId, seed);
    generatedPackages++;

    assert.deepEqual(replay, pkg, `${prototypeId} seed ${seed} is not deterministic.`);
    deterministicReplayChecks++;

    const verified = verifyNumCp007Wave04Package(pkg);
    assert.equal(verified, pkg.canonicalAnswer, `${prototypeId} seed ${seed} canonical/verifier mismatch.`);
    assert.equal(pkg.verifierAnswer, pkg.canonicalAnswer, `${prototypeId} seed ${seed} stored verifier mismatch.`);
    verifierChecks++;

    assert.equal(pkg.options.length, 4, `${prototypeId} seed ${seed} must have four options.`);
    assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4, `${prototypeId} seed ${seed} has duplicate options.`);
    assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1, `${prototypeId} seed ${seed} must have one correct option.`);
    assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer, `${prototypeId} seed ${seed} correct index mismatch.`);
    assert.ok(pkg.stem.length >= 40, `${prototypeId} seed ${seed} stem is too short.`);
    assert.ok(pkg.explanation.steps.length >= 2, `${prototypeId} seed ${seed} explanation is incomplete.`);
    assert.ok(!("examSpeedMethod" in pkg.explanation), `${prototypeId} seed ${seed} reintroduced exam-speed clutter.`);
    assert.ok(!("commonTraps" in pkg.explanation), `${prototypeId} seed ${seed} reintroduced common-trap clutter.`);
    assert.ok(!pkg.stem.includes("NUM-CP007"), `${prototypeId} seed ${seed} leaks an internal prototype ID.`);

    positions.get(prototypeId)!.add(pkg.correctIndex);
    difficulties.get(prototypeId)!.add(pkg.difficulty);
    fingerprints.get(prototypeId)!.add(pkg.mathematicalFingerprint);
    representations.get(prototypeId)!.add(pkg.representation);

    if (prototypeId === "NUM-CP007-PROT-031") {
      const remainder = pkg.hiddenState.remainder;
      assert.equal(typeof remainder, "number");
      assert.ok((remainder as number) > 0, "CP-007 extremum must keep zero-remainder states out of this authority.");
      nonZeroExtremumChecks++;
    }

    if (prototypeId === "NUM-CP007-PROT-032") {
      const first = pkg.hiddenState.first as number;
      const second = pkg.hiddenState.second as number;
      const lower = pkg.hiddenState.lower as number;
      const upper = pkg.hiddenState.upper as number;
      const candidates: number[] = [];
      for (let divisor = lower; divisor <= upper; divisor++) {
        if (first % divisor === second % divisor) candidates.push(divisor);
      }
      assert.equal(candidates.length, 1, `${prototypeId} seed ${seed} must isolate exactly one bounded divisor.`);
      uniqueSameRemainderBoundChecks++;
    }

    const lifecycle = pkg.lifecycle;
    if (
      pkg.permanentQlId !== null ||
      lifecycle.permanentQlId !== null ||
      lifecycle.active ||
      lifecycle.questionStudioDiscoverable ||
      lifecycle.questionBankWritable ||
      lifecycle.testEligible ||
      lifecycle.publiclyPublishable
    ) {
      lifecycleViolations++;
    }
  }

  assert.deepEqual([...positions.get(prototypeId)!].sort(), [0, 1, 2, 3], `${prototypeId} did not reach every answer position.`);
  assert.ok(difficulties.get(prototypeId)!.size >= 2, `${prototypeId} did not reach two difficulty bands.`);
  assert.ok(fingerprints.get(prototypeId)!.size >= 60, `${prototypeId} lacks mathematical variation.`);
}

assert.equal(representations.get("NUM-CP007-PROT-025")!.size, 3, "Linked relation family must reach all three relation shapes.");
assert.equal(representations.get("NUM-CP007-PROT-026")!.size, 2, "Inverse propagation must reach sum and scale modes.");
assert.equal(representations.get("NUM-CP007-PROT-027")!.size, 2, "Successive chain must reach reconstruction and product-remainder targets.");
assert.equal(representations.get("NUM-CP007-PROT-031")!.size, 2, "Extremum family must reach least-above and greatest-below modes.");

for (let seed = 1; seed <= 120; seed++) {
  const edge = buildQuotientZeroEdgeCase(seed);
  assert.ok(verifyQuotientZeroEdgeCase(edge), `Quotient-zero edge seed ${seed} is invalid.`);
  assert.equal(edge.quotient, 0);
  assert.equal(edge.remainder, edge.dividend);
  assert.ok(edge.dividend < edge.divisor);
  quotientZeroEdgeChecks++;
}

assert.equal(lifecycleViolations, 0, "Wave 04 lifecycle must remain closed.");
assert.equal(nonZeroExtremumChecks, 120);
assert.equal(uniqueSameRemainderBoundChecks, 120);
assert.equal(quotientZeroEdgeChecks, 120);

console.log(JSON.stringify({
  status: "PASS_NUM_CP007_WAVE04_AUTHORITY",
  temporaryPrototypeCount: NUM_CP007_WAVE04_PROTOTYPE_IDS.length,
  seedsPerPrototype: 120,
  generatedPackages,
  deterministicReplayChecks,
  verifierChecks,
  quotientZeroEdgeChecks,
  nonZeroExtremumChecks,
  uniqueSameRemainderBoundChecks,
  lifecycleViolations,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-098",
  answerPositionsByPrototype: Object.fromEntries([...positions].map(([key, value]) => [key, [...value].sort()])),
  difficultyBandsByPrototype: Object.fromEntries([...difficulties].map(([key, value]) => [key, [...value].sort()])),
  representationModesByPrototype: Object.fromEntries([...representations].map(([key, value]) => [key, [...value].sort()])),
  distinctFingerprintsByPrototype: Object.fromEntries([...fingerprints].map(([key, value]) => [key, value.size])),
}, null, 2));
