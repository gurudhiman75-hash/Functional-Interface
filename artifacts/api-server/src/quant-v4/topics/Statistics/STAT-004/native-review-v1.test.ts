import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  generateStat004QuestionStudioBatch,
  stat004QuestionStudioPackageCard,
} from "./question-studio-adapter";
import { generateStat004Question } from "./data-foundations";
import { renderStat004Native, localizeStat004Batch } from "./native-review-v1";
import { STAT004_PERMANENT_QLS } from "./permanent-ql-registry";

const h = createHash("sha256"),
  combinations = new Set<string>(),
  variants = new Set<string>(),
  positions = new Set<number>();
let englishQuestions = 0,
  nativeQuestions = 0;
const flags = [
  "questionBankWritable",
  "questionBankEligible",
  "testEligible",
  "mockTestEligible",
  "publiclyPublishable",
  "automaticStudentPublication",
  "productionReleaseAuthorized",
];
for (const examProfile of ["SSC_CGL_TIER_II", "SSC_CGL_JSO"])
  for (let seed = 0; seed < 50; seed++) {
    const request = {
      seed: `STAT004-EN-BASELINE:${seed}`,
      examProfile,
      count: 30,
    };
    const en = await generateStat004QuestionStudioBatch(request);
    h.update(
      JSON.stringify({
        questions: en.questions,
        questionPackages: en.questionPackages,
      }),
    );
    englishQuestions += en.questions.length;
    for (const language of ["hi", "pa"] as const) {
      const native = await generateStat004QuestionStudioBatch({
        ...request,
        language,
      });
      assert.deepEqual(native.questionPackages, en.questionPackages);
      assert.equal(native.generationContext.language, language);
      assert.equal(
        native.generationContext.reviewStatus,
        "NATIVE_REVIEW_CANDIDATE",
      );
      assert.equal(
        native.generationContext.runtimeMode,
        "STAT004_NATIVE_REVIEW_V1",
      );
      const replay = await generateStat004QuestionStudioBatch({
        ...request,
        language,
      });
      assert.deepEqual(replay.questions, native.questions);
      for (const [i, q] of native.questions.entries()) {
        const eq = en.questions[i]!;
        nativeQuestions++;
        combinations.add(`${q.permanentQlId}:${examProfile}:${language}`);
        positions.add(q.correctIndex);
        for (const field of [
          "seed",
          "examProfile",
          "difficulty",
          "permanentQlId",
          "sourceQuestionId",
          "correct",
          "correctIndex",
          "questionIndex",
          "questionCount",
          "semanticContract",
        ])
          assert.deepEqual(q[field], eq[field], `Native changed ${field}`);
        assert.equal(q.sourceAnswer, eq.answer);
        assert.deepEqual(q.sourceOptions, eq.options);
        assert.equal(q.options[q.correctIndex], q.answer);
        assert.equal(q.canonicalAnswer.value, q.answer);
        assert.equal(q.canonicalAnswer.display, q.answer);
        assert.equal(q.canonicalAnswer.rendered, q.answer);
        assert.equal(q.questionId, `${eq.questionId}:${language}`);
        assert.equal(q.stem, q.text);
        assert.equal(q.options.length, 4);
        assert.equal(new Set(q.options).size, 4);
        assert(q.stem.includes("?"));
        assert.match(
          q.stem,
          language === "hi" ? /[\u0900-\u097f]/u : /[\u0a00-\u0a7f]/u,
        );
        assert.match(
          q.explanation,
          language === "hi" ? /[\u0900-\u097f]/u : /[\u0a00-\u0a7f]/u,
        );
        assert(
          !/\b(primary|secondary|data|survey|questionnaire|schedule|frequency|only|both|neither|class|observation)\b/i.test(
            [q.stem, q.explanation, ...q.options].join(" "),
          ),
        );
        for (const o of [
          q,
          q.metadata,
          q.traceability,
          native.generationContext,
        ]) {
          assert.equal(o.language, language);
          assert.equal(o.reviewStatus, "NATIVE_REVIEW_CANDIDATE");
          assert.equal(o.releaseId, "STAT-004-NATIVE-REVIEW-V1");
          assert.equal(o.sourceReleaseId, en.generationContext.releaseId);
          for (const flag of flags) assert.equal(o[flag], false);
          assert.equal(o.manualApprovalRequired, true);
        }
        const facts = q.reviewFacts;
        if ("variant" in facts) variants.add(`${facts.kind}:${facts.variant}`);
        else if (facts.kind === "DISCRETE_VS_CONTINUOUS_VARIABLE") {
          variants.add(`measured:${facts.measured}`);
          variants.add(`counted:${facts.counted}`);
          variants.add(`askMeasured:${facts.askMeasured}`);
          // The chosen quantity must be the corresponding native option at the source answer position.
          assert.equal(eq.answer.startsWith("number of"), !facts.askMeasured);
        } else if (
          facts.kind === "CHRONOLOGICAL_VS_GEOGRAPHICAL_CLASSIFICATION"
        )
          variants.add(`chronological:${facts.chronological}`);
        else if (facts.kind === "FREQUENCY_TABLE_CHECK") {
          variants.add(`frequencies:${facts.frequencies.join(",")}`);
          assert.equal(
            q.explanation.includes(
              language === "hi" ? "यह योग दिए गए" : "ਇਹ ਜੋੜ ਦਿੱਤੇ",
            ),
            q.stem.includes(language === "hi" ? "प्रेक्षण हैं" : "ਪ੍ਰੇਖਣ ਹਨ"),
            "Explanation must not introduce an observation count absent from the stem",
          );
          assert.equal(
            q.answer,
            String(
              facts.frequencies.reduce((a: number, b: number) => a + b, 0),
            ),
          );
        } else if (facts.kind === "MUTUALLY_EXCLUSIVE_CLASS_INTERVALS") {
          variants.add(`boundary:${facts.boundary}`);
          assert(q.answer.includes(`${facts.boundary}–${facts.boundary + 10}`));
          assert(q.stem.includes(`${facts.boundary - 10}–${facts.boundary}`));
        } else if (facts.kind === "BUILD_A_BASIC_FREQUENCY_TABLE") {
          variants.add(`raw:${facts.values.join(",")}`);
          const histogram = [0, 0, 0];
          for (const value of facts.values) {
            const slot = Math.floor(value / 4);
            assert(slot >= 0 && slot < 3);
            histogram[slot]!++;
          }
          assert.equal(q.answer, histogram.join(", "));
          assert(q.explanation.includes(`| [4, 8) |`));
          assert(q.explanation.includes(String(facts.values.length)));
        }
      }
    }
  }
assert.equal(
  h.digest("hex"),
  "f832650232b32d9c867e1e038526ff9483ff2931939c757f77c2cb7785f4f4b2",
);
assert.equal(combinations.size, 60);
assert.equal(
  variants.size,
  67,
  "Every authored scenario/fact variant must be exercised",
);
assert.equal(positions.size, 4);
const card = stat004QuestionStudioPackageCard();
assert.deepEqual(card.supportedLanguages, ["en", "hi", "pa"]);
assert(
  card.qls.every((q) => q.localizationStatus === "HI_PA_REVIEW_CANDIDATE"),
);
assert(
  STAT004_PERMANENT_QLS.every(
    (q) => q.localizationStatus === "HI_PA_REVIEW_CANDIDATE",
  ),
);
for (const alias of ["hi-IN", "pa-IN"]) {
  const one = await generateStat004QuestionStudioBatch({
    seed: "alias",
    language: alias,
  });
  const two = await generateStat004QuestionStudioBatch({
    seed: "alias",
    language: alias.slice(0, 2),
  });
  assert.deepEqual(one.questions, two.questions);
}
for (const language of ["fr", "", null, {}, 5])
  await assert.rejects(() =>
    generateStat004QuestionStudioBatch({ language: language as any }),
  );
const source = generateStat004Question({
  seed: "negative",
  contractId: "SCHEDULE_VS_QUESTIONNAIRE",
  examProfile: "SSC_CGL_JSO",
});
assert.throws(() =>
  renderStat004Native({ ...source, qlId: "STAT-QL-021" }, "hi"),
);
const unknownOptions = [...source.options] as [string, string, string, string];
unknownOptions[(source.correctIndex + 1) % 4] = "untranslated option";
assert.throws(
  () => renderStat004Native({ ...source, options: unknownOptions }, "pa"),
  /Untranslated STAT-004 option/,
);
const wrongIndex = (source.correctIndex + 1) % 4;
assert.throws(
  () =>
    renderStat004Native(
      {
        ...source,
        correctIndex: wrongIndex,
        answer: source.options[wrongIndex]!,
      },
      "hi",
    ),
  /semantic answer mismatch/,
);

const batch = await generateStat004QuestionStudioBatch({ seed: "identity" });
assert.throws(() =>
  localizeStat004Batch(
    {
      ...batch,
      questions: [{ ...batch.questions[0], sourceQuestionId: "wrong" }],
    },
    "hi",
  ),
);
for (const contractId of [
  "FREQUENCY_TABLE_CHECK",
  "BUILD_A_BASIC_FREQUENCY_TABLE",
] as const) {
  const source = generateStat004Question({
    seed: "fact-isolation",
    contractId,
    examProfile: "SSC_CGL_JSO",
  });
  const original = renderStat004Native(source, "hi");
  const expectedStem = original.stem;
  if (original.facts.kind === "FREQUENCY_TABLE_CHECK")
    (original.facts.frequencies as number[])[0] = 999;
  else if (original.facts.kind === "BUILD_A_BASIC_FREQUENCY_TABLE")
    (original.facts.values as number[])[0] = 999;
  const replay = renderStat004Native(source, "hi");
  assert.equal(
    replay.stem,
    expectedStem,
    "A returned review fact must not mutate future seeded generation",
  );
  assert.equal(replay.answer, source.answer);
}
console.log(
  JSON.stringify({
    status: "PASS_STAT004_NATIVE_REVIEW_V1",
    qls: 15,
    englishQuestions,
    nativeQuestions,
    qlProfileLanguageCombinations: combinations.size,
    authoredFactVariants: variants.size,
    sourceAnswerPositions: positions.size,
    englishBaselineSha256:
      "f832650232b32d9c867e1e038526ff9483ff2931939c757f77c2cb7785f4f4b2",
    humanLiveVerification: "DEFERRED",
  }),
);
