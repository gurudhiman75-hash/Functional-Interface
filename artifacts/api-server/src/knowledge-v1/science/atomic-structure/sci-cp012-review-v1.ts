import type { KnowledgeV1Difficulty } from "../../types";
import { PART_1 } from "./sci-cp012-review-v1-part1";
import { PART_2 } from "./sci-cp012-review-v1-part2";
import { PART_3 } from "./sci-cp012-review-v1-part3";
import { PART_4 } from "./sci-cp012-review-v1-part4";

type ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];

export type SciCp012ReviewQuestion = {
  questionId:string; chapterId:"SCI-001"; cpId:"SCI-CP-012"; qlId:string; qlName:string;
  difficulty:KnowledgeV1Difficulty; stem:string; options:string[]; correctIndex:number;
  canonicalAnswer:string; explanation:string; sourceIds:string[]; sourceFactIds:string[];
  reviewOnly:true; runtimeRegistered:false;
};

const SOURCE_IDS = Object.freeze(["NCERT-SCIENCE-IX-STRUCTURE-ATOM", "NCERT-SCIENCE-IX-ATOMS-MOLECULES", "NIOS-SECONDARY-SCIENCE-ATOMIC-STRUCTURE"]);

export const SCI_CP012_QL_NAMES_V1: Record<number,string> = {
  1: "Subatomic particles and the nucleus",
  2: "Atomic number, mass number and isotope basics",
  3: "Atoms, molecules and ions",
  4: "Particle counting, isotopes and isobars",
  5: "Electronic configuration and valency",
  6: "Chemical formulae, common ions and bonding basics",
  7: "Constant proportions, atomic and molecular mass",
  8: "Dalton and major atomic models",
  9: "Integrated statement reasoning",
  10: "Mixed atomic and molecular application",
};

const REVIEW_SPECS: readonly ReviewSpec[] = [...PART_1, ...PART_2, ...PART_3, ...PART_4];

const pad3=(n:number)=>String(n).padStart(3,"0");
function buildOptions(answer:string,distractors:readonly [string,string,string],correctIndex:number){
  const options=[...distractors]; options.splice(correctIndex,0,answer); return options;
}

export const SCI_CP012_REVIEW_V1: readonly SciCp012ReviewQuestion[] = Object.freeze(
  REVIEW_SPECS.map((spec,index)=>{
    const [ql,difficulty,stem,answer,distractors,explanation,factIds]=spec;
    const correctIndex=index%4;
    return Object.freeze({
      questionId:`SCI-CP-012-REV-${pad3(index+1)}`,
      chapterId:"SCI-001" as const,
      cpId:"SCI-CP-012" as const,
      qlId:`SCI-012-QL-${pad3(ql)}`,
      qlName:SCI_CP012_QL_NAMES_V1[ql],
      difficulty, stem,
      options:buildOptions(answer,distractors,correctIndex),
      correctIndex,
      canonicalAnswer:answer,
      explanation,
      sourceIds:[...SOURCE_IDS],
      sourceFactIds:[...factIds],
      reviewOnly:true as const,
      runtimeRegistered:false as const,
    });
  })
);

export type SciCp012Validation={
  valid:boolean; errors:string[]; totalQuestions:number;
  qlCounts:Record<string,number>; difficultyCounts:Record<string,number>; answerPositionCounts:Record<string,number>;
};

export function validateSciCp012ReviewV1():SciCp012Validation{
  const errors:string[]=[];
  const qlCounts:Record<string,number>={};
  const difficultyCounts:Record<string,number>={};
  const answerPositionCounts:Record<string,number>={A:0,B:0,C:0,D:0};
  const seenIds=new Set<string>(); const seenStems=new Set<string>();
  for(const q of SCI_CP012_REVIEW_V1){
    qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;
    difficultyCounts[q.difficulty]=(difficultyCounts[q.difficulty]??0)+1;
    answerPositionCounts[["A","B","C","D"][q.correctIndex]]+=1;
    if(seenIds.has(q.questionId)) errors.push(`Duplicate questionId: ${q.questionId}`); seenIds.add(q.questionId);
    if(seenStems.has(q.stem)) errors.push(`Duplicate stem: ${q.stem}`); seenStems.add(q.stem);
    if(q.options.length!==4) errors.push(`${q.questionId}: expected four options`);
    if(new Set(q.options).size!==4) errors.push(`${q.questionId}: options must be distinct`);
    if(q.options[q.correctIndex]!==q.canonicalAnswer) errors.push(`${q.questionId}: keyed answer mismatch`);
    if(!q.explanation.trim()) errors.push(`${q.questionId}: missing explanation`);
    if(!q.sourceIds.length||!q.sourceFactIds.length) errors.push(`${q.questionId}: missing provenance`);
    if(!q.reviewOnly||q.runtimeRegistered) errors.push(`${q.questionId}: lifecycle violation`);
  }
  if(SCI_CP012_REVIEW_V1.length!==60) errors.push(`Expected 60 questions, found ${SCI_CP012_REVIEW_V1.length}`);
  for(let ql=1;ql<=10;ql++){const id=`SCI-012-QL-${pad3(ql)}`;if(qlCounts[id]!==6)errors.push(`${id}: expected 6, found ${qlCounts[id]??0}`);}
  for(const [d,n] of Object.entries({Easy:18,Medium:30,Hard:12}))if(difficultyCounts[d]!==n)errors.push(`${d}: expected ${n}, found ${difficultyCounts[d]??0}`);
  for(const p of ["A","B","C","D"])if(answerPositionCounts[p]!==15)errors.push(`${p}: expected 15, found ${answerPositionCounts[p]}`);
  return{valid:errors.length===0,errors,totalQuestions:SCI_CP012_REVIEW_V1.length,qlCounts,difficultyCounts,answerPositionCounts};
}
