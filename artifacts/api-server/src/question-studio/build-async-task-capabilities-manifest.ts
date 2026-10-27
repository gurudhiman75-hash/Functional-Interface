// Build-time ONLY. Export the same authoritative package definitions used by
// the universal worker without importing their generation graph into Cloud Run.
// Run in a separate Node process; the receiver consumes only the generated JSON.
import {writeFile} from "node:fs/promises";
import path from "node:path";
import {listQuestionStudioPackages} from "./engine-registry";
import {
  isProductionChapterGenerationEligiblePackage,
  validateProductionChapterReview,
} from "./prod-chapter-review-policy.mjs";

const output=process.env.QUESTION_STUDIO_CAPABILITIES_MANIFEST_OUT;
if(!output)throw new Error("QUESTION_STUDIO_CAPABILITIES_MANIFEST_OUT_REQUIRED");
const packages=listQuestionStudioPackages().map(pkg=>{
  const {
    engineId,packageId,enabled,cpIds,dynamicCandidateCpIds,
    supportedLanguages,supportedDifficulties,difficultyFilterSupported,
    supportedRuntimeModes,
    lifecycleId,lifecycleStage,reviewSurfaceRequired,manualApprovalRequired,
    questionBankStatus,questionBankWritable,questionBankAcceptanceMode,
    questionBankAcceptanceAuthority,testEligibility,testEligible,mockTestEligible,
    publiclyPublishable,automaticStudentPublication,productionReleaseAuthorized,
  }=pkg;
  return {
    engineId,packageId,enabled,cpIds,dynamicCandidateCpIds,
    supportedLanguages,supportedDifficulties,difficultyFilterSupported,
    supportedRuntimeModes,
    lifecycleId,lifecycleStage,reviewSurfaceRequired,manualApprovalRequired,
    questionBankStatus,questionBankWritable,questionBankAcceptanceMode,
    questionBankAcceptanceAuthority,testEligibility,testEligible,mockTestEligible,
    publiclyPublishable,automaticStudentPublication,productionReleaseAuthorized,
  };
});
const required: Record<string,string>={
  "TRG-002":"quant-v4","OPS-001":"reasoning-v1",
  "ENG-001":"language-v1","COM-001":"knowledge-v1",
};
for(const [id,engineId] of Object.entries(required)){
  const hits=packages.filter(pkg=>pkg.packageId===id);
  if(hits.length!==1 || hits[0]?.enabled!==true || hits[0].engineId!==engineId ||
     !hits[0].supportedLanguages?.includes("en") || !hits[0].cpIds?.length){
    throw new Error(`TASK_CANONICAL_PACKAGE_MISMATCH: ${id} / ${engineId}`);
  }
}
const manifest={
  source:"canonical-question-studio-engine-registry",
  schemaVersion:1,
  generationSystems:["quant-v4","reasoning-v1","language-v1","knowledge-v1"],
  packages,
};
await writeFile(path.resolve(output),JSON.stringify(manifest),"utf8");
console.log("QS_CANONICAL_TASK_CAPABILITIES_READY",packages.length);
const eligible=packages.filter(p=>
  p.enabled===true && p.reviewSurfaceRequired===true &&
  p.manualApprovalRequired===true && p.productionReleaseAuthorized===false &&
  p.automaticStudentPublication===false && p.publiclyPublishable===false &&
  Array.isArray(p.cpIds) && p.cpIds.length>0 &&
  new Set(p.cpIds).size===p.cpIds.length &&
  p.cpIds.every(id=>/^[A-Z][A-Z0-9-]{1,80}$/.test(id))
);
// Keep the build artifact and the three runtime gates (API, receiver and
// worker) in lockstep.  A catalog-wide release derives scope from this
// immutable manifest, so every eligible chapter must have at least one valid
// canonical chapter-mix request.  This verifies admission only; it does not
// generate, store, approve or publish a question.
const catalogWideScope=eligible.map(({engineId,packageId})=>(
  {engineId,packageId,reviewOnly:true,chapterWide:true}
));
const auditRunId="00000000-0000-4000-8000-000000000001";
for(const pkg of eligible){
  const language=pkg.supportedLanguages?.[0];
  const difficulty=pkg.difficultyFilterSupported===false
    ? "Mixed"
    : (pkg.supportedDifficulties?.[0] ?? "Mixed");
  const runtimeMode=pkg.supportedRuntimeModes?.[0];
  const accepted=typeof language==="string" && validateProductionChapterReview({
    queueVersion:1,
    count:1,
    selectedCpIds:[],
    request:{
      engineId:pkg.engineId,
      packageId:pkg.packageId,
      language,
      difficulty,
      count:1,
      ...(runtimeMode ? {runtimeMode} : {}),
      seed:`qs-async:${auditRunId}`,
    },
  },manifest,catalogWideScope,{runId:auditRunId});
  if(!accepted || !isProductionChapterGenerationEligiblePackage(pkg)){
    throw new Error(`QS_CHAPTER_CATALOG_ADMISSION_MISMATCH: ${pkg.engineId}/${pkg.packageId}`);
  }
}
const engineTotals=Object.fromEntries(manifest.generationSystems.map(engine=>[
  engine,{registered:packages.filter(p=>p.engineId===engine).length,
          eligible:eligible.filter(p=>p.engineId===engine).length},
]));
console.log("QS_CHAPTER_CATALOG_COVERAGE",JSON.stringify({
  totalPackages:packages.length,eligiblePackages:eligible.length,byEngine:engineTotals,
}));
