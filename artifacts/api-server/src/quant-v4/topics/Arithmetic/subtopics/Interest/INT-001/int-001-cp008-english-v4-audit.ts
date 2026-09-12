import type { Rational } from "./cp003-exam-model";
import {
  INT_CP008_ENGLISH_VERSION,
  generateIntCp008EnglishQuestion,
} from "./cp008-instalment-english-v4";
import { generateIntCp008EnglishQuestion as generateV3 } from "./cp008-instalment-english-v3";
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
        assert(!/(^|[^\\])cdots/u.test(buffer), `${label}: unescaped cdots remains in MathJax`);
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
  assert(value.numerator >= 0n && value.denominator > 0n, "money rational must be non-negative");
  const scaled = value.numerator * 100n;
  let paise = scaled / value.denominator;
  const remainder = scaled % value.denominator;
  if (remainder * 2n >= value.denominator) paise += 1n;
  const rupees = paise / 100n;
  const paisePart = paise % 100n;
  return paisePart === 0n ? `₹${indianInteger(rupees)}` : `₹${indianInteger(rupees)}.${paisePart.toString().padStart(2, "0")}`;
}

function answerNeedsPaise(question: ReturnType<typeof generateIntCp008EnglishQuestion>): boolean {
  if (question.answerSemantic === "PERIODIC_RATE_PERCENT") return false;
  const value = question.options[question.correctIndex]!.value;
  return (value.numerator * 100n) % value.denominator !== 0n;
}

function promptMoneyValues(prompt: string): bigint[] {
  return [...prompt.matchAll(/₹([\d,]+)(?:\.\d+)?/gu)].map((match) => BigInt(match[1]!.replace(/,/gu, "")));
}

const SEEDS_PER_QL = 200;
let questions = 0;
let deterministicChecks = 0;
let preservationChecks = 0;
let v3PayloadChecks = 0;
let answerChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let latexChecks = 0;
let moneyChecks = 0;
let editorialChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
let changedQuestions = 0;
let ql122PolishChecks = 0;
let ql124RoundingClarityChecks = 0;
let tinyFinanceRepairs = 0;
let removedUnnecessaryPaiseNotes = 0;
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
    const v3 = generateV3(qlId, seed);
    questions += 1;

    assert(stable(question) === stable(replay), `${qlId}/${seed}: deterministic V4 replay mismatch`);
    deterministicChecks += 1;

    const canonicalState = constructIntCp008State(qlId, seed);
    assert(stable(question.mathematicalState) === stable(canonicalState), `${qlId}/${seed}: mathematical state changed in V4`);
    assert(question.mathematicalFingerprint === stable(canonicalState), `${qlId}/${seed}: mathematical fingerprint drift`);
    assert(question.answerSemantic === canonicalState.answerSemantic, `${qlId}/${seed}: answer semantic drift`);
    preservationChecks += 3;

    assert(stable(question.mathematicalState) === stable(v3.mathematicalState), `${qlId}/${seed}: V4 changed V3 mathematical state`);
    assert(stable(question.options) === stable(v3.options), `${qlId}/${seed}: V4 changed V3 options/value ownership`);
    assert(question.correctIndex === v3.correctIndex, `${qlId}/${seed}: V4 changed correct index`);
    assert(question.correctAnswer === v3.correctAnswer, `${qlId}/${seed}: V4 changed correct answer`);
    assert(question.presentation.stemFamilyId === v3.presentation.stemFamilyId, `${qlId}/${seed}: V4 changed stem-family identity`);
    v3PayloadChecks += 5;

    if (stable(question) !== stable({ ...v3, englishVersion: INT_CP008_ENGLISH_VERSION })) changedQuestions += 1;

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
      if (question.answerSemantic !== "PERIODIC_RATE_PERCENT") {
        assert(option.text === nearestPaiseText(option.value), `${qlId}/${seed}: money option ${optionIndex + 1} not rendered from exact Rational`);
        moneyChecks += 1;
      }
      optionChecks += 1;
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
    assert(mathSegments.length >= 1, `${qlId}/${seed}: no MathJax segment`);
    latexChecks += learnerFields.length + mathSegments.length;

    const allLearnerText = learnerFields.map((field) => field.text).join("\n");
    assert(!/(^|[^\\])cdots/u.test(allLearnerText), `${qlId}/${seed}: plain cdots remains`);
    assert(!/first 1 payments are/iu.test(allLearnerText), `${qlId}/${seed}: singular payment grammar remains`);
    assert(!/there are 1 full interest period/iu.test(allLearnerText), `${qlId}/${seed}: singular period grammar remains`);
    assert(!/₹\d+\/\d+/u.test(allLearnerText), `${qlId}/${seed}: raw rupee fraction remains`);
    assert(!/₹[\d,]+\.\d{3,}/u.test(allLearnerText), `${qlId}/${seed}: money display exceeds paise precision`);
    assert(!/\b(?:undefined|null|NaN)\b/u.test(allLearnerText), `${qlId}/${seed}: invalid generated token`);
    editorialChecks += 6;

    const needsPaise = answerNeedsPaise(question);
    assert(question.presentation.prompt.includes("nearest paise") === needsPaise, `${qlId}/${seed}: nearest-paise instruction does not match correct-answer precision`);
    if (!needsPaise && v3.presentation.prompt.includes("nearest paise")) removedUnnecessaryPaiseNotes += 1;
    moneyChecks += 1;

    const promptValues = promptMoneyValues(question.presentation.prompt);
    if (question.presentation.contextClass === "FINANCED_PURCHASE") {
      assert(!promptValues.some((value) => value < 500n), `${qlId}/${seed}: tiny amount remains in financed-purchase context`);
    } else if (v3.presentation.contextClass === "FINANCED_PURCHASE" && promptValues.some((value) => value < 500n)) {
      tinyFinanceRepairs += 1;
    }
    editorialChecks += 1;

    if (qlId === "INT-QL-122") {
      assert(!allLearnerText.includes("interest has first been applied to the existing balance and the new deposit has then been added"), `${qlId}/${seed}: repetitive V3 ledger prose remains`);
      const rows = question.explanation.steps.filter((step) => step.startsWith("The fund starts at ₹0") || step.startsWith("Before deposit "));
      assert(rows.length === (canonicalState.contractState as any).periods, `${qlId}/${seed}: polished deposit row count drift`);
      ql122PolishChecks += 2;
    }

    if (qlId === "INT-QL-124") {
      assert(question.explanation.steps.some((step) => step.includes("exact instalment values before final paise rounding")), `${qlId}/${seed}: exact-before-rounding clarification missing`);
      ql124RoundingClarityChecks += 1;
    }

    if (qlId !== "INT-QL-124") {
      assert(question.presentation.representation !== "PLAN_COMPARISON", `${qlId}/${seed}: artificial PLAN_COMPARISON representation remains`);
    }

    assert(question.presentation.prompt.length >= 75, `${qlId}/${seed}: stem is too thin`);
    assert(question.presentation.markdown === question.presentation.prompt, `${qlId}/${seed}: markdown/prompt drift`);
    assert(question.explanation.keyIdea.length >= 70, `${qlId}/${seed}: key idea is too thin`);
    assert(question.explanation.steps.length >= 4, `${qlId}/${seed}: explanation has too few steps`);
    assert(question.explanation.steps.every((step) => step.length >= 35), `${qlId}/${seed}: explanation contains a thin step`);
    assert(question.explanation.commonMistake.length >= 70, `${qlId}/${seed}: common mistake is too thin`);
    assert(question.explanation.finalAnswer === question.correctAnswer, `${qlId}/${seed}: final answer mismatch`);
    explanationChecks += 7;

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

  assert(correctPositions.get(qlId)!.size === 4, `${qlId}: all four correct positions not exercised`);
  assert(stemFamilies.get(qlId)!.size === 6, `${qlId}: all six stem families not exercised`);
  assert(representations.get(qlId)!.size >= 3, `${qlId}: representation pool is too thin`);
  assert(contexts.get(qlId)!.size >= 2, `${qlId}: context pool is too thin`);
  assert(uniquePrompts.get(qlId)!.size >= 50, `${qlId}: learner prompt pool is too repetitive`);
}

assert(questions === 1800, `expected 1800 English V4 questions, got ${questions}`);
assert(changedQuestions > 0, "V4 did not change any learner surface");
assert(ql122PolishChecks === 400, `expected 400 QL122 polish checks, got ${ql122PolishChecks}`);
assert(ql124RoundingClarityChecks === 200, `expected 200 QL124 clarity checks, got ${ql124RoundingClarityChecks}`);
assert(tinyFinanceRepairs > 0, "V4 did not exercise tiny-finance context repair");
assert(removedUnnecessaryPaiseNotes > 0, "V4 did not remove unnecessary paise instructions");
assert(INT_CP008_PERMANENT_ALLOCATION.permanentIdentityFrozen, "CP008 permanent identity authority drift");
assert(!INT_CP008_PERMANENT_ALLOCATION.learnerContentFrozen, "CP008 learner content prematurely frozen");

console.log(JSON.stringify({
  englishVersion: INT_CP008_ENGLISH_VERSION,
  questions,
  deterministicChecks,
  preservationChecks,
  v3PayloadChecks,
  answerChecks,
  optionChecks,
  explanationChecks,
  latexChecks,
  moneyChecks,
  editorialChecks,
  lifecycleChecks,
  deepFreezeChecks,
  changedQuestions,
  ql122PolishChecks,
  ql124RoundingClarityChecks,
  tinyFinanceRepairs,
  removedUnnecessaryPaiseNotes,
  correctPositions: Object.fromEntries([...correctPositions.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  stemFamilyCoverage: Object.fromEntries([...stemFamilies.entries()].map(([qlId, values]) => [qlId, values.size])),
  representationCoverage: Object.fromEntries([...representations.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  contextCoverage: Object.fromEntries([...contexts.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  uniquePromptCounts: Object.fromEntries([...uniquePrompts.entries()].map(([qlId, values]) => [qlId, values.size])),
  permanentIdentityFrozen: true,
  learnerContentFrozen: false,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP008_ENGLISH_V4_AUDIT");
