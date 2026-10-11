import type { TsdCp003EnglishFrozenRecord } from "../english-frozen";
import type { TsdCp003MisconceptionId } from "../runtime-types";
import {
  generateCp003ReviewedNativeCandidate,
  type TsdCp003ReviewedNativeCandidate,
} from "./native-reviewed-candidate";
import {
  assertTsdCp003NativeText,
  type TsdCp003NativeLanguage,
} from "./native-language-primitives";
import { nativeMisconceptionReason } from "./native-misconception-copy";

export const TSD_CP003_NATIVE_AUTHORITATIVE_STATUS = "NATIVE_EDITORIAL_REMEDIATION_CANDIDATE" as const;

export type TsdCp003NativeOptionAnalysis = Readonly<{
  option: "A" | "B" | "C" | "D";
  text: string;
  isCorrect: boolean;
  reason: string;
}>;

export type TsdCp003NativeAuthoritativePresentation = Omit<
  TsdCp003ReviewedNativeCandidate["presentation"],
  "stem" | "explanation" | "lifecycle"
> & Readonly<{
  stem: string;
  explanation: Readonly<{
    method: string;
    steps: readonly string[];
    examSpeedShortcut: string;
    optionAnalysis: readonly TsdCp003NativeOptionAnalysis[];
    answer: string;
  }>;
  lifecycle: Readonly<{
    nativeEditorialStatus: "AUTHORITATIVE_NATIVE_EDITORIAL_CANDIDATE";
    multilingualFreezeStatus: "UNFROZEN";
    questionStudioEnabled: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;

export type TsdCp003NativeAuthoritativeRow = Readonly<{
  source: TsdCp003EnglishFrozenRecord;
  presentation: TsdCp003NativeAuthoritativePresentation;
  authoritativeReview: Readonly<{
    status: typeof TSD_CP003_NATIVE_AUTHORITATIVE_STATUS;
    publicNativeEntryPoint: true;
    legacyDraftEntryPointsPublic: false;
    explanationContract: "METHOD_STEPS_SHORTCUT_OPTION_ANALYSIS_ANSWER";
    stemVariantOrdinal: 0 | 1 | 2;
    productOwnerApprovalRecorded: false;
    multilingualFreezeAuthorized: false;
    sourceMathChanged: false;
  }>;
}>;

const HI_CONTEXT = /एक (?:वाहन|स्कूल बस|डिलीवरी वाहन|टैक्सी|कार|बस|कोच|ट्रक)/u;
const PA_CONTEXT = /ਇੱਕ (?:ਵਾਹਨ|ਸਕੂਲ ਬੱਸ|ਡਿਲਿਵਰੀ ਵਾਹਨ|ਟੈਕਸੀ|ਕਾਰ|ਬੱਸ|ਕੋਚ|ਟਰੱਕ)/u;

const CONTEXTS = Object.freeze({
  hi: Object.freeze(["एक वाहन", "एक कोच", "एक ट्रक"]),
  pa: Object.freeze(["ਇੱਕ ਵਾਹਨ", "ਇੱਕ ਕੋਚ", "ਇੱਕ ਟਰੱਕ"]),
} as const);

function diversifyContext(
  stem: string,
  language: TsdCp003NativeLanguage,
  ordinal: 0 | 1 | 2,
): string {
  const context = CONTEXTS[language][ordinal];
  return language === "hi" ? stem.replace(HI_CONTEXT, context) : stem.replace(PA_CONTEXT, context);
}

function refineBaseStem(
  source: TsdCp003EnglishFrozenRecord,
  stem: string,
  language: TsdCp003NativeLanguage,
): string {
  if (source.input.solveMode !== "speedFromFixedRouteTimeDifference" || source.input.representation !== "KNOWN_OTHER_SPEED") {
    return stem;
  }

  if (language === "hi") {
    return stem
      .replace("दूसरी कम गति के साथ यात्रा-समयों का अंतर", "दूसरी गति इससे कम है और दोनों यात्रा-समयों का अंतर")
      .replace("दूसरी अधिक गति के साथ यात्रा-समयों का अंतर", "दूसरी गति इससे अधिक है और दोनों यात्रा-समयों का अंतर");
  }
  return stem
    .replace("ਦੂਜੀ ਘੱਟ ਰਫ਼ਤਾਰ ਨਾਲ ਸਫ਼ਰ-ਸਮਿਆਂ ਦਾ ਅੰਤਰ", "ਦੂਜੀ ਰਫ਼ਤਾਰ ਇਸ ਤੋਂ ਘੱਟ ਹੈ ਅਤੇ ਦੋਵੇਂ ਸਫ਼ਰ-ਸਮਿਆਂ ਦਾ ਅੰਤਰ")
    .replace("ਦੂਜੀ ਵੱਧ ਰਫ਼ਤਾਰ ਨਾਲ ਸਫ਼ਰ-ਸਮਿਆਂ ਦਾ ਅੰਤਰ", "ਦੂਜੀ ਰਫ਼ਤਾਰ ਇਸ ਤੋਂ ਵੱਧ ਹੈ ਅਤੇ ਦੋਵੇਂ ਸਫ਼ਰ-ਸਮਿਆਂ ਦਾ ਅੰਤਰ");
}

function replaceFinalQuestion(stem: string, question: string): string {
  const trimmed = stem.trim();
  const body = trimmed.endsWith("।") ? trimmed.slice(0, -1) : trimmed;
  const lastDanda = body.lastIndexOf("।");
  if (lastDanda < 0) return question;
  return `${body.slice(0, lastDanda + 1)} ${question}`;
}

function alternateQuestion(
  source: TsdCp003EnglishFrozenRecord,
  stem: string,
  language: TsdCp003NativeLanguage,
  ordinal: 0 | 1 | 2,
): string {
  if (ordinal === 0) return stem;
  const mode = source.input.solveMode;
  const hi = language === "hi";
  let question: string;

  switch (mode) {
    case "timeGainLossFromSpeedChange": {
      const saved = /बचत|ਬਚਤ/u.test(stem);
      question = saved
        ? (ordinal === 1
          ? (hi ? "यात्रा-समय में कितनी कमी आएगी?" : "ਸਫ਼ਰ-ਸਮੇਂ ਵਿੱਚ ਕਿੰਨੀ ਕਮੀ ਆਵੇਗੀ?")
          : (hi ? "कितना समय बचेगा?" : "ਕਿੰਨਾ ਸਮਾਂ ਬਚੇਗਾ?"))
        : (ordinal === 1
          ? (hi ? "यात्रा-समय में कितनी वृद्धि होगी?" : "ਸਫ਼ਰ-ਸਮੇਂ ਵਿੱਚ ਕਿੰਨਾ ਵਾਧਾ ਹੋਵੇਗਾ?")
          : (hi ? "कितना अतिरिक्त समय लगेगा?" : "ਕਿੰਨਾ ਵਾਧੂ ਸਮਾਂ ਲੱਗੇਗਾ?"));
      break;
    }
    case "distanceFromSpeedTimeDifference":
      question = ordinal === 1
        ? (hi ? "इस निश्चित मार्ग की दूरी कितनी है?" : "ਇਸ ਨਿਰਧਾਰਤ ਰਸਤੇ ਦੀ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?")
        : (hi ? "तय मार्ग की दूरी बताइए।" : "ਤੈਅ ਰਸਤੇ ਦੀ ਦੂਰੀ ਦੱਸੋ।");
      break;
    case "speedFromFixedRouteTimeDifference": {
      const current = stem.slice(stem.lastIndexOf("।") + 1).trim();
      const label = hi
        ? (current.includes("अधिक") ? "अधिक गति" : current.includes("कम") ? "कम गति" : "दूसरी गति")
        : (current.includes("ਵੱਧ") ? "ਵੱਧ ਰਫ਼ਤਾਰ" : current.includes("ਘੱਟ") ? "ਘੱਟ ਰਫ਼ਤਾਰ" : "ਦੂਜੀ ਰਫ਼ਤਾਰ");
      question = ordinal === 1
        ? `${label} ${hi ? "कितनी होगी?" : "ਕਿੰਨੀ ਹੋਵੇਗੀ?"}`
        : `${label} ${hi ? "का मान बताइए।" : "ਦਾ ਮਾਨ ਦੱਸੋ।"}`;
      break;
    }
    case "usualSpeedFromEarlyLatePair":
      question = ordinal === 1
        ? (hi ? "समय पर पहुँचने के लिए सामान्य गति कितनी होनी चाहिए?" : "ਸਮੇਂ ਉੱਤੇ ਪਹੁੰਚਣ ਲਈ ਆਮ ਰਫ਼ਤਾਰ ਕਿੰਨੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?")
        : (hi ? "ठीक समय पर पहुँचने वाली सामान्य गति बताइए।" : "ਸਮੇਂ ਉੱਤੇ ਪਹੁੰਚਣ ਲਈ ਆਮ ਰਫ਼ਤਾਰ ਦੱਸੋ।");
      break;
    case "distanceFromEarlyLatePair":
      question = ordinal === 1
        ? (hi ? "इस निश्चित मार्ग की दूरी कितनी है?" : "ਇਸ ਨਿਰਧਾਰਤ ਰਸਤੇ ਦੀ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?")
        : (hi ? "मार्ग की लंबाई बताइए।" : "ਰਸਤੇ ਦੀ ਲੰਬਾਈ ਦੱਸੋ।");
      break;
    case "scheduledArrivalTimeFromActualSpeed":
      question = ordinal === 1
        ? (hi ? "आगमन का समय ज्ञात कीजिए।" : "ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ ਕੱਢੋ।")
        : (hi ? "वह कब पहुँचेगा?" : "ਉਹ ਕਦੋਂ ਪਹੁੰਚੇਗਾ?");
      break;
    case "requiredRecoverySpeedAfterLostTime":
      question = ordinal === 1
        ? (hi ? "शेष मार्ग किस गति से तय करना होगा?" : "ਬਾਕੀ ਰਸਤਾ ਕਿਸ ਰਫ਼ਤਾਰ ਨਾਲ ਤੈਅ ਕਰਨਾ ਹੋਵੇਗਾ?")
        : (hi ? "समय पर पहुँचने के लिए आवश्यक गति बताइए।" : "ਸਮੇਂ ਉੱਤੇ ਪਹੁੰਚਣ ਲਈ ਲੋੜੀਂਦੀ ਰਫ਼ਤਾਰ ਦੱਸੋ।");
      break;
    case "requiredRemainingSpeedAfterPartialRoute":
      question = ordinal === 1
        ? (hi ? "बची दूरी के लिए गति कितनी होनी चाहिए?" : "ਬਾਕੀ ਦੂਰੀ ਲਈ ਰਫ਼ਤਾਰ ਕਿੰਨੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?")
        : (hi ? "शेष मार्ग की आवश्यक गति बताइए।" : "ਬਾਕੀ ਰਸਤੇ ਲਈ ਲੋੜੀਂਦੀ ਰਫ਼ਤਾਰ ਦੱਸੋ।");
      break;
    case "stoppageDurationFromRunningAndOverallSpeed":
      question = ordinal === 1
        ? (hi ? "रुकने में कुल कितना समय लगा?" : "ਰੁਕਣ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗਿਆ?")
        : (hi ? "कुल रुकने की अवधि बताइए।" : "ਕੁੱਲ ਰੁਕਣ ਦੀ ਮਿਆਦ ਦੱਸੋ।");
      break;
    case "overallSpeedIncludingStops":
      question = ordinal === 1
        ? (hi ? "रुकने सहित औसत गति कितनी होगी?" : "ਰੁਕਣ ਸਮੇਤ ਔਸਤ ਰਫ਼ਤਾਰ ਕਿੰਨੀ ਹੋਵੇਗੀ?")
        : (hi ? "पूरी यात्रा की औसत गति बताइए।" : "ਪੂਰੇ ਸਫ਼ਰ ਦੀ ਔਸਤ ਰਫ਼ਤਾਰ ਦੱਸੋ।");
      break;
    case "runningSpeedFromOverallSpeedAndStops":
      question = ordinal === 1
        ? (hi ? "वास्तविक चलने की गति कितनी है?" : "ਅਸਲ ਚੱਲਣ ਦੀ ਰਫ਼ਤਾਰ ਕਿੰਨੀ ਹੈ?")
        : (hi ? "चलते समय की गति बताइए।" : "ਚੱਲਣ ਸਮੇਂ ਦੀ ਰਫ਼ਤਾਰ ਦੱਸੋ।");
      break;
    case "numberOfStopsFromOverallDelay":
      question = ordinal === 1
        ? (hi ? "वाहन कुल कितनी बार रुका?" : "ਵਾਹਨ ਕੁੱਲ ਕਿੰਨੀ ਵਾਰ ਰੁਕਿਆ?")
        : (hi ? "रुकने की संख्या बताइए।" : "ਰੁਕਣ ਦੀ ਗਿਣਤੀ ਦੱਸੋ।");
      break;
    case "delayFromRegularStops":
      question = ordinal === 1
        ? (hi ? "इन ठहरावों से कुल कितनी देरी होगी?" : "ਇਨ੍ਹਾਂ ਠਹਿਰਾਅਾਂ ਨਾਲ ਕੁੱਲ ਕਿੰਨੀ ਦੇਰੀ ਹੋਵੇਗੀ?")
        : (hi ? "कुल देरी बताइए।" : "ਕੁੱਲ ਦੇਰੀ ਦੱਸੋ।");
      break;
    case "restTimeInRepeatedTravelRestCycle":
      question = ordinal === 1
        ? (hi ? "एक विश्राम कितने समय का है?" : "ਇੱਕ ਆਰਾਮ ਕਿੰਨੇ ਸਮੇਂ ਦਾ ਹੈ?")
        : (hi ? "एक विश्राम की अवधि बताइए।" : "ਇੱਕ ਆਰਾਮ ਦੀ ਮਿਆਦ ਦੱਸੋ।");
      break;
    case "totalTimeWithRegularStops":
      question = ordinal === 1
        ? (hi ? "रुकने सहित कुल यात्रा-समय कितना है?" : "ਰੁਕਣ ਸਮੇਤ ਕੁੱਲ ਸਫ਼ਰ-ਸਮਾਂ ਕਿੰਨਾ ਹੈ?")
        : (hi ? "कुल यात्रा अवधि बताइए।" : "ਕੁੱਲ ਸਫ਼ਰ ਦੀ ਮਿਆਦ ਦੱਸੋ।");
      break;
    case "speedChangePointDistance":
      question = ordinal === 1
        ? (hi ? "गति बदलने से पहले कितनी दूरी तय होती है?" : "ਰਫ਼ਤਾਰ ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ ਕਿੰਨੀ ਦੂਰੀ ਤੈਅ ਹੁੰਦੀ ਹੈ?")
        : (hi ? "गति-परिवर्तन बिंदु की दूरी बताइए।" : "ਰਫ਼ਤਾਰ-ਬਦਲਾਅ ਬਿੰਦੂ ਦੀ ਦੂਰੀ ਦੱਸੋ।");
      break;
    case "fractionOfRouteAtChangedSpeed":
      question = ordinal === 1
        ? (hi ? "बदली गति वाला हिस्सा कुल मार्ग का कितने प्रतिशत है?" : "ਬਦਲੀ ਰਫ਼ਤਾਰ ਵਾਲਾ ਹਿੱਸਾ ਕੁੱਲ ਰਸਤੇ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?")
        : (hi ? "बदली गति पर तय मार्ग का प्रतिशत बताइए।" : "ਬਦਲੀ ਰਫ਼ਤਾਰ ਉੱਤੇ ਤੈਅ ਰਸਤੇ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਦੱਸੋ।");
      break;
    case "lostTimeDurationFromScheduleRecovery":
      question = ordinal === 1
        ? (hi ? "आरंभ में कितना समय गंवाया गया?" : "ਸ਼ੁਰੂ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਗੁਆਇਆ ਗਿਆ?")
        : (hi ? "शुरू में गंवाया समय बताइए।" : "ਸ਼ੁਰੂ ਵਿੱਚ ਗੁਆਇਆ ਸਮਾਂ ਦੱਸੋ।");
      break;
    case "startTimeShiftForSameArrival": {
      const direction = hi
        ? (stem.includes(" पहले ") ? "पहले" : "बाद")
        : (stem.includes(" ਪਹਿਲਾਂ ") ? "ਪਹਿਲਾਂ" : "ਬਾਅਦ");
      question = ordinal === 1
        ? (hi ? `समान आगमन के लिए प्रस्थान कितनी देर ${direction} करना होगा?` : `ਇੱਕੋ ਪਹੁੰਚ ਸਮੇਂ ਲਈ ਰਵਾਨਗੀ ਕਿੰਨੀ ਦੇਰ ${direction} ਕਰਨੀ ਹੋਵੇਗੀ?`)
        : (hi ? `वाहन को कितने समय ${direction} निकलना चाहिए?` : `ਵਾਹਨ ਨੂੰ ਕਿੰਨਾ ਸਮਾਂ ${direction} ਨਿਕਲਣਾ ਚਾਹੀਦਾ ਹੈ?`);
      break;
    }
    case "arrivalShiftFromDepartureAndSpeedChanges":
      question = ordinal === 1
        ? (hi ? "आगमन-समय कितने समय से बदलेगा?" : "ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ ਕਿੰਨੇ ਸਮੇਂ ਨਾਲ ਬਦਲੇਗਾ?")
        : (hi ? "आगमन-समय में कुल बदलाव की मात्रा बताइए।" : "ਪਹੁੰਚਣ ਦੇ ਸਮੇਂ ਵਿੱਚ ਕੁੱਲ ਬਦਲਾਅ ਦੀ ਮਾਤਰਾ ਦੱਸੋ।");
      break;
    case "walkingRidingAllocation": {
      const target = source.input.target;
      const labels = hi
        ? {
            WALKING_TIME: ["पैदल चलने का समय कितना है?", "पैदल चलने का समय बताइए।"],
            RIDING_TIME: ["सवारी में लगा समय कितना है?", "सवारी में लगा समय बताइए।"],
            WALKING_DISTANCE: ["पैदल तय दूरी कितनी है?", "पैदल तय दूरी बताइए।"],
            RIDING_DISTANCE: ["सवारी से तय दूरी कितनी है?", "सवारी से तय दूरी बताइए।"],
          }
        : {
            WALKING_TIME: ["ਪੈਦਲ ਚੱਲਣ ਦਾ ਸਮਾਂ ਕਿੰਨਾ ਹੈ?", "ਪੈਦਲ ਚੱਲਣ ਦਾ ਸਮਾਂ ਦੱਸੋ।"],
            RIDING_TIME: ["ਸਵਾਰੀ ਵਿੱਚ ਲੱਗਿਆ ਸਮਾਂ ਕਿੰਨਾ ਹੈ?", "ਸਵਾਰੀ ਵਿੱਚ ਲੱਗਿਆ ਸਮਾਂ ਦੱਸੋ।"],
            WALKING_DISTANCE: ["ਪੈਦਲ ਤੈਅ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?", "ਪੈਦਲ ਤੈਅ ਦੂਰੀ ਦੱਸੋ।"],
            RIDING_DISTANCE: ["ਸਵਾਰੀ ਨਾਲ ਤੈਅ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?", "ਸਵਾਰੀ ਨਾਲ ਤੈਅ ਦੂਰੀ ਦੱਸੋ।"],
          };
      question = labels[target][ordinal - 1];
      break;
    }
    default:
      return stem;
  }

  return replaceFinalQuestion(stem, question);
}

function examShortcut(solveMode: string, language: TsdCp003NativeLanguage): string {
  const pick = (hi: string, pa: string): string => language === "hi" ? hi : pa;
  switch (solveMode) {
    case "timeGainLossFromSpeedChange":
    case "distanceFromSpeedTimeDifference":
    case "distanceFromEarlyLatePair":
      return pick("एक ही दूरी पर समय = दूरी ÷ गति; दोनों समयों का अंतर सीधे उपयोग करें।", "ਇੱਕੋ ਦੂਰੀ ਉੱਤੇ ਸਮਾਂ = ਦੂਰੀ ÷ ਰਫ਼ਤਾਰ; ਦੋਵੇਂ ਸਮਿਆਂ ਦਾ ਅੰਤਰ ਸਿੱਧਾ ਵਰਤੋ।");
    case "speedFromFixedRouteTimeDifference":
    case "usualSpeedFromEarlyLatePair":
      return pick("समान दूरी में समय और गति का व्युत्क्रम संबंध याद रखें; पहले यात्रा-समय बनाइए।", "ਇੱਕੋ ਦੂਰੀ ਵਿੱਚ ਸਮਾਂ ਅਤੇ ਰਫ਼ਤਾਰ ਦਾ ਉਲਟ ਸੰਬੰਧ ਯਾਦ ਰੱਖੋ; ਪਹਿਲਾਂ ਸਫ਼ਰ-ਸਮਾਂ ਬਣਾਓ।");
    case "scheduledArrivalTimeFromActualSpeed":
      return pick("दूरी ÷ गति से यात्रा-समय निकालें और उसे प्रस्थान की घड़ी में जोड़ें।", "ਦੂਰੀ ÷ ਰਫ਼ਤਾਰ ਨਾਲ ਸਫ਼ਰ-ਸਮਾਂ ਕੱਢੋ ਅਤੇ ਉਸਨੂੰ ਰਵਾਨਗੀ ਦੀ ਘੜੀ ਵਿੱਚ ਜੋੜੋ।");
    case "requiredRecoverySpeedAfterLostTime":
    case "requiredRemainingSpeedAfterPartialRoute":
      return pick("आवश्यक गति = शेष दूरी ÷ वास्तव में उपलब्ध शेष समय।", "ਲੋੜੀਂਦੀ ਰਫ਼ਤਾਰ = ਬਾਕੀ ਦੂਰੀ ÷ ਅਸਲ ਵਿੱਚ ਉਪਲਬਧ ਬਾਕੀ ਸਮਾਂ।");
    case "stoppageDurationFromRunningAndOverallSpeed":
      return pick("रुकने का समय = कुल समय − वास्तविक चलने का समय।", "ਰੁਕਣ ਦਾ ਸਮਾਂ = ਕੁੱਲ ਸਮਾਂ − ਅਸਲ ਚੱਲਣ ਦਾ ਸਮਾਂ।");
    case "overallSpeedIncludingStops":
      return pick("रुकने सहित औसत गति = कुल दूरी ÷ (चलने का समय + रुकने का समय)।", "ਰੁਕਣ ਸਮੇਤ ਔਸਤ ਰਫ਼ਤਾਰ = ਕੁੱਲ ਦੂਰੀ ÷ (ਚੱਲਣ ਦਾ ਸਮਾਂ + ਰੁਕਣ ਦਾ ਸਮਾਂ)।");
    case "runningSpeedFromOverallSpeedAndStops":
      return pick("पहले कुल समय से रुकने का समय घटाएँ, फिर दूरी ÷ चलने का समय करें।", "ਪਹਿਲਾਂ ਕੁੱਲ ਸਮੇਂ ਵਿੱਚੋਂ ਰੁਕਣ ਦਾ ਸਮਾਂ ਘਟਾਓ, ਫਿਰ ਦੂਰੀ ÷ ਚੱਲਣ ਦਾ ਸਮਾਂ ਕਰੋ।");
    case "numberOfStopsFromOverallDelay":
      return pick("रुकने की संख्या = कुल देरी ÷ एक बार रुकने की अवधि।", "ਰੁਕਣ ਦੀ ਗਿਣਤੀ = ਕੁੱਲ ਦੇਰੀ ÷ ਇੱਕ ਵਾਰ ਰੁਕਣ ਦੀ ਮਿਆਦ।");
    case "delayFromRegularStops":
      return pick("कुल देरी = रुकने की संख्या × एक ठहराव की अवधि।", "ਕੁੱਲ ਦੇਰੀ = ਰੁਕਣ ਦੀ ਗਿਣਤੀ × ਇੱਕ ਠਹਿਰਾਅ ਦੀ ਮਿਆਦ।");
    case "restTimeInRepeatedTravelRestCycle":
      return pick("पहले सभी यात्रा-खंडों का समय घटाएँ; बचा समय सभी विश्रामों में बाँटें।", "ਪਹਿਲਾਂ ਸਾਰੇ ਸਫ਼ਰ-ਭਾਗਾਂ ਦਾ ਸਮਾਂ ਘਟਾਓ; ਬਚਿਆ ਸਮਾਂ ਸਾਰੇ ਆਰਾਮਾਂ ਵਿੱਚ ਵੰਡੋ।");
    case "totalTimeWithRegularStops":
      return pick("कुल समय = वास्तविक चलने का समय + सभी ठहरावों का कुल समय।", "ਕੁੱਲ ਸਮਾਂ = ਅਸਲ ਚੱਲਣ ਦਾ ਸਮਾਂ + ਸਾਰੇ ਠਹਿਰਾਅਾਂ ਦਾ ਕੁੱਲ ਸਮਾਂ।");
    case "speedChangePointDistance":
    case "fractionOfRouteAtChangedSpeed":
      return pick("मार्ग को दो हिस्सों में बाँटकर दोनों हिस्सों के समय का योग कुल समय के बराबर रखें।", "ਰਸਤੇ ਨੂੰ ਦੋ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡ ਕੇ ਦੋਵੇਂ ਹਿੱਸਿਆਂ ਦੇ ਸਮੇਂ ਦਾ ਜੋੜ ਕੁੱਲ ਸਮੇਂ ਦੇ ਬਰਾਬਰ ਰੱਖੋ।");
    case "lostTimeDurationFromScheduleRecovery":
      return pick("तेज चलकर बचाया समय + अंत में बची देरी = शुरू में गंवाया समय।", "ਤੇਜ਼ ਚੱਲ ਕੇ ਬਚਾਇਆ ਸਮਾਂ + ਅੰਤ ਵਿੱਚ ਬਚੀ ਦੇਰੀ = ਸ਼ੁਰੂ ਵਿੱਚ ਗੁਆਇਆ ਸਮਾਂ।");
    case "startTimeShiftForSameArrival":
      return pick("एक ही आगमन समय के लिए प्रस्थान का बदलाव यात्रा-समय के बदलाव के बराबर होता है।", "ਇੱਕੋ ਪਹੁੰਚ ਸਮੇਂ ਲਈ ਰਵਾਨਗੀ ਦਾ ਬਦਲਾਅ ਸਫ਼ਰ-ਸਮੇਂ ਦੇ ਬਦਲਾਅ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।");
    case "arrivalShiftFromDepartureAndSpeedChanges":
      return pick("प्रस्थान और यात्रा-समय के बदलाव को दिशा सहित जोड़ें; अंत में केवल कुल बदलाव की मात्रा लें।", "ਰਵਾਨਗੀ ਅਤੇ ਸਫ਼ਰ-ਸਮੇਂ ਦੇ ਬਦਲਾਅ ਨੂੰ ਦਿਸ਼ਾ ਸਮੇਤ ਜੋੜੋ; ਅੰਤ ਵਿੱਚ ਸਿਰਫ਼ ਕੁੱਲ ਬਦਲਾਅ ਦੀ ਮਾਤਰਾ ਲਵੋ।");
    case "walkingRidingAllocation":
      return pick("पैदल और सवारी की दूरी तथा समय के दो योग-समीकरण बनाकर लक्ष्य राशि निकालें।", "ਪੈਦਲ ਅਤੇ ਸਵਾਰੀ ਦੀ ਦੂਰੀ ਅਤੇ ਸਮੇਂ ਦੇ ਦੋ ਜੋੜ-ਸਮੀਕਰਨ ਬਣਾ ਕੇ ਲਕਸ਼ਿਤ ਰਾਸ਼ੀ ਕੱਢੋ।");
    default:
      return pick("दिए गए संबंध को इकाइयों सहित लिखें और केवल वही राशि निकालें जो प्रश्न में माँगी गई है।", "ਦਿੱਤੇ ਸੰਬੰਧ ਨੂੰ ਇਕਾਈਆਂ ਸਮੇਤ ਲਿਖੋ ਅਤੇ ਸਿਰਫ਼ ਉਹੀ ਰਾਸ਼ੀ ਕੱਢੋ ਜੋ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਮੰਗੀ ਗਈ ਹੈ।");
  }
}

function contextualMisconceptionReason(
  source: TsdCp003EnglishFrozenRecord,
  id: TsdCp003MisconceptionId,
  language: TsdCp003NativeLanguage,
): string {
  const hi = language === "hi";
  if (source.input.solveMode === "usualSpeedFromEarlyLatePair" && id === "USE_SLOWER_SPEED_ONLY") {
    return hi
      ? "सामान्य गति निकालने के बजाय देर से पहुँचने वाली कम परीक्षण गति को ही उत्तर मान लिया गया है।"
      : "ਆਮ ਰਫ਼ਤਾਰ ਕੱਢਣ ਦੀ ਥਾਂ ਦੇਰ ਨਾਲ ਪਹੁੰਚਣ ਵਾਲੀ ਘੱਟ ਪਰਖ-ਰਫ਼ਤਾਰ ਨੂੰ ਹੀ ਉੱਤਰ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।";
  }
  if (source.input.solveMode === "usualSpeedFromEarlyLatePair" && id === "USE_FASTER_SPEED_ONLY") {
    return hi
      ? "सामान्य गति निकालने के बजाय पहले पहुँचने वाली अधिक परीक्षण गति को ही उत्तर मान लिया गया है।"
      : "ਆਮ ਰਫ਼ਤਾਰ ਕੱਢਣ ਦੀ ਥਾਂ ਪਹਿਲਾਂ ਪਹੁੰਚਣ ਵਾਲੀ ਵੱਧ ਪਰਖ-ਰਫ਼ਤਾਰ ਨੂੰ ਹੀ ਉੱਤਰ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।";
  }
  if (source.input.solveMode === "distanceFromEarlyLatePair" && id === "USE_FASTER_SPEED_ONLY") {
    return hi
      ? "केवल पहले पहुँचने वाले समय को पूरी तेज यात्रा की अवधि मानकर उससे दूरी निकाल दी गई है।"
      : "ਸਿਰਫ਼ ਪਹਿਲਾਂ ਪਹੁੰਚਣ ਵਾਲੇ ਸਮੇਂ ਨੂੰ ਪੂਰੇ ਤੇਜ਼ ਸਫ਼ਰ ਦੀ ਮਿਆਦ ਮੰਨ ਕੇ ਉਸ ਨਾਲ ਦੂਰੀ ਕੱਢ ਦਿੱਤੀ ਗਈ ਹੈ।";
  }
  if (source.input.solveMode === "lostTimeDurationFromScheduleRecovery" && id === "USE_ONE_TRAVEL_TIME") {
    return hi
      ? "शुरू में गंवाया समय निकालने के बजाय शेष मार्ग की किसी एक पूरी यात्रा-अवधि को ही उत्तर मान लिया गया है।"
      : "ਸ਼ੁਰੂ ਵਿੱਚ ਗੁਆਇਆ ਸਮਾਂ ਕੱਢਣ ਦੀ ਥਾਂ ਬਾਕੀ ਰਸਤੇ ਦੀ ਕਿਸੇ ਇੱਕ ਪੂਰੀ ਸਫ਼ਰ-ਮਿਆਦ ਨੂੰ ਹੀ ਉੱਤਰ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।";
  }
  return nativeMisconceptionReason(id, language);
}

function optionAnalysis(
  source: TsdCp003EnglishFrozenRecord,
  nativeOptions: readonly string[],
  answerText: string,
  language: TsdCp003NativeLanguage,
): readonly TsdCp003NativeOptionAnalysis[] {
  return Object.freeze(source.optionAudit.map((audit, index) => {
    const option = String.fromCharCode(65 + index) as "A" | "B" | "C" | "D";
    const core = contextualMisconceptionReason(source, audit.misconceptionId, language);
    const reason = audit.isCorrect
      ? core
      : language === "hi"
        ? `${core} इसलिए ${nativeOptions[index]} सही उत्तर नहीं है; सही गणना से उत्तर ${answerText} मिलता है।`
        : `${core} ਇਸ ਲਈ ${nativeOptions[index]} ਸਹੀ ਉੱਤਰ ਨਹੀਂ ਹੈ; ਸਹੀ ਗਣਨਾ ਨਾਲ ਉੱਤਰ ${answerText} ਮਿਲਦਾ ਹੈ।`;
    assertTsdCp003NativeText(reason, language, `${source.questionLanguageId}/${language}/option-${option}-reason`);
    return Object.freeze({ option, text: nativeOptions[index], isCorrect: audit.isCorrect, reason });
  }));
}

function strengthenRow(
  row: TsdCp003ReviewedNativeCandidate,
  ordinal: 0 | 1 | 2,
): TsdCp003NativeAuthoritativeRow {
  const { source, presentation } = row;
  const language = presentation.language;
  const contextual = diversifyContext(presentation.stem, language, ordinal);
  const refined = refineBaseStem(source, contextual, language);
  const stem = alternateQuestion(source, refined, language, ordinal);
  assertTsdCp003NativeText(stem, language, `${presentation.questionLanguageId}/authoritative-stem`);

  const shortcut = examShortcut(presentation.solveMode, language);
  assertTsdCp003NativeText(shortcut, language, `${presentation.questionLanguageId}/shortcut`);
  const analyses = optionAnalysis(source, presentation.options, presentation.answerText, language);

  const authoritativePresentation: TsdCp003NativeAuthoritativePresentation = Object.freeze({
    ...presentation,
    stem,
    explanation: Object.freeze({
      method: presentation.explanation.method,
      steps: presentation.explanation.steps,
      examSpeedShortcut: shortcut,
      optionAnalysis: analyses,
      answer: presentation.explanation.answer,
    }),
    lifecycle: Object.freeze({
      nativeEditorialStatus: "AUTHORITATIVE_NATIVE_EDITORIAL_CANDIDATE" as const,
      multilingualFreezeStatus: "UNFROZEN" as const,
      questionStudioEnabled: false as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
    }),
  });

  return Object.freeze({
    source,
    presentation: authoritativePresentation,
    authoritativeReview: Object.freeze({
      status: TSD_CP003_NATIVE_AUTHORITATIVE_STATUS,
      publicNativeEntryPoint: true as const,
      legacyDraftEntryPointsPublic: false as const,
      explanationContract: "METHOD_STEPS_SHORTCUT_OPTION_ANALYSIS_ANSWER" as const,
      stemVariantOrdinal: ordinal,
      productOwnerApprovalRecorded: false as const,
      multilingualFreezeAuthorized: false as const,
      sourceMathChanged: false as const,
    }),
  });
}

export function generateCp003AuthoritativeNativeCandidate(
  language: TsdCp003NativeLanguage,
): readonly TsdCp003NativeAuthoritativeRow[] {
  const counters = new Map<string, number>();
  return Object.freeze(generateCp003ReviewedNativeCandidate(language).map((row) => {
    const current = counters.get(row.presentation.solveMode) ?? 0;
    if (current > 2) throw new Error(`${row.presentation.solveMode}: authoritative native corpus expected exactly three review rows per solve mode`);
    counters.set(row.presentation.solveMode, current + 1);
    return strengthenRow(row, current as 0 | 1 | 2);
  }));
}

export function generateCp003AllAuthoritativeNativeCandidates(): readonly TsdCp003NativeAuthoritativeRow[] {
  return Object.freeze([
    ...generateCp003AuthoritativeNativeCandidate("hi"),
    ...generateCp003AuthoritativeNativeCandidate("pa"),
  ]);
}
