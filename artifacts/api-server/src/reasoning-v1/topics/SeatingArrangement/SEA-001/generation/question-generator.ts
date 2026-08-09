import { LinearTopology } from "../topology/linear.ts";
import type { LinearSeatingState, SeatingChildQuestion, SeatingPerson } from "../types.ts";
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
  ];
}
