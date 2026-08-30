import { spawnSync } from "node:child_process";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

import { compileNarrationWindows, renderNarrationWindowsSrt, renderNarrationWindowsVtt, type StaticGkNarrationWindow } from "../audio/narration-timeline";
import type { StaticGkAiVideoGenerationReceipt } from "../ai-video/types";
import { TROPIC_OF_CANCER_FACT_LOCK } from "../fact-packs/SGK-VIS-IND-GEO-001";
import { STANDARD_MERIDIAN_FACT_LOCK } from "../fact-packs/SGK-VIS-IND-GEO-002";
import { loadValidatedRuntimeAdminGeometry } from "../geometry/runtime-admin-loader";
import { TROPIC_OF_CANCER_LESSON_MANIFEST } from "../lesson-manifests/SGK-VIS-IND-GEO-001.manifest";
import { STANDARD_MERIDIAN_LESSON_MANIFEST } from "../lesson-manifests/SGK-VIS-IND-GEO-002.manifest";
import { renderStandardMeridianAiOverlayFrame, renderTropicCancerAiOverlayFrame } from "../renderers/svg-map-ai-overlay";
import { renderStandardMeridianSvgFrame, renderTropicCancerSvgFrame } from "../renderers/svg-map";
import { buildFfmpegSilentMasterArgs, createVerticalVideoRenderPlan, frameFileName, frameTimeMs } from "../renderers/vertical-video";
import { compileStandardMeridianScene } from "../scenes/compile-standard-meridian";
import { compileTropicCancerScene } from "../scenes/compile-tropic-cancer";
import type { StaticGkMapPathSceneRecipe, StaticGkMeridianSceneRecipe } from "../scenes/types";

const VISUAL_ALIASES = new Map([
  ["tropic", "SGK-VIS-IND-GEO-001"], ["tropic-of-cancer", "SGK-VIS-IND-GEO-001"], ["SGK-VIS-IND-GEO-001", "SGK-VIS-IND-GEO-001"],
  ["standard-meridian", "SGK-VIS-IND-GEO-002"], ["meridian", "SGK-VIS-IND-GEO-002"], ["SGK-VIS-IND-GEO-002", "SGK-VIS-IND-GEO-002"],
] as const);
type SupportedVisualId = "SGK-VIS-IND-GEO-001" | "SGK-VIS-IND-GEO-002";
type SupportedScene = StaticGkMapPathSceneRecipe | StaticGkMeridianSceneRecipe;

function resolveVisualId(value: string): SupportedVisualId {
  const resolved = VISUAL_ALIASES.get(value as never);
  if (resolved === "SGK-VIS-IND-GEO-001" || resolved === "SGK-VIS-IND-GEO-002") return resolved;
  throw new Error(`Unsupported visual '${value}'. Use tropic or standard-meridian.`);
}

async function selectedAiPlateFiles(outputDirectory: string, visualId: SupportedVisualId): Promise<string[] | null> {
  const receiptPath = join(outputDirectory, `${visualId}.ai-generation-receipt.json`);
  try { await access(receiptPath); } catch { return null; }
  const parsed = JSON.parse(await readFile(receiptPath, "utf8")) as StaticGkAiVideoGenerationReceipt;
  if (parsed.visualId !== visualId || parsed.kind !== "ai-video-plates" || !Array.isArray(parsed.shots) || parsed.shots.length === 0) throw new Error("AI video generation receipt is invalid");
  const result: string[] = [];
  for (const shot of [...parsed.shots].sort((a,b)=>a.order-b.order)) {
    const take = shot.takes.find((candidate) => candidate.takeNumber === shot.selectedTakeNumber);
    if (!take) throw new Error(`AI video receipt has no selected take for ${shot.shotId}`);
    if (basename(take.outputFileName) !== take.outputFileName) throw new Error(`Unsafe AI plate filename for ${shot.shotId}`);
    const filePath = join(outputDirectory, take.outputFileName);
    await access(filePath);
    result.push(filePath);
  }
  return result;
}

function concatEscape(path: string): string { return path.replaceAll("'", "'\\''"); }

function buildAiCompositeArgs(fps:number, frameCount:number, durationMs:number, concatPath:string, framePattern:string, outputPath:string):string[] {
  return ["-hide_banner","-loglevel","warning","-y","-stream_loop","-1","-f","concat","-safe","0","-i",concatPath,"-framerate",String(fps),"-start_number","0","-i",framePattern,"-filter_complex","[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[bg];[1:v]format=rgba[fg];[bg][fg]overlay=0:0:shortest=1:format=auto[v]","-map","[v]","-an","-t",(durationMs/1000).toFixed(3),"-frames:v",String(frameCount),"-c:v","libx264","-preset","medium","-crf","18","-pix_fmt","yuv420p","-movflags","+faststart","-r",String(fps),outputPath];
}

async function main(): Promise<void> {
  const [, , visualArg, outputDirectoryArg, fpsArg] = process.argv;
  if (!visualArg || !outputDirectoryArg) throw new Error("Usage: render-vertical-video <tropic|standard-meridian|visual-id> <output-directory> [fps]");
  const visualId = resolveVisualId(visualArg), fps = fpsArg ? Number(fpsArg) : undefined;
  const outputDirectory = resolve(outputDirectoryArg);
  await mkdir(outputDirectory, { recursive: true });
  const aiPlateFiles = await selectedAiPlateFiles(outputDirectory, visualId);
  const bundle = await loadValidatedRuntimeAdminGeometry();

  let scene: SupportedScene, renderFrame: (timeMs:number)=>string, narrationWindows: StaticGkNarrationWindow[];
  if (visualId === "SGK-VIS-IND-GEO-001") {
    const compiled = compileTropicCancerScene(bundle); if (compiled.status !== "render-ready") throw new Error(`Tropic scene is ${compiled.status}, not render-ready`);
    scene = compiled;
    renderFrame = aiPlateFiles ? (timeMs)=>renderTropicCancerAiOverlayFrame(compiled,bundle.geometry,timeMs) : (timeMs)=>renderTropicCancerSvgFrame(compiled,bundle.geometry,timeMs);
    narrationWindows = compileNarrationWindows(TROPIC_OF_CANCER_LESSON_MANIFEST,TROPIC_OF_CANCER_FACT_LOCK);
  } else {
    const compiled = compileStandardMeridianScene(bundle); if (compiled.status !== "render-ready") throw new Error(`Standard Meridian scene is ${compiled.status}, not render-ready`);
    scene = compiled;
    renderFrame = aiPlateFiles ? (timeMs)=>renderStandardMeridianAiOverlayFrame(compiled,bundle.geometry,timeMs) : (timeMs)=>renderStandardMeridianSvgFrame(compiled,bundle.geometry,timeMs);
    narrationWindows = compileNarrationWindows(STANDARD_MERIDIAN_LESSON_MANIFEST,STANDARD_MERIDIAN_FACT_LOCK);
  }

  const plan=createVerticalVideoRenderPlan(scene.viewport,scene.cues,fps), framesDirectory=join(outputDirectory,`${visualId}.frames`), outputPath=join(outputDirectory,`${visualId}.silent-master.mp4`);
  await rm(framesDirectory,{recursive:true,force:true}); await mkdir(framesDirectory,{recursive:true});
  for(let frameIndex=0;frameIndex<plan.frameCount;frameIndex+=1){ const timeMs=frameTimeMs(plan,frameIndex); await writeFile(join(framesDirectory,frameFileName(frameIndex)),`${renderFrame(timeMs)}\n`,"utf8"); if(frameIndex>0&&frameIndex%150===0)process.stdout.write(`[static-gk-visual-atlas] rendered ${frameIndex}/${plan.frameCount} SVG frames\n`); }

  await writeFile(join(outputDirectory,`${visualId}.scene.json`),`${JSON.stringify(scene,null,2)}\n`,`utf8`);
  await writeFile(join(outputDirectory,`${visualId}.render-plan.json`),`${JSON.stringify({visualId,kind:aiPlateFiles?"ai-backed-silent-master":"silent-master",...plan,geometryId:scene.geometrySource.geometryId,sourceProductCode:scene.geometrySource.sourceProductCode,sourceArchiveSha256:scene.geometrySource.sourceArchiveSha256,canonicalGeoJsonSha256:scene.geometrySource.canonicalGeoJsonSha256,aiVideoPlates:aiPlateFiles?aiPlateFiles.length:0},null,2)}\n`,`utf8`);
  await writeFile(join(outputDirectory,`${visualId}.narration-plan.json`),`${JSON.stringify({visualId,locale:"en-IN",status:"tts-pending",windows:narrationWindows},null,2)}\n`,`utf8`);
  await writeFile(join(outputDirectory,`${visualId}.captions.draft.vtt`),renderNarrationWindowsVtt(narrationWindows),"utf8");
  await writeFile(join(outputDirectory,`${visualId}.captions.draft.srt`),renderNarrationWindowsSrt(narrationWindows),"utf8");
  const speedReviewCount=narrationWindows.filter(w=>w.speedQa==="review").length; if(speedReviewCount>0)process.stdout.write(`[static-gk-visual-atlas] narration timing QA: ${speedReviewCount} window(s) exceed the draft 210 WPM review threshold\n`);

  const ffmpegBinary=process.env.STATIC_GK_ATLAS_FFMPEG_PATH?.trim()||"ffmpeg";
  let ffmpegArgs:string[], concatPath:string|undefined;
  if(aiPlateFiles){ concatPath=join(outputDirectory,`${visualId}.ai-selected.ffconcat`); await writeFile(concatPath,`ffconcat version 1.0\n${aiPlateFiles.map(file=>`file '${concatEscape(file)}'`).join("\n")}\n`,"utf8"); ffmpegArgs=buildAiCompositeArgs(plan.fps,plan.frameCount,plan.durationMs,concatPath,join(framesDirectory,"frame-%06d.svg"),outputPath); }
  else ffmpegArgs=buildFfmpegSilentMasterArgs(plan,join(framesDirectory,"frame-%06d.svg"),outputPath);
  const result=spawnSync(ffmpegBinary,ffmpegArgs,{stdio:"inherit"}); if(result.error)throw new Error(`FFmpeg could not start: ${result.error.message}. SVG frames were preserved at ${framesDirectory}`); if(result.status!==0)throw new Error(`FFmpeg exited with status ${result.status??"unknown"}. SVG frames were preserved at ${framesDirectory}`);
  if(concatPath)await rm(concatPath,{force:true}); if(process.env.STATIC_GK_ATLAS_KEEP_FRAMES!=="1")await rm(framesDirectory,{recursive:true,force:true});
  process.stdout.write(`[static-gk-visual-atlas] rendered ${visualId} ${aiPlateFiles?"AI-backed ":""}silent vertical master: ${outputPath} (${plan.durationMs/1000}s, ${plan.fps}fps, ${plan.frameCount} frames)\n`);
}

main().catch((error:unknown)=>{const message=error instanceof Error?error.message:String(error);process.stderr.write(`[static-gk-visual-atlas] vertical render failed: ${message}\n`);process.exitCode=1;});
