import { hashSeed } from "../DI-001/exact";
import type { Di005V2Stimulus } from "../DI-005/pie-v2-types";
import type { Di014Difficulty, Di014RadarStimulus, Di014Set, Di014Task } from "./types";

const PARTITIONS=[
  [10,15,20,25,30],
  [5,15,20,25,35],
  [10,10,20,25,35],
  [5,20,20,25,30],
  [10,15,15,20,40],
  [5,10,20,30,35],
  [10,10,15,25,40],
  [5,15,25,25,30],
] as const;
const CONTEXTS=[
  {title:"Applications and approvals across five branches",cats:["Branch A","Branch B","Branch C","Branch D","Branch E"]},
  {title:"Applications and approvals across five regions",cats:["North","South","East","West","Central"]},
  {title:"Applications and approvals across five centres",cats:["Centre A","Centre B","Centre C","Centre D","Centre E"]},
  {title:"Loan applications and sanctions across five zones",cats:["Zone A","Zone B","Zone C","Zone D","Zone E"]},
  {title:"Claims received and settled across five teams",cats:["Team A","Team B","Team C","Team D","Team E"]},
  {title:"Admissions received and confirmed across five courses",cats:["Course A","Course B","Course C","Course D","Course E"]},
  {title:"Orders received and fulfilled across five segments",cats:["Segment A","Segment B","Segment C","Segment D","Segment E"]},
  {title:"Requests received and resolved across five units",cats:["Unit A","Unit B","Unit C","Unit D","Unit E"]},
] as const;
const EASY:readonly Di014Task[]=["DIRECT_APPLICATIONS","APPROVED_COUNT_FROM_PIE"];
const MEDIUM:readonly Di014Task[]=["CATEGORY_GAP","CATEGORY_APPROVAL_RATE","APPLICATION_TO_APPROVAL_RATIO","TWO_CATEGORY_APPROVED_TOTAL","REJECTED_TO_APPROVED_RATIO","TWO_CATEGORY_REJECTED_TOTAL"];
const HARD:readonly Di014Task[]=["TWO_CATEGORY_APPLICATION_TOTAL","GROUP_APPLICATION_TO_APPROVAL_RATIO","TOTAL_APPLICATION_TO_APPROVAL_RATIO","CROSS_CATEGORY_APPLICATION_APPROVAL_RATIO","APPROVAL_RATE_DIFFERENCE","HIGHEST_APPROVAL_RATE"];

function pick<T>(a:readonly T[],seed:string):T{return a[hashSeed(seed)%a.length]!;}
function shuffle<T>(a:readonly T[],seed:string){return [...a].sort((x,y)=>hashSeed(`${seed}:${String(x)}`)-hashSeed(`${seed}:${String(y)}`));}
function gcd(a:number,b:number){let x=Math.abs(a),y=Math.abs(b);while(y){const t=x%y;x=y;y=t;}return x||1;}
function ratio(a:number,b:number){const g=gcd(a,b);return `${a/g}:${b/g}`;}
function numOptions(answer:number,seed:string){const s=new Set<number>([answer]);for(let i=1;s.size<5&&i<30;i++){const d=50*i;if(answer-d>=0)s.add(answer-d);s.add(answer+d);}return shuffle([...s].slice(0,5).map(String),seed);}
function ratioOptions(answer:string,a:number,b:number,seed:string){const s=new Set([answer,ratio(b,a),ratio(a+50,b),ratio(a,b+50),ratio(a+100,b+50),ratio(a+50,b+100)]);const out=[...s].slice(0,5);for(let n=2;out.length<5;n++){const v=`${n}:${n+1}`;if(!out.includes(v))out.push(v);}return shuffle(out,seed);}
function percentOptions(answer:number,seed:string){const vals=new Set<number>([answer]);for(const d of [25,50,-25,75,-50]){if(answer+d>0)vals.add(answer+d);if(vals.size>=5)break;}while(vals.size<5)vals.add(answer+25*vals.size);return shuffle([...vals].slice(0,5).map(v=>`${v}%`),seed);}

function build(seed:string){
  const context=pick(CONTEXTS,`${seed}:ctx`);
  const shares=shuffle(pick(PARTITIONS,`${seed}:shares`),`${seed}:order`);
  const totalApproved=pick([800,1200,1600,2000,2400] as const,`${seed}:approved-total`);
  const approved=shares.map(p=>totalApproved*p/100);
  const rates=approved.map((_,i)=>pick([20,25,40,50] as const,`${seed}:rate:${i}`));
  const applications=approved.map((v,i)=>v*100/rates[i]!);
  if([...approved,...applications].some(v=>!Number.isSafeInteger(v)))throw new Error("DI-014 requires exact integer counts.");
  const max=Math.max(...applications),step=200,yMax=Math.ceil((max+step)/step)*step;
  const radar:Di014RadarStimulus={kind:"RADAR_SINGLE",title:`${context.title} — applications`,instruction:"Use the radar chart together with the pie chart.",unit:"applications",points:context.cats.map((category,i)=>({category,applications:applications[i]!})),radialTicks:Array.from({length:yMax/step+1},(_,i)=>i*step)};
  const pie:Di005V2Stimulus={kind:"PIE",contextId:"DI014_APPROVAL_DISTRIBUTION",title:`${context.title} — approved distribution`,instruction:"The pie chart shows how all approved applications are distributed.",totalValue:totalApproved,totalLabel:"Total approved",unit:"applications",description:"Fully labelled approval distribution used with the radar chart.",slices:context.cats.map((category,i)=>({category,percent:shares[i]!,displayPercent:shares[i]!,angleDegrees:shares[i]!*3.6})),hiddenPercentIndex:-1};
  return {radar,pie,approved,rates,applications};
}

function q(task:Di014Task,difficulty:Di014Difficulty,state:ReturnType<typeof build>,seed:string,index:number){
  const {radar,pie,approved,rates,applications}=state,ids=shuffle([0,1,2,3,4],`${seed}:ids`),i=ids[0]!,j=ids[1]!,k=ids[2]!,l=ids[3]!,cats=radar.points.map(p=>p.category);
  let stem="",answer="",options:string[]=[],steps:string[]=[];
  if(task==="DIRECT_APPLICATIONS"){const v=applications[i]!;stem=`How many applications were received by ${cats[i]}?`;answer=String(v);options=numOptions(v,seed);steps=[`The radar point for ${cats[i]} is labelled ${v}.`];}
  else if(task==="APPROVED_COUNT_FROM_PIE"){const v=approved[i]!,share=pie.slices[i]!.percent;stem=`How many applications were approved for ${cats[i]}?`;answer=String(v);options=numOptions(v,seed);steps=[`${cats[i]} represents ${share}% of ${pie.totalValue} approved applications.`,`Approved = ${v}.`];}
  else if(task==="CATEGORY_GAP"){const v=applications[i]!-approved[i]!;stem=`For ${cats[i]}, how many applications were not approved?`;answer=String(v);options=numOptions(v,seed);steps=[`Received = ${applications[i]}, approved = ${approved[i]}.`,`Not approved = ${v}.`];}
  else if(task==="CATEGORY_APPROVAL_RATE"){const v=rates[i]!;stem=`What percentage of applications received by ${cats[i]} were approved?`;answer=`${v}%`;options=percentOptions(v,seed);steps=[`Approval rate = ${approved[i]} ÷ ${applications[i]} × 100 = ${v}%.`];}
  else if(task==="APPLICATION_TO_APPROVAL_RATIO"){const a=applications[i]!,b=approved[i]!,v=ratio(a,b);stem=`What is the ratio of applications received to applications approved for ${cats[i]}?`;answer=v;options=ratioOptions(v,a,b,seed);steps=[`${a}:${b} = ${v}.`];}
  else if(task==="TWO_CATEGORY_APPROVED_TOTAL"){const v=approved[i]!+approved[j]!;stem=`What is the total number approved for ${cats[i]} and ${cats[j]} together?`;answer=String(v);options=numOptions(v,seed);steps=[`${approved[i]} + ${approved[j]} = ${v}.`];}
  else if(task==="TWO_CATEGORY_APPLICATION_TOTAL"){const v=applications[i]!+applications[j]!;stem=`What is the total number of applications received by ${cats[i]} and ${cats[j]} together?`;answer=String(v);options=numOptions(v,seed);steps=[`${applications[i]} + ${applications[j]} = ${v}.`];}
  else if(task==="GROUP_APPLICATION_TO_APPROVAL_RATIO"){const a=applications[i]!+applications[j]!,b=approved[i]!+approved[j]!,v=ratio(a,b);stem=`What is the ratio of total applications received to total applications approved for ${cats[i]} and ${cats[j]} together?`;answer=v;options=ratioOptions(v,a,b,seed);steps=[`Received total = ${a}.`,`Approved total = ${b}.`,`Ratio = ${v}.`];}
  else if(task==="TOTAL_APPLICATION_TO_APPROVAL_RATIO"){const a=applications.reduce((x,y)=>x+y,0),b=pie.totalValue,v=ratio(a,b);stem="What is the ratio of total applications received across all categories to total applications approved?";answer=v;options=ratioOptions(v,a,b,seed);steps=[`Total received = ${a}.`,`Total approved = ${b}.`,`Ratio = ${v}.`];}
  else if(task==="CROSS_CATEGORY_APPLICATION_APPROVAL_RATIO"){const a=applications[i]!,b=approved[j]!,v=ratio(a,b);stem=`What is the ratio of applications received by ${cats[i]} to applications approved for ${cats[j]}?`;answer=v;options=ratioOptions(v,a,b,seed);steps=[`${a}:${b} = ${v}.`];}
  else if(task==="REJECTED_TO_APPROVED_RATIO"){const rejected=applications[i]!-approved[i]!,v=ratio(rejected,approved[i]!);stem=`For ${cats[i]}, what is the ratio of applications not approved to applications approved?`;answer=v;options=ratioOptions(v,rejected,approved[i]!,seed);steps=[`Not approved = ${applications[i]} - ${approved[i]} = ${rejected}.`,`Ratio = ${v}.`];}
  else if(task==="TWO_CATEGORY_REJECTED_TOTAL"){const r1=applications[i]!-approved[i]!,r2=applications[j]!-approved[j]!,v=r1+r2;stem=`How many applications were not approved for ${cats[i]} and ${cats[j]} together?`;answer=String(v);options=numOptions(v,seed);steps=[`${cats[i]} not approved = ${r1}.`,`${cats[j]} not approved = ${r2}.`,`Total = ${v}.`];}
  else if(task==="APPROVAL_RATE_DIFFERENCE"){const v=Math.abs(rates[i]!-rates[j]!);stem=`What is the difference between the approval rates of ${cats[i]} and ${cats[j]}?`;answer=`${v}%`;options=percentOptions(v,seed);steps=[`Rates are ${rates[i]}% and ${rates[j]}%.`,`Difference = ${v}%.`];}
  else {const v=Math.max(...rates);stem="What is the highest approval rate among the five categories?";answer=`${v}%`;options=percentOptions(v,seed);steps=[...rates.map((rate,n)=>`${cats[n]}: ${rate}%`),`Highest approval rate = ${v}%.`];}
  const correctIndex=options.indexOf(answer);if(correctIndex<0)throw new Error("DI-014 answer drift");
  return {questionId:`DI-014:${seed}:Q${index+1}`,kind:task,difficulty,stem,options,correctIndex,answer,explanation:{keyIdea:"Read received applications from the radar chart and approved applications from the pie distribution, then combine them as required.",steps}};
}

export function generateDi014RadarPieSet(input:{seed:string}):Di014Set{
  const state=build(input.seed);
  const m1=pick(MEDIUM,`${input.seed}:m1`),m2=MEDIUM[(MEDIUM.indexOf(m1)+1)%MEDIUM.length]!,h1=pick(HARD,`${input.seed}:h1`),h2=HARD[(HARD.indexOf(h1)+1)%HARD.length]!;
  const tasks:[[Di014Task,"Easy"],[Di014Task,"Medium"],[Di014Task,"Medium"],[Di014Task,"Hard"],[Di014Task,"Hard"]]=[[pick(EASY,`${input.seed}:e`),"Easy"],[m1,"Medium"],[m2,"Medium"],[h1,"Hard"],[h2,"Hard"]];
  return {packageId:"DI-014",seed:input.seed,examProfile:"BANKING_MAINS",radar:state.radar,pie:state.pie,approvedCounts:state.approved,questions:tasks.map(([t,d],idx)=>q(t,d,state,`${input.seed}:${t}:${idx}`,idx))};
}
export const DI014_TASKS=Object.freeze([...EASY,...MEDIUM,...HARD]);
