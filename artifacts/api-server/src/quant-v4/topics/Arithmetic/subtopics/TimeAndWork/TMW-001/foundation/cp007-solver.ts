import { add, compare, divide, equals, formatRational, formatTimeText, multiply, rational, reciprocal, subtract, toLatex } from "./rational";
import { required } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp007Parameters, TmwCp007RegistryEntry, TmwCp007Solution } from "./cp007-types";

const r=(n:number,d=1):Rational=>rational(n,d);
function crewRate(p:TmwCp007Parameters,crew:[Rational,Rational,Rational]):Rational{
  return crew.reduce((sum,count,index)=>add(sum,multiply(count,p.context.categories[index].efficiency)),r(0));
}
function gcd(a:number,b:number):number{let x=Math.abs(a),y=Math.abs(b);while(y!==0)[x,y]=[y,x%y];return x||1;}
function lcm(a:number,b:number):number{return Math.abs(a*b)/gcd(a,b);}
function integerRatio(values:Rational[]):Rational[]{
  const denominator=values.reduce((total,value)=>lcm(total,value.denominator),1);
  const integers=values.map(value=>value.numerator*(denominator/value.denominator));
  const divisor=integers.reduce((total,value)=>gcd(total,value),0);
  return integers.map(value=>r(value/divisor));
}
function ratioText(values:Rational[]):string{return values.map(value=>String(Math.abs(value.numerator))).join(":");}
function ratioWorking(label:string,raw:Rational[],reduced:Rational[]):string{
  const rawText=raw.map(toLatex).join(":");
  const reducedText=ratioText(reduced);
  return rawText===reducedText?`${label}=${rawText}`:`${label}=${rawText}=${reducedText}`;
}
function timeUnit(p:TmwCp007Parameters):"hour"|"day"{return p.context.categories.every(category=>category.resourceTimeUnit.endsWith("hours"))?"hour":"day";}
function plural(value:Rational,singular:string,pluralForm:string):string{return equals(value,r(1))?singular:pluralForm;}
function answerKey(values:Rational[]):string{return values.map(value=>`${value.numerator}/${value.denominator}`).join("|");}
function determinant3(matrix:Rational[][]):Rational{
  const [a,b,c]=matrix[0],[d,e,f]=matrix[1],[g,h,i]=matrix[2];
  return add(subtract(multiply(a,subtract(multiply(e,i),multiply(f,h))),multiply(b,subtract(multiply(d,i),multiply(f,g)))),multiply(c,subtract(multiply(d,h),multiply(e,g))));
}
function replaceColumn(matrix:Rational[][],column:number,values:Rational[]):Rational[][]{return matrix.map((row,index)=>row.map((value,j)=>j===column?values[index]:value));}
function solveThree(matrix:Rational[][],values:Rational[]):Rational[]{
  const det=determinant3(matrix);if(det.numerator===0)throw new Error("Singular heterogeneous crew system");
  return [0,1,2].map(column=>divide(determinant3(replaceColumn(matrix,column,values)),det));
}
function minimumExactCrew(p:TmwCp007Parameters):[Rational,Rational]{
  const target=required(p.targetCrewRate,"targetCrewRate"),maximum=required(p.maximumCrewCount,"maximumCrewCount").numerator,e0=p.context.categories[0].efficiency,e1=p.context.categories[1].efficiency;
  let best:[Rational,Rational]|undefined,bestCount=Number.POSITIVE_INFINITY;
  for(let x=1;x<=maximum;x+=1)for(let y=1;y<=maximum;y+=1){
    if(!equals(add(multiply(r(x),e0),multiply(r(y),e1)),target))continue;
    if(x+y<bestCount){best=[r(x),r(y)];bestCount=x+y;}
  }
  if(!best)throw new Error("No positive integer crew satisfies the target capacity");
  return best;
}
export function formatTmwCp007Answer(entry:TmwCp007RegistryEntry,p:TmwCp007Parameters,values:Rational[]):string{
  const first=values[0],unit=timeUnit(p),target=p.targetCategoryIndex??p.replacementCategoryIndex??0,category=p.context.categories[target];
  switch(entry.answerType){
    case "COUNT":return `${formatRational(first)} ${plural(first,category.singular,category.plural)}`;
    case "TIME":return formatTimeText(first,unit,`${unit}s`);
    case "RATE":return `${formatRational(first)} ${p.context.outputUnit} per ${unit}`;
    case "RATIO":return ratioText(integerRatio(values));
    case "TRIPLE_RATIO":return ratioText(integerRatio(values));
    case "COUNT_PAIR":return `${formatRational(values[0])} ${plural(values[0],p.context.categories[0].singular,p.context.categories[0].plural)} and ${formatRational(values[1])} ${plural(values[1],p.context.categories[1].singular,p.context.categories[1].plural)}`;
    case "WORK":return `${formatRational(first)} ${p.context.outputUnit}`;
    case "FRACTION":return `${formatRational(first)} of the total work`;
    case "RESOURCE_TIME":return `${formatRational(first)} equivalent ${category.resourceTimeUnit}`;
  }
}

export function solveTmwCp007(entry:TmwCp007RegistryEntry,p:TmwCp007Parameters):TmwCp007Solution{
  const e=p.context.categories.map(category=>category.efficiency),unit=timeUnit(p);let answerValues:Rational[],formulaLatex:string,workedLatex:string[];
  switch(entry.solveMode){
    case "findTwoCategoryEfficiencyRatio":{
      answerValues=integerRatio([e[0],e[1]]);formulaLatex="e_A:e_B=n_B:n_A";
      workedLatex=[`n_Ae_A=n_Be_B`,ratioWorking("e_A:e_B",[p.crewB[1],p.crewA[0]],answerValues)];break;
    }
    case "findThreeCategoryEfficiencyRatio":{
      answerValues=integerRatio(e);formulaLatex="e_A:e_B:e_C=\\text{least integer form of the three per-unit rates}";
      workedLatex=[`e_A:e_B=${toLatex(e[0])}:${toLatex(e[1])}`,`e_B:e_C=${toLatex(e[1])}:${toLatex(e[2])}`,`e_A:e_B:e_C=${ratioText(answerValues)}`];break;
    }
    case "findMixedCrewCompletionTime":{
      const totalRate=crewRate(p,p.crewA),answer=divide(p.workA,totalRate);answerValues=[answer];formulaLatex="T=\\frac{W}{n_Ae_A+n_Be_B+n_Ce_C}";
      workedLatex=[`r_{crew}=${p.crewA.map((count,index)=>`${toLatex(count)}\\times${toLatex(e[index])}`).join("+")}=${toLatex(totalRate)}`,`T=\\frac{${toLatex(p.workA)}}{${toLatex(totalRate)}}=${toLatex(answer)}\\;\\text{${unit}s}`];break;
    }
    case "findEquivalentCategoryCount":{
      const source=required(p.sourceCategoryIndex,"sourceCategoryIndex"),target=p.targetCategoryIndex??required(p.replacementCategoryIndex,"replacementCategoryIndex"),sourceCount=p.crewA[source],answer=divide(multiply(sourceCount,e[source]),e[target]);answerValues=[answer];formulaLatex="n_{target}=n_{source}\\times\\frac{e_{source}}{e_{target}}";
      workedLatex=[`\\text{source capacity}=${toLatex(sourceCount)}\\times${toLatex(e[source])}`,`n_{target}=\\frac{${toLatex(sourceCount)}\\times${toLatex(e[source])}}{${toLatex(e[target])}}=${toLatex(answer)}`];break;
    }
    case "findUnknownCategoryCountForTargetTime":{
      const target=required(p.targetCategoryIndex,"targetCategoryIndex"),requiredRate=divide(p.workA,p.daysA),knownRate=crewRate(p,p.crewA),answer=divide(subtract(requiredRate,knownRate),e[target]);answerValues=[answer];formulaLatex="n_x=\\frac{W/T-r_{known}}{e_x}";
      workedLatex=[`r_{required}=\\frac{${toLatex(p.workA)}}{${toLatex(p.daysA)}}=${toLatex(requiredRate)}`,`r_{known}=${toLatex(knownRate)}`,`n_x=\\frac{${toLatex(requiredRate)}-${toLatex(knownRate)}}{${toLatex(e[target])}}=${toLatex(answer)}`];break;
    }
    case "findCrewCompositionFromTwoOutputFacts":{
      const rate1=divide(p.workA,p.daysA),rate2=divide(p.workB,p.daysB),x=divide(subtract(rate2,rate1),e[0]),y=divide(subtract(rate1,multiply(x,e[0])),e[1]);answerValues=[x,y];formulaLatex="xe_A+ye_B=R_1,\\quad 2xe_A+ye_B=R_2";
      workedLatex=[`R_1=\\frac{${toLatex(p.workA)}}{${toLatex(p.daysA)}}=${toLatex(rate1)},\\quad R_2=\\frac{${toLatex(p.workB)}}{${toLatex(p.daysB)}}=${toLatex(rate2)}`,`xe_A=R_2-R_1=${toLatex(subtract(rate2,rate1))}\\Rightarrow x=${toLatex(x)}`,`y=\\frac{${toLatex(rate1)}-${toLatex(x)}\\times${toLatex(e[0])}}{${toLatex(e[1])}}=${toLatex(y)}`];break;
    }
    case "findCategoryRateFromWeightedCrewFacts":{
      const crews=required(p.pairwiseCrews,"pairwiseCrews"),rates=required(p.pairwiseRates,"pairwiseRates"),target=required(p.targetCategoryIndex,"targetCategoryIndex"),solved=solveThree(crews.map(row=>[...row]),rates),answer=solved[target];answerValues=[answer];formulaLatex="n_{jA}e_A+n_{jB}e_B+n_{jC}e_C=R_j\\quad(j=1,2,3)";
      workedLatex=[...crews.map((row,index)=>`${row.map((count,category)=>equals(count,r(0))?null:`${equals(count,r(1))?"":toLatex(count)}e_${String.fromCharCode(65+category)}`).filter((term):term is string=>term!==null).join("+")}=${toLatex(rates[index])}`),`(e_A,e_B,e_C)=(${solved.map(toLatex).join(",")})`,`e_{target}=${toLatex(answer)}`];break;
    }
    case "findHeterogeneousGroupRate":{
      const answer=crewRate(p,p.crewA);answerValues=[answer];formulaLatex="r_{crew}=n_Ae_A+n_Be_B+n_Ce_C";
      workedLatex=[`r_{crew}=${p.crewA.map((count,index)=>`${toLatex(count)}\\times${toLatex(e[index])}`).join("+")}`,`r_{crew}=${toLatex(answer)}\\;\\text{${p.context.outputUnit} per ${unit}}`];break;
    }
    case "findCompletionAfterCategoryReplacement":{
      const oldRate=crewRate(p,p.crewA),newRate=crewRate(p,p.crewB),answer=divide(p.workA,newRate);answerValues=[answer];formulaLatex="T_{new}=\\frac{W}{r_{new}}=T_{old}\\times\\frac{r_{old}}{r_{new}}";
      workedLatex=[`r_{old}=${toLatex(oldRate)},\\quad W=${toLatex(oldRate)}\\times${toLatex(p.daysA)}=${toLatex(p.workA)}`,`r_{new}=${toLatex(newRate)}`,`T_{new}=\\frac{${toLatex(p.workA)}}{${toLatex(newRate)}}=${toLatex(answer)}\\;\\text{${unit}s}`];break;
    }
    case "findMixedCrewOutput":{
      const totalRate=crewRate(p,p.crewA),answer=multiply(totalRate,p.daysA);answerValues=[answer];formulaLatex="W=(n_Ae_A+n_Be_B+n_Ce_C)T";
      workedLatex=[`r_{crew}=${toLatex(totalRate)}\\;\\text{${p.context.outputUnit} per ${unit}}`,`W=${toLatex(totalRate)}\\times${toLatex(p.daysA)}=${toLatex(answer)}\\;\\text{${p.context.outputUnit}}`];break;
    }
    case "findEquivalentStandardResourceTime":{
      const target=required(p.targetCategoryIndex,"targetCategoryIndex"),contribution=multiply(crewRate(p,p.crewA),p.daysA),answer=divide(contribution,e[target]);answerValues=[answer];formulaLatex="R_{equivalent}=\\frac{(\\sum n_ke_k)t}{e_{standard}}";
      workedLatex=[`\\text{weighted contribution}=${toLatex(crewRate(p,p.crewA))}\\times${toLatex(p.daysA)}=${toLatex(contribution)}`,`R_{equivalent}=\\frac{${toLatex(contribution)}}{${toLatex(e[target])}}=${toLatex(answer)}`];break;
    }
    case "findMinimumIntegerCrewComposition":{
      const [x,y]=minimumExactCrew(p),target=required(p.targetCrewRate,"targetCrewRate");answerValues=[x,y];formulaLatex="xe_A+ye_B=R,\\quad x,y\\in\\mathbb Z_{>0},\\quad x+y\\text{ minimum}";
      workedLatex=[`xe_A+ye_B=${toLatex(target)}`,`(${toLatex(x)})(${toLatex(e[0])})+(${toLatex(y)})(${toLatex(e[1])})=${toLatex(target)}`,`x+y=${toLatex(add(x,y))}\\;\\text{is the least feasible positive count}`];break;
    }
    case "findUnknownCategorySoloTime":{
      const target=required(p.targetCategoryIndex,"targetCategoryIndex"),totalRate=divide(p.workA,p.daysA),known=p.crewA.reduce((sum,count,index)=>index===target?sum:add(sum,multiply(count,e[index])),r(0)),targetRate=divide(subtract(totalRate,known),p.crewA[target]),answer=reciprocal(targetRate);answerValues=[answer];formulaLatex="e_x=\\frac{W/T-r_{known}}{n_x},\\quad T_x=\\frac1{e_x}";
      workedLatex=[`r_{crew}=\\frac{1}{${toLatex(p.daysA)}}`,`e_x=\\frac{${toLatex(totalRate)}-${toLatex(known)}}{${toLatex(p.crewA[target])}}=${toLatex(targetRate)}`,`T_x=\\frac{1}{${toLatex(targetRate)}}=${toLatex(answer)}\\;\\text{${unit}s}`];break;
    }
    case "findCategoryContributionFraction":{
      const target=required(p.targetCategoryIndex,"targetCategoryIndex"),part=multiply(p.crewA[target],e[target]),total=crewRate(p,p.crewA),answer=divide(part,total);answerValues=[answer];formulaLatex="\\text{share}_x=\\frac{n_xe_x}{\\sum n_ke_k}";
      workedLatex=[`\\text{target contribution}=${toLatex(p.crewA[target])}\\times${toLatex(e[target])}=${toLatex(part)}`,`\\text{total contribution}=${toLatex(total)}`,`\\text{share}=\\frac{${toLatex(part)}}{${toLatex(total)}}`];break;
    }
    case "compareTwoHeterogeneousCrews":{
      const a=crewRate(p,p.crewA),b=crewRate(p,p.crewB),answerValuesRaw=integerRatio([a,b]);answerValues=answerValuesRaw;formulaLatex="r_A:r_B=(\\sum n_ke_k)_A:(\\sum n_ke_k)_B";
      workedLatex=[`r_A=${toLatex(a)},\\quad r_B=${toLatex(b)}`,ratioWorking("r_A:r_B",[a,b],answerValues)];break;
    }
    case "findIntegerCrewCompositionUnderConstraints":{
      const total=required(p.totalCrewCount,"totalCrewCount"),target=required(p.targetCrewRate,"targetCrewRate"),x=divide(subtract(target,multiply(e[1],total)),subtract(e[0],e[1])),y=subtract(total,x);answerValues=[x,y];formulaLatex="x+y=N,\\quad xe_A+ye_B=R";
      workedLatex=[`x+y=${toLatex(total)}`,`xe_A+(${toLatex(total)}-x)e_B=${toLatex(target)}`,`x=${toLatex(x)},\\quad y=${toLatex(y)}`];break;
    }
  }
  return {answerValues,answerType:entry.answerType,formulaLatex,workedLatex,answerText:formatTmwCp007Answer(entry,p,answerValues),answerKey:answerKey(answerValues)};
}

export function verifyTmwCp007(entry:TmwCp007RegistryEntry,p:TmwCp007Parameters,solution:TmwCp007Solution):boolean{
  const v=solution.answerValues,e=p.context.categories.map(category=>category.efficiency);
  switch(entry.solveMode){
    case "findTwoCategoryEfficiencyRatio":return equals(divide(v[0],v[1]),divide(e[0],e[1]));
    case "findThreeCategoryEfficiencyRatio":return equals(divide(v[0],v[1]),divide(e[0],e[1]))&&equals(divide(v[1],v[2]),divide(e[1],e[2]));
    case "findMixedCrewCompletionTime":return equals(multiply(crewRate(p,p.crewA),v[0]),p.workA);
    case "findEquivalentCategoryCount":{const s=required(p.sourceCategoryIndex,"sourceCategoryIndex"),t=p.targetCategoryIndex??required(p.replacementCategoryIndex,"replacementCategoryIndex");return equals(multiply(p.crewA[s],e[s]),multiply(v[0],e[t]));}
    case "findUnknownCategoryCountForTargetTime":{const t=required(p.targetCategoryIndex,"targetCategoryIndex"),crew=[...p.crewA] as [Rational,Rational,Rational];crew[t]=v[0];return equals(multiply(crewRate(p,crew),p.daysA),p.workA);}
    case "findCrewCompositionFromTwoOutputFacts":{const a:[Rational,Rational,Rational]=[v[0],v[1],r(0)],b:[Rational,Rational,Rational]=[multiply(r(2),v[0]),v[1],r(0)];return equals(multiply(crewRate(p,a),p.daysA),p.workA)&&equals(multiply(crewRate(p,b),p.daysB),p.workB);}
    case "findCategoryRateFromWeightedCrewFacts":{const crews=required(p.pairwiseCrews,"pairwiseCrews"),rates=required(p.pairwiseRates,"pairwiseRates"),target=required(p.targetCategoryIndex,"targetCategoryIndex"),solved=solveThree(crews.map(row=>[...row]),rates);return equals(v[0],solved[target]);}
    case "findHeterogeneousGroupRate":return equals(v[0],crewRate(p,p.crewA));
    case "findCompletionAfterCategoryReplacement":return equals(multiply(crewRate(p,p.crewB),v[0]),p.workA);
    case "findMixedCrewOutput":return equals(v[0],multiply(crewRate(p,p.crewA),p.daysA));
    case "findEquivalentStandardResourceTime":{const t=required(p.targetCategoryIndex,"targetCategoryIndex");return equals(multiply(v[0],e[t]),multiply(crewRate(p,p.crewA),p.daysA));}
    case "findMinimumIntegerCrewComposition":return equals(add(multiply(v[0],e[0]),multiply(v[1],e[1])),required(p.targetCrewRate,"targetCrewRate"))&&compare(v[0],r(0))>0&&compare(v[1],r(0))>0;
    case "findUnknownCategorySoloTime":{const t=required(p.targetCategoryIndex,"targetCategoryIndex"),derived=reciprocal(v[0]),crew=[...p.crewA] as [Rational,Rational,Rational],rateWithout=crew.reduce((sum,count,index)=>index===t?sum:add(sum,multiply(count,e[index])),r(0));return equals(add(rateWithout,multiply(crew[t],derived)),divide(p.workA,p.daysA));}
    case "findCategoryContributionFraction":{const t=required(p.targetCategoryIndex,"targetCategoryIndex");return equals(v[0],divide(multiply(p.crewA[t],e[t]),crewRate(p,p.crewA)));}
    case "compareTwoHeterogeneousCrews":return equals(divide(v[0],v[1]),divide(crewRate(p,p.crewA),crewRate(p,p.crewB)));
    case "findIntegerCrewCompositionUnderConstraints":return equals(add(v[0],v[1]),required(p.totalCrewCount,"totalCrewCount"))&&equals(add(multiply(v[0],e[0]),multiply(v[1],e[1])),required(p.targetCrewRate,"targetCrewRate"));
  }
}

export function isValidTmwCp007Answer(solution:TmwCp007Solution):boolean{return solution.answerValues.every(value=>compare(value,r(0))>0);}
