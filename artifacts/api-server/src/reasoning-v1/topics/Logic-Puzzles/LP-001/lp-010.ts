import type { DifficultyBand } from "./index.ts";

export type DayTimePerson = "A" | "B" | "C" | "D" | "E" | "F";
export type DayTimeSlot = 0 | 1 | 2 | 3 | 4 | 5;
export type DayTimeAssignment = Record<DayTimePerson, DayTimeSlot>;

type TimeGroup = readonly DayTimeSlot[];

export type DayTimeClue =
  | { kind: "PERSON_SLOT"; person: DayTimePerson; slot: DayTimeSlot; text: string }
  | { kind: "PERSON_DAY"; person: DayTimePerson; dayIndex: 0 | 1 | 2; text: string }
  | { kind: "PERSON_TIME"; person: DayTimePerson; timeLabel: string; matchingSlots: TimeGroup; text: string }
  | { kind: "BEFORE"; left: DayTimePerson; right: DayTimePerson; text: string }
  | { kind: "BETWEEN"; left: DayTimePerson; right: DayTimePerson; count: number; text: string }
  | { kind: "IMMEDIATE_BEFORE"; left: DayTimePerson; right: DayTimePerson; text: string }
  | { kind: "SAME_TIME"; left: DayTimePerson; right: DayTimePerson; timeGroups: readonly TimeGroup[]; text: string }
  | { kind: "SAME_DAY"; left: DayTimePerson; right: DayTimePerson; text: string }
  | { kind: "NOT_DAY"; person: DayTimePerson; dayIndex: 0 | 1 | 2; text: string };

export type Lp010Profile = {
  id: string;
  scenario: string;
  personNoun: string;
  eventNoun: string;
  people: Record<DayTimePerson, string>;
  days: readonly [string, string, string];
  times: readonly string[];
  slotTimes: Record<DayTimeSlot, string>;
  timePatternId: string;
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
  { id: "STUDENT_PRESENTATIONS", scenario: "Six students are scheduled to give presentations at a college.", personNoun: "student", eventNoun: "presentation", days: ["Tuesday", "Wednesday", "Friday"] as const, people: ["Aarav", "Bhavna", "Chetan", "Diya", "Eshan", "Farah", "Gaurav", "Hina", "Ishan", "Jyoti", "Karan", "Meera"] },
  { id: "INTERVIEW_SCHEDULE", scenario: "A recruitment board is scheduling interviews for six applicants.", personNoun: "applicant", eventNoun: "interview", days: ["Monday", "Wednesday", "Friday"] as const, people: ["Aditi", "Bharat", "Charu", "Dev", "Ira", "Kabir", "Leena", "Mohit", "Neha", "Parth", "Ritu", "Sahil"] },
  { id: "TRAINING_DEMOS", scenario: "Six trainees are scheduled to give practical demonstrations at a training institute.", personNoun: "trainee", eventNoun: "demonstration", days: ["Tuesday", "Thursday", "Saturday"] as const, people: ["Anaya", "Bimal", "Deepa", "Harsh", "Kriti", "Manav", "Naman", "Ojas", "Pooja", "Ravi", "Simran", "Tanvi"] },
  { id: "COUNSELLING_APPOINTMENTS", scenario: "Six candidates are scheduled for counselling appointments.", personNoun: "candidate", eventNoun: "counselling appointment", days: ["Monday", "Tuesday", "Thursday"] as const, people: ["Asha", "Bikram", "Deepak", "Esha", "Harish", "Jyoti", "Kiran", "Mona", "Naveen", "Reema", "Sahil", "Tina"] },
  { id: "REVIEW_MEETINGS", scenario: "A bank is scheduling review meetings for six officers.", personNoun: "officer", eventNoun: "review meeting", days: ["Monday", "Thursday", "Friday"] as const, people: ["Kamal", "Lata", "Mohit", "Nisha", "Omkar", "Priya", "Rahul", "Simran", "Tarun", "Zoya", "Arjun", "Leela"] },
  { id: "RESEARCH_PRESENTATIONS", scenario: "Six researchers are scheduled to give presentations at a university.", personNoun: "researcher", eventNoun: "presentation", days: ["Wednesday", "Friday", "Saturday"] as const, people: ["Alok", "Beena", "Dinesh", "Farah", "Gopal", "Harini", "Irfan", "Juhi", "Kartik", "Leela", "Nitin", "Rupa"] },
] as const;

const TIME_PATTERNS = [
  { id: "REPEATED_PAIR_0900_1400", times: ["9:00 AM", "2:00 PM", "9:00 AM", "2:00 PM", "9:00 AM", "2:00 PM"] },
  { id: "MIXED_FOUR_0900_1400", times: ["9:00 AM", "2:00 PM", "9:00 AM", "3:00 PM", "10:00 AM", "3:00 PM"] },
  { id: "MIXED_FIVE_0900_1300", times: ["9:00 AM", "1:00 PM", "10:00 AM", "2:00 PM", "11:00 AM", "2:00 PM"] },
  { id: "DISTINCT_SIX_0800_1500", times: ["8:00 AM", "1:00 PM", "9:00 AM", "2:00 PM", "10:00 AM", "3:00 PM"] },
  { id: "REPEATED_PAIR_1000_1600", times: ["10:00 AM", "4:00 PM", "10:00 AM", "4:00 PM", "10:00 AM", "4:00 PM"] },
  { id: "MIXED_FOUR_HALF_HOUR", times: ["8:30 AM", "1:30 PM", "9:30 AM", "1:30 PM", "9:30 AM", "2:30 PM"] },
  { id: "MIXED_FIVE_HALF_HOUR", times: ["8:30 AM", "12:30 PM", "9:30 AM", "1:30 PM", "10:30 AM", "1:30 PM"] },
  { id: "DISTINCT_SIX_HALF_HOUR", times: ["8:30 AM", "12:30 PM", "9:30 AM", "1:30 PM", "10:30 AM", "2:30 PM"] },
  { id: "REPEATED_PAIR_0930_1530", times: ["9:30 AM", "3:30 PM", "9:30 AM", "3:30 PM", "9:30 AM", "3:30 PM"] },
  { id: "MIXED_FOUR_1000_1430", times: ["10:00 AM", "2:30 PM", "10:30 AM", "3:30 PM", "10:30 AM", "2:30 PM"] },
  { id: "MIXED_FIVE_1000_1600", times: ["10:00 AM", "3:00 PM", "11:00 AM", "4:00 PM", "12:00 PM", "4:00 PM"] },
  { id: "DISTINCT_SIX_0900_1600", times: ["9:00 AM", "2:00 PM", "10:00 AM", "3:00 PM", "11:00 AM", "4:00 PM"] },
] as const satisfies readonly { id: string; times: readonly [string, string, string, string, string, string] }[];

function hashSeed(value: string): number { let hash = 2166136261; for (const char of value) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); } return hash >>> 0; }
function rng(seed: string) { let state = hashSeed(seed) || 1; return () => { state = Math.imul(state ^ (state >>> 15), 2246822519) >>> 0; state = Math.imul(state ^ (state >>> 13), 3266489917) >>> 0; return ((state ^ (state >>> 16)) >>> 0) / 4294967296; }; }
function shuffle<T>(items: readonly T[], random: () => number): T[] { const result = [...items]; for (let i = result.length - 1; i > 0; i -= 1) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j]!, result[i]!]; } return result; }
function permutations<T>(items: readonly T[]): T[][] { if (items.length <= 1) return [Array.from(items)]; const result: T[][] = []; items.forEach((item, index) => { const rest = [...items.slice(0, index), ...items.slice(index + 1)]; for (const tail of permutations(rest)) result.push([item, ...tail]); }); return result; }
function pick<T>(items: readonly T[], random: () => number): T { return items[Math.floor(random() * items.length)]!; }
function examList(values: readonly string[]): string { return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`; }
function dayOf(slot: DayTimeSlot): 0 | 1 | 2 { return Math.floor(slot / 2) as 0 | 1 | 2; }

function uniqueInOrder(values: readonly string[]): string[] { return values.filter((value, index) => values.indexOf(value) === index); }
function timeGroups(profile: Lp010Profile): readonly TimeGroup[] {
  return profile.times.map((time) => SLOTS.filter((slot) => profile.slotTimes[slot] === time)).filter((group) => group.length >= 2);
}

function materializeProfile(index: number, random: () => number, patternIndex: number): Lp010Profile {
  const template = PROFILE_TEMPLATES[index % PROFILE_TEMPLATES.length]!;
  const pattern = TIME_PATTERNS[patternIndex % TIME_PATTERNS.length]!;
  const names = shuffle(template.people, random).slice(0, 6);
  const people = { A: names[0]!, B: names[1]!, C: names[2]!, D: names[3]!, E: names[4]!, F: names[5]! };
  const slotTimes = { 0: pattern.times[0], 1: pattern.times[1], 2: pattern.times[2], 3: pattern.times[3], 4: pattern.times[4], 5: pattern.times[5] } as Record<DayTimeSlot, string>;
  const slots = {
    0: `${template.days[0]} at ${slotTimes[0]}`,
    1: `${template.days[0]} at ${slotTimes[1]}`,
    2: `${template.days[1]} at ${slotTimes[2]}`,
    3: `${template.days[1]} at ${slotTimes[3]}`,
    4: `${template.days[2]} at ${slotTimes[4]}`,
    5: `${template.days[2]} at ${slotTimes[5]}`,
  } as Record<DayTimeSlot, string>;
  return {
    id: template.id, scenario: template.scenario, personNoun: template.personNoun, eventNoun: template.eventNoun,
    people, days: template.days, times: uniqueInOrder(pattern.times), slotTimes, timePatternId: pattern.id, slots,
    personQuestionTemplate: `When is {person} scheduled?`,
    slotQuestionTemplate: `Who is scheduled on {slot}?`,
    pairQuestionTemplate: `Which of the following correctly matches two ${template.personNoun}s with their scheduled day and time?`,
    nextQuestionTemplate: `Who is scheduled immediately after {person}?`,
  };
}

const ALL_ASSIGNMENTS: readonly DayTimeAssignment[] = permutations(SLOTS).map((order) => ({ A: order[0]!, B: order[1]!, C: order[2]!, D: order[3]!, E: order[4]!, F: order[5]! }));

function satisfies(assignment: DayTimeAssignment, clue: DayTimeClue): boolean {
  if (clue.kind === "PERSON_SLOT") return assignment[clue.person] === clue.slot;
  if (clue.kind === "PERSON_DAY") return dayOf(assignment[clue.person]) === clue.dayIndex;
  if (clue.kind === "PERSON_TIME") return clue.matchingSlots.includes(assignment[clue.person]);
  if (clue.kind === "BEFORE") return assignment[clue.left] < assignment[clue.right];
  if (clue.kind === "BETWEEN") return Math.abs(assignment[clue.left] - assignment[clue.right]) - 1 === clue.count;
  if (clue.kind === "IMMEDIATE_BEFORE") return assignment[clue.right] - assignment[clue.left] === 1;
  if (clue.kind === "SAME_TIME") return clue.timeGroups.some((group) => group.includes(assignment[clue.left]) && group.includes(assignment[clue.right]));
  if (clue.kind === "SAME_DAY") return dayOf(assignment[clue.left]) === dayOf(assignment[clue.right]);
  return dayOf(assignment[clue.person]) !== clue.dayIndex;
}

export function solveLp010(input: { clues: readonly DayTimeClue[] }): DayTimeAssignment[] { return ALL_ASSIGNMENTS.filter((assignment) => input.clues.every((clue) => satisfies(assignment, clue))); }

function clueKey(clue: DayTimeClue): string {
  if (clue.kind === "PERSON_SLOT") return `${clue.kind}:${clue.person}:${clue.slot}`;
  if (clue.kind === "PERSON_DAY" || clue.kind === "NOT_DAY") return `${clue.kind}:${clue.person}:${clue.dayIndex}`;
  if (clue.kind === "PERSON_TIME") return `${clue.kind}:${clue.person}:${clue.timeLabel}`;
  if (clue.kind === "BETWEEN") return `${clue.kind}:${[clue.left, clue.right].sort().join(":")}:${clue.count}`;
  return `${clue.kind}:${clue.left}:${clue.right}`;
}

function directClue(person: DayTimePerson, assignment: DayTimeAssignment, profile: Lp010Profile): DayTimeClue {
  const slot = assignment[person];
  return { kind: "PERSON_SLOT", person, slot, text: `${profile.people[person]} is scheduled on ${profile.slots[slot]}.` };
}

function buildCandidates(assignment: DayTimeAssignment, profile: Lp010Profile): DayTimeClue[] {
  const out: DayTimeClue[] = [];
  const groups = timeGroups(profile);
  for (const person of PEOPLE) {
    const slot = assignment[person]; const dayIndex = dayOf(slot); const timeLabel = profile.slotTimes[slot];
    const matchingSlots = SLOTS.filter((candidate) => profile.slotTimes[candidate] === timeLabel);
    out.push(directClue(person, assignment, profile));
    out.push({ kind: "PERSON_DAY", person, dayIndex, text: `${profile.people[person]} is scheduled on ${profile.days[dayIndex]}.` });
    out.push({ kind: "PERSON_TIME", person, timeLabel, matchingSlots, text: `${profile.people[person]} is scheduled at ${timeLabel}.` });
    for (const candidateDay of [0, 1, 2] as const) if (candidateDay !== dayIndex) out.push({ kind: "NOT_DAY", person, dayIndex: candidateDay, text: `${profile.people[person]} is not scheduled on ${profile.days[candidateDay]}.` });
  }
  for (let i = 0; i < PEOPLE.length; i += 1) for (let j = i + 1; j < PEOPLE.length; j += 1) {
    const a = PEOPLE[i]!; const b = PEOPLE[j]!; const sa = assignment[a]; const sb = assignment[b];
    const first = sa < sb ? a : b; const second = first === a ? b : a;
    out.push({ kind: "BEFORE", left: first, right: second, text: `${profile.people[first]} is scheduled before ${profile.people[second]}.` });
    const count = Math.abs(sa - sb) - 1;
    if (count >= 1) out.push({ kind: "BETWEEN", left: a, right: b, count, text: `There ${count === 1 ? "is" : "are"} exactly ${count === 1 ? "one slot" : `${count} slots`} between ${profile.people[a]} and ${profile.people[b]}.` });
    if (Math.abs(sa - sb) === 1) out.push({ kind: "IMMEDIATE_BEFORE", left: first, right: second, text: `${profile.people[second]} is scheduled immediately after ${profile.people[first]}.` });
    if (profile.slotTimes[sa] === profile.slotTimes[sb] && dayOf(sa) !== dayOf(sb)) out.push({ kind: "SAME_TIME", left: a, right: b, timeGroups: groups, text: `${profile.people[a]} and ${profile.people[b]} are scheduled at the same time on different days.` });
    if (dayOf(sa) === dayOf(sb)) out.push({ kind: "SAME_DAY", left: a, right: b, text: `${profile.people[a]} and ${profile.people[b]} are scheduled on the same day.` });
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
  if (difficultyBand === "Easy") {
    const directPeople = shuffle(PEOPLE, random).slice(0, 4);
    const remaining = PEOPLE.filter((person) => !directPeople.includes(person));
    const first = assignment[remaining[0]!] < assignment[remaining[1]!] ? remaining[0]! : remaining[1]!;
    const second = first === remaining[0] ? remaining[1]! : remaining[0]!;
    return [...directPeople.map((person) => directClue(person, assignment, profile)), { kind: "BEFORE", left: first, right: second, text: `${profile.people[first]} is scheduled before ${profile.people[second]}.` }];
  }
  const candidates = shuffle(buildCandidates(assignment, profile), random);
  const uniqueTimeCount = profile.times.length;
  const hasRepeatedTime = timeGroups(profile).length > 0;
  const mediumQuotas: Array<{ required: readonly DayTimeClue["kind"][]; target: number }> = uniqueTimeCount >= 5
    ? [
        { required: ["PERSON_SLOT", "PERSON_DAY", "BETWEEN", "NOT_DAY"], target: 6 },
        { required: ["PERSON_SLOT", "PERSON_DAY", "IMMEDIATE_BEFORE", "NOT_DAY"], target: 6 },
      ]
    : [
        { required: ["PERSON_SLOT", "PERSON_TIME", "BEFORE", "NOT_DAY"], target: 6 },
        { required: ["PERSON_SLOT", "PERSON_DAY", "BETWEEN", "NOT_DAY"], target: 6 },
        { required: ["PERSON_SLOT", "PERSON_TIME", "IMMEDIATE_BEFORE", "NOT_DAY"], target: 6 },
      ];
  const hardQuotas: Array<{ required: readonly DayTimeClue["kind"][]; target: number }> = hasRepeatedTime
    ? [
        { required: ["PERSON_TIME", "BETWEEN", "IMMEDIATE_BEFORE", "SAME_TIME", "NOT_DAY"], target: 8 },
        { required: ["PERSON_DAY", "BETWEEN", "IMMEDIATE_BEFORE", "SAME_DAY", "NOT_DAY"], target: 8 },
      ]
    : [
        { required: ["PERSON_DAY", "BETWEEN", "IMMEDIATE_BEFORE", "SAME_DAY", "NOT_DAY"], target: 8 },
        { required: ["PERSON_DAY", "BEFORE", "IMMEDIATE_BEFORE", "SAME_DAY", "NOT_DAY"], target: 8 },
      ];
  const quotas = difficultyBand === "Medium" ? mediumQuotas : hardQuotas;
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
  throw new Error(`Unable to build an essential unique LP-010 schedule (${profile.id}, ${profile.timePatternId}, ${difficultyBand}).`);
}

type PartialTable = Partial<Record<DayTimePerson, readonly DayTimeSlot[]>>;
function candidateTable(solutions: readonly DayTimeAssignment[]): PartialTable { const table: PartialTable = {}; for (const person of PEOPLE) table[person] = [...new Set(solutions.map((solution) => solution[person]))].sort((a, b) => a - b); return table; }
function tableMarkdown(profile: Lp010Profile, table: PartialTable): string {
  const rows = PEOPLE.map((person) => { const values = table[person] ?? []; return `| ${profile.people[person]} | ${values.length ? values.map((slot) => profile.slots[slot]).join(" / ") : "—"} |`; }).join("\n");
  return `| ${profile.personNoun[0]!.toUpperCase()}${profile.personNoun.slice(1)} | Possible day/time slot(s) |\n|---|---|\n${rows}`;
}
function explanationDetail(profile: Lp010Profile, clue: DayTimeClue): string {
  if (clue.kind === "PERSON_SLOT") return `${profile.people[clue.person]} is fixed at ${profile.slots[clue.slot]}.`;
  if (clue.kind === "PERSON_DAY") return `${profile.people[clue.person]} can be in only one of the two ${profile.days[clue.dayIndex]} slots.`;
  if (clue.kind === "PERSON_TIME") return clue.matchingSlots.length === 1 ? `Only one listed slot is at ${clue.timeLabel}, so ${profile.people[clue.person]} is fixed there.` : `${profile.people[clue.person]} must be in one of the listed slots at ${clue.timeLabel}.`;
  if (clue.kind === "BEFORE") return `${profile.people[clue.left]} must come earlier than ${profile.people[clue.right]} when the six slots are read in order.`;
  if (clue.kind === "BETWEEN") return `The positions of ${profile.people[clue.left]} and ${profile.people[clue.right]} must differ by ${clue.count + 1}.`;
  if (clue.kind === "IMMEDIATE_BEFORE") return `${profile.people[clue.left]} and ${profile.people[clue.right]} must occupy consecutive slots, with ${profile.people[clue.left]} first.`;
  if (clue.kind === "SAME_TIME") return `${profile.people[clue.left]} and ${profile.people[clue.right]} must occupy two different-day slots carrying the same clock time.`;
  if (clue.kind === "SAME_DAY") return `${profile.people[clue.left]} and ${profile.people[clue.right]} must occupy the two slots of the same day.`;
  return `Both ${profile.days[clue.dayIndex]} slots are removed from ${profile.people[clue.person]}'s possibilities.`;
}
function buildExplanation(profile: Lp010Profile, clues: readonly DayTimeClue[], finalDetail: string): { summary: string; lines: string[] } {
  const ordered = [...clues].sort((a, b) => Number(b.kind === "PERSON_SLOT") - Number(a.kind === "PERSON_SLOT"));
  let solutions = [...ALL_ASSIGNMENTS]; const lines: string[] = []; let step = 1;
  for (const clue of ordered) {
    solutions = solutions.filter((state) => satisfies(state, clue));
    lines.push(`**Step ${step}: Use the clue — ${clue.text}**\n\n${explanationDetail(profile, clue)}\n\n${tableMarkdown(profile, candidateTable(solutions))}`); step += 1;
  }
  const finalText = finalDetail.endsWith(".") ? finalDetail : `${finalDetail}.`;
  lines.push(`**Step ${step}: Read the completed schedule**\n\nThe schedule is now fixed. ${finalText}\n\n${tableMarkdown(profile, candidateTable(solutions))}`);
  return { summary: `The clues determine one unique day-and-time schedule.`, lines };
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
    { questionId: `${caseletId}-Q1`, qlId: "LP-QL-037", stem: qlStem(setup, clues, profile.personQuestionTemplate.replace("{person}", profile.people[targetPerson])), options: slotChoices.options, correctIndex: slotChoices.correctIndex, answer: slotChoices.options[slotChoices.correctIndex]!, difficultyBand, misconceptionFamily: "person-slot reversal", explanation: buildExplanation(profile, clues, `${profile.people[targetPerson]} is scheduled on ${profile.slots[targetSlot]}, so that is the required day and time`) },
    { questionId: `${caseletId}-Q2`, qlId: "LP-QL-038", stem: qlStem(setup, clues, profile.slotQuestionTemplate.replace("{slot}", profile.slots[inverseSlot])), options: personChoices.options, correctIndex: personChoices.correctIndex, answer: personChoices.options[personChoices.correctIndex]!, difficultyBand, misconceptionFamily: "slot-person reversal", explanation: buildExplanation(profile, clues, `${profile.people[inversePerson]} is scheduled on ${profile.slots[inverseSlot]}`) },
    { questionId: `${caseletId}-Q3`, qlId: "LP-QL-039", stem: qlStem(setup, clues, profile.pairQuestionTemplate), options: pairChoices.options, correctIndex: pairChoices.correctIndex, answer: pairChoices.options[pairChoices.correctIndex]!, difficultyBand, misconceptionFamily: "pair-slot swap", explanation: buildExplanation(profile, clues, `The completed schedule gives ${pairAnswer}`) },
    { questionId: `${caseletId}-Q4`, qlId: "LP-QL-040", stem: qlStem(setup, clues, profile.nextQuestionTemplate.replace("{person}", profile.people[nextBase])), options: nextChoices.options, correctIndex: nextChoices.correctIndex, answer: nextChoices.options[nextChoices.correctIndex]!, difficultyBand, misconceptionFamily: "immediate-vs-later", explanation: buildExplanation(profile, clues, `${profile.people[nextBase]} is scheduled on ${profile.slots[assignment[nextBase]]}; the next slot is ${profile.slots[nextSlot]}, where ${nextAnswer} is scheduled`) },
  ];
}

export function generateLp010Batch(seed = "lp-010-review", count = 8): Lp010Caselet[] {
  const result: Lp010Caselet[] = [];
  const patternOffset = hashSeed(`${seed}:time-pattern-offset`) % TIME_PATTERNS.length;
  for (let index = 0; index < count; index += 1) {
    const random = rng(`${seed}:caselet:${index}`); const profile = materializeProfile(index, random, patternOffset + index);
    const assignment = pick(shuffle(ALL_ASSIGNMENTS, random), random);
    const difficultyBand = (["Easy", "Medium", "Hard"] as const)[hashSeed(`${seed}:difficulty:${index}`) % 3]!;
    const clues = chooseClues(assignment, profile, difficultyBand, random); const caseletId = `LP-010-${String(index + 1).padStart(3, "0")}`;
    const questionSetup = `${profile.scenario} The six ${profile.personNoun}s are ${examList(PEOPLE.map((person) => profile.people[person]))}. The schedule covers ${examList(profile.days)}, with two slots on each day. The six day-time slots, in order, are ${examList(SLOTS.map((slot) => profile.slots[slot]))}. Each ${profile.personNoun} is assigned exactly one slot, and no two ${profile.personNoun}s share a slot.`;
    result.push({ caseletId, scenario: profile.scenario, questionSetup, scenarioProfileId: profile.id, difficultyBand, people: PEOPLE, slots: SLOTS, labels: profile, clues, assignment, children: buildChildren(caseletId, profile, questionSetup, clues, assignment, difficultyBand, random) });
  }
  return result;
}
