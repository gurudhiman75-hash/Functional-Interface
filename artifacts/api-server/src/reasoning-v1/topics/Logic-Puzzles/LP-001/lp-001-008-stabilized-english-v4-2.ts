import { solveCaselet, type Assignment, type Caselet, type Clue, type PersonId } from "./index.ts";
import {
  generateLp001BatchStabilizedV4,
  generateLp002BatchStabilizedV4,
  generateLp003BatchStabilizedV4,
  generateLp004BatchStabilizedV4,
  generateLp005BatchStabilizedV4,
  generateLp006BatchStabilizedV4,
  generateLp007BatchStabilizedV4,
  generateLp008BatchStabilizedV4,
} from "./lp-001-008-stabilized-english-v4.ts";

export const LP_001_008_STABILIZED_ENGLISH_V4_2 = Object.freeze({
  authorityId: "LP_001_008_STABILIZED_ENGLISH_V4_2" as const,
  parentAuthority: "LP_001_008_STABILIZED_ENGLISH_V4" as const,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  lp001ClueRule: "CLUB_REPETITIONS_ONLY" as const,
  repeatedExclusions: "NEITHER_NOR" as const,
  repeatedDifferentRelations: "DIFFERENT_FROM_BOTH" as const,
  singleClues: "UNCHANGED" as const,
  semanticCluesRetained: true as const,
  changesPuzzleSemantics: false as const,
  changesOptions: false as const,
  changesAnswers: false as const,
  changesCorrectIndex: false as const,
  changesDifficulty: false as const,
});

type IndexedClue = { clue: Clue; index: number };
export type Lp001ClueBundle = { text: string; clues: readonly Clue[]; originalIndexes: readonly number[] };
export type Lp001V42Caselet = Caselet & { learnerFacingClues: readonly string[] };

function naturalList(values: readonly string[]): string {
  if (values.length <= 1) return values[0] ?? "";
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
}

function groupNoun(caselet: Caselet): string {
  const nouns: Record<string, string> = {
    PUBLIC_HEALTH_FIELDWORK: "team",
    TEACHER_TRAINING: "panel",
    BANK_BRANCH_AUDIT: "audit team",
    DISTRICT_OFFICERS: "working group",
    SCHOLARSHIP_VERIFICATION: "panel",
    CIVIC_WATER_AUDIT: "field unit",
    CAMPUS_RESEARCH: "team",
    MUNICIPAL_PLANNING: "group",
  };
  return nouns[caselet.scenarioProfileId] ?? "group";
}

function cluePeople(clue: Clue): readonly PersonId[] {
  return clue.kind === "NOT_IN_GROUP" ? [clue.person] : [clue.left, clue.right];
}

export function buildLp001ClueBundles(caselet: Caselet): Lp001ClueBundle[] {
  const indexed: IndexedClue[] = caselet.clues.map((clue, index) => ({ clue, index }));
  const used = new Set<number>();
  const bundles: Lp001ClueBundle[] = [];

  // Only repeated exclusions are merged. A single NOT_IN_GROUP clue keeps its original wording.
  for (const person of caselet.people) {
    const repeated = indexed.filter((item) => !used.has(item.index) && item.clue.kind === "NOT_IN_GROUP" && item.clue.person === person);
    if (repeated.length < 2) continue;
    for (const item of repeated) used.add(item.index);
    const labels = repeated.map((item) => caselet.groupLabels[(item.clue as Extract<Clue, { kind: "NOT_IN_GROUP" }>).group]);
    bundles.push({
      text: `${person} is assigned to neither ${labels[0]} nor ${labels[1]}.`,
      clues: repeated.map((item) => item.clue),
      originalIndexes: repeated.map((item) => item.index),
    });
  }

  // Repeated DIFFERENT_GROUPS clauses sharing one person are expressed once as "different from both ...".
  while (true) {
    const remaining = indexed.filter((item) => !used.has(item.index) && item.clue.kind === "DIFFERENT_GROUPS");
    const incidence = new Map<PersonId, IndexedClue[]>();
    for (const item of remaining) {
      const clue = item.clue as Extract<Clue, { kind: "DIFFERENT_GROUPS" }>;
      for (const person of [clue.left, clue.right]) incidence.set(person, [...(incidence.get(person) ?? []), item]);
    }
    const candidate = [...incidence.entries()]
      .filter(([, items]) => items.length >= 2)
      .sort((left, right) => right[1].length - left[1].length || Math.min(...left[1].map((item) => item.index)) - Math.min(...right[1].map((item) => item.index)))[0];
    if (!candidate) break;
    const [anchor, items] = candidate;
    for (const item of items) used.add(item.index);
    const others = items.map((item) => {
      const clue = item.clue as Extract<Clue, { kind: "DIFFERENT_GROUPS" }>;
      return clue.left === anchor ? clue.right : clue.left;
    });
    const noun = groupNoun(caselet);
    bundles.push({
      text: others.length === 2
        ? `${anchor} is in a different ${noun} from both ${others[0]} and ${others[1]}.`
        : `${anchor} is in a different ${noun} from each of ${naturalList(others)}.`,
      clues: items.map((item) => item.clue),
      originalIndexes: items.map((item) => item.index),
    });
  }

  for (const item of indexed) {
    if (used.has(item.index)) continue;
    bundles.push({ text: item.clue.text, clues: [item.clue], originalIndexes: [item.index] });
  }

  return bundles.sort((left, right) => Math.min(...left.originalIndexes) - Math.min(...right.originalIndexes));
}

function bundlePeople(bundle: Lp001ClueBundle): Set<PersonId> {
  const result = new Set<PersonId>();
  for (const clue of bundle.clues) for (const person of cluePeople(clue)) result.add(person);
  return result;
}

function intersects(left: ReadonlySet<string>, right: ReadonlySet<string>): boolean {
  for (const value of left) if (right.has(value)) return true;
  return false;
}

function markdownTable(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  return [`| ${headers.join(" | ")} |`, `|${headers.map(() => "---").join("|")}|`, ...rows.map((row) => `| ${row.join(" | ")} |`)].join("\n");
}

function candidateCell(caselet: Caselet, states: readonly Assignment[], person: PersonId): string {
  const domain = caselet.groups.map((group) => caselet.groupLabels[group]);
  const values = [...new Set(states.map((state) => caselet.groupLabels[state[person]!]))];
  if (values.length === 1) return values[0]!;
  const ordered = domain.filter((value) => values.includes(value));
  if (ordered.length === domain.length) return "?";
  return ordered.join(" / ");
}

function workingTable(caselet: Caselet, states: readonly Assignment[]): string {
  return markdownTable(["Person", "Panel / group"], caselet.people.map((person) => [person, candidateCell(caselet, states, person)]));
}

function fullTable(caselet: Caselet, state: Assignment): string {
  return markdownTable(["Person", "Panel / group"], caselet.people.map((person) => [person, caselet.groupLabels[state[person]!]]));
}

function solveBundles(caselet: Caselet, bundles: readonly Lp001ClueBundle[]): Assignment[] {
  return solveCaselet({ people: caselet.people, clues: bundles.flatMap((bundle) => bundle.clues) });
}

function fixedCount(table: string): number {
  let count = 0;
  for (const row of table.split("\n").slice(2)) {
    const cells = row.split("|").slice(1, -1).map((cell) => cell.trim());
    const value = cells[1];
    if (value && value !== "?" && !value.includes(" / ")) count += 1;
  }
  return count;
}

function planBundles(caselet: Caselet, bundles: readonly Lp001ClueBundle[]): Lp001ClueBundle[] {
  const unused = [...bundles];
  const planned: Lp001ClueBundle[] = [];
  let states = solveBundles(caselet, []);
  const usedPeople = new Set<string>();
  while (unused.length) {
    const beforeFixed = fixedCount(workingTable(caselet, states));
    let bestPosition = 0;
    let bestScore = Number.NEGATIVE_INFINITY;
    for (let position = 0; position < unused.length; position += 1) {
      const bundle = unused[position]!;
      const after = solveBundles(caselet, [...planned, bundle]);
      if (!after.length) continue;
      const fixedGain = fixedCount(workingTable(caselet, after)) - beforeFixed;
      const reduction = states.length > 0 ? Math.log(states.length / after.length) : 0;
      const people = bundlePeople(bundle);
      const connected = planned.length && intersects(usedPeople, people) ? 1 : 0;
      const newPeople = [...people].filter((person) => !usedPeople.has(person)).length;
      const score = fixedGain * 1_000_000 + connected * 20_000 + newPeople * 5_000 + reduction;
      if (score > bestScore) { bestScore = score; bestPosition = position; }
    }
    const [next] = unused.splice(bestPosition, 1);
    planned.push(next!);
    for (const person of bundlePeople(next!)) usedPeople.add(person);
    states = solveBundles(caselet, planned);
  }
  return planned;
}

function buildExplanation(caselet: Caselet, bundles: readonly Lp001ClueBundle[]): string[] {
  const planned = planBundles(caselet, bundles);
  const lines: string[] = [];
  let applied: Lp001ClueBundle[] = [];
  let states = solveBundles(caselet, []);
  let pending: Lp001ClueBundle[] = [];
  let step = 1;
  let caseShown = false;

  for (let index = 0; index < planned.length; index += 1) {
    const bundle = planned[index]!;
    const beforeTable = workingTable(caselet, states);
    pending.push(bundle);
    const nextApplied = [...applied, bundle];
    const after = solveBundles(caselet, nextApplied);
    const afterTable = workingTable(caselet, after);
    const changed = afterTable !== beforeTable;
    const isLast = index === planned.length - 1;
    if (!changed && !isLast) { applied = nextApplied; states = after; continue; }

    const lead = pending.length === 1
      ? `${step === 1 ? "Start with" : "Now use"} this clue — ${pending[0]!.text}`
      : `Use these connected clues together — ${pending.map((item) => item.text.replace(/[.]$/u, "")).join("; then ")}.`;
    let body = `${lead}\n\nThe table becomes:\n\n${afterTable}`;

    if (!caseShown && after.length === 2 && !isLast) {
      body += `\n\nOnly two arrangements remain, so check both cases.\n\n**Case 1**\n\n${fullTable(caselet, after[0]!)}\n\n**Case 2**\n\n${fullTable(caselet, after[1]!)}`;
      caseShown = true;
    }
    if (isLast && states.length === 2 && after.length === 1) {
      if (!caseShown) body = `Only two arrangements remain.\n\n**Case 1**\n\n${fullTable(caselet, states[0]!)}\n\n**Case 2**\n\n${fullTable(caselet, states[1]!)}\n\n${lead}`;
      const keepFirst = JSON.stringify(after[0]) === JSON.stringify(states[0]);
      body += `\n\nThis clue removes Case ${keepFirst ? "2" : "1"}. Keep Case ${keepFirst ? "1" : "2"}.`;
    }

    lines.push(`**Step ${step}**\n\n${body}`);
    pending = [];
    applied = nextApplied;
    states = after;
    step += 1;
  }

  lines.push(`**Step ${step}: Complete the arrangement**\n\nThe final table is:\n\n${fullTable(caselet, caselet.assignment)}`);
  return lines;
}

function rewriteLp001Caselet(caselet: Caselet): Lp001V42Caselet {
  const bundles = buildLp001ClueBundles(caselet);
  const shared = buildExplanation(caselet, bundles);
  const children = caselet.children.map((child) => ({
    ...child,
    explanation: {
      summary: `Use the useful clues first and fill the table step by step. The required answer is ${child.answer}.`,
      lines: [...shared, `**Step ${shared.length + 1}: Answer the question**\n\nFrom the completed table, the answer is **${child.answer}**.`],
    },
  }));
  return { ...caselet, learnerFacingClues: bundles.map((bundle) => bundle.text), children };
}

export function generateLp001BatchStabilizedV4_2(seed = "lp-001-stabilized-v4-2", count = 8): Lp001V42Caselet[] {
  return generateLp001BatchStabilizedV4(seed, count).map(rewriteLp001Caselet);
}

export const generateLp002BatchStabilizedV4_2 = generateLp002BatchStabilizedV4;
export const generateLp003BatchStabilizedV4_2 = generateLp003BatchStabilizedV4;
export const generateLp004BatchStabilizedV4_2 = generateLp004BatchStabilizedV4;
export const generateLp005BatchStabilizedV4_2 = generateLp005BatchStabilizedV4;
export const generateLp006BatchStabilizedV4_2 = generateLp006BatchStabilizedV4;
export const generateLp007BatchStabilizedV4_2 = generateLp007BatchStabilizedV4;
export const generateLp008BatchStabilizedV4_2 = generateLp008BatchStabilizedV4;
