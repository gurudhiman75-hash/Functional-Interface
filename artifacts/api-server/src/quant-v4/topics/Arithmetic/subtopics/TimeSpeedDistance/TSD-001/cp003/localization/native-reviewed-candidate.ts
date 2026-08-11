import { absRational, divide, multiply, rational, subtract, type Rational } from "../../foundation/rational";
import { formatExamNumber } from "../generation-support";
import {
  generateCp003AllNativeEditorialReview,
  generateCp003NativeEditorialReview,
  type TsdCp003NativeEditorialReview,
} from "./native-editorial-review";
import {
  formatNativeDuration,
  formatNativeSolvedValue,
  type TsdCp003NativeLanguage,
} from "./native-language-primitives";

export const TSD_CP003_NATIVE_REVIEW_CANDIDATE_STATUS = "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW" as const;

export type TsdCp003ReviewedNativeCandidate = TsdCp003NativeEditorialReview & Readonly<{
  reviewCandidate: Readonly<{
    status: typeof TSD_CP003_NATIVE_REVIEW_CANDIDATE_STATUS;
    selfReviewBlockers: 0;
    productOwnerApprovalRecorded: false;
    multilingualFreezeAuthorized: false;
  }>;
}>;

function exactNativeDuration(value: Rational, language: TsdCp003NativeLanguage): string {
  const seconds = multiply(value, rational(3600));
  if (seconds.denominator !== 1n) return formatNativeDuration(value, language);

  const totalSeconds = Number(seconds.numerator);
  const sign = totalSeconds < 0 ? "-" : "";
  const absolute = Math.abs(totalSeconds);
  const hours = Math.floor(absolute / 3600);
  const minutes = Math.floor((absolute % 3600) / 60);
  const remainingSeconds = absolute % 60;
  const parts: string[] = [];
  if (hours > 0) {
    const unit = language === "hi"
      ? (hours === 1 ? "घंटा" : "घंटे")
      : (hours === 1 ? "ਘੰਟਾ" : "ਘੰਟੇ");
    parts.push(`${hours} ${unit}`);
  }
  if (minutes > 0) parts.push(`${minutes} ${language === "hi" ? "मिनट" : "ਮਿੰਟ"}`);
  if (remainingSeconds > 0) parts.push(`${remainingSeconds} ${language === "hi" ? "सेकंड" : "ਸਕਿੰਟ"}`);
  if (parts.length === 0) parts.push(`0 ${language === "hi" ? "मिनट" : "ਮਿੰਟ"}`);
  return `${sign}${parts.join(" ")}`;
}

function closeKnownSelfReviewBlockers(entry: TsdCp003NativeEditorialReview): TsdCp003ReviewedNativeCandidate {
  const { source, presentation } = entry;
  const language = presentation.language;
  let stem = presentation.stem;
  let explanation = presentation.explanation;

  if (language === "hi" && source.input.solveMode === "distanceFromSpeedTimeDifference") {
    const input = source.input;
    stem = `एक निश्चित मार्ग पर ${formatExamNumber(input.slowerSpeed)} km/h और ${formatExamNumber(input.fasterSpeed)} km/h की गतियों से यात्रा-समयों का अंतर ${formatNativeDuration(input.timeDifference, language)} है। मार्ग की दूरी ज्ञात कीजिए।`;
  }

  if (source.input.solveMode === "restTimeInRepeatedTravelRestCycle") {
    const input = source.input;
    stem = language === "hi"
      ? `एक यात्री ${formatExamNumber(input.cycleCount)} समान यात्रा-खंड पूरे करता है। प्रत्येक यात्रा-खंड में ${formatNativeDuration(input.travelTimePerCycle, language)} लगते हैं। इनके बीच ${formatExamNumber(input.restEvents)} समान विश्राम हैं और कुल समय ${formatNativeDuration(input.totalElapsedTime, language)} है। एक विश्राम की अवधि ज्ञात कीजिए।`
      : `ਇੱਕ ਯਾਤਰੀ ${formatExamNumber(input.cycleCount)} ਬਰਾਬਰ ਸਫ਼ਰ-ਭਾਗ ਪੂਰੇ ਕਰਦਾ ਹੈ। ਹਰ ਸਫ਼ਰ-ਭਾਗ ਵਿੱਚ ${formatNativeDuration(input.travelTimePerCycle, language)} ਲੱਗਦੇ ਹਨ। ਇਨ੍ਹਾਂ ਵਿਚਕਾਰ ${formatExamNumber(input.restEvents)} ਬਰਾਬਰ ਆਰਾਮ ਹਨ ਅਤੇ ਕੁੱਲ ਸਮਾਂ ${formatNativeDuration(input.totalElapsedTime, language)} ਹੈ। ਇੱਕ ਆਰਾਮ ਦੀ ਮਿਆਦ ਕੱਢੋ।`;
  }

  if (source.input.solveMode === "requiredRemainingSpeedAfterPartialRoute") {
    const input = source.input;
    const completedTime = divide(input.completedDistance, input.completedSpeed);
    const remainingTime = subtract(input.scheduledTotalTime, completedTime);
    const remainingDistance = subtract(input.totalDistance, input.completedDistance);
    const remainingMinutes = multiply(remainingTime, rational(60));
    const final = formatNativeSolvedValue(source.solution.answer, source.solution.unit, language);
    explanation = Object.freeze({
      method: language === "hi"
        ? "पहले भाग में लगा समय निकालें। फिर निर्धारित कुल समय और कुल दूरी में से इस्तेमाल हुआ समय और तय दूरी घटाएँ।"
        : "ਪਹਿਲੇ ਭਾਗ ਵਿੱਚ ਲੱਗਿਆ ਸਮਾਂ ਕੱਢੋ। ਫਿਰ ਨਿਰਧਾਰਤ ਕੁੱਲ ਸਮੇਂ ਅਤੇ ਕੁੱਲ ਦੂਰੀ ਵਿੱਚੋਂ ਲੱਗਿਆ ਸਮਾਂ ਅਤੇ ਤੈਅ ਦੂਰੀ ਘਟਾਓ।",
      steps: Object.freeze([
        `${language === "hi" ? "गणना" : "ਗਣਨਾ"}: ${formatExamNumber(input.completedDistance)} ÷ ${formatExamNumber(input.completedSpeed)} = ${exactNativeDuration(completedTime, language)}।`,
        `${language === "hi" ? "गणना" : "ਗਣਨਾ"}: ${language === "hi" ? "शेष समय" : "ਬਾਕੀ ਸਮਾਂ"} = ${exactNativeDuration(remainingTime, language)}, ${language === "hi" ? "शेष दूरी" : "ਬਾਕੀ ਦੂਰੀ"} = ${formatExamNumber(remainingDistance)} km।`,
        `${language === "hi" ? "अतः" : "ਇਸ ਲਈ"} ${language === "hi" ? "आवश्यक गति" : "ਲੋੜੀਂਦੀ ਰਫ਼ਤਾਰ"} = ${formatExamNumber(remainingDistance)} × 60 ÷ ${formatExamNumber(remainingMinutes)} = ${final}।`,
      ]),
      answer: `${language === "hi" ? "उत्तर" : "ਉੱਤਰ"}: ${final}`,
    });
  }

  if (source.input.solveMode === "arrivalShiftFromDepartureAndSpeedChanges") {
    const oldTime = source.solution.intermediate.originalTravelTime!;
    const newTime = source.solution.intermediate.newTravelTime!;
    const signedShift = source.solution.intermediate.signedArrivalShift!;
    const magnitude = absRational(signedShift);
    const direction = signedShift.numerator < 0n
      ? (language === "hi" ? "पहले" : "ਪਹਿਲਾਂ")
      : (language === "hi" ? "बाद" : "ਬਾਅਦ");
    const final = formatNativeSolvedValue(source.solution.answer, source.solution.unit, language);
    explanation = Object.freeze({
      method: language === "hi"
        ? "प्रस्थान-समय के बदलाव और यात्रा-समय के बदलाव को दिशा सहित जोड़ें। फिर पहुँचने के समय में हुए कुल बदलाव की मात्रा लें।"
        : "ਰਵਾਨਗੀ-ਸਮੇਂ ਦੇ ਬਦਲਾਅ ਅਤੇ ਸਫ਼ਰ-ਸਮੇਂ ਦੇ ਬਦਲਾਅ ਨੂੰ ਦਿਸ਼ਾ ਸਮੇਤ ਜੋੜੋ। ਫਿਰ ਪਹੁੰਚਣ ਦੇ ਸਮੇਂ ਵਿੱਚ ਹੋਏ ਕੁੱਲ ਬਦਲਾਅ ਦੀ ਮਾਤਰਾ ਲਵੋ।",
      steps: Object.freeze([
        `${language === "hi" ? "गणना" : "ਗਣਨਾ"}: ${language === "hi" ? "पुराना यात्रा-समय" : "ਪੁਰਾਣਾ ਸਫ਼ਰ-ਸਮਾਂ"} = ${formatNativeDuration(oldTime, language)}, ${language === "hi" ? "नया यात्रा-समय" : "ਨਵਾਂ ਸਫ਼ਰ-ਸਮਾਂ"} = ${formatNativeDuration(newTime, language)}।`,
        `${language === "hi" ? "गणना" : "ਗਣਨਾ"}: ${language === "hi" ? "पहुँचने का समय" : "ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ"} ${formatNativeDuration(magnitude, language)} ${direction} ${language === "hi" ? "खिसकता है" : "ਖਿਸਕਦਾ ਹੈ"}।`,
        `${language === "hi" ? "अतः कुल बदलाव" : "ਇਸ ਲਈ ਕੁੱਲ ਬਦਲਾਅ"} = ${final}।`,
      ]),
      answer: `${language === "hi" ? "उत्तर" : "ਉੱਤਰ"}: ${final}`,
    });
  }

  return Object.freeze({
    source,
    presentation: Object.freeze({ ...presentation, stem, explanation }),
    reviewCandidate: Object.freeze({
      status: TSD_CP003_NATIVE_REVIEW_CANDIDATE_STATUS,
      selfReviewBlockers: 0 as const,
      productOwnerApprovalRecorded: false as const,
      multilingualFreezeAuthorized: false as const,
    }),
  });
}

export function generateCp003ReviewedNativeCandidate(
  language: TsdCp003NativeLanguage,
): readonly TsdCp003ReviewedNativeCandidate[] {
  return Object.freeze(generateCp003NativeEditorialReview(language).map(closeKnownSelfReviewBlockers));
}

export function generateCp003AllReviewedNativeCandidates(): readonly TsdCp003ReviewedNativeCandidate[] {
  return Object.freeze(generateCp003AllNativeEditorialReview().map(closeKnownSelfReviewBlockers));
}