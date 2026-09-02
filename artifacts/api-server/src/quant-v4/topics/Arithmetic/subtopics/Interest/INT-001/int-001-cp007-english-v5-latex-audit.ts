import { eq } from "./cp003-exam-model";
import {
  INT_CP007_ENGLISH_VERSION,
  INT_CP007_ENGLISH_V5_SUPERSEDES,
  generateIntCp007EnglishQuestion,
} from "./cp007-scheme-equivalence-english-v5";
import { generateIntCp007EnglishQuestion as generateV4 } from "./cp007-scheme-equivalence-english-v4";
import {
  INT_CP007_PERMANENT_ALLOCATION,
  INT_CP007_QL_IDS,
  solveIntCp007,
  verifyIntCp007Answer,
} from "./cp007-scheme-equivalence-runtime-v3-final";

const MATH_SEGMENT = /\$(?:\\.|[^$])*\$/gu;

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

function preservationProjection(question: any): unknown {
  return {
    id: question.id,
    runtimeVersion: question.runtimeVersion,
    checkpointId: question.checkpointId,
    qlId: question.qlId,
    locale: question.locale,
    seed: question.seed,
    mathematicalState: question.mathematicalState,
    answerSemantic: question.answerSemantic,
    presentation: question.presentation,
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
}

function collectMathSegments(text: string): string[] {
  return [...text.matchAll(MATH_SEGMENT)].map((match) => match[0]);
}

function stripMath(text: string): string {
  return text.replace(MATH_SEGMENT, "");
}

function assertNoRawCalculation(text: string, label: string): number {
  const plain = stripMath(text);
  const rawPatterns: readonly RegExp[] = [
    /[=×^]/u,
    /\bP_[AB]\b/u,
    /\br\s*\/\s*100\b/u,
    /\b\d+(?:\.\d+)?\s*\/\s*100\b/u,
    /\b\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?\b/u,
  ];
  for (const pattern of rawPatterns) {
    assert(!pattern.test(plain), `${label}: unwrapped calculation remains outside LaTeX: ${plain}`);
  }
  return rawPatterns.length;
}

assert(INT_CP007_ENGLISH_VERSION === "INT-CP-007-EN-v5-latex-review", "CP007 English V5 version drift");
assert(INT_CP007_ENGLISH_V5_SUPERSEDES === "INT-CP-007-EN-v4-review", "CP007 English V5 supersession drift");

let questions = 0;
let deterministicChecks = 0;
let preservationChecks = 0;
let answerChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let latexSegmentChecks = 0;
let latexDelimiterChecks = 0;
let rawCalculationGuards = 0;
let currencyOutsideMathChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
const stemCoverage = new Map<string, Set<string>>();
const correctIndexCoverage = new Set<number>();

for (const qlId of INT_CP007_QL_IDS) {
  const stems = new Set<string>();
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp007-en-v5-${qlId}-${index}`;
    const source = generateV4(qlId, seed);
    const question = generateIntCp007EnglishQuestion(qlId, seed);
    const replay = generateIntCp007EnglishQuestion(qlId, seed);

    assert(stable(question) === stable(replay), `${qlId}/${seed}: deterministic V5 learner-surface drift`);
    deterministicChecks += 1;
    assert(stable(preservationProjection(question)) === stable(preservationProjection(source)), `${qlId}/${seed}: V5 changed a non-explanation V4 field`);
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

    const explanationStrings = [question.explanation.keyIdea, ...question.explanation.steps, question.explanation.commonMistake];
    const explanationText = explanationStrings.join(" ");
    assert(question.explanation.keyIdea.length >= 100, `${qlId}/${seed}: key idea too short`);
    assert(question.explanation.steps.length >= 5, `${qlId}/${seed}: expected at least five explanation steps`);
    assert(explanationText.length >= 600, `${qlId}/${seed}: explanation too short`);
    assert(question.explanation.steps.some((step) => step.includes(question.correctAnswer)), `${qlId}/${seed}: explanation does not reach final answer`);
    explanationChecks += 4;

    let questionMathSegments = 0;
    for (let stringIndex = 0; stringIndex < explanationStrings.length; stringIndex += 1) {
      const text = explanationStrings[stringIndex]!;
      const segments = collectMathSegments(text);
      questionMathSegments += segments.length;
      assert((text.match(/\$/gu) ?? []).length === segments.length * 2, `${qlId}/${seed}/text-${stringIndex}: malformed or unmatched LaTeX delimiter`);
      latexDelimiterChecks += 1;
      rawCalculationGuards += assertNoRawCalculation(text, `${qlId}/${seed}/text-${stringIndex}`);
      for (const segment of segments) {
        assert(segment.length > 2, `${qlId}/${seed}: empty LaTeX segment`);
        assert(!segment.includes("₹"), `${qlId}/${seed}: currency symbol must remain outside learner math`);
        assert(!/\$\s*\$/u.test(segment), `${qlId}/${seed}: empty LaTeX body`);
        latexSegmentChecks += 1;
        currencyOutsideMathChecks += 1;
      }
    }
    assert(questionMathSegments >= 4, `${qlId}/${seed}: too few LaTeX-wrapped mathematical expressions`);
    assert(question.explanation.steps.filter((step) => collectMathSegments(step).length > 0).length >= 3, `${qlId}/${seed}: too few calculation steps use LaTeX`);
    assert(explanationText.includes("\\frac") || explanationText.includes("\\times"), `${qlId}/${seed}: no structured LaTeX operator found`);
    latexSegmentChecks += 3;

    if (qlId === "INT-QL-111") {
      assert(explanationText.includes("$"), `${qlId}/${seed}: missing rate-equation LaTeX`);
      assert(explanationText.includes("\\frac{r}{100}") || explanationText.includes("\\frac{"), `${qlId}/${seed}: rate fraction is not typeset`);
      assert(!stripMath(explanationText).includes("r/100"), `${qlId}/${seed}: raw r/100 remains outside LaTeX`);
    }
    if (qlId === "INT-QL-113") {
      assert(explanationText.includes("\\frac{P_A}{P_B}"), `${qlId}/${seed}: principal ratio fraction is not typeset`);
      assert(explanationText.includes(`\\frac{${answer.numerator}}{${answer.denominator}}`), `${qlId}/${seed}: exact reduced ratio is not typeset`);
    }
    if (qlId === "INT-QL-114") {
      assert(explanationText.includes("\\le") && explanationText.includes(">"), `${qlId}/${seed}: first-crossing comparison is not typeset`);
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
  assert(stems.size === 3, `${qlId}: all three stem families were not exercised in V5`);
  stemCoverage.set(qlId, stems);
}

assert(questions === 1400, `expected 1400 English V5 review questions, got ${questions}`);
assert(correctIndexCoverage.size === 4, "all four correct-answer positions were not exercised in V5");
assert(INT_CP007_PERMANENT_ALLOCATION.permanentIdentityFrozen, "permanent identity authority drift");
assert(!INT_CP007_PERMANENT_ALLOCATION.learnerContentFrozen, "English V5 review unexpectedly frozen");

console.log(JSON.stringify({
  englishVersion: INT_CP007_ENGLISH_VERSION,
  supersedes: INT_CP007_ENGLISH_V5_SUPERSEDES,
  qls: INT_CP007_QL_IDS.length,
  questions,
  deterministicChecks,
  preservationChecks,
  answerChecks,
  optionChecks,
  explanationChecks,
  latexSegmentChecks,
  latexDelimiterChecks,
  rawCalculationGuards,
  currencyOutsideMathChecks,
  lifecycleChecks,
  deepFreezeChecks,
  stemCoverage: Object.fromEntries([...stemCoverage.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  correctIndexCoverage: [...correctIndexCoverage].sort(),
  permanentIdentityFrozen: true,
  learnerContentFrozen: false,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP007_ENGLISH_V5_LATEX_AUDIT");
