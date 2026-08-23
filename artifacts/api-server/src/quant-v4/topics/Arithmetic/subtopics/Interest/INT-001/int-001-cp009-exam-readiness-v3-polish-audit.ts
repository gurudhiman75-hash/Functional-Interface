import {
  INT_CP009_EXAM_READY_POLISH_VERSION,
  INT_CP009_PROTOTYPE_IDS,
  buildIntCp009ExamReadyPolishedPackage,
  solveIntCp009Prototype,
  verifyIntCp009PrototypeAnswer,
} from "./cp009-dated-cash-flow-exam-ready-v3-polish";
import { eq } from "./cp003-exam-model";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}

assert(INT_CP009_EXAM_READY_POLISH_VERSION === "INT-CP-009-DATED-CASH-FLOW-EXAM-READY-v3-polish", "CP009 V3 polish version drifted");

const answerPositions = [0, 0, 0, 0];
const semanticCoverage = new Set<string>();
let questions = 0;
let deterministicChecks = 0;
let solverVerifierChecks = 0;
let editorialChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;

for (const prototypeId of INT_CP009_PROTOTYPE_IDS) {
  for (let index = 0; index < 120; index += 1) {
    const seed = `int-cp009-exam-v3:${prototypeId}:${index}`;
    const q = buildIntCp009ExamReadyPolishedPackage(prototypeId, seed) as any;
    const replay = buildIntCp009ExamReadyPolishedPackage(prototypeId, seed) as any;
    questions += 1;

    assert(stable(q) === stable(replay), `${prototypeId}/${seed}: nondeterministic V3 replay`);
    deterministicChecks += 1;
    assert(eq(solveIntCp009Prototype(q.mathematicalState), q.answer), `${prototypeId}/${seed}: solver drift`);
    assert(verifyIntCp009PrototypeAnswer(q.mathematicalState, q.answer), `${prototypeId}/${seed}: verifier drift`);
    solverVerifierChecks += 2;

    assert(q.options.length === 4, `${prototypeId}/${seed}: option count drift`);
    assert(q.correctIndex === index % 4, `${prototypeId}/${seed}: answer-position drift`);
    assert(q.correctAnswer === q.options[q.correctIndex].text, `${prototypeId}/${seed}: correct-answer ownership drift`);
    answerPositions[q.correctIndex] += 1;

    const learnerText = [q.presentation.prompt, q.explanation.keyIdea, ...q.explanation.steps, q.explanation.finalAnswer, ...q.options.map((option: any) => option.text)].join("\n");
    assert(!learnerText.includes("after after"), `${prototypeId}/${seed}: duplicated after remains`);
    assert(!learnerText.includes("half-year period"), `${prototypeId}/${seed}: mechanical half-year wording remains`);
    assert(!/₹-\d/u.test(learnerText), `${prototypeId}/${seed}: malformed negative-money sign order`);
    assert(!/₹[\d,]+\.00\b/u.test(learnerText), `${prototypeId}/${seed}: whole-rupee .00 remains`);
    assert(!/(?:undefined|null|NaN)/u.test(learnerText), `${prototypeId}/${seed}: invalid learner token`);
    editorialChecks += 5;

    assert(q.explanation.steps.length === 4, `${prototypeId}/${seed}: explanation depth drift`);
    assert(q.explanation.finalAnswer === q.correctAnswer, `${prototypeId}/${seed}: final-answer drift`);
    assert(q.explanation.steps.some((step: string) => step.includes("=")), `${prototypeId}/${seed}: no actual arithmetic in explanation`);
    if (prototypeId === "INT-CP009-PROT-007") {
      const evidence = q.explanation.steps.join(" ");
      for (const rate of ["10%", "15%", "20%", "25%"] as const) assert(evidence.includes(rate), `${prototypeId}/${seed}: missing ${rate} candidate evidence`);
      assert(evidence.includes("₹0"), `${prototypeId}/${seed}: zero-balance evidence missing`);
      assert(!/₹-\d/u.test(evidence), `${prototypeId}/${seed}: negative residual formatting regressed`);
      explanationChecks += 6;
    } else {
      assert((q.explanation.steps.join(" ").match(/₹/gu) ?? []).length >= 3, `${prototypeId}/${seed}: question-specific numeric working too thin`);
      explanationChecks += 1;
    }

    assert(typeof q.answerSemantic === "string" && q.answerSemantic.length > 0, `${prototypeId}/${seed}: answer semantic missing`);
    semanticCoverage.add(q.answerSemantic);

    assert(q.permanentQlId === null, `${prototypeId}/${seed}: permanent QL leaked`);
    assert(q.lifecycle.enabled === false, `${prototypeId}/${seed}: runtime opened`);
    assert(q.lifecycle.questionStudioDiscoverable === false, `${prototypeId}/${seed}: Question Studio opened`);
    assert(q.lifecycle.questionBankWritable === false, `${prototypeId}/${seed}: Question Bank opened`);
    assert(q.lifecycle.testEligibility === "INELIGIBLE", `${prototypeId}/${seed}: test gate opened`);
    assert(q.lifecycle.publiclyPublishable === false, `${prototypeId}/${seed}: public gate opened`);
    lifecycleChecks += 6;
  }
}

assert(questions === 960, `Expected 960 V3 questions, got ${questions}`);
assert(answerPositions.every((count) => count === 240), `Expected 240/240/240/240, got ${answerPositions.join("/")}`);
assert(semanticCoverage.size === 8, `Expected all 8 temporary answer semantics, got ${semanticCoverage.size}`);

console.log(JSON.stringify({
  examReadyVersion: INT_CP009_EXAM_READY_POLISH_VERSION,
  questions,
  deterministicChecks,
  solverVerifierChecks,
  editorialChecks,
  explanationChecks,
  lifecycleChecks,
  answerPositions,
  answerSemanticCoverage: semanticCoverage.size,
  permanentQlCount: 0,
  nextPotentialQlIdentity: "INT-QL-125",
  nextPotentialQlIdentityReserved: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP009_EXAM_READINESS_V3_POLISH_AUDIT");
