import assert from "node:assert/strict";
import { COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_AUTHORITY, COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_CANDIDATE, auditCom007SoftwareLanguagesDatabaseEnglishReviewV1 } from "./com007-software-languages-database-english-review-v1";
const audit = auditCom007SoftwareLanguagesDatabaseEnglishReviewV1();
assert.equal(audit.valid,true,audit.issues.join("\n"));
assert.equal(audit.questionCount,32);
assert.equal(audit.qlCount,8);
assert.equal(COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_CANDIDATE.length,COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_AUTHORITY.questionCount);
assert.deepEqual(COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_CANDIDATE.map((q) => q.options.indexOf(q.answer)),Array.from({length:32},(_,i)=>i%4));
console.log("[COM007-ENGLISH-REVIEW] PASS",{questions:32,qls:8,answerPositions:[0,1,2,3]});
