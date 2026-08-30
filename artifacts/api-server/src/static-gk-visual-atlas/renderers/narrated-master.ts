import type { StaticGkVerticalVideoRenderPlan } from "./vertical-video";

export interface StaticGkNarrationAudioInput {
  startMs: number;
  audioPath: string;
}

export const STATIC_GK_VOICE_LOUDNESS_POLICY = {
  integratedLufs: -16,
  loudnessRange: 11,
  truePeakDb: -1.5,
} as const;

export function buildFfmpegNarratedMasterArgs(
  plan: Pick<StaticGkVerticalVideoRenderPlan, "durationMs">,
  silentVideoPath: string,
  clips: readonly StaticGkNarrationAudioInput[],
  outputPath: string,
): string[] {
  if (!Number.isInteger(plan.durationMs) || plan.durationMs <= 0) throw new Error("Narrated master duration must be positive.");
  if (clips.length === 0) throw new Error("Narrated master requires at least one narration clip.");
  for (const [index, clip] of clips.entries()) {
    if (!Number.isInteger(clip.startMs) || clip.startMs < 0 || clip.startMs >= plan.durationMs) {
      throw new Error(`Narration clip ${index} has an invalid timeline offset.`);
    }
    if (!clip.audioPath) throw new Error(`Narration clip ${index} has no audio path.`);
  }

  const durationSeconds = (plan.durationMs / 1000).toFixed(3);
  const delayedLabels = clips.map((clip, index) => {
    return `[${index + 1}:a]adelay=delays=${clip.startMs}:all=1[a${index}]`;
  });
  const mixInputs = clips.map((_, index) => `[a${index}]`).join("");
  const mix = `${mixInputs}amix=inputs=${clips.length}:normalize=0:dropout_transition=0,` +
    `loudnorm=I=${STATIC_GK_VOICE_LOUDNESS_POLICY.integratedLufs}:LRA=${STATIC_GK_VOICE_LOUDNESS_POLICY.loudnessRange}:TP=${STATIC_GK_VOICE_LOUDNESS_POLICY.truePeakDb},` +
    `apad,atrim=duration=${durationSeconds}[voice]`;
  const filterComplex = [...delayedLabels, mix].join(";");

  return [
    "-hide_banner",
    "-loglevel",
    "warning",
    "-y",
    "-i",
    silentVideoPath,
    ...clips.flatMap((clip) => ["-i", clip.audioPath]),
    "-filter_complex",
    filterComplex,
    "-map",
    "0:v:0",
    "-map",
    "[voice]",
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-ar",
    "48000",
    "-movflags",
    "+faststart",
    "-t",
    durationSeconds,
    outputPath,
  ];
}
