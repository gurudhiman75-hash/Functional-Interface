import { spawnSync } from "node:child_process";

import { staticGkAiVideoEnabled } from "../ai-video/orchestrator";
import { normalizeStaticGkRenderableVisualId } from "../render-job-contract";
import { getStaticGkRenderJob, staticGkAtlasApiServerRoot, staticGkAtlasToolRunnerPath, staticGkRenderJobOutputDirectory, updateStaticGkRenderJob } from "../render-jobs";

function runTool(command: string, visualId: string, outputDirectory: string): void {
  const result = spawnSync(process.execPath,[staticGkAtlasToolRunnerPath(),command,visualId,outputDirectory],{cwd:staticGkAtlasApiServerRoot(),env:process.env,stdio:"inherit"});
  if(result.error)throw new Error(`${command} could not start: ${result.error.message}`);
  if(result.status!==0)throw new Error(`${command} exited with status ${result.status??"unknown"}.`);
}

async function main(): Promise<void> {
  const [, , visualArg, jobId] = process.argv;
  if(!visualArg||!jobId)throw new Error("Usage: run-prepublication-job <visual-id> <job-id>");
  const visualId=normalizeStaticGkRenderableVisualId(visualArg), job=await getStaticGkRenderJob(jobId);
  if(job.visualId!==visualId)throw new Error("Render job visual does not match requested visual.");
  const outputDirectory=staticGkRenderJobOutputDirectory(job.id), startedAt=new Date().toISOString();
  try {
    if(staticGkAiVideoEnabled()) {
      await updateStaticGkRenderJob(job.id,{status:"rendering",progress:3,activePhase:"Generating multi-take cinematic AI video plates",startedAt,error:null});
      runTool("generate-ai-video-plates",visualId,outputDirectory);
      await updateStaticGkRenderJob(job.id,{status:"rendering",progress:30,activePhase:"Compositing verified geography over AI video plates"});
    } else {
      await updateStaticGkRenderJob(job.id,{status:"rendering",progress:5,activePhase:"Rendering deterministic 9:16 visual master",startedAt,error:null});
    }
    runTool("render-vertical-video",visualId,outputDirectory);
    await updateStaticGkRenderJob(job.id,{status:"synthesizing-audio",progress:48,activePhase:"Synthesizing and measuring narration"});
    runTool("synthesize-narration",visualId,outputDirectory);
    await updateStaticGkRenderJob(job.id,{status:"assembling",progress:70,activePhase:"Assembling checksum-bound narrated master"});
    runTool("assemble-narrated-master",visualId,outputDirectory);
    await updateStaticGkRenderJob(job.id,{status:"automated-qa",progress:88,activePhase:"Running post-mux loudness QA and thumbnail extraction"});
    runTool("verify-narrated-master",visualId,outputDirectory);
    await updateStaticGkRenderJob(job.id,{status:"review-ready",progress:100,activePhase:"Awaiting human pronunciation and visual/factual review",renderCompletedAt:new Date().toISOString(),artifacts:["video","thumbnail","captions","qa-receipt"]});
  } catch(error) {
    const message=error instanceof Error?error.message:String(error);
    await updateStaticGkRenderJob(job.id,{status:"failed",activePhase:"Pre-publication render failed",error:message,renderCompletedAt:new Date().toISOString()});
    throw error;
  }
}

main().catch((error:unknown)=>{const message=error instanceof Error?error.message:String(error);process.stderr.write(`[static-gk-visual-atlas] admin render worker failed: ${message}\n`);process.exitCode=1;});
