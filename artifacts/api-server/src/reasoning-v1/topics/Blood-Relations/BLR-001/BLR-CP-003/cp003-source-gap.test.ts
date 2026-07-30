import assert from "node:assert/strict";

import { generateBlrCp003SourceGapGroup } from "./cp003-source-gap-generator";
import { BLR_CP003_SOURCE_GAP_SCENARIO } from "./cp003-source-gap-scenario";
import {
  blrCp003SourceGapSemanticKey,
  solveBlrCp003SourceGapFromClues,
} from "./cp003-source-gap-solver";

const answerPositions = [0, 0, 0, 0];
const prototypes = new Set<string>();
const relationOutputs = new Set<string>();
const fingerprints = new Set<string>();
let groups = 0;
let questions = 0;
let personByGenderItems = 0;

for (let seed = 0; seed < 100; seed += 1) {
  const group = generateBlrCp003SourceGapGroup(seed);
  const reproduced = generateBlrCp003SourceGapGroup(seed);
  assert.deepEqual(
    reproduced,
    group,
    `CP-003 compact joint-parent group ${seed} is not deterministic.`,
  );

  assert.equal(group.packageId, "BLR-001");
  assert.equal(group.checkpointId, "BLR-CP-003");
  assert.deepEqual(group.permanentQlIds, []);
  assert.equal(group.prototypeOnly, true);
  assert.equal(group.publiclyPublishable, false);
  assert.equal(group.questionStudioVisible, false);
  assert.equal(group.questionBankEligible, false);
  assert.equal(group.mockTestEligible, false);
  assert.equal(group.locale, "en-IN");
  assert.equal(
    group.scenarioId,
    "BLR-CP003-SCN-COMPACT-JOINT-PARENT-PASSAGE",
  );
  assert.equal(group.topologyId, "COMPACT_JOINT_PARENT_PASSAGE");
  assert.equal(group.questions.length, 8);
  assert.equal(group.metadata.hiddenGraphAgreedWithClueGraph, true);
  assert.equal(group.metadata.everyClueContributes, true);
  assert.equal(group.metadata.compactJointParentRenderer, true);
  assert.equal(group.metadata.coParenthoodExplicitlyModelled, true);
  assert.equal(group.metadata.clueCount, 8);
  assert.equal(group.metadata.itemCount, 8);

  assert.ok(group.sharedPrompt.includes("are a married couple"));
  assert.ok(group.sharedPrompt.includes("is their son"));
  assert.ok(group.sharedPrompt.includes("is their daughter"));
  assert.ok(group.sharedPrompt.includes("is the son of"));
  assert.ok(group.sharedPrompt.includes(" and "));
  assert.ok(!group.sharedPrompt.includes("undefined"));
  assert.ok(!group.sharedPrompt.includes("the husband of the mother"));

  const independentlySolved = solveBlrCp003SourceGapFromClues(
    BLR_CP003_SOURCE_GAP_SCENARIO,
    group.personNames,
  );
  assert.deepEqual(independentlySolved.graph, group.reconstructedFamily);
  assert.equal(independentlySolved.answers.length, group.questions.length);

  for (let index = 0; index < group.questions.length; index += 1) {
    const item = group.questions[index]!;
    const answer = independentlySolved.answers[index]!;
    assert.equal(
      blrCp003SourceGapSemanticKey(item.answer),
      blrCp003SourceGapSemanticKey(answer),
    );
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
      blrCp003SourceGapSemanticKey(item.answer),
    );
    assert.ok(item.stem.endsWith("?"));
    assert.ok(!item.stem.includes("undefined"));
    assert.equal(item.explanation.normalizedClues.length, 8);
    assert.ok(item.explanation.decisiveTrace.length >= 1);
    assert.ok(item.explanation.conclusion.endsWith("."));
    assert.ok(item.explanation.closestTrapRejection.endsWith("."));

    if (
      item.prototypeId ===
      "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON-BY-GENDER"
    ) {
      personByGenderItems += 1;
      assert.equal(item.answer.kind, "PERSON");
      assert.ok(item.stem.includes("male member of the family"));
      assert.equal(item.options[item.correctIndex]?.text, group.personNames.C);
    }
    if (item.answer.kind === "RELATION") {
      relationOutputs.add(item.answer.relationId);
    }

    answerPositions[item.correctIndex] += 1;
    prototypes.add(item.prototypeId);
    questions += 1;
  }

  fingerprints.add(group.metadata.semanticFingerprint);
  groups += 1;
}

assert.deepEqual(answerPositions, [200, 200, 200, 200]);
assert.equal(groups, 100);
assert.equal(questions, 800);
assert.equal(personByGenderItems, 100);
assert.equal(fingerprints.size, 1);
assert.deepEqual(
  [...prototypes].sort(),
  [
    "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON-BY-GENDER",
    "BLR-CP003-PROT-SHARED-MARRIED-PAIR",
    "BLR-CP003-PROT-SHARED-RELATION",
  ],
);
assert.deepEqual(
  [...relationOutputs].sort(),
  [
    "DAUGHTER_IN_LAW",
    "FATHER",
    "GRANDFATHER",
    "GRANDMOTHER",
    "MOTHER",
  ],
);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-003",
      gate: "SECOND_SOURCE_GAP_COMPACT_JOINT_PARENT_V1",
      scenarios: 1,
      groups,
      questions,
      answerPositions,
      graphAgreementChecks: groups,
      clueContributionChecks: groups,
      personByGenderItems,
      prototypes: [...prototypes].sort(),
      relationOutputs: [...relationOutputs].sort(),
      compactJointParentRenderer: true,
      coParenthoodExplicitlyModelled: true,
      permanentQlCount: 0,
      publicDeliveryEnabled: false,
    },
    null,
    2,
  ),
);
