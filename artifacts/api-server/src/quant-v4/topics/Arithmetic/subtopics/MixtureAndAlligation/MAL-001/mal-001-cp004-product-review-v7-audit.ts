import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { MAL_CP004_PRODUCT_REVIEW_RUNTIME_V4 } from "./foundation/cp004-product-review-runtime-v4";
import { MAL_CP004_PRODUCT_REVIEW_RUNTIME_V5 } from "./foundation/cp004-product-review-runtime-v5";
import { MAL_CP004_PRODUCT_REVIEW_RUNTIME_V6 } from "./foundation/cp004-product-review-runtime-v6";
import {
  MAL_CP004_PRODUCT_REVIEW_RUNTIME_V7,
  malCp004ProductReviewV7Stable,
  runMalCp004EnglishProductReviewV7Pipeline,
} from "./foundation/cp004-product-review-runtime-v7";
import {
  MAL_CP004_PRODUCT_REVIEW_CANDIDATE,
  type MalCp004ProductReviewQuestion,
} from "./foundation/cp004-product-review-remediation-v3";
import {
  MAL_CP004_PERMANENT_ALLOCATION,
  runMalCp004EnglishReleasePipeline,
  type MalCp004PermanentQlId,
} from "./foundation/cp004-permanent-runtime";
import { compareRational, equalsRational, rational } from "./foundation/rational";
import { runMal001QuestionStudioPipeline } from "./question-studio-adapter";

function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) =>
    typeof entry === "bigint" ? `${entry}n` : entry,
  );
}

function validate(question: MalCp004ProductReviewQuestion): void {
  const id = `${question.permanentQlId}/${question.parameters.requestedSeed}`;
  assert(
    question.releaseStatus === "PRESENTATION_CANDIDATE" &&
      question.runtimeMode === "REVIEW_ONLY" &&
      question.reviewStatus === "PENDING_PRODUCT_REVIEW",
    `${id}: presentation lifecycle is dishonest.`,
  );
  assert(
    !question.active &&
      !question.publiclyPublishable &&
      !question.questionBankWritable &&
      !question.testEligible,
    `${id}: candidate claims a delivery permission.`,
  );
  assert(question.questionStudioDiscoverable, `${id}: review preview unavailable.`);
  assert(question.options.length === 4, `${id}: not four options.`);
  assert(new Set(question.options).size === 4, `${id}: duplicate options.`);
  assert(
    question.options[question.correctIndex] === question.answer,
    `${id}: answer-position mismatch.`,
  );
  assert(
    question.optionAudit.filter((entry) => entry.isCorrect).length === 1,
    `${id}: option audit does not contain one correct entry.`,
  );
  for (const option of question.optionAudit) {
    if (option.isCorrect) continue;
    assert(!equalsRational(option.value, question.answerValue), `${id}: equivalent option.`);
    assert(
      !/(?:arithmetic|offset|ten_percent_of_total)/iu.test(option.misconceptionId),
      `${id}: arbitrary distractor ${option.misconceptionId}.`,
    );
  }

  if (question.permanentQlId === "MAL-QL-038") {
    assert(question.answerValue.denominator === 1n, `${id}: fractional Easy answer.`);
    const wrong = question.optionAudit.filter((entry) => !entry.isCorrect);
    assert(
      wrong.every((entry) => compareRational(entry.value, rational(1)) >= 0),
      `${id}: tiny sub-litre distractor remains.`,
    );
    assert(
      wrong.every((entry) => entry.misconceptionId !== "divided_by_100_twice"),
      `${id}: double-division distractor remains.`,
    );
  }

  if (question.permanentQlId === "MAL-QL-039") {
    assert(
      question.optionAudit.every(
        (entry) => entry.misconceptionId !== "added_component_twice_to_total",
      ),
      `${id}: awkward inflated-denominator distractor remains.`,
    );
  }

  const alternative = question.explanation.optionalHelp.alternativeMethod;
  const applies = ["MAL-QL-041", "MAL-QL-042"].includes(question.permanentQlId);
  assert(applies === Boolean(alternative), `${id}: alligation scope changed.`);
  if (alternative) {
    assert(
      alternative.visualDirective.startsWith("[[EXAMTREE_ALLIGATION_SVG_V1:"),
      `${id}: shared responsive visual missing.`,
    );
    assert(alternative.renderLines[0] === alternative.visualDirective, `${id}: visual is not first.`);
  }
}

assert(
  MAL_CP004_PRODUCT_REVIEW_CANDIDATE.presentationReviewStatus ===
    "PENDING_PRODUCT_REVIEW",
  "Candidate falsely claims approval.",
);

const rowsByQl = new Map<MalCp004PermanentQlId, MalCp004ProductReviewQuestion[]>();
let generated = 0;
let deterministic = 0;
let sourceParity = 0;
let studioParity = 0;
let wrongOptions = 0;
let integralQl038 = 0;
let ql038Reselections = 0;
let svgCrosses = 0;
let v4Questions = 0;
let v5Questions = 0;
let v6Questions = 0;
let v7Questions = 0;

for (const allocation of MAL_CP004_PERMANENT_ALLOCATION) {
  const rows: MalCp004ProductReviewQuestion[] = [];
  rowsByQl.set(allocation.qlId, rows);
  for (let index = 0; index < 200; index += 1) {
    const seed = `mal-cp004-product-review-v7:${allocation.qlId}:${index}`;
    const first = runMalCp004EnglishProductReviewV7Pipeline({
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    });
    const second = runMalCp004EnglishProductReviewV7Pipeline({
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    });
    assert(
      malCp004ProductReviewV7Stable(first) ===
        malCp004ProductReviewV7Stable(second),
      `${allocation.qlId}/${seed}: nondeterministic.`,
    );
    deterministic += 1;
    validate(first);

    const source = runMalCp004EnglishReleasePipeline({
      questionLanguageId: allocation.qlId,
      seed: first.parameters.selectedSeed,
      language: "en",
    });
    assert(
      stable(first.exactState) === stable(source.exactState) &&
        first.answer === source.answer &&
        stable(first.answerValue) === stable(source.answerValue) &&
        first.mathematicalFingerprint === source.mathematicalFingerprint,
      `${allocation.qlId}/${seed}: V1 mathematical parity failed.`,
    );
    sourceParity += 1;

    const studio = runMal001QuestionStudioPipeline("MAL-CP-004", {
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    }) as MalCp004ProductReviewQuestion;
    assert(
      malCp004ProductReviewV7Stable(studio) ===
        malCp004ProductReviewV7Stable(first),
      `${allocation.qlId}/${seed}: Question Studio parity failed.`,
    );
    studioParity += 1;

    wrongOptions += first.optionAudit.filter((entry) => !entry.isCorrect).length;
    if (first.permanentQlId === "MAL-QL-038") {
      integralQl038 += 1;
      if (first.parameters.valueQualitySelectionAttempt > 0) ql038Reselections += 1;
    }
    if (first.explanation.optionalHelp.alternativeMethod) svgCrosses += 1;
    const runtimeId = (first.parameters as Record<string, unknown>).productReviewRuntimeId;
    if (runtimeId === MAL_CP004_PRODUCT_REVIEW_RUNTIME_V4) v4Questions += 1;
    if (runtimeId === MAL_CP004_PRODUCT_REVIEW_RUNTIME_V5) v5Questions += 1;
    if (runtimeId === MAL_CP004_PRODUCT_REVIEW_RUNTIME_V6) v6Questions += 1;
    if (runtimeId === MAL_CP004_PRODUCT_REVIEW_RUNTIME_V7) v7Questions += 1;
    rows.push(first);
    generated += 1;
  }
}

assert(generated === 2_000, `Expected 2,000 questions, received ${generated}.`);
assert(deterministic === 2_000, "Determinism proof incomplete.");
assert(sourceParity === 2_000, "V1 parity proof incomplete.");
assert(studioParity === 2_000, "Question Studio parity proof incomplete.");
assert(wrongOptions === 6_000, `Expected 6,000 wrong options, received ${wrongOptions}.`);
assert(integralQl038 === 200, `Expected 200 integral QL-038 answers, received ${integralQl038}.`);
assert(svgCrosses === 400, `Expected 400 responsive crosses, received ${svgCrosses}.`);
assert(v4Questions === 400, `Expected 400 V4 questions, received ${v4Questions}.`);
assert(v5Questions === 1_000, `Expected 1,000 V5 questions, received ${v5Questions}.`);
assert(v6Questions === 200, `Expected 200 V6 questions, received ${v6Questions}.`);
assert(v7Questions === 400, `Expected 400 V7 questions, received ${v7Questions}.`);

const review: MalCp004ProductReviewQuestion[] = [];
const answerPositions = [0, 0, 0, 0];
for (const allocation of MAL_CP004_PERMANENT_ALLOCATION) {
  const used = new Set<string>();
  const rows = rowsByQl.get(allocation.qlId)!;
  while (used.size < 10) {
    const preferred = [0, 1, 2, 3].sort(
      (left, right) => answerPositions[left]! - answerPositions[right]!,
    );
    let selected: MalCp004ProductReviewQuestion | undefined;
    for (const position of preferred) {
      selected = rows.find(
        (row) =>
          row.correctIndex === position &&
          !used.has(row.mathematicalFingerprint),
      );
      if (selected) break;
    }
    assert(selected, `${allocation.qlId}: insufficient balanced review diversity.`);
    used.add(selected.mathematicalFingerprint);
    answerPositions[selected.correctIndex] += 1;
    review.push(selected);
  }
}

assert(review.length === 100, "Review pack is not 100 questions.");
assert(
  new Set(review.map((row) => row.mathematicalFingerprint)).size === 100,
  "Review pack repeats a mathematical state.",
);
assert(
  answerPositions.every((count) => count === 25),
  `Answer positions are not 25/25/25/25: ${answerPositions.join("/")}.`,
);
assert(
  review.filter((row) => row.explanation.optionalHelp.alternativeMethod).length === 20,
  "Review pack does not contain 20 responsive crosses.",
);

const outputDir = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDir, { recursive: true });
writeFileSync(
  resolve(outputDir, "mal-cp004-product-review-v7-review.json"),
  `${stable({
    candidate: MAL_CP004_PRODUCT_REVIEW_CANDIDATE,
    runtimeId: MAL_CP004_PRODUCT_REVIEW_RUNTIME_V7,
    answerPositions,
    review,
  })}\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP004_PRODUCT_REVIEW_RUNTIME_V7",
      generated,
      deterministic,
      sourceParity,
      studioParity,
      wrongOptions,
      integralQl038,
      ql038Reselections,
      svgCrosses,
      v4Questions,
      v5Questions,
      v6Questions,
      v7Questions,
      reviewQuestions: review.length,
      answerPositions,
    },
    null,
    2,
  ),
);
