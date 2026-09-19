import type { KnowledgeV1Difficulty } from "../../types";
import { PART_1 } from "./sci-cp033-review-v1-part1";
import { PART_2 } from "./sci-cp033-review-v1-part2";
import { PART_3 } from "./sci-cp033-review-v1-part3";
import { PART_4 } from "./sci-cp033-review-v1-part4";
type ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export type SciCp033ReviewQuestion = { questionId:string; chapterId:"SCI-001"; cpId:"SCI-CP-033"; qlId:string; qlName:string; difficulty:KnowledgeV1Difficulty; stem:string; options:string[]; correctIndex:number; canonicalAnswer:string; explanation:string; sourceIds:string[]; sourceFactIds:string[]; reviewOnly:true; runtimeRegistered:false };
const SOURCE_IDS=Object.freeze(["NCERT-SCIENCE-XV-OUR-ENVIRONMENT","NCERT-BIOLOGY-ECOSYSTEM","NIOS-SECONDARY-SCIENCE-ECOLOGY"]);
export const SCI_CP033_QL_NAMES_V1:Record<number,string>={
  "1": "Ecology, habitat and ecosystem basics",
  "2": "Biotic and abiotic components",
  "3": "Producers, consumers and decomposers",
  "4": "Food chains, food webs and trophic levels",
  "5": "Energy flow and ecological pyramids",
  "6": "Population, community and ecological interactions",
  "7": "Water and carbon cycles",
  "8": "Nitrogen cycle and nutrient cycling",
  "9": "Ecological succession and ecosystem balance",
  "10": "Integrated ecosystem reasoning"
};
const REVIEW_SPECS:readonly ReviewSpec[]=[...PART_1,...PART_2,...PART_3,...PART_4];
const pad3=(n:number)=>String(n).padStart(3,"0");
function buildOptions(answer:string,distractors:readonly [string,string,string],correctIndex:number){const options=[...distractors];options.splice(correctIndex,0,answer);return options;}
export const SCI_CP033_REVIEW_V1:readonly SciCp033ReviewQuestion[]=Object.freeze(REVIEW_SPECS.map((spec,index)=>{const [ql,difficulty,stem,answer,distractors,explanation,factIds]=spec;const correctIndex=index%4;return Object.freeze({questionId:`SCI-CP-033-REV-${pad3(index+1)}`,chapterId:"SCI-001" as const,cpId:"SCI-CP-033" as const,qlId:`SCI-033-QL-${pad3(ql)}`,qlName:SCI_CP033_QL_NAMES_V1[ql],difficulty,stem,options:buildOptions(answer,distractors,correctIndex),correctIndex,canonicalAnswer:answer,explanation,sourceIds:[...SOURCE_IDS],sourceFactIds:[...factIds],reviewOnly:true as const,runtimeRegistered:false as const});}));
export function validateSciCp033ReviewV1(){const errors:string[]=[];const qlCounts:Record<string,number>={};const difficultyCounts:Record<string,number>={};const answerPositionCounts:Record<string,number>={A:0,B:0,C:0,D:0};const ids=new Set<string>();const stems=new Set<string>();for(const q of SCI_CP033_REVIEW_V1){qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;difficultyCounts[q.difficulty]=(difficultyCounts[q.difficulty]??0)+1;answerPositionCounts[["A","B","C","D"][q.correctIndex]]++;if(ids.has(q.questionId))errors.push(`Duplicate id: ${q.questionId}`);ids.add(q.questionId);if(stems.has(q.stem))errors.push(`Duplicate stem: ${q.stem}`);stems.add(q.stem);if(q.options.length!==4||new Set(q.options).size!==4)errors.push(`${q.questionId}: option contract failed`);if(q.options[q.correctIndex]!==q.canonicalAnswer)errors.push(`${q.questionId}: answer mismatch`);if(!q.explanation.trim()||!q.sourceIds.length||!q.sourceFactIds.length)errors.push(`${q.questionId}: content/provenance missing`);if(!q.reviewOnly||q.runtimeRegistered)errors.push(`${q.questionId}: lifecycle violation`);}if(SCI_CP033_REVIEW_V1.length!==60)errors.push("Expected 60 questions");for(let ql=1;ql<=10;ql++){const id=`SCI-033-QL-${pad3(ql)}`;if(qlCounts[id]!==6)errors.push(`${id}: expected 6`);}for(const [d,n] of Object.entries({Easy:18,Medium:30,Hard:12}))if(difficultyCounts[d]!==n)errors.push(`${d}: expected ${n}`);for(const p of ["A","B","C","D"])if(answerPositionCounts[p]!==15)errors.push(`${p}: expected 15`);return {valid:errors.length===0,errors,totalQuestions:SCI_CP033_REVIEW_V1.length,qlCounts,difficultyCounts,answerPositionCounts};}
