import { divide,multiply,rational,toMixedString } from "../../TSD-001/foundation/rational";
import { calculationWriter,EDITORIAL_REVIEW_LOCK,type ReviewLocale } from "../../quality-audit/worked-calculation";
import { TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW,TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW,TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW } from "./exam-paper-review-final-v3-all";
const sources=[TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW,TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW,TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW] as const;
const locales:readonly ReviewLocale[]=["en-IN","hi-IN","pa-IN"];
export const TSD_CP010_FINISH_TIME_EVIDENCE_REVIEW_V1=Object.freeze(sources.flatMap((rows,index)=>rows.filter(q=>q.input.authorityKey==="finishTimeLeadState").map(source=>{
 const i=source.input;if(i.authorityKey!=="finishTimeLeadState")throw new Error("Wrong authority");
 const w=calculationWriter(locales[index]),v=toMixedString;
 const capability=multiply(multiply(i.winnerSpeed,i.loserSpeed),rational(5));
 const fast=divide(capability,i.winnerSpeed),slow=divide(capability,i.loserSpeed);
 const stem=[`A and B take ${v(fast)} s and ${v(slow)} s, respectively, to run ${v(capability)} m. If both start together and maintain these speeds, by how many seconds does A beat B in a ${v(i.raceDistance)} m race?`, `अजय और विजय ${v(capability)} मीटर दौड़ने में क्रमशः ${v(fast)} सेकंड और ${v(slow)} सेकंड लेते हैं। दोनों एक साथ शुरू करके इन्हीं स्थिर चालों से दौड़ते हैं। ${v(i.raceDistance)} मीटर की दौड़ में अजय कितने सेकंड से जीतता है?`, `ਅਜੈ ਅਤੇ ਵਿਜੈ ${v(capability)} ਮੀਟਰ ਦੌੜਨ ਵਿੱਚ ਕ੍ਰਮਵਾਰ ${v(fast)} ਸਕਿੰਟ ਅਤੇ ${v(slow)} ਸਕਿੰਟ ਲੈਂਦੇ ਹਨ। ਦੋਵੇਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਕੇ ਇਨ੍ਹਾਂ ਸਥਿਰ ਚਾਲਾਂ ਨਾਲ ਦੌੜਦੇ ਹਨ। ${v(i.raceDistance)} ਮੀਟਰ ਦੀ ਦੌੜ ਵਿੱਚ ਅਜੈ ਕਿੰਨੇ ਸਕਿੰਟ ਨਾਲ ਜਿੱਤਦਾ ਹੈ?`][index];
 const firstSpeed=w.binary(["First runner speed","पहले धावक की चाल","ਪਹਿਲੇ ਦੌੜਾਕ ਦੀ ਚਾਲ"],capability,"÷",fast,"m/s");
 const secondSpeed=w.binary(["Second runner speed","दूसरे धावक की चाल","ਦੂਜੇ ਦੌੜਾਕ ਦੀ ਚਾਲ"],capability,"÷",slow,"m/s");
 const firstTime=w.binary(["First runner finish time","पहले धावक का समय","ਪਹਿਲੇ ਦੌੜਾਕ ਦਾ ਸਮਾਂ"],i.raceDistance,"÷",firstSpeed,"s");
 const secondTime=w.binary(["Second runner finish time","दूसरे धावक का समय","ਦੂਜੇ ਦੌੜਾਕ ਦਾ ਸਮਾਂ"],i.raceDistance,"÷",secondSpeed,"s");
 const answer=w.binary(["Winning time gap","जीत का समय अंतर","ਜਿੱਤ ਦੇ ਸਮੇਂ ਦਾ ਫ਼ਰਕ"],secondTime,"−",firstTime,"s");
 if(answer.numerator*source.solution.answer.denominator!==source.solution.answer.numerator*answer.denominator)throw new Error("Source answer mismatch");
 return Object.freeze({...source,...EDITORIAL_REVIEW_LOCK,locale:locales[index],version:"TSD-CP010-FINISH-TIME-EVIDENCE-V1",stem,evidence:Object.freeze({distance:capability,firstTime:fast,secondTime:slow}),calculations:Object.freeze(w.steps),explanation:Object.freeze({steps:Object.freeze(w.steps.map(s=>s.text)),conclusion:source.explanation.conclusion})});
})));
