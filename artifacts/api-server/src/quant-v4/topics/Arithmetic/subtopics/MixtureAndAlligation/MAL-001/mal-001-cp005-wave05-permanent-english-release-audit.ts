import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
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

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
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
  assert(match, `Malformed QL ID: ${qlId}.`);
  return Number(match[1]);
}

assert(MAL_CP005_PERMANENT_QL_RANGE === "MAL-QL-048..MAL-QL-060", "CP-005 QL range changed.");
assert(MAL_CP005_PERMANENT_QL_IDS.length === 13, "CP-005 permanent QL count changed.");
assert(MAL_CP005_RELEASE_ALLOCATION.length === 13, "CP-005 release allocation count changed.");
assert(new Set(MAL_CP005_PERMANENT_QL_IDS).size === 13, "CP-005 QL identities are not unique.");
assert(
  MAL_CP005_PERMANENT_QL_IDS.every((qlId, index) => numericQlId(qlId) === 48 + index),
  "CP-005 permanent QL range is not contiguous.",
);
assert(
  MAL_CP005_RELEASE_ALLOCATION.filter((entry) => entry.difficulty === "Easy").map((entry) => entry.qlId).join(",") ===
    "MAL-QL-048,MAL-QL-049",
  "CP-005 Easy allocation changed.",
);
assert(
  MAL_CP005_RELEASE_ALLOCATION.filter((entry) => entry.difficulty === "Medium").length === 11,
  "CP-005 Medium allocation changed.",
);
assert(
  MAL_CP005_ENGLISH_RELEASE.releaseStatus === "APPROVED" &&
    MAL_CP005_ENGLISH_RELEASE.status === "FROZEN" &&
    MAL_CP005_ENGLISH_RELEASE.terminologyPolicy === "COST_PRICE",
  "CP-005 English release authority is incomplete.",
);
assert(
  MAL_CP005_ENGLISH_RELEASE.active &&
    MAL_CP005_ENGLISH_RELEASE.questionStudioDiscoverable &&
    MAL_CP005_ENGLISH_RELEASE.questionBankWritable &&
    MAL_CP005_ENGLISH_RELEASE.testEligible &&
    MAL_CP005_ENGLISH_RELEASE.publiclyPublishable,
  "CP-005 English release surfaces are not fully enabled.",
);
assert(
  MAL_CP005_ENGLISH_RELEASE.excludedLanguages.join(",") === "hi,pa",
  "Hindi/Punjabi exclusion changed.",
);
assert(MAL_001_QUESTION_STUDIO_CP_IDS.includes("MAL-CP-005"), "Question Studio does not expose MAL-CP-005.");

const seedsPerQl = 100;
let generatedCount = 0;
let deterministicCount = 0;
let routeCount = 0;
let productApprovalCount = 0;
let lifecycleCount = 0;
let terminologyCount = 0;
let sourceValidationCount = 0;
let explicitStudioRouteCount = 0;
const answerPositions = [0, 0, 0, 0];
const authorities = new Set<string>();
const solveModes = new Set<string>();
const cores = new Set<string>();
const sourceRuntimes = new Set<string>();
const reviewRows: MalCp005ReleasedQuestion[] = [];
const qlEvidence: Array<{
  qlId: string;
  difficulty: string;
  distinctStates: number;
  distinctSiblingStates: number;
  distinctStems: number;
  distinctAnswers: number;
}> = [];

for (const allocation of MAL_CP005_RELEASE_ALLOCATION) {
  authorities.add(allocation.authorityId);
  solveModes.add(allocation.solveModeId);
  cores.add(allocation.coreFamily);
  const states = new Set<string>();
  const siblingStates = new Set<string>();
  const stems = new Set<string>();
  const answers = new Set<string>();

  for (let index = 0; index < seedsPerQl; index += 1) {
    const seed = `cp005-wave05:${allocation.qlId}:${index}`;
    const first = generateMalCp005PermanentQuestion(allocation.qlId, seed);
    const second = generateMalCp005PermanentQuestion(allocation.qlId, seed);

    assert(
      malCp005PermanentStable(first) === malCp005PermanentStable(second),
      `${allocation.qlId}/${seed}: release generation is not deterministic.`,
    );
    deterministicCount += 1;

    assert(first.runtimeId === MAL_CP005_PERMANENT_RUNTIME_ID, `${seed}: wrong release runtime.`);
    assert(first.releaseId === MAL_CP005_ENGLISH_RELEASE.releaseId, `${seed}: wrong release ID.`);
    assert(first.permanentQlId === allocation.qlId, `${seed}: permanent QL route changed.`);
    assert(first.permanentSolveModeId === allocation.solveModeId, `${seed}: permanent solve mode changed.`);
    assert(first.questionLanguageId === allocation.qlId, `${seed}: question-language ID changed.`);
    assert(first.authorityId === allocation.authorityId, `${seed}: authority route changed.`);
    assert(first.coreFamily === allocation.coreFamily, `${seed}: shared-core route changed.`);
    assert(first.difficulty === allocation.difficulty, `${seed}: difficulty changed.`);
    assert(first.taskDirection === allocation.taskDirection, `${seed}: task direction changed.`);
    assert(first.answerSemantic === allocation.answerSemantic, `${seed}: answer semantic changed.`);
    routeCount += 1;

    assert(first.sourceReviewStatus === "PRODUCT_REVIEW_APPROVED", `${seed}: source product approval missing.`);
    assert(first.reviewStatus === "APPROVED_EDITORIAL_ENGLISH", `${seed}: release editorial approval missing.`);
    productApprovalCount += 1;

    assert(
      first.maturity === "FROZEN" &&
        first.allocationStatus === "RELEASED_ENGLISH_V1" &&
        first.releaseStatus === "APPROVED" &&
        first.runtimeMode === "RELEASED" &&
        first.questionBankStatus === "WRITABLE" &&
        first.testEligibility === "ELIGIBLE" &&
        first.permanentIdentityFrozen &&
        first.active &&
        first.publiclyPublishable &&
        first.questionStudioDiscoverable &&
        first.questionBankWritable &&
        first.testEligible,
      `${seed}: English release lifecycle is incomplete.`,
    );
    lifecycleCount += 1;

    const learnerText = JSON.stringify({
      stem: first.stem,
      answer: first.answer,
      options: first.options,
      explanation: first.explanation,
    });
    assert(!/\b(?:buying|purchase) rate\b/iu.test(learnerText), `${seed}: forbidden CP terminology survived.`);
    assert(!/\b1 litres\b/iu.test(learnerText), `${seed}: singular litre grammar regressed.`);
    assert(
      !/false weight|false measure|short delivery|800 ml/iu.test(learnerText),
      `${seed}: PNL false-quantity ownership leaked into MAL-CP-005.`,
    );
    assert(first.traceability.terminologyPolicy === "COST_PRICE", `${seed}: terminology traceability changed.`);
    terminologyCount += 1;

    assert(first.sourceValidation.ok, `${seed}: source validation/equivalence was not preserved.`);
    assert(first.validation.ok && first.validation.valid && first.validation.errors.length === 0, `${seed}: release validation failed.`);
    assert(first.validation.checks.length >= 5 && first.validation.checks.every((check) => check.passed), `${seed}: release checks are incomplete.`);
    sourceValidationCount += 1;

    assert(first.stem.endsWith("?"), `${seed}: released stem is not interrogative.`);
    assert(first.options.length === 4 && new Set(first.options).size === 4, `${seed}: options are not four unique choices.`);
    assert(first.options[first.correctIndex] === first.answer, `${seed}: answer/index mismatch.`);
    assert(first.optionAudit.filter((entry) => entry.isCorrect).length === 1, `${seed}: option audit lacks one unique correct answer.`);
    assert(first.explanation.visibleLines.length >= 1 && first.explanation.visibleLines.length <= 3, `${seed}: default solution is not 1–3 lines.`);

    states.add(first.stateKey);
    siblingStates.add(first.siblingStateKey);
    stems.add(first.stem);
    answers.add(first.answer);
    sourceRuntimes.add(first.sourceRuntimeId);
    answerPositions[first.correctIndex] += 1;
    generatedCount += 1;
    if (index < 4) reviewRows.push(first);
  }

  assert(states.size >= 25, `${allocation.qlId}: exact-state diversity is too low (${states.size}).`);
  assert(siblingStates.size >= 10, `${allocation.qlId}: sibling-state diversity is too low (${siblingStates.size}).`);
  assert(stems.size >= 10, `${allocation.qlId}: stem diversity is too low (${stems.size}).`);
  assert(answers.size >= 2, `${allocation.qlId}: answer generation became constant.`);
  qlEvidence.push({
    qlId: allocation.qlId,
    difficulty: allocation.difficulty,
    distinctStates: states.size,
    distinctSiblingStates: siblingStates.size,
    distinctStems: stems.size,
    distinctAnswers: answers.size,
  });

  const studio = runMal001QuestionStudioPipeline("MAL-CP-005", {
    questionLanguageId: allocation.qlId,
    difficulty: allocation.difficulty,
    language: "en",
    seed: `cp005-wave05-studio:${allocation.qlId}`,
  }) as MalCp005ReleasedQuestion;
  assert(studio.permanentQlId === allocation.qlId, `${allocation.qlId}: explicit Question Studio route changed.`);
  assert(studio.runtimeId === MAL_CP005_PERMANENT_RUNTIME_ID, `${allocation.qlId}: Question Studio used the wrong runtime.`);
  explicitStudioRouteCount += 1;
}

assert(generatedCount === 1300, `Expected 1300 release questions, received ${generatedCount}.`);
assert(deterministicCount === 1300, "Determinism coverage is incomplete.");
assert(routeCount === 1300, "Permanent route coverage is incomplete.");
assert(productApprovalCount === 1300, "Product-approval coverage is incomplete.");
assert(lifecycleCount === 1300, "Lifecycle coverage is incomplete.");
assert(terminologyCount === 1300, "Cost-price terminology coverage is incomplete.");
assert(sourceValidationCount === 1300, "Source-validation coverage is incomplete.");
assert(explicitStudioRouteCount === 13, "Question Studio explicit-route coverage is incomplete.");
assert(authorities.size === 13, `Expected 13 authorities, received ${authorities.size}.`);
assert(solveModes.size === 13, `Expected 13 solve modes, received ${solveModes.size}.`);
assert(cores.size === 3, `Expected 3 shared mathematical cores, received ${cores.size}.`);
assert(sourceRuntimes.size >= 2, "Both approved source runtime families were not exercised.");
assert(answerPositions.every((count) => count > 0), `One answer position was never used: ${answerPositions.join("/")}.`);
assert(reviewRows.length === 52, `Expected 52 review questions, received ${reviewRows.length}.`);

for (let index = 0; index < 100; index += 1) {
  const easy = runMal001QuestionStudioPipeline("MAL-CP-005", {
    difficulty: "Easy",
    language: "en",
    seed: `cp005-wave05-easy:${index}`,
  }) as MalCp005ReleasedQuestion;
  assert(
    easy.permanentQlId === "MAL-QL-048" || easy.permanentQlId === "MAL-QL-049",
    `Easy selector returned ${easy.permanentQlId}.`,
  );
  assert(easy.difficulty === "Easy", "Easy selector returned a non-Easy question.");

  const medium = runMal001QuestionStudioPipeline("MAL-CP-005", {
    difficulty: "Medium",
    language: "en",
    seed: `cp005-wave05-medium:${index}`,
  }) as MalCp005ReleasedQuestion;
  const mediumNumber = numericQlId(medium.permanentQlId);
  assert(mediumNumber >= 50 && mediumNumber <= 60, `Medium selector returned ${medium.permanentQlId}.`);
  assert(medium.difficulty === "Medium", "Medium selector returned a non-Medium question.");
}

expectThrow(
  () => runMal001QuestionStudioPipeline("MAL-CP-005", { difficulty: "Hard", language: "en" }),
  /No active MAL-CP-005 QLs match difficulty Hard/u,
  "Hard requests must remain blocked.",
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
  () => runMalCp005EnglishReleasePipeline({ questionLanguageId: "MAL-QL-048", language: "hi" as never }),
  /does not support language 'hi'/u,
  "Hindi must remain excluded.",
);
expectThrow(
  () => runMal001QuestionStudioPipeline("MAL-CP-005", { language: "pa" as never }),
  /supports English generation only/u,
  "Punjabi must remain excluded.",
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp005-wave05-permanent-english-release.json");
const markdownPath = resolve(outputDirectory, "MAL-CP-005-WAVE-05-PERMANENT-ENGLISH-RELEASE-52Q-REVIEW.md");

const summary = {
  status: "PASS_MAL_CP005_WAVE05_PERMANENT_ENGLISH_RELEASE",
  runtimeId: MAL_CP005_PERMANENT_RUNTIME_ID,
  releaseId: MAL_CP005_ENGLISH_RELEASE.releaseId,
  qlRange: MAL_CP005_ENGLISH_RELEASE.qlRange,
  qlCount: 13,
  easyQlCount: 2,
  mediumQlCount: 11,
  hardQlCount: 0,
  sharedMathematicalCoreCount: cores.size,
  generatedCount,
  deterministicCount,
  routeCount,
  productApprovalCount,
  lifecycleCount,
  terminologyCount,
  sourceValidationCount,
  explicitStudioRouteCount,
  difficultySelectionProofs: 200,
  distinctAuthorities: authorities.size,
  distinctSolveModes: solveModes.size,
  sourceRuntimeCount: sourceRuntimes.size,
  answerPositions,
  qlEvidence,
  reviewCount: reviewRows.length,
  terminologyPolicy: "COST_PRICE",
  delivery: {
    active: true,
    questionStudioDiscoverable: true,
    questionBankWritable: true,
    testEligible: true,
    publiclyPublishable: true,
  },
  excludedLanguages: ["hi", "pa"],
};

writeFileSync(
  jsonPath,
  `${JSON.stringify({ ...summary, review: reviewRows }, (_key, value) =>
    typeof value === "bigint" ? value.toString() : value, 2)}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-CP-005 Wave 05 — Permanent English Release 52Q Review",
  "",
  "> English release candidate. Hindi and Punjabi remain excluded. Merge remains a separate gate.",
  "",
  `Runtime: \`${MAL_CP005_PERMANENT_RUNTIME_ID}\``,
  `Release: \`${MAL_CP005_ENGLISH_RELEASE.releaseId}\``,
  `QL range: \`${MAL_CP005_ENGLISH_RELEASE.qlRange}\``,
  "",
  "## Release controls",
  "",
  "- 13 permanent English QLs: MAL-QL-048..060.",
  "- MAL-QL-048..049 are Easy; MAL-QL-050..060 are Medium; no synthetic Hard QL is introduced.",
  "- Question Studio, Question Bank, tests and public publication are enabled in the release layer.",
  "- Learner-facing CP terminology uses cost price, not buying rate or purchase rate.",
  "- Hindi and Punjabi remain excluded.",
  "",
  "## Per-QL diversity evidence",
  "",
  "| QL | Difficulty | Exact states | Sibling states | Stems | Answers |",
  "|---|---|---:|---:|---:|---:|",
  ...qlEvidence.map((row) =>
    `| ${row.qlId} | ${row.difficulty} | ${row.distinctStates} | ${row.distinctSiblingStates} | ${row.distinctStems} | ${row.distinctAnswers} |`,
  ),
  "",
  "## 52-question review",
  "",
];

for (const [index, question] of reviewRows.entries()) {
  markdown.push(
    `### ${index + 1}. ${question.permanentQlId} — ${question.stem}`,
    "",
    ...question.options.map((option, optionIndex) =>
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
      ? ["**Verification**", ...question.explanation.optionalHelp.verification.map((line) => `- ${line}`), ""]
      : []),
    `**Trace:** ${question.permanentSolveModeId} | ${question.coreFamily} | ${question.answerSemantic}`,
    "",
    "---",
    "",
  );
}

writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
