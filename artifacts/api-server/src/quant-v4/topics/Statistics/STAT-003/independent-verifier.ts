import { formatExactNumber } from "../shared/exact";
import type { Stat003Question, Stat003State } from "./types";
function sum(v:readonly number[]){return v.reduce((a,b)=>a+b,0);}
export function independentlySolveStat003(state:Stat003State):string { switch(state.kind){
  case "DISCRETE_FREQUENCY_MEAN": {const fx=state.rows.reduce((t,r)=>t+r.value*r.frequency,0); const n=state.rows.reduce((t,r)=>t+r.frequency,0); return formatExactNumber(fx,n);}
  case "GROUPED_FREQUENCY_MEAN": {let num=0,n=0; for(const c of state.classes){num+=(c.lower+c.upper)*c.frequency;n+=2*c.frequency;} return formatExactNumber(num,n);}
  case "DISCRETE_FREQUENCY_MEDIAN": {const n=state.rows.reduce((t,r)=>t+r.frequency,0); const p=(n+1)/2; let cf=0; for(const r of state.rows){cf+=r.frequency;if(cf>=p)return String(r.value);} throw new Error('No median');}
  case "GROUPED_FREQUENCY_MEDIAN": {const n=state.classes.reduce((t,c)=>t+c.frequency,0); let cf=0; for(const c of state.classes){if(2*(cf+c.frequency)>=n){return formatExactNumber(2*c.lower*c.frequency+(n-2*cf)*(c.upper-c.lower),2*c.frequency);} cf+=c.frequency;} throw new Error('No median class');}
  case "GROUPED_FREQUENCY_MODE": {let k=0; for(let i=1;i<state.classes.length;i++) if(state.classes[i]!.frequency>state.classes[k]!.frequency)k=i; const c=state.classes[k]!,f1=c.frequency,f0=state.classes[k-1]!.frequency,f2=state.classes[k+1]!.frequency,d=2*f1-f0-f2; return formatExactNumber(c.lower*d+(f1-f0)*(c.upper-c.lower),d);}
  case "EMPIRICAL_MODE": return String(3*state.median-2*state.mean);
  case "EMPIRICAL_DIFFERENCE": return formatExactNumber(state.meanModeDifference,3);
  case "MISSING_VALUE_FROM_MEAN": {const n=sum(state.frequencies), target=state.statedMean*n; let known=0; for(let i=0;i<state.values.length;i++) if(i!==state.missingIndex) known+=state.values[i]!*state.frequencies[i]!; return formatExactNumber(target-known,state.frequencies[state.missingIndex]!);}
}}
export function verifyStat003Question(q:Stat003Question){const expected=independentlySolveStat003(q.state); return {valid:expected===q.answer && q.options[q.correctIndex]===q.answer,expected,actual:q.answer};}
