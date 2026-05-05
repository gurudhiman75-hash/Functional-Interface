import type {
  SeatingClue,
} from "../seating-engine";

type RemovedClue = {
  index: number;
  clue: SeatingClue;
};

export type RedundancyAnalysis = {
  minimizedClues: SeatingClue[];
  removedClues: RemovedClue[];
  removedCount: number;
  originalClueCount: number;
  minimalClueCount: number;
  redundancyScore: number;
  redundancyRatio: number;
  anchorDensity: number;
  directClueRatio: number;
};

function getAnchorClueCount(
  clues: SeatingClue[],
) {
  return clues.filter((clue) =>
    clue.type === "absolute" ||
    clue.type === "end" ||
    clue.type === "not-end",
  ).length;
}

function getDirectClueCount(
  clues: SeatingClue[],
) {
  return clues.filter((clue) =>
    clue.type === "absolute" ||
    clue.type === "end" ||
    (clue.type === "adjacent" &&
      clue.ordered) ||
    (clue.type === "offset" &&
      clue.distance === 1),
  ).length;
}

export function detectRedundantClues(
  clues: SeatingClue[],
  isClueSetStillValid: (
    candidate: SeatingClue[],
  ) => boolean,
) : RedundancyAnalysis {
  const minimized = [...clues];
  const removedClues: RemovedClue[] =
    [];
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
      removedClues.push({
        index,
        clue: minimized[index]!,
      });
      minimized.splice(index, 1);
      removedCount++;
    }
  }

  const minimalClueCount =
    minimized.length;
  const anchorDensity =
    minimalClueCount === 0
      ? 0
      : getAnchorClueCount(
          minimized,
        ) / minimalClueCount;
  const directClueRatio =
    minimalClueCount === 0
      ? 0
      : getDirectClueCount(
          minimized,
        ) / minimalClueCount;
  const redundancyRatio =
    clues.length === 0
      ? 0
      : removedCount / clues.length;

  return {
    minimizedClues: minimized,
    removedClues,
    removedCount,
    originalClueCount:
      clues.length,
    minimalClueCount,
    redundancyScore:
      redundancyRatio,
    redundancyRatio,
    anchorDensity,
    directClueRatio,
  };
}
