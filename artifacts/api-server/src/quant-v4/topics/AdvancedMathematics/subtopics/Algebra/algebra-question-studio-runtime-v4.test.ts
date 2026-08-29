import {
  ALGEBRA_QUESTION_STUDIO_PATTERNS,
  ALGEBRA_QUESTION_STUDIO_LANGUAGES,
  ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES,
} from "./algebra-question-studio-runtime-v1";
import {
  ALGEBRA_QUESTION_STUDIO_DELIVERY_V4_AUTHORITY,
  ALGEBRA_QUESTION_STUDIO_PACKAGE_V4,
  generateAlgebraStudioBatchV4,
  generateAlgebraStudioQuestionV4,
} from "./algebra-question-studio-runtime-v4";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function hasEnglishProse(text: string) {
  return /\b(?:the|find|value|which|statement|solution|roots?|minimum|maximum|cannot|determined|sufficient|real|numbers?)\b/i.test(text);
}

assert(ALGEBRA_QUESTION_STUDIO_PATTERNS.length === 109, "Expected 109 Algebra Question Studio variants");
assert(new Set(ALGEBRA_QUESTION_STUDIO_PATTERNS.map((pattern) => pattern.qlId)).size === 43, "Expected 43 permanent Algebra QLs");
assert(ALGEBRA_QUESTION_STUDIO_PACKAGE_V4.deliveryAuthority === ALGEBRA_QUESTION_STUDIO_DELIVERY_V4_AUTHORITY, "Package is not pinned to V4 authority");
assert(ALGEBRA_QUESTION_STUDIO_PACKAGE_V4.sourceStateSeedPolicy === "FULL_REQUEST_NAMESPACE_HASH_V1", "V4 source seed policy mismatch");

const answerPositions = new Set<number>();
const difficulties = new Set<string>();
const answerFamilies = new Set<string>();
let sampleCount = 0;
let englishDistinctSourceSeedChecks = 0;
let multilingualCanonicalParityChecks = 0;

for (const pattern of ALGEBRA_QUESTION_STUDIO_PATTERNS) {
  const englishSourceSeeds = new Set<number>();
  const englishCanonicalItems = new Set<string>();

  for (let seedIndex = 0; seedIndex < 12; seedIndex += 1) {
    const seed = `algebra-v4-proof:${pattern.prototypeId}:${seedIndex}`;
    const byLanguage = new Map<string, ReturnType<typeof generateAlgebraStudioQuestionV4>>();

    for (const language of ALGEBRA_QUESTION_STUDIO_LANGUAGES) {
      const question = generateAlgebraStudioQuestionV4({
        pattern,
        language,
        examProfile: "SSC_CORE",
        seed,
      });
      byLanguage.set(language, question);
      sampleCount += 1;

      assert(question.deliveryAuthority === ALGEBRA_QUESTION_STUDIO_DELIVERY_V4_AUTHORITY, `${pattern.prototypeId}/${language}/${seedIndex}: wrong V4 authority`);
      assert(question.validation.valid, `${pattern.prototypeId}/${language}/${seedIndex}: validation failed`);
      assert(question.validation.fourDistinctOptions, `${pattern.prototypeId}/${language}/${seedIndex}: options not distinct`);
      assert(question.validation.exactlyOneCorrect, `${pattern.prototypeId}/${language}/${seedIndex}: correct-option count invalid`);
      assert(question.validation.answerParity, `${pattern.prototypeId}/${language}/${seedIndex}: answer parity failed`);
      assert(question.validation.frozenSourcePreserved, `${pattern.prototypeId}/${language}/${seedIndex}: frozen source lifecycle changed`);
      assert(question.validation.questionBankLocked, `${pattern.prototypeId}/${language}/${seedIndex}: Question Bank gate opened`);
      assert(question.validation.testMockLocked, `${pattern.prototypeId}/${language}/${seedIndex}: test/mock gate opened`);
      assert(question.validation.publicationLocked, `${pattern.prototypeId}/${language}/${seedIndex}: publication gate opened`);
      assert(question.options.length === 4 && new Set(question.options).size === 4, `${pattern.prototypeId}/${language}/${seedIndex}: expected four unique options`);
      assert(question.options[question.correctIndex] === question.answer, `${pattern.prototypeId}/${language}/${seedIndex}: answer/index mismatch`);
      assert(question.explanation.steps.length > 0, `${pattern.prototypeId}/${language}/${seedIndex}: explanation missing`);
      assert(Number.isInteger(question.sourceStateSeed) && question.sourceStateSeed >= 0, `${pattern.prototypeId}/${language}/${seedIndex}: invalid source state seed`);
      JSON.stringify(question);

      if (language !== "en") {
        const optionText = question.options.join(" ");
        assert(!hasEnglishProse(optionText), `${pattern.prototypeId}/${language}/${seedIndex}: English prose leaked into localized options: ${optionText}`);
      }

      answerPositions.add(question.correctIndex);
      difficulties.add(question.difficultyBand);
      const canonical = question.canonicalAnswer as any;
      answerFamilies.add(typeof canonical === "string" ? "STRING_RELATION" : String(canonical?.kind ?? typeof canonical));
    }

    const english = byLanguage.get("en")!;
    englishSourceSeeds.add(english.sourceStateSeed);
    englishCanonicalItems.add(english.canonicalItemId);

    for (const language of ["hi", "pa"] as const) {
      const localized = byLanguage.get(language)!;
      assert(localized.sourceStateSeed === english.sourceStateSeed, `${pattern.prototypeId}/${language}/${seedIndex}: source state seed diverged by locale`);
      assert(JSON.stringify(localized.canonicalAnswer) === JSON.stringify(english.canonicalAnswer), `${pattern.prototypeId}/${language}/${seedIndex}: canonical answer diverged by locale`);
      multilingualCanonicalParityChecks += 1;
    }
  }

  assert(englishSourceSeeds.size === 12, `${pattern.prototypeId}: V4 did not produce 12 distinct source-state seeds; got ${englishSourceSeeds.size}`);
  assert(englishCanonicalItems.size === 12, `${pattern.prototypeId}: canonical item identity repeated across requested seeds`);
  englishDistinctSourceSeedChecks += 1;
}

assert(sampleCount === 109 * 12 * 3, `Expected 3924 V4 proof samples, got ${sampleCount}`);
assert(answerPositions.size === 4, `V4 did not exercise all four answer positions: ${[...answerPositions].join(",")}`);
assert(difficulties.has("Easy") && difficulties.has("Medium") && difficulties.has("Hard"), `V4 did not exercise all difficulty bands: ${[...difficulties].join(",")}`);
assert(answerFamilies.size >= 28, `Expected at least 28 canonical answer families, got ${answerFamilies.size}`);

for (const examProfile of ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES) {
  const batch = generateAlgebraStudioBatchV4({
    language: "en",
    examProfile,
    seed: `algebra-v4-profile-proof:${examProfile}`,
    count: 20,
  });
  assert(batch.questions.length === 20, `${examProfile}: V4 batch count mismatch`);
  assert(batch.reviewOnly && !batch.questionBankWritable && !batch.testEligible && !batch.mockTestEligible && !batch.publiclyPublishable, `${examProfile}: downstream lifecycle gate opened`);
  assert(batch.questions.every((question) => question.validation.valid), `${examProfile}: invalid V4 batch question`);
  JSON.stringify(batch);
}

console.log(
  `Algebra Question Studio V4 proof passed: ${sampleCount} samples, ${englishDistinctSourceSeedChecks} variants with 12/12 distinct source-state seeds, ${multilingualCanonicalParityChecks} multilingual canonical-parity checks, ${answerFamilies.size} answer families, all answer positions and exam profiles; downstream locked`,
);
