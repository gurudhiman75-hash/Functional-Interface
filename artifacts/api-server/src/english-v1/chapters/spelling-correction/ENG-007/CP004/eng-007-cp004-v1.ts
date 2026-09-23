import{buildEng007SpellingQuestionV1,type Eng007SharedMode}from"../eng-007-spelling-generator-v1";
import{ENG007_CP004_ENTRIES_V1,type Eng007Difficulty}from"./eng-007-cp004-lexicon-v1";
export type Eng007CP004Mode=Eng007SharedMode;
export interface GenerateEng007CP004V1Input{seed:string;difficulty:Eng007Difficulty;mode?:Eng007SharedMode;entryId?:string;}
export function generateEng007CP004QuestionV1(input:GenerateEng007CP004V1Input){
  return buildEng007SpellingQuestionV1("ENG-007-CP004",ENG007_CP004_ENTRIES_V1,input);
}
