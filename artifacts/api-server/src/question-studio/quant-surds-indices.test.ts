import assert from "node:assert/strict";
import { quantV4QuestionStudioAdapter as adapter } from "./engines/quant-v4-adapter";
import { generateSriEngineBatch } from "./quant-surds-indices";
import { SRI_PERMANENT_ALLOCATION_V1 } from "../quant-v4/topics/NumberSystem/subtopics/SurdsAndIndices/permanent-allocation-v1";
import { SRI_CHAPTER_MANIFEST } from "../quant-v4/topics/NumberSystem/subtopics/SurdsAndIndices/chapter-manifest";
import { generateSriQuestionStudioBatchV1 } from "../quant-v4/topics/NumberSystem/subtopics/SurdsAndIndices/question-studio-v1";

const cards = adapter.listPackages();
for (const packageId of ["SRI-001", "SRI-002"]) {
  const matches = cards.filter(p => p.packageId === packageId);
  assert.equal(matches.length, 1);
  const card = matches[0]!;
  assert.equal(card.cpIds.length, 6);
  assert.equal(card.metadata?.permanentQlCount, 29);
  assert.equal((card.metadata?.permanentQlIds as string[]).length, 29);
  assert.deepEqual(card.supportedLanguages, ["en", "hi", "pa"]);
  assert.equal(card.lifecycleStage, "REVIEW_ONLY");
  for (const gate of ["questionBankWritable", "testEligible", "mockTestEligible", "publiclyPublishable", "automaticStudentPublication", "productionReleaseAuthorized"] as const) {
    assert.equal(card[gate], false);
  }
}

let surfaces = 0;
for (const entry of SRI_PERMANENT_ALLOCATION_V1) for (let seed = 0; seed < 4; seed++) {
  let answerKey: unknown;
  for (const language of ["en", "hi", "pa"] as const) {
    const request = { packageId: entry.packageId, canonicalProblemId: entry.checkpointId,
      questionLanguageId: entry.qlId, language, seed: `sri-unified:${entry.qlId}:${seed}`, count: 1 };
    const result = await adapter.generate(request);
    const original = await generateSriQuestionStudioBatchV1(request);
    assert.deepEqual(result.questions, original.questions, "Unified delivery changed frozen learner content");
    assert.equal(result.generationContext?.engineId, "quant-v4");
    const q = result.questions[0]!;
    assert.equal(q.qlId, entry.qlId);
    assert.equal(q.canonicalProblemId, entry.checkpointId);
    assert.equal(q.language, language);
    assert.equal(q.options?.length, 4);
    assert.equal(new Set(q.options).size, 4);
    assert.equal(q.options?.[q.correctIndex!], q.answer);
    assert.ok(q.explanation && q.explanation.length > 10);
    assert.doesNotThrow(() => JSON.stringify(result));
    for (const gate of ["questionBankWritable", "testEligible", "mockTestEligible", "publiclyPublishable", "automaticStudentPublication"]) assert.equal(q[gate], false);
    const verification = q.verification as Record<string, boolean>;
    assert.equal(verification.solverVerifierAgree, true);
    assert.equal(verification.domainValid, true);
    const key = (q.canonicalAnswer as {key: string}).key;
    if (language === "en") answerKey = key;
    else {
      assert.equal(key, answerKey);
      assert.match(String(q.text) + q.explanation, language === "hi" ? /\p{Script=Devanagari}/u : /\p{Script=Gurmukhi}/u);
    }
    assert.deepEqual((await adapter.generate(request)).questions, result.questions);
    surfaces++;
  }
}

let batches = 0;
for (const packageId of ["SRI-001", "SRI-002"]) for (const language of ["en", "hi", "pa"] as const) for (const difficulty of ["Easy", "Medium", "Hard"]) {
  const r = await adapter.generate({packageId, language, difficulty, seed: "sri-filter", count: 5});
  assert.equal(r.questions.length, 5);
  assert.ok(r.questions.every(q => q.difficulty === difficulty && q.packageId === packageId && q.language === language));
  batches++;
}
for (let cp = 1; cp <= 12; cp++) {
  const id = `SRI-CP-${String(cp).padStart(3, "0")}`;
  const r = await adapter.generate({canonicalProblemId: id, seed: "cp-routing", count: 1});
  assert.equal(r.questions[0]?.canonicalProblemId, id);
}
const qlOnly = await adapter.generate({questionLanguageId: "SRI-002-QL-029", seed: "ql-only", count: 1});
assert.equal(qlOnly.questions[0]?.packageId, "SRI-002");
const alias = await adapter.generate({topic: "Number System", subtopic: "Surds & Indices", seed: "alias", count: 1});
assert.match(String(alias.questions[0]?.packageId), /^SRI-/);
const balancedBatch = await adapter.generate({questionLanguageId: "SRI-001-QL-001", seed: "balanced-options", count: 12});
assert.deepEqual([0, 1, 2, 3].map(position => balancedBatch.questions.filter(q => q.correctIndex === position).length), [3, 3, 3, 3]);
for (const request of [
  {packageId: "SRI-003"}, {packageId: "SRI-001", canonicalProblemId: "SRI-CP-012"},
  {packageId: "SRI-001", questionLanguageId: "SRI-002-QL-029"},
  {packageId: "SRI-001", questionLanguageId: "SRI-001-QL-999"},
  {packageId: "SRI-001", count: 0}, {packageId: "SRI-001", count: 51},
  {packageId: "SRI-001", count: 1.5}, {packageId: "SRI-001", runtimeMode: "BANK_ONLY"},
]) await assert.rejects(() => adapter.generate(request), e => (e as {statusCode: number}).statusCode === 400);
assert.equal(await generateSriEngineBatch({packageId: "TSD-001"}), null);
assert.equal(SRI_CHAPTER_MANIFEST.permanentQlCount, 58);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.questionBankWritesEnabled, false);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.testEligibilityEnabled, false);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.publicPublicationEnabled, false);
console.log(JSON.stringify({status: "PASS", unifiedSurfaces: surfaces, languageDifficultyBatches: batches, checkpointRoutes: 12, frozenContentParity: true}));
