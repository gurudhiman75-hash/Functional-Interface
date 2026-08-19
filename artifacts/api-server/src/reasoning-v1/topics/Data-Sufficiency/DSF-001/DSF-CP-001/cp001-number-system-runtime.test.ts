import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import {
  DSF_CP001_RUNTIME_VERSION,
  generateDsfCp001NumberSystemQuestion,
} from "./cp001-number-system-runtime.ts";

const questions = Array.from({ length: 500 }, (_, seed) => generateDsfCp001NumberSystemQuestion(seed));

assert.equal(questions.length, 500);
assert(questions.every((question) => question.packageId === "DSF-001"));
assert(questions.every((question) => question.checkpointId === "DSF-CP-001"));
assert(questions.every((question) => question.qlId === "DSF-QL-001"));
assert(questions.every((question) => question.runtimeVersion === DSF_CP001_RUNTIME_VERSION));
assert(questions.every((question) => question.sourceChapterId === "NUM-001"));
assert(questions.every((question) => question.answerSemantic === "SUFFICIENCY_CLASS"));
assert(questions.every((question) => question.answerContractId === "DS_STANDARD_5"));
assert(questions.every((question) => question.lifecycle.questionStudioDiscoverable === false));
assert(questions.every((question) => question.lifecycle.questionBankWritable === false));
assert(questions.every((question) => question.lifecycle.testEligible === false));
assert(questions.every((question) => question.lifecycle.publiclyPublishable === false));
assert(questions.every((question) => question.validation.ok));

for (const question of questions) {
  assert.equal(question.options.length, 5);
  assert.equal(new Set(question.options.map((option) => option.semanticClass)).size, 5);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.semanticClass, question.canonicalAnswer);
  assert.equal(question.options[question.correctIndex]?.isCorrect, true);
  assert.notEqual(question.statements[0].statementRuleId, question.statements[1].statementRuleId);
  assert(question.proof.statementIDigits.length > 0);
  assert(question.proof.statementIIDigits.length > 0);
  assert(question.proof.togetherDigits.length > 0);
  assert(question.proof.statementITargetAnswers.length > 0);
  assert(question.proof.statementIITargetAnswers.length > 0);
  assert(question.proof.togetherTargetAnswers.length > 0);
  assert.match(question.explanation.statementI, /Statement I/);
  assert.match(question.explanation.statementII, /Statement II/);
  assert(question.explanation.conclusion.length > 20);
  assert(!question.stem.includes("DSF-"));
  assert(!question.stem.includes("NUM-"));
  assert.equal(question.sourceAncestry[0], "NUM-001");
}

const classCounts = Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [
  semanticClass,
  questions.filter((question) => question.canonicalAnswer === semanticClass).length,
]));
for (const semanticClass of SUFFICIENCY_CLASSES) {
  assert((classCounts[semanticClass] ?? 0) >= 60, `${semanticClass} is underrepresented in the 500-seed stress corpus`);
}

const solveModeCounts = {
  missingDigit: questions.filter((question) => question.solveModeId === "DSF-SM-NUM-MISSING-DIGIT").length,
  digitParity: questions.filter((question) => question.solveModeId === "DSF-SM-NUM-DIGIT-PARITY").length,
};
assert(solveModeCounts.missingDigit > 250);
assert(solveModeCounts.digitParity > 20);

const targetProjectionCases = questions.filter((question) => {
  const iProjection = question.proof.statementIDigits.length > 1 && question.proof.statementITargetAnswers.length === 1;
  const iiProjection = question.proof.statementIIDigits.length > 1 && question.proof.statementIITargetAnswers.length === 1;
  const togetherProjection = question.proof.togetherDigits.length > 1 && question.proof.togetherTargetAnswers.length === 1;
  return iProjection || iiProjection || togetherProjection;
});
assert(targetProjectionCases.length > 10, "Stress corpus should contain multi-world unique-target sufficiency cases");
assert(targetProjectionCases.some((question) => question.targetKind === "DIGIT_PARITY"));

for (const seed of [0, 1, 2, 17, 99, 241, 499]) {
  const first = generateDsfCp001NumberSystemQuestion(seed);
  const second = generateDsfCp001NumberSystemQuestion(seed);
  assert.equal(first.generationIdentity, second.generationIdentity);
  assert.deepEqual(first, second);
}

const identityCount = new Set(questions.map((question) => question.generationIdentity)).size;
assert(identityCount > 450, `Expected high seed diversity; only ${identityCount}/500 identities were distinct`);

console.log(JSON.stringify({
  status: "PASS_DSF_CP_001_NUMBER_SYSTEM_PRODUCTION",
  generated: questions.length,
  classCounts,
  solveModeCounts,
  targetProjectionCases: targetProjectionCases.length,
  distinctGenerationIdentities: identityCount,
  lifecycle: "REVIEW_ONLY_NOT_PUBLISHED",
}, null, 2));
