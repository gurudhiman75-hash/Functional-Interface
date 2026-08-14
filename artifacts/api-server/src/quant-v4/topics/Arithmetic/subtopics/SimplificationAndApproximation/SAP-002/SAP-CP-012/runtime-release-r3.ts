import { e2Math, fmt, optionSet, packageE2, squareRoot, type SapE2Package } from "../../SAP-E2-TYPES";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 as generateV2, type SapCp012E2Structure } from "./runtime-release";

export { SAP_CP012_E2_STRUCTURES };
export type { SapCp012E2Structure };

const OFF = Object.freeze([-0.18, -0.11, -0.06, -0.02, 0.03, 0.07, 0.12, 0.19]);
function off(seed:number,salt:number){ return OFF[(seed*5+salt*3)%OFF.length]!; }
function wrong(value:string,id:string,analysis:string){ return {value,id,analysis}; }
function numericWrongs(answer:number,step=1){ return [wrong(String(answer-step),"ROOT_LOW","The recovered root was taken one step too low."),wrong(String(answer+step),"ROOT_HIGH","The recovered root was taken one step too high."),wrong(String(answer+2*step),"MIXED_ARITHMETIC_SLIP","A product, quotient or transposition slip changed the recovered value.")]; }
function checkSeed(seed:number){ if(!Number.isInteger(seed)||seed<1||seed>100) throw new Error("CP012 seed must be 1..100."); }

function missingSquareRootR3(seed:number):SapE2Package{
  checkSeed(seed); const p=seed-1,correctIndex=p%4;
  const answer=18+(p%12);
  const d1=5+(p%3), k1=6+((p*3)%7), m1=6+((p*5)%5), n1=d1*k1, term1=k1*m1;
  const d2=7+((p*2)%4), k2=5+((p*7)%6), m2=5+((p*3)%5), n2=d2*k2, term2=k2*m2;
  const c=answer**2-term1-term2;
  const n1d=n1+off(seed,0),m1d=m1+off(seed,1),d1d=d1+off(seed,2),n2d=n2+off(seed,3),m2d=m2+off(seed,4),d2d=d2+off(seed,5),cd=c+off(seed,6);
  const stem=`What approximate value should replace ? in ${e2Math(`${fmt(n1d)} \\times ${fmt(m1d)} \\div ${fmt(d1d)} + ${fmt(n2d)} \\times ${fmt(m2d)} \\div ${fmt(d2d)} + ${fmt(cd)} = ?^{2}`)}?`;
  return packageE2({profile:"BANK",checkpointId:"SAP-CP-012",structureId:"CP012-E2-MISSING-SQUARE-ROOT",seed,difficulty:"HARD",decisionCount:8,stem,canonicalAnswer:String(answer),options:optionSet(String(answer),correctIndex,numericWrongs(answer,2)),correctIndex,
    explanation:Object.freeze({coreConcept:"Approximate each product-quotient block separately, combine the terms, then identify the positive square root.",steps:Object.freeze([`${n1} × ${m1} ÷ ${d1} = ${term1} and ${n2} × ${m2} ÷ ${d2} = ${term2}.`,`${term1} + ${term2} + ${c} = ${answer**2}, so ? ≈ ${answer}.`]),finalAnswer:`Therefore, ? ≈ ${answer}.`}),
    oracle:Object.freeze({kind:"CP012-E2-MISSING-SQUARE-ROOT",data:Object.freeze({answer,d1,k1,m1,n1,term1,d2,k2,m2,n2,term2,c,n1_100:Math.round(n1d*100),m1_100:Math.round(m1d*100),d1_100:Math.round(d1d*100),n2_100:Math.round(n2d*100),m2_100:Math.round(m2d*100),d2_100:Math.round(d2d*100),c_100:Math.round(cd*100),releaseVersion:"CP012_R3_MULTI_BLOCK_SQUARE"})})});
}

function missingCubeRootR3(seed:number):SapE2Package{
  checkSeed(seed); const p=seed-1,correctIndex=p%4;
  const answer=3+(p%6), root=8+((p*3)%9);
  const percent=[20,25,50][p%3]!, den=100/percent, numerator=root*den;
  const nd=numerator+off(seed,0), rad=root**2+off(seed,2), bd=answer+off(seed,4), pct=percent+off(seed,6);
  const stem=`What approximate value should replace ? in ${e2Math(`${fmt(nd)} \\div ${squareRoot(fmt(rad))} \\times \\left(${fmt(pct)}\\% \\text{ of } (${fmt(bd)})^{3}\\right) = ?^{3}`)}?`;
  return packageE2({profile:"BANK",checkpointId:"SAP-CP-012",structureId:"CP012-E2-MISSING-CUBE-ROOT",seed,difficulty:"HARD",decisionCount:7,stem,canonicalAnswer:String(answer),options:optionSet(String(answer),correctIndex,numericWrongs(answer,1)),correctIndex,
    explanation:Object.freeze({coreConcept:"Use the nearby perfect square and simple percentage, simplify the multiplier, then match the resulting perfect cube.",steps:Object.freeze([`${fmt(nd)} ≈ ${numerator}, ${e2Math(squareRoot(fmt(rad)))} ≈ ${root}, ${fmt(pct)}% ≈ ${percent}% and ${fmt(bd)} ≈ ${answer}.`,`${numerator} ÷ ${root} × (${percent}% of ${answer}³) = ${den} × (${answer**3}/${den}) = ${answer**3}; hence ? ≈ ${answer}.`]),finalAnswer:`Therefore, ? ≈ ${answer}.`}),
    oracle:Object.freeze({kind:"CP012-E2-MISSING-CUBE-ROOT",data:Object.freeze({answer,root,percent,den,numerator,n_100:Math.round(nd*100),rad_100:Math.round(rad*100),base_100:Math.round(bd*100),pct_100:Math.round(pct*100),cube:answer**3,releaseVersion:"CP012_R3_ROOT_PERCENT_CUBE"})})});
}

function missingPercentageR3(seed:number):SapE2Package{
  checkSeed(seed); const p=seed-1,correctIndex=p%4;
  const answer=[20,25,30,40,50,60][p%6]!;
  const base=(8+(p%13))*20;
  const knownBase=(12+((p*5)%14))*10, knownPct=10;
  const lhs=answer*base/100+knownBase/10;
  const squareBase=Math.ceil(Math.sqrt(lhs+35))+(p%3);
  const rightPct=20, rightBase=5*(squareBase**2-lhs);
  const bd=base+off(seed,0),kbd=knownBase+off(seed,1),kp=knownPct+off(seed,2),sd=squareBase+off(seed,3),rp=rightPct+off(seed,4),rbd=rightBase+off(seed,5);
  const answerText=`${answer}%`;
  const stem=`What approximate value should replace ? in ${e2Math(`?\\% \\text{ of } ${fmt(bd)} + ${fmt(kp)}\\% \\text{ of } ${fmt(kbd)} = (${fmt(sd)})^{2} - ${fmt(rp)}\\% \\text{ of } ${fmt(rbd)}`)}?`;
  const lows=Math.max(5,answer-10), highs=answer+10;
  return packageE2({profile:"BANK",checkpointId:"SAP-CP-012",structureId:"CP012-E2-MISSING-PERCENTAGE",seed,difficulty:"HARD",decisionCount:7,stem,canonicalAnswer:answerText,options:optionSet(answerText,correctIndex,[wrong(`${lows}%`,"RATE_LOW","The unknown percentage was recovered too low."),wrong(`${highs}%`,"RATE_HIGH","The unknown percentage was recovered too high."),wrong(`${answer+20}%`,"SIDE_OR_SCALE_SLIP","A side-transposition or percentage-scale slip changed the rate.")]),correctIndex,
    explanation:Object.freeze({coreConcept:"Approximate both sides, evaluate the known percentage and square terms, then isolate the unknown percentage contribution.",steps:Object.freeze([`${knownPct}% of ${knownBase} = ${knownBase/10}, while ${squareBase}² - ${rightPct}% of ${rightBase} = ${squareBase**2} - ${rightBase/5} = ${lhs}.`,`So ?% of ${base} = ${lhs} - ${knownBase/10} = ${answer*base/100}; therefore ? ≈ ${answer}%.`]),finalAnswer:`Therefore, ? ≈ ${answerText}.`}),
    oracle:Object.freeze({kind:"CP012-E2-MISSING-PERCENTAGE",data:Object.freeze({answerPct:answer,base,knownBase,knownPct,lhs,squareBase,rightPct,rightBase,b_100:Math.round(bd*100),knownBase_100:Math.round(kbd*100),knownPct_100:Math.round(kp*100),squareBase_100:Math.round(sd*100),rightPct_100:Math.round(rp*100),rightBase_100:Math.round(rbd*100),releaseVersion:"CP012_R3_TWO_SIDED_PERCENT_POWER"})})});
}

export function generateSapCp012E2(structureId:SapCp012E2Structure,seed:number):SapE2Package{
  if(structureId==="CP012-E2-MISSING-SQUARE-ROOT") return missingSquareRootR3(seed);
  if(structureId==="CP012-E2-MISSING-CUBE-ROOT") return missingCubeRootR3(seed);
  if(structureId==="CP012-E2-MISSING-PERCENTAGE") return missingPercentageR3(seed);
  return generateV2(structureId,seed);
}
