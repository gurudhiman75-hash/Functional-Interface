import assert from "node:assert/strict";
import { systemSolutions } from "./common.ts";
import { generateNumCp008Wave04Package } from "./runtime.ts";
import { NUM_CP008_WAVE04_PROTOTYPE_IDS } from "./types.ts";

let packages = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
const positionCoverage = new Map<string, Set<number>>();
const difficultyCoverage = new Map<string, Set<string>>();
const fingerprintCoverage = new Map<string, Set<string>>();
const multiplicityCoverage = new Set<string>();
let completeSetChecks = 0;

for (const prototypeId of NUM_CP008_WAVE04_PROTOTYPE_IDS) {
  positionCoverage.set(prototypeId, new Set());
  difficultyCoverage.set(prototypeId, new Set());
  fingerprintCoverage.set(prototypeId, new Set());

  for (let seed = 1; seed <= 120; seed++) {
    const pkg = generateNumCp008Wave04Package(prototypeId, seed);
    const replay = generateNumCp008Wave04Package(prototypeId, seed);
    assert.deepEqual(replay, pkg, `Replay mismatch for ${prototypeId} seed ${seed}`);
    replayChecks++;

    assert.equal(pkg.canonicalAnswer, pkg.verifierAnswer, `Verifier mismatch for ${prototypeId} seed ${seed}`);
    verifierChecks++;

    assert.equal(pkg.options.length, 4);
    assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
    assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(pkg.options[pkg.correctIndex]?.isCorrect, true);
    assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
    optionChecks++;

    assert.equal(pkg.permanentQlId, null);
    assert.equal(pkg.lifecycle.active, false);
    assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
    assert.equal(pkg.lifecycle.questionBankWritable, false);
    assert.equal(pkg.lifecycle.testEligible, false);
    assert.equal(pkg.lifecycle.publiclyPublishable, false);

    positionCoverage.get(prototypeId)!.add(pkg.correctIndex);
    difficultyCoverage.get(prototypeId)!.add(pkg.difficulty);
    fingerprintCoverage.get(prototypeId)!.add(pkg.mathematicalFingerprint);

    const state = pkg.hiddenState as {
      constraints: readonly { residue: number; modulus: number }[];
      lower: number;
      upper: number;
      canonicalSolutions: readonly number[];
      verifierSolutions: readonly number[];
    };
    const direct = systemSolutions(state.constraints, state.lower, state.upper);
    assert.deepEqual(direct, state.verifierSolutions);

    if (prototypeId === "NUM-CP008-PROT-025") {
      multiplicityCoverage.add(pkg.canonicalAnswer);
      const expected = direct.length === 0 ? "No solution" : direct.length === 1 ? "Exactly one solution" : "More than one solution";
      assert.equal(pkg.canonicalAnswer, expected);
    } else {
      assert.ok(direct.length >= 2);
      assert.deepEqual(state.canonicalSolutions, direct);
      assert.equal(pkg.canonicalAnswer, `{${direct.join(", ")}}`);
      completeSetChecks++;
    }

    packages++;
  }
}

for (const prototypeId of NUM_CP008_WAVE04_PROTOTYPE_IDS) {
  assert.deepEqual([...positionCoverage.get(prototypeId)!].sort(), [0, 1, 2, 3], `Answer-position gap for ${prototypeId}`);
  assert.ok(difficultyCoverage.get(prototypeId)!.size >= 2, `Need at least two genuine difficulty bands for ${prototypeId}`);
  assert.ok(fingerprintCoverage.get(prototypeId)!.size >= 80, `Insufficient mathematical-state diversity for ${prototypeId}`);
}

assert.deepEqual([...multiplicityCoverage].sort(), ["Exactly one solution", "More than one solution", "No solution"].sort());
assert.equal(completeSetChecks, 120);
assert.equal(packages, 240);
assert.equal(replayChecks, 240);
assert.equal(verifierChecks, 240);
assert.equal(optionChecks, 240);

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE04_FINAL_MATERIAL_GAPS",
  prototypes: NUM_CP008_WAVE04_PROTOTYPE_IDS.length,
  packages,
  replayChecks,
  verifierChecks,
  optionChecks,
  multiplicityClasses: [...multiplicityCoverage].sort(),
  completeSetChecks,
  answerPositions: Object.fromEntries([...positionCoverage].map(([id, set]) => [id, [...set].sort()])),
  difficultyBands: Object.fromEntries([...difficultyCoverage].map(([id, set]) => [id, [...set].sort()])),
  distinctFingerprints: Object.fromEntries([...fingerprintCoverage].map(([id, set]) => [id, set.size])),
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-166",
}, null, 2));
