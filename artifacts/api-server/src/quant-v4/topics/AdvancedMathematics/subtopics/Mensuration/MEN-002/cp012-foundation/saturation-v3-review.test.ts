import { MEN_CP_012_SATURATION_V3_DEFINITIONS } from "./saturation-v3";
import { auditMenCp012SaturationV3Review, buildMenCp012SaturationV3Review } from "./saturation-v3-review";

function assert(condition:unknown,message:string):asserts condition{if(!condition)throw new Error(message);}
const review=buildMenCp012SaturationV3Review();
const audit=auditMenCp012SaturationV3Review();

assert(review.length===48,`Expected 48 Wave 03 review records, got ${review.length}.`);
assert(audit.reviewRecordCount===48,"Wave 03 review audit count mismatch.");
assert(audit.uniqueStemCount===48,`Expected 48 unique Wave 03 stems, got ${audit.uniqueStemCount}.`);
assert(audit.correctPositions.A===12&&audit.correctPositions.B===12&&audit.correctPositions.C===12&&audit.correctPositions.D===12,
  `Wave 03 answer positions must be 12/12/12/12; got ${JSON.stringify(audit.correctPositions)}.`);
assert(audit.allVerified,"Every Wave 03 review question must verify.");
assert(audit.allUniqueOptions,"Every Wave 03 review question must have unique options.");
assert(audit.productLocked,"Wave 03 review must remain product-locked.");
assert(audit.approximationRecordCount>0,"Source saturation must expose explicit approximation states.");

for(const definition of MEN_CP_012_SATURATION_V3_DEFINITIONS){
  const slice=review.filter((q)=>q.id===definition.id);
  assert(slice.length===4,`${definition.id}: expected four review records.`);
  assert(new Set(slice.map((q)=>q.correctIndex)).size===4,`${definition.id}: A/B/C/D review coverage failed.`);
  assert(new Set(slice.map((q)=>q.stem)).size===4,`${definition.id}: review stems are not distinct.`);
  assert(slice.every((q)=>q.evidence===definition.evidence),`${definition.id}: source-evidence label drift.`);
}

console.log(JSON.stringify({authority:"MEN-CP012-SATURATION-WAVE-03-REVIEW-V1",...audit},null,2));
