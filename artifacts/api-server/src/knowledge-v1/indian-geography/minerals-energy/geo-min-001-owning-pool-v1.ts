import { GEO_MIN_001_CP001_REVIEW_BATCH_V1 } from "./geo-min-001-cp001-review-batch-v1";
import { GEO_MIN_001_CP002_REVIEW_BATCH_V1 } from "./geo-min-001-cp002-review-batch-v1";
import { GEO_MIN_001_CP003_REVIEW_BATCH_V1 } from "./geo-min-001-cp003-review-batch-v1";
import { GEO_MIN_001_CP004_REVIEW_BATCH_V1 } from "./geo-min-001-cp004-review-batch-v1";
import { GEO_MIN_001_CP005_REVIEW_BATCH_V1 } from "./geo-min-001-cp005-review-batch-v1";
import { GEO_MIN_001_CP006_REVIEW_BATCH_V1 } from "./geo-min-001-cp006-review-batch-v1";
import { GEO_MIN_001_CP007_REVIEW_BATCH_V1 } from "./geo-min-001-cp007-review-batch-v1";
import { GEO_MIN_001_CP008_REVIEW_BATCH_V1 } from "./geo-min-001-cp008-review-batch-v1";
import { GEO_MIN_001_CP009_REVIEW_BATCH_V1 } from "./geo-min-001-cp009-review-batch-v1";
import { GEO_MIN_001_CP010_REVIEW_BATCH_V1 } from "./geo-min-001-cp010-review-batch-v1";
import { GEO_MIN_001_CP011_REVIEW_BATCH_V1 } from "./geo-min-001-cp011-review-batch-v1";
import { GEO_MIN_001_CP012_REVIEW_BATCH_V1 } from "./geo-min-001-cp012-review-batch-v1";

export const GEO_MIN_001_OWNING_POOL_V1 = Object.freeze([
  ...GEO_MIN_001_CP001_REVIEW_BATCH_V1,
  ...GEO_MIN_001_CP002_REVIEW_BATCH_V1,
  ...GEO_MIN_001_CP003_REVIEW_BATCH_V1,
  ...GEO_MIN_001_CP004_REVIEW_BATCH_V1,
  ...GEO_MIN_001_CP005_REVIEW_BATCH_V1,
  ...GEO_MIN_001_CP006_REVIEW_BATCH_V1,
  ...GEO_MIN_001_CP007_REVIEW_BATCH_V1,
  ...GEO_MIN_001_CP008_REVIEW_BATCH_V1,
  ...GEO_MIN_001_CP009_REVIEW_BATCH_V1,
  ...GEO_MIN_001_CP010_REVIEW_BATCH_V1,
  ...GEO_MIN_001_CP011_REVIEW_BATCH_V1,
  ...GEO_MIN_001_CP012_REVIEW_BATCH_V1
]);

export function auditGeoMin001OwningPoolV1() {
  const issues:string[]=[];
  const ids=new Set<string>();
  const stems=new Set<string>();
  const explanations=new Set<string>();
  const qls=new Set<string>();
  const qlCounts:Record<string,number>={};
  const difficulties={Easy:0,Medium:0,Hard:0};

  for(const q of GEO_MIN_001_OWNING_POOL_V1){
    if(ids.has(q.questionId)) issues.push("DUPLICATE_ID:"+q.questionId);
    ids.add(q.questionId);
    const stem=q.stem.replace(/\s+/g," ").trim().toLowerCase();
    const exp=q.explanation.replace(/\s+/g," ").trim().toLowerCase();
    if(stems.has(stem)) issues.push("DUPLICATE_STEM:"+q.questionId);
    if(explanations.has(exp)) issues.push("DUPLICATE_EXPLANATION:"+q.questionId);
    stems.add(stem); explanations.add(exp); qls.add(q.qlId);
    qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;
    difficulties[q.difficulty]+=1;
    if(!q.reviewOnly || q.runtimeRegistered) issues.push("LIFECYCLE:"+q.questionId);
  }

  for(const [qlId,count] of Object.entries(qlCounts)){
    if(count<4) issues.push("QL_TOO_THIN:"+qlId+":"+count);
  }
  if(stems.size!==GEO_MIN_001_OWNING_POOL_V1.length) issues.push("STEM_COUNT:"+stems.size);
  if(explanations.size!==GEO_MIN_001_OWNING_POOL_V1.length) issues.push("EXPLANATION_COUNT:"+explanations.size);

  return Object.freeze({
    valid:issues.length===0,
    issues:Object.freeze(issues),
    questionCount:GEO_MIN_001_OWNING_POOL_V1.length,
    permanentQlCount:qls.size,
    stemCount:stems.size,
    explanationCount:explanations.size,
    qlCounts:Object.freeze(qlCounts),
    difficultyCounts:Object.freeze(difficulties),
  });
}
