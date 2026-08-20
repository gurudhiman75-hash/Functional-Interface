import type { Rational } from "./cp003-exam-model";
import {
  INT_CP008_ENGLISH_VERSION,
  generateIntCp008EnglishQuestion,
} from "./cp008-instalment-english-v3";
import { generateIntCp008EnglishQuestion as generateV2 } from "./cp008-instalment-english-v2";
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

function parseInlineMath(text: string, label: string): string[] {
  const segments: string[] = [];
  let insideMath = false;
  let buffer = "";
  for (const character of text) {
    if (character === "$") {
      if (insideMath) {
        assert(buffer.trim().length > 0, `${label}: empty MathJax segment`);
        assert(!buffer.includes("₹"), `${label}: rupee symbol leaked inside MathJax`);
        segments.push(buffer);
        buffer = "";
      }
      insideMath = !insideMath;
      continue;
    }
    if (insideMath) buffer += character;
  }
  assert(!insideMath, `${label}: unmatched MathJax delimiter`);
  return segments;
}

function indianInteger(value: bigint): string {
  const source = value.toString();
  if (source.length <= 3) return source;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) {
    groups.unshift(head.slice(-2));
    head = head.slice(0, -2);
  }
  if (head) groups.unshift(head);
  return `${groups.join(",")},${tail}`;
}

function nearestPaiseText(value: Rational): string {
  assert(value.numerator >= 0n && value.denominator > 0n, "CP008 V3 money formatter received invalid rational");
  const scaled = value.numerator * 100n;
  let paise = scaled / value.denominator;
  const remainder = scaled % value.denominator;
  if (remainder * 2n >= value.denominator) paise += 1n;
  const rupees = paise / 100n;
  const paisePart = paise % 100n;
  return paisePart === 0n
    ? `₹${indianInteger(rupees)}`
    : `₹${indianInteger(rupees)}.${paisePart.toString().padStart(2, "0")}`;
}

function learnerText(question: ReturnType<typeof generateV2>): string {
  return [
    question.presentation.prompt,
    question.presentation.markdown,
    question.explanation.keyIdea,
    ...question.explanation.steps,
    question.explanation.finalAnswer,
    question.explanation.commonMistake,
    ...question.options.map((option) => option.text),
  ].join("\n");
}

const SEEDS_PER_QL = 200;
let questions = 0;
let deterministicChecks = 0;
let preservationChecks = 0;
let v2PayloadChecks = 0;
let answerChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let latexChecks = 0;
let moneyDisplayChecks = 0;
let ql122PolishChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
let roundedQuestions = 0;
const correctPositions = new Map<string, Set<number>>();
const stemFamilies = new Map<string, Set<string>>();
const representations = new Map<string, Set<string>>();
const contexts = new Map<string, Set<string>>();
const uniquePrompts = new Map<string, Set<string>>();
const roundedByQl = new Map<string, number>();

for (const qlId of INT_CP008_QL_IDS) {
  correctPositions.set(qlId, new Set());
  stemFamilies.set(qlId, new Set());
  representations.set(qlId, new Set());
  contexts.set(qlId, new Set());
  uniquePrompts.set(qlId, new Set());
  roundedByQl.set(qlId, 0);

  for (let index = 0; index < SEEDS_PER_QL; index += 1) {
    const seed = `int-cp008-english-v1:${qlId}:${index}`;
    const question = generateIntCp008EnglishQuestion(qlId, seed);
    const replay = generateIntCp008EnglishQuestion(qlId, seed);
    const v2 = generateV2(qlId, seed);
    questions += 1;

    assert(stable(question) === stable(replay), `${qlId}/${seed}: deterministic English V3 replay mismatch`);
    deterministicChecks += 1;

    const canonicalState = constructIntCp008State(qlId, seed);
    assert(stable(question.mathematicalState) === stable(canonicalState), `${qlId}/${seed}: mathematical state changed in V3`);
    assert(question.mathematicalFingerprint === stable(canonicalState), `${qlId}/${seed}: mathematical fingerprint drift`);
    assert(question.answerSemantic === canonicalState.answerSemantic, `${qlId}/${seed}: answer semantic drift`);
    preservationChecks += 3;

    assert(stable(question.mathematicalState) === stable(v2.mathematicalState), `${qlId}/${seed}: V3 changed V2 mathematical state`);
    assert(question.correctIndex === v2.correctIndex, `${qlId}/${seed}: V3 changed correct index`);
    assert(question.options.length === v2.options.length, `${qlId}/${seed}: V3 option count drift`);
    for (let optionIndex = 0; optionIndex < question.options.length; optionIndex += 1) {
      assert(stable(question.options[optionIndex]!.value) === stable(v2.options[optionIndex]!.value), `${qlId}/${seed}: V3 changed option ${optionIndex + 1} value`);
      assert(question.options[optionIndex]!.misconceptionId === v2.options[optionIndex]!.misconceptionId, `${qlId}/${seed}: V3 changed option ${optionIndex + 1} misconception`);
      v2PayloadChecks += 2;
    }

    const canonicalAnswer = solveIntCp008(canonicalState);
    assert(verifyIntCp008Answer(canonicalState, canonicalAnswer), `${qlId}/${seed}: canonical answer rejected`);
    assert(question.correctAnswer === question.options[question.correctIndex]!.text, `${qlId}/${seed}: correct-answer text drift`);
    assert(stable(question.options[question.correctIndex]!.value) === stable(canonicalAnswer), `${qlId}/${seed}: correct option value drift`);
    answerChecks += 3;

    assert(question.options.length === 4, `${qlId}/${seed}: expected four options`);
    assert(new Set(question.options.map((option) => stable(option.value))).size === 4, `${qlId}/${seed}: duplicate option values`);
    assert(new Set(question.options.map((option) => option.text)).size === 4, `${qlId}/${seed}: option texts collide after nearest-paise rendering`);
    for (let optionIndex = 0; optionIndex < question.options.length; optionIndex += 1) {
      const option = question.options[optionIndex]!;
      const accepted = verifyIntCp008Answer(canonicalState, option.value);
      assert(optionIndex === question.correctIndex ? accepted : !accepted, `${qlId}/${seed}: option verifier ownership mismatch at ${optionIndex}`);
      if (question.answerSemantic !== "PERIODIC_RATE_PERCENT") {
        assert(option.text === nearestPaiseText(option.value), `${qlId}/${seed}: option ${optionIndex + 1} money rendering is not nearest-paise correct`);
        moneyDisplayChecks += 1;
      }
      optionChecks += 1;
    }

    const sourceHadFraction = /₹\d+\/\d+/u.test(learnerText(v2));
    const currentLearnerText = [
      question.presentation.prompt,
      question.presentation.markdown,
      question.explanation.keyIdea,
      ...question.explanation.steps,
      question.explanation.finalAnswer,
      question.explanation.commonMistake,
      ...question.options.map((option) => option.text),
    ].join("\n");
    assert(!/₹\d+\/\d+/u.test(currentLearnerText), `${qlId}/${seed}: raw rupee fraction remains in V3 learner text`);
    if (sourceHadFraction) {
      assert(question.presentation.prompt.includes("nearest paise"), `${qlId}/${seed}: rounded learner surface lacks explicit nearest-paise instruction`);
      roundedQuestions += 1;
      roundedByQl.set(qlId, roundedByQl.get(qlId)! + 1);
    }
    moneyDisplayChecks += 2;

    assert(question.presentation.prompt.length >= 80, `${qlId}/${seed}: stem is too thin`);
    assert(question.presentation.markdown === question.presentation.prompt, `${qlId}/${seed}: markdown/prompt drift`);
    assert(question.explanation.keyIdea.length >= 70, `${qlId}/${seed}: key idea is too thin`);
    assert(question.explanation.steps.length >= 4, `${qlId}/${seed}: explanation has too few steps`);
    assert(question.explanation.steps.every((step) => step.length >= 35), `${qlId}/${seed}: explanation contains a thin step`);
    assert(question.explanation.commonMistake.length >= 70, `${qlId}/${seed}: common mistake is too thin`);
    assert(question.explanation.finalAnswer === question.correctAnswer, `${qlId}/${seed}: final answer mismatch`);
    explanationChecks += 7;

    if (qlId === "INT-QL-122") {
      const recurringRows = question.explanation.steps.filter((step) => /^After deposit \d+,/u.test(step));
      assert(recurringRows.length === (canonicalState.contractState as any).periods, `${qlId}/${seed}: recurring deposit row count drift`);
      assert(recurringRows.every((step) => step.includes("interest has first been applied") && step.includes("new deposit has then been added")), `${qlId}/${seed}: terse recurring-deposit row remains`);
      ql122PolishChecks += 2;
    }

    const learnerFields: readonly Readonly<{ label: string; text: string }>[] = [
      { label: "prompt", text: question.presentation.prompt },
      { label: "markdown", text: question.presentation.markdown },
      { label: "keyIdea", text: question.explanation.keyIdea },
      ...question.explanation.steps.map((text, stepIndex) => ({ label: `step-${stepIndex + 1}`, text })),
      { label: "finalAnswer", text: question.explanation.finalAnswer },
      { label: "commonMistake", text: question.explanation.commonMistake },
      ...question.options.map((option, optionIndex) => ({ label: `option-${optionIndex + 1}`, text: option.text })),
    ];
    const mathSegments = learnerFields.flatMap((field) => parseInlineMath(field.text, `${qlId}/${seed}/${field.label}`));
    assert(mathSegments.length >= 1, `${qlId}/${seed}: explanation has no MathJax segment`);
    latexChecks += learnerFields.length + mathSegments.length;

    assert(!/\b(?:undefined|null|NaN)\b/u.test(currentLearnerText), `${qlId}/${seed}: invalid generated token`);
    assert(!/\b(?:obviously|trivially|simply just)\b/iu.test(currentLearnerText), `${qlId}/${seed}: weak editorial phrasing`);
    assert(!/per annum per/iu.test(currentLearnerText), `${qlId}/${seed}: duplicated rate unit`);
    assert(question.locale === "en-IN", `${qlId}/${seed}: locale drift`);
    assert(question.englishVersion === INT_CP008_ENGLISH_VERSION, `${qlId}/${seed}: English version drift`);
    assert(question.editorialStatus === "ENGLISH_REVIEW", `${qlId}/${seed}: editorial status drift`);
    assert(question.approvalStatus === "PENDING_PRODUCT_REVIEW", `${qlId}/${seed}: premature approval`);

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
assert(questions === 1800, `CP008 expected 1800 English V3 review questions, got ${questions}`);
assert(roundedQuestions > 0, "CP008 V3 expected at least one nearest-paise remediation question");

console.log(JSON.stringify({
  englishVersion: INT_CP008_ENGLISH_VERSION,
  qls: INT_CP008_QL_IDS,
  questions,
  deterministicChecks,
  preservationChecks,
  v2PayloadChecks,
  answerChecks,
  optionChecks,
  explanationChecks,
  latexChecks,
  moneyDisplayChecks,
  ql122PolishChecks,
  lifecycleChecks,
  deepFreezeChecks,
  roundedQuestions,
  roundedByQl: Object.fromEntries(roundedByQl),
  correctPositions: Object.fromEntries([...correctPositions.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  stemFamilyCoverage: Object.fromEntries([...stemFamilies.entries()].map(([qlId, values]) => [qlId, values.size])),
  representationCoverage: Object.fromEntries([...representations.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  contextCoverage: Object.fromEntries([...contexts.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  uniquePromptCounts: Object.fromEntries([...uniquePrompts.entries()].map(([qlId, values]) => [qlId, values.size])),
  permanentIdentityFrozen: true,
  learnerContentFrozen: false,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP008_ENGLISH_V3_AUDIT");
