import{deterministicIndex}from"../../../../core/deterministic";
import{ENG008_CP007_AUTHORITIES_V1,eng008Cp007MaskedPassageV1,type Eng008Cp007AuthorityV1}from"./eng-008-cp007-authorities-v1";

function hash(v:string){let h=0x811c9dc5;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function place(seed:string,correct:string,distractors:readonly string[]){const ds=[...distractors];for(let i=ds.length-1;i>0;i--){const j=deterministicIndex(`${seed}:d:${i}`,i+1);[ds[i],ds[j]]=[ds[j]!,ds[i]!];}const ci=hash(`${seed}:a`)%4,options:string[]=[];let wi=0;for(let i=0;i<4;i++)options.push(i===ci?correct:ds[wi++]!);return{options,correctOptionIndex:ci};}
export function generateEng008Cp007QuestionV1(input:{seed:string;authorityId?:string;passageId?:string}){
 let pool=ENG008_CP007_AUTHORITIES_V1 as readonly Eng008Cp007AuthorityV1[];
 if(input.authorityId)pool=pool.filter(x=>x.id===input.authorityId);
 if(input.passageId)pool=pool.filter(x=>x.passageId===input.passageId);
 if(!pool.length)throw new Error("No ENG-008 CP007 authority matches requested filters");
 const a=pool[deterministicIndex(`${input.seed}:authority`,pool.length)]!,{options,correctOptionIndex}=place(input.seed,a.correctAnswer,a.distractors);
 return{questionId:`ENG-008-CP007-V1:${a.id}:${hash(input.seed).toString(16)}`,stem:"Read the passage and choose the word that best fits the blank.",passage:eng008Cp007MaskedPassageV1(a),prompt:a.prompt,options,correctOptionIndex,explanation:`Answer: ${a.correctAnswer}. ${a.explanation}`,metadata:{chapterId:"ENG-008",cpId:"ENG-008-CP007",sourceCpId:"ENG-008-CP003",passageId:a.passageId,authorityId:a.id,familyId:a.familyId,genre:a.genre,difficulty:a.difficulty,evidence:a.evidence,seed:input.seed,reviewOnly:true as const}};
}
