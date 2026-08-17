import { add, compare, divide, equals, formatRational, formatTimeText, multiply, rational, reciprocal, subtract, toLatex } from "./rational";
import { required } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp004Parameters, TmwCp004RegistryEntry, TmwCp004Solution } from "./cp004-types";

function sum(values:Rational[]):Rational{return values.reduce((a,b)=>add(a,b),rational(0));}
function work(rate:Rational,duration:Rational):Rational{return multiply(rate,duration);}
function remaining(done:Rational):Rational{return subtract(rational(1),done);}
function abs(v:Rational):Rational{return v.numerator<0?rational(-v.numerator,v.denominator):v;}
function answerText(entry:TmwCp004RegistryEntry,p:TmwCp004Parameters,a:Rational):string{
 const value=formatRational(a);
 if(entry.answerType==="TIME")return formatTimeText(a,p.timeUnit,`${p.timeUnit}s`);
 if(entry.answerType==="FRACTION")return `${value} of the work`;
 if(entry.answerType==="RATE")return `${value} of the work per ${p.timeUnit}`;
 return `${value} workers`;
}
function reqRate(p:TmwCp004Parameters,k:"rateA"|"rateB"|"rateC"):Rational{return required(p[k],k);}
function reqDur(p:TmwCp004Parameters,k:"durationA"|"durationB"|"durationC"):Rational{return required(p[k],k);}

export function solveTmwCp004(entry:TmwCp004RegistryEntry,p:TmwCp004Parameters):TmwCp004Solution{
 let answer:Rational, formulaLatex:string, workedLatex:string[];
 switch(entry.solveMode){
  case "findRemainingWorkAfterInitialPhase":{
   const r=reqRate(p,"rateA"),d=reqDur(p,"durationA"),done=work(r,d);answer=remaining(done);
   formulaLatex="W_{remaining}=1-r_At_1";
   workedLatex=[`W_1=${toLatex(r)}\\times${toLatex(d)}=${toLatex(done)}`,`W_{remaining}=1-${toLatex(done)}=${toLatex(answer)}`];break;
  }
  case "findWorkCompletedBeforeEvent":{
   const r=add(reqRate(p,"rateA"),reqRate(p,"rateB")),d=reqDur(p,"durationA");answer=work(r,d);
   formulaLatex="W_1=(r_A+r_B)t_1";
   workedLatex=[`r_{AB}=${toLatex(reqRate(p,"rateA"))}+${toLatex(reqRate(p,"rateB"))}=${toLatex(r)}`,`W_1=${toLatex(r)}\\times${toLatex(d)}=${toLatex(answer)}`];break;
  }
  case "findTotalTimeWhenFirstAgentStartsThenSecondFinishes":{
   const rA=reqRate(p,"rateA"),rB=reqRate(p,"rateB"),d=reqDur(p,"durationA"),rem=remaining(work(rA,d)),final=divide(rem,rB);answer=add(d,final);
   formulaLatex="T=t_1+\\frac{1-r_At_1}{r_B}";
   workedLatex=[`W_1=${toLatex(rA)}\\times${toLatex(d)}=${toLatex(work(rA,d))}`,`W_{remaining}=1-W_1=${toLatex(rem)}`,`T=${toLatex(d)}+\\frac{${toLatex(rem)}}{${toLatex(rB)}}=${toLatex(answer)}`];break;
  }
  case "findTotalTimeWhenTeamStartsThenOneLeaves":{
   const rA=reqRate(p,"rateA"),rB=reqRate(p,"rateB"),d=reqDur(p,"durationA"),done=work(add(rA,rB),d),rem=remaining(done),final=divide(rem,rA);answer=add(d,final);
   formulaLatex="T=t_1+\\frac{1-(r_A+r_B)t_1}{r_A}";
   workedLatex=[`W_1=(${toLatex(rA)}+${toLatex(rB)})\\times${toLatex(d)}=${toLatex(done)}`,`W_{remaining}=${toLatex(rem)}`,`T=${toLatex(d)}+\\frac{${toLatex(rem)}}{${toLatex(rA)}}=${toLatex(answer)}`];break;
  }
  case "findTotalTimeWhenOneStartsThenAnotherJoins":{
   const rA=reqRate(p,"rateA"),rB=reqRate(p,"rateB"),d=reqDur(p,"durationA"),done=work(rA,d),rem=remaining(done),final=divide(rem,add(rA,rB));answer=add(d,final);
   formulaLatex="T=t_1+\\frac{1-r_At_1}{r_A+r_B}";
   workedLatex=[`W_1=${toLatex(rA)}\\times${toLatex(d)}=${toLatex(done)}`,`W_{remaining}=${toLatex(rem)}`,`T=${toLatex(d)}+\\frac{${toLatex(rem)}}{${toLatex(add(rA,rB))}}=${toLatex(answer)}`];break;
  }
  case "findTotalTimeWithStaggeredJoins":{
   const rA=reqRate(p,"rateA"),rB=reqRate(p,"rateB"),rC=reqRate(p,"rateC"),d1=reqDur(p,"durationA"),d2=reqDur(p,"durationB");
   const w1=work(rA,d1),w2=work(add(rA,rB),d2),rem=remaining(add(w1,w2)),d3=divide(rem,sum([rA,rB,rC]));answer=add(add(d1,d2),d3);
   formulaLatex="T=t_1+t_2+\\frac{1-r_At_1-(r_A+r_B)t_2}{r_A+r_B+r_C}";
   workedLatex=[`W_1=${toLatex(w1)}`,`W_2=${toLatex(w2)}`,`W_{remaining}=1-${toLatex(w1)}-${toLatex(w2)}=${toLatex(rem)}`,`T=${toLatex(d1)}+${toLatex(d2)}+\\frac{${toLatex(rem)}}{${toLatex(sum([rA,rB,rC]))}}=${toLatex(answer)}`];break;
  }
  case "findTotalTimeWithStaggeredExits":{
   const rA=reqRate(p,"rateA"),rB=reqRate(p,"rateB"),rC=reqRate(p,"rateC"),d1=reqDur(p,"durationA"),d2=reqDur(p,"durationB");
   const w1=work(sum([rA,rB,rC]),d1),w2=work(add(rA,rB),d2),rem=remaining(add(w1,w2)),d3=divide(rem,rA);answer=add(add(d1,d2),d3);
   formulaLatex="T=t_1+t_2+\\frac{1-(r_A+r_B+r_C)t_1-(r_A+r_B)t_2}{r_A}";
   workedLatex=[`W_1=${toLatex(w1)}`,`W_2=${toLatex(w2)}`,`W_{remaining}=${toLatex(rem)}`,`T=${toLatex(d1)}+${toLatex(d2)}+\\frac{${toLatex(rem)}}{${toLatex(rA)}}=${toLatex(answer)}`];break;
  }
  case "findTotalTimeWithJoinAndLeaveEvents":{
   const rA=reqRate(p,"rateA"),rB=reqRate(p,"rateB"),d1=reqDur(p,"durationA"),d2=reqDur(p,"durationB");
   const w1=work(rA,d1),w2=work(add(rA,rB),d2),rem=remaining(add(w1,w2)),d3=divide(rem,rB);answer=add(add(d1,d2),d3);
   formulaLatex="T=t_1+t_2+\\frac{1-r_At_1-(r_A+r_B)t_2}{r_B}";
   workedLatex=[`W_1=${toLatex(w1)}`,`W_2=${toLatex(w2)}`,`W_{remaining}=${toLatex(rem)}`,`T=${toLatex(d1)}+${toLatex(d2)}+\\frac{${toLatex(rem)}}{${toLatex(rB)}}=${toLatex(answer)}`];break;
  }
  case "findJoinTimeFromFinalCompletion":{
   const rA=reqRate(p,"rateA"),rB=reqRate(p,"rateB"),T=required(p.totalCompletionTime,"totalCompletionTime");
   answer=divide(subtract(multiply(T,add(rA,rB)),rational(1)),rB);
   formulaLatex="x r_A+(T-x)(r_A+r_B)=1";
   workedLatex=[`x=\\frac{T(r_A+r_B)-1}{r_B}`,`x=\\frac{${toLatex(T)}\\times${toLatex(add(rA,rB))}-1}{${toLatex(rB)}}=${toLatex(answer)}`];break;
  }
  case "findLeaveTimeFromFinalCompletion":{
   const rA=reqRate(p,"rateA"),rB=reqRate(p,"rateB"),T=required(p.totalCompletionTime,"totalCompletionTime");
   answer=divide(subtract(rational(1),multiply(T,rB)),rA);
   formulaLatex="x(r_A+r_B)+(T-x)r_B=1";
   workedLatex=[`x=\\frac{1-Tr_B}{r_A}`,`x=\\frac{1-${toLatex(T)}\\times${toLatex(rB)}}{${toLatex(rA)}}=${toLatex(answer)}`];break;
  }
  case "findUnknownInitialPhaseDuration":{
   const rA=reqRate(p,"rateA"),rB=reqRate(p,"rateB"),y=reqDur(p,"durationB");answer=divide(subtract(rational(1),work(rB,y)),rA);
   formulaLatex="r_Ax+r_By=1";
   workedLatex=[`x=\\frac{1-r_By}{r_A}`,`x=\\frac{1-${toLatex(rB)}\\times${toLatex(y)}}{${toLatex(rA)}}=${toLatex(answer)}`];break;
  }
  case "findUnknownFinalPhaseDuration":{
   const rA=reqRate(p,"rateA"),rB=reqRate(p,"rateB"),x=reqDur(p,"durationA"),rem=remaining(work(rA,x));answer=divide(rem,rB);
   formulaLatex="y=\\frac{1-r_Ax}{r_B}";
   workedLatex=[`W_{remaining}=1-${toLatex(rA)}\\times${toLatex(x)}=${toLatex(rem)}`,`y=\\frac{${toLatex(rem)}}{${toLatex(rB)}}=${toLatex(answer)}`];break;
  }
  case "findReplacementWorkerRate":{
   const rA=reqRate(p,"rateA"),x=reqDur(p,"durationA"),y=reqDur(p,"durationB"),rem=remaining(work(rA,x));answer=divide(rem,y);
   formulaLatex="r_B=\\frac{1-r_Ax}{y}";
   workedLatex=[`W_{remaining}=1-${toLatex(rA)}\\times${toLatex(x)}=${toLatex(rem)}`,`r_B=\\frac{${toLatex(rem)}}{${toLatex(y)}}=${toLatex(answer)}`];break;
  }
  case "findReplacementWorkerTime":{
   const rA=reqRate(p,"rateA"),x=reqDur(p,"durationA"),y=reqDur(p,"durationB"),rem=remaining(work(rA,x)),rB=divide(rem,y);answer=reciprocal(rB);
   formulaLatex="T_B=\\frac{1}{(1-r_Ax)/y}";
   workedLatex=[`W_{remaining}=${toLatex(rem)}`,`r_B=\\frac{${toLatex(rem)}}{${toLatex(y)}}=${toLatex(rB)}`,`T_B=\\frac{1}{${toLatex(rB)}}=${toLatex(answer)}`];break;
  }
  case "findCompletionWithIdleInterval":{
   const rA=reqRate(p,"rateA"),rB=reqRate(p,"rateB"),x=reqDur(p,"durationA"),idle=required(p.idleDuration,"idleDuration"),rem=remaining(work(rA,x)),final=divide(rem,rB);answer=add(add(x,idle),final);
   formulaLatex="T=t_1+t_{idle}+\\frac{1-r_At_1}{r_B}";
   workedLatex=[`W_{remaining}=1-${toLatex(rA)}\\times${toLatex(x)}=${toLatex(rem)}`,`T=${toLatex(x)}+${toLatex(idle)}+\\frac{${toLatex(rem)}}{${toLatex(rB)}}=${toLatex(answer)}`];break;
  }
  case "findCompletionWithChangedDailyHours":{
   const oldDaily=reqRate(p,"rateA"),oldHours=required(p.originalDailyHours,"originalDailyHours"),newHours=required(p.changedDailyHours,"changedDailyHours"),x=reqDur(p,"durationA");
   const hourly=divide(oldDaily,oldHours),newDaily=multiply(hourly,newHours),rem=remaining(work(oldDaily,x)),final=divide(rem,newDaily);answer=add(x,final);
   formulaLatex="r_{new}=r_{old}\\frac{h_{new}}{h_{old}},\\qquad T=t_1+\\frac{1-r_{old}t_1}{r_{new}}";
   workedLatex=[`r_{new}=${toLatex(oldDaily)}\\times\\frac{${toLatex(newHours)}}{${toLatex(oldHours)}}=${toLatex(newDaily)}`,`W_{remaining}=1-${toLatex(oldDaily)}\\times${toLatex(x)}=${toLatex(rem)}`,`T=${toLatex(x)}+\\frac{${toLatex(rem)}}{${toLatex(newDaily)}}=${toLatex(answer)}`];break;
  }
  case "findCompletionWithMidProjectEfficiencyChange":{
   const r=reqRate(p,"rateA"),m=required(p.efficiencyMultiplier,"efficiencyMultiplier"),x=reqDur(p,"durationA"),newRate=multiply(r,m),rem=remaining(work(r,x)),final=divide(rem,newRate);answer=add(x,final);
   formulaLatex="r_{new}=mr,\\qquad T=t_1+\\frac{1-rt_1}{mr}";
   workedLatex=[`r_{new}=${toLatex(m)}\\times${toLatex(r)}=${toLatex(newRate)}`,`W_{remaining}=${toLatex(rem)}`,`T=${toLatex(x)}+\\frac{${toLatex(rem)}}{${toLatex(newRate)}}=${toLatex(answer)}`];break;
  }
  case "findCompletionWithNegativeWorkerActivatedLater":{
   const rA=reqRate(p,"rateA"),rB=reqRate(p,"rateB"),rC=reqRate(p,"rateC"),x=reqDur(p,"durationA"),positive=add(rA,rB),done=work(positive,x),rem=remaining(done),net=subtract(positive,rC),final=divide(rem,net);answer=add(x,final);
   formulaLatex="T=t_1+\\frac{1-(r_A+r_B)t_1}{r_A+r_B-r_C}";
   workedLatex=[`W_1=${toLatex(positive)}\\times${toLatex(x)}=${toLatex(done)}`,`r_{net}=${toLatex(positive)}-${toLatex(rC)}=${toLatex(net)}`,`T=${toLatex(x)}+\\frac{${toLatex(rem)}}{${toLatex(net)}}=${toLatex(answer)}`];break;
  }
  case "findEventTimeAtSpecifiedCompletionFraction":{
   const r=reqRate(p,"rateA"),f=required(p.targetFraction,"targetFraction");answer=divide(f,r);
   formulaLatex="t_{event}=\\frac{W_{event}}{r_A}";
   workedLatex=[`t_{event}=\\frac{${toLatex(f)}}{${toLatex(r)}}=${toLatex(answer)}`];break;
  }
  case "findRequiredRemainingRateForDeadline":{
   const r=reqRate(p,"rateA"),x=reqDur(p,"durationA"),D=required(p.deadline,"deadline"),rem=remaining(work(r,x)),available=subtract(D,x);answer=divide(rem,available);
   formulaLatex="r_{required}=\\frac{1-r_At_1}{D-t_1}";
   workedLatex=[`W_{remaining}=1-${toLatex(r)}\\times${toLatex(x)}=${toLatex(rem)}`,`t_{available}=${toLatex(D)}-${toLatex(x)}=${toLatex(available)}`,`r_{required}=\\frac{${toLatex(rem)}}{${toLatex(available)}}=${toLatex(answer)}`];break;
  }
  case "findWorkerCountAddedAfterPartialProgress":{
   const per=reqRate(p,"rateA"),x=reqDur(p,"durationA"),D=required(p.deadline,"deadline"),n=rational(required(p.initialWorkerCount,"initialWorkerCount"));
   const done=work(multiply(n,per),x),rem=remaining(done),available=subtract(D,x),requiredTotal=divide(rem,multiply(per,available));answer=subtract(requiredTotal,n);
   formulaLatex="n_{added}=\\frac{1-nr_xt_1}{r_x(D-t_1)}-n";
   workedLatex=[`W_{remaining}=1-${toLatex(n)}\\times${toLatex(per)}\\times${toLatex(x)}=${toLatex(rem)}`,`n_{final}=\\frac{${toLatex(rem)}}{${toLatex(per)}\\times${toLatex(available)}}=${toLatex(requiredTotal)}`,`n_{added}=${toLatex(requiredTotal)}-${toLatex(n)}=${toLatex(answer)}`];break;
  }
  case "findWorkerCountRemovedAfterPartialProgress":{
   const per=reqRate(p,"rateA"),x=reqDur(p,"durationA"),D=required(p.deadline,"deadline"),n=rational(required(p.initialWorkerCount,"initialWorkerCount"));
   const done=work(multiply(n,per),x),rem=remaining(done),available=subtract(D,x),finalCount=divide(rem,multiply(per,available));answer=subtract(n,finalCount);
   formulaLatex="n_{removed}=n-\\frac{1-nr_xt_1}{r_x(D-t_1)}";
   workedLatex=[`W_{remaining}=${toLatex(rem)}`,`n_{final}=\\frac{${toLatex(rem)}}{${toLatex(per)}\\times${toLatex(available)}}=${toLatex(finalCount)}`,`n_{removed}=${toLatex(n)}-${toLatex(finalCount)}=${toLatex(answer)}`];break;
  }
  case "findDelayAfterWorkerLeaves":{
   const rA=reqRate(p,"rateA"),rB=reqRate(p,"rateB"),x=reqDur(p,"durationA"),combined=add(rA,rB),baseline=reciprocal(combined),rem=remaining(work(combined,x)),actual=add(x,divide(rem,rA));answer=subtract(actual,baseline);
   formulaLatex="\\text{delay}=T_{staged}-T_{together}";
   workedLatex=[`T_{together}=\\frac{1}{${toLatex(combined)}}=${toLatex(baseline)}`,`T_{staged}=${toLatex(x)}+\\frac{${toLatex(rem)}}{${toLatex(rA)}}=${toLatex(actual)}`,`\\text{delay}=${toLatex(actual)}-${toLatex(baseline)}=${toLatex(answer)}`];break;
  }
  case "findEarlyCompletionAfterWorkerJoins":{
   const rA=reqRate(p,"rateA"),rB=reqRate(p,"rateB"),x=reqDur(p,"durationA"),baseline=reciprocal(rA),rem=remaining(work(rA,x)),actual=add(x,divide(rem,add(rA,rB)));answer=subtract(baseline,actual);
   formulaLatex="\\text{time saved}=T_{A\\ alone}-T_{staged}";
   workedLatex=[`T_{A\\ alone}=${toLatex(baseline)}`,`T_{staged}=${toLatex(x)}+\\frac{${toLatex(rem)}}{${toLatex(add(rA,rB))}}=${toLatex(actual)}`,`\\text{time saved}=${toLatex(baseline)}-${toLatex(actual)}=${toLatex(answer)}`];break;
  }
 }
 return {answer,answerType:entry.answerType,formulaLatex,workedLatex,answerText:answerText(entry,p,answer)};
}

export function verifyTmwCp004(entry:TmwCp004RegistryEntry,p:TmwCp004Parameters,s:TmwCp004Solution):boolean{
 const a=s.answer;
 switch(entry.solveMode){
  case "findRemainingWorkAfterInitialPhase": return equals(add(a,work(reqRate(p,"rateA"),reqDur(p,"durationA"))),rational(1));
  case "findWorkCompletedBeforeEvent": return equals(a,work(add(reqRate(p,"rateA"),reqRate(p,"rateB")),reqDur(p,"durationA")));
  case "findTotalTimeWhenFirstAgentStartsThenSecondFinishes": return equals(add(work(reqRate(p,"rateA"),reqDur(p,"durationA")),work(reqRate(p,"rateB"),subtract(a,reqDur(p,"durationA")))),rational(1));
  case "findTotalTimeWhenTeamStartsThenOneLeaves": return equals(add(work(add(reqRate(p,"rateA"),reqRate(p,"rateB")),reqDur(p,"durationA")),work(reqRate(p,"rateA"),subtract(a,reqDur(p,"durationA")))),rational(1));
  case "findTotalTimeWhenOneStartsThenAnotherJoins": return equals(add(work(reqRate(p,"rateA"),reqDur(p,"durationA")),work(add(reqRate(p,"rateA"),reqRate(p,"rateB")),subtract(a,reqDur(p,"durationA")))),rational(1));
  case "findTotalTimeWithStaggeredJoins": return equals(sum([work(reqRate(p,"rateA"),reqDur(p,"durationA")),work(add(reqRate(p,"rateA"),reqRate(p,"rateB")),reqDur(p,"durationB")),work(sum([reqRate(p,"rateA"),reqRate(p,"rateB"),reqRate(p,"rateC")]),subtract(subtract(a,reqDur(p,"durationA")),reqDur(p,"durationB")))]),rational(1));
  case "findTotalTimeWithStaggeredExits": return equals(sum([work(sum([reqRate(p,"rateA"),reqRate(p,"rateB"),reqRate(p,"rateC")]),reqDur(p,"durationA")),work(add(reqRate(p,"rateA"),reqRate(p,"rateB")),reqDur(p,"durationB")),work(reqRate(p,"rateA"),subtract(subtract(a,reqDur(p,"durationA")),reqDur(p,"durationB")))]),rational(1));
  case "findTotalTimeWithJoinAndLeaveEvents": return equals(sum([work(reqRate(p,"rateA"),reqDur(p,"durationA")),work(add(reqRate(p,"rateA"),reqRate(p,"rateB")),reqDur(p,"durationB")),work(reqRate(p,"rateB"),subtract(subtract(a,reqDur(p,"durationA")),reqDur(p,"durationB")))]),rational(1));
  case "findJoinTimeFromFinalCompletion": return equals(add(work(reqRate(p,"rateA"),a),work(add(reqRate(p,"rateA"),reqRate(p,"rateB")),subtract(required(p.totalCompletionTime,"totalCompletionTime"),a))),rational(1));
  case "findLeaveTimeFromFinalCompletion": return equals(add(work(add(reqRate(p,"rateA"),reqRate(p,"rateB")),a),work(reqRate(p,"rateB"),subtract(required(p.totalCompletionTime,"totalCompletionTime"),a))),rational(1));
  case "findUnknownInitialPhaseDuration": return equals(add(work(reqRate(p,"rateA"),a),work(reqRate(p,"rateB"),reqDur(p,"durationB"))),rational(1));
  case "findUnknownFinalPhaseDuration": return equals(add(work(reqRate(p,"rateA"),reqDur(p,"durationA")),work(reqRate(p,"rateB"),a)),rational(1));
  case "findReplacementWorkerRate": return equals(add(work(reqRate(p,"rateA"),reqDur(p,"durationA")),work(a,reqDur(p,"durationB"))),rational(1));
  case "findReplacementWorkerTime": return equals(add(work(reqRate(p,"rateA"),reqDur(p,"durationA")),work(reciprocal(a),reqDur(p,"durationB"))),rational(1));
  case "findCompletionWithIdleInterval": return equals(add(work(reqRate(p,"rateA"),reqDur(p,"durationA")),work(reqRate(p,"rateB"),subtract(subtract(a,reqDur(p,"durationA")),required(p.idleDuration,"idleDuration")))),rational(1));
  case "findCompletionWithChangedDailyHours":{
   const old=reqRate(p,"rateA"),newRate=multiply(old,divide(required(p.changedDailyHours,"changedDailyHours"),required(p.originalDailyHours,"originalDailyHours")));return equals(add(work(old,reqDur(p,"durationA")),work(newRate,subtract(a,reqDur(p,"durationA")))),rational(1));
  }
  case "findCompletionWithMidProjectEfficiencyChange": return equals(add(work(reqRate(p,"rateA"),reqDur(p,"durationA")),work(multiply(reqRate(p,"rateA"),required(p.efficiencyMultiplier,"efficiencyMultiplier")),subtract(a,reqDur(p,"durationA")))),rational(1));
  case "findCompletionWithNegativeWorkerActivatedLater": return equals(add(work(add(reqRate(p,"rateA"),reqRate(p,"rateB")),reqDur(p,"durationA")),work(subtract(add(reqRate(p,"rateA"),reqRate(p,"rateB")),reqRate(p,"rateC")),subtract(a,reqDur(p,"durationA")))),rational(1));
  case "findEventTimeAtSpecifiedCompletionFraction": return equals(work(reqRate(p,"rateA"),a),required(p.targetFraction,"targetFraction"));
  case "findRequiredRemainingRateForDeadline": return equals(add(work(reqRate(p,"rateA"),reqDur(p,"durationA")),work(a,subtract(required(p.deadline,"deadline"),reqDur(p,"durationA")))),rational(1));
  case "findWorkerCountAddedAfterPartialProgress":{
   const n=rational(required(p.initialWorkerCount,"initialWorkerCount")),final=add(n,a);return equals(add(work(multiply(n,reqRate(p,"rateA")),reqDur(p,"durationA")),work(multiply(final,reqRate(p,"rateA")),subtract(required(p.deadline,"deadline"),reqDur(p,"durationA")))),rational(1));
  }
  case "findWorkerCountRemovedAfterPartialProgress":{
   const n=rational(required(p.initialWorkerCount,"initialWorkerCount")),final=subtract(n,a);return equals(add(work(multiply(n,reqRate(p,"rateA")),reqDur(p,"durationA")),work(multiply(final,reqRate(p,"rateA")),subtract(required(p.deadline,"deadline"),reqDur(p,"durationA")))),rational(1));
  }
  case "findDelayAfterWorkerLeaves":{
   const rA=reqRate(p,"rateA"),rB=reqRate(p,"rateB"),x=reqDur(p,"durationA"),baseline=reciprocal(add(rA,rB)),actual=add(x,divide(remaining(work(add(rA,rB),x)),rA));return equals(a,subtract(actual,baseline));
  }
  case "findEarlyCompletionAfterWorkerJoins":{
   const rA=reqRate(p,"rateA"),rB=reqRate(p,"rateB"),x=reqDur(p,"durationA"),actual=add(x,divide(remaining(work(rA,x)),add(rA,rB)));return equals(a,subtract(reciprocal(rA),actual));
  }
 }
}
