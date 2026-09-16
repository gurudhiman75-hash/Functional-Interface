import type { KnowledgeV1Difficulty } from "../../types";
import { PART_1 as P1 } from "./sci-cp018-review-v1-part1";
import { PART_2 as P2 } from "./sci-cp018-review-v1-part2";
import { PART_3 as P3 } from "./sci-cp018-review-v1-part3";
import { PART_4 as P4 } from "./sci-cp018-review-v1-part4";

type ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export type SciCp018ReviewQuestion = { questionId:string; chapterId:"SCI-001"; cpId:"SCI-CP-018"; qlId:string; qlName:string; difficulty:KnowledgeV1Difficulty; stem:string; options:string[]; correctIndex:number; canonicalAnswer:string; explanation:string; sourceIds:string[]; sourceFactIds:string[]; reviewOnly:true; runtimeRegistered:false; };
const SOURCE_IDS = Object.freeze(["NCERT-SCIENCE-X-CHEMISTRY", "NCERT-SCIENCE-VIII-SYNTHETIC-FIBRES", "NIOS-SECONDARY-SCIENCE-CHEMISTRY"]);
export const SCI_CP018_QL_NAMES_V1: Record<number,string> = {
  1: "Common household and industrial chemicals",
  2: "Fuels and familiar gases",
  3: "Fertilizers and plant nutrients",
  4: "Polymers and synthetic fibres",
  5: "Common hydrated salts and chemical names",
  6: "Food chemistry and preservation",
  7: "Water chemistry and treatment",
  8: "Rubber, glass, cement and ceramics",
  9: "Statement I/II",
  10: "Mixed everyday-chemistry application",
};
const REVIEW_SPECS = [...P1,...P2,...P3,...P4] as unknown as readonly ReviewSpec[];
const pad3=(v:number)=>String(v).padStart(3,"0");
const buildOptions=(a:string,d:readonly [string,string,string],i:number)=>{const o=[...d];o.splice(i,0,a);return o;};
export const SCI_CP018_REVIEW_V1: readonly SciCp018ReviewQuestion[] = Object.freeze(REVIEW_SPECS.map((s,index)=>{const [ql,difficulty,stem,answer,distractors,explanation,factIds]=s;const correctIndex=index%4;return Object.freeze({questionId:`SCI-CP-018-REV-${pad3(index+1)}`,chapterId:"SCI-001" as const,cpId:"SCI-CP-018" as const,qlId:`SCI-018-QL-${pad3(ql)}`,qlName:SCI_CP018_QL_NAMES_V1[ql],difficulty,stem,options:buildOptions(answer,distractors,correctIndex),correctIndex,canonicalAnswer:answer,explanation,sourceIds:[...SOURCE_IDS],sourceFactIds:[...factIds],reviewOnly:true as const,runtimeRegistered:false as const});}));
export function validateSciCp018ReviewV1(){const errors:string[]=[];const qlCounts:Record<string,number>={};const difficultyCounts:Record<string,number>={};const answerPositionCounts:Record<string,number>={A:0,B:0,C:0,D:0};const seenIds=new Set<string>();const seenStems=new Set<string>();for(const q of SCI_CP018_REVIEW_V1){qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;difficultyCounts[q.difficulty]=(difficultyCounts[q.difficulty]??0)+1;answerPositionCounts[["A","B","C","D"][q.correctIndex]]+=1;if(seenIds.has(q.questionId))errors.push(`Duplicate questionId: ${q.questionId}`);seenIds.add(q.questionId);if(seenStems.has(q.stem))errors.push(`Duplicate stem: ${q.stem}`);seenStems.add(q.stem);if(q.options.length!==4||new Set(q.options).size!==4)errors.push(`${q.questionId}: invalid options`);if(q.options[q.correctIndex]!==q.canonicalAnswer)errors.push(`${q.questionId}: keyed answer mismatch`);if(!q.explanation.trim())errors.push(`${q.questionId}: missing explanation`);if(!q.sourceIds.length||!q.sourceFactIds.length)errors.push(`${q.questionId}: missing provenance`);if(!q.reviewOnly||q.runtimeRegistered)errors.push(`${q.questionId}: lifecycle violation`);}if(SCI_CP018_REVIEW_V1.length!==60)errors.push("Expected 60 questions");for(let ql=1;ql<=10;ql+=1){const id=`SCI-018-QL-${pad3(ql)}`;if(qlCounts[id]!==6)errors.push(`${id}: expected 6 questions`);}for(const [k,v] of Object.entries({Easy:18,Medium:30,Hard:12}))if(difficultyCounts[k]!==v)errors.push(`${k}: expected ${v}`);for(const k of ["A","B","C","D"])if(answerPositionCounts[k]!==15)errors.push(`${k}: expected 15`);return {valid:errors.length===0,errors,totalQuestions:SCI_CP018_REVIEW_V1.length,qlCounts,difficultyCounts,answerPositionCounts};}
