import "./spatial-proposed-ql-coverage-v1.test";
import { readFileSync, writeFileSync } from "node:fs";
import { generateSpatialFclGeometricFormQuestionV1, type SpatialFclGeometricFormModeV1 } from "../foundation/spatial/fcl-geometric-form-safe-v1";
import {
  spatialFclSubfigureRelationModeForSeedV3,
  type SpatialFclSubfigureRelationModeV3,
} from "../foundation/spatial/fcl-subfigure-relation-v3";
import { generateSpatialGapLearnerQuestionV1 } from "../foundation/spatial/gap-question-generator-v1";
import { renderSpatialSceneToSvg } from "../foundation/spatial/svg-renderer";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function esc(value:string):string{return value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");}
function optionLetter(index:number):string{return String.fromCharCode(65+index);}
const path="dist/reasoning-v1/spatial/spa-proposed-ql-coverage-v1-review.json";
const review:any=JSON.parse(readFileSync(path,"utf8"));
const target=review.pqls.find((pql:any)=>pql.proposalId==="FCL-PQL-03");
assert(target,"FCL-PQL-03 missing from proposed QL review.");
const modes:SpatialFclGeometricFormModeV1[]=["CLOSED_VS_OPEN","POLYGON_VS_CURVED","EVEN_SIDED_POLYGON","CLOSED_VS_OPEN"];
target.questions=modes.map((mode,index)=>{
  const q=generateSpatialFclGeometricFormQuestionV1({seed:`FCL-PQL-03-HUMAN-REVIEW:${index}`,mode,desiredCorrectOptionIndex:index as 0|1|2|3});
  return {sampleMode:`LEARNER_SAFE_${mode}`,seed:q.seed,stemText:q.stemText,correctOption:optionLetter(q.correctOptionIndex),learnerExplanation:q.learnerExplanation,stimulusSvgs:[],optionSvgs:q.options.map((option)=>renderSpatialSceneToSvg(option.scene))};
});

const relationTarget=review.pqls.find((pql:any)=>pql.proposalId==="FCL-PQL-09");
assert(relationTarget,"FCL-PQL-09 missing from proposed QL review.");
const relationModes:SpatialFclSubfigureRelationModeV3[]=["VERTICAL_MIRROR","HORIZONTAL_WATER","HALF_TURN_ROTATION","VERTICAL_MIRROR"];
relationTarget.questions=relationModes.map((mode,index)=>{
  let selectedSeed="";
  for(let attempt=0;attempt<1000;attempt+=1){
    const candidate=`FCL-PQL-09-HUMAN-REVIEW:${index}:A${attempt}`;
    if(spatialFclSubfigureRelationModeForSeedV3(candidate)===mode){selectedSeed=candidate;break;}
  }
  assert(selectedSeed,`Unable to find ${mode} human-review seed.`);
  const q=generateSpatialGapLearnerQuestionV1({gapId:"FCL-GAP-06",seed:selectedSeed,desiredCorrectOptionIndex:index as 0|1|2|3});
  return {sampleMode:`LEARNER_SAFE_${mode}`,seed:q.seed,stemText:q.stemText,correctOption:optionLetter(q.correctOptionIndex),learnerExplanation:q.learnerExplanation,stimulusSvgs:q.stimulusScenes.map(renderSpatialSceneToSvg),optionSvgs:q.options.map((option)=>renderSpatialSceneToSvg(option.scene))};
});

review.version="SPA-FND-001-PROPOSED-QL-HUMAN-REVIEW-PACK-V1";
review.reviewStatus="MACHINE_COVERAGE_AND_SCALE_COMPLETE_HUMAN_REVIEW_PENDING";
review.machineEvidence={
  learnerRemediationV2:"PASS_SPA_FND_001_GAP_QUESTION_LEARNER_REMEDIATION_V2",
  productionScaleV2:"PASS_SPA_FND_001_GAP_QUESTION_PRODUCTION_SCALE_V2",
  proposedQlReviewCoverage:"PASS_SPA_FND_001_PROPOSED_QL_REVIEW_COVERAGE_V1",
  incompleteSliceScale:"PASS_SPA_FND_001_PROPOSED_QL_INCOMPLETE_SLICE_SCALE_COMPLETION_V1",
  stringModalityBalance:"PASS_SPA_FND_001_PROPOSED_QL_STRING_MODALITY_BALANCE_V1",
  fclPql03SafeScale:"PASS_SPA_FND_001_FCL_PQL_03_LEARNER_SAFE_SCALE_V1",
  fclPql09RelationModeScale:"PASS_SPA_FND_001_FCL_PQL_09_RELATION_MODE_SCALE_V1",
};
review.holdsExcluded=["WAT-HOLD-P01 analog clock water-image diagram","FCL-HOLD-P01 letter/symbol identity-set replacement"];
review.lifecycle={permanentQlId:null,questionStudioDiscoverable:false,questionBankWritable:false,testEligible:false,publiclyPublishable:false,englishHumanFreeze:false};
assert(review.pqls.length===30,"Final review must contain exactly 30 active proposed QLs.");
assert(review.pqls.every((pql:any)=>pql.questions.length===4),"Every proposed QL must contain four final review questions.");
assert(!JSON.stringify(target).includes("Circle divided into four: open"),"Unsafe closure wording leaked into final review.");
assert(!JSON.stringify(target).includes("Four-point star: not a straight-sided polygon"),"Unsafe star polygon wording leaked into final review.");
const relationReviewText=JSON.stringify(relationTarget);
assert(relationReviewText.includes("LEARNER_SAFE_VERTICAL_MIRROR"),"FCL-PQL-09 final review is missing vertical mirror coverage.");
assert(relationReviewText.includes("LEARNER_SAFE_HORIZONTAL_WATER"),"FCL-PQL-09 final review is missing water-image coverage.");
assert(relationReviewText.includes("LEARNER_SAFE_HALF_TURN_ROTATION"),"FCL-PQL-09 final review is missing half-turn rotation coverage.");

function strip(svgs:string[],prefix:string){return `<div class="strip">${svgs.map((svg,i)=>`<div class="figure"><div class="cap">${prefix} ${i+1}</div>${svg}</div>`).join("")}</div>`;}
const sections=review.pqls.map((pql:any)=>`<section class="pql"><h2>${esc(pql.proposalId)} — ${esc(pql.name)}</h2><div class="qlmeta">${esc(pql.chapterCode)} · 4 final learner-review questions</div>${pql.questions.map((q:any,i:number)=>`<article class="card"><h3>${i+1}. ${esc(q.sampleMode)}</h3><p><strong>Stem:</strong> ${esc(q.stemText)}</p>${q.stimulusSvgs.length?`<h4>Stimulus</h4>${strip(q.stimulusSvgs,"Figure")}`:""}<h4>Options</h4>${strip(q.optionSvgs,"Option")}<p class="answer"><strong>Answer:</strong> ${esc(q.correctOption)}</p><div class="ex"><p><strong>Observe:</strong> ${esc(q.learnerExplanation.observation)}</p><p><strong>Rule:</strong> ${esc(q.learnerExplanation.rule)}</p><p><strong>Apply:</strong> ${esc(q.learnerExplanation.application)}</p><p><strong>Check:</strong> ${esc(q.learnerExplanation.check)}</p></div></article>`).join("")}</section>`).join("");
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ExamTree Spatial Final 30-PQL Human Review</title><style>body{font-family:Arial,sans-serif;background:#f3f4f6;color:#171717;margin:0}main{max-width:1220px;margin:auto;padding:24px}.summary,.pql{background:#fff;border:1px solid #ddd;border-radius:12px;padding:18px;margin-bottom:22px}.summary .pending{font-weight:700}.qlmeta{color:#666;font-size:13px;margin-bottom:12px}.card{border-top:1px solid #e5e7eb;padding:16px 0}.strip{display:flex;flex-wrap:wrap;gap:12px}.figure{width:128px;border:1px solid #ddd;border-radius:8px;padding:6px;text-align:center;background:#fff}.figure svg{width:100%;height:auto;display:block}.cap{font-size:11px;color:#666}.ex{background:#fafafa;border-left:3px solid #aaa;padding:8px 12px}.ex p{margin:6px 0}.answer{font-size:14px}@media(max-width:520px){main{padding:9px}.summary,.pql{padding:11px}.figure{width:104px}.ex{font-size:13px}}</style></head><body><main><div class="summary"><h1>ExamTree Spatial — Final 30-PQL Human Review V1</h1><p><strong>30 active proposed QLs · 120 questions · 4 per QL.</strong></p><p>Machine coverage and scale are complete. FCL geometric form/closure uses ordinary exam definitions; FCL intra-option relations cover vertical mirror, horizontal water image and half-turn rotation; MIR/WAT strings have a separate balanced Latin/digit scale proof. Held WAT-clock and FCL identity-set patterns are excluded.</p><p class="pending">Human English/mobile approval is still pending. Permanent QLs remain 0.</p></div>${sections}</main></body></html>`;
const evidence={status:"PASS_SPA_FND_001_PROPOSED_QL_HUMAN_REVIEW_PACK_READY_V1",coverage:{activeProposedQls:30,questionsPerPql:4,totalQuestions:120},checks:{machineCoverageComplete:true,incompleteSlicesScaled:true,stringModalitiesBalanced:true,fclGeometricFormLearnerSafe:true,fclSubfigureRelationModesCovered:true,holdsExcluded:true,humanApprovalNotPredeclared:true,lifecycleIsolation:true},lifecycle:review.lifecycle,nextGate:"SPATIAL_PROPOSED_QL_HUMAN_REVIEW_V1"};
writeFileSync("dist/reasoning-v1/spatial/spa-proposed-ql-human-review-pack-v1.json",JSON.stringify(review,null,2));
writeFileSync("dist/reasoning-v1/spatial/spa-proposed-ql-human-review-pack-v1.html",html);
writeFileSync("dist/reasoning-v1/spatial/spa-proposed-ql-human-review-pack-v1-evidence.json",JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
