import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  generateStat001QuestionStudioBatch as a,
  stat001QuestionStudioPackageCard as ca,
} from "../STAT-001/question-studio-adapter";
import {
  generateStat002QuestionStudioBatch as b,
  stat002QuestionStudioPackageCard as cb,
} from "../STAT-002/question-studio-adapter";
import {
  generateStat003QuestionStudioBatch as c,
  stat003QuestionStudioPackageCard as cc,
} from "../STAT-003/question-studio-adapter";
import {
  localizeStatisticsFoundationBatch,
  normalizeStatisticsFoundationLanguage,
  renderStatisticsFoundationNative,
} from "./foundation-native-v1";

const englishHashes = [
  "1020d7aca15421899b223a37ff0832391ea248e785f0ae2f9a7653a3c8a5cdea",
  "b626a92a1d00e5a3d83bda0cc4f1375a41f9b90601f18c54f184e1736be429d0",
  "092fe74b8fd97619cd75d381aa533b4f4fa29a8d461e0d079c7b9a396d14641e",
];
const locks = [
  "questionBankWritable",
  "testEligible",
  "mockTestEligible",
  "publiclyPublishable",
  "automaticStudentPublication",
  "productionReleaseAuthorized",
];
let nativeQuestions = 0,
  englishQuestions = 0;
const seen = new Set<string>();
for (const [i, fn] of [a, b, c].entries()) {
  const card = [ca, cb, cc][i]!();
  assert.deepEqual(card.supportedLanguages, ["en", "hi", "pa"]);
  assert(
    card.qls.every((ql) => ql.localizationStatus === "HI_PA_REVIEW_CANDIDATE"),
  );
  const h = createHash("sha256");
  for (const examProfile of ["SSC_CGL_TIER_II", "SSC_CGL_JSO"])
    for (let seed = 0; seed < 10; seed++) {
      const req = {
        seed: `STAT-FOUNDATION-ENGLISH:${seed}`,
        examProfile,
        count: 24,
      };
      const en = await fn(req);
      englishQuestions += en.questions.length;
      h.update(
        JSON.stringify({
          questions: en.questions,
          questionPackages: en.questionPackages,
        }),
      );
      for (const language of ["hi", "pa"] as const) {
        const result = await fn({ ...req, language });
        assert.deepEqual(
          result.questionPackages,
          en.questionPackages,
          "Source mathematical authorities must remain byte identical",
        );
        assert.equal(result.generationContext.language, language);
        assert.equal(
          result.generationContext.reviewStatus,
          "NATIVE_REVIEW_CANDIDATE",
        );
        assert.equal(
          result.generationContext.sourceReleaseId,
          en.generationContext.releaseId,
        );
        for (const [j, q] of result.questions.entries()) {
          const source = en.questions[j]!;
          seen.add(`${language}:${examProfile}:${q.permanentQlId}`);
          nativeQuestions++;
          for (const key of [
            "state",
            "options",
            "correct",
            "correctIndex",
            "answer",
            "canonicalAnswer",
            "seed",
            "sourceQuestionId",
            "permanentQlId",
            "difficulty",
            "solveMode",
            "validation",
          ])
            assert.deepEqual(
              q[key],
              source[key],
              `Language changed mathematical field ${key}`,
            );
          assert.equal(q.language, language);
          assert.equal(q.questionId, `${source.questionId}:${language}`);
          assert.equal(q.text, q.stem);
          assert.notEqual(q.stem, source.stem);
          assert.match(
            q.stem,
            language === "hi" ? /[\u0900-\u097f]/u : /[\u0a00-\u0a7f]/u,
          );
          assert.match(
            q.richExplanation.keyIdea,
            language === "hi" ? /[\u0900-\u097f]/u : /[\u0a00-\u0a7f]/u,
          );
          assert(
            !/\b(mean|median|mode|frequency|answer|standard|deviation|distribution|value|class)\b/i.test(
              q.stem + q.explanation,
            ),
          );
          assert(q.richExplanation.steps.length >= 2);
          for (const object of [q, q.metadata, q.traceability]) {
            assert.equal(object.language, language);
            assert.equal(object.reviewStatus, "NATIVE_REVIEW_CANDIDATE");
            assert.equal(
              object.releaseId,
              `${q.packageId}_FOUNDATION_NATIVE_REVIEW_V1`,
            );
            assert.equal(object.sourceReleaseId, source.releaseId);
          }
          for (const flag of locks) assert.equal(q[flag], false);
          assert.equal(q.manualApprovalRequired, true);
          assert(
            q.optionMetadata.every((o: any) => !("derivation" in o)),
            "Untranslated audit derivations must stay in source packages",
          );
        }
        const replay = await fn({ ...req, language });
        assert.deepEqual(replay.questions, result.questions);
      }
    }
  assert.equal(
    h.digest("hex"),
    englishHashes[i],
    "English source and previews drifted from the pre-change baseline",
  );
  const hi = await fn({ seed: "alias", language: "hi-IN" });
  const canonical = await fn({ seed: "alias", language: "hi" });
  assert.deepEqual(hi.questions, canonical.questions);
  await assert.rejects(() => fn({ language: "fr" }));
}
assert.equal(seen.size, 80, "20 QLs × 2 profiles × 2 native languages");
assert.equal(normalizeStatisticsFoundationLanguage("PA-in"), "pa");
for (const value of [null, [], 5, {}, "", "gu"])
  assert.throws(() => normalizeStatisticsFoundationLanguage(value));
assert.throws(() =>
  renderStatisticsFoundationNative(
    { kind: "SIMPLE_MEAN_RAW", values: [2, 4] },
    "hi",
    "STAT-QL-007",
  ),
);
const en = await a({ seed: "mutation" });
assert.throws(() =>
  localizeStatisticsFoundationBatch(
    { ...en, questions: [{ ...en.questions[0], answer: "999999" }] },
    "hi",
  ),
);
assert.throws(() =>
  localizeStatisticsFoundationBatch(
    {
      ...en,
      questions: [{ ...en.questions[0], validation: { valid: false } }],
    },
    "pa",
  ),
);
// Fixed edge facts bind translation wording to task direction, parameters and rounding.
const corrected = renderStatisticsFoundationNative(
  {
    kind: "CORRECTED_MEAN",
    observationCount: 10,
    reportedMean: 20,
    wrongValue: 35,
    correctValue: 15,
  },
  "hi",
  "STAT-QL-003",
);
assert.equal(corrected.answer, "18");
assert.match(corrected.stem, /15 के बजाय 35/);
const reverse = renderStatisticsFoundationNative(
  {
    kind: "REVERSE_SCALE",
    originalStandardDeviation: 4,
    transformedStandardDeviation: 12,
  },
  "pa",
  "STAT-QL-011",
);
assert.equal(reverse.answer, "3");
assert.match(reverse.stem, /k ਧਨਾਤਮਕ/);
const grouped = renderStatisticsFoundationNative(
  {
    kind: "GROUPED_FREQUENCY_MEDIAN",
    classes: [
      { lower: 0, upper: 10, frequency: 2 },
      { lower: 10, upper: 20, frequency: 7 },
      { lower: 20, upper: 30, frequency: 2 },
    ],
  },
  "hi",
  "STAT-QL-016",
);
assert.equal(grouped.answer, "15");
assert.match(grouped.stem, /\[10, 20\)/);
const rounded = renderStatisticsFoundationNative(
  {
    kind: "GROUPED_FREQUENCY_MEAN",
    classes: [
      { lower: 0, upper: 10, frequency: 1 },
      { lower: 10, upper: 20, frequency: 2 },
    ],
  },
  "pa",
  "STAT-QL-014",
);
assert.equal(rounded.answer, "11.67");
assert.match(rounded.explanation.steps.at(-1)!, /≈ 11.67/);
const even = renderStatisticsFoundationNative(
  {
    kind: "DISCRETE_FREQUENCY_MEDIAN",
    rows: [
      { value: 2, frequency: 2 },
      { value: 8, frequency: 2 },
    ],
  },
  "hi",
  "STAT-QL-015",
);
assert.equal(even.answer, "5");
console.log(
  JSON.stringify({
    status: "PASS_STATISTICS_FOUNDATION_NATIVE_V1",
    qls: 20,
    profiles: 2,
    languages: ["hi", "pa"],
    englishQuestions,
    nativeQuestions,
    coveredQlProfileLanguages: seen.size,
    englishBaselineHashes: englishHashes,
    humanLiveVerification: "DEFERRED",
  }),
);
