import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  SER_CP007_CANONICAL_AUTHORITY_IDS,
  SER_CP007_SOURCE_RULE_IDS,
  SER_CP007_TEMPORARY_TEMPLATE_IDS,
  generateSerCp007Question,
  renderSerCp007Review,
} from "../SER-CP-007/foundation";
import {
  SER_CP007_WAVE_B_AUTHORITY_IDS,
  SER_CP007_WAVE_B_SOURCE_RULE_IDS,
  SER_CP007_WAVE_B_TEMPORARY_TEMPLATE_IDS,
  generateSerCp007WaveBQuestion,
  renderSerCp007WaveBReview,
} from "../SER-CP-007-WAVE-B/foundation-expanded";
import {
  SER_CP007_WAVE_C_AUTHORITY_IDS,
  SER_CP007_WAVE_C_EXCLUDED_SURFACES,
  SER_CP007_WAVE_C_SOURCE_RULE_IDS,
  SER_CP007_WAVE_C_TEMPORARY_TEMPLATE_IDS,
  generateSerCp007WaveCQuestion,
  renderSerCp007WaveCReview,
} from "../SER-CP-007-WAVE-C/foundation-refined";
import {
  SER_CP007_WAVE_D_AUTHORITY_IDS,
  SER_CP007_WAVE_D_SOURCE_RULE_IDS,
  SER_CP007_WAVE_D_TEMPORARY_TEMPLATE_IDS,
  generateSerCp007WaveDQuestion,
  renderSerCp007WaveDReview,
} from "../SER-CP-007-WAVE-D/foundation";

const SEEDS_PER_TEMPLATE = 120;
const templateIds = [
  ...SER_CP007_TEMPORARY_TEMPLATE_IDS,
  ...SER_CP007_WAVE_B_TEMPORARY_TEMPLATE_IDS,
  ...SER_CP007_WAVE_C_TEMPORARY_TEMPLATE_IDS,
  ...SER_CP007_WAVE_D_TEMPORARY_TEMPLATE_IDS,
];
const authorityIds = new Set([
  ...SER_CP007_CANONICAL_AUTHORITY_IDS,
  ...SER_CP007_WAVE_B_AUTHORITY_IDS,
  ...SER_CP007_WAVE_C_AUTHORITY_IDS,
  ...SER_CP007_WAVE_D_AUTHORITY_IDS,
]);
const sourceProbeCount =
  SER_CP007_SOURCE_RULE_IDS.length +
  SER_CP007_WAVE_B_SOURCE_RULE_IDS.length +
  SER_CP007_WAVE_C_SOURCE_RULE_IDS.length +
  SER_CP007_WAVE_D_SOURCE_RULE_IDS.length;

assert.equal(sourceProbeCount, 36);
assert.equal(templateIds.length, 104);
assert.equal(new Set(templateIds).size, 104);
assert.equal(authorityIds.size, 15);
assert.equal(templateIds.length * SEEDS_PER_TEMPLATE, 12_480);

const expectedTaskCounts = {
  FILL_GAPS: 240,
  FILL_GAP_GROUPS: 240,
  MISSING_TERM: 2_880,
  MISSING_TWO_TERMS: 120,
  NEXT_TERM: 2_880,
  NEXT_TWO_TERMS: 720,
  PREVIOUS_TERM: 2_400,
  WRONG_AND_REPLACEMENT: 120,
  WRONG_TERM: 2_880,
} as const;
assert.equal(
  Object.values(expectedTaskCounts).reduce((sum, value) => sum + value, 0),
  12_480,
);

const expectedAnswerSemanticCounts = {
  SINGLE_CLUSTER: 11_040,
  FLAT_GAP_LETTER_GROUP: 240,
  MULTI_GAP_GROUP_LIST: 240,
  TWO_CLUSTER_LIST: 840,
  WRONG_TO_CORRECT_PAIR: 120,
} as const;
assert.equal(
  Object.values(expectedAnswerSemanticCounts).reduce(
    (sum, value) => sum + value,
    0,
  ),
  12_480,
);

const expectedAuthorityCounts = {
  ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE: 960,
  ALTERNATING_BLOCK_COMPLETION: 240,
  COLUMNWISE_FIXED_CLUSTER_MOVEMENT: 2_280,
  COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT: 480,
  CUMULATIVE_PREFIX_CLUSTER: 480,
  CYCLIC_CLUSTER_PERMUTATION: 600,
  EDGE_DELETION_WORD_SEQUENCE: 1_200,
  FIXED_POSITION_PERMUTATION_CLUSTER: 1_440,
  GROWING_CONSECUTIVE_CLUSTER: 600,
  K_INTERLEAVED_CLUSTER_SERIES: 960,
  PATTERNED_INTERIOR_INSERTION_GROWTH: 960,
  REPEATED_BLOCK_COMPLETION: 240,
  SYMMETRIC_EDGE_GROWTH: 600,
  TWO_INTERLEAVED_CLUSTER_SERIES: 1_080,
  VARIABLE_LENGTH_CONSECUTIVE_CLUSTER: 360,
} as const;
assert.equal(
  Object.values(expectedAuthorityCounts).reduce(
    (sum, value) => sum + value,
    0,
  ),
  12_480,
);
assert.deepEqual(
  Object.keys(expectedAuthorityCounts).sort(),
  [...authorityIds].sort(),
);

const sampleQuestionIds = new Set<string>();
let sampleReviews = 0;

function assertCommonSample(
  question: {
    questionId: string;
    permanentQlId: null;
    options: readonly string[];
    correctAnswer: string;
    correctIndex: number;
    lifecycleLocks: Readonly<Record<string, boolean>>;
  },
  review: string,
): void {
  assert.equal(sampleQuestionIds.has(question.questionId), false);
  sampleQuestionIds.add(question.questionId);
  assert.equal(question.permanentQlId, null);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.correctAnswer);
  assert.doesNotMatch(review, /^[✓ ] [A-D]\. /m);
  assert.doesNotMatch(review, /\bOption [A-D]\b/);
  for (const heading of [
    "📌 **Rule**",
    "📝 **Solution**",
    "⚡ **Quick Method**",
    "⚠️ **Common Mistake**",
  ]) {
    assert.equal(review.split(heading).length - 1, 1);
  }
  for (const lock of Object.values(question.lifecycleLocks)) assert.equal(lock, false);
  sampleReviews += 1;
}

for (const id of SER_CP007_TEMPORARY_TEMPLATE_IDS) {
  const question = generateSerCp007Question(id, 1);
  assertCommonSample(question, renderSerCp007Review(question));
}
for (const id of SER_CP007_WAVE_B_TEMPORARY_TEMPLATE_IDS) {
  const question = generateSerCp007WaveBQuestion(id, 1);
  assertCommonSample(question, renderSerCp007WaveBReview(question));
}
for (const id of SER_CP007_WAVE_C_TEMPORARY_TEMPLATE_IDS) {
  const question = generateSerCp007WaveCQuestion(id, 1);
  assertCommonSample(question, renderSerCp007WaveCReview(question));
}
for (const id of SER_CP007_WAVE_D_TEMPORARY_TEMPLATE_IDS) {
  const question = generateSerCp007WaveDQuestion(id, 1);
  assertCommonSample(question, renderSerCp007WaveDReview(question));
}

assert.equal(sampleReviews, 104);
assert.equal(sampleQuestionIds.size, 104);
assert.deepEqual(
  SER_CP007_WAVE_C_EXCLUDED_SURFACES.map((entry) => entry.owner).sort(),
  ["ANA-001", "CLS-001", "COD-001", "SER-CP-006"],
);

const ledgerPath =
  "src/reasoning-v1/topics/Series/SER-001/SER-CP-007-FINAL-AUDIT/ser-cp-007-source-ledger-scaffold.md";
const ledger = readFileSync(ledgerPath, "utf8");
for (const required of [
  "Traceability pass:          IN_PROGRESS",
  "Verified source records:    9 covered/delegated",
  "Pending traced records:     3 grouped or classification-pending",
  "Ledger completeness:       BLOCKED",
  "Page-level traceability:   BLOCKED",
  "English discovery freeze:  BLOCKED",
  "Permanent QLs:             0",
]) {
  assert.ok(ledger.includes(required), `source ledger missing: ${required}`);
}
for (const traceEvidence of [
  "`RADIAN-2022`",
  "`DISHA-VNV`",
  "`SER-SRC-007-001`",
  "`SER-SRC-007-009`",
  "printed p. `6-4`, Example 34",
  "Miscellaneous Question Bank p. `QB-7`, item 167",
  "`CLASSIFICATION_PENDING`",
  "`SATURATION_ONLY`",
]) {
  assert.ok(
    ledger.includes(traceEvidence),
    `source ledger missing trace evidence: ${traceEvidence}`,
  );
}
assert.doesNotMatch(ledger, /Ledger completeness:\s+COMPLETE/);
assert.doesNotMatch(ledger, /English discovery freeze:\s+(?:COMPLETE|FROZEN)/);

console.log(
  JSON.stringify(
    {
      status:
        "PASS_SER_CP007_POST_WAVE_D_MANIFEST_MATH_SATURATED_SOURCE_LEDGER_IN_PROGRESS",
      waves: 4,
      sourceShapedProbes: sourceProbeCount,
      temporaryTemplates: templateIds.length,
      seedsPerTemplate: SEEDS_PER_TEMPLATE,
      generatedQuestions: templateIds.length * SEEDS_PER_TEMPLATE,
      uniqueProvisionalAuthorities: authorityIds.size,
      taskCounts: expectedTaskCounts,
      answerSemanticCounts: expectedAnswerSemanticCounts,
      authorityCounts: expectedAuthorityCounts,
      sampleReviewProofs: sampleReviews,
      delegatedSurfaces: SER_CP007_WAVE_C_EXCLUDED_SURFACES.length,
      mathematicalSaturation: "PROVISIONALLY_COMPLETE",
      traceabilityPass: "IN_PROGRESS",
      verifiedSourceRecords: 9,
      pendingTraceRecords: 3,
      sourceLedger: "BLOCKED",
      pageLevelTraceability: "BLOCKED",
      englishDiscoveryFreeze: "BLOCKED",
      permanentQls: 0,
      questionStudioVisible: 0,
      questionBankWritable: 0,
      testEligible: 0,
      publiclyPublishable: 0,
      localizationStarted: 0,
      cp008Status: "BLOCKED",
      nextAuthority: "SER_CP007_FINAL_SOURCE_LEDGER_AND_ENGLISH_FREEZE_REVIEW",
    },
    null,
    2,
  ),
);
