import assert from "node:assert/strict";
import {
  generateNumCp007Wave03Package,
  NUM_CP007_WAVE03_PROTOTYPE_IDS,
  verifyNumCp007Wave03Package,
} from "./runtime.ts";

const positions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<string>>();
const fingerprints = new Map<string, Set<string>>();
let generatedPackages = 0;
let deterministicReplayChecks = 0;
let verifierChecks = 0;
let lifecycleViolations = 0;

for (const prototypeId of NUM_CP007_WAVE03_PROTOTYPE_IDS) {
  positions.set(prototypeId, new Set());
  difficulties.set(prototypeId, new Set());
  fingerprints.set(prototypeId, new Set());

  for (let seed = 1; seed <= 120; seed++) {
    const pkg = generateNumCp007Wave03Package(prototypeId, seed);
    const replay = generateNumCp007Wave03Package(prototypeId, seed);
    generatedPackages++;

    assert.deepEqual(replay, pkg, `${prototypeId} seed ${seed} is not deterministic.`);
    deterministicReplayChecks++;

    const verified = verifyNumCp007Wave03Package(pkg);
    assert.equal(verified, pkg.canonicalAnswer, `${prototypeId} seed ${seed} canonical/verifier mismatch.`);
    assert.equal(pkg.verifierAnswer, pkg.canonicalAnswer, `${prototypeId} seed ${seed} stored verifier mismatch.`);
    verifierChecks++;

    assert.equal(pkg.options.length, 4, `${prototypeId} seed ${seed} must have four options.`);
    assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4, `${prototypeId} seed ${seed} has duplicate options.`);
    assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1, `${prototypeId} seed ${seed} must have one correct option.`);
    assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer, `${prototypeId} seed ${seed} correct index mismatch.`);
    assert.ok(pkg.stem.length >= 35, `${prototypeId} seed ${seed} stem is too short.`);
    assert.ok(pkg.explanation.steps.length >= 2, `${prototypeId} seed ${seed} explanation is incomplete.`);
    assert.ok(!("examSpeedMethod" in pkg.explanation), `${prototypeId} seed ${seed} reintroduced exam-speed clutter.`);
    assert.ok(!("commonTraps" in pkg.explanation), `${prototypeId} seed ${seed} reintroduced common-trap clutter.`);
    assert.ok(!pkg.stem.includes("NUM-CP007"), `${prototypeId} seed ${seed} leaks an internal prototype ID.`);

    positions.get(prototypeId)!.add(pkg.correctIndex);
    difficulties.get(prototypeId)!.add(pkg.difficulty);
    fingerprints.get(prototypeId)!.add(pkg.mathematicalFingerprint);

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
  assert.ok(fingerprints.get(prototypeId)!.size >= 70, `${prototypeId} lacks mathematical variation.`);
}

assert.equal(lifecycleViolations, 0, "Wave 03 lifecycle must remain closed.");

console.log(JSON.stringify({
  status: "PASS_NUM_CP007_WAVE03_AUTHORITY",
  temporaryPrototypeCount: NUM_CP007_WAVE03_PROTOTYPE_IDS.length,
  seedsPerPrototype: 120,
  generatedPackages,
  deterministicReplayChecks,
  verifierChecks,
  lifecycleViolations,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-098",
  answerPositionsByPrototype: Object.fromEntries([...positions].map(([key, value]) => [key, [...value].sort()])),
  difficultyBandsByPrototype: Object.fromEntries([...difficulties].map(([key, value]) => [key, [...value].sort()])),
  distinctFingerprintsByPrototype: Object.fromEntries([...fingerprints].map(([key, value]) => [key, value.size])),
}, null, 2));
