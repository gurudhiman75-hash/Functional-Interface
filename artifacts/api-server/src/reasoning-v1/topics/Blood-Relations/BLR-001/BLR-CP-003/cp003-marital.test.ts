import assert from "node:assert/strict";

import { generateBlrCp003MaritalGroup } from "./cp003-marital-generator";
import { BLR_CP003_MARITAL_SCENARIO } from "./cp003-marital-scenario";
import {
  blrCp003MaritalSemanticKey,
  materializeBlrCp003MaritalHiddenGraph,
  resolveBlrCp003MaritalStatus,
  solveBlrCp003MaritalFromClues,
  validateBlrCp003MaritalFacts,
} from "./cp003-marital-solver";

const answerPositions = [0, 0, 0, 0];
const prototypes = new Set<string>();
const statuses = new Set<string>();
const relationOutputs = new Set<string>();
const fingerprints = new Set<string>();
let groups = 0;
let questions = 0;
let explicitStatusItems = 0;

for (let seed = 0; seed < 120; seed += 1) {
  const group = generateBlrCp003MaritalGroup(seed);
  const reproduced = generateBlrCp003MaritalGroup(seed);
  assert.deepEqual(reproduced, group, `CP-003 marital group ${seed} is not deterministic.`);

  assert.equal(group.packageId, "BLR-001");
  assert.equal(group.checkpointId, "BLR-CP-003");
  assert.deepEqual(group.permanentQlIds, []);
  assert.equal(group.prototypeOnly, true);
  assert.equal(group.publiclyPublishable, false);
  assert.equal(group.questionStudioVisible, false);
  assert.equal(group.questionBankEligible, false);
  assert.equal(group.mockTestEligible, false);
  assert.equal(group.locale, "en-IN");
  assert.equal(group.scenarioId, "BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH");
  assert.equal(group.topologyId, "EXPLICIT_UNMARRIED_BRANCH");
  assert.equal(group.questions.length, 6);
  assert.equal(group.metadata.hiddenGraphAgreedWithClueGraph, true);
  assert.equal(group.metadata.unsupportedStatusInferenceRejected, true);
  assert.equal(group.metadata.contradictoryStatusRejected, true);
  assert.equal(group.metadata.everyClueAndStatusFactContributes, true);
  assert.equal(group.metadata.clueCount, 7);
  assert.equal(group.metadata.maritalFactCount, 1);
  assert.equal(group.metadata.itemCount, 6);
  assert.ok(group.sharedPrompt.includes("is unmarried."));
  assert.ok(!group.sharedPrompt.includes("undefined"));

  const independentlySolved = solveBlrCp003MaritalFromClues(
    BLR_CP003_MARITAL_SCENARIO,
    group.personNames,
  );
  assert.deepEqual(independentlySolved.graph, group.reconstructedFamily);
  assert.equal(independentlySolved.answers.length, group.questions.length);

  for (let index = 0; index < group.questions.length; index += 1) {
    const item = group.questions[index]!;
    const answer = independentlySolved.answers[index]!;
    assert.equal(blrCp003MaritalSemanticKey(item.answer), blrCp003MaritalSemanticKey(answer));
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
      blrCp003MaritalSemanticKey(item.answer),
    );
    assert.ok(item.stem.endsWith("?"));
    assert.ok(!item.stem.includes("undefined"));
    assert.equal(item.explanation.normalizedFacts.length, 8);
    assert.ok(item.explanation.decisiveTrace.length >= 1);
    assert.ok(item.explanation.conclusion.length >= 10);
    assert.ok(item.explanation.closestTrapRejection.length >= 10);

    if (item.metadata.explicitStatusRequired) explicitStatusItems += 1;
    if (item.answer.kind === "MARITAL_STATUS") statuses.add(item.answer.status);
    if (item.answer.kind === "RELATION") relationOutputs.add(item.answer.relationId);
    answerPositions[item.correctIndex] += 1;
    prototypes.add(item.prototypeId);
    questions += 1;
  }

  fingerprints.add(group.metadata.semanticFingerprint);
  groups += 1;
}

assert.deepEqual(answerPositions, [180, 180, 180, 180]);
assert.equal(groups, 120);
assert.equal(questions, 720);
assert.equal(explicitStatusItems, 240);
assert.deepEqual([...statuses].sort(), ["MARRIED", "UNMARRIED"]);
assert.deepEqual([...relationOutputs].sort(), ["COUSIN", "DAUGHTER_IN_LAW"]);
assert.equal(fingerprints.size, 1);
assert.deepEqual(
  [...prototypes].sort(),
  [
    "BLR-CP003-PROT-SHARED-IDENTIFY-BY-MARITAL-STATUS",
    "BLR-CP003-PROT-SHARED-MARITAL-STATUS",
    "BLR-CP003-PROT-SHARED-RELATION",
    "BLR-CP003-PROT-SHARED-SIBLING-PAIR",
  ],
);

const fixedNames = Object.fromEntries(
  BLR_CP003_MARITAL_SCENARIO.hiddenGraph.persons.map((person) => [
    person.personId,
    person.name,
  ]),
);
const hiddenGraph = materializeBlrCp003MaritalHiddenGraph(
  BLR_CP003_MARITAL_SCENARIO,
  fixedNames,
);
assert.throws(
  () => resolveBlrCp003MaritalStatus(hiddenGraph, [], "D"),
  /not entailed/,
  "A missing spouse edge must not prove unmarried status.",
);
assert.equal(
  resolveBlrCp003MaritalStatus(
    hiddenGraph,
    [{ personId: "D", status: "MARRIED", evidence: "EXPLICIT_STATEMENT" }],
    "D",
  ),
  "MARRIED",
  "An explicit married fact can establish status without naming a spouse.",
);
assert.throws(
  () =>
    validateBlrCp003MaritalFacts(hiddenGraph, [
      { personId: "E", status: "UNMARRIED", evidence: "EXPLICIT_STATEMENT" },
      { personId: "E", status: "MARRIED", evidence: "EXPLICIT_STATEMENT" },
    ]),
  /Contradictory marital facts/,
);
assert.throws(
  () =>
    validateBlrCp003MaritalFacts(
      {
        ...hiddenGraph,
        spouseEdges: [
          ...hiddenGraph.spouseEdges,
          { personAId: "E", personBId: "H" },
        ],
      },
      BLR_CP003_MARITAL_SCENARIO.maritalFacts,
    ),
  /contradicts a spouse edge/,
);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-003",
      gate: "EXPLICIT_MARITAL_STATUS_V1",
      scenarios: 1,
      groups,
      questions,
      answerPositions,
      statuses: [...statuses].sort(),
      relationOutputs: [...relationOutputs].sort(),
      prototypes: [...prototypes].sort(),
      explicitStatusItems,
      unsupportedMissingSpouseInferenceRejected: true,
      contradictoryStatusRejected: true,
      graphAgreementChecks: groups,
      inputContributionChecks: groups,
      permanentQlCount: 0,
      publicDeliveryEnabled: false,
    },
    null,
    2,
  ),
);
