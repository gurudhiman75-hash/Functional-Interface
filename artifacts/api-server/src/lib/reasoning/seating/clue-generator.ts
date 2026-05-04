import type {
  DifficultyLabel,
} from "../../core/generator-engine";
import type {
  SeatingClue,
} from "../seating-engine";
import {
  buildClueGraphAnalysis,
  getClueReasoningWeight,
} from "./clue-graph";

export type CandidateClue = {
  clue: SeatingClue;
  score: number;
  interactionPotential: number;
  participantCoverage: number;
};

function getClueParticipants(
  clue: SeatingClue,
) {
  switch (clue.type) {
    case "absolute":
    case "end":
    case "not-end":
      return [clue.person];
    case "adjacent":
    case "not-adjacent":
    case "distance-gap":
    case "same-row":
    case "different-row":
    case "facing":
    case "not-facing":
    case "opposite":
    case "not-opposite":
      return [clue.left, clue.right];
    case "offset":
      return [clue.anchor, clue.person];
    case "between":
    case "adjacent-both":
      return [
        clue.middle,
        clue.first,
        clue.second,
      ];
    default:
      return [];
  }
}

function getDifficultyPreference(
  clue: SeatingClue,
  difficulty: DifficultyLabel,
) {
  if (difficulty === "Easy") {
    return clue.type === "absolute" ||
      clue.type === "end" ||
      clue.type === "offset"
      ? 0.35
      : clue.type === "adjacent" &&
          clue.ordered
        ? 0.2
        : 0;
  }

  if (difficulty === "Hard") {
    return [
      "between",
      "adjacent-both",
      "not-adjacent",
      "not-opposite",
      "not-facing",
      "different-row",
      "distance-gap",
    ].includes(clue.type)
      ? 0.75
      : clue.type === "offset" &&
          clue.distance >= 2
        ? 0.5
        : clue.type === "adjacent" &&
            clue.ordered
          ? -0.75
          : clue.type === "absolute"
            ? -0.9
            : 0;
  }

  return [
    "distance-gap",
    "between",
    "not-adjacent",
    "opposite",
    "facing",
  ].includes(clue.type)
    ? 0.35
    : clue.type === "adjacent" &&
        clue.ordered
      ? -0.35
      : clue.type === "absolute"
        ? -0.45
        : 0;
}

export function buildCandidateCluePool(
  pool: SeatingClue[],
  participants: string[],
  difficulty: DifficultyLabel,
) {
  const participantFrequency =
    new Map<string, number>();

  for (const clue of pool) {
    for (const participant of getClueParticipants(
      clue,
    )) {
      participantFrequency.set(
        participant,
        (participantFrequency.get(
          participant,
        ) ?? 0) + 1,
      );
    }
  }

  const baselineAnalysis =
    buildClueGraphAnalysis(
      pool,
      "linear",
      "north",
    );

  const candidates = pool.map(
    (clue) => {
      const clueParticipants =
        getClueParticipants(clue);
      const interactionPotential =
        clueParticipants.length === 0
          ? 0
          : clueParticipants.reduce(
              (sum, participant) =>
                sum +
                (participantFrequency.get(
                  participant,
                ) ?? 0),
              0,
            ) /
            clueParticipants.length;
      const participantCoverage =
        clueParticipants.length /
        Math.max(
          participants.length,
          1,
        );
      const score =
        getClueReasoningWeight(clue) +
        getDifficultyPreference(
          clue,
          difficulty,
        ) +
        Math.min(
          interactionPotential /
            Math.max(
              pool.length,
              1,
            ),
          0.85,
        ) +
        participantCoverage -
        (baselineAnalysis.repeatedAdjacencySerialization &&
        clue.type === "adjacent" &&
        clue.ordered
          ? 0.75
          : 0);

      return {
        clue,
        score,
        interactionPotential,
        participantCoverage,
      } satisfies CandidateClue;
    },
  );

  return candidates.sort(
    (left, right) =>
      right.score - left.score,
  );
}
