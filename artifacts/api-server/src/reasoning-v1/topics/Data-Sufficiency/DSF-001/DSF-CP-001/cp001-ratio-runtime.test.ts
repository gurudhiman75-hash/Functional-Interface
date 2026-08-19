import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import {
  DSF_CP001_RATIO_EDITORIAL_VERSION,
  generateDsfCp001RatioEnglish,
} from "./cp001-ratio-editorial-runtime.ts";

function gcd(left: number, right: number): number {
  let a = Math.abs(Math.trunc(left));
  let b = Math.abs(Math.trunc(right));
  while (b !== 0) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a || 1;
}

function assertSimplestRatio(value: string): void {
  const match = value.match(/^(\d+):(\d+)$/);
  assert(match, `Expected normalized ratio, received ${value}`);
  const left = Number(match[1]);
  const right = Number(match[2]);
  assert(left > 0 && right > 0);
  assert.equal(gcd(left, right), 1, `Ratio ${value} is not in simplest form`);
}

const questions = Array.from({ length: 300 }, (_, seed) => generateDsfCp001RatioEnglish(seed));
const classCounts = Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [
  semanticClass,
  questions.filter((question) => question.canonicalAnswer === semanticClass).length,
]));
const solveModeCounts = {
  ratio: questions.filter((question) => question.targetKind === "RATIO_AB").length,
  greater: questions.filter((question) => question.targetKind === "GREATER_QUANTITY").length,
};
const statementRuleIds = new Set<string>();
const identities = new Set<string>();
let ratioProjectionCases = 0;

for (const question of questions) {
  assert.equal(question.qlId, "DSF-QL-001");
  assert.equal(question.checkpointId, "DSF-CP-001");
  assert.equal(question.sourceChapterId, "RAP-001");
  assert.equal(question.sourceCapability, "RAP-001/math::formatRatio");
  assert.deepEqual(question.sourceAncestry, ["RAP-001", "RAP-001/math::formatRatio"]);
  assert.equal(question.answerContractId, "DS_STANDARD_5");
  assert.equal(question.editorialVersion, DSF_CP001_RATIO_EDITORIAL_VERSION);
  assert.equal(question.options.length, 5);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.semanticClass, question.canonicalAnswer);
  assert(question.proof.statementIWorldCount > 0);
  assert(question.proof.statementIIWorldCount > 0);
  assert(question.proof.togetherWorldCount > 0);
  assert.equal(question.proof.baseWorldCount, 272);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.validation.ok, true);
  assert.match(question.stem, /^A and B are distinct positive integers between 2 and 18\./);
  assert(!/normalized|target projection|surviving world|semantic class|DSF-|RAP-|QL-/i.test([
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
  assert(!/\bmakes (?:A|B) is greater than\b/i.test([
    question.explanation.statementI,
    question.explanation.statementII,
    question.explanation.together ?? "",
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

  if (question.targetKind === "RATIO_AB") {
    for (const answer of [
      ...question.proof.statementITargetAnswers,
      ...question.proof.statementIITargetAnswers,
      ...question.proof.togetherTargetAnswers,
    ]) {
      assertSimplestRatio(answer);
    }
    const hasProjection = (
      (question.proof.statementIWorldCount > 1 && question.proof.statementITargetAnswers.length === 1)
      || (question.proof.statementIIWorldCount > 1 && question.proof.statementIITargetAnswers.length === 1)
      || (question.proof.togetherWorldCount > 1 && question.proof.togetherTargetAnswers.length === 1)
    );
    if (hasProjection) ratioProjectionCases += 1;
  } else {
    const allAnswers = [
      ...question.proof.statementITargetAnswers,
      ...question.proof.statementIITargetAnswers,
      ...question.proof.togetherTargetAnswers,
    ];
    assert(allAnswers.every((answer) => answer === "A" || answer === "B"));
  }

  for (const statement of question.statements) statementRuleIds.add(statement.statementRuleId);
  identities.add(question.generationIdentity);
}

for (const semanticClass of SUFFICIENCY_CLASSES) {
  assert((classCounts[semanticClass] ?? 0) >= 35, `Too few ${semanticClass}: ${classCounts[semanticClass]}`);
}
assert(solveModeCounts.ratio >= 80, `Too few ratio targets: ${solveModeCounts.ratio}`);
assert(solveModeCounts.greater >= 60, `Too few comparison targets: ${solveModeCounts.greater}`);
assert(ratioProjectionCases >= 12, `Too few multi-world unique-ratio cases: ${ratioProjectionCases}`);
assert(statementRuleIds.size >= 20, `Too little statement-rule diversity: ${statementRuleIds.size}`);
assert.equal(identities.size, questions.length);

for (const seed of [0, 1, 7, 29, 88, 177, 299]) {
  assert.deepEqual(generateDsfCp001RatioEnglish(seed), generateDsfCp001RatioEnglish(seed));
}

const representative = SUFFICIENCY_CLASSES.map((semanticClass) => {
  const question = questions.find((candidate) => candidate.canonicalAnswer === semanticClass)!;
  assert(question);
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
  status: "PASS_DSF_CP_001_RATIO_PRODUCTION",
  generated: questions.length,
  classCounts,
  solveModeCounts,
  ratioProjectionCases,
  statementRuleDiversity: statementRuleIds.size,
  distinctGenerationIdentities: identities.size,
  editorialVersion: DSF_CP001_RATIO_EDITORIAL_VERSION,
  representative,
  lifecycle: "REVIEW_ONLY_NOT_PUBLISHED",
}, null, 2));
