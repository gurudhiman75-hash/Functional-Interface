import { GEO_WAT_001_FOUNDATION_SOURCE_IDS, placeGeoWatOptions, type GeoWat001Difficulty, type GeoWat001Question } from "./geo-wat-001-review-types";
export type GeoWat001VariantSeed=Readonly<{stem:string;answer:string;distractors:readonly [string,string,string];explanation:string;sourceFactId:string;sourceIds?:readonly string[];difficulty?:GeoWat001Difficulty;}>;
export type GeoWat001Ql=Readonly<{qlKey:string;qlId:string;qlName:string;questions:readonly GeoWat001Question[]}>;
function semanticQlId(key:string){return "GEO-WAT-001-QL-"+key.trim().toUpperCase().replace(/[^A-Z0-9]+/g,"-").replace(/^-+|-+$/g,"");}
function hash(v:string){let h=0;for(const ch of v)h=(h*31+ch.charCodeAt(0))>>>0;return h;}
const pattern:readonly GeoWat001Difficulty[]=["Easy","Easy","Medium","Medium","Medium","Hard"];
export function buildGeoWatQl(key:string,name:string,variants:readonly GeoWat001VariantSeed[]):GeoWat001Ql{
 if(variants.length<4)throw new Error("QL too thin: "+key); const qlId=semanticQlId(key);
 const questions=Object.freeze(variants.map((v,i)=>{const correctIndex=(hash(qlId)+i)%4;return Object.freeze({
  questionId:"PENDING",qlId,qlName:name,difficulty:v.difficulty??pattern[i%pattern.length]!,stem:v.stem,
  options:placeGeoWatOptions(v.answer,v.distractors,correctIndex),correctIndex,canonicalAnswer:v.answer,
  explanation:v.explanation,sourceIds:Object.freeze([...(v.sourceIds??GEO_WAT_001_FOUNDATION_SOURCE_IDS)]),
  sourceFactIds:Object.freeze([v.sourceFactId]),reviewOnly:true as const,runtimeRegistered:false as const
 });}));
 return Object.freeze({qlKey:key,qlId,qlName:name,questions});
}
export function finalizeGeoWatCp(cpNo:number,qls:readonly GeoWat001Ql[]){
 const flat=qls.flatMap(q=>[...q.questions]);
 return Object.freeze(flat.map((q,i)=>Object.freeze({...q,questionId:"GEO-WAT-001-CP"+String(cpNo).padStart(3,"0")+"-Q"+String(i+1).padStart(3,"0")})));
}
export function auditGeoWatCp(cpNo:number,qls:readonly GeoWat001Ql[],questions:readonly GeoWat001Question[]){
 const issues:string[]=[]; const ids=new Set<string>(),stems=new Set<string>(),exps=new Set<string>(); const qlCounts:Record<string,number>={};
 for(const q of questions){if(ids.has(q.questionId))issues.push("DUPLICATE_ID:"+q.questionId);ids.add(q.questionId);
  const s=q.stem.replace(/\s+/g," ").trim().toLowerCase(),e=q.explanation.replace(/\s+/g," ").trim().toLowerCase();
  if(stems.has(s))issues.push("DUPLICATE_STEM:"+q.questionId);stems.add(s); if(exps.has(e))issues.push("DUPLICATE_EXPLANATION:"+q.questionId);exps.add(e);
  qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1; if(q.options.length!==4||new Set(q.options).size!==4)issues.push("OPTIONS:"+q.questionId);
  if(q.options[q.correctIndex]!==q.canonicalAnswer)issues.push("ANSWER:"+q.questionId); if(!q.sourceIds.length||!q.sourceFactIds.length)issues.push("PROVENANCE:"+q.questionId);
  if(!q.reviewOnly||q.runtimeRegistered)issues.push("LIFECYCLE:"+q.questionId);
  if(/best describes|\bbroadly\b|associated with|\bmainly\b|most strongly|strongest fit|strongest clue/i.test(q.stem))issues.push("MECHANICAL_STEM:"+q.questionId);
 }
 for(const ql of qls)if((qlCounts[ql.qlId]??0)<4)issues.push("QL_TOO_THIN:"+ql.qlId);
 return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),cpId:"GEO-WAT-001-CP"+String(cpNo).padStart(3,"0"),questionCount:questions.length,permanentQlCount:qls.length,stemCount:stems.size,explanationCount:exps.size,qlCounts:Object.freeze(qlCounts)});
}