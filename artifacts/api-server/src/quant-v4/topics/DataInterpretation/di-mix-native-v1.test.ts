import assert from "node:assert/strict";
import {
  generateDiDeliveryNoveltyMix as generate,
  diNoveltyLearnerItemKey,
} from "./di-delivery-novelty-mix-v1";

const modes = new Set<string>();
let checked = 0;
for (const examProfile of [
  "SSC_CGL_TIER_I",
  "BANKING_PRELIMS",
  "BANKING_MAINS",
]) {
  for (const count of [1, 20, 100, 1000]) {
    const request = {
      examProfile,
      count,
      seed: `NATIVE-MIX:${examProfile}:${count}`,
    };
    const english = await generate(request);
    for (const language of ["hi", "pa"] as const) {
      const result = await generate({ ...request, language });
      const script = language === "hi" ? /[\u0900-\u097f]/ : /[\u0a00-\u0a7f]/;
      assert.equal(result.generationContext.language, language);
      assert.equal(
        result.generationContext.reviewStatus,
        "NATIVE_MIX_REVIEW_CANDIDATE",
      );
      assert.deepEqual(
        result.generationContext.noveltyMix.actualCounts,
        english.generationContext.noveltyMix.actualCounts,
      );
      assert.deepEqual(
        result.generationContext.difficultyMix,
        english.generationContext.difficultyMix,
      );
      assert.equal(
        new Set(result.questions.map(diNoveltyLearnerItemKey)).size,
        count,
      );
      assert.equal(
        new Set(result.questions.map((q: any) => q.questionId)).size,
        count,
      );
      for (const [i, q] of result.questions.entries()) {
        const en = english.questions[i];
        modes.add(q.noveltySourceMode);
        assert.equal(
          q.sourceQuestionId,
          en.sourceQuestionId,
          `${language}/${examProfile}/${i}: selection drift`,
        );
        assert.equal(q.questionId, `${en.questionId}:${language}`);
        assert.equal(q.correctIndex, en.correctIndex);
        assert.equal(q.taskKind, en.taskKind);
        assert.equal(q.difficultyLabel, en.difficultyLabel);
        assert.equal(q.noveltySourceMode, en.noveltySourceMode);
        assert.equal(q.options[q.correctIndex], q.answer);
        // Numerical answers/options must be identical, including fractions and percentages.
        if (/^[\d.:%° /+-]+$/.test(en.answer))
          assert.equal(q.answer, en.answer);
        assert(script.test(q.stem), `${language}: missing native stem`);
        assert(
          script.test(q.explanation),
          `${language}: missing native working`,
        );
        assert(!/\b(What|Find|How|Which|Approximately|Study)\b/.test(q.stem));
        assert.equal(q.reviewStatus, "NATIVE_MIX_REVIEW_CANDIDATE");
        assert.equal(q.questionBankWritable, false);
        assert.equal(q.testEligible, false);
        assert.equal(q.mockTestEligible, false);
        assert.equal(q.publiclyPublishable, false);
        assert.equal(q.productionReleaseAuthorized, false);
        assert.equal(q.manualApprovalRequired, true);
        assert(!("nativeSelectionStem" in q));
        assert(!("nativeSelectionItemKey" in q));
        if (q.stimulusSvgs)
          for (const svg of q.stimulusSvgs) assert(script.test(svg));
        if (q.stimulusHtml) assert(script.test(q.stimulusHtml));
        checked++;
      }
      if (count === 20) {
        const replay = await generate({ ...request, language });
        assert.deepEqual(replay.questions, result.questions);
      }
    }
  }
}
assert.equal(modes.size, 23, `Native source coverage: ${[...modes]}`);
// A known translation collision must not change DI-002 duplicate repair.
const collision = {
  seed: "NATIVE-PROBE",
  count: 100,
  examProfile: "BANKING_MAINS",
};
const reference = await generate(collision);
for (const language of ["hi", "pa"]) {
  const result = await generate({ ...collision, language });
  assert.deepEqual(
    result.questions.map((q) => q.sourceQuestionId),
    reference.questions.map((q) => q.sourceQuestionId),
  );
}
for (const language of ["hi-IN", "pa-IN"]) {
  const result = await generate({ seed: "LOCALE", count: 5, language });
  assert.equal(result.generationContext.language, language.slice(0, 2));
}
for (const language of ["fr", "", 42, null]) {
  await assert.rejects(
    () => generate({ language } as any),
    /language|supports en/,
  );
}
for (const difficulty of ["easy", "medium", "hard"]) {
  const request = {
    seed: `EXPLICIT:${difficulty}`,
    count: 20,
    examProfile: "BANKING_MAINS",
    difficulty,
  };
  const en = await generate(request);
  for (const language of ["hi", "pa"]) {
    const result = await generate({ ...request, language });
    assert.deepEqual(
      result.questions.map((q) => [q.sourceQuestionId, q.correctIndex]),
      en.questions.map((q) => [q.sourceQuestionId, q.correctIndex]),
    );
  }
}
console.log(
  "DI_MIX_NATIVE_V1",
  JSON.stringify({
    checked,
    sourceModes: modes.size,
    sameSeedParity: true,
    replay: true,
    lifecycleLocked: true,
  }),
);
