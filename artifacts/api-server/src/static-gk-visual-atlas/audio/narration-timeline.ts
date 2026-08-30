import type { StaticGkFactLockPack, StaticGkNarrationBeatDraft } from "../fact-packs/types";
import type { StaticGkLessonManifest, StaticGkLessonShot } from "../lesson-manifests/types";
import { validateLessonManifest } from "../lesson-manifests/types";

export const NARRATION_SPEED_REVIEW_WPM = 210;

export interface StaticGkNarrationWindow {
  id: string;
  purpose: StaticGkNarrationBeatDraft["purpose"];
  text: string;
  factIds: string[];
  targetIds: string[];
  anchorShotId: string;
  shotIds: string[];
  startMs: number;
  endMs: number;
  windowDurationMs: number;
  wordCount: number;
  requiredWordsPerMinute: number;
  speedQa: "ok" | "review";
}

interface ExpandedRange {
  beat: StaticGkNarrationBeatDraft;
  anchorIndex: number;
  startIndex: number;
  endIndex: number;
}

function sharesNarrationFact(shot: StaticGkLessonShot, beat: StaticGkNarrationBeatDraft): boolean {
  const beatFacts = new Set(beat.factIds);
  return shot.factIds.some((factId) => beatFacts.has(factId));
}

function countWords(text: string): number {
  return text.trim().split(/\s+/u).filter(Boolean).length;
}

function formatTimestamp(ms: number, decimalSeparator: "." | ","): string {
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  const millis = ms % 1000;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}${decimalSeparator}${String(millis).padStart(3, "0")}`;
}

function captionText(text: string): string {
  return text.replace(/\s+/gu, " ").trim();
}

export function compileNarrationWindows(
  manifest: StaticGkLessonManifest,
  factPack: StaticGkFactLockPack,
): StaticGkNarrationWindow[] {
  validateLessonManifest(manifest);
  if (manifest.visualId !== factPack.visualId) {
    throw new Error(`Narration manifest ${manifest.visualId} does not match fact pack ${factPack.visualId}`);
  }

  const beatById = new Map<string, StaticGkNarrationBeatDraft>();
  for (const beat of factPack.narration) {
    if (beatById.has(beat.id)) throw new Error(`${factPack.visualId}: duplicate narration beat ${beat.id}`);
    beatById.set(beat.id, beat);
  }

  const anchorIndexByBeat = new Map<string, number>();
  manifest.shots.forEach((shot, index) => {
    if (!shot.narrationRef) return;
    if (!beatById.has(shot.narrationRef)) {
      throw new Error(`${manifest.visualId}: ${shot.id} references unknown narration ${shot.narrationRef}`);
    }
    if (anchorIndexByBeat.has(shot.narrationRef)) {
      throw new Error(`${manifest.visualId}: narration ${shot.narrationRef} is anchored more than once`);
    }
    anchorIndexByBeat.set(shot.narrationRef, index);
  });

  const ranges: ExpandedRange[] = factPack.narration.map((beat) => {
    const anchorIndex = anchorIndexByBeat.get(beat.id);
    if (anchorIndex === undefined) throw new Error(`${manifest.visualId}: narration ${beat.id} has no shot anchor`);

    let startIndex = anchorIndex;
    while (startIndex > 0) {
      const previous = manifest.shots[startIndex - 1];
      if (previous.narrationRef || !sharesNarrationFact(previous, beat)) break;
      startIndex -= 1;
    }

    let endIndex = anchorIndex;
    while (endIndex + 1 < manifest.shots.length) {
      const next = manifest.shots[endIndex + 1];
      if (next.narrationRef || !sharesNarrationFact(next, beat)) break;
      endIndex += 1;
    }

    return { beat, anchorIndex, startIndex, endIndex };
  }).sort((a, b) => a.anchorIndex - b.anchorIndex);

  for (let index = 0; index + 1 < ranges.length; index += 1) {
    const current = ranges[index];
    const next = ranges[index + 1];
    if (current.endIndex >= next.startIndex) {
      current.endIndex = next.startIndex - 1;
      if (current.endIndex < current.anchorIndex) {
        throw new Error(`${manifest.visualId}: narration windows overlap at ${current.beat.id}/${next.beat.id}`);
      }
    }
  }

  const windows = ranges.map(({ beat, anchorIndex, startIndex, endIndex }) => {
    const startMs = manifest.shots[startIndex].startMs;
    const endMs = manifest.shots[endIndex].endMs;
    const windowDurationMs = endMs - startMs;
    const wordCount = countWords(beat.text);
    const requiredWordsPerMinute = Math.ceil((wordCount * 60_000) / windowDurationMs);
    return {
      id: beat.id,
      purpose: beat.purpose,
      text: beat.text,
      factIds: [...beat.factIds],
      targetIds: [...beat.targetIds],
      anchorShotId: manifest.shots[anchorIndex].id,
      shotIds: manifest.shots.slice(startIndex, endIndex + 1).map((shot) => shot.id),
      startMs,
      endMs,
      windowDurationMs,
      wordCount,
      requiredWordsPerMinute,
      speedQa: requiredWordsPerMinute > NARRATION_SPEED_REVIEW_WPM ? "review" as const : "ok" as const,
    };
  });

  for (let index = 0; index + 1 < windows.length; index += 1) {
    if (windows[index].endMs > windows[index + 1].startMs) {
      throw new Error(`${manifest.visualId}: compiled narration windows overlap`);
    }
  }

  return windows;
}

export function renderNarrationWindowsVtt(windows: readonly StaticGkNarrationWindow[]): string {
  const cues = windows.map((window) => [
    window.id,
    `${formatTimestamp(window.startMs, ".")} --> ${formatTimestamp(window.endMs, ".")}`,
    captionText(window.text),
  ].join("\n"));
  return `WEBVTT\n\n${cues.join("\n\n")}\n`;
}

export function renderNarrationWindowsSrt(windows: readonly StaticGkNarrationWindow[]): string {
  const cues = windows.map((window, index) => [
    String(index + 1),
    `${formatTimestamp(window.startMs, ",")} --> ${formatTimestamp(window.endMs, ",")}`,
    captionText(window.text),
  ].join("\n"));
  return `${cues.join("\n\n")}\n`;
}
