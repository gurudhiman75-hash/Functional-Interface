import type{MisCp018RuleContext,MisCp018RuleId}from'./rule-definitions';
export interface MisCp018Group{readonly first:number;readonly second:number;readonly result:number;}
export function independentlyEvaluateMisCp018Rule(id:MisCp018RuleId,first:number,second:number,context:MisCp018RuleContext):number|null{
 let v:number;
 switch(id){
  case'DECREMENT_BOTH_PRODUCT':v=(first-1)*(second-1);break;
  case'FIRST_DIVIDE_CONSTANT_PLUS_SECOND':{
   const d=context.divisor;
   if(!d||first%d!==0)return null;
   v=first/d+second;break;
  }
  case'CONTINUE_EQUAL_DIFFERENCE':v=2*second-first;break;
  case'FIRST_PLUS_WEIGHTED_SECOND_PLUS_CONSTANT':{
   const weight=context.weight,k=context.k;
   if(weight==null||k==null)return null;
   v=first+weight*second+k;break;
  }
 }
 return Number.isInteger(v)&&v>0&&v<=999?v:null;
}
export function independentlyVerifyMisCp018Group(id:MisCp018RuleId,g:MisCp018Group,context:MisCp018RuleContext):boolean{
 return independentlyEvaluateMisCp018Rule(id,g.first,g.second,context)===g.result;
}
