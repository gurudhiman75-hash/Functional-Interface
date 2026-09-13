import { generateLpCp03Batch, type LpCp03Caselet } from "./lp-cp03-possibility-set-v1.ts";
import type { Assignment, GroupId, PersonId } from "./index.ts";

export type LpCp04Difficulty = "Easy" | "Medium" | "Hard";

type TemporaryCondition = { person: PersonId; group: GroupId; text: string };
type ConditionedCandidate = { conditions: TemporaryCondition[]; states: Assignment[] };
type Proposition = { person: PersonId; group: GroupId; text: string };

export type LpCp04ChildV2 = {
  questionId: string;
  candidateAuthority: "COUNTERFACTUAL_ADDITIONAL_CONDITION_QUERY";
  difficultyBand: LpCp04Difficulty;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  temporaryConditions: readonly TemporaryCondition[];
  parentStateCount: number;
  conditionedStateCount: number;
  explanation: { summary: string; lines: string[] };
};

export type LpCp04CaseletV2 = LpCp03Caselet & {
  difficultyBand: LpCp04Difficulty;
  counterfactualChild: LpCp04ChildV2;
};

export const LP_CP04_COUNTERFACTUAL_V2 = Object.freeze({
  authorityId: "LP_CP04_COUNTERFACTUAL_V2" as const,
  supersedes: "LP_CP04_COUNTERFACTUAL_V1" as const,
  checkpointId: "LP-CP-012-CANDIDATE" as const,
  status: "HUMAN_REVIEW_CANDIDATE_V2" as const,
  permanentQlId: null,
  proposedQlIdentity: "COUNTERFACTUAL_ADDITIONAL_CONDITION_QUERY" as const,
  parentAuthorityId: "LP_CP03_POSSIBILITY_SET_V1" as const,
  supportedDifficulties: Object.freeze(["Easy", "Medium", "Hard"] as const),
  difficultyContract: Object.freeze({
    Easy: "TWO_PARENT_STATES_PLUS_ONE_CONDITION_REDUCES_TO_ONE",
    Medium: "THREE_TO_FOUR_PARENT_STATES_PLUS_ONE_CONDITION_REDUCES_TO_ONE_OR_TWO",
    Hard: "FIVE_PLUS_PARENT_STATES_PLUS_TWO_CONDITIONS_CREATE_A_NEW_DOWNSTREAM_INVARIANT",
  }),
  answerDependencyContract: "CORRECT_PROPOSITION_NOT_MUST_BEFORE_CONDITION_BECOMES_MUST_AFTER_CONDITION" as const,
  hardSynergyContract: "HARD_ANSWER_IS_NOT_MUST_UNDER_EITHER_EXTRA_CONDITION_ALONE" as const,
  distractorContract: "EACH_DISTRACTOR_WAS_POSSIBLE_BEFORE_CONDITION_AND_IS_NOT_MUST_AFTER_CONDITION" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

function propositionText(person: PersonId, group: GroupId, caselet: LpCp03Caselet): string {
  return `${person} is assigned to ${caselet.groupLabels[group]}.`;
}

function renderState(caselet: LpCp03Caselet, state: Assignment): string {
  return ["| Person | Assignment |", "|---|---|", ...caselet.people.map((person) => `| ${person} | ${caselet.groupLabels[state[person]!]} |`)].join("\n");
}

function targetDifficulty(index: number): LpCp04Difficulty {
  return (["Easy", "Medium", "Hard"] as const)[index % 3]!;
}

function topologyMatchesDifficulty(difficulty: LpCp04Difficulty, caselet: LpCp03Caselet, candidate: ConditionedCandidate): boolean {
  const parentCount = caselet.validStates.length;
  const conditionedCount = candidate.states.length;
  if (difficulty === "Easy") return parentCount === 2 && candidate.conditions.length === 1 && conditionedCount === 1;
  if (difficulty === "Medium") return parentCount >= 3 && parentCount <= 4 && candidate.conditions.length === 1 && conditionedCount >= 1 && conditionedCount <= 2;
  return parentCount >= 5 && candidate.conditions.length === 2 && conditionedCount >= 1 && conditionedCount <= 2;
}

function allPropositions(caselet: LpCp03Caselet): Proposition[] {
  return caselet.people.flatMap((person) => caselet.groups.map((group) => ({ person, group, text: propositionText(person, group, caselet) })));
}

function isTrue(state: Assignment, proposition: Proposition): boolean {
  return state[proposition.person] === proposition.group;
}

function atomicConditions(caselet: LpCp03Caselet): Array<{ condition: TemporaryCondition; states: Assignment[] }> {
  const result: Array<{ condition: TemporaryCondition; states: Assignment[] }> = [];
  for (const person of caselet.people) for (const group of caselet.groups) {
    const states = caselet.validStates.filter((state) => state[person] === group);
    if (states.length === 0 || states.length === caselet.validStates.length) continue;
    result.push({ condition: { person, group, text: propositionText(person, group, caselet) }, states });
  }
  return result.sort((left, right) => left.condition.text.localeCompare(right.condition.text));
}

function singleConditionCandidates(caselet: LpCp03Caselet, difficulty: LpCp04Difficulty): ConditionedCandidate[] {
  return atomicConditions(caselet)
    .map((item) => ({ conditions: [item.condition], states: item.states }))
    .filter((candidate) => topologyMatchesDifficulty(difficulty, caselet, candidate));
}

function hardCompoundCandidates(caselet: LpCp03Caselet): ConditionedCandidate[] {
  if (caselet.validStates.length < 5) return [];
  const atomic = atomicConditions(caselet);
  const result: ConditionedCandidate[] = [];
  for (let leftIndex = 0; leftIndex < atomic.length; leftIndex += 1) {
    const left = atomic[leftIndex]!;
    for (let rightIndex = leftIndex + 1; rightIndex < atomic.length; rightIndex += 1) {
      const right = atomic[rightIndex]!;
      if (left.condition.person === right.condition.person) continue;
      const states = caselet.validStates.filter((state) =>
        state[left.condition.person] === left.condition.group
        && state[right.condition.person] === right.condition.group,
      );
      if (states.length === 0 || states.length > 2 || states.length === caselet.validStates.length) continue;
      const candidate = { conditions: [left.condition, right.condition], states };
      if (topologyMatchesDifficulty("Hard", caselet, candidate)) result.push(candidate);
    }
  }
  return result;
}

function newlyMustPropositions(caselet: LpCp03Caselet, selected: ConditionedCandidate, difficulty: LpCp04Difficulty): Proposition[] {
  const conditionPeople = new Set(selected.conditions.map((condition) => condition.person));
  return allPropositions(caselet).filter((item) => {
    if (conditionPeople.has(item.person)) return false;
    if (caselet.validStates.every((state) => isTrue(state, item))) return false;
    if (!selected.states.every((state) => isTrue(state, item))) return false;
    if (difficulty === "Hard") {
      for (const condition of selected.conditions) {
        const singlyConditioned = caselet.validStates.filter((state) => state[condition.person] === condition.group);
        if (singlyConditioned.every((state) => isTrue(state, item))) return false;
      }
    }
    return true;
  });
}

function plausibleDistractors(caselet: LpCp03Caselet, selected: ConditionedCandidate): Proposition[] {
  const conditionPeople = new Set(selected.conditions.map((condition) => condition.person));
  return allPropositions(caselet).filter((item) =>
    !conditionPeople.has(item.person)
    && caselet.validStates.some((state) => isTrue(state, item))
    && !selected.states.every((state) => isTrue(state, item)),
  );
}

function hasViableQuestion(caselet: LpCp03Caselet, selected: ConditionedCandidate, difficulty: LpCp04Difficulty): boolean {
  return newlyMustPropositions(caselet, selected, difficulty).length > 0 && plausibleDistractors(caselet, selected).length >= 3;
}

function pickCondition(caselet: LpCp03Caselet, index: number, difficulty: LpCp04Difficulty): ConditionedCandidate | null {
  const raw = difficulty === "Hard" ? hardCompoundCandidates(caselet) : singleConditionCandidates(caselet, difficulty);
  const candidates = raw.filter((candidate) => hasViableQuestion(caselet, candidate, difficulty));
  if (!candidates.length) return null;
  if (difficulty === "Hard") {
    const widest = Math.max(...candidates.map((candidate) => candidate.states.length));
    const strongest = candidates.filter((candidate) => candidate.states.length === widest);
    return strongest[index % strongest.length]!;
  }
  return candidates[index % candidates.length]!;
}

function makeChild(caselet: LpCp03Caselet, index: number, difficulty: LpCp04Difficulty, selected: ConditionedCandidate): LpCp04ChildV2 {
  const newlyMust = newlyMustPropositions(caselet, selected, difficulty);
  const distractorPool = plausibleDistractors(caselet, selected);
  if (!newlyMust.length || distractorPool.length < 3) throw new Error(`${caselet.caseletId}: temporary conditions do not create enough downstream question value.`);

  const correct = newlyMust[(index + 1) % newlyMust.length]!;
  const start = index % distractorPool.length;
  const distractors = [...distractorPool.slice(start), ...distractorPool.slice(0, start)]
    .filter((item) => item.text !== correct.text)
    .slice(0, 3);
  if (distractors.length !== 3) throw new Error(`${caselet.caseletId}: insufficient distinct condition-sensitive distractors.`);

  const raw = [correct, ...distractors];
  const shift = index % 4;
  const ordered = [...raw.slice(shift), ...raw.slice(0, shift)];
  const correctIndex = ordered.findIndex((item) => item.text === correct.text);
  const conditionPhrase = selected.conditions.map((condition) => condition.text.replace(/[.]$/u, "")).join(" and ");
  const caseWord = selected.states.length === 1 ? "arrangement" : "arrangements";
  const conditionLabel = selected.conditions.length === 1 ? "Additional condition" : "Additional conditions";
  return {
    questionId: `${caselet.caseletId}-CF2`,
    candidateAuthority: "COUNTERFACTUAL_ADDITIONAL_CONDITION_QUERY",
    difficultyBand: difficulty,
    stem: `If ${conditionPhrase}, which of the following must be true?`,
    options: ordered.map((item) => item.text),
    correctIndex,
    answer: ordered[correctIndex]!.text,
    temporaryConditions: selected.conditions,
    parentStateCount: caselet.validStates.length,
    conditionedStateCount: selected.states.length,
    explanation: {
      summary: "The original clues do not force the answer by themselves. Apply the extra condition or conditions, retain every arrangement that still works, and compare the options across those arrangements.",
      lines: [
        `Before the additional condition${selected.conditions.length === 1 ? "" : "s"}, the original clues allow ${caselet.validStates.length} valid arrangements.`,
        `**${conditionLabel}:** ${selected.conditions.map((condition) => condition.text).join(" ")}`,
        `After applying the additional condition${selected.conditions.length === 1 ? "" : "s"}, ${selected.states.length} valid ${caseWord} remain${selected.states.length === 1 ? "s" : ""}.`,
        ...selected.states.map((state, stateIndex) => `**Remaining case ${stateIndex + 1}**\n\n${renderState(caselet, state)}`),
        `Before the additional condition${selected.conditions.length === 1 ? "" : "s"}, **${ordered[correctIndex]!.text}** was not fixed in every valid arrangement. After applying ${selected.conditions.length === 1 ? "the condition" : "both conditions together"}, it is true in every remaining case. Therefore, it must be true.`,
      ],
    },
  };
}

export function generateLpCp04BatchV2(seed = "lp-cp04-counterfactual-review-v2", count = 9): LpCp04CaseletV2[] {
  const result: LpCp04CaseletV2[] = [];
  for (let outputIndex = 0; outputIndex < count; outputIndex += 1) {
    const difficultyBand = targetDifficulty(outputIndex);
    let built: LpCp04CaseletV2 | null = null;

    for (let attempt = 0; attempt < 100 && !built; attempt += 1) {
      const pool = generateLpCp03Batch(`${seed}:candidate:${outputIndex}:${attempt}`, 4);
      for (let parentIndex = 0; parentIndex < pool.length && !built; parentIndex += 1) {
        const caselet = pool[parentIndex]!;
        const selected = pickCondition(caselet, outputIndex + parentIndex + attempt, difficultyBand);
        if (!selected) continue;
        try {
          const child = makeChild(caselet, outputIndex, difficultyBand, selected);
          if (!topologyMatchesDifficulty(difficultyBand, caselet, selected)) continue;
          built = { ...caselet, difficultyBand, counterfactualChild: child };
        } catch {
          continue;
        }
      }
    }

    if (!built) throw new Error(`CP04 V2 could not build ${difficultyBand} caselet ${outputIndex + 1} with condition-dependent answer semantics and the required difficulty topology.`);
    result.push(built);
  }
  return result;
}
