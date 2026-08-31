import assert from "node:assert/strict";

import { ARG_CP003_TEMPLATES_BY_QL } from "./cp003-templates.ts";
import {
  ARG_CP005_DIFFICULTIES_BY_QL,
  ARG_CP005_QUESTION_STUDIO_REVIEW_PACKAGE,
  generateArg001QuestionStudioBatch,
  isArg001QuestionStudioRequest,
  listArg001QuestionStudioPackages,
} from "./cp005-question-studio-integration.ts";
import { ARG_QL_IDS } from "./types.ts";

const EXPECTED_DIFFICULTIES = ["Easy", "Hard", "Medium"] as const;

async function main() {
  const pkg = ARG_CP005_QUESTION_STUDIO_REVIEW_PACKAGE;
  assert.equal(pkg.packageId, "ARG-001");
  assert.equal(pkg.integrationCheckpointId, "ARG-CP-005");
  assert.equal(pkg.permanentQlCount, 6);
  assert.deepEqual(pkg.permanentQlIds, ARG_QL_IDS);
  assert.deepEqual(pkg.supportedLanguages, ["en", "hi", "pa"]);
  assert.deepEqual(pkg.designTargetDifficulties, ["Easy", "Medium", "Hard"]);
  assert.deepEqual(pkg.supportedDifficulties, ["Easy", "Medium", "Hard"]);
  assert.deepEqual(pkg.blockedDifficulties, []);
  assert.equal(pkg.difficultyCoverageStatus, "CERTIFIED_EASY_MEDIUM_HARD");
  assert.equal(pkg.questionStudioVisible, true);
  assert.equal(pkg.questionStudioDiscoverable, true);
  assert.equal(pkg.questionStudioGenerationEnabled, true);
  assert.equal(pkg.reviewOnly, true);
  assert.equal(pkg.manualApprovalRequired, true);
  assert.equal(pkg.persistenceAllowed, false);
  assert.equal(pkg.questionBankWritable, false);
  assert.equal(pkg.testEligible, false);
  assert.equal(pkg.mockTestEligible, false);
  assert.equal(pkg.publiclyPublishable, false);
  assert.equal(pkg.automaticStudentPublication, false);
  assert.equal(pkg.learnerRelease, "LOCKED");
  assert.equal(listArg001QuestionStudioPackages()[0], pkg);

  const sourceDifficultyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };
  for (const qlId of ARG_QL_IDS) {
    const templates = ARG_CP003_TEMPLATES_BY_QL[qlId];
    assert.equal(templates.length, 8, `${qlId}: expected exactly eight certified source templates`);
    for (const template of templates) {
      sourceDifficultyCounts[template.difficulty] += 1;
    }

    const coverage = [...ARG_CP005_DIFFICULTIES_BY_QL[qlId]].sort();
    assert.deepEqual(coverage, EXPECTED_DIFFICULTIES, `${qlId}: incomplete authority difficulty coverage`);
  }
  assert.deepEqual(
    sourceDifficultyCounts,
    { EASY: 13, MEDIUM: 15, HARD: 20 },
    "ARG-001 source difficulty distribution drifted from the CP005-certified 13/15/20 calibration",
  );
  assert.equal(
    sourceDifficultyCounts.EASY + sourceDifficultyCounts.MEDIUM + sourceDifficultyCounts.HARD,
    48,
    "ARG-001 must preserve exactly 48 certified source templates",
  );

  assert.equal(isArg001QuestionStudioRequest({ qlId: "ARG-QL-003" }), true);
  assert.equal(isArg001QuestionStudioRequest({ cpId: "ARG-CP-005" }), true);
  assert.equal(isArg001QuestionStudioRequest({ canonicalProblemId: "ARG-QL-006" }), true);
  assert.equal(isArg001QuestionStudioRequest({ cpId: "STA-CP-001" }), false);

  for (const language of ["en", "hi", "pa"] as const) {
    for (const qlId of ARG_QL_IDS) {
      const first = await generateArg001QuestionStudioBatch({
        language,
        qlId,
        seed: `cp005-proof:${language}:${qlId}`,
        count: 4,
      });
      const replay = await generateArg001QuestionStudioBatch({
        language,
        qlId,
        seed: `cp005-proof:${language}:${qlId}`,
        count: 4,
      });

      assert.equal(first.questions.length, 4);
      assert.deepEqual(first.questions, replay.questions, `${language}/${qlId}: deterministic replay drift`);
      assert.equal(first.generationContext.qlId, qlId);
      assert.equal(first.generationContext.language, language);
      assert.equal(first.generationContext.questionBankWritable, false);
      assert.equal(first.generationContext.testEligible, false);
      assert.equal(first.generationContext.publiclyPublishable, false);

      for (const question of first.questions) {
        assert.equal(question.qlId, qlId);
        assert.equal(question.language, language);
        assert.equal(question.checkpointId, "ARG-CP-005");
        assert.equal(question.sourceCheckpointId, "ARG-CP-004");
        assert.equal(question.questionStudioRegistrationStatus, "REGISTERED_REVIEW_ONLY");
        assert.equal(question.questionStudioStagingStatus, "REVIEW_QUEUE_ENABLED");
        assert.equal(question.manualApprovalRequired, true);
        assert.equal(question.persistenceAllowed, false);
        assert.equal(question.questionBankWritable, false);
        assert.equal(question.testEligible, false);
        assert.equal(question.mockTestEligible, false);
        assert.equal(question.publiclyPublishable, false);
        assert.equal(question.automaticStudentPublication, false);
        assert.equal(question.generationContext.crossLanguageSemanticParity, true);
        assert.equal(question.generationContext.antiGamingCertified, true);
        assert.match(question.contentFingerprint, /^[0-9a-f]{64}$/);
        assert.equal(question.options.length, 4);
        assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
        assert.ok(question.explanation.length > 20);
      }
    }
  }

  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const batch = await generateArg001QuestionStudioBatch({
      language: "en",
      difficulty,
      seed: `cp005-difficulty:${difficulty}`,
      count: 24,
    });
    assert.equal(batch.questions.length, 24);
    for (const question of batch.questions) {
      assert.equal(question.difficulty, difficulty, `${difficulty}: filter leaked ${question.difficulty}`);
      assert.ok(
        ARG_CP005_DIFFICULTIES_BY_QL[question.qlId].includes(difficulty),
        `${difficulty}: scheduler selected ineligible ${question.qlId}`,
      );
    }
  }

  for (const qlId of ARG_QL_IDS) {
    for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
      const batch = await generateArg001QuestionStudioBatch({
        language: "en",
        qlId,
        difficulty,
        seed: `cp005-explicit:${qlId}:${difficulty}`,
        count: 2,
      });
      assert.equal(batch.questions.length, 2);
      for (const question of batch.questions) {
        assert.equal(question.qlId, qlId);
        assert.equal(question.difficulty, difficulty);
      }
    }
  }

  const trilingualSeeds = Array.from({ length: 18 }, (_, index) => index * 97 + 11);
  for (const qlId of ARG_QL_IDS) {
    for (const seed of trilingualSeeds) {
      const en = await generateArg001QuestionStudioBatch({ language: "en", qlId, seed: String(seed), count: 1 });
      const hi = await generateArg001QuestionStudioBatch({ language: "hi", qlId, seed: String(seed), count: 1 });
      const pa = await generateArg001QuestionStudioBatch({ language: "pa", qlId, seed: String(seed), count: 1 });
      const e = en.questionPackages[0]!;
      const h = hi.questionPackages[0]!;
      const p = pa.questionPackages[0]!;
      assert.equal(h.templateId, e.templateId);
      assert.equal(p.templateId, e.templateId);
      assert.equal(h.variantKey, e.variantKey);
      assert.equal(p.variantKey, e.variantKey);
      assert.equal(h.correctIndex, e.correctIndex);
      assert.equal(p.correctIndex, e.correctIndex);
      assert.equal(h.answerClass, e.answerClass);
      assert.equal(p.answerClass, e.answerClass);
      assert.equal(h.difficulty, e.difficulty);
      assert.equal(p.difficulty, e.difficulty);
      assert.deepEqual(h.argumentStrengths, e.argumentStrengths);
      assert.deepEqual(p.argumentStrengths, e.argumentStrengths);
    }
  }

  console.log("ARG-001 CP005 Question Studio proof: PASS");
}

await main();
