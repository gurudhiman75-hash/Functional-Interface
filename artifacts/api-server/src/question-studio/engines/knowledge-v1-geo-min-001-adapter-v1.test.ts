import { strict as assert } from "node:assert";
import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";
import {
  GEO_MIN_001_QUESTION_STUDIO_CORPUS_V1,
  GEO_MIN_001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  isGeoMin001QuestionStudioRequestV1,
  knowledgeV1GeoMin001QuestionStudioAdapterV1,
} from "./knowledge-v1-geo-min-001-adapter-v1";

assert.equal(GEO_MIN_001_QUESTION_STUDIO_CORPUS_V1.length, 732);
assert.equal(new Set(GEO_MIN_001_QUESTION_STUDIO_CORPUS_V1.map(q => q.qlId)).size, 122);
assert.equal(new Set(GEO_MIN_001_QUESTION_STUDIO_CORPUS_V1.map(q => q.cpId)).size, 12);
assert.equal(GEO_MIN_001_STANDARD_REVIEW_ONLY_PACKAGE_V1.questionBankWritable, false);
assert.equal(GEO_MIN_001_STANDARD_REVIEW_ONLY_PACKAGE_V1.testEligible, false);
assert.equal(GEO_MIN_001_STANDARD_REVIEW_ONLY_PACKAGE_V1.mockTestEligible, false);
assert.equal(GEO_MIN_001_STANDARD_REVIEW_ONLY_PACKAGE_V1.publiclyPublishable, false);
assert.deepEqual(GEO_MIN_001_STANDARD_REVIEW_ONLY_PACKAGE_V1.supportedLanguages, ["en","hi","pa"]);
assert.equal(GEO_MIN_001_STANDARD_REVIEW_ONLY_PACKAGE_V1.metadata?.localizedVersionCount, 2196);
assert.equal(GEO_MIN_001_STANDARD_REVIEW_ONLY_PACKAGE_V1.metadata?.localizationStatus, "REVIEW_REQUIRED");
assert.equal(isGeoMin001QuestionStudioRequestV1({ packageId: "GEO-MIN-001" }), true);

const req = { packageId: "GEO-MIN-001", language: "en" as const, count: 8, seed: "geo-min-001-test" };
const a = await knowledgeV1GeoMin001QuestionStudioAdapterV1.generate(req);
const b = await knowledgeV1GeoMin001QuestionStudioAdapterV1.generate(req);
assert.deepEqual(a, b);
assert.equal(a.questions.length, 8);
assert.equal(new Set(a.questions.map(q => q.questionId)).size, 8);
assert.equal(a.questions.every(q => q.registrationStatus === "REGISTERED_REVIEW_ONLY"), true);
assert.equal(a.questions.every(q => q.runtimeRegistered === true), true);
assert.equal(a.questions.every(q => q.readOnly === true), true);

const composite = await knowledgeV1QuestionStudioAdapter.generate({ ...req, count: 4 });
assert.equal(composite.questions.every(q => q.packageId === "GEO-MIN-001"), true);

const first = GEO_MIN_001_QUESTION_STUDIO_CORPUS_V1[0]!;
const ql = await knowledgeV1GeoMin001QuestionStudioAdapterV1.generate({ ...req, patternId: first.qlId, count: 2 });
assert.equal(ql.questions.every(q => q.qlId === first.qlId), true);
const cp = await knowledgeV1GeoMin001QuestionStudioAdapterV1.generate({ ...req, canonicalProblemId: first.cpId, count: 2 });
assert.equal(cp.questions.every(q => q.cpId === first.cpId), true);
const hard = await knowledgeV1GeoMin001QuestionStudioAdapterV1.generate({ ...req, difficulty: "Hard", count: 4 });
assert.equal(hard.questions.every(q => q.difficulty === "Hard"), true);
const hi = await knowledgeV1GeoMin001QuestionStudioAdapterV1.generate({ ...req, language: "hi", count: 4 });
assert.equal(hi.questions.length, 4);
assert.equal(hi.questions.every(q => q.language === "hi" && q.locale === "hi-IN"), true);
assert.equal(hi.questions.every(q => /[\u0900-\u097F]/.test(String(q.stem))), true);
assert.equal(hi.questions.every(q => q.options[q.correctIndex] === q.canonicalAnswer), true);

const pa = await knowledgeV1GeoMin001QuestionStudioAdapterV1.generate({ ...req, language: "pa", count: 4 });
assert.equal(pa.questions.length, 4);
assert.equal(pa.questions.every(q => q.language === "pa" && q.locale === "pa-IN"), true);
assert.equal(pa.questions.every(q => /[\u0A00-\u0A7F]/.test(String(q.stem))), true);
assert.equal(pa.questions.every(q => q.options[q.correctIndex] === q.canonicalAnswer), true);
