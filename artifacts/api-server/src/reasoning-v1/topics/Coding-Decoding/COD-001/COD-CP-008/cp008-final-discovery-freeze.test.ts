import assert from "node:assert/strict";

import { CP008_SEMANTIC_FACTS } from "./cp008-curated-facts";
import { CP008_PROTOTYPE_CONTRACTS } from "./cp008-prototype-contracts";
import { COD_CP008_ENGLISH_DISCOVERY_FREEZE_V1 } from "./cp008-final-discovery-freeze";
import { generateCp008PrototypeQuestion } from "./cp008-prototype-runtime";

const freeze = COD_CP008_ENGLISH_DISCOVERY_FREEZE_V1;

assert.equal(freeze.freezeVersion, "COD_CP008_ENGLISH_DISCOVERY_FREEZE_V1");
assert.equal(freeze.checkpointId, "COD-CP-008");
assert.equal(freeze.permanentQlCount, 0);
assert.equal(freeze.nextAvailableQlId, "COD-QL-173");
assert.deepEqual(freeze.retainedRuleFamilies, [
  "DIRECT_RENAMED_LABEL",
  "SEMANTIC_REFERENT_THEN_RENAME",
]);
assert.equal(freeze.prototypeContracts.length, 2);
assert.deepEqual(
  freeze.prototypeContracts.map((contract) => contract.prototypeId),
  CP008_PROTOTYPE_CONTRACTS.map((contract) => contract.prototypeId),
);
assert.equal(freeze.semanticFactCount, CP008_SEMANTIC_FACTS.length);
assert.equal(freeze.semanticFactCount, 15);
assert.deepEqual(freeze.semanticFactCategories, ["ATTRIBUTE", "CATEGORY", "FUNCTION", "ROLE"]);
assert.deepEqual(freeze.admittedTopologies, ["OPEN_CHAIN", "CYCLE"]);
assert.deepEqual(freeze.allocationPlanAfterFreezeApproval, [
  { qlId: "COD-QL-173", ruleId: "DIRECT_RENAMED_LABEL" },
  { qlId: "COD-QL-174", ruleId: "SEMANTIC_REFERENT_THEN_RENAME" },
]);
assert.equal(freeze.localeStatus, "ENGLISH_DISCOVERY_ONLY");
assert.equal(freeze.publiclyPublishable, false);
assert.equal(freeze.questionStudioVisible, false);

const dispositions = new Map(
  freeze.excludedOrDelegatedCandidates.map(({ candidate, disposition }) => [candidate, disposition]),
);
assert.equal(dispositions.get("CHARACTER_OR_TOKEN_SUBSTITUTION"), "DELEGATE_COD_CP001");
assert.equal(dispositions.get("SENTENCE_OR_ARTIFICIAL_LANGUAGE_OVERLAP"), "DELEGATE_COD_CP009");
assert.equal(dispositions.get("CONDITIONAL_RENAMING_TABLE"), "DELEGATE_COD_CP010");
assert.equal(dispositions.get("INVERSE_ORIGINAL_REFERENT_QUERY"), "SOURCE_GAP_EXCLUDE");
assert.equal(dispositions.get("MULTI_HOP_RENAMING"), "REJECT_MISCONCEPTION");
assert.equal(dispositions.get("UNSTABLE_OR_AMBIGUOUS_FACTS"), "REJECT_DATASET");

const questions = CP008_PROTOTYPE_CONTRACTS.flatMap((contract) =>
  Array.from({ length: 200 }, (_, index) => generateCp008PrototypeQuestion(contract.prototypeId, index + 1)),
);
assert.equal(questions.length, 400);
assert.equal(questions.filter((question) => question.permanentQlId !== null).length, 0);
assert.equal(questions.filter((question) => question.publiclyPublishable).length, 0);
assert.equal(new Set(questions.map((question) => question.ruleId)).size, 2);
assert.deepEqual(
  [...new Set(questions.map((question) => question.ruleId))].sort(),
  ["DIRECT_RENAMED_LABEL", "SEMANTIC_REFERENT_THEN_RENAME"],
);
assert.deepEqual(
  [...new Set(questions.map((question) => question.metadata.topology))].sort(),
  ["CYCLE", "OPEN_CHAIN"],
);

console.log(JSON.stringify({
  freezeVersion: freeze.freezeVersion,
  retainedRuleFamilies: freeze.retainedRuleFamilies.length,
  prototypeContracts: freeze.prototypeContracts.length,
  semanticFacts: freeze.semanticFactCount,
  admittedTopologies: freeze.admittedTopologies,
  auditedQuestions: questions.length,
  permanentQls: freeze.permanentQlCount,
  nextAvailableQlId: freeze.nextAvailableQlId,
}, null, 2));
