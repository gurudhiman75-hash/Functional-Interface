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
import type { RnkCp005Difficulty, RnkCp005Option } from "./cp005-partial-order-runtime";

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

export const RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_APPROVED_VERSION =
  "RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_APPROVED_V2" as const;

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
    throw new Error("Expected exactly one correct option");
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

function parseTarget(stem: string): string | undefined {
  return stem.match(/(?:possible rank of|rank of) (.+?)\?$/i)?.[1]?.trim();
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

function gapClaim(
  first: string,
  second: string,
  rankDistance: number,
): string {
  if (rankDistance === 1) {
    return `${first} and ${second} must be consecutive in the ranking.`;
  }
  const between = rankDistance - 1;
  return `Exactly ${between} ${between === 1 ? "person" : "people"} must be ranked between ${first} and ${second}.`;
}

function falseGapDistractor(
  state: RnkCp005EditorialV3State,
  first: string,
  second: string,
  ordinal: number,
): RnkCp005Option {
  const distances = pairDistanceSet(state, first, second);
  const candidates = [1, 2, 3, 4].filter(
    (distance) => distance < state.entities.length,
  );
  const rotated = [
    ...candidates.slice(ordinal % candidates.length),
    ...candidates.slice(0, ordinal % candidates.length),
  ];
  const claimedDistance = rotated.find(
    (distance) => !(distances.length === 1 && distances[0] === distance),
  );
  if (claimedDistance === undefined) {
    throw new Error("Could not construct a false pair-gap distractor");
  }
  const between = claimedDistance - 1;
  return {
    label: gapClaim(first, second, claimedDistance),
    truth: false,
    explanation:
      distances.length === 1
        ? `Their fixed rank separation is ${distances[0]}, so this ${between === 0 ? "consecutive-rank" : "between-people"} claim is incorrect.`
        : `Their separation changes across valid rankings, so this exact ${between === 0 ? "consecutive-rank" : "between-people"} claim is not compulsory.`,
  };
}

function varyPairGapDistractor(
  question: RnkCp005EditorialV3Question,
  ordinal: number,
): RnkCp005EditorialV3Question {
  const pair = parsePairStem(question.stem);
  const state = buildRnkCp005EditorialV3State(question.seed, question.v3Topology);
  if (!state) throw new Error(`${question.discoveryId}: missing V3 state`);
  const replacement = falseGapDistractor(
    state,
    pair.first,
    pair.second,
    ordinal,
  );
  const options = question.options.map((option) =>
    /must be consecutive in the ranking/i.test(option.label)
      ? replacement
      : option,
  );
  if (options.filter((option) => option.truth).length !== 1) {
    throw new Error(`${question.discoveryId}: pair-gap replacement changed answer truth`);
  }
  return { ...question, options };
}

function hasDerivedCompulsoryRelation(
  question: RnkCp005EditorialV3Question,
): boolean {
  const target = parseTarget(question.stem);
  if (!target) return false;
  const state = buildRnkCp005EditorialV3State(question.seed, question.v3Topology);
  if (!state) return false;

  if (question.prototypeId === "MINIMUM_POSSIBLE_RANK") {
    return state.entities.some(
      (other) =>
        other !== target &&
        classifyRnkCp005EditorialV3Relation(state, other, target) === "DEFINITE" &&
        !directEdge(state, other, target),
    );
  }
  if (question.prototypeId === "MAXIMUM_POSSIBLE_RANK") {
    return state.entities.some(
      (other) =>
        other !== target &&
        classifyRnkCp005EditorialV3Relation(state, target, other) === "DEFINITE" &&
        !directEdge(state, target, other),
    );
  }
  if (
    question.prototypeId === "DEFINITE_RANK_OR_INDETERMINATE" &&
    !/cannot be determined/i.test(question.answer)
  ) {
    return state.entities.some((other) => {
      if (other === target) return false;
      const above = classifyRnkCp005EditorialV3Relation(state, other, target) === "DEFINITE";
      const below = classifyRnkCp005EditorialV3Relation(state, target, other) === "DEFINITE";
      return (
        (above && !directEdge(state, other, target)) ||
        (below && !directEdge(state, target, other))
      );
    });
  }
  return true;
}

function generateStrengthenedCoreQuestion(
  prototypeId: RnkCp005EditorialV3SourceForm,
  ordinal: number,
): RnkCp005EditorialV3Question {
  const requiresDerivedProof =
    prototypeId === "MINIMUM_POSSIBLE_RANK" ||
    prototypeId === "MAXIMUM_POSSIBLE_RANK" ||
    prototypeId === "DEFINITE_RANK_OR_INDETERMINATE";

  // Each ordinal owns a disjoint search lane. This prevents editorial fallback
  // from selecting the same mathematical question for two corpus slots while
  // preserving the requested answer position (96 is divisible by four).
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const candidateOrdinal = ordinal + attempt * 96;
    const question = generateCoreV3Question(prototypeId, candidateOrdinal);
    if (requiresDerivedProof && !hasDerivedCompulsoryRelation(question)) continue;
    return question;
  }
  throw new Error(`${prototypeId}:${ordinal}: no strengthened approved candidate found`);
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

function finalizeApproved(
  question: RnkCp005EditorialV3Question,
): RnkCp005EditorialV3Question {
  return {
    ...question,
    mathematicalFingerprint: reFingerprint(question),
  };
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
    return finalizeApproved(
      varyPairGapDistractor(
        {
          ...question,
          pairStatusMode: desiredMode,
        } as RnkCp005EditorialV3Question,
        ordinal,
      ),
    );
  }

  // Select a proven transitive A>B pair, then reverse only the learner-facing
  // pair order to create a genuine SECOND_ABOVE answer without changing clues.
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
    falseGapDistractor(
      state,
      learnerFirst,
      learnerSecond,
      ordinal,
    ),
  ];
  const positioned = moveCorrectOption(options, ordinal % 4);
  return finalizeApproved({
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
  } as RnkCp005EditorialV3Question);
}

export function generateRnkCp005EditorialV3ApprovedQuestion(
  prototypeId: RnkCp005EditorialV3SourceForm,
  ordinal: number,
): RnkCp005EditorialV3Question {
  if (prototypeId === "PAIR_RELATION_CANNOT_BE_DETERMINED") {
    return generatePairStatusQuestion(ordinal);
  }
  return finalizeApproved(
    generateStrengthenedCoreQuestion(prototypeId, ordinal),
  );
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
