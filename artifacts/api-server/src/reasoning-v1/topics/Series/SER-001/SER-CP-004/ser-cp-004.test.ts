import {
  SER_CP004_RULE_IDS,
  SER_CP004_TEMPORARY_TEMPLATE_IDS,
  generateSerCp004Question,
  solveSerCp004Sequence,
  type SerCp004Difficulty,
  type SerCp004OwnershipDisposition,
  type SerCp004RuleId,
  type SerCp004TaskKind,
} from "./foundation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerTemplate = 120;
const ruleCounts = new Map<SerCp004RuleId, number>();
const taskCounts = new Map<SerCp004TaskKind, number>();
const difficultyByTemplate = new Map<string, Map<SerCp004Difficulty, number>>();
const fingerprintsByTemplate = new Map<string, Set<string>>();
const ownershipCounts = new Map<SerCp004OwnershipDisposition, number>();
const answerPositions = [0, 0, 0, 0];
let generatedQuestions = 0;
let deterministicReplayChecks = 0;
let independentSolverChecks = 0;
let lifecycleChecks = 0;

for (const temporaryTemplateId of SER_CP004_TEMPORARY_TEMPLATE_IDS) {
  const difficultyCounts = new Map<SerCp004Difficulty, number>();
  const fingerprints = new Set<string>();
  difficultyByTemplate.set(temporaryTemplateId, difficultyCounts);
  fingerprintsByTemplate.set(temporaryTemplateId, fingerprints);

  for (let seed = 1; seed <= seedsPerTemplate; seed += 1) {
    const question = generateSerCp004Question(temporaryTemplateId, seed);
    const replay = generateSerCp004Question(temporaryTemplateId, seed);
    assert(
      JSON.stringify(replay) === JSON.stringify(question),
      `${question.questionId}: deterministic replay mismatch`,
    );
    deterministicReplayChecks += 1;

    const solved = solveSerCp004Sequence(question.taskKind, question.sequence);
    assert(solved.answer === question.correctAnswer, `${question.questionId}: answer mismatch`);
    assert(
      solved.candidateRuleId === question.candidateRuleId,
      `${question.questionId}: rule mismatch`,
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

    ruleCounts.set(question.candidateRuleId, (ruleCounts.get(question.candidateRuleId) ?? 0) + 1);
    taskCounts.set(question.taskKind, (taskCounts.get(question.taskKind) ?? 0) + 1);
    difficultyCounts.set(question.difficulty, (difficultyCounts.get(question.difficulty) ?? 0) + 1);
    fingerprints.add(question.mathematicalFingerprint);
    ownershipCounts.set(
      question.ownershipDisposition,
      (ownershipCounts.get(question.ownershipDisposition) ?? 0) + 1,
    );
    answerPositions[question.correctIndex] += 1;
    generatedQuestions += 1;
  }
}

assert(SER_CP004_TEMPORARY_TEMPLATE_IDS.length === 28, "temporary-template count drift");
assert(SER_CP004_RULE_IDS.length === 7, "candidate-rule count drift");
assert(generatedQuestions === 3_360, "generated audit volume drift");
for (const ruleId of SER_CP004_RULE_IDS) {
  assert(ruleCounts.get(ruleId) === 480, `${ruleId}: expected 480 questions`);
}
for (const taskKind of ["NEXT_TERM", "MISSING_TERM", "PREVIOUS_TERM", "WRONG_TERM"] as const) {
  assert(taskCounts.get(taskKind) === 840, `${taskKind}: expected 840 questions`);
}
for (const temporaryTemplateId of SER_CP004_TEMPORARY_TEMPLATE_IDS) {
  const counts = difficultyByTemplate.get(temporaryTemplateId)!;
  assert(counts.get("EASY") === 40, `${temporaryTemplateId}: EASY count`);
  assert(counts.get("MEDIUM") === 40, `${temporaryTemplateId}: MEDIUM count`);
  assert(counts.get("HARD") === 40, `${temporaryTemplateId}: HARD count`);
  const sampleRule = generateSerCp004Question(temporaryTemplateId, 1).candidateRuleId;
  const minimumDistinctFingerprints =
    sampleRule === "FACTORIAL_SEQUENCE"
      ? 6
      : sampleRule === "CONSECUTIVE_CUBES"
        ? 18
        : sampleRule === "CONSECUTIVE_SQUARES"
          ? 25
          : 30;
  assert(
    fingerprintsByTemplate.get(temporaryTemplateId)!.size
      >= minimumDistinctFingerprints,
    `${temporaryTemplateId}: insufficient mathematical diversity`,
  );
}
assert(
  ownershipCounts.get("PROVISIONAL_RETAIN_CP004") === 1_440,
  "CP004 retained volume drift",
);
assert(
  ownershipCounts.get("PROVISIONAL_REASSIGN_CP003") === 1_440,
  "CP003 collision volume drift",
);
assert(
  ownershipCounts.get("PROVISIONAL_REASSIGN_CP002") === 480,
  "CP002 collision volume drift",
);
assert(answerPositions.every((count) => count === 840), "answer-position imbalance");

let invalidSeedRejected = false;
try {
  generateSerCp004Question(SER_CP004_TEMPORARY_TEMPLATE_IDS[0]!, 0);
} catch {
  invalidSeedRejected = true;
}
assert(invalidSeedRejected, "invalid seed was accepted");

let unknownTemplateRejected = false;
try {
  generateSerCp004Question("SER-CP-004-TMP-999", 1);
} catch {
  unknownTemplateRejected = true;
}
assert(unknownTemplateRejected, "unknown temporary template was accepted");

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP004_SPECIAL_NUMBER_RECURRENCE_AND_COLLISION_DISCOVERY",
      permanentQlCount: 0,
      temporaryTemplates: SER_CP004_TEMPORARY_TEMPLATE_IDS.length,
      candidateRules: SER_CP004_RULE_IDS.length,
      provisionalRetainedRules: 3,
      provisionalCollisionRules: 4,
      generatedQuestions,
      deterministicReplayChecks,
      independentSolverChecks,
      lifecycleChecks,
      ruleCounts: Object.fromEntries(ruleCounts),
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
