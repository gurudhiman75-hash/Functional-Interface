import type {MisCp013RuleContext,MisCp013RuleId} from './rule-definitions';
export interface MisCp013Group{readonly a:number;readonly b:number;readonly result:number;}
export function independentlyEvaluateMisCp013Rule(id:MisCp013RuleId,a:number,b:number,context:MisCp013RuleContext):number|null{
  let v:number;
  switch(id){
    case'PAIR_PRODUCT_DIVIDE_CONSTANT':{
      const k=context.k;
      if(!k||k===0||a*b%k!==0)return null;
      v=(a*b)/k;break;
    }
    case'PAIR_SUM_MINUS_TWICE_ABS_DIFFERENCE':
      v=a+b-2*Math.abs(a-b);break;
  }
  return Number.isInteger(v)&&v>0&&v<=999?v:null;
}
export function independentlyVerifyMisCp013Group(id:MisCp013RuleId,g:MisCp013Group,context:MisCp013RuleContext){
  return independentlyEvaluateMisCp013Rule(id,g.a,g.b,context)===g.result;
}
