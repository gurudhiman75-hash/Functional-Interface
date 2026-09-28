import type{MisCp022RuleId}from'./rule-definitions';
export interface MisCp022Group{readonly inputs:readonly[number,number];readonly result:number;}

export function independentlyEvaluateMisCp022Rule(id:MisCp022RuleId,inputs:readonly number[]):number|null{
 if(id!=='PAIR_ARITHMETIC_MEAN'||inputs.length!==2)return null;
 const sum=inputs[0]!+inputs[1]!;
 if(sum%2!==0)return null;
 const v=sum/2;
 return Number.isInteger(v)&&v>0&&v<=999?v:null;
}
export function independentlyVerifyMisCp022Group(id:MisCp022RuleId,g:MisCp022Group):boolean{
 return independentlyEvaluateMisCp022Rule(id,g.inputs)===g.result;
}
