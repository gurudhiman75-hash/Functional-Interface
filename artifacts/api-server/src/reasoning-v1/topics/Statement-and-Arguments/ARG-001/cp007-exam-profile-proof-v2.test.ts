import assert from "node:assert/strict";

import { ARG_CP006_FROZEN_CONTRACT } from "./cp006-freeze-manifest.ts";
import {
  ARG_CP007_AUTHORITY,
  ARG_CP007_CHECKPOINT_ID,
  ARG_CP007_EXAM_PROFILES,
  ARG_CP007_PROFILE_TEMPLATE_IDS,
  generateArgCp007ExamProfileBatch,
  generateArgCp007ExamProfileQuestion,
  type ArgCp007Difficulty,
  type ArgCp007ExamProfile,
} from "./cp007-exam-profile-generator-v2.ts";
import { ARG_QL_IDS, type ArgLocale } from "./types.ts";

const locales: readonly ArgLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const profiles = Object.keys(ARG_CP007_EXAM_PROFILES) as ArgCp007ExamProfile[];
const seeds = [0, 1, 2, 3, 17, 63, 127, 255] as const;

assert.equal(ARG_CP006_FROZEN_CONTRACT.status, "FROZEN_CERTIFIED");
assert.equal(ARG_CP006_FROZEN_CONTRACT.authority, "ARG_CP006_IMMUTABLE_FREEZE_V1");
assert.equal(ARG_CP006_FROZEN_CONTRACT.sourceTemplateCount, 48);
assert.equal(ARG_CP006_FROZEN_CONTRACT.trilingualSemanticSurfaceCount, 36_864);
assert.equal(ARG_CP007_PROFILE_TEMPLATE_IDS.length, 6);
assert.equal(new Set(ARG_CP007_PROFILE_TEMPLATE_IDS).size, 6);

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

let generated = 0;
const coverage = new Set<string>();
const answerPositions = new Map<ArgCp007ExamProfile, Set<number>>();
for (const profile of profiles) answerPositions.set(profile, new Set<number>());

for (const profile of profiles) {
  const profileMeta = ARG_CP007_EXAM_PROFILES[profile];
  for (const difficulty of profileMeta.supportedDifficulties as readonly ArgCp007Difficulty[]) {
    for (const qlId of ARG_QL_IDS) {
      for (const locale of locales) {
        for (const seed of seeds) {
          const question = generateArgCp007ExamProfileQuestion({ qlId, locale, seed, profile, difficulty });
          const replay = generateArgCp007ExamProfileQuestion({ qlId, locale, seed, profile, difficulty });
          generated += 1;
          coverage.add(`${profile}:${difficulty}:${qlId}:${locale}`);
          answerPositions.get(profile)!.add(question.correctIndex);

          assert.equal(question.chapterId, "ARG-001");
          assert.equal(question.checkpointId, ARG_CP007_CHECKPOINT_ID);
          assert.equal(question.authority, ARG_CP007_AUTHORITY);
          assert.equal(question.qlId, qlId);
          assert.equal(question.locale, locale);
          assert.equal(question.arguments.length, profileMeta.argumentCount);
          assert.equal(question.argumentStrengths.length, profileMeta.argumentCount);
          assert.equal(question.options.length, profileMeta.optionCount);
          assert.equal(new Set(question.options).size, profileMeta.optionCount);
          assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length);
          assert.equal(question.answer, question.options[question.correctIndex]);
          assert.equal(question.strongArgumentIndices.length, question.argumentStrengths.filter((value) => value === "STRONG").length);
          assert.ok(question.statement.length > 0);
          assert.ok(question.arguments.every((value) => value.length > 0));
          assert.ok(!/\{[ab]\}/.test(`${question.statement}\n${question.arguments.join("\n")}`));
          assert.equal(question.metadata.cp006CoreUnmodified, true);
          assert.equal(question.metadata.cp006FreezeAuthorityRetained, ARG_CP006_FROZEN_CONTRACT.authority);
          assert.equal(question.metadata.reviewOnly, true);
          assert.equal(question.metadata.manualApprovalRequired, true);
          assert.equal(question.metadata.persistenceAllowed, false);
          assert.equal(question.metadata.questionBankWritable, false);
          assert.equal(question.metadata.testEligible, false);
          assert.equal(question.metadata.mockEligible, false);
          assert.equal(question.metadata.publicEligible, false);
          assert.equal(question.metadata.automaticStudentPublication, false);
          assert.equal(question.metadata.learnerRelease, "LOCKED");
          assert.equal(replay.contentFingerprint, question.contentFingerprint);
          assert.deepEqual(replay.arguments, question.arguments);
          assert.deepEqual(replay.options, question.options);
          assert.equal(replay.correctIndex, question.correctIndex);

          if (profile === "BANKING_CLASSIC_2X5") {
            assert.notEqual(question.correctIndex, 2, "The legacy Either-I-or-II presentation option is a distractor, not a fifth semantic truth class.");
          }
          if (profile === "SSC_RECENT_2X4" && locale === "en-IN") {
            assert.ok(words(question.statement) <= 20, `${question.scenarioId}: concise statement exceeded 20 words`);
            assert.ok(question.arguments.every((value) => words(value) <= 28), `${question.scenarioId}: concise argument exceeded 28 words`);
          }
        }
      }

      for (const seed of seeds) {
        const en = generateArgCp007ExamProfileQuestion({ qlId, locale: "en-IN", seed, profile, difficulty });
        const hi = generateArgCp007ExamProfileQuestion({ qlId, locale: "hi-IN", seed, profile, difficulty });
        const pa = generateArgCp007ExamProfileQuestion({ qlId, locale: "pa-IN", seed, profile, difficulty });
        for (const localizedQuestion of [hi, pa]) {
          assert.deepEqual(localizedQuestion.argumentStrengths, en.argumentStrengths, `${profile}/${difficulty}/${qlId}/${seed}: strength parity drift`);
          assert.deepEqual(localizedQuestion.strongArgumentIndices, en.strongArgumentIndices, `${profile}/${difficulty}/${qlId}/${seed}: strong-index parity drift`);
          assert.equal(localizedQuestion.correctIndex, en.correctIndex, `${profile}/${difficulty}/${qlId}/${seed}: correct-index parity drift`);
          assert.equal(localizedQuestion.arguments.length, en.arguments.length, `${profile}/${difficulty}/${qlId}/${seed}: argument-count parity drift`);
          assert.equal(localizedQuestion.options.length, en.options.length, `${profile}/${difficulty}/${qlId}/${seed}: option-count parity drift`);
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
        assert.ok(coverage.has(`${profile}:${difficulty}:${qlId}:${locale}`));
      }
    }
  }
}

assert.ok(answerPositions.get("SSC_RECENT_2X4")!.size >= 3);
assert.ok(answerPositions.get("BANKING_CLASSIC_2X5")!.size >= 3);
assert.ok(answerPositions.get("BANKING_COMBO_3X5")!.size >= 3);
assert.equal(answerPositions.get("BANKING_COMBO_4X5")!.size, 5);

const paA = generateArgCp007ExamProfileBatch({ profile: "BANKING_COMBO_4X5", difficulty: "Hard", locale: "pa-IN", seed: "cp007-final-proof", count: 18 });
const paB = generateArgCp007ExamProfileBatch({ profile: "BANKING_COMBO_4X5", difficulty: "Hard", locale: "pa-IN", seed: "cp007-final-proof", count: 18 });
assert.deepEqual(paA, paB);
assert.equal(paA.questions.length, 18);
assert.deepEqual(new Set(paA.questions.map((question) => question.qlId)), new Set(ARG_QL_IDS));
assert.equal(paA.generationContext.questionBankWritable, false);
assert.equal(paA.generationContext.testEligible, false);
assert.equal(paA.generationContext.mockTestEligible, false);
assert.equal(paA.generationContext.publiclyPublishable, false);
assert.equal(paA.generationContext.automaticStudentPublication, false);
assert.equal(paA.generationContext.learnerRelease, "LOCKED");

assert.throws(() => generateArgCp007ExamProfileQuestion({ qlId: "ARG-QL-001", locale: "en-IN", seed: 1, profile: "BANKING_COMBO_4X5", difficulty: "Easy" }), /does not support Easy/);

console.log(JSON.stringify({
  status: "PASS_ARG_CP007_REAL_PAPER_PARITY_V2",
  authority: ARG_CP007_AUTHORITY,
  checkpoint: ARG_CP007_CHECKPOINT_ID,
  profiles,
  qls: ARG_QL_IDS.length,
  locales,
  proofQuestions: generated,
  explicitTrilingualParity: true,
  cp006Core: "BYTE_FREEZE_PRESERVED_BY_SEPARATE_CP006_PROOF",
  learnerRelease: "LOCKED",
}, null, 2));
