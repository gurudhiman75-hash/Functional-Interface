import { calculationWriter,EDITORIAL_REVIEW_LOCK,type ReviewLocale } from "../../quality-audit/worked-calculation";
import { TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW,TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW,TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW } from "./exam-paper-review-final-v3-all";
const sources=[TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW,TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW,TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW] as const;
const locales:readonly ReviewLocale[]=["en-IN","hi-IN","pa-IN"];
export const TSD_CP010_HANDICAP_WORKED_REVIEW_V1=Object.freeze(sources.flatMap((rows,index)=>rows.filter(q=>q.input.authorityKey==="deadHeatHandicapState").map(source=>{
 const i=source.input;if(i.authorityKey!=="deadHeatHandicapState")throw new Error("Wrong authority");
 const w=calculationWriter(locales[index]);
 const fastTime=w.binary(["Faster runner time","तेज़ धावक का समय","ਤੇਜ਼ ਦੌੜਾਕ ਦਾ ਸਮਾਂ"],i.raceDistance,"÷",i.fasterSpeed,"s");
 let answer;
 if(i.mode==="DISTANCE_HANDICAP"){
  const distance=w.binary(["Slower runner distance in the same time","समान समय में धीमे धावक की दूरी","ਉਸੇ ਸਮੇਂ ਵਿੱਚ ਹੌਲੀ ਦੌੜਾਕ ਦੀ ਦੂਰੀ"],i.slowerSpeed,"×",fastTime,"m");
  answer=w.binary(["Required distance head start","आवश्यक दूरी की बढ़त","ਦੂਰੀ ਦੀ ਲੋੜੀਂਦੀ ਅਗੇਤ"],i.raceDistance,"−",distance,"m");
 }else{
  const slowTime=w.binary(["Slower runner time","धीमे धावक का समय","ਹੌਲੀ ਦੌੜਾਕ ਦਾ ਸਮਾਂ"],i.raceDistance,"÷",i.slowerSpeed,"s");
  answer=w.binary(["Faster runner start delay","तेज़ धावक के शुरू करने में देरी","ਤੇਜ਼ ਦੌੜਾਕ ਦੇ ਸ਼ੁਰੂ ਕਰਨ ਵਿੱਚ ਦੇਰੀ"],slowTime,"−",fastTime,"s");
 }
 if(answer.numerator*source.solution.answer.denominator!==source.solution.answer.numerator*answer.denominator)throw new Error("Source mismatch");
 return Object.freeze({...source,...EDITORIAL_REVIEW_LOCK,locale:locales[index],version:"TSD-CP010-HANDICAP-WORKED-V1",calculations:Object.freeze(w.steps),explanation:Object.freeze({steps:Object.freeze(w.steps.map(s=>s.text)),conclusion:source.explanation.conclusion})});
})));
