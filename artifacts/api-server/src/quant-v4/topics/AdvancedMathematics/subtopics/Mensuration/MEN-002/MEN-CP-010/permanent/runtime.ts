import {
  generateMenCp010PermanentEnglishQuestion as generateUnscheduledMenCp010PermanentEnglishQuestion,
  listMenCp010PermanentEnglishSources,
  type MenCp010PermanentEnglishQuestion,
} from "./runtime-v1";
import type { MenCp010PermanentQlId } from "./allocation";

const LABELS = ["A", "B", "C", "D"] as const;

function hash(text: string) {
  let h = 2166136261 >>> 0;
  for (const c of text) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/**
 * Permanent English questions own their answer-position schedule at the
 * permanent layer. Source-wave shuffling remains useful for discovery, but it
 * must not make a permanent QL accidentally miss A/B/C/D coverage.
 *
 * Sequential numeric seeds deliberately cycle through all four positions. For
 * arbitrary non-numeric seeds we retain a stable hash-based schedule.
 */
function scheduledCorrectIndex(qlId: MenCp010PermanentQlId, seed: string) {
  const numericSuffix = /(\d+)(?!.*\d)/.exec(seed)?.[1];
  if (numericSuffix !== undefined) return Number(BigInt(numericSuffix) % 4n);
  return hash(`${qlId}:${seed}:permanent-answer-position`) % 4;
}

function scheduleOptions(
  q: MenCp010PermanentEnglishQuestion,
  targetIndex: number,
): MenCp010PermanentEnglishQuestion {
  const correct = q.options.find((option) => option.isCorrect);
  const wrong = q.options.filter((option) => !option.isCorrect);
  if (!correct || wrong.length !== 3) {
    throw new Error(`Cannot schedule options for ${q.permanentQlId}/${q.seed}`);
  }

  let wrongIndex = 0;
  const options = LABELS.map((label, index) => {
    const source = index === targetIndex ? correct : wrong[wrongIndex++]!;
    return { ...source, label };
  });

  return {
    ...q,
    options,
    correctIndex: targetIndex,
  };
}

export function generateMenCp010PermanentEnglishQuestion(
  qlId: MenCp010PermanentQlId,
  seed: string,
): MenCp010PermanentEnglishQuestion {
  const q = generateUnscheduledMenCp010PermanentEnglishQuestion(qlId, seed);
  return scheduleOptions(q, scheduledCorrectIndex(qlId, seed));
}

export { listMenCp010PermanentEnglishSources };
export type { MenCp010PermanentEnglishQuestion };
