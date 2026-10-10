import { add, divide, multiply, subtract, type Rational } from "../../foundation/rational";
import { TSD_CP004_HINDI_REVIEW_V1, TSD_CP004_PUNJABI_REVIEW_V1, type TsdCp004NativeReviewRow } from "./native-review-v1";
import { cp004NativeNumber as n, cp004NativeClock, cp004NativeDuration } from "./native-primitives-v1";

function improve(row: TsdCp004NativeReviewRow) {
  const i = row.input, hi = row.language === "hi", q = (h: string, p: string) => hi ? h : p;
  const p = (r: Rational | undefined) => { if (!r) throw new Error(`${row.solveMode}: missing input`); return r; };
  const same = i.directionCase === "SAME";
  const rel = i.speedA && i.speedB ? same ? subtract(i.speedA, i.speedB) : add(i.speedA, i.speedB) : undefined;
  let stem = row.stem.replace(/ कितना होगा\?$/, " ज्ञात कीजिए।").replace(/ ਕਿੰਨਾ ਹੋਵੇਗਾ\?$/, " ਕੱਢੋ।");
  if (row.solveMode === "findIndividualSpeedFromRelativeSpeedAndOtherSpeed") {
    const known = i.unknownBody === "A" ? p(i.speedB) : p(i.speedA);
    const target = same ? i.unknownBody === "A" ? q("तेज वाहन", "ਤੇਜ਼ ਵਾਹਨ") : q("धीमा वाहन", "ਹੌਲਾ ਵਾਹਨ") : q("दूसरा वाहन", "ਦੂਜਾ ਵਾਹਨ");
    stem = q(`दो वाहन ${same ? "एक ही दिशा में" : "एक-दूसरे की ओर"} चलते हैं। उनकी सापेक्ष गति ${n(i.relativeSpeed)} km/h है और ${same ? i.unknownBody === "A" ? "धीमे" : "तेज" : "एक"} वाहन की गति ${n(known)} km/h है। ${target} की गति ज्ञात कीजिए।`, `ਦੋ ਵਾਹਨ ${same ? "ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ" : "ਇੱਕ-ਦੂਜੇ ਵੱਲ"} ਚੱਲਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ${n(i.relativeSpeed)} km/h ਹੈ ਅਤੇ ${same ? i.unknownBody === "A" ? "ਹੌਲੇ" : "ਤੇਜ਼" : "ਇੱਕ"} ਵਾਹਨ ਦੀ ਰਫ਼ਤਾਰ ${n(known)} km/h ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`);
  }
  if (["findSeparationAfterMovingApart", "findInitialGapFromLaterSeparation"].includes(row.solveMode)) {
    stem = stem.replace("विपरीत दिशाओं में", "एक-दूसरे से दूर").replace("ਵਿਰੁੱਧ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ", "ਇੱਕ-ਦੂਜੇ ਤੋਂ ਦੂਰ");
  }
  if (row.solveMode === "findTimeUntilSpecifiedSeparation" && !same) {
    stem = stem.replace("एक-दूसरे की ओर", "एक-दूसरे से दूर").replace("ਇੱਕ-ਦੂਜੇ ਵੱਲ", "ਇੱਕ-ਦੂਜੇ ਤੋਂ ਦੂਰ");
  }
  if (same && ["findMeetingTimeFromInitialSeparation", "findMeetingClockTime", "findDepartureClockTimeFromMeetingState", "findTimeUntilSpecifiedSeparation"].includes(row.solveMode)) {
    stem = q("धीमा वाहन आगे है और तेज वाहन उसका पीछा करता है। ", "ਹੌਲਾ ਵਾਹਨ ਅੱਗੇ ਹੈ ਅਤੇ ਤੇਜ਼ ਵਾਹਨ ਉਸ ਦਾ ਪਿੱਛਾ ਕਰਦਾ ਹੈ। ") + stem;
  }
  if (row.solveMode === "findSpeedNeededToAvoidOrCauseMeeting") {
    stem = q(same ? "दोनों वाहन एक ही दिशा में चलते हैं; पहले से चल रहा वाहन आगे है। " : "दोनों वाहन एक-दूसरे की ओर चलते हैं। ", same ? "ਦੋਵੇਂ ਵਾਹਨ ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਚੱਲਦੇ ਹਨ; ਪਹਿਲਾਂ ਤੋਂ ਚੱਲ ਰਿਹਾ ਵਾਹਨ ਅੱਗੇ ਹੈ। " : "ਦੋਵੇਂ ਵਾਹਨ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਦੇ ਹਨ। ") + stem;
  }
  const expressions: string[] = [];
  const push = (label: string, expression: string, value: string) => expressions.push(`${label} = ${expression} = ${value}।`);
  const result = row.solution.unit === "SPEED" ? q("गति", "ਰਫ਼ਤਾਰ") : row.solution.unit === "DISTANCE" ? q("दूरी", "ਦੂਰੀ") : row.solution.unit === "RATIO" ? q("गतियों का अनुपात", "ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ") : row.solution.unit === "CLOCK_MINUTE" ? q("घड़ी का समय", "ਘੜੀ ਦਾ ਸਮਾਂ") : q("समय", "ਸਮਾਂ");
  if (rel && !["findRelativeSpeedOppositeDirections", "findRelativeSpeedSameDirection"].includes(row.solveMode)) push(q("सापेक्ष गति", "ਸਾਪੇਖ ਰਫ਼ਤਾਰ"), `${n(i.speedA)} ${same ? "−" : "+"} ${n(i.speedB)}`, `${n(rel)} km/h`);
  let expression: string;
  switch (row.solveMode) {
    case "findRelativeSpeedOppositeDirections": case "findRelativeSpeedSameDirection": expression = `${n(i.speedA)} ${same ? "−" : "+"} ${n(i.speedB)}`; break;
    case "findMeetingTimeFromInitialSeparation": case "findCatchUpTimeFromHeadStartDistance": expression = `${n(i.headStartDistance ?? i.initialSeparation)} ÷ ${n(rel)}`; break;
    case "findInitialSeparationFromMeetingTime": case "findUnknownStartPointGap": case "findHeadStartDistanceFromCatchUpTime": expression = `${n(rel)} × ${n(i.meetingTime)}`; break;
    case "findRelativeDistanceCoveredInGivenTime": expression = `${n(rel)} × ${n(i.elapsedTime)}`; break;
    case "findRelativeSpeedFromMeetingTime": expression = `${n(i.initialSeparation)} ÷ ${n(i.meetingTime)}`; break;
    case "findIndividualSpeedFromRelativeSpeedAndOtherSpeed": expression = same ? i.unknownBody === "A" ? `${n(i.relativeSpeed)} + ${n(i.speedB)}` : `${n(i.speedA)} − ${n(i.relativeSpeed)}` : `${n(i.relativeSpeed)} − ${n(i.unknownBody === "A" ? i.speedB : i.speedA)}`; break;
    case "findFasterSpeedFromCatchUpState": expression = `${n(i.headStartDistance)} ÷ ${n(i.meetingTime)} + ${n(i.speedB)}`; break;
    case "findSlowerSpeedFromCatchUpState": expression = `${n(i.speedA)} − ${n(i.headStartDistance)} ÷ ${n(i.meetingTime)}`; break;
    case "findDelayedStartCatchUpTime": {
      const lead = multiply(p(i.speedB), p(i.startDelay));
      push(q("शुरुआती बढ़त", "ਸ਼ੁਰੂਆਤੀ ਬੜ੍ਹਤ"), `${n(i.speedB)} × ${n(i.startDelay)}`, `${n(lead)} km`);
      expression = `${n(lead)} ÷ ${n(rel)}`; break;
    }
    case "findStartDelayFromCatchUpState": expression = `${n(rel)} × ${n(i.meetingTime)} ÷ ${n(i.speedB)}`; break;
    case "findSeparationAfterMovingApart": expression = `${n(i.initialSeparation)} + ${n(rel)} × ${n(i.elapsedTime)}`; break;
    case "findInitialGapFromLaterSeparation": expression = `${n(i.specifiedSeparation)} − ${n(rel)} × ${n(i.elapsedTime)}`; break;
    case "findTimeUntilSpecifiedSeparation": expression = `${same ? `(${n(i.initialSeparation)} − ${n(i.specifiedSeparation)})` : `(${n(i.specifiedSeparation)} − ${n(i.initialSeparation)})`} ÷ ${n(rel)}`; break;
    case "findMeetingPointDistanceSplit": expression = `${n(i.routeDistance)} × ${n(i.speedA)} ÷ (${n(i.speedA)} + ${n(i.speedB)})`; break;
    case "findMeetingPointFromSpeedRatio": expression = `${n(i.routeDistance)} × ${n(i.ratioA)} ÷ (${n(i.ratioA)} + ${n(i.ratioB)})`; break;
    case "findSpeedRatioFromMeetingPoint": expression = `${n(i.distanceA)} : ${n(i.distanceB)}`; break;
    case "findMeetingClockTime": case "findDepartureClockTimeFromMeetingState": {
      const travel = divide(p(i.initialSeparation), p(rel));
      push(q("मिलने का समय-अंतर", "ਮਿਲਣ ਦਾ ਸਮਾਂ-ਅੰਤਰ"), `${n(i.initialSeparation)} ÷ ${n(rel)}`, cp004NativeDuration(travel, row.language));
      const forward = row.solveMode === "findMeetingClockTime";
      expression = `${cp004NativeClock(forward ? i.departureMinute : i.meetingClockMinute, row.language)} ${forward ? "+" : "−"} ${cp004NativeDuration(travel, row.language)}`; break;
    }
    case "findSpeedNeededToAvoidOrCauseMeeting": {
      const required = divide(p(i.initialSeparation), p(i.targetTime));
      push(q("आवश्यक सापेक्ष गति", "ਲੋੜੀਂਦੀ ਸਾਪੇਖ ਰਫ਼ਤਾਰ"), `${n(i.initialSeparation)} ÷ ${n(i.targetTime)}`, `${n(required)} km/h`);
      expression = `${n(required)} ${same ? "+" : "−"} ${n(i.speedB)}`; break;
    }
  }
  if (expression.includes("?")) throw new Error(`${row.solveMode}: incomplete worked expression`);
  push(result, expression, row.answerText);
  return Object.freeze({...row, stem, explanation: Object.freeze({method: row.explanation.method, steps: Object.freeze(expressions), finalAnswer: row.explanation.finalAnswer}),
    revision: "TSD-CP004-NATIVE-REVIEW-V2", contentApproved: false, sourceEnglishFrozen: true});
}
export const TSD_CP004_NATIVE_REVIEW_V2 = Object.freeze([...TSD_CP004_HINDI_REVIEW_V1, ...TSD_CP004_PUNJABI_REVIEW_V1].map(improve));
