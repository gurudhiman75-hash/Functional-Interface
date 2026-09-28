import { hashSeed } from "../DI-001/exact";
import type { Di005V2Difficulty, Di005V2ExamProfile, Di005V2Stimulus } from "./pie-v2-types";

export type Di005FullyVisibleTaskKind =
  | "DIRECT_SECTOR_PERCENT"
  | "LARGEST_SECTOR_IDENTIFICATION"
  | "SMALLEST_SECTOR_IDENTIFICATION"
  | "SECTOR_ANGLE_DEGREES"
  | "SECTOR_COUNT_FROM_TOTAL"
  | "COMBINED_SECTOR_PERCENT"
  | "DIFFERENCE_IN_COUNTS"
  | "RATIO_OF_TWO_SECTORS"
  | "RELATIVE_SECTOR_PERCENT_EXCESS"
  | "COMBINED_SECTOR_ANGLE"
  | "REMAINDER_AFTER_TWO_SECTORS_COUNT";

export type Di005FullyVisibleQuestion = Readonly<{
  questionId: string;
  kind: Di005FullyVisibleTaskKind;
  difficulty: Di005V2Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answer: string;
  explanation: Readonly<{ keyIdea: string; steps: readonly string[] }>;
}>;

export type Di005FullyVisibleSet = Readonly<{
  packageId: "DI-005";
  mode: "FULLY_VISIBLE_PIE_V1";
  seed: string;
  examProfile: Di005V2ExamProfile;
  stimulus: Di005V2Stimulus;
  questions: readonly Di005FullyVisibleQuestion[];
}>;

const CONTEXTS = [
  { id:"COURSE_ENROLMENT", title:"Distribution of students among five courses", categories:["Course A","Course B","Course C","Course D","Course E"], totalLabel:"Total students", unit:"students", totals:[800,1000,1200,1600,2000] },
  { id:"BOOK_CATEGORIES", title:"Distribution of books issued by category", categories:["Fiction","Science","History","Commerce","General"], totalLabel:"Total books issued", unit:"books", totals:[800,1000,1200,1600,2000] },
  { id:"DEPARTMENT_STAFF", title:"Distribution of employees among departments", categories:["Sales","Accounts","Operations","Support","Administration"], totalLabel:"Total employees", unit:"employees", totals:[400,600,800,1000,1200] },
  { id:"PRODUCT_OUTPUT", title:"Distribution of production among five products", categories:["Product P","Product Q","Product R","Product S","Product T"], totalLabel:"Total production", unit:"units", totals:[1000,1200,1600,2000,2400] },
  { id:"SPORTS_PARTICIPATION", title:"Distribution of participants among five sports", categories:["Cricket","Football","Badminton","Athletics","Volleyball"], totalLabel:"Total participants", unit:"participants", totals:[400,600,800,1000,1200] },
  { id:"ORDER_CATEGORIES", title:"Distribution of orders among five categories", categories:["Category A","Category B","Category C","Category D","Category E"], totalLabel:"Total orders", unit:"orders", totals:[800,1000,1200,1600,2000] },
] as const;

const SHARES = [
  [10,15,20,25,30],
  [5,15,20,25,35],
  [5,10,20,30,35],
  [5,10,15,30,40],
  [5,10,20,25,40],
] as const;

const EASY: readonly Di005FullyVisibleTaskKind[] = ["DIRECT_SECTOR_PERCENT","LARGEST_SECTOR_IDENTIFICATION","SMALLEST_SECTOR_IDENTIFICATION"];
const MEDIUM: readonly Di005FullyVisibleTaskKind[] = ["SECTOR_ANGLE_DEGREES","SECTOR_COUNT_FROM_TOTAL","COMBINED_SECTOR_PERCENT","DIFFERENCE_IN_COUNTS"];
const HARD: readonly Di005FullyVisibleTaskKind[] = ["RATIO_OF_TWO_SECTORS","RELATIVE_SECTOR_PERCENT_EXCESS","COMBINED_SECTOR_ANGLE","REMAINDER_AFTER_TWO_SECTORS_COUNT"];

function pick<T>(items:readonly T[],seed:string){return items[hashSeed(seed)%items.length]!;}
function shuffled<T>(items:readonly T[],seed:string){return [...items].sort((a,b)=>hashSeed(`${seed}:${String(a)}`)-hashSeed(`${seed}:${String(b)}`));}
function gcd(a:number,b:number){let x=Math.abs(a),y=Math.abs(b);while(y){const t=x%y;x=y;y=t;}return x||1;}
function ratio(a:number,b:number){const g=gcd(a,b);return `${a/g}:${b/g}`;}
function options(answer:string,candidates:readonly string[],count:4|5,seed:string){
  const seen=new Set<string>(), values:string[]=[];
  for(const value of [answer,...candidates]){
    if(!seen.has(value)){seen.add(value);values.push(value);}
  }
  if(/^\d+$/.test(answer)){
    const n=Number(answer);
    for(let i=1;values.length<count&&i<=20;i++){
      const v=String(Math.max(0,n+10*(i%2?i:-i)));
      if(!seen.has(v)){seen.add(v);values.push(v);}
    }
  }
  if(values.length<count) throw new Error(`DI-005 fully-visible could not build ${count} options for ${answer}.`);
  return shuffled(values.slice(0,count),seed);
}
function pair(seed:string){const ids=shuffled([0,1,2,3,4],seed);return [ids[0]!,ids[1]!] as const;}

function buildQuestion(task:Di005FullyVisibleTaskKind,difficulty:Di005V2Difficulty,stimulus:Di005V2Stimulus,seed:string,index:number,optionCount:4|5):Di005FullyVisibleQuestion{
  const slices=stimulus.slices;
  const counts=slices.map(s=>stimulus.totalValue*s.percent/100);
  let stem="",answer="",cands:string[]=[],steps:string[]=[];
  if(task==="DIRECT_SECTOR_PERCENT"){
    const i=hashSeed(seed)%5,s=slices[i]!; stem=`What percentage of the total is represented by ${s.category}?`;answer=`${s.percent}%`;cands=slices.filter((_,j)=>j!==i).map(x=>`${x.percent}%`);steps=[`${s.category} is labelled ${s.percent}% in the chart.`];
  } else if(task==="LARGEST_SECTOR_IDENTIFICATION"||task==="SMALLEST_SECTOR_IDENTIFICATION"){
    const sorted=[...slices].sort((a,b)=>task==="LARGEST_SECTOR_IDENTIFICATION"?b.percent-a.percent:a.percent-b.percent);answer=sorted[0]!.category;stem=task==="LARGEST_SECTOR_IDENTIFICATION"?"Which category has the largest share in the pie chart?":"Which category has the smallest share in the pie chart?";cands=slices.map(s=>s.category);steps=[`${answer} has the ${task==="LARGEST_SECTOR_IDENTIFICATION"?"highest":"lowest"} labelled percentage.`];
  } else if(task==="SECTOR_ANGLE_DEGREES"){
    const i=hashSeed(seed)%5,s=slices[i]!;const v=s.percent*3.6;stem=`What angle at the centre represents ${s.category}?`;answer=`${v}°`;cands=[v-18,v+18,v+36,v-36].filter(x=>x>0).map(x=>`${x}°`);steps=[`Central angle = ${s.percent}% of 360° = ${v}°.`];
  } else if(task==="SECTOR_COUNT_FROM_TOTAL"){
    const i=hashSeed(seed)%5,s=slices[i]!,v=counts[i]!;stem=`How many ${stimulus.unit} are represented by ${s.category}?`;answer=String(v);cands=[v-40,v+40,v-80,v+80].filter(x=>x>=0).map(String);steps=[`${s.percent}% of ${stimulus.totalValue} = ${v}.`];
  } else if(task==="COMBINED_SECTOR_PERCENT"){
    const [i,j]=pair(seed),a=slices[i]!,b=slices[j]!,v=a.percent+b.percent;stem=`Together, what percentage do ${a.category} and ${b.category} represent?`;answer=`${v}%`;cands=[Math.abs(a.percent-b.percent),100-v,a.percent,b.percent].map(x=>`${x}%`);steps=[`${a.percent}% + ${b.percent}% = ${v}%.`];
  } else if(task==="DIFFERENCE_IN_COUNTS"){
    const [i,j]=pair(seed),a=slices[i]!,b=slices[j]!,v=Math.abs(counts[i]!-counts[j]!);stem=`What is the difference between the counts for ${a.category} and ${b.category}?`;answer=String(v);cands=[counts[i]!+counts[j]!,Math.abs(a.percent-b.percent),v+stimulus.totalValue/20,Math.max(0,v-stimulus.totalValue/20)].map(String);steps=[`${a.category}: ${counts[i]}; ${b.category}: ${counts[j]}.`,`Difference = ${v}.`];
  } else if(task==="RATIO_OF_TWO_SECTORS"){
    const [i,j]=pair(seed),a=slices[i]!,b=slices[j]!,v=ratio(a.percent,b.percent);stem=`What is the ratio of ${a.category} to ${b.category}?`;answer=v;cands=[ratio(b.percent,a.percent),ratio(a.percent,a.percent+b.percent),ratio(a.percent+5,b.percent),ratio(a.percent,b.percent+5)];steps=[`Required ratio = ${a.percent}:${b.percent} = ${v}.`];
  } else if(task==="RELATIVE_SECTOR_PERCENT_EXCESS"){
    const [i,j]=pair(seed),x=slices[i]!,y=slices[j]!,a=x.percent>=y.percent?x:y,b=x.percent>=y.percent?y:x;const v=((a.percent-b.percent)*100)/b.percent;stem=`${a.category} is what percent more than ${b.category}?`;answer=`${v}%`;cands=[a.percent-b.percent,(a.percent-b.percent)*100/a.percent,a.percent*100/b.percent,100-v].map(x=>`${x}%`);steps=[`Difference = ${a.percent-b.percent} percentage points.`,`Relative increase = (${a.percent-b.percent} ÷ ${b.percent}) × 100 = ${v}%.`];
  } else if(task==="COMBINED_SECTOR_ANGLE"){
    const [i,j]=pair(seed),a=slices[i]!,b=slices[j]!,v=(a.percent+b.percent)*3.6;stem=`What is the combined central angle of ${a.category} and ${b.category}?`;answer=`${v}°`;cands=[Math.abs(a.percent-b.percent)*3.6,a.percent*3.6,b.percent*3.6,360-v].map(x=>`${x}°`);steps=[`Combined share = ${a.percent+b.percent}%.`,`Angle = ${a.percent+b.percent}% of 360° = ${v}°.`];
  } else {
    const [i,j]=pair(seed),a=slices[i]!,b=slices[j]!,share=100-a.percent-b.percent,v=stimulus.totalValue*share/100;stem=`How many ${stimulus.unit} belong to categories other than ${a.category} and ${b.category}?`;answer=String(v);cands=[stimulus.totalValue-v,stimulus.totalValue*a.percent/100,stimulus.totalValue*b.percent/100,v+stimulus.totalValue/20].map(String);steps=[`Remaining share = 100% − ${a.percent}% − ${b.percent}% = ${share}%.`,`${share}% of ${stimulus.totalValue} = ${v}.`];
  }
  const opts=options(answer,cands,optionCount,`${seed}:options`),correctIndex=opts.indexOf(answer);
  if(correctIndex<0) throw new Error(`DI-005 fully-visible lost answer for ${task}.`);
  return {questionId:`DI-005-FV:${seed}:Q${index+1}`,kind:task,difficulty,stem,options:opts,correctIndex,answer,explanation:{keyIdea:"Read the labelled pie sectors directly, then apply the required percentage, count, ratio or angle calculation.",steps}};
}

export function generateDi005FullyVisibleSet(input:{seed:string;examProfile?:Di005V2ExamProfile}):Di005FullyVisibleSet{
  const examProfile=input.examProfile??"SSC_CGL_TIER_I", optionCount:4|5=examProfile==="SSC_CGL_TIER_I"?4:5;
  const context=pick(CONTEXTS,`${input.seed}:context`), shares=shuffled(pick(SHARES,`${input.seed}:shares`),`${input.seed}:order`), totalValue=pick(context.totals,`${input.seed}:total`);
  const slices=context.categories.map((category,i)=>({category,percent:shares[i]!,displayPercent:shares[i]!,angleDegrees:shares[i]!*3.6}));
  const stimulus:Di005V2Stimulus={kind:"PIE",contextId:context.id,title:context.title,instruction:"Study the pie chart and answer the questions that follow.",totalValue,totalLabel:context.totalLabel,unit:context.unit,description:"Fully labelled pie chart with five visible sector percentages.",slices,hiddenPercentIndex:-1};
  const medium1=pick(MEDIUM,`${input.seed}:m1`); let medium2=pick(MEDIUM,`${input.seed}:m2`); if(medium2===medium1)medium2=MEDIUM[(MEDIUM.indexOf(medium1)+1)%MEDIUM.length]!;
  const hard1=pick(HARD,`${input.seed}:h1`); let hard2=pick(HARD,`${input.seed}:h2`); if(hard2===hard1)hard2=HARD[(HARD.indexOf(hard1)+1)%HARD.length]!;
  const tasks:[Di005FullyVisibleTaskKind,Di005V2Difficulty][]=[[pick(EASY,`${input.seed}:e`),"Easy"],[medium1,"Medium"],[medium2,"Medium"],[hard1,"Hard"],[hard2,"Hard"]];
  const questions=tasks.map(([task,difficulty],i)=>buildQuestion(task,difficulty,stimulus,`${input.seed}:${task}:${i}`,i,optionCount));
  return {packageId:"DI-005",mode:"FULLY_VISIBLE_PIE_V1",seed:input.seed,examProfile,stimulus,questions};
}

export const DI005_FULLY_VISIBLE_TASK_KINDS=Object.freeze([...EASY,...MEDIUM,...HARD]);
