import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateMalCp005ExamReadyV2Question } from "./foundation/cp005-exam-ready-v2-runtime";
import { MAL_CP005_DISCOVERY_PROTOTYPE_IDS } from "./foundation/cp005-types";
import {
  MAL_CP005_WAVE02_PROTOTYPE_EVIDENCE,
  MAL_CP005_WAVE02_SOURCE_FIXTURES,
  MAL_CP005_WAVE02_SOURCE_STATUS,
  malCp005Wave02SourceById,
} from "./foundation/cp005-wave02-source-fixtures";
import {
  MAL_CP005_WAVE02_FREEZE_RECOMMENDATION,
  MAL_CP005_WAVE02_GAP_DECISIONS,
  MAL_CP005_WAVE02_PROTOTYPE_DECISIONS,
  MAL_CP005_WAVE02_RECOMMENDATION_ID,
} from "./foundation/cp005-wave02-merge-split";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

const sourceIds = MAL_CP005_WAVE02_SOURCE_FIXTURES.map((source) => source.sourceId);
assert(
  new Set(sourceIds).size === sourceIds.length,
  "Normalized source fixture IDs are not unique.",
);
assert(
  MAL_CP005_WAVE02_SOURCE_FIXTURES.every(
    (source) =>
      source.workTitle.length > 10 &&
      source.edition.length > 0 &&
      source.publisher.length > 0 &&
      source.locator.length > 0 &&
      source.itemLabel.length > 0 &&
      source.normalizedSummary.length > 40,
  ),
  "A normalized source fixture is incomplete.",
);

assert(
  MAL_CP005_WAVE02_PROTOTYPE_EVIDENCE.length ===
    MAL_CP005_DISCOVERY_PROTOTYPE_IDS.length,
  "Wave 02 evidence does not cover all 12 existing prototypes.",
);
assert(
  new Set(MAL_CP005_WAVE02_PROTOTYPE_EVIDENCE.map((entry) => entry.prototypeId)).size ===
    MAL_CP005_DISCOVERY_PROTOTYPE_IDS.length,
  "Wave 02 prototype evidence contains a duplicate or missing prototype.",
);
for (const prototypeId of MAL_CP005_DISCOVERY_PROTOTYPE_IDS) {
  const evidence = MAL_CP005_WAVE02_PROTOTYPE_EVIDENCE.find(
    (entry) => entry.prototypeId === prototypeId,
  );
  assert(evidence, `${prototypeId}: missing normalized evidence entry.`);
  assert(evidence.normalizedSourceIds.length > 0, `${prototypeId}: has no normalized source.`);
  for (const sourceId of evidence.normalizedSourceIds) {
    assert(malCp005Wave02SourceById(sourceId), `${prototypeId}: unknown source ${sourceId}.`);
  }
}

assert(
  MAL_CP005_WAVE02_PROTOTYPE_DECISIONS.length ===
    MAL_CP005_DISCOVERY_PROTOTYPE_IDS.length,
  "Merge/split audit does not cover all existing prototypes.",
);
assert(
  MAL_CP005_WAVE02_PROTOTYPE_DECISIONS.every(
    (entry) => entry.decision === "RETAIN_DISTINCT_TASK_CONTRACT",
  ),
  "An approved existing prototype was unexpectedly merged or reassigned.",
);
const familyCounts = Object.fromEntries(
  [
    "FREE_ADULTERANT_AT_PURE_COST",
    "FREE_ADULTERANT_COMMERCIAL_RATE",
    "PAID_CHEAPER_INGREDIENT_COMMERCIAL",
  ].map((familyId) => [
    familyId,
    MAL_CP005_WAVE02_PROTOTYPE_DECISIONS.filter(
      (entry) => entry.coreFamily === familyId,
    ).length,
  ]),
);
assert(
  familyCounts.FREE_ADULTERANT_AT_PURE_COST === 6 &&
    familyCounts.FREE_ADULTERANT_COMMERCIAL_RATE === 3 &&
    familyCounts.PAID_CHEAPER_INGREDIENT_COMMERCIAL === 3,
  `Unexpected core-family partition: ${JSON.stringify(familyCounts)}.`,
);

const gapIds = MAL_CP005_WAVE02_GAP_DECISIONS.map((entry) => entry.gapId);
assert(new Set(gapIds).size === gapIds.length, "Wave 02 gap decision IDs are not unique.");
for (const gap of MAL_CP005_WAVE02_GAP_DECISIONS) {
  for (const sourceId of gap.normalizedSourceIds) {
    assert(malCp005Wave02SourceById(sourceId), `${gap.gapId}: unknown source ${sourceId}.`);
  }
}
const newCandidates = MAL_CP005_WAVE02_GAP_DECISIONS.filter(
  (entry) => entry.decision === "SPLIT_NEW_CP005_CANDIDATE",
);
assert(newCandidates.length === 1, "Wave 02 should recommend exactly one new CP-005 candidate.");
assert(
  newCandidates[0]?.gapId === "ADULTERATION_PLUS_PRICE_CHANGE_COMMERCIAL_RESULT",
  "The source-backed new CP-005 candidate changed unexpectedly.",
);
assert(
  newCandidates[0]?.normalizedSourceIds.includes("RS-AGGARWAL-QA-2017-P388-Q111"),
  "The new candidate lacks its direct normalized source fixture.",
);
assert(
  MAL_CP005_WAVE02_GAP_DECISIONS.some(
    (entry) =>
      entry.gapId === "ADULTERATION_PLUS_FALSE_MEASURE" &&
      entry.decision === "REASSIGN_PNL_CP005",
  ),
  "False-measure ownership escaped the PNL boundary.",
);
assert(
  MAL_CP005_WAVE02_GAP_DECISIONS.filter(
    (entry) => entry.decision === "REASSIGN_MAL_CP001",
  ).length >= 3,
  "Generic paid-blend gaps were not sufficiently protected from CP-005 duplication.",
);

assert(MAL_CP005_WAVE02_FREEZE_RECOMMENDATION.permanentQlCount === 0, "Wave 02 allocated permanent QLs.");
assert(
  MAL_CP005_WAVE02_FREEZE_RECOMMENDATION.permanentSolveModeCount === 0,
  "Wave 02 froze permanent solve modes.",
);
assert(
  MAL_CP005_WAVE02_FREEZE_RECOMMENDATION.futureCandidateContractCount === 13,
  "Future candidate-contract count changed.",
);

let approvedRuntimeChecks = 0;
for (const prototypeId of MAL_CP005_DISCOVERY_PROTOTYPE_IDS) {
  const question = generateMalCp005ExamReadyV2Question(
    prototypeId,
    `cp005-wave02-lifecycle-proof:${prototypeId}`,
  );
  assert(question.permanentQlId === null, `${prototypeId}: permanent QL leaked.`);
  assert(question.reviewStatus === "PRODUCT_REVIEW_APPROVED", `${prototypeId}: product approval regressed.`);
  assert(question.runtimeMode === "REVIEW_ONLY", `${prototypeId}: runtime mode changed.`);
  assert(question.questionStudioDiscoverable, `${prototypeId}: review preview was hidden.`);
  assert(
    !question.active &&
      !question.publiclyPublishable &&
      !question.questionBankWritable &&
      !question.testEligible,
    `${prototypeId}: a delivery flag became enabled.`,
  );
  approvedRuntimeChecks += 1;
}

const strengthCounts = Object.fromEntries(
  [
    "DIRECT_EXAM_FORM",
    "DIRECT_SOLVED_EXAMPLE",
    "INVERSE_DERIVED_FROM_DIRECT",
    "RELATED_COMMERCIAL_FORM",
    "BOUNDARY_AUTHORITY",
  ].map((strength) => [
    strength,
    MAL_CP005_WAVE02_SOURCE_FIXTURES.filter(
      (source) => source.evidenceStrength === strength,
    ).length,
  ]),
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp005-wave02-source-normalization.json");
const markdownPath = resolve(
  outputDirectory,
  "MAL-CP-005-WAVE-02-SOURCE-NORMALIZATION-REVIEW.md",
);

const result = {
  status: "PASS_MAL_CP005_WAVE02_SOURCE_NORMALIZATION",
  recommendationId: MAL_CP005_WAVE02_RECOMMENDATION_ID,
  sourceStatus: MAL_CP005_WAVE02_SOURCE_STATUS,
  normalizedSourceFixtureCount: MAL_CP005_WAVE02_SOURCE_FIXTURES.length,
  coveredExistingPrototypeCount: MAL_CP005_WAVE02_PROTOTYPE_EVIDENCE.length,
  retainedExistingPrototypeCount:
    MAL_CP005_WAVE02_PROTOTYPE_DECISIONS.filter(
      (entry) => entry.decision === "RETAIN_DISTINCT_TASK_CONTRACT",
    ).length,
  coreFamilyCounts: familyCounts,
  gapDecisionCount: MAL_CP005_WAVE02_GAP_DECISIONS.length,
  newCp005CandidateCount: newCandidates.length,
  futureCandidateContractCount:
    MAL_CP005_WAVE02_FREEZE_RECOMMENDATION.futureCandidateContractCount,
  permanentQlCount: MAL_CP005_WAVE02_FREEZE_RECOMMENDATION.permanentQlCount,
  permanentSolveModeCount:
    MAL_CP005_WAVE02_FREEZE_RECOMMENDATION.permanentSolveModeCount,
  approvedRuntimeChecks,
  strengthCounts,
  sourceFixtures: MAL_CP005_WAVE02_SOURCE_FIXTURES,
  prototypeEvidence: MAL_CP005_WAVE02_PROTOTYPE_EVIDENCE,
  prototypeDecisions: MAL_CP005_WAVE02_PROTOTYPE_DECISIONS,
  gapDecisions: MAL_CP005_WAVE02_GAP_DECISIONS,
  freezeRecommendation: MAL_CP005_WAVE02_FREEZE_RECOMMENDATION,
};
writeFileSync(jsonPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

const markdown = [
  "# MAL-CP-005 — Wave 02 Source Normalization & Merge/Split Review",
  "",
  "> Evidence and ownership checkpoint only. No permanent QLs, permanent solve modes, Question Bank writes, tests, publication or localization are enabled.",
  "",
  `- Recommendation: \`${MAL_CP005_WAVE02_RECOMMENDATION_ID}\``,
  `- Source status: \`${MAL_CP005_WAVE02_SOURCE_STATUS}\``,
  `- Normalized source fixtures: **${MAL_CP005_WAVE02_SOURCE_FIXTURES.length}**`,
  `- Existing prototypes covered/retained: **${MAL_CP005_WAVE02_PROTOTYPE_EVIDENCE.length}/${MAL_CP005_WAVE02_PROTOTYPE_DECISIONS.length}**`,
  `- New CP-005 candidates recommended: **${newCandidates.length}**`,
  `- Future candidate task contracts: **${MAL_CP005_WAVE02_FREEZE_RECOMMENDATION.futureCandidateContractCount}**`,
  `- Permanent QLs allocated: **${MAL_CP005_WAVE02_FREEZE_RECOMMENDATION.permanentQlCount}**`,
  "",
  "## Three retained mathematical cores",
  "",
  `- Free adulterant at pure-product cost: **${familyCounts.FREE_ADULTERANT_AT_PURE_COST}** task directions.`,
  `- Free adulterant with independent selling rate: **${familyCounts.FREE_ADULTERANT_COMMERCIAL_RATE}** task directions.`,
  `- Paid cheaper/adulterant ingredient commercial blend: **${familyCounts.PAID_CHEAPER_INGREDIENT_COMMERCIAL}** task directions.`,
  "",
  "All 12 existing prototype directions remain distinct future QL candidates because their given/unknown relation and answer semantic differ, while their solvers should stay shared inside the three cores.",
  "",
  "## Source-backed new CP-005 candidate",
  "",
  ...newCandidates.map(
    (entry) =>
      `- **${entry.proposedContractId}** — ${entry.reason}`,
  ),
  "",
  "## Reassignment and hold decisions",
  "",
  ...MAL_CP005_WAVE02_GAP_DECISIONS.filter(
    (entry) => entry.decision !== "SPLIT_NEW_CP005_CANDIDATE",
  ).map((entry) => `- **${entry.gapId} → ${entry.decision}** — ${entry.reason}`),
  "",
  "## Normalized source fixtures",
  "",
  ...MAL_CP005_WAVE02_SOURCE_FIXTURES.map(
    (source) =>
      `- **${source.sourceId}** — ${source.workTitle}, ${source.edition}, ${source.locator}, ${source.itemLabel}. ${source.normalizedSummary}`,
  ),
  "",
  "## Prototype-to-source matrix",
  "",
  ...MAL_CP005_WAVE02_PROTOTYPE_EVIDENCE.map(
    (entry) =>
      `- **${entry.prototypeId}** — ${entry.evidenceStrength}; sources: ${entry.normalizedSourceIds.join(", ")}. ${entry.rationale}`,
  ),
  "",
  "## Lifecycle proof",
  "",
  `All **${approvedRuntimeChecks}** approved V2 prototype runtimes were sampled and remained \`PRODUCT_REVIEW_APPROVED\`, \`REVIEW_ONLY\`, unallocated, non-writable, non-test-eligible and non-public.`,
  "",
];
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: result.status,
  normalizedSourceFixtureCount: result.normalizedSourceFixtureCount,
  coveredExistingPrototypeCount: result.coveredExistingPrototypeCount,
  retainedExistingPrototypeCount: result.retainedExistingPrototypeCount,
  coreFamilyCounts: result.coreFamilyCounts,
  gapDecisionCount: result.gapDecisionCount,
  newCp005CandidateCount: result.newCp005CandidateCount,
  futureCandidateContractCount: result.futureCandidateContractCount,
  permanentQlCount: result.permanentQlCount,
  permanentSolveModeCount: result.permanentSolveModeCount,
  approvedRuntimeChecks: result.approvedRuntimeChecks,
}, null, 2));
