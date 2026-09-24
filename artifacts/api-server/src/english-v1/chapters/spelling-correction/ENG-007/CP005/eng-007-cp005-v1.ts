import{buildEng007SpellingQuestionV1,type Eng007SharedMode}from"../eng-007-spelling-generator-v1";
import{ENG007_CP005_ENTRIES_V1,type Eng007Difficulty}from"./eng-007-cp005-lexicon-v1";
export type Eng007CP005Mode=Eng007SharedMode;
export interface GenerateEng007CP005V1Input{seed:string;difficulty:Eng007Difficulty;mode?:Eng007SharedMode;entryId?:string;}
export function generateEng007CP005QuestionV1(input:GenerateEng007CP005V1Input){
  return buildEng007SpellingQuestionV1("ENG-007-CP005",ENG007_CP005_ENTRIES_V1,input);
}
