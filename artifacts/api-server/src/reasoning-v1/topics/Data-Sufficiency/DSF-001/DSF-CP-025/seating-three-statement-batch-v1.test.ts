import assert from "node:assert/strict";
import {
  DSF_CP025_SEATING_SOLVE_MODES,
  generateDsfCp025SeatingBatch,
  generateDsfCp025SeatingQuestion,
} from "./seating-three-statement-batch-v1.ts";
import { DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS } from "../DSF-CP-015/three-statement-answer-profile.ts";

const first=generateDsfCp025SeatingBatch("cp025-seating-audit",24);
const replay=generateDsfCp025SeatingBatch("cp025-seating-audit",24);
assert.deepEqual(first.map(q=>[q.generationIdentity,q.semanticKey,q.correctIndex]),replay.map(q=>[q.generationIdentity,q.semanticKey,q.correctIndex]));

const ids=new Set<string>(),semantics=new Set<string>(),modes=new Set<string>(),contexts=new Set<string>(),facings=new Set<string>(),positions=new Set<number>();
for(const q of first){
 assert.equal(q.packageId,"DSF-001");assert.equal(q.checkpointId,"DSF-CP-025");assert.equal(q.qlId,"DSF-QL-002");assert.equal(q.domainFamily,"REASONING");assert.equal(q.sourceChapterId,"SEA-001");assert.equal(q.solverOracleParity,true);
 assert.equal(q.statementCount,3);assert.equal(q.statements.length,3);assert.deepEqual(q.statements.map((s:any)=>s.id),["I","II","III"]);assert.equal(new Set(q.statements.map((s:any)=>s.statementRuleId)).size,3);
 assert.equal(q.options.length,5);assert.equal(q.options.filter((o:any)=>o.isCorrect).length,1);assert.equal(q.options[q.correctIndex]?.semanticKey,q.semanticKey);
 assert.equal((DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS as readonly string[]).includes(q.semanticKey),true);
 assert.equal(q.proof.subsetEvaluations.length,7);assert.equal(q.proof.productionOracleParity,true);assert.ok(q.proof.allThreeWorldCount>0);
 assert.equal(q.lifecycle.questionStudioDiscoverable,false);assert.equal(q.lifecycle.questionBankWritable,false);assert.equal(q.lifecycle.testEligible,false);assert.equal(q.lifecycle.mockTestEligible,false);assert.equal(q.lifecycle.publiclyPublishable,false);assert.equal(q.lifecycle.automaticStudentPublication,false);
 assert.equal(ids.has(q.generationIdentity),false);ids.add(q.generationIdentity);semantics.add(q.semanticKey);modes.add(q.solveModeId);contexts.add(q.contextId);facings.add(q.facing);positions.add(q.correctIndex);
}
assert.equal(modes.size,DSF_CP025_SEATING_SOLVE_MODES.length);assert.equal(facings.size,2);assert.ok(contexts.size>=4);assert.ok(semantics.size>=6);assert.ok(positions.size>=4);

const probe=Array.from({length:48},(_,i)=>generateDsfCp025SeatingQuestion(`cp025-seating-probe:${i}`));
const probeSemantics=new Set(probe.map(q=>q.semanticKey)),probeModes=new Set(probe.map(q=>q.solveModeId));
assert.equal(probeModes.size,DSF_CP025_SEATING_SOLVE_MODES.length);assert.ok(probeSemantics.size>=semantics.size);

console.log(JSON.stringify({
 status:"PASS_DSF_CP025_QL002_SEATING_BATCH_V1",
 auditedBatch:first.length,probeQuestions:probe.length,
 semanticStates:[...semantics].sort(),semanticStateCount:semantics.size,
 probeSemanticStates:[...probeSemantics].sort(),probeSemanticStateCount:probeSemantics.size,
 solveModes:[...modes].sort(),contexts:[...contexts].sort(),facings:[...facings].sort(),answerPositions:[...positions].sort(),
 lifecycle:"UNDISCOVERABLE_REVIEW_CANDIDATE",
},null,2));
