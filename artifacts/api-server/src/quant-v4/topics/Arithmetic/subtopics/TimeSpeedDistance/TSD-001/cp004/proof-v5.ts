import "./proof-v4";
import { TSD_CP004_AUTHORITIES } from "./authority";
import { cp004ExpectedNativeNoun } from "./native";
import { generateCp004FinalReviewEnglishCorpus, generateCp004FinalReviewStressCorpus, renderCp004FinalNativeReviewQuestion } from "./final-surface";
import { verifyCp004 } from "./verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function sentences(text: string): number {
  return text.split(/[.!?।?]+/u).map((x) => x.trim()).filter(Boolean).length;
}

const stress = generateCp004FinalReviewStressCorpus(50);
assert(stress.length === 800, `Final CP004 stress count drifted: ${stress.length}`);
let finalVerifierChecks = 0;
let authoritySpecificEnglishMethodChecks = 0;
for (const q of stress) {
  const verification = verifyCp004(q.state, q.solution);
  assert(verification.valid, `Final surface verifier failed ${q.authorityId}/${q.seed}: ${verification.errors.join("; ")}`);
  finalVerifierChecks += 1;
  assert(q.explanation.method !== "Use relative speed on a straight line.", `Generic English method remains for ${q.authorityId}`);
  authoritySpecificEnglishMethodChecks += 1;
  assert(q.options[q.correctIndex] === q.solution.answerText && new Set(q.options).size === 4, `Final surface option parity failed ${q.authorityId}/${q.seed}`);
  assert(q.permanentQlId === null && !q.questionStudioDiscoverable && q.questionBankStatus === "NOT_STORED" && q.testEligibility === "INELIGIBLE" && !q.publiclyPublishable, "Final CP004 lifecycle lock opened");
  if ((q.authorityId === "SEPARATION_AFTER_TIME" || q.authorityId === "TIME_TO_SPECIFIED_SEPARATION") && q.state.directionCase === "OPPOSITE_AWAY" && q.state.initialGapKm.numerator === 0n) {
    assert(/start from the same point/u.test(q.stem), `Final English same-point wording not applied: ${q.stem}`);
    assert(!/0 km apart/u.test(q.stem), `Final English still says 0 km apart: ${q.stem}`);
  }
  assert(!/\b(?:find|determine|locate)\b[^?]*\?$/iu.test(q.stem), `Imperative catalogue wording remains on final surface: ${q.stem}`);
}

const review = generateCp004FinalReviewEnglishCorpus();
assert(review.length === 48, `Final review English count drifted: ${review.length}`);
let nativeFinalRows = 0;
let nativeSamePointChecks = 0;
let nativeRatioPhraseChecks = 0;
let multiPursuerNeutralChecks = 0;
let finalSentenceParityChecks = 0;
for (const authority of TSD_CP004_AUTHORITIES) {
  const enRows = review.filter((q) => q.authorityId === authority.authorityId);
  assert(enRows.length === 3, `Final review authority count drifted ${authority.authorityId}`);
  for (const english of enRows) {
    for (const language of ["hi", "pa"] as const) {
      const native = renderCp004FinalNativeReviewQuestion(english, language);
      nativeFinalRows += 1;
      assert(native.stem.includes(cp004ExpectedNativeNoun(english.state, language)), `${language} final noun parity failed ${authority.authorityId}`);
      assert(native.state === english.state && native.solution === english.solution, `${language} final state/solution identity failed ${authority.authorityId}`);
      assert(native.correctIndex === english.correctIndex && native.options[native.correctIndex] === native.localizedAnswerText, `${language} final option parity failed ${authority.authorityId}`);
      if (sentences(english.stem) > 1) {
        assert(sentences(native.stem) >= sentences(english.stem), `${language} final sentence compression ${authority.authorityId}: ${english.stem} -> ${native.stem}`);
        finalSentenceParityChecks += 1;
      }
      if ((english.authorityId === "SEPARATION_AFTER_TIME" || english.authorityId === "TIME_TO_SPECIFIED_SEPARATION") && english.state.directionCase === "OPPOSITE_AWAY" && english.state.initialGapKm.numerator === 0n) {
        assert(language === "hi" ? /एक ही बिंदु से शुरू/u.test(native.stem) : /ਇੱਕੋ ਬਿੰਦੂ ਤੋਂ ਸ਼ੁਰੂ/u.test(native.stem), `${language} final same-point wording missing: ${native.stem}`);
        assert(!/0 km/u.test(native.stem), `${language} final stem still says 0 km: ${native.stem}`);
        nativeSamePointChecks += 1;
      }
      if (english.authorityId === "SPEED_RATIO_FROM_MEETING_POINT" && english.state.variant === 0) {
        assert(language === "hi" ? /की गतियों का अनुपात/u.test(native.stem) : /ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ/u.test(native.stem), `${language} final ratio phrase is awkward: ${native.stem}`);
        nativeRatioPhraseChecks += 1;
      }
      if (english.authorityId === "MULTI_PURSUER_MEETING_ORDER" && english.state.variant === 0) {
        assert(language === "hi" ? /तीनों अपनी-अपनी गति बनाए रखें/u.test(native.stem) : /ਤਿੰਨੇ ਆਪਣੀ-ਆਪਣੀ ਰਫ਼ਤਾਰ ਜਾਰੀ ਰੱਖਣ/u.test(native.stem), `${language} final multi-pursuer plural wording missing: ${native.stem}`);
        multiPursuerNeutralChecks += 1;
      }
    }
  }
}
assert(nativeFinalRows === 96, `Final native review count drifted: ${nativeFinalRows}`);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP004_SOLE_FINAL_REVIEW_SURFACE",
  finalStressQuestions: stress.length,
  finalVerifierChecks,
  authoritySpecificEnglishMethodChecks,
  englishReviewRows: review.length,
  hindiReviewRows: 48,
  punjabiReviewRows: 48,
  totalReviewRows: 144,
  nativeSamePointChecks,
  nativeRatioPhraseChecks,
  multiPursuerNeutralChecks,
  finalSentenceParityChecks,
  learnerOptionAnalysisFields: 0,
  permanentQlCount: 0,
  retainedCountApprovedByProductOwner: false,
  permanentQlAllocationAuthorized: false,
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  reviewStatus: "READY_FOR_PRODUCT_OWNER_CP004_COUNT_AND_CONTENT_REVIEW",
}, null, 2));
