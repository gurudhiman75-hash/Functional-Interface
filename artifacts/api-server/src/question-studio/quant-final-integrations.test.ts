import assert from "node:assert/strict";
import { quantV4QuestionStudioAdapter as adapter } from "./engines/quant-v4-adapter";
import { NUMBER_SYSTEM_FINAL_CHECKPOINT_ALLOCATIONS as allocations, formatNumberSystemQlId } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/design/number-system-final-allocation-authority";
import { INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE as interest, generateInt001ChapterAdminQuestionStudioBatch } from "../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/int-001-chapter-question-studio-admin-adapter-v1";
import { ALGEBRA_QUESTION_STUDIO_PATTERNS } from "../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/algebra-question-studio-runtime-v1";
import { generateAlgebraStudioBatchV5 } from "../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/algebra-question-studio-runtime-v5";
import { runNumCp004PermanentPipeline } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-001/NUM-CP-004/permanent/runtime";
const cards = adapter.listPackages();
for (const [id, count, cps] of [["NUM-001",139,6],["NUM-002",114,8],["INT-001",133,10],["ALGEBRA",43,14]] as const) {
  const matches = cards.filter(card => card.packageId === id);
  assert.equal(matches.length, 1, id);
  assert.equal(matches[0].metadata?.permanentQlCount, count, id);
  assert.equal(matches[0].cpIds.length, cps, id);
  assert.equal(new Set(matches[0].metadata?.permanentQlIds as string[]).size, count);
  assert.deepEqual(matches[0].supportedLanguages, ["en", "hi", "pa"]);
  assert.equal(matches[0].lifecycleStage, id === "ALGEBRA" ? "BANK_ONLY" : "REVIEW_ONLY");
  assert.equal(matches[0].questionBankWritable, id === "ALGEBRA");
}
function verify(q: Record<string, any>, qlId: string, language: string, bank = false) {
  assert.equal(q.qlId ?? q.permanentQlId, qlId);
  assert.equal(q.language, language);
  assert.ok(q.options.length >= 4);
  assert.equal(new Set(q.options).size, q.options.length, `${qlId}: duplicate options`);
  assert.equal(q.options[q.correctIndex], q.answer, `${qlId}: keyed answer`);
  assert.ok(q.stem?.length > 5);
  assert.ok(q.explanation?.length > 10);
  assert.equal(q.questionBankWritable, bank);
  for (const gate of ["testEligible", "mockTestEligible", "publiclyPublishable", "automaticStudentPublication"]) assert.equal(q[gate], false);
  if (language !== "en") assert.match(q.stem + q.explanation, language === "hi" ? /\p{Script=Devanagari}/u : /\p{Script=Gurmukhi}/u);
}
let surfaces = 0;
const numberSystemIdentities = new Set<string>();
const numberSystemStates = new Map<string, string>();
for (const allocation of allocations) for (let n = allocation.firstQlNumber; n <= allocation.lastQlNumber; n++) for (const language of ["en", "hi", "pa"] as const) {
  const qlId = formatNumberSystemQlId(n);
  const request = {packageId: allocation.packageId, canonicalProblemId: allocation.cpId, questionLanguageId: qlId, language, seed: `num-unified:${qlId}`, count: 1};
  const result = await adapter.generate(request);
  verify(result.questions[0], qlId, language);
  assert.ok(!numberSystemIdentities.has(String(result.questions[0].questionId)), "Number System review identity collision");
  numberSystemIdentities.add(String(result.questions[0].questionId));
  const sourceState = JSON.stringify(result.questions[0].sourceMathematicalState);
  assert.ok(sourceState, `${qlId}: missing canonical source state`);
  if (language === "en") numberSystemStates.set(qlId, sourceState);
  else assert.equal(sourceState, numberSystemStates.get(qlId), `${qlId}: native mathematical state drift`);
  assert.equal(result.questions[0].canonicalProblemId, allocation.cpId);
  assert.deepEqual((await adapter.generate(request)).questions, result.questions);
  assert.doesNotThrow(() => JSON.stringify(result));
  surfaces++;
}
for (const qlId of interest.permanentQlIds) for (const language of ["en", "hi", "pa"] as const) {
  const request = {packageId: "INT-001", questionLanguageId: qlId, language, seed: `int-unified:${qlId}`, count: 1};
  const result = await adapter.generate(request);
  const original = await generateInt001ChapterAdminQuestionStudioBatch(request);
  const q = result.questions[0];
  verify(q, qlId, language);
  assert.deepEqual(q.options, original.questions[0].options);
  assert.equal(q.stem, original.questions[0].stem);
  assert.equal(q.answer, original.questions[0].answer);
  assert.deepEqual((await adapter.generate(request)).questions, result.questions);
  surfaces++;
}
for (const qlId of [...new Set(ALGEBRA_QUESTION_STUDIO_PATTERNS.map(entry => entry.qlId))]) for (const language of ["en", "hi", "pa"] as const) for (const examProfile of ["SSC_CORE", "BANKING_MAINS"] as const) {
  const request = {packageId: "ALGEBRA", questionLanguageId: qlId, language, seed: `alg-unified:${qlId}`, count: 1, examProfile};
  const result = await adapter.generate(request);
  const original = generateAlgebraStudioBatchV5({...request, qlId});
  const q = result.questions[0];
  verify(q, qlId, language, true);
  assert.deepEqual(q.options, original.questions[0].options);
  assert.equal(q.stem, original.questions[0].stem);
  assert.equal(q.options!.length, examProfile === "BANKING_MAINS" ? 5 : 4);
  assert.equal(q.questionBankAcceptanceMode, "BANK_ONLY");
  assert.deepEqual((await adapter.generate(request)).questions, result.questions);
  surfaces++;
}
for (const packageId of ["NUM-001", "NUM-002", "INT-001", "ALGEBRA"]) {
  const result = await adapter.generate({packageId, language: "pa", seed: "batch-review", count: 10});
  assert.equal(result.questions.length, 10);
  assert.ok(result.questions.every(q => q.packageId === packageId));
  for (const count of [0, 51, 1.5]) await assert.rejects(adapter.generate({packageId, count}), {statusCode: 400});
}
for (const request of [
  {packageId: "NUM-001", questionLanguageId: "NUM-QL-253"},
  {packageId: "NUM-002", canonicalProblemId: "NUM-CP-001"},
  {questionLanguageId: "NUM-QL-254"},
  {canonicalProblemId: "NUM-CP-015"},
  {packageId: "INT-001", questionLanguageId: "INT-QL-999"},
  {packageId: "ALGEBRA", questionLanguageId: "ALG-QL-999"},
  {packageId: "ALGEBRA", examProfile: "UNKNOWN"},
  {packageId: "ALGEBRA", canonicalProblemId: "ALG-CP-015"},
]) await assert.rejects(adapter.generate(request), {statusCode: 400});
const alias = await adapter.generate({questionLanguageId: "NUM-QL-098", count: 1, seed: "owner-inference"});
assert.equal(alias.questions[0].packageId, "NUM-002");
const bankingAlias = await adapter.generate({packageId: "ALGEBRA", exam: "IBPS PO Mains", count: 1});
assert.equal(bankingAlias.questions[0].options!.length, 5);
let boundedSourceChecks = 0;
for (let n = 18; n <= 45; n++) for (let seed = 1; seed <= 240; seed++) {
  const q = runNumCp004PermanentPipeline({questionLanguageId: formatNumberSystemQlId(n) as any, seed});
  assert.equal(q.canonicalAnswer, q.verifierAnswer);
  assert.equal(q.options[q.correctIndex].value, q.canonicalAnswer);
  boundedSourceChecks++;
}
console.log(JSON.stringify({status: "PASS", numberSystemQLs:253, interestQLs:133, algebraQLs:43, surfaces, boundedSourceChecks}));
