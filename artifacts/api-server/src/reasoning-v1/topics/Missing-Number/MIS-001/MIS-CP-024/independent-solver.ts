import type{MisCp024RuleContext}from'./rule-definitions';
export interface MisCp024Group{readonly first:number;readonly second:number;readonly result:number;}
export function applyMisCp024Transform(value:number,context:MisCp024RuleContext):number{
 return value*context.multiplier+context.addend;
}
export function independentlyEvaluateMisCp024Rule(second:number,context:MisCp024RuleContext):number|null{
 const result=applyMisCp024Transform(second,context);
 return Number.isInteger(result)&&result>0&&result<=999?result:null;
}
export function independentlyVerifyMisCp024Group(g:MisCp024Group,context:MisCp024RuleContext):boolean{
 const sourceChainConsistent=applyMisCp024Transform(g.first,context)===g.second;
 return sourceChainConsistent&&independentlyEvaluateMisCp024Rule(g.second,context)===g.result;
}
