import { GEO_TRN_001_CP001_REVIEW_BATCH_V1 } from "./geo-trn-001-cp001-review-batch-v1";
import { GEO_TRN_001_CP002_REVIEW_BATCH_V1 } from "./geo-trn-001-cp002-review-batch-v1";
import { GEO_TRN_001_CP003_REVIEW_BATCH_V1 } from "./geo-trn-001-cp003-review-batch-v1";
import { GEO_TRN_001_CP004_REVIEW_BATCH_V1 } from "./geo-trn-001-cp004-review-batch-v1";
import { GEO_TRN_001_CP005_REVIEW_BATCH_V1 } from "./geo-trn-001-cp005-review-batch-v1";
import type { GeoTrn001Question } from "./geo-trn-001-review-types";

export const GEO_TRN_001_OWNING_POOL_V1: readonly GeoTrn001Question[] = Object.freeze([
 ...GEO_TRN_001_CP001_REVIEW_BATCH_V1,
 ...GEO_TRN_001_CP002_REVIEW_BATCH_V1,
 ...GEO_TRN_001_CP003_REVIEW_BATCH_V1,
 ...GEO_TRN_001_CP004_REVIEW_BATCH_V1,
 ...GEO_TRN_001_CP005_REVIEW_BATCH_V1,
]);

export function auditGeoTrn001OwningPoolV1(){
 const issues:string[]=[], ids=new Set<string>(),stems=new Set<string>(),exps=new Set<string>(),qls=new Set<string>();
 for(const q of GEO_TRN_001_OWNING_POOL_V1){
  if(ids.has(q.questionId))issues.push("DUPLICATE_ID:"+q.questionId);ids.add(q.questionId);
  const s=q.stem.replace(/\s+/g," ").trim().toLowerCase(),e=q.explanation.replace(/\s+/g," ").trim().toLowerCase();
  if(stems.has(s))issues.push("DUPLICATE_STEM:"+q.questionId);stems.add(s);
  if(exps.has(e))issues.push("DUPLICATE_EXPLANATION:"+q.questionId);exps.add(e);
  qls.add(q.qlId);
  if(!q.sourceIds.length||!q.sourceFactIds.length)issues.push("PROVENANCE:"+q.questionId);
  if(!q.reviewOnly||q.runtimeRegistered)issues.push("LIFECYCLE:"+q.questionId);
  if(/best describes|\bbroadly\b|\bbroad\b(?!\s+gauge)|associated with|\bmainly\b|most strongly|strongest fit|strongest choice/i.test(q.stem))issues.push("MECHANICAL_STEM:"+q.questionId);
 }
 if(GEO_TRN_001_OWNING_POOL_V1.length!==330)issues.push("COUNT:"+GEO_TRN_001_OWNING_POOL_V1.length);
 if(qls.size!==55)issues.push("QL_COUNT:"+qls.size);
 return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_TRN_001_OWNING_POOL_V1.length,permanentQlCount:qls.size,stemCount:stems.size,explanationCount:exps.size});
}
