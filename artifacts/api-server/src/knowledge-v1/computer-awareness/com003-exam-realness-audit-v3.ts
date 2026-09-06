import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V8 } from "./com003-review-synthesis-v8";

const FAMILIES = ["DIRECT_RECALL","FUNCTIONAL_APPLICATION","EXAMPLE_RECOGNITION","CONTRAST_DISCRIMINATION"] as const;
const BAD = [/for office productivity software/i,/within a desktop office suite/i,/principal task:/i,/select the operator used for/i,/\ba Excel\b/i,/\ba Office\b/i,/\bused to inserts\b/i,/\bused to copies\b/i,/\bused to cuts\b/i,/\bused to saves\b/i,/\bused to opens\b/i];
const norm=(s:string)=>s.trim().replace(/\s+/g," ").toLowerCase();
const wc=(s:string)=>s.trim().split(/\s+/).filter(Boolean).length;

export function auditCom003ExamRealnessV3(){
 const blockers:string[]=[]; const advisories:string[]=[]; const corpus=COM003_ENGLISH_REVIEW_CORPUS_V8;
 for(const q of corpus){
  const stem=q.stem.trim(); const n=wc(stem);
  if(!stem.endsWith("?")) blockers.push(`NOT_QUESTION:${q.questionId}`);
  if(n<5) blockers.push(`TOO_THIN:${q.questionId}:${n}`);
  if(n>42) blockers.push(`TOO_WORDY:${q.questionId}:${n}`); else if(n>30) advisories.push(`WORDY:${q.questionId}:${n}`);
  for(const p of BAD) if(p.test(stem)||p.test(q.explanation)) blockers.push(`EDITORIAL_DEFECT:${q.questionId}:${p.source}`);
  if(q.versionScoped && /SHORTCUT|SLIDESHOW/i.test(q.surfaceMode) && !/Windows desktop/i.test(stem)) blockers.push(`VERSION_CONTEXT_MISSING:${q.questionId}`);
  if(q.stemAuthority!=="COM003_V8_DEEP_EXAM_SURFACE_AUTHORITY") blockers.push(`WRONG_AUTHORITY:${q.questionId}`);
 }
 const seen=new Map<string,string[]>(); for(const q of corpus){const k=norm(q.stem);seen.set(k,[...(seen.get(k)??[]),q.questionId]);}
 const dup=[...seen.values()].filter(v=>v.length>1); if(dup.length) blockers.push(`DUPLICATE_STEMS:${dup.reduce((a,v)=>a+v.length-1,0)}`);
 const coverage=COM003_PERMANENT_QLS.map(ql=>{
  const qs=corpus.filter(q=>q.qlId===ql.qlId); if(qs.length!==12) blockers.push(`QL_COUNT:${ql.qlId}:${qs.length}`);
  const familyCounts=Object.fromEntries(FAMILIES.map(f=>[f,qs.filter(q=>q.examSurfaceFamily===f).length]));
  for(const f of FAMILIES) if(familyCounts[f]!==3) blockers.push(`FAMILY_COUNT:${ql.qlId}:${f}:${familyCounts[f]}`);
  if(new Set(qs.map(q=>norm(q.stem))).size!==qs.length) blockers.push(`QL_DUPLICATE:${ql.qlId}`);
  return {qlId:ql.qlId,familyCounts};
 });
 return {valid:blockers.length===0,questionCount:corpus.length,qlCount:coverage.length,coverage,blockerCount:blockers.length,advisoryCount:advisories.length,blockers,advisories,status:blockers.length===0?"DEEP_EXAM_SURFACE_REVIEW_CANDIDATE" as const:"DEEP_EXAM_SURFACE_REMEDIATION_REQUIRED" as const,contentFrozen:false,localizationFrozen:false,questionStudioReplacementAuthorized:false};
}
export const COM003_EXAM_REALNESS_AUDIT_V3=auditCom003ExamRealnessV3();
