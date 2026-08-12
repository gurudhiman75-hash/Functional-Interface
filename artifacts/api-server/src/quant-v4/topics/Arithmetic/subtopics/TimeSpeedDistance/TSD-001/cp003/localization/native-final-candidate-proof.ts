import { generateCp003EnglishFrozenRecords } from "../english-frozen";
import { stableCp003Stringify } from "../runtime";
import {
  generateCp003AllFinalNativeReviewCandidates,
  generateCp003FinalNativeReviewCandidate,
  localizeCp003NativeWrongCalculation,
  TSD_CP003_NATIVE_FINAL_REVIEW_STATUS,
} from "./native-final-candidate";
import { assertTsdCp003NativeText } from "./native-language-primitives";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const frozen = generateCp003EnglishFrozenRecords();
const frozenIdentity = stableCp003Stringify(frozen);
const hi = generateCp003FinalNativeReviewCandidate("hi");
const pa = generateCp003FinalNativeReviewCandidate("pa");
const all = generateCp003AllFinalNativeReviewCandidates();

assert(frozen.length === 63, `Expected 63 frozen English rows, received ${frozen.length}`);
assert(hi.length === 63 && pa.length === 63 && all.length === 126, "Final native candidate must contain 63 Hindi and 63 Punjabi rows");
assert(stableCp003Stringify(generateCp003EnglishFrozenRecords()) === frozenIdentity, "Frozen English corpus changed while building final native review candidate");

const sourceById = new Map(frozen.map((row) => [row.questionLanguageId, row] as const));
let optionAnalyses = 0;
let wrongWorkings = 0;
let correctWorkings = 0;
let calculationParityChecks = 0;

for (const row of all) {
  const { source, presentation, finalNativeReview } = row;
  const canonical = sourceById.get(presentation.sourceQuestionLanguageId);
  assert(canonical, `${presentation.questionLanguageId}: frozen English source missing`);
  assert(canonical.lifecycle.englishFreezeStatus === "FROZEN", `${presentation.questionLanguageId}: English source is not frozen`);
  assert(presentation.permanentQlId === canonical.permanentQlId, `${presentation.questionLanguageId}: QL drift`);
  assert(presentation.authorityKey === canonical.authorityKey, `${presentation.questionLanguageId}: authority drift`);
  assert(presentation.seed === canonical.seed, `${presentation.questionLanguageId}: seed drift`);
  assert(presentation.solveMode === canonical.solveMode, `${presentation.questionLanguageId}: solve-mode drift`);
  assert(presentation.representation === canonical.representation, `${presentation.questionLanguageId}: representation drift`);
  assert(presentation.correctIndex === canonical.correctIndex, `${presentation.questionLanguageId}: correct-index drift`);
  assert(presentation.mathematicalFingerprint === canonical.mathematicalFingerprint, `${presentation.questionLanguageId}: mathematical fingerprint drift`);
  assert(presentation.parity.inputIdentity === stableCp003Stringify(canonical.input), `${presentation.questionLanguageId}: input identity drift`);
  assert(presentation.parity.solutionIdentity === stableCp003Stringify(canonical.solution), `${presentation.questionLanguageId}: solution identity drift`);
  assert(presentation.options.length === 4 && new Set(presentation.options).size === 4, `${presentation.questionLanguageId}: option integrity failed`);
  assert(presentation.options[presentation.correctIndex] === presentation.answerText, `${presentation.questionLanguageId}: answer/correct-option mismatch`);

  assert(finalNativeReview.status === TSD_CP003_NATIVE_FINAL_REVIEW_STATUS, `${presentation.questionLanguageId}: final review status drift`);
  assert(finalNativeReview.solePublicNativeEntryPoint === true, `${presentation.questionLanguageId}: final surface is not marked as sole public native entry point`);
  assert(finalNativeReview.explanationContract === "METHOD_STEPS_SHORTCUT_OPTION_WORKING_ANALYSIS_ANSWER", `${presentation.questionLanguageId}: final explanation contract drift`);
  assert(finalNativeReview.exactWrongWorkingLocalized === true, `${presentation.questionLanguageId}: exact wrong-working localization not asserted`);
  assert(finalNativeReview.productOwnerApprovalRecorded === false, `${presentation.questionLanguageId}: product-owner approval fabricated`);
  assert(finalNativeReview.multilingualFreezeAuthorized === false, `${presentation.questionLanguageId}: multilingual freeze authorized prematurely`);
  assert(finalNativeReview.sourceMathChanged === false, `${presentation.questionLanguageId}: source math changed`);

  assert(presentation.lifecycle.nativeEditorialStatus === TSD_CP003_NATIVE_FINAL_REVIEW_STATUS, `${presentation.questionLanguageId}: lifecycle native status drift`);
  assert(presentation.lifecycle.multilingualFreezeStatus === "UNFROZEN", `${presentation.questionLanguageId}: multilingual content frozen prematurely`);
  assert(presentation.lifecycle.questionStudioEnabled === false, `${presentation.questionLanguageId}: Question Studio unlocked prematurely`);
  assert(presentation.lifecycle.questionBankStatus === "NOT_STORED", `${presentation.questionLanguageId}: Question Bank unlocked prematurely`);
  assert(presentation.lifecycle.testEligibility === "INELIGIBLE", `${presentation.questionLanguageId}: tests unlocked prematurely`);
  assert(presentation.lifecycle.publiclyPublishable === false, `${presentation.questionLanguageId}: public delivery unlocked prematurely`);

  const analyses = presentation.explanation.optionAnalysis;
  assert(analyses.length === 4, `${presentation.questionLanguageId}: expected four final option analyses`);
  assert(analyses.filter((entry) => entry.isCorrect).length === 1, `${presentation.questionLanguageId}: final option analyses must contain exactly one correct option`);
  assert(analyses[presentation.correctIndex]?.isCorrect === true, `${presentation.questionLanguageId}: correct option analysis misaligned`);

  analyses.forEach((entry, index) => {
    const audit = canonical.optionAudit[index];
    assert(audit, `${presentation.questionLanguageId}/${entry.option}: source option audit missing`);
    assert(entry.option === String.fromCharCode(65 + index), `${presentation.questionLanguageId}: option label drift at index ${index}`);
    assert(entry.text === presentation.options[index], `${presentation.questionLanguageId}/${entry.option}: option text drift`);
    assert(entry.misconceptionId === audit.misconceptionId, `${presentation.questionLanguageId}/${entry.option}: misconception ID drift`);
    assert(entry.isCorrect === audit.isCorrect, `${presentation.questionLanguageId}/${entry.option}: correctness drift`);
    assertTsdCp003NativeText(entry.reason, presentation.language, `${presentation.questionLanguageId}/${entry.option}/reason`);

    if (audit.isCorrect) {
      assert(entry.wrongWorking === null, `${presentation.questionLanguageId}/${entry.option}: correct option exposes wrong working`);
      correctWorkings += 1;
    } else {
      assert(audit.wrongWorking, `${presentation.questionLanguageId}/${entry.option}: source wrong working missing`);
      const expected = localizeCp003NativeWrongCalculation(audit.wrongWorking.calculation, presentation.language);
      assert(entry.wrongWorking === expected, `${presentation.questionLanguageId}/${entry.option}: localized wrong-working calculation drift`);
      assertTsdCp003NativeText(entry.wrongWorking, presentation.language, `${presentation.questionLanguageId}/${entry.option}/wrong-working`);
      assert(!/[A-Za-z]{2,}/u.test(entry.wrongWorking.replace(/km\/h|km|AM|PM/gu, "")), `${presentation.questionLanguageId}/${entry.option}: unexpected English remains in localized wrong working`);
      wrongWorkings += 1;
      calculationParityChecks += 1;
    }
    optionAnalyses += 1;
  });
}

assert(optionAnalyses === 504, `Expected 504 option analyses, received ${optionAnalyses}`);
assert(correctWorkings === 126, `Expected 126 correct options without wrong workings, received ${correctWorkings}`);
assert(wrongWorkings === 378, `Expected 378 localized exact wrong workings, received ${wrongWorkings}`);
assert(calculationParityChecks === 378, `Expected 378 wrong-working calculation parity checks, received ${calculationParityChecks}`);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_HI_PA_FINAL_PUBLIC_NATIVE_REVIEW_CANDIDATE",
  frozenEnglishRows: frozen.length,
  hindiRows: hi.length,
  punjabiRows: pa.length,
  nativeRows: all.length,
  optionAnalyses,
  localizedExactWrongWorkings: wrongWorkings,
  calculationParityChecks,
  explanationContract: "METHOD_STEPS_SHORTCUT_OPTION_WORKING_ANALYSIS_ANSWER",
  nativeEditorialStatus: TSD_CP003_NATIVE_FINAL_REVIEW_STATUS,
  frozenEnglishCorpusChanged: false,
  productOwnerApprovalRecorded: false,
  multilingualFreezeAuthorized: false,
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
