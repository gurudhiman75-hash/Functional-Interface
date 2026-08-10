import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { equalsRational, formatRational, rational } from "./foundation/rational";
import { MAL_CP005_DISCOVERY_REGISTRY } from "./foundation/cp005-discovery-registry";
import {
  MAL_CP005_WAVE03_CANDIDATE_ID,
  MAL_CP005_WAVE03_RUNTIME_ID,
  MAL_CP005_WAVE03_SOURCE_ID,
  generateMalCp005Wave03PriceChangeQuestion,
  malCp005Wave03Stable,
  sourceWitnessMalCp005Wave03,
  type MalCp005Wave03PriceChangeQuestion,
} from "./foundation/cp005-wave03-price-change-candidate";
import { MAL_CP005_WAVE02_GAP_DECISIONS } from "./foundation/cp005-wave02-merge-split";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

const sourceDecision = MAL_CP005_WAVE02_GAP_DECISIONS.find(
  (entry) => entry.gapId === "ADULTERATION_PLUS_PRICE_CHANGE_COMMERCIAL_RESULT",
);
assert(sourceDecision, "Wave 02 price-change decision is missing.");
assert(
  sourceDecision.proposedContractId === MAL_CP005_WAVE03_CANDIDATE_ID,
  "Wave 03 candidate ID no longer matches the source-normalized Wave 02 recommendation.",
);
assert(
  sourceDecision.normalizedSourceIds.includes(MAL_CP005_WAVE03_SOURCE_ID),
  "Wave 03 candidate lost its normalized direct source.",
);

const sourceWitness = sourceWitnessMalCp005Wave03();
assert(
  equalsRational(sourceWitness.profitAmount, rational(63)),
  `Normalized Q111 witness must produce ₹63, received ₹${formatRational(sourceWitness.profitAmount)}.`,
);
assert(
  equalsRational(sourceWitness.profitPercent, rational(21)),
  `Normalized Q111 witness must imply 21% profit, received ${formatRational(sourceWitness.profitPercent)}%.`,
);

// The existing 12 contracts contain profit percentage, ratios, quantities, percentages and selling rates,
// but no monetary-profit answer. This is the task-contract distinction under the same commercial core.
assert(
  !MAL_CP005_DISCOVERY_REGISTRY.some(
    (entry) => String(entry.answerSemantic) === "PROFIT_AMOUNT",
  ),
  "An existing CP-005 prototype already owns PROFIT_AMOUNT; Wave 03 would be a duplicate.",
);

const generatedCount = 2000;
let deterministic = 0;
let canonicalEquivalence = 0;
let scalingDistinctness = 0;
let reselections = 0;
const answerPositions = [0, 0, 0, 0];
const stateKeys = new Set<string>();
const stems = new Set<string>();
const answers = new Set<string>();
const contexts = new Set<string>();
const generated: MalCp005Wave03PriceChangeQuestion[] = [];

for (let index = 0; index < generatedCount; index += 1) {
  const seed = `cp005-wave03-price-change:${index}`;
  const first = generateMalCp005Wave03PriceChangeQuestion(seed);
  const second = generateMalCp005Wave03PriceChangeQuestion(seed);
  assert(
    malCp005Wave03Stable(first) === malCp005Wave03Stable(second),
    `${seed}: generation is not deterministic.`,
  );
  deterministic += 1;

  assert(first.permanentQlId === null, `${seed}: permanent QL leaked into candidate.`);
  assert(
    first.permanentSolveModeId === null,
    `${seed}: permanent solve mode leaked into candidate.`,
  );
  assert(first.runtimeMode === "REVIEW_ONLY", `${seed}: runtime mode changed.`);
  assert(
    first.reviewStatus === "PENDING_PRODUCT_REVIEW",
    `${seed}: unreviewed candidate was marked approved.`,
  );
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
    first.canonicalExistingPrototypeId ===
      "MAL-CP005-PROT-PROFIT-FROM-FREE-BLEND-AND-SELLING-RATE",
    `${seed}: canonical shared-core prototype changed.`,
  );
  assert(
    first.canonicalExistingRequest.mode === "FREE_BLEND_PROFIT_FROM_COST_AND_SELLING_RATE",
    `${seed}: candidate no longer canonicalizes to the approved forward commercial-profit solver.`,
  );
  assert(
    first.equivalence.percentMatchesExistingSolver,
    `${seed}: canonical percentage equivalence failed.`,
  );
  canonicalEquivalence += 1;
  assert(
    first.equivalence.distinctAnswerSemantic &&
      first.equivalence.scalingWitness.sameProfitPercent &&
      first.equivalence.scalingWitness.doubledProfitAmount,
    `${seed}: monetary-profit scaling distinctness failed.`,
  );
  scalingDistinctness += 1;

  assert(first.options.length === 4, `${seed}: expected four options.`);
  assert(new Set(first.options).size === 4, `${seed}: options are not unique.`);
  assert(first.options[first.correctIndex] === first.answer, `${seed}: correct option mismatch.`);
  assert(
    first.optionAudit.filter((entry) => entry.isCorrect).length === 1,
    `${seed}: option audit does not have exactly one correct answer.`,
  );
  assert(
    first.explanation.visibleLines.length === 3,
    `${seed}: default solution should remain three concise lines.`,
  );
  assert(
    first.sourceEvidenceIds.length === 1 && first.sourceEvidenceIds[0] === MAL_CP005_WAVE03_SOURCE_ID,
    `${seed}: source provenance changed.`,
  );
  assert(
    !/false weight|false measure|short delivery|800 ml/iu.test(
      JSON.stringify({ stem: first.stem, explanation: first.explanation }),
    ),
    `${seed}: PNL false-quantity language leaked into the MAL candidate.`,
  );

  if (first.selectionAttempt > 0) reselections += 1;
  answerPositions[first.correctIndex] += 1;
  stateKeys.add(first.stateKey);
  stems.add(first.stem);
  answers.add(first.answer);
  const contextMatch = first.stem.match(/milkman|dairy vendor|juice seller|syrup dealer|honey seller|beverage seller/iu);
  if (contextMatch) contexts.add(contextMatch[0]!.toLowerCase());
  generated.push(first);
}

assert(deterministic === generatedCount, "Determinism count changed.");
assert(canonicalEquivalence === generatedCount, "Canonical-equivalence count changed.");
assert(scalingDistinctness === generatedCount, "Scaling-distinctness count changed.");
assert(stateKeys.size >= 1200, `Candidate state diversity is too low: ${stateKeys.size}.`);
assert(stems.size >= 1000, `Candidate stem diversity is too low: ${stems.size}.`);
assert(answers.size >= 150, `Candidate answer diversity is too low: ${answers.size}.`);
assert(contexts.size >= 5, `Candidate context diversity is too low: ${contexts.size}.`);
assert(
  answerPositions.every((count) => count >= 400),
  `Answer positions are imbalanced: ${answerPositions.join("/")}.`,
);

// Build a 40-question review set with exact 10/10/10/10 answer positions and unique states.
const review: MalCp005Wave03PriceChangeQuestion[] = [];
const reviewStates = new Set<string>();
const reviewAnswerPositions = [0, 0, 0, 0];
for (let index = 0; review.length < 40 && index < 20000; index += 1) {
  const desiredPosition = review.length % 4;
  const candidate = generateMalCp005Wave03PriceChangeQuestion(
    `cp005-wave03-review:${index}`,
  );
  if (candidate.correctIndex !== desiredPosition) continue;
  if (reviewStates.has(candidate.stateKey)) continue;
  review.push(candidate);
  reviewStates.add(candidate.stateKey);
  reviewAnswerPositions[candidate.correctIndex] += 1;
}
assert(review.length === 40, `Expected 40 review questions, received ${review.length}.`);
assert(
  reviewAnswerPositions.every((count) => count === 10),
  `Review positions are not 10/10/10/10: ${reviewAnswerPositions.join("/")}.`,
);
assert(reviewStates.size === 40, "Review set repeats an exact state.");

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp005-wave03-price-change-review.json");
const markdownPath = resolve(
  outputDirectory,
  "MAL-CP-005-WAVE-03-PRICE-CHANGE-40Q-REVIEW.md",
);

writeFileSync(
  jsonPath,
  `${JSON.stringify(
    {
      status: "PASS_MAL_CP005_WAVE03_PRICE_CHANGE_EQUIVALENCE",
      candidateId: MAL_CP005_WAVE03_CANDIDATE_ID,
      runtimeId: MAL_CP005_WAVE03_RUNTIME_ID,
      sourceId: MAL_CP005_WAVE03_SOURCE_ID,
      recommendation: "RETAIN_AS_DISTINCT_TASK_CONTRACT_SHARED_CORE",
      distinctnessBasis: "PROFIT_AMOUNT answer semantic with monetary-base scaling dependency",
      sharedCorePrototypeId:
        "MAL-CP005-PROT-PROFIT-FROM-FREE-BLEND-AND-SELLING-RATE",
      permanentQlCount: 0,
      permanentSolveModeCount: 0,
      generatedCount,
      deterministic,
      canonicalEquivalence,
      scalingDistinctness,
      reselections,
      distinctStateKeys: stateKeys.size,
      distinctStems: stems.size,
      distinctAnswers: answers.size,
      contexts: [...contexts].sort(),
      answerPositions,
      sourceWitness: {
        profitAmount: formatRational(sourceWitness.profitAmount),
        profitPercent: formatRational(sourceWitness.profitPercent),
      },
      reviewAnswerPositions,
      review,
    },
    (_key, value) => (typeof value === "bigint" ? value.toString() : value),
    2,
  )}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-CP-005 Wave 03 — Price-Change Profit-Amount Candidate",
  "",
  "> Review-only executable candidate. No permanent QL or permanent solve mode is allocated.",
  "",
  `Candidate: \`${MAL_CP005_WAVE03_CANDIDATE_ID}\``,
  `Direct normalized source: \`${MAL_CP005_WAVE03_SOURCE_ID}\``,
  "",
  "## Equivalence / distinctness result",
  "",
  "- The composition and selling-rate arithmetic canonicalizes exactly to the approved forward free-adulterant commercial-profit core.",
  "- The candidate is **not** a duplicate task contract because the source asks for **total monetary profit**, whereas the existing approved contract answers **profit percentage**.",
  "- Doubling the paid quantity leaves profit percentage unchanged but doubles monetary profit. Therefore the original quantity/cost base is indispensable to this answer semantic.",
  "- Source witness: 20 units at ₹15, 10% free adulterant, 10% price increase → ₹63 total profit and 21% profit rate.",
  "",
  `Generated proof questions: **${generatedCount}**`,
  `Distinct exact states: **${stateKeys.size}**`,
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
    "**Verification**",
    ...question.explanation.optionalHelp.verification.map((line) => `- ${line}`),
    "",
    "---",
    "",
  );
}
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP005_WAVE03_PRICE_CHANGE_EQUIVALENCE",
      generatedCount,
      deterministic,
      canonicalEquivalence,
      scalingDistinctness,
      reselections,
      distinctStateKeys: stateKeys.size,
      distinctStems: stems.size,
      distinctAnswers: answers.size,
      answerPositions,
      reviewCount: review.length,
      reviewAnswerPositions,
      sourceWitnessProfitAmount: formatRational(sourceWitness.profitAmount),
      sourceWitnessProfitPercent: formatRational(sourceWitness.profitPercent),
    },
    null,
    2,
  ),
);
