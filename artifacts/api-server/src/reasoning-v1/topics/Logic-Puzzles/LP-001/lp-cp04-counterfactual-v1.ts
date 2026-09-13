import { generateLpCp03Batch, type LpCp03Caselet } from "./lp-cp03-possibility-set-v1.ts";
import type { Assignment, GroupId, PersonId } from "./index.ts";

export const LP_CP04_COUNTERFACTUAL_V1 = Object.freeze({
  authorityId: "LP_CP04_COUNTERFACTUAL_V1" as const,
  checkpointId: "LP-CP-012-CANDIDATE" as const,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  permanentQlId: null,
  proposedQlIdentity: "COUNTERFACTUAL_ADDITIONAL_CONDITION_QUERY" as const,
  parentAuthorityId: "LP_CP03_POSSIBILITY_SET_V1" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

type TemporaryCondition = { person: PersonId; group: GroupId; text: string };

export type LpCp04Child = {
  questionId: string;
  candidateAuthority: "COUNTERFACTUAL_ADDITIONAL_CONDITION_QUERY";
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  temporaryCondition: TemporaryCondition;
  conditionedStateCount: number;
  explanation: { summary: string; lines: string[] };
};

export type LpCp04Caselet = LpCp03Caselet & { counterfactualChild: LpCp04Child };

function propositionText(person: PersonId, group: GroupId, caselet: LpCp03Caselet): string {
  return `${person} is assigned to ${caselet.groupLabels[group]}.`;
}

function renderState(caselet: LpCp03Caselet, state: Assignment): string {
  return ["| Person | Assignment |", "|---|---|", ...caselet.people.map((person) => `| ${person} | ${caselet.groupLabels[state[person]!]} |`)].join("\n");
}

function pickCondition(caselet: LpCp03Caselet, index: number): { condition: TemporaryCondition; states: Assignment[] } {
  const candidates: Array<{ condition: TemporaryCondition; states: Assignment[] }> = [];
  for (const person of caselet.people) for (const group of caselet.groups) {
    const states = caselet.validStates.filter((state) => state[person] === group);
    if (states.length === 0 || states.length === caselet.validStates.length) continue;
    candidates.push({ condition: { person, group, text: propositionText(person, group, caselet) }, states });
  }
  if (!candidates.length) throw new Error(`${caselet.caseletId}: no useful temporary condition.`);
  return candidates[index % candidates.length]!;
}

function makeChild(caselet: LpCp03Caselet, index: number): LpCp04Child {
  const { condition, states } = pickCondition(caselet, index);
  const propositions = caselet.people.flatMap((person) => caselet.groups.map((group) => ({ person, group, text: propositionText(person, group, caselet) })));
  const must = propositions.filter((item) => states.every((state) => state[item.person] === item.group));
  const notMust = propositions.filter((item) => !states.every((state) => state[item.person] === item.group));
  if (!must.length || notMust.length < 3) throw new Error(`${caselet.caseletId}: insufficient conditioned proposition variety.`);
  const correct = must[(index + 1) % must.length]!;
  const distractors = notMust.slice(index % Math.max(1, notMust.length - 2), index % Math.max(1, notMust.length - 2) + 3);
  if (distractors.length < 3) distractors.push(...notMust.filter((item) => !distractors.includes(item)).slice(0, 3 - distractors.length));
  const raw = [correct, ...distractors.slice(0, 3)];
  const shift = index % 4;
  const ordered = [...raw.slice(shift), ...raw.slice(0, shift)];
  const correctIndex = ordered.findIndex((item) => item.text === correct.text);
  return {
    questionId: `${caselet.caseletId}-CF1`,
    candidateAuthority: "COUNTERFACTUAL_ADDITIONAL_CONDITION_QUERY",
    stem: `If ${condition.text.replace(/[.]$/u, "")}, which of the following must be true?`,
    options: ordered.map((item) => item.text),
    correctIndex,
    answer: ordered[correctIndex]!.text,
    temporaryCondition: condition,
    conditionedStateCount: states.length,
    explanation: {
      summary: `Apply the extra condition first, then keep only the arrangements that still satisfy the original clues.`,
      lines: [
        `**Additional condition:** ${condition.text}`,
        `After applying it, ${states.length} valid arrangement${states.length === 1 ? " remains" : "s remain"}.`,
        ...states.map((state, stateIndex) => `**Remaining case ${stateIndex + 1}**\n\n${renderState(caselet, state)}`),
        `The correct option is true in every remaining case. Therefore, the answer is **${ordered[correctIndex]!.text}**`,
      ],
    },
  };
}

export function generateLpCp04Batch(seed = "lp-cp04-counterfactual-review", count = 8): LpCp04Caselet[] {
  return generateLpCp03Batch(`${seed}:parent`, count).map((caselet, index) => ({ ...caselet, counterfactualChild: makeChild(caselet, index) }));
}
