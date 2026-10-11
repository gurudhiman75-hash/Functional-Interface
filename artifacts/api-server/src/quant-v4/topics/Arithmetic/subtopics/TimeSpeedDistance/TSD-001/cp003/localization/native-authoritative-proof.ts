import { generateCp003EnglishFrozenRecords } from "../english-frozen";
import { stableCp003Stringify } from "../runtime";
import {
  generateCp003AllAuthoritativeNativeCandidates,
  generateCp003AuthoritativeNativeCandidate,
  TSD_CP003_NATIVE_AUTHORITATIVE_STATUS,
} from "./native-authoritative";
import { assertTsdCp003NativeText } from "./native-language-primitives";
import {
  hasExplicitNativeMisconceptionCopy,
  TSD_CP003_EXPLICIT_NATIVE_MISCONCEPTIONS,
} from "./native-misconception-copy";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function structuralStemSignature(stem: string, language: "hi" | "pa"): string {
  let value = stem
    .replace(/\d+(?:\/\d+)?(?:\.\d+)?/gu, "#")
    .replace(/km\/h|km|AM|PM/gu, "UNIT")
    .replace(/\s+/gu, " ")
    .trim();
  if (language === "hi") {
    value = value.replace(/एक (?:वाहन|कोच|ट्रक)/gu, "एक <संदर्भ>");
  } else {
    value = value.replace(/ਇੱਕ (?:ਵਾਹਨ|ਕੋਚ|ਟਰੱਕ)/gu, "ਇੱਕ <ਸੰਦਰਭ>");
  }
  return value;
}

const frozen = generateCp003EnglishFrozenRecords();
const frozenIdentity = stableCp003Stringify(frozen);
const hi = generateCp003AuthoritativeNativeCandidate("hi");
const pa = generateCp003AuthoritativeNativeCandidate("pa");
const all = generateCp003AllAuthoritativeNativeCandidates();

assert(frozen.length === 63, `Expected 63 frozen English rows, received ${frozen.length}`);
assert(hi.length === 63 && pa.length === 63 && all.length === 126, "Authoritative native surface must contain 63 Hindi and 63 Punjabi rows");
assert(stableCp003Stringify(generateCp003EnglishFrozenRecords()) === frozenIdentity, "Frozen English corpus changed while building authoritative native surface");

const acceptedWrongIds = new Set(frozen.flatMap((row) => row.optionAudit.filter((entry) => !entry.isCorrect).map((entry) => entry.misconceptionId)));
assert(acceptedWrongIds.size === 61, `Expected 61 distinct accepted wrong-method IDs, received ${acceptedWrongIds.size}`);
assert(TSD_CP003_EXPLICIT_NATIVE_MISCONCEPTIONS.length === 61, `Explicit native misconception inventory should contain 61 IDs, received ${TSD_CP003_EXPLICIT_NATIVE_MISCONCEPTIONS.length}`);
for (const id of acceptedWrongIds) {
  assert(hasExplicitNativeMisconceptionCopy(id), `${id}: accepted misconception has no explicit Hindi/Punjabi explanation`);
}

const sourceById = new Map(frozen.map((row) => [row.questionLanguageId, row] as const));
const signatures = new Map<string, Set<string>>();
const contextCounts = {
  hi: { vehicle: 0, coach: 0, truck: 0 },
  pa: { vehicle: 0, coach: 0, truck: 0 },
};
let optionAnalyses = 0;
let wrongOptionReasons = 0;
let correctOptionReasons = 0;
let contextualMisconceptionChecks = 0;

for (const row of all) {
  const { source, presentation, authoritativeReview } = row;
  const canonical = sourceById.get(presentation.sourceQuestionLanguageId);
  assert(canonical, `${presentation.questionLanguageId}: frozen English source missing`);
  assert(canonical.lifecycle.englishFreezeStatus === "FROZEN", `${presentation.questionLanguageId}: source English is not frozen`);
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
  assertTsdCp003NativeText(presentation.explanation.examSpeedShortcut, presentation.language, `${presentation.questionLanguageId}/shortcut`);
  assertTsdCp003NativeText(presentation.explanation.answer, presentation.language, `${presentation.questionLanguageId}/answer`);
  assert(presentation.explanation.steps.length >= 1, `${presentation.questionLanguageId}: no worked solution steps`);
  for (const [index, step] of presentation.explanation.steps.entries()) {
    assertTsdCp003NativeText(step, presentation.language, `${presentation.questionLanguageId}/step-${index + 1}`);
  }

  if (presentation.language === "hi") {
    assert(!presentation.stem.includes("एक निर्धारित यात्रा में"), `${presentation.questionLanguageId}: mechanical Hindi framing remains`);
    assert(!presentation.stem.includes("दिए गए आँकड़ों के आधार पर"), `${presentation.questionLanguageId}: mechanical Hindi data-framing remains`);
    assert(!presentation.stem.includes("समान तय दूरी का मान"), `${presentation.questionLanguageId}: awkward Hindi fixed-distance phrasing remains`);
    assert(!presentation.stem.includes("निर्धारित समय की सामान्य गति"), `${presentation.questionLanguageId}: awkward Hindi usual-speed phrasing remains`);
    assert(!/दूसरी (?:कम|अधिक) गति के साथ यात्रा-समयों/u.test(presentation.stem), `${presentation.questionLanguageId}: awkward Hindi known-speed relation remains`);
    assert(!presentation.stem.includes("उसे कितने समय"), `${presentation.questionLanguageId}: unclear Hindi pronoun referent remains`);
  } else {
    assert(!presentation.stem.includes("ਇੱਕ ਨਿਰਧਾਰਤ ਸਫ਼ਰ ਵਿੱਚ"), `${presentation.questionLanguageId}: mechanical Punjabi framing remains`);
    assert(!presentation.stem.includes("ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਦੇ ਆਧਾਰ ਉੱਤੇ"), `${presentation.questionLanguageId}: mechanical Punjabi data-framing remains`);
    assert(!presentation.stem.includes("ਇੱਕੋ ਤੈਅ ਦੂਰੀ ਦਾ ਮਾਨ"), `${presentation.questionLanguageId}: awkward Punjabi fixed-distance phrasing remains`);
    assert(!/ਦੂਜੀ (?:ਘੱਟ|ਵੱਧ) ਰਫ਼ਤਾਰ ਨਾਲ ਸਫ਼ਰ-ਸਮਿਆਂ/u.test(presentation.stem), `${presentation.questionLanguageId}: awkward Punjabi known-speed relation remains`);
    assert(!presentation.stem.includes("ਉਸਨੂੰ ਕਿੰਨਾ ਸਮਾਂ"), `${presentation.questionLanguageId}: unclear Punjabi pronoun referent remains`);
  }

  const analyses = presentation.explanation.optionAnalysis;
  assert(analyses.length === 4, `${presentation.questionLanguageId}: expected four option analyses`);
  assert(analyses.filter((entry) => entry.isCorrect).length === 1, `${presentation.questionLanguageId}: option analysis must identify exactly one correct option`);
  assert(analyses[presentation.correctIndex]?.isCorrect === true, `${presentation.questionLanguageId}: correct option analysis is not aligned to correct index`);
  analyses.forEach((entry, index) => {
    const audit = canonical.optionAudit[index];
    assert(hasExplicitNativeMisconceptionCopy(audit.misconceptionId), `${presentation.questionLanguageId}/${entry.option}: option reason used non-explicit misconception copy`);
    assert(entry.text === presentation.options[index], `${presentation.questionLanguageId}: option-analysis text drift at ${entry.option}`);
    assertTsdCp003NativeText(entry.reason, presentation.language, `${presentation.questionLanguageId}/option-${entry.option}-reason`);
    if (!entry.isCorrect) {
      if (presentation.language === "hi") {
        assert(!/सही विधि .* देती है/u.test(entry.reason), `${presentation.questionLanguageId}/${entry.option}: mechanical Hindi answer-feedback suffix remains`);
        assert(entry.reason.includes("सही गणना से उत्तर"), `${presentation.questionLanguageId}/${entry.option}: Hindi wrong-option feedback lacks student-facing correction`);
      } else {
        assert(!/ਸਹੀ ਵਿਧੀ .* ਦਿੰਦੀ ਹੈ/u.test(entry.reason), `${presentation.questionLanguageId}/${entry.option}: mechanical Punjabi answer-feedback suffix remains`);
        assert(entry.reason.includes("ਸਹੀ ਗਣਨਾ ਨਾਲ ਉੱਤਰ"), `${presentation.questionLanguageId}/${entry.option}: Punjabi wrong-option feedback lacks student-facing correction`);
      }
    }

    if (canonical.solveMode === "usualSpeedFromEarlyLatePair" && (audit.misconceptionId === "USE_SLOWER_SPEED_ONLY" || audit.misconceptionId === "USE_FASTER_SPEED_ONLY")) {
      assert(presentation.language === "hi" ? entry.reason.includes("परीक्षण गति") : entry.reason.includes("ਪਰਖ-ਰਫ਼ਤਾਰ"), `${presentation.questionLanguageId}/${entry.option}: usual-speed trial-speed misconception is not context-specific`);
      contextualMisconceptionChecks += 1;
    }
    if (canonical.solveMode === "distanceFromEarlyLatePair" && audit.misconceptionId === "USE_FASTER_SPEED_ONLY") {
      assert(presentation.language === "hi" ? entry.reason.includes("पहले पहुँचने वाले समय") : entry.reason.includes("ਪਹਿਲਾਂ ਪਹੁੰਚਣ ਵਾਲੇ ਸਮੇਂ"), `${presentation.questionLanguageId}/${entry.option}: early-arrival distance misconception is not context-specific`);
      contextualMisconceptionChecks += 1;
    }
    if (canonical.solveMode === "lostTimeDurationFromScheduleRecovery" && audit.misconceptionId === "USE_ONE_TRAVEL_TIME") {
      assert(presentation.language === "hi" ? entry.reason.includes("शेष मार्ग की किसी एक पूरी यात्रा-अवधि") : entry.reason.includes("ਬਾਕੀ ਰਸਤੇ ਦੀ ਕਿਸੇ ਇੱਕ ਪੂਰੀ ਸਫ਼ਰ-ਮਿਆਦ"), `${presentation.questionLanguageId}/${entry.option}: lost-time single-journey misconception is not context-specific`);
      contextualMisconceptionChecks += 1;
    }

    optionAnalyses += 1;
    if (entry.isCorrect) correctOptionReasons += 1;
    else wrongOptionReasons += 1;
  });

  const prose = [
    presentation.stem,
    presentation.explanation.method,
    ...presentation.explanation.steps,
    presentation.explanation.examSpeedShortcut,
    ...analyses.map((entry) => entry.reason),
    presentation.explanation.answer,
  ].join(" ");
  assert(!/\d+\/\d+\s*(?:घंटा|घंटे|ਘੰਟਾ|ਘੰਟੇ)/u.test(prose), `${presentation.questionLanguageId}: raw fractional-hour learner prose remains`);
  assert(canonical.solveMode !== "scheduleBuffer", `${presentation.questionLanguageId}: rejected scheduleBuffer entered authoritative native surface`);

  assert(authoritativeReview.status === TSD_CP003_NATIVE_AUTHORITATIVE_STATUS, `${presentation.questionLanguageId}: authoritative status drift`);
  assert(authoritativeReview.publicNativeEntryPoint === true, `${presentation.questionLanguageId}: authoritative surface is not marked as public native entry point`);
  assert(authoritativeReview.legacyDraftEntryPointsPublic === false, `${presentation.questionLanguageId}: legacy draft surface exposed publicly`);
  assert(authoritativeReview.explanationContract === "METHOD_STEPS_SHORTCUT_OPTION_ANALYSIS_ANSWER", `${presentation.questionLanguageId}: explanation contract drift`);
  assert(authoritativeReview.productOwnerApprovalRecorded === false, `${presentation.questionLanguageId}: product-owner approval fabricated`);
  assert(authoritativeReview.multilingualFreezeAuthorized === false, `${presentation.questionLanguageId}: multilingual freeze authorized prematurely`);
  assert(authoritativeReview.sourceMathChanged === false, `${presentation.questionLanguageId}: native editorial layer changed source math`);
  assert(presentation.lifecycle.multilingualFreezeStatus === "UNFROZEN", `${presentation.questionLanguageId}: multilingual content frozen prematurely`);
  assert(presentation.lifecycle.questionStudioEnabled === false, `${presentation.questionLanguageId}: Question Studio unlocked prematurely`);
  assert(presentation.lifecycle.questionBankStatus === "NOT_STORED", `${presentation.questionLanguageId}: Question Bank unlocked prematurely`);
  assert(presentation.lifecycle.testEligibility === "INELIGIBLE", `${presentation.questionLanguageId}: tests unlocked prematurely`);
  assert(presentation.lifecycle.publiclyPublishable === false, `${presentation.questionLanguageId}: public delivery unlocked prematurely`);

  const sigKey = `${presentation.language}:${presentation.solveMode}`;
  const set = signatures.get(sigKey) ?? new Set<string>();
  set.add(structuralStemSignature(presentation.stem, presentation.language));
  signatures.set(sigKey, set);

  if (presentation.language === "hi") {
    if (presentation.stem.includes("एक वाहन")) contextCounts.hi.vehicle += 1;
    if (presentation.stem.includes("एक कोच")) contextCounts.hi.coach += 1;
    if (presentation.stem.includes("एक ट्रक")) contextCounts.hi.truck += 1;
  } else {
    if (presentation.stem.includes("ਇੱਕ ਵਾਹਨ")) contextCounts.pa.vehicle += 1;
    if (presentation.stem.includes("ਇੱਕ ਕੋਚ")) contextCounts.pa.coach += 1;
    if (presentation.stem.includes("ਇੱਕ ਟਰੱਕ")) contextCounts.pa.truck += 1;
  }
}

for (const language of ["hi", "pa"] as const) {
  const rows = language === "hi" ? hi : pa;
  const modes = [...new Set(rows.map((row) => row.presentation.solveMode))];
  assert(modes.length === 21, `${language}: expected 21 solve modes, received ${modes.length}`);
  for (const mode of modes) {
    const modeRows = rows.filter((row) => row.presentation.solveMode === mode);
    assert(modeRows.length === 3, `${language}/${mode}: expected three rows`);
    assert(new Set(modeRows.map((row) => row.authoritativeReview.stemVariantOrdinal)).size === 3, `${language}/${mode}: missing authoritative stem variant ordinals`);
    assert((signatures.get(`${language}:${mode}`)?.size ?? 0) === 3, `${language}/${mode}: native structural stem diversity collapsed below three patterns`);
  }
}

assert(contextCounts.hi.vehicle >= 8 && contextCounts.hi.coach >= 8 && contextCounts.hi.truck >= 8, `Hindi context diversity too low: ${JSON.stringify(contextCounts.hi)}`);
assert(contextCounts.pa.vehicle >= 8 && contextCounts.pa.coach >= 8 && contextCounts.pa.truck >= 8, `Punjabi context diversity too low: ${JSON.stringify(contextCounts.pa)}`);
assert(optionAnalyses === 504, `Expected 504 native option analyses, received ${optionAnalyses}`);
assert(correctOptionReasons === 126, `Expected 126 correct-option reasons, received ${correctOptionReasons}`);
assert(wrongOptionReasons === 378, `Expected 378 wrong-option reasons, received ${wrongOptionReasons}`);
assert(contextualMisconceptionChecks > 0, "Expected context-specific misconception checks to execute");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_HI_PA_AUTHORITATIVE_NATIVE_EDITORIAL",
  frozenEnglishRows: frozen.length,
  hindiRows: hi.length,
  punjabiRows: pa.length,
  nativeRows: all.length,
  solveModesPerLanguage: 21,
  structuralStemVariantsPerMode: 3,
  explicitAcceptedMisconceptionIds: acceptedWrongIds.size,
  contextualMisconceptionChecks,
  hindiContextCounts: contextCounts.hi,
  punjabiContextCounts: contextCounts.pa,
  optionAnalyses,
  correctOptionReasons,
  wrongOptionReasons,
  explanationContract: "METHOD_STEPS_SHORTCUT_OPTION_ANALYSIS_ANSWER",
  rawFractionalHourLearnerProse: 0,
  mechanicalFramingRows: 0,
  knownAwkwardPhrasingRows: 0,
  frozenEnglishCorpusChanged: false,
  productOwnerApprovalRecorded: false,
  multilingualFreezeAuthorized: false,
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
