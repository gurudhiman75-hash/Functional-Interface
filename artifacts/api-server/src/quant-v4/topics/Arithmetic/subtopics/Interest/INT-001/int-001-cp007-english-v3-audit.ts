import { eq } from "./cp003-exam-model";
import {
  INT_CP007_ENGLISH_VERSION,
  INT_CP007_ENGLISH_V3_SUPERSEDES,
  generateIntCp007EnglishQuestion,
} from "./cp007-scheme-equivalence-english-v3";
import { generateIntCp007EnglishQuestion as generateV2 } from "./cp007-scheme-equivalence-english-v2";
import {
  INT_CP007_PERMANENT_ALLOCATION,
  INT_CP007_QL_IDS,
  INT_CP007_RUNTIME_VERSION,
  solveIntCp007,
  verifyIntCp007Answer,
} from "./cp007-scheme-equivalence-runtime-v3-final";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}
function assertFrozen(value: unknown, label: string, seen = new WeakSet<object>()): void {
  if (typeof value !== "object" || value === null) return;
  const objectValue = value as object;
  if (seen.has(objectValue)) return;
  seen.add(objectValue);
  assert(Object.isFrozen(objectValue), `${label}: deep-freeze boundary missing`);
  for (const property of Reflect.ownKeys(objectValue)) {
    assertFrozen((objectValue as Record<PropertyKey, unknown>)[property], `${label}.${String(property)}`, seen);
  }
}

function preservationProjection(question: any, qlId: string): unknown {
  const base: Record<string, unknown> = {
    id: question.id,
    runtimeVersion: question.runtimeVersion,
    checkpointId: question.checkpointId,
    qlId: question.qlId,
    locale: question.locale,
    seed: question.seed,
    mathematicalState: question.mathematicalState,
    answerSemantic: question.answerSemantic,
    presentation: question.presentation,
    correctIndex: question.correctIndex,
    mathematicalFingerprint: question.mathematicalFingerprint,
    editorialStatus: question.editorialStatus,
    approvalStatus: question.approvalStatus,
    allocationStatus: question.allocationStatus,
    permanentIdentityFrozen: question.permanentIdentityFrozen,
    learnerContentFrozen: question.learnerContentFrozen,
    enabled: question.enabled,
    stagingStatus: question.stagingStatus,
    registrationStatus: question.registrationStatus,
    questionStudioDiscoverable: question.questionStudioDiscoverable,
    questionBankStatus: question.questionBankStatus,
    testEligibility: question.testEligibility,
    publiclyPublishable: question.publiclyPublishable,
  };
  if (qlId !== "INT-QL-115") {
    base.options = question.options;
    base.correctAnswer = question.correctAnswer;
  }
  if (qlId !== "INT-QL-111" && qlId !== "INT-QL-114") base.explanation = question.explanation;
  return base;
}

assert(INT_CP007_ENGLISH_VERSION === "INT-CP-007-EN-v3-review", "CP007 English V3 version drift");
assert(INT_CP007_ENGLISH_V3_SUPERSEDES === "INT-CP-007-EN-v2-review", "CP007 English V3 supersession drift");
assert(INT_CP007_RUNTIME_VERSION === "INT-CP-007-v3-permanent-allocation", "CP007 permanent runtime drift under English V3");

let questions = 0;
let deterministicChecks = 0;
let preservationChecks = 0;
let answerChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
let ql111AlgebraChecks = 0;
let ql114DisplayChecks = 0;
let ql115MoneyOptionChecks = 0;
const stemCoverage = new Map<string, Set<string>>();
const correctIndexCoverage = new Set<number>();

for (const qlId of INT_CP007_QL_IDS) {
  const stems = new Set<string>();
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp007-en-v3-${qlId}-${index}`;
    const source = generateV2(qlId, seed);
    const question = generateIntCp007EnglishQuestion(qlId, seed);
    const replay = generateIntCp007EnglishQuestion(qlId, seed);

    assert(stable(question) === stable(replay), `${qlId}/${seed}: deterministic V3 learner-surface drift`);
    deterministicChecks += 1;

    assert(stable(preservationProjection(question, qlId)) === stable(preservationProjection(source, qlId)), `${qlId}/${seed}: V3 changed an unauthorized V2 field`);
    preservationChecks += 1;

    assert(question.id === `${qlId}:${seed}`, `${qlId}/${seed}: question ID drift`);
    assert(question.englishVersion === INT_CP007_ENGLISH_VERSION, `${qlId}/${seed}: English V3 version drift`);
    assert(question.mathematicalState.qlId === qlId, `${qlId}/${seed}: permanent QL state drift`);
    const answer = solveIntCp007(question.mathematicalState);
    assert(verifyIntCp007Answer(question.mathematicalState, answer), `${qlId}/${seed}: permanent verifier rejected answer`);
    assert(eq(question.options[question.correctIndex]!.value, answer), `${qlId}/${seed}: correct option no longer matches permanent solver`);
    assert(question.correctAnswer === question.options[question.correctIndex]!.text, `${qlId}/${seed}: correct answer text drift`);
    assert(question.explanation.finalAnswer === question.correctAnswer, `${qlId}/${seed}: explanation final answer drift`);
    answerChecks += 4;

    assert(question.options.length === 4, `${qlId}/${seed}: expected four options`);
    assert(new Set(question.options.map((option) => option.text)).size === 4, `${qlId}/${seed}: duplicate option text`);
    assert(new Set(question.options.map((option) => `${option.value.numerator}/${option.value.denominator}`)).size === 4, `${qlId}/${seed}: duplicate option value`);
    for (let optionIndex = 0; optionIndex < question.options.length; optionIndex += 1) {
      const option = question.options[optionIndex]!;
      if (optionIndex === question.correctIndex) assert(option.misconceptionId === "CORRECT", `${qlId}/${seed}: correct option misconception drift`);
      else {
        assert(option.misconceptionId !== "CORRECT", `${qlId}/${seed}: distractor marked correct`);
        assert(!verifyIntCp007Answer(question.mathematicalState, option.value), `${qlId}/${seed}: distractor verifies as another correct answer`);
      }
    }
    optionChecks += 8;

    assert(question.explanation.keyIdea.length >= 100, `${qlId}/${seed}: key idea too short`);
    assert(question.explanation.steps.length >= 5, `${qlId}/${seed}: expected at least five explanation steps`);
    const explanationText = [question.explanation.keyIdea, ...question.explanation.steps, question.explanation.commonMistake].join(" ");
    assert(explanationText.length >= 600, `${qlId}/${seed}: explanation remains too short`);
    assert(question.explanation.steps.filter((step) => /[0-9₹%=×/−]/u.test(step)).length >= 3, `${qlId}/${seed}: explanation lacks calculative steps`);
    assert(question.explanation.steps.some((step) => step.includes(question.correctAnswer)), `${qlId}/${seed}: calculation does not reach final answer`);
    assert(question.explanation.commonMistake.length >= 90, `${qlId}/${seed}: common mistake too thin`);
    explanationChecks += 6;

    if (qlId === "INT-QL-111") {
      assert(/r\s*=|r\/100/u.test(explanationText), `${qlId}/${seed}: explicit rate equation missing`);
      assert(/Subtract 1|bounded exact rate set/u.test(explanationText), `${qlId}/${seed}: rate-isolation arithmetic missing`);
      assert(/Multiply by 100|exactly equal/u.test(explanationText), `${qlId}/${seed}: rate solution is not carried through to the answer`);
      ql111AlgebraChecks += 3;
    }

    if (qlId === "INT-QL-114") {
      assert(!/\b\d+\/\d+\b/u.test(explanationText), `${qlId}/${seed}: raw rational factor leaked into learner explanation`);
      assert(/factor/u.test(explanationText) && /first/u.test(explanationText), `${qlId}/${seed}: first-overtake comparison explanation drift`);
      ql114DisplayChecks += 2;
    }

    if (qlId === "INT-QL-115") {
      for (const option of question.options) {
        assert(/^₹[0-9][0-9,.]*$/u.test(option.text), `${qlId}/${seed}: non-candidate-friendly money option '${option.text}'`);
        assert(!option.text.includes("/"), `${qlId}/${seed}: fraction-form money option leaked`);
      }
      assert(question.correctIndex === source.correctIndex, `${qlId}/${seed}: correct position changed during clean-money remediation`);
      assert(eq(question.options[question.correctIndex]!.value, source.options[source.correctIndex]!.value), `${qlId}/${seed}: correct value changed during clean-money remediation`);
      ql115MoneyOptionChecks += 6;
    }

    assert(question.permanentIdentityFrozen, `${qlId}/${seed}: permanent identity reopened`);
    assert(!question.learnerContentFrozen, `${qlId}/${seed}: review content incorrectly frozen`);
    assert(!question.enabled, `${qlId}/${seed}: enabled opened`);
    assert(question.stagingStatus === "NOT_STAGED", `${qlId}/${seed}: staging opened`);
    assert(question.registrationStatus === "NOT_REGISTERED", `${qlId}/${seed}: registration opened`);
    assert(!question.questionStudioDiscoverable, `${qlId}/${seed}: Question Studio opened`);
    assert(question.questionBankStatus === "NOT_STORED", `${qlId}/${seed}: Question Bank opened`);
    assert(question.testEligibility === "INELIGIBLE", `${qlId}/${seed}: test eligibility opened`);
    assert(!question.publiclyPublishable, `${qlId}/${seed}: public delivery opened`);
    lifecycleChecks += 9;

    assertFrozen(question, `${qlId}/${seed}`);
    deepFreezeChecks += 1;
    stems.add(question.presentation.stemFamilyId);
    correctIndexCoverage.add(question.correctIndex);
    questions += 1;
  }
  assert(stems.size === 3, `${qlId}: all three authored stem families were not exercised in V3`);
  stemCoverage.set(qlId, stems);
}

assert(questions === 1400, `expected 1400 English V3 review questions, got ${questions}`);
assert(correctIndexCoverage.size === 4, "all four correct-answer positions were not exercised in V3");
assert(ql111AlgebraChecks === 600, `expected 600 QL111 algebra checks, got ${ql111AlgebraChecks}`);
assert(ql114DisplayChecks === 400, `expected 400 QL114 display checks, got ${ql114DisplayChecks}`);
assert(ql115MoneyOptionChecks === 1200, `expected 1200 QL115 money-option checks, got ${ql115MoneyOptionChecks}`);
assert(INT_CP007_PERMANENT_ALLOCATION.permanentIdentityFrozen, "permanent allocation authority drift");
assert(!INT_CP007_PERMANENT_ALLOCATION.learnerContentFrozen, "English V3 review unexpectedly frozen");

console.log(JSON.stringify({
  englishVersion: INT_CP007_ENGLISH_VERSION,
  supersedes: INT_CP007_ENGLISH_V3_SUPERSEDES,
  qls: INT_CP007_QL_IDS.length,
  questions,
  deterministicChecks,
  preservationChecks,
  answerChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  deepFreezeChecks,
  ql111AlgebraChecks,
  ql114DisplayChecks,
  ql115MoneyOptionChecks,
  stemCoverage: Object.fromEntries([...stemCoverage.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  correctIndexCoverage: [...correctIndexCoverage].sort(),
  permanentIdentityFrozen: true,
  learnerContentFrozen: false,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP007_ENGLISH_V3_AUDIT");
