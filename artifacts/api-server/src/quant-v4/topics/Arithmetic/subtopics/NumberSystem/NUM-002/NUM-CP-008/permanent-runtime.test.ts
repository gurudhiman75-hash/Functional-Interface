import assert from "node:assert/strict";
import { NUM_CP008_PERMANENT_ALLOCATION } from "./permanent-allocation.ts";
import { generateNumCp008Permanent, type NumCp008PermanentQlId } from "./permanent-runtime.ts";

let packages = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
const prototypeReach = new Map<string, Set<string>>();
const difficultyReach = new Map<string, Set<string>>();
const fingerprintReach = new Map<string, Set<string>>();

for (const allocation of NUM_CP008_PERMANENT_ALLOCATION) {
  const qlId = allocation.qlId as NumCp008PermanentQlId;
  const prototypes = new Set<string>();
  const difficulties = new Set<string>();
  const fingerprints = new Set<string>();

  for (let seed = 1; seed <= 120; seed += 1) {
    const first = generateNumCp008Permanent(qlId, seed);
    const second = generateNumCp008Permanent(qlId, seed);
    const label = `${qlId}/${seed}`;

    assert.deepEqual(first, second, `${label}: deterministic replay drift`);
    replayChecks += 1;

    assert.equal(first.permanentQlId, qlId, `${label}: permanent QL drift`);
    assert.ok(allocation.prototypes.includes(first.temporaryPrototypeId), `${label}: source prototype outside approved authority`);
    assert.equal(first.canonicalAnswer, first.verifierAnswer, `${label}: verifier mismatch`);
    verifierChecks += 1;

    assert.equal(first.options.length, 4, `${label}: option count`);
    assert.equal(new Set(first.options.map((option) => option.value)).size, 4, `${label}: duplicate option value`);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1, `${label}: keyed-answer count`);
    assert.equal(first.options[first.correctIndex]?.value, first.canonicalAnswer, `${label}: correct-index binding`);
    optionChecks += 1;

    assert.equal(first.explanation.finalAnswer, first.canonicalAnswer, `${label}: explanation final-answer drift`);
    assert.ok(first.explanation.coreConcept.trim().length > 0, `${label}: empty concept`);
    assert.ok(first.explanation.strategy.trim().length > 0, `${label}: empty strategy`);
    assert.ok(first.explanation.steps.length >= 2, `${label}: explanation too thin`);
    const learnerText = [first.stem, first.explanation.coreConcept, first.explanation.strategy, ...first.explanation.steps].join(" ");
    assert.doesNotMatch(learnerText, /prototype|generator|fingerprint|hidden state|authority package/i, `${label}: implementation vocabulary leak`);
    explanationChecks += 1;

    assert.equal(first.lifecycle.permanentQlId, qlId, `${label}: lifecycle QL drift`);
    assert.equal(first.lifecycle.maturity, "PERMANENT_AUTHORITY");
    assert.equal(first.lifecycle.reviewStatus, "ENGLISH_FROZEN");
    assert.equal(first.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(first.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(first.lifecycle.active, false);
    assert.equal(first.lifecycle.questionStudioDiscoverable, false);
    assert.equal(first.lifecycle.questionBankWritable, false);
    assert.equal(first.lifecycle.testEligible, false);
    assert.equal(first.lifecycle.publiclyPublishable, false);

    prototypes.add(first.temporaryPrototypeId);
    difficulties.add(first.difficulty);
    fingerprints.add(first.mathematicalFingerprint);
    packages += 1;
  }

  assert.deepEqual([...prototypes].sort(), [...allocation.prototypes].sort(), `${qlId}: approved source-prototype coverage drift`);
  assert.ok(difficulties.size >= 2, `${qlId}: expected at least two difficulty bands`);
  assert.ok(fingerprints.size >= 60, `${qlId}: insufficient mathematical diversity (${fingerprints.size})`);
  prototypeReach.set(qlId, prototypes);
  difficultyReach.set(qlId, difficulties);
  fingerprintReach.set(qlId, fingerprints);
}

assert.equal(packages, 19 * 120);
assert.equal(replayChecks, packages);
assert.equal(verifierChecks, packages);
assert.equal(optionChecks, packages);
assert.equal(explanationChecks, packages);

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_PERMANENT_ENGLISH_RUNTIME",
  permanentAuthorities: NUM_CP008_PERMANENT_ALLOCATION.length,
  packages,
  replayChecks,
  verifierChecks,
  optionChecks,
  explanationChecks,
  prototypeReach: Object.fromEntries([...prototypeReach].map(([key, values]) => [key, [...values].sort()])),
  difficultyReach: Object.fromEntries([...difficultyReach].map(([key, values]) => [key, [...values].sort()])),
  distinctFingerprints: Object.fromEntries([...fingerprintReach].map(([key, values]) => [key, values.size])),
  questionStudioDiscoverable: 0,
  questionBankWritable: 0,
  testEligible: 0,
  publiclyPublishable: 0,
  nextAvailableQl: "NUM-QL-185",
}, null, 2));
