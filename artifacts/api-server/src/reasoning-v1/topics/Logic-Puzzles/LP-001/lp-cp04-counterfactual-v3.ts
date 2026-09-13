import { generateLpCp04BatchV2, type LpCp04CaseletV2 } from "./lp-cp04-counterfactual-v2.ts";
import {
  generateLp004Caselet,
  solveLp004,
  type CandidateId,
  type Lp004Caselet,
  type SelectionAssignment,
  type SelectionClue,
} from "./lp-004.ts";

export type LpCp04V3Difficulty = "Easy" | "Medium" | "Hard";

type CommitteeCondition = { candidate: CandidateId; selected: boolean; text: string };
type CommitteeQueryMode = "MUST_BE_SELECTED" | "MUST_NOT_BE_SELECTED";

type Lp004HardChild = {
  questionId: string;
  candidateAuthority: "COUNTERFACTUAL_ADDITIONAL_CONDITION_QUERY";
  difficultyBand: "Hard";
  parentTopology: "LP-004_COMMITTEE_SELECTION";
  queryMode: CommitteeQueryMode;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  temporaryCondition: CommitteeCondition;
  parentStateCount: number;
  conditionedStateCount: number;
  explanation: { summary: string; lines: string[] };
};

export type Lp004HardCounterfactualCaselet = {
  caseletId: string;
  parentTopology: "LP-004_COMMITTEE_SELECTION";
  scenarioProfileId: string;
  scenario: string;
  difficultyBand: "Hard";
  candidates: readonly CandidateId[];
  committeeSize: 4;
  candidateLabels: Record<CandidateId, string>;
  clues: readonly SelectionClue[];
  validStates: readonly SelectionAssignment[];
  counterfactualChild: Lp004HardChild;
};

export type LpCp04CaseletV3 = LpCp04CaseletV2 | Lp004HardCounterfactualCaselet;

export const LP_CP04_COUNTERFACTUAL_V3 = Object.freeze({
  authorityId: "LP_CP04_COUNTERFACTUAL_V3" as const,
  supersedes: "LP_CP04_COUNTERFACTUAL_V2" as const,
  checkpointId: "LP-CP-012-CANDIDATE" as const,
  status: "HUMAN_REVIEW_CANDIDATE_V3" as const,
  permanentQlId: null,
  proposedQlIdentity: "COUNTERFACTUAL_ADDITIONAL_CONDITION_QUERY" as const,
  parentAuthorities: Object.freeze([
    "LP_CP03_POSSIBILITY_SET_V1",
    "LP-004_SELECTION_AND_CONDITIONAL_COMMITTEES",
  ] as const),
  difficultyContract: Object.freeze({
    Easy: "LP001_TWO_PARENT_STATES_PLUS_ONE_CONDITION_REDUCES_TO_ONE",
    Medium: "LP001_THREE_TO_FOUR_PARENT_STATES_PLUS_ONE_CONDITION_REDUCES_TO_ONE_OR_TWO",
    Hard: "LP004_PARTIAL_COMMITTEE_WITH_AT_LEAST_FIVE_VALID_STATES_PLUS_ONE_CONDITION_CREATES_NEW_MUST_FACT_REQUIRING_MULTI_CLUE_INTERACTION",
  }),
  answerDependencyContract: "ANSWER_NOT_FIXED_BEFORE_CONDITION_BUT_FIXED_AFTER_CONDITION" as const,
  hardDepthContract: "NO_SINGLE_ORIGINAL_CLUE_PLUS_THE_ADDED_CONDITION_MAY_ALREADY_FORCE_THE_HARD_ANSWER" as const,
  distractorContract: "DISTRACTORS_REMAIN_PLAUSIBLE_BEFORE_CONDITION_AND_ARE_NOT_MUST_AFTER_CONDITION" as const,
  answerPositionContract: "BATCH_DISTRIBUTED_ACROSS_ALL_FOUR_OPTION_SLOTS" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

function combinations<T>(items: readonly T[]): T[][] {
  const result: T[][] = [];
  const total = 1 << items.length;
  for (let mask = 1; mask < total; mask += 1) {
    const subset = items.filter((_, index) => Boolean(mask & (1 << index)));
    if (subset.length < items.length) result.push(subset);
  }
  return result.sort((left, right) => right.length - left.length);
}

function renderCommittee(caselet: Pick<Lp004Caselet, "candidates" | "candidateLabels">, state: SelectionAssignment): string {
  const selected = caselet.candidates.filter((candidate) => state[candidate]).map((candidate) => caselet.candidateLabels[candidate]);
  return selected.join(", ");
}

function conditionText(caselet: Lp004Caselet, candidate: CandidateId, selected: boolean): string {
  const name = caselet.candidateLabels[candidate];
  return selected ? `${name} is selected.` : `${name} is not selected.`;
}

function conditionStates(states: readonly SelectionAssignment[], condition: CommitteeCondition): SelectionAssignment[] {
  return states.filter((state) => state[condition.candidate] === condition.selected);
}

function newlyFixedCandidates(
  caselet: Lp004Caselet,
  parentStates: readonly SelectionAssignment[],
  conditionedStates: readonly SelectionAssignment[],
  conditionCandidate: CandidateId,
  selectedValue: boolean,
): CandidateId[] {
  return caselet.candidates.filter((candidate) =>
    candidate !== conditionCandidate
    && !parentStates.every((state) => state[candidate] === selectedValue)
    && conditionedStates.every((state) => state[candidate] === selectedValue),
  );
}

function plausibleDistractors(
  caselet: Lp004Caselet,
  parentStates: readonly SelectionAssignment[],
  conditionedStates: readonly SelectionAssignment[],
  conditionCandidate: CandidateId,
  selectedValue: boolean,
): CandidateId[] {
  return caselet.candidates.filter((candidate) =>
    candidate !== conditionCandidate
    && parentStates.some((state) => state[candidate] === selectedValue)
    && !conditionedStates.every((state) => state[candidate] === selectedValue),
  );
}

function requiresMultipleClueInteraction(
  source: Lp004Caselet,
  clues: readonly SelectionClue[],
  condition: CommitteeCondition,
  answerCandidate: CandidateId,
  targetValue: boolean,
): boolean {
  if (clues.length < 2) return false;
  for (const clue of clues) {
    const singleClueStates = solveLp004({ candidates: source.candidates, committeeSize: source.committeeSize, clues: [clue] });
    const afterSingleClue = conditionStates(singleClueStates, condition);
    if (afterSingleClue.length > 0 && afterSingleClue.every((state) => state[answerCandidate] === targetValue)) return false;
  }
  return true;
}

function buildHardCandidate(source: Lp004Caselet, outputIndex: number): Lp004HardCounterfactualCaselet | null {
  const subsets = combinations(source.clues);
  for (let subsetIndex = 0; subsetIndex < subsets.length; subsetIndex += 1) {
    const clues = subsets[subsetIndex]!;
    if (clues.length < 3) continue;
    const parentStates = solveLp004({ candidates: source.candidates, committeeSize: source.committeeSize, clues });
    if (parentStates.length < 5 || parentStates.length > 14) continue;

    for (let candidateIndex = 0; candidateIndex < source.candidates.length; candidateIndex += 1) {
      const conditionCandidate = source.candidates[(candidateIndex + outputIndex) % source.candidates.length]!;
      for (const selected of [true, false] as const) {
        const condition: CommitteeCondition = { candidate: conditionCandidate, selected, text: conditionText(source, conditionCandidate, selected) };
        const after = conditionStates(parentStates, condition);
        if (after.length === 0 || after.length >= parentStates.length || after.length > 4) continue;

        for (const mode of ["MUST_BE_SELECTED", "MUST_NOT_BE_SELECTED"] as const) {
          const targetValue = mode === "MUST_BE_SELECTED";
          const correctPool = newlyFixedCandidates(source, parentStates, after, conditionCandidate, targetValue)
            .filter((candidate) => requiresMultipleClueInteraction(source, clues, condition, candidate, targetValue));
          const distractorPool = plausibleDistractors(source, parentStates, after, conditionCandidate, targetValue);
          if (!correctPool.length || distractorPool.length < 3) continue;

          const correctCandidate = correctPool[(outputIndex + subsetIndex + candidateIndex) % correctPool.length]!;
          const distractors = distractorPool
            .filter((candidate) => candidate !== correctCandidate)
            .slice(0, 3);
          if (distractors.length !== 3) continue;
          const raw = [correctCandidate, ...distractors];
          const shift = outputIndex % 4;
          const ordered = [...raw.slice(shift), ...raw.slice(0, shift)];
          const correctIndex = ordered.indexOf(correctCandidate);
          const answer = source.candidateLabels[correctCandidate];
          const question = mode === "MUST_BE_SELECTED"
            ? `If ${condition.text.replace(/[.]$/u, "")}, which of the following must be selected?`
            : `If ${condition.text.replace(/[.]$/u, "")}, which of the following must not be selected?`;
          const stateLines = after.map((state, index) => `**Remaining committee ${index + 1}:** ${renderCommittee(source, state)}`);
          return {
            caseletId: `LP-CP04-V3-HARD:${source.caseletId}:${outputIndex + 1}`,
            parentTopology: "LP-004_COMMITTEE_SELECTION",
            scenarioProfileId: source.scenarioProfileId,
            scenario: source.scenario,
            difficultyBand: "Hard",
            candidates: source.candidates,
            committeeSize: source.committeeSize,
            candidateLabels: source.candidateLabels,
            clues,
            validStates: parentStates,
            counterfactualChild: {
              questionId: `LP-CP04-V3-HARD:${source.caseletId}:${outputIndex + 1}:Q`,
              candidateAuthority: "COUNTERFACTUAL_ADDITIONAL_CONDITION_QUERY",
              difficultyBand: "Hard",
              parentTopology: "LP-004_COMMITTEE_SELECTION",
              queryMode: mode,
              stem: question,
              options: ordered.map((candidate) => source.candidateLabels[candidate]),
              correctIndex,
              answer,
              temporaryCondition: condition,
              parentStateCount: parentStates.length,
              conditionedStateCount: after.length,
              explanation: {
                summary: "The original conditions allow several committees. Apply the extra condition, combine it with the original conditions, and identify the name whose status becomes fixed only after those conditions work together.",
                lines: [
                  `Before the additional condition, ${parentStates.length} valid committees are possible.`,
                  `**Additional condition:** ${condition.text}`,
                  `After applying it together with the original conditions, ${after.length} valid committee${after.length === 1 ? "" : "s"} remain${after.length === 1 ? "s" : ""}.`,
                  ...stateLines,
                  `No single original clue with the added condition is enough to force **${answer}**. After the relevant clues are combined, **${answer}** is ${targetValue ? "selected" : "not selected"} in every remaining committee.`,
                ],
              },
            },
          };
        }
      }
    }
  }
  return null;
}

function generateHard(seed: string, outputIndex: number): Lp004HardCounterfactualCaselet {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const source = generateLp004Caselet(`${seed}:lp004-hard:${outputIndex}:${attempt}`, attempt % 12);
    const built = buildHardCandidate(source, outputIndex);
    if (built) return built;
  }
  throw new Error(`CP04 V3 could not build Hard committee caselet ${outputIndex + 1}.`);
}

function generateEasyOrMedium(seed: string, difficulty: "Easy" | "Medium", outputIndex: number): LpCp04CaseletV2 {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const pair = generateLpCp04BatchV2(`${seed}:lp001:${difficulty}:${outputIndex}:${attempt}`, 2);
      const candidate = pair[difficulty === "Easy" ? 0 : 1]!;
      if (candidate.difficultyBand === difficulty) return candidate;
    } catch {
      continue;
    }
  }
  throw new Error(`CP04 V3 could not build ${difficulty} LP-001 caselet ${outputIndex + 1}.`);
}

function rebalanceAnswerSlot<T extends LpCp04CaseletV3>(caselet: T, desiredSlot: number): T {
  const child: any = caselet.counterfactualChild;
  const answer = child.answer as string;
  const distractors = (child.options as string[]).filter((option) => option !== answer);
  const options: string[] = [];
  let distractorIndex = 0;
  for (let slot = 0; slot < 4; slot += 1) {
    options.push(slot === desiredSlot ? answer : distractors[distractorIndex++]!);
  }
  return {
    ...caselet,
    counterfactualChild: {
      ...child,
      options,
      correctIndex: desiredSlot,
    },
  } as T;
}

export function generateLpCp04BatchV3(seed = "lp-cp04-counterfactual-review-v3", count = 9): LpCp04CaseletV3[] {
  return Array.from({ length: count }, (_, outputIndex) => {
    const difficulty = (["Easy", "Medium", "Hard"] as const)[outputIndex % 3]!;
    const built = difficulty === "Hard"
      ? generateHard(seed, outputIndex)
      : generateEasyOrMedium(seed, difficulty, outputIndex);
    return rebalanceAnswerSlot(built, outputIndex % 4);
  });
}
