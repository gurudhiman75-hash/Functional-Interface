import { compare, toMixedString } from "../../TSD-001/foundation/rational";
import { calculationWriter, EDITORIAL_REVIEW_LOCK, type ReviewLocale } from "../../quality-audit/worked-calculation";
import { TSD_CP012_ENGLISH_REVIEW_FINAL } from "./english-review-editorial-final";
import { TSD_CP012_NATIVE_HINDI_REVIEW_FINAL, TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL } from "./native-review-editorial-final";
const sources = [TSD_CP012_ENGLISH_REVIEW_FINAL, TSD_CP012_NATIVE_HINDI_REVIEW_FINAL, TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL] as const;
const locales: readonly ReviewLocale[] = ["en-IN", "hi-IN", "pa-IN"];
export const TSD_CP012_MOVING_SURFACE_WORKED_REVIEW_V1 = Object.freeze(sources.flatMap((rows, index) => rows.filter(row => row.input.authorityKey === "movingSurfaceScheduleSynthesisState").map(source => {
 const input=source.input;
 if(input.authorityKey !== "movingSurfaceScheduleSynthesisState" || source.solution.kind !== "SCALAR") throw new Error("Invalid source");
 const w=calculationWriter(locales[index]);
 const assisted=w.binary(["Combined speed", "संयुक्त चाल", "ਕੁੱਲ ਚਾਲ"],input.personRate,"+",input.surfaceRate,"m/s");
 let answer;
 if(input.target === "UNKNOWN_ACTIVE_TIME_BEFORE_STOP") {
  const own=w.binary(["Distance without belt assistance", "बेल्ट की सहायता के बिना दूरी", "ਬੈਲਟ ਦੀ ਮਦਦ ਤੋਂ ਬਿਨਾਂ ਦੂਰੀ"],input.personRate,"×",input.totalTime,"m");
  const extra=w.binary(["Distance contributed by belt", "बेल्ट से मिली अतिरिक्त दूरी", "ਬੈਲਟ ਨਾਲ ਤੈਅ ਵਾਧੂ ਦੂਰੀ"],input.length,"−",own,"m");
  answer=w.binary(["Belt running time", "बेल्ट चलने का समय", "ਬੈਲਟ ਚੱਲਣ ਦਾ ਸਮਾਂ"],extra,"÷",input.surfaceRate,"s");
 } else {
  const switchTime=input.target === "TIME_WITH_STOP_AFTER" ? input.surfaceActiveTime : input.target === "TIME_WITH_DELAYED_ACTIVATION" ? input.activationDelay : input.reversalTime;
  const firstSpeed=input.target === "TIME_WITH_DELAYED_ACTIVATION" ? input.personRate : assisted;
  const finishBeforeSwitch=w.binary(["Time at initial speed", "प्रारंभिक चाल पर समय", "ਸ਼ੁਰੂਆਤੀ ਚਾਲ ਨਾਲ ਸਮਾਂ"],input.length,"÷",firstSpeed,"s");
  if(compare(finishBeforeSwitch,switchTime)<=0) answer=finishBeforeSwitch;
  else {
   const covered=w.binary(["Distance before change", "बदलाव से पहले दूरी", "ਤਬਦੀਲੀ ਤੋਂ ਪਹਿਲਾਂ ਦੂਰੀ"],firstSpeed,"×",switchTime,"m");
   const remaining=w.binary(["Remaining distance", "शेष दूरी", "ਬਾਕੀ ਦੂਰੀ"],input.length,"−",covered,"m");
   const secondSpeed=input.target === "TIME_WITH_STOP_AFTER" ? input.personRate : input.target === "TIME_WITH_DELAYED_ACTIVATION" ? assisted : w.binary(["Speed after reversal", "दिशा बदलने के बाद चाल", "ਦਿਸ਼ਾ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਚਾਲ"],input.personRate,"−",input.surfaceRate,"m/s");
   const lastTime=w.binary(["Time for remaining distance", "शेष दूरी का समय", "ਬਾਕੀ ਦੂਰੀ ਲਈ ਸਮਾਂ"],remaining,"÷",secondSpeed,"s");
   answer=w.binary(["Total time", "कुल समय", "ਕੁੱਲ ਸਮਾਂ"],switchTime,"+",lastTime,"s");
  }
 }
 if(answer.numerator*source.solution.answer.denominator!==source.solution.answer.numerator*answer.denominator) throw new Error("Answer mismatch");
 const v=toMixedString;
 const context=[`A powered trolley travels along a ${v(input.length)} m conveyor belt at ${v(input.personRate)} m/s relative to the belt.`, `एक मोटर चालित ट्रॉली ${v(input.length)} मीटर लंबी कन्वेयर बेल्ट पर बेल्ट के सापेक्ष ${v(input.personRate)} मीटर/सेकंड की स्थिर चाल से चलती है।`, `ਇੱਕ ਮੋਟਰ ਵਾਲੀ ਟਰਾਲੀ ${v(input.length)} ਮੀਟਰ ਲੰਮੀ ਕਨਵੇਅਰ ਬੈਲਟ ਉੱਤੇ ਬੈਲਟ ਦੇ ਮੁਕਾਬਲੇ ${v(input.personRate)} ਮੀਟਰ/ਸਕਿੰਟ ਦੀ ਸਥਿਰ ਚਾਲ ਨਾਲ ਚੱਲਦੀ ਹੈ।`][index];
 const rate=v(input.surfaceRate);
 const t=v(input.target === "TIME_WITH_STOP_AFTER" ? input.surfaceActiveTime : input.target === "TIME_WITH_DELAYED_ACTIVATION" ? input.activationDelay : input.target === "TIME_WITH_DIRECTION_REVERSAL" ? input.reversalTime : input.totalTime);
 const schedule=input.target === "TIME_WITH_STOP_AFTER" ? [`The belt moves in the same direction at ${rate} m/s for the first ${t} s, then stops. Find the total crossing time.`, `बेल्ट पहले ${t} सेकंड उसी दिशा में ${rate} मीटर/सेकंड से चलकर रुक जाती है। कुल पार करने का समय कितना है?`, `ਬੈਲਟ ਪਹਿਲੇ ${t} ਸਕਿੰਟ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ${rate} ਮੀਟਰ/ਸਕਿੰਟ ਨਾਲ ਚੱਲ ਕੇ ਰੁਕ ਜਾਂਦੀ ਹੈ। ਪਾਰ ਕਰਨ ਦਾ ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੈ?`] : input.target === "TIME_WITH_DELAYED_ACTIVATION" ? [`The belt is stationary for the first ${t} s, then moves in the same direction at ${rate} m/s. Find the total crossing time.`, `बेल्ट पहले ${t} सेकंड स्थिर रहती है, फिर उसी दिशा में ${rate} मीटर/सेकंड से चलती है। कुल पार करने का समय कितना है?`, `ਬੈਲਟ ਪਹਿਲੇ ${t} ਸਕਿੰਟ ਰੁਕੀ ਰਹਿੰਦੀ ਹੈ, ਫਿਰ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ${rate} ਮੀਟਰ/ਸਕਿੰਟ ਨਾਲ ਚੱਲਦੀ ਹੈ। ਪਾਰ ਕਰਨ ਦਾ ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੈ?`] : input.target === "TIME_WITH_DIRECTION_REVERSAL" ? [`The belt moves in the same direction at ${rate} m/s for ${t} s, then reverses at the same speed. Find the total crossing time.`, `बेल्ट ${t} सेकंड उसी दिशा में ${rate} मीटर/सेकंड से चलती है, फिर उतनी ही चाल से विपरीत दिशा में चलती है। कुल पार करने का समय कितना है?`, `ਬੈਲਟ ${t} ਸਕਿੰਟ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ${rate} ਮੀਟਰ/ਸਕਿੰਟ ਨਾਲ ਚੱਲਦੀ ਹੈ, ਫਿਰ ਉਸੇ ਚਾਲ ਨਾਲ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਚੱਲਦੀ ਹੈ। ਪਾਰ ਕਰਨ ਦਾ ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੈ?`] : [`The belt initially moves in the same direction at ${rate} m/s and later stops. The crossing takes ${t} s. For how long did the belt run?`, `बेल्ट शुरू में उसी दिशा में ${rate} मीटर/सेकंड से चलती है और बाद में रुक जाती है। कुल समय ${t} सेकंड है। बेल्ट कितने समय चली?`, `ਬੈਲਟ ਸ਼ੁਰੂ ਵਿੱਚ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ${rate} ਮੀਟਰ/ਸਕਿੰਟ ਨਾਲ ਚੱਲਦੀ ਹੈ ਅਤੇ ਬਾਅਦ ਵਿੱਚ ਰੁਕ ਜਾਂਦੀ ਹੈ। ਕੁੱਲ ਸਮਾਂ ${t} ਸਕਿੰਟ ਹੈ। ਬੈਲਟ ਕਿੰਨਾ ਸਮਾਂ ਚੱਲੀ?`];
 return Object.freeze({...source,...EDITORIAL_REVIEW_LOCK,locale:locales[index],version:"TSD-CP012-MOVING-SURFACE-WORKED-V1",stem:`${context} ${schedule[index]}`,calculations:Object.freeze(w.steps),explanation:Object.freeze({steps:Object.freeze(w.steps.map(s=>s.text)),conclusion:source.explanation.conclusion})});
})));
