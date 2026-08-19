import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import {
  DSF_CP001_PERCENTAGE_EDITORIAL_VERSION,
  generateDsfCp001PercentageEnglish,
} from "./cp001-percentage-editorial-runtime.ts";

const questions = Array.from({ length: 300 }, (_, seed) => generateDsfCp001PercentageEnglish(seed));
const classCounts = Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [
  semanticClass,
  questions.filter((question) => question.canonicalAnswer === semanticClass).length,
]));
const solveModeCounts = {
  exact: questions.filter((question) => question.targetKind === "NET_PERCENT_CHANGE").length,
  direction: questions.filter((question) => question.targetKind === "FINAL_DIRECTION").length,
};
const identities = new Set<string>();
const statementRuleIds = new Set<string>();
let targetProjectionCases = 0;

for (const question of questions) {
  assert.equal(question.qlId, "DSF-QL-001");
  assert.equal(question.checkpointId, "DSF-CP-001");
  assert.equal(question.sourceChapterId, "PCT-001");
  assert.equal(question.sourceCapability, "PCT-001/math::{percentOf,roundTo,formatPercent,formatRatio}");
  assert.deepEqual(question.sourceAncestry, [
    "PCT-001",
    "PCT-001/math::{percentOf,roundTo,formatPercent,formatRatio}",
  ]);
  assert.equal(question.answerContractId, "DS_STANDARD_5");
  assert.equal(question.editorialVersion, DSF_CP001_PERCENTAGE_EDITORIAL_VERSION);
  assert.equal(question.proof.baseWorldCount, 100);
  assert.equal(question.options.length, 5);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.semanticClass, question.canonicalAnswer);
  assert(question.proof.statementIWorldCount > 0);
  assert(question.proof.statementIIWorldCount > 0);
  assert(question.proof.togetherWorldCount > 0);
  assert.equal(question.validation.ok, true);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.match(question.stem, /^P and Q are percentage rates, each a multiple of 5 from 5% to 50%\./);
  assert(!/normalized|target projection|surviving world|world count|semantic class|DSF-|PCT-|QL-/i.test([
    question.stem,
    ...question.statements.map((statement) => statement.text),
    ...question.options.map((option) => option.value),
    question.explanation.askedTarget,
    question.explanation.statementI,
    question.explanation.statementII,
    question.explanation.together ?? "",
    question.explanation.conclusion,
  ].join(" ")));
  assert(!/Even both statements together are not sufficient/i.test(question.explanation.conclusion));
  assert(!/\bmakes (?:the|final)\b/i.test([
    question.explanation.statementI,
    question.explanation.statementII,
  ].join(" ")));

  if (question.canonicalAnswer === "INSUFFICIENT_EVEN_TOGETHER") {
    assert.equal(
      question.explanation.conclusion,
      "Even when both statements are used together, they are not sufficient.",
    );
    assert(question.explanation.together);
  }
  if (question.canonicalAnswer === "BOTH_TOGETHER_ONLY") {
    assert(question.explanation.together);
    assert.match(question.explanation.conclusion, /neither statement alone/i);
  }

  if (question.targetKind === "NET_PERCENT_CHANGE") {
    const allAnswers = [
      ...question.proof.statementITargetAnswers,
      ...question.proof.statementIITargetAnswers,
      ...question.proof.togetherTargetAnswers,
    ];
    assert(allAnswers.every((answer) => /^-?\d+(?:\.\d+)?%$/.test(answer)));
  } else {
    const allAnswers = [
      ...question.proof.statementITargetAnswers,
      ...question.proof.statementIITargetAnswers,
      ...question.proof.togetherTargetAnswers,
    ];
    assert(allAnswers.every((answer) => ["ABOVE", "BELOW", "SAME"].includes(answer)));
  }

  const hasProjection = (
    (question.proof.statementIWorldCount > 1 && question.proof.statementITargetAnswers.length === 1)
    || (question.proof.statementIIWorldCount > 1 && question.proof.statementIITargetAnswers.length === 1)
    || (question.proof.togetherWorldCount > 1 && question.proof.togetherTargetAnswers.length === 1)
  );
  if (hasProjection) targetProjectionCases += 1;

  for (const statement of question.statements) statementRuleIds.add(statement.statementRuleId);
  identities.add(question.generationIdentity);
}

for (const semanticClass of SUFFICIENCY_CLASSES) {
  assert((classCounts[semanticClass] ?? 0) >= 35, `Too few ${semanticClass}: ${classCounts[semanticClass]}`);
}
assert(solveModeCounts.exact >= 80, `Too few exact net-change targets: ${solveModeCounts.exact}`);
assert(solveModeCounts.direction >= 70, `Too few direction targets: ${solveModeCounts.direction}`);
assert(targetProjectionCases >= 20, `Too few multi-world unique-target cases: ${targetProjectionCases}`);
assert(statementRuleIds.size >= 50, `Too little statement-rule diversity: ${statementRuleIds.size}`);
assert.equal(identities.size, questions.length);

for (const seed of [0, 1, 9, 37, 111, 207, 299]) {
  assert.deepEqual(generateDsfCp001PercentageEnglish(seed), generateDsfCp001PercentageEnglish(seed));
}

const representative = SUFFICIENCY_CLASSES.map((semanticClass) => {
  const question = questions.find((candidate) => candidate.canonicalAnswer === semanticClass)!;
  assert(question, `Missing representative ${semanticClass}`);
  return {
    seed: question.seed,
    class: semanticClass,
    target: question.targetKind,
    difficulty: question.difficulty,
    stem: question.stem,
    statementI: question.statements[0].text,
    statementII: question.statements[1].text,
    correctOption: question.options[question.correctIndex]?.value,
    explanation: [
      question.explanation.askedTarget,
      question.explanation.statementI,
      question.explanation.statementII,
      question.explanation.together,
      question.explanation.conclusion,
    ].filter(Boolean),
  };
});

console.log(JSON.stringify({
  status: "PASS_DSF_CP_001_PERCENTAGE_PRODUCTION",
  generated: questions.length,
  classCounts,
  solveModeCounts,
  targetProjectionCases,
  statementRuleDiversity: statementRuleIds.size,
  distinctGenerationIdentities: identities.size,
  editorialVersion: DSF_CP001_PERCENTAGE_EDITORIAL_VERSION,
  representative,
  lifecycle: "REVIEW_ONLY_NOT_PUBLISHED",
}, null, 2));
