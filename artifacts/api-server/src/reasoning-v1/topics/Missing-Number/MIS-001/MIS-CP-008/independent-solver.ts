import type { MisCp008MissingPosition, MisCp008RuleId } from './rule-definitions';

export interface MisCp008Group {
  readonly first:number;
  readonly second:number;
  readonly third:number|null;
  readonly result:number;
}

export function independentlyEvaluateMisCp008Rule(
  ruleId:MisCp008RuleId,
  first:number,
  second:number,
  third:number|null,
):number|null {
  let value:number;
  switch(ruleId){
    case 'INVERSE_SUM': value=first+second; break;
    case 'INVERSE_PRODUCT': value=first*second; break;
    case 'INVERSE_PRODUCT_MINUS_SECOND': value=first*second-second; break;
    case 'INVERSE_SQUARE_PLUS_SECOND': value=first*first+second; break;
    case 'INVERSE_SUM_TIMES_THIRD':
      if(third==null) return null;
      value=(first+second)*third; break;
    case 'INVERSE_TRIANGLE_PRODUCT_MINUS_TOP':
      if(third==null) return null;
      value=second*third-first; break;
  }
  return Number.isInteger(value)&&value>0&&value<=999?value:null;
}

export function independentlyVerifyMisCp008Group(ruleId:MisCp008RuleId,g:MisCp008Group):boolean{
  return independentlyEvaluateMisCp008Rule(ruleId,g.first,g.second,g.third)===g.result;
}

export function independentlySolveMisCp008Missing(
  ruleId:MisCp008RuleId,
  group:MisCp008Group,
  position:MisCp008MissingPosition,
  minInput:number,
  maxInput:number,
): readonly number[] {
  if(position==='RESULT'||position==='CENTRE'){
    const v=independentlyEvaluateMisCp008Rule(ruleId,group.first,group.second,group.third);
    return v==null?[]:[v];
  }
  const results:number[]=[];
  for(let candidate=minInput;candidate<=maxInput;candidate++){
    let first=group.first,second=group.second,third=group.third;
    if(position==='FIRST_INPUT'||position==='TOP_VERTEX') first=candidate;
    else if(position==='SECOND_INPUT'||position==='LEFT_VERTEX') second=candidate;
    else if(position==='THIRD_INPUT'||position==='RIGHT_VERTEX') third=candidate;
    const value=independentlyEvaluateMisCp008Rule(ruleId,first,second,third);
    if(value===group.result) results.push(candidate);
  }
  return results;
}
