import assert from "node:assert/strict";
import { validateOptions } from "../foundation/option-validator";
import { COD_CP003_RULES } from "../COD-CP-003/rule-definitions";
import { transformWord } from "../COD-CP-003/alphabet";
import { COD_CP003_WORD_POOL } from "../COD-CP-003/word-pool.en";
import { generateCodCp004Question } from "./generator";
import { matchingPositionRules, samePositionContext, solveCodCp004 } from "./independent-solver";
import { COD_CP004_QUESTION_LOGICS } from "./question-language.en";
import { COD_CP004_RULES } from "./rule-definitions";
import { activatesEveryBranch, transformPositionWord } from "./transform";

assert.deepEqual(
  COD_CP004_QUESTION_LOGICS.map((logic) => logic.qlId),
  Array.from({ length: 32 }, (_, index) => `COD-QL-${String(81 + index).padStart(3, "0")}`),
);
assert.equal(COD_CP004_QUESTION_LOGICS.length, 32);
assert.equal(COD_CP004_RULES.length, 6);
assert.equal(new Set(COD_CP004_RULES.map((rule) => rule.ruleId)).size, 6);

const probeWords = ["TEAM", "MANGO", "ZEBRA", "CREDIT"];
const registrySignatures = new Map<string, string>();
for (const rule of COD_CP003_RULES) {
  for (const context of rule.contextDomain) {
    const signature = probeWords.map((word) => transformWord(rule.ruleId, context, word)).join("|");
    const identity = `${rule.ruleId}:${JSON.stringify(context)}`;
    assert.equal(registrySignatures.has(signature), false, `Registry collision between ${identity} and ${registrySignatures.get(signature)}`);
    registrySignatures.set(signature, identity);
  }
}
for (const rule of COD_CP004_RULES) {
  for (const context of rule.contextDomain) {
    const signature = probeWords.map((word) => transformPositionWord(rule.ruleId, context, word)).join("|");
    const identity = `${rule.ruleId}:${JSON.stringify(context)}`;
    assert.equal(registrySignatures.has(signature), false, `Registry collision between ${identity} and ${registrySignatures.get(signature)}`);
    registrySignatures.set(signature, identity);
  }
}

const positions = [0, 0, 0, 0];
const rules = new Set<string>();
const tasks = new Set<string>();
const answers = new Set<string>();
const renderers = new Set<string>();
const difficulties = new Set<string>();
let generated = 0;
let wrapped = 0;

for (const logic of COD_CP004_QUESTION_LOGICS) {
  const qlNumber = Number(logic.qlId.slice(-3));
  for (let seed = 1; seed <= 100; seed += 1) {
    const first = generateCodCp004Question(logic.qlId, seed);
    const second = generateCodCp004Question(logic.qlId, seed);
    assert.deepEqual(first, second, `${logic.qlId}/${seed} must be deterministic`);
    validateOptions(first.options);
    assert.equal(first.options[first.correctIndex]!.value, solveCodCp004(first.structuredPrompt));
    assert.equal(first.metadata.ambiguityAccepted, true);
    assert.equal(first.metadata.branchesActivated, true);
    assert.equal(first.metadata.publiclyPublishable, false);
    assert.equal(first.structuredPrompt.evidence.every((pair) => COD_CP003_WORD_POOL.includes(pair.source as never)), true);
    assert.equal(first.structuredPrompt.evidence.some((pair) => pair.source === first.structuredPrompt.targetWord), false);
    assert.equal(activatesEveryBranch(first.ruleId, first.structuredPrompt.targetWord), true);
    assert.equal(first.structuredPrompt.evidence.every((pair) => activatesEveryBranch(first.ruleId, pair.source)), true);

    const matches = matchingPositionRules(first.structuredPrompt.evidence);
    const intended = matches.find((match) =>
      match.checkpointId === "COD-CP-004" &&
      match.ruleId === first.ruleId &&
      samePositionContext(match.context, first.ruleContext),
    );
    assert.ok(intended);
    assert.equal(matches.some((match) => match.priority <= intended!.priority && !(
      match.checkpointId === "COD-CP-004" &&
      match.ruleId === intended!.ruleId &&
      samePositionContext(match.context, intended!.context)
    )), false);

    assert.equal(first.stem.includes("COD_"), false);
    assert.equal(first.stem.includes("{{"), false);
    assert.equal(first.explanation.conclusion.includes(first.options[first.correctIndex]!.value), true);
    if ([86, 92, 98, 104].includes(qlNumber)) assert.equal(first.metadata.wrapUsed, true);

    if (first.ruleId === "ODD_EVEN_POSITION_SHIFT") {
      assert.notEqual(first.ruleContext.oddShift, first.ruleContext.evenShift);
      assert.equal(Math.sign(first.ruleContext.oddShift ?? 0), Math.sign(first.ruleContext.evenShift ?? 0));
    }
    if (first.ruleId === "VOWEL_CONSONANT_CLASS_SHIFT") {
      assert.equal(Math.sign(first.ruleContext.vowelShift ?? 0), -Math.sign(first.ruleContext.consonantShift ?? 0));
    }
    if (first.ruleId === "ENDPOINT_INTERIOR_SHIFT") {
      assert.notEqual(first.ruleContext.endpointShift, first.ruleContext.interiorShift);
      assert.equal(Math.sign(first.ruleContext.endpointShift ?? 0), Math.sign(first.ruleContext.interiorShift ?? 0));
    }

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

assert.equal(rules.size, 6);
assert.deepEqual([...tasks].sort(), ["CHOOSE_MATCHING_CODE", "DECODE_TARGET", "ENCODE_TARGET", "INFER_AND_ENCODE", "RECOVER_MISSING_LETTER"]);
assert.deepEqual([...answers].sort(), ["LETTER_CLUSTER", "SINGLE_CODE_TOKEN"]);
assert.deepEqual([...renderers].sort(), ["EXAMPLE_TARGET_BLOCK", "INLINE_CODE_PAIR", "MAPPING_TABLE"]);
assert.deepEqual([...difficulties].sort(), ["HARD", "MEDIUM"]);
assert.ok(Math.max(...positions) / Math.min(...positions) < 1.2, `Answer positions are imbalanced: ${positions.join(", ")}`);
assert.ok(wrapped >= 400, `Expected at least the 400 forced-wrap samples, received ${wrapped}`);

console.log(JSON.stringify({
  checkpoint: "COD-CP-004",
  qls: 32,
  rules: 6,
  registeredRuleContexts: registrySignatures.size,
  generated,
  positions,
  wrapped,
  tasks: [...tasks].sort(),
  answers: [...answers].sort(),
  renderers: [...renderers].sort(),
  difficulties: [...difficulties].sort(),
}, null, 2));
