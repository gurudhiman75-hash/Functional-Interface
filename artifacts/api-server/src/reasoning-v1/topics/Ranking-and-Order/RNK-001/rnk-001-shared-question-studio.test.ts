import assert from "node:assert/strict";

import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../question-studio-review-registry";
import {
  generateQuestion as generateSharedQuestionStudioQuestion,
  listQuestionStudioPackages,
} from "../../../../question-studio/shared-generation-engine";
import {
  previewRnk001QuestionStudioReview as previewEnglishAuthority,
} from "./question-studio-review-english-v1";
import {
  RNK_001_QUESTION_STUDIO_RELEASE_FREEZE,
  RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  listRnk001QuestionStudioQlIds,
  previewRnk001QuestionStudioReview,
} from "./question-studio-review";
import { buildRnkCp007PercentagePresentationBankV2 } from "./RNK-CP-007/cp007-percentage-presentation-adapter-v2";

const DEVANAGARI = /[\u0900-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;

async function run() {
  const qls = listRnk001QuestionStudioQlIds();
  assert.equal(qls.length, 42);
  assert.deepEqual(qls, Array.from({ length: 42 }, (_, index) => `RNK-QL-${String(index + 1).padStart(3, "0")}`));
  assert.equal(qls.includes("RNK-QL-043"), false);

  const registry = listReasoningV1QuestionStudioReviewPackages();
  const registered = registry.find((entry) => entry.packageId === "RNK-001") as any;
  assert.ok(registered);
  assert.equal(registered.reviewOnly, true);
  assert.deepEqual(registered.supportedLanguages, ["en", "hi", "pa"]);
  assert.equal(registered.questionBankWritable, false);
  assert.equal(registered.testEligible, false);
  assert.equal(registered.mockTestEligible, false);
  assert.equal(registered.publiclyPublishable, false);
  assert.equal(registered.releaseFreezeStatus, RNK_001_QUESTION_STUDIO_RELEASE_FREEZE);
  assert.ok(listEnabledReasoningV1QuestionStudioPackages().some((entry) => entry.packageId === "RNK-001"));

  const englishBase = previewEnglishAuthority({
    language: "en",
    examProfileId: "CHAPTER_COVERAGE",
    count: 42,
    seed: "rnk-multilingual-all-ql",
  });
  const english = previewRnk001QuestionStudioReview({
    language: "en",
    examProfileId: "CHAPTER_COVERAGE",
    count: 42,
    seed: "rnk-multilingual-all-ql",
  });
  assert.deepEqual(english.questions, englishBase.questions, "English learner questions must remain unchanged by multilingual activation");

  const hindi = previewRnk001QuestionStudioReview({
    language: "hi",
    examProfileId: "CHAPTER_COVERAGE",
    count: 42,
    seed: "rnk-multilingual-all-ql",
  });
  const punjabi = previewRnk001QuestionStudioReview({
    language: "pa",
    examProfileId: "CHAPTER_COVERAGE",
    count: 42,
    seed: "rnk-multilingual-all-ql",
  });

  for (let index = 0; index < 42; index += 1) {
    const en = english.questions[index]!;
    const hi = hindi.questions[index]!;
    const pa = punjabi.questions[index]!;
    assert.equal(en.qlId, qls[index]);
    assert.equal(hi.qlId, en.qlId);
    assert.equal(pa.qlId, en.qlId);
    assert.equal(hi.language, "hi");
    assert.equal(hi.locale, "hi-IN");
    assert.equal(pa.language, "pa");
    assert.equal(pa.locale, "pa-IN");
    assert.equal(hi.correctIndex, en.correctIndex, `${en.qlId} Hindi correct index drift`);
    assert.equal(pa.correctIndex, en.correctIndex, `${en.qlId} Punjabi correct index drift`);
    assert.equal(hi.optionCount, 4, `${en.qlId} Hindi canonical option count`);
    assert.equal(pa.optionCount, 4, `${en.qlId} Punjabi canonical option count`);
    assert.equal(hi.validation.valid, true, hi.questionId);
    assert.equal(pa.validation.valid, true, pa.questionId);
    assert.ok(DEVANAGARI.test(`${hi.stem}\n${hi.explanation}`), `${en.qlId} Hindi learner surface must be native`);
    assert.ok(GURMUKHI.test(`${pa.stem}\n${pa.explanation}`), `${en.qlId} Punjabi learner surface must be native`);
  }

  for (const language of ["hi", "pa"] as const) {
    const bank = previewRnk001QuestionStudioReview({
      language,
      examProfileId: "IBPS_PO_PRE",
      qlId: "RNK-QL-027",
      count: 6,
      seed: `rnk-bank-${language}`,
    });
    assert.ok(bank.questions.every((question) => question.optionCount === 5));
    const fifth = language === "hi" ? "इनमें से कोई नहीं" : "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ";
    assert.ok(bank.questions.every((question) => question.options[4] === fifth));
    assert.ok(bank.questions.every((question) => question.validation.valid));
  }

  const percentageHi = buildRnkCp007PercentagePresentationBankV2("hi-IN") as readonly any[];
  const percentagePa = buildRnkCp007PercentagePresentationBankV2("pa-IN") as readonly any[];
  assert.ok(percentageHi.length > 0);
  assert.equal(percentageHi.length, percentagePa.length);
  assert.ok(percentageHi.every((question) => question.percentagePresentation?.targetQlId === "RNK-QL-042"));
  assert.ok(percentageHi.every((question) => question.percentagePresentation?.newQlAllocated === false));
  assert.ok(percentageHi.every((question) => question.percentagePresentation?.mathematicalAuthorityChanged === false));

  assert.throws(
    () => previewRnk001QuestionStudioReview({ language: "hi", qlId: "RNK-QL-043", count: 1 }),
    /Unsupported RNK-001 QL/u,
  );
  assert.throws(
    () => persistReasoningV1QuestionStudioReview({ packageId: "RNK-001", language: "hi", count: 1 }),
    /Question Bank\/publication locks remain closed/u,
  );

  const registryPreview = previewReasoningV1QuestionStudioReview({
    packageId: "RNK-001",
    language: "pa",
    qlId: "RNK-QL-001",
    count: 1,
    seed: "rnk-registry-pa",
  });
  assert.equal(registryPreview.questions[0]!.language, "pa");

  const cockpit = listQuestionStudioPackages();
  const capability = cockpit.find((entry: any) => entry.packageId === "RNK-001") as any;
  assert.ok(capability);
  assert.deepEqual(capability.supportedLanguages, ["en", "hi", "pa"]);
  assert.equal(capability.englishOnlyUntilMultilingualConsolidation, false);
  assert.equal(capability.questionBankWritable, false);
  assert.equal(capability.publiclyPublishable, false);

  for (const language of ["hi", "pa"] as const) {
    const shared = await generateSharedQuestionStudioQuestion({
      packageId: "RNK-001",
      patternId: "RNK-QL-010",
      language,
      count: 3,
      seed: `rnk-shared-${language}`,
    });
    assert.equal(shared.questions.length, 3);
    assert.ok((shared.questions as any[]).every((question) => question.permanentQlId === "RNK-QL-010"));
    assert.ok((shared.questions as any[]).every((question) => question.language === language));
    assert.ok((shared.questions as any[]).every((question) => question.questionBankWritable === false));
    assert.ok((shared.questions as any[]).every((question) => question.testEligible === false));
    assert.ok((shared.questions as any[]).every((question) => question.mockTestEligible === false));
    assert.ok((shared.questions as any[]).every((question) => question.publiclyPublishable === false));
    assert.equal((shared.generationContext as any).englishOnlyUntilMultilingualConsolidation, false);

    const cp = await generateSharedQuestionStudioQuestion({
      packageId: "RNK-001",
      cpId: "RNK-CP-004",
      language,
      count: 6,
      seed: `rnk-cp004-${language}`,
    });
    assert.ok((cp.questions as any[]).every((question) => question.checkpointId === "RNK-CP-004"));
  }

  assert.equal(RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.percentageAdapterStatus, "V2_NATIVE_GRAMMAR_ACTIVE_REVIEW_ONLY");
  assert.equal(RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.englishOnlyUntilMultilingualConsolidation, false);

  console.log(JSON.stringify({
    status: "PASS",
    qlCount: qls.length,
    supportedLanguages: RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLanguages,
    multilingualFreeze: true,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    ql043Allocated: false,
  }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
