import { STATIC_GK_VOICE_LOUDNESS_POLICY } from "../renderers/narrated-master";

export const STATIC_GK_LOUDNESS_QA_TOLERANCE = {
  integratedLufs: 1.5,
  maxTruePeakDb: -1.0,
  maxLoudnessRange: 12,
} as const;

export interface StaticGkLoudnessMeasurement {
  integratedLufs: number;
  truePeakDb: number;
  loudnessRange: number;
  thresholdLufs: number | null;
  targetOffset: number | null;
}

export interface StaticGkLoudnessQaResult {
  measurement: StaticGkLoudnessMeasurement;
  checks: {
    integratedLoudness: boolean;
    truePeak: boolean;
    loudnessRange: boolean;
  };
  passed: boolean;
}

function finiteNumber(value: unknown, label: string): number {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`FFmpeg loudness analysis returned invalid ${label}.`);
  return number;
}

function nullableFiniteNumber(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function parseFfmpegLoudnormAnalysis(output: string): StaticGkLoudnessMeasurement {
  const marker = output.lastIndexOf('"input_i"');
  if (marker < 0) throw new Error("FFmpeg loudness analysis did not emit loudnorm JSON.");
  const start = output.lastIndexOf("{", marker);
  const end = output.indexOf("}", marker);
  if (start < 0 || end < 0) throw new Error("FFmpeg loudnorm JSON is incomplete.");

  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(output.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    throw new Error("FFmpeg loudnorm JSON could not be parsed.");
  }
  return {
    integratedLufs: finiteNumber(raw.input_i, "integrated loudness"),
    truePeakDb: finiteNumber(raw.input_tp, "true peak"),
    loudnessRange: finiteNumber(raw.input_lra, "loudness range"),
    thresholdLufs: nullableFiniteNumber(raw.input_thresh),
    targetOffset: nullableFiniteNumber(raw.target_offset),
  };
}

export function evaluateStaticGkLoudness(measurement: StaticGkLoudnessMeasurement): StaticGkLoudnessQaResult {
  const integratedLoudness = Math.abs(
    measurement.integratedLufs - STATIC_GK_VOICE_LOUDNESS_POLICY.integratedLufs,
  ) <= STATIC_GK_LOUDNESS_QA_TOLERANCE.integratedLufs;
  const truePeak = measurement.truePeakDb <= STATIC_GK_LOUDNESS_QA_TOLERANCE.maxTruePeakDb;
  const loudnessRange = measurement.loudnessRange <= STATIC_GK_LOUDNESS_QA_TOLERANCE.maxLoudnessRange;
  return {
    measurement,
    checks: { integratedLoudness, truePeak, loudnessRange },
    passed: integratedLoudness && truePeak && loudnessRange,
  };
}

export function buildFfmpegLoudnessAnalysisArgs(inputPath: string): string[] {
  return [
    "-hide_banner",
    "-nostats",
    "-i",
    inputPath,
    "-map",
    "0:a:0",
    "-af",
    `loudnorm=I=${STATIC_GK_VOICE_LOUDNESS_POLICY.integratedLufs}:LRA=${STATIC_GK_VOICE_LOUDNESS_POLICY.loudnessRange}:TP=${STATIC_GK_VOICE_LOUDNESS_POLICY.truePeakDb}:print_format=json`,
    "-f",
    "null",
    "-",
  ];
}
