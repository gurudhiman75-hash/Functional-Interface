import assert from "node:assert/strict";

import { CP008_SEMANTIC_FACTS } from "./cp008-curated-facts";
import { CP008_PROTOTYPE_CONTRACTS } from "./cp008-prototype-contracts";
import { generateCp008PrototypeQuestion } from "./cp008-prototype-runtime";
import { auditCp008Mapping, renamedLabel, solveCp008Prompt } from "./cp008-prototype-solver";

assert.equal(CP008_PROTOTYPE_CONTRACTS.length, 2, "CP-008 discovery must expose exactly two prototype solve contracts");
assert.deepEqual(
  CP008_PROTOTYPE_CONTRACTS.map((contract) => contract.prototypeId),
  [
    "COD-CP008-PROT-DIRECT-RENAMED-LABEL",
    "COD-CP008-PROT-SEMANTIC-REFERENT-RENAMING",
  ],
);

const allQuestions = CP008_PROTOTYPE_CONTRACTS.flatMap((contract) =>
  Array.from({ length: 200 }, (_, index) => generateCp008PrototypeQuestion(contract.prototypeId, index + 1)),
);

assert.equal(allQuestions.length, 400);
assert.equal(new Set(allQuestions.map((question) => `${question.prototypeId}:${question.seed}`)).size, 400);
assert.ok(new Set(allQuestions.map((question) => question.stem)).size >= 380, "CP-008 stems need broad variation");

const answerPositions = new Set<number>();
const renderers = new Set<string>();
const topologies = new Set<string>();
const difficulties = new Set<string>();
const directDifficulties = new Set<string>();
const semanticDifficulties = new Set<string>();
const factCategories = new Set<string>();
const factIds = new Set<string>();
const errorLabels = new Set<string>();

for (const question of allQuestions) {
  const repeated = generateCp008PrototypeQuestion(question.prototypeId, question.seed);
  assert.deepEqual(repeated, question, `${question.prototypeId}/${question.seed} must reproduce exactly`);
  assert.equal(question.permanentQlId, null);
  assert.equal(question.prototypeOnly, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.locale, "en-IN");
  assert.equal(question.answerType, "WORD_OR_LABEL");
  assert.equal(question.metadata.oneStepOnly, true);
  assert.equal(question.metadata.solverAgreement, true);
  assert.equal(question.metadata.ordinaryAnswerUnique, true);
  assert.equal(question.metadata.identityEdges, 0);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.isCorrect, true);
  assert.equal(question.options[question.correctIndex]?.value, question.metadata.correctAnswer);

  const mappingAudit = auditCp008Mapping(question.structuredPrompt.mapping);
  assert.equal(mappingAudit.accepted, true);
  assert.equal(mappingAudit.mappingInjective, true);
  assert.equal(mappingAudit.identityEdges, 0);
  assert.equal(solveCp008Prompt(question.structuredPrompt), question.metadata.correctAnswer);
  assert.equal(
    renamedLabel(question.structuredPrompt.mapping, question.structuredPrompt.ordinaryAnswer),
    question.metadata.correctAnswer,
  );
  assert.notEqual(question.metadata.correctAnswer, question.structuredPrompt.ordinaryAnswer, "Renaming must be active");

  const explanationText = JSON.stringify(question.explanation).toLowerCase();
  assert.ok(explanationText.includes(question.structuredPrompt.ordinaryAnswer.toLowerCase()));
  assert.ok(explanationText.includes(question.metadata.correctAnswer.toLowerCase()));
  assert.ok(explanationText.includes("once") || explanationText.includes("one renaming"));
  assert.doesNotMatch(question.stem, /prototype|fingerprint|registry|solver|parameter/i);
  assert.doesNotMatch(explanationText, /prototype|fingerprint|registry|parameter domain/);
  assert.doesNotMatch(`${question.stem}${explanationText}`, /\{\{|\}\}|<[^>]+>|undefined|null/);

  answerPositions.add(question.correctIndex);
  renderers.add(question.renderer);
  topologies.add(question.metadata.topology);
  difficulties.add(question.difficulty);
  question.options.filter((option) => !option.isCorrect).forEach((option) => errorLabels.add(option.errorLabel ?? ""));

  if (question.structuredPrompt.taskKind === "DIRECT_LABEL_QUERY") {
    assert.ok(question.structuredPrompt.directTarget);
    assert.equal(question.structuredPrompt.semanticFactId, undefined);
    directDifficulties.add(question.difficulty);
  } else {
    assert.ok(question.structuredPrompt.semanticFactId);
    assert.ok(question.structuredPrompt.semanticQuestion);
    factIds.add(question.structuredPrompt.semanticFactId!);
    factCategories.add(question.metadata.factCategory!);
    semanticDifficulties.add(question.difficulty);
  }
}

assert.deepEqual([...answerPositions].sort(), [0, 1, 2, 3]);
assert.deepEqual([...renderers].sort(), ["EXAMPLE_TARGET_BLOCK", "INLINE_CODE_PAIR", "MAPPING_TABLE"]);
assert.deepEqual([...topologies].sort(), ["CYCLE", "OPEN_CHAIN"]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.deepEqual([...directDifficulties].sort(), ["EASY", "MEDIUM"]);
assert.deepEqual([...semanticDifficulties].sort(), ["HARD", "MEDIUM"]);
assert.deepEqual([...factCategories].sort(), ["ATTRIBUTE", "CATEGORY", "FUNCTION", "ROLE"]);
assert.equal(factIds.size, CP008_SEMANTIC_FACTS.length, "Every curated CP-008 fact must be exercised");
assert.ok(errorLabels.has("NO_RENAMING_APPLIED"));
assert.ok(errorLabels.has("FOLLOWED_RENAMING_TWICE"));
assert.ok(errorLabels.has("INVERSE_RENAMING_DIRECTION") || errorLabels.has("WRONG_ORDINARY_REFERENT"));

console.log(JSON.stringify({
  prototypeContracts: CP008_PROTOTYPE_CONTRACTS.length,
  questions: allQuestions.length,
  distinctStems: new Set(allQuestions.map((question) => question.stem)).size,
  semanticFacts: factIds.size,
  factCategories: [...factCategories].sort(),
  topologies: [...topologies].sort(),
  renderers: [...renderers].sort(),
  difficulties: [...difficulties].sort(),
  answerPositions: [...answerPositions].sort(),
  permanentQls: 0,
}, null, 2));
