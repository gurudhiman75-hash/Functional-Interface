import assert from "node:assert/strict";
import { quantV4QuestionStudioAdapter as adapter } from "../../../../../question-studio/engines/quant-v4-adapter";
import {
  generateQuestion as core,
  listQuantV4Packages,
} from "../../../../generation-engine-core";
const info = console.info;
console.info = () => {};
let checked = 0;
try {
  const cards = adapter
    .listPackages()
    .filter((p) => /^PCT-00[1-7]$/.test(p.packageId));
  assert.equal(cards.length, 7);
  assert.equal(
    cards.reduce((n, p) => n + p.cpIds.length, 0),
    66,
  );
  for (const card of cards) {
    assert.deepEqual(card.supportedLanguages, ["en", "hi", "pa"]);
    for (const cp of card.cpIds)
      for (const examProfile of [
        "SSC_CGL_TIER_I",
        "BANKING_PRELIMS",
        "BANKING_MAINS",
      ]) {
        const request: any = {
          packageId: card.packageId,
          canonicalProblemId: cp,
          count: 3,
          examProfile,
          seed: `PCT-UNIFIED:${card.packageId}:${cp}:${examProfile}`,
        };
        const english = await adapter.generate({ ...request, language: "en" });
        for (const language of ["hi", "pa"] as const) {
          const result = await adapter.generate({ ...request, language });
          assert.equal(result.questions.length, 3);
          assert.equal(
            (result.generationContext as any).reviewStatus,
            "NATIVE_REVIEW_CANDIDATE",
          );
          for (const [index, q] of (result.questions as any[]).entries()) {
            const en = english.questions[index] as any;
            assert.equal(q.questionLanguageId, en.questionLanguageId);
            assert.equal(q.canonicalProblemId, cp);
            assert.equal(q.correctIndex, en.correctIndex);
            assert.equal(
              q.options.length,
              examProfile === "SSC_CGL_TIER_I" ? 4 : 5,
            );
            assert.equal(
              q.options[q.correctIndex].replaceAll("$", ""),
              q.canonicalAnswer.display.replaceAll("$", ""),
            );
            assert.equal(q.language, language);
            assert.equal(q.questionBankWritable, false);
            assert.equal(q.testEligible, false);
            assert.equal(q.mockTestEligible, false);
            assert.equal(q.publiclyPublishable, false);
            assert.equal(q.productionReleaseAuthorized, false);
            assert.equal(q.manualApprovalRequired, true);
            assert.equal(q.reviewStatus, "NATIVE_REVIEW_CANDIDATE");
            checked++;
          }
        }
      }
  }
  assert.deepEqual(
    listQuantV4Packages().find((p) => p.packageId === "PCT-ALL")
      ?.supportedLanguages,
    ["en", "hi", "pa"],
  );
  for (const language of ["hi", "pa"]) {
    const request: any = {
      packageId: "PCT-ALL",
      language,
      seed: "PCT-ALL-NATIVE",
      count: 1000,
    };
    const result = await core(request);
    assert.equal(new Set(result.questions.map((q) => q.packageId)).size, 7);
    assert.equal(new Set(result.questions.map((q) => q.questionId)).size, 1000);
    assert(
      result.questions.every(
        (q) =>
          q.reviewStatus === "NATIVE_REVIEW_CANDIDATE" &&
          q.publiclyPublishable === false,
      ),
    );
    const replay = await core({ ...request, count: 20 });
    const repeat = await core({ ...request, count: 20 });
    assert.deepEqual(replay.questions, repeat.questions);
    checked += result.questions.length;
  }
  for (const packageId of ["PCT-001", "PCT-ALL"])
    await assert.rejects(
      () => core({ packageId, language: "fr" } as any),
      /Unsupported.*language/,
    );
} finally {
  console.info = info;
}
console.log(
  "PCT_NATIVE_SHARED_ADAPTER_V1",
  JSON.stringify({
    checked,
    packages: 7,
    checkpoints: 66,
    profiles: 3,
    maxBatch: 1000,
    replay: true,
    lifecycleLocked: true,
  }),
);
