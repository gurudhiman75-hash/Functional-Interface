import assert from "node:assert/strict";
import { validateOptions } from "../foundation/option-validator";
import { generateCodCp006Question } from "./generator";
import { intendedCompositeMatch, matchingCompositeRules, solveCodCp006 } from "./independent-solver";
import { COD_CP006_QUESTION_LOGICS } from "./question-language.en";
import { COD_CP006_RULES } from "./rule-definitions";
import { codeTokenAt, compositeStageResult, compositeStagesActive, inverseCompositeWord } from "./transform";

assert.deepEqual(
  COD_CP006_QUESTION_LOGICS.map((logic) => logic.qlId),
  Array.from({ length: 32 }, (_, index) => `COD-QL-${String(137 + index).padStart(3, "0")}`),
);
assert.equal(COD_CP006_QUESTION_LOGICS.length, 32);
assert.equal(COD_CP006_RULES.length, 6);
assert.equal(new Set(COD_CP006_RULES.map((rule) => rule.ruleId)).size, 6);

const positions = [0, 0, 0, 0];
const rules = new Set<string>();
const tasks = new Set<string>();
const answers = new Set<string>();
const renderers = new Set<string>();
const difficulties = new Set<string>();
const difficultyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };
const indexedContexts = new Set<string>();
const alternatingContexts = new Set<string>();
const halfContexts = new Set<string>();
const rotationMoves = new Set<string>();
const rotationClassContexts = new Set<string>();
const permutationContexts = new Set<string>();
const rankTransformRules = new Set<string>();
let generated = 0;
let wrapped = 0;
let normalized = 0;

for (const logic of COD_CP006_QUESTION_LOGICS) {
  const qlNumber = Number(logic.qlId.slice(-3));
  for (let seed = 1; seed <= 100; seed += 1) {
    const first = generateCodCp006Question(logic.qlId, seed);
    const second = generateCodCp006Question(logic.qlId, seed);
    assert.deepEqual(first, second, `${logic.qlId}/${seed} must be deterministic`);
    validateOptions(first.options);
    assert.equal(first.options[first.correctIndex]!.value, solveCodCp006(first.structuredPrompt));
    assert.equal(first.metadata.ambiguityAccepted, true);
    assert.equal(first.metadata.stage1Active, true);
    assert.equal(first.metadata.stage2Active, true);
    assert.equal(first.metadata.inverseUnique, true);
    assert.equal(first.metadata.publiclyPublishable, false);
    assert.equal(first.structuredPrompt.evidence.some((pair) => pair.source === first.structuredPrompt.targetWord), false);
    assert.equal(compositeStagesActive(first.ruleId, first.ruleContext, first.structuredPrompt.targetWord), true);
    assert.equal(first.structuredPrompt.evidence.every((pair) => compositeStagesActive(first.ruleId, first.ruleContext, pair.source)), true);

    const targetStages = compositeStageResult(first.ruleId, first.ruleContext, first.structuredPrompt.targetWord);
    assert.equal(first.metadata.stage1Output, targetStages.stage1);
    assert.equal(first.explanation.targetApplication.join(" ").includes(targetStages.stage1), true);
    assert.equal(first.explanation.ruleStatement.includes("Stage 1"), true);
    assert.equal(first.explanation.ruleStatement.includes("Stage 2"), true);
    assert.equal(first.explanation.conclusion.includes(first.options[first.correctIndex]!.value), true);
    assert.ok(first.explanation.referenceAid?.length);
    assert.ok(first.explanation.quickMethod);
    assert.ok(first.explanation.commonTrapAlert);
    assert.equal(first.explanation.commonTrapAlert, first.explanation.closestTrapRejection);
    assert.equal(first.options.filter((option) => !option.isCorrect).some((option) => first.explanation.commonTrapAlert!.includes(option.value)), true);
    assert.equal(first.stem.includes("COD_"), false);
    assert.equal(first.stem.includes("{{"), false);

    const matches = matchingCompositeRules(first.structuredPrompt.evidence);
    const intended = matches.find((match) => intendedCompositeMatch(match, first.ruleId, first.ruleContext));
    assert.ok(intended, `${logic.qlId}/${seed} must retain its intended pipeline`);
    assert.equal(matches.some((match) => match.priority <= intended!.priority && !intendedCompositeMatch(match, first.ruleId, first.ruleContext)), false);

    if (first.structuredPrompt.taskKind === "DECODE_TARGET") {
      assert.equal(inverseCompositeWord(first.ruleId, first.ruleContext, first.structuredPrompt.encodedTarget!), first.options[first.correctIndex]!.value);
    }
    if (first.structuredPrompt.taskKind === "RECOVER_MISSING_TOKEN") {
      const fullCode = targetStages.finalCode;
      const expected = codeTokenAt(fullCode, first.structuredPrompt.missingIndex!, first.structuredPrompt.separator);
      assert.equal(first.options[first.correctIndex]!.value, expected);
      assert.match(first.explanation.targetApplication.join(" "), new RegExp(`\\? = ${expected.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}`));
      assert.equal(first.explanation.targetApplication.join(" ").includes(`code position ${first.structuredPrompt.missingIndex! + 1}`), true);
    }
    if (first.ruleId === "TRANSFORM_THEN_RANK_SEQUENCE") {
      for (const pair of [...first.structuredPrompt.evidence, { source: first.structuredPrompt.targetWord, code: targetStages.finalCode }]) {
        const tokens = pair.code.split("-").map(Number);
        assert.equal(tokens.length, pair.source.length);
        assert.equal(tokens.every((token) => Number.isInteger(token) && token >= 1 && token <= 26), true);
      }
      rankTransformRules.add(first.ruleContext.transformRuleId!);
    }
    if (first.ruleId === "HALF_SWAP_THEN_ODD_EVEN_SHIFT") {
      assert.equal(first.structuredPrompt.evidence.some((pair) => pair.source.length === 4), true);
      assert.equal(first.structuredPrompt.evidence.some((pair) => pair.source.length === 6), true);
      halfContexts.add(`${first.ruleContext.oddShift}:${first.ruleContext.evenShift}`);
    }
    if (first.ruleId === "PAIR_SWAP_THEN_ALTERNATING_SHIFT") {
      assert.equal(first.structuredPrompt.evidence.every((pair) => pair.source.length % 2 === 0), true);
      alternatingContexts.add(`${first.ruleContext.magnitude}:${first.ruleContext.firstDirection}`);
    }
    if (first.ruleId === "REVERSE_THEN_INDEXED_SHIFT") indexedContexts.add(`${first.ruleContext.baseShift}:${first.ruleContext.direction}`);
    if (first.ruleId === "ROTATE_THEN_CLASS_SHIFT") {
      rotationMoves.add(`${first.ruleContext.rotationDirection}:${first.ruleContext.rotationAmount}`);
      rotationClassContexts.add(`${first.ruleContext.vowelShift}:${first.ruleContext.consonantShift}`);
    }
    if (first.ruleId === "OPPOSITE_MAP_WITH_POSITION_PERMUTATION") {
      permutationContexts.add(`${first.ruleContext.permutationRuleId}:${JSON.stringify(first.ruleContext.permutationContext)}`);
    }
    if ([142, 148, 154, 160].includes(qlNumber)) assert.equal(first.metadata.wrapUsed, true);
    if (first.metadata.wrapUsed) wrapped += 1;
    if (first.metadata.stageOrderNormalized) normalized += 1;

    positions[first.correctIndex] += 1;
    rules.add(first.ruleId);
    tasks.add(first.structuredPrompt.taskKind);
    answers.add(first.answerType);
    renderers.add(first.renderer);
    difficulties.add(first.difficulty);
    difficultyCounts[first.difficulty] += 1;
    generated += 1;
  }
}

assert.equal(generated, 3200);
assert.equal(rules.size, 6);
assert.deepEqual([...tasks].sort(), ["CHOOSE_MATCHING_CODE", "DECODE_TARGET", "ENCODE_TARGET", "INFER_AND_ENCODE", "RECOVER_MISSING_TOKEN"]);
assert.deepEqual([...answers].sort(), ["DIGIT_SEQUENCE", "LETTER_CLUSTER", "NUMBER", "SINGLE_CODE_TOKEN"]);
assert.deepEqual([...renderers].sort(), ["EXAMPLE_TARGET_BLOCK", "INLINE_CODE_PAIR", "MAPPING_TABLE"]);
assert.deepEqual([...difficulties].sort(), ["HARD", "MEDIUM"]);
assert.ok(difficultyCounts.MEDIUM / generated >= 0.35);
assert.ok(difficultyCounts.HARD / generated <= 0.65);
assert.ok(Math.max(...positions) / Math.min(...positions) < 1.2, `Answer positions are imbalanced: ${positions.join(", ")}`);
assert.equal(indexedContexts.size, 4);
assert.equal(alternatingContexts.size, 6);
assert.equal(halfContexts.size, 8);
assert.equal(rotationMoves.size, 4);
assert.equal(rotationClassContexts.size, 6);
assert.equal(permutationContexts.size, 10);
assert.equal(rankTransformRules.size, 8);
assert.ok(wrapped >= 400);
assert.ok(normalized > 0);

console.log(JSON.stringify({
  checkpoint: "COD-CP-006",
  qls: 32,
  rules: 6,
  generated,
  positions,
  wrapped,
  normalized,
  tasks: [...tasks].sort(),
  answers: [...answers].sort(),
  renderers: [...renderers].sort(),
  difficulties: difficultyCounts,
  indexedContexts: indexedContexts.size,
  alternatingContexts: alternatingContexts.size,
  halfContexts: halfContexts.size,
  rotationMoves: rotationMoves.size,
  rotationClassContexts: rotationClassContexts.size,
  permutationContexts: permutationContexts.size,
  rankTransformRules: [...rankTransformRules].sort(),
}, null, 2));
