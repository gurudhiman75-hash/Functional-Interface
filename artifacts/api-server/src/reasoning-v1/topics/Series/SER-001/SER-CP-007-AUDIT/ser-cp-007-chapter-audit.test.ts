import assert from "node:assert/strict";
import {
  SER_CP007_CANONICAL_AUTHORITY_IDS,
  SER_CP007_OPTION_LABELS,
  SER_CP007_SOURCE_RULE_IDS,
  SER_CP007_TEMPORARY_TEMPLATE_IDS,
  generateSerCp007Question,
  renderSerCp007Review,
} from "../SER-CP-007/foundation";
import {
  SER_CP007_WAVE_B_AUTHORITY_IDS,
  SER_CP007_WAVE_B_OPTION_LABELS,
  SER_CP007_WAVE_B_SOURCE_RULE_IDS,
  SER_CP007_WAVE_B_TEMPORARY_TEMPLATE_IDS,
  generateSerCp007WaveBQuestion,
  renderSerCp007WaveBReview,
} from "../SER-CP-007-WAVE-B/foundation-expanded";
import {
  SER_CP007_WAVE_C_AUTHORITY_IDS,
  SER_CP007_WAVE_C_EXCLUDED_SURFACES,
  SER_CP007_WAVE_C_OPTION_LABELS,
  SER_CP007_WAVE_C_SOURCE_RULE_IDS,
  SER_CP007_WAVE_C_TEMPORARY_TEMPLATE_IDS,
  generateSerCp007WaveCQuestion,
  renderSerCp007WaveCReview,
} from "../SER-CP-007-WAVE-C/foundation-refined";

const SEEDS_PER_TEMPLATE = 120;
const BANNED_LEARNER_WORDS =
  /\b(?:authority|canonical|collision|disposition|taxonomy|vector|token grammar|registered family|ownership)\b/i;

const taskCounts = new Map<string, number>();
const answerSemanticCounts = new Map<string, number>();
const authorityCounts = new Map<string, number>();
const waveCounts = new Map<string, number>();
const questionIds = new Set<string>();
const templateIds = new Set<string>();
const answerPositions = [0, 0, 0, 0];
let generated = 0;
let numericReviewProofs = 0;
let lifecycleProofs = 0;
let crossChapterBoundaryProofs = 0;
let waveBCollisionQuestions = 0;
let waveBRetainedQuestions = 0;
let waveCCollisionQuestions = 0;
let waveCRetainedQuestions = 0;

function increment(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function checkReview(
  review: string,
  labels: readonly string[],
  options: readonly string[],
  correctIndex: number,
  correctAnswer: string,
  questionId: string,
): void {
  assert.equal(options.length, 4);
  assert.equal(new Set(options).size, 4, `${questionId}: duplicate options`);
  assert.equal(options[correctIndex], correctAnswer);
  assert.equal(options.filter((option) => option === correctAnswer).length, 1);
  for (const heading of [
    "📌 **Rule**",
    "📝 **Solution**",
    "⚡ **Quick Method**",
    "⚠️ **Common Mistake**",
  ]) {
    assert.equal(review.split(heading).length - 1, 1, `${questionId}: heading drift`);
  }
  options.forEach((option, index) => {
    const mark = index === correctIndex ? "✓" : " ";
    assert.ok(review.includes(`${mark} ${labels[index]}. ${option}`));
  });
  assert.ok(review.includes(`**Answer:** ${labels[correctIndex]}. ${correctAnswer}`));
  assert.doesNotMatch(review, /^[✓ ] [A-D]\. /m);
  assert.doesNotMatch(review, /\bOption [A-D]\b/);
  assert.doesNotMatch(review, BANNED_LEARNER_WORDS);
  numericReviewProofs += 1;
}

function registerCommon(
  questionId: string,
  temporaryTemplateId: string,
  authorityId: string,
  taskKind: string,
  answerSemantic: string,
  correctIndex: number,
  lifecycleLocks: Readonly<Record<string, boolean>>,
  wave: string,
): void {
  assert.equal(questionIds.has(questionId), false, `${questionId}: duplicate question ID`);
  questionIds.add(questionId);
  templateIds.add(temporaryTemplateId);
  for (const value of Object.values(lifecycleLocks)) assert.equal(value, false);
  lifecycleProofs += 1;
  increment(taskCounts, taskKind);
  increment(answerSemanticCounts, answerSemantic);
  increment(authorityCounts, authorityId);
  increment(waveCounts, wave);
  answerPositions[correctIndex] += 1;
  generated += 1;
}

for (const temporaryTemplateId of SER_CP007_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= SEEDS_PER_TEMPLATE; seed += 1) {
    const question = generateSerCp007Question(temporaryTemplateId, seed);
    assert.deepEqual(generateSerCp007Question(temporaryTemplateId, seed), question);
    assert.equal(question.permanentQlId, null);
    const answerSemantic =
      question.taskKind === "FILL_GAPS"
        ? "FLAT_GAP_LETTER_GROUP"
        : "SINGLE_CLUSTER";
    checkReview(
      renderSerCp007Review(question),
      SER_CP007_OPTION_LABELS,
      question.options,
      question.correctIndex,
      question.correctAnswer,
      question.questionId,
    );
    registerCommon(
      question.questionId,
      question.temporaryTemplateId,
      question.canonicalAuthorityId,
      question.taskKind,
      answerSemantic,
      question.correctIndex,
      question.lifecycleLocks,
      "WAVE_A",
    );
  }
}

for (const temporaryTemplateId of SER_CP007_WAVE_B_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= SEEDS_PER_TEMPLATE; seed += 1) {
    const question = generateSerCp007WaveBQuestion(temporaryTemplateId, seed);
    assert.deepEqual(
      generateSerCp007WaveBQuestion(temporaryTemplateId, seed),
      question,
    );
    assert.equal(question.permanentQlId, null);
    const answerSemantic =
      question.taskKind === "FILL_GAP_GROUPS"
        ? "MULTI_GAP_GROUP_LIST"
        : "SINGLE_CLUSTER";
    checkReview(
      renderSerCp007WaveBReview(question),
      SER_CP007_WAVE_B_OPTION_LABELS,
      question.options,
      question.correctIndex,
      question.correctAnswer,
      question.questionId,
    );
    assert.equal(question.ownershipBoundary.minimumTermWidth, 2);
    assert.equal(question.ownershipBoundary.autonomousSequence, true);
    assert.equal(question.ownershipBoundary.explicitInputOutputMapping, false);
    assert.equal(question.ownershipBoundary.pairRelationTransfer, false);
    assert.equal(question.ownershipBoundary.classifyIndependentOptions, false);
    crossChapterBoundaryProofs += 1;
    if (question.ownershipDisposition === "COLLIDE_SER_CP007_WAVE_A") {
      waveBCollisionQuestions += 1;
    } else {
      waveBRetainedQuestions += 1;
    }
    registerCommon(
      question.questionId,
      question.temporaryTemplateId,
      question.canonicalAuthorityId,
      question.taskKind,
      answerSemantic,
      question.correctIndex,
      question.lifecycleLocks,
      "WAVE_B",
    );
  }
}

for (const temporaryTemplateId of SER_CP007_WAVE_C_TEMPORARY_TEMPLATE_IDS) {
  for (let seed = 1; seed <= SEEDS_PER_TEMPLATE; seed += 1) {
    const question = generateSerCp007WaveCQuestion(temporaryTemplateId, seed);
    assert.deepEqual(
      generateSerCp007WaveCQuestion(temporaryTemplateId, seed),
      question,
    );
    assert.equal(question.permanentQlId, null);
    const answerSemantic =
      question.answerSemantic === "SINGLE_CLUSTER"
        ? "SINGLE_CLUSTER"
        : question.answerSemantic;
    checkReview(
      renderSerCp007WaveCReview(question),
      SER_CP007_WAVE_C_OPTION_LABELS,
      question.options,
      question.correctIndex,
      question.correctAnswer,
      question.questionId,
    );
    assert.equal(question.ownershipBoundary.minimumTermWidth, 2);
    assert.equal(question.ownershipBoundary.autonomousSequence, true);
    assert.equal(question.ownershipBoundary.explicitInputOutputMapping, false);
    assert.equal(question.ownershipBoundary.pairRelationTransfer, false);
    assert.equal(question.ownershipBoundary.classifyIndependentOptions, false);
    crossChapterBoundaryProofs += 1;
    if (question.ownershipDisposition === "COLLIDE_EXISTING_CP007_AUTHORITY") {
      waveCCollisionQuestions += 1;
    } else {
      waveCRetainedQuestions += 1;
    }
    registerCommon(
      question.questionId,
      question.temporaryTemplateId,
      question.canonicalAuthorityId,
      question.taskKind,
      answerSemantic,
      question.correctIndex,
      question.lifecycleLocks,
      "WAVE_C",
    );
  }
}

const authorityIds = new Set([
  ...SER_CP007_CANONICAL_AUTHORITY_IDS,
  ...SER_CP007_WAVE_B_AUTHORITY_IDS,
  ...SER_CP007_WAVE_C_AUTHORITY_IDS,
]);

assert.equal(SER_CP007_SOURCE_RULE_IDS.length, 11);
assert.equal(SER_CP007_WAVE_B_SOURCE_RULE_IDS.length, 8);
assert.equal(SER_CP007_WAVE_C_SOURCE_RULE_IDS.length, 9);
assert.equal(
  SER_CP007_SOURCE_RULE_IDS.length +
    SER_CP007_WAVE_B_SOURCE_RULE_IDS.length +
    SER_CP007_WAVE_C_SOURCE_RULE_IDS.length,
  28,
);
assert.equal(templateIds.size, 72);
assert.equal(authorityIds.size, 12);
assert.equal(generated, 8_640);
assert.equal(questionIds.size, generated);
assert.equal(numericReviewProofs, generated);
assert.equal(lifecycleProofs, generated);
assert.equal(crossChapterBoundaryProofs, 4_560);
assert.deepEqual(answerPositions, [2_160, 2_160, 2_160, 2_160]);
assert.equal(waveBCollisionQuestions, 1_680);
assert.equal(waveBRetainedQuestions, 1_440);
assert.equal(waveCCollisionQuestions, 960);
assert.equal(waveCRetainedQuestions, 480);

assert.deepEqual(
  Object.fromEntries([...waveCounts.entries()].sort()),
  { WAVE_A: 4_080, WAVE_B: 3_120, WAVE_C: 1_440 },
);

assert.deepEqual(
  Object.fromEntries([...taskCounts.entries()].sort()),
  {
    FILL_GAPS: 240,
    FILL_GAP_GROUPS: 240,
    MISSING_TERM: 1_920,
    MISSING_TWO_TERMS: 120,
    NEXT_TERM: 1_920,
    NEXT_TWO_TERMS: 720,
    PREVIOUS_TERM: 1_440,
    WRONG_AND_REPLACEMENT: 120,
    WRONG_TERM: 1_920,
  },
);

assert.deepEqual(
  Object.fromEntries([...answerSemanticCounts.entries()].sort()),
  {
    FLAT_GAP_LETTER_GROUP: 240,
    MULTI_GAP_GROUP_LIST: 240,
    SINGLE_CLUSTER: 7_200,
    TWO_CLUSTER_LIST: 840,
    WRONG_TO_CORRECT_PAIR: 120,
  },
);

assert.deepEqual(
  Object.fromEntries([...authorityCounts.entries()].sort()),
  {
    ALTERNATING_BLOCK_COMPLETION: 240,
    COLUMNWISE_FIXED_CLUSTER_MOVEMENT: 2_280,
    COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT: 480,
    CUMULATIVE_PREFIX_CLUSTER: 480,
    CYCLIC_CLUSTER_PERMUTATION: 600,
    EDGE_DELETION_WORD_SEQUENCE: 1_200,
    GROWING_CONSECUTIVE_CLUSTER: 600,
    K_INTERLEAVED_CLUSTER_SERIES: 480,
    REPEATED_BLOCK_COMPLETION: 240,
    SYMMETRIC_EDGE_GROWTH: 600,
    TWO_INTERLEAVED_CLUSTER_SERIES: 1_080,
    VARIABLE_LENGTH_CONSECUTIVE_CLUSTER: 360,
  },
);

assert.deepEqual(
  SER_CP007_WAVE_C_EXCLUDED_SURFACES.map((entry) => entry.owner).sort(),
  ["ANA-001", "CLS-001", "COD-001", "SER-CP-006"],
);

const unresolvedBlockers = [
  "FIXED_POSITION_PERMUTATION_CLUSTER",
  "ALPHABET_COMPLEMENT_CLUSTER_MOVEMENT",
  "PATTERNED_INTERIOR_INSERTION_GROWTH",
  "FOUR_INTERLEAVED_CLUSTER_ROWS",
  "SOURCE_TO_AUTHORITY_LEDGER",
] as const;
assert.equal(unresolvedBlockers.length, 5);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_CHAPTER_WIDE_GAP_AUDIT_FREEZE_BLOCKED",
      waves: 3,
      sourceShapedProbes: 28,
      temporaryTemplates: templateIds.size,
      seedsPerTemplate: SEEDS_PER_TEMPLATE,
      generated,
      uniqueProvisionalAuthorities: authorityIds.size,
      waveCounts: Object.fromEntries([...waveCounts.entries()].sort()),
      taskCounts: Object.fromEntries([...taskCounts.entries()].sort()),
      answerSemanticCounts: Object.fromEntries(
        [...answerSemanticCounts.entries()].sort(),
      ),
      authorityCounts: Object.fromEntries([...authorityCounts.entries()].sort()),
      answerPositions,
      numericReviewProofs,
      lifecycleProofs,
      crossChapterBoundaryProofs,
      waveBCollisionQuestions,
      waveBRetainedQuestions,
      waveCCollisionQuestions,
      waveCRetainedQuestions,
      delegatedSurfaces: SER_CP007_WAVE_C_EXCLUDED_SURFACES.length,
      unresolvedBlockers,
      englishDiscoveryFreeze: "BLOCKED",
      permanentQls: 0,
      questionStudioVisible: 0,
      questionBankWritable: 0,
      testEligible: 0,
      publiclyPublishable: 0,
      localizationStarted: 0,
      cp008Status: "BLOCKED",
      nextAuthority:
        "SER_CP007_WAVE_D_PERMUTATION_COMPLEMENT_INSERTION_AND_K_ROW_SATURATION",
    },
    null,
    2,
  ),
);
