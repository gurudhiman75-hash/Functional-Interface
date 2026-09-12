import { eq } from "./cp003-exam-model";
import {
  INT_CP007_ENGLISH_VERSION,
  INT_CP007_ENGLISH_V7_SUPERSEDES,
  generateIntCp007EnglishQuestion,
} from "./cp007-scheme-equivalence-english-v7";
import { generateIntCp007EnglishQuestion as generateV6 } from "./cp007-scheme-equivalence-english-v6";
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

const MATH_SEGMENT = /\$(?:\\.|[^$])*\$/gu;

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
  if (qlId !== "INT-QL-111" && qlId !== "INT-QL-113") projection.explanation = question.explanation;
  return projection;
}

assert(INT_CP007_ENGLISH_VERSION === "INT-CP-007-EN-v7-latex-complete-review", "CP007 English V7 version drift");
assert(INT_CP007_ENGLISH_V7_SUPERSEDES === "INT-CP-007-EN-v6-latex-exact-review", "CP007 English V7 supersession drift");

let questions = 0;
let deterministicChecks = 0;
let preservationChecks = 0;
let answerChecks = 0;
let optionChecks = 0;
let latexDelimiterChecks = 0;
let latexSegmentChecks = 0;
let rawResultGuards = 0;
let rawCalculationGuards = 0;
let targetWrapChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
const stemCoverage = new Map<string, Set<string>>();
const correctIndexCoverage = new Set<number>();

for (const qlId of INT_CP007_QL_IDS) {
  const stems = new Set<string>();
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp007-en-v7-${qlId}-${index}`;
    const source = generateV6(qlId, seed);
    const question = generateIntCp007EnglishQuestion(qlId, seed);
    const replay = generateIntCp007EnglishQuestion(qlId, seed);

    assert(stable(question) === stable(replay), `${qlId}/${seed}: deterministic V7 drift`);
    deterministicChecks += 1;
    assert(stable(preservationProjection(question, qlId)) === stable(preservationProjection(source, qlId)), `${qlId}/${seed}: V7 changed an unauthorized V6 field`);
    preservationChecks += 1;

    const answer = solveIntCp007(question.mathematicalState);
    assert(verifyIntCp007Answer(question.mathematicalState, answer), `${qlId}/${seed}: solver/verifier mismatch`);
    assert(eq(question.options[question.correctIndex]!.value, answer), `${qlId}/${seed}: correct option no longer matches solver`);
    assert(question.correctAnswer === question.options[question.correctIndex]!.text, `${qlId}/${seed}: correct-answer text drift`);
    assert(question.explanation.finalAnswer === question.correctAnswer, `${qlId}/${seed}: explanation final-answer drift`);
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

    for (const step of question.explanation.steps) {
      const dollarCount = (step.match(/\$/gu) ?? []).length;
      assert(dollarCount % 2 === 0, `${qlId}/${seed}: unbalanced inline-math delimiters: ${step}`);
      latexDelimiterChecks += 1;
      const segments = step.match(MATH_SEGMENT) ?? [];
      for (const segment of segments) {
        assert(!segment.includes("₹"), `${qlId}/${seed}: rupee symbol entered learner math: ${segment}`);
        assert(!segment.includes("\\approx"), `${qlId}/${seed}: approximation remains in V7 learner math: ${segment}`);
        latexSegmentChecks += 2;
      }
      const plain = step.replace(MATH_SEGMENT, "");
      assert(!/\b\d+(?:\.\d+)?%/u.test(plain), `${qlId}/${seed}: unwrapped percent result remains: ${step}`);
      assert(!/\b\d+:\d+\b/u.test(plain), `${qlId}/${seed}: unwrapped ratio result remains: ${step}`);
      rawResultGuards += 2;
      assert(!/(?:=|×|≤|≥|<|>)/u.test(plain), `${qlId}/${seed}: raw calculation operator remains outside math: ${step}`);
      assert(!/\b(?:P_A|P_B|r\/100)\b/u.test(plain), `${qlId}/${seed}: raw algebra token remains outside math: ${step}`);
      rawCalculationGuards += 2;
    }

    if (qlId === "INT-QL-111") {
      const expected = `$${question.correctAnswer.slice(0, -1)}\\%$`;
      assert(question.explanation.steps[4]!.includes(expected), `${qlId}/${seed}: final rate is not LaTeX-wrapped`);
      targetWrapChecks += 1;
    }
    if (qlId === "INT-QL-113") {
      const expected = `$P_A:P_B=${question.correctAnswer}$`;
      assert(question.explanation.steps[4]!.includes(expected), `${qlId}/${seed}: final ratio is not LaTeX-wrapped`);
      targetWrapChecks += 1;
    }

    assert(question.permanentIdentityFrozen, `${qlId}/${seed}: permanent identity reopened`);
    assert(!question.learnerContentFrozen, `${qlId}/${seed}: review content incorrectly frozen`);
    assert(!question.enabled, `${qlId}/${seed}: enabled opened`);
    assert(question.stagingStatus === "NOT_STAGED", `${qlId}/${seed}: staging opened`);
    assert(question.registrationStatus === "NOT_REGISTERED", `${qlId}/${seed}: registration opened`);
    assert(!question.questionStudioDiscoverable, `${qlId}/${seed}: Question Studio opened`);
    assert(question.questionBankStatus === "NOT_STORED", `${qlId}/${seed}: Question Bank opened`);
    assert(question.testEligibility === "INELIGIBLE", `${qlId}/${seed}: tests opened`);
    assert(!question.publiclyPublishable, `${qlId}/${seed}: public delivery opened`);
    lifecycleChecks += 9;

    assertFrozen(question, `${qlId}/${seed}`);
    deepFreezeChecks += 1;
    stems.add(question.presentation.stemFamilyId);
    correctIndexCoverage.add(question.correctIndex);
    questions += 1;
  }
  assert(stems.size === 3, `${qlId}: all three stem families were not covered`);
  stemCoverage.set(qlId, stems);
}

assert(questions === 1400, `expected 1400 V7 questions, got ${questions}`);
assert(targetWrapChecks === 400, `expected 400 targeted final-result wrap checks, got ${targetWrapChecks}`);
assert(correctIndexCoverage.size === 4, "all four correct-answer positions were not covered");
assert(INT_CP007_PERMANENT_ALLOCATION.permanentIdentityFrozen, "permanent identity authority drift");
assert(!INT_CP007_PERMANENT_ALLOCATION.learnerContentFrozen, "V7 review unexpectedly frozen");

console.log(JSON.stringify({
  englishVersion: INT_CP007_ENGLISH_VERSION,
  supersedes: INT_CP007_ENGLISH_V7_SUPERSEDES,
  qls: INT_CP007_QL_IDS.length,
  questions,
  deterministicChecks,
  preservationChecks,
  answerChecks,
  optionChecks,
  latexDelimiterChecks,
  latexSegmentChecks,
  rawResultGuards,
  rawCalculationGuards,
  targetWrapChecks,
  lifecycleChecks,
  deepFreezeChecks,
  stemCoverage: Object.fromEntries([...stemCoverage.entries()].map(([key, value]) => [key, [...value].sort()])),
  correctIndexCoverage: [...correctIndexCoverage].sort(),
  permanentIdentityFrozen: true,
  learnerContentFrozen: false,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP007_ENGLISH_V7_LATEX_COMPLETE_AUDIT");
