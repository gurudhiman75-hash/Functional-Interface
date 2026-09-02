import { eq } from "./cp003-exam-model";
import {
  INT_CP010_PRODUCTION_CANDIDATE_AUTHORITIES,
} from "./cp010-production-authoring-candidate-v1";
import {
  INT_CP010_PRODUCTION_CANDIDATE_V2_VERSION,
  generateIntCp010ProductionCandidateV2,
} from "./cp010-production-authoring-candidate-v2-realism";
import { solveIntCp010Discovery, verifyIntCp010DiscoveryAnswer } from "./cp010-mixed-systems-discovery-v1";
import { INT_CP010_SOURCE_HOLD_PROTOTYPES } from "./cp010-two-authority-proposal-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}
function rupees(value: { numerator: bigint; denominator: bigint }) {
  return Number(value.numerator) / Number(value.denominator);
}

assert(INT_CP010_PRODUCTION_CANDIDATE_V2_VERSION === "INT-CP-010-PRODUCTION-AUTHORING-CANDIDATE-v2-realism", "CP010 production-candidate V2 version drifted");
assert(INT_CP010_PRODUCTION_CANDIDATE_AUTHORITIES.length === 2, "CP010 production candidate must retain exactly two authorities");

let questions = 0;
let deterministicChecks = 0;
let solverVerifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let editorialChecks = 0;
let realismChecks = 0;
let maxSelectionAttempts = 0;
let totalSelectionAttempts = 0;
const answerPositions = [0, 0, 0, 0];
const fingerprints = new Map<string, Set<string>>();
const stemFamilies = new Map<string, Set<string>>();
const contexts = new Map<string, Set<string>>();
const prototypes = new Set<string>();

for (const authorityId of INT_CP010_PRODUCTION_CANDIDATE_AUTHORITIES) {
  fingerprints.set(authorityId, new Set());
  stemFamilies.set(authorityId, new Set());
  contexts.set(authorityId, new Set());
  for (let index = 0; index < 2000; index += 1) {
    const seed = `cp010:prod-candidate:${authorityId}:${index}`;
    const q = generateIntCp010ProductionCandidateV2(authorityId, seed) as any;
    questions += 1;
    fingerprints.get(authorityId)!.add(q.mathematicalFingerprint);
    stemFamilies.get(authorityId)!.add(q.stemFamilyId);
    contexts.get(authorityId)!.add(q.context);
    prototypes.add(q.sourcePrototypeId);
    answerPositions[q.correctIndex] += 1;
    maxSelectionAttempts = Math.max(maxSelectionAttempts, q.realismSelectionAttempts);
    totalSelectionAttempts += q.realismSelectionAttempts;

    if (index % 10 === 0) {
      assert(stable(q) === stable(generateIntCp010ProductionCandidateV2(authorityId, seed)), `${authorityId}/${seed}: nondeterministic V2 replay`);
      deterministicChecks += 1;
    }

    assert(eq(solveIntCp010Discovery(q.mathematicalState), q.answer), `${authorityId}/${seed}: canonical solver drift`);
    assert(verifyIntCp010DiscoveryAnswer(q.mathematicalState, q.answer), `${authorityId}/${seed}: verifier drift`);
    solverVerifierChecks += 2;

    assert(q.options.length === 4 && new Set(q.options.map((option: any) => option.text)).size === 4, `${authorityId}/${seed}: option uniqueness drift`);
    assert(q.options.filter((option: any) => option.isCorrect).length === 1, `${authorityId}/${seed}: correct option ownership drift`);
    assert(q.options[q.correctIndex]?.text === q.correctAnswer, `${authorityId}/${seed}: answer binding drift`);
    optionChecks += 3;

    assert(q.permanentQlId === null && q.permanentIdentityAllocated === false, `${authorityId}/${seed}: permanent identity leaked`);
    assert(q.lifecycle.active === false && q.lifecycle.permanentIdentityAllocated === false, `${authorityId}/${seed}: candidate activated before allocation`);
    assert(q.lifecycle.questionStudioDiscoverable === false && q.lifecycle.questionBankWritable === false && q.lifecycle.testEligible === false && q.lifecycle.publiclyPublishable === false, `${authorityId}/${seed}: downstream lifecycle leaked`);
    lifecycleChecks += 3;

    const expectedPrototype = authorityId === "INT-CP010-AUTH-01" ? "INT-CP010-PROT-003" : "INT-CP010-PROT-004";
    assert(q.sourcePrototypeId === expectedPrototype, `${authorityId}/${seed}: held or wrong prototype entered V2`);
    assert(q.mathematicalState.periodRatesPercent.length === 2 || q.mathematicalState.periodRatesPercent.length === 3, `${authorityId}/${seed}: unsupported period count`);
    assert(new Set(q.mathematicalState.periodRatesPercent.map((rate: any) => stable(rate))).size > 1, `${authorityId}/${seed}: variable-rate state collapsed to constant rate`);

    const learner = `${q.stem}\n${q.explanation.keyIdea}\n${q.explanation.steps.join("\n")}\n${q.explanation.finalAnswer}`;
    assert(q.stem.length >= 120 && q.stem.length <= 620, `${authorityId}/${seed}: stem length out of exam-ready band`);
    assert(q.explanation.keyIdea.length >= 80, `${authorityId}/${seed}: explanation key idea too thin`);
    assert(q.explanation.steps.length >= 4 && q.explanation.steps.some((step: string) => step.startsWith("Given:")), `${authorityId}/${seed}: explanation does not state givens/ask`);
    assert(q.explanation.steps.filter((step: string) => step.includes("=")).length >= q.mathematicalState.periodRatesPercent.length, `${authorityId}/${seed}: recurrence arithmetic incomplete`);
    assert(!/(?:undefined|null|NaN|after after|half-year period)/u.test(learner), `${authorityId}/${seed}: editorial token leaked`);
    editorialChecks += 5;

    const openingDebtValue = q.sourcePrototypeId === "INT-CP010-PROT-003" ? q.mathematicalState.openingDebt : q.answer;
    const openingDebt = rupees(openingDebtValue);
    assert(openingDebt >= q.realismBand.openingDebtMin && openingDebt <= q.realismBand.openingDebtMax, `${authorityId}/${seed}: opening debt escaped V2 realism band (${openingDebt})`);
    if (q.sourcePrototypeId === "INT-CP010-PROT-003") {
      const instalment = rupees(q.answer);
      assert(instalment >= q.realismBand.paymentMin && instalment <= q.realismBand.paymentMax, `${authorityId}/${seed}: instalment escaped V2 realism band (${instalment})`);
    } else {
      const payments = q.mathematicalState.repayments.map(rupees);
      assert(payments.every((amount: number) => amount >= q.realismBand.paymentMin && amount <= q.realismBand.paymentMax), `${authorityId}/${seed}: repayment escaped V2 realism band`);
      assert(new Set(q.mathematicalState.repayments.map((payment: any) => stable(payment))).size > 1, `${authorityId}/${seed}: heterogeneous repayments collapsed to equal payments`);
    }
    assert(q.realismSelectionAttempts >= 1 && q.realismSelectionAttempts <= 32, `${authorityId}/${seed}: excessive realism-selection retries (${q.realismSelectionAttempts})`);
    realismChecks += 4;

    assert(Object.isFrozen(q) && Object.isFrozen(q.lifecycle) && Object.isFrozen(q.mathematicalState) && Object.isFrozen(q.options), `${authorityId}/${seed}: V2 candidate is mutable`);
  }
}

assert(questions === 4000, `Expected 4000 V2 production-candidate questions, got ${questions}`);
assert(prototypes.size === 2 && prototypes.has("INT-CP010-PROT-003") && prototypes.has("INT-CP010-PROT-004"), `V2 prototype coverage drifted: ${[...prototypes].join(",")}`);
assert(answerPositions.every((count) => count >= 400), `Answer-position distribution too imbalanced: ${answerPositions.join("/")}`);
for (const authorityId of INT_CP010_PRODUCTION_CANDIDATE_AUTHORITIES) {
  assert(fingerprints.get(authorityId)!.size >= 1200, `${authorityId}: V2 mathematical state pool too thin (${fingerprints.get(authorityId)!.size})`);
  assert(stemFamilies.get(authorityId)!.size === 8, `${authorityId}: expected 8 stem families, got ${stemFamilies.get(authorityId)!.size}`);
  assert(contexts.get(authorityId)!.size === 8, `${authorityId}: expected 8 contexts, got ${contexts.get(authorityId)!.size}`);
}
assert(maxSelectionAttempts <= 32, `Realism selector exceeded retry ceiling: ${maxSelectionAttempts}`);

console.log(JSON.stringify({
  candidateVersion: INT_CP010_PRODUCTION_CANDIDATE_V2_VERSION,
  authorities: INT_CP010_PRODUCTION_CANDIDATE_AUTHORITIES.length,
  questions,
  deterministicChecks,
  solverVerifierChecks,
  optionChecks,
  lifecycleChecks,
  editorialChecks,
  realismChecks,
  answerPositions,
  uniqueMathematicalStates: Object.fromEntries([...fingerprints].map(([id, values]) => [id, values.size])),
  stemFamilies: Object.fromEntries([...stemFamilies].map(([id, values]) => [id, values.size])),
  contexts: Object.fromEntries([...contexts].map(([id, values]) => [id, values.size])),
  maxSelectionAttempts,
  averageSelectionAttempts: Number((totalSelectionAttempts / questions).toFixed(3)),
  sourcePrototypes: [...prototypes],
  heldPrototypesExcluded: INT_CP010_SOURCE_HOLD_PROTOTYPES.map((item) => item.prototypeId),
  permanentQlCount: 0,
  permanentIdsAllocated: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP010_PRODUCTION_CANDIDATE_V2_REALISM_AUDIT");
