import{buildEng007SpellingQuestionV1,type Eng007SharedMode}from"../eng-007-spelling-generator-v1";
import{ENG007_CP002_ENTRIES_V1,type Eng007Difficulty}from"./eng-007-cp002-lexicon-v1";
export type Eng007CP002Mode=Eng007SharedMode;
export interface GenerateEng007CP002V1Input{seed:string;difficulty:Eng007Difficulty;mode?:Eng007SharedMode;entryId?:string;}
export function generateEng007CP002QuestionV1(input:GenerateEng007CP002V1Input){
  return buildEng007SpellingQuestionV1("ENG-007-CP002",ENG007_CP002_ENTRIES_V1,input);
}
