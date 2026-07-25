import questions from "../question-language.en.json";
import registry from "../task-registry.library.json";
import explanations from "../explanation-by-ql.en.json";
import type { Pnc002QuestionEntry, Pnc002QlId, Pnc002SolveMode } from "./types";

type RawQuestion={qlId:Pnc002QlId;cpId:"PNC-CP-007";difficulty:"Easy"|"Medium"|"Hard";template:string};
type Group={qlIds:Pnc002QlId[];solveMode:Pnc002SolveMode};
const modeByQl=new Map<Pnc002QlId,Pnc002SolveMode>();
for(const group of registry.groups as Group[]) for(const qlId of group.qlIds){if(modeByQl.has(qlId))throw new Error(`Duplicate registry QL ${qlId}`);modeByQl.set(qlId,group.solveMode);}
export const entries:Pnc002QuestionEntry[]=(questions.entries as RawQuestion[]).map(q=>({...q,solveMode:modeByQl.get(q.qlId)!}));
if(entries.length!==12||modeByQl.size!==12)throw new Error("PNC-002 CP-007 requires 12 QLs with registry parity");
const ids=entries.map(e=>e.qlId);if(new Set(ids).size!==ids.length)throw new Error("Duplicate QL IDs");
export const explanationMap=explanations.entries as Record<Pnc002QlId,string[]>;
for(const id of ids)if(!explanationMap[id])throw new Error(`Missing explanation ${id}`);
export function getEntry(id:Pnc002QlId){const found=entries.find(e=>e.qlId===id);if(!found)throw new Error(`Unknown QL ${id}`);return found;}
export function render(template:string,variables:Record<string,string|number>){return template.replace(/\{([A-Za-z0-9_]+)\}/g,(_,key:string)=>{if(!(key in variables))throw new Error(`Missing ${key}`);return String(variables[key]);});}
