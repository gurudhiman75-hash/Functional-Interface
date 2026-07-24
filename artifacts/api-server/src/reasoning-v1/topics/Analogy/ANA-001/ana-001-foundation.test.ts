import assert from "node:assert/strict";
import {
  SemanticFactRegistry,
  applyNumericRule,
  applySemanticFact,
  assertUnambiguousNumericPair,
  assertValidOptions,
  letterFromPosition,
  letterPosition,
  oppositeLetter,
  rotateCluster,
  shiftCluster,
  shiftLetter,
} from "./foundation";

assert.equal(letterPosition("A"), 1);
assert.equal(letterFromPosition(27), "A");
assert.equal(shiftLetter("Y", 3), "B");
assert.equal(oppositeLetter("C"), "X");
assert.equal(shiftCluster("MAT", [2, 3, 4]), "ODX");
assert.equal(rotateCluster("ABCD", 1), "BCDA");

const registry = new SemanticFactRegistry([
  {
    id: "SEM-EN-001",
    left: "Lion",
    right: "Cub",
    relation: "ANIMAL_YOUNG",
    direction: "FORWARD",
    predicate: "A young lion is called a cub.",
    explanation: "A young lion is called a cub.",
    answerCategory: "YOUNG_ANIMAL",
    sourceCategory: "ANIMAL",
    difficulty: "EASY",
    locale: "en-IN",
    examSuitability: ["SSC", "BANKING", "PUNJAB"],
    version: "2.0.0",
    status: "CURATED",
    verifiedAt: "2026-07-24",
    sourceType: "STANDARD_LANGUAGE",
    factRisk: "LOW",
  },
]);
const fact = registry.resolve("Lion", "ANIMAL_YOUNG");
assert.ok(fact);
assert.equal(applySemanticFact(fact, "Lion"), "Cub");

const intended = {
  id: "NUM_MULTIPLY_THEN_ADD" as const,
  numberTreatment: "WHOLE_NUMBER" as const,
  parameters: { factor: 3, constant: 2 },
};
assert.equal(applyNumericRule(7, intended), 23);
assertUnambiguousNumericPair(7, 23, intended, [
  { id: "NUM_ADD_CONSTANT", numberTreatment: "WHOLE_NUMBER", parameters: { constant: 4 } },
  { id: "NUM_MULTIPLY_CONSTANT", numberTreatment: "WHOLE_NUMBER", parameters: { factor: 2 } },
]);

const correctIndex = assertValidOptions(
  [
    { value: 21, errorLabel: "OMITTED_FINAL_ADDITION" },
    { value: 23, errorLabel: null },
    { value: 17, errorLabel: "USED_WRONG_FACTOR" },
    { value: 25, errorLabel: "ADDED_WRONG_CONSTANT" },
  ],
  (value) => value === 23,
);
assert.equal(correctIndex, 1);

console.log("ANA-001 foundation tests passed");
