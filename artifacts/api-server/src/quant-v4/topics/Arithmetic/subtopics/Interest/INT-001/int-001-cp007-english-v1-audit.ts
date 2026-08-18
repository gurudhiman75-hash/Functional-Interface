import { eq } from "./cp003-exam-model";
import {
  INT_CP007_ENGLISH_VERSION,
  generateIntCp007EnglishQuestion,
} from "./cp007-scheme-equivalence-english-v1";
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
  for (const property of Reflect.ownKeys(objectValue)) assertFrozen((objectValue as Record<PropertyKey, unknown>)[property], `${label}.${String(property)}`, seen);
}

assert(INT_CP007_ENGLISH_VERSION === "INT-CP-007-EN-v1-review", "CP007 English version drift");
assert(INT_CP007_RUNTIME_VERSION === "INT-CP-007-v3-permanent-allocation", "CP007 permanent runtime drift under English surface");

let questions = 0;
let deterministicChecks = 0;
let answerChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
const stemCoverage = new Map<string, Set<string>>();
const representationCoverage = new Map<string, Set<string>>();
const correctIndexCoverage = new Set<number>();

for (const qlId of INT_CP007_QL_IDS) {
  const stems = new Set<string>();
  const representations = new Set<string>();
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp007-en-v1-${qlId}-${index}`;
    const question = generateIntCp007EnglishQuestion(qlId, seed);
    const replay = generateIntCp007EnglishQuestion(qlId, seed);
    assert(stable(question) === stable(replay), `${qlId}/${seed}: deterministic learner-surface drift`);
    deterministicChecks += 1;

    assert(question.id === `${qlId}:${seed}`, `${qlId}/${seed}: question ID drift`);
    assert(question.runtimeVersion === INT_CP007_RUNTIME_VERSION, `${qlId}/${seed}: runtime version drift`);
    assert(question.englishVersion === INT_CP007_ENGLISH_VERSION, `${qlId}/${seed}: English version drift`);
    assert(question.checkpointId === "INT-CP-007" && question.qlId === qlId && question.locale === "en-IN", `${qlId}/${seed}: permanent identity/locale drift`);

    const answer = solveIntCp007(question.mathematicalState);
    assert(verifyIntCp007Answer(question.mathematicalState, answer), `${qlId}/${seed}: permanent verifier rejected answer`);
    assert(eq(question.options[question.correctIndex]!.value, answer), `${qlId}/${seed}: correct option does not match solver`);
    assert(question.correctAnswer === question.options[question.correctIndex]!.text, `${qlId}/${seed}: correct-answer text drift`);
    assert(question.explanation.finalAnswer === question.correctAnswer, `${qlId}/${seed}: explanation final answer drift`);
    answerChecks += 4;

    assert(question.options.length === 4, `${qlId}/${seed}: expected four options`);
    assert(new Set(question.options.map((option) => option.text)).size === 4, `${qlId}/${seed}: duplicate option text`);
    for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
      const option = question.options[optionIndex]!;
      if (optionIndex === question.correctIndex) assert(option.misconceptionId === "CORRECT", `${qlId}/${seed}: correct option misconception drift`);
      else {
        assert(option.misconceptionId !== "CORRECT", `${qlId}/${seed}: distractor marked correct`);
        assert(!verifyIntCp007Answer(question.mathematicalState, option.value), `${qlId}/${seed}: distractor verifies as another correct answer`);
      }
    }
    optionChecks += 7;

    assert(question.presentation.markdown.length >= 90, `${qlId}/${seed}: stem is too thin`);
    assert(question.presentation.prompt === question.presentation.markdown, `${qlId}/${seed}: prompt/markdown drift`);
    assert(question.presentation.stemFamilyId.startsWith(`${qlId}-T`), `${qlId}/${seed}: stem-family identity drift`);
    assert(!/best investment for you|recommended investment|should you invest/iu.test(question.presentation.markdown), `${qlId}/${seed}: recommendation language leaked into learner stem`);

    assert(question.explanation.keyIdea.length >= 100, `${qlId}/${seed}: key idea too short`);
    assert(question.explanation.steps.length >= 5, `${qlId}/${seed}: expected complete five-step explanation`);
    const explanationText = [question.explanation.keyIdea, ...question.explanation.steps, question.explanation.commonMistake].join(" ");
    assert(explanationText.length >= 600, `${qlId}/${seed}: explanation remains too short`);
    assert(question.explanation.steps.filter((step) => /[0-9₹%=×/−]/u.test(step)).length >= 3, `${qlId}/${seed}: explanation lacks calculative steps`);
    assert(question.explanation.steps.some((step) => step.includes(question.correctAnswer)), `${qlId}/${seed}: calculation does not reach final answer`);
    assert(question.explanation.commonMistake.length >= 90, `${qlId}/${seed}: common mistake too thin`);
    explanationChecks += 6;

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
    representations.add(question.presentation.representation);
    correctIndexCoverage.add(question.correctIndex);
    questions += 1;
  }
  assert(stems.size === 3, `${qlId}: all three authored stem families were not exercised`);
  assert(representations.size === 3, `${qlId}: all three review representations were not exercised`);
  stemCoverage.set(qlId, stems);
  representationCoverage.set(qlId, representations);
}

assert(questions === 1400, `expected 1400 English review questions, got ${questions}`);
assert(correctIndexCoverage.size === 4, "all four correct-answer positions were not exercised");
assert(INT_CP007_PERMANENT_ALLOCATION.permanentIdentityFrozen, "permanent allocation authority drift");
assert(!INT_CP007_PERMANENT_ALLOCATION.learnerContentFrozen, "English review unexpectedly frozen");

console.log(JSON.stringify({
  englishVersion: INT_CP007_ENGLISH_VERSION,
  qls: INT_CP007_QL_IDS.length,
  questions,
  deterministicChecks,
  answerChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  deepFreezeChecks,
  stemCoverage: Object.fromEntries([...stemCoverage.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  representationCoverage: Object.fromEntries([...representationCoverage.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  correctIndexCoverage: [...correctIndexCoverage].sort(),
  permanentIdentityFrozen: true,
  learnerContentFrozen: false,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP007_ENGLISH_V1_AUDIT");
