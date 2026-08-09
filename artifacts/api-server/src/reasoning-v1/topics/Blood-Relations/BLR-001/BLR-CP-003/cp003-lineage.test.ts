import assert from "node:assert/strict";

import {
  generateBlrCp003LineageGroup,
  generateBlrCp003LineagePrototypeGroup,
} from "./cp003-lineage-generator";
import { BLR_CP003_LINEAGE_SCENARIOS } from "./cp003-lineage-scenarios";
import {
  blrCp003LineageSemanticKey,
  solveBlrCp003LineageFromClues,
} from "./cp003-lineage-solver";

const answerPositions = [0, 0, 0, 0];
const prototypes = new Set<string>();
const topologies = new Set<string>();
const exactOutputs = new Set<string>();
const relationOutputs = new Set<string>();
const generationOutputs = new Set<string>();
const fingerprintsByScenario = new Map<string, Set<string>>();
let groups = 0;
let questions = 0;
let exactLineageReuseItems = 0;

assert.equal(BLR_CP003_LINEAGE_SCENARIOS.length, 2);

for (const scenario of BLR_CP003_LINEAGE_SCENARIOS) {
  for (let seed = 0; seed < 100; seed += 1) {
    const group = generateBlrCp003LineageGroup(scenario.scenarioId, seed);
    const reproduced = generateBlrCp003LineageGroup(scenario.scenarioId, seed);
    assert.deepEqual(reproduced, group, `${scenario.scenarioId}/${seed} is not deterministic.`);

    assert.equal(group.packageId, "BLR-001");
    assert.equal(group.checkpointId, "BLR-CP-003");
    assert.deepEqual(group.permanentQlIds, []);
    assert.equal(group.prototypeOnly, true);
    assert.equal(group.publiclyPublishable, false);
    assert.equal(group.questionStudioVisible, false);
    assert.equal(group.questionBankEligible, false);
    assert.equal(group.mockTestEligible, false);
    assert.equal(group.locale, "en-IN");
    assert.equal(group.scenarioId, scenario.scenarioId);
    assert.equal(group.topologyId, scenario.topologyId);
    assert.equal(group.questions.length, 6);
    assert.equal(group.metadata.hiddenGraphAgreedWithClueGraph, true);
    assert.equal(group.metadata.everyClueContributes, true);
    assert.equal(group.metadata.exactLineageSolverReused, true);
    assert.equal(group.metadata.clueCount, scenario.clues.length);
    assert.equal(group.metadata.itemCount, 6);
    assert.equal(
      group.metadata.maxGenerationSpan,
      scenario.topologyId === "FOUR_GENERATION_DIRECT_LINE" ? 3 : 2,
    );
    assert.equal(
      group.generationRows.length,
      scenario.topologyId === "FOUR_GENERATION_DIRECT_LINE" ? 4 : 3,
    );
    assert.ok(group.generationRows.every((row) => row.startsWith("Generation ")));
    assert.ok(group.sharedPrompt.startsWith("Read the following family information carefully"));
    assert.ok(!group.sharedPrompt.includes("undefined"));

    const independentlySolved = solveBlrCp003LineageFromClues(
      scenario,
      group.personNames,
    );
    assert.deepEqual(independentlySolved.graph, group.reconstructedFamily);
    assert.equal(independentlySolved.answers.length, group.questions.length);

    for (let index = 0; index < group.questions.length; index += 1) {
      const item = group.questions[index]!;
      const answer = independentlySolved.answers[index]!;
      assert.equal(blrCp003LineageSemanticKey(item.answer), blrCp003LineageSemanticKey(answer));
      assert.equal(item.permanentQlId, null);
      assert.equal(item.prototypeOnly, true);
      assert.equal(item.metadata.hiddenGraphAnswerAgreed, true);
      assert.equal(item.metadata.uniqueAnswer, true);
      assert.equal(item.metadata.optionSemanticsUnique, true);
      assert.equal(item.options.length, 4);
      assert.equal(new Set(item.options.map((option) => option.semanticKey)).size, 4);
      assert.equal(item.options.filter((option) => option.isCorrect).length, 1);
      assert.equal(item.options[item.correctIndex]?.isCorrect, true);
      assert.equal(
        item.options[item.correctIndex]?.semanticKey,
        blrCp003LineageSemanticKey(item.answer),
      );
      assert.ok(item.stem.endsWith("?"));
      assert.ok(!item.stem.includes("undefined"));
      assert.equal(item.explanation.normalizedClues.length, scenario.clues.length);
      assert.deepEqual(item.explanation.generationRows, group.generationRows);
      assert.ok(item.explanation.pathTrace.length >= 1);
      assert.ok(item.explanation.conclusion.length >= 10);
      assert.ok(item.explanation.closestTrapRejection.length >= 10);

      if (item.metadata.exactLineageSolverReused) exactLineageReuseItems += 1;
      if (item.answer.kind === "EXACT_LINEAGE") exactOutputs.add(item.answer.relationId);
      if (item.answer.kind === "RELATION") relationOutputs.add(item.answer.relationId);
      if (item.answer.kind === "CLAIM") relationOutputs.add(item.answer.relationId);
      if (item.answer.kind === "GENERATION_DISTANCE") {
        generationOutputs.add(item.answer.relationId);
      }
      answerPositions[item.correctIndex] += 1;
      prototypes.add(item.prototypeId);
      questions += 1;
    }

    const fingerprints = fingerprintsByScenario.get(scenario.scenarioId) ?? new Set<string>();
    fingerprints.add(group.metadata.semanticFingerprint);
    fingerprintsByScenario.set(scenario.scenarioId, fingerprints);
    topologies.add(group.topologyId);
    groups += 1;
  }
}

assert.deepEqual(answerPositions, [300, 300, 300, 300]);
assert.equal(groups, 200);
assert.equal(questions, 1200);
assert.equal(exactLineageReuseItems, 600);
assert.deepEqual(
  [...topologies].sort(),
  ["DUAL_MATERNAL_PATERNAL_BRANCH", "FOUR_GENERATION_DIRECT_LINE"],
);
assert.deepEqual(
  [...prototypes].sort(),
  [
    "BLR-CP003-PROT-SHARED-EXACT-LINEAGE",
    "BLR-CP003-PROT-SHARED-GREAT-RELATION",
    "BLR-CP003-PROT-SHARED-IDENTIFY-BY-EXACT-LINEAGE",
    "BLR-CP003-PROT-SHARED-IDENTIFY-BY-RELATION",
    "BLR-CP003-PROT-SHARED-THREE-GENERATION-COMPARE",
    "BLR-CP003-PROT-SHARED-TRUE-CLAIM",
  ],
);
assert.deepEqual(
  [...exactOutputs].sort(),
  [
    "MATERNAL_GRANDFATHER",
    "MATERNAL_GRANDMOTHER",
    "PATERNAL_GRANDFATHER",
    "PATERNAL_GRANDMOTHER",
  ],
);
assert.deepEqual(
  [...relationOutputs].sort(),
  ["GREAT_GRANDDAUGHTER", "GREAT_GRANDFATHER", "MOTHER"],
);
assert.deepEqual(
  [...generationOutputs].sort(),
  ["THREE_GENERATIONS_ABOVE", "THREE_GENERATIONS_BELOW"],
);
for (const scenario of BLR_CP003_LINEAGE_SCENARIOS) {
  assert.equal(fingerprintsByScenario.get(scenario.scenarioId)?.size, 1);
}

for (let seed = 0; seed < 20; seed += 1) {
  const group = generateBlrCp003LineagePrototypeGroup(seed);
  assert.equal(
    group.scenarioId,
    BLR_CP003_LINEAGE_SCENARIOS[seed % BLR_CP003_LINEAGE_SCENARIOS.length]!.scenarioId,
  );
}

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-003",
      gate: "SHARED_LINEAGE_SATURATION_V1",
      scenarios: BLR_CP003_LINEAGE_SCENARIOS.length,
      groups,
      questions,
      answerPositions,
      hiddenGraphAgreementChecks: groups,
      clueContributionChecks: groups,
      exactLineageReuseItems,
      topologies: [...topologies].sort(),
      prototypes: [...prototypes].sort(),
      exactOutputs: [...exactOutputs].sort(),
      relationOutputs: [...relationOutputs].sort(),
      generationOutputs: [...generationOutputs].sort(),
      permanentQlCount: 0,
      publicDeliveryEnabled: false,
    },
    null,
    2,
  ),
);
