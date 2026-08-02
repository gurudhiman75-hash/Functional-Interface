import assert from "node:assert/strict";
import {
  SER_CP007_WAVE_B_AUTHORITY_IDS,
  SER_CP007_WAVE_B_OPTION_LABELS,
  SER_CP007_WAVE_B_SOURCE_RULE_IDS,
  SER_CP007_WAVE_B_TEMPORARY_TEMPLATE_IDS,
  SER_CP007_WAVE_B_TEMPORARY_TEMPLATES,
  generateSerCp007WaveBQuestion,
  renderSerCp007WaveBReview,
  type SerCp007WaveBQuestion,
  type SerCp007WaveBSourceRuleId,
} from "./foundation-expanded";

const SEEDS_PER_TEMPLATE = 120;
const answerPositions = [0, 0, 0, 0];
const sourceCounts = new Map<string, number>();
const authorityCounts = new Map<string, number>();
const taskCounts = new Map<string, number>();
const dispositionCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
const fingerprints = new Map<string, Set<string>>();
let generated = 0;
let numericOptionReviews = 0;
let cp006BoundaryProofs = 0;
let codBoundaryProofs = 0;
let analogyBoundaryProofs = 0;
let classificationBoundaryProofs = 0;
let multiGapQuestions = 0;
let retainedCandidateQuestions = 0;
let waveACollisionQuestions = 0;

const BANNED_LEARNER_WORDS =
  /\b(?:authority|canonical|collision|disposition|taxonomy|vector|token grammar|registered family|ownership)\b/i;

const EXPECTED_SOURCE_COUNTS: Record<SerCp007WaveBSourceRuleId, number> = {
  PAIRED_EDGE_SHIFTS: 480,
  FIXED_OUTER_FRAME_CORE_SHIFT: 480,
  ALTERNATING_FRAME_CORE_ROWS: 480,
  GROWING_CONSECUTIVE_BLOCKS: 480,
  CUMULATIVE_PREFIX_GROWTH: 480,
  SYMMETRIC_EDGE_GROWTH: 480,
  REPEATED_BLOCK_MULTI_GAP_GROUPS: 120,
  ALTERNATING_BLOCK_MULTI_GAP_GROUPS: 120,
};

function increment(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function expectedAnswer(question: SerCp007WaveBQuestion): string {
  if (question.taskKind === "FILL_GAP_GROUPS") {
    const fullText = question.hiddenState.fullText;
    assert.ok(fullText);
    return question.hiddenState.gapGroups
      .map((group) => group.map((index) => fullText[index]).join(""))
      .join(", ");
  }
  assert.notEqual(question.hiddenState.answerIndex, null);
  return question.hiddenState.canonicalTerms[question.hiddenState.answerIndex!];
}

function learnerText(question: SerCp007WaveBQuestion): string {
  return [
    question.explanation.rule,
    ...question.explanation.steps,
    question.explanation.quickMethod,
    question.explanation.commonMistake,
    question.explanation.conclusion,
  ].join(" ");
}

assert.equal(SER_CP007_WAVE_B_SOURCE_RULE_IDS.length, 8);
assert.equal(SER_CP007_WAVE_B_AUTHORITY_IDS.length, 7);
assert.equal(SER_CP007_WAVE_B_TEMPORARY_TEMPLATE_IDS.length, 26);
assert.equal(new Set(SER_CP007_WAVE_B_TEMPORARY_TEMPLATE_IDS).size, 26);
assert.equal(SER_CP007_WAVE_B_TEMPORARY_TEMPLATES.length, 26);

for (const template of SER_CP007_WAVE_B_TEMPORARY_TEMPLATES) {
  const templateFingerprints = new Set<string>();
  fingerprints.set(template.temporaryTemplateId, templateFingerprints);

  for (let seed = 1; seed <= SEEDS_PER_TEMPLATE; seed += 1) {
    const question = generateSerCp007WaveBQuestion(
      template.temporaryTemplateId,
      seed,
    );
    assert.deepEqual(
      generateSerCp007WaveBQuestion(template.temporaryTemplateId, seed),
      question,
      `${question.questionId}: replay drift`,
    );

    assert.equal(question.packageId, "SER-001");
    assert.equal(question.checkpointId, "SER-CP-007");
    assert.equal(question.waveId, "SER-CP-007-WAVE-B");
    assert.equal(question.permanentQlId, null);
    assert.equal(question.sourceRuleId, template.sourceRuleId);
    assert.equal(question.canonicalAuthorityId, template.canonicalAuthorityId);
    assert.equal(question.ownershipDisposition, template.ownershipDisposition);
    assert.equal(question.taskKind, template.taskKind);
    assert.equal(question.solveMode, "INFER_RICH_CLUSTER_GRAMMAR");
    assert.equal(question.language, "en-IN");

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4, `${question.questionId}: duplicate options`);
    assert.equal(question.options[question.correctIndex], question.correctAnswer);
    assert.equal(
      question.options.filter((option) => option === question.correctAnswer).length,
      1,
    );
    assert.equal(expectedAnswer(question), question.correctAnswer);

    if (question.taskKind === "WRONG_TERM") {
      assert.notEqual(question.hiddenState.corruptedIndex, null);
      assert.ok(question.hiddenState.displayedWrongTerm);
      assert.notEqual(question.hiddenState.displayedWrongTerm, question.correctAnswer);
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
    if (question.taskKind === "PREVIOUS_TERM") {
      assert.match(question.explanation.steps.join(" "), /move one step backward/i);
    }
    if (question.taskKind === "FILL_GAP_GROUPS") {
      multiGapQuestions += 1;
      assert.equal(question.sequence.length, 1);
      assert.match(question.sequence[0] ?? "", /_/);
      assert.ok(question.hiddenState.gapGroups.length >= 2);
      assert.equal(
        question.hiddenState.answerGroups.length,
        question.hiddenState.gapGroups.length,
      );
      assert.equal(
        question.correctAnswer,
        question.hiddenState.answerGroups.join(", "),
      );
      assert.match(question.correctAnswer, /, /);
    } else {
      for (const term of question.hiddenState.canonicalTerms) {
        assert.ok(
          term.length >= question.ownershipBoundary.minimumTermWidth,
          `${question.questionId}: width-one item would belong to CP-006`,
        );
      }
    }

    assert.equal(question.ownershipBoundary.minimumTermWidth, 2);
    assert.equal(question.ownershipBoundary.autonomousSequence, true);
    assert.equal(question.ownershipBoundary.explicitInputOutputMapping, false);
    assert.equal(question.ownershipBoundary.pairRelationTransfer, false);
    assert.equal(question.ownershipBoundary.classifyIndependentOptions, false);
    cp006BoundaryProofs += 1;
    codBoundaryProofs += 1;
    analogyBoundaryProofs += 1;
    classificationBoundaryProofs += 1;

    const review = renderSerCp007WaveBReview(question);
    for (const heading of [
      "📌 **Rule**",
      "📝 **Solution**",
      "⚡ **Quick Method**",
      "⚠️ **Common Mistake**",
    ]) {
      assert.equal(review.split(heading).length - 1, 1);
    }
    question.options.forEach((option, index) => {
      const mark = index === question.correctIndex ? "✓" : " ";
      assert.ok(
        review.includes(
          `${mark} ${SER_CP007_WAVE_B_OPTION_LABELS[index]}. ${option}`,
        ),
      );
    });
    assert.ok(
      review.includes(
        `**Answer:** ${SER_CP007_WAVE_B_OPTION_LABELS[question.correctIndex]}. ${question.correctAnswer}`,
      ),
    );
    assert.doesNotMatch(review, /^[✓ ] [A-D]\. /m);
    assert.doesNotMatch(review, /\bOption [A-D]\b/);
    assert.doesNotMatch(learnerText(question), BANNED_LEARNER_WORDS);
    numericOptionReviews += 1;

    for (const lock of Object.values(question.lifecycleLocks)) assert.equal(lock, false);

    if (question.ownershipDisposition === "COLLIDE_SER_CP007_WAVE_A") {
      waveACollisionQuestions += 1;
    } else {
      retainedCandidateQuestions += 1;
    }

    increment(sourceCounts, question.sourceRuleId);
    increment(authorityCounts, question.canonicalAuthorityId);
    increment(taskCounts, question.taskKind);
    increment(dispositionCounts, question.ownershipDisposition);
    increment(difficultyCounts, `${question.temporaryTemplateId}:${question.difficulty}`);
    answerPositions[question.correctIndex] += 1;
    templateFingerprints.add(question.mathematicalFingerprint);
    generated += 1;
  }
}

assert.equal(generated, 3_120);
assert.equal(numericOptionReviews, generated);
assert.deepEqual(answerPositions, [780, 780, 780, 780]);
assert.equal(cp006BoundaryProofs, generated);
assert.equal(codBoundaryProofs, generated);
assert.equal(analogyBoundaryProofs, generated);
assert.equal(classificationBoundaryProofs, generated);
assert.equal(multiGapQuestions, 240);
assert.equal(waveACollisionQuestions, 1_680);
assert.equal(retainedCandidateQuestions, 1_440);

for (const sourceRuleId of SER_CP007_WAVE_B_SOURCE_RULE_IDS) {
  assert.equal(sourceCounts.get(sourceRuleId), EXPECTED_SOURCE_COUNTS[sourceRuleId]);
}

assert.deepEqual(
  Object.fromEntries([...taskCounts.entries()].sort()),
  {
    FILL_GAP_GROUPS: 240,
    MISSING_TERM: 720,
    NEXT_TERM: 720,
    PREVIOUS_TERM: 720,
    WRONG_TERM: 720,
  },
);

assert.deepEqual(
  Object.fromEntries([...authorityCounts.entries()].sort()),
  {
    ALTERNATING_BLOCK_COMPLETION: 120,
    COLUMNWISE_FIXED_CLUSTER_MOVEMENT: 960,
    CUMULATIVE_PREFIX_CLUSTER: 480,
    GROWING_CONSECUTIVE_CLUSTER: 480,
    REPEATED_BLOCK_COMPLETION: 120,
    SYMMETRIC_EDGE_GROWTH: 480,
    TWO_INTERLEAVED_CLUSTER_SERIES: 480,
  },
);

assert.deepEqual(
  Object.fromEntries([...dispositionCounts.entries()].sort()),
  {
    COLLIDE_SER_CP007_WAVE_A: 1_680,
    PROVISIONAL_RETAIN_CP007: 1_440,
  },
);

for (const template of SER_CP007_WAVE_B_TEMPORARY_TEMPLATES) {
  for (const difficulty of ["EASY", "MEDIUM", "HARD"] as const) {
    assert.equal(
      difficultyCounts.get(`${template.temporaryTemplateId}:${difficulty}`),
      40,
    );
  }
  assert.ok(
    (fingerprints.get(template.temporaryTemplateId)?.size ?? 0) >= 95,
    `${template.temporaryTemplateId}: insufficient fingerprint diversity`,
  );
}

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_WAVE_B_RICH_CLUSTER_COLLISION_AUDIT",
      sourceProbes: SER_CP007_WAVE_B_SOURCE_RULE_IDS.length,
      provisionalAuthorities: SER_CP007_WAVE_B_AUTHORITY_IDS.length,
      temporaryTemplates: SER_CP007_WAVE_B_TEMPORARY_TEMPLATE_IDS.length,
      seedsPerTemplate: SEEDS_PER_TEMPLATE,
      generated,
      taskCounts: Object.fromEntries([...taskCounts.entries()].sort()),
      sourceCounts: Object.fromEntries([...sourceCounts.entries()].sort()),
      authorityCounts: Object.fromEntries([...authorityCounts.entries()].sort()),
      dispositionCounts: Object.fromEntries([...dispositionCounts.entries()].sort()),
      answerPositions,
      numericOptionReviews,
      multiGapQuestions,
      cp006BoundaryProofs,
      codingDecodingBoundaryProofs: codBoundaryProofs,
      analogyBoundaryProofs,
      classificationBoundaryProofs,
      technicalLearnerTerms: 0,
      letterOptionLabels: 0,
      permanentQls: 0,
      questionStudioVisible: 0,
      questionBankWritable: 0,
      testEligible: 0,
      publiclyPublishable: 0,
      localizationStarted: 0,
      nextAuthority: "SER_CP007_WAVE_C_SOURCE_SATURATION_AND_ANSWER_SEMANTICS",
    },
    null,
    2,
  ),
);
