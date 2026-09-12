import { eq } from "./cp003-exam-model";
import {
  INT_CP010_PRODUCTION_CANDIDATE_AUTHORITIES,
  INT_CP010_PRODUCTION_CANDIDATE_VERSION,
  generateIntCp010ProductionCandidate,
} from "./cp010-production-authoring-candidate-v1";
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

assert(INT_CP010_PRODUCTION_CANDIDATE_VERSION === "INT-CP-010-PRODUCTION-AUTHORING-CANDIDATE-v1", "CP010 production-candidate version drifted");
assert(INT_CP010_PRODUCTION_CANDIDATE_AUTHORITIES.join(",") === "INT-CP010-AUTH-01,INT-CP010-AUTH-02", "CP010 production candidate admitted an unexpected authority");
assert(INT_CP010_SOURCE_HOLD_PROTOTYPES.map((item) => item.prototypeId).join(",") === "INT-CP010-PROT-001,INT-CP010-PROT-002", "CP010 source holds drifted");

let questions = 0;
let deterministicChecks = 0;
let solverVerifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let editorialChecks = 0;
let realismChecks = 0;
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
    const q = generateIntCp010ProductionCandidate(authorityId, seed) as any;
    questions += 1;
    fingerprints.get(authorityId)!.add(q.mathematicalFingerprint);
    stemFamilies.get(authorityId)!.add(q.stemFamilyId);
    contexts.get(authorityId)!.add(q.context);
    prototypes.add(q.sourcePrototypeId);
    answerPositions[q.correctIndex] += 1;

    if (index % 10 === 0) {
      assert(stable(q) === stable(generateIntCp010ProductionCandidate(authorityId, seed)), `${authorityId}/${seed}: nondeterministic replay`);
      deterministicChecks += 1;
    }

    assert(eq(solveIntCp010Discovery(q.mathematicalState), q.answer), `${authorityId}/${seed}: canonical solver drift`);
    assert(verifyIntCp010DiscoveryAnswer(q.mathematicalState, q.answer), `${authorityId}/${seed}: verifier drift`);
    solverVerifierChecks += 2;

    assert(q.options.length === 4, `${authorityId}/${seed}: option count drift`);
    assert(q.options.filter((option: any) => option.isCorrect).length === 1, `${authorityId}/${seed}: correct option ownership drift`);
    assert(q.options[q.correctIndex]?.text === q.correctAnswer, `${authorityId}/${seed}: correct answer binding drift`);
    assert(new Set(q.options.map((option: any) => option.text)).size === 4, `${authorityId}/${seed}: duplicate option text`);
    optionChecks += 4;

    assert(q.permanentQlId === null && q.permanentIdentityAllocated === false, `${authorityId}/${seed}: permanent identity leaked into candidate runtime`);
    assert(q.lifecycle.active === false && q.lifecycle.permanentIdentityAllocated === false, `${authorityId}/${seed}: candidate runtime activated before allocation`);
    assert(q.lifecycle.questionStudioDiscoverable === false && q.lifecycle.questionBankWritable === false && q.lifecycle.testEligible === false && q.lifecycle.publiclyPublishable === false, `${authorityId}/${seed}: downstream lifecycle leaked`);
    lifecycleChecks += 3;

    assert(q.sourcePrototypeId === (authorityId === "INT-CP010-AUTH-01" ? "INT-CP010-PROT-003" : "INT-CP010-PROT-004"), `${authorityId}/${seed}: held prototype entered production candidate`);
    assert(q.mathematicalState.periodRatesPercent.length === 2 || q.mathematicalState.periodRatesPercent.length === 3, `${authorityId}/${seed}: unsupported period count`);
    assert(new Set(q.mathematicalState.periodRatesPercent.map((rate: any) => stable(rate))).size > 1, `${authorityId}/${seed}: variable-rate state collapsed to constant rate`);

    const learner = `${q.stem}\n${q.explanation.keyIdea}\n${q.explanation.steps.join("\n")}\n${q.explanation.finalAnswer}`;
    assert(q.stem.length >= 120 && q.stem.length <= 620, `${authorityId}/${seed}: stem length out of exam-ready band`);
    assert(q.explanation.keyIdea.length >= 80, `${authorityId}/${seed}: explanation key idea too thin`);
    assert(q.explanation.steps.length >= 4 && q.explanation.steps.some((step: string) => step.startsWith("Given:")), `${authorityId}/${seed}: explanation does not state givens/ask`);
    assert(q.explanation.steps.filter((step: string) => step.includes("=")).length >= q.mathematicalState.periodRatesPercent.length, `${authorityId}/${seed}: worked recurrence arithmetic incomplete`);
    assert(!/(?:undefined|null|NaN|successive annual rates \d+%\.)/u.test(learner), `${authorityId}/${seed}: editorial token or singular-successive wording leaked`);
    editorialChecks += 5;

    const openingDebt = q.mathematicalState.openingDebt ? rupees(q.mathematicalState.openingDebt) : rupees(q.answer);
    assert(openingDebt > 10_000 && openingDebt <= 5_000_000, `${authorityId}/${seed}: opening debt outside realism band (${openingDebt})`);
    if (q.sourcePrototypeId === "INT-CP010-PROT-003") {
      assert(rupees(q.answer) >= 2_000 && rupees(q.answer) <= 2_000_000, `${authorityId}/${seed}: instalment outside realism band`);
    } else {
      assert(q.mathematicalState.repayments.every((payment: any) => rupees(payment) >= 2_000 && rupees(payment) <= 2_000_000), `${authorityId}/${seed}: repayment outside realism band`);
      assert(new Set(q.mathematicalState.repayments.map((payment: any) => stable(payment))).size > 1, `${authorityId}/${seed}: heterogeneous repayment schedule collapsed to equal payments`);
    }
    realismChecks += 3;

    assert(Object.isFrozen(q) && Object.isFrozen(q.lifecycle) && Object.isFrozen(q.mathematicalState) && Object.isFrozen(q.options), `${authorityId}/${seed}: production candidate is mutable`);
  }
}

assert(questions === 4000, `Expected 4000 production-candidate questions, got ${questions}`);
assert(prototypes.size === 2 && prototypes.has("INT-CP010-PROT-003") && prototypes.has("INT-CP010-PROT-004"), `Production candidate prototype coverage drifted: ${[...prototypes].join(",")}`);
assert(answerPositions.every((count) => count >= 800), `Answer-position distribution too imbalanced: ${answerPositions.join("/")}`);
for (const authorityId of INT_CP010_PRODUCTION_CANDIDATE_AUTHORITIES) {
  assert(fingerprints.get(authorityId)!.size >= 800, `${authorityId}: mathematical state pool too thin (${fingerprints.get(authorityId)!.size})`);
  assert(stemFamilies.get(authorityId)!.size === 8, `${authorityId}: expected 8 stem families, got ${stemFamilies.get(authorityId)!.size}`);
  assert(contexts.get(authorityId)!.size === 8, `${authorityId}: expected 8 context families, got ${contexts.get(authorityId)!.size}`);
}

console.log(JSON.stringify({
  candidateVersion: INT_CP010_PRODUCTION_CANDIDATE_VERSION,
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
  sourcePrototypes: [...prototypes],
  heldPrototypesExcluded: INT_CP010_SOURCE_HOLD_PROTOTYPES.map((item) => item.prototypeId),
  permanentQlCount: 0,
  permanentIdsAllocated: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP010_PRODUCTION_CANDIDATE_V1_AUDIT");
