import type { GeoVeg001Difficulty, GeoVeg001Question } from "./geo-veg-001-review-types";
import { GEO_VEG_001_CP001_REVIEW_BATCH_V1 } from "./geo-veg-001-cp001-review-batch-v1";
import { GEO_VEG_001_CP002_REVIEW_BATCH_V1 } from "./geo-veg-001-cp002-review-batch-v1";
import { GEO_VEG_001_CP003_REVIEW_BATCH_V1 } from "./geo-veg-001-cp003-review-batch-v1";
import { GEO_VEG_001_CP004_REVIEW_BATCH_V1 } from "./geo-veg-001-cp004-review-batch-v1";
import { GEO_VEG_001_CP005_REVIEW_BATCH_V1 } from "./geo-veg-001-cp005-review-batch-v1";
import { GEO_VEG_001_CP006_REVIEW_BATCH_V1 } from "./geo-veg-001-cp006-review-batch-v1";
import { GEO_VEG_001_CP007_REVIEW_BATCH_V1 } from "./geo-veg-001-cp007-review-batch-v1";
import { GEO_VEG_001_CP008_REVIEW_BATCH_V1 } from "./geo-veg-001-cp008-review-batch-v1";
import { GEO_VEG_001_CP009_REVIEW_BATCH_V1 } from "./geo-veg-001-cp009-review-batch-v1";
import { GEO_VEG_001_CP010_REVIEW_BATCH_V1 } from "./geo-veg-001-cp010-review-batch-v1";
import { GEO_VEG_001_CP011_REVIEW_BATCH_V1 } from "./geo-veg-001-cp011-review-batch-v1";
import { GEO_VEG_001_CP012_REVIEW_BATCH_V1 } from "./geo-veg-001-cp012-review-batch-v1";
const ALL:readonly GeoVeg001Question[]=Object.freeze([
  ...GEO_VEG_001_CP001_REVIEW_BATCH_V1,
  ...GEO_VEG_001_CP002_REVIEW_BATCH_V1,
  ...GEO_VEG_001_CP003_REVIEW_BATCH_V1,
  ...GEO_VEG_001_CP004_REVIEW_BATCH_V1,
  ...GEO_VEG_001_CP005_REVIEW_BATCH_V1,
  ...GEO_VEG_001_CP006_REVIEW_BATCH_V1,
  ...GEO_VEG_001_CP007_REVIEW_BATCH_V1,
  ...GEO_VEG_001_CP008_REVIEW_BATCH_V1,
  ...GEO_VEG_001_CP009_REVIEW_BATCH_V1,
  ...GEO_VEG_001_CP010_REVIEW_BATCH_V1,
  ...GEO_VEG_001_CP011_REVIEW_BATCH_V1,
  ...GEO_VEG_001_CP012_REVIEW_BATCH_V1
]);
export function auditGeoVeg001ChapterV1(){
 const issues:string[]=[];const ids=new Set<string>();const qlCounts:Record<string,number>={};const difficultyCounts:Record<GeoVeg001Difficulty,number>={Easy:0,Medium:0,Hard:0};const answerPositions=[0,0,0,0];
 for(const q of ALL){
  if(ids.has(q.questionId))issues.push("DUPLICATE_ID:"+q.questionId);ids.add(q.questionId);
  qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;difficultyCounts[q.difficulty]+=1;answerPositions[q.correctIndex]+=1;
  if(q.options.length!==4||new Set(q.options).size!==4)issues.push("OPTIONS:"+q.questionId);
  if(q.options[q.correctIndex]!==q.canonicalAnswer)issues.push("ANSWER:"+q.questionId);
  if(!q.sourceIds.length||!q.sourceFactIds.length)issues.push("PROVENANCE:"+q.questionId);
  if(!q.reviewOnly||q.runtimeRegistered)issues.push("LIFECYCLE:"+q.questionId);
 }
 if(ALL.length!==648)issues.push("QUESTION_COUNT:"+ALL.length);
 for(let n=1;n<=108;n++){const id="GEO-VEG-001-QL-"+String(n).padStart(3,"0");if(qlCounts[id]!==6)issues.push("QL_COUNT:"+id+":"+(qlCounts[id]??0));}
 if(Object.keys(qlCounts).length!==108)issues.push("QL_COVERAGE:"+Object.keys(qlCounts).length);
 if(difficultyCounts.Easy!==216||difficultyCounts.Medium!==360||difficultyCounts.Hard!==72)issues.push("DIFFICULTY:"+JSON.stringify(difficultyCounts));
 if(answerPositions.join(",")!=="162,162,162,162")issues.push("ANSWER_POSITIONS:"+answerPositions.join(","));
 return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:ALL.length,qlCoverage:Object.keys(qlCounts).length,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});
}
