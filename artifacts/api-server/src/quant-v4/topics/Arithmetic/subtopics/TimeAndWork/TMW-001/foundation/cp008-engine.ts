import { add, compare, divide, equals, formatRational, multiply, rational, subtract, toLatex } from "./rational";
import { pick, required } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp008Context, TmwCp008FactorTarget, TmwCp008Parameters, TmwCp008RegistryEntry, TmwCp008Role, TmwCp008Solution } from "./cp008-types";

const r=(n:number,d=1):Rational=>rational(n,d);
type RoleSpec={count?:number;efficiency?:number;days?:number;hours?:number;output?:number;baseline?:number;defective?:number};
type Template={setting:string;task:string;outputUnit:string;people:[[string,string,string],[string,string,string],[string,string,string]]};
const templates:readonly Template[]=[
  {setting:"a warehouse distribution centre",task:"a large dispatch order",outputUnit:"packages",people:[["Asha","packer","packers"],["Bharat","quality checker","quality checkers"],["Charan","loader","loaders"]]},
  {setting:"a bank document-verification centre",task:"a loan-file verification batch",outputUnit:"files",people:[["Meera","senior clerk","senior clerks"],["Rohan","junior clerk","junior clerks"],["Simran","assistant","assistants"]]},
  {setting:"a commercial-complex painting site",task:"a painting contract",outputUnit:"square metres",people:[["Kavita","master painter","master painters"],["Mohan","painter","painters"],["Neeraj","helper","helpers"]]},
  {setting:"an auto-component factory",task:"a component-assembly order",outputUnit:"components",people:[["Priya","technician","technicians"],["Raj","assembler","assemblers"],["Sonia","trainee","trainees"]]},
] as const;
function role(person:[string,string,string],s:RoleSpec={}):TmwCp008Role{return{name:person[0],role:person[1],pluralRole:person[2],count:r(s.count??1),efficiency:r(s.efficiency??1),days:r(s.days??1),hoursPerDay:r(s.hours??1),output:r(s.output??0),baselineOutput:r(s.baseline??0),defectiveOutput:r(s.defective??0)};}
function context(t:Template,specs:[RoleSpec,RoleSpec,RoleSpec]):TmwCp008Context{return{setting:t.setting,task:t.task,outputUnit:t.outputUnit,roles:[role(t.people[0],specs[0]),role(t.people[1],specs[1]),role(t.people[2],specs[2])]};}
function template(seed:string,salt:string):Template{return pick(templates,seed,salt);}
function standardContribution(role:TmwCp008Role):Rational{return multiply(multiply(multiply(role.count,role.efficiency),role.days),role.hoursPerDay);}
export function tmwCp008ContributionVector(p:TmwCp008Parameters):[Rational,Rational,Rational]{if(p.contributionWeights)return p.contributionWeights;return p.context.roles.map(standardContribution) as [Rational,Rational,Rational];}
function sum(values:Rational[]):Rational{return values.reduce((total,value)=>add(total,value),r(0));}
function selected(values:Rational[],indices:number[]):Rational{return indices.reduce((total,index)=>add(total,values[index]),r(0));}
function payments(total:Rational,weights:[Rational,Rational,Rational]):[Rational,Rational,Rational]{const all=sum(weights);return weights.map(weight=>divide(multiply(total,weight),all)) as [Rational,Rational,Rational];}
function key(values:Rational[]):string{return values.map(value=>`${value.numerator}/${value.denominator}`).join("|");}
function gcd(a:number,b:number):number{let x=Math.abs(a),y=Math.abs(b);while(y!==0)[x,y]=[y,x%y];return x||1;}
function lcm(a:number,b:number):number{return Math.abs(a*b)/gcd(a,b);}
function integerRatio(values:Rational[]):Rational[]{const denominator=values.reduce((total,value)=>lcm(total,value.denominator),1),ints=values.map(value=>value.numerator*(denominator/value.denominator)),divisor=ints.reduce((total,value)=>gcd(total,value),0);return ints.map(value=>r(value/divisor));}
function ratioText(values:Rational[]):string{return integerRatio(values).map(value=>String(Math.abs(value.numerator))).join(" : ");}
function indianInteger(value:number):string{const sign=value<0?"-":"",digits=String(Math.abs(value));if(digits.length<=3)return `${sign}${digits}`;const tail=digits.slice(-3),head=digits.slice(0,-3),groups:string[]=[];for(let end=head.length;end>0;end-=2)groups.unshift(head.slice(Math.max(0,end-2),end));return `${sign}${groups.join(",")},${tail}`;}
export function formatTmwCp008Money(value:Rational):string{return value.denominator===1?`₹${indianInteger(value.numerator)}`:`₹${formatRational(value)}`;}
function answerOutputUnit(p:TmwCp008Parameters,value:Rational):string{if(value.numerator===value.denominator){if(p.context.outputUnit==="square metres")return "square metre";return p.context.outputUnit.replace(/s$/," ").trim();}return p.context.outputUnit;}
export function formatTmwCp008Answer(entry:TmwCp008RegistryEntry,p:TmwCp008Parameters,values:Rational[]):string{switch(entry.answerType){case"RATIO":return ratioText(values);case"MONEY":return formatTmwCp008Money(values[0]);case"MONEY_TRIPLE":return values.map(formatTmwCp008Money).join(", ");case"TIME":return `${formatRational(values[0])} days`;case"EFFICIENCY":return `${formatRational(values[0])} ${answerOutputUnit(p,values[0])} per hour`;}}

export function buildTmwCp008Parameters(entry:TmwCp008RegistryEntry,seed:string):TmwCp008Parameters{
  const t=template(seed,`${entry.qlId}:context`);
  switch(entry.solveMode){
    case"findPaymentRatioFromContributionFactors":{
      const v=pick([
        {a:{efficiency:3,days:8,hours:6},b:{efficiency:2,days:8,hours:6}},
        {a:{efficiency:2,days:12,hours:6},b:{efficiency:2,days:8,hours:6}},
        {a:{efficiency:4,days:6,hours:5},b:{efficiency:3,days:8,hours:5}},
        {a:{efficiency:5,days:8,hours:6},b:{efficiency:3,days:10,hours:8}},
      ],seed,"ratio");
      return{context:context(t,[v.a,v.b,{count:0}]),totalPayment:r(600),selectedIndices:[0,1]};
    }
    case"findSelectedPartyPayment":{
      const v=pick([
        {specs:[{efficiency:3,days:4,hours:5},{efficiency:2,days:4,hours:5},{efficiency:1,days:4,hours:5}] as [RoleSpec,RoleSpec,RoleSpec],total:600,selected:[0] as Array<0|1|2>},
        {specs:[{efficiency:4,days:5,hours:4},{efficiency:3,days:4,hours:4},{efficiency:2,days:3,hours:4}] as [RoleSpec,RoleSpec,RoleSpec],total:760,selected:[1] as Array<0|1|2>},
        {specs:[{efficiency:5,days:4,hours:4},{efficiency:3,days:5,hours:4},{efficiency:2,days:5,hours:4}] as [RoleSpec,RoleSpec,RoleSpec],total:900,selected:[0,2] as Array<0|1|2>},
      ],seed,"share");
      return{context:context(t,v.specs),totalPayment:r(v.total),selectedIndices:v.selected,targetIndex:v.selected[0]};
    }
    case"findTotalPaymentPoolFromKnownShare":{
      const specs:[RoleSpec,RoleSpec,RoleSpec]=[{efficiency:3,days:4,hours:5},{efficiency:2,days:4,hours:5},{efficiency:1,days:4,hours:5}],total=pick([600,900,1200] as const,seed,"pool"),ctx=context(t,specs),weights=ctx.roles.map(standardContribution) as [Rational,Rational,Rational],reported=payments(r(total),weights),target=pick([0,1,2] as const,seed,"known");
      return{context:ctx,totalPayment:r(total),targetIndex:target,reportedPayments:reported};
    }
    case"findResidualPayment":{
      const specs:[RoleSpec,RoleSpec,RoleSpec]=[{efficiency:4,days:5,hours:4},{efficiency:3,days:4,hours:4},{efficiency:2,days:3,hours:4}],total=760,ctx=context(t,specs),weights=ctx.roles.map(standardContribution) as [Rational,Rational,Rational],reported=payments(r(total),weights),target=pick([0,1,2] as const,seed,"residual-target"),known=[0,1,2].filter(index=>index!==target) as Array<0|1|2>;
      return{context:ctx,totalPayment:r(total),targetIndex:target,reportedPayments:reported,knownPaymentIndices:known};
    }
    case"findPaymentAfterStagedParticipation":{
      const v=pick([
        {event:"JOIN" as const,a:{efficiency:2,days:12,hours:6},b:{efficiency:2,days:8,hours:6},total:500,target:1 as const},
        {event:"LEAVE" as const,a:{efficiency:2,days:10,hours:6},b:{efficiency:2,days:6,hours:6},total:640,target:1 as const},
        {event:"HANDOFF" as const,a:{efficiency:3,days:5,hours:6},b:{efficiency:2,days:7,hours:6},total:580,target:0 as const},
      ],seed,"stage");
      return{context:context(t,[v.a,v.b,{count:0}]),totalPayment:r(v.total),targetIndex:v.target,eventKind:v.event};
    }
    case"findPaymentFromCompletedFractions":{
      const v=pick([
        {weights:[r(2,5),r(1,3),r(4,15)] as [Rational,Rational,Rational],total:900,target:2 as const},
        {weights:[r(1,2),r(1,4),r(1,4)] as [Rational,Rational,Rational],total:800,target:0 as const},
        {weights:[r(3,8),r(1,4),r(3,8)] as [Rational,Rational,Rational],total:960,target:1 as const},
      ],seed,"fractions");
      return{context:context(t,[{},{},{}]),totalPayment:r(v.total),targetIndex:v.target,contributionWeights:v.weights};
    }
    case"findContributionFactorRatioFromPayments":{
      const v=pick([
        {target:"EFFICIENCY_RATIO" as TmwCp008FactorTarget,a:{efficiency:9,days:4,hours:1},b:{efficiency:4,days:6,hours:1},total:500},
        {target:"EFFICIENCY_RATIO" as TmwCp008FactorTarget,a:{efficiency:5,days:6,hours:1},b:{efficiency:3,days:10,hours:1},total:600},
        {target:"TIME_RATIO" as TmwCp008FactorTarget,a:{efficiency:2,days:10,hours:1},b:{efficiency:4,days:3,hours:1},total:800},
        {target:"TIME_RATIO" as TmwCp008FactorTarget,a:{efficiency:3,days:8,hours:1},b:{efficiency:2,days:9,hours:1},total:700},
      ],seed,"factor-ratio"),ctx=context(t,[v.a,v.b,{count:0}]),weights=ctx.roles.map(standardContribution) as [Rational,Rational,Rational];
      return{context:ctx,totalPayment:r(v.total),reportedPayments:payments(r(v.total),weights),factorTarget:v.target};
    }
    case"findMissingTimeFromPayment":{
      const v=pick([
        {a:{efficiency:3,days:8,hours:1},b:{efficiency:2,days:6,hours:1},total:600,target:0 as const},
        {a:{efficiency:4,days:5,hours:1},b:{efficiency:5,days:8,hours:1},total:900,target:0 as const},
        {a:{efficiency:2,days:9,hours:1},b:{efficiency:3,days:4,hours:1},total:750,target:0 as const},
      ],seed,"missing-time"),ctx=context(t,[v.a,v.b,{count:0}]),weights=ctx.roles.map(standardContribution) as [Rational,Rational,Rational];
      return{context:ctx,totalPayment:r(v.total),reportedPayments:payments(r(v.total),weights),factorTarget:"TIME",targetIndex:v.target};
    }
    case"findMissingEfficiencyFromPayment":{
      const v=pick([
        {a:{efficiency:5,days:6,hours:1},b:{efficiency:3,days:10,hours:1},total:600,target:0 as const},
        {a:{efficiency:4,days:8,hours:1},b:{efficiency:2,days:6,hours:1},total:550,target:0 as const},
        {a:{efficiency:3,days:10,hours:1},b:{efficiency:5,days:6,hours:1},total:800,target:0 as const},
      ],seed,"missing-eff"),ctx=context(t,[v.a,v.b,{count:0}]),weights=ctx.roles.map(standardContribution) as [Rational,Rational,Rational];
      return{context:ctx,totalPayment:r(v.total),reportedPayments:payments(r(v.total),weights),factorTarget:"EFFICIENCY",targetIndex:v.target};
    }
    case"findMixedCategoryPaymentDistribution":{
      const v=pick([
        {specs:[{count:2,efficiency:4,days:5,hours:1},{count:3,efficiency:2,days:5,hours:1},{count:4,efficiency:1,days:5,hours:1}] as [RoleSpec,RoleSpec,RoleSpec],total:900},
        {specs:[{count:3,efficiency:3,days:4,hours:1},{count:2,efficiency:2,days:4,hours:1},{count:5,efficiency:1,days:4,hours:1}] as [RoleSpec,RoleSpec,RoleSpec],total:900},
        {specs:[{count:2,efficiency:5,days:3,hours:1},{count:4,efficiency:2,days:3,hours:1},{count:2,efficiency:1,days:3,hours:1}] as [RoleSpec,RoleSpec,RoleSpec],total:600},
      ],seed,"mixed-pay");
      return{context:context(t,v.specs),totalPayment:r(v.total)};
    }
    case"findPieceRatePaymentFromOutput":{
      const v=pick([{output:240,rate:3},{output:180,rate:4},{output:320,rate:2},{output:150,rate:5}],seed,"piece");
      return{context:context(t,[{output:v.output},{count:0},{count:0}]),totalPayment:r(v.output*v.rate),targetIndex:0,pieceRate:r(v.rate)};
    }
    case"findBonusShareFromExtraContribution":{
      const v=pick([
        {actual:[140,120,110],base:[100,100,100],bonus:700,target:0 as const},
        {actual:[150,130,120],base:[120,120,100],bonus:600,target:1 as const},
        {actual:[125,145,135],base:[100,120,120],bonus:650,target:2 as const},
      ],seed,"bonus"),specs=v.actual.map((output,index)=>({output,baseline:v.base[index]})) as [RoleSpec,RoleSpec,RoleSpec],weights=v.actual.map((output,index)=>r(output-v.base[index])) as [Rational,Rational,Rational];
      return{context:context(t,specs),totalPayment:r(v.bonus),bonusPool:r(v.bonus),targetIndex:v.target,contributionWeights:weights};
    }
    case"findPaymentAfterSignedContribution":{
      const v=pick([
        {actual:[120,100,80],defective:[20,10,0],pool:810,target:0 as const},
        {actual:[80,60,40],defective:[20,20,20],pool:600,target:1 as const},
        {actual:[150,120,90],defective:[30,20,10],pool:900,target:2 as const},
      ],seed,"signed"),specs=v.actual.map((output,index)=>({output,defective:v.defective[index]})) as [RoleSpec,RoleSpec,RoleSpec],weights=v.actual.map((output,index)=>r(output-v.defective[index])) as [Rational,Rational,Rational];
      return{context:context(t,specs),totalPayment:r(v.pool),targetIndex:v.target,contributionWeights:weights};
    }
  }
}

function contributionStep(role:TmwCp008Role,label:string):string{return `C_${label}=${toLatex(role.count)}\\times${toLatex(role.efficiency)}\\times${toLatex(role.days)}\\times${toLatex(role.hoursPerDay)}=${toLatex(standardContribution(role))}`;}
function sumExpression(values:Rational[],symbol:string):string{return `${symbol}=${values.map(toLatex).join("+")}=${toLatex(sum(values))}`;}

export function solveTmwCp008(entry:TmwCp008RegistryEntry,p:TmwCp008Parameters):TmwCp008Solution{
  const weights=tmwCp008ContributionVector(p),totalWeight=sum(weights),target=p.targetIndex??0,reported=p.reportedPayments,roles=p.context.roles;let answerValues:Rational[],formulaLatex:string,workedLatex:string[];
  switch(entry.solveMode){
    case"findPaymentRatioFromContributionFactors":{
      answerValues=integerRatio([weights[0],weights[1]]);formulaLatex="P_A:P_B=(N_AE_AD_AH_A):(N_BE_BD_BH_B)";
      workedLatex=[contributionStep(roles[0],"A"),contributionStep(roles[1],"B"),`P_A:P_B=${toLatex(weights[0])}:${toLatex(weights[1])}=${ratioText(answerValues)}`];break;
    }
    case"findSelectedPartyPayment":{
      const indices=required(p.selectedIndices,"selectedIndices"),chosen=selected(weights,indices),answer=divide(multiply(p.totalPayment,chosen),totalWeight);answerValues=[answer];formulaLatex="P_S=P_{total}\\frac{C_S}{\\sum C}";
      workedLatex=[contributionStep(roles[0],"A"),contributionStep(roles[1],"B"),contributionStep(roles[2],"C"),`C_S=${indices.map(index=>toLatex(weights[index])).join("+")}=${toLatex(chosen)},\\quad \\sum C=${toLatex(totalWeight)}`,`P_S=${toLatex(p.totalPayment)}\\times\\frac{${toLatex(chosen)}}{${toLatex(totalWeight)}}=${toLatex(answer)}`];break;
    }
    case"findTotalPaymentPoolFromKnownShare":{
      const known=required(reported,"reportedPayments")[target],answer=divide(multiply(known,totalWeight),weights[target]);answerValues=[answer];formulaLatex="P_{total}=P_i\\frac{\\sum C}{C_i}";
      workedLatex=[contributionStep(roles[0],"A"),contributionStep(roles[1],"B"),contributionStep(roles[2],"C"),sumExpression(weights,"\\sum C"),`\\frac{P_i}{P_{total}}=\\frac{${toLatex(weights[target])}}{${toLatex(totalWeight)}}`,`P_{total}=${toLatex(known)}\\times\\frac{${toLatex(totalWeight)}}{${toLatex(weights[target])}}=${toLatex(answer)}`];break;
    }
    case"findResidualPayment":{
      const knownIndices=required(p.knownPaymentIndices,"knownPaymentIndices"),knownPayments=required(reported,"reportedPayments"),knownValues=knownIndices.map(index=>knownPayments[index]),knownTotal=sum(knownValues),answer=subtract(p.totalPayment,knownTotal);answerValues=[answer];formulaLatex="P_{residual}=P_{total}-\\sum P_{known}";
      workedLatex=[`P_{total}=${toLatex(p.totalPayment)}`,`\\sum P_{known}=${knownValues.map(toLatex).join("+")}=${toLatex(knownTotal)}`,`P_{residual}=${toLatex(p.totalPayment)}-${toLatex(knownTotal)}=${toLatex(answer)}`];break;
    }
    case"findPaymentAfterStagedParticipation":{
      const answer=divide(multiply(p.totalPayment,weights[target]),totalWeight);answerValues=[answer];formulaLatex="P_i=P_{total}\\frac{E_it_i}{\\sum E_jt_j}";
      workedLatex=[contributionStep(roles[0],"A"),contributionStep(roles[1],"B"),`\\sum C=${toLatex(weights[0])}+${toLatex(weights[1])}=${toLatex(totalWeight)}`,`P_i=${toLatex(p.totalPayment)}\\times\\frac{${toLatex(weights[target])}}{${toLatex(totalWeight)}}=${toLatex(answer)}`];break;
    }
    case"findPaymentFromCompletedFractions":{
      const answer=divide(multiply(p.totalPayment,weights[target]),totalWeight);answerValues=[answer];formulaLatex="P_i=P_{total}\\frac{f_i}{\\sum f}";
      workedLatex=[`\\sum f=${weights.map(toLatex).join("+")}=${toLatex(totalWeight)}`,`\\text{Target fraction}=f_i=${toLatex(weights[target])}`,`P_i=${toLatex(p.totalPayment)}\\times\\frac{${toLatex(weights[target])}}{${toLatex(totalWeight)}}=${toLatex(answer)}`];break;
    }
    case"findContributionFactorRatioFromPayments":{
      const pay=required(reported,"reportedPayments"),a=roles[0],b=roles[1],paymentRatio=ratioText([pay[0],pay[1]]);
      if(p.factorTarget==="EFFICIENCY_RATIO"){
        answerValues=integerRatio([a.efficiency,b.efficiency]);formulaLatex="E_A:E_B=(P_A:P_B)\\times(D_BH_B:D_AH_A)";
        workedLatex=[`P_A:P_B=${toLatex(pay[0])}:${toLatex(pay[1])}=${paymentRatio}`,`E_A:E_B=(${toLatex(pay[0])}\\times${toLatex(b.days)}\\times${toLatex(b.hoursPerDay)}):(${toLatex(pay[1])}\\times${toLatex(a.days)}\\times${toLatex(a.hoursPerDay)})`,`E_A:E_B=${ratioText(answerValues)}`];
      }else{
        answerValues=integerRatio([a.days,b.days]);formulaLatex="D_A:D_B=(P_A:P_B)\\times(E_BH_B:E_AH_A)";
        workedLatex=[`P_A:P_B=${toLatex(pay[0])}:${toLatex(pay[1])}=${paymentRatio}`,`D_A:D_B=(${toLatex(pay[0])}\\times${toLatex(b.efficiency)}\\times${toLatex(b.hoursPerDay)}):(${toLatex(pay[1])}\\times${toLatex(a.efficiency)}\\times${toLatex(a.hoursPerDay)})`,`D_A:D_B=${ratioText(answerValues)}`];
      }break;
    }
    case"findMissingTimeFromPayment":{
      const pay=required(reported,"reportedPayments"),a=roles[target],otherIndex=target===0?1:0,other=roles[otherIndex],otherPay=pay[otherIndex],answer=divide(multiply(multiply(divide(pay[target],otherPay),other.efficiency),multiply(other.days,other.hoursPerDay)),multiply(a.efficiency,a.hoursPerDay));answerValues=[answer];formulaLatex="D_x=\\frac{P_x}{P_k}\\frac{E_kD_kH_k}{E_xH_x}";
      workedLatex=[`\\frac{P_x}{P_k}=\\frac{${toLatex(pay[target])}}{${toLatex(otherPay)}}`,`D_x=\\frac{${toLatex(pay[target])}\\times${toLatex(other.efficiency)}\\times${toLatex(other.days)}\\times${toLatex(other.hoursPerDay)}}{${toLatex(otherPay)}\\times${toLatex(a.efficiency)}\\times${toLatex(a.hoursPerDay)}}`,`D_x=${toLatex(answer)}\\;\\text{days}`];break;
    }
    case"findMissingEfficiencyFromPayment":{
      const pay=required(reported,"reportedPayments"),a=roles[target],otherIndex=target===0?1:0,other=roles[otherIndex],otherPay=pay[otherIndex],answer=divide(multiply(multiply(divide(pay[target],otherPay),other.efficiency),multiply(other.days,other.hoursPerDay)),multiply(a.days,a.hoursPerDay));answerValues=[answer];formulaLatex="E_x=\\frac{P_x}{P_k}\\frac{E_kD_kH_k}{D_xH_x}";
      workedLatex=[`\\frac{P_x}{P_k}=\\frac{${toLatex(pay[target])}}{${toLatex(otherPay)}}`,`E_x=\\frac{${toLatex(pay[target])}\\times${toLatex(other.efficiency)}\\times${toLatex(other.days)}\\times${toLatex(other.hoursPerDay)}}{${toLatex(otherPay)}\\times${toLatex(a.days)}\\times${toLatex(a.hoursPerDay)}}`,`E_x=${toLatex(answer)}\\;\\text{${p.context.outputUnit} per hour}`];break;
    }
    case"findMixedCategoryPaymentDistribution":{
      answerValues=payments(p.totalPayment,weights);formulaLatex="P_k=P_{total}\\frac{N_kE_kD_kH_k}{\\sum_jN_jE_jD_jH_j}";
      workedLatex=[contributionStep(roles[0],"A"),contributionStep(roles[1],"B"),contributionStep(roles[2],"C"),`C_A:C_B:C_C=${ratioText(weights)},\\quad \\sum C=${toLatex(totalWeight)}`,`P_A=${toLatex(p.totalPayment)}\\times\\frac{${toLatex(weights[0])}}{${toLatex(totalWeight)}}=${toLatex(answerValues[0])}`,`P_B=${toLatex(p.totalPayment)}\\times\\frac{${toLatex(weights[1])}}{${toLatex(totalWeight)}}=${toLatex(answerValues[1])}`,`P_C=${toLatex(p.totalPayment)}\\times\\frac{${toLatex(weights[2])}}{${toLatex(totalWeight)}}=${toLatex(answerValues[2])}`];break;
    }
    case"findPieceRatePaymentFromOutput":{
      const output=roles[target].output,rate=required(p.pieceRate,"pieceRate"),answer=multiply(output,rate);answerValues=[answer];formulaLatex="P=Q\\times p";
      workedLatex=[`Q=${toLatex(output)}\\;\\text{accepted ${p.context.outputUnit}}`,`p=${toLatex(rate)}\\;\\text{per accepted unit}`,`P=${toLatex(output)}\\times${toLatex(rate)}=${toLatex(answer)}`];break;
    }
    case"findBonusShareFromExtraContribution":{
      const bonus=required(p.bonusPool,"bonusPool"),answer=divide(multiply(bonus,weights[target]),totalWeight);answerValues=[answer];formulaLatex="B_i=B_{total}\\frac{Q_i-Q_{base,i}}{\\sum_j(Q_j-Q_{base,j})}";
      workedLatex=roles.map((role,index)=>`\\Delta Q_${"ABC"[index]}=${toLatex(role.output)}-${toLatex(role.baselineOutput)}=${toLatex(weights[index])}`);workedLatex.push(`\\sum \\Delta Q=${weights.map(toLatex).join("+")}=${toLatex(totalWeight)}`,`B_i=${toLatex(bonus)}\\times\\frac{${toLatex(weights[target])}}{${toLatex(totalWeight)}}=${toLatex(answer)}`);break;
    }
    case"findPaymentAfterSignedContribution":{
      const answer=divide(multiply(p.totalPayment,weights[target]),totalWeight);answerValues=[answer];formulaLatex="P_i=P_{total}\\frac{Q_i-Q_{defect,i}}{\\sum_j(Q_j-Q_{defect,j})}";
      workedLatex=roles.map((role,index)=>`Q_{net,${"ABC"[index]}}=${toLatex(role.output)}-${toLatex(role.defectiveOutput)}=${toLatex(weights[index])}`);workedLatex.push(`\\sum Q_{net}=${weights.map(toLatex).join("+")}=${toLatex(totalWeight)}`,`P_i=${toLatex(p.totalPayment)}\\times\\frac{${toLatex(weights[target])}}{${toLatex(totalWeight)}}=${toLatex(answer)}`);break;
    }
  }
  return{answerValues,answerType:entry.answerType,answerText:formatTmwCp008Answer(entry,p,answerValues),answerKey:key(answerValues),formulaLatex,workedLatex};
}
export function verifyTmwCp008(entry:TmwCp008RegistryEntry,p:TmwCp008Parameters,s:TmwCp008Solution):boolean{const fresh=solveTmwCp008(entry,p);return fresh.answerKey===s.answerKey&&fresh.answerText===s.answerText;}
export function validTmwCp008Solution(s:TmwCp008Solution):boolean{return s.answerValues.length>0&&s.answerValues.every(value=>compare(value,r(0))>0)&&(["MONEY","MONEY_TRIPLE","TIME","EFFICIENCY"].includes(s.answerType)?s.answerValues.every(value=>value.denominator===1):true);}
