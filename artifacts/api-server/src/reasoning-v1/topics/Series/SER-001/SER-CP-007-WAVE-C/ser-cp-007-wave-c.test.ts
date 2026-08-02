import assert from "node:assert/strict";
import {
  SER_CP007_WAVE_C_AUTHORITY_IDS,
  SER_CP007_WAVE_C_EXCLUDED_SURFACES,
  SER_CP007_WAVE_C_OPTION_LABELS,
  SER_CP007_WAVE_C_SOURCE_RULE_IDS,
  SER_CP007_WAVE_C_TEMPORARY_TEMPLATE_IDS,
  SER_CP007_WAVE_C_TEMPORARY_TEMPLATES,
  generateSerCp007WaveCQuestion,
  renderSerCp007WaveCReview,
  type SerCp007WaveCQuestion,
  type SerCp007WaveCSourceRuleId,
} from "./foundation";

const SEEDS_PER_TEMPLATE = 120;
const answerPositions = [0, 0, 0, 0];
const sourceCounts = new Map<string, number>();
const authorityCounts = new Map<string, number>();
const taskCounts = new Map<string, number>();
const semanticCounts = new Map<string, number>();
const dispositionCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
const fingerprints = new Map<string, Set<string>>();
let generated = 0;
let numericOptionReviews = 0;
let groupedAnswerQuestions = 0;
let wrongReplacementQuestions = 0;
let threeRowStructuralProofs = 0;
let cp006BoundaryProofs = 0;
let codBoundaryProofs = 0;
let analogyBoundaryProofs = 0;
let classificationBoundaryProofs = 0;

const BANNED_LEARNER_WORDS =
  /\b(?:authority|canonical|collision|disposition|taxonomy|vector|token grammar|registered family|ownership)\b/i;

const EXPECTED_SOURCE_COUNTS: Record<SerCp007WaveCSourceRuleId, number> = {
  THREE_INTERLEAVED_CLUSTER_ROWS: 480,
  NEXT_TWO_COLUMNWISE_FIXED: 120,
  NEXT_TWO_INTERLEAVED_ROWS: 120,
  NEXT_TWO_ROTATION: 120,
  NEXT_TWO_EDGE_DELETION: 120,
  MISSING_TWO_COLUMNWISE_FIXED: 120,
  WRONG_WITH_REPLACEMENT_PAIR: 120,
  NEXT_TWO_GROWING_CLUSTER: 120,
  NEXT_TWO_SYMMETRIC_GROWTH: 120,
};

function increment(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function expectedAnswer(question: SerCp007WaveCQuestion): string {
  const terms = question.hiddenState.canonicalTerms;
  switch (question.answerSemantic) {
    case "SINGLE_CLUSTER":
      return terms[question.hiddenState.answerIndexes[0]!]!;
    case "TWO_CLUSTER_LIST":
      return question.hiddenState.answerIndexes.map((index) => terms[index]).join(", ");
    case "WRONG_TO_CORRECT_PAIR":
      assert.ok(question.hiddenState.displayedWrongTerm);
      return `${question.hiddenState.displayedWrongTerm} → ${terms[question.hiddenState.answerIndexes[0]!]}`;
  }
}

function learnerText(question: SerCp007WaveCQuestion): string {
  return [
    question.explanation.rule,
    ...question.explanation.steps,
    question.explanation.quickMethod,
    question.explanation.commonMistake,
    question.explanation.conclusion,
  ].join(" ");
}

function letterDifference(from: string, to: string): number {
  const raw = to.charCodeAt(0) - from.charCodeAt(0);
  return ((raw % 26) + 26) % 26;
}

function proveThreeRows(question: SerCp007WaveCQuestion): void {
  const terms = question.hiddenState.canonicalTerms;
  assert.equal(terms.length, 12);
  for (let row = 0; row < 3; row += 1) {
    const rowTerms = terms.filter((_, index) => index % 3 === row);
    assert.equal(rowTerms.length, 4);
    const width = rowTerms[0]!.length;
    assert.ok(width >= 2);
    for (let column = 0; column < width; column += 1) {
      const differences = rowTerms.slice(0, -1).map((term, index) =>
        letterDifference(term[column]!, rowTerms[index + 1]![column]!),
      );
      assert.equal(new Set(differences).size, 1, `${question.questionId}: row ${row + 1} column ${column + 1} drift`);
    }
  }
  threeRowStructuralProofs += 1;
}

assert.equal(SER_CP007_WAVE_C_SOURCE_RULE_IDS.length, 9);
assert.equal(SER_CP007_WAVE_C_AUTHORITY_IDS.length, 7);
assert.equal(SER_CP007_WAVE_C_TEMPORARY_TEMPLATE_IDS.length, 12);
assert.equal(new Set(SER_CP007_WAVE_C_TEMPORARY_TEMPLATE_IDS).size, 12);
assert.equal(SER_CP007_WAVE_C_EXCLUDED_SURFACES.length, 4);
assert.deepEqual(
  SER_CP007_WAVE_C_EXCLUDED_SURFACES.map((entry) => entry.owner).sort(),
  ["ANA-001", "CLS-001", "COD-001", "SER-CP-006"],
);

for (const template of SER_CP007_WAVE_C_TEMPORARY_TEMPLATES) {
  const templateFingerprints = new Set<string>();
  fingerprints.set(template.temporaryTemplateId, templateFingerprints);

  for (let seed = 1; seed <= SEEDS_PER_TEMPLATE; seed += 1) {
    const question = generateSerCp007WaveCQuestion(
      template.temporaryTemplateId,
      seed,
    );
    assert.deepEqual(
      generateSerCp007WaveCQuestion(template.temporaryTemplateId, seed),
      question,
      `${question.questionId}: replay drift`,
    );

    assert.equal(question.packageId, "SER-001");
    assert.equal(question.checkpointId, "SER-CP-007");
    assert.equal(question.waveId, "SER-CP-007-WAVE-C");
    assert.equal(question.permanentQlId, null);
    assert.equal(question.sourceRuleId, template.sourceRuleId);
    assert.equal(question.canonicalAuthorityId, template.canonicalAuthorityId);
    assert.equal(question.ownershipDisposition, template.ownershipDisposition);
    assert.equal(question.taskKind, template.taskKind);
    assert.equal(question.answerSemantic, template.answerSemantic);
    assert.equal(question.solveMode, "INFER_CLUSTER_SERIES_WITH_GROUPED_ANSWER");
    assert.equal(question.language, "en-IN");

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.correctAnswer);
    assert.equal(
      question.options.filter((option) => option === question.correctAnswer).length,
      1,
    );
    assert.equal(expectedAnswer(question), question.correctAnswer);

    if (question.taskKind === "MISSING_TERM") {
      assert.equal(question.sequence.filter((term) => term === null).length, 1);
    }
    if (question.taskKind === "MISSING_TWO_TERMS") {
      groupedAnswerQuestions += 1;
      assert.equal(question.sequence.filter((term) => term === null).length, 2);
      assert.equal(question.hiddenState.answerIndexes.length, 2);
      assert.match(question.correctAnswer, /, /);
    }
    if (question.taskKind === "NEXT_TWO_TERMS") {
      groupedAnswerQuestions += 1;
      assert.equal(question.hiddenState.answerIndexes.length, 2);
      assert.match(question.correctAnswer, /, /);
      assert.match(question.stem, /two letter groups/i);
    }
    if (question.taskKind === "PREVIOUS_TERM") {
      assert.match(question.explanation.steps.join(" "), /move one step backward/i);
    }
    if (question.taskKind === "WRONG_TERM") {
      assert.notEqual(question.hiddenState.corruptedIndex, null);
      assert.ok(question.hiddenState.displayedWrongTerm);
      assert.match(question.explanation.steps[0]!, /^First write the correct series:/);
    }
    if (question.taskKind === "WRONG_AND_REPLACEMENT") {
      wrongReplacementQuestions += 1;
      assert.notEqual(question.hiddenState.corruptedIndex, null);
      assert.ok(question.hiddenState.displayedWrongTerm);
      assert.match(question.correctAnswer, / → /);
      assert.match(question.stem, /wrong group and its replacement/i);
    }

    if (question.sourceRuleId === "THREE_INTERLEAVED_CLUSTER_ROWS") {
      proveThreeRows(question);
    }

    for (const term of question.hiddenState.canonicalTerms) {
      assert.ok(term.length >= question.ownershipBoundary.minimumTermWidth);
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

    const review = renderSerCp007WaveCReview(question);
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
          `${mark} ${SER_CP007_WAVE_C_OPTION_LABELS[index]}. ${option}`,
        ),
      );
    });
    assert.ok(
      review.includes(
        `**Answer:** ${SER_CP007_WAVE_C_OPTION_LABELS[question.correctIndex]}. ${question.correctAnswer}`,
      ),
    );
    assert.doesNotMatch(review, /^[✓ ] [A-D]\. /m);
    assert.doesNotMatch(review, /\bOption [A-D]\b/);
    assert.doesNotMatch(learnerText(question), BANNED_LEARNER_WORDS);
    numericOptionReviews += 1;

    for (const lock of Object.values(question.lifecycleLocks)) assert.equal(lock, false);

    increment(sourceCounts, question.sourceRuleId);
    increment(authorityCounts, question.canonicalAuthorityId);
    increment(taskCounts, question.taskKind);
    increment(semanticCounts, question.answerSemantic);
    increment(dispositionCounts, question.ownershipDisposition);
    increment(difficultyCounts, `${question.temporaryTemplateId}:${question.difficulty}`);
    answerPositions[question.correctIndex] += 1;
    templateFingerprints.add(question.mathematicalFingerprint);
    generated += 1;
  }
}

assert.equal(generated, 1_440);
assert.equal(numericOptionReviews, generated);
assert.deepEqual(answerPositions, [360, 360, 360, 360]);
assert.equal(groupedAnswerQuestions, 840);
assert.equal(wrongReplacementQuestions, 120);
assert.equal(threeRowStructuralProofs, 480);
assert.equal(cp006BoundaryProofs, generated);
assert.equal(codBoundaryProofs, generated);
assert.equal(analogyBoundaryProofs, generated);
assert.equal(classificationBoundaryProofs, generated);

for (const sourceRuleId of SER_CP007_WAVE_C_SOURCE_RULE_IDS) {
  assert.equal(sourceCounts.get(sourceRuleId), EXPECTED_SOURCE_COUNTS[sourceRuleId]);
}

assert.deepEqual(
  Object.fromEntries([...taskCounts.entries()].sort()),
  {
    MISSING_TERM: 120,
    MISSING_TWO_TERMS: 120,
    NEXT_TERM: 120,
    NEXT_TWO_TERMS: 720,
    PREVIOUS_TERM: 120,
    WRONG_AND_REPLACEMENT: 120,
    WRONG_TERM: 120,
  },
);

assert.deepEqual(
  Object.fromEntries([...semanticCounts.entries()].sort()),
  {
    SINGLE_CLUSTER: 480,
    TWO_CLUSTER_LIST: 840,
    WRONG_TO_CORRECT_PAIR: 120,
  },
);

assert.deepEqual(
  Object.fromEntries([...authorityCounts.entries()].sort()),
  {
    COLUMNWISE_FIXED_CLUSTER_MOVEMENT: 360,
    CYCLIC_CLUSTER_PERMUTATION: 120,
    EDGE_DELETION_WORD_SEQUENCE: 120,
    GROWING_CONSECUTIVE_CLUSTER: 120,
    K_INTERLEAVED_CLUSTER_SERIES: 480,
    SYMMETRIC_EDGE_GROWTH: 120,
    TWO_INTERLEAVED_CLUSTER_SERIES: 120,
  },
);

assert.deepEqual(
  Object.fromEntries([...dispositionCounts.entries()].sort()),
  {
    COLLIDE_EXISTING_CP007_AUTHORITY: 960,
    PROVISIONAL_RETAIN_CP007: 480,
  },
);

for (const template of SER_CP007_WAVE_C_TEMPORARY_TEMPLATES) {
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
      status: "PASS_SER_CP007_WAVE_C_SOURCE_SATURATION_AND_ANSWER_SEMANTICS",
      executableSourceProbes: SER_CP007_WAVE_C_SOURCE_RULE_IDS.length,
      excludedSurfaces: SER_CP007_WAVE_C_EXCLUDED_SURFACES.length,
      provisionalAuthorities: SER_CP007_WAVE_C_AUTHORITY_IDS.length,
      temporaryTemplates: SER_CP007_WAVE_C_TEMPORARY_TEMPLATE_IDS.length,
      seedsPerTemplate: SEEDS_PER_TEMPLATE,
      generated,
      taskCounts: Object.fromEntries([...taskCounts.entries()].sort()),
      answerSemanticCounts: Object.fromEntries([...semanticCounts.entries()].sort()),
      sourceCounts: Object.fromEntries([...sourceCounts.entries()].sort()),
      authorityCounts: Object.fromEntries([...authorityCounts.entries()].sort()),
      dispositionCounts: Object.fromEntries([...dispositionCounts.entries()].sort()),
      answerPositions,
      groupedAnswerQuestions,
      wrongReplacementQuestions,
      threeRowStructuralProofs,
      numericOptionReviews,
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
      nextAuthority: "SER_CP007_CHAPTER_WIDE_GAP_AUDIT_AND_FREEZE_PROPOSAL",
    },
    null,
    2,
  ),
);
