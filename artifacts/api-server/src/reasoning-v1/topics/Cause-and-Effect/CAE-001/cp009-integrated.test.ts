import assert from "node:assert/strict";
import { CAE_001_CAUSAL_WORLDS } from "./causal-world-authorities.ts";
import { CAE_001_REVIEWED_EDITORIAL_REALNESS_REVIEW } from "./reviewed-editorial-review-pack.ts";
import { previewCae001QuestionStudioReview } from "./question-studio-review.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import type { CaeLocale } from "./types.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const expectedModes = new Set([
  "MISSING_SINGLE",
  "MISSING_PAIR",
  "RELATION_TYPE",
  "CONNECTOR_PAIR",
  "NEXT_OUTCOME",
  "COMMON_CAUSE_RECONSTRUCTION",
]);
const seenModes = new Set<string>();
const seenStates = new Set<string>();
let medium = 0;
let hard = 0;

function trim(value: string): string {
  return value.replace(/[.।]+$/u, "");
}

function assertExternalDistractorDomain(question: ReturnType<typeof generateReviewedCaeQuestion>): void {
  const currentWorld = CAE_001_CAUSAL_WORLDS.find((world) => world.id === question.causalWorldId);
  assert.ok(currentWorld, `${question.causalWorldId}: current CP009 world missing`);
  for (const option of question.optionMetadata) {
    if (!option.id.startsWith("ALT:") && !option.id.startsWith("ALT_PAIR:")) continue;
    const altWorldId = option.id.split(":")[1]!;
    const altWorld = CAE_001_CAUSAL_WORLDS.find((world) => world.id === altWorldId);
    assert.ok(altWorld, `${option.id}: external CP009 distractor world missing`);
    assert.equal(altWorld.domain, currentWorld.domain, `${question.causalStateId}: external distractor must stay in the same domain`);
  }
}

for (let seed = 0; seed < 240; seed += 1) {
  const question = generateReviewedCaeQuestion({ qlId: "CAE-QL-009", locale: "en-IN", seed });
  assert.equal(question.checkpointId, "CAE-CP-009");
  assert.equal(question.qlId, "CAE-QL-009");
  assert.equal(question.projectionId, "CAE-PLAN-INTEGRATED-V2");
  assert.equal(question.options.length, 4);
  assert.equal(question.optionMetadata.filter((option) => option.isCorrect).length, 1);
  assert.equal(new Set(question.options).size, 4);
  assert.notEqual(question.difficulty, "EASY");
  assert.equal(question.metadata.reviewOnly, true);
  assert.equal(question.metadata.questionBankWritable, false);
  assert.equal(question.metadata.publicEligible, false);
  assertExternalDistractorDomain(question);

  const mode = question.causalStructure.split(":")[1]!;
  seenModes.add(mode);
  seenStates.add(question.causalStateId);
  if (question.difficulty === "MEDIUM") medium += 1;
  if (question.difficulty === "HARD") hard += 1;

  if (mode === "MISSING_SINGLE") {
    assert.equal(question.visibleContext.visibleNodeIds.length, 2);
    assert.equal(question.causalTrace.length, 4);
  }
  if (mode === "MISSING_PAIR" || mode === "CONNECTOR_PAIR") {
    assert.ok(question.answerId.includes("|"));
    assert.equal(question.visibleContext.visibleNodeIds.length, 2);
    const world = CAE_001_CAUSAL_WORLDS.find((entry) => entry.id === question.causalWorldId)!;
    const visibleTexts = question.visibleContext.visibleNodeIds.map((id) => trim(world.nodes.find((node) => node.id === id)!.text[question.locale]));
    for (const option of question.optionMetadata.filter((entry) => !entry.isCorrect)) {
      assert.ok(visibleTexts.every((visible) => !option.text.includes(visible)), `${question.causalStateId}: pair distractor repeats a visible endpoint`);
    }
  }
  if (mode === "RELATION_TYPE") {
    assert.equal(question.answerId, "INDIRECT");
    assert.equal(question.visibleContext.visibleNodeIds.length, 4, "relation-type item must expose the evidence-bearing events");
    assert.equal(question.difficulty, "MEDIUM", "relation-type recognition should not be mislabeled HARD");
    assert.doesNotMatch(question.stem, /P\s*→\s*Q\s*→\s*R\s*→\s*S/u, "relation-type stem must not spell out the answer-bearing causal chain");
    for (const label of ["P.", "Q.", "R.", "S."]) assert.ok(question.stem.includes(label), `${question.causalStateId}: relation-type stem must retain all event labels`);
  }
  if (mode === "COMMON_CAUSE_RECONSTRUCTION") {
    assert.equal(question.visibleContext.visibleNodeIds.length, 2);
    assert.equal(question.causalTrace.length, 3);
  }
}

assert.deepEqual(seenModes, expectedModes, "240-seed CP009 QA must reach every integrated learner operation");
assert.ok(seenStates.size >= 24, `CP009 needs broad integrated semantic coverage; saw ${seenStates.size} states`);
assert.ok(medium > 0 && hard > 0, "CP009 must retain both MEDIUM and HARD reviewed content");

for (let seed = 0; seed < 40; seed += 1) {
  const en = generateReviewedCaeQuestion({ qlId: "CAE-QL-009", locale: "en-IN", seed });
  for (const locale of LOCALES) {
    const localized = generateReviewedCaeQuestion({ qlId: "CAE-QL-009", locale, seed });
    assert.equal(localized.causalStateId, en.causalStateId, `${seed}/${locale}: CP009 causal state drift`);
    assert.equal(localized.answerId, en.answerId, `${seed}/${locale}: CP009 answer drift`);
    assert.equal(localized.correctIndex, en.correctIndex, `${seed}/${locale}: CP009 presentation drift`);
    assert.equal(localized.difficulty, en.difficulty, `${seed}/${locale}: CP009 difficulty drift`);
    assert.deepEqual(localized.optionMetadata.map((option) => option.id), en.optionMetadata.map((option) => option.id), `${seed}/${locale}: CP009 option-semantic drift`);
    assertExternalDistractorDomain(localized);
  }
}

const review = CAE_001_REVIEWED_EDITORIAL_REALNESS_REVIEW["CAE-QL-009"];
assert.equal(review.length, 10);
assert.equal(new Set(review.map((entry) => entry.question.causalStateId)).size, 10);
assert.ok(new Set(review.map((entry) => entry.question.causalStructure.split(":")[1])).size >= 4, "CP009 editorial pack should visibly sample multiple integrated learner operations");
assert.ok(review.some((entry) => entry.question.difficulty === "MEDIUM"));
assert.ok(review.some((entry) => entry.question.difficulty === "HARD"));

const studio = previewCae001QuestionStudioReview({ qlId: "CAE-QL-009", locale: "en-IN", seed: 9 });
assert.equal(studio.question.projectionId, "CAE-PLAN-INTEGRATED-V2");
assert.equal(studio.reviewOnly, true);

assert.throws(
  () => generateReviewedCaeQuestion({ qlId: "CAE-QL-009", locale: "en-IN", seed: 9, questionProfile: "FIVE_WAY" }),
  /question profile 'FIVE_WAY' is not allowed/,
  "CP009 is four-way-only; unsupported five-way requests must fail closed",
);
