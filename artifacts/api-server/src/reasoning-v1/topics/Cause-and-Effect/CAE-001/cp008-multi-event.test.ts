import assert from "node:assert/strict";
import { CAE_001_REVIEWED_EDITORIAL_REALNESS_REVIEW } from "./reviewed-editorial-review-pack.ts";
import { previewCae001QuestionStudioReview } from "./question-studio-review.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import { CP008_MULTI_EVENT_WORLDS } from "./cp008-multi-event.ts";
import type { CaeLocale } from "./types.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const expectedModes = new Set([
  "SEQUENCE",
  "IMMEDIATE_CAUSE",
  "IMMEDIATE_EFFECT",
  "EARLIEST_CAUSE",
  "FINAL_EFFECT",
  "BRIDGE_ROLE",
  "INVALID_RELATION",
]);
const seenModes = new Set<string>();
const seenStates = new Set<string>();
const seenLabelSignatures = new Set<string>();
let nonCausalDisplayOrder = 0;
let medium = 0;
let hard = 0;

function labelSignature(question: ReturnType<typeof generateReviewedCaeQuestion>): string {
  const world = CP008_MULTI_EVENT_WORLDS.find((entry) => entry.id === question.causalWorldId);
  assert.ok(world, `${question.causalWorldId}: CP008 world must exist`);
  const display = new Map(
    question.stem
      .split("\n")
      .filter((line) => /^[PQRS]\.\s/u.test(line))
      .map((line) => [line.slice(0, 1), line.slice(3)] as const),
  );
  assert.equal(display.size, 4, `${question.causalStateId}: CP008 must display P/Q/R/S exactly once`);
  return question.causalTrace.map((id) => {
    const event = world.nodes.find((node) => node.id === id)!.text[question.locale];
    const label = [...display.entries()].find(([, text]) => text === event)?.[0];
    assert.ok(label, `${question.causalStateId}: every causal node must have a learner label`);
    return label;
  }).join("");
}

for (let seed = 0; seed < 240; seed += 1) {
  const question = generateReviewedCaeQuestion({ qlId: "CAE-QL-008", locale: "en-IN", seed });
  assert.equal(question.checkpointId, "CAE-CP-008");
  assert.equal(question.qlId, "CAE-QL-008");
  assert.equal(question.projectionId, "CAE-PLAN-SEQUENCE-V2");
  assert.equal(question.options.length, 4);
  assert.equal(question.optionMetadata.filter((option) => option.isCorrect).length, 1);
  assert.equal(new Set(question.options).size, 4);
  assert.notEqual(question.difficulty, "EASY");
  assert.equal(question.causalTrace.length, 4);
  assert.equal(question.visibleContext.visibleNodeIds.length, 4);
  assert.equal(question.metadata.reviewOnly, true);
  assert.equal(question.metadata.questionBankWritable, false);
  assert.equal(question.metadata.publicEligible, false);

  const signature = labelSignature(question);
  seenLabelSignatures.add(signature);
  if (signature !== "PQRS") nonCausalDisplayOrder += 1;

  const mode = question.causalStructure.split(":")[1]!;
  seenModes.add(mode);
  seenStates.add(question.causalStateId);
  if (question.difficulty === "MEDIUM") medium += 1;
  if (question.difficulty === "HARD") hard += 1;

  if (mode === "INVALID_RELATION") {
    assert.equal(question.answerId, "PATH_0_IMMEDIATE_3");
    assert.ok(question.explanation.length > 30);
  }
  if (mode === "BRIDGE_ROLE") assert.equal(question.difficulty, "HARD");
}

assert.deepEqual(seenModes, expectedModes, "240-seed CP008 QA must reach every learner operation");
assert.ok(seenStates.size >= 20, `CP008 needs broad semantic-operation coverage; saw ${seenStates.size} states`);
assert.ok(seenLabelSignatures.size >= 8, `CP008 labels must vary across seeds; saw ${seenLabelSignatures.size} mappings`);
assert.ok(nonCausalDisplayOrder >= 180, `CP008 must not usually expose causal order through P/Q/R/S; only ${nonCausalDisplayOrder} randomized displays seen`);
assert.ok(medium > 0 && hard > 0, "CP008 must include both MEDIUM and HARD reviewed items");

for (let seed = 0; seed < 40; seed += 1) {
  const en = generateReviewedCaeQuestion({ qlId: "CAE-QL-008", locale: "en-IN", seed });
  for (const locale of LOCALES) {
    const localized = generateReviewedCaeQuestion({ qlId: "CAE-QL-008", locale, seed });
    assert.equal(localized.causalStateId, en.causalStateId, `${seed}/${locale}: CP008 causal state drift`);
    assert.equal(localized.answerId, en.answerId, `${seed}/${locale}: CP008 answer drift`);
    assert.equal(localized.correctIndex, en.correctIndex, `${seed}/${locale}: CP008 presentation drift`);
    assert.equal(localized.difficulty, en.difficulty, `${seed}/${locale}: CP008 difficulty drift`);
    assert.deepEqual(localized.optionMetadata.map((option) => option.id), en.optionMetadata.map((option) => option.id), `${seed}/${locale}: CP008 option-semantic drift`);
    assert.equal(labelSignature(localized), labelSignature(en), `${seed}/${locale}: CP008 learner-label mapping drift`);
    if (locale !== "en-IN") {
      assert.equal(/[A-Za-z]{4,}/.test(localized.stem), false, `${seed}/${locale}: English stem fragment leaked`);
      assert.equal(/[A-Za-z]{4,}/.test(localized.explanation), false, `${seed}/${locale}: English explanation fragment leaked`);
      assert.ok(localized.options.every((option) => !/immediate cause of/u.test(option)), `${seed}/${locale}: English relation label leaked into localized CP008 option`);
    }
  }
}

const review = CAE_001_REVIEWED_EDITORIAL_REALNESS_REVIEW["CAE-QL-008"];
assert.equal(review.length, 10);
assert.equal(new Set(review.map((entry) => entry.question.causalStateId)).size, 10);
assert.ok(new Set(review.map((entry) => entry.question.causalStructure.split(":")[1])).size >= 4, "CP008 editorial pack should visibly sample multiple learner operations");
assert.ok(new Set(review.map((entry) => labelSignature(entry.question))).size >= 4, "CP008 editorial pack should visibly vary learner-label assignment");
assert.ok(review.some((entry) => entry.question.difficulty === "HARD"));
assert.ok(review.some((entry) => entry.question.difficulty === "MEDIUM"));

const studio = previewCae001QuestionStudioReview({ qlId: "CAE-QL-008", locale: "en-IN", seed: 8 });
assert.equal(studio.question.projectionId, "CAE-PLAN-SEQUENCE-V2");
assert.equal(studio.reviewOnly, true);

assert.throws(
  () => generateReviewedCaeQuestion({ qlId: "CAE-QL-008", locale: "en-IN", seed: 8, questionProfile: "FIVE_WAY" }),
  /question profile 'FIVE_WAY' is not allowed/,
  "CP008 is four-way-only; unsupported five-way requests must fail closed",
);