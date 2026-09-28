import type{MisCp021RuleId}from'./rule-definitions';
export interface MisCp021Group{readonly inputs:readonly number[];readonly result:number;}

function intCbrt(n:number):number|null{const r=Math.round(Math.cbrt(n));return r*r*r===n?r:null;}

export function independentlyEvaluateMisCp021Rule(id:MisCp021RuleId,inputs:readonly number[]):number|null{
 if(id==='CUBE_ROOT_OF_DIFFERENCE'){
  if(inputs.length!==2)return null;
  const r=intCbrt(Math.abs(inputs[0]!-inputs[1]!));return r!=null&&r>0?r:null;
 }
 if(inputs.length!==3)return null;
 const v=(inputs[0]!*inputs[1]!+1)*inputs[2]!;
 return Number.isInteger(v)&&v>0&&v<=999?v:null;
}
export function independentlyVerifyMisCp021Group(id:MisCp021RuleId,g:MisCp021Group):boolean{
 return independentlyEvaluateMisCp021Rule(id,g.inputs)===g.result;
}
