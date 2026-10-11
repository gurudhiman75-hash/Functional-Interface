import { absRational, compare, type Rational } from "../../foundation/rational";
import type { TsdCp003EnglishFrozenRecord } from "../english-frozen";
import { formatExamNumber } from "../generation-support";
import {
  generateCp003AuthoritativeNativeCandidate,
  type TsdCp003NativeAuthoritativeRow,
} from "./native-authoritative";
import {
  assertTsdCp003NativeText,
  formatNativeClock,
  formatNativeDuration,
  type TsdCp003NativeLanguage,
} from "./native-language-primitives";

export const TSD_CP003_NATIVE_FINAL_REVIEW_STATUS = "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW" as const;

export type TsdCp003SourceObjectKey =
  | "DELIVERY_VAN"
  | "SCHOOL_BUS"
  | "COACH"
  | "TAXI"
  | "CAR"
  | "BUS";

export type TsdCp003FinalNativePresentation = Omit<
  TsdCp003NativeAuthoritativeRow["presentation"],
  "stem" | "explanation" | "lifecycle"
> & Readonly<{
  stem: string;
  explanation: Readonly<{
    method: string;
    steps: readonly string[];
    examSpeedShortcut: string;
    answer: string;
  }>;
  lifecycle: Readonly<{
    nativeEditorialStatus: typeof TSD_CP003_NATIVE_FINAL_REVIEW_STATUS;
    multilingualFreezeStatus: "UNFROZEN";
    questionStudioEnabled: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;

export type TsdCp003FinalNativeReviewRow = Readonly<{
  source: TsdCp003EnglishFrozenRecord;
  presentation: TsdCp003FinalNativePresentation;
  finalNativeReview: Readonly<{
    status: typeof TSD_CP003_NATIVE_FINAL_REVIEW_STATUS;
    solePublicNativeEntryPoint: true;
    explanationContract: "METHOD_STEPS_SHORTCUT_ANSWER";
    optionAnalysisIncluded: false;
    sourceObjectParityEnforced: true;
    semanticSentenceParityEnforced: true;
    productOwnerApprovalRecorded: false;
    multilingualFreezeAuthorized: false;
    sourceMathChanged: false;
  }>;
}>;

const OBJECT_PATTERNS: readonly Readonly<{
  key: TsdCp003SourceObjectKey;
  english: RegExp;
  hi: string;
  pa: string;
}>[] = Object.freeze([
  Object.freeze({ key: "DELIVERY_VAN", english: /\bdelivery van\b/iu, hi: "डिलीवरी वैन", pa: "ਡਿਲਿਵਰੀ ਵੈਨ" }),
  Object.freeze({ key: "SCHOOL_BUS", english: /\bschool bus\b/iu, hi: "स्कूल बस", pa: "ਸਕੂਲ ਬੱਸ" }),
  Object.freeze({ key: "COACH", english: /\bcoach\b/iu, hi: "कोच", pa: "ਕੋਚ" }),
  Object.freeze({ key: "TAXI", english: /\btaxi\b/iu, hi: "टैक्सी", pa: "ਟੈਕਸੀ" }),
  Object.freeze({ key: "CAR", english: /\bcar\b/iu, hi: "कार", pa: "ਕਾਰ" }),
  Object.freeze({ key: "BUS", english: /\bbus\b/iu, hi: "बस", pa: "ਬੱਸ" }),
]);

const ACTOR_PHRASES = Object.freeze({
  hi: Object.freeze(["एक डिलीवरी वाहन", "एक डिलीवरी वैन", "एक स्कूल बस", "एक वाहन", "एक कोच", "एक ट्रक", "एक टैक्सी", "एक कार", "एक बस"]),
  pa: Object.freeze(["ਇੱਕ ਡਿਲਿਵਰੀ ਵਾਹਨ", "ਇੱਕ ਡਿਲਿਵਰੀ ਵੈਨ", "ਇੱਕ ਸਕੂਲ ਬੱਸ", "ਇੱਕ ਵਾਹਨ", "ਇੱਕ ਕੋਚ", "ਇੱਕ ਟਰੱਕ", "ਇੱਕ ਟੈਕਸੀ", "ਇੱਕ ਕਾਰ", "ਇੱਕ ਬੱਸ"]),
} as const);

const GENERIC_CONTEXT_NOUNS = Object.freeze({
  hi: Object.freeze(["वाहन", "कोच", "ट्रक"]),
  pa: Object.freeze(["ਵਾਹਨ", "ਕੋਚ", "ਟਰੱਕ"]),
} as const);

const FEMININE_OBJECTS = new Set<TsdCp003SourceObjectKey>(["DELIVERY_VAN", "SCHOOL_BUS", "TAXI", "CAR", "BUS"]);

const n = (value: Rational): string => formatExamNumber(value);
const km = (value: Rational): string => `${n(value)} km`;
const sp = (value: Rational): string => `${n(value)} km/h`;
const dur = (value: Rational, language: TsdCp003NativeLanguage): string => formatNativeDuration(value, language);

export function cp003EnglishSourceObjectKey(stem: string): TsdCp003SourceObjectKey | null {
  for (const entry of OBJECT_PATTERNS) if (entry.english.test(stem)) return entry.key;
  return null;
}

export function cp003ExpectedNativeObject(key: TsdCp003SourceObjectKey, language: TsdCp003NativeLanguage): string {
  const entry = OBJECT_PATTERNS.find((candidate) => candidate.key === key);
  if (!entry) throw new Error(`Unknown CP-003 source object key: ${key}`);
  return language === "hi" ? entry.hi : entry.pa;
}

export function cp003ExpectedNativeContext(stem: string, language: TsdCp003NativeLanguage): string | null {
  const lower = stem.toLowerCase();
  const hi = language === "hi";
  if (lower.includes("on its usual route") && lower.includes("on a regional route")) return hi ? "अपने नियमित क्षेत्रीय मार्ग पर" : "ਆਪਣੇ ਨਿਯਮਿਤ ਖੇਤਰੀ ਰਸਤੇ ਉੱਤੇ";
  if (lower.includes("on a fixed route")) return hi ? "एक निश्चित मार्ग पर" : "ਇੱਕ ਨਿਰਧਾਰਤ ਰਸਤੇ ਉੱਤੇ";
  if (lower.includes("on its usual route")) return hi ? "अपने नियमित मार्ग पर" : "ਆਪਣੇ ਨਿਯਮਿਤ ਰਸਤੇ ਉੱਤੇ";
  if (lower.includes("on a scheduled trip")) return hi ? "अपनी निर्धारित यात्रा में" : "ਆਪਣੀ ਨਿਰਧਾਰਤ ਯਾਤਰਾ ਵਿੱਚ";
  if (lower.includes("on a highway trip")) return hi ? "राजमार्ग की यात्रा में" : "ਹਾਈਵੇ ਦੇ ਸਫ਼ਰ ਵਿੱਚ";
  if (lower.includes("on a regional route")) return hi ? "क्षेत्रीय मार्ग पर" : "ਖੇਤਰੀ ਰਸਤੇ ਉੱਤੇ";
  if (lower.includes("on an intercity route")) return hi ? "अंतर-शहरी मार्ग पर" : "ਅੰਤਰ-ਸ਼ਹਿਰੀ ਰਸਤੇ ਉੱਤੇ";
  return null;
}

function actor(source: TsdCp003EnglishFrozenRecord, language: TsdCp003NativeLanguage): string | null {
  const key = cp003EnglishSourceObjectKey(source.stem);
  if (key === null) return null;
  return `${language === "hi" ? "एक" : "ਇੱਕ"} ${cp003ExpectedNativeObject(key, language)}`;
}

function actorWithContext(source: TsdCp003EnglishFrozenRecord, language: TsdCp003NativeLanguage): string | null {
  const a = actor(source, language);
  if (a === null) return null;
  const context = cp003ExpectedNativeContext(source.stem, language);
  return context ? `${a} ${context}` : a;
}

function contextBeforeLoss(source: TsdCp003EnglishFrozenRecord, language: TsdCp003NativeLanguage): string {
  const context = cp003ExpectedNativeContext(source.stem, language);
  if (!context) return language === "hi" ? "समय गंवाने के बाद" : "ਸਮਾਂ ਗੁਆਉਣ ਤੋਂ ਬਾਅਦ";
  return language === "hi" ? `${context} समय गंवाने के बाद` : `${context} ਸਮਾਂ ਗੁਆਉਣ ਤੋਂ ਬਾਅਦ`;
}

function targetText(target: Extract<TsdCp003EnglishFrozenRecord["input"], { solveMode: "walkingRidingAllocation" }>["target"], language: TsdCp003NativeLanguage): string {
  if (language === "hi") {
    if (target === "WALKING_TIME") return "पैदल चलने का समय";
    if (target === "RIDING_TIME") return "सवारी में लगा समय";
    if (target === "WALKING_DISTANCE") return "पैदल तय की गई दूरी";
    return "सवारी से तय की गई दूरी";
  }
  if (target === "WALKING_TIME") return "ਪੈਦਲ ਚੱਲਣ ਦਾ ਸਮਾਂ";
  if (target === "RIDING_TIME") return "ਸਵਾਰੀ ਵਿੱਚ ਲੱਗਿਆ ਸਮਾਂ";
  if (target === "WALKING_DISTANCE") return "ਪੈਦਲ ਤੈਅ ਕੀਤੀ ਦੂਰੀ";
  return "ਸਵਾਰੀ ਨਾਲ ਤੈਅ ਕੀਤੀ ਦੂਰੀ";
}

function departureShiftText(value: Rational, language: TsdCp003NativeLanguage): string {
  const amount = dur(absRational(value), language);
  if (value.numerator < 0n) return language === "hi" ? `${amount} पहले` : `${amount} ਪਹਿਲਾਂ`;
  return language === "hi" ? `${amount} बाद` : `${amount} ਬਾਅਦ`;
}

function renderObjectNeutralStem(source: TsdCp003EnglishFrozenRecord, language: TsdCp003NativeLanguage, fallback: string): string {
  const input = source.input;
  const hi = language === "hi";
  switch (input.solveMode) {
    case "distanceFromEarlyLatePair":
      return hi
        ? `एक ही मार्ग पर ${sp(input.slowerTrialSpeed)} से चलने पर ${dur(input.lateBy, language)} देर होती है, जबकि ${sp(input.fasterTrialSpeed)} से चलने पर ${dur(input.earlyBy, language)} पहले पहुँचा जाता है। मार्ग की दूरी ज्ञात कीजिए।`
        : `ਇੱਕੋ ਰਸਤੇ ਉੱਤੇ ${sp(input.slowerTrialSpeed)} ਨਾਲ ਚੱਲਣ ਤੇ ${dur(input.lateBy, language)} ਦੇਰ ਹੁੰਦੀ ਹੈ, ਜਦਕਿ ${sp(input.fasterTrialSpeed)} ਨਾਲ ਚੱਲਣ ਤੇ ${dur(input.earlyBy, language)} ਪਹਿਲਾਂ ਪਹੁੰਚਿਆ ਜਾਂਦਾ ਹੈ। ਰਸਤੇ ਦੀ ਦੂਰੀ ਕੱਢੋ।`;
    case "numberOfStopsFromOverallDelay":
      return hi
        ? `समान ठहरावों के कारण कुल ${dur(input.totalDelay, language)} की देरी होती है। प्रत्येक ठहराव ${dur(input.stopDuration, language)} का है। ठहरावों की संख्या ज्ञात कीजिए।`
        : `ਬਰਾਬਰ ਠਹਿਰਾਅਾਂ ਕਾਰਨ ਕੁੱਲ ${dur(input.totalDelay, language)} ਦੀ ਦੇਰੀ ਹੁੰਦੀ ਹੈ। ਹਰ ਠਹਿਰਾਅ ${dur(input.stopDuration, language)} ਦਾ ਹੈ। ਠਹਿਰਾਅਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`;
    case "delayFromRegularStops":
      return hi
        ? `${n(input.stopCount)} समान ठहराव हैं और प्रत्येक ${dur(input.stopDuration, language)} का है। इन ठहरावों से कुल कितनी देरी होगी?`
        : `${n(input.stopCount)} ਬਰਾਬਰ ਠਹਿਰਾਅ ਹਨ ਅਤੇ ਹਰ ਇੱਕ ${dur(input.stopDuration, language)} ਦਾ ਹੈ। ਇਨ੍ਹਾਂ ਠਹਿਰਾਅਾਂ ਨਾਲ ਕੁੱਲ ਕਿੰਨੀ ਦੇਰੀ ਹੋਵੇਗੀ?`;
    case "restTimeInRepeatedTravelRestCycle": {
      const conditional = /\bif\b/iu.test(source.stem);
      return hi
        ? conditional
          ? `एक यात्रा-विश्राम पैटर्न में ${n(input.cycleCount)} यात्रा-खंड हैं, प्रत्येक ${dur(input.travelTimePerCycle, language)} का है। इनके बीच ${n(input.restEvents)} समान विश्राम हैं। यदि कुल समय ${dur(input.totalElapsedTime, language)} है, तो एक विश्राम की अवधि ज्ञात कीजिए।`
          : `एक यात्रा-विश्राम पैटर्न में ${n(input.cycleCount)} यात्रा-खंड हैं, प्रत्येक ${dur(input.travelTimePerCycle, language)} का है। इनके बीच ${n(input.restEvents)} समान विश्राम हैं और कुल समय ${dur(input.totalElapsedTime, language)} है। एक विश्राम की अवधि ज्ञात कीजिए।`
        : conditional
          ? `ਇੱਕ ਸਫ਼ਰ-ਆਰਾਮ ਪੈਟਰਨ ਵਿੱਚ ${n(input.cycleCount)} ਸਫ਼ਰ-ਭਾਗ ਹਨ ਅਤੇ ਹਰ ਭਾਗ ${dur(input.travelTimePerCycle, language)} ਦਾ ਹੈ। ਇਨ੍ਹਾਂ ਵਿਚਕਾਰ ${n(input.restEvents)} ਬਰਾਬਰ ਆਰਾਮ ਹਨ। ਜੇ ਕੁੱਲ ਸਮਾਂ ${dur(input.totalElapsedTime, language)} ਹੈ, ਤਾਂ ਇੱਕ ਆਰਾਮ ਦੀ ਮਿਆਦ ਕੱਢੋ।`
          : `ਇੱਕ ਸਫ਼ਰ-ਆਰਾਮ ਪੈਟਰਨ ਵਿੱਚ ${n(input.cycleCount)} ਸਫ਼ਰ-ਭਾਗ ਹਨ ਅਤੇ ਹਰ ਭਾਗ ${dur(input.travelTimePerCycle, language)} ਦਾ ਹੈ। ਇਨ੍ਹਾਂ ਵਿਚਕਾਰ ${n(input.restEvents)} ਬਰਾਬਰ ਆਰਾਮ ਹਨ ਅਤੇ ਕੁੱਲ ਸਮਾਂ ${dur(input.totalElapsedTime, language)} ਹੈ। ਇੱਕ ਆਰਾਮ ਦੀ ਮਿਆਦ ਕੱਢੋ।`;
    }
    case "speedChangePointDistance":
      return hi
        ? `${km(input.totalDistance)} की यात्रा ${dur(input.totalTravelTime, language)} में पूरी होती है। यात्रा ${sp(input.firstSpeed)} से शुरू होती है और बाद में गति ${sp(input.secondSpeed)} हो जाती है। कितने km चलने के बाद गति बदलती है?`
        : `${km(input.totalDistance)} ਦਾ ਸਫ਼ਰ ${dur(input.totalTravelTime, language)} ਵਿੱਚ ਪੂਰਾ ਹੁੰਦਾ ਹੈ। ਸਫ਼ਰ ${sp(input.firstSpeed)} ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ ਅਤੇ ਬਾਅਦ ਵਿੱਚ ਰਫ਼ਤਾਰ ${sp(input.secondSpeed)} ਹੋ ਜਾਂਦੀ ਹੈ। ਕਿੰਨੇ km ਤੈਅ ਕਰਨ ਤੋਂ ਬਾਅਦ ਰਫ਼ਤਾਰ ਬਦਲਦੀ ਹੈ?`;
    case "fractionOfRouteAtChangedSpeed":
      return hi
        ? `${km(input.totalDistance)} का मार्ग ${dur(input.totalTravelTime, language)} में पूरा होता है। मार्ग का कुछ भाग ${sp(input.originalSpeed)} से और शेष भाग ${sp(input.changedSpeed)} से तय होता है। बदली हुई गति पर मार्ग का कितना प्रतिशत तय होता है?`
        : `${km(input.totalDistance)} ਦਾ ਰਸਤਾ ${dur(input.totalTravelTime, language)} ਵਿੱਚ ਪੂਰਾ ਹੁੰਦਾ ਹੈ। ਰਸਤੇ ਦਾ ਕੁਝ ਭਾਗ ${sp(input.originalSpeed)} ਨਾਲ ਅਤੇ ਬਾਕੀ ਭਾਗ ${sp(input.changedSpeed)} ਨਾਲ ਤੈਅ ਹੁੰਦਾ ਹੈ। ਬਦਲੀ ਰਫ਼ਤਾਰ ਉੱਤੇ ਰਸਤੇ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਤੈਅ ਹੁੰਦਾ ਹੈ?`;
    case "arrivalShiftFromDepartureAndSpeedChanges":
      return hi
        ? `${km(input.distance)} की यात्रा सामान्यतः ${sp(input.originalSpeed)} से होती है। यदि प्रस्थान ${departureShiftText(input.departureShift, language)} हो जाए और गति ${sp(input.newSpeed)} हो जाए, तो आगमन-समय में परिवर्तन की मात्रा ज्ञात कीजिए।`
        : `${km(input.distance)} ਦਾ ਸਫ਼ਰ ਆਮ ਤੌਰ ਉੱਤੇ ${sp(input.originalSpeed)} ਨਾਲ ਹੁੰਦਾ ਹੈ। ਜੇ ਰਵਾਨਗੀ ${departureShiftText(input.departureShift, language)} ਹੋ ਜਾਵੇ ਅਤੇ ਰਫ਼ਤਾਰ ${sp(input.newSpeed)} ਹੋ ਜਾਵੇ, ਤਾਂ ਪਹੁੰਚਣ ਦੇ ਸਮੇਂ ਵਿੱਚ ਬਦਲਾਅ ਦੀ ਮਾਤਰਾ ਕੱਢੋ।`;
    case "walkingRidingAllocation":
      return hi
        ? `${km(input.totalDistance)} की मिश्रित पैदल-सवारी यात्रा ${dur(input.totalTime, language)} में पूरी होती है। पैदल गति ${sp(input.walkingSpeed)} और सवारी की गति ${sp(input.ridingSpeed)} है। ${targetText(input.target, language)} ज्ञात कीजिए।`
        : `${km(input.totalDistance)} ਦਾ ਮਿਲਿਆ-ਜੁਲਿਆ ਪੈਦਲ-ਸਵਾਰੀ ਸਫ਼ਰ ${dur(input.totalTime, language)} ਵਿੱਚ ਪੂਰਾ ਹੁੰਦਾ ਹੈ। ਪੈਦਲ ਰਫ਼ਤਾਰ ${sp(input.walkingSpeed)} ਅਤੇ ਸਵਾਰੀ ਦੀ ਰਫ਼ਤਾਰ ${sp(input.ridingSpeed)} ਹੈ। ${targetText(input.target, language)} ਕੱਢੋ।`;
    default:
      return fallback;
  }
}

function replaceContextActor(nativeStem: string, expectedObject: string, language: TsdCp003NativeLanguage): string {
  const article = language === "hi" ? "एक" : "ਇੱਕ";
  const replacementWithArticle = `${article} ${expectedObject}`;
  let aligned = nativeStem;
  let replaced = false;
  for (const phrase of ACTOR_PHRASES[language]) {
    if (!aligned.includes(phrase)) continue;
    aligned = aligned.split(phrase).join(replacementWithArticle);
    replaced = true;
  }
  for (const noun of GENERIC_CONTEXT_NOUNS[language]) {
    if (!aligned.includes(noun)) continue;
    aligned = aligned.split(noun).join(expectedObject);
    replaced = true;
  }
  if (!replaced) aligned = `${replacementWithArticle} ${aligned}`;
  if (language === "hi") aligned = aligned.replace(`${replacementWithArticle} कितनी बार`, "वह कितनी बार");
  else aligned = aligned.replace(`${replacementWithArticle} ਕਿੰਨੀ ਵਾਰ`, "ਉਹ ਕਿੰਨੀ ਵਾਰ");
  return aligned;
}

function applyObjectAgreement(stem: string, key: TsdCp003SourceObjectKey, language: TsdCp003NativeLanguage): string {
  const masculineToFeminine: readonly (readonly [string, string])[] = language === "hi"
    ? [["तय करता है", "तय करती है"], ["पहुँचता है", "पहुँचती है"], ["पहुँचेगा", "पहुँचेगी"], ["चलना शुरू करता है", "चलना शुरू करती है"], ["रुकता है", "रुकती है"], ["चलता है", "चलती है"], ["करता है", "करती है"], ["रुका?", "रुकी?"], ["रुका।", "रुकी।"]]
    : [["ਤੈਅ ਕਰਦਾ ਹੈ", "ਤੈਅ ਕਰਦੀ ਹੈ"], ["ਪਹੁੰਚਦਾ ਹੈ", "ਪਹੁੰਚਦੀ ਹੈ"], ["ਪਹੁੰਚੇਗਾ", "ਪਹੁੰਚੇਗੀ"], ["ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ", "ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦੀ ਹੈ"], ["ਰੁਕਦਾ ਹੈ", "ਰੁਕਦੀ ਹੈ"], ["ਚੱਲਦਾ ਹੈ", "ਚੱਲਦੀ ਹੈ"], ["ਕਰਦਾ ਹੈ", "ਕਰਦੀ ਹੈ"], ["ਰੁਕਿਆ?", "ਰੁਕੀ?"], ["ਰੁਕਿਆ।", "ਰੁਕੀ।"]];

  let agreed = stem;
  if (FEMININE_OBJECTS.has(key)) {
    for (const [from, to] of masculineToFeminine) agreed = agreed.split(from).join(to);
    return agreed;
  }

  if (key === "COACH") {
    for (const [masculine, feminine] of masculineToFeminine) agreed = agreed.split(feminine).join(masculine);
  }
  return agreed;
}

function alignStemObjectWithEnglish(source: TsdCp003EnglishFrozenRecord, nativeStem: string, language: TsdCp003NativeLanguage): string {
  const sourceObject = cp003EnglishSourceObjectKey(source.stem);
  if (sourceObject === null) {
    const neutral = renderObjectNeutralStem(source, language, nativeStem);
    assertTsdCp003NativeText(neutral, language, `${source.questionLanguageId}/object-neutral-stem`);
    return neutral;
  }
  const expectedObject = cp003ExpectedNativeObject(sourceObject, language);
  const aligned = applyObjectAgreement(replaceContextActor(nativeStem, expectedObject, language), sourceObject, language);
  assertTsdCp003NativeText(aligned, language, `${source.questionLanguageId}/object-aligned-stem`);
  return aligned;
}

function renderSemanticSentenceParity(source: TsdCp003EnglishFrozenRecord, stem: string, language: TsdCp003NativeLanguage): string {
  const english = source.stem.toLowerCase();
  const input = source.input;
  const a = actor(source, language);
  const s = actorWithContext(source, language);
  const hi = language === "hi";

  if (input.solveMode === "timeGainLossFromSpeedChange") {
    const faster = compare(input.changedSpeed, input.originalSpeed) > 0;
    if (/\bif\b/u.test(english)) {
      return hi
        ? `${s} ${km(input.distance)} की दूरी तय करता है। यदि उसकी गति ${sp(input.originalSpeed)} से घटकर ${sp(input.changedSpeed)} हो जाए, तो कितना अतिरिक्त यात्रा-समय लगेगा?`
        : `${s} ${km(input.distance)} ਦੀ ਦੂਰੀ ਤੈਅ ਕਰਦਾ ਹੈ। ਜੇ ਉਸਦੀ ਰਫ਼ਤਾਰ ${sp(input.originalSpeed)} ਤੋਂ ਘਟ ਕੇ ${sp(input.changedSpeed)} ਹੋ ਜਾਵੇ, ਤਾਂ ਸਫ਼ਰ ਲਈ ਕਿੰਨਾ ਵਾਧੂ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    }
    return hi
      ? `${s} सामान्यतः ${km(input.distance)} की दूरी ${sp(input.originalSpeed)} से तय करता है, लेकिन अब उसकी गति ${sp(input.changedSpeed)} है। ${faster ? "यात्रा-समय में कितनी कमी आएगी?" : "कितना अतिरिक्त यात्रा-समय लगेगा?"}`
      : `${s} ਆਮ ਤੌਰ ਉੱਤੇ ${km(input.distance)} ਦੀ ਦੂਰੀ ${sp(input.originalSpeed)} ਨਾਲ ਤੈਅ ਕਰਦਾ ਹੈ, ਪਰ ਹੁਣ ਉਸਦੀ ਰਫ਼ਤਾਰ ${sp(input.changedSpeed)} ਹੈ। ${faster ? "ਸਫ਼ਰ ਦੇ ਸਮੇਂ ਵਿੱਚ ਕਿੰਨੀ ਕਮੀ ਆਵੇਗੀ?" : "ਸਫ਼ਰ ਲਈ ਕਿੰਨਾ ਵਾਧੂ ਸਮਾਂ ਲੱਗੇਗਾ?"}`;
  }

  if (input.solveMode === "distanceFromSpeedTimeDifference") {
    if (s !== null) {
      return hi
        ? `जब ${s} ${sp(input.slowerSpeed)} से चलता है, तो उसी मार्ग को ${sp(input.fasterSpeed)} से तय करने की तुलना में ${dur(input.timeDifference, language)} अधिक समय लगता है। मार्ग की दूरी ज्ञात कीजिए।`
        : `ਜਦੋਂ ${s} ${sp(input.slowerSpeed)} ਨਾਲ ਚੱਲਦਾ ਹੈ, ਤਾਂ ਉਸੇ ਰਸਤੇ ਨੂੰ ${sp(input.fasterSpeed)} ਨਾਲ ਤੈਅ ਕਰਨ ਦੇ ਮੁਕਾਬਲੇ ${dur(input.timeDifference, language)} ਵੱਧ ਸਮਾਂ ਲੱਗਦਾ ਹੈ। ਰਸਤੇ ਦੀ ਦੂਰੀ ਕੱਢੋ।`;
    }
    return hi
      ? `एक ही मार्ग को ${sp(input.slowerSpeed)} से तय करने में ${sp(input.fasterSpeed)} की तुलना में ${dur(input.timeDifference, language)} अधिक समय लगता है। मार्ग की दूरी ज्ञात कीजिए।`
      : `ਇੱਕੋ ਰਸਤਾ ${sp(input.slowerSpeed)} ਨਾਲ ਤੈਅ ਕਰਨ ਵਿੱਚ ${sp(input.fasterSpeed)} ਦੇ ਮੁਕਾਬਲੇ ${dur(input.timeDifference, language)} ਵੱਧ ਸਮਾਂ ਲੱਗਦਾ ਹੈ। ਰਸਤੇ ਦੀ ਦੂਰੀ ਕੱਢੋ।`;
  }

  if (input.solveMode === "speedFromFixedRouteTimeDifference") {
    if (input.representation === "KNOWN_OTHER_SPEED" && /\bwhen\b/u.test(english)) {
      const roleHi = input.unknownRole === "FASTER" ? "अधिक" : "कम";
      const rolePa = input.unknownRole === "FASTER" ? "ਵੱਧ" : "ਘੱਟ";
      return hi
        ? `${km(input.distance)} के मार्ग पर जब गति ${sp(input.knownSpeed)} से बदलकर दूसरी ${roleHi} गति हो जाती है, तब यात्रा-समय में ${dur(input.timeDifference, language)} का परिवर्तन होता है। दूसरी गति ज्ञात कीजिए।`
        : `${km(input.distance)} ਦੇ ਰਸਤੇ ਉੱਤੇ ਜਦੋਂ ਰਫ਼ਤਾਰ ${sp(input.knownSpeed)} ਤੋਂ ਬਦਲ ਕੇ ਦੂਜੀ ${rolePa} ਰਫ਼ਤਾਰ ਹੋ ਜਾਂਦੀ ਹੈ, ਤਾਂ ਸਫ਼ਰ ਦੇ ਸਮੇਂ ਵਿੱਚ ${dur(input.timeDifference, language)} ਦਾ ਬਦਲਾਅ ਹੁੰਦਾ ਹੈ। ਦੂਜੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
    }
    if (input.representation === "KNOWN_SPEED_RATIO") {
      const targetHi = input.target === "FASTER" ? "अधिक" : "कम";
      const targetPa = input.target === "FASTER" ? "ਵੱਧ" : "ਘੱਟ";
      return hi
        ? `${s} ${km(input.distance)} की यात्रा दो अलग गतियों से करता है, जिनका अनुपात ${n(input.slowerRatio)}:${n(input.fasterRatio)} है। दोनों स्थितियों के यात्रा-समयों में ${dur(input.timeDifference, language)} का अंतर है। ${targetHi} गति ज्ञात कीजिए।`
        : `${s} ${km(input.distance)} ਦਾ ਸਫ਼ਰ ਦੋ ਵੱਖ-ਵੱਖ ਰਫ਼ਤਾਰਾਂ ਨਾਲ ਕਰਦਾ ਹੈ, ਜਿਨ੍ਹਾਂ ਦਾ ਅਨੁਪਾਤ ${n(input.slowerRatio)}:${n(input.fasterRatio)} ਹੈ। ਦੋਵੇਂ ਹਾਲਤਾਂ ਦੇ ਸਫ਼ਰ-ਸਮਿਆਂ ਵਿੱਚ ${dur(input.timeDifference, language)} ਦਾ ਅੰਤਰ ਹੈ। ${targetPa} ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
    }
  }

  if (input.solveMode === "usualSpeedFromEarlyLatePair") {
    return hi
      ? `${s} ${sp(input.slowerTrialSpeed)} से चलने पर ${dur(input.lateBy, language)} देर से पहुँचता है, जबकि ${sp(input.fasterTrialSpeed)} से चलने पर ${dur(input.earlyBy, language)} पहले पहुँचता है। ठीक समय पर पहुँचने की सामान्य गति ज्ञात कीजिए।`
      : `${s} ${sp(input.slowerTrialSpeed)} ਨਾਲ ਚੱਲਣ ਤੇ ${dur(input.lateBy, language)} ਦੇਰ ਨਾਲ ਪਹੁੰਚਦਾ ਹੈ, ਜਦਕਿ ${sp(input.fasterTrialSpeed)} ਨਾਲ ਚੱਲਣ ਤੇ ${dur(input.earlyBy, language)} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ। ਬਿਲਕੁਲ ਸਮੇਂ ਉੱਤੇ ਪਹੁੰਚਣ ਲਈ ਆਮ ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
  }

  if (input.solveMode === "scheduledArrivalTimeFromActualSpeed" && /\bif\b/u.test(english)) {
    return hi
      ? `${s} ${formatNativeClock(input.departureMinuteFromDayZero, language)} पर प्रस्थान करता है। यदि मार्ग की दूरी ${km(input.distance)} है और गति ${sp(input.actualSpeed)} है, तो वह किस समय पहुँचेगा?`
      : `${s} ${formatNativeClock(input.departureMinuteFromDayZero, language)} ਵਜੇ ਰਵਾਨਾ ਹੁੰਦਾ ਹੈ। ਜੇ ਰਸਤੇ ਦੀ ਦੂਰੀ ${km(input.distance)} ਹੈ ਅਤੇ ਰਫ਼ਤਾਰ ${sp(input.actualSpeed)} ਹੈ, ਤਾਂ ਉਹ ਕਿੰਨੇ ਵਜੇ ਪਹੁੰਚੇਗਾ?`;
  }

  if (input.solveMode === "stoppageDurationFromRunningAndOverallSpeed") {
    return hi
      ? `${s} ${km(input.distance)} की दूरी तय करता है। चलते समय उसकी गति ${sp(input.runningSpeed)} है, लेकिन ठहरावों को शामिल करने के बाद औसत गति केवल ${sp(input.overallSpeed)} रह जाती है। वह कुल कितनी देर रुका?`
      : `${s} ${km(input.distance)} ਦੀ ਦੂਰੀ ਤੈਅ ਕਰਦਾ ਹੈ। ਚੱਲਣ ਸਮੇਂ ਉਸਦੀ ਰਫ਼ਤਾਰ ${sp(input.runningSpeed)} ਹੈ, ਪਰ ਠਹਿਰਾਅਾਂ ਨੂੰ ਸ਼ਾਮਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਔਸਤ ਰਫ਼ਤਾਰ ਸਿਰਫ਼ ${sp(input.overallSpeed)} ਰਹਿ ਜਾਂਦੀ ਹੈ। ਉਹ ਕੁੱਲ ਕਿੰਨੀ ਦੇਰ ਰੁਕਿਆ?`;
  }

  if (input.solveMode === "overallSpeedIncludingStops") {
    return hi
      ? `${s} चलते समय ${sp(input.runningSpeed)} की गति से ${km(input.distance)} की दूरी तय करता है, जबकि यात्रा के दौरान वह कुल ${dur(input.totalStopTime, language)} रुकता है। ठहराव सहित औसत गति ज्ञात कीजिए।`
      : `${s} ਚੱਲਣ ਸਮੇਂ ${sp(input.runningSpeed)} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ${km(input.distance)} ਦੀ ਦੂਰੀ ਤੈਅ ਕਰਦਾ ਹੈ, ਜਦਕਿ ਸਫ਼ਰ ਦੌਰਾਨ ਉਹ ਕੁੱਲ ${dur(input.totalStopTime, language)} ਰੁਕਦਾ ਹੈ। ਠਹਿਰਾਅ ਸਮੇਤ ਔਸਤ ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
  }

  if (input.solveMode === "runningSpeedFromOverallSpeedAndStops") {
    return hi
      ? `${s} ${km(input.distance)} की यात्रा में कुल ${dur(input.totalStopTime, language)} रुकता है। इन ठहरावों को शामिल करने के बाद उसकी औसत गति ${sp(input.overallSpeed)} है। चलते समय उसकी गति कितनी है?`
      : `${s} ${km(input.distance)} ਦੇ ਸਫ਼ਰ ਵਿੱਚ ਕੁੱਲ ${dur(input.totalStopTime, language)} ਰੁਕਦਾ ਹੈ। ਇਨ੍ਹਾਂ ਠਹਿਰਾਅਾਂ ਨੂੰ ਸ਼ਾਮਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਉਸਦੀ ਔਸਤ ਰਫ਼ਤਾਰ ${sp(input.overallSpeed)} ਹੈ। ਚੱਲਣ ਸਮੇਂ ਉਸਦੀ ਰਫ਼ਤਾਰ ਕਿੰਨੀ ਹੈ?`;
  }

  if (input.solveMode === "restTimeInRepeatedTravelRestCycle") return renderObjectNeutralStem(source, language, stem);

  if (input.solveMode === "totalTimeWithRegularStops" && /\bif\b/u.test(english)) {
    return hi
      ? `ठहरावों को छोड़कर यात्रा में ${dur(input.runningTime, language)} लगते हैं। यदि ${s} ${n(input.stopCount)} बार रुकता है और प्रत्येक ठहराव ${dur(input.stopDuration, language)} का है, तो रुकने सहित कुल यात्रा-समय कितना होगा?`
      : `ਠਹਿਰਾਅਾਂ ਨੂੰ ਛੱਡ ਕੇ ਸਫ਼ਰ ਵਿੱਚ ${dur(input.runningTime, language)} ਲੱਗਦੇ ਹਨ। ਜੇ ${s} ${n(input.stopCount)} ਵਾਰ ਰੁਕਦਾ ਹੈ ਅਤੇ ਹਰ ਠਹਿਰਾਅ ${dur(input.stopDuration, language)} ਦਾ ਹੈ, ਤਾਂ ਠਹਿਰਾਅ ਸਮੇਤ ਕੁੱਲ ਸਫ਼ਰ-ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
  }

  if (input.solveMode === "speedChangePointDistance") {
    return hi
      ? `${s ? `${s} ` : ""}${km(input.totalDistance)} की यात्रा ${dur(input.totalTravelTime, language)} में पूरी करता है। शुरुआत में गति ${sp(input.firstSpeed)} है और बाद में ${sp(input.secondSpeed)} हो जाती है। कितने km चलने के बाद गति बदलती है?`
      : `${s ? `${s} ` : ""}${km(input.totalDistance)} ਦਾ ਸਫ਼ਰ ${dur(input.totalTravelTime, language)} ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ। ਸ਼ੁਰੂ ਵਿੱਚ ਰਫ਼ਤਾਰ ${sp(input.firstSpeed)} ਹੈ ਅਤੇ ਬਾਅਦ ਵਿੱਚ ${sp(input.secondSpeed)} ਹੋ ਜਾਂਦੀ ਹੈ। ਕਿੰਨੇ km ਤੈਅ ਕਰਨ ਤੋਂ ਬਾਅਦ ਰਫ਼ਤਾਰ ਬਦਲਦੀ ਹੈ?`;
  }

  if (input.solveMode === "lostTimeDurationFromScheduleRecovery") {
    return hi
      ? `${contextBeforeLoss(source, language)} ${a} के पास ${km(input.remainingDistance)} की दूरी शेष है। वह सामान्यतः यह दूरी ${sp(input.usualSpeed)} से तय करता है, लेकिन अब ${sp(input.recoverySpeed)} से चलने पर भी ${dur(input.finalArrivalDelay, language)} देर से पहुँचता है। शुरू में कितना समय गंवाया गया था?`
      : `${contextBeforeLoss(source, language)} ${a} ਕੋਲ ${km(input.remainingDistance)} ਦੀ ਦੂਰੀ ਬਾਕੀ ਹੈ। ਉਹ ਆਮ ਤੌਰ ਉੱਤੇ ਇਹ ਦੂਰੀ ${sp(input.usualSpeed)} ਨਾਲ ਤੈਅ ਕਰਦਾ ਹੈ, ਪਰ ਹੁਣ ${sp(input.recoverySpeed)} ਨਾਲ ਚੱਲਣ ਦੇ ਬਾਵਜੂਦ ${dur(input.finalArrivalDelay, language)} ਦੇਰ ਨਾਲ ਪਹੁੰਚਦਾ ਹੈ। ਸ਼ੁਰੂ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਗੁਆਇਆ ਗਿਆ ਸੀ?`;
  }

  if (input.solveMode === "startTimeShiftForSameArrival") {
    const faster = compare(input.newSpeed, input.originalSpeed) > 0;
    const directionHi = faster ? "बाद" : "पहले";
    const directionPa = faster ? "ਬਾਅਦ" : "ਪਹਿਲਾਂ";
    return hi
      ? `${s} ${km(input.distance)} की यात्रा करता है। यदि उसकी गति ${sp(input.originalSpeed)} से बदलकर ${sp(input.newSpeed)} हो जाए लेकिन पहुँचने का समय वही रखना हो, तो उसे कितनी देर ${directionHi} चलना शुरू करना चाहिए?`
      : `${s} ${km(input.distance)} ਦਾ ਸਫ਼ਰ ਕਰਦਾ ਹੈ। ਜੇ ਉਸਦੀ ਰਫ਼ਤਾਰ ${sp(input.originalSpeed)} ਤੋਂ ਬਦਲ ਕੇ ${sp(input.newSpeed)} ਹੋ ਜਾਵੇ ਪਰ ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ ਉਹੀ ਰੱਖਣਾ ਹੋਵੇ, ਤਾਂ ਉਸਨੂੰ ਕਿੰਨੀ ਦੇਰ ${directionPa} ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?`;
  }

  if (input.solveMode === "arrivalShiftFromDepartureAndSpeedChanges") {
    if (s === null) return renderObjectNeutralStem(source, language, stem);
    const instead = /\binstead\b/u.test(english);
    return hi
      ? `${s} सामान्यतः ${km(input.distance)} की दूरी ${sp(input.originalSpeed)} से तय करता है। दूसरे दिन वह ${departureShiftText(input.departureShift, language)} चलना शुरू करता है और ${instead ? `${sp(input.originalSpeed)} के बजाय ` : ""}${sp(input.newSpeed)} से चलता है। आगमन-समय में परिवर्तन की मात्रा ज्ञात कीजिए।`
      : `${s} ਆਮ ਤੌਰ ਉੱਤੇ ${km(input.distance)} ਦੀ ਦੂਰੀ ${sp(input.originalSpeed)} ਨਾਲ ਤੈਅ ਕਰਦਾ ਹੈ। ਦੂਜੇ ਦਿਨ ਉਹ ${departureShiftText(input.departureShift, language)} ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ ਅਤੇ ${instead ? `${sp(input.originalSpeed)} ਦੀ ਥਾਂ ` : ""}${sp(input.newSpeed)} ਨਾਲ ਚੱਲਦਾ ਹੈ। ਪਹੁੰਚਣ ਦੇ ਸਮੇਂ ਵਿੱਚ ਬਦਲਾਅ ਦੀ ਮਾਤਰਾ ਕੱਢੋ।`;
  }

  return stem;
}

function finalizeRow(row: TsdCp003NativeAuthoritativeRow): TsdCp003FinalNativeReviewRow {
  const { source, presentation } = row;
  const objectAligned = alignStemObjectWithEnglish(source, presentation.stem, presentation.language);
  const semanticStem = renderSemanticSentenceParity(source, objectAligned, presentation.language);
  const sourceObject = cp003EnglishSourceObjectKey(source.stem);
  const stem = sourceObject === null ? semanticStem : applyObjectAgreement(semanticStem, sourceObject, presentation.language);
  assertTsdCp003NativeText(stem, presentation.language, `${source.questionLanguageId}/semantic-final-stem`);

  const finalPresentation: TsdCp003FinalNativePresentation = Object.freeze({
    ...presentation,
    stem,
    explanation: Object.freeze({
      method: presentation.explanation.method,
      steps: presentation.explanation.steps,
      examSpeedShortcut: presentation.explanation.examSpeedShortcut,
      answer: presentation.explanation.answer,
    }),
    lifecycle: Object.freeze({
      nativeEditorialStatus: TSD_CP003_NATIVE_FINAL_REVIEW_STATUS,
      multilingualFreezeStatus: "UNFROZEN" as const,
      questionStudioEnabled: false as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
    }),
  });

  return Object.freeze({
    source,
    presentation: finalPresentation,
    finalNativeReview: Object.freeze({
      status: TSD_CP003_NATIVE_FINAL_REVIEW_STATUS,
      solePublicNativeEntryPoint: true as const,
      explanationContract: "METHOD_STEPS_SHORTCUT_ANSWER" as const,
      optionAnalysisIncluded: false as const,
      sourceObjectParityEnforced: true as const,
      semanticSentenceParityEnforced: true as const,
      productOwnerApprovalRecorded: false as const,
      multilingualFreezeAuthorized: false as const,
      sourceMathChanged: false as const,
    }),
  });
}

export function generateCp003FinalNativeReviewCandidate(language: TsdCp003NativeLanguage): readonly TsdCp003FinalNativeReviewRow[] {
  return Object.freeze(generateCp003AuthoritativeNativeCandidate(language).map(finalizeRow));
}

export function generateCp003AllFinalNativeReviewCandidates(): readonly TsdCp003FinalNativeReviewRow[] {
  return Object.freeze([...generateCp003FinalNativeReviewCandidate("hi"), ...generateCp003FinalNativeReviewCandidate("pa")]);
}
