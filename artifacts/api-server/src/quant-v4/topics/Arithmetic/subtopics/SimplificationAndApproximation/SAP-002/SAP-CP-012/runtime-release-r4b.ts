import { cubeRoot, e2Math, fmt, optionSet, packageE2, squareRoot, type SapE2Package } from "../../SAP-E2-TYPES";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 as generateR4, type SapCp012E2Structure } from "./runtime-release-r4";

export { SAP_CP012_E2_STRUCTURES };
export type { SapCp012E2Structure };

const ROOT_OFF = Object.freeze([-0.08,-0.05,-0.03,-0.01,0.02,0.04,0.06,0.08]);
const DEN_OFF = Object.freeze([-0.06,-0.03,-0.01,0.02,0.04,0.07]);
function ro(seed:number,salt:number){return ROOT_OFF[(seed*5+salt*3)%ROOT_OFF.length]!;}
function dOff(seed:number,salt:number){return DEN_OFF[(seed*7+salt*5)%DEN_OFF.length]!;}
function wrong(value:string,id:string,analysis:string){return {value,id,analysis};}

function synthesis(seed:number):SapE2Package{
 if(!Number.isInteger(seed)||seed<1||seed>100)throw new Error("CP012 seed must be 1..100.");
 const p=seed-1,correctIndex=p%4,u=8+(p%20),cubeA=u*u,cubeB=u;
 const s=2+((p*3)%5),e=2+((p*7)%4),rootC=s*e,rootD=s,rootE=e;
 const band=Math.floor(p/20),f=2+band,g=2+(p%3),i=20+band;
 const aD=cubeA+ro(seed,0),bD=cubeB+ro(seed,1),cD=rootC+ro(seed,2),dD=rootD+ro(seed,3),eD=rootE+ro(seed,4);
 const fD=f+dOff(seed,0),gD=g+dOff(seed,1),iD=i+dOff(seed,2);
 const targetDen=2*s;
 const hD=targetDen-fD*gD+iD;
 const scale=100,answer=50*u,step=Math.max(50,Math.round(answer*0.1/50)*50);
 const stem=`What approximate value should replace ? in ${e2Math(`\\frac{${cubeRoot(`${fmt(aD)} \\times ${fmt(bD)}`)} \\times ${squareRoot(`\\frac{${fmt(cD)} \\times ${fmt(dD)}}{${fmt(eD)}}`)}}{${fmt(fD)} \\times ${fmt(gD)} + ${fmt(hD)} - ${fmt(iD)}} = \\frac{?}{${scale}}`)}?`;
 return packageE2({profile:"BANK",checkpointId:"SAP-CP-012",structureId:"CP012-E2-MIXED-ROOT-POWER-SYNTHESIS",seed,difficulty:"HARD",decisionCount:9,stem,canonicalAnswer:String(answer),options:optionSet(String(answer),correctIndex,[wrong(String(answer-step),"SCALE_LOW","The final scale or one root estimate was taken too low."),wrong(String(answer+step),"SCALE_HIGH","The final scale or one root estimate was taken too high."),wrong(String(answer+2*step),"DENOMINATOR_OR_ROOT_SLIP","A denominator or root simplification slip changed the scaled value.")]),correctIndex,
 explanation:Object.freeze({coreConcept:"Approximate the cube-root and square-root blocks separately, simplify the denominator, then apply the final scale.",steps:Object.freeze([`${e2Math(cubeRoot(`${cubeA} \\times ${cubeB}`))} = ${u} and ${e2Math(squareRoot(`\\frac{${rootC} \\times ${rootD}}{${rootE}}`))} = ${s}; the denominator is about ${targetDen}.`,`So the left side is about (${u} × ${s}) ÷ ${targetDen} = ${u}/2 = ?/${scale}, giving ? ≈ ${answer}.`]),finalAnswer:`Therefore, ? ≈ ${answer}.`}),
 oracle:Object.freeze({kind:"CP012-E2-MIXED-ROOT-POWER-SYNTHESIS",data:Object.freeze({u,cubeA,cubeB,s,e,rootC,rootD,rootE,f,g,i,targetDen,scale,answer,a_100:Math.round(aD*100),b_100:Math.round(bD*100),c_100:Math.round(cD*100),d_100:Math.round(dD*100),e_100:Math.round(eD*100),f_100:Math.round(fD*100),g_100:Math.round(gD*100),h_100:Math.round(hD*100),i_100:Math.round(iD*100),releaseVersion:"CP012_R4B_STABLE_MIXED_SYNTHESIS"})})});
}

export function generateSapCp012E2(structureId:SapCp012E2Structure,seed:number):SapE2Package{
 return structureId==="CP012-E2-MIXED-ROOT-POWER-SYNTHESIS"?synthesis(seed):generateR4(structureId,seed);
}
