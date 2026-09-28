import { hashSeed } from "../DI-001/exact";

export type Di003StackedTask =
  | "DIRECT_SEGMENT_VALUE" | "CATEGORY_TOTAL"
  | "WITHIN_CATEGORY_SEGMENT_DIFFERENCE" | "WITHIN_CATEGORY_SEGMENT_RATIO"
  | "TWO_CATEGORY_COMBINED_TOTAL" | "SEGMENT_TOTAL_ACROSS_CATEGORIES"
  | "TWO_CATEGORY_GROUP_RATIO" | "GRAND_TOTAL"
  | "THREE_SEGMENT_CROSS_TOTAL" | "CATEGORY_TOTAL_DIFFERENCE";

export type Di003StackedStimulus=Readonly<{
  kind:"STACKED_BAR";title:string;instruction:string;unit:string;
  segmentLabels:readonly [string,string,string];
  points:readonly Readonly<{category:string;a:number;b:number;c:number}>[];
}>;
export type Di003StackedSet=Readonly<{
  packageId:"DI-003";mode:"STACKED_BAR_V1";seed:string;examProfile:"BANKING_MAINS";
  stimulus:Di003StackedStimulus;
  questions:readonly Readonly<{questionId:string;kind:Di003StackedTask;difficulty:"Easy"|"Medium"|"Hard";stem:string;options:readonly string[];correctIndex:number;answer:string;explanation:Readonly<{keyIdea:string;steps:readonly string[]}>}>[];
}>;

const TASKS={
  easy:["DIRECT_SEGMENT_VALUE","CATEGORY_TOTAL"] as const,
  medium:["WITHIN_CATEGORY_SEGMENT_DIFFERENCE","WITHIN_CATEGORY_SEGMENT_RATIO","TWO_CATEGORY_COMBINED_TOTAL","SEGMENT_TOTAL_ACROSS_CATEGORIES"] as const,
  hard:["TWO_CATEGORY_GROUP_RATIO","GRAND_TOTAL","THREE_SEGMENT_CROSS_TOTAL","CATEGORY_TOTAL_DIFFERENCE"] as const,
};
const CONTEXTS=[
  {title:"Applications by branch and stage",cats:["Branch A","Branch B","Branch C","Branch D","Branch E"],segments:["Approved","Pending","Rejected"] as const,unit:"applications"},
  {title:"Sales by product and channel",cats:["Product P","Product Q","Product R","Product S","Product T"],segments:["Online","Retail","Distributor"] as const,unit:"units"},
  {title:"Students by course and result",cats:["Course A","Course B","Course C","Course D","Course E"],segments:["Passed","Reappear","Absent"] as const,unit:"students"},
] as const;
function pick<T>(a:readonly T[],seed:string):T{return a[hashSeed(seed)%a.length]!;}
function shuffle<T>(a:readonly T[],seed:string){return [...a].sort((x,y)=>hashSeed(`${seed}:${String(x)}`)-hashSeed(`${seed}:${String(y)}`));}
function gcd(a:number,b:number){let x=Math.abs(a),y=Math.abs(b);while(y){const t=x%y;x=y;y=t;}return x||1;}
function ratio(a:number,b:number){const g=gcd(a,b);return `${a/g}:${b/g}`;}
function numOptions(answer:number,seed:string){const s=new Set<number>([answer]);for(let i=1;s.size<5&&i<20;i++){const d=20*i;if(answer-d>=0)s.add(answer-d);s.add(answer+d);}return shuffle([...s].slice(0,5).map(String),seed);}
function ratioOptions(answer:string,a:number,b:number,seed:string){const s=new Set([answer,ratio(b,a),ratio(a+20,b),ratio(a,b+20),ratio(a+40,b+20),ratio(a+20,b+40)]);const out=[...s].slice(0,5);for(let n=2;out.length<5;n++){const v=`${n}:${n+1}`;if(!out.includes(v))out.push(v);}return shuffle(out,seed);}
function build(seed:string):Di003StackedStimulus{
  const c=pick(CONTEXTS,`${seed}:ctx`);
  const values=shuffle([40,60,80,100,120,140,160,180,200,220,240,260,280,300,320],`${seed}:vals`);
  const points=c.cats.map((category,i)=>({category,a:values[i*3]!,b:values[i*3+1]!,c:values[i*3+2]!}));
  return {kind:"STACKED_BAR",title:c.title,instruction:"Study the stacked bar chart and answer the questions that follow.",unit:c.unit,segmentLabels:c.segments,points};
}
function q(task:Di003StackedTask,difficulty:"Easy"|"Medium"|"Hard",s:Di003StackedStimulus,seed:string,index:number){
  const ids=shuffle([0,1,2,3,4],`${seed}:ids`),i=ids[0]!,j=ids[1]!,k=ids[2]!,p=s.points;
  const vals=(r:number)=>[p[r]!.a,p[r]!.b,p[r]!.c] as const;
  const total=(r:number)=>p[r]!.a+p[r]!.b+p[r]!.c;
  let stem="",answer="",options:string[]=[],steps:string[]=[];
  if(task==="DIRECT_SEGMENT_VALUE"){const seg=hashSeed(seed)%3,v=vals(i)[seg];stem=`What is the ${s.segmentLabels[seg]} value for ${p[i]!.category}?`;answer=String(v);options=numOptions(v,seed);steps=[`${s.segmentLabels[seg]} for ${p[i]!.category} = ${v}.`];}
  else if(task==="CATEGORY_TOTAL"){const v=total(i);stem=`What is the total value for ${p[i]!.category}?`;answer=String(v);options=numOptions(v,seed);steps=[`${vals(i).join(" + ")} = ${v}.`];}
  else if(task==="WITHIN_CATEGORY_SEGMENT_DIFFERENCE"){const seg1=0,seg2=1,v=Math.abs(vals(i)[seg1]-vals(i)[seg2]);stem=`What is the difference between ${s.segmentLabels[seg1]} and ${s.segmentLabels[seg2]} for ${p[i]!.category}?`;answer=String(v);options=numOptions(v,seed);steps=[`|${vals(i)[seg1]} − ${vals(i)[seg2]}| = ${v}.`];}
  else if(task==="WITHIN_CATEGORY_SEGMENT_RATIO"){const a=p[i]!.a,b=p[i]!.b,v=ratio(a,b);stem=`What is the ratio of ${s.segmentLabels[0]} to ${s.segmentLabels[1]} for ${p[i]!.category}?`;answer=v;options=ratioOptions(v,a,b,seed);steps=[`${a}:${b} = ${v}.`];}
  else if(task==="TWO_CATEGORY_COMBINED_TOTAL"){const v=total(i)+total(j);stem=`What is the combined total for ${p[i]!.category} and ${p[j]!.category}?`;answer=String(v);options=numOptions(v,seed);steps=[`${total(i)} + ${total(j)} = ${v}.`];}
  else if(task==="SEGMENT_TOTAL_ACROSS_CATEGORIES"){const seg=hashSeed(seed)%3,v=p.reduce((sum,row)=>sum+([row.a,row.b,row.c] as const)[seg],0);stem=`What is the total ${s.segmentLabels[seg]} value across all categories?`;answer=String(v);options=numOptions(v,seed);steps=[`Adding the five ${s.segmentLabels[seg]} values gives ${v}.`];}
  else if(task==="TWO_CATEGORY_GROUP_RATIO"){const a=total(i)+total(j),b=total(k)+total(ids[3]!);const v=ratio(a,b);stem=`What is the ratio of the combined totals for ${p[i]!.category} and ${p[j]!.category} to those for ${p[k]!.category} and ${p[ids[3]!]!.category}?`;answer=v;options=ratioOptions(v,a,b,seed);steps=[`First group = ${a}.`,`Second group = ${b}.`,`Ratio = ${v}.`];}
  else if(task==="GRAND_TOTAL"){const v=p.reduce((sum,_,idx)=>sum+total(idx),0);stem="What is the grand total represented by all five stacked bars?";answer=String(v);options=numOptions(v,seed);steps=[`Grand total = ${v}.`];}
  else if(task==="THREE_SEGMENT_CROSS_TOTAL"){const v=p[i]!.a+p[j]!.b+p[k]!.c;stem=`Find ${s.segmentLabels[0]} of ${p[i]!.category} + ${s.segmentLabels[1]} of ${p[j]!.category} + ${s.segmentLabels[2]} of ${p[k]!.category}.`;answer=String(v);options=numOptions(v,seed);steps=[`${p[i]!.a} + ${p[j]!.b} + ${p[k]!.c} = ${v}.`];}
  else {const v=Math.abs(total(i)-total(j));stem=`What is the difference between the total values for ${p[i]!.category} and ${p[j]!.category}?`;answer=String(v);options=numOptions(v,seed);steps=[`|${total(i)} − ${total(j)}| = ${v}.`];}
  const correctIndex=options.indexOf(answer);if(correctIndex<0)throw new Error("DI-003 stacked answer drift");
  return {questionId:`DI-003-STACKED:${seed}:Q${index+1}`,kind:task,difficulty,stem,options,correctIndex,answer,explanation:{keyIdea:"Read the labelled segment values from the stacked bars, then combine only the required segments.",steps}};
}
export function generateDi003StackedBarSet(input:{seed:string}):Di003StackedSet{
  const s=build(input.seed),m1=pick(TASKS.medium,`${input.seed}:m1`),m2=TASKS.medium[(TASKS.medium.indexOf(m1)+1)%TASKS.medium.length]!,h1=pick(TASKS.hard,`${input.seed}:h1`),h2=TASKS.hard[(TASKS.hard.indexOf(h1)+1)%TASKS.hard.length]!;
  const tasks:[[Di003StackedTask,"Easy"],[Di003StackedTask,"Medium"],[Di003StackedTask,"Medium"],[Di003StackedTask,"Hard"],[Di003StackedTask,"Hard"]]=[[pick(TASKS.easy,`${input.seed}:e`),"Easy"],[m1,"Medium"],[m2,"Medium"],[h1,"Hard"],[h2,"Hard"]];
  return {packageId:"DI-003",mode:"STACKED_BAR_V1",seed:input.seed,examProfile:"BANKING_MAINS",stimulus:s,questions:tasks.map(([t,d],idx)=>q(t,d,s,`${input.seed}:${t}:${idx}`,idx))};
}
export const DI003_STACKED_TASKS=Object.freeze([...TASKS.easy,...TASKS.medium,...TASKS.hard]);
