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

export const LP_001_008_STABILIZED_ENGLISH_V3 = Object.freeze({
  authorityId: "LP_001_008_STABILIZED_ENGLISH_V3" as const,
  parentAuthority: "LP_001_008_STABILIZED_ENGLISH_V2" as const,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  explanationStyle: "SIMPLE_STEP_BY_STEP_WITH_GENUINE_CASES" as const,
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

type CaseComparison = {
  subject: string;
  actual: string;
  alternate: string;
};

function markdownTable(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  return [
    `| ${headers.join(" | ")} |`,
    `|${headers.map(() => "---").join("|")}|`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

function newFacts(before: ReadonlyMap<string, string>, after: ReadonlyMap<string, string>): string[] {
  return [...after.entries()]
    .filter(([key, value]) => before.get(key) !== value)
    .map(([, value]) => value);
}

function buildSimpleExplanation<State, Clue>(input: {
  clues: readonly Clue[];
  clueText: (clue: Clue) => string;
  solve: (clues: readonly Clue[]) => State[];
  facts: (states: readonly State[]) => Map<string, string>;
  finalState: State;
  compareCase: (actual: State, alternate: State) => CaseComparison;
  finalTable: string;
}): string[] {
  const prefixStates: State[][] = [];
  for (let count = 0; count <= input.clues.length; count += 1) {
    prefixStates.push(input.solve(input.clues.slice(0, count)));
  }

  const beforeLast = prefixStates[Math.max(0, input.clues.length - 1)] ?? [];
  const alternate = beforeLast.find((state) => JSON.stringify(state) !== JSON.stringify(input.finalState));
  const casePlan = alternate ? input.compareCase(input.finalState, alternate) : undefined;

  const lines: string[] = [];
  for (let index = 0; index < input.clues.length; index += 1) {
    const before = input.facts(prefixStates[index] ?? []);
    const after = input.facts(prefixStates[index + 1] ?? []);
    const fixed = newFacts(before, after);
    const clue = input.clues[index]!;

    let detail = fixed.length
      ? `Combining this with the earlier clues, we can now fix ${fixed.join(" ")}`
      : "This clue does not fix a complete entry by itself. Keep it with the earlier clues.";

    if (casePlan && index === input.clues.length - 2) {
      detail += `\n\nTwo cases are worth checking for ${casePlan.subject}:\n\n**Case 1:** ${casePlan.actual}\n\n**Case 2:** ${casePlan.alternate}`;
    }
    if (casePlan && index === input.clues.length - 1) {
      detail += "\n\nNow test the two cases with this clue. Case 2 does not satisfy it, so Case 2 is rejected. Case 1 remains, and the rest of the arrangement is fixed.";
    }

    lines.push(`**Step ${index + 1}: Use the clue — ${input.clueText(clue)}**\n\n${detail}`);
  }

  lines.push(`**Step ${input.clues.length + 1}: Write the final arrangement**\n\n${input.finalTable}`);
  return lines;
}

function withChildAnswers<T extends ChildLike>(children: readonly T[], shared: readonly string[]): T[] {
  return children.map((child) => ({
    ...child,
    explanation: {
      summary: `Follow the clues step by step. The required answer is ${child.answer}.`,
      lines: [
        ...shared,
        `**Step ${shared.length + 1}: Answer the question**\n\nFrom the final arrangement, the answer is **${child.answer}**.`,
      ],
    },
  }));
}

function fixedMap<T>(keys: readonly string[], states: readonly T[], read: (state: T, key: string) => string, sentence: (key: string, value: string) => string): Map<string, string> {
  const result = new Map<string, string>();
  if (!states.length) return result;
  for (const key of keys) {
    const values = [...new Set(states.map((state) => read(state, key)))];
    if (values.length === 1) result.set(key, sentence(key, values[0]!));
  }
  return result;
}

function simplifyLp001(caselet: Caselet): Caselet {
  const facts = (states: readonly Assignment[]) => fixedMap(caselet.people, states, (state, person) => caselet.groupLabels[state[person]!], (person, group) => `${person} = ${group}.`);
  const compareCase = (actual: Assignment, alternate: Assignment): CaseComparison => {
    const person = caselet.people.find((candidate) => actual[candidate] !== alternate[candidate])!;
    return { subject: person, actual: `${person} is in ${caselet.groupLabels[actual[person]!]}.`, alternate: `${person} is in ${caselet.groupLabels[alternate[person]!]}.` };
  };
  const finalTable = markdownTable(["Group", "Members"], caselet.groups.map((group) => [caselet.groupLabels[group], caselet.people.filter((person) => caselet.assignment[person] === group).join(" and ")]));
  const shared = buildSimpleExplanation({ clues: caselet.clues, clueText: (clue) => clue.text, solve: (clues) => solveCaselet({ people: caselet.people, clues }), facts, finalState: caselet.assignment, compareCase, finalTable });
  return { ...caselet, children: withChildAnswers(caselet.children, shared) };
}

function simplifyLp002(caselet: Lp002Caselet): Lp002Caselet {
  const keys = caselet.people.flatMap((person) => [`day:${person}`, `location:${person}`]);
  const facts = (states: readonly MultiAttributeAssignment[]) => fixedMap(keys, states,
    (state, key) => { const [kind, person] = key.split(":"); return kind === "day" ? state.dayByPerson[person]! : caselet.locationLabels[state.locationByPerson[person]!]!; },
    (key, value) => { const [kind, person] = key.split(":"); return kind === "day" ? `${person} = ${value}.` : `${person}'s location = ${value}.`; });
  const compareCase = (actual: MultiAttributeAssignment, alternate: MultiAttributeAssignment): CaseComparison => {
    for (const person of caselet.people) if (actual.dayByPerson[person] !== alternate.dayByPerson[person]) return { subject: person, actual: `${person} is on ${actual.dayByPerson[person]}.`, alternate: `${person} is on ${alternate.dayByPerson[person]}.` };
    const person = caselet.people.find((candidate) => actual.locationByPerson[candidate] !== alternate.locationByPerson[candidate])!;
    return { subject: person, actual: `${person} is at ${caselet.locationLabels[actual.locationByPerson[person]!]}.`, alternate: `${person} is at ${caselet.locationLabels[alternate.locationByPerson[person]!]}.` };
  };
  const finalTable = markdownTable(["Person", "Day", "Location"], caselet.people.map((person) => [person, caselet.assignment.dayByPerson[person]!, caselet.locationLabels[caselet.assignment.locationByPerson[person]!]!]));
  const shared = buildSimpleExplanation({ clues: caselet.clues, clueText: (clue) => clue.text, solve: (clues) => solveLp002({ people: caselet.people, clues }), facts, finalState: caselet.assignment, compareCase, finalTable });
  return { ...caselet, children: withChildAnswers(caselet.children, shared) };
}

function simplifyLp003(caselet: Lp003Caselet): Lp003Caselet {
  const facts = (states: readonly StackAssignment[]) => fixedMap(caselet.boxes, states, (state, box) => String(state[box]!), (box, position) => `${caselet.boxLabels[box]} = position ${position} from the bottom.`);
  const compareCase = (actual: StackAssignment, alternate: StackAssignment): CaseComparison => {
    const box = caselet.boxes.find((candidate) => actual[candidate] !== alternate[candidate])!;
    return { subject: caselet.boxLabels[box], actual: `${caselet.boxLabels[box]} is at position ${actual[box]} from the bottom.`, alternate: `${caselet.boxLabels[box]} is at position ${alternate[box]} from the bottom.` };
  };
  const finalTable = markdownTable(["Position from bottom", "Item"], [...caselet.boxes].sort((a, b) => caselet.assignment[a]! - caselet.assignment[b]!).map((box) => [String(caselet.assignment[box]), caselet.boxLabels[box]]));
  const shared = buildSimpleExplanation({ clues: caselet.clues, clueText: (clue) => clue.text, solve: (clues) => solveLp003({ boxes: caselet.boxes, clues }), facts, finalState: caselet.assignment, compareCase, finalTable });
  return { ...caselet, children: withChildAnswers(caselet.children, shared) };
}

function simplifyLp004(caselet: Lp004Caselet): Lp004Caselet {
  const facts = (states: readonly SelectionAssignment[]) => fixedMap(caselet.candidates, states, (state, candidate) => state[candidate] ? "Selected" : "Not selected", (candidate, status) => `${caselet.candidateLabels[candidate]} = ${status}.`);
  const compareCase = (actual: SelectionAssignment, alternate: SelectionAssignment): CaseComparison => {
    const candidate = caselet.candidates.find((person) => actual[person] !== alternate[person])!;
    const name = caselet.candidateLabels[candidate];
    return { subject: name, actual: `${name} is ${actual[candidate] ? "selected" : "not selected"}.`, alternate: `${name} is ${alternate[candidate] ? "selected" : "not selected"}.` };
  };
  const finalTable = markdownTable(["Candidate", "Status"], caselet.candidates.map((candidate) => [caselet.candidateLabels[candidate], caselet.assignment[candidate] ? "Selected" : "Not selected"]));
  const shared = buildSimpleExplanation({ clues: caselet.clues, clueText: (clue) => clue.text, solve: (clues) => solveLp004({ candidates: caselet.candidates, committeeSize: caselet.committeeSize, clues }), facts, finalState: caselet.assignment, compareCase, finalTable });
  return { ...caselet, children: withChildAnswers(caselet.children, shared) };
}

function simplifyLp005(caselet: Lp005Caselet): Lp005Caselet {
  const keys = caselet.people.flatMap((person) => [`duty:${person}`, `place:${person}`]);
  const facts = (states: readonly GridAssignment[]) => fixedMap(keys, states,
    (state, key) => { const [kind, person] = key.split(":"); return kind === "duty" ? caselet.labels.duties[state.dutyByPerson[person]!]! : caselet.labels.places[state.placeByPerson[person]!]!; },
    (key, value) => { const [kind, person] = key.split(":"); const name = caselet.labels.people[person]!; return kind === "duty" ? `${name}'s duty = ${value}.` : `${name}'s location = ${value}.`; });
  const compareCase = (actual: GridAssignment, alternate: GridAssignment): CaseComparison => {
    for (const person of caselet.people) if (actual.dutyByPerson[person] !== alternate.dutyByPerson[person]) return { subject: caselet.labels.people[person], actual: `${caselet.labels.people[person]}'s duty is ${caselet.labels.duties[actual.dutyByPerson[person]]}.`, alternate: `${caselet.labels.people[person]}'s duty is ${caselet.labels.duties[alternate.dutyByPerson[person]]}.` };
    const person = caselet.people.find((candidate) => actual.placeByPerson[candidate] !== alternate.placeByPerson[candidate])!;
    return { subject: caselet.labels.people[person], actual: `${caselet.labels.people[person]}'s location is ${caselet.labels.places[actual.placeByPerson[person]]}.`, alternate: `${caselet.labels.people[person]}'s location is ${caselet.labels.places[alternate.placeByPerson[person]]}.` };
  };
  const finalTable = markdownTable(["Person", "Duty", "Location"], caselet.people.map((person) => [caselet.labels.people[person], caselet.labels.duties[caselet.assignment.dutyByPerson[person]], caselet.labels.places[caselet.assignment.placeByPerson[person]]]));
  const shared = buildSimpleExplanation({ clues: caselet.clues, clueText: (clue) => clue.text, solve: (clues) => solveLp005({ people: caselet.people, clues }), facts, finalState: caselet.assignment, compareCase, finalTable });
  return { ...caselet, children: withChildAnswers(caselet.children, shared) };
}

function simplifyLp006(caselet: Lp006Caselet): Lp006Caselet {
  const keys = caselet.people.flatMap((person) => [`day:${person}`, `subject:${person}`, `city:${person}`]);
  const facts = (states: readonly SynthAssignment[]) => fixedMap(keys, states,
    (state, key) => { const [kind, person] = key.split(":"); if (kind === "day") return state.dayByPerson[person]!; if (kind === "subject") return caselet.labels.subjects[state.subjectByPerson[person]!]!; return caselet.labels.cities[state.cityByPerson[person]!]!; },
    (key, value) => { const [kind, person] = key.split(":"); const name = caselet.labels.people[person]!; return `${name}'s ${kind === "subject" ? "study area" : kind} = ${value}.`; });
  const compareCase = (actual: SynthAssignment, alternate: SynthAssignment): CaseComparison => {
    for (const person of caselet.people) if (actual.dayByPerson[person] !== alternate.dayByPerson[person]) return { subject: caselet.labels.people[person], actual: `${caselet.labels.people[person]} is on ${actual.dayByPerson[person]}.`, alternate: `${caselet.labels.people[person]} is on ${alternate.dayByPerson[person]}.` };
    for (const person of caselet.people) if (actual.subjectByPerson[person] !== alternate.subjectByPerson[person]) return { subject: caselet.labels.people[person], actual: `${caselet.labels.people[person]}'s study area is ${caselet.labels.subjects[actual.subjectByPerson[person]]}.`, alternate: `${caselet.labels.people[person]}'s study area is ${caselet.labels.subjects[alternate.subjectByPerson[person]]}.` };
    const person = caselet.people.find((candidate) => actual.cityByPerson[candidate] !== alternate.cityByPerson[candidate])!;
    return { subject: caselet.labels.people[person], actual: `${caselet.labels.people[person]} is in ${caselet.labels.cities[actual.cityByPerson[person]]}.`, alternate: `${caselet.labels.people[person]} is in ${caselet.labels.cities[alternate.cityByPerson[person]]}.` };
  };
  const finalTable = markdownTable(["Person", "Day", "Study area", "City"], caselet.people.map((person) => [caselet.labels.people[person], caselet.assignment.dayByPerson[person], caselet.labels.subjects[caselet.assignment.subjectByPerson[person]], caselet.labels.cities[caselet.assignment.cityByPerson[person]]]));
  const shared = buildSimpleExplanation({ clues: caselet.clues, clueText: (clue) => clue.text, solve: (clues) => solveLp006({ people: caselet.people, clues }), facts, finalState: caselet.assignment, compareCase, finalTable });
  return { ...caselet, children: withChildAnswers(caselet.children, shared) };
}

function simplifyLp007(caselet: Lp007Caselet): Lp007Caselet {
  const facts = (states: readonly VariableAssignment[]) => fixedMap(caselet.people, states, (state, person) => caselet.labels.values[state[person]!], (person, value) => `${caselet.labels.people[person]} = ${value}.`);
  const compareCase = (actual: VariableAssignment, alternate: VariableAssignment): CaseComparison => {
    const person = caselet.people.find((candidate) => actual[candidate] !== alternate[candidate])!;
    return { subject: caselet.labels.people[person], actual: `${caselet.labels.people[person]} = ${caselet.labels.values[actual[person]]}.`, alternate: `${caselet.labels.people[person]} = ${caselet.labels.values[alternate[person]]}.` };
  };
  const finalTable = markdownTable([caselet.labels.personNoun[0]!.toUpperCase() + caselet.labels.personNoun.slice(1), caselet.labels.valueNoun[0]!.toUpperCase() + caselet.labels.valueNoun.slice(1)], caselet.people.map((person) => [caselet.labels.people[person], caselet.labels.values[caselet.assignment[person]]]));
  const shared = buildSimpleExplanation({ clues: caselet.clues, clueText: (clue) => clue.text, solve: (clues) => solveLp007({ clues }), facts, finalState: caselet.assignment, compareCase, finalTable });
  return { ...caselet, children: withChildAnswers(caselet.children, shared) };
}

function slotLabel(caselet: Lp008Caselet, slot: SlotId): string {
  const month = caselet.labels.months[Math.floor(slot / 2) as 0 | 1 | 2 | 3];
  return `${slot % 2 === 0 ? "12th" : "27th"} ${month}`;
}

function simplifyLp008(caselet: Lp008Caselet): Lp008Caselet {
  const facts = (states: readonly CalendarAssignment[]) => fixedMap(caselet.people, states, (state, person) => slotLabel(caselet, state[person]!), (person, value) => `${caselet.labels.people[person]} = ${value}.`);
  const compareCase = (actual: CalendarAssignment, alternate: CalendarAssignment): CaseComparison => {
    const person = caselet.people.find((candidate) => actual[candidate] !== alternate[candidate])!;
    return { subject: caselet.labels.people[person], actual: `${caselet.labels.people[person]} is on ${slotLabel(caselet, actual[person])}.`, alternate: `${caselet.labels.people[person]} is on ${slotLabel(caselet, alternate[person])}.` };
  };
  const finalTable = markdownTable(["Person", "Date and month"], caselet.people.map((person) => [caselet.labels.people[person], slotLabel(caselet, caselet.assignment[person])]));
  const shared = buildSimpleExplanation({ clues: caselet.clues, clueText: (clue) => clue.text, solve: (clues) => solveLp008({ clues }), facts, finalState: caselet.assignment, compareCase, finalTable });
  return { ...caselet, children: withChildAnswers(caselet.children, shared) };
}

export function generateLp001BatchStabilizedV3(seed = "lp-001-stabilized-v3", count = 8): Caselet[] { return generateLp001BatchStabilizedV2(seed, count).map(simplifyLp001); }
export function generateLp002BatchStabilizedV3(seed = "lp-002-stabilized-v3", count = 8): Lp002Caselet[] { return generateLp002BatchStabilizedV2(seed, count).map(simplifyLp002); }
export function generateLp003BatchStabilizedV3(seed = "lp-003-stabilized-v3", count = 8): Lp003Caselet[] { return generateLp003BatchStabilizedV2(seed, count).map(simplifyLp003); }
export function generateLp004BatchStabilizedV3(seed = "lp-004-stabilized-v3", count = 8): Lp004Caselet[] { return generateLp004BatchStabilizedV2(seed, count).map(simplifyLp004); }
export function generateLp005BatchStabilizedV3(seed = "lp-005-stabilized-v3", count = 8): Lp005Caselet[] { return generateLp005BatchStabilizedV2(seed, count).map(simplifyLp005); }
export function generateLp006BatchStabilizedV3(seed = "lp-006-stabilized-v3", count = 8): Lp006Caselet[] { return generateLp006BatchStabilizedV2(seed, count).map(simplifyLp006); }
export function generateLp007BatchStabilizedV3(seed = "lp-007-stabilized-v3", count = 8): Lp007Caselet[] { return generateLp007BatchStabilizedV2(seed, count).map(simplifyLp007); }
export function generateLp008BatchStabilizedV3(seed = "lp-008-stabilized-v3", count = 8): Lp008Caselet[] { return generateLp008BatchStabilizedV2(seed, count).map(simplifyLp008); }
