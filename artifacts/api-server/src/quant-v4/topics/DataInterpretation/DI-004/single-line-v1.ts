import { hashSeed, seededRandom, shuffle as randomShuffle } from "../DI-001/exact";

export type Di004SingleExamProfile="SSC_CGL_TIER_I"|"BANKING_PRELIMS";
export type Di004SingleDifficulty="Easy"|"Medium"|"Hard";
export type Di004SingleTask=
  |"DIRECT_PERIOD_VALUE"|"HIGHEST_PERIOD_VALUE"|"LOWEST_PERIOD_VALUE"
  |"TWO_PERIOD_DIFFERENCE"|"TWO_PERIOD_RATIO"|"THREE_PERIOD_TOTAL"|"THREE_PERIOD_AVERAGE"
  |"SERIES_TOTAL"|"FIRST_TO_LAST_DIFFERENCE"|"FOUR_PERIOD_TOTAL"|"TWO_PAIR_RATIO";

export type Di004SingleStimulus=Readonly<{kind:"SINGLE_LINE";title:string;instruction:string;seriesLabel:string;unit:string;points:readonly Readonly<{period:string;value:number}>[]}>;
export type Di004SingleQuestion=Readonly<{questionId:string;kind:Di004SingleTask;difficulty:Di004SingleDifficulty;stem:string;options:readonly string[];correctIndex:number;answer:string;explanation:Readonly<{keyIdea:string;steps:readonly string[]}>}>;
export type Di004SingleSet=Readonly<{packageId:"DI-004";mode:"SINGLE_SERIES_LINE_V1";seed:string;examProfile:Di004SingleExamProfile;stimulus:Di004SingleStimulus;questions:readonly Di004SingleQuestion[]}>;

const CONTEXTS=[
  {title:"Monthly applications received",series:"Applications",unit:"applications",periods:["Jan","Feb","Mar","Apr","May","Jun"]},
  {title:"Quarterly units sold",series:"Units sold",unit:"units",periods:["Q1","Q2","Q3","Q4","Q5","Q6"]},
  {title:"Six-period enrolment trend",series:"Students",unit:"students",periods:["P1","P2","P3","P4","P5","P6"]},
  {title:"Six-period order trend",series:"Orders",unit:"orders",periods:["P1","P2","P3","P4","P5","P6"]},
  {title:"Monthly production trend",series:"Production",unit:"units",periods:["Jan","Feb","Mar","Apr","May","Jun"]},
  {title:"Six-month passenger trend",series:"Passengers",unit:"passengers",periods:["Jan","Feb","Mar","Apr","May","Jun"]},
  {title:"Quarterly dispatch trend",series:"Dispatches",unit:"packages",periods:["Q1","Q2","Q3","Q4","Q5","Q6"]},
  {title:"Six-period claims trend",series:"Claims",unit:"claims",periods:["P1","P2","P3","P4","P5","P6"]},
] as const;
const EASY:readonly Di004SingleTask[]=["DIRECT_PERIOD_VALUE","HIGHEST_PERIOD_VALUE","LOWEST_PERIOD_VALUE"];
const MEDIUM:readonly Di004SingleTask[]=["TWO_PERIOD_DIFFERENCE","TWO_PERIOD_RATIO","THREE_PERIOD_TOTAL","THREE_PERIOD_AVERAGE"];
const HARD:readonly Di004SingleTask[]=["SERIES_TOTAL","FIRST_TO_LAST_DIFFERENCE","FOUR_PERIOD_TOTAL","TWO_PAIR_RATIO"];

function pick<T>(a:readonly T[],seed:string):T{return a[hashSeed(seed)%a.length]!;}
function shuffle<T>(a:readonly T[],seed:string){return [...a].sort((x,y)=>hashSeed(`${seed}:${String(x)}`)-hashSeed(`${seed}:${String(y)}`));}
function gcd(a:number,b:number){let x=Math.abs(a),y=Math.abs(b);while(y){const t=x%y;x=y;y=t;}return x||1;}
function ratio(a:number,b:number){const g=gcd(a,b);return `${a/g}:${b/g}`;}
function numOptions(answer:number,count:4|5,seed:string){const v=new Set<number>([answer]);for(let i=1;v.size<count&&i<=20;i++){const d=20*i;if(answer-d>=0)v.add(answer-d);v.add(answer+d);}if(v.size<count)throw new Error("DI-004 single line option failure.");return shuffle([...v].slice(0,count).map(String),seed);}
function ratioOptions(answer:string,a:number,b:number,count:4|5,seed:string){const v=new Set<string>([answer,ratio(b,a),ratio(a+20,b),ratio(a,b+20),ratio(a+40,b+20),ratio(a+20,b+40)]);const out=[...v].slice(0,count);for(let n=2;out.length<count;n++){const c=`${n}:${n+1}`;if(!out.includes(c))out.push(c);}return shuffle(out,seed);}
function build(seed:string):Di004SingleStimulus{
  const random=seededRandom(`${seed}:single-line-state-v2`);
  const c=CONTEXTS[Math.floor(random()*CONTEXTS.length)]!;
  const pool=randomShuffle(random,[100,120,140,160,180,200,220,240,260,280,300,320]);
  return {kind:"SINGLE_LINE",title:c.title,instruction:"Study the line graph and answer the questions that follow.",seriesLabel:c.series,unit:c.unit,points:c.periods.map((period,i)=>({period,value:pool[i]!}))};
}
function frame(seed:string,variants:readonly string[]){return variants[hashSeed(`${seed}:frame`)%variants.length]!;}
function question(task:Di004SingleTask,difficulty:Di004SingleDifficulty,stimulus:Di004SingleStimulus,seed:string,index:number,count:4|5):Di004SingleQuestion{
  const p=stimulus.points,ids=shuffle([0,1,2,3,4,5],`${seed}:ids`),i=ids[0]!,j=ids[1]!,k=ids[2]!,l=ids[3]!;
  let stem="",answer="",options:string[]=[],steps:string[]=[];
  if(task==="DIRECT_PERIOD_VALUE"){const v=p[i]!.value;stem=frame(seed,[`What value is shown for ${p[i]!.period}?`,`How many ${stimulus.unit} are shown in ${p[i]!.period}?`,`Read the plotted value for ${p[i]!.period}.`]);answer=String(v);options=numOptions(v,count,seed);steps=[`${p[i]!.period} is plotted at ${v}.`];}
  else if(task==="HIGHEST_PERIOD_VALUE"||task==="LOWEST_PERIOD_VALUE"){const vals=p.map(x=>x.value),v=task==="HIGHEST_PERIOD_VALUE"?Math.max(...vals):Math.min(...vals);stem=task==="HIGHEST_PERIOD_VALUE"
      ? frame(seed,["What is the highest value on the line graph?","What is the maximum value recorded over the six periods?","Find the peak value shown on the graph."])
      : frame(seed,["What is the lowest value on the line graph?","What is the minimum value recorded over the six periods?","Find the smallest plotted value."]);answer=String(v);options=numOptions(v,count,seed);steps=[`${task==="HIGHEST_PERIOD_VALUE"?"Highest":"Lowest"} value = ${v}.`];}
  else if(task==="TWO_PERIOD_DIFFERENCE"){const v=Math.abs(p[i]!.value-p[j]!.value);stem=frame(seed,[`What is the difference between ${p[i]!.period} and ${p[j]!.period}?`,`By how much do the values for ${p[i]!.period} and ${p[j]!.period} differ?`,`Find the absolute difference between ${p[i]!.period} and ${p[j]!.period}.`]);answer=String(v);options=numOptions(v,count,seed);steps=[`Difference = |${p[i]!.value} − ${p[j]!.value}| = ${v}.`];}
  else if(task==="TWO_PERIOD_RATIO"){const a=p[i]!.value,b=p[j]!.value,v=ratio(a,b);stem=frame(seed,[`What is the ratio of ${p[i]!.period} to ${p[j]!.period}?`,`Express the value in ${p[i]!.period} as a ratio to that in ${p[j]!.period}.`,`Find the ratio ${p[i]!.period} : ${p[j]!.period}.`]);answer=v;options=ratioOptions(v,a,b,count,seed);steps=[`${a}:${b} = ${v}.`];}
  else if(task==="THREE_PERIOD_TOTAL"){const v=p[i]!.value+p[j]!.value+p[k]!.value;stem=frame(seed,[`Find the total for ${p[i]!.period}, ${p[j]!.period} and ${p[k]!.period}.`,`What is the combined value for ${p[i]!.period}, ${p[j]!.period} and ${p[k]!.period}?`,`Add the values for ${p[i]!.period}, ${p[j]!.period} and ${p[k]!.period}.`]);answer=String(v);options=numOptions(v,count,seed);steps=[`${p[i]!.value} + ${p[j]!.value} + ${p[k]!.value} = ${v}.`];}
  else if(task==="THREE_PERIOD_AVERAGE"){
    const triples:[[number,number,number],number][]=[];for(let a=0;a<6;a++)for(let b=a+1;b<6;b++)for(let c=b+1;c<6;c++){const sum=p[a]!.value+p[b]!.value+p[c]!.value;if(sum%3===0)triples.push([[a,b,c],sum]);}
    if(!triples.length)return question("THREE_PERIOD_TOTAL",difficulty,stimulus,seed,index,count);
    const [t,sum]=pick(triples,`${seed}:avg`),[a,b,c]=t,v=sum/3;stem=frame(seed,[`What is the average for ${p[a]!.period}, ${p[b]!.period} and ${p[c]!.period}?`,`Find the mean of the values for ${p[a]!.period}, ${p[b]!.period} and ${p[c]!.period}.`,`What is the average plotted value across ${p[a]!.period}, ${p[b]!.period} and ${p[c]!.period}?`]);answer=String(v);options=numOptions(v,count,seed);steps=[`Sum = ${sum}.`,`Average = ${sum} ÷ 3 = ${v}.`];
  } else if(task==="SERIES_TOTAL"){const v=p.reduce((s,x)=>s+x.value,0);stem=frame(seed,["What is the total across all six periods?","Find the sum of the values over all six periods.","What is the six-period aggregate shown by the line graph?"]);answer=String(v);options=numOptions(v,count,seed);steps=[`Total = ${p.map(x=>x.value).join(" + ")} = ${v}.`];}
  else if(task==="FIRST_TO_LAST_DIFFERENCE"){const v=Math.abs(p[0]!.value-p[5]!.value);stem=frame(seed,[`What is the difference between ${p[0]!.period} and ${p[5]!.period}?`,`By how much does the first-period value differ from the last-period value?`,`Find the absolute change between ${p[0]!.period} and ${p[5]!.period}.`]);answer=String(v);options=numOptions(v,count,seed);steps=[`Difference = |${p[0]!.value} − ${p[5]!.value}| = ${v}.`];}
  else if(task==="FOUR_PERIOD_TOTAL"){const v=p[i]!.value+p[j]!.value+p[k]!.value+p[l]!.value;stem=frame(seed,[`Find the total for ${p[i]!.period}, ${p[j]!.period}, ${p[k]!.period} and ${p[l]!.period}.`,`What is the combined value of ${p[i]!.period}, ${p[j]!.period}, ${p[k]!.period} and ${p[l]!.period}?`,`Add the plotted values for ${p[i]!.period}, ${p[j]!.period}, ${p[k]!.period} and ${p[l]!.period}.`]);answer=String(v);options=numOptions(v,count,seed);steps=[`Total = ${v}.`];}
  else {const a=p[i]!.value+p[j]!.value,b=p[k]!.value+p[l]!.value,v=ratio(a,b);stem=frame(seed,[`What is the ratio of the combined value for ${p[i]!.period} and ${p[j]!.period} to that for ${p[k]!.period} and ${p[l]!.period}?`,`Compare (${p[i]!.period} + ${p[j]!.period}) with (${p[k]!.period} + ${p[l]!.period}) as a ratio.`,`Find the ratio of the first pair's total to the second pair's total.`]);answer=v;options=ratioOptions(v,a,b,count,seed);steps=[`First pair = ${a}.`,`Second pair = ${b}.`,`Ratio = ${v}.`];}
  const correctIndex=options.indexOf(answer);if(correctIndex<0)throw new Error(`DI-004 single line lost answer for ${task}.`);
  return {questionId:`DI-004-SINGLE:${seed}:Q${index+1}`,kind:task,difficulty,stem,options,correctIndex,answer,explanation:{keyIdea:"Read the exact plotted value(s), then perform the requested calculation.",steps}};
}
export function generateDi004SingleLineSet(input:{seed:string;examProfile?:Di004SingleExamProfile}):Di004SingleSet{
  const examProfile=input.examProfile??"SSC_CGL_TIER_I",count:4|5=examProfile==="SSC_CGL_TIER_I"?4:5,stimulus=build(input.seed);
  const m1=pick(MEDIUM,`${input.seed}:m1`);let m2=pick(MEDIUM,`${input.seed}:m2`);if(m1===m2)m2=MEDIUM[(MEDIUM.indexOf(m1)+1)%MEDIUM.length]!;
  const h1=pick(HARD,`${input.seed}:h1`);let h2=pick(HARD,`${input.seed}:h2`);if(h1===h2)h2=HARD[(HARD.indexOf(h1)+1)%HARD.length]!;
  const tasks:[Di004SingleTask,Di004SingleDifficulty][]=[[pick(EASY,`${input.seed}:e`),"Easy"],[m1,"Medium"],[m2,"Medium"],[h1,"Hard"],[h2,"Hard"]];
  return {packageId:"DI-004",mode:"SINGLE_SERIES_LINE_V1",seed:input.seed,examProfile,stimulus,questions:tasks.map(([t,d],i)=>question(t,d,stimulus,`${input.seed}:${t}:${i}`,i,count))};
}
export const DI004_SINGLE_TASKS=Object.freeze([...EASY,...MEDIUM,...HARD]);
