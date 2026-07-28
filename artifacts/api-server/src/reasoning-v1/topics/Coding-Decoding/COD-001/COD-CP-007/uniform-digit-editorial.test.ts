import assert from "node:assert/strict";

import { UNIFORM_DIGIT_PROTOTYPE_CONTRACTS } from "./uniform-digit-contracts";
import { generateUniformDigitPrototypeQuestion } from "./uniform-digit-runtime";

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (value === null || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  return Object.keys(value as Record<string, unknown>)
    .sort()
    .flatMap((key) => collectStrings((value as Record<string, unknown>)[key]));
}

function normaliseEditorialSkeleton(value: unknown): string {
  return collectStrings(value)
    .join(" ")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[‘'][0-9?]+[’']/gu, "<quoted-digits>")
    .replace(/\b\d+\b/gu, "<number>")
    .replace(/\s+/gu, " ")
    .trim();
}

const skeletonOwners = new Map<string, Set<string>>();
const skeletonCounts: Record<string, number> = {};
const ruleCounts: Record<string, number> = {};
const quickMethodCounts: Record<string, number> = {};
let generated = 0;
let inverseTeachingPaths = 0;
let explicitTeachingPaths = 0;
let inferTeachingPaths = 0;
let optionTeachingPaths = 0;
let missingTeachingPaths = 0;

for (const contract of UNIFORM_DIGIT_PROTOTYPE_CONTRACTS) {
  const skeletons = new Set<string>();
  const rules = new Set<string>();
  const quickMethods = new Set<string>();

  for (let seed = 1; seed <= 100; seed += 1) {
    const question = generateUniformDigitPrototypeQuestion(contract.prototypeId, seed);
    const explanationText = collectStrings(question.explanation).join(" ");
    const skeleton = normaliseEditorialSkeleton(question.explanation);
    const owners = skeletonOwners.get(skeleton) ?? new Set<string>();
    owners.add(contract.prototypeId);
    skeletonOwners.set(skeleton, owners);
    skeletons.add(skeleton);
    rules.add(question.explanation.ruleStatement);
    quickMethods.add(question.explanation.quickMethod ?? "");

    assert.equal(/\b1 places\b/u.test(question.stem), false, `${contract.prototypeId}/${seed} has singular grammar drift`);
    assert.equal(/\b1 places\b/u.test(explanationText), false, `${contract.prototypeId}/${seed} explanation has singular grammar drift`);
    assert.equal(question.stem.includes("prototype"), false);
    assert.equal(explanationText.includes("prototype"), false);
    assert.equal(explanationText.includes("parameter"), false);
    assert.equal(explanationText.includes("canonical"), false);
    assert.equal(explanationText.includes("solver"), false);
    assert.equal(explanationText.includes("registry"), false);
    assert.ok(question.explanation.referenceAid && question.explanation.referenceAid.length === 2);
    assert.ok(question.explanation.quickMethod && question.explanation.quickMethod.length >= 45);
    assert.ok(question.explanation.sourceDemonstration.length === 2);
    assert.ok(question.explanation.targetApplication.length >= 2);
    assert.ok(question.explanation.commonTrapAlert);
    const selectedTrap = question.options.find((option) => !option.isCorrect)!;
    assert.equal(question.explanation.commonTrapAlert!.includes(selectedTrap.value), true);
    assert.equal(question.explanation.conclusion.includes(question.metadata.correctAnswer), true);

    if (contract.taskKind === "DECODE_TARGET") {
      assert.match(question.explanation.targetApplication.join(" "), /already coded|undo/i);
      inverseTeachingPaths += 1;
    }
    if (contract.taskKind === "ENCODE_TARGET") {
      assert.match(question.explanation.targetApplication.join(" "), /rule is supplied|rule is stated/i);
      explicitTeachingPaths += 1;
    }
    if (contract.taskKind === "INFER_AND_ENCODE") {
      assert.match(question.explanation.targetApplication.join(" "), /confirmed in both examples/i);
      inferTeachingPaths += 1;
    }
    if (contract.taskKind === "CHOOSE_MATCHING_CODE") {
      assert.match(question.explanation.targetApplication.join(" "), /only the option/i);
      optionTeachingPaths += 1;
    }
    if (contract.taskKind === "RECOVER_MISSING_TOKEN") {
      assert.match(question.explanation.targetApplication.join(" "), /complete code|valid completion/i);
      missingTeachingPaths += 1;
    }

    generated += 1;
  }

  skeletonCounts[contract.prototypeId] = skeletons.size;
  ruleCounts[contract.prototypeId] = rules.size;
  quickMethodCounts[contract.prototypeId] = quickMethods.size;
  assert.ok(skeletons.size >= 4, `${contract.prototypeId} has only ${skeletons.size} normalized explanation skeletons`);
  assert.ok(rules.size >= 24, `${contract.prototypeId} has only ${rules.size}/100 exact rule statements`);
  assert.ok(quickMethods.size >= 24, `${contract.prototypeId} has only ${quickMethods.size}/100 exact Quick Methods`);
}

const crossContractCollisions = [...skeletonOwners.entries()]
  .filter(([, owners]) => owners.size > 1)
  .map(([skeleton, owners]) => ({ skeleton, owners: [...owners].sort() }));
assert.deepEqual(crossContractCollisions, [], "Different CP-007 task contracts must not share a full normalized teaching path");
assert.equal(generated, 500);
assert.equal(inverseTeachingPaths, 100);
assert.equal(explicitTeachingPaths, 100);
assert.equal(inferTeachingPaths, 100);
assert.equal(optionTeachingPaths, 100);
assert.equal(missingTeachingPaths, 100);

console.log(JSON.stringify({
  checkpointId: "COD-CP-007",
  family: "UNIFORM_MODULAR_DIGIT_TRANSLATION",
  generated,
  normalizedSkeletonsByPrototype: skeletonCounts,
  exactRuleStatementsByPrototype: ruleCounts,
  exactQuickMethodsByPrototype: quickMethodCounts,
  crossContractNormalizedExplanationCollisions: crossContractCollisions.length,
  verdict: "EDITORIAL DIVERSITY AND TASK-SPECIFIC TEACHING PATHS PASS",
}, null, 2));
