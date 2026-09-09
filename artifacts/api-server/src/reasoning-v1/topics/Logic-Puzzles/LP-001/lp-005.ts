import type { DifficultyBand } from "./index.ts";
import { examCityPlace, STANDARD_EXAM_CITY_POOL } from "./standard-pools.ts";

export type GridPerson = "A" | "B" | "C" | "D" | "E";
export type GridDuty = "A" | "B" | "C" | "D" | "E";
export type GridPlace = "A" | "B" | "C" | "D" | "E";
export type GridAssignment = { dutyByPerson: Record<GridPerson, GridDuty>; placeByPerson: Record<GridPerson, GridPlace> };
export type GridClue =
  | { kind: "PERSON_DUTY"; person: GridPerson; duty: GridDuty; text: string }
  | { kind: "NOT_PERSON_DUTY"; person: GridPerson; duty: GridDuty; text: string }
  | { kind: "PERSON_PLACE"; person: GridPerson; place: GridPlace; text: string }
  | { kind: "NOT_PERSON_PLACE"; person: GridPerson; place: GridPlace; text: string }
  | { kind: "DUTY_PLACE"; duty: GridDuty; place: GridPlace; text: string }
  | { kind: "NOT_DUTY_PLACE"; duty: GridDuty; place: GridPlace; text: string };

export type Lp005Profile = { id: string; scenario: string; people: Record<GridPerson, string>; duties: Record<GridDuty, string>; places: Record<GridPlace, string> };
export type Lp005Child = { questionId: string; qlId: "LP-QL-017" | "LP-QL-018" | "LP-QL-019" | "LP-QL-020"; stem: string; options: string[]; correctIndex: number; answer: string; difficultyBand: DifficultyBand; misconceptionFamily: string; explanation: { summary: string; lines: string[] } };
export type Lp005Caselet = { caseletId: string; scenario: string; scenarioProfileId: string; difficultyBand: DifficultyBand; people: readonly GridPerson[]; duties: readonly GridDuty[]; places: readonly GridPlace[]; labels: Lp005Profile; clues: readonly GridClue[]; assignment: GridAssignment; children: readonly Lp005Child[] };

const PEOPLE: readonly GridPerson[] = ["A", "B", "C", "D", "E"];
const DUTIES: readonly GridDuty[] = ["A", "B", "C", "D", "E"];
const PLACES: readonly GridPlace[] = ["A", "B", "C", "D", "E"];
const PROFILES: readonly Lp005Profile[] = [
  { id: "DISTRICT_SURVEY", scenario: "A district office is assigning five officers to five survey duties and five blocks. Each officer gets one duty and one block.", people: { A: "Aman", B: "Bhavna", C: "Charan", D: "Divya", E: "Eklavya" }, duties: { A: "water survey", B: "school survey", C: "road survey", D: "health survey", E: "market survey" }, places: { A: "Block A", B: "Block B", C: "Block C", D: "Block D", E: "Block E" } },
  { id: "SCHOOL_EXAM", scenario: "A school is assigning five teachers to five examination duties and five rooms. Each teacher gets one duty and one room.", people: { A: "Anita", B: "Baljeet", C: "Chitra", D: "Dev", E: "Esha" }, duties: { A: "attendance", B: "answer-sheet collection", C: "bell duty", D: "main gate duty", E: "room inspection" }, places: { A: "Room 1", B: "Room 2", C: "Room 3", D: "Room 4", E: "Room 5" } },
  { id: "BANK_REVIEW", scenario: "A bank is assigning five officers to five review tasks and five branches. Each officer gets one task and one branch.", people: { A: "Kamal", B: "Lata", C: "Mohit", D: "Nisha", E: "Omkar" }, duties: { A: "cash review", B: "loan-file review", C: "customer-file review", D: "locker review", E: "complaint review" }, places: { A: examCityPlace(STANDARD_EXAM_CITY_POOL[0], "Branch"), B: examCityPlace(STANDARD_EXAM_CITY_POOL[1], "Branch"), C: examCityPlace(STANDARD_EXAM_CITY_POOL[2], "Branch"), D: examCityPlace(STANDARD_EXAM_CITY_POOL[3], "Branch"), E: examCityPlace(STANDARD_EXAM_CITY_POOL[4], "Branch") } },
  { id: "HEALTH_CAMP", scenario: "A health department is assigning five workers to five camp duties and five villages. Each worker gets one duty and one village.", people: { A: "Asha", B: "Bikram", C: "Charu", D: "Deepak", E: "Farah" }, duties: { A: "registration", B: "medicine desk", C: "child check-up", D: "health education", E: "records" }, places: { A: "Village Kalan", B: "Village Khurd", C: "Village Majra", D: "Village Patti", E: "Village Rori" } },
  { id: "RAILWAY_CHECK", scenario: "A railway depot is assigning five inspectors to five checks and five sections. Each inspector gets one check and one section.", people: { A: "Amit", B: "Bharat", C: "Chetan", D: "Dimple", E: "Feroz" }, duties: { A: "signal check", B: "track check", C: "brake check", D: "safety check", E: "store check" }, places: { A: "North section", B: "South section", C: "East section", D: "West section", E: "Yard section" } },
  { id: "MUNICIPAL_WORK", scenario: "A municipal office is assigning five engineers to five works and five wards. Each engineer gets one work and one ward.", people: { A: "Arun", B: "Beena", C: "Chander", D: "Devika", E: "Iqbal" }, duties: { A: "road repair", B: "street-light work", C: "drain inspection", D: "park work", E: "water-line work" }, places: { A: "Ward 1", B: "Ward 2", C: "Ward 3", D: "Ward 4", E: "Ward 5" } },
];
const DUTY_TEMPLATES = ["{person} is assigned to {duty}.", "The duty given to {person} is {duty}."];
const NOT_DUTY_TEMPLATES = ["{person} is not assigned to {duty}.", "The {duty} duty is not given to {person}."];
const PLACE_TEMPLATES = ["{person} works in {place}.", "{person} is assigned to {place}."];
const NOT_PLACE_TEMPLATES = ["{person} does not work in {place}.", "{person} is not assigned to {place}."];
const DUTY_PLACE_TEMPLATES = ["The officer assigned to {duty} works in {place}.", "The person doing {duty} is assigned to {place}."];
const NOT_DUTY_PLACE_TEMPLATES = ["The officer assigned to {duty} does not work in {place}.", "The person doing {duty} is not assigned to {place}."];

function hashSeed(value: string): number { let hash = 2166136261; for (const char of value) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); } return hash >>> 0; }
function rng(seed: string) { let state = hashSeed(seed) || 1; return () => { state = Math.imul(state ^ (state >>> 15), 2246822519) >>> 0; state = Math.imul(state ^ (state >>> 13), 3266489917) >>> 0; return ((state ^ (state >>> 16)) >>> 0) / 4294967296; }; }
function shuffle<T>(items: readonly T[], random: () => number): T[] { const result = [...items]; for (let index = result.length - 1; index > 0; index -= 1) { const swap = Math.floor(random() * (index + 1)); [result[index], result[swap]] = [result[swap], result[index]]; } return result; }
function permutations<T>(items: readonly T[]): T[][] { if (items.length <= 1) return [Array.from(items)]; const result: T[][] = []; items.forEach((item, index) => { for (const tail of permutations([...items.slice(0, index), ...items.slice(index + 1)])) result.push([item, ...tail]); }); return result; }
function fill(template: string, values: Record<string, string>): string { return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? key); }
function pick<T extends readonly string[]>(items: T, random: () => number): string { return items[Math.floor(random() * items.length)]!; }
function pairKey(first: string, second: string): string { return [first, second].sort().join(":"); }
function clueKey(clue: GridClue): string { if (clue.kind === "PERSON_DUTY" || clue.kind === "NOT_PERSON_DUTY") return `${clue.kind}:${clue.person}:${clue.duty}`; if (clue.kind === "PERSON_PLACE" || clue.kind === "NOT_PERSON_PLACE") return `${clue.kind}:${clue.person}:${clue.place}`; return `${clue.kind}:${clue.duty}:${clue.place}`; }
function enumerateAssignments(people: readonly GridPerson[]): GridAssignment[] { const assignments: GridAssignment[] = []; for (const dutyOrder of permutations(DUTIES)) for (const placeOrder of permutations(PLACES)) { const dutyByPerson = {} as Record<GridPerson, GridDuty>; const placeByPerson = {} as Record<GridPerson, GridPlace>; people.forEach((person, index) => { dutyByPerson[person] = dutyOrder[index]!; placeByPerson[person] = placeOrder[index]!; }); assignments.push({ dutyByPerson, placeByPerson }); } return assignments; }
function satisfies(assignment: GridAssignment, clue: GridClue): boolean {
  if (clue.kind === "PERSON_DUTY") return assignment.dutyByPerson[clue.person] === clue.duty;
  if (clue.kind === "NOT_PERSON_DUTY") return assignment.dutyByPerson[clue.person] !== clue.duty;
  if (clue.kind === "PERSON_PLACE") return assignment.placeByPerson[clue.person] === clue.place;
  if (clue.kind === "NOT_PERSON_PLACE") return assignment.placeByPerson[clue.person] !== clue.place;
  const person = PEOPLE.find((candidate) => assignment.dutyByPerson[candidate] === clue.duty)!;
  return clue.kind === "DUTY_PLACE" ? assignment.placeByPerson[person] === clue.place : assignment.placeByPerson[person] !== clue.place;
}
function buildCandidates(people: readonly GridPerson[], hidden: GridAssignment, profile: Lp005Profile, random: () => number): GridClue[] {
  const result: GridClue[] = [];
  for (const person of people) {
    const duty = hidden.dutyByPerson[person]; const place = hidden.placeByPerson[person];
    result.push({ kind: "PERSON_DUTY", person, duty, text: fill(pick(DUTY_TEMPLATES, random), { person: profile.people[person], duty: profile.duties[duty] }) });
    for (const otherDuty of DUTIES.filter((candidate) => candidate !== duty)) result.push({ kind: "NOT_PERSON_DUTY", person, duty: otherDuty, text: fill(pick(NOT_DUTY_TEMPLATES, random), { person: profile.people[person], duty: profile.duties[otherDuty] }) });
    result.push({ kind: "PERSON_PLACE", person, place, text: fill(pick(PLACE_TEMPLATES, random), { person: profile.people[person], place: profile.places[place] }) });
    for (const otherPlace of PLACES.filter((candidate) => candidate !== place)) result.push({ kind: "NOT_PERSON_PLACE", person, place: otherPlace, text: fill(pick(NOT_PLACE_TEMPLATES, random), { person: profile.people[person], place: profile.places[otherPlace] }) });
  }
  for (const duty of DUTIES) {
    const person = people.find((candidate) => hidden.dutyByPerson[candidate] === duty)!; const place = hidden.placeByPerson[person];
    result.push({ kind: "DUTY_PLACE", duty, place, text: fill(pick(DUTY_PLACE_TEMPLATES, random), { duty: profile.duties[duty], place: profile.places[place] }) });
    const otherPlace = PLACES.find((candidate) => candidate !== place)!;
    result.push({ kind: "NOT_DUTY_PLACE", duty, place: otherPlace, text: fill(pick(NOT_DUTY_PLACE_TEMPLATES, random), { duty: profile.duties[duty], place: profile.places[otherPlace] }) });
  }
  return result;
}
function best(survivors: GridAssignment[], candidates: GridClue[], chosen: GridClue[], kind?: GridClue["kind"]): GridClue | undefined { return candidates.filter((candidate) => (!kind || candidate.kind === kind) && !chosen.some((clue) => clueKey(clue) === clueKey(candidate))).map((candidate) => ({ candidate, remaining: survivors.filter((state) => satisfies(state, candidate)).length })).filter((entry) => entry.remaining > 0 && entry.remaining < survivors.length).sort((a, b) => a.remaining - b.remaining)[0]?.candidate; }
function essential(all: readonly GridAssignment[], clues: readonly GridClue[]): boolean { return clues.every((_, removed) => all.filter((state) => clues.every((clue, index) => index === removed || satisfies(state, clue))).length > 1); }
function chooseClues(people: readonly GridPerson[], hidden: GridAssignment, profile: Lp005Profile, difficulty: DifficultyBand, random: () => number, mode: number): GridClue[] {
  const all = enumerateAssignments(people); const candidates = buildCandidates(people, hidden, profile, random);
  const dutyPeople = shuffle(people, random); const placePeople = shuffle(people, random);
  const find = (predicate: (clue: GridClue) => boolean): GridClue => candidates.find(predicate)!;
  const personDuty = (person: GridPerson) => find((clue) => clue.kind === "PERSON_DUTY" && clue.person === person);
  const personPlace = (person: GridPerson) => find((clue) => clue.kind === "PERSON_PLACE" && clue.person === person);
  const notPersonDuty = (person: GridPerson, duty: GridDuty) => find((clue) => clue.kind === "NOT_PERSON_DUTY" && clue.person === person && clue.duty === duty);
  const notPersonPlace = (person: GridPerson, place: GridPlace) => find((clue) => clue.kind === "NOT_PERSON_PLACE" && clue.person === person && clue.place === place);
  const dutyPlace = (duty: GridDuty, place: GridPlace) => find((clue) => clue.kind === "DUTY_PLACE" && clue.duty === duty && clue.place === place);
  const notDutyPlace = (duty: GridDuty, place: GridPlace) => find((clue) => clue.kind === "NOT_DUTY_PLACE" && clue.duty === duty && clue.place === place);
  const chosen: GridClue[] = [];
  const selectedMode = difficulty === "Hard" ? 5 : Math.floor(mode / 2) % 4;
  if (selectedMode === 0) {
    chosen.push(...dutyPeople.slice(0, 4).map(personDuty), ...placePeople.slice(0, 4).map(personPlace));
  } else if (selectedMode === 1) {
    chosen.push(...dutyPeople.slice(0, 4).map(personDuty), ...placePeople.slice(0, 3).map(personPlace), dutyPlace(hidden.dutyByPerson[placePeople[3]!], hidden.placeByPerson[placePeople[3]!]));
  } else if (selectedMode === 2) {
    chosen.push(...dutyPeople.slice(0, 4).map(personDuty), ...placePeople.slice(0, 3).map(personPlace), notDutyPlace(hidden.dutyByPerson[placePeople[3]!], hidden.placeByPerson[placePeople[4]!]));
  } else if (selectedMode === 3) {
    chosen.push(...dutyPeople.slice(0, 3).map(personDuty), ...placePeople.slice(0, 4).map(personPlace), notPersonDuty(dutyPeople[3]!, hidden.dutyByPerson[dutyPeople[4]!]));
  } else if (selectedMode === 4) {
    chosen.push(...dutyPeople.slice(0, 4).map(personDuty), ...placePeople.slice(0, 3).map(personPlace), notPersonPlace(placePeople[3]!, hidden.placeByPerson[placePeople[4]!]));
  } else {
    chosen.push(...dutyPeople.slice(0, 3).map(personDuty), ...placePeople.slice(0, 3).map(personPlace), notPersonDuty(dutyPeople[3]!, hidden.dutyByPerson[dutyPeople[4]!]), notPersonPlace(placePeople[3]!, hidden.placeByPerson[placePeople[4]!]));
  }
  const solutions = all.filter((state) => chosen.every((clue) => satisfies(state, clue)));
  if (solutions.length === 1 && JSON.stringify(solutions[0]) === JSON.stringify(hidden) && essential(all, chosen)) return chosen;
  throw new Error("Unable to build essential unique LP-005 matching clue set.");
}
function balance(options: readonly string[], answer: string, desired: number, random: () => number): string[] { const rest = shuffle(options.filter((option) => option !== answer), random); const result: string[] = []; for (let i = 0; i < 4; i += 1) result[i] = i === desired ? answer : rest.shift()!; return result; }
function lowerClueStart(text: string): string { return text.replace(/^The\b/u, "the").replace(/^Exactly\b/u, "exactly").replace(/^At most\b/u, "at most").replace(/^If\b/u, "if"); }
function makeChildren(caseletId: string, index: number, people: readonly GridPerson[], assignment: GridAssignment, profile: Lp005Profile, difficulty: DifficultyBand, clues: readonly GridClue[], random: () => number): Lp005Child[] {
  const target = people[(index + 1) % people.length]!; const targetDuty = assignment.dutyByPerson[target]; const targetPlace = assignment.placeByPerson[target];
  const dutyAnswer = profile.duties[targetDuty]; const placeAnswer = profile.places[targetPlace];
  const inversePerson = people.find((person) => assignment.dutyByPerson[person] === DUTIES[(index + 2) % DUTIES.length]!)!; const inverseDuty = assignment.dutyByPerson[inversePerson]; const inverseAnswer = profile.people[inversePerson];
  const completeAnswer = `${profile.people[target]} — ${profile.duties[targetDuty]} — ${profile.places[targetPlace]}`;
  const dutyOptions = balance([dutyAnswer, ...shuffle(DUTIES.filter((duty) => duty !== targetDuty), random).slice(0, 3).map((duty) => profile.duties[duty])], dutyAnswer, index % 4, random);
  const placeOptions = balance([placeAnswer, ...shuffle(PLACES.filter((place) => place !== targetPlace), random).slice(0, 3).map((place) => profile.places[place])], placeAnswer, (index + 1) % 4, random);
  const personOptions = balance([inverseAnswer, ...shuffle(people.filter((person) => person !== inversePerson), random).slice(0, 3).map((person) => profile.people[person])], inverseAnswer, (index + 2) % 4, random);
  const completeOptions = balance([completeAnswer, ...shuffle(people.filter((person) => person !== target), random).slice(0, 3).map((person) => `${profile.people[person]} — ${profile.duties[assignment.dutyByPerson[person]]} — ${profile.places[assignment.placeByPerson[person]]}`)], completeAnswer, (index + 3) % 4, random);
  const clueLead = clues.slice(0, Math.min(3, clues.length)).map((clue, clueIndex) => { const text = clue.text.replace(/[.]$/u, ""); return clueIndex === 0 ? text : lowerClueStart(text); }).join("; then ");
  const lead = difficulty === "Hard" ? `Start with these clues: ${clueLead}. Every person has one duty and one location.` : `The clues give one complete matching. The table shows the final result.`;
  const rows = people.map((person) => `| ${profile.people[person]} | ${profile.duties[assignment.dutyByPerson[person]]} | ${profile.places[assignment.placeByPerson[person]]} |`).join("\n");
  const evidence = `${lead}\n\n| Person | Duty | Location |\n|---|---|---|\n${rows}`;
  const explain = (summary: string, finalStep: string) => ({ summary, lines: [evidence, finalStep] });
  return [
    { questionId: `${caseletId}-Q1`, qlId: "LP-QL-017", stem: `Which duty is assigned to ${profile.people[target]}?`, options: dutyOptions, correctIndex: dutyOptions.indexOf(dutyAnswer), answer: dutyAnswer, difficultyBand: difficulty, misconceptionFamily: "DUTY_PERSON_MIXUP", explanation: explain(`${profile.people[target]} is assigned to ${dutyAnswer}.`, `Read ${profile.people[target]}'s row in the table. The duty is ${dutyAnswer}.`) },
    { questionId: `${caseletId}-Q2`, qlId: "LP-QL-018", stem: `Which location is assigned to ${profile.people[target]}?`, options: placeOptions, correctIndex: placeOptions.indexOf(placeAnswer), answer: placeAnswer, difficultyBand: difficulty, misconceptionFamily: "LOCATION_PERSON_MIXUP", explanation: explain(`${profile.people[target]} is assigned to ${placeAnswer}.`, `The table places ${profile.people[target]} in ${placeAnswer}.`) },
    { questionId: `${caseletId}-Q3`, qlId: "LP-QL-019", stem: `Who is assigned to ${profile.duties[inverseDuty]}?`, options: personOptions, correctIndex: personOptions.indexOf(inverseAnswer), answer: inverseAnswer, difficultyBand: difficulty, misconceptionFamily: "INVERSE_LOOKUP_ERROR", explanation: explain(`${inverseAnswer} is assigned to ${profile.duties[inverseDuty]}.`, `Look down the Duty column for ${profile.duties[inverseDuty]}; the matching person is ${inverseAnswer}.`) },
    { questionId: `${caseletId}-Q4`, qlId: "LP-QL-020", stem: `Which complete match is correct for ${profile.people[target]}?`, options: completeOptions, correctIndex: completeOptions.indexOf(completeAnswer), answer: completeAnswer, difficultyBand: difficulty, misconceptionFamily: "CROSS_ATTRIBUTE_MIXING", explanation: explain(`${completeAnswer} is the correct match.`, `The row for ${profile.people[target]} gives the person, duty and location: ${profile.people[target]}, ${dutyAnswer} and ${placeAnswer}.`) },
  ];
}
export function solveLp005(caselet: Pick<Lp005Caselet, "people" | "clues">): GridAssignment[] { return enumerateAssignments(caselet.people).filter((assignment) => caselet.clues.every((clue) => satisfies(assignment, clue))); }
export function generateLp005Caselet(seed = "lp-005-review", index = 0): Lp005Caselet {
  for (let attempt = 0; attempt < 96; attempt += 1) { const random = rng(`${seed}:${index}:${attempt}`); const profile = PROFILES[Math.floor(random() * PROFILES.length)]!; const people = shuffle(PEOPLE, random); const dutyOrder = shuffle(DUTIES, random); const placeOrder = shuffle(PLACES, random); const assignment = { dutyByPerson: {} as Record<GridPerson, GridDuty>, placeByPerson: {} as Record<GridPerson, GridPlace> }; people.forEach((person, i) => { assignment.dutyByPerson[person] = dutyOrder[i]!; assignment.placeByPerson[person] = placeOrder[i]!; }); const difficulty: DifficultyBand = index % 2 === 0 ? "Hard" : "Medium"; try { const clues = chooseClues(people, assignment, profile, difficulty, random, index); const caseletId = `LP-005-${String(index + 1).padStart(3, "0")}`; return { caseletId, scenario: profile.scenario, scenarioProfileId: profile.id, difficultyBand: difficulty, people, duties: DUTIES, places: PLACES, labels: profile, clues, assignment, children: makeChildren(caseletId, index, people, assignment, profile, difficulty, clues, random) }; } catch { /* deterministic retry */ } }
  throw new Error(`Unable to generate LP-005 caselet for seed ${seed}.`);
}
export function generateLp005Batch(seed = "lp-005-review", count = 8): Lp005Caselet[] { return Array.from({ length: count }, (_, index) => generateLp005Caselet(seed, index)); }
export const LP_005_REVIEW_PACKAGE = Object.freeze({ packageId: "LP-005", label: "Logic Puzzles — Multi-Attribute Matching", checkpointId: "LP-CP-005", qlIds: ["LP-QL-017", "LP-QL-018", "LP-QL-019", "LP-QL-020"], supportedDifficulties: ["Medium", "Hard"], supportedLanguages: ["en"], runtimeMode: "REVIEW_ONLY", reviewOnly: true });
