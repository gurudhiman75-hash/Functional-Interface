import { strict as assert } from "node:assert";
import {
  BLR_CP007_V4_WAVE3_SELF_REVIEW_AUTHORITY,
  buildBlrCp007EditorialV4Wave3Telemetry,
  generateBlrCp007EditorialV4Wave3Bank,
} from "./cp007-editorial-v4-wave3";
import type { GeneratedBlrCp007EditorialV4Question } from "./cp007-editorial-v4-model";

function componentCount(statements: GeneratedBlrCp007EditorialV4Question["completedStatements"]): number {
  const adjacency = new Map<string, Set<string>>();
  for (const statement of statements) {
    if (!adjacency.has(statement.leftId)) adjacency.set(statement.leftId, new Set());
    if (!adjacency.has(statement.rightId)) adjacency.set(statement.rightId, new Set());
    adjacency.get(statement.leftId)!.add(statement.rightId);
    adjacency.get(statement.rightId)!.add(statement.leftId);
  }
  const visited = new Set<string>();
  let components = 0;
  for (const person of adjacency.keys()) {
    if (visited.has(person)) continue;
    components += 1;
    const stack = [person];
    visited.add(person);
    while (stack.length > 0) {
      const current = stack.pop()!;
      for (const neighbour of adjacency.get(current) ?? []) {
        if (visited.has(neighbour)) continue;
        visited.add(neighbour);
        stack.push(neighbour);
      }
    }
  }
  return components;
}

function relationName(question: GeneratedBlrCp007EditorialV4Question, token: string): string {
  const relationId = question.codeKey.find((entry) => entry.token === token)?.relationId;
  assert(relationId, `${question.itemId}: missing code meaning for ${token}`);
  return relationId.toLocaleLowerCase("en-IN").replaceAll("_", "-");
}

function changedPositions(
  correct: GeneratedBlrCp007EditorialV4Question["completedStatements"],
  candidate: GeneratedBlrCp007EditorialV4Question["completedStatements"],
): number[] {
  const changed: number[] = [];
  for (let index = 0; index < correct.length; index += 1) {
    const left = correct[index]!;
    const right = candidate[index]!;
    if (left.leftId !== right.leftId || left.rightId !== right.rightId || left.token !== right.token) changed.push(index);
  }
  return changed;
}

const bank = generateBlrCp007EditorialV4Wave3Bank();
const telemetry = buildBlrCp007EditorialV4Wave3Telemetry(bank);
const answerPositions = [0, 1, 2, 3].map((index) =>
  bank.filter((question) => question.correctIndex === index).length,
);
const ql034 = bank.filter((question) => question.qlId === "BLR-QL-034");
const ql034AnswerCounts = Object.fromEntries(["P", "Q", "R", "S"].map((candidate) => [
  candidate,
  ql034.filter((question) => question.answer === candidate).length,
]));

assert.equal(BLR_CP007_V4_WAVE3_SELF_REVIEW_AUTHORITY, "BLR_CP007_V4_SELF_REVIEW_REMEDIATION");
assert.equal(bank.length, 168);
assert.deepEqual(telemetry.qlCounts, {
  "BLR-QL-031": 48,
  "BLR-QL-032": 32,
  "BLR-QL-033": 24,
  "BLR-QL-034": 32,
  "BLR-QL-035": 32,
});
assert.deepEqual(answerPositions, [42, 42, 42, 42]);
assert.equal(telemetry.releaseCandidateCount, 136);
assert.equal(telemetry.foundationPracticeCount, 32);
assert.equal(telemetry.remediationHoldCount, 0);
assert.equal(telemetry.ql032BlankMeaningMismatchCount, 0);
assert.equal(telemetry.learnerTokenWordOccurrences, 0);
assert.equal(telemetry.codePersonCollisionCount, 0);
assert.equal(telemetry.ql031SinglePositionDerivedDistractorCount, 0);
assert.equal(telemetry.ql033FixedBlankOptionCount, 0);
assert.equal(telemetry.ql034DistinctDecisiveStructureCount, 18);
assert.equal(telemetry.ql034BroadTargetCount, 0);
assert.equal(telemetry.directValidityEasyCount, 16);
assert.deepEqual(ql034AnswerCounts, { P: 8, Q: 8, R: 8, S: 8 });

const itemIds = new Set<string>();
const stems = new Set<string>();
const fingerprints = new Set<string>();
for (const question of bank) {
  assert.equal(question.keyStyle, "SYMBOL");
  assert(question.codeKey.every((entry) => !/^[A-Z]$/.test(entry.token)));
  assert(!itemIds.has(question.itemId));
  itemIds.add(question.itemId);
  assert(!stems.has(question.stem), `${question.itemId}: duplicate stem`);
  stems.add(question.stem);
  assert(!fingerprints.has(question.metadata.v4EditorialFingerprint), `${question.itemId}: duplicate final fingerprint`);
  fingerprints.add(question.metadata.v4EditorialFingerprint);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.text)).size, 4);
  assert.equal(question.options.filter((option) => option.isCorrectAnswerForTask).length, 1);
  assert.equal(question.options[question.correctIndex]!.text, question.answer);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.questionBankEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.deepEqual(question.metadata.activeEditorialBlockers, ["HUMAN_EDITORIAL_APPROVAL_PENDING"]);
  assert(!/\btoken(?:s)?\b/i.test(JSON.stringify({
    sharedPrompt: question.sharedPrompt,
    stem: question.stem,
    options: question.options.map((option) => ({
      text: option.text,
      explanation: option.studentExplanation,
    })),
    explanation: {
      steps: question.explanation.steps,
      conclusion: question.explanation.conclusion,
      shortcut: question.explanation.shortcut,
      commonTrap: question.explanation.commonTrap,
      optionAnalysis: question.explanation.optionAnalysis.map((analysis) => analysis.explanation),
      familySummary: question.explanation.familyTree.accessibleSummary,
      familyAscii: question.explanation.familyTree.asciiFallback,
    },
  })));
  const people = new Set(question.completedStatements.flatMap((statement) => [statement.leftId, statement.rightId]));
  for (const entry of question.codeKey) assert(!people.has(entry.token));
  assert.equal(question.explanation.optionAnalysis.length, 4);
  question.options.forEach((option, index) => {
    assert.equal(question.explanation.optionAnalysis[index]!.optionText, option.text);
    assert.equal(question.explanation.optionAnalysis[index]!.explanation, option.studentExplanation);
  });

  if (question.metadata.disposition === "FOUNDATION_PRACTICE") {
    assert.equal(question.metadata.difficulty, "EASY");
    assert.equal(question.metadata.recommendedUse, "GUIDED_PRACTICE");
  } else if (question.metadata.difficulty === "HARD") {
    assert.equal(question.metadata.recommendedUse, "ADVANCED_PRACTICE");
  } else {
    assert.equal(question.metadata.recommendedUse, "STANDARD_MOCK");
  }

  if (question.qlId === "BLR-QL-031" && question.query.kind === "SELECT_EXPRESSION") {
    const correct = question.options[question.correctIndex]!.completedStatements;
    if (!question.sourcePrototypeId.includes("SELECT-DIRECT")) {
      const wrong = question.options.filter((option) => !option.isCorrectAnswerForTask);
      const covered = new Set(wrong.flatMap((option) => changedPositions(correct, option.completedStatements)));
      assert(covered.size >= 2, `${question.itemId}: distractors vary only one statement position`);
    }
  }

  if (question.qlId === "BLR-QL-032" && question.query.kind === "MISSING_TOKEN") {
    const correct = question.options[question.correctIndex]!;
    const directRelation = relationName(question, correct.text);
    assert(question.explanation.conclusion.toLocaleLowerCase("en-IN").includes(directRelation));
    assert.equal(correct.targetRelationSatisfied, true, `${question.itemId}: correct symbol does not establish the exact target`);
    if (question.sourcePrototypeId.includes("MISSING-TOKEN-REVERSE") &&
      ["FATHER", "MOTHER", "SON", "DAUGHTER"].includes(question.query.target.relationId)) {
      assert(question.completedStatements.length >= 2, `${question.itemId}: reverse exact relation lacks gender evidence`);
    }
  }

  if (question.qlId === "BLR-QL-033" && question.query.kind === "MISSING_TOKEN_PAIR") {
    const pairs = question.options.map((option) => option.text.split(", "));
    assert(new Set(pairs.map((pair) => pair[0])).size > 1);
    assert(new Set(pairs.map((pair) => pair[1])).size > 1);
    const correct = pairs[question.correctIndex]!;
    assert(pairs.some((pair, index) => index !== question.correctIndex && pair[0] !== correct[0] && pair[1] !== correct[1]));
  }

  if (question.qlId === "BLR-QL-034") {
    assert.equal(question.metadata.candidateNetworkComponentCount, 1);
    assert.equal(question.options.every((option) => option.graphValidity === "VALID"), true);
    assert.equal(question.options.every((option) => componentCount(option.completedStatements) === 1), true);
    assert(!["UNCLE_OR_AUNT", "NEPHEW_OR_NIECE"].includes(question.reviewProof.targetRelation ?? ""));
    assert(question.explanation.steps.length >= 2);
  }

  if (question.qlId === "BLR-QL-035" && question.sourcePrototypeId.includes("DIRECT")) {
    assert.equal(question.metadata.difficulty, "EASY");
  }
}

assert.equal(itemIds.size, 168);
assert.equal(stems.size, 168);
assert.equal(fingerprints.size, 168);

console.log(JSON.stringify({
  ...telemetry,
  answerPositions,
  ql034AnswerCounts,
  uniqueStemCount: stems.size,
  uniqueFingerprintCount: fingerprints.size,
  verdict: "BLR-CP-007 V4 WAVE 3 SELF-REVIEW REMEDIATION PASSED; HUMAN APPROVAL REQUIRED",
}, null, 2));
