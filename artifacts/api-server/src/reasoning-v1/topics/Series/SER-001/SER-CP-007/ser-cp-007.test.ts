import assert from "node:assert/strict";
import {
  SER_CP007_CANONICAL_AUTHORITY_IDS,
  SER_CP007_OPTION_LABELS,
  SER_CP007_SOURCE_RULE_IDS,
  SER_CP007_TEMPORARY_TEMPLATE_IDS,
  SER_CP007_TEMPORARY_TEMPLATES,
  generateSerCp007Question,
  renderSerCp007Review,
  type SerCp007Question,
  type SerCp007SourceRuleId,
  type SerCp007TaskKind,
} from "./foundation";

const SEEDS_PER_TEMPLATE = 120;
const sourceCounts = new Map<string, number>();
const authorityCounts = new Map<string, number>();
const taskCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
const templateFingerprints = new Map<string, Set<string>>();
const answerPositions = [0, 0, 0, 0];
let generated = 0;
let numericLabelReviews = 0;
let intentionalMergedSurfaceQuestions = 0;
let previousExcludedFromNonInvertibleFamilies = 0;

const NON_INVERTIBLE_PREVIOUS_EXCLUSIONS = new Set<SerCp007SourceRuleId>([
  "FIXED_FRONT_DELETION",
  "FIXED_END_DELETION",
  "ALTERNATING_EDGE_DELETION",
  "SHRINKING_CONSECUTIVE_BLOCKS",
  "REPEATED_BLOCK_GAPS",
  "ALTERNATING_BLOCK_GAPS",
]);

const BANNED_REVIEW_WORDS =
  /\b(?:canonical|authority|recurrence|subset|anomaly|phase|token grammar|vector|registered family)\b/i;

function expectedAnswer(question: SerCp007Question): string {
  if (question.taskKind === "FILL_GAPS") {
    const full = question.hiddenState.fullText;
    assert.ok(full);
    const fullText = full as string;
    return question.hiddenState.gapIndexes.map((index) => fullText[index]).join("");
  }
  const answerIndex = question.hiddenState.answerIndex;
  assert.notEqual(answerIndex, null);
  return question.hiddenState.canonicalTerms[answerIndex!];
}

function increment(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function applicableTasks(sourceRuleId: SerCp007SourceRuleId): readonly SerCp007TaskKind[] {
  return SER_CP007_TEMPORARY_TEMPLATES
    .filter((template) => template.sourceRuleId === sourceRuleId)
    .map((template) => template.taskKind);
}

assert.equal(SER_CP007_SOURCE_RULE_IDS.length, 11);
assert.equal(SER_CP007_CANONICAL_AUTHORITY_IDS.length, 8);
assert.equal(SER_CP007_TEMPORARY_TEMPLATE_IDS.length, 34);
assert.equal(new Set(SER_CP007_TEMPORARY_TEMPLATE_IDS).size, 34);

for (const sourceRuleId of NON_INVERTIBLE_PREVIOUS_EXCLUSIONS) {
  assert.equal(
    applicableTasks(sourceRuleId).includes("PREVIOUS_TERM"),
    false,
    `${sourceRuleId}: previous-term task must remain excluded until uniqueness is proved`,
  );
  previousExcludedFromNonInvertibleFamilies += 1;
}

for (const template of SER_CP007_TEMPORARY_TEMPLATES) {
  const fingerprints = new Set<string>();
  templateFingerprints.set(template.temporaryTemplateId, fingerprints);

  for (let seed = 1; seed <= SEEDS_PER_TEMPLATE; seed += 1) {
    const question = generateSerCp007Question(template.temporaryTemplateId, seed);
    const replay = generateSerCp007Question(template.temporaryTemplateId, seed);

    assert.deepEqual(replay, question, `${question.questionId}: deterministic replay drift`);
    assert.equal(question.packageId, "SER-001");
    assert.equal(question.checkpointId, "SER-CP-007");
    assert.equal(question.permanentQlId, null);
    assert.equal(question.sourceRuleId, template.sourceRuleId);
    assert.equal(question.canonicalAuthorityId, template.canonicalAuthorityId);
    assert.equal(question.taskKind, template.taskKind);
    assert.equal(question.answerSemantic, template.answerSemantic);
    assert.equal(question.solveMode, "INFER_CLUSTER_OR_BLOCK_SERIES");
    assert.equal(question.language, "en-IN");

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4, `${question.questionId}: duplicate options`);
    assert.equal(question.options[question.correctIndex], question.correctAnswer);
    assert.equal(
      question.options.filter((option) => option === question.correctAnswer).length,
      1,
      `${question.questionId}: answer must occur exactly once`,
    );
    assert.equal(expectedAnswer(question), question.correctAnswer);

    if (question.taskKind === "WRONG_TERM") {
      assert.notEqual(question.hiddenState.corruptedIndex, null);
      assert.ok(question.hiddenState.displayedWrongTerm);
      assert.notEqual(
        question.hiddenState.displayedWrongTerm,
        question.correctAnswer,
        `${question.questionId}: wrong term did not change`,
      );
      assert.equal(
        question.sequence[question.hiddenState.corruptedIndex!],
        question.hiddenState.displayedWrongTerm,
      );
      assert.match(question.explanation.steps[0]!, /^First write the correct series:/);
    } else {
      assert.equal(question.hiddenState.corruptedIndex, null);
      assert.equal(question.hiddenState.displayedWrongTerm, null);
    }

    if (question.taskKind === "MISSING_TERM") {
      assert.equal(question.sequence.filter((term) => term === null).length, 1);
    }
    if (question.taskKind === "NEXT_TERM") {
      assert.equal(question.sequence.includes(null), false);
      assert.match(question.stem, /come next/i);
    }
    if (question.taskKind === "PREVIOUS_TERM") {
      assert.match(question.stem, /immediately before/i);
      assert.match(question.explanation.steps.join(" "), /move one step backward/i);
    }
    if (question.taskKind === "FILL_GAPS") {
      assert.equal(question.sequence.length, 1);
      assert.match(question.sequence[0] ?? "", /_/);
      assert.ok(question.hiddenState.gapIndexes.length >= 4);
      assert.ok(question.hiddenState.fullText);
      assert.ok(question.hiddenState.maskedText);
    }

    const review = renderSerCp007Review(question);
    for (const heading of [
      "📌 **Rule**",
      "📝 **Solution**",
      "⚡ **Quick Method**",
      "⚠️ **Common Mistake**",
    ]) {
      assert.equal(
        review.split(heading).length - 1,
        1,
        `${question.questionId}: heading drift for ${heading}`,
      );
    }
    question.options.forEach((option, index) => {
      const mark = index === question.correctIndex ? "✓" : " ";
      assert.ok(
        review.includes(`${mark} ${SER_CP007_OPTION_LABELS[index]}. ${option}`),
        `${question.questionId}: missing numeric label ${index + 1}`,
      );
    });
    assert.ok(
      review.includes(
        `**Answer:** ${SER_CP007_OPTION_LABELS[question.correctIndex]}. ${question.correctAnswer}`,
      ),
    );
    assert.doesNotMatch(review, /^[✓ ] [A-D]\. /m);
    assert.doesNotMatch(review, /\bOption [A-D]\b/);
    assert.doesNotMatch(review, BANNED_REVIEW_WORDS);
    numericLabelReviews += 1;

    for (const lock of Object.values(question.lifecycleLocks)) assert.equal(lock, false);

    if (
      question.sourceRuleId === "UNIFORM_COLUMN_SHIFTS" ||
      question.sourceRuleId === "MIXED_COLUMN_SHIFTS" ||
      question.sourceRuleId === "FIXED_FRONT_DELETION" ||
      question.sourceRuleId === "FIXED_END_DELETION" ||
      question.sourceRuleId === "ALTERNATING_EDGE_DELETION"
    ) {
      intentionalMergedSurfaceQuestions += 1;
    }

    increment(sourceCounts, question.sourceRuleId);
    increment(authorityCounts, question.canonicalAuthorityId);
    increment(taskCounts, question.taskKind);
    increment(difficultyCounts, `${question.temporaryTemplateId}:${question.difficulty}`);
    answerPositions[question.correctIndex] += 1;
    fingerprints.add(question.mathematicalFingerprint);
    generated += 1;
  }
}

assert.equal(generated, 4_080);
assert.equal(numericLabelReviews, generated);
assert.deepEqual(answerPositions, [1_020, 1_020, 1_020, 1_020]);

const expectedSourceCounts: Record<SerCp007SourceRuleId, number> = {
  UNIFORM_COLUMN_SHIFTS: 480,
  MIXED_COLUMN_SHIFTS: 480,
  PROGRESSIVE_COLUMN_SHIFTS: 480,
  TWO_INTERLEAVED_CLUSTER_ROWS: 480,
  CYCLIC_CLUSTER_ROTATION: 480,
  FIXED_FRONT_DELETION: 360,
  FIXED_END_DELETION: 360,
  ALTERNATING_EDGE_DELETION: 360,
  SHRINKING_CONSECUTIVE_BLOCKS: 360,
  REPEATED_BLOCK_GAPS: 120,
  ALTERNATING_BLOCK_GAPS: 120,
};

for (const sourceRuleId of SER_CP007_SOURCE_RULE_IDS) {
  assert.equal(sourceCounts.get(sourceRuleId), expectedSourceCounts[sourceRuleId]);
}

assert.deepEqual(
  Object.fromEntries([...taskCounts.entries()].sort()),
  {
    FILL_GAPS: 240,
    MISSING_TERM: 1_080,
    NEXT_TERM: 1_080,
    PREVIOUS_TERM: 600,
    WRONG_TERM: 1_080,
  },
);

assert.deepEqual(
  Object.fromEntries([...authorityCounts.entries()].sort()),
  {
    ALTERNATING_BLOCK_COMPLETION: 120,
    COLUMNWISE_FIXED_CLUSTER_MOVEMENT: 960,
    COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT: 480,
    CYCLIC_CLUSTER_PERMUTATION: 480,
    EDGE_DELETION_WORD_SEQUENCE: 1_080,
    REPEATED_BLOCK_COMPLETION: 120,
    TWO_INTERLEAVED_CLUSTER_SERIES: 480,
    VARIABLE_LENGTH_CONSECUTIVE_CLUSTER: 360,
  },
);

for (const template of SER_CP007_TEMPORARY_TEMPLATES) {
  for (const difficulty of ["EASY", "MEDIUM", "HARD"] as const) {
    assert.equal(
      difficultyCounts.get(`${template.temporaryTemplateId}:${difficulty}`),
      40,
      `${template.temporaryTemplateId}: ${difficulty} reach drift`,
    );
  }
  assert.ok(
    (templateFingerprints.get(template.temporaryTemplateId)?.size ?? 0) >= 95,
    `${template.temporaryTemplateId}: weak fingerprint diversity`,
  );
}

assert.equal(previousExcludedFromNonInvertibleFamilies, 6);
assert.equal(intentionalMergedSurfaceQuestions, 2_040);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_DISCOVERY_FOUNDATION",
      temporaryTemplates: SER_CP007_TEMPORARY_TEMPLATE_IDS.length,
      sourceFamilies: SER_CP007_SOURCE_RULE_IDS.length,
      provisionalAuthorities: SER_CP007_CANONICAL_AUTHORITY_IDS.length,
      generated,
      seedsPerTemplate: SEEDS_PER_TEMPLATE,
      taskCounts: Object.fromEntries([...taskCounts.entries()].sort()),
      sourceCounts: Object.fromEntries([...sourceCounts.entries()].sort()),
      authorityCounts: Object.fromEntries([...authorityCounts.entries()].sort()),
      answerPositions,
      numericLabelReviews,
      technicalLearnerTerms: 0,
      letterOptionLabels: 0,
      intentionalMergedSurfaceQuestions,
      previousTaskExclusions: previousExcludedFromNonInvertibleFamilies,
      permanentQls: 0,
      questionStudioVisible: 0,
      questionBankWritable: 0,
      testEligible: 0,
      publiclyPublishable: 0,
      localizationStarted: 0,
      nextCheckpointStatus: "BLOCKED_UNTIL_CP007_USER_REVIEW",
    },
    null,
    2,
  ),
);
