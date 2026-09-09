import type { DifficultyBand } from "./index.ts";

export type SchedulePerson = "A" | "B" | "C" | "D" | "E" | "F";
export type ScheduleValue = 0 | 1 | 2 | 3 | 4 | 5;
export type ScheduleMode = "MONTH" | "YEAR";
export type ScheduleAssignment = Record<SchedulePerson, ScheduleValue>;

export type ScheduleClue =
  | { kind: "PERSON_VALUE"; person: SchedulePerson; value: ScheduleValue; text: string }
  | { kind: "BEFORE"; left: SchedulePerson; right: SchedulePerson; text: string }
  | { kind: "BETWEEN"; left: SchedulePerson; right: SchedulePerson; count: number; text: string }
  | { kind: "ADJACENT"; left: SchedulePerson; right: SchedulePerson; text: string }
  | { kind: "NOT_VALUE"; person: SchedulePerson; value: ScheduleValue; text: string }
  | { kind: "POSITION"; person: SchedulePerson; value: ScheduleValue; text: string };

export type Lp009Profile = {
  id: string;
  mode: ScheduleMode;
  scenario: string;
  personNoun: string;
  recordNoun: string;
  valueHeader: string;
  setupTemplate: string;
  values: Record<ScheduleValue, string>;
  people: Record<SchedulePerson, string>;
  personQuestionTemplate: string;
  valueQuestionTemplate: string;
  pairQuestionTemplate: string;
  orderQuestionTemplate: string;
  directTemplates: readonly string[];
  beforeTemplates: readonly string[];
  betweenTemplates: readonly string[];
  adjacentTemplates: readonly string[];
  notTemplates: readonly string[];
  positionTemplates: readonly string[];
};

export type Lp009Child = {
  questionId: string;
  qlId: "LP-QL-033" | "LP-QL-034" | "LP-QL-035" | "LP-QL-036";
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  difficultyBand: DifficultyBand;
  misconceptionFamily: string;
  explanation: { summary: string; lines: string[] };
};

export type Lp009Caselet = {
  caseletId: string;
  scenario: string;
  questionSetup: string;
  scenarioProfileId: string;
  mode: ScheduleMode;
  difficultyBand: DifficultyBand;
  people: readonly SchedulePerson[];
  values: readonly ScheduleValue[];
  labels: Lp009Profile;
  clues: readonly ScheduleClue[];
  assignment: ScheduleAssignment;
  children: readonly Lp009Child[];
};

export const LP_009_REVIEW_PACKAGE = Object.freeze({
  packageId: "LP-009",
  checkpointId: "LP-CP-009",
  label: "Logic Puzzles — Month- and Year-Based Scheduling",
  qlIds: ["LP-QL-033", "LP-QL-034", "LP-QL-035", "LP-QL-036"] as const,
  supportedDifficulties: ["Easy", "Medium", "Hard"] as const,
  supportedLanguages: ["en"] as const,
  runtimeMode: "REVIEW_ONLY" as const,
  reviewOnly: true as const,
});

const PEOPLE: readonly SchedulePerson[] = ["A", "B", "C", "D", "E", "F"];
const VALUES: readonly ScheduleValue[] = [0, 1, 2, 3, 4, 5];

type MonthOption = { name: string; order: number };

type ProfileTemplate = {
  id: string;
  mode: ScheduleMode;
  scenario: string;
  personNoun: string;
  recordNoun: string;
  valueHeader: string;
  setupTemplate: string;
  monthPool?: readonly MonthOption[];
  yearPool?: readonly number[];
  personQuestionTemplate: string;
  valueQuestionTemplate: string;
  pairQuestionTemplate: string;
  orderQuestionTemplate: string;
  directTemplates: readonly string[];
  beforeTemplates: readonly string[];
  betweenTemplates: readonly string[];
  adjacentTemplates: readonly string[];
  notTemplates: readonly string[];
  positionTemplates: readonly string[];
  peoplePool: readonly string[];
};

const MONTH_DIRECT = [
  "{person}'s {recordNoun} is {value}.",
  "The {recordNoun} of {person} is {value}.",
];
const MONTH_BEFORE = [
  "{left}'s {recordNoun} is earlier than {right}'s.",
  "The {recordNoun} of {left} is before that of {right}.",
];
const MONTH_BETWEEN = [
  "Exactly {countText} {personCountNoun} have their {recordNoun}s between those of {left} and {right}.",
  "There are exactly {countText} {recordNoun}s between the {recordNoun}s of {left} and {right}.",
];
const MONTH_ADJACENT = [
  "The {recordNoun} entries of {left} and {right} occupy consecutive positions in the listed month order.",
  "{left}'s and {right}'s {recordNoun} entries are consecutive in the listed order, in either order.",
];
const MONTH_NOT = [
  "{person}'s {recordNoun} is not {value}.",
  "The {recordNoun} of {person} is not {value}.",
];
const YEAR_DIRECT = [
  "{person} was born in {value}.",
  "The birth year of {person} was {value}.",
];
const YEAR_BEFORE = [
  "{left} is older than {right}.",
  "{left} was born earlier than {right}.",
];
const YEAR_BETWEEN = [
  "Exactly {countText} {personPlural} were born between {left} and {right}.",
  "There are exactly {countText} {personPlural} born between {left} and {right}.",
];
const YEAR_ADJACENT = [
  "{left} and {right} were born in consecutive years in the given list, in either order.",
  "The birth years of {left} and {right} occupy consecutive positions in the given list, in either order.",
];
const YEAR_NOT = [
  "{person} was not born in {value}.",
  "The birth year of {person} was not {value}.",
];
const YEAR_POSITION = [
  "{person} was the second oldest of the six {personPlural}.",
  "Of the six {personPlural}, {person} was born in the second earliest year.",
];

const PROFILES: readonly ProfileTemplate[] = [
  {
    id: "BIRTH_MONTH_REGISTER",
    mode: "MONTH",
    scenario: "A school is recording the birth months of six students.",
    personNoun: "student",
    recordNoun: "birth month",
    valueHeader: "Birth month",
    setupTemplate: "The students—{people}—were each born in a different one of the following six months of the same year: {values}. Each month is used once, and the months are listed in calendar order.",
    monthPool: [
      { name: "January", order: 1 }, { name: "March", order: 3 }, { name: "April", order: 4 }, { name: "May", order: 5 },
      { name: "July", order: 7 }, { name: "September", order: 9 }, { name: "October", order: 10 }, { name: "December", order: 12 },
    ],
    personQuestionTemplate: "In which month was {person} born?",
    valueQuestionTemplate: "Who was born in {value}?",
    pairQuestionTemplate: "Which of the following correctly gives the birth months of {left} and {right}, respectively?",
    orderQuestionTemplate: "Who was born in the next month in the listed order after {person}?",
    directTemplates: MONTH_DIRECT,
    beforeTemplates: MONTH_BEFORE,
    betweenTemplates: MONTH_BETWEEN,
    adjacentTemplates: MONTH_ADJACENT,
    notTemplates: MONTH_NOT,
    positionTemplates: [],
    peoplePool: ["Aarav", "Bhavna", "Chetan", "Diya", "Eshan", "Kavya", "Manav", "Neha", "Ritu", "Varun", "Ishita", "Mohan", "Naina", "Parth", "Sonal", "Tanya"],
  },
  {
    id: "INTERVIEW_MONTH_REGISTER",
    mode: "MONTH",
    scenario: "A recruitment board is recording the interview months of six applicants.",
    personNoun: "applicant",
    recordNoun: "interview month",
    valueHeader: "Interview month",
    setupTemplate: "The applicants—{people}—were each given one interview in a different one of the following six months: {values}. Each month is used once, and the months are listed in calendar order.",
    monthPool: [
      { name: "February", order: 2 }, { name: "April", order: 4 }, { name: "June", order: 6 }, { name: "August", order: 8 },
      { name: "September", order: 9 }, { name: "November", order: 11 }, { name: "March", order: 3 }, { name: "December", order: 12 },
    ],
    personQuestionTemplate: "In which month was {person}'s interview held?",
    valueQuestionTemplate: "Whose interview was held in {value}?",
    pairQuestionTemplate: "Which of the following correctly gives the interview months of {left} and {right}, respectively?",
    orderQuestionTemplate: "Whose interview was held in the next month in the listed order after {person}'s interview?",
    directTemplates: MONTH_DIRECT,
    beforeTemplates: MONTH_BEFORE,
    betweenTemplates: MONTH_BETWEEN,
    adjacentTemplates: MONTH_ADJACENT,
    notTemplates: MONTH_NOT,
    positionTemplates: [],
    peoplePool: ["Aditi", "Bharat", "Charu", "Dev", "Farah", "Gaurav", "Meena", "Pooja", "Rakesh", "Sneha", "Tanvi", "Yash", "Ira", "Jatin", "Mira", "Nakul"],
  },
  {
    id: "COURSE_START_MONTHS",
    mode: "MONTH",
    scenario: "An institute is recording the starting months of six courses.",
    personNoun: "course",
    recordNoun: "starting month",
    valueHeader: "Starting month",
    setupTemplate: "The courses—{people}—each started in a different one of the following six months: {values}. Each month is used once, and the months are listed in calendar order.",
    monthPool: [
      { name: "January", order: 1 }, { name: "February", order: 2 }, { name: "April", order: 4 }, { name: "June", order: 6 },
      { name: "August", order: 8 }, { name: "October", order: 10 }, { name: "May", order: 5 }, { name: "November", order: 11 },
    ],
    personQuestionTemplate: "In which month did {person} start?",
    valueQuestionTemplate: "Which course started in {value}?",
    pairQuestionTemplate: "Which of the following correctly gives the starting months of {left} and {right}, respectively?",
    orderQuestionTemplate: "Which course started in the next month in the listed order after {person}?",
    directTemplates: MONTH_DIRECT,
    beforeTemplates: MONTH_BEFORE,
    betweenTemplates: MONTH_BETWEEN,
    adjacentTemplates: MONTH_ADJACENT,
    notTemplates: MONTH_NOT,
    positionTemplates: [],
    peoplePool: ["Alok", "Beena", "Dinesh", "Farah", "Gopal", "Harini", "Irfan", "Juhi", "Kartik", "Leela", "Nitin", "Rupa", "Samar", "Tara", "Vivek", "Zubin"],
  },
  {
    id: "REVIEW_MEETING_MONTHS",
    mode: "MONTH",
    scenario: "A bank is recording the months in which six officers attended review meetings.",
    personNoun: "officer",
    recordNoun: "review-meeting month",
    valueHeader: "Review-meeting month",
    setupTemplate: "The officers—{people}—attended their review meetings in six different months: {values}. Each month is used once, and the months are listed in calendar order.",
    monthPool: [
      { name: "January", order: 1 }, { name: "March", order: 3 }, { name: "May", order: 5 }, { name: "July", order: 7 },
      { name: "September", order: 9 }, { name: "November", order: 11 }, { name: "February", order: 2 }, { name: "October", order: 10 },
    ],
    personQuestionTemplate: "In which month did {person} attend the review meeting?",
    valueQuestionTemplate: "Who attended a review meeting in {value}?",
    pairQuestionTemplate: "Which of the following correctly gives the review-meeting months of {left} and {right}, respectively?",
    orderQuestionTemplate: "Who attended a review meeting in the next month in the listed order after {person}?",
    directTemplates: MONTH_DIRECT,
    beforeTemplates: MONTH_BEFORE,
    betweenTemplates: MONTH_BETWEEN,
    adjacentTemplates: MONTH_ADJACENT,
    notTemplates: MONTH_NOT,
    positionTemplates: [],
    peoplePool: ["Kamal", "Lata", "Mohit", "Nisha", "Omkar", "Priya", "Rahul", "Simran", "Tarun", "Zoya", "Arjun", "Leela", "Madhav", "Poonam", "Ravi", "Seema"],
  },
  {
    id: "BIRTH_YEAR_REGISTER",
    mode: "YEAR",
    scenario: "A family record lists the birth years of six persons.",
    personNoun: "person",
    recordNoun: "birth year",
    valueHeader: "Birth year",
    setupTemplate: "The six persons—{people}—were all born on 15 June, but in six different years: {values}. The years are listed from earliest to latest. For this puzzle, the earliest year represents the oldest person and the latest year represents the youngest; no age calculation is required.",
    yearPool: [1984, 1988, 1992, 1997, 2001, 2005, 2010, 2012, 2015, 2018, 2020, 2022],
    personQuestionTemplate: "In which year was {person} born?",
    valueQuestionTemplate: "Who was born in {value}?",
    pairQuestionTemplate: "Which of the following correctly gives the birth years of {left} and {right}, respectively?",
    orderQuestionTemplate: "Who was the second oldest?",
    directTemplates: YEAR_DIRECT,
    beforeTemplates: YEAR_BEFORE,
    betweenTemplates: YEAR_BETWEEN,
    adjacentTemplates: YEAR_ADJACENT,
    notTemplates: YEAR_NOT,
    positionTemplates: YEAR_POSITION,
    peoplePool: ["Aarav", "Bhavna", "Chetan", "Diya", "Eshan", "Kavya", "Manav", "Neha", "Ritu", "Varun", "Ishita", "Mohan", "Naina", "Parth", "Sonal", "Tanya"],
  },
  {
    id: "SERVICE_BIRTH_YEARS",
    mode: "YEAR",
    scenario: "A service register lists the birth years of six officers.",
    personNoun: "officer",
    recordNoun: "birth year",
    valueHeader: "Birth year",
    setupTemplate: "The officers—{people}—were all born on 12 March, but in six different years: {values}. The years are listed from earliest to latest. For this puzzle, the earliest year represents the oldest officer and the latest year represents the youngest; no age calculation is required.",
    yearPool: [1978, 1983, 1987, 1991, 1996, 2000, 2004, 2008, 2011, 2014, 2017, 2021],
    personQuestionTemplate: "In which year was {person} born?",
    valueQuestionTemplate: "Who was born in {value}?",
    pairQuestionTemplate: "Which of the following correctly gives the birth years of {left} and {right}, respectively?",
    orderQuestionTemplate: "Who was the second oldest?",
    directTemplates: YEAR_DIRECT,
    beforeTemplates: YEAR_BEFORE,
    betweenTemplates: YEAR_BETWEEN,
    adjacentTemplates: YEAR_ADJACENT,
    notTemplates: YEAR_NOT,
    positionTemplates: YEAR_POSITION,
    peoplePool: ["Aditi", "Bharat", "Charu", "Dev", "Farah", "Gaurav", "Meena", "Pooja", "Rakesh", "Sneha", "Tanvi", "Yash", "Ira", "Jatin", "Mira", "Nakul"],
  },
  {
    id: "ARCHIVE_BIRTH_YEARS",
    mode: "YEAR",
    scenario: "An archive lists the birth years of six researchers.",
    personNoun: "researcher",
    recordNoun: "birth year",
    valueHeader: "Birth year",
    setupTemplate: "The researchers—{people}—were all born on 21 September, but in six different years: {values}. The years are listed from earliest to latest. For this puzzle, the earliest year represents the oldest researcher and the latest year represents the youngest; no age calculation is required.",
    yearPool: [1969, 1975, 1981, 1987, 1990, 1994, 1999, 2003, 2007, 2010, 2013, 2016],
    personQuestionTemplate: "In which year was {person} born?",
    valueQuestionTemplate: "Who was born in {value}?",
    pairQuestionTemplate: "Which of the following correctly gives the birth years of {left} and {right}, respectively?",
    orderQuestionTemplate: "Who was the second oldest?",
    directTemplates: YEAR_DIRECT,
    beforeTemplates: YEAR_BEFORE,
    betweenTemplates: YEAR_BETWEEN,
    adjacentTemplates: YEAR_ADJACENT,
    notTemplates: YEAR_NOT,
    positionTemplates: YEAR_POSITION,
    peoplePool: ["Alok", "Beena", "Dinesh", "Farah", "Gopal", "Harini", "Irfan", "Juhi", "Kartik", "Leela", "Nitin", "Rupa", "Samar", "Tara", "Vivek", "Zubin"],
  },
  {
    id: "CLUB_BIRTH_YEARS",
    mode: "YEAR",
    scenario: "A club register lists the birth years of six members.",
    personNoun: "member",
    recordNoun: "birth year",
    valueHeader: "Birth year",
    setupTemplate: "The members—{people}—were all born on 8 December, but in six different years: {values}. The years are listed from earliest to latest. For this puzzle, the earliest year represents the oldest member and the latest year represents the youngest; no age calculation is required.",
    yearPool: [1972, 1977, 1982, 1986, 1990, 1995, 1999, 2002, 2006, 2009, 2013, 2018],
    personQuestionTemplate: "In which year was {person} born?",
    valueQuestionTemplate: "Who was born in {value}?",
    pairQuestionTemplate: "Which of the following correctly gives the birth years of {left} and {right}, respectively?",
    orderQuestionTemplate: "Who was the second oldest?",
    directTemplates: YEAR_DIRECT,
    beforeTemplates: YEAR_BEFORE,
    betweenTemplates: YEAR_BETWEEN,
    adjacentTemplates: YEAR_ADJACENT,
    notTemplates: YEAR_NOT,
    positionTemplates: YEAR_POSITION,
    peoplePool: ["Kamal", "Lata", "Mohit", "Nisha", "Omkar", "Priya", "Rahul", "Simran", "Tarun", "Zoya", "Arjun", "Leela", "Madhav", "Poonam", "Ravi", "Seema"],
  },
];

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function rng(seed: string) {
  let state = hashSeed(seed) || 1;
  return () => {
    state = Math.imul(state ^ (state >>> 15), 2246822519) >>> 0;
    state = Math.imul(state ^ (state >>> 13), 3266489917) >>> 0;
    return ((state ^ (state >>> 16)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap]!, result[index]!];
  }
  return result;
}

function permutations<T>(items: readonly T[]): T[][] {
  if (items.length <= 1) return [Array.from(items)];
  const result: T[][] = [];
  items.forEach((item, index) => {
    const rest = [...items.slice(0, index), ...items.slice(index + 1)];
    for (const tail of permutations(rest)) result.push([item, ...tail]);
  });
  return result;
}

function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? key);
}

function pick<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)]!;
}

function examList(values: readonly string[]): string {
  return values.length <= 1 ? values.join("") : `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
}

function materializeProfile(template: ProfileTemplate, random: () => number): Lp009Profile {
  const people = shuffle(template.peoplePool, random).slice(0, 6);
  const values = template.mode === "MONTH"
    ? shuffle(template.monthPool!, random).slice(0, 6).sort((left, right) => left.order - right.order).map((month) => month.name)
    : shuffle(template.yearPool!, random).slice(0, 6).sort((left, right) => left - right).map(String);
  return {
    id: template.id,
    mode: template.mode,
    scenario: template.scenario,
    personNoun: template.personNoun,
    recordNoun: template.recordNoun,
    valueHeader: template.valueHeader,
    setupTemplate: template.setupTemplate,
    values: { 0: values[0]!, 1: values[1]!, 2: values[2]!, 3: values[3]!, 4: values[4]!, 5: values[5]! },
    people: { A: people[0]!, B: people[1]!, C: people[2]!, D: people[3]!, E: people[4]!, F: people[5]! },
    personQuestionTemplate: template.personQuestionTemplate,
    valueQuestionTemplate: template.valueQuestionTemplate,
    pairQuestionTemplate: template.pairQuestionTemplate,
    orderQuestionTemplate: template.orderQuestionTemplate,
    directTemplates: template.directTemplates,
    beforeTemplates: template.beforeTemplates,
    betweenTemplates: template.betweenTemplates,
    adjacentTemplates: template.adjacentTemplates,
    notTemplates: template.notTemplates,
    positionTemplates: template.positionTemplates,
  };
}

function buildQuestionSetup(profile: Lp009Profile): string {
  const people = examList(PEOPLE.map((person) => profile.people[person]));
  const values = examList(VALUES.map((value) => profile.values[value]));
  return `${profile.scenario} ${fill(profile.setupTemplate, { people, values })}`;
}

const ALL_ASSIGNMENTS: readonly ScheduleAssignment[] = permutations(VALUES).map((order) => ({ A: order[0]!, B: order[1]!, C: order[2]!, D: order[3]!, E: order[4]!, F: order[5]! }));

function satisfies(assignment: ScheduleAssignment, clue: ScheduleClue): boolean {
  if (clue.kind === "PERSON_VALUE") return assignment[clue.person] === clue.value;
  if (clue.kind === "BEFORE") return assignment[clue.left] < assignment[clue.right];
  if (clue.kind === "BETWEEN") return Math.abs(assignment[clue.left] - assignment[clue.right]) - 1 === clue.count;
  if (clue.kind === "ADJACENT") return Math.abs(assignment[clue.left] - assignment[clue.right]) === 1;
  if (clue.kind === "NOT_VALUE") return assignment[clue.person] !== clue.value;
  return assignment[clue.person] === clue.value;
}

export function solveLp009(input: { clues: readonly ScheduleClue[] }): ScheduleAssignment[] {
  return ALL_ASSIGNMENTS.filter((assignment) => input.clues.every((clue) => satisfies(assignment, clue)));
}

function clueKey(clue: ScheduleClue): string {
  if (clue.kind === "PERSON_VALUE" || clue.kind === "NOT_VALUE" || clue.kind === "POSITION") return `${clue.kind}:${clue.person}:${clue.value}`;
  if (clue.kind === "BETWEEN") return `${clue.kind}:${[clue.left, clue.right].sort().join(":")}:${clue.count}`;
  return `${clue.kind}:${clue.left}:${clue.right}`;
}

function essential(clues: readonly ScheduleClue[]): boolean {
  return clues.every((_, removed) => solveLp009({ clues: clues.filter((__, index) => index !== removed) }).length > 1);
}

function minimizeUnique(clues: readonly ScheduleClue[]): ScheduleClue[] {
  const result = [...clues];
  let changed = true;
  while (changed) {
    changed = false;
    for (let index = 0; index < result.length; index += 1) {
      const reduced = result.filter((_, candidateIndex) => candidateIndex !== index);
      if (solveLp009({ clues: reduced }).length === 1) {
        result.splice(index, 1);
        changed = true;
        break;
      }
    }
  }
  return result;
}

function directClue(person: SchedulePerson, assignment: ScheduleAssignment, profile: Lp009Profile, random: () => number): ScheduleClue {
  const value = assignment[person];
  return { kind: "PERSON_VALUE", person, value, text: fill(pick(profile.directTemplates, random), { person: profile.people[person], value: profile.values[value], recordNoun: profile.recordNoun }) };
}

function buildCandidates(assignment: ScheduleAssignment, profile: Lp009Profile, random: () => number): ScheduleClue[] {
  const candidates: ScheduleClue[] = [];
  for (const person of PEOPLE) {
    candidates.push(directClue(person, assignment, profile, random));
    for (const value of VALUES) {
      if (value === assignment[person]) continue;
      candidates.push({ kind: "NOT_VALUE", person, value, text: fill(pick(profile.notTemplates, random), { person: profile.people[person], value: profile.values[value], recordNoun: profile.recordNoun }) });
    }
    if (profile.mode === "YEAR") {
      candidates.push({ kind: "POSITION", person, value: 1, text: fill(pick(profile.positionTemplates, random), { person: profile.people[person], personPlural: `${profile.personNoun}s` }) });
    }
  }
  for (let leftIndex = 0; leftIndex < PEOPLE.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < PEOPLE.length; rightIndex += 1) {
      const left = PEOPLE[leftIndex]!;
      const right = PEOPLE[rightIndex]!;
      const first = assignment[left] < assignment[right] ? left : right;
      const second = first === left ? right : left;
      candidates.push({ kind: "BEFORE", left: first, right: second, text: fill(pick(profile.beforeTemplates, random), { left: profile.people[first], right: profile.people[second], recordNoun: profile.recordNoun }) });
      const count = Math.abs(assignment[left] - assignment[right]) - 1;
      if (count >= 1) candidates.push({ kind: "BETWEEN", left, right, count, text: fill(pick(profile.betweenTemplates, random), { left: profile.people[left], right: profile.people[right], count: String(count), countText: count === 1 ? "one" : String(count), personCountNoun: count === 1 ? profile.personNoun : `${profile.personNoun}s`, personPlural: `${profile.personNoun}s`, personNoun: profile.personNoun, recordNoun: profile.recordNoun }) });
      if (Math.abs(assignment[left] - assignment[right]) === 1) candidates.push({ kind: "ADJACENT", left, right, text: fill(pick(profile.adjacentTemplates, random), { left: profile.people[left], right: profile.people[right], recordNoun: profile.recordNoun }) });
    }
  }
  return shuffle(candidates, random);
}

function chooseClues(assignment: ScheduleAssignment, profile: Lp009Profile, difficultyBand: DifficultyBand, random: () => number): ScheduleClue[] {
  if (difficultyBand === "Easy") {
    return shuffle(PEOPLE, random).slice(0, 5).map((person) => directClue(person, assignment, profile, random));
  }

  const candidates = buildCandidates(assignment, profile, random);
  const quotaSets: Array<{ required: readonly ScheduleClue["kind"][]; target: number }> = difficultyBand === "Medium"
    ? [
        { required: ["PERSON_VALUE", "BEFORE", "NOT_VALUE"], target: 6 },
        { required: ["PERSON_VALUE", "BETWEEN", "NOT_VALUE"], target: 6 },
        { required: ["PERSON_VALUE", "ADJACENT", "NOT_VALUE"], target: 6 },
      ]
    : profile.mode === "YEAR"
      ? [
          { required: ["PERSON_VALUE", "BETWEEN", "ADJACENT", "NOT_VALUE", "POSITION"], target: 8 },
          { required: ["PERSON_VALUE", "ADJACENT", "POSITION", "NOT_VALUE", "BETWEEN"], target: 8 },
        ]
      : [
          { required: ["PERSON_VALUE", "BETWEEN", "ADJACENT", "NOT_VALUE"], target: 8 },
          { required: ["PERSON_VALUE", "ADJACENT", "BETWEEN", "NOT_VALUE"], target: 8 },
        ];

  const search = (randomSource: () => number, attempts: number): ScheduleClue[] | undefined => {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const quota = quotaSets[attempt % quotaSets.length]!;
      let survivors = [...ALL_ASSIGNMENTS];
      const chosen: ScheduleClue[] = [];
      for (const kind of quota.required) {
        const possible = candidates
          .filter((candidate) => candidate.kind === kind && !chosen.some((clue) => clueKey(clue) === clueKey(candidate)))
          .map((candidate) => ({ candidate, remaining: survivors.filter((state) => satisfies(state, candidate)).length }))
          .filter((entry) => entry.remaining > 0 && entry.remaining < survivors.length)
          .sort((left, right) => left.remaining - right.remaining);
        const selected = possible.length ? possible[Math.floor(randomSource() * Math.min(possible.length, difficultyBand === "Hard" ? 8 : 4))]!.candidate : undefined;
        if (!selected) {
          chosen.length = 0;
          break;
        }
        chosen.push(selected);
        survivors = survivors.filter((state) => satisfies(state, selected));
      }
      while (chosen.length >= quota.required.length && chosen.length < quota.target && survivors.length > 1) {
        const possible = candidates
          .filter((candidate) => !chosen.some((clue) => clueKey(clue) === clueKey(candidate)))
          .map((candidate) => ({ candidate, remaining: survivors.filter((state) => satisfies(state, candidate)).length }))
          .filter((entry) => entry.remaining > 0 && entry.remaining < survivors.length)
          .sort((left, right) => left.remaining - right.remaining);
        const selected = possible.length ? possible[Math.floor(randomSource() * Math.min(possible.length, difficultyBand === "Hard" ? 10 : 4))]!.candidate : undefined;
        if (!selected) break;
        chosen.push(selected);
        survivors = survivors.filter((state) => satisfies(state, selected));
      }
      if (survivors.length !== 1 || survivors[0]!["A"] !== assignment.A || survivors[0]!["B"] !== assignment.B || survivors[0]!["C"] !== assignment.C || survivors[0]!["D"] !== assignment.D || survivors[0]!["E"] !== assignment.E || survivors[0]!["F"] !== assignment.F) continue;
      const reduced = minimizeUnique(chosen);
      const reducedSolution = solveLp009({ clues: reduced })[0];
      if (!reducedSolution || PEOPLE.some((person) => reducedSolution[person] !== assignment[person])) continue;
      if (!quota.required.every((kind) => reduced.some((clue) => clue.kind === kind))) continue;
      if (!essential(reduced)) continue;
      const directCount = reduced.filter((clue) => clue.kind === "PERSON_VALUE").length;
      if (difficultyBand === "Medium" && directCount < 1) continue;
      if (difficultyBand === "Hard" && (directCount > 3 || reduced.length < 6)) continue;
      return reduced;
    }
    return undefined;
  };

  const result = search(random, 1200) ?? search(rng(`LP-009-search:${profile.id}:${Object.values(assignment).join(":")}:${difficultyBand}`), 6000);
  if (!result) throw new Error(`Unable to build an essential unique LP-009 schedule puzzle (${profile.id}, ${difficultyBand}).`);
  return result;
}

type PartialTable = {
  values: Partial<Record<SchedulePerson, ScheduleValue>>;
  candidates: Partial<Record<SchedulePerson, readonly ScheduleValue[]>>;
};

function emptyTable(): PartialTable { return { values: {}, candidates: {} }; }
function copyTable(table: PartialTable): PartialTable { return { values: { ...table.values }, candidates: { ...table.candidates } }; }

function tableMarkdown(people: readonly SchedulePerson[], profile: Lp009Profile, table: PartialTable): string {
  const rows = people.map((person) => {
    const value = table.values[person];
    const candidates = table.candidates[person];
    const valueText = value !== undefined ? profile.values[value] : candidates ? candidates.map((candidate) => profile.values[candidate]).join(" / ") : "—";
    return `| ${profile.people[person]} | ${valueText} |`;
  }).join("\n");
  return `| ${profile.personNoun[0]!.toUpperCase()}${profile.personNoun.slice(1)} | ${profile.valueHeader} |\n|---|---|\n${rows}`;
}

function directTable(clues: readonly ScheduleClue[]): PartialTable {
  const table = emptyTable();
  for (const clue of clues) if (clue.kind === "PERSON_VALUE") table.values[clue.person] = clue.value;
  return table;
}

function forcedTable(profile: Lp009Profile, solutions: readonly ScheduleAssignment[], direct: PartialTable): PartialTable {
  const table = copyTable(direct);
  for (const person of PEOPLE) {
    if (table.values[person] !== undefined) continue;
    const possible = [...new Set(solutions.map((solution) => solution[person]))] as ScheduleValue[];
    if (possible.length === 1) table.values[person] = possible[0]!;
    else table.candidates[person] = possible.sort((left, right) => left - right);
  }
  return table;
}

function explanationLine(profile: Lp009Profile, clue: ScheduleClue, before: number, after: number): string {
  const effect = after < before
    ? `This reduces the remaining possibilities from ${before} to ${after}.`
    : "This clue is consistent with the entries already made, so the table is carried forward.";
  if (clue.kind === "BEFORE") return `The clue says that ${profile.people[clue.left]} comes before ${profile.people[clue.right]}. Keep only schedules with that order. ${effect}`;
  if (clue.kind === "BETWEEN") return `The clue places exactly ${clue.count === 1 ? "one" : clue.count} ${profile.personNoun}${clue.count === 1 ? "" : "s"} between ${profile.people[clue.left]} and ${profile.people[clue.right]}. ${effect}`;
  if (clue.kind === "ADJACENT") return `The two entries for ${profile.people[clue.left]} and ${profile.people[clue.right]} must be consecutive in the listed order. ${effect}`;
  if (clue.kind === "NOT_VALUE") return `Remove ${profile.values[clue.value]} from ${profile.people[clue.person]}'s row. ${effect}`;
  if (clue.kind === "POSITION") return `${profile.people[clue.person]} is fixed in the second-oldest position, which is the second year in the ordered list. ${effect}`;
  return `Record the direct entry for ${profile.people[clue.person]}. ${effect}`;
}

function buildExplanation(profile: Lp009Profile, assignment: ScheduleAssignment, difficultyBand: DifficultyBand, clues: readonly ScheduleClue[], finalDetail: string): { summary: string; lines: string[] } {
  const direct = directTable(clues);
  const lines: string[] = [];
  const add = (title: string, detail: string, table: PartialTable) => lines.push(`**${title}**\n\n${detail}\n\n${tableMarkdown(PEOPLE, profile, table)}`);
  const directClues = clues.filter((clue) => clue.kind === "PERSON_VALUE");
  add("Step 1: Record the direct entries", directClues.length ? "Enter every month or year stated directly in the clues. Leave the other rows open." : "No month or year is stated directly, so begin with the order and exclusion clues.", direct);

  let active: ScheduleClue[] = [...directClues];
  let solutions = solveLp009({ clues: active });
  let step = 2;
  for (const clue of clues.filter((candidate) => candidate.kind !== "PERSON_VALUE")) {
    const before = solutions.length;
    active = [...active, clue];
    solutions = solveLp009({ clues: active });
    add(`Step ${step}: Apply the next clue`, explanationLine(profile, clue, before, solutions.length), forcedTable(profile, solutions, direct));
    step += 1;
  }
  const completed = forcedTable(profile, solveLp009({ clues }), direct);
  const finalText = finalDetail.endsWith(".") ? finalDetail : `${finalDetail}.`;
  add(`Step ${step}: Complete the schedule`, `All the clues leave one schedule. Fill the remaining rows using the one-to-one rule. ${finalText}`, completed);
  return { summary: `The clues determine one complete ${profile.recordNoun} schedule.`, lines };
}

function placeAnswer(options: readonly string[], answer: string, targetIndex: number): { options: string[]; correctIndex: number } {
  const distractors = options.filter((option) => option !== answer);
  const index = Math.max(0, Math.min(targetIndex, distractors.length));
  const placed = [...distractors];
  placed.splice(index, 0, answer);
  return { options: placed, correctIndex: index };
}

function answerOptions(answer: string, pool: readonly string[], random: () => number, targetIndex: number): { options: string[]; correctIndex: number } {
  const distractors = shuffle(pool.filter((value) => value !== answer), random).slice(0, 3);
  return placeAnswer(distractors, answer, targetIndex);
}

function pairText(profile: Lp009Profile, left: SchedulePerson, right: SchedulePerson, leftValue: ScheduleValue, rightValue: ScheduleValue): string {
  return `${profile.people[left]} — ${profile.values[leftValue]}; ${profile.people[right]} — ${profile.values[rightValue]}`;
}

function pairOptions(profile: Lp009Profile, left: SchedulePerson, right: SchedulePerson, assignment: ScheduleAssignment, random: () => number, targetIndex: number): { options: string[]; correctIndex: number } {
  const correct = pairText(profile, left, right, assignment[left], assignment[right]);
  const alternatives: string[] = [];
  for (const leftValue of shuffle(VALUES, random)) {
    for (const rightValue of shuffle(VALUES, random)) {
      if (leftValue === rightValue) continue;
      const option = pairText(profile, left, right, leftValue, rightValue);
      if (option === correct || alternatives.includes(option)) continue;
      alternatives.push(option);
      if (alternatives.length === 3) break;
    }
    if (alternatives.length === 3) break;
  }
  return placeAnswer(alternatives, correct, targetIndex);
}

function qlStem(profile: Lp009Profile, setup: string, clues: readonly ScheduleClue[], question: string): string {
  return `${setup}\n\nClues:\n${clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n${question}`;
}

function buildChildren(caseletId: string, profile: Lp009Profile, setup: string, clues: readonly ScheduleClue[], assignment: ScheduleAssignment, difficultyBand: DifficultyBand, random: () => number): Lp009Child[] {
  const balanceOffset = Math.max(0, Number(caseletId.slice(-3)) - 1);
  const directPeople = new Set(clues.filter((clue): clue is Extract<ScheduleClue, { kind: "PERSON_VALUE" }> => clue.kind === "PERSON_VALUE").map((clue) => clue.person));
  const openPeople = PEOPLE.filter((person) => !directPeople.has(person));
  const valueTarget = assignment[openPeople[0] ?? PEOPLE[0]!];
  const personTarget = openPeople[0] ?? PEOPLE[0]!;
  const pairLeft = openPeople[0] ?? PEOPLE[0]!;
  const pairRight = PEOPLE.find((person) => person !== pairLeft) ?? PEOPLE[1]!;
  const orderCandidates = profile.mode === "YEAR"
    ? PEOPLE.filter((person) => assignment[person] === 1)
    : PEOPLE.filter((person) => assignment[person] < 5);
  const orderAnswerPerson = orderCandidates[0]!;
  const orderTarget = profile.mode === "YEAR" ? orderAnswerPerson : (PEOPLE.find((person) => assignment[person] + 1 === assignment[orderAnswerPerson]) ?? orderAnswerPerson);
  const pair = pairOptions(profile, pairLeft, pairRight, assignment, random, (balanceOffset + 2) % 4);
  const valueAnswer = profile.people[PEOPLE.find((person) => assignment[person] === valueTarget)!];
  const valueQuestion = fill(profile.valueQuestionTemplate, { value: profile.values[valueTarget] });
  const personQuestion = fill(profile.personQuestionTemplate, { person: profile.people[personTarget] });
  const orderQuestion = profile.mode === "YEAR"
    ? profile.orderQuestionTemplate
    : fill(profile.orderQuestionTemplate, { person: profile.people[orderTarget] });
  const valueChoices = answerOptions(valueAnswer, PEOPLE.map((person) => profile.people[person]), random, balanceOffset % 4);
  const personChoices = answerOptions(profile.values[assignment[personTarget]], VALUES.map((value) => profile.values[value]), random, (balanceOffset + 1) % 4);
  const orderChoices = profile.mode === "YEAR"
    ? answerOptions(profile.people[orderAnswerPerson], PEOPLE.map((person) => profile.people[person]), random, (balanceOffset + 3) % 4)
    : answerOptions(profile.people[orderAnswerPerson], PEOPLE.map((person) => profile.people[person]), random, (balanceOffset + 3) % 4);
  const finalTable = (answer: string, detail: string) => buildExplanation(profile, assignment, difficultyBand, clues, `${detail}. Therefore, the correct answer is ${answer}.`);
  const children: Lp009Child[] = [
    {
      questionId: `${caseletId}-Q1`, qlId: "LP-QL-033", stem: qlStem(profile, setup, clues, valueQuestion), options: valueChoices.options, correctIndex: valueChoices.correctIndex, answer: valueChoices.options[valueChoices.correctIndex]!, difficultyBand, misconceptionFamily: "value-to-person reversal", explanation: finalTable(valueAnswer, `${valueAnswer} is the person assigned to ${profile.values[valueTarget]}`),
    },
    {
      questionId: `${caseletId}-Q2`, qlId: "LP-QL-034", stem: qlStem(profile, setup, clues, personQuestion), options: personChoices.options, correctIndex: personChoices.correctIndex, answer: personChoices.options[personChoices.correctIndex]!, difficultyBand, misconceptionFamily: "person-to-value reversal", explanation: finalTable(profile.values[assignment[personTarget]], `${profile.people[personTarget]} is assigned ${profile.values[assignment[personTarget]]}`),
    },
    {
      questionId: `${caseletId}-Q3`, qlId: "LP-QL-035", stem: qlStem(profile, setup, clues, fill(profile.pairQuestionTemplate, { left: profile.people[pairLeft], right: profile.people[pairRight] })), options: pair.options, correctIndex: pair.correctIndex, answer: pair.options[pair.correctIndex]!, difficultyBand, misconceptionFamily: "pair-order swap", explanation: finalTable(pairText(profile, pairLeft, pairRight, assignment[pairLeft], assignment[pairRight]), `The completed rows for ${profile.people[pairLeft]} and ${profile.people[pairRight]} give the matching shown in the answer`),
    },
    {
      questionId: `${caseletId}-Q4`, qlId: "LP-QL-036", stem: qlStem(profile, setup, clues, orderQuestion), options: orderChoices.options, correctIndex: orderChoices.correctIndex, answer: orderChoices.options[orderChoices.correctIndex]!, difficultyBand, misconceptionFamily: profile.mode === "YEAR" ? "oldest-youngest reversal" : "calendar-order reversal", explanation: finalTable(profile.people[orderAnswerPerson], profile.mode === "YEAR" ? `${profile.people[orderAnswerPerson]} occupies the second-earliest birth year and is therefore the second oldest` : `${profile.people[orderAnswerPerson]} is followed by the person in the next listed month`),
    },
  ];
  return children;
}

export function generateLp009Batch(seed = "lp-009-review", count = 8): Lp009Caselet[] {
  const result: Lp009Caselet[] = [];
  for (let index = 0; index < count; index += 1) {
    const random = rng(`${seed}:caselet:${index}`);
    const template = PROFILES[index % PROFILES.length]!;
    const profile = materializeProfile(template, random);
    const assignment = pick(shuffle(ALL_ASSIGNMENTS, random), random);
    const difficultyBand = (["Easy", "Medium", "Hard"] as const)[(hashSeed(`${seed}:difficulty:${index}`) % 3)]!;
    const clues = chooseClues(assignment, profile, difficultyBand, random);
    const caseletId = `LP-009-${String(index + 1).padStart(3, "0")}`;
    const questionSetup = buildQuestionSetup(profile);
    result.push({ caseletId, scenario: profile.scenario, questionSetup, scenarioProfileId: profile.id, mode: profile.mode, difficultyBand, people: PEOPLE, values: VALUES, labels: profile, clues, assignment, children: buildChildren(caseletId, profile, questionSetup, clues, assignment, difficultyBand, random) });
  }
  return result;
}
