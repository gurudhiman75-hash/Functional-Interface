import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../../generation-engine";
import {
  MAL_001_QUESTION_STUDIO_CP_IDS,
  MAL_001_QUESTION_STUDIO_LANGUAGES,
} from "./question-studio-adapter";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function qlId(number: number): string {
  return `MAL-QL-${String(number).padStart(3, "0")}`;
}

function expectedCp(number: number): string {
  if (number <= 11) return "MAL-CP-001";
  if (number <= 28) return "MAL-CP-002";
  if (number <= 37) return "MAL-CP-003";
  if (number <= 47) return "MAL-CP-004";
  if (number <= 60) return "MAL-CP-005";
  return "MAL-CP-006";
}

function assertQuestionSurface(
  question: any,
  expectedQl: string,
  expectedCanonicalProblem: string,
): void {
  assert(question, `${expectedQl}: Question Studio returned no preview.`);
  assert(question.packageId === "MAL-001", `${expectedQl}: package drift.`);
  assert(
    question.canonicalProblemId === expectedCanonicalProblem,
    `${expectedQl}: expected ${expectedCanonicalProblem}, received ${question.canonicalProblemId}.`,
  );
  assert(question.questionLanguageId === expectedQl, `${expectedQl}: QL identity drift.`);
  assert(Array.isArray(question.options) && question.options.length === 4, `${expectedQl}: expected four options.`);
  assert(new Set(question.options).size === 4, `${expectedQl}: duplicate options.`);
  assert(question.options[question.correctIndex] === question.answer, `${expectedQl}: answer/index mismatch.`);
  assert(String(question.text ?? "").trim().length > 0, `${expectedQl}: empty stem.`);
  assert(String(question.explanation ?? "").trim().length > 0, `${expectedQl}: empty explanation.`);
  assert(["Easy", "Medium", "Hard"].includes(question.difficulty), `${expectedQl}: invalid difficulty.`);
}

const packageCard = listQuantV4Packages().find((entry: any) => entry.packageId === "MAL-001") as any;
assert(packageCard, "MAL-001 is missing from standard Question Studio capabilities.");
assert(packageCard.enabled === true, "MAL-001 Question Studio package is not enabled.");
assert(packageCard.runtimeMode === "QUESTION_STUDIO_ACTIVE", "MAL-001 runtime mode is not Question Studio active.");
assert(
  JSON.stringify(packageCard.cpIds) === JSON.stringify([...MAL_001_QUESTION_STUDIO_CP_IDS]),
  `MAL-001 capabilities do not expose all six CPs: ${JSON.stringify(packageCard.cpIds)}.`,
);
assert(
  JSON.stringify(packageCard.supportedLanguages) === JSON.stringify([...MAL_001_QUESTION_STUDIO_LANGUAGES]),
  `MAL-001 Question Studio language boundary drifted: ${JSON.stringify(packageCard.supportedLanguages)}.`,
);
assert(packageCard.questionBankStatus === "NOT_STORED", "MAL-001 package must remain Question-Studio-only.");
assert(packageCard.publiclyPublishable === false, "MAL-001 package public publication unexpectedly enabled.");

let directQlChecks = 0;
let cp006LifecycleChecks = 0;
for (let number = 1; number <= 67; number += 1) {
  const questionLanguageId = qlId(number);
  const canonicalProblemId = expectedCp(number);
  const result = await generateQuestion({
    packageId: "MAL-001",
    questionLanguageId,
    count: 1,
    seed: `mal-001-question-studio-complete:${questionLanguageId}`,
    language: "en",
  } as any);
  assert(result.generationContext?.runtimeMode === "QUESTION_STUDIO_ACTIVE", `${questionLanguageId}: batch runtime is not active.`);
  assert(
    result.generationContext?.questionBankStatus === "NOT_STORED" &&
      result.generationContext?.questionBankWritable === false &&
      result.generationContext?.testEligibility === "INELIGIBLE" &&
      result.generationContext?.publiclyPublishable === false,
    `${questionLanguageId}: conservative Question Studio lifecycle drifted.`,
  );
  assertQuestionSurface(result.questions?.[0], questionLanguageId, canonicalProblemId);
  const pkg = result.questionPackages?.[0] as any;
  assert(pkg?.questionLanguageId === questionLanguageId, `${questionLanguageId}: runtime package QL drift.`);
  if (canonicalProblemId === "MAL-CP-006") {
    const preview = result.questions[0] as any;
    assert(pkg.runtimeMode === "QUESTION_STUDIO_ACTIVE", `${questionLanguageId}: CP006 runtime not connected.`);
    assert(pkg.questionStudioDiscoverable === true, `${questionLanguageId}: CP006 is not discoverable.`);
    assert(pkg.questionBankWritable === false, `${questionLanguageId}: CP006 Question Bank write unexpectedly enabled.`);
    assert(pkg.testEligible === false, `${questionLanguageId}: CP006 test eligibility unexpectedly enabled.`);
    assert(pkg.publiclyPublishable === false, `${questionLanguageId}: CP006 public publication unexpectedly enabled.`);
    assert(preview.questionBankStatus === "NOT_STORED", `${questionLanguageId}: CP006 preview is not review-only.`);
    cp006LifecycleChecks += 1;
  }
  directQlChecks += 1;
}

const mixed = await generateQuestion({
  packageId: "MAL-001",
  count: 12,
  seed: "mal-001-question-studio-complete:mixed",
  language: "en",
} as any);
assert(mixed.questions.length === 12, "MAL-001 mixed Question Studio batch count drifted.");
const mixedCps = new Set(mixed.questions.map((question: any) => question.canonicalProblemId));
for (const cpId of MAL_001_QUESTION_STUDIO_CP_IDS) {
  assert(mixedCps.has(cpId), `MAL-001 mixed batch did not exercise ${cpId}.`);
}

let difficultyBatchChecks = 0;
for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const result = await generateQuestion({
    packageId: "MAL-001",
    difficulty,
    count: 18,
    seed: `mal-001-question-studio-complete:difficulty:${difficulty}`,
    language: "en",
  } as any);
  assert(result.questions.length === 18, `${difficulty}: batch count drifted.`);
  for (const question of result.questions as any[]) {
    assert(question.difficulty === difficulty, `${difficulty}: mixed batch returned ${question.difficulty}.`);
    assert(MAL_001_QUESTION_STUDIO_CP_IDS.includes(question.canonicalProblemId), `${difficulty}: unknown CP.`);
    difficultyBatchChecks += 1;
  }
}

let multilingualSmokeChecks = 0;
for (const language of ["hi", "pa"] as const) {
  for (const number of [1, 12, 29, 38, 48, 61]) {
    const questionLanguageId = qlId(number);
    const result = await generateQuestion({
      packageId: "MAL-001",
      questionLanguageId,
      count: 1,
      seed: `mal-001-question-studio-complete:${language}:${questionLanguageId}`,
      language,
    } as any);
    const question = result.questions?.[0] as any;
    assertQuestionSurface(question, questionLanguageId, expectedCp(number));
    assert(question.language === language, `${questionLanguageId}:${language}: language drift.`);
    assert(question.questionBankStatus === "NOT_STORED", `${questionLanguageId}:${language}: storage lock drift.`);
    assert(question.publiclyPublishable === false, `${questionLanguageId}:${language}: public lock drift.`);
    multilingualSmokeChecks += 1;
  }
}

const summary = {
  status: "PASS_MAL_001_QUESTION_STUDIO_COMPLETE_CONNECTION",
  packageId: "MAL-001",
  canonicalProblems: [...MAL_001_QUESTION_STUDIO_CP_IDS],
  supportedLanguages: [...MAL_001_QUESTION_STUDIO_LANGUAGES],
  permanentQlRange: "MAL-QL-001..MAL-QL-067",
  permanentQlsConnected: directQlChecks,
  cp006QuestionStudioLifecycleChecks: cp006LifecycleChecks,
  mixedBatchQuestions: mixed.questions.length,
  difficultyBatchChecks,
  multilingualSmokeChecks,
  lifecycle: {
    questionStudio: "ACTIVE_EN_HI_PA",
    batchFallbackQuestionBankStatus: "NOT_STORED",
    batchFallbackTestEligibility: "INELIGIBLE",
    batchFallbackPubliclyPublishable: false,
    cp006QuestionBankWritable: false,
    cp006TestEligible: false,
    cp006PubliclyPublishable: false,
  },
};

console.log(JSON.stringify(summary, null, 2));
