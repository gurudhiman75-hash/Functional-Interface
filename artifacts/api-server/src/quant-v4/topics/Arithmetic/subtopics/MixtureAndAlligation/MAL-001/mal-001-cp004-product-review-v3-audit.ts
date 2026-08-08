import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MAL_CP004_PRODUCT_REVIEW_CANDIDATE,
  malCp004ProductReviewStable,
  runMalCp004EnglishProductReviewV3Pipeline,
  type MalCp004ProductReviewQuestion,
} from "./foundation/cp004-product-review-remediation-v3";
import {
  MAL_CP004_PERMANENT_ALLOCATION,
  runMalCp004EnglishReleasePipeline,
  type MalCp004PermanentQlId,
} from "./foundation/cp004-permanent-runtime";
import { equalsRational } from "./foundation/rational";
import { runMal001QuestionStudioPipeline } from "./question-studio-adapter";

function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) =>
    typeof entry === "bigint" ? `${entry}n` : entry,
  );
}

function check(question: MalCp004ProductReviewQuestion): void {
  const id = `${question.permanentQlId}/${question.parameters.requestedSeed}`;
  assert(
    question.releaseStatus === "PRESENTATION_CANDIDATE" &&
      question.runtimeMode === "REVIEW_ONLY" &&
      question.reviewStatus === "PENDING_PRODUCT_REVIEW",
    `${id}: dishonest candidate lifecycle.`,
  );
  assert(
    !question.active &&
      !question.publiclyPublishable &&
      !question.questionBankWritable &&
      !question.testEligible,
    `${id}: candidate claims delivery permissions.`,
  );
  assert(question.questionStudioDiscoverable, `${id}: preview route is closed.`);
  assert(question.options.length === 4, `${id}: not four options.`);
  assert(new Set(question.options).size === 4, `${id}: duplicate options.`);
  assert(
    question.options[question.correctIndex] === question.answer,
    `${id}: answer position mismatch.`,
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
  }
  const alternative = question.explanation.optionalHelp.alternativeMethod;
  const applies = ["MAL-QL-041", "MAL-QL-042"].includes(question.permanentQlId);
  assert(applies === Boolean(alternative), `${id}: wrong alligation scope.`);
  if (alternative) {
    assert(
      alternative.visualDirective.startsWith("[[EXAMTREE_ALLIGATION_SVG_V1:"),
      `${id}: shared SVG directive missing.`,
    );
    assert(alternative.renderLines[0] === alternative.visualDirective, `${id}: SVG not first.`);
  }
}

assert(
  MAL_CP004_PRODUCT_REVIEW_CANDIDATE.presentationReviewStatus ===
    "PENDING_PRODUCT_REVIEW",
  "Candidate falsely claims approval.",
);

const seedsPerQl = 200;
const byQl = new Map<MalCp004PermanentQlId, MalCp004ProductReviewQuestion[]>();
let generated = 0;
let deterministic = 0;
let sourceParity = 0;
let studioParity = 0;
let wrongOptions = 0;
let ql038Integral = 0;
let ql038Reselected = 0;
let svgCrosses = 0;

for (const allocation of MAL_CP004_PERMANENT_ALLOCATION) {
  const rows: MalCp004ProductReviewQuestion[] = [];
  byQl.set(allocation.qlId, rows);
  for (let index = 0; index < seedsPerQl; index += 1) {
    const seed = `mal-cp004-review-v3:${allocation.qlId}:${index}`;
    const first = runMalCp004EnglishProductReviewV3Pipeline({
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    });
    const second = runMalCp004EnglishProductReviewV3Pipeline({
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    });
    assert(
      malCp004ProductReviewStable(first) === malCp004ProductReviewStable(second),
      `${allocation.qlId}/${seed}: nondeterministic.`,
    );
    deterministic += 1;
    check(first);

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
      `${allocation.qlId}/${seed}: selected state changed mathematical authority.`,
    );
    sourceParity += 1;

    const studio = runMal001QuestionStudioPipeline("MAL-CP-004", {
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    }) as MalCp004ProductReviewQuestion;
    assert(
      malCp004ProductReviewStable(studio) === malCp004ProductReviewStable(first),
      `${allocation.qlId}/${seed}: Question Studio mismatch.`,
    );
    studioParity += 1;

    wrongOptions += first.optionAudit.filter((entry) => !entry.isCorrect).length;
    if (first.permanentQlId === "MAL-QL-038") {
      ql038Integral += 1;
      if (first.parameters.valueQualitySelectionAttempt > 0) ql038Reselected += 1;
    }
    if (first.explanation.optionalHelp.alternativeMethod) svgCrosses += 1;
    rows.push(first);
    generated += 1;
  }
}

assert(generated === 2_000, `Expected 2000, received ${generated}.`);
assert(deterministic === 2_000, "Incomplete determinism proof.");
assert(sourceParity === 2_000, "Incomplete selected-source parity proof.");
assert(studioParity === 2_000, "Incomplete Question Studio proof.");
assert(wrongOptions === 6_000, `Expected 6000 wrong options, received ${wrongOptions}.`);
assert(ql038Integral === 200, `Expected 200 integral QL-038 answers, received ${ql038Integral}.`);
assert(svgCrosses === 400, `Expected 400 SVG crosses, received ${svgCrosses}.`);

const review: MalCp004ProductReviewQuestion[] = [];
const positions = [0, 0, 0, 0];
for (const allocation of MAL_CP004_PERMANENT_ALLOCATION) {
  const used = new Set<string>();
  const rows = byQl.get(allocation.qlId)!;
  while (used.size < 10) {
    const order = [0, 1, 2, 3].sort((a, b) => positions[a]! - positions[b]!);
    let chosen: MalCp004ProductReviewQuestion | undefined;
    for (const position of order) {
      chosen = rows.find(
        (row) => row.correctIndex === position && !used.has(row.mathematicalFingerprint),
      );
      if (chosen) break;
    }
    assert(chosen, `${allocation.qlId}: insufficient review diversity.`);
    used.add(chosen.mathematicalFingerprint);
    positions[chosen.correctIndex] += 1;
    review.push(chosen);
  }
}

assert(review.length === 100, "Review pack is not 100 questions.");
assert(new Set(review.map((row) => row.mathematicalFingerprint)).size === 100, "Review clones remain.");
assert(positions.every((count) => count === 25), `Unbalanced positions: ${positions.join("/")}.`);
assert(
  review.filter((row) => row.explanation.optionalHelp.alternativeMethod).length === 20,
  "Review pack does not contain 20 SVG crosses.",
);

const output = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(output, { recursive: true });
writeFileSync(
  resolve(output, "mal-cp004-product-review-v3-review.json"),
  `${stable({ candidate: MAL_CP004_PRODUCT_REVIEW_CANDIDATE, positions, review })}\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP004_PRODUCT_REVIEW_REMEDIATION_V3",
      generated,
      deterministic,
      sourceParity,
      studioParity,
      wrongOptions,
      ql038Integral,
      ql038Reselected,
      svgCrosses,
      reviewQuestions: review.length,
      positions,
    },
    null,
    2,
  ),
);
