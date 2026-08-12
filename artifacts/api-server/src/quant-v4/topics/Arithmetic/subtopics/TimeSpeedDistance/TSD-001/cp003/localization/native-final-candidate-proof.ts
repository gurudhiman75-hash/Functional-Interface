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
  hi: Object.freeze([
    "एक डिलीवरी वाहन",
    "एक डिलीवरी वैन",
    "एक स्कूल बस",
    "एक वाहन",
    "एक कोच",
    "एक ट्रक",
    "एक टैक्सी",
    "एक कार",
    "एक बस",
    "एक यात्री",
    "एक व्यक्ति",
  ]),
  pa: Object.freeze([
    "ਇੱਕ ਡਿਲਿਵਰੀ ਵਾਹਨ",
    "ਇੱਕ ਡਿਲਿਵਰੀ ਵੈਨ",
    "ਇੱਕ ਸਕੂਲ ਬੱਸ",
    "ਇੱਕ ਵਾਹਨ",
    "ਇੱਕ ਕੋਚ",
    "ਇੱਕ ਟਰੱਕ",
    "ਇੱਕ ਟੈਕਸੀ",
    "ਇੱਕ ਕਾਰ",
    "ਇੱਕ ਬੱਸ",
    "ਇੱਕ ਯਾਤਰੀ",
    "ਇੱਕ ਵਿਅਕਤੀ",
  ]),
} as const);

const EXPECTED_ACTOR_BY_KEY = Object.freeze({
  hi: Object.freeze({
    DELIVERY_VAN: "एक डिलीवरी वैन",
    SCHOOL_BUS: "एक स्कूल बस",
    COACH: "एक कोच",
    TAXI: "एक टैक्सी",
    CAR: "एक कार",
    BUS: "एक बस",
  }),
  pa: Object.freeze({
    DELIVERY_VAN: "ਇੱਕ ਡਿਲਿਵਰੀ ਵੈਨ",
    SCHOOL_BUS: "ਇੱਕ ਸਕੂਲ ਬੱਸ",
    COACH: "ਇੱਕ ਕੋਚ",
    TAXI: "ਇੱਕ ਟੈਕਸੀ",
    CAR: "ਇੱਕ ਕਾਰ",
    BUS: "ਇੱਕ ਬੱਸ",
  }),
} as const);

const FEMININE_OBJECTS = new Set<TsdCp003SourceObjectKey>([
  "DELIVERY_VAN",
  "SCHOOL_BUS",
  "TAXI",
  "CAR",
  "BUS",
]);

const MASCULINE_FORMS = Object.freeze({
  hi: Object.freeze(["तय करता है", "पहुँचता है", "चलना शुरू करता है", "रुकता है", "चलता है", "रुका?", "रुका।"]),
  pa: Object.freeze(["ਤੈਅ ਕਰਦਾ ਹੈ", "ਪਹੁੰਚਦਾ ਹੈ", "ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ", "ਰੁਕਦਾ ਹੈ", "ਚੱਲਦਾ ਹੈ", "ਰੁਕਿਆ?", "ਰੁਕਿਆ।"]),
} as const);

function nativeStemHasIntroducedActor(stem: string, language: TsdCp003NativeLanguage): boolean {
  return INTRODUCED_ACTOR_PHRASES[language].some((phrase) => stem.includes(phrase));
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
let corruptionChecks = 0;

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
  assert(finalNativeReview.solePublicNativeEntryPoint === true, `${presentation.questionLanguageId}: final surface is not marked as sole public native entry point`);
  assert(finalNativeReview.explanationContract === "METHOD_STEPS_SHORTCUT_ANSWER", `${presentation.questionLanguageId}: final explanation contract drift`);
  assert(finalNativeReview.optionAnalysisIncluded === false, `${presentation.questionLanguageId}: option analysis must remain excluded`);
  assert(finalNativeReview.sourceObjectParityEnforced === true, `${presentation.questionLanguageId}: source-object parity is not asserted`);
  assert(finalNativeReview.productOwnerApprovalRecorded === false, `${presentation.questionLanguageId}: product-owner approval fabricated`);
  assert(finalNativeReview.multilingualFreezeAuthorized === false, `${presentation.questionLanguageId}: multilingual freeze authorized prematurely`);
  assert(finalNativeReview.sourceMathChanged === false, `${presentation.questionLanguageId}: source math changed`);

  assert(presentation.lifecycle.nativeEditorialStatus === TSD_CP003_NATIVE_FINAL_REVIEW_STATUS, `${presentation.questionLanguageId}: lifecycle native status drift`);
  assert(presentation.lifecycle.multilingualFreezeStatus === "UNFROZEN", `${presentation.questionLanguageId}: multilingual content frozen prematurely`);
  assert(presentation.lifecycle.questionStudioEnabled === false, `${presentation.questionLanguageId}: Question Studio unlocked prematurely`);
  assert(presentation.lifecycle.questionBankStatus === "NOT_STORED", `${presentation.questionLanguageId}: Question Bank unlocked prematurely`);
  assert(presentation.lifecycle.testEligibility === "INELIGIBLE", `${presentation.questionLanguageId}: tests unlocked prematurely`);
  assert(presentation.lifecycle.publiclyPublishable === false, `${presentation.questionLanguageId}: public delivery unlocked prematurely`);

  if ("optionAnalysis" in presentation.explanation) optionAnalysisFields += 1;
  assert(!("optionAnalysis" in presentation.explanation), `${presentation.questionLanguageId}: option analysis leaked into final learner explanation`);
  assert(presentation.explanation.method.trim().length > 0, `${presentation.questionLanguageId}: method missing`);
  assert(presentation.explanation.steps.length > 0, `${presentation.questionLanguageId}: worked steps missing`);
  assert(presentation.explanation.examSpeedShortcut.trim().length > 0, `${presentation.questionLanguageId}: exam shortcut missing`);
  assert(presentation.explanation.answer.trim().length > 0, `${presentation.questionLanguageId}: answer explanation missing`);
  assertTsdCp003NativeText(presentation.stem, presentation.language, `${presentation.questionLanguageId}/stem`);
  assertTsdCp003NativeText(presentation.explanation.method, presentation.language, `${presentation.questionLanguageId}/method`);
  presentation.explanation.steps.forEach((step, index) => assertTsdCp003NativeText(step, presentation.language, `${presentation.questionLanguageId}/step-${index + 1}`));
  assertTsdCp003NativeText(presentation.explanation.examSpeedShortcut, presentation.language, `${presentation.questionLanguageId}/shortcut`);
  assertTsdCp003NativeText(presentation.explanation.answer, presentation.language, `${presentation.questionLanguageId}/answer`);
  explanationChecks += 1;

  const sourceObject = cp003EnglishSourceObjectKey(canonical.stem);
  if (sourceObject !== null) {
    const expectedNativeObject = cp003ExpectedNativeObject(sourceObject, presentation.language);
    const expectedActor = EXPECTED_ACTOR_BY_KEY[presentation.language][sourceObject];
    assert(
      presentation.stem.includes(expectedNativeObject) && presentation.stem.includes(expectedActor),
      `${presentation.questionLanguageId}: English object ${sourceObject} must remain ${expectedActor} in native stem`,
    );
    sourceObjectParityChecks += 1;

    for (const [otherKey, otherActor] of Object.entries(EXPECTED_ACTOR_BY_KEY[presentation.language])) {
      if (otherKey === sourceObject) continue;
      assert(!presentation.stem.includes(otherActor), `${presentation.questionLanguageId}: unexpected alternate actor ${otherActor}`);
    }
    exclusiveActorChecks += 1;

    const corruptSuffix = presentation.language === "hi" ? "ण" : "ਨ";
    assert(!presentation.stem.includes(`${expectedActor}${corruptSuffix}`), `${presentation.questionLanguageId}: actor replacement corrupted a surrounding word`);
    corruptionChecks += 1;

    if (FEMININE_OBJECTS.has(sourceObject)) {
      for (const masculine of MASCULINE_FORMS[presentation.language]) {
        assert(!presentation.stem.includes(masculine), `${presentation.questionLanguageId}: feminine ${sourceObject} retains masculine form '${masculine}'`);
      }
      agreementChecks += 1;
    }
  } else {
    assert(
      !nativeStemHasIntroducedActor(presentation.stem, presentation.language),
      `${presentation.questionLanguageId}: native stem invented a person/vehicle object absent from English`,
    );
    objectNeutralityChecks += 1;
  }
}

assert(optionAnalysisFields === 0, `Expected zero final option-analysis fields, received ${optionAnalysisFields}`);
assert(explanationChecks === 126, `Expected 126 final learner-explanation checks, received ${explanationChecks}`);
assert(sourceObjectParityChecks + objectNeutralityChecks === 126, "Every native row must receive either an object-parity or object-neutrality check");
assert(exclusiveActorChecks === sourceObjectParityChecks, "Every object-bearing row must reject alternate native actors");
assert(corruptionChecks === sourceObjectParityChecks, "Every object-bearing row must receive an actor-corruption check");

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
  nativeEditorialStatus: TSD_CP003_NATIVE_FINAL_REVIEW_STATUS,
  frozenEnglishCorpusChanged: false,
  productOwnerApprovalRecorded: false,
  multilingualFreezeAuthorized: false,
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
