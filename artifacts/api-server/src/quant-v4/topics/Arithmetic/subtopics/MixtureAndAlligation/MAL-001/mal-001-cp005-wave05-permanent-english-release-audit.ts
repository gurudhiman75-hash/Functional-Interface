import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MAL_CP005_PERMANENT_ALLOCATION,
  MAL_CP005_PERMANENT_QL_IDS,
  MAL_CP005_PERMANENT_QL_RANGE,
} from "./foundation/cp005-permanent-allocation-v1";
import {
  MAL_CP005_ENGLISH_RELEASE,
  MAL_CP005_PERMANENT_RUNTIME_ID,
  MAL_CP005_RELEASE_ALLOCATION,
  generateMalCp005PermanentQuestion,
  malCp005PermanentStable,
  runMalCp005EnglishReleasePipeline,
  type MalCp005ReleasedQuestion,
} from "./foundation/cp005-permanent-runtime-v1";
import {
  MAL_001_QUESTION_STUDIO_CP_IDS,
  runMal001QuestionStudioPipeline,
} from "./question-studio-adapter";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function expectThrow(action: () => unknown, pattern: RegExp, message: string): void {
  let thrown: unknown;
  try {
    action();
  } catch (error) {
    thrown = error;
  }
  assert(thrown instanceof Error, message);
  assert(pattern.test(thrown.message), `${message} Received: ${thrown.message}`);
}

function numericQlId(qlId: string): number {
  const match = qlId.match(/^MAL-QL-(\d{3})$/u);
  assert(match, `Malformed permanent QL ID: ${qlId}.`);
  return Number(match[1]);
}

assert(MAL_CP005_PERMANENT_QL_IDS.length === 13, "Wave 05 must release exactly 13 QLs.");
assert(MAL_CP005_PERMANENT_ALLOCATION.length === 13, "Permanent allocation count changed.");
assert(MAL_CP005_RELEASE_ALLOCATION.length === 13, "Release allocation count changed.");
assert(new Set(MAL_CP005_PERMANENT_QL_IDS).size === 13, "Permanent QL IDs are not unique.");
assert(MAL_CP005_PERMANENT_QL_RANGE === "MAL-QL-048..MAL-QL-060", "Permanent QL range changed.");

const numericRange = MAL_CP005_PERMANENT_QL_IDS.map(numericQlId);
assert(
  numericRange.every((value, index) => value === 48 + index),
  `Permanent QL range is not continuous: ${numericRange.join(", ")}.`,
);
assert(
  MAL_CP005_RELEASE_ALLOCATION.filter((entry) => entry.difficulty === "Easy").length === 2,
  "Wave 05 Easy allocation must contain exactly MAL-QL-048 and MAL-QL-049.",
);
assert(
  MAL_CP005_RELEASE_ALLOCATION.filter((entry) => entry.difficulty === "Medium").length === 11,
  "Wave 05 Medium allocation must contain eleven QLs.",
);
assert(
  MAL_CP005_RELEASE_ALLOCATION[0]!.qlId === "MAL-QL-048" &&
    MAL_CP005_RELEASE_ALLOCATION[1]!.qlId === "MAL-QL-049" &&
    MAL_CP005_RELEASE_ALLOCATION.slice(2).every((entry) => entry.difficulty === "Medium"),
  "Difficulty allocation does not match the approved source runtime.",
);

assert(MAL_CP005_ENGLISH_RELEASE.status === "FROZEN", "English release is not frozen.");
assert(MAL_CP005_ENGLISH_RELEASE.releaseStatus === "APPROVED", "English release is not approved.");
assert(MAL_CP005_ENGLISH_RELEASE.qlCount === 13, "English release QL count is incorrect.");
assert(MAL_CP005_ENGLISH_RELEASE.qlRange === "MAL-QL-048..MAL-QL-060", "English release range is incorrect.");
assert(MAL_CP005_ENGLISH_RELEASE.terminologyPolicy === "COST_PRICE", "Cost-price terminology policy is missing.");
assert(
  MAL_CP005_ENGLISH_RELEASE.active &&
    MAL_CP005_ENGLISH_RELEASE.questionStudioDiscoverable &&
    MAL_CP005_ENGLISH_RELEASE.questionBankWritable &&
    MAL_CP005_ENGLISH_RELEASE.testEligible &&
    MAL_CP005_ENGLISH_RELEASE.publiclyPublishable,
  "English release surfaces are not fully enabled.",
);
assert(
  MAL_CP005_ENGLISH_RELEASE.excludedLanguages.join(",") === "hi,pa",
  "Hindi and Punjabi exclusion is not explicit.",
);
assert(
  MAL_001_QUESTION_STUDIO_CP_IDS.includes("MAL-CP-005"),
  "Question Studio does not list MAL-CP-005.",
);

const seedsPerQl = 100;
let generatedCount = 0;
let deterministicCount = 0;
let productApprovalCount = 0;
let permanentRouteCount = 0;
let lifecycleCount = 0;
let terminologyCount = 0;
let sourceValidationCount = 0;
let questionStudioExplicitRouteCount = 0;
const answerPositions = [0, 0, 0, 0];
const sourceRuntimeIds = new Set<string>();
const authorityIds = new Set<string>();
const solveModeIds = new Set<string>();
const coreFamilies = new Set<string>();
const qlStemSets = new Map<string, Set<string>>();
const qlAnswerSets = new Map<string, Set<string>>();
const reviewRows: MalCp005ReleasedQuestion[] = [];

for (const allocation of MAL_CP005_RELEASE_ALLOCATION) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  qlStemSets.set(allocation.qlId, stems);
  qlAnswerSets.set(allocation.qlId, answers);
  authorityIds.add(allocation.authorityId);
  solveModeIds.add(allocation.solveModeId);
  coreFamilies.add(allocation.coreFamily);

  for (let index = 0; index < seedsPerQl; index += 1) {
    const seed = `cp005-wave05:${allocation.qlId}:${index}`;
    const first = generateMalCp005PermanentQuestion(allocation.qlId, seed);
    const second = generateMalCp005PermanentQuestion(allocation.qlId, seed);

    assert(
      malCp005PermanentStable(first) === malCp005PermanentStable(second),
      `${allocation.qlId}/${seed}: permanent release generation is not deterministic.`,
    );
    deterministicCount += 1;

    assert(first.archetypeId === "MAL-001", `${seed}: wrong archetype.`);
    assert(first.canonicalProblemId === "MAL-CP-005", `${seed}: wrong canonical problem.`);
    assert(first.runtimeId === MAL_CP005_PERMANENT_RUNTIME_ID, `${seed}: wrong permanent runtime.`);
    assert(first.releaseId === MAL_CP005_ENGLISH_RELEASE.releaseId, `${seed}: wrong release ID.`);
    assert(first.permanentQlId === allocation.qlId, `${seed}: permanent QL changed.`);
    assert(first.permanentSolveModeId === allocation.solveModeId, `${seed}: solve mode changed.`);
    assert(first.questionLanguageId === allocation.qlId, `${seed}: question-language ID changed.`);
    assert(first.authorityId === allocation.authorityId, `${seed}: authority mapping changed.`);
    assert(first.coreFamily === allocation.coreFamily, `${seed}: core-family mapping changed.`);
    assert(first.difficulty === allocation.difficulty, `${seed}: release difficulty changed.`);
    assert(first.taskDirection === allocation.taskDirection, `${seed}: task direction changed.`);
    assert(first.answerSemantic === allocation.answerSemantic, `${seed}: answer semantic changed.`);
    permanentRouteCount += 1;

    assert(first.sourceReviewStatus === "PRODUCT_REVIEW_APPROVED", `${seed}: source approval missing.`);
    assert(first.reviewStatus === "APPROVED_EDITORIAL_ENGLISH", `${seed}: release editorial approval missing.`);
    productApprovalCount += 1;

    assert(
      first.maturity === "FROZEN" &&
        first.allocationStatus === "RELEASED_ENGLISH_V1" &&
        first.releaseStatus === "APPROVED" &&
        first.runtimeMode === "RELEASED" &&
        first.questionBankStatus === "WRITABLE" &&
        first.testEligibility === "ELIGIBLE" &&
        first.permanentIdentityFrozen,
      `${seed}: release lifecycle metadata is incomplete.`,
    );
    assert(
      first.active &&
        first.publiclyPublishable &&
        first.questionStudioDiscoverable &&
        first.questionBankWritable &&
        first.testEligible,
      `${seed}: one or more English product flags are disabled.`,
    );
    lifecycleCount += 1;

    const learnerText = JSON.stringify({
      stem: first.stem,
      answer: first.answer,
      options: first.options,
      explanation: first.explanation,
    });
    assert(
      !/\b(?:buying|purchase) rate\b/iu.test(learnerText),
      `${seed}: buying/purchase-rate terminology survived the cost-price release rule.`,
    );
    assert(!/\b1 litres\b/iu.test(learnerText), `${seed}: singular litre grammar regressed.`);
    assert(
      !/false weight|false measure|short delivery|800 ml/iu.test(learnerText),
      `${seed}: PNL false-quantity ownership leaked into MAL-CP-005.`,
    );
    terminologyCount += 1;

    assert(first.sourceValidation.ok, `${seed}: source validation was not preserved.`);
    assert(first.validation.ok && first.validation.valid, `${seed}: release validation failed.`);
    assert(first.validation.errors.length === 0, `${seed}: release validation has errors.`);
    assert(first.validation.checks.length >= 5, `${seed}: release validation checks are incomplete.`);
    assert(first.validation.checks.every((check) => check.passed), `${seed}: a release validation check failed.`);
    sourceValidationCount += 1;

    assert(first.stem.endsWith("?"), `${seed}: released stem is not interrogative.`);
    assert(first.options.length === 4, `${seed}: released question does not have four options.`);
    assert(new Set(first.options).size === 4, `${seed}: released options are not unique.`);
    assert(first.options[first.correctIndex] === first.answer, `${seed}: answer/index mismatch.`);
    assert(
      first.optionAudit.filter((entry) => entry.isCorrect).length === 1,
      `${seed}: option audit does not contain exactly one correct answer.`,
    );
    assert(
      first.explanation.visibleLines.length >= 1 && first.explanation.visibleLines.length <= 3,
      `${seed}: default solution is not one to three lines.`,
    );
    assert(
      first.traceability.terminologyPolicy === "COST_PRICE" &&
        first.traceability.runtimeMode === "RELEASED" &&
        first.traceability.questionBankStatus === "WRITABLE" &&
        first.traceability.testEligibility === "ELIGIBLE" &&
        first.traceability.publiclyPublishable,
      `${seed}: release traceability is incomplete.`,
    );

    sourceRuntimeIds.add(first.sourceRuntimeId);
    stems.add(first.stem);
    answers.add(first.answer);
    answerPositions[first.correctIndex] += 1;
    generatedCount += 1;

    if (index < 4) reviewRows.push(first);
  }

  assert(stems.size >= 10, `${allocation.qlId}: stem diversity is too low (${stems.size}).`);
  assert(answers.size >= 5, `${allocation.qlId}: answer diversity is too low (${answers.size}).`);

  const studio = runMal001QuestionStudioPipeline("MAL-CP-005", {
    questionLanguageId: allocation.qlId,
    difficulty: allocation.difficulty,
    language: "en",
    seed: `cp005-wave05-studio:${allocation.qlId}`,
  });
  assert("permanentQlId" in studio, `${allocation.qlId}: Question Studio did not return a permanent QL.`);
  assert(studio.permanentQlId === allocation.qlId, `${allocation.qlId}: Question Studio explicit route changed.`);
  assert("runtimeId" in studio && studio.runtimeId === MAL_CP005_PERMANENT_RUNTIME_ID, `${allocation.qlId}: Question Studio used the wrong runtime.`);
  questionStudioExplicitRouteCount += 1;
}

assert(generatedCount === 1300, `Expected 1300 release questions, received ${generatedCount}.`);
assert(deterministicCount === generatedCount, "Determinism coverage is incomplete.");
assert(productApprovalCount === generatedCount, "Product-approval coverage is incomplete.");
assert(permanentRouteCount === generatedCount, "Permanent-route coverage is incomplete.");
assert(lifecycleCount === generatedCount, "Lifecycle coverage is incomplete.");
assert(terminologyCount === generatedCount, "Cost-price terminology coverage is incomplete.");
assert(sourceValidationCount === generatedCount, "Source-validation coverage is incomplete.");
assert(questionStudioExplicitRouteCount === 13, "Question Studio explicit-route coverage is incomplete.");
assert(authorityIds.size === 13, `Expected 13 distinct authorities, received ${authorityIds.size}.`);
assert(solveModeIds.size === 13, `Expected 13 distinct solve modes, received ${solveModeIds.size}.`);
assert(coreFamilies.size === 3, `Expected 3 shared mathematical cores, received ${coreFamilies.size}.`);
assert(sourceRuntimeIds.size >= 2, "Both the V2 and Wave 03 approved source runtimes were not exercised.");
assert(answerPositions.every((count) => count >= 250), `Answer positions are imbalanced: ${answerPositions.join("/")}.`);
assert(reviewRows.length === 52, `Expected 52 review rows, received ${reviewRows.length}.`);

for (let index = 0; index < 100; index += 1) {
  const easy = runMal001QuestionStudioPipeline("MAL-CP-005", {
    difficulty: "Easy",
    language: "en",
    seed: `cp005-wave05-easy-select:${index}`,
  });
  assert("permanentQlId" in easy, "Easy Question Studio selection lost permanent identity.");
  assert(
    easy.permanentQlId === "MAL-QL-048" || easy.permanentQlId === "MAL-QL-049",
    `Easy Question Studio selected non-Easy QL ${String(easy.permanentQlId)}.`,
  );
  assert("difficulty" in easy && easy.difficulty === "Easy", "Easy Question Studio selection returned wrong difficulty.");

  const medium = runMal001QuestionStudioPipeline("MAL-CP-005", {
    difficulty: "Medium",
    language: "en",
    seed: `cp005-wave05-medium-select:${index}`,
  });
  assert("permanentQlId" in medium, "Medium Question Studio selection lost permanent identity.");
  assert(
    numericQlId(String(medium.permanentQlId)) >= 50 && numericQlId(String(medium.permanentQlId)) <= 60,
    `Medium Question Studio selected non-Medium QL ${String(medium.permanentQlId)}.`,
  );
  assert("difficulty" in medium && medium.difficulty === "Medium", "Medium Question Studio selection returned wrong difficulty.");
}

expectThrow(
  () => runMal001QuestionStudioPipeline("MAL-CP-005", {
    difficulty: "Hard",
    language: "en",
    seed: "cp005-wave05-hard-block",
  }),
  /No active MAL-CP-005 QLs match difficulty Hard/u,
  "Hard Question Studio requests should remain blocked for CP-005.",
);
expectThrow(
  () => runMal001QuestionStudioPipeline("MAL-CP-005", {
    difficulty: "Easy",
    questionLanguageId: "MAL-QL-060",
    language: "en",
  }),
  /MAL-QL-060 is not active for MAL-CP-005 \/ Easy/u,
  "MAL-QL-060 must not be exposed as Easy.",
);
expectThrow(
  () => runMalCp005EnglishReleasePipeline({
    questionLanguageId: "MAL-QL-048",
    language: "hi" as never,
  }),
  /does not support language 'hi'/u,
  "Hindi must remain excluded from the CP-005 English release.",
);
expectThrow(
  () => runMal001QuestionStudioPipeline("MAL-CP-005", {
    language: "pa" as never,
  }),
  /supports English generation only/u,
  "Punjabi must remain excluded from MAL-001 Question Studio.",
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp005-wave05-permanent-english-release.json");
const markdownPath = resolve(
  outputDirectory,
  "MAL-CP-005-WAVE-05-PERMANENT-ENGLISH-RELEASE-52Q-REVIEW.md",
);

const summary = {
  status: "PASS_MAL_CP005_WAVE05_PERMANENT_ENGLISH_RELEASE",
  runtimeId: MAL_CP005_PERMANENT_RUNTIME_ID,
  releaseId: MAL_CP005_ENGLISH_RELEASE.releaseId,
  qlRange: MAL_CP005_ENGLISH_RELEASE.qlRange,
  qlCount: MAL_CP005_ENGLISH_RELEASE.qlCount,
  easyQlCount: 2,
  mediumQlCount: 11,
  sharedMathematicalCoreCount: coreFamilies.size,
  generatedCount,
  deterministicCount,
  productApprovalCount,
  permanentRouteCount,
  lifecycleCount,
  terminologyCount,
  sourceValidationCount,
  questionStudioExplicitRouteCount,
  questionStudioDifficultySelections: 200,
  distinctAuthorities: authorityIds.size,
  distinctSolveModes: solveModeIds.size,
  sourceRuntimeCount: sourceRuntimeIds.size,
  answerPositions,
  reviewCount: reviewRows.length,
  delivery: {
    active: true,
    questionStudioDiscoverable: true,
    questionBankWritable: true,
    testEligible: true,
    publiclyPublishable: true,
  },
  excludedLanguages: ["hi", "pa"],
  terminologyPolicy: "COST_PRICE",
};

writeFileSync(jsonPath, `${JSON.stringify({ ...summary, review: reviewRows }, (_key, value) =>
  typeof value === "bigint" ? value.toString() : value, 2)}\n`, "utf8");

const markdown: string[] = [
  "# MAL-CP-005 Wave 05 — Permanent English Release 52Q Review",
  "",
  "> English release candidate only. Hindi and Punjabi remain excluded. Merge remains a separate product-owner gate.",
  "",
  `Runtime: \`${MAL_CP005_PERMANENT_RUNTIME_ID}\``,
  `Release: \`${MAL_CP005_ENGLISH_RELEASE.releaseId}\``,
  `QL range: \`${MAL_CP005_ENGLISH_RELEASE.qlRange}\``,
  "",
  "## Release controls",
  "",
  "- 13 permanent QLs are released in English.",
  "- MAL-QL-048..049 are Easy; MAL-QL-050..060 are Medium; CP-005 has no Hard QL in this release.",
  "- Question Studio, Question Bank, tests and public publication are enabled in the release layer.",
  "- Learner-facing CP wording uses cost price; buying rate and purchase rate are rejected when they mean CP.",
  "- Hindi and Punjabi remain excluded.",
  "",
  "## Review questions",
  "",
];

for (const [index, question] of reviewRows.entries()) {
  markdown.push(
    `### ${index + 1}. ${question.permanentQlId} — ${question.stem}`,
    "",
    ...question.options.map(
      (option, optionIndex) =>
        `${String.fromCharCode(65 + optionIndex)}. ${option}${optionIndex === question.correctIndex ? " **✓**" : ""}`,
    ),
    "",
    `**Answer:** ${question.answer}`,
    "",
    "**Solution**",
    ...question.explanation.visibleLines.map((line) => `- ${line}`),
    "",
    `**Common mistake:** ${question.explanation.optionalHelp.commonMistake}`,
    "",
    ...(question.explanation.optionalHelp.verification?.length
      ? [
          "**Verification**",
          ...question.explanation.optionalHelp.verification.map((line) => `- ${line}`),
          "",
        ]
      : []),
    `**Trace:** ${question.permanentSolveModeId} | ${question.coreFamily} | ${question.answerSemantic}`,
    "",
    "---",
    "",
  );
}

writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
