import assert from "node:assert/strict";
import { COD_CP001_WORD_POOL } from "../COD-CP-001/word-pool.en";
import { validateOptions } from "../foundation/option-validator";
import { generateCodCp002Question } from "./generator";
import { matchingNumericRules, sameNumericContext, solveCodCp002 } from "./independent-solver";
import { COD_CP002_QUESTION_LOGICS } from "./question-language.en";
import { COD_CP002_RULES } from "./rule-definitions";

assert.deepEqual(COD_CP002_QUESTION_LOGICS.map((logic) => logic.qlId), Array.from({ length: 28 }, (_, index) => `COD-QL-${String(25 + index).padStart(3, "0")}`));
assert.equal(COD_CP002_QUESTION_LOGICS.length, 28);
assert.equal(COD_CP002_RULES.length, 9);
assert.equal(new Set(COD_CP002_RULES.map((rule) => rule.ruleId)).size, 9);

const positions = [0, 0, 0, 0];
const rules = new Set<string>();
const tasks = new Set<string>();
const answers = new Set<string>();
const renderers = new Set<string>();
const difficulties = new Set<string>();
let generated = 0;

for (const logic of COD_CP002_QUESTION_LOGICS) {
  for (let seed = 1; seed <= 100; seed += 1) {
    const first = generateCodCp002Question(logic.qlId, seed);
    const second = generateCodCp002Question(logic.qlId, seed);
    assert.deepEqual(first, second, `${logic.qlId}/${seed} must be deterministic`);
    validateOptions(first.options);
    assert.equal(first.options[first.correctIndex]!.value, solveCodCp002(first.structuredPrompt));
    assert.equal(first.metadata.ambiguityAccepted, true);
    assert.equal(first.metadata.publiclyPublishable, false);
    assert.equal(first.structuredPrompt.evidence.every((pair) => COD_CP001_WORD_POOL.includes(pair.word as never)), true);
    assert.equal(first.structuredPrompt.evidence.some((pair) => pair.word === first.structuredPrompt.targetWord), false);
    assert.equal(first.structuredPrompt.outputShape === "SCALAR" && first.options[first.correctIndex]!.value === "0", false);
    const matches = matchingNumericRules(first.structuredPrompt.evidence);
    const intended = matches.find((match) => match.ruleId === first.ruleId && sameNumericContext(match.context, first.ruleContext));
    assert.ok(intended);
    assert.equal(matches.some((match) => match.priority <= intended!.priority && !(match.ruleId === intended!.ruleId && sameNumericContext(match.context, intended!.context))), false);
    assert.equal(first.stem.includes("COD_"), false);
    assert.equal(first.explanation.conclusion.includes(first.options[first.correctIndex]!.value), true);
    positions[first.correctIndex] += 1;
    rules.add(first.ruleId);
    tasks.add(first.structuredPrompt.taskKind);
    answers.add(first.answerType);
    renderers.add(first.renderer);
    difficulties.add(first.difficulty);
    generated += 1;
  }
}

assert.equal(rules.size, 9);
assert.deepEqual([...tasks].sort(), ["CHOOSE_MATCHING_CODE", "DECODE_TARGET", "ENCODE_TARGET", "INFER_AND_ENCODE", "RECOVER_MISSING_VALUE"]);
assert.deepEqual([...answers].sort(), ["DIGIT_SEQUENCE", "LETTER_CLUSTER", "NUMBER"]);
assert.deepEqual([...renderers].sort(), ["EXAMPLE_TARGET_BLOCK", "INLINE_CODE_PAIR", "MAPPING_TABLE"]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.ok(Math.max(...positions) / Math.min(...positions) < 1.2, `Answer positions are imbalanced: ${positions.join(", ")}`);

console.log(JSON.stringify({ checkpoint: "COD-CP-002", qls: 28, rules: 9, generated, positions, tasks: [...tasks].sort(), answers: [...answers].sort(), renderers: [...renderers].sort(), difficulties: [...difficulties].sort() }, null, 2));
