import { canonicalDigest } from "../canonical.ts";
import { LinearTopology } from "../topology/linear.ts";
import type {
  LinearSeatingState,
  SeatingChildQuestion,
  SeatingMisconceptionId,
  SeatingOption,
  SeatingPerson,
  SeatingSemanticValue,
} from "../types.ts";
import { buildCountOptions, buildPersonOptions } from "./option-generator.ts";

function nameOf(personId: string, persons: readonly SeatingPerson[]): string {
  const person = persons.find((candidate) => candidate.id === personId);
  if (!person) throw new Error(`Unknown person ${personId}`);
  return person.displayName;
}

function occupantByIndex(state: LinearSeatingState): string[] {
  const topology = new LinearTopology(state.seats.length);
  const result = Array<string>(state.seats.length);
  for (const assignment of state.assignments) result[topology.indexOf(assignment.seatId)] = assignment.personId;
  if (result.some((personId) => !personId)) throw new Error("Hidden state contains an unoccupied seat");
  return result;
}

function stableNumber(value: string): number {
  let hash = 0x811c9dc5;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 0x01000193);
  return hash >>> 0;
}

function semanticDisplay(value: SeatingSemanticValue, persons: readonly SeatingPerson[]): string {
  if (Array.isArray(value)) return value.map((personId) => nameOf(String(personId), persons)).join(" and ");
  return String(value);
}

function buildSemanticOptions(input: {
  readonly seed: string;
  readonly questionOrder: number;
  readonly correct: SeatingSemanticValue;
  readonly persons: readonly SeatingPerson[];
  readonly traps: readonly {
    readonly value: SeatingSemanticValue;
    readonly misconceptionId: SeatingMisconceptionId;
    readonly recomputation: Readonly<Record<string, unknown>>;
    readonly explanation: string;
    readonly display?: string;
  }[];
  readonly correctDisplay?: string;
}): Pick<SeatingChildQuestion, "options" | "answerIndex"> {
  const correctFingerprint = canonicalDigest(input.correct);
  const seen = new Set([correctFingerprint]);
  const wrong: SeatingOption[] = [];
  for (const trap of input.traps) {
    const fingerprint = canonicalDigest(trap.value);
    if (seen.has(fingerprint)) continue;
    seen.add(fingerprint);
    wrong.push({
      semanticValue: trap.value,
      semanticFingerprint: fingerprint,
      display: trap.display ?? semanticDisplay(trap.value, input.persons),
      isCorrect: false,
      misconceptionId: trap.misconceptionId,
      recomputation: trap.recomputation,
      explanation: trap.explanation,
    });
  }
  if (wrong.length !== 3) throw new Error("CP-001 semantic option builder requires three unique traps");
  const answerIndex = (stableNumber(`${input.seed}|${input.questionOrder}`) % 4) as 0 | 1 | 2 | 3;
  const options: SeatingOption[] = [...wrong];
  options.splice(answerIndex, 0, {
    semanticValue: input.correct,
    semanticFingerprint: correctFingerprint,
    display: input.correctDisplay ?? semanticDisplay(input.correct, input.persons),
    isCorrect: true,
    recomputation: { method: "DIRECT_VERIFIED_HIDDEN_STATE_PROJECTION" },
    explanation: "This matches the uniquely solved row.",
  });
  return { options: options as unknown as SeatingChildQuestion["options"], answerIndex };
}

function fourthQuestion(
  state: LinearSeatingState,
  seatOrder: readonly string[],
  facing: "NORTH" | "SOUTH",
  seed: string,
): SeatingChildQuestion {
  const selector = stableNumber(`${seed}:cp001:q4`) % 3;
  const leftEnd = seatOrder[0] as string;
  const rightEnd = seatOrder[seatOrder.length - 1] as string;

  if (selector === 0) {
    const answer = [leftEnd, rightEnd].sort();
    const traps = [
      [leftEnd, seatOrder[seatOrder.length - 2] as string].sort(),
      [seatOrder[1] as string, rightEnd].sort(),
      [seatOrder[1] as string, seatOrder[seatOrder.length - 2] as string].sort(),
    ];
    return {
      questionOrder: 4,
      queryContractId: "SEA-QC-014",
      answerType: "PAIR",
      answerDeterminingFactFingerprint: "PAIR:ROW_ENDS",
      text: "Which pair occupies the two ends of the row?",
      ...buildSemanticOptions({
        seed,
        questionOrder: 4,
        correct: answer,
        persons: state.persons,
        traps: [
          { value: traps[0] as readonly string[], misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT", recomputation: { movedRightEndInward: 1 }, explanation: "This moves one seat inward from the right end." },
          { value: traps[1] as readonly string[], misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT", recomputation: { movedLeftEndInward: 1 }, explanation: "This moves one seat inward from the left end." },
          { value: traps[2] as readonly string[], misconceptionId: "SEA-MC-LIN-MIRROR_POSITION", recomputation: { selectedNearEnds: true }, explanation: "This selects the two near-end seats rather than the actual ends." },
        ],
      }),
      answer,
      explanation: `${nameOf(leftEnd, state.persons)} is at the left end and ${nameOf(rightEnd, state.persons)} is at the right end, so they form the required pair.`,
    };
  }

  if (selector === 1) {
    const referenceIndex = 1;
    const subjectIndex = 3;
    const reference = seatOrder[referenceIndex] as string;
    const subject = seatOrder[subjectIndex] as string;
    const physicalRight = subjectIndex > referenceIndex;
    const personRight = facing === "NORTH" ? physicalRight : !physicalRight;
    const answer = personRight ? "SECOND_RIGHT" : "SECOND_LEFT";
    const answerDisplay = personRight ? "Second to the right" : "Second to the left";
    const opposite = personRight ? "SECOND_LEFT" : "SECOND_RIGHT";
    const oppositeDisplay = personRight ? "Second to the left" : "Second to the right";
    const immediate = personRight ? "IMMEDIATE_RIGHT" : "IMMEDIATE_LEFT";
    const immediateDisplay = personRight ? "Immediately to the right" : "Immediately to the left";
    const third = personRight ? "THIRD_RIGHT" : "THIRD_LEFT";
    const thirdDisplay = personRight ? "Third to the right" : "Third to the left";
    return {
      questionOrder: 4,
      queryContractId: "SEA-QC-015",
      answerType: "RELATION",
      answerDeterminingFactFingerprint: `RELATION:${subject}:WRT:${reference}`,
      text: `What is the position of ${nameOf(subject, state.persons)} with respect to ${nameOf(reference, state.persons)}?`,
      ...buildSemanticOptions({
        seed,
        questionOrder: 4,
        correct: answer,
        correctDisplay: answerDisplay,
        persons: state.persons,
        traps: [
          { value: opposite, display: oppositeDisplay, misconceptionId: "SEA-MC-LIN-LEFT_RIGHT_REVERSAL", recomputation: { reversedDirection: true }, explanation: "This reverses left and right for the reference person's facing." },
          { value: immediate, display: immediateDisplay, misconceptionId: "SEA-MC-LIN-IMMEDIATE_VS_KTH", recomputation: { usedSteps: 1 }, explanation: "This treats a two-seat relation as an immediate relation." },
          { value: third, display: thirdDisplay, misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT", recomputation: { usedSteps: 3 }, explanation: "This moves one seat farther than the actual relation." },
        ],
      }),
      answer,
      explanation: `${nameOf(reference, state.persons)} faces ${facing.toLowerCase()}. From that person's perspective, ${nameOf(subject, state.persons)} is ${answerDisplay.toLowerCase()}.`,
    };
  }

  const answer = seatOrder.slice(0, 3);
  const reversed = [...answer].reverse();
  const shifted = seatOrder.slice(1, 4);
  const swapped = [answer[0] as string, answer[2] as string, answer[1] as string];
  const displaySequence = (sequence: SeatingSemanticValue): string =>
    (sequence as readonly string[]).map((personId) => nameOf(personId, state.persons)).join(" → ");
  return {
    questionOrder: 4,
    queryContractId: "SEA-QC-020",
    answerType: "SEQUENCE",
    answerDeterminingFactFingerprint: "SEQUENCE:LEFT_TO_RIGHT:FIRST_THREE",
    text: "Which of the following shows the first three persons from the left end in the correct order?",
    ...buildSemanticOptions({
      seed,
      questionOrder: 4,
      correct: answer,
      correctDisplay: displaySequence(answer),
      persons: state.persons,
      traps: [
        { value: reversed, display: displaySequence(reversed), misconceptionId: "SEA-MC-LIN-MIRROR_POSITION", recomputation: { reversedSequence: true }, explanation: "This reads the same three seats in the reverse order." },
        { value: shifted, display: displaySequence(shifted), misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT", recomputation: { startSeat: 2 }, explanation: "This starts one seat after the left end." },
        { value: swapped, display: displaySequence(swapped), misconceptionId: "SEA-MC-LIN-SUBJECT_REFERENCE_SWAPPED", recomputation: { swappedSecondAndThird: true }, explanation: "This interchanges the second and third occupants." },
      ],
    }),
    answer,
    explanation: `Reading the solved row from the left end, the first three occupants are ${displaySequence(answer)}.`,
  };
}

export function generateCp001Questions(state: LinearSeatingState, seed: string): readonly SeatingChildQuestion[] {
  const topology = new LinearTopology(state.seats.length);
  const seatOrder = occupantByIndex(state);
  const facing = state.assignments[0]?.facing;
  if (!facing) throw new Error("No facing in hidden state");

  const endAnswer = seatOrder[0] as string;
  const endOptions = buildPersonOptions({
    correctPersonId: endAnswer,
    persons: state.persons,
    seed: `${seed}:q1`,
    wrongCandidates: [
      {
        personId: seatOrder[seatOrder.length - 1] ?? null,
        misconceptionId: "SEA-MC-LIN-MIRROR_POSITION",
        recomputation: { method: "MIRROR_POSITION", sourceSeat: 0, producedSeat: seatOrder.length - 1 },
        explanation: "This chooses the occupant at the mirrored right-end seat.",
      },
      {
        personId: seatOrder[1] ?? null,
        misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT",
        recomputation: { method: "MOVE_ONE_SEAT_RIGHT", sourceSeat: 0, producedSeat: 1 },
        explanation: "This chooses the occupant one seat away from the left end.",
      },
      {
        personId: seatOrder[2] ?? null,
        misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT",
        recomputation: { method: "MOVE_TWO_SEATS_RIGHT", sourceSeat: 0, producedSeat: 2 },
        explanation: "This moves away from the requested end before reading the occupant.",
      },
    ],
  });

  const referenceIndex = facing === "NORTH" ? 0 : seatOrder.length - 1;
  const referenceId = seatOrder[referenceIndex] as string;
  const targetSeatId = topology.moveRelative({
    seatId: topology.seatId(referenceIndex),
    facing,
    direction: "RIGHT",
    steps: 2,
  });
  if (!targetSeatId) throw new Error("Two-step query unexpectedly left the row");
  const targetIndex = topology.indexOf(targetSeatId);
  const relativeAnswer = seatOrder[targetIndex] as string;
  const reverseSeat = topology.moveRelative({ seatId: topology.seatId(referenceIndex), facing, direction: "LEFT", steps: 2 });
  const immediateSeat = topology.moveRelative({ seatId: topology.seatId(referenceIndex), facing, direction: "RIGHT", steps: 1 });
  const thirdSeat = topology.moveRelative({ seatId: topology.seatId(referenceIndex), facing, direction: "RIGHT", steps: 3 });
  const personAt = (seatId: string | null): string | null => seatId ? seatOrder[topology.indexOf(seatId)] ?? null : null;
  const relativeOptions = buildPersonOptions({
    correctPersonId: relativeAnswer,
    persons: state.persons,
    seed: `${seed}:q2`,
    wrongCandidates: [
      {
        personId: personAt(reverseSeat),
        misconceptionId: "SEA-MC-LIN-LEFT_RIGHT_REVERSAL",
        recomputation: { method: "REVERSE_DIRECTION", referenceId, steps: 2 },
        explanation: "This reverses the reference person's left and right.",
      },
      {
        personId: personAt(immediateSeat),
        misconceptionId: "SEA-MC-LIN-IMMEDIATE_VS_KTH",
        recomputation: { method: "USE_IMMEDIATE_INSTEAD_OF_SECOND", referenceId },
        explanation: "This stops at the immediate right instead of moving two seats.",
      },
      {
        personId: personAt(thirdSeat),
        misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT",
        recomputation: { method: "MOVE_THREE_INSTEAD_OF_TWO", referenceId },
        explanation: "This moves one seat too far from the reference person.",
      },
    ],
  });

  const firstBetweenIndex = 1;
  const secondBetweenIndex = seatOrder.length - 2;
  const firstBetween = seatOrder[firstBetweenIndex] as string;
  const secondBetween = seatOrder[secondBetweenIndex] as string;
  const betweenCount = topology.countBetween(topology.seatId(firstBetweenIndex), topology.seatId(secondBetweenIndex));
  const countOptions = buildCountOptions({ correctCount: betweenCount, seed: `${seed}:q3` });

  return [
    {
      questionOrder: 1,
      queryContractId: "SEA-QC-001",
      answerType: "PERSON",
      answerDeterminingFactFingerprint: "OCCUPANT:SEAT:0",
      text: "Who sits at the left end of the row?",
      options: endOptions.options,
      answerIndex: endOptions.answerIndex,
      answer: endAnswer,
      explanation: `${nameOf(endAnswer, state.persons)} is shown in seat 1, which is the left-end seat.`,
    },
    {
      questionOrder: 2,
      queryContractId: "SEA-QC-003",
      answerType: "PERSON",
      answerDeterminingFactFingerprint: `RELATIVE:${referenceId}:RIGHT:2`,
      text: `Who sits second to the right of ${nameOf(referenceId, state.persons)}?`,
      options: relativeOptions.options,
      answerIndex: relativeOptions.answerIndex,
      answer: relativeAnswer,
      explanation: `${nameOf(referenceId, state.persons)} faces ${facing.toLowerCase()}. Applying that person's right-direction rule and moving two seats reaches ${nameOf(relativeAnswer, state.persons)}.`,
    },
    {
      questionOrder: 3,
      queryContractId: "SEA-QC-008",
      answerType: "COUNT",
      answerDeterminingFactFingerprint: `BETWEEN:${[firstBetween, secondBetween].sort().join("~")}`,
      text: `How many persons sit between ${nameOf(firstBetween, state.persons)} and ${nameOf(secondBetween, state.persons)}?`,
      options: countOptions.options,
      answerIndex: countOptions.answerIndex,
      answer: betweenCount,
      explanation: `Count only the seats strictly between ${nameOf(firstBetween, state.persons)} and ${nameOf(secondBetween, state.persons)}. The count is ${betweenCount}.`,
    },
    fourthQuestion(state, seatOrder, facing, seed),
  ];
}
