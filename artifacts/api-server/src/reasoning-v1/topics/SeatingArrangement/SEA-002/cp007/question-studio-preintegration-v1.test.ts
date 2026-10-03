import assert from "node:assert/strict";

import {
  activateSea002Cp007QuestionStudio,
  generateSea002Cp007QuestionStudioPreview,
  isSea002Cp007QuestionStudioRequest,
  SEA002_CP007_QS_AUTHORITY_TO_QL,
} from "./question-studio-preintegration-v1.ts";

assert.equal(isSea002Cp007QuestionStudioRequest({ cpId: "SEA-CP-007" }), true);
assert.equal(isSea002Cp007QuestionStudioRequest({ questionLanguageId: "SEA-QL-025" }), true);
assert.equal(isSea002Cp007QuestionStudioRequest({ subtopic: "mixed facing parallel rows" }), true);
assert.equal(isSea002Cp007QuestionStudioRequest({ topic: "Seating Arrangement" }), false, "CP007 preview must not steal broad seating traffic from CP006");
assert.deepEqual(SEA002_CP007_QS_AUTHORITY_TO_QL, {
  "CP007-AUTH-01": "SEA-QL-025",
  "CP007-AUTH-02": "SEA-QL-026",
  "CP007-AUTH-03": "SEA-QL-027",
  "CP007-AUTH-04": "SEA-QL-028",
});

let surfaces = 0;
for (const language of ["en", "hi", "pa"] as const) {
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const first = generateSea002Cp007QuestionStudioPreview({
      cpId: "SEA-CP-007",
      language,
      difficulty,
      seed: `qs-prefreeze:${language}:${difficulty}`,
      count: 8,
    });
    const second = generateSea002Cp007QuestionStudioPreview({
      cpId: "SEA-CP-007",
      language,
      difficulty,
      seed: `qs-prefreeze:${language}:${difficulty}`,
      count: 8,
    });
    assert.deepEqual(second, first, `${language}/${difficulty}: preview generation must be deterministic`);
    assert.equal(first.length, 8);
    assert.deepEqual([...new Set(first.map((item) => item.qlId))].sort(), ["SEA-QL-025", "SEA-QL-026", "SEA-QL-027", "SEA-QL-028"]);
    for (const question of first) {
      surfaces += 1;
      assert.equal(question.options.length, 4);
      assert.equal(question.answer, question.options[question.correctIndex]);
      assert.equal(question.runtimeMode, "QUESTION_STUDIO_BLOCKED_PENDING_APPROVAL");
      assert.equal(question.reviewStatus, "PREFREEZE_REVIEW_AUTHORITY");
      assert.equal(question.questionStudioDiscoverable, false);
      assert.equal(question.sourceQuestionStudioRegistered, false);
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.productionStaging, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.automaticStudentPublication, false);
      assert.equal(question.traceability.productOwnerApprovalStatus, "PENDING");
      assert.equal(question.traceability.freezeStatus, "NOT_FROZEN");
      assert.equal(question.validation.ok, true);
      assert.equal(/\bcolumns?\b/iu.test(question.explanation), false);
      if (language !== "en") {
        assert.ok(question.traceability.canonicalParityFingerprint);
        assert.equal(/बैठता\/बैठती|बैठा\/बैठी|करता\/करती|ਬੈਠਦਾ\/ਬੈਠਦੀ|ਕਰਦਾ\/ਕਰਦੀ/u.test(`${question.stem}\n${question.explanation}`), false);
      }
    }
  }
}
assert.equal(surfaces, 72);

for (const qlId of ["SEA-QL-025", "SEA-QL-026", "SEA-QL-027", "SEA-QL-028"] as const) {
  const questions = generateSea002Cp007QuestionStudioPreview({
    questionLanguageId: qlId,
    language: "en",
    difficulty: "Medium",
    seed: `qs-direct:${qlId}`,
    count: 3,
  });
  assert.equal(questions.length, 3);
  assert.ok(questions.every((question) => question.qlId === qlId));
}

assert.throws(
  () => activateSea002Cp007QuestionStudio(),
  /blocked until explicit human approval and freeze/iu,
);

console.log("PASS_SEA002_CP007_QUESTION_STUDIO_PREFREEZE_V1");
console.log("preview surfaces", surfaces);
console.log("languages", "en,hi,pa");
console.log("difficulties", "Easy,Medium,Hard");
console.log("QLs", "SEA-QL-025..SEA-QL-028");
console.log("Studio activation", false);
console.log("Bank/test/mock/staging/public", false, false, false, false, false);
