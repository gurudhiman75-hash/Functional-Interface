import { strict as assert } from "node:assert";
import { AVG_001_ENGLISH_RELEASE_V2 } from "./foundation/editorial-v2-release";
import { getAvg001QuestionEntries } from "./foundation/library";
import { AVG_001_LOCALIZED_RELEASE } from "./foundation/localized-release";
import type { Avg001Difficulty } from "./foundation/types";
import {
  AVG_001_QUESTION_STUDIO_CP_IDS,
  AVG_001_QUESTION_STUDIO_LANGUAGES,
  runAvg001QuestionStudioPipeline,
} from "./question-studio-adapter";

const entries = getAvg001QuestionEntries();
const difficultyOrder: Avg001Difficulty[] = ["Easy", "Medium", "Hard"];
let cases = 0;
let unavailableChecks = 0;

function expectedReleaseId(language: "en" | "hi" | "pa") {
  if (language === "en") return AVG_001_ENGLISH_RELEASE_V2.releaseId;
  return AVG_001_LOCALIZED_RELEASE.releases[language].releaseId;
}

for (const language of AVG_001_QUESTION_STUDIO_LANGUAGES) {
  for (const cpId of AVG_001_QUESTION_STUDIO_CP_IDS) {
    const availableDifficulties = difficultyOrder.filter((difficulty) =>
      entries.some((entry) => entry.cpId === cpId && entry.difficulty === difficulty)
    );
    assert.ok(availableDifficulties.length >= 1, `${cpId} has no available difficulty band`);

    for (const difficulty of availableDifficulties) {
      const seed = `avg-question-studio:${language}:${cpId}:${difficulty}`;
      const first = runAvg001QuestionStudioPipeline(cpId, { difficulty, language, seed });
      const second = runAvg001QuestionStudioPipeline(cpId, { difficulty, language, seed });
      cases += 1;
      assert.equal(first.packageId, "AVG-001");
      assert.equal(first.archetypeId, "AVG-001");
      assert.equal(first.canonicalProblemId, cpId);
      assert.equal(first.difficultyBand, difficulty);
      assert.equal(first.language, language);
      assert.equal(first.maturity, "FROZEN");
      assert.equal(first.publiclyPublishable, true);
      assert.equal(first.traceability.releaseId, expectedReleaseId(language));
      assert.equal(first.traceability.editorialStatus, "APPROVED");
      assert.equal(first.traceability.approvedLanguage, language);
      assert.equal(first.traceability.questionStudioRelease, true);
      assert.equal(
        first.validation.checks.some(
          (check) =>
            check.name === (language === "en" ? "release-approval-v2" : "localized-release-approval") &&
            check.passed,
        ),
        true,
      );
      assert.equal(first.questionLanguageId, second.questionLanguageId);
      assert.equal(first.stem, second.stem);
      assert.deepEqual(first.options, second.options);
      assert.equal(first.answer, second.answer);
      assert.deepEqual(first.explanation, second.explanation);
      assert.equal(first.options[first.correctIndex], first.answer);
      assert.equal(first.validation.valid, true);
      if (language === "hi") {
        assert.match(first.stem, /[\u0900-\u097F]/);
      } else if (language === "pa") {
        assert.match(first.stem, /[\u0A00-\u0A7F]/);
      } else {
        assert.equal(first.traceability.avg001EditorialV2Complete !== undefined, true);
      }
    }

    for (const unavailable of difficultyOrder.filter((difficulty) => !availableDifficulties.includes(difficulty))) {
      assert.throws(
        () => runAvg001QuestionStudioPipeline(cpId, {
          difficulty: unavailable,
          language,
          seed: `avg-question-studio:${language}:${cpId}:${unavailable}:empty`,
        }),
        new RegExp(`No active AVG-001 QLs match ${cpId} / ${unavailable}`),
      );
      unavailableChecks += 1;
    }
  }
}

for (const language of AVG_001_QUESTION_STUDIO_LANGUAGES) {
  const explicit = runAvg001QuestionStudioPipeline("AVG-CP-006", {
    questionLanguageId: "AVG-QL-373",
    language,
    seed: `avg-question-studio:explicit:${language}`,
  });
  assert.equal(explicit.questionLanguageId, "AVG-QL-373");
  assert.equal(explicit.language, language);
  assert.equal(explicit.maturity, "FROZEN");
  assert.equal(explicit.publiclyPublishable, true);
  assert.equal(explicit.traceability.releaseId, expectedReleaseId(language));
}

assert.throws(
  () =>
    runAvg001QuestionStudioPipeline("AVG-CP-001", {
      questionLanguageId: "AVG-QL-373",
    }),
  /not active for AVG-CP-001/,
);

console.log(JSON.stringify({
  releases: {
    en: AVG_001_ENGLISH_RELEASE_V2.releaseId,
    hi: AVG_001_LOCALIZED_RELEASE.releases.hi.releaseId,
    pa: AVG_001_LOCALIZED_RELEASE.releases.pa.releaseId,
  },
  languageCount: AVG_001_QUESTION_STUDIO_LANGUAGES.length,
  cpCount: AVG_001_QUESTION_STUDIO_CP_IDS.length,
  availableDifficultyCases: cases,
  unavailableDifficultyChecks: unavailableChecks,
  status: "PASS",
}, null, 2));
assert.equal(cases, 48);
assert.equal(unavailableChecks, 6);
