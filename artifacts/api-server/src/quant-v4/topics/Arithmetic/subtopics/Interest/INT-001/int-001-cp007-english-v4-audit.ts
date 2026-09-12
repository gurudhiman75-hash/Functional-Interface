import { eq } from "./cp003-exam-model";
import {
  INT_CP007_ENGLISH_VERSION,
  INT_CP007_ENGLISH_V4_SUPERSEDES,
  generateIntCp007EnglishQuestion,
} from "./cp007-scheme-equivalence-english-v4";
import { generateIntCp007EnglishQuestion as generateV3 } from "./cp007-scheme-equivalence-english-v3";
import {
  INT_CP007_PERMANENT_ALLOCATION,
  INT_CP007_QL_IDS,
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
  const projection: Record<string, unknown> = {
    id: question.id,
    runtimeVersion: question.runtimeVersion,
    checkpointId: question.checkpointId,
    qlId: question.qlId,
    locale: question.locale,
    seed: question.seed,
    mathematicalState: question.mathematicalState,
    answerSemantic: question.answerSemantic,
    options: question.options,
    correctIndex: question.correctIndex,
    correctAnswer: question.correctAnswer,
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
  if (qlId !== "INT-QL-114") projection.presentation = question.presentation;
  if (qlId !== "INT-QL-111" && qlId !== "INT-QL-113") projection.explanation = question.explanation;
  return projection;
}

assert(INT_CP007_ENGLISH_VERSION === "INT-CP-007-EN-v4-review", "CP007 English V4 version drift");
assert(INT_CP007_ENGLISH_V4_SUPERSEDES === "INT-CP-007-EN-v3-review", "CP007 English V4 supersession drift");

let questions = 0;
let deterministicChecks = 0;
let preservationChecks = 0;
let answerChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
let ql111NaturalAlgebraChecks = 0;
let ql113RatioReductionChecks = 0;
let ql114AnnualStemChecks = 0;
const stemCoverage = new Map<string, Set<string>>();
const correctIndexCoverage = new Set<number>();

for (const qlId of INT_CP007_QL_IDS) {
  const stems = new Set<string>();
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp007-en-v4-${qlId}-${index}`;
    const source = generateV3(qlId, seed);
    const question = generateIntCp007EnglishQuestion(qlId, seed);
    const replay = generateIntCp007EnglishQuestion(qlId, seed);

    assert(stable(question) === stable(replay), `${qlId}/${seed}: deterministic V4 learner-surface drift`);
    deterministicChecks += 1;
    assert(stable(preservationProjection(question, qlId)) === stable(preservationProjection(source, qlId)), `${qlId}/${seed}: V4 changed an unauthorized V3 field`);
    preservationChecks += 1;

    const answer = solveIntCp007(question.mathematicalState);
    assert(verifyIntCp007Answer(question.mathematicalState, answer), `${qlId}/${seed}: permanent verifier rejected answer`);
    assert(eq(question.options[question.correctIndex]!.value, answer), `${qlId}/${seed}: correct option no longer matches solver`);
    assert(question.correctAnswer === question.options[question.correctIndex]!.text, `${qlId}/${seed}: correct-answer text drift`);
    assert(question.explanation.finalAnswer === question.correctAnswer, `${qlId}/${seed}: final-answer explanation drift`);
    answerChecks += 4;

    assert(question.options.length === 4, `${qlId}/${seed}: expected four options`);
    assert(new Set(question.options.map((option) => option.text)).size === 4, `${qlId}/${seed}: duplicate option text`);
    assert(new Set(question.options.map((option) => `${option.value.numerator}/${option.value.denominator}`)).size === 4, `${qlId}/${seed}: duplicate option value`);
    for (let optionIndex = 0; optionIndex < question.options.length; optionIndex += 1) {
      const option = question.options[optionIndex]!;
      if (optionIndex === question.correctIndex) assert(option.misconceptionId === "CORRECT", `${qlId}/${seed}: correct option misconception drift`);
      else assert(!verifyIntCp007Answer(question.mathematicalState, option.value), `${qlId}/${seed}: distractor verifies as correct`);
    }
    optionChecks += 7;

    const explanationText = [question.explanation.keyIdea, ...question.explanation.steps, question.explanation.commonMistake].join(" ");
    assert(question.explanation.keyIdea.length >= 100, `${qlId}/${seed}: key idea too short`);
    assert(question.explanation.steps.length >= 5, `${qlId}/${seed}: expected at least five explanation steps`);
    assert(explanationText.length >= 600, `${qlId}/${seed}: explanation too short`);
    assert(question.explanation.steps.filter((step) => /[0-9₹%=×/−]/u.test(step)).length >= 3, `${qlId}/${seed}: explanation lacks calculation`);
    assert(question.explanation.steps.some((step) => step.includes(question.correctAnswer)), `${qlId}/${seed}: calculation does not reach final answer`);
    explanationChecks += 5;

    if (qlId === "INT-QL-111") {
      assert(!/\b1r\/100\b/u.test(explanationText), `${qlId}/${seed}: awkward one-year 1r/100 notation remains`);
      assert(!/Dividing by 1/u.test(explanationText), `${qlId}/${seed}: unnecessary divide-by-one wording remains`);
      assert(/r\s*=|r\/100/u.test(explanationText), `${qlId}/${seed}: explicit rate isolation missing`);
      ql111NaturalAlgebraChecks += 3;
    }

    if (qlId === "INT-QL-113") {
      const exactFraction = `${answer.numerator}/${answer.denominator}`;
      assert(question.explanation.steps[3]!.includes(exactFraction), `${qlId}/${seed}: exact reduced factor ratio missing`);
      assert(question.explanation.steps[4]!.includes(question.correctAnswer), `${qlId}/${seed}: exact ratio not carried to final A:B form`);
      ql113RatioReductionChecks += 2;
    }

    if (qlId === "INT-QL-114") {
      assert(!/for 1 year/iu.test(question.presentation.markdown), `${qlId}/${seed}: annual scheme incorrectly described as a one-year-only scheme`);
      assert(/first|earliest/iu.test(question.presentation.markdown), `${qlId}/${seed}: first-overtake intent missing from stem`);
      assert(/p\.a\./u.test(question.presentation.markdown), `${qlId}/${seed}: annual-rate description missing`);
      assert(question.presentation.prompt === question.presentation.markdown, `${qlId}/${seed}: QL114 prompt/markdown drift`);
      ql114AnnualStemChecks += 4;
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
  assert(stems.size === 3, `${qlId}: all three stem families were not exercised in V4`);
  stemCoverage.set(qlId, stems);
}

assert(questions === 1400, `expected 1400 English V4 review questions, got ${questions}`);
assert(correctIndexCoverage.size === 4, "all four correct-answer positions were not exercised in V4");
assert(ql111NaturalAlgebraChecks === 600, `expected 600 QL111 natural-algebra checks, got ${ql111NaturalAlgebraChecks}`);
assert(ql113RatioReductionChecks === 400, `expected 400 QL113 ratio-reduction checks, got ${ql113RatioReductionChecks}`);
assert(ql114AnnualStemChecks === 800, `expected 800 QL114 annual-stem checks, got ${ql114AnnualStemChecks}`);
assert(INT_CP007_PERMANENT_ALLOCATION.permanentIdentityFrozen, "permanent identity authority drift");
assert(!INT_CP007_PERMANENT_ALLOCATION.learnerContentFrozen, "English V4 review unexpectedly frozen");

console.log(JSON.stringify({
  englishVersion: INT_CP007_ENGLISH_VERSION,
  supersedes: INT_CP007_ENGLISH_V4_SUPERSEDES,
  qls: INT_CP007_QL_IDS.length,
  questions,
  deterministicChecks,
  preservationChecks,
  answerChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  deepFreezeChecks,
  ql111NaturalAlgebraChecks,
  ql113RatioReductionChecks,
  ql114AnnualStemChecks,
  stemCoverage: Object.fromEntries([...stemCoverage.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  correctIndexCoverage: [...correctIndexCoverage].sort(),
  permanentIdentityFrozen: true,
  learnerContentFrozen: false,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP007_ENGLISH_V4_AUDIT");
