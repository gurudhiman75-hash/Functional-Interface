import assert from "node:assert/strict";
import { checkWordAmbiguity } from "./ambiguity-checker";
import { generateWordAnalogy } from "./generator";
import {
  independentlyApplyWordRule,
  matchingWordRules,
  solveWordRule,
} from "./independent-solver";
import { wordOptionKey } from "./option-validator";
import { ANA_CP007_QLS } from "./question-language.en";
import {
  ANA_CP007_RULES,
  sameWordRuleResult,
} from "./rule-definitions";

const EXPECTED_RULE_IDS = [
  "WORD_REMOVE_VOWELS",
  "WORD_REMOVE_CONSONANTS",
  "WORD_POSITION_EXTRACTION",
  "WORD_ALPHABET_POSITION_SUM",
  "WORD_LENGTH_MINUS_ONE",
  "WORD_EQUALITY_PATTERN",
  "WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT",
] as const;

assert.equal(ANA_CP007_QLS.length, 14);
assert.equal(new Set(ANA_CP007_QLS.map((ql) => ql.qlId)).size, 14);
assert.deepEqual(
  ANA_CP007_QLS.map((ql) => ql.qlId),
  Array.from({ length: 14 }, (_, index) => `ANA-QL-${String(209 + index).padStart(3, "0")}`),
);
assert.deepEqual(ANA_CP007_RULES.map((rule) => rule.id), EXPECTED_RULE_IDS);
assert.equal(ANA_CP007_RULES.length, 7);
assert.ok(ANA_CP007_QLS.every((ql) => ql.taskKind === "wordStructureTransform"));
assert.ok(ANA_CP007_QLS.every((ql) => ql.solveMode === "WORD_STRUCTURE_RULE"));
assert.ok(ANA_CP007_QLS.every((ql) => ql.renderer === "STRUCTURED_TEXT"));
assert.ok(ANA_CP007_QLS.every((ql) => ql.localeMode === "TRANSLATABLE_INSTRUCTIONS_LATIN_TOKENS"));
assert.deepEqual(
  ANA_CP007_QLS.filter((_, index) => index % 2 === 0).map((ql) => ql.presentationMode),
  Array(7).fill("DIRECT_COMPLETION"),
);
assert.deepEqual(
  ANA_CP007_QLS.filter((_, index) => index % 2 === 1).map((ql) => ql.presentationMode),
  Array(7).fill("PAIR_SELECTION"),
);

const answerPositions = [0, 0, 0, 0];
const layouts = new Set<string>();
const difficulties = new Set<string>();
const ruleCoverage = new Set<string>();
const contextsByRule = new Map<string, Set<string>>();
let generatedCount = 0;

for (const ql of ANA_CP007_QLS) {
  const stems = new Set<string>();
  for (let seed = 0; seed < 20; seed += 1) {
    const generated = generateWordAnalogy(ql.qlId, seed);
    const repeated = generateWordAnalogy(ql.qlId, seed);
    assert.deepEqual(repeated, generated, `${ql.qlId} seed ${seed} is not deterministic.`);
    generatedCount += 1;
    stems.add(generated.stem);
    layouts.add(generated.layout);
    difficulties.add(generated.difficulty);
    ruleCoverage.add(generated.ruleId);
    answerPositions[generated.correctIndex] += 1;
    const contextSet = contextsByRule.get(generated.ruleId) ?? new Set<string>();
    contextSet.add(JSON.stringify(generated.context));
    contextsByRule.set(generated.ruleId, contextSet);

    assert.equal(generated.checkpointId, "ANA-CP-007");
    assert.equal(generated.qlId, ql.qlId);
    assert.equal(generated.ruleId, ql.ruleId);
    assert.equal(generated.presentationMode, ql.presentationMode);
    assert.equal(generated.options.length, 4);
    assert.equal(new Set(generated.options.map((option) => wordOptionKey(option.value))).size, 4);
    assert.equal(generated.options.filter((option) => option.errorLabel === null).length, 1);
    assert.ok(generated.correctIndex >= 0 && generated.correctIndex < 4);
    assert.equal(generated.metadata.ambiguityAccepted, true);
    assert.equal(generated.metadata.publiclyPublishable, false);
    assert.equal(generated.metadata.maturity, "RUNTIME_PROOF");
    assert.equal(generated.metadata.wordTokenLanguage, "en");

    assert.ok(sameWordRuleResult(
      solveWordRule(generated.ruleId, generated.context, generated.source.input),
      generated.source.output,
    ));
    assert.ok(sameWordRuleResult(
      solveWordRule(generated.ruleId, generated.context, generated.target.input),
      generated.target.output,
    ));
    assert.ok(sameWordRuleResult(
      independentlyApplyWordRule(generated.ruleId, generated.context, generated.source.input),
      generated.source.output,
    ));
    assert.ok(sameWordRuleResult(
      independentlyApplyWordRule(generated.ruleId, generated.context, generated.target.input),
      generated.target.output,
    ));
    assert.equal(
      checkWordAmbiguity(generated.ruleId, generated.context, [generated.source, generated.target]).accepted,
      true,
    );
    assert.equal(
      matchingWordRules([generated.source, generated.target]).filter(
        (match) => match.priority <= ANA_CP007_RULES.find((rule) => rule.id === generated.ruleId)!.priority,
      ).length,
      1,
    );

    if (generated.presentationMode === "DIRECT_COMPLETION") {
      assert.ok(generated.options.every((option) => !Array.isArray(option.value)));
      assert.ok(sameWordRuleResult(
        generated.options[generated.correctIndex].value as string | number,
        generated.target.output,
      ));
    } else {
      assert.ok(generated.options.every((option) => Array.isArray(option.value)));
      const correct = generated.options[generated.correctIndex].value as readonly [string, string | number];
      assert.equal(correct[0], generated.target.input);
      assert.ok(sameWordRuleResult(correct[1], generated.target.output));
    }

    assert.ok(generated.explanation.ruleStatement.length >= 45);
    assert.ok(generated.explanation.sourceDemonstration.length >= 80);
    assert.ok(generated.explanation.targetApplication.length >= 80);
    assert.ok(generated.explanation.sourceDemonstration.includes(generated.source.input));
    assert.ok(generated.explanation.sourceDemonstration.includes(String(generated.source.output)));
    assert.ok(generated.explanation.targetApplication.includes(generated.target.input));
    assert.ok(generated.explanation.targetApplication.includes(String(generated.target.output)));
    assert.ok(generated.explanation.closestTrapRejection.length >= 70);
    assert.ok(!JSON.stringify(generated.explanation).includes("WORD_"));

    if (generated.ruleId === "WORD_LENGTH_MINUS_ONE") {
      assert.equal(generated.source.output, generated.source.input.length - 1);
      assert.equal(generated.target.output, generated.target.input.length - 1);
      assert.notEqual(generated.source.input.length, generated.target.input.length);
    }
    if (generated.ruleId === "WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT") {
      assert.equal(generated.context.kind, "CLASS_SHIFT");
      if (generated.context.kind === "CLASS_SHIFT") {
        assert.notEqual(generated.context.vowelShift, generated.context.consonantShift);
        assert.notEqual(generated.context.vowelShift, 0);
        assert.notEqual(generated.context.consonantShift, 0);
      }
    }
  }
  assert.ok(stems.size >= 10, `${ql.qlId} has insufficient visible stem variety: ${stems.size}`);
}

assert.equal(generatedCount, 280);
assert.deepEqual(answerPositions, [70, 70, 70, 70]);
assert.deepEqual([...layouts].sort(), ["ARROW", "BOXED_PAIRS", "INLINE", "TWO_ROW_TABLE"]);
assert.ok(difficulties.has("EASY"));
assert.ok(difficulties.has("MEDIUM"));
assert.ok(difficulties.has("HARD"));
assert.deepEqual([...ruleCoverage], [...new Set(EXPECTED_RULE_IDS)]);
assert.ok((contextsByRule.get("WORD_POSITION_EXTRACTION")?.size ?? 0) >= 2);
assert.ok((contextsByRule.get("WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT")?.size ?? 0) >= 4);

console.log("ANA-CP-007 English runtime audit passed.", {
  qlCount: ANA_CP007_QLS.length,
  generatedCount,
  ruleCount: ruleCoverage.size,
  layouts: [...layouts],
  difficulties: [...difficulties],
  answerPositions,
  contextsByRule: Object.fromEntries(
    [...contextsByRule].map(([ruleId, contexts]) => [ruleId, contexts.size]),
  ),
});
