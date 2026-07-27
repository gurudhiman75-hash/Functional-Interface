import assert from "node:assert/strict";
import { validateOptions } from "../foundation/option-validator";
import { COD_CP003_WORD_POOL } from "./word-pool.en";
import { generateCodCp003Question } from "./generator";
import { matchingAlphabetRules, sameAlphabetContext, solveCodCp003 } from "./independent-solver";
import { COD_CP003_QUESTION_LOGICS } from "./question-language.en";
import { COD_CP003_RULES } from "./rule-definitions";

assert.deepEqual(
  COD_CP003_QUESTION_LOGICS.map((logic) => logic.qlId),
  Array.from({ length: 28 }, (_, index) => `COD-QL-${String(53 + index).padStart(3, "0")}`),
);
assert.equal(COD_CP003_QUESTION_LOGICS.length, 28);
assert.equal(COD_CP003_RULES.length, 2);
assert.deepEqual(COD_CP003_RULES.map((rule) => rule.ruleId).sort(), ["OPPOSITE_ALPHABET_MAP", "UNIFORM_CYCLIC_SHIFT"]);

const positions = [0, 0, 0, 0];
const rules = new Set<string>();
const tasks = new Set<string>();
const answers = new Set<string>();
const renderers = new Set<string>();
const difficulties = new Set<string>();
let generated = 0;
let wrapped = 0;

for (const logic of COD_CP003_QUESTION_LOGICS) {
  const number = Number(logic.qlId.slice(-3));
  for (let seed = 1; seed <= 100; seed += 1) {
    const first = generateCodCp003Question(logic.qlId, seed);
    const second = generateCodCp003Question(logic.qlId, seed);
    assert.deepEqual(first, second, `${logic.qlId}/${seed} must be deterministic`);
    validateOptions(first.options);
    assert.equal(first.options[first.correctIndex]!.value, solveCodCp003(first.structuredPrompt));
    assert.equal(first.metadata.ambiguityAccepted, true);
    assert.equal(first.metadata.publiclyPublishable, false);
    assert.equal(first.structuredPrompt.evidence.every((pair) => COD_CP003_WORD_POOL.includes(pair.source as never)), true);
    assert.equal(first.structuredPrompt.evidence.some((pair) => pair.source === first.structuredPrompt.targetWord), false);
    assert.equal(new Set(first.structuredPrompt.evidence.flatMap((pair) => [...pair.source])).size >= 2, true);
    const matches = matchingAlphabetRules(first.structuredPrompt.evidence);
    const intended = matches.find((match) => match.ruleId === first.ruleId && sameAlphabetContext(match.context, first.ruleContext));
    assert.ok(intended);
    assert.equal(matches.some((match) => match.priority <= intended!.priority && !(match.ruleId === intended!.ruleId && sameAlphabetContext(match.context, intended!.context))), false);
    assert.equal(first.stem.includes("COD_"), false);
    assert.equal(first.stem.includes("{{"), false);
    assert.equal(first.explanation.conclusion.includes(first.options[first.correctIndex]!.value), true);
    assert.ok(first.explanation.referenceAid?.length);
    assert.ok(first.explanation.quickMethod);
    assert.ok(first.explanation.commonTrapAlert);

    if (number >= 53 && number <= 58) assert.ok((first.ruleContext.shift ?? 0) > 0);
    if (number >= 59 && number <= 64) assert.ok((first.ruleContext.shift ?? 0) < 0);
    if (number >= 65 && number <= 68) assert.equal(first.ruleId, "OPPOSITE_ALPHABET_MAP");
    if (number === 69 || number === 73) assert.ok((first.ruleContext.shift ?? 0) > 0);
    if (number === 70 || number === 74) assert.ok((first.ruleContext.shift ?? 0) < 0);
    if (number === 71) assert.equal(first.ruleId, "OPPOSITE_ALPHABET_MAP");
    if (number >= 77 && number <= 80) assert.equal(first.metadata.wrapUsed, true);
    if (number === 77 || number === 79) assert.ok((first.ruleContext.shift ?? 0) > 0);
    if (number === 78 || number === 80) assert.ok((first.ruleContext.shift ?? 0) < 0);

    positions[first.correctIndex] += 1;
    if (first.metadata.wrapUsed) wrapped += 1;
    rules.add(first.ruleId);
    tasks.add(first.structuredPrompt.taskKind);
    answers.add(first.answerType);
    renderers.add(first.renderer);
    difficulties.add(first.difficulty);
    generated += 1;
  }
}

assert.equal(rules.size, 2);
assert.deepEqual([...tasks].sort(), ["CHOOSE_MATCHING_CODE", "DECODE_TARGET", "ENCODE_TARGET", "INFER_AND_ENCODE", "RECOVER_MISSING_LETTER"]);
assert.deepEqual([...answers].sort(), ["LETTER_CLUSTER", "SINGLE_CODE_TOKEN"]);
assert.deepEqual([...renderers].sort(), ["EXAMPLE_TARGET_BLOCK", "INLINE_CODE_PAIR", "MAPPING_TABLE"]);
assert.deepEqual([...difficulties].sort(), ["EASY", "MEDIUM"]);
assert.ok(Math.max(...positions) / Math.min(...positions) < 1.2, `Answer positions are imbalanced: ${positions.join(", ")}`);
assert.ok(wrapped >= 400, `Expected all 400 forced-wrap samples plus natural wrap coverage, received ${wrapped}`);

console.log(JSON.stringify({
  checkpoint: "COD-CP-003",
  qls: 28,
  rules: 2,
  generated,
  positions,
  wrapped,
  tasks: [...tasks].sort(),
  answers: [...answers].sort(),
  renderers: [...renderers].sort(),
  difficulties: [...difficulties].sort(),
}, null, 2));
