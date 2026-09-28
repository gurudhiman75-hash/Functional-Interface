import type{MisCp023RuleId}from'./rule-definitions';
export interface MisCp023Group{readonly inputs:readonly[number,number,number];readonly result:number;}

function exactSqrt(n:number):number|null{const r=Math.round(Math.sqrt(n));return r*r===n?r:null;}

export function independentlyEvaluateMisCp023Rule(id:MisCp023RuleId,inputs:readonly number[]):number|null{
 if(id!=='ROOT_SUM_TIMES_THIRD_PLUS_TWO'||inputs.length!==3)return null;
 const ra=exactSqrt(inputs[0]!),rb=exactSqrt(inputs[1]!);
 if(ra==null||rb==null)return null;
 const v=(ra+rb)*inputs[2]!+2;
 return Number.isInteger(v)&&v>0&&v<=999?v:null;
}
export function independentlyVerifyMisCp023Group(id:MisCp023RuleId,g:MisCp023Group):boolean{
 return independentlyEvaluateMisCp023Rule(id,g.inputs)===g.result;
}
