import {
  type CandidateId,
  type Lp004Caselet,
  type Lp004Child,
  type SelectionAssignment,
  type SelectionClue,
} from "./lp-004.ts";
import { generateLp004BatchStabilizedV4_2 } from "./lp-001-008-stabilized-english-v4-2.ts";

export const LP_004_CARDINALITY_DEPTH_V1 = Object.freeze({
  authorityId: "LP_004_CARDINALITY_DEPTH_V1" as const,
  parentAuthorityId: "LP_001_008_STABILIZED_ENGLISH_V4_2" as const,
  packageId: "LP-004" as const,
  checkpointId: "LP-CP-004-DEPTH" as const,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  permanentQlIds: ["LP-QL-013", "LP-QL-014", "LP-QL-015", "LP-QL-016"] as const,
  allocatesNewQl: false as const,
  changesHiddenState: false as const,
  changesChildQuerySemantics: false as const,
  newClueFamilies: ["AT_LEAST_ONE_SUBSET", "SUBSET_COUNT", "IF_NOT_SELECTED"] as const,
  runtimeMode: "REVIEW_ONLY" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

type Triple = readonly [CandidateId, CandidateId, CandidateId];

type AtLeastOneSubsetClue = {
  kind: "AT_LEAST_ONE_SUBSET";
  members: Triple;
  text: string;
};

type SubsetCountClue = {
  kind: "SUBSET_COUNT";
  members: Triple;
  relation: "EXACTLY" | "AT_LEAST" | "AT_MOST";
  count: 1 | 2;
  text: string;
};

type IfNotSelectedClue = {
  kind: "IF_NOT_SELECTED";
  first: CandidateId;
  second: CandidateId;
  text: string;
};

export type Lp004DepthClue = SelectionClue | AtLeastOneSubsetClue | SubsetCountClue | IfNotSelectedClue;

export type Lp004DepthCaselet = Omit<Lp004Caselet, "clues" | "children"> & {
  clues: readonly Lp004DepthClue[];
  children: readonly Lp004Child[];
  sourceClues: readonly SelectionClue[];
};

const CANDIDATES: readonly CandidateId[] = ["A", "B", "C", "D", "E", "F", "G"];

function enumerateAssignments(candidates: readonly CandidateId[], committeeSize: number): SelectionAssignment[] {
  const assignments: SelectionAssignment[] = [];
  const choose = (start: number, selected: CandidateId[]) => {
    if (selected.length === committeeSize) {
      const chosen = new Set(selected);
      const assignment = {} as SelectionAssignment;
      candidates.forEach((candidate) => { assignment[candidate] = chosen.has(candidate); });
      assignments.push(assignment);
      return;
    }
    for (let index = start; index <= candidates.length - (committeeSize - selected.length); index += 1) {
      choose(index + 1, [...selected, candidates[index]!]);
    }
  };
  choose(0, []);
  return assignments;
}

function countSelected(assignment: SelectionAssignment, members: readonly CandidateId[]): number {
  return members.reduce((total, member) => total + (assignment[member] ? 1 : 0), 0);
}

export function satisfiesLp004DepthClue(assignment: SelectionAssignment, clue: Lp004DepthClue): boolean {
  if (clue.kind === "MUST_SELECT") return assignment[clue.candidate];
  if (clue.kind === "MUST_NOT_SELECT") return !assignment[clue.candidate];
  if (clue.kind === "TOGETHER") return assignment[clue.first] === assignment[clue.second];
  if (clue.kind === "NOT_TOGETHER") return !(assignment[clue.first] && assignment[clue.second]);
  if (clue.kind === "EXACTLY_ONE") return assignment[clue.first] !== assignment[clue.second];
  if (clue.kind === "IF_SELECTED") return !assignment[clue.first] || assignment[clue.second];
  if (clue.kind === "AT_LEAST_ONE_SUBSET") return countSelected(assignment, clue.members) >= 1;
  if (clue.kind === "IF_NOT_SELECTED") return assignment[clue.first] || assignment[clue.second];
  const selected = countSelected(assignment, clue.members);
  if (clue.relation === "EXACTLY") return selected === clue.count;
  if (clue.relation === "AT_LEAST") return selected >= clue.count;
  return selected <= clue.count;
}

export function solveLp004Depth(caselet: Pick<Lp004DepthCaselet, "candidates" | "committeeSize" | "clues">): SelectionAssignment[] {
  return enumerateAssignments(caselet.candidates, caselet.committeeSize).filter((state) => caselet.clues.every((clue) => satisfiesLp004DepthClue(state, clue)));
}

function triples(candidates: readonly CandidateId[]): Triple[] {
  const result: Triple[] = [];
  for (let first = 0; first < candidates.length; first += 1) {
    for (let second = first + 1; second < candidates.length; second += 1) {
      for (let third = second + 1; third < candidates.length; third += 1) {
        result.push([candidates[first]!, candidates[second]!, candidates[third]!] as const);
      }
    }
  }
  return result;
}

function names(caselet: Lp004Caselet, members: readonly CandidateId[]): string {
  return members.map((member) => caselet.candidateLabels[member]).join(", ");
}

function depthPool(caselet: Lp004Caselet): Lp004DepthClue[] {
  const hidden = caselet.assignment;
  const result: Lp004DepthClue[] = [...caselet.clues];

  for (const members of triples(caselet.candidates)) {
    const selected = countSelected(hidden, members);
    const memberNames = names(caselet, members);
    if (selected >= 1) {
      result.push({ kind: "AT_LEAST_ONE_SUBSET", members, text: `At least one of ${memberNames} is selected.` });
    }
    if (selected === 1 || selected === 2) {
      result.push({ kind: "SUBSET_COUNT", members, relation: "EXACTLY", count: selected, text: `Exactly ${selected} of ${memberNames} ${selected === 1 ? "is" : "are"} selected.` });
    }
    if (selected >= 2) {
      result.push({ kind: "SUBSET_COUNT", members, relation: "AT_LEAST", count: 2, text: `At least two of ${memberNames} are selected.` });
    }
    if (selected <= 2) {
      result.push({ kind: "SUBSET_COUNT", members, relation: "AT_MOST", count: 2, text: `At most two of ${memberNames} are selected.` });
    }
  }

  for (const first of caselet.candidates) {
    if (hidden[first]) continue;
    for (const second of caselet.candidates) {
      if (first === second || !hidden[second]) continue;
      result.push({
        kind: "IF_NOT_SELECTED",
        first,
        second,
        text: `If ${caselet.candidateLabels[first]} is not selected, ${caselet.candidateLabels[second]} must be selected.`,
      });
    }
  }

  const all = enumerateAssignments(caselet.candidates, caselet.committeeSize);
  return result.filter((clue) => {
    const surviving = all.filter((state) => satisfiesLp004DepthClue(state, clue)).length;
    return surviving > 0 && surviving < all.length;
  });
}

function clueKey(clue: Lp004DepthClue): string {
  if (clue.kind === "MUST_SELECT" || clue.kind === "MUST_NOT_SELECT") return `${clue.kind}:${clue.candidate}`;
  if (clue.kind === "TOGETHER" || clue.kind === "NOT_TOGETHER" || clue.kind === "EXACTLY_ONE") {
    return `${clue.kind}:${[clue.first, clue.second].sort().join(":")}`;
  }
  if (clue.kind === "IF_SELECTED" || clue.kind === "IF_NOT_SELECTED") return `${clue.kind}:${clue.first}:${clue.second}`;
  if (clue.kind === "AT_LEAST_ONE_SUBSET") return `${clue.kind}:${[...clue.members].sort().join(":")}`;
  return `${clue.kind}:${clue.relation}:${clue.count}:${[...clue.members].sort().join(":")}`;
}

function isNewDepthClue(clue: Lp004DepthClue): boolean {
  return clue.kind === "AT_LEAST_ONE_SUBSET" || clue.kind === "SUBSET_COUNT" || clue.kind === "IF_NOT_SELECTED";
}

function uniqueAndEssential(caselet: Lp004Caselet, clues: readonly Lp004DepthClue[]): boolean {
  const all = enumerateAssignments(caselet.candidates, caselet.committeeSize);
  const survivors = all.filter((state) => clues.every((clue) => satisfiesLp004DepthClue(state, clue)));
  if (survivors.length !== 1) return false;
  if (JSON.stringify(survivors[0]) !== JSON.stringify(caselet.assignment)) return false;
  return clues.every((_, removed) => all.filter((state) => clues.every((clue, index) => index === removed || satisfiesLp004DepthClue(state, clue))).length > 1);
}

function greedilyComplete(caselet: Lp004Caselet, seeds: readonly Lp004DepthClue[], pool: readonly Lp004DepthClue[]): Lp004DepthClue[] | null {
  const all = enumerateAssignments(caselet.candidates, caselet.committeeSize);
  const chosen: Lp004DepthClue[] = [...seeds];
  let survivors = all.filter((state) => chosen.every((clue) => satisfiesLp004DepthClue(state, clue)));
  const targetMax = caselet.difficultyBand === "Hard" ? 7 : 6;

  while (survivors.length > 1 && chosen.length < targetMax) {
    const candidate = pool
      .filter((clue) => !chosen.some((selected) => clueKey(selected) === clueKey(clue)))
      .map((clue) => ({ clue, remaining: survivors.filter((state) => satisfiesLp004DepthClue(state, clue)).length }))
      .filter((entry) => entry.remaining > 0 && entry.remaining < survivors.length)
      .sort((left, right) => left.remaining - right.remaining || clueKey(left.clue).localeCompare(clueKey(right.clue)))[0]?.clue;
    if (!candidate) break;
    chosen.push(candidate);
    survivors = survivors.filter((state) => satisfiesLp004DepthClue(state, candidate));
  }

  if (survivors.length !== 1 || JSON.stringify(survivors[0]) !== JSON.stringify(caselet.assignment)) return null;

  let minimized = [...chosen];
  let changed = true;
  while (changed) {
    changed = false;
    for (let index = minimized.length - 1; index >= 0; index -= 1) {
      const clue = minimized[index]!;
      if (seeds.some((seed) => clueKey(seed) === clueKey(clue))) continue;
      const trial = minimized.filter((_, trialIndex) => trialIndex !== index);
      const trialSurvivors = all.filter((state) => trial.every((item) => satisfiesLp004DepthClue(state, item)));
      if (trialSurvivors.length === 1 && JSON.stringify(trialSurvivors[0]) === JSON.stringify(caselet.assignment)) {
        minimized = trial;
        changed = true;
      }
    }
  }

  return uniqueAndEssential(caselet, minimized) ? minimized : null;
}

function chooseDepthClues(caselet: Lp004Caselet, index: number): Lp004DepthClue[] {
  const pool = depthPool(caselet);
  const cardinality = pool.filter((clue) => clue.kind === "SUBSET_COUNT" || clue.kind === "AT_LEAST_ONE_SUBSET");
  const negativeIf = pool.filter((clue) => clue.kind === "IF_NOT_SELECTED");
  const offset = index % Math.max(1, cardinality.length);
  const orderedCardinality = [...cardinality.slice(offset), ...cardinality.slice(0, offset)];

  if (caselet.difficultyBand === "Hard") {
    for (const first of orderedCardinality) {
      const secondPool = negativeIf.length ? negativeIf : orderedCardinality.filter((candidate) => clueKey(candidate) !== clueKey(first));
      for (const second of secondPool) {
        const built = greedilyComplete(caselet, [first, second], pool);
        if (built && built.filter(isNewDepthClue).length >= 2) return built;
      }
    }
  } else {
    for (const first of orderedCardinality) {
      const built = greedilyComplete(caselet, [first], pool);
      if (built && built.some(isNewDepthClue)) return built;
    }
  }

  throw new Error(`${caselet.caseletId}: unable to construct an essential cardinality-depth clue set.`);
}

function finalTable(caselet: Lp004Caselet): string {
  return [
    "| Candidate | Status |",
    "|---|---|",
    ...caselet.candidates.map((candidate) => `| ${caselet.candidateLabels[candidate]} | ${caselet.assignment[candidate] ? "Selected" : "Not selected"} |`),
  ].join("\n");
}

function depthEffect(caselet: Lp004Caselet, clue: Lp004DepthClue): string {
  if (clue.kind === "AT_LEAST_ONE_SUBSET") return `This means the three named people cannot all be left out.`;
  if (clue.kind === "SUBSET_COUNT") {
    const relation = clue.relation === "EXACTLY" ? "exactly" : clue.relation === "AT_LEAST" ? "at least" : "at most";
    return `So ${relation} ${clue.count} of those three people must be selected.`;
  }
  if (clue.kind === "IF_NOT_SELECTED") return `If the first person is left out, the second person must be included.`;
  return `Apply this condition together with the other selection rules.`;
}

function retrofitChildren(caselet: Lp004Caselet, clues: readonly Lp004DepthClue[]): Lp004Child[] {
  const table = finalTable(caselet);
  const steps = clues.map((clue, clueIndex) => `**Step ${clueIndex + 1}**\n\n${clue.text}\n\n${depthEffect(caselet, clue)}`);
  return caselet.children.map((child) => ({
    ...child,
    explanation: {
      summary: child.explanation.summary,
      lines: [
        ...steps,
        `**Final committee**\n\n${table}`,
        `Now answer the question from the completed table. Therefore, the answer is **${child.answer}**.`,
      ],
    },
  }));
}

function retrofitCaselet(caselet: Lp004Caselet, index: number): Lp004DepthCaselet {
  const clues = chooseDepthClues(caselet, index);
  return {
    ...caselet,
    clues,
    sourceClues: caselet.clues,
    children: retrofitChildren(caselet, clues),
  };
}

export function generateLp004CardinalityDepthBatchV1(seed = "lp-004-cardinality-depth-v1", count = 8): Lp004DepthCaselet[] {
  return generateLp004BatchStabilizedV4_2(seed, count).map(retrofitCaselet);
}
