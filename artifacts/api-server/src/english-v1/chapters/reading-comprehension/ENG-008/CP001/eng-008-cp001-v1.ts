import{deterministicIndex}from"../../../../core/deterministic";
import{ENG008_CP001_PASSAGES_V1,ENG008_CP001_QUESTION_AUTHORITIES_V1,type Eng008Difficulty,type Eng008RcFamilyId,type Eng008Genre}from"./eng-008-cp001-authorities-v1";

export interface GenerateEng008Cp001V1Input{
 seed:string;
 difficulty:Eng008Difficulty;
 familyId?:Eng008RcFamilyId;
 passageId?:string;
 authorityId?:string;
 genre?:Eng008Genre;
}
export interface Eng008Cp001QuestionV1{
 questionId:string;
 stem:string;
 passage:string;
 prompt:string;
 options:readonly string[];
 correctOptionIndex:number;
 explanation:string;
 metadata:{
  chapterId:"ENG-008";
  cpId:"ENG-008-CP001";
  passageId:string;
  authorityId:string;
  familyId:Eng008RcFamilyId;
  genre:Eng008Genre;
  difficulty:Eng008Difficulty;
  evidence:string;
  seed:string;
  reviewOnly:true;
 };
}
function hash(v:string){let h=0x811c9dc5;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function pool(input:GenerateEng008Cp001V1Input){
 let out=ENG008_CP001_QUESTION_AUTHORITIES_V1.filter(x=>x.question.difficulty===input.difficulty);
 if(input.familyId)out=out.filter(x=>x.question.familyId===input.familyId);
 if(input.passageId)out=out.filter(x=>x.passage.id===input.passageId);
 if(input.genre)out=out.filter(x=>x.passage.genre===input.genre);
 if(input.authorityId)out=out.filter(x=>x.question.id===input.authorityId);
 if(!out.length)throw new Error("No ENG-008 CP001 authority matches the requested filters");
 return out;
}
function placeOptions(seed:string,correct:string,distractors:readonly string[]){
 const shuffled=[...distractors];
 for(let i=shuffled.length-1;i>0;i--){const j=deterministicIndex(`${seed}:distractor:${i}`,i+1);[shuffled[i],shuffled[j]]=[shuffled[j]!,shuffled[i]!];}
 const ci=hash(`${seed}:answer-position`)%4,options:string[]=[];let wi=0;
 for(let i=0;i<4;i++)options.push(i===ci?correct:shuffled[wi++]!);
 return{options,correctOptionIndex:ci};
}
export function generateEng008Cp001QuestionV1(input:GenerateEng008Cp001V1Input):Eng008Cp001QuestionV1{
 const candidates=pool(input);
 const selected=candidates[deterministicIndex(`${input.seed}:authority`,candidates.length)]!;
 const{passage,question}=selected;
 const{options,correctOptionIndex}=placeOptions(input.seed,question.correctAnswer,question.distractors);
 if(new Set(options.map(x=>x.toLowerCase())).size!==4)throw new Error(`${question.id} does not have four unique options`);
 return{
  questionId:`ENG-008-CP001-V1:${question.id}:${hash(input.seed).toString(16)}`,
  stem:"Read the passage and answer the question.",
  passage:passage.text,
  prompt:question.question,
  options,
  correctOptionIndex,
  explanation:`Answer: ${question.correctAnswer}. ${question.explanation}`,
  metadata:{chapterId:"ENG-008",cpId:"ENG-008-CP001",passageId:passage.id,authorityId:question.id,familyId:question.familyId,genre:passage.genre,difficulty:question.difficulty,evidence:question.evidence,seed:input.seed,reviewOnly:true}
 };
}
export const ENG008_CP001_FAMILY_IDS_V1=["RC-F01","RC-F02","RC-F03","RC-F04","RC-F05","RC-F06"]as const;
export const ENG008_CP001_GENRES_V1=["narrative","report","editorial"]as const;
export const ENG008_CP001_PASSAGE_COUNT_V1=ENG008_CP001_PASSAGES_V1.length;
