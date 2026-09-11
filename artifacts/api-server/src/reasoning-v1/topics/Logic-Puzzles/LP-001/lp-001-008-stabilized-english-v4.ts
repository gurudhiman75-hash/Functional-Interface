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

export const LP_001_008_STABILIZED_ENGLISH_V4 = Object.freeze({
  authorityId: "LP_001_008_STABILIZED_ENGLISH_V4" as const,
  parentAuthority: "LP_001_008_STABILIZED_ENGLISH_V2" as const,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  setupContract: "EXPLICIT_ALL_DOMAINS" as const,
  explanationStyle: "DEPENDENCY_DRIVEN_PROGRESSIVE_TABLES_WITH_GENUINE_CASES" as const,
  clueOrder: "BEST_ANCHOR_THEN_CONNECTED_HIGH_INFORMATION_CLUES" as const,
  unresolvedPlaceholder: "?" as const,
  changesPuzzleSemantics: false as const,
  changesSetupCopy: true as const,
  changesDisplayedClueOrder: false as const,
  changesExplanationClueOrder: true as const,
  changesOptions: false as const,
  changesAnswer: false as const,
  changesCorrectIndex: false as const,
  changesDifficulty: false as const,
});

type ChildLike = { answer: string; explanation: { summary: string; lines: string[] } };
type PlannedClue<Clue> = { clue: Clue; originalIndex: number };

const STEP_HEADINGS = ["Start with", "Now use", "Next take", "Then apply"] as const;
const TABLE_LEADS = ["The table becomes:", "We can now write:", "This updates the table to:", "So far, the table is:"] as const;
const CASE_LEADS = ["Only two arrangements are left, so check both cases.", "The clues now leave two possible arrangements.", "At this point, only two cases remain.", "We are down to two possible cases."] as const;
const FINAL_LEADS = ["The completed table is:", "So the final arrangement is:", "Now the whole table is fixed:", "The final table is:"] as const;

function hash(text: string): number { let value = 2166136261; for (let index = 0; index < text.length; index += 1) { value ^= text.charCodeAt(index); value = Math.imul(value, 16777619); } return value >>> 0; }
function pick<T>(values: readonly T[], key: string): T { return values[hash(key) % values.length]!; }
function markdownTable(headers: readonly string[], rows: readonly (readonly string[])[]): string { return [`| ${headers.join(" | ")} |`, `|${headers.map(() => "---").join("|")}|`, ...rows.map((row) => `| ${row.join(" | ")} |`)].join("\n"); }
function naturalList(values: readonly string[]): string { if (values.length <= 1) return values[0] ?? ""; if (values.length === 2) return `${values[0]} and ${values[1]}`; return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`; }
function expandScenario(base: string, lines: readonly string[]): string { return `${base} ${lines.join(" ")}`.replace(/\s+/gu, " ").trim(); }

function clueTokens(clue: unknown): Set<string> {
  const tokens = new Set<string>();
  if (!clue || typeof clue !== "object") return tokens;
  for (const [key, value] of Object.entries(clue as Record<string, unknown>)) {
    if (key === "text" || key === "kind") continue;
    if (typeof value === "string") tokens.add(value);
  }
  return tokens;
}
function intersects(left: ReadonlySet<string>, right: ReadonlySet<string>): boolean { for (const value of left) if (right.has(value)) return true; return false; }
function unionTokens<Clue>(items: readonly PlannedClue<Clue>[]): Set<string> { const result = new Set<string>(); for (const item of items) for (const token of clueTokens(item.clue)) result.add(token); return result; }
function fixedCellCount(table: string): number { const rows = table.split("\n").slice(2); let count = 0; for (const row of rows) { const cells = row.split("|").slice(1, -1).map((cell) => cell.trim()); for (const cell of cells.slice(1)) if (cell !== "?" && !cell.includes(" / ")) count += 1; } return count; }
function chooseFinalClue<State, Clue>(clues: readonly Clue[], solve: (clues: readonly Clue[]) => State[]): number { const candidates = clues.map((_, index) => ({ index, survivors: solve(clues.filter((__, clueIndex) => clueIndex !== index)).length })).filter((entry) => entry.survivors > 1); const exactTwo = candidates.filter((entry) => entry.survivors === 2); const pool = exactTwo.length ? exactTwo : candidates; return [...pool].sort((a, b) => a.survivors - b.survivors || a.index - b.index)[0]?.index ?? clues.length - 1; }
function planClues<State, Clue>(input: { clues: readonly Clue[]; solve: (clues: readonly Clue[]) => State[]; workingTable: (states: readonly State[]) => string }): PlannedClue<Clue>[] {
  if (input.clues.length <= 1) return input.clues.map((clue, originalIndex) => ({ clue, originalIndex }));
  const finalIndex = chooseFinalClue(input.clues, input.solve);
  const unused = input.clues.map((clue, originalIndex) => ({ clue, originalIndex })).filter((item) => item.originalIndex !== finalIndex);
  const planned: PlannedClue<Clue>[] = [];
  let selectedClues: Clue[] = [];
  let states = input.solve([]);
  while (unused.length) {
    const beforeFixed = fixedCellCount(input.workingTable(states));
    const usedTokens = unionTokens(planned);
    let bestPosition = 0;
    let bestScore = Number.NEGATIVE_INFINITY;
    for (let position = 0; position < unused.length; position += 1) {
      const item = unused[position]!;
      const after = input.solve([...selectedClues, item.clue]);
      if (!after.length) continue;
      const afterFixed = fixedCellCount(input.workingTable(after));
      const fixedGain = afterFixed - beforeFixed;
      const reduction = states.length > 0 ? Math.log(states.length / after.length) : 0;
      const connected = planned.length && intersects(usedTokens, clueTokens(item.clue)) ? 1 : 0;
      let lookaheadGain = 0;
      for (let otherPosition = 0; otherPosition < unused.length; otherPosition += 1) {
        if (otherPosition === position) continue;
        const other = unused[otherPosition]!;
        if (!intersects(clueTokens(item.clue), clueTokens(other.clue))) continue;
        const afterTwo = input.solve([...selectedClues, item.clue, other.clue]);
        if (!afterTwo.length) continue;
        lookaheadGain = Math.max(lookaheadGain, fixedCellCount(input.workingTable(afterTwo)) - beforeFixed);
      }
      const tokenFrequency = [...clueTokens(item.clue)].reduce((sum, token) => sum + unused.filter((candidate) => clueTokens(candidate.clue).has(token)).length, 0);
      const score = fixedGain * 1_000_000 + lookaheadGain * 100_000 + connected * 10_000 + tokenFrequency * 100 + reduction;
      if (score > bestScore) { bestScore = score; bestPosition = position; }
    }
    const [next] = unused.splice(bestPosition, 1);
    planned.push(next!);
    selectedClues = [...selectedClues, next!.clue];
    states = input.solve(selectedClues);
  }
  planned.push({ clue: input.clues[finalIndex]!, originalIndex: finalIndex });
  return planned;
}
function candidateCell<State>(states: readonly State[], read: (state: State) => string, fullDomain: readonly string[]): string { if (!states.length) return "?"; const values = [...new Set(states.map(read))]; if (values.length === 1) return values[0]!; const ordered = fullDomain.filter((value) => values.includes(value)); if (ordered.length === fullDomain.length) return "?"; return ordered.join(" / "); }
function stepLead<Clue>(pending: readonly PlannedClue<Clue>[], clueText: (clue: Clue) => string, key: string): string { if (pending.length === 1) return `${pick(STEP_HEADINGS, key)} this clue — ${clueText(pending[0]!.clue)}`; const sentences = pending.map((item, index) => `${index === 0 ? "First" : "Then"}: ${clueText(item.clue)}`); return `Use these connected clues in this order:\n\n${sentences.join("\n\n")}`; }
function buildExplanation<State, Clue>(input: { key: string; clues: readonly Clue[]; clueText: (clue: Clue) => string; solve: (clues: readonly Clue[]) => State[]; workingTable: (states: readonly State[]) => string; fullTable: (state: State) => string; finalState: State }): string[] {
  const planned = planClues({ clues: input.clues, solve: input.solve, workingTable: input.workingTable });
  const lines: string[] = [];
  let applied: Clue[] = [];
  let states = input.solve([]);
  let pending: PlannedClue<Clue>[] = [];
  let stepNumber = 1;
  let caseShown = false;
  for (let index = 0; index < planned.length; index += 1) {
    const item = planned[index]!;
    const beforeTable = input.workingTable(states);
    pending.push(item);
    applied = [...applied, item.clue];
    const afterStates = input.solve(applied);
    const afterTable = input.workingTable(afterStates);
    const tableChanged = beforeTable !== afterTable;
    const isLast = index === planned.length - 1;
    if (!tableChanged && !isLast) { states = afterStates; continue; }
    const key = `${input.key}:step:${stepNumber}`;
    let body = `${stepLead(pending, input.clueText, `${key}:lead`)}\n\n${pick(TABLE_LEADS, `${key}:table`)}\n\n${afterTable}`;
    if (!caseShown && afterStates.length === 2 && !isLast) { body += `\n\n${pick(CASE_LEADS, `${key}:cases`)}\n\n**Case 1**\n\n${input.fullTable(afterStates[0]!)}\n\n**Case 2**\n\n${input.fullTable(afterStates[1]!)}`; caseShown = true; }
    if (isLast && states.length === 2 && afterStates.length === 1) {
      if (!caseShown) body = `${pick(CASE_LEADS, `${key}:last-cases`)}\n\n**Case 1**\n\n${input.fullTable(states[0]!)}\n\n**Case 2**\n\n${input.fullTable(states[1]!)}\n\n${stepLead(pending, input.clueText, `${key}:lead`)}`;
      const surviving = JSON.stringify(afterStates[0]) === JSON.stringify(states[0]) ? "Case 1" : "Case 2";
      const rejected = surviving === "Case 1" ? "Case 2" : "Case 1";
      body += `\n\nThis clue rules out ${rejected}. Keep ${surviving}.`;
    }
    lines.push(`**Step ${stepNumber}**\n\n${body}`);
    pending = [];
    states = afterStates;
    stepNumber += 1;
  }
  lines.push(`**Step ${stepNumber}: Complete the arrangement**\n\n${pick(FINAL_LEADS, `${input.key}:final`)}\n\n${input.fullTable(input.finalState)}`);
  return lines;
}
function withChildAnswers<T extends ChildLike>(children: readonly T[], shared: readonly string[]): T[] { return children.map((child) => ({ ...child, explanation: { summary: `Use the strongest clues first and fill the table as information becomes fixed. The required answer is ${child.answer}.`, lines: [...shared, `**Step ${shared.length + 1}: Answer the question**\n\nFrom the completed table, the answer is **${child.answer}**.`] } })); }

function lp001WorkingTable(caselet: Caselet, states: readonly Assignment[]): string { const domain = caselet.groups.map((group) => caselet.groupLabels[group]); return markdownTable(["Person", "Panel / group"], caselet.people.map((person) => [person, candidateCell(states, (state) => caselet.groupLabels[state[person]!], domain)])); }
function lp001FullTable(caselet: Caselet, state: Assignment): string { return markdownTable(["Person", "Panel / group"], caselet.people.map((person) => [person, caselet.groupLabels[state[person]!]])); }
function simplifyLp001(caselet: Caselet): Caselet { const scenario = expandScenario(caselet.scenario, [`They are ${naturalList(caselet.people)}.`, `The three panels/groups are ${naturalList(caselet.groups.map((group) => caselet.groupLabels[group]))}.`, "Each panel/group has exactly two people."]); const shared = buildExplanation({ key: `LP-001:${caselet.caseletId}`, clues: caselet.clues, clueText: (clue) => clue.text, solve: (clues) => solveCaselet({ people: caselet.people, clues }), workingTable: (states) => lp001WorkingTable(caselet, states), fullTable: (state) => lp001FullTable(caselet, state), finalState: caselet.assignment }); return { ...caselet, scenario, children: withChildAnswers(caselet.children, shared) }; }
function lp002WorkingTable(caselet: Lp002Caselet, states: readonly MultiAttributeAssignment[]): string { const days = [...caselet.days]; const locations = caselet.locations.map((location) => caselet.locationLabels[location]); return markdownTable(["Person", "Day", "Location"], caselet.people.map((person) => [person, candidateCell(states, (state) => state.dayByPerson[person]!, days), candidateCell(states, (state) => caselet.locationLabels[state.locationByPerson[person]!]!, locations)])); }
function lp002FullTable(caselet: Lp002Caselet, state: MultiAttributeAssignment): string { return markdownTable(["Person", "Day", "Location"], caselet.people.map((person) => [person, state.dayByPerson[person]!, caselet.locationLabels[state.locationByPerson[person]!]!])); }
function simplifyLp002(caselet: Lp002Caselet): Lp002Caselet { const scenario = expandScenario(caselet.scenario, [`The four people are ${naturalList(caselet.people)}.`, `The four days are ${naturalList(caselet.days)}.`, `The four locations, in the stated route/order, are ${naturalList(caselet.locations.map((location) => caselet.locationLabels[location]))}.`, "Each person has one different day and one different location."]); const shared = buildExplanation({ key: `LP-002:${caselet.caseletId}`, clues: caselet.clues, clueText: (clue) => clue.text, solve: (clues) => solveLp002({ people: caselet.people, clues }), workingTable: (states) => lp002WorkingTable(caselet, states), fullTable: (state) => lp002FullTable(caselet, state), finalState: caselet.assignment }); return { ...caselet, scenario, children: withChildAnswers(caselet.children, shared) }; }
function lp003WorkingTable(caselet: Lp003Caselet, states: readonly StackAssignment[]): string { const items = caselet.boxes.map((box) => caselet.boxLabels[box]); return markdownTable(["Position from bottom", "Item"], caselet.positions.map((position) => [String(position), candidateCell(states, (state) => { const box = caselet.boxes.find((candidate) => state[candidate] === position)!; return caselet.boxLabels[box]; }, items)])); }
function lp003FullTable(caselet: Lp003Caselet, state: StackAssignment): string { return markdownTable(["Position from bottom", "Item"], caselet.positions.map((position) => { const box = caselet.boxes.find((candidate) => state[candidate] === position)!; return [String(position), caselet.boxLabels[box]]; })); }
function simplifyLp003(caselet: Lp003Caselet): Lp003Caselet { const scenario = expandScenario(caselet.scenario, [`The items are ${naturalList(caselet.boxes.map((box) => caselet.boxLabels[box]))}.`, `The positions from bottom to top are ${naturalList(caselet.positions.map(String))}.`, "Exactly one item occupies each position."]); const shared = buildExplanation({ key: `LP-003:${caselet.caseletId}`, clues: caselet.clues, clueText: (clue) => clue.text, solve: (clues) => solveLp003({ boxes: caselet.boxes, clues }), workingTable: (states) => lp003WorkingTable(caselet, states), fullTable: (state) => lp003FullTable(caselet, state), finalState: caselet.assignment }); return { ...caselet, scenario, children: withChildAnswers(caselet.children, shared) }; }
function lp004WorkingTable(caselet: Lp004Caselet, states: readonly SelectionAssignment[]): string { return markdownTable(["Candidate", "Status"], caselet.candidates.map((candidate) => [caselet.candidateLabels[candidate], candidateCell(states, (state) => state[candidate] ? "Selected" : "Not selected", ["Selected", "Not selected"])])); }
function lp004FullTable(caselet: Lp004Caselet, state: SelectionAssignment): string { return markdownTable(["Candidate", "Status"], caselet.candidates.map((candidate) => [caselet.candidateLabels[candidate], state[candidate] ? "Selected" : "Not selected"])); }
function simplifyLp004(caselet: Lp004Caselet): Lp004Caselet { const scenario = expandScenario(caselet.scenario, [`The candidates are ${naturalList(caselet.candidates.map((candidate) => caselet.candidateLabels[candidate]))}.`, `Exactly ${caselet.committeeSize} candidates are selected.`]); const shared = buildExplanation({ key: `LP-004:${caselet.caseletId}`, clues: caselet.clues, clueText: (clue) => clue.text, solve: (clues) => solveLp004({ candidates: caselet.candidates, committeeSize: caselet.committeeSize, clues }), workingTable: (states) => lp004WorkingTable(caselet, states), fullTable: (state) => lp004FullTable(caselet, state), finalState: caselet.assignment }); return { ...caselet, scenario, children: withChildAnswers(caselet.children, shared) }; }
function lp005WorkingTable(caselet: Lp005Caselet, states: readonly GridAssignment[]): string { const duties = caselet.duties.map((duty) => caselet.labels.duties[duty]); const places = caselet.places.map((place) => caselet.labels.places[place]); return markdownTable(["Person", "Duty", "Location"], caselet.people.map((person) => [caselet.labels.people[person], candidateCell(states, (state) => caselet.labels.duties[state.dutyByPerson[person]], duties), candidateCell(states, (state) => caselet.labels.places[state.placeByPerson[person]], places)])); }
function lp005FullTable(caselet: Lp005Caselet, state: GridAssignment): string { return markdownTable(["Person", "Duty", "Location"], caselet.people.map((person) => [caselet.labels.people[person], caselet.labels.duties[state.dutyByPerson[person]], caselet.labels.places[state.placeByPerson[person]]])); }
function simplifyLp005(caselet: Lp005Caselet): Lp005Caselet { const scenario = expandScenario(caselet.scenario, [`The people are ${naturalList(caselet.people.map((person) => caselet.labels.people[person]))}.`, `The duties are ${naturalList(caselet.duties.map((duty) => caselet.labels.duties[duty]))}.`, `The locations are ${naturalList(caselet.places.map((place) => caselet.labels.places[place]))}.`, "Each person has one different duty and one different location."]); const shared = buildExplanation({ key: `LP-005:${caselet.caseletId}`, clues: caselet.clues, clueText: (clue) => clue.text, solve: (clues) => solveLp005({ people: caselet.people, clues }), workingTable: (states) => lp005WorkingTable(caselet, states), fullTable: (state) => lp005FullTable(caselet, state), finalState: caselet.assignment }); return { ...caselet, scenario, children: withChildAnswers(caselet.children, shared) }; }
function lp006WorkingTable(caselet: Lp006Caselet, states: readonly SynthAssignment[]): string { const days = [...caselet.days]; const subjects = caselet.subjects.map((subject) => caselet.labels.subjects[subject]); const cities = caselet.cities.map((city) => caselet.labels.cities[city]); return markdownTable(["Person", "Day", "Study area", "City"], caselet.people.map((person) => [caselet.labels.people[person], candidateCell(states, (state) => state.dayByPerson[person], days), candidateCell(states, (state) => caselet.labels.subjects[state.subjectByPerson[person]], subjects), candidateCell(states, (state) => caselet.labels.cities[state.cityByPerson[person]], cities)])); }
function lp006FullTable(caselet: Lp006Caselet, state: SynthAssignment): string { return markdownTable(["Person", "Day", "Study area", "City"], caselet.people.map((person) => [caselet.labels.people[person], state.dayByPerson[person], caselet.labels.subjects[state.subjectByPerson[person]], caselet.labels.cities[state.cityByPerson[person]]])); }
function simplifyLp006(caselet: Lp006Caselet): Lp006Caselet { const scenario = expandScenario(caselet.scenario, [`The people are ${naturalList(caselet.people.map((person) => caselet.labels.people[person]))}.`, `The days are ${naturalList(caselet.days)}.`, `The study areas are ${naturalList(caselet.subjects.map((subject) => caselet.labels.subjects[subject]))}.`, `The cities are ${naturalList(caselet.cities.map((city) => caselet.labels.cities[city]))}.`, "Each day, study area and city is used exactly once."]); const shared = buildExplanation({ key: `LP-006:${caselet.caseletId}`, clues: caselet.clues, clueText: (clue) => clue.text, solve: (clues) => solveLp006({ people: caselet.people, clues }), workingTable: (states) => lp006WorkingTable(caselet, states), fullTable: (state) => lp006FullTable(caselet, state), finalState: caselet.assignment }); return { ...caselet, scenario, children: withChildAnswers(caselet.children, shared) }; }
function lp007WorkingTable(caselet: Lp007Caselet, states: readonly VariableAssignment[]): string { const personHeader = caselet.labels.personNoun[0]!.toUpperCase() + caselet.labels.personNoun.slice(1); const valueHeader = caselet.labels.valueNoun[0]!.toUpperCase() + caselet.labels.valueNoun.slice(1); const values = caselet.values.map((value) => caselet.labels.values[value]); return markdownTable([personHeader, valueHeader], caselet.people.map((person) => [caselet.labels.people[person], candidateCell(states, (state) => caselet.labels.values[state[person]], values)])); }
function lp007FullTable(caselet: Lp007Caselet, state: VariableAssignment): string { const personHeader = caselet.labels.personNoun[0]!.toUpperCase() + caselet.labels.personNoun.slice(1); const valueHeader = caselet.labels.valueNoun[0]!.toUpperCase() + caselet.labels.valueNoun.slice(1); return markdownTable([personHeader, valueHeader], caselet.people.map((person) => [caselet.labels.people[person], caselet.labels.values[state[person]]])); }
function simplifyLp007(caselet: Lp007Caselet): Lp007Caselet { const scenario = expandScenario(caselet.scenario, [`The people are ${naturalList(caselet.people.map((person) => caselet.labels.people[person]))}.`, `The possible ${caselet.labels.valueNoun}s are ${naturalList(caselet.values.map((value) => caselet.labels.values[value]))}.`, `Each ${caselet.labels.valueNoun} is used exactly once.`]); const shared = buildExplanation({ key: `LP-007:${caselet.caseletId}`, clues: caselet.clues, clueText: (clue) => clue.text, solve: (clues) => solveLp007({ clues }), workingTable: (states) => lp007WorkingTable(caselet, states), fullTable: (state) => lp007FullTable(caselet, state), finalState: caselet.assignment }); return { ...caselet, scenario, children: withChildAnswers(caselet.children, shared) }; }
function slotLabel(caselet: Lp008Caselet, slot: SlotId): string { const month = caselet.labels.months[Math.floor(slot / 2) as 0 | 1 | 2 | 3]; return `${slot % 2 === 0 ? "12th" : "27th"} ${month}`; }
function lp008WorkingTable(caselet: Lp008Caselet, states: readonly CalendarAssignment[]): string { const slots = caselet.slots.map((slot) => slotLabel(caselet, slot)); return markdownTable(["Person", "Date and month"], caselet.people.map((person) => [caselet.labels.people[person], candidateCell(states, (state) => slotLabel(caselet, state[person]), slots)])); }
function lp008FullTable(caselet: Lp008Caselet, state: CalendarAssignment): string { return markdownTable(["Person", "Date and month"], caselet.people.map((person) => [caselet.labels.people[person], slotLabel(caselet, state[person])])); }
function simplifyLp008(caselet: Lp008Caselet): Lp008Caselet { const scenario = expandScenario(caselet.scenario, [`The people are ${naturalList(caselet.people.map((person) => caselet.labels.people[person]))}.`, `The months are ${naturalList(caselet.labels.months)}.`, "The two possible dates in every month are 12th and 27th.", "Each person is assigned to one different date-month slot."]); const shared = buildExplanation({ key: `LP-008:${caselet.caseletId}`, clues: caselet.clues, clueText: (clue) => clue.text, solve: (clues) => solveLp008({ clues }), workingTable: (states) => lp008WorkingTable(caselet, states), fullTable: (state) => lp008FullTable(caselet, state), finalState: caselet.assignment }); return { ...caselet, scenario, children: withChildAnswers(caselet.children, shared) }; }

export function generateLp001BatchStabilizedV4(seed = "lp-001-stabilized-v4", count = 8): Caselet[] { return generateLp001BatchStabilizedV2(seed, count).map(simplifyLp001); }
export function generateLp002BatchStabilizedV4(seed = "lp-002-stabilized-v4", count = 8): Lp002Caselet[] { return generateLp002BatchStabilizedV2(seed, count).map(simplifyLp002); }
export function generateLp003BatchStabilizedV4(seed = "lp-003-stabilized-v4", count = 8): Lp003Caselet[] { return generateLp003BatchStabilizedV2(seed, count).map(simplifyLp003); }
export function generateLp004BatchStabilizedV4(seed = "lp-004-stabilized-v4", count = 8): Lp004Caselet[] { return generateLp004BatchStabilizedV2(seed, count).map(simplifyLp004); }
export function generateLp005BatchStabilizedV4(seed = "lp-005-stabilized-v4", count = 8): Lp005Caselet[] { return generateLp005BatchStabilizedV2(seed, count).map(simplifyLp005); }
export function generateLp006BatchStabilizedV4(seed = "lp-006-stabilized-v4", count = 8): Lp006Caselet[] { return generateLp006BatchStabilizedV2(seed, count).map(simplifyLp006); }
export function generateLp007BatchStabilizedV4(seed = "lp-007-stabilized-v4", count = 8): Lp007Caselet[] { return generateLp007BatchStabilizedV2(seed, count).map(simplifyLp007); }
export function generateLp008BatchStabilizedV4(seed = "lp-008-stabilized-v4", count = 8): Lp008Caselet[] { return generateLp008BatchStabilizedV2(seed, count).map(simplifyLp008); }
