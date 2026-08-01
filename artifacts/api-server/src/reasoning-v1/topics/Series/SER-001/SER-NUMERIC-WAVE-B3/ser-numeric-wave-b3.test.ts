import {
  SER_WAVE_B3_SOURCE_CATALOG,
  SER_WAVE_B3_SOURCE_FAMILIES,
  SER_WAVE_B3_TEMPLATES,
  finiteDifferenceOrder,
  generateSerWaveB3Question,
  independentlyProject,
} from "./foundation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function countBy(values: readonly string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

const seedsPerTemplate = 120;
let generatedQuestions = 0;
let deterministicReplayChecks = 0;
let independentProjectionChecks = 0;
let lifecycleChecks = 0;
let finiteDifferenceCollisionChecks = 0;
let sourceCatalogChecks = 0;
const taskCounts: Record<string, number> = {};
const familyCounts: Record<string, number> = {};
const authorityCounts: Record<string, number> = {};
const dispositionCounts: Record<string, number> = {};
const answerPositions = [0, 0, 0, 0];

assert(SER_WAVE_B3_SOURCE_FAMILIES.length === 16, "Wave B3 source-family drift");
assert(SER_WAVE_B3_TEMPLATES.length === 64, "Wave B3 template drift");
assert(
  new Set(SER_WAVE_B3_TEMPLATES.map((template) => template.temporaryTemplateId)).size === 64,
  "duplicate Wave B3 template ID",
);
assert(SER_WAVE_B3_SOURCE_CATALOG.length === 18, "Wave B3 source catalog drift");

for (const [patternId, mappedOwner, evidenceReference] of SER_WAVE_B3_SOURCE_CATALOG) {
  assert(patternId.length > 0, "blank source-catalog pattern ID");
  assert(mappedOwner.length > 0, `${patternId}: blank mapped owner`);
  assert(evidenceReference.length > 0, `${patternId}: blank evidence reference`);
  sourceCatalogChecks += 1;
}

for (const template of SER_WAVE_B3_TEMPLATES) {
  for (let seed = 1; seed <= seedsPerTemplate; seed += 1) {
    const question = generateSerWaveB3Question(template, seed);
    const replay = generateSerWaveB3Question(template, seed);
    assert(
      JSON.stringify(question) === JSON.stringify(replay),
      `${question.questionId}: nondeterministic replay`,
    );
    deterministicReplayChecks += 1;

    const independent = independentlyProject(template.sourceFamilyId, seed);
    assert(
      JSON.stringify(independent) === JSON.stringify(question.canonicalSequence),
      `${question.questionId}: independent projection mismatch`,
    );
    independentProjectionChecks += 1;

    assert(question.permanentQlId === null, `${question.questionId}: permanent QL allocated`);
    assert(!question.lifecycle.active, `${question.questionId}: active during discovery`);
    assert(
      !question.lifecycle.questionStudioDiscoverable,
      `${question.questionId}: Question Studio exposed`,
    );
    assert(
      !question.lifecycle.questionBankWritable,
      `${question.questionId}: Question Bank writable`,
    );
    assert(!question.lifecycle.testEligible, `${question.questionId}: test eligible`);
    assert(
      !question.lifecycle.publiclyPublishable,
      `${question.questionId}: publicly publishable`,
    );
    lifecycleChecks += 1;

    generatedQuestions += 1;
    taskCounts[template.taskKind] = (taskCounts[template.taskKind] ?? 0) + 1;
    familyCounts[template.sourceFamilyId] = (familyCounts[template.sourceFamilyId] ?? 0) + 1;
    authorityCounts[template.canonicalAuthorityId] =
      (authorityCounts[template.canonicalAuthorityId] ?? 0) + 1;
    dispositionCounts[template.ownershipDisposition] =
      (dispositionCounts[template.ownershipDisposition] ?? 0) + 1;
    answerPositions[question.correctIndex] += 1;

    if (template.sourceFamilyId === "CONSTANT_NONZERO_SIXTH_DIFFERENCE") {
      assert(
        finiteDifferenceOrder(question.canonicalSequence) === 6,
        `${question.questionId}: expected sixth difference`,
      );
      finiteDifferenceCollisionChecks += 1;
    } else if (template.sourceFamilyId === "CONSTANT_NONZERO_SEVENTH_DIFFERENCE") {
      assert(
        finiteDifferenceOrder(question.canonicalSequence) === 7,
        `${question.questionId}: expected seventh difference`,
      );
      finiteDifferenceCollisionChecks += 1;
    } else if (template.sourceFamilyId === "ADD_CONSECUTIVE_SQUARES") {
      assert(
        finiteDifferenceOrder(question.canonicalSequence) === 3,
        `${question.questionId}: cumulative squares should be cubic`,
      );
      finiteDifferenceCollisionChecks += 1;
    } else if (template.sourceFamilyId === "ADD_CONSECUTIVE_CUBES") {
      assert(
        finiteDifferenceOrder(question.canonicalSequence) === 4,
        `${question.questionId}: cumulative cubes should be quartic`,
      );
      finiteDifferenceCollisionChecks += 1;
    } else if (template.sourceFamilyId === "SQUARES_OF_CONSECUTIVE_ODDS") {
      assert(
        finiteDifferenceOrder(question.canonicalSequence) === 2,
        `${question.questionId}: odd squares should be quadratic`,
      );
      finiteDifferenceCollisionChecks += 1;
    }
  }
}

assert(generatedQuestions === 7_680, "Wave B3 generated-question volume drift");
assert(deterministicReplayChecks === 7_680, "Wave B3 replay volume drift");
assert(independentProjectionChecks === 7_680, "Wave B3 independent-projection volume drift");
assert(lifecycleChecks === 7_680, "Wave B3 lifecycle volume drift");
assert(finiteDifferenceCollisionChecks === 2_400, "Wave B3 finite-difference collision volume drift");
assert(sourceCatalogChecks === 18, "Wave B3 source-catalog proof drift");

for (const family of SER_WAVE_B3_SOURCE_FAMILIES) {
  assert(familyCounts[family] === 480, `${family}: expected 480 questions`);
}
for (const task of ["NEXT_TERM", "MISSING_TERM", "PREVIOUS_TERM", "WRONG_TERM"]) {
  assert(taskCounts[task] === 1_920, `${task}: expected 1,920 questions`);
}
assert(answerPositions.every((count) => count === 1_920), "Wave B3 answer-position imbalance");

const expectedAuthorityCounts = {
  CONSTANT_HIGHER_ORDER_FINITE_DIFFERENCE: 1_440,
  SPECIAL_INCREMENT_SCHEDULE: 480,
  CONSTANT_NONZERO_THIRD_DIFFERENCE: 480,
  CONSTANT_NONZERO_SECOND_DIFFERENCE: 480,
  INDEXED_POWER_SCHEDULE: 480,
  PROGRESSIVE_MULTIPLY_PLUS_ADD: 1_920,
  ALTERNATING_FIXED_AFFINE_PHASE: 480,
  DIGIT_TRANSFORMATION_RECURRENCE: 1_440,
  LINEAR_STATEFUL_RECURRENCE: 480,
};
for (const [authority, expected] of Object.entries(expectedAuthorityCounts)) {
  assert(authorityCounts[authority] === expected, `${authority}: authority volume drift`);
}

assert(
  dispositionCounts.EXTEND_EXISTING_AUTHORITY === 2_400,
  "extension disposition volume drift",
);
assert(
  dispositionCounts.COLLAPSE_TO_EXISTING_AUTHORITY === 3_360,
  "collision disposition volume drift",
);
assert(
  dispositionCounts.RETAIN_NEW_PROVISIONAL_AUTHORITY === 1_920,
  "retained disposition volume drift",
);

const catalogOwnerCounts = countBy(SER_WAVE_B3_SOURCE_CATALOG.map((entry) => entry[1]));
assert(catalogOwnerCounts["SER-WAVE-B3"] === 7, "Wave B3 catalog ownership count drift");

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_NUMERIC_WAVE_B3_AND_WAVE_B_CLOSURE_AUDIT",
      temporaryTemplates: SER_WAVE_B3_TEMPLATES.length,
      sourceFamilies: SER_WAVE_B3_SOURCE_FAMILIES.length,
      generatedQuestions,
      deterministicReplayChecks,
      independentProjectionChecks,
      lifecycleChecks,
      finiteDifferenceCollisionChecks,
      sourceCatalogChecks,
      taskCounts,
      familyCounts,
      authorityCounts,
      dispositionCounts,
      answerPositions,
      sourceCatalogOwnerCounts: catalogOwnerCounts,
      retainedNewProvisionalAuthorities: [
        "SPECIAL_INCREMENT_SCHEDULE",
        "DIGIT_TRANSFORMATION_RECURRENCE",
      ],
      waveBDimensionsClosed: [
        "SPECIAL_NUMBER_AND_RECURRENCE_SOURCE_SATURATION",
        "FOURTH_AND_HIGHER_FINITE_DIFFERENCES",
        "PRIME_GAP_COMPOSITE_NUMBER_AND_CHANGING_POWER_SERIES",
        "RICHER_STATEFUL_RECURRENCES",
        "ALTERNATING_SIGN_PARITY_AND_OPERATOR_SERIES",
      ],
      postWaveBGapStatus: {
        covered: 19,
        partial: 0,
        open: 7,
        permanentFreezeBlockers: 7,
      },
      combinedExecutableEvidence: 37_200,
      permanentQlCount: 0,
      freezeDecision: "BLOCK_PERMANENT_QL_ALLOCATION",
      nextImplementationAuthority: "WAVE_C_REPRESENTATION_AND_ANSWER_SEMANTICS_EXPANSION",
    },
    null,
    2,
  ),
);
