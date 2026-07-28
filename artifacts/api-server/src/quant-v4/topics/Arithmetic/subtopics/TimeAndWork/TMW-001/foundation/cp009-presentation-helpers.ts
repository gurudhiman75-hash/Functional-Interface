import { compare, formatRational, rational } from "./rational";
import { required } from "./cp001-helpers";
import { timeText, tmwCp009NetRate } from "./cp009-engine";
import type { Rational } from "./types";
import type { TmwCp009Parameters, TmwCp009Pipe } from "./cp009-types";
export const r=(n:number,d=1):Rational=>rational(n,d),ZERO=r(0),ONE=r(1);
export function inline(value:string):string{return `\\(${value}\\)`;}
export function num(value:Rational):string{return formatRational(value);}
export function quantity(value:Rational):string{return value.denominator===1?new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(value.numerator):formatRational(value);}
export function hours(value:Rational):string{return timeText(value);}
export function pipeSentence(pipe:TmwCp009Pipe,tank:string):string{if(pipe.kind==="INLET")return `${pipe.label} can fill the ${tank} alone in ${hours(pipe.soloTime)}`;if(pipe.kind==="LEAK")return `${pipe.label} would empty the full ${tank} in ${hours(pipe.soloTime)}`;return `${pipe.label} can empty the full ${tank} alone in ${hours(pipe.soloTime)}`;}
export function list(items:string[]):string{return items.length===1?items[0]:items.length===2?`${items[0]} and ${items[1]}`:`${items.slice(0,-1).join(", ")}, and ${items.at(-1)}`;}
export function pipeList(p:TmwCp009Parameters,omitIndex?:number):string{return list(p.pipes.filter((_,index)=>index!==omitIndex).map(pipe=>pipeSentence(pipe,p.context.tankLabel)));}
export function boundaryWord(value:"FULL"|"EMPTY"):string{return value==="FULL"?"full":"empty";}
export function flowUnit(value:"LITRES_PER_HOUR"|"LITRES_PER_MINUTE"):string{return value==="LITRES_PER_MINUTE"?"litres per minute":"litres per hour";}
export function directionWord(rate:Rational):string{return compare(rate,ZERO)>0?"inflow":compare(rate,ZERO)<0?"outflow":"zero net flow";}
export function targetPipe(p:TmwCp009Parameters):TmwCp009Pipe{return p.pipes[required(p.unknownPipeIndex,"unknownPipeIndex")];}
