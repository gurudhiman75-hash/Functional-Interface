import assert from "node:assert/strict";

import { BLR_CP002_THREE_ANCHOR_SCENARIOS } from "./cp002-three-anchor-scenarios";
import { generateBlrCp002ScenarioReviewQuestion } from "./cp002-review-registry";
import { solveBlrCp002Prompt } from "./cp002-role-solver";

const SEEDS_PER_SCENARIO = 64;
const answerPositions = [0, 0, 0, 0];
const answers = new Set<string>();
const presentations = new Set<string>();
const queryTopologies = new Set<string>();
let onlyRecords = 0;
let samePersonAssertions = 0;

assert.equal(BLR_CP002_THREE_ANCHOR_SCENARIOS.length, 4);

for (const scenario of BLR_CP002_THREE_ANCHOR_SCENARIOS) {
  for (let seed = 0; seed < SEEDS_PER_SCENARIO; seed += 1) {
    const question = generateBlrCp002ScenarioReviewQuestion(scenario.scenarioId, seed);
    const reproduced = generateBlrCp002ScenarioReviewQuestion(scenario.scenarioId, seed);
    assert.deepEqual(reproduced, question, `${scenario.scenarioId}/${seed} is not deterministic.`);

    assert.equal(question.prototypeId, "BLR-CP002-PROT-THREE-ANCHOR-INTRODUCTION");
    assert.equal(question.metadata.scenarioId, scenario.scenarioId);
    assert.equal(question.metadata.answerId, scenario.expectedAnswerId);
    assert.equal(question.options[question.correctIndex]?.answerId, scenario.expectedAnswerId);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(new Set(question.options.map((option) => option.answerId)).size, 4);

    const { speakerId, listenerId, pointedPersonId, personNames } = question.structuredPrompt;
    assert.ok(listenerId);
    assert.ok(pointedPersonId);
    assert.notEqual(speakerId, listenerId);
    assert.notEqual(speakerId, pointedPersonId);
    assert.notEqual(listenerId, pointedPersonId);
    const listenerName = personNames[listenerId] ?? listenerId;
    const pointedName = personNames[pointedPersonId] ?? pointedPersonId;
    assert.ok(question.stem.includes(listenerName));
    assert.ok(
      question.stem.includes(pointedName) ||
        question.stem.includes("the person in the photograph") ||
        question.stem.includes("the indicated person"),
    );
    assert.ok(
      question.stem.includes(`to ${listenerName}`) ||
        question.stem.includes(`said to ${listenerName}`),
    );
    assert.ok(
      question.explanation.coreConcept?.some((line) => line === `your = ${listenerName}`),
    );
    assert.ok(
      question.explanation.coreConcept?.some((line) => line.startsWith("my = ")),
    );
    assert.ok(
      question.explanation.coreConcept?.some((line) => line.startsWith("indicated person = ")),
    );
    assert.ok(question.explanation.familyTreeGrid?.includes("Connections:"));
    assert.ok(question.explanation.generationAnalysis?.some((line) => line.includes("ΔGen")));
    assert.equal(question.explanation.distractorAnalysis?.length, 3);
    assert.ok(!question.stem.includes("undefined"));
    assert.ok(question.stem.endsWith("?"));

    const solved = solveBlrCp002Prompt(question.structuredPrompt);
    assert.equal(solved.answerId, scenario.expectedAnswerId);
    assert.equal(solved.assertionVerified, true);

    if (question.metadata.onlyConstraintCount > 0) onlyRecords += 1;
    if (question.structuredPrompt.assertion.relation.kind === "SAME_PERSON") {
      samePersonAssertions += 1;
    }
    const querySubject = question.structuredPrompt.query.subject;
    const queryReference = question.structuredPrompt.query.reference;
    queryTopologies.add(
      `${querySubject.kind === "ANCHOR" ? querySubject.anchor : querySubject.anchor}:${queryReference.kind === "ANCHOR" ? queryReference.anchor : queryReference.anchor}`,
    );

    assert.equal(question.permanentQlId, null);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.questionBankEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);

    answerPositions[question.correctIndex] += 1;
    answers.add(question.metadata.answerId);
    presentations.add(question.metadata.presentation);
  }
}

assert.deepEqual(answerPositions, [64, 64, 64, 64]);
assert.deepEqual(
  [...answers].sort(),
  ["BROTHER_IN_LAW", "FATHER", "SISTER_IN_LAW", "SON"],
);
assert.deepEqual(
  [...presentations].sort(),
  ["INTRODUCTION", "PHOTOGRAPH", "POINTING"],
);
assert.deepEqual(
  [...queryTopologies].sort(),
  [
    "LISTENER:POINTED_PERSON",
    "POINTED_PERSON:LISTENER",
    "POINTED_PERSON:SPEAKER",
  ],
);
assert.equal(onlyRecords, BLR_CP002_THREE_ANCHOR_SCENARIOS.length * SEEDS_PER_SCENARIO);
assert.equal(samePersonAssertions, BLR_CP002_THREE_ANCHOR_SCENARIOS.length * SEEDS_PER_SCENARIO);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-002",
      gate: "THREE_ANCHOR_INTRODUCTION_V1",
      scenarios: BLR_CP002_THREE_ANCHOR_SCENARIOS.length,
      questions: BLR_CP002_THREE_ANCHOR_SCENARIOS.length * SEEDS_PER_SCENARIO,
      answerPositions,
      answers: [...answers].sort(),
      presentations: [...presentations].sort(),
      queryTopologies: [...queryTopologies].sort(),
      onlyRecords,
      samePersonAssertions,
      permanentQlCount: 0,
      provisionalAuthorityCount: 1,
    },
    null,
    2,
  ),
);
