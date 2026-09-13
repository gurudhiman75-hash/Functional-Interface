import { generateLpCp03Batch, type LpCp03Caselet } from "./lp-cp03-possibility-set-v1.ts";
import type { Assignment, GroupId, PersonId } from "./index.ts";

export type LpCp04Difficulty = "Easy" | "Medium" | "Hard";

type TemporaryCondition = { person: PersonId; group: GroupId; text: string };
type ConditionedCandidate = { condition: TemporaryCondition; states: Assignment[] };

export type LpCp04ChildV2 = {
  questionId: string;
  candidateAuthority: "COUNTERFACTUAL_ADDITIONAL_CONDITION_QUERY";
  difficultyBand: LpCp04Difficulty;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  temporaryCondition: TemporaryCondition;
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
    Easy: "EXTRA_CONDITION_LEAVES_ONE_VALID_STATE",
    Medium: "EXTRA_CONDITION_LEAVES_TWO_VALID_STATES",
    Hard: "EXTRA_CONDITION_LEAVES_THREE_OR_MORE_VALID_STATES",
  }),
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

function stateCountMatchesDifficulty(difficulty: LpCp04Difficulty, stateCount: number): boolean {
  if (difficulty === "Easy") return stateCount === 1;
  if (difficulty === "Medium") return stateCount === 2;
  return stateCount >= 3;
}

function eligibleConditions(caselet: LpCp03Caselet, difficulty: LpCp04Difficulty): ConditionedCandidate[] {
  const candidates: ConditionedCandidate[] = [];
  for (const person of caselet.people) for (const group of caselet.groups) {
    const states = caselet.validStates.filter((state) => state[person] === group);
    if (states.length === 0 || states.length === caselet.validStates.length) continue;
    if (!stateCountMatchesDifficulty(difficulty, states.length)) continue;
    candidates.push({ condition: { person, group, text: propositionText(person, group, caselet) }, states });
  }
  return candidates.sort((left, right) => left.condition.text.localeCompare(right.condition.text));
}

function pickCondition(caselet: LpCp03Caselet, index: number, difficulty: LpCp04Difficulty): ConditionedCandidate | null {
  const candidates = eligibleConditions(caselet, difficulty);
  if (!candidates.length) return null;
  if (difficulty === "Hard") {
    const widest = Math.max(...candidates.map((candidate) => candidate.states.length));
    const strongest = candidates.filter((candidate) => candidate.states.length === widest);
    return strongest[index % strongest.length]!;
  }
  return candidates[index % candidates.length]!;
}

function makeChild(caselet: LpCp03Caselet, index: number, difficulty: LpCp04Difficulty, selected: ConditionedCandidate): LpCp04ChildV2 {
  const { condition, states } = selected;
  const propositions = caselet.people.flatMap((person) => caselet.groups.map((group) => ({ person, group, text: propositionText(person, group, caselet) })));
  const must = propositions.filter((item) => states.every((state) => state[item.person] === item.group));
  const notMust = propositions.filter((item) => !states.every((state) => state[item.person] === item.group));
  if (!must.length || notMust.length < 3) throw new Error(`${caselet.caseletId}: insufficient conditioned proposition variety.`);
  const correct = must[(index + 1) % must.length]!;
  const start = index % Math.max(1, notMust.length);
  const distractors = [...notMust.slice(start), ...notMust.slice(0, start)].filter((item) => item.text !== correct.text).slice(0, 3);
  if (distractors.length !== 3) throw new Error(`${caselet.caseletId}: insufficient distinct distractors.`);
  const raw = [correct, ...distractors];
  const shift = index % 4;
  const ordered = [...raw.slice(shift), ...raw.slice(0, shift)];
  const correctIndex = ordered.findIndex((item) => item.text === correct.text);
  const conditionText = condition.text.replace(/[.]$/u, "");
  const caseWord = states.length === 1 ? "arrangement" : "arrangements";
  return {
    questionId: `${caselet.caseletId}-CF2`,
    candidateAuthority: "COUNTERFACTUAL_ADDITIONAL_CONDITION_QUERY",
    difficultyBand: difficulty,
    stem: `If ${conditionText}, which of the following must be true?`,
    options: ordered.map((item) => item.text),
    correctIndex,
    answer: ordered[correctIndex]!.text,
    temporaryCondition: condition,
    conditionedStateCount: states.length,
    explanation: {
      summary: "Apply the extra condition, retain every arrangement that still satisfies the original clues, and compare the options across those arrangements.",
      lines: [
        `**Additional condition:** ${condition.text}`,
        `After applying the additional condition, ${states.length} valid ${caseWord} remain${states.length === 1 ? "s" : ""}.`,
        ...states.map((state, stateIndex) => `**Remaining case ${stateIndex + 1}**\n\n${renderState(caselet, state)}`),
        `Only **${ordered[correctIndex]!.text}** is true in every remaining case. Therefore, it must be true.`,
      ],
    },
  };
}

export function generateLpCp04BatchV2(seed = "lp-cp04-counterfactual-review-v2", count = 9): LpCp04CaseletV2[] {
  const result: LpCp04CaseletV2[] = [];
  for (let outputIndex = 0; outputIndex < count; outputIndex += 1) {
    const difficultyBand = targetDifficulty(outputIndex);
    let built: LpCp04CaseletV2 | null = null;

    for (let attempt = 0; attempt < 40 && !built; attempt += 1) {
      const pool = generateLpCp03Batch(`${seed}:candidate:${outputIndex}:${attempt}`, 4);
      for (let parentIndex = 0; parentIndex < pool.length && !built; parentIndex += 1) {
        const caselet = pool[parentIndex]!;
        const selected = pickCondition(caselet, outputIndex + parentIndex + attempt, difficultyBand);
        if (!selected) continue;
        try {
          const child = makeChild(caselet, outputIndex, difficultyBand, selected);
          if (!stateCountMatchesDifficulty(difficultyBand, child.conditionedStateCount)) continue;
          built = { ...caselet, difficultyBand, counterfactualChild: child };
        } catch {
          continue;
        }
      }
    }

    if (!built) throw new Error(`CP04 V2 could not build ${difficultyBand} caselet ${outputIndex + 1} with the required conditioned-state topology.`);
    result.push(built);
  }
  return result;
}
