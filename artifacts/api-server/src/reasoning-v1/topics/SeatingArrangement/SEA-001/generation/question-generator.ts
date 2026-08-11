import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import { LinearTopology } from "../topology/linear.ts";
import type {
  LinearSeatingState,
  SeatingAnswerType,
  SeatingChildQuestion,
  SeatingMisconceptionId,
  SeatingOption,
  SeatingPerson,
  SeatingQueryContractId,
  SeatingSemanticValue,
} from "../types.ts";
import { buildCountOptions, buildPersonOptions } from "./option-generator.ts";

export const SEA_CP001_ACCEPTED_QUERY_CONTRACTS: readonly SeatingQueryContractId[] = [
  "SEA-QC-001",
  "SEA-QC-003",
  "SEA-QC-008",
  "SEA-QC-014",
  "SEA-QC-015",
  "SEA-QC-020",
];

export const SEA_CP001_QUERY_SURFACE_IDS = [
  "SEA-CP001-QS-001-LEFT-END",
  "SEA-CP001-QS-002-RIGHT-END",
  "SEA-CP001-QS-003-MIDDLE",
  "SEA-CP001-QS-004-SECOND-LEFT",
  "SEA-CP001-QS-005-SECOND-RIGHT",
  "SEA-CP001-QS-006-COUNT-BETWEEN",
  "SEA-CP001-QS-007-END-PAIR",
  "SEA-CP001-QS-008-RELATIVE-PHRASE",
  "SEA-CP001-QS-009-LEFT-TO-RIGHT-SEQUENCE",
  "SEA-CP001-QS-010-RIGHT-TO-LEFT-SEQUENCE",
] as const;

type QuerySurfaceId = typeof SEA_CP001_QUERY_SURFACE_IDS[number];

type SurfaceCandidate = {
  readonly surfaceId: QuerySurfaceId;
  readonly contractId: SeatingQueryContractId;
  readonly build: (questionOrder: number) => SeatingChildQuestion;
};

type GenericTrap = {
  readonly value: SeatingSemanticValue;
  readonly misconceptionId: SeatingMisconceptionId;
  readonly recomputation: Readonly<Record<string, unknown>>;
  readonly explanation: string;
};

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

function semanticFingerprint(value: SeatingSemanticValue, answerType: SeatingAnswerType): string {
  if (!Array.isArray(value)) return `${typeof value}:${String(value)}`;
  const canonical = answerType === "PAIR" ? [...value].sort() : [...value];
  return `${answerType}:${canonical.join("|")}`;
}

function relationDisplay(value: string): string {
  const [direction, stepsText] = value.split(":");
  const steps = Number(stepsText);
  const ordinal = steps === 1 ? "Immediately" : steps === 2 ? "Second" : steps === 3 ? "Third" : `${steps}th`;
  return `${ordinal} to the ${direction?.toLowerCase()}`;
}

function displaySemantic(
  value: SeatingSemanticValue,
  answerType: SeatingAnswerType,
  persons: readonly SeatingPerson[],
): string {
  if (answerType === "RELATION") return relationDisplay(String(value));
  if (Array.isArray(value)) {
    const names = value.map((personId) => nameOf(personId, persons));
    return names.join(answerType === "SEQUENCE" ? " → " : " and ");
  }
  if (answerType === "PERSON") return nameOf(String(value), persons);
  return String(value);
}

function buildGenericOptions(input: {
  readonly answer: SeatingSemanticValue;
  readonly answerType: SeatingAnswerType;
  readonly persons: readonly SeatingPerson[];
  readonly traps: readonly GenericTrap[];
  readonly fallbackValues: readonly SeatingSemanticValue[];
  readonly seed: string;
}): { readonly options: [SeatingOption, SeatingOption, SeatingOption, SeatingOption]; readonly answerIndex: 0 | 1 | 2 | 3 } {
  const answerKey = semanticFingerprint(input.answer, input.answerType);
  const chosen = new Map<string, SeatingOption>();
  chosen.set(answerKey, {
    semanticValue: input.answer,
    semanticFingerprint: answerKey,
    display: displaySemantic(input.answer, input.answerType, input.persons),
    isCorrect: true,
    recomputation: { method: "GROUND_TRUTH" },
    explanation: "This matches the verified row arrangement.",
  });

  for (const trap of input.traps) {
    const key = semanticFingerprint(trap.value, input.answerType);
    if (key === answerKey || chosen.has(key)) continue;
    chosen.set(key, {
      semanticValue: trap.value,
      semanticFingerprint: key,
      display: displaySemantic(trap.value, input.answerType, input.persons),
      isCorrect: false,
      misconceptionId: trap.misconceptionId,
      recomputation: trap.recomputation,
      explanation: trap.explanation,
    });
    if (chosen.size === 4) break;
  }

  for (const value of input.fallbackValues) {
    if (chosen.size === 4) break;
    const key = semanticFingerprint(value, input.answerType);
    if (key === answerKey || chosen.has(key)) continue;
    chosen.set(key, {
      semanticValue: value,
      semanticFingerprint: key,
      display: displaySemantic(value, input.answerType, input.persons),
      isCorrect: false,
      misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT",
      recomputation: { method: "VERIFIED_ALTERNATIVE", value },
      explanation: "This is a valid-looking row value, but it does not satisfy the requested projection.",
    });
  }

  if (chosen.size !== 4) throw new Error(`Could not construct four ${input.answerType} options`);
  const shuffled = new DeterministicRandom(`${input.seed}:options`).shuffle([...chosen.values()]);
  const answerIndex = shuffled.findIndex((option) => option.isCorrect);
  if (answerIndex < 0 || answerIndex > 3) throw new Error("Correct generic option missing after shuffle");
  return {
    options: [
      shuffled[0] as SeatingOption,
      shuffled[1] as SeatingOption,
      shuffled[2] as SeatingOption,
      shuffled[3] as SeatingOption,
    ],
    answerIndex: answerIndex as 0 | 1 | 2 | 3,
  };
}

function surfaceFingerprint(surfaceId: QuerySurfaceId, fact: string): string {
  return `${surfaceId}|${fact}`;
}

export function cp001QuerySurfaceId(child: SeatingChildQuestion): QuerySurfaceId {
  const surface = child.answerDeterminingFactFingerprint.split("|")[0];
  if (!SEA_CP001_QUERY_SURFACE_IDS.includes(surface as QuerySurfaceId)) {
    throw new Error(`Unknown CP-001 query surface fingerprint: ${surface}`);
  }
  return surface as QuerySurfaceId;
}

export function generateCp001Questions(state: LinearSeatingState, seed: string): readonly SeatingChildQuestion[] {
  const topology = new LinearTopology(state.seats.length);
  const seatOrder = occupantByIndex(state);
  const facing = state.assignments[0]?.facing;
  if (!facing) throw new Error("No facing in hidden state");
  const rng = new DeterministicRandom(`${seed}:cp001-query-surfaces`);

  const personAtSeatId = (seatId: string | null): string | null =>
    seatId === null ? null : seatOrder[topology.indexOf(seatId)] ?? null;

  const endQuestion = (surfaceId: QuerySurfaceId, side: "LEFT" | "RIGHT", questionOrder: number): SeatingChildQuestion => {
    const seatIndex = side === "LEFT" ? 0 : seatOrder.length - 1;
    const answer = seatOrder[seatIndex] as string;
    const inwardIndex = side === "LEFT" ? 1 : seatOrder.length - 2;
    const twoInwardIndex = side === "LEFT" ? 2 : seatOrder.length - 3;
    const mirroredIndex = side === "LEFT" ? seatOrder.length - 1 : 0;
    const built = buildPersonOptions({
      correctPersonId: answer,
      persons: state.persons,
      seed: `${seed}:${surfaceId}:${questionOrder}`,
      wrongCandidates: [
        {
          personId: seatOrder[mirroredIndex] ?? null,
          misconceptionId: "SEA-MC-LIN-MIRROR_POSITION",
          recomputation: { method: "OPPOSITE_END", producedSeat: mirroredIndex },
          explanation: "This chooses the occupant at the opposite end of the row.",
        },
        {
          personId: seatOrder[inwardIndex] ?? null,
          misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT",
          recomputation: { method: "MOVE_ONE_SEAT_INWARD", producedSeat: inwardIndex },
          explanation: "This moves one seat inward before reading the occupant.",
        },
        {
          personId: seatOrder[twoInwardIndex] ?? null,
          misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT",
          recomputation: { method: "MOVE_TWO_SEATS_INWARD", producedSeat: twoInwardIndex },
          explanation: "This moves two seats away from the requested end.",
        },
      ],
    });
    return {
      questionOrder,
      queryContractId: "SEA-QC-001",
      answerType: "PERSON",
      answerDeterminingFactFingerprint: surfaceFingerprint(surfaceId, `OCCUPANT:SEAT:${seatIndex}`),
      text: `Who sits at the ${side.toLowerCase()} end of the row?`,
      options: built.options,
      answerIndex: built.answerIndex,
      answer,
      explanation: `${nameOf(answer, state.persons)} occupies the ${side.toLowerCase()}-end seat.`,
    };
  };

  const middleQuestion = (questionOrder: number): SeatingChildQuestion => {
    const surfaceId: QuerySurfaceId = "SEA-CP001-QS-003-MIDDLE";
    const middleIndex = seatOrder.length % 2 === 1 ? Math.floor(seatOrder.length / 2) : seatOrder.length / 2 - 1;
    const answer = seatOrder[middleIndex] as string;
    const wording = seatOrder.length % 2 === 1 ? "the middle seat" : "the left-middle seat";
    const built = buildPersonOptions({
      correctPersonId: answer,
      persons: state.persons,
      seed: `${seed}:${surfaceId}:${questionOrder}`,
      wrongCandidates: [
        {
          personId: seatOrder[middleIndex + 1] ?? null,
          misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT",
          recomputation: { method: "NEXT_CENTRAL_OR_RIGHT_SEAT", producedSeat: middleIndex + 1 },
          explanation: "This selects the next seat to the right of the requested central position.",
        },
        {
          personId: seatOrder[middleIndex - 1] ?? null,
          misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT",
          recomputation: { method: "PREVIOUS_SEAT", producedSeat: middleIndex - 1 },
          explanation: "This selects the seat immediately to the left of the requested central position.",
        },
        {
          personId: seatOrder[seatOrder.length - 1 - middleIndex] ?? null,
          misconceptionId: "SEA-MC-LIN-MIRROR_POSITION",
          recomputation: { method: "MIRROR_MIDDLE", producedSeat: seatOrder.length - 1 - middleIndex },
          explanation: "This uses the mirrored central position.",
        },
      ],
    });
    return {
      questionOrder,
      queryContractId: "SEA-QC-001",
      answerType: "PERSON",
      answerDeterminingFactFingerprint: surfaceFingerprint(surfaceId, `OCCUPANT:MIDDLE:${middleIndex}`),
      text: `Who sits in ${wording}?`,
      options: built.options,
      answerIndex: built.answerIndex,
      answer,
      explanation: `${nameOf(answer, state.persons)} occupies ${wording}.`,
    };
  };

  const relativePersonQuestion = (
    surfaceId: QuerySurfaceId,
    direction: "LEFT" | "RIGHT",
    questionOrder: number,
  ): SeatingChildQuestion => {
    const steps = 2;
    const candidates = seatOrder.filter((personId, index) =>
      topology.moveRelative({ seatId: topology.seatId(index), facing, direction, steps }) !== null);
    const referenceId = rng.pick(candidates);
    const referenceIndex = seatOrder.indexOf(referenceId);
    const targetSeat = topology.moveRelative({ seatId: topology.seatId(referenceIndex), facing, direction, steps });
    if (!targetSeat) throw new Error(`No ${direction.toLowerCase()} target for ${referenceId}`);
    const answer = seatOrder[topology.indexOf(targetSeat)] as string;
    const reverseDirection = direction === "LEFT" ? "RIGHT" : "LEFT";
    const reverseSeat = topology.moveRelative({ seatId: topology.seatId(referenceIndex), facing, direction: reverseDirection, steps });
    const oneSeat = topology.moveRelative({ seatId: topology.seatId(referenceIndex), facing, direction, steps: 1 });
    const threeSeat = topology.moveRelative({ seatId: topology.seatId(referenceIndex), facing, direction, steps: 3 });
    const built = buildPersonOptions({
      correctPersonId: answer,
      persons: state.persons,
      seed: `${seed}:${surfaceId}:${questionOrder}`,
      wrongCandidates: [
        {
          personId: personAtSeatId(reverseSeat),
          misconceptionId: "SEA-MC-LIN-LEFT_RIGHT_REVERSAL",
          recomputation: { method: "REVERSE_DIRECTION", referenceId, direction: reverseDirection, steps },
          explanation: "This reverses the reference person's left and right.",
        },
        {
          personId: personAtSeatId(oneSeat),
          misconceptionId: "SEA-MC-LIN-IMMEDIATE_VS_KTH",
          recomputation: { method: "USE_IMMEDIATE", referenceId, direction },
          explanation: "This stops at the immediate seat instead of the second seat.",
        },
        {
          personId: personAtSeatId(threeSeat),
          misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT",
          recomputation: { method: "MOVE_THREE", referenceId, direction },
          explanation: "This moves one seat too far.",
        },
      ],
    });
    return {
      questionOrder,
      queryContractId: "SEA-QC-003",
      answerType: "PERSON",
      answerDeterminingFactFingerprint: surfaceFingerprint(surfaceId, `RELATIVE:${referenceId}:${direction}:2:${facing}`),
      text: `Who sits second to the ${direction.toLowerCase()} of ${nameOf(referenceId, state.persons)}?`,
      options: built.options,
      answerIndex: built.answerIndex,
      answer,
      explanation: `${nameOf(referenceId, state.persons)} faces ${facing.toLowerCase()}. Applying that person's ${direction.toLowerCase()}-direction rule and moving two seats reaches ${nameOf(answer, state.persons)}.`,
    };
  };

  const countBetweenQuestion = (questionOrder: number): SeatingChildQuestion => {
    const surfaceId: QuerySurfaceId = "SEA-CP001-QS-006-COUNT-BETWEEN";
    const firstIndex = rng.integer(0, seatOrder.length - 3);
    const secondIndex = rng.integer(firstIndex + 2, seatOrder.length - 1);
    const first = seatOrder[firstIndex] as string;
    const second = seatOrder[secondIndex] as string;
    const answer = secondIndex - firstIndex - 1;
    const built = buildCountOptions({ correctCount: answer, seed: `${seed}:${surfaceId}:${questionOrder}` });
    return {
      questionOrder,
      queryContractId: "SEA-QC-008",
      answerType: "COUNT",
      answerDeterminingFactFingerprint: surfaceFingerprint(surfaceId, `BETWEEN:${[first, second].sort().join("~")}`),
      text: `How many persons sit between ${nameOf(first, state.persons)} and ${nameOf(second, state.persons)}?`,
      options: built.options,
      answerIndex: built.answerIndex,
      answer,
      explanation: `The two persons are ${secondIndex - firstIndex} seats apart, so ${answer} ${answer === 1 ? "person sits" : "persons sit"} strictly between them.`,
    };
  };

  const endPairQuestion = (questionOrder: number): SeatingChildQuestion => {
    const surfaceId: QuerySurfaceId = "SEA-CP001-QS-007-END-PAIR";
    const answer = [seatOrder[0] as string, seatOrder[seatOrder.length - 1] as string].sort();
    const fallbackPairs: SeatingSemanticValue[] = [];
    for (let first = 0; first < seatOrder.length; first += 1) {
      for (let second = first + 1; second < seatOrder.length; second += 1) {
        fallbackPairs.push([seatOrder[first] as string, seatOrder[second] as string].sort());
      }
    }
    const built = buildGenericOptions({
      answer,
      answerType: "PAIR",
      persons: state.persons,
      seed: `${seed}:${surfaceId}:${questionOrder}`,
      traps: [
        {
          value: [seatOrder[0] as string, seatOrder[1] as string].sort(),
          misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT",
          recomputation: { method: "LEFT_END_AND_NEIGHBOUR" },
          explanation: "This pairs the left-end occupant with the adjacent person instead of the other end.",
        },
        {
          value: [seatOrder[seatOrder.length - 2] as string, seatOrder[seatOrder.length - 1] as string].sort(),
          misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT",
          recomputation: { method: "RIGHT_END_AND_NEIGHBOUR" },
          explanation: "This pairs the right-end occupant with the adjacent person.",
        },
        {
          value: [seatOrder[1] as string, seatOrder[seatOrder.length - 2] as string].sort(),
          misconceptionId: "SEA-MC-LIN-MIRROR_POSITION",
          recomputation: { method: "INNER_MIRROR_PAIR" },
          explanation: "This selects the two seats immediately inside the ends.",
        },
      ],
      fallbackValues: fallbackPairs,
    });
    return {
      questionOrder,
      queryContractId: "SEA-QC-014",
      answerType: "PAIR",
      answerDeterminingFactFingerprint: surfaceFingerprint(surfaceId, "END_PAIR"),
      text: "Which pair occupies the two ends of the row?",
      options: built.options,
      answerIndex: built.answerIndex,
      answer,
      explanation: `${nameOf(answer[0] as string, state.persons)} and ${nameOf(answer[1] as string, state.persons)} occupy the two end seats.`,
    };
  };

  const relativePhraseQuestion = (questionOrder: number): SeatingChildQuestion => {
    const surfaceId: QuerySurfaceId = "SEA-CP001-QS-008-RELATIVE-PHRASE";
    const referenceCandidates = seatOrder.map((personId, index) => ({ personId, index })).filter(({ index }) => index <= seatOrder.length - 3);
    const referenceEntry = rng.pick(referenceCandidates);
    const physicalSubjectIndex = referenceEntry.index + 2;
    const subjectId = seatOrder[physicalSubjectIndex] as string;
    const physicalDirection = "RIGHT" as const;
    const direction = facing === "NORTH" ? physicalDirection : "LEFT" as const;
    const answer = `${direction}:2`;
    const oppositeDirection = direction === "LEFT" ? "RIGHT" : "LEFT";
    const built = buildGenericOptions({
      answer,
      answerType: "RELATION",
      persons: state.persons,
      seed: `${seed}:${surfaceId}:${questionOrder}`,
      traps: [
        {
          value: `${oppositeDirection}:2`,
          misconceptionId: "SEA-MC-LIN-LEFT_RIGHT_REVERSAL",
          recomputation: { method: "REVERSE_DIRECTION" },
          explanation: "This reverses left and right for the reference person's facing.",
        },
        {
          value: `${direction}:1`,
          misconceptionId: "SEA-MC-LIN-IMMEDIATE_VS_KTH",
          recomputation: { method: "USE_IMMEDIATE" },
          explanation: "This treats a two-seat relation as immediate.",
        },
        {
          value: `${oppositeDirection}:1`,
          misconceptionId: "SEA-MC-LIN-SUBJECT_REFERENCE_SWAPPED",
          recomputation: { method: "SWAP_SUBJECT_REFERENCE" },
          explanation: "This reverses both the reference direction and distance interpretation.",
        },
      ],
      fallbackValues: [`${direction}:3`, `${oppositeDirection}:3`],
    });
    return {
      questionOrder,
      queryContractId: "SEA-QC-015",
      answerType: "RELATION",
      answerDeterminingFactFingerprint: surfaceFingerprint(surfaceId, `RELATION:${subjectId}:WRT:${referenceEntry.personId}:${direction}:2:${facing}`),
      text: `What is the position of ${nameOf(subjectId, state.persons)} with respect to ${nameOf(referenceEntry.personId, state.persons)}?`,
      options: built.options,
      answerIndex: built.answerIndex,
      answer,
      explanation: `${nameOf(referenceEntry.personId, state.persons)} faces ${facing.toLowerCase()}. ${nameOf(subjectId, state.persons)} is two seats towards that person's ${direction.toLowerCase()}, so the relation is ${relationDisplay(answer).toLowerCase()}.`,
    };
  };

  const sequenceQuestion = (
    surfaceId: QuerySurfaceId,
    direction: "LEFT_TO_RIGHT" | "RIGHT_TO_LEFT",
    questionOrder: number,
  ): SeatingChildQuestion => {
    const answer = direction === "LEFT_TO_RIGHT"
      ? seatOrder.slice(0, 3)
      : [...seatOrder.slice(-3)].reverse();
    const reverse = [...answer].reverse();
    const shifted = direction === "LEFT_TO_RIGHT"
      ? seatOrder.slice(1, 4)
      : [...seatOrder.slice(-4, -1)].reverse();
    const otherEnd = direction === "LEFT_TO_RIGHT"
      ? [...seatOrder.slice(-3)].reverse()
      : seatOrder.slice(0, 3);
    const sequenceValues: SeatingSemanticValue[] = [];
    for (let start = 0; start <= seatOrder.length - 3; start += 1) {
      sequenceValues.push(seatOrder.slice(start, start + 3));
      sequenceValues.push([...seatOrder.slice(start, start + 3)].reverse());
    }
    const built = buildGenericOptions({
      answer,
      answerType: "SEQUENCE",
      persons: state.persons,
      seed: `${seed}:${surfaceId}:${questionOrder}`,
      traps: [
        {
          value: reverse,
          misconceptionId: "SEA-MC-LIN-MIRROR_POSITION",
          recomputation: { method: "REVERSE_SEQUENCE" },
          explanation: "This lists the same three persons in the reverse order.",
        },
        {
          value: shifted,
          misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT",
          recomputation: { method: "SKIP_FIRST_SEAT" },
          explanation: "This starts one seat too far into the row.",
        },
        {
          value: otherEnd,
          misconceptionId: "SEA-MC-LIN-MIRROR_POSITION",
          recomputation: { method: "USE_OPPOSITE_END" },
          explanation: "This reads the sequence from the opposite end.",
        },
      ],
      fallbackValues: sequenceValues,
    });
    return {
      questionOrder,
      queryContractId: "SEA-QC-020",
      answerType: "SEQUENCE",
      answerDeterminingFactFingerprint: surfaceFingerprint(surfaceId, `ORDER:${direction}:FIRST3`),
      text: direction === "LEFT_TO_RIGHT"
        ? "Which sequence shows the first three persons from the left end, in order?"
        : "Which sequence shows the first three persons from the right end, in order?",
      options: built.options,
      answerIndex: built.answerIndex,
      answer,
      explanation: `Reading from the ${direction === "LEFT_TO_RIGHT" ? "left" : "right"} end, the first three persons are ${answer.map((personId) => nameOf(personId as string, state.persons)).join(", ")}.`,
    };
  };

  const surfaces: SurfaceCandidate[] = [
    { surfaceId: "SEA-CP001-QS-001-LEFT-END", contractId: "SEA-QC-001", build: (order) => endQuestion("SEA-CP001-QS-001-LEFT-END", "LEFT", order) },
    { surfaceId: "SEA-CP001-QS-002-RIGHT-END", contractId: "SEA-QC-001", build: (order) => endQuestion("SEA-CP001-QS-002-RIGHT-END", "RIGHT", order) },
    { surfaceId: "SEA-CP001-QS-003-MIDDLE", contractId: "SEA-QC-001", build: (order) => middleQuestion(order) },
    { surfaceId: "SEA-CP001-QS-004-SECOND-LEFT", contractId: "SEA-QC-003", build: (order) => relativePersonQuestion("SEA-CP001-QS-004-SECOND-LEFT", "LEFT", order) },
    { surfaceId: "SEA-CP001-QS-005-SECOND-RIGHT", contractId: "SEA-QC-003", build: (order) => relativePersonQuestion("SEA-CP001-QS-005-SECOND-RIGHT", "RIGHT", order) },
    { surfaceId: "SEA-CP001-QS-006-COUNT-BETWEEN", contractId: "SEA-QC-008", build: (order) => countBetweenQuestion(order) },
    { surfaceId: "SEA-CP001-QS-007-END-PAIR", contractId: "SEA-QC-014", build: (order) => endPairQuestion(order) },
    { surfaceId: "SEA-CP001-QS-008-RELATIVE-PHRASE", contractId: "SEA-QC-015", build: (order) => relativePhraseQuestion(order) },
    { surfaceId: "SEA-CP001-QS-009-LEFT-TO-RIGHT-SEQUENCE", contractId: "SEA-QC-020", build: (order) => sequenceQuestion("SEA-CP001-QS-009-LEFT-TO-RIGHT-SEQUENCE", "LEFT_TO_RIGHT", order) },
    { surfaceId: "SEA-CP001-QS-010-RIGHT-TO-LEFT-SEQUENCE", contractId: "SEA-QC-020", build: (order) => sequenceQuestion("SEA-CP001-QS-010-RIGHT-TO-LEFT-SEQUENCE", "RIGHT_TO_LEFT", order) },
  ];

  const start = stableNumber(`${seed}:surface-start`) % surfaces.length;
  const rotated = [...surfaces.slice(start), ...surfaces.slice(0, start)];
  const selected: SurfaceCandidate[] = [];
  const usedContracts = new Set<SeatingQueryContractId>();
  for (const surface of rotated) {
    if (usedContracts.has(surface.contractId)) continue;
    selected.push(surface);
    usedContracts.add(surface.contractId);
    if (selected.length === 3) break;
  }
  if (selected.length !== 3 || usedContracts.size !== 3) throw new Error("Could not select three distinct CP-001 query contracts");

  const children = selected.map((surface, index) => surface.build(index + 1));
  if (new Set(children.map((child) => child.answerDeterminingFactFingerprint)).size !== children.length) {
    throw new Error("CP-001 query surface selection produced duplicate answer-determining facts");
  }
  return children;
}
