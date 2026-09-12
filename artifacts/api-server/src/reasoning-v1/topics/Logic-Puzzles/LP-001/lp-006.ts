import type { DifficultyBand } from "./index.ts";
import { STANDARD_EXAM_CITY_POOL, type StandardExamCity } from "./standard-pools.ts";

export type SynthPerson = "A" | "B" | "C" | "D";
export type SynthDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday";
export type SynthSubject = "A" | "B" | "C" | "D";
export type SynthCity = "A" | "B" | "C" | "D";
export type SynthAssignment = { dayByPerson: Record<SynthPerson, SynthDay>; subjectByPerson: Record<SynthPerson, SynthSubject>; cityByPerson: Record<SynthPerson, SynthCity> };
export type SynthClue =
  | { kind: "PERSON_DAY"; person: SynthPerson; day: SynthDay; text: string }
  | { kind: "PERSON_SUBJECT"; person: SynthPerson; subject: SynthSubject; text: string }
  | { kind: "PERSON_CITY"; person: SynthPerson; city: SynthCity; text: string }
  | { kind: "DAY_BEFORE"; first: SynthPerson; second: SynthPerson; text: string }
  | { kind: "SUBJECT_CITY"; subject: SynthSubject; city: SynthCity; text: string }
  | { kind: "NOT_SUBJECT_CITY"; subject: SynthSubject; city: SynthCity; text: string };

export type Lp006Profile = {
  id: string;
  scenario: string;
  people: Record<SynthPerson, string>;
  subjects: Record<SynthSubject, string>;
  cities: Record<SynthCity, StandardExamCity>;
};

type Lp006ProfileTemplate = {
  id: string;
  scenario: string;
  peoplePool: readonly string[];
  studyAreaPool: readonly string[];
};

export type Lp006Child = {
  questionId: string;
  qlId: "LP-QL-021" | "LP-QL-022" | "LP-QL-023" | "LP-QL-024";
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  difficultyBand: DifficultyBand;
  misconceptionFamily: string;
  explanation: { summary: string; lines: string[] };
};

export type Lp006Caselet = {
  caseletId: string;
  scenario: string;
  questionSetup: string;
  scenarioProfileId: string;
  difficultyBand: DifficultyBand;
  people: readonly SynthPerson[];
  days: readonly SynthDay[];
  subjects: readonly SynthSubject[];
  cities: readonly SynthCity[];
  labels: Lp006Profile;
  clues: readonly SynthClue[];
  assignment: SynthAssignment;
  children: readonly Lp006Child[];
};

const PEOPLE: readonly SynthPerson[] = ["A", "B", "C", "D"];
const DAYS: readonly SynthDay[] = ["Monday", "Tuesday", "Wednesday", "Thursday"];
const SUBJECTS: readonly SynthSubject[] = ["A", "B", "C", "D"];
const CITIES: readonly SynthCity[] = ["A", "B", "C", "D"];
const PROFILES: readonly Lp006ProfileTemplate[] = [
  { id: "EXAMINATION_BOARD", scenario: "An examination board is scheduling four candidates for interviews.", peoplePool: ["Aarav", "Bhavna", "Chetan", "Diya", "Eshan", "Kavya", "Manav", "Neha", "Ritu", "Varun"], studyAreaPool: ["Mathematics", "Reasoning", "English", "General Awareness", "Computer Awareness", "Quantitative Aptitude", "Science", "Current Affairs"] },
  { id: "TEACHER_TRAINING", scenario: "A training board is scheduling four teachers for a workshop.", peoplePool: ["Anita", "Bharat", "Charu", "Dev", "Farah", "Gaurav", "Meena", "Pooja", "Rakesh", "Sneha"], studyAreaPool: ["Lesson Planning", "Assessment", "Classroom Management", "Educational Technology", "Child Development", "Inclusive Education", "Language Teaching", "School Leadership"] },
  { id: "BANK_AUDIT", scenario: "A bank is scheduling four officers for a review meeting.", peoplePool: ["Kamal", "Lata", "Mohit", "Nisha", "Omkar", "Priya", "Rahul", "Simran", "Tarun", "Zoya"], studyAreaPool: ["Accounts", "Loans", "Customer Service", "Risk Review", "Cash Management", "Compliance", "Credit Review", "Digital Banking"] },
  { id: "HEALTH_PROGRAMME", scenario: "A health department is scheduling four doctors for a training programme.", peoplePool: ["Asha", "Bikram", "Deepak", "Esha", "Harish", "Jyoti", "Kiran", "Mona", "Naveen", "Reema"], studyAreaPool: ["Nutrition", "Child Care", "First Aid", "Public Health", "Immunisation", "Maternal Health", "Sanitation", "Health Education"] },
  { id: "RESEARCH_REVIEW", scenario: "A university is scheduling four researchers for a field review.", peoplePool: ["Ishan", "Meera", "Nakul", "Pallavi", "Aditya", "Geeta", "Kabir", "Nandini", "Rohan", "Tanvi"], studyAreaPool: ["Water", "Soil", "Agriculture", "Environment", "Climate", "Forests", "Geology", "Public Policy"] },
  { id: "RAILWAY_INSPECTION", scenario: "A railway board is scheduling four inspectors for a safety review.", peoplePool: ["Amit", "Bharat", "Farah", "Harsh", "Jatin", "Komal", "Lokesh", "Namita", "Pranav", "Sanya"], studyAreaPool: ["Signals", "Track", "Brakes", "Safety Rules", "Electrical Systems", "Operations", "Maintenance", "Communication"] },
];

const DAY_TEMPLATES = ["{person} is assigned to {day}.", "The day assigned to {person} is {day}."];
const SUBJECT_TEMPLATES = ["{person} is assigned to {subject}.", "The study area assigned to {person} is {subject}."];
const CITY_TEMPLATES = ["{person} is assigned to {city}.", "{person} is scheduled in {city}."];
const BEFORE_TEMPLATES = ["{first} is scheduled before {second}.", "The day assigned to {first} comes before the day assigned to {second}."];
const SUBJECT_CITY_TEMPLATES = ["The person assigned to the study area {subject} is in {city}.", "The study area {subject} is assigned to {city}."];
const NOT_SUBJECT_CITY_TEMPLATES = ["The person assigned to the study area {subject} is not in {city}.", "The study area {subject} is not assigned to {city}."];

function hashSeed(value: string): number { let hash = 2166136261; for (const char of value) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); } return hash >>> 0; }
function rng(seed: string) { let state = hashSeed(seed) || 1; return () => { state = Math.imul(state ^ (state >>> 15), 2246822519) >>> 0; state = Math.imul(state ^ (state >>> 13), 3266489917) >>> 0; return ((state ^ (state >>> 16)) >>> 0) / 4294967296; }; }
function shuffle<T>(items: readonly T[], random: () => number): T[] { const result = [...items]; for (let index = result.length - 1; index > 0; index -= 1) { const swap = Math.floor(random() * (index + 1)); [result[index], result[swap]] = [result[swap]!, result[index]!]; } return result; }
function permutations<T>(items: readonly T[]): T[][] { if (items.length <= 1) return [Array.from(items)]; const result: T[][] = []; items.forEach((item, index) => { for (const tail of permutations([...items.slice(0, index), ...items.slice(index + 1)])) result.push([item, ...tail]); }); return result; }
function fill(template: string, values: Record<string, string>): string { return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? key); }
function pick<T extends readonly string[]>(items: T, random: () => number): string { return items[Math.floor(random() * items.length)]!; }
function dayIndex(day: SynthDay): number { return DAYS.indexOf(day); }
function subjectFor(assignment: SynthAssignment, subject: SynthSubject): SynthPerson { return PEOPLE.find((person) => assignment.subjectByPerson[person] === subject)!; }
function examList(values: readonly string[]): string { return values.length <= 1 ? values.join("") : `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`; }

function buildQuestionSetup(profile: Lp006Profile): string {
  const people = examList(PEOPLE.map((person) => profile.people[person]));
  const days = examList(DAYS);
  const subjects = examList(SUBJECTS.map((subject) => profile.subjects[subject]));
  const cities = examList(CITIES.map((city) => profile.cities[city]));
  return `${profile.scenario} Four persons—${people}—are assigned one each to the four days (${days}), one each to the four study areas (${subjects}), and one each to the four cities (${cities}). Each day, study area and city is used exactly once.`;
}

function materializeProfile(template: Lp006ProfileTemplate, random: () => number): Lp006Profile {
  const people = shuffle(template.peoplePool, random).slice(0, 4);
  const subjects = shuffle(template.studyAreaPool, random).slice(0, 4);
  const cities = shuffle(STANDARD_EXAM_CITY_POOL, random).slice(0, 4);
  return {
    id: template.id,
    scenario: template.scenario,
    people: { A: people[0]!, B: people[1]!, C: people[2]!, D: people[3]! },
    subjects: { A: subjects[0]!, B: subjects[1]!, C: subjects[2]!, D: subjects[3]! },
    cities: { A: cities[0]!, B: cities[1]!, C: cities[2]!, D: cities[3]! },
  };
}

function enumerateAssignments(people: readonly SynthPerson[]): SynthAssignment[] {
  const result: SynthAssignment[] = [];
  for (const dayOrder of permutations(DAYS)) for (const subjectOrder of permutations(SUBJECTS)) for (const cityOrder of permutations(CITIES)) {
    const dayByPerson = {} as Record<SynthPerson, SynthDay>; const subjectByPerson = {} as Record<SynthPerson, SynthSubject>; const cityByPerson = {} as Record<SynthPerson, SynthCity>;
    people.forEach((person, index) => { dayByPerson[person] = dayOrder[index]!; subjectByPerson[person] = subjectOrder[index]!; cityByPerson[person] = cityOrder[index]!; });
    result.push({ dayByPerson, subjectByPerson, cityByPerson });
  }
  return result;
}

function satisfies(assignment: SynthAssignment, clue: SynthClue): boolean {
  if (clue.kind === "PERSON_DAY") return assignment.dayByPerson[clue.person] === clue.day;
  if (clue.kind === "PERSON_SUBJECT") return assignment.subjectByPerson[clue.person] === clue.subject;
  if (clue.kind === "PERSON_CITY") return assignment.cityByPerson[clue.person] === clue.city;
  if (clue.kind === "DAY_BEFORE") return dayIndex(assignment.dayByPerson[clue.first]) < dayIndex(assignment.dayByPerson[clue.second]);
  const person = subjectFor(assignment, clue.subject);
  return clue.kind === "SUBJECT_CITY" ? assignment.cityByPerson[person] === clue.city : assignment.cityByPerson[person] !== clue.city;
}

function personDayClue(person: SynthPerson, hidden: SynthAssignment, profile: Lp006Profile, random: () => number): SynthClue { return { kind: "PERSON_DAY", person, day: hidden.dayByPerson[person], text: fill(pick(DAY_TEMPLATES, random), { person: profile.people[person], day: hidden.dayByPerson[person] }) }; }
function personSubjectClue(person: SynthPerson, hidden: SynthAssignment, profile: Lp006Profile, random: () => number): SynthClue { return { kind: "PERSON_SUBJECT", person, subject: hidden.subjectByPerson[person], text: fill(pick(SUBJECT_TEMPLATES, random), { person: profile.people[person], subject: profile.subjects[hidden.subjectByPerson[person]] }) }; }
function personCityClue(person: SynthPerson, hidden: SynthAssignment, profile: Lp006Profile, random: () => number): SynthClue { return { kind: "PERSON_CITY", person, city: hidden.cityByPerson[person], text: fill(pick(CITY_TEMPLATES, random), { person: profile.people[person], city: profile.cities[hidden.cityByPerson[person]] }) }; }
function beforeClue(first: SynthPerson, second: SynthPerson, profile: Lp006Profile, random: () => number): SynthClue { return { kind: "DAY_BEFORE", first, second, text: fill(pick(BEFORE_TEMPLATES, random), { first: profile.people[first], second: profile.people[second] }) }; }
function subjectCityClue(subject: SynthSubject, city: SynthCity, profile: Lp006Profile, random: () => number): SynthClue { return { kind: "SUBJECT_CITY", subject, city, text: fill(pick(SUBJECT_CITY_TEMPLATES, random), { subject: profile.subjects[subject], city: profile.cities[city] }) }; }
function notSubjectCityClue(subject: SynthSubject, city: SynthCity, profile: Lp006Profile, random: () => number): SynthClue { return { kind: "NOT_SUBJECT_CITY", subject, city, text: fill(pick(NOT_SUBJECT_CITY_TEMPLATES, random), { subject: profile.subjects[subject], city: profile.cities[city] }) }; }

function buildEasyClues(people: readonly SynthPerson[], hidden: SynthAssignment, profile: Lp006Profile, random: () => number): SynthClue[] {
  const order = shuffle(people, random);
  return [...order.slice(0, 3).map((person) => personDayClue(person, hidden, profile, random)), ...order.slice(0, 3).map((person) => personSubjectClue(person, hidden, profile, random)), ...order.slice(0, 3).map((person) => personCityClue(person, hidden, profile, random))];
}

function buildMediumClues(people: readonly SynthPerson[], hidden: SynthAssignment, profile: Lp006Profile, random: () => number): SynthClue[] {
  const order = shuffle(people, random); const dayUnknown = order.slice(0, 2); const dayKnown = order.slice(2); const cityRelationPerson = order[0]!; const cityOtherUnknown = order[1]!; const cityKnown = order.slice(2);
  const result: SynthClue[] = [];
  for (const person of dayKnown) result.push(personDayClue(person, hidden, profile, random));
  const first = dayIndex(hidden.dayByPerson[dayUnknown[0]!]) < dayIndex(hidden.dayByPerson[dayUnknown[1]!]) ? dayUnknown[0]! : dayUnknown[1]!;
  const second = first === dayUnknown[0] ? dayUnknown[1]! : dayUnknown[0]!;
  result.push(beforeClue(first, second, profile, random));
  for (const person of people.filter((candidate) => candidate !== cityOtherUnknown)) result.push(personSubjectClue(person, hidden, profile, random));
  result.push(personCityClue(cityKnown[0]!, hidden, profile, random), personCityClue(cityKnown[1]!, hidden, profile, random));
  result.push(notSubjectCityClue(hidden.subjectByPerson[cityOtherUnknown], hidden.cityByPerson[cityRelationPerson], profile, random));
  return result;
}

function buildHardClues(people: readonly SynthPerson[], hidden: SynthAssignment, profile: Lp006Profile, random: () => number): SynthClue[] {
  const order = shuffle(people, random); const dayUnknown = order.slice(0, 2); const dayKnown = order.slice(2); const cityDirectPerson = order[2]!; const negativeLinkPerson = order[1]!; const positiveLinkPerson = order[3]!;
  const first = dayIndex(hidden.dayByPerson[dayUnknown[0]!]) < dayIndex(hidden.dayByPerson[dayUnknown[1]!]) ? dayUnknown[0]! : dayUnknown[1]!;
  const second = first === dayUnknown[0] ? dayUnknown[1]! : dayUnknown[0]!;
  return [
    ...dayKnown.map((person) => personDayClue(person, hidden, profile, random)),
    beforeClue(first, second, profile, random),
    ...[order[0]!, order[2]!, order[3]!].map((person) => personSubjectClue(person, hidden, profile, random)),
    personCityClue(cityDirectPerson, hidden, profile, random),
    notSubjectCityClue(hidden.subjectByPerson[negativeLinkPerson], hidden.cityByPerson[order[0]!], profile, random),
    subjectCityClue(hidden.subjectByPerson[positiveLinkPerson], hidden.cityByPerson[positiveLinkPerson], profile, random),
  ];
}

export function solveLp006(input: { people: readonly SynthPerson[]; clues: readonly SynthClue[] }): SynthAssignment[] {
  return enumerateAssignments(input.people).filter((assignment) => input.clues.every((clue) => satisfies(assignment, clue)));
}

function essential(people: readonly SynthPerson[], clues: readonly SynthClue[]): boolean { return clues.every((_, removed) => solveLp006({ people, clues: clues.filter((__, index) => index !== removed) }).length > 1); }
function balance(options: readonly string[], answer: string, desired: number, random: () => number): string[] { const rest = shuffle(options.filter((option) => option !== answer), random); const result: string[] = []; for (let index = 0; index < 4; index += 1) result[index] = index === desired ? answer : rest.shift()!; return result; }
type PartialTable = {
  dayByPerson: Partial<Record<SynthPerson, SynthDay>>;
  subjectByPerson: Partial<Record<SynthPerson, SynthSubject>>;
  cityByPerson: Partial<Record<SynthPerson, SynthCity>>;
};

function emptyTable(): PartialTable { return { dayByPerson: {}, subjectByPerson: {}, cityByPerson: {} }; }
function copyTable(table: PartialTable): PartialTable { return { dayByPerson: { ...table.dayByPerson }, subjectByPerson: { ...table.subjectByPerson }, cityByPerson: { ...table.cityByPerson } }; }
function directTable(clues: readonly SynthClue[]): PartialTable {
  const table = emptyTable();
  for (const clue of clues) {
    if (clue.kind === "PERSON_DAY") table.dayByPerson[clue.person] = clue.day;
    if (clue.kind === "PERSON_SUBJECT") table.subjectByPerson[clue.person] = clue.subject;
    if (clue.kind === "PERSON_CITY") table.cityByPerson[clue.person] = clue.city;
  }
  return table;
}
function tableMarkdown(people: readonly SynthPerson[], profile: Lp006Profile, table: PartialTable): string {
  const rows = people.map((person) => {
    const subject = table.subjectByPerson[person];
    const city = table.cityByPerson[person];
    return `| ${profile.people[person]} | ${table.dayByPerson[person] ?? "—"} | ${subject ? profile.subjects[subject] : "—"} | ${city ? profile.cities[city] : "—"} |`;
  }).join("\n");
  return `| Person | Day | Study area | City |\n|---|---|---|---|\n${rows}`;
}
function clueOfKind<T extends SynthClue["kind"]>(clues: readonly SynthClue[], kind: T): Extract<SynthClue, { kind: T }> | undefined {
  return clues.find((clue): clue is Extract<SynthClue, { kind: T }> => clue.kind === kind);
}
function names(profile: Lp006Profile, people: readonly SynthPerson[]): string { return people.map((person) => profile.people[person]).join(" and "); }
function remaining<T extends string>(values: readonly T[], used: Iterable<T>): T[] { const usedSet = new Set(used); return values.filter((value) => !usedSet.has(value)); }

function buildExplanationEvidence(people: readonly SynthPerson[], assignment: SynthAssignment, profile: Lp006Profile, difficultyBand: DifficultyBand, clues: readonly SynthClue[]): string[] {
  const direct = directTable(clues);
  const lines: string[] = [];
  const add = (title: string, detail: string, table: PartialTable) => lines.push(`**${title}**\n\n${detail}\n\n${tableMarkdown(people, profile, table)}`);

  if (difficultyBand === "Easy") {
    const lastPerson = people.find((person) => !direct.dayByPerson[person])!;
    const completed = copyTable(direct);
    completed.dayByPerson[lastPerson] = assignment.dayByPerson[lastPerson];
    completed.subjectByPerson[lastPerson] = assignment.subjectByPerson[lastPerson];
    completed.cityByPerson[lastPerson] = assignment.cityByPerson[lastPerson];
    add("Step 1: Enter the direct assignments", "The clues directly fill three rows. The fourth row is still blank.", direct);
    add("Step 2: Use the one-to-one rule", `The only person without entries is ${profile.people[lastPerson]}. The unused day is ${assignment.dayByPerson[lastPerson]}, the unused study area is ${profile.subjects[assignment.subjectByPerson[lastPerson]]}, and the unused city is ${profile.cities[assignment.cityByPerson[lastPerson]]}.`, completed);
    return lines;
  }

  const before = clueOfKind(clues, "DAY_BEFORE")!;
  const ordered = copyTable(direct);
  ordered.dayByPerson[before.first] = assignment.dayByPerson[before.first];
  ordered.dayByPerson[before.second] = assignment.dayByPerson[before.second];
  const unusedDays = remaining(DAYS, Object.values(direct.dayByPerson));
  add("Step 1: Enter the direct assignments", "Record every day, study-area and city stated directly in the clues. Leave the unconfirmed cells blank.", direct);
  add("Step 2: Place the two remaining days", `The remaining days are ${unusedDays.join(" and ")}. The clue says ${profile.people[before.first]} is before ${profile.people[before.second]}; therefore ${profile.people[before.first]} takes ${assignment.dayByPerson[before.first]} and ${profile.people[before.second]} takes ${assignment.dayByPerson[before.second]}.`, ordered);

  const subjectMissingPerson = people.find((person) => !direct.subjectByPerson[person])!;
  const subjectsFilled = copyTable(ordered);
  subjectsFilled.subjectByPerson[subjectMissingPerson] = assignment.subjectByPerson[subjectMissingPerson];
  const unusedSubjects = remaining(SUBJECTS, Object.values(direct.subjectByPerson));
  const subjectDetail = `Three study areas are already placed. The unused study area is ${profile.subjects[unusedSubjects[0]!]}; it must be assigned to ${profile.people[subjectMissingPerson]}.`;

  if (difficultyBand === "Medium") {
    add("Step 3: Complete the study-area column", subjectDetail, subjectsFilled);
    const negative = clueOfKind(clues, "NOT_SUBJECT_CITY")!;
    const completed = copyTable(subjectsFilled);
    const unusedCities = remaining(CITIES, Object.values(direct.cityByPerson));
    const otherCity = unusedCities.find((city) => city !== negative.city)!;
    const negativePerson = subjectFor(assignment, negative.subject);
    const otherPerson = people.find((person) => person !== negativePerson && !direct.cityByPerson[person])!;
    completed.cityByPerson[negativePerson] = otherCity;
    completed.cityByPerson[otherPerson] = negative.city;
    add("Step 4: Apply the exclusion clue", `The person assigned to ${profile.subjects[negative.subject]} is ${profile.people[negativePerson]}. That person is not in ${profile.cities[negative.city]}. Of the two unused cities, ${profile.cities[otherCity]} is the only possible city, so ${profile.people[negativePerson]} takes it. The remaining city, ${profile.cities[negative.city]}, goes to ${profile.people[otherPerson]}.`, completed);
    return lines;
  }

  const positive = clueOfKind(clues, "SUBJECT_CITY")!;
  const positivePerson = subjectFor(assignment, positive.subject);
  const linked = copyTable(subjectsFilled);
  linked.cityByPerson[positivePerson] = positive.city;
  add("Step 3: Complete the study-area column and use the positive link", `${subjectDetail} The person assigned to ${profile.subjects[positive.subject]} is ${profile.people[positivePerson]}, and the clue places that study area in ${profile.cities[positive.city]}.`, linked);
  const negative = clueOfKind(clues, "NOT_SUBJECT_CITY")!;
  const completed = copyTable(linked);
  const negativePerson = subjectFor(assignment, negative.subject);
  const remainingPeople = people.filter((person) => !completed.cityByPerson[person]);
  const remainingCities = remaining(CITIES, Object.values(completed.cityByPerson));
  const otherCity = remainingCities.find((city) => city !== negative.city)!;
  completed.cityByPerson[negativePerson] = otherCity;
  const lastCityPerson = remainingPeople.find((person) => person !== negativePerson)!;
  completed.cityByPerson[lastCityPerson] = negative.city;
  add("Step 4: Apply the negative link and finish the city column", `The person assigned to ${profile.subjects[negative.subject]} is ${profile.people[negativePerson]}. That person cannot be in ${profile.cities[negative.city]}, so ${profile.people[negativePerson]} takes ${profile.cities[otherCity]}. The remaining city, ${profile.cities[negative.city]}, belongs to ${profile.people[lastCityPerson]}.`, completed);
  return lines;
}

function makeChildren(caseletId: string, index: number, people: readonly SynthPerson[], assignment: SynthAssignment, profile: Lp006Profile, difficultyBand: DifficultyBand, clues: readonly SynthClue[], random: () => number): Lp006Child[] {
  const target = people[(index + 1) % people.length]!; const dayAnswer = assignment.dayByPerson[target]; const subjectAnswer = profile.subjects[assignment.subjectByPerson[target]]; const cityAnswer = profile.cities[assignment.cityByPerson[target]];
  const questionPrefix = `${buildQuestionSetup(profile)}\n\nClues:\n${clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n`;
  const completeAnswer = `${profile.people[target]} — ${dayAnswer} — ${subjectAnswer} — ${cityAnswer}`;
  const dayOptions = balance([dayAnswer, ...shuffle(DAYS.filter((day) => day !== dayAnswer), random).slice(0, 3)], dayAnswer, index % 4, random);
  const subjectOptions = balance([subjectAnswer, ...shuffle(SUBJECTS.filter((subject) => subject !== assignment.subjectByPerson[target]), random).slice(0, 3).map((subject) => profile.subjects[subject])], subjectAnswer, (index + 1) % 4, random);
  const cityOptions = balance([cityAnswer, ...shuffle(CITIES.filter((city) => city !== assignment.cityByPerson[target]), random).slice(0, 3).map((city) => profile.cities[city])], cityAnswer, (index + 2) % 4, random);
  const completeOptions = balance([completeAnswer, ...shuffle(people.filter((person) => person !== target), random).slice(0, 3).map((person) => `${profile.people[person]} — ${assignment.dayByPerson[person]} — ${profile.subjects[assignment.subjectByPerson[person]]} — ${profile.cities[assignment.cityByPerson[person]]}`)], completeAnswer, (index + 3) % 4, random);
  const evidence = buildExplanationEvidence(people, assignment, profile, difficultyBand, clues);
  const explain = (summary: string, finalStep: string) => ({ summary, lines: [...evidence, `**Answer:** ${finalStep}`] });
  return [
    { questionId: `${caseletId}-Q1`, qlId: "LP-QL-021", stem: `${questionPrefix}Which day is assigned to ${profile.people[target]}?`, options: dayOptions, correctIndex: dayOptions.indexOf(dayAnswer), answer: dayAnswer, difficultyBand, misconceptionFamily: "DAY_PERSON_MIXUP", explanation: explain(`${profile.people[target]} is assigned to ${dayAnswer}.`, `${profile.people[target]}'s row shows ${dayAnswer} in the Day column.`) },
    { questionId: `${caseletId}-Q2`, qlId: "LP-QL-022", stem: `${questionPrefix}Which study area is assigned to ${profile.people[target]}?`, options: subjectOptions, correctIndex: subjectOptions.indexOf(subjectAnswer), answer: subjectAnswer, difficultyBand, misconceptionFamily: "SUBJECT_PERSON_MIXUP", explanation: explain(`${profile.people[target]} is assigned to ${subjectAnswer}.`, `${profile.people[target]}'s row shows ${subjectAnswer} in the Study area column.`) },
    { questionId: `${caseletId}-Q3`, qlId: "LP-QL-023", stem: `${questionPrefix}Which city is assigned to ${profile.people[target]}?`, options: cityOptions, correctIndex: cityOptions.indexOf(cityAnswer), answer: cityAnswer, difficultyBand, misconceptionFamily: "CITY_PERSON_MIXUP", explanation: explain(`${profile.people[target]} is assigned to ${cityAnswer}.`, `${profile.people[target]}'s row shows ${cityAnswer} in the City column.`) },
    { questionId: `${caseletId}-Q4`, qlId: "LP-QL-024", stem: `${questionPrefix}Which of the following correctly matches ${profile.people[target]}?`, options: completeOptions, correctIndex: completeOptions.indexOf(completeAnswer), answer: completeAnswer, difficultyBand, misconceptionFamily: "CROSS_ROW_ATTRIBUTE_MIX", explanation: explain(`${profile.people[target]} is assigned to ${dayAnswer}, ${subjectAnswer} and ${cityAnswer}.`, `The completed row for ${profile.people[target]} gives ${dayAnswer}, ${subjectAnswer} and ${cityAnswer}.`) },
  ];
}

export function generateLp006Caselet(seed: string, index: number): Lp006Caselet {
  const random = rng(`${seed}:${index}`); const profileTemplate = PROFILES[(hashSeed(`${seed}:profile:${index}`) + index) % PROFILES.length]!; const profile = materializeProfile(profileTemplate, random); const people = shuffle(PEOPLE, random); const dayOrder = shuffle(DAYS, random); const subjectOrder = shuffle(SUBJECTS, random); const cityOrder = shuffle(CITIES, random);
  const dayByPerson = {} as Record<SynthPerson, SynthDay>; const subjectByPerson = {} as Record<SynthPerson, SynthSubject>; const cityByPerson = {} as Record<SynthPerson, SynthCity>;
  people.forEach((person, personIndex) => { dayByPerson[person] = dayOrder[personIndex]!; subjectByPerson[person] = subjectOrder[personIndex]!; cityByPerson[person] = cityOrder[personIndex]!; });
  const assignment = { dayByPerson, subjectByPerson, cityByPerson }; const difficultyBand: DifficultyBand = index % 3 === 0 ? "Easy" : index % 3 === 1 ? "Medium" : "Hard";
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const clues = difficultyBand === "Easy" ? buildEasyClues(people, assignment, profile, random) : difficultyBand === "Hard" ? buildHardClues(people, assignment, profile, random) : buildMediumClues(people, assignment, profile, random);
    const solutions = solveLp006({ people, clues });
    if (solutions.length === 1 && JSON.stringify(solutions[0]) === JSON.stringify(assignment) && essential(people, clues)) { const caseletId = `LP-006-${String(index + 1).padStart(3, "0")}`; return { caseletId, scenario: profile.scenario, questionSetup: buildQuestionSetup(profile), scenarioProfileId: profile.id, difficultyBand, people, days: DAYS, subjects: SUBJECTS, cities: CITIES, labels: profile, clues, assignment, children: makeChildren(caseletId, index, people, assignment, profile, difficultyBand, clues, random) }; }
  }
  throw new Error(`Unable to build an essential unique LP-006 assignment for seed ${seed}.`);
}

export function generateLp006Batch(seed = "lp-006-review", count = 8): Lp006Caselet[] { return Array.from({ length: count }, (_, index) => generateLp006Caselet(seed, index)); }

export const LP_006_REVIEW_PACKAGE = Object.freeze({ packageId: "LP-006", label: "Logic Puzzles — Advanced Three-Attribute Synthesis", checkpointId: "LP-CP-006", qlIds: ["LP-QL-021", "LP-QL-022", "LP-QL-023", "LP-QL-024"], supportedDifficulties: ["Easy", "Medium", "Hard"], supportedLanguages: ["en"], runtimeMode: "REVIEW_ONLY", reviewOnly: true });
