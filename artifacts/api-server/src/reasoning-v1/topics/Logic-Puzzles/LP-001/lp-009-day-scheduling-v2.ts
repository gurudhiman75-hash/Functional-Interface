import type { DifficultyBand } from "./index.ts";
import { LP_009_ENGLISH_FREEZE_V1 } from "./lp-009-permanent-freeze.ts";

export type Lp009DayPerson = "A" | "B" | "C" | "D" | "E" | "F";
export type Lp009DayValue = 0 | 1 | 2 | 3 | 4 | 5;
export type Lp009DayAssignment = Record<Lp009DayPerson, Lp009DayValue>;

export type Lp009DayClue =
  | { kind: "PERSON_DAY"; person: Lp009DayPerson; day: Lp009DayValue; text: string }
  | { kind: "BEFORE"; left: Lp009DayPerson; right: Lp009DayPerson; text: string }
  | { kind: "BETWEEN"; left: Lp009DayPerson; right: Lp009DayPerson; count: number; text: string }
  | { kind: "ADJACENT"; left: Lp009DayPerson; right: Lp009DayPerson; text: string }
  | { kind: "NOT_DAY"; person: Lp009DayPerson; day: Lp009DayValue; text: string };

export type Lp009DayProfile = {
  id: string;
  scenario: string;
  setupTemplate: string;
  entityNoun: string;
  people: Record<Lp009DayPerson, string>;
};

export type Lp009DayChild = {
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

export type Lp009DayCaselet = {
  caseletId: string;
  scenarioProfileId: string;
  scenario: string;
  questionSetup: string;
  mode: "DAY";
  difficultyBand: DifficultyBand;
  people: readonly Lp009DayPerson[];
  days: readonly Lp009DayValue[];
  labels: Lp009DayProfile;
  clues: readonly Lp009DayClue[];
  assignment: Lp009DayAssignment;
  children: readonly Lp009DayChild[];
};

export const LP_009_DAY_SCHEDULING_V2_REVIEW = Object.freeze({
  authorityId: "LP_009_DAY_SCHEDULING_V2_REVIEW" as const,
  parentEnglishFreezeAuthorityId: LP_009_ENGLISH_FREEZE_V1.authorityId,
  packageId: "LP-009" as const,
  checkpointId: "LP-CP-009" as const,
  mode: "DAY" as const,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  qlAllocation: "REUSE_EXISTING_PERMANENT_QLS" as const,
  permanentQlIds: ["LP-QL-033", "LP-QL-034", "LP-QL-035", "LP-QL-036"] as const,
  nextAvailableQlId: "LP-QL-041" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  supportedLanguage: "en" as const,
  invariants: Object.freeze({
    frozenMonthYearV1Unchanged: true,
    noNewPermanentQl: true,
    completePeopleAndDayDomainInEveryStem: true,
    uniqueSolvedAssignment: true,
    everyDisplayedClueNecessary: true,
    dependencyDrivenExplanationOrder: true,
    progressiveWorkingTables: true,
    repeatedExclusionsPerPersonForbidden: true,
    excessiveExclusionStacksForbidden: true,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  }),
});

const PEOPLE: readonly Lp009DayPerson[] = ["A", "B", "C", "D", "E", "F"];
const DAY_VALUES: readonly Lp009DayValue[] = [0, 1, 2, 3, 4, 5];
const DAY_LABELS: Record<Lp009DayValue, string> = {
  0: "Monday",
  1: "Tuesday",
  2: "Wednesday",
  3: "Thursday",
  4: "Friday",
  5: "Saturday",
};

const PROFILE_TEMPLATES = [
  {
    id: "TEACHER_LECTURE_DAYS",
    scenario: "Six teachers are scheduled to give one lecture each during the week.",
    setupTemplate: "The teachers—{people}—are scheduled from Monday to Saturday. Exactly one teacher is scheduled on each of these six days: {days}.",
    entityNoun: "teacher",
    peoplePool: ["Aarav", "Bhavna", "Chetan", "Diya", "Eshan", "Kavya", "Manav", "Neha", "Ritu", "Varun", "Ishita", "Mohan", "Naina", "Parth", "Sonal", "Tanya"],
  },
  {
    id: "APPLICANT_INTERVIEW_DAYS",
    scenario: "Six applicants have their interviews on different days of the week.",
    setupTemplate: "The applicants—{people}—have one interview each from Monday to Saturday. Exactly one applicant has an interview on each of these six days: {days}.",
    entityNoun: "applicant",
    peoplePool: ["Aditi", "Bharat", "Charu", "Dev", "Farah", "Gaurav", "Meena", "Pooja", "Rakesh", "Sneha", "Tanvi", "Yash", "Ira", "Jatin", "Mira", "Nakul"],
  },
  {
    id: "OFFICER_REVIEW_DAYS",
    scenario: "Six officers attend individual review meetings on different days.",
    setupTemplate: "The officers—{people}—attend one review meeting each from Monday to Saturday. Exactly one officer is scheduled on each of these six days: {days}.",
    entityNoun: "officer",
    peoplePool: ["Alok", "Beena", "Dinesh", "Farah", "Gopal", "Harini", "Irfan", "Juhi", "Kartik", "Leela", "Nitin", "Rupa", "Samar", "Tara", "Vivek", "Zubin"],
  },
  {
    id: "TRAINEE_PRACTICAL_DAYS",
    scenario: "Six trainees attend individual practical sessions on different days.",
    setupTemplate: "The trainees—{people}—attend one practical session each from Monday to Saturday. Exactly one trainee is scheduled on each of these six days: {days}.",
    entityNoun: "trainee",
    peoplePool: ["Kamal", "Lata", "Mohit", "Nisha", "Omkar", "Priya", "Rahul", "Simran", "Tarun", "Zoya", "Arjun", "Leela", "Madhav", "Poonam", "Ravi", "Seema"],
  },
  {
    id: "RESEARCH_PRESENTATION_DAYS",
    scenario: "Six researchers give individual presentations on different days.",
    setupTemplate: "The researchers—{people}—give one presentation each from Monday to Saturday. Exactly one researcher is scheduled on each of these six days: {days}.",
    entityNoun: "researcher",
    peoplePool: ["Anika", "Bimal", "Deepa", "Harsh", "Isha", "Kabir", "Meera", "Naman", "Pallavi", "Rehan", "Saira", "Uday", "Vidhi", "Yatin", "Zara", "Rohan"],
  },
  {
    id: "STAFF_VERIFICATION_DAYS",
    scenario: "Six staff members complete individual verification sessions on different days.",
    setupTemplate: "The staff members—{people}—complete one verification session each from Monday to Saturday. Exactly one person is scheduled on each of these six days: {days}.",
    entityNoun: "person",
    peoplePool: ["Amar", "Bina", "Chirag", "Dolly", "Ekta", "Firoz", "Geeta", "Hitesh", "Jaya", "Kiran", "Lalit", "Mona", "Naveen", "Priti", "Rajat", "Suman"],
  },
] as const;

type ProfileTemplate = (typeof PROFILE_TEMPLATES)[number];
type IndexedClue = { clue: Lp009DayClue; index: number };

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

function examList(values: readonly string[]): string {
  if (values.length <= 1) return values.join("");
  return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
}

function materializeProfile(template: ProfileTemplate, random: () => number): Lp009DayProfile {
  const selected = shuffle(template.peoplePool, random).slice(0, 6);
  return {
    id: template.id,
    scenario: template.scenario,
    setupTemplate: template.setupTemplate,
    entityNoun: template.entityNoun,
    people: { A: selected[0]!, B: selected[1]!, C: selected[2]!, D: selected[3]!, E: selected[4]!, F: selected[5]! },
  };
}

function buildQuestionSetup(profile: Lp009DayProfile): string {
  return `${profile.scenario} ${fill(profile.setupTemplate, {
    people: examList(PEOPLE.map((person) => profile.people[person])),
    days: examList(DAY_VALUES.map((day) => DAY_LABELS[day])),
  })}`;
}

const ALL_ASSIGNMENTS: readonly Lp009DayAssignment[] = permutations(DAY_VALUES).map((order) => ({
  A: order[0]!, B: order[1]!, C: order[2]!, D: order[3]!, E: order[4]!, F: order[5]!,
}));

function sameAssignment(left: Lp009DayAssignment, right: Lp009DayAssignment): boolean {
  return PEOPLE.every((person) => left[person] === right[person]);
}

function satisfies(assignment: Lp009DayAssignment, clue: Lp009DayClue): boolean {
  if (clue.kind === "PERSON_DAY") return assignment[clue.person] === clue.day;
  if (clue.kind === "NOT_DAY") return assignment[clue.person] !== clue.day;
  if (clue.kind === "BEFORE") return assignment[clue.left] < assignment[clue.right];
  if (clue.kind === "BETWEEN") return Math.abs(assignment[clue.left] - assignment[clue.right]) - 1 === clue.count;
  return Math.abs(assignment[clue.left] - assignment[clue.right]) === 1;
}

export function solveLp009Day(input: { clues: readonly Lp009DayClue[] }): Lp009DayAssignment[] {
  return ALL_ASSIGNMENTS.filter((assignment) => input.clues.every((clue) => satisfies(assignment, clue)));
}

function clueKey(clue: Lp009DayClue): string {
  if (clue.kind === "PERSON_DAY" || clue.kind === "NOT_DAY") return `${clue.kind}:${clue.person}:${clue.day}`;
  if (clue.kind === "BETWEEN") return `${clue.kind}:${[clue.left, clue.right].sort().join(":")}:${clue.count}`;
  if (clue.kind === "ADJACENT") return `${clue.kind}:${[clue.left, clue.right].sort().join(":")}`;
  return `${clue.kind}:${clue.left}:${clue.right}`;
}

function minimizeUnique(clues: readonly Lp009DayClue[]): Lp009DayClue[] {
  const result = [...clues];
  let changed = true;
  while (changed) {
    changed = false;
    for (let index = 0; index < result.length; index += 1) {
      const reduced = result.filter((_, candidateIndex) => candidateIndex !== index);
      if (solveLp009Day({ clues: reduced }).length === 1) {
        result.splice(index, 1);
        changed = true;
        break;
      }
    }
  }
  return result;
}

function everyClueEssential(clues: readonly Lp009DayClue[]): boolean {
  return clues.every((_, index) => solveLp009Day({ clues: clues.filter((__, candidateIndex) => candidateIndex !== index) }).length > 1);
}

function buildCandidates(assignment: Lp009DayAssignment, profile: Lp009DayProfile): Lp009DayClue[] {
  const candidates: Lp009DayClue[] = [];
  for (const person of PEOPLE) {
    const day = assignment[person];
    candidates.push({ kind: "PERSON_DAY", person, day, text: `${profile.people[person]} is scheduled on ${DAY_LABELS[day]}.` });
    for (const excluded of DAY_VALUES) {
      if (excluded === day) continue;
      candidates.push({ kind: "NOT_DAY", person, day: excluded, text: `${profile.people[person]} is not scheduled on ${DAY_LABELS[excluded]}.` });
    }
  }
  for (let leftIndex = 0; leftIndex < PEOPLE.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < PEOPLE.length; rightIndex += 1) {
      const left = PEOPLE[leftIndex]!;
      const right = PEOPLE[rightIndex]!;
      const first = assignment[left] < assignment[right] ? left : right;
      const second = first === left ? right : left;
      candidates.push({ kind: "BEFORE", left: first, right: second, text: `${profile.people[first]} is scheduled earlier in the week than ${profile.people[second]}.` });
      const count = Math.abs(assignment[left] - assignment[right]) - 1;
      if (count >= 1) candidates.push({ kind: "BETWEEN", left, right, count, text: `Exactly ${count === 1 ? "one person is" : `${count} people are`} scheduled between ${profile.people[left]} and ${profile.people[right]}.` });
      if (Math.abs(assignment[left] - assignment[right]) === 1) candidates.push({ kind: "ADJACENT", left, right, text: `${profile.people[left]} and ${profile.people[right]} are scheduled on consecutive days, in either order.` });
    }
  }
  return candidates;
}

function clueKindCount(clues: readonly Lp009DayClue[]): number {
  return new Set(clues.map((clue) => clue.kind)).size;
}

function acceptableDifficulty(clues: readonly Lp009DayClue[], difficulty: DifficultyBand): boolean {
  const direct = clues.filter((clue) => clue.kind === "PERSON_DAY").length;
  const relationKinds = new Set(clues.filter((clue) => clue.kind === "BEFORE" || clue.kind === "BETWEEN" || clue.kind === "ADJACENT").map((clue) => clue.kind)).size;
  const exclusions = clues.filter((clue) => clue.kind === "NOT_DAY").length;
  const exclusionPeople = new Set(clues.filter((clue): clue is Extract<Lp009DayClue, { kind: "NOT_DAY" }> => clue.kind === "NOT_DAY").map((clue) => clue.person));
  if (exclusionPeople.size !== exclusions) return false;
  if (difficulty === "Easy") return direct >= 3 && exclusions <= 1 && clues.length >= 4 && clues.length <= 6;
  if (difficulty === "Medium") return direct >= 1 && direct <= 3 && relationKinds >= 1 && exclusions === 1 && clues.length >= 5;
  return direct <= 1 && relationKinds >= 2 && exclusions >= 1 && exclusions <= 2 && clueKindCount(clues) >= 3 && clues.length >= 5;
}

function chooseClues(assignment: Lp009DayAssignment, profile: Lp009DayProfile, difficulty: DifficultyBand, random: () => number): Lp009DayClue[] {
  const candidates = buildCandidates(assignment, profile);
  const directCandidates = candidates.filter((clue) => clue.kind === "PERSON_DAY");
  const directTarget = difficulty === "Easy" ? 4 : difficulty === "Medium" ? 2 : 1;

  for (let attempt = 0; attempt < 12000; attempt += 1) {
    const chosen: Lp009DayClue[] = shuffle(directCandidates, random).slice(0, directTarget);
    let survivors = solveLp009Day({ clues: chosen });
    const maxClues = difficulty === "Easy" ? 7 : difficulty === "Medium" ? 9 : 12;

    while (survivors.length > 1 && chosen.length < maxClues) {
      const directAlready = chosen.filter((clue) => clue.kind === "PERSON_DAY").length;
      const exclusionAlready = chosen.filter((clue) => clue.kind === "NOT_DAY").length;
      const exclusionLimit = difficulty === "Hard" ? 2 : 1;
      const possible = shuffle(candidates, random)
        .filter((candidate) => !chosen.some((clue) => clueKey(clue) === clueKey(candidate)))
        .filter((candidate) => difficulty !== "Hard" || candidate.kind !== "PERSON_DAY")
        .filter((candidate) => difficulty !== "Medium" || directAlready < 3 || candidate.kind !== "PERSON_DAY")
        .filter((candidate) => candidate.kind !== "NOT_DAY" || exclusionAlready < exclusionLimit)
        .filter((candidate) => candidate.kind !== "NOT_DAY" || !chosen.some((clue) => clue.kind === "NOT_DAY" && clue.person === candidate.person))
        .map((candidate) => ({ candidate, remaining: survivors.filter((state) => satisfies(state, candidate)).length }))
        .filter((entry) => entry.remaining > 0 && entry.remaining < survivors.length)
        .sort((left, right) => {
          if (difficulty === "Easy") return left.remaining - right.remaining;
          const targetFraction = difficulty === "Hard" ? 0.55 : 0.35;
          const target = survivors.length * targetFraction;
          return Math.abs(left.remaining - target) - Math.abs(right.remaining - target);
        });
      if (!possible.length) break;
      const window = Math.min(possible.length, difficulty === "Hard" ? 18 : 8);
      const selected = possible[Math.floor(random() * window)]!.candidate;
      chosen.push(selected);
      survivors = survivors.filter((state) => satisfies(state, selected));
    }

    if (survivors.length !== 1 || !sameAssignment(survivors[0]!, assignment)) continue;
    const reduced = minimizeUnique(chosen);
    if (!everyClueEssential(reduced)) continue;
    if (!acceptableDifficulty(reduced, difficulty)) continue;
    return shuffle(reduced, random);
  }
  throw new Error(`Unable to generate an essential unique LP-009 day-only ${difficulty} caselet for ${profile.id}.`);
}

function cluePeople(clue: Lp009DayClue): readonly Lp009DayPerson[] {
  if (clue.kind === "PERSON_DAY" || clue.kind === "NOT_DAY") return [clue.person];
  return [clue.left, clue.right];
}

function workingCell(states: readonly Lp009DayAssignment[], person: Lp009DayPerson): string {
  const possible = DAY_VALUES.filter((day) => states.some((state) => state[person] === day));
  if (possible.length === 1) return DAY_LABELS[possible[0]!]!;
  if (possible.length === DAY_VALUES.length) return "?";
  return possible.map((day) => DAY_LABELS[day]).join(" / ");
}

function tableMarkdown(states: readonly Lp009DayAssignment[], profile: Lp009DayProfile): string {
  const rows = PEOPLE.map((person) => `| ${profile.people[person]} | ${workingCell(states, person)} |`).join("\n");
  return `| ${profile.entityNoun[0]!.toUpperCase()}${profile.entityNoun.slice(1)} | Day |\n|---|---|\n${rows}`;
}

function fullTable(state: Lp009DayAssignment, profile: Lp009DayProfile): string {
  const rows = PEOPLE.map((person) => `| ${profile.people[person]} | ${DAY_LABELS[state[person]]} |`).join("\n");
  return `| ${profile.entityNoun[0]!.toUpperCase()}${profile.entityNoun.slice(1)} | Day |\n|---|---|\n${rows}`;
}

function fixedCount(states: readonly Lp009DayAssignment[]): number {
  return PEOPLE.filter((person) => new Set(states.map((state) => state[person])).size === 1).length;
}

function planClues(clues: readonly Lp009DayClue[]): Lp009DayClue[] {
  const unused: IndexedClue[] = clues.map((clue, index) => ({ clue, index }));
  const planned: Lp009DayClue[] = [];
  const usedPeople = new Set<Lp009DayPerson>();
  let states = solveLp009Day({ clues: [] });

  while (unused.length) {
    let bestPosition = 0;
    let bestScore = Number.NEGATIVE_INFINITY;
    for (let index = 0; index < unused.length; index += 1) {
      const candidate = unused[index]!.clue;
      const next = solveLp009Day({ clues: [...planned, candidate] });
      if (!next.length) continue;
      const fixedGain = fixedCount(next) - fixedCount(states);
      const reduction = states.length > 0 ? Math.log(states.length / next.length) : 0;
      const connected = cluePeople(candidate).some((person) => usedPeople.has(person)) ? 1 : 0;
      const direct = candidate.kind === "PERSON_DAY" ? 1 : 0;
      const score = fixedGain * 1_000_000 + direct * 50_000 + connected * 20_000 + reduction * 1_000 - unused[index]!.index / 1000;
      if (score > bestScore) { bestScore = score; bestPosition = index; }
    }
    const [selected] = unused.splice(bestPosition, 1);
    planned.push(selected!.clue);
    for (const person of cluePeople(selected!.clue)) usedPeople.add(person);
    states = solveLp009Day({ clues: planned });
  }
  return planned;
}

function buildExplanation(profile: Lp009DayProfile, clues: readonly Lp009DayClue[], assignment: Lp009DayAssignment, answerDetail: string): { summary: string; lines: string[] } {
  const planned = planClues(clues);
  const lines: string[] = [];
  let applied: Lp009DayClue[] = [];
  let states = solveLp009Day({ clues: applied });
  let pending: Lp009DayClue[] = [];
  let step = 1;
  let caseShown = false;

  for (let index = 0; index < planned.length; index += 1) {
    const clue = planned[index]!;
    const beforeTable = tableMarkdown(states, profile);
    pending.push(clue);
    const nextApplied = [...applied, clue];
    const nextStates = solveLp009Day({ clues: nextApplied });
    const nextTable = tableMarkdown(nextStates, profile);
    const last = index === planned.length - 1;
    if (nextTable === beforeTable && !last) { applied = nextApplied; states = nextStates; continue; }

    const lead = pending.length === 1
      ? `${step === 1 ? "Start with" : "Now use"} this clue: ${pending[0]!.text}`
      : `Use these connected clues together: ${pending.map((item) => item.text.replace(/[.]$/u, "")).join("; then ")}.`;
    let body = `${lead}\n\nThe working table is now:\n\n${nextTable}`;
    if (!caseShown && nextStates.length === 2 && !last) {
      body += `\n\nOnly two complete arrangements remain. Check both cases.\n\n**Case 1**\n\n${fullTable(nextStates[0]!, profile)}\n\n**Case 2**\n\n${fullTable(nextStates[1]!, profile)}`;
      caseShown = true;
    }
    if (last && states.length === 2 && nextStates.length === 1) {
      const keepFirst = sameAssignment(nextStates[0]!, states[0]!);
      body += `\n\nThis clue removes Case ${keepFirst ? "2" : "1"}. Keep Case ${keepFirst ? "1" : "2"}.`;
    }
    lines.push(`**Step ${step}**\n\n${body}`);
    pending = [];
    applied = nextApplied;
    states = nextStates;
    step += 1;
  }

  lines.push(`**Step ${step}: Complete the schedule**\n\nThe final table is:\n\n${fullTable(assignment, profile)}`);
  lines.push(`**Step ${step + 1}: Answer the question**\n\n${answerDetail}`);
  return { summary: "Use the strongest useful clues first and fill the day schedule step by step.", lines };
}

function placeAnswer(distractors: readonly string[], answer: string, targetIndex: number): { options: string[]; correctIndex: number } {
  const unique = [...new Set(distractors.filter((value) => value !== answer))].slice(0, 3);
  if (unique.length !== 3) throw new Error(`LP-009 day V2 could not construct three unique distractors for '${answer}'.`);
  const options = [...unique];
  options.splice(targetIndex, 0, answer);
  return { options, correctIndex: targetIndex };
}

function personOptions(profile: Lp009DayProfile, answer: string, random: () => number, targetIndex: number) {
  return placeAnswer(shuffle(PEOPLE.map((person) => profile.people[person]).filter((value) => value !== answer), random), answer, targetIndex);
}

function dayOptions(answer: string, random: () => number, targetIndex: number) {
  return placeAnswer(shuffle(DAY_VALUES.map((day) => DAY_LABELS[day]).filter((value) => value !== answer), random), answer, targetIndex);
}

function pairText(profile: Lp009DayProfile, left: Lp009DayPerson, right: Lp009DayPerson, assignment: Lp009DayAssignment): string {
  return `${profile.people[left]} — ${DAY_LABELS[assignment[left]]}; ${profile.people[right]} — ${DAY_LABELS[assignment[right]]}`;
}

function pairOptions(profile: Lp009DayProfile, left: Lp009DayPerson, right: Lp009DayPerson, assignment: Lp009DayAssignment, random: () => number, targetIndex: number) {
  const correct = pairText(profile, left, right, assignment);
  const candidates: string[] = [];
  for (const leftDay of shuffle(DAY_VALUES, random)) {
    for (const rightDay of shuffle(DAY_VALUES, random)) {
      if (leftDay === rightDay) continue;
      const option = `${profile.people[left]} — ${DAY_LABELS[leftDay]}; ${profile.people[right]} — ${DAY_LABELS[rightDay]}`;
      if (option === correct || candidates.includes(option)) continue;
      candidates.push(option);
    }
  }
  return placeAnswer(candidates, correct, targetIndex);
}

function standaloneStem(setup: string, clues: readonly Lp009DayClue[], question: string): string {
  return `${setup}\n\nClues:\n${clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n${question}`;
}

function buildChildren(caseletId: string, caseletIndex: number, profile: Lp009DayProfile, setup: string, clues: readonly Lp009DayClue[], assignment: Lp009DayAssignment, difficulty: DifficultyBand, random: () => number): Lp009DayChild[] {
  const byDay = new Map<Lp009DayValue, Lp009DayPerson>(PEOPLE.map((person) => [assignment[person], person]));
  const targets = shuffle(PEOPLE, random);
  const q1Day = assignment[targets[0]!]!;
  const q1Person = byDay.get(q1Day)!;
  const q2Person = targets[1]!;
  const pairLeft = targets[2]!;
  const pairRight = targets[3]!;
  const nextBaseCandidates = PEOPLE.filter((person) => assignment[person] < 5);
  const nextBase = nextBaseCandidates[Math.floor(random() * nextBaseCandidates.length)]!;
  const nextPerson = byDay.get((assignment[nextBase] + 1) as Lp009DayValue)!;
  const q1Answer = profile.people[q1Person];
  const q2Answer = DAY_LABELS[assignment[q2Person]];
  const q3Answer = pairText(profile, pairLeft, pairRight, assignment);
  const q4Answer = profile.people[nextPerson];
  const q1 = personOptions(profile, q1Answer, random, caseletIndex % 4);
  const q2 = dayOptions(q2Answer, random, (caseletIndex + 1) % 4);
  const q3 = pairOptions(profile, pairLeft, pairRight, assignment, random, (caseletIndex + 2) % 4);
  const q4 = personOptions(profile, q4Answer, random, (caseletIndex + 3) % 4);

  return [
    { questionId: `${caseletId}-Q1`, qlId: "LP-QL-033", stem: standaloneStem(setup, clues, `Who is scheduled on ${DAY_LABELS[q1Day]}?`), options: q1.options, correctIndex: q1.correctIndex, answer: q1Answer, difficultyBand: difficulty, misconceptionFamily: "day-to-person reversal", explanation: buildExplanation(profile, clues, assignment, `From the completed table, **${q1Answer}** is scheduled on ${DAY_LABELS[q1Day]}.`) },
    { questionId: `${caseletId}-Q2`, qlId: "LP-QL-034", stem: standaloneStem(setup, clues, `On which day is ${profile.people[q2Person]} scheduled?`), options: q2.options, correctIndex: q2.correctIndex, answer: q2Answer, difficultyBand: difficulty, misconceptionFamily: "person-to-day reversal", explanation: buildExplanation(profile, clues, assignment, `From the completed table, **${profile.people[q2Person]}** is scheduled on **${q2Answer}**.`) },
    { questionId: `${caseletId}-Q3`, qlId: "LP-QL-035", stem: standaloneStem(setup, clues, `Which option correctly gives the scheduled days of ${profile.people[pairLeft]} and ${profile.people[pairRight]}, respectively?`), options: q3.options, correctIndex: q3.correctIndex, answer: q3Answer, difficultyBand: difficulty, misconceptionFamily: "pair-order or day-swap error", explanation: buildExplanation(profile, clues, assignment, `The completed rows give **${q3Answer}**.`) },
    { questionId: `${caseletId}-Q4`, qlId: "LP-QL-036", stem: standaloneStem(setup, clues, `Who is scheduled on the day immediately after ${profile.people[nextBase]}?`), options: q4.options, correctIndex: q4.correctIndex, answer: q4Answer, difficultyBand: difficulty, misconceptionFamily: "next-day direction reversal", explanation: buildExplanation(profile, clues, assignment, `${profile.people[nextBase]} is on ${DAY_LABELS[assignment[nextBase]]}; the next listed day has **${q4Answer}**.`) },
  ];
}

export function generateLp009DaySchedulingV2(seed = "lp-009-day-scheduling-v2", count = 8): Lp009DayCaselet[] {
  const result: Lp009DayCaselet[] = [];
  for (let index = 0; index < count; index += 1) {
    const random = rng(`${seed}:caselet:${index}`);
    const template = PROFILE_TEMPLATES[index % PROFILE_TEMPLATES.length]!;
    const profile = materializeProfile(template, random);
    const assignmentOrder = shuffle(DAY_VALUES, random);
    const assignment: Lp009DayAssignment = { A: assignmentOrder[0]!, B: assignmentOrder[1]!, C: assignmentOrder[2]!, D: assignmentOrder[3]!, E: assignmentOrder[4]!, F: assignmentOrder[5]! };
    const difficulty = (["Easy", "Medium", "Hard"] as const)[hashSeed(`${seed}:difficulty:${index}`) % 3]!;
    const clues = chooseClues(assignment, profile, difficulty, random);
    const caseletId = `LP-009-DAY-V2-${String(index + 1).padStart(3, "0")}`;
    const questionSetup = buildQuestionSetup(profile);
    result.push({ caseletId, scenarioProfileId: profile.id, scenario: profile.scenario, questionSetup, mode: "DAY", difficultyBand: difficulty, people: PEOPLE, days: DAY_VALUES, labels: profile, clues, assignment, children: buildChildren(caseletId, index, profile, questionSetup, clues, assignment, difficulty, random) });
  }
  return result;
}
