import type { DifficultyBand } from "./index.ts";

export type DayTimePerson = "A" | "B" | "C" | "D" | "E" | "F";
export type DayTimeSlot = 0 | 1 | 2 | 3 | 4 | 5;
export type DayTimeAssignment = Record<DayTimePerson, DayTimeSlot>;

export type DayTimeClue =
  | { kind: "PERSON_SLOT"; person: DayTimePerson; slot: DayTimeSlot; text: string }
  | { kind: "PERSON_DAY"; person: DayTimePerson; dayIndex: 0 | 1 | 2; text: string }
  | { kind: "PERSON_TIME"; person: DayTimePerson; timeIndex: 0 | 1; text: string }
  | { kind: "BEFORE"; left: DayTimePerson; right: DayTimePerson; text: string }
  | { kind: "BETWEEN"; left: DayTimePerson; right: DayTimePerson; count: number; text: string }
  | { kind: "IMMEDIATE_BEFORE"; left: DayTimePerson; right: DayTimePerson; text: string }
  | { kind: "SAME_TIME"; left: DayTimePerson; right: DayTimePerson; text: string }
  | { kind: "SAME_DAY"; left: DayTimePerson; right: DayTimePerson; text: string }
  | { kind: "NOT_DAY"; person: DayTimePerson; dayIndex: 0 | 1 | 2; text: string };

export type Lp010Profile = {
  id: string;
  scenario: string;
  personNoun: string;
  eventNoun: string;
  people: Record<DayTimePerson, string>;
  days: readonly [string, string, string];
  times: readonly [string, string];
  slots: Record<DayTimeSlot, string>;
  personQuestionTemplate: string;
  slotQuestionTemplate: string;
  pairQuestionTemplate: string;
  nextQuestionTemplate: string;
};

export type Lp010Child = {
  questionId: string;
  qlId: "LP-QL-037" | "LP-QL-038" | "LP-QL-039" | "LP-QL-040";
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  difficultyBand: DifficultyBand;
  misconceptionFamily: string;
  explanation: { summary: string; lines: string[] };
};

export type Lp010Caselet = {
  caseletId: string;
  scenario: string;
  questionSetup: string;
  scenarioProfileId: string;
  difficultyBand: DifficultyBand;
  people: readonly DayTimePerson[];
  slots: readonly DayTimeSlot[];
  labels: Lp010Profile;
  clues: readonly DayTimeClue[];
  assignment: DayTimeAssignment;
  children: readonly Lp010Child[];
};

export const LP_010_REVIEW_PACKAGE = Object.freeze({
  packageId: "LP-010",
  checkpointId: "LP-CP-010",
  label: "Logic Puzzles — Day-and-Time Scheduling",
  qlIds: ["LP-QL-037", "LP-QL-038", "LP-QL-039", "LP-QL-040"] as const,
  supportedDifficulties: ["Easy", "Medium", "Hard"] as const,
  supportedLanguages: ["en"] as const,
  runtimeMode: "REVIEW_ONLY" as const,
  reviewOnly: true as const,
});

const PEOPLE: readonly DayTimePerson[] = ["A", "B", "C", "D", "E", "F"];
const SLOTS: readonly DayTimeSlot[] = [0, 1, 2, 3, 4, 5];

const PROFILE_TEMPLATES = [
  { id: "LECTURE_SCHEDULE", scenario: "A college is scheduling one lecture for each of six students.", personNoun: "student", eventNoun: "lecture", days: ["Tuesday", "Wednesday", "Friday"] as const, times: ["10 a.m.", "4 p.m."] as const, people: ["Aarav", "Bhavna", "Chetan", "Diya", "Eshan", "Farah", "Gaurav", "Hina", "Ishan", "Jyoti", "Karan", "Meera"] },
  { id: "INTERVIEW_SCHEDULE", scenario: "A recruitment board is scheduling interviews for six applicants.", personNoun: "applicant", eventNoun: "interview", days: ["Monday", "Wednesday", "Friday"] as const, times: ["9 a.m.", "3 p.m."] as const, people: ["Aditi", "Bharat", "Charu", "Dev", "Ira", "Kabir", "Leena", "Mohit", "Neha", "Parth", "Ritu", "Sahil"] },
  { id: "TRAINING_DEMOS", scenario: "A training institute is scheduling demonstration sessions for six trainees.", personNoun: "trainee", eventNoun: "demonstration session", days: ["Tuesday", "Thursday", "Saturday"] as const, times: ["11 a.m.", "5 p.m."] as const, people: ["Anaya", "Bimal", "Deepa", "Harsh", "Kriti", "Manav", "Naman", "Ojas", "Pooja", "Ravi", "Simran", "Tanvi"] },
  { id: "COUNSELLING_SLOTS", scenario: "A counselling centre is scheduling appointments for six candidates.", personNoun: "candidate", eventNoun: "appointment", days: ["Monday", "Tuesday", "Thursday"] as const, times: ["10:30 a.m.", "2:30 p.m."] as const, people: ["Asha", "Bikram", "Deepak", "Esha", "Harish", "Jyoti", "Kiran", "Mona", "Naveen", "Reema", "Sahil", "Tina"] },
  { id: "AUDIT_MEETINGS", scenario: "A bank is scheduling review meetings for six officers.", personNoun: "officer", eventNoun: "review meeting", days: ["Monday", "Thursday", "Friday"] as const, times: ["10 a.m.", "2 p.m."] as const, people: ["Kamal", "Lata", "Mohit", "Nisha", "Omkar", "Priya", "Rahul", "Simran", "Tarun", "Zoya", "Arjun", "Leela"] },
  { id: "LAB_PRESENTATIONS", scenario: "A university is scheduling presentations for six researchers.", personNoun: "researcher", eventNoun: "presentation", days: ["Wednesday", "Friday", "Saturday"] as const, times: ["9:30 a.m.", "1:30 p.m."] as const, people: ["Alok", "Beena", "Dinesh", "Farah", "Gopal", "Harini", "Irfan", "Juhi", "Kartik", "Leela", "Nitin", "Rupa"] },
] as const;

function hashSeed(value: string): number { let hash = 2166136261; for (const char of value) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); } return hash >>> 0; }
function rng(seed: string) { let state = hashSeed(seed) || 1; return () => { state = Math.imul(state ^ (state >>> 15), 2246822519) >>> 0; state = Math.imul(state ^ (state >>> 13), 3266489917) >>> 0; return ((state ^ (state >>> 16)) >>> 0) / 4294967296; }; }
function shuffle<T>(items: readonly T[], random: () => number): T[] { const result = [...items]; for (let i = result.length - 1; i > 0; i -= 1) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j]!, result[i]!]; } return result; }
function permutations<T>(items: readonly T[]): T[][] { if (items.length <= 1) return [Array.from(items)]; const result: T[][] = []; items.forEach((item, index) => { const rest = [...items.slice(0, index), ...items.slice(index + 1)]; for (const tail of permutations(rest)) result.push([item, ...tail]); }); return result; }
function pick<T>(items: readonly T[], random: () => number): T { return items[Math.floor(random() * items.length)]!; }
function examList(values: readonly string[]): string { return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`; }
function dayOf(slot: DayTimeSlot): 0 | 1 | 2 { return Math.floor(slot / 2) as 0 | 1 | 2; }
function timeOf(slot: DayTimeSlot): 0 | 1 { return (slot % 2) as 0 | 1; }

function materializeProfile(index: number, random: () => number): Lp010Profile {
  const template = PROFILE_TEMPLATES[index % PROFILE_TEMPLATES.length]!;
  const names = shuffle(template.people, random).slice(0, 6);
  const people = { A: names[0]!, B: names[1]!, C: names[2]!, D: names[3]!, E: names[4]!, F: names[5]! };
  const slots = {
    0: `${template.days[0]}, ${template.times[0]}`,
    1: `${template.days[0]}, ${template.times[1]}`,
    2: `${template.days[1]}, ${template.times[0]}`,
    3: `${template.days[1]}, ${template.times[1]}`,
    4: `${template.days[2]}, ${template.times[0]}`,
    5: `${template.days[2]}, ${template.times[1]}`,
  } as Record<DayTimeSlot, string>;
  return {
    id: template.id, scenario: template.scenario, personNoun: template.personNoun, eventNoun: template.eventNoun,
    people, days: template.days, times: template.times, slots,
    personQuestionTemplate: `On which day and at what time is {person}'s ${template.eventNoun} scheduled?`,
    slotQuestionTemplate: `Whose ${template.eventNoun} is scheduled on {slot}?`,
    pairQuestionTemplate: `Which of the following correctly matches two ${template.personNoun}s with their ${template.eventNoun} slots?`,
    nextQuestionTemplate: `Whose ${template.eventNoun} is scheduled immediately after {person}'s ${template.eventNoun}?`,
  };
}

const ALL_ASSIGNMENTS: readonly DayTimeAssignment[] = permutations(SLOTS).map((order) => ({ A: order[0]!, B: order[1]!, C: order[2]!, D: order[3]!, E: order[4]!, F: order[5]! }));

function satisfies(assignment: DayTimeAssignment, clue: DayTimeClue): boolean {
  if (clue.kind === "PERSON_SLOT") return assignment[clue.person] === clue.slot;
  if (clue.kind === "PERSON_DAY") return dayOf(assignment[clue.person]) === clue.dayIndex;
  if (clue.kind === "PERSON_TIME") return timeOf(assignment[clue.person]) === clue.timeIndex;
  if (clue.kind === "BEFORE") return assignment[clue.left] < assignment[clue.right];
  if (clue.kind === "BETWEEN") return Math.abs(assignment[clue.left] - assignment[clue.right]) - 1 === clue.count;
  if (clue.kind === "IMMEDIATE_BEFORE") return assignment[clue.right] - assignment[clue.left] === 1;
  if (clue.kind === "SAME_TIME") return timeOf(assignment[clue.left]) === timeOf(assignment[clue.right]);
  if (clue.kind === "SAME_DAY") return dayOf(assignment[clue.left]) === dayOf(assignment[clue.right]);
  return dayOf(assignment[clue.person]) !== clue.dayIndex;
}

export function solveLp010(input: { clues: readonly DayTimeClue[] }): DayTimeAssignment[] { return ALL_ASSIGNMENTS.filter((assignment) => input.clues.every((clue) => satisfies(assignment, clue))); }

function clueKey(clue: DayTimeClue): string {
  if (clue.kind === "PERSON_SLOT") return `${clue.kind}:${clue.person}:${clue.slot}`;
  if (clue.kind === "PERSON_DAY" || clue.kind === "NOT_DAY") return `${clue.kind}:${clue.person}:${clue.dayIndex}`;
  if (clue.kind === "PERSON_TIME") return `${clue.kind}:${clue.person}:${clue.timeIndex}`;
  if (clue.kind === "BETWEEN") return `${clue.kind}:${[clue.left, clue.right].sort().join(":")}:${clue.count}`;
  return `${clue.kind}:${clue.left}:${clue.right}`;
}

function directClue(person: DayTimePerson, assignment: DayTimeAssignment, profile: Lp010Profile): DayTimeClue {
  const slot = assignment[person];
  return { kind: "PERSON_SLOT", person, slot, text: `${profile.people[person]}'s ${profile.eventNoun} is scheduled on ${profile.slots[slot]}.` };
}

function buildCandidates(assignment: DayTimeAssignment, profile: Lp010Profile): DayTimeClue[] {
  const out: DayTimeClue[] = [];
  for (const person of PEOPLE) {
    const slot = assignment[person]; const dayIndex = dayOf(slot); const timeIndex = timeOf(slot);
    out.push(directClue(person, assignment, profile));
    out.push({ kind: "PERSON_DAY", person, dayIndex, text: `${profile.people[person]}'s ${profile.eventNoun} is scheduled on ${profile.days[dayIndex]}.` });
    out.push({ kind: "PERSON_TIME", person, timeIndex, text: `${profile.people[person]}'s ${profile.eventNoun} is scheduled at ${profile.times[timeIndex]}.` });
    for (const candidateDay of [0, 1, 2] as const) if (candidateDay !== dayIndex) out.push({ kind: "NOT_DAY", person, dayIndex: candidateDay, text: `${profile.people[person]}'s ${profile.eventNoun} is not scheduled on ${profile.days[candidateDay]}.` });
  }
  for (let i = 0; i < PEOPLE.length; i += 1) for (let j = i + 1; j < PEOPLE.length; j += 1) {
    const a = PEOPLE[i]!; const b = PEOPLE[j]!; const sa = assignment[a]; const sb = assignment[b];
    const first = sa < sb ? a : b; const second = first === a ? b : a;
    out.push({ kind: "BEFORE", left: first, right: second, text: `${profile.people[first]}'s ${profile.eventNoun} is scheduled before ${profile.people[second]}'s.` });
    const count = Math.abs(sa - sb) - 1;
    if (count >= 1) out.push({ kind: "BETWEEN", left: a, right: b, count, text: `Exactly ${count === 1 ? "one" : count} ${profile.personNoun}${count === 1 ? "" : "s"} have their ${profile.eventNoun}s between those of ${profile.people[a]} and ${profile.people[b]}.` });
    if (Math.abs(sa - sb) === 1) out.push({ kind: "IMMEDIATE_BEFORE", left: first, right: second, text: `${profile.people[second]}'s ${profile.eventNoun} is scheduled immediately after ${profile.people[first]}'s.` });
    if (timeOf(sa) === timeOf(sb)) out.push({ kind: "SAME_TIME", left: a, right: b, text: `${profile.people[a]} and ${profile.people[b]} have their ${profile.eventNoun}s at the same time of day.` });
    if (dayOf(sa) === dayOf(sb)) out.push({ kind: "SAME_DAY", left: a, right: b, text: `${profile.people[a]} and ${profile.people[b]} have their ${profile.eventNoun}s on the same day.` });
  }
  return out;
}

function minimizeUnique(clues: readonly DayTimeClue[]): DayTimeClue[] {
  const result = [...clues]; let changed = true;
  while (changed) { changed = false; for (let i = 0; i < result.length; i += 1) { const reduced = result.filter((_, index) => index !== i); if (solveLp010({ clues: reduced }).length === 1) { result.splice(i, 1); changed = true; break; } } }
  return result;
}

function essential(clues: readonly DayTimeClue[]): boolean { return clues.every((_, removed) => solveLp010({ clues: clues.filter((__, index) => index !== removed) }).length > 1); }

function chooseClues(assignment: DayTimeAssignment, profile: Lp010Profile, difficultyBand: DifficultyBand, random: () => number): DayTimeClue[] {
  if (difficultyBand === "Easy") return shuffle(PEOPLE, random).slice(0, 5).map((person) => directClue(person, assignment, profile));
  const candidates = shuffle(buildCandidates(assignment, profile), random);
  const quotas: Array<{ required: readonly DayTimeClue["kind"][]; target: number }> = difficultyBand === "Medium"
    ? [
        { required: ["PERSON_SLOT", "PERSON_TIME", "BEFORE", "NOT_DAY"], target: 6 },
        { required: ["PERSON_SLOT", "PERSON_DAY", "BETWEEN", "NOT_DAY"], target: 6 },
        { required: ["PERSON_SLOT", "PERSON_TIME", "IMMEDIATE_BEFORE", "NOT_DAY"], target: 6 },
      ]
    : [
        { required: ["PERSON_TIME", "BETWEEN", "IMMEDIATE_BEFORE", "SAME_TIME", "NOT_DAY"], target: 8 },
        { required: ["PERSON_DAY", "BETWEEN", "IMMEDIATE_BEFORE", "SAME_DAY", "NOT_DAY"], target: 8 },
      ];
  for (let attempt = 0; attempt < 5000; attempt += 1) {
    const quota = quotas[attempt % quotas.length]!; let survivors = [...ALL_ASSIGNMENTS]; const chosen: DayTimeClue[] = [];
    for (const kind of quota.required) {
      const possible = candidates.filter((candidate) => candidate.kind === kind && !chosen.some((clue) => clueKey(clue) === clueKey(candidate)))
        .map((candidate) => ({ candidate, remaining: survivors.filter((state) => satisfies(state, candidate)).length }))
        .filter((entry) => entry.remaining > 0 && entry.remaining < survivors.length).sort((a, b) => a.remaining - b.remaining);
      if (!possible.length) { chosen.length = 0; break; }
      const selected = possible[Math.floor(random() * Math.min(possible.length, difficultyBand === "Hard" ? 8 : 4))]!.candidate;
      chosen.push(selected); survivors = survivors.filter((state) => satisfies(state, selected));
    }
    while (chosen.length >= quota.required.length && chosen.length < quota.target && survivors.length > 1) {
      const possible = candidates.filter((candidate) => !chosen.some((clue) => clueKey(clue) === clueKey(candidate)))
        .map((candidate) => ({ candidate, remaining: survivors.filter((state) => satisfies(state, candidate)).length }))
        .filter((entry) => entry.remaining > 0 && entry.remaining < survivors.length).sort((a, b) => a.remaining - b.remaining);
      if (!possible.length) break;
      const selected = possible[Math.floor(random() * Math.min(possible.length, difficultyBand === "Hard" ? 10 : 4))]!.candidate;
      chosen.push(selected); survivors = survivors.filter((state) => satisfies(state, selected));
    }
    if (survivors.length !== 1 || PEOPLE.some((person) => survivors[0]![person] !== assignment[person])) continue;
    const reduced = minimizeUnique(chosen);
    if (!essential(reduced) || !quota.required.every((kind) => reduced.some((clue) => clue.kind === kind))) continue;
    const directCount = reduced.filter((clue) => clue.kind === "PERSON_SLOT").length;
    if (difficultyBand === "Medium" && directCount < 1) continue;
    if (difficultyBand === "Hard" && directCount > 1) continue;
    return reduced;
  }
  throw new Error(`Unable to build an essential unique LP-010 schedule (${profile.id}, ${difficultyBand}).`);
}

type PartialTable = Partial<Record<DayTimePerson, readonly DayTimeSlot[]>>;
function candidateTable(solutions: readonly DayTimeAssignment[]): PartialTable { const table: PartialTable = {}; for (const person of PEOPLE) table[person] = [...new Set(solutions.map((solution) => solution[person]))].sort((a, b) => a - b); return table; }
function tableMarkdown(profile: Lp010Profile, table: PartialTable): string {
  const rows = PEOPLE.map((person) => { const values = table[person] ?? []; return `| ${profile.people[person]} | ${values.length ? values.map((slot) => profile.slots[slot]).join(" / ") : "—"} |`; }).join("\n");
  return `| ${profile.personNoun[0]!.toUpperCase()}${profile.personNoun.slice(1)} | Possible day/time slot(s) |\n|---|---|\n${rows}`;
}
function explanationDetail(profile: Lp010Profile, clue: DayTimeClue, before: number, after: number): string {
  const effect = `This narrows the possible complete schedules from ${before} to ${after}.`;
  if (clue.kind === "PERSON_SLOT") return `Place ${profile.people[clue.person]} directly in ${profile.slots[clue.slot]}. ${effect}`;
  if (clue.kind === "PERSON_DAY") return `Keep ${profile.people[clue.person]} only in the two ${profile.days[clue.dayIndex]} rows. ${effect}`;
  if (clue.kind === "PERSON_TIME") return `Keep ${profile.people[clue.person]} only in the ${profile.times[clue.timeIndex]} positions. ${effect}`;
  if (clue.kind === "BEFORE") return `${profile.people[clue.left]} must appear earlier than ${profile.people[clue.right]} in chronological order. ${effect}`;
  if (clue.kind === "BETWEEN") return `${profile.people[clue.left]} and ${profile.people[clue.right]} must be ${clue.count + 1} positions apart because exactly ${clue.count} ${profile.personNoun}${clue.count === 1 ? "" : "s"} lie between them. ${effect}`;
  if (clue.kind === "IMMEDIATE_BEFORE") return `${profile.people[clue.right]} must occupy the very next chronological slot after ${profile.people[clue.left]}. ${effect}`;
  if (clue.kind === "SAME_TIME") return `${profile.people[clue.left]} and ${profile.people[clue.right]} must both use the morning-time positions or both use the later-time positions. ${effect}`;
  if (clue.kind === "SAME_DAY") return `${profile.people[clue.left]} and ${profile.people[clue.right]} must occupy the two slots of the same day. ${effect}`;
  return `Remove both ${profile.days[clue.dayIndex]} slots from ${profile.people[clue.person]}'s possibilities. ${effect}`;
}
function buildExplanation(profile: Lp010Profile, clues: readonly DayTimeClue[], finalDetail: string): { summary: string; lines: string[] } {
  const ordered = [...clues].sort((a, b) => Number(b.kind === "PERSON_SLOT") - Number(a.kind === "PERSON_SLOT"));
  let solutions = [...ALL_ASSIGNMENTS]; const lines: string[] = []; let step = 1;
  for (const clue of ordered) {
    const before = solutions.length; solutions = solutions.filter((state) => satisfies(state, clue));
    lines.push(`**Step ${step}: Use the clue — ${clue.text}**\n\n${explanationDetail(profile, clue, before, solutions.length)}\n\n${tableMarkdown(profile, candidateTable(solutions))}`); step += 1;
  }
  const finalText = finalDetail.endsWith(".") ? finalDetail : `${finalDetail}.`;
  lines.push(`**Step ${step}: Read the completed schedule**\n\nOnly one schedule remains. ${finalText}\n\n${tableMarkdown(profile, candidateTable(solutions))}`);
  return { summary: `The day-and-time clues determine one unique ${profile.eventNoun} schedule.`, lines };
}

function placeAnswer(answer: string, pool: readonly string[], targetIndex: number, random: () => number): { options: string[]; correctIndex: number } {
  const distractors = shuffle(pool.filter((value) => value !== answer), random).slice(0, 3); const options = [...distractors]; options.splice(targetIndex, 0, answer); return { options, correctIndex: targetIndex };
}
function qlStem(setup: string, clues: readonly DayTimeClue[], question: string): string { return `${setup}\n\nClues:\n${clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n${question}`; }

function buildChildren(caseletId: string, profile: Lp010Profile, setup: string, clues: readonly DayTimeClue[], assignment: DayTimeAssignment, difficultyBand: DifficultyBand, random: () => number): Lp010Child[] {
  const offset = Math.max(0, Number(caseletId.slice(-3)) - 1);
  const targetPerson = PEOPLE[offset % PEOPLE.length]!; const targetSlot = assignment[targetPerson];
  const inversePerson = PEOPLE.find((person) => assignment[person] === ((offset + 2) % 6 as DayTimeSlot))!; const inverseSlot = assignment[inversePerson];
  const pairLeft = PEOPLE[(offset + 1) % 6]!; const pairRight = PEOPLE[(offset + 4) % 6]!;
  const pairAnswer = `${profile.people[pairLeft]} — ${profile.slots[assignment[pairLeft]]}; ${profile.people[pairRight]} — ${profile.slots[assignment[pairRight]]}`;
  const pairPool = [pairAnswer,
    `${profile.people[pairLeft]} — ${profile.slots[assignment[pairRight]]}; ${profile.people[pairRight]} — ${profile.slots[assignment[pairLeft]]}`,
    `${profile.people[pairLeft]} — ${profile.slots[((assignment[pairLeft] + 1) % 6) as DayTimeSlot]}; ${profile.people[pairRight]} — ${profile.slots[assignment[pairRight]]}`,
    `${profile.people[pairLeft]} — ${profile.slots[assignment[pairLeft]]}; ${profile.people[pairRight]} — ${profile.slots[((assignment[pairRight] + 1) % 6) as DayTimeSlot]}`];
  const nextBase = PEOPLE.find((person) => assignment[person] < 5) ?? PEOPLE[0]!; const nextSlot = (assignment[nextBase] + 1) as DayTimeSlot; const nextAnswer = profile.people[PEOPLE.find((person) => assignment[person] === nextSlot)!];
  const slotChoices = placeAnswer(profile.slots[targetSlot], SLOTS.map((slot) => profile.slots[slot]), (offset + 1) % 4, random);
  const personChoices = placeAnswer(profile.people[inversePerson], PEOPLE.map((person) => profile.people[person]), offset % 4, random);
  const pairChoices = placeAnswer(pairAnswer, pairPool, (offset + 2) % 4, random);
  const nextChoices = placeAnswer(nextAnswer, PEOPLE.map((person) => profile.people[person]), (offset + 3) % 4, random);
  return [
    { questionId: `${caseletId}-Q1`, qlId: "LP-QL-037", stem: qlStem(setup, clues, profile.personQuestionTemplate.replace("{person}", profile.people[targetPerson])), options: slotChoices.options, correctIndex: slotChoices.correctIndex, answer: slotChoices.options[slotChoices.correctIndex]!, difficultyBand, misconceptionFamily: "person-slot reversal", explanation: buildExplanation(profile, clues, `${profile.people[targetPerson]} is scheduled on ${profile.slots[targetSlot]}, so that is the required slot`) },
    { questionId: `${caseletId}-Q2`, qlId: "LP-QL-038", stem: qlStem(setup, clues, profile.slotQuestionTemplate.replace("{slot}", profile.slots[inverseSlot])), options: personChoices.options, correctIndex: personChoices.correctIndex, answer: personChoices.options[personChoices.correctIndex]!, difficultyBand, misconceptionFamily: "slot-person reversal", explanation: buildExplanation(profile, clues, `${profile.people[inversePerson]} occupies ${profile.slots[inverseSlot]}`) },
    { questionId: `${caseletId}-Q3`, qlId: "LP-QL-039", stem: qlStem(setup, clues, profile.pairQuestionTemplate), options: pairChoices.options, correctIndex: pairChoices.correctIndex, answer: pairChoices.options[pairChoices.correctIndex]!, difficultyBand, misconceptionFamily: "pair-slot swap", explanation: buildExplanation(profile, clues, `The completed rows for ${profile.people[pairLeft]} and ${profile.people[pairRight]} give ${pairAnswer}`) },
    { questionId: `${caseletId}-Q4`, qlId: "LP-QL-040", stem: qlStem(setup, clues, profile.nextQuestionTemplate.replace("{person}", profile.people[nextBase])), options: nextChoices.options, correctIndex: nextChoices.correctIndex, answer: nextChoices.options[nextChoices.correctIndex]!, difficultyBand, misconceptionFamily: "immediate-vs-later", explanation: buildExplanation(profile, clues, `${profile.people[nextBase]} is in ${profile.slots[assignment[nextBase]]}; the next chronological slot is ${profile.slots[nextSlot]}, occupied by ${nextAnswer}`) },
  ];
}

export function generateLp010Batch(seed = "lp-010-review", count = 8): Lp010Caselet[] {
  const result: Lp010Caselet[] = [];
  for (let index = 0; index < count; index += 1) {
    const random = rng(`${seed}:caselet:${index}`); const profile = materializeProfile(index, random);
    const assignment = pick(shuffle(ALL_ASSIGNMENTS, random), random);
    const difficultyBand = (["Easy", "Medium", "Hard"] as const)[hashSeed(`${seed}:difficulty:${index}`) % 3]!;
    const clues = chooseClues(assignment, profile, difficultyBand, random); const caseletId = `LP-010-${String(index + 1).padStart(3, "0")}`;
    const questionSetup = `${profile.scenario} The six ${profile.personNoun}s—${examList(PEOPLE.map((person) => profile.people[person]))}—are assigned one slot each across ${examList(profile.days)}. On each day, one ${profile.eventNoun} is at ${profile.times[0]} and one is at ${profile.times[1]}. The six chronological slots are ${examList(SLOTS.map((slot) => profile.slots[slot]))}. Each ${profile.personNoun} uses exactly one slot and every slot is used once.`;
    result.push({ caseletId, scenario: profile.scenario, questionSetup, scenarioProfileId: profile.id, difficultyBand, people: PEOPLE, slots: SLOTS, labels: profile, clues, assignment, children: buildChildren(caseletId, profile, questionSetup, clues, assignment, difficultyBand, random) });
  }
  return result;
}
