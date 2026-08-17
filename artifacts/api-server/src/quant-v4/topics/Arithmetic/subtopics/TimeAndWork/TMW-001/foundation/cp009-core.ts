import { add, compare, divide, equals, formatRational, multiply, rational, reciprocal, subtract, toLatex } from "./rational";
import { pick, required } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp009Boundary, TmwCp009Context, TmwCp009FlowUnit, TmwCp009Parameters, TmwCp009Pipe, TmwCp009RegistryEntry, TmwCp009Solution } from "./cp009-types";
export const r=(n:number,d=1):Rational=>rational(n,d);
export const ONE=r(1),ZERO=r(0),SIXTY=r(60),HUNDRED=r(100);
const contexts:readonly TmwCp009Context[]=[
 {setting:"a municipal housing complex",tankLabel:"overhead water tank",liquid:"water",timeUnit:"hour",capacityUnit:"litres"},
 {setting:"a government school",tankLabel:"storage tank",liquid:"water",timeUnit:"hour",capacityUnit:"litres"},
 {setting:"a district hospital",tankLabel:"supply tank",liquid:"water",timeUnit:"hour",capacityUnit:"litres"},
 {setting:"a dairy processing plant",tankLabel:"clean-water reservoir",liquid:"water",timeUnit:"hour",capacityUnit:"litres"},
 {setting:"an irrigation facility",tankLabel:"field-storage tank",liquid:"water",timeUnit:"hour",capacityUnit:"litres"},
] as const;
export function context(seed:string,qlId:string):TmwCp009Context{return pick(contexts,seed,`${qlId}:context`);}
export function pipe(label:string,kind:TmwCp009Pipe["kind"],solo:number|Rational):TmwCp009Pipe{return{label:`${label.charAt(0).toUpperCase()}${label.slice(1)}`,kind,soloTime:typeof solo==="number"?r(solo):solo};}
export function tmwCp009SignedRate(value:TmwCp009Pipe):Rational{const rate=reciprocal(value.soloTime);return value.kind==="INLET"?rate:multiply(rate,r(-1));}
export function tmwCp009NetRate(pipes:readonly TmwCp009Pipe[],excludedIndex?:number):Rational{return pipes.reduce((total,item,index)=>index===excludedIndex?total:add(total,tmwCp009SignedRate(item)),ZERO);}
export function abs(value:Rational):Rational{return value.numerator<0?multiply(value,r(-1)):value;}
export function sum(values:Rational[]):Rational{return values.reduce((total,value)=>add(total,value),ZERO);}
function gcd(a:number,b:number):number{let x=Math.abs(a),y=Math.abs(b);while(y!==0)[x,y]=[y,x%y];return x||1;}
function lcm(a:number,b:number):number{return Math.abs(a*b)/gcd(a,b);}
export function integerRatio(values:Rational[]):Rational[]{const denominator=values.reduce((total,value)=>lcm(total,value.denominator),1),ints=values.map(value=>value.numerator*(denominator/value.denominator)),divisor=ints.reduce((total,value)=>gcd(total,value),0);return ints.map(value=>r(value/divisor));}
export function ratioText(values:Rational[]):string{return integerRatio(values).map(value=>String(Math.abs(value.numerator))).join(" : ");}
export function key(values:Rational[]):string{return values.map(value=>`${value.numerator}/${value.denominator}`).join("|");}
function mixedTimeLatex(value:Rational):string{const sign=value.numerator<0?"-":"",absolute=Math.abs(value.numerator),whole=Math.trunc(absolute/value.denominator),remainder=absolute%value.denominator;if(whole===0)return`${sign}\\frac{${absolute}}{${value.denominator}}`;if(remainder===0)return`${sign}${whole}`;return`${sign}${whole}\\frac{${remainder}}{${value.denominator}}`;}
export function timeText(value:Rational):string{if(value.denominator===1)return`${value.numerator} ${equals(value,ONE)?"hour":"hours"}`;return`\\(${mixedTimeLatex(value)}\\;\\text{hours}\\)`;}
export function indianInteger(value:Rational):string{if(value.denominator!==1)return formatRational(value);return new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(value.numerator);}
export function flowUnitText(unit:TmwCp009FlowUnit):string{return unit==="LITRES_PER_MINUTE"?"litres per minute":"litres per hour";}
export function directionCode(rate:Rational):Rational{return compare(rate,ZERO)>0?r(1):compare(rate,ZERO)<0?r(-1):ZERO;}
export function directionText(code:Rational):string{return code.numerator>0?"The tank fills":code.numerator<0?"The tank empties":"The water level remains unchanged";}
export function boundaryForRate(rate:Rational):TmwCp009Boundary{return compare(rate,ZERO)>0?"FULL":"EMPTY";}
export function boundaryWord(boundary:TmwCp009Boundary):string{return boundary==="FULL"?"full":"empty";}
export function signedRateLatex(value:Rational):string{return value.numerator<0?toLatex(value):`+${toLatex(value)}`;}
export function pipeRateEquation(pipes:readonly TmwCp009Pipe[]):string{return pipes.map((item,index)=>`${index===0&&item.kind==="INLET"?"":""}${item.kind==="INLET"?"+":"-"}\\frac{1}{${toLatex(item.soloTime)}}`).join("").replace(/^\+/,"");}
export function capacityFrom(state:{flowA:Rational;timeA:Rational}):Rational{return multiply(state.flowA,state.timeA);}

export function formatTmwCp009Answer(entry:TmwCp009RegistryEntry,p:TmwCp009Parameters,values:Rational[]):string{
 switch(entry.answerType){
  case"TIME":return timeText(values[0]);
  case"FRACTION":return `${formatRational(values[0])} of the tank ${compare(tmwCp009NetRate(p.pipes),ZERO)>=0?"filled":"emptied"}`;
  case"COUNT":return `${formatRational(values[0])} identical inlet pipes`;
  case"CAPACITY":return `${indianInteger(values[0])} litres`;
  case"FLOW_RATE":return `${indianInteger(values[0])} ${flowUnitText(p.targetFlowUnit??p.sourceFlowUnit??"LITRES_PER_HOUR")}`;
  case"LEVEL":return equals(values[0],ONE)?"completely full":`${formatRational(values[0])} full`;
  case"RATIO":return ratioText(values);
  case"PERCENT":return `${formatRational(values[0])}%`;
  case"DIRECTION":return directionText(values[0]);
  case"DECISION":{const event=values[0].numerator===1,boundary=values[2].numerator>0?"full":"empty";return event?`Yes — the tank becomes ${boundary} in ${timeText(values[1])}`:`No — the tank does not become ${boundary} within ${timeText(required(p.decisionWindow,"decisionWindow"))}`;}
 }
}
