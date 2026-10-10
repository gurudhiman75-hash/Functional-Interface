import { rational } from "../../TSD-001/foundation/rational";
import { calculationWriter, EDITORIAL_REVIEW_LOCK, type ReviewLocale } from "../../quality-audit/worked-calculation";
import { TSD_CP011_ENGLISH_REVIEW } from "./english-review-final";
import { TSD_CP011_NATIVE_HINDI_REVIEW, TSD_CP011_NATIVE_PUNJABI_REVIEW } from "./native-review-release";
const sources=[TSD_CP011_ENGLISH_REVIEW,TSD_CP011_NATIVE_HINDI_REVIEW,TSD_CP011_NATIVE_PUNJABI_REVIEW] as const;
const locales: readonly ReviewLocale[]=["en-IN","hi-IN","pa-IN"];
export const TSD_CP011_ESCALATOR_WORKED_REVIEW_V1=Object.freeze(sources.flatMap((rows,index)=>rows.filter(row=>!["wheelRollState","wheelRateTranslationState","twoWheelComparisonState"].includes(row.input.authorityKey)).map(source=>{
 const i=source.input,w=calculationWriter(locales[index]);
 const netLabel=["Effective rate","प्रभावी चाल","ਕੁੱਲ ਚਾਲ"] as const;
 const timeLabel=["Travel time","यात्रा का समय","ਸਫ਼ਰ ਦਾ ਸਮਾਂ"] as const;
 const answerLabel=["Required value","आवश्यक मान","ਲੋੜੀਂਦਾ ਮੁੱਲ"] as const;
 let answer;
 if(i.authorityKey==="movingSurfaceTravelState"){
  const rateUnit=i.measureUnit==="METRE"?"m/s":"steps/s",lengthUnit=i.measureUnit==="METRE"?"m":"steps";
  if(i.target==="TIME" || i.target==="LENGTH"){
   const net=w.binary(netLabel,i.personRate,i.direction==="SAME"?"+":"−",i.surfaceRate,rateUnit);
   answer=i.target==="TIME"?w.binary(timeLabel,i.length,"÷",net,"s"):w.binary(answerLabel,net,"×",i.time,lengthUnit);
  }else{
   const ground=w.binary(netLabel,i.length,"÷",i.time,rateUnit);
   answer=i.target==="PERSON_RATE"?w.binary(answerLabel,ground,i.direction==="SAME"?"−":"+",i.surfaceRate,rateUnit):i.direction==="SAME"?w.binary(answerLabel,ground,"−",i.personRate,rateUnit):w.binary(answerLabel,i.personRate,"−",ground,rateUnit);
  }
 }else if(i.authorityKey==="stationaryStepCountState"){
  if(i.target==="TOTAL_STEPS" || i.target==="WALKED_STEPS"){
   const net=w.binary(netLabel,i.personStepRate,i.direction==="SAME"?"+":"−",i.escalatorStepRate,"steps/s");
   const time=i.target==="TOTAL_STEPS"?w.binary(timeLabel,i.walkedSteps,"÷",i.personStepRate,"s"):w.binary(timeLabel,i.totalSteps,"÷",net,"s");
   answer=w.binary(answerLabel,time,"×",i.target==="TOTAL_STEPS"?net:i.personStepRate,"steps");
  }else{
   const contribution=i.direction==="SAME"?w.binary(["Escalator contribution","एस्केलेटर का योगदान","ਐਸਕੇਲੇਟਰ ਦਾ ਯੋਗਦਾਨ"],i.totalSteps,"−",i.walkedSteps,"steps"):w.binary(["Escalator contribution","एस्केलेटर का योगदान","ਐਸਕੇਲੇਟਰ ਦਾ ਯੋਗਦਾਨ"],i.walkedSteps,"−",i.totalSteps,"steps");
   const time=i.target==="PERSON_RATE"?w.binary(timeLabel,contribution,"÷",i.escalatorStepRate,"s"):w.binary(timeLabel,i.walkedSteps,"÷",i.personStepRate,"s");
   answer=w.binary(answerLabel,i.target==="PERSON_RATE"?i.walkedSteps:contribution,"÷",time,"steps/s");
  }
 }else if(i.authorityKey==="dualEscalatorObservationState"){
  const withRate=w.binary(["Rate with escalator per unit length","प्रति इकाई लंबाई अनुकूल चाल","ਪ੍ਰਤੀ ਇਕਾਈ ਲੰਬਾਈ ਅਨੁਕੂਲ ਚਾਲ"],rational(1),"÷",i.upTime,"1/s");
  const againstRate=w.binary(["Rate against escalator per unit length","प्रति इकाई लंबाई प्रतिकूल चाल","ਪ੍ਰਤੀ ਇਕਾਈ ਲੰਬਾਈ ਉਲਟੀ ਚਾਲ"],rational(1),"÷",i.downTime,"1/s");
  const sum=w.binary(["Sum of rates","चालों का योग","ਚਾਲਾਂ ਦਾ ਜੋੜ"],withRate,"+",againstRate,"1/s");
  const own=w.binary(["Own rate per unit length","प्रति इकाई लंबाई स्वयं की चाल","ਪ੍ਰਤੀ ਇਕਾਈ ਲੰਬਾਈ ਆਪਣੀ ਚਾਲ"],sum,"÷",rational(2),"1/s");
  if(i.target==="STOPPED_TIME")answer=w.binary(answerLabel,rational(1),"÷",own,"s");
  else{
   const difference=w.binary(["Rate difference","चालों का अंतर","ਚਾਲਾਂ ਦਾ ਫ਼ਰਕ"],withRate,"−",againstRate,"1/s");
   const surface=w.binary(["Surface rate per unit length","प्रति इकाई लंबाई एस्केलेटर की चाल","ਪ੍ਰਤੀ ਇਕਾਈ ਲੰਬਾਈ ਐਸਕੇਲੇਟਰ ਦੀ ਚਾਲ"],difference,"÷",rational(2),"1/s");
   answer=w.binary(answerLabel,own,"÷",surface,"");
  }
 }else if(i.authorityKey==="movingSurfaceStateComparison"){
  if(i.target==="COMBINED_TIME" || i.target==="TIME_SAVED"){
   const own=w.binary(["Walking rate per unit length","प्रति इकाई लंबाई चलने की चाल","ਪ੍ਰਤੀ ਇਕਾਈ ਲੰਬਾਈ ਤੁਰਨ ਦੀ ਚਾਲ"],rational(1),"÷",i.stoppedWalkingTime,"1/s");
   const surface=w.binary(["Surface rate per unit length","प्रति इकाई लंबाई सतह की चाल","ਪ੍ਰਤੀ ਇਕਾਈ ਲੰਬਾਈ ਸਤਹ ਦੀ ਚਾਲ"],rational(1),"÷",i.carriedStandingTime,"1/s");
   const net=w.binary(netLabel,own,"+",surface,"1/s");
   const time=w.binary(timeLabel,rational(1),"÷",net,"s");
   answer=i.target==="COMBINED_TIME"?time:w.binary(answerLabel,i.stoppedWalkingTime,"−",time,"s");
  }else{
   const combined=w.binary(netLabel,rational(1),"÷",i.combinedTime,"1/s");
   const known=w.binary(["Known component rate","ज्ञात चाल","ਪਤਾ ਹੋਈ ਚਾਲ"],rational(1),"÷",i.target==="STOPPED_WALKING_TIME"?i.carriedStandingTime:i.stoppedWalkingTime,"1/s");
   const missing=w.binary(["Missing component rate","अज्ञात चाल","ਅਣਜਾਣ ਚਾਲ"],combined,"−",known,"1/s");
   answer=w.binary(answerLabel,rational(1),"÷",missing,"s");
  }
 }else throw new Error("Wrong escalator authority");
 if(answer.numerator*source.solution.answer.denominator!==source.solution.answer.numerator*answer.denominator)throw new Error(`Answer mismatch ${source.familyId}`);
 return Object.freeze({...source,...EDITORIAL_REVIEW_LOCK,locale:locales[index],version:"TSD-CP011-ESCALATOR-WORKED-V1",calculations:Object.freeze(w.steps),explanation:Object.freeze({steps:Object.freeze(w.steps.map(step=>step.text)),conclusion:source.explanation.conclusion})});
})));
