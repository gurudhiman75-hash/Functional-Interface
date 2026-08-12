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

function frameStem(
  stem: string,
  language: TsdCp003NativeLanguage,
  ordinal: 0 | 1 | 2,
): string {
  if (ordinal === 0) return stem;
  if (ordinal === 1) {
    return language === "hi"
      ? `एक निर्धारित यात्रा में, ${stem}`
      : `ਇੱਕ ਨਿਰਧਾਰਤ ਸਫ਼ਰ ਵਿੱਚ, ${stem}`;
  }
  return language === "hi"
    ? `दिए गए आँकड़ों के आधार पर, ${stem}`
    : `ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਦੇ ਆਧਾਰ ਉੱਤੇ, ${stem}`;
}

function misconceptionReason(
  id: TsdCp003MisconceptionId,
  language: TsdCp003NativeLanguage,
): string {
  if (id === "CORRECT") {
    return language === "hi"
      ? "यह विकल्प प्रश्न की सभी शर्तों को सही विधि से लागू करने पर मिलता है।"
      : "ਇਹ ਵਿਕਲਪ ਪ੍ਰਸ਼ਨ ਦੀਆਂ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਨੂੰ ਸਹੀ ਵਿਧੀ ਨਾਲ ਲਾਗੂ ਕਰਨ ਉੱਤੇ ਮਿਲਦਾ ਹੈ।";
  }

  const key = String(id);
  if (/CLOCK|HOURS_AS_MINUTES|SIXTY/u.test(key)) {
    return language === "hi"
      ? "यह विकल्प समय या घड़ी की इकाइयों को गलत तरह से बदलने पर मिलता है।"
      : "ਇਹ ਵਿਕਲਪ ਸਮੇਂ ਜਾਂ ਘੜੀ ਦੀਆਂ ਇਕਾਈਆਂ ਨੂੰ ਗਲਤ ਤਰੀਕੇ ਨਾਲ ਬਦਲਣ ਉੱਤੇ ਮਿਲਦਾ ਹੈ।";
  }
  if (/STOP|REST|DELAY/u.test(key)) {
    return language === "hi"
      ? "यह विकल्प रुकने, विश्राम या देरी की संख्या/अवधि को गलत गिनने पर मिलता है।"
      : "ਇਹ ਵਿਕਲਪ ਰੁਕਣ, ਆਰਾਮ ਜਾਂ ਦੇਰੀ ਦੀ ਗਿਣਤੀ/ਮਿਆਦ ਨੂੰ ਗਲਤ ਗਿਣਨ ਉੱਤੇ ਮਿਲਦਾ ਹੈ।";
  }
  if (/MEAN|AVERAGE/u.test(key)) {
    return language === "hi"
      ? "यह विकल्प यहाँ लागू न होने वाला औसत या माध्य का शॉर्टकट लगाने पर मिलता है।"
      : "ਇਹ ਵਿਕਲਪ ਇੱਥੇ ਲਾਗੂ ਨਾ ਹੋਣ ਵਾਲਾ ਔਸਤ ਵਾਲਾ ਸ਼ਾਰਟਕੱਟ ਲਗਾਉਣ ਉੱਤੇ ਮਿਲਦਾ ਹੈ।";
  }
  if (/ROUTE|DISTANCE|MODE_SHARE|EQUAL_MODE_SPLIT/u.test(key)) {
    return language === "hi"
      ? "यह विकल्प दूरी या मार्ग के हिस्सों का गलत बँटवारा मानने पर मिलता है।"
      : "ਇਹ ਵਿਕਲਪ ਦੂਰੀ ਜਾਂ ਰਸਤੇ ਦੇ ਹਿੱਸਿਆਂ ਦੀ ਗਲਤ ਵੰਡ ਮੰਨਣ ਉੱਤੇ ਮਿਲਦਾ ਹੈ।";
  }
  if (/SPEED|RATIO/u.test(key)) {
    return language === "hi"
      ? "यह विकल्प गति के अनुपात या गति-समय संबंध को गलत लागू करने पर मिलता है।"
      : "ਇਹ ਵਿਕਲਪ ਰਫ਼ਤਾਰ ਦੇ ਅਨੁਪਾਤ ਜਾਂ ਰਫ਼ਤਾਰ-ਸਮਾਂ ਸੰਬੰਧ ਨੂੰ ਗਲਤ ਲਾਗੂ ਕਰਨ ਉੱਤੇ ਮਿਲਦਾ ਹੈ।";
  }
  if (/IGNORE/u.test(key)) {
    return language === "hi"
      ? "यह विकल्प प्रश्न की एक आवश्यक शर्त या पहले से हो चुके भाग को नज़रअंदाज़ करता है।"
      : "ਇਹ ਵਿਕਲਪ ਪ੍ਰਸ਼ਨ ਦੀ ਇੱਕ ਲੋੜੀਂਦੀ ਸ਼ਰਤ ਜਾਂ ਪਹਿਲਾਂ ਹੋ ਚੁੱਕੇ ਭਾਗ ਨੂੰ ਨਜ਼ਰਅੰਦਾਜ਼ ਕਰਦਾ ਹੈ।";
  }
  if (/ADD/u.test(key)) {
    return language === "hi"
      ? "यह विकल्प उन राशियों को जोड़ देता है जिन्हें सही संबंध में इस प्रकार नहीं जोड़ा जाना चाहिए।"
      : "ਇਹ ਵਿਕਲਪ ਉਹ ਰਾਸ਼ੀਆਂ ਜੋੜ ਦਿੰਦਾ ਹੈ ਜਿਨ੍ਹਾਂ ਨੂੰ ਸਹੀ ਸੰਬੰਧ ਵਿੱਚ ਇਸ ਤਰ੍ਹਾਂ ਨਹੀਂ ਜੋੜਨਾ ਚਾਹੀਦਾ।";
  }
  if (/SUBTRACT/u.test(key)) {
    return language === "hi"
      ? "यह विकल्प घटाव को गलत दिशा या गलत स्थान पर लागू करने से मिलता है।"
      : "ਇਹ ਵਿਕਲਪ ਘਟਾਉ ਨੂੰ ਗਲਤ ਦਿਸ਼ਾ ਜਾਂ ਗਲਤ ਥਾਂ ਉੱਤੇ ਲਾਗੂ ਕਰਨ ਨਾਲ ਮਿਲਦਾ ਹੈ।";
  }
  if (/MULTIPLY/u.test(key)) {
    return language === "hi"
      ? "यह विकल्प जहाँ भाग या दूसरा संबंध चाहिए वहाँ गुणा करने से मिलता है।"
      : "ਇਹ ਵਿਕਲਪ ਜਿੱਥੇ ਭਾਗ ਜਾਂ ਹੋਰ ਸੰਬੰਧ ਚਾਹੀਦਾ ਹੈ ਉੱਥੇ ਗੁਣਾ ਕਰਨ ਨਾਲ ਮਿਲਦਾ ਹੈ।";
  }
  if (/DIVIDE/u.test(key)) {
    return language === "hi"
      ? "यह विकल्प भाग की दिशा या भाग देने वाली राशि गलत चुनने से मिलता है।"
      : "ਇਹ ਵਿਕਲਪ ਭਾਗ ਦੀ ਦਿਸ਼ਾ ਜਾਂ ਭਾਗ ਦੇਣ ਵਾਲੀ ਰਾਸ਼ੀ ਗਲਤ ਚੁਣਨ ਨਾਲ ਮਿਲਦਾ ਹੈ।";
  }
  if (/TIME/u.test(key)) {
    return language === "hi"
      ? "यह विकल्प यात्रा-समय के अंतर को पूरा यात्रा-समय मानने जैसी समय-संबंधी गलती से मिलता है।"
      : "ਇਹ ਵਿਕਲਪ ਸਫ਼ਰ-ਸਮੇਂ ਦੇ ਅੰਤਰ ਨੂੰ ਪੂਰਾ ਸਫ਼ਰ-ਸਮਾਂ ਮੰਨਣ ਵਰਗੀ ਸਮਾਂ-ਸੰਬੰਧੀ ਗਲਤੀ ਨਾਲ ਮਿਲਦਾ ਹੈ।";
  }
  return language === "hi"
    ? "यह विकल्प प्रश्न की शर्त को गलत गणितीय संबंध में रखने से मिलता है।"
    : "ਇਹ ਵਿਕਲਪ ਪ੍ਰਸ਼ਨ ਦੀ ਸ਼ਰਤ ਨੂੰ ਗਲਤ ਗਣਿਤੀ ਸੰਬੰਧ ਵਿੱਚ ਰੱਖਣ ਨਾਲ ਮਿਲਦਾ ਹੈ।";
}

function examShortcut(solveMode: string, language: TsdCp003NativeLanguage): string {
  const hi = (text: string, pa: string): string => language === "hi" ? text : pa;
  switch (solveMode) {
    case "timeGainLossFromSpeedChange":
    case "distanceFromSpeedTimeDifference":
    case "distanceFromEarlyLatePair":
      return hi("एक ही दूरी पर समय = दूरी ÷ गति; दोनों समयों का अंतर सीधे उपयोग करें।", "ਇੱਕੋ ਦੂਰੀ ਉੱਤੇ ਸਮਾਂ = ਦੂਰੀ ÷ ਰਫ਼ਤਾਰ; ਦੋਵੇਂ ਸਮਿਆਂ ਦਾ ਅੰਤਰ ਸਿੱਧਾ ਵਰਤੋ।");
    case "speedFromFixedRouteTimeDifference":
    case "usualSpeedFromEarlyLatePair":
      return hi("समान दूरी में समय और गति का व्युत्क्रम संबंध याद रखें; पहले यात्रा-समय बनाइए।", "ਇੱਕੋ ਦੂਰੀ ਵਿੱਚ ਸਮਾਂ ਅਤੇ ਰਫ਼ਤਾਰ ਦਾ ਉਲਟ ਸੰਬੰਧ ਯਾਦ ਰੱਖੋ; ਪਹਿਲਾਂ ਸਫ਼ਰ-ਸਮਾਂ ਬਣਾਓ।");
    case "scheduledArrivalTimeFromActualSpeed":
      return hi("दूरी ÷ गति से यात्रा-समय निकालें और उसे प्रस्थान की घड़ी में जोड़ें।", "ਦੂਰੀ ÷ ਰਫ਼ਤਾਰ ਨਾਲ ਸਫ਼ਰ-ਸਮਾਂ ਕੱਢੋ ਅਤੇ ਉਸਨੂੰ ਰਵਾਨਗੀ ਦੀ ਘੜੀ ਵਿੱਚ ਜੋੜੋ।");
    case "requiredRecoverySpeedAfterLostTime":
    case "requiredRemainingSpeedAfterPartialRoute":
      return hi("आवश्यक गति = शेष दूरी ÷ वास्तव में उपलब्ध शेष समय।", "ਲੋੜੀਂਦੀ ਰਫ਼ਤਾਰ = ਬਾਕੀ ਦੂਰੀ ÷ ਅਸਲ ਵਿੱਚ ਉਪਲਬਧ ਬਾਕੀ ਸਮਾਂ।");
    case "stoppageDurationFromRunningAndOverallSpeed":
      return hi("रुकने का समय = कुल समय − वास्तविक चलने का समय।", "ਰੁਕਣ ਦਾ ਸਮਾਂ = ਕੁੱਲ ਸਮਾਂ − ਅਸਲ ਚੱਲਣ ਦਾ ਸਮਾਂ।");
    case "overallSpeedIncludingStops":
      return hi("ठहराव सहित औसत गति = कुल दूरी ÷ (चलने का समय + रुकने का समय)।", "ਰੁਕਣ ਸਮੇਤ ਔਸਤ ਰਫ਼ਤਾਰ = ਕੁੱਲ ਦੂਰੀ ÷ (ਚੱਲਣ ਦਾ ਸਮਾਂ + ਰੁਕਣ ਦਾ ਸਮਾਂ)।");
    case "runningSpeedFromOverallSpeedAndStops":
      return hi("पहले कुल समय से रुकने का समय घटाएँ, फिर दूरी ÷ चलने का समय करें।", "ਪਹਿਲਾਂ ਕੁੱਲ ਸਮੇਂ ਵਿੱਚੋਂ ਰੁਕਣ ਦਾ ਸਮਾਂ ਘਟਾਓ, ਫਿਰ ਦੂਰੀ ÷ ਚੱਲਣ ਦਾ ਸਮਾਂ ਕਰੋ।");
    case "numberOfStopsFromOverallDelay":
      return hi("रुकने की संख्या = कुल देरी ÷ एक बार रुकने की अवधि।", "ਰੁਕਣ ਦੀ ਗਿਣਤੀ = ਕੁੱਲ ਦੇਰੀ ÷ ਇੱਕ ਵਾਰ ਰੁਕਣ ਦੀ ਮਿਆਦ।");
    case "delayFromRegularStops":
      return hi("कुल देरी = रुकने की संख्या × एक ठहराव की अवधि।", "ਕੁੱਲ ਦੇਰੀ = ਰੁਕਣ ਦੀ ਗਿਣਤੀ × ਇੱਕ ਠਹਿਰਾਅ ਦੀ ਮਿਆਦ।");
    case "restTimeInRepeatedTravelRestCycle":
      return hi("पहले सभी यात्रा-खंडों का समय घटाएँ; बचा समय सभी विश्रामों में बाँटें।", "ਪਹਿਲਾਂ ਸਾਰੇ ਸਫ਼ਰ-ਭਾਗਾਂ ਦਾ ਸਮਾਂ ਘਟਾਓ; ਬਚਿਆ ਸਮਾਂ ਸਾਰੇ ਆਰਾਮਾਂ ਵਿੱਚ ਵੰਡੋ।");
    case "totalTimeWithRegularStops":
      return hi("कुल समय = वास्तविक चलने का समय + सभी ठहरावों का कुल समय।", "ਕੁੱਲ ਸਮਾਂ = ਅਸਲ ਚੱਲਣ ਦਾ ਸਮਾਂ + ਸਾਰੇ ਠਹਿਰਾਅਾਂ ਦਾ ਕੁੱਲ ਸਮਾਂ।");
    case "speedChangePointDistance":
    case "fractionOfRouteAtChangedSpeed":
      return hi("मार्ग को दो हिस्सों में बाँटकर दोनों हिस्सों के समय का योग कुल समय के बराबर रखें।", "ਰਸਤੇ ਨੂੰ ਦੋ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡ ਕੇ ਦੋਵੇਂ ਹਿੱਸਿਆਂ ਦੇ ਸਮੇਂ ਦਾ ਜੋੜ ਕੁੱਲ ਸਮੇਂ ਦੇ ਬਰਾਬਰ ਰੱਖੋ।");
    case "lostTimeDurationFromScheduleRecovery":
      return hi("तेज चलकर बचाया समय + अंत में बची देरी = शुरू में गंवाया समय।", "ਤੇਜ਼ ਚੱਲ ਕੇ ਬਚਾਇਆ ਸਮਾਂ + ਅੰਤ ਵਿੱਚ ਬਚੀ ਦੇਰੀ = ਸ਼ੁਰੂ ਵਿੱਚ ਗੁਆਇਆ ਸਮਾਂ।");
    case "startTimeShiftForSameArrival":
      return hi("एक ही आगमन समय के लिए प्रस्थान का बदलाव यात्रा-समय के बदलाव के बराबर होता है।", "ਇੱਕੋ ਪਹੁੰਚ ਸਮੇਂ ਲਈ ਰਵਾਨਗੀ ਦਾ ਬਦਲਾਅ ਸਫ਼ਰ-ਸਮੇਂ ਦੇ ਬਦਲਾਅ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।");
    case "arrivalShiftFromDepartureAndSpeedChanges":
      return hi("प्रस्थान और यात्रा-समय के बदलाव को दिशा सहित जोड़ें; अंत में केवल कुल बदलाव की मात्रा लें।", "ਰਵਾਨਗੀ ਅਤੇ ਸਫ਼ਰ-ਸਮੇਂ ਦੇ ਬਦਲਾਅ ਨੂੰ ਦਿਸ਼ਾ ਸਮੇਤ ਜੋੜੋ; ਅੰਤ ਵਿੱਚ ਸਿਰਫ਼ ਕੁੱਲ ਬਦਲਾਅ ਦੀ ਮਾਤਰਾ ਲਵੋ।");
    case "walkingRidingAllocation":
      return hi("पैदल और सवारी की दूरी तथा समय के दो योग-समीकरण बनाकर लक्ष्य राशि निकालें।", "ਪੈਦਲ ਅਤੇ ਸਵਾਰੀ ਦੀ ਦੂਰੀ ਅਤੇ ਸਮੇਂ ਦੇ ਦੋ ਜੋੜ-ਸਮੀਕਰਨ ਬਣਾ ਕੇ ਲਕਸ਼ਿਤ ਰਾਸ਼ੀ ਕੱਢੋ।");
    default:
      return hi("दिए गए संबंध को इकाइयों सहित लिखें और केवल वही राशि निकालें जो प्रश्न में माँगी गई है।", "ਦਿੱਤੇ ਸੰਬੰਧ ਨੂੰ ਇਕਾਈਆਂ ਸਮੇਤ ਲਿਖੋ ਅਤੇ ਸਿਰਫ਼ ਉਹੀ ਰਾਸ਼ੀ ਕੱਢੋ ਜੋ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਮੰਗੀ ਗਈ ਹੈ।");
  }
}

function optionAnalysis(
  source: TsdCp003EnglishFrozenRecord,
  nativeOptions: readonly string[],
  answerText: string,
  language: TsdCp003NativeLanguage,
): readonly TsdCp003NativeOptionAnalysis[] {
  return Object.freeze(source.optionAudit.map((audit, index) => {
    const option = String.fromCharCode(65 + index) as "A" | "B" | "C" | "D";
    const core = misconceptionReason(audit.misconceptionId, language);
    const reason = audit.isCorrect
      ? core
      : language === "hi"
        ? `${core} इसलिए ${nativeOptions[index]} सही उत्तर नहीं है; सही विधि ${answerText} देती है।`
        : `${core} ਇਸ ਲਈ ${nativeOptions[index]} ਸਹੀ ਉੱਤਰ ਨਹੀਂ ਹੈ; ਸਹੀ ਵਿਧੀ ${answerText} ਦਿੰਦੀ ਹੈ।`;
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
  const stem = frameStem(contextual, language, ordinal);
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
