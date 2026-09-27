import { strict as assert } from "node:assert";
import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";
import {
  GEO_AGR_001_QUESTION_STUDIO_CORPUS_V1,
  GEO_AGR_001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  isGeoAgr001QuestionStudioRequestV1,
  knowledgeV1GeoAgr001QuestionStudioAdapterV1,
} from "./knowledge-v1-geo-agr-001-adapter-v1";

assert.equal(GEO_AGR_001_QUESTION_STUDIO_CORPUS_V1.length, 648);
assert.equal(new Set(GEO_AGR_001_QUESTION_STUDIO_CORPUS_V1.map(q => q.qlId)).size, 108);
assert.equal(new Set(GEO_AGR_001_QUESTION_STUDIO_CORPUS_V1.map(q => q.cpId)).size, 5);
assert.equal(GEO_AGR_001_STANDARD_REVIEW_ONLY_PACKAGE_V1.questionBankWritable, false);
assert.equal(GEO_AGR_001_STANDARD_REVIEW_ONLY_PACKAGE_V1.testEligible, false);
assert.equal(GEO_AGR_001_STANDARD_REVIEW_ONLY_PACKAGE_V1.mockTestEligible, false);
assert.equal(GEO_AGR_001_STANDARD_REVIEW_ONLY_PACKAGE_V1.publiclyPublishable, false);
assert.equal(isGeoAgr001QuestionStudioRequestV1({packageId:"GEO-AGR-001"}), true);

const req = { packageId: "GEO-AGR-001", language: "en" as const, count: 8, seed: "geo-agr-001-test" };
const a = await knowledgeV1GeoAgr001QuestionStudioAdapterV1.generate(req);
const b = await knowledgeV1GeoAgr001QuestionStudioAdapterV1.generate(req);
assert.deepEqual(a, b);
assert.equal(a.questions.length, 8);
assert.equal(new Set(a.questions.map(q => q.questionId)).size, 8);
assert.equal(a.questions.every(q => q.registrationStatus === "REGISTERED_REVIEW_ONLY"), true);
assert.equal(a.questions.every(q => q.runtimeRegistered === true), true);
assert.equal(a.questions.every(q => q.readOnly === true), true);

const composite = await knowledgeV1QuestionStudioAdapter.generate({...req, count: 4});
assert.equal(composite.questions.every(q => q.packageId === "GEO-AGR-001"), true);

const first = GEO_AGR_001_QUESTION_STUDIO_CORPUS_V1[0]!;
const ql = await knowledgeV1GeoAgr001QuestionStudioAdapterV1.generate({...req, patternId:first.qlId, count:2});
assert.equal(ql.questions.every(q => q.qlId === first.qlId), true);
const cp = await knowledgeV1GeoAgr001QuestionStudioAdapterV1.generate({...req, canonicalProblemId:first.cpId, count:2});
assert.equal(cp.questions.every(q => q.cpId === first.cpId), true);
const hard = await knowledgeV1GeoAgr001QuestionStudioAdapterV1.generate({...req, difficulty:"Hard", count:4});
assert.equal(hard.questions.every(q => q.difficulty === "Hard"), true);
await assert.rejects(knowledgeV1GeoAgr001QuestionStudioAdapterV1.generate({...req, language:"hi"}), /English only/i);
