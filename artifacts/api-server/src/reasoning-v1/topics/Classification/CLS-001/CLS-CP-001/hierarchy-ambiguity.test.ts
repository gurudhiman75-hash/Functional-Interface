import assert from "node:assert/strict";
import { CLASS_BY_ID, ENTITY_BY_LABEL } from "./semantic-dataset.en";
import {
  auditClsCp001DisplayedOptions,
  generateClsCp001Prototype,
  independentlyVerifyClsCp001Question,
} from "./runtime";

const hierarchyAudit = auditClsCp001DisplayedOptions(
  ["Orange", "Lemon", "Lime", "Carrot"],
  ["CLS_FOOD_ITEMS", "CLS_FRUITS", "CLS_CITRUS_FRUITS", "CLS_VEGETABLES"],
);
assert.equal(hierarchyAudit.result, "UNIQUE");
assert.equal(hierarchyAudit.winningClassId, "CLS_CITRUS_FRUITS");
assert.equal(hierarchyAudit.winningOutlierIndex, 3);
assert.ok(hierarchyAudit.competingClassIds.includes("CLS_CITRUS_FRUITS"));
const broadFoodSupport = hierarchyAudit.supports.find((support) => support.classId === "CLS_FOOD_ITEMS");
const fruitSupport = hierarchyAudit.supports.find((support) => support.classId === "CLS_FRUITS");
const citrusSupport = hierarchyAudit.supports.find((support) => support.classId === "CLS_CITRUS_FRUITS");
assert.equal(broadFoodSupport?.supportCount, 4);
assert.equal(fruitSupport?.supportCount, 3);
assert.equal(citrusSupport?.supportCount, 3);
assert.ok((citrusSupport?.qualityRank ?? 0) > (fruitSupport?.qualityRank ?? 0));
assert.ok((citrusSupport?.hierarchyDepth ?? 0) > (fruitSupport?.hierarchyDepth ?? 0));

const ambiguousCrossCutting = auditClsCp001DisplayedOptions(
  ["Whale", "Dolphin", "Duck", "Bat"],
  ["CLS_ANIMALS", "CLS_MAMMALS", "CLS_BIRDS", "CLS_AQUATIC_ANIMALS", "CLS_FLYING_ANIMALS"],
);
assert.equal(ambiguousCrossCutting.result, "AMBIGUOUS");
assert.equal(ambiguousCrossCutting.winningClassId, null);
assert.equal(ambiguousCrossCutting.winningOutlierIndex, null);
assert.deepEqual(ambiguousCrossCutting.competingClassIds, ["CLS_AQUATIC_ANIMALS", "CLS_MAMMALS"]);
const mammalSupport = ambiguousCrossCutting.supports.find((support) => support.classId === "CLS_MAMMALS");
const aquaticSupport = ambiguousCrossCutting.supports.find((support) => support.classId === "CLS_AQUATIC_ANIMALS");
assert.equal(mammalSupport?.outlierIndex, 2);
assert.equal(aquaticSupport?.outlierIndex, 3);
assert.equal(mammalSupport?.qualityRank, aquaticSupport?.qualityRank);

const noValidOutlier = auditClsCp001DisplayedOptions(
  ["Apple", "Carrot", "Wheat", "Cumin"],
  ["CLS_FOOD_ITEMS", "CLS_FRUITS", "CLS_VEGETABLES", "CLS_CEREALS", "CLS_SPICES"],
);
assert.equal(noValidOutlier.result, "NO_VALID_RULE");
assert.equal(noValidOutlier.winningClassId, null);
assert.equal(noValidOutlier.winningOutlierIndex, null);
assert.equal(noValidOutlier.supports.find((support) => support.classId === "CLS_FOOD_ITEMS")?.supportCount, 4);

assert.throws(() => auditClsCp001DisplayedOptions(
  ["Orange", "Orange", "Lime", "Carrot"],
  ["CLS_CITRUS_FRUITS"],
));
assert.throws(() => auditClsCp001DisplayedOptions(
  ["Orange", "Lemon", "Lime", "Unknown entity"],
  ["CLS_CITRUS_FRUITS"],
));

const citrusClass = CLASS_BY_ID.get("CLS_CITRUS_FRUITS");
const fruitClass = CLASS_BY_ID.get("CLS_FRUITS");
const foodClass = CLASS_BY_ID.get("CLS_FOOD_ITEMS");
assert.ok(citrusClass && fruitClass && foodClass);
assert.deepEqual(citrusClass!.parentClassIds, ["CLS_FRUITS"]);
assert.ok(citrusClass!.qualityRank > fruitClass!.qualityRank);
assert.ok(fruitClass!.qualityRank > foodClass!.qualityRank);
assert.ok(citrusClass!.memberEntityIds.every((entityId) => fruitClass!.memberEntityIds.includes(entityId)));
assert.ok(fruitClass!.memberEntityIds.every((entityId) => foodClass!.memberEntityIds.includes(entityId)));

for (const label of ["Whale", "Dolphin", "Duck", "Bat", "Orange", "Mango"]) {
  const entity = ENTITY_BY_LABEL.get(label.toLocaleLowerCase("en-IN"));
  assert.ok(entity, `Missing multi-membership fixture ${label}`);
  assert.ok(entity!.classIds.length >= 2, `${label} must have inherited or cross-cutting membership`);
}

for (let seed = 0; seed < 300; seed += 1) {
  const hierarchyQuestion = generateClsCp001Prototype("CLS-CP001-PROT-005", seed);
  assert.equal(hierarchyQuestion.ambiguityAudit.result, "UNIQUE");
  assert.equal(hierarchyQuestion.ambiguityAudit.winningClassId, hierarchyQuestion.intendedClassId);
  assert.equal(independentlyVerifyClsCp001Question(hierarchyQuestion).correctIndex, hierarchyQuestion.correctIndex);

  const crossCuttingQuestion = generateClsCp001Prototype("CLS-CP001-PROT-006", seed);
  assert.equal(crossCuttingQuestion.ambiguityAudit.result, "UNIQUE");
  assert.equal(crossCuttingQuestion.ambiguityAudit.winningClassId, crossCuttingQuestion.intendedClassId);
  assert.equal(independentlyVerifyClsCp001Question(crossCuttingQuestion).correctIndex, crossCuttingQuestion.correctIndex);

  const hierarchyMemberQuestion = generateClsCp001Prototype("CLS-CP001-PROT-007", seed);
  assert.equal(hierarchyMemberQuestion.ambiguityAudit.result, "UNIQUE");
  assert.equal(hierarchyMemberQuestion.ambiguityAudit.winningClassId, hierarchyMemberQuestion.intendedClassId);
  assert.equal(independentlyVerifyClsCp001Question(hierarchyMemberQuestion).correctIndex, hierarchyMemberQuestion.correctIndex);
  const intendedClass = CLASS_BY_ID.get(hierarchyMemberQuestion.intendedClassId)!;
  assert.ok(intendedClass.hierarchyDepth >= 1);
  assert.ok(hierarchyMemberQuestion.givens.every((label) =>
    ENTITY_BY_LABEL.get(label.toLocaleLowerCase("en-IN"))!.classIds.includes(intendedClass.classId),
  ));
}

console.log("CLS-CP-001 hierarchy and ambiguity adversarial audit passed.", {
  hierarchyWinner: hierarchyAudit.winningClassId,
  rejectedCompetingClasses: ambiguousCrossCutting.competingClassIds,
  noValidRuleFixture: noValidOutlier.result,
  generatedChallengeQuestions: 900,
});
