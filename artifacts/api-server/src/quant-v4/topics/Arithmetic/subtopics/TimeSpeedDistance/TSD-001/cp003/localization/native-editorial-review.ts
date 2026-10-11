import { add, divide, multiply, subtract, type Rational } from "../../foundation/rational";
import type { TsdCp003EnglishFrozenRecord } from "../english-frozen";
import { formatExamNumber } from "../generation-support";
import {
  generateCp003NativePreview,
  type TsdCp003MultilingualPreview,
  type TsdCp003NativePresentation,
} from "./native-runtime";
import {
  assertTsdCp003NativeText,
  formatNativeClock,
  formatNativeDuration,
  formatNativeSolvedValue,
  type TsdCp003NativeLanguage,
} from "./native-language-primitives";

export const TSD_CP003_NATIVE_SELF_REVIEW_STATUS = "EDITORIALLY_REMEDIATED_READY_FOR_PRODUCT_OWNER_REVIEW" as const;

export type TsdCp003NativeEditorialReviewPresentation = TsdCp003NativePresentation & Readonly<{
  nativeReview: Readonly<{
    selfReviewStatus: typeof TSD_CP003_NATIVE_SELF_REVIEW_STATUS;
    humanApprovalRecorded: false;
    multilingualFreezeAuthorized: false;
    sourceMathChanged: false;
  }>;
}>;

export type TsdCp003NativeEditorialReview = Readonly<{
  source: TsdCp003EnglishFrozenRecord;
  presentation: TsdCp003NativeEditorialReviewPresentation;
}>;

const n = (value: Rational): string => formatExamNumber(value);
const km = (value: Rational): string => `${n(value)} km`;
const sp = (value: Rational): string => `${n(value)} km/h`;
const dur = (value: Rational, language: TsdCp003NativeLanguage): string => formatNativeDuration(value, language);

function genericVehicle(stem: string, language: TsdCp003NativeLanguage): string {
  if (language === "hi") {
    return stem.replace(/एक (?:स्कूल बस|डिलीवरी वाहन|टैक्सी|कार|बस|कोच)/gu, "एक वाहन");
  }
  return stem.replace(/ਇੱਕ (?:ਸਕੂਲ ਬੱਸ|ਡਿਲਿਵਰੀ ਵਾਹਨ|ਟੈਕਸੀ|ਕਾਰ|ਬੱਸ|ਕੋਚ)/gu, "ਇੱਕ ਵਾਹਨ");
}

function correctedStem(
  source: TsdCp003EnglishFrozenRecord,
  language: TsdCp003NativeLanguage,
  base: string,
): string {
  const input = source.input;
  const fallback = genericVehicle(base, language);

  switch (input.solveMode) {
    case "distanceFromSpeedTimeDifference":
      return language === "hi"
        ? `${km(source.solution.answer)} के एक निश्चित मार्ग पर ${sp(input.slowerSpeed)} और ${sp(input.fasterSpeed)} की गतियों से यात्रा-समयों का अंतर ${dur(input.timeDifference, language)} है। मार्ग की दूरी ज्ञात कीजिए।`
        : `ਇੱਕ ਨਿਰਧਾਰਤ ਰਸਤੇ ਉੱਤੇ ${sp(input.slowerSpeed)} ਅਤੇ ${sp(input.fasterSpeed)} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਨਾਲ ਸਫ਼ਰ-ਸਮਿਆਂ ਦਾ ਅੰਤਰ ${dur(input.timeDifference, language)} ਹੈ। ਰਸਤੇ ਦੀ ਦੂਰੀ ਕੱਢੋ।`;

    case "speedFromFixedRouteTimeDifference": {
      if (input.representation === "KNOWN_OTHER_SPEED") {
        const relation = input.unknownRole === "FASTER"
          ? (language === "hi" ? "अधिक" : "ਵੱਧ")
          : (language === "hi" ? "कम" : "ਘੱਟ");
        return language === "hi"
          ? `${km(input.distance)} के एक निश्चित मार्ग पर एक गति ${sp(input.knownSpeed)} है। दूसरी ${relation} गति के साथ यात्रा-समयों का अंतर ${dur(input.timeDifference, language)} है। दूसरी गति ज्ञात कीजिए।`
          : `${km(input.distance)} ਦੇ ਇੱਕ ਨਿਰਧਾਰਤ ਰਸਤੇ ਉੱਤੇ ਇੱਕ ਰਫ਼ਤਾਰ ${sp(input.knownSpeed)} ਹੈ। ਦੂਜੀ ${relation} ਰਫ਼ਤਾਰ ਨਾਲ ਸਫ਼ਰ-ਸਮਿਆਂ ਦਾ ਅੰਤਰ ${dur(input.timeDifference, language)} ਹੈ। ਦੂਜੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
      }
      const requested = input.target === "SLOWER"
        ? (language === "hi" ? "कम" : "ਘੱਟ")
        : (language === "hi" ? "अधिक" : "ਵੱਧ");
      return language === "hi"
        ? `${km(input.distance)} के एक निश्चित मार्ग पर दो गतियों का अनुपात ${n(input.slowerRatio)}:${n(input.fasterRatio)} है और यात्रा-समयों का अंतर ${dur(input.timeDifference, language)} है। ${requested} गति ज्ञात कीजिए।`
        : `${km(input.distance)} ਦੇ ਇੱਕ ਨਿਰਧਾਰਤ ਰਸਤੇ ਉੱਤੇ ਦੋ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ${n(input.slowerRatio)}:${n(input.fasterRatio)} ਹੈ ਅਤੇ ਸਫ਼ਰ-ਸਮਿਆਂ ਦਾ ਅੰਤਰ ${dur(input.timeDifference, language)} ਹੈ। ${requested} ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
    }

    case "stoppageDurationFromRunningAndOverallSpeed":
      return language === "hi"
        ? `एक वाहन ${km(input.distance)} की दूरी तय करता है। चलते समय उसकी गति ${sp(input.runningSpeed)} है, जबकि रुकने सहित औसत गति ${sp(input.overallSpeed)} है। कुल रुकने का समय ज्ञात कीजिए।`
        : `ਇੱਕ ਵਾਹਨ ${km(input.distance)} ਦੀ ਦੂਰੀ ਤੈਅ ਕਰਦਾ ਹੈ। ਚੱਲਣ ਸਮੇਂ ਉਸਦੀ ਰਫ਼ਤਾਰ ${sp(input.runningSpeed)} ਹੈ, ਜਦਕਿ ਰੁਕਣ ਸਮੇਤ ਔਸਤ ਰਫ਼ਤਾਰ ${sp(input.overallSpeed)} ਹੈ। ਕੁੱਲ ਰੁਕਣ ਦਾ ਸਮਾਂ ਕੱਢੋ।`;

    case "overallSpeedIncludingStops":
      return language === "hi"
        ? `एक वाहन ${km(input.distance)} की दूरी चलते समय ${sp(input.runningSpeed)} से तय करता है और कुल ${dur(input.totalStopTime, language)} रुकता है। रुकने सहित औसत गति ज्ञात कीजिए।`
        : `ਇੱਕ ਵਾਹਨ ${km(input.distance)} ਦੀ ਦੂਰੀ ਚੱਲਣ ਸਮੇਂ ${sp(input.runningSpeed)} ਨਾਲ ਤੈਅ ਕਰਦਾ ਹੈ ਅਤੇ ਕੁੱਲ ${dur(input.totalStopTime, language)} ਰੁਕਦਾ ਹੈ। ਰੁਕਣ ਸਮੇਤ ਔਸਤ ਰਫ਼ਤਾਰ ਕੱਢੋ।`;

    case "runningSpeedFromOverallSpeedAndStops":
      return language === "hi"
        ? `एक वाहन ${km(input.distance)} की दूरी ${sp(input.overallSpeed)} की रुकने सहित औसत गति से तय करता है और कुल ${dur(input.totalStopTime, language)} रुकता है। चलते समय की गति ज्ञात कीजिए।`
        : `ਇੱਕ ਵਾਹਨ ${km(input.distance)} ਦੀ ਦੂਰੀ ${sp(input.overallSpeed)} ਦੀ ਰੁਕਣ ਸਮੇਤ ਔਸਤ ਰਫ਼ਤਾਰ ਨਾਲ ਤੈਅ ਕਰਦਾ ਹੈ ਅਤੇ ਕੁੱਲ ${dur(input.totalStopTime, language)} ਰੁਕਦਾ ਹੈ। ਚੱਲਣ ਸਮੇਂ ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`;

    case "numberOfStopsFromOverallDelay":
      return language === "hi"
        ? `एक वाहन को रुकने के कारण कुल ${dur(input.totalDelay, language)} की देरी होती है। वह हर बार ${dur(input.stopDuration, language)} रुकता है। वाहन कितनी बार रुका?`
        : `ਇੱਕ ਵਾਹਨ ਨੂੰ ਰੁਕਣ ਕਾਰਨ ਕੁੱਲ ${dur(input.totalDelay, language)} ਦੀ ਦੇਰੀ ਹੁੰਦੀ ਹੈ। ਉਹ ਹਰ ਵਾਰ ${dur(input.stopDuration, language)} ਰੁਕਦਾ ਹੈ। ਵਾਹਨ ਕਿੰਨੀ ਵਾਰ ਰੁਕਿਆ?`;

    case "delayFromRegularStops":
      return language === "hi"
        ? `एक वाहन ${n(input.stopCount)} बार रुकता है और हर बार ${dur(input.stopDuration, language)} रुकता है। रुकने के कारण कुल देरी कितनी होगी?`
        : `ਇੱਕ ਵਾਹਨ ${n(input.stopCount)} ਵਾਰ ਰੁਕਦਾ ਹੈ ਅਤੇ ਹਰ ਵਾਰ ${dur(input.stopDuration, language)} ਰੁਕਦਾ ਹੈ। ਰੁਕਣ ਕਾਰਨ ਕੁੱਲ ਦੇਰੀ ਕਿੰਨੀ ਹੋਵੇਗੀ?`;

    case "totalTimeWithRegularStops":
      return language === "hi"
        ? `एक वाहन का वास्तविक चलने का समय ${dur(input.runningTime, language)} है। वह ${n(input.stopCount)} बार, हर बार ${dur(input.stopDuration, language)} के लिए रुकता है। कुल यात्रा-समय ज्ञात कीजिए।`
        : `ਇੱਕ ਵਾਹਨ ਦਾ ਅਸਲ ਚੱਲਣ ਦਾ ਸਮਾਂ ${dur(input.runningTime, language)} ਹੈ। ਉਹ ${n(input.stopCount)} ਵਾਰ, ਹਰ ਵਾਰ ${dur(input.stopDuration, language)} ਲਈ ਰੁਕਦਾ ਹੈ। ਕੁੱਲ ਸਫ਼ਰ-ਸਮਾਂ ਕੱਢੋ।`;

    case "fractionOfRouteAtChangedSpeed":
      return language === "hi"
        ? `एक वाहन ${km(input.totalDistance)} की दूरी ${dur(input.totalTravelTime, language)} में तय करता है। मार्ग का कुछ भाग ${sp(input.originalSpeed)} और शेष ${sp(input.changedSpeed)} से तय होता है। मार्ग का कितने प्रतिशत भाग बदली हुई गति पर तय हुआ?`
        : `ਇੱਕ ਵਾਹਨ ${km(input.totalDistance)} ਦੀ ਦੂਰੀ ${dur(input.totalTravelTime, language)} ਵਿੱਚ ਤੈਅ ਕਰਦਾ ਹੈ। ਰਸਤੇ ਦਾ ਕੁਝ ਭਾਗ ${sp(input.originalSpeed)} ਅਤੇ ਬਾਕੀ ${sp(input.changedSpeed)} ਨਾਲ ਤੈਅ ਹੁੰਦਾ ਹੈ। ਰਸਤੇ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਭਾਗ ਬਦਲੀ ਰਫ਼ਤਾਰ ਉੱਤੇ ਤੈਅ ਹੋਇਆ?`;

    case "startTimeShiftForSameArrival": {
      const later = input.newSpeed.numerator * input.originalSpeed.denominator > input.originalSpeed.numerator * input.newSpeed.denominator;
      const direction = later
        ? (language === "hi" ? "बाद" : "ਬਾਅਦ")
        : (language === "hi" ? "पहले" : "ਪਹਿਲਾਂ");
      return language === "hi"
        ? `${km(input.distance)} के मार्ग पर गति ${sp(input.originalSpeed)} से बदलकर ${sp(input.newSpeed)} हो जाती है। पहुँचने का समय वही रखना हो तो वाहन को कितनी देर ${direction} चलना शुरू करना चाहिए?`
        : `${km(input.distance)} ਦੇ ਰਸਤੇ ਉੱਤੇ ਰਫ਼ਤਾਰ ${sp(input.originalSpeed)} ਤੋਂ ਬਦਲ ਕੇ ${sp(input.newSpeed)} ਹੋ ਜਾਂਦੀ ਹੈ। ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ ਉਹੀ ਰੱਖਣਾ ਹੋਵੇ ਤਾਂ ਵਾਹਨ ਨੂੰ ਕਿੰਨੀ ਦੇਰ ${direction} ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?`;
    }

    default:
      return fallback;
  }
}

function stopExplanation(
  source: TsdCp003EnglishFrozenRecord,
  language: TsdCp003NativeLanguage,
): TsdCp003NativePresentation["explanation"] | null {
  const input = source.input;
  const sol = source.solution;
  const final = formatNativeSolvedValue(sol.answer, sol.unit, language);
  const C = language === "hi" ? "गणना" : "ਗਣਨਾ";
  const T = language === "hi" ? "अतः" : "ਇਸ ਲਈ";

  switch (input.solveMode) {
    case "stoppageDurationFromRunningAndOverallSpeed": {
      const running = divide(input.distance, input.runningSpeed);
      const total = divide(input.distance, input.overallSpeed);
      return Object.freeze({
        method: language === "hi" ? "समान दूरी के कुल समय में से वास्तविक चलने का समय घटाएँ।" : "ਇੱਕੋ ਦੂਰੀ ਦੇ ਕੁੱਲ ਸਮੇਂ ਵਿੱਚੋਂ ਅਸਲ ਚੱਲਣ ਦਾ ਸਮਾਂ ਘਟਾਓ।",
        steps: Object.freeze([
          `${C}: ${language === "hi" ? "चलने का समय" : "ਚੱਲਣ ਦਾ ਸਮਾਂ"} = ${dur(running, language)}।`,
          `${C}: ${language === "hi" ? "रुकने सहित कुल समय" : "ਰੁਕਣ ਸਮੇਤ ਕੁੱਲ ਸਮਾਂ"} = ${dur(total, language)}।`,
          `${T} ${language === "hi" ? "रुकने का समय" : "ਰੁਕਣ ਦਾ ਸਮਾਂ"} = ${dur(total, language)} − ${dur(running, language)} = ${final}।`,
        ]),
        answer: `${language === "hi" ? "उत्तर" : "ਉੱਤਰ"}: ${final}`,
      });
    }
    case "overallSpeedIncludingStops": {
      const running = divide(input.distance, input.runningSpeed);
      const total = add(running, input.totalStopTime);
      return Object.freeze({
        method: language === "hi" ? "चलने के समय में रुकने का समय जोड़ें और कुल दूरी को कुल समय से भाग दें।" : "ਚੱਲਣ ਦੇ ਸਮੇਂ ਵਿੱਚ ਰੁਕਣ ਦਾ ਸਮਾਂ ਜੋੜੋ ਅਤੇ ਕੁੱਲ ਦੂਰੀ ਨੂੰ ਕੁੱਲ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦਿਓ।",
        steps: Object.freeze([
          `${C}: ${n(input.distance)} ÷ ${n(input.runningSpeed)} = ${dur(running, language)}।`,
          `${C}: ${dur(running, language)} + ${dur(input.totalStopTime, language)} = ${dur(total, language)}।`,
          `${T} ${n(input.distance)} ÷ ${n(total)} = ${final}।`,
        ]),
        answer: `${language === "hi" ? "उत्तर" : "ਉੱਤਰ"}: ${final}`,
      });
    }
    case "runningSpeedFromOverallSpeedAndStops": {
      const total = divide(input.distance, input.overallSpeed);
      const running = subtract(total, input.totalStopTime);
      return Object.freeze({
        method: language === "hi" ? "रुकने सहित कुल समय में से रुकने का समय घटाकर वास्तविक चलने का समय निकालें।" : "ਰੁਕਣ ਸਮੇਤ ਕੁੱਲ ਸਮੇਂ ਵਿੱਚੋਂ ਰੁਕਣ ਦਾ ਸਮਾਂ ਘਟਾ ਕੇ ਅਸਲ ਚੱਲਣ ਦਾ ਸਮਾਂ ਕੱਢੋ।",
        steps: Object.freeze([
          `${C}: ${n(input.distance)} ÷ ${n(input.overallSpeed)} = ${dur(total, language)}।`,
          `${C}: ${dur(total, language)} − ${dur(input.totalStopTime, language)} = ${dur(running, language)}।`,
          `${T} ${n(input.distance)} ÷ ${n(running)} = ${final}।`,
        ]),
        answer: `${language === "hi" ? "उत्तर" : "ਉੱਤਰ"}: ${final}`,
      });
    }
    case "numberOfStopsFromOverallDelay":
      return Object.freeze({
        method: language === "hi" ? "कुल देरी को एक बार रुकने के समय से भाग दें।" : "ਕੁੱਲ ਦੇਰੀ ਨੂੰ ਇੱਕ ਵਾਰ ਰੁਕਣ ਦੇ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦਿਓ।",
        steps: Object.freeze([`${C}: ${dur(input.totalDelay, language)} ÷ ${dur(input.stopDuration, language)} = ${final}।`]),
        answer: `${language === "hi" ? "उत्तर" : "ਉੱਤਰ"}: ${final}`,
      });
    case "delayFromRegularStops":
      return Object.freeze({
        method: language === "hi" ? "रुकने की संख्या को हर बार रुकने के समय से गुणा करें।" : "ਰੁਕਣ ਦੀ ਗਿਣਤੀ ਨੂੰ ਹਰ ਵਾਰ ਰੁਕਣ ਦੇ ਸਮੇਂ ਨਾਲ ਗੁਣਾ ਕਰੋ।",
        steps: Object.freeze([`${C}: ${n(input.stopCount)} × ${dur(input.stopDuration, language)} = ${final}।`]),
        answer: `${language === "hi" ? "उत्तर" : "ਉੱਤਰ"}: ${final}`,
      });
    case "totalTimeWithRegularStops": {
      const stopped = multiply(input.stopCount, input.stopDuration);
      return Object.freeze({
        method: language === "hi" ? "सभी बार रुकने का कुल समय निकालकर उसे वास्तविक चलने के समय में जोड़ें।" : "ਸਾਰੀਆਂ ਵਾਰਾਂ ਦੇ ਰੁਕਣ ਦਾ ਕੁੱਲ ਸਮਾਂ ਕੱਢ ਕੇ ਉਸਨੂੰ ਅਸਲ ਚੱਲਣ ਦੇ ਸਮੇਂ ਵਿੱਚ ਜੋੜੋ।",
        steps: Object.freeze([
          `${C}: ${n(input.stopCount)} × ${dur(input.stopDuration, language)} = ${dur(stopped, language)}।`,
          `${C}: ${dur(input.runningTime, language)} + ${dur(stopped, language)} = ${final}।`,
        ]),
        answer: `${language === "hi" ? "उत्तर" : "ਉੱਤਰ"}: ${final}`,
      });
    }
    default:
      return null;
  }
}

function correctedExplanation(
  source: TsdCp003EnglishFrozenRecord,
  language: TsdCp003NativeLanguage,
  base: TsdCp003NativePresentation["explanation"],
): TsdCp003NativePresentation["explanation"] {
  const stop = stopExplanation(source, language);
  if (stop) return stop;

  if (source.input.solveMode === "distanceFromSpeedTimeDifference") {
    const input = source.input;
    const final = formatNativeSolvedValue(source.solution.answer, source.solution.unit, language);
    return Object.freeze({
      method: language === "hi"
        ? "एक ही दूरी के लिए समय का अंतर = दूरी × (1/कम गति − 1/अधिक गति)।"
        : "ਇੱਕੋ ਦੂਰੀ ਲਈ ਸਮੇਂ ਦਾ ਅੰਤਰ = ਦੂਰੀ × (1/ਘੱਟ ਰਫ਼ਤਾਰ − 1/ਵੱਧ ਰਫ਼ਤਾਰ)।",
      steps: Object.freeze([
        `${language === "hi" ? "गणना" : "ਗਣਨਾ"}: ${dur(input.timeDifference, language)} ÷ (1/${n(input.slowerSpeed)} − 1/${n(input.fasterSpeed)}) = ${final}।`,
      ]),
      answer: `${language === "hi" ? "उत्तर" : "ਉੱਤਰ"}: ${final}`,
    });
  }

  const normalize = (text: string): string => {
    if (language === "hi") return text.replace(/मांगी/gu, "माँगी");
    return text.replace(/ਪਰਿਮਾਣ/gu, "ਬਦਲਾਅ ਦੀ ਮਾਤਰਾ");
  };
  return Object.freeze({
    method: normalize(base.method),
    steps: Object.freeze(base.steps.map(normalize)),
    answer: normalize(base.answer),
  });
}

function remediate(entry: TsdCp003MultilingualPreview): TsdCp003NativeEditorialReview {
  const { source, presentation } = entry;
  const stem = correctedStem(source, presentation.language, presentation.stem);
  const explanation = correctedExplanation(source, presentation.language, presentation.explanation);
  assertTsdCp003NativeText(stem, presentation.language, `${presentation.questionLanguageId}/review-stem`);
  assertTsdCp003NativeText(explanation.method, presentation.language, `${presentation.questionLanguageId}/review-method`);
  for (const [index, step] of explanation.steps.entries()) {
    assertTsdCp003NativeText(step, presentation.language, `${presentation.questionLanguageId}/review-step-${index + 1}`);
  }
  assertTsdCp003NativeText(explanation.answer, presentation.language, `${presentation.questionLanguageId}/review-answer`);

  return Object.freeze({
    source,
    presentation: Object.freeze({
      ...presentation,
      stem,
      explanation,
      nativeReview: Object.freeze({
        selfReviewStatus: TSD_CP003_NATIVE_SELF_REVIEW_STATUS,
        humanApprovalRecorded: false as const,
        multilingualFreezeAuthorized: false as const,
        sourceMathChanged: false as const,
      }),
    }),
  });
}

export function generateCp003NativeEditorialReview(
  language: TsdCp003NativeLanguage,
): readonly TsdCp003NativeEditorialReview[] {
  return Object.freeze(generateCp003NativePreview(language).map(remediate));
}

export function generateCp003AllNativeEditorialReview(): readonly TsdCp003NativeEditorialReview[] {
  return Object.freeze([
    ...generateCp003NativeEditorialReview("hi"),
    ...generateCp003NativeEditorialReview("pa"),
  ]);
}
