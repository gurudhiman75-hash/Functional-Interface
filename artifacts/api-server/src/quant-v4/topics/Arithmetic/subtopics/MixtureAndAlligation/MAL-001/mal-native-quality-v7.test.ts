import assert from "node:assert/strict";
import { runMal001QuestionStudioPipeline as run } from "./question-studio-adapter";
import { applyMal001QuestionStudioLocalizationV6 as oldLocalize } from "./foundation/chapter-multilingual-question-studio-v6";
import { generateMal001StandardQuestionStudioBatch as batch } from "./question-studio-standard-integration";

const commands = (v: unknown): string[] => {
  if (typeof v === "string")
    return [...v.matchAll(/\\([A-Za-z]+|[\u0900-\u097f\u0a00-\u0a7f]+)/g)]
      .map((m) => m[1]!)
      .filter((x) => !["text"].includes(x));
  if (Array.isArray(v)) return v.flatMap(commands);
  if (v && typeof v === "object") return Object.values(v).flatMap(commands);
  return [];
};
const numerical = (s: string) => s.match(/\d+(?:\.\d+)?/g) ?? [];
const cpFor = (i: number) =>
  `MAL-CP-${String(i <= 11 ? 1 : i <= 28 ? 2 : i <= 37 ? 3 : i <= 47 ? 4 : i <= 60 ? 5 : 6).padStart(3, "0")}`;
const repairs = new Set<string>(),
  pending = new Set<string>();
let checked = 0,
  legacyBrokenCommands = 0;
for (let i = 1; i <= 67; i++)
  for (let sample = 0; sample < (i >= 12 && i <= 28 ? 60 : 12); sample++) {
    const ql = `MAL-QL-${String(i).padStart(3, "0")}`;
    const input = { questionLanguageId: ql, seed: `V7:${i}:${sample}` };
    const english = run(cpFor(i) as any, { ...input, language: "en" });
    if (i === 67)
      assert(
        /empty/iu.test(english.stem),
        "C must explicitly start empty for the downstream sample-ratio inference",
      );
    const snapshot = JSON.stringify(english, (_, v) =>
      typeof v === "bigint" ? String(v) : v,
    );
    for (const language of ["hi", "pa"] as const) {
      const native = run(cpFor(i) as any, { ...input, language });
      const previous = oldLocalize(english, language);
      assert.equal(
        JSON.stringify(english, (_, v) =>
          typeof v === "bigint" ? String(v) : v,
        ),
        snapshot,
      );
      assert.equal(native.correctIndex, english.correctIndex);
      assert.equal(native.options[native.correctIndex], native.answer);
      assert.equal(native.options.length, 4);
      assert.equal(new Set(native.options).size, 4);
      assert.equal(native.questionLanguageId, ql);
      assert.deepEqual(numerical(native.answer), numerical(english.answer));
      for (let index = 0; index < 4; index++)
        assert.deepEqual(
          numerical(native.options[index]!),
          numerical(english.options[index]!),
        );
      assert.deepEqual(
        native.parameters,
        english.parameters,
        "Native delivery must preserve source parameter state",
      );
      assert.equal(
        native.traceability.nativeQualityRevision,
        "MAL-NATIVE-QUALITY-V7",
      );
      // Formula syntax is compared with the actual source, including optional help.
      assert.deepEqual(
        commands(native.explanation),
        commands(english.explanation),
        `${ql}/${language}: formula command changed`,
      );
      if (
        JSON.stringify(commands(previous.explanation)) !==
        JSON.stringify(commands(english.explanation))
      )
        legacyBrokenCommands++;
      assert(!/[\uE000\uE001]/.test(JSON.stringify(native)));
      assert(
        (language === "hi" ? /[\u0900-\u097f]/ : /[\u0a00-\u0a7f]/).test(
          native.stem,
        ),
      );
      if (
        native.traceability.nativeStemAuthored &&
        !previous.traceability.nativeStemTemplateMatched &&
        i > 11
      )
        repairs.add(ql);
      if (i >= 12 && i <= 28)
        assert.equal(
          native.traceability.nativeStemAuthored,
          true,
          `${ql}: CP002 must use an authored native stem`,
        );
      if (!native.traceability.nativeStemAuthored) pending.add(ql);
      checked++;
    }
  }
assert(
  legacyBrokenCommands > 0,
  "The audit must reproduce the old formula defect",
);
assert(repairs.size >= 20);
for (const language of ["en", "hi", "pa"] as const) {
  const request = { language, count: 1000, seed: "MAL-V7-MAX" };
  const result = await batch(request);
  assert.equal(result.questions.length, 1000);
  assert.equal(new Set(result.questions.map((q) => q.questionId)).size, 1000);
  assert.equal(
    new Set(result.questions.map((q) => q.canonicalProblemId)).size,
    6,
  );
  if (language !== "en")
    assert.equal(
      result.generationContext.reviewStatus,
      "NATIVE_QUALITY_REVIEW_CANDIDATE",
    );
  for (const q of result.questions) {
    assert.equal(q.questionBankWritable, false);
    assert.equal(q.testEligible, false);
    assert.equal(q.mockTestEligible, false);
    assert.equal(q.productionReleaseAuthorized, false);
    assert.equal(q.publiclyPublishable, false);
    assert.equal(q.manualApprovalRequired, true);
  }
  const one = await batch({ ...request, count: 20 }),
    two = await batch({ ...request, count: 20 });
  assert.deepEqual(one.questions, two.questions);
}
console.log(
  "MAL_NATIVE_QUALITY_V7",
  JSON.stringify({
    trilingualSourceQuestions: (checked * 3) / 2,
    nativeQuestions: checked,
    legacyBrokenCommands,
    repairedQlStemFamilies: repairs.size,
    pendingNativeStemQls: [...pending].sort(),
    maxBatch: 1000,
    lifecycleLocked: true,
  }),
);
