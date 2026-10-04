import type { TsdCp004CoreSolution } from "./relative-motion-foundation";
import { SeededRng, hashSeed } from "../cp003/generation-support";
import { formatCp004Answer, reviewUnit } from "./distractors";
import type { TsdCp004Difficulty, TsdCp004OptionAudit, TsdCp004WrongWorking } from "./runtime-types";

export function cp004DifficultyForAuthority(authorityKey: string): TsdCp004Difficulty {
  if (["relativeSpeedBetweenTwoBodies", "relativeDistanceFromRelativeMotion", "speedRatioFromFirstMeetingPoint"].includes(authorityKey)) return "EASY";
  if (["delayedStartPursuitState", "requiredSpeedForTargetMeeting"].includes(authorityKey)) return "HARD";
  return "MEDIUM";
}

function correctPosition(permanentQlId: string, seed: string): number {
  const ql = Number(permanentQlId.slice(-3));
  return (hashSeed(seed) + ql) % 4;
}

export function buildCp004Options(
  solution: TsdCp004CoreSolution,
  wrongWorkings: readonly TsdCp004WrongWorking[],
  permanentQlId: string,
  seed: string,
): Readonly<{ options: readonly string[]; audit: readonly TsdCp004OptionAudit[]; correctIndex: number }> {
  const unit = reviewUnit(solution);
  const correctText = formatCp004Answer(solution.answer, unit);
  const rng = new SeededRng(`${permanentQlId}:${seed}:wrong-order`);
  const wrongs = rng.shuffle(wrongWorkings).slice(0, 3);
  const position = correctPosition(permanentQlId, seed);
  const entries: TsdCp004OptionAudit[] = wrongs.map((working) => ({
    text: formatCp004Answer(working.value, unit),
    misconceptionId: working.misconceptionId,
    isCorrect: false,
    wrongWorking: working,
    applicability: "EXACT_METHOD",
  }));
  entries.splice(position, 0, {
    text: correctText,
    misconceptionId: "CORRECT",
    isCorrect: true,
    wrongWorking: null,
    applicability: "CORRECT",
  });
  return Object.freeze({
    options: Object.freeze(entries.map((entry) => entry.text)),
    audit: Object.freeze(entries.map((entry) => Object.freeze(entry))),
    correctIndex: position,
  });
}
