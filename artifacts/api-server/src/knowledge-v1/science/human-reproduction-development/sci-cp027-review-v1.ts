import type { KnowledgeV1Difficulty } from "../../types";
import { PART_1 } from "./sci-cp027-review-v1-part1";
import { PART_2 } from "./sci-cp027-review-v1-part2";
import { PART_3 } from "./sci-cp027-review-v1-part3";
import { PART_4 } from "./sci-cp027-review-v1-part4";
type ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export type SciCp027ReviewQuestion = { questionId:string; chapterId:"SCI-001"; cpId:"SCI-CP-027"; qlId:string; qlName:string; difficulty:KnowledgeV1Difficulty; stem:string; options:string[]; correctIndex:number; canonicalAnswer:string; explanation:string; sourceIds:string[]; sourceFactIds:string[]; reviewOnly:true; runtimeRegistered:false };
const SOURCE_IDS=Object.freeze(["NCERT-SCIENCE-X-HOW-ORGANISMS-REPRODUCE","NCERT-BIOLOGY-HUMAN-REPRODUCTION","NIOS-SECONDARY-SCIENCE-HUMAN-REPRODUCTION"]);
export const SCI_CP027_QL_NAMES_V1:Record<number,string>={
  "1": "Male reproductive system",
  "2": "Female reproductive system",
  "3": "Gametes and gamete formation",
  "4": "Menstrual cycle and ovulation",
  "5": "Fertilization and implantation",
  "6": "Pregnancy, placenta and foetal development",
  "7": "Childbirth and lactation",
  "8": "Puberty and reproductive maturity",
  "9": "Contraception and reproductive health basics",
  "10": "Integrated reproduction and development reasoning"
};
const REVIEW_SPECS:readonly ReviewSpec[]=[...PART_1,...PART_2,...PART_3,...PART_4];
const pad3=(n:number)=>String(n).padStart(3,"0");
function buildOptions(answer:string,distractors:readonly [string,string,string],correctIndex:number){const options=[...distractors];options.splice(correctIndex,0,answer);return options;}
export const SCI_CP027_REVIEW_V1:readonly SciCp027ReviewQuestion[]=Object.freeze(REVIEW_SPECS.map((spec,index)=>{const [ql,difficulty,stem,answer,distractors,explanation,factIds]=spec;const correctIndex=index%4;return Object.freeze({questionId:`SCI-CP-027-REV-${pad3(index+1)}`,chapterId:"SCI-001" as const,cpId:"SCI-CP-027" as const,qlId:`SCI-027-QL-${pad3(ql)}`,qlName:SCI_CP027_QL_NAMES_V1[ql],difficulty,stem,options:buildOptions(answer,distractors,correctIndex),correctIndex,canonicalAnswer:answer,explanation,sourceIds:[...SOURCE_IDS],sourceFactIds:[...factIds],reviewOnly:true as const,runtimeRegistered:false as const});}));
export function validateSciCp027ReviewV1(){const errors:string[]=[];const qlCounts:Record<string,number>={};const difficultyCounts:Record<string,number>={};const answerPositionCounts:Record<string,number>={A:0,B:0,C:0,D:0};const ids=new Set<string>();const stems=new Set<string>();for(const q of SCI_CP027_REVIEW_V1){qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;difficultyCounts[q.difficulty]=(difficultyCounts[q.difficulty]??0)+1;answerPositionCounts[["A","B","C","D"][q.correctIndex]]++;if(ids.has(q.questionId))errors.push(`Duplicate id: ${q.questionId}`);ids.add(q.questionId);if(stems.has(q.stem))errors.push(`Duplicate stem: ${q.stem}`);stems.add(q.stem);if(q.options.length!==4||new Set(q.options).size!==4)errors.push(`${q.questionId}: option contract failed`);if(q.options[q.correctIndex]!==q.canonicalAnswer)errors.push(`${q.questionId}: answer mismatch`);if(!q.explanation.trim()||!q.sourceIds.length||!q.sourceFactIds.length)errors.push(`${q.questionId}: content/provenance missing`);if(!q.reviewOnly||q.runtimeRegistered)errors.push(`${q.questionId}: lifecycle violation`);}if(SCI_CP027_REVIEW_V1.length!==60)errors.push("Expected 60 questions");for(let ql=1;ql<=10;ql++){const id=`SCI-027-QL-${pad3(ql)}`;if(qlCounts[id]!==6)errors.push(`${id}: expected 6`);}for(const [d,n] of Object.entries({Easy:18,Medium:30,Hard:12}))if(difficultyCounts[d]!==n)errors.push(`${d}: expected ${n}`);for(const p of ["A","B","C","D"])if(answerPositionCounts[p]!==15)errors.push(`${p}: expected 15`);return {valid:errors.length===0,errors,totalQuestions:SCI_CP027_REVIEW_V1.length,qlCounts,difficultyCounts,answerPositionCounts};}
