import { MEN_CP_013_DEFINITIONS, generateMenCp013Question } from './discovery';
export function buildMenCp013DiscoveryReview(){
  const rows=[];
  for(const d of MEN_CP_013_DEFINITIONS){
    for(let target=0;target<4;target++){
      const index=target*5+(d.sourceBacked?4:0);
      const seed=`cp013-review:${d.id}:${String(index).padStart(3,'0')}`;
      const q=generateMenCp013Question(d.id,seed);
      if(q.correctIndex!==target)throw new Error(`${d.id}: expected position ${target}, got ${q.correctIndex}`);
      rows.push({definition:d,question:q});
    }
  }
  return rows;
}
export function auditMenCp013DiscoveryReview(){const rows=buildMenCp013DiscoveryReview();return{records:rows.length,uniqueStems:new Set(rows.map(r=>r.question.stem)).size,answerPositions:[0,1,2,3].map(p=>rows.filter(r=>r.question.correctIndex===p).length),sourceBackedRecords:rows.filter(r=>r.definition.sourceBacked).length};}
