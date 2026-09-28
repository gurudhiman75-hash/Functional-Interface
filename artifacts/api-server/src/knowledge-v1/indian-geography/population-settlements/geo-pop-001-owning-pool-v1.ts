import { GEO_POP_001_CP001_REVIEW_BATCH_V1 } from "./geo-pop-001-cp001-review-batch-v1";
import { GEO_POP_001_CP002_REVIEW_BATCH_V1 } from "./geo-pop-001-cp002-review-batch-v1";
import { GEO_POP_001_CP003_REVIEW_BATCH_V1 } from "./geo-pop-001-cp003-review-batch-v1";
import { GEO_POP_001_CP004_REVIEW_BATCH_V1 } from "./geo-pop-001-cp004-review-batch-v1";
import { GEO_POP_001_CP005_REVIEW_BATCH_V1 } from "./geo-pop-001-cp005-review-batch-v1";
import type { GeoPop001Question } from "./geo-pop-001-review-types";

export const GEO_POP_001_OWNING_POOL_V1: readonly GeoPop001Question[] = Object.freeze([
 ...GEO_POP_001_CP001_REVIEW_BATCH_V1,
 ...GEO_POP_001_CP002_REVIEW_BATCH_V1,
 ...GEO_POP_001_CP003_REVIEW_BATCH_V1,
 ...GEO_POP_001_CP004_REVIEW_BATCH_V1,
 ...GEO_POP_001_CP005_REVIEW_BATCH_V1,
]);

export function auditGeoPop001OwningPoolV1(){
 const issues:string[]=[],ids=new Set<string>(),stems=new Set<string>(),exps=new Set<string>(),qls=new Set<string>();
 for(const q of GEO_POP_001_OWNING_POOL_V1){
  if(ids.has(q.questionId))issues.push("DUPLICATE_ID:"+q.questionId);ids.add(q.questionId);
  const s=q.stem.replace(/\s+/g," ").trim().toLowerCase(),e=q.explanation.replace(/\s+/g," ").trim().toLowerCase();
  if(stems.has(s))issues.push("DUPLICATE_STEM:"+q.questionId);stems.add(s);
  if(exps.has(e))issues.push("DUPLICATE_EXPLANATION:"+q.questionId);exps.add(e);
  qls.add(q.qlId);
  if(!q.sourceIds.length||!q.sourceFactIds.length)issues.push("PROVENANCE:"+q.questionId);
  if(!q.reviewOnly||q.runtimeRegistered)issues.push("LIFECYCLE:"+q.questionId);
  if(/best describes|\bbroadly\b|associated with|\bmainly\b|most strongly|strongest fit|strongest clue/i.test(q.stem))issues.push("MECHANICAL_STEM:"+q.questionId);
 }
 if(GEO_POP_001_OWNING_POOL_V1.length!==318)issues.push("COUNT:"+GEO_POP_001_OWNING_POOL_V1.length);
 if(qls.size!==53)issues.push("QL_COUNT:"+qls.size);
 return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_POP_001_OWNING_POOL_V1.length,permanentQlCount:qls.size,stemCount:stems.size,explanationCount:exps.size});
}
