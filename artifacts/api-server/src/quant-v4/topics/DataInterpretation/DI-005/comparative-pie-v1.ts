import { hashSeed } from "../DI-001/exact";
import type { Di005V2Difficulty, Di005V2Stimulus } from "./pie-v2-types";

export type Di005ComparativeExamProfile = "BANKING_PRELIMS" | "BANKING_MAINS";

export type Di005ComparativeTask =
  | "SAME_CATEGORY_COUNT_DIFFERENCE"
  | "SAME_CATEGORY_COUNT_RATIO"
  | "SAME_CATEGORY_COMBINED_COUNT"
  | "CROSS_CATEGORY_COUNT_SUM"
  | "LARGEST_ABSOLUTE_CHANGE"
  | "TWO_CATEGORY_GROUP_RATIO"
  | "COMBINED_TOTAL_ACROSS_PIES"
  | "CROSS_PIE_GROUP_DIFFERENCE"
  | "THREE_VALUE_CROSS_TOTAL"
  | "FOUR_VALUE_CROSS_RATIO";

export type Di005ComparativeSet = Readonly<{
  packageId:"DI-005";
  mode:"COMPARATIVE_DOUBLE_PIE_V1";
  seed:string;
  examProfile:Di005ComparativeExamProfile;
  left:Di005V2Stimulus;
  right:Di005V2Stimulus;
  questions:readonly Readonly<{
    questionId:string;
    kind:Di005ComparativeTask;
    difficulty:Di005V2Difficulty;
    stem:string;
    options:readonly string[];
    correctIndex:number;
    answer:string;
    explanation:Readonly<{keyIdea:string;steps:readonly string[]}>;
  }>[];
}>;

const CONTEXTS=[
  {title:"Distribution of applications in two years",categories:["Category A","Category B","Category C","Category D","Category E"],unit:"applications"},
  {title:"Distribution of sales in two periods",categories:["Product P","Product Q","Product R","Product S","Product T"],unit:"units"},
  {title:"Distribution of students in two sessions",categories:["Course A","Course B","Course C","Course D","Course E"],unit:"students"},
  {title:"Distribution of orders in two quarters",categories:["Segment A","Segment B","Segment C","Segment D","Segment E"],unit:"orders"},
] as const;
const PARTITIONS=[
  [10,15,20,25,30],
  [5,15,20,25,35],
  [10,10,20,25,35],
  [5,20,20,25,30],
  [10,15,15,25,35],
] as const;
const EASY:readonly Di005ComparativeTask[]=["SAME_CATEGORY_COUNT_DIFFERENCE","SAME_CATEGORY_COMBINED_COUNT"];
const MEDIUM:readonly Di005ComparativeTask[]=["SAME_CATEGORY_COUNT_RATIO","CROSS_CATEGORY_COUNT_SUM","LARGEST_ABSOLUTE_CHANGE","COMBINED_TOTAL_ACROSS_PIES"];
const HARD:readonly Di005ComparativeTask[]=["TWO_CATEGORY_GROUP_RATIO","CROSS_PIE_GROUP_DIFFERENCE","THREE_VALUE_CROSS_TOTAL","FOUR_VALUE_CROSS_RATIO"];

function pick<T>(a:readonly T[],seed:string):T{return a[hashSeed(seed)%a.length]!;}
function shuffle<T>(a:readonly T[],seed:string){return [...a].sort((x,y)=>hashSeed(`${seed}:${String(x)}`)-hashSeed(`${seed}:${String(y)}`));}
function gcd(a:number,b:number){let x=Math.abs(a),y=Math.abs(b);while(y){const t=x%y;x=y;y=t;}return x||1;}
function ratio(a:number,b:number){const g=gcd(a,b);return `${a/g}:${b/g}`;}
function numOptions(answer:number,seed:string){const v=new Set<number>([answer]);for(let i=1;v.size<5&&i<20;i++){const d=20*i;if(answer-d>=0)v.add(answer-d);v.add(answer+d);}return shuffle([...v].slice(0,5).map(String),seed);}
function ratioOptions(answer:string,a:number,b:number,seed:string){const v=new Set([answer,ratio(b,a),ratio(a+20,b),ratio(a,b+20),ratio(a+40,b+20),ratio(a+20,b+40)]);const out=[...v].slice(0,5);for(let i=2;out.length<5;i++)out.push(`${i}:${i+1}`);return shuffle(out,seed);}
function makeStimulus(seed:string,title:string,categories:readonly string[],unit:string,total:number,shares:readonly number[],period:string):Di005V2Stimulus{
  return {kind:"PIE",contextId:"COMPARATIVE_"+period,title:`${title} — ${period}`,instruction:"Study both pie charts and answer the questions that follow.",totalValue:total,totalLabel:"Total",unit,description:`Fully-labelled comparative pie chart for ${period}.`,slices:categories.map((category,i)=>({category,percent:shares[i]!,displayPercent:shares[i]!,angleDegrees:shares[i]!*3.6})),hiddenPercentIndex:-1};
}
function build(seed:string){
  const c=pick(CONTEXTS,`${seed}:ctx`);
  const leftShares=shuffle(pick(PARTITIONS,`${seed}:lp`),`${seed}:lo`);
  let rightShares=shuffle(pick(PARTITIONS,`${seed}:rp`),`${seed}:ro`);
  if(rightShares.join(",")===leftShares.join(",")) rightShares=[...rightShares.slice(1),rightShares[0]!];
  const leftTotal=1000+(hashSeed(`${seed}:lt`)%5)*200;
  const rightTotal=1200+(hashSeed(`${seed}:rt`)%5)*200;
  const left=makeStimulus(seed,c.title,c.categories,c.unit,leftTotal,leftShares,"Period 1");
  const right=makeStimulus(seed,c.title,c.categories,c.unit,rightTotal,rightShares,"Period 2");
  const lc=left.slices.map(s=>leftTotal*s.percent/100),rc=right.slices.map(s=>rightTotal*s.percent/100);
  if([...lc,...rc].some(v=>!Number.isSafeInteger(v)))throw new Error("DI-005 comparative generated non-integral counts.");
  return {left,right,lc,rc};
}
function question(task:Di005ComparativeTask,difficulty:Di005V2Difficulty,state:ReturnType<typeof build>,seed:string,index:number){
  const {left,right,lc,rc}=state,ids=shuffle([0,1,2,3,4],`${seed}:ids`),i=ids[0]!,j=ids[1]!,k=ids[2]!,l=ids[3]!;
  const cat=(n:number)=>left.slices[n]!.category;
  let stem="",answer="",options:string[]=[],steps:string[]=[];
  if(task==="SAME_CATEGORY_COUNT_DIFFERENCE"){const v=Math.abs(lc[i]!-rc[i]!);stem=`What is the difference between the Period 1 and Period 2 counts for ${cat(i)}?`;answer=String(v);options=numOptions(v,seed);steps=[`Period 1 = ${lc[i]}, Period 2 = ${rc[i]}.`,`Difference = ${v}.`];}
  else if(task==="SAME_CATEGORY_COMBINED_COUNT"){const v=lc[i]!+rc[i]!;stem=`What is the combined count for ${cat(i)} across both periods?`;answer=String(v);options=numOptions(v,seed);steps=[`${lc[i]} + ${rc[i]} = ${v}.`];}
  else if(task==="SAME_CATEGORY_COUNT_RATIO"){const v=ratio(lc[i]!,rc[i]!);stem=`What is the ratio of the Period 1 count to the Period 2 count for ${cat(i)}?`;answer=v;options=ratioOptions(v,lc[i]!,rc[i]!,seed);steps=[`${lc[i]}:${rc[i]} = ${v}.`];}
  else if(task==="CROSS_CATEGORY_COUNT_SUM"){const v=lc[i]!+rc[j]!;stem=`Find the sum of the Period 1 count for ${cat(i)} and the Period 2 count for ${cat(j)}.`;answer=String(v);options=numOptions(v,seed);steps=[`${lc[i]} + ${rc[j]} = ${v}.`];}
  else if(task==="LARGEST_ABSOLUTE_CHANGE"){const diffs=lc.map((v,n)=>Math.abs(v-rc[n]!)),v=Math.max(...diffs);stem="What is the largest absolute change in count for any category between the two periods?";answer=String(v);options=numOptions(v,seed);steps=diffs.map((d,n)=>`${cat(n)}: change = ${d}`).concat([`Largest change = ${v}.`]);}
  else if(task==="COMBINED_TOTAL_ACROSS_PIES"){const v=left.totalValue+right.totalValue;stem="What is the combined total represented by the two pie charts?";answer=String(v);options=numOptions(v,seed);steps=[`${left.totalValue} + ${right.totalValue} = ${v}.`];}
  else if(task==="TWO_CATEGORY_GROUP_RATIO"){const a=lc[i]!+rc[i]!,b=lc[j]!+rc[j]!,v=ratio(a,b);stem=`What is the ratio of the two-period combined count for ${cat(i)} to that for ${cat(j)}?`;answer=v;options=ratioOptions(v,a,b,seed);steps=[`${cat(i)} total = ${a}.`,`${cat(j)} total = ${b}.`,`Ratio = ${v}.`];}
  else if(task==="CROSS_PIE_GROUP_DIFFERENCE"){const a=lc[i]!+lc[j]!,b=rc[k]!+rc[l]!,v=Math.abs(a-b);stem=`What is the difference between the Period 1 total for ${cat(i)} and ${cat(j)} and the Period 2 total for ${cat(k)} and ${cat(l)}?`;answer=String(v);options=numOptions(v,seed);steps=[`First group = ${a}.`,`Second group = ${b}.`,`Difference = ${v}.`];}
  else if(task==="THREE_VALUE_CROSS_TOTAL"){const v=lc[i]!+rc[j]!+lc[k]!;stem=`Find the total of Period 1 ${cat(i)}, Period 2 ${cat(j)}, and Period 1 ${cat(k)}.`;answer=String(v);options=numOptions(v,seed);steps=[`${lc[i]} + ${rc[j]} + ${lc[k]} = ${v}.`];}
  else {const a=lc[i]!+rc[j]!,b=lc[k]!+rc[l]!,v=ratio(a,b);stem=`What is the ratio of (Period 1 ${cat(i)} + Period 2 ${cat(j)}) to (Period 1 ${cat(k)} + Period 2 ${cat(l)})?`;answer=v;options=ratioOptions(v,a,b,seed);steps=[`First total = ${a}.`,`Second total = ${b}.`,`Ratio = ${v}.`];}
  const correctIndex=options.indexOf(answer);if(correctIndex<0)throw new Error(`DI-005 comparative lost answer for ${task}.`);
  return {questionId:`DI-005-COMP:${seed}:Q${index+1}`,kind:task,difficulty,stem,options,correctIndex,answer,explanation:{keyIdea:"Convert the visible sector percentages to counts using each pie's own total, then compare the required values.",steps}};
}
export function generateDi005ComparativePieSet(input:{seed:string;examProfile?:Di005ComparativeExamProfile}):Di005ComparativeSet{
  const state=build(input.seed),examProfile=input.examProfile??"BANKING_PRELIMS";
  const m1=pick(MEDIUM,`${input.seed}:m1`);let m2=pick(MEDIUM,`${input.seed}:m2`);if(m1===m2)m2=MEDIUM[(MEDIUM.indexOf(m1)+1)%MEDIUM.length]!;
  const h1=pick(HARD,`${input.seed}:h1`);let h2=pick(HARD,`${input.seed}:h2`);if(h1===h2)h2=HARD[(HARD.indexOf(h1)+1)%HARD.length]!;
  const tasks:[Di005ComparativeTask,Di005V2Difficulty][]=[[pick(EASY,`${input.seed}:e`),"Easy"],[m1,"Medium"],[m2,"Medium"],[h1,"Hard"],[h2,"Hard"]];
  return {packageId:"DI-005",mode:"COMPARATIVE_DOUBLE_PIE_V1",seed:input.seed,examProfile,left:state.left,right:state.right,questions:tasks.map(([t,d],i)=>question(t,d,state,`${input.seed}:${t}:${i}`,i))};
}
export const DI005_COMPARATIVE_TASKS=Object.freeze([...EASY,...MEDIUM,...HARD]);
