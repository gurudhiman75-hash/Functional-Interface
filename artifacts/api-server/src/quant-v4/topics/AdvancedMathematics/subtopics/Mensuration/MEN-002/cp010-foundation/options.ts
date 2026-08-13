import type { ExactValue } from "../foundation/types";
import { exactEquals, exactKey, formatExactPlain } from "../foundation/exact";
import { answerPosition, distractorsMenCp010, scaleMenCp010 } from "./engine";
import type { MenCp010Option, MenCp010State } from "./types";
const LABELS=["A","B","C","D"] as const;
const display=(v:ExactValue,u:string)=>`${formatExactPlain(v)} ${u}`;
export const displayMenCp010=display;
export function optionsMenCp010(state:MenCp010State,correct:ExactValue):MenCp010Option[]{
  const candidates=[{value:correct,misconceptionId:null as string|null},...distractorsMenCp010(state,correct)],unique=new Map<string,{value:ExactValue;misconceptionId:string|null}>();
  for(const c of candidates)unique.set(exactKey(c.value),c);
  let factor=2n;while(unique.size<4){const v=scaleMenCp010(correct,factor);if(!unique.has(exactKey(v)))unique.set(exactKey(v),{value:v,misconceptionId:`SCALE_BY_${factor}`});factor+=1n;}
  const wrong=[...unique.values()].filter(x=>!exactEquals(x.value,correct)).slice(0,3),pos=answerPosition(state.seed),ordered:Array<{value:ExactValue;misconceptionId:string|null}>=[];let w=0;
  for(let i=0;i<4;i++)ordered.push(i===pos?{value:correct,misconceptionId:null}:wrong[w++]!);
  return ordered.map((x,i)=>({label:LABELS[i],value:x.value,display:display(x.value,state.unit),isCorrect:i===pos,misconceptionId:x.misconceptionId}));
}
