import { createHash } from "node:crypto";

import {
  buildRnkCp005EditorialV3State,
  classifyRnkCp005EditorialV3Relation,
  generateRnkCp005EditorialV3ApprovedQuestion,
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
} from "./cp005-partial-order-editorial-v3-approved";
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

export const RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_RELEASE_VERSION =
  "RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_RELEASE" as const;

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

function rankSet(
  state: RnkCp005EditorialV3State,
  entity: string,
): readonly number[] {
  return [...new Set(
    state.validOrders.map((order) => order.indexOf(entity) + 1),
  )].sort((a, b) => a - b);
}

function mandatoryAbove(
  state: RnkCp005EditorialV3State,
  entity: string,
): readonly string[] {
  return state.entities.filter(
    (other) =>
      other !== entity &&
      classifyRnkCp005EditorialV3Relation(state, other, entity) === "DEFINITE",
  );
}

function mandatoryBelow(
  state: RnkCp005EditorialV3State,
  entity: string,
): readonly string[] {
  return state.entities.filter(
    (other) =>
      other !== entity &&
      classifyRnkCp005EditorialV3Relation(state, entity, other) === "DEFINITE",
  );
}

function containsVariablePair(
  state: RnkCp005EditorialV3State,
  names: readonly string[],
): boolean {
  for (let i = 0; i < names.length; i += 1) {
    for (let j = i + 1; j < names.length; j += 1) {
      if (
        classifyRnkCp005EditorialV3Relation(state, names[i]!, names[j]!) ===
        "VARIABLE"
      ) {
        return true;
      }
    }
  }
  return false;
}

function derivedMandatoryAbove(
  state: RnkCp005EditorialV3State,
  target: string,
): readonly string[] {
  return mandatoryAbove(state, target).filter(
    (other) => !directEdge(state, other, target),
  );
}

function derivedMandatoryBelow(
  state: RnkCp005EditorialV3State,
  target: string,
): readonly string[] {
  return mandatoryBelow(state, target).filter(
    (other) => !directEdge(state, target, other),
  );
}

function formatNames(names: readonly string[]): string {
  if (names.length === 1) return names[0]!;
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
}

function quantifiedComparison(
  names: readonly string[],
  direction: "above" | "below",
  target: string,
): string {
  const verb = names.length === 2 ? "must both rank" : "must rank";
  return `${formatNames(names)} ${verb} ${direction} ${target}`;
}

function ordinalSuffix(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return "th";
  if (value % 10 === 1) return "st";
  if (value % 10 === 2) return "nd";
  if (value % 10 === 3) return "rd";
  return "th";
}

function numericOptions(
  answer: number,
  minimum: number,
  maximum: number,
): readonly number[] {
  const values = [answer];
  for (let delta = 1; values.length < 4; delta += 1) {
    for (const candidate of [answer - delta, answer + delta]) {
      if (
        candidate >= minimum &&
        candidate <= maximum &&
        !values.includes(candidate)
      ) {
        values.push(candidate);
      }
      if (values.length === 4) break;
    }
  }
  return values;
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
    throw new Error("Expected exactly one correct option");
  }
  const [correct] = output.splice(currentIndex, 1);
  output.splice(desiredIndex, 0, correct!);
  return { options: output, correctIndex: desiredIndex };
}

function releaseFingerprint(
  question: Omit<RnkCp005EditorialV3Question, "mathematicalFingerprint">,
): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        version: RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_RELEASE_VERSION,
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

function finalizeRelease(
  question: Omit<RnkCp005EditorialV3Question, "mathematicalFingerprint">,
): RnkCp005EditorialV3Question {
  return {
    ...question,
    mathematicalFingerprint: releaseFingerprint(question),
  };
}

function topologySchedule(
  prototypeIndex: number,
  ordinal: number,
): readonly RnkCp005V3Topology[] {
  return rotate(
    RNK_CP005_V3_TOPOLOGIES,
    (prototypeIndex * 3 + ordinal) % RNK_CP005_V3_TOPOLOGIES.length,
  );
}

function genericInstruction(state: RnkCp005EditorialV3State): string {
  return `${state.entities.length} people are ranked from highest rank to lowest rank.`;
}

function genericClues(state: RnkCp005EditorialV3State): readonly string[] {
  return state.edges.map(
    (edge) => `${edge.higher} is ranked above ${edge.lower}.`,
  );
}

function stateDifficulty(
  derivedCount: number,
  compulsoryCount: number,
): RnkCp005Difficulty {
  return derivedCount >= 2 && compulsoryCount >= 5 ? "HARD" : "MEDIUM";
}

function buildRankBoundFromState(
  prototypeId: "MINIMUM_POSSIBLE_RANK" | "MAXIMUM_POSSIBLE_RANK",
  state: RnkCp005EditorialV3State,
  ordinal: number,
): RnkCp005EditorialV3Question | undefined {
  const highest = prototypeId === "MINIMUM_POSSIBLE_RANK";
  const candidates = state.entities
    .map((entity) => ({
      entity,
      ranks: rankSet(state, entity),
      above: mandatoryAbove(state, entity),
      below: mandatoryBelow(state, entity),
      derivedAbove: derivedMandatoryAbove(state, entity),
      derivedBelow: derivedMandatoryBelow(state, entity),
    }))
    .filter((item) => {
      if (item.ranks.length < 2) return false;
      const compulsory = highest ? item.above : item.below;
      const derived = highest ? item.derivedAbove : item.derivedBelow;
      if (compulsory.length < 3 || derived.length < 1) return false;
      if (!containsVariablePair(state, compulsory)) return false;
      return highest
        ? item.ranks[0] === item.above.length + 1
        : item.ranks.at(-1) === state.entities.length - item.below.length;
    });
  const target = rotate(candidates, state.seed + ordinal)[0];
  if (!target) return undefined;

  const answerValue = highest ? target.ranks[0]! : target.ranks.at(-1)!;
  const witness = state.validOrders.find(
    (order) => order.indexOf(target.entity) + 1 === answerValue,
  );
  if (!witness) return undefined;
  const values = numericOptions(answerValue, 1, state.entities.length);
  if (values.length !== 4) return undefined;
  const options = values.map((value) => ({
    label: `${value}${ordinalSuffix(value)}`,
    truth: value === answerValue,
    explanation:
      value === answerValue
        ? "This is the required boundary rank and it is attainable."
        : target.ranks.includes(value)
          ? `${target.entity} can occupy this rank, but it is not the ${highest ? "highest" : "lowest"} possible rank.`
          : `${target.entity} cannot occupy this rank in any valid ranking.`,
  }));
  const positioned = moveCorrectOption(options, ordinal % 4);
  const compulsory = highest ? target.above : target.below;
  const derived = highest ? target.derivedAbove : target.derivedBelow;
  const limit = highest
    ? `${quantifiedComparison(compulsory, "above", target.entity)}. At least ${compulsory.length} people must therefore precede ${target.entity}, so ${target.entity} cannot rank higher than ${answerValue}${ordinalSuffix(answerValue)}.`
    : `${quantifiedComparison(compulsory, "below", target.entity)}. At least ${compulsory.length} people must therefore follow ${target.entity}, so ${target.entity} cannot rank lower than ${answerValue}${ordinalSuffix(answerValue)}.`;
  const derivedPath = highest
    ? shortestRnkCp005EditorialV3Path(state, derived[0]!, target.entity)
    : shortestRnkCp005EditorialV3Path(state, target.entity, derived[0]!);
  if (!derivedPath || derivedPath.length < 3) return undefined;

  const base = generateRnkCp005DiscoveryQuestion(prototypeId, state.seed);
  const partial = {
    ...base,
    authorityCandidateId: "POSSIBLE_RANK_BOUND" as const,
    v3Topology: state.topology,
    context: state.context,
    difficulty: stateDifficulty(derived.length, compulsory.length),
    instruction: genericInstruction(state),
    clues: genericClues(state),
    stem: `What is the ${highest ? "highest" : "lowest"} possible rank of ${target.entity}?`,
    options: positioned.options,
    correctIndex: positioned.correctIndex,
    answer: `${answerValue}${ordinalSuffix(answerValue)}`,
    explanation: [
      `A required transitive link is ${derivedPath.join(" > ")}.`,
      limit,
      `${witness.join(" > ")} is a valid ranking with ${target.entity} at rank ${answerValue}; therefore the boundary is attainable.`,
    ],
    validOrderCount: state.validOrders.length,
    exampleValidOrders: state.validOrders.slice(0, 3),
  } satisfies Omit<RnkCp005EditorialV3Question, "mathematicalFingerprint">;
  return finalizeRelease(partial);
}

function buildExactRankFromState(
  state: RnkCp005EditorialV3State,
  ordinal: number,
): RnkCp005EditorialV3Question | undefined {
  const wantIndeterminate = ordinal % 2 === 1;
  const profiles = state.entities.map((entity) => ({
    entity,
    ranks: rankSet(state, entity),
    above: mandatoryAbove(state, entity),
    below: mandatoryBelow(state, entity),
    derivedAbove: derivedMandatoryAbove(state, entity),
    derivedBelow: derivedMandatoryBelow(state, entity),
  }));
  const candidates = profiles.filter((item) => {
    if (wantIndeterminate) {
      return item.ranks.length >= 2 && item.above.length >= 1 && item.below.length >= 1;
    }
    return (
      item.ranks.length === 1 &&
      item.above.length >= 2 &&
      item.below.length >= 2 &&
      item.above.length + item.below.length === state.entities.length - 1 &&
      item.derivedAbove.length + item.derivedBelow.length >= 1 &&
      (containsVariablePair(state, item.above) || containsVariablePair(state, item.below))
    );
  });
  const target = rotate(candidates, state.seed + ordinal)[0];
  if (!target) return undefined;

  const isDefinite = target.ranks.length === 1;
  const answerValue = target.ranks[0]!;
  const numericValues = numericOptions(answerValue, 1, state.entities.length).slice(0, 3);
  if (numericValues.length !== 3) return undefined;
  const options: RnkCp005Option[] = [
    ...numericValues.map((value) => ({
      label: `${value}${ordinalSuffix(value)}`,
      truth: isDefinite && value === answerValue,
      explanation: isDefinite
        ? value === answerValue
          ? `${target.entity} has this rank in every valid ranking.`
          : `${target.entity} never has this rank.`
        : target.ranks.includes(value)
          ? `${target.entity} can have this rank, but another valid ranking gives a different rank.`
          : `${target.entity} never has this rank.`,
    })),
    {
      label: "Cannot be determined uniquely",
      truth: !isDefinite,
      explanation: isDefinite
        ? `${target.entity}'s exact rank is fixed.`
        : `${target.entity} has different ranks in different valid rankings.`,
    },
  ];
  const positioned = moveCorrectOption(options, ordinal % 4);

  let explanation: readonly string[];
  let difficulty: RnkCp005Difficulty;
  if (isDefinite) {
    const derivedAbove = target.derivedAbove[0];
    const derivedBelow = target.derivedBelow[0];
    const path = derivedAbove
      ? shortestRnkCp005EditorialV3Path(state, derivedAbove, target.entity)
      : shortestRnkCp005EditorialV3Path(state, target.entity, derivedBelow!);
    if (!path || path.length < 3) return undefined;
    explanation = [
      `A required transitive link is ${path.join(" > ")}.`,
      `${quantifiedComparison(target.above, "above", target.entity)}, while ${quantifiedComparison(target.below, "below", target.entity)}.`,
      `These account for all other ${state.entities.length - 1} people, so ${target.entity} must be ranked ${answerValue}${ordinalSuffix(answerValue)}.`,
    ];
    difficulty = stateDifficulty(
      target.derivedAbove.length + target.derivedBelow.length,
      target.above.length + target.below.length,
    );
  } else {
    const firstRank = target.ranks[0]!;
    const lastRank = target.ranks.at(-1)!;
    const firstOrder = state.validOrders.find(
      (order) => order.indexOf(target.entity) + 1 === firstRank,
    );
    const lastOrder = state.validOrders.find(
      (order) => order.indexOf(target.entity) + 1 === lastRank,
    );
    if (!firstOrder || !lastOrder || firstRank === lastRank) return undefined;
    explanation = [
      `${firstOrder.join(" > ")} places ${target.entity} at rank ${firstRank}.`,
      `${lastOrder.join(" > ")} also satisfies every statement but places ${target.entity} at rank ${lastRank}.`,
      `Therefore ${target.entity}'s exact rank cannot be determined uniquely.`,
    ];
    difficulty = target.ranks.length >= 4 ? "HARD" : "MEDIUM";
  }

  const prototypeId = "DEFINITE_RANK_OR_INDETERMINATE" as const;
  const base = generateRnkCp005DiscoveryQuestion(prototypeId, state.seed);
  const partial = {
    ...base,
    authorityCandidateId: "EXACT_RANK_DETERMINACY" as const,
    v3Topology: state.topology,
    context: state.context,
    difficulty,
    instruction: genericInstruction(state),
    clues: genericClues(state),
    stem: `What is the rank of ${target.entity}?`,
    options: positioned.options,
    correctIndex: positioned.correctIndex,
    answer: isDefinite
      ? `${answerValue}${ordinalSuffix(answerValue)}`
      : "Cannot be determined uniquely",
    explanation,
    validOrderCount: state.validOrders.length,
    exampleValidOrders: state.validOrders.slice(0, 3),
  } satisfies Omit<RnkCp005EditorialV3Question, "mathematicalFingerprint">;
  return finalizeRelease(partial);
}

function generateStrengthenedRankQuestion(
  prototypeId:
    | "MINIMUM_POSSIBLE_RANK"
    | "MAXIMUM_POSSIBLE_RANK"
    | "DEFINITE_RANK_OR_INDETERMINATE",
  ordinal: number,
): RnkCp005EditorialV3Question {
  const prototypeIndex = RNK_CP005_EDITORIAL_V3_SOURCE_FORMS.indexOf(prototypeId);
  const seedBase = 500_000_000 + prototypeIndex * 20_000_000 + ordinal * 100_000;
  for (const topology of topologySchedule(prototypeIndex, ordinal)) {
    for (let offset = 0; offset < 10_000; offset += 1) {
      const seed = seedBase + offset;
      const state = buildRnkCp005EditorialV3State(seed, topology);
      if (!state) continue;
      const question = prototypeId === "DEFINITE_RANK_OR_INDETERMINATE"
        ? buildExactRankFromState(state, ordinal)
        : buildRankBoundFromState(prototypeId, state, ordinal);
      if (question) return question;
    }
  }
  throw new Error(`${prototypeId}:${ordinal}: no directly strengthened V3 release state found`);
}

function finalizeApprovedRelationQuestion(
  question: RnkCp005EditorialV3Question,
): RnkCp005EditorialV3Question {
  const { mathematicalFingerprint: _ignored, ...withoutFingerprint } = question;
  return finalizeRelease(withoutFingerprint);
}

export function generateRnkCp005EditorialV3ReleaseQuestion(
  prototypeId: RnkCp005EditorialV3SourceForm,
  ordinal: number,
): RnkCp005EditorialV3Question {
  if (
    prototypeId === "MINIMUM_POSSIBLE_RANK" ||
    prototypeId === "MAXIMUM_POSSIBLE_RANK" ||
    prototypeId === "DEFINITE_RANK_OR_INDETERMINATE"
  ) {
    return generateStrengthenedRankQuestion(prototypeId, ordinal);
  }

  // Relation families already satisfy V3 semantic distractor and pair-status
  // contracts. Reuse them and only re-fingerprint under the release version.
  const question = generateRnkCp005EditorialV3ApprovedQuestion(prototypeId, ordinal);
  return finalizeApprovedRelationQuestion(question);
}

export function buildRnkCp005EditorialV3ReleaseCorpus(
  questionsPerSourceForm = 24,
): readonly RnkCp005EditorialV3Question[] {
  return RNK_CP005_EDITORIAL_V3_SOURCE_FORMS.flatMap((prototypeId) =>
    Array.from({ length: questionsPerSourceForm }, (_, ordinal) =>
      generateRnkCp005EditorialV3ReleaseQuestion(prototypeId, ordinal),
    ),
  );
}
