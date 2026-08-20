import {
  INT_CP008_ENGLISH_VERSION,
  generateIntCp008EnglishQuestion,
} from "./cp008-instalment-english-v1";
import {
  INT_CP008_PERMANENT_ALLOCATION,
  INT_CP008_QL_IDS,
  constructIntCp008State,
  solveIntCp008,
  verifyIntCp008Answer,
} from "./cp008-instalment-runtime-v1-final";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function assertDeepFrozen(value: unknown, label: string, seen = new WeakSet<object>()): void {
  if (typeof value !== "object" || value === null) return;
  const objectValue = value as object;
  if (seen.has(objectValue)) return;
  seen.add(objectValue);
  assert(Object.isFrozen(objectValue), `${label}: object is not frozen`);
  for (const property of Reflect.ownKeys(objectValue)) {
    assertDeepFrozen((objectValue as Record<PropertyKey, unknown>)[property], `${label}.${String(property)}`, seen);
  }
}

function mathSegments(text: string): string[] {
  return [...text.matchAll(/\$([^$]+)\$/gu)].map((match) => match[1]!);
}

const SEEDS_PER_QL = 200;
const ids = new Set<string>();
let questions = 0;
let deterministicChecks = 0;
let preservationChecks = 0;
let answerChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let latexChecks = 0;
let editorialChecks = 0;
let deepFreezeChecks = 0;
let lifecycleChecks = 0;
const correctPositions = new Map<string, Set<number>>();
const stemFamilies = new Map<string, Set<string>>();
const representations = new Map<string, Set<string>>();
const contexts = new Map<string, Set<string>>();
const uniquePrompts = new Map<string, Set<string>>();

for (const qlId of INT_CP008_QL_IDS) {
  correctPositions.set(qlId, new Set());
  stemFamilies.set(qlId, new Set());
  representations.set(qlId, new Set());
  contexts.set(qlId, new Set());
  uniquePrompts.set(qlId, new Set());

  for (let index = 0; index < SEEDS_PER_QL; index += 1) {
    const seed = `int-cp008-english-v1:${qlId}:${index}`;
    const question = generateIntCp008EnglishQuestion(qlId, seed);
    const replay = generateIntCp008EnglishQuestion(qlId, seed);
    questions += 1;

    assert(stable(question) === stable(replay), `${qlId}/${seed}: deterministic English replay mismatch`);
    deterministicChecks += 1;

    const canonicalState = constructIntCp008State(qlId, seed);
    assert(stable(question.mathematicalState) === stable(canonicalState), `${qlId}/${seed}: mathematical state changed in English layer`);
    assert(question.mathematicalFingerprint === stable(canonicalState), `${qlId}/${seed}: mathematical fingerprint drift`);
    assert(question.answerSemantic === canonicalState.answerSemantic, `${qlId}/${seed}: answer semantic drift`);
    preservationChecks += 3;

    const canonicalAnswer = solveIntCp008(canonicalState);
    assert(verifyIntCp008Answer(canonicalState, canonicalAnswer), `${qlId}/${seed}: canonical answer rejected`);
    assert(question.correctAnswer === question.options[question.correctIndex]!.text, `${qlId}/${seed}: correct-answer text drift`);
    assert(stable(question.options[question.correctIndex]!.value) === stable(canonicalAnswer), `${qlId}/${seed}: correct option value drift`);
    answerChecks += 3;

    assert(question.options.length === 4, `${qlId}/${seed}: expected four options`);
    assert(new Set(question.options.map((option) => stable(option.value))).size === 4, `${qlId}/${seed}: duplicate option values`);
    assert(new Set(question.options.map((option) => option.text)).size === 4, `${qlId}/${seed}: duplicate option text`);
    for (let optionIndex = 0; optionIndex < question.options.length; optionIndex += 1) {
      const option = question.options[optionIndex]!;
      const accepted = verifyIntCp008Answer(canonicalState, option.value);
      assert(optionIndex === question.correctIndex ? accepted : !accepted, `${qlId}/${seed}: option verifier ownership mismatch at ${optionIndex}`);
      assert(option.misconceptionId.length > 0, `${qlId}/${seed}: missing misconception id`);
      optionChecks += 2;
    }

    const allLearnerText = [
      question.presentation.prompt,
      question.presentation.markdown,
      question.explanation.keyIdea,
      ...question.explanation.steps,
      question.explanation.finalAnswer,
      question.explanation.commonMistake,
      ...question.options.map((option) => option.text),
    ].join("\n");

    assert(question.presentation.prompt.length >= 80, `${qlId}/${seed}: stem is too thin`);
    assert(question.presentation.markdown === question.presentation.prompt, `${qlId}/${seed}: markdown/prompt drift`);
    assert(question.explanation.keyIdea.length >= 70, `${qlId}/${seed}: key idea is too thin`);
    assert(question.explanation.steps.length >= 4, `${qlId}/${seed}: explanation has too few steps`);
    assert(question.explanation.steps.every((step) => step.length >= 35), `${qlId}/${seed}: explanation contains a thin step`);
    assert(question.explanation.commonMistake.length >= 70, `${qlId}/${seed}: common mistake is too thin`);
    assert(question.explanation.finalAnswer === question.correctAnswer, `${qlId}/${seed}: final answer mismatch`);
    explanationChecks += 7;

    const segments = mathSegments(allLearnerText);
    assert(segments.length >= 1, `${qlId}/${seed}: explanation has no MathJax segment`);
    assert(segments.every((segment) => !segment.includes("₹")), `${qlId}/${seed}: rupee symbol leaked inside MathJax`);
    assert(!/₹[^\n$]*\$|\$[^\n$]*₹/u.test(allLearnerText), `${qlId}/${seed}: currency/math boundary is malformed`);
    latexChecks += 3;

    assert(!/\b(?:undefined|null|NaN)\b/u.test(allLearnerText), `${qlId}/${seed}: invalid generated token`);
    assert(!/\b(?:obviously|trivially|simply just)\b/iu.test(allLearnerText), `${qlId}/${seed}: weak editorial phrasing`);
    assert(!/per annum per/iu.test(allLearnerText), `${qlId}/${seed}: duplicated rate unit`);
    assert(question.locale === "en-IN", `${qlId}/${seed}: locale drift`);
    assert(question.englishVersion === INT_CP008_ENGLISH_VERSION, `${qlId}/${seed}: English version drift`);
    assert(question.editorialStatus === "ENGLISH_REVIEW", `${qlId}/${seed}: editorial status drift`);
    assert(question.approvalStatus === "PENDING_PRODUCT_REVIEW", `${qlId}/${seed}: premature approval`);
    editorialChecks += 7;

    assert(question.permanentIdentityFrozen === true, `${qlId}/${seed}: permanent identity unfrozen`);
    assert(question.learnerContentFrozen === false, `${qlId}/${seed}: learner content prematurely frozen`);
    assert(question.enabled === false, `${qlId}/${seed}: runtime enabled`);
    assert(question.stagingStatus === "NOT_STAGED", `${qlId}/${seed}: staging opened`);
    assert(question.registrationStatus === "NOT_REGISTERED", `${qlId}/${seed}: registration opened`);
    assert(question.questionStudioDiscoverable === false, `${qlId}/${seed}: Question Studio opened`);
    assert(question.questionBankStatus === "NOT_STORED", `${qlId}/${seed}: Question Bank storage opened`);
    assert(question.questionBankWritable === false, `${qlId}/${seed}: Question Bank write opened`);
    assert(question.testEligibility === "INELIGIBLE", `${qlId}/${seed}: test eligibility opened`);
    assert(question.publiclyPublishable === false, `${qlId}/${seed}: public delivery opened`);
    lifecycleChecks += 10;

    assertDeepFrozen(question, `${qlId}/${seed}`);
    deepFreezeChecks += 1;

    assert(!ids.has(question.id), `${qlId}/${seed}: duplicate generated question id`);
    ids.add(question.id);
    correctPositions.get(qlId)!.add(question.correctIndex);
    stemFamilies.get(qlId)!.add(question.presentation.stemFamilyId);
    representations.get(qlId)!.add(question.presentation.representation);
    contexts.get(qlId)!.add(question.presentation.contextClass);
    uniquePrompts.get(qlId)!.add(question.presentation.prompt);
  }

  assert(correctPositions.get(qlId)!.size === 4, `${qlId}: all four correct-answer positions not exercised`);
  assert(stemFamilies.get(qlId)!.size === 6, `${qlId}: all six stem families not exercised`);
  assert(representations.get(qlId)!.size === 4, `${qlId}: all four representation families not exercised`);
  assert(contexts.get(qlId)!.size >= 2, `${qlId}: context pool is too thin`);
  assert(uniquePrompts.get(qlId)!.size >= 50, `${qlId}: learner stem surface is too repetitive`);
}

assert(INT_CP008_PERMANENT_ALLOCATION.permanentIdentityFrozen, "CP008 permanent identity authority drift");
assert(!INT_CP008_PERMANENT_ALLOCATION.learnerContentFrozen, "CP008 allocation authority says learner content is already frozen");
assert(questions === 1800, `CP008 expected 1800 English review questions, got ${questions}`);

console.log(JSON.stringify({
  englishVersion: INT_CP008_ENGLISH_VERSION,
  qls: INT_CP008_QL_IDS,
  questions,
  deterministicChecks,
  preservationChecks,
  answerChecks,
  optionChecks,
  explanationChecks,
  latexChecks,
  editorialChecks,
  deepFreezeChecks,
  lifecycleChecks,
  correctPositions: Object.fromEntries([...correctPositions.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  stemFamilyCoverage: Object.fromEntries([...stemFamilies.entries()].map(([qlId, values]) => [qlId, values.size])),
  representationCoverage: Object.fromEntries([...representations.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  contextCoverage: Object.fromEntries([...contexts.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  uniquePromptCounts: Object.fromEntries([...uniquePrompts.entries()].map(([qlId, values]) => [qlId, values.size])),
  permanentIdentityFrozen: true,
  learnerContentFrozen: false,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP008_ENGLISH_V1_AUDIT");
