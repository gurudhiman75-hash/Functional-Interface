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
function percentOptions(answer:number,seed:string){
  const vals=new Set<number>([answer]);
  for(const d of [5,-5,10,-10,15,-15,20,-20]){const v=answer+d;if(v>0)vals.add(v);if(vals.size>=5)break;}
  return [...vals].slice(0,5).map(v=>`${v}%`).sort((a,b)=>hashSeed(`${seed}:${a}`)-hashSeed(`${seed}:${b}`));
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
    x=base[1]!.a; y=base[3]!.b; rows[1].a="x"; rows[3].b="y";
    condition = x >= y
      ? `x + y = ${x+y}, and x is ${x-y} more than y.`
      : `x + y = ${x+y}, and x is ${y-x} less than y.`;
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
    const delta=20*(1+(hashSeed(`${seed}:chain-delta`)%4));
    x=base[0]!.b+delta;
    y=2*x;
    base[1]!.b=x;
    base[4]!.a=y;
    rows[1].b="x";
    rows[4].a="y";
    condition=`x is ${delta} more than ${ctx.b} for ${base[0]!.label}. Also, y is twice x.`;
  }
  const unknownCells = rows.flatMap((row, rowIndex) => ([
    row.a === "x" ? { variable: "x" as const, rowIndex, column: "a" as const } : undefined,
    row.b === "x" ? { variable: "x" as const, rowIndex, column: "b" as const } : undefined,
    row.a === "y" ? { variable: "y" as const, rowIndex, column: "a" as const } : undefined,
    row.b === "y" ? { variable: "y" as const, rowIndex, column: "b" as const } : undefined,
  ].filter(Boolean))) as readonly { variable: "x" | "y"; rowIndex: number; column: "a" | "b" }[];
  return {modelKind,ctx,base,rows,x,y,condition,unknownCells};
}

function recoverySteps(state:ReturnType<typeof build>,variable:"x"|"y"):string[]{
  const {modelKind,ctx,base,x,y,unknownCells}=state;
  const cell=unknownCells.find(c=>c.variable===variable);
  const target=variable==="x"?x:y;
  if(!cell)return [`${variable} = ${target}.`];
  const label=base[cell.rowIndex]!.label;
  const column=cell.column==="a"?ctx.a:ctx.b;
  if(modelKind==="SINGLE_X_TOTAL"){
    const total=base.reduce((s,r)=>s+r.b,0),visible=total-x;
    return [`Total ${ctx.b} = ${total}; visible ${ctx.b} = ${visible}.`,`${variable} = ${total} − ${visible} = ${target}.`];
  }
  if(modelKind==="X_Y_SUM_DIFFERENCE"){
    const sum=x+y,diff=Math.abs(x-y);
    return x>=y
      ? [`x + y = ${sum} and x − y = ${diff}.`,`2x = ${sum+diff}, so x = ${x}; therefore y = ${sum} − ${x} = ${y}.`]
      : [`x + y = ${sum} and y − x = ${diff}.`,`2y = ${sum+diff}, so y = ${y}; therefore x = ${sum} − ${y} = ${x}.`];
  }
  if(modelKind==="X_Y_RATIO_TOTAL"){
    const g=gcd(x,y),a=x/g,b=y/g,sum=x+y,part=sum/(a+b);
    return [`x : y = ${a}:${b} and x + y = ${sum}.`,`One ratio part = ${sum} ÷ ${a+b} = ${part}; hence x = ${a} × ${part} = ${x} and y = ${b} × ${part} = ${y}.`];
  }
  if(modelKind==="TWO_MISSING_COLUMN_TOTALS"){
    const total=cell.column==="a"?base.reduce((s,r)=>s+r.a,0):base.reduce((s,r)=>s+r.b,0);
    const visible=total-target;
    return [`Total ${column} = ${total}; visible ${column} = ${visible}.`,`${variable} = ${total} − ${visible} = ${target}.`];
  }
  if(modelKind==="MISSING_RATE"){
    const approved=base[cell.rowIndex]!.b;
    return [`For ${label}, ${ctx.b} = 75% of ${ctx.a}.`,`${variable} = ${approved} × 100 ÷ 75 = ${target}.`];
  }
  if(modelKind==="AVERAGE_CONSTRAINED"){
    const total=base.reduce((s,r)=>s+r.a,0),avg=total/5,visible=total-x;
    return [`Required ${ctx.a} total = ${avg} × 5 = ${total}.`,`x = ${total} − ${visible} = ${x}.`];
  }
  const delta=x-base[0]!.b;
  return [`x = ${ctx.b} for ${base[0]!.label} + ${delta} = ${base[0]!.b} + ${delta} = ${x}.`,`y = 2 × x = 2 × ${x} = ${y}.`];
}
function solveQuestion(task:Di012TaskKind,difficulty:Di012Difficulty,state:ReturnType<typeof build>,seed:string,i:number):Di012Question{
  const {ctx,base,x,y,unknownCells}=state;
  const totalA=base.reduce((s,r)=>s+r.a,0), totalB=base.reduce((s,r)=>s+r.b,0);
  const primaryUnknown = unknownCells[0]!;
  const secondaryUnknown = unknownCells[1];
  const primaryRow = base[primaryUnknown.rowIndex]!;
  const secondaryRow = secondaryUnknown ? base[secondaryUnknown.rowIndex]! : base[(primaryUnknown.rowIndex + 2) % base.length]!;
  let stem="",answer="",options:string[]=[],steps:string[]=[];
  if(task==="RECOVER_X"){const cell=unknownCells.find(c=>c.variable==="x")!;const row=base[cell.rowIndex]!;const column=cell.column==="a"?ctx.a:ctx.b;stem=`What number should replace x under ${column} for ${row.label}?`;answer=String(x);options=numOptions(x,seed);steps=recoverySteps(state,"x");}
  else if(task==="RECOVER_Y"){const cell=unknownCells.find(c=>c.variable==="y")!;const row=base[cell.rowIndex]!;const column=cell.column==="a"?ctx.a:ctx.b;stem=`What number should replace y under ${column} for ${row.label}?`;answer=String(y);options=numOptions(y,seed);steps=recoverySteps(state,"y");}
  else if(task==="UNKNOWN_SUM"){const v=x+y;stem="What is x + y?";answer=String(v);options=numOptions(v,seed);steps=[`x + y = ${x} + ${y} = ${v}.`];}
  else if(task==="UNKNOWN_DIFFERENCE"){const v=Math.abs(x-y);stem="What is the absolute difference between x and y?";answer=String(v);options=numOptions(v,seed);steps=[`|${x} − ${y}| = ${v}.`];}
  else if(task==="UNKNOWN_RATIO"){const v=ratio(x,y);stem="What is the ratio x : y?";answer=v;options=ratioOptions(v,x,y,seed);steps=[`x : y = ${x}:${y} = ${v}.`];}
  else if(task==="RECOVERED_ROW_TOTAL"){const r=primaryRow;const v=r.a+r.b;stem=`What is the combined total of ${ctx.a} and ${ctx.b} for ${r.label}?`;answer=String(v);options=numOptions(v,seed);steps=[`Recover the unknown in ${r.label} first.`,`${r.a} + ${r.b} = ${v}.`];}
  else if(task==="RECOVERED_COLUMN_TOTAL"){const targetColumn=primaryUnknown.column;const label=targetColumn==="a"?ctx.a:ctx.b;const total=targetColumn==="a"?totalA:totalB;stem=`What is the total ${label} across all five rows?`;answer=String(total);options=numOptions(total,seed);steps=[`Recover the missing value in the ${label} column first.`,`Add the five ${label} values to get ${total}.`];}
  else if(task==="RECOVERED_SHARE_OF_TOTAL"){const r=primaryRow;const combined=totalA+totalB;const num=r.a+r.b;const v=Math.round(num*100/combined);stem=`Approximately what percentage of the combined ${ctx.a} and ${ctx.b} total is accounted for by ${r.label}?`;answer=`${v}%`;options=percentOptions(v,seed);steps=[...recoverySteps(state,primaryUnknown.variable),`${r.label} total = ${r.a} + ${r.b} = ${num}.`,`Grand total = ${combined}.`,`Share = ${num} ÷ ${combined} × 100 ≈ ${v}%.`];}
  else if(task==="CROSS_ROW_RATIO_AFTER_RECOVERY"){const p=primaryRow,q=secondaryRow;const a=p.a+p.b,b=q.a+q.b,v=ratio(a,b);stem=`What is the ratio of the combined total for ${p.label} to that for ${q.label}?`;answer=v;options=ratioOptions(v,a,b,seed);steps=[`${p.label} total = ${a}.`,`${q.label} total = ${b}.`,`Ratio = ${v}.`];}
  else {const num=x+y,den=totalA+totalB,v=Math.round(num*100/den);stem=`Together, approximately what percentage of the combined ${ctx.a} and ${ctx.b} total do x and y represent?`;answer=`${v}%`;options=percentOptions(v,seed);steps=[...recoverySteps(state,"x"),...(unknownCells.some(c=>c.variable==="y")?recoverySteps(state,"y"):[]),`x + y = ${num}.`,`Grand total = ${den}.`,`Required percentage = ${num} ÷ ${den} × 100 ≈ ${v}%.`];}
  const correctIndex=options.indexOf(answer); if(correctIndex<0)throw new Error(`DI-012 lost answer for ${task}`);
  return {questionId:`DI-012:${seed}:Q${i+1}`,kind:task,difficulty,stem,options,correctIndex,answer,explanation:{keyIdea:`Use the table condition to recover the unknown ${ctx.a}/${ctx.b} entry or entries, then carry out the requested calculation.`,steps}};
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
