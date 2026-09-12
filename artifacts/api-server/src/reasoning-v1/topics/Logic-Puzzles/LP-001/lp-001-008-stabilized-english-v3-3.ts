import { solveCaselet, type Assignment, type Caselet } from "./index.ts";
import { solveLp002, type Lp002Caselet, type MultiAttributeAssignment } from "./lp-002.ts";
import { solveLp003, type Lp003Caselet, type StackAssignment } from "./lp-003.ts";
import { solveLp004, type Lp004Caselet, type SelectionAssignment } from "./lp-004.ts";
import { solveLp005, type GridAssignment, type Lp005Caselet } from "./lp-005.ts";
import { solveLp006, type Lp006Caselet, type SynthAssignment } from "./lp-006.ts";
import { solveLp007, type Lp007Caselet, type VariableAssignment } from "./lp-007.ts";
import { solveLp008, type CalendarAssignment, type Lp008Caselet, type SlotId } from "./lp-008.ts";
import {
  generateLp001BatchStabilizedV2,
  generateLp002BatchStabilizedV2,
  generateLp003BatchStabilizedV2,
  generateLp004BatchStabilizedV2,
  generateLp005BatchStabilizedV2,
  generateLp006BatchStabilizedV2,
  generateLp007BatchStabilizedV2,
  generateLp008BatchStabilizedV2,
} from "./lp-001-008-stabilized-english-v2.ts";

export const LP_001_008_STABILIZED_ENGLISH_V3_3 = Object.freeze({
  authorityId: "LP_001_008_STABILIZED_ENGLISH_V3_3" as const,
  parentAuthority: "LP_001_008_STABILIZED_ENGLISH_V2" as const,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  explanationStyle: "SIMPLE_PROGRESSIVE_PLACEHOLDER_TABLES_WITH_CASE_TABLES" as const,
  unresolvedPlaceholder: "?" as const,
  changesPuzzleSemantics: false as const,
  changesStem: false as const,
  changesClues: false as const,
  changesOptions: false as const,
  changesAnswer: false as const,
  changesCorrectIndex: false as const,
  changesDifficulty: false as const,
});

type ChildLike = {
  answer: string;
  explanation: { summary: string; lines: string[] };
};

type ExplanationCase<State> = {
  actual: State;
  alternate: State;
};

const STEP_HEADINGS = [
  "Use this clue",
  "Now use this clue",
  "Apply this clue",
  "Take the next clue",
] as const;

const FIXED_LINES = [
  "Now we can fill the new fixed entries.",
  "This clue fixes some more cells.",
  "We can now place the following information in the table.",
  "This gives us some definite entries.",
] as const;

const HOLD_LINES = [
  "No new cell is fixed yet. Keep this clue for the next step.",
  "This clue does not fill a new cell yet, but it will help with the next clue.",
  "Nothing new can be written in the table yet. Keep this condition in mind.",
  "The table does not change yet. We will combine this clue with the next one.",
] as const;

const TABLE_LABELS = [
  "Working table:",
  "Table after this clue:",
  "The table now becomes:",
  "Fill the table like this:",
] as const;

const CASE_INTROS = [
  "At this stage, two arrangements are still possible.",
  "Two cases are still possible here.",
  "The remaining places can be checked in two cases.",
  "Now compare the two possible cases.",
] as const;

const CASE_RESOLUTIONS = [
  "Apply this clue to both cases. Case 2 breaks the clue, so reject it. Case 1 remains.",
  "Check the clue in both cases. Case 2 is not possible, so keep Case 1.",
  "This clue removes Case 2. Therefore Case 1 is the valid arrangement.",
  "Case 2 conflicts with this clue. Cross it out and keep Case 1.",
] as const;

const FINAL_LINES = [
  "All entries are now fixed.",
  "The complete arrangement is now clear.",
  "We can now complete the table.",
  "The final arrangement is:",
] as const;

function hash(text: string): number {
  let value = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function pick<T>(values: readonly T[], key: string): T {
  return values[hash(key) % values.length]!;
}

function markdownTable(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  return [
    `| ${headers.join(" | ")} |`,
    `|${headers.map(() => "---").join("|")}|`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

function allSame<T>(states: readonly T[], read: (state: T) => string): string {
  if (!states.length) return "?";
  const values = [...new Set(states.map(read))];
  return values.length === 1 ? values[0]! : "?";
}

function tableChanged(before: string, after: string): boolean {
  return before !== after;
}

function buildExplanation<State, Clue>(input: {
  key: string;
  clues: readonly Clue[];
  clueText: (clue: Clue) => string;
  solve: (clues: readonly Clue[]) => State[];
  workingTable: (states: readonly State[]) => string;
  fullTable: (state: State) => string;
  finalState: State;
}): string[] {
  const prefixes: State[][] = [];
  for (let count = 0; count <= input.clues.length; count += 1) {
    prefixes.push(input.solve(input.clues.slice(0, count)));
  }

  const beforeLast = prefixes[Math.max(0, input.clues.length - 1)] ?? [];
  const alternate = beforeLast.find((state) => JSON.stringify(state) !== JSON.stringify(input.finalState));
  const casePlan: ExplanationCase<State> | undefined = alternate
    ? { actual: input.finalState, alternate }
    : undefined;

  const lines: string[] = [];
  for (let index = 0; index < input.clues.length; index += 1) {
    const clue = input.clues[index]!;
    const beforeTable = input.workingTable(prefixes[index] ?? []);
    const afterTable = input.workingTable(prefixes[index + 1] ?? []);
    const stepKey = `${input.key}:step:${index + 1}`;
    const changed = tableChanged(beforeTable, afterTable);

    let body = changed
      ? pick(FIXED_LINES, `${stepKey}:fixed`)
      : pick(HOLD_LINES, `${stepKey}:hold`);

    body += `\n\n${pick(TABLE_LABELS, `${stepKey}:table-label`)}\n\n${afterTable}`;

    if (casePlan && index === input.clues.length - 2) {
      body += `\n\n${pick(CASE_INTROS, `${stepKey}:case-intro`)}\n\n**Case 1**\n\n${input.fullTable(casePlan.actual)}\n\n**Case 2**\n\n${input.fullTable(casePlan.alternate)}`;
    }

    if (casePlan && index === input.clues.length - 1) {
      body += `\n\n${pick(CASE_RESOLUTIONS, `${stepKey}:case-resolution`)}`;
    }

    lines.push(`**Step ${index + 1}: ${pick(STEP_HEADINGS, `${stepKey}:heading`)} — ${input.clueText(clue)}**\n\n${body}`);
  }

  const finalStep = input.clues.length + 1;
  lines.push(`**Step ${finalStep}: Complete the arrangement**\n\n${pick(FINAL_LINES, `${input.key}:final`)}\n\n${input.fullTable(input.finalState)}`);
  return lines;
}

function withChildAnswers<T extends ChildLike>(children: readonly T[], shared: readonly string[]): T[] {
  return children.map((child) => ({
    ...child,
    explanation: {
      summary: `Fill the table step by step. The required answer is ${child.answer}.`,
      lines: [
        ...shared,
        `**Step ${shared.length + 1}: Answer the question**\n\nFrom the completed table, the answer is **${child.answer}**.`,
      ],
    },
  }));
}

function lp001WorkingTable(caselet: Caselet, states: readonly Assignment[]): string {
  return markdownTable(
    ["Person", "Group"],
    caselet.people.map((person) => [
      person,
      allSame(states, (state) => caselet.groupLabels[state[person]!]),
    ]),
  );
}

function lp001FullTable(caselet: Caselet, state: Assignment): string {
  return markdownTable(
    ["Person", "Group"],
    caselet.people.map((person) => [person, caselet.groupLabels[state[person]!]]),
  );
}

function simplifyLp001(caselet: Caselet): Caselet {
  const shared = buildExplanation({
    key: `LP-001:${caselet.caseletId}`,
    clues: caselet.clues,
    clueText: (clue) => clue.text,
    solve: (clues) => solveCaselet({ people: caselet.people, clues }),
    workingTable: (states) => lp001WorkingTable(caselet, states),
    fullTable: (state) => lp001FullTable(caselet, state),
    finalState: caselet.assignment,
  });
  return { ...caselet, children: withChildAnswers(caselet.children, shared) };
}

function lp002WorkingTable(caselet: Lp002Caselet, states: readonly MultiAttributeAssignment[]): string {
  return markdownTable(
    ["Person", "Day", "Location"],
    caselet.people.map((person) => [
      person,
      allSame(states, (state) => state.dayByPerson[person]!),
      allSame(states, (state) => caselet.locationLabels[state.locationByPerson[person]!]!),
    ]),
  );
}

function lp002FullTable(caselet: Lp002Caselet, state: MultiAttributeAssignment): string {
  return markdownTable(
    ["Person", "Day", "Location"],
    caselet.people.map((person) => [
      person,
      state.dayByPerson[person]!,
      caselet.locationLabels[state.locationByPerson[person]!]!,
    ]),
  );
}

function simplifyLp002(caselet: Lp002Caselet): Lp002Caselet {
  const shared = buildExplanation({
    key: `LP-002:${caselet.caseletId}`,
    clues: caselet.clues,
    clueText: (clue) => clue.text,
    solve: (clues) => solveLp002({ people: caselet.people, clues }),
    workingTable: (states) => lp002WorkingTable(caselet, states),
    fullTable: (state) => lp002FullTable(caselet, state),
    finalState: caselet.assignment,
  });
  return { ...caselet, children: withChildAnswers(caselet.children, shared) };
}

function lp003WorkingTable(caselet: Lp003Caselet, states: readonly StackAssignment[]): string {
  const positions = caselet.positions;
  return markdownTable(
    ["Position from bottom", "Item"],
    positions.map((position) => [
      String(position),
      allSame(states, (state) => {
        const box = caselet.boxes.find((candidate) => state[candidate] === position);
        return box ? caselet.boxLabels[box] : "?";
      }),
    ]),
  );
}

function lp003FullTable(caselet: Lp003Caselet, state: StackAssignment): string {
  return markdownTable(
    ["Position from bottom", "Item"],
    caselet.positions.map((position) => {
      const box = caselet.boxes.find((candidate) => state[candidate] === position)!;
      return [String(position), caselet.boxLabels[box]];
    }),
  );
}

function simplifyLp003(caselet: Lp003Caselet): Lp003Caselet {
  const shared = buildExplanation({
    key: `LP-003:${caselet.caseletId}`,
    clues: caselet.clues,
    clueText: (clue) => clue.text,
    solve: (clues) => solveLp003({ boxes: caselet.boxes, clues }),
    workingTable: (states) => lp003WorkingTable(caselet, states),
    fullTable: (state) => lp003FullTable(caselet, state),
    finalState: caselet.assignment,
  });
  return { ...caselet, children: withChildAnswers(caselet.children, shared) };
}

function lp004WorkingTable(caselet: Lp004Caselet, states: readonly SelectionAssignment[]): string {
  return markdownTable(
    ["Candidate", "Status"],
    caselet.candidates.map((candidate) => [
      caselet.candidateLabels[candidate],
      allSame(states, (state) => state[candidate] ? "Selected" : "Not selected"),
    ]),
  );
}

function lp004FullTable(caselet: Lp004Caselet, state: SelectionAssignment): string {
  return markdownTable(
    ["Candidate", "Status"],
    caselet.candidates.map((candidate) => [
      caselet.candidateLabels[candidate],
      state[candidate] ? "Selected" : "Not selected",
    ]),
  );
}

function simplifyLp004(caselet: Lp004Caselet): Lp004Caselet {
  const shared = buildExplanation({
    key: `LP-004:${caselet.caseletId}`,
    clues: caselet.clues,
    clueText: (clue) => clue.text,
    solve: (clues) => solveLp004({ candidates: caselet.candidates, committeeSize: caselet.committeeSize, clues }),
    workingTable: (states) => lp004WorkingTable(caselet, states),
    fullTable: (state) => lp004FullTable(caselet, state),
    finalState: caselet.assignment,
  });
  return { ...caselet, children: withChildAnswers(caselet.children, shared) };
}

function lp005WorkingTable(caselet: Lp005Caselet, states: readonly GridAssignment[]): string {
  return markdownTable(
    ["Person", "Duty", "Location"],
    caselet.people.map((person) => [
      caselet.labels.people[person],
      allSame(states, (state) => caselet.labels.duties[state.dutyByPerson[person]]),
      allSame(states, (state) => caselet.labels.places[state.placeByPerson[person]]),
    ]),
  );
}

function lp005FullTable(caselet: Lp005Caselet, state: GridAssignment): string {
  return markdownTable(
    ["Person", "Duty", "Location"],
    caselet.people.map((person) => [
      caselet.labels.people[person],
      caselet.labels.duties[state.dutyByPerson[person]],
      caselet.labels.places[state.placeByPerson[person]],
    ]),
  );
}

function simplifyLp005(caselet: Lp005Caselet): Lp005Caselet {
  const shared = buildExplanation({
    key: `LP-005:${caselet.caseletId}`,
    clues: caselet.clues,
    clueText: (clue) => clue.text,
    solve: (clues) => solveLp005({ people: caselet.people, clues }),
    workingTable: (states) => lp005WorkingTable(caselet, states),
    fullTable: (state) => lp005FullTable(caselet, state),
    finalState: caselet.assignment,
  });
  return { ...caselet, children: withChildAnswers(caselet.children, shared) };
}

function lp006WorkingTable(caselet: Lp006Caselet, states: readonly SynthAssignment[]): string {
  return markdownTable(
    ["Person", "Day", "Study area", "City"],
    caselet.people.map((person) => [
      caselet.labels.people[person],
      allSame(states, (state) => state.dayByPerson[person]),
      allSame(states, (state) => caselet.labels.subjects[state.subjectByPerson[person]]),
      allSame(states, (state) => caselet.labels.cities[state.cityByPerson[person]]),
    ]),
  );
}

function lp006FullTable(caselet: Lp006Caselet, state: SynthAssignment): string {
  return markdownTable(
    ["Person", "Day", "Study area", "City"],
    caselet.people.map((person) => [
      caselet.labels.people[person],
      state.dayByPerson[person],
      caselet.labels.subjects[state.subjectByPerson[person]],
      caselet.labels.cities[state.cityByPerson[person]],
    ]),
  );
}

function simplifyLp006(caselet: Lp006Caselet): Lp006Caselet {
  const shared = buildExplanation({
    key: `LP-006:${caselet.caseletId}`,
    clues: caselet.clues,
    clueText: (clue) => clue.text,
    solve: (clues) => solveLp006({ people: caselet.people, clues }),
    workingTable: (states) => lp006WorkingTable(caselet, states),
    fullTable: (state) => lp006FullTable(caselet, state),
    finalState: caselet.assignment,
  });
  return { ...caselet, children: withChildAnswers(caselet.children, shared) };
}

function lp007WorkingTable(caselet: Lp007Caselet, states: readonly VariableAssignment[]): string {
  const personHeader = caselet.labels.personNoun[0]!.toUpperCase() + caselet.labels.personNoun.slice(1);
  const valueHeader = caselet.labels.valueNoun[0]!.toUpperCase() + caselet.labels.valueNoun.slice(1);
  return markdownTable(
    [personHeader, valueHeader],
    caselet.people.map((person) => [
      caselet.labels.people[person],
      allSame(states, (state) => caselet.labels.values[state[person]]),
    ]),
  );
}

function lp007FullTable(caselet: Lp007Caselet, state: VariableAssignment): string {
  const personHeader = caselet.labels.personNoun[0]!.toUpperCase() + caselet.labels.personNoun.slice(1);
  const valueHeader = caselet.labels.valueNoun[0]!.toUpperCase() + caselet.labels.valueNoun.slice(1);
  return markdownTable(
    [personHeader, valueHeader],
    caselet.people.map((person) => [caselet.labels.people[person], caselet.labels.values[state[person]]]),
  );
}

function simplifyLp007(caselet: Lp007Caselet): Lp007Caselet {
  const shared = buildExplanation({
    key: `LP-007:${caselet.caseletId}`,
    clues: caselet.clues,
    clueText: (clue) => clue.text,
    solve: (clues) => solveLp007({ clues }),
    workingTable: (states) => lp007WorkingTable(caselet, states),
    fullTable: (state) => lp007FullTable(caselet, state),
    finalState: caselet.assignment,
  });
  return { ...caselet, children: withChildAnswers(caselet.children, shared) };
}

function slotLabel(caselet: Lp008Caselet, slot: SlotId): string {
  const month = caselet.labels.months[Math.floor(slot / 2) as 0 | 1 | 2 | 3];
  return `${slot % 2 === 0 ? "12th" : "27th"} ${month}`;
}

function lp008WorkingTable(caselet: Lp008Caselet, states: readonly CalendarAssignment[]): string {
  return markdownTable(
    ["Person", "Date and month"],
    caselet.people.map((person) => [
      caselet.labels.people[person],
      allSame(states, (state) => slotLabel(caselet, state[person])),
    ]),
  );
}

function lp008FullTable(caselet: Lp008Caselet, state: CalendarAssignment): string {
  return markdownTable(
    ["Person", "Date and month"],
    caselet.people.map((person) => [caselet.labels.people[person], slotLabel(caselet, state[person])]),
  );
}

function simplifyLp008(caselet: Lp008Caselet): Lp008Caselet {
  const shared = buildExplanation({
    key: `LP-008:${caselet.caseletId}`,
    clues: caselet.clues,
    clueText: (clue) => clue.text,
    solve: (clues) => solveLp008({ clues }),
    workingTable: (states) => lp008WorkingTable(caselet, states),
    fullTable: (state) => lp008FullTable(caselet, state),
    finalState: caselet.assignment,
  });
  return { ...caselet, children: withChildAnswers(caselet.children, shared) };
}

export function generateLp001BatchStabilizedV3_3(seed = "lp-001-stabilized-v3-3", count = 8): Caselet[] { return generateLp001BatchStabilizedV2(seed, count).map(simplifyLp001); }
export function generateLp002BatchStabilizedV3_3(seed = "lp-002-stabilized-v3-3", count = 8): Lp002Caselet[] { return generateLp002BatchStabilizedV2(seed, count).map(simplifyLp002); }
export function generateLp003BatchStabilizedV3_3(seed = "lp-003-stabilized-v3-3", count = 8): Lp003Caselet[] { return generateLp003BatchStabilizedV2(seed, count).map(simplifyLp003); }
export function generateLp004BatchStabilizedV3_3(seed = "lp-004-stabilized-v3-3", count = 8): Lp004Caselet[] { return generateLp004BatchStabilizedV2(seed, count).map(simplifyLp004); }
export function generateLp005BatchStabilizedV3_3(seed = "lp-005-stabilized-v3-3", count = 8): Lp005Caselet[] { return generateLp005BatchStabilizedV2(seed, count).map(simplifyLp005); }
export function generateLp006BatchStabilizedV3_3(seed = "lp-006-stabilized-v3-3", count = 8): Lp006Caselet[] { return generateLp006BatchStabilizedV2(seed, count).map(simplifyLp006); }
export function generateLp007BatchStabilizedV3_3(seed = "lp-007-stabilized-v3-3", count = 8): Lp007Caselet[] { return generateLp007BatchStabilizedV2(seed, count).map(simplifyLp007); }
export function generateLp008BatchStabilizedV3_3(seed = "lp-008-stabilized-v3-3", count = 8): Lp008Caselet[] { return generateLp008BatchStabilizedV2(seed, count).map(simplifyLp008); }
