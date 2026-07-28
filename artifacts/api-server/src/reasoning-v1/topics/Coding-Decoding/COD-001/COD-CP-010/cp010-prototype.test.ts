import assert from "node:assert/strict";

import { COD_CP010_PROTOTYPE_CONTRACTS } from "./cp010-prototype-contracts";
import { generateCp010PrototypeQuestion } from "./cp010-prototype-runtime";
import { classifyCp010Token, solveCp010Prompt } from "./cp010-prototype-solver";

assert.equal(COD_CP010_PROTOTYPE_CONTRACTS.length, 1);
assert.deepEqual(COD_CP010_PROTOTYPE_CONTRACTS[0], {
  prototypeId: "COD-CP010-PROT-APPLY-CONDITIONAL-TABLE",
  checkpointId: "COD-CP-010",
  ruleFamily: "EXPLICIT_MUTUALLY_EXCLUSIVE_CONDITIONAL_TABLE",
  solveContractId: "APPLY_CONDITIONAL_TABLE_FORWARD",
  taskKind: "ENCODE_WITH_CONDITION_TABLE",
  supportedDomains: ["LETTER", "DIGIT"],
  answerType: "MIXED_CODE_SEQUENCE",
  status: "PROTOTYPE",
  permanentQlId: null,
  publiclyPublishable: false,
  questionStudioVisible: false,
});

const answerPositions = [0, 0, 0, 0];
const domains = new Set<string>();
const endpointSignatures = new Set<string>();
const actionKinds = new Set<string>();
const difficulties = new Set<string>();
const displayedFingerprints = new Set<string>();
let globalOverrideQuestions = 0;
let generatedCount = 0;

for (let seed = 0; seed < 800; seed += 1) {
  const first = generateCp010PrototypeQuestion(seed);
  const repeat = generateCp010PrototypeQuestion(seed);
  assert.deepEqual(repeat, first, `Seed ${seed} must be deterministic`);

  assert.equal(first.checkpointId, "COD-CP-010");
  assert.equal(first.prototypeId, "COD-CP010-PROT-APPLY-CONDITIONAL-TABLE");
  assert.equal(first.permanentQlId, null);
  assert.equal(first.prototypeOnly, true);
  assert.equal(first.reviewOnly, true);
  assert.equal(first.publiclyPublishable, false);
  assert.equal(first.questionStudioVisible, false);
  assert.equal(first.locale, "en-IN");
  assert.equal(first.renderer, "CONDITION_TABLE");
  assert.equal(first.answerType, "MIXED_CODE_SEQUENCE");
  assert.equal(first.structuredPrompt.taskKind, "ENCODE_WITH_CONDITION_TABLE");
  assert.equal(first.structuredPrompt.precedence, "MUTUALLY_EXCLUSIVE");
  assert.equal(first.structuredPrompt.conditions.length, 4);
  assert.ok(first.structuredPrompt.sourceTokens.length >= 5 && first.structuredPrompt.sourceTokens.length <= 7);
  assert.equal(first.structuredPrompt.sourceDisplay, first.structuredPrompt.sourceTokens.join(""));

  const tableSources = first.structuredPrompt.mappingRows.map((row) => row.sourceToken);
  const tableCodes = first.structuredPrompt.mappingRows.map((row) => row.codeToken);
  assert.equal(new Set(tableSources).size, tableSources.length);
  assert.equal(new Set(tableCodes).size, tableCodes.length);
  assert.ok(first.structuredPrompt.sourceTokens.every((token) => tableSources.includes(token)));

  const conditionKeys = first.structuredPrompt.conditions.map(
    (condition) => `${condition.firstClass}_${condition.lastClass}`,
  );
  assert.equal(new Set(conditionKeys).size, 4, `Seed ${seed} has overlapping condition selectors`);

  const independent = solveCp010Prompt(first.structuredPrompt);
  assert.equal(independent.matchedConditionId, first.metadata.matchedConditionId);
  assert.equal(independent.actionKind, first.metadata.actionKind);
  assert.equal(independent.finalCodeTokens.join(""), first.metadata.correctAnswer);
  assert.equal(independent.baseCodeTokens.join(""), first.metadata.baseCode);
  assert.notEqual(first.metadata.correctAnswer, first.metadata.baseCode, `Seed ${seed} condition must change the base code`);

  const firstClass = classifyCp010Token(
    first.structuredPrompt.sourceTokens[0]!,
    first.structuredPrompt.domain,
  );
  const lastClass = classifyCp010Token(
    first.structuredPrompt.sourceTokens[first.structuredPrompt.sourceTokens.length - 1]!,
    first.structuredPrompt.domain,
  );
  assert.equal(`${firstClass}_${lastClass}`, first.metadata.endpointSignature);

  assert.equal(first.options.length, 4);
  assert.equal(new Set(first.options.map((option) => option.value)).size, 4);
  assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
  assert.ok(first.correctIndex >= 0 && first.correctIndex < 4);
  assert.equal(first.options[first.correctIndex]?.isCorrect, true);
  assert.equal(first.options[first.correctIndex]?.value, first.metadata.correctAnswer);
  assert.ok(first.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.errorLabel)));

  assert.ok(first.explanation.referenceAid.length >= 2);
  assert.ok(first.explanation.ruleStatement.length > 30);
  assert.ok(first.explanation.sourceDemonstration.join(" ").includes(first.metadata.baseCode));
  assert.ok(first.explanation.targetApplication.join(" ").includes(first.metadata.correctAnswer));
  assert.ok(first.explanation.conclusion.includes(first.metadata.correctAnswer));
  assert.ok(first.explanation.commonTrapAlert.length > 30);

  const visibleText = [
    first.stem,
    ...first.structuredPrompt.conditions.map((condition) => condition.description),
    ...first.explanation.referenceAid,
    first.explanation.quickMethod,
    first.explanation.ruleStatement,
    ...first.explanation.sourceDemonstration,
    ...first.explanation.targetApplication,
    first.explanation.conclusion,
    first.explanation.commonTrapAlert,
  ].join(" ");
  assert.ok(!/COD-CP|PROT-|REPLACE_|COPY_|SWAP_/u.test(visibleText), `Seed ${seed} leaks internal IDs`);
  assert.ok(!/undefined|null|NaN/u.test(visibleText), `Seed ${seed} leaks invalid text`);

  if (first.metadata.actionKind === "REPLACE_MATCHING_CLASS_WITH_DESIGNATED_CODE") {
    globalOverrideQuestions += 1;
    const vowelCount = first.structuredPrompt.sourceTokens.filter(
      (token) => classifyCp010Token(token, "LETTER") === "VOWEL",
    ).length;
    assert.ok(vowelCount >= 2, `Seed ${seed} must visibly exercise a class-wide override`);
  }

  answerPositions[first.correctIndex] += 1;
  domains.add(first.metadata.domain);
  endpointSignatures.add(`${first.metadata.domain}:${first.metadata.endpointSignature}`);
  actionKinds.add(first.metadata.actionKind);
  difficulties.add(first.difficulty);
  displayedFingerprints.add(JSON.stringify({
    mappingRows: first.structuredPrompt.mappingRows,
    conditions: first.structuredPrompt.conditions,
    source: first.structuredPrompt.sourceDisplay,
    options: first.options.map((option) => option.value),
  }));
  generatedCount += 1;
}

assert.equal(generatedCount, 800);
assert.deepEqual([...domains].sort(), ["DIGIT", "LETTER"]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
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
assert.equal(endpointSignatures.size, 8);
assert.ok(globalOverrideQuestions >= 90);
assert.ok(answerPositions.every((count) => count > 150), `Answer positions are imbalanced: ${answerPositions.join(", ")}`);
assert.ok(displayedFingerprints.size > 790, `Too many repeated complete questions: ${displayedFingerprints.size}`);

console.log("COD-CP-010 conditional-table prototype audit passed.", {
  generatedCount,
  answerPositions,
  domains: [...domains],
  endpointSignatures: [...endpointSignatures].sort(),
  actionKinds: [...actionKinds].sort(),
  difficulties: [...difficulties].sort(),
  globalOverrideQuestions,
  distinctDisplayedQuestions: displayedFingerprints.size,
  permanentQlIdsAllocated: 0,
});
