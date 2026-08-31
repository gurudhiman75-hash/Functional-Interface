import assert from "node:assert/strict";

import { ARG_CP006_FROZEN_CONTRACT } from "./cp006-freeze-manifest.ts";
import {
  ARG_CP007_AUTHORITY,
  ARG_CP007_CHECKPOINT_ID,
  ARG_CP007_EXAM_PROFILES,
  generateArgCp007ExamProfileBatch,
  generateArgCp007ExamProfileQuestion,
  type ArgCp007Difficulty,
  type ArgCp007ExamProfile,
} from "./cp007-exam-profile-generator.ts";
import { ARG_QL_IDS, type ArgLocale } from "./types.ts";

const locales: readonly ArgLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const profiles = Object.keys(ARG_CP007_EXAM_PROFILES) as ArgCp007ExamProfile[];

assert.equal(ARG_CP006_FROZEN_CONTRACT.status, "FROZEN_CERTIFIED");
assert.equal(ARG_CP006_FROZEN_CONTRACT.authority, "ARG_CP006_IMMUTABLE_FREEZE_V1");
assert.equal(ARG_CP006_FROZEN_CONTRACT.sourceTemplateCount, 48);
assert.equal(ARG_CP006_FROZEN_CONTRACT.trilingualSemanticSurfaceCount, 36_864);

const profileCoverage = new Set<string>();
const correctPositionsByProfile = new Map<ArgCp007ExamProfile, Set<number>>();
let generated = 0;

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

for (const profile of profiles) {
  const meta = ARG_CP007_EXAM_PROFILES[profile];
  correctPositionsByProfile.set(profile, new Set<number>());
  for (const difficulty of meta.supportedDifficulties as readonly ArgCp007Difficulty[]) {
    for (const qlId of ARG_QL_IDS) {
      for (const locale of locales) {
        for (const seed of [0, 1, 2, 3, 17, 63]) {
          const question = generateArgCp007ExamProfileQuestion({ qlId, locale, seed, profile, difficulty });
          generated += 1;
          profileCoverage.add(`${profile}:${difficulty}:${qlId}:${locale}`);
          correctPositionsByProfile.get(profile)!.add(question.correctIndex);

          assert.equal(question.chapterId, "ARG-001");
          assert.equal(question.checkpointId, ARG_CP007_CHECKPOINT_ID);
          assert.equal(question.authority, ARG_CP007_AUTHORITY);
          assert.equal(question.qlId, qlId);
          assert.equal(question.locale, locale);
          assert.equal(question.arguments.length, meta.argumentCount);
          assert.equal(question.argumentStrengths.length, meta.argumentCount);
          assert.equal(question.options.length, meta.optionCount);
          assert.equal(new Set(question.options).size, meta.optionCount);
          assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length);
          assert.equal(question.answer, question.options[question.correctIndex]);
          assert.equal(question.metadata.reviewOnly, true);
          assert.equal(question.metadata.manualApprovalRequired, true);
          assert.equal(question.metadata.persistenceAllowed, false);
          assert.equal(question.metadata.questionBankWritable, false);
          assert.equal(question.metadata.testEligible, false);
          assert.equal(question.metadata.mockEligible, false);
          assert.equal(question.metadata.publicEligible, false);
          assert.equal(question.metadata.automaticStudentPublication, false);
          assert.equal(question.metadata.learnerRelease, "LOCKED");
          assert.equal(question.metadata.cp006CoreUnmodified, true);
          assert.equal(question.metadata.cp006FreezeAuthorityRetained, ARG_CP006_FROZEN_CONTRACT.authority);
          assert.ok(!/[{][ab][}]/.test(`${question.statement}\n${question.arguments.join("\n")}`));
          assert.equal(question.strongArgumentIndices.length, question.argumentStrengths.filter((value) => value === "STRONG").length);

          const replay = generateArgCp007ExamProfileQuestion({ qlId, locale, seed, profile, difficulty });
          assert.equal(replay.contentFingerprint, question.contentFingerprint);
          assert.deepEqual(replay.arguments, question.arguments);
          assert.deepEqual(replay.options, question.options);
          assert.equal(replay.correctIndex, question.correctIndex);

          if (profile === "BANKING_CLASSIC_2X5") {
            assert.notEqual(question.correctIndex, 2, "Either I or II must remain a fixed distractor in this sourced profile");
          }

          if (profile === "SSC_RECENT_2X4" && locale === "en-IN") {
            assert.ok(wordCount(question.statement) <= 22, `${question.scenarioId}: SSC statement is too long`);
            for (const argument of question.arguments) {
              assert.ok(wordCount(argument) <= 30, `${question.scenarioId}: SSC argument is too long`);
            }
          }
        }
      }
    }
  }
}

for (const profile of profiles) {
  const meta = ARG_CP007_EXAM_PROFILES[profile];
  for (const difficulty of meta.supportedDifficulties as readonly ArgCp007Difficulty[]) {
    for (const qlId of ARG_QL_IDS) {
      for (const locale of locales) {
        assert.ok(profileCoverage.has(`${profile}:${difficulty}:${qlId}:${locale}`), `Missing ${profile}/${difficulty}/${qlId}/${locale}`);
      }
    }
  }
}

assert.ok(correctPositionsByProfile.get("SSC_RECENT_2X4")!.size >= 3);
assert.ok(correctPositionsByProfile.get("BANKING_CLASSIC_2X5")!.size >= 3);
assert.ok(correctPositionsByProfile.get("BANKING_COMBO_3X5")!.size >= 3);
assert.ok(correctPositionsByProfile.get("BANKING_COMBO_4X5")!.size >= 4);

const batchA = generateArgCp007ExamProfileBatch({
  profile: "BANKING_COMBO_4X5",
  difficulty: "Hard",
  locale: "pa-IN",
  seed: "cp007-proof",
  count: 12,
});
const batchB = generateArgCp007ExamProfileBatch({
  profile: "BANKING_COMBO_4X5",
  difficulty: "Hard",
  locale: "pa-IN",
  seed: "cp007-proof",
  count: 12,
});
assert.deepEqual(batchA, batchB);
assert.equal(batchA.questions.length, 12);
assert.deepEqual(new Set(batchA.questions.map((question) => question.qlId)), new Set(ARG_QL_IDS));
assert.equal(batchA.generationContext.questionBankWritable, false);
assert.equal(batchA.generationContext.testEligible, false);
assert.equal(batchA.generationContext.mockTestEligible, false);
assert.equal(batchA.generationContext.publiclyPublishable, false);
assert.equal(batchA.generationContext.automaticStudentPublication, false);
assert.equal(batchA.generationContext.learnerRelease, "LOCKED");

assert.throws(() => generateArgCp007ExamProfileQuestion({
  qlId: "ARG-QL-001",
  locale: "en-IN",
  seed: 1,
  profile: "BANKING_COMBO_4X5",
  difficulty: "Easy",
}), /does not support Easy/);

console.log(JSON.stringify({
  status: "PASS_ARG_CP007_REAL_PAPER_PARITY",
  authority: ARG_CP007_AUTHORITY,
  checkpoint: ARG_CP007_CHECKPOINT_ID,
  profiles,
  permanentQls: ARG_QL_IDS.length,
  locales,
  generatedProofQuestions: generated,
  cp006Core: "UNCHANGED_AND_STILL_FROZEN",
  downstreamRelease: "LOCKED",
}, null, 2));
