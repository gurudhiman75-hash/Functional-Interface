import { hashSeed } from "../DI-001/exact";
import type { Di008AdvancedDifficulty, Di008AdvancedDomain, Di008AdvancedExamProfile, Di008AdvancedQuestion, Di008AdvancedSet, Di008AdvancedStimulus, Di008AdvancedTask } from "./advanced-arithmetic-types";

const DOMAINS: readonly Di008AdvancedDomain[]=["TIME_WORK","TIME_SPEED_DISTANCE","PARTNERSHIP","MIXTURE_ALLIGATION","INTEREST_LOAN","PROBABILITY_SELECTION"];
const EASY: readonly Di008AdvancedTask[]=["ROW_DERIVED_VALUE","TWO_ROW_DERIVED_TOTAL"];
const MEDIUM: readonly Di008AdvancedTask[]=["DERIVED_DIFFERENCE","DERIVED_RATIO","MAXIMUM_DERIVED_VALUE","THREE_ROW_DERIVED_TOTAL"];
const HARD: readonly Di008AdvancedTask[]=["GROUP_DERIVED_RATIO","FOUR_ROW_DERIVED_TOTAL","AVERAGE_DERIVED_VALUE","REMAINDER_DERIVED_TOTAL"];

function pick<T>(a:readonly T[],seed:string):T{return a[hashSeed(seed)%a.length]!;}
function shuffle<T>(a:readonly T[],seed:string){return [...a].sort((x,y)=>hashSeed(`${seed}:${String(x)}`)-hashSeed(`${seed}:${String(y)}`));}
function gcd(a:number,b:number){let x=Math.abs(a),y=Math.abs(b);while(y){const t=x%y;x=y;y=t;}return x||1;}
function ratio(a:number,b:number){const g=gcd(a,b);return `${a/g}:${b/g}`;}
function numOptions(answer:number,seed:string){
  const v=new Set<number>([answer]);
  for(let i=1;v.size<5&&i<=20;i++){const d=Math.max(1,Math.round(answer/10))*i;if(answer-d>0)v.add(answer-d);v.add(answer+d);}
  if(v.size<5)throw new Error("DI-008 advanced option construction failed.");
  return shuffle([...v].slice(0,5).map(String),seed);
}
function ratioOptions(answer:string,a:number,b:number,seed:string){
  const v=new Set<string>([answer,ratio(b,a),ratio(a+1,b),ratio(a,b+1),ratio(a+2,b+1),ratio(a+1,b+2)]);
  const out=[...v].slice(0,5);for(let n=2;out.length<5;n++)out.push(`${n}:${n+1}`);return shuffle(out,seed);
}
function buildStimulus(seed:string){
  const domain=pick(DOMAINS,`${seed}:domain`);
  const labels=shuffle(["A","B","C","D","E"],`${seed}:labels`).map(x=>`Case ${x}`);
  let title="",columnA="",columnB="",columnC:string|undefined,note="",rows:any[]=[],derived:number[]=[];
  if(domain==="TIME_WORK"){
    title="Work completed by five teams";columnA="Workers";columnB="Days";note="Assume equal work done per worker per day.";
    rows=labels.map((label,i)=>({label,a:4+(hashSeed(`${seed}:a:${i}`)%5)*2,b:5+(hashSeed(`${seed}:b:${i}`)%4)*5}));
    derived=rows.map(r=>r.a*r.b);
  } else if(domain==="TIME_SPEED_DISTANCE"){
    title="Travel data for five routes";columnA="Speed (km/h)";columnB="Time (hours)";note="Distance = speed × time.";
    const speeds=[40,50,60,70,80],times=[2,3,4,5,6];rows=labels.map((label,i)=>({label,a:pick(speeds,`${seed}:s:${i}`),b:pick(times,`${seed}:t:${i}`)}));derived=rows.map(r=>r.a*r.b);
  } else if(domain==="PARTNERSHIP"){
    title="Capital invested by five partners";columnA="Capital (₹ thousand)";columnB="Months invested";note="Profit-sharing weight is proportional to capital × time.";
    rows=labels.map((label,i)=>({label,a:20+(hashSeed(`${seed}:c:${i}`)%6)*10,b:4+(hashSeed(`${seed}:m:${i}`)%5)*2}));derived=rows.map(r=>r.a*r.b);
  } else if(domain==="MIXTURE_ALLIGATION"){
    title="Mixtures prepared in five containers";columnA="Quantity (litres)";columnB="Pure component (%)";note="Pure component amount = quantity × percentage ÷ 100.";
    const quantities=[100,120,160,200,240],percentages=[25,40,50,60,75];rows=labels.map((label,i)=>({label,a:pick(quantities,`${seed}:q:${i}`),b:pick(percentages,`${seed}:p:${i}`)}));derived=rows.map(r=>r.a*r.b/100);
  } else if(domain==="INTEREST_LOAN"){
    title="Simple-interest data for five loans";columnA="Principal (₹ thousand)";columnB="Rate (% p.a.)";columnC="Time (years)";note="Simple interest = principal × rate × time ÷ 100.";
    const principals=[100,200,300,400,500],rates=[5,8,10,12],years=[2,3,4,5];rows=labels.map((label,i)=>({label,a:pick(principals,`${seed}:p:${i}`),b:pick(rates,`${seed}:r:${i}`),c:pick(years,`${seed}:y:${i}`)}));derived=rows.map(r=>r.a*r.b*r.c/100);
  } else {
    title="Selection data for five groups";columnA="Eligible candidates";columnB="Selected candidates";note="Selection rate = selected ÷ eligible × 100. Questions use selected counts as the derived comparison value.";
    const eligible=[200,250,300,400,500];const rates=[20,25,40,50,60];rows=labels.map((label,i)=>{const a=pick(eligible,`${seed}:e:${i}`),rate=pick(rates,`${seed}:r:${i}`);return {label,a,b:a*rate/100};});derived=rows.map(r=>r.b);
  }
  if(derived.some(v=>!Number.isSafeInteger(v)||v<=0))throw new Error(`DI-008 advanced generated non-integral derived values for ${domain}.`);
  const stimulus:Di008AdvancedStimulus={kind:"ADVANCED_ARITHMETIC_DI",domain,title,instruction:"Study the data and answer the questions that follow.",columnA,columnB,columnC,rows,note};
  return {stimulus,derived};
}
function derivedLabel(domain:Di008AdvancedDomain){
  if(domain==="TIME_WORK")return"work units";
  if(domain==="TIME_SPEED_DISTANCE")return"distance";
  if(domain==="PARTNERSHIP")return"profit-sharing weight";
  if(domain==="MIXTURE_ALLIGATION")return"pure component amount";
  if(domain==="INTEREST_LOAN")return"simple interest";
  return"selected candidates";
}
function makeQuestion(task:Di008AdvancedTask,difficulty:Di008AdvancedDifficulty,state:ReturnType<typeof buildStimulus>,seed:string,index:number):Di008AdvancedQuestion{
  const {stimulus,derived}=state,label=derivedLabel(stimulus.domain),ids=shuffle([0,1,2,3,4],`${seed}:ids`);
  const i=ids[0]!;
  const distinctJ=ids.find((idx)=>idx!==i && derived[idx]!==derived[i]);
  const j=distinctJ ?? ids[1]!;
  const remaining=ids.filter((idx)=>idx!==i && idx!==j);
  const k=remaining[0] ?? ids[2]!, l=remaining[1] ?? ids[3]!;
  let stem="",answer="",options:string[]=[],steps:string[]=[];
  if(task==="ROW_DERIVED_VALUE"){const v=derived[i]!;stem=`What is the ${label} for ${stimulus.rows[i]!.label}?`;answer=String(v);options=numOptions(v,seed);steps=[`Using the rule shown with the data, the ${label} is ${v}.`];}
  else if(task==="TWO_ROW_DERIVED_TOTAL"){const v=derived[i]!+derived[j]!;stem=`What is the combined ${label} for ${stimulus.rows[i]!.label} and ${stimulus.rows[j]!.label}?`;answer=String(v);options=numOptions(v,seed);steps=[`${derived[i]} + ${derived[j]} = ${v}.`];}
  else if(task==="DERIVED_DIFFERENCE"){const v=Math.abs(derived[i]!-derived[j]!);stem=`What is the difference in ${label} between ${stimulus.rows[i]!.label} and ${stimulus.rows[j]!.label}?`;answer=String(v);options=numOptions(v,seed);steps=[`Difference = |${derived[i]} − ${derived[j]}| = ${v}.`];}
  else if(task==="DERIVED_RATIO"){const v=ratio(derived[i]!,derived[j]!);stem=`What is the ratio of the ${label} for ${stimulus.rows[i]!.label} to that for ${stimulus.rows[j]!.label}?`;answer=v;options=ratioOptions(v,derived[i]!,derived[j]!,seed);steps=[`${derived[i]}:${derived[j]} = ${v}.`];}
  else if(task==="HIGHEST_DERIVED_CATEGORY"){const best=derived.reduce((p,v,idx)=>v>derived[p]!?idx:p,0);stem=`Which case has the highest ${label}?`;answer=stimulus.rows[best]!.label;options=shuffle(stimulus.rows.map(r=>r.label),seed);steps=[...derived.map((v,idx)=>`${stimulus.rows[idx]!.label}: ${v}`),`The highest value is for ${answer}.`];}
  else if(task==="THREE_ROW_DERIVED_TOTAL"){const v=derived[i]!+derived[j]!+derived[k]!;stem=`Find the total ${label} for ${stimulus.rows[i]!.label}, ${stimulus.rows[j]!.label} and ${stimulus.rows[k]!.label}.`;answer=String(v);options=numOptions(v,seed);steps=[`${derived[i]} + ${derived[j]} + ${derived[k]} = ${v}.`];}
  else if(task==="GROUP_DERIVED_RATIO"){const a=derived[i]!+derived[j]!,b=derived[k]!+derived[l]!,v=ratio(a,b);stem=`What is the ratio of combined ${label} for ${stimulus.rows[i]!.label} and ${stimulus.rows[j]!.label} to that for ${stimulus.rows[k]!.label} and ${stimulus.rows[l]!.label}?`;answer=v;options=ratioOptions(v,a,b,seed);steps=[`First group = ${a}.`,`Second group = ${b}.`,`Ratio = ${v}.`];}
  else if(task==="FOUR_ROW_DERIVED_TOTAL"){const v=derived[i]!+derived[j]!+derived[k]!+derived[l]!;stem=`Find the total ${label} for ${stimulus.rows[i]!.label}, ${stimulus.rows[j]!.label}, ${stimulus.rows[k]!.label} and ${stimulus.rows[l]!.label}.`;answer=String(v);options=numOptions(v,seed);steps=[`${derived[i]} + ${derived[j]} + ${derived[k]} + ${derived[l]} = ${v}.`];}
  else if(task==="AVERAGE_DERIVED_VALUE"){
    const triples:[[number,number,number],number][]=[];
    for(let a=0;a<5;a++)for(let b=a+1;b<5;b++)for(let c=b+1;c<5;c++){const sum=derived[a]!+derived[b]!+derived[c]!;if(sum%3===0)triples.push([[a,b,c],sum]);}
    if(!triples.length)throw new Error("DI-008 advanced could not find an exact three-row average.");
    const [triple,sum]=pick(triples,`${seed}:avg-triple`),[a,b,c]=triple,v=sum/3;
    stem=`What is the average ${label} for ${stimulus.rows[a]!.label}, ${stimulus.rows[b]!.label} and ${stimulus.rows[c]!.label}?`;answer=String(v);options=numOptions(v,seed);steps=[`Sum = ${sum}.`,`Average = ${sum} ÷ 3 = ${v}.`];
  }
  else {const total=derived.reduce((a,b)=>a+b,0),excluded=derived[i]!+derived[j]!,v=total-excluded;stem=`What ${label} remains after excluding ${stimulus.rows[i]!.label} and ${stimulus.rows[j]!.label}?`;answer=String(v);options=numOptions(v,seed);steps=[`Total = ${total}.`,`Excluded = ${excluded}.`,`Remaining = ${v}.`];}
  const correctIndex=options.indexOf(answer);if(correctIndex<0)throw new Error(`DI-008 advanced lost answer for ${task}.`);
  return {questionId:`DI-008-ADV:${seed}:Q${index+1}`,kind:task,difficulty,stem,options,correctIndex,answer,explanation:{keyIdea:`First derive the ${label} from the learner-visible data, then perform the requested comparison.`,steps}};
}
export function generateDi008AdvancedArithmeticSet(input:{seed:string;examProfile?:Di008AdvancedExamProfile}):Di008AdvancedSet{
  const state=buildStimulus(input.seed),examProfile=input.examProfile??"BANKING_MAINS";
  const m1=pick(MEDIUM,`${input.seed}:m1`);let m2=pick(MEDIUM,`${input.seed}:m2`);if(m1===m2)m2=MEDIUM[(MEDIUM.indexOf(m1)+1)%MEDIUM.length]!;
  const h1=pick(HARD,`${input.seed}:h1`);let h2=pick(HARD,`${input.seed}:h2`);if(h1===h2)h2=HARD[(HARD.indexOf(h1)+1)%HARD.length]!;
  const tasks:[Di008AdvancedTask,Di008AdvancedDifficulty][]=[[pick(EASY,`${input.seed}:e`),"Easy"],[m1,"Medium"],[m2,"Medium"],[h1,"Hard"],[h2,"Hard"]];
  const questions=tasks.map(([task,difficulty],i)=>makeQuestion(task,difficulty,state,`${input.seed}:${task}:${i}`,i));
  return {packageId:"DI-008",mode:"ADVANCED_ARITHMETIC_DOMAINS_V1",seed:input.seed,examProfile,stimulus:state.stimulus,derivedValues:state.derived,questions};
}
export const DI008_ADVANCED_DOMAINS=Object.freeze([...DOMAINS]);
export const DI008_ADVANCED_TASKS=Object.freeze([...EASY,...MEDIUM,...HARD]);
