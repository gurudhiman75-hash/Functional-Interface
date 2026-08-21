import assert from "node:assert/strict";

import {
  listRnk001QuestionStudioQlIds,
  previewRnk001QuestionStudioReview,
  RNK_001_QUESTION_STUDIO_LANGUAGES,
  RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE,
} from "./question-studio-review";
import {
  previewRnk001QuestionStudioReview as previewEnglishLegacy,
} from "./question-studio-english-review-v1";
import {
  generateQuestion,
  listQuestionStudioPackages,
} from "../../../question-studio/shared-generation-engine";

const HINDI = /[\u0900-\u097F]/u;
const PUNJABI = /[\u0A00-\u0A7F]/u;
const ARRANGEMENT_QLS = new Set(
  Array.from({ length: 8 }, (_, index) => `RNK-QL-${String(index + 27).padStart(3, "0")}`),
);

type AnyQuestion = Record<string, any>;

function sourceFingerprint(question: AnyQuestion): string {
  const source = question.source as AnyQuestion;
  return String(
    source.permanentRuntimeFingerprint
      ?? source.mathematicalFingerprint
      ?? source.normalizedLearnerFingerprint
      ?? source.learnerFingerprint
      ?? source.localizationProof?.canonicalSemanticFingerprint
      ?? "",
  );
}

function one(qlId: string, language: "en" | "hi" | "pa", examProfileId: any = "CHAPTER_COVERAGE") {
  return previewRnk001QuestionStudioReview({
    qlId,
    language,
    examProfileId,
    seed: `rnk-multilingual-activation:${qlId}`,
    count: 1,
  }).questions[0] as AnyQuestion;
}

async function main() {
  assert.deepEqual([...RNK_001_QUESTION_STUDIO_LANGUAGES], ["en", "hi", "pa"]);
  assert.deepEqual([...RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLanguages], ["en", "hi", "pa"]);
  assert.equal(RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.multilingualContentFreeze, true);
  assert.equal(RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.hindiContentApproved, true);
  assert.equal(RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.punjabiContentApproved, true);
  assert.equal(RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.englishOnlyUntilMultilingualConsolidation, false);
  assert.equal(RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
  assert.equal(RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
  assert.equal(RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
  assert.equal(RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
  assert.equal(RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

  const qlIds = listRnk001QuestionStudioQlIds();
  assert.equal(qlIds.length, 42);
  assert.equal(qlIds[0], "RNK-QL-001");
  assert.equal(qlIds[41], "RNK-QL-042");
  assert.equal(qlIds.includes("RNK-QL-043"), false);

  for (const qlId of qlIds) {
    const english = one(qlId, "en");
    const hindi = one(qlId, "hi");
    const punjabi = one(qlId, "pa");
    const legacy = previewEnglishLegacy({
      qlId,
      language: "en",
      seed: `rnk-multilingual-activation:${qlId}`,
      count: 1,
    }).questions[0] as AnyQuestion;

    assert.equal(english.stem, legacy.stem, `${qlId} English stem changed`);
    assert.deepEqual(english.options, legacy.options, `${qlId} English options changed`);
    assert.equal(english.correctIndex, legacy.correctIndex, `${qlId} English answer index changed`);

    assert.equal(english.correctIndex, hindi.correctIndex, `${qlId} Hindi answer index drift`);
    assert.equal(english.correctIndex, punjabi.correctIndex, `${qlId} Punjabi answer index drift`);
    assert.equal(sourceFingerprint(english), sourceFingerprint(hindi), `${qlId} Hindi source fingerprint drift`);
    assert.equal(sourceFingerprint(english), sourceFingerprint(punjabi), `${qlId} Punjabi source fingerprint drift`);

    assert.equal(hindi.language, "hi");
    assert.equal(hindi.locale, "hi-IN");
    assert.equal(punjabi.language, "pa");
    assert.equal(punjabi.locale, "pa-IN");
    assert.match(`${hindi.stem}\n${hindi.options.join(" ")}\n${hindi.explanation}`, HINDI, `${qlId} Hindi learner surface missing Devanagari`);
    assert.match(`${punjabi.stem}\n${punjabi.options.join(" ")}\n${punjabi.explanation}`, PUNJABI, `${qlId} Punjabi learner surface missing Gurmukhi`);
    assert.equal(hindi.validation.valid, true, `${qlId} Hindi validation failed`);
    assert.equal(punjabi.validation.valid, true, `${qlId} Punjabi validation failed`);
    assert.equal(hindi.optionCount, 4, `${qlId} Hindi generic review option count`);
    assert.equal(punjabi.optionCount, 4, `${qlId} Punjabi generic review option count`);

    if (ARRANGEMENT_QLS.has(qlId)) {
      const hiClues = String(hindi.stem).split("\n").filter((line) => line.trim().startsWith("- ")).length;
      const paClues = String(punjabi.stem).split("\n").filter((line) => line.trim().startsWith("- ")).length;
      assert.ok(hiClues >= 4, `${qlId} Hindi displayed clue count too small`);
      assert.ok(paClues >= 4, `${qlId} Punjabi displayed clue count too small`);
      assert.match(hindi.explanation, /पहली तुलना से:/u, `${qlId} Hindi first-clue construction missing`);
      assert.match(punjabi.explanation, /ਪਹਿਲੀ ਤੁਲਨਾ ਤੋਂ:/u, `${qlId} Punjabi first-clue construction missing`);
      assert.match(hindi.explanation, /सभी संबंध जोड़ने पर पूरा क्रम है:/u, `${qlId} Hindi final order missing`);
      assert.match(punjabi.explanation, /ਸਾਰੇ ਸੰਬੰਧ ਜੋੜਨ ਤੋਂ ਬਾਅਦ ਪੂਰਾ ਕ੍ਰਮ ਹੈ:/u, `${qlId} Punjabi final order missing`);
      assert.ok(hindi.explanation.split("\n").length >= hiClues + 2, `${qlId} Hindi construction not step-complete`);
      assert.ok(punjabi.explanation.split("\n").length >= paClues + 2, `${qlId} Punjabi construction not step-complete`);
    }
  }

  for (const qlId of ["RNK-QL-001", "RNK-QL-027", "RNK-QL-036", "RNK-QL-042"]) {
    const en = one(qlId, "en", "IBPS_PO_PRE");
    const hi = one(qlId, "hi", "IBPS_PO_PRE");
    const pa = one(qlId, "pa", "IBPS_PO_PRE");
    for (const question of [en, hi, pa]) {
      assert.equal(question.optionCount, 5, `${qlId} banking five-option projection missing`);
      assert.equal(question.correctIndex, en.correctIndex, `${qlId} banking correct index moved`);
      assert.notEqual(question.correctIndex, 4, `${qlId} delivery-only fifth option became correct`);
    }
    assert.equal(en.options[4], "None of these");
    assert.equal(hi.options[4], "इनमें से कोई नहीं");
    assert.equal(pa.options[4], "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ");
  }

  assert.throws(
    () => previewRnk001QuestionStudioReview({ qlId: "RNK-QL-043", language: "hi", count: 1 }),
    /Unsupported RNK-001 QL/u,
  );

  const capability = (listQuestionStudioPackages() as AnyQuestion[])
    .find((entry) => entry.packageId === "RNK-001");
  assert.ok(capability, "RNK-001 shared Question Studio capability missing");
  assert.deepEqual(capability.supportedLanguages, ["en", "hi", "pa"]);
  assert.equal(capability.englishOnlyUntilMultilingualConsolidation, false);
  assert.equal(capability.questionBankWritable, false);
  assert.equal(capability.publiclyPublishable, false);

  for (const language of ["hi", "pa"] as const) {
    const generated = await generateQuestion({
      packageId: "RNK-001",
      patternId: "RNK-QL-029",
      language,
      examProfileId: "PUNJAB_PSSSB_CLERK",
      seed: `shared-rnk-multilingual:${language}`,
      count: 1,
    }) as AnyQuestion;
    assert.equal(generated.questionPackages.length, 1);
    assert.equal(generated.questions.length, 1);
    assert.equal(generated.generationContext.language, language);
    assert.equal(generated.generationContext.englishOnlyUntilMultilingualConsolidation, false);
    assert.equal(generated.generationContext.questionBankWritable, false);
    assert.equal(generated.generationContext.testEligible, false);
    assert.equal(generated.generationContext.mockTestEligible, false);
    assert.equal(generated.generationContext.publiclyPublishable, false);
    assert.equal(generated.questions[0].language, language);
    assert.equal(generated.questions[0].questionBankWritable, false);
    assert.equal(generated.questions[0].testEligible, false);
    assert.equal(generated.questions[0].mockTestEligible, false);
    assert.equal(generated.questions[0].publiclyPublishable, false);
    assert.match(generated.questions[0].explanation, language === "hi" ? /पहली तुलना से:/u : /ਪਹਿਲੀ ਤੁਲਨਾ ਤੋਂ:/u);
  }

  console.log(JSON.stringify({
    status: "PASS",
    authority: "RNK-001-QUESTION-STUDIO-MULTILINGUAL-REVIEW-V1",
    qls: qlIds.length,
    languages: ["en", "hi", "pa"],
    directQlLanguageProjections: qlIds.length * 3,
    nativeArrangementQls: [...ARRANGEMENT_QLS],
    bankingLocalesChecked: 3,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    ql043Allocated: false,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
