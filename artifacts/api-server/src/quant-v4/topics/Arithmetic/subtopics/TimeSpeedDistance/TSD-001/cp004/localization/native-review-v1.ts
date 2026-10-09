import { add, divide, multiply, subtract, type Rational } from "../../foundation/rational";
import { TSD_CP004_APPROVED_ENGLISH_FROZEN_60Q } from "../english-approved-freeze";
import type { TsdCp004CoreInput, TsdCp004CoreSolveMode } from "../relative-motion-foundation";
import type { TsdCp004Difficulty } from "../runtime-types";
import {
  cp004LocalizeOption,
  cp004NativeClock,
  cp004NativeDuration,
  cp004NativeNumber,
  type TsdCp004NativeLanguage,
} from "./native-primitives-v1";

type NativeExplanation = Readonly<{
  method: string;
  steps: readonly string[];
  shortcut: string;
  finalAnswer: string;
}>;

export interface TsdCp004NativeReviewRow {
  readonly checkpointId: "TSD-CP-004";
  readonly permanentQlId: `TSD-QL-${string}`;
  readonly authorityKey: string;
  readonly solveMode: TsdCp004CoreSolveMode;
  readonly representation: string;
  readonly context: string;
  readonly language: TsdCp004NativeLanguage;
  readonly difficulty: TsdCp004Difficulty;
  readonly stem: string;
  readonly input: TsdCp004CoreInput;
  readonly solution: (typeof TSD_CP004_APPROVED_ENGLISH_FROZEN_60Q)[number]["solution"];
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answerText: string;
  readonly explanation: NativeExplanation;
  readonly mathematicalFingerprint: string;
  readonly parity: Readonly<{
    englishIndex: number;
    englishSeed: string;
    sourceStem: string;
    sourceAnswerText: string;
  }>;
  readonly lifecycle: Readonly<{
    englishFreezeStatus: "FROZEN";
    nativeReviewStatus: "NATIVE_REVIEW_CANDIDATE";
    multilingualFreezeStatus: "UNFROZEN";
    questionStudioEnabled: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}

const q = (language: TsdCp004NativeLanguage, hi: string, pa: string) => language === "hi" ? hi : pa;
const n = cp004NativeNumber;
const speed = (value: Rational | undefined) => `${n(value)} km/h`;
const km = (value: Rational | undefined) => `${n(value)} km`;

function ask(language: TsdCp004NativeLanguage, variant: number, hi: string, pa: string): string {
  const base = q(language, hi, pa);
  const tails = language === "hi"
    ? [" ज्ञात कीजिए।", " कितना होगा?", " निर्धारित कीजिए।", " निकालिए।"]
    : [" ਪਤਾ ਕਰੋ।", " ਕਿੰਨਾ ਹੋਵੇਗਾ?", " ਨਿਰਧਾਰਤ ਕਰੋ।", " ਕੱਢੋ।"];
  return `${base}${tails[variant % tails.length]}`;
}

function direction(language: TsdCp004NativeLanguage, same: boolean): string {
  return same
    ? q(language, "एक ही दिशा में", "ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ")
    : q(language, "एक-दूसरे की ओर", "ਇੱਕ-ਦੂਜੇ ਵੱਲ");
}

function nativeStem(
  solveMode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  language: TsdCp004NativeLanguage,
  variant: number,
): string {
  const same = input.directionCase === "SAME";
  switch (solveMode) {
    case "findRelativeSpeedOppositeDirections":
      return ask(language, variant,
        `दो वाहन ${speed(input.speedA)} और ${speed(input.speedB)} की गति से विपरीत दिशाओं में चल रहे हैं। उनके बीच की दूरी बदलने की दर`,
        `ਦੋ ਵਾਹਨ ${speed(input.speedA)} ਅਤੇ ${speed(input.speedB)} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਵਿਰੁੱਧ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਚੱਲ ਰਹੇ ਹਨ। ਉਨ੍ਹਾਂ ਵਿਚਕਾਰ ਦੂਰੀ ਬਦਲਣ ਦੀ ਦਰ`);
    case "findRelativeSpeedSameDirection":
      return ask(language, variant,
        `दो वाहन एक ही दिशा में ${speed(input.speedA)} और ${speed(input.speedB)} की गति से चल रहे हैं। तेज वाहन द्वारा दूरी घटाने की दर`,
        `ਦੋ ਵਾਹਨ ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ${speed(input.speedA)} ਅਤੇ ${speed(input.speedB)} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲ ਰਹੇ ਹਨ। ਤੇਜ਼ ਵਾਹਨ ਵੱਲੋਂ ਫ਼ਾਸਲਾ ਘਟਾਉਣ ਦੀ ਦਰ`);
    case "findMeetingTimeFromInitialSeparation":
      return ask(language, variant,
        `दो वाहन ${km(input.initialSeparation)} दूर हैं और ${direction(language, same)} ${speed(input.speedA)} तथा ${speed(input.speedB)} की गति से चलते हैं। मिलने में लगने वाला समय`,
        `ਦੋ ਵਾਹਨਾਂ ਵਿਚਕਾਰ ${km(input.initialSeparation)} ਦਾ ਫ਼ਾਸਲਾ ਹੈ ਅਤੇ ਉਹ ${direction(language, same)} ${speed(input.speedA)} ਅਤੇ ${speed(input.speedB)} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦੇ ਹਨ। ਮਿਲਣ ਲਈ ਲੱਗਣ ਵਾਲਾ ਸਮਾਂ`);
    case "findCatchUpTimeFromHeadStartDistance":
      return ask(language, variant,
        `धीमे वाहन को ${km(input.headStartDistance)} की बढ़त है। उसकी गति ${speed(input.speedB)} और पीछा करने वाले वाहन की गति ${speed(input.speedA)} है। पकड़ने में लगने वाला समय`,
        `ਹੌਲੇ ਵਾਹਨ ਨੂੰ ${km(input.headStartDistance)} ਦੀ ਬੜ੍ਹਤ ਹੈ। ਉਸ ਦੀ ਰਫ਼ਤਾਰ ${speed(input.speedB)} ਅਤੇ ਪਿੱਛਾ ਕਰਨ ਵਾਲੇ ਵਾਹਨ ਦੀ ਰਫ਼ਤਾਰ ${speed(input.speedA)} ਹੈ। ਫੜਨ ਲਈ ਲੱਗਣ ਵਾਲਾ ਸਮਾਂ`);
    case "findInitialSeparationFromMeetingTime":
    case "findUnknownStartPointGap":
      return ask(language, variant,
        `दो वाहन ${direction(language, same)} ${speed(input.speedA)} और ${speed(input.speedB)} की गति से चलते हुए ${cp004NativeDuration(input.meetingTime, language)} बाद मिलते हैं। प्रारंभिक दूरी`,
        `ਦੋ ਵਾਹਨ ${direction(language, same)} ${speed(input.speedA)} ਅਤੇ ${speed(input.speedB)} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦੇ ਹੋਏ ${cp004NativeDuration(input.meetingTime, language)} ਬਾਅਦ ਮਿਲਦੇ ਹਨ। ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲਾ`);
    case "findHeadStartDistanceFromCatchUpTime":
      return ask(language, variant,
        `${speed(input.speedA)} की गति वाला वाहन ${speed(input.speedB)} की गति वाले वाहन को ${cp004NativeDuration(input.meetingTime, language)} में पकड़ता है। प्रारंभिक बढ़त`,
        `${speed(input.speedA)} ਦੀ ਰਫ਼ਤਾਰ ਵਾਲਾ ਵਾਹਨ ${speed(input.speedB)} ਦੀ ਰਫ਼ਤਾਰ ਵਾਲੇ ਵਾਹਨ ਨੂੰ ${cp004NativeDuration(input.meetingTime, language)} ਵਿੱਚ ਫੜ ਲੈਂਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਬੜ੍ਹਤ`);
    case "findRelativeDistanceCoveredInGivenTime":
      return ask(language, variant,
        `दो वाहन ${direction(language, same)} ${speed(input.speedA)} और ${speed(input.speedB)} की गति से ${cp004NativeDuration(input.elapsedTime, language)} तक चलते हैं। इस समय में सापेक्ष दूरी`,
        `ਦੋ ਵਾਹਨ ${direction(language, same)} ${speed(input.speedA)} ਅਤੇ ${speed(input.speedB)} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ${cp004NativeDuration(input.elapsedTime, language)} ਤੱਕ ਚੱਲਦੇ ਹਨ। ਇਸ ਸਮੇਂ ਵਿੱਚ ਸਾਪੇਖ ਦੂਰੀ`);
    case "findRelativeSpeedFromMeetingTime":
      return ask(language, variant,
        `${km(input.initialSeparation)} की दूरी ${cp004NativeDuration(input.meetingTime, language)} में समाप्त होती है। आवश्यक सापेक्ष गति`,
        `${km(input.initialSeparation)} ਦਾ ਫ਼ਾਸਲਾ ${cp004NativeDuration(input.meetingTime, language)} ਵਿੱਚ ਖਤਮ ਹੁੰਦਾ ਹੈ। ਲੋੜੀਂਦੀ ਸਾਪੇਖ ਰਫ਼ਤਾਰ`);
    case "findIndividualSpeedFromRelativeSpeedAndOtherSpeed":
      return ask(language, variant,
        `दो वाहनों की सापेक्ष गति ${speed(input.relativeSpeed)} है और ज्ञात वाहन की गति ${speed(input.speedB ?? input.speedA)} है। अज्ञात वाहन की गति`,
        `ਦੋ ਵਾਹਨਾਂ ਦੀ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ${speed(input.relativeSpeed)} ਹੈ ਅਤੇ ਜਾਣੇ ਵਾਹਨ ਦੀ ਰਫ਼ਤਾਰ ${speed(input.speedB ?? input.speedA)} ਹੈ। ਅਣਜਾਣ ਵਾਹਨ ਦੀ ਰਫ਼ਤਾਰ`);
    case "findFasterSpeedFromCatchUpState":
      return ask(language, variant,
        `धीमे वाहन की गति ${speed(input.speedB)} है। ${km(input.headStartDistance)} की बढ़त ${cp004NativeDuration(input.meetingTime, language)} में समाप्त होती है। तेज वाहन की गति`,
        `ਹੌਲੇ ਵਾਹਨ ਦੀ ਰਫ਼ਤਾਰ ${speed(input.speedB)} ਹੈ। ${km(input.headStartDistance)} ਦੀ ਬੜ੍ਹਤ ${cp004NativeDuration(input.meetingTime, language)} ਵਿੱਚ ਖਤਮ ਹੁੰਦੀ ਹੈ। ਤੇਜ਼ ਵਾਹਨ ਦੀ ਰਫ਼ਤਾਰ`);
    case "findSlowerSpeedFromCatchUpState":
      return ask(language, variant,
        `तेज वाहन की गति ${speed(input.speedA)} है। वह ${km(input.headStartDistance)} की बढ़त ${cp004NativeDuration(input.meetingTime, language)} में समाप्त करता है। धीमे वाहन की गति`,
        `ਤੇਜ਼ ਵਾਹਨ ਦੀ ਰਫ਼ਤਾਰ ${speed(input.speedA)} ਹੈ। ਉਹ ${km(input.headStartDistance)} ਦੀ ਬੜ੍ਹਤ ${cp004NativeDuration(input.meetingTime, language)} ਵਿੱਚ ਖਤਮ ਕਰਦਾ ਹੈ। ਹੌਲੇ ਵਾਹਨ ਦੀ ਰਫ਼ਤਾਰ`);
    case "findDelayedStartCatchUpTime":
      return ask(language, variant,
        `धीमा वाहन ${speed(input.speedB)} की गति से पहले चल पड़ता है। तेज वाहन ${cp004NativeDuration(input.startDelay, language)} बाद ${speed(input.speedA)} की गति से उसका पीछा करता है। तेज वाहन के चलने के बाद पकड़ने में लगने वाला समय`,
        `ਹੌਲਾ ਵਾਹਨ ${speed(input.speedB)} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਪਹਿਲਾਂ ਚੱਲ ਪੈਂਦਾ ਹੈ। ਤੇਜ਼ ਵਾਹਨ ${cp004NativeDuration(input.startDelay, language)} ਬਾਅਦ ${speed(input.speedA)} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਉਸ ਦਾ ਪਿੱਛਾ ਕਰਦਾ ਹੈ। ਤੇਜ਼ ਵਾਹਨ ਦੇ ਚੱਲਣ ਤੋਂ ਬਾਅਦ ਫੜਨ ਲਈ ਲੱਗਣ ਵਾਲਾ ਸਮਾਂ`);
    case "findStartDelayFromCatchUpState":
      return ask(language, variant,
        `${speed(input.speedA)} की गति वाला वाहन, ${speed(input.speedB)} की गति वाले वाहन को पीछा शुरू करने के ${cp004NativeDuration(input.meetingTime, language)} बाद पकड़ता है। धीमे वाहन की प्रारंभिक समय-बढ़त`,
        `${speed(input.speedA)} ਦੀ ਰਫ਼ਤਾਰ ਵਾਲਾ ਵਾਹਨ, ${speed(input.speedB)} ਦੀ ਰਫ਼ਤਾਰ ਵਾਲੇ ਵਾਹਨ ਨੂੰ ਪਿੱਛਾ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ${cp004NativeDuration(input.meetingTime, language)} ਬਾਅਦ ਫੜਦਾ ਹੈ। ਹੌਲੇ ਵਾਹਨ ਦੀ ਸ਼ੁਰੂਆਤੀ ਸਮੇਂ ਦੀ ਬੜ੍ਹਤ`);
    case "findSeparationAfterMovingApart":
      return ask(language, variant,
        `दो वाहन ${km(input.initialSeparation)} दूर हैं और विपरीत दिशाओं में ${speed(input.speedA)} तथा ${speed(input.speedB)} की गति से ${cp004NativeDuration(input.elapsedTime, language)} चलते हैं। बाद की दूरी`,
        `ਦੋ ਵਾਹਨ ${km(input.initialSeparation)} ਦੂਰ ਹਨ ਅਤੇ ਵਿਰੁੱਧ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ${speed(input.speedA)} ਅਤੇ ${speed(input.speedB)} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ${cp004NativeDuration(input.elapsedTime, language)} ਚੱਲਦੇ ਹਨ। ਬਾਅਦ ਦਾ ਫ਼ਾਸਲਾ`);
    case "findInitialGapFromLaterSeparation":
      return ask(language, variant,
        `दो वाहन विपरीत दिशाओं में ${speed(input.speedA)} और ${speed(input.speedB)} की गति से ${cp004NativeDuration(input.elapsedTime, language)} चलते हैं और बाद में उनके बीच ${km(input.specifiedSeparation)} की दूरी है। प्रारंभिक दूरी`,
        `ਦੋ ਵਾਹਨ ਵਿਰੁੱਧ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ${speed(input.speedA)} ਅਤੇ ${speed(input.speedB)} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ${cp004NativeDuration(input.elapsedTime, language)} ਚੱਲਦੇ ਹਨ ਅਤੇ ਬਾਅਦ ਵਿੱਚ ਉਨ੍ਹਾਂ ਵਿਚਕਾਰ ${km(input.specifiedSeparation)} ਦਾ ਫ਼ਾਸਲਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲਾ`);
    case "findTimeUntilSpecifiedSeparation":
      return ask(language, variant,
        `दो वाहनों के बीच प्रारंभिक दूरी ${km(input.initialSeparation)} है। वे ${direction(language, same)} ${speed(input.speedA)} और ${speed(input.speedB)} की गति से चलते हैं। दूरी ${km(input.specifiedSeparation)} होने में लगने वाला समय`,
        `ਦੋ ਵਾਹਨਾਂ ਵਿਚਕਾਰ ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲਾ ${km(input.initialSeparation)} ਹੈ। ਉਹ ${direction(language, same)} ${speed(input.speedA)} ਅਤੇ ${speed(input.speedB)} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦੇ ਹਨ। ਫ਼ਾਸਲਾ ${km(input.specifiedSeparation)} ਹੋਣ ਲਈ ਲੱਗਣ ਵਾਲਾ ਸਮਾਂ`);
    case "findMeetingPointDistanceSplit":
      return ask(language, variant,
        `${km(input.routeDistance)} लंबे मार्ग के दोनों सिरों से दो वाहन ${speed(input.speedA)} और ${speed(input.speedB)} की गति से एक साथ चलते हैं। पहले सिरे से मिलने के बिंदु की दूरी`,
        `${km(input.routeDistance)} ਲੰਮੇ ਰਸਤੇ ਦੇ ਦੋਵੇਂ ਸਿਰਿਆਂ ਤੋਂ ਦੋ ਵਾਹਨ ${speed(input.speedA)} ਅਤੇ ${speed(input.speedB)} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ। ਪਹਿਲੇ ਸਿਰੇ ਤੋਂ ਮਿਲਣ ਵਾਲੇ ਬਿੰਦੂ ਦੀ ਦੂਰੀ`);
    case "findMeetingPointFromSpeedRatio":
      return ask(language, variant,
        `${km(input.routeDistance)} लंबे मार्ग पर दो वाहनों की गति का अनुपात ${n(input.ratioA)}:${n(input.ratioB)} है। दोनों विपरीत सिरों से एक साथ चलते हैं। पहले सिरे से मिलने के बिंदु की दूरी`,
        `${km(input.routeDistance)} ਲੰਮੇ ਰਸਤੇ ਉੱਤੇ ਦੋ ਵਾਹਨਾਂ ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ${n(input.ratioA)}:${n(input.ratioB)} ਹੈ। ਦੋਵੇਂ ਵਿਰੁੱਧ ਸਿਰਿਆਂ ਤੋਂ ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ। ਪਹਿਲੇ ਸਿਰੇ ਤੋਂ ਮਿਲਣ ਵਾਲੇ ਬਿੰਦੂ ਦੀ ਦੂਰੀ`);
    case "findSpeedRatioFromMeetingPoint":
      return ask(language, variant,
        `दो वाहन विपरीत सिरों से एक साथ चलकर पहली बार मिलते हैं। उन्होंने क्रमशः ${km(input.distanceA)} और ${km(input.distanceB)} दूरी तय की। उनकी गतियों का अनुपात`,
        `ਦੋ ਵਾਹਨ ਵਿਰੁੱਧ ਸਿਰਿਆਂ ਤੋਂ ਇਕੱਠੇ ਚੱਲ ਕੇ ਪਹਿਲੀ ਵਾਰ ਮਿਲਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਨੇ ਕ੍ਰਮਵਾਰ ${km(input.distanceA)} ਅਤੇ ${km(input.distanceB)} ਦੂਰੀ ਤੈਅ ਕੀਤੀ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ`);
    case "findMeetingClockTime":
      return ask(language, variant,
        `दो वाहन ${cp004NativeClock(input.departureMinute, language)} पर ${km(input.initialSeparation)} की दूरी से ${direction(language, same)} ${speed(input.speedA)} और ${speed(input.speedB)} की गति से चलते हैं। मिलने का समय`,
        `ਦੋ ਵਾਹਨ ${cp004NativeClock(input.departureMinute, language)} ਵਜੇ ${km(input.initialSeparation)} ਦੇ ਫ਼ਾਸਲੇ ਤੋਂ ${direction(language, same)} ${speed(input.speedA)} ਅਤੇ ${speed(input.speedB)} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦੇ ਹਨ। ਮਿਲਣ ਦਾ ਸਮਾਂ`);
    case "findDepartureClockTimeFromMeetingState":
      return ask(language, variant,
        `दो वाहन ${km(input.initialSeparation)} की दूरी से ${direction(language, same)} ${speed(input.speedA)} और ${speed(input.speedB)} की गति से चलकर ${cp004NativeClock(input.meetingClockMinute, language)} पर मिलते हैं। चलने का प्रारंभिक समय`,
        `ਦੋ ਵਾਹਨ ${km(input.initialSeparation)} ਦੇ ਫ਼ਾਸਲੇ ਤੋਂ ${direction(language, same)} ${speed(input.speedA)} ਅਤੇ ${speed(input.speedB)} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲ ਕੇ ${cp004NativeClock(input.meetingClockMinute, language)} ਵਜੇ ਮਿਲਦੇ ਹਨ। ਚੱਲਣ ਦਾ ਸ਼ੁਰੂਆਤੀ ਸਮਾਂ`);
    case "findSpeedNeededToAvoidOrCauseMeeting":
      return ask(language, variant,
        `दो वाहनों के बीच ${km(input.initialSeparation)} की दूरी है। एक वाहन ${speed(input.speedB)} की गति से चलता है। ठीक ${cp004NativeDuration(input.targetTime, language)} बाद मिलने के लिए दूसरे वाहन की आवश्यक गति`,
        `ਦੋ ਵਾਹਨਾਂ ਵਿਚਕਾਰ ${km(input.initialSeparation)} ਦਾ ਫ਼ਾਸਲਾ ਹੈ। ਇੱਕ ਵਾਹਨ ${speed(input.speedB)} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲਦਾ ਹੈ। ਠੀਕ ${cp004NativeDuration(input.targetTime, language)} ਬਾਅਦ ਮਿਲਣ ਲਈ ਦੂਜੇ ਵਾਹਨ ਦੀ ਲੋੜੀਂਦੀ ਰਫ਼ਤਾਰ`);
  }
}

function relative(input: TsdCp004CoreInput): Rational | undefined {
  if (!input.speedA || !input.speedB) return undefined;
  return input.directionCase === "SAME" ? subtract(input.speedA, input.speedB) : add(input.speedA, input.speedB);
}

function nativeExplanation(
  authorityKey: string,
  solveMode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  answerText: string,
  language: TsdCp004NativeLanguage,
): NativeExplanation {
  const rel = relative(input);
  const same = input.directionCase === "SAME";
  const closingRule = q(language,
    same ? "एक ही दिशा में सापेक्ष गति के लिए दोनों गतियों का अंतर लें।" : "विपरीत दिशाओं में सापेक्ष गति के लिए दोनों गतियों का योग लें।",
    same ? "ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਲਈ ਦੋਵੇਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅੰਤਰ ਲਵੋ।" : "ਵਿਰੁੱਧ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਲਈ ਦੋਵੇਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਜੋੜ ਲਵੋ।");

  let method = closingRule;
  const steps: string[] = [];
  let shortcut = q(language, "पहले सापेक्ष गति निकालें, फिर पूछी गई राशि का संबंध लगाएँ।", "ਪਹਿਲਾਂ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਕੱਢੋ, ਫਿਰ ਪੁੱਛੀ ਗਈ ਮਾਤਰਾ ਦਾ ਸੰਬੰਧ ਲਗਾਓ।");

  if (rel) {
    steps.push(q(language,
      `सापेक्ष गति = ${speed(input.speedA)} ${same ? "−" : "+"} ${speed(input.speedB)} = ${speed(rel)}।`,
      `ਸਾਪੇਖ ਰਫ਼ਤਾਰ = ${speed(input.speedA)} ${same ? "−" : "+"} ${speed(input.speedB)} = ${speed(rel)}।`));
  }

  switch (authorityKey) {
    case "relativeSpeedBetweenTwoBodies":
      break;
    case "firstMeetingOrCatchUpTimeFromGap": {
      const gap = input.headStartDistance ?? input.initialSeparation;
      if (gap && rel && solveMode !== "findDepartureClockTimeFromMeetingState") {
        const t = divide(gap, rel);
        steps.push(q(language,
          `समय = दूरी ÷ सापेक्ष गति = ${km(gap)} ÷ ${speed(rel)} = ${cp004NativeDuration(t, language)}।`,
          `ਸਮਾਂ = ਦੂਰੀ ÷ ਸਾਪੇਖ ਰਫ਼ਤਾਰ = ${km(gap)} ÷ ${speed(rel)} = ${cp004NativeDuration(t, language)}।`));
      }
      method = q(language, "मिलने या पकड़ने का समय = संबंधित दूरी ÷ सापेक्ष गति।", "ਮਿਲਣ ਜਾਂ ਫੜਨ ਦਾ ਸਮਾਂ = ਸੰਬੰਧਿਤ ਦੂਰੀ ÷ ਸਾਪੇਖ ਰਫ਼ਤਾਰ।");
      break;
    }
    case "relativeDistanceFromRelativeMotion": {
      const t = input.elapsedTime ?? input.meetingTime;
      if (rel && t) {
        const d = multiply(rel, t);
        steps.push(q(language,
          `सापेक्ष दूरी = सापेक्ष गति × समय = ${speed(rel)} × ${cp004NativeDuration(t, language)} = ${km(d)}।`,
          `ਸਾਪੇਖ ਦੂਰੀ = ਸਾਪੇਖ ਰਫ਼ਤਾਰ × ਸਮਾਂ = ${speed(rel)} × ${cp004NativeDuration(t, language)} = ${km(d)}।`));
      }
      method = q(language, "सापेक्ष दूरी = सापेक्ष गति × समय।", "ਸਾਪੇਖ ਦੂਰੀ = ਸਾਪੇਖ ਰਫ਼ਤਾਰ × ਸਮਾਂ।");
      break;
    }
    case "relativeSpeedFromGapAndMeetingTime":
      if (input.initialSeparation && input.meetingTime) {
        steps.push(q(language,
          `सापेक्ष गति = ${km(input.initialSeparation)} ÷ ${cp004NativeDuration(input.meetingTime, language)} = ${answerText}।`,
          `ਸਾਪੇਖ ਰਫ਼ਤਾਰ = ${km(input.initialSeparation)} ÷ ${cp004NativeDuration(input.meetingTime, language)} = ${answerText}।`));
      }
      method = q(language, "सापेक्ष गति = दूरी में परिवर्तन ÷ समय।", "ਸਾਪੇਖ ਰਫ਼ਤਾਰ = ਦੂਰੀ ਵਿੱਚ ਬਦਲਾਅ ÷ ਸਮਾਂ।");
      break;
    case "individualSpeedFromRelativeState":
      steps.push(q(language,
        `सापेक्ष गति के संबंध से अज्ञात व्यक्तिगत गति = ${answerText}।`,
        `ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਦੇ ਸੰਬੰਧ ਤੋਂ ਅਣਜਾਣ ਵਿਅਕਤੀਗਤ ਰਫ਼ਤਾਰ = ${answerText}।`));
      method = q(language, "पहले गति-अंतर या गति-योग पहचानें, फिर अज्ञात गति निकालें।", "ਪਹਿਲਾਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅੰਤਰ ਜਾਂ ਜੋੜ ਪਛਾਣੋ, ਫਿਰ ਅਣਜਾਣ ਰਫ਼ਤਾਰ ਕੱਢੋ।");
      break;
    case "delayedStartPursuitState":
      if (input.speedB && input.startDelay) {
        const lead = multiply(input.speedB, input.startDelay);
        steps.push(q(language,
          `पहले चलने वाले वाहन की बढ़त = ${speed(input.speedB)} × ${cp004NativeDuration(input.startDelay, language)} = ${km(lead)}।`,
          `ਪਹਿਲਾਂ ਚੱਲੇ ਵਾਹਨ ਦੀ ਬੜ੍ਹਤ = ${speed(input.speedB)} × ${cp004NativeDuration(input.startDelay, language)} = ${km(lead)}।`));
      }
      method = q(language, "समय की बढ़त को पहले दूरी की बढ़त में बदलें, फिर सापेक्ष गति लगाएँ।", "ਸਮੇਂ ਦੀ ਬੜ੍ਹਤ ਨੂੰ ਪਹਿਲਾਂ ਦੂਰੀ ਦੀ ਬੜ੍ਹਤ ਵਿੱਚ ਬਦਲੋ, ਫਿਰ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਲਗਾਓ।");
      break;
    case "separationEvolutionOnLine":
      method = q(language, "दूरी में आवश्यक परिवर्तन को सापेक्ष गति से जोड़ें।", "ਫ਼ਾਸਲੇ ਵਿੱਚ ਲੋੜੀਂਦੇ ਬਦਲਾਅ ਨੂੰ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਨਾਲ ਜੋੜੋ।");
      steps.push(q(language, `दिए गए अंतराल के लिए सही दूरी-संबंध लगाने पर उत्तर ${answerText} मिलता है।`, `ਦਿੱਤੇ ਅੰਤਰਾਲ ਲਈ ਸਹੀ ਦੂਰੀ-ਸੰਬੰਧ ਲਗਾਉਣ ਨਾਲ ਉੱਤਰ ${answerText} ਮਿਲਦਾ ਹੈ।`));
      break;
    case "firstMeetingPointFromSpeedRelation":
      method = q(language, "पहली मुलाकात तक दोनों का समय समान होता है, इसलिए तय दूरियाँ उनकी गतियों के अनुपात में होती हैं।", "ਪਹਿਲੀ ਮੁਲਾਕਾਤ ਤੱਕ ਦੋਵਾਂ ਦਾ ਸਮਾਂ ਇੱਕੋ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਤੈਅ ਦੂਰੀਆਂ ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੁੰਦੀਆਂ ਹਨ।");
      steps.push(q(language, `मार्ग को गति-अनुपात में बाँटने पर पहले सिरे से दूरी ${answerText} आती है।`, `ਰਸਤੇ ਨੂੰ ਰਫ਼ਤਾਰ-ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਣ ਨਾਲ ਪਹਿਲੇ ਸਿਰੇ ਤੋਂ ਦੂਰੀ ${answerText} ਆਉਂਦੀ ਹੈ।`));
      break;
    case "speedRatioFromFirstMeetingPoint":
      method = q(language, "समान समय में गति का अनुपात तय दूरियों के अनुपात के बराबर होता है।", "ਇੱਕੋ ਸਮੇਂ ਵਿੱਚ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ਤੈਅ ਦੂਰੀਆਂ ਦੇ ਅਨੁਪਾਤ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।");
      steps.push(q(language, `अतः गति का अनुपात = ${answerText}।`, `ਇਸ ਲਈ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ = ${answerText}।`));
      break;
    case "requiredSpeedForTargetMeeting":
      if (input.initialSeparation && input.targetTime) {
        const requiredRelative = divide(input.initialSeparation, input.targetTime);
        steps.push(q(language,
          `आवश्यक सापेक्ष गति = ${km(input.initialSeparation)} ÷ ${cp004NativeDuration(input.targetTime, language)} = ${speed(requiredRelative)}।`,
          `ਲੋੜੀਂਦੀ ਸਾਪੇਖ ਰਫ਼ਤਾਰ = ${km(input.initialSeparation)} ÷ ${cp004NativeDuration(input.targetTime, language)} = ${speed(requiredRelative)}।`));
      }
      steps.push(q(language, `दिशा के अनुसार दूसरी गति को समायोजित करने पर आवश्यक गति ${answerText} है।`, `ਦਿਸ਼ਾ ਅਨੁਸਾਰ ਦੂਜੀ ਰਫ਼ਤਾਰ ਨੂੰ ਠੀਕ ਕਰਨ ਉੱਤੇ ਲੋੜੀਂਦੀ ਰਫ਼ਤਾਰ ${answerText} ਹੈ।`));
      method = q(language, "पहले लक्ष्य समय के लिए आवश्यक सापेक्ष गति निकालें, फिर व्यक्तिगत गति निकालें।", "ਪਹਿਲਾਂ ਟੀਚੇ ਦੇ ਸਮੇਂ ਲਈ ਲੋੜੀਂਦੀ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਕੱਢੋ, ਫਿਰ ਵਿਅਕਤੀਗਤ ਰਫ਼ਤਾਰ ਕੱਢੋ।");
      break;
  }

  if (steps.length === 0) {
    steps.push(q(language, `सही सापेक्ष-गति संबंध से उत्तर ${answerText} मिलता है।`, `ਸਹੀ ਸਾਪੇਖ-ਰਫ਼ਤਾਰ ਸੰਬੰਧ ਨਾਲ ਉੱਤਰ ${answerText} ਮਿਲਦਾ ਹੈ।`));
  }
  return Object.freeze({
    method,
    steps: Object.freeze(steps),
    shortcut,
    finalAnswer: q(language, `अतः सही उत्तर ${answerText} है।`, `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answerText} ਹੈ।`),
  });
}

export function generateCp004NativeReviewRows(
  language: TsdCp004NativeLanguage,
): readonly TsdCp004NativeReviewRow[] {
  return Object.freeze(TSD_CP004_APPROVED_ENGLISH_FROZEN_60Q.map((source, index) => {
    const options = Object.freeze(source.options.map((option) => cp004LocalizeOption(option, language)));
    const answerText = options[source.correctIndex]!;
    const variant = Number(source.representation.split(":").at(-1) ?? index) % 4;
    return Object.freeze({
      checkpointId: "TSD-CP-004" as const,
      permanentQlId: source.permanentQlId,
      authorityKey: source.authorityKey,
      solveMode: source.solveMode,
      representation: source.representation,
      context: source.context,
      language,
      difficulty: source.difficulty,
      stem: nativeStem(source.solveMode, source.input, language, variant),
      input: source.input,
      solution: source.solution,
      options,
      correctIndex: source.correctIndex,
      answerText,
      explanation: nativeExplanation(source.authorityKey, source.solveMode, source.input, answerText, language),
      mathematicalFingerprint: source.mathematicalFingerprint,
      parity: Object.freeze({
        englishIndex: index,
        englishSeed: source.seed,
        sourceStem: source.stem,
        sourceAnswerText: source.answerText,
      }),
      lifecycle: Object.freeze({
        englishFreezeStatus: "FROZEN" as const,
        nativeReviewStatus: "NATIVE_REVIEW_CANDIDATE" as const,
        multilingualFreezeStatus: "UNFROZEN" as const,
        questionStudioEnabled: false as const,
        questionBankStatus: "NOT_STORED" as const,
        testEligibility: "INELIGIBLE" as const,
        publiclyPublishable: false as const,
      }),
    });
  }));
}

export const TSD_CP004_HINDI_REVIEW_V1 = generateCp004NativeReviewRows("hi");
export const TSD_CP004_PUNJABI_REVIEW_V1 = generateCp004NativeReviewRows("pa");
