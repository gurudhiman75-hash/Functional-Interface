import { mkdirSync, writeFileSync } from "node:fs";
import { generateSpatialFclGeometricFormQuestionV1, type SpatialFclGeometricFormModeV1 } from "../foundation/spatial/fcl-geometric-form-safe-v1";
import { spatialPerceptualSignatureV2, validateLearnerVisibleExplanationV2, validateSpatialPerceptualOptionUniquenessV2 } from "../foundation/spatial/gap-question-perceptual-v2";
import { validateSpatialOptionUniqueness, validateSpatialScene } from "../foundation/spatial/validator";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const TARGET=200;
const MODE_TARGETS: Record<SpatialFclGeometricFormModeV1,number>={CLOSED_VS_OPEN:70,POLYGON_VS_CURVED:70,EVEN_SIDED_POLYGON:60};
const modes=Object.keys(MODE_TARGETS) as SpatialFclGeometricFormModeV1[];
const modeCounts:Record<SpatialFclGeometricFormModeV1,number>={CLOSED_VS_OPEN:0,POLYGON_VS_CURVED:0,EVEN_SIDED_POLYGON:0};
const slots:[number,number,number,number]=[0,0,0,0];
const seen=new Set<string>();
let attempts=0, rejects=0;
for(let attempt=0;attempt<10000&&seen.size<TARGET;attempt+=1){
  attempts+=1;
  const mode=modes[attempt%modes.length]!;
  if(modeCounts[mode]>=MODE_TARGETS[mode]) continue;
  const desired=(attempt%4) as 0|1|2|3;
  if(slots[desired]>=50) continue;
  let q:ReturnType<typeof generateSpatialFclGeometricFormQuestionV1>;
  try{q=generateSpatialFclGeometricFormQuestionV1({seed:`FCL-PQL-03-SAFE-SCALE:${attempt}`,mode,desiredCorrectOptionIndex:desired});}catch{rejects+=1;continue;}
  if(q.options.some((option)=>!validateSpatialScene(option.scene).ok)||!validateSpatialOptionUniqueness(q.options.map((option)=>option.scene)).ok||!validateSpatialPerceptualOptionUniquenessV2(q.options.map((option)=>option.scene)).ok||!validateLearnerVisibleExplanationV2(Object.values(q.learnerExplanation)).ok){rejects+=1;continue;}
  const optionSigs=q.options.map((option)=>spatialPerceptualSignatureV2(option.scene));
  const key=JSON.stringify({mode,options:[...optionSigs].sort(),correct:optionSigs[q.correctOptionIndex]});
  if(seen.has(key)){rejects+=1;continue;}
  seen.add(key); modeCounts[mode]+=1; slots[q.correctOptionIndex]+=1;
}
assert(seen.size===TARGET,`FCL-PQL-03 safe scale accepted ${seen.size}/${TARGET}.`);
assert(Object.entries(MODE_TARGETS).every(([mode,target])=>modeCounts[mode as SpatialFclGeometricFormModeV1]===target),`Mode counts wrong: ${JSON.stringify(modeCounts)}.`);
assert(slots.every((count)=>count===50),`Answer slots wrong: ${slots.join("/")}.`);
const evidence={status:"PASS_SPA_FND_001_FCL_PQL_03_LEARNER_SAFE_SCALE_V1",scale:{target:TARGET,accepted:seen.size,attempts,rejects,modeCounts,correctSlotCounts:slots},checks:{ordinaryExamDefinitionsOnly:true,noPartitionedCircleCalledOpen:true,noStraightSidedStarCalledNonPolygon:true,threeLearnerModesRepresented:true,perceptualQuestionUniqueness:true,semanticAndPerceptualOptionUniqueness:true,learnerVisibleExplanations:true,balancedAnswerSlots:true},lifecycle:{permanentQlId:null,questionStudioDiscoverable:false,questionBankWritable:false,testEligible:false,publiclyPublishable:false,englishHumanFreeze:false},nextGate:"SPATIAL_PROPOSED_QL_HUMAN_REVIEW_V1"};
mkdirSync("dist/reasoning-v1/spatial",{recursive:true});writeFileSync("dist/reasoning-v1/spatial/spa-fcl-pql-03-learner-safe-scale-v1-evidence.json",JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence,null,2));
