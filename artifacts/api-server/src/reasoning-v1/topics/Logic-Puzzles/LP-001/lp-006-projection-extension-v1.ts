import type { DifficultyBand } from "./index.ts";
import {
  type Lp006Caselet,
  type SynthCity,
  type SynthDay,
  type SynthPerson,
  type SynthSubject,
} from "./lp-006.ts";
import { generateLp006BatchStabilizedV4_2 } from "./lp-001-008-stabilized-english-v4-2.ts";

export const LP_006_PROJECTION_EXTENSION_V1 = Object.freeze({
  authorityId: "LP_006_PROJECTION_EXTENSION_V1" as const,
  sourceEnglishAuthorityId: "LP_001_008_STABILIZED_ENGLISH_V4_2" as const,
  packageId: "LP-006" as const,
  checkpointId: "LP-CP-006" as const,
  status: "PROVISIONAL_REVIEW_CANDIDATE" as const,
  provisionalQlIds: ["LP-QL-041", "LP-QL-042"] as const,
  permanentQlAllocationStatus: "UNALLOCATED" as const,
  changesHiddenState: false as const,
  changesExistingClues: false as const,
  changesExistingChildren: false as const,
  runtimeMode: "REVIEW_ONLY" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
});

type ProjectionDimension = "PERSON" | "DAY" | "SUBJECT" | "CITY";
type NonPersonDimension = Exclude<ProjectionDimension, "PERSON">;

type ProjectionPair = readonly [NonPersonDimension, ProjectionDimension];
const PROJECTION_PAIRS: readonly ProjectionPair[] = [
  ["SUBJECT", "CITY"],
  ["SUBJECT", "PERSON"],
  ["SUBJECT", "DAY"],
  ["CITY", "SUBJECT"],
  ["CITY", "PERSON"],
  ["CITY", "DAY"],
  ["DAY", "SUBJECT"],
  ["DAY", "PERSON"],
  ["DAY", "CITY"],
] as const;

type Statement =
  | { kind: "PERSON_DAY"; person: SynthPerson; day: SynthDay }
  | { kind: "PERSON_SUBJECT"; person: SynthPerson; subject: SynthSubject }
  | { kind: "PERSON_CITY"; person: SynthPerson; city: SynthCity }
  | { kind: "SUBJECT_CITY"; subject: SynthSubject; city: SynthCity }
  | { kind: "SUBJECT_DAY"; subject: SynthSubject; day: SynthDay }
  | { kind: "CITY_DAY"; city: SynthCity; day: SynthDay };

type ProjectionProof = {
  sourceDimension: NonPersonDimension;
  targetDimension: ProjectionDimension;
  sourcePerson: SynthPerson;
  sourceValue: string;
  targetValue: string;
};

type StatementProof = {
  polarity: "CORRECT" | "INCORRECT";
  truthByOption: readonly boolean[];
};

export type Lp006ProjectionChild = {
  questionId: string;
  qlId: "LP-QL-041" | "LP-QL-042";
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  difficultyBand: DifficultyBand;
  misconceptionFamily: string;
  explanation: { summary: string; lines: string[] };
  proof: ProjectionProof | StatementProof;
};

export type Lp006ProjectionCaselet = Lp006Caselet & {
  projectionChildren: readonly Lp006ProjectionChild[];
};

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function personForSubject(caselet: Lp006Caselet, subject: SynthSubject): SynthPerson {
  return caselet.people.find((person) => caselet.assignment.subjectByPerson[person] === subject)!;
}

function personForCity(caselet: Lp006Caselet, city: SynthCity): SynthPerson {
  return caselet.people.find((person) => caselet.assignment.cityByPerson[person] === city)!;
}

function personForDay(caselet: Lp006Caselet, day: SynthDay): SynthPerson {
  return caselet.people.find((person) => caselet.assignment.dayByPerson[person] === day)!;
}

function personForSource(caselet: Lp006Caselet, dimension: NonPersonDimension, person: SynthPerson): SynthPerson {
  if (dimension === "SUBJECT") return personForSubject(caselet, caselet.assignment.subjectByPerson[person]);
  if (dimension === "CITY") return personForCity(caselet, caselet.assignment.cityByPerson[person]);
  return personForDay(caselet, caselet.assignment.dayByPerson[person]);
}

function valueFor(caselet: Lp006Caselet, dimension: ProjectionDimension, person: SynthPerson): string {
  if (dimension === "PERSON") return caselet.labels.people[person];
  if (dimension === "DAY") return caselet.assignment.dayByPerson[person];
  if (dimension === "SUBJECT") return caselet.labels.subjects[caselet.assignment.subjectByPerson[person]];
  return caselet.labels.cities[caselet.assignment.cityByPerson[person]];
}

function domainFor(caselet: Lp006Caselet, dimension: ProjectionDimension): string[] {
  if (dimension === "PERSON") return caselet.people.map((person) => caselet.labels.people[person]);
  if (dimension === "DAY") return [...caselet.days];
  if (dimension === "SUBJECT") return caselet.subjects.map((subject) => caselet.labels.subjects[subject]);
  return caselet.cities.map((city) => caselet.labels.cities[city]);
}

function sourceValueFor(caselet: Lp006Caselet, dimension: NonPersonDimension, person: SynthPerson): string {
  return valueFor(caselet, dimension, person);
}

function projectionStem(caselet: Lp006Caselet, source: NonPersonDimension, target: ProjectionDimension, person: SynthPerson): string {
  const sourceValue = sourceValueFor(caselet, source, person);
  if (source === "SUBJECT" && target === "CITY") return `The person assigned to ${sourceValue} is scheduled in which city?`;
  if (source === "SUBJECT" && target === "PERSON") return `Who is assigned to ${sourceValue}?`;
  if (source === "SUBJECT" && target === "DAY") return `On which day is the person assigned to ${sourceValue} scheduled?`;
  if (source === "CITY" && target === "SUBJECT") return `Which study area is assigned to the person scheduled in ${sourceValue}?`;
  if (source === "CITY" && target === "PERSON") return `Who is scheduled in ${sourceValue}?`;
  if (source === "CITY" && target === "DAY") return `On which day is the person scheduled in ${sourceValue}?`;
  if (source === "DAY" && target === "SUBJECT") return `Which study area is assigned to the person scheduled on ${sourceValue}?`;
  if (source === "DAY" && target === "PERSON") return `Who is scheduled on ${sourceValue}?`;
  return `The person scheduled on ${sourceValue} is assigned to which city?`;
}

function placeAnswer(options: readonly string[], answer: string, desiredIndex: number): string[] {
  const result = [...options];
  const currentIndex = result.indexOf(answer);
  if (currentIndex < 0) throw new Error(`Answer '${answer}' is not present in option domain.`);
  [result[currentIndex], result[desiredIndex]] = [result[desiredIndex]!, result[currentIndex]!];
  return result;
}

function baseStem(caselet: Lp006Caselet): string {
  return `${caselet.questionSetup}\n\nClues:\n${caselet.clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n`;
}

function explanationEvidence(caselet: Lp006Caselet): string[] {
  const lines = [...(caselet.children[0]?.explanation.lines ?? [])];
  return lines.length > 1 ? lines.slice(0, -1) : lines;
}

function makeProjectionChild(caselet: Lp006Caselet, index: number): Lp006ProjectionChild {
  const person = caselet.people[(index + 2) % caselet.people.length]!;
  const pair = PROJECTION_PAIRS[(hashSeed(`${caselet.caseletId}:projection`) + index) % PROJECTION_PAIRS.length]!;
  const [sourceDimension, targetDimension] = pair;
  const resolvedPerson = personForSource(caselet, sourceDimension, person);
  const sourceValue = sourceValueFor(caselet, sourceDimension, resolvedPerson);
  const targetValue = valueFor(caselet, targetDimension, resolvedPerson);
  const options = placeAnswer(domainFor(caselet, targetDimension), targetValue, index % 4);
  const question = projectionStem(caselet, sourceDimension, targetDimension, resolvedPerson);
  const lines = [
    ...explanationEvidence(caselet),
    `**Answer the question**\n\nIn the completed table, **${sourceValue}** and **${targetValue}** are in the same row. Therefore the answer is **${targetValue}**.`,
  ];
  return {
    questionId: `${caselet.caseletId}-P1`,
    qlId: "LP-QL-041",
    stem: `${baseStem(caselet)}${question}`,
    options,
    correctIndex: options.indexOf(targetValue),
    answer: targetValue,
    difficultyBand: caselet.difficultyBand,
    misconceptionFamily: "CROSS_COLUMN_ROW_MIXUP",
    explanation: { summary: `Read the completed row containing ${sourceValue}.`, lines },
    proof: { sourceDimension, targetDimension, sourcePerson: resolvedPerson, sourceValue, targetValue },
  };
}

const STATEMENT_KINDS = ["PERSON_DAY", "PERSON_SUBJECT", "PERSON_CITY", "SUBJECT_CITY", "SUBJECT_DAY", "CITY_DAY"] as const;
type StatementKind = (typeof STATEMENT_KINDS)[number];

function trueStatement(caselet: Lp006Caselet, kind: StatementKind, person: SynthPerson): Statement {
  if (kind === "PERSON_DAY") return { kind, person, day: caselet.assignment.dayByPerson[person] };
  if (kind === "PERSON_SUBJECT") return { kind, person, subject: caselet.assignment.subjectByPerson[person] };
  if (kind === "PERSON_CITY") return { kind, person, city: caselet.assignment.cityByPerson[person] };
  if (kind === "SUBJECT_CITY") return { kind, subject: caselet.assignment.subjectByPerson[person], city: caselet.assignment.cityByPerson[person] };
  if (kind === "SUBJECT_DAY") return { kind, subject: caselet.assignment.subjectByPerson[person], day: caselet.assignment.dayByPerson[person] };
  return { kind, city: caselet.assignment.cityByPerson[person], day: caselet.assignment.dayByPerson[person] };
}

function falseStatement(caselet: Lp006Caselet, kind: StatementKind, person: SynthPerson): Statement {
  const other = caselet.people.find((candidate) => candidate !== person)!;
  if (kind === "PERSON_DAY") return { kind, person, day: caselet.assignment.dayByPerson[other] };
  if (kind === "PERSON_SUBJECT") return { kind, person, subject: caselet.assignment.subjectByPerson[other] };
  if (kind === "PERSON_CITY") return { kind, person, city: caselet.assignment.cityByPerson[other] };
  if (kind === "SUBJECT_CITY") return { kind, subject: caselet.assignment.subjectByPerson[person], city: caselet.assignment.cityByPerson[other] };
  if (kind === "SUBJECT_DAY") return { kind, subject: caselet.assignment.subjectByPerson[person], day: caselet.assignment.dayByPerson[other] };
  return { kind, city: caselet.assignment.cityByPerson[person], day: caselet.assignment.dayByPerson[other] };
}

function statementIsTrue(caselet: Lp006Caselet, statement: Statement): boolean {
  if (statement.kind === "PERSON_DAY") return caselet.assignment.dayByPerson[statement.person] === statement.day;
  if (statement.kind === "PERSON_SUBJECT") return caselet.assignment.subjectByPerson[statement.person] === statement.subject;
  if (statement.kind === "PERSON_CITY") return caselet.assignment.cityByPerson[statement.person] === statement.city;
  if (statement.kind === "SUBJECT_CITY") return caselet.assignment.cityByPerson[personForSubject(caselet, statement.subject)] === statement.city;
  if (statement.kind === "SUBJECT_DAY") return caselet.assignment.dayByPerson[personForSubject(caselet, statement.subject)] === statement.day;
  return caselet.assignment.dayByPerson[personForCity(caselet, statement.city)] === statement.day;
}

function renderStatement(caselet: Lp006Caselet, statement: Statement): string {
  if (statement.kind === "PERSON_DAY") return `${caselet.labels.people[statement.person]} is scheduled on ${statement.day}.`;
  if (statement.kind === "PERSON_SUBJECT") return `${caselet.labels.people[statement.person]} is assigned to ${caselet.labels.subjects[statement.subject]}.`;
  if (statement.kind === "PERSON_CITY") return `${caselet.labels.people[statement.person]} is scheduled in ${caselet.labels.cities[statement.city]}.`;
  if (statement.kind === "SUBJECT_CITY") return `The person assigned to ${caselet.labels.subjects[statement.subject]} is scheduled in ${caselet.labels.cities[statement.city]}.`;
  if (statement.kind === "SUBJECT_DAY") return `The person assigned to ${caselet.labels.subjects[statement.subject]} is scheduled on ${statement.day}.`;
  return `The person scheduled in ${caselet.labels.cities[statement.city]} is scheduled on ${statement.day}.`;
}

function makeStatementChild(caselet: Lp006Caselet, index: number): Lp006ProjectionChild {
  const polarity: "CORRECT" | "INCORRECT" = index % 2 === 0 ? "CORRECT" : "INCORRECT";
  const desiredIndex = (index + 1) % 4;
  const startKind = (hashSeed(`${caselet.caseletId}:statement`) + index) % STATEMENT_KINDS.length;
  const statements: Statement[] = [];
  for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
    const kind = STATEMENT_KINDS[(startKind + optionIndex) % STATEMENT_KINDS.length]!;
    const person = caselet.people[(index + optionIndex) % caselet.people.length]!;
    const shouldBeTarget = optionIndex === desiredIndex;
    const shouldBeTrue = polarity === "CORRECT" ? shouldBeTarget : !shouldBeTarget;
    statements.push(shouldBeTrue ? trueStatement(caselet, kind, person) : falseStatement(caselet, kind, person));
  }
  const options = statements.map((statement) => renderStatement(caselet, statement));
  const truthByOption = statements.map((statement) => statementIsTrue(caselet, statement));
  const semanticMatches = truthByOption.map((truth) => polarity === "CORRECT" ? truth : !truth);
  const correctIndexes = semanticMatches.flatMap((matches, optionIndex) => matches ? [optionIndex] : []);
  if (correctIndexes.length !== 1) throw new Error(`${caselet.caseletId} statement projection does not have exactly one semantic answer.`);
  if (new Set(options).size !== 4) throw new Error(`${caselet.caseletId} statement projection contains duplicate options.`);
  const correctIndex = correctIndexes[0]!;
  const answer = options[correctIndex]!;
  const stem = polarity === "CORRECT"
    ? "Which of the following statements is correct?"
    : "Which of the following statements is not correct?";
  const lines = [
    ...explanationEvidence(caselet),
    `**Answer the question**\n\nFrom the completed table, the required statement is **${answer}**`,
  ];
  return {
    questionId: `${caselet.caseletId}-P2`,
    qlId: "LP-QL-042",
    stem: `${baseStem(caselet)}${stem}`,
    options,
    correctIndex,
    answer,
    difficultyBand: caselet.difficultyBand,
    misconceptionFamily: "CROSS_ROW_STATEMENT_TRUTH",
    explanation: { summary: `Use the completed table to identify the uniquely ${polarity === "CORRECT" ? "correct" : "incorrect"} statement.`, lines },
    proof: { polarity, truthByOption },
  };
}

export function generateLp006ProjectionBatchV1(seed = "lp-006-projection-v1", count = 8): Lp006ProjectionCaselet[] {
  return generateLp006BatchStabilizedV4_2(seed, count).map((caselet, index) => ({
    ...caselet,
    projectionChildren: [makeProjectionChild(caselet, index), makeStatementChild(caselet, index)],
  }));
}
