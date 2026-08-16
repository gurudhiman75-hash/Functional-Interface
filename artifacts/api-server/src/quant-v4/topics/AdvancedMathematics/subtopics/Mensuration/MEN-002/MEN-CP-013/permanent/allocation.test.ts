import { MEN_CP_013_DEFINITIONS } from '../../cp013-foundation/discovery';
import { MEN_CP_013_CANONICAL_CLUSTERS, MEN_CP_013_CANONICAL_SOURCE_IDS } from '../../cp013-foundation/merge-split-v2';
import { MEN_CP_013_PERMANENT_ALLOCATION, auditMenCp013PermanentAllocation } from './allocation';
function assert(c:unknown,m:string):asserts c{if(!c)throw new Error(m)}

const audit=auditMenCp013PermanentAllocation();
assert(MEN_CP_013_CANONICAL_CLUSTERS.length===15,`expected 15 canonical families, got ${MEN_CP_013_CANONICAL_CLUSTERS.length}`);
assert(MEN_CP_013_PERMANENT_ALLOCATION.length===15,'expected 15 permanent QLs');
assert(audit.firstQlId==='MEN-002-QL-163','first QL mismatch');
assert(audit.lastQlId==='MEN-002-QL-177','last QL mismatch');
assert(audit.uniqueQlCount===15&&audit.uniqueTemplateCount===15&&audit.uniqueSolveModeCount===15,'identity uniqueness failed');
assert(audit.contiguousQlRange,'QL range must be contiguous 163..177');
assert(audit.sourceMappingCount===34,'expected 34 mapped discovery sources');
assert(audit.englishImplementationFrozen===false,'English must remain unfrozen at allocation');
assert(audit.lifecycleLocked,'product lifecycle must remain locked');

const discoveryIds=MEN_CP_013_DEFINITIONS.map(row=>row.id).sort();
const canonicalIds=[...MEN_CP_013_CANONICAL_SOURCE_IDS].sort();
assert(discoveryIds.length===34&&new Set(discoveryIds).size===34,'discovery source inventory drift');
assert(canonicalIds.length===34&&new Set(canonicalIds).size===34,'every discovery source must map exactly once');
assert(JSON.stringify(discoveryIds)===JSON.stringify(canonicalIds),'canonical source coverage must exactly equal discovery inventory');

const axis=MEN_CP_013_PERMANENT_ALLOCATION.find(row=>row.clusterId==='INSCRIBED_AXIS_ALIGNED_CONTAINMENT');
assert(axis?.answerSemantic==='LENGTH_OR_RATIO','axis-aligned containment needs mixed dimension/ratio semantic');
const inverseArea=MEN_CP_013_PERMANENT_ALLOCATION.find(row=>row.clusterId==='DISPLACEMENT_INVERSE_BASE_AREA');
assert(inverseArea?.sourceIds.length===1&&inverseArea.sourceIds[0]==='CP013-W2-INVERSE-TANK-BASE-AREA','inverse base-area ownership drift');

console.log(JSON.stringify(audit,null,2));
