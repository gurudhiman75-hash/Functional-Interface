import assert from "node:assert/strict";
import {
  constructBtdDiscoveryState,
  solveBtdDiscovery,
  verifyBtdDiscovery,
  type Rational,
} from "./btd-cp001-source-bound-foundation-v1";
import { BTD_001_SOURCE_AUTHORITY_V2 } from "./btd-cp001-source-authority-v2";
import {
  solveBtdPrototype009,
  verifyBtdPrototype009,
  type BtdPrototype009State,
} from "./btd-cp001-official-source-expansion-v4";
import {
  BTD_001_BREADTH_REMEDIATION_V5,
  BTD_001_DISCOVERY_PROTOTYPE_IDS_V5,
  buildBtdDiscoveryQuestionV5,
  solveBtdPrototype006V5,
  verifyBtdPrototype006V5,
  type BtdDiscoveryPrototypeIdV5,
} from "./btd-cp001-breadth-remediation-v5";

const SEEDS_PER_PROTOTYPE = 200;
const MAX_ALLOWED_PACKAGING_ATTEMPTS = 8;

function stableJson(value: unknown) { return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item); }
function key(value: Rational) { return `${value.n}/${value.d}`; }
function abs(value: bigint) { return value < 0n ? -value : value; }
function gcd(left: bigint, right: bigint): bigint { let a = abs(left); let b = abs(right); while (b) { const next = a % b; a = b; b = next; } return a || 1n; }
function rat(n: bigint | number, d: bigint | number = 1n): Rational { let a = BigInt(n); let b = BigInt(d); if (b < 0n) { a = -a; b = -b; } const g = gcd(a, b); return Object.freeze({ n: a / g, d: b / g }); }
function add(a: Rational, b: Rational) { return rat(a.n * b.d + b.n * a.d, a.d * b.d); }
function sub(a: Rational, b: Rational) { return rat(a.n * b.d - b.n * a.d, a.d * b.d); }
function eq(a: Rational, b: Rational) { return a.n === b.n && a.d === b.d; }
function normalize(text: string) { return text.normalize("NFKC").toLowerCase().replace(/\s+/gu, " ").trim(); }
function skeleton(text: string) { return normalize(text).replace(/[0-9]+(?:[.,][0-9]+)*/gu, "#").replace(/[₹$€£]/gu, "¤").replace(/[\p{P}\p{S}]+/gu, " ").replace(/\s+/gu, " ").trim(); }
function solveAny(prototypeId: BtdDiscoveryPrototypeIdV5, state: any): Rational {
  if (prototypeId === "BTD-PROT-006") return solveBtdPrototype006V5(state);
  if (prototypeId === "BTD-PROT-009") return solveBtdPrototype009(state);
  return solveBtdDiscovery(state);
}
function verifyAny(prototypeId: BtdDiscoveryPrototypeIdV5, state: any, answer: Rational): boolean {
  if (prototypeId === "BTD-PROT-006") return verifyBtdPrototype006V5(state, answer);
  if (prototypeId === "BTD-PROT-009") return verifyBtdPrototype009(state, answer);
  return verifyBtdDiscovery(state, answer);
}

assert.equal(BTD_001_SOURCE_AUTHORITY_V2.mustRemainSeparateFromInterestChapter, "INT-001");
assert.equal(BTD_001_SOURCE_AUTHORITY_V2.officialPaperProvenanceRecovered, true);
assert.equal(BTD_001_SOURCE_AUTHORITY_V2.officialExamEvidence.length, 1);
assert.equal(BTD_001_SOURCE_AUTHORITY_V2.officialExamEvidence[0]!.authorityId, "OFFICIAL-GPSC-GOA-JSO-BATCH8-2026-Q27");
assert.equal(BTD_001_SOURCE_AUTHORITY_V2.permanentQlAllocationAuthorized, false);
assert.equal(BTD_001_SOURCE_AUTHORITY_V2.questionStudioDiscoverable, false);
assert.equal(BTD_001_SOURCE_AUTHORITY_V2.questionBankWritable, false);
assert.equal(BTD_001_SOURCE_AUTHORITY_V2.testEligible, false);
assert.equal(BTD_001_SOURCE_AUTHORITY_V2.mockTestEligible, false);
assert.equal(BTD_001_SOURCE_AUTHORITY_V2.publiclyPublishable, false);

const gpscFixture: BtdPrototype009State = Object.freeze({ prototypeId: "BTD-PROT-009", context: "official GPSC bill", bdToTdRatio: rat(6, 5), rateEqualsYearsMultiplier: 5, hiddenCanonicalYears: 2 });
const gpscAnswer = solveBtdPrototype009(gpscFixture);
assert.equal(key(gpscAnswer), key(rat(10)));
assert.equal(verifyBtdPrototype009(gpscFixture, gpscAnswer), true);

const stateSets = new Map<BtdDiscoveryPrototypeIdV5, Set<string>>();
const stemFamilies = new Map<BtdDiscoveryPrototypeIdV5, Set<string>>();
const exactStems = new Map<string, Set<BtdDiscoveryPrototypeIdV5>>();
const skeletons = new Map<BtdDiscoveryPrototypeIdV5, Set<string>>();
const contexts = new Map<BtdDiscoveryPrototypeIdV5, Set<string>>();
const misconceptionIds = new Map<BtdDiscoveryPrototypeIdV5, Set<string>>();
const remediatedByPrototype = new Map<BtdDiscoveryPrototypeIdV5, number>();
const maxAttemptsByPrototype = new Map<BtdDiscoveryPrototypeIdV5, number>();
const answerPositions = [0, 0, 0, 0];
let questions = 0, replayChecks = 0, solverVerifierChecks = 0, optionChecks = 0, explanationChecks = 0, lifecycleChecks = 0, jsonChecks = 0, dateGraceChecks = 0, formulaIdentityChecks = 0, remediatedPackages = 0, totalPackagingAttempts = 0, maximumPackagingAttempts = 0;

for (const prototypeId of BTD_001_DISCOVERY_PROTOTYPE_IDS_V5) {
  stateSets.set(prototypeId, new Set()); stemFamilies.set(prototypeId, new Set()); skeletons.set(prototypeId, new Set()); contexts.set(prototypeId, new Set()); misconceptionIds.set(prototypeId, new Set()); remediatedByPrototype.set(prototypeId, 0); maxAttemptsByPrototype.set(prototypeId, 0);
  for (let index = 0; index < SEEDS_PER_PROTOTYPE; index += 1) {
    const seed = `BTD-001:V5:${prototypeId}:${index}`;
    const first = buildBtdDiscoveryQuestionV5(prototypeId, seed) as any;
    const second = buildBtdDiscoveryQuestionV5(prototypeId, seed) as any;
    assert.equal(stableJson(first), stableJson(second), `${prototypeId}/${index}: deterministic replay drift`);
    assert.equal(first.requestedSeed, seed); assert.ok(first.packagingResolutionAttempts >= 1 && first.packagingResolutionAttempts <= MAX_ALLOWED_PACKAGING_ATTEMPTS, `${prototypeId}/${index}: packaging attempts ${first.packagingResolutionAttempts}`);
    if (first.packagingResolutionAttempts > 1) { remediatedPackages += 1; remediatedByPrototype.set(prototypeId, remediatedByPrototype.get(prototypeId)! + 1); }
    totalPackagingAttempts += first.packagingResolutionAttempts; maximumPackagingAttempts = Math.max(maximumPackagingAttempts, first.packagingResolutionAttempts); maxAttemptsByPrototype.set(prototypeId, Math.max(maxAttemptsByPrototype.get(prototypeId)!, first.packagingResolutionAttempts)); replayChecks += 1;

    assert.equal(first.chapterId, "BTD-001"); assert.equal(first.checkpointId, "BTD-CP-001"); assert.equal(first.prototypeId, prototypeId); assert.equal(first.packagingVersion, BTD_001_BREADTH_REMEDIATION_V5); assert.equal(first.sourceBoundary.officialPaperProvenanceRecovered, true);
    assert.equal("qlId" in first, false); assert.equal("permanentQlId" in first, false); assert.equal(first.lifecycle.discoveryOnly, true); assert.equal(first.lifecycle.permanentQlAllocated, false); assert.equal(first.lifecycle.questionStudioDiscoverable, false); assert.equal(first.lifecycle.questionBankWritable, false); assert.equal(first.lifecycle.testEligible, false); assert.equal(first.lifecycle.mockTestEligible, false); assert.equal(first.lifecycle.publiclyPublishable, false); lifecycleChecks += 7;

    const canonical = solveAny(prototypeId, first.state); assert.equal(key(first.answer), key(canonical), `${prototypeId}/${index}: answer drift`); assert.equal(verifyAny(prototypeId, first.state, first.answer), true, `${prototypeId}/${index}: verifier rejected answer`); solverVerifierChecks += 2;
    assert.ok(String(first.presentation.stem).trim().length >= 35); assert.ok(String(first.explanation.whatAsked).trim().length >= 10); assert.ok(String(first.explanation.keyIdea).trim().length >= 20); assert.ok(Array.isArray(first.explanation.steps) && first.explanation.steps.length >= 2); assert.ok(String(first.explanation.finalAnswer).trim().length > 0); explanationChecks += 4;
    assert.equal(first.options.length, 4); assert.equal(new Set(first.options.map((option: any) => option.text)).size, 4); assert.equal(first.options.filter((option: any) => option.isCorrect).length, 1); assert.equal(first.options[first.correctIndex].text, first.correctAnswer); assert.equal(first.options[first.correctIndex].isCorrect, true); answerPositions[first.correctIndex] += 1; for (const option of first.options) misconceptionIds.get(prototypeId)!.add(String(option.misconceptionId)); optionChecks += 5;
    JSON.stringify(first, (_key, value) => typeof value === "bigint" ? value.toString() : value); JSON.stringify(second, (_key, value) => typeof value === "bigint" ? value.toString() : value); jsonChecks += 2;
    stateSets.get(prototypeId)!.add(stableJson(first.state)); stemFamilies.get(prototypeId)!.add(first.presentation.stemFamilyId); skeletons.get(prototypeId)!.add(skeleton(first.presentation.stem)); if (first.state.context) contexts.get(prototypeId)!.add(String(first.state.context)); const stemKey = normalize(first.presentation.stem); const owners = exactStems.get(stemKey) ?? new Set<BtdDiscoveryPrototypeIdV5>(); owners.add(prototypeId); exactStems.set(stemKey, owners);
    if (prototypeId === "BTD-PROT-008") { assert.equal(first.state.graceDays, 3); const draw = new Date(`${first.state.drawDateIso}T00:00:00.000Z`); const legal = new Date(`${first.state.legalDueDateIso}T00:00:00.000Z`); const nominal = new Date(Date.UTC(draw.getUTCFullYear(), draw.getUTCMonth() + first.state.termMonths, 1)); const last = new Date(Date.UTC(nominal.getUTCFullYear(), nominal.getUTCMonth() + 1, 0)).getUTCDate(); nominal.setUTCDate(Math.min(draw.getUTCDate(), last)); const expectedLegal = new Date(nominal.getTime() + 3 * 86_400_000); assert.equal(expectedLegal.toISOString().slice(0, 10), first.state.legalDueDateIso); assert.ok(new Date(`${first.state.discountDateIso}T00:00:00.000Z`) < legal); dateGraceChecks += 2; }
    questions += 1;
  }
}

for (let index = 0; index < SEEDS_PER_PROTOTYPE; index += 1) {
  const seed = `BTD-001:IDENTITY:${index}`; const pwState = constructBtdDiscoveryState("BTD-PROT-001", seed) as any; const tdState = constructBtdDiscoveryState("BTD-PROT-002", seed) as any; const bdState = constructBtdDiscoveryState("BTD-PROT-003", seed) as any; const bgState = constructBtdDiscoveryState("BTD-PROT-004", seed) as any; const pw = solveBtdDiscovery(pwState); const td = solveBtdDiscovery(tdState); const bd = solveBtdDiscovery(bdState); const bg = solveBtdDiscovery(bgState); assert.equal(eq(add(pw, td), pwState.faceValue), true); assert.equal(eq(sub(bd, td), bg), true); assert.ok(bd.n * td.d > td.n * bd.d); formulaIdentityChecks += 3;
}

const crossPrototypeExactStemCollisions = [...exactStems.entries()].filter(([, owners]) => owners.size > 1);
assert.deepEqual(crossPrototypeExactStemCollisions, [], `Cross-prototype exact stems: ${JSON.stringify(crossPrototypeExactStemCollisions.slice(0, 5).map(([stem, owners]) => [stem, [...owners]]))}`); assert.deepEqual(answerPositions.map((count) => count > 0), [true, true, true, true]);
for (const prototypeId of BTD_001_DISCOVERY_PROTOTYPE_IDS_V5) { assert.equal(stemFamilies.get(prototypeId)!.size, 3, `${prototypeId}: stem-family reach`); assert.ok(stateSets.get(prototypeId)!.size >= 70, `${prototypeId}: state pool too thin (${stateSets.get(prototypeId)!.size})`); assert.ok(misconceptionIds.get(prototypeId)!.size >= 4, `${prototypeId}: misconception vocabulary too thin`); assert.ok(skeletons.get(prototypeId)!.size >= 3, `${prototypeId}: presentation skeletons too thin`); }
for (const prototypeId of ["BTD-PROT-001", "BTD-PROT-002", "BTD-PROT-003", "BTD-PROT-004", "BTD-PROT-005", "BTD-PROT-006", "BTD-PROT-007", "BTD-PROT-009"] as const) assert.ok(contexts.get(prototypeId)!.size >= 4, `${prototypeId}: context pool too thin`);
assert.ok(remediatedPackages <= Math.ceil(questions * 0.1), `Option-safe reselection too frequent: ${remediatedPackages}/${questions}`);

console.log(JSON.stringify({ auditVersion: "BTD-001-CP001-BREADTH-REMEDIATION-AUDIT-v4", chapterId: "BTD-001", checkpointId: "BTD-CP-001", packagingVersion: BTD_001_BREADTH_REMEDIATION_V5, officialPaperProvenanceRecovered: true, officialSourceAuthorityId: BTD_001_SOURCE_AUTHORITY_V2.officialExamEvidence[0]!.authorityId, officialGpscFixtureAnswer: `${gpscAnswer.n}/${gpscAnswer.d}`, prototypeCount: BTD_001_DISCOVERY_PROTOTYPE_IDS_V5.length, seedsPerPrototype: SEEDS_PER_PROTOTYPE, generatedQuestions: questions, deterministicReplayChecks: replayChecks, solverVerifierChecks, optionChecks, explanationChecks, lifecycleChecks, jsonChecks, billDateGraceChecks: dateGraceChecks, formulaIdentityChecks, exactCrossPrototypeStemCollisions: crossPrototypeExactStemCollisions.length, answerPositions, remediatedPackages, remediationRate: remediatedPackages / questions, totalPackagingAttempts, maximumPackagingAttempts, maxAllowedPackagingAttempts: MAX_ALLOWED_PACKAGING_ATTEMPTS, perPrototype: Object.fromEntries(BTD_001_DISCOVERY_PROTOTYPE_IDS_V5.map((prototypeId) => [prototypeId, { uniqueStates: stateSets.get(prototypeId)!.size, stemFamilies: stemFamilies.get(prototypeId)!.size, normalizedSkeletons: skeletons.get(prototypeId)!.size, contexts: contexts.get(prototypeId)!.size, misconceptionIds: misconceptionIds.get(prototypeId)!.size, remediatedPackages: remediatedByPrototype.get(prototypeId), maximumPackagingAttempts: maxAttemptsByPrototype.get(prototypeId) }])), permanentQlAllocationAuthorized: false, questionStudioDiscoverable: false, downstreamDeliveryOpened: false }, null, 2));
console.log("PASS_BTD_001_CP001_BREADTH_REMEDIATION_AUDIT_V4");
