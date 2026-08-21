import {
  ALGEBRA_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES,
  ALGEBRA_QUESTION_STUDIO_PATTERNS,
  type AlgebraStudioLanguage,
} from "./algebra-question-studio-runtime-v1";
import {
  ALGEBRA_QUESTION_STUDIO_PACKAGE_V3,
  generateAlgebraStudioBatchV3,
  generateAlgebraStudioQuestionV3,
} from "./algebra-question-studio-runtime-v3";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(ALGEBRA_QUESTION_STUDIO_PACKAGE_V3.qlCount === 43, "Algebra Question Studio must expose exactly 43 frozen QLs");
assert(ALGEBRA_QUESTION_STUDIO_PACKAGE_V3.patternCount === 109, "Algebra Question Studio must expose exactly 109 mapped variants");
assert(ALGEBRA_QUESTION_STUDIO_CANONICAL_PROBLEMS.length === 14, "Algebra Question Studio must expose ALG-CP-001..014");
assert(ALGEBRA_QUESTION_STUDIO_PACKAGE_V3.questionStudioDiscoverable, "Question Studio package must be discoverable");
assert(ALGEBRA_QUESTION_STUDIO_PACKAGE_V3.persistenceAllowed, "Question Studio review persistence must be allowed");
assert(!ALGEBRA_QUESTION_STUDIO_PACKAGE_V3.questionBankWritable, "Question Bank writes must remain locked");
assert(!ALGEBRA_QUESTION_STUDIO_PACKAGE_V3.testEligible, "Test eligibility must remain locked");
assert(!ALGEBRA_QUESTION_STUDIO_PACKAGE_V3.mockTestEligible, "Mock eligibility must remain locked");
assert(!ALGEBRA_QUESTION_STUDIO_PACKAGE_V3.publiclyPublishable, "Publication must remain locked");

const languages: readonly AlgebraStudioLanguage[] = ["en", "hi", "pa"];
const correctPositions = new Set<number>();
const difficultyBands = new Set<string>();
const qls = new Set<string>();
const prototypes = new Set<string>();
const answerKinds = new Set<string>();
let samples = 0;

for (const pattern of ALGEBRA_QUESTION_STUDIO_PATTERNS) {
  qls.add(pattern.qlId);
  prototypes.add(pattern.prototypeId);
  for (const language of languages) {
    for (let seed = 1; seed <= 12; seed += 1) {
      const question = generateAlgebraStudioQuestionV3({
        pattern,
        language,
        examProfile: "SSC_CORE",
        seed: `alg-question-studio-audit:${seed}`,
      });
      const prefix = `${pattern.qlId}/${pattern.prototypeId}/${language}/seed-${seed}`;
      assert(question.validation.valid, `${prefix}: validation failed`);
      assert(question.validation.fourDistinctOptions, `${prefix}: options are not distinct`);
      assert(question.validation.exactlyOneCorrect, `${prefix}: correct-option cardinality failed`);
      assert(question.validation.answerParity, `${prefix}: answer parity failed`);
      assert(question.validation.frozenSourcePreserved, `${prefix}: frozen source lifecycle was not preserved`);
      assert(question.validation.questionBankLocked, `${prefix}: Question Bank gate opened`);
      assert(question.validation.testMockLocked, `${prefix}: test/mock gate opened`);
      assert(question.validation.publicationLocked, `${prefix}: publication gate opened`);
      assert(question.options.length === 4, `${prefix}: expected four options`);
      assert(new Set(question.options).size === 4, `${prefix}: duplicate option text`);
      assert(question.optionDetails.filter((option) => option.isCorrect).length === 1, `${prefix}: expected one correct option`);
      assert(question.options[question.correctIndex] === question.answer, `${prefix}: indexed answer mismatch`);
      assert(question.stem.trim().length > 0, `${prefix}: empty stem`);
      assert(question.explanation.steps.length > 0, `${prefix}: empty explanation`);
      assert(question.questionLanguageId.endsWith(language === "en" ? ":en-IN" : language === "hi" ? ":hi-IN" : ":pa-IN"), `${prefix}: locale identity mismatch`);
      if (language !== "en") {
        for (const option of question.options) {
          assert(!/[A-Za-z]{3,}/.test(option), `${prefix}: localized option leaked English prose: ${option}`);
        }
      }
      JSON.stringify(question);
      const answer = question.canonicalAnswer as any;
      answerKinds.add(typeof answer === "string" ? "STRING_RELATION" : String(answer?.kind ?? "UNKNOWN"));
      correctPositions.add(question.correctIndex);
      difficultyBands.add(question.difficultyBand);
      samples += 1;
    }
  }
}

assert(samples === 3924, `Expected 3,924 Question Studio samples, found ${samples}`);
assert(qls.size === 43, `Expected 43 QLs, found ${qls.size}`);
assert(prototypes.size === 109, `Expected 109 prototype variants, found ${prototypes.size}`);
assert(answerKinds.size === 28, `Expected 28 canonical answer-shape families, found ${answerKinds.size}: ${[...answerKinds].sort().join(", ")}`);
assert(correctPositions.size === 4, `Expected all four answer positions, found ${[...correctPositions].join(",")}`);
assert(difficultyBands.size === 3, `Expected Easy/Medium/Hard coverage, found ${[...difficultyBands].join(",")}`);

for (const profile of ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES) {
  const batch = generateAlgebraStudioBatchV3({
    language: profile === "PUNJAB_STATE" ? "pa" : "en",
    examProfile: profile,
    seed: `alg-profile-${profile}`,
    count: 12,
  });
  assert(batch.questionCount === 12, `${profile}: expected 12 generated review questions`);
  assert(batch.questions.every((question) => question.examProfile === profile), `${profile}: exam-profile identity drifted`);
  assert(batch.questions.every((question) => question.validation.valid), `${profile}: invalid question entered batch`);
  assert(!batch.questionBankWritable && !batch.testEligible && !batch.mockTestEligible && !batch.publiclyPublishable, `${profile}: downstream gate opened`);
  JSON.stringify(batch);
}

console.log(
  `Algebra Question Studio V3 audit passed: ${samples} samples, 43 QLs, 109 variants, 28 answer families, 3 languages, 4 exam profiles; options native/JSON-safe and downstream locked`,
);
