import assert from "node:assert/strict";
import {
  DSF_CP021_RANKING_SOLVE_MODES,
  generateDsfCp021RankingBatch,
  generateDsfCp021RankingQuestion,
} from "./ranking-three-statement-batch-v1.ts";
import { DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS } from "../DSF-CP-015/three-statement-answer-profile.ts";

const first = generateDsfCp021RankingBatch("cp021-ranking-audit", 40);
const replay = generateDsfCp021RankingBatch("cp021-ranking-audit", 40);

assert.equal(first.length, 40);
assert.deepEqual(
  first.map(q => [q.generationIdentity,q.semanticKey,q.correctIndex]),
  replay.map(q => [q.generationIdentity,q.semanticKey,q.correctIndex]),
  "CP021 Ranking deterministic replay changed",
);

const identities=new Set<string>();
const semantics=new Set<string>();
const modes=new Set<string>();
const contexts=new Set<string>();
const positions=new Set<number>();

for(const q of first){
  assert.equal(q.packageId,"DSF-001");
  assert.equal(q.checkpointId,"DSF-CP-021");
  assert.equal(q.qlId,"DSF-QL-002");
  assert.equal(q.domainFamily,"REASONING");
  assert.equal(q.sourceChapterId,"RNK-001");
  assert.equal(q.statementCount,3);
  assert.equal(q.statements.length,3);
  assert.deepEqual(q.statements.map((s:any)=>s.id),["I","II","III"]);
  assert.equal(new Set(q.statements.map((s:any)=>s.statementRuleId)).size,3);
  assert.equal(q.options.length,5);
  assert.equal(q.options.filter((o:any)=>o.isCorrect).length,1);
  assert.equal(q.options[q.correctIndex]?.semanticKey,q.semanticKey);
  assert.equal((DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS as readonly string[]).includes(q.semanticKey),true);
  assert.equal(q.proof.subsetEvaluations.length,7);
  assert.equal(q.proof.allThreeWorldCount>0,true);
  assert.equal(q.proof.semanticKey,q.semanticKey);
  assert.ok(q.stem.length>=20);
  assert.ok(q.explanation.length>=80);
  assert.equal(q.lifecycle.questionStudioDiscoverable,false);
  assert.equal(q.lifecycle.questionBankWritable,false);
  assert.equal(q.lifecycle.testEligible,false);
  assert.equal(q.lifecycle.mockTestEligible,false);
  assert.equal(q.lifecycle.publiclyPublishable,false);
  assert.equal(q.lifecycle.automaticStudentPublication,false);
  assert.equal(identities.has(q.generationIdentity),false);
  identities.add(q.generationIdentity);
  semantics.add(q.semanticKey);
  modes.add(q.solveModeId);
  contexts.add(q.contextId);
  positions.add(q.correctIndex);
}

assert.equal(modes.size,DSF_CP021_RANKING_SOLVE_MODES.length);
assert.ok(contexts.size>=4,`expected broad ranking contexts, got ${contexts.size}`);
assert.ok(semantics.size>=7,`expected at least 7 QL002 semantic states, got ${semantics.size}`);
assert.ok(positions.size>=4,`expected answer rotation over >=4 positions, got ${positions.size}`);

const probe=Array.from({length:80},(_,i)=>generateDsfCp021RankingQuestion(`cp021-ranking-probe:${i}`));
const probeSemantics=new Set(probe.map(q=>q.semanticKey));
const probeModes=new Set(probe.map(q=>q.solveModeId));
assert.equal(probeModes.size,DSF_CP021_RANKING_SOLVE_MODES.length);
assert.ok(probeSemantics.size>=semantics.size);

console.log(JSON.stringify({
  status:"PASS_DSF_CP021_QL002_RANKING_BATCH_V1",
  auditedBatch:first.length,
  probeQuestions:probe.length,
  semanticStates:[...semantics].sort(),
  semanticStateCount:semantics.size,
  probeSemanticStates:[...probeSemantics].sort(),
  probeSemanticStateCount:probeSemantics.size,
  solveModes:[...modes].sort(),
  contexts:[...contexts].sort(),
  answerPositions:[...positions].sort(),
  lifecycle:"UNDISCOVERABLE_REVIEW_CANDIDATE",
},null,2));
