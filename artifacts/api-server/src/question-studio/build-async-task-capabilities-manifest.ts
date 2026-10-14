// Build-time ONLY. Export the same authoritative package definitions used by
// the universal worker without importing their generation graph into Cloud Run.
// Run in a separate Node process; the receiver consumes only the generated JSON.
import {writeFile} from "node:fs/promises";
import path from "node:path";
import {listQuestionStudioPackages} from "./engine-registry";

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
