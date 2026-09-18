import type { KnowledgeV1Difficulty } from "../../types";
import { PART_1 } from "./sci-cp019-review-v1-part1";
import { PART_2 } from "./sci-cp019-review-v1-part2";
import { PART_3 } from "./sci-cp019-review-v1-part3";
import { PART_4 } from "./sci-cp019-review-v1-part4";

type ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export type SciCp019ReviewQuestion = { questionId:string; chapterId:"SCI-001"; cpId:"SCI-CP-019"; qlId:string; qlName:string; difficulty:KnowledgeV1Difficulty; stem:string; options:string[]; correctIndex:number; canonicalAnswer:string; explanation:string; sourceIds:string[]; sourceFactIds:string[]; reviewOnly:true; runtimeRegistered:false };
const SOURCE_IDS = Object.freeze(["NCERT-SCIENCE-VIII-CELL-STRUCTURE","NCERT-SCIENCE-IX-FUNDAMENTAL-UNIT-LIFE","NIOS-SECONDARY-SCIENCE-CELL"]);
export const SCI_CP019_QL_NAMES_V1: Record<number,string> = {
  1:"Cell discovery, cell theory and biological organization",
  2:"Prokaryotic and eukaryotic cells",
  3:"Plasma membrane, cell wall, diffusion and osmosis",
  4:"Nucleus, chromosomes, DNA and genes",
  5:"Ribosomes, endoplasmic reticulum and Golgi apparatus",
  6:"Mitochondria, plastids and chloroplasts",
  7:"Lysosomes, vacuoles and plant-animal cell features",
  8:"Cell division: mitosis and meiosis basics",
  9:"Organelle-function and cell-type reasoning",
  10:"Microscopy, unicellular life and mixed cell biology"
};
const REVIEW_SPECS: readonly ReviewSpec[] = [...PART_1,...PART_2,...PART_3,...PART_4];
const pad3=(n:number)=>String(n).padStart(3,"0");
function buildOptions(answer:string,distractors:readonly [string,string,string],correctIndex:number){const options=[...distractors];options.splice(correctIndex,0,answer);return options;}
export const SCI_CP019_REVIEW_V1: readonly SciCp019ReviewQuestion[] = Object.freeze(REVIEW_SPECS.map((spec,index)=>{const [ql,difficulty,stem,answer,distractors,explanation,factIds]=spec;const correctIndex=index%4;return Object.freeze({questionId:`SCI-CP-019-REV-${pad3(index+1)}`,chapterId:"SCI-001" as const,cpId:"SCI-CP-019" as const,qlId:`SCI-019-QL-${pad3(ql)}`,qlName:SCI_CP019_QL_NAMES_V1[ql],difficulty,stem,options:buildOptions(answer,distractors,correctIndex),correctIndex,canonicalAnswer:answer,explanation,sourceIds:[...SOURCE_IDS],sourceFactIds:[...factIds],reviewOnly:true as const,runtimeRegistered:false as const});}));
export type SciCp019Validation={valid:boolean;errors:string[];totalQuestions:number;qlCounts:Record<string,number>;difficultyCounts:Record<string,number>;answerPositionCounts:Record<string,number>};
export function validateSciCp019ReviewV1():SciCp019Validation{const errors:string[]=[];const qlCounts:Record<string,number>={};const difficultyCounts:Record<string,number>={};const answerPositionCounts:Record<string,number>={A:0,B:0,C:0,D:0};const seenIds=new Set<string>();const seenStems=new Set<string>();for(const q of SCI_CP019_REVIEW_V1){qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;difficultyCounts[q.difficulty]=(difficultyCounts[q.difficulty]??0)+1;const p=["A","B","C","D"][q.correctIndex];answerPositionCounts[p]+=1;if(seenIds.has(q.questionId))errors.push(`Duplicate questionId: ${q.questionId}`);seenIds.add(q.questionId);if(seenStems.has(q.stem))errors.push(`Duplicate stem: ${q.stem}`);seenStems.add(q.stem);if(q.options.length!==4||new Set(q.options).size!==4)errors.push(`${q.questionId}: option contract failed`);if(q.options[q.correctIndex]!==q.canonicalAnswer)errors.push(`${q.questionId}: keyed answer mismatch`);if(!q.explanation.trim())errors.push(`${q.questionId}: missing explanation`);if(!q.sourceIds.length||!q.sourceFactIds.length)errors.push(`${q.questionId}: missing provenance`);if(!q.reviewOnly||q.runtimeRegistered)errors.push(`${q.questionId}: lifecycle violation`);}if(SCI_CP019_REVIEW_V1.length!==60)errors.push(`Expected 60 questions, found ${SCI_CP019_REVIEW_V1.length}`);for(let ql=1;ql<=10;ql++){const id=`SCI-019-QL-${pad3(ql)}`;if(qlCounts[id]!==6)errors.push(`${id}: expected 6, found ${qlCounts[id]??0}`);}for(const [d,n] of Object.entries({Easy:18,Medium:30,Hard:12}))if(difficultyCounts[d]!==n)errors.push(`${d}: expected ${n}, found ${difficultyCounts[d]??0}`);for(const p of ["A","B","C","D"] as const)if(answerPositionCounts[p]!==15)errors.push(`${p}: expected 15, found ${answerPositionCounts[p]}`);return{valid:errors.length===0,errors,totalQuestions:SCI_CP019_REVIEW_V1.length,qlCounts,difficultyCounts,answerPositionCounts};}
