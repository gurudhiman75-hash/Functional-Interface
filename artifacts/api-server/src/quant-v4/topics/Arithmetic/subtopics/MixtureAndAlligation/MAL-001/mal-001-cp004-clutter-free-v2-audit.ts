import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MAL_CP004_CLUTTER_FREE_PRESENTATION_ID,
  MAL_CP004_CLUTTER_FREE_RUNTIME_ID,
  MAL_CP004_ENGLISH_RELEASE_V2,
  malCp004ClutterFreeStable,
  runMalCp004EnglishClutterFreeV2Pipeline,
  type MalCp004ClutterFreeQuestion,
} from "./foundation/cp004-clutter-free-editorial-v2";
import {
  MAL_CP004_PERMANENT_ALLOCATION,
  MAL_CP004_PERMANENT_RUNTIME_ID,
  runMalCp004EnglishReleasePipeline,
  type MalCp004PermanentQlId,
  type MalCp004ReleasedQuestion,
} from "./foundation/cp004-permanent-runtime";
import { runMal001QuestionStudioPipeline } from "./question-studio-adapter";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) =>
    typeof entry === "bigint" ? `${entry}n` : entry,
  );
}

function words(value: string): number {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

function assertV1V2Parity(
  v1: MalCp004ReleasedQuestion,
  v2: MalCp004ClutterFreeQuestion,
): void {
  const prefix = `${v2.permanentQlId}/${v2.seed}`;
  assert(v2.stem === v1.stem, `${prefix}: stem changed in presentation V2.`);
  assert(
    stable(v2.options) === stable(v1.options),
    `${prefix}: options changed in presentation V2.`,
  );
  assert(
    stable(v2.optionAudit) === stable(v1.optionAudit),
    `${prefix}: option audit changed in presentation V2.`,
  );
  assert(v2.correctIndex === v1.correctIndex, `${prefix}: correct index changed.`);
  assert(v2.answer === v1.answer, `${prefix}: answer text changed.`);
  assert(
    stable(v2.answerValue) === stable(v1.answerValue),
    `${prefix}: exact answer changed.`,
  );
  assert(
    stable(v2.exactState) === stable(v1.exactState),
    `${prefix}: exact mathematical state changed.`,
  );
  assert(
    v2.mathematicalFingerprint === v1.mathematicalFingerprint,
    `${prefix}: mathematical fingerprint changed.`,
  );
  assert(
    stable(v2.sourceEvidenceIds) === stable(v1.sourceEvidenceIds),
    `${prefix}: source evidence changed.`,
  );
  assert(
    stable(v2.reasoningGraph) === stable(v1.reasoningGraph),
    `${prefix}: reasoning graph changed.`,
  );
  assert(v2.permanentQlId === v1.permanentQlId, `${prefix}: QL identity changed.`);
  assert(
    v2.questionLanguageId === v1.questionLanguageId,
    `${prefix}: question-language identity changed.`,
  );
  assert(v2.difficulty === v1.difficulty, `${prefix}: difficulty changed.`);
  assert(v2.taskDirection === v1.taskDirection, `${prefix}: task direction changed.`);
  assert(v2.answerSemantic === v1.answerSemantic, `${prefix}: answer semantic changed.`);
  assert(v2.active === v1.active, `${prefix}: active lifecycle changed.`);
  assert(
    v2.questionStudioDiscoverable === v1.questionStudioDiscoverable &&
      v2.questionBankWritable === v1.questionBankWritable &&
      v2.testEligible === v1.testEligible &&
      v2.publiclyPublishable === v1.publiclyPublishable,
    `${prefix}: delivery lifecycle changed.`,
  );
}

function assertClutterFreeSurface(question: MalCp004ClutterFreeQuestion): void {
  const prefix = `${question.permanentQlId}/${question.seed}`;
  const explanation = question.explanation;
  assert(
    question.runtimeId === MAL_CP004_CLUTTER_FREE_RUNTIME_ID,
    `${prefix}: wrong V2 runtime ID.`,
  );
  assert(
    question.sourcePermanentRuntimeId === MAL_CP004_PERMANENT_RUNTIME_ID,
    `${prefix}: V1 source runtime is not recorded.`,
  );
  assert(
    question.traceability.releaseId === MAL_CP004_ENGLISH_RELEASE_V2.releaseId,
    `${prefix}: traceability still reports the V1 release.`,
  );
  assert(
    question.traceability.presentationVersion ===
      MAL_CP004_CLUTTER_FREE_PRESENTATION_ID,
    `${prefix}: presentation version is missing.`,
  );
  assert(
    question.allocationStatus === "RELEASED_ENGLISH_V2",
    `${prefix}: allocation status is not V2.`,
  );
  assert(
    explanation.layoutId === "MAL-CP004-EN-CLUTTER-FREE-V2",
    `${prefix}: wrong explanation layout.`,
  );
  assert(
    stable(explanation.sectionTitles) ===
      stable({
        method: "Method",
        calculation: "Calculation",
        answer: "Answer",
        moreHelp: "More help",
      }),
    `${prefix}: section titles are not clutter-free.`,
  );
  assert(explanation.method.length > 0, `${prefix}: method is empty.`);
  assert(explanation.calculation.length > 0, `${prefix}: calculation is empty.`);
  assert(explanation.answer === question.answer, `${prefix}: answer field is stale.`);
  assert(
    stable(explanation.visibleLines) === stable(explanation.lines),
    `${prefix}: compatibility lines expose extra content.`,
  );
  assert(
    explanation.visibleLines.length === explanation.calculation.length + 2,
    `${prefix}: visible explanation contains an unexpected block.`,
  );
  assert(
    explanation.visibleLines[0] === explanation.method &&
      explanation.visibleLines.at(-1) === `Answer: ${question.answer}`,
    `${prefix}: visible line order is incorrect.`,
  );
  assert(
    explanation.optionalHelp.collapsedByDefault,
    `${prefix}: optional help is expanded by default.`,
  );
  assert(
    explanation.optionalHelp.whyOtherOptionsAreWrong.length === 3,
    `${prefix}: hidden option analysis is incomplete.`,
  );
  assert(
    !Object.hasOwn(explanation, "examSpeedShortcut") &&
      !Object.hasOwn(explanation, "shortcut") &&
      !Object.hasOwn(explanation.optionalHelp, "alternativeMethod"),
    `${prefix}: a forced Fast Method remains in V2.`,
  );
  const visibleText = explanation.visibleLines.join("\n");
  const forbidden = [
    /10-second/iu,
    /exam shortcut/iu,
    /fast method/iu,
    /quick check/iu,
    /common traps/iu,
    /distractor analysis/iu,
    /why the other options/iu,
  ];
  for (const pattern of forbidden) {
    assert(!pattern.test(visibleText), `${prefix}: visible clutter remains: ${pattern}.`);
  }
  assert(
    new Set(explanation.calculation.map((line) => line.toLowerCase())).size ===
      explanation.calculation.length,
    `${prefix}: calculation repeats a line.`,
  );
  assert(
    explanation.calculation.every(
      (line) => !/^(?:therefore|hence|thus|final answer|answer)\b/iu.test(line),
    ),
    `${prefix}: calculation repeats the conclusion.`,
  );
  assert(
    words(visibleText) <= 150,
    `${prefix}: default learner explanation exceeds 150 words.`,
  );

  const verificationExpected =
    question.permanentQlId === "MAL-QL-045" ||
    question.permanentQlId === "MAL-QL-047";
  assert(
    verificationExpected ===
      Object.hasOwn(explanation.optionalHelp, "verification"),
    `${prefix}: optional verification policy is incorrect.`,
  );
}

assert(
  MAL_CP004_ENGLISH_RELEASE_V2.releaseId === "MAL-CP004-EN-v2" &&
    MAL_CP004_ENGLISH_RELEASE_V2.runtimeId ===
      MAL_CP004_CLUTTER_FREE_RUNTIME_ID,
  "The V2 release identity is incorrect.",
);
assert(
  MAL_CP004_ENGLISH_RELEASE_V2.qlRange === "MAL-QL-038..MAL-QL-047" &&
    MAL_CP004_ENGLISH_RELEASE_V2.qlCount === 10,
  "The permanent QL allocation changed in V2.",
);
assert(
  MAL_CP004_ENGLISH_RELEASE_V2.questionStudioDiscoverable &&
    MAL_CP004_ENGLISH_RELEASE_V2.questionBankWritable &&
    MAL_CP004_ENGLISH_RELEASE_V2.testEligible &&
    MAL_CP004_ENGLISH_RELEASE_V2.publiclyPublishable,
  "The V2 candidate lost an existing English delivery permission.",
);

const seedsPerQl = 200;
const reviewRowsPerQl = 10;
let generatedCount = 0;
let deterministicCount = 0;
let parityCount = 0;
let hiddenDistractorCount = 0;
let questionStudioRouteCount = 0;
let defaultVerificationCount = 0;
let optionalVerificationCount = 0;
let forcedFastMethodCount = 0;
let maximumVisibleWords = 0;
let maximumCalculationLines = 0;
const qlCounts = new Map<MalCp004PermanentQlId, number>();
const reviewRows: MalCp004ClutterFreeQuestion[] = [];

for (const allocation of MAL_CP004_PERMANENT_ALLOCATION) {
  qlCounts.set(allocation.qlId, 0);
  for (let index = 0; index < seedsPerQl; index += 1) {
    const seed = `mal-cp004-clutter-free-v2:${allocation.qlId}:${index}`;
    const v1 = runMalCp004EnglishReleasePipeline({
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    });
    const first = runMalCp004EnglishClutterFreeV2Pipeline({
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    });
    const second = runMalCp004EnglishClutterFreeV2Pipeline({
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    });

    assert(
      malCp004ClutterFreeStable(first) === malCp004ClutterFreeStable(second),
      `${allocation.qlId}/${seed}: V2 generation is not deterministic.`,
    );
    deterministicCount += 1;
    assertV1V2Parity(v1, first);
    parityCount += 1;
    assertClutterFreeSurface(first);

    const studio = runMal001QuestionStudioPipeline("MAL-CP-004", {
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    });
    assert(
      studio.runtimeId === MAL_CP004_CLUTTER_FREE_RUNTIME_ID &&
        studio.permanentQlId === allocation.qlId,
      `${allocation.qlId}/${seed}: Question Studio did not route through V2.`,
    );
    questionStudioRouteCount += 1;

    hiddenDistractorCount +=
      first.explanation.optionalHelp.whyOtherOptionsAreWrong.length;
    if (Object.hasOwn(first.explanation, "examSpeedShortcut")) {
      forcedFastMethodCount += 1;
    }
    if (Object.hasOwn(first.explanation.optionalHelp, "verification")) {
      optionalVerificationCount += 1;
    } else {
      defaultVerificationCount += 1;
    }
    maximumVisibleWords = Math.max(
      maximumVisibleWords,
      words(first.explanation.visibleLines.join(" ")),
    );
    maximumCalculationLines = Math.max(
      maximumCalculationLines,
      first.explanation.calculation.length,
    );
    generatedCount += 1;
    qlCounts.set(allocation.qlId, (qlCounts.get(allocation.qlId) ?? 0) + 1);

    if (index < reviewRowsPerQl) reviewRows.push(first);
  }
}

assert(generatedCount === 2_000, `Expected 2,000 V2 questions, received ${generatedCount}.`);
assert(deterministicCount === 2_000, "Deterministic coverage is incomplete.");
assert(parityCount === 2_000, "V1/V2 parity coverage is incomplete.");
assert(
  hiddenDistractorCount === 6_000,
  `Expected 6,000 hidden distractor analyses, received ${hiddenDistractorCount}.`,
);
assert(
  questionStudioRouteCount === 2_000,
  "Question Studio V2 routing coverage is incomplete.",
);
assert(forcedFastMethodCount === 0, "One or more V2 questions still force a Fast Method.");
assert(
  optionalVerificationCount === 400 && defaultVerificationCount === 1_600,
  `Unexpected optional verification split: ${optionalVerificationCount}/${defaultVerificationCount}.`,
);
assert(reviewRows.length === 100, `Expected 100 review rows, received ${reviewRows.length}.`);
assert(
  [...qlCounts.values()].every((count) => count === seedsPerQl),
  `One or more permanent QLs are under-tested: ${stable([...qlCounts.entries()])}.`,
);

const outputDir = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDir, { recursive: true });

const reviewJson = {
  releaseId: MAL_CP004_ENGLISH_RELEASE_V2.releaseId,
  runtimeId: MAL_CP004_CLUTTER_FREE_RUNTIME_ID,
  presentationId: MAL_CP004_CLUTTER_FREE_PRESENTATION_ID,
  permanentQlRange: MAL_CP004_ENGLISH_RELEASE_V2.qlRange,
  questionCount: reviewRows.length,
  reviewRows,
};
writeFileSync(
  resolve(outputDir, "mal-cp004-clutter-free-v2-review.json"),
  `${stable(reviewJson)}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-CP-004 Clutter-Free English V2 — Human Review",
  "",
  `Release candidate: \`${MAL_CP004_ENGLISH_RELEASE_V2.releaseId}\``,
  "",
  "The stem, options, answer and mathematics are inherited unchanged from the frozen V1 release. Review only the simplified learner-facing explanation.",
  "",
];
for (const [index, question] of reviewRows.entries()) {
  markdown.push(
    `## ${index + 1}. ${question.permanentQlId}`,
    "",
    question.stem,
    "",
    ...question.options.map(
      (option, optionIndex) =>
        `${String.fromCharCode(65 + optionIndex)}. ${option}`,
    ),
    "",
    `**Correct answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
    "",
    "### Method",
    "",
    question.explanation.method,
    "",
    "### Calculation",
    "",
    ...question.explanation.calculation.map((line) => `- ${line}`),
    "",
    "### Answer",
    "",
    question.explanation.answer,
    "",
    "<details>",
    "<summary>More help — collapsed in the product</summary>",
    "",
  );
  if (question.explanation.optionalHelp.verification) {
    markdown.push(
      "**Verification**",
      "",
      question.explanation.optionalHelp.verification,
      "",
    );
  }
  markdown.push("**Why the other options are wrong**", "");
  for (const trap of question.explanation.optionalHelp.whyOtherOptionsAreWrong) {
    markdown.push(
      `- **${trap.optionLetter}. ${trap.displayedValue}:** ${trap.misconceptionLabel}. ${trap.wrongCalculation} ${trap.correction}`,
    );
  }
  markdown.push("", "</details>", "", "---", "");
}
writeFileSync(
  resolve(outputDir, "MAL-CP-004-CLUTTER-FREE-V2-100Q-REVIEW.md"),
  `${markdown.join("\n")}\n`,
  "utf8",
);

console.log("PASS_MAL_CP004_CLUTTER_FREE_V2");
console.log(
  stable({
    generatedCount,
    deterministicCount,
    parityCount,
    hiddenDistractorCount,
    questionStudioRouteCount,
    forcedFastMethodCount,
    optionalVerificationCount,
    defaultVerificationCount,
    reviewQuestionCount: reviewRows.length,
    maximumVisibleWords,
    maximumCalculationLines,
    qlCounts: [...qlCounts.entries()],
  }),
);
