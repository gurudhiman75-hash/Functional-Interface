import assert from "node:assert/strict";
import { COD_CP001_QUESTION_LOGICS } from "./question-language.en";
import { COD_CP001_RULES } from "./rule-definitions";
import { generateCodCp001Question } from "./generator";
import { solveCodCp001 } from "./independent-solver";
import { validateOptions } from "../foundation/option-validator";
import { mappingFromEvidence } from "../foundation/mapping";
import { COD_CP001_WORD_POOL } from "./word-pool.en";

const expectedIds = Array.from({ length: 24 }, (_, index) => `COD-QL-${String(index + 1).padStart(3, "0")}`);
assert.deepEqual(COD_CP001_QUESTION_LOGICS.map((logic) => logic.qlId), expectedIds);
assert.equal(new Set(COD_CP001_QUESTION_LOGICS.map((logic) => logic.qlId)).size, 24);
assert.equal(COD_CP001_RULES.length, 4);
assert.equal(new Set(COD_CP001_RULES.map((rule) => rule.ruleId)).size, 4);

const answerPositions = [0, 0, 0, 0];
const renderers = new Set<string>();
const taskKinds = new Set<string>();
const answerTypes = new Set<string>();
const difficulties = new Set<string>();
let generated = 0;

for (const logic of COD_CP001_QUESTION_LOGICS) {
  for (let seed = 1; seed <= 100; seed += 1) {
    const first = generateCodCp001Question(logic.qlId, seed);
    const second = generateCodCp001Question(logic.qlId, seed);
    assert.deepEqual(first, second, `${logic.qlId} seed ${seed} must be deterministic`);
    validateOptions(first.options);
    assert.equal(first.options[first.correctIndex]!.value, solveCodCp001(first.structuredPrompt));
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(first.metadata.evidenceCoversTarget, true);
    assert.equal(first.metadata.mappingInjective, true);
    assert.equal(first.metadata.ambiguityAccepted, true);
    assert.equal(first.structuredPrompt.evidence.some((pair) => pair.source === first.structuredPrompt.target), false, "Target must not be exposed as an evidence source");
    assert.equal(first.structuredPrompt.evidence.every((pair) => COD_CP001_WORD_POOL.includes(pair.source as never)), true, "Evidence must use curated words rather than synthetic clusters");
    if (first.structuredPrompt.encodedTarget) {
      assert.equal(first.structuredPrompt.evidence.some((pair) => pair.code === first.structuredPrompt.encodedTarget), false, "Decode answer must not be exposed verbatim in evidence");
    }
    assert.equal(first.metadata.publiclyPublishable, false);
    assert.equal(first.metadata.maturity, "RUNTIME_PROOF");
    assert.equal(first.stem.includes("COD_"), false);
    assert.equal(first.stem.includes("{{"), false);
    assert.equal(first.explanation.conclusion.includes(first.options[first.correctIndex]!.value), true);
    const recovered = mappingFromEvidence(first.structuredPrompt.evidence, first.structuredPrompt.separator);
    assert.equal(new Set(Object.values(recovered)).size, Object.values(recovered).length);
    answerPositions[first.correctIndex] += 1;
    renderers.add(first.renderer);
    taskKinds.add(first.structuredPrompt.taskKind);
    answerTypes.add(first.answerType);
    difficulties.add(first.difficulty);
    generated += 1;
  }
}

const maxPosition = Math.max(...answerPositions);
const minPosition = Math.min(...answerPositions);
assert.ok(maxPosition / minPosition < 1.2, `Answer positions are imbalanced: ${answerPositions.join(", ")}`);
assert.deepEqual([...renderers].sort(), ["EXAMPLE_TARGET_BLOCK", "INLINE_CODE_PAIR", "MAPPING_TABLE"]);
assert.deepEqual([...taskKinds].sort(), ["DECODE_TARGET", "ENCODE_TARGET", "INFER_FROM_OVERLAP", "RECOVER_MISSING_CODE"]);
assert.deepEqual([...answerTypes].sort(), ["DIGIT_SEQUENCE", "LETTER_CLUSTER", "SINGLE_CODE_TOKEN", "SYMBOL_SEQUENCE"]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);

console.log(JSON.stringify({
  checkpoint: "COD-CP-001",
  qls: COD_CP001_QUESTION_LOGICS.length,
  rules: COD_CP001_RULES.length,
  generated,
  answerPositions,
  renderers: [...renderers].sort(),
  taskKinds: [...taskKinds].sort(),
  answerTypes: [...answerTypes].sort(),
  difficulties: [...difficulties].sort(),
}, null, 2));
