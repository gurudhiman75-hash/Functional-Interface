import {
  SER_NUMERIC_WAVE_B1_CANONICAL_AUTHORITY_IDS,
  SER_NUMERIC_WAVE_B1_SOURCE_FAMILY_IDS,
  SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATE_IDS,
  generateSerNumericWaveB1Question,
  solveSerNumericWaveB1Sequence,
  type SerNumericWaveB1CanonicalAuthorityId,
  type SerNumericWaveB1Difficulty,
  type SerNumericWaveB1OwnershipDisposition,
  type SerNumericWaveB1SourceFamilyId,
  type SerNumericWaveB1TaskKind,
} from "./foundation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerTemplate = 120;
const sourceCounts = new Map<SerNumericWaveB1SourceFamilyId, number>();
const authorityCounts = new Map<SerNumericWaveB1CanonicalAuthorityId, number>();
const taskCounts = new Map<SerNumericWaveB1TaskKind, number>();
const ownershipCounts = new Map<SerNumericWaveB1OwnershipDisposition, number>();
const difficultyByTemplate = new Map<string, Map<SerNumericWaveB1Difficulty, number>>();
const fingerprintsByTemplate = new Map<string, Set<string>>();
const answerPositions = [0, 0, 0, 0];
let generatedQuestions = 0;
let deterministicReplayChecks = 0;
let independentSolverChecks = 0;
let lifecycleChecks = 0;
let higherOrderChecks = 0;
let previousTwoChecks = 0;
let previousThreeChecks = 0;
let cp004GeneralisationChecks = 0;

for (const temporaryTemplateId of SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATE_IDS) {
  const difficulties = new Map<SerNumericWaveB1Difficulty, number>();
  const fingerprints = new Set<string>();
  difficultyByTemplate.set(temporaryTemplateId, difficulties);
  fingerprintsByTemplate.set(temporaryTemplateId, fingerprints);

  for (let seed = 1; seed <= seedsPerTemplate; seed += 1) {
    const question = generateSerNumericWaveB1Question(temporaryTemplateId, seed);
    const replay = generateSerNumericWaveB1Question(temporaryTemplateId, seed);
    assert(
      JSON.stringify(replay) === JSON.stringify(question),
      `${question.questionId}: deterministic replay mismatch`,
    );
    deterministicReplayChecks += 1;

    const solved = solveSerNumericWaveB1Sequence(question.taskKind, question.sequence);
    assert(solved.answer === question.correctAnswer, `${question.questionId}: answer mismatch`);
    assert(
      solved.canonicalAuthorityId === question.canonicalAuthorityId,
      `${question.questionId}: authority mismatch`,
    );
    assert(solved.candidateCount === 1, `${question.questionId}: ambiguous candidate pool`);
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
      `${question.questionId}: correct-index mismatch`,
    );
    assert(question.explanation.working.length >= 2, `${question.questionId}: thin working`);
    assert(
      question.explanation.trapAnalyses.length === 4,
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

    if (question.canonicalAuthorityId === "CONSTANT_HIGHER_ORDER_FINITE_DIFFERENCE") {
      higherOrderChecks += 1;
    } else if (
      question.sourceFamilyId === "ADD_PREVIOUS_TWO_REPROBE"
      || question.sourceFamilyId === "DIFFERENCE_PREVIOUS_TWO"
      || question.sourceFamilyId === "WEIGHTED_PREVIOUS_TWO"
      || question.sourceFamilyId === "AFFINE_PREVIOUS_TWO_PLUS_CONSTANT"
    ) {
      previousTwoChecks += 1;
    } else {
      previousThreeChecks += 1;
    }
    if (question.sourceFamilyId === "ADD_PREVIOUS_TWO_REPROBE") {
      assert(
        question.ownershipDisposition === "PROVISIONAL_GENERALISE_CP004",
        `${question.questionId}: CP004 generalisation disposition drift`,
      );
      cp004GeneralisationChecks += 1;
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
    ownershipCounts.set(
      question.ownershipDisposition,
      (ownershipCounts.get(question.ownershipDisposition) ?? 0) + 1,
    );
    difficulties.set(
      question.difficulty,
      (difficulties.get(question.difficulty) ?? 0) + 1,
    );
    fingerprints.add(question.mathematicalFingerprint);
    answerPositions[question.correctIndex] += 1;
    generatedQuestions += 1;
  }
}

assert(SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATE_IDS.length === 32, "template count drift");
assert(SER_NUMERIC_WAVE_B1_SOURCE_FAMILY_IDS.length === 8, "source-family count drift");
assert(
  SER_NUMERIC_WAVE_B1_CANONICAL_AUTHORITY_IDS.length === 2,
  "canonical-authority count drift",
);
assert(generatedQuestions === 3_840, "generated audit volume drift");
for (const sourceFamilyId of SER_NUMERIC_WAVE_B1_SOURCE_FAMILY_IDS) {
  assert(sourceCounts.get(sourceFamilyId) === 480, `${sourceFamilyId}: source volume drift`);
}
assert(
  authorityCounts.get("CONSTANT_HIGHER_ORDER_FINITE_DIFFERENCE") === 960,
  "higher-order authority volume drift",
);
assert(
  authorityCounts.get("LINEAR_STATEFUL_RECURRENCE") === 2_880,
  "stateful recurrence authority volume drift",
);
for (const taskKind of ["NEXT_TERM", "MISSING_TERM", "PREVIOUS_TERM", "WRONG_TERM"] as const) {
  assert(taskCounts.get(taskKind) === 960, `${taskKind}: task volume drift`);
}
assert(
  ownershipCounts.get("PROVISIONAL_EXTENSION_CP003") === 960,
  "CP003 extension volume drift",
);
assert(
  ownershipCounts.get("PROVISIONAL_GENERALISE_CP004") === 480,
  "CP004 generalisation volume drift",
);
assert(
  ownershipCounts.get("PROVISIONAL_NEW_WAVE_B1") === 2_400,
  "new Wave B1 volume drift",
);
for (const temporaryTemplateId of SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATE_IDS) {
  const counts = difficultyByTemplate.get(temporaryTemplateId)!;
  assert(counts.get("EASY") === 40, `${temporaryTemplateId}: EASY count`);
  assert(counts.get("MEDIUM") === 40, `${temporaryTemplateId}: MEDIUM count`);
  assert(counts.get("HARD") === 40, `${temporaryTemplateId}: HARD count`);
  assert(
    fingerprintsByTemplate.get(temporaryTemplateId)!.size >= 55,
    `${temporaryTemplateId}: insufficient mathematical diversity`,
  );
}
assert(answerPositions.every((count) => count === 960), "answer-position imbalance");
assert(higherOrderChecks === 960, "higher-order proof volume drift");
assert(previousTwoChecks === 1_920, "previous-two proof volume drift");
assert(previousThreeChecks === 960, "previous-three proof volume drift");
assert(cp004GeneralisationChecks === 480, "CP004 generalisation proof drift");

let invalidSeedRejected = false;
try {
  generateSerNumericWaveB1Question(SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATE_IDS[0]!, 0);
} catch {
  invalidSeedRejected = true;
}
assert(invalidSeedRejected, "invalid seed was accepted");

let unknownTemplateRejected = false;
try {
  generateSerNumericWaveB1Question("SER-NUMERIC-WAVE-B1-TMP-999", 1);
} catch {
  unknownTemplateRejected = true;
}
assert(unknownTemplateRejected, "unknown template was accepted");

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_NUMERIC_WAVE_B1_HIGHER_ORDER_AND_RECURRENCE_DISCOVERY",
      permanentQlCount: 0,
      temporaryTemplates: SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATE_IDS.length,
      sourceFamilies: SER_NUMERIC_WAVE_B1_SOURCE_FAMILY_IDS.length,
      provisionalCanonicalAuthorities:
        SER_NUMERIC_WAVE_B1_CANONICAL_AUTHORITY_IDS.length,
      generatedQuestions,
      deterministicReplayChecks,
      independentSolverChecks,
      lifecycleChecks,
      higherOrderChecks,
      previousTwoChecks,
      previousThreeChecks,
      cp004GeneralisationChecks,
      sourceCounts: Object.fromEntries(sourceCounts),
      authorityCounts: Object.fromEntries(authorityCounts),
      taskCounts: Object.fromEntries(taskCounts),
      ownershipCounts: Object.fromEntries(ownershipCounts),
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
