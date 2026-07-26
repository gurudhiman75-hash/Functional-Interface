import assert from "node:assert/strict";
import { validateOptions } from "../foundation/option-validator";
import { generateCodCp005Question } from "./generator";
import { intendedRearrangementMatch, matchingRearrangementRules, solveCodCp005 } from "./independent-solver";
import { COD_CP005_QUESTION_LOGICS } from "./question-language.en";
import { COD_CP005_RULES } from "./rule-definitions";
import {
  inverseRearrangementWord,
  rearrangementIsActive,
  rearrangementOrder,
  transformRearrangementWord,
} from "./transform";
import { COD_CP005_WORD_POOL } from "./word-pool.en";

assert.deepEqual(
  COD_CP005_QUESTION_LOGICS.map((logic) => logic.qlId),
  Array.from({ length: 24 }, (_, index) => `COD-QL-${String(113 + index).padStart(3, "0")}`),
);
assert.equal(COD_CP005_QUESTION_LOGICS.length, 24);
assert.equal(COD_CP005_RULES.length, 6);
assert.equal(new Set(COD_CP005_RULES.map((rule) => rule.ruleId)).size, 6);

const probeWords = ["TEAM", "MANGO", "PLANET"];
const signatures = new Map<string, string>();
for (const rule of COD_CP005_RULES) {
  for (const context of rule.contextDomain) {
    const signature = probeWords.map((word) => {
      try {
        return transformRearrangementWord(rule.ruleId, context, word);
      } catch {
        return "INVALID";
      }
    }).join("|");
    const identity = `${rule.ruleId}:${JSON.stringify(context)}`;
    assert.equal(signatures.has(signature), false, `Registry collision between ${identity} and ${signatures.get(signature)}`);
    signatures.set(signature, identity);
  }
}

const positions = [0, 0, 0, 0];
const rules = new Set<string>();
const tasks = new Set<string>();
const answers = new Set<string>();
const renderers = new Set<string>();
const difficulties = new Map<string, number>();
const contexts = new Set<string>();
let generated = 0;
let recovered = 0;

for (const logic of COD_CP005_QUESTION_LOGICS) {
  for (let seed = 1; seed <= 100; seed += 1) {
    const first = generateCodCp005Question(logic.qlId, seed);
    const second = generateCodCp005Question(logic.qlId, seed);
    assert.deepEqual(first, second, `${logic.qlId}/${seed} must be deterministic`);
    validateOptions(first.options);
    assert.equal(first.options[first.correctIndex]!.value, solveCodCp005(first.structuredPrompt));
    assert.equal(first.metadata.ambiguityAccepted, true);
    assert.equal(first.metadata.inverseUnique, true);
    assert.equal(first.metadata.publiclyPublishable, false);
    assert.equal(first.structuredPrompt.evidence.every((pair) => COD_CP005_WORD_POOL.includes(pair.source as never)), true);
    assert.equal(first.structuredPrompt.evidence.some((pair) => pair.source === first.structuredPrompt.targetWord), false);
    assert.equal(rearrangementIsActive(first.ruleId, first.ruleContext, first.structuredPrompt.targetWord), true);
    assert.equal(first.structuredPrompt.evidence.every((pair) => rearrangementIsActive(first.ruleId, first.ruleContext, pair.source)), true);

    const expectedCode = transformRearrangementWord(first.ruleId, first.ruleContext, first.structuredPrompt.targetWord);
    assert.equal(inverseRearrangementWord(first.ruleId, first.ruleContext, expectedCode), first.structuredPrompt.targetWord);
    assert.deepEqual(
      first.metadata.permutationOrder,
      rearrangementOrder(first.ruleId, first.ruleContext, first.structuredPrompt.targetWord.length).map((index) => index + 1),
    );

    const matches = matchingRearrangementRules(first.structuredPrompt.evidence);
    const intended = matches.find((match) => intendedRearrangementMatch(match, first.ruleId, first.ruleContext));
    assert.ok(intended);
    assert.equal(matches.some((match) => match.priority <= intended!.priority && !intendedRearrangementMatch(match, first.ruleId, first.ruleContext)), false);

    const firstEvidence = first.structuredPrompt.evidence[0]!;
    assert.equal(first.explanation.ruleStatement.includes(`${firstEvidence.source} → ${firstEvidence.code}`), true);
    assert.equal(first.explanation.ruleStatement.includes("Therefore"), true);
    assert.equal(first.explanation.ruleStatement.includes("source-position"), true);
    assert.equal(first.explanation.conclusion.includes(first.options[first.correctIndex]!.value), true);
    assert.ok(first.explanation.referenceAid?.length);
    assert.ok(first.explanation.quickMethod);
    const trap = first.explanation.commonTrapAlert;
    assert.ok(trap);
    assert.equal(first.explanation.closestTrapRejection, trap);
    assert.equal(first.options.filter((option) => !option.isCorrect).some((option) => trap!.includes(option.value)), true);

    if (first.structuredPrompt.taskKind === "RECOVER_MISSING_LETTER") {
      const displayed = first.structuredPrompt.displayedTargetCode!;
      assert.equal((displayed.match(/\?/g) ?? []).length, 1);
      assert.equal(first.stem.includes(displayed), true);
      assert.equal(displayed[first.structuredPrompt.missingIndex!], "?");
      assert.equal(first.explanation.targetApplication.some((line) => line.includes(`? = ${first.options[first.correctIndex]!.value}`)), true);
      recovered += 1;
    }

    if (first.ruleId === "HALF_SWAP") {
      assert.equal(first.structuredPrompt.targetWord.length % 2, 0);
      assert.equal(new Set(first.structuredPrompt.evidence.map((pair) => pair.source.length)).size >= 2, true);
    }
    if (first.ruleId === "CYCLIC_POSITION_ROTATION") {
      assert.ok(first.ruleContext.direction);
      assert.ok(first.ruleContext.amount);
      if (first.ruleContext.amount === 2) assert.equal(first.structuredPrompt.evidence.some((pair) => pair.source.length === 5), true);
    }
    if (first.ruleId === "OUTER_INNER_INTERLEAVING") assert.ok(first.ruleContext.startSide);

    positions[first.correctIndex] += 1;
    rules.add(first.ruleId);
    tasks.add(first.structuredPrompt.taskKind);
    answers.add(first.answerType);
    renderers.add(first.renderer);
    difficulties.set(first.difficulty, (difficulties.get(first.difficulty) ?? 0) + 1);
    contexts.add(`${first.ruleId}:${JSON.stringify(first.ruleContext)}`);
    generated += 1;
  }
}

assert.equal(generated, 2400);
assert.equal(recovered, 400);
assert.equal(rules.size, 6);
assert.deepEqual([...tasks].sort(), ["CHOOSE_MATCHING_CODE", "DECODE_TARGET", "ENCODE_TARGET", "INFER_AND_ENCODE", "RECOVER_MISSING_LETTER"]);
assert.deepEqual([...answers].sort(), ["LETTER_CLUSTER", "SINGLE_CODE_TOKEN"]);
assert.deepEqual([...renderers].sort(), ["EXAMPLE_TARGET_BLOCK", "INLINE_CODE_PAIR", "MAPPING_TABLE"]);
assert.deepEqual([...difficulties.keys()].sort(), ["EASY", "MEDIUM"]);
assert.ok((difficulties.get("EASY") ?? 0) / generated >= 0.12 && (difficulties.get("EASY") ?? 0) / generated <= 0.55);
assert.ok((difficulties.get("MEDIUM") ?? 0) / generated >= 0.45 && (difficulties.get("MEDIUM") ?? 0) / generated <= 0.88);
assert.equal(difficulties.get("HARD") ?? 0, 0);
assert.ok(Math.max(...positions) / Math.min(...positions) < 1.2, `Answer positions are imbalanced: ${positions.join(", ")}`);
assert.equal([...contexts].filter((value) => value.startsWith("CYCLIC_POSITION_ROTATION:")).length, 4);
assert.equal([...contexts].filter((value) => value.startsWith("OUTER_INNER_INTERLEAVING:")).length, 2);

console.log(JSON.stringify({
  checkpoint: "COD-CP-005",
  qls: 24,
  rules: 6,
  generated,
  recovered,
  positions,
  tasks: [...tasks].sort(),
  answers: [...answers].sort(),
  renderers: [...renderers].sort(),
  difficulties: Object.fromEntries(difficulties),
  contexts: [...contexts].sort(),
}, null, 2));
