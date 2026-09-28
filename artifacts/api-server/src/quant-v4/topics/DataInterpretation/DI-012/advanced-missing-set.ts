import { hashSeed } from "../DI-001/exact";
import type { Di012Difficulty, Di012ExamProfile, Di012ModelKind, Di012Question, Di012Set, Di012Stimulus, Di012TaskKind } from "./types";

const MODELS: readonly Di012ModelKind[] = [
  "SINGLE_X_TOTAL","X_Y_SUM_DIFFERENCE","X_Y_RATIO_TOTAL","TWO_MISSING_COLUMN_TOTALS","MISSING_RATE","AVERAGE_CONSTRAINED","CHAINED_RECOVERY"
];

const CONTEXTS = [
  { title:"Bank branch applications", a:"Received", b:"Approved", labels:["A","B","C","D","E"] },
  { title:"Insurance policy records", a:"New policies", b:"Renewed policies", labels:["P","Q","R","S","T"] },
  { title:"Training batches", a:"Enrolled", b:"Completed", labels:["Batch A","Batch B","Batch C","Batch D","Batch E"] },
  { title:"Product orders", a:"Ordered", b:"Delivered", labels:["Item P","Item Q","Item R","Item S","Item T"] },
  { title:"Loan processing", a:"Applications", b:"Sanctioned", labels:["Zone A","Zone B","Zone C","Zone D","Zone E"] },
  { title:"Service requests", a:"Opened", b:"Resolved", labels:["Unit A","Unit B","Unit C","Unit D","Unit E"] },
] as const;

function pick<T>(a:readonly T[],seed:string){return a[hashSeed(seed)%a.length]!;}
function gcd(a:number,b:number){let x=Math.abs(a),y=Math.abs(b);while(y){const t=x%y;x=y;y=t;}return x||1;}
function ratio(a:number,b:number){const g=gcd(a,b);return `${a/g}:${b/g}`;}
function numOptions(answer:number,seed:string){
  const vals=new Set<number>([answer]);
  for(const d of [10,20,30,40,50,60,70,80]){if(answer-d>0)vals.add(answer-d);vals.add(answer+d);if(vals.size>=5)break;}
  while(vals.size<5)vals.add(answer+10*vals.size);
  return [...vals].slice(0,5).map(String).sort((a,b)=>hashSeed(`${seed}:${a}`)-hashSeed(`${seed}:${b}`));
}
function ratioOptions(answer:string,x:number,y:number,seed:string){
  const vals=new Set([answer,ratio(y,x),ratio(x+10,y),ratio(x,y+10),ratio(x+20,y+10),ratio(x+10,y+20)]);
  const arr=[...vals].slice(0,5); while(arr.length<5)arr.push(`${arr.length+2}:${arr.length+3}`);
  return arr.sort((a,b)=>hashSeed(`${seed}:${a}`)-hashSeed(`${seed}:${b}`));
}
function build(seed:string){
  const modelKind=pick(MODELS,`${seed}:model`);
  const ctx=pick(CONTEXTS,`${seed}:ctx`);
  const base=ctx.labels.map((label,i)=>({label,a:120+(hashSeed(`${seed}:a:${i}`)%10)*20,b:100+(hashSeed(`${seed}:b:${i}`)%10)*20}));
  let x=base[1]!.a, y=base[3]!.b, rows=base.map(r=>({...r})) as any[], condition="";
  if(modelKind==="SINGLE_X_TOTAL"){
    x=base[2]!.b; rows[2].b="x"; const total=base.reduce((s,r)=>s+r.b,0); condition=`The total of ${ctx.b} for all five rows is ${total}.`;
  } else if(modelKind==="X_Y_SUM_DIFFERENCE"){
    x=base[1]!.a; y=base[3]!.b; rows[1].a="x";rows[3].b="y"; condition=`x + y = ${x+y} and x − y = ${x-y}.`;
  } else if(modelKind==="X_Y_RATIO_TOTAL"){
    x=base[0]!.a; y=base[4]!.b; rows[0].a="x";rows[4].b="y"; condition=`x : y = ${ratio(x,y)} and x + y = ${x+y}.`;
  } else if(modelKind==="TWO_MISSING_COLUMN_TOTALS"){
    x=base[1]!.a;y=base[2]!.b;rows[1].a="x";rows[2].b="y";const ta=base.reduce((s,r)=>s+r.a,0),tb=base.reduce((s,r)=>s+r.b,0);condition=`The totals of ${ctx.a} and ${ctx.b} are ${ta} and ${tb}, respectively.`;
  } else if(modelKind==="MISSING_RATE"){
    x=base[2]!.a; rows[2].a="x"; const pct=Math.round(base[2]!.b*100/x); condition=`For ${base[2]!.label}, ${ctx.b} is ${pct}% of ${ctx.a}.`; 
    // normalize x so percentage relation is exact and simple
    const k=5+(hashSeed(`${seed}:rate`)%6); x=k*40; const b=x*75/100; rows[2].a="x"; rows[2].b=b; base[2]!.a=x; base[2]!.b=b; condition=`For ${base[2]!.label}, ${ctx.b} is 75% of ${ctx.a}.`;
  } else if(modelKind==="AVERAGE_CONSTRAINED"){
    x=base[3]!.a;rows[3].a="x";const avg=base.reduce((s,r)=>s+r.a,0)/5;condition=`The average ${ctx.a} across all five rows is ${avg}.`;
  } else {
    x=base[1]!.b;y=base[4]!.a;rows[1].b="x";rows[4].a="y";condition=`x is ${x-base[0]!.b} more than ${ctx.b} for ${base[0]!.label}. Also, y is twice x.`; y=2*x; rows[4].a="y"; base[4]!.a=y;
  }
  return {modelKind,ctx,base,rows,x,y,condition};
}

function solveQuestion(task:Di012TaskKind,difficulty:Di012Difficulty,state:ReturnType<typeof build>,seed:string,i:number):Di012Question{
  const {ctx,base,x,y}=state; const totalA=base.reduce((s,r)=>s+r.a,0), totalB=base.reduce((s,r)=>s+r.b,0);
  let stem="",answer="",options:string[]=[],steps:string[]=[];
  if(task==="RECOVER_X"){stem="What is the value of x?";answer=String(x);options=numOptions(x,seed);steps=[`Using the stated condition, x = ${x}.`];}
  else if(task==="RECOVER_Y"){stem="What is the value of y?";answer=String(y);options=numOptions(y,seed);steps=[`Using the stated condition after recovering the required unknowns, y = ${y}.`];}
  else if(task==="UNKNOWN_SUM"){const v=x+y;stem="What is x + y?";answer=String(v);options=numOptions(v,seed);steps=[`x + y = ${x} + ${y} = ${v}.`];}
  else if(task==="UNKNOWN_DIFFERENCE"){const v=Math.abs(x-y);stem="What is the absolute difference between x and y?";answer=String(v);options=numOptions(v,seed);steps=[`|${x} − ${y}| = ${v}.`];}
  else if(task==="UNKNOWN_RATIO"){const v=ratio(x,y);stem="What is the ratio x : y?";answer=v;options=ratioOptions(v,x,y,seed);steps=[`x : y = ${x}:${y} = ${v}.`];}
  else if(task==="RECOVERED_ROW_TOTAL"){const r=base[1]!;const v=r.a+r.b;stem=`After recovering the missing value(s), what is the combined total for ${r.label}?`;answer=String(v);options=numOptions(v,seed);steps=[`${r.a} + ${r.b} = ${v}.`];}
  else if(task==="RECOVERED_COLUMN_TOTAL"){stem=`After recovery, what is the total ${ctx.a} across all rows?`;answer=String(totalA);options=numOptions(totalA,seed);steps=[`Add the five ${ctx.a} values to get ${totalA}.`];}
  else if(task==="RECOVERED_SHARE_OF_TOTAL"){const r=base[0]!;const combined=totalA+totalB;const num=r.a+r.b;const v=Math.round(num*100/combined);stem=`Approximately what whole percent of the grand total is contributed by ${r.label}?`;answer=String(v);options=numOptions(v,seed);steps=[`${r.label} total = ${r.a} + ${r.b} = ${num}.`,`Grand total = ${combined}.`,`Share ≈ ${v}%.`];}
  else if(task==="CROSS_ROW_RATIO_AFTER_RECOVERY"){const p=base[1]!,q=base[3]!;const a=p.a+p.b,b=q.a+q.b,v=ratio(a,b);stem=`What is the ratio of the combined total for ${p.label} to that for ${q.label}?`;answer=v;options=ratioOptions(v,a,b,seed);steps=[`${p.label} total = ${a}.`,`${q.label} total = ${b}.`,`Ratio = ${v}.`];}
  else {const num=x+y,den=totalA+totalB,v=Math.round(num*100/den);stem="The recovered unknown values together are approximately what whole percent of the grand total?";answer=String(v);options=numOptions(v,seed);steps=[`x + y = ${num}.`,`Grand total = ${den}.`,`Required percentage ≈ ${v}%.`];}
  const correctIndex=options.indexOf(answer); if(correctIndex<0)throw new Error(`DI-012 lost answer for ${task}`);
  return {questionId:`DI-012:${seed}:Q${i+1}`,kind:task,difficulty,stem,options,correctIndex,answer,explanation:{keyIdea:"First recover the unknown table value(s) from the stated condition, then perform the requested DI calculation.",steps}};
}

export function generateDi012Set(input:{seed:string;examProfile?:Di012ExamProfile}):Di012Set{
  const examProfile=input.examProfile??"BANKING_MAINS"; const state=build(input.seed);
  const hasY=state.modelKind!=="SINGLE_X_TOTAL"&&state.modelKind!=="MISSING_RATE"&&state.modelKind!=="AVERAGE_CONSTRAINED";
  const easy:Di012TaskKind=hasY?pick(["RECOVER_X","RECOVER_Y"] as const,`${input.seed}:easy`):"RECOVER_X";
  const mediumPool:readonly Di012TaskKind[]=hasY?["UNKNOWN_SUM","UNKNOWN_DIFFERENCE","UNKNOWN_RATIO","RECOVERED_ROW_TOTAL","RECOVERED_COLUMN_TOTAL"]:["RECOVERED_ROW_TOTAL","RECOVERED_COLUMN_TOTAL"];
  const hardPool:readonly Di012TaskKind[]=hasY
    ? ["RECOVERED_SHARE_OF_TOTAL","CROSS_ROW_RATIO_AFTER_RECOVERY","COMBINED_RECOVERED_PERCENT"]
    : ["RECOVERED_SHARE_OF_TOTAL","CROSS_ROW_RATIO_AFTER_RECOVERY"];
  const tasks:[Di012TaskKind,Di012Difficulty][]=[[easy,"Easy"],[pick(mediumPool,`${input.seed}:m1`),"Medium"],[pick(mediumPool,`${input.seed}:m2`),"Medium"],[pick(hardPool,`${input.seed}:h1`),"Hard"],[pick(hardPool,`${input.seed}:h2`),"Hard"]];
  if(tasks[1]![0]===tasks[2]![0])tasks[2]=[mediumPool[(mediumPool.indexOf(tasks[1]![0])+1)%mediumPool.length]!,"Medium"];
  if(tasks[3]![0]===tasks[4]![0])tasks[4]=[hardPool[(hardPool.indexOf(tasks[3]![0])+1)%hardPool.length]!,"Hard"];
  const stimulus:Di012Stimulus={kind:"ADVANCED_MISSING_VARIABLE_TABLE",modelKind:state.modelKind,title:state.ctx.title,instruction:"Study the table and the additional condition, then answer the questions.",columnA:state.ctx.a,columnB:state.ctx.b,rows:state.rows,condition:state.condition};
  const questions=tasks.map(([t,d],i)=>solveQuestion(t,d,state,`${input.seed}:${t}:${i}`,i));
  return {packageId:"DI-012",setId:`DI-012:${input.seed}`,seed:input.seed,examProfile,stimulus,solution:{x:state.x,y:hasY?state.y:undefined},questions};
}
export const DI012_MODEL_KINDS=Object.freeze([...MODELS]);
