import {
  SER_WAVE_B2_SOURCE_FAMILIES,
  SER_WAVE_B2_TEMPLATES,
  generateSerWaveB2Question,
  independentlyProject,
} from "./foundation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerTemplate = 120;
let generatedQuestions = 0;
let deterministicReplayChecks = 0;
let independentProjectionChecks = 0;
let lifecycleChecks = 0;
const taskCounts: Record<string, number> = {};
const familyCounts: Record<string, number> = {};
const authorityCounts: Record<string, number> = {};
const answerPositions = [0, 0, 0, 0];

assert(SER_WAVE_B2_SOURCE_FAMILIES.length === 7, "Wave B2 source-family drift");
assert(SER_WAVE_B2_TEMPLATES.length === 28, "Wave B2 template drift");
assert(new Set(SER_WAVE_B2_TEMPLATES.map((template) => template.temporaryTemplateId)).size === 28, "duplicate Wave B2 template ID");

for (const template of SER_WAVE_B2_TEMPLATES) {
  for (let seed = 1; seed <= seedsPerTemplate; seed += 1) {
    const question = generateSerWaveB2Question(template, seed);
    const replay = generateSerWaveB2Question(template, seed);
    assert(JSON.stringify(question) === JSON.stringify(replay), `${question.questionId}: nondeterministic replay`);
    deterministicReplayChecks += 1;

    const independent = independentlyProject(template.sourceFamilyId, seed);
    assert(
      JSON.stringify(independent) === JSON.stringify(question.canonicalSequence),
      `${question.questionId}: independent projection mismatch`,
    );
    independentProjectionChecks += 1;

    assert(question.permanentQlId === null, `${question.questionId}: permanent QL allocated`);
    assert(!question.lifecycle.active, `${question.questionId}: active during discovery`);
    assert(!question.lifecycle.questionStudioDiscoverable, `${question.questionId}: Question Studio exposed`);
    assert(!question.lifecycle.questionBankWritable, `${question.questionId}: Question Bank writable`);
    assert(!question.lifecycle.testEligible, `${question.questionId}: test eligible`);
    assert(!question.lifecycle.publiclyPublishable, `${question.questionId}: publicly publishable`);
    lifecycleChecks += 1;

    generatedQuestions += 1;
    taskCounts[template.taskKind] = (taskCounts[template.taskKind] ?? 0) + 1;
    familyCounts[template.sourceFamilyId] = (familyCounts[template.sourceFamilyId] ?? 0) + 1;
    authorityCounts[template.canonicalAuthorityId] = (authorityCounts[template.canonicalAuthorityId] ?? 0) + 1;
    answerPositions[question.correctIndex] += 1;
  }
}

assert(generatedQuestions === 3_360, "Wave B2 generated-question volume drift");
assert(deterministicReplayChecks === 3_360, "Wave B2 replay volume drift");
assert(independentProjectionChecks === 3_360, "Wave B2 independent-projection volume drift");
assert(lifecycleChecks === 3_360, "Wave B2 lifecycle volume drift");
for (const family of SER_WAVE_B2_SOURCE_FAMILIES) {
  assert(familyCounts[family] === 480, `${family}: expected 480 questions`);
}
for (const task of ["NEXT_TERM", "MISSING_TERM", "PREVIOUS_TERM", "WRONG_TERM"]) {
  assert(taskCounts[task] === 840, `${task}: expected 840 questions`);
}
assert(answerPositions.every((count) => count === 840), "Wave B2 answer-position imbalance");

assert(authorityCounts.UNIFORM_ADDITIVE_STEP === 960, "odd/even additive collision volume drift");
assert(authorityCounts.TWO_INTERLEAVED_ARITHMETIC === 480, "alternating-operator interleaving collision volume drift");
assert(authorityCounts.COMPOSITE_SUCCESSOR_SEQUENCE === 480, "composite authority volume drift");
assert(authorityCounts.PRIME_GAP_DERIVED_SEQUENCE === 480, "prime-gap authority volume drift");
assert(authorityCounts.INDEXED_POWER_SCHEDULE === 480, "changing-power authority volume drift");
assert(authorityCounts.ALTERNATING_SIGN_MAGNITUDE_SEQUENCE === 480, "alternating-sign authority volume drift");

console.log(JSON.stringify({
  status: "PASS_SER_NUMERIC_WAVE_B2",
  temporaryTemplates: SER_WAVE_B2_TEMPLATES.length,
  sourceFamilies: SER_WAVE_B2_SOURCE_FAMILIES.length,
  generatedQuestions,
  deterministicReplayChecks,
  independentProjectionChecks,
  lifecycleChecks,
  taskCounts,
  familyCounts,
  authorityCounts,
  answerPositions,
  permanentQlCount: 0,
  freezeDecision: "BLOCK_PERMANENT_QL_ALLOCATION",
}, null, 2));
