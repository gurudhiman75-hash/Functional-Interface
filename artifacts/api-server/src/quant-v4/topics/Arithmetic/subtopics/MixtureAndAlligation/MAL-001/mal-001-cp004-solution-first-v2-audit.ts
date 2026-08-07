import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MAL_CP004_CLUTTER_FREE_PRESENTATION_ID,
  MAL_CP004_CLUTTER_FREE_PRESENTATION_RUNTIME_ID,
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
import { compareRational, equalsRational, rational } from "./foundation/rational";
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

function wordCount(value: string): number {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

function assertMathematicalParity(
  v1: MalCp004ReleasedQuestion,
  v2: MalCp004ClutterFreeQuestion,
): void {
  const prefix = `${v2.permanentQlId}/${v2.seed}`;
  assert(v2.answer === v1.answer, `${prefix}: answer text changed.`);
  assert(stable(v2.answerValue) === stable(v1.answerValue), `${prefix}: exact answer changed.`);
  assert(stable(v2.exactState) === stable(v1.exactState), `${prefix}: exact state changed.`);
  assert(
    v2.mathematicalFingerprint === v1.mathematicalFingerprint,
    `${prefix}: mathematical fingerprint changed.`,
  );
  assert(stable(v2.sourceEvidenceIds) === stable(v1.sourceEvidenceIds), `${prefix}: evidence changed.`);
  assert(v2.permanentQlId === v1.permanentQlId, `${prefix}: QL changed.`);
  assert(v2.questionLanguageId === v1.questionLanguageId, `${prefix}: language QL changed.`);
  assert(v2.difficulty === v1.difficulty, `${prefix}: difficulty changed.`);
  assert(v2.taskDirection === v1.taskDirection, `${prefix}: task direction changed.`);
  assert(v2.answerSemantic === v1.answerSemantic, `${prefix}: answer semantic changed.`);
  assert(
    v2.active === v1.active &&
      v2.questionStudioDiscoverable === v1.questionStudioDiscoverable &&
      v2.questionBankWritable === v1.questionBankWritable &&
      v2.testEligible === v1.testEligible &&
      v2.publiclyPublishable === v1.publiclyPublishable,
    `${prefix}: release lifecycle changed.`,
  );
}

function assertEditorialSurface(question: MalCp004ClutterFreeQuestion): void {
  const prefix = `${question.permanentQlId}/${question.seed}`;
  const explanation = question.explanation;

  assert(/^(?:[A-Z]|\d)/u.test(question.stem), `${prefix}: stem starts with lowercase text.`);
  assert(question.stem.endsWith("?"), `${prefix}: stem is not interrogative.`);
  const forbiddenStemPatterns = [
    /^chemical A\b/u,
    /\bcomplete solution\b/iu,
    /Only the water quantity changes/iu,
    /\bstrength\b/iu,
    /For a stored solution, a solution/iu,
    /final dried .+ weighs/iu,
    /how much fresh .+ was/iu,
    /During food processing[^?]*timber/iu,
    /\bcalculate the new\b/iu,
  ];
  for (const pattern of forbiddenStemPatterns) {
    assert(!pattern.test(question.stem), `${prefix}: weak stem pattern remains: ${pattern}.`);
  }

  assert(question.options.length === 4, `${prefix}: not four options.`);
  assert(new Set(question.options).size === 4, `${prefix}: duplicate options.`);
  assert(question.options[question.correctIndex] === question.answer, `${prefix}: answer mismatch.`);
  assert(question.optionAudit.length === 4, `${prefix}: option audit incomplete.`);
  assert(
    question.optionAudit.filter((entry) => entry.isCorrect).length === 1,
    `${prefix}: option audit lacks one correct entry.`,
  );
  for (const [index, audit] of question.optionAudit.entries()) {
    assert(audit.text === question.options[index], `${prefix}: stale option audit text.`);
    assert(audit.isCorrect === (index === question.correctIndex), `${prefix}: stale correct position.`);
    if (!audit.isCorrect) {
      assert(!equalsRational(audit.value, question.answerValue), `${prefix}: distractor equals answer.`);
      assert(audit.misconceptionId !== "correct", `${prefix}: distractor has correct label.`);
      if (question.answerUnit === "percent") {
        assert(
          compareRational(audit.value, rational(0)) > 0 &&
            compareRational(audit.value, rational(1)) < 0,
          `${prefix}: percentage distractor is outside 0-100%.`,
        );
      }
    }
  }

  assert(question.runtimeId === MAL_CP004_PERMANENT_RUNTIME_ID, `${prefix}: core runtime changed.`);
  assert(
    question.presentationRuntimeId === MAL_CP004_CLUTTER_FREE_PRESENTATION_RUNTIME_ID,
    `${prefix}: presentation runtime missing.`,
  );
  assert(
    question.traceability.presentationVersion === MAL_CP004_CLUTTER_FREE_PRESENTATION_ID,
    `${prefix}: presentation identity missing.`,
  );
  assert(
    explanation.layoutId === "MAL-CP004-EN-SOLUTION-FIRST-V2",
    `${prefix}: wrong layout.`,
  );
  assert(
    stable(explanation.sectionTitles) ===
      stable({ solution: "Solution", answer: "Answer", moreHelp: "More help" }),
    `${prefix}: unnecessary headings remain.`,
  );
  assert(
    explanation.solution.length >= 1 && explanation.solution.length <= 4,
    `${prefix}: solution is outside 1-4 lines.`,
  );
  if (["MAL-QL-038", "MAL-QL-039", "MAL-QL-040"].includes(question.permanentQlId)) {
    assert(explanation.solution.length === 1, `${prefix}: easy solution is not one line.`);
  }
  assert(
    explanation.solution.every((line) => line.includes("\\(")),
    `${prefix}: solution line has no MathJax.`,
  );
  assert(
    stable(explanation.visibleLines) === stable(explanation.lines) &&
      explanation.visibleLines.at(-1) === `Answer: ${question.answer}`,
    `${prefix}: visible explanation order is wrong.`,
  );
  assert(explanation.optionalHelp.collapsedByDefault, `${prefix}: help is expanded by default.`);
  assert(
    typeof explanation.optionalHelp.commonMistake === "string" &&
      explanation.optionalHelp.commonMistake.length > 15,
    `${prefix}: common mistake help is missing.`,
  );
  assert(
    !Object.hasOwn(explanation.optionalHelp, "whyOtherOptionsAreWrong"),
    `${prefix}: three-option analysis remains learner-facing.`,
  );
  assert(
    !Object.hasOwn(explanation, "method") &&
      !Object.hasOwn(explanation, "calculation") &&
      !Object.hasOwn(explanation, "examSpeedShortcut"),
    `${prefix}: retired explanation field remains.`,
  );

  const visibleText = explanation.visibleLines.join("\n");
  const forbiddenExplanationPatterns = [
    /10-second/iu,
    /exam shortcut/iu,
    /fast method/iu,
    /quick check/iu,
    /common traps/iu,
    /distractor analysis/iu,
    /core concept/iu,
    /step-by-step/iu,
    /solving gives/iu,
    /\d+\/\d+\/\d+/u,
  ];
  for (const pattern of forbiddenExplanationPatterns) {
    assert(!pattern.test(visibleText), `${prefix}: visible clutter remains: ${pattern}.`);
  }
  assert(wordCount(visibleText) <= 70, `${prefix}: explanation exceeds 70 visible words.`);

  const verificationExpected =
    question.permanentQlId === "MAL-QL-045" ||
    question.permanentQlId === "MAL-QL-047";
  assert(
    verificationExpected === Object.hasOwn(explanation.optionalHelp, "verification"),
    `${prefix}: verification policy is wrong.`,
  );
}

assert(MAL_CP004_ENGLISH_RELEASE_V2.releaseId === "MAL-CP004-EN-v2", "Wrong V2 release ID.");
assert(
  MAL_CP004_ENGLISH_RELEASE_V2.qlRange === "MAL-QL-038..MAL-QL-047" &&
    MAL_CP004_ENGLISH_RELEASE_V2.qlCount === 10,
  "Permanent QL allocation changed.",
);

const seedsPerQl = 200;
let generatedCount = 0;
let deterministicCount = 0;
let mathematicalParityCount = 0;
let questionStudioRouteCount = 0;
let stemRemediationCount = 0;
let optionRemediationCount = 0;
let maximumVisibleWords = 0;
let maximumSolutionLines = 0;
const qlCounts = new Map<MalCp004PermanentQlId, number>();
const candidateRows = new Map<MalCp004PermanentQlId, MalCp004ClutterFreeQuestion[]>();

for (const allocation of MAL_CP004_PERMANENT_ALLOCATION) {
  qlCounts.set(allocation.qlId, 0);
  candidateRows.set(allocation.qlId, []);
  for (let index = 0; index < seedsPerQl; index += 1) {
    const seed = `mal-cp004-solution-first-v2:${allocation.qlId}:${index}`;
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
      `${allocation.qlId}/${seed}: generation is not deterministic.`,
    );
    deterministicCount += 1;
    assertMathematicalParity(v1, first);
    mathematicalParityCount += 1;
    assertEditorialSurface(first);

    const studio = runMal001QuestionStudioPipeline("MAL-CP-004", {
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    }) as MalCp004ClutterFreeQuestion;
    assert(
      studio.permanentQlId === allocation.qlId &&
        studio.presentationRuntimeId === MAL_CP004_CLUTTER_FREE_PRESENTATION_RUNTIME_ID,
      `${allocation.qlId}/${seed}: Question Studio did not return V2.`,
    );
    questionStudioRouteCount += 1;

    if (first.stem !== v1.stem) stemRemediationCount += 1;
    if (stable(first.options) !== stable(v1.options)) optionRemediationCount += 1;
    maximumVisibleWords = Math.max(
      maximumVisibleWords,
      wordCount(first.explanation.visibleLines.join(" ")),
    );
    maximumSolutionLines = Math.max(maximumSolutionLines, first.explanation.solution.length);
    generatedCount += 1;
    qlCounts.set(allocation.qlId, (qlCounts.get(allocation.qlId) ?? 0) + 1);
    candidateRows.get(allocation.qlId)!.push(first);
  }
}

assert(generatedCount === 2_000, `Expected 2,000 questions, received ${generatedCount}.`);
assert(deterministicCount === 2_000, "Determinism coverage is incomplete.");
assert(mathematicalParityCount === 2_000, "Mathematical parity coverage is incomplete.");
assert(questionStudioRouteCount === 2_000, "Question Studio coverage is incomplete.");
assert(stemRemediationCount >= 1_000, "Too few stems were improved.");
assert(optionRemediationCount >= 1_900, "Too few option sets were improved.");
assert(
  [...qlCounts.values()].every((count) => count === seedsPerQl),
  `A QL is under-tested: ${stable([...qlCounts.entries()])}.`,
);

const reviewRows: MalCp004ClutterFreeQuestion[] = [];
const answerPositionCounts = [0, 0, 0, 0];
for (const allocation of MAL_CP004_PERMANENT_ALLOCATION) {
  const selected: MalCp004ClutterFreeQuestion[] = [];
  const usedFingerprints = new Set<string>();
  const candidates = candidateRows.get(allocation.qlId)!;

  while (selected.length < 10) {
    const positionOrder = [0, 1, 2, 3].sort(
      (left, right) => answerPositionCounts[left]! - answerPositionCounts[right]!,
    );
    let chosen: MalCp004ClutterFreeQuestion | undefined;
    for (const position of positionOrder) {
      chosen = candidates.find(
        (question) =>
          question.correctIndex === position &&
          !usedFingerprints.has(question.mathematicalFingerprint),
      );
      if (chosen) break;
    }
    assert(chosen, `${allocation.qlId}: fewer than ten distinct numerical states are available.`);
    selected.push(chosen);
    usedFingerprints.add(chosen.mathematicalFingerprint);
    answerPositionCounts[chosen.correctIndex] += 1;
  }

  assert(selected.length === 10, `${allocation.qlId}: review sample is incomplete.`);
  assert(
    new Set(selected.map((question) => question.mathematicalFingerprint)).size === 10,
    `${allocation.qlId}: review sample repeats a numerical state.`,
  );
  reviewRows.push(...selected);
}

assert(reviewRows.length === 100, `Expected 100 review questions, received ${reviewRows.length}.`);
assert(
  new Set(reviewRows.map((question) => question.mathematicalFingerprint)).size === 100,
  "Review pack repeats a numerical state.",
);
const minimumPositionCount = Math.min(...answerPositionCounts);
const maximumPositionCount = Math.max(...answerPositionCounts);
assert(
  minimumPositionCount >= 23 && maximumPositionCount <= 27,
  `Review answer positions are not balanced: ${answerPositionCounts.join(", ")}.`,
);

const outputDir = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDir, { recursive: true });
const reviewJson = {
  releaseId: MAL_CP004_ENGLISH_RELEASE_V2.releaseId,
  runtimeId: MAL_CP004_PERMANENT_RUNTIME_ID,
  presentationRuntimeId: MAL_CP004_CLUTTER_FREE_PRESENTATION_RUNTIME_ID,
  presentationId: MAL_CP004_CLUTTER_FREE_PRESENTATION_ID,
  permanentQlRange: MAL_CP004_ENGLISH_RELEASE_V2.qlRange,
  questionCount: reviewRows.length,
  answerPositionCounts,
  reviewRows,
};
writeFileSync(
  resolve(outputDir, "mal-cp004-solution-first-v2-review.json"),
  `${stable(reviewJson)}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-CP-004 Solution-First English V2 — Human Review",
  "",
  `Release candidate: \`${MAL_CP004_ENGLISH_RELEASE_V2.releaseId}\``,
  "",
  "The exact mathematics, answer and permanent QL identity remain unchanged. V2 improves the stem, distractors and learner-facing solution.",
  "",
  `Answer-position distribution: A ${answerPositionCounts[0]}, B ${answerPositionCounts[1]}, C ${answerPositionCounts[2]}, D ${answerPositionCounts[3]}.`,
  "",
];
for (const [index, question] of reviewRows.entries()) {
  markdown.push(
    `## ${index + 1}. ${question.permanentQlId}`,
    "",
    question.stem,
    "",
    ...question.options.map(
      (option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`,
    ),
    "",
    `**Correct answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
    "",
    "### Solution",
    "",
    ...question.explanation.solution.map((line) => `- ${line}`),
    "",
    `**Answer:** ${question.explanation.answer}`,
    "",
    "<details>",
    "<summary>More help — collapsed in the product</summary>",
    "",
    `**Common mistake:** ${question.explanation.optionalHelp.commonMistake}`,
    "",
  );
  if (question.explanation.optionalHelp.verification) {
    markdown.push("**Verification**", "", question.explanation.optionalHelp.verification, "");
  }
  markdown.push("</details>", "", "---", "");
}
writeFileSync(
  resolve(outputDir, "MAL-CP-004-SOLUTION-FIRST-V2-100Q-REVIEW.md"),
  `${markdown.join("\n")}\n`,
  "utf8",
);

const summary = {
  generatedCount,
  deterministicCount,
  mathematicalParityCount,
  questionStudioRouteCount,
  stemRemediationCount,
  optionRemediationCount,
  forcedFastMethodCount: 0,
  learnerFacingOptionAnalysisCount: 0,
  reviewQuestionCount: reviewRows.length,
  uniqueReviewStateCount: new Set(
    reviewRows.map((question) => question.mathematicalFingerprint),
  ).size,
  answerPositionCounts,
  maximumVisibleWords,
  maximumSolutionLines,
  qlCounts: [...qlCounts.entries()],
};
console.log("PASS_MAL_CP004_SOLUTION_FIRST_V2");
console.log(JSON.stringify(summary));
