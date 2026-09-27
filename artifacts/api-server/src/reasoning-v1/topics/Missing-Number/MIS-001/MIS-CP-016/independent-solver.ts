import type{MisCp016RuleContext}from'./rule-definitions';
export interface MisCp016Group{readonly a:number;readonly b:number;readonly c:number;readonly d:number;readonly result:number;}
export function independentlyEvaluateMisCp016Rule(a:number,b:number,c:number,d:number,context:MisCp016RuleContext):number|null{
 const v=Math.abs(a*b-c*d)*context.k;
 return Number.isInteger(v)&&v>0&&v<=999?v:null;
}
export function independentlyVerifyMisCp016Group(g:MisCp016Group,context:MisCp016RuleContext):boolean{
 return independentlyEvaluateMisCp016Rule(g.a,g.b,g.c,g.d,context)===g.result;
}
