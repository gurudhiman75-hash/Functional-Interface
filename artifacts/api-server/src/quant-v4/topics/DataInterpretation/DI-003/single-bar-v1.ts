import { hashSeed } from "../DI-001/exact";

export type Di003SingleExamProfile="SSC_CGL_TIER_I"|"BANKING_PRELIMS";
export type Di003SingleDifficulty="Easy"|"Medium"|"Hard";
export type Di003SingleTask=
  |"DIRECT_VALUE"|"HIGHEST_VALUE"|"LOWEST_VALUE"
  |"CATEGORY_DIFFERENCE"|"CATEGORY_RATIO"|"THREE_CATEGORY_TOTAL"|"THREE_CATEGORY_AVERAGE"
  |"SERIES_TOTAL"|"TWO_GROUP_RATIO"|"FOUR_CATEGORY_TOTAL"|"REMAINDER_AFTER_TWO";

export type Di003SingleStimulus=Readonly<{
  kind:"SINGLE_BAR";title:string;instruction:string;seriesLabel:string;unit:string;
  points:readonly Readonly<{category:string;value:number}>[];
}>;
export type Di003SingleQuestion=Readonly<{
  questionId:string;kind:Di003SingleTask;difficulty:Di003SingleDifficulty;stem:string;options:readonly string[];
  correctIndex:number;answer:string;explanation:Readonly<{keyIdea:string;steps:readonly string[]}>;
}>;
export type Di003SingleSet=Readonly<{
  packageId:"DI-003";mode:"SINGLE_SERIES_BAR_V1";seed:string;examProfile:Di003SingleExamProfile;
  stimulus:Di003SingleStimulus;questions:readonly Di003SingleQuestion[];
}>;

const CONTEXTS=[
  {title:"Applications received by five branches",series:"Applications",unit:"applications",labels:["Branch A","Branch B","Branch C","Branch D","Branch E"]},
  {title:"Students enrolled in five courses",series:"Students",unit:"students",labels:["Course A","Course B","Course C","Course D","Course E"]},
  {title:"Units produced by five plants",series:"Production",unit:"units",labels:["Plant A","Plant B","Plant C","Plant D","Plant E"]},
  {title:"Orders processed by five centres",series:"Orders",unit:"orders",labels:["Centre A","Centre B","Centre C","Centre D","Centre E"]},
] as const;
const EASY:readonly Di003SingleTask[]=["DIRECT_VALUE","HIGHEST_VALUE","LOWEST_VALUE"];
const MEDIUM:readonly Di003SingleTask[]=["CATEGORY_DIFFERENCE","CATEGORY_RATIO","THREE_CATEGORY_TOTAL","THREE_CATEGORY_AVERAGE"];
const HARD:readonly Di003SingleTask[]=["SERIES_TOTAL","TWO_GROUP_RATIO","FOUR_CATEGORY_TOTAL","REMAINDER_AFTER_TWO"];

function pick<T>(a:readonly T[],seed:string):T{return a[hashSeed(seed)%a.length]!;}
function shuffle<T>(a:readonly T[],seed:string){return [...a].sort((x,y)=>hashSeed(`${seed}:${String(x)}`)-hashSeed(`${seed}:${String(y)}`));}
function gcd(a:number,b:number){let x=Math.abs(a),y=Math.abs(b);while(y){const t=x%y;x=y;y=t;}return x||1;}
function ratio(a:number,b:number){const g=gcd(a,b);return `${a/g}:${b/g}`;}
function numOptions(answer:number,count:4|5,seed:string){const v=new Set<number>([answer]);for(let i=1;v.size<count&&i<=20;i++){const d=20*i;if(answer-d>=0)v.add(answer-d);v.add(answer+d);}if(v.size<count)throw new Error("DI-003 single bar option failure.");return shuffle([...v].slice(0,count).map(String),seed);}
function ratioOptions(answer:string,a:number,b:number,count:4|5,seed:string){const v=new Set<string>([answer,ratio(b,a),ratio(a+20,b),ratio(a,b+20),ratio(a+40,b+20),ratio(a+20,b+40)]);const out=[...v].slice(0,count);for(let n=2;out.length<count;n++){const c=`${n}:${n+1}`;if(!out.includes(c))out.push(c);}return shuffle(out,seed);}

function build(seed:string):Di003SingleStimulus{
  const c=pick(CONTEXTS,`${seed}:ctx`);
  const pool=shuffle([100,120,140,160,180,200,220,240,260,280],`${seed}:values`);
  const points=c.labels.map((category,i)=>({category,value:pool[i]!}));
  return {kind:"SINGLE_BAR",title:c.title,instruction:"Study the bar chart and answer the questions that follow.",seriesLabel:c.series,unit:c.unit,points};
}
function question(task:Di003SingleTask,difficulty:Di003SingleDifficulty,stimulus:Di003SingleStimulus,seed:string,index:number,count:4|5):Di003SingleQuestion{
  const p=stimulus.points,ids=shuffle([0,1,2,3,4],`${seed}:ids`),i=ids[0]!,j=ids[1]!,k=ids[2]!,l=ids[3]!;
  let stem="",answer="",options:string[]=[],steps:string[]=[];
  if(task==="DIRECT_VALUE"){const v=p[i]!.value;stem=`What is the value for ${p[i]!.category}?`;answer=String(v);options=numOptions(v,count,seed);steps=[`${p[i]!.category} is shown at ${v}.`];}
  else if(task==="HIGHEST_VALUE"||task==="LOWEST_VALUE"){const vals=p.map(x=>x.value),v=task==="HIGHEST_VALUE"?Math.max(...vals):Math.min(...vals);stem=task==="HIGHEST_VALUE"?"What is the highest value shown in the chart?":"What is the lowest value shown in the chart?";answer=String(v);options=numOptions(v,count,seed);steps=[`${task==="HIGHEST_VALUE"?"Highest":"Lowest"} value = ${v}.`];}
  else if(task==="CATEGORY_DIFFERENCE"){const v=Math.abs(p[i]!.value-p[j]!.value);stem=`What is the difference between ${p[i]!.category} and ${p[j]!.category}?`;answer=String(v);options=numOptions(v,count,seed);steps=[`Difference = |${p[i]!.value} − ${p[j]!.value}| = ${v}.`];}
  else if(task==="CATEGORY_RATIO"){const a=p[i]!.value,b=p[j]!.value,v=ratio(a,b);stem=`What is the ratio of ${p[i]!.category} to ${p[j]!.category}?`;answer=v;options=ratioOptions(v,a,b,count,seed);steps=[`${a}:${b} = ${v}.`];}
  else if(task==="THREE_CATEGORY_TOTAL"){const v=p[i]!.value+p[j]!.value+p[k]!.value;stem=`Find the total for ${p[i]!.category}, ${p[j]!.category} and ${p[k]!.category}.`;answer=String(v);options=numOptions(v,count,seed);steps=[`${p[i]!.value} + ${p[j]!.value} + ${p[k]!.value} = ${v}.`];}
  else if(task==="THREE_CATEGORY_AVERAGE"){
    const triples:[[number,number,number],number][]=[];
    for(let a=0;a<5;a++)for(let b=a+1;b<5;b++)for(let c=b+1;c<5;c++){const sum=p[a]!.value+p[b]!.value+p[c]!.value;if(sum%3===0)triples.push([[a,b,c],sum]);}
    if(!triples.length)return question("THREE_CATEGORY_TOTAL",difficulty,stimulus,seed,index,count);
    const [t,sum]=pick(triples,`${seed}:avg`),[a,b,c]=t,v=sum/3;stem=`What is the average value for ${p[a]!.category}, ${p[b]!.category} and ${p[c]!.category}?`;answer=String(v);options=numOptions(v,count,seed);steps=[`Sum = ${sum}.`,`Average = ${sum} ÷ 3 = ${v}.`];
  } else if(task==="SERIES_TOTAL"){const v=p.reduce((s,x)=>s+x.value,0);stem="What is the total of all five categories?";answer=String(v);options=numOptions(v,count,seed);steps=[`Total = ${p.map(x=>x.value).join(" + ")} = ${v}.`];}
  else if(task==="TWO_GROUP_RATIO"){const a=p[i]!.value+p[j]!.value,b=p[k]!.value+p[l]!.value,v=ratio(a,b);stem=`What is the ratio of the combined value for ${p[i]!.category} and ${p[j]!.category} to that for ${p[k]!.category} and ${p[l]!.category}?`;answer=v;options=ratioOptions(v,a,b,count,seed);steps=[`First group = ${a}.`,`Second group = ${b}.`,`Ratio = ${v}.`];}
  else if(task==="FOUR_CATEGORY_TOTAL"){const v=p[i]!.value+p[j]!.value+p[k]!.value+p[l]!.value;stem=`Find the total for ${p[i]!.category}, ${p[j]!.category}, ${p[k]!.category} and ${p[l]!.category}.`;answer=String(v);options=numOptions(v,count,seed);steps=[`Total = ${v}.`];}
  else {const total=p.reduce((s,x)=>s+x.value,0),excluded=p[i]!.value+p[j]!.value,v=total-excluded;stem=`What value remains after excluding ${p[i]!.category} and ${p[j]!.category} from the total?`;answer=String(v);options=numOptions(v,count,seed);steps=[`Total = ${total}.`,`Excluded = ${excluded}.`,`Remaining = ${v}.`];}
  const correctIndex=options.indexOf(answer);if(correctIndex<0)throw new Error(`DI-003 single bar lost answer for ${task}.`);
  return {questionId:`DI-003-SINGLE:${seed}:Q${index+1}`,kind:task,difficulty,stem,options,correctIndex,answer,explanation:{keyIdea:"Read the exact bar value(s), then perform the requested calculation.",steps}};
}
export function generateDi003SingleBarSet(input:{seed:string;examProfile?:Di003SingleExamProfile}):Di003SingleSet{
  const examProfile=input.examProfile??"SSC_CGL_TIER_I",count:4|5=examProfile==="SSC_CGL_TIER_I"?4:5,stimulus=build(input.seed);
  const m1=pick(MEDIUM,`${input.seed}:m1`);let m2=pick(MEDIUM,`${input.seed}:m2`);if(m1===m2)m2=MEDIUM[(MEDIUM.indexOf(m1)+1)%MEDIUM.length]!;
  const h1=pick(HARD,`${input.seed}:h1`);let h2=pick(HARD,`${input.seed}:h2`);if(h1===h2)h2=HARD[(HARD.indexOf(h1)+1)%HARD.length]!;
  const tasks:[Di003SingleTask,Di003SingleDifficulty][]=[[pick(EASY,`${input.seed}:e`),"Easy"],[m1,"Medium"],[m2,"Medium"],[h1,"Hard"],[h2,"Hard"]];
  return {packageId:"DI-003",mode:"SINGLE_SERIES_BAR_V1",seed:input.seed,examProfile,stimulus,questions:tasks.map(([t,d],i)=>question(t,d,stimulus,`${input.seed}:${t}:${i}`,i,count))};
}
export const DI003_SINGLE_TASKS=Object.freeze([...EASY,...MEDIUM,...HARD]);
