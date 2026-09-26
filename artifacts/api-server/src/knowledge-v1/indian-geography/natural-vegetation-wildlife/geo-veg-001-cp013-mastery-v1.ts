import { placeGeoVegOptions, type GeoVeg001Difficulty, type GeoVeg001Question } from "./geo-veg-001-review-types";
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

const ALL: readonly GeoVeg001Question[] = Object.freeze([
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

const META_STEM=/\ba question\b|\bquestion gives\b|\bwhich clue\b|\bstrongest match\b|\bwhich conclusion\b|\bbest fit\b|\bsafest for static gk\b|\ba student\b/i;

const qlIds=Array.from({length:108},(_,i)=>"GEO-VEG-001-QL-"+String(i+1).padStart(3,"0"));
const byQl=new Map<string,GeoVeg001Question[]>();
for(const q of ALL){const list=byQl.get(q.qlId)??[];list.push(q);byQl.set(q.qlId,list);}

const hardQls=qlIds.filter(id=>(byQl.get(id)??[]).some(q=>q.difficulty==="Hard"&&!META_STEM.test(q.stem))).slice(0,12);
const hardSet=new Set(hardQls);
const easyQls=qlIds.filter(id=>!hardSet.has(id)&&(byQl.get(id)??[]).some(q=>q.difficulty==="Easy"&&!META_STEM.test(q.stem))).slice(0,36);
const easySet=new Set(easyQls);
const mediumQls=qlIds.filter(id=>!hardSet.has(id)&&!easySet.has(id));
if(hardQls.length!==12||easyQls.length!==36||mediumQls.length!==60)throw new Error("Unable to allocate mastery difficulty groups");
for(const id of mediumQls){if(!(byQl.get(id)??[]).some(q=>q.difficulty==="Medium"&&!META_STEM.test(q.stem)))throw new Error("Missing meta-free medium candidate for "+id);}

function targetDifficulty(id:string):GeoVeg001Difficulty{return hardSet.has(id)?"Hard":easySet.has(id)?"Easy":"Medium";}
function chooseCandidate(id:string,difficulty:GeoVeg001Difficulty){
 const matches=(byQl.get(id)??[]).filter(q=>q.difficulty===difficulty&&!META_STEM.test(q.stem));
 if(!matches.length)throw new Error("No meta-free "+difficulty+" candidate for "+id);
 return matches[0];
}

export const GEO_VEG_001_CP013_MASTERY_V1:readonly GeoVeg001Question[]=Object.freeze(
 qlIds.map((qlId,index)=>{
  const difficulty=targetDifficulty(qlId);const src=chooseCandidate(qlId,difficulty);const correctIndex=index%4;
  const distractors=src.options.filter((_,i)=>i!==src.correctIndex);
  return Object.freeze({
   questionId:`GEO-VEG-001-CP013-Q${String(index+1).padStart(3,"0")}`,
   qlId:src.qlId,qlName:src.qlName,difficulty,stem:src.stem,
   options:placeGeoVegOptions(src.canonicalAnswer,distractors,correctIndex),correctIndex,canonicalAnswer:src.canonicalAnswer,
   explanation:src.explanation,sourceIds:src.sourceIds,sourceFactIds:src.sourceFactIds,reviewOnly:true as const,runtimeRegistered:false as const
  });
 })
);

export function auditGeoVeg001Cp013MasteryV1(){
 const issues:string[]=[];const qls=new Set<string>();const stems=new Set<string>();const explanations=new Set<string>();const difficultyCounts:Record<GeoVeg001Difficulty,number>={Easy:0,Medium:0,Hard:0};const answerPositions=[0,0,0,0];
 for(const q of GEO_VEG_001_CP013_MASTERY_V1){
  if(qls.has(q.qlId))issues.push("DUPLICATE_QL:"+q.qlId);qls.add(q.qlId);
  const st=q.stem.replace(/\s+/g," ").trim().toLowerCase();if(stems.has(st))issues.push("DUPLICATE_STEM:"+q.questionId);stems.add(st);
  const ex=q.explanation.replace(/\s+/g," ").trim().toLowerCase();if(explanations.has(ex))issues.push("DUPLICATE_EXPLANATION:"+q.questionId);explanations.add(ex);
  difficultyCounts[q.difficulty]+=1;answerPositions[q.correctIndex]+=1;
  if(q.options.length!==4||new Set(q.options).size!==4)issues.push("OPTIONS:"+q.questionId);
  if(q.options[q.correctIndex]!==q.canonicalAnswer)issues.push("ANSWER:"+q.questionId);
  if(!q.reviewOnly||q.runtimeRegistered)issues.push("LIFECYCLE:"+q.questionId);
  if(META_STEM.test(q.stem))issues.push("META_STEM:"+q.questionId);
 }
 if(GEO_VEG_001_CP013_MASTERY_V1.length!==108)issues.push("COUNT:"+GEO_VEG_001_CP013_MASTERY_V1.length);
 if(qls.size!==108)issues.push("QL_COVERAGE:"+qls.size);
 if(difficultyCounts.Easy!==36||difficultyCounts.Medium!==60||difficultyCounts.Hard!==12)issues.push("DIFFICULTY:"+JSON.stringify(difficultyCounts));
 if(answerPositions.join(",")!=="27,27,27,27")issues.push("ANSWER_POSITIONS:"+answerPositions.join(","));
 if(stems.size!==108)issues.push("STEM_COUNT:"+stems.size);if(explanations.size!==108)issues.push("EXPLANATION_COUNT:"+explanations.size);
 return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_VEG_001_CP013_MASTERY_V1.length,qlCoverage:qls.size,stemCount:stems.size,explanationCount:explanations.size,difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions),hardQls:Object.freeze(hardQls),easyQls:Object.freeze(easyQls),mediumQls:Object.freeze(mediumQls)});
}
