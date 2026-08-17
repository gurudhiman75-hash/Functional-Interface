import { MEN_CP_013_PERMANENT_ALLOCATION } from './allocation';
import { generateMenCp013PermanentEnglishQuestionFromSourceV2 } from './runtime-v2';

function positionsFor(sourceCount:number){
  if(sourceCount===5)return [0,1,2,3,0] as const;
  if(sourceCount===7)return [0,1,2,3,1,2,3] as const;
  return [0,1,2,3] as const;
}

export function buildMenCp013PermanentEnglishReviewV1(){
  const rows=[];
  for(const allocation of MEN_CP_013_PERMANENT_ALLOCATION){
    const positions=positionsFor(allocation.sourceIds.length);
    const count=Math.max(4,allocation.sourceIds.length);
    for(let slot=0;slot<count;slot++){
      const sourceId=allocation.sourceIds[slot%allocation.sourceIds.length]!;
      const correctIndex=positions[slot]!;
      const trailing=correctIndex+4*slot;
      const seed=`cp013-permanent-review:${allocation.qlId}:${String(trailing).padStart(3,'0')}`;
      const question=generateMenCp013PermanentEnglishQuestionFromSourceV2(allocation.qlId,sourceId,seed);
      if(question.correctIndex!==correctIndex)throw new Error(`${allocation.qlId}/${sourceId}: review position drift`);
      rows.push({allocation,sourceId,question});
    }
  }
  return rows;
}

export function auditMenCp013PermanentEnglishReviewV1(){
  const rows=buildMenCp013PermanentEnglishReviewV1();
  return {
    records:rows.length,
    uniqueStems:new Set(rows.map(row=>row.question.stem)).size,
    uniqueSources:new Set(rows.map(row=>row.sourceId)).size,
    answerPositions:[0,1,2,3].map(p=>rows.filter(row=>row.question.correctIndex===p).length),
    inverseBaseAreaAnswers:new Set(rows.filter(row=>row.question.clusterId==='DISPLACEMENT_INVERSE_BASE_AREA').map(row=>row.question.answer)).size,
  } as const;
}
