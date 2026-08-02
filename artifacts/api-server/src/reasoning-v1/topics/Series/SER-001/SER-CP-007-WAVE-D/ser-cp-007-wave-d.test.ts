import assert from "node:assert/strict";
import {
  SER_CP007_WAVE_D_AUTHORITY_IDS,
  SER_CP007_WAVE_D_OPTION_LABELS,
  SER_CP007_WAVE_D_SOURCE_RULE_IDS,
  SER_CP007_WAVE_D_TEMPORARY_TEMPLATE_IDS,
  SER_CP007_WAVE_D_TEMPORARY_TEMPLATES,
  generateSerCp007WaveDQuestion,
  renderSerCp007WaveDReview,
  type SerCp007WaveDQuestion,
  type SerCp007WaveDSourceRuleId,
} from "./foundation";

const SEEDS_PER_TEMPLATE = 120;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const answerPositions = [0, 0, 0, 0];
const sourceCounts = new Map<string, number>();
const authorityCounts = new Map<string, number>();
const taskCounts = new Map<string, number>();
const dispositionCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
const fingerprints = new Map<string, Set<string>>();
let generated = 0;
let numericReviewProofs = 0;
let permutationProofs = 0;
let complementProofs = 0;
let insertionProofs = 0;
let fourRowProofs = 0;
let crossChapterBoundaryProofs = 0;

const BANNED_LEARNER_WORDS =
  /\b(?:authority|canonical|collision|disposition|taxonomy|vector|token grammar|registered family|ownership)\b/i;

const EXPECTED_SOURCE_COUNTS: Record<SerCp007WaveDSourceRuleId, number> = {
  PAIRWISE_ADJACENT_SWAP_PERMUTATION: 480,
  FULL_REVERSAL_PERMUTATION: 480,
  ODD_EVEN_POSITION_REORDERING: 480,
  ALPHABET_COMPLEMENT_CLUSTER: 480,
  ALPHABET_COMPLEMENT_WITH_ROTATION: 480,
  CENTER_INSERTION_GROWTH: 480,
  ALTERNATING_INTERIOR_INSERTION_GROWTH: 480,
  FOUR_INTERLEAVED_CLUSTER_ROWS: 480,
};

function increment(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function positionOf(letter: string): number {
  const position = ALPHABET.indexOf(letter);
  assert.ok(position >= 0);
  return position;
}

function letterAt(position: number): string {
  return ALPHABET[((position % 26) + 26) % 26]!;
}

function applyPermutation(token: string, order: readonly number[]): string {
  return order.map((index) => token[index]).join("");
}

function complement(token: string): string {
  return [...token].map((letter) => letterAt(25 - positionOf(letter))).join("");
}

function rotateLeft(token: string, amount: number): string {
  const safe = ((amount % token.length) + token.length) % token.length;
  return token.slice(safe) + token.slice(0, safe);
}

function insertAt(token: string, index: number, letter: string): string {
  return token.slice(0, index) + letter + token.slice(index);
}

function expectedAnswer(question: SerCp007WaveDQuestion): string {
  return question.hiddenState.canonicalTerms[question.hiddenState.answerIndex]!;
}

function provePermutation(question: SerCp007WaveDQuestion): void {
  const terms = question.hiddenState.canonicalTerms;
  const order = question.hiddenState.permutationOrder;
  assert.ok(order.length >= 3);
  for (let index = 0; index < terms.length - 1; index += 1) {
    assert.equal(applyPermutation(terms[index]!, order), terms[index + 1]);
    assert.deepEqual([...terms[index]!].sort(), [...terms[index + 1]!].sort());
  }
  permutationProofs += 1;
}

function proveComplement(question: SerCp007WaveDQuestion): void {
  const terms = question.hiddenState.canonicalTerms;
  const rotation = question.hiddenState.rotationAmount;
  for (let index = 0; index < terms.length - 1; index += 1) {
    const complemented = complement(terms[index]!);
    const expected = rotation === 0 ? complemented : rotateLeft(complemented, rotation);
    assert.equal(expected, terms[index + 1]);
  }
  complementProofs += 1;
}

function proveInsertion(question: SerCp007WaveDQuestion): void {
  const terms = question.hiddenState.canonicalTerms;
  const indexes = question.hiddenState.insertionIndexes;
  const letters = question.hiddenState.insertedLetters;
  assert.equal(indexes.length, terms.length - 1);
  assert.equal(letters.length, terms.length - 1);
  for (let index = 0; index < terms.length - 1; index += 1) {
    assert.equal(terms[index + 1]!.length, terms[index]!.length + 1);
    assert.equal(
      insertAt(terms[index]!, indexes[index]!, letters[index]!),
      terms[index + 1],
    );
    const removed =
      terms[index + 1]!.slice(0, indexes[index]!) +
      terms[index + 1]!.slice(indexes[index]! + 1);
    assert.equal(removed, terms[index]);
  }
  insertionProofs += 1;
}

function difference(from: string, to: string): number {
  return ((positionOf(to) - positionOf(from)) % 26 + 26) % 26;
}

function proveFourRows(question: SerCp007WaveDQuestion): void {
  const terms = question.hiddenState.canonicalTerms;
  assert.equal(question.hiddenState.rowCount, 4);
  assert.equal(terms.length, 16);
  for (let row = 0; row < 4; row += 1) {
    const rowTerms = terms.filter((_, index) => index % 4 === row);
    assert.equal(rowTerms.length, 4);
    const width = rowTerms[0]!.length;
    for (let column = 0; column < width; column += 1) {
      const differences = rowTerms.slice(0, -1).map((term, index) =>
        difference(term[column]!, rowTerms[index + 1]![column]!),
      );
      assert.equal(new Set(differences).size, 1);
    }
  }
  fourRowProofs += 1;
}

assert.equal(SER_CP007_WAVE_D_SOURCE_RULE_IDS.length, 8);
assert.equal(SER_CP007_WAVE_D_AUTHORITY_IDS.length, 4);
assert.equal(SER_CP007_WAVE_D_TEMPORARY_TEMPLATE_IDS.length, 32);
assert.equal(new Set(SER_CP007_WAVE_D_TEMPORARY_TEMPLATE_IDS).size, 32);
assert.equal(SER_CP007_WAVE_D_TEMPORARY_TEMPLATES.length, 32);

for (const template of SER_CP007_WAVE_D_TEMPORARY_TEMPLATES) {
  const templateFingerprints = new Set<string>();
  fingerprints.set(template.temporaryTemplateId, templateFingerprints);

  for (let seed = 1; seed <= SEEDS_PER_TEMPLATE; seed += 1) {
    const question = generateSerCp007WaveDQuestion(
      template.temporaryTemplateId,
      seed,
    );
    assert.deepEqual(
      generateSerCp007WaveDQuestion(template.temporaryTemplateId, seed),
      question,
    );
    assert.equal(question.packageId, "SER-001");
    assert.equal(question.checkpointId, "SER-CP-007");
    assert.equal(question.waveId, "SER-CP-007-WAVE-D");
    assert.equal(question.permanentQlId, null);
    assert.equal(question.sourceRuleId, template.sourceRuleId);
    assert.equal(question.canonicalAuthorityId, template.canonicalAuthorityId);
    assert.equal(question.ownershipDisposition, template.ownershipDisposition);
    assert.equal(question.taskKind, template.taskKind);
    assert.equal(
      question.solveMode,
      "INFER_PERMUTATION_COMPLEMENT_INSERTION_OR_K_ROW",
    );
    assert.equal(question.language, "en-IN");
    assert.equal(expectedAnswer(question), question.correctAnswer);

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.correctAnswer);
    assert.equal(
      question.options.filter((option) => option === question.correctAnswer).length,
      1,
    );

    if (question.taskKind === "MISSING_TERM") {
      assert.equal(question.sequence.filter((term) => term === null).length, 1);
    }
    if (question.taskKind === "PREVIOUS_TERM") {
      assert.match(question.explanation.steps.join(" "), /move one step backward/i);
    }
    if (question.taskKind === "WRONG_TERM") {
      assert.notEqual(question.hiddenState.corruptedIndex, null);
      assert.ok(question.hiddenState.displayedWrongTerm);
      assert.notEqual(
        question.hiddenState.displayedWrongTerm,
        question.correctAnswer,
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

    switch (question.sourceRuleId) {
      case "PAIRWISE_ADJACENT_SWAP_PERMUTATION":
      case "FULL_REVERSAL_PERMUTATION":
      case "ODD_EVEN_POSITION_REORDERING":
        provePermutation(question);
        break;
      case "ALPHABET_COMPLEMENT_CLUSTER":
      case "ALPHABET_COMPLEMENT_WITH_ROTATION":
        proveComplement(question);
        break;
      case "CENTER_INSERTION_GROWTH":
      case "ALTERNATING_INTERIOR_INSERTION_GROWTH":
        proveInsertion(question);
        break;
      case "FOUR_INTERLEAVED_CLUSTER_ROWS":
        proveFourRows(question);
        break;
    }

    for (const term of question.hiddenState.canonicalTerms) {
      assert.ok(term.length >= question.ownershipBoundary.minimumTermWidth);
    }
    assert.equal(question.ownershipBoundary.minimumTermWidth, 2);
    assert.equal(question.ownershipBoundary.autonomousSequence, true);
    assert.equal(question.ownershipBoundary.explicitInputOutputMapping, false);
    assert.equal(question.ownershipBoundary.pairRelationTransfer, false);
    assert.equal(question.ownershipBoundary.classifyIndependentOptions, false);
    crossChapterBoundaryProofs += 1;

    const review = renderSerCp007WaveDReview(question);
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
          `${mark} ${SER_CP007_WAVE_D_OPTION_LABELS[index]}. ${option}`,
        ),
      );
    });
    assert.ok(
      review.includes(
        `**Answer:** ${SER_CP007_WAVE_D_OPTION_LABELS[question.correctIndex]}. ${question.correctAnswer}`,
      ),
    );
    assert.doesNotMatch(review, /^[✓ ] [A-D]\. /m);
    assert.doesNotMatch(review, /\bOption [A-D]\b/);
    assert.doesNotMatch(review, BANNED_LEARNER_WORDS);
    numericReviewProofs += 1;

    for (const lock of Object.values(question.lifecycleLocks)) assert.equal(lock, false);

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

assert.equal(generated, 3_840);
assert.deepEqual(answerPositions, [960, 960, 960, 960]);
assert.equal(numericReviewProofs, generated);
assert.equal(crossChapterBoundaryProofs, generated);
assert.equal(permutationProofs, 1_440);
assert.equal(complementProofs, 960);
assert.equal(insertionProofs, 960);
assert.equal(fourRowProofs, 480);

for (const sourceRuleId of SER_CP007_WAVE_D_SOURCE_RULE_IDS) {
  assert.equal(sourceCounts.get(sourceRuleId), EXPECTED_SOURCE_COUNTS[sourceRuleId]);
}

assert.deepEqual(
  Object.fromEntries([...taskCounts.entries()].sort()),
  {
    MISSING_TERM: 960,
    NEXT_TERM: 960,
    PREVIOUS_TERM: 960,
    WRONG_TERM: 960,
  },
);

assert.deepEqual(
  Object.fromEntries([...authorityCounts.entries()].sort()),
  {
    ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE: 960,
    FIXED_POSITION_PERMUTATION_CLUSTER: 1_440,
    K_INTERLEAVED_CLUSTER_SERIES: 480,
    PATTERNED_INTERIOR_INSERTION_GROWTH: 960,
  },
);

assert.deepEqual(
  Object.fromEntries([...dispositionCounts.entries()].sort()),
  {
    COLLIDE_EXISTING_CP007_AUTHORITY: 480,
    PROVISIONAL_RETAIN_CP007: 3_360,
  },
);

for (const template of SER_CP007_WAVE_D_TEMPORARY_TEMPLATES) {
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
      status:
        "PASS_SER_CP007_WAVE_D_PERMUTATION_COMPLEMENT_INSERTION_K_ROW_SATURATION",
      sourceProbes: SER_CP007_WAVE_D_SOURCE_RULE_IDS.length,
      provisionalAuthorities: SER_CP007_WAVE_D_AUTHORITY_IDS.length,
      temporaryTemplates: SER_CP007_WAVE_D_TEMPORARY_TEMPLATE_IDS.length,
      seedsPerTemplate: SEEDS_PER_TEMPLATE,
      generated,
      taskCounts: Object.fromEntries([...taskCounts.entries()].sort()),
      sourceCounts: Object.fromEntries([...sourceCounts.entries()].sort()),
      authorityCounts: Object.fromEntries([...authorityCounts.entries()].sort()),
      dispositionCounts: Object.fromEntries([...dispositionCounts.entries()].sort()),
      answerPositions,
      permutationProofs,
      complementProofs,
      insertionProofs,
      fourRowProofs,
      numericReviewProofs,
      crossChapterBoundaryProofs,
      technicalLearnerTerms: 0,
      letterOptionLabels: 0,
      permanentQls: 0,
      questionStudioVisible: 0,
      questionBankWritable: 0,
      testEligible: 0,
      publiclyPublishable: 0,
      localizationStarted: 0,
      nextAuthority: "SER_CP007_FINAL_SOURCE_LEDGER_AND_ENGLISH_FREEZE_REVIEW",
    },
    null,
    2,
  ),
);
