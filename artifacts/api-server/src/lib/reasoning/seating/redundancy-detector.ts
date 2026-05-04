import type {
  SeatingClue,
} from "../seating-engine";

export type RedundancyAnalysis = {
  minimizedClues: SeatingClue[];
  removedCount: number;
  redundancyScore: number;
};

export function detectRedundantClues(
  clues: SeatingClue[],
  isClueSetStillValid: (
    candidate: SeatingClue[],
  ) => boolean,
) : RedundancyAnalysis {
  const minimized = [...clues];
  let removedCount = 0;

  for (
    let index = minimized.length - 1;
    index >= 0;
    index--
  ) {
    const candidate =
      minimized.filter(
        (_clue, clueIndex) =>
          clueIndex !== index,
      );

    if (
      isClueSetStillValid(
        candidate,
      )
    ) {
      minimized.splice(index, 1);
      removedCount++;
    }
  }

  return {
    minimizedClues: minimized,
    removedCount,
    redundancyScore:
      clues.length === 0
        ? 0
        : removedCount / clues.length,
  };
}
