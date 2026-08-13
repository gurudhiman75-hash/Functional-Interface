import type { ExactPiSurd, ExactRational, ExactValue, Men002Unit } from "../foundation/types";
import { exactEquals, exactKey, multiply, pi, rational, surd } from "../foundation/exact";
import { createSeededRandom } from "../foundation/seed";
import { getMenCp010Prototype } from "./registry";
import { MEN_CP_010_AUTHORITY, MEN_CP_010_ID, type MenCp010PiPolicy, type MenCp010PrototypeId, type MenCp010State } from "./types";

const TRIPLES = [[3n,4n,5n],[4n,3n,5n],[5n,12n,13n],[12n,5n,13n],[8n,15n,17n],[15n,8n,17n]] as const;
const sq = (v: bigint) => v * v;
export const answerPosition = (seed: string) => [...seed].reduce((n,c)=>n+c.charCodeAt(0),0)%4;

export function scaleMenCp010(v: ExactValue, n: bigint|number, d: bigint|number=1): ExactValue {
  const f=rational(n,d);
  if(v.kind==="RATIONAL") return multiply(v,f);
  if(v.kind==="PI"){const c=multiply(v.coefficient,f);return pi(c.numerator,c.denominator);}
  if(v.kind==="SURD"){const c=multiply(v.coefficient,f);return surd(c.numerator,v.radicand,c.denominator);}
  const c=multiply(v.coefficient,f); return {kind:"PI_SURD",coefficient:c,radicand:v.radicand} satisfies ExactPiSurd;
}
function withPi(c: ExactRational, p: MenCp010PiPolicy): ExactValue {
  if(p==="EXACT_PI") return pi(c.numerator,c.denominator);
  return multiply(c,p==="PI_22_OVER_7"?rational(22,7):rational(157,50));
}

export function buildMenCp010State(id: MenCp010PrototypeId, seed: string): MenCp010State {
  const def=getMenCp010Prototype(id), rng=createSeededRandom(`${MEN_CP_010_AUTHORITY}:${id}:${seed}`);
  const baseUnit=rng.pick(["cm","m"] as const); const areaUnit:Men002Unit=baseUnit==="cm"?"cm²":"m²"; const volUnit:Men002Unit=baseUnit==="cm"?"cm³":"m³";
  const unit:Men002Unit=def.target==="LENGTH"?baseUnit:def.target==="VOLUME"?volUnit:areaUnit;
  const d:Record<string,bigint>={}; const [x,h,l]=rng.pick(TRIPLES);
  if(id.includes("SQUARE-PYRAMID-VOLUME")&&!id.includes("HEIGHT")){d.side=BigInt(rng.int(4,16));d.height=BigInt(rng.int(2,8)*3);}
  else if(id.includes("HEIGHT-FROM-VOLUME")){d.side=BigInt(rng.int(4,15));d.height=BigInt(rng.int(5,18));d.givenVolumeNumerator=sq(d.side)*d.height;d.givenVolumeDenominator=3n;}
  else if(id.includes("RECTANGULAR-PYRAMID")){d.length=BigInt(rng.int(5,16));d.breadth=BigInt(rng.int(4,12));d.height=BigInt(rng.int(2,8)*3);}
  else if(id.includes("TRIANGULAR-PYRAMID")){d.baseArea=BigInt(rng.int(8,24)*3);d.height=BigInt(rng.int(4,15));}
  else if(id.includes("CONICAL-FRUSTUM")){d.radiusDifference=x;d.height=h;d.slantHeight=l;d.innerRadius=BigInt(rng.int(2,8));d.outerRadius=d.innerRadius+x;}
  else if(id.includes("SQUARE-FRUSTUM")){d.halfSideDifference=x;d.height=h;d.slantHeight=l;d.upperSide=BigInt(rng.int(2,8));d.lowerSide=d.upperSide+2n*x;}
  else {d.halfSide=x;d.side=2n*x;d.height=h;d.slantHeight=l;}
  const piPolicy=def.usesPi?createSeededRandom(`${id}:${seed}:pi`).pick(["EXACT_PI","PI_22_OVER_7","PI_3_14"] as const):null;
  return {authority:MEN_CP_010_AUTHORITY,packageId:"MEN-002",canonicalProblemId:MEN_CP_010_ID,permanentQlId:null,prototypeId:id,solveMode:def.solveMode,seed,shape:def.shape,target:def.target,difficulty:def.difficultyFloor,piPolicy,unit,dimensions:d,derived:{},contextId:def.shape.toLowerCase()};
}

export function solveMenCp010(s: MenCp010State): ExactValue {
  const d=s.dimensions;
  switch(s.prototypeId){
    case "MEN-CP010-PROT-SQUARE-PYRAMID-VOLUME":return rational(sq(d.side!)*d.height!,3);
    case "MEN-CP010-PROT-SQUARE-PYRAMID-HEIGHT-FROM-VOLUME":return rational(d.height!);
    case "MEN-CP010-PROT-RECTANGULAR-PYRAMID-VOLUME":return rational(d.length!*d.breadth!*d.height!,3);
    case "MEN-CP010-PROT-TRIANGULAR-PYRAMID-VOLUME":return rational(d.baseArea!*d.height!,3);
    case "MEN-CP010-PROT-SQUARE-PYRAMID-SLANT-HEIGHT":return rational(d.slantHeight!);
    case "MEN-CP010-PROT-SQUARE-PYRAMID-VERTICAL-HEIGHT":return rational(d.height!);
    case "MEN-CP010-PROT-SQUARE-PYRAMID-LSA":return rational(2n*d.side!*d.slantHeight!);
    case "MEN-CP010-PROT-SQUARE-PYRAMID-TSA":return rational(sq(d.side!)+2n*d.side!*d.slantHeight!);
    case "MEN-CP010-PROT-CONICAL-FRUSTUM-SLANT-HEIGHT":return rational(d.slantHeight!);
    case "MEN-CP010-PROT-CONICAL-FRUSTUM-VOLUME":return withPi(rational(d.height!*(sq(d.outerRadius!)+d.outerRadius!*d.innerRadius!+sq(d.innerRadius!)),3),s.piPolicy!);
    case "MEN-CP010-PROT-CONICAL-FRUSTUM-CSA":return withPi(rational((d.outerRadius!+d.innerRadius!)*d.slantHeight!),s.piPolicy!);
    case "MEN-CP010-PROT-CONICAL-FRUSTUM-TSA":return withPi(rational((d.outerRadius!+d.innerRadius!)*d.slantHeight!+sq(d.outerRadius!)+sq(d.innerRadius!)),s.piPolicy!);
    case "MEN-CP010-PROT-SQUARE-FRUSTUM-SLANT-HEIGHT":return rational(d.slantHeight!);
    case "MEN-CP010-PROT-SQUARE-FRUSTUM-VOLUME":return rational(d.height!*(sq(d.lowerSide!)+d.lowerSide!*d.upperSide!+sq(d.upperSide!)),3);
    case "MEN-CP010-PROT-SQUARE-FRUSTUM-LSA":return rational(2n*(d.lowerSide!+d.upperSide!)*d.slantHeight!);
    case "MEN-CP010-PROT-SQUARE-FRUSTUM-TSA":return rational(2n*(d.lowerSide!+d.upperSide!)*d.slantHeight!+sq(d.lowerSide!)+sq(d.upperSide!));
  }
}

export function distractorsMenCp010(s: MenCp010State, correct: ExactValue){
  const d=s.dimensions; const scaled=[{value:scaleMenCp010(correct,3),misconceptionId:"OMIT_ONE_THIRD"},{value:scaleMenCp010(correct,2),misconceptionId:"DOUBLE_RESULT"},{value:scaleMenCp010(correct,1,2),misconceptionId:"HALVE_RESULT"}];
  if(s.prototypeId.includes("SLANT-HEIGHT")){const x=s.prototypeId.includes("CONICAL")?d.radiusDifference!:s.prototypeId.includes("SQUARE-FRUSTUM")?d.halfSideDifference!:d.halfSide!;return [{value:rational(d.height!),misconceptionId:"USE_VERTICAL_HEIGHT"},{value:rational(x),misconceptionId:"USE_HORIZONTAL_OFFSET"},{value:rational(d.height!+x),misconceptionId:"ADD_RIGHT_TRIANGLE_LEGS"}];}
  if(s.prototypeId==="MEN-CP010-PROT-SQUARE-PYRAMID-VERTICAL-HEIGHT") return [{value:rational(d.slantHeight!),misconceptionId:"RETURN_SLANT_HEIGHT"},{value:rational(d.halfSide!),misconceptionId:"RETURN_HALF_BASE"},{value:rational(d.slantHeight!-d.halfSide!),misconceptionId:"SUBTRACT_LENGTHS"}];
  if(s.prototypeId==="MEN-CP010-PROT-SQUARE-PYRAMID-LSA") return [{value:rational(d.side!*d.slantHeight!,2),misconceptionId:"ONE_FACE_ONLY"},{value:rational(sq(d.side!)),misconceptionId:"BASE_ONLY"},scaled[1]];
  if(s.prototypeId==="MEN-CP010-PROT-SQUARE-PYRAMID-TSA") return [{value:rational(2n*d.side!*d.slantHeight!),misconceptionId:"OMIT_BASE"},{value:rational(sq(d.side!)),misconceptionId:"BASE_ONLY"},scaled[1]];
  if(s.prototypeId==="MEN-CP010-PROT-CONICAL-FRUSTUM-VOLUME") return [scaled[0],{value:withPi(rational(d.height!*(sq(d.outerRadius!)+sq(d.innerRadius!)),3),s.piPolicy!),misconceptionId:"OMIT_Rr_TERM"},scaled[2]];
  if(s.prototypeId==="MEN-CP010-PROT-CONICAL-FRUSTUM-CSA") return [{value:withPi(rational((d.outerRadius!-d.innerRadius!)*d.slantHeight!),s.piPolicy!),misconceptionId:"USE_RADIUS_DIFFERENCE"},{value:withPi(rational(d.outerRadius!*d.slantHeight!),s.piPolicy!),misconceptionId:"USE_OUTER_RADIUS_ONLY"},scaled[1]];
  if(s.prototypeId==="MEN-CP010-PROT-CONICAL-FRUSTUM-TSA") return [{value:withPi(rational((d.outerRadius!+d.innerRadius!)*d.slantHeight!),s.piPolicy!),misconceptionId:"OMIT_BASES"},{value:withPi(rational((d.outerRadius!+d.innerRadius!)*d.slantHeight!+sq(d.outerRadius!)),s.piPolicy!),misconceptionId:"ADD_ONE_BASE"},scaled[1]];
  if(s.prototypeId==="MEN-CP010-PROT-SQUARE-FRUSTUM-VOLUME") return [scaled[0],{value:rational(d.height!*(sq(d.lowerSide!)+sq(d.upperSide!)),3),misconceptionId:"OMIT_Aa_TERM"},scaled[2]];
  if(s.prototypeId==="MEN-CP010-PROT-SQUARE-FRUSTUM-LSA") return [{value:rational((d.lowerSide!+d.upperSide!)*d.slantHeight!,2),misconceptionId:"ONE_TRAPEZOID_ONLY"},{value:rational(2n*(d.lowerSide!-d.upperSide!)*d.slantHeight!),misconceptionId:"USE_SIDE_DIFFERENCE"},scaled[1]];
  if(s.prototypeId==="MEN-CP010-PROT-SQUARE-FRUSTUM-TSA") return [{value:rational(2n*(d.lowerSide!+d.upperSide!)*d.slantHeight!),misconceptionId:"OMIT_BASES"},{value:rational(2n*(d.lowerSide!+d.upperSide!)*d.slantHeight!+sq(d.lowerSide!)),misconceptionId:"ADD_ONE_BASE"},scaled[1]];
  if(s.prototypeId.includes("HEIGHT-FROM-VOLUME")) return [{value:scaleMenCp010(correct,3),misconceptionId:"MISPLACE_ONE_THIRD"},{value:rational(d.side!),misconceptionId:"RETURN_BASE_SIDE"},{value:scaleMenCp010(correct,1,3),misconceptionId:"DIVIDE_BY_THREE_AGAIN"}];
  return scaled;
}

export function verifyMenCp010(s: MenCp010State, answer: ExactValue){
  const d=s.dimensions; let valid=false, method="exact identity reconstruction", reconstructed="";
  if(s.prototypeId.includes("HEIGHT-FROM-VOLUME")){const h=answer.kind==="RATIONAL"&&answer.denominator===1n?answer.numerator:null;const got=h===null?null:rational(sq(d.side!)*h,3);const given=rational(d.givenVolumeNumerator!,d.givenVolumeDenominator!);valid=got!==null&&exactEquals(got,given);reconstructed=got?exactKey(got):"invalid";method="reconstruct stated volume";}
  else if(s.prototypeId.includes("SLANT-HEIGHT")||s.prototypeId==="MEN-CP010-PROT-SQUARE-PYRAMID-VERTICAL-HEIGHT"){
    if(answer.kind==="RATIONAL"&&answer.denominator===1n){const a=answer.numerator;if(s.prototypeId==="MEN-CP010-PROT-SQUARE-PYRAMID-SLANT-HEIGHT")valid=sq(a)===sq(d.height!)+sq(d.halfSide!);else if(s.prototypeId==="MEN-CP010-PROT-SQUARE-PYRAMID-VERTICAL-HEIGHT")valid=sq(d.slantHeight!)===sq(a)+sq(d.halfSide!);else if(s.prototypeId.includes("CONICAL"))valid=sq(a)===sq(d.height!)+sq(d.outerRadius!-d.innerRadius!);else valid=sq(a)===sq(d.height!)+sq((d.lowerSide!-d.upperSide!)/2n);reconstructed="Pythagorean equality";} method="independent Pythagorean reconstruction";
  } else {const got=solveMenCp010({...s,derived:{}});valid=exactEquals(got,answer);reconstructed=exactKey(got);}
  return {valid,method,reconstructed};
}
