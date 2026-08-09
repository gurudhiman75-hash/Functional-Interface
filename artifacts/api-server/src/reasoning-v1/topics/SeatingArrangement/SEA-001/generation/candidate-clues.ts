import { constraintFingerprint } from "../constraints/evaluate.ts";
import { LinearTopology } from "../topology/linear.ts";
import type { CandidateClue, LinearConstraint, LinearSeatingState, PersonId } from "../types.ts";

function candidate(constraint: LinearConstraint, family: string, directness: number, informationGain: number): CandidateClue {
  const entities: PersonId[] = (() => {
    switch (constraint.kind) {
      case "ABSOLUTE_SEAT":
      case "AT_END":
      case "AT_MIDDLE":
        return [constraint.personId];
      case "RELATIVE_POSITION":
        return [constraint.subjectId, constraint.referenceId];
      case "ADJACENT":
      case "NOT_ADJACENT":
      case "EXACT_COUNT_BETWEEN":
        return [constraint.firstId, constraint.secondId];
    }
  })();
  return {
    id: constraint.id,
    constraint,
    languageFamilyId: family,
    semanticFingerprint: constraintFingerprint(constraint),
    entitiesMentioned: entities,
    directnessScore: directness,
    informationGain,
    naturalnessScore: 1,
    translationRisk: "LOW",
    explanationValue: Math.max(1, 5 - directness),
  };
}

export function enumerateTrueCandidateClues(state: LinearSeatingState): readonly CandidateClue[] {
  const topology = new LinearTopology(state.seats.length);
  const seatOf = new Map(state.assignments.map((assignment) => [assignment.personId, topology.indexOf(assignment.seatId)] as const));
  const facing = state.assignments[0]?.facing;
  if (!facing) throw new Error("Hidden state has no assignments");
  const output: CandidateClue[] = [];
  let serial = 1;
  const nextId = (): string => `SEA-CL-${String(serial++).padStart(3, "0")}`;

  for (const person of state.persons) {
    const seat = seatOf.get(person.id);
    if (seat === undefined) throw new Error(`Missing seat for ${person.id}`);
    output.push(candidate({ id: nextId(), kind: "ABSOLUTE_SEAT", personId: person.id, seatIndex: seat }, "SEA-CL-ABS", 5, 5));
    if (seat === 0 || seat === topology.seatCount - 1) {
      output.push(candidate({ id: nextId(), kind: "AT_END", personId: person.id }, "SEA-CL-ABS", 3, 3));
    }
    if (topology.isMiddle(topology.seatId(seat))) {
      output.push(candidate({ id: nextId(), kind: "AT_MIDDLE", personId: person.id }, "SEA-CL-ABS", 3, 3));
    }
  }

  for (let leftIndex = 0; leftIndex < state.persons.length; leftIndex += 1) {
    const first = state.persons[leftIndex];
    if (!first) continue;
    const firstSeat = seatOf.get(first.id);
    if (firstSeat === undefined) continue;
    for (let rightIndex = leftIndex + 1; rightIndex < state.persons.length; rightIndex += 1) {
      const second = state.persons[rightIndex];
      if (!second) continue;
      const secondSeat = seatOf.get(second.id);
      if (secondSeat === undefined) continue;
      const distance = Math.abs(firstSeat - secondSeat);
      const count = distance - 1;
      output.push(candidate({ id: nextId(), kind: "EXACT_COUNT_BETWEEN", firstId: first.id, secondId: second.id, count }, "SEA-CL-BET", 2, Math.min(4, distance + 1)));
      output.push(candidate({ id: nextId(), kind: distance === 1 ? "ADJACENT" : "NOT_ADJACENT", firstId: first.id, secondId: second.id }, "SEA-CL-ADJ", 1, distance === 1 ? 2 : 1));

      if (distance <= 3) {
        const subject = firstSeat > secondSeat ? first : second;
        const reference = firstSeat > secondSeat ? second : first;
        const visualDirection = "RIGHT" as const;
        const direction = facing === "NORTH" ? visualDirection : "LEFT" as const;
        output.push(candidate({
          id: nextId(),
          kind: "RELATIVE_POSITION",
          subjectId: subject.id,
          referenceId: reference.id,
          direction,
          steps: distance,
        }, "SEA-CL-REL", 1, Math.min(5, distance + 2)));
      }
    }
  }

  const unique = new Map<string, CandidateClue>();
  for (const clue of output) unique.set(clue.semanticFingerprint, clue);
  return [...unique.values()];
}
