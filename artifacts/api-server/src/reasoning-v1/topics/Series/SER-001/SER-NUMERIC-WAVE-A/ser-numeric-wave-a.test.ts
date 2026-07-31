import {
  SER_NUMERIC_WAVE_A_CANONICAL_AUTHORITY_IDS,
  SER_NUMERIC_WAVE_A_SOURCE_FAMILY_IDS,
  SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS,
  generateSerNumericWaveAQuestion,
  includesNegativeValue,
  includesNonIntegerValue,
  isStrictlyDescending,
  solveSerNumericWaveASequence,
  type SerNumericWaveACanonicalAuthorityId,
  type SerNumericWaveADifficulty,
  type SerNumericWaveASourceFamilyId,
  type SerNumericWaveATaskKind,
} from "./foundation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerTemplate = 120;
const sourceCounts = new Map<SerNumericWaveASourceFamilyId, number>();
const authorityCounts = new Map<SerNumericWaveACanonicalAuthorityId, number>();
const taskCounts = new Map<SerNumericWaveATaskKind, number>();
const difficultyByTemplate = new Map<string, Map<SerNumericWaveADifficulty, number>>();
const fingerprintsByTemplate = new Map<string, Set<string>>();
const answerPositions = [0, 0, 0, 0];
let generatedQuestions = 0;
let deterministicReplayChecks = 0;
let independentSolverChecks = 0;
let lifecycleChecks = 0;
let zeroStepChecks = 0;
let signedDescendingChecks = 0;
let exactRationalChecks = 0;

for (const temporaryTemplateId of SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS) {
  const difficultyCounts = new Map<SerNumericWaveADifficulty, number>();
  const fingerprints = new Set<string>();
  difficultyByTemplate.set(temporaryTemplateId, difficultyCounts);
  fingerprintsByTemplate.set(temporaryTemplateId, fingerprints);

  for (let seed = 1; seed <= seedsPerTemplate; seed += 1) {
    const question = generateSerNumericWaveAQuestion(temporaryTemplateId, seed);
    const replay = generateSerNumericWaveAQuestion(temporaryTemplateId, seed);
    assert(
      JSON.stringify(replay) === JSON.stringify(question),
      `${question.questionId}: deterministic replay mismatch`,
    );
    deterministicReplayChecks += 1;

    const solved = solveSerNumericWaveASequence(question.taskKind, question.sequence);
    assert(solved.answer === question.correctAnswer, `${question.questionId}: answer mismatch`);
    assert(
      solved.canonicalAuthorityId === question.canonicalAuthorityId,
      `${question.questionId}: canonical authority mismatch`,
    );
    assert(solved.candidateCount === 1, `${question.questionId}: ambiguous canonical pool`);
    assert(
      solved.correctReplacement === question.hiddenState.correctReplacement,
      `${question.questionId}: replacement mismatch`,
    );
    independentSolverChecks += 1;

    assert(question.permanentQlId === null, `${question.questionId}: permanent QL allocated`);
    assert(question.options.length === 4, `${question.questionId}: option count`);
    assert(new Set(question.options).size === 4, `${question.questionId}: duplicate options`);
    assert(
      question.options[question.correctIndex] === question.correctAnswer,
      `${question.questionId}: correct index mismatch`,
    );
    assert(question.explanation.working.length >= 2, `${question.questionId}: thin working`);
    assert(
      question.explanation.trapAnalyses.length === 3,
      `${question.questionId}: trap-analysis count`,
    );
    assert(question.lifecycle.maturity === "OPEN_EXECUTABLE_DISCOVERY", "maturity drift");
    assert(question.lifecycle.sourceSaturation === "OPEN", "source saturation drift");
    assert(!question.lifecycle.active, "unexpected active question");
    assert(!question.lifecycle.questionStudioDiscoverable, "unexpected Question Studio exposure");
    assert(!question.lifecycle.questionBankWritable, "unexpected Question Bank write");
    assert(!question.lifecycle.testEligible, "unexpected test eligibility");
    assert(!question.lifecycle.publiclyPublishable, "unexpected publication");
    lifecycleChecks += 1;

    const canonical = question.hiddenState.canonicalSequence;
    switch (question.sourceFamilyId) {
      case "ZERO_STEP_CONSTANT":
        assert(new Set(canonical).size === 1, `${question.questionId}: zero-step drift`);
        zeroStepChecks += 1;
        break;
      case "DESCENDING_SIGNED_ADDITIVE":
      case "DESCENDING_SIGNED_AFFINE":
        assert(isStrictlyDescending(canonical), `${question.questionId}: not descending`);
        assert(includesNegativeValue(canonical), `${question.questionId}: signed reach missing`);
        signedDescendingChecks += 1;
        break;
      case "FRACTIONAL_ADDITIVE_STEP":
      case "UNIT_FRACTION_MULTIPLICATIVE":
      case "TERMINATING_DECIMAL_AFFINE":
        assert(includesNonIntegerValue(canonical), `${question.questionId}: rational reach missing`);
        exactRationalChecks += 1;
        break;
    }

    sourceCounts.set(
      question.sourceFamilyId,
      (sourceCounts.get(question.sourceFamilyId) ?? 0) + 1,
    );
    authorityCounts.set(
      question.canonicalAuthorityId,
      (authorityCounts.get(question.canonicalAuthorityId) ?? 0) + 1,
    );
    taskCounts.set(question.taskKind, (taskCounts.get(question.taskKind) ?? 0) + 1);
    difficultyCounts.set(
      question.difficulty,
      (difficultyCounts.get(question.difficulty) ?? 0) + 1,
    );
    fingerprints.add(question.mathematicalFingerprint);
    answerPositions[question.correctIndex] += 1;
    generatedQuestions += 1;
  }
}

assert(SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS.length === 24, "template count drift");
assert(SER_NUMERIC_WAVE_A_SOURCE_FAMILY_IDS.length === 6, "source-family count drift");
assert(
  SER_NUMERIC_WAVE_A_CANONICAL_AUTHORITY_IDS.length === 3,
  "canonical-authority count drift",
);
assert(generatedQuestions === 2_880, "generated audit volume drift");
for (const sourceFamilyId of SER_NUMERIC_WAVE_A_SOURCE_FAMILY_IDS) {
  assert(sourceCounts.get(sourceFamilyId) === 480, `${sourceFamilyId}: expected 480 questions`);
}
assert(
  authorityCounts.get("UNIFORM_ADDITIVE_STEP") === 1_440,
  "CP001 domain-extension volume drift",
);
assert(
  authorityCounts.get("UNIFORM_MULTIPLICATIVE_RATIO") === 480,
  "multiplicative domain-extension volume drift",
);
assert(
  authorityCounts.get("AFFINE_MULTIPLY_THEN_ADD") === 960,
  "affine domain-extension volume drift",
);
for (const taskKind of ["NEXT_TERM", "MISSING_TERM", "PREVIOUS_TERM", "WRONG_TERM"] as const) {
  assert(taskCounts.get(taskKind) === 720, `${taskKind}: expected 720 questions`);
}
for (const temporaryTemplateId of SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS) {
  const counts = difficultyByTemplate.get(temporaryTemplateId)!;
  assert(counts.get("EASY") === 40, `${temporaryTemplateId}: EASY count`);
  assert(counts.get("MEDIUM") === 40, `${temporaryTemplateId}: MEDIUM count`);
  assert(counts.get("HARD") === 40, `${temporaryTemplateId}: HARD count`);
  const sourceFamilyId = generateSerNumericWaveAQuestion(temporaryTemplateId, 1).sourceFamilyId;
  const minimumDistinctFingerprints =
    sourceFamilyId === "UNIT_FRACTION_MULTIPLICATIVE" ? 25 : 45;
  assert(
    fingerprintsByTemplate.get(temporaryTemplateId)!.size
      >= minimumDistinctFingerprints,
    `${temporaryTemplateId}: insufficient mathematical diversity`,
  );
}
assert(answerPositions.every((count) => count === 720), "answer-position imbalance");
assert(zeroStepChecks === 480, "zero-step proof volume drift");
assert(signedDescendingChecks === 960, "signed-descending proof volume drift");
assert(exactRationalChecks === 1_440, "exact-rational proof volume drift");

let invalidSeedRejected = false;
try {
  generateSerNumericWaveAQuestion(SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS[0]!, 0);
} catch {
  invalidSeedRejected = true;
}
assert(invalidSeedRejected, "invalid seed was accepted");

let unknownTemplateRejected = false;
try {
  generateSerNumericWaveAQuestion("SER-NUMERIC-WAVE-A-TMP-999", 1);
} catch {
  unknownTemplateRejected = true;
}
assert(unknownTemplateRejected, "unknown template was accepted");

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_NUMERIC_WAVE_A_EDGE_DOMAIN_DISCOVERY",
      permanentQlCount: 0,
      temporaryTemplates: SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS.length,
      sourceFamilies: SER_NUMERIC_WAVE_A_SOURCE_FAMILY_IDS.length,
      existingCanonicalAuthoritiesExtended:
        SER_NUMERIC_WAVE_A_CANONICAL_AUTHORITY_IDS.length,
      generatedQuestions,
      deterministicReplayChecks,
      independentSolverChecks,
      lifecycleChecks,
      zeroStepChecks,
      signedDescendingChecks,
      exactRationalChecks,
      sourceCounts: Object.fromEntries(sourceCounts),
      authorityCounts: Object.fromEntries(authorityCounts),
      taskCounts: Object.fromEntries(taskCounts),
      answerPositions,
      sourceSaturation: "OPEN",
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
    null,
    2,
  ),
);
