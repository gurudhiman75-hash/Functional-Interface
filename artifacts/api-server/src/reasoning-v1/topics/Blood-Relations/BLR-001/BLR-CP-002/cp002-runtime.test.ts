import assert from "node:assert/strict";

import { allBlrCp002CanonicalScenarios } from "./cp002-canonical-scenario-registry";
import { BLR_CP002_PERMANENT_CONTRACTS } from "./cp002-permanent-contracts";
import { generateBlrCp002Question } from "./cp002-runtime";

const SEED_COUNT = 900;
const contract = BLR_CP002_PERMANENT_CONTRACTS[0]!;
const canonicalScenarios = allBlrCp002CanonicalScenarios();
const answerPositions = [0, 0, 0, 0];
const sourcePrototypeIds = new Set<string>();
const sourceScenarioIds = new Set<string>();
const presentations = new Set<string>();
const questionForms = new Set<string>();
const answers = new Set<string>();
const difficulties = new Set<string>();
const fingerprints = new Set<string>();
let selfRecords = 0;
let onlyRecords = 0;
let negativeRecords = 0;
let bothDerivedRecords = 0;
let threeAnchorRecords = 0;
let longChainRecords = 0;
let ownershipRecords = 0;
let maxRoleDepth = 0;

assert.equal(BLR_CP002_PERMANENT_CONTRACTS.length, 1);
assert.equal(contract.qlId, "BLR-QL-008");
assert.equal(contract.solveAuthority, "RESOLVE_ANCHORED_ROLE_CHAIN_RELATION");
assert.equal(contract.sourcePrototypeIds.length, 6);
assert.equal(canonicalScenarios.length, 45);

for (let seed = 0; seed < SEED_COUNT; seed += 1) {
  const question = generateBlrCp002Question("BLR-QL-008", seed);
  const reproduced = generateBlrCp002Question("BLR-QL-008", seed);
  assert.deepEqual(reproduced, question, `BLR-QL-008/${seed} is not deterministic.`);

  assert.equal(question.packageId, "BLR-001");
  assert.equal(question.checkpointId, "BLR-CP-002");
  assert.equal(question.qlId, "BLR-QL-008");
  assert.equal(question.permanentQlId, "BLR-QL-008");
  assert.equal(question.prototypeOnly, false);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.questionBankEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.locale, "en-IN");
  assert.equal(question.answerType, "RELATION_LABEL_OR_SELF");
  assert.ok(!("prototypeId" in question));

  assert.equal(question.metadata.runtimeVersion, "blr-cp002-runtime-v1");
  assert.equal(question.metadata.qlId, "BLR-QL-008");
  assert.equal(
    question.metadata.solveAuthority,
    "RESOLVE_ANCHORED_ROLE_CHAIN_RELATION",
  );
  assert.ok(contract.sourcePrototypeIds.includes(question.metadata.sourcePrototypeId));
  assert.ok(
    canonicalScenarios.some(
      (scenario) => scenario.scenarioId === question.metadata.sourceScenarioId,
    ),
  );
  assert.equal(question.metadata.sourceRuntimeVersion, "blr-cp002-prototype-v1");
  assert.equal(question.metadata.sourceSeed, seed);
  assert.equal(question.metadata.constraintsVerified, true);
  assert.equal(question.metadata.assertionVerified, true);
  assert.equal(question.metadata.independentSolverAgreed, true);
  assert.equal(question.metadata.familyGraphValid, true);

  assert.ok(question.stem.endsWith("?"));
  assert.ok(question.stem.length > 70);
  assert.ok(!question.stem.includes("undefined"));
  assert.ok(!question.stem.includes(" of me"));
  assert.ok(!question.stem.includes(" of you"));
  assert.ok(!question.stem.includes("I is"));
  assert.ok(!question.stem.includes("You is"));
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.answerId)).size, 4);
  assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.isCorrect, true);
  assert.equal(
    question.options[question.correctIndex]?.answerId,
    question.metadata.answerId,
  );
  assert.ok(question.explanation.coreConcept?.length);
  assert.ok(question.explanation.familyTreeGrid?.includes("Connections:"));
  assert.ok(question.explanation.generationAnalysis?.some((line) => line.includes("ΔGen")));
  assert.ok(question.explanation.examShortcut);
  assert.equal(question.explanation.distractorAnalysis?.length, 3);

  const querySubject = question.structuredPrompt.query.subject;
  const queryReference = question.structuredPrompt.query.reference;
  if (querySubject.kind === "ROLE_CHAIN" && queryReference.kind === "ROLE_CHAIN") {
    bothDerivedRecords += 1;
  }
  if (
    question.structuredPrompt.listenerId &&
    question.structuredPrompt.pointedPersonId
  ) {
    threeAnchorRecords += 1;
  }
  if (question.metadata.assertionRoleDepth + question.metadata.queryRoleDepth >= 4) {
    longChainRecords += 1;
  }
  if (question.metadata.questionForm !== "HOW_RELATED") ownershipRecords += 1;
  if (question.metadata.selfIdentity) selfRecords += 1;
  if (question.metadata.onlyConstraintCount > 0) onlyRecords += 1;
  if (question.metadata.negativeConstraintCount > 0) negativeRecords += 1;

  maxRoleDepth = Math.max(
    maxRoleDepth,
    question.metadata.assertionRoleDepth,
    question.metadata.queryRoleDepth,
  );
  answerPositions[question.correctIndex] += 1;
  sourcePrototypeIds.add(question.metadata.sourcePrototypeId);
  sourceScenarioIds.add(question.metadata.sourceScenarioId);
  presentations.add(question.metadata.presentation);
  questionForms.add(question.metadata.questionForm);
  answers.add(question.metadata.answerId);
  difficulties.add(question.difficulty);
  fingerprints.add(
    JSON.stringify({
      stem: question.stem,
      options: question.options.map((option) => option.value),
      scenario: question.metadata.sourceScenarioId,
    }),
  );
}

assert.deepEqual(answerPositions, [225, 225, 225, 225]);
assert.equal(sourcePrototypeIds.size, 6);
assert.equal(sourceScenarioIds.size, 45);
assert.deepEqual(
  [...presentations].sort(),
  ["CONVERSATION", "INTRODUCTION", "PHOTOGRAPH", "POINTING", "STAGE"],
);
assert.deepEqual(
  [...questionForms].sort(),
  ["HOW_RELATED", "WHOSE_PHOTOGRAPH", "WHOSE_PORTRAIT"],
);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.ok(answers.has("SELF"));
assert.ok(answers.has("SON"));
assert.ok(answers.has("MOTHER_IN_LAW"));
assert.ok(answers.has("BROTHER_IN_LAW"));
assert.ok(selfRecords > 0);
assert.ok(onlyRecords > 0);
assert.ok(negativeRecords > 0);
assert.ok(bothDerivedRecords > 0);
assert.ok(threeAnchorRecords > 0);
assert.ok(longChainRecords > 0);
assert.ok(ownershipRecords > 0);
assert.ok(maxRoleDepth >= 4);
assert.ok(fingerprints.size >= 800);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-002",
      qlId: "BLR-QL-008",
      runtimeVersion: "blr-cp002-runtime-v1",
      questions: SEED_COUNT,
      sourcePrototypeCount: sourcePrototypeIds.size,
      sourceScenarioCount: sourceScenarioIds.size,
      answerPositions,
      presentations: [...presentations].sort(),
      questionForms: [...questionForms].sort(),
      difficulties: [...difficulties].sort(),
      selfRecords,
      onlyRecords,
      negativeRecords,
      bothDerivedRecords,
      threeAnchorRecords,
      longChainRecords,
      ownershipRecords,
      nextAvailableQlId: "BLR-QL-009",
    },
    null,
    2,
  ),
);
