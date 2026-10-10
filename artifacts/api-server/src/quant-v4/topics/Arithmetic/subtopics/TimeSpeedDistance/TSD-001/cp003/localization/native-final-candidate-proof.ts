import { generateCp003EnglishFrozenRecords } from "../english-frozen";
import { stableCp003Stringify } from "../runtime";
import {
  cp003EnglishSourceObjectKey,
  cp003ExpectedNativeObject,
  generateCp003AllFinalNativeReviewCandidates,
  generateCp003FinalNativeReviewCandidate,
  TSD_CP003_NATIVE_FINAL_REVIEW_STATUS,
  type TsdCp003SourceObjectKey,
} from "./native-final-candidate";
import { assertTsdCp003NativeText, type TsdCp003NativeLanguage } from "./native-language-primitives";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const INTRODUCED_ACTOR_PHRASES = Object.freeze({
  hi: Object.freeze(["एक डिलीवरी वाहन", "एक डिलीवरी वैन", "एक स्कूल बस", "एक वाहन", "एक कोच", "एक ट्रक", "एक टैक्सी", "एक कार", "एक बस", "एक यात्री", "एक व्यक्ति"]),
  pa: Object.freeze(["ਇੱਕ ਡਿਲਿਵਰੀ ਵਾਹਨ", "ਇੱਕ ਡਿਲਿਵਰੀ ਵੈਨ", "ਇੱਕ ਸਕੂਲ ਬੱਸ", "ਇੱਕ ਵਾਹਨ", "ਇੱਕ ਕੋਚ", "ਇੱਕ ਟਰੱਕ", "ਇੱਕ ਟੈਕਸੀ", "ਇੱਕ ਕਾਰ", "ਇੱਕ ਬੱਸ", "ਇੱਕ ਯਾਤਰੀ", "ਇੱਕ ਵਿਅਕਤੀ"]),
} as const);

const EXPECTED_ACTOR_BY_KEY = Object.freeze({
  hi: Object.freeze({ DELIVERY_VAN: "एक डिलीवरी वैन", SCHOOL_BUS: "एक स्कूल बस", COACH: "एक कोच", TAXI: "एक टैक्सी", CAR: "एक कार", BUS: "एक बस" }),
  pa: Object.freeze({ DELIVERY_VAN: "ਇੱਕ ਡਿਲਿਵਰੀ ਵੈਨ", SCHOOL_BUS: "ਇੱਕ ਸਕੂਲ ਬੱਸ", COACH: "ਇੱਕ ਕੋਚ", TAXI: "ਇੱਕ ਟੈਕਸੀ", CAR: "ਇੱਕ ਕਾਰ", BUS: "ਇੱਕ ਬੱਸ" }),
} as const);

const OBJECT_POSTPOSITIONS = Object.freeze({
  hi: Object.freeze([" को", " के", " का", " की", " पर", " से", " में", "  "]),
  pa: Object.freeze([" ਨੂੰ", " ਕੋਲ", " ਦਾ", " ਦੀ", " ਦੇ", " ਉੱਤੇ", " ਨਾਲ", " ਵਿੱਚ", "  "]),
} as const);

const FEMININE_OBJECTS = new Set<TsdCp003SourceObjectKey>(["DELIVERY_VAN", "SCHOOL_BUS", "TAXI", "CAR", "BUS"]);
const MASCULINE_FORMS = Object.freeze({
  hi: Object.freeze(["तय करता है", "पहुँचता है", "पहुँचेगा", "चलना शुरू करता है", "रुकता है", "चलता है", "करता है", "रुका?", "रुका।"]),
  pa: Object.freeze(["ਤੈਅ ਕਰਦਾ ਹੈ", "ਪਹੁੰਚਦਾ ਹੈ", "ਪਹੁੰਚੇਗਾ", "ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ", "ਰੁਕਦਾ ਹੈ", "ਚੱਲਦਾ ਹੈ", "ਕਰਦਾ ਹੈ", "ਰੁਕਿਆ?", "ਰੁਕਿਆ।"]),
} as const);
const FEMININE_FORMS = Object.freeze({
  hi: Object.freeze(["तय करती है", "पहुँचती है", "पहुँचेगी", "चलना शुरू करती है", "रुकती है", "चलती है", "करती है", "रुकी?", "रुकी।"]),
  pa: Object.freeze(["ਤੈਅ ਕਰਦੀ ਹੈ", "ਪਹੁੰਚਦੀ ਹੈ", "ਪਹੁੰਚੇਗੀ", "ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦੀ ਹੈ", "ਰੁਕਦੀ ਹੈ", "ਚੱਲਦੀ ਹੈ", "ਕਰਦੀ ਹੈ", "ਰੁਕੀ?", "ਰੁਕੀ।"]),
} as const);
const SAFE_GENERIC_CONTEXT_NOUNS = Object.freeze({ hi: Object.freeze(["वाहन", "कोच", "ट्रक"]), pa: Object.freeze(["ਵਾਹਨ", "ਕੋਚ", "ਟਰੱਕ"]) } as const);

function nativeStemHasIntroducedActor(stem: string, language: TsdCp003NativeLanguage): boolean {
  return INTRODUCED_ACTOR_PHRASES[language].some((phrase) => stem.includes(phrase));
}
function hasExpectedObject(stem: string, key: TsdCp003SourceObjectKey, language: TsdCp003NativeLanguage): boolean {
  const object = cp003ExpectedNativeObject(key, language);
  if (stem.includes(EXPECTED_ACTOR_BY_KEY[language][key])) return true;
  return OBJECT_POSTPOSITIONS[language].some((suffix) => stem.includes(`${object}${suffix}`));
}
function sentenceCount(stem: string): number {
  return stem.split(/[।?]+/u).map((part) => part.trim()).filter(Boolean).length;
}
function hasContrast(stem: string, language: TsdCp003NativeLanguage): boolean {
  return language === "hi" ? /लेकिन|जबकि|परंतु/u.test(stem) : /ਪਰ|ਜਦਕਿ/u.test(stem);
}
function hasPersistence(stem: string, language: TsdCp003NativeLanguage): boolean {
  return language === "hi" ? /फिर भी|पर भी|के बावजूद/u.test(stem) : /ਫਿਰ ਵੀ|ਦੇ ਬਾਵਜੂਦ/u.test(stem);
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
let sourceObjectParityChecks = 0;
let objectNeutralityChecks = 0;
let optionAnalysisFields = 0;
let explanationChecks = 0;
let exclusiveActorChecks = 0;
let agreementChecks = 0;
let masculineAgreementChecks = 0;
let corruptionChecks = 0;
let conditionalSentenceChecks = 0;
let whenClauseChecks = 0;
let contrastClauseChecks = 0;
let insteadClauseChecks = 0;
let persistenceClauseChecks = 0;
let causeClauseChecks = 0;
let malformedCaseChecks = 0;

for (const row of all) {
  const { presentation, finalNativeReview } = row;
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
  assert(finalNativeReview.solePublicNativeEntryPoint === true, `${presentation.questionLanguageId}: final surface is not sole public native entry point`);
  assert(finalNativeReview.explanationContract === "METHOD_STEPS_SHORTCUT_ANSWER", `${presentation.questionLanguageId}: final explanation contract drift`);
  assert(finalNativeReview.optionAnalysisIncluded === false, `${presentation.questionLanguageId}: option analysis must remain excluded`);
  assert(finalNativeReview.sourceObjectParityEnforced === true, `${presentation.questionLanguageId}: source-object parity is not asserted`);
  assert(finalNativeReview.semanticSentenceParityEnforced === true, `${presentation.questionLanguageId}: semantic sentence parity is not asserted`);
  assert(finalNativeReview.productOwnerApprovalRecorded === false, `${presentation.questionLanguageId}: product-owner approval fabricated`);
  assert(finalNativeReview.multilingualFreezeAuthorized === false, `${presentation.questionLanguageId}: multilingual freeze authorized prematurely`);
  assert(finalNativeReview.sourceMathChanged === false, `${presentation.questionLanguageId}: source math changed`);

  assert(presentation.lifecycle.multilingualFreezeStatus === "UNFROZEN", `${presentation.questionLanguageId}: multilingual content frozen prematurely`);
  assert(presentation.lifecycle.questionStudioEnabled === false, `${presentation.questionLanguageId}: Question Studio unlocked prematurely`);
  assert(presentation.lifecycle.questionBankStatus === "NOT_STORED", `${presentation.questionLanguageId}: Question Bank unlocked prematurely`);
  assert(presentation.lifecycle.testEligibility === "INELIGIBLE", `${presentation.questionLanguageId}: tests unlocked prematurely`);
  assert(presentation.lifecycle.publiclyPublishable === false, `${presentation.questionLanguageId}: public delivery unlocked prematurely`);

  if ("optionAnalysis" in presentation.explanation) optionAnalysisFields += 1;
  assert(!("optionAnalysis" in presentation.explanation), `${presentation.questionLanguageId}: option analysis leaked into final learner explanation`);
  assert(presentation.explanation.method.trim().length > 0 && presentation.explanation.steps.length > 0 && presentation.explanation.examSpeedShortcut.trim().length > 0 && presentation.explanation.answer.trim().length > 0, `${presentation.questionLanguageId}: final explanation component missing`);
  assertTsdCp003NativeText(presentation.stem, presentation.language, `${presentation.questionLanguageId}/stem`);
  explanationChecks += 1;

  const malformed = presentation.language === "hi"
    ? [" पर के पास", " में के पास", "टैक्सीण", "वैनण", "बसण"]
    : [" ਉੱਤੇ ਕੋਲ", " ਵਿੱਚ ਕੋਲ", "ਟੈਕਸੀਨ", "ਵੈਨਨ", "ਬੱਸਨ"];
  for (const pattern of malformed) assert(!presentation.stem.includes(pattern), `${presentation.questionLanguageId}: malformed native case/replacement pattern '${pattern}'`);
  malformedCaseChecks += 1;

  const english = canonical.stem.toLowerCase();
  if (/\bif\b/u.test(english)) {
    if (presentation.language === "hi") assert(presentation.stem.includes("यदि") && presentation.stem.includes("तो"), `${presentation.questionLanguageId}: English IF relation was flattened in Hindi`);
    else assert(presentation.stem.includes("ਜੇ") && presentation.stem.includes("ਤਾਂ"), `${presentation.questionLanguageId}: English IF relation was flattened in Punjabi`);
    assert(sentenceCount(presentation.stem) >= 2, `${presentation.questionLanguageId}: conditional native stem is still over-compressed`);
    conditionalSentenceChecks += 1;
  }
  if (/\bwhen\b/u.test(english)) {
    if (presentation.language === "hi") assert(presentation.stem.includes("जब"), `${presentation.questionLanguageId}: English WHEN relation missing in Hindi`);
    else assert(presentation.stem.includes("ਜਦੋਂ"), `${presentation.questionLanguageId}: English WHEN relation missing in Punjabi`);
    whenClauseChecks += 1;
  }
  if (/\bbut\b|\bwhile\b/u.test(english)) {
    assert(hasContrast(presentation.stem, presentation.language), `${presentation.questionLanguageId}: English contrast relation was flattened`);
    contrastClauseChecks += 1;
  }
  if (/\binstead\b/u.test(english)) {
    if (presentation.language === "hi") assert(presentation.stem.includes("के बजाय"), `${presentation.questionLanguageId}: English INSTEAD relation missing in Hindi`);
    else assert(presentation.stem.includes("ਦੀ ਥਾਂ"), `${presentation.questionLanguageId}: English INSTEAD relation missing in Punjabi`);
    insteadClauseChecks += 1;
  }
  if (/\bstill\b/u.test(english)) {
    assert(hasPersistence(presentation.stem, presentation.language), `${presentation.questionLanguageId}: English STILL relation was flattened`);
    persistenceClauseChecks += 1;
  }
  if (/\bbecause\b/u.test(english)) {
    if (presentation.language === "hi") assert(presentation.stem.includes("कारण"), `${presentation.questionLanguageId}: English BECAUSE relation missing in Hindi`);
    else assert(presentation.stem.includes("ਕਾਰਨ"), `${presentation.questionLanguageId}: English BECAUSE relation missing in Punjabi`);
    causeClauseChecks += 1;
  }

  const sourceObject = cp003EnglishSourceObjectKey(canonical.stem);
  if (sourceObject !== null) {
    const expectedNativeObject = cp003ExpectedNativeObject(sourceObject, presentation.language);
    assert(hasExpectedObject(presentation.stem, sourceObject, presentation.language), `${presentation.questionLanguageId}: English object ${sourceObject} must remain ${expectedNativeObject} in native stem`);
    sourceObjectParityChecks += 1;
    for (const [otherKey, otherActor] of Object.entries(EXPECTED_ACTOR_BY_KEY[presentation.language])) {
      if (otherKey === sourceObject) continue;
      assert(!presentation.stem.includes(otherActor), `${presentation.questionLanguageId}: unexpected alternate actor ${otherActor}`);
    }
    const expectedGeneric = sourceObject === "COACH" ? cp003ExpectedNativeObject(sourceObject, presentation.language) : null;
    for (const generic of SAFE_GENERIC_CONTEXT_NOUNS[presentation.language]) {
      if (generic === expectedGeneric) continue;
      assert(!presentation.stem.includes(generic), `${presentation.questionLanguageId}: generic context noun '${generic}' leaked after source-object alignment`);
    }
    exclusiveActorChecks += 1;
    if (sourceObject !== "CAR") {
      const corruptSuffix = presentation.language === "hi" ? "ण" : "ਨ";
      assert(!presentation.stem.includes(`${expectedNativeObject}${corruptSuffix}`), `${presentation.questionLanguageId}: actor replacement corrupted a surrounding word`);
    }
    corruptionChecks += 1;
    if (FEMININE_OBJECTS.has(sourceObject)) {
      for (const masculine of MASCULINE_FORMS[presentation.language]) assert(!presentation.stem.includes(masculine), `${presentation.questionLanguageId}: feminine ${sourceObject} retains masculine form '${masculine}'`);
      agreementChecks += 1;
    }
    if (sourceObject === "COACH") {
      for (const feminine of FEMININE_FORMS[presentation.language]) assert(!presentation.stem.includes(feminine), `${presentation.questionLanguageId}: masculine COACH retains feminine form '${feminine}'`);
      masculineAgreementChecks += 1;
    }
  } else {
    assert(!nativeStemHasIntroducedActor(presentation.stem, presentation.language), `${presentation.questionLanguageId}: native stem invented a person/vehicle object absent from English`);
    objectNeutralityChecks += 1;
  }
}

assert(optionAnalysisFields === 0, `Expected zero final option-analysis fields, received ${optionAnalysisFields}`);
assert(explanationChecks === 126, `Expected 126 final learner-explanation checks, received ${explanationChecks}`);
assert(sourceObjectParityChecks + objectNeutralityChecks === 126, "Every native row must receive object-parity or object-neutrality check");
assert(exclusiveActorChecks === sourceObjectParityChecks, "Every object-bearing row must reject alternate native actors");
assert(corruptionChecks === sourceObjectParityChecks, "Every object-bearing row must receive actor-corruption check");
assert(malformedCaseChecks === 126, `Expected 126 malformed-case checks, received ${malformedCaseChecks}`);
assert(conditionalSentenceChecks === 16, `Expected 16 Hindi/Punjabi IF-clause parity checks, received ${conditionalSentenceChecks}`);
assert(whenClauseChecks === 4, `Expected 4 Hindi/Punjabi WHEN-clause parity checks, received ${whenClauseChecks}`);
assert(contrastClauseChecks === 26, `Expected 26 Hindi/Punjabi contrast checks, received ${contrastClauseChecks}`);
assert(insteadClauseChecks === 2, `Expected 2 Hindi/Punjabi INSTEAD checks, received ${insteadClauseChecks}`);
assert(persistenceClauseChecks === 6, `Expected 6 Hindi/Punjabi STILL checks, received ${persistenceClauseChecks}`);
assert(causeClauseChecks === 4, `Expected 4 Hindi/Punjabi BECAUSE checks, received ${causeClauseChecks}`);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_HI_PA_FINAL_PUBLIC_NATIVE_REVIEW_CANDIDATE",
  frozenEnglishRows: frozen.length,
  hindiRows: hi.length,
  punjabiRows: pa.length,
  nativeRows: all.length,
  optionAnalysisFields,
  explanationContract: "METHOD_STEPS_SHORTCUT_ANSWER",
  sourceObjectParityChecks,
  objectNeutralityChecks,
  exclusiveActorChecks,
  corruptionChecks,
  feminineAgreementChecks: agreementChecks,
  masculineCoachAgreementChecks: masculineAgreementChecks,
  malformedCaseChecks,
  conditionalSentenceChecks,
  whenClauseChecks,
  contrastClauseChecks,
  insteadClauseChecks,
  persistenceClauseChecks,
  causeClauseChecks,
  semanticSentenceParityEnforced: true,
  nativeEditorialStatus: TSD_CP003_NATIVE_FINAL_REVIEW_STATUS,
  frozenEnglishCorpusChanged: false,
  productOwnerApprovalRecorded: false,
  multilingualFreezeAuthorized: false,
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
