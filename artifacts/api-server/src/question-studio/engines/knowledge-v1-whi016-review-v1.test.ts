import { strict as assert } from "node:assert";
import questions from "../../knowledge-v1/world-history-cp016-en-v1.json";
import authority from "../../../../review/world-history/WHI-001-CP016-CANONICAL-FACTS-Q001-060-V1.json";
const facts = new Map(authority.facts.map((f) => [f.factId, f]));
const sourceIds = new Set(authority.sourceRegister.map((s) => s.sourceId));
assert.equal(questions.length, 60);
assert.equal(authority.facts.length, 60);
assert.equal(authority.originQuestionCrosswalk.length, 60);
assert.deepEqual(["easy", "medium", "hard"].map((d) => questions.filter((q) => q.difficulty === d).length), [18, 30, 12]);
assert.deepEqual(["A", "B", "C", "D"].map((k) => questions.filter((q) => q.correctOption === k).length), [15, 15, 15, 15]);
assert.equal(new Set(questions.map((q) => q.questionId)).size, 60);
assert.equal(new Set(questions.map((q) => q.stem.toLowerCase().trim())).size, 60);
assert.equal(new Set(questions.map((q) => q.questionFamily)).size, 10);
const origins = new Set();
for (let i=0; i<questions.length; i++) {
 const q=questions[i], id="WHI-CP016-Q"+String(i+1).padStart(3,"0");
 assert.equal(q.questionId,id); assert.equal(q.englishQuestionId,id);
 assert.equal(q.checkpointId,"WHI-001-CP016"); assert.equal(q.factId,id.replace("-Q","-F"));
 assert.equal(q.language,"en"); assert.equal(q.reviewOnly,true); assert.equal(q.runtimeRegistered,false);
 assert.equal(q.options.length,4); assert.deepEqual(q.options.map(o=>o.key),["A","B","C","D"]);
 assert.equal(new Set(q.options.map(o=>o.text)).size,4);
 assert.ok(q.options.some(o=>o.key===q.correctOption));
 assert.ok(q.sourceIds.length && q.sourceIds.every(s=>sourceIds.has(s)));
 assert.ok(q.originQuestionId && q.originFactId && q.originCheckpointId);
 assert.deepEqual(q.sourceIds,facts.get(q.factId).sourceIds); origins.add(q.originCheckpointId);
}
assert.equal(origins.size,15);
for (const family of new Set(questions.map(q=>q.questionFamily))) assert.equal(questions.filter(q=>q.questionFamily===family).length,6);
console.log("[WHI-016] PASS 60 reused questions, origin/fact/source crosswalk, family/difficulty/key contracts and review-only state");
