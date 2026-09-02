import assert from "node:assert/strict";
import { verifyIntCp010SequentialReopen } from "./cp010-sequential-mixed-source-reopen-v2";
import {
  INT_001_WAVE03_AUTHORITY_CONTRACTS,
  INT_001_WAVE03_QL_IDS,
} from "./int-001-wave03-permanent-allocation-v1";
import {
  INT_001_WAVE04_ENGLISH_AUTHORITY_VERSION,
  INT_001_WAVE04_ENGLISH_GOVERNANCE,
  INT_001_WAVE04_ENGLISH_RELEASE,
  generateInt001Wave04EnglishCandidate,
} from "./int-001-wave04-english-authority-v1";

const SEEDS_PER_QL = 300;

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}
function textOfExplanation(question: any) {
  return [
    question.explanation.whatAsked,
    question.explanation.keyIdea,
    ...question.explanation.steps,
    question.explanation.shortcut,
    question.explanation.commonTrap,
    question.explanation.finalAnswer,
  ].join("\n");
}
function rationalKey(value: any) {
  return `${String(value?.numerator)}/${String(value?.denominator)}`;
}
function deepFrozen(value: unknown, seen = new WeakSet<object>()): boolean {
  if (typeof value !== "object" || value === null) return true;
  const objectValue = value as object;
  if (seen.has(objectValue)) return true;
  seen.add(objectValue);
  if (!Object.isFrozen(objectValue)) return false;
  return Reflect.ownKeys(objectValue).every((key) => deepFrozen((objectValue as Record<PropertyKey, unknown>)[key], seen));
}

assert.equal(INT_001_WAVE04_ENGLISH_AUTHORITY_VERSION, "INT-001-WAVE04-ENGLISH-AUTHORITY-v1");
assert.equal(INT_001_WAVE04_ENGLISH_RELEASE, "INT-001-WAVE04-EN-v1-review-candidate");
assert.deepEqual(INT_001_WAVE04_ENGLISH_GOVERNANCE.permanentQlIds, INT_001_WAVE03_QL_IDS);
assert.equal(INT_001_WAVE04_ENGLISH_GOVERNANCE.permanentQlCount, 3);
assert.equal(INT_001_WAVE04_ENGLISH_GOVERNANCE.language, "en");
assert.equal(INT_001_WAVE04_ENGLISH_GOVERNANCE.permanentIdentityFrozen, true);
assert.equal(INT_001_WAVE04_ENGLISH_GOVERNANCE.learnerContentFrozen, false);
assert.equal(INT_001_WAVE04_ENGLISH_GOVERNANCE.reviewStatus, "ENGLISH_REVIEW_CANDIDATE");
assert.equal(INT_001_WAVE04_ENGLISH_GOVERNANCE.questionStudioDiscoverable, false);
assert.equal(INT_001_WAVE04_ENGLISH_GOVERNANCE.questionBankWritable, false);
assert.equal(INT_001_WAVE04_ENGLISH_GOVERNANCE.testEligible, false);
assert.equal(INT_001_WAVE04_ENGLISH_GOVERNANCE.mockTestEligible, false);
assert.equal(INT_001_WAVE04_ENGLISH_GOVERNANCE.publiclyPublishable, false);

let questions = 0;
let deterministicChecks = 0;
let solverVerifierChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let editorialChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
const stemFamiliesByQl = new Map<string, Set<string>>();
const stemsByQl = new Map<string, Set<string>>();
const stateFingerprintsByQl = new Map<string, Set<string>>();
const answerPositionsByQl = new Map<string, Set<number>>();
const prototypesByQl = new Map<string, Set<string>>();
const exactStemsAcrossQls = new Map<string, Set<string>>();

for (const qlId of INT_001_WAVE03_QL_IDS) {
  const families = new Set<string>();
  const stems = new Set<string>();
  const states = new Set<string>();
  const positions = new Set<number>();
  const prototypes = new Set<string>();

  for (let index = 0; index < SEEDS_PER_QL; index += 1) {
    const seed = `INT-001-WAVE04-EN:${qlId}:${index}`;
    const first = generateInt001Wave04EnglishCandidate(qlId, seed) as any;
    const second = generateInt001Wave04EnglishCandidate(qlId, seed) as any;
    assert.equal(stable(first), stable(second), `${qlId}/${seed}: English candidate is not deterministic`);
    deterministicChecks += 1;

    assert.equal(first.authorityVersion, INT_001_WAVE04_ENGLISH_AUTHORITY_VERSION);
    assert.equal(first.release, INT_001_WAVE04_ENGLISH_RELEASE);
    assert.equal(first.permanentQlId, qlId);
    assert.equal(first.qlId, qlId);
    assert.equal(first.checkpointId, INT_001_WAVE03_AUTHORITY_CONTRACTS[qlId].checkpointId);
    assert.equal(first.solveContract, INT_001_WAVE03_AUTHORITY_CONTRACTS[qlId].givenUnknown);
    assert.equal(first.answerSemantic, INT_001_WAVE03_AUTHORITY_CONTRACTS[qlId].answerSemantic);
    assert.equal(first.language, "en");
    assert.equal((INT_001_WAVE03_AUTHORITY_CONTRACTS[qlId].sourcePrototypeIds as readonly string[]).includes(first.sourcePrototypeId), true);
    assert.equal(first.mathematicalState.prototypeId, first.sourcePrototypeId);

    assert.equal(verifyIntCp010SequentialReopen(first.mathematicalState, first.answer), true, `${qlId}/${seed}: verifier rejected learner answer`);
    solverVerifierChecks += 1;

    assert.equal(Array.isArray(first.options), true);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option: any) => option.text)).size, 4, `${qlId}/${seed}: duplicate displayed options`);
    assert.equal(new Set(first.options.map((option: any) => rationalKey(option.value))).size, 4, `${qlId}/${seed}: duplicate mathematical options`);
    assert.equal(first.options.filter((option: any) => option.isCorrect).length, 1);
    assert.equal(first.options[first.correctIndex].isCorrect, true);
    assert.equal(first.options.every((option: any) => /^−?₹[0-9]/u.test(option.text)), true, `${qlId}/${seed}: non-money option display`);
    optionChecks += 6;

    const explanation = textOfExplanation(first);
    assert.ok(first.explanation.whatAsked.length >= 20, `${qlId}/${seed}: missing what-asked layer`);
    assert.ok(first.explanation.keyIdea.length >= 45, `${qlId}/${seed}: weak key idea`);
    assert.ok(first.explanation.steps.length >= 4, `${qlId}/${seed}: worked solution too short`);
    assert.ok(first.explanation.steps.every((step: string) => /[0-9]/u.test(step)), `${qlId}/${seed}: worked step lacks numerical substitution`);
    assert.ok(first.explanation.shortcut.length >= 55, `${qlId}/${seed}: shortcut too thin`);
    assert.ok(first.explanation.commonTrap.length >= 55, `${qlId}/${seed}: common-trap note too thin`);
    assert.ok(/^−?₹/u.test(first.explanation.finalAnswer), `${qlId}/${seed}: final answer is not money`);
    explanationChecks += 7;

    assert.ok(first.stem.length >= 70 && first.stem.length <= 620, `${qlId}/${seed}: stem load outside review band`);
    assert.ok(/^[A-Z₹]/u.test(first.stem), `${qlId}/${seed}: stem must begin cleanly`);
    assert.ok(/[?.]$/u.test(first.stem), `${qlId}/${seed}: stem must end with punctuation`);
    assert.ok(!/\b(?:prototype|seed|ql id|solve contract|question studio|wave0[1-9])\b/iu.test(`${first.stem}\n${explanation}`), `${qlId}/${seed}: internal authoring token leaked to learner text`);
    assert.ok(!/\b(?:undefined|null|nan|infinity)\b/iu.test(`${first.stem}\n${explanation}`), `${qlId}/${seed}: invalid token leaked`);
    assert.ok(!/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u.test(`${first.stem}\n${explanation}`), `${qlId}/${seed}: control character leaked`);
    editorialChecks += 6;

    assert.equal(first.lifecycle.permanentIdentityFrozen, true);
    assert.equal(first.lifecycle.learnerContentFrozen, false);
    assert.equal(first.lifecycle.reviewStatus, "ENGLISH_REVIEW_CANDIDATE");
    assert.equal(first.lifecycle.localeReviewStatus, "PENDING_HUMAN_REVIEW");
    assert.equal(first.lifecycle.questionStudioDiscoverable, false);
    assert.equal(first.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(first.lifecycle.questionBankWritable, false);
    assert.equal(first.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(first.lifecycle.testEligible, false);
    assert.equal(first.lifecycle.mockTestEligible, false);
    assert.equal(first.lifecycle.publiclyPublishable, false);
    assert.equal(first.lifecycle.automaticStudentPublication, false);
    lifecycleChecks += 12;

    assert.equal(deepFrozen(first), true, `${qlId}/${seed}: candidate package is not deeply frozen`);
    deepFreezeChecks += 1;

    families.add(first.stemFamilyId);
    stems.add(first.stem);
    states.add(first.mathematicalFingerprint);
    positions.add(first.correctIndex);
    prototypes.add(first.sourcePrototypeId);
    const normalizedStem = first.stem.normalize("NFKC").toLowerCase().replace(/\s+/gu, " ").trim();
    if (!exactStemsAcrossQls.has(normalizedStem)) exactStemsAcrossQls.set(normalizedStem, new Set());
    exactStemsAcrossQls.get(normalizedStem)!.add(qlId);
    questions += 1;
  }

  stemFamiliesByQl.set(qlId, families);
  stemsByQl.set(qlId, stems);
  stateFingerprintsByQl.set(qlId, states);
  answerPositionsByQl.set(qlId, positions);
  prototypesByQl.set(qlId, prototypes);
}

for (const qlId of INT_001_WAVE03_QL_IDS) {
  assert.ok(stemFamiliesByQl.get(qlId)!.size >= 6, `${qlId}: expected all six English stem surfaces`);
  assert.ok(stemsByQl.get(qlId)!.size >= 120, `${qlId}: learner stem diversity is too thin`);
  assert.ok(stateFingerprintsByQl.get(qlId)!.size >= 90, `${qlId}: mathematical state diversity is too thin`);
  assert.deepEqual([...answerPositionsByQl.get(qlId)!].sort(), [0, 1, 2, 3], `${qlId}: all four correct positions must be reachable`);
}
assert.deepEqual([...prototypesByQl.get("INT-QL-132")!].sort(), ["INT-CP010-REOPEN-PROT-001", "INT-CP010-REOPEN-PROT-002"]);
assert.deepEqual([...prototypesByQl.get("INT-QL-133")!], ["INT-CP010-REOPEN-PROT-003"]);
assert.deepEqual([...prototypesByQl.get("INT-QL-134")!], ["INT-CP010-REOPEN-PROT-004"]);

const crossQlStemCollisions = [...exactStemsAcrossQls.values()].filter((owners) => owners.size > 1).length;
assert.equal(crossQlStemCollisions, 0, "Wave04 English candidates contain exact learner-stem collisions across permanent QLs");
assert.equal(questions, INT_001_WAVE03_QL_IDS.length * SEEDS_PER_QL);

console.log(JSON.stringify({
  authorityVersion: INT_001_WAVE04_ENGLISH_AUTHORITY_VERSION,
  release: INT_001_WAVE04_ENGLISH_RELEASE,
  qls: INT_001_WAVE03_QL_IDS,
  seedsPerQl: SEEDS_PER_QL,
  questions,
  deterministicChecks,
  solverVerifierChecks,
  optionChecks,
  explanationChecks,
  editorialChecks,
  lifecycleChecks,
  deepFreezeChecks,
  stemFamiliesByQl: Object.fromEntries([...stemFamiliesByQl].map(([qlId, values]) => [qlId, values.size])),
  distinctStemsByQl: Object.fromEntries([...stemsByQl].map(([qlId, values]) => [qlId, values.size])),
  distinctStatesByQl: Object.fromEntries([...stateFingerprintsByQl].map(([qlId, values]) => [qlId, values.size])),
  correctPositionsByQl: Object.fromEntries([...answerPositionsByQl].map(([qlId, values]) => [qlId, [...values].sort()])),
  sourcePrototypesByQl: Object.fromEntries([...prototypesByQl].map(([qlId, values]) => [qlId, [...values].sort()])),
  crossQlStemCollisions,
  learnerContentFrozen: INT_001_WAVE04_ENGLISH_GOVERNANCE.learnerContentFrozen,
  questionStudioDiscoverable: INT_001_WAVE04_ENGLISH_GOVERNANCE.questionStudioDiscoverable,
}, null, 2));
console.log("PASS_INT_001_WAVE04_ENGLISH_AUTHORITY_V1_AUDIT");
