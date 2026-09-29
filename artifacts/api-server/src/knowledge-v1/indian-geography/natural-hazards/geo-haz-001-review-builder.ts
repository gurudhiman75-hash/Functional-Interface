import { placeOptions, type GeoHaz001Difficulty, type GeoHaz001Question } from "./geo-haz-001-review-types";
export type Variant=Readonly<{stem:string;answer:string;distractors:readonly [string,string,string];explanation:string;sourceFactId:string;sourceIds?:readonly string[];difficulty?:GeoHaz001Difficulty;}>;
export type Ql=Readonly<{qlKey:string;qlId:string;qlName:string;questions:readonly GeoHaz001Question[]}>;
const DEFAULT_SOURCES=["NDMA-INDIA","IMD-INDIA","CWC-INDIA","INCOIS-INDIA","NCERT-GEOGRAPHY"] as const;
function qlId(key:string){return "GEO-HAZ-001-QL-"+key.trim().toUpperCase().replace(/[^A-Z0-9]+/g,"-").replace(/^-+|-+$/g,"");}
function hash(v:string){let h=0;for(const ch of v)h=(h*31+ch.charCodeAt(0))>>>0;return h;}
const pattern:readonly GeoHaz001Difficulty[]=["Easy","Easy","Medium","Medium","Hard"];
export function buildQl(key:string,name:string,variants:readonly Variant[]):Ql{
 if(variants.length<4)throw new Error("QL too thin: "+key); const id=qlId(key);
 const questions=Object.freeze(variants.map((v,i)=>{const correctIndex=(hash(id)+i)%4; return Object.freeze({
  questionId:"PENDING",qlId:id,qlName:name,difficulty:v.difficulty??pattern[i%pattern.length]!,stem:v.stem,
  options:placeOptions(v.answer,v.distractors,correctIndex),correctIndex,canonicalAnswer:v.answer,explanation:v.explanation,
  sourceIds:Object.freeze([...(v.sourceIds??DEFAULT_SOURCES)]),sourceFactIds:Object.freeze([v.sourceFactId]),
  reviewOnly:true as const,runtimeRegistered:false as const
 });}));
 return Object.freeze({qlKey:key,qlId:id,qlName:name,questions});
}
export function finalizeCp(cpNo:number,qls:readonly Ql[]){
 const flat=qls.flatMap(q=>[...q.questions]);
 return Object.freeze(flat.map((q,i)=>Object.freeze({...q,questionId:"GEO-HAZ-001-CP"+String(cpNo).padStart(3,"0")+"-Q"+String(i+1).padStart(3,"0")})));
}
export function auditCp(cpNo:number,qls:readonly Ql[],questions:readonly GeoHaz001Question[]){
 const issues:string[]=[]; const ids=new Set<string>(),stems=new Set<string>(),exps=new Set<string>(),qlCounts:Record<string,number>={};
 for(const q of questions){if(ids.has(q.questionId))issues.push("DUPLICATE_ID:"+q.questionId);ids.add(q.questionId);
  const s=q.stem.replace(/\s+/g," ").trim().toLowerCase(),e=q.explanation.replace(/\s+/g," ").trim().toLowerCase();
  if(stems.has(s))issues.push("DUPLICATE_STEM:"+q.questionId);stems.add(s); if(exps.has(e))issues.push("DUPLICATE_EXPLANATION:"+q.questionId);exps.add(e);
  qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;if(q.options.length!==4||new Set(q.options).size!==4)issues.push("OPTIONS:"+q.questionId);
  if(q.options[q.correctIndex]!==q.canonicalAnswer)issues.push("ANSWER:"+q.questionId); if(!q.sourceIds.length||!q.sourceFactIds.length)issues.push("PROVENANCE:"+q.questionId);
  if(!q.reviewOnly||q.runtimeRegistered)issues.push("LIFECYCLE:"+q.questionId);
  if(/best describes|\bbroadly\b|associated with|\bmainly\b|most strongly|strongest fit|strongest clue/i.test(q.stem))issues.push("MECHANICAL_STEM:"+q.questionId);
 }
 return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),cpId:"GEO-HAZ-001-CP"+String(cpNo).padStart(3,"0"),questionCount:questions.length,permanentQlCount:qls.length,stemCount:stems.size,explanationCount:exps.size,qlCounts:Object.freeze(qlCounts)});
}