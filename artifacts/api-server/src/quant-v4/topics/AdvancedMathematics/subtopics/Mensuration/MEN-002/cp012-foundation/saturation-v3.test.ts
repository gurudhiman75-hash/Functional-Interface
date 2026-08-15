import {
  MEN_CP_012_SATURATION_V3_AUTHORITY,
  MEN_CP_012_SATURATION_V3_DEFINITIONS,
} from "./saturation-v3";
import {
  MEN_CP_012_SATURATION_V3_SAFE_AUTHORITY,
  generateMenCp012SaturationV3Safe,
} from "./saturation-v3-safe";

function assert(condition:unknown,message:string):asserts condition{if(!condition)throw new Error(message);}

assert(MEN_CP_012_SATURATION_V3_DEFINITIONS.length===12,`Expected 12 Wave 03 candidates, got ${MEN_CP_012_SATURATION_V3_DEFINITIONS.length}.`);
assert(new Set(MEN_CP_012_SATURATION_V3_DEFINITIONS.map((row)=>row.id)).size===12,"Wave 03 IDs must be unique.");
assert(new Set(MEN_CP_012_SATURATION_V3_DEFINITIONS.map((row)=>row.cluster)).size===8,"Expected eight saturation clusters.");
assert(MEN_CP_012_SATURATION_V3_DEFINITIONS.every((row)=>row.evidence.length>0),"Every Wave 03 candidate needs a source-evidence label.");

const dispositionCounts={
  retain:MEN_CP_012_SATURATION_V3_DEFINITIONS.filter((row)=>row.disposition==="RETAIN_FOR_MERGE_SPLIT").length,
  merge:MEN_CP_012_SATURATION_V3_DEFINITIONS.filter((row)=>row.disposition==="MERGE_AS_REPRESENTATION").length,
  boundary:MEN_CP_012_SATURATION_V3_DEFINITIONS.filter((row)=>row.disposition==="REASSIGN_BOUNDARY_REVIEW").length,
};
assert(dispositionCounts.retain===6,`Expected 6 retain rows, got ${dispositionCounts.retain}.`);
assert(dispositionCounts.merge===5,`Expected 5 representation-merge rows, got ${dispositionCounts.merge}.`);
assert(dispositionCounts.boundary===1,`Expected 1 boundary-review row, got ${dispositionCounts.boundary}.`);

let generated=0,rerouted=0,approximationStates=0;
for(const definition of MEN_CP_012_SATURATION_V3_DEFINITIONS){
  const positions=new Set<number>();
  const stems=new Set<string>();
  for(let index=0;index<64;index+=1){
    const seed=`proof-v3:${definition.id}:${String(index).padStart(3,"0")}`;
    const first=generateMenCp012SaturationV3Safe(definition.id,seed);
    const second=generateMenCp012SaturationV3Safe(definition.id,seed);
    assert(first.authority===MEN_CP_012_SATURATION_V3_AUTHORITY,`${definition.id}/${seed}: saturation authority mismatch.`);
    assert(first.safeAuthority===MEN_CP_012_SATURATION_V3_SAFE_AUTHORITY,`${definition.id}/${seed}: safe authority mismatch.`);
    assert(first.verification.valid,`${definition.id}/${seed}: verification failed.`);
    assert(first.stem===second.stem,`${definition.id}/${seed}: deterministic stem replay drift.`);
    assert(first.answer===second.answer,`${definition.id}/${seed}: deterministic answer replay drift.`);
    assert(first.constructionSeed===second.constructionSeed,`${definition.id}/${seed}: construction-seed replay drift.`);
    assert(first.correctIndex===second.correctIndex,`${definition.id}/${seed}: correct-index replay drift.`);
    assert(JSON.stringify(first.options.map((option)=>option.display))===JSON.stringify(second.options.map((option)=>option.display)),`${definition.id}/${seed}: option replay drift.`);
    assert(first.options.length===4,`${definition.id}/${seed}: expected four options.`);
    assert(new Set(first.options.map((option)=>option.display)).size===4,`${definition.id}/${seed}: option uniqueness failed.`);
    assert(first.options.filter((option)=>option.isCorrect).length===1,`${definition.id}/${seed}: expected one correct option.`);
    assert(first.options[first.correctIndex]?.display===first.answer,`${definition.id}/${seed}: displayed-answer parity failed.`);
    assert(first.explanation.steps.length===4,`${definition.id}/${seed}: expected four explanation steps.`);
    assert(first.permanentQlId===null,`${definition.id}/${seed}: permanent QL leaked into saturation.`);
    assert(!first.questionStudioDiscoverable&&!first.publiclyPublishable,`${definition.id}/${seed}: product gate leaked.`);
    if(first.constructionSeed!==seed)rerouted+=1;
    if(first.approximation)approximationStates+=1;
    positions.add(first.correctIndex);stems.add(first.stem);generated+=1;
  }
  assert(positions.size===4,`${definition.id}: A/B/C/D reachability failed.`);
  assert(stems.size>=4,`${definition.id}: saturation must expose at least four distinct stems; got ${stems.size}.`);
}

console.log(JSON.stringify({
  authority:MEN_CP_012_SATURATION_V3_AUTHORITY,
  safeAuthority:MEN_CP_012_SATURATION_V3_SAFE_AUTHORITY,
  candidateCount:MEN_CP_012_SATURATION_V3_DEFINITIONS.length,
  deterministicPackages:generated,
  reroutedConstructionCount:rerouted,
  approximationStates,
  dispositionCounts,
  permanentQlCount:0,
  productLocked:true,
},null,2));
