import {
  absRational,
  add,
  compare,
  divide,
  multiply,
  rational,
  subtract,
  toCanonicalString,
  type Rational,
} from "../../foundation/rational";
import { generateCp003EnglishFrozenRecords, type TsdCp003EnglishFrozenRecord } from "../english-frozen";
import { formatExamNumber, hashSeed } from "../generation-support";
import { stableCp003Stringify } from "../runtime";
import type { TsdCp003SolveInput } from "../types";
import {
  assertTsdCp003NativeText,
  formatNativeClock,
  formatNativeDuration,
  formatNativeSolvedValue,
  type TsdCp003NativeLanguage,
} from "./native-language-primitives";

export const TSD_CP003_NATIVE_EDITORIAL_STATUS = "DRAFT_NATIVE_EDITORIAL_REQUIRES_HUMAN_REVIEW" as const;

export type TsdCp003NativePresentation = Readonly<{
  language: TsdCp003NativeLanguage;
  locale: "hi-IN" | "pa-IN";
  permanentQlId: `TSD-QL-${string}`;
  authorityKey: string;
  authorityOwnerCheckpointId: "TSD-CP-001" | "TSD-CP-002" | "TSD-CP-003";
  contentCheckpointId: "TSD-CP-003";
  sourceQuestionLanguageId: string;
  questionLanguageId: string;
  solveMode: string;
  representation: string;
  seed: string;
  difficulty: TsdCp003EnglishFrozenRecord["difficulty"];
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answerText: string;
  explanation: Readonly<{
    method: string;
    steps: readonly string[];
    answer: string;
  }>;
  mathematicalFingerprint: string;
  parity: Readonly<{
    sourceLanguage: "en";
    answerKeyAuthority: "FROZEN_ENGLISH_RUNTIME";
    solverAuthority: "FROZEN_ENGLISH_RUNTIME";
    sourcePermanentQlId: `TSD-QL-${string}`;
    sourceSeed: string;
    sourceQuestionLanguageId: string;
    inputIdentity: string;
    solutionIdentity: string;
    optionValueFingerprints: readonly string[];
    optionOrderPreserved: true;
    answerValuePreserved: true;
    correctIndexPreserved: true;
    mathematicalFingerprintPreserved: true;
    localizedOptionTextOnly: true;
  }>;
  lifecycle: Readonly<{
    nativeEditorialStatus: typeof TSD_CP003_NATIVE_EDITORIAL_STATUS;
    multilingualFreezeStatus: "UNFROZEN";
    questionStudioEnabled: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;

export type TsdCp003MultilingualPreview = Readonly<{
  source: TsdCp003EnglishFrozenRecord;
  presentation: TsdCp003NativePresentation;
}>;

type Pair = Readonly<{ hi: string; pa: string }>;
const pair = (hi: string, pa: string): Pair => Object.freeze({ hi, pa });
const p = (language: TsdCp003NativeLanguage, value: Pair): string => value[language];
const n = (value: Rational): string => formatExamNumber(value);
const km = (value: Rational): string => `${n(value)} km`;
const sp = (value: Rational): string => `${n(value)} km/h`;
const dur = (value: Rational, language: TsdCp003NativeLanguage): string => formatNativeDuration(value, language);

const CONTEXTS: readonly Pair[] = Object.freeze([
  pair("एक बस", "ਇੱਕ ਬੱਸ"),
  pair("एक कार", "ਇੱਕ ਕਾਰ"),
  pair("एक टैक्सी", "ਇੱਕ ਟੈਕਸੀ"),
  pair("एक स्कूल बस", "ਇੱਕ ਸਕੂਲ ਬੱਸ"),
  pair("एक कोच", "ਇੱਕ ਕੋਚ"),
  pair("एक डिलीवरी वाहन", "ਇੱਕ ਡਿਲਿਵਰੀ ਵਾਹਨ"),
]);

function contextFor(source: TsdCp003EnglishFrozenRecord, language: TsdCp003NativeLanguage): string {
  return p(language, CONTEXTS[hashSeed(`${source.seed}:native-context`) % CONTEXTS.length]);
}

function departureShiftText(value: Rational, language: TsdCp003NativeLanguage): string {
  const amount = dur(absRational(value), language);
  if (value.numerator < 0n) return language === "hi" ? `${amount} पहले` : `${amount} ਪਹਿਲਾਂ`;
  return language === "hi" ? `${amount} बाद` : `${amount} ਬਾਅਦ`;
}

function targetText(
  target: Extract<TsdCp003SolveInput, { solveMode: "walkingRidingAllocation" }>["target"],
  language: TsdCp003NativeLanguage,
): string {
  const values = {
    WALKING_TIME: pair("पैदल चलने का समय", "ਪੈਦਲ ਚੱਲਣ ਦਾ ਸਮਾਂ"),
    RIDING_TIME: pair("सवारी में लगा समय", "ਸਵਾਰੀ ਵਿੱਚ ਲੱਗਿਆ ਸਮਾਂ"),
    WALKING_DISTANCE: pair("पैदल तय की गई दूरी", "ਪੈਦਲ ਤੈਅ ਕੀਤੀ ਦੂਰੀ"),
    RIDING_DISTANCE: pair("सवारी से तय की गई दूरी", "ਸਵਾਰੀ ਨਾਲ ਤੈਅ ਕੀਤੀ ਦੂਰੀ"),
  } as const;
  return p(language, values[target]);
}

function renderStem(source: TsdCp003EnglishFrozenRecord, language: TsdCp003NativeLanguage): string {
  const input = source.input;
  const c = contextFor(source, language);

  switch (input.solveMode) {
    case "timeGainLossFromSpeedChange": {
      const faster = compare(input.changedSpeed, input.originalSpeed) > 0;
      if (language === "hi") {
        return faster
          ? `${c} ${km(input.distance)} की दूरी तय करता है। गति ${sp(input.originalSpeed)} से बढ़कर ${sp(input.changedSpeed)} हो जाती है। यात्रा के समय में कितनी बचत होगी?`
          : `${c} ${km(input.distance)} की दूरी तय करता है। गति ${sp(input.originalSpeed)} से घटकर ${sp(input.changedSpeed)} हो जाती है। यात्रा में कितना अतिरिक्त समय लगेगा?`;
      }
      return faster
        ? `${c} ${km(input.distance)} ਦੀ ਦੂਰੀ ਤੈਅ ਕਰਦਾ ਹੈ। ਰਫ਼ਤਾਰ ${sp(input.originalSpeed)} ਤੋਂ ਵੱਧ ਕੇ ${sp(input.changedSpeed)} ਹੋ ਜਾਂਦੀ ਹੈ। ਸਫ਼ਰ ਦੇ ਸਮੇਂ ਵਿੱਚ ਕਿੰਨੀ ਬਚਤ ਹੋਵੇਗੀ?`
        : `${c} ${km(input.distance)} ਦੀ ਦੂਰੀ ਤੈਅ ਕਰਦਾ ਹੈ। ਰਫ਼ਤਾਰ ${sp(input.originalSpeed)} ਤੋਂ ਘਟ ਕੇ ${sp(input.changedSpeed)} ਹੋ ਜਾਂਦੀ ਹੈ। ਸਫ਼ਰ ਵਿੱਚ ਕਿੰਨਾ ਵਾਧੂ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    }
    case "distanceFromSpeedTimeDifference":
      return language === "hi"
        ? `एक ही मार्ग पर ${sp(input.slowerSpeed)} की गति से यात्रा करने में ${sp(input.fasterSpeed)} की तुलना में ${dur(input.timeDifference, language)} अधिक लगते हैं। मार्ग की दूरी ज्ञात कीजिए।`
        : `ਇੱਕੋ ਰਸਤੇ ਉੱਤੇ ${sp(input.slowerSpeed)} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਸਫ਼ਰ ਕਰਨ ਵਿੱਚ ${sp(input.fasterSpeed)} ਨਾਲੋਂ ${dur(input.timeDifference, language)} ਵੱਧ ਲੱਗਦੇ ਹਨ। ਰਸਤੇ ਦੀ ਦੂਰੀ ਕੱਢੋ।`;
    case "speedFromFixedRouteTimeDifference": {
      if (input.representation === "KNOWN_OTHER_SPEED") {
        const role = input.unknownRole === "FASTER"
          ? pair("अधिक गति", "ਵੱਧ ਰਫ਼ਤਾਰ")
          : pair("कम गति", "ਘੱਟ ਰਫ਼ਤਾਰ");
        return language === "hi"
          ? `${km(input.distance)} के एक निश्चित मार्ग पर एक गति ${sp(input.knownSpeed)} है। दूसरी ${p(language, role)} पर यात्रा-समय में ${dur(input.timeDifference, language)} का अंतर आता है। दूसरी गति ज्ञात कीजिए।`
          : `${km(input.distance)} ਦੇ ਨਿਰਧਾਰਤ ਰਸਤੇ ਉੱਤੇ ਇੱਕ ਰਫ਼ਤਾਰ ${sp(input.knownSpeed)} ਹੈ। ਦੂਜੀ ${p(language, role)} ਨਾਲ ਸਫ਼ਰ ਦੇ ਸਮੇਂ ਵਿੱਚ ${dur(input.timeDifference, language)} ਦਾ ਅੰਤਰ ਆਉਂਦਾ ਹੈ। ਦੂਜੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
      }
      const requested = input.target === "SLOWER"
        ? pair("कम", "ਘੱਟ")
        : pair("अधिक", "ਵੱਧ");
      return language === "hi"
        ? `${km(input.distance)} के समान मार्ग पर दो गतियों का अनुपात ${n(input.slowerRatio)}:${n(input.fasterRatio)} है और यात्रा-समय का अंतर ${dur(input.timeDifference, language)} है। ${p(language, requested)} गति ज्ञात कीजिए।`
        : `${km(input.distance)} ਦੇ ਇੱਕੋ ਰਸਤੇ ਉੱਤੇ ਦੋ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ${n(input.slowerRatio)}:${n(input.fasterRatio)} ਹੈ ਅਤੇ ਸਫ਼ਰ ਦੇ ਸਮੇਂ ਦਾ ਅੰਤਰ ${dur(input.timeDifference, language)} ਹੈ। ${p(language, requested)} ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
    }
    case "usualSpeedFromEarlyLatePair":
      return language === "hi"
        ? `${c} ${sp(input.slowerTrialSpeed)} पर ${dur(input.lateBy, language)} देर से और ${sp(input.fasterTrialSpeed)} पर ${dur(input.earlyBy, language)} पहले पहुँचता है। ठीक समय पर पहुँचने की सामान्य गति ज्ञात कीजिए।`
        : `${c} ${sp(input.slowerTrialSpeed)} ਉੱਤੇ ${dur(input.lateBy, language)} ਦੇਰ ਨਾਲ ਅਤੇ ${sp(input.fasterTrialSpeed)} ਉੱਤੇ ${dur(input.earlyBy, language)} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ। ਬਿਲਕੁਲ ਸਮੇਂ ਉੱਤੇ ਪਹੁੰਚਣ ਲਈ ਆਮ ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
    case "distanceFromEarlyLatePair":
      return language === "hi"
        ? `${c} ${sp(input.slowerTrialSpeed)} पर ${dur(input.lateBy, language)} देर से और ${sp(input.fasterTrialSpeed)} पर ${dur(input.earlyBy, language)} पहले पहुँचता है। निश्चित मार्ग की दूरी ज्ञात कीजिए।`
        : `${c} ${sp(input.slowerTrialSpeed)} ਉੱਤੇ ${dur(input.lateBy, language)} ਦੇਰ ਨਾਲ ਅਤੇ ${sp(input.fasterTrialSpeed)} ਉੱਤੇ ${dur(input.earlyBy, language)} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ। ਨਿਰਧਾਰਤ ਰਸਤੇ ਦੀ ਦੂਰੀ ਕੱਢੋ।`;
    case "scheduledArrivalTimeFromActualSpeed":
      return language === "hi"
        ? `${c} ${formatNativeClock(input.departureMinuteFromDayZero, language)} पर चलना शुरू करता है और ${km(input.distance)} की दूरी ${sp(input.actualSpeed)} से तय करता है। वह किस समय पहुँचेगा?`
        : `${c} ${formatNativeClock(input.departureMinuteFromDayZero, language)} ਉੱਤੇ ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ ਅਤੇ ${km(input.distance)} ਦੀ ਦੂਰੀ ${sp(input.actualSpeed)} ਨਾਲ ਤੈਅ ਕਰਦਾ ਹੈ। ਉਹ ਕਿਹੜੇ ਸਮੇਂ ਪਹੁੰਚੇਗਾ?`;
    case "requiredRecoverySpeedAfterLostTime":
      return language === "hi"
        ? `समय गंवाने के बाद ${c} को ${km(input.remainingDistance)} की शेष दूरी ${dur(input.remainingAvailableTime, language)} में पूरी करनी है। निर्धारित समय पर पहुँचने के लिए आवश्यक गति क्या होगी?`
        : `ਸਮਾਂ ਗੁਆਉਣ ਤੋਂ ਬਾਅਦ ${c} ਨੂੰ ${km(input.remainingDistance)} ਦੀ ਬਾਕੀ ਦੂਰੀ ${dur(input.remainingAvailableTime, language)} ਵਿੱਚ ਪੂਰੀ ਕਰਨੀ ਹੈ। ਨਿਰਧਾਰਤ ਸਮੇਂ ਉੱਤੇ ਪਹੁੰਚਣ ਲਈ ਲੋੜੀਂਦੀ ਰਫ਼ਤਾਰ ਕੀ ਹੋਵੇਗੀ?`;
    case "requiredRemainingSpeedAfterPartialRoute":
      return language === "hi"
        ? `${c} को ${km(input.totalDistance)} की यात्रा ${dur(input.scheduledTotalTime, language)} में पूरी करनी है। पहले ${km(input.completedDistance)} वह ${sp(input.completedSpeed)} से तय करता है। शेष दूरी के लिए आवश्यक गति ज्ञात कीजिए।`
        : `${c} ਨੂੰ ${km(input.totalDistance)} ਦਾ ਸਫ਼ਰ ${dur(input.scheduledTotalTime, language)} ਵਿੱਚ ਪੂਰਾ ਕਰਨਾ ਹੈ। ਪਹਿਲੇ ${km(input.completedDistance)} ਉਹ ${sp(input.completedSpeed)} ਨਾਲ ਤੈਅ ਕਰਦਾ ਹੈ। ਬਾਕੀ ਦੂਰੀ ਲਈ ਲੋੜੀਂਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
    case "stoppageDurationFromRunningAndOverallSpeed":
      return language === "hi"
        ? `${c} ${km(input.distance)} तय करता है। चलते समय उसकी गति ${sp(input.runningSpeed)} है, जबकि ठहराव सहित औसत गति ${sp(input.overallSpeed)} है। कुल ठहराव का समय ज्ञात कीजिए।`
        : `${c} ${km(input.distance)} ਤੈਅ ਕਰਦਾ ਹੈ। ਚੱਲਣ ਸਮੇਂ ਉਸਦੀ ਰਫ਼ਤਾਰ ${sp(input.runningSpeed)} ਹੈ, ਜਦਕਿ ਠਹਿਰਾਅ ਸਮੇਤ ਔਸਤ ਰਫ਼ਤਾਰ ${sp(input.overallSpeed)} ਹੈ। ਕੁੱਲ ਠਹਿਰਾਅ ਦਾ ਸਮਾਂ ਕੱਢੋ।`;
    case "overallSpeedIncludingStops":
      return language === "hi"
        ? `${c} ${km(input.distance)} की दूरी चलते समय ${sp(input.runningSpeed)} से तय करता है और कुल ${dur(input.totalStopTime, language)} रुकता है। ठहराव सहित औसत गति ज्ञात कीजिए।`
        : `${c} ${km(input.distance)} ਦੀ ਦੂਰੀ ਚੱਲਣ ਸਮੇਂ ${sp(input.runningSpeed)} ਨਾਲ ਤੈਅ ਕਰਦਾ ਹੈ ਅਤੇ ਕੁੱਲ ${dur(input.totalStopTime, language)} ਰੁਕਦਾ ਹੈ। ਠਹਿਰਾਅ ਸਮੇਤ ਔਸਤ ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
    case "runningSpeedFromOverallSpeedAndStops":
      return language === "hi"
        ? `${c} ${km(input.distance)} की दूरी ${sp(input.overallSpeed)} की ठहराव सहित औसत गति से तय करता है और कुल ${dur(input.totalStopTime, language)} रुकता है। चलते समय की गति ज्ञात कीजिए।`
        : `${c} ${km(input.distance)} ਦੀ ਦੂਰੀ ${sp(input.overallSpeed)} ਦੀ ਠਹਿਰਾਅ ਸਮੇਤ ਔਸਤ ਰਫ਼ਤਾਰ ਨਾਲ ਤੈਅ ਕਰਦਾ ਹੈ ਅਤੇ ਕੁੱਲ ${dur(input.totalStopTime, language)} ਰੁਕਦਾ ਹੈ। ਚੱਲਣ ਸਮੇਂ ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
    case "numberOfStopsFromOverallDelay":
      return language === "hi"
        ? `${c} को केवल समान ठहरावों के कारण कुल ${dur(input.totalDelay, language)} की देरी होती है। प्रत्येक ठहराव ${dur(input.stopDuration, language)} का है। ठहरावों की संख्या ज्ञात कीजिए।`
        : `${c} ਨੂੰ ਸਿਰਫ਼ ਬਰਾਬਰ ਠਹਿਰਾਅਾਂ ਕਾਰਨ ਕੁੱਲ ${dur(input.totalDelay, language)} ਦੀ ਦੇਰੀ ਹੁੰਦੀ ਹੈ। ਹਰ ਠਹਿਰਾਅ ${dur(input.stopDuration, language)} ਦਾ ਹੈ। ਠਹਿਰਾਅਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`;
    case "delayFromRegularStops":
      return language === "hi"
        ? `${c} ${n(input.stopCount)} बार रुकता है और प्रत्येक ठहराव ${dur(input.stopDuration, language)} का है। इन ठहरावों से होने वाली कुल देरी ज्ञात कीजिए।`
        : `${c} ${n(input.stopCount)} ਵਾਰ ਰੁਕਦਾ ਹੈ ਅਤੇ ਹਰ ਠਹਿਰਾਅ ${dur(input.stopDuration, language)} ਦਾ ਹੈ। ਇਨ੍ਹਾਂ ਠਹਿਰਾਅਾਂ ਕਾਰਨ ਹੋਣ ਵਾਲੀ ਕੁੱਲ ਦੇਰੀ ਕੱਢੋ।`;
    case "restTimeInRepeatedTravelRestCycle":
      return language === "hi"
        ? `एक यात्री ${n(input.cycleCount)} समान यात्रा-खंड पूरे करता है, प्रत्येक में ${dur(input.travelTimePerCycle, language)} लगता है। इनके बीच ${n(input.restEvents)} समान विश्राम हैं और कुल समय ${dur(input.totalElapsedTime, language)} है। एक विश्राम की अवधि ज्ञात कीजिए।`
        : `ਇੱਕ ਯਾਤਰੀ ${n(input.cycleCount)} ਬਰਾਬਰ ਸਫ਼ਰ-ਭਾਗ ਪੂਰੇ ਕਰਦਾ ਹੈ, ਹਰ ਭਾਗ ਵਿੱਚ ${dur(input.travelTimePerCycle, language)} ਲੱਗਦਾ ਹੈ। ਇਨ੍ਹਾਂ ਵਿਚਕਾਰ ${n(input.restEvents)} ਬਰਾਬਰ ਆਰਾਮ ਹਨ ਅਤੇ ਕੁੱਲ ਸਮਾਂ ${dur(input.totalElapsedTime, language)} ਹੈ। ਇੱਕ ਆਰਾਮ ਦੀ ਮਿਆਦ ਕੱਢੋ।`;
    case "totalTimeWithRegularStops":
      return language === "hi"
        ? `${c} का वास्तविक चलने का समय ${dur(input.runningTime, language)} है। वह ${n(input.stopCount)} बार रुकता है और हर ठहराव ${dur(input.stopDuration, language)} का है। कुल यात्रा-समय ज्ञात कीजिए।`
        : `${c} ਦਾ ਅਸਲ ਚੱਲਣ ਦਾ ਸਮਾਂ ${dur(input.runningTime, language)} ਹੈ। ਉਹ ${n(input.stopCount)} ਵਾਰ ਰੁਕਦਾ ਹੈ ਅਤੇ ਹਰ ਠਹਿਰਾਅ ${dur(input.stopDuration, language)} ਦਾ ਹੈ। ਕੁੱਲ ਸਫ਼ਰ-ਸਮਾਂ ਕੱਢੋ।`;
    case "speedChangePointDistance":
      return language === "hi"
        ? `${c} ${km(input.totalDistance)} की दूरी ${dur(input.totalTravelTime, language)} में तय करता है। पहले गति ${sp(input.firstSpeed)} है और बाद में ${sp(input.secondSpeed)} हो जाती है। कितने km के बाद गति बदलती है?`
        : `${c} ${km(input.totalDistance)} ਦੀ ਦੂਰੀ ${dur(input.totalTravelTime, language)} ਵਿੱਚ ਤੈਅ ਕਰਦਾ ਹੈ। ਪਹਿਲਾਂ ਰਫ਼ਤਾਰ ${sp(input.firstSpeed)} ਹੈ ਅਤੇ ਬਾਅਦ ਵਿੱਚ ${sp(input.secondSpeed)} ਹੋ ਜਾਂਦੀ ਹੈ। ਕਿੰਨੇ km ਤੋਂ ਬਾਅਦ ਰਫ਼ਤਾਰ ਬਦਲਦੀ ਹੈ?`;
    case "fractionOfRouteAtChangedSpeed":
      return language === "hi"
        ? `${c} ${km(input.totalDistance)} की दूरी ${dur(input.totalTravelTime, language)} में तय करता है। मार्ग का कुछ भाग ${sp(input.originalSpeed)} और शेष ${sp(input.changedSpeed)} से तय किया जाता है। बदली हुई गति पर कितने प्रतिशत मार्ग की यात्रा हुई?`
        : `${c} ${km(input.totalDistance)} ਦੀ ਦੂਰੀ ${dur(input.totalTravelTime, language)} ਵਿੱਚ ਤੈਅ ਕਰਦਾ ਹੈ। ਰਸਤੇ ਦਾ ਕੁਝ ਭਾਗ ${sp(input.originalSpeed)} ਅਤੇ ਬਾਕੀ ${sp(input.changedSpeed)} ਨਾਲ ਤੈਅ ਹੁੰਦਾ ਹੈ। ਬਦਲੀ ਰਫ਼ਤਾਰ ਉੱਤੇ ਰਸਤੇ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਤੈਅ ਹੋਇਆ?`;
    case "lostTimeDurationFromScheduleRecovery":
      return language === "hi"
        ? `समय गंवाने के बाद ${c} के पास ${km(input.remainingDistance)} की दूरी शेष है। सामान्य गति ${sp(input.usualSpeed)} के बजाय वह ${sp(input.recoverySpeed)} से चलता है, फिर भी ${dur(input.finalArrivalDelay, language)} देर से पहुँचता है। शुरू में कितना समय गंवाया गया था?`
        : `ਸਮਾਂ ਗੁਆਉਣ ਤੋਂ ਬਾਅਦ ${c} ਕੋਲ ${km(input.remainingDistance)} ਦੀ ਦੂਰੀ ਬਾਕੀ ਹੈ। ਆਮ ਰਫ਼ਤਾਰ ${sp(input.usualSpeed)} ਦੀ ਥਾਂ ਉਹ ${sp(input.recoverySpeed)} ਨਾਲ ਚੱਲਦਾ ਹੈ, ਫਿਰ ਵੀ ${dur(input.finalArrivalDelay, language)} ਦੇਰ ਨਾਲ ਪਹੁੰਚਦਾ ਹੈ। ਸ਼ੁਰੂ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਗੁਆਇਆ ਗਿਆ ਸੀ?`;
    case "startTimeShiftForSameArrival": {
      const faster = compare(input.newSpeed, input.originalSpeed) > 0;
      const direction = faster ? pair("बाद", "ਬਾਅਦ") : pair("पहले", "ਪਹਿਲਾਂ");
      return language === "hi"
        ? `${km(input.distance)} के मार्ग पर गति ${sp(input.originalSpeed)} से बदलकर ${sp(input.newSpeed)} हो जाती है। पहुँचने का समय वही रखना हो तो ${c} को कितने समय ${p(language, direction)} चलना शुरू करना चाहिए?`
        : `${km(input.distance)} ਦੇ ਰਸਤੇ ਉੱਤੇ ਰਫ਼ਤਾਰ ${sp(input.originalSpeed)} ਤੋਂ ਬਦਲ ਕੇ ${sp(input.newSpeed)} ਹੋ ਜਾਂਦੀ ਹੈ। ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ ਉਹੀ ਰੱਖਣਾ ਹੋਵੇ ਤਾਂ ${c} ਨੂੰ ਕਿੰਨਾ ਸਮਾਂ ${p(language, direction)} ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?`;
    }
    case "arrivalShiftFromDepartureAndSpeedChanges":
      return language === "hi"
        ? `${c} सामान्यतः ${km(input.distance)} की दूरी ${sp(input.originalSpeed)} से तय करता है। दूसरे दिन वह ${departureShiftText(input.departureShift, language)} चलना शुरू करता है और गति ${sp(input.newSpeed)} रहती है। पहुँचने के समय में कुल कितना परिवर्तन होगा?`
        : `${c} ਆਮ ਤੌਰ ਉੱਤੇ ${km(input.distance)} ਦੀ ਦੂਰੀ ${sp(input.originalSpeed)} ਨਾਲ ਤੈਅ ਕਰਦਾ ਹੈ। ਦੂਜੇ ਦਿਨ ਉਹ ${departureShiftText(input.departureShift, language)} ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ ਅਤੇ ਰਫ਼ਤਾਰ ${sp(input.newSpeed)} ਹੁੰਦੀ ਹੈ। ਪਹੁੰਚਣ ਦੇ ਸਮੇਂ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨਾ ਬਦਲਾਅ ਹੋਵੇਗਾ?`;
    case "walkingRidingAllocation":
      return language === "hi"
        ? `एक व्यक्ति ${km(input.totalDistance)} की दूरी ${dur(input.totalTime, language)} में तय करता है। उसकी पैदल गति ${sp(input.walkingSpeed)} और सवारी की गति ${sp(input.ridingSpeed)} है। ${targetText(input.target, language)} ज्ञात कीजिए।`
        : `ਇੱਕ ਵਿਅਕਤੀ ${km(input.totalDistance)} ਦੀ ਦੂਰੀ ${dur(input.totalTime, language)} ਵਿੱਚ ਤੈਅ ਕਰਦਾ ਹੈ। ਉਸਦੀ ਪੈਦਲ ਰਫ਼ਤਾਰ ${sp(input.walkingSpeed)} ਅਤੇ ਸਵਾਰੀ ਦੀ ਰਫ਼ਤਾਰ ${sp(input.ridingSpeed)} ਹੈ। ${targetText(input.target, language)} ਕੱਢੋ।`;
    case "scheduleBuffer":
      throw new Error("scheduleBuffer is rejected from the CP-003 accepted learner corpus and cannot be localized");
  }
}

function calcLabel(language: TsdCp003NativeLanguage): string {
  return language === "hi" ? "गणना" : "ਗਣਨਾ";
}
function therefore(language: TsdCp003NativeLanguage): string {
  return language === "hi" ? "अतः" : "ਇਸ ਲਈ";
}
function method(language: TsdCp003NativeLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function renderExplanation(source: TsdCp003EnglishFrozenRecord, language: TsdCp003NativeLanguage): TsdCp003NativePresentation["explanation"] {
  const input = source.input;
  const sol = source.solution;
  const final = formatNativeSolvedValue(sol.answer, sol.unit, language);
  const C = calcLabel(language);
  const T = therefore(language);
  let m: string;
  let steps: string[];

  switch (input.solveMode) {
    case "timeGainLossFromSpeedChange": {
      const oldTime = divide(input.distance, input.originalSpeed);
      const newTime = divide(input.distance, input.changedSpeed);
      m = method(language, "एक ही दूरी के लिए दोनों यात्रा-समय निकालकर उनका अंतर लें।", "ਇੱਕੋ ਦੂਰੀ ਲਈ ਦੋਵੇਂ ਸਫ਼ਰ-ਸਮੇਂ ਕੱਢ ਕੇ ਉਨ੍ਹਾਂ ਦਾ ਅੰਤਰ ਲਵੋ।");
      steps = [
        `${C}: ${n(input.distance)} ÷ ${n(input.originalSpeed)} = ${dur(oldTime, language)}।`,
        `${C}: ${n(input.distance)} ÷ ${n(input.changedSpeed)} = ${dur(newTime, language)}।`,
        `${T} समय का अंतर = ${dur(absRational(subtract(oldTime, newTime)), language)}।`.replace("समय का अंतर", language === "hi" ? "समय का अंतर" : "ਸਮੇਂ ਦਾ ਅੰਤਰ"),
      ];
      break;
    }
    case "distanceFromSpeedTimeDifference":
      m = method(language, "समान दूरी पर समय-अंतर = दूरी × दोनों गतियों के व्युत्क्रमों का अंतर।", "ਇੱਕੋ ਦੂਰੀ ਉੱਤੇ ਸਮੇਂ ਦਾ ਅੰਤਰ = ਦੂਰੀ × ਦੋਵੇਂ ਰਫ਼ਤਾਰਾਂ ਦੇ ਉਲਟਾਂ ਦਾ ਅੰਤਰ।");
      steps = [
        `${C}: 1/${n(input.slowerSpeed)} − 1/${n(input.fasterSpeed)} ${language === "hi" ? "प्रति km समय-अंतर देता है" : "ਹਰ km ਲਈ ਸਮੇਂ ਦਾ ਅੰਤਰ ਦਿੰਦਾ ਹੈ"}।`,
        `${C}: ${dur(input.timeDifference, language)} ÷ (1/${n(input.slowerSpeed)} − 1/${n(input.fasterSpeed)}) = ${final}।`,
      ];
      break;
    case "speedFromFixedRouteTimeDifference": {
      if (input.representation === "KNOWN_OTHER_SPEED") {
        const knownTime = divide(input.distance, input.knownSpeed);
        const unknownTime = input.unknownRole === "FASTER" ? subtract(knownTime, input.timeDifference) : add(knownTime, input.timeDifference);
        m = method(language, "पहले दी हुई गति से यात्रा-समय निकालें, फिर समय-अंतर के अनुसार दूसरी यात्रा का समय बनाएँ।", "ਪਹਿਲਾਂ ਦਿੱਤੀ ਰਫ਼ਤਾਰ ਨਾਲ ਸਫ਼ਰ-ਸਮਾਂ ਕੱਢੋ, ਫਿਰ ਸਮੇਂ ਦੇ ਅੰਤਰ ਅਨੁਸਾਰ ਦੂਜੇ ਸਫ਼ਰ ਦਾ ਸਮਾਂ ਬਣਾਓ।");
        steps = [
          `${C}: ${n(input.distance)} ÷ ${n(input.knownSpeed)} = ${dur(knownTime, language)}।`,
          `${C}: ${language === "hi" ? "दूसरी यात्रा का समय" : "ਦੂਜੇ ਸਫ਼ਰ ਦਾ ਸਮਾਂ"} = ${dur(unknownTime, language)}।`,
          `${T} ${language === "hi" ? "दूसरी गति" : "ਦੂਜੀ ਰਫ਼ਤਾਰ"} = ${n(input.distance)} ÷ ${n(unknownTime)} = ${final}।`,
        ];
      } else {
        const scale = sol.intermediate.scale!;
        m = method(language, "दोनों गतियों को दिए अनुपात के समान गुणक से लिखें और समय-अंतर से वह गुणक निकालें।", "ਦੋਵੇਂ ਰਫ਼ਤਾਰਾਂ ਨੂੰ ਦਿੱਤੇ ਅਨੁਪਾਤ ਦੇ ਇੱਕੋ ਗੁਣਕ ਨਾਲ ਲਿਖੋ ਅਤੇ ਸਮੇਂ ਦੇ ਅੰਤਰ ਤੋਂ ਉਹ ਗੁਣਕ ਕੱਢੋ।");
        steps = [
          `${C}: ${language === "hi" ? "गतियाँ" : "ਰਫ਼ਤਾਰਾਂ"} = ${n(input.slowerRatio)}k और ${n(input.fasterRatio)}k।`.replace("और", language === "hi" ? "और" : "ਅਤੇ"),
          `${C}: ${language === "hi" ? "समय-अंतर की शर्त से" : "ਸਮੇਂ ਦੇ ਅੰਤਰ ਦੀ ਸ਼ਰਤ ਤੋਂ"} k = ${n(scale)}।`,
          `${T} ${language === "hi" ? "मांगी गई गति" : "ਮੰਗੀ ਗਈ ਰਫ਼ਤਾਰ"} = ${final}।`,
        ];
      }
      break;
    }
    case "usualSpeedFromEarlyLatePair": {
      const distance = sol.intermediate.distance!;
      const scheduled = sol.intermediate.scheduledTravelTime!;
      m = method(language, "देर और पहले पहुँचने के समय को जोड़कर पहले मार्ग की दूरी, फिर निर्धारित यात्रा-समय निकालें।", "ਦੇਰ ਅਤੇ ਪਹਿਲਾਂ ਪਹੁੰਚਣ ਦੇ ਸਮੇਂ ਜੋੜ ਕੇ ਪਹਿਲਾਂ ਰਸਤੇ ਦੀ ਦੂਰੀ, ਫਿਰ ਨਿਰਧਾਰਤ ਸਫ਼ਰ-ਸਮਾਂ ਕੱਢੋ।");
      steps = [
        `${C}: ${dur(input.lateBy, language)} + ${dur(input.earlyBy, language)} = ${dur(add(input.lateBy, input.earlyBy), language)}।`,
        `${C}: ${language === "hi" ? "मार्ग की दूरी" : "ਰਸਤੇ ਦੀ ਦੂਰੀ"} = ${km(distance)}, ${language === "hi" ? "निर्धारित यात्रा-समय" : "ਨਿਰਧਾਰਤ ਸਫ਼ਰ-ਸਮਾਂ"} = ${dur(scheduled, language)}।`,
        `${T} ${language === "hi" ? "सामान्य गति" : "ਆਮ ਰਫ਼ਤਾਰ"} = ${n(distance)} ÷ ${n(scheduled)} = ${final}।`,
      ];
      break;
    }
    case "distanceFromEarlyLatePair":
      m = method(language, "देर और पहले पहुँचने का योग दोनों यात्रा-समयों का पूरा अंतर है।", "ਦੇਰ ਅਤੇ ਪਹਿਲਾਂ ਪਹੁੰਚਣ ਦਾ ਜੋੜ ਦੋਵੇਂ ਸਫ਼ਰ-ਸਮਿਆਂ ਦਾ ਪੂਰਾ ਅੰਤਰ ਹੈ।");
      steps = [
        `${C}: ${dur(input.lateBy, language)} + ${dur(input.earlyBy, language)} = ${dur(add(input.lateBy, input.earlyBy), language)}।`,
        `${C}: ${dur(add(input.lateBy, input.earlyBy), language)} ÷ (1/${n(input.slowerTrialSpeed)} − 1/${n(input.fasterTrialSpeed)}) = ${final}।`,
      ];
      break;
    case "scheduledArrivalTimeFromActualSpeed": {
      const travel = divide(input.distance, input.actualSpeed);
      m = method(language, "दूरी ÷ गति से यात्रा-समय निकालकर उसे प्रस्थान समय में जोड़ें।", "ਦੂਰੀ ÷ ਰਫ਼ਤਾਰ ਨਾਲ ਸਫ਼ਰ-ਸਮਾਂ ਕੱਢ ਕੇ ਉਸਨੂੰ ਰਵਾਨਗੀ ਦੇ ਸਮੇਂ ਵਿੱਚ ਜੋੜੋ।");
      steps = [
        `${C}: ${n(input.distance)} ÷ ${n(input.actualSpeed)} = ${dur(travel, language)}।`,
        `${C}: ${formatNativeClock(input.departureMinuteFromDayZero, language)} + ${dur(travel, language)} = ${final}।`,
      ];
      break;
    }
    case "requiredRecoverySpeedAfterLostTime":
      m = method(language, "अब केवल शेष दूरी और उपलब्ध शेष समय का उपयोग करें।", "ਹੁਣ ਸਿਰਫ਼ ਬਾਕੀ ਦੂਰੀ ਅਤੇ ਉਪਲਬਧ ਬਾਕੀ ਸਮੇਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।");
      steps = [`${C}: ${n(input.remainingDistance)} ÷ ${n(input.remainingAvailableTime)} = ${final}।`];
      break;
    case "requiredRemainingSpeedAfterPartialRoute": {
      const used = divide(input.completedDistance, input.completedSpeed);
      const remainingTime = subtract(input.scheduledTotalTime, used);
      const remainingDistance = subtract(input.totalDistance, input.completedDistance);
      m = method(language, "पहले खर्च हुआ समय और तय हुई दूरी घटाकर शेष दूरी ÷ शेष समय करें।", "ਪਹਿਲਾਂ ਲੱਗਿਆ ਸਮਾਂ ਅਤੇ ਤੈਅ ਦੂਰੀ ਘਟਾ ਕੇ ਬਾਕੀ ਦੂਰੀ ÷ ਬਾਕੀ ਸਮਾਂ ਕਰੋ।");
      steps = [
        `${C}: ${n(input.completedDistance)} ÷ ${n(input.completedSpeed)} = ${dur(used, language)}।`,
        `${C}: ${language === "hi" ? "शेष समय" : "ਬਾਕੀ ਸਮਾਂ"} = ${dur(remainingTime, language)}, ${language === "hi" ? "शेष दूरी" : "ਬਾਕੀ ਦੂਰੀ"} = ${km(remainingDistance)}।`,
        `${T} ${n(remainingDistance)} ÷ ${n(remainingTime)} = ${final}।`,
      ];
      break;
    }
    case "stoppageDurationFromRunningAndOverallSpeed": {
      const running = divide(input.distance, input.runningSpeed);
      const overall = divide(input.distance, input.overallSpeed);
      m = method(language, "समान दूरी के लिए कुल समय में से वास्तविक चलने का समय घटाएँ।", "ਇੱਕੋ ਦੂਰੀ ਲਈ ਕੁੱਲ ਸਮੇਂ ਵਿੱਚੋਂ ਅਸਲ ਚੱਲਣ ਦਾ ਸਮਾਂ ਘਟਾਓ।");
      steps = [
        `${C}: ${language === "hi" ? "चलने का समय" : "ਚੱਲਣ ਦਾ ਸਮਾਂ"} = ${dur(running, language)}।`,
        `${C}: ${language === "hi" ? "कुल समय" : "ਕੁੱਲ ਸਮਾਂ"} = ${dur(overall, language)}।`,
        `${T} ${dur(overall, language)} − ${dur(running, language)} = ${final}।`,
      ];
      break;
    }
    case "overallSpeedIncludingStops": {
      const running = divide(input.distance, input.runningSpeed);
      const total = add(running, input.totalStopTime);
      m = method(language, "ठहराव को चलने के समय में जोड़कर कुल दूरी को कुल समय से भाग दें।", "ਠਹਿਰਾਅ ਨੂੰ ਚੱਲਣ ਦੇ ਸਮੇਂ ਵਿੱਚ ਜੋੜ ਕੇ ਕੁੱਲ ਦੂਰੀ ਨੂੰ ਕੁੱਲ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦਿਓ।");
      steps = [
        `${C}: ${n(input.distance)} ÷ ${n(input.runningSpeed)} = ${dur(running, language)}।`,
        `${C}: ${dur(running, language)} + ${dur(input.totalStopTime, language)} = ${dur(total, language)}।`,
        `${T} ${n(input.distance)} ÷ ${n(total)} = ${final}।`,
      ];
      break;
    }
    case "runningSpeedFromOverallSpeedAndStops": {
      const total = divide(input.distance, input.overallSpeed);
      const running = subtract(total, input.totalStopTime);
      m = method(language, "ठहराव सहित कुल समय से ठहराव घटाकर वास्तविक चलने का समय निकालें।", "ਠਹਿਰਾਅ ਸਮੇਤ ਕੁੱਲ ਸਮੇਂ ਵਿੱਚੋਂ ਠਹਿਰਾਅ ਘਟਾ ਕੇ ਅਸਲ ਚੱਲਣ ਦਾ ਸਮਾਂ ਕੱਢੋ।");
      steps = [
        `${C}: ${n(input.distance)} ÷ ${n(input.overallSpeed)} = ${dur(total, language)}।`,
        `${C}: ${dur(total, language)} − ${dur(input.totalStopTime, language)} = ${dur(running, language)}।`,
        `${T} ${n(input.distance)} ÷ ${n(running)} = ${final}।`,
      ];
      break;
    }
    case "numberOfStopsFromOverallDelay":
      m = method(language, "कुल ठहराव-देरी को एक ठहराव की अवधि से भाग दें।", "ਕੁੱਲ ਠਹਿਰਾਅ-ਦੇਰੀ ਨੂੰ ਇੱਕ ਠਹਿਰਾਅ ਦੀ ਮਿਆਦ ਨਾਲ ਭਾਗ ਦਿਓ।");
      steps = [`${C}: ${dur(input.totalDelay, language)} ÷ ${dur(input.stopDuration, language)} = ${final}।`];
      break;
    case "delayFromRegularStops":
      m = method(language, "ठहरावों की संख्या को एक ठहराव की अवधि से गुणा करें।", "ਠਹਿਰਾਅਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਇੱਕ ਠਹਿਰਾਅ ਦੀ ਮਿਆਦ ਨਾਲ ਗੁਣਾ ਕਰੋ।");
      steps = [`${C}: ${n(input.stopCount)} × ${dur(input.stopDuration, language)} = ${final}।`];
      break;
    case "restTimeInRepeatedTravelRestCycle": {
      const travel = multiply(input.travelTimePerCycle, input.cycleCount);
      const rests = subtract(input.totalElapsedTime, travel);
      m = method(language, "कुल समय से सभी यात्रा-खंडों का समय घटाकर बचे समय को विश्रामों की संख्या से बाँटें।", "ਕੁੱਲ ਸਮੇਂ ਵਿੱਚੋਂ ਸਾਰੇ ਸਫ਼ਰ-ਭਾਗਾਂ ਦਾ ਸਮਾਂ ਘਟਾ ਕੇ ਬਚੇ ਸਮੇਂ ਨੂੰ ਆਰਾਮਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਵੰਡੋ।");
      steps = [
        `${C}: ${n(input.cycleCount)} × ${dur(input.travelTimePerCycle, language)} = ${dur(travel, language)}।`,
        `${C}: ${dur(input.totalElapsedTime, language)} − ${dur(travel, language)} = ${dur(rests, language)}।`,
        `${T} ${dur(rests, language)} ÷ ${n(input.restEvents)} = ${final}।`,
      ];
      break;
    }
    case "totalTimeWithRegularStops": {
      const stop = multiply(input.stopCount, input.stopDuration);
      m = method(language, "सभी ठहरावों का समय जोड़कर उसे वास्तविक चलने के समय में मिलाएँ।", "ਸਾਰੇ ਠਹਿਰਾਅਾਂ ਦਾ ਸਮਾਂ ਜੋੜ ਕੇ ਉਸਨੂੰ ਅਸਲ ਚੱਲਣ ਦੇ ਸਮੇਂ ਵਿੱਚ ਮਿਲਾਓ।");
      steps = [
        `${C}: ${n(input.stopCount)} × ${dur(input.stopDuration, language)} = ${dur(stop, language)}।`,
        `${C}: ${dur(input.runningTime, language)} + ${dur(stop, language)} = ${final}।`,
      ];
      break;
    }
    case "speedChangePointDistance": {
      const remaining = subtract(input.totalDistance, sol.answer);
      m = method(language, "पहले भाग की दूरी मानकर दोनों भागों के समय का योग कुल समय के बराबर रखें।", "ਪਹਿਲੇ ਭਾਗ ਦੀ ਦੂਰੀ ਮੰਨ ਕੇ ਦੋਵੇਂ ਭਾਗਾਂ ਦੇ ਸਮੇਂ ਦਾ ਜੋੜ ਕੁੱਲ ਸਮੇਂ ਦੇ ਬਰਾਬਰ ਰੱਖੋ।");
      steps = [
        `${C}: ${language === "hi" ? "पहला भाग" : "ਪਹਿਲਾ ਭਾਗ"} ${km(sol.answer)}, ${language === "hi" ? "शेष भाग" : "ਬਾਕੀ ਭਾਗ"} ${km(remaining)}।`,
        `${C}: ${n(sol.answer)} ÷ ${n(input.firstSpeed)} + ${n(remaining)} ÷ ${n(input.secondSpeed)} = ${dur(input.totalTravelTime, language)}।`,
      ];
      break;
    }
    case "fractionOfRouteAtChangedSpeed": {
      const original = sol.intermediate.originalDistance!;
      const changed = sol.intermediate.changedDistance!;
      m = method(language, "दो गति-खंडों की दूरी निकालकर बदली हुई गति वाले भाग को कुल दूरी का प्रतिशत बनाएँ।", "ਦੋ ਰਫ਼ਤਾਰ-ਭਾਗਾਂ ਦੀ ਦੂਰੀ ਕੱਢ ਕੇ ਬਦਲੀ ਰਫ਼ਤਾਰ ਵਾਲੇ ਭਾਗ ਨੂੰ ਕੁੱਲ ਦੂਰੀ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਬਣਾਓ।");
      steps = [
        `${C}: ${language === "hi" ? "पुरानी गति वाला भाग" : "ਪੁਰਾਣੀ ਰਫ਼ਤਾਰ ਵਾਲਾ ਭਾਗ"} = ${km(original)}, ${language === "hi" ? "बदली गति वाला भाग" : "ਬਦਲੀ ਰਫ਼ਤਾਰ ਵਾਲਾ ਭਾਗ"} = ${km(changed)}।`,
        `${C}: ${n(changed)} ÷ ${n(input.totalDistance)} × 100 = ${final}।`,
      ];
      break;
    }
    case "lostTimeDurationFromScheduleRecovery": {
      const usual = divide(input.remainingDistance, input.usualSpeed);
      const recovery = divide(input.remainingDistance, input.recoverySpeed);
      const recovered = subtract(usual, recovery);
      m = method(language, "तेज गति से बचाया गया समय और अंत में बची देरी जोड़ें।", "ਵੱਧ ਰਫ਼ਤਾਰ ਨਾਲ ਬਚਾਇਆ ਸਮਾਂ ਅਤੇ ਅੰਤ ਵਿੱਚ ਬਚੀ ਦੇਰੀ ਜੋੜੋ।");
      steps = [
        `${C}: ${language === "hi" ? "सामान्य शेष समय" : "ਆਮ ਬਾਕੀ ਸਮਾਂ"} = ${dur(usual, language)}, ${language === "hi" ? "तेज गति वाला समय" : "ਵੱਧ ਰਫ਼ਤਾਰ ਵਾਲਾ ਸਮਾਂ"} = ${dur(recovery, language)}।`,
        `${C}: ${language === "hi" ? "बचाया समय" : "ਬਚਾਇਆ ਸਮਾਂ"} = ${dur(recovered, language)}।`,
        `${T} ${dur(recovered, language)} + ${dur(input.finalArrivalDelay, language)} = ${final}।`,
      ];
      break;
    }
    case "startTimeShiftForSameArrival": {
      const oldTime = divide(input.distance, input.originalSpeed);
      const newTime = divide(input.distance, input.newSpeed);
      m = method(language, "एक ही पहुँच-समय के लिए प्रस्थान का बदलाव यात्रा-समय के बदलाव के बराबर होगा।", "ਇੱਕੋ ਪਹੁੰਚ-ਸਮੇਂ ਲਈ ਰਵਾਨਗੀ ਦਾ ਬਦਲਾਅ ਸਫ਼ਰ-ਸਮੇਂ ਦੇ ਬਦਲਾਅ ਦੇ ਬਰਾਬਰ ਹੋਵੇਗਾ।");
      steps = [
        `${C}: ${language === "hi" ? "पुराना समय" : "ਪੁਰਾਣਾ ਸਮਾਂ"} = ${dur(oldTime, language)}, ${language === "hi" ? "नया समय" : "ਨਵਾਂ ਸਮਾਂ"} = ${dur(newTime, language)}।`,
        `${T} |${dur(oldTime, language)} − ${dur(newTime, language)}| = ${final}।`,
      ];
      break;
    }
    case "arrivalShiftFromDepartureAndSpeedChanges": {
      const oldTime = divide(input.distance, input.originalSpeed);
      const newTime = divide(input.distance, input.newSpeed);
      const signed = add(input.departureShift, subtract(newTime, oldTime));
      m = method(language, "प्रस्थान-समय के बदलाव और यात्रा-समय के बदलाव को दिशा सहित जोड़ें, फिर कुल बदलाव का परिमाण लें।", "ਰਵਾਨਗੀ-ਸਮੇਂ ਦੇ ਬਦਲਾਅ ਅਤੇ ਸਫ਼ਰ-ਸਮੇਂ ਦੇ ਬਦਲਾਅ ਨੂੰ ਦਿਸ਼ਾ ਸਮੇਤ ਜੋੜੋ, ਫਿਰ ਕੁੱਲ ਬਦਲਾਅ ਦਾ ਪਰਿਮਾਣ ਲਵੋ।");
      steps = [
        `${C}: ${language === "hi" ? "पुराना यात्रा-समय" : "ਪੁਰਾਣਾ ਸਫ਼ਰ-ਸਮਾਂ"} = ${dur(oldTime, language)}, ${language === "hi" ? "नया यात्रा-समय" : "ਨਵਾਂ ਸਫ਼ਰ-ਸਮਾਂ"} = ${dur(newTime, language)}।`,
        `${C}: ${language === "hi" ? "दिशा सहित कुल बदलाव" : "ਦਿਸ਼ਾ ਸਮੇਤ ਕੁੱਲ ਬਦਲਾਅ"} = ${dur(signed, language)}।`,
        `${T} ${language === "hi" ? "परिमाण" : "ਪਰਿਮਾਣ"} = ${final}।`,
      ];
      break;
    }
    case "walkingRidingAllocation": {
      const walkD = sol.intermediate.walkingDistance!;
      const rideD = sol.intermediate.ridingDistance!;
      const walkT = sol.intermediate.walkingTime!;
      const rideT = sol.intermediate.ridingTime!;
      m = method(language, "पैदल और सवारी की दूरियों का योग कुल दूरी तथा दोनों समयों का योग कुल समय रखें।", "ਪੈਦਲ ਅਤੇ ਸਵਾਰੀ ਦੀਆਂ ਦੂਰੀਆਂ ਦਾ ਜੋੜ ਕੁੱਲ ਦੂਰੀ ਅਤੇ ਦੋਵੇਂ ਸਮਿਆਂ ਦਾ ਜੋੜ ਕੁੱਲ ਸਮਾਂ ਰੱਖੋ।");
      steps = [
        `${C}: ${language === "hi" ? "पैदल दूरी" : "ਪੈਦਲ ਦੂਰੀ"} = ${km(walkD)}, ${language === "hi" ? "सवारी दूरी" : "ਸਵਾਰੀ ਦੂਰੀ"} = ${km(rideD)}।`,
        `${C}: ${language === "hi" ? "पैदल समय" : "ਪੈਦਲ ਸਮਾਂ"} = ${dur(walkT, language)}, ${language === "hi" ? "सवारी समय" : "ਸਵਾਰੀ ਸਮਾਂ"} = ${dur(rideT, language)}।`,
        `${T} ${targetText(input.target, language)} = ${final}।`,
      ];
      break;
    }
    case "scheduleBuffer":
      throw new Error("scheduleBuffer cannot enter native accepted review");
  }

  const answer = `${language === "hi" ? "उत्तर" : "ਉੱਤਰ"}: ${final}`;
  assertTsdCp003NativeText(m, language, `${source.questionLanguageId}/${language}/method`);
  for (const [index, step] of steps.entries()) {
    assertTsdCp003NativeText(step, language, `${source.questionLanguageId}/${language}/step-${index + 1}`);
  }
  assertTsdCp003NativeText(answer, language, `${source.questionLanguageId}/${language}/answer`);
  return Object.freeze({ method: m, steps: Object.freeze(steps), answer });
}

function optionValue(source: TsdCp003EnglishFrozenRecord, index: number): Rational {
  const audit = source.optionAudit[index];
  if (!audit) throw new Error(`${source.questionLanguageId}: missing option audit ${index}`);
  if (audit.isCorrect) return source.solution.answer;
  if (!audit.wrongWorking) throw new Error(`${source.questionLanguageId}: wrong option ${index} lacks exact wrong-working value`);
  return audit.wrongWorking.value;
}

function buildPresentation(
  source: TsdCp003EnglishFrozenRecord,
  language: TsdCp003NativeLanguage,
): TsdCp003NativePresentation {
  const stem = renderStem(source, language);
  assertTsdCp003NativeText(stem, language, `${source.questionLanguageId}/${language}/stem`);

  const values = source.options.map((_option, index) => optionValue(source, index));
  const options = Object.freeze(values.map((value) => formatNativeSolvedValue(value, source.solution.unit, language)));
  const answerText = formatNativeSolvedValue(source.solution.answer, source.solution.unit, language);
  const correctValue = values[source.correctIndex];
  if (toCanonicalString(correctValue) !== toCanonicalString(source.solution.answer)) {
    throw new Error(`${source.questionLanguageId}/${language}: correct option value diverged from frozen English answer`);
  }
  if (new Set(options).size !== 4) throw new Error(`${source.questionLanguageId}/${language}: localized options are not unique`);

  const explanation = renderExplanation(source, language);
  const questionLanguageId = `${source.questionLanguageId}:${language === "hi" ? "hi-IN" : "pa-IN"}`;

  return Object.freeze({
    language,
    locale: language === "hi" ? "hi-IN" : "pa-IN",
    permanentQlId: source.permanentQlId,
    authorityKey: source.authorityKey,
    authorityOwnerCheckpointId: source.authorityOwnerCheckpointId,
    contentCheckpointId: "TSD-CP-003",
    sourceQuestionLanguageId: source.questionLanguageId,
    questionLanguageId,
    solveMode: source.solveMode,
    representation: source.representation,
    seed: source.seed,
    difficulty: source.difficulty,
    stem,
    options,
    correctIndex: source.correctIndex,
    answerText,
    explanation,
    mathematicalFingerprint: source.mathematicalFingerprint,
    parity: Object.freeze({
      sourceLanguage: "en" as const,
      answerKeyAuthority: "FROZEN_ENGLISH_RUNTIME" as const,
      solverAuthority: "FROZEN_ENGLISH_RUNTIME" as const,
      sourcePermanentQlId: source.permanentQlId,
      sourceSeed: source.seed,
      sourceQuestionLanguageId: source.questionLanguageId,
      inputIdentity: stableCp003Stringify(source.input),
      solutionIdentity: stableCp003Stringify(source.solution),
      optionValueFingerprints: Object.freeze(values.map(toCanonicalString)),
      optionOrderPreserved: true as const,
      answerValuePreserved: true as const,
      correctIndexPreserved: true as const,
      mathematicalFingerprintPreserved: true as const,
      localizedOptionTextOnly: true as const,
    }),
    lifecycle: Object.freeze({
      nativeEditorialStatus: TSD_CP003_NATIVE_EDITORIAL_STATUS,
      multilingualFreezeStatus: "UNFROZEN" as const,
      questionStudioEnabled: false as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
    }),
  });
}

export function generateCp003NativePreview(
  language: TsdCp003NativeLanguage,
): readonly TsdCp003MultilingualPreview[] {
  return Object.freeze(generateCp003EnglishFrozenRecords().map((source) => Object.freeze({
    source,
    presentation: buildPresentation(source, language),
  })));
}

export function generateCp003AllNativePreviews(): readonly TsdCp003MultilingualPreview[] {
  return Object.freeze([
    ...generateCp003NativePreview("hi"),
    ...generateCp003NativePreview("pa"),
  ]);
}
