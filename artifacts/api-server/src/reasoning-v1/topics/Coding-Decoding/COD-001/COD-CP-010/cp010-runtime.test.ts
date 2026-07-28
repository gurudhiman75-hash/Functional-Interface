import assert from "node:assert/strict";

import { COD_CP010_PERMANENT_CONTRACTS } from "./cp010-permanent-contracts";
import { generateCp010PrototypeQuestion } from "./cp010-prototype-runtime";
import { generateCp010Question } from "./cp010-runtime";
import { solveCp010Prompt } from "./cp010-prototype-solver";

assert.deepEqual(COD_CP010_PERMANENT_CONTRACTS.map((contract) => contract.qlId), ["COD-QL-199"]);
assert.equal(COD_CP010_PERMANENT_CONTRACTS.length, 1);
assert.equal(COD_CP010_PERMANENT_CONTRACTS[0]?.solveContractId, "APPLY_CONDITIONAL_TABLE_FORWARD");
assert.equal(COD_CP010_PERMANENT_CONTRACTS[0]?.status, "ENGLISH_RUNTIME_PROOF");
assert.equal(COD_CP010_PERMANENT_CONTRACTS[0]?.publiclyPublishable, false);
assert.equal(COD_CP010_PERMANENT_CONTRACTS[0]?.questionStudioVisible, false);

const answerPositions = [0, 0, 0, 0];
const domains = new Set<string>();
const endpointSignatures = new Set<string>();
const actionKinds = new Set<string>();
const difficulties = new Set<string>();
const stems = new Set<string>();
let generatedCount = 0;

for (let seed = 0; seed < 800; seed += 1) {
  const question = generateCp010Question("COD-QL-199", seed);
  const repeat = generateCp010Question("COD-QL-199", seed);
  const prototype = generateCp010PrototypeQuestion(seed);

  assert.deepEqual(repeat, question, `COD-QL-199/${seed} must be deterministic`);
  assert.equal(question.qlId, "COD-QL-199");
  assert.equal(question.permanentQlId, "COD-QL-199");
  assert.equal(question.checkpointId, "COD-CP-010");
  assert.equal(question.prototypeOnly, false);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.locale, "en-IN");
  assert.equal(question.renderer, "CONDITION_TABLE");
  assert.equal(question.answerType, "MIXED_CODE_SEQUENCE");
  assert.equal(question.metadata.runtimeVersion, "cod-cp010-runtime-v1");
  assert.equal(question.metadata.sourcePrototypeId, "COD-CP010-PROT-APPLY-CONDITIONAL-TABLE");
  assert.equal(question.metadata.solveContractId, "APPLY_CONDITIONAL_TABLE_FORWARD");
  assert.equal(question.metadata.solverAgreement, true);
  assert.equal(question.metadata.mutuallyExclusiveConditions, true);
  assert.equal(question.metadata.precedenceRequired, false);

  assert.equal("prototypeId" in question, false, `COD-QL-199/${seed} leaked a top-level prototype ID`);
  assert.equal(question.stem, prototype.stem);
  assert.deepEqual(question.structuredPrompt, prototype.structuredPrompt);
  assert.deepEqual(question.options, prototype.options);
  assert.equal(question.correctIndex, prototype.correctIndex);
  assert.deepEqual(question.explanation, prototype.explanation);
  assert.equal(question.difficulty, prototype.difficulty);

  const independent = solveCp010Prompt(question.structuredPrompt);
  assert.equal(independent.finalCodeTokens.join(""), question.metadata.correctAnswer);
  assert.equal(independent.baseCodeTokens.join(""), question.metadata.baseCode);
  assert.equal(independent.matchedConditionId, question.metadata.matchedConditionId);
  assert.equal(independent.actionKind, question.metadata.actionKind);

  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
  assert.equal(question.options[question.correctIndex]?.isCorrect, true);
  assert.equal(question.options[question.correctIndex]?.value, question.metadata.correctAnswer);
  assert.ok(question.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.errorLabel)));

  assert.equal(question.structuredPrompt.taskKind, "ENCODE_WITH_CONDITION_TABLE");
  assert.equal(question.structuredPrompt.precedence, "MUTUALLY_EXCLUSIVE");
  assert.equal(question.structuredPrompt.conditions.length, 4);
  assert.ok(question.structuredPrompt.sourceTokens.length >= 5);
  assert.ok(question.structuredPrompt.sourceTokens.length <= 7);
  assert.equal(question.structuredPrompt.sourceDisplay, question.structuredPrompt.sourceTokens.join(""));

  assert.ok(question.explanation.referenceAid.length >= 2);
  assert.ok(question.explanation.quickMethod.length > 30);
  assert.ok(question.explanation.ruleStatement.length > 40);
  assert.ok(question.explanation.sourceDemonstration.join(" ").includes(question.metadata.baseCode));
  assert.ok(question.explanation.targetApplication.join(" ").includes(question.metadata.correctAnswer));
  assert.ok(question.explanation.conclusion.includes(question.metadata.correctAnswer));
  assert.ok(question.explanation.commonTrapAlert.length > 30);

  const visibleText = [
    question.stem,
    ...question.structuredPrompt.conditions.map((condition) => condition.description),
    ...question.options.map((option) => option.value),
    ...question.explanation.referenceAid,
    question.explanation.quickMethod,
    question.explanation.ruleStatement,
    ...question.explanation.sourceDemonstration,
    ...question.explanation.targetApplication,
    question.explanation.conclusion,
    question.explanation.commonTrapAlert,
  ].join(" ");
  assert.ok(!/COD-CP|COD-QL|PROT-|REPLACE_|COPY_|SWAP_/u.test(visibleText));
  assert.ok(!/undefined|null|NaN/u.test(visibleText));

  answerPositions[question.correctIndex] += 1;
  domains.add(question.metadata.domain);
  endpointSignatures.add(`${question.metadata.domain}:${question.metadata.endpointSignature}`);
  actionKinds.add(question.metadata.actionKind);
  difficulties.add(question.difficulty);
  stems.add(JSON.stringify({
    mappingRows: question.structuredPrompt.mappingRows,
    conditions: question.structuredPrompt.conditions,
    source: question.structuredPrompt.sourceDisplay,
    stem: question.stem,
    options: question.options.map((option) => option.value),
  }));
  generatedCount += 1;
}

assert.equal(generatedCount, 800);
assert.deepEqual([...domains].sort(), ["DIGIT", "LETTER"]);
assert.equal(endpointSignatures.size, 8);
assert.deepEqual(
  [...actionKinds].sort(),
  [
    "COPY_LEFT_CODE_TO_BOTH",
    "COPY_RIGHT_CODE_TO_BOTH",
    "REPLACE_ENDPOINTS_WITH_CONSTANT",
    "REPLACE_MATCHING_CLASS_WITH_DESIGNATED_CODE",
    "SWAP_ENDPOINT_CODES",
  ],
);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.ok(answerPositions.every((count) => count > 150), `Answer positions are imbalanced: ${answerPositions.join(", ")}`);
assert.ok(stems.size > 790, `Too many repeated complete questions: ${stems.size}`);

console.log("COD-CP-010 permanent English runtime audit passed.", {
  qlRange: "COD-QL-199",
  generatedCount,
  answerPositions,
  domains: [...domains].sort(),
  endpointSignatures: [...endpointSignatures].sort(),
  actionKinds: [...actionKinds].sort(),
  difficulties: [...difficulties].sort(),
  distinctCompleteQuestions: stems.size,
});
