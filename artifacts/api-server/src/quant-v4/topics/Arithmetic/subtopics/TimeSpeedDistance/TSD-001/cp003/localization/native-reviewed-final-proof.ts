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

const frozenBefore = generateCp003EnglishFrozenRecords();
const frozenIdentity = stableCp003Stringify(frozenBefore);
const hi = generateCp003ReviewedNativeCandidate("hi");
const pa = generateCp003ReviewedNativeCandidate("pa");
const all = generateCp003AllReviewedNativeCandidates();

assert(frozenBefore.length === 63, `Expected 63 frozen English rows, received ${frozenBefore.length}`);
assert(hi.length === 63 && pa.length === 63 && all.length === 126, "Native reviewed candidate must contain 63 Hindi and 63 Punjabi rows");
assert(stableCp003Stringify(generateCp003EnglishFrozenRecords()) === frozenIdentity, "Frozen English corpus changed during native self-review");
assert(new Set(all.map((row) => row.presentation.questionLanguageId)).size === 126, "Native reviewed IDs are not unique");

const forbidden = {
  hi: [
    /एक (?:स्कूल बस|टैक्सी|कार|बस)\b/u,
    /1 घंटे \d+ मिनट/u,
    /अधिक लगते हैं/u,
    /के समान मार्ग/u,
    /कितने समय (?:बाद|पहले)/u,
    /मांगी/u,
    /ठहरावों/u,
    /\b\d+\/\d+\s*(?:घंटा|घंटे)\b/u,
    /प्रत्येक यात्रा-खंड में .* लगता है/u,
    /कुल बदलाव का परिमाण/u,
    /अतः परिमाण/u,
  ],
  pa: [
    /ਇੱਕ (?:ਸਕੂਲ ਬੱਸ|ਟੈਕਸੀ|ਕਾਰ|ਬੱਸ)\b/u,
    /1 ਘੰਟੇ \d+ ਮਿੰਟ/u,
    /ਵੱਧ ਲੱਗਦੇ ਹਨ/u,
    /ਕਿੰਨਾ ਸਮਾਂ (?:ਬਾਅਦ|ਪਹਿਲਾਂ)/u,
    /ਠਹਿਰਾਅਾਂ/u,
    /ਪਰਿਮਾਣ/u,
    /\b\d+\/\d+\s*(?:ਘੰਟਾ|ਘੰਟੇ)\b/u,
    /ਹਰ ਸਫ਼ਰ-ਭਾਗ ਵਿੱਚ .* ਲੱਗਦਾ ਹੈ/u,
    /ਬਦਲਾਅ ਦਾ ਬਦਲਾਅ ਦੀ ਮਾਤਰਾ/u,
  ],
} as const;

const stemWords: number[] = [];
const explanationWords: number[] = [];
const sourceById = new Map(frozenBefore.map((row) => [row.questionLanguageId, row] as const));

for (const row of all) {
  const { source, presentation, reviewCandidate } = row;
  const canonical = sourceById.get(presentation.sourceQuestionLanguageId);
  assert(canonical, `${presentation.questionLanguageId}: frozen source missing`);
  assert(canonical.lifecycle.englishFreezeStatus === "FROZEN", `${presentation.questionLanguageId}: English source no longer frozen`);
  assert(presentation.permanentQlId === canonical.permanentQlId, `${presentation.questionLanguageId}: permanent QL drift`);
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

  assertTsdCp003NativeText(presentation.stem, presentation.language, `${presentation.questionLanguageId}/stem`);
  assertTsdCp003NativeText(presentation.explanation.method, presentation.language, `${presentation.questionLanguageId}/method`);
  for (const [index, step] of presentation.explanation.steps.entries()) {
    assertTsdCp003NativeText(step, presentation.language, `${presentation.questionLanguageId}/step-${index + 1}`);
  }
  assertTsdCp003NativeText(presentation.explanation.answer, presentation.language, `${presentation.questionLanguageId}/answer`);

  const prose = [presentation.stem, presentation.explanation.method, ...presentation.explanation.steps, presentation.explanation.answer].join(" ");
  for (const pattern of forbidden[presentation.language]) {
    assert(!pattern.test(prose), `${presentation.questionLanguageId}: editorial blocker ${String(pattern)} remains`);
  }

  if (canonical.solveMode === "distanceFromSpeedTimeDifference") {
    assert(!presentation.stem.includes(presentation.answerText), `${presentation.questionLanguageId}: solved distance leaked into stem`);
  }
  if (canonical.solveMode === "restTimeInRepeatedTravelRestCycle") {
    assert(presentation.language === "hi" ? presentation.stem.includes("लगते हैं") : presentation.stem.includes("ਲੱਗਦੇ ਹਨ"), `${presentation.questionLanguageId}: repeated-travel duration agreement is not natural`);
  }
  if (canonical.solveMode === "arrivalShiftFromDepartureAndSpeedChanges") {
    assert(presentation.language === "hi" ? presentation.explanation.method.includes("कुल बदलाव की मात्रा") : presentation.explanation.method.includes("ਕੁੱਲ ਬਦਲਾਅ ਦੀ ਮਾਤਰਾ"), `${presentation.questionLanguageId}: arrival-shift magnitude wording is unclear`);
    assert(!presentation.explanation.steps.some((step) => /(?:^|\s)-\d/u.test(step)), `${presentation.questionLanguageId}: signed negative duration is exposed to the learner instead of direction wording`);
  }
  if (canonical.solveMode === "requiredRemainingSpeedAfterPartialRoute") {
    assert(!/\b\d+\/\d+\s*(?:घंटा|घंटे|ਘੰਟਾ|ਘੰਟੇ)\b/u.test(prose), `${presentation.questionLanguageId}: raw fractional-hour explanation remains`);
  }
  assert(canonical.solveMode !== "scheduleBuffer", `${presentation.questionLanguageId}: rejected scheduleBuffer entered native candidate`);

  assert(reviewCandidate.status === TSD_CP003_NATIVE_REVIEW_CANDIDATE_STATUS, `${presentation.questionLanguageId}: review status drift`);
  assert(reviewCandidate.selfReviewBlockers === 0, `${presentation.questionLanguageId}: self-review blockers remain`);
  assert(reviewCandidate.productOwnerApprovalRecorded === false, `${presentation.questionLanguageId}: product-owner approval fabricated`);
  assert(reviewCandidate.multilingualFreezeAuthorized === false, `${presentation.questionLanguageId}: multilingual freeze authorized prematurely`);
  assert(presentation.nativeReview.humanApprovalRecorded === false, `${presentation.questionLanguageId}: human approval fabricated`);
  assert(presentation.lifecycle.multilingualFreezeStatus === "UNFROZEN", `${presentation.questionLanguageId}: multilingual content frozen prematurely`);
  assert(presentation.lifecycle.questionStudioEnabled === false, `${presentation.questionLanguageId}: Question Studio unlocked prematurely`);
  assert(presentation.lifecycle.questionBankStatus === "NOT_STORED", `${presentation.questionLanguageId}: Question Bank unlocked prematurely`);
  assert(presentation.lifecycle.testEligibility === "INELIGIBLE", `${presentation.questionLanguageId}: tests unlocked prematurely`);
  assert(presentation.lifecycle.publiclyPublishable === false, `${presentation.questionLanguageId}: public delivery unlocked prematurely`);

  const sw = presentation.stem.trim().split(/\s+/u).length;
  const ew = [presentation.explanation.method, ...presentation.explanation.steps].join(" ").trim().split(/\s+/u).length;
  stemWords.push(sw);
  explanationWords.push(ew);
  assert(sw >= 12 && sw <= 55, `${presentation.questionLanguageId}: stem word count ${sw} outside review bounds`);
  assert(ew >= 8 && ew <= 95, `${presentation.questionLanguageId}: explanation word count ${ew} outside review bounds`);
}

for (let index = 0; index < 63; index += 1) {
  const h = hi[index].presentation;
  const p = pa[index].presentation;
  assert(h.sourceQuestionLanguageId === p.sourceQuestionLanguageId, `Hindi/Punjabi source alignment drift at row ${index}`);
  assert(h.permanentQlId === p.permanentQlId, `${h.sourceQuestionLanguageId}: Hindi/Punjabi QL mismatch`);
  assert(h.correctIndex === p.correctIndex, `${h.sourceQuestionLanguageId}: Hindi/Punjabi correct-index mismatch`);
  assert(h.mathematicalFingerprint === p.mathematicalFingerprint, `${h.sourceQuestionLanguageId}: Hindi/Punjabi fingerprint mismatch`);
  assert(h.parity.optionValueFingerprints.join("|") === p.parity.optionValueFingerprints.join("|"), `${h.sourceQuestionLanguageId}: Hindi/Punjabi option-value mismatch`);
}

const qls = new Set(hi.map((row) => row.presentation.permanentQlId));
const modes = new Set(hi.map((row) => row.presentation.solveMode));
const newRows = hi.filter((row) => Number(row.presentation.permanentQlId.slice(-3)) >= 38).length;
assert(qls.size === 18, `Expected 18 represented QLs, received ${qls.size}`);
assert(modes.size === 21, `Expected 21 accepted solve modes, received ${modes.size}`);
assert(newRows === 36, `Expected 36 rows on new CP-003 QLs, received ${newRows}`);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_HI_PA_FINAL_NATIVE_REVIEW_CANDIDATE",
  frozenEnglishRows: frozenBefore.length,
  hindiRows: hi.length,
  punjabiRows: pa.length,
  nativeRows: all.length,
  acceptedSolveModes: modes.size,
  representedAuthorityQls: qls.size,
  newCp003QlRowsPerLanguage: newRows,
  priorRepresentationRowsPerLanguage: hi.length - newRows,
  stemWordRange: [Math.min(...stemWords), Math.max(...stemWords)],
  explanationWordRange: [Math.min(...explanationWords), Math.max(...explanationWords)],
  selfReviewBlockers: 0,
  frozenEnglishCorpusChanged: false,
  productOwnerApprovalRecorded: false,
  multilingualFreezeAuthorized: false,
  multilingualFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));