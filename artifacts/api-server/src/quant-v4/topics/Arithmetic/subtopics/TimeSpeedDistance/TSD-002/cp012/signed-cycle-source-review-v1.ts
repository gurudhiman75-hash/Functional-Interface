import { add, ceilRational, compare, divide, multiply, rational, subtract, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import { EDITORIAL_REVIEW_LOCK } from "../../quality-audit/worked-calculation";

export type SignedCycleInput = Readonly<{ target: Rational; ascent: Rational; slip: Rational; ascentDuration: Rational; slipDuration: Rational }>;
const zero = rational(0);
export function solveSignedAscentCycle(i: SignedCycleInput) {
  if (![i.target,i.ascent,i.ascentDuration,i.slipDuration].every(v=>compare(v,zero)>0) || compare(i.slip,zero)<0) throw new Error("Invalid ascent/slip observations");
  const net = subtract(i.ascent,i.slip);
  let cycles = 0n;
  if (compare(i.target,i.ascent)>0) {
    if (compare(net,zero)<=0) throw new Error("Target is unreachable under this cycle");
    cycles = ceilRational(divide(subtract(i.target,i.ascent),net));
  }
  const priorHeight = multiply(rational(cycles),net);
  const remaining = subtract(i.target,priorHeight);
  const finalTime = multiply(divide(remaining,i.ascent),i.ascentDuration);
  const priorTime = multiply(rational(cycles),add(i.ascentDuration,i.slipDuration));
  return Object.freeze({cycles,net,priorHeight,remaining,finalTime,priorTime,time:add(priorTime,finalTime)});
}
const q=toMixedString;
export const TSD_CP012_SIGNED_CYCLE_REVIEW_V1 = Object.freeze([12,7,14,63,70,75].flatMap((height,index)=>{
  const input=Object.freeze({target:rational(height),ascent:rational(12),slip:rational(5),ascentDuration:rational(1),slipDuration:rational(1)});
  const s=solveSignedAscentCycle(input);
  const answer=q(s.time);
  const wrong=[rational(2*Number(ceilRational(divide(input.target,s.net)))),divide(input.target,input.ascent),add(s.priorTime,rational(1)),add(s.time,rational(1)),add(s.time,rational(2))];
  const distractors=[...new Set(wrong.map(q))].filter(v=>v!==answer).slice(0,3);
  const stems=[
    `A snail climbs 12 cm at a constant rate during the first hour and slips 5 cm during the next hour. This two-hour cycle repeats. How long does it take to reach the top of a ${height} cm pole?`,
    `एक घोंघा पहले घंटे में स्थिर दर से 12 सेमी चढ़ता है और अगले घंटे में 5 सेमी नीचे फिसलता है। यह दो घंटे का चक्र दोहराता रहता है। ${height} सेमी ऊँचे खंभे के शीर्ष तक पहुँचने में उसे कितना समय लगेगा?`,
    `ਇੱਕ ਘੋਗਾ ਪਹਿਲੇ ਘੰਟੇ ਵਿੱਚ ਇੱਕਸਾਰ ਦਰ ਨਾਲ 12 ਸੈਂਟੀਮੀਟਰ ਚੜ੍ਹਦਾ ਹੈ ਅਤੇ ਅਗਲੇ ਘੰਟੇ ਵਿੱਚ 5 ਸੈਂਟੀਮੀਟਰ ਹੇਠਾਂ ਖਿਸਕਦਾ ਹੈ। ਇਹ ਦੋ ਘੰਟਿਆਂ ਦਾ ਚੱਕਰ ਦੁਹਰਾਇਆ ਜਾਂਦਾ ਹੈ। ${height} ਸੈਂਟੀਮੀਟਰ ਉੱਚੇ ਖੰਭੇ ਦੇ ਸਿਖਰ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਉਸ ਨੂੰ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
  ];
  return (["en","hi","pa"] as const).map((locale,l)=>{
    const correctIndex=(index+l)%4,options=[...distractors];options.splice(correctIndex,0,answer);
    const lines=[
      [`Net gain per complete cycle = 12 − 5 = 7 cm.`, `Complete cycles before the final climb = ${s.cycles}. Height then = ${s.cycles} × 7 = ${q(s.priorHeight)} cm.`, `Remaining climb = ${height} − ${q(s.priorHeight)} = ${q(s.remaining)} cm.`, `Final climbing time = (${q(s.remaining)}/12) × 1 = ${q(s.finalTime)} hours.`, `Total time = ${q(s.priorTime)} + ${q(s.finalTime)} = ${answer} hours. No slip is counted after reaching the top.`],
      [`एक पूरे चक्र में बढ़ी ऊँचाई = 12 − 5 = 7 सेमी।`, `अंतिम चढ़ाई से पहले पूरे चक्र = ${s.cycles}। तब ऊँचाई = ${s.cycles} × 7 = ${q(s.priorHeight)} सेमी।`, `शेष चढ़ाई = ${height} − ${q(s.priorHeight)} = ${q(s.remaining)} सेमी।`, `अंतिम चढ़ाई का समय = (${q(s.remaining)}/12) × 1 = ${q(s.finalTime)} घंटे।`, `कुल समय = ${q(s.priorTime)} + ${q(s.finalTime)} = ${answer} घंटे। शीर्ष पर पहुँचने के बाद फिसलने का समय नहीं जोड़ेंगे।`],
      [`ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਵਿੱਚ ਵਧੀ ਉਚਾਈ = 12 − 5 = 7 ਸੈਂਟੀਮੀਟਰ।`, `ਆਖ਼ਰੀ ਚੜ੍ਹਾਈ ਤੋਂ ਪਹਿਲਾਂ ਪੂਰੇ ਚੱਕਰ = ${s.cycles}। ਉਸ ਵੇਲੇ ਉਚਾਈ = ${s.cycles} × 7 = ${q(s.priorHeight)} ਸੈਂਟੀਮੀਟਰ।`, `ਬਾਕੀ ਚੜ੍ਹਾਈ = ${height} − ${q(s.priorHeight)} = ${q(s.remaining)} ਸੈਂਟੀਮੀਟਰ।`, `ਆਖ਼ਰੀ ਚੜ੍ਹਾਈ ਦਾ ਸਮਾਂ = (${q(s.remaining)}/12) × 1 = ${q(s.finalTime)} ਘੰਟੇ।`, `ਕੁੱਲ ਸਮਾਂ = ${q(s.priorTime)} + ${q(s.finalTime)} = ${answer} ਘੰਟੇ। ਸਿਖਰ ਉੱਤੇ ਪਹੁੰਚਣ ਤੋਂ ਬਾਅਦ ਖਿਸਕਣ ਦਾ ਸਮਾਂ ਨਹੀਂ ਜੋੜਾਂਗੇ।`],
    ];
    return Object.freeze({...EDITORIAL_REVIEW_LOCK,version:"TSD-CP012-SIGNED-CYCLE-SOURCE-REVIEW-V1",authorityKey:"periodicTravelRestProgramState",familyId:`TSD-CP012-SIGNED-CYCLE-${index+1}`,locale,input,solution:s,stem:stems[l],answerText:answer,answerUnit:"HOUR",options:Object.freeze(options),correctIndex,explanation:Object.freeze({steps:Object.freeze(lines[l])})});
  });
}));
