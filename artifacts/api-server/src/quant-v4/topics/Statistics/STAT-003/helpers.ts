import { formatExactNumber, hashSeed, seededRandom, shuffle } from "../shared/exact";
import type { Stat003DiscreteRow, Stat003Explanation, Stat003GroupedClass, Stat003Option, Stat003State } from "./types";

export type Candidate = Readonly<{ text: string; misconceptionId: string; derivation: string }>;
export type Draft = Readonly<{ state: Stat003State; stem: string; answer: string; candidates: readonly Candidate[]; explanation: Stat003Explanation }>;

export const GROUPED_MEAN_FREQUENCIES = [
  [2, 4, 12, 21, 6, 3, 2],
  [4, 7, 10, 7, 4],
  [5, 8, 12, 9, 6],
  [2, 5, 9, 12, 8, 4],
] as const;
export const GROUPED_MEDIAN_FREQUENCIES = [
  [5, 8, 6, 6, 5],
  [9, 16, 24, 15, 4],
  [7, 11, 18, 14, 8],
  [6, 10, 20, 12, 6],
  [8, 15, 25, 15, 8],
] as const;
export const GROUPED_MODE_FREQUENCIES = [
  [8, 15, 25, 15, 8],
  [6, 10, 20, 12, 6],
  [4, 9, 16, 11, 5],
  [5, 13, 18, 10, 4],
  [7, 11, 18, 14, 8],
] as const;
export const MISSING_VALUE_TEMPLATES = [
  { values: [4, 7, 10, 13, 16], frequencies: [2, 3, 4, 5, 1], mean: 10 },
  { values: [5, 8, 11, 14, 17], frequencies: [3, 2, 5, 4, 2], mean: 11 },
  { values: [6, 10, 14, 18, 22], frequencies: [2, 3, 4, 5, 1], mean: 14 },
  { values: [8, 12, 16, 20, 24], frequencies: [3, 2, 5, 4, 2], mean: 16 },
  { values: [10, 15, 20, 25, 30], frequencies: [1, 4, 3, 2, 5], mean: 22 },
  { values: [10, 15, 20, 25, 30], frequencies: [2, 5, 3, 4, 1], mean: 19 },
] as const;

export function sum(values: readonly number[]) { return values.reduce((a,b)=>a+b,0); }
export function weightedTotal(rows: readonly Stat003DiscreteRow[]) { return rows.reduce((t,r)=>t+r.value*r.frequency,0); }
export function totalFrequencyRows(rows: readonly Stat003DiscreteRow[]) { return rows.reduce((t,r)=>t+r.frequency,0); }
export function totalFrequencyClasses(classes: readonly Stat003GroupedClass[]) { return classes.reduce((t,c)=>t+c.frequency,0); }
export function surface(seed:string):0|1|2 { return (hashSeed(`${seed}:surface`)%3) as 0|1|2; }
export function groupedClasses(start:number,width:number,frequencies:readonly number[]):Stat003GroupedClass[] { return frequencies.map((frequency,i)=>({lower:start+i*width,upper:start+(i+1)*width,frequency})); }
export function discreteTable(rows: readonly Stat003DiscreteRow[]) { return `| Value (x) | Frequency (f) |\n|---:|---:|\n${rows.map(r=>`| ${r.value} | ${r.frequency} |`).join("\n")}`; }
export function groupedTable(classes: readonly Stat003GroupedClass[]) { return `| Class interval | Frequency |\n|---:|---:|\n${classes.map(c=>`| ${c.lower}-${c.upper} | ${c.frequency} |`).join("\n")}`; }
export function missingTable(values: readonly (number|null)[], frequencies: readonly number[]) { return `| Value (x) | Frequency (f) |\n|---:|---:|\n${values.map((v,i)=>`| ${v===null?"?":v} | ${frequencies[i]} |`).join("\n")}`; }
export function groupedMeanFraction(classes:readonly Stat003GroupedClass[]) { let numerator=0, denominator=0; for(const c of classes){ const midpoint2=c.lower+c.upper; numerator += midpoint2*c.frequency; denominator += 2*c.frequency; } return {numerator,denominator}; }
export function groupedMedianFraction(classes:readonly Stat003GroupedClass[]) { const n=totalFrequencyClasses(classes); let cf=0; for(const c of classes){ if(2*(cf+c.frequency)>=n){ const numerator=2*c.lower*c.frequency + (n-2*cf)*(c.upper-c.lower); const denominator=2*c.frequency; return {numerator,denominator,medianClass:c,cfBefore:cf,n}; } cf+=c.frequency; } throw new Error("No median class"); }
export function groupedModeFraction(classes:readonly Stat003GroupedClass[]) { let index=0; for(let i=1;i<classes.length;i++) if(classes[i]!.frequency>classes[index]!.frequency) index=i; if(index===0||index===classes.length-1) throw new Error("Modal class must be internal"); const c=classes[index]!; const f1=c.frequency,f0=classes[index-1]!.frequency,f2=classes[index+1]!.frequency; const d=2*f1-f0-f2; const numerator=c.lower*d+(f1-f0)*(c.upper-c.lower); return {numerator,denominator:d,modalClass:c,f0,f1,f2}; }
export function numericCandidate(value:number){ return formatExactNumber(Math.round(value*100),100); }
export function buildOptions(seed:string,answer:string,candidates:readonly Candidate[]){ const kept:Stat003Option[]=[]; const seen=new Set<string>(); const add=(c:Candidate)=>{const k=c.text.trim().toLowerCase(); if(!k||seen.has(k))return; seen.add(k); kept.push(c);}; add({text:answer,misconceptionId:"CORRECT",derivation:"Independent recomputation from the displayed STAT-003 mathematical state."}); candidates.forEach(add); const ans=Number(answer); let bump=1; while(kept.length<4 && Number.isFinite(ans)){ add({text:numericCandidate(ans+bump),misconceptionId:`NEARBY_${bump}`,derivation:"Plausible nearby arithmetic result used only after semantic distractors are exhausted."}); bump++; } if(kept.length<4) throw new Error("STAT-003 did not construct four unique options"); const shuffled=shuffle(seededRandom(`${seed}:options`),kept.slice(0,4)); const correctIndex=shuffled.findIndex(o=>o.misconceptionId==="CORRECT"); return {options:shuffled.map(o=>o.text),optionMetadata:shuffled,correctIndex}; }
