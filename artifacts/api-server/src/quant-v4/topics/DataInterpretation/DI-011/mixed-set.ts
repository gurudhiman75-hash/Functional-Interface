import { hashSeed } from "../DI-001/exact";
import type { Di011Difficulty, Di011ExamProfile, Di011PairKind, Di011Question, Di011QuestionSet, Di011Stimulus, Di011TaskKind } from "./types";

const PAIRS: readonly Di011PairKind[] = ["BAR_TABLE", "LINE_TABLE", "PIE_TABLE", "BAR_LINE", "TWO_TABLE_JOIN"];
const EASY: readonly Di011TaskKind[] = ["SAME_CATEGORY_COMBINED_TOTAL", "SAME_CATEGORY_ABSOLUTE_DIFFERENCE"];
const MEDIUM: readonly Di011TaskKind[] = ["LEFT_TO_RIGHT_RATIO", "TWO_CATEGORY_CROSS_SUM", "HIGHEST_COMBINED_CATEGORY", "CROSS_COMPONENT_AVERAGE"];
const HARD: readonly Di011TaskKind[] = ["TWO_GROUP_CROSS_RATIO", "TWO_GROUP_COMBINED_DIFFERENCE", "THREE_CATEGORY_CROSS_TOTAL", "FOUR_VALUE_CROSS_AVERAGE"];

const CONTEXTS = [
  { title: "Regional loan applications and approvals", left: "Applications", right: "Approvals", unit: "cases", labels: ["North", "South", "East", "West", "Central"] },
  { title: "Product dispatch and returns", left: "Dispatched", right: "Returned", unit: "units", labels: ["P", "Q", "R", "S", "T"] },
  { title: "Insurance policies and claims", left: "Policies", right: "Claims", unit: "records", labels: ["A", "B", "C", "D", "E"] },
  { title: "Branch deposits and withdrawals", left: "Deposits", right: "Withdrawals", unit: "₹ lakh", labels: ["B1", "B2", "B3", "B4", "B5"] },
  { title: "Training enrolment and completion", left: "Enrolled", right: "Completed", unit: "people", labels: ["Batch A", "Batch B", "Batch C", "Batch D", "Batch E"] },
  { title: "Online orders and successful deliveries", left: "Orders", right: "Delivered", unit: "orders", labels: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
] as const;

const PIE_PARTITIONS = [
  [10, 15, 20, 25, 30],
  [5, 15, 20, 25, 35],
  [10, 10, 20, 25, 35],
  [5, 20, 20, 25, 30],
] as const;

function pick<T>(items: readonly T[], seed: string): T {
  return items[hashSeed(seed) % items.length]!;
}
function gcd(a: number, b: number): number { let x=Math.abs(a), y=Math.abs(b); while(y){ const t=x%y; x=y; y=t; } return x || 1; }
function ratio(a: number, b: number) { const g=gcd(a,b); return `${a/g}:${b/g}`; }
function numericalOptions(answer: number, seed: string) {
  const offsets = [10,20,30,40,50,60].map((x,i)=>x + (hashSeed(`${seed}:${i}`) % 3)*10);
  const values = new Set<number>([answer]);
  for (const d of offsets) { if (answer-d > 0) values.add(answer-d); values.add(answer+d); if(values.size>=5) break; }
  for (let step = 1; values.size < 5 && step <= 20; step += 1) {
    values.add(answer + 10 * step);
  }
  if (values.size < 5) throw new Error(`DI-011 could not construct five unique numerical options for ${answer}.`);
  const arr=[...values].slice(0,5).map(String);
  return arr.sort((a,b)=>(hashSeed(`${seed}:${a}`)-hashSeed(`${seed}:${b}`)));
}
function ratioOptions(answer: string, a: number, b: number, seed: string) {
  const values = new Set<string>([answer, ratio(b,a), ratio(a+10,b), ratio(a,b+10), ratio(a+20,b+10), ratio(a+10,b+20)]);
  const arr=[...values].slice(0,5);
  while(arr.length<5) arr.push(`${arr.length+1}:${arr.length+2}`);
  return arr.sort((x,y)=>hashSeed(`${seed}:${x}`)-hashSeed(`${seed}:${y}`));
}
function categoryOptions(categories: readonly string[], answer: string, seed: string) {
  const arr=[...categories];
  return arr.sort((a,b)=>hashSeed(`${seed}:${a}`)-hashSeed(`${seed}:${b}`));
}
function makeQuestion(task: Di011TaskKind, difficulty: Di011Difficulty, stimulus: Di011Stimulus, seed: string, index: number): Di011Question {
  const rows=stimulus.rows;
  const a=rows[hashSeed(`${seed}:a`) % rows.length]!;
  let b=rows[hashSeed(`${seed}:b`) % rows.length]!;
  if (b.category===a.category) b=rows[(rows.indexOf(a)+1)%rows.length]!;
  const c=rows[(rows.indexOf(b)+1)%rows.length]!;
  const d=rows[(rows.indexOf(c)+1)%rows.length]!;
  let stem="", answer="", options:string[]=[], steps:string[]=[];
  if(task==="SAME_CATEGORY_COMBINED_TOTAL"){
    const v=a.left+a.right; stem=`What is the combined value for ${a.category} from the two displays?`; answer=String(v); options=numericalOptions(v,seed); steps=[`${a.left} + ${a.right} = ${v}.`];
  } else if(task==="SAME_CATEGORY_ABSOLUTE_DIFFERENCE"){
    const v=Math.abs(a.left-a.right); stem=`What is the difference between the two displayed values for ${a.category}?`; answer=String(v); options=numericalOptions(v,seed); steps=[`Difference = |${a.left} − ${a.right}| = ${v}.`];
  } else if(task==="LEFT_TO_RIGHT_RATIO"){
    const v=ratio(a.left,a.right); stem=`What is the ratio of ${stimulus.leftTitle} to ${stimulus.rightTitle} for ${a.category}?`; answer=v; options=ratioOptions(v,a.left,a.right,seed); steps=[`Required ratio = ${a.left}:${a.right} = ${v}.`];
  } else if(task==="TWO_CATEGORY_CROSS_SUM"){
    const v=a.left+b.right; stem=`Find ${stimulus.leftTitle} for ${a.category} plus ${stimulus.rightTitle} for ${b.category}.`; answer=String(v); options=numericalOptions(v,seed); steps=[`${a.left} + ${b.right} = ${v}.`];
  } else if(task==="HIGHEST_COMBINED_CATEGORY"){
    const best=[...rows].sort((x,y)=>(y.left+y.right)-(x.left+x.right))[0]!; stem="For which category is the sum of the two displayed values the highest?"; answer=best.category; options=categoryOptions(rows.map(r=>r.category),answer,seed); steps=rows.map(r=>`${r.category}: ${r.left} + ${r.right} = ${r.left+r.right}`).concat([`The highest combined value is for ${answer}.`]);
  } else if(task==="CROSS_COMPONENT_AVERAGE"){
    const v=(a.left+b.right)/2; stem=`What is the average of ${stimulus.leftTitle} for ${a.category} and ${stimulus.rightTitle} for ${b.category}?`; answer=String(v); options=numericalOptions(v,seed); steps=[`Average = (${a.left} + ${b.right}) ÷ 2 = ${v}.`];
  } else if(task==="TWO_GROUP_CROSS_RATIO"){
    const x=a.left+b.left, y=c.right+d.right, v=ratio(x,y); stem=`What is the ratio of total ${stimulus.leftTitle} for ${a.category} and ${b.category} to total ${stimulus.rightTitle} for ${c.category} and ${d.category}?`; answer=v; options=ratioOptions(v,x,y,seed); steps=[`Left-group total = ${a.left} + ${b.left} = ${x}.`,`Right-group total = ${c.right} + ${d.right} = ${y}.`,`Ratio = ${x}:${y} = ${v}.`];
  } else if(task==="TWO_GROUP_COMBINED_DIFFERENCE"){
    const x=a.left+b.right, y=c.left+d.right, v=Math.abs(x-y); stem=`Find the difference between (${stimulus.leftTitle} of ${a.category} + ${stimulus.rightTitle} of ${b.category}) and (${stimulus.leftTitle} of ${c.category} + ${stimulus.rightTitle} of ${d.category}).`; answer=String(v); options=numericalOptions(v,seed); steps=[`First total = ${a.left} + ${b.right} = ${x}.`,`Second total = ${c.left} + ${d.right} = ${y}.`,`Difference = |${x} − ${y}| = ${v}.`];
  } else if(task==="THREE_CATEGORY_CROSS_TOTAL"){
    const v=a.left+b.right+c.left; stem=`Find the total of ${stimulus.leftTitle} for ${a.category}, ${stimulus.rightTitle} for ${b.category}, and ${stimulus.leftTitle} for ${c.category}.`; answer=String(v); options=numericalOptions(v,seed); steps=[`${a.left} + ${b.right} + ${c.left} = ${v}.`];
  } else {
    const v=(a.left+b.right+c.left+d.right)/4; stem=`Find the average of the four values: ${stimulus.leftTitle} for ${a.category}, ${stimulus.rightTitle} for ${b.category}, ${stimulus.leftTitle} for ${c.category}, and ${stimulus.rightTitle} for ${d.category}.`; answer=String(v); options=numericalOptions(v,seed); steps=[`Sum = ${a.left} + ${b.right} + ${c.left} + ${d.right} = ${a.left+b.right+c.left+d.right}.`,`Average = ${a.left+b.right+c.left+d.right} ÷ 4 = ${v}.`];
  }
  const correctIndex=options.indexOf(answer);
  if(correctIndex<0) throw new Error(`DI-011 option construction lost answer for ${task}.`);
  return { questionId:`DI-011:${seed}:Q${index+1}`, kind:task, difficulty, stem, options, correctIndex, answer, explanation:{keyIdea:"Read the required values from both parts of the mixed stimulus, then combine only those values.",steps} };
}
function buildStimulus(seed:string): Di011Stimulus {
  const pairKind=pick(PAIRS,`${seed}:pair`);
  const ctx=pick(CONTEXTS,`${seed}:ctx`);
  const rows=ctx.labels.map((category,i)=>{
    if(pairKind==="PIE_TABLE"){
      const part=pick(PIE_PARTITIONS,`${seed}:pie`);
      return {category,left:part[i]!,right:100 + (hashSeed(`${seed}:r:${i}`)%16)*20};
    }
    const left=100 + (hashSeed(`${seed}:l:${i}`)%16)*20;
    const right=80 + (hashSeed(`${seed}:r:${i}`)%16)*20;
    return {category,left,right};
  });
  return {kind:"MIXED_MULTI_CHART",pairKind,title:ctx.title,instruction:"Study both displays and answer the questions that follow.",leftTitle:pairKind==="PIE_TABLE"?"Share":ctx.left,rightTitle:ctx.right,leftUnit:pairKind==="PIE_TABLE"?"%":ctx.unit,rightUnit:ctx.unit,rows};
}
export function generateDi011MixedSet(input:{seed:string;examProfile?:Di011ExamProfile}):Di011QuestionSet {
  const examProfile=input.examProfile ?? "BANKING_MAINS";
  const stimulus=buildStimulus(input.seed);
  const mediumPool = stimulus.pairKind === "PIE_TABLE" ? MEDIUM.filter((task) => task !== "CROSS_COMPONENT_AVERAGE") : MEDIUM;
  const hardPool = stimulus.pairKind === "PIE_TABLE" ? HARD.filter((task) => task !== "FOUR_VALUE_CROSS_AVERAGE") : HARD;
  const tasks:[Di011TaskKind,Di011Difficulty][]=[
    [pick(EASY,`${input.seed}:easy`),"Easy"],
    [pick(mediumPool,`${input.seed}:m1`),"Medium"],
    [pick(mediumPool,`${input.seed}:m2x`),"Medium"],
    [pick(hardPool,`${input.seed}:h1`),"Hard"],
    [pick(hardPool,`${input.seed}:h2x`),"Hard"],
  ];
  if(tasks[1]![0]===tasks[2]![0]) tasks[2]=[mediumPool[(mediumPool.indexOf(tasks[1]![0])+1)%mediumPool.length]!,"Medium"];
  if(tasks[3]![0]===tasks[4]![0]) tasks[4]=[hardPool[(hardPool.indexOf(tasks[3]![0])+1)%hardPool.length]!,"Hard"];
  const questions=tasks.map(([task,difficulty],i)=>makeQuestion(task,difficulty,stimulus,`${input.seed}:${task}:${i}`,i));
  return {packageId:"DI-011",setId:`DI-011:${input.seed}`,seed:input.seed,examProfile,stimulus,questions};
}
export const DI011_TASK_KINDS = Object.freeze([...EASY,...MEDIUM,...HARD]);
export const DI011_PAIR_KINDS = Object.freeze([...PAIRS]);
