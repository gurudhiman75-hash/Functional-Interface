import { generateCp003EnglishFrozenRecords } from "../english-frozen";
import { stableCp003Stringify } from "../runtime";
import { assertTsdCp003NativeText } from "./native-language-primitives";
import {
  generateCp003AllReviewedNativeCandidates,
  generateCp003ReviewedNativeCandidate,
  TSD_CP003_NATIVE_REVIEW_CANDIDATE_STATUS,
} from "./native-reviewed-candidate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const englishBefore = generateCp003EnglishFrozenRecords();
const englishIdentity = stableCp003Stringify(englishBefore);
const hindi = generateCp003ReviewedNativeCandidate("hi");
const punjabi = generateCp003ReviewedNativeCandidate("pa");
const all = generateCp003AllReviewedNativeCandidates();

assert(hindi.length === 63 && punjabi.length === 63 && all.length === 126, "Reviewed native candidate must contain 63 Hindi + 63 Punjabi rows");
assert(new Set(all.map((row) => row.presentation.questionLanguageId)).size === 126, "Reviewed native question-language IDs are not unique");
assert(stableCp003Stringify(generateCp003EnglishFrozenRecords()) === englishIdentity, "Frozen English corpus changed during native editorial review");

const forbiddenHindi = [
  /एक (?:स्कूल बस|टैक्सी|कार|बस)\b/u,
  /1 घंटे \d+ मिनट/u,
  /अधिक लगते हैं/u,
  /के समान मार्ग/u,
  /कितने समय (?:बाद|पहले)/u,
  /मांगी/u,
  /ठहरावों/u,
];
const forbiddenPunjabi = [
  /ਇੱਕ (?:ਸਕੂਲ ਬੱਸ|ਟੈਕਸੀ|ਕਾਰ|ਬੱਸ)\b/u,
  /1 ਘੰਟੇ \d+ ਮਿੰਟ/u,
  /ਵੱਧ ਲੱਗਦੇ ਹਨ/u,
  /ਕਿੰਨਾ ਸਮਾਂ (?:ਬਾਅਦ|ਪਹਿਲਾਂ)/u,
  /ਠਹਿਰਾਅਾਂ/u,
  /ਪਰਿਮਾਣ/u,
];

const stemLengths: number[] = [];
const explanationLengths: number[] = [];

for (const row of all) {
  const { source, presentation, reviewCandidate } = row;
  assert(reviewCandidate.status === TSD_CP003_NATIVE_REVIEW_CANDIDATE_STATUS, `${presentation.questionLanguageId}: review-candidate status drift`);
  assert(reviewCandidate.selfReviewBlockers === 0, `${presentation.questionLanguageId}: unresolved self-review blocker`);
  assert(reviewCandidate.productOwnerApprovalRecorded === false, `${presentation.questionLanguageId}: fabricated product-owner approval`);
  assert(reviewCandidate.multilingualFreezeAuthorized === false, `${presentation.questionLanguageId}: multilingual freeze authorized before approval`);
  assert(presentation.nativeReview.humanApprovalRecorded === false, `${presentation.questionLanguageId}: fabricated human approval`);
  assert(presentation.nativeReview.multilingualFreezeAuthorized === false, `${presentation.questionLanguageId}: native review layer authorized freeze`);
  assert(presentation.nativeReview.sourceMathChanged === false, `${presentation.questionLanguageId}: source-math mutation flag changed`);

  assert(presentation.permanentQlId === source.permanentQlId, `${presentation.questionLanguageId}: QL changed during editorial remediation`);
  assert(presentation.seed === source.seed, `${presentation.questionLanguageId}: seed changed during editorial remediation`);
  assert(presentation.correctIndex === source.correctIndex, `${presentation.questionLanguageId}: correct index changed during editorial remediation`);
  assert(presentation.answerText === presentation.options[presentation.correctIndex], `${presentation.questionLanguageId}: native correct option no longer equals answer`);
  assert(presentation.mathematicalFingerprint === source.mathematicalFingerprint, `${presentation.questionLanguageId}: mathematical fingerprint changed`);
  assert(presentation.parity.inputIdentity === stableCp003Stringify(source.input), `${presentation.questionLanguageId}: input parity changed`);
  assert(presentation.parity.solutionIdentity === stableCp003Stringify(source.solution), `${presentation.questionLanguageId}: solution parity changed`);
  assert(presentation.options.length === 4 && new Set(presentation.options).size === 4, `${presentation.questionLanguageId}: option integrity changed`);

  assertTsdCp003NativeText(presentation.stem, presentation.language, `${presentation.questionLanguageId}/candidate-stem`);
  assertTsdCp003NativeText(presentation.explanation.method, presentation.language, `${presentation.questionLanguageId}/candidate-method`);
  for (const [index, step] of presentation.explanation.steps.entries()) {
    assertTsdCp003NativeText(step, presentation.language, `${presentation.questionLanguageId}/candidate-step-${index + 1}`);
  }

  const joined = [presentation.stem, presentation.explanation.method, ...presentation.explanation.steps, presentation.explanation.answer].join(" ");
  const forbidden = presentation.language === "hi" ? forbiddenHindi : forbiddenPunjabi;
  for (const pattern of forbidden) {
    assert(!pattern.test(joined), `${presentation.questionLanguageId}: forbidden native editorial pattern ${String(pattern)} remains`);
  }

  if (source.solveMode === "distanceFromSpeedTimeDifference") {
    assert(!presentation.stem.includes(presentation.answerText), `${presentation.questionLanguageId}: solved distance leaked into the question stem`);
  }
  if (source.solveMode === "scheduleBuffer") {
    throw new Error(`${presentation.questionLanguageId}: rejected scheduleBuffer entered reviewed native candidate`);
  }

  const stemWords = presentation.stem.trim().split(/\s+/u).length;
  const explanationWords = [presentation.explanation.method, ...presentation.explanation.steps].join(" ").trim().split(/\s+/u).length;
  stemLengths.push(stemWords);
  explanationLengths.push(explanationWords);
  assert(stemWords >= 12 && stemWords <= 55, `${presentation.questionLanguageId}: native stem length ${stemWords} is outside review bounds`);
  assert(explanationWords >= 8 && explanationWords <= 95, `${presentation.questionLanguageId}: native explanation length ${explanationWords} is outside review bounds`);

  assert(presentation.lifecycle.multilingualFreezeStatus === "UNFROZEN", `${presentation.questionLanguageId}: multilingual content frozen before approval`);
  assert(presentation.lifecycle.questionStudioEnabled === false, `${presentation.questionLanguageId}: Question Studio unlocked`);
  assert(presentation.lifecycle.questionBankStatus === "NOT_STORED", `${presentation.questionLanguageId}: Question Bank unlocked`);
  assert(presentation.lifecycle.testEligibility === "INELIGIBLE", `${presentation.questionLanguageId}: tests unlocked`);
  assert(presentation.lifecycle.publiclyPublishable === false, `${presentation.questionLanguageId}: public delivery unlocked`);
}

for (let index = 0; index < 63; index += 1) {
  const hi = hindi[index].presentation;
  const pa = punjabi[index].presentation;
  assert(hi.sourceQuestionLanguageId === pa.sourceQuestionLanguageId, `Hindi/Punjabi source alignment drift at ${index}`);
  assert(hi.permanentQlId === pa.permanentQlId, `${hi.sourceQuestionLanguageId}: Hindi/Punjabi QL mismatch`);
  assert(hi.correctIndex === pa.correctIndex, `${hi.sourceQuestionLanguageId}: Hindi/Punjabi correct-index mismatch`);
  assert(hi.answerText !== pa.answerText || !/[A-Za-z\u0900-\u097F\u0A00-\u0A7F]/u.test(hi.answerText), `${hi.sourceQuestionLanguageId}: native answer labels unexpectedly identical`);
  assert(hi.parity.optionValueFingerprints.join("|") === pa.parity.optionValueFingerprints.join("|"), `${hi.sourceQuestionLanguageId}: Hindi/Punjabi option-value parity drift`);
}

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_HI_PA_REVIEWED_NATIVE_CANDIDATE",
  hindiRows: hindi.length,
  punjabiRows: punjabi.length,
  totalNativeRows: all.length,
  selfReviewBlockers: 0,
  frozenEnglishCorpusChanged: false,
  stemWordRange: [Math.min(...stemLengths), Math.max(...stemLengths)],
  explanationWordRange: [Math.min(...explanationLengths), Math.max(...explanationLengths)],
  productOwnerApprovalRecorded: false,
  multilingualFreezeAuthorized: false,
  multilingualFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
