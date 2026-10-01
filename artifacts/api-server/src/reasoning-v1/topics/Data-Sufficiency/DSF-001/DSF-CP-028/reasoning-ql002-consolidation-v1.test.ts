import assert from "node:assert/strict";
import {
  DSF_CP028_REASONING_QL002_DOMAINS,
  DSF_CP028_REASONING_QL002_STATUS,
} from "./reasoning-ql002-consolidation-v1.ts";
import { DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS } from "../DSF-CP-015/three-statement-answer-profile.ts";

assert.equal(DSF_CP028_REASONING_QL002_DOMAINS.length, 7);
assert.equal(DSF_CP028_REASONING_QL002_STATUS.frozenSemanticStateCount, 19);
assert.equal(DSF_CP028_REASONING_QL002_STATUS.lifecycle.questionStudioDiscoverable, false);

const semanticUnion = new Set<string>();
const allIds = new Set<string>();
const domainCounts = new Map<string, number>();

for (const domain of DSF_CP028_REASONING_QL002_DOMAINS) {
  const count = domain.domainId === "DIRECTION" ? 40
    : domain.domainId === "CODING" ? 30
    : domain.domainId === "SEATING" ? 8
    : 12;

  for (let index = 0; index < count; index += 1) {
    const q = domain.generator(`cp028:${domain.domainId}:${index}`) as any;
    assert.equal(q.packageId, "DSF-001");
    assert.equal(q.qlId, "DSF-QL-002");
    assert.equal(q.domainFamily, "REASONING");
    assert.equal(q.sourceChapterId, domain.sourceChapterId);
    assert.equal(q.checkpointId, domain.checkpointId);
    assert.equal(q.statementCount, 3);
    assert.equal(q.statements.length, 3);
    assert.deepEqual(q.statements.map((s:any) => s.id), ["I", "II", "III"]);
    assert.equal(new Set(q.statements.map((s:any) => s.statementRuleId)).size, 3);
    assert.equal(q.options.length, 5);
    assert.equal(q.options.filter((o:any) => o.isCorrect).length, 1);
    assert.equal(q.options[q.correctIndex]?.semanticKey, q.semanticKey);
    assert.equal((DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS as readonly string[]).includes(q.semanticKey), true);
    assert.equal(q.proof.subsetEvaluations.length, 7);
    assert.equal(q.proof.semanticKey, q.semanticKey);
    assert.ok(q.proof.allThreeWorldCount > 0);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.mockTestEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);
    assert.equal(q.lifecycle.automaticStudentPublication, false);
    assert.equal(allIds.has(q.generationIdentity), false, `${domain.domainId}: duplicate generation identity`);
    allIds.add(q.generationIdentity);
    semanticUnion.add(q.semanticKey);
    domainCounts.set(domain.domainId, (domainCounts.get(domain.domainId) ?? 0) + 1);
  }
}

assert.equal(domainCounts.size, 7);
assert.equal(
  semanticUnion.size,
  DSF_CP028_REASONING_QL002_STATUS.frozenSemanticStateCount,
  `reasoning QL002 aggregate must realize all 19 semantic states; got ${semanticUnion.size}`,
);

console.log(JSON.stringify({
  status: "PASS_DSF_CP028_REASONING_QL002_CONSOLIDATION_V1",
  domains: DSF_CP028_REASONING_QL002_DOMAINS.map((d) => d.domainId),
  domainCounts: Object.fromEntries(domainCounts),
  generatedQuestions: allIds.size,
  semanticStates: [...semanticUnion].sort(),
  semanticStateCount: semanticUnion.size,
  frozenSemanticStateCount: DSF_CP028_REASONING_QL002_STATUS.frozenSemanticStateCount,
  lifecycle: "UNDISCOVERABLE_REVIEW_COMPLETE",
}, null, 2));
