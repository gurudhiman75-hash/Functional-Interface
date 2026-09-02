import type { Rational } from "./cp003-exam-model";
import {
  INT_CP008_ENGLISH_VERSION,
  generateIntCp008EnglishQuestion,
} from "./cp008-instalment-english-v6";
import { generateIntCp008EnglishQuestion as generateV5 } from "./cp008-instalment-english-v5";
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
        assert(!/(^|[^\\])cdots/u.test(buffer), `${label}: unescaped cdots remains`);
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
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${groups.join(",")},${tail}`;
}
function nearestPaiseText(value: Rational): string {
  assert(value.numerator >= 0n && value.denominator > 0n, "invalid monetary Rational");
  const scaled = value.numerator * 100n;
  let paise = scaled / value.denominator;
  const remainder = scaled % value.denominator;
  if (remainder * 2n >= value.denominator) paise += 1n;
  const rupees = paise / 100n;
  const paisePart = paise % 100n;
  return paisePart === 0n ? `₹${indianInteger(rupees)}` : `₹${indianInteger(rupees)}.${paisePart.toString().padStart(2, "0")}`;
}
function promptMoneyValues(prompt: string): bigint[] {
  return [...prompt.matchAll(/₹([\d,]+)(?:\.\d+)?/gu)].map((match) => BigInt(match[1]!.replace(/,/gu, "")));
}

const SEEDS_PER_QL = 200;
let questions = 0;
let deterministicChecks = 0;
let preservationChecks = 0;
let v5PayloadChecks = 0;
let answerChecks = 0;
let optionChecks = 0;
let latexChecks = 0;
let editorialChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
let singularEachRepairs = 0;
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
    const v5 = generateV5(qlId, seed);
    questions += 1;
    assert(stable(question) === stable(replay), `${qlId}/${seed}: deterministic V6 replay mismatch`);
    deterministicChecks += 1;

    const canonicalState = constructIntCp008State(qlId, seed);
    assert(stable(question.mathematicalState) === stable(canonicalState), `${qlId}/${seed}: mathematical state changed in V6`);
    assert(question.mathematicalFingerprint === stable(canonicalState), `${qlId}/${seed}: fingerprint drift`);
    assert(question.answerSemantic === canonicalState.answerSemantic, `${qlId}/${seed}: answer semantic drift`);
    preservationChecks += 3;

    assert(stable(question.mathematicalState) === stable(v5.mathematicalState), `${qlId}/${seed}: V6 changed V5 mathematical state`);
    assert(stable(question.options) === stable(v5.options), `${qlId}/${seed}: V6 changed option payload`);
    assert(question.correctIndex === v5.correctIndex, `${qlId}/${seed}: V6 changed correct index`);
    assert(question.correctAnswer === v5.correctAnswer, `${qlId}/${seed}: V6 changed correct answer`);
    assert(stable(question.explanation) === stable(v5.explanation), `${qlId}/${seed}: V6 changed explanation`);
    assert(question.presentation.contextClass === v5.presentation.contextClass, `${qlId}/${seed}: V6 changed context`);
    assert(question.presentation.representation === v5.presentation.representation, `${qlId}/${seed}: V6 changed representation`);
    assert(question.presentation.stemFamilyId === v5.presentation.stemFamilyId, `${qlId}/${seed}: V6 changed stem family`);
    v5PayloadChecks += 8;

    if (question.presentation.prompt !== v5.presentation.prompt) {
      assert(/\bpayment is ₹[\d,]+(?:\.\d+)? each\b/u.test(v5.presentation.prompt), `${qlId}/${seed}: V6 changed an unrelated stem`);
      singularEachRepairs += 1;
    }

    const canonicalAnswer = solveIntCp008(canonicalState);
    assert(verifyIntCp008Answer(canonicalState, canonicalAnswer), `${qlId}/${seed}: canonical answer rejected`);
    assert(question.correctAnswer === question.options[question.correctIndex]!.text, `${qlId}/${seed}: correct answer text drift`);
    assert(stable(question.options[question.correctIndex]!.value) === stable(canonicalAnswer), `${qlId}/${seed}: correct option value drift`);
    answerChecks += 3;

    assert(question.options.length === 4, `${qlId}/${seed}: expected four options`);
    assert(new Set(question.options.map((option) => stable(option.value))).size === 4, `${qlId}/${seed}: duplicate option values`);
    assert(new Set(question.options.map((option) => option.text)).size === 4, `${qlId}/${seed}: duplicate option text`);
    for (let optionIndex = 0; optionIndex < question.options.length; optionIndex += 1) {
      const option = question.options[optionIndex]!;
      const accepted = verifyIntCp008Answer(canonicalState, option.value);
      assert(optionIndex === question.correctIndex ? accepted : !accepted, `${qlId}/${seed}: verifier ownership mismatch`);
      if (question.answerSemantic !== "PERIODIC_RATE_PERCENT") assert(option.text === nearestPaiseText(option.value), `${qlId}/${seed}: money rendering drift`);
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
    assert(!/\bpayment is ₹[\d,]+(?:\.\d+)? each\b/u.test(question.presentation.prompt), `${qlId}/${seed}: singular each remains`);
    assert(!/\bfirst 1\b/iu.test(question.presentation.prompt), `${qlId}/${seed}: first-1 grammar remains`);
    assert(!/\b1 scheduled instalments\b/iu.test(question.presentation.prompt), `${qlId}/${seed}: singular instalment grammar remains`);
    assert(!/\b(?:1th|2th|3th) payment\b/iu.test(question.presentation.prompt), `${qlId}/${seed}: invalid ordinal remains`);
    assert(!/(^|[^\\])cdots/u.test(allLearnerText), `${qlId}/${seed}: plain cdots remains`);
    assert(!/₹\d+\/\d+/u.test(allLearnerText), `${qlId}/${seed}: raw rupee fraction remains`);
    assert(!/₹[\d,]+\.\d{3,}/u.test(allLearnerText), `${qlId}/${seed}: overprecision money remains`);
    assert(!/\b(?:undefined|null|NaN)\b/u.test(allLearnerText), `${qlId}/${seed}: invalid token`);
    editorialChecks += 8;

    const promptValues = promptMoneyValues(question.presentation.prompt);
    if (promptValues.some((value) => value < 500n)) {
      assert(!/\b(?:financ(?:e|ed|es|ing)?|purchase|customer)\b/iu.test(question.presentation.prompt), `${qlId}/${seed}: tiny-value finance wording remains`);
      editorialChecks += 1;
    }

    assert(question.presentation.prompt.length >= 70, `${qlId}/${seed}: stem too thin`);
    assert(question.presentation.markdown === question.presentation.prompt, `${qlId}/${seed}: markdown/prompt drift`);
    assert(question.explanation.keyIdea.length >= 70, `${qlId}/${seed}: key idea too thin`);
    assert(question.explanation.steps.length >= 4, `${qlId}/${seed}: too few explanation steps`);
    assert(question.explanation.steps.every((step) => step.length >= 35), `${qlId}/${seed}: thin explanation step`);
    assert(question.explanation.commonMistake.length >= 70, `${qlId}/${seed}: common mistake too thin`);
    assert(question.explanation.finalAnswer === question.correctAnswer, `${qlId}/${seed}: final answer mismatch`);

    assert(question.englishVersion === INT_CP008_ENGLISH_VERSION, `${qlId}/${seed}: version drift`);
    assert(question.editorialStatus === "ENGLISH_REVIEW", `${qlId}/${seed}: editorial status drift`);
    assert(question.approvalStatus === "PENDING_PRODUCT_REVIEW", `${qlId}/${seed}: premature approval`);
    assert(question.permanentIdentityFrozen === true, `${qlId}/${seed}: permanent identity unfrozen`);
    assert(question.learnerContentFrozen === false, `${qlId}/${seed}: learner content prematurely frozen`);
    assert(question.enabled === false, `${qlId}/${seed}: runtime enabled`);
    assert(question.stagingStatus === "NOT_STAGED", `${qlId}/${seed}: staging opened`);
    assert(question.registrationStatus === "NOT_REGISTERED", `${qlId}/${seed}: registration opened`);
    assert(question.questionStudioDiscoverable === false, `${qlId}/${seed}: Question Studio opened`);
    assert(question.questionBankStatus === "NOT_STORED", `${qlId}/${seed}: Question Bank opened`);
    assert(question.questionBankWritable === false, `${qlId}/${seed}: Question Bank writable`);
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
  assert(correctPositions.get(qlId)!.size === 4, `${qlId}: correct-position coverage incomplete`);
  assert(stemFamilies.get(qlId)!.size === 6, `${qlId}: stem-family coverage incomplete`);
  assert(representations.get(qlId)!.size >= 3, `${qlId}: representation pool too thin`);
  assert(contexts.get(qlId)!.size >= 2, `${qlId}: context pool too thin`);
  assert(uniquePrompts.get(qlId)!.size >= 50, `${qlId}: prompt pool too repetitive`);
}

assert(questions === 1800, `expected 1800 V6 questions, got ${questions}`);
assert(singularEachRepairs > 0, "V6 did not exercise singular-each repair");
assert(INT_CP008_PERMANENT_ALLOCATION.permanentIdentityFrozen, "permanent identity authority drift");
assert(!INT_CP008_PERMANENT_ALLOCATION.learnerContentFrozen, "learner content prematurely frozen");

console.log(JSON.stringify({
  englishVersion: INT_CP008_ENGLISH_VERSION,
  questions,
  deterministicChecks,
  preservationChecks,
  v5PayloadChecks,
  answerChecks,
  optionChecks,
  latexChecks,
  editorialChecks,
  lifecycleChecks,
  deepFreezeChecks,
  singularEachRepairs,
  correctPositions: Object.fromEntries([...correctPositions.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  stemFamilyCoverage: Object.fromEntries([...stemFamilies.entries()].map(([qlId, values]) => [qlId, values.size])),
  representationCoverage: Object.fromEntries([...representations.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  contextCoverage: Object.fromEntries([...contexts.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  uniquePromptCounts: Object.fromEntries([...uniquePrompts.entries()].map(([qlId, values]) => [qlId, values.size])),
  permanentIdentityFrozen: true,
  learnerContentFrozen: false,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP008_ENGLISH_V6_AUDIT");
