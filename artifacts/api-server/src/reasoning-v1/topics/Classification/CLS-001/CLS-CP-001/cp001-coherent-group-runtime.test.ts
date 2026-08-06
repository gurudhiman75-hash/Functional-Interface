import assert from "node:assert/strict";
import {
  generateClsCp001CoherentGroupPrototype,
  independentlyVerifyClsCp001CoherentGroupQuestion,
} from "./cp001-coherent-group-runtime";
import { ENTITY_BY_LABEL } from "./semantic-dataset.en";

const fingerprints = new Set<string>();
const positions = [0, 0, 0, 0, 0];
const classes = new Set<string>();
const difficulties = new Set<string>();
let generatedCount = 0;

for (const optionCount of [4, 5] as const) {
  for (let seed = 0; seed < 250; seed += 1) {
    const question = generateClsCp001CoherentGroupPrototype(seed, optionCount);
    const replay = generateClsCp001CoherentGroupPrototype(seed, optionCount);
    assert.deepEqual(question, replay, `${optionCount}/${seed} is not deterministic`);

    assert.equal(question.prototypeId, "CLS-CP001-PROT-008");
    assert.equal(question.task, "SELECT_COHERENT_GROUP");
    assert.equal(question.generationProfile, "COHERENT_GROUP");
    assert.equal(question.options.length, optionCount);
    assert.equal(question.optionGroups.length, optionCount);
    assert.equal(question.difficultyFeatures.optionCount, optionCount);
    assert.equal(new Set(question.options).size, optionCount);
    assert.ok(question.optionGroups.every((group) => group.length === 3 && new Set(group).size === 3));
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(question.evidenceByOption.length, optionCount);
    assert.equal(question.explanation.optionChecks.length, optionCount);
    assert.equal(question.ambiguityAudit.result, "UNIQUE");
    assert.equal(question.ambiguityAudit.winningClassId, question.intendedClassId);
    assert.equal(question.ambiguityAudit.winningOutlierIndex, question.correctIndex);
    assert.equal(question.lifecycle.permanentQlId, null);
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);

    const independent = independentlyVerifyClsCp001CoherentGroupQuestion(question);
    assert.equal(independent.correctIndex, question.correctIndex);
    assert.equal(independent.classId, question.intendedClassId);
    assert.equal(independent.audit.result, "UNIQUE");

    const allDisplayedLabels = question.optionGroups.flat();
    assert.equal(new Set(allDisplayedLabels).size, allDisplayedLabels.length, "An entity repeated across grouped options");
    assert.ok(allDisplayedLabels.every((label) => ENTITY_BY_LABEL.has(label.toLocaleLowerCase("en-IN"))));

    const correctGroup = question.optionGroups[question.correctIndex]!;
    const correctEntities = correctGroup.map((label) => ENTITY_BY_LABEL.get(label.toLocaleLowerCase("en-IN"))!);
    assert.ok(correctEntities.every((entity) => entity.classIds.includes(question.intendedClassId)));

    const coreText = question.explanation.coreRule.join(" ");
    assert.ok(coreText.includes(question.answer));
    assert.ok(correctGroup.every((label) => coreText.includes(label)));
    assert.match(coreText, /only internally consistent group/i);

    const fingerprint = JSON.stringify({ optionCount, stem: question.stem, options: question.options });
    assert.ok(!fingerprints.has(fingerprint), `${optionCount}/${seed} collided`);
    fingerprints.add(fingerprint);
    positions[question.correctIndex] += 1;
    classes.add(question.intendedClassId);
    difficulties.add(question.difficulty);
    generatedCount += 1;
  }
}

assert.equal(generatedCount, 500);
assert.equal(fingerprints.size, 500);
assert.deepEqual(positions.map((count) => count > 0), [true, true, true, true, true]);
assert.ok(classes.size >= 12, `Coherent-group class coverage is too narrow: ${classes.size}`);
assert.ok(difficulties.size >= 2);
assert.throws(() => generateClsCp001CoherentGroupPrototype(-1));
assert.throws(() => generateClsCp001CoherentGroupPrototype(0, 3 as never));

console.log("CLS-CP-001 coherent semantic group audit passed.", {
  generatedCount,
  positions,
  classes: classes.size,
  difficulties: [...difficulties].sort(),
});
