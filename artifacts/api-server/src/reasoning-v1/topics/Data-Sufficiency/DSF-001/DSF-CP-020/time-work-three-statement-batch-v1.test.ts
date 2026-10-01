import assert from "node:assert/strict";

import {
  generateDsfCp020TimeWorkBatch,
  generateDsfCp020TimeWorkQuestion,
} from "./time-work-three-statement-batch-v1.ts";
import { DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS } from "../DSF-CP-015/three-statement-answer-profile.ts";

const first = generateDsfCp020TimeWorkBatch("cp020-tmw-audit", 50);
const replay = generateDsfCp020TimeWorkBatch("cp020-tmw-audit", 50);

assert.deepEqual(
  first.map((q) => [q.generationIdentity, q.semanticKey, q.correctIndex]),
  replay.map((q) => [q.generationIdentity, q.semanticKey, q.correctIndex]),
);

const identities = new Set<string>();
const semantics = new Set<string>();
const modes = new Set<string>();
const contexts = new Set<string>();
const correctPositions = new Set<number>();

for (const question of first) {
  assert.equal(question.packageId, "DSF-001");
  assert.equal(question.checkpointId, "DSF-CP-020");
  assert.equal(question.qlId, "DSF-QL-002");
  assert.equal(question.statementCount, 3);
  assert.equal(question.sourceChapterId, "TMW-001");
  assert.equal(question.sourceCapability, "TMW-001/foundation/cp001-solver");
  assert.equal(question.statements.length, 3);
  assert.deepEqual(question.statements.map((s) => s.id), ["I", "II", "III"]);
  assert.equal(new Set(question.statements.map((s) => s.statementRuleId)).size, 3);
  assert.equal(question.options.length, 5);
  assert.equal(question.options.filter((o) => o.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.semanticKey, question.semanticKey);
  assert.equal((DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS as readonly string[]).includes(question.semanticKey), true);
  assert.equal(question.proof.subsetEvaluations.length, 7);
  assert.equal(question.proof.allThreeWorldCount > 0, true);
  assert.equal(question.proof.semanticKey, question.semanticKey);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.mockTestEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.lifecycle.automaticStudentPublication, false);
  assert.ok(question.stem.length >= 30);
  assert.ok(question.explanation.length >= 80);

  assert.equal(identities.has(question.generationIdentity), false);
  identities.add(question.generationIdentity);
  semantics.add(question.semanticKey);
  modes.add(question.solveModeId);
  contexts.add(question.contextId);
  correctPositions.add(question.correctIndex);
}

assert.ok(semantics.size >= 5, `expected >=5 TMW semantic states, got ${semantics.size}`);
assert.equal(modes.size, 3, `expected all 3 TMW target modes, got ${[...modes].join(",")}`);
assert.ok(contexts.size >= 4, `expected >=4 TMW contexts, got ${contexts.size}`);
assert.ok(correctPositions.size >= 4, `expected answer rotation across >=4 positions, got ${correctPositions.size}`);

const probes = Array.from({ length: 100 }, (_, index) =>
  generateDsfCp020TimeWorkQuestion(`cp020-tmw-probe:${index}`)
);
const probeSemantics = new Set(probes.map((q) => q.semanticKey));
const probeModes = new Set(probes.map((q) => q.solveModeId));
assert.ok(probeSemantics.size >= semantics.size);
assert.equal(probeModes.size, 3);

console.log(JSON.stringify({
  status: "PASS_DSF_CP020_QL002_TIME_WORK_BATCH_V1",
  auditedBatch: first.length,
  probeQuestions: probes.length,
  semanticStatesInAuditedBatch: [...semantics].sort(),
  semanticStateCountInAuditedBatch: semantics.size,
  semanticStatesAcrossProbe: [...probeSemantics].sort(),
  semanticStateCountAcrossProbe: probeSemantics.size,
  solveModes: [...modes].sort(),
  contexts: [...contexts].sort(),
  correctPositions: [...correctPositions].sort(),
  lifecycle: "UNDISCOVERABLE_REVIEW_CANDIDATE",
}, null, 2));
