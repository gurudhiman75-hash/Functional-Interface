import { MEN_CP_013_PERMANENT_ALLOCATION } from './allocation';
import { generateMenCp013PermanentEnglishQuestionFromSourceV4 } from './runtime-v4';
function positionsFor(sourceCount:number){if(sourceCount===5)return [0,1,2,3,0] as const;if(sourceCount===7)return [0,1,2,3,1,2,3] as const;return [0,1,2,3] as const;}
export function buildMenCp013PermanentEnglishReviewV4(){
 const rows=[];
 for(const allocation of MEN_CP_013_PERMANENT_ALLOCATION){
  const count=Math.max(4,allocation.sourceIds.length),positions=positionsFor(allocation.sourceIds.length);
  for(let slot=0;slot<count;slot++){
   const sourceId=allocation.sourceIds[slot%allocation.sourceIds.length]!,correctIndex=positions[slot]!,trailing=correctIndex+4*slot;
   const question=generateMenCp013PermanentEnglishQuestionFromSourceV4(allocation.qlId,sourceId,`cp013-v4-review:${allocation.qlId}:${String(trailing).padStart(3,'0')}`);
   if(question.correctIndex!==correctIndex)throw new Error(`${allocation.qlId}/${sourceId}: V4 review position drift`);
   rows.push({allocation,sourceId,question});
  }
 }
 return rows;
}
export function auditMenCp013PermanentEnglishReviewV4(){
 const rows=buildMenCp013PermanentEnglishReviewV4(),inverse=rows.filter(row=>row.question.clusterId==='DISPLACEMENT_INVERSE_BASE_AREA');
 return {records:rows.length,uniqueStems:new Set(rows.map(row=>row.question.stem)).size,uniqueSources:new Set(rows.map(row=>row.sourceId)).size,answerPositions:[0,1,2,3].map(p=>rows.filter(row=>row.question.correctIndex===p).length),inverseBaseAreaAnswers:new Set(inverse.map(row=>row.question.answer)).size,inverseBaseAreaRises:new Set(inverse.map(row=>/by ([\d.]+) cm/.exec(row.question.stem)?.[1])).size};
}
