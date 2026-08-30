import type { StaticGkSceneLayer, StaticGkSceneViewport } from "../scenes/types";

export type StaticGkLessonShotRole =
  | "hook"
  | "map-intro"
  | "concept"
  | "sequence"
  | "recap"
  | "exam-takeaway"
  | "quiz";

export interface StaticGkLessonVisualAction {
  layer: StaticGkSceneLayer;
  action: "show" | "trace" | "highlight" | "label" | "hold" | "quiz";
  targetRef?: string;
  text?: string;
}

export interface StaticGkLessonShot {
  id: string;
  startMs: number;
  endMs: number;
  role: StaticGkLessonShotRole;
  headline?: string;
  supportingText?: string[];
  narrationRef?: string;
  factIds: string[];
  actions: StaticGkLessonVisualAction[];
}

export interface StaticGkLessonManifest {
  schemaVersion: "1.0";
  manifestVersion: "1.0";
  visualId: string;
  title: string;
  categoryTag: "STATIC GK · INDIA GEOGRAPHY";
  durationMs: number;
  viewport: StaticGkSceneViewport;
  learningObjectives: string[];
  shots: StaticGkLessonShot[];
}

export function validateLessonManifest(manifest: StaticGkLessonManifest): void {
  if (!Number.isInteger(manifest.durationMs) || manifest.durationMs <= 0) {
    throw new Error(`${manifest.visualId}: durationMs must be a positive integer`);
  }
  if (manifest.shots.length === 0) throw new Error(`${manifest.visualId}: no lesson shots`);

  let previousEnd = 0;
  const ids = new Set<string>();
  for (const shot of manifest.shots) {
    if (ids.has(shot.id)) throw new Error(`${manifest.visualId}: duplicate shot id ${shot.id}`);
    ids.add(shot.id);
    if (!Number.isInteger(shot.startMs) || !Number.isInteger(shot.endMs) || shot.startMs < 0 || shot.endMs <= shot.startMs) {
      throw new Error(`${manifest.visualId}: invalid timing for ${shot.id}`);
    }
    if (shot.startMs !== previousEnd) {
      throw new Error(`${manifest.visualId}: shots must be contiguous at ${shot.id}`);
    }
    if (shot.factIds.length === 0) throw new Error(`${manifest.visualId}: ${shot.id} has no fact binding`);
    if (shot.actions.length === 0) throw new Error(`${manifest.visualId}: ${shot.id} has no visual action`);
    previousEnd = shot.endMs;
  }

  if (previousEnd !== manifest.durationMs) {
    throw new Error(`${manifest.visualId}: final shot must end at durationMs`);
  }
}
