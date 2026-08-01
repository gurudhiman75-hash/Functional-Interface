import {
  SER_CP006_CANONICAL_AUTHORITY_IDS,
  SER_CP006_SOURCE_RULE_IDS,
  SER_CP006_TEMPORARY_TEMPLATE_IDS,
  SER_CP006_TEMPORARY_TEMPLATES,
  generateSerCp006Question,
  independentlyProjectSerCp006,
} from "./foundation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerTemplate = 120;
let generatedQuestions = 0;
let deterministicReplayChecks = 0;
let independentProjectionChecks = 0;
let lifecycleChecks = 0;
let optionChecks = 0;
let wrongTermChecks = 0;
const taskCounts: Record<string, number> = {};
const familyCounts: Record<string, number> = {};
const authorityCounts: Record<string, number> = {};
const answerPositions = [0, 0, 0, 0];
const difficultyByTemplate = new Map<string, Record<string, number>>();
const fingerprintsByTemplate = new Map<string, Set<string>>();

assert(SER_CP006_SOURCE_RULE_IDS.length === 8, "CP-006 source-family drift");
assert(SER_CP006_CANONICAL_AUTHORITY_IDS.length === 4, "CP-006 authority drift");
assert(SER_CP006_TEMPORARY_TEMPLATE_IDS.length === 32, "CP-006 template drift");
assert(new Set(SER_CP006_TEMPORARY_TEMPLATE_IDS).size === 32, "duplicate CP-006 template ID");

for (const template of SER_CP006_TEMPORARY_TEMPLATES) {
  difficultyByTemplate.set(template.temporaryTemplateId, { EASY: 0, MEDIUM: 0, HARD: 0 });
  fingerprintsByTemplate.set(template.temporaryTemplateId, new Set());

  for (let seed = 1; seed <= seedsPerTemplate; seed += 1) {
    const question = generateSerCp006Question(template.temporaryTemplateId, seed);
    const replay = generateSerCp006Question(template.temporaryTemplateId, seed);
    assert(JSON.stringify(question) === JSON.stringify(replay), `${question.questionId}: nondeterministic replay`);
    deterministicReplayChecks += 1;

    const independent = independentlyProjectSerCp006(template.sourceRuleId, seed);
    assert(JSON.stringify(independent) === JSON.stringify(question.hiddenState.canonicalSequence), `${question.questionId}: independent projection mismatch`);
    independentProjectionChecks += 1;

    assert(question.sequence.every((term) => term === null || /^[A-Z]$/.test(term)), `${question.questionId}: invalid displayed term`);
    assert(question.hiddenState.canonicalSequence.every((term) => /^[A-Z]$/.test(term)), `${question.questionId}: invalid canonical term`);
    assert(question.options.length === 4, `${question.questionId}: option count drift`);
    assert(new Set(question.options).size === 4, `${question.questionId}: duplicate options`);
    assert(question.options[question.correctIndex] === question.correctAnswer, `${question.questionId}: answer-index mismatch`);
    optionChecks += 1;

    if (question.taskKind === "WRONG_TERM") {
      assert(question.hiddenState.corruptedValue !== question.hiddenState.correctReplacement, `${question.questionId}: corruption did not change term`);
      assert(question.hiddenState.correctReplacement === question.correctAnswer, `${question.questionId}: replacement answer mismatch`);
      wrongTermChecks += 1;
    } else {
      assert(question.hiddenState.correctReplacement === question.correctAnswer, `${question.questionId}: required-letter mismatch`);
    }

    assert(question.permanentQlId === null, `${question.questionId}: permanent QL allocated`);
    assert(!question.lifecycle.active, `${question.questionId}: active during discovery`);
    assert(!question.lifecycle.questionStudioDiscoverable, `${question.questionId}: Question Studio exposed`);
    assert(!question.lifecycle.questionBankWritable, `${question.questionId}: Question Bank writable`);
    assert(!question.lifecycle.testEligible, `${question.questionId}: test eligible`);
    assert(!question.lifecycle.publiclyPublishable, `${question.questionId}: publicly publishable`);
    lifecycleChecks += 1;

    generatedQuestions += 1;
    taskCounts[template.taskKind] = (taskCounts[template.taskKind] ?? 0) + 1;
    familyCounts[template.sourceRuleId] = (familyCounts[template.sourceRuleId] ?? 0) + 1;
    authorityCounts[template.canonicalAuthorityId] = (authorityCounts[template.canonicalAuthorityId] ?? 0) + 1;
    answerPositions[question.correctIndex] += 1;
    difficultyByTemplate.get(template.temporaryTemplateId)![question.difficulty] += 1;
    fingerprintsByTemplate.get(template.temporaryTemplateId)!.add(question.mathematicalFingerprint);
  }
}

assert(generatedQuestions === 3_840, "CP-006 generated-question volume drift");
assert(deterministicReplayChecks === 3_840, "CP-006 replay volume drift");
assert(independentProjectionChecks === 3_840, "CP-006 projection volume drift");
assert(lifecycleChecks === 3_840, "CP-006 lifecycle volume drift");
assert(optionChecks === 3_840, "CP-006 option volume drift");
assert(wrongTermChecks === 960, "CP-006 wrong-term volume drift");

for (const family of SER_CP006_SOURCE_RULE_IDS) {
  assert(familyCounts[family] === 480, `${family}: expected 480 questions`);
}
for (const authority of SER_CP006_CANONICAL_AUTHORITY_IDS) {
  assert(authorityCounts[authority] === 960, `${authority}: expected 960 questions`);
}
for (const task of ["NEXT_TERM", "MISSING_TERM", "PREVIOUS_TERM", "WRONG_TERM"]) {
  assert(taskCounts[task] === 960, `${task}: expected 960 questions`);
}
assert(answerPositions.every((count) => count === 960), "CP-006 answer-position imbalance");

for (const templateId of SER_CP006_TEMPORARY_TEMPLATE_IDS) {
  const difficulty = difficultyByTemplate.get(templateId)!;
  assert(difficulty.EASY === 40 && difficulty.MEDIUM === 40 && difficulty.HARD === 40, `${templateId}: difficulty imbalance`);
  assert(fingerprintsByTemplate.get(templateId)!.size >= 12, `${templateId}: insufficient alphabetic fingerprint diversity`);
}

console.log(JSON.stringify({
  status: "PASS_SER_CP006_SINGLE_LETTER_ALPHABETIC_DISCOVERY",
  temporaryTemplates: SER_CP006_TEMPORARY_TEMPLATE_IDS.length,
  sourceFamilies: SER_CP006_SOURCE_RULE_IDS.length,
  canonicalAuthorities: SER_CP006_CANONICAL_AUTHORITY_IDS.length,
  generatedQuestions,
  deterministicReplayChecks,
  independentProjectionChecks,
  lifecycleChecks,
  optionChecks,
  wrongTermChecks,
  taskCounts,
  familyCounts,
  authorityCounts,
  answerPositions,
  permanentQlCount: 0,
  reviewDecision: "AWAIT_USER_EDITORIAL_APPROVAL",
}, null, 2));
