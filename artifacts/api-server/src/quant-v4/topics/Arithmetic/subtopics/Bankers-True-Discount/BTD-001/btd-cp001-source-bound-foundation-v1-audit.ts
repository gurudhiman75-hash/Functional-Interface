import assert from "node:assert/strict";
import {
  BTD_001_PROTOTYPE_IDS,
  BTD_001_SOURCE_BOUNDARY,
  constructBtdDiscoveryState,
  solveBtdDiscovery,
  verifyBtdDiscovery,
  type BtdPrototypeId,
  type Rational,
} from "./btd-cp001-source-bound-foundation-v1";
import {
  BTD_001_DISCOVERY_PACKAGING_V2,
  buildBtdDiscoveryQuestionV2,
} from "./btd-cp001-discovery-packaging-v2";

const SEEDS_PER_PROTOTYPE = 200;

function stableJson(value: unknown) {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}
function key(value: Rational) { return `${value.n}/${value.d}`; }
function rat(n: bigint | number, d: bigint | number = 1n): Rational {
  let a = BigInt(n); let b = BigInt(d);
  const abs = (v: bigint) => v < 0n ? -v : v;
  const gcd = (x: bigint, y: bigint) => { let p = abs(x); let q = abs(y); while (q) { const next = p % q; p = q; q = next; } return p || 1n; };
  if (b < 0n) { a = -a; b = -b; }
  const g = gcd(a, b);
  return Object.freeze({ n: a / g, d: b / g });
}
function add(a: Rational, b: Rational) { return rat(a.n * b.d + b.n * a.d, a.d * b.d); }
function sub(a: Rational, b: Rational) { return rat(a.n * b.d - b.n * a.d, a.d * b.d); }
function eq(a: Rational, b: Rational) { return a.n === b.n && a.d === b.d; }
function normalize(text: string) { return text.normalize("NFKC").toLowerCase().replace(/\s+/gu, " ").trim(); }
function skeleton(text: string) {
  return normalize(text)
    .replace(/[0-9]+(?:[.,][0-9]+)*/gu, "#")
    .replace(/[₹$€£]/gu, "¤")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

assert.equal(BTD_001_SOURCE_BOUNDARY.mustRemainSeparateFromInterestChapter, "INT-001");
assert.equal(BTD_001_SOURCE_BOUNDARY.officialPaperProvenanceRecovered, false);
assert.equal(BTD_001_SOURCE_BOUNDARY.permanentQlAllocationAuthorized, false);
assert.equal(BTD_001_SOURCE_BOUNDARY.questionStudioDiscoverable, false);
assert.equal(BTD_001_SOURCE_BOUNDARY.questionBankWritable, false);
assert.equal(BTD_001_SOURCE_BOUNDARY.testEligible, false);
assert.equal(BTD_001_SOURCE_BOUNDARY.mockTestEligible, false);
assert.equal(BTD_001_SOURCE_BOUNDARY.publiclyPublishable, false);
assert.equal(BTD_001_SOURCE_BOUNDARY.legacyRecoveryEvidence.recoveredFamilies.length, 6);
assert.equal(BTD_001_SOURCE_BOUNDARY.externalExamPracticeEvidence.length, 2);
assert.ok(BTD_001_SOURCE_BOUNDARY.externalExamPracticeEvidence.every((evidence) => evidence.provenanceClass === "THIRD_PARTY_EXAM_PREP_NOT_OFFICIAL_PAPER"));

const stateSets = new Map<BtdPrototypeId, Set<string>>();
const stemFamilies = new Map<BtdPrototypeId, Set<string>>();
const exactStems = new Map<string, Set<BtdPrototypeId>>();
const skeletons = new Map<BtdPrototypeId, Set<string>>();
const contexts = new Map<BtdPrototypeId, Set<string>>();
const answerPositions = [0, 0, 0, 0];
const misconceptionIds = new Map<BtdPrototypeId, Set<string>>();
let questions = 0;
let replayChecks = 0;
let solverVerifierChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
let jsonChecks = 0;
let dateGraceChecks = 0;
let formulaIdentityChecks = 0;

for (const prototypeId of BTD_001_PROTOTYPE_IDS) {
  stateSets.set(prototypeId, new Set());
  stemFamilies.set(prototypeId, new Set());
  skeletons.set(prototypeId, new Set());
  contexts.set(prototypeId, new Set());
  misconceptionIds.set(prototypeId, new Set());

  for (let index = 0; index < SEEDS_PER_PROTOTYPE; index += 1) {
    const seed = `BTD-001:DISCOVERY:${prototypeId}:${index}`;
    const first = buildBtdDiscoveryQuestionV2(prototypeId, seed) as any;
    const second = buildBtdDiscoveryQuestionV2(prototypeId, seed) as any;
    assert.equal(stableJson(first), stableJson(second), `${prototypeId}/${index}: deterministic replay drift`);
    replayChecks += 1;

    assert.equal(first.chapterId, "BTD-001");
    assert.equal(first.checkpointId, "BTD-CP-001");
    assert.equal(first.prototypeId, prototypeId);
    assert.equal(first.packagingVersion, BTD_001_DISCOVERY_PACKAGING_V2);
    assert.equal("qlId" in first, false, `${prototypeId}/${index}: qlId leaked during discovery`);
    assert.equal("permanentQlId" in first, false, `${prototypeId}/${index}: permanentQlId leaked during discovery`);
    assert.equal(first.lifecycle.discoveryOnly, true);
    assert.equal(first.lifecycle.permanentQlAllocated, false);
    assert.equal(first.lifecycle.questionStudioDiscoverable, false);
    assert.equal(first.lifecycle.questionBankWritable, false);
    assert.equal(first.lifecycle.testEligible, false);
    assert.equal(first.lifecycle.mockTestEligible, false);
    assert.equal(first.lifecycle.publiclyPublishable, false);
    lifecycleChecks += 7;

    const canonical = solveBtdDiscovery(first.state);
    assert.equal(key(first.answer), key(canonical), `${prototypeId}/${index}: packaged answer differs from solver`);
    assert.equal(verifyBtdDiscovery(first.state, first.answer), true, `${prototypeId}/${index}: independent verifier rejected answer`);
    solverVerifierChecks += 2;

    assert.ok(String(first.presentation.stem).trim().length >= 35, `${prototypeId}/${index}: learner stem too short`);
    assert.ok(String(first.explanation.whatAsked).trim().length >= 10, `${prototypeId}/${index}: whatAsked missing`);
    assert.ok(String(first.explanation.keyIdea).trim().length >= 20, `${prototypeId}/${index}: key idea too thin`);
    assert.ok(Array.isArray(first.explanation.steps) && first.explanation.steps.length >= 2, `${prototypeId}/${index}: calculation steps too thin`);
    assert.ok(String(first.explanation.finalAnswer).trim().length > 0, `${prototypeId}/${index}: final answer missing`);
    explanationChecks += 4;

    assert.equal(first.options.length, 4, `${prototypeId}/${index}: expected four options`);
    assert.equal(new Set(first.options.map((option: any) => option.text)).size, 4, `${prototypeId}/${index}: duplicate option text`);
    assert.equal(first.options.filter((option: any) => option.isCorrect).length, 1, `${prototypeId}/${index}: correct option ownership invalid`);
    assert.equal(first.options[first.correctIndex].text, first.correctAnswer, `${prototypeId}/${index}: correctAnswer binding drift`);
    assert.equal(first.options[first.correctIndex].isCorrect, true, `${prototypeId}/${index}: correctIndex does not own correct option`);
    answerPositions[first.correctIndex] += 1;
    for (const option of first.options) misconceptionIds.get(prototypeId)!.add(String(option.misconceptionId));
    optionChecks += 5;

    JSON.stringify(first, (_key, value) => typeof value === "bigint" ? value.toString() : value);
    JSON.stringify(second, (_key, value) => typeof value === "bigint" ? value.toString() : value);
    jsonChecks += 2;

    stateSets.get(prototypeId)!.add(stableJson(first.state));
    stemFamilies.get(prototypeId)!.add(first.presentation.stemFamilyId);
    skeletons.get(prototypeId)!.add(skeleton(first.presentation.stem));
    if (first.state.context) contexts.get(prototypeId)!.add(String(first.state.context));
    const stemKey = normalize(first.presentation.stem);
    const owners = exactStems.get(stemKey) ?? new Set<BtdPrototypeId>();
    owners.add(prototypeId);
    exactStems.set(stemKey, owners);

    if (prototypeId === "BTD-PROT-008") {
      assert.equal(first.state.graceDays, 3);
      const draw = new Date(`${first.state.drawDateIso}T00:00:00.000Z`);
      const legal = new Date(`${first.state.legalDueDateIso}T00:00:00.000Z`);
      const nominal = new Date(Date.UTC(draw.getUTCFullYear(), draw.getUTCMonth() + first.state.termMonths, 1));
      const last = new Date(Date.UTC(nominal.getUTCFullYear(), nominal.getUTCMonth() + 1, 0)).getUTCDate();
      nominal.setUTCDate(Math.min(draw.getUTCDate(), last));
      const expectedLegal = new Date(nominal.getTime() + 3 * 86_400_000);
      assert.equal(expectedLegal.toISOString().slice(0, 10), first.state.legalDueDateIso, `${prototypeId}/${index}: grace-day due date drift`);
      assert.ok(new Date(`${first.state.discountDateIso}T00:00:00.000Z`) < legal, `${prototypeId}/${index}: discount date must precede legal due date`);
      dateGraceChecks += 2;
    }

    questions += 1;
  }
}

// Core formula identities are checked on matched direct-family states.
for (let index = 0; index < SEEDS_PER_PROTOTYPE; index += 1) {
  const seed = `BTD-001:IDENTITY:${index}`;
  const pwState = constructBtdDiscoveryState("BTD-PROT-001", seed) as any;
  const tdState = constructBtdDiscoveryState("BTD-PROT-002", seed) as any;
  const bdState = constructBtdDiscoveryState("BTD-PROT-003", seed) as any;
  const bgState = constructBtdDiscoveryState("BTD-PROT-004", seed) as any;
  assert.equal(key(pwState.faceValue), key(tdState.faceValue));
  assert.equal(key(pwState.faceValue), key(bdState.faceValue));
  assert.equal(key(pwState.faceValue), key(bgState.faceValue));
  assert.equal(pwState.ratePercent, tdState.ratePercent);
  assert.equal(pwState.months, tdState.months);
  const pw = solveBtdDiscovery(pwState);
  const td = solveBtdDiscovery(tdState);
  const bd = solveBtdDiscovery(bdState);
  const bg = solveBtdDiscovery(bgState);
  assert.equal(eq(add(pw, td), pwState.faceValue), true, `identity/${index}: PW + TD != face value`);
  assert.equal(eq(sub(bd, td), bg), true, `identity/${index}: BD - TD != BG`);
  assert.ok(bd.n * td.d > td.n * bd.d, `identity/${index}: BD must exceed TD for positive rate/time`);
  formulaIdentityChecks += 3;
}

const crossPrototypeExactStemCollisions = [...exactStems.entries()].filter(([, owners]) => owners.size > 1);
assert.deepEqual(crossPrototypeExactStemCollisions, [], `Cross-prototype exact learner stems collided: ${JSON.stringify(crossPrototypeExactStemCollisions.slice(0, 5).map(([stem, owners]) => [stem, [...owners]]))}`);
assert.deepEqual(answerPositions.map((count) => count > 0), [true, true, true, true], "Not all four answer positions were exercised");

for (const prototypeId of BTD_001_PROTOTYPE_IDS) {
  assert.equal(stemFamilies.get(prototypeId)!.size, 3, `${prototypeId}: all three authored stem families were not reached`);
  assert.ok(stateSets.get(prototypeId)!.size >= 70, `${prototypeId}: generated mathematical state pool is too thin (${stateSets.get(prototypeId)!.size})`);
  assert.ok(misconceptionIds.get(prototypeId)!.size >= 4, `${prototypeId}: distractor misconception vocabulary is too thin`);
  assert.ok(skeletons.get(prototypeId)!.size >= 3, `${prototypeId}: normalized presentation skeleton pool is too thin`);
}

for (const prototypeId of ["BTD-PROT-001", "BTD-PROT-002", "BTD-PROT-003", "BTD-PROT-004", "BTD-PROT-005", "BTD-PROT-007"] as const) {
  assert.ok(contexts.get(prototypeId)!.size >= 4, `${prototypeId}: bill-context pool did not diversify sufficiently`);
}

console.log(JSON.stringify({
  auditVersion: "BTD-001-CP001-SOURCE-BOUND-DISCOVERY-AUDIT-v1",
  chapterId: "BTD-001",
  checkpointId: "BTD-CP-001",
  separatedFromInterestChapter: BTD_001_SOURCE_BOUNDARY.mustRemainSeparateFromInterestChapter,
  officialPaperProvenanceRecovered: BTD_001_SOURCE_BOUNDARY.officialPaperProvenanceRecovered,
  legacyRecoveredFamilies: BTD_001_SOURCE_BOUNDARY.legacyRecoveryEvidence.recoveredFamilies,
  externalEvidenceCount: BTD_001_SOURCE_BOUNDARY.externalExamPracticeEvidence.length,
  prototypeCount: BTD_001_PROTOTYPE_IDS.length,
  seedsPerPrototype: SEEDS_PER_PROTOTYPE,
  generatedQuestions: questions,
  deterministicReplayChecks: replayChecks,
  solverVerifierChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  jsonChecks,
  billDateGraceChecks: dateGraceChecks,
  formulaIdentityChecks,
  exactCrossPrototypeStemCollisions: crossPrototypeExactStemCollisions.length,
  answerPositions,
  perPrototype: Object.fromEntries(BTD_001_PROTOTYPE_IDS.map((prototypeId) => [prototypeId, {
    uniqueStates: stateSets.get(prototypeId)!.size,
    stemFamilies: stemFamilies.get(prototypeId)!.size,
    normalizedSkeletons: skeletons.get(prototypeId)!.size,
    contexts: contexts.get(prototypeId)!.size,
    misconceptionIds: misconceptionIds.get(prototypeId)!.size,
  }])),
  permanentQlAllocationAuthorized: false,
  questionStudioDiscoverable: false,
  downstreamDeliveryOpened: false,
}, null, 2));
console.log("PASS_BTD_001_CP001_SOURCE_BOUND_DISCOVERY_AUDIT_V1");
