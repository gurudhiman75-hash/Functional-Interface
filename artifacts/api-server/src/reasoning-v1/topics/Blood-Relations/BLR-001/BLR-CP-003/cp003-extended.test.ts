import assert from "node:assert/strict";

import { generateBlrCp003ExtendedGroup } from "./cp003-extended-generator";
import { BLR_CP003_EXTENDED_SCENARIO } from "./cp003-extended-scenario";
import {
  blrCp003ExtendedSemanticKey,
  proveBlrCp003ExtendedHiddenAgreement,
  proveEveryBlrCp003ExtendedClueContributes,
  solveBlrCp003ExtendedFromClues,
  solveBlrCp003ExtendedFromGraph,
  materializeBlrCp003ExtendedHiddenGraph,
} from "./cp003-extended-solver";

const answerPositions = [0, 0, 0, 0];
const prototypes = new Set<string>();
const fingerprints = new Set<string>();
let groups = 0;
let questions = 0;
let hiddenGraphAgreementChecks = 0;
let clueContributionChecks = 0;

for (let seed = 0; seed < 100; seed += 1) {
  const group = generateBlrCp003ExtendedGroup(seed);
  const reproduced = generateBlrCp003ExtendedGroup(seed);
  assert.deepEqual(reproduced, group, `Extended CP-003 seed ${seed} is not deterministic.`);

  assert.equal(group.packageId, "BLR-001");
  assert.equal(group.checkpointId, "BLR-CP-003");
  assert.deepEqual(group.permanentQlIds, []);
  assert.equal(group.prototypeOnly, true);
  assert.equal(group.publiclyPublishable, false);
  assert.equal(group.questionStudioVisible, false);
  assert.equal(group.questionBankEligible, false);
  assert.equal(group.mockTestEligible, false);
  assert.equal(group.locale, "en-IN");
  assert.equal(group.scenarioId, "BLR-CP003-SCN-SIBLING-SET-BRANCH");
  assert.equal(group.topologyId, "SIBLING_SET_BRANCH");
  assert.equal(group.questions.length, 7);
  assert.equal(group.metadata.clueCount, 6);
  assert.equal(group.metadata.itemCount, 7);
  assert.equal(group.metadata.hiddenGraphAgreedWithClueGraph, true);
  assert.equal(group.metadata.everyClueContributes, true);
  assert.ok(group.sharedPrompt.startsWith("Read the following information carefully"));
  assert.ok(!group.sharedPrompt.includes("undefined"));

  assert.equal(
    proveBlrCp003ExtendedHiddenAgreement(
      BLR_CP003_EXTENDED_SCENARIO,
      group.personNames,
    ),
    true,
  );
  hiddenGraphAgreementChecks += 1;
  assert.equal(
    proveEveryBlrCp003ExtendedClueContributes(
      BLR_CP003_EXTENDED_SCENARIO,
      group.personNames,
    ),
    true,
  );
  clueContributionChecks += 1;

  const hiddenAnswers = solveBlrCp003ExtendedFromGraph(
    materializeBlrCp003ExtendedHiddenGraph(
      BLR_CP003_EXTENDED_SCENARIO,
      group.personNames,
    ),
    BLR_CP003_EXTENDED_SCENARIO,
  );
  const clueAnswers = solveBlrCp003ExtendedFromClues(
    BLR_CP003_EXTENDED_SCENARIO,
    group.personNames,
  ).answers;

  assert.equal(hiddenAnswers.length, 7);
  assert.equal(clueAnswers.length, 7);
  for (let index = 0; index < group.questions.length; index += 1) {
    const item = group.questions[index]!;
    assert.equal(
      blrCp003ExtendedSemanticKey(hiddenAnswers[index]!),
      blrCp003ExtendedSemanticKey(clueAnswers[index]!),
    );
    assert.equal(
      blrCp003ExtendedSemanticKey(item.answer),
      blrCp003ExtendedSemanticKey(clueAnswers[index]!),
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
      blrCp003ExtendedSemanticKey(item.answer),
    );
    assert.ok(item.stem.endsWith("?"));
    assert.ok(!item.stem.includes("undefined"));
    assert.equal(item.explanation.normalizedClues.length, 6);
    assert.ok(item.explanation.decisiveTrace.length >= 1);
    assert.ok(item.explanation.conclusion.length >= 10);
    assert.ok(item.explanation.closestTrapRejection.length >= 10);

    answerPositions[item.correctIndex] += 1;
    prototypes.add(item.prototypeId);
    questions += 1;
  }

  const answers = group.questions.map((item) => item.answer);
  assert.equal(answers[0]?.kind, "PERSON");
  assert.equal(answers[0]?.kind === "PERSON" ? answers[0].personId : null, "B");
  assert.equal(answers[1]?.kind === "PERSON" ? answers[1].personId : null, "A");
  assert.equal(answers[2]?.kind === "PERSON" ? answers[2].personId : null, "E");
  assert.equal(
    answers[3]?.kind === "PAIR" ? [...answers[3].personIds].sort().join("::") : null,
    "C::D",
  );
  assert.equal(
    answers[4]?.kind === "PAIR" ? [...answers[4].personIds].sort().join("::") : null,
    "C::G",
  );
  assert.equal(
    answers[5]?.kind === "CLAIM" ? answers[5].relationId : null,
    "UNCLE",
  );
  assert.equal(
    answers[6]?.kind === "PERSON_SET"
      ? [...answers[6].personIds].sort().join("::")
      : null,
    "C::D",
  );

  fingerprints.add(group.metadata.semanticFingerprint);
  groups += 1;
}

assert.deepEqual(
  [...prototypes].sort(),
  [
    "BLR-CP003-PROT-SHARED-FALSE-CLAIM",
    "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON",
    "BLR-CP003-PROT-SHARED-MEMBER-SET",
    "BLR-CP003-PROT-SHARED-PARENT-CHILD-PAIR",
    "BLR-CP003-PROT-SHARED-SIBLING-PAIR",
  ],
);
assert.equal(fingerprints.size, 1);
assert.ok(answerPositions.every((count) => count > 0));
assert.equal(groups, 100);
assert.equal(hiddenGraphAgreementChecks, 100);
assert.equal(clueContributionChecks, 100);
assert.equal(questions, 700);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-003",
      gate: "SHARED_FAMILY_EXTENDED_PROTOTYPES_V1",
      scenarios: 1,
      groups,
      hiddenGraphAgreementChecks,
      clueContributionChecks,
      questions,
      answerPositions,
      prototypes: [...prototypes].sort(),
      permanentQlCount: 0,
      publicDeliveryEnabled: false,
      maritalStatusInferenceFromMissingSpouse: false,
    },
    null,
    2,
  ),
);
