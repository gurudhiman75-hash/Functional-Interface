import { hashSeed } from "../DI-001/exact";
import type { Di013Difficulty, Di013ExamProfile, Di013Question, Di013Set, Di013TaskKind } from "./types";

const VALUES=[20,40,60,80,100] as const;
const CONTEXTS=[
  {id:"PRODUCT_OUTPUT",title:"Output of five products in two years",cats:["Product P","Product Q","Product R","Product S","Product T"],a:"Year 1",b:"Year 2",unit:"units"},
  {id:"BRANCH_CASES",title:"Cases handled by five branches in two periods",cats:["Branch A","Branch B","Branch C","Branch D","Branch E"],a:"Period 1",b:"Period 2",unit:"cases"},
  {id:"DEPARTMENT_TARGETS",title:"Targets achieved by five departments",cats:["Sales","Operations","Support","Accounts","Service"],a:"Team A",b:"Team B",unit:"points"},
  {id:"COURSE_ENROLMENT",title:"Enrolment across five courses",cats:["Course A","Course B","Course C","Course D","Course E"],a:"Session 1",b:"Session 2",unit:"students"},
] as const;
const EASY:readonly Di013TaskKind[]=["DIRECT_SERIES_VALUE","HIGHEST_VALUE_FOR_SERIES"];
const MEDIUM:readonly Di013TaskKind[]=["SAME_CATEGORY_DIFFERENCE","SAME_CATEGORY_COMBINED_TOTAL","WITHIN_SERIES_RATIO","THREE_CATEGORY_SERIES_TOTAL"];
const HARD:readonly Di013TaskKind[]=["SERIES_TOTAL_DIFFERENCE","TWO_CATEGORY_GROUP_RATIO","TOTAL_SERIES_RATIO","FOUR_VALUE_CROSS_TOTAL"];

function pick<T>(a:readonly T[],seed:string):T{return a[hashSeed(seed)%a.length]!;}
function shuffle<T>(a:readonly T[],seed:string){return [...a].sort((x,y)=>hashSeed(`${seed}:${String(x)}`)-hashSeed(`${seed}:${String(y)}`));}
function gcd(a:number,b:number){let x=Math.abs(a),y=Math.abs(b);while(y){const t=x%y;x=y;y=t;}return x||1;}
function ratio(a:number,b:number){const g=gcd(a,b);return `${a/g}:${b/g}`;}
function numOptions(answer:number,seed:string){const v=new Set<number>([answer]);for(const d of [20,40,60,80,100,-20,-40,-60]){if(answer+d>=0)v.add(answer+d);if(v.size>=5)break;}return shuffle([...v].slice(0,5).map(String),seed);}
function ratioOptions(answer:string,a:number,b:number,seed:string){const v=new Set<string>([answer,ratio(b,a),ratio(a+20,b),ratio(a,b+20),ratio(a+40,b+20),ratio(a+20,b+40)]);const out=[...v].slice(0,5);for(let n=2;out.length<5;n++)out.push(`${n}:${n+1}`);return shuffle(out,seed);}
function build(seed:string){
  const c=pick(CONTEXTS,`${seed}:ctx`);
  const points=c.cats.map((category,i)=>({category,seriesA:pick(VALUES,`${seed}:a:${i}`),seriesB:pick(VALUES,`${seed}:b:${i}`)}));
  return {kind:"RADAR" as const,contextId:c.id,title:c.title,instruction:"Study the radar chart and answer the questions that follow.",seriesALabel:c.a,seriesBLabel:c.b,unit:c.unit,points,radialTicks:[0,20,40,60,80,100] as const};
}
function q(task:Di013TaskKind,difficulty:Di013Difficulty,stimulus:ReturnType<typeof build>,seed:string,index:number):Di013Question{
  const ids=shuffle([0,1,2,3,4],`${seed}:ids`),i=ids[0]!,j=ids[1]!,k=ids[2]!,l=ids[3]!,p=stimulus.points;
  let stem="",answer="",options:string[]=[],steps:string[]=[];
  if(task==="DIRECT_SERIES_VALUE"){const useA=hashSeed(seed)%2===0,v=useA?p[i]!.seriesA:p[i]!.seriesB,label=useA?stimulus.seriesALabel:stimulus.seriesBLabel;stem=`What value is shown for ${p[i]!.category} in ${label}?`;answer=String(v);options=numOptions(v,seed);steps=[`The plotted point for ${p[i]!.category} in ${label} lies on ${v}.`];}
  else if(task==="HIGHEST_CATEGORY_FOR_SERIES"){const useA=hashSeed(seed)%2===0,vals=p.map(x=>useA?x.seriesA:x.seriesB),max=Math.max(...vals),indices=vals.map((v,n)=>v===max?n:-1).filter(n=>n>=0);if(indices.length!==1)return q("DIRECT_SERIES_VALUE",difficulty,stimulus,seed,index);const best=indices[0]!,label=useA?stimulus.seriesALabel:stimulus.seriesBLabel;stem=`Which category has the highest value in ${label}?`;answer=p[best]!.category;options=shuffle(p.map(x=>x.category),seed);steps=[`The highest plotted value in ${label} is ${max}, at ${answer}.`];}
  else if(task==="SAME_CATEGORY_DIFFERENCE"){const v=Math.abs(p[i]!.seriesA-p[i]!.seriesB);stem=`What is the difference between the two series for ${p[i]!.category}?`;answer=String(v);options=numOptions(v,seed);steps=[`Difference = |${p[i]!.seriesA} − ${p[i]!.seriesB}| = ${v}.`];}
  else if(task==="SAME_CATEGORY_COMBINED_TOTAL"){const v=p[i]!.seriesA+p[i]!.seriesB;stem=`What is the combined value of both series for ${p[i]!.category}?`;answer=String(v);options=numOptions(v,seed);steps=[`${p[i]!.seriesA} + ${p[i]!.seriesB} = ${v}.`];}
  else if(task==="WITHIN_SERIES_RATIO"){const useA=hashSeed(seed)%2===0,a=useA?p[i]!.seriesA:p[i]!.seriesB,b=useA?p[j]!.seriesA:p[j]!.seriesB,label=useA?stimulus.seriesALabel:stimulus.seriesBLabel,v=ratio(a,b);stem=`What is the ratio of ${p[i]!.category} to ${p[j]!.category} in ${label}?`;answer=v;options=ratioOptions(v,a,b,seed);steps=[`${a}:${b} = ${v}.`];}
  else if(task==="THREE_CATEGORY_SERIES_TOTAL"){const useA=hashSeed(seed)%2===0,vals=[i,j,k].map(n=>useA?p[n]!.seriesA:p[n]!.seriesB),v=vals.reduce((a,b)=>a+b,0),label=useA?stimulus.seriesALabel:stimulus.seriesBLabel;stem=`Find the total for ${p[i]!.category}, ${p[j]!.category} and ${p[k]!.category} in ${label}.`;answer=String(v);options=numOptions(v,seed);steps=[`${vals.join(" + ")} = ${v}.`];}
  else if(task==="SERIES_TOTAL_DIFFERENCE"){const a=p.reduce((s,x)=>s+x.seriesA,0),b=p.reduce((s,x)=>s+x.seriesB,0),v=Math.abs(a-b);stem="What is the difference between the totals of the two series?";answer=String(v);options=numOptions(v,seed);steps=[`${stimulus.seriesALabel} total = ${a}.`,`${stimulus.seriesBLabel} total = ${b}.`,`Difference = ${v}.`];}
  else if(task==="TWO_CATEGORY_GROUP_RATIO"){const a=p[i]!.seriesA+p[j]!.seriesA,b=p[k]!.seriesB+p[l]!.seriesB,v=ratio(a,b);stem=`What is the ratio of the ${stimulus.seriesALabel} total for ${p[i]!.category} and ${p[j]!.category} to the ${stimulus.seriesBLabel} total for ${p[k]!.category} and ${p[l]!.category}?`;answer=v;options=ratioOptions(v,a,b,seed);steps=[`First group = ${a}.`,`Second group = ${b}.`,`Ratio = ${v}.`];}
  else if(task==="TOTAL_SERIES_RATIO"){const a=p.reduce((s,x)=>s+x.seriesA,0),b=p.reduce((s,x)=>s+x.seriesB,0),v=ratio(a,b);stem="What is the ratio of the total of the first series to the total of the second series?";answer=v;options=ratioOptions(v,a,b,seed);steps=[`Totals are ${a} and ${b}.`,`Ratio = ${v}.`];}
  else {const v=p[i]!.seriesA+p[j]!.seriesB+p[k]!.seriesA+p[l]!.seriesB;stem=`Find the total of ${stimulus.seriesALabel} ${p[i]!.category}, ${stimulus.seriesBLabel} ${p[j]!.category}, ${stimulus.seriesALabel} ${p[k]!.category}, and ${stimulus.seriesBLabel} ${p[l]!.category}.`;answer=String(v);options=numOptions(v,seed);steps=[`${p[i]!.seriesA} + ${p[j]!.seriesB} + ${p[k]!.seriesA} + ${p[l]!.seriesB} = ${v}.`];}
  const correctIndex=options.indexOf(answer);if(correctIndex<0)throw new Error(`DI-013 lost answer for ${task}.`);
  return {questionId:`DI-013:${seed}:Q${index+1}`,kind:task,difficulty,stem,options,correctIndex,answer,explanation:{keyIdea:"Read each radar point from the labelled radial grid, then perform the requested comparison.",steps}};
}
export function generateDi013RadarSet(input:{seed:string;examProfile?:Di013ExamProfile}):Di013Set{
  const stimulus=build(input.seed),examProfile=input.examProfile??"BANKING_MAINS";
  const m1=pick(MEDIUM,`${input.seed}:m1`);let m2=pick(MEDIUM,`${input.seed}:m2`);if(m1===m2)m2=MEDIUM[(MEDIUM.indexOf(m1)+1)%MEDIUM.length]!;
  const h1=pick(HARD,`${input.seed}:h1`);let h2=pick(HARD,`${input.seed}:h2`);if(h1===h2)h2=HARD[(HARD.indexOf(h1)+1)%HARD.length]!;
  const tasks:[Di013TaskKind,Di013Difficulty][]=[[pick(EASY,`${input.seed}:e`),"Easy"],[m1,"Medium"],[m2,"Medium"],[h1,"Hard"],[h2,"Hard"]];
  return {packageId:"DI-013",seed:input.seed,examProfile,stimulus,questions:tasks.map(([t,d],i)=>q(t,d,stimulus,`${input.seed}:${t}:${i}`,i))};
}
export const DI013_TASKS=Object.freeze([...EASY,...MEDIUM,...HARD]);
