export type GroupId = "Survey" | "Outreach" | "Data";
export type PersonId = string;
export type DifficultyBand = "Easy" | "Medium" | "Hard";
export type ClueKind = "SAME_GROUP" | "DIFFERENT_GROUPS" | "NOT_IN_GROUP";

export type Assignment = Record<PersonId, GroupId>;
export type GroupLabels = Record<GroupId, string>;

export type Clue =
  | { kind: "SAME_GROUP"; left: PersonId; right: PersonId; text: string }
  | { kind: "DIFFERENT_GROUPS"; left: PersonId; right: PersonId; text: string }
  | { kind: "NOT_IN_GROUP"; person: PersonId; group: GroupId; text: string };

export type ScenarioProfile = {
  id: string;
  scenario: string;
  groupLabels: GroupLabels;
  groupNoun: string;
  sameTemplates: readonly string[];
  differentTemplates: readonly string[];
  notInTemplates: readonly string[];
  stemStyle: "TEAM" | "PANEL" | "OFFICE" | "FIELD";
};

export type ChildQuestion = {
  questionId: string;
  qlId: "LP-QL-001" | "LP-QL-002" | "LP-QL-003" | "LP-QL-004";
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  difficultyBand: DifficultyBand;
  misconceptionFamily: string;
  explanation: { summary: string; lines: string[] };
};

export type Caselet = {
  caseletId: string;
  scenario: string;
  scenarioProfileId: string;
  difficultyBand: DifficultyBand;
  groups: readonly GroupId[];
  groupLabels: GroupLabels;
  people: readonly PersonId[];
  clues: readonly Clue[];
  assignment: Assignment;
  children: readonly ChildQuestion[];
};

const GROUPS: readonly GroupId[] = ["Survey", "Outreach", "Data"];
const PEOPLE = [
  "Aarav", "Bhavna", "Charu", "Dev", "Ishaan", "Meera", "Nakul", "Pallavi",
  "Rohan", "Simran", "Tanya", "Varun", "Yash", "Zoya", "Karan", "Neha",
  "Manav", "Ritu", "Sahil", "Anika", "Kabir", "Jasleen", "Mohan", "Tara",
];

const SCENARIO_PROFILES: readonly ScenarioProfile[] = [
  {
    id: "PUBLIC_HEALTH_FIELDWORK",
    scenario: "A university is preparing a public-health field study. Six volunteers are divided into three two-person teams.",
    groupLabels: { Survey: "Household Survey", Outreach: "Community Outreach", Data: "Data Review" },
    groupNoun: "team", stemStyle: "FIELD",
    sameTemplates: ["{left} and {right} are assigned to the same team.", "{left} and {right} work together."],
    differentTemplates: ["{left} and {right} are assigned to different teams.", "{left} and {right} do not work together."],
    notInTemplates: ["{person} is not assigned to the {group} team.", "The {group} team does not include {person}."],
  },
  {
    id: "TEACHER_TRAINING",
    scenario: "A teacher-training programme is arranging classroom visits. Six teachers are divided into three two-person panels.",
    groupLabels: { Survey: "Lesson Planning", Outreach: "Classroom Observation", Data: "Assessment Review" },
    groupNoun: "panel", stemStyle: "PANEL",
    sameTemplates: ["{left} and {right} sit on the same panel.", "{left} and {right} are placed together on one panel."],
    differentTemplates: ["{left} and {right} are placed on different panels.", "{left} and {right} do not belong to the same panel."],
    notInTemplates: ["{person} is not on the {group} panel.", "The {group} panel does not include {person}."],
  },
  {
    id: "BANK_BRANCH_AUDIT",
    scenario: "A bank is conducting a review of six branches. Six officers are divided into three two-person audit teams.",
    groupLabels: { Survey: "Customer-Service Audit", Outreach: "Loan-File Audit", Data: "Compliance Audit" },
    groupNoun: "audit team", stemStyle: "OFFICE",
    sameTemplates: ["{left} and {right} are on the same audit team.", "{left} and {right} review the same area."],
    differentTemplates: ["{left} and {right} are on different audit teams.", "{left} and {right} review different areas."],
    notInTemplates: ["{person} is not on the {group} team.", "The {group} team does not include {person}."],
  },
  {
    id: "DISTRICT_OFFICERS",
    scenario: "A district office is preparing a service-delivery report. Six officers are divided into three two-person working groups.",
    groupLabels: { Survey: "Field Inspection", Outreach: "Public Grievance", Data: "Records Review" },
    groupNoun: "working group", stemStyle: "OFFICE",
    sameTemplates: ["{left} and {right} belong to the same working group.", "{left} and {right} handle the same part of the report."],
    differentTemplates: ["{left} and {right} belong to different working groups.", "{left} and {right} handle different parts of the report."],
    notInTemplates: ["{person} is not in the {group} group.", "The {group} group does not contain {person}."],
  },
  {
    id: "SCHOLARSHIP_VERIFICATION",
    scenario: "A scholarship office is checking applications from six candidates. The candidates are divided into three two-person verification panels.",
    groupLabels: { Survey: "Eligibility Check", Outreach: "Document Check", Data: "Interview Check" },
    groupNoun: "panel", stemStyle: "PANEL",
    sameTemplates: ["{left} and {right} are sent to the same panel.", "{left} and {right} are checked together."],
    differentTemplates: ["{left} and {right} are sent to different panels.", "{left} and {right} are checked by different panels."],
    notInTemplates: ["{person} is not sent to the {group} panel.", "The {group} panel does not check {person}'s application."],
  },
  {
    id: "CIVIC_WATER_AUDIT",
    scenario: "A civic group is conducting a district water audit. Six volunteers are placed in three two-person field units.",
    groupLabels: { Survey: "Household Visits", Outreach: "Community Meetings", Data: "Records Compilation" },
    groupNoun: "field unit", stemStyle: "FIELD",
    sameTemplates: ["{left} and {right} are placed in the same field unit.", "{left} and {right} visit the same set of locations."],
    differentTemplates: ["{left} and {right} are placed in different field units.", "{left} and {right} visit different sets of locations."],
    notInTemplates: ["{person} is not in the {group} unit.", "The {group} unit does not include {person}."],
  },
  {
    id: "CAMPUS_RESEARCH",
    scenario: "A college is collecting evidence for a campus-safety study. Six research assistants are divided into three two-person teams.",
    groupLabels: { Survey: "Student Interviews", Outreach: "Campus Inspection", Data: "Evidence Analysis" },
    groupNoun: "team", stemStyle: "TEAM",
    sameTemplates: ["{left} and {right} are assigned to the same team.", "{left} and {right} collect evidence together."],
    differentTemplates: ["{left} and {right} are assigned to different teams.", "{left} and {right} collect evidence separately."],
    notInTemplates: ["{person} is not assigned to the {group} team.", "The {group} team does not include {person}."],
  },
  {
    id: "MUNICIPAL_PLANNING",
    scenario: "A municipal office is preparing a neighbourhood-improvement plan. Six planners are divided into three two-person groups.",
    groupLabels: { Survey: "Roads and Drainage", Outreach: "Parks and Lighting", Data: "Budget and Records" },
    groupNoun: "group", stemStyle: "OFFICE",
    sameTemplates: ["{left} and {right} are assigned to the same group.", "{left} and {right} work on the same part of the plan."],
    differentTemplates: ["{left} and {right} are assigned to different groups.", "{left} and {right} work on different parts of the plan."],
    notInTemplates: ["{person} is not assigned to the {group} group.", "The {group} group does not include {person}."],
  },
];

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (const char of value) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}

function rng(seed: string) {
  let state = hashSeed(seed) || 1;
  return () => { state = Math.imul(state ^ (state >>> 15), 2246822519) >>> 0; state = Math.imul(state ^ (state >>> 13), 3266489917) >>> 0; return ((state ^ (state >>> 16)) >>> 0) / 4294967296; };
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) { const swap = Math.floor(random() * (index + 1)); [result[index], result[swap]] = [result[swap]!, result[index]!]; }
  return result;
}

function pairs<T>(items: readonly T[]): Array<[T, T]> {
  const result: Array<[T, T]> = [];
  for (let left = 0; left < items.length; left += 1) for (let right = left + 1; right < items.length; right += 1) result.push([items[left]!, items[right]!]);
  return result;
}

function enumerateAssignments(people: readonly PersonId[]): Assignment[] {
  const result: Assignment[] = []; const current: Assignment = {}; const counts: Record<GroupId, number> = { Survey: 0, Outreach: 0, Data: 0 };
  function visit(index: number) {
    if (index === people.length) { result.push({ ...current }); return; }
    const person = people[index]!;
    for (const group of GROUPS) { if (counts[group] >= 2) continue; current[person] = group; counts[group] += 1; visit(index + 1); counts[group] -= 1; delete current[person]; }
  }
  visit(0); return result;
}

function satisfies(assignment: Assignment, clue: Clue): boolean {
  if (clue.kind === "SAME_GROUP") return assignment[clue.left] === assignment[clue.right];
  if (clue.kind === "DIFFERENT_GROUPS") return assignment[clue.left] !== assignment[clue.right];
  return assignment[clue.person] !== clue.group;
}

function clueKey(clue: Clue): string {
  if (clue.kind === "NOT_IN_GROUP") return `${clue.kind}:${clue.person}:${clue.group}`;
  const [left, right] = [clue.left, clue.right].sort(); return `${clue.kind}:${left}:${right}`;
}

function fill(template: string, values: Record<string, string>): string { return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? key); }

function buildCandidateClues(people: readonly PersonId[], hidden: Assignment, profile: ScenarioProfile, random: () => number): Clue[] {
  const result: Clue[] = [];
  for (const [left, right] of pairs(people)) {
    if (hidden[left] === hidden[right]) {
      const template = profile.sameTemplates[Math.floor(random() * profile.sameTemplates.length)]!;
      result.push({ kind: "SAME_GROUP", left, right, text: fill(template, { left, right }) });
    } else {
      const template = profile.differentTemplates[Math.floor(random() * profile.differentTemplates.length)]!;
      result.push({ kind: "DIFFERENT_GROUPS", left, right, text: fill(template, { left, right }) });
    }
  }
  for (const person of people) for (const group of GROUPS) if (hidden[person] !== group) {
    const template = profile.notInTemplates[Math.floor(random() * profile.notInTemplates.length)]!;
    result.push({ kind: "NOT_IN_GROUP", person, group, text: fill(template, { person, group: profile.groupLabels[group] }) });
  }
  return result;
}

function chooseBest(survivors: Assignment[], candidates: Clue[], chosen: Clue[], kind?: ClueKind): Clue | undefined {
  const unused = candidates.filter((candidate) => (!kind || candidate.kind === kind) && !chosen.some((clue) => clueKey(clue) === clueKey(candidate)));
  return unused.map((candidate) => ({ candidate, remaining: survivors.filter((state) => satisfies(state, candidate)).length }))
    .filter((entry) => entry.remaining > 0 && entry.remaining < survivors.length)
    .sort((left, right) => left.remaining - right.remaining)[0]?.candidate;
}

function cluesAreEssential(people: readonly PersonId[], clues: readonly Clue[]): boolean {
  const all = enumerateAssignments(people);
  return clues.every((_, index) => all.filter((assignment) => clues.every((clue, clueIndex) => clueIndex === index || satisfies(assignment, clue))).length > 1);
}

function chooseClues(people: readonly PersonId[], hidden: Assignment, profile: ScenarioProfile, difficultyBand: DifficultyBand, random: () => number): Clue[] {
  const all = enumerateAssignments(people); const candidates = buildCandidateClues(people, hidden, profile, random);
  const quotaSets: Array<readonly ClueKind[]> = difficultyBand === "Hard"
    ? [["SAME_GROUP", "DIFFERENT_GROUPS", "NOT_IN_GROUP", "NOT_IN_GROUP", "DIFFERENT_GROUPS"], ["SAME_GROUP", "NOT_IN_GROUP", "DIFFERENT_GROUPS", "NOT_IN_GROUP"]]
    : [["SAME_GROUP", "NOT_IN_GROUP", "DIFFERENT_GROUPS"], ["SAME_GROUP", "SAME_GROUP", "NOT_IN_GROUP"]];
  for (const quota of shuffle(quotaSets, random)) {
    let survivors = all; const chosen: Clue[] = [];
    for (const kind of quota) {
      const selected = chooseBest(survivors, candidates, chosen, kind);
      if (!selected) { chosen.length = 0; break; }
      chosen.push(selected); survivors = survivors.filter((state) => satisfies(state, selected));
    }
    while (chosen.length < (difficultyBand === "Hard" ? 8 : 6) && survivors.length > 1) {
      const selected = chooseBest(survivors, candidates, chosen);
      if (!selected) break;
      chosen.push(selected); survivors = survivors.filter((state) => satisfies(state, selected));
    }
    if (survivors.length === 1 && JSON.stringify(survivors[0]) === JSON.stringify(hidden) && cluesAreEssential(people, chosen)) return chosen;
  }
  throw new Error("Unable to build an essential unique logic-puzzle clue set.");
}

function groupMembers(assignment: Assignment, group: GroupId): [PersonId, PersonId] {
  const members = Object.entries(assignment).filter(([, assigned]) => assigned === group).map(([person]) => person);
  if (members.length !== 2) throw new Error(`Expected two members in ${group}.`); return [members[0]!, members[1]!];
}

function renderAssignment(assignment: Assignment, labels: GroupLabels): string {
  return GROUPS.map((group) => `| ${labels[group]} | ${groupMembers(assignment, group).join(" and ")} |`).join("\n");
}

function pairLabel(pair: [PersonId, PersonId]): string { return `${pair[0]} and ${pair[1]}`; }

function balanceAnswerPosition(options: readonly string[], answer: string, desiredIndex: number, random: () => number): string[] {
  const remaining = shuffle(options.filter((option) => option !== answer), random);
  const result: string[] = [];
  for (let index = 0; index < options.length; index += 1) result[index] = index === desiredIndex ? answer : remaining.shift()!;
  return result;
}

function makeChildren(caseletId: string, caseletIndex: number, people: readonly PersonId[], clues: readonly Clue[], assignment: Assignment, profile: ScenarioProfile, difficultyBand: DifficultyBand, random: () => number): ChildQuestion[] {
  const allPairs = pairs(people); const samePairs = allPairs.filter(([left, right]) => assignment[left] === assignment[right]); const differentPairs = allPairs.filter(([left, right]) => assignment[left] !== assignment[right]);
  const used = new Set(clues.map(clueKey));
  const samePair = samePairs.find((pair) => !used.has(clueKey({ kind: "SAME_GROUP", left: pair[0], right: pair[1], text: "" }))) ?? samePairs[0]!;
  const differentPair = differentPairs.find((pair) => !used.has(clueKey({ kind: "DIFFERENT_GROUPS", left: pair[0], right: pair[1], text: "" }))) ?? differentPairs[0]!;
  const target = shuffle(people, random)[0]!; const targetGroup = assignment[target]!; const targetMembers = groupMembers(assignment, targetGroup); const targetLabel = profile.groupLabels[targetGroup];
  const optionsForPair = (answerPair: [PersonId, PersonId]) => shuffle([pairLabel(answerPair), ...shuffle(allPairs.filter((pair) => pairLabel(pair) !== pairLabel(answerPair)), random).slice(0, 3).map(pairLabel)], random);
  const unitOptions = balanceAnswerPosition(shuffle([...Object.values(profile.groupLabels), "No unit can be identified"], random), targetLabel, caseletIndex % 4, random);
  const sameOptions = balanceAnswerPosition(optionsForPair(samePair), pairLabel(samePair), (caseletIndex + 1) % 4, random);
  const memberOptions = balanceAnswerPosition(optionsForPair(targetMembers), pairLabel(targetMembers), (caseletIndex + 2) % 4, random);
  const differentOptions = balanceAnswerPosition(optionsForPair(differentPair), pairLabel(differentPair), (caseletIndex + 3) % 4, random);
  const allocationTable = `| Unit | Members |\n|---|---|\n${renderAssignment(assignment, profile.groupLabels)}`;
  const deduction = clues.slice(0, Math.min(3, clues.length)).map((clue) => clue.text.replace(/[.]$/u, "")).join("; then ");
  const deductionLead = [
    `Start with these clues: ${deduction}.`,
    `The useful deductions come from these clues: ${deduction}.`,
    `Apply these clues in sequence: ${deduction}.`,
    `After these clues are applied—${deduction}—the remaining places are forced.`,
  ][caseletIndex % 4];
  const evidence = difficultyBand === "Hard"
    ? `${deductionLead} Applying the two-member limit to the three groups leaves only one complete allocation.\n\n${allocationTable}`
    : `The clues reduce the possibilities to one complete allocation. ${caseletIndex % 2 === 0 ? "The capacity rule then fills the remaining places." : "The remaining members can therefore be placed without a choice."}\n\n${allocationTable}`;
  const styles = {
    TEAM: { person: `Which team is ${target} assigned to?`, same: "Which pair is assigned to the same team?", members: `Who are the two members of the ${targetLabel} team?`, different: "Which pair is assigned to different teams?" },
    PANEL: { person: `To which panel is ${target} sent?`, same: "Which pair is sent to the same panel?", members: `Which two people are sent to the ${targetLabel} panel?`, different: "Which pair is sent to different panels?" },
    OFFICE: { person: `Which work group includes ${target}?`, same: "Which pair belongs to the same work group?", members: `Which two people belong to the ${targetLabel} group?`, different: "Which pair belongs to different work groups?" },
    FIELD: { person: `Which field unit is ${target} assigned to?`, same: "Which pair is placed in the same field unit?", members: `Which two people are in the ${targetLabel} unit?`, different: "Which pair is placed in different field units?" },
  }[profile.stemStyle];
  const explanation = (summary: string, finalStep: string) => ({ summary, lines: [evidence, finalStep] });
  return [
    { questionId: `${caseletId}-Q1`, qlId: "LP-QL-001", stem: styles.person, options: unitOptions, correctIndex: unitOptions.indexOf(targetLabel), answer: targetLabel, difficultyBand, misconceptionFamily: "CAPACITY_OR_EXCLUSION_MISREAD", explanation: explanation(`${target} is in the ${targetLabel} group.`, `The completed table places ${target} in the ${targetLabel} row.`) },
    { questionId: `${caseletId}-Q2`, qlId: "LP-QL-002", stem: styles.same, options: sameOptions, correctIndex: sameOptions.indexOf(pairLabel(samePair)), answer: pairLabel(samePair), difficultyBand, misconceptionFamily: "PAIRING_CHAIN_BROKEN", explanation: explanation(`${pairLabel(samePair)} are in one group.`, `Only the pair ${pairLabel(samePair)} appears in the same row; the other pairs are split across rows.`) },
    { questionId: `${caseletId}-Q3`, qlId: "LP-QL-003", stem: styles.members, options: memberOptions, correctIndex: memberOptions.indexOf(pairLabel(targetMembers)), answer: pairLabel(targetMembers), difficultyBand, misconceptionFamily: "ROW_MEMBER_SUBSTITUTION", explanation: explanation(`The ${targetLabel} group contains ${pairLabel(targetMembers)}.`, `Read the ${targetLabel} row: its two members are ${pairLabel(targetMembers)}.`) },
    { questionId: `${caseletId}-Q4`, qlId: "LP-QL-004", stem: styles.different, options: differentOptions, correctIndex: differentOptions.indexOf(pairLabel(differentPair)), answer: pairLabel(differentPair), difficultyBand, misconceptionFamily: "SAME_ROW_CONFUSION", explanation: explanation(`${pairLabel(differentPair)} are in different groups.`, `${differentPair[0]} and ${differentPair[1]} appear in different rows of the table.`) },
  ];
}

export function solveCaselet(caselet: Pick<Caselet, "people" | "clues">): Assignment[] {
  return enumerateAssignments(caselet.people).filter((assignment) => caselet.clues.every((clue) => satisfies(assignment, clue)));
}

export function generateCaselet(seed = "lp-001-review", index = 0): Caselet {
  for (let attempt = 0; attempt < 96; attempt += 1) {
    const random = rng(`${seed}:${index}:${attempt}`); const profile = SCENARIO_PROFILES[Math.floor(random() * SCENARIO_PROFILES.length)]!; const people = shuffle(PEOPLE, random).slice(0, 6); const shuffledGroups = shuffle(GROUPS, random); const assignment: Assignment = {};
    people.forEach((person, personIndex) => { assignment[person] = shuffledGroups[Math.floor(personIndex / 2)]!; });
    const difficultyBand: DifficultyBand = (index + attempt) % 4 === 0 ? "Hard" : "Medium";
    try {
      const clues = chooseClues(people, assignment, profile, difficultyBand, random); const caseletId = `LP-001-${String(index + 1).padStart(3, "0")}`;
      return { caseletId, scenario: profile.scenario, scenarioProfileId: profile.id, difficultyBand, groups: GROUPS, groupLabels: profile.groupLabels, people, clues, assignment, children: makeChildren(caseletId, index, people, clues, assignment, profile, difficultyBand, random) };
    } catch { /* deterministic retry with a new state/profile */ }
  }
  throw new Error(`Unable to generate LP-001 caselet for seed ${seed}.`);
}

export function generateCaseletBatch(seed = "lp-001-review", count = 8): Caselet[] { return Array.from({ length: count }, (_, index) => generateCaselet(seed, index)); }

export const LP_001_REVIEW_PACKAGE = Object.freeze({
  packageId: "LP-001", label: "Logic Puzzles — Assignment and Grouping", subject: "Reasoning", topic: "Puzzles", subtopic: "Logic Puzzles", checkpointId: "LP-CP-001",
  qlIds: ["LP-QL-001", "LP-QL-002", "LP-QL-003", "LP-QL-004"], supportedDifficulties: ["Medium", "Hard"], supportedLanguages: ["en"], runtimeMode: "REVIEW_ONLY", reviewOnly: true,
});
