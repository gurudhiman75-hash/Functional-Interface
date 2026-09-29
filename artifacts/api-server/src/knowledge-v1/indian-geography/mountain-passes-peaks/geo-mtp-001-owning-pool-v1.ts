import { GEO_MTP_001_CP001_REVIEW_BATCH_V1, GEO_MTP_001_CP002_REVIEW_BATCH_V1, GEO_MTP_001_CP003_REVIEW_BATCH_V1 } from "./geo-mtp-001-cp001-003-review-batch-v1";
import type { GeoMtp001Question } from "./geo-mtp-001-review-types";
export const GEO_MTP_001_OWNING_POOL_V1:readonly GeoMtp001Question[]=Object.freeze([
 ...GEO_MTP_001_CP001_REVIEW_BATCH_V1,...GEO_MTP_001_CP002_REVIEW_BATCH_V1,...GEO_MTP_001_CP003_REVIEW_BATCH_V1,
]);
export function auditGeoMtp001OwningPoolV1(){
 const issues:string[]=[],ids=new Set<string>(),stems=new Set<string>(),exps=new Set<string>(),qls=new Set<string>();
 for(const q of GEO_MTP_001_OWNING_POOL_V1){
  if(ids.has(q.questionId))issues.push("DUPLICATE_ID:"+q.questionId);ids.add(q.questionId);qls.add(q.qlId);
  const s=q.stem.replace(/\s+/g," ").trim().toLowerCase(),e=q.explanation.replace(/\s+/g," ").trim().toLowerCase();
  if(stems.has(s))issues.push("DUPLICATE_STEM:"+q.questionId);stems.add(s);
  if(exps.has(e))issues.push("DUPLICATE_EXPLANATION:"+q.questionId);exps.add(e);
  if(!q.reviewOnly||q.runtimeRegistered)issues.push("LIFECYCLE:"+q.questionId);
 }
 if(GEO_MTP_001_OWNING_POOL_V1.length!==75)issues.push("COUNT:"+GEO_MTP_001_OWNING_POOL_V1.length);
 if(qls.size!==15)issues.push("QL_COUNT:"+qls.size);
 return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_MTP_001_OWNING_POOL_V1.length,permanentQlCount:qls.size,stemCount:stems.size,explanationCount:exps.size});
}