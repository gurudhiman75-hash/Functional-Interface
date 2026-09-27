import type{MisCp020RuleId}from'./rule-definitions';
export interface MisCp020Group{readonly first:number;readonly second:number;readonly result:number;}

function intSqrt(n:number):number|null{const r=Math.sqrt(n);return Number.isInteger(r)?r:null;}
function intCbrt(n:number):number|null{const r=Math.round(Math.cbrt(n));return r*r*r===n?r:null;}

export function independentlyEvaluateMisCp020Rule(id:MisCp020RuleId,first:number,second:number):number|null{
 if(id==='SQUARE_ROOT_OF_PRODUCT'){
  const r=intSqrt(first*second);return r!=null&&r>0&&r<=999?r:null;
 }
 if(id==='SQUARE_ROOT_DIFFERENCE'){
  const a=intSqrt(first),b=intSqrt(second);if(a==null||b==null)return null;const v=a-b;return v>0?v:null;
 }
 const a=intCbrt(first),b=intCbrt(second);if(a==null||b==null)return null;const v=a+b;return v>0&&v<=999?v:null;
}
export function independentlyVerifyMisCp020Group(id:MisCp020RuleId,g:MisCp020Group):boolean{
 return independentlyEvaluateMisCp020Rule(id,g.first,g.second)===g.result;
}
