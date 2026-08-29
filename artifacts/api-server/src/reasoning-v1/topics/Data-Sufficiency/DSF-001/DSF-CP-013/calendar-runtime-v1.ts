import { createHash } from "node:crypto";
import {
  DS_STANDARD_5_EN,
  SUFFICIENCY_CLASSES,
  evaluateFiniteDomainPair,
  optionForClass,
  type SufficiencyClass,
  type TwoStatementSufficiencyEvaluation,
} from "../foundation/index.ts";
import { WEEKDAY_ORDER, mod7, weekdayShift } from "../../../Calendar/CAL-001/foundation.ts";
import type { Weekday } from "../../../Calendar/CAL-001/types.ts";

export const DSF_CP013_CALENDAR_RUNTIME_VERSION = "DSF_CP013_CALENDAR_RUNTIME_V1" as const;
export const DSF_CP013_CALENDAR_SOLVE_MODES = [
  "DSF-SM-CAL-RESULT-WEEKDAY",
  "DSF-SM-CAL-START-WEEKDAY",
  "DSF-SM-CAL-SHIFT-REMAINDER",
] as const;

export type DsfCp013CalendarSolveMode = (typeof DSF_CP013_CALENDAR_SOLVE_MODES)[number];
type Difficulty = "Easy" | "Medium" | "Hard";
type ContextId =
  | "CALENDAR_NOTE"
  | "DELIVERY_SCHEDULE"
  | "TRAINING_PLAN"
  | "SHIFT_ROSTER"
  | "EVENT_PLANNER"
  | "JOURNAL_ENTRY";
type StatementFamily =
  | "START_EXACT"
  | "SHIFT_EXACT"
  | "END_EXACT"
  | "START_SHIFT_PAIR"
  | "END_SHIFT_PAIR"
  | "START_END_PAIR"
  | "START_TWO_SET"
  | "SHIFT_TWO_SET"
  | "END_TWO_SET";

type CalendarWorld = Readonly<{
  start: Weekday;
  shiftRemainder: Weekday;
  end: Weekday;
}>;

type CalendarContext = Readonly<{
  id: ContextId;
  intros: readonly string[];
}>;

type CalendarProblem = Readonly<{
  solveMode: DsfCp013CalendarSolveMode;
  anchor: CalendarWorld;
  context: CalendarContext;
  intro: string;
}>;

type CalendarStatement = Readonly<{
  id: string;
  family: StatementFamily;
  complexity: 1 | 2;
  text: string;
  test: (world: CalendarWorld) => boolean;
}>;

type Pair = Readonly<{
  statementI: CalendarStatement;
  statementII: CalendarStatement;
  evaluation: TwoStatementSufficiencyEvaluation<string>;
  quality: number;
}>;

const WEEKDAY_NAMES: Readonly<Record<Weekday, string>> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const CONTEXTS: readonly CalendarContext[] = [
  {
    id: "CALENDAR_NOTE",
    intros: [
      "A calendar note describes a forward movement from one weekday to another.",
      "Consider an unknown starting weekday and a forward day movement.",
      "A weekday is shifted forward by an unknown whole number of days.",
      "A simple calendar movement starts on one unknown weekday and ends on another.",
    ],
  },
  {
    id: "DELIVERY_SCHEDULE",
    intros: [
      "A delivery schedule moves forward from one weekday by a whole number of days.",
      "A delivery cycle begins on an unknown weekday and advances by several days.",
      "Consider a delivery date described only by its starting weekday and day shift.",
      "A delivery schedule advances from one weekday to a later weekday position in the weekly cycle.",
    ],
  },
  {
    id: "TRAINING_PLAN",
    intros: [
      "A training plan is moved forward from an unknown weekday by a whole number of days.",
      "A training cycle starts on one weekday and advances through the weekly cycle.",
      "Consider a training date obtained by shifting an unknown weekday forward.",
      "A training plan uses a starting weekday and a forward day count.",
    ],
  },
  {
    id: "SHIFT_ROSTER",
    intros: [
      "A roster entry is obtained by moving forward from an unknown weekday.",
      "A shift roster advances from one weekday by a whole number of days.",
      "Consider a roster day formed by a forward weekday shift.",
      "A roster calculation starts from an unknown weekday and moves forward in the weekly cycle.",
    ],
  },
  {
    id: "EVENT_PLANNER",
    intros: [
      "An event planner moves a weekday forward by an unknown number of days.",
      "An event date is described through a starting weekday and a forward shift.",
      "Consider an event scheduled by advancing from an unknown weekday.",
      "An event-planning calculation moves forward through the seven-day cycle.",
    ],
  },
  {
    id: "JOURNAL_ENTRY",
    intros: [
      "A journal entry refers to a weekday reached after moving forward by several days.",
      "A dated note starts from an unknown weekday and advances by a whole number of days.",
      "Consider a journal date defined by a starting weekday and a forward day shift.",
      "A journal calculation moves from one weekday to another through the weekly cycle.",
    ],
  },
];

function weekdayName(day: Weekday): string {
  return WEEKDAY_NAMES[day];
}

const CALENDAR_WORLDS: readonly CalendarWorld[] = Object.freeze(
  WEEKDAY_ORDER.flatMap((start) => WEEKDAY_ORDER.map((shiftRemainder) => Object.freeze({
    start,
    shiftRemainder,
    end: weekdayShift(start, shiftRemainder),
  }))),
);

if (CALENDAR_WORLDS.length !== 49) throw new Error(`CAL-001 modular weekday universe must contain 49 worlds; found ${CALENDAR_WORLDS.length}.`);
for (const world of CALENDAR_WORLDS) {
  if (weekdayShift(world.end, -world.shiftRemainder) !== world.start) {
    throw new Error("CAL-001 reverse weekday parity failed.");
  }
  if (mod7(world.end - world.start) !== world.shiftRemainder) {
    throw new Error("CAL-001 modulo-7 remainder parity failed.");
  }
}
export const DSF_CP013_CALENDAR_WORLD_COUNT = CALENDAR_WORLDS.length;

function sourceTargetAnswer(problem: CalendarProblem, world: CalendarWorld): string {
  switch (problem.solveMode) {
    case "DSF-SM-CAL-RESULT-WEEKDAY":
      return weekdayName(weekdayShift(world.start, world.shiftRemainder));
    case "DSF-SM-CAL-START-WEEKDAY":
      return weekdayName(weekdayShift(world.end, -world.shiftRemainder));
    case "DSF-SM-CAL-SHIFT-REMAINDER":
      return String(mod7(world.end - world.start));
  }
}

const adapter = {
  adapterId: "DSF-CP013-CAL-001-MOD7-SOURCE-BOUND-V1",
  domainFamily: "REASONING" as const,
  sourceChapterId: "CAL-001",
  enumerateBaseWorlds: (_problem: CalendarProblem) => CALENDAR_WORLDS,
  statementHolds: (_problem: CalendarProblem, world: CalendarWorld, statement: CalendarStatement) => statement.test(world),
  evaluateTarget: (problem: CalendarProblem, world: CalendarWorld) => sourceTargetAnswer(problem, world),
  normalizeAnswer: (answer: string) => answer,
};

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  for (const character of `${DSF_CP013_CALENDAR_RUNTIME_VERSION}:${seed}:${salt}`) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed: number, salt: string): () => number {
  let state = hashSeed(seed, salt) || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

function pick<T>(random: () => number, values: readonly T[]): T {
  if (!values.length) throw new Error("CP013 Calendar cannot pick from an empty set.");
  return values[Math.floor(random() * values.length)]!;
}

function modeForSeed(seed: number): DsfCp013CalendarSolveMode {
  return DSF_CP013_CALENDAR_SOLVE_MODES[Math.abs(seed) % DSF_CP013_CALENDAR_SOLVE_MODES.length]!;
}

function classForSeed(seed: number): SufficiencyClass {
  const block = Math.floor(Math.abs(seed) / DSF_CP013_CALENDAR_SOLVE_MODES.length);
  return SUFFICIENCY_CLASSES[block % SUFFICIENCY_CLASSES.length]!;
}

function statement(
  id: string,
  family: StatementFamily,
  complexity: 1 | 2,
  text: string,
  test: (world: CalendarWorld) => boolean,
): CalendarStatement {
  return { id, family, complexity, text, test };
}

function buildStatementPool(problem: CalendarProblem): readonly CalendarStatement[] {
  const { start, shiftRemainder, end } = problem.anchor;
  const nextStart = mod7(start + 1);
  const nextShift = mod7(shiftRemainder + 1);
  const nextEnd = mod7(end + 1);
  return [
    statement(`START_${start}`, "START_EXACT", 1, `The starting day is ${weekdayName(start)}.`, (world) => world.start === start),
    statement(`SHIFT_${shiftRemainder}`, "SHIFT_EXACT", 1, `The number of days leaves remainder ${shiftRemainder} when divided by 7.`, (world) => world.shiftRemainder === shiftRemainder),
    statement(`END_${end}`, "END_EXACT", 1, `The resulting day is ${weekdayName(end)}.`, (world) => world.end === end),
    statement(
      `START_SHIFT_${start}_${shiftRemainder}`,
      "START_SHIFT_PAIR",
      2,
      `The starting day is ${weekdayName(start)}, and the day count leaves remainder ${shiftRemainder} on division by 7.`,
      (world) => world.start === start && world.shiftRemainder === shiftRemainder,
    ),
    statement(
      `END_SHIFT_${end}_${shiftRemainder}`,
      "END_SHIFT_PAIR",
      2,
      `The resulting day is ${weekdayName(end)}, and the day count leaves remainder ${shiftRemainder} on division by 7.`,
      (world) => world.end === end && world.shiftRemainder === shiftRemainder,
    ),
    statement(
      `START_END_${start}_${end}`,
      "START_END_PAIR",
      2,
      `The movement starts on ${weekdayName(start)} and ends on ${weekdayName(end)}.`,
      (world) => world.start === start && world.end === end,
    ),
    statement(
      `START_TWO_${start}_${nextStart}`,
      "START_TWO_SET",
      2,
      `The starting day is either ${weekdayName(start)} or ${weekdayName(nextStart)}.`,
      (world) => world.start === start || world.start === nextStart,
    ),
    statement(
      `SHIFT_TWO_${shiftRemainder}_${nextShift}`,
      "SHIFT_TWO_SET",
      2,
      `The remainder on division of the day count by 7 is either ${shiftRemainder} or ${nextShift}.`,
      (world) => world.shiftRemainder === shiftRemainder || world.shiftRemainder === nextShift,
    ),
    statement(
      `END_TWO_${end}_${nextEnd}`,
      "END_TWO_SET",
      2,
      `The resulting day is either ${weekdayName(end)} or ${weekdayName(nextEnd)}.`,
      (world) => world.end === end || world.end === nextEnd,
    ),
  ];
}

function pairQuality(first: CalendarStatement, second: CalendarStatement, evaluation: TwoStatementSufficiencyEvaluation<string>): number {
  let score = first.family === second.family ? -5 : 5;
  if (evaluation.classification === "BOTH_TOGETHER_ONLY") score += 12;
  if (evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") score += 6;
  score += Math.min(8, Math.floor((evaluation.statementI.worldCount + evaluation.statementII.worldCount) / 7));
  return score - first.complexity - second.complexity;
}

function synthesizePair(problem: CalendarProblem, seed: number, desiredClass: SufficiencyClass): Pair {
  const statements = buildStatementPool(problem);
  const candidates: Pair[] = [];
  for (const statementI of statements) for (const statementII of statements) {
    if (statementI.id === statementII.id) continue;
    try {
      const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
      if (evaluation.classification === desiredClass) {
        candidates.push({ statementI, statementII, evaluation, quality: pairQuality(statementI, statementII, evaluation) });
      }
    } catch {
      // Reject an inconsistent conjunction.
    }
  }
  if (!candidates.length) throw new Error(`No CAL-001 DS pair for ${problem.solveMode}/${desiredClass}.`);
  const best = Math.max(...candidates.map((candidate) => candidate.quality));
  return pick(createRng(seed, `pair:${problem.solveMode}:${desiredClass}`), candidates.filter((candidate) => candidate.quality >= best - 2));
}

function targetPrompt(mode: DsfCp013CalendarSolveMode): string {
  switch (mode) {
    case "DSF-SM-CAL-RESULT-WEEKDAY": return "What is the resulting weekday?";
    case "DSF-SM-CAL-START-WEEKDAY": return "What was the starting weekday?";
    case "DSF-SM-CAL-SHIFT-REMAINDER": return "What remainder does the number of moved days leave when divided by 7?";
  }
}

function targetLabel(mode: DsfCp013CalendarSolveMode): string {
  switch (mode) {
    case "DSF-SM-CAL-RESULT-WEEKDAY": return "the resulting weekday";
    case "DSF-SM-CAL-START-WEEKDAY": return "the starting weekday";
    case "DSF-SM-CAL-SHIFT-REMAINDER": return "the remainder of the day count modulo 7";
  }
}

function difficultyFor(pair: Pair): Difficulty {
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  if (pair.evaluation.classification === "EACH_STATEMENT_ALONE") return "Easy";
  return "Medium";
}

function counterexampleText(answers: readonly string[]): string {
  if (answers.length >= 2) return `for example, ${answers[0]} and ${answers[1]} are both possible`;
  return "the target is not uniquely fixed";
}

function explanationFor(problem: CalendarProblem, pair: Pair): string {
  const evaluation = pair.evaluation;
  const line = (label: string, sufficient: boolean, answers: readonly string[], worldCount: number) => sufficient
    ? `${label} is sufficient: all ${worldCount} calendar states give ${answers[0]} for the target.`
    : `${label} is not sufficient: ${counterexampleText(answers)}.`;
  return [
    `We need ${targetLabel(problem.solveMode)}.`,
    line("Statement I", evaluation.statementI.sufficient, evaluation.statementI.normalizedTargetAnswers, evaluation.statementI.worldCount),
    line("Statement II", evaluation.statementII.sufficient, evaluation.statementII.normalizedTargetAnswers, evaluation.statementII.worldCount),
    line("Together", evaluation.together.sufficient, evaluation.together.normalizedTargetAnswers, evaluation.together.worldCount),
    `Hence the correct sufficiency class is ${evaluation.classification}.`,
  ].join(" ");
}

function normalizeSurface(text: string): string {
  return text.toLowerCase().replace(/\b\d+\b/g, "#").replace(/\s+/g, " ").trim();
}

export function normalizeDsfCp013CalendarSurface(text: string): string {
  return normalizeSurface(text);
}

function structuralFingerprint(problem: CalendarProblem, pair: Pair): string {
  return [
    problem.solveMode,
    pair.evaluation.classification,
    problem.context.id,
    pair.statementI.family,
    pair.statementII.family,
    problem.anchor.start,
    problem.anchor.shiftRemainder,
  ].join("|");
}

export function generateDsfCp013CalendarQuestion(seed: number) {
  const solveMode = modeForSeed(seed);
  const desiredClass = classForSeed(seed);
  const contextIndex = Math.floor(Math.abs(seed) / DSF_CP013_CALENDAR_SOLVE_MODES.length) % CONTEXTS.length;
  const context = CONTEXTS[contextIndex]!;
  const random = createRng(seed, `problem:${solveMode}:${context.id}`);
  const anchor = pick(random, CALENDAR_WORLDS);
  const intro = context.intros[Math.abs(seed * 5) % context.intros.length]!;
  const problem: CalendarProblem = { solveMode, anchor, context, intro };
  const pair = synthesizePair(problem, seed, desiredClass);
  const prompt = targetPrompt(solveMode);
  const premise = "Only the remainder after division of the forward day count by 7 affects the weekday.";
  const stem = `${intro} ${premise} ${prompt}\n\nStatement I: ${pair.statementI.text}\nStatement II: ${pair.statementII.text}`;
  const correct = optionForClass(DS_STANDARD_5_EN, pair.evaluation.classification);
  const generationIdentity = createHash("sha256")
    .update(`${DSF_CP013_CALENDAR_RUNTIME_VERSION}|${seed}|${solveMode}|${context.id}|${anchor.start}|${anchor.shiftRemainder}|${pair.statementI.id}|${pair.statementII.id}`)
    .digest("hex")
    .slice(0, 24);

  return Object.freeze({
    packageId: "DSF-001" as const,
    checkpointId: "DSF-CP-013" as const,
    qlId: "DSF-QL-001" as const,
    runtimeVersion: DSF_CP013_CALENDAR_RUNTIME_VERSION,
    seed,
    locale: "en-IN" as const,
    difficulty: difficultyFor(pair),
    domainFamily: "REASONING" as const,
    sourceChapterId: "CAL-001" as const,
    sourceWorldCount: CALENDAR_WORLDS.length,
    sourceCapabilities: [
      "CAL-001/foundation::weekdayShift",
      "CAL-001/foundation::mod7",
      "CAL-001/runtime-cp001::shiftProblem semantic family",
    ] as const,
    solveModeId: solveMode,
    targetKind: solveMode === "DSF-SM-CAL-RESULT-WEEKDAY"
      ? "RESULT_WEEKDAY" as const
      : solveMode === "DSF-SM-CAL-START-WEEKDAY"
        ? "START_WEEKDAY" as const
        : "SHIFT_MOD7_REMAINDER" as const,
    contextId: context.id,
    answerContractId: "DS_STANDARD_5" as const,
    taskDirection: "DATA_SUFFICIENCY" as const,
    answerSemantic: "SUFFICIENCY_CLASS" as const,
    stem,
    questionPrompt: prompt,
    statements: [
      { id: "I" as const, statementRuleId: pair.statementI.id, statementFamily: pair.statementI.family, text: pair.statementI.text },
      { id: "II" as const, statementRuleId: pair.statementII.id, statementFamily: pair.statementII.family, text: pair.statementII.text },
    ] as const,
    options: DS_STANDARD_5_EN.options.map((option) => ({
      key: option.key,
      value: option.text,
      semanticClass: option.semanticClass,
      isCorrect: option.semanticClass === pair.evaluation.classification,
    })),
    correctIndex: DS_STANDARD_5_EN.options.findIndex((option) => option.semanticClass === pair.evaluation.classification),
    canonicalAnswer: pair.evaluation.classification,
    explanation: explanationFor(problem, pair),
    proof: {
      baseWorldCount: CALENDAR_WORLDS.length,
      statementIWorldCount: pair.evaluation.statementI.worldCount,
      statementIIWorldCount: pair.evaluation.statementII.worldCount,
      togetherWorldCount: pair.evaluation.together.worldCount,
      statementITargetAnswers: pair.evaluation.statementI.normalizedTargetAnswers,
      statementIITargetAnswers: pair.evaluation.statementII.normalizedTargetAnswers,
      togetherTargetAnswers: pair.evaluation.together.normalizedTargetAnswers,
      minimalSufficientSets: pair.evaluation.minimalSufficientSets,
    },
    sourceAncestry: ["CAL-001", "foundation", "weekdayShift", "mod7"] as const,
    sourceAnswer: sourceTargetAnswer(problem, anchor),
    correctOptionText: correct.text,
    generationIdentity,
    studentSurfaceFingerprint: structuralFingerprint(problem, pair),
    lifecycle: {
      contentStatus: "CP013_REASONING_WAVE2_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
    },
  });
}

export function generateDsfCp013CalendarBatch(seeds: readonly number[]) {
  return seeds.map(generateDsfCp013CalendarQuestion);
}
