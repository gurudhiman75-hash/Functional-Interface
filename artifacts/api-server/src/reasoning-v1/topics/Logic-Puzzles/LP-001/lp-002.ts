import type { DifficultyBand, PersonId } from "./index.ts";
import { examCityPlace, STANDARD_EXAM_CITY_POOL } from "./standard-pools.ts";

export type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday";
export type LocationId = "L1" | "L2" | "L3" | "L4";
export type DayByPerson = Record<PersonId, Day>;
export type LocationByPerson = Record<PersonId, LocationId>;

export type MultiAttributeAssignment = { dayByPerson: DayByPerson; locationByPerson: LocationByPerson };
export type MultiClue =
  | { kind: "NOT_DAY"; person: PersonId; day: Day; text: string }
  | { kind: "NOT_LOCATION"; person: PersonId; location: LocationId; text: string }
  | { kind: "DAY_BEFORE"; left: PersonId; right: PersonId; text: string }
  | { kind: "LOCATION_BEFORE"; left: PersonId; right: PersonId; text: string }
  | { kind: "DAY_GAP"; left: PersonId; right: PersonId; distance: number; text: string };

export type Lp002Profile = {
  id: string;
  scenario: string;
  locationLabels: Record<LocationId, string>;
  personNoun: string;
  dayNoun: string;
  dayQuestionTemplate: string;
  locationQuestionTemplate: string;
  inverseDayQuestionTemplate: string;
  matchQuestionTemplate: string;
  notDayTemplates: readonly string[];
  notLocationTemplates: readonly string[];
  dayBeforeTemplates: readonly string[];
  locationBeforeTemplates: readonly string[];
  dayGapTemplates: readonly string[];
};

export type Lp002Child = {
  questionId: string;
  qlId: "LP-QL-005" | "LP-QL-006" | "LP-QL-007" | "LP-QL-008";
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  difficultyBand: DifficultyBand;
  misconceptionFamily: string;
  explanation: { summary: string; lines: string[] };
};

export type Lp002Caselet = {
  caseletId: string;
  scenario: string;
  scenarioProfileId: string;
  difficultyBand: DifficultyBand;
  people: readonly PersonId[];
  days: readonly Day[];
  locations: readonly LocationId[];
  locationLabels: Record<LocationId, string>;
  clues: readonly MultiClue[];
  assignment: MultiAttributeAssignment;
  children: readonly Lp002Child[];
};

const DAYS: readonly Day[] = ["Monday", "Tuesday", "Wednesday", "Thursday"];
const LOCATIONS: readonly LocationId[] = ["L1", "L2", "L3", "L4"];
const PEOPLE = ["Aarav", "Bhavna", "Charu", "Dev", "Ishaan", "Meera", "Nakul", "Pallavi", "Rohan", "Simran", "Tanya", "Varun", "Yash", "Zoya", "Karan", "Neha"];

const PROFILES: readonly Lp002Profile[] = [
  {
    id: "BANK_BRANCH_REVIEW",
    scenario: "A bank is reviewing four branches after a service audit. Four officers each visit one branch on a different day. The branches are listed in travel order.",
    locationLabels: { L1: examCityPlace(STANDARD_EXAM_CITY_POOL[0], "Branch"), L2: examCityPlace(STANDARD_EXAM_CITY_POOL[1], "Branch"), L3: examCityPlace(STANDARD_EXAM_CITY_POOL[2], "Branch"), L4: examCityPlace(STANDARD_EXAM_CITY_POOL[3], "Branch") },
    personNoun: "officer", dayNoun: "day", dayQuestionTemplate: "On which day did {person} visit a branch?", locationQuestionTemplate: "Which branch did {person} visit?", inverseDayQuestionTemplate: "Which officer visited a branch on {day}?", matchQuestionTemplate: "Which of the following correctly matches an officer, a day and a branch?",
    notDayTemplates: ["{person} did not visit a branch on {day}.", "The branch visit by {person} was not on {day}."],
    notLocationTemplates: ["{person} did not visit the {location}.", "The {location} visit was not made by {person}."],
    dayBeforeTemplates: ["{left} visited a branch before {right} did.", "The visit by {left} was earlier than the visit by {right}."],
    locationBeforeTemplates: ["{left} visited a branch earlier in the travel route than {right}.", "The branch visited by {left} comes before {right}'s branch in the route."],
    dayGapTemplates: ["The visits by {left} and {right} were exactly {distance} days apart.", "The visits by {left} and {right} were separated by exactly {distance} days."],
  },
  {
    id: "DISTRICT_SERVICE_CAMP",
    scenario: "A district administration is running four public-service camps. Four officers each lead one camp on a different day. The centres are listed from west to east.",
    locationLabels: { L1: examCityPlace(STANDARD_EXAM_CITY_POOL[4], "Centre"), L2: examCityPlace(STANDARD_EXAM_CITY_POOL[5], "Centre"), L3: examCityPlace(STANDARD_EXAM_CITY_POOL[6], "Centre"), L4: examCityPlace(STANDARD_EXAM_CITY_POOL[7], "Centre") },
    personNoun: "officer", dayNoun: "day", dayQuestionTemplate: "On which day did {person} lead a camp?", locationQuestionTemplate: "At which centre did {person} lead a camp?", inverseDayQuestionTemplate: "Which officer led a camp on {day}?", matchQuestionTemplate: "Which of the following correctly matches an officer, a day and a service centre?",
    notDayTemplates: ["{person} did not lead a camp on {day}.", "The camp led by {person} was not held on {day}."],
    notLocationTemplates: ["{person} did not lead the camp at {location}.", "The camp at {location} was not led by {person}."],
    dayBeforeTemplates: ["{left} led a camp before {right} did.", "The camp led by {left} took place earlier than {right}'s camp."],
    locationBeforeTemplates: ["{left}'s centre is west of the centre led by {right}.", "The centre led by {left} comes earlier in the west-to-east list than {right}'s centre."],
    dayGapTemplates: ["The camps led by {left} and {right} were exactly {distance} days apart.", "The camps led by {left} and {right} were separated by exactly {distance} days."],
  },
  {
    id: "SCHOLARSHIP_INTERVIEWS",
    scenario: "A scholarship board is interviewing four applicants at four district centres. Each applicant appears on a different day, and the centres are listed in the order of the board's tour.",
    locationLabels: { L1: examCityPlace(STANDARD_EXAM_CITY_POOL[0], "Centre"), L2: examCityPlace(STANDARD_EXAM_CITY_POOL[1], "Centre"), L3: examCityPlace(STANDARD_EXAM_CITY_POOL[2], "Centre"), L4: examCityPlace(STANDARD_EXAM_CITY_POOL[3], "Centre") },
    personNoun: "applicant", dayNoun: "interview day", dayQuestionTemplate: "On which day was {person} interviewed?", locationQuestionTemplate: "At which centre was {person} interviewed?", inverseDayQuestionTemplate: "Which applicant was interviewed on {day}?", matchQuestionTemplate: "Which of the following correctly matches an applicant, an interview day and a centre?",
    notDayTemplates: ["{person} was not interviewed on {day}.", "The interview of {person} was not held on {day}."],
    notLocationTemplates: ["{person} was not interviewed at {location}.", "The interview at {location} was not given to {person}."],
    dayBeforeTemplates: ["{left} was interviewed before {right}.", "The interview of {left} took place earlier than that of {right}."],
    locationBeforeTemplates: ["{left}'s interview centre came before {right}'s in the tour.", "The centre where {left} was interviewed was earlier in the tour than {right}'s centre."],
    dayGapTemplates: ["The interviews of {left} and {right} were exactly {distance} days apart.", "The interviews of {left} and {right} were separated by exactly {distance} days."],
  },
  {
    id: "HEALTH_OUTREACH",
    scenario: "A health department is arranging four mobile clinics. Four doctors each conduct one clinic on a different day. The clinic locations are listed in the order of the route.",
    locationLabels: { L1: "Village Health Centre", L2: "Block Hospital", L3: "Community Hall", L4: "Women and Child Centre" },
    personNoun: "doctor", dayNoun: "clinic day", dayQuestionTemplate: "On which day did {person} conduct a clinic?", locationQuestionTemplate: "At which location did {person} conduct a clinic?", inverseDayQuestionTemplate: "Which doctor conducted a clinic on {day}?", matchQuestionTemplate: "Which of the following correctly matches a doctor, a clinic day and a location?",
    notDayTemplates: ["{person} did not conduct a clinic on {day}.", "The clinic conducted by {person} was not on {day}."],
    notLocationTemplates: ["{person} did not conduct the clinic at {location}.", "The clinic at {location} was not conducted by {person}."],
    dayBeforeTemplates: ["{left} conducted a clinic before {right}.", "The clinic conducted by {left} was earlier than {right}'s clinic."],
    locationBeforeTemplates: ["{left}'s clinic came earlier in the route than {right}'s.", "The clinic location for {left} appears before {right}'s in the route."],
    dayGapTemplates: ["The clinics conducted by {left} and {right} were exactly {distance} days apart.", "The clinics conducted by {left} and {right} were separated by exactly {distance} days."],
  },
  {
    id: "TEACHER_DEMONSTRATION",
    scenario: "A teacher-training board is observing four demonstration lessons at four schools. Four teachers each teach one lesson on a different day. The schools are listed in travel order.",
    locationLabels: { L1: "Government Senior Secondary School", L2: "Model School", L3: "Girls' School", L4: "College Campus" },
    personNoun: "teacher", dayNoun: "lesson day", dayQuestionTemplate: "On which day did {person} teach a demonstration lesson?", locationQuestionTemplate: "At which school did {person} teach?", inverseDayQuestionTemplate: "Which teacher taught a demonstration lesson on {day}?", matchQuestionTemplate: "Which of the following correctly matches a teacher, a lesson day and a school?",
    notDayTemplates: ["{person} did not teach on {day}.", "The demonstration lesson by {person} was not on {day}."],
    notLocationTemplates: ["{person} did not teach at the {location}.", "The lesson at the {location} was not taught by {person}."],
    dayBeforeTemplates: ["{left} taught before {right}.", "The lesson by {left} was observed earlier than {right}'s lesson."],
    locationBeforeTemplates: ["{left}'s school came before {right}'s in the travel order.", "The school visited for {left}'s lesson comes before {right}'s school in the route."],
    dayGapTemplates: ["The lessons by {left} and {right} were exactly {distance} days apart.", "The lessons by {left} and {right} were separated by exactly {distance} days."],
  },
  {
    id: "FIELD_RESEARCH",
    scenario: "A university research team is collecting four water samples. Four researchers each handle one site on a different day. The sites are listed upstream to downstream.",
    locationLabels: { L1: "Upper Canal", L2: "Village Tank", L3: "Irrigation Dam", L4: "River Outfall" },
    personNoun: "researcher", dayNoun: "sampling day", dayQuestionTemplate: "On which day did {person} collect a sample?", locationQuestionTemplate: "At which site did {person} collect a sample?", inverseDayQuestionTemplate: "Which researcher collected a sample on {day}?", matchQuestionTemplate: "Which of the following correctly matches a researcher, a sampling day and a site?",
    notDayTemplates: ["{person} did not collect a sample on {day}.", "The sample collected by {person} was not collected on {day}."],
    notLocationTemplates: ["{person} did not work at the {location}.", "The sample from the {location} was not collected by {person}."],
    dayBeforeTemplates: ["{left} collected a sample before {right}.", "The sample collected by {left} came earlier than {right}'s sample."],
    locationBeforeTemplates: ["{left}'s site is upstream of {right}'s site.", "The site handled by {left} comes before {right}'s in the upstream-to-downstream list."],
    dayGapTemplates: ["The samples collected by {left} and {right} were exactly {distance} days apart.", "The samples collected by {left} and {right} were separated by exactly {distance} days."],
  },
];

function hashSeed(value: string): number { let hash = 2166136261; for (const char of value) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); } return hash >>> 0; }
function rng(seed: string) { let state = hashSeed(seed) || 1; return () => { state = Math.imul(state ^ (state >>> 15), 2246822519) >>> 0; state = Math.imul(state ^ (state >>> 13), 3266489917) >>> 0; return ((state ^ (state >>> 16)) >>> 0) / 4294967296; }; }
function shuffle<T>(items: readonly T[], random: () => number): T[] { const result = [...items]; for (let i = result.length - 1; i > 0; i -= 1) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j]!, result[i]!]; } return result; }
function fill(template: string, values: Record<string, string>): string { return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? key); }
function permutations<T>(items: readonly T[]): T[][] { if (items.length <= 1) return [Array.from(items)]; const result: T[][] = []; items.forEach((item, index) => { const rest = [...items.slice(0, index), ...items.slice(index + 1)]; for (const tail of permutations(rest)) result.push([item, ...tail]); }); return result; }
function dayIndex(day: Day): number { return DAYS.indexOf(day); }
function locationIndex(location: LocationId): number { return LOCATIONS.indexOf(location); }

function enumerateAssignments(people: readonly PersonId[]): MultiAttributeAssignment[] {
  const result: MultiAttributeAssignment[] = [];
  for (const dayOrder of permutations(DAYS)) for (const locationOrder of permutations(LOCATIONS)) {
    const dayByPerson: DayByPerson = {}; const locationByPerson: LocationByPerson = {};
    people.forEach((person, index) => { dayByPerson[person] = dayOrder[index]!; locationByPerson[person] = locationOrder[index]!; });
    result.push({ dayByPerson, locationByPerson });
  }
  return result;
}

function satisfies(assignment: MultiAttributeAssignment, clue: MultiClue): boolean {
  if (clue.kind === "NOT_DAY") return assignment.dayByPerson[clue.person] !== clue.day;
  if (clue.kind === "NOT_LOCATION") return assignment.locationByPerson[clue.person] !== clue.location;
  if (clue.kind === "DAY_BEFORE") return dayIndex(assignment.dayByPerson[clue.left]!) < dayIndex(assignment.dayByPerson[clue.right]!);
  if (clue.kind === "LOCATION_BEFORE") return locationIndex(assignment.locationByPerson[clue.left]!) < locationIndex(assignment.locationByPerson[clue.right]!);
  return Math.abs(dayIndex(assignment.dayByPerson[clue.left]!) - dayIndex(assignment.dayByPerson[clue.right]!)) === clue.distance;
}

function clueKey(clue: MultiClue): string {
  if (clue.kind === "NOT_DAY") return `${clue.kind}:${clue.person}:${clue.day}`;
  if (clue.kind === "NOT_LOCATION") return `${clue.kind}:${clue.person}:${clue.location}`;
  if (clue.kind === "DAY_GAP") return `${clue.kind}:${clue.left}:${clue.right}:${clue.distance}`;
  const [left, right] = [clue.left, clue.right].sort(); return `${clue.kind}:${left}:${right}`;
}

function buildCandidates(people: readonly PersonId[], hidden: MultiAttributeAssignment, profile: Lp002Profile, random: () => number): MultiClue[] {
  const result: MultiClue[] = [];
  for (const person of people) for (const day of DAYS) if (hidden.dayByPerson[person] !== day) {
    const template = profile.notDayTemplates[Math.floor(random() * profile.notDayTemplates.length)]!;
    result.push({ kind: "NOT_DAY", person, day, text: fill(template, { person, day }) });
  }
  for (const person of people) for (const location of LOCATIONS) if (hidden.locationByPerson[person] !== location) {
    const template = profile.notLocationTemplates[Math.floor(random() * profile.notLocationTemplates.length)]!;
    result.push({ kind: "NOT_LOCATION", person, location, text: fill(template, { person, location: profile.locationLabels[location] }) });
  }
  for (let left = 0; left < people.length; left += 1) for (let right = left + 1; right < people.length; right += 1) {
    const first = people[left]!; const second = people[right]!;
    if (dayIndex(hidden.dayByPerson[first]!) < dayIndex(hidden.dayByPerson[second]!)) {
      const template = profile.dayBeforeTemplates[Math.floor(random() * profile.dayBeforeTemplates.length)]!;
      result.push({ kind: "DAY_BEFORE", left: first, right: second, text: fill(template, { left: first, right: second }) });
    } else {
      const template = profile.dayBeforeTemplates[Math.floor(random() * profile.dayBeforeTemplates.length)]!;
      result.push({ kind: "DAY_BEFORE", left: second, right: first, text: fill(template, { left: second, right: first }) });
    }
    const firstLocation = hidden.locationByPerson[first]!; const secondLocation = hidden.locationByPerson[second]!;
    const locationLeft = locationIndex(firstLocation) < locationIndex(secondLocation) ? first : second; const locationRight = locationLeft === first ? second : first;
    const locationTemplate = profile.locationBeforeTemplates[Math.floor(random() * profile.locationBeforeTemplates.length)]!;
    result.push({ kind: "LOCATION_BEFORE", left: locationLeft, right: locationRight, text: fill(locationTemplate, { left: locationLeft, right: locationRight }) });
  }
  for (let left = 0; left < people.length; left += 1) for (let right = left + 1; right < people.length; right += 1) {
    const distance = Math.abs(dayIndex(hidden.dayByPerson[people[left]!]!) - dayIndex(hidden.dayByPerson[people[right]!]!));
    if (distance >= 1) { const first = people[left]!; const second = people[right]!; const template = profile.dayGapTemplates[Math.floor(random() * profile.dayGapTemplates.length)]!; result.push({ kind: "DAY_GAP", left: first, right: second, distance, text: fill(template, { left: first, right: second, distance: String(distance) }) }); }
  }
  return result;
}

function best(survivors: MultiAttributeAssignment[], candidates: MultiClue[], chosen: MultiClue[], kind?: MultiClue["kind"]): MultiClue | undefined {
  return candidates.filter((candidate) => (!kind || candidate.kind === kind) && !chosen.some((clue) => clueKey(clue) === clueKey(candidate)))
    .map((candidate) => ({ candidate, remaining: survivors.filter((state) => satisfies(state, candidate)).length }))
    .filter((entry) => entry.remaining > 0 && entry.remaining < survivors.length)
    .sort((left, right) => left.remaining - right.remaining)[0]?.candidate;
}

function essential(people: readonly PersonId[], clues: readonly MultiClue[]): boolean {
  const all = enumerateAssignments(people);
  return clues.every((_, removed) => all.filter((state) => clues.every((clue, index) => index === removed || satisfies(state, clue))).length > 1);
}

function chooseClues(people: readonly PersonId[], hidden: MultiAttributeAssignment, profile: Lp002Profile, difficultyBand: DifficultyBand, random: () => number): MultiClue[] {
  const all = enumerateAssignments(people); const candidates = buildCandidates(people, hidden, profile, random);
  const quotas: Array<readonly MultiClue["kind"][]> = difficultyBand === "Hard"
    ? [["NOT_DAY", "NOT_LOCATION", "DAY_BEFORE", "LOCATION_BEFORE", "DAY_GAP"], ["NOT_LOCATION", "DAY_BEFORE", "LOCATION_BEFORE", "NOT_DAY"], ["DAY_GAP", "LOCATION_BEFORE", "NOT_DAY", "NOT_LOCATION"], ["NOT_DAY", "DAY_BEFORE", "DAY_GAP", "LOCATION_BEFORE"]]
    : [["NOT_DAY", "NOT_LOCATION", "DAY_BEFORE", "DAY_GAP"], ["NOT_DAY", "NOT_LOCATION", "LOCATION_BEFORE"], ["DAY_GAP", "LOCATION_BEFORE", "NOT_DAY"], ["NOT_LOCATION", "DAY_BEFORE", "DAY_GAP"]];
  for (const quota of shuffle(quotas, random)) {
    let survivors = all; const chosen: MultiClue[] = [];
    for (const kind of quota) { const selected = best(survivors, candidates, chosen, kind); if (!selected) { chosen.length = 0; break; } chosen.push(selected); survivors = survivors.filter((state) => satisfies(state, selected)); }
    while (chosen.length < (difficultyBand === "Hard" ? 8 : 6) && survivors.length > 1) { const selected = best(survivors, candidates, chosen); if (!selected) break; chosen.push(selected); survivors = survivors.filter((state) => satisfies(state, selected)); }
    if (survivors.length === 1 && JSON.stringify(survivors[0]) === JSON.stringify(hidden) && essential(people, chosen)) return chosen;
  }
  throw new Error("Unable to build essential unique LP-002 assignment.");
}

function balance(options: readonly string[], answer: string, desired: number, random: () => number): string[] {
  const remaining = shuffle(options.filter((option) => option !== answer), random); const result: string[] = [];
  for (let index = 0; index < options.length; index += 1) result[index] = index === desired ? answer : remaining.shift()!;
  return result;
}

function invertDay(assignment: MultiAttributeAssignment, day: Day): PersonId { return Object.entries(assignment.dayByPerson).find(([, assigned]) => assigned === day)?.[0] ?? "Unknown"; }

function makeChildren(caseletId: string, index: number, people: readonly PersonId[], assignment: MultiAttributeAssignment, profile: Lp002Profile, difficultyBand: DifficultyBand, clues: readonly MultiClue[], random: () => number): Lp002Child[] {
  const target = shuffle(people, random)[0]!; const targetDay = assignment.dayByPerson[target]!; const targetLocation = assignment.locationByPerson[target]!; const targetLocationLabel = profile.locationLabels[targetLocation];
  const allTriples = people.map((person) => `${person} — ${assignment.dayByPerson[person]} — ${profile.locationLabels[assignment.locationByPerson[person]!]}`);
  const tripleAnswer = `${target} — ${targetDay} — ${targetLocationLabel}`;
  const tripleOptions = balance([tripleAnswer, ...shuffle(allTriples.filter((triple) => triple !== tripleAnswer), random).slice(0, 3)], tripleAnswer, (index + 3) % 4, random);
  const dayOptions = balance([...DAYS], targetDay, index % 4, random);
  const locationOptions = balance(LOCATIONS.map((location) => profile.locationLabels[location]), targetLocationLabel, (index + 1) % 4, random);
  const dayQuery = DAYS[(index + 2) % DAYS.length]!; const dayPerson = invertDay(assignment, dayQuery); const personOptions = balance([...people], dayPerson, (index + 2) % 4, random);
  const table = `| Person | ${profile.dayNoun} | Location |\n|---|---|---|\n${people.map((person) => `| ${person} | ${assignment.dayByPerson[person]} | ${profile.locationLabels[assignment.locationByPerson[person]!] } |`).join("\n")}`;
  const clueLead = clues.slice(0, Math.min(3, clues.length)).map((clue, clueIndex) => {
    const text = clue.text.replace(/[.]$/u, "");
    return clueIndex === 0 ? text : text.replace(/^The\b/u, "the");
  }).join("; then ");
  const leads = [`Begin with these deductions: ${clueLead}.`, `The key clues are ${clueLead}.`, `Apply the clues in sequence: ${clueLead}.`, `Once these clues are combined—${clueLead}—the remaining assignments are forced.`];
  const evidence = difficultyBand === "Hard" ? `${leads[index % 4]} Each day and each location is used once.\n\n${table}` : `The clues leave one complete day-and-location assignment. ${index % 2 === 0 ? "The one-to-one rule fills the remaining entries." : "The unused days and locations can then be placed without a choice."}\n\n${table}`;
  const explain = (summary: string, finalStep: string) => ({ summary, lines: [evidence, finalStep] });
  return [
    { questionId: `${caseletId}-Q1`, qlId: "LP-QL-005", stem: fill(profile.dayQuestionTemplate, { person: target }), options: dayOptions, correctIndex: dayOptions.indexOf(targetDay), answer: targetDay, difficultyBand, misconceptionFamily: "DAY_ORDER_OR_EXCLUSION_MISREAD", explanation: explain(`${target} was assigned to ${targetDay}.`, `${target} appears in the ${targetDay} row of the completed schedule.`) },
    { questionId: `${caseletId}-Q2`, qlId: "LP-QL-006", stem: fill(profile.locationQuestionTemplate, { person: target }), options: locationOptions, correctIndex: locationOptions.indexOf(targetLocationLabel), answer: targetLocationLabel, difficultyBand, misconceptionFamily: "LOCATION_ORDER_MISREAD", explanation: explain(`${target} was assigned to the ${targetLocationLabel}.`, `The completed table places ${target} at the ${targetLocationLabel}.`) },
    { questionId: `${caseletId}-Q3`, qlId: "LP-QL-007", stem: fill(profile.inverseDayQuestionTemplate, { day: dayQuery }), options: personOptions, correctIndex: personOptions.indexOf(dayPerson), answer: dayPerson, difficultyBand, misconceptionFamily: "INVERSE_LOOKUP_ERROR", explanation: explain(`${dayPerson} was assigned on ${dayQuery}.`, `Reading the ${dayQuery} entry in the table gives ${dayPerson}.`) },
    { questionId: `${caseletId}-Q4`, qlId: "LP-QL-008", stem: profile.matchQuestionTemplate, options: tripleOptions, correctIndex: tripleOptions.indexOf(tripleAnswer), answer: tripleAnswer, difficultyBand, misconceptionFamily: "CROSS_ATTRIBUTE_MIXING", explanation: explain(`${tripleAnswer} is the correct complete match.`, `The row for ${target} gives the three matching attributes: ${target}, ${targetDay}, and ${targetLocationLabel}.`) },
  ];
}

export function solveLp002(caselet: Pick<Lp002Caselet, "people" | "clues">): MultiAttributeAssignment[] { return enumerateAssignments(caselet.people).filter((assignment) => caselet.clues.every((clue) => satisfies(assignment, clue))); }

export function generateLp002Caselet(seed = "lp-002-review", index = 0): Lp002Caselet {
  for (let attempt = 0; attempt < 96; attempt += 1) {
    const random = rng(`${seed}:${index}:${attempt}`); const profile = PROFILES[Math.floor(random() * PROFILES.length)]!; const people = shuffle(PEOPLE, random).slice(0, 4); const dayOrder = shuffle(DAYS, random); const locationOrder = shuffle(LOCATIONS, random); const dayByPerson: DayByPerson = {}; const locationByPerson: LocationByPerson = {};
    people.forEach((person, personIndex) => { dayByPerson[person] = dayOrder[personIndex]!; locationByPerson[person] = locationOrder[personIndex]!; });
    const difficultyBand: DifficultyBand = index % 2 === 0 ? "Hard" : "Medium";
    try { const assignment = { dayByPerson, locationByPerson }; const clues = chooseClues(people, assignment, profile, difficultyBand, random); const caseletId = `LP-002-${String(index + 1).padStart(3, "0")}`; return { caseletId, scenario: profile.scenario, scenarioProfileId: profile.id, difficultyBand, people, days: DAYS, locations: LOCATIONS, locationLabels: profile.locationLabels, clues, assignment, children: makeChildren(caseletId, index, people, assignment, profile, difficultyBand, clues, random) }; } catch { /* deterministic retry */ }
  }
  throw new Error(`Unable to generate LP-002 caselet for seed ${seed}.`);
}

export function generateLp002Batch(seed = "lp-002-review", count = 8): Lp002Caselet[] { return Array.from({ length: count }, (_, index) => generateLp002Caselet(seed, index)); }

export const LP_002_REVIEW_PACKAGE = Object.freeze({ packageId: "LP-002", label: "Logic Puzzles — Multi-Attribute Assignment", checkpointId: "LP-CP-002", qlIds: ["LP-QL-005", "LP-QL-006", "LP-QL-007", "LP-QL-008"], supportedDifficulties: ["Medium", "Hard"], supportedLanguages: ["en"], runtimeMode: "REVIEW_ONLY", reviewOnly: true });
