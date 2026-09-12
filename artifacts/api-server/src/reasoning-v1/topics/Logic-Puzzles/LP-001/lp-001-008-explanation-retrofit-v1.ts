import {
  generateCaseletBatch,
  solveCaselet,
  type Assignment,
  type Caselet,
  type GroupId,
} from "./index.ts";
import {
  generateLp002Batch,
  solveLp002,
  type Day,
  type LocationId,
  type Lp002Caselet,
  type MultiAttributeAssignment,
} from "./lp-002.ts";
import {
  generateLp003Batch,
  solveLp003,
  type BoxId,
  type Lp003Caselet,
  type StackAssignment,
  type StackPosition,
} from "./lp-003.ts";
import {
  generateLp004Batch,
  solveLp004,
  type CandidateId,
  type Lp004Caselet,
  type SelectionAssignment,
} from "./lp-004.ts";
import {
  generateLp005Batch,
  solveLp005,
  type GridAssignment,
  type GridDuty,
  type GridPerson,
  type GridPlace,
  type Lp005Caselet,
} from "./lp-005.ts";
import {
  generateLp006Batch,
  solveLp006,
  type Lp006Caselet,
  type SynthAssignment,
  type SynthCity,
  type SynthDay,
  type SynthPerson,
  type SynthSubject,
} from "./lp-006.ts";
import {
  generateLp007Batch,
  solveLp007,
  type Lp007Caselet,
  type VariableAssignment,
  type VariablePerson,
  type VariableValue,
} from "./lp-007.ts";
import {
  generateLp008Batch,
  solveLp008,
  type CalendarAssignment,
  type CalendarPerson,
  type Lp008Caselet,
  type SlotId,
} from "./lp-008.ts";

export const LP_001_008_EXPLANATION_RETROFIT_V1 = Object.freeze({
  authorityId: "LP_001_008_EXPLANATION_RETROFIT_V1" as const,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  packages: ["LP-001", "LP-002", "LP-003", "LP-004", "LP-005", "LP-006", "LP-007", "LP-008"] as const,
  benchmark: "LP_009_LP_010_CLUE_BY_CLUE_PROGRESSIVE_TABLES" as const,
  changesPuzzleSemantics: false as const,
  changesStems: false as const,
  changesClues: false as const,
  changesOptions: false as const,
  changesAnswers: false as const,
  changesDifficulty: false as const,
});

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function markdownTable(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  const head = `| ${headers.join(" | ")} |`;
  const divider = `|${headers.map(() => "---").join("|")}|`;
  return [head, divider, ...rows.map((row) => `| ${row.join(" | ")} |`)].join("\n");
}

function step(clueNumber: number, clueText: string, consequence: string, table: string): string {
  return `**Step ${clueNumber}: Use the clue — ${clueText}**\n\n${consequence}\n\n${table}`;
}

function finish(stepNumber: number, table: string): string {
  return `**Step ${stepNumber}: Read the completed arrangement**\n\nAfter all the clues are applied, the arrangement is fixed.\n\n${table}`;
}

function answerLine(stepNumber: number, answer: string): string {
  return `**Step ${stepNumber}: Answer the question**\n\nFrom the completed arrangement, the answer is **${answer}**.`;
}

function explanationForChildren<T extends { answer: string; explanation: { summary: string; lines: string[] } }>(
  children: readonly T[],
  sharedLines: readonly string[],
): T[] {
  return children.map((child) => ({
    ...child,
    explanation: {
      summary: `The clues lead to one complete arrangement. The required answer is ${child.answer}.`,
      lines: [...sharedLines, answerLine(sharedLines.length + 1, child.answer)],
    },
  }));
}

function lp001Table(caselet: Caselet, states: readonly Assignment[]): string {
  const rows = caselet.people.map((person) => {
    const possible = caselet.groups.filter((group) => states.some((state) => state[person] === group));
    return [person, possible.map((group) => caselet.groupLabels[group]).join(", ")];
  });
  return markdownTable(["Person", "Possible group(s)"], rows);
}

function retrofitLp001(caselet: Caselet): Caselet {
  const shared: string[] = [];
  for (let index = 0; index < caselet.clues.length; index += 1) {
    const clue = caselet.clues[index]!;
    const states = solveCaselet({ people: caselet.people, clues: caselet.clues.slice(0, index + 1) });
    shared.push(step(index + 1, clue.text, "Keep only the group placements that satisfy this clue and the earlier clues.", lp001Table(caselet, states)));
  }
  shared.push(finish(caselet.clues.length + 1, lp001Table(caselet, [caselet.assignment])));
  return { ...caselet, children: explanationForChildren(caselet.children, shared) };
}

function lp002Table(caselet: Lp002Caselet, states: readonly MultiAttributeAssignment[]): string {
  const rows = caselet.people.map((person) => {
    const days = caselet.days.filter((day) => states.some((state) => state.dayByPerson[person] === day));
    const locations = caselet.locations.filter((location) => states.some((state) => state.locationByPerson[person] === location));
    return [person, days.join(", "), locations.map((location) => caselet.locationLabels[location]).join(", ")];
  });
  return markdownTable(["Person", "Possible day(s)", "Possible location(s)"], rows);
}

function retrofitLp002(caselet: Lp002Caselet): Lp002Caselet {
  const shared: string[] = [];
  for (let index = 0; index < caselet.clues.length; index += 1) {
    const clue = caselet.clues[index]!;
    const states = solveLp002({ people: caselet.people, clues: caselet.clues.slice(0, index + 1) });
    shared.push(step(index + 1, clue.text, "Use the clue to narrow the possible day and location for each person.", lp002Table(caselet, states)));
  }
  shared.push(finish(caselet.clues.length + 1, lp002Table(caselet, [caselet.assignment])));
  return { ...caselet, children: explanationForChildren(caselet.children, shared) };
}

function lp003Table(caselet: Lp003Caselet, states: readonly StackAssignment[]): string {
  const rows = caselet.boxes.map((box) => {
    const positions = caselet.positions.filter((position) => states.some((state) => state[box] === position));
    return [caselet.boxLabels[box], positions.join(", ")];
  });
  return markdownTable(["Item", "Possible position(s) from bottom"], rows);
}

function retrofitLp003(caselet: Lp003Caselet): Lp003Caselet {
  const shared: string[] = [];
  for (let index = 0; index < caselet.clues.length; index += 1) {
    const clue = caselet.clues[index]!;
    const states = solveLp003({ boxes: caselet.boxes, clues: caselet.clues.slice(0, index + 1) });
    shared.push(step(index + 1, clue.text, "Use the clue to remove stack positions that are no longer possible.", lp003Table(caselet, states)));
  }
  shared.push(finish(caselet.clues.length + 1, lp003Table(caselet, [caselet.assignment])));
  return { ...caselet, children: explanationForChildren(caselet.children, shared) };
}

function lp004Table(caselet: Lp004Caselet, states: readonly SelectionAssignment[]): string {
  const rows = caselet.candidates.map((candidate) => {
    const statuses = unique(states.map((state) => state[candidate]))
      .sort((left, right) => Number(right) - Number(left))
      .map((selected) => selected ? "Selected" : "Not selected");
    return [caselet.candidateLabels[candidate], statuses.join(" / ")];
  });
  return markdownTable(["Candidate", "Possible status"], rows);
}

function retrofitLp004(caselet: Lp004Caselet): Lp004Caselet {
  const shared: string[] = [];
  for (let index = 0; index < caselet.clues.length; index += 1) {
    const clue = caselet.clues[index]!;
    const states = solveLp004({ candidates: caselet.candidates, committeeSize: caselet.committeeSize, clues: caselet.clues.slice(0, index + 1) });
    shared.push(step(index + 1, clue.text, "Apply the condition and keep only the selections that still satisfy all conditions used so far.", lp004Table(caselet, states)));
  }
  shared.push(finish(caselet.clues.length + 1, lp004Table(caselet, [caselet.assignment])));
  return { ...caselet, children: explanationForChildren(caselet.children, shared) };
}

function lp005Table(caselet: Lp005Caselet, states: readonly GridAssignment[]): string {
  const rows = caselet.people.map((person) => {
    const duties = caselet.duties.filter((duty) => states.some((state) => state.dutyByPerson[person] === duty));
    const places = caselet.places.filter((place) => states.some((state) => state.placeByPerson[person] === place));
    return [caselet.labels.people[person], duties.map((duty) => caselet.labels.duties[duty]).join(", "), places.map((place) => caselet.labels.places[place]).join(", ")];
  });
  return markdownTable(["Person", "Possible duty/duties", "Possible place(s)"], rows);
}

function retrofitLp005(caselet: Lp005Caselet): Lp005Caselet {
  const shared: string[] = [];
  for (let index = 0; index < caselet.clues.length; index += 1) {
    const clue = caselet.clues[index]!;
    const states = solveLp005({ people: caselet.people, clues: caselet.clues.slice(0, index + 1) });
    shared.push(step(index + 1, clue.text, "Use the clue to narrow each person's duty and place.", lp005Table(caselet, states)));
  }
  shared.push(finish(caselet.clues.length + 1, lp005Table(caselet, [caselet.assignment])));
  return { ...caselet, children: explanationForChildren(caselet.children, shared) };
}

function lp006Table(caselet: Lp006Caselet, states: readonly SynthAssignment[]): string {
  const rows = caselet.people.map((person) => {
    const days = caselet.days.filter((day) => states.some((state) => state.dayByPerson[person] === day));
    const subjects = caselet.subjects.filter((subject) => states.some((state) => state.subjectByPerson[person] === subject));
    const cities = caselet.cities.filter((city) => states.some((state) => state.cityByPerson[person] === city));
    return [caselet.labels.people[person], days.join(", "), subjects.map((subject) => caselet.labels.subjects[subject]).join(", "), cities.map((city) => caselet.labels.cities[city]).join(", ")];
  });
  return markdownTable(["Person", "Possible day(s)", "Possible study area(s)", "Possible city/cities"], rows);
}

function retrofitLp006(caselet: Lp006Caselet): Lp006Caselet {
  const shared: string[] = [];
  for (let index = 0; index < caselet.clues.length; index += 1) {
    const clue = caselet.clues[index]!;
    const states = solveLp006({ people: caselet.people, clues: caselet.clues.slice(0, index + 1) });
    shared.push(step(index + 1, clue.text, "Use the clue to narrow the possible day, study area and city for each person.", lp006Table(caselet, states)));
  }
  shared.push(finish(caselet.clues.length + 1, lp006Table(caselet, [caselet.assignment])));
  return { ...caselet, children: explanationForChildren(caselet.children, shared) };
}

function lp007Table(caselet: Lp007Caselet, states: readonly VariableAssignment[]): string {
  const rows = caselet.people.map((person) => {
    const values = caselet.values.filter((value) => states.some((state) => state[person] === value));
    return [caselet.labels.people[person], values.map((value) => caselet.labels.values[value]).join(", ")];
  });
  return markdownTable([caselet.labels.personNoun[0]!.toUpperCase() + caselet.labels.personNoun.slice(1), "Remaining possibility/possibilities"], rows);
}

function retrofitLp007(caselet: Lp007Caselet): Lp007Caselet {
  const shared: string[] = [];
  for (let index = 0; index < caselet.clues.length; index += 1) {
    const clue = caselet.clues[index]!;
    const states = solveLp007({ clues: caselet.clues.slice(0, index + 1) });
    shared.push(step(index + 1, clue.text, "Use the clue to remove values that are no longer possible for each person.", lp007Table(caselet, states)));
  }
  shared.push(finish(caselet.clues.length + 1, lp007Table(caselet, [caselet.assignment])));
  return { ...caselet, children: explanationForChildren(caselet.children, shared) };
}

function lp008SlotLabel(caselet: Lp008Caselet, slot: SlotId): string {
  const month = caselet.labels.months[Math.floor(slot / 2) as 0 | 1 | 2 | 3];
  const date = slot % 2 === 0 ? "12th" : "27th";
  return `${date} ${month}`;
}

function lp008Table(caselet: Lp008Caselet, states: readonly CalendarAssignment[]): string {
  const rows = caselet.people.map((person) => {
    const slots = caselet.slots.filter((slot) => states.some((state) => state[person] === slot));
    return [caselet.labels.people[person], slots.map((slot) => lp008SlotLabel(caselet, slot)).join(", ")];
  });
  return markdownTable(["Person", "Possible date/month slot(s)"], rows);
}

function retrofitLp008(caselet: Lp008Caselet): Lp008Caselet {
  const shared: string[] = [];
  for (let index = 0; index < caselet.clues.length; index += 1) {
    const clue = caselet.clues[index]!;
    const states = solveLp008({ clues: caselet.clues.slice(0, index + 1) });
    shared.push(step(index + 1, clue.text, "Use the clue to narrow the possible date and month for each person.", lp008Table(caselet, states)));
  }
  shared.push(finish(caselet.clues.length + 1, lp008Table(caselet, [caselet.assignment])));
  return { ...caselet, children: explanationForChildren(caselet.children, shared) };
}

export function generateLp001BatchRetrofitV1(seed = "lp-001-retrofit-v1", count = 8): Caselet[] {
  return generateCaseletBatch(seed, count).map(retrofitLp001);
}
export function generateLp002BatchRetrofitV1(seed = "lp-002-retrofit-v1", count = 8): Lp002Caselet[] {
  return generateLp002Batch(seed, count).map(retrofitLp002);
}
export function generateLp003BatchRetrofitV1(seed = "lp-003-retrofit-v1", count = 8): Lp003Caselet[] {
  return generateLp003Batch(seed, count).map(retrofitLp003);
}
export function generateLp004BatchRetrofitV1(seed = "lp-004-retrofit-v1", count = 8): Lp004Caselet[] {
  return generateLp004Batch(seed, count).map(retrofitLp004);
}
export function generateLp005BatchRetrofitV1(seed = "lp-005-retrofit-v1", count = 8): Lp005Caselet[] {
  return generateLp005Batch(seed, count).map(retrofitLp005);
}
export function generateLp006BatchRetrofitV1(seed = "lp-006-retrofit-v1", count = 8): Lp006Caselet[] {
  return generateLp006Batch(seed, count).map(retrofitLp006);
}
export function generateLp007BatchRetrofitV1(seed = "lp-007-retrofit-v1", count = 8): Lp007Caselet[] {
  return generateLp007Batch(seed, count).map(retrofitLp007);
}
export function generateLp008BatchRetrofitV1(seed = "lp-008-retrofit-v1", count = 8): Lp008Caselet[] {
  return generateLp008Batch(seed, count).map(retrofitLp008);
}
