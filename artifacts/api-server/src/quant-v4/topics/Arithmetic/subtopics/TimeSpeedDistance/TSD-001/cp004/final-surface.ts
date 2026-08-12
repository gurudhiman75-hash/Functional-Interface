import type { TsdCp004NativeLanguage } from "./native";
import { renderCp004EditorialV4NativeQuestion } from "./native-v4";
import type { TsdCp004FinalNativeQuestion } from "./native-polished";
import { generateCp004EditorialV3EnglishQuestion, generateCp004EditorialV3EnglishReviewCorpus, generateCp004EditorialV3StressCorpus } from "./runtime-v3";
import type { TsdCp004AuthorityId } from "./authority";
import type { TsdCp004Explanation, TsdCp004Question } from "./types";

const EN_METHODS: Readonly<Record<TsdCp004AuthorityId, string>> = Object.freeze({
  RELATIVE_SPEED_OPPOSITE: "Add the two speeds because the bodies move towards each other.",
  RELATIVE_SPEED_SAME_DIRECTION: "Subtract the slower speed from the faster speed because both bodies move in the same direction.",
  FIRST_MEETING_TIME: "Divide the initial gap by the positive closing speed to get the first meeting or catch-up time.",
  INITIAL_GAP_FROM_MEETING: "Reverse the meeting-time relation: initial gap equals relative speed multiplied by the given time.",
  UNKNOWN_SPEED_FROM_MEETING: "Recover the required closing speed from gap and time, then isolate the unknown individual speed.",
  HEAD_START_CATCH_UP_TIME: "Divide the distance head start by the same-direction speed difference.",
  HEAD_START_DISTANCE: "Multiply the same-direction speed difference by the catch-up time to recover the initial lead.",
  DELAYED_START_CATCH_UP_TIME: "Convert the earlier start into a distance lead, then divide that lead by the speed difference.",
  START_DELAY_FROM_CATCH_UP: "Equate the lead erased during the chase to the lead created before the faster body started.",
  SEPARATION_AFTER_TIME: "Change the initial separation by the relative distance covered during the stated time.",
  TIME_TO_SPECIFIED_SEPARATION: "Use only the required change in separation and divide it by the relevant relative speed.",
  MEETING_POINT_DISTANCE_SPLIT: "Because both bodies travel for the same time, divide the route in the ratio of their speeds.",
  SPEED_RATIO_FROM_MEETING_POINT: "Because the travel times are equal, the speed ratio equals the ratio of distances travelled before meeting.",
  MEETING_POINT_FROM_SPEED_RATIO: "Divide the complete route in the given speed ratio to locate the meeting point.",
  REQUIRED_SPEED_FOR_MEETING_DEADLINE: "Find the closing speed required by the time limit, then isolate the required body speed.",
  MULTI_PURSUER_MEETING_ORDER: "Compute each pursuer's catch time independently and compare the positive times.",
});

function polishEnglishStem(q: TsdCp004Question): string {
  const s = q.state;
  if (q.authorityId === "SEPARATION_AFTER_TIME" && s.directionCase === "OPPOSITE_AWAY" && s.initialGapKm.numerator === 0n) {
    const noun = q.stem.match(/^(.+?) A and \1 B/u)?.[1];
    if (noun) return q.stem.replace(`${noun} A and ${noun} B are initially 0 km apart and move away from each other`, `${noun} A and ${noun} B start from the same point and move away from each other`);
    return q.stem.replace(/are initially 0 km apart and move away from each other/u, "start from the same point and move away from each other");
  }
  if (q.authorityId === "TIME_TO_SPECIFIED_SEPARATION" && s.directionCase === "OPPOSITE_AWAY" && s.initialGapKm.numerator === 0n) {
    return q.stem.replace(/are initially 0 km apart and move away from each other/u, "start from the same point and move away from each other");
  }
  if (q.authorityId === "HEAD_START_DISTANCE" && s.variant === 2) {
    return q.stem.replace(/, find the initial lead of (.+?) in kilometres\?$/u, ". What was the initial lead of $1 in kilometres?");
  }
  if (q.authorityId === "INITIAL_GAP_FROM_MEETING" && s.variant === 2) {
    return q.stem.replace(/, determine their initial separation\?$/u, ". What was their initial separation?");
  }
  if (q.authorityId === "SPEED_RATIO_FROM_MEETING_POINT" && s.variant === 1) {
    return q.stem.replace(/Find the ratio of the first speed to the second speed\?$/u, "What is the ratio of the first speed to the second speed?");
  }
  if (q.authorityId === "MEETING_POINT_FROM_SPEED_RATIO" && s.variant === 2) {
    return q.stem.replace(/Locate the meeting point by giving its distance from the first end\?$/u, "How far from the first end will they meet?");
  }
  if (q.authorityId === "START_DELAY_FROM_CATCH_UP" && s.variant === 1) {
    return q.stem.replace(/, find (.+?)'s earlier-start time\?$/u, ". How many minutes earlier did $1 start?");
  }
  return q.stem;
}

function polishEnglishExplanation(q: TsdCp004Question): TsdCp004Explanation {
  return Object.freeze({ ...q.explanation, method: EN_METHODS[q.authorityId] });
}

export function renderCp004FinalEnglishReviewQuestion(q: TsdCp004Question): TsdCp004Question {
  return Object.freeze({ ...q, stem: polishEnglishStem(q), explanation: polishEnglishExplanation(q) });
}

function polishNativeStem(english: TsdCp004Question, native: TsdCp004FinalNativeQuestion, language: TsdCp004NativeLanguage): string {
  const s = english.state;
  let stem = native.stem;
  if (english.authorityId === "SEPARATION_AFTER_TIME" && s.directionCase === "OPPOSITE_AWAY" && s.initialGapKm.numerator === 0n) {
    stem = language === "hi"
      ? stem.replace(/शुरुआत में 0 km दूर हैं और/u, "एक ही बिंदु से शुरू होकर")
      : stem.replace(/ਸ਼ੁਰੂ ਵਿੱਚ 0 km ਦੂਰ ਹਨ ਅਤੇ/u, "ਇੱਕੋ ਬਿੰਦੂ ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ");
  }
  if (english.authorityId === "TIME_TO_SPECIFIED_SEPARATION" && s.directionCase === "OPPOSITE_AWAY" && s.initialGapKm.numerator === 0n) {
    stem = language === "hi"
      ? stem.replace(/शुरुआत में 0 km दूर हैं और/u, "एक ही बिंदु से शुरू होकर")
      : stem.replace(/ਸ਼ੁਰੂ ਵਿੱਚ 0 km ਦੂਰ ਹਨ ਅਤੇ/u, "ਇੱਕੋ ਬਿੰਦੂ ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ");
  }
  if (english.authorityId === "SPEED_RATIO_FROM_MEETING_POINT" && s.variant === 0) {
    const A = language === "hi" ? /गति अनुपात (.+?) A:(.+?) B क्या है\?/u : /ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ (.+?) A:(.+?) B ਕੀ ਹੈ\?/u;
    stem = language === "hi"
      ? stem.replace(A, "$1 A और $2 B की गतियों का अनुपात क्या है?")
      : stem.replace(A, "$1 A ਅਤੇ $2 B ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?");
  }
  if (english.authorityId === "MULTI_PURSUER_MEETING_ORDER" && s.variant === 0) {
    stem = language === "hi"
      ? stem.replace(/यदि सभी उसी दिशा में चलती रहें, तो/u, "यदि तीनों अपनी-अपनी गति बनाए रखें, तो")
      : stem.replace(/ਜੇ ਸਾਰੇ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਚੱਲਦੀਆਂ ਰਹਿਣ, ਤਾਂ/u, "ਜੇ ਤਿੰਨੇ ਆਪਣੀ-ਆਪਣੀ ਰਫ਼ਤਾਰ ਜਾਰੀ ਰੱਖਣ, ਤਾਂ");
  }
  return stem;
}

export function renderCp004FinalNativeReviewQuestion(englishInput: TsdCp004Question, language: TsdCp004NativeLanguage): TsdCp004FinalNativeQuestion {
  const english = renderCp004FinalEnglishReviewQuestion(englishInput);
  const base = renderCp004EditorialV4NativeQuestion(englishInput, language);
  return Object.freeze({ ...base, stem: polishNativeStem(english, base, language) });
}

export function generateCp004FinalReviewEnglishQuestion(authorityId: TsdCp004AuthorityId, seed: string): TsdCp004Question {
  return renderCp004FinalEnglishReviewQuestion(generateCp004EditorialV3EnglishQuestion(authorityId, seed));
}

export function generateCp004FinalReviewStressCorpus(seedsPerAuthority = 50): readonly TsdCp004Question[] {
  return Object.freeze(generateCp004EditorialV3StressCorpus(seedsPerAuthority).map(renderCp004FinalEnglishReviewQuestion));
}

export function generateCp004FinalReviewEnglishCorpus(): readonly TsdCp004Question[] {
  return Object.freeze(generateCp004EditorialV3EnglishReviewCorpus().map(renderCp004FinalEnglishReviewQuestion));
}

export function generateCp004FinalMultilingualReviewCorpus(): readonly (TsdCp004Question | TsdCp004FinalNativeQuestion)[] {
  const englishBase = generateCp004EditorialV3EnglishReviewCorpus();
  const rows: (TsdCp004Question | TsdCp004FinalNativeQuestion)[] = [];
  for (const base of englishBase) {
    const english = renderCp004FinalEnglishReviewQuestion(base);
    rows.push(english, renderCp004FinalNativeReviewQuestion(base, "hi"), renderCp004FinalNativeReviewQuestion(base, "pa"));
  }
  return Object.freeze(rows);
}
