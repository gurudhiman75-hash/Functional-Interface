import { eq } from "./cp003-exam-model";
import {
  INT_CP007_ENGLISH_VERSION,
  INT_CP007_ENGLISH_V6_SUPERSEDES,
  generateIntCp007EnglishQuestion,
} from "./cp007-scheme-equivalence-english-v6";
import { generateIntCp007EnglishQuestion as generateV5 } from "./cp007-scheme-equivalence-english-v5";
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
function stripMath(text: string): string {
  return text.replace(MATH_SEGMENT, "");
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

assert(INT_CP007_ENGLISH_VERSION === "INT-CP-007-EN-v6-latex-exact-review", "V6 version drift");
assert(INT_CP007_ENGLISH_V6_SUPERSEDES === "INT-CP-007-EN-v5-latex-review", "V6 supersession drift");

let questions = 0;
let deterministicChecks = 0;
let preservationChecks = 0;
let answerChecks = 0;
let optionChecks = 0;
let latexChecks = 0;
let exactFactorChecks = 0;
let rawCalculationChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
const stemCoverage = new Map<string, Set<string>>();
const correctIndexCoverage = new Set<number>();

for (const qlId of INT_CP007_QL_IDS) {
  const stems = new Set<string>();
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp007-en-v6-${qlId}-${index}`;
    const source = generateV5(qlId, seed);
    const question = generateIntCp007EnglishQuestion(qlId, seed);
    const replay = generateIntCp007EnglishQuestion(qlId, seed);

    assert(stable(question) === stable(replay), `${qlId}/${seed}: deterministic V6 drift`);
    deterministicChecks += 1;
    assert(stable(preservationProjection(question)) === stable(preservationProjection(source)), `${qlId}/${seed}: V6 changed a non-explanation V5 field`);
    preservationChecks += 1;

    const answer = solveIntCp007(question.mathematicalState);
    assert(verifyIntCp007Answer(question.mathematicalState, answer), `${qlId}/${seed}: solver answer rejected`);
    assert(eq(question.options[question.correctIndex]!.value, answer), `${qlId}/${seed}: correct option drift`);
    assert(question.correctAnswer === question.options[question.correctIndex]!.text, `${qlId}/${seed}: correct-answer text drift`);
    assert(question.explanation.finalAnswer === question.correctAnswer, `${qlId}/${seed}: explanation final-answer drift`);
    answerChecks += 4;

    assert(question.options.length === 4, `${qlId}/${seed}: expected four options`);
    assert(new Set(question.options.map((option) => option.text)).size === 4, `${qlId}/${seed}: duplicate option text`);
    assert(new Set(question.options.map((option) => `${option.value.numerator}/${option.value.denominator}`)).size === 4, `${qlId}/${seed}: duplicate option value`);
    for (let optionIndex = 0; optionIndex < question.options.length; optionIndex += 1) {
      const option = question.options[optionIndex]!;
      if (optionIndex !== question.correctIndex) assert(!verifyIntCp007Answer(question.mathematicalState, option.value), `${qlId}/${seed}: distractor verifies as correct`);
    }
    optionChecks += 7;

    const strings = [question.explanation.keyIdea, ...question.explanation.steps, question.explanation.commonMistake];
    const text = strings.join(" ");
    assert(!text.includes("\\approx"), `${qlId}/${seed}: approximate factor remains in V6`);
    assert(!text.includes("=\\approx"), `${qlId}/${seed}: malformed equals-approx remains`);
    exactFactorChecks += 2;

    let segments = 0;
    for (const value of strings) {
      const matches = [...value.matchAll(MATH_SEGMENT)].map((match) => match[0]);
      assert((value.match(/\$/gu) ?? []).length === matches.length * 2, `${qlId}/${seed}: malformed LaTeX delimiters`);
      for (const segment of matches) {
        assert(!segment.includes("₹"), `${qlId}/${seed}: currency symbol inside LaTeX`);
        segments += 1;
      }
      const plain = stripMath(value);
      assert(!/[=×^]/u.test(plain), `${qlId}/${seed}: raw calculation operator outside LaTeX`);
      assert(!/\br\s*\/\s*100\b/u.test(plain), `${qlId}/${seed}: raw rate fraction outside LaTeX`);
      assert(!/\bP_[AB]\b/u.test(plain), `${qlId}/${seed}: raw principal subscript outside LaTeX`);
      rawCalculationChecks += 3;
    }
    assert(segments >= 4, `${qlId}/${seed}: too few LaTeX segments`);
    assert(text.includes("\\frac") || text.includes("\\times"), `${qlId}/${seed}: structured LaTeX operator missing`);
    latexChecks += segments + 2;

    if (qlId === "INT-QL-114") {
      assert(text.includes("\\le") && text.includes(">"), `${qlId}/${seed}: exact crossing comparison missing`);
      assert(!text.includes("approx"), `${qlId}/${seed}: QL114 still uses approximate display`);
      exactFactorChecks += 2;
    }

    assert(question.permanentIdentityFrozen, `${qlId}/${seed}: permanent identity reopened`);
    assert(!question.learnerContentFrozen, `${qlId}/${seed}: learner content incorrectly frozen`);
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
  assert(stems.size === 3, `${qlId}: all three stem families were not exercised`);
  stemCoverage.set(qlId, stems);
}

assert(questions === 1400, `expected 1400 V6 questions, got ${questions}`);
assert(correctIndexCoverage.size === 4, "all four correct-answer positions were not exercised");
assert(INT_CP007_PERMANENT_ALLOCATION.permanentIdentityFrozen, "permanent identity authority drift");
assert(!INT_CP007_PERMANENT_ALLOCATION.learnerContentFrozen, "V6 review unexpectedly frozen");

console.log(JSON.stringify({
  englishVersion: INT_CP007_ENGLISH_VERSION,
  supersedes: INT_CP007_ENGLISH_V6_SUPERSEDES,
  qls: INT_CP007_QL_IDS.length,
  questions,
  deterministicChecks,
  preservationChecks,
  answerChecks,
  optionChecks,
  latexChecks,
  exactFactorChecks,
  rawCalculationChecks,
  lifecycleChecks,
  deepFreezeChecks,
  stemCoverage: Object.fromEntries([...stemCoverage.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  correctIndexCoverage: [...correctIndexCoverage].sort(),
  permanentIdentityFrozen: true,
  learnerContentFrozen: false,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP007_ENGLISH_V6_LATEX_EXACT_AUDIT");
