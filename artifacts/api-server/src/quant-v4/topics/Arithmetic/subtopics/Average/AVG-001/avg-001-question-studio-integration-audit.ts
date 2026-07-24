import { strict as assert } from "node:assert";
import { AVG_001_ENGLISH_RELEASE } from "./foundation/release";
import {
  AVG_001_QUESTION_STUDIO_CP_IDS,
  runAvg001QuestionStudioPipeline,
} from "./question-studio-adapter";

let cases = 0;
for (const cpId of AVG_001_QUESTION_STUDIO_CP_IDS) {
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const seed = `avg-question-studio:${cpId}:${difficulty}`;
    const first = runAvg001QuestionStudioPipeline(cpId, { difficulty, seed });
    const second = runAvg001QuestionStudioPipeline(cpId, { difficulty, seed });
    cases += 1;
    assert.equal(first.packageId, "AVG-001");
    assert.equal(first.archetypeId, "AVG-001");
    assert.equal(first.canonicalProblemId, cpId);
    assert.equal(first.difficultyBand, difficulty);
    assert.equal(first.language, "en");
    assert.equal(first.maturity, "FROZEN");
    assert.equal(first.publiclyPublishable, true);
    assert.equal(first.traceability.releaseId, AVG_001_ENGLISH_RELEASE.releaseId);
    assert.equal(first.traceability.editorialStatus, "APPROVED");
    assert.equal(first.traceability.approvedLanguage, "en");
    assert.equal(
      first.validation.checks.some(
        (check) => check.name === "release-approval" && check.passed,
      ),
      true,
    );
    assert.equal(first.questionLanguageId, second.questionLanguageId);
    assert.equal(first.stem, second.stem);
    assert.deepEqual(first.options, second.options);
    assert.equal(first.answer, second.answer);
    assert.equal(first.options[first.correctIndex], first.answer);
    assert.equal(first.validation.valid, true);
  }
}

const explicit = runAvg001QuestionStudioPipeline("AVG-CP-006", {
  questionLanguageId: "AVG-QL-373",
  seed: "avg-question-studio:explicit",
});
assert.equal(explicit.questionLanguageId, "AVG-QL-373");
assert.equal(explicit.maturity, "FROZEN");
assert.equal(explicit.publiclyPublishable, true);
assert.equal(explicit.traceability.releaseId, AVG_001_ENGLISH_RELEASE.releaseId);
assert.throws(
  () => runAvg001QuestionStudioPipeline("AVG-CP-001", { language: "hi" }),
  /English generation only/,
);
assert.throws(
  () =>
    runAvg001QuestionStudioPipeline("AVG-CP-001", {
      questionLanguageId: "AVG-QL-373",
    }),
  /not active for AVG-CP-001/,
);

console.log(JSON.stringify({
  releaseId: AVG_001_ENGLISH_RELEASE.releaseId,
  cpCount: AVG_001_QUESTION_STUDIO_CP_IDS.length,
  cases,
  status: "PASS",
}, null, 2));
assert.equal(cases, 18);
