import { GEO_IND_001_CP001_REVIEW_BATCH_V1 } from "./geo-ind-001-cp001-review-batch-v1";
import { GEO_IND_001_CP002_REVIEW_BATCH_V1 } from "./geo-ind-001-cp002-review-batch-v1";
import { GEO_IND_001_CP003_REVIEW_BATCH_V1 } from "./geo-ind-001-cp003-review-batch-v1";
import { GEO_IND_001_CP004_REVIEW_BATCH_V1 } from "./geo-ind-001-cp004-review-batch-v1";
import { GEO_IND_001_CP005_REVIEW_BATCH_V1 } from "./geo-ind-001-cp005-review-batch-v1";
import { GEO_IND_001_CP006_REVIEW_BATCH_V1 } from "./geo-ind-001-cp006-review-batch-v1";
import { GEO_IND_001_CP007_REVIEW_BATCH_V1 } from "./geo-ind-001-cp007-review-batch-v1";
import { GEO_IND_001_CP008_REVIEW_BATCH_V1 } from "./geo-ind-001-cp008-review-batch-v1";
import { GEO_IND_001_CP009_REVIEW_BATCH_V1 } from "./geo-ind-001-cp009-review-batch-v1";
import { GEO_IND_001_CP010_REVIEW_BATCH_V1 } from "./geo-ind-001-cp010-review-batch-v1";
import { GEO_IND_001_CP011_REVIEW_BATCH_V1 } from "./geo-ind-001-cp011-review-batch-v1";
import { GEO_IND_001_CP013_REVIEW_BATCH_V1 } from "./geo-ind-001-cp013-review-batch-v1";
import type { GeoInd001Question } from "./geo-ind-001-review-types";

export const GEO_IND_001_OWNING_POOL_V1: readonly GeoInd001Question[] = Object.freeze([
 ...GEO_IND_001_CP001_REVIEW_BATCH_V1,
 ...GEO_IND_001_CP002_REVIEW_BATCH_V1,
 ...GEO_IND_001_CP003_REVIEW_BATCH_V1,
 ...GEO_IND_001_CP004_REVIEW_BATCH_V1,
 ...GEO_IND_001_CP005_REVIEW_BATCH_V1,
 ...GEO_IND_001_CP006_REVIEW_BATCH_V1,
 ...GEO_IND_001_CP007_REVIEW_BATCH_V1,
 ...GEO_IND_001_CP008_REVIEW_BATCH_V1,
 ...GEO_IND_001_CP009_REVIEW_BATCH_V1,
 ...GEO_IND_001_CP010_REVIEW_BATCH_V1,
 ...GEO_IND_001_CP011_REVIEW_BATCH_V1,
 ...GEO_IND_001_CP013_REVIEW_BATCH_V1,
]);

export function auditGeoInd001OwningPoolV1(){
 const issues:string[]=[]; const ids=new Set<string>(), stems=new Set<string>(), exps=new Set<string>(), qls=new Set<string>();
 for(const q of GEO_IND_001_OWNING_POOL_V1){
   if(ids.has(q.questionId)) issues.push("DUPLICATE_ID:"+q.questionId); ids.add(q.questionId);
   const s=q.stem.replace(/\s+/g," ").trim().toLowerCase(), e=q.explanation.replace(/\s+/g," ").trim().toLowerCase();
   if(stems.has(s)) issues.push("DUPLICATE_STEM:"+q.questionId); stems.add(s);
   if(exps.has(e)) issues.push("DUPLICATE_EXPLANATION:"+q.questionId); exps.add(e);
   qls.add(q.qlId);
   if(!q.sourceIds.length||!q.sourceFactIds.length) issues.push("PROVENANCE:"+q.questionId);
   if(!q.reviewOnly||q.runtimeRegistered) issues.push("LIFECYCLE:"+q.questionId);
   if(/best describes|\bbroad(?:ly)?\b|associated with|\bmainly\b|most strongly|strongest fit/i.test(q.stem)) issues.push("MECHANICAL_STEM:"+q.questionId);
 }
 if(GEO_IND_001_OWNING_POOL_V1.length!==690) issues.push("COUNT:"+GEO_IND_001_OWNING_POOL_V1.length);
 if(qls.size!==115) issues.push("QL_COUNT:"+qls.size);
 return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_IND_001_OWNING_POOL_V1.length,permanentQlCount:qls.size,stemCount:stems.size,explanationCount:exps.size});
}
