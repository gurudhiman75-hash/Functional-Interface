import { createHash } from "node:crypto";

import {
  buildRnkCp005EditorialV3State,
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
import type { RnkCp005Difficulty, RnkCp005Option } from "./cp005-partial-order-runtime";

export {
  buildRnkCp005EditorialV3State,
  classifyRnkCp005EditorialV3Relation,
  RNK_CP005_EDITORIAL_V3_REJECTED_SOURCE_FORMS,
  RNK_CP005_EDITORIAL_V3_SOURCE_FORMS,
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS,
  RNK_CP005_V3_TOPOLOGIES,
  shortestRnkCp005EditorialV3Path,
} from "./cp005-partial-order-editorial-v3";
export type {
  RnkCp005EditorialV3Question,
  RnkCp005EditorialV3SourceForm,
  RnkCp005EditorialV3State,
  RnkCp005PairStatusMode,
  RnkCp005V3Topology,
} from "./cp005-partial-order-editorial-v3";

export const RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_APPROVED_VERSION =
  "RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_APPROVED" as const;

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

function parsePairStem(stem: string): { first: string; second: string } {
  const match = stem.match(/relative ranks of (.+?) and (.+?)\?$/i);
  if (!match) throw new Error(`Pair-status stem did not parse: ${stem}`);
  return { first: match[1]!.trim(), second: match[2]!.trim() };
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

function pairDifficulty(pathLength: number): RnkCp005Difficulty {
  return pathLength >= 5 ? "HARD" : "MEDIUM";
}

function reFingerprint(
  question: RnkCp005EditorialV3Question,
): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        version: RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_APPROVED_VERSION,
        prototypeId: question.prototypeId,
        authorityCandidateId: question.authorityCandidateId,
        topology: question.v3Topology,
        pairStatusMode: question.pairStatusMode,
        seed: question.seed,
        clues: question.clues,
        stem: question.stem,
        options: question.options.map((option) => option.label),
        answer: question.answer,
        explanation: question.explanation,
      }),
      "utf8",
    )
    .digest("hex");
}

function generatePairStatusQuestion(
  ordinal: number,
): RnkCp005EditorialV3Question {
  const desiredMode: RnkCp005PairStatusMode =
    (["FIRST_ABOVE", "SECOND_ABOVE", "INDETERMINATE"] as const)[
      ordinal % 3
    ]!;

  if (desiredMode !== "SECOND_ABOVE") {
    const question = generateCoreV3Question(
      "PAIR_RELATION_CANNOT_BE_DETERMINED",
      ordinal,
    );
    const approved = {
      ...question,
      pairStatusMode: desiredMode,
    } as RnkCp005EditorialV3Question;
    return {
      ...approved,
      mathematicalFingerprint: reFingerprint(approved),
    };
  }

  // Core V3 deliberately chooses a transitive FIRST_ABOVE relation. For the
  // SECOND_ABOVE mode, preserve that valid mathematical state but reverse only
  // the pair orientation presented to the learner. This makes the second named
  // person the compulsory higher-ranked person without changing any clue.
  const surrogateOrdinal = 300 + ordinal * 3;
  const base = generateCoreV3Question(
    "PAIR_RELATION_CANNOT_BE_DETERMINED",
    surrogateOrdinal,
  );
  const basePair = parsePairStem(base.stem);
  const state = buildRnkCp005EditorialV3State(base.seed, base.v3Topology);
  if (!state) throw new Error(`${base.discoveryId}: missing V3 state`);
  const path = shortestRnkCp005EditorialV3Path(
    state,
    basePair.first,
    basePair.second,
  );
  if (!path || path.length < 3) {
    throw new Error(`${base.discoveryId}: surrogate pair lacks transitive proof`);
  }
  const distances = pairDistanceSet(state, basePair.first, basePair.second);
  if (distances.length === 1 && distances[0] === 1) {
    throw new Error(`${base.discoveryId}: surrogate pair unexpectedly consecutive`);
  }

  const learnerFirst = basePair.second;
  const learnerSecond = basePair.first;
  const options: RnkCp005Option[] = [
    {
      label: `${learnerFirst} must rank above ${learnerSecond}.`,
      truth: false,
      explanation: `${path.join(" > ")} forces ${learnerSecond} above ${learnerFirst}.`,
    },
    {
      label: `${learnerSecond} must rank above ${learnerFirst}.`,
      truth: true,
      explanation: `${path.join(" > ")} forces this order.`,
    },
    {
      label: "Their relative ranks cannot be determined uniquely.",
      truth: false,
      explanation: "The comparison chain fixes their relative order.",
    },
    {
      label: `${learnerFirst} and ${learnerSecond} must be consecutive in the ranking.`,
      truth: false,
      explanation:
        distances.length === 1
          ? `Their fixed separation is ${distances[0]} rank places, not consecutive.`
          : "Their separation changes across valid rankings, so consecutiveness is not compulsory.",
    },
  ];
  const positioned = moveCorrectOption(options, ordinal % 4);
  const transformed = {
    ...base,
    authorityCandidateId: "RELATION_TRUTH_STATUS" as const,
    pairStatusMode: desiredMode,
    difficulty: pairDifficulty(path.length),
    stem: `What can be concluded about the relative ranks of ${learnerFirst} and ${learnerSecond}?`,
    options: positioned.options,
    correctIndex: positioned.correctIndex,
    answer: `${learnerSecond} must rank above ${learnerFirst}`,
    explanation: [
      `Link the comparisons: ${path.join(" > ")}.`,
      `Therefore ${learnerSecond} must rank above ${learnerFirst}.`,
    ],
  } as RnkCp005EditorialV3Question;

  return {
    ...transformed,
    mathematicalFingerprint: reFingerprint(transformed),
  };
}

export function generateRnkCp005EditorialV3ApprovedQuestion(
  prototypeId: RnkCp005EditorialV3SourceForm,
  ordinal: number,
): RnkCp005EditorialV3Question {
  if (prototypeId === "PAIR_RELATION_CANNOT_BE_DETERMINED") {
    return generatePairStatusQuestion(ordinal);
  }
  const question = generateCoreV3Question(prototypeId, ordinal);
  return {
    ...question,
    mathematicalFingerprint: reFingerprint(question),
  };
}

export function buildRnkCp005EditorialV3ApprovedCorpus(
  questionsPerSourceForm = 24,
): readonly RnkCp005EditorialV3Question[] {
  return RNK_CP005_EDITORIAL_V3_SOURCE_FORMS.flatMap((prototypeId) =>
    Array.from({ length: questionsPerSourceForm }, (_, ordinal) =>
      generateRnkCp005EditorialV3ApprovedQuestion(prototypeId, ordinal),
    ),
  );
}
