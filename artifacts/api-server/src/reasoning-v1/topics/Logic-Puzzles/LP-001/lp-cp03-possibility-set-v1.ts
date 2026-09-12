import {
  generateCaseletBatch,
  solveCaselet,
  type Assignment,
  type Caselet,
  type Clue,
  type GroupId,
  type PersonId,
} from "./index.ts";

export const LP_CP03_POSSIBILITY_SET_V1 = Object.freeze({
  authorityId: "LP_CP03_POSSIBILITY_SET_V1" as const,
  checkpointId: "LP-CP-011-CANDIDATE" as const,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  permanentQlId: null,
  proposedQlIdentity: "POSSIBILITY_SET_QUERY" as const,
  parentTopology: "LP-001_GROUPING" as const,
  queryModes: Object.freeze(["COULD_BE_TRUE", "CANNOT_BE_TRUE", "MUST_BE_TRUE"] as const),
  runtimeMode: "REVIEW_ONLY" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publicPublication: false as const,
});

export type LpCp03QueryMode = (typeof LP_CP03_POSSIBILITY_SET_V1.queryModes)[number];

type Proposition = {
  person: PersonId;
  group: GroupId;
  text: string;
};

export type LpCp03Child = {
  questionId: string;
  candidateAuthority: "POSSIBILITY_SET_QUERY";
  queryMode: LpCp03QueryMode;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  explanation: {
    summary: string;
    lines: string[];
  };
};

export type LpCp03Caselet = {
  caseletId: string;
  sourceCaseletId: string;
  scenario: string;
  people: readonly PersonId[];
  groups: readonly GroupId[];
  groupLabels: Caselet["groupLabels"];
  clues: readonly Clue[];
  validStates: readonly Assignment[];
  children: readonly LpCp03Child[];
};

function bitCount(value: number): number {
  let count = 0;
  for (let current = value; current; current >>>= 1) count += current & 1;
  return count;
}

function stableHash(text: string): number {
  let value = 2166136261;
  for (const char of text) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function rotate<T>(values: readonly T[], offset: number): T[] {
  if (!values.length) return [];
  const normalized = offset % values.length;
  return [...values.slice(normalized), ...values.slice(0, normalized)];
}

function propositionKey(proposition: Proposition): string {
  return `${proposition.person}:${proposition.group}`;
}

function propositionTrue(state: Assignment, proposition: Proposition): boolean {
  return state[proposition.person] === proposition.group;
}

function allPropositions(caselet: Pick<Caselet, "people" | "groups" | "groupLabels">): Proposition[] {
  return caselet.people.flatMap((person) =>
    caselet.groups.map((group) => ({
      person,
      group,
      text: `${person} is assigned to ${caselet.groupLabels[group]}.`,
    })),
  );
}

function classifyPropositions(caselet: Pick<Caselet, "people" | "groups" | "groupLabels">, states: readonly Assignment[]) {
  const propositions = allPropositions(caselet);
  return {
    must: propositions.filter((proposition) => states.every((state) => propositionTrue(state, proposition))),
    could: propositions.filter((proposition) => states.some((state) => propositionTrue(state, proposition))),
    cannot: propositions.filter((proposition) => states.every((state) => !propositionTrue(state, proposition))),
  };
}

function choosePartialClues(caselet: Caselet): { clues: Clue[]; states: Assignment[] } {
  const clueCount = caselet.clues.length;
  const candidates: Array<{ clues: Clue[]; states: Assignment[]; score: number }> = [];

  for (let mask = 1; mask < (1 << clueCount) - 1; mask += 1) {
    const kept = bitCount(mask);
    if (kept < 3 || kept >= clueCount) continue;
    const clues = caselet.clues.filter((_, index) => Boolean(mask & (1 << index)));
    const states = solveCaselet({ people: caselet.people, clues });
    if (states.length < 2 || states.length > 6) continue;

    const classes = classifyPropositions(caselet, states);
    if (classes.must.length < 1 || classes.cannot.length < 3 || classes.could.length < 4) continue;

    const targetStateCount = 3;
    const score = Math.abs(states.length - targetStateCount) * 100 + (clueCount - kept);
    candidates.push({ clues, states, score });
  }

  const selected = candidates.sort((left, right) => left.score - right.score)[0];
  if (!selected) throw new Error(`Unable to derive a multi-state clue set from ${caselet.caseletId}.`);
  return { clues: selected.clues, states: selected.states };
}

function renderState(caselet: LpCp03Caselet, state: Assignment): string {
  const rows = caselet.people.map((person) => `| ${person} | ${caselet.groupLabels[state[person]!]} |`);
  return ["| Person | Assignment |", "|---|---|", ...rows].join("\n");
}

function renderSetup(source: Caselet, clues: readonly Clue[]): string {
  const people = source.people.join(", ");
  const groups = source.groups.map((group) => source.groupLabels[group]).join(", ");
  const clueText = clues.map((clue, index) => `${index + 1}. ${clue.text}`).join("\n");
  return `${source.scenario} The six people are ${people}. The three two-person groups are ${groups}. Each person is assigned to exactly one group.\n\n${clueText}`;
}

function pickDistinct(values: readonly Proposition[], count: number, key: string): Proposition[] {
  const rotated = rotate(values, stableHash(key) % Math.max(1, values.length));
  const seen = new Set<string>();
  const result: Proposition[] = [];
  for (const value of rotated) {
    const id = propositionKey(value);
    if (seen.has(id)) continue;
    seen.add(id);
    result.push(value);
    if (result.length === count) break;
  }
  if (result.length !== count) throw new Error(`Need ${count} distinct propositions for ${key}.`);
  return result;
}

function buildOptions(correct: Proposition, distractors: readonly Proposition[], key: string): { options: string[]; correctIndex: number } {
  const ordered = rotate([correct, ...distractors], stableHash(key) % 4);
  return { options: ordered.map((item) => item.text), correctIndex: ordered.findIndex((item) => propositionKey(item) === propositionKey(correct)) };
}

function caseTables(caselet: LpCp03Caselet): string[] {
  return caselet.validStates.map((state, index) => `**Possible case ${index + 1}**\n\n${renderState(caselet, state)}`);
}

function makeChild(caselet: LpCp03Caselet, mode: LpCp03QueryMode, childIndex: number): LpCp03Child {
  const classes = classifyPropositions(caselet, caselet.validStates);
  const key = `${caselet.caseletId}:${mode}:${childIndex}`;

  let correct: Proposition;
  let distractors: Proposition[];
  let stem: string;
  let summary: string;
  let decision: string;

  if (mode === "COULD_BE_TRUE") {
    const nonMustCould = classes.could.filter((item) => !classes.must.some((must) => propositionKey(must) === propositionKey(item)));
    correct = pickDistinct(nonMustCould.length ? nonMustCould : classes.could, 1, `${key}:correct`)[0]!;
    distractors = pickDistinct(classes.cannot, 3, `${key}:distractors`);
    stem = "Which of the following could be true?";
    summary = `${correct.text} appears in at least one valid arrangement.`;
    decision = `The correct option appears in at least one possible case. Each other option appears in none of the valid cases.`;
  } else if (mode === "CANNOT_BE_TRUE") {
    correct = pickDistinct(classes.cannot, 1, `${key}:correct`)[0]!;
    const possibleDistractors = classes.could.filter((item) => propositionKey(item) !== propositionKey(correct));
    distractors = pickDistinct(possibleDistractors, 3, `${key}:distractors`);
    stem = "Which of the following cannot be true?";
    summary = `${correct.text} does not occur in any valid arrangement.`;
    decision = `The correct option is absent from every possible case. Each other option occurs in at least one valid case.`;
  } else {
    correct = pickDistinct(classes.must, 1, `${key}:correct`)[0]!;
    const notMust = allPropositions(caselet).filter((item) => !classes.must.some((must) => propositionKey(must) === propositionKey(item)));
    distractors = pickDistinct(notMust, 3, `${key}:distractors`);
    stem = "Which of the following must be true?";
    summary = `${correct.text} holds in every valid arrangement.`;
    decision = `The correct option is present in every possible case. Each other option fails in at least one valid case.`;
  }

  const { options, correctIndex } = buildOptions(correct, distractors, key);
  return {
    questionId: `${caselet.caseletId}-Q${childIndex + 1}`,
    candidateAuthority: "POSSIBILITY_SET_QUERY",
    queryMode: mode,
    stem,
    options,
    correctIndex,
    answer: options[correctIndex]!,
    explanation: {
      summary,
      lines: [
        "The given clues do not force one final arrangement. Keep every arrangement that satisfies all the clues.",
        ...caseTables(caselet),
        decision,
        `Therefore, the answer is **${options[correctIndex]}**`,
      ],
    },
  };
}

function semanticCorrectCount(caselet: LpCp03Caselet, child: LpCp03Child): number {
  const propositions = allPropositions(caselet);
  return child.options.filter((option) => {
    const proposition = propositions.find((item) => item.text === option);
    if (!proposition) return false;
    const truthCount = caselet.validStates.filter((state) => propositionTrue(state, proposition)).length;
    if (child.queryMode === "COULD_BE_TRUE") return truthCount > 0;
    if (child.queryMode === "CANNOT_BE_TRUE") return truthCount === 0;
    return truthCount === caselet.validStates.length;
  }).length;
}

export function generateLpCp03Caselet(seed = "lp-cp03-possibility-review", index = 0): LpCp03Caselet {
  const sourceCandidates = generateCaseletBatch(`${seed}:source`, Math.max(12, index + 4));
  let source: Caselet | undefined;
  let partial: { clues: Clue[]; states: Assignment[] } | undefined;

  for (let offset = 0; offset < sourceCandidates.length; offset += 1) {
    const candidate = sourceCandidates[(index + offset) % sourceCandidates.length]!;
    try {
      const result = choosePartialClues(candidate);
      source = candidate;
      partial = result;
      break;
    } catch {
      // Try another deterministic source caselet.
    }
  }

  if (!source || !partial) throw new Error(`Unable to generate CP03 caselet ${index}.`);

  const caselet: LpCp03Caselet = {
    caseletId: `LP-CP03-${String(index + 1).padStart(3, "0")}`,
    sourceCaseletId: source.caseletId,
    scenario: renderSetup(source, partial.clues),
    people: source.people,
    groups: source.groups,
    groupLabels: source.groupLabels,
    clues: partial.clues,
    validStates: partial.states,
    children: [],
  };

  const children = (["COULD_BE_TRUE", "CANNOT_BE_TRUE", "MUST_BE_TRUE"] as const).map((mode, childIndex) => makeChild(caselet, mode, childIndex));
  const finalized = { ...caselet, children };

  for (const child of finalized.children) {
    if (semanticCorrectCount(finalized, child) !== 1) throw new Error(`${child.questionId} does not have exactly one semantically correct option.`);
    if (new Set(child.options).size !== 4) throw new Error(`${child.questionId} contains duplicate options.`);
  }

  return finalized;
}

export function generateLpCp03Batch(seed = "lp-cp03-possibility-review", count = 8): LpCp03Caselet[] {
  return Array.from({ length: count }, (_, index) => generateLpCp03Caselet(seed, index));
}
