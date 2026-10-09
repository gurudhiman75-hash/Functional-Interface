import { absRational, rational } from "../../TSD-001/foundation/rational";
import { calculationWriter, EDITORIAL_REVIEW_LOCK, type ReviewLocale } from "../../quality-audit/worked-calculation";
import { TSD_CP011_ENGLISH_REVIEW } from "./english-review-final";
import { TSD_CP011_NATIVE_HINDI_REVIEW, TSD_CP011_NATIVE_PUNJABI_REVIEW } from "./native-review-release";
const sources=[TSD_CP011_ENGLISH_REVIEW,TSD_CP011_NATIVE_HINDI_REVIEW,TSD_CP011_NATIVE_PUNJABI_REVIEW] as const;
const locales: readonly ReviewLocale[]=["en-IN","hi-IN","pa-IN"];
export const TSD_CP011_WHEEL_WORKED_REVIEW_V1=Object.freeze(sources.flatMap((rows,index)=>rows.filter(row=>["wheelRollState","wheelRateTranslationState","twoWheelComparisonState"].includes(row.input.authorityKey)).map(source=>{
 const i=source.input,w=calculationWriter(locales[index]);
 let answer;
 if(i.authorityKey==="wheelRollState") {
  if(i.target==="DISTANCE") answer=w.binary(["Distance","दूरी","ਦੂਰੀ"],i.circumference,"×",i.revolutions,"m");
  else if(i.target==="REVOLUTIONS") answer=w.binary(["Revolutions","चक्कर","ਚੱਕਰ"],i.distance,"÷",i.circumference,"rev");
  else {
   const circumference=w.binary(["Circumference","परिधि","ਘੇਰਾ"],i.distance,"÷",i.revolutions,"m");
   if(i.target==="CIRCUMFERENCE")answer=circumference;
   else {
    const diameter=w.binary(["Diameter","व्यास","ਵਿਆਸ"],circumference,"÷",i.pi,"m");
    answer=i.target==="DIAMETER"?diameter:w.binary(["Radius","त्रिज्या","ਅਰਧ ਵਿਆਸ"],diameter,"÷",rational(2),"m");
   }
  }
 } else if(i.authorityKey==="wheelRateTranslationState") {
  if(i.target==="RPM")answer=w.binary(["Revolutions per minute","प्रति मिनट चक्कर","ਪ੍ਰਤੀ ਮਿੰਟ ਚੱਕਰ"],i.linearSpeedPerMinute,"÷",i.circumference,"rpm");
  else {
   const rate=w.binary(["Distance per minute","प्रति मिनट दूरी","ਪ੍ਰਤੀ ਮਿੰਟ ਦੂਰੀ"],i.circumference,"×",i.rpm,"m/min");
   answer=i.target==="LINEAR_SPEED"?rate:i.target==="DISTANCE"?w.binary(["Distance","दूरी","ਦੂਰੀ"],rate,"×",i.timeMinutes,"m"):w.binary(["Time","समय","ਸਮਾਂ"],i.distance,"÷",rate,"min");
  }
 } else if(i.authorityKey==="twoWheelComparisonState") {
  if(i.target==="REVOLUTION_RATIO")answer=w.binary(["First to second revolution ratio","पहले और दूसरे पहिये के चक्करों का अनुपात","ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਪਹੀਏ ਦੇ ਚੱਕਰਾਂ ਦਾ ਅਨੁਪਾਤ"],i.circumferenceB,"÷",i.circumferenceA,"");
  else {
   const a=w.binary(["First wheel revolutions","पहले पहिये के चक्कर","ਪਹਿਲੇ ਪਹੀਏ ਦੇ ਚੱਕਰ"],i.distance,"÷",i.circumferenceA,"rev");
   const b=w.binary(["Second wheel revolutions","दूसरे पहिये के चक्कर","ਦੂਜੇ ਪਹੀਏ ਦੇ ਚੱਕਰ"],i.distance,"÷",i.circumferenceB,"rev");
   const difference=w.binary(["Signed difference","चक्करों का अंतर","ਚੱਕਰਾਂ ਦਾ ਫ਼ਰਕ"],a,"−",b,"rev");
   answer=w.put(["Difference in revolution counts","चक्करों की संख्या का अंतर","ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਫ਼ਰਕ"],`|${difference.numerator}/${difference.denominator}|`,absRational(difference),"rev");
  }
 } else throw new Error("Wrong wheel authority");
 if(answer.numerator*source.solution.answer.denominator!==source.solution.answer.numerator*answer.denominator)throw new Error(`Source answer mismatch: ${source.familyId}`);
 return Object.freeze({...source,...EDITORIAL_REVIEW_LOCK,locale:locales[index],version:"TSD-CP011-WHEEL-WORKED-V1",calculations:Object.freeze(w.steps),explanation:Object.freeze({steps:Object.freeze(w.steps.map(step=>step.text)),conclusion:source.explanation.conclusion})});
})));
