import assert from "node:assert/strict";
import { independentlySolveAnaCp010Numeric, independentlyValidateAnaCp010Set } from "./independent-solver";
import {
  ANA_CP010_NUMERIC_QLS,
  ANA_CP010_QLS,
  ANA_CP010_SEMANTIC_QLS,
  ANA_CP010_SET_QLS,
} from "./question-language.en";
import { generateAnaCp010 } from "./runtime";
import { anaCp010NumericRuleById } from "./rule-definitions";
import { ANA_CP010_SEMANTIC_RELATIONS } from "./semantic-registry";
import {
  ANA_CP010_EQUIVALENT_PAIR_DISTRACTOR_RELATIONS,
  ANA_CP010_MISSING_TERM_SAFE_RELATION_IDS,
  generateAnaCp010Semantic,
} from "./semantic-runtime";
import { independentlyValidateAnaCp010SemanticPair } from "./semantic-solver";

assert.equal(ANA_CP010_QLS.length, 18);
assert.deepEqual(
  ANA_CP010_QLS.map((entry) => entry.qlId),
  Array.from({ length: 18 }, (_, index) => `ANA-QL-${String(251 + index).padStart(3, "0")}`),
);
assert.equal(new Set(ANA_CP010_QLS.map((entry) => entry.qlId)).size, 18);
assert.equal(ANA_CP010_NUMERIC_QLS.length, 14);
assert.equal(ANA_CP010_SET_QLS.length, 2);
assert.equal(ANA_CP010_SEMANTIC_QLS.length, 2);
assert.equal(ANA_CP010_SEMANTIC_RELATIONS.length, 9);
assert.ok(ANA_CP010_SEMANTIC_RELATIONS.every((relation) => relation.facts.length >= 6));

const sourceFixtures = [
  ["NUM_HIGHER_FIXED_POWER", 3, { exponent: 5 }, 243],
  ["NUM_HIGHER_FIXED_POWER", 5, { exponent: 5 }, 3125],
  ["NUM_EXACT_SQUARE_ROOT", 484, {}, 22],
  ["NUM_EXACT_SQUARE_ROOT", 1024, {}, 32],
  ["NUM_CUBE_ROOT_ADJUST", 2744, { adjust: -1 }, 13],
  ["NUM_CUBE_ROOT_ADJUST", 2197, { adjust: -1 }, 12],
  ["NUM_CUBE_SUBTRACT", 10, { constant: 4 }, 996],
  ["NUM_DIGIT_QUOTIENT", 93, {}, 3],
  ["NUM_DIGIT_QUOTIENT", 82, {}, 4],
  ["NUM_THREE_DIGIT_SUM", 654, {}, 15],
  ["NUM_THREE_DIGIT_SUM", 732, {}, 12],
  ["NUM_THREE_DIGIT_PRODUCT", 258, {}, 80],
  ["NUM_THREE_DIGIT_PRODUCT", 369, {}, 162],
] as const;

for (const [ruleId, input, context, expected] of sourceFixtures) {
  const rule = anaCp010NumericRuleById(ruleId);
  assert.equal(rule.apply(input, context), expected, `${ruleId} generator fixture mismatch`);
  assert.equal(independentlySolveAnaCp010Numeric(ruleId, input, context), expected, `${ruleId} solver fixture mismatch`);
}

assert.ok(independentlyValidateAnaCp010Set("SET_ALL_PRIME", [11, 23, 37]));
assert.ok(!independentlyValidateAnaCp010Set("SET_ALL_PRIME", [11, 25, 37]));
assert.ok(independentlyValidateAnaCp010Set("SET_FIXED_RATIO_PROGRESSION", [6, 12, 24]));
assert.ok(!independentlyValidateAnaCp010Set("SET_FIXED_RATIO_PROGRESSION", [6, 12, 25]));

const answerPositions = [0, 0, 0, 0];
const seenDifficulties = new Set<string>();
const seenRules = new Set<string>();

for (const ql of [...ANA_CP010_NUMERIC_QLS, ...ANA_CP010_SET_QLS]) {
  for (let seed = 0; seed < 60; seed += 1) {
    const generated = generateAnaCp010(ql.qlId, seed);
    assert.equal(generated.qlId, ql.qlId);
    assert.equal(generated.options.length, 4);
    assert.equal(generated.options.filter((option) => option.errorLabel === null).length, 1);
    assert.ok(generated.correctIndex >= 0 && generated.correctIndex < 4);
    assert.equal(generated.options[generated.correctIndex].errorLabel, null);
    assert.ok(generated.stem.length > 25);
    assert.ok(generated.explanation.length >= 3);
    assert.ok(generated.explanation.every((line) => line.length > 8));
    assert.ok(generated.options.filter((option) => option.errorLabel !== null).every((option) => option.errorLabel));

    if (generated.kind === "NUMERIC") {
      assert.equal(
        independentlySolveAnaCp010Numeric(generated.ruleId, generated.source.input, generated.context),
        generated.source.output,
      );
      assert.equal(
        independentlySolveAnaCp010Numeric(generated.ruleId, generated.target.input, generated.context),
        generated.target.output,
      );
      if (generated.presentationMode === "MISSING_FOURTH_TERM") {
        assert.equal(generated.options[generated.correctIndex].value, generated.target.output);
      } else {
        assert.deepEqual(generated.options[generated.correctIndex].value, [generated.target.input, generated.target.output]);
      }
    } else if (generated.ruleId === "SET_ALL_PRIME") {
      assert.equal(generated.options.filter((option) => independentlyValidateAnaCp010Set("SET_ALL_PRIME", option.value)).length, 1);
    } else {
      const ratio = generated.source[1] / generated.source[0];
      assert.equal(
        generated.options.filter((option) => independentlyValidateAnaCp010Set("SET_FIXED_RATIO_PROGRESSION", option.value) && option.value[1] / option.value[0] === ratio).length,
        1,
      );
    }

    answerPositions[generated.correctIndex] += 1;
    seenDifficulties.add(generated.difficulty);
    seenRules.add(generated.ruleId);
  }
}

const semanticAnswerPositions = [0, 0, 0, 0];
const seenSemanticRelations = new Set<string>();
const seenMissingSemanticRelations = new Set<string>();
const seenEquivalentSemanticRelations = new Set<string>();
const missingSafeRelations = new Set<string>(ANA_CP010_MISSING_TERM_SAFE_RELATION_IDS);

for (const ql of ANA_CP010_SEMANTIC_QLS) {
  for (let seed = 0; seed < 180; seed += 1) {
    const english = generateAnaCp010Semantic(ql.qlId, seed, "en-IN");
    const hindi = generateAnaCp010Semantic(ql.qlId, seed, "hi-IN");
    const punjabi = generateAnaCp010Semantic(ql.qlId, seed, "pa-IN");
    const localized = [english, hindi, punjabi] as const;
    assert.equal(english.relationId, hindi.relationId);
    assert.equal(english.relationId, punjabi.relationId);
    assert.equal(english.sourceFactId, hindi.sourceFactId);
    assert.equal(english.targetFactId, hindi.targetFactId);
    assert.equal(english.correctIndex, hindi.correctIndex);
    assert.equal(english.correctIndex, punjabi.correctIndex);
    assert.equal(english.options.length, 4);
    assert.equal(hindi.options.length, 4);
    assert.equal(punjabi.options.length, 4);
    assert.ok(english.stem.length > 30 && hindi.stem.length > 30 && punjabi.stem.length > 30);
    assert.ok(!punjabi.stem.includes("ਸਾਦ੍ਰਿਸ਼ਤਾ"));
    assert.ok(!punjabi.stem.includes("ਪਦ"));
    assert.ok(independentlyValidateAnaCp010SemanticPair(english.relationId, english.sourceA, english.sourceB, "en-IN"));
    assert.ok(independentlyValidateAnaCp010SemanticPair(hindi.relationId, hindi.sourceA, hindi.sourceB, "hi-IN"));
    assert.ok(independentlyValidateAnaCp010SemanticPair(punjabi.relationId, punjabi.sourceA, punjabi.sourceB, "pa-IN"));

    if (english.presentationMode === "EQUIVALENT_PAIR_SELECTION") {
      seenEquivalentSemanticRelations.add(english.relationId);
      for (const generated of localized) {
        const valid = generated.options.filter((option) => Array.isArray(option.value)
          && independentlyValidateAnaCp010SemanticPair(generated.relationId, option.value[0], option.value[1], generated.locale));
        assert.equal(valid.length, 1);

        for (const option of generated.options) {
          if (option.errorLabel === null) continue;
          assert.ok(Array.isArray(option.value));
          if (!Array.isArray(option.value)) throw new Error("Equivalent-pair distractor must be a pair.");
          const matchingRelationIds = ANA_CP010_SEMANTIC_RELATIONS
            .filter((relation) => independentlyValidateAnaCp010SemanticPair(relation.id, option.value[0], option.value[1], generated.locale))
            .map((relation) => relation.id);
          assert.equal(matchingRelationIds.length, 1, `${generated.qlId} distractor must be one intact governed relation pair.`);
          const distractorRelationId = matchingRelationIds[0];
          assert.notEqual(distractorRelationId, generated.relationId);
          assert.ok(
            ANA_CP010_EQUIVALENT_PAIR_DISTRACTOR_RELATIONS[generated.relationId].includes(distractorRelationId as never),
            `${generated.qlId} used an ungoverned semantic distractor relation.`,
          );
        }
      }
    } else {
      seenMissingSemanticRelations.add(english.relationId);
      assert.ok(missingSafeRelations.has(english.relationId), `${english.relationId} is not approved for missing-term semantic generation.`);
      for (const generated of localized) {
        assert.equal(generated.options[generated.correctIndex].value, generated.targetB);
        for (const option of generated.options) {
          if (option.errorLabel === null) continue;
          assert.equal(typeof option.value, "string");
          if (typeof option.value !== "string") throw new Error("Missing-term distractor must be one term.");
          assert.ok(!independentlyValidateAnaCp010SemanticPair(generated.relationId, generated.targetA, option.value, generated.locale));
        }
      }
    }
    semanticAnswerPositions[english.correctIndex] += 1;
    seenSemanticRelations.add(english.relationId);
  }
}

assert.deepEqual(new Set(["EASY", "MEDIUM", "HARD"]), seenDifficulties);
assert.equal(seenRules.size, 9);
assert.equal(seenSemanticRelations.size, 9);
assert.equal(seenMissingSemanticRelations.size, ANA_CP010_MISSING_TERM_SAFE_RELATION_IDS.length);
assert.equal(seenEquivalentSemanticRelations.size, ANA_CP010_SEMANTIC_RELATIONS.length);
const minPosition = Math.min(...answerPositions);
const maxPosition = Math.max(...answerPositions);
assert.ok(maxPosition / minPosition < 1.25, `ANA-CP-010 numeric/set answer positions imbalanced: ${answerPositions.join(", ")}`);
const semanticMin = Math.min(...semanticAnswerPositions);
const semanticMax = Math.max(...semanticAnswerPositions);
assert.ok(semanticMax / semanticMin < 1.25, `ANA-CP-010 semantic answer positions imbalanced: ${semanticAnswerPositions.join(", ")}`);

console.log("ANA-CP-010 source-gap proof passed.", {
  qlCount: ANA_CP010_QLS.length,
  numericAndSetRules: [...seenRules],
  semanticRelations: [...seenSemanticRelations],
  missingTermSemanticRelations: [...seenMissingSemanticRelations],
  equivalentPairSemanticRelations: [...seenEquivalentSemanticRelations],
  difficulties: [...seenDifficulties],
  answerPositions,
  semanticAnswerPositions,
});
