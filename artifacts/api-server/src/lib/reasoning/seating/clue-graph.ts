import type {
  SeatingArrangementType,
  SeatingClue,
  SeatingOrientationType,
} from "../seating-engine";

export type ClueTypeDistribution =
  Record<string, number>;

export type ClueGraphEdge = {
  from: number;
  to: number;
  reason:
    | "shared-participant"
    | "shared-anchor"
    | "same-family";
  weight: number;
};

export type ClueGraphAnalysis = {
  density: number;
  interactionRatio: number;
  adjacencySerializationScore: number;
  repeatedAdjacencySerialization: boolean;
  adjacencyChainLength: number;
  directClueRatio: number;
  clueTypeDistribution: ClueTypeDistribution;
  clueSignature: string;
  inferenceSignature: string;
  topologyTokens: string[];
  clueTokens: string[];
  inferenceTokens: string[];
  topologySignature: string;
};

function getClueTypeKey(
  clue: SeatingClue,
) {
  return clue.type === "adjacent" &&
    clue.ordered
    ? "adjacent-ordered"
    : clue.type === "adjacent"
      ? "adjacent-unordered"
      : clue.type;
}

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

function getClueFamily(
  clue: SeatingClue,
) {
  switch (clue.type) {
    case "absolute":
    case "end":
    case "not-end":
      return "anchor";
    case "adjacent":
    case "not-adjacent":
    case "between":
    case "adjacent-both":
      return "adjacency";
    case "offset":
    case "distance-gap":
      return "distance";
    case "opposite":
    case "not-opposite":
    case "facing":
    case "not-facing":
      return "orientation";
    case "same-row":
    case "different-row":
      return "row";
    default:
      return clue.type;
  }
}

function buildDistribution(
  clues: SeatingClue[],
) {
  return clues.reduce(
    (accumulator, clue) => {
      const key = getClueTypeKey(
        clue,
      );
      accumulator[key] =
        (accumulator[key] ?? 0) + 1;
      return accumulator;
    },
    {} as ClueTypeDistribution,
  );
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

function buildEdges(
  clues: SeatingClue[],
) {
  const edges: ClueGraphEdge[] = [];

  for (
    let leftIndex = 0;
    leftIndex < clues.length;
    leftIndex++
  ) {
    for (
      let rightIndex =
        leftIndex + 1;
      rightIndex < clues.length;
      rightIndex++
    ) {
      const left =
        clues[leftIndex]!;
      const right =
        clues[rightIndex]!;
      const leftParticipants =
        getClueParticipants(
          left,
        );
      const rightParticipants =
        getClueParticipants(
          right,
        );
      const sharedParticipants =
        leftParticipants.filter(
          (participant) =>
            rightParticipants.includes(
              participant,
            ),
        ).length;

      if (sharedParticipants > 0) {
        edges.push({
          from: leftIndex,
          to: rightIndex,
          reason:
            sharedParticipants > 1
              ? "shared-anchor"
              : "shared-participant",
          weight: sharedParticipants,
        });
        continue;
      }

      if (
        getClueFamily(left) ===
        getClueFamily(right)
      ) {
        edges.push({
          from: leftIndex,
          to: rightIndex,
          reason: "same-family",
          weight: 0.25,
        });
      }
    }
  }

  return edges;
}

function getAdjacencyChainLength(
  clues: SeatingClue[],
) {
  const outgoing = new Map<
    string,
    Set<string>
  >();

  for (const clue of clues) {
    if (
      clue.type !== "adjacent" ||
      !clue.ordered
    ) {
      continue;
    }

    const targets =
      outgoing.get(clue.left) ??
      new Set<string>();
    targets.add(clue.right);
    outgoing.set(clue.left, targets);
  }

  let longestChain = 0;

  const dfs = (
    node: string,
    seen: Set<string>,
  ): number => {
    const next =
      outgoing.get(node);

    if (!next?.size) {
      return 1;
    }

    let longest = 1;

    for (const candidate of next) {
      if (seen.has(candidate)) {
        continue;
      }

      longest = Math.max(
        longest,
        1 +
          dfs(
            candidate,
            new Set([
              ...seen,
              candidate,
            ]),
          ),
      );
    }

    return longest;
  };

  for (const node of outgoing.keys()) {
    longestChain = Math.max(
      longestChain,
      dfs(node, new Set([node])),
    );
  }

  return longestChain;
}

export function getClueReasoningWeight(
  clue: SeatingClue,
) {
  if (
    typeof clue.weight ===
    "number"
  ) {
    return clue.weight;
  }

  const operatorWeight =
    clue.operator === "NOT_EQUALS"
      ? 2.5
      : 1;

  switch (clue.type) {
    case "adjacent":
      return Math.max(
        operatorWeight,
        clue.ordered ? 1 : 1.4,
      );
    case "offset":
      return Math.max(
        operatorWeight,
        clue.distance === 1
          ? 1.8
          : clue.distance === 2
            ? 2.3
            : 2.7,
      );
    case "distance-gap":
      return Math.max(
        operatorWeight,
        2.5,
      );
    case "between":
    case "adjacent-both":
      return Math.max(
        operatorWeight,
        3,
      );
    case "not-adjacent":
    case "not-opposite":
    case "different-row":
    case "not-facing":
    case "not-end":
      return Math.max(
        operatorWeight,
        3,
      );
    case "opposite":
    case "same-row":
    case "facing":
      return Math.max(
        operatorWeight,
        2.3,
      );
    case "end":
      return Math.max(
        operatorWeight,
        1.2,
      );
    case "absolute":
      return Math.max(
        operatorWeight,
        0.8,
      );
    default:
      return Math.max(
        operatorWeight,
        1.5,
      );
  }
}

export function buildClueGraphAnalysis(
  clues: SeatingClue[],
  arrangementType: SeatingArrangementType,
  orientationType: SeatingOrientationType,
) : ClueGraphAnalysis {
  const edges = buildEdges(clues);
  const maxEdges =
    clues.length <= 1
      ? 1
      : (clues.length *
          (clues.length - 1)) /
        2;
  const density =
    edges.length / maxEdges;
  const connectedClues =
    new Set(
      edges.flatMap((edge) => [
        edge.from,
        edge.to,
      ]),
    ).size;
  const interactionRatio =
    clues.length === 0
      ? 0
      : connectedClues / clues.length;
  const adjacencyChainLength =
    getAdjacencyChainLength(clues);
  const adjacencySerializationScore =
    clues.filter(
      (clue) =>
        clue.type === "adjacent" &&
        clue.ordered,
    ).length /
    Math.max(clues.length, 1);
  const directClueRatio =
    getDirectClueCount(clues) /
    Math.max(clues.length, 1);
  const repeatedAdjacencySerialization =
    adjacencyChainLength >= 4 ||
    (adjacencyChainLength >= 3 &&
      adjacencySerializationScore >=
        0.55);
  const clueTypeDistribution =
    buildDistribution(clues);
  const sortedDistribution =
    Object.entries(
      clueTypeDistribution,
    ).sort(([left], [right]) =>
      left.localeCompare(right),
    );
  const topologyTokens = [
    `layout:${arrangementType}`,
    `orientation:${orientationType}`,
    `chain:${adjacencyChainLength}`,
    `density:${density.toFixed(2)}`,
    `interaction:${interactionRatio.toFixed(2)}`,
  ];
  const clueTokens = sortedDistribution.map(
    ([type, count]) =>
      `${type}:${count}`,
  );
  const inferenceTokens = clues.map(
    (clue) =>
      `${getClueFamily(clue)}:${getClueReasoningWeight(clue).toFixed(1)}:${clue.operator ?? "EQUALS"}`,
  );
  const topologySignature = [
    ...topologyTokens,
    clueTokens.join(","),
  ].join("|");
  const clueSignature = [
    `direct:${directClueRatio.toFixed(2)}`,
    clueTokens.join(","),
  ].join("|");
  const inferenceSignature = [
    `adjacency:${adjacencySerializationScore.toFixed(2)}`,
    `direct:${directClueRatio.toFixed(2)}`,
    [...inferenceTokens].sort().join(","),
  ].join("|");

  return {
    density,
    interactionRatio,
    adjacencySerializationScore,
    repeatedAdjacencySerialization,
    adjacencyChainLength,
    directClueRatio,
    clueTypeDistribution,
    clueSignature,
    inferenceSignature,
    topologyTokens,
    clueTokens,
    inferenceTokens,
    topologySignature,
  };
}
