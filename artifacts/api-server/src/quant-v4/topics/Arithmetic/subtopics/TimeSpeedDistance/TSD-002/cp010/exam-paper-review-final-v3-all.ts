import { divide, multiply, rational, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import type { TsdCp010ExecutableInput } from "./executable-types";
import type { TsdCp010ExamRealLanguage } from "./exam-real-review-final";
import {
  TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW as ENGLISH_V3,
  renderTsdCp010ExamPaperStemV3 as renderEnglishV3,
} from "./exam-paper-review-final-v3";
import {
  TSD_CP010_EXAM_REAL_V2_HINDI_REVIEW,
  TSD_CP010_EXAM_REAL_V2_PUNJABI_REVIEW,
} from "./exam-real-review-final-v2";
import { renderTsdCp010NativeExamPaperStemV3 } from "./native-exam-paper-v3";

const EN_NAMES = Object.freeze([
  ["A", "B"], ["P", "Q"], ["Arun", "Bharat"], ["Ravi", "Sahil"], ["Karan", "Mohan"], ["Rohit", "Deepak"],
] as const);
const HI_NAMES = Object.freeze([
  ["अजय", "विजय"], ["रवि", "मोहन"], ["अमन", "करण"], ["दीपक", "रोहित"], ["नीरज", "मनीष"], ["कबीर", "साहिल"],
] as const);
const PA_NAMES = Object.freeze([
  ["ਅਜੈ", "ਵਿਜੈ"], ["ਰਵੀ", "ਮੋਹਨ"], ["ਅਮਨ", "ਕਰਨ"], ["ਦੀਪਕ", "ਰੋਹਿਤ"], ["ਨੀਰਜ", "ਮਨੀਸ਼"], ["ਕਬੀਰ", "ਸਾਹਿਲ"],
] as const);

function familyIndex(familyId: string) {
  const index = familyId.charCodeAt(familyId.length - 1) - 65;
  return index >= 0 && index <= 5 ? index : 0;
}
function value(r: Rational) { return toMixedString(r); }
function capability(aSpeed: Rational, bSpeed: Rational) {
  const distance = multiply(multiply(aSpeed, bSpeed), rational(5));
  return Object.freeze({ distance, aTime: divide(distance, aSpeed), bTime: divide(distance, bSpeed) });
}

function ql118TimeEvidenceStem(language: TsdCp010ExamRealLanguage, familyId: string, input: Extract<TsdCp010ExecutableInput, { authorityKey: "raceLengthFromLeadEvidence"; mode: "TIME_LEAD" }>) {
  const i = familyIndex(familyId);
  const cap = capability(input.winnerSpeed, input.loserSpeed);
  if (language === "en") {
    const [a, b] = EN_NAMES[i]!;
    const d = `${value(cap.distance)} m`, ta = `${value(cap.aTime)} seconds`, tb = `${value(cap.bTime)} seconds`, lead = `${value(input.timeLead)} seconds`;
    return [
      `${a} can run ${d} in ${ta}, while ${b} takes ${tb}. If ${a} beats ${b} by ${lead} in a race, find the race distance.`,
      `${a} takes ${ta} and ${b} takes ${tb} to run ${d}. If ${a} finishes ${lead} before ${b}, how long is the race?`,
      `For the same ${d}, ${a} takes ${ta} and ${b} takes ${tb}. In a race ${a} wins by ${lead}. Find its length.`,
      `${a} can cover ${d} in ${ta}; ${b} needs ${tb} for the same distance. If ${a} reaches the finish ${lead} earlier, find the race distance.`,
      `${a} and ${b} take ${ta} and ${tb}, respectively, to run ${d}. If their finishing times differ by ${lead}, find the race length.`,
      `${a} can run ${d} in ${ta} and ${b} in ${tb}. If ${a} beats ${b} by ${lead}, how long is the race?`,
    ][i]!;
  }
  if (language === "hi") {
    const [a, b] = HI_NAMES[i]!;
    const d = `${value(cap.distance)} मीटर`, ta = `${value(cap.aTime)} सेकंड`, tb = `${value(cap.bTime)} सेकंड`, lead = `${value(input.timeLead)} सेकंड`;
    return [
      `${a} ${d} को ${ta} में दौड़ता है, जबकि ${b} को ${tb} लगते हैं। यदि किसी दौड़ में ${a}, ${b} से ${lead} पहले पहुँचे, तो दौड़ की लंबाई ज्ञात कीजिए।`,
      `${d} दौड़ने में ${a} को ${ta} और ${b} को ${tb} लगते हैं। यदि ${a}, ${b} को ${lead} से हराता है, तो दौड़ कितनी लंबी है?`,
      `समान ${d} दूरी के लिए ${a} का समय ${ta} और ${b} का ${tb} है। एक दौड़ में ${a} ${lead} पहले पहुँचता है। कुल दूरी ज्ञात कीजिए।`,
      `${a} ${d} को ${ta} में तय कर सकता है और ${b} उसी दूरी को ${tb} में। यदि ${a} ${lead} पहले समाप्ति रेखा पर पहुँचे, तो दौड़ की दूरी क्या है?`,
      `${a} और ${b} को ${d} के लिए क्रमशः ${ta} और ${tb} लगते हैं। यदि उनके पहुँचने के समय में ${lead} का फर्क हो, तो दौड़ की लंबाई ज्ञात कीजिए।`,
      `${a} ${d} को ${ta} में और ${b} ${tb} में दौड़ता है। यदि ${a}, ${b} को ${lead} से हराता है, तो दौड़ की दूरी ज्ञात कीजिए।`,
    ][i]!;
  }
  const [a, b] = PA_NAMES[i]!;
  const d = `${value(cap.distance)} ਮੀਟਰ`, ta = `${value(cap.aTime)} ਸਕਿੰਟ`, tb = `${value(cap.bTime)} ਸਕਿੰਟ`, lead = `${value(input.timeLead)} ਸਕਿੰਟ`;
  return [
    `${a} ${d} ਨੂੰ ${ta} ਵਿੱਚ ਦੌੜਦਾ ਹੈ, ਜਦਕਿ ${b} ਨੂੰ ${tb} ਲੱਗਦੇ ਹਨ। ਜੇ ਕਿਸੇ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਤੋਂ ${lead} ਪਹਿਲਾਂ ਪਹੁੰਚੇ, ਤਾਂ ਦੌੜ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`,
    `${d} ਦੌੜਨ ਵਿੱਚ ${a} ਨੂੰ ${ta} ਅਤੇ ${b} ਨੂੰ ${tb} ਲੱਗਦੇ ਹਨ। ਜੇ ${a}, ${b} ਨੂੰ ${lead} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ, ਤਾਂ ਦੌੜ ਕਿੰਨੀ ਲੰਬੀ ਹੈ?`,
    `ਇੱਕੋ ${d} ਦੂਰੀ ਲਈ ${a} ਦਾ ਸਮਾਂ ${ta} ਅਤੇ ${b} ਦਾ ${tb} ਹੈ। ਇੱਕ ਦੌੜ ਵਿੱਚ ${a} ${lead} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ। ਕੁੱਲ ਦੂਰੀ ਕੱਢੋ।`,
    `${a} ${d} ਨੂੰ ${ta} ਵਿੱਚ ਤੈਅ ਕਰ ਸਕਦਾ ਹੈ ਅਤੇ ${b} ਉਹੀ ਦੂਰੀ ${tb} ਵਿੱਚ। ਜੇ ${a} ${lead} ਪਹਿਲਾਂ ਅੰਤਲੀ ਰੇਖਾ ਤੇ ਪਹੁੰਚੇ, ਤਾਂ ਦੌੜ ਦੀ ਦੂਰੀ ਕੀ ਹੈ?`,
    `${a} ਅਤੇ ${b} ਨੂੰ ${d} ਲਈ ਕ੍ਰਮਵਾਰ ${ta} ਅਤੇ ${tb} ਲੱਗਦੇ ਹਨ। ਜੇ ਉਨ੍ਹਾਂ ਦੇ ਪਹੁੰਚਣ ਦੇ ਸਮੇਂ ਵਿੱਚ ${lead} ਦਾ ਫਰਕ ਹੋਵੇ, ਤਾਂ ਦੌੜ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`,
    `${a} ${d} ਨੂੰ ${ta} ਵਿੱਚ ਅਤੇ ${b} ${tb} ਵਿੱਚ ਦੌੜਦਾ ਹੈ। ਜੇ ${a}, ${b} ਨੂੰ ${lead} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ, ਤਾਂ ਦੌੜ ਦੀ ਦੂਰੀ ਕੱਢੋ।`,
  ][i]!;
}

function polishNative(language: "hi" | "pa", stem: string) {
  if (language === "hi") return stem
    .replaceAll("समय-बढ़त", "समय की बढ़त")
    .replaceAll("दूरी-अंतर", "दूरी का अंतर")
    .replaceAll("जीत-अंतर", "जीत का अंतर")
    .replaceAll("समय-अंतर", "समय का अंतर");
  return stem
    .replaceAll("ਦੂਰੀ-ਅੰਤਰ", "ਦੂਰੀ ਦਾ ਅੰਤਰ")
    .replaceAll("ਜਿੱਤ-ਅੰਤਰ", "ਜਿੱਤ ਦਾ ਅੰਤਰ")
    .replaceAll("ਸਮਾਂ-ਅੰਤਰ", "ਸਮੇਂ ਦਾ ਅੰਤਰ");
}

export function renderTsdCp010ExamPaperStemV3(language: TsdCp010ExamRealLanguage, familyId: string, input: TsdCp010ExecutableInput) {
  if (input.authorityKey === "raceLengthFromLeadEvidence" && input.mode === "TIME_LEAD") {
    return ql118TimeEvidenceStem(language, familyId, input);
  }
  if (language === "en") return renderEnglishV3(language, familyId, input);
  return polishNative(language, renderTsdCp010NativeExamPaperStemV3(language, familyId, input));
}

export const TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW = Object.freeze(
  ENGLISH_V3.map((question) => Object.freeze({
    ...question,
    stem: renderTsdCp010ExamPaperStemV3("en", question.familyId, question.input),
  })),
);

export const TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW = Object.freeze(
  TSD_CP010_EXAM_REAL_V2_HINDI_REVIEW.map((question) => Object.freeze({
    ...question,
    stem: renderTsdCp010ExamPaperStemV3("hi", question.familyId, question.input),
  })),
);

export const TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW = Object.freeze(
  TSD_CP010_EXAM_REAL_V2_PUNJABI_REVIEW.map((question) => Object.freeze({
    ...question,
    stem: renderTsdCp010ExamPaperStemV3("pa", question.familyId, question.input),
  })),
);
