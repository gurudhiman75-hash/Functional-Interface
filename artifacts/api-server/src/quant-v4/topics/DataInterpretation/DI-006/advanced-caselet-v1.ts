import { hashSeed } from "../DI-001/exact";
import type { Di006AdvancedDifficulty, Di006AdvancedExamProfile, Di006AdvancedQuestion, Di006AdvancedSet, Di006AdvancedStimulus, Di006AdvancedTask, Di006AdvancedTopology } from "./advanced-caselet-types";

const TOPOLOGIES: readonly Di006AdvancedTopology[] = [
  "PERCENT_DISTRIBUTION",
  "RATIO_NETWORK",
  "TWO_STAGE_ALLOCATION",
  "TWO_GROUP_COMPARISON",
  "CONDITIONAL_DERIVED",
];
const CONTEXTS = [
  { title:"Loan applications processed by five branches", labels:["Branch A","Branch B","Branch C","Branch D","Branch E"], unit:"applications" },
  { title:"Insurance claims handled by five teams", labels:["Team P","Team Q","Team R","Team S","Team T"], unit:"claims" },
  { title:"Students enrolled in five training batches", labels:["Batch A","Batch B","Batch C","Batch D","Batch E"], unit:"students" },
  { title:"Orders handled by five service units", labels:["Unit A","Unit B","Unit C","Unit D","Unit E"], unit:"orders" },
  { title:"Cases completed by five departments", labels:["Dept A","Dept B","Dept C","Dept D","Dept E"], unit:"cases" },
] as const;

const EASY: readonly Di006AdvancedTask[] = ["RECOVER_SINGLE_CATEGORY","COMBINED_TWO_CATEGORIES"];
const MEDIUM: readonly Di006AdvancedTask[] = ["CATEGORY_DIFFERENCE","CATEGORY_RATIO","CATEGORY_SHARE_OF_TOTAL","GROUP_TOTAL"];
const HARD: readonly Di006AdvancedTask[] = ["GROUP_RATIO","DERIVED_PERCENT_EXCESS","THREE_CATEGORY_TOTAL","REMAINDER_AFTER_GROUP"];

function pick<T>(items:readonly T[],seed:string):T{return items[hashSeed(seed)%items.length]!;}
function gcd(a:number,b:number){let x=Math.abs(a),y=Math.abs(b);while(y){const t=x%y;x=y;y=t;}return x||1;}
function ratio(a:number,b:number){const g=gcd(a,b);return `${a/g}:${b/g}`;}
function shuffle<T>(items:readonly T[],seed:string){return [...items].sort((a,b)=>hashSeed(`${seed}:${String(a)}`)-hashSeed(`${seed}:${String(b)}`));}
function numOptions(answer:number,seed:string){
  const values=new Set<number>([answer]);
  for(let i=1;values.size<5&&i<=20;i++){
    const step=20*i;
    if(answer-step>0) values.add(answer-step);
    values.add(answer+step);
  }
  if(values.size<5) throw new Error("DI-006 advanced could not build numeric options.");
  return shuffle([...values].slice(0,5).map(String),seed);
}
function ratioOptions(answer:string,a:number,b:number,seed:string){
  const values=new Set<string>([answer,ratio(b,a),ratio(a+20,b),ratio(a,b+20),ratio(a+40,b+20),ratio(a+20,b+40)]);
  const out=[...values].slice(0,5);
  for(let i=2;out.length<5;i++)out.push(`${i}:${i+1}`);
  return shuffle(out,seed);
}
function percentOptions(answer:number,seed:string){
  const values=new Set<number>([answer]);
  for(const d of [5,10,15,20,-5,-10,-15,-20]){const v=answer+d;if(v>0)values.add(v);if(values.size>=5)break;}
  return shuffle([...values].slice(0,5).map(v=>`${v}%`),seed);
}

function buildState(seed:string){
  const topology=pick(TOPOLOGIES,`${seed}:topology`);
  const context=pick(CONTEXTS,`${seed}:context`);
  const labels=shuffle(context.labels,`${seed}:labels`);
  let values:number[]=[];
  let learnerText="";
  if(topology==="PERCENT_DISTRIBUTION"){
    const total=1000 + (hashSeed(`${seed}:total`)%5)*200;
    const shares=pick([[10,15,20,25,30],[10,20,20,20,30],[5,15,20,25,35]] as const,`${seed}:shares`);
    values=shares.map(p=>total*p/100);
    learnerText=`A total of ${total} ${context.unit} were distributed among five categories. ${labels[0]} accounted for ${shares[0]}% of the total, ${labels[1]} for ${shares[1]}%, ${labels[2]} for ${shares[2]}%, and ${labels[3]} for ${shares[3]}%. The remaining ${context.unit} belonged to ${labels[4]}.`;
  } else if(topology==="RATIO_NETWORK"){
    const k=40+(hashSeed(`${seed}:k`)%4)*20;
    values=[3*k,4*k,5*k,2*k,6*k];
    const total=values.reduce((a,b)=>a+b,0);
    learnerText=`The total number of ${context.unit} was ${total}. The numbers for ${labels[0]} and ${labels[1]} were in the ratio 3:4. The numbers for ${labels[1]} and ${labels[2]} were in the ratio 4:5. ${labels[3]} had half as many as ${labels[1]}. The remaining ${context.unit} belonged to ${labels[4]}.`;
  } else if(topology==="TWO_STAGE_ALLOCATION"){
    const total=1200+(hashSeed(`${seed}:total`)%4)*400;
    const first=total*60/100, second=total-first;
    values=[first*25/100,first*35/100,first*40/100,second*40/100,second*60/100];
    learnerText=`A total of ${total} ${context.unit} were split into two groups. Group I contained 60% of the total and was divided among ${labels[0]}, ${labels[1]} and ${labels[2]} in the ratio 25:35:40. Group II contained the remaining 40% and was divided between ${labels[3]} and ${labels[4]} in the ratio 2:3.`;
  } else if(topology==="TWO_GROUP_COMPARISON"){
    const base=200+(hashSeed(`${seed}:base`)%4)*40;
    values=[base,base+40,base+80,base*2,base*2+80];
    const total=values.reduce((a,b)=>a+b,0);
    learnerText=`The five categories together accounted for ${total} ${context.unit}. ${labels[1]} had 40 more than ${labels[0]}, while ${labels[2]} had 80 more than ${labels[0]}. The combined number for ${labels[3]} and ${labels[4]} was ${values[3]+values[4]}, and ${labels[4]} had 80 more than ${labels[3]}.`;
  } else {
    const a=200+(hashSeed(`${seed}:a`)%4)*40;
    values=[a,a*3/2,a*2,a*5/2,a*3];
    const total=values.reduce((x,y)=>x+y,0);
    learnerText=`The five categories together accounted for ${total} ${context.unit}. ${labels[1]} was 50% more than ${labels[0]}. ${labels[2]} was twice ${labels[0]}. ${labels[3]} was 25% more than ${labels[2]}. ${labels[4]} was 20% more than ${labels[3]}.`;
  }
  if(values.some(v=>!Number.isSafeInteger(v)||v<=0))throw new Error(`DI-006 advanced generated invalid state for ${topology}.`);
  return {topology,context,labels,values,total:values.reduce((a,b)=>a+b,0),learnerText};
}

function makeQuestion(task:Di006AdvancedTask,difficulty:Di006AdvancedDifficulty,state:ReturnType<typeof buildState>,seed:string,index:number):Di006AdvancedQuestion{
  const {labels,values,total}=state;
  const ids=shuffle([0,1,2,3,4],`${seed}:ids`);
  const i=ids[0]!,j=ids[1]!,k=ids[2]!;
  let stem="",answer="",options:string[]=[],steps:string[]=[];
  if(task==="RECOVER_SINGLE_CATEGORY"){
    const v=values[i]!;stem=`How many ${state.context.unit} belonged to ${labels[i]}?`;answer=String(v);options=numOptions(v,seed);steps=[`Using the stated relations, ${labels[i]} = ${v}.`];
  } else if(task==="COMBINED_TWO_CATEGORIES"){
    const v=values[i]!+values[j]!;stem=`What is the combined number for ${labels[i]} and ${labels[j]}?`;answer=String(v);options=numOptions(v,seed);steps=[`${values[i]} + ${values[j]} = ${v}.`];
  } else if(task==="CATEGORY_DIFFERENCE"){
    const v=Math.abs(values[i]!-values[j]!);stem=`What is the difference between ${labels[i]} and ${labels[j]}?`;answer=String(v);options=numOptions(v,seed);steps=[`Difference = |${values[i]} − ${values[j]}| = ${v}.`];
  } else if(task==="CATEGORY_RATIO"){
    const v=ratio(values[i]!,values[j]!);stem=`What is the ratio of ${labels[i]} to ${labels[j]}?`;answer=v;options=ratioOptions(v,values[i]!,values[j]!,seed);steps=[`${values[i]}:${values[j]} = ${v}.`];
  } else if(task==="CATEGORY_SHARE_OF_TOTAL"){
    const raw=values[i]!*100/total;
    const v=Math.round(raw);
    stem=`${labels[i]} accounts for approximately what whole percent of the total?`;answer=`${v}%`;options=percentOptions(v,seed);steps=[`Share = (${values[i]} ÷ ${total}) × 100 ≈ ${v}%.`];
  } else if(task==="GROUP_TOTAL"){
    const v=values[i]!+values[j]!+values[k]!;stem=`What is the total for ${labels[i]}, ${labels[j]} and ${labels[k]} together?`;answer=String(v);options=numOptions(v,seed);steps=[`${values[i]} + ${values[j]} + ${values[k]} = ${v}.`];
  } else if(task==="GROUP_RATIO"){
    const left=values[i]!+values[j]!,right=values[k]!+values[ids[3]!]!,v=ratio(left,right);stem=`What is the ratio of the combined number for ${labels[i]} and ${labels[j]} to that for ${labels[k]} and ${labels[ids[3]!]}?`;answer=v;options=ratioOptions(v,left,right,seed);steps=[`First group = ${left}.`,`Second group = ${right}.`,`Ratio = ${v}.`];
  } else if(task==="DERIVED_PERCENT_EXCESS"){
    let a=values[i]!,b=values[j]!,an=labels[i]!,bn=labels[j]!;
    if(a<b){[a,b]=[b,a];[an,bn]=[bn,an];}
    const raw=(a-b)*100/b, v=Math.round(raw);
    stem=`${an} is approximately what whole percent more than ${bn}?`;answer=`${v}%`;options=percentOptions(v,seed);steps=[`Difference = ${a-b}.`,`Percentage excess = (${a-b} ÷ ${b}) × 100 ≈ ${v}%.`];
  } else if(task==="THREE_CATEGORY_TOTAL"){
    const v=values[i]!+values[j]!+values[k]!;stem=`Find the total for ${labels[i]}, ${labels[j]} and ${labels[k]} after resolving all stated relations.`;answer=String(v);options=numOptions(v,seed);steps=[`${values[i]} + ${values[j]} + ${values[k]} = ${v}.`];
  } else {
    const group=values[i]!+values[j]!,v=total-group;stem=`How many ${state.context.unit} remain after excluding ${labels[i]} and ${labels[j]}?`;answer=String(v);options=numOptions(v,seed);steps=[`Excluded total = ${values[i]} + ${values[j]} = ${group}.`,`Remaining = ${total} − ${group} = ${v}.`];
  }
  const correctIndex=options.indexOf(answer);if(correctIndex<0)throw new Error(`DI-006 advanced lost answer for ${task}.`);
  return {questionId:`DI-006-ADV:${seed}:Q${index+1}`,kind:task,difficulty,stem,options,correctIndex,answer,explanation:{keyIdea:"Resolve the caselet relations first, then use only the required category values.",steps}};
}

export function generateDi006AdvancedCaseletSet(input:{seed:string;examProfile?:Di006AdvancedExamProfile}):Di006AdvancedSet{
  const state=buildState(input.seed),examProfile=input.examProfile??"BANKING_MAINS";
  const m1=pick(MEDIUM,`${input.seed}:m1`);let m2=pick(MEDIUM,`${input.seed}:m2`);if(m1===m2)m2=MEDIUM[(MEDIUM.indexOf(m1)+1)%MEDIUM.length]!;
  const h1=pick(HARD,`${input.seed}:h1`);let h2=pick(HARD,`${input.seed}:h2`);if(h1===h2)h2=HARD[(HARD.indexOf(h1)+1)%HARD.length]!;
  const tasks:[Di006AdvancedTask,Di006AdvancedDifficulty][]=[[pick(EASY,`${input.seed}:e`),"Easy"],[m1,"Medium"],[m2,"Medium"],[h1,"Hard"],[h2,"Hard"]];
  const stimulus:Di006AdvancedStimulus={kind:"ADVANCED_CASELET",topology:state.topology,title:state.context.title,instruction:"Read the caselet carefully and answer the questions that follow.",learnerText:state.learnerText,categories:state.labels,totalValue:state.total,unit:state.context.unit};
  const questions=tasks.map(([task,difficulty],i)=>makeQuestion(task,difficulty,state,`${input.seed}:${task}:${i}`,i));
  return {packageId:"DI-006",mode:"ADVANCED_CASELET_TOPOLOGIES_V1",seed:input.seed,examProfile,stimulus,resolvedValues:state.values,questions};
}
export const DI006_ADVANCED_TOPOLOGIES=Object.freeze([...TOPOLOGIES]);
export const DI006_ADVANCED_TASKS=Object.freeze([...EASY,...MEDIUM,...HARD]);
