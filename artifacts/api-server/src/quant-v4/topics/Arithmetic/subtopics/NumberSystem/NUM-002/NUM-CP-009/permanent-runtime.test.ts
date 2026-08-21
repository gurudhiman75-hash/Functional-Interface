import assert from "node:assert/strict";
import { NUM_CP009_PERMANENT_ALLOCATION, type NumCp009PermanentQlId } from "./permanent-allocation.ts";
import { generateNumCp009Permanent } from "./permanent-runtime.ts";

const SAMPLES_PER_QL = 180;
let packages = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;

const prototypeReach = new Map<string, Set<string>>();
const difficultyReach = new Map<string, Set<string>>();
const stemFamilyReach = new Map<string, Set<string>>();
const representationReach = new Map<string, Set<string>>();
const fingerprintReach = new Map<string, Set<string>>();
const globalPrototypeReach = new Set<string>();

let p015LastTwo = 0;
let p015LastThree = 0;
let exact00 = 0;
let exact000 = 0;
const p016ClassCounts = new Set<number>();
const p003Operators = new Set<string>();
let longSumFullBlocks = 0;
let longSumWithLeftovers = 0;

for (const allocation of NUM_CP009_PERMANENT_ALLOCATION) {
  const qlId = allocation.qlId as NumCp009PermanentQlId;
  const prototypes = new Set<string>();
  const difficulties = new Set<string>();
  const stemFamilies = new Set<string>();
  const representations = new Set<string>();
  const fingerprints = new Set<string>();
  const allowedPrototypes = new Set(allocation.sourceSlices.map((slice) => slice.prototypeId));

  for (let seed = 1; seed <= SAMPLES_PER_QL; seed += 1) {
    const first = generateNumCp009Permanent(qlId, seed);
    const second = generateNumCp009Permanent(qlId, seed);
    const label = `${qlId}/${seed}`;

    assert.deepEqual(first, second, `${label}: deterministic replay drift`);
    replayChecks += 1;

    assert.equal(first.packageId, "NUM-002", `${label}: package drift`);
    assert.equal(first.checkpointId, "NUM-CP-009", `${label}: checkpoint drift`);
    assert.equal(first.permanentQlId, qlId, `${label}: permanent QL drift`);
    assert.equal(first.authorityId, allocation.authorityId, `${label}: authority id drift`);
    assert.equal(first.authorityLabel, allocation.label, `${label}: authority label drift`);
    assert.equal(first.answerSemantic, allocation.authorityAnswerSemantic, `${label}: authority answer-semantic drift`);
    assert.ok(allowedPrototypes.has(first.temporaryPrototypeId), `${label}: source prototype outside approved authority`);
    assert.ok(Number.isSafeInteger(first.sourceSeed) && first.sourceSeed >= 1, `${label}: invalid source seed`);

    if (qlId === "NUM-QL-191") assert.equal(first.answerSemantic, "LAST_TWO_DIGITS", `${label}: terminal-width drift`);
    if (qlId === "NUM-QL-192") assert.equal(first.answerSemantic, "LAST_THREE_DIGITS", `${label}: terminal-width drift`);

    assert.equal(first.canonicalAnswer, first.verifierAnswer, `${label}: verifier mismatch`);
    verifierChecks += 1;

    assert.equal(first.options.length, 4, `${label}: option count`);
    assert.equal(new Set(first.options.map((option) => option.value)).size, 4, `${label}: duplicate option value`);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1, `${label}: keyed-answer count`);
    assert.equal(first.options[first.correctIndex]?.value, first.canonicalAnswer, `${label}: correct-index binding`);
    optionChecks += 1;

    assert.ok(
      first.explanation.finalAnswer.includes(first.canonicalAnswer),
      `${label}: explanation final-answer does not contain canonical answer`,
    );
    assert.ok(first.explanation.coreConcept.trim().length >= 12, `${label}: concept too thin`);
    assert.ok(first.explanation.strategy.trim().length >= 12, `${label}: strategy too thin`);
    assert.ok(first.explanation.steps.length >= 2 && first.explanation.steps.length <= 5, `${label}: explanation step count`);
    assert.ok(first.stem.trim().length >= 20, `${label}: stem too thin`);
    const learnerText = [
      first.stem,
      first.explanation.coreConcept,
      first.explanation.strategy,
      ...first.explanation.steps,
      first.explanation.finalAnswer,
    ].join(" ");
    assert.doesNotMatch(
      learnerText,
      /prototype|generator|fingerprint|hidden state|source seed|authority package|question studio|question bank/i,
      `${label}: implementation vocabulary leak`,
    );
    explanationChecks += 1;

    assert.equal(first.lifecycle.permanentQlId, qlId, `${label}: lifecycle QL drift`);
    assert.equal(first.lifecycle.maturity, "PERMANENT_AUTHORITY", `${label}: maturity drift`);
    assert.equal(first.lifecycle.reviewStatus, "ENGLISH_FROZEN", `${label}: English freeze drift`);
    assert.equal(first.lifecycle.questionBankStatus, "NOT_STORED", `${label}: Question Bank status drift`);
    assert.equal(first.lifecycle.testEligibility, "INELIGIBLE", `${label}: test eligibility label drift`);
    assert.equal(first.lifecycle.active, false, `${label}: active gate opened`);
    assert.equal(first.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
    assert.equal(first.lifecycle.questionBankWritable, false, `${label}: Question Bank write gate opened`);
    assert.equal(first.lifecycle.testEligible, false, `${label}: test gate opened`);
    assert.equal(first.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
    lifecycleChecks += 1;

    prototypes.add(first.temporaryPrototypeId);
    globalPrototypeReach.add(first.temporaryPrototypeId);
    difficulties.add(first.difficulty);
    stemFamilies.add(first.stemFamily);
    representations.add(first.representation);
    fingerprints.add(first.mathematicalFingerprint);

    if (first.temporaryPrototypeId === "NUM-CP009-PROT-015") {
      if (qlId === "NUM-QL-191") {
        assert.equal(first.sourceAnswerSemantic, "LAST_TWO_DIGITS", `${label}: P015 wrong last-two slice`);
        p015LastTwo += 1;
        if (first.canonicalAnswer === "00") exact00 += 1;
      } else if (qlId === "NUM-QL-192") {
        assert.equal(first.sourceAnswerSemantic, "LAST_THREE_DIGITS", `${label}: P015 wrong last-three slice`);
        p015LastThree += 1;
        if (first.canonicalAnswer === "000") exact000 += 1;
      } else {
        assert.fail(`${label}: P015 leaked outside last-two/last-three authorities`);
      }
    }

    if (first.temporaryPrototypeId === "NUM-CP009-PROT-016") {
      const classCount = Number(first.hiddenState.classCount);
      assert.ok(classCount === 2 || classCount === 3, `${label}: invalid P016 class count`);
      p016ClassCounts.add(classCount);
    }

    if (first.temporaryPrototypeId === "NUM-CP009-PROT-003") {
      p003Operators.add(String(first.hiddenState.operator));
    }

    if (first.temporaryPrototypeId === "NUM-CP009-PROT-017") {
      const leftoverCount = Number(first.hiddenState.leftoverCount);
      if (leftoverCount === 0) longSumFullBlocks += 1;
      else longSumWithLeftovers += 1;
    }

    packages += 1;
  }

  assert.deepEqual([...prototypes].sort(), [...allowedPrototypes].sort(), `${qlId}: approved source-prototype coverage drift`);
  assert.ok(difficulties.size >= 2, `${qlId}: expected at least two difficulty bands`);
  assert.equal(stemFamilies.size, 3, `${qlId}: expected all three approved stem families`);
  assert.ok(fingerprints.size >= 80, `${qlId}: insufficient mathematical diversity (${fingerprints.size})`);

  prototypeReach.set(qlId, prototypes);
  difficultyReach.set(qlId, difficulties);
  stemFamilyReach.set(qlId, stemFamilies);
  representationReach.set(qlId, representations);
  fingerprintReach.set(qlId, fingerprints);
}

assert.equal(packages, NUM_CP009_PERMANENT_ALLOCATION.length * SAMPLES_PER_QL);
assert.equal(replayChecks, packages);
assert.equal(verifierChecks, packages);
assert.equal(optionChecks, packages);
assert.equal(explanationChecks, packages);
assert.equal(lifecycleChecks, packages);
assert.equal(globalPrototypeReach.size, 17, "Not all 17 discovery prototypes reached permanent runtime");
assert.ok(p015LastTwo > 0 && p015LastThree > 0, "P015 split slices not both reached");
assert.ok(exact00 > 0, "Permanent last-two authority failed to retain exact 00 edge states");
assert.ok(exact000 > 0, "Permanent last-three authority failed to retain exact 000 edge states");
assert.deepEqual([...p016ClassCounts].sort(), [2, 3], "P016 must retain both two-class and three-class conditions");
assert.deepEqual([...p003Operators].sort(), ["+", "−"].sort(), "P003 must retain both sum and difference forms");
assert.ok(longSumFullBlocks > 0 && longSumWithLeftovers > 0, "P017 must retain full-block and leftover long sums");

console.log(JSON.stringify({
  status: "PASS_NUM_CP009_PERMANENT_ENGLISH_RUNTIME",
  permanentAuthorities: NUM_CP009_PERMANENT_ALLOCATION.length,
  samplesPerAuthority: SAMPLES_PER_QL,
  packages,
  replayChecks,
  verifierChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  discoveryPrototypeReach: globalPrototypeReach.size,
  p015SplitReach: { lastTwo: p015LastTwo, lastThree: p015LastThree, exact00, exact000 },
  p016ClassCounts: [...p016ClassCounts].sort(),
  p003Operators: [...p003Operators].sort(),
  longPowerSums: { exactFullBlocks: longSumFullBlocks, withLeftovers: longSumWithLeftovers },
  prototypeReach: Object.fromEntries([...prototypeReach].map(([key, values]) => [key, [...values].sort()])),
  difficultyReach: Object.fromEntries([...difficultyReach].map(([key, values]) => [key, [...values].sort()])),
  stemFamilyReach: Object.fromEntries([...stemFamilyReach].map(([key, values]) => [key, [...values].sort()])),
  representationReach: Object.fromEntries([...representationReach].map(([key, values]) => [key, [...values].sort()])),
  distinctFingerprints: Object.fromEntries([...fingerprintReach].map(([key, values]) => [key, values.size])),
  questionStudioDiscoverable: 0,
  questionBankWritable: 0,
  testEligible: 0,
  publiclyPublishable: 0,
  nextAvailableQl: "NUM-QL-197",
}, null, 2));