import { toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP012_NATIVE_HINDI_REVIEW, TSD_CP012_NATIVE_PUNJABI_REVIEW, type TsdCp012NativeReviewQuestion } from "./native-review-final";

function v(value: Rational): string { return toMixedString(value); }
function hiSeconds(value: Rational): string { return `${v(value)} सेकंड`; }
function paSeconds(value: Rational): string { return `${v(value)} ਸਕਿੰਟ`; }
function hiMetres(value: Rational): string { return `${v(value)} मीटर`; }
function paMetres(value: Rational): string { return `${v(value)} ਮੀਟਰ`; }
function hiSpeed(value: Rational): string { return `${v(value)} मीटर/सेकंड`; }
function paSpeed(value: Rational): string { return `${v(value)} ਮੀਟਰ/ਸਕਿੰਟ`; }
function familyIndex(question: TsdCp012NativeReviewQuestion): number {
  const suffix = question.familyId.at(-1) ?? "A";
  return Math.max(0, suffix.charCodeAt(0) - 65);
}

function hiStem(question: TsdCp012NativeReviewQuestion): string {
  const input = question.input;
  if (input.authorityKey !== "routeProfileProgramState" || input.target !== "DISTANCE_SPLIT_A") return question.stem;
  const variants = [
    `एक निश्चित ${hiMetres(input.totalDistance)} मार्ग में लगातार दो अलग भू-खंड हैं। पहले खंड पर चाल ${hiSpeed(input.speedA)} और शेष खंड पर ${hiSpeed(input.speedB)} है। पूरा मार्ग ${hiSeconds(input.totalTime)} में तय होता है। पहले भू-खंड की लंबाई ज्ञात कीजिए।`,
    `${hiMetres(input.totalDistance)} के सेवा-मार्ग पर एक अज्ञात सीमा तक चाल ${hiSpeed(input.speedA)} है और उस सीमा के बाद ${hiSpeed(input.speedB)} है। कुल यात्रा समय ${hiSeconds(input.totalTime)} है। प्रारंभ से चाल बदलने वाली मार्ग-सीमा की दूरी ज्ञात कीजिए।`,
  ];
  return variants[familyIndex(question) % variants.length]!;
}
function paStem(question: TsdCp012NativeReviewQuestion): string {
  const input = question.input;
  if (input.authorityKey !== "routeProfileProgramState" || input.target !== "DISTANCE_SPLIT_A") return question.stem;
  const variants = [
    `ਇੱਕ ਨਿਸ਼ਚਿਤ ${paMetres(input.totalDistance)} ਰਸਤੇ ਵਿੱਚ ਲਗਾਤਾਰ ਦੋ ਵੱਖ ਭੂ-ਖੰਡ ਹਨ। ਪਹਿਲੇ ਖੰਡ ਤੇ ਚਾਲ ${paSpeed(input.speedA)} ਅਤੇ ਬਾਕੀ ਖੰਡ ਤੇ ${paSpeed(input.speedB)} ਹੈ। ਪੂਰਾ ਰਸਤਾ ${paSeconds(input.totalTime)} ਵਿੱਚ ਤੈਅ ਹੁੰਦਾ ਹੈ। ਪਹਿਲੇ ਭੂ-ਖੰਡ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`,
    `${paMetres(input.totalDistance)} ਦੇ ਸੇਵਾ-ਰਸਤੇ ਤੇ ਇੱਕ ਅਣਜਾਣ ਹੱਦ ਤੱਕ ਚਾਲ ${paSpeed(input.speedA)} ਹੈ ਅਤੇ ਉਸ ਹੱਦ ਤੋਂ ਬਾਅਦ ${paSpeed(input.speedB)} ਹੈ। ਕੁੱਲ ਯਾਤਰਾ ਸਮਾਂ ${paSeconds(input.totalTime)} ਹੈ। ਸ਼ੁਰੂ ਤੋਂ ਚਾਲ ਬਦਲਣ ਵਾਲੀ ਰਸਤਾ-ਹੱਦ ਦੀ ਦੂਰੀ ਕੱਢੋ।`,
  ];
  return variants[familyIndex(question) % variants.length]!;
}

export const TSD_CP012_NATIVE_HINDI_REVIEW_FINAL = Object.freeze(TSD_CP012_NATIVE_HINDI_REVIEW.map((question) => Object.freeze({ ...question, stem: hiStem(question) })));
export const TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL = Object.freeze(TSD_CP012_NATIVE_PUNJABI_REVIEW.map((question) => Object.freeze({ ...question, stem: paStem(question) })));
