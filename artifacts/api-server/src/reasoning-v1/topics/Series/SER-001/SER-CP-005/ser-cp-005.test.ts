import {
  SER_CP005_CANONICAL_AUTHORITY_IDS,
  SER_CP005_SOURCE_RULE_IDS,
  SER_CP005_TEMPORARY_TEMPLATE_IDS,
  generateSerCp005Question,
  solveSerCp005Sequence,
  type SerCp005CanonicalAuthorityId,
  type SerCp005Difficulty,
  type SerCp005OwnershipDisposition,
  type SerCp005SourceRuleId,
  type SerCp005TaskKind,
} from "./foundation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerTemplate = 120;
const sourceRuleCounts = new Map<SerCp005SourceRuleId, number>();
const authorityCounts = new Map<SerCp005CanonicalAuthorityId, number>();
const taskCounts = new Map<SerCp005TaskKind, number>();
const difficultyByTemplate = new Map<string, Map<SerCp005Difficulty, number>>();
const fingerprintsByTemplate = new Map<string, Set<string>>();
const ownershipCounts = new Map<SerCp005OwnershipDisposition, number>();
const answerPositions = [0, 0, 0, 0];
let generatedQuestions = 0;
let deterministicReplayChecks = 0;
let independentSolverChecks = 0;
let lifecycleChecks = 0;
let representationCollisionQuestions = 0;

for (const temporaryTemplateId of SER_CP005_TEMPORARY_TEMPLATE_IDS) {
  const difficultyCounts = new Map<SerCp005Difficulty, number>();
  const fingerprints = new Set<string>();
  difficultyByTemplate.set(temporaryTemplateId, difficultyCounts);
  fingerprintsByTemplate.set(temporaryTemplateId, fingerprints);

  for (let seed = 1; seed <= seedsPerTemplate; seed += 1) {
    const question = generateSerCp005Question(temporaryTemplateId, seed);
    const replay = generateSerCp005Question(temporaryTemplateId, seed);
    assert(
      JSON.stringify(question) === JSON.stringify(replay),
      `${question.questionId}: deterministic replay mismatch`,
    );
    deterministicReplayChecks += 1;

    const solved = solveSerCp005Sequence(question.taskKind, question.sequence);
    assert(solved.answer === question.correctAnswer, `${question.questionId}: answer mismatch`);
    assert(
      solved.canonicalAuthorityId === question.canonicalAuthorityId,
      `${question.questionId}: canonical authority mismatch`,
    );
    assert(
      solved.representationRuleIds.includes(question.sourceRuleId),
      `${question.questionId}: source representation missing`,
    );
    assert(solved.candidateCount === 1, `${question.questionId}: ambiguous canonical pool`);
    assert(
      solved.correctReplacement === question.hiddenState.correctReplacement,
      `${question.questionId}: replacement mismatch`,
    );
    if (solved.representationCount > 1) representationCollisionQuestions += 1;
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

    sourceRuleCounts.set(
      question.sourceRuleId,
      (sourceRuleCounts.get(question.sourceRuleId) ?? 0) + 1,
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
    ownershipCounts.set(
      question.ownershipDisposition,
      (ownershipCounts.get(question.ownershipDisposition) ?? 0) + 1,
    );
    answerPositions[question.correctIndex] += 1;
    generatedQuestions += 1;
  }
}

assert(SER_CP005_TEMPORARY_TEMPLATE_IDS.length === 40, "temporary-template count drift");
assert(SER_CP005_SOURCE_RULE_IDS.length === 10, "source-rule count drift");
assert(SER_CP005_CANONICAL_AUTHORITY_IDS.length === 6, "canonical-authority count drift");
assert(generatedQuestions === 4_800, "generated audit volume drift");
for (const sourceRuleId of SER_CP005_SOURCE_RULE_IDS) {
  assert(sourceRuleCounts.get(sourceRuleId) === 480, `${sourceRuleId}: expected 480 questions`);
}
for (const taskKind of ["NEXT_TERM", "MISSING_TERM", "PREVIOUS_TERM", "WRONG_TERM"] as const) {
  assert(taskCounts.get(taskKind) === 1_200, `${taskKind}: expected 1,200 questions`);
}
for (const temporaryTemplateId of SER_CP005_TEMPORARY_TEMPLATE_IDS) {
  const counts = difficultyByTemplate.get(temporaryTemplateId)!;
  assert(counts.get("EASY") === 40, `${temporaryTemplateId}: EASY count`);
  assert(counts.get("MEDIUM") === 40, `${temporaryTemplateId}: MEDIUM count`);
  assert(counts.get("HARD") === 40, `${temporaryTemplateId}: HARD count`);
  assert(
    fingerprintsByTemplate.get(temporaryTemplateId)!.size >= 35,
    `${temporaryTemplateId}: insufficient mathematical diversity`,
  );
}
assert(
  authorityCounts.get("TWO_INTERLEAVED_ARITHMETIC") === 960,
  "interleaved arithmetic authority volume drift",
);
assert(
  authorityCounts.get("TWO_INTERLEAVED_GEOMETRIC") === 960,
  "interleaved geometric authority volume drift",
);
assert(
  authorityCounts.get("INTERLEAVED_ARITHMETIC_GEOMETRIC") === 480,
  "mixed interleaved authority volume drift",
);
assert(
  authorityCounts.get("ALTERNATING_FIXED_AFFINE_PHASE") === 960,
  "fixed affine phase authority volume drift",
);
assert(
  authorityCounts.get("PROGRESSIVE_MULTIPLY_PLUS_ADD") === 480,
  "progressive multiply-plus-add authority volume drift",
);
assert(
  authorityCounts.get("PROGRESSIVE_ALTERNATING_AFFINE_CYCLES") === 960,
  "progressive cycle authority volume drift",
);
assert(
  ownershipCounts.get("PROVISIONAL_RETAIN_CP005") === 1_920,
  "retained source-family volume drift",
);
assert(
  ownershipCounts.get("PROVISIONAL_COLLAPSE_TO_INTERLEAVED_AUTHORITY") === 960,
  "interleaved collision-probe volume drift",
);
assert(
  ownershipCounts.get("PROVISIONAL_MERGE_PHASE_VARIANTS") === 1_920,
  "phase-variant merge volume drift",
);
assert(
  representationCollisionQuestions === 960,
  "expected alternating/interleaved representation collisions were not proved",
);
assert(answerPositions.every((count) => count === 1_200), "answer-position imbalance");

let invalidSeedRejected = false;
try {
  generateSerCp005Question(SER_CP005_TEMPORARY_TEMPLATE_IDS[0]!, 0);
} catch {
  invalidSeedRejected = true;
}
assert(invalidSeedRejected, "invalid seed was accepted");

let unknownTemplateRejected = false;
try {
  generateSerCp005Question("SER-CP-005-TMP-999", 1);
} catch {
  unknownTemplateRejected = true;
}
assert(unknownTemplateRejected, "unknown temporary template was accepted");

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP005_ALTERNATING_INTERLEAVED_COMPOSITE_DISCOVERY",
      permanentQlCount: 0,
      temporaryTemplates: SER_CP005_TEMPORARY_TEMPLATE_IDS.length,
      sourceRuleFamilies: SER_CP005_SOURCE_RULE_IDS.length,
      canonicalAuthorities: SER_CP005_CANONICAL_AUTHORITY_IDS.length,
      generatedQuestions,
      deterministicReplayChecks,
      independentSolverChecks,
      lifecycleChecks,
      representationCollisionQuestions,
      sourceRuleCounts: Object.fromEntries(sourceRuleCounts),
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
