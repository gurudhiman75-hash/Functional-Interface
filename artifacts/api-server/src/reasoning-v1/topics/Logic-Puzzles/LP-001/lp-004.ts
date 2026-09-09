import type { DifficultyBand } from "./index.ts";

export type CandidateId = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type SelectionAssignment = Record<CandidateId, boolean>;

export type SelectionClue =
  | { kind: "MUST_SELECT"; candidate: CandidateId; text: string }
  | { kind: "MUST_NOT_SELECT"; candidate: CandidateId; text: string }
  | { kind: "TOGETHER"; first: CandidateId; second: CandidateId; text: string }
  | { kind: "NOT_TOGETHER"; first: CandidateId; second: CandidateId; text: string }
  | { kind: "EXACTLY_ONE"; first: CandidateId; second: CandidateId; text: string }
  | { kind: "IF_SELECTED"; first: CandidateId; second: CandidateId; text: string };

export type Lp004Profile = {
  id: string;
  scenario: string;
  committeeLabel: string;
  candidateLabels: Record<CandidateId, string>;
  mustSelectTemplates: readonly string[];
  mustNotSelectTemplates: readonly string[];
  togetherTemplates: readonly string[];
  notTogetherTemplates: readonly string[];
  exactlyOneTemplates: readonly string[];
  ifSelectedTemplates: readonly string[];
  allSelectedQuestionTemplates: readonly string[];
  exactlyOneQuestionTemplates: readonly string[];
  statementQuestionTemplates: readonly string[];
  countQuestionTemplates: readonly string[];
};

export type Lp004Child = {
  questionId: string;
  qlId: "LP-QL-013" | "LP-QL-014" | "LP-QL-015" | "LP-QL-016";
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  difficultyBand: DifficultyBand;
  misconceptionFamily: string;
  explanation: { summary: string; lines: string[] };
};

export type Lp004Caselet = {
  caseletId: string;
  scenario: string;
  scenarioProfileId: string;
  difficultyBand: DifficultyBand;
  candidates: readonly CandidateId[];
  committeeSize: 4;
  candidateLabels: Record<CandidateId, string>;
  clues: readonly SelectionClue[];
  assignment: SelectionAssignment;
  children: readonly Lp004Child[];
};

const CANDIDATES: readonly CandidateId[] = ["A", "B", "C", "D", "E", "F", "G"];

const PROFILES: readonly Lp004Profile[] = [
  {
    id: "DISTRICT_HEALTH_TEAM",
    scenario: "A district health office must select four people from seven staff members for a vaccination outreach team: Asha, Baldev, Charu, Deepak, Esha, Farhan and Gita.",
    committeeLabel: "vaccination outreach team",
    candidateLabels: { A: "Asha", B: "Baldev", C: "Charu", D: "Deepak", E: "Esha", F: "Farhan", G: "Gita" },
    mustSelectTemplates: ["{first} is selected for the team.", "The team includes {first}."] ,
    mustNotSelectTemplates: ["{first} is not selected for the team.", "{first} is left out of the team."],
    togetherTemplates: ["{first} and {second} are either both selected or both left out.", "The team includes both {first} and {second}, or neither of them."],
    notTogetherTemplates: ["At most one of {first} and {second} is selected.", "{first} and {second} cannot both be selected for the team."],
    exactlyOneTemplates: ["Exactly one of {first} and {second} is selected.", "The team includes one, but not both, of {first} and {second}."],
    ifSelectedTemplates: ["If {first} is selected, {second} must also be selected.", "Selecting {first} requires selecting {second}."],
    allSelectedQuestionTemplates: ["Which pair is entirely included in the vaccination outreach team?", "Which of the following pairs consists only of selected team members?"],
    exactlyOneQuestionTemplates: ["Which pair contains exactly one person selected for the vaccination outreach team?", "For which pair is exactly one person on the selected team?"],
    statementQuestionTemplates: ["Which statement about {first}, {second} and {third} is correct?", "Which option correctly describes the selection of {first}, {second} and {third}?"],
    countQuestionTemplates: ["How many of {first}, {second} and {third} are selected for the vaccination outreach team?", "Among {first}, {second} and {third}, how many are on the selected team?"],
  },
  {
    id: "SCHOOL_EVENT_PANEL",
    scenario: "A government school is forming a four-member annual-day planning committee from seven teachers: Ananya, Bhavna, Chetan, Divya, Ekta, Faisal and Harish.",
    committeeLabel: "annual-day planning committee",
    candidateLabels: { A: "Ananya", B: "Bhavna", C: "Chetan", D: "Divya", E: "Ekta", F: "Faisal", G: "Harish" },
    mustSelectTemplates: ["{first} is on the annual-day committee.", "{first} must be included in the committee."],
    mustNotSelectTemplates: ["{first} is not on the annual-day committee.", "The committee does not include {first}."],
    togetherTemplates: ["Either both {first} and {second} are on the committee or neither is.", "{first} and {second} are selected together."],
    notTogetherTemplates: ["{first} and {second} are not selected together.", "The committee can include at most one of {first} and {second}."],
    exactlyOneTemplates: ["One and only one of {first} and {second} is on the committee.", "The committee includes exactly one of {first} and {second}."],
    ifSelectedTemplates: ["Whenever {first} is selected, {second} is selected as well.", "{first} can be selected only if {second} is also selected."],
    allSelectedQuestionTemplates: ["Which pair is completely included in the annual-day planning committee?", "Which pair has both teachers selected for the committee?"],
    exactlyOneQuestionTemplates: ["Which pair has exactly one teacher selected for the annual-day committee?", "For which pair is only one teacher selected?"],
    statementQuestionTemplates: ["Which statement about {first}, {second} and {third} is correct?", "Which option gives the correct selection pattern for {first}, {second} and {third}?"],
    countQuestionTemplates: ["How many of {first}, {second} and {third} are on the annual-day committee?", "How many teachers from {first}, {second} and {third} are selected?"],
  },
  {
    id: "BANK_AUDIT_TEAM",
    scenario: "A bank branch is selecting four people from seven officers for an internal audit team: Kamal, Lata, Mohit, Nisha, Omkar, Pooja and Rakesh.",
    committeeLabel: "internal audit team",
    candidateLabels: { A: "Kamal", B: "Lata", C: "Mohit", D: "Nisha", E: "Omkar", F: "Pooja", G: "Rakesh" },
    mustSelectTemplates: ["{first} is assigned to the internal audit team.", "The selected audit team contains {first}."],
    mustNotSelectTemplates: ["{first} is not assigned to the audit team.", "{first} is excluded from the selected audit team."],
    togetherTemplates: ["{first} and {second} are either both assigned or both excluded.", "The audit team selects {first} and {second} together."],
    notTogetherTemplates: ["{first} and {second} cannot both be assigned to the audit team.", "At most one of {first} and {second} can be selected."],
    exactlyOneTemplates: ["Exactly one of {first} and {second} is assigned to the audit team.", "The selected team contains one of {first} and {second}, but not both."],
    ifSelectedTemplates: ["Selecting {first} requires {second} to be selected too.", "If {first} joins the audit team, {second} must join as well."],
    allSelectedQuestionTemplates: ["Which pair is fully present in the internal audit team?", "Which of the following pairs contains two selected audit officers?"],
    exactlyOneQuestionTemplates: ["Which pair contains exactly one member of the internal audit team?", "For which pair is exactly one officer selected for the audit?"],
    statementQuestionTemplates: ["Which statement correctly describes {first}, {second} and {third}?", "Which option gives the true selection pattern for {first}, {second} and {third}?"],
    countQuestionTemplates: ["How many of {first}, {second} and {third} are assigned to the internal audit team?", "How many officers among {first}, {second} and {third} are selected?"],
  },
  {
    id: "MUNICIPAL_WATER_SURVEY",
    scenario: "A municipal corporation is choosing four people from seven employees for a drinking-water survey team: Arun, Beena, Chander, Devika, Iqbal, Jyoti and Karan.",
    committeeLabel: "drinking-water survey team",
    candidateLabels: { A: "Arun", B: "Beena", C: "Chander", D: "Devika", E: "Iqbal", F: "Jyoti", G: "Karan" },
    mustSelectTemplates: ["{first} is chosen for the survey team.", "The survey team must include {first}."],
    mustNotSelectTemplates: ["{first} is not chosen for the survey team.", "{first} is not part of the selected survey team."],
    togetherTemplates: ["{first} and {second} are selected together or excluded together.", "The survey team either includes both {first} and {second} or includes neither."],
    notTogetherTemplates: ["{first} and {second} cannot serve together on the team.", "The selected team contains at most one of {first} and {second}."],
    exactlyOneTemplates: ["The survey team includes exactly one of {first} and {second}.", "Of {first} and {second}, exactly one is selected."],
    ifSelectedTemplates: ["{first} is selected only when {second} is selected as well.", "If the team selects {first}, it must also select {second}."],
    allSelectedQuestionTemplates: ["Which pair is fully included in the drinking-water survey team?", "Which pair consists of two people selected for the survey?"],
    exactlyOneQuestionTemplates: ["For which pair is exactly one person selected for the drinking-water survey?", "Which pair has one selected member and one unselected member?"],
    statementQuestionTemplates: ["Which statement about {first}, {second} and {third} is true?", "Which option correctly reports the selection of {first}, {second} and {third}?"],
    countQuestionTemplates: ["How many of {first}, {second} and {third} are chosen for the drinking-water survey?", "How many members of the selected survey team are drawn from {first}, {second} and {third}?"],
  },
  {
    id: "RAILWAY_SAFETY_PANEL",
    scenario: "A railway depot is forming a four-member safety review panel from seven supervisors: Amit, Bhupinder, Charan, Dimple, Eshwar, Feroz and Gurpreet.",
    committeeLabel: "railway safety review panel",
    candidateLabels: { A: "Amit", B: "Bhupinder", C: "Charan", D: "Dimple", E: "Eshwar", F: "Feroz", G: "Gurpreet" },
    mustSelectTemplates: ["The safety panel includes {first}.", "{first} is selected for the safety review panel."],
    mustNotSelectTemplates: ["The safety panel does not include {first}.", "{first} is left off the safety review panel."],
    togetherTemplates: ["{first} and {second} are both on the panel or both off it.", "The panel selects {first} and {second} as a pair."],
    notTogetherTemplates: ["{first} and {second} cannot both serve on the panel.", "The panel includes no more than one of {first} and {second}."],
    exactlyOneTemplates: ["The panel selects exactly one of {first} and {second}.", "One, and only one, of {first} and {second} serves on the panel."],
    ifSelectedTemplates: ["If {first} serves on the panel, {second} must serve on it too.", "{first} may join the panel only along with {second}."],
    allSelectedQuestionTemplates: ["Which pair is entirely present on the railway safety review panel?", "Which pair consists of two supervisors selected for the panel?"],
    exactlyOneQuestionTemplates: ["Which pair has exactly one supervisor selected for the safety panel?", "For which pair is one supervisor selected and the other left out?"],
    statementQuestionTemplates: ["Which statement about {first}, {second} and {third} is correct?", "Which option gives the correct panel-selection pattern for {first}, {second} and {third}?"],
    countQuestionTemplates: ["How many of {first}, {second} and {third} serve on the railway safety review panel?", "How many supervisors among {first}, {second} and {third} are selected?"],
  },
  {
    id: "EXAM_BOARD_COMMITTEE",
    scenario: "A recruitment board is selecting four people from seven officials to review an examination centre: Hardeep, Inder, Jasleen, Kiran, Mandeep, Navneet and Parminder.",
    committeeLabel: "examination-centre review committee",
    candidateLabels: { A: "Hardeep", B: "Inder", C: "Jasleen", D: "Kiran", E: "Mandeep", F: "Navneet", G: "Parminder" },
    mustSelectTemplates: ["{first} is included in the review committee.", "The review committee selects {first}."],
    mustNotSelectTemplates: ["{first} is not included in the review committee.", "The review committee leaves out {first}."],
    togetherTemplates: ["Either both {first} and {second} are selected or both are left out.", "{first} and {second} must enter the review committee together."],
    notTogetherTemplates: ["The review committee cannot contain both {first} and {second}.", "At most one of {first} and {second} can be selected for review."],
    exactlyOneTemplates: ["Exactly one of {first} and {second} is on the review committee.", "The review committee selects one, but not both, of {first} and {second}."],
    ifSelectedTemplates: ["If {first} is included, {second} must also be included.", "{first} can be selected only if {second} is selected."],
    allSelectedQuestionTemplates: ["Which pair is fully included in the examination-centre review committee?", "Which pair contains two officials selected for the review committee?"],
    exactlyOneQuestionTemplates: ["Which pair contains exactly one official selected for the review committee?", "For which pair is exactly one official selected?"],
    statementQuestionTemplates: ["Which statement about {first}, {second} and {third} is correct?", "Which option accurately describes the review-committee selection of {first}, {second} and {third}?"],
    countQuestionTemplates: ["How many of {first}, {second} and {third} are selected for the examination-centre review committee?", "How many officials among {first}, {second} and {third} are selected?"],
  },
];

function hashSeed(value: string): number { let hash = 2166136261; for (const char of value) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); } return hash >>> 0; }
function rng(seed: string) { let state = hashSeed(seed) || 1; return () => { state = Math.imul(state ^ (state >>> 15), 2246822519) >>> 0; state = Math.imul(state ^ (state >>> 13), 3266489917) >>> 0; return ((state ^ (state >>> 16)) >>> 0) / 4294967296; }; }
function shuffle<T>(items: readonly T[], random: () => number): T[] { const result = [...items]; for (let index = result.length - 1; index > 0; index -= 1) { const swap = Math.floor(random() * (index + 1)); [result[index], result[swap]] = [result[swap], result[index]]; } return result; }
function fill(template: string, values: Record<string, string>): string { return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? key); }
function template<T extends readonly string[]>(templates: T, random: () => number): string { return templates[Math.floor(random() * templates.length)]!; }
function cleanExamText(text: string): string {
  return text
    .replaceAll("Which pair is entirely included in the ", "Which pair has both people selected for the ")
    .replaceAll("Which pair is completely included in the ", "Which pair has both people selected for the ")
    .replaceAll("Which pair is fully included in the ", "Which pair has both people selected for the ")
    .replaceAll("Which pair is fully present on the ", "Which pair has both people selected for the ")
    .replaceAll("Which pair is fully present in the ", "Which pair has both people selected for the ")
    .replaceAll("Which of the following pairs consists only of selected team members?", "Which of the following pairs has both people selected?")
    .replaceAll("are either both selected or both left out", "are either both selected or both not selected")
    .replaceAll("either both selected or both left out", "either both selected or both not selected")
    .replaceAll("Whenever ", "If ")
    .replaceAll("as well", "too")
    .replaceAll("along with", "with")
    .replaceAll("accurately describes", "shows")
    .replaceAll("correctly describes", "shows")
    .replaceAll("correctly reports", "shows")
    .replaceAll("correct selection pattern", "selection pattern")
    .replaceAll("correctly gives", "gives")
    .replaceAll("The clues determine one", "The clues give one")
    .replaceAll("The status table makes the selection explicit.", "The table shows who is selected.")
    .replaceAll("The committee has exactly four members.", "The committee has four members.");
}
function pairKey(first: CandidateId, second: CandidateId): string { return [first, second].sort().join(":"); }
function clueKey(clue: SelectionClue): string {
  if (clue.kind === "MUST_SELECT" || clue.kind === "MUST_NOT_SELECT") return `${clue.kind}:${clue.candidate}`;
  if (clue.kind === "IF_SELECTED") return `${clue.kind}:${clue.first}:${clue.second}`;
  return `${clue.kind}:${pairKey(clue.first, clue.second)}`;
}

function enumerateAssignments(candidates: readonly CandidateId[], committeeSize: number): SelectionAssignment[] {
  const assignments: SelectionAssignment[] = [];
  const choose = (start: number, selected: CandidateId[]) => {
    if (selected.length === committeeSize) {
      const selectedSet = new Set(selected);
      const assignment = {} as SelectionAssignment;
      candidates.forEach((candidate) => { assignment[candidate] = selectedSet.has(candidate); });
      assignments.push(assignment);
      return;
    }
    for (let index = start; index <= candidates.length - (committeeSize - selected.length); index += 1) choose(index + 1, [...selected, candidates[index]!]);
  };
  choose(0, []);
  return assignments;
}

function satisfies(assignment: SelectionAssignment, clue: SelectionClue): boolean {
  if (clue.kind === "MUST_SELECT") return assignment[clue.candidate];
  if (clue.kind === "MUST_NOT_SELECT") return !assignment[clue.candidate];
  if (clue.kind === "TOGETHER") return assignment[clue.first] === assignment[clue.second];
  if (clue.kind === "NOT_TOGETHER") return !(assignment[clue.first] && assignment[clue.second]);
  if (clue.kind === "EXACTLY_ONE") return assignment[clue.first] !== assignment[clue.second];
  return !assignment[clue.first] || assignment[clue.second];
}

function buildCandidates(candidates: readonly CandidateId[], hidden: SelectionAssignment, profile: Lp004Profile, random: () => number): SelectionClue[] {
  const result: SelectionClue[] = [];
  for (const candidate of candidates) {
    const values = { first: profile.candidateLabels[candidate] };
    result.push(hidden[candidate]
      ? { kind: "MUST_SELECT", candidate, text: cleanExamText(fill(template(profile.mustSelectTemplates, random), values)) }
      : { kind: "MUST_NOT_SELECT", candidate, text: cleanExamText(fill(template(profile.mustNotSelectTemplates, random), values)) });
  }
  for (let left = 0; left < candidates.length; left += 1) for (let right = left + 1; right < candidates.length; right += 1) {
    const first = candidates[left]!; const second = candidates[right]!; const values = { first: profile.candidateLabels[first], second: profile.candidateLabels[second] };
    if (hidden[first] === hidden[second]) result.push({ kind: "TOGETHER", first, second, text: cleanExamText(fill(template(profile.togetherTemplates, random), values)) });
    if (!(hidden[first] && hidden[second])) result.push({ kind: "NOT_TOGETHER", first, second, text: cleanExamText(fill(template(profile.notTogetherTemplates, random), values)) });
    if (hidden[first] !== hidden[second]) result.push({ kind: "EXACTLY_ONE", first, second, text: cleanExamText(fill(template(profile.exactlyOneTemplates, random), values)) });
    if (hidden[first] && hidden[second]) {
      result.push({ kind: "IF_SELECTED", first, second, text: cleanExamText(fill(template(profile.ifSelectedTemplates, random), values)) });
      result.push({ kind: "IF_SELECTED", first: second, second: first, text: cleanExamText(fill(template(profile.ifSelectedTemplates, random), { first: profile.candidateLabels[second], second: profile.candidateLabels[first] })) });
    }
  }
  return result;
}

function best(survivors: SelectionAssignment[], candidates: SelectionClue[], chosen: SelectionClue[], kind?: SelectionClue["kind"]): SelectionClue | undefined {
  return candidates
    .filter((candidate) => (!kind || candidate.kind === kind) && !chosen.some((clue) => clueKey(clue) === clueKey(candidate)))
    .map((candidate) => ({ candidate, remaining: survivors.filter((state) => satisfies(state, candidate)).length }))
    .filter((entry) => entry.remaining > 0 && entry.remaining < survivors.length)
    .sort((left, right) => left.remaining - right.remaining)[0]?.candidate;
}

function cluesAreEssential(all: readonly SelectionAssignment[], clues: readonly SelectionClue[]): boolean {
  return clues.every((_, removed) => all.filter((state) => clues.every((clue, index) => index === removed || satisfies(state, clue))).length > 1);
}

function chooseClues(candidates: readonly CandidateId[], hidden: SelectionAssignment, profile: Lp004Profile, difficultyBand: DifficultyBand, random: () => number): SelectionClue[] {
  const all = enumerateAssignments(candidates, 4); const available = buildCandidates(candidates, hidden, profile, random);
  const quotas: Array<readonly SelectionClue["kind"][]> = difficultyBand === "Hard"
    ? [["TOGETHER", "EXACTLY_ONE", "IF_SELECTED", "NOT_TOGETHER", "MUST_SELECT"], ["EXACTLY_ONE", "TOGETHER", "MUST_NOT_SELECT", "IF_SELECTED", "NOT_TOGETHER"], ["IF_SELECTED", "EXACTLY_ONE", "NOT_TOGETHER", "TOGETHER", "MUST_NOT_SELECT"]]
    : [["MUST_SELECT", "EXACTLY_ONE", "TOGETHER", "NOT_TOGETHER"], ["EXACTLY_ONE", "MUST_NOT_SELECT", "TOGETHER", "NOT_TOGETHER"], ["TOGETHER", "MUST_SELECT", "EXACTLY_ONE", "NOT_TOGETHER"]];
  for (const quota of shuffle(quotas, random)) {
    let survivors = all; const chosen: SelectionClue[] = []; let failed = false;
    for (const kind of quota) { const selected = best(survivors, available, chosen, kind); if (!selected) { failed = true; break; } chosen.push(selected); survivors = survivors.filter((state) => satisfies(state, selected)); }
    if (failed) continue;
    while (chosen.length < (difficultyBand === "Hard" ? 7 : 5) && survivors.length > 1) { const selected = best(survivors, available, chosen); if (!selected) break; chosen.push(selected); survivors = survivors.filter((state) => satisfies(state, selected)); }
    if (survivors.length === 1 && JSON.stringify(survivors[0]) === JSON.stringify(hidden) && cluesAreEssential(all, chosen)) return chosen;
  }
  throw new Error("Unable to build essential unique LP-004 committee clue set.");
}

function balance(options: readonly string[], answer: string, desired: number, random: () => number): string[] {
  const remaining = shuffle(options.filter((option) => option !== answer), random); const result: string[] = [];
  for (let index = 0; index < 4; index += 1) result[index] = index === desired ? answer : remaining.shift()!;
  return result;
}

function pairList(candidates: readonly CandidateId[]): Array<[CandidateId, CandidateId]> { const pairs: Array<[CandidateId, CandidateId]> = []; for (let left = 0; left < candidates.length; left += 1) for (let right = left + 1; right < candidates.length; right += 1) pairs.push([candidates[left]!, candidates[right]!]); return pairs; }
function names(profile: Lp004Profile, candidates: readonly CandidateId[]): string { return candidates.map((candidate) => profile.candidateLabels[candidate]).join(", "); }
function subsetStatement(profile: Lp004Profile, candidates: readonly CandidateId[], selected: readonly CandidateId[]): string {
  const selectedSet = new Set(selected); const chosen = candidates.filter((candidate) => selectedSet.has(candidate)).map((candidate) => profile.candidateLabels[candidate]);
  if (chosen.length === 0) return `None of ${names(profile, candidates)} is selected.`;
  if (chosen.length === candidates.length) return `All three of ${names(profile, candidates)} are selected.`;
  if (chosen.length === 1) return `Only ${chosen[0]} is selected among ${names(profile, candidates)}.`;
  return `${chosen.join(" and ")} are selected, but ${candidates.filter((candidate) => !selectedSet.has(candidate)).map((candidate) => profile.candidateLabels[candidate]).join(" and ")} is not.`;
}

function makeChildren(caseletId: string, index: number, candidates: readonly CandidateId[], assignment: SelectionAssignment, profile: Lp004Profile, difficultyBand: DifficultyBand, clues: readonly SelectionClue[], random: () => number): Lp004Child[] {
  const selected = candidates.filter((candidate) => assignment[candidate]); const unselected = candidates.filter((candidate) => !assignment[candidate]);
  const selectedPair = shuffle(pairList(selected), random)[0]!;
  const crossPair = shuffle(selected.flatMap((first) => unselected.map((second) => [first, second] as [CandidateId, CandidateId])), random)[0]!;
  const triple = shuffle(candidates, random).slice(0, 3);
  const actualTripleSelected = triple.filter((candidate) => assignment[candidate]);
  const actualStatement = subsetStatement(profile, triple, actualTripleSelected);
  const allMasks = Array.from({ length: 8 }, (_, mask) => mask).filter((mask) => mask !== triple.reduce((value, candidate, tripleIndex) => value | (assignment[candidate] ? (1 << tripleIndex) : 0), 0));
  const statementDistractors = shuffle(allMasks, random).slice(0, 3).map((mask) => subsetStatement(profile, triple, triple.filter((_, tripleIndex) => Boolean(mask & (1 << tripleIndex)))));
  const statementOptions = balance([actualStatement, ...statementDistractors], actualStatement, (index + 2) % 4, random);
  const countAnswer = String(actualTripleSelected.length);
  const countOptions = balance(["0", "1", "2", "3"], countAnswer, (index + 3) % 4, random);
  const clueLead = clues.slice(0, Math.min(3, clues.length)).map((clue, clueIndex) => { const text = clue.text.replace(/[.]$/u, ""); return clueIndex === 0 ? text : `${text.charAt(0).toLowerCase()}${text.slice(1)}`; }).join("; then ");
  const leads = [`Start with these constraints: ${clueLead}.`, `The decisive clues are ${clueLead}.`, `Apply the relevant clues in order: ${clueLead}.`, `Combining these clues—${clueLead}—leaves one committee.`];
  const selectedRows = candidates.filter((candidate) => assignment[candidate]).map((candidate) => `| ${profile.candidateLabels[candidate]} | Selected |`);
  const unselectedRows = candidates.filter((candidate) => !assignment[candidate]).map((candidate) => `| ${profile.candidateLabels[candidate]} | Not selected |`);
  const table = `| Candidate | Status |\n|---|---|\n${[...selectedRows, ...unselectedRows].join("\n")}`;
  const evidence = cleanExamText(difficultyBand === "Hard" ? `${leads[index % 4]} The committee has exactly four members.\n\n${table}` : `The clues determine one four-member committee. The status table makes the selection explicit.\n\n${table}`);
  const explain = (summary: string, finalStep: string) => ({ summary: cleanExamText(summary), lines: [evidence, cleanExamText(finalStep)] });
  const pairAllAnswer = names(profile, selectedPair);
  const pairAllOptions = balance([pairAllAnswer, ...shuffle(pairList(candidates).filter(([first, second]) => !(assignment[first] && assignment[second]) && pairKey(first, second) !== pairKey(selectedPair[0], selectedPair[1])), random).slice(0, 3).map((pair) => names(profile, pair))], pairAllAnswer, index % 4, random);
  const exactlyOneAnswer = names(profile, crossPair);
  const exactlyOneOptions = balance([exactlyOneAnswer, ...shuffle(pairList(candidates).filter(([first, second]) => assignment[first] === assignment[second] && pairKey(first, second) !== pairKey(crossPair[0], crossPair[1])), random).slice(0, 3).map((pair) => names(profile, pair))], exactlyOneAnswer, (index + 1) % 4, random);
  return [
    { questionId: `${caseletId}-Q1`, qlId: "LP-QL-013", stem: cleanExamText(profile.allSelectedQuestionTemplates[index % profile.allSelectedQuestionTemplates.length]!), options: pairAllOptions, correctIndex: pairAllOptions.indexOf(pairAllAnswer), answer: pairAllAnswer, difficultyBand, misconceptionFamily: "PARTIAL_COMMITTEE_PAIR", explanation: explain(`${pairAllAnswer} are both selected for the ${profile.committeeLabel}.`, `Both names are marked “Selected” in the table, so this pair is selected.`) },
    { questionId: `${caseletId}-Q2`, qlId: "LP-QL-014", stem: cleanExamText(profile.exactlyOneQuestionTemplates[index % profile.exactlyOneQuestionTemplates.length]!), options: exactlyOneOptions, correctIndex: exactlyOneOptions.indexOf(exactlyOneAnswer), answer: exactlyOneAnswer, difficultyBand, misconceptionFamily: "EXACTLY_ONE_MISREAD", explanation: explain(`Exactly one of ${exactlyOneAnswer} is selected.`, `${profile.candidateLabels[crossPair[0]!]} is marked “${assignment[crossPair[0]!] ? "Selected" : "Not selected"}” and ${profile.candidateLabels[crossPair[1]!]} is marked “${assignment[crossPair[1]!] ? "Selected" : "Not selected"}.”`) },
    { questionId: `${caseletId}-Q3`, qlId: "LP-QL-015", stem: cleanExamText(fill(profile.statementQuestionTemplates[index % profile.statementQuestionTemplates.length]!, { first: profile.candidateLabels[triple[0]!], second: profile.candidateLabels[triple[1]!], third: profile.candidateLabels[triple[2]!] })), options: statementOptions, correctIndex: statementOptions.indexOf(actualStatement), answer: actualStatement, difficultyBand, misconceptionFamily: "STATUS_PATTERN_CONFUSION", explanation: explain(`The selection pattern is: ${actualStatement}`, `Read the three named rows in the table. They show the pattern in the correct option.`) },
    { questionId: `${caseletId}-Q4`, qlId: "LP-QL-016", stem: cleanExamText(fill(profile.countQuestionTemplates[index % profile.countQuestionTemplates.length]!, { first: profile.candidateLabels[triple[0]!], second: profile.candidateLabels[triple[1]!], third: profile.candidateLabels[triple[2]!] })), options: countOptions, correctIndex: countOptions.indexOf(countAnswer), answer: countAnswer, difficultyBand, misconceptionFamily: "COMMITTEE_COUNT_ERROR", explanation: explain(`${countAnswer} of the three named people are selected.`, `Count the names marked “Selected”: ${names(profile, triple)}. The total is ${countAnswer}.`) },
  ];
}

export function solveLp004(caselet: Pick<Lp004Caselet, "candidates" | "committeeSize" | "clues">): SelectionAssignment[] { return enumerateAssignments(caselet.candidates, caselet.committeeSize).filter((assignment) => caselet.clues.every((clue) => satisfies(assignment, clue))); }

export function generateLp004Caselet(seed = "lp-004-review", index = 0): Lp004Caselet {
  for (let attempt = 0; attempt < 96; attempt += 1) {
    const random = rng(`${seed}:${index}:${attempt}`); const profile = PROFILES[Math.floor(random() * PROFILES.length)]!; const candidates = shuffle(CANDIDATES, random); const selected = new Set(shuffle(candidates, random).slice(0, 4)); const assignment = {} as SelectionAssignment;
    candidates.forEach((candidate) => { assignment[candidate] = selected.has(candidate); });
    const difficultyBand: DifficultyBand = index % 2 === 0 ? "Hard" : "Medium";
    try { const clues = chooseClues(candidates, assignment, profile, difficultyBand, random); const caseletId = `LP-004-${String(index + 1).padStart(3, "0")}`; return { caseletId, scenario: profile.scenario, scenarioProfileId: profile.id, difficultyBand, candidates, committeeSize: 4, candidateLabels: profile.candidateLabels, clues, assignment, children: makeChildren(caseletId, index, candidates, assignment, profile, difficultyBand, clues, random) }; } catch { /* deterministic retry */ }
  }
  throw new Error(`Unable to generate LP-004 caselet for seed ${seed}.`);
}

export function generateLp004Batch(seed = "lp-004-review", count = 8): Lp004Caselet[] { return Array.from({ length: count }, (_, index) => generateLp004Caselet(seed, index)); }

export const LP_004_REVIEW_PACKAGE = Object.freeze({ packageId: "LP-004", label: "Logic Puzzles — Selection and Conditional Committees", checkpointId: "LP-CP-004", qlIds: ["LP-QL-013", "LP-QL-014", "LP-QL-015", "LP-QL-016"], supportedDifficulties: ["Medium", "Hard"], supportedLanguages: ["en"], runtimeMode: "REVIEW_ONLY", reviewOnly: true });
