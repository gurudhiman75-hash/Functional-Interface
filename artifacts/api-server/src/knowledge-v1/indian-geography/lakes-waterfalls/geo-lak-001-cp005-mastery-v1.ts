import { placeOptions, type GeoLak001Difficulty, type GeoLak001Question } from "./geo-lak-001-review-types";
import { GEO_LAK_001_OWNING_POOL_V1, auditGeoLak001OwningPoolV1 } from "./geo-lak-001-owning-pool-v1";

const STEM_STYLE_BANNED=/best describes|\bbroadly\b|\bmainly\b|associated with|which of the following is associated|strongest (?:fit|match|clue|choice)|points most strongly|given in NCERT|\bNCERT\b|\btextbook\b|review-only|runtimeRegistered|sourceFact|\bCP\d{3}\b/i;
export type MasteryQuestion=GeoLak001Question & Readonly<{sourceOwningQuestionId:string}>;

function semanticSignature(q:GeoLak001Question) {
 return JSON.stringify({qlId:q.qlId,qlName:q.qlName,difficulty:q.difficulty,stem:q.stem,canonicalAnswer:q.canonicalAnswer,explanation:q.explanation,sourceIds:[...q.sourceIds],sourceFactIds:[...q.sourceFactIds]});
}
const qlIds=Object.freeze([...new Set(GEO_LAK_001_OWNING_POOL_V1.map(q=>q.qlId))].sort());
function targetDifficulty(i:number):GeoLak001Difficulty{return (["Easy","Medium","Medium","Hard"] as const)[i%4];}
function selectRepresentative(qlId:string,i:number){
 const all=GEO_LAK_001_OWNING_POOL_V1.filter(q=>q.qlId===qlId),desired=targetDifficulty(i),preferred=all.filter(q=>q.difficulty===desired),candidates=preferred.length?preferred:all;
 if(!candidates.length)throw new Error("No owning questions for "+qlId);
 return candidates[i%candidates.length]!;
}
export const GEO_LAK_001_CP005_MASTERY_V1:readonly MasteryQuestion[]=Object.freeze(qlIds.map((qlId,i)=>{
 const source=selectRepresentative(qlId,i),distractors=source.options.filter(o=>o!==source.canonicalAnswer),correctIndex=i%4;
 return Object.freeze({...source,questionId:"GEO-LAK-001-CP005-Q"+String(i+1).padStart(3,"0"),options:placeOptions(source.canonicalAnswer,distractors,correctIndex),correctIndex,sourceIds:Object.freeze([...source.sourceIds]),sourceFactIds:Object.freeze([...source.sourceFactIds]),sourceOwningQuestionId:source.questionId,reviewOnly:true as const,runtimeRegistered:false as const});
}));
export function auditGeoLak001Cp005MasteryV1(){
 const issues:string[]=[],qlCounts:Record<string,number>={},difficultyCounts:Record<GeoLak001Difficulty,number>={Easy:0,Medium:0,Hard:0},answerPositions=[0,0,0,0],ids=new Set<string>(),stems=new Set<string>(),exps=new Set<string>();
 for(const q of GEO_LAK_001_CP005_MASTERY_V1){
  if(ids.has(q.questionId))issues.push("DUPLICATE_ID:"+q.questionId);ids.add(q.questionId);
  qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;difficultyCounts[q.difficulty]+=1;answerPositions[q.correctIndex]+=1;
  const s=q.stem.replace(/\s+/g," ").trim().toLowerCase(),e=q.explanation.replace(/\s+/g," ").trim().toLowerCase();
  if(stems.has(s))issues.push("DUPLICATE_STEM:"+q.questionId);stems.add(s);
  if(exps.has(e))issues.push("DUPLICATE_EXPLANATION:"+q.questionId);exps.add(e);
  if(q.options.length!==4||new Set(q.options).size!==4)issues.push("OPTIONS:"+q.questionId);
  if(q.options[q.correctIndex]!==q.canonicalAnswer)issues.push("ANSWER:"+q.questionId);
  if(!q.reviewOnly||q.runtimeRegistered)issues.push("LIFECYCLE:"+q.questionId);
  if(STEM_STYLE_BANNED.test(q.stem))issues.push("STEM_STYLE:"+q.questionId);
  const source=GEO_LAK_001_OWNING_POOL_V1.find(x=>x.questionId===q.sourceOwningQuestionId);
  if(!source)issues.push("SOURCE_MISSING:"+q.questionId);else if(semanticSignature(source)!==semanticSignature(q))issues.push("SEMANTIC_MUTATION:"+q.questionId);
 }
 for(const qlId of qlIds)if(qlCounts[qlId]!==1)issues.push("QL_COUNT:"+qlId+":"+(qlCounts[qlId]??0));
 return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_LAK_001_CP005_MASTERY_V1.length,permanentQlCount:qlIds.length,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions),stemCount:stems.size,explanationCount:exps.size});
}
export function auditGeoLak001ChapterClosureV1(){
 const owning=auditGeoLak001OwningPoolV1(),mastery=auditGeoLak001Cp005MasteryV1(),issues:string[]=[];
 if(!owning.valid)issues.push("OWNING:"+owning.issues.join("|")); if(!mastery.valid)issues.push("MASTERY:"+mastery.issues.join("|"));
 issues.push(...GEO_LAK_001_OWNING_POOL_V1.filter(q=>STEM_STYLE_BANNED.test(q.stem)).map(q=>"STEM_STYLE:"+q.questionId));
 issues.push(...GEO_LAK_001_OWNING_POOL_V1.filter(q=>!q.sourceIds.length||!q.sourceFactIds.length).map(q=>"PROVENANCE:"+q.questionId));
 return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),owningQuestionCount:owning.questionCount,permanentQlCount:owning.permanentQlCount,stemCount:owning.stemCount,explanationCount:owning.explanationCount,mastery,runtimeRegistered:false as const});
}
