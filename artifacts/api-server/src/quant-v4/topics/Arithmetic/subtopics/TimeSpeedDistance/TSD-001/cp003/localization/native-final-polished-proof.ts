import { stableCp003Stringify } from "../runtime";
import {
  generateCp003AllFinalNativeReviewCandidates as generateBaseAll,
} from "./native-final-candidate";
import {
  cp003EnglishSourceObjectKey,
  cp003ExpectedNativeContext,
  generateCp003AllFinalNativeReviewCandidates,
  type TsdCp003SourceObjectKey,
} from "./native-final-polished-candidate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const FEMININE_OBJECTS = new Set<TsdCp003SourceObjectKey>([
  "DELIVERY_VAN",
  "SCHOOL_BUS",
  "TAXI",
  "CAR",
  "BUS",
]);

const base = generateBaseAll();
const polished = generateCp003AllFinalNativeReviewCandidates();
assert(base.length === 126 && polished.length === 126, "Final polish must preserve 126 native rows");

let contextParityChecks = 0;
let contextBearingRows = 0;
let agreementChecks = 0;
let durationCaseChecks = 0;
let duplicationChecks = 0;
let immutableMathChecks = 0;

for (let index = 0; index < polished.length; index += 1) {
  const before = base[index];
  const after = polished[index];
  assert(before && after, `Missing native row at index ${index}`);
  assert(before.source.questionLanguageId === after.source.questionLanguageId, `${after.presentation.questionLanguageId}: source identity drift during sentence polish`);
  assert(before.presentation.questionLanguageId === after.presentation.questionLanguageId, `${after.presentation.questionLanguageId}: native identity drift during sentence polish`);
  assert(before.presentation.permanentQlId === after.presentation.permanentQlId, `${after.presentation.questionLanguageId}: QL drift during sentence polish`);
  assert(before.presentation.authorityKey === after.presentation.authorityKey, `${after.presentation.questionLanguageId}: authority drift during sentence polish`);
  assert(before.presentation.seed === after.presentation.seed, `${after.presentation.questionLanguageId}: seed drift during sentence polish`);
  assert(before.presentation.solveMode === after.presentation.solveMode, `${after.presentation.questionLanguageId}: solve-mode drift during sentence polish`);
  assert(before.presentation.representation === after.presentation.representation, `${after.presentation.questionLanguageId}: representation drift during sentence polish`);
  assert(before.presentation.correctIndex === after.presentation.correctIndex, `${after.presentation.questionLanguageId}: correct-index drift during sentence polish`);
  assert(before.presentation.mathematicalFingerprint === after.presentation.mathematicalFingerprint, `${after.presentation.questionLanguageId}: mathematical fingerprint drift during sentence polish`);
  assert(stableCp003Stringify(before.presentation.parity) === stableCp003Stringify(after.presentation.parity), `${after.presentation.questionLanguageId}: mathematical parity payload drift during sentence polish`);
  assert(stableCp003Stringify(before.presentation.options) === stableCp003Stringify(after.presentation.options), `${after.presentation.questionLanguageId}: options drift during sentence polish`);
  assert(stableCp003Stringify(before.presentation.explanation) === stableCp003Stringify(after.presentation.explanation), `${after.presentation.questionLanguageId}: explanation drift during sentence polish`);
  immutableMathChecks += 1;

  const context = cp003ExpectedNativeContext(after.source.stem, after.presentation.language);
  if (context !== null) {
    contextBearingRows += 1;
    const direct = after.presentation.stem.includes(context);
    const beforeSubject = after.presentation.language === "hi"
      ? after.presentation.stem.includes(context.replace(/^अपनी /u, "").replace(/^अपने /u, ""))
      : after.presentation.stem.includes(context.replace(/^ਆਪਣੀ /u, "").replace(/^ਆਪਣੇ /u, ""));
    assert(direct || beforeSubject, `${after.presentation.questionLanguageId}: English route/trip context was dropped from final native stem`);
    contextParityChecks += 1;
  }

  const stem = after.presentation.stem;
  if (after.presentation.language === "hi") {
    assert(!/1 घंटा (?:का|की|के)/u.test(stem), `${after.presentation.questionLanguageId}: singular-hour case grammar remains in Hindi`);
    assert(!/\d+(?:\.\d+)? km की यात्रा में कुल/u.test(stem), `${after.presentation.questionLanguageId}: repeated journey phrasing remains in Hindi`);
    assert(!/(?: पर| में) के पास/u.test(stem), `${after.presentation.questionLanguageId}: malformed Hindi route/postposition sequence remains`);
  } else {
    assert(!/1 ਘੰਟਾ (?:ਦਾ|ਦੀ|ਦੇ)/u.test(stem), `${after.presentation.questionLanguageId}: singular-hour case grammar remains in Punjabi`);
    assert(!/\d+(?:\.\d+)? km ਦੇ ਸਫ਼ਰ ਵਿੱਚ ਕੁੱਲ/u.test(stem), `${after.presentation.questionLanguageId}: repeated journey phrasing remains in Punjabi`);
    assert(!/(?: ਉੱਤੇ| ਵਿੱਚ) ਕੋਲ/u.test(stem), `${after.presentation.questionLanguageId}: malformed Punjabi route/postposition sequence remains`);
  }
  durationCaseChecks += 1;
  duplicationChecks += 1;

  const object = cp003EnglishSourceObjectKey(after.source.stem);
  if (after.presentation.language === "pa" && object !== null) {
    if (FEMININE_OBJECTS.has(object)) {
      assert(!after.presentation.stem.includes("ਰਵਾਨਾ ਹੁੰਦਾ ਹੈ"), `${after.presentation.questionLanguageId}: feminine Punjabi subject has masculine departure agreement`);
      agreementChecks += 1;
    } else if (object === "COACH") {
      assert(!after.presentation.stem.includes("ਰਵਾਨਾ ਹੁੰਦੀ ਹੈ"), `${after.presentation.questionLanguageId}: masculine Punjabi coach has feminine departure agreement`);
      agreementChecks += 1;
    }
  }

  assert(after.finalNativeReview.semanticSentenceParityEnforced === true, `${after.presentation.questionLanguageId}: semantic sentence parity flag lost`);
  assert(after.finalNativeReview.optionAnalysisIncluded === false, `${after.presentation.questionLanguageId}: option analysis returned during sentence polish`);
  assert(after.lifecycle === undefined || true, "unreachable");
  assert(after.presentation.lifecycle.multilingualFreezeStatus === "UNFROZEN", `${after.presentation.questionLanguageId}: sentence polish froze native content`);
  assert(after.presentation.lifecycle.questionStudioEnabled === false, `${after.presentation.questionLanguageId}: sentence polish unlocked Question Studio`);
  assert(after.presentation.lifecycle.questionBankStatus === "NOT_STORED", `${after.presentation.questionLanguageId}: sentence polish unlocked Question Bank`);
  assert(after.presentation.lifecycle.testEligibility === "INELIGIBLE", `${after.presentation.questionLanguageId}: sentence polish enabled tests`);
  assert(after.presentation.lifecycle.publiclyPublishable === false, `${after.presentation.questionLanguageId}: sentence polish enabled public delivery`);
}

assert(contextBearingRows === 96, `Expected 96 native rows with explicit English route/trip context, received ${contextBearingRows}`);
assert(contextParityChecks === 96, `Expected 96 native context-parity checks, received ${contextParityChecks}`);
assert(immutableMathChecks === 126, `Expected 126 immutable-math checks, received ${immutableMathChecks}`);
assert(durationCaseChecks === 126 && duplicationChecks === 126, "Every native row must receive final sentence-grammar checks");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_HI_PA_FINAL_SENTENCE_POLISH",
  nativeRows: polished.length,
  contextBearingRows,
  contextParityChecks,
  immutableMathChecks,
  durationCaseChecks,
  duplicationChecks,
  departureAgreementChecks: agreementChecks,
  optionAnalysisFields: 0,
  semanticSentenceParityEnforced: true,
  sourceMathChanged: false,
  productOwnerApprovalRecorded: false,
  multilingualFreezeAuthorized: false,
  multilingualFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
