import { e2Math, fmt, optionSet, packageE2, squareRoot, type SapE2Package } from "../../SAP-E2-TYPES";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 as generateR3, type SapCp012E2Structure } from "./runtime-release-r3";

export { SAP_CP012_E2_STRUCTURES };
export type { SapCp012E2Structure };

const OFF = Object.freeze([-0.18,-0.11,-0.06,-0.02,0.03,0.07,0.12,0.19]);
function off(seed:number,salt:number){return OFF[(seed*5+salt*3)%OFF.length]!;}
function wrong(value:string,id:string,analysis:string){return {value,id,analysis};}
function cube(seed:number):SapE2Package{
  if(!Number.isInteger(seed)||seed<1||seed>100)throw new Error("CP012 seed must be 1..100.");
  const p=seed-1,correctIndex=p%4,answer=3+(p%6),root=8+(p%17),percent=[20,25,50][p%3]!,den=100/percent,numerator=root*den;
  const nd=numerator+off(seed,0),rad=root**2+off(seed,2),bd=answer+off(seed,4),pct=percent+off(seed,6);
  const stem=`What approximate value should replace ? in ${e2Math(`${fmt(nd)} \\div ${squareRoot(fmt(rad))} \\times \\left(${fmt(pct)}\\% \\text{ of } (${fmt(bd)})^{3}\\right) = ?^{3}`)}?`;
  return packageE2({profile:"BANK",checkpointId:"SAP-CP-012",structureId:"CP012-E2-MISSING-CUBE-ROOT",seed,difficulty:"HARD",decisionCount:7,stem,canonicalAnswer:String(answer),options:optionSet(String(answer),correctIndex,[wrong(String(answer-1),"CUBE_LOW","The recovered cube root was one step too low."),wrong(String(answer+1),"CUBE_HIGH","The recovered cube root was one step too high."),wrong(String(answer+2),"MIXED_ARITHMETIC_SLIP","A root, percentage or cube step changed the result.")]),correctIndex,
  explanation:Object.freeze({coreConcept:"Use the nearby perfect square and simple percentage, simplify the multiplier, then match the resulting perfect cube.",steps:Object.freeze([`${fmt(nd)} ≈ ${numerator}, ${e2Math(squareRoot(fmt(rad)))} ≈ ${root}, ${fmt(pct)}% ≈ ${percent}% and ${fmt(bd)} ≈ ${answer}.`,`${numerator} ÷ ${root} × (${percent}% of ${answer}³) = ${den} × (${answer**3}/${den}) = ${answer**3}; hence ? ≈ ${answer}.`]),finalAnswer:`Therefore, ? ≈ ${answer}.`}),oracle:Object.freeze({kind:"CP012-E2-MISSING-CUBE-ROOT",data:Object.freeze({answer,root,percent,den,numerator,n_100:Math.round(nd*100),rad_100:Math.round(rad*100),base_100:Math.round(bd*100),pct_100:Math.round(pct*100),cube:answer**3,releaseVersion:"CP012_R3B_ROOT_PERCENT_CUBE"})})});
}
export function generateSapCp012E2(structureId:SapCp012E2Structure,seed:number):SapE2Package{return structureId==="CP012-E2-MISSING-CUBE-ROOT"?cube(seed):generateR3(structureId,seed);}
