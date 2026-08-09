import { strict as assert } from "node:assert";
import {
  BLR_CP007_V4_QL034_COHERENT_NETWORK_AUTHORITY,
  buildBlrCp007EditorialV4Wave2Telemetry,
  generateBlrCp007EditorialV4Wave2Bank,
} from "./cp007-editorial-v4-wave2";
import type { GeneratedBlrCp007EditorialV4Question } from "./cp007-editorial-v4-model";

function componentCount(
  statements: GeneratedBlrCp007EditorialV4Question["completedStatements"],
): number {
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

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

const bank = generateBlrCp007EditorialV4Wave2Bank();
const telemetry = buildBlrCp007EditorialV4Wave2Telemetry(bank);
const ql034 = bank.filter((question) => question.qlId === "BLR-QL-034");

assert.equal(BLR_CP007_V4_QL034_COHERENT_NETWORK_AUTHORITY, "BLR_CP007_V4_QL034_COHERENT_NETWORK_REMODEL");
assert.equal(bank.length, 168);
assert.equal(ql034.length, 32);
assert.equal(telemetry.releaseCandidateCount, 136);
assert.equal(telemetry.foundationPracticeCount, 32);
assert.equal(telemetry.remediationHoldCount, 0);
assert.equal(telemetry.ql034DisconnectedNetworkCount, 0);
assert.equal(telemetry.neutralWordCodeQuestions, 0);
assert.equal(telemetry.colourTokenOccurrences, 0);
assert.equal(telemetry.duplicateStemCount, 0);
assert.equal(telemetry.repeatedStepConclusionCount, 0);

const scenarioFingerprints = new Set<string>();
const answerCounts = { P: 0, Q: 0, R: 0, S: 0 };
const prototypeCounts = new Map<string, number>();
let maximumOptionExplanationWords = 0;

for (const question of ql034) {
  assert.equal(question.metadata.candidateNetworkComponentCount, 1);
  assert.equal(question.metadata.disposition, "RELEASE_CANDIDATE");
  assert(["STANDARD_MOCK", "ADVANCED_PRACTICE"].includes(question.metadata.recommendedUse));
  assert.deepEqual(question.metadata.activeEditorialBlockers, ["HUMAN_EDITORIAL_APPROVAL_PENDING"]);
  assert.equal(question.v4ReviewProof.disposition, "RELEASE_CANDIDATE");
  assert.equal(question.v4ReviewProof.candidateNetworkComponentCount, 1);
  assert.equal(question.options.length, 4);
  assert.equal(question.options.filter((option) => option.isCorrectAnswerForTask).length, 1);
  assert.equal(question.options[question.correctIndex]!.text, question.answer);
  assert.equal(new Set(question.options.map((option) => option.text)).size, 4);
  assert.equal(question.query.kind, "MISSING_PERSON");
  assert(question.topologyId.includes("CONNECTED"));
  assert(!scenarioFingerprints.has(question.metadata.semanticScenarioFingerprint));
  scenarioFingerprints.add(question.metadata.semanticScenarioFingerprint);
  prototypeCounts.set(question.sourcePrototypeId, (prototypeCounts.get(question.sourcePrototypeId) ?? 0) + 1);

  assert(!/\bto make\s+[A-Z]+\s+is\b/i.test(question.stem));
  assert(!/\binferred parent\b/i.test(JSON.stringify(question.explanation)));
  assert(question.explanation.steps.length >= 2);
  assert(question.explanation.conclusion.includes(`${question.answer} must replace ?`));
  assert(question.explanation.conclusion.includes("with this substitution"));
  assert(!question.explanation.steps.includes(question.explanation.conclusion));

  if (question.query.kind === "MISSING_PERSON") {
    const clueStatements = question.query.completeStatements.filter((_, index) => index !== question.query.blankStatementIndex);
    const cluePeople = new Set(clueStatements.flatMap((statement) => [statement.leftId, statement.rightId]));
    for (const candidate of ["P", "Q", "R", "S"]) assert(cluePeople.has(candidate));
  }

  question.options.forEach((option, index) => {
    assert.equal(option.graphValidity, "VALID");
    assert.equal(componentCount(option.completedStatements), 1);
    assert.equal(question.explanation.optionAnalysis[index]!.explanation, option.studentExplanation);
    maximumOptionExplanationWords = Math.max(maximumOptionExplanationWords, wordCount(option.studentExplanation));
    assert(wordCount(option.studentExplanation) <= 30);
  });

  answerCounts[question.answer as keyof typeof answerCounts] += 1;
}

assert.equal(scenarioFingerprints.size, 32);
assert.deepEqual(answerCounts, { P: 8, Q: 8, R: 8, S: 8 });
assert.equal(prototypeCounts.size, 4);
for (const count of prototypeCounts.values()) assert.equal(count, 8);

console.log(JSON.stringify({
  ...telemetry,
  ql034Questions: ql034.length,
  ql034ConnectedNetworks: ql034.filter((question) => question.metadata.candidateNetworkComponentCount === 1).length,
  ql034AnswerCounts: answerCounts,
  maximumOptionExplanationWords,
  verdict: "BLR-CP-007 V4 WAVE 2 QL-034 COHERENT NETWORK REMODEL PASSED; HUMAN APPROVAL REQUIRED",
}, null, 2));
