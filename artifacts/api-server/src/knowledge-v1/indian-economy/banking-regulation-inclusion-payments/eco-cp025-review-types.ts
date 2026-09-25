import type { KnowledgeV1Difficulty } from "../../types";
export type EcoCp025ReviewQuestion = {
  questionId:string; chapterId:"ECO-001"; cpId:"ECO-CP-025"; qlId:string; qlName:string;
  difficulty:KnowledgeV1Difficulty; stem:string; options:string[]; correctIndex:number; canonicalAnswer:string;
  explanation:string; sourceIds:string[]; sourceFactIds:string[]; reviewOnly:true; runtimeRegistered:false;
};
