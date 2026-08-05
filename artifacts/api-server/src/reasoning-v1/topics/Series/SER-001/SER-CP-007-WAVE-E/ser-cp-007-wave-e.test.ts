import assert from "node:assert/strict";
import {
  SER_CP007_WAVE_E_AUTHORITY_IDS,
  SER_CP007_WAVE_E_OPTION_LABELS,
  SER_CP007_WAVE_E_SOURCE_RULE_IDS,
  SER_CP007_WAVE_E_TEMPORARY_TEMPLATE_IDS,
  SER_CP007_WAVE_E_TEMPORARY_TEMPLATES,
  generateSerCp007WaveEQuestion,
  renderSerCp007WaveEReview,
  type SerCp007WaveEQuestion,
  type SerCp007WaveESourceRuleId,
} from "./foundation";
import { classifySerCp007WaveESequence } from "./solver";

const SEEDS_PER_TEMPLATE = 120;
const answerPositions = [0, 0, 0, 0];
const sourceCounts = new Map<string, number>();
const authorityCounts = new Map<string, number>();
const taskCounts = new Map<string, number>();
const dispositionCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
const fingerprints = new Map<string, Set<string>>();
let generated = 0;
let numericReviewProofs = 0;
let markerProofs = 0;
let substitutionProofs = 0;
let independentSolverProofs = 0;
let collisionToRotationProofs = 0;
let crossChapterBoundaryProofs = 0;

const BANNED_LEARNER_WORDS =
  /\b(?:authority|canonical|collision|disposition|taxonomy|vector|token grammar|registered family|ownership)\b/i;

const EXPECTED_SOURCE_COUNTS: Record<SerCp007WaveESourceRuleId, number> = {
  SINGLE_MARKER_FIXED_STEP: 480,
  MARKER_BLOCK_FIXED_STEP: 480,
  CASE_STATE_MARKER_OVER_PERIODIC_FRAME: 480,
  MARKER_SHIFT_WITH_FIXED_EDGE_TOKEN: 480,
  MARKER_SHIFT_OVER_PERIODIC_BACKGROUND: 480,
  UNIFORM_FRAME_CASE_MARKER_ROTATION: 480,
  PROGRESSIVE_PREFIX_SUBSTITUTION: 480,
  PROGRESSIVE_SUFFIX_SUBSTITUTION: 480,
  MOVING_PATTERN_BOUNDARY: 480,
};

function increment(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function overlay(frame: string, marker: string, position: number): string {
  return frame.slice(0, position) + marker + frame.slice(position + marker.length);
}

function expectedAnswer(question: SerCp007WaveEQuestion): string {
  return question.hiddenState.canonicalTerms[question.hiddenState.answerIndex]!;
}

function proveMarker(question: SerCp007WaveEQuestion): void {
  const state = question.hiddenState;
  assert.equal(state.familyKind, "MARKER");
  assert.ok(state.backgroundFrame.length >= 2);
  assert.ok(state.marker.length >= 1);
  assert.equal(state.markerPositions.length, state.canonicalTerms.length);
  assert.equal(state.sourceFrame, "");
  assert.equal(state.targetFrame, "");
  assert.equal(state.boundaryPositions.length, 0);
  assert.equal(state.substitutionSide, "NONE");

  state.canonicalTerms.forEach((term, index) => {
    assert.equal(
      term,
      overlay(state.backgroundFrame, state.marker, state.markerPositions[index]!),
    );
    assert.equal(term.length, state.backgroundFrame.length);
  });

  const maximumMarkerPosition = state.backgroundFrame.length - state.marker.length;
  for (let index = 0; index < state.markerPositions.length - 1; index += 1) {
    const current = state.markerPositions[index]!;
    const next = state.markerPositions[index + 1]!;
    if (state.wrap) {
      assert.equal(
        mod(current + state.direction * state.step, maximumMarkerPosition + 1),
        next,
      );
    } else {
      assert.equal(current + state.direction * state.step, next);
    }
  }
  markerProofs += 1;
}

function proveSubstitution(question: SerCp007WaveEQuestion): void {
  const state = question.hiddenState;
  assert.equal(state.familyKind, "SUBSTITUTION");
  assert.equal(state.backgroundFrame, "");
  assert.equal(state.marker, "");
  assert.equal(state.markerPositions.length, 0);
  assert.equal(state.wrap, false);
  assert.ok(state.sourceFrame.length >= 2);
  assert.equal(state.sourceFrame.length, state.targetFrame.length);
  assert.equal(state.boundaryPositions.length, state.canonicalTerms.length);
  assert.ok(state.substitutionSide === "PREFIX" || state.substitutionSide === "SUFFIX");

  state.canonicalTerms.forEach((term, termIndex) => {
    const converted = state.boundaryPositions[termIndex]!;
    const rebuilt = Array.from({ length: state.sourceFrame.length }, (_, index) => {
      const useTarget =
        state.substitutionSide === "PREFIX"
          ? index < converted
          : index >= state.sourceFrame.length - converted;
      return useTarget ? state.targetFrame[index]! : state.sourceFrame[index]!;
    }).join("");
    assert.equal(term, rebuilt);
  });

  for (let index = 0; index < state.boundaryPositions.length - 1; index += 1) {
    assert.equal(
      state.boundaryPositions[index + 1]! - state.boundaryPositions[index]!,
      state.step,
    );
  }
  substitutionProofs += 1;
}

assert.equal(SER_CP007_WAVE_E_SOURCE_RULE_IDS.length, 9);
assert.equal(SER_CP007_WAVE_E_AUTHORITY_IDS.length, 3);
assert.equal(SER_CP007_WAVE_E_TEMPORARY_TEMPLATE_IDS.length, 36);
assert.equal(new Set(SER_CP007_WAVE_E_TEMPORARY_TEMPLATE_IDS).size, 36);
assert.equal(SER_CP007_WAVE_E_TEMPORARY_TEMPLATES.length, 36);

for (const template of SER_CP007_WAVE_E_TEMPORARY_TEMPLATES) {
  const templateFingerprints = new Set<string>();
  fingerprints.set(template.temporaryTemplateId, templateFingerprints);

  for (let seed = 1; seed <= SEEDS_PER_TEMPLATE; seed += 1) {
    const question = generateSerCp007WaveEQuestion(
      template.temporaryTemplateId,
      seed,
    );
    assert.deepEqual(
      generateSerCp007WaveEQuestion(template.temporaryTemplateId, seed),
      question,
    );
    assert.equal(question.packageId, "SER-001");
    assert.equal(question.checkpointId, "SER-CP-007");
    assert.equal(question.waveId, "SER-CP-007-WAVE-E");
    assert.equal(question.permanentQlId, null);
    assert.equal(question.sourceRuleId, template.sourceRuleId);
    assert.equal(question.canonicalAuthorityId, template.canonicalAuthorityId);
    assert.equal(question.ownershipDisposition, template.ownershipDisposition);
    assert.equal(question.taskKind, template.taskKind);
    assert.equal(
      question.solveMode,
      "INFER_MARKER_MOTION_OR_POSITIONAL_SUBSTITUTION",
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

    if (question.hiddenState.familyKind === "MARKER") proveMarker(question);
    else proveSubstitution(question);

    const classification = classifySerCp007WaveESequence(
      question.hiddenState.canonicalTerms,
    );
    assert.equal(classification.fixedWidth, true);
    if (question.sourceRuleId === "UNIFORM_FRAME_CASE_MARKER_ROTATION") {
      assert.ok(classification.markerMotion);
      assert.equal(classification.progressiveSubstitution, null);
      assert.equal(classification.cyclicRotation, true);
      assert.equal(classification.fixedPositionPermutation, true);
      assert.equal(question.canonicalAuthorityId, "CYCLIC_CLUSTER_PERMUTATION");
      assert.equal(
        question.ownershipDisposition,
        "COLLIDE_EXISTING_CP007_AUTHORITY",
      );
      collisionToRotationProofs += 1;
    } else if (question.hiddenState.familyKind === "MARKER") {
      assert.ok(classification.markerMotion);
      assert.equal(classification.progressiveSubstitution, null);
      assert.equal(classification.cyclicRotation, false);
      assert.equal(classification.fixedPositionPermutation, false);
      assert.equal(classification.columnwiseFixedMovement, false);
      assert.equal(
        question.canonicalAuthorityId,
        "MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME",
      );
    } else {
      assert.equal(classification.markerMotion, null);
      assert.ok(classification.progressiveSubstitution);
      assert.equal(classification.cyclicRotation, false);
      assert.equal(classification.fixedPositionPermutation, false);
      assert.equal(classification.columnwiseFixedMovement, false);
      assert.equal(
        question.canonicalAuthorityId,
        "PROGRESSIVE_POSITIONAL_SUBSTITUTION",
      );
    }
    independentSolverProofs += 1;

    const widths = new Set(
      question.hiddenState.canonicalTerms.map((term) => term.length),
    );
    assert.equal(widths.size, 1);
    for (const term of question.hiddenState.canonicalTerms) {
      assert.ok(term.length >= question.ownershipBoundary.minimumTermWidth);
    }
    assert.equal(question.ownershipBoundary.minimumTermWidth, 2);
    assert.equal(question.ownershipBoundary.fixedTermWidth, true);
    assert.equal(question.ownershipBoundary.autonomousSequence, true);
    assert.equal(question.ownershipBoundary.explicitInputOutputMapping, false);
    assert.equal(question.ownershipBoundary.pairRelationTransfer, false);
    assert.equal(question.ownershipBoundary.classifyIndependentOptions, false);
    crossChapterBoundaryProofs += 1;

    const review = renderSerCp007WaveEReview(question);
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
          `${mark} ${SER_CP007_WAVE_E_OPTION_LABELS[index]}. ${option}`,
        ),
      );
    });
    assert.ok(
      review.includes(
        `**Answer:** ${SER_CP007_WAVE_E_OPTION_LABELS[question.correctIndex]}. ${question.correctAnswer}`,
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

assert.equal(generated, 4_320);
assert.deepEqual(answerPositions, [1_080, 1_080, 1_080, 1_080]);
assert.equal(numericReviewProofs, generated);
assert.equal(independentSolverProofs, generated);
assert.equal(crossChapterBoundaryProofs, generated);
assert.equal(markerProofs, 2_880);
assert.equal(substitutionProofs, 1_440);
assert.equal(collisionToRotationProofs, 480);

for (const sourceRuleId of SER_CP007_WAVE_E_SOURCE_RULE_IDS) {
  assert.equal(sourceCounts.get(sourceRuleId), EXPECTED_SOURCE_COUNTS[sourceRuleId]);
}

assert.deepEqual(
  Object.fromEntries([...taskCounts.entries()].sort()),
  {
    MISSING_TERM: 1_080,
    NEXT_TERM: 1_080,
    PREVIOUS_TERM: 1_080,
    WRONG_TERM: 1_080,
  },
);

assert.deepEqual(
  Object.fromEntries([...authorityCounts.entries()].sort()),
  {
    CYCLIC_CLUSTER_PERMUTATION: 480,
    MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME: 2_400,
    PROGRESSIVE_POSITIONAL_SUBSTITUTION: 1_440,
  },
);

assert.deepEqual(
  Object.fromEntries([...dispositionCounts.entries()].sort()),
  {
    COLLIDE_EXISTING_CP007_AUTHORITY: 480,
    PROVISIONAL_RETAIN_CP007: 3_840,
  },
);

for (const template of SER_CP007_WAVE_E_TEMPORARY_TEMPLATES) {
  for (const difficulty of ["EASY", "MEDIUM", "HARD"] as const) {
    assert.equal(
      difficultyCounts.get(`${template.temporaryTemplateId}:${difficulty}`),
      40,
    );
  }
  const minimumFingerprints =
    template.sourceRuleId === "UNIFORM_FRAME_CASE_MARKER_ROTATION" ? 45 : 95;
  assert.ok(
    (fingerprints.get(template.temporaryTemplateId)?.size ?? 0) >=
      minimumFingerprints,
    `${template.temporaryTemplateId}: insufficient fingerprint diversity`,
  );
}

console.log(
  JSON.stringify(
    {
      status:
        "PASS_SER_CP007_WAVE_E_MARKER_AND_POSITIONAL_SUBSTITUTION_DISCOVERY",
      sourceProbes: SER_CP007_WAVE_E_SOURCE_RULE_IDS.length,
      canonicalAuthoritiesInPool: SER_CP007_WAVE_E_AUTHORITY_IDS.length,
      newProvisionalAuthorities: 2,
      temporaryTemplates: SER_CP007_WAVE_E_TEMPORARY_TEMPLATE_IDS.length,
      seedsPerTemplate: SEEDS_PER_TEMPLATE,
      generated,
      taskCounts: Object.fromEntries([...taskCounts.entries()].sort()),
      sourceCounts: Object.fromEntries([...sourceCounts.entries()].sort()),
      authorityCounts: Object.fromEntries([...authorityCounts.entries()].sort()),
      dispositionCounts: Object.fromEntries([...dispositionCounts.entries()].sort()),
      answerPositions,
      markerProofs,
      substitutionProofs,
      independentSolverProofs,
      collisionToRotationProofs,
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
      nextAuthority:
        "SER_CP007_POST_WAVE_E_SOURCE_LEDGER_AND_COLLISION_AUDIT",
    },
    null,
    2,
  ),
);
