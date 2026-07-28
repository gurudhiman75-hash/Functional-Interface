import assert from "node:assert/strict";

import { generateBlrCp003PrototypeGroup, generateBlrCp003ScenarioGroup } from "./cp003-generator";
import { BLR_CP003_SCENARIOS } from "./cp003-scenario-library";
import {
  blrCp003SemanticKey,
  proveBlrCp003HiddenGraphAgreesWithClues,
  solveBlrCp003ScenarioFromClues,
  solveBlrCp003ScenarioFromHiddenGraph,
} from "./cp003-solver";

const answerPositions = [0, 0, 0, 0];
const prototypes = new Set<string>();
const topologies = new Set<string>();
const relationOutputs = new Set<string>();
const fingerprintsByScenario = new Map<string, Set<string>>();
let groups = 0;
let questions = 0;
let hiddenGraphAgreementChecks = 0;

assert.equal(BLR_CP003_SCENARIOS.length, 3);
assert.equal(
  new Set(BLR_CP003_SCENARIOS.map((scenario) => scenario.scenarioId)).size,
  BLR_CP003_SCENARIOS.length,
);

for (const scenario of BLR_CP003_SCENARIOS) {
  for (let seed = 0; seed < 80; seed += 1) {
    const group = generateBlrCp003ScenarioGroup(scenario.scenarioId, seed);
    const reproduced = generateBlrCp003ScenarioGroup(scenario.scenarioId, seed);
    assert.deepEqual(reproduced, group, `${scenario.scenarioId}/${seed} is not deterministic.`);

    assert.equal(group.packageId, "BLR-001");
    assert.equal(group.checkpointId, "BLR-CP-003");
    assert.equal(group.groupPrototypeId, "BLR-CP003-PROT-MULTI-ITEM-GROUP");
    assert.deepEqual(group.permanentQlIds, []);
    assert.equal(group.prototypeOnly, true);
    assert.equal(group.publiclyPublishable, false);
    assert.equal(group.questionStudioVisible, false);
    assert.equal(group.questionBankEligible, false);
    assert.equal(group.mockTestEligible, false);
    assert.equal(group.locale, "en-IN");
    assert.equal(group.scenarioId, scenario.scenarioId);
    assert.equal(group.topologyId, scenario.topologyId);
    assert.equal(group.structuredClues.length, scenario.clues.length);
    assert.equal(group.questions.length, scenario.questions.length);
    assert.equal(group.metadata.familyGraphValid, true);
    assert.equal(group.metadata.sharedPromptSolvedOnce, true);
    assert.equal(group.metadata.allItemsIndependentlySolved, true);
    assert.equal(group.metadata.everyClueContributes, true);
    assert.equal(group.metadata.clueCount, scenario.clues.length);
    assert.equal(group.metadata.itemCount, scenario.questions.length);
    assert.ok(group.sharedPrompt.startsWith("Read the following information carefully"));
    assert.ok(!group.sharedPrompt.includes("undefined"));

    assert.equal(proveBlrCp003HiddenGraphAgreesWithClues(scenario, group.personNames), true);
    const hiddenSolved = solveBlrCp003ScenarioFromHiddenGraph(
      scenario,
      group.personNames,
    );
    const clueSolved = solveBlrCp003ScenarioFromClues(
      scenario,
      group.personNames,
    );
    assert.deepEqual(clueSolved.graph, group.reconstructedFamily);
    assert.equal(hiddenSolved.answers.length, group.questions.length);
    assert.equal(clueSolved.answers.length, group.questions.length);
    hiddenGraphAgreementChecks += 1;

    for (let index = 0; index < group.questions.length; index += 1) {
      const item = group.questions[index]!;
      const hiddenAnswer = hiddenSolved.answers[index]!;
      const clueAnswer = clueSolved.answers[index]!;
      assert.equal(
        blrCp003SemanticKey(hiddenAnswer),
        blrCp003SemanticKey(clueAnswer),
      );
      assert.equal(
        blrCp003SemanticKey(item.answer),
        blrCp003SemanticKey(clueAnswer),
      );
      assert.equal(item.permanentQlId, null);
      assert.equal(item.prototypeOnly, true);
      assert.equal(item.metadata.independentSolverAgreed, true);
      assert.equal(item.metadata.uniqueAnswer, true);
      assert.equal(item.metadata.optionSemanticsUnique, true);
      assert.equal(item.options.length, 4);
      assert.equal(new Set(item.options.map((option) => option.semanticKey)).size, 4);
      assert.equal(item.options.filter((option) => option.isCorrect).length, 1);
      assert.equal(item.options[item.correctIndex]?.isCorrect, true);
      assert.equal(
        item.options[item.correctIndex]?.semanticKey,
        blrCp003SemanticKey(item.answer),
      );
      assert.ok(item.stem.endsWith("?"));
      assert.ok(!item.stem.includes("undefined"));
      assert.equal(item.explanation.familyPlacements.length, scenario.clues.length);
      assert.ok(item.explanation.queryTrace.length >= 1);
      assert.ok(item.explanation.conclusion.length >= 10);
      assert.ok(item.explanation.closestTrapRejection.length >= 10);

      answerPositions[item.correctIndex] += 1;
      prototypes.add(item.prototypeId);
      if (item.answer.kind === "RELATION") relationOutputs.add(item.answer.relationId);
      if (item.answer.kind === "CLAIM") relationOutputs.add(item.answer.relationId);
      questions += 1;
    }

    const fingerprints = fingerprintsByScenario.get(scenario.scenarioId) ?? new Set<string>();
    fingerprints.add(group.metadata.semanticFingerprint);
    fingerprintsByScenario.set(scenario.scenarioId, fingerprints);
    topologies.add(group.topologyId);
    groups += 1;
  }
}

for (const scenario of BLR_CP003_SCENARIOS) {
  assert.equal(
    fingerprintsByScenario.get(scenario.scenarioId)?.size,
    1,
    `${scenario.scenarioId} fingerprint changed only because of names or seed.`,
  );
}

assert.deepEqual(
  [...prototypes].sort(),
  [
    "BLR-CP003-PROT-SHARED-GENDER",
    "BLR-CP003-PROT-SHARED-GENERATION",
    "BLR-CP003-PROT-SHARED-MARRIED-PAIR",
    "BLR-CP003-PROT-SHARED-RELATION",
    "BLR-CP003-PROT-SHARED-TRUE-CLAIM",
  ],
);
assert.deepEqual(
  [...topologies].sort(),
  [
    "AFFINAL_CHILD_BRANCH",
    "THREE_GENERATION_TWO_BRANCH",
    "TWO_COUPLE_COUSIN_BRANCH",
  ],
);
for (const expected of [
  "AUNT",
  "BROTHER_IN_LAW",
  "COUSIN",
  "FATHER_IN_LAW",
  "GRANDFATHER",
  "SON_IN_LAW",
  "UNCLE",
]) {
  assert.ok(relationOutputs.has(expected), `Initial CP-003 proof is missing ${expected}.`);
}
assert.ok(answerPositions.every((count) => count > 0));
assert.equal(groups, 240);
assert.equal(hiddenGraphAgreementChecks, 240);
assert.equal(questions, 1520);

for (let seed = 0; seed < 30; seed += 1) {
  const group = generateBlrCp003PrototypeGroup(seed);
  const expectedScenario = BLR_CP003_SCENARIOS[seed % BLR_CP003_SCENARIOS.length]!;
  assert.equal(group.scenarioId, expectedScenario.scenarioId);
}

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-003",
      gate: "SHARED_FAMILY_GROUP_PROTOTYPE_V2",
      scenarios: BLR_CP003_SCENARIOS.length,
      groups,
      hiddenGraphAgreementChecks,
      questions,
      answerPositions,
      topologies: [...topologies].sort(),
      prototypes: [...prototypes].sort(),
      relationOutputs: [...relationOutputs].sort(),
      permanentQlCount: 0,
      publicDeliveryEnabled: false,
    },
    null,
    2,
  ),
);
