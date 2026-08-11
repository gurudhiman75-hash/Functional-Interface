import { createHash } from "node:crypto";

import {
  buildRnkCp005EditorialV3State,
  classifyRnkCp005EditorialV3Relation,
  generateRnkCp005EditorialV3Question as generateCoreV3Question,
  RNK_CP005_EDITORIAL_V3_REJECTED_SOURCE_FORMS,
  RNK_CP005_EDITORIAL_V3_SOURCE_FORMS,
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS,
  RNK_CP005_V3_TOPOLOGIES,
  shortestRnkCp005EditorialV3Path,
  type RnkCp005EditorialV3Question,
  type RnkCp005EditorialV3SourceForm,
  type RnkCp005EditorialV3State,
  type RnkCp005PairStatusMode,
  type RnkCp005V3Topology,
} from "./cp005-partial-order-editorial-v3";
import {
  generateRnkCp005DiscoveryQuestion,
  type RnkCp005Difficulty,
  type RnkCp005Option,
} from "./cp005-partial-order-runtime";

export {
  buildRnkCp005EditorialV3State,
  classifyRnkCp005EditorialV3Relation,
  RNK_CP005_EDITORIAL_V3_REJECTED_SOURCE_FORMS,
  RNK_CP005_EDITORIAL_V3_SOURCE_FORMS,
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS,
  RNK_CP005_V3_TOPOLOGIES,
  shortestRnkCp005EditorialV3Path,
};
export type {
  RnkCp005EditorialV3Question,
  RnkCp005EditorialV3SourceForm,
  RnkCp005EditorialV3State,
  RnkCp005PairStatusMode,
  RnkCp005V3Topology,
};

export const RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_FINAL_VERSION =
  "RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_FINAL" as const;

function rotate<T>(items: readonly T[], amount: number): readonly T[] {
  if (items.length === 0) return [];
  const shift = ((amount % items.length) + items.length) % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

function directEdge(
  state: RnkCp005EditorialV3State,
  first: string,
  second: string,
): boolean {
  return state.edges.some(
    (edge) => edge.higher === first && edge.lower === second,
  );
}

function witness(
  state: RnkCp005EditorialV3State,
  first: string,
  second: string,
  firstAbove: boolean,
): readonly string[] | undefined {
  return state.validOrders.find((order) =>
    firstAbove
      ? order.indexOf(first) < order.indexOf(second)
      : order.indexOf(second) < order.indexOf(first),
  );
}

function pairDistanceSet(
  state: RnkCp005EditorialV3State,
  first: string,
  second: string,
): readonly number[] {
  return [...new Set(
    state.validOrders.map((order) =>
      Math.abs(order.indexOf(first) - order.indexOf(second)),
    ),
  )].sort((a, b) => a - b);
}

function moveCorrectOption(
  options: readonly RnkCp005Option[],
  desiredIndex: number,
): { readonly options: readonly RnkCp005Option[]; readonly correctIndex: number } {
  const output = [...options];
  const currentIndex = output.findIndex((option) => option.truth);
  if (
    currentIndex < 0 ||
    output.filter((option) => option.truth).length !== 1
  ) {
    throw new Error("Expected exactly one correct pair-status option");
  }
  const [correct] = output.splice(currentIndex, 1);
  output.splice(desiredIndex, 0, correct!);
  return { options: output, correctIndex: desiredIndex };
}

function pairDifficulty(
  state: RnkCp005EditorialV3State,
  first: string,
  second: string,
): RnkCp005Difficulty {
  const classification = classifyRnkCp005EditorialV3Relation(
    state,
    first,
    second,
  );
  if (classification === "VARIABLE") return "MEDIUM";
  const path = classification === "DEFINITE"
    ? shortestRnkCp005EditorialV3Path(state, first, second)
    : shortestRnkCp005EditorialV3Path(state, second, first);
  return path && path.length >= 5 ? "HARD" : "MEDIUM";
}

function topologySchedule(
  prototypeIndex: number,
  ordinal: number,
): readonly RnkCp005V3Topology[] {
  const preferredIndex =
    (prototypeIndex * 3 + ordinal) % RNK_CP005_V3_TOPOLOGIES.length;
  return rotate(RNK_CP005_V3_TOPOLOGIES, preferredIndex);
}

function buildCorrectedPairQuestion(
  ordinal: number,
): RnkCp005EditorialV3Question {
  const prototypeId = "PAIR_RELATION_CANNOT_BE_DETERMINED" as const;
  const prototypeIndex = RNK_CP005_EDITORIAL_V3_SOURCE_FORMS.indexOf(prototypeId);
  const desiredMode: RnkCp005PairStatusMode =
    (["FIRST_ABOVE", "SECOND_ABOVE", "INDETERMINATE"] as const)[
      ordinal % 3
    ]!;
  const startSeed = prototypeIndex * 10_000_000 + ordinal * 100_000;

  for (const topology of topologySchedule(prototypeIndex, ordinal)) {
    for (let offset = 0; offset < 20_000; offset += 1) {
      const seed = startSeed + offset;
      const state = buildRnkCp005EditorialV3State(seed, topology);
      if (!state) continue;
      const pairs: { first: string; second: string }[] = [];

      for (let index = 0; index < state.entities.length; index += 1) {
        for (let other = index + 1; other < state.entities.length; other += 1) {
          const first = state.entities[index]!;
          const second = state.entities[other]!;
          const classification = classifyRnkCp005EditorialV3Relation(
            state,
            first,
            second,
          );
          const distances = pairDistanceSet(state, first, second);
          if (distances.length === 1 && distances[0] === 1) continue;

          if (desiredMode === "INDETERMINATE") {
            if (classification === "VARIABLE") pairs.push({ first, second });
            continue;
          }

          if (desiredMode === "FIRST_ABOVE") {
            if (classification !== "DEFINITE") continue;
            const path = shortestRnkCp005EditorialV3Path(state, first, second);
            if (!path || path.length < 3 || directEdge(state, first, second)) continue;
            pairs.push({ first, second });
            continue;
          }

          if (classification !== "IMPOSSIBLE") continue;
          const reversePath = shortestRnkCp005EditorialV3Path(
            state,
            second,
            first,
          );
          if (
            !reversePath ||
            reversePath.length < 3 ||
            directEdge(state, second, first)
          ) {
            continue;
          }
          pairs.push({ first, second });
        }
      }

      const pair = rotate(pairs, seed + ordinal)[0];
      if (!pair) continue;
      const classification = classifyRnkCp005EditorialV3Relation(
        state,
        pair.first,
        pair.second,
      );
      const distances = pairDistanceSet(state, pair.first, pair.second);
      const firstWitness = witness(state, pair.first, pair.second, true);
      const secondWitness = witness(state, pair.first, pair.second, false);

      const options: RnkCp005Option[] = [
        {
          label: `${pair.first} must rank above ${pair.second}.`,
          truth: classification === "DEFINITE",
          explanation:
            classification === "DEFINITE"
              ? `${shortestRnkCp005EditorialV3Path(state, pair.first, pair.second)!.join(" > ")} forces this order.`
              : `${secondWitness!.join(" > ")} is a valid ranking with ${pair.second} above ${pair.first}.`,
        },
        {
          label: `${pair.second} must rank above ${pair.first}.`,
          truth: classification === "IMPOSSIBLE",
          explanation:
            classification === "IMPOSSIBLE"
              ? `${shortestRnkCp005EditorialV3Path(state, pair.second, pair.first)!.join(" > ")} forces this order.`
              : `${firstWitness!.join(" > ")} is a valid ranking with ${pair.first} above ${pair.second}.`,
        },
        {
          label: "Their relative ranks cannot be determined uniquely.",
          truth: classification === "VARIABLE",
          explanation:
            classification === "VARIABLE"
              ? "Both relative orders occur in valid rankings."
              : "The comparison chain fixes their relative order.",
        },
        {
          label: `${pair.first} and ${pair.second} must be consecutive in the ranking.`,
          truth: false,
          explanation:
            distances.length === 1
              ? `Their fixed separation is ${distances[0]} rank places, not consecutive.`
              : "Their separation changes across valid rankings, so consecutiveness is not compulsory.",
        },
      ];
      if (options.filter((option) => option.truth).length !== 1) continue;
      const positioned = moveCorrectOption(options, ordinal % 4);

      let answer: string;
      let explanation: readonly string[];
      if (classification === "DEFINITE") {
        const path = shortestRnkCp005EditorialV3Path(
          state,
          pair.first,
          pair.second,
        )!;
        answer = `${pair.first} must rank above ${pair.second}`;
        explanation = [
          `Link the comparisons: ${path.join(" > ")}.`,
          `Therefore ${pair.first} must rank above ${pair.second}.`,
        ];
      } else if (classification === "IMPOSSIBLE") {
        const path = shortestRnkCp005EditorialV3Path(
          state,
          pair.second,
          pair.first,
        )!;
        answer = `${pair.second} must rank above ${pair.first}`;
        explanation = [
          `Link the comparisons: ${path.join(" > ")}.`,
          `Therefore ${pair.second} must rank above ${pair.first}.`,
        ];
      } else {
        answer = "Their relative ranks cannot be determined uniquely";
        explanation = [
          `${firstWitness!.join(" > ")} satisfies every statement and places ${pair.first} above ${pair.second}.`,
          `${secondWitness!.join(" > ")} also satisfies every statement but places ${pair.second} above ${pair.first}.`,
          "Since both orders are possible, their relative ranks cannot be determined uniquely.",
        ];
      }

      const base = generateRnkCp005DiscoveryQuestion(prototypeId, seed);
      const fingerprint = createHash("sha256")
        .update(
          JSON.stringify({
            version: RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_FINAL_VERSION,
            prototypeId,
            authorityCandidateId: "RELATION_TRUTH_STATUS",
            topology,
            pairStatusMode: desiredMode,
            seed,
            edges: state.edges,
            pair,
            answer,
            options: positioned.options.map((option) => option.label),
            explanation,
          }),
          "utf8",
        )
        .digest("hex");

      return {
        ...base,
        authorityCandidateId: "RELATION_TRUTH_STATUS",
        v3Topology: topology,
        pairStatusMode: desiredMode,
        context: state.context,
        difficulty: pairDifficulty(state, pair.first, pair.second),
        instruction: `${state.entities.length} people are ranked from highest rank to lowest rank.`,
        clues: state.edges.map(
          (edge) => `${edge.higher} is ranked above ${edge.lower}.`,
        ),
        stem: `What can be concluded about the relative ranks of ${pair.first} and ${pair.second}?`,
        options: positioned.options,
        correctIndex: positioned.correctIndex,
        answer,
        explanation,
        validOrderCount: state.validOrders.length,
        exampleValidOrders: state.validOrders.slice(0, 3),
        mathematicalFingerprint: fingerprint,
      };
    }
  }

  throw new Error(`PAIR_RELATION_CANNOT_BE_DETERMINED:${ordinal}: no corrected V3 candidate found`);
}

export function generateRnkCp005EditorialV3FinalQuestion(
  prototypeId: RnkCp005EditorialV3SourceForm,
  ordinal: number,
): RnkCp005EditorialV3Question {
  if (prototypeId === "PAIR_RELATION_CANNOT_BE_DETERMINED") {
    return buildCorrectedPairQuestion(ordinal);
  }
  return generateCoreV3Question(prototypeId, ordinal);
}

export function buildRnkCp005EditorialV3FinalCorpus(
  questionsPerSourceForm = 24,
): readonly RnkCp005EditorialV3Question[] {
  return RNK_CP005_EDITORIAL_V3_SOURCE_FORMS.flatMap((prototypeId) =>
    Array.from({ length: questionsPerSourceForm }, (_, ordinal) =>
      generateRnkCp005EditorialV3FinalQuestion(prototypeId, ordinal),
    ),
  );
}
