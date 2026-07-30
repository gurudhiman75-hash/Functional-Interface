
import {
  NUM_CP004_RETAINED_TEMPLATE_IDS,
  type NumCp004RetainedTemplateId,
} from "./types";
import {
  generateNumCp004RetainedQuestion,
  generateNumCp004RetainedSweep,
  verifyNumCp004RetainedAnswer,
} from "./runtime";
import {
  NUM_CP004_RETAINED_SOLVE_MODE_IDS,
  NUM_CP004_RETAINED_TEMPLATE_REGISTRY,
} from "./template-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function equal(actual: unknown, expected: unknown, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}: ${String(actual)} !== ${String(expected)}`);
  }
}

const SEEDS_PER_TEMPLATE = 60;
const questions = generateNumCp004RetainedSweep(SEEDS_PER_TEMPLATE);

equal(NUM_CP004_RETAINED_TEMPLATE_IDS.length, 28, "retained template count");
equal(NUM_CP004_RETAINED_SOLVE_MODE_IDS.length, 28, "retained solve-mode count");
equal(NUM_CP004_RETAINED_TEMPLATE_REGISTRY.length, 28, "registry count");
equal(questions.length, 28 * SEEDS_PER_TEMPLATE, "generated question count");
equal(new Set(NUM_CP004_RETAINED_TEMPLATE_IDS).size, 28, "unique template identities");
equal(new Set(NUM_CP004_RETAINED_SOLVE_MODE_IDS).size, 28, "unique solve modes");

const fingerprintsByTemplate: Record<string, number> = {};
const stemsByTemplate: Record<string, number> = {};
const answerPositionsByTemplate: Record<string, number[]> = {};
const difficultiesByTemplate: Record<string, string[]> = {};

for (const templateId of NUM_CP004_RETAINED_TEMPLATE_IDS) {
  const rows = questions.filter((question) => question.temporaryTemplateId === templateId);
  equal(rows.length, SEEDS_PER_TEMPLATE, `${templateId}: seed count`);
  const positions = new Set<number>();
  const difficulties = new Set<string>();
  const fingerprints = new Set<string>();
  const stems = new Set<string>();

  for (const question of rows) {
    equal(question.packageId, "NUM-001", `${templateId}: package`);
    equal(question.checkpointId, "NUM-CP-004", `${templateId}: checkpoint`);
    equal(question.permanentQlId, null, `${templateId}: premature permanent ID`);
    equal(question.locale, "en-IN", `${templateId}: locale`);
    equal(question.options.length, 4, `${templateId}: option count`);
    equal(new Set(question.options.map((option) => option.value)).size, 4, `${templateId}: unique options`);
    equal(question.options.filter((option) => option.isCorrect).length, 1, `${templateId}: one correct option`);
    equal(question.options[question.correctIndex]?.value, question.canonicalAnswer, `${templateId}: correct index`);
    equal(question.verifierAnswer, question.canonicalAnswer, `${templateId}: verifier parity`);
    equal(
      verifyNumCp004RetainedAnswer(question.temporaryTemplateId, question.hiddenState),
      question.canonicalAnswer,
      `${templateId}: replay verifier`,
    );
    assert(question.explanation.coreConcept.length > 0, `${templateId}: core concept`);
    assert(question.explanation.givenDataAndStrategy.length > 0, `${templateId}: strategy`);
    assert(question.explanation.stepByStep.length >= 3, `${templateId}: step-by-step`);
    assert(question.explanation.examSpeedMethod.length > 0, `${templateId}: shortcut`);
    equal(question.explanation.commonTraps.length, 3, `${templateId}: option-specific traps`);
    equal(question.lifecycle.active, false, `${templateId}: active leak`);
    equal(question.lifecycle.questionStudioDiscoverable, false, `${templateId}: Question Studio leak`);
    equal(question.lifecycle.questionBankWritable, false, `${templateId}: Question Bank leak`);
    equal(question.lifecycle.testEligible, false, `${templateId}: test leak`);
    equal(question.lifecycle.publiclyPublishable, false, `${templateId}: public leak`);
    assert(!question.stem.includes("NUM-CP004"), `${templateId}: internal ID leaked in stem`);
    assert(!question.explanation.finalAnswer.includes("NUM-CP004"), `${templateId}: internal ID leaked in explanation`);

    positions.add(question.correctIndex);
    difficulties.add(question.difficulty);
    fingerprints.add(question.mathematicalFingerprint);
    stems.add(question.stem);
  }

  equal(JSON.stringify([...positions].sort()), JSON.stringify([0, 1, 2, 3]), `${templateId}: answer positions`);
  equal(JSON.stringify([...difficulties].sort()), JSON.stringify(["EASY", "HARD", "MEDIUM"]), `${templateId}: difficulty coverage`);
  assert(fingerprints.size >= 20, `${templateId}: insufficient mathematical variation ${fingerprints.size}`);
  assert(stems.size >= 12, `${templateId}: insufficient stem variation ${stems.size}`);

  fingerprintsByTemplate[templateId] = fingerprints.size;
  stemsByTemplate[templateId] = stems.size;
  answerPositionsByTemplate[templateId] = [...positions].sort();
  difficultiesByTemplate[templateId] = [...difficulties].sort();
}

for (const templateId of NUM_CP004_RETAINED_TEMPLATE_IDS) {
  for (const seed of [1, 7, 19, 41, 60]) {
    const first = generateNumCp004RetainedQuestion(templateId, seed);
    const second = generateNumCp004RetainedQuestion(templateId, seed);
    equal(JSON.stringify(first), JSON.stringify(second), `${templateId}/${seed}: deterministic replay`);
  }
}

function classes(templateId: NumCp004RetainedTemplateId): Set<string> {
  return new Set(
    questions
      .filter((question) => question.temporaryTemplateId === templateId)
      .map((question) => question.canonicalAnswer),
  );
}

equal(classes("NUM-CP004-QLT-01").size, 4, "prime classification edge coverage");
assert(classes("NUM-CP004-QLT-04").size >= 20, "adjacent/extreme prime variation");
equal(classes("NUM-CP004-QLT-19").size, 3, "co-prime topology coverage");
equal(classes("NUM-CP004-QLT-27").size, 4, "data-sufficiency class coverage");

const intervalSetRows = questions.filter((question) => question.temporaryTemplateId === "NUM-CP004-QLT-02");
assert(intervalSetRows.some((question) => question.canonicalAnswer === "{}"), "empty prime interval not reached");
assert(intervalSetRows.some((question) => /^\{\d+\}$/.test(question.canonicalAnswer)), "single-prime interval not reached");
assert(intervalSetRows.some((question) => question.canonicalAnswer.includes(",")), "multi-prime interval not reached");

const adjustmentRows = questions.filter((question) => question.temporaryTemplateId === "NUM-CP004-QLT-28");
const tieAdjustmentCount = adjustmentRows.filter((question) => question.canonicalAnswer.includes(",")).length;
const nonTieAdjustmentCount = adjustmentRows.length - tieAdjustmentCount;
assert(tieAdjustmentCount > 0, "prime-adjustment ties not reached");
assert(nonTieAdjustmentCount > 0, "prime-adjustment non-ties not reached");

const pairRelations = new Set(
  questions
    .filter((question) => question.temporaryTemplateId === "NUM-CP004-QLT-21")
    .map((question) => String(question.hiddenState.relation)),
);
equal(pairRelations.size, 3, "prime pair relation coverage");

console.log(JSON.stringify({
  status: "PASS_NUM_CP004_COMPLETION_RETAINED_AUTHORITY",
  retainedTemplateCount: NUM_CP004_RETAINED_TEMPLATE_IDS.length,
  retainedSolveModeCount: NUM_CP004_RETAINED_SOLVE_MODE_IDS.length,
  seedsPerTemplate: SEEDS_PER_TEMPLATE,
  generatedQuestions: questions.length,
  fingerprintsByTemplate,
  stemsByTemplate,
  answerPositionsByTemplate,
  difficultiesByTemplate,
  tieAdjustmentCount,
  nonTieAdjustmentCount,
  permanentQlCount: 0,
  activeQuestionCount: questions.filter((question) => question.lifecycle.active).length,
}, null, 2));
