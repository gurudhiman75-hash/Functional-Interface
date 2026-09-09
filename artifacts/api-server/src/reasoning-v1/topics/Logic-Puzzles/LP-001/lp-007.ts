import type { DifficultyBand } from "./index.ts";

export type VariablePerson = "A" | "B" | "C" | "D" | "E";
export type VariableValue = "A" | "B" | "C" | "D" | "E";
export type VariableAssignment = Record<VariablePerson, VariableValue>;

export type VariableClue =
  | { kind: "PERSON_VALUE"; person: VariablePerson; value: VariableValue; text: string }
  | { kind: "PERSON_EITHER"; person: VariablePerson; values: readonly [VariableValue, VariableValue]; text: string }
  | { kind: "NOT_PERSON_VALUE"; person: VariablePerson; value: VariableValue; text: string };

export type Lp007Profile = {
  id: string;
  scenario: string;
  personNoun: string;
  valueNoun: string;
  oneToOneStatement: string;
  personQuestionTemplate: string;
  valueQuestionTemplate: string;
  directTemplates: readonly string[];
  eitherTemplates: readonly string[];
  notTemplates: readonly string[];
  people: Record<VariablePerson, string>;
  values: Record<VariableValue, string>;
};

export type Lp007Child = {
  questionId: string;
  qlId: "LP-QL-025" | "LP-QL-026" | "LP-QL-027" | "LP-QL-028";
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  difficultyBand: DifficultyBand;
  misconceptionFamily: string;
  explanation: { summary: string; lines: string[] };
};

export type Lp007Caselet = {
  caseletId: string;
  scenario: string;
  questionSetup: string;
  scenarioProfileId: string;
  difficultyBand: DifficultyBand;
  people: readonly VariablePerson[];
  values: readonly VariableValue[];
  labels: Lp007Profile;
  clues: readonly VariableClue[];
  assignment: VariableAssignment;
  children: readonly Lp007Child[];
};

const PEOPLE: readonly VariablePerson[] = ["A", "B", "C", "D", "E"];
const VALUES: readonly VariableValue[] = ["A", "B", "C", "D", "E"];

type ProfileTemplate = {
  id: string;
  scenario: string;
  personNoun: string;
  valueNoun: string;
  oneToOneStatement: string;
  personQuestionTemplate: string;
  valueQuestionTemplate: string;
  directTemplates: readonly string[];
  eitherTemplates: readonly string[];
  notTemplates: readonly string[];
  peoplePool: readonly string[];
  valuesPool: readonly string[];
};

const PROFILES: readonly ProfileTemplate[] = [
  {
    id: "FRUIT_PREFERENCE",
    scenario: "A market survey records the preferences of five customers.",
    personNoun: "customer",
    valueNoun: "fruit",
    oneToOneStatement: "Each fruit is liked by exactly one customer.",
    personQuestionTemplate: "Which fruit does {person} like?",
    valueQuestionTemplate: "Who likes {value}?",
    directTemplates: ["{person} likes {value}.", "The fruit liked by {person} is {value}."],
    eitherTemplates: ["{person} likes either {first} or {second}.", "The fruit liked by {person} is either {first} or {second}."],
    notTemplates: ["{person} does not like {value}.", "The fruit liked by {person} is not {value}."],
    peoplePool: ["Aarav", "Bhavna", "Chetan", "Diya", "Eshan", "Kavya", "Manav", "Neha", "Ritu", "Varun"],
    valuesPool: ["Mango", "Apple", "Guava", "Kiwi", "Orange", "Banana", "Grapes", "Papaya", "Pear", "Peach"],
  },
  {
    id: "TRAINING_MODULE",
    scenario: "A training board is assigning modules to five teachers.",
    personNoun: "teacher",
    valueNoun: "module",
    oneToOneStatement: "Each module is assigned to exactly one teacher.",
    personQuestionTemplate: "Which module is assigned to {person}?",
    valueQuestionTemplate: "Who is assigned {value}?",
    directTemplates: ["{person} is assigned {value}.", "The module assigned to {person} is {value}."],
    eitherTemplates: ["{person} is assigned either {first} or {second}.", "The module assigned to {person} is either {first} or {second}."],
    notTemplates: ["{person} is not assigned {value}.", "The module {value} is not assigned to {person}."],
    peoplePool: ["Anita", "Bharat", "Charu", "Dev", "Farah", "Gaurav", "Meena", "Pooja", "Rakesh", "Sneha"],
    valuesPool: ["Lesson Planning", "Assessment", "Classroom Management", "Educational Technology", "Child Development", "Inclusive Education", "Language Teaching", "School Leadership", "Library Work", "Sports Education"],
  },
  {
    id: "BANK_SERVICE",
    scenario: "A bank is assigning five officers to different customer-service areas.",
    personNoun: "officer",
    valueNoun: "service area",
    oneToOneStatement: "Each service area is handled by exactly one officer.",
    personQuestionTemplate: "Which service area does {person} handle?",
    valueQuestionTemplate: "Who handles {value}?",
    directTemplates: ["{person} handles {value}.", "The service area handled by {person} is {value}."],
    eitherTemplates: ["{person} handles either {first} or {second}.", "The service area handled by {person} is either {first} or {second}."],
    notTemplates: ["{person} does not handle {value}.", "The service area {value} is not handled by {person}."],
    peoplePool: ["Kamal", "Lata", "Mohit", "Nisha", "Omkar", "Priya", "Rahul", "Simran", "Tarun", "Zoya"],
    valuesPool: ["Accounts", "Loans", "Customer Service", "Risk Review", "Cash Management", "Compliance", "Credit Review", "Digital Banking", "Fraud Control", "Recovery"],
  },
  {
    id: "RESEARCH_AREA",
    scenario: "A university research team assigns five researchers to different study areas.",
    personNoun: "researcher",
    valueNoun: "study area",
    oneToOneStatement: "Each study area is assigned to exactly one researcher.",
    personQuestionTemplate: "Which study area does {person} work on?",
    valueQuestionTemplate: "Who works on {value}?",
    directTemplates: ["{person} works on {value}.", "The study area assigned to {person} is {value}."],
    eitherTemplates: ["{person} works on either {first} or {second}.", "The study area assigned to {person} is either {first} or {second}."],
    notTemplates: ["{person} does not work on {value}.", "The study area {value} is not assigned to {person}."],
    peoplePool: ["Ishan", "Meera", "Nakul", "Pallavi", "Aditya", "Geeta", "Kabir", "Nandini", "Rohan", "Tanvi"],
    valuesPool: ["Water", "Soil", "Agriculture", "Environment", "Climate", "Forests", "Geology", "Public Policy", "Rural Health", "Transport"],
  },
  {
    id: "CAMPUS_ACTIVITY",
    scenario: "A college is assigning five students to different student activities.",
    personNoun: "student",
    valueNoun: "activity",
    oneToOneStatement: "Each activity is chosen by exactly one student.",
    personQuestionTemplate: "Which activity does {person} choose?",
    valueQuestionTemplate: "Who chooses {value}?",
    directTemplates: ["{person} chooses {value}.", "The activity chosen by {person} is {value}."],
    eitherTemplates: ["{person} chooses either {first} or {second}.", "The activity chosen by {person} is either {first} or {second}."],
    notTemplates: ["{person} does not choose {value}.", "The activity {value} is not chosen by {person}."],
    peoplePool: ["Aditi", "Bharat", "Chandan", "Ira", "Jatin", "Kiran", "Mohan", "Nisha", "Parth", "Sonal"],
    valuesPool: ["Debate", "Drama", "Music", "Photography", "Robotics", "Athletics", "Eco Club", "Library", "Volunteering", "Fine Arts"],
  },
  {
    id: "OFFICE_SYSTEM",
    scenario: "An office assigns five coordinators to different information systems.",
    personNoun: "coordinator",
    valueNoun: "system",
    oneToOneStatement: "Each system is used by exactly one coordinator.",
    personQuestionTemplate: "Which system does {person} use?",
    valueQuestionTemplate: "Who uses {value}?",
    directTemplates: ["{person} uses {value}.", "The system used by {person} is {value}."],
    eitherTemplates: ["{person} uses either {first} or {second}.", "The system used by {person} is either {first} or {second}."],
    notTemplates: ["{person} does not use {value}.", "The system {value} is not used by {person}."],
    peoplePool: ["Aman", "Beena", "Dinesh", "Farah", "Gopal", "Harini", "Irfan", "Juhi", "Kartik", "Leela"],
    valuesPool: ["Payroll", "Inventory", "Attendance", "Procurement", "Help Desk", "Records", "Travel Desk", "Billing", "Security", "Scheduling"],
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

function materializeProfile(template: ProfileTemplate, random: () => number): Lp007Profile {
  const people = shuffle(template.peoplePool, random).slice(0, 5);
  const values = shuffle(template.valuesPool, random).slice(0, 5);
  return {
    id: template.id,
    scenario: template.scenario,
    personNoun: template.personNoun,
    valueNoun: template.valueNoun,
    oneToOneStatement: template.oneToOneStatement,
    personQuestionTemplate: template.personQuestionTemplate,
    valueQuestionTemplate: template.valueQuestionTemplate,
    directTemplates: template.directTemplates,
    eitherTemplates: template.eitherTemplates,
    notTemplates: template.notTemplates,
    people: { A: people[0]!, B: people[1]!, C: people[2]!, D: people[3]!, E: people[4]! },
    values: { A: values[0]!, B: values[1]!, C: values[2]!, D: values[3]!, E: values[4]! },
  };
}

function buildQuestionSetup(profile: Lp007Profile): string {
  const people = examList(PEOPLE.map((person) => profile.people[person]));
  const values = examList(VALUES.map((value) => profile.values[value]));
  return `${profile.scenario} The ${profile.personNoun}s—${people}—are each assigned one different ${profile.valueNoun} from the following: ${values}. ${profile.oneToOneStatement}`;
}

function enumerateAssignments(): VariableAssignment[] {
  return permutations(VALUES).map((order) => ({ A: order[0]!, B: order[1]!, C: order[2]!, D: order[3]!, E: order[4]! }));
}

function satisfies(assignment: VariableAssignment, clue: VariableClue): boolean {
  if (clue.kind === "PERSON_VALUE") return assignment[clue.person] === clue.value;
  if (clue.kind === "PERSON_EITHER") return clue.values.includes(assignment[clue.person]);
  return assignment[clue.person] !== clue.value;
}

export function solveLp007(input: { clues: readonly VariableClue[] }): VariableAssignment[] {
  return enumerateAssignments().filter((assignment) => input.clues.every((clue) => satisfies(assignment, clue)));
}

function clueKey(clue: VariableClue): string {
  if (clue.kind === "PERSON_VALUE") return `${clue.kind}:${clue.person}:${clue.value}`;
  if (clue.kind === "NOT_PERSON_VALUE") return `${clue.kind}:${clue.person}:${clue.value}`;
  return `${clue.kind}:${clue.person}:${[...clue.values].sort().join(":")}`;
}

function essential(clues: readonly VariableClue[]): boolean {
  return clues.every((_, removed) => solveLp007({ clues: clues.filter((__, index) => index !== removed) }).length > 1);
}

function directClue(person: VariablePerson, assignment: VariableAssignment, profile: Lp007Profile, random: () => number): VariableClue {
  const value = assignment[person];
  return { kind: "PERSON_VALUE", person, value, text: fill(pick(profile.directTemplates, random), { person: profile.people[person], value: profile.values[value] }) };
}

function eitherClue(person: VariablePerson, assignment: VariableAssignment, profile: Lp007Profile, random: () => number): VariableClue {
  const hidden = assignment[person];
  const other = pick(VALUES.filter((value) => value !== hidden), random);
  const values = shuffle([hidden, other], random) as [VariableValue, VariableValue];
  return { kind: "PERSON_EITHER", person, values, text: fill(pick(profile.eitherTemplates, random), { person: profile.people[person], first: profile.values[values[0]], second: profile.values[values[1]] }) };
}

function notClue(person: VariablePerson, value: VariableValue, profile: Lp007Profile, random: () => number): VariableClue {
  return { kind: "NOT_PERSON_VALUE", person, value, text: fill(pick(profile.notTemplates, random), { person: profile.people[person], value: profile.values[value] }) };
}

function buildCandidates(assignment: VariableAssignment, profile: Lp007Profile, random: () => number): VariableClue[] {
  const candidates: VariableClue[] = [];
  for (const person of PEOPLE) {
    candidates.push(directClue(person, assignment, profile, random));
    candidates.push(...VALUES.filter((value) => value !== assignment[person]).map((value) => notClue(person, value, profile, random)));
    for (let index = 0; index < VALUES.length; index += 1) {
      const other = VALUES[index]!;
      if (other !== assignment[person]) {
        const hidden = assignment[person];
        const values = shuffle([hidden, other], random) as [VariableValue, VariableValue];
        candidates.push({ kind: "PERSON_EITHER", person, values, text: fill(pick(profile.eitherTemplates, random), { person: profile.people[person], first: profile.values[values[0]], second: profile.values[values[1]] }) });
      }
    }
  }
  return shuffle(candidates, random);
}

function chooseClues(assignment: VariableAssignment, profile: Lp007Profile, difficultyBand: DifficultyBand, random: () => number): VariableClue[] {
  const all = enumerateAssignments();
  const candidates = buildCandidates(assignment, profile, random);
  const quotas: Array<{ required: readonly VariableClue["kind"][]; target: number }> = difficultyBand === "Easy"
    ? [{ required: ["PERSON_VALUE", "PERSON_VALUE", "PERSON_VALUE", "PERSON_VALUE"], target: 4 }]
    : difficultyBand === "Medium"
      ? [
          { required: ["PERSON_VALUE", "PERSON_EITHER", "NOT_PERSON_VALUE"], target: 6 },
          { required: ["PERSON_VALUE", "NOT_PERSON_VALUE", "PERSON_EITHER"], target: 6 },
          { required: ["PERSON_EITHER", "PERSON_VALUE", "NOT_PERSON_VALUE"], target: 6 },
        ]
      : [
          { required: ["PERSON_EITHER", "PERSON_EITHER", "NOT_PERSON_VALUE", "PERSON_VALUE"], target: 4 },
          { required: ["NOT_PERSON_VALUE", "PERSON_EITHER", "PERSON_EITHER", "PERSON_VALUE"], target: 4 },
          { required: ["PERSON_VALUE", "PERSON_EITHER", "NOT_PERSON_VALUE", "PERSON_EITHER"], target: 4 },
        ];

  for (const quota of shuffle(quotas, random)) {
    let survivors = all;
    const chosen: VariableClue[] = [];
    for (const kind of quota.required) {
      const selected = candidates
        .filter((candidate) => candidate.kind === kind && !chosen.some((clue) => clueKey(clue) === clueKey(candidate)))
        .map((candidate) => ({ candidate, remaining: survivors.filter((state) => satisfies(state, candidate)).length }))
        .filter((entry) => entry.remaining > 0 && entry.remaining < survivors.length)
        .sort((left, right) => left.remaining - right.remaining)[0]?.candidate;
      if (!selected) {
        chosen.length = 0;
        break;
      }
      chosen.push(selected);
      survivors = survivors.filter((state) => satisfies(state, selected));
    }
    while (chosen.length < quota.target && survivors.length > 1) {
      const selected = candidates
        .filter((candidate) => !chosen.some((clue) => clueKey(clue) === clueKey(candidate)))
        .map((candidate) => ({ candidate, remaining: survivors.filter((state) => satisfies(state, candidate)).length }))
        .filter((entry) => entry.remaining > 0 && entry.remaining < survivors.length)
        .sort((left, right) => left.remaining - right.remaining)[0]?.candidate;
      if (!selected) break;
      chosen.push(selected);
      survivors = survivors.filter((state) => satisfies(state, selected));
    }
    if (survivors.length === 1 && JSON.stringify(survivors[0]) === JSON.stringify(assignment) && essential(chosen)) return chosen;
  }
  throw new Error(`Unable to build an essential unique LP-007 variable puzzle (${difficultyBand}).`);
}

type PartialTable = {
  values: Partial<Record<VariablePerson, VariableValue>>;
  candidates: Partial<Record<VariablePerson, readonly VariableValue[]>>;
};

function emptyTable(): PartialTable { return { values: {}, candidates: {} }; }
function copyTable(table: PartialTable): PartialTable { return { values: { ...table.values }, candidates: { ...table.candidates } }; }

function tableMarkdown(people: readonly VariablePerson[], profile: Lp007Profile, table: PartialTable): string {
  const rows = people.map((person) => {
    const value = table.values[person];
    const candidates = table.candidates[person];
    const valueText = value ? profile.values[value] : candidates ? candidates.map((candidate) => profile.values[candidate]).join(" / ") : "—";
    return `| ${profile.people[person]} | ${valueText} |`;
  }).join("\n");
  return `| ${profile.personNoun[0]!.toUpperCase()}${profile.personNoun.slice(1)} | ${profile.valueNoun[0]!.toUpperCase()}${profile.valueNoun.slice(1)} |\n|---|---|\n${rows}`;
}

function directTable(clues: readonly VariableClue[]): PartialTable {
  const table = emptyTable();
  for (const clue of clues) if (clue.kind === "PERSON_VALUE") table.values[clue.person] = clue.value;
  return table;
}

function remaining<T extends string>(values: readonly T[], used: Iterable<T>): T[] {
  const usedSet = new Set(used);
  return values.filter((value) => !usedSet.has(value));
}

function buildExplanationEvidence(assignment: VariableAssignment, profile: Lp007Profile, difficultyBand: DifficultyBand, clues: readonly VariableClue[]): string[] {
  const direct = directTable(clues);
  const lines: string[] = [];
  const add = (title: string, detail: string, table: PartialTable) => lines.push(`**${title}**\n\n${detail}\n\n${tableMarkdown(PEOPLE, profile, table)}`);

  const directPeople = Object.keys(direct.values) as VariablePerson[];
  add("Step 1: Enter the direct assignments", directPeople.length ? "Record the choices stated directly in the clues. Leave the remaining rows blank." : "No choice is stated directly, so begin with the either-or and exclusion clues.", direct);

  if (difficultyBand === "Easy") {
    const completed = copyTable(direct);
    const missingPerson = PEOPLE.find((person) => !completed.values[person])!;
    const missingValue = remaining(VALUES, Object.values(completed.values))[0]!;
    completed.values[missingPerson] = missingValue;
    add("Step 2: Use the one-to-one rule", `The only unfilled person is ${profile.people[missingPerson]}. The only unused ${profile.valueNoun} is ${profile.values[missingValue]}, so it must be assigned to that person.`, completed);
    return lines;
  }

  const candidateTable = copyTable(direct);
  const usedDirectValues = Object.values(direct.values);
  for (const person of PEOPLE) {
    if (candidateTable.values[person]) continue;
    const localClues = clues.filter((clue) => clue.person === person);
    const allowed = VALUES.filter((value) => localClues.every((clue) => {
      if (clue.kind === "PERSON_VALUE") return value === clue.value;
      if (clue.kind === "PERSON_EITHER") return clue.values.includes(value);
      return value !== clue.value;
    })).filter((value) => !usedDirectValues.includes(value));
    candidateTable.candidates[person] = allowed.length ? allowed : [assignment[person]];
  }
  const restrictions = clues.filter((clue) => clue.kind !== "PERSON_VALUE").map((clue) => clue.text).join(" ");
  add("Step 2: Narrow the remaining choices", `Apply each restriction in the clues: ${restrictions || "the either-or and exclusion clues."} The one-to-one rule removes any value already used in a completed row.`, candidateTable);

  const completed = copyTable(candidateTable);
  for (const person of PEOPLE) completed.values[person] = assignment[person];
  completed.candidates = {};
  const unused = remaining(VALUES, Object.values(direct.values));
  add("Step 3: Complete the table", `After the stated restrictions are applied, the remaining rows have one consistent one-to-one arrangement. The unused choices at the start of this step are ${unused.map((value) => profile.values[value]).join(", ")}.`, completed);
  return lines;
}

function balance(options: readonly string[], answer: string, desired: number, random: () => number): string[] {
  const rest = shuffle(options.filter((option) => option !== answer), random);
  const result: string[] = [];
  for (let index = 0; index < 4; index += 1) result[index] = index === desired ? answer : rest.shift()!;
  return result;
}

function makeChildren(caseletId: string, index: number, assignment: VariableAssignment, profile: Lp007Profile, difficultyBand: DifficultyBand, clues: readonly VariableClue[], random: () => number): Lp007Child[] {
  const target = PEOPLE[(index + 1) % PEOPLE.length]!;
  const reverseValue = VALUES[(index + 2) % VALUES.length]!;
  const pairPeople = [PEOPLE[index % PEOPLE.length]!, PEOPLE[(index + 2) % PEOPLE.length]!];
  const triplePeople = [PEOPLE[index % PEOPLE.length]!, PEOPLE[(index + 1) % PEOPLE.length]!, PEOPLE[(index + 3) % PEOPLE.length]!];
  const setup = `${buildQuestionSetup(profile)}\n\nClues:\n${clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n`;
  const evidence = buildExplanationEvidence(assignment, profile, difficultyBand, clues);
  const explain = (summary: string, finalStep: string) => ({ summary, lines: [...evidence, `**Answer:** ${finalStep}`] });

  const valueAnswer = profile.values[assignment[target]];
  const valueOptions = balance(VALUES.map((value) => profile.values[value]), valueAnswer, index % 4, random);
  const personAnswer = profile.people[PEOPLE.find((person) => assignment[person] === reverseValue)!];
  const personOptions = balance(PEOPLE.map((person) => profile.people[person]), personAnswer, (index + 1) % 4, random);

  const pairAnswer = `${profile.people[pairPeople[0]]} — ${profile.values[assignment[pairPeople[0]]]}; ${profile.people[pairPeople[1]]} — ${profile.values[assignment[pairPeople[1]]]}`;
  const pairDistractors = [
    `${profile.people[pairPeople[0]]} — ${profile.values[assignment[pairPeople[1]]]}; ${profile.people[pairPeople[1]]} — ${profile.values[assignment[pairPeople[0]]]}`,
    `${profile.people[pairPeople[0]]} — ${profile.values[assignment[triplePeople[0]]]}; ${profile.people[pairPeople[1]]} — ${profile.values[assignment[triplePeople[1]]]}`,
    `${profile.people[pairPeople[0]]} — ${profile.values[assignment[triplePeople[1]]]}; ${profile.people[pairPeople[1]]} — ${profile.values[assignment[triplePeople[2]]]}`,
  ];

  const tripleAnswer = triplePeople.map((person) => `${profile.people[person]} — ${profile.values[assignment[person]]}`).join("; ");
  const tripleDistractors = [
    `${profile.people[triplePeople[0]]} — ${profile.values[assignment[triplePeople[1]]]}; ${profile.people[triplePeople[1]]} — ${profile.values[assignment[triplePeople[0]]]}; ${profile.people[triplePeople[2]]} — ${profile.values[assignment[triplePeople[2]]]}`,
    `${profile.people[triplePeople[0]]} — ${profile.values[assignment[triplePeople[2]]]}; ${profile.people[triplePeople[1]]} — ${profile.values[assignment[triplePeople[1]]]}; ${profile.people[triplePeople[2]]} — ${profile.values[assignment[triplePeople[0]]]}`,
    `${profile.people[triplePeople[0]]} — ${profile.values[assignment[triplePeople[0]]]}; ${profile.people[triplePeople[1]]} — ${profile.values[assignment[triplePeople[2]]]}; ${profile.people[triplePeople[2]]} — ${profile.values[assignment[triplePeople[1]]]}`,
  ];

  const pairOptions = balance([pairAnswer, ...pairDistractors], pairAnswer, (index + 2) % 4, random);
  const tripleOptions = balance([tripleAnswer, ...tripleDistractors], tripleAnswer, (index + 3) % 4, random);
  return [
    { questionId: `${caseletId}-Q1`, qlId: "LP-QL-025", stem: `${setup}${fill(profile.personQuestionTemplate, { person: profile.people[target] })}`, options: valueOptions, correctIndex: valueOptions.indexOf(valueAnswer), answer: valueAnswer, difficultyBand, misconceptionFamily: "VALUE_PERSON_MIXUP", explanation: explain(`${profile.people[target]} is assigned ${valueAnswer}.`, `${profile.people[target]}'s row shows ${valueAnswer}.`) },
    { questionId: `${caseletId}-Q2`, qlId: "LP-QL-026", stem: `${setup}${fill(profile.valueQuestionTemplate, { value: profile.values[reverseValue] })}`, options: personOptions, correctIndex: personOptions.indexOf(personAnswer), answer: personAnswer, difficultyBand, misconceptionFamily: "PERSON_VALUE_REVERSED", explanation: explain(`${personAnswer} is assigned ${profile.values[reverseValue]}.`, `${personAnswer}'s row shows ${profile.values[reverseValue]}.`) },
    { questionId: `${caseletId}-Q3`, qlId: "LP-QL-027", stem: `${setup}Which of the following correctly matches ${profile.people[pairPeople[0]]} and ${profile.people[pairPeople[1]]}, respectively?`, options: pairOptions, correctIndex: pairOptions.indexOf(pairAnswer), answer: pairAnswer, difficultyBand, misconceptionFamily: "SWAPPED_VALUE_PAIR", explanation: explain(`The two-person match is ${pairAnswer}.`, `The completed table gives ${pairAnswer}.`) },
    { questionId: `${caseletId}-Q4`, qlId: "LP-QL-028", stem: `${setup}Which of the following correctly matches the three named ${profile.personNoun}s?`, options: tripleOptions, correctIndex: tripleOptions.indexOf(tripleAnswer), answer: tripleAnswer, difficultyBand, misconceptionFamily: "CROSS_ROW_ATTRIBUTE_MIX", explanation: explain(`The three-person match is ${tripleAnswer}.`, `The completed table gives ${tripleAnswer}.`) },
  ];
}

export function generateLp007Caselet(seed: string, index: number): Lp007Caselet {
  const random = rng(`${seed}:${index}`);
  const template = PROFILES[(hashSeed(`${seed}:profile:${index}`) + index) % PROFILES.length]!;
  const profile = materializeProfile(template, random);
  const assignmentOrder = shuffle(VALUES, random);
  const assignment: VariableAssignment = { A: assignmentOrder[0]!, B: assignmentOrder[1]!, C: assignmentOrder[2]!, D: assignmentOrder[3]!, E: assignmentOrder[4]! };
  const difficultyBand: DifficultyBand = index % 3 === 0 ? "Easy" : index % 3 === 1 ? "Medium" : "Hard";
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const clues = chooseClues(assignment, profile, difficultyBand, random);
    const solutions = solveLp007({ clues });
    if (solutions.length === 1 && JSON.stringify(solutions[0]) === JSON.stringify(assignment) && essential(clues)) {
      const caseletId = `LP-007-${String(index + 1).padStart(3, "0")}`;
      return { caseletId, scenario: profile.scenario, questionSetup: buildQuestionSetup(profile), scenarioProfileId: profile.id, difficultyBand, people: PEOPLE, values: VALUES, labels: profile, clues, assignment, children: makeChildren(caseletId, index, assignment, profile, difficultyBand, clues, random) };
    }
  }
  throw new Error(`Unable to build LP-007 variable puzzle for seed ${seed}.`);
}

export function generateLp007Batch(seed = "lp-007-review", count = 8): Lp007Caselet[] {
  return Array.from({ length: count }, (_, index) => generateLp007Caselet(seed, index));
}

export const LP_007_REVIEW_PACKAGE = Object.freeze({ packageId: "LP-007", label: "Logic Puzzles — Variable and Preference Assignment", checkpointId: "LP-CP-007", qlIds: ["LP-QL-025", "LP-QL-026", "LP-QL-027", "LP-QL-028"], supportedDifficulties: ["Easy", "Medium", "Hard"], supportedLanguages: ["en"], runtimeMode: "REVIEW_ONLY", reviewOnly: true });
