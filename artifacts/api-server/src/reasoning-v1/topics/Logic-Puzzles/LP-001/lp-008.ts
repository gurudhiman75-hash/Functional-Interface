import type { DifficultyBand } from "./index.ts";

export type CalendarPerson = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
export type MonthId = 0 | 1 | 2 | 3;
export type SlotId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type CalendarAssignment = Record<CalendarPerson, SlotId>;

export type CalendarClue =
  | { kind: "PERSON_SLOT"; person: CalendarPerson; slot: SlotId; text: string }
  | { kind: "SAME_MONTH"; left: CalendarPerson; right: CalendarPerson; text: string }
  | { kind: "SAME_DATE"; left: CalendarPerson; right: CalendarPerson; text: string }
  | { kind: "BEFORE"; left: CalendarPerson; right: CalendarPerson; text: string }
  | { kind: "BETWEEN"; left: CalendarPerson; right: CalendarPerson; count: number; text: string }
  | { kind: "NOT_MONTH"; person: CalendarPerson; month: MonthId; text: string };

export type Lp008Profile = {
  id: string;
  scenario: string;
  personNoun: string;
  eventNoun: string;
  months: Record<MonthId, string>;
  personQuestionTemplate: string;
  slotQuestionTemplate: string;
  directTemplates: readonly string[];
  sameMonthTemplates: readonly string[];
  sameDateTemplates: readonly string[];
  beforeTemplates: readonly string[];
  betweenTemplates: readonly string[];
  notMonthTemplates: readonly string[];
  people: Record<CalendarPerson, string>;
};

export type Lp008Child = {
  questionId: string;
  qlId: "LP-QL-029" | "LP-QL-030" | "LP-QL-031" | "LP-QL-032";
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  difficultyBand: DifficultyBand;
  misconceptionFamily: string;
  explanation: { summary: string; lines: string[] };
};

export type Lp008Caselet = {
  caseletId: string;
  scenario: string;
  questionSetup: string;
  scenarioProfileId: string;
  difficultyBand: DifficultyBand;
  people: readonly CalendarPerson[];
  months: readonly MonthId[];
  slots: readonly SlotId[];
  labels: Lp008Profile;
  clues: readonly CalendarClue[];
  assignment: CalendarAssignment;
  children: readonly Lp008Child[];
};

const PEOPLE: readonly CalendarPerson[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
const MONTHS: readonly string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DATES = ["12th", "27th"] as const;
const SLOTS: readonly SlotId[] = [0, 1, 2, 3, 4, 5, 6, 7];

type ProfileTemplate = {
  id: string;
  scenario: string;
  personNoun: string;
  eventNoun: string;
  personQuestionTemplate: string;
  slotQuestionTemplate: string;
  directTemplates: readonly string[];
  sameMonthTemplates: readonly string[];
  sameDateTemplates: readonly string[];
  beforeTemplates: readonly string[];
  betweenTemplates: readonly string[];
  notMonthTemplates: readonly string[];
  peoplePool: readonly string[];
  monthPool: readonly string[];
};

const PROFILES: readonly ProfileTemplate[] = [
  {
    id: "BIRTHDAY_REGISTER",
    scenario: "A school is recording the birthdays of eight students.",
    personNoun: "student",
    eventNoun: "birthday",
    personQuestionTemplate: "On which date and month is {person}'s birthday?",
    slotQuestionTemplate: "Who has a birthday on {slot}?",
    directTemplates: ["{person}'s birthday is on {slot}.", "The birthday of {person} falls on {slot}."],
    sameMonthTemplates: ["{left} and {right} have their birthdays in the same month.", "The birthdays of {left} and {right} fall in the same month."],
    sameDateTemplates: ["{left} and {right} have their birthdays on the same date.", "The birthdays of {left} and {right} fall on the same date."],
    beforeTemplates: ["{left}'s birthday is before {right}'s birthday.", "The birthday of {left} comes before that of {right}."],
    betweenTemplates: ["Exactly {count} students have their birthdays between those of {left} and {right}.", "There are exactly {count} birthdays between the birthdays of {left} and {right}."],
    notMonthTemplates: ["{person}'s birthday is not in {month}.", "The birthday of {person} does not fall in {month}."],
    peoplePool: ["Aarav", "Bhavna", "Chetan", "Diya", "Eshan", "Kavya", "Manav", "Neha", "Ritu", "Varun", "Ishita", "Mohan"],
    monthPool: ["January", "March", "April", "May", "June", "July", "September", "November"],
  },
  {
    id: "INTERVIEW_CALENDAR",
    scenario: "A recruitment board is scheduling interviews for eight applicants.",
    personNoun: "applicant",
    eventNoun: "interview",
    personQuestionTemplate: "On which date and month is {person}'s interview scheduled?",
    slotQuestionTemplate: "Who has an interview scheduled on {slot}?",
    directTemplates: ["{person}'s interview is scheduled on {slot}.", "The interview of {person} is on {slot}."],
    sameMonthTemplates: ["The interviews of {left} and {right} are scheduled in the same month.", "{left} and {right} have their interviews in the same month."],
    sameDateTemplates: ["The interviews of {left} and {right} are on the same date.", "{left} and {right} are interviewed on the same date."],
    beforeTemplates: ["{left}'s interview is scheduled before {right}'s.", "The interview of {left} is earlier than that of {right}."],
    betweenTemplates: ["Exactly {count} applicants are interviewed between {left} and {right}.", "There are exactly {count} interviews between the interviews of {left} and {right}."],
    notMonthTemplates: ["{person}'s interview is not scheduled in {month}.", "The interview of {person} is not in {month}."],
    peoplePool: ["Aditi", "Bharat", "Charu", "Dev", "Farah", "Gaurav", "Meena", "Pooja", "Rakesh", "Sneha", "Tanvi", "Yash"],
    monthPool: ["February", "April", "May", "June", "August", "September", "October", "December"],
  },
  {
    id: "AUDIT_REVIEW_DATES",
    scenario: "A bank is scheduling eight review meetings for its officers.",
    personNoun: "officer",
    eventNoun: "review meeting",
    personQuestionTemplate: "On which date and month is {person}'s review meeting scheduled?",
    slotQuestionTemplate: "Who has a review meeting scheduled on {slot}?",
    directTemplates: ["{person}'s review meeting is on {slot}.", "The review meeting of {person} is scheduled on {slot}."],
    sameMonthTemplates: ["The review meetings of {left} and {right} are in the same month.", "{left} and {right} have their review meetings in the same month."],
    sameDateTemplates: ["The review meetings of {left} and {right} are on the same date.", "{left} and {right} have review meetings on the same date."],
    beforeTemplates: ["{left}'s review meeting is before {right}'s.", "The review meeting of {left} is earlier than that of {right}."],
    betweenTemplates: ["Exactly {count} officers have review meetings between those of {left} and {right}.", "There are exactly {count} review meetings between the meetings of {left} and {right}."],
    notMonthTemplates: ["{person}'s review meeting is not in {month}.", "The review meeting of {person} is not scheduled in {month}."],
    peoplePool: ["Kamal", "Lata", "Mohit", "Nisha", "Omkar", "Priya", "Rahul", "Simran", "Tarun", "Zoya", "Arjun", "Leela"],
    monthPool: ["January", "February", "March", "June", "July", "August", "October", "December"],
  },
  {
    id: "TRAINING_SESSIONS",
    scenario: "A training institute is scheduling sessions for eight instructors.",
    personNoun: "instructor",
    eventNoun: "training session",
    personQuestionTemplate: "On which date and month is {person}'s training session scheduled?",
    slotQuestionTemplate: "Who has a training session scheduled on {slot}?",
    directTemplates: ["{person}'s training session is on {slot}.", "The training session of {person} is scheduled on {slot}."],
    sameMonthTemplates: ["The training sessions of {left} and {right} are in the same month.", "{left} and {right} have their training sessions in the same month."],
    sameDateTemplates: ["The training sessions of {left} and {right} are on the same date.", "{left} and {right} have training sessions on the same date."],
    beforeTemplates: ["{left}'s training session is before {right}'s.", "The training session of {left} comes before that of {right}."],
    betweenTemplates: ["Exactly {count} instructors have training sessions between those of {left} and {right}.", "There are exactly {count} training sessions between the sessions of {left} and {right}."],
    notMonthTemplates: ["{person}'s training session is not in {month}.", "The training session of {person} is not scheduled in {month}."],
    peoplePool: ["Anita", "Bharat", "Chandan", "Ira", "Jatin", "Kiran", "Mohan", "Nisha", "Parth", "Sonal", "Vivek", "Zubin"],
    monthPool: ["January", "April", "May", "July", "August", "September", "November", "December"],
  },
  {
    id: "HEALTH_CAMP_DATES",
    scenario: "A health department is assigning eight doctors to outreach camps.",
    personNoun: "doctor",
    eventNoun: "outreach camp",
    personQuestionTemplate: "On which date and month is {person}'s outreach camp scheduled?",
    slotQuestionTemplate: "Who is assigned an outreach camp on {slot}?",
    directTemplates: ["{person}'s outreach camp is on {slot}.", "The outreach camp assigned to {person} is scheduled on {slot}."],
    sameMonthTemplates: ["The outreach camps assigned to {left} and {right} are in the same month.", "{left} and {right} are assigned camps in the same month."],
    sameDateTemplates: ["The outreach camps assigned to {left} and {right} are on the same date.", "{left} and {right} have camps on the same date."],
    beforeTemplates: ["{left}'s outreach camp is before {right}'s.", "The camp assigned to {left} is earlier than the camp assigned to {right}."],
    betweenTemplates: ["Exactly {count} doctors have outreach camps between those of {left} and {right}.", "There are exactly {count} camps between the camps of {left} and {right}."],
    notMonthTemplates: ["{person}'s outreach camp is not in {month}.", "The outreach camp assigned to {person} is not scheduled in {month}."],
    peoplePool: ["Asha", "Bikram", "Deepak", "Esha", "Harish", "Jyoti", "Kiran", "Mona", "Naveen", "Reema", "Sahil", "Tina"],
    monthPool: ["February", "March", "May", "June", "July", "September", "October", "November"],
  },
  {
    id: "CULTURAL_EVENTS",
    scenario: "A cultural committee is scheduling eight programme events.",
    personNoun: "programme",
    eventNoun: "event",
    personQuestionTemplate: "On which date and month is the event of {person} scheduled?",
    slotQuestionTemplate: "Which programme has an event on {slot}?",
    directTemplates: ["The event of {person} is scheduled on {slot}.", "{person}'s event is on {slot}."],
    sameMonthTemplates: ["The events of {left} and {right} are scheduled in the same month.", "The programmes of {left} and {right} have events in the same month."],
    sameDateTemplates: ["The events of {left} and {right} are scheduled on the same date.", "The programmes of {left} and {right} have events on the same date."],
    beforeTemplates: ["The event of {left} is scheduled before that of {right}.", "{left}'s event comes before {right}'s event."],
    betweenTemplates: ["Exactly {count} events are scheduled between the events of {left} and {right}.", "There are exactly {count} programme events between those of {left} and {right}."],
    notMonthTemplates: ["The event of {person} is not scheduled in {month}.", "{person}'s event is not in {month}."],
    peoplePool: ["Aman", "Beena", "Dinesh", "Farah", "Gopal", "Harini", "Irfan", "Juhi", "Kartik", "Leela", "Nitin", "Rupa"],
    monthPool: ["January", "March", "April", "June", "August", "September", "October", "November"],
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

function monthOf(slot: SlotId): MonthId { return Math.floor(slot / 2) as MonthId; }
function dateOf(slot: SlotId): 0 | 1 { return (slot % 2) as 0 | 1; }
function formatSlot(profile: Lp008Profile, slot: SlotId): string { return `${DATES[dateOf(slot)]} ${profile.months[monthOf(slot)]}`; }

function materializeProfile(template: ProfileTemplate, random: () => number): Lp008Profile {
  const people = shuffle(template.peoplePool, random).slice(0, 8);
  const months = shuffle(template.monthPool, random).slice(0, 4);
  return {
    id: template.id,
    scenario: template.scenario,
    personNoun: template.personNoun,
    eventNoun: template.eventNoun,
    months: { 0: months[0]!, 1: months[1]!, 2: months[2]!, 3: months[3]! },
    personQuestionTemplate: template.personQuestionTemplate,
    slotQuestionTemplate: template.slotQuestionTemplate,
    directTemplates: template.directTemplates,
    sameMonthTemplates: template.sameMonthTemplates,
    sameDateTemplates: template.sameDateTemplates,
    beforeTemplates: template.beforeTemplates,
    betweenTemplates: template.betweenTemplates,
    notMonthTemplates: template.notMonthTemplates,
    people: { A: people[0]!, B: people[1]!, C: people[2]!, D: people[3]!, E: people[4]!, F: people[5]!, G: people[6]!, H: people[7]! },
  };
}

function buildQuestionSetup(profile: Lp008Profile): string {
  const people = examList(PEOPLE.map((person) => profile.people[person]));
  const monthDates = profile.months && Object.values(profile.months).flatMap((month) => DATES.map((date) => `${date} ${month}`));
  return `${profile.scenario} The ${profile.personNoun}s—${people}—each have one ${profile.eventNoun} on one of the following eight dates: ${examList(monthDates)}. No two ${profile.personNoun}s have their ${profile.eventNoun} on the same date in the same month, so each of the eight dates is used once.`;
}

const ALL_ASSIGNMENTS: readonly CalendarAssignment[] = permutations(SLOTS).map((order) => ({ A: order[0]!, B: order[1]!, C: order[2]!, D: order[3]!, E: order[4]!, F: order[5]!, G: order[6]!, H: order[7]! }));

function satisfies(assignment: CalendarAssignment, clue: CalendarClue): boolean {
  if (clue.kind === "PERSON_SLOT") return assignment[clue.person] === clue.slot;
  if (clue.kind === "SAME_MONTH") return monthOf(assignment[clue.left]) === monthOf(assignment[clue.right]);
  if (clue.kind === "SAME_DATE") return dateOf(assignment[clue.left]) === dateOf(assignment[clue.right]);
  if (clue.kind === "BEFORE") return assignment[clue.left] < assignment[clue.right];
  if (clue.kind === "BETWEEN") return Math.abs(assignment[clue.left] - assignment[clue.right]) - 1 === clue.count;
  return monthOf(assignment[clue.person]) !== clue.month;
}

export function solveLp008(input: { clues: readonly CalendarClue[] }): CalendarAssignment[] {
  return ALL_ASSIGNMENTS.filter((assignment) => input.clues.every((clue) => satisfies(assignment, clue)));
}

function clueKey(clue: CalendarClue): string {
  if (clue.kind === "PERSON_SLOT") return `${clue.kind}:${clue.person}:${clue.slot}`;
  if (clue.kind === "NOT_MONTH") return `${clue.kind}:${clue.person}:${clue.month}`;
  if (clue.kind === "BETWEEN") return `${clue.kind}:${[clue.left, clue.right].sort().join(":")}:${clue.count}`;
  if (clue.kind === "BEFORE") return `${clue.kind}:${clue.left}:${clue.right}`;
  return `${clue.kind}:${[clue.left, clue.right].sort().join(":")}`;
}

function essential(clues: readonly CalendarClue[]): boolean {
  return clues.every((_, removed) => solveLp008({ clues: clues.filter((__, index) => index !== removed) }).length > 1);
}

function minimizeUnique(clues: readonly CalendarClue[]): CalendarClue[] {
  const result = [...clues];
  let changed = true;
  while (changed) {
    changed = false;
    for (let index = 0; index < result.length; index += 1) {
      const reduced = result.filter((_, candidateIndex) => candidateIndex !== index);
      if (solveLp008({ clues: reduced }).length === 1) {
        result.splice(index, 1);
        changed = true;
        break;
      }
    }
  }
  return result;
}

function directClue(person: CalendarPerson, assignment: CalendarAssignment, profile: Lp008Profile, random: () => number): CalendarClue {
  const slot = assignment[person];
  return { kind: "PERSON_SLOT", person, slot, text: fill(pick(profile.directTemplates, random), { person: profile.people[person], slot: formatSlot(profile, slot) }) };
}

function buildCandidates(assignment: CalendarAssignment, profile: Lp008Profile, random: () => number): CalendarClue[] {
  const candidates: CalendarClue[] = [];
  for (const person of PEOPLE) {
    candidates.push(directClue(person, assignment, profile, random));
    for (const month of [0, 1, 2, 3] as MonthId[]) if (month !== monthOf(assignment[person])) candidates.push({ kind: "NOT_MONTH", person, month, text: fill(pick(profile.notMonthTemplates, random), { person: profile.people[person], month: profile.months[month] }) });
  }
  for (let leftIndex = 0; leftIndex < PEOPLE.length; leftIndex += 1) for (let rightIndex = leftIndex + 1; rightIndex < PEOPLE.length; rightIndex += 1) {
    const left = PEOPLE[leftIndex]!;
    const right = PEOPLE[rightIndex]!;
    if (monthOf(assignment[left]) === monthOf(assignment[right])) candidates.push({ kind: "SAME_MONTH", left, right, text: fill(pick(profile.sameMonthTemplates, random), { left: profile.people[left], right: profile.people[right] }) });
    if (dateOf(assignment[left]) === dateOf(assignment[right])) candidates.push({ kind: "SAME_DATE", left, right, text: fill(pick(profile.sameDateTemplates, random), { left: profile.people[left], right: profile.people[right] }) });
    const first = assignment[left] < assignment[right] ? left : right;
    const second = first === left ? right : left;
    candidates.push({ kind: "BEFORE", left: first, right: second, text: fill(pick(profile.beforeTemplates, random), { left: profile.people[first], right: profile.people[second] }) });
    const count = Math.abs(assignment[left] - assignment[right]) - 1;
    if (count >= 1) candidates.push({ kind: "BETWEEN", left, right, count, text: fill(pick(profile.betweenTemplates, random), { left: profile.people[left], right: profile.people[right], count: String(count) }) });
  }
  return shuffle(candidates, random);
}

function chooseClues(assignment: CalendarAssignment, profile: Lp008Profile, difficultyBand: DifficultyBand, random: () => number): CalendarClue[] {
  const candidates = buildCandidates(assignment, profile, random);
  const quotas: Array<{ required: readonly CalendarClue["kind"][]; target: number }> = difficultyBand === "Easy"
    ? [{ required: ["PERSON_SLOT", "PERSON_SLOT", "PERSON_SLOT", "PERSON_SLOT", "PERSON_SLOT", "PERSON_SLOT", "PERSON_SLOT"], target: 7 }]
    : difficultyBand === "Medium"
      ? [
          { required: ["PERSON_SLOT", "SAME_MONTH"], target: 6 },
          { required: ["PERSON_SLOT", "SAME_DATE"], target: 6 },
          { required: ["PERSON_SLOT", "BEFORE"], target: 6 },
          { required: ["PERSON_SLOT", "BETWEEN"], target: 6 },
          { required: ["PERSON_SLOT", "NOT_MONTH"], target: 6 },
        ]
      : [
          { required: ["PERSON_SLOT", "BEFORE", "NOT_MONTH"], target: 10 },
          { required: ["PERSON_SLOT", "SAME_MONTH", "NOT_MONTH"], target: 10 },
          { required: ["PERSON_SLOT", "SAME_DATE", "NOT_MONTH"], target: 10 },
          { required: ["PERSON_SLOT", "BETWEEN", "NOT_MONTH"], target: 10 },
        ];

  for (const quota of shuffle(quotas, random)) {
    let survivors = [...ALL_ASSIGNMENTS];
    const chosen: CalendarClue[] = [];
    for (const kind of quota.required) {
      const possible = candidates
        .filter((candidate) => candidate.kind === kind && !chosen.some((clue) => clueKey(clue) === clueKey(candidate)))
        .map((candidate) => ({ candidate, remaining: survivors.filter((state) => satisfies(state, candidate)).length }))
        .filter((entry) => entry.remaining > 0 && entry.remaining < survivors.length)
        .sort((left, right) => left.remaining - right.remaining);
      const selected = possible.length ? possible[Math.floor(random() * possible.length)]!.candidate : undefined;
      if (!selected) {
        chosen.length = 0;
        break;
      }
      chosen.push(selected);
      survivors = survivors.filter((state) => satisfies(state, selected));
    }
    while (chosen.length < quota.target && survivors.length > 1) {
      const possible = candidates
        .filter((candidate) => !chosen.some((clue) => clueKey(clue) === clueKey(candidate)))
        .map((candidate) => ({ candidate, remaining: survivors.filter((state) => satisfies(state, candidate)).length }))
        .filter((entry) => entry.remaining > 0 && entry.remaining < survivors.length)
        .sort((left, right) => left.remaining - right.remaining);
      const selected = difficultyBand === "Hard" && possible.length
        ? possible[Math.floor(random() * Math.min(possible.length, 10))]!.candidate
        : possible[0]?.candidate;
      if (!selected) break;
      chosen.push(selected);
      survivors = survivors.filter((state) => satisfies(state, selected));
    }
    if (survivors.length === 1 && JSON.stringify(survivors[0]) === JSON.stringify(assignment)) {
      const reduced = minimizeUnique(chosen);
      if (JSON.stringify(solveLp008({ clues: reduced })[0]) === JSON.stringify(assignment) && quota.required.every((kind) => reduced.some((clue) => clue.kind === kind)) && essential(reduced) && (difficultyBand !== "Hard" || reduced.filter((clue) => clue.kind === "PERSON_SLOT").length <= 3)) return reduced;
    }
  }
  if (difficultyBand === "Hard") {
    const searchRandom = rng(`LP-008-search:${profile.id}:${Object.values(assignment).join(":")}`);
    for (let attempt = 0; attempt < 5000; attempt += 1) {
      const quota = quotas[attempt % quotas.length]!;
      let survivors = [...ALL_ASSIGNMENTS];
      const chosen: CalendarClue[] = [];
      for (const kind of quota.required) {
        const possible = candidates
          .filter((candidate) => candidate.kind === kind && !chosen.some((clue) => clueKey(clue) === clueKey(candidate)))
          .map((candidate) => ({ candidate, remaining: survivors.filter((state) => satisfies(state, candidate)).length }))
          .filter((entry) => entry.remaining > 0 && entry.remaining < survivors.length)
          .sort((left, right) => left.remaining - right.remaining);
        const selected = possible.length ? possible[Math.floor(searchRandom() * possible.length)]!.candidate : undefined;
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
        const selected = possible.length ? possible[Math.floor(searchRandom() * Math.min(possible.length, 10))]!.candidate : undefined;
        if (!selected) break;
        chosen.push(selected);
        survivors = survivors.filter((state) => satisfies(state, selected));
      }
      if (survivors.length === 1 && JSON.stringify(survivors[0]) === JSON.stringify(assignment)) {
        const reduced = minimizeUnique(chosen);
        if (JSON.stringify(solveLp008({ clues: reduced })[0]) === JSON.stringify(assignment) && quota.required.every((kind) => reduced.some((clue) => clue.kind === kind)) && essential(reduced) && reduced.filter((clue) => clue.kind === "PERSON_SLOT").length <= 3) return reduced;
      }
    }
  }
  throw new Error(`Unable to build an essential unique LP-008 calendar puzzle (${difficultyBand}).`);
}

type PartialTable = { slots: Partial<Record<CalendarPerson, SlotId>>; candidates: Partial<Record<CalendarPerson, readonly SlotId[]>> };
function emptyTable(): PartialTable { return { slots: {}, candidates: {} }; }
function copyTable(table: PartialTable): PartialTable { return { slots: { ...table.slots }, candidates: { ...table.candidates } }; }

function tableMarkdown(people: readonly CalendarPerson[], profile: Lp008Profile, table: PartialTable): string {
  const rows = people.map((person) => {
    const slot = table.slots[person];
    const candidates = table.candidates[person];
    const value = slot !== undefined ? formatSlot(profile, slot) : candidates ? candidates.map((candidate) => formatSlot(profile, candidate)).join(" / ") : "—";
    return `| ${profile.people[person]} | ${value} |`;
  }).join("\n");
  return `| Person | Date and month |\n|---|---|\n${rows}`;
}

function directTable(clues: readonly CalendarClue[]): PartialTable {
  const table = emptyTable();
  for (const clue of clues) if (clue.kind === "PERSON_SLOT") table.slots[clue.person] = clue.slot;
  return table;
}

function forcedTable(profile: Lp008Profile, solutions: readonly CalendarAssignment[], direct: PartialTable): PartialTable {
  const table = copyTable(direct);
  for (const person of PEOPLE) {
    if (table.slots[person] !== undefined) continue;
    const possible = [...new Set(solutions.map((solution) => solution[person]))] as SlotId[];
    if (possible.length === 1) table.slots[person] = possible[0]!;
    else table.candidates[person] = possible.sort((left, right) => left - right);
  }
  return table;
}

function buildExplanationEvidence(profile: Lp008Profile, difficultyBand: DifficultyBand, clues: readonly CalendarClue[]): string[] {
  const direct = directTable(clues);
  const lines: string[] = [];
  const add = (title: string, detail: string, table: PartialTable) => lines.push(`**${title}**\n\n${detail}\n\n${tableMarkdown(PEOPLE, profile, table)}`);
  add("Step 1: Enter the direct assignments", "Record every date stated directly in the clues. Leave the other entries blank.", direct);
  let active: CalendarClue[] = clues.filter((clue) => clue.kind === "PERSON_SLOT");
  let solutions = solveLp008({ clues: active });
  if (difficultyBand === "Easy") {
    const completed = forcedTable(profile, solutions, direct);
    add("Step 2: Complete the remaining dates", "Seven dates are already fixed. The only unused date must belong to the remaining person.", completed);
    return lines;
  }
  let step = 2;
  for (const clue of clues.filter((candidate) => candidate.kind !== "PERSON_SLOT")) {
    const before = solutions.length;
    active = [...active, clue];
    solutions = solveLp008({ clues: active });
    const table = forcedTable(profile, solutions, direct);
    add(`Step ${step}: Apply the next clue`, `${clue.text} This reduces the number of possible arrangements from ${before} to ${solutions.length}.`, table);
    step += 1;
    if (solutions.length === 1) break;
  }
  if (solutions.length !== 1) {
    const completed = forcedTable(profile, solveLp008({ clues }), direct);
    add(`Step ${step}: Finish by one-to-one elimination`, "Only one complete arrangement satisfies all the displayed clues.", completed);
  }
  return lines;
}

function balance(options: readonly string[], answer: string, desired: number, random: () => number): string[] {
  const rest = shuffle(options.filter((option) => option !== answer), random);
  const result: string[] = [];
  for (let index = 0; index < 4; index += 1) result[index] = index === desired ? answer : rest.shift()!;
  return result;
}

function makeChildren(caseletId: string, index: number, assignment: CalendarAssignment, profile: Lp008Profile, difficultyBand: DifficultyBand, clues: readonly CalendarClue[], random: () => number): Lp008Child[] {
  const target = PEOPLE[(index + 1) % PEOPLE.length]!;
  const reverseSlot = SLOTS[(index + 3) % SLOTS.length]!;
  const pairPeople = [PEOPLE[index % PEOPLE.length]!, PEOPLE[(index + 2) % PEOPLE.length]!];
  const triplePeople = [PEOPLE[index % PEOPLE.length]!, PEOPLE[(index + 1) % PEOPLE.length]!, PEOPLE[(index + 4) % PEOPLE.length]!];
  const setup = `${buildQuestionSetup(profile)}\n\nClues:\n${clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n`;
  const evidence = buildExplanationEvidence(profile, difficultyBand, clues);
  const explain = (summary: string, finalStep: string) => ({ summary, lines: [...evidence, `**Answer:** ${finalStep}`] });

  const slotAnswer = formatSlot(profile, assignment[target]);
  const slotOptions = balance(SLOTS.map((slot) => formatSlot(profile, slot)), slotAnswer, index % 4, random);
  const personForSlot = PEOPLE.find((person) => assignment[person] === reverseSlot)!;
  const personAnswer = profile.people[personForSlot];
  const personOptions = balance(PEOPLE.map((person) => profile.people[person]), personAnswer, (index + 1) % 4, random);

  const pairAnswer = `${profile.people[pairPeople[0]]} — ${formatSlot(profile, assignment[pairPeople[0]])}; ${profile.people[pairPeople[1]]} — ${formatSlot(profile, assignment[pairPeople[1]])}`;
  const pairDistractors = [
    `${profile.people[pairPeople[0]]} — ${formatSlot(profile, assignment[pairPeople[1]])}; ${profile.people[pairPeople[1]]} — ${formatSlot(profile, assignment[pairPeople[0]])}`,
    `${profile.people[pairPeople[0]]} — ${formatSlot(profile, assignment[triplePeople[0]])}; ${profile.people[pairPeople[1]]} — ${formatSlot(profile, assignment[triplePeople[1]])}`,
    `${profile.people[pairPeople[0]]} — ${formatSlot(profile, assignment[triplePeople[1]])}; ${profile.people[pairPeople[1]]} — ${formatSlot(profile, assignment[triplePeople[2]])}`,
  ];
  const tripleAnswer = triplePeople.map((person) => `${profile.people[person]} — ${formatSlot(profile, assignment[person])}`).join("; ");
  const tripleDistractors = [
    `${profile.people[triplePeople[0]]} — ${formatSlot(profile, assignment[triplePeople[1]])}; ${profile.people[triplePeople[1]]} — ${formatSlot(profile, assignment[triplePeople[0]])}; ${profile.people[triplePeople[2]]} — ${formatSlot(profile, assignment[triplePeople[2]])}`,
    `${profile.people[triplePeople[0]]} — ${formatSlot(profile, assignment[triplePeople[2]])}; ${profile.people[triplePeople[1]]} — ${formatSlot(profile, assignment[triplePeople[1]])}; ${profile.people[triplePeople[2]]} — ${formatSlot(profile, assignment[triplePeople[0]])}`,
    `${profile.people[triplePeople[0]]} — ${formatSlot(profile, assignment[triplePeople[0]])}; ${profile.people[triplePeople[1]]} — ${formatSlot(profile, assignment[triplePeople[2]])}; ${profile.people[triplePeople[2]]} — ${formatSlot(profile, assignment[triplePeople[1]])}`,
  ];
  const pairOptions = balance([pairAnswer, ...pairDistractors], pairAnswer, (index + 2) % 4, random);
  const tripleOptions = balance([tripleAnswer, ...tripleDistractors], tripleAnswer, (index + 3) % 4, random);

  return [
    { questionId: `${caseletId}-Q1`, qlId: "LP-QL-029", stem: `${setup}${fill(profile.slotQuestionTemplate, { slot: formatSlot(profile, reverseSlot) })}`, options: personOptions, correctIndex: personOptions.indexOf(personAnswer), answer: personAnswer, difficultyBand, misconceptionFamily: "DATE_PERSON_REVERSED", explanation: explain(`${personAnswer} has the event on ${formatSlot(profile, reverseSlot)}.`, `${personAnswer}'s row shows ${formatSlot(profile, reverseSlot)}.`) },
    { questionId: `${caseletId}-Q2`, qlId: "LP-QL-030", stem: `${setup}${fill(profile.personQuestionTemplate, { person: profile.people[target] })}`, options: slotOptions, correctIndex: slotOptions.indexOf(slotAnswer), answer: slotAnswer, difficultyBand, misconceptionFamily: "MONTH_DATE_MIXUP", explanation: explain(`${profile.people[target]}'s event is on ${slotAnswer}.`, `${profile.people[target]}'s row shows ${slotAnswer}.`) },
    { questionId: `${caseletId}-Q3`, qlId: "LP-QL-031", stem: `${setup}Which of the following correctly matches ${profile.people[pairPeople[0]]} and ${profile.people[pairPeople[1]]}, respectively?`, options: pairOptions, correctIndex: pairOptions.indexOf(pairAnswer), answer: pairAnswer, difficultyBand, misconceptionFamily: "SWAPPED_DATE_MONTH_PAIR", explanation: explain(`The two-person date match is ${pairAnswer}.`, `The completed table gives ${pairAnswer}.`) },
    { questionId: `${caseletId}-Q4`, qlId: "LP-QL-032", stem: `${setup}Which of the following correctly matches the three named ${profile.personNoun}s?`, options: tripleOptions, correctIndex: tripleOptions.indexOf(tripleAnswer), answer: tripleAnswer, difficultyBand, misconceptionFamily: "CROSS_PERSON_DATE_MIX", explanation: explain(`The three-person date match is ${tripleAnswer}.`, `The completed table gives ${tripleAnswer}.`) },
  ];
}

export function generateLp008Caselet(seed: string, index: number): Lp008Caselet {
  const random = rng(`${seed}:${index}`);
  const template = PROFILES[(hashSeed(`${seed}:profile:${index}`) + index) % PROFILES.length]!;
  const profile = materializeProfile(template, random);
  const assignmentOrder = shuffle(SLOTS, random);
  const assignment: CalendarAssignment = { A: assignmentOrder[0]!, B: assignmentOrder[1]!, C: assignmentOrder[2]!, D: assignmentOrder[3]!, E: assignmentOrder[4]!, F: assignmentOrder[5]!, G: assignmentOrder[6]!, H: assignmentOrder[7]! };
  const difficultyBand: DifficultyBand = index % 3 === 0 ? "Easy" : index % 3 === 1 ? "Medium" : "Hard";
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const clues = chooseClues(assignment, profile, difficultyBand, random);
    const solutions = solveLp008({ clues });
    if (solutions.length === 1 && JSON.stringify(solutions[0]) === JSON.stringify(assignment) && essential(clues)) {
      const caseletId = `LP-008-${String(index + 1).padStart(3, "0")}`;
      return { caseletId, scenario: profile.scenario, questionSetup: buildQuestionSetup(profile), scenarioProfileId: profile.id, difficultyBand, people: PEOPLE, months: [0, 1, 2, 3], slots: SLOTS, labels: profile, clues, assignment, children: makeChildren(caseletId, index, assignment, profile, difficultyBand, clues, random) };
    }
  }
  throw new Error(`Unable to build an essential unique LP-008 calendar puzzle for seed ${seed}.`);
}

export function generateLp008Batch(seed = "lp-008-review", count = 8): Lp008Caselet[] {
  return Array.from({ length: count }, (_, index) => generateLp008Caselet(seed, index));
}

export const LP_008_REVIEW_PACKAGE = Object.freeze({ packageId: "LP-008", label: "Logic Puzzles — Month and Date Scheduling", checkpointId: "LP-CP-008", qlIds: ["LP-QL-029", "LP-QL-030", "LP-QL-031", "LP-QL-032"], supportedDifficulties: ["Easy", "Medium", "Hard"], supportedLanguages: ["en"], runtimeMode: "REVIEW_ONLY", reviewOnly: true });
