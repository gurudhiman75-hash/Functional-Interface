import assert from "node:assert/strict";
import {
  BTD_CP002_BOUNDARY,
  BTD_CP002_CANDIDATE_CONTRACTS,
  BTD_CP002_CANDIDATE_IDS,
  BTD_CP002_SOURCE_EVIDENCE,
  BTD_CP002_SOURCE_SATURATION_VERSION,
  btdRat,
  buildBtdCp002CandidateQuestion,
  solveBtdCp002,
  verifyBtdCp002,
  type BtdCp002CandidateId,
  type BtdCp002Rational,
  type BtdCp002State,
} from "./btd-cp002-source-saturation-v1";

const SEEDS_PER_CANDIDATE = 150;
const MIN_UNIQUE_STATES = 60;

function stableJson(value: unknown) { return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item); }
function key(value: BtdCp002Rational) { return `${value.n}/${value.d}`; }
function normalize(text: string) { return text.normalize("NFKC").toLowerCase().replace(/\s+/gu, " ").trim(); }
function skeleton(text: string) { return normalize(text).replace(/[0-9]+(?:[.,][0-9]+)*/gu, "#").replace(/[₹$€£]/gu, "¤").replace(/[\p{P}\p{S}]+/gu, " ").replace(/\s+/gu, " ").trim(); }

const CP001_SIGNATURES = Object.freeze([
  "GIVEN_FACE_RATE_TIME__ASK_PW",
  "GIVEN_FACE_RATE_TIME__ASK_TD",
  "GIVEN_FACE_RATE_TIME__ASK_BD",
  "GIVEN_FACE_RATE_TIME__ASK_BG",
  "GIVEN_FACE_TD__ASK_BD",
  "GIVEN_BD_TD_RATIO_TIME__ASK_RATE",
  "GIVEN_BG_RATE_TIME__ASK_PW",
  "GIVEN_BILL_DATES_RATE__ASK_BD",
  "GIVEN_BD_TD_RATIO_R_EQ_KT__ASK_RATE",
]);

assert.equal(BTD_CP002_BOUNDARY.chapterId, "BTD-001");
assert.equal(BTD_CP002_BOUNDARY.checkpointId, "BTD-CP-002");
assert.equal(BTD_CP002_BOUNDARY.parentDiscoveryCheckpoint, "BTD-CP-001");
assert.equal(BTD_CP002_BOUNDARY.permanentQlAllocationAuthorized, false);
assert.equal(BTD_CP002_BOUNDARY.questionStudioDiscoverable, false);
assert.equal(BTD_CP002_BOUNDARY.questionBankWritable, false);
assert.equal(BTD_CP002_BOUNDARY.testEligible, false);
assert.equal(BTD_CP002_BOUNDARY.mockTestEligible, false);
assert.equal(BTD_CP002_BOUNDARY.publiclyPublishable, false);
assert.equal(BTD_CP002_BOUNDARY.rejectUnsourcedAlgebraicPermutationExplosion, true);
assert.equal(BTD_CP002_CANDIDATE_IDS.length, 11);

const candidateSignatures = BTD_CP002_CANDIDATE_IDS.map((candidateId) => BTD_CP002_CANDIDATE_CONTRACTS[candidateId].signature);
assert.equal(new Set(candidateSignatures).size, candidateSignatures.length, "CP002 candidate semantic signatures collided");
for (const signature of candidateSignatures) assert.equal(CP001_SIGNATURES.includes(signature), false, `CP002 signature duplicates CP001: ${signature}`);

for (const candidateId of BTD_CP002_CANDIDATE_IDS) {
  const evidence = BTD_CP002_SOURCE_EVIDENCE.filter((item) => item.candidateIds.includes(candidateId));
  assert.ok(evidence.length >= 1, `${candidateId}: no source evidence`);
  assert.ok(evidence.every((item) => /^https:\/\//u.test(item.sourceUrl)), `${candidateId}: source URL missing`);
}
assert.ok(BTD_CP002_SOURCE_EVIDENCE.filter((item) => item.provenanceClass === "OFFICIAL_GOVERNMENT_EXAM").length >= 2, "Official source floor not met");
assert.ok(BTD_CP002_SOURCE_EVIDENCE.some((item) => item.examFamily.includes("Goa Public Service Commission")), "GPSC official authority missing");

// Fixed source regressions.
const fixtures: readonly Readonly<{ candidateId: BtdCp002CandidateId; state: BtdCp002State; expected: BtdCp002Rational; label: string }>[] = Object.freeze([
  Object.freeze({ candidateId: "BTD-CAND-010", label: "GPSC 804: PW 576 + BG 16 -> TD 96", state: Object.freeze({ candidateId: "BTD-CAND-010", context: "official GPSC bill", presentWorth: btdRat(576), bankersGain: btdRat(16) }), expected: btdRat(96) }),
  Object.freeze({ candidateId: "BTD-CAND-011", label: "GPSC 2026 Q33: two bills -> difference 2800", state: Object.freeze({ candidateId: "BTD-CAND-011", context: "official GPSC pair", totalFaceValue: btdRat(17200), firstMonths: 3, secondMonths: 6, ratePercent: 10, totalBankersDiscount: btdRat(610) }), expected: btdRat(2800) }),
  Object.freeze({ candidateId: "BTD-CAND-012", label: "corpus: BD 84 + TD 70 -> face 420", state: Object.freeze({ candidateId: "BTD-CAND-012", context: "bill", bankersDiscount: btdRat(84), trueDiscount: btdRat(70) }), expected: btdRat(420) }),
  Object.freeze({ candidateId: "BTD-CAND-013", label: "BD 300, 4%, 60 months -> TD 250", state: Object.freeze({ candidateId: "BTD-CAND-013", context: "bill", bankersDiscount: btdRat(300), ratePercent: 4, months: 60 }), expected: btdRat(250) }),
  Object.freeze({ candidateId: "BTD-CAND-014", label: "IBPS-style ratio 25:24 at 10% -> 5 months", state: Object.freeze({ candidateId: "BTD-CAND-014", context: "bill", bdToTdRatio: btdRat(25, 24), ratePercent: 10 }), expected: btdRat(5) }),
  Object.freeze({ candidateId: "BTD-CAND-015", label: "BG 9 at 15% for 1 year -> TD 60", state: Object.freeze({ candidateId: "BTD-CAND-015", context: "bill", bankersGain: btdRat(9), ratePercent: 15, months: 12 }), expected: btdRat(60) }),
  Object.freeze({ candidateId: "BTD-CAND-016", label: "PPSC-style PW 800 + TD 36 -> BD 37.62", state: Object.freeze({ candidateId: "BTD-CAND-016", context: "bill", presentWorth: btdRat(800), trueDiscount: btdRat(36) }), expected: btdRat(1881, 50) }),
  Object.freeze({ candidateId: "BTD-CAND-017", label: "PPSC-style PW 1600 + TD 160 -> BG 16", state: Object.freeze({ candidateId: "BTD-CAND-017", context: "bill", presentWorth: btdRat(1600), trueDiscount: btdRat(160) }), expected: btdRat(16) }),
  Object.freeze({ candidateId: "BTD-CAND-018", label: "Indian Navy official-paper reproduction: 1600/1680 at 15% -> 4 months", state: Object.freeze({ candidateId: "BTD-CAND-018", context: "bill", bankersDiscountFace: btdRat(1600), trueDiscountFace: btdRat(1680), ratePercent: 15 }), expected: btdRat(4) }),
  Object.freeze({ candidateId: "BTD-CAND-019", label: "BD 120 + TD 110 over 8 months -> 150/11%", state: Object.freeze({ candidateId: "BTD-CAND-019", context: "bill", bankersDiscount: btdRat(120), trueDiscount: btdRat(110), months: 8 }), expected: btdRat(150, 11) }),
  Object.freeze({ candidateId: "BTD-CAND-020", label: "TD 120 at 15% for 6 months -> BD 129", state: Object.freeze({ candidateId: "BTD-CAND-020", context: "bill", trueDiscount: btdRat(120), ratePercent: 15, months: 6 }), expected: btdRat(129) }),
]);
for (const fixture of fixtures) {
  const actual = solveBtdCp002(fixture.state);
  assert.equal(key(actual), key(fixture.expected), `${fixture.label}: solver drift`);
  assert.equal(verifyBtdCp002(fixture.state, actual), true, `${fixture.label}: verifier rejected source answer`);
}

const stateSets = new Map<BtdCp002CandidateId, Set<string>>();
const stemFamilies = new Map<BtdCp002CandidateId, Set<string>>();
const contexts = new Map<BtdCp002CandidateId, Set<string>>();
const skeletons = new Map<BtdCp002CandidateId, Set<string>>();
const exactStems = new Map<string, Set<BtdCp002CandidateId>>();
const answerPositions = [0, 0, 0, 0];
let generatedQuestions = 0;
let replayChecks = 0;
let solverVerifierChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
let jsonChecks = 0;
let sourceBindingChecks = 0;

for (const candidateId of BTD_CP002_CANDIDATE_IDS) {
  stateSets.set(candidateId, new Set()); stemFamilies.set(candidateId, new Set()); contexts.set(candidateId, new Set()); skeletons.set(candidateId, new Set());
  for (let index = 0; index < SEEDS_PER_CANDIDATE; index += 1) {
    const seed = `BTD-CP002:${candidateId}:${index}`;
    const first = buildBtdCp002CandidateQuestion(candidateId, seed) as any;
    const second = buildBtdCp002CandidateQuestion(candidateId, seed) as any;
    assert.equal(stableJson(first), stableJson(second), `${candidateId}/${index}: replay drift`); replayChecks += 1;

    assert.equal(first.chapterId, "BTD-001"); assert.equal(first.checkpointId, "BTD-CP-002"); assert.equal(first.saturationVersion, BTD_CP002_SOURCE_SATURATION_VERSION); assert.equal(first.candidateId, candidateId);
    assert.equal("qlId" in first, false, `${candidateId}/${index}: qlId leaked before allocation`); assert.equal("permanentQlId" in first, false, `${candidateId}/${index}: permanentQlId leaked before allocation`);
    assert.ok(Array.isArray(first.sourceEvidenceIds) && first.sourceEvidenceIds.length >= 1, `${candidateId}/${index}: source binding missing`); sourceBindingChecks += 1;

    const canonical = solveBtdCp002(first.state); assert.equal(key(first.answer), key(canonical), `${candidateId}/${index}: packaged answer drift`); assert.equal(verifyBtdCp002(first.state, first.answer), true, `${candidateId}/${index}: verifier rejected answer`); solverVerifierChecks += 2;
    assert.equal(first.options.length, 4); assert.equal(new Set(first.options.map((option: any) => option.text)).size, 4, `${candidateId}/${index}: duplicate options`); assert.equal(first.options.filter((option: any) => option.isCorrect).length, 1); assert.equal(first.options[first.correctIndex].isCorrect, true); assert.equal(first.options[first.correctIndex].text, first.correctAnswer); answerPositions[first.correctIndex] += 1; optionChecks += 5;
    assert.ok(String(first.presentation.stem).length >= 35); assert.ok(String(first.explanation.whatAsked).length >= 10); assert.ok(String(first.explanation.keyIdea).length >= 20); assert.ok(first.explanation.steps.length >= 2); assert.ok(String(first.explanation.finalAnswer).length > 0); explanationChecks += 5;
    assert.equal(first.lifecycle.discoveryOnly, true); assert.equal(first.lifecycle.permanentQlAllocated, false); assert.equal(first.lifecycle.questionStudioDiscoverable, false); assert.equal(first.lifecycle.questionBankWritable, false); assert.equal(first.lifecycle.testEligible, false); assert.equal(first.lifecycle.mockTestEligible, false); assert.equal(first.lifecycle.publiclyPublishable, false); lifecycleChecks += 7;
    JSON.stringify(first, (_key, value) => typeof value === "bigint" ? value.toString() : value); JSON.stringify(second, (_key, value) => typeof value === "bigint" ? value.toString() : value); jsonChecks += 2;

    stateSets.get(candidateId)!.add(stableJson(first.state)); stemFamilies.get(candidateId)!.add(first.presentation.stemFamilyId); contexts.get(candidateId)!.add(String(first.state.context)); skeletons.get(candidateId)!.add(skeleton(first.presentation.stem)); const stemKey = normalize(first.presentation.stem); const owners = exactStems.get(stemKey) ?? new Set<BtdCp002CandidateId>(); owners.add(candidateId); exactStems.set(stemKey, owners);
    generatedQuestions += 1;
  }
}

const crossCandidateExactStemCollisions = [...exactStems.entries()].filter(([, owners]) => owners.size > 1);
assert.deepEqual(crossCandidateExactStemCollisions, [], `CP002 cross-candidate exact stems collided: ${JSON.stringify(crossCandidateExactStemCollisions.slice(0, 5).map(([stem, owners]) => [stem, [...owners]]))}`);
assert.deepEqual(answerPositions.map((count) => count > 0), [true, true, true, true], "Not all option positions were exercised");
for (const candidateId of BTD_CP002_CANDIDATE_IDS) {
  assert.equal(stemFamilies.get(candidateId)!.size, 3, `${candidateId}: all three stem families not reached`);
  assert.ok(stateSets.get(candidateId)!.size >= MIN_UNIQUE_STATES, `${candidateId}: state breadth too thin (${stateSets.get(candidateId)!.size})`);
  assert.ok(skeletons.get(candidateId)!.size >= 3, `${candidateId}: presentation skeleton breadth too thin`);
  const requiredContexts = candidateId === "BTD-CAND-011" ? 3 : 4;
  assert.ok(contexts.get(candidateId)!.size >= requiredContexts, `${candidateId}: context breadth too thin (${contexts.get(candidateId)!.size})`);
}

console.log(JSON.stringify({
  auditVersion: "BTD-CP002-SOURCE-SATURATION-AUDIT-v1",
  chapterId: "BTD-001",
  checkpointId: "BTD-CP-002",
  sourceSaturationVersion: BTD_CP002_SOURCE_SATURATION_VERSION,
  cp001ExistingPrototypeCount: CP001_SIGNATURES.length,
  cp002CandidateCount: BTD_CP002_CANDIDATE_IDS.length,
  proposedCombinedSemanticCountIfAllSurvive: CP001_SIGNATURES.length + BTD_CP002_CANDIDATE_IDS.length,
  sourceEvidenceRecords: BTD_CP002_SOURCE_EVIDENCE.length,
  officialEvidenceRecords: BTD_CP002_SOURCE_EVIDENCE.filter((item) => item.provenanceClass === "OFFICIAL_GOVERNMENT_EXAM").length,
  fixedSourceRegressions: fixtures.length,
  seedsPerCandidate: SEEDS_PER_CANDIDATE,
  generatedQuestions,
  minimumUniqueStatesRequired: MIN_UNIQUE_STATES,
  replayChecks,
  solverVerifierChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  jsonChecks,
  sourceBindingChecks,
  exactCrossCandidateStemCollisions: crossCandidateExactStemCollisions.length,
  answerPositions,
  perCandidate: Object.fromEntries(BTD_CP002_CANDIDATE_IDS.map((candidateId) => [candidateId, {
    semanticSignature: BTD_CP002_CANDIDATE_CONTRACTS[candidateId].signature,
    answerSemantic: BTD_CP002_CANDIDATE_CONTRACTS[candidateId].answerSemantic,
    sourceEvidenceIds: BTD_CP002_SOURCE_EVIDENCE.filter((item) => item.candidateIds.includes(candidateId)).map((item) => item.evidenceId),
    uniqueStates: stateSets.get(candidateId)!.size,
    stemFamilies: stemFamilies.get(candidateId)!.size,
    contexts: contexts.get(candidateId)!.size,
    normalizedSkeletons: skeletons.get(candidateId)!.size,
  }])),
  permanentQlAllocationAuthorized: false,
  questionStudioDiscoverable: false,
  downstreamDeliveryOpened: false,
}, null, 2));
console.log("PASS_BTD_CP002_SOURCE_SATURATION_AUDIT_V1");
