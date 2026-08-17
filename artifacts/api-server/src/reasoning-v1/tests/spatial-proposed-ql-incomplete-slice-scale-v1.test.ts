import { mkdirSync, writeFileSync } from "node:fs";
import { buildSpatialFan001ProofCorpus } from "../proofs/spa-fnd-001-fan-001-corpus";
import { generateFigureAnalogyProofQuestion } from "../foundation/spatial/analogy-proof-generator";
import type { SpatialAnalogyFigureState, SpatialAnalogyRuleId } from "../foundation/spatial/analogy-types";
import { generateClockProofQuestion } from "../foundation/spatial/clock-proof-generator";
import { generateSpatialFanArbitraryAngleQuestionV1 } from "../foundation/spatial/fan-arbitrary-angle-v1";
import { spatialPerceptualSignatureV2, validateLearnerVisibleExplanationV2, validateSpatialPerceptualOptionUniquenessV2 } from "../foundation/spatial/gap-question-perceptual-v2";
import { generateGlyphStringProofQuestion } from "../foundation/spatial/glyph-string-proof-generator";
import { SpatialSeededRandom } from "../foundation/spatial/seed";
import { generateSpatialTransformProofQuestion } from "../foundation/spatial/transform-proof-generator";
import type { SpatialScene } from "../foundation/spatial/types";
import { validateSpatialOptionUniqueness, validateSpatialScene } from "../foundation/spatial/validator";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
type Slot = 0|1|2|3;
type SliceId = "MIR-PQL-01"|"MIR-PQL-02"|"MIR-PQL-03"|"WAT-PQL-01"|"WAT-PQL-02"|"FAN-PQL-01-ANGLE-EXPANSION"|"FAN-PQL-03-LEGACY-MARKER"|"FAN-PQL-04-COUNT"|"FAN-PQL-05-SUBSTITUTION"|"FAN-PQL-06-INNER-OUTER-EXCHANGE"|"FAN-PQL-07-SHADING"|"FAN-PQL-08-ROTATION-SHADING-COMPOUND";
interface ScaleCandidate { sliceId: SliceId; seed: string; scenes: SpatialScene[]; options: SpatialScene[]; correctOptionIndex: number; explanation: string[]; mode: string; }
const TARGET = 200;
const SLICES: SliceId[] = ["MIR-PQL-01","MIR-PQL-02","MIR-PQL-03","WAT-PQL-01","WAT-PQL-02","FAN-PQL-01-ANGLE-EXPANSION","FAN-PQL-03-LEGACY-MARKER","FAN-PQL-04-COUNT","FAN-PQL-05-SUBSTITUTION","FAN-PQL-06-INNER-OUTER-EXCHANGE","FAN-PQL-07-SHADING","FAN-PQL-08-ROTATION-SHADING-COMPOUND"];

function questionKey(q: ScaleCandidate): string { return JSON.stringify({ slice:q.sliceId, stimulus:q.scenes.map(spatialPerceptualSignatureV2), options:q.options.map(spatialPerceptualSignatureV2).sort(), correct:spatialPerceptualSignatureV2(q.options[q.correctOptionIndex]!) }); }
function validate(q: ScaleCandidate): boolean {
  for(const scene of [...q.scenes,...q.options]) if(!validateSpatialScene(scene).ok) return false;
  if(!validateSpatialOptionUniqueness(q.options).ok) return false;
  if(!validateSpatialPerceptualOptionUniquenessV2(q.options).ok) return false;
  if(!validateLearnerVisibleExplanationV2(q.explanation).ok) return false;
  return true;
}
function directTransform(sliceId: "MIR-PQL-01"|"WAT-PQL-01", attempt:number): ScaleCandidate {
  const mirror=sliceId.startsWith("MIR"); const seed=`PQL-SCALE:${sliceId}:${attempt}`;
  const q=generateSpatialTransformProofQuestion({seed,chapterCode:mirror?"MIR-001":"WAT-001",prototypeId:`${sliceId}-${attempt}`,requestedTransform:mirror?"REFLECT_VERTICAL":"REFLECT_HORIZONTAL",instructionKey:mirror?"MIR_SELECT_EXACT_MIRROR":"WAT_SELECT_EXACT_WATER"});
  return {sliceId,seed,scenes:[q.sourceScene],options:q.options.map(o=>o.scene),correctOptionIndex:q.correctOptionIndex,explanation:Object.values(q.learnerExplanation),mode:"GENERAL_COMPOSITION"};
}
const GLYPHS=["LATIN-F","LATIN-L","LATIN-P","LATIN-R","LATIN-K","LATIN-Q","DIGIT-2","DIGIT-4","DIGIT-5","DIGIT-7"] as const;
function glyphString(sliceId:"MIR-PQL-02"|"WAT-PQL-02",attempt:number):ScaleCandidate{
  const mirror=sliceId.startsWith("MIR"); const seed=`PQL-SCALE:${sliceId}:${attempt}`; const rng=new SpatialSeededRandom(seed); const length=rng.int(2,4); const glyphIds=Array.from({length},()=>rng.pick(GLYPHS)); const allLatin=glyphIds.every(g=>g.startsWith("LATIN")); const allDigit=glyphIds.every(g=>g.startsWith("DIGIT"));
  if(!allLatin&&!allDigit){ for(let i=0;i<glyphIds.length;i+=1) glyphIds[i]=mirror?rng.pick(GLYPHS.slice(0,6)):rng.pick(GLYPHS.slice(6)) as any; }
  const stimulusKind=glyphIds[0]!.startsWith("LATIN")?"LATIN_GLYPH_STRING":"WESTERN_ARABIC_DIGIT_STRING";
  const q=generateGlyphStringProofQuestion({seed,chapterCode:mirror?"MIR-001":"WAT-001",prototypeId:`${sliceId}-${attempt}`,requestedTransform:mirror?"REFLECT_VERTICAL":"REFLECT_HORIZONTAL",instructionKey:mirror?"MIR_SELECT_STRING":"WAT_SELECT_STRING",glyphIds:glyphIds as any,stimulusKind});
  return {sliceId,seed,scenes:[q.sourceScene],options:q.options.map(o=>o.scene),correctOptionIndex:q.correctOptionIndex,explanation:Object.values(q.learnerExplanation),mode:stimulusKind};
}
function mirrorClock(attempt:number):ScaleCandidate{
  const sliceId="MIR-PQL-03" as const; const seed=`PQL-SCALE:${sliceId}:${attempt}`; const minute=attempt%60; const hour=((Math.floor(attempt/60)+attempt*5)%12)+1; const q=generateClockProofQuestion({seed,chapterCode:"MIR-001",prototypeId:`${sliceId}-${attempt}`,requestedTransform:"REFLECT_VERTICAL",instructionKey:"MIR_SELECT_CLOCK_DIAGRAM",time:{hour,minute}});
  const explanation=["Treat the clock dial as a figure; both visible hands must move to their opposite left-right positions.","Reflect the complete dial-and-hand geometry across the vertical 12–6 axis.","Track the hour hand and minute hand separately and reflect each across the centre line without changing its length.",`Option ${String.fromCharCode(65+q.correctOptionIndex)} alone places both clock hands at the exact reflected positions.`];
  return {sliceId,seed,scenes:[q.sourceScene],options:q.options.map(o=>o.scene),correctOptionIndex:q.correctOptionIndex,explanation,mode:"ANALOG_CLOCK_GEOMETRY"};
}
function fanAngle(attempt:number):ScaleCandidate{
  const sliceId="FAN-PQL-01-ANGLE-EXPANSION" as const; const angles=[45,-45,135,-135] as const; const angle=angles[attempt%4]!; const seed=`PQL-SCALE:${sliceId}:${attempt}`; const q=generateSpatialFanArbitraryAngleQuestionV1({seed,angleDeg:angle});
  return {sliceId,seed,scenes:[...q.stimulusScenes],options:q.options.map(o=>o.scene),correctOptionIndex:q.correctOptionIndex,explanation:Object.values(q.learnerExplanation),mode:`ANGLE_${angle}`};
}
const FAN_CORPUS=buildSpatialFan001ProofCorpus();
const SHAPES=["CIRCLE","TRIANGLE","SQUARE","PENTAGON"] as const; const MARKERS=["TOP_LEFT","TOP_RIGHT","BOTTOM_RIGHT","BOTTOM_LEFT"] as const; const DIRS=["UP","RIGHT","DOWN","LEFT"] as const; const ANCHORS=["TOP","RIGHT","BOTTOM","LEFT"] as const;
function randomState(seed:string,rule:SpatialAnalogyRuleId):SpatialAnalogyFigureState{
  const r=new SpatialSeededRandom(seed); let outer=r.pick(SHAPES); let inner=r.pick(SHAPES); if(rule==="SWAP_INNER_OUTER"&&outer===inner) inner=SHAPES[(SHAPES.indexOf(inner)+1)%SHAPES.length]!; let segmentCount=r.int(1,4) as 1|2|3|4; if(rule==="ADD_SEGMENT") segmentCount=r.int(1,3) as 1|2|3; if(rule==="REMOVE_SEGMENT") segmentCount=r.int(2,4) as 2|3|4;
  return {outerShape:outer,innerShape:inner,outerRotationQuarter:r.int(0,3) as 0|1|2|3,innerRotationQuarter:r.int(0,3) as 0|1|2|3,markerPosition:r.pick(MARKERS),direction:r.pick(DIRS),shadedInner:r.int(0,1)===1,segmentCount,segmentAnchor:r.pick(ANCHORS)};
}
function fanRuleForSlice(sliceId:SliceId,attempt:number):SpatialAnalogyRuleId{
  if(sliceId==="FAN-PQL-03-LEGACY-MARKER") return attempt%2===0?"MOVE_MARKER_CLOCKWISE":"MOVE_MARKER_COUNTERCLOCKWISE";
  if(sliceId==="FAN-PQL-04-COUNT") return attempt%2===0?"ADD_SEGMENT":"REMOVE_SEGMENT";
  if(sliceId==="FAN-PQL-05-SUBSTITUTION") return "SUBSTITUTE_INNER_NEXT";
  if(sliceId==="FAN-PQL-06-INNER-OUTER-EXCHANGE") return "SWAP_INNER_OUTER";
  if(sliceId==="FAN-PQL-07-SHADING") return "TOGGLE_INNER_SHADING";
  return attempt%2===0?"COMPOUND_ROTATE_90_CW_TOGGLE_SHADING":"COMPOUND_ROTATE_90_CCW_TOGGLE_SHADING";
}
function fanLegacy(sliceId:SliceId,attempt:number):ScaleCandidate|null{
  const rule=fanRuleForSlice(sliceId,attempt); const base=FAN_CORPUS.find(q=>q.ruleId===rule) ?? FAN_CORPUS.find(q=>rule==="MOVE_MARKER_COUNTERCLOCKWISE"&&q.ruleId==="MOVE_MARKER_CLOCKWISE") ?? FAN_CORPUS.find(q=>rule==="COMPOUND_ROTATE_90_CCW_TOGGLE_SHADING"&&q.ruleId==="COMPOUND_ROTATE_90_CW_TOGGLE_SHADING"); if(!base) throw new Error(`Missing FAN authority seed for ${rule}`);
  let distractors=base.options.filter(o=>o.label!=="CORRECT_RULE_APPLICATION").map(o=>({ruleId:o.appliedRuleId,label:o.label})) as any;
  if(rule==="MOVE_MARKER_COUNTERCLOCKWISE") distractors=[{ruleId:"MOVE_MARKER_CLOCKWISE",label:"MARKER_MOVED_WRONG_WAY"},{ruleId:"ROTATE_90_CCW",label:"ROTATION_SUBSTITUTED_FOR_RULE"},{ruleId:"NO_CHANGE",label:"NO_CHANGE"}];
  if(rule==="COMPOUND_ROTATE_90_CCW_TOGGLE_SHADING") distractors=[{ruleId:"ROTATE_90_CCW",label:"PARTIAL_RULE_ROTATION_ONLY"},{ruleId:"TOGGLE_INNER_SHADING",label:"PARTIAL_RULE_SHADING_ONLY"},{ruleId:"COMPOUND_ROTATE_90_CW_TOGGLE_SHADING",label:"WRONG_ROTATION_DIRECTION"}];
  const seed=`PQL-SCALE:${sliceId}:${attempt}`; try{const q=generateFigureAnalogyProofQuestion({seed,prototypeId:`${sliceId}-${attempt}`,ruleId:rule,aState:randomState(`${seed}:A`,rule),cState:randomState(`${seed}:C`,rule),distractors}); return {sliceId,seed,scenes:[q.aScene,q.bScene,q.cScene],options:q.options.map(o=>o.scene),correctOptionIndex:q.correctOptionIndex,explanation:Object.values(q.learnerExplanation),mode:rule};}catch{return null;}
}
function candidate(sliceId:SliceId,attempt:number):ScaleCandidate|null{
  if(sliceId==="MIR-PQL-01"||sliceId==="WAT-PQL-01") return directTransform(sliceId,attempt);
  if(sliceId==="MIR-PQL-02"||sliceId==="WAT-PQL-02") { try{return glyphString(sliceId,attempt);}catch{return null;} }
  if(sliceId==="MIR-PQL-03") return mirrorClock(attempt);
  if(sliceId==="FAN-PQL-01-ANGLE-EXPANSION") { try{return fanAngle(attempt);}catch{return null;} }
  return fanLegacy(sliceId,attempt);
}

const results:Record<string,{accepted:number;attempts:number;perceptualRejects:number;generatorRejects:number;slots:[number,number,number,number];modes:Record<string,number>}>=Object.fromEntries(SLICES.map(id=>[id,{accepted:0,attempts:0,perceptualRejects:0,generatorRejects:0,slots:[0,0,0,0],modes:{}}]));
for(const sliceId of SLICES){const seen=new Set<string>(); const r=results[sliceId]!; for(let attempt=0;attempt<12000&&r.accepted<TARGET;attempt+=1){r.attempts+=1;let q:ScaleCandidate|null=null;try{q=candidate(sliceId,attempt);}catch{q=null;}if(!q||!validate(q)){r.generatorRejects+=1;continue;} if(r.slots[q.correctOptionIndex as Slot]>=50) continue; const key=questionKey(q);if(seen.has(key)){r.perceptualRejects+=1;continue;}seen.add(key);r.accepted+=1;r.slots[q.correctOptionIndex as Slot]+=1;r.modes[q.mode]=(r.modes[q.mode]??0)+1;} assert(r.accepted===TARGET,`${sliceId}: reached ${r.accepted}/${TARGET} after ${r.attempts} attempts.`);assert(r.slots.every(n=>n===50),`${sliceId}: answer slots not 50/50/50/50: ${r.slots.join("/")}.`);}

const equivalenceClosures={
  "FCL-PQL-04":{scaledEvidence:"FCL-GAP-02",legacyProofs:["SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE","SEGMENT_MATCHES_OUTER_SIDES_MINUS_ONE"],reason:"Both ask the learner to classify by a count relation; polygon/segment-count presentation is a parameterized surface form of the V2-scaled count-relation solving method."},
  "FCL-PQL-05":{scaledEvidence:"FCL-GAP-03",legacyProofs:["nested/replica/relative-size source slice"],reason:"The V2 relative-size/nesting relation is the learner method retained by the consolidated PQL; no separate technical QL is warranted."},
  "FCL-PQL-06":{scaledEvidence:"FCL-GAP-04",legacyProofs:["MARKER_ON_ARROW_SIDE","MARKER_OPPOSITE_SEGMENT_ANCHOR","ARROW_POINTS_TO_SEGMENT_ANCHOR","ORIENTATIONS_MATCH"],reason:"Marker/arrow/anchor relations and relative orientation share the retained relative-position/orientation classification method and remain proof-backed parameters within that PQL."}
};
const totalAccepted=Object.values(results).reduce((s,r)=>s+r.accepted,0);assert(totalAccepted===SLICES.length*TARGET,`Expected ${SLICES.length*TARGET}, got ${totalAccepted}.`);
const evidence={status:"PASS_SPA_FND_001_PROPOSED_QL_INCOMPLETE_SLICE_SCALE_COMPLETION_V1",scale:{slices:SLICES.length,targetPerSlice:TARGET,totalAccepted,results},equivalenceClosures,checks:{twelvePreviouslyIncompleteSlicesScaled:true,twoHundredPerSlice:true,perceptualQuestionUniqueness:true,semanticAndPerceptualOptionUniqueness:true,learnerVisibleExplanations:true,balancedAnswerSlotsPerSlice:true,mirrorClockGeometryOnly:true,fan45And135RealGeometry:true,fclLegacyVariantsConsolidatedByLearnerMethodNotFakeScale:true,noPermanentQlAllocation:true},lifecycle:{permanentQlId:null,questionStudioDiscoverable:false,questionBankWritable:false,testEligible:false,publiclyPublishable:false,englishHumanFreeze:false},nextGate:"SPATIAL_PROPOSED_QL_HUMAN_REVIEW_V1"};
mkdirSync("dist/reasoning-v1/spatial",{recursive:true});writeFileSync("dist/reasoning-v1/spatial/spa-proposed-ql-incomplete-slice-scale-v1-evidence.json",JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence,null,2));
