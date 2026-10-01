import assert from "node:assert/strict";

import {
  generateDsfCp020NumberSystemBatch,
  generateDsfCp020NumberSystemQuestion,
} from "./number-system-three-statement-batch-v1.ts";
import {
  DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS,
} from "../DSF-CP-015/three-statement-answer-profile.ts";

const first = generateDsfCp020NumberSystemBatch("cp020-breadth-audit", 120);
const replay = generateDsfCp020NumberSystemBatch("cp020-breadth-audit", 120);

assert.equal(first.length, 50, "CP020 batch is intentionally capped at 50 per request");
assert.deepEqual(
  first.map((q) => [q.generationIdentity, q.semanticKey, q.correctIndex]),
  replay.map((q) => [q.generationIdentity, q.semanticKey, q.correctIndex]),
  "CP020 deterministic replay changed",
);

const identities = new Set<string>();
const semanticKeys = new Set<string>();
const templates = new Set<string>();
const correctPositions = new Set<number>();

for (const question of first) {
  assert.equal(question.packageId, "DSF-001");
  assert.equal(question.checkpointId, "DSF-CP-020");
  assert.equal(question.qlId, "DSF-QL-002");
  assert.equal(question.statementCount, 3);
  assert.equal(question.language, "en");
  assert.equal(question.locale, "en-IN");
  assert.equal(question.sourceChapterId, "NUM-001");
  assert.equal(question.sourceCapability, "NUM-001/foundation/divisibility");
  assert.equal(question.taskContract, "THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS");
  assert.equal(question.answerSemantic, "MINIMAL_SUFFICIENT_STATEMENT_SUBSET");
  assert.equal(question.statements.length, 3);
  assert.deepEqual(question.statements.map((s:any) => s.id), ["I", "II", "III"]);
  assert.equal(new Set(question.statements.map((s:any) => s.statementRuleId)).size, 3);
  assert.equal(question.options.length, 5);
  assert.equal(question.options.filter((o:any) => o.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.semanticKey, question.semanticKey);
  assert.equal((DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS as readonly string[]).includes(question.semanticKey), true);
  assert.equal(question.proof.subsetEvaluations.length, 7);
  assert.equal(question.proof.allThreeWorldCount > 0, true, "all three statements must be jointly consistent");
  assert.equal(question.proof.semanticKey, question.semanticKey);
  assert.equal(question.proof.minimalSufficientSets.length === 0, question.semanticKey === "NONE");
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.mockTestEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.lifecycle.automaticStudentPublication, false);
  assert.ok(question.explanation.length >= 80);
  assert.doesNotMatch(question.explanation, /\[object Object\]/);

  assert.equal(identities.has(question.generationIdentity), false, "duplicate CP020 generation identity");
  identities.add(question.generationIdentity);
  semanticKeys.add(question.semanticKey);
  templates.add(question.problemTemplate);
  correctPositions.add(question.correctIndex);
}

assert.ok(semanticKeys.size >= 5, `expected at least 5 realized QL002 semantic states, got ${semanticKeys.size}`);
assert.ok(templates.size >= 4, `expected at least 4 Number System templates, got ${templates.size}`);
assert.ok(correctPositions.size >= 4, `expected correct answer rotation across at least 4 positions, got ${correctPositions.size}`);

const probeSeeds = Array.from({ length: 100 }, (_, index) => generateDsfCp020NumberSystemQuestion(`cp020-probe:${index}`));
const probeSemantics = new Set(probeSeeds.map((q) => q.semanticKey));
const probeTemplates = new Set(probeSeeds.map((q) => q.problemTemplate));
assert.ok(probeSemantics.size >= semanticKeys.size);
assert.ok(probeTemplates.size >= 6);

console.log(JSON.stringify({
  status: "PASS_DSF_CP020_QL002_NUMBER_SYSTEM_BATCH_V1",
  auditedBatch: first.length,
  probeQuestions: probeSeeds.length,
  semanticStatesInAuditedBatch: [...semanticKeys].sort(),
  semanticStateCountInAuditedBatch: semanticKeys.size,
  semanticStatesAcrossProbe: [...probeSemantics].sort(),
  semanticStateCountAcrossProbe: probeSemantics.size,
  templatesInAuditedBatch: [...templates].sort(),
  templatesAcrossProbe: [...probeTemplates].sort(),
  correctPositions: [...correctPositions].sort(),
  lifecycle: "UNDISCOVERABLE_REVIEW_CANDIDATE",
}, null, 2));
