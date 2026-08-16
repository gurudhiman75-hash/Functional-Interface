import { cubeRoot, e2Math, fmt, optionSet, packageE2, squareRoot, type SapE2Package } from "../../SAP-E2-TYPES";
import { SAP_CP012_E2_STRUCTURES as BASE_STRUCTURES, generateSapCp012E2 as generateR3B, type SapCp012E2Structure as BaseStructure } from "./runtime-release-r3b";

export const SAP_CP012_E2_STRUCTURES = Object.freeze([...BASE_STRUCTURES, "CP012-E2-MIXED-ROOT-POWER-SYNTHESIS"] as const);
export type SapCp012E2Structure = BaseStructure | "CP012-E2-MIXED-ROOT-POWER-SYNTHESIS";

const OFF = Object.freeze([-0.19,-0.13,-0.08,-0.03,0.04,0.09,0.14,0.21]);
function off(seed:number,salt:number){return OFF[(seed*7+salt*5)%OFF.length]!;}
function wrong(value:string,id:string,analysis:string){return {value,id,analysis};}

function mixedRootPowerSynthesis(seed:number):SapE2Package{
  if(!Number.isInteger(seed)||seed<1||seed>100)throw new Error("CP012 seed must be 1..100.");
  const p=seed-1,correctIndex=p%4;
  const u=8+(p%20);
  const cubeA=u*u,cubeB=u;
  const s=2+((p*3)%5),e=2+((p*7)%4);
  const rootC=s*e,rootD=s,rootE=e;
  const band=Math.floor(p/20),f=2+band,g=2+(p%3),i=20+band,h=2*s-f*g+i;
  const denominator=f*g+h-i;
  if(denominator!==2*s||h<=0)throw new Error("Invalid CP012 R4 denominator construction.");
  const scale=100,answer=50*u;
  const aD=cubeA+off(seed,0),bD=cubeB+off(seed,1),cD=rootC+off(seed,2),dD=rootD+off(seed,3),eD=rootE+off(seed,4),fD=f+off(seed,5),gD=g+off(seed,6),hD=h+off(seed,7),iD=i+off(seed,8);
  const stem=`What approximate value should replace ? in ${e2Math(`\\frac{${cubeRoot(`${fmt(aD)} \\times ${fmt(bD)}`)} \\times ${squareRoot(`\\frac{${fmt(cD)} \\times ${fmt(dD)}}{${fmt(eD)}}`)}}{${fmt(fD)} \\times ${fmt(gD)} + ${fmt(hD)} - ${fmt(iD)}} = \\frac{?}{${scale}}`)}?`;
  const step=Math.max(50,Math.round(answer*0.1/50)*50);
  return packageE2({profile:"BANK",checkpointId:"SAP-CP-012",structureId:"CP012-E2-MIXED-ROOT-POWER-SYNTHESIS",seed,difficulty:"HARD",decisionCount:9,stem,canonicalAnswer:String(answer),options:optionSet(String(answer),correctIndex,[wrong(String(answer-step),"SCALE_LOW","The final scale or one root estimate was taken too low."),wrong(String(answer+step),"SCALE_HIGH","The final scale or one root estimate was taken too high."),wrong(String(answer+2*step),"DENOMINATOR_OR_ROOT_SLIP","A denominator or root simplification slip changed the scaled value.")]),correctIndex,
    explanation:Object.freeze({coreConcept:"Approximate the cube-root block and square-root block separately, simplify the denominator, then apply the final scale.",steps:Object.freeze([`${e2Math(cubeRoot(`${cubeA} \\times ${cubeB}`))} = ${u} and ${e2Math(squareRoot(`\\frac{${rootC} \\times ${rootD}}{${rootE}}`))} = ${s}; the denominator is ${f} × ${g} + ${h} - ${i} = ${denominator}.`,`So the left side is approximately (${u} × ${s}) ÷ ${denominator} = ${u}/2 = ?/${scale}, giving ? ≈ ${answer}.`]),finalAnswer:`Therefore, ? ≈ ${answer}.`}),
    oracle:Object.freeze({kind:"CP012-E2-MIXED-ROOT-POWER-SYNTHESIS",data:Object.freeze({u,cubeA,cubeB,s,e,rootC,rootD,rootE,f,g,h,i,denominator,scale,answer,a_100:Math.round(aD*100),b_100:Math.round(bD*100),c_100:Math.round(cD*100),d_100:Math.round(dD*100),e_100:Math.round(eD*100),f_100:Math.round(fD*100),g_100:Math.round(gD*100),h_100:Math.round(hD*100),i_100:Math.round(iD*100),releaseVersion:"CP012_R4_MIXED_ROOT_POWER_SYNTHESIS"})})});
}

export function generateSapCp012E2(structureId:SapCp012E2Structure,seed:number):SapE2Package{
  if(structureId==="CP012-E2-MIXED-ROOT-POWER-SYNTHESIS")return mixedRootPowerSynthesis(seed);
  return generateR3B(structureId as BaseStructure,seed);
}
