import { canonicalDigest } from "../canonical.ts";
import { LinearTopology } from "../topology/linear.ts";
import type {
  LinearSeatingState,
  SeatingChildQuestion,
  SeatingOption,
  SeatingSemanticValue,
} from "../types.ts";

function stableNumber(value: string): number {
  let hash = 0x811c9dc5;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 0x01000193);
  return hash >>> 0;
}

function seatOrder(state: LinearSeatingState): readonly string[] {
  const topology = new LinearTopology(state.seats.length);
  const order = Array<string>(state.seats.length);
  for (const assignment of state.assignments) {
    order[topology.indexOf(assignment.seatId)] = assignment.personId;
  }
  if (order.some((personId) => !personId)) {
    throw new Error("Incomplete CP-001 state while expanding exam query formats");
  }
  return order;
}

function nameOf(state: LinearSeatingState, personId: string): string {
  const person = state.persons.find((candidate) => candidate.id === personId);
  if (!person) throw new Error(`Unknown CP-001 person ${personId}`);
  return person.displayName;
}

function displaySemantic(state: LinearSeatingState, value: SeatingSemanticValue): string {
  if (Array.isArray(value)) {
    return value.map((item) => nameOf(state, String(item))).join(" and ");
  }
  if (typeof value === "string" && state.persons.some((person) => person.id === value)) {
    return nameOf(state, value);
  }
  return String(value);
}

type ExamTrap = {
  readonly value: SeatingSemanticValue;
  readonly display?: string;
  readonly recomputation: Readonly<Record<string, unknown>>;
  readonly explanation: string;
};

function buildOptions(input: {
  readonly state: LinearSeatingState;
  readonly seed: string;
  readonly answer: SeatingSemanticValue;
  readonly answerDisplay?: string;
  readonly traps: readonly ExamTrap[];
}): Pick<SeatingChildQuestion, "options" | "answerIndex"> {
  const correctFingerprint = canonicalDigest(input.answer);
  const seen = new Set([correctFingerprint]);
  const wrong: SeatingOption[] = [];

  for (const trap of input.traps) {
    const fingerprint = canonicalDigest(trap.value);
    if (seen.has(fingerprint)) continue;
    seen.add(fingerprint);
    wrong.push({
      semanticValue: trap.value,
      semanticFingerprint: fingerprint,
      display: trap.display ?? displaySemantic(input.state, trap.value),
      isCorrect: false,
      recomputation: trap.recomputation,
      explanation: trap.explanation,
    });
  }

  if (wrong.length !== 3) {
    throw new Error("CP-001 exam-format query requires three distinct distractors");
  }

  const answerIndex = (stableNumber(`${input.seed}:exam-format-answer-position`) % 4) as 0 | 1 | 2 | 3;
  const options: SeatingOption[] = [...wrong];
  options.splice(answerIndex, 0, {
    semanticValue: input.answer,
    semanticFingerprint: correctFingerprint,
    display: input.answerDisplay ?? displaySemantic(input.state, input.answer),
    isCorrect: true,
    recomputation: { method: "VERIFIED_LINEAR_RELATION_SET" },
    explanation: "This option matches the uniquely solved row and the relation asked in the question.",
  });

  return {
    options: options as unknown as SeatingChildQuestion["options"],
    answerIndex,
  };
}

function trueStatementQuestion(
  state: LinearSeatingState,
  seed: string,
): SeatingChildQuestion {
  const order = seatOrder(state);
  const first = order[0] as string;
  const second = order[1] as string;
  const third = order[2] as string;
  const fourth = order[3] as string;
  const last = order[order.length - 1] as string;

  const correctDisplay = `${nameOf(state, first)} sits adjacent to ${nameOf(state, second)}.`;
  return {
    questionOrder: 4,
    queryContractId: "SEA-QC-016",
    answerType: "RELATION",
    answerDeterminingFactFingerprint: `QC016:TRUE:ADJACENT:${[first, second].sort().join("~")}`,
    text: "Which of the following statements is true?",
    ...buildOptions({
      state,
      seed,
      answer: `TRUE_ADJACENT:${[first, second].sort().join("~")}`,
      answerDisplay: correctDisplay,
      traps: [
        {
          value: `FALSE_ADJACENT:${[first, third].sort().join("~")}`,
          display: `${nameOf(state, first)} sits adjacent to ${nameOf(state, third)}.`,
          recomputation: { relation: "ADJACENT", firstId: first, secondId: third, truth: false },
          explanation: `${nameOf(state, second)} sits between ${nameOf(state, first)} and ${nameOf(state, third)}, so they are not adjacent.`,
        },
        {
          value: `FALSE_ADJACENT:${[second, fourth].sort().join("~")}`,
          display: `${nameOf(state, second)} sits adjacent to ${nameOf(state, fourth)}.`,
          recomputation: { relation: "ADJACENT", firstId: second, secondId: fourth, truth: false },
          explanation: `${nameOf(state, third)} lies between these two persons, so the statement is false.`,
        },
        {
          value: `FALSE_ADJACENT:${[first, last].sort().join("~")}`,
          display: `${nameOf(state, first)} sits adjacent to ${nameOf(state, last)}.`,
          recomputation: { relation: "ADJACENT", firstId: first, secondId: last, truth: false },
          explanation: "The two extreme ends of a straight row are not adjacent to each other.",
        },
      ],
    }),
    answer: `TRUE_ADJACENT:${[first, second].sort().join("~")}`,
    explanation: `${nameOf(state, first)} and ${nameOf(state, second)} occupy consecutive seats in the solved row. Therefore that statement is true.`,
  };
}

function falseStatementQuestion(
  state: LinearSeatingState,
  seed: string,
): SeatingChildQuestion {
  const order = seatOrder(state);
  const first = order[0] as string;
  const second = order[1] as string;
  const third = order[2] as string;
  const penultimate = order[order.length - 2] as string;
  const last = order[order.length - 1] as string;

  const answer = `FALSE_ADJACENT:${[first, third].sort().join("~")}`;
  const answerDisplay = `${nameOf(state, first)} sits adjacent to ${nameOf(state, third)}.`;
  return {
    questionOrder: 4,
    queryContractId: "SEA-QC-017",
    answerType: "RELATION",
    answerDeterminingFactFingerprint: `QC017:FALSE:ADJACENT:${[first, third].sort().join("~")}`,
    text: "Which of the following statements is false?",
    ...buildOptions({
      state,
      seed,
      answer,
      answerDisplay,
      traps: [
        {
          value: `TRUE_ADJACENT:${[first, second].sort().join("~")}`,
          display: `${nameOf(state, first)} sits adjacent to ${nameOf(state, second)}.`,
          recomputation: { relation: "ADJACENT", firstId: first, secondId: second, truth: true },
          explanation: "This statement is true because the two persons occupy consecutive seats.",
        },
        {
          value: `TRUE_ADJACENT:${[second, third].sort().join("~")}`,
          display: `${nameOf(state, second)} sits adjacent to ${nameOf(state, third)}.`,
          recomputation: { relation: "ADJACENT", firstId: second, secondId: third, truth: true },
          explanation: "This statement is true because the two persons occupy consecutive seats.",
        },
        {
          value: `TRUE_ADJACENT:${[penultimate, last].sort().join("~")}`,
          display: `${nameOf(state, penultimate)} sits adjacent to ${nameOf(state, last)}.`,
          recomputation: { relation: "ADJACENT", firstId: penultimate, secondId: last, truth: true },
          explanation: "This statement is true because these two persons occupy the final two consecutive seats.",
        },
      ],
    }),
    answer,
    explanation: `${nameOf(state, second)} sits between ${nameOf(state, first)} and ${nameOf(state, third)}. Hence ${nameOf(state, first)} and ${nameOf(state, third)} are not adjacent, making that statement false.`,
  };
}

function oddRelationPairQuestion(
  state: LinearSeatingState,
  seed: string,
): SeatingChildQuestion {
  const order = seatOrder(state);
  const answer = [order[0] as string, order[2] as string].sort();
  const adjacentPairs = [
    [order[0] as string, order[1] as string].sort(),
    [order[1] as string, order[2] as string].sort(),
    [order[2] as string, order[3] as string].sort(),
  ];

  return {
    questionOrder: 4,
    queryContractId: "SEA-QC-019",
    answerType: "PAIR",
    answerDeterminingFactFingerprint: `QC019:ODD_NON_ADJACENT:${answer.join("~")}`,
    text: "Which of the following pairs is different from the other three with respect to their seating relation?",
    ...buildOptions({
      state,
      seed,
      answer,
      traps: adjacentPairs.map((pair) => ({
        value: pair,
        recomputation: { relation: "ADJACENT", pair },
        explanation: `${nameOf(state, pair[0] as string)} and ${nameOf(state, pair[1] as string)} occupy consecutive seats, matching the common relation shared by the other non-answer pairs.`,
      })),
    }),
    answer,
    explanation: `${nameOf(state, answer[0] as string)} and ${nameOf(state, answer[1] as string)} have exactly one person between them, whereas each of the other three pairs is adjacent. Therefore this pair is the odd one out.`,
  };
}

export function expandCp001ExamQueryFormats(
  state: LinearSeatingState,
  seed: string,
  children: readonly SeatingChildQuestion[],
): readonly SeatingChildQuestion[] {
  if (children.length !== 4) {
    throw new Error("CP-001 exam-format expansion expects a four-child passage");
  }

  const selector = stableNumber(`${seed}:cp001-exam-query-format`) % 10;
  if (selector > 2) return children;

  const replacement = selector === 0
    ? trueStatementQuestion(state, seed)
    : selector === 1
      ? falseStatementQuestion(state, seed)
      : oddRelationPairQuestion(state, seed);
  return [...children.slice(0, 3), replacement];
}
