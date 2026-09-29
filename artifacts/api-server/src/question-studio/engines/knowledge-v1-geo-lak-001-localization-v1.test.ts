import { strict as assert } from "node:assert";
import { GEO_LAK_001_QUESTION_STUDIO_CORPUS_V1, GEO_LAK_001_STANDARD_REVIEW_ONLY_PACKAGE_V1, knowledgeV1GeoLak001QuestionStudioAdapterV1 } from "./knowledge-v1-geo-lak-001-adapter-v1";

assert.deepEqual(GEO_LAK_001_STANDARD_REVIEW_ONLY_PACKAGE_V1.supportedLanguages,["en","hi","pa"]);
assert.equal(GEO_LAK_001_STANDARD_REVIEW_ONLY_PACKAGE_V1.metadata?.localizationStatus,"REVIEW_REQUIRED");
assert.equal(GEO_LAK_001_STANDARD_REVIEW_ONLY_PACKAGE_V1.publiclyPublishable,false);

for(const language of ["en","hi","pa"] as const){
 const out=await knowledgeV1GeoLak001QuestionStudioAdapterV1.generate({packageId:"GEO-LAK-001",language,count:12,seed:"geo-lak-localization-parity-v1"});
 assert.equal(out.questions.length,12);
 assert.equal(out.questions.every(q=>q.language===language),true);
 assert.equal(out.questions.every(q=>q.options.length===4&&new Set(q.options).size===4),true);
 if(language==="hi")assert.equal(out.questions.every(q=>/[ऀ-ॿ]/.test(q.stem)),true);
 if(language==="pa")assert.equal(out.questions.every(q=>/[਀-੿]/.test(q.stem)),true);
}
const en=await knowledgeV1GeoLak001QuestionStudioAdapterV1.generate({packageId:"GEO-LAK-001",language:"en",count:20,seed:"geo-lak-parity"});
const hi=await knowledgeV1GeoLak001QuestionStudioAdapterV1.generate({packageId:"GEO-LAK-001",language:"hi",count:20,seed:"geo-lak-parity"});
const pa=await knowledgeV1GeoLak001QuestionStudioAdapterV1.generate({packageId:"GEO-LAK-001",language:"pa",count:20,seed:"geo-lak-parity"});
assert.deepEqual(en.questions.map(q=>q.sourceQuestionId??q.questionId),hi.questions.map(q=>q.sourceQuestionId??q.questionId));
assert.deepEqual(en.questions.map(q=>q.sourceQuestionId??q.questionId),pa.questions.map(q=>q.sourceQuestionId??q.questionId));
assert.deepEqual(en.questions.map(q=>q.correctIndex),hi.questions.map(q=>q.correctIndex));
assert.deepEqual(en.questions.map(q=>q.correctIndex),pa.questions.map(q=>q.correctIndex));
assert.equal(GEO_LAK_001_QUESTION_STUDIO_CORPUS_V1.length,75);
