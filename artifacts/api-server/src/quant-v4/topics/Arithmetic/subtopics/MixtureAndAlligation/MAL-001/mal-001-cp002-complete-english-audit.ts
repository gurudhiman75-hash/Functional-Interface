import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateQuestion as generateQuestionStudioQuestion } from "../../../../../question-studio-generation-engine";
import {
  addRational,
  equalsRational,
  formatRational,
  multiplyRational,
  rational,
  rationalKey,
  reduceRationalRatio,
} from "./foundation/rational";
import {
  applyMalCp002PureAdjustment,
  applyMalCp002SingleReplacement,
} from "./foundation/cp002-solver";
import { verifyMalCp002Result } from "./foundation/cp002-independent-verifier";
import {
  MAL_CP002_ENGLISH_RELEASE,
  MAL_CP002_PERMANENT_ALLOCATION,
  MAL_CP002_PERMANENT_QL_IDS,
  MAL_CP002_RATIO_VISUAL_DIRECTIVE,
  runMalCp002EnglishReleasePipeline,
  type MalCp002PermanentQlId,
  type MalCp002ReleasedQuestion,
} from "./foundation/cp002-permanent-runtime";
import { runMalCp001EnglishReleasePipeline } from "./foundation/cp001-release";
import type {
  MalCp002Ratio,
  MalCp002State,
} from "./foundation/cp002-types";
import type { Rational } from "./foundation/types";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? `${item}n` : item,
  );
}

function sameRational(first: Rational, second: Rational): boolean {
  return equalsRational(first, second);
}

function sameState(first: MalCp002State, second: MalCp002State): boolean {
  return (
    sameRational(first.componentA, second.componentA) &&
    sameRational(first.componentB, second.componentB)
  );
}

function sameRatio(first: MalCp002Ratio, second: MalCp002Ratio): boolean {
  return equalsRational(
    multiplyRational(first.componentAPart, second.componentBPart),
    multiplyRational(first.componentBPart, second.componentAPart),
  );
}

function ratioFromState(state: MalCp002State): MalCp002Ratio {
  const [componentAPart, componentBPart] = reduceRationalRatio(
    state.componentA,
    state.componentB,
  );
  return { componentAPart, componentBPart };
}

function ratioFromArray(values: readonly Rational[]): readonly Rational[] {
  assert(values.length === 3, "Three-component ratio needs three values.");
  const common = values.reduce((current, value) => {
    const a = current.numerator < 0n ? -current.numerator : current.numerator;
    const b = value.numerator < 0n ? -value.numerator : value.numerator;
    let x = a;
    let y = b;
    while (y !== 0n) {
      const remainder = x % y;
      x = y;
      y = remainder;
    }
    return rational(x === 0n ? 1n : x);
  }, values[0]!);
  return values.map((value) => rational(value.numerator / common.numerator));
}

function verifyCustomQuestion(question: MalCp002ReleasedQuestion): void {
  const parameters = question.parameters as any;
  const solution = question.solution as any;

  switch (question.permanentQlId) {
    case "MAL-QL-020":
    case "MAL-QL-021": {
      const initialState = solution.initialState as MalCp002State;
      assert(
        sameRational(
          addRational(initialState.componentA, initialState.componentB),
          parameters.initialTotal,
        ),
        `${question.questionId}: reconstructed state does not match initial total.`,
      );
      assert(
        sameRatio(ratioFromState(initialState), parameters.initialRatio),
        `${question.questionId}: reconstructed state does not match initial ratio.`,
      );
      const replayed = applyMalCp002PureAdjustment(
        initialState,
        parameters.changedComponent,
        parameters.adjustmentKind,
        solution.quantity,
      );
      assert(
        sameState(replayed, solution.finalState),
        `${question.questionId}: total-ratio adjustment replay mismatch.`,
      );
      assert(
        sameRatio(ratioFromState(replayed), parameters.targetRatio),
        `${question.questionId}: total-ratio adjustment misses target ratio.`,
      );
      break;
    }

    case "MAL-QL-022": {
      const fullState = solution.fullState as MalCp002State;
      assert(
        sameRatio(ratioFromState(fullState), parameters.ratio),
        `${question.questionId}: one-component reconstruction ratio mismatch.`,
      );
      const known =
        parameters.knownComponent === "A"
          ? fullState.componentA
          : fullState.componentB;
      const other =
        parameters.knownComponent === "A"
          ? fullState.componentB
          : fullState.componentA;
      assert(
        sameRational(known, parameters.knownQuantity),
        `${question.questionId}: known component was not preserved.`,
      );
      assert(
        sameRational(other, solution.otherQuantity),
        `${question.questionId}: other component answer mismatch.`,
      );
      break;
    }

    case "MAL-QL-023":
    case "MAL-QL-024": {
      const originalState = solution.originalState as MalCp002State;
      assert(
        sameRatio(ratioFromState(originalState), parameters.initialRatio),
        `${question.questionId}: original ratio reconstruction mismatch.`,
      );
      assert(
        sameRational(
          addRational(originalState.componentA, originalState.componentB),
          solution.originalTotal,
        ),
        `${question.questionId}: original total mismatch.`,
      );
      const replayed = applyMalCp002PureAdjustment(
        originalState,
        parameters.changedComponent,
        parameters.adjustmentKind,
        parameters.adjustmentQuantity,
      );
      assert(
        sameState(replayed, solution.finalState),
        `${question.questionId}: ratio-shift operation replay mismatch.`,
      );
      assert(
        sameRatio(ratioFromState(replayed), parameters.finalRatio),
        `${question.questionId}: ratio-shift final ratio mismatch.`,
      );
      break;
    }

    case "MAL-QL-025": {
      const replayed = applyMalCp002SingleReplacement(
        parameters.initialState,
        parameters.replacementComponent,
        parameters.removedQuantity,
      );
      assert(
        sameState(replayed, solution.finalState),
        `${question.questionId}: forward single replacement replay mismatch.`,
      );
      assert(
        sameRatio(ratioFromState(replayed), solution.finalRatio),
        `${question.questionId}: forward replacement ratio mismatch.`,
      );
      break;
    }

    case "MAL-QL-026": {
      assert(
        sameRatio(solution.finalRatio, parameters.initialRatio),
        `${question.questionId}: homogeneous removal changed the ratio.`,
      );
      assert(
        sameRatio(ratioFromState(solution.finalState), parameters.initialRatio),
        `${question.questionId}: homogeneous-removal final state ratio mismatch.`,
      );
      break;
    }

    case "MAL-QL-027": {
      const replayed = applyMalCp002PureAdjustment(
        parameters.initialState,
        solution.changedComponent,
        solution.adjustmentKind,
        solution.quantity,
      );
      assert(
        sameState(replayed, solution.finalState),
        `${question.questionId}: selected operation replay mismatch.`,
      );
      assert(
        sameRatio(ratioFromState(replayed), parameters.targetRatio),
        `${question.questionId}: selected operation misses target ratio.`,
      );
      break;
    }

    case "MAL-QL-028": {
      const initial = solution.initialQuantities as Rational[];
      const final = solution.finalQuantities as Rational[];
      assert(initial.length === 3 && final.length === 3, "Three-component state is incomplete.");
      assert(
        sameRational(addRational(initial[0]!, parameters.additionA), final[0]!),
        `${question.questionId}: first addition mismatch.`,
      );
      assert(
        sameRational(addRational(initial[1]!, parameters.additionB), final[1]!),
        `${question.questionId}: second addition mismatch.`,
      );
      assert(
        sameRational(initial[2]!, final[2]!),
        `${question.questionId}: third component was not conserved.`,
      );
      assert(
        sameRational(final[2]!, solution.requestedQuantity),
        `${question.questionId}: requested third-component quantity mismatch.`,
      );
      const finalRatio = ratioFromArray(final).map(formatRational).join(":");
      const expectedRatio = (parameters.finalRatio as number[])
        .map(String)
        .join(":");
      const expectedReduced = ratioFromArray(
        (parameters.finalRatio as number[]).map((value) => rational(value)),
      )
        .map(formatRational)
        .join(":");
      assert(
        finalRatio === expectedReduced,
        `${question.questionId}: three-component final ratio ${finalRatio}/${expectedRatio} mismatch.`,
      );
      break;
    }

    default:
      fail(`No custom verifier for ${question.permanentQlId}.`);
  }
}

function verifyQuestion(question: MalCp002ReleasedQuestion): void {
  assert(question.canonicalProblemId === "MAL-CP-002", "Wrong CP identity.");
  assert(question.packageId === "MAL-001", "Wrong package identity.");
  assert(question.language === "en", "Non-English question escaped release.");
  assert(question.maturity === "FROZEN", "Question is not frozen.");
  assert(question.active, "Question is not active.");
  assert(question.publiclyPublishable, "Question is not publishable.");
  assert(question.questionStudioDiscoverable, "Question Studio gate is false.");
  assert(question.questionBankWritable, "Question Bank gate is false.");
  assert(question.testEligible, "Test eligibility gate is false.");
  assert(question.options.length === 4, "Question does not have four options.");
  assert(new Set(question.options).size === 4, "Question options are not unique.");
  assert(
    question.options[question.correctIndex] === question.answer,
    "Correct option does not match canonical answer.",
  );
  assert(question.validation.ok && question.validation.valid, "Release validation failed.");
  assert(question.validation.errors.length === 0, "Release contains validation errors.");
  assert(question.stem.endsWith("?"), "Stem is not interrogative.");
  assert(!/\b(undefined|null|NaN)\b/u.test(question.stem), "Stem contains invalid placeholder text.");
  assert(
    !/alligation/iu.test(
      [
        question.explanation.coreConcept,
        question.explanation.formula,
        ...question.explanation.steps,
      ].join("\n"),
    ),
    "Formula-first solution contains alligation language.",
  );
  assert(question.explanation.steps.length >= 3, "Explanation has too few worked steps.");
  assert(
    question.explanation.lines.some((line) =>
      line.includes(MAL_CP002_RATIO_VISUAL_DIRECTIVE),
    ),
    "Structured ratio-adjustment SVG directive is absent.",
  );
  assert(question.diagram.version === 1, "Ratio visual version mismatch.");
  assert(
    question.diagram.before.length === question.diagram.after.length,
    "Ratio visual before/after cardinality mismatch.",
  );
  assert(
    question.reasoningGraph.nodes.at(-1)?.kind === "CONCLUSION",
    "Reasoning graph does not end in a conclusion.",
  );
  assert(
    question.explanation.conclusion.includes(question.answer),
    "Conclusion omits canonical answer.",
  );
  assert(
    !question.options.some((option) => /\(\d+\)$/u.test(option)),
    "Fallback option suffix leaked into learner options.",
  );

  if (question.permanentQlId <= "MAL-QL-019") {
    const parameters = question.parameters as any;
    const verification = verifyMalCp002Result(
      parameters.request,
      question.solution as any,
    );
    assert(
      verification.ok,
      `${question.questionId}: existing independent verifier failed: ${verification.errors.join("; ")}`,
    );
  } else {
    verifyCustomQuestion(question);
  }
}

assert(MAL_CP002_PERMANENT_ALLOCATION.length === 17, "Expected 17 evidence-derived CP-002 QLs.");
assert(MAL_CP002_PERMANENT_QL_IDS[0] === "MAL-QL-012", "Unexpected first CP-002 QL.");
assert(MAL_CP002_PERMANENT_QL_IDS.at(-1) === "MAL-QL-028", "Unexpected final CP-002 QL.");
assert(MAL_CP002_ENGLISH_RELEASE.qlCount === 17, "Release QL count mismatch.");
assert(MAL_CP002_ENGLISH_RELEASE.reviewQuestionCount === 68, "Review count mismatch.");

let generatedQuestionCount = 0;
let deterministicReplayCount = 0;
let independentVerificationCount = 0;
const stemSet = new Set<string>();
const explanationSet = new Set<string>();
const contextCounts = new Map<string, number>();
const answerPositionCounts = [0, 0, 0, 0];
const reviewRows: Array<{
  reviewKey: string;
  qlId: MalCp002PermanentQlId;
  familyId: string;
  reviewStatus: string;
  question: MalCp002ReleasedQuestion;
}> = [];

for (const allocation of MAL_CP002_PERMANENT_ALLOCATION) {
  for (let index = 0; index < 100; index += 1) {
    const seed = `complete-english-${allocation.qlId}-${index}`;
    const question = runMalCp002EnglishReleasePipeline({
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    });
    const replay = runMalCp002EnglishReleasePipeline({
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    });
    assert(
      stable(question) === stable(replay),
      `${allocation.qlId}/${seed}: generation is not deterministic.`,
    );
    deterministicReplayCount += 1;
    verifyQuestion(question);
    independentVerificationCount += 1;
    assert(question.difficulty === allocation.difficulty, "Difficulty allocation mismatch.");
    assert(question.answerSemantic === allocation.answerSemantic, "Answer semantic mismatch.");
    assert(question.taskDirection === allocation.taskDirection, "Task direction mismatch.");
    generatedQuestionCount += 1;
    stemSet.add(question.stem);
    explanationSet.add(stable(question.explanation));
    answerPositionCounts[question.correctIndex] += 1;
    const contextId = String((question.parameters as any).contextId ?? (question as any).context?.contextId ?? "source-prototype");
    contextCounts.set(contextId, (contextCounts.get(contextId) ?? 0) + 1);
    if (index < 4) {
      reviewRows.push({
        reviewKey: `${allocation.qlId}:review-${index + 1}`,
        qlId: allocation.qlId,
        familyId: allocation.familyId,
        reviewStatus: "APPROVED_UNDER_COMPLETION_DIRECTIVE",
        question,
      });
    }
  }
}

assert(generatedQuestionCount === 1700, "Expected 1,700 release packages.");
assert(reviewRows.length === 68, "Expected 68 review rows.");
assert(stemSet.size >= 1500, `Stem diversity too low: ${stemSet.size}.`);
assert(explanationSet.size >= 1500, `Explanation diversity too low: ${explanationSet.size}.`);
assert(answerPositionCounts.every((count) => count > 250), "All answer positions are not adequately covered.");

const milkWaterCount = [...contextCounts.entries()]
  .filter(([key]) => key.includes("MILK-WATER"))
  .reduce((sum, [, count]) => sum + count, 0);
assert(
  milkWaterCount / generatedQuestionCount < 0.22,
  "Milk-water context cap was exceeded.",
);

let questionStudioPreviewCount = 0;
for (const allocation of MAL_CP002_PERMANENT_ALLOCATION) {
  const result: any = await generateQuestionStudioQuestion({
    packageId: "MAL-001",
    canonicalProblemId: "MAL-CP-002",
    questionLanguageId: allocation.qlId,
    difficulty: allocation.difficulty,
    language: "en",
    count: 2,
    seed: `question-studio-${allocation.qlId}`,
  });
  assert(result.questionPackages.length === 2, "Question Studio package batch mismatch.");
  assert(result.questions.length === 2, "Question Studio preview batch mismatch.");
  for (const preview of result.questions) {
    assert(preview.canonicalProblemId === "MAL-CP-002", "Question Studio CP mismatch.");
    assert(preview.questionLanguageId === allocation.qlId, "Question Studio QL mismatch.");
    assert(preview.publiclyPublishable === true, "Question Studio preview is not publishable.");
    assert(preview.questionBankStatus === "WRITABLE", "Question Studio preview is not writable.");
    assert(preview.testEligibility === "ELIGIBLE", "Question Studio preview is not test eligible.");
    assert(
      preview.explanation.includes(MAL_CP002_RATIO_VISUAL_DIRECTIVE),
      "Question Studio explanation lost the ratio SVG directive.",
    );
    questionStudioPreviewCount += 1;
  }
}

let unsupportedLanguageRejected = false;
try {
  await generateQuestionStudioQuestion({
    packageId: "MAL-001",
    canonicalProblemId: "MAL-CP-002",
    language: "hi",
    count: 1,
  });
} catch {
  unsupportedLanguageRejected = true;
}
assert(unsupportedLanguageRejected, "Question Studio accepted unsupported Hindi.");

let unknownQlRejected = false;
try {
  await generateQuestionStudioQuestion({
    packageId: "MAL-001",
    canonicalProblemId: "MAL-CP-002",
    questionLanguageId: "MAL-QL-999",
    language: "en",
    count: 1,
  });
} catch {
  unknownQlRejected = true;
}
assert(unknownQlRejected, "Question Studio accepted an unknown CP-002 QL.");

const cp001Regression = runMalCp001EnglishReleasePipeline({
  questionLanguageId: "MAL-QL-001",
  seed: "cp002-completion-cp001-regression",
  language: "en",
});
assert(cp001Regression.canonicalProblemId === "MAL-CP-001", "CP-001 routing regressed.");
assert(cp001Regression.validation.ok, "CP-001 release regression failed.");

const review = {
  status: "MAL_CP002_ENGLISH_COMPLETION_APPROVED",
  release: MAL_CP002_ENGLISH_RELEASE,
  permanentQlRange: "MAL-QL-012..MAL-QL-028",
  reviewQuestionCount: reviewRows.length,
  reviewMethod: MAL_CP002_ENGLISH_RELEASE.reviewMethod,
  reviewNote: MAL_CP002_ENGLISH_RELEASE.approvalNote,
  rows: reviewRows,
};

const outputDir = resolve(
  process.cwd(),
  "dist/quant-v4",
);
mkdirSync(outputDir, { recursive: true });
const jsonPath = resolve(outputDir, "mal-cp002-complete-english-review.json");
const markdownPath = resolve(outputDir, "mal-cp002-complete-english-review.md");
writeFileSync(
  jsonPath,
  `${JSON.stringify(review, (_key, value) =>
    typeof value === "bigint" ? value.toString() : value, 2)}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-CP-002 Complete English Review",
  "",
  `Release: \`${MAL_CP002_ENGLISH_RELEASE.releaseId}\``,
  `Permanent QLs: \`${MAL_CP002_ENGLISH_RELEASE.qlRange}\``,
  `Review questions: **${reviewRows.length}**`,
  "",
  "> Approval is based on the executable corpus audit and the product-owner completion directive. It does not claim separate row-by-row product-owner review.",
  "",
];
for (const row of reviewRows) {
  const question = row.question;
  markdown.push(
    `## ${row.reviewKey} — ${row.familyId}`,
    "",
    question.stem,
    "",
    ...question.options.map(
      (option, index) =>
        `${String.fromCharCode(65 + index)}. ${option}${index === question.correctIndex ? " **✓**" : ""}`,
    ),
    "",
    `**Answer:** ${question.answer}`,
    "",
    question.explanation.sectionTitles.coreConcept,
    "",
    question.explanation.coreConcept,
    "",
    `**Formula:** ${question.explanation.formula}`,
    "",
    question.explanation.sectionTitles.steps,
    "",
    ...question.explanation.steps,
    "",
    `**Quick check:** ${question.explanation.verification}`,
    "",
    question.explanation.sectionTitles.shortcut,
    "",
    question.explanation.examShortcut,
    "",
    question.explanation.sectionTitles.trap,
    "",
    question.explanation.commonTrap,
    "",
    "---",
    "",
  );
}
mkdirSync(dirname(markdownPath), { recursive: true });
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP002_COMPLETE_ENGLISH_RELEASE",
      releaseId: MAL_CP002_ENGLISH_RELEASE.releaseId,
      permanentQlCount: MAL_CP002_PERMANENT_ALLOCATION.length,
      permanentQlRange: MAL_CP002_ENGLISH_RELEASE.qlRange,
      generatedQuestionCount,
      deterministicReplayCount,
      independentVerificationCount,
      distinctStemCount: stemSet.size,
      distinctExplanationCount: explanationSet.size,
      answerPositionCounts,
      contextCount: contextCounts.size,
      milkWaterCount,
      reviewQuestionCount: reviewRows.length,
      questionStudioPreviewCount,
      unsupportedLanguageRejected,
      unknownQlRejected,
      cp001Regression: true,
      questionStudioDiscoverable: true,
      questionBankWritable: true,
      testEligible: true,
      publiclyPublishable: true,
      excludedLanguages: MAL_CP002_ENGLISH_RELEASE.excludedLanguages,
      reviewJson: jsonPath,
      reviewMarkdown: markdownPath,
    },
    null,
    2,
  ),
);
