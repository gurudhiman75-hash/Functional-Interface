import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { equalsRational, formatRational, rational } from "./foundation/rational";
import {
  sourceWitnessMalCp005Wave03,
} from "./foundation/cp005-wave03-price-change-candidate";
import {
  MAL_CP005_WAVE03_PRODUCT_READY_V2_RUNTIME_ID,
  generateMalCp005Wave03ProductReadyV2,
  malCp005Wave03ProductReadyV2Stable,
  type MalCp005Wave03ProductReadyQuestionV2,
} from "./foundation/cp005-wave03-product-ready-v2";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

const sourceWitness = sourceWitnessMalCp005Wave03();
assert(
  equalsRational(sourceWitness.profitAmount, rational(63)),
  `Source witness profit amount changed: ₹${formatRational(sourceWitness.profitAmount)}.`,
);
assert(
  equalsRational(sourceWitness.profitPercent, rational(21)),
  `Source witness profit percentage changed: ${formatRational(sourceWitness.profitPercent)}%.`,
);

const generatedCount = 2000;
let deterministic = 0;
let canonicalEquivalence = 0;
let scalingDistinctness = 0;
let explicitPriceBase = 0;
let fastMethodChecks = 0;
let reselections = 0;
const answerPositions = [0, 0, 0, 0];
const stateKeys = new Set<string>();
const siblingStateKeys = new Set<string>();
const stems = new Set<string>();
const answers = new Set<string>();
const contexts = new Set<string>();

for (let index = 0; index < generatedCount; index += 1) {
  const seed = `cp005-wave03-product-ready-v2:${index}`;
  const first = generateMalCp005Wave03ProductReadyV2(seed);
  const second = generateMalCp005Wave03ProductReadyV2(seed);
  assert(
    malCp005Wave03ProductReadyV2Stable(first) ===
      malCp005Wave03ProductReadyV2Stable(second),
    `${seed}: product-ready generation is not deterministic.`,
  );
  deterministic += 1;

  assert(
    first.runtimeId === MAL_CP005_WAVE03_PRODUCT_READY_V2_RUNTIME_ID,
    `${seed}: wrong product-ready runtime ID.`,
  );
  assert(first.permanentQlId === null, `${seed}: permanent QL leaked into review.`);
  assert(
    first.permanentSolveModeId === null,
    `${seed}: permanent solve mode leaked into review.`,
  );
  assert(first.reviewStatus === "PENDING_PRODUCT_REVIEW", `${seed}: approval was invented.`);
  assert(first.runtimeMode === "REVIEW_ONLY", `${seed}: runtime mode changed.`);
  assert(
    !first.active &&
      !first.publiclyPublishable &&
      !first.questionBankWritable &&
      !first.testEligible,
    `${seed}: delivery flag became enabled.`,
  );
  assert(first.questionStudioDiscoverable, `${seed}: review preview is not discoverable.`);
  assert(first.answerSemantic === "PROFIT_AMOUNT", `${seed}: answer semantic changed.`);

  assert(
    !/raises the selling price per unit by|increases the selling rate by/iu.test(first.stem),
    `${seed}: ambiguous selling-price base remains in the stem.`,
  );
  assert(
    /above (?:his buying|the purchase) rate/iu.test(first.stem),
    `${seed}: selling-price increase is not tied to the purchase/buying rate.`,
  );
  explicitPriceBase += 1;

  assert(
    first.siblingStateKey.startsWith("FREE-COMMERCIAL|"),
    `${seed}: canonical commercial sibling key changed.`,
  );
  assert(
    first.explanation.optionalHelp.verification.length === 2 &&
      first.explanation.optionalHelp.verification[0]!.startsWith(
        "Fast check: combined profit percentage =",
      ),
    `${seed}: exam shortcut verification is missing.`,
  );
  fastMethodChecks += 1;

  assert(
    first.equivalence.percentMatchesExistingSolver,
    `${seed}: canonical percentage equivalence failed.`,
  );
  canonicalEquivalence += 1;
  assert(
    first.equivalence.distinctAnswerSemantic &&
      first.equivalence.scalingWitness.sameProfitPercent &&
      first.equivalence.scalingWitness.doubledProfitAmount,
    `${seed}: profit-amount distinctness failed.`,
  );
  scalingDistinctness += 1;

  assert(first.options.length === 4, `${seed}: expected four options.`);
  assert(new Set(first.options).size === 4, `${seed}: options repeat.`);
  assert(first.options[first.correctIndex] === first.answer, `${seed}: answer/index mismatch.`);
  assert(
    first.optionAudit.filter((item) => item.isCorrect).length === 1,
    `${seed}: option audit must have exactly one correct option.`,
  );
  assert(
    first.optionAudit.filter((item) => !item.isCorrect).every((item) => item.misconceptionId !== "correct"),
    `${seed}: distractor without misconception authority.`,
  );
  assert(first.explanation.visibleLines.length === 3, `${seed}: visible solution is crowded.`);
  assert(!/\b1 litres\b/iu.test(first.stem + JSON.stringify(first.explanation)), `${seed}: litre grammar regressed.`);
  assert(!/₹\d+ \d+\/\d+ per/gu.test(first.stem + JSON.stringify(first.explanation)), `${seed}: mixed-fraction currency rate regressed.`);
  assert(
    !/false weight|false measure|short delivery|800 ml/iu.test(
      JSON.stringify({ stem: first.stem, explanation: first.explanation }),
    ),
    `${seed}: PNL false-quantity language leaked into MAL-CP-005.`,
  );

  if (first.selectionAttempt > 0) reselections += 1;
  answerPositions[first.correctIndex] += 1;
  stateKeys.add(first.stateKey);
  siblingStateKeys.add(first.siblingStateKey);
  stems.add(first.stem);
  answers.add(first.answer);
  const context = first.stem.match(
    /milkman|dairy vendor|juice seller|syrup dealer|honey seller|beverage seller/iu,
  );
  if (context) contexts.add(context[0]!.toLowerCase());
}

assert(deterministic === generatedCount, "Determinism count changed.");
assert(canonicalEquivalence === generatedCount, "Canonical-equivalence count changed.");
assert(scalingDistinctness === generatedCount, "Scaling-distinctness count changed.");
assert(explicitPriceBase === generatedCount, "Explicit price-base coverage changed.");
assert(fastMethodChecks === generatedCount, "Fast-method coverage changed.");
assert(stateKeys.size >= 1200, `Exact-state diversity is too low: ${stateKeys.size}.`);
assert(
  siblingStateKeys.size >= 1000,
  `Canonical sibling-state diversity is too low: ${siblingStateKeys.size}.`,
);
assert(stems.size >= 1000, `Stem diversity is too low: ${stems.size}.`);
assert(answers.size >= 150, `Answer diversity is too low: ${answers.size}.`);
assert(contexts.size >= 5, `Context diversity is too low: ${contexts.size}.`);
assert(
  answerPositions.every((count) => count >= 400),
  `Answer positions are imbalanced: ${answerPositions.join("/")}.`,
);

const review: MalCp005Wave03ProductReadyQuestionV2[] = [];
const reviewStates = new Set<string>();
const reviewSiblingStates = new Set<string>();
const reviewAnswerPositions = [0, 0, 0, 0];
for (let index = 0; review.length < 40 && index < 50000; index += 1) {
  const desiredPosition = review.length % 4;
  const candidate = generateMalCp005Wave03ProductReadyV2(
    `cp005-wave03-product-review-v2:${index}`,
  );
  if (candidate.correctIndex !== desiredPosition) continue;
  if (reviewStates.has(candidate.stateKey)) continue;
  if (reviewSiblingStates.has(candidate.siblingStateKey)) continue;
  review.push(candidate);
  reviewStates.add(candidate.stateKey);
  reviewSiblingStates.add(candidate.siblingStateKey);
  reviewAnswerPositions[candidate.correctIndex] += 1;
}
assert(review.length === 40, `Expected 40 product-review questions, received ${review.length}.`);
assert(reviewStates.size === 40, "Product-review set repeats an exact state.");
assert(reviewSiblingStates.size === 40, "Product-review set repeats a canonical sibling state.");
assert(
  reviewAnswerPositions.every((count) => count === 10),
  `Product-review answer positions are not 10/10/10/10: ${reviewAnswerPositions.join("/")}.`,
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(
  outputDirectory,
  "mal-cp005-wave03-product-ready-v2-review.json",
);
const markdownPath = resolve(
  outputDirectory,
  "MAL-CP-005-WAVE-03-PRODUCT-READY-V2-40Q-REVIEW.md",
);

writeFileSync(
  jsonPath,
  `${JSON.stringify(
    {
      status: "PASS_MAL_CP005_WAVE03_PRODUCT_READY_V2",
      runtimeId: MAL_CP005_WAVE03_PRODUCT_READY_V2_RUNTIME_ID,
      reviewStatus: "PENDING_PRODUCT_REVIEW",
      permanentQlCount: 0,
      permanentSolveModeCount: 0,
      generatedCount,
      deterministic,
      canonicalEquivalence,
      scalingDistinctness,
      explicitPriceBase,
      fastMethodChecks,
      reselections,
      distinctStateKeys: stateKeys.size,
      distinctSiblingStateKeys: siblingStateKeys.size,
      distinctStems: stems.size,
      distinctAnswers: answers.size,
      contexts: [...contexts].sort(),
      answerPositions,
      sourceWitness: {
        profitAmount: formatRational(sourceWitness.profitAmount),
        profitPercent: formatRational(sourceWitness.profitPercent),
      },
      reviewAnswerPositions,
      reviewExactStateCount: reviewStates.size,
      reviewSiblingStateCount: reviewSiblingStates.size,
      review,
    },
    (_key, value) => (typeof value === "bigint" ? value.toString() : value),
    2,
  )}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-CP-005 Wave 03 — Product-Ready V2 40Q Review",
  "",
  "> Review-only candidate. No permanent QL, permanent solve mode or delivery activation is authorized.",
  "",
  `Runtime: \`${MAL_CP005_WAVE03_PRODUCT_READY_V2_RUNTIME_ID}\``,
  "",
  "## Product-readiness remediation",
  "",
  "- All selling-price increases now explicitly state the purchase/buying-rate base.",
  "- The review selector rejects both exact-state and canonical sibling-state repetition.",
  "- Optional verification includes the exam shortcut: combined profit % = adulteration % + price increase % + interaction term.",
  "- The visible solution remains the three-step quantity/rate/cost-revenue method for student clarity.",
  "",
  `Proof questions: **${generatedCount}**`,
  `Distinct exact states: **${stateKeys.size}**`,
  `Distinct canonical sibling states: **${siblingStateKeys.size}**`,
  `Distinct stems: **${stems.size}**`,
  `Distinct answers: **${answers.size}**`,
  `Answer positions: **${answerPositions.join("/")}**`,
  "",
  "## 40-question product review",
  "",
];

for (const [index, question] of review.entries()) {
  markdown.push(
    `### ${index + 1}. ${question.stem}`,
    "",
    ...question.options.map(
      (option, optionIndex) =>
        `${String.fromCharCode(65 + optionIndex)}. ${option}${
          optionIndex === question.correctIndex ? " **✓**" : ""
        }`,
    ),
    "",
    `**Answer:** ${question.answer}`,
    "",
    "**Solution**",
    ...question.explanation.visibleLines.map((line) => `- ${line}`),
    "",
    `**Common mistake:** ${question.explanation.optionalHelp.commonMistake}`,
    "",
    "**Fast verification**",
    ...question.explanation.optionalHelp.verification.map((line) => `- ${line}`),
    "",
    `**Canonical sibling key:** \`${question.siblingStateKey}\``,
    "",
    "---",
    "",
  );
}
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP005_WAVE03_PRODUCT_READY_V2",
      generatedCount,
      deterministic,
      canonicalEquivalence,
      scalingDistinctness,
      explicitPriceBase,
      fastMethodChecks,
      reselections,
      distinctStateKeys: stateKeys.size,
      distinctSiblingStateKeys: siblingStateKeys.size,
      distinctStems: stems.size,
      distinctAnswers: answers.size,
      answerPositions,
      reviewCount: review.length,
      reviewAnswerPositions,
      reviewExactStateCount: reviewStates.size,
      reviewSiblingStateCount: reviewSiblingStates.size,
      sourceWitnessProfitAmount: formatRational(sourceWitness.profitAmount),
      sourceWitnessProfitPercent: formatRational(sourceWitness.profitPercent),
    },
    null,
    2,
  ),
);
