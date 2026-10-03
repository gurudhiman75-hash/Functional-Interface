import assert from "node:assert/strict";

import {
  SRI_PERMANENT_ALLOCATION_V1,
  type SriPermanentQlId,
} from "../permanent-allocation-v1";
import {
  SRI_QUESTION_STUDIO_DIFFICULTIES_V1,
  SRI_QUESTION_STUDIO_LANGUAGES_V1,
  generateSriQuestionStudioBatchV1,
  isSriQuestionStudioRequestV1,
  listSriQuestionStudioPackagesV1,
} from "../question-studio-v1";
import {
  isSriQuestionStudioRequestV1 as isSriSharedRequest,
  listQuestionStudioPackages,
} from "../../../../../../question-studio/shared-generation-engine-sri";

const ACTIVE_NATIVE_SCRIPT = {
  hi: /\p{Script=Devanagari}/u,
  pa: /\p{Script=Gurmukhi}/u,
} as const;
const ACTIVE_FOREIGN_SCRIPT = {
  hi: /\p{Script=Gurmukhi}/u,
  pa: /\p{Script=Devanagari}/u,
} as const;
const ACTIVE_BANNED_ENGLISH = /\b(?:simplify|evaluate|find|determine|which|what|write|reduce|expand|multiply|divide|compare|arrange|classify|choose|extract|given|using|from|when|value|values|expression|expressions|exponent|exponents|base|bases|root|roots|radical|radicals|surd|surds|rational|irrational|conjugate|coefficient|coefficients|equation|statement|statements|result|results|factor|factors|power|powers|positive|negative|real|true|false|defined|undefined|common|same|greater|smaller|larger|equal|exact|exactly|first|second|therefore|hence|thus|since|because|canonical|form|term|terms|law|laws|condition|conditions|solution|solutions|denominator|numerator|reciprocal|integer|normalize|rewrite|convert|substitute|apply|add|subtract|method)\b/giu;
const ACTIVE_INTERNAL_LEAK = /SRI-(?:00[12]-)?(?:QL|SM|RG)-|PROVISIONAL_DISCOVERY|canonicalSolverKey|independentVerifierKey|solverVerifierAgree|proofEvents/iu;
const MACHINE_STEM = /\b(?:to the nearest|do this first|first find|follow these steps|which of the following steps)\b/iu;

const packages = listSriQuestionStudioPackagesV1();
assert.equal(packages.length, 2);
assert.deepEqual(packages.map((pkg) => pkg.packageId), ["SRI-001", "SRI-002"]);
assert.equal(packages[0]?.permanentQlCount, 29);
assert.equal(packages[1]?.permanentQlCount, 29);
assert.equal(packages.flatMap((pkg) => pkg.permanentQlIds).length, 58);
assert.equal(new Set(packages.flatMap((pkg) => pkg.permanentQlIds)).size, 58);

for (const pkg of packages) {
  assert.equal(pkg.enabled, true);
  assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
  assert.equal(pkg.reviewSurfaceRequired, true);
  assert.equal(pkg.manualApprovalRequired, true);
  assert.equal(pkg.runtimeMode, "QUESTION_STUDIO_ACTIVE");
  assert.equal(pkg.questionStudioDiscoverable, true);
  assert.equal(pkg.questionStudioGenerationEnabled, true);
  assert.deepEqual([...pkg.supportedLanguages], [...SRI_QUESTION_STUDIO_LANGUAGES_V1]);
  assert.deepEqual([...pkg.supportedDifficulties], [...SRI_QUESTION_STUDIO_DIFFICULTIES_V1]);
  assert.equal(pkg.questionBankStatus, "NOT_STORED");
  assert.equal(pkg.questionBankWritable, false);
  assert.equal(pkg.testEligibility, "INELIGIBLE");
  assert.equal(pkg.testEligible, false);
  assert.equal(pkg.mockTestEligible, false);
  assert.equal(pkg.publiclyPublishable, false);
  assert.equal(pkg.automaticStudentPublication, false);
}

assert.equal(isSriQuestionStudioRequestV1({ packageId: "SRI-001" }), true);
assert.equal(isSriQuestionStudioRequestV1({ packageId: "SRI-002" }), true);
assert.equal(isSriQuestionStudioRequestV1({ canonicalProblemId: "SRI-CP-011" }), true);
assert.equal(isSriQuestionStudioRequestV1({ questionLanguageId: "SRI-002-QL-029" }), true);
assert.equal(isSriQuestionStudioRequestV1({ subtopic: "Surds & Indices", topic: "Number System" }), true);
assert.equal(isSriQuestionStudioRequestV1({ packageId: "NUM-002", canonicalProblemId: "NUM-CP-014" }), false);
assert.equal(isSriQuestionStudioRequestV1({ packageId: "TRG-002" }), false);
assert.equal(isSriSharedRequest({ packageId: "NUM-002", canonicalProblemId: "NUM-CP-014" }), false);

const sharedPackages = listQuestionStudioPackages();
for (const requiredPackage of ["SRI-001", "SRI-002", "NUM-002"]) {
  assert.equal(sharedPackages.some((pkg: any) => String(pkg.packageId) === requiredPackage), true, `${requiredPackage} missing from cumulative Question Studio capabilities`);
}

let generated = 0;
for (const allocation of SRI_PERMANENT_ALLOCATION_V1) {
  for (const language of SRI_QUESTION_STUDIO_LANGUAGES_V1) {
    const seed = `sri-question-studio-test:${allocation.qlId}:${language}`;
    const result = await generateSriQuestionStudioBatchV1({
      packageId: allocation.packageId,
      canonicalProblemId: allocation.checkpointId,
      questionLanguageId: allocation.qlId,
      language,
      seed,
      count: 1,
    });
    assert.equal(result.questions.length, 1);
    assert.equal(result.questionPackages.length, 1);
    const question = result.questions[0]!;
    assert.equal(question.packageId, allocation.packageId);
    assert.equal(question.canonicalProblemId, allocation.checkpointId);
    assert.equal(question.questionLanguageId, allocation.qlId);
    assert.equal(question.qlId, allocation.qlId);
    assert.equal(question.language, language);
    assert.equal(question.locale, language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN");
    assert.equal(question.runtimeMode, "QUESTION_STUDIO_ACTIVE");
    assert.equal(question.questionStudioDiscoverable, true);
    assert.equal(question.questionStudioGenerationEnabled, true);
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligibility, "INELIGIBLE");
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.options.length, 4);
    assert.ok(question.correctIndex >= 0 && question.correctIndex <= 3);
    assert.equal(question.optionMetadata[question.correctIndex]?.canonicalKey, question.canonicalAnswer.key);
    assert.equal(question.validation.ok, true);
    assert.equal(question.validation.valid, true);
    assert.equal(question.verification.solverVerifierAgree, true);
    assert.equal(question.verification.exactlyOneCorrectOption, true);
    assert.equal(question.verification.domainValid, true);
    assert.ok(question.explanation.length > 0);
    assert.ok(question.packageExplanation.method.length > 0);
    assert.ok(question.packageExplanation.working.length > 0);
    assert.equal(new Set(question.options).size, 4, `${allocation.qlId}/${language}: visible options are not unique`);
    assert.equal(MACHINE_STEM.test(question.stem), false, `${allocation.qlId}/${language}: machine-style learner stem`);
    MACHINE_STEM.lastIndex = 0;

    const activeLearnerText = [
      question.stem,
      ...question.options,
      question.packageExplanation.given,
      question.packageExplanation.asked,
      question.packageExplanation.method,
      ...question.packageExplanation.working,
      question.packageExplanation.answer,
    ].join("\n");
    assert.equal(ACTIVE_INTERNAL_LEAK.test(activeLearnerText), false, `${allocation.qlId}/${language}: internal metadata leaked to active learner surface`);
    ACTIVE_INTERNAL_LEAK.lastIndex = 0;
    if (language === "hi" || language === "pa") {
      assert.equal(ACTIVE_NATIVE_SCRIPT[language].test(question.stem), true, `${allocation.qlId}/${language}: active stem lacks native script`);
      ACTIVE_NATIVE_SCRIPT[language].lastIndex = 0;
      assert.equal(ACTIVE_FOREIGN_SCRIPT[language].test(activeLearnerText), false, `${allocation.qlId}/${language}: foreign Indic script leaked`);
      ACTIVE_FOREIGN_SCRIPT[language].lastIndex = 0;
      const residualEnglish = [...activeLearnerText.matchAll(ACTIVE_BANNED_ENGLISH)].map((match) => match[0]);
      ACTIVE_BANNED_ENGLISH.lastIndex = 0;
      assert.deepEqual(residualEnglish, [], `${allocation.qlId}/${language}: residual English leaked to active learner surface`);
    }
    generated += 1;
  }
}
assert.equal(generated, 174);

let diversityQuestions = 0;
for (const allocation of SRI_PERMANENT_ALLOCATION_V1) {
  const stems = new Set<string>();
  const correctPositions = new Set<number>();
  const sourceCandidates = new Set<string>();
  const answerKeys = new Set<string>();
  for (let seedIndex = 0; seedIndex < 12; seedIndex += 1) {
    const result = await generateSriQuestionStudioBatchV1({
      packageId: allocation.packageId,
      questionLanguageId: allocation.qlId,
      language: "en",
      seed: `sri-active-diversity:${allocation.qlId}:${seedIndex}`,
      count: 1,
    });
    const question = result.questions[0]!;
    stems.add(question.stem.trim().replace(/\s+/gu, " "));
    correctPositions.add(question.correctIndex);
    sourceCandidates.add(String(question.traceability.sourceCandidateId));
    answerKeys.add(String(question.canonicalAnswer.key));
    diversityQuestions += 1;
  }
  assert.ok(stems.size >= 3, `${allocation.qlId}: active runtime collapsed below three stem surfaces across 12 seeds`);
  assert.ok(correctPositions.size >= 3, `${allocation.qlId}: correct-option positions are too concentrated across 12 active seeds`);
  assert.ok(sourceCandidates.size >= 1, `${allocation.qlId}: no active source candidate provenance`);
  assert.ok(answerKeys.size >= 1, `${allocation.qlId}: no canonical answer diversity evidence`);
}

for (const language of SRI_QUESTION_STUDIO_LANGUAGES_V1) {
  const request = {
    questionLanguageId: "SRI-002-QL-029" as SriPermanentQlId,
    language,
    seed: `sri-determinism:${language}`,
    count: 1,
  };
  const first = await generateSriQuestionStudioBatchV1(request);
  const second = await generateSriQuestionStudioBatchV1(request);
  assert.deepEqual(first.questions, second.questions, `SRI deterministic preview drift for ${language}`);
  assert.deepEqual(first.questionPackages, second.questionPackages, `SRI deterministic package drift for ${language}`);
}

for (const difficulty of SRI_QUESTION_STUDIO_DIFFICULTIES_V1) {
  const result = await generateSriQuestionStudioBatchV1({
    difficulty,
    language: "en",
    seed: `sri-difficulty:${difficulty}`,
    count: 12,
  });
  assert.equal(result.questions.length, 12);
  assert.equal(result.questions.every((question) => question.difficulty === difficulty), true, `${difficulty} routing leaked another difficulty`);
}

const cp002Mixed = packages
  .find((pkg) => pkg.packageId === "SRI-001")
  ?.canonicalProblems.find((cp) => cp.id === "SRI-CP-002");
assert.ok(cp002Mixed);
assert.deepEqual(new Set(cp002Mixed.difficulties), new Set(["Easy", "Medium", "Hard"]));

const cp011Mixed = packages
  .find((pkg) => pkg.packageId === "SRI-002")
  ?.canonicalProblems.find((cp) => cp.id === "SRI-CP-011");
assert.ok(cp011Mixed);
assert.deepEqual(new Set(cp011Mixed.difficulties), new Set(["Medium", "Hard"]));

await assert.rejects(
  () => generateSriQuestionStudioBatchV1({ packageId: "SRI-001", questionLanguageId: "SRI-002-QL-001", seed: "ownership-mismatch" }),
  /not owned by SRI-001/,
);
await assert.rejects(
  () => generateSriQuestionStudioBatchV1({ canonicalProblemId: "SRI-CP-013", seed: "invalid-cp" }),
  /not an SRI checkpoint/,
);

console.log(JSON.stringify({
  status: "PASS_SRI_QUESTION_STUDIO_V1",
  permanentQls: SRI_PERMANENT_ALLOCATION_V1.length,
  packages: packages.length,
  languages: SRI_QUESTION_STUDIO_LANGUAGES_V1,
  exhaustiveGeneratedQuestions: generated,
  activeDiversityQuestions: diversityQuestions,
  questionStudioDiscoverable: true,
  questionStudioGenerationEnabled: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
