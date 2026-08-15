import { MEN_CP_012_SATURATION_V3_DEFINITIONS } from "./saturation-v3";
import { generateMenCp012SaturationV3Safe } from "./saturation-v3-safe";

export function buildMenCp012SaturationV3Review(){
  const review:Array<ReturnType<typeof generateMenCp012SaturationV3Safe>>=[];
  const usedStems=new Set<string>();
  for(const definition of MEN_CP_012_SATURATION_V3_DEFINITIONS){
    for(let target=0;target<4;target+=1){
      let selected:ReturnType<typeof generateMenCp012SaturationV3Safe>|null=null;
      for(let attempt=target;attempt<8192;attempt+=4){
        const seed=`review-v3:${definition.id}:${attempt}`;
        const q=generateMenCp012SaturationV3Safe(definition.id,seed);
        if(q.correctIndex!==target||usedStems.has(q.stem))continue;
        selected=q;break;
      }
      if(!selected)throw new Error(`Could not select Wave 03 review state for ${definition.id}/position-${target}.`);
      usedStems.add(selected.stem);review.push(selected);
    }
  }
  return review;
}

export function auditMenCp012SaturationV3Review(){
  const review=buildMenCp012SaturationV3Review();
  const counts=[0,0,0,0];for(const q of review)counts[q.correctIndex]+=1;
  return {
    reviewRecordCount:review.length,
    uniqueStemCount:new Set(review.map((q)=>q.stem)).size,
    correctPositions:{A:counts[0],B:counts[1],C:counts[2],D:counts[3]},
    evidenceLabelCount:new Set(review.map((q)=>q.evidence)).size,
    approximationRecordCount:review.filter((q)=>q.approximation).length,
    allVerified:review.every((q)=>q.verification.valid),
    allUniqueOptions:review.every((q)=>new Set(q.options.map((o)=>o.display)).size===4),
    productLocked:review.every((q)=>q.permanentQlId===null&&!q.questionStudioDiscoverable&&!q.publiclyPublishable),
  } as const;
}
